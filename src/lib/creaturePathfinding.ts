import EasyStar from 'easystarjs';

/**
 * Creature Mode wild pathfinding (pass 3) — easystarjs, MIT, pulled
 * from npm (easystarjs 0.4.4), NOT a hand-tooled A* rewrite.
 * easystarjs runs A* over a grid: setGrid, setAcceptableTiles, then
 * findPath + calculate. This wrapper only translates our map into
 * that grid and returns the first step of the path (path[1], since
 * path[0] is the wild's own tile), or null when there is no path,
 * the wild is already adjacent, or the target is unreachable.
 *
 * Grid values are the FULL_WORLD tile numbers. Blocked tiles are
 * 1 (tree), 4 (building) and 2 (water) — the same blocked set
 * Creature Mode has used since pass 1. Every other tile value
 * present on the map is acceptable, so a wild can path through
 * grass, paths and doors exactly as the player can walk them.
 */
export interface TilePos {
  x: number;
  y: number;
}

export function findNextStep(
  tiles: number[][],
  blocked: Set<number>,
  from: TilePos,
  to: TilePos,
): TilePos | null {
  if (from.x === to.x && from.y === to.y) return null;
  const acceptable = new Set<number>();
  for (const row of tiles) {
    for (const v of row) {
      if (!blocked.has(v)) acceptable.add(v);
    }
  }
  const finder = new EasyStar.js();
  finder.setGrid(tiles);
  finder.setAcceptableTiles(Array.from(acceptable));
  // Sync mode is REQUIRED here: in easystarjs's default async mode,
  // one calculate() call does not fire the callback yet (verified:
  // async returned no path, sync returned the full path on the same
  // grid). With sync on, findPath + calculate returns the path now.
  finder.enableSync();
  let result: TilePos[] | null = null;
  finder.findPath(from.x, from.y, to.x, to.y, (path) => {
    result = path as TilePos[] | null;
  });
  finder.calculate();
  if (!result || result.length < 2) return null;
  return result[1];
}
