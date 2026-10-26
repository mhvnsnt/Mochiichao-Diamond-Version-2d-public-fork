// Tileset / background system — shared types (plan section 6).
// This module owns DEFINITIONS only: tile sizes, behaviours, tileset
// shapes, layer order, time/season/weather variant shapes. It does not
// own the Tiled TMJ loader (open PR #61, src/lib/wiring/tiled-map.ts),
// the WFC generator (open PR #61, src/lib/wiring/wfc-isle.ts), or the
// field/weather state machine (main src/lib/fieldWeather.ts (main fieldWeather.ts (PR #64, merged), merged)).
// Those stay separate; this system consumes their shapes and is the
// place a map header points at when it says "which tileset, which
// background, which weather".

/** One small tile: 8x8 px, the GBA/DS base unit. */
export const TILE_PX = 8;
/** One metatile: 16x16 px = 2x2 small tiles, the map-grid unit. */
export const METATILE_PX = 16;
export const SUBTILES_PER_METATILE = 4;

/**
 * What a metatile DOES when the player (or a creature) steps on it.
 * Behaviour is data, not art: two tilesets can draw the same behaviour
 * differently and the game still treats them the same way.
 */
export type TileBehaviour =
  | 'walk' // ordinary ground, passable
  | 'solid' // wall / tree trunk / fence: never passable
  | 'tallGrass' // passable, wild encounters roll here
  | 'water' // not walkable; needs Surf (see WorldConstants HM_REQUIRED)
  | 'shallow' // passable shallow water (no Surf needed)
  | 'surf' // deep water you are already surfing on
  | 'ledge' // one-way drop: passable only in the map's ledge direction
  | 'door' // passable; triggers the map's door warp on step
  | 'warp' // passable; triggers a warp (stairs/portal use warpTo)
  | 'stairsUp'
  | 'stairsDown'
  | 'sign' // passable; interactable sign text
  | 'counter' // passable from one side only in play; solid to walk-through
  | 'boulder' // solid until Strength is used on it
  | 'cutTree' // solid until Cut is used on it
  | 'waterfall' // surfable water that needs Waterfall to climb
  | 'ice' // passable; SLIPPERY movement rule is owed to the movement
  // lane (not invented here) — this behaviour only marks the tile.
  | 'sand' // passable sand / dune floor
  | 'lava' // marked passable in WorldConstants PASSABLE, but any
  // damage rule is owed to the movement lane — not invented here.
  | 'bridge' // passable; draws over water on the overhead layer
  | 'dock'; // passable wooden dock over water

/** Which Pixi layer a metatile's art belongs on. */
export type MetatileLayer = 'bottom' | 'middle' | 'top';

export interface Metatile {
  /** Stable id, e.g. 'grass', 'tall_grass', 'door'. Never renamed. */
  id: string;
  label: string;
  behaviour: TileBehaviour;
  /** True when wild encounters may roll on this metatile. */
  encounter: boolean;
  /** The 4 subtiles, [top-left, top-right, bottom-left, bottom-right],
   *  as 8x8 cell indices into the tileset sheet (see tilesets.ts for
   *  the two sheet layouts). */
  subtiles: [number, number, number, number];
  /** Drawing layer for this metatile's art. */
  layer: MetatileLayer;
  /** True when the sheet cell animates (water shimmer, neon flicker). */
  animated: boolean;
  /** Legacy WorldConstants TILE id this metatile replaces, if any. */
  legacyTileId: number | null;
  /** Field-move / HM key needed, matching WorldConstants HM_REQUIRED. */
  hmRequired: string | null;
}

/** How a sheet's cells map to metatiles. */
export type SheetLayout =
  | 'metatile-blocks'
  // 8px sheet: metatile N occupies consecutive 8x8 cells 4N..4N+3.
  | 'single-16';
  // 16px sheet (Kenney Tiny City, 0x72): one sheet cell IS one
  // metatile; its 4 quadrants are the 8x8 subtiles at draw time.

export interface TilesetDef {
  id: string;
  label: string;
  kind: 'primary' | 'secondary';
  /** Where the art comes from. 'original-placeholder' = flat-colour
   *  placeholder drawn for the system, replaced by real art later.
   *  'cc0-in-repo' / 'cc0-pending-download' are the only other
   *  allowed values here — no Pokemon art, no paid assets. */
  source: 'original-placeholder' | 'cc0-in-repo' | 'cc0-pending-download';
  licence: string;
  /** Repo path of the sheet, or null until downloaded / drawn. */
  sheet: string | null;
  sheetLayout: SheetLayout;
  /** Metatile ids this tileset provides (subset of the catalogue). */
  metatiles: string[];
}

/** Pixi draw order, bottom to top. UI is deliberately NOT in this
 *  list: UI is React/DOM outside the canvas and is never tinted,
 *  never weathered, never parallaxed. */
export const LAYER_ORDER = [
  'sky',
  'far',
  'groundBottom',
  'groundMiddle',
  'actors',
  'overheadTop',
  'weather',
  'tintOverlay',
] as const;
export type LayerId = (typeof LAYER_ORDER)[number];

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** A place's tileset assignment: one primary + 0..n secondaries.
 *  This is the whole "30+ places are cheap recombinations" idea:
 *  a new place is a new row here, not a new painting. */
export interface PlaceTileset {
  placeId: string;
  placeName: string;
  /** FULL_WORLD export key on main, or null for planned places. */
  legacyMap: string | null;
  primary: string;
  secondary: string[];
  /** Battle background biome this place derives (see backgrounds.json). */
  battleBiome: string;
  /** Default weather variant key (see weather.json). */
  weatherDefault: string;
  /** 'wired' = an existing main map assigned to this tileset.
   *  'catalogued' = planned place, row defined, map not yet built. */
  status: 'wired' | 'catalogued';
  /** WFC/Markov filler may generate wild variants of this place only
   *  when true AND the place is not a story map (see wfcRules.ts). */
  fillerEligible: boolean;
}
