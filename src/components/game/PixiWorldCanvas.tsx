import React, { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Sprite, Text } from 'pixi.js';
import { getSheetDef } from '../../lib/spriteSheets';
import { fallbackColorFor } from '../../lib/spriteSheets';
import { playerSlot, slotForNpc } from '../../lib/humanSheets';

/**
 * PixiJS world renderer (Phase 2, world canvas only).
 * Draws the existing FullWorldMaps tile maps as PixiJS graphics — drawn
 * tiles, drawn figures, sheet sprites — never emoji, never CSS tiles.
 * React still owns HUD, menus, dialog and controls; this canvas owns
 * only the world picture. Camera follows the player and fills its
 * container (which the shell sizes to the full viewport).
 */

const TILE_COLORS: Record<number, number> = {
  0: 0x3a7a2a, 1: 0x1e4a16, 2: 0x1a5a9e, 3: 0xc8a870, 4: 0x7a5c3a, 5: 0xa07850,
  6: 0x2a6a18, 7: 0xd4b870, 8: 0x3a3028, 9: 0x3a7a2a, 10: 0xb09060, 11: 0x1a1a2e,
  12: 0x4a3820, 13: 0x5a9acc, 14: 0xc8e8f8, 15: 0x8a8a8a, 16: 0x3a7a2a, 17: 0x1a5a9e,
  18: 0x8050d0, 19: 0x806040, 20: 0x806040, 21: 0x4a8a30, 22: 0x7a5a30, 23: 0x8a6a40,
  24: 0xc8b080, 25: 0x8a2a0a,
};

const DAY_TINT: Record<string, { color: number; alpha: number }> = {
  dawn: { color: 0xffa050, alpha: 0.14 },
  day: { color: 0xffffff, alpha: 0 },
  dusk: { color: 0xb45028, alpha: 0.18 },
  night: { color: 0x001040, alpha: 0.38 },
};

function hashColor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const palette = [0xe8b06a, 0x7ab8e8, 0xe87a7a, 0x9ad97a, 0xc89ae8, 0xe8d27a, 0x7ad8c8];
  return palette[h % palette.length];
}

import { sheetCellTexture as sheetTexture } from './pixiSheet';

function drawFallbackCreature(g: Graphics, cx: number, cy: number, size: number, colorHex: number, bob: number) {
  const r = size / 2;
  g.ellipse(cx, cy - r * 0.35 + bob, r * 0.9, r * 0.75).fill(colorHex);
  g.circle(cx - r * 0.55, cy - r * 0.9 + bob, r * 0.28).fill(colorHex);
  g.circle(cx + r * 0.55, cy - r * 0.9 + bob, r * 0.28).fill(colorHex);
  g.circle(cx - r * 0.3, cy - r * 0.45 + bob, r * 0.13).fill(0xffffff);
  g.circle(cx + r * 0.3, cy - r * 0.45 + bob, r * 0.13).fill(0xffffff);
  g.circle(cx - r * 0.3, cy - r * 0.45 + bob, r * 0.06).fill(0x111111);
  g.circle(cx + r * 0.3, cy - r * 0.45 + bob, r * 0.06).fill(0x111111);
  g.ellipse(cx, cy + r * 0.45, r * 0.95, r * 0.18).fill({ color: 0x000000, alpha: 0.3 });
}

function drawTrainerFigure(g: Graphics, cx: number, cy: number, size: number, outfit: number) {
  const s = size;
  g.ellipse(cx, cy + s * 0.45, s * 0.42, s * 0.08).fill({ color: 0x000000, alpha: 0.3 });
  g.rect(cx - s * 0.22, cy - s * 0.15, s * 0.44, s * 0.55).fill(outfit);
  g.circle(cx, cy - s * 0.32, s * 0.22).fill(0xe8b890);
  g.rect(cx - s * 0.28, cy - s * 0.42, s * 0.56, s * 0.12).fill(0x2a2a3a);
  g.circle(cx - s * 0.08, cy - s * 0.32, s * 0.03).fill(0x111111);
  g.circle(cx + s * 0.08, cy - s * 0.32, s * 0.03).fill(0x111111);
}

