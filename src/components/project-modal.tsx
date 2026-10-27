"use client";

import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import { PixelArt } from "@/components/pixel-art";
import { SWIRL } from "@/components/tech-stack";
import type { Point, Project } from "@/lib/projects";


// Pixel star shown before the award badge
const STAR = ["....X....", "....X....", "...XXX...", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", "..XX.XX..", ".XX...XX.", ".X.....X."];

const SUBHEADING ="mt-7 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40";
const LIST = "mt-3 space-y-2 text-sm leading-relaxed text-white/65 md:text-[15px]";
const BULLET = "relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-1.5";

// Plain text, or a bold lead-in followed by its explanation
const PointText = ({ item }: { item: string | Point }) =>
  typeof item === "string" ? (
    item
  ) : (
    <>
      <strong className="font-semibold text-white/90">{item.title}:</strong> {item.text}
    </>
  );

/**
 * Project detail pop-up: cover, meta, role, overview, highlights, detailed sections, my contributions and tech.
 * Closes on backdrop click, the ✕ button or Escape. Portaled to <body> because the cards use
 * backdrop-blur, which would otherwise trap `position: fixed` inside the card.
 */
export const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;

  const meta = [project.type, project.context].filter(Boolean).join(" · ");
  const overview = Array.isArray(project.overview) ? project.overview : [project.overview];

  return createPortal(
    <div
      data-no-theme-hold
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200 md:p-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-xl border border-white/10 bg-[#0f0f12] shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/60 p-2 text-white/70 transition-colors hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="relative aspect-video w-full">
          <Image src={project.image} alt={`${project.name} preview`} fill sizes="(min-width: 48rem) 48rem, 100vw" className="object-cover object-top" />
        </div>

        <div className="p-6 md:p-8">
          <p className="font-mono text-[11px] text-white/40">{meta}</p>
          <h3 className="mt-1.5 font-heading text-2xl font-semibold text-white md:text-3xl">{project.name}</h3>
          {project.role && (
            <p className="mt-2 text-sm text-white/70">
              <span className="font-semibold text-white">Role:</span> {project.role}
            </p>
          )}
          {project.award && (
            <p className="mt-2 flex items-center gap-2 text-sm text-brand">
              <PixelArt bitmap={STAR} className="size-3.5 shrink-0" />
              {project.award}
            </p>
          )}

          {/* Links in the theme color with an always-visible redirect icon; underline grows on hover */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Project", href: project.projectUrl },
              { label: "Demo", href: project.demoUrl },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1 text-sm font-medium text-brand"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover/link:bg-[length:100%_1px]">
                  {link.label}
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            ))}
          </div>

          <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-white/70">
            {overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h4 className={SUBHEADING}>Highlights</h4>
          <ul className={LIST}>
            {project.highlights.map((h) => (
              <li key={h} className={`${BULLET} before:bg-white/30`}>
                {h}
              </li>
            ))}
          </ul>

          {project.sections?.map((section) => (
            <section key={section.heading} className="mt-8">
              <h4 className="font-heading text-lg font-semibold text-white">{section.heading}</h4>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-2.5 text-sm leading-relaxed text-white/65 md:text-[15px]">
                  {paragraph}
                </p>
              ))}
              {section.points && (
                <ul className={LIST}>
                  {section.points.map((point) => (
                    <li key={point.title} className={`${BULLET} before:bg-white/30`}>
                      <PointText item={point} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contributions card: pixel swirl and numbered items */}
          <div className="relative mt-9 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
            <div className="relative flex items-center gap-2.5">
              <PixelArt bitmap={SWIRL} className="size-4 text-brand" />
              <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand">{project.contributionsLabel ?? "My contributions"}</h4>
            </div>
            <ol className="relative mt-5 grid gap-y-5">
              {project.contributions.map((c, i) => (
                <li key={typeof c === "string" ? c : c.title} className="flex gap-3">
                  <span className="pt-0.5 font-mono text-[11px] text-brand/70">{String(i + 1).padStart(2, "0")}</span>
                  {typeof c === "string" ? (
                    <p className="text-sm leading-relaxed text-white/65">{c}</p>
                  ) : (
                    <div>
                      <p className="font-heading text-sm font-semibold text-white">{c.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{c.text}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {project.tech && project.tech.length > 0 && (
            <>
              <h4 className={SUBHEADING}>Built with</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
