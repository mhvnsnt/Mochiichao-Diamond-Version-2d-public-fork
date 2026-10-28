// Places catalogue: 32 places, one row each, one primary tileset
// + secondaries per place. 16 rows are WIRED: they reproduce the 16
// map names and FULL_WORLD export keys on main verbatim (names are
// copied for wiring only — this PR renames nothing, so existing
// exits, NPCs, and saves keep working). 16 rows are CATALOGUED:
// planned places with ORIGINAL names only (no Pokemon place names
// are introduced by this PR). A catalogued place becomes wired when
// its map grid is built from its row's tilesets — no new painting.
//
// Counts (see docs/tileset-system.md for the percentage table):
// wired 16/32 = 50% of the catalogue, 16/30 = 53% of the 30-place
// target; catalogued 16/32 = 50%; catalogue coverage 32/30 = 107%.
import type { PlaceTileset } from './types';

export const PLACES: PlaceTileset[] = [
  // ---- Wired: existing main maps (names verbatim from FullWorldMaps.ts) ----
  { placeId: 'boot-harbor', placeName: 'Sector 0 — Boot Harbor', legacyMap: 'SECTOR_0', primary: 'shore', secondary: ['signs-doors'], battleBiome: 'shore', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'aeon-lab', placeName: "Aeon's Lab", legacyMap: 'AEON_LAB', primary: 'interior', secondary: ['signs-doors'], battleBiome: 'interior', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'route-1-greenfield', placeName: 'Route 1.0 — Greenfield Path', legacyMap: 'ROUTE_1', primary: 'field', secondary: ['flowers'], battleBiome: 'grass', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'silicon-mochiiplex', placeName: 'Silicon Town MochiiPlex', legacyMap: 'MOCHIIPLEX_1', primary: 'interior', secondary: ['signs-doors'], battleBiome: 'interior', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'silicon-town', placeName: 'Silicon Town', legacyMap: 'BINARY_FIELDS', primary: 'town', secondary: ['flowers', 'signs-doors'], battleBiome: 'town', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'dojo-1-core-gate', placeName: 'Dojo 1 — The Core Gate', legacyMap: 'DOJO_1', primary: 'arena', secondary: ['signs-doors'], battleBiome: 'arena', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'binary-woods', placeName: 'The Dark Forest's, legacyMap: 'BINARY_WOODS', primary: 'forest', secondary: ['flowers'], battleBiome: 'forest', weatherDefault: 'mist', status: 'wired', fillerEligible: false },
  { placeId: 'cave-of-echoes', placeName: 'Cave of Echoes — B1F', legacyMap: 'CAVE_OF_ECHOES', primary: 'cave', secondary: ['ruins'], battleBiome: 'cave', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'neon-city', placeName: 'Neon City', legacyMap: 'NEON_CITY', primary: 'neon-city', secondary: ['neon-signs'], battleBiome: 'city', weatherDefault: 'neon-rain', status: 'wired', fillerEligible: false },
  { placeId: 'scrap-junkyard', placeName: 'The Scrap Junkyard', legacyMap: 'SCRAP_JUNKYARD', primary: 'scrap', secondary: ['ruins'], battleBiome: 'industrial', weatherDefault: 'smog', status: 'wired', fillerEligible: false },
  { placeId: 'coral-approach', placeName: 'Coral Reef Approach', legacyMap: 'CORAL_APPROACH', primary: 'shore', secondary: ['water-anim'], battleBiome: 'water', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'castagnoli-island', placeName: "Castagnoli Island — Luigi's Reserve", legacyMap: 'CASTAGNOLI_ISLAND', primary: 'forest', secondary: ['water-anim', 'flowers'], battleBiome: 'forest', weatherDefault: 'jungle-leaves', status: 'wired', fillerEligible: false },
  { placeId: 'mauveville-arena', placeName: 'Mauveville Arena — The Gauntlet', legacyMap: 'MAUVEVILLE_ARENA', primary: 'arena', secondary: ['neon-signs'], battleBiome: 'arena', weatherDefault: 'neon-rain', status: 'wired', fillerEligible: false },
  { placeId: 'boot-bay', placeName: 'Boot Bay', legacyMap: 'BOOT_BAY', primary: 'shore', secondary: ['water-anim'], battleBiome: 'water', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'luigi-mansion', placeName: "Luigi's Mansion", legacyMap: 'LUIGI_MANSION', primary: 'mansion', secondary: ['signs-doors'], battleBiome: 'interior', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  { placeId: 'dojo-2-wind-wing', placeName: 'Aero Dojo — Wind Wing', legacyMap: 'DOJO_2', primary: 'arena', secondary: ['signs-doors'], battleBiome: 'arena', weatherDefault: 'clear', status: 'wired', fillerEligible: false },
  // ---- Catalogued: planned places, original names only ----
  { placeId: 'emberfall-pass', placeName: 'Emberfall Pass', legacyMap: null, primary: 'field', secondary: ['ruins'], battleBiome: 'grass', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'frostbite-hollow', placeName: 'Frostbite Hollow', legacyMap: null, primary: 'cave', secondary: ['snow-cover'], battleBiome: 'snow', weatherDefault: 'snow', status: 'catalogued', fillerEligible: true },
  { placeId: 'mirror-lake', placeName: 'Mirror Lake', legacyMap: null, primary: 'shore', secondary: ['water-anim'], battleBiome: 'water', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'clockwork-market', placeName: 'Clockwork Market', legacyMap: null, primary: 'town', secondary: ['neon-signs'], battleBiome: 'town', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'sunken-archive', placeName: 'Sunken Archive', legacyMap: null, primary: 'cave', secondary: ['water-anim', 'ruins'], battleBiome: 'cave', weatherDefault: 'mist', status: 'catalogued', fillerEligible: false },
  { placeId: 'whispering-garden', placeName: 'Whispering Garden', legacyMap: null, primary: 'forest', secondary: ['flowers'], battleBiome: 'grass', weatherDefault: 'leaves', status: 'catalogued', fillerEligible: true },
  { placeId: 'rustwater-docks', placeName: 'Rustwater Docks', legacyMap: null, primary: 'shore', secondary: ['ruins'], battleBiome: 'water', weatherDefault: 'mist', status: 'catalogued', fillerEligible: false },
  { placeId: 'starlight-observatory', placeName: 'Starlight Observatory', legacyMap: null, primary: 'interior', secondary: ['signs-doors'], battleBiome: 'interior', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'thorn-maze', placeName: 'Thorn Maze', legacyMap: null, primary: 'forest', secondary: ['flowers'], battleBiome: 'forest', weatherDefault: 'leaves', status: 'catalogued', fillerEligible: true },
  { placeId: 'cinder-quarry', placeName: 'Cinder Quarry', legacyMap: null, primary: 'cave', secondary: ['ruins'], battleBiome: 'cave', weatherDefault: 'clear', status: 'catalogued', fillerEligible: true },
  { placeId: 'paper-lantern-alley', placeName: 'Paper Lantern Alley', legacyMap: null, primary: 'town', secondary: ['neon-signs'], battleBiome: 'town', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'tidepool-village', placeName: 'Tidepool Village', legacyMap: null, primary: 'shore', secondary: ['signs-doors', 'water-anim'], battleBiome: 'water', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
  { placeId: 'glasshouse-conservatory', placeName: 'Glasshouse Conservatory', legacyMap: null, primary: 'interior', secondary: ['flowers'], battleBiome: 'grass', weatherDefault: 'leaves', status: 'catalogued', fillerEligible: true },
  { placeId: 'stormwatch-bluff', placeName: 'Stormwatch Bluff', legacyMap: null, primary: 'field', secondary: ['water-anim'], battleBiome: 'grass', weatherDefault: 'storm', status: 'catalogued', fillerEligible: false },
  { placeId: 'hollow-mine-depths', placeName: 'Hollow Mine Depths', legacyMap: null, primary: 'cave', secondary: ['ruins'], battleBiome: 'cave', weatherDefault: 'clear', status: 'catalogued', fillerEligible: true },
  { placeId: 'festival-grounds', placeName: 'Festival Grounds', legacyMap: null, primary: 'field', secondary: ['flowers', 'signs-doors'], battleBiome: 'grass', weatherDefault: 'clear', status: 'catalogued', fillerEligible: false },
];

export const PLACE_BY_ID: Record<string, PlaceTileset> = Object.fromEntries(
  PLACES.map((p) => [p.placeId, p]),
);
export const WIRED_PLACES = PLACES.filter((p) => p.status === 'wired');
export const CATALOGUED_PLACES = PLACES.filter((p) => p.status === 'catalogued');
