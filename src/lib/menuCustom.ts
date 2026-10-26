/**
 * Menu customisation — batch B (UI/HUD: themes, day/night, presets,
 * animation, backgrounds, Sprite Proportions, text extras,
 * gameplay-adjacent rows), 2026-10-25.
 *
 * Structure translated ONLY from Pokemon files, never Pokemon code,
 * sprites, dialogue, music, cries, or art copied in:
 * - Day/night: HeartGold pokeheartgold/include/gf_rtc.h +
 *   src/gf_rtc.c GF_RTC_GetTimeOfDayByHour. The hour table below is
 *   that table, transcribed as data: hours 0-3 LATE, 4-9 MORN,
 *   10-17 DAY, 18-20 EVE, 21-23 NITE. Visual states are the four
 *   the task names (MORN/DAY/EVE/NITE); LATE renders with the NITE
 *   visual, exactly as HeartGold's wild-param mapping folds
 *   NITE/LATE together (GF_RTC_GetTimeOfDayWildParamByHour:
 *   default -> NITE). Mochiichao colourways below are original
 *   Mochiichao palettes, not Pokemon palettes.
 * - Menus/layout-as-data + presets JSON: the preset JSON shape is
 *   our own (see gameSettings.ts MenuPreset); the IDEA of storing
 *   a menu as data and exporting it is the layout-as-data idea
 *   already used by the existing preset export.
 * - Animation: sine offset = sine x amplitude on a base position
 *   (the method already documented in
 *   ui-art/menu-background-animation-spec.md); FLOW and RISE_FADE
 *   are Mochiichao menu-animation names for the existing
 *   rise+fade / flowing symbol-layer motion, not Pokemon assets.
 *   Preview-strip motion (batch-B follow-up): driven by Motion
 *   (MIT, already a dependency — no new package) via
 *   useAnimationFrame; SINE is the FireRed method
 *   sprite offset = Sin(angle, amplitude) (battle_anim_*.c:
 *   sprite->y2 = Sin(data, amplitude)), with amplitude = sway
 *   and angle advanced by animationSpeed. Title/main-menu
 *   symbol-layer motion is still NEED — only the preview strip
 *   is animated here.
 *
 * GAME TIME: this web game has no separate simulated in-game
 * clock yet, so "GAME time" here is the device clock read at
 * render (new Date()). A frozen / player-set game clock is NEED,
 * labelled in the UI — CUSTOM period below overrides the DISPLAY
 * period only, it does not advance a game clock.
 *
 * HONEST WIRING MAP (what each row actually does in this batch):
 * - WIRED (effect outside the row itself): text size / line
 *   spacing / text colour / shadow / dialogue box style ->
 *   DialogueBox via CSS vars (see applyMenuCustom); day/night,
 *   background biome, symbol layer, fade, layout, animation ->
 *   the Settings screen itself (background tint, panel width /
 *   gap / preview animation), because Settings is the screen
 *   these rows live on and the only screen that reads
 *   layout-as-data today. All rows persist (own localStorage
 *   key, mirrored into the preset on save) and export in preset
 *   JSON. Presets NEVER overwrite locked v32: saving a preset
 *   adds a named preset; only RESET TO LOCKED DEFAULT restores
 *   v32 + these defaults, exactly as the existing reset does.
 * - PREVIEW: animation style / speed / sway -> an animated demo
 *   strip inside Menu Custom; the title / main-menu symbol-layer
 *   animation in game is still NEED (existing note in
 *   SettingsScreen page 3), not claimed here.
 * - GAP (row present, labelled, no effect yet): painted
 *   menu background (painted TITLE backgrounds exist for 8/8
 *   biomes on main, but are not wired as menu backgrounds yet);
 *   TALL sprite rendering (selection stored, display falls back
 *   to chibi, never blank — see spriteDisplayScale);
 *   day/night tint while pausing/playing (PauseMenu has no
 *   Settings entry, so the tint cannot be seen from pause yet —
 *   NEED, not claimed); layout application to menus other than
 *   Settings (they do not read layout-as-data yet — NEED).
 * - NOT TOUCHED by this batch: HUD/borders/cursors (batch A),
 *   the 6 font rows (font batch), creator screens, title scene,
 *   main menu layout, saves.
 */

import type { TitleBiomeId } from './titleBiomes';
import { TITLE_BIOMES } from './titleBiomes';

