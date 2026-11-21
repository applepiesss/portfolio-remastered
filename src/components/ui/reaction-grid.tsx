"use client";

import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated background of tiny flickering squares driven by a Gray-Scott reaction-diffusion
 * simulation. Two virtual chemicals react and spread, growing living patterns like animal spots,
 * mazes or coral. The simulation can run on a coarser grid than the squares (`scale`) to grow
 * bigger shapes; it is smoothly upsampled, so lines drawn from it stay one square thin. To keep it
 * from ever settling, the feed rate drifts slowly across space and time, new drops are seeded now
 * and then, and small patches get wiped so they regrow.
 *
 * The "cowhide" pattern is the exception: big sparse patches are fragile in Gray-Scott (they die
 * out or merge into stripes on small screens), so it uses slowly morphing noise cut at a high
 * level instead, which always gives cow-print patches.
 */

/** fill: solid shapes; outline: thin lines along the edges; hatch: shapes shaded with thin diagonal lines */
export type ReactionLook = "fill" | "outline" | "hatch";

export type ReactionPattern = "spots" | "maze" | "coral" | "fingerprint" | "cells" | "cowhide";

// Feed / kill rates for each look (classic Gray-Scott regimes)
const PATTERNS: Record<Exclude<ReactionPattern, "cowhide">, { feed: number; kill: number }> = {
  spots: { feed: 0.0367, kill: 0.0649 },
  maze: { feed: 0.029, kill: 0.057 },
  coral: { feed: 0.0545, kill: 0.062 },
  fingerprint: { feed: 0.037, kill: 0.06 },
  cells: { feed: 0.039, kill: 0.058 },
};

// Cow print: patch size (squares per noise cell), how much of the field counts as a patch,
// and how fast patches morph (noise units per ms)
const COW_SIZE = 22;
const COW_LEVEL = 0.6;
const COW_DRIFT = 0.00005;

const DIFFUSE_U = 1.0;
const DIFFUSE_V = 0.5;
const STEPS_PER_FRAME = 6;
const WARMUP_STEPS = 700;
const FEED_WOBBLE = 0.0016;
const SEED_EVERY_MS = 1800;
const WIPE_EVERY_MS = 3200;
const LEVELS = 6;
// Concentration of V where the pattern's edge is drawn
const EDGE = 0.2;
// Spacing (in squares) between the diagonal lines of the hatch look
const HATCH_GAP = 4;

interface ReactionGridProps {
  pattern?: ReactionPattern;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  /** Opacity of the brightest squares */
  maxOpacity?: number;
  /** Opacity of the faint squares outside the pattern, so the grid is always hinted */
  baseOpacity?: number;
  /** Chance per second that a square changes its flicker brightness */
  flickerChance?: number;
  /** How the pattern is drawn: solid shapes, edge contour lines, or diagonal hatching */
  look?: ReactionLook;
  /** Squares per simulation cell; higher grows bigger, fewer shapes */
  scale?: number;
  className?: string;
}

type Sim = {
  cols: number;
  rows: number;
  u: Float32Array;
  v: Float32Array;
  nu: Float32Array;
  nv: Float32Array;
  feedX: Float32Array;
  feedY: Float32Array;
};

// Per-square display state, separate from the (possibly coarser) simulation grid
type Display = {
  cols: number;
  rows: number;
  /** V sampled at each square */
  field: Float32Array;
  flicker: Float32Array;
  /** Displayed brightness, eased toward its target so squares fade instead of popping */
  glow: Float32Array;
};

const createDisplay = (cols: number, rows: number): Display => {
  const n = cols * rows;
  const flicker = new Float32Array(n);
  for (let i = 0; i < n; i++) flicker[i] = 0.55 + Math.random() * 0.45;
  return { cols, rows, field: new Float32Array(n), flicker, glow: new Float32Array(n) };
};

// Bilinear upsample of V onto the squares (identity when scale is 1)
const sampleField = (sim: Sim, display: Display, scale: number) => {
  const { cols, rows, v } = sim;
  for (let y = 0; y < display.rows; y++) {
    const sy = y / scale;
    const y0 = Math.floor(sy);
    const ty = sy - y0;
    const r0 = (y0 % rows) * cols;
    const r1 = ((y0 + 1) % rows) * cols;
    for (let x = 0; x < display.cols; x++) {
      const sx = x / scale;
      const x0 = Math.floor(sx);
      const tx = sx - x0;
      const c0 = x0 % cols;
      const c1 = (x0 + 1) % cols;
      const top = v[r0 + c0] + (v[r0 + c1] - v[r0 + c0]) * tx;
      const bottom = v[r1 + c0] + (v[r1 + c1] - v[r1 + c0]) * tx;
      display.field[y * display.cols + x] = top + (bottom - top) * ty;
    }
  }
};

