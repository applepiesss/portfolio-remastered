"use client";

import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { THEME_COLORS, THEMES, type PortfolioTheme } from "@/lib/themes";

const HOLD_MS = 650;
const POP_MS = 900;
const SPREAD_MS = 1400;
const MOVE_TOLERANCE = 12;
const BUBBLE_SIZE = 56;

// Water droplets flung out when the bubble pops; they arc outward, then fall
type Droplet = { dx: number; dy: number; size: number; delay: number };
// Tiny bubbles that drift up and away after the pop
type MiniBubble = { dx: number; rise: number; size: number; delay: number };
type Press = {
  x: number;
  y: number;
  color: string;
  key: number;
  phase: "holding" | "popping";
  droplets: Droplet[];
  minis: MiniBubble[];
};

const makeDroplets = (): Droplet[] =>
  Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const distance = BUBBLE_SIZE * 0.55 + Math.random() * 28;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 2.5 + Math.random() * 3,
      delay: Math.random() * 60,
    };
  });

const makeMinis = (): MiniBubble[] =>
  Array.from({ length: 5 }, () => ({
    dx: (Math.random() - 0.5) * 80,
    rise: 50 + Math.random() * 50,
    size: 6 + Math.random() * 7,
    delay: 40 + Math.random() * 160,
  }));

/**
 * Press and hold anywhere on the background (outside elements marked
 * `data-no-theme-hold`) to cycle the theme. A soap bubble grows under the pointer while holding,
 * pops into droplets and tiny bubbles, and the new theme spreads out from that point.
 */
export const ThemeHoldArea = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [press, setPress] = useState<Press | null>(null);
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);

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

    // A soft-edged circle (see ::view-transition-new in globals.css) grows from the pop point;
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
    setPress({ x, y, color: THEME_COLORS[next], key: e.timeStamp, phase: "holding", droplets: [], minis: [] });
    timer.current = window.setTimeout(() => {
      timer.current = null;
      origin.current = null;
      busy.current = true;
      flushSync(() => setPress((p) => p && { ...p, phase: "popping", droplets: makeDroplets(), minis: makeMinis() }));
      spreadTheme(next, x, y);
      window.setTimeout(() => {
        setPress(null);
        busy.current = false;
      }, Math.max(POP_MS, SPREAD_MS));
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

      {/* Own view-transition layer so the bubble and droplets stay visible above the spreading theme */}
      <div className="theme-burst-layer" aria-hidden="true">
        {press && (
          <div
            key={press.key}
            className={`theme-burst ${press.phase === "popping" ? "is-popping" : ""}`}
            style={{ left: press.x, top: press.y, color: press.color, "--hold-ms": `${HOLD_MS}ms`, "--pop-ms": `${POP_MS}ms`, "--bubble": `${BUBBLE_SIZE}px` } as React.CSSProperties}
          >
            <span className="theme-bubble">
              <span className="theme-bubble-film" />
            </span>

            {press.phase === "popping" && <span className="theme-bubble-ring" />}

            {press.droplets.map((d, i) => (
              <span
                key={`d${i}`}
                className="theme-bubble-drop"
                style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px`, "--s": `${d.size}px`, animationDelay: `${d.delay}ms` } as React.CSSProperties}
              />
            ))}

            {press.minis.map((m, i) => (
              <span
                key={`m${i}`}
                className="theme-bubble-mini"
                style={{ "--dx": `${m.dx}px`, "--rise": `${m.rise}px`, "--s": `${m.size}px`, animationDelay: `${m.delay}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
