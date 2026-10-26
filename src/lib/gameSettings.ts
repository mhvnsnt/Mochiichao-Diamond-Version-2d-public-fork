/**
 * Game settings — title/press/settings wiring, 2026-10-25.
 *
 * Structure translated from Pokemon options menus (FireRed
 * option_menu.c, HeartGold options_app.c, Platinum options_menu.c,
 * Black 2 config_panel.c), never Pokemon code, text, or files copied.
 * Union, FireRed order: TEXT SPEED, BATTLE SCENE, BATTLE STYLE,
 * SOUND, BUTTON MODE, FRAME, CANCEL. Counts: FireRed {3,2,2,2,3,10,0},
 * HeartGold FRAME 20, Platinum {3,2,2,2,3,20,0} with FRAME called
 * MESSAGE BOX FRAME (same slot, Mochiichao name is FRAME).
 *
 * Settings are stored two ways, both ours: (1) in the zustand game
 * state, so SaveMenu / GameShell saveGame serializes them with the
 * save (no second save system); (2) in localStorage, so a setting
 * chosen before any save still persists across page loads.
 * Changing a setting never erases a save.
 *
 * FRAME 1-20 are ORIGINAL Mochiichao Y2K frame variants in those
 * slots, not Pokemon frame tiles. Frames 1-3 reuse the in-repo panel
 * shapes (Main / Small / Title); frames 4-20 are Y2K accent variants
 * (colour + radius), in the Kenney CC0 rounded/square style, not
 * Kenney files copied in. A frame change reloads live on return to
 * the real screen (Pokemon FRAME pattern), via frameAccent().
 *
 * Presets (Menu Creator family) are stored separately and NEVER
 * overwrite the locked main-menu default v32 until Mars locks a new
 * one. Reset to Locked Default restores DEFAULT_SETTINGS + the v32
 * preset below.
 */

export type TextSpeed = 'SLOW' | 'MID' | 'FAST';
export type BattleScene = 'ON' | 'OFF';
export type BattleStyle = 'SHIFT' | 'SET';
export type SoundMode = 'MONO' | 'STEREO';
export type ButtonMode = 'NORMAL' | 'LR' | 'L_EQUALS_A';

export interface GameSettings {
  textSpeed: TextSpeed;
  battleScene: BattleScene;
  battleStyle: BattleStyle;
  sound: SoundMode;
  buttonMode: ButtonMode;
  /** 1-20. */
  frame: number;
  /** Font ids from src/lib/fonts.ts, six independent placements
   *  (Mars font correction, 2026-10-25 18:22/18:30 CDT, overrides
   *  the 2-row version; Mars readability order, 2026-10-26):
   *  MAIN = titles/menus/headings/UI labels (Yagiza);
   *  MENU = menu selection row text (Pokemon Base, readable
   *  default — was Yagiza); DIALOGUE = dialogue boxes/NPC
   *  talk/body text (Pokemon Base, readable default — was
   *  01 Digitall); SMALL = small text, Pokemon FONT_SMALL slot
   *  (01 Digitall); BOLD = bold headings/action buttons,
   *  FONT_BOLD slot (Yagiza); BATTLE = battle log/HUD
   *  (01 Digitall). Every row cycles the full font list
   *  independently, so both groups (Pokemon Base/slots + Mars's
   *  chosen fonts) are available on every row. DIAMOND VERSION
   *  subtitle font is PINNED (see PINNED_SUBTITLE_FONT in
   *  fonts.ts) — no font row touches it.
   *  Never a Pokemon font file. */
  mainFont: string;
  menuFont: string;
  dialogueFont: string;
  smallFont: string;
  boldFont: string;
  battleFont: string;
  /** Cursor shape id, see CURSOR_SHAPES in SettingsScreen. */
  cursorShape: string;
  cursorColor: string;
  cursorGlow: boolean;
  /** Batch A (UI/HUD) — HUD rows, see src/lib/hudCustom.ts. */
  hudHealthbar: string;
  hudBattleLayout: string;
  hudMoveLayout: string;
  hudPpType: string;
  hudMessageStyle: string;
  hudDamageStyle: string;
  /** Batch A — border rows beyond FRAME 1-20: shadow and opacity
   *  are new settings (radius / border width / white border /
   *  gloss / glow / gradient stay preset fields, rendered by
   *  SettingsScreen's panel style); per-menu rows are stored here
   *  so every screen can read them from the store, and presets
   *  carry them via their settings snapshot. Per-menu frame 0 =
   *  follow the global FRAME row. */
  panelShadow: boolean;
  panelOpacity: number;
  perMenuPanelColor: Record<string, string>;
  perMenuFrame: Record<string, number>;
  /** Batch A — cursor rows beyond shape / colour / glow. */
  cursorShadow: boolean;
  cursorBlink: boolean;
  cursorBlinkSpeed: string;
  cursorHighlight: string;
  /** Stored flag only: no audio engine in this build to play a
   *  move sound through yet (SOUND flag precedent, PR #28). */
  cursorSound: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'MID',
  battleScene: 'ON',
  battleStyle: 'SHIFT',
  sound: 'STEREO',
  buttonMode: 'NORMAL',
  frame: 1,
  mainFont: 'yagiza',
  menuFont: 'pokemon-base',
  dialogueFont: 'pokemon-base',
  smallFont: '01-digitall',
  boldFont: 'yagiza',
  battleFont: '01-digitall',
  cursorShape: 'ARROW',
  cursorColor: '#fbbf24',
  cursorGlow: true,
  hudHealthbar: 'CLASSIC',
  hudBattleLayout: 'CLASSIC',
  hudMoveLayout: 'GRID_2X2',
  hudPpType: 'FULL',
  hudMessageStyle: 'CLASSIC',
  hudDamageStyle: 'PLAIN',
  panelShadow: false,
  panelOpacity: 100,
  perMenuPanelColor: { ROSTER: 'pink', SHOP: 'yellow', BAG: 'green', BATTLE: 'red', PC: 'blue', GARDEN: 'purple', SETTINGS: 'blue', PARTY: 'pink' },
  perMenuFrame: { ROSTER: 0, SHOP: 0, BAG: 0, BATTLE: 0, PC: 0, GARDEN: 0, SETTINGS: 0, PARTY: 0 },
  cursorShadow: false,
  cursorBlink: false,
  cursorBlinkSpeed: 'MID',
  cursorHighlight: '#fcd34d',
  cursorSound: false,
};

