import { Texture } from 'pixi.js';

// Shared sheet-cell texture loader (PixiWorldCanvas + PixiBattleCanvas).
// Loads one 64x64 cell of a 192x64 sheet through an offscreen canvas so
// the game never needs a GLB, a network sprite, or a Pokemon sprite.
const cache = new Map<string, Promise<Texture>>();

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
