"use client";

import React, { useState } from "react";

import { Lightbox } from "@/components/image-preview";
import { PixelArt, type Bitmap } from "@/components/pixel-art";

const TROPHY: Bitmap = [
  "XXXXXXXXX",
  "X.XXXXX.X",
  "X.XXXXX.X",
  ".XXXXXXX.",
  "..XXXXX..",
  "...XXX...",
  "....X....",
  "...XXX...",
  "..XXXXX..",
];

const STAR: Bitmap = [
  "....X....",
  "....X....",
  "...XXX...",
  "XXXXXXXXX",
  ".XXXXXXX.",
  "..XXXXX..",
  "..XXXXX..",
  ".XX...XX.",
  ".X.....X.",
];

// Small pixel stickers scattered on the sheet as decoration
const DECOR: { bitmap: Bitmap; className: string }[] = [
  { bitmap: [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."], className: "left-[6%] bottom-[14%] w-7 -rotate-12" },
  { bitmap: STAR, className: "right-[8%] top-[12%] w-6 rotate-12" },
  {
    bitmap: ["..XXXXX..", ".X.....X.", "X..XXX..X", "X.X...X.X", "X.X.X.X.X", "X.X.XX..X", "X..X...X.", ".X..XXX..", "..X......"],
    className: "right-[12%] bottom-[10%] w-7 rotate-6",
  },
];

export type Sticker = {
  status: string;
  event: string;
  organizer: string;
  date: string;
  certificate: string;
  /** Resting tilt in degrees, so stickers look hand-placed */
  tilt: number;
};

const PEEL_MS = 380;

const StickerItem = ({ sticker }: { sticker: Sticker }) => {
  const [peeling, setPeeling] = useState(false);
  const [open, setOpen] = useState(false);

  const peel = () => {
    if (peeling) return;
    setPeeling(true);
    window.setTimeout(() => setOpen(true), PEEL_MS);
  };

  const close = () => {
    setOpen(false);
    setPeeling(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={peel}
        aria-label={`View ${sticker.event} certificate`}
        className={`sticker group relative w-56 text-left cursor-pointer outline-none ${peeling ? "is-peeling" : ""}`}
        style={{ "--tilt": `${sticker.tilt}deg` } as React.CSSProperties}
      >
        {/* Sticker body: white die-cut border around a theme-colored face */}
        <span className="sticker-body block rounded-2xl border-[5px] border-white bg-brand p-4 text-[#1a1020]">
          <span className="flex items-center justify-between">
            <PixelArt bitmap={TROPHY} className="w-7" />
            <span className="rounded-full bg-[#1a1020] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-brand">
              {sticker.status}
            </span>
          </span>
          <span className="mt-3 block font-heading text-lg font-extrabold leading-tight">{sticker.event}</span>
          <span className="mt-1 block font-mono text-[10px] leading-snug opacity-70">
            {sticker.organizer}
            <br />
            {sticker.date}
          </span>
        </span>

        {/* Curled-up corner, revealed on hover */}
        <span className="sticker-curl" aria-hidden="true" />
      </button>

      <Lightbox src={sticker.certificate} alt={`${sticker.status} certificate — ${sticker.event}`} open={open} onClose={close} />
    </>
  );
};

/**
 * Achievements as stickers on a dotted sheet. Hovering lifts a corner;
 * clicking peels the sticker off and shows the certificate underneath in a lightbox.
 */
export const StickerSheet = ({ stickers }: { stickers: Sticker[] }) => (
  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111114] [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:14px_14px] px-6 py-12 md:px-10 md:py-14">
    <p className="absolute left-4 top-3 font-mono text-[10px] text-white/25">peel to view</p>

    {DECOR.map((d, i) => (
      <PixelArt key={i} bitmap={d.bitmap} className={`sticker-decor absolute text-brand ${d.className}`} />
    ))}

    <div className="relative flex flex-wrap items-center justify-center gap-10 md:gap-14">
      {stickers.map((s) => (
        <StickerItem key={s.event} sticker={s} />
      ))}
    </div>
  </div>
);