/** Dialogue typewriter interval in ms per character. MID 18ms is the
 *  pre-existing DialogueBox interval, kept exactly. */
export const TEXT_SPEED_MS: Record<TextSpeed, number> = {
  SLOW: 45,
  MID: 18,
  FAST: 6,
};

export const TEXT_SPEEDS: TextSpeed[] = ['SLOW', 'MID', 'FAST'];
export const BATTLE_SCENES: BattleScene[] = ['ON', 'OFF'];
export const BATTLE_STYLES: BattleStyle[] = ['SHIFT', 'SET'];
export const SOUNDS: SoundMode[] = ['MONO', 'STEREO'];
export const BUTTON_MODES: ButtonMode[] = ['NORMAL', 'LR', 'L_EQUALS_A'];

/** Y2K accent colour per frame, cycling pink / yellow / blue / green /
 *  teal — the v32 main-menu panel colours, not Pokemon palettes. */
const FRAME_ACCENTS = [
  '#22d3ee', '#f472b6', '#facc15', '#60a5fa', '#4ade80',
  '#22d3ee', '#f472b6', '#facc15', '#60a5fa', '#4ade80',
  '#e879f9', '#fb923c', '#2dd4bf', '#a78bfa', '#f87171',
  '#22d3ee', '#f472b6', '#facc15', '#60a5fa', '#4ade80',
];

export function frameAccent(frame: number): string {
  const n = Math.min(20, Math.max(1, Math.floor(frame) || 1));
  return FRAME_ACCENTS[n - 1];
}

export function frameName(frame: number): string {
  const n = Math.min(20, Math.max(1, Math.floor(frame) || 1));
  if (n === 1) return 'Frame 1 — Main panel';
  if (n === 2) return 'Frame 2 — Small panel';
  if (n === 3) return 'Frame 3 — Title panel';
  return `Frame ${n} — Y2K accent`;
}

const SETTINGS_KEY = 'mochiichao_settings_v1';
const PRESETS_KEY = 'mochiichao_menu_presets_v1';

export function loadStoredSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function persistSettings(s: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // Storage unavailable (private mode, etc.): settings still live
    // in the zustand state for this session; nothing is erased.
  }
}

/** Locked main-menu default v32, spec coordinates (1200x1500 canvas).
 *  These are the SPEC lock, not a pixel layout applied to the responsive
 *  web screens — the web screens are responsive, so v32 is honoured as
 *  order, colours, and panel proportions, not as fixed tile positions.
 *  A preset must never overwrite this until Mars locks a new one. */
