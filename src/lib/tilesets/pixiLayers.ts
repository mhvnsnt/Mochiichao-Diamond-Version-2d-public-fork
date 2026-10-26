// PixiJS v8 layer renderer for the tileset system.
//
// Layer order (bottom -> top), matching LAYER_ORDER in types.ts:
//   sky (parallax) -> far -> groundBottom -> groundMiddle ->
//   actors (Y-sorted) -> overheadTop -> weather -> tintOverlay.
// UI is NOT a layer here: UI stays React/DOM outside the canvas, so
// it is exempt from tint, weather, and parallax by construction.
//
// This renderer draws tiles as flat-colour Graphics rectangles until
// a real sheet lands for a tileset (see tilesets.ts: sheets that are
// null are placeholders, not shipped art). When a sheet lands, the
// caller passes it as `textures` and the same layer order, metatile
// ids, and behaviour table keep working — only the paint changes.
// That is deliberate: pixi-tiledmap (Tiled TSJ/TMJ rendering for
// PixiJS v8) can replace the groundBottom/groundMiddle drawing later
// with the same layer order and the same Tiled layer names
// ('GroundBottom', 'GroundMiddle', 'OverheadTop'); this file does
// not vendor pixi-tiledmap and does not add a dependency for it, so
// this PR cannot conflict with PR #61's package.json change.
//
// Weather particles are a pooled Graphics set capped at
// MAX_PARTICLES (200). Lightning is a tintOverlay flash with an
// off-switch (lightningEnabled=false means no flash, ever).
// Time fades are 1-2 s (see timeOfDay.clampFadeFrames).
import { ColorMatrixFilter, Container, Graphics } from 'pixi.js';
import type { LayerId, MetatileLayer } from './types';
import { LAYER_ORDER } from './types';
import { METATILE_BY_ID } from './metatiles';
import { PHASE_TINTS, SEASON_TINTS, clampFadeFrames } from './timeOfDay';
import type { Season, TimeOfDay } from './types';

export const MAX_PARTICLES = 200;

export const METATILE_COLORS: Record<string, number> = {
  grass: 0x3a7a2a, wall: 0x2d5a1e, water: 0x1a5a9e, path: 0xc8a870,
  building: 0x7a5c3a, door: 0xa07850, tall_grass: 0x2a6a18, sand: 0xd4b870,
  cave_floor: 0x3a3028, ledge: 0x3a7a2a, sign: 0xb09060, neon_path: 0x1a1a2e,
  industrial: 0x4a3820, shallow: 0x5a9acc, ice: 0xc8e8f8, boulder: 0x8a8a8a,
  cut_tree: 0x3a7a2a, waterfall: 0x1a5a9e, warp: 0x8050d0, stairs_up: 0x806040,
  stairs_down: 0x806040, flower: 0x4a8a30, dock: 0x7a5a30, fence: 0x8a6a40,
  sand_dune: 0xc8b080, lava: 0x8a2a0a,
};

/** Create one container per layer, in LAYER_ORDER, as children of root. */
export function createLayerContainers(root: Container): Record<LayerId, Container> {
  const out = {} as Record<LayerId, Container>;
  for (const id of LAYER_ORDER) {
    const c = new Container();
    c.label = id;
    root.addChild(c);
    out[id] = c;
  }
  return out;
}

/** Which Pixi layer a metatile draws on. */
export function pixiLayerForMetatile(metatileId: string): LayerId {
  const t = METATILE_BY_ID[metatileId];
  const layer: MetatileLayer = t?.layer ?? 'bottom';
  if (layer === 'top') return 'overheadTop';
  if (layer === 'middle') return 'groundMiddle';
  return 'groundBottom';
}

/**
 * Draw a metatile grid (rows of metatile ids) into the ground layers.
 * `tilePx` is the on-screen size of one 16x16 metatile (default 32,
 * matching PR #61's pixi-adapter tileSize). Sky/far parallax factors
 * are applied by the caller to the sky/far containers (0.25 / 0.5 of
 * camera movement) — this function only fills ground layers.
 */
export function drawMetatileGrid(
  layers: Record<LayerId, Container>,
  grid: string[][],
  tilePx = 32,
): void {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const id = grid[y][x];
      const target = layers[pixiLayerForMetatile(id)];
      const g = new Graphics()
        .rect(x * tilePx, y * tilePx, tilePx, tilePx)
        .fill(METATILE_COLORS[id] ?? 0x3a7a2a);
      target.addChild(g);
    }
  }
}

/** Y-sort the actors container so lower actors draw over higher ones. */
export function sortActors(actors: Container): void {
  actors.children.sort((a, b) => a.y - b.y);
}

/** Sky parallax factors: sky moves slowest, far moves half speed. */
export const PARALLAX = { sky: 0.25, far: 0.5, ground: 1 } as const;
export function applyParallax(
  layers: Record<LayerId, Container>,
  cameraX: number,
  cameraY: number,
): void {
  layers.sky.position.set(-cameraX * PARALLAX.sky, -cameraY * PARALLAX.sky);
  layers.far.position.set(-cameraX * PARALLAX.far, -cameraY * PARALLAX.far);
}

