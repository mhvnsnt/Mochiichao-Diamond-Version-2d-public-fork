import { Texture } from 'pixi.js';

// Shared sheet-cell texture loader (PixiWorldCanvas + PixiBattleCanvas).
// Loads one 64x64 cell of a 192x64 sheet through an offscreen canvas so
// the game never needs a GLB, a network sprite, or a Pokemon sprite.
const cache = new Map<string, Promise<Texture>>();

// Battle-only full-image loader (three-quarter cuts, not 64x64 sheet cells).
// Keeps the source image's aspect ratio via its own width/height; the caller
// sizes the sprite from tex.width / tex.height after load.
const fullCache = new Map<string, Promise<Texture>>();

export function fullImageTexture(imageUrl: string): Promise<Texture> {
  let p = fullCache.get(imageUrl);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(Texture.from(img));
      img.onerror = reject;
      img.src = imageUrl;
    });
    fullCache.set(imageUrl, p);
  }
  return p;
}

export function sheetCellTexture(sheetUrl: string, x: number): Promise<Texture> {
  const key = `${sheetUrl}@${x}`;
  let p = cache.get(key);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        c.getContext('2d')!.drawImage(img, x, 0, 64, 64, 0, 0, 64, 64);
        resolve(Texture.from(c));
      };
      img.onerror = reject;
      img.src = sheetUrl;
    });
    cache.set(key, p);
  }
  return p;
}

// Grid-cell loader for 4x4 human atlases (and any grid sheet): crops
// the 64x64 cell at pixel (x, y). sheetCellTexture above only ever
// crops row 0 (y = 0), which is why walk cells in rows 1-2 were
// unreachable until now. Existing callers of sheetCellTexture are
// unchanged; this is an additive export, not a behaviour change.
export function sheetCellTextureXY(sheetUrl: string, x: number, y: number): Promise<Texture> {
  const key = `${sheetUrl}@${x},${y}`;
  let p = cache.get(key);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        c.getContext('2d')!.drawImage(img, x, y, 64, 64, 0, 0, 64, 64);
        resolve(Texture.from(c));
      };
      img.onerror = reject;
      img.src = sheetUrl;
    });
    cache.set(key, p);
  }
  return p;
}
