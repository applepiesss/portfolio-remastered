"use client";

import React, { useRef, useState } from "react";

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

const MEDAL: Bitmap = [
  "XX.....XX",
  ".XX...XX.",
  "..XX.XX..",
  "..XXXXX..",
  ".XXXXXXX.",
  "XXXX.XXXX",
  "XXX...XXX",
  "XXXX.XXXX",
  ".XXXXXXX.",
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

// Small pixel stickers on the sheet that visitors can drag around.
// Positions are percentages of the sheet (top-left of the decor), so they scale with it.
const DECOR: { name: string; bitmap: Bitmap; size: string; rotate: number; x: number; y: number }[] = [
  { name: "heart", bitmap: [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."], size: "w-7", rotate: -12, x: 4, y: 82 },
  { name: "star", bitmap: STAR, size: "w-6", rotate: 12, x: 93, y: 6 },
  {
    name: "swirl",
    bitmap: ["..XXXXX..", ".X.....X.", "X..XXX..X", "X.X...X.X", "X.X.X.X.X", "X.X.XX..X", "X..X...X.", ".X..XXX..", "..X......"],
    size: "w-7",
    rotate: 6,
    x: 92,
    y: 84,
  },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const DraggableDecor = ({ decor }: { decor: (typeof DECOR)[number] }) => {
  const [pos, setPos] = useState({ x: decor.x, y: decor.y });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ sheet: DOMRect; offsetX: number; offsetY: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const sheet = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!sheet) return;
    const self = e.currentTarget.getBoundingClientRect();
    drag.current = { sheet, offsetX: e.clientX - self.left, offsetY: e.clientY - self.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const { sheet, offsetX, offsetY } = drag.current;
    const self = e.currentTarget.getBoundingClientRect();
    // Keep the whole decor inside the sheet
    const maxX = ((sheet.width - self.width) / sheet.width) * 100;
    const maxY = ((sheet.height - self.height) / sheet.height) * 100;
    setPos({
      x: clamp(((e.clientX - offsetX - sheet.left) / sheet.width) * 100, 0, maxX),
      y: clamp(((e.clientY - offsetY - sheet.top) / sheet.height) * 100, 0, maxY),
    });
  };

  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <button
      type="button"
      aria-label={`Decorative ${decor.name} sticker (drag to move)`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`sticker-decor absolute z-20 touch-none select-none text-brand transition-transform duration-150 ${decor.size} ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `rotate(${decor.rotate}deg) scale(${dragging ? 1.25 : 1})` }}
    >
      <PixelArt bitmap={decor.bitmap} className="block w-full" />
    </button>
  );
};

export type Sticker = {
  /** Competition results get a trophy, course certificates a medal */
  kind: "achievement" | "certificate";
  status: string;
  event: string;
  organizer: string;
  date: string;
  certificate: string;
  /** Issuer's verification page, shown as "View credential" once the sticker is peeled */
  credentialUrl?: string;
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
        className={`sticker group relative block w-full max-w-52 text-left cursor-pointer outline-none ${peeling ? "is-peeling" : ""}`}
        style={{ "--tilt": `${sticker.tilt}deg` } as React.CSSProperties}
      >
        {/* Sticker body: white die-cut border around a theme-colored face */}
        <span className="sticker-body flex h-48 flex-col rounded-2xl border-[5px] border-white bg-brand p-4 text-[#1a1020]">
          <span className="flex items-center justify-between">
            <PixelArt bitmap={sticker.kind === "achievement" ? TROPHY : MEDAL} className="w-7" />
            <span className="rounded-full bg-[#1a1020] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-brand">
              {sticker.status}
            </span>
          </span>
          <span className="mt-3 block font-heading text-lg font-extrabold leading-tight">{sticker.event}</span>
          <span className="mt-auto block pt-1 font-mono text-[10px] leading-snug opacity-70">
            {sticker.organizer}
            <br />
            {sticker.date}
          </span>
        </span>

        {/* Curled-up corner, revealed on hover */}
        <span className="sticker-curl" aria-hidden="true" />
      </button>

      <Lightbox src={sticker.certificate} alt={`${sticker.status} certificate — ${sticker.event}`} open={open} onClose={close} credentialHref={sticker.credentialUrl} />
    </>
  );
};

/**
 * Achievements as stickers on a dotted sheet. Hovering lifts a corner;
 * clicking peels the sticker off and shows the certificate underneath in a lightbox.
 */
export const StickerSheet = ({ stickers }: { stickers: Sticker[] }) => (
  <div className="@container relative overflow-hidden rounded-xl border border-white/10 bg-[#111114] [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:14px_14px] px-6 py-12 md:px-10 md:py-14">
    <p className="absolute left-4 top-3 font-mono text-[10px] text-white/25">peel to view</p>

    {DECOR.map((d) => (
      <DraggableDecor key={d.name} decor={d} />
    ))}

    {/* Up to 3 per row depending on the sheet's own width; a short last row stays centered */}
    <div className="relative mx-auto flex max-w-[46rem] flex-wrap justify-center gap-x-10 gap-y-12">
      {stickers.map((s) => (
        <div key={s.event} className="flex basis-full justify-center @md:basis-[calc(50%-1.25rem)] @2xl:basis-[calc(33.333%-1.667rem)]">
          <StickerItem sticker={s} />
        </div>
      ))}
    </div>
  </div>
);
