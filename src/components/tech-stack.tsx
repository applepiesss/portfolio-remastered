import React from "react";

import { TECH_STACK, type Tech } from "@/lib/tech-stack";

export const SWIRL = ["..XXXXX..", ".X.....X.", "X..XXX..X", "X.X...X.X", "X.X.X.X.X", "X.X.XX..X", "X..X...X.", ".X..XXX..", "..X......"];

// One layer per category, back to front: further layers are smaller, dimmer and slower, which gives the stack depth.
// size: logo size in rem, speed: seconds per loop, amp: wave height in px, cycles: wave crests per copy of the row
const LAYERS = [
  { label: "Tools", size: 2.4, opacity: 0.45, speed: 70, amp: 6, cycles: 2, reverse: true },
  { label: "Data & Infrastructure", size: 2.8, opacity: 0.6, speed: 55, amp: 8, cycles: 2, reverse: false },
  { label: "Frameworks", size: 3.2, opacity: 0.8, speed: 48, amp: 10, cycles: 2, reverse: true },
  { label: "Languages", size: 3.6, opacity: 1, speed: 40, amp: 12, cycles: 1, reverse: false },
];

// Repeat short rows so one copy is wider than the screen; the track then holds two copies and slides by half for a seamless loop
const MIN_PER_COPY = 12;
const WAVE_SECONDS = 3;

const WaveRow = ({ items, size, opacity, speed, amp, cycles, reverse }: { items: Tech[] } & Omit<(typeof LAYERS)[number], "label">) => {
  const copy = Array.from({ length: Math.ceil(MIN_PER_COPY / items.length) }, () => items).flat();
  return (
    <div className="wave-row pointer-events-none -my-3 overflow-x-clip py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className="wave-track flex w-max"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((dup) =>
          copy.map((tech, i) => (
            // Each logo bobs on the same sine, shifted by its place in the row, so the crests travel along it
            <div
              key={`${dup}-${i}`}
              className="wave-bob px-3"
              style={{ "--wave-amp": `${amp}px`, animationDelay: `${-((i * cycles) / copy.length) * WAVE_SECONDS}s` } as React.CSSProperties}
              aria-hidden={dup === 1 || undefined}
            >
              <div
                className="wave-logo group pointer-events-auto relative"
                tabIndex={dup === 0 ? 0 : -1}
                aria-label={dup === 0 ? tech.name : undefined}
              >
                <div
                  className="flex items-center justify-center rounded-full border border-white/15 bg-[#1b1b20] shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-[scale,border-color] duration-300 ease-out group-hover:scale-110 group-hover:border-brand/60 group-focus-visible:scale-110"
                  style={{ width: `${size}rem`, height: `${size}rem`, opacity }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[50%] text-brand" aria-hidden="true">
                    <path d={tech.icon.path} />
                  </svg>
                </div>
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {tech.name}
                </span>
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  );
};

/**
 * Tech stack as layered waves of logos, one layer per category, drifting sideways while they bob.
 * Hovering a logo pauses its layer, enlarges it and shows its name.
 * A plain category list sits below so the stack is readable at a glance.
 */
export const TechStack = () => (
  <div className="flex flex-col gap-10">
    <div className="-mx-6 md:-mx-14 lg:-mx-20">
      {LAYERS.map(({ label, ...layer }) => {
        const items = TECH_STACK.find((c) => c.label === label)?.items ?? [];
        return <WaveRow key={label} items={items} {...layer} />;
      })}
    </div>

    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
