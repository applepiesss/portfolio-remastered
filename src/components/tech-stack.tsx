import React from "react";

import { PixelArt } from "@/components/pixel-art";
import { TECH_STACK, type Tech } from "@/lib/tech-stack";

const SWIRL = ["..XXXXX..", ".X.....X.", "X..XXX..X", "X.X...X.X", "X.X.X.X.X", "X.X.XX..X", "X..X...X.", ".X..XXX..", "..X......"];

// Inner ring: languages; outer ring: everything else. Radii are in container-width units (cqw).
const INNER = TECH_STACK.find((c) => c.label === "Languages")?.items ?? [];
const OUTER = TECH_STACK.filter((c) => c.label !== "Languages").flatMap((c) => c.items);

const Ring = ({ items, radius, duration, reverse }: { items: Tech[]; radius: number; duration: number; reverse?: boolean }) => (
  <>
    {/* Orbit path */}
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
      style={{ width: `${radius * 2}cqw`, height: `${radius * 2}cqw` }}
    />
    {/* Spinning layer (click-through, so the outer ring doesn't block the inner one); each logo counter-spins to stay upright */}
    <div
      className="orbit-ring pointer-events-none absolute inset-0"
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}
    >
      {items.map((tech, i) => {
        const angle = (i / items.length) * 360;
        return (
          <div
            key={tech.name}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(${radius}cqw) rotate(${-angle}deg)` }}
          >
            <div
              className="orbit-counter"
              style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "normal" : "reverse" } as React.CSSProperties}
            >
              <div className="orbit-logo group pointer-events-auto relative -translate-x-1/2 -translate-y-1/2" tabIndex={0} aria-label={tech.name}>
                <div className="flex size-[11cqw] min-h-10 min-w-10 items-center justify-center rounded-full border border-white/15 bg-[#1b1b20] shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-[transform,border-color] duration-200 group-hover:scale-125 group-hover:border-brand/60 group-focus-visible:scale-125">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[50%] text-brand" aria-hidden="true">
                    <path d={tech.icon.path} />
                  </svg>
                </div>
                <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {tech.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

/**
 * Tech stack as two counter-rotating orbits of logos around a pixel swirl.
 * Hovering the orbit pauses it; hovering a logo enlarges it and shows its name.
 * A plain category list sits next to it so the stack is readable at a glance.
 */
export const TechStack = () => (
  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
    <div className="orbit @container relative mx-auto aspect-square w-full max-w-[26rem]">
      <Ring items={INNER} radius={25} duration={40} />
      <Ring items={OUTER} radius={44} duration={60} reverse />
      <PixelArt
        bitmap={SWIRL}
        className="absolute left-1/2 top-1/2 w-[13cqw] -translate-x-1/2 -translate-y-1/2 text-brand"
      />
    </div>

    <dl className="flex flex-col gap-5">
      {TECH_STACK.map((category) => (
        <div key={category.label}>
          <dt className="mb-1.5 font-mono text-[11px] text-white/35">{category.label}</dt>
          <dd className="text-sm md:text-[15px] leading-relaxed text-white/70">
            {category.items.map((t) => t.name).join(" · ")}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