/* ------------------------------------------------------------------ */
/* Day / night                                                         */
/* ------------------------------------------------------------------ */

/** HeartGold RTC_TimeOfDay values (gf_rtc.h), in enum order. */
export type RtcTimeOfDay = 'LATE' | 'MORN' | 'DAY' | 'EVE' | 'NITE';
/** Visual states the task names. LATE maps to NITE visually. */
export type DayNightVisual = 'MORN' | 'DAY' | 'EVE' | 'NITE';

/** sTimeOfDayByHour from pokeheartgold/src/gf_rtc.c, as data. */
export const TIME_OF_DAY_BY_HOUR: RtcTimeOfDay[] = [
  'LATE', 'LATE', 'LATE', 'LATE', // 0-3
  'MORN', 'MORN', 'MORN', 'MORN', 'MORN', 'MORN', // 4-9
  'DAY', 'DAY', 'DAY', 'DAY', 'DAY', 'DAY', 'DAY', 'DAY', // 10-17
  'EVE', 'EVE', 'EVE', // 18-20
  'NITE', 'NITE', 'NITE', 'NITE', // 21-23
];

export function getTimeOfDayByHour(hour: number): RtcTimeOfDay {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  return TIME_OF_DAY_BY_HOUR[h];
}

export function visualStateOf(period: RtcTimeOfDay): DayNightVisual {
  return period === 'LATE' ? 'NITE' : period;
}

/** Game time = device clock at render (no simulated clock yet). */
export function getGameTimeOfDay(now: Date = new Date()): RtcTimeOfDay {
  return getTimeOfDayByHour(now.getHours());
}

export function getGameVisualState(now: Date = new Date()): DayNightVisual {
  return visualStateOf(getGameTimeOfDay(now));
}

export interface DayNightPalette {
  panel: string;
  accent: string;
  text: string;
  muted: string;
  /** Settings-screen background gradient stops. */
  skyTop: string;
  skyBottom: string;
  /** Overlay tint laid over the background. */
  tint: string;
}

/** Original Mochiichao colourways per visual state (not Pokemon). */
export const DAY_NIGHT_COLOURWAYS: Record<DayNightVisual, DayNightPalette> = {
  MORN: { panel: 'rgba(38, 52, 84, 0.92)', accent: '#fbbf24', text: '#fef3c7', muted: '#fde68a', skyTop: '#f59e0b', skyBottom: '#1e3a5f', tint: 'rgba(251, 191, 36, 0.10)' },
  DAY: { panel: 'rgba(22, 35, 58, 0.92)', accent: '#22d3ee', text: '#f1f5f9', muted: '#bae6fd', skyTop: '#38bdf8', skyBottom: '#0b1226', tint: 'rgba(34, 211, 238, 0.06)' },
  EVE: { panel: 'rgba(46, 28, 58, 0.92)', accent: '#f472b6', text: '#fdf2f8', muted: '#fbcfe8', skyTop: '#ec4899', skyBottom: '#1e1b4b', tint: 'rgba(244, 114, 182, 0.12)' },
  NITE: { panel: 'rgba(10, 16, 34, 0.94)', accent: '#818cf8', text: '#e0e7ff', muted: '#a5b4fc', skyTop: '#1e1b4b', skyBottom: '#020617', tint: 'rgba(129, 140, 248, 0.14)' },
};

export const DAY_NIGHT_VISUALS: DayNightVisual[] = ['MORN', 'DAY', 'EVE', 'NITE'];

