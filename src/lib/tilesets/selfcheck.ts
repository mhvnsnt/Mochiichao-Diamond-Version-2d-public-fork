// Tileset system self-check. Run: npx tsx src/lib/tilesets/selfcheck.ts
// Exit 0 = all checks pass. This script reads the JSON data files from
// disk and cross-checks them against the TS modules — it does NOT
// construct Pixi objects (no DOM in node) and does NOT import any
// game source that imports from src/lib/generated/ (validate-reference
// forbids game sources importing generated data; this script is a
// dev-time check, not game source, and it imports no generated file).
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { METATILES, METATILE_BY_LEGACY_ID, behaviourForLegacyTile } from './metatiles';
import { TILESETS, uncoveredMetatiles } from './tilesets';
import { PLACES, WIRED_PLACES, CATALOGUED_PLACES } from './places';
import { LAYER_ORDER } from './types';
import { MAX_PARTICLES, pixiLayerForMetatile } from './pixiLayers';
import { fillerAllowed, validateFillerConnectivity, STORY_PLACE_IDS } from './wfcRules';
import { clampFadeFrames, gamePhaseForHour, hgBucketForHour } from './timeOfDay';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(HERE, '../../data/tilesets');
const errors: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
  else console.log(`ok: ${msg}`);
};

const backgrounds = JSON.parse(fs.readFileSync(path.join(DATA, 'backgrounds.json'), 'utf8'));
const weather = JSON.parse(fs.readFileSync(path.join(DATA, 'weather.json'), 'utf8'));
const tsj = JSON.parse(fs.readFileSync(path.join(DATA, 'mochiichao-field.tsj'), 'utf8'));
const tmj = JSON.parse(fs.readFileSync(path.join(DATA, 'example-filler-garden.tmj'), 'utf8'));

// Metatiles
check(METATILES.length === 26, `metatiles = 26 (got ${METATILES.length})`);
check(new Set(METATILES.map((t) => t.id)).size === 26, 'metatile ids unique');
check(Object.keys(METATILE_BY_LEGACY_ID).length === 26, 'legacy TILE ids 0-25 all mapped exactly once');
check(behaviourForLegacyTile(6).encounter === true, 'legacy 6 (tall grass) encounters');
check(behaviourForLegacyTile(1).solid === true, 'legacy 1 (wall) solid');
check(behaviourForLegacyTile(2).behaviour === 'water', 'legacy 2 (water) behaviour');
check(uncoveredMetatiles().length === 0, `primaries cover all metatiles (uncovered: ${uncoveredMetatiles().join(',') || 'none'})`);
check(TILESETS.length === 16, `tilesets = 16 (10 primary + 6 secondary, got ${TILESETS.length})`);
check(TILESETS.filter((t) => t.kind === 'primary').length === 10, 'primary tilesets = 10');
check(TILESETS.filter((t) => t.kind === 'secondary').length === 6, 'secondary tilesets = 6');
check(TILESETS.every((t) => t.sheet === null || t.source === 'cc0-in-repo'), 'non-null sheets are only cc0-in-repo (no pending-download sheet is referenced)');

// Places
check(PLACES.length === 32, `places = 32 (got ${PLACES.length})`);
check(WIRED_PLACES.length === 16, `wired places = 16 (got ${WIRED_PLACES.length})`);
check(CATALOGUED_PLACES.length === 16, `catalogued places = 16 (got ${CATALOGUED_PLACES.length})`);
const wiredKeys = WIRED_PLACES.map((p) => p.legacyMap).sort().join(',');
check(wiredKeys === ['AEON_LAB','BINARY_FIELDS','BINARY_WOODS','BOOT_BAY','CASTAGNOLI_ISLAND','CAVE_OF_ECHOES','CORAL_APPROACH','DOJO_1','DOJO_2','LUIGI_MANSION','MAUVEVILLE_ARENA','MOCHIIPLEX_1','NEON_CITY','ROUTE_1','SCRAP_JUNKYARD','SECTOR_0'].sort().join(','), 'wired legacy maps = the 16 FULL_WORLD exports on main');
const tilesetIds = new Set(TILESETS.map((t) => t.id));
check(PLACES.every((p) => tilesetIds.has(p.primary) && p.secondary.every((s) => tilesetIds.has(s))), 'every place primary + secondary exists');
check(PLACES.every((p) => backgrounds.biomes[p.battleBiome]), 'every place battleBiome exists in backgrounds.json');
check(PLACES.every((p) => weather.variants[p.weatherDefault]), 'every place weatherDefault exists in weather.json');
check(Object.keys(backgrounds.biomes).length === 11, `background biomes = 11 (got ${Object.keys(backgrounds.biomes).length})`);
check(backgrounds.titleBackgroundsWired === false, 'title backgrounds NOT wired (show-first)');
check(backgrounds.layerOrder.join(',') === LAYER_ORDER.join(','), 'backgrounds.json layer order matches LAYER_ORDER');
check(pixiLayerForMetatile('tall_grass') === 'groundMiddle', 'tall_grass draws on groundMiddle');
check(pixiLayerForMetatile('grass') === 'groundBottom', 'grass draws on groundBottom');

