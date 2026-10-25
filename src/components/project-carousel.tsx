"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useSyncExternalStore } from "react";

import { ProjectModal } from "@/components/project-modal";
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

// Drag past this fraction of a card to move to the next one
const SNAP_THRESHOLD = 0.2;
// Movement (px) before a press counts as a drag rather than a click on the cover
const DRAG_START_PX = 6;

/**
 * Projects carousel: up to 2 cards in view. The track can be dragged with the mouse or a finger
 * (it follows the pointer, then snaps to the nearest card), and ← / → buttons and dots also navigate.
 */
export const ProjectCarousel = ({ projects }: { projects: Project[] }) => {
  const perView = usePerView();
  const positions = Math.max(1, projects.length - perView + 1);
  const [rawIndex, setIndex] = useState(0);
  // Clamp so switching from 1 to 2 per view never leaves an empty slot at the end
  const index = Math.min(rawIndex, positions - 1);
  const [preview, setPreview] = useState<Project | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; dx: number; active: boolean; pointerId: number } | null>(null);
  // Set when a press turned into a drag, so the click that ends it doesn't open the lightbox
  const suppressClick = useRef(false);

  const go = (next: number) => setIndex(Math.max(0, Math.min(positions - 1, next)));

  const setDragOffset = (px: number) => trackRef.current?.style.setProperty("--drag", `${px}px`);

  // Width of one step (card + gap), measured from the first card
  const stepWidth = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 1;
    return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, dx: 0, active: false, pointerId: e.pointerId };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    let dx = e.clientX - d.startX;
    if (!d.active) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      trackRef.current?.classList.add("is-dragging");
    }
    // Rubber-band at the ends
    if ((index === 0 && dx > 0) || (index === positions - 1 && dx < 0)) dx *= 0.3;
    d.dx = dx;
    setDragOffset(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.pointerId !== e.pointerId || !d.active) return;
    suppressClick.current = true;
    trackRef.current?.classList.remove("is-dragging");
    setDragOffset(0);
    const steps = d.dx / stepWidth();
    // Snap: round to the nearest card, but a small flick past the threshold still moves one
    const move = Math.abs(steps) < SNAP_THRESHOLD ? 0 : steps < 0 ? Math.max(1, Math.round(-steps)) : -Math.max(1, Math.round(steps));
    go(index + move);
  };

  return (
    <div>
      <div
        className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        <div
          ref={trackRef}
          className="project-track flex gap-[var(--gap)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ "--i": index } as React.CSSProperties}
        >
          {projects.map((project, i) => (
            <article
              key={project.name}
              className="project-card group shrink-0"
              aria-hidden={i < index || i >= index + perView}
            >
              <button
                type="button"
                onClick={() => setPreview(project)}
                className="block w-full cursor-pointer text-left"
                aria-label={`Open ${project.name} details`}
                tabIndex={i < index || i >= index + perView ? -1 : 0}
              >
                <span className="relative block aspect-video w-full overflow-hidden rounded-lg ring-1 ring-white/10">
                  <Image
                    src={project.image}
                    alt={`${project.name} preview`}
                    fill
                    sizes="(min-width: 48rem) 40vw, 90vw"
                    draggable={false}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-4 block">
                  <span className="block font-heading text-lg font-semibold text-white md:text-xl">{project.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60 md:text-[15px]">{project.description}</span>
                </span>
              </button>
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

      <ProjectModal project={preview} onClose={() => setPreview(null)} />
    </div>
  );
};
