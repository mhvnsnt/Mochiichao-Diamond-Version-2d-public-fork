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
  // Step 4: PATH -> speckled brown dirt (GrumpyDiamond, CC0, interior
  // crop (22,3)-(38,19) of 16x16NewTileSet.png, viewed individually;
  // the sheet is a composite patch, not a clean grid, so the crop is
  // an interior 16x16, fully opaque, not the sheet's (0,0) cell).
  // This replaces Kenney tile_0025 tan for PATH only.
  [TILE.PATH]: "/assets/tiles/dirt/grumpydiamond-dirt.png",
  [TILE.TALL_GRASS]: "/assets/tiles/town/tile_0043.png",
  [TILE.SAND]: "/assets/tiles/water/voda-sand.png",
  [TILE.FLOWER]: "/assets/tiles/town/tile_0002.png",
  [TILE.SAND_DUNE]: "/assets/tiles/water/voda-sand.png",
  // Step 2, viewed tiles only:
  // BUILDING -> blue brick wall (town tile_0126). Used for exterior
  // house blocks AND interior furniture in current maps, so interiors
  // will also read as brick until furniture tiles are mapped separately.
  [TILE.BUILDING]: "/assets/tiles/town/tile_0126.png",
  // Step 4: CAVE -> dark-brown cave stone (Vidmaster, CC-BY 3.0,
  // credit in public/assets/tiles/CREDITS.md). Sheet GameOfCaves.png
  // is 16x16 tiles with a 1px separator: this tile is grid (5,0),
  // pixels (86,1)-(102,17), viewed individually. It replaces Kenney
  // tile_0025 tan for CAVE only; PATH no longer shares CAVE's image.
  [TILE.CAVE]: "/assets/tiles/cave/vidmaster-cave-stone.png",
  // Step 3, OGA CC0 water/grass/sand sheet (Demetrius), tiles
  // extracted at 16x16 grid positions and viewed individually:
  // water (0,0) wavy blue, grass (4,1) speckled green, sand (4,4).
  [TILE.WATER]: "/assets/tiles/water/voda-water.png",
  [TILE.SHALLOW]: "/assets/tiles/water/voda-water.png",
};