/** Next visual state in MORN -> DAY -> EVE -> NITE -> MORN order. */
function nextVisual(v: DayNightVisual): DayNightVisual {
  const order: DayNightVisual[] = ['MORN', 'DAY', 'EVE', 'NITE'];
  return order[(order.indexOf(v) + 1) % order.length];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function blendHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

export interface DayNightBlend {
  current: DayNightVisual;
  next: DayNightVisual;
  /** 0 = fully current, 1 = fully next. Progresses through the
   *  LAST hour of the current period, so the change is gradual
   *  across that hour instead of a hard cut at the boundary. */
  t: number;
  palette: DayNightPalette;
}

/**
 * Gradual transition: during the last hour of a period, blend the
 * palette toward the next period by minute/60. Outside that hour
 * t = 0 (pure current palette). Boundary hours: MORN ends 09,
 * DAY ends 17, EVE ends 20, NITE ends 23 (then LATE/NITE visual
 * continues into 0-3, so no blend is shown at midnight — the
 * visual does not change there, which is correct).
 */
export function dayNightBlend(hour: number, minute: number): DayNightBlend {
  const current = visualStateOf(getTimeOfDayByHour(hour));
  const lastHours: Record<DayNightVisual, number> = { MORN: 9, DAY: 17, EVE: 20, NITE: 23 };
  const next = nextVisual(current);
  const t = Math.floor(hour) === lastHours[current] ? Math.min(1, Math.max(0, minute / 60)) : 0;
  const cur = DAY_NIGHT_COLOURWAYS[current];
  const nxt = DAY_NIGHT_COLOURWAYS[next];
  const palette: DayNightPalette = {
    panel: cur.panel,
    accent: blendHex(cur.accent, nxt.accent, t),
    text: blendHex(cur.text, nxt.text, t),
    muted: blendHex(cur.muted, nxt.muted, t),
    skyTop: blendHex(cur.skyTop, nxt.skyTop, t),
    skyBottom: blendHex(cur.skyBottom, nxt.skyBottom, t),
    tint: cur.tint,
  };
  return { current, next, t, palette };
}

/** Resolve the palette actually shown for a mode + game time. */
export function resolveDayNightPalette(
  mode: 'AUTO' | 'CUSTOM' | 'OFF',
  custom: DayNightVisual,
  transition: boolean,
  now: Date = new Date(),
): DayNightPalette {
  if (mode === 'OFF') return DAY_NIGHT_COLOURWAYS.DAY;
  if (mode === 'CUSTOM') return DAY_NIGHT_COLOURWAYS[custom];
  if (!transition) return DAY_NIGHT_COLOURWAYS[getGameVisualState(now)];
  return dayNightBlend(now.getHours(), now.getMinutes()).palette;
}

/* ------------------------------------------------------------------ */
/* MenuCustomSettings                                                  */
/* ------------------------------------------------------------------ */

export type MenuAnimationStyle = 'SINE' | 'FLOW' | 'RISE_FADE';
export type MenuAnchor = 'TOP' | 'CENTER' | 'BOTTOM';
export type MenuOrder = 'DEFAULT' | 'REVERSED';
export type BackgroundBiome = TitleBiomeId | 'AUTO' | 'NONE';
export type SpriteProportion = 'CHIBI' | 'TALL';
export type TextSizeId = 'S' | 'M' | 'L' | 'XL';
export type DialogueBoxStyle = 'ROUNDED' | 'SQUARE' | 'GLOSS' | 'MINIMAL';
export type DayNightMode = 'AUTO' | 'CUSTOM' | 'OFF';

export interface MenuLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  spacing: number;
  anchor: MenuAnchor;
  order: MenuOrder;
}

export interface MenuCustomSettings {
  layout: MenuLayout;
  animationStyle: MenuAnimationStyle;
  /** Global animation speed multiplier, 0.5 - 2.0. */
  animationSpeed: number;
  /** Sine sway amplitude, 0 - 8 (px in the preview strip). */
  sway: number;
  backgroundBiome: BackgroundBiome;
  /** GAP for menus: painted title backgrounds exist for 8/8 biomes
   *  (Title Backgrounds lane, complete) but are not wired as menu
   *  backgrounds yet — row is labelled NEED. */
  backgroundPainted: false;
  symbolLayer: boolean;
  /** Background fade, 0 - 100 (opacity % of the background layer). */
  backgroundFade: number;
  dayNightMode: DayNightMode;
  dayNightCustom: DayNightVisual;
  dayNightTransition: boolean;
  /** Day/night tint strength, 0 - 100 (%). */
  dayNightTint: number;
  spriteProportion: SpriteProportion;
  textSize: TextSizeId;
  /** Dialogue/menu line spacing multiplier, 1.0 - 2.0. */
  lineSpacing: number;
  textColor: string;
  textShadow: boolean;
  dialogueBoxStyle: DialogueBoxStyle;
  cameraShake: boolean;
  reducedMotion: boolean;
  /** Touch target height, px. Default 48 (existing row height). */
  touchSize: number;
  safeArea: boolean;
}

