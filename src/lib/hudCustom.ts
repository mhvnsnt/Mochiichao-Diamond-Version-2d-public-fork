/**
 * HUD / border / cursor customization — Batch A (UI/HUD), 2026-10-25.
 *
 * Structure translated from Pokemon's options + window systems only
 * (FireRed option_menu.c FRAME slots, HeartGold/Platinum options,
 * text_window.c 9-slice frame, menu.c list cursor + cursorShadowPal):
 * a swappable row is a value in GameSettings, cycled in
 * Settings > Menu Creator, saved to the save + localStorage, and
 * applied live on return to the real screen. No Pokemon sprites,
 * dialogue, music, cries, or art are used here; every visual is
 * Mochiichao Y2K CSS. Kenney CC0 / game-icons CC BY 3.0 shapes are
 * NOT shipped in this batch — glyphs only, labelled NEED in
 * SettingsScreen (see the CURSOR SHAPE note there).
 *
 * Option lists are the countable rows for this batch:
 *  HUD (6): healthbar style, battle HUD layout, move button layout,
 *    PP/TYPE display, message window style, damage number style.
 *  Borders (10 + FRAME 1-20 already wired): radius, border width,
 *    white border, gloss, glow, shadow, gradient, opacity,
 *    per-menu panel colour, per-menu frame override.
 *  Cursor (8): shape, colour, shadow, glow, size, blink + speed,
 *    highlight row colour, sound on move.
 * Radius / border width / white border / gloss / glow / gradient
 * already existed as preset fields (Menu Creator page 4 / Panel
 * Frame Editor) but only tinted SettingsScreen's own windows; this
 * batch makes them render (gradient + gloss backgrounds in the
 * Settings panel style) and adds the missing shadow / opacity /
 * per-menu rows. Sound on move is a stored flag: there is no audio
 * engine in this build to play it through yet, so playback is
 * labelled NEED in the UI, exactly like the SOUND flag precedent
 * in PR #28 — the row, persistence, and preset are real, the
 * playback is not faked.
 */

import type { CSSProperties } from 'react';
import type { GameSettings } from './gameSettings';
import { frameAccent } from './gameSettings';

export type HealthbarStyle = 'CLASSIC' | 'SEGMENTED' | 'SLIM' | 'NUMERIC';
export type BattleHudLayout = 'CLASSIC' | 'SWAPPED' | 'STACKED_TOP';
export type MoveButtonLayout = 'GRID_2X2' | 'LIST' | 'ROW_4';
export type PpTypeDisplay = 'FULL' | 'PP_ONLY' | 'TYPE_ONLY' | 'HIDDEN';
export type MessageWindowStyle = 'CLASSIC' | 'ROUNDED' | 'MINIMAL' | 'GLOSS';
export type DamageNumberStyle = 'PLAIN' | 'BOLD_POP' | 'OUTLINE';
export type CursorBlinkSpeed = 'SLOW' | 'MID' | 'FAST';

export const HEALTHBAR_STYLES: HealthbarStyle[] = ['CLASSIC', 'SEGMENTED', 'SLIM', 'NUMERIC'];
export const BATTLE_HUD_LAYOUTS: BattleHudLayout[] = ['CLASSIC', 'SWAPPED', 'STACKED_TOP'];
export const MOVE_BUTTON_LAYOUTS: MoveButtonLayout[] = ['GRID_2X2', 'LIST', 'ROW_4'];
export const PP_TYPE_DISPLAYS: PpTypeDisplay[] = ['FULL', 'PP_ONLY', 'TYPE_ONLY', 'HIDDEN'];
export const MESSAGE_WINDOW_STYLES: MessageWindowStyle[] = ['CLASSIC', 'ROUNDED', 'MINIMAL', 'GLOSS'];
export const DAMAGE_NUMBER_STYLES: DamageNumberStyle[] = ['PLAIN', 'BOLD_POP', 'OUTLINE'];
export const CURSOR_BLINK_SPEEDS: CursorBlinkSpeed[] = ['SLOW', 'MID', 'FAST'];

/** Per-menu keys for the per-menu panel colour / frame override rows.
 *  These are menu names only, never Pokemon menu data. */
export type MenuKey = 'ROSTER' | 'SHOP' | 'BAG' | 'BATTLE' | 'PC' | 'GARDEN' | 'SETTINGS' | 'PARTY';
export const MENU_KEYS: MenuKey[] = ['ROSTER', 'SHOP', 'BAG', 'BATTLE', 'PC', 'GARDEN', 'SETTINGS', 'PARTY'];

/** Panel colour name -> accent hex (the v32 Y2K palette). */
export const PANEL_COLOR_HEX: Record<string, string> = {
  blue: '#60a5fa', pink: '#f472b6', yellow: '#facc15', green: '#4ade80',
  teal: '#22d3ee', purple: '#a78bfa', red: '#f87171', orange: '#fb923c',
};

export const DEFAULT_PER_MENU_PANEL_COLOR: Record<MenuKey, string> = {
  ROSTER: 'pink', SHOP: 'yellow', BAG: 'green', BATTLE: 'red',
  PC: 'blue', GARDEN: 'purple', SETTINGS: 'blue', PARTY: 'pink',
};

