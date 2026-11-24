"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "About Me", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Articles", href: "#articles" },
  { name: "Achievements", href: "#achievements" },
];

// Tracks which section is currently being read: the one crossing a band about a third of the
// way down the screen. Sections scroll inside the main card, and IntersectionObserver with the
// viewport as root already accounts for that card's clipping
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

const SECTION_IDS = navigationItems.map((item) => item.href.slice(1));

export const Skiper58 = () => {
  const active = useActiveSection(SECTION_IDS);

  return (
    // One row spread edge to edge, so the last link lines up with the logo above; centred on laptops.
    // Bottom padding leaves room for the active marker, which the horizontal scroll would otherwise clip
    <ul className="flex flex-row items-center justify-between lg:justify-center gap-1.5 sm:gap-5 md:gap-7 w-full overflow-x-auto pb-3 -mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {navigationItems.map((item) => {
        const isActive = active === item.href.slice(1);
        return (
          <li
            className="relative flex shrink-0 cursor-pointer flex-col items-center overflow-visible whitespace-nowrap"
            key={item.href}
          >
            <a
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex items-start hover:text-brand transition-colors duration-300",
                isActive ? "text-white/85" : "text-white/50",
              )}
            >
              {/* On phones the font shrinks with the screen so all six links fit on one row: the links
                  measure about 28.8px of text per px of font size, and 100px covers the page and
                  header padding plus the gaps. Capped at text-xs, normal size from sm up */}
              <TextRoll
                center
                className="text-[length:clamp(8px,calc((100vw_-_100px)_/_28.8),12px)] sm:text-xs md:text-sm font-medium tracking-normal sm:tracking-wide"
              >
                {item.name}
              </TextRoll>
            </a>
            {/* One shared underline in the theme color (same as the background grid) that glides to
                whichever link is active and matches its width */}
            {isActive && (
              <motion.span
                layoutId="nav-active-marker"
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-[7px] h-[2.5px] rounded-full bg-(--theme-line)"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const STAGGER = 0.035;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{
        lineHeight: 1.2,
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === " " ? <span style={{ display: "inline-block", width: "0.4em" }} /> : l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === " " ? <span style={{ display: "inline-block", width: "0.4em" }} /> : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

export { TextRoll };