const createSim = (cols: number, rows: number, scale: number): Sim => {
  const n = cols * rows;
  const sim: Sim = {
    cols,
    rows,
    u: new Float32Array(n).fill(1),
    v: new Float32Array(n),
    nu: new Float32Array(n),
    nv: new Float32Array(n),
    feedX: new Float32Array(cols),
    feedY: new Float32Array(rows).fill(1),
  };
  // Few, small drops: if they cover too much at once (above ~40%), sparse regimes collapse to nothing
  const seeds = Math.max(2, Math.round(n / 450));
  for (let s = 0; s < seeds; s++) {
    drop(sim, Math.random() * cols, Math.random() * rows, Math.max(1.5, (2 + Math.random() * 3) / scale));
  }
  return sim;
};

// Splash of chemical V that a pattern grows from
const drop = (sim: Sim, cx: number, cy: number, r: number) => paint(sim, cx, cy, r, 0.5, 0.25 + Math.random() * 0.25);

// Reset a patch to empty so the pattern has room to regrow there
const wipe = (sim: Sim, cx: number, cy: number, r: number) => paint(sim, cx, cy, r, 1, 0);

const paint = (sim: Sim, cx: number, cy: number, r: number, u: number, v: number) => {
  const { cols, rows } = sim;
  for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) {
    for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const x = (Math.round(cx) + dx + cols) % cols;
      const y = (Math.round(cy) + dy + rows) % rows;
      sim.u[y * cols + x] = u;
      sim.v[y * cols + x] = v;
    }
  }
};

// Feed rate varies gently across the screen and over time, so regions keep morphing
const updateFeedField = (sim: Sim, t: number) => {
  for (let x = 0; x < sim.cols; x++) sim.feedX[x] = Math.sin(x * 0.045 + t * 0.00021);
  for (let y = 0; y < sim.rows; y++) sim.feedY[y] = Math.cos(y * 0.05 - t * 0.00017);
};

const step = (sim: Sim, feed: number, kill: number) => {
  const { cols, rows, u, v, nu, nv, feedX, feedY } = sim;
  for (let y = 0; y < rows; y++) {
    const up = ((y - 1 + rows) % rows) * cols;
    const row = y * cols;
    const down = ((y + 1) % rows) * cols;
    for (let x = 0; x < cols; x++) {
      const left = (x - 1 + cols) % cols;
      const right = (x + 1) % cols;
      const i = row + x;
      const uc = u[i];
      const vc = v[i];
      // 3x3 Laplacian: neighbours 0.2, diagonals 0.05, centre -1 (wraps around the edges)
      const lapU =
        0.2 * (u[up + x] + u[down + x] + u[row + left] + u[row + right]) +
        0.05 * (u[up + left] + u[up + right] + u[down + left] + u[down + right]) -
        uc;
      const lapV =
        0.2 * (v[up + x] + v[down + x] + v[row + left] + v[row + right]) +
        0.05 * (v[up + left] + v[up + right] + v[down + left] + v[down + right]) -
        vc;
      const f = feed + FEED_WOBBLE * feedX[x] * feedY[y];
      const uvv = uc * vc * vc;
      nu[i] = uc + DIFFUSE_U * lapU - uvv + f * (1 - uc);
      nv[i] = vc + DIFFUSE_V * lapV + uvv - (kill + f) * vc;
    }
  }
  sim.u = nu;
  sim.v = nv;
  sim.nu = u;
  sim.nv = v;
};

// Share of cells currently inside the pattern
const coverage = (sim: Sim) => {
  let inside = 0;
  for (let i = 0; i < sim.v.length; i++) if (sim.v[i] > EDGE) inside++;
  return inside / sim.v.length;
};

// Smooth 3D value noise in [0, 1]; the third axis is time, so patches morph instead of sliding
const hash = (x: number, y: number, z: number) => {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1440662683)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const noise3 = (x: number, y: number, z: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smoothstep(x - xi);
  const yf = smoothstep(y - yi);
  const zf = smoothstep(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), xf), lerp(c(0, 1, 0), c(1, 1, 0), xf), yf),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), xf), lerp(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  );
};

// Fills the display field so that its EDGE contour traces the cow patches
const cowField = (display: Display, now: number) => {
  const t = now * COW_DRIFT;
  for (let y = 0; y < display.rows; y++) {
    const ny = y / COW_SIZE;
    for (let x = 0; x < display.cols; x++) {
      const nx = x / COW_SIZE;
      // A coarse layer for the patch shapes plus a finer one for ragged, irregular edges
      const n = 0.7 * noise3(nx, ny, t) + 0.3 * noise3(nx * 2.3 + 17, ny * 2.3 + 5, t * 1.4);
      display.field[y * display.cols + x] = EDGE + (n - COW_LEVEL);
    }
  }
};

