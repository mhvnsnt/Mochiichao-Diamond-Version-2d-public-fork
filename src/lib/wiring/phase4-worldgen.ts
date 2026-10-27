/**
 * Phase 4 world generation — dungeon + noise + field-of-view.
 * Pokemon's own order, non-combat side: overworld/maps come first, and
 * these generators feed hand-designed maps, never replace them.
 *
 * Provenance (ideas only — NO vendored code copied here):
 * - rot.js (workspace tools/rot.js): roguelike map generation, FOV, and
 *   pathing shapes. This module re-implements the shapes in original
 *   TypeScript: rooms joined by corridors, connectivity validation,
 *   line-of-sight field of view.
 * - FastNoiseLite (workspace tools/FastNoiseLite): gradient/value noise
 *   with frequency / octaves / lacunarity / gain. This module implements
 *   fractal VALUE noise (hash + smooth interpolation) with the same
 *   parameter shape — it is not a port of FastNoiseLite source.
 * - WaveFunctionCollapse (workspace tools/WaveFunctionCollapse): tile
 *   constraint collapse. That idea is ALREADY on main as
 *   src/lib/wiring/wfc-isle.ts (isle maps only) and is NOT duplicated
 *   here; this file covers dungeons + noise, which wfc-isle does not.
 *
 * Rules: pure functions, seeded + deterministic (same seed = same map),
 * no imports, no battle code, no species/character names, no dialogue,
 * no cries, no logos, no art. Local CPU only. Mochiichao tuning is
 * labelled as such where a number is ours, not a source value.
 */

export type Phase4Tile = "floor" | "wall" | "door" | "water" | "grass" | "rock";

export function phase4SeededRng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export interface Phase4Room { x: number; y: number; w: number; h: number; cx: number; cy: number; }

/** Carve rooms, join them with L corridors, validate connectivity. */
export function phase4GenerateDungeon(
  seed: number,
  width = 32,
  height = 24,
  roomAttempts = 40,
): { grid: Phase4Tile[][]; rooms: Phase4Room[]; connected: boolean } {
  const rng = phase4SeededRng(seed);
  const grid: Phase4Tile[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "wall" as Phase4Tile),
  );
  const rooms: Phase4Room[] = [];
  for (let i = 0; i < roomAttempts; i++) {
    const w = 3 + Math.floor(rng() * 5);
    const h = 3 + Math.floor(rng() * 4);
    const x = 1 + Math.floor(rng() * Math.max(1, width - w - 2));
    const y = 1 + Math.floor(rng() * Math.max(1, height - h - 2));
    const overlaps = rooms.some((r) => x < r.x + r.w + 1 && x + w + 1 > r.x && y < r.y + r.h + 1 && y + h + 1 > r.y);
    if (overlaps) continue;
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) grid[yy][xx] = "floor";
    rooms.push({ x, y, w, h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) });
  }
  const carveH = (x1: number, x2: number, y: number): void => {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) if (grid[y] && grid[y][x] === "wall") grid[y][x] = "floor";
  };
  const carveV = (y1: number, y2: number, x: number): void => {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) if (grid[y] && grid[y][x] === "wall") grid[y][x] = "floor";
  };
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1];
    const b = rooms[i];
    if (rng() < 0.5) { carveH(a.cx, b.cx, a.cy); carveV(a.cy, b.cy, b.cx); }
    else { carveV(a.cy, b.cy, a.cx); carveH(a.cx, b.cx, b.cy); }
  }
  // Connectivity check: flood fill from the first room centre.
  let connected = rooms.length <= 1;
  if (rooms.length > 1) {
    const seen = new Set<string>();
    const stack: Array<[number, number]> = [[rooms[0].cx, rooms[0].cy]];
    while (stack.length > 0) {
      const [x, y] = stack.pop() as [number, number];
      const key = x + "," + y;
      if (seen.has(key) || y < 0 || y >= height || x < 0 || x >= width || grid[y][x] === "wall") continue;
      seen.add(key);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    connected = rooms.every((r) => seen.has(r.cx + "," + r.cy));
  }
  return { grid, rooms, connected };
}

