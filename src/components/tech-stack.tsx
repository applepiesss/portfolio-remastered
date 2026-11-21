import React from "react";

import { TECH_STACK } from "@/lib/tech-stack";

export const SWIRL = ["..XXXXX..", ".X.....X.", "X..XXX..X", "X.X...X.X", "X.X.X.X.X", "X.X.XX..X", "X..X...X.", ".X..XXX..", "..X......"];

// Repeat short categories so one copy of a row is wider than its column; the track holds two
// copies and slides by half, which makes the loop seamless
const MIN_PER_COPY = 12;
// Seconds per item, so every row moves at about the same calm speed whatever its length
const SECONDS_PER_ITEM = 3.2;

/**
 * Tech stack laid out like the Experience section, with each category's technologies drifting
 * past as a slow ticker (rows alternate direction). Logos stay monochrome; hovering a row pauses
 * it, and hovering a technology lights its logo in the theme color.
 */
export const TechStack = () => (
  <dl className="flex flex-col divide-y divide-white/[0.06]">
    {TECH_STACK.map((category, row) => {
      const copy = Array.from({ length: Math.ceil(MIN_PER_COPY / category.items.length) }, () => category.items).flat();
      return (
        <div
          key={category.label}
          className="group/row grid grid-cols-1 items-center gap-3 py-6 first:pt-0 last:pb-0 lg:grid-cols-[180px_1fr] lg:gap-8"
        >
          <dt className="font-mono text-xs text-white/40">{category.label}</dt>
          {/* Screen readers get the plain list; the moving copies are decoration */}
          <dd className="sr-only">{category.items.map((tech) => tech.name).join(", ")}</dd>
          <dd
            aria-hidden="true"
            className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          >
            <ul
              className="tech-ticker flex w-max"
              style={{
                animationDuration: `${copy.length * SECONDS_PER_ITEM}s`,
                animationDirection: row % 2 ? "reverse" : "normal",
              }}
            >
              {[0, 1].map((dup) =>
                copy.map((tech, i) => (
                  <li
                    key={`${dup}-${i}`}
                    className="group/tech flex shrink-0 items-center gap-2 pr-8 text-sm text-white/65 transition-colors duration-200 hover:text-white md:text-[15px]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 shrink-0 text-white/35 transition-colors duration-200 group-hover/tech:text-brand"
                    >
                      <path d={tech.icon.path} />
                    </svg>
                    {tech.name}
                  </li>
                )),
              )}
            </ul>
          </dd>
        </div>
      );
    })}
  </dl>
);