// Weather
check(weather.globalRules.maxParticles === 200, 'weather maxParticles = 200');
check(MAX_PARTICLES === 200, 'pixiLayers MAX_PARTICLES = 200');
check(Object.values(weather.variants).every((v: any) => v.particleCount <= 200), 'every weather variant particleCount <= 200');
check(weather.variants.storm.hasLightning === true, 'storm variant has lightning');
check(typeof weather.globalRules.lightning.offSwitch === 'string' && weather.globalRules.lightning.offSwitch.length > 0, 'lightning off-switch documented');
check(Object.values(weather.variants).every((v: any) => v.presentationFadeFrames >= 60 && v.presentationFadeFrames <= 120), 'every presentation fade is 60-120 frames (1-2 s)');
check(clampFadeFrames(160) === 120, 'sunny source fade 160 frames clamps to 120');
check(clampFadeFrames(30) === 60, 'fade below 60 clamps up to 60');

// Time
check(gamePhaseForHour(7) === 'dawn' && gamePhaseForHour(12) === 'day' && gamePhaseForHour(19) === 'dusk' && gamePhaseForHour(23) === 'night', 'game phase table: 7 dawn, 12 day, 19 dusk, 23 night');
check(hgBucketForHour(2) === 'late' && hgBucketForHour(6) === 'morn' && hgBucketForHour(12) === 'day' && hgBucketForHour(18) === 'eve' && hgBucketForHour(22) === 'nite', 'HeartGold hour table: 2 late, 6 morn, 12 day, 18 eve, 22 nite');

// Tiled files
check(tsj.tilewidth === 16 && tsj.tileheight === 16 && tsj.tiles.length === 26, 'TSJ: 16x16, 26 tiles');
check(tsj.tiles.every((t: any) => t.properties.some((p: any) => p.name === 'behaviour')), 'TSJ: every tile carries a behaviour property');
check(tmj.layers.map((l: any) => l.name).join(',') === 'GroundBottom,GroundMiddle,OverheadTop', 'TMJ layers are GroundBottom, GroundMiddle, OverheadTop');
check(tmj.properties.some((p: any) => p.name === 'placeId' && p.value === 'whispering-garden'), 'TMJ example placeId = whispering-garden');

// Filler rules + TMJ connectivity (walkable = grass/path bottom or tall-grass middle)
check(fillerAllowed('whispering-garden') === true, 'filler allowed for whispering-garden (garden, catalogued)');
check(fillerAllowed('cave-of-echoes') === false, 'filler NOT allowed for cave-of-echoes (story map)');
check(fillerAllowed('silicon-town') === false, 'filler NOT allowed for silicon-town (story map)');
check(STORY_PLACE_IDS.length === 16, 'story place exclusion list = 16');
{
  const W = tmj.width as number;
  const H = tmj.height as number;
  const bottom = tmj.layers[0].data as number[];
  const middle = tmj.layers[1].data as number[];
  // gid 1 = grass, 4 = path, 7 = tall_grass (metatile index + 1)
  const walkable: boolean[][] = [];
  for (let y = 0; y < H; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < W; x++) {
      const b = bottom[y * W + x];
      const mid = middle[y * W + x];
      row.push(b === 1 || b === 4 || mid === 7);
    }
    walkable.push(row);
  }
  const conn = validateFillerConnectivity(walkable, { x: 5, y: 7 }, [{ x: 5, y: 0 }]);
  check(conn.length === 0, `TMJ example filler garden connectivity valid (${conn.join('; ') || 'no errors'})`);
  const bad = validateFillerConnectivity(
    [[true, false, true]],
    { x: 0, y: 0 },
    [{ x: 2, y: 0 }],
  );
  check(bad.length > 0, 'connectivity validator rejects a disconnected filler grid');
}

console.log(`\nplaces: ${PLACES.length} total, ${WIRED_PLACES.length} wired (${Math.round((WIRED_PLACES.length / 30) * 100)}% of the 30-place target), ${CATALOGUED_PLACES.length} catalogued`);
if (errors.length > 0) {
  console.error(`\nSELFCHECK FAILED (${errors.length}):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log('TILESET SELFCHECK: PASS');
