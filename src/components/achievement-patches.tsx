"use client";

import React, { useState } from "react";

import { Lightbox } from "@/components/image-preview";
import { PixelArt, type Bitmap } from "@/components/pixel-art";

export type Achievement = {
  /** Competition results get a trophy, course certificates a medal */
  kind: "achievement" | "certificate";
  status: string;
  event: string;
  organizer: string;
  date: string;
  certificate: string;
  /** Issuer's verification page, shown as "View credential" under the certificate */
  credentialUrl?: string;
  /** Resting tilt in degrees, so the patches look sewn on by hand */
  tilt: number;
};

const TROPHY: Bitmap = ["XXXXXXXXX", "X.XXXXX.X", "X.XXXXX.X", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X....", "...XXX...", "..XXXXX.."];
const MEDAL: Bitmap = ["XX.....XX", ".XX...XX.", "..XX.XX..", "..XXXXX..", ".XXXXXXX.", "XXXX.XXXX", "XXX...XXX", "XXXX.XXXX", ".XXXXXXX.", "..XXXXX.."];

// Dark fabric with a faint diagonal twill weave
const FABRIC = "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.03) 0 2px, transparent 2px 4px), #1b1b20";

const Patch = ({ item, round }: { item: Achievement; round: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${item.event} certificate`}
        className="achievement-patch cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        style={{ "--tilt": `${item.tilt}deg` } as React.CSSProperties}
      >
        <span
          className={`relative flex flex-col items-center justify-center text-center ${round ? "size-44 rounded-full px-7" : "h-40 w-52 rounded-[22px] px-6"}`}
          // Thick merrowed edge in the theme color, a dark gap, then the fabric
          style={{ background: FABRIC, border: "5px solid var(--theme-line)", boxShadow: "inset 0 0 0 3px #121216" }}
        >
          {/* Running stitch just inside the edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[7px] rounded-[inherit] border-2 border-dashed"
            style={{ borderColor: "color-mix(in srgb, var(--theme-line) 55%, transparent)" }}
          />
          <PixelArt bitmap={item.kind === "achievement" ? TROPHY : MEDAL} className="w-6 text-(--theme-line)" />
          <span className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-(--theme-line)">{item.status}</span>
          {/* Raised thread look: a tiny dark shadow under the lettering */}
          <span className="mt-1 font-heading text-[13px] font-bold leading-tight text-white/90 [text-shadow:0_1px_0_rgb(0_0_0/0.7)]">
            {item.event}
          </span>
          <span className="mt-1 line-clamp-2 font-mono text-[8.5px] leading-snug text-white/45">{item.organizer}</span>
          <span className="mt-1 font-mono text-[9px] text-white/60">{item.date}</span>
        </span>
      </button>
      <Lightbox
        src={item.certificate}
        alt={`${item.status} certificate for ${item.event}`}
        open={open}
        onClose={() => setOpen(false)}
        credentialHref={item.credentialUrl}
      />
    </>
  );
};

/**
 * Achievements and certificates as embroidered patches, round and rounded-square in turn, each
 * sewn on at its own angle. Hovering lifts a patch and straightens it; clicking opens the
 * certificate with a link to the issuer's verification page.
 */
export const AchievementPatches = ({ items }: { items: Achievement[] }) => (
  <div>
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 md:gap-x-10">
      {items.map((item, i) => (
        <Patch key={item.event} item={item} round={i % 2 === 0} />
      ))}
    </div>
    <p className="mt-8 text-center font-mono text-[11px] text-white/35">click a patch to see the certificate</p>
  </div>
);
