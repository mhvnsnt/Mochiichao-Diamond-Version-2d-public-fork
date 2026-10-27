/**
 * Mochiichao Pixi adapter — pixi.js v8 (MIT).
 * Pixi is a renderer, not a game engine: it draws sprites and tiles,
 * it does not own game rules, audio, or save data. This adapter
 * renders one tile map as a scene graph with Y-sorted containers,
 * and keeps shadows on a SEPARATE layer (per the shadows-separate
 * rule: Pokemon adds shadows separately, they are not baked into
 * character art). WebGPU is opt-in with WebGL2 fallback; if neither
 * is available the caller keeps the existing CSS renderer.
 */
import { Application, Container, Graphics } from "pixi.js";

export type PixiTile = { x: number; y: number; color: number; solid?: boolean };

export async function createPixiScene(
  host: HTMLElement,
  tiles: PixiTile[],
  tileSize = 32,
): Promise<{ app: Application; shadowLayer: Container; entityLayer: Container }> {
  const app = new Application();
  await app.init({
    preference: "webgpu",
    width: 640,
    height: 480,
    background: "#0b1f2a",
    antialias: false,
  });
  host.appendChild(app.canvas);
  const shadowLayer = new Container();
  const entityLayer = new Container();
  app.stage.addChild(shadowLayer);
  app.stage.addChild(entityLayer);
  for (const t of tiles) {
    const g = new Graphics().rect(t.x * tileSize, t.y * tileSize, tileSize, tileSize).fill(t.color);
    entityLayer.addChild(g);
    if (t.solid) {
      const shadow = new Graphics()
        .ellipse(t.x * tileSize + tileSize / 2, (t.y + 1) * tileSize, tileSize / 2, 6)
        .fill({ color: 0x000000, alpha: 0.25 });
      shadowLayer.addChild(shadow);
    }
  }
  // Y-sort: entities lower on screen draw over entities above them.
  entityLayer.children.sort((a, b) => a.y - b.y);
  return { app, shadowLayer, entityLayer };
}
