"use client";

import React, { useState } from "react";

import { Lightbox } from "@/components/image-preview";

type ResumePage = { src: string; alt: string };

const PAPER = "#f4f1ea";
// A springy ease so the pages settle with a little overshoot
const SPRING = "ease-[cubic-bezier(0.34,1.4,0.64,1)]";
const SHEET = `absolute inset-0 cursor-zoom-in shadow-[0_14px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 ${SPRING} outline-none focus-visible:ring-2 focus-visible:ring-brand/60`;

/**
 * The resume as two loose sheets of paper, page 1 on top of page 2. Hovering (or focusing) fans
 * them apart; on touch screens they rest slightly fanned already. Clicking a page opens it full
 * size with a link to download the whole PDF.
 */
export const ResumeStack = ({ pages, downloadHref }: { pages: [ResumePage, ResumePage]; downloadHref: string }) => {
  const [openPage, setOpenPage] = useState<number | null>(null);
  const [front, back] = pages;

  return (
    <div className="group relative mx-auto aspect-[1/1.414] w-[72%]">
      {/* Page 2, tucked behind and turned the other way */}
      <button
        type="button"
        aria-label={`View ${back.alt}`}
        onClick={() => setOpenPage(1)}
        className={`${SHEET} translate-x-[5%] rotate-[4deg] group-hover:translate-x-[24%] group-hover:rotate-[9deg] group-focus-within:translate-x-[24%] group-focus-within:rotate-[9deg] [@media(hover:none)]:translate-x-[16%] [@media(hover:none)]:rotate-[7deg]`}
        style={{ background: PAPER }}
      >
        <img src={back.src} alt="" className="size-full object-cover object-top" />
      </button>

      {/* Page 1 on top */}
      <button
        type="button"
        aria-label={`View ${front.alt}`}
        onClick={() => setOpenPage(0)}
        className={`${SHEET} -rotate-2 group-hover:-translate-x-[20%] group-hover:-rotate-[7deg] group-focus-within:-translate-x-[20%] group-focus-within:-rotate-[7deg] [@media(hover:none)]:-translate-x-[12%] [@media(hover:none)]:-rotate-[5deg]`}
        style={{ background: PAPER }}
      >
        <img src={front.src} alt="" className="size-full object-cover object-top" />
      </button>

      {pages.map((page, i) => (
        <Lightbox
          key={page.src}
          src={page.src}
          alt={page.alt}
          open={openPage === i}
          onClose={() => setOpenPage(null)}
          downloadHref={downloadHref}
          downloadPrompt={`Page ${i + 1} of ${pages.length}. Download the full PDF`}
        />
      ))}
    </div>
  );
};