export default function PixiWorldCanvas({
  mapData, playerPos, playerDir, playerSpeciesId, defeatedIds, phase, animWalk,
  playerKind = 'human', playerGender = 'boy',
}: {
  mapData: any;
  playerPos: { x: number; y: number };
  playerDir: string;
  playerSpeciesId: string | null;
  defeatedIds: string[];
  phase: string;
  animWalk: number;
  /** 'human' = world player avatar via the human loader (default).
      'creature' = Creature Mode only, where you play as the creature. */
  playerKind?: 'human' | 'creature';
  playerGender?: 'boy' | 'girl';
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const worldRef = useRef<Container | null>(null);
  const sheetSpritesRef = useRef<Map<string, Sprite>>(new Map());
  const overlayRef = useRef<Graphics | null>(null);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current!;
    const app = new Application();
    app.init({ resizeTo: host, background: '#0a1a0a', antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(() => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      app.canvas.style.display = 'block';
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      const world = new Container();
      app.stage.addChild(world);
      worldRef.current = world;
      appRef.current = app;
      draw();
    });
    return () => {
      cancelled = true;
      sheetSpritesRef.current.forEach(s => s.destroy());
      sheetSpritesRef.current.clear();
      overlayRef.current = null;
      app.destroy(true);
      appRef.current = null;
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = () => {
    const app = appRef.current;
    const world = worldRef.current;
    if (!app || !world) return;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (vw < 10 || vh < 10) return;

    const colsVisible = vw < 640 ? 13 : 19;
    const tile = Math.max(20, Math.min(64, vw / colsVisible, vh / 12));
    const mapW = mapData.width || 30;
    const mapH = mapData.height || 30;

    // Camera: centre the player, clamp so the map fills the view.
    let camX = (playerPos.x + 0.5) * tile - vw / 2;
    let camY = (playerPos.y + 0.5) * tile - vh / 2;
    camX = mapW * tile <= vw ? -(vw - mapW * tile) / 2 : Math.max(0, Math.min(camX, mapW * tile - vw));
    camY = mapH * tile <= vh ? -(vh - mapH * tile) / 2 : Math.max(0, Math.min(camY, mapH * tile - vh));
    world.position.set(-camX, -camY);

    // Remove last frame's drawables; cached sheet sprites are reused, not destroyed.
    const removed = world.removeChildren();
    removed.forEach(child => {
      if (child instanceof Sprite && [...sheetSpritesRef.current.values()].includes(child)) return;
      child.destroy();
    });
    const g = new Graphics();
    world.addChild(g);

    // v5.1 door labels: the v5 playtest never saw which building
    // was the lab before entering it — the interact prompt only
    // shows while facing an adjacent door tile, and walking up
    // steps straight onto the door, so it is easy to miss. A
    // persistent label drawn in the world itself (same camera
    // transform as the tiles, so it sits above its door tile)
    // identifies the building before entry. Walk-into entry is
    // unchanged. Labels are recreated each draw like the tile
    // graphics (draw() clears non-sprite children each frame).
    (mapData.doors || []).forEach((door: any) => {
      if (!door.label) return;
      const label = new Text({
        text: door.label,
        style: {
          fontFamily: 'Arial, sans-serif',
          fontSize: Math.max(12, tile * 0.32),
          fontWeight: 'bold',
          fill: 0xffffff,
          stroke: { color: 0x000000, width: 4 },
        },
      });
      label.anchor.set(0.5, 1);
      label.position.set((door.x + 0.5) * tile, door.y * tile - 2);
      world.addChild(label);
    });

    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const t = mapData.tiles?.[y]?.[x] ?? 1;
        const base = TILE_COLORS[t] ?? TILE_COLORS[0];
        const px = x * tile;
        const py = y * tile;
        g.rect(px, py, tile, tile).fill(base);
        if ((x + y) % 2 === 0 && (t === 0 || t === 6)) g.rect(px, py, tile, tile).fill({ color: 0xffffff, alpha: 0.04 });
        if (t === 1) {
          // Border tree: drawn trunk + canopy, not an emoji.
          g.rect(px + tile * 0.44, py + tile * 0.55, tile * 0.12, tile * 0.35).fill(0x5d4037);
          g.circle(px + tile * 0.5, py + tile * 0.38, tile * 0.38).fill(0x2e7d32);
          g.circle(px + tile * 0.5, py + tile * 0.38, tile * 0.22).fill(0x388e3c);
        } else if (t === 4) {
          g.rect(px + tile * 0.08, py + tile * 0.08, tile * 0.84, tile * 0.6).fill(0x8a6a4a);
          g.rect(px + tile * 0.38, py + tile * 0.55, tile * 0.24, tile * 0.45).fill(0x2a1f18);
        } else if (t === 5) {
          g.rect(px + tile * 0.32, py + tile * 0.2, tile * 0.36, tile * 0.8).fill(0x2a1f18);
        } else if (t === 6) {
          for (let i = 0; i < 4; i++) {
            g.rect(px + tile * (0.15 + i * 0.22), py + tile * 0.25, tile * 0.06, tile * 0.55).fill(0x1e5a10);
          }
        } else if (t === 10) {
          g.rect(px + tile * 0.45, py + tile * 0.4, tile * 0.1, tile * 0.6).fill(0x5d4037);
          g.rect(px + tile * 0.15, py + tile * 0.1, tile * 0.7, tile * 0.4).fill(0x8a6a40);
        } else if (t === 21) {
          g.circle(px + tile * 0.3, py + tile * 0.3, tile * 0.08).fill(0xf48fb1);
          g.circle(px + tile * 0.7, py + tile * 0.65, tile * 0.08).fill(0xf48fb1);
        } else if (t === 19 || t === 20) {
          g.poly([px + tile * 0.5, py + tile * (t === 19 ? 0.2 : 0.8), px + tile * 0.2, py + tile * (t === 19 ? 0.8 : 0.2), px + tile * 0.8, py + tile * (t === 19 ? 0.8 : 0.2)]).fill(0x3a2a1a);
        }
      }
    }

    // Depth-sorted drawables: NPCs and player, sorted by tile row.
    const bob = animWalk % 2 === 1 ? -tile * 0.05 : 0;
    type Drawable = { y: number; build: (parent: Container) => void };
    const drawables: Drawable[] = [];

    (mapData.npcs || []).forEach((npc: any) => {
      if (defeatedIds.includes(npc.id)) return;
      drawables.push({
        y: npc.y,
        build: (parent) => {
          const cx = (npc.x + 0.5) * tile;
          const cy = (npc.y + 0.5) * tile;
          const def = npc.creatureId ? getSheetDef(npc.creatureId) : null;
          const human = !def ? slotForNpc(npc) : null;
          if (human && human.sheetUrl) {
            const key = `npc-human-${npc.id}`;
            let sp = sheetSpritesRef.current.get(key);
            if (!sp) {
              sp = new Sprite();
              sheetSpritesRef.current.set(key, sp);
              sheetTexture(human.sheetUrl, human.frames.front).then(tex => { sp!.texture = tex; }).catch(() => {});
            }
            sp.anchor.set(0.5, 1);
            sp.position.set(cx, cy + tile * 0.5);
            sp.width = tile * 1.25; sp.height = tile * 1.25;
            parent.addChild(sp);
          } else if (def) {
            const key = `npc-${npc.id}`;
            let sp = sheetSpritesRef.current.get(key);
            if (!sp) {
              sp = new Sprite();
              sheetSpritesRef.current.set(key, sp);
              sheetTexture(def.sheetUrl, def.frames.front).then(tex => { sp!.texture = tex; }).catch(() => {});
            }
            sp.anchor.set(0.5, 1);
            sp.position.set(cx, cy + tile * 0.5);
            sp.width = tile * 1.25; sp.height = tile * 1.25;
            parent.addChild(sp);
          } else {
            // Human loader placeholder figure (slot colour, original shape).
            const fg = new Graphics();
            const slotColor = human ? parseInt(human.color.replace('#', ''), 16) : hashColor(npc.id);
            drawTrainerFigure(fg, cx, cy, tile * 0.9, slotColor);
            parent.addChild(fg);
          }
        },
      });
    });

    drawables.push({
      y: playerPos.y,
      build: (parent) => {
        const cx = (playerPos.x + 0.5) * tile;
        const cy = (playerPos.y + 0.5) * tile;
        const humanPlayer = playerKind === 'human' ? playerSlot(playerGender) : null;
        if (humanPlayer && humanPlayer.sheetUrl) {
          // Distinct left cell when the slot has one (Player A atlas:
          // left 128, right 192); otherwise fall back to mirrored right
          // (old strips where left === right).
          const distinctLeft = humanPlayer.frames.left !== humanPlayer.frames.right;
          const view = playerDir === 'up' ? 'back' : playerDir === 'left' && distinctLeft ? 'left' : playerDir === 'left' || playerDir === 'right' ? 'right' : 'front';
          const key = `player-human-${humanPlayer.slotId}-${view}`;
          let sp = sheetSpritesRef.current.get(key);
          if (!sp) {
            sp = new Sprite();
            sheetSpritesRef.current.set(key, sp);
            sheetTexture(humanPlayer.sheetUrl, humanPlayer.frames[view]).then(tex => { sp!.texture = tex; }).catch(() => {});
          }
          sp.anchor.set(0.5, 1);
          sp.position.set(cx, cy + tile * 0.5 + bob);
          sp.width = tile * 1.3; sp.height = tile * 1.3;
          sp.scale.x = Math.abs(sp.scale.x) * (playerDir === 'left' && !distinctLeft ? -1 : 1);
          parent.addChild(sp);
          return;
        }
        if (humanPlayer) {
          const fg = new Graphics();
          drawTrainerFigure(fg, cx, cy + bob, tile * 1.0, parseInt(humanPlayer.color.replace('#', ''), 16));
          parent.addChild(fg);
          return;
        }
        const def = getSheetDef(playerSpeciesId);
        const view = playerDir === 'up' ? 'back' : playerDir === 'left' || playerDir === 'right' ? 'side' : 'front';
        if (def) {
          const key = `player-${def.speciesId}-${view}`;
          let sp = sheetSpritesRef.current.get(key);
          if (!sp) {
            sp = new Sprite();
            sheetSpritesRef.current.set(key, sp);
            sheetTexture(def.sheetUrl, def.frames[view]).then(tex => { sp!.texture = tex; }).catch(() => {});
          }
          sp.anchor.set(0.5, 1);
          sp.position.set(cx, cy + tile * 0.5 + bob);
          sp.width = tile * 1.3; sp.height = tile * 1.3;
          sp.scale.x = Math.abs(sp.scale.x) * (playerDir === 'left' ? -1 : 1);
          parent.addChild(sp);
        } else {
          const fg = new Graphics();
          const colorHex = parseInt(fallbackColorFor(playerSpeciesId).replace('#', ''), 16);
          drawFallbackCreature(fg, cx, cy, tile * 1.1, colorHex, bob);
          parent.addChild(fg);
        }
      },
    });

    drawables.sort((a, b) => a.y - b.y);
    drawables.forEach(d => d.build(world));

    // Day/night tint overlay (screen space, one persistent Graphics).
    const tint = DAY_TINT[phase] || DAY_TINT.day;
    let overlay = overlayRef.current;
    if (!overlay) {
      overlay = new Graphics();
      overlayRef.current = overlay;
      app.stage.addChild(overlay);
    }
    overlay.clear();
    if (tint.alpha > 0) overlay.rect(0, 0, vw, vh).fill({ color: tint.color, alpha: tint.alpha });
  };

  useEffect(() => { draw(); });
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" style={{ touchAction: 'none' }} />;
}
