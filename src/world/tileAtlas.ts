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
  [TILE.GRASS]: "/assets/tiles/town/tile_0000.png",
  [TILE.PATH]: "/assets/tiles/town/tile_0025.png",
  [TILE.TALL_GRASS]: "/assets/tiles/town/tile_0043.png",
  [TILE.SAND]: "/assets/tiles/town/tile_0025.png",
  [TILE.FLOWER]: "/assets/tiles/town/tile_0002.png",
  [TILE.SAND_DUNE]: "/assets/tiles/town/tile_0025.png",
  // Step 2, viewed tiles only:
  // BUILDING -> blue brick wall (town tile_0126). Used for exterior
  // house blocks AND interior furniture in current maps, so interiors
  // will also read as brick until furniture tiles are mapped separately.
  [TILE.BUILDING]: "/assets/tiles/town/tile_0126.png",
  // CAVE -> plain dirt (same image as PATH for now). Cave stone
  // texture is still owed; dirt is a real cave floor, not a guess.
  [TILE.CAVE]: "/assets/tiles/town/tile_0025.png",
};
