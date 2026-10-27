/**
 * Mochiichao Tiled maps — TMJ (Tiled JSON) loader + validator.
 * Pokemon's maps are data (map.json + scripts.inc + warps + object
 * events). Tiled gives the same structure with an editor: one file
 * per map, layers for ground / objects / triggers / warps, custom
 * properties for gate flag / tech / badge. The validator is the
 * 100% gate: a map that fails it cannot be wired.
 */
export type TmjExit = { to: string; enterAt: [number, number]; gate?: string };
/**
 * Array-form exit: one entry per exit tile, as derived from
 * FullWorldMaps.ts (edge exits are generated per tile there, e.g.
 * buildEdgeExits(13, 17, 0, "route_1", 38, "up")). The legacy
 * Record form (sector0.json, keyed by target) still loads.
 */
export type TmjExitTile = {
  x: number;
  y: number;
  to: string;
  enterAt: [number, number];
  dir?: string;
  gate?: string;
  hmNeeded?: string;
};
/** Door warp: a door tile that leads to another map (label + optional
 *  condition preserved from FullWorldMaps.ts, e.g. the Neon City ->
 *  Mauveville Arena door gated on ciphers>=10). */
export type TmjDoor = {
  x: number;
  y: number;
  to: string;
  enterAt: [number, number];
  label?: string;
  condition?: string;
};
export type TmjMap = {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  exits: Record<string, TmjExit> | TmjExitTile[];
  npcs: { id: string; x: number; y: number; name: string; role: string }[];
  signs: { x: number; y: number; text: string }[];
  music?: string;
  wildPool?: string[];
  noWild?: boolean;
  /** FullWorldMaps.ts playerStart, as [x, y]. */
  playerStart?: [number, number];
  weather?: string;
  interior?: boolean;
  doors?: TmjDoor[];
};

export function validateTmjMap(map: TmjMap, allMaps: Record<string, TmjMap>): string[] {
  const errors: string[] = [];
  if (!map.id) errors.push("map has no id");
  if (map.tiles.length !== map.height) errors.push(`${map.id}: tile rows ${map.tiles.length} != height ${map.height}`);
  for (const row of map.tiles) {
    if (row.length !== map.width) errors.push(`${map.id}: tile row length ${row.length} != width ${map.width}`);
  }
  if (map.playerStart) {
    const [px, py] = map.playerStart;
    if (px < 0 || py < 0 || px >= map.width || py >= map.height) {
      errors.push(`${map.id}: playerStart (${px},${py}) is outside the map`);
    }
  }
  const checkTarget = (kind: string, label: string, to: string, enterAt: [number, number]) => {
    const target = allMaps[to];
    if (!target) {
      errors.push(`${map.id}: ${kind} ${label} points to missing map ${to}`);
      return;
    }
    const [ex, ey] = enterAt;
    if (ex < 0 || ey < 0 || ex >= target.width || ey >= target.height) {
      errors.push(`${map.id}: ${kind} ${label} enterAt (${ex},${ey}) is outside ${to}`);
    }
  };
  if (Array.isArray(map.exits)) {
    for (const exit of map.exits) {
      if (exit.x < 0 || exit.y < 0 || exit.x >= map.width || exit.y >= map.height) {
        errors.push(`${map.id}: exit at (${exit.x},${exit.y}) is outside the map`);
      }
      if (exit.gate && !/^[a-z0-9_]+$/.test(exit.gate)) {
        errors.push(`${map.id}: exit gate ${exit.gate} is not a flag name`);
      }
      checkTarget("exit", `(${exit.x},${exit.y})`, exit.to, exit.enterAt);
    }
  } else {
    for (const [key, exit] of Object.entries(map.exits)) {
      const target = allMaps[exit.to];
      if (!target) {
        errors.push(`${map.id}: exit ${key} points to missing map ${exit.to}`);
        continue;
      }
      const [ex, ey] = exit.enterAt;
      if (ex < 0 || ey < 0 || ex >= target.width || ey >= target.height) {
        errors.push(`${map.id}: exit ${key} enterAt (${ex},${ey}) is outside ${exit.to}`);
      }
      if (exit.gate && !/^[a-z0-9_]+$/.test(exit.gate)) {
        errors.push(`${map.id}: exit ${key} gate ${exit.gate} is not a flag name`);
      }
    }
  }
  for (const door of map.doors ?? []) {
    if (door.x < 0 || door.y < 0 || door.x >= map.width || door.y >= map.height) {
      errors.push(`${map.id}: door at (${door.x},${door.y}) is outside the map`);
    }
    checkTarget("door", `(${door.x},${door.y})`, door.to, door.enterAt);
  }
  if (!map.wildPool && !map.noWild) errors.push(`${map.id}: no wildPool and no noWild note`);
  return errors;
}

/** A town is only a town if it has heal + shop + sign. Returns the
 *  missing pieces, so a town that is only a map is never counted. */
export function validateTown(map: TmjMap): string[] {
  const errors: string[] = [];
  if (!map.npcs.some((n) => n.role === "heal")) errors.push(`${map.id}: town has no heal NPC`);
  if (!map.npcs.some((n) => n.role === "shop")) errors.push(`${map.id}: town has no shop NPC`);
  if (map.signs.length === 0) errors.push(`${map.id}: town has no sign`);
  return errors;
}
