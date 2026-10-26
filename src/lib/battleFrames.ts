/**
 * PixiJS v8 NineSlice frames for swappable menu / battle frames.
 *
 * PixiJS NineSlicePlane (MIT, pixi.js v8, already a repo dependency)
 * scales a frame texture in 9 slices: the 4 corners are never stretched,
 * the 4 edges stretch in one axis only, and only the centre stretches in
 * both. That is what protects pixel-art edges — a plain Sprite scaled to
 * a window would stretch its corners and border pixels.
 *
 * Wiring to the existing frame system (not a new system): the game
 * already has FRAME 1-20 as swappable rows (Settings > Menu Creator,
 * gameSettings.frameAccent) and per-menu overrides (hudCustom.menuFrame /
 * menuFrameAccent, MENU_KEYS includes BATTLE). This module is the Pixi
 * side of that same system: `frameDefForMenu` resolves the same row to a
 * FrameDef, and `createBattleFrame` builds the NineSlicePlane from it.
 *
 * TEXTURE GAP, stated plainly: no 9-slice frame PNG exists in the repo.
 * StdWindow is CSS and FRAME 1-20 are accent colours + radii, not
 * textures, so every FrameDef below ships with `textureSrc: null` and
 * its accent tint. `createBattleFrame` therefore takes a caller-loaded
 * Texture (e.g. from Pixi Assets once a frame PNG lands); until then a
 * caller can still build the plane from a generated solid texture and
 * tint it — the plane, insets and tint wiring are real, the frame ART
 * is owed. Insets below are placeholder 8px values: when a real frame
 * PNG lands, its corner size must replace them (measure, don't guess).
 * Texture-backed frames: 0/3 = 0% until that PNG lands.
 */
import { NineSlicePlane, type Texture } from "pixi.js";
import type { GameSettings } from "./gameSettings";
import { menuFrame, menuFrameAccent, type MenuKey } from "./hudCustom";

export interface FrameDef {
  id: string;
  /** Menu this frame belongs to (hudCustom MenuKey). */
  menu: MenuKey;
  /** Path under public/ once a frame PNG lands; null until then. */
  textureSrc: string | null;
  /** Corner/edge inset in texture pixels. Placeholder 8 until measured. */
  insets: { left: number; top: number; right: number; bottom: number };
  /** Accent tint from the FRAME row (hex string, e.g. "#22d3ee"). */
  tint: string;
  /** Width/height the plane is created at; the caller may resize after. */
  width: number;
  height: number;
}

const PLACEHOLDER_INSETS = { left: 8, top: 8, right: 8, bottom: 8 };

export const BATTLE_FRAME_DEFS: FrameDef[] = [
  { id: "battle-command", menu: "BATTLE", textureSrc: null, insets: PLACEHOLDER_INSETS, tint: "#22d3ee", width: 320, height: 120 },
  { id: "battle-dialogue", menu: "BATTLE", textureSrc: null, insets: PLACEHOLDER_INSETS, tint: "#22d3ee", width: 640, height: 96 },
  { id: "battle-hud", menu: "BATTLE", textureSrc: null, insets: PLACEHOLDER_INSETS, tint: "#22d3ee", width: 280, height: 64 },
];

/**
 * Resolve the frame for a menu from live settings: the per-menu FRAME
 * override (or the global FRAME row) decides the accent, exactly as
 * StdWindow / BattleView do on the DOM side. The returned def keeps the
 * same id family as BATTLE_FRAME_DEFS so a Pixi battle HUD and the DOM
 * battle HUD can never drift to different frames silently.
 */
export function frameDefForMenu(
  menu: MenuKey,
  settings: GameSettings,
  defId = "battle-command",
): FrameDef {
  const base = BATTLE_FRAME_DEFS.find((d) => d.id === defId) ?? BATTLE_FRAME_DEFS[0];
  void menuFrame(menu, settings);
  return { ...base, menu, tint: menuFrameAccent(menu, settings) };
}

/** Convert a "#rrggbb" accent to the numeric tint NineSlicePlane expects. */
export function hexToTint(hex: string): number {
  const v = parseInt(hex.replace("#", ""), 16);
  return Number.isFinite(v) ? v : 0xffffff;
}

/**
 * Build the NineSlicePlane. Corners (insets) are fixed size; only the
 * centre/edges scale when the caller resizes the plane afterwards.
 * PixiJS v8 constructor form: options object with leftWidth / topHeight /
 * rightWidth / bottomHeight.
 */
export function createBattleFrame(
  texture: Texture,
  def: FrameDef,
  width = def.width,
  height = def.height,
): NineSlicePlane {
  const plane = new NineSlicePlane({
    texture,
    leftWidth: def.insets.left,
    topHeight: def.insets.top,
    rightWidth: def.insets.right,
    bottomHeight: def.insets.bottom,
  });
  plane.width = Math.max(width, def.insets.left + def.insets.right + 1);
  plane.height = Math.max(height, def.insets.top + def.insets.bottom + 1);
  plane.tint = hexToTint(def.tint);
  return plane;
}
