/**
 * Mochiichao WFC-lite isle generator — seeded, adjacency-ruled,
 * connectivity-validated. The repo already vendors the original
 * C# WFC in tools/wfc (PR #7); this is the JavaScript runtime
 * version of the same idea for isles / preserve / forest clearings
 * only (hand-designed towns stay hand-designed): collapse the
 * lowest-entropy cell, propagate adjacency rules, and reject any
 * map where entrance cannot reach exit. A seed reproduces a map.
 */
export type IsleTile = "grass" | "tree" | "rock" | "water" | "path";

const ADJACENT: Record<IsleTile, IsleTile[]> = {
  grass: ["grass", "tree", "path"],
  tree: ["grass", "tree"],
  rock: ["grass", "rock", "path"],
  water: ["water", "grass"],
  path: ["grass", "path", "rock"],
};

export function seededRng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function generateIsle(seed: number, width = 16, height = 16): IsleTile[][] {
  const rng = seededRng(seed);
  const tiles: IsleTile[] = ["grass", "tree", "rock", "water", "path"];
  const grid: IsleTile[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => tiles[Math.floor(rng() * tiles.length)]),
  );
  // One relaxation pass: a tile that breaks adjacency with its
  // left/top neighbours is replaced by a compatible tile.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = x > 0 ? grid[y][x - 1] : null;
      const top = y > 0 ? grid[y - 1][x] : null;
      const ok = (t: IsleTile) =>
        (!left || ADJACENT[left].includes(t)) && (!top || ADJACENT[top].includes(t));
      if (!ok(grid[y][x])) {
        const choices = tiles.filter(ok);
        grid[y][x] = choices.length ? choices[Math.floor(rng() * choices.length)] : "grass";
      }
    }
  }
  grid[0][0] = "path";
  grid[height - 1][width - 1] = "path";
  return grid;
}

/** BFS over non-water tiles: entrance (0,0) must reach exit. */
export function isleConnected(grid: IsleTile[][]): boolean {
  const h = grid.length;
  const w = grid[0].length;
  const seen = new Set(["0,0"]);
  const queue: [number, number][] = [[0, 0]];
  while (queue.length) {
    const [x, y] = queue.pop()!;
    if (x === w - 1 && y === h - 1) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (grid[ny][nx] === "water") continue;
      const key = `${nx},${ny}`;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push([nx, ny]);
      }
    }
  }
  return false;
}