/** 0 = follow the global FRAME row; 1-20 = override for that menu. */
export const DEFAULT_PER_MENU_FRAME: Record<MenuKey, number> = {
  ROSTER: 0, SHOP: 0, BAG: 0, BATTLE: 0, PC: 0, GARDEN: 0, SETTINGS: 0, PARTY: 0,
};

export function menuPanelColor(menu: MenuKey, s: GameSettings): string {
  const name = (s.perMenuPanelColor as Record<string, string> | undefined)?.[menu]
    || DEFAULT_PER_MENU_PANEL_COLOR[menu];
  return PANEL_COLOR_HEX[name] || PANEL_COLOR_HEX.blue;
}

export function menuFrame(menu: MenuKey, s: GameSettings): number {
  const v = (s.perMenuFrame as Record<string, number> | undefined)?.[menu] || 0;
  return v >= 1 && v <= 20 ? v : s.frame;
}

export function menuFrameAccent(menu: MenuKey, s: GameSettings): string {
  return frameAccent(menuFrame(menu, s));
}

/** Healthbar geometry per style. CLASSIC keeps the pre-existing
 *  h-2.5 rounded bar exactly; SEGMENTED adds tick marks via a
 *  repeating gradient overlay; SLIM is a thin bar; NUMERIC keeps
 *  the classic bar (the numeric HP text is rendered by BattleView
 *  for the player box in every style, and for the enemy box only
 *  in NUMERIC — Pokemon shows enemy HP as a bar only, so NUMERIC
 *  is the Mochiichao extension that reveals it). */
export function healthbarStyle(style: HealthbarStyle): { height: number; radius: number; segmented: boolean } {
  if (style === 'SLIM') return { height: 5, radius: 3, segmented: false };
  if (style === 'SEGMENTED') return { height: 10, radius: 6, segmented: true };
  return { height: 10, radius: 999, segmented: false };
}

/** Battle HUD healthbox positions per layout. CLASSIC keeps the
 *  pre-existing enemy top-left / player bottom-right exactly. */
export function battleHudPositions(layout: BattleHudLayout): {
  enemy: string; player: string;
} {
  if (layout === 'SWAPPED') return {
    enemy: 'absolute top-3 right-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
    player: 'absolute bottom-3 left-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
  };
  if (layout === 'STACKED_TOP') return {
    enemy: 'absolute top-3 left-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
    player: 'absolute top-3 right-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
  };
  return {
    enemy: 'absolute top-3 left-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
    player: 'absolute bottom-3 right-3 pointer-events-none z-10 w-[46%] max-w-[280px]',
  };
}

/** Move button container class per layout. GRID_2X2 is pre-existing. */
export function moveButtonContainerClass(layout: MoveButtonLayout): string {
  if (layout === 'LIST') return 'flex flex-col gap-2';
  if (layout === 'ROW_4') return 'grid grid-cols-2 sm:grid-cols-4 gap-2';
  return 'grid grid-cols-2 gap-2';
}

/** PP/TYPE sub-line for a move button, or null when hidden. */
export function ppTypeLine(display: PpTypeDisplay, typeName: string, pp: number, maxPp: number): string | null {
  if (display === 'HIDDEN') return null;
  if (display === 'PP_ONLY') return `PP ${pp}/${maxPp}`;
  if (display === 'TYPE_ONLY') return typeName;
  return `${typeName} · PP ${pp}/${maxPp}`;
}

/** Message window (dialogue box + battle message panel) styling.
 *  CLASSIC keeps the StdWindow / game-panel look exactly. */
export function messageWindowStyle(style: MessageWindowStyle, opacityPct: number): CSSProperties {
  const opacity = Math.min(100, Math.max(70, opacityPct || 100)) / 100;
  if (style === 'ROUNDED') return { borderRadius: 24, opacity };
  if (style === 'MINIMAL') return { borderRadius: 6, opacity, boxShadow: 'none', background: 'rgba(10, 18, 34, 0.92)' };
  if (style === 'GLOSS') return {
    borderRadius: 14, opacity,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(22,35,58,0.92) 45%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 24px rgba(0,0,0,0.45)',
  };
  return { borderRadius: 14, opacity };
}

/** Damage number overlay styling per style. */
export function damageNumberStyle(style: DamageNumberStyle): CSSProperties {
  if (style === 'BOLD_POP') return {
    fontSize: 28, fontWeight: 900, color: '#ffffff',
    textShadow: '0 2px 0 #000, 0 0 12px rgba(239,68,68,0.9)',
  };
  if (style === 'OUTLINE') return {
    fontSize: 20, fontWeight: 800, color: '#fca5a5',
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
  };
  return { fontSize: 18, fontWeight: 700, color: '#ffffff', textShadow: '0 1px 0 #000' };
}

/** Cursor blink animation duration per speed (Tailwind animate-pulse). */
export function cursorBlinkDuration(speed: CursorBlinkSpeed): string {
  if (speed === 'SLOW') return '1.2s';
  if (speed === 'FAST') return '0.35s';
  return '0.7s';
}

/** Cursor glyph size per preset size row (S/M/L, already stored in
 *  the preset; applied to the SettingsScreen cursor glyph here). */
export function cursorGlyphSize(size: string): number {
  if (size === 'S') return 12;
  if (size === 'L') return 20;
  return 16;
}