/**
 * Weather particle pool. Particles are plain Graphics dots recycled
 * in place; the pool never exceeds MAX_PARTICLES (200). `kind` is a
 * weather.json particle kind ('rain' | 'snow' | 'leaves' | 'dust' |
 * 'specks' | 'none'). Wind pushes particles sideways per frame.
 */
export interface ParticlePool {
  graphics: Graphics[];
  kind: string;
  count: number;
}
export function createParticlePool(
  weatherLayer: Container,
  kind: string,
  count: number,
): ParticlePool {
  const capped = Math.max(0, Math.min(MAX_PARTICLES, Math.floor(count)));
  const graphics: Graphics[] = [];
  for (let i = 0; i < capped; i++) {
    const g = new Graphics().circle(0, 0, kind === 'rain' ? 1 : 2).fill(0xffffff);
    g.visible = kind !== 'none';
    weatherLayer.addChild(g);
    graphics.push(g);
  }
  return { graphics, kind, count: capped };
}
export function stepParticles(
  pool: ParticlePool,
  width: number,
  height: number,
  windX: number,
  fallSpeed: number,
): void {
  pool.graphics.forEach((g, i) => {
    // Deterministic pseudo-motion from index so the pool needs no
    // per-particle state: position wraps inside the viewport.
    const seed = (i * 37 + 11) % 100;
    g.x = (g.x + windX + seed * 0.01) % (width + 10);
    if (g.x < 0) g.x += width + 10;
    g.y = (g.y + fallSpeed + (seed % 3)) % (height + 10);
    if (g.y < 0) g.y += height + 10;
  });
}

/**
 * Time/season tint applied to the tintOverlay container only — never
 * to UI, which lives outside the canvas. `progress` 0..1 is the
 * 1-2 s fade progress (see timeOfDay.fadeProgress). When a caller
 * wants a ColorMatrixFilter palette shift instead of a flat overlay
 * tint, it passes `useColorMatrix=true` and this function attaches
 * one filter (brightness/saturation shift by phase) to the overlay
 * container; the flat overlay remains the default because it is
 * cheaper and matches the existing PixiWorldCanvas DAY_TINT approach.
 */
export function applyTimeTint(
  tintOverlay: Container,
  phase: TimeOfDay,
  season: Season,
  progress = 1,
  useColorMatrix = false,
): void {
  const phaseTint = PHASE_TINTS[phase];
  const seasonTint = SEASON_TINTS[season];
  const alpha = Math.max(phaseTint.alpha, seasonTint.alpha) * progress;
  tintOverlay.removeChildren();
  if (alpha <= 0 && !useColorMatrix) return;
  const g = new Graphics().rect(0, 0, 4096, 4096).fill({
    color: phaseTint.alpha >= seasonTint.alpha ? phaseTint.hex : seasonTint.hex,
    alpha,
  });
  tintOverlay.addChild(g);
  if (useColorMatrix) {
    const f = new ColorMatrixFilter();
    // Night darkens + cools; dawn/dusk warm. Day leaves the matrix
    // at identity. Values are presentation choices, labelled as such.
    if (phase === 'night') f.brightness(0.75, false);
    else if (phase === 'dawn' || phase === 'dusk') f.saturate(0.2, false);
    tintOverlay.filters = [f];
  } else {
    tintOverlay.filters = [];
  }
}

/**
 * Lightning flash on the tint overlay. Returns false (no flash) when
 * lightningEnabled is false — the off-switch. Callers must check
 * settings before calling; the function itself also refuses when
 * disabled, so a missed check cannot flash a photosensitive player.
 */
export function lightningFlash(
  tintOverlay: Container,
  lightningEnabled: boolean,
): boolean {
  if (!lightningEnabled) return false;
  const g = new Graphics().rect(0, 0, 4096, 4096).fill({ color: 0xffffff, alpha: 0.7 });
  tintOverlay.addChild(g);
  return true;
}

/** Battle background derived from the battled biome — never a
 *  per-place painting. See backgrounds.json: sky + ground + platform
 *  colours per biome, with the title-bg v2 PNGs explicitly NOT used
 *  here (show-first rule: Mars has not yet seen/approved them as
 *  menu or battle art). */
export interface BattleBackground {
  biome: string;
  sky: number;
  ground: number;
  platform: number;
  weatherKind: string;
}
export function battleBackgroundForBiome(
  biome: string,
  table: Record<string, { sky: number; ground: number; platform: number; weatherKind: string }>,
): BattleBackground {
  const row = table[biome] ?? table.grass ?? { sky: 0x87ceeb, ground: 0x4ade80, platform: 0x8a6a40, weatherKind: 'none' };
  return { biome, sky: row.sky, ground: row.ground, platform: row.platform, weatherKind: row.weatherKind };
}

/** Fade length in frames for a time/weather change, clamped 60-120. */
export function fadeFramesForChange(requestedFrames: number): number {
  return clampFadeFrames(requestedFrames);
}
