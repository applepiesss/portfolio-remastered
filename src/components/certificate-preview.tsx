"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Certificate thumbnail that opens a full-size lightbox on click.
 * The lightbox is portaled to <body> because the cards use backdrop-blur,
 * which would otherwise trap `position: fixed` inside the card.
 */
export const CertificatePreview = ({ src, alt }: { src: string; alt: string }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/cert relative block w-full overflow-hidden rounded-md border border-white/10 cursor-zoom-in"
        aria-label={`View ${alt}`}
      >
        <img src={src} alt={alt} className="w-full h-auto transition-transform duration-500 group-hover/cert:scale-[1.02]" />
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-white/70 opacity-0 transition-opacity group-hover/cert:opacity-100">
          click to enlarge
        </span>
      </button>

      {open &&
        createPortal(
          <div
            data-no-theme-hold
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out animate-in fade-in duration-200"
          >
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-md border border-white/10 shadow-2xl cursor-default animate-in zoom-in-95 duration-200"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/60 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};
