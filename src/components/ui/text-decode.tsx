"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const randomChar = () => charset[Math.floor(Math.random() * charset.length)];

type Letter = { char: string; locked: boolean; popKey: number };

/**
 * Scrambles the text, then locks the letters in one by one from left to right; each letter
 * does a small bounce as it lands. Renders the real text first (no empty/jumping heading),
 * and replays on click.
 */
export const TextDecode = ({
  text,
  className,
  speed = 60,
  duration = 2000,
}: {
  text: string;
  className?: string;
  /** How often the unlocked letters re-scramble (ms) */
  speed?: number;
  /** Total time until the last letter locks in (ms) */
  duration?: number;
}) => {
  const [letters, setLetters] = useState<Letter[]>(() => [...text].map((char) => ({ char, locked: true, popKey: 0 })));
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  // Letters locked as of the previous tick, so only newly locked ones bounce
  const lockedBefore = useRef(0);

  const decode = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    const start = performance.now();
    const total = [...text].length;
    lockedBefore.current = 0;

    interval.current = setInterval(() => {
      // How many letters should be locked by now
      const lockedCount = Math.min(total, Math.floor(((performance.now() - start) / duration) * total) + 1);
      // Snapshot before the ref is updated below; React may run the updater later
      const prevLocked = lockedBefore.current;
      setLetters((prev) =>
        [...text].map((char, i) => {
          if (char === " ") return { char, locked: true, popKey: prev[i]?.popKey ?? 0 };
          if (i < lockedCount) {
            const justLocked = i >= prevLocked;
            // A new popKey remounts the span so its bounce animation plays once
            return { char, locked: true, popKey: justLocked ? (prev[i]?.popKey ?? 0) + 1 : prev[i].popKey };
          }
          return { char: randomChar(), locked: false, popKey: prev[i]?.popKey ?? 0 };
        }),
      );
      lockedBefore.current = lockedCount;
      if (lockedCount >= total && interval.current) clearInterval(interval.current);
    }, speed);
  }, [text, speed, duration]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    decode();
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [decode]);

  return (
    <span className={`cursor-pointer ${className || ""}`} onClick={decode} title="Click to decode again" aria-label={text}>
      {letters.map((l, i) => (
        <span
          key={`${i}-${l.popKey}`}
          aria-hidden="true"
          className={`decode-letter ${l.locked && l.popKey > 0 ? "decode-pop" : ""} ${l.locked ? "" : "opacity-60"}`}
        >
          {l.char}
        </span>
      ))}
    </span>
  );
};
