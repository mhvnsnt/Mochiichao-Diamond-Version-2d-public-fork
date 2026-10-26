// Metatile catalogue: 8x8 tiles -> 16x16 metatiles with behaviour.
//
// Structure (not art) follows how the decomp games lay maps out:
// a map grid of 16x16 blocks, each block built from 4 8x8 tiles and
// carrying collision / encounter / warp behaviour in data. The art
// here is Mochiichao-original or CC0; no Pokemon tile art, tile ids,
// or map names are copied — the legacyTileId column exists ONLY so
// existing main maps (src/world/FullWorldMaps.ts, built on
// src/world/WorldConstants.ts TILE ids) can be re-skinned onto this
// system without re-authoring their grids.
//
// Passability below is copied verbatim from WorldConstants PASSABLE
// and HM_REQUIRED on main (a26a1968). Where PASSABLE says a tile is
// passable but the RULE for it (ice slip, lava damage) lives in
// another lane, that rule is flagged owed, never invented here.
import type { Metatile, TileBehaviour } from './types';

function m(
  id: string,
  label: string,
  behaviour: TileBehaviour,
  encounter: boolean,
  layer: Metatile['layer'],
  legacyTileId: number | null,
  hmRequired: string | null = null,
  animated = false,
): Metatile {
  // metatile-blocks layout: legacy metatile N occupies sheet cells
  // 4N..4N+3, so a legacy grid can be re-skinned by index alone.
  const base = legacyTileId === null ? 0 : legacyTileId * 4;
  return {
    id,
    label,
    behaviour,
    encounter,
    subtiles: [base, base + 1, base + 2, base + 3],
    layer,
    animated,
    legacyTileId,
    hmRequired,
  };
}

export const METATILES: Metatile[] = [
  m('grass', 'Grass', 'walk', false, 'bottom', 0),
  m('wall', 'Wall / tree line', 'solid', false, 'middle', 1),
  m('water', 'Deep water', 'water', false, 'bottom', 2, 'Surf', true),
  m('path', 'Path', 'walk', false, 'bottom', 3),
  m('building', 'Building wall', 'solid', false, 'middle', 4),
  m('door', 'Door', 'door', false, 'middle', 5),
  m('tall_grass', 'Tall grass', 'tallGrass', true, 'middle', 6, null, true),
  m('sand', 'Sand', 'sand', false, 'bottom', 7),
  m('cave_floor', 'Cave floor / entrance', 'walk', false, 'bottom', 8),
  m('ledge', 'Ledge (one-way drop)', 'ledge', false, 'middle', 9),
  m('sign', 'Sign', 'sign', false, 'middle', 10),
  m('neon_path', 'Neon path', 'walk', false, 'bottom', 11, null, true),
  m('industrial', 'Industrial floor', 'walk', false, 'bottom', 12),
  m('shallow', 'Shallow water', 'shallow', false, 'bottom', 13, null, true),
  m('ice', 'Ice (slip rule owed)', 'ice', false, 'bottom', 14),
  m('boulder', 'Boulder (Strength)', 'boulder', false, 'middle', 15, 'Strength'),
  m('cut_tree', 'Cuttable tree (Cut)', 'cutTree', false, 'middle', 16, 'Cut'),
  m('waterfall', 'Waterfall (Waterfall)', 'waterfall', false, 'bottom', 17, 'Waterfall', true),
  m('warp', 'Warp pad', 'warp', false, 'bottom', 18),
  m('stairs_up', 'Stairs up', 'stairsUp', false, 'bottom', 19),
  m('stairs_down', 'Stairs down', 'stairsDown', false, 'bottom', 20),
  m('flower', 'Flowers', 'walk', false, 'middle', 21),
  m('dock', 'Dock', 'dock', false, 'bottom', 22),
  m('fence', 'Fence', 'solid', false, 'middle', 23),
  m('sand_dune', 'Sand dune', 'solid', false, 'middle', 24),
  // PASSABLE says lava is walkable on main; no damage rule is
  // defined anywhere on main, so none is defined here either.
  m('lava', 'Lava (damage rule owed)', 'lava', false, 'bottom', 25, null, true),
];

export const METATILE_BY_ID: Record<string, Metatile> = Object.fromEntries(
  METATILES.map((t) => [t.id, t]),
);
export const METATILE_BY_LEGACY_ID: Record<number, Metatile> = Object.fromEntries(
  METATILES.filter((t) => t.legacyTileId !== null).map((t) => [t.legacyTileId as number, t]),
);

/** Behaviour + encounter flag for a legacy TILE id (0-25). */
export function behaviourForLegacyTile(legacyTileId: number): {
  behaviour: TileBehaviour;
  encounter: boolean;
  solid: boolean;
} {
  const t = METATILE_BY_LEGACY_ID[legacyTileId];
  if (!t) return { behaviour: 'solid', encounter: false, solid: true };
  return {
    behaviour: t.behaviour,
    encounter: t.encounter,
    solid:
      // Fence and sand-dune metatiles already carry behaviour 'solid';
      // boulder / cutTree are solid until their field move is used.
      t.behaviour === 'solid' ||
      t.behaviour === 'boulder' ||
      t.behaviour === 'cutTree' ||
      t.behaviour === 'water' ||
      t.behaviour === 'waterfall',
  };
}

/** Convert one legacy grid row (TILE ids) to metatile ids. */
export function legacyRowToMetatiles(row: number[]): string[] {
  return row.map((id) => METATILE_BY_LEGACY_ID[id]?.id ?? 'wall');
}
