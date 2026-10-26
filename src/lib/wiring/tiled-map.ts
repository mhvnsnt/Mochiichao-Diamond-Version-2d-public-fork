/**
 * Mochiichao Tiled maps — TMJ (Tiled JSON) loader + validator.
 * Pokemon's maps are data (map.json + scripts.inc + warps + object
 * events). Tiled gives the same structure with an editor: one file
 * per map, layers for ground / objects / triggers / warps, custom
 * properties for gate flag / tech / badge. The validator is the
 * 100% gate: a map that fails it cannot be wired.
 */
export type TmjExit = { to: string; enterAt: [number, number]; gate?: string };
export type TmjMap = {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  exits: Record<string, TmjExit>;
  npcs: { id: string; x: number; y: number; name: string; role: string }[];
  signs: { x: number; y: number; text: string }[];
  music?: string;
  wildPool?: string[];
  noWild?: boolean;
};

export function validateTmjMap(map: TmjMap, allMaps: Record<string, TmjMap>): string[] {
  const errors: string[] = [];
  if (!map.id) errors.push("map has no id");
  if (map.tiles.length !== map.height) errors.push(`${map.id}: tile rows ${map.tiles.length} != height ${map.height}`);
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