export const DEFAULT_MENU_CUSTOM: MenuCustomSettings = {
  layout: { x: 0, y: 0, w: 512, h: 0, spacing: 12, anchor: 'CENTER', order: 'DEFAULT' },
  animationStyle: 'RISE_FADE',
  animationSpeed: 1,
  sway: 3,
  backgroundBiome: 'AUTO',
  backgroundPainted: false,
  symbolLayer: true,
  backgroundFade: 100,
  dayNightMode: 'AUTO',
  dayNightCustom: 'DAY',
  dayNightTransition: true,
  dayNightTint: 100,
  spriteProportion: 'CHIBI',
  textSize: 'M',
  lineSpacing: 1.5,
  textColor: '#f1f5f9',
  // Mars readability order 2026-10-26: dialogue shadow layer ON
  // by default (was false). applyMenuCustom maps true to
  // '0 2px 0 rgba(0,0,0,0.6)' — the game's own ON value, a
  // Pokemon-style shadow offset under the fg text. The Settings
  // TEXT SHADOW row still lets any player turn it OFF; saved
  // settings keep their stored value.
  textShadow: true,
  dialogueBoxStyle: 'ROUNDED',
  cameraShake: true,
  reducedMotion: false,
  touchSize: 48,
  safeArea: true,
};

export const ANIMATION_STYLES: MenuAnimationStyle[] = ['SINE', 'FLOW', 'RISE_FADE'];
export const MENU_ANCHORS: MenuAnchor[] = ['TOP', 'CENTER', 'BOTTOM'];
export const MENU_ORDERS: MenuOrder[] = ['DEFAULT', 'REVERSED'];
export const BACKGROUND_BIOMES: BackgroundBiome[] = [
  'AUTO', 'NONE', 'snow', 'grass', 'water', 'sand', 'stone', 'forest', 'rain', 'night',
];
export const SPRITE_PROPORTIONS: SpriteProportion[] = ['CHIBI', 'TALL'];
export const TEXT_SIZES: TextSizeId[] = ['S', 'M', 'L', 'XL'];
export const TEXT_SIZE_PX: Record<TextSizeId, number> = { S: 12, M: 14, L: 16, XL: 20 };
export const TEXT_COLORS_CUSTOM = ['#f1f5f9', '#fbbf24', '#f472b6', '#22d3ee', '#4ade80'];
export const DIALOGUE_BOX_STYLES: DialogueBoxStyle[] = ['ROUNDED', 'SQUARE', 'GLOSS', 'MINIMAL'];
export const DIALOGUE_BOX_RADIUS: Record<DialogueBoxStyle, number> = {
  ROUNDED: 14, SQUARE: 2, GLOSS: 18, MINIMAL: 8,
};
export const DAY_NIGHT_MODES: DayNightMode[] = ['AUTO', 'CUSTOM', 'OFF'];

/**
 * Sprite Proportions: the chibi path is the only rendered path.
 * TALL falls back to the chibi scale and art — it is NEVER blank
 * and never a missing sprite. `fallback` tells the UI to label
 * the row "TALL (falls back to Chibi)" instead of claiming a
 * tall render exists. Tall rendering itself is NEED.
 */
export function spriteDisplayScale(proportion: SpriteProportion): { scale: number; fallback: boolean } {
  if (proportion === 'TALL') return { scale: 1, fallback: true };
  return { scale: 1, fallback: false };
}

/** Biome actually shown for a backgroundBiome choice + game time. */
export function resolveBackgroundBiome(choice: BackgroundBiome, now: Date = new Date()): TitleBiomeId | null {
  if (choice === 'NONE') return null;
  if (choice === 'AUTO') {
    const visual = getGameVisualState(now);
    if (visual === 'NITE') return 'night';
    if (visual === 'MORN') return 'grass';
    if (visual === 'EVE') return 'forest';
    return 'grass';
  }
  return choice;
}

export function biomeBackgroundCss(biome: TitleBiomeId | null, fade: number): string {
  if (!biome) return '#050810';
  const b = TITLE_BIOMES[biome];
  // Fade = layer opacity: at 0% the gradient is fully transparent
  // (the dark #050810 base shows through), at 100% fully opaque.
  const a = Math.min(100, Math.max(0, fade)) / 100;
  const toRgba = (n: number) => {
    const r = (n >> 16) & 255, g = (n >> 8) & 255, bl = n & 255;
    return `rgba(${r}, ${g}, ${bl}, ${a})`;
  };
  return `linear-gradient(180deg, ${toRgba(b.sky)} 0%, ${toRgba(b.sky2)} 100%)`;
}

