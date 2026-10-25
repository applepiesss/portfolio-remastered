"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useSyncExternalStore } from "react";

import { Lightbox } from "@/components/image-preview";
import type { Project } from "@/lib/projects";

// 2 cards per view from md up, 1 on phones (matches the md:--per-view rule below)
const MD_QUERY = "(min-width: 48rem)";
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(MD_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const usePerView = () =>
  useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(MD_QUERY).matches ? 2 : 1),
    () => 2,
  );

const SWIPE_PX = 40;

/**
 * Projects carousel: up to 2 cards in view, ← / → buttons to step one card at a time,
 * dots showing (and jumping to) the current position, and swipe on touch screens.
 */
export const ProjectCarousel = ({ projects }: { projects: Project[] }) => {
  const perView = usePerView();
  const positions = Math.max(1, projects.length - perView + 1);
  const [rawIndex, setIndex] = useState(0);
  // Clamp so switching from 1 to 2 per view never leaves an empty slot at the end
  const index = Math.min(rawIndex, positions - 1);
  const [preview, setPreview] = useState<Project | null>(null);
  const swipeStart = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.max(0, Math.min(positions - 1, next)));

  return (
    <div>
      <div
        className="overflow-hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          className="project-track flex gap-[var(--gap)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ "--i": index } as React.CSSProperties}
        >
          {projects.map((project, i) => (
            <article
              key={project.name}
              className="project-card group shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-brand/40"
              aria-hidden={i < index || i >= index + perView}
            >
              <button
                type="button"
                onClick={() => setPreview(project)}
                className="relative block aspect-video w-full overflow-hidden cursor-zoom-in"
                aria-label={`View ${project.name} screenshot`}
                tabIndex={i < index || i >= index + perView ? -1 : 0}
              >
                <Image
                  src={project.image}
                  alt={`${project.name} preview`}
                  fill
                  sizes="(min-width: 48rem) 40vw, 90vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </button>
              <div className="p-5 md:p-6">
                <p className="font-mono text-[11px] text-white/35">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-heading text-lg md:text-xl font-semibold text-white">{project.name}</h3>
                <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-white/60">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls: ← dots → */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous project"
          className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: positions }, (_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-label={`Go to position ${p + 1}`}
              aria-current={p === index}
              className={`h-2 rounded-full transition-all duration-300 ${p === index ? "w-6 bg-brand" : "w-2 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === positions - 1}
          aria-label="Next project"
          className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      <Lightbox
        src={preview?.image ?? ""}
        alt={preview ? `${preview.name} preview` : ""}
        open={preview !== null}
        onClose={() => setPreview(null)}
      />
    </div>
  );
};
