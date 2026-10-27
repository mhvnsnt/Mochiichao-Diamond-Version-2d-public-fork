/**
 * Tile atlas, step 1 — real ground tiles, not flat colours.
 * Source: Kenney Tiny Town, CC0 (see public/assets/tiles/CREDITS.md).
 * Only tiles verified by viewing the actual tile image are mapped here.
 * Every other TILE number keeps its existing flat-colour rendering in
 * WorldRenderer — that fallback is deliberate, not a missing file.
 * Pokemon decomp tilesets contributed structure only (16x16 tiles,
 * metatiles, layers); no Pokemon art is in this atlas.
 */
import { TILE } from "./WorldConstants";

export const TILE_IMAGE: Record<number, string> = {
  [TILE.GRASS]: "/assets/tiles/water/voda-grass.png",  // step 3: speckled grass, replaces bright Kenney grass
  [TILE.PATH]: "/assets/tiles/town/tile_0025.png",
  [TILE.TALL_GRASS]: "/assets/tiles/town/tile_0043.png",
  [TILE.SAND]: "/assets/tiles/water/voda-sand.png",
  [TILE.FLOWER]: "/assets/tiles/town/tile_0002.png",
  [TILE.SAND_DUNE]: "/assets/tiles/water/voda-sand.png",
  // Step 2, viewed tiles only:
  // BUILDING -> blue brick wall (town tile_0126). Used for exterior
  // house blocks AND interior furniture in current maps, so interiors
  // will also read as brick until furniture tiles are mapped separately.
  [TILE.BUILDING]: "/assets/tiles/town/tile_0126.png",
  // CAVE -> plain dirt (same image as PATH for now). Cave stone
  // texture is still owed; dirt is a real cave floor, not a guess.
  [TILE.CAVE]: "/assets/tiles/town/tile_0025.png",
  // Step 3, OGA CC0 water/grass/sand sheet (Demetrius), tiles
  // extracted at 16x16 grid positions and viewed individually:
  // water (0,0) wavy blue, grass (4,1) speckled green, sand (4,4).
  [TILE.WATER]: "/assets/tiles/water/voda-water.png",
  [TILE.SHALLOW]: "/assets/tiles/water/voda-water.png",
};
