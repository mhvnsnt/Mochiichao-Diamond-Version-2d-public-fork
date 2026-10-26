/**
 * Mochiichao pathfinding — easystarjs (MIT) adapter.
 * Pokemon's NPC walks are scripted steps in scripts.inc: if a tile
 * changes, the script breaks. This adapter paths on the actual map
 * grid, so Aeon leading the player to the lab, Mom walking to the
 * truck, and follower creatures all work when a town layout changes.
 * Diagonal movement is OFF by default: Mochiichao movement is
 * 4-directional, like the decomps' tile movement.
 */
import EasyStar from "easystarjs";

export type Grid = number[][]; // grid[y][x], 0 = walkable by default
export type Point = { x: number; y: number };

export function makePathfinder(grid: Grid, walkable: number[] = [0]) {
  const star = new EasyStar.js();
  star.setGrid(grid);
  star.setAcceptableTiles(walkable);
  star.setIterationsPerCalculation(1000);
  return {
    findPath(from: Point, to: Point): Promise<Point[] | null> {
      return new Promise((resolve) => {
        star.findPath(from.x, from.y, to.x, to.y, (path) => {
          resolve(path === null ? null : path.map((p) => ({ x: p.x, y: p.y })));
        });
        star.calculate();
      });
    },
    /** Follower rule: the follower paths to where the player was
     *  `trail` steps ago, not to the player's current tile, so it
     *  trails behind instead of stacking on top of the player. */
    followerTarget(playerTrail: Point[], trail = 3): Point | null {
      if (playerTrail.length === 0) return null;
      return playerTrail[Math.max(0, playerTrail.length - 1 - trail)];
    },
  };
}
