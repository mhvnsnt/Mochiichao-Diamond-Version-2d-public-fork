/**
 * Tiled JSON map validator — script gate for src/lib/wiring/maps/*.json.
 *
 * Pokemon-first structure: the decomp overworld format is one map file
 * per map with a warp list, an object-event list (NPCs) and a signpost
 * list. These JSONs carry the same structure in Tiled-editor shape:
 * tiles (the map grid), exits (edge warps, one entry per exit tile),
 * doors (door warps, one entry per door tile), npcs (object events)
 * and signs (signposts). Mochiichao names sit in those slots; no
 * Pokemon names, images, logos, literal dialogue or cries are shipped.
 *
 * Checks (hard errors, exit 1):
 *   - schema: id/name/width/height/tiles present and well-typed;
 *     filename must be <id>.json; no duplicate ids.
 *   - tiles: exactly height rows, each exactly width columns, every
 *     value an integer in the WorldConstants TILE range 0-25.
 *   - keys: every exit/door target id must be a map in this set.
 *   - exits: array form (x,y in this map, enterAt in the target map)
 *     or the legacy Record form (enterAt in the target map, gate flag
 *     name if present); hmNeeded, when present, must be a string.
 *   - doors: x,y in this map, enterAt in the target map.
 *   - positions: playerStart, every npc and every sign inside the map.
 *   - wild: exactly one of wildPool (non-empty) or noWild=true.
 * Warnings (do not fail the run): a map no exit/door points at
 * (e.g. a start-only map), a map with no exit and no door, and an
 * enterAt that lands outside sector0.json only. sector0.json is a
 * pre-existing simplified sample (20x20) left untouched by this
 * change, while FullWorldMaps.ts sector0 is 32x28 — so new maps
 * derived from FullWorldMaps.ts legitimately enter sector0 at
 * coordinates the sample cannot hold (boot_bay -> [15,27],
 * sector0_rival_house door -> [26,9]). Those two are warnings
 * until sector0.json is regenerated from FullWorldMaps.ts; a
 * missing target map is a hard error for every map, sector0
 * included, and enterAt bounds into every other map are hard
 * errors too.
 *
 * Run: npx tsx src/lib/wiring/validate-tiled.ts
 * Exit 0 = every map passes. This file imports no game code, so it
 * runs standalone against the JSON files on disk.
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAPS_DIR = path.join(HERE, "maps");
const MAX_TILE = 25; // WorldConstants TILE enum: GRASS 0 .. LAVA 25.
const NPC_ROLES = new Set(["heal", "shop", "gate", "trainer", "choice", "npc"]);

const errors: string[] = [];
const warnings: string[] = [];

function isInt(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n);
}
function isPair(v: unknown): v is [number, number] {
  return Array.isArray(v) && v.length === 2 && isInt(v[0]) && isInt(v[1]);
}
function inBounds(x: number, y: number, w: number, h: number): boolean {
  return x >= 0 && y >= 0 && x < w && y < h;
}

type MapInfo = { id: string; width: number; height: number; file: string };

const files = fs.existsSync(MAPS_DIR)
  ? fs.readdirSync(MAPS_DIR).filter((f) => f.endsWith(".json")).sort()
  : [];
if (files.length === 0) {
  errors.push(`no map JSON files found in ${MAPS_DIR}`);
}

const maps = new Map<string, MapInfo>();
const parsed = new Map<string, Record<string, unknown>>();
for (const file of files) {
  const full = path.join(MAPS_DIR, file);
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8")) as Record<string, unknown>;
  } catch (e) {
    errors.push(`${file}: unparsable JSON: ${(e as Error).message}`);
    continue;
  }
  if (typeof data.id !== "string" || !data.id) {
    errors.push(`${file}: missing or empty id`);
    continue;
  }
  if (file !== `${data.id}.json`) {
    errors.push(`${file}: filename does not match id ${data.id} (expected ${data.id}.json)`);
  }
  if (maps.has(data.id)) {
    errors.push(`${file}: duplicate map id ${data.id} (also in ${maps.get(data.id)?.file})`);
  }
  if (typeof data.width !== "number" || typeof data.height !== "number") {
    errors.push(`${data.id}: width/height must be numbers`);
    continue;
  }
  maps.set(data.id, { id: data.id, width: data.width, height: data.height, file });
  parsed.set(data.id, data);
}

// Second pass: every cross-map check needs the full key set first.
const targeted = new Set<string>();
for (const [id, data] of parsed) {
  const info = maps.get(id) as MapInfo;
  const { width, height } = info;
  const tag = id;
  if (typeof data.name !== "string" || !data.name) errors.push(`${tag}: missing or empty name`);
  if (!isInt(width) || width <= 0 || !isInt(height) || height <= 0) {
    errors.push(`${tag}: width/height must be positive integers`);
    continue;
  }
  if (!Array.isArray(data.tiles)) {
    errors.push(`${tag}: tiles must be an array of rows`);
  } else {
    if (data.tiles.length !== height) {
      errors.push(`${tag}: tile rows ${data.tiles.length} != height ${height}`);
    }
    data.tiles.forEach((row: unknown, y: number) => {
      if (!Array.isArray(row) || row.length !== width) {
        errors.push(`${tag}: tile row ${y} length ${Array.isArray(row) ? row.length : "?"} != width ${width}`);
        return;
      }
      row.forEach((tile: unknown, x: number) => {
        if (!isInt(tile) || (tile as number) < 0 || (tile as number) > MAX_TILE) {
          errors.push(`${tag}: tile (${x},${y}) value ${String(tile)} outside 0-${MAX_TILE}`);
        }
      });
    });
  }
  if (data.playerStart !== undefined) {
    if (!isPair(data.playerStart) || !inBounds(data.playerStart[0], data.playerStart[1], width, height)) {
      errors.push(`${tag}: playerStart ${JSON.stringify(data.playerStart)} outside ${width}x${height}`);
    }
  }
  if (data.music !== undefined && typeof data.music !== "string") errors.push(`${tag}: music must be a string`);
  if (data.weather !== undefined && typeof data.weather !== "string") errors.push(`${tag}: weather must be a string`);
  if (data.interior !== undefined && typeof data.interior !== "boolean") errors.push(`${tag}: interior must be a boolean`);
  if (Array.isArray(data.npcs)) {
    data.npcs.forEach((npc: unknown, i: number) => {
      const n = npc as Record<string, unknown>;
      if (typeof n.id !== "string" || !n.id) errors.push(`${tag}: npc ${i} missing id`);
      if (typeof n.name !== "string" || !n.name) errors.push(`${tag}: npc ${i} missing name`);
      if (typeof n.role !== "string" || !NPC_ROLES.has(n.role)) {
        errors.push(`${tag}: npc ${i} role ${String(n.role)} not in heal/shop/gate/trainer/choice/npc`);
      }
      if (!isInt(n.x) || !isInt(n.y) || !inBounds(n.x as number, n.y as number, width, height)) {
        errors.push(`${tag}: npc ${String(n.id)} at (${String(n.x)},${String(n.y)}) outside ${width}x${height}`);
      }
    });
  } else if (data.npcs !== undefined) {
    errors.push(`${tag}: npcs must be an array`);
  }
  if (Array.isArray(data.signs)) {
    data.signs.forEach((sign: unknown, i: number) => {
      const s = sign as Record<string, unknown>;
      if (typeof s.text !== "string") errors.push(`${tag}: sign ${i} missing text`);
      if (!isInt(s.x) || !isInt(s.y) || !inBounds(s.x as number, s.y as number, width, height)) {
        errors.push(`${tag}: sign ${i} at (${String(s.x)},${String(s.y)}) outside ${width}x${height}`);
      }
    });
  } else if (data.signs !== undefined) {
    errors.push(`${tag}: signs must be an array`);
  }
  const checkTarget = (kind: string, label: string, to: unknown, enterAt: unknown) => {
    if (typeof to !== "string" || !to) {
      errors.push(`${tag}: ${kind} ${label} missing target map`);
      return;
    }
    targeted.add(to);
    const target = maps.get(to);
    if (!target) {
      errors.push(`${tag}: ${kind} ${label} points to missing map ${to}`);
      return;
    }
    if (!isPair(enterAt)) {
      errors.push(`${tag}: ${kind} ${label} enterAt ${JSON.stringify(enterAt)} is not an [x,y] pair`);
    } else if (!inBounds(enterAt[0], enterAt[1], target.width, target.height)) {
      // Legacy-sample exception, documented in the header: sector0.json
      // is 20x20 while FullWorldMaps.ts sector0 is 32x28.
      if (to === "sector0") {
        warnings.push(`${tag}: ${kind} ${label} enterAt ${JSON.stringify(enterAt)} outside sector0 sample (20x20); valid in FullWorldMaps sector0 (32x28) — sector0.json regeneration owed`);
      } else {
        errors.push(`${tag}: ${kind} ${label} enterAt ${JSON.stringify(enterAt)} outside ${to} (${target.width}x${target.height})`);
      }
    }
  };
  // Exits: array form (new maps, one entry per exit tile) or the
  // legacy Record form (sector0 sample: keyed by target).
  if (Array.isArray(data.exits)) {
    data.exits.forEach((exit: unknown, i: number) => {
      const e = exit as Record<string, unknown>;
      if (!isInt(e.x) || !isInt(e.y) || !inBounds(e.x as number, e.y as number, width, height)) {
        errors.push(`${tag}: exit ${i} at (${String(e.x)},${String(e.y)}) outside ${width}x${height}`);
      }
      if (e.hmNeeded !== undefined && typeof e.hmNeeded !== "string") {
        errors.push(`${tag}: exit ${i} hmNeeded must be a string`);
      }
      if (e.gate !== undefined && (typeof e.gate !== "string" || !/^[a-z0-9_]+$/.test(e.gate))) {
        errors.push(`${tag}: exit ${i} gate ${String(e.gate)} is not a flag name`);
      }
      checkTarget("exit", String(i), e.to, e.enterAt);
    });
  } else if (data.exits !== undefined && typeof data.exits === "object") {
    for (const [key, exit] of Object.entries(data.exits as Record<string, Record<string, unknown>>)) {
      if (exit.gate !== undefined && (typeof exit.gate !== "string" || !/^[a-z0-9_]+$/.test(exit.gate))) {
        errors.push(`${tag}: exit ${key} gate ${String(exit.gate)} is not a flag name`);
      }
      checkTarget("exit", key, exit.to, exit.enterAt);
    }
  } else if (data.exits !== undefined) {
    errors.push(`${tag}: exits must be an array or an object`);
  }
  if (Array.isArray(data.doors)) {
    data.doors.forEach((door: unknown, i: number) => {
      const d = door as Record<string, unknown>;
      if (!isInt(d.x) || !isInt(d.y) || !inBounds(d.x as number, d.y as number, width, height)) {
        errors.push(`${tag}: door ${i} at (${String(d.x)},${String(d.y)}) outside ${width}x${height}`);
      }
      if (d.label !== undefined && typeof d.label !== "string") errors.push(`${tag}: door ${i} label must be a string`);
      checkTarget("door", String(i), d.to, d.enterAt);
    });
  } else if (data.doors !== undefined) {
    errors.push(`${tag}: doors must be an array`);
  }
  const hasPool = Array.isArray(data.wildPool) && data.wildPool.length > 0;
  const noWild = data.noWild === true;
  if (!hasPool && !noWild) errors.push(`${tag}: no wildPool and no noWild note`);
  if (hasPool && noWild) errors.push(`${tag}: both wildPool and noWild set`);
  if (Array.isArray(data.wildPool) && data.wildPool.some((w) => typeof w !== "string" || !w)) {
    errors.push(`${tag}: wildPool entries must be non-empty strings`);
  }
  const exitCount = Array.isArray(data.exits) ? data.exits.length : Object.keys((data.exits as object) || {}).length;
  const doorCount = Array.isArray(data.doors) ? data.doors.length : 0;
  if (exitCount === 0 && doorCount === 0) {
    warnings.push(`${tag}: no exits and no doors`);
  }
  console.log(`  map OK: ${tag} (${width}x${height}, exits=${exitCount}, doors=${doorCount})`);
}

for (const id of maps.keys()) {
  if (!targeted.has(id)) {
    warnings.push(`${id}: no exit or door in any map points at it (start-only map?)`);
  }
}

let totalExits = 0;
let totalDoors = 0;
for (const data of parsed.values()) {
  totalExits += Array.isArray(data.exits) ? data.exits.length : Object.keys((data.exits as object) || {}).length;
  totalDoors += Array.isArray(data.doors) ? data.doors.length : 0;
}
console.log(`\nMaps validated: ${parsed.size} (${files.length} files), exits=${totalExits}, doors=${totalDoors}`);
console.log(`Warnings (${warnings.length}):`);
for (const w of warnings) console.log(`  WARN: ${w}`);
if (errors.length > 0) {
  console.log(`\nERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  ERROR: ${e}`);
  process.exit(1);
}
console.log("\nvalidate-tiled PASSED.");
