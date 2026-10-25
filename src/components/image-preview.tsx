"use client";

import { Download, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Image thumbnail that opens a full-size lightbox on click.
 * `thumbClassName` lets the thumbnail crop the image (e.g. show only the top of a page).
 * The lightbox is portaled to <body> because the cards use backdrop-blur,
 * which would otherwise trap `position: fixed` inside the card.
 */
export const ImagePreview = ({ src, alt, thumbClassName = "h-auto", downloadHref }: {
  src: string;
  alt: string;
  thumbClassName?: string;
  /** Adds a download button to the lightbox */
  downloadHref?: string;
}) => {
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
        <img src={src} alt={alt} className={`w-full transition-transform duration-500 group-hover/cert:scale-[1.02] ${thumbClassName}`} />
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
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {downloadHref && (
                <a
                  href={downloadHref}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs text-white/80 hover:text-brand hover:border-brand/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 bg-black/60 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