const toRGB = (color: string): [number, number, number] => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [255, 255, 255];
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

export const ReactionGrid: React.FC<ReactionGridProps> = ({
  pattern = "spots",
  squareSize = 3,
  gridGap = 5,
  color = "#ffffff",
  maxOpacity = 0.85,
  baseOpacity = 0.06,
  flickerChance = 0.2,
  look = "fill",
  scale = 1,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    const procedural = pattern === "cowhide";
    const { feed, kill } = procedural ? { feed: 0, kill: 0 } : PATTERNS[pattern];
    const [r, g, b] = toRGB(color);
    const cell = squareSize + gridGap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let sim: Sim | null = null;
    let display: Display | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let visible = false;
    let last = 0;
    let lastSeed = 0;
    let lastWipe = 0;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      display = createDisplay(cols, rows);
      if (!procedural) {
        sim = createSim(Math.ceil(cols / scale) + 1, Math.ceil(rows / scale) + 1, scale);
        updateFeedField(sim, 0);
        for (let s = 0; s < WARMUP_STEPS; s++) step(sim, feed, kill);
      }
      draw(0, performance.now());
    };

    const draw = (dt: number, now: number) => {
      if (!display) return;
      if (procedural) cowField(display, now);
      else if (sim) sampleField(sim, display, scale);
      else return;
      const { cols, rows, field: v, flicker, glow } = display;
      // Ease factor for glow; a first draw (dt = 0) snaps straight to the target
      const ease = dt === 0 ? 1 : Math.min(1, dt * 7);
      const size = squareSize * dpr;
      const paths = Array.from({ length: LEVELS + 1 }, () => new Path2D());
      const flickerRoll = flickerChance * dt;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          if (Math.random() < flickerRoll) flicker[i] = 0.55 + Math.random() * 0.45;
          let strength: number;
          if (look === "outline") {
            // Light a square only where the pattern crosses its edge, giving thin contour lines
            const inside = v[i] > EDGE;
            const edge =
              inside !== v[y * cols + ((x + 1) % cols)] > EDGE ||
              inside !== v[((y + 1) % rows) * cols + x] > EDGE;
            strength = edge ? 1 : 0;
          } else if (look === "hatch") {
            // Diagonal lines fixed to the grid; only the shape they fill moves, so nothing jitters
            strength = v[i] > EDGE && (x + y) % HATCH_GAP === 0 ? 1 : 0;
          } else {
            // Narrow ramp around the edge keeps shapes crisp instead of blurry
            strength = Math.min(1, Math.max(0, (v[i] - EDGE + 0.04) / 0.1));
          }
          glow[i] += (strength - glow[i]) * ease;
          const level = Math.round(glow[i] * flicker[i] * LEVELS);
          paths[level].rect(x * cell * dpr, y * cell * dpr, size, size);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paths.forEach((path, level) => {
        const alpha = level === 0 ? baseOpacity : (level / LEVELS) * maxOpacity;
        if (alpha <= 0) return;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill(path);
      });
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!display || !visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;

      if (procedural || !sim) {
        draw(dt, now);
        return;
      }

      if (now - lastSeed > SEED_EVERY_MS) {
        lastSeed = now;
        const cover = coverage(sim);
        // Sparse patterns can die out; if almost nothing is left, plant a few fresh drops at once
        const drops = cover < 0.03 ? 3 : 1;
        for (let d = 0; d < drops; d++) {
          drop(sim, Math.random() * sim.cols, Math.random() * sim.rows, Math.max(2, (2 + Math.random() * 2) / scale));
        }
      }
      if (now - lastWipe > WIPE_EVERY_MS) {
        lastWipe = now;
        // Only wipe when there is plenty of pattern, so a wipe never erases the last shapes.
        // Sized in squares, so a coarse simulation (big shapes) gets proportionally small wipes
        if (coverage(sim) > 0.1) {
          wipe(sim, Math.random() * sim.cols, Math.random() * sim.rows, Math.max(2, (5 + Math.random() * 6) / scale));
        }
      }
      updateFeedField(sim, now);
      for (let s = 0; s < STEPS_PER_FRAME; s++) step(sim, feed, kill);
      draw(dt, now);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    // Hidden theme layers are display:none, so they never intersect and stay paused
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [pattern, squareSize, gridGap, color, maxOpacity, baseOpacity, flickerChance, look, scale]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};
