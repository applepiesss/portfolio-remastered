"use client";

import React, { useEffect, useState } from "react";

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export const TextDecode = ({
  text,
  className,
  speed = 50,
  duration = 2000,
}: {
  text: string;
  className?: string;
  speed?: number;
  duration?: number;
}) => {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = React.useRef<any>(null);

  const triggerDecode = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const maxIterations = duration / speed;
    
    // Fill initially with random chars
    setDisplayText(
      text
        .split("")
        .map((char) => (char === " " ? " " : charset[Math.floor(Math.random() * charset.length)]))
        .join("")
    );

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            // Reveal letter sequentially from left to right over the duration
            if (index < (iteration / maxIterations) * text.length) {
              return letter;
            }
            // Unrevealed letters remain random
            return charset[Math.floor(Math.random() * charset.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text); // Ensure final text is perfectly accurate
      }
      
      iteration += 1;
    }, speed);
  };

  useEffect(() => {
    triggerDecode();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, duration]);

  return (
    <span 
      className={`cursor-pointer hover:text-white/80 transition-colors ${className || ""}`} 
      onClick={triggerDecode}
      title="Click to decode again"
    >
      {displayText}
    </span>
  );
};
