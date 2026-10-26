// Primary + secondary tileset registry.
//
// A place uses exactly ONE primary (its ground/walls/water — the
// full metatile set it needs) plus any number of secondaries
// (detail overlays: flowers, signs, snow, neon signs). That is what
// makes 30+ places cheap: new places recombine these sets instead
// of commissioning a new backdrop per place.
//
// Art rules, enforced by the `source` field: only
// 'original-placeholder' (drawn for this system), 'cc0-in-repo'
// (already on main with a licence note), or 'cc0-pending-download'
// (Kenney / 0x72, CC0 verified 2026-10-25 — see docs/tileset-system.md
// and tools/fetch-tilesets.sh, which refuses to install a pack whose
// licence file does not say CC0). No Pokemon tile art, no paid art.
// Sheets that are null are NOT shipped and NOT referenced by any
// live renderer path — the Pixi layer renderer draws flat-colour
// placeholder rectangles for them until real art lands.
import type { TilesetDef } from './types';

const ALL = [
  'grass', 'wall', 'water', 'path', 'building', 'door', 'tall_grass',
  'sand', 'cave_floor', 'ledge', 'sign', 'neon_path', 'industrial',
  'shallow', 'ice', 'boulder', 'cut_tree', 'waterfall', 'warp',
  'stairs_up', 'stairs_down', 'flower', 'dock', 'fence', 'sand_dune', 'lava',
];

export const PRIMARY_TILESETS: TilesetDef[] = [
  { id: 'field', label: 'Field — grass, paths, flowers, fences', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['grass', 'path', 'tall_grass', 'flower', 'fence', 'ledge', 'sign', 'wall'] },
  { id: 'town', label: 'Town — buildings, doors, signs, paths', kind: 'primary',
    source: 'cc0-pending-download', licence: 'CC0 — Kenney Tiny Town / Tiny City (attribution optional, credited anyway)',
    sheet: null, sheetLayout: 'single-16',
    metatiles: ['building', 'door', 'sign', 'path', 'grass', 'fence', 'wall'] },
  { id: 'forest', label: 'Forest — trees, tall grass, flowers', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['wall', 'tall_grass', 'grass', 'flower', 'cut_tree', 'path', 'ledge'] },
  { id: 'cave', label: 'Cave / dungeon — rock, stairs, boulders', kind: 'primary',
    source: 'cc0-in-repo', licence: 'CC0 — 0x72 DungeonTileset II (author-confirmed CC0)',
    sheet: 'src/assets/open-source/dungeon-tileset-ii/0x72_DungeonTilesetII_v1.2.png',
    sheetLayout: 'single-16',
    metatiles: ['cave_floor', 'wall', 'boulder', 'stairs_up', 'stairs_down', 'warp', 'lava', 'ice'] },
  { id: 'shore', label: 'Shore — water, shallow, sand, docks', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['water', 'shallow', 'sand', 'sand_dune', 'dock', 'path', 'grass', 'waterfall'] },
  { id: 'neon-city', label: 'Neon city — neon paths, industrial, signs', kind: 'primary',
    source: 'cc0-pending-download', licence: 'CC0 — Kenney Tiny City (16x16, 130 files, attribution optional, credited anyway)',
    sheet: null, sheetLayout: 'single-16',
    metatiles: ['neon_path', 'industrial', 'building', 'door', 'sign', 'path', 'wall'] },
  { id: 'scrap', label: 'Scrap / junkyard — industrial, walls, sand', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['industrial', 'wall', 'sand', 'boulder', 'path', 'fence'] },
  { id: 'interior', label: 'Interior — lab, plex, arena floors', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['industrial', 'path', 'door', 'warp', 'stairs_up', 'stairs_down', 'sign', 'wall'] },
  { id: 'arena', label: 'Arena — gauntlet floors, warps, stairs', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['industrial', 'warp', 'stairs_up', 'stairs_down', 'door', 'wall', 'neon_path'] },
  { id: 'mansion', label: 'Mansion — wood floors, doors, stairs', kind: 'primary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder (flat colours, no art asset)',
    sheet: null, sheetLayout: 'metatile-blocks',
    metatiles: ['path', 'door', 'stairs_up', 'stairs_down', 'sign', 'wall', 'building'] },
];

export const SECONDARY_TILESETS: TilesetDef[] = [
  { id: 'flowers', label: 'Flower overlays', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['flower', 'tall_grass'] },
  { id: 'signs-doors', label: 'Extra signs and doors', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['sign', 'door'] },
  { id: 'water-anim', label: 'Animated water / shallow / waterfall', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['water', 'shallow', 'waterfall'] },
  { id: 'snow-cover', label: 'Snow cover over any primary', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['ice', 'grass', 'path'] },
  { id: 'neon-signs', label: 'Neon sign overlays', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['neon_path', 'sign'] },
  { id: 'ruins', label: 'Ruined walls and rubble', kind: 'secondary',
    source: 'original-placeholder', licence: 'Mochiichao-original placeholder',
    sheet: null, sheetLayout: 'metatile-blocks', metatiles: ['wall', 'boulder', 'sand_dune'] },
];

export const TILESETS: TilesetDef[] = [...PRIMARY_TILESETS, ...SECONDARY_TILESETS];
export const TILESET_BY_ID: Record<string, TilesetDef> = Object.fromEntries(
  TILESETS.map((t) => [t.id, t]),
);

/** Every catalogue metatile must be provided by at least one primary. */
export function uncoveredMetatiles(): string[] {
  const covered = new Set(PRIMARY_TILESETS.flatMap((t) => t.metatiles));
  return ALL.filter((id) => !covered.has(id));
}