export interface Phase4NoiseOptions { frequency?: number; octaves?: number; lacunarity?: number; gain?: number; }

function phase4Hash2(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 974634211) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = (h * 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function phase4Smooth(t: number): number { return t * t * (3 - 2 * t); }

/** Fractal value noise in [-1, 1]. Parameter shape mirrors FastNoiseLite; code is original. */
export function phase4ValueNoise(x: number, y: number, seed: number, opts: Phase4NoiseOptions = {}): number {
  const frequency = opts.frequency ?? 0.05;
  const octaves = opts.octaves ?? 4;
  const lacunarity = opts.lacunarity ?? 2;
  const gain = opts.gain ?? 0.5;
  let amplitude = 1;
  let total = 0;
  let norm = 0;
  let fx = x * frequency;
  let fy = y * frequency;
  for (let o = 0; o < octaves; o++) {
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = phase4Smooth(fx - x0);
    const ty = phase4Smooth(fy - y0);
    const v00 = phase4Hash2(x0, y0, seed + o * 101);
    const v10 = phase4Hash2(x0 + 1, y0, seed + o * 101);
    const v01 = phase4Hash2(x0, y0 + 1, seed + o * 101);
    const v11 = phase4Hash2(x0 + 1, y0 + 1, seed + o * 101);
    const vx0 = v00 + (v10 - v00) * tx;
    const vx1 = v01 + (v11 - v01) * tx;
    total += (vx0 + (vx1 - vx0) * ty) * 2 * amplitude - amplitude;
    norm += amplitude;
    amplitude *= gain;
    fx *= lacunarity;
    fy *= lacunarity;
  }
  return norm === 0 ? 0 : total / norm;
}

/** Noise → biome tile. Thresholds are Mochiichao tuning, labelled as such. */
export function phase4NoiseToTile(v: number): Phase4Tile {
  if (v < -0.45) return "water";
  if (v < -0.15) return "grass";
  if (v < 0.35) return "floor";
  return "rock";
}

export function phase4GenerateTerrain(seed: number, width = 32, height = 24, opts: Phase4NoiseOptions = {}): Phase4Tile[][] {
  const grid: Phase4Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Phase4Tile[] = [];
    for (let x = 0; x < width; x++) row.push(phase4NoiseToTile(phase4ValueNoise(x, y, seed, opts)));
    grid.push(row);
  }
  return grid;
}

/** Line-of-sight FOV: a cell is visible if the straight line from the
 *  origin crosses no wall before it (Bresenham sampling, rot.js shape). */
export function phase4FieldOfView(
  grid: Phase4Tile[][],
  ox: number,
  oy: number,
  radius = 8,
): boolean[][] {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const visible: boolean[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  const blocked = (x: number, y: number): boolean => y < 0 || y >= height || x < 0 || x >= width || grid[y][x] === "wall" || grid[y][x] === "rock";
  const lineClear = (x1: number, y1: number): boolean => {
    let x0 = ox;
    let y0 = oy;
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      if (x0 === x1 && y0 === y1) return true;
      if (!(x0 === ox && y0 === oy) && blocked(x0, y0)) return false;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };
  for (let y = Math.max(0, oy - radius); y <= Math.min(height - 1, oy + radius); y++) {
    for (let x = Math.max(0, ox - radius); x <= Math.min(width - 1, ox + radius); x++) {
      if ((x - ox) * (x - ox) + (y - oy) * (y - oy) <= radius * radius) visible[y][x] = lineClear(x, y);
    }
  }
  return visible;
}

/** Self-check (no test runner dependency): deterministic + connected. */
export function phase4WorldgenSelfCheck(): { dungeonConnected: boolean; deterministic: boolean; noiseInRange: boolean } {
  const a = phase4GenerateDungeon(1234, 32, 24);
  const b = phase4GenerateDungeon(1234, 32, 24);
  const same = JSON.stringify(a.grid) === JSON.stringify(b.grid);
  const n = phase4ValueNoise(5, 7, 99);
  return { dungeonConnected: a.connected, deterministic: same, noiseInRange: n >= -1 && n <= 1 };
}
