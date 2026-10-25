import React from "react";

// Pixel-art bitmap: one string per row, "X" = lit pixel. Drawn with square cells like the background grid.
export type Bitmap = string[];

export const PixelArt = ({ bitmap, className, pixelClassName, rowDelay }: {
  bitmap: Bitmap;
  className?: string;
  pixelClassName?: string;
  /** Per-row animation delay, so pixels can light up row by row */
  rowDelay?: (row: number) => number;
}) => (
  <svg viewBox={`0 0 ${bitmap[0].length} ${bitmap.length}`} className={className} shapeRendering="crispEdges" fill="currentColor">
    {bitmap.flatMap((line, y) =>
      [...line].map((cell, x) =>
        cell === "X" ? (
          <rect
            key={`${x}-${y}`}
            x={x + 0.07}
            y={y + 0.07}
            width={0.86}
            height={0.86}
            className={pixelClassName}
            style={rowDelay ? { animationDelay: `${rowDelay(y)}ms` } : undefined}
          />
        ) : null,
      ),
    )}
  </svg>
);