export const LOCKED_DEFAULT_V32 = {
  logoWidth: 900,
  logoCentre: { x: 600, y: 454 },
  cloudCentre: { x: 600, y: 738 },
  cloudSize: { w: 700, h: 180 },
  panels: [
    { key: 'CONTINUE', y: 788, h: 110, color: 'pink' },
    { key: 'NEW GAME', y: 918, h: 70, color: 'yellow' },
    { key: 'SETTINGS', y: 1008, h: 70, color: 'blue' },
    { key: 'BACK TO TITLE', y: 1098, h: 70, color: 'green' },
  ],
  background: { fullStart: 905, gone: 620, fadeLength: 285, fadeSplit: 729 },
  animation: { riseSpeed: 5.5, sway: 3, bob: 2, symbols: 300 },
} as const;

export interface MenuPreset {
  name: string;
  settings: GameSettings;
  /** Batch B menu customisation (themes / day-night / animation /
   *  background / sprite proportions / text extras / gameplay).
   *  Optional so presets saved before batch B still load; readers
   *  merge DEFAULT_MENU_CUSTOM over a missing block. Stored here
   *  so preset JSON export carries the custom block, and mirrored
   *  from the preset into the standalone custom store on save.
   *  Type-only import: no runtime cycle with menuCustom.ts. */
  custom?: import('./menuCustom').MenuCustomSettings;
  logoImage: string;
  logoSize: number;
  panelRadius: number;
  panelBorderWidth: number;
  whiteBorder: boolean;
  gloss: boolean;
  glow: boolean;
  gradient: boolean;
  panelColor: string;
  symbolCount: number;
  /** Layout Editor values (X/Y/W/H etc.), preset only on the
   *  responsive web screens — stored, not applied as fixed tile
   *  positions, until layout-as-data application is wired. */
  layout: Record<string, number>;
  cursorSize: string;
  savedAt: number;
}

import { DEFAULT_MENU_CUSTOM } from './menuCustom';

export const LOCKED_PRESET: MenuPreset = {
  name: 'Locked Default (v32)',
  settings: { ...DEFAULT_SETTINGS },
  custom: { ...DEFAULT_MENU_CUSTOM, layout: { ...DEFAULT_MENU_CUSTOM.layout } },
  logoImage: 'OFFICIAL',
  logoSize: 900,
  panelRadius: 14,
  panelBorderWidth: 2,
  whiteBorder: true,
  gloss: true,
  glow: true,
  gradient: true,
  panelColor: 'blue',
  symbolCount: 300,
  layout: {},
  cursorSize: 'M',
  savedAt: 0,
};

/** Original Defaults preset (Mars font-role update): non-proprietary
 *  open fonts only — MAIN = Bungee, DIALOGUE = Fredoka (Bungee /
 *  Titan One / Fredoka style). This is a preset, not the locked
 *  default, and it never uses a Pokemon font file. */
export const ORIGINAL_DEFAULTS_PRESET: MenuPreset = {
  name: 'Original Defaults (open fonts)',
  settings: { ...DEFAULT_SETTINGS, mainFont: 'bungee', menuFont: 'titan-one', dialogueFont: 'fredoka', smallFont: 'fredoka', boldFont: 'bungee', battleFont: 'fredoka' },
  custom: { ...DEFAULT_MENU_CUSTOM, layout: { ...DEFAULT_MENU_CUSTOM.layout } },
  logoImage: 'OFFICIAL',
  logoSize: 900,
  panelRadius: 14,
  panelBorderWidth: 2,
  whiteBorder: true,
  gloss: true,
  glow: true,
  gradient: true,
  panelColor: 'blue',
  symbolCount: 300,
  layout: {},
  cursorSize: 'M',
  savedAt: 0,
};

export function loadPresets(): MenuPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [{ ...LOCKED_PRESET }];
    const parsed = JSON.parse(raw) as MenuPreset[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [{ ...LOCKED_PRESET }];
    return parsed;
  } catch {
    return [{ ...LOCKED_PRESET }];
  }
}

export function savePresets(presets: MenuPreset[]): void {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // Same as persistSettings: session-only fallback, nothing erased.
  }
}

/** Export preset as JSON — the Tuxemon layout-as-data IDEA, our own
 *  JSON, not Tuxemon code. Download is done by the caller. */
export function presetToJson(preset: MenuPreset): string {
  return JSON.stringify(preset, null, 2);
}
