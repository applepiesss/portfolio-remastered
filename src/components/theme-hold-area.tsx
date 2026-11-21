"use client";

import React, { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { THEME_COLORS, THEMES, type PortfolioTheme } from "@/lib/themes";

const HOLD_MS = 650;
const POP_MS = 900;
const SPREAD_MS = 1400;
const MOVE_TOLERANCE = 12;

// Dotted bubble: 3px squares like the background grid, spaced around a circle that grows while holding
const BUBBLE_RADIUS = 18;
// Keeps the dots about 8px apart around the outline, like the background grid
const DOTS = 14;
// A short arc of dots inside the upper left, so the ring reads as a bubble rather than a hoop
const SHINE = [
  { angle: 200, radius: 0.62 },
  { angle: 218, radius: 0.66 },
  { angle: 236, radius: 0.62 },
];

type Dot = { angle: number; fly: number; delay: number };

// Each dot of the outline flies a different distance when the bubble pops, so it reads as a burst
const makeDots = (): Dot[] =>
  Array.from({ length: DOTS }, (_, i) => ({
    angle: (i / DOTS) * 360,
    fly: 18 + Math.random() * 30,
    delay: Math.random() * 60,
  }));

type Press = { x: number; y: number; color: string; key: number; phase: "holding" | "popping"; dots: Dot[] };

/**
 * Press and hold anywhere on the background (outside elements marked
 * `data-no-theme-hold`) to cycle the theme. A bubble outlined in dots grows and wobbles under the
 * pointer while holding, then pops: its dots burst outward and fade as the new theme spreads from that point.
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
    setPress({ x, y, color: THEME_COLORS[next], key: e.timeStamp, phase: "holding", dots: makeDots() });
    timer.current = window.setTimeout(() => {
      timer.current = null;
      origin.current = null;
      busy.current = true;
      flushSync(() => setPress((p) => p && { ...p, phase: "popping" }));
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

      {/* Own view-transition layer so the bubble stays visible above the spreading theme */}
      <div className="theme-burst-layer" aria-hidden="true">
        {press && (
          <div
            key={press.key}
            className={`theme-burst ${press.phase === "popping" ? "is-popping" : ""}`}
            style={{ left: press.x, top: press.y, color: press.color, "--hold-ms": `${HOLD_MS}ms`, "--pop-ms": `${POP_MS}ms` } as React.CSSProperties}
          >
            <div className="theme-dot-bubble" style={{ "--bubble-max": `${BUBBLE_RADIUS}px` } as React.CSSProperties}>
              {press.dots.map((dot, i) => (
                <span
                  key={i}
                  className="theme-dot"
                  style={
                    {
                      "--angle": `${dot.angle}deg`,
                      "--fly": `${dot.fly}px`,
                      // Wobble delay follows the angle, so a gentle wave runs around the outline
                      "--wobble-delay": `${-(dot.angle / 360) * 900}ms`,
                      "--pop-delay": `${dot.delay}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
              {SHINE.map((shine, i) => (
                <span
                  key={`s${i}`}
                  className="theme-dot is-shine"
                  style={{ "--angle": `${shine.angle}deg`, "--shine": shine.radius, "--fly": "10px", "--pop-delay": "0ms" } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
