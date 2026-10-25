"use client";

import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { PixelArt, type Bitmap } from "@/components/pixel-art";
import { THEME_COLORS, THEMES, type PortfolioTheme } from "@/lib/themes";

const HOLD_MS = 600;
const BURST_MS = 900;
const SPREAD_MS = 1400;
const MOVE_TOLERANCE = 12;

// Hold shapes, used in this order on successive holds
const SHAPES = {
  heart: [
    ".XX...XX.",
    "XXXX.XXXX",
    "XXXXXXXXX",
    "XXXXXXXXX",
    ".XXXXXXX.",
    "..XXXXX..",
    "...XXX...",
    "....X....",
  ],
  star: [
    "....X....",
    "....X....",
    "...XXX...",
    "XXXXXXXXX",
    ".XXXXXXX.",
    "..XXXXX..",
    "..XXXXX..",
    ".XX...XX.",
    ".X.....X.",
  ],
  // Two hollow loops with long trailing ribbons
  bow: [
    ".XXX.....XXX.",
    "X...X...X...X",
    "X....XXX....X",
    "X...XXXXX...X",
    ".XXX.XXX.XXX.",
    "....XX.XX....",
    "....XX.XX....",
    "...XX...XX...",
    "...XX...XX...",
    "..XX.....XX..",
    "..XX.....XX..",
  ],
};
// Particle-sized versions of each shape
const MINI: Record<keyof typeof SHAPES, string[]> = {
  heart: ["XX.XX", "XXXXX", ".XXX.", "..X.."],
  star: ["..X..", "XXXXX", ".XXX.", ".X.X."],
  bow: ["XX.XX", "X.X.X", "XX.XX", ".X.X."],
};
const SHAPE_ORDER = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
const SPARKLE = [".X.", "XXX", ".X."];
const PIXEL = ["X"];

const HOLD_CELL = 2.5;

type ShapeName = keyof typeof SHAPES;

// Centered on the press point; pixels light up from the bottom row to the top over HOLD_MS
const HoldShape = ({ bitmap, burst }: { bitmap: Bitmap; burst: boolean }) => {
  const w = bitmap[0].length * HOLD_CELL;
  const h = bitmap.length * HOLD_CELL;
  return (
    <span className="theme-hold-shape-wrap" style={{ left: -w / 2, top: -h / 2, width: w, height: h }}>
      <PixelArt
        bitmap={bitmap}
        className={`theme-hold-shape ${burst ? "is-burst" : ""}`}
        pixelClassName="theme-hold-pixel"
        rowDelay={(row) => ((bitmap.length - 1 - row) / bitmap.length) * HOLD_MS}
      />
    </span>
  );
};

type Particle = { bitmap: Bitmap; cell: number; dx: number; dy: number; delay: number };
type Press = { x: number; y: number; color: string; key: number; shape: ShapeName; phase: "holding" | "burst"; particles: Particle[] };

// Mix of single pixels, little "+" sparkles and mini versions of the held shape
const makeParticles = (shape: ShapeName): Particle[] =>
  Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 50 + Math.random() * 45;
    const kind = i % 4;
    return {
      bitmap: kind === 0 ? MINI[shape] : kind === 2 ? SPARKLE : PIXEL,
      cell: kind === 0 || kind === 2 ? 1.75 : 2 + Math.round(Math.random()),
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      delay: Math.random() * 80,
    };
  });

/**
 * Press and hold anywhere on the background (outside elements marked
 * `data-no-theme-hold`) to cycle the theme. A pixel shape lights up row by row
 * while holding, bursts into pixel sparkles, and the new theme spreads out from that point.
 */
export const ThemeHoldArea = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [press, setPress] = useState<Press | null>(null);
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);
  // Cycles through SHAPE_ORDER on each hold
  const holdCount = useRef(0);

  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    if (origin.current) setPress(null);
    origin.current = null;
  };

  const spreadTheme = (next: PortfolioTheme, x: number, y: number) => {
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    // A soft-edged circle (see ::view-transition-new in globals.css) grows from the burst point;
    // its solid core is 70% of the mask size, so the mask must be large enough for that core to cover the far corner
    const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const end = (reach / 0.7) * 2;
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          maskSize: ["0px 0px", `${end}px ${end}px`],
          maskPosition: [`${x}px ${y}px`, `${x - end / 2}px ${y - end / 2}px`],
        },
        { duration: SPREAD_MS, easing: "cubic-bezier(0.55, 0, 0.25, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || busy.current) return;
    if ((e.target as Element).closest("[data-no-theme-hold]")) return;
    e.preventDefault();

    const current = THEMES.indexOf(document.documentElement.dataset.theme as PortfolioTheme);
    const next = THEMES[(current + 1) % THEMES.length];
    const { clientX: x, clientY: y } = e;

    origin.current = { x, y };
    const shape = SHAPE_ORDER[holdCount.current++ % SHAPE_ORDER.length];
    setPress({ x, y, color: THEME_COLORS[next], key: e.timeStamp, shape, phase: "holding", particles: [] });
    timer.current = window.setTimeout(() => {
      timer.current = null;
      origin.current = null;
      busy.current = true;
      flushSync(() => setPress((p) => p && { ...p, phase: "burst", particles: makeParticles(p.shape) }));
      spreadTheme(next, x, y);
      window.setTimeout(() => {
        setPress(null);
        busy.current = false;
      }, Math.max(BURST_MS, SPREAD_MS));
    }, HOLD_MS);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!origin.current) return;
    if (Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > MOVE_TOLERANCE) cancel();
  };

  return (
    <section
      className={`theme-hold-area ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => {
        if (!(e.target as Element).closest("[data-no-theme-hold]")) e.preventDefault();
      }}
    >
      {children}

      {/* Own view-transition layer so the heart and sparkles stay visible above the spreading theme */}
      <div className="theme-burst-layer" aria-hidden="true">
        {press && (
          <div
            key={press.key}
            className="theme-burst"
            style={{ left: press.x, top: press.y, color: press.color, "--hold-ms": `${HOLD_MS}ms`, "--burst-ms": `${BURST_MS}ms` } as React.CSSProperties}
          >
            <HoldShape bitmap={SHAPES[press.shape]} burst={press.phase === "burst"} />

            {press.particles.map((p, i) => (
              <span
                key={i}
                className="theme-burst-particle"
                style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--w": `${p.bitmap[0].length * p.cell}px`, "--h": `${p.bitmap.length * p.cell}px`, animationDelay: `${p.delay}ms` } as React.CSSProperties}
              >
                <PixelArt bitmap={p.bitmap} className="block size-full" />
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
