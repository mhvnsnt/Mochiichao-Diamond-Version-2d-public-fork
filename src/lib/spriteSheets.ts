/**
 * Sprite-sheet loader — "looks 3D, runs 2D".
 *
 * The game ONLY eats 2D sprite sheets. Dorowani (147) and Gabu (148) are
 * Mars's own creatures, baked from his own Tripo models into 192x64 sheets:
 * three 64x64 cells, left to right: front (x=0), back (x=64), side (x=128).
 * The side frame is mirrored in code for the opposite direction until a
 * second side angle is baked. No GLBs are loaded by the game, and no
 * Pokemon sprites are loaded anywhere in this module.
 *
 * Creatures with no sheet yet are NOT given a Pokemon sprite and NOT an
 * emoji: they get an original coloured silhouette drawn from their own
 * type colour, clearly labelled as a placeholder shape in the UI.
 */
import type { CSSProperties } from 'react';
import { SPECIES_DB } from './species';
import { TYPES } from './constants';
import dorowaniSheet from '../assets/sprites/dorowani/dorowani_sheet.png';
import gabuSheet from '../assets/sprites/gabu/gabu_sheet.png';
// Battle-only three-quarter cuts. These are CROPS cut straight from the
// Sprite Art lane's 2d-sheets (no new likeness, no AI mock creature):
// - Dorowani player: angles+lighting sheet, 4x2 grid, cell (2,0) —
//   three-quarter, shell on back/left, head profile right, red frill, red eye.
// - Gabu opponent: angles sheet, 4x2 grid, cell (3,0) —
//   three-quarter, facing left toward the player.
// The old front/back cuts (dorowani-front-2d-cut.png, dorowani-back-2d-cut.png)
// and the old cutout-battle.png composite are superseded FOR THIS BATTLE
// WIRING only; the 192x64 sheets below stay the fallback for world/other views.
import dorowaniBattlePlayer from '../assets/sprites/dorowani/dorowani-player-threequarter-right-cut.png';
import gabuBattleOpponent from '../assets/sprites/gabu/gabu-threequarter-left-cut.png';

export type SheetView = 'front' | 'back' | 'side';

export interface SheetDef {
  speciesId: string;
  name: string;
  sheetUrl: string;
  cellSize: number;
  frames: Record<SheetView, number>; // x offset of the 64x64 cell
  /** Battle-only override images, per side. Absent side = sheet-cell fallback. */
  battle?: { player?: string; opponent?: string };
}

export const SHEET_DEFS: Record<string, SheetDef> = {
  '147': { speciesId: '147', name: 'Dorowani', sheetUrl: dorowaniSheet, cellSize: 64, frames: { front: 0, back: 64, side: 128 }, battle: { player: dorowaniBattlePlayer } },
  '148': { speciesId: '148', name: 'Gabu', sheetUrl: gabuSheet, cellSize: 64, frames: { front: 0, back: 64, side: 128 }, battle: { opponent: gabuBattleOpponent } },
};

export function getSheetDef(speciesId: string | undefined | null): SheetDef | null {
  if (!speciesId) return null;
  return SHEET_DEFS[speciesId] ?? null;
}

/** CSS background-position/size for showing one cell of a sheet in an <img>-free div. */
export function sheetCellStyle(def: SheetDef, view: SheetView, sizePx: number): CSSProperties {
  const x = def.frames[view];
  return {
    width: sizePx,
    height: sizePx,
    backgroundImage: `url(${def.sheetUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${sizePx * 3}px ${sizePx}px`,
    backgroundPosition: `-${(x / 64) * sizePx}px 0px`,
    imageRendering: 'pixelated',
  };
}

/** Deterministic fallback colour for a creature with no sheet: its first type colour. */
export function fallbackColorFor(speciesId: string | undefined | null): string {
  const sp = speciesId ? SPECIES_DB[speciesId] : undefined;
  const t = sp?.types?.[0];
  return (t && TYPES[t]?.color) || '#4fc3f7';
}

export function creatureDisplayName(speciesId: string | undefined | null, fallback?: string): string {
  const sp = speciesId ? SPECIES_DB[speciesId] : undefined;
  if (sp) return sp.name;
  // Dorowani / Gabu are not in species.ts yet (Gen 2 starters, 147/148).
  if (speciesId === '147') return 'Dorowani';
  if (speciesId === '148') return 'Gabu';
  return fallback || 'Unknown';
}

/** Battle view mapping (Arena spec): opponent shows front, player shows back. */
export function battleView(isPlayer: boolean): SheetView {
  return isPlayer ? 'back' : 'front';
}

/**
 * Battle-only override image for a species on a side, or null to fall back
 * to the 192x64 sheet cell from battleView(). Current overrides:
 * - Dorowani (147) as PLAYER: three-quarter-right cut, facing the opponent.
 * - Gabu (148) as OPPONENT: three-quarter-left cut, facing the player.
 * No side ever reuses a front cut for both sides. No stats, moves, types,
 * or HP are set here — this is sprite selection only.
 */
export function battleSpriteUrl(speciesId: string | undefined | null, isPlayer: boolean): string | null {
  const def = getSheetDef(speciesId);
  if (!def?.battle) return null;
  return isPlayer ? (def.battle.player ?? null) : (def.battle.opponent ?? null);
}
