"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import React, { useCallback, useRef } from "react";

// How far (px) from the cursor a letter still reacts to hover
const REACH = 140;
const REST_WEIGHT = 700;
const PEAK_WEIGHT = 800;
const DIP_WEIGHT = 560;

// A letter can only be stretched a little, like a rubber band
const PULL = { top: -16, bottom: 16, left: -10, right: 10 };
// Release wave: how big the first neighbour jumps, how fast it fades per letter, and the stagger
const WAVE_MAX = 14;
const WAVE_FALLOFF = 0.8;
const WAVE_STAGGER = 0.045;

type Ripple = (amplitude: number, delay: number) => void;

/**
 * Hero name made of springy letters:
 * - letters near the cursor lift up and change weight, like a wave following the pointer
 * - a letter can be pulled just a little; when let go it snaps back with a "boing"
 *   and sends a wave through its neighbours, fading the further it travels
 * Color stays the same; only shape and position react.
 */
export const InteractiveName = ({ text, className }: { text: string; className?: string }) => {
  const pointerX = useMotionValue(-9999);
  const reduceMotion = useReducedMotion();
  const ripples = useRef<Ripple[]>([]);

  // Global index per letter (spaces skipped) so the wave crosses word gaps
  const words = text.split(" ");
  const offsets = words.map((_, w) => words.slice(0, w).reduce((n, word) => n + word.length, 0));

  const sendWave = useCallback((from: number, direction: number, strength: number) => {
    const amplitude = Math.min(strength, WAVE_MAX) * direction;
    ripples.current.forEach((ripple, i) => {
      const distance = Math.abs(i - from);
      if (distance === 0 || !ripple) return;
      ripple(amplitude * WAVE_FALLOFF ** (distance - 1), distance * WAVE_STAGGER);
    });
  }, []);

  return (
    <h2
      className={className}
      aria-label={text}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") pointerX.set(e.clientX);
      }}
      onPointerLeave={() => pointerX.set(-9999)}
    >
      {words.map((word, w) => (
        <React.Fragment key={w}>
          {/* Keep each word on one line so letters never wrap apart */}
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.split("").map((char, i) => {
              const index = offsets[w] + i;
              return (
                <Letter
                  key={i}
                  char={char}
                  pointerX={pointerX}
                  still={!!reduceMotion}
                  register={(ripple) => {
                    ripples.current[index] = ripple;
                  }}
                  onRelease={(direction, strength) => sendWave(index, direction, strength)}
                />
              );
            })}
          </span>
          {w < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </h2>
  );
};

const Letter = ({
  char,
  pointerX,
  still,
  register,
  onRelease,
}: {
  char: string;
  pointerX: MotionValue<number>;
  still: boolean;
  register: (ripple: Ripple) => void;
  onRelease: (direction: number, strength: number) => void;
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  const distance = useTransform(pointerX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return REACH;
    return Math.min(Math.abs(x - (rect.left + rect.width / 2)), REACH);
  });

  const spring = { stiffness: 260, damping: 18, mass: 0.6 };
  const lift = useSpring(useTransform(distance, [0, REACH], still ? [0, 0] : [-14, 0]), spring);
  // Letters right under the cursor get bolder, their neighbours a bit thinner, so the wave reads clearly
  const weight = useSpring(
    useTransform(distance, [0, REACH * 0.35, REACH], still ? [REST_WEIGHT, REST_WEIGHT, REST_WEIGHT] : [PEAK_WEIGHT, DIP_WEIGHT, REST_WEIGHT]),
    spring,
  );
  const fontVariationSettings = useTransform(weight, (w) => `"wght" ${Math.round(w)}`);

  // Bounce sent from a neighbour that was pulled and released
  const ripple = useMotionValue(0);
  const y = useTransform(() => lift.get() + ripple.get());
  register((amplitude, delay) => {
    animate(ripple, [0, amplitude, -amplitude * 0.4, amplitude * 0.15, 0], {
      duration: 0.6,
      delay,
      ease: "easeOut",
    });
  });

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { x, y: dy } = info.offset;
    // Mostly vertical pulls send the wave the same way; sideways pulls make it hop up
    const direction = Math.abs(dy) >= Math.abs(x) * 0.5 && dy !== 0 ? Math.sign(dy) : -1;
    onRelease(direction, Math.max(6, Math.hypot(x, dy) * 0.5));
  };

  return (
    // Outer span carries hover lift + neighbour ripples; inner span is the part you pull
    <motion.span className="relative inline-block" style={{ y, fontVariationSettings }}>
      <motion.span
        ref={ref}
        className="relative inline-block cursor-grab touch-none select-none active:cursor-grabbing"
        drag={!still}
        dragConstraints={PULL}
        dragElastic={0.12}
        dragMomentum={false}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 700, bounceDamping: 7 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scaleX: 0.92, scaleY: 1.1, zIndex: 10 }}
        whileTap={{ scaleX: 1.1, scaleY: 0.9 }}
      >
        {char}
      </motion.span>
    </motion.span>
  );
};
