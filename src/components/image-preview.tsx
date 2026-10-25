"use client";

import { ArrowUpRight, Download, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Full-size image overlay. Closes on backdrop click, the ✕ button or Escape.
 * Portaled to <body> because the cards use backdrop-blur, which would otherwise
 * trap `position: fixed` inside the card.
 */
export const Lightbox = ({ src, alt, open, onClose, downloadHref, downloadPrompt, credentialHref }: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
  /** Adds a download button */
  downloadHref?: string;
  /** Text under the image that also downloads `downloadHref` (e.g. when only a preview is shown) */
  downloadPrompt?: string;
  /** Adds a "View credential" button under the image linking to the issuer's verification page */
  credentialHref?: string;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      data-no-theme-hold
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out animate-in fade-in duration-200"
    >
      <div className="flex max-h-full flex-col items-center gap-4">
        <img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-full rounded-md border border-white/10 shadow-2xl cursor-default animate-in zoom-in-95 duration-200 ${downloadPrompt || credentialHref ? "max-h-[calc(100dvh-10rem)]" : "max-h-[calc(100dvh-6rem)]"}`}
        />
        {credentialHref && (
          <a
            href={credentialHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/cred flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-5 py-2.5 text-sm text-white/85 hover:text-brand hover:border-brand/40 transition-colors"
          >
            View credential
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cred:-translate-y-0.5 group-hover/cred:translate-x-0.5" />
          </a>
        )}
        {downloadHref && downloadPrompt && (
          <a
            href={downloadHref}
            download
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs tracking-wider text-white/60 hover:text-brand transition-colors"
          >
            ↓ {downloadPrompt}
          </a>
        )}
      </div>
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
          onClick={onClose}
          className="rounded-full border border-white/15 bg-black/60 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
};

/**
 * Image thumbnail that opens a full-size lightbox on click.
 * `thumbClassName` lets the thumbnail crop the image (e.g. show only the top of a page).
 */
export const ImagePreview = ({ src, alt, thumbClassName = "h-auto", downloadHref, downloadPrompt }: {
  src: string;
  alt: string;
  thumbClassName?: string;
  /** Adds a download button to the lightbox */
  downloadHref?: string;
  downloadPrompt?: string;
}) => {
  const [open, setOpen] = useState(false);

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

      <Lightbox src={src} alt={alt} open={open} onClose={() => setOpen(false)} downloadHref={downloadHref} downloadPrompt={downloadPrompt} />
    </>
  );
};