/* ------------------------------------------------------------------ */
/* Persistence + CSS-var application (live-on-return)                  */
/* ------------------------------------------------------------------ */

const CUSTOM_KEY = 'mochiichao_menu_custom_v1';

export function loadMenuCustom(): MenuCustomSettings {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return { ...DEFAULT_MENU_CUSTOM, layout: { ...DEFAULT_MENU_CUSTOM.layout } };
    const parsed = JSON.parse(raw) as Partial<MenuCustomSettings>;
    return {
      ...DEFAULT_MENU_CUSTOM,
      ...parsed,
      layout: { ...DEFAULT_MENU_CUSTOM.layout, ...(parsed.layout || {}) },
      backgroundPainted: false,
    };
  } catch {
    return { ...DEFAULT_MENU_CUSTOM, layout: { ...DEFAULT_MENU_CUSTOM.layout } };
  }
}

export function persistMenuCustom(c: MenuCustomSettings): void {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(c));
  } catch {
    // Session-only fallback, same as persistSettings: nothing erased.
  }
}

/**
 * Apply custom settings as CSS vars on :root. DialogueBox reads
 * --menu-text-* and --menu-dialogue-radius; SettingsScreen reads
 * the day/night + background vars. Calling this on SAVE + BACK
 * is what makes rows "live on return": the next screen rendered
 * after Settings already sees the new vars. main.tsx also calls
 * this at startup so a returning player's choice is not lost.
 */
export function applyMenuCustom(c: MenuCustomSettings, now: Date = new Date()): void {
  try {
    const root = document.documentElement;
    const palette = resolveDayNightPalette(c.dayNightMode, c.dayNightCustom, c.dayNightTransition, now);
    const tintStrength = Math.min(100, Math.max(0, c.dayNightTint)) / 100;
    root.style.setProperty('--menu-text-size', `${TEXT_SIZE_PX[c.textSize]}px`);
    root.style.setProperty('--menu-line-height', String(c.lineSpacing));
    root.style.setProperty('--menu-text-color', c.textColor);
    root.style.setProperty('--menu-text-shadow', c.textShadow ? '0 2px 0 rgba(0,0,0,0.6)' : 'none');
    root.style.setProperty('--menu-dialogue-radius', `${DIALOGUE_BOX_RADIUS[c.dialogueBoxStyle]}px`);
    root.style.setProperty('--menu-daynight-accent', palette.accent);
    root.style.setProperty('--menu-daynight-text', palette.text);
    root.style.setProperty('--menu-daynight-sky-top', palette.skyTop);
    root.style.setProperty('--menu-daynight-sky-bottom', palette.skyBottom);
    root.style.setProperty('--menu-daynight-tint', palette.tint);
    root.style.setProperty('--menu-daynight-tint-strength', String(tintStrength));
    root.style.setProperty('--menu-anim-speed', String(c.animationSpeed));
    root.style.setProperty('--menu-reduced-motion', c.reducedMotion ? 'none' : 'running');
    root.style.setProperty('--menu-touch-size', `${c.touchSize}px`);
    root.style.setProperty('--menu-safe-top', c.safeArea ? 'env(safe-area-inset-top)' : '0px');
    root.style.setProperty('--menu-safe-bottom', c.safeArea ? 'env(safe-area-inset-bottom)' : '0px');
    root.style.setProperty('--menu-sprite-proportion', c.spriteProportion === 'TALL' ? 'tall-fallback-chibi' : 'chibi');
  } catch {
    // No document (tests / SSR): settings still persist; nothing erased.
  }
}

/** Mirror a custom block into the existing preset.layout record
 *  (the Layout Editor path): numeric keys the Layout Editor
 *  already stores, so a preset exported before/after this batch
 *  still carries the same layout numbers. */
export function customToLayoutRecord(c: MenuCustomSettings): Record<string, number> {
  return {
    menuX: c.layout.x,
    menuY: c.layout.y,
    menuW: c.layout.w,
    menuH: c.layout.h,
    menuSpacing: c.layout.spacing,
  };
}
