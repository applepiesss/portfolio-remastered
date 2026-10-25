"use client";

import React, { useState } from "react";

import { ImagePreview } from "@/components/image-preview";
import { PixelArt } from "@/components/pixel-art";

// Pixel swirl (꩜) used as the wax seal
const SEAL = [
  "..XXXXX..",
  ".X.....X.",
  "X..XXX..X",
  "X.X...X.X",
  "X.X.X.X.X",
  "X.X.XX..X",
  "X..X...X.",
  ".X..XXX..",
  "..X......",
];

// Fixed burst directions (deterministic, so server and client render the same markup)
const SEAL_PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const distance = 26 + (i % 3) * 10;
  return { dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance, size: i % 2 ? 3 : 4 };
});

// Envelope geometry in a 100 x 62.5 box (16:10); the flap's tip sits at y = 34
const FLAP_TIP = 34;
const HEIGHT = 62.5;

// The paper is a landscape crop (√2 : 1) of the image, anchored to its top
const PAPER_CROP = "aspect-[1.414] object-cover object-top";

type EnvelopeProps = {
  /** Image slid out of the envelope; opens full size in a lightbox */
  src: string;
  alt: string;
  /** Short name used in accessible labels */
  name: string;
  /** Address block on the front: small "to:" line, title and subtitle */
  to: string;
  title: string;
  subtitle?: string;
  badge?: string;
  /** If set, the lightbox gets a download button for this file */
  downloadHref?: string;
  /** Optional download prompt under the enlarged paper */
  downloadPrompt?: string;
};

/**
 * A sealed envelope. Clicking it breaks the pixel-swirl seal, opens the flap and
 * lets the paper peek out; clicking the paper opens it in a lightbox.
 */
export const Envelope = ({ src, alt, name, to, title, subtitle, badge, downloadHref, downloadPrompt }: EnvelopeProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={open ? `Close ${name} envelope` : `Open ${name} envelope`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="group relative aspect-[16/10] cursor-pointer select-none [perspective:900px] outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-lg"
      >
        {/* Back of the envelope */}
        <div className="absolute inset-0 rounded-lg bg-[#121215] border border-white/10 transition-colors duration-300 group-hover:border-brand/40" />

        {/* Paper: hidden inside until opened, then peeks out of the top; clicking it opens the lightbox */}
        <div
          className="absolute left-[10%] right-[10%] top-[4%] transition-transform duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
          style={{
            zIndex: 10,
            transform: open ? "translateY(-38%)" : undefined,
            transitionDelay: open ? "250ms" : "0ms",
          }}
          onClick={(e) => open && e.stopPropagation()}
        >
          {open ? (
            <ImagePreview src={src} alt={alt} thumbClassName={PAPER_CROP} downloadHref={downloadHref} downloadPrompt={downloadPrompt} />
          ) : (
            <img src={src} alt="" className={`w-full rounded-md border border-white/10 ${PAPER_CROP}`} />
          )}
        </div>

        {/* Front pocket (covers everything below the flap's V). The <svg> box itself ignores the pointer so
            clicks in the open V reach the paper; only the painted pocket shape is clickable */}
        <svg viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio="none" className="absolute inset-0 size-full z-20 overflow-visible pointer-events-none">
          <path d={`M0,0 L50,${FLAP_TIP} L100,0 L100,${HEIGHT} L0,${HEIGHT} Z`} fill="#17171b" className="pointer-events-auto" />
          <path d={`M0,${HEIGHT} L42,${FLAP_TIP - 4} M100,${HEIGHT} L58,${FLAP_TIP - 4}`} fill="none" stroke="rgba(255,255,255,0.06)" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Flap: folds up and drops behind the paper when opened */}
        <svg
          viewBox={`0 0 100 ${FLAP_TIP}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 w-full origin-top transition-transform duration-500 ease-in-out pointer-events-none"
          style={{
            height: `${(FLAP_TIP / HEIGHT) * 100}%`,
            transform: open ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: open ? 5 : 30,
            transitionProperty: "transform, z-index",
            transitionDelay: open ? "0ms, 250ms" : "250ms, 250ms",
          }}
        >
          <path d={`M0,0 L100,0 L50,${FLAP_TIP} Z`} fill="#1c1c21" stroke="rgba(255,255,255,0.1)" vectorEffect="non-scaling-stroke" className="pointer-events-auto" />
        </svg>

        {/* Pixel-swirl seal, bursts into pixels on open */}
        <div className="absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ top: `${(FLAP_TIP / HEIGHT) * 100}%` }}>
          <PixelArt
            bitmap={SEAL}
            className={`w-7 text-brand transition-all duration-200 ${open ? "scale-150 opacity-0" : "group-hover:animate-[envelope-wiggle_400ms_steps(4)_infinite]"}`}
          />
          {open && (
            <span className="absolute left-1/2 top-1/2">
              {SEAL_PARTICLES.map((p, i) => (
                <span
                  key={i}
                  className="theme-burst-particle bg-brand"
                  style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--w": `${p.size}px`, "--h": `${p.size}px`, "--burst-ms": "600ms" } as React.CSSProperties}
                />
              ))}
            </span>
          )}
        </div>

        {/* Address label */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 p-4 md:p-5 font-mono text-[11px] leading-relaxed pointer-events-none">
          <div className="min-w-0">
            <p className="text-white/35">to: {to}</p>
            <p className="text-white/80 truncate">{title}</p>
            {subtitle && <p className="text-white/40 truncate">{subtitle}</p>}
          </div>
          {badge && (
            <span className="shrink-0 rounded border border-brand/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand">{badge}</span>
          )}
        </div>
      </div>
    </div>
  );
};
