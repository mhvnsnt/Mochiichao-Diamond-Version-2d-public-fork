// WFC / Markov filler rules — what filler may and may not generate.
//
// This file is NOT a generator. The generator lives in open PR #61
// (src/lib/wiring/wfc-isle.ts). This file is the RULE that gates it:
// filler is allowed ONLY for wild caves, wild dungeons, and gardens,
// ONLY with connectivity validation, and NEVER for story maps.
// A generated map that fails connectivity validation is rejected,
// never shipped with a disconnected room, unreachable exit, or
// unwinnable pocket.
import { PLACE_BY_ID } from './places';

/** Place kinds filler may touch. Everything else is story and is
 *  hand-built from its tileset row, never generated. */
export const FILLER_ELIGIBLE_KINDS = ['wild-cave', 'wild-dungeon', 'garden'] as const;

/** Story maps: never generated, even if a row says fillerEligible.
 *  The wired 16 are all story maps by definition (existing main maps). */
export const STORY_PLACE_IDS = [
  'boot-harbor', 'aeon-lab', 'route-1-greenfield', 'silicon-mochiiplex',
  'silicon-town', 'dojo-1-core-gate', 'binary-woods', 'cave-of-echoes',
  'neon-city', 'scrap-junkyard', 'coral-approach', 'castagnoli-island',
  'mauveville-arena', 'boot-bay', 'luigi-mansion', 'dojo-2-wind-wing',
];

/** Filler may generate a variant of this place id only if its row is
 *  fillerEligible AND it is not a story place. */
export function fillerAllowed(placeId: string): boolean {
  if (STORY_PLACE_IDS.includes(placeId)) return false;
  return PLACE_BY_ID[placeId]?.fillerEligible === true;
}

/**
 * Connectivity validation for a generated grid (metatile ids or
 * legacy tile ids — both are strings/numbers here, so the caller
 * passes walkability per cell). Rules:
 *  - every walkable cell must be reachable from the entrance by
 *    4-directional flood fill (no disconnected rooms);
 *  - every exit cell must be walkable and reachable;
 *  - at least one walkable cell must exist.
 * Returns error strings; empty = valid. This is the 100% gate for
 * filler maps, mirroring PR #61's "validator is the 100% gate" rule
 * for Tiled maps.
 */
export function validateFillerConnectivity(
  walkable: boolean[][],
  entrance: { x: number; y: number },
  exits: { x: number; y: number }[],
): string[] {
  const errors: string[] = [];
  const h = walkable.length;
  const w = h > 0 ? walkable[0].length : 0;
  if (h === 0 || w === 0) return ['filler grid is empty'];
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h;
  if (!inBounds(entrance.x, entrance.y) || !walkable[entrance.y][entrance.x]) {
    errors.push('filler entrance is outside the grid or not walkable');
    return errors;
  }
  const seen = new Set<string>([`${entrance.x},${entrance.y}`]);
  const stack = [entrance];
  while (stack.length > 0) {
    const c = stack.pop() as { x: number; y: number };
    for (const d of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
      const nx = c.x + d.x;
      const ny = c.y + d.y;
      const key = `${nx},${ny}`;
      if (inBounds(nx, ny) && walkable[ny][nx] && !seen.has(key)) {
        seen.add(key);
        stack.push({ x: nx, y: ny });
      }
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (walkable[y][x] && !seen.has(`${x},${y}`)) {
        errors.push(`filler walkable cell (${x},${y}) is disconnected from the entrance`);
      }
    }
  }
  for (const e of exits) {
    if (!inBounds(e.x, e.y) || !walkable[e.y][e.x]) {
      errors.push(`filler exit (${e.x},${e.y}) is outside the grid or not walkable`);
    } else if (!seen.has(`${e.x},${e.y}`)) {
      errors.push(`filler exit (${e.x},${e.y}) is unreachable from the entrance`);
    }
  }
  return errors;
}
