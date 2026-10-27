import React, { useEffect, useMemo, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import StdWindow from './StdWindow';
import {
  GameSettings, DEFAULT_SETTINGS, TEXT_SPEEDS, BATTLE_SCENES, BATTLE_STYLES,
  SOUNDS, BUTTON_MODES, frameAccent, frameName, persistSettings,
  MenuPreset, LOCKED_PRESET, loadPresets, savePresets, presetToJson,
} from '../../lib/gameSettings';
import { FONT_OPTIONS, fontById, applyFontRoles } from '../../lib/fonts';
import { setSoundMode, playUiPreview } from '../../lib/audioRouting';
import { isConfirmKey, shoulderKey, buttonModeNote } from '../../lib/buttonMode';
import {
  MENU_SKIN_MENUS, MENU_SKIN_FLAVOURS, loadMenuSkinChoices, setMenuSkin,
  type MenuSkinMenu, type MenuSkinChoices,
} from '../../lib/menuSkins';
import IntroVideoCreatorScreen from './IntroVideoCreatorScreen';
import StartScreenCreator from './StartScreenCreator';
import MusicMixerScreen from './MusicMixerScreen';
import MenuEditorScreen from './MenuEditorScreen';
import {
  MenuCustomSettings, MenuAnimationStyle, DEFAULT_MENU_CUSTOM, loadMenuCustom, persistMenuCustom,
  applyMenuCustom, customToLayoutRecord, resolveDayNightPalette,
  resolveBackgroundBiome, biomeBackgroundCss, spriteDisplayScale,
  ANIMATION_STYLES, MENU_ANCHORS, MENU_ORDERS, BACKGROUND_BIOMES,
  SPRITE_PROPORTIONS, TEXT_SIZES, TEXT_SIZE_PX, TEXT_COLORS_CUSTOM,
  DIALOGUE_BOX_STYLES, DIALOGUE_BOX_RADIUS, DAY_NIGHT_MODES, DAY_NIGHT_VISUALS,
  getGameTimeOfDay, visualStateOf, dayNightBlend,
} from '../../lib/menuCustom';
import {
  HEALTHBAR_STYLES, BATTLE_HUD_LAYOUTS, MOVE_BUTTON_LAYOUTS, PP_TYPE_DISPLAYS,
  MESSAGE_WINDOW_STYLES, DAMAGE_NUMBER_STYLES, CURSOR_BLINK_SPEEDS, MENU_KEYS,
  menuFrameAccent, cursorBlinkDuration, cursorGlyphSize,
  type HealthbarStyle, type BattleHudLayout, type MoveButtonLayout, type PpTypeDisplay,
  type MessageWindowStyle, type DamageNumberStyle, type CursorBlinkSpeed, type MenuKey,
} from '../../lib/hudCustom';

/**
 * Settings — real full screen, NOT a note, NOT a popup.
 * Layout translated from FireRed option_menu.c (structure only):
 * header window, list window, help bar, label left / value right,
 * UP/DOWN wraps, LEFT/RIGHT cycles, CANCEL saves + exits.
 * Skin is Mochiichao Y2K (glossy rounded panels, white border, glow,
 * per-menu colours — Settings blue, like the v32 SETTINGS panel).
 *
 * Wired rows (core settings, saved to the game state + localStorage):
 * TEXT SPEED, BATTLE SCENE, BATTLE STYLE, SOUND, BUTTON MODE, FRAME,
 * FONT. Effects: text speed -> DialogueBox interval; battle scene ->
 * BattleView animation skip; battle style -> BattleView switch
 * choice; frame -> frameAccent() on real windows; font -> --game-font.
 * SOUND is routed, not just stored (2026-10-25): audioRouting.ts
 * builds a real Web Audio graph — STEREO passthrough, MONO
 * downmix (split, halve, sum to one channel) — applied live while
 * cycling and on every save; pressing A on the SOUND row plays a
 * left/right preview tone through it. Boot / press-start slots
 * are wired separately in bootAudio.ts (PR #79, settled roles:
 * BOOT = UI Art Option B,
 * PRESS-START = M3 chirp — never swapped). BUTTON MODE is
 * honoured here and, via buttonMode.ts, on the main menu, in
 * dialogue, in battle, and in world movement; the surfaces where
 * a mode has no honest action (dialogue LR, overworld LR,
 * pause-menu keys, HELP toggle) stay labelled NEED in
 * buttonMode.ts, not faked.
 *
 * Preset rows (Menu Creator family) are saved as presets and NEVER
 * overwrite locked v32 until Mars locks a new one. Reset to Locked
 * Default restores DEFAULT_SETTINGS + LOCKED_PRESET.
 */

type Screen = 'SETTINGS' | 'MENU_CREATOR' | 'MENU_CUSTOM' | 'UI_CREATOR' | 'LAYOUT_EDITOR' | 'CURSOR_CREATOR' | 'PANEL_FRAME_EDITOR' | 'FONT_SETTINGS' | 'INTRO_VIDEO_CREATOR' | 'START_SCREEN_CREATOR' | 'MUSIC_MIXER' | 'MENU_EDITOR';

interface Row {
  label: string;
  value: string;
  onLeft: () => void;
  onRight: () => void;
  onSelect?: () => void;
  note?: string;
}

const cycle = <T,>(arr: T[], cur: T, dir: 1 | -1): T => {
  const i = arr.indexOf(cur);
  const next = (i < 0 ? 0 : i + dir + arr.length) % arr.length;
  return arr[next];
};
const PANEL_COLORS = ['blue', 'pink', 'yellow', 'green', 'teal', 'purple'];
const CURSOR_COLORS = ['#fbbf24', '#f472b6', '#22d3ee', '#4ade80', '#ffffff', '#fb923c'];
const CURSOR_SHAPES = [
  { id: 'ARROW', glyph: '►', label: 'Arrow' },
  { id: 'DIAMOND', glyph: '◆', label: 'Diamond' },
  { id: 'STAR', glyph: '✦', label: 'Star' },
  { id: 'RING', glyph: '◎', label: 'Glow Ring' },
];
const LOGO_IMAGES = ['OFFICIAL', 'V1', 'V2', 'V3'];
const TEXT_COLORS = ['#f1f5f9', '#fbbf24', '#f472b6', '#22d3ee', '#4ade80'];

/**
 * Batch-B follow-up: real preview-strip motion, replacing the
 * Tailwind pulse stand-in. One motion layer: Motion (MIT,
 * already a dependency) via useAnimationFrame + motion values —
 * no CSS pulse, no new package.
 * - SINE: FireRed method, offset = Sin(angle, amplitude)
 *   (pokefirered-leafgreen battle_anim_*.c: sprite->y2 =
 *   Sin(data, amplitude)); amplitude = sway px, angle advances
 *   2PI per 2s at 1x, scaled by animationSpeed.
 * - FLOW: linear drift loop, x sweeping -2*sway..+2*sway px over
 *   4s at 1x, scaled by animationSpeed (sway 0 = still).
 * - RISE_FADE: 2s loop at 1x, y rises 0..-12px while opacity
 *   fades 1..0, then restarts.
 * Reduced motion: static whenever the REDUCED MOTION row is ON
 * OR the OS prefers-reduced-motion (Motion useReducedMotion).
 * This animates ONLY the Menu Custom preview strip; title /
 * main-menu symbol-layer motion in game is still NEED.
 */
function MenuPreviewMotion({ style, speed, sway, reduced }: { style: MenuAnimationStyle; speed: number; sway: number; reduced: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(1);
  const osReduced = useReducedMotion();
  const frozen = reduced || osReduced === true;
  useAnimationFrame((t) => {
    if (frozen) { x.set(0); y.set(0); opacity.set(1); return; }
    const sec = (t / 1000) * speed;
    if (style === 'SINE') {
      x.set(0);
      y.set(Math.sin(sec * Math.PI) * sway);
      opacity.set(1);
    } else if (style === 'FLOW') {
      const cycle = ((sec % 4) + 4) % 4 / 4;
      x.set((cycle * 2 - 1) * sway * 2);
      y.set(0);
      opacity.set(1);
    } else {
      const phase = ((sec % 2) + 2) % 2 / 2;
      x.set(0);
      y.set(-phase * 12);
      opacity.set(1 - phase);
    }
  });
  return (
    <motion.div style={{ x, y, opacity }}>
      ✦ Menu preview strip — real {style} motion (Motion frame driver{style === 'SINE' ? '; FireRed Sin(angle, sway)' : ''}); title/main-menu symbol-layer motion in game is still NEED.
    </motion.div>
  );
}

export default function SettingsScreen({ onBack, onViewTitle }: { onBack: () => void; onViewTitle?: () => void }) {
  const settings = useGameStore(s => s.settings);
  const setSettings = useGameStore(s => s.setSettings);
  const [draft, setDraft] = useState<GameSettings>({ ...settings });
  const [screen, setScreen] = useState<Screen>('SETTINGS');
  const [menuPage, setMenuPage] = useState(1);
  const [cursor, setCursor] = useState(0);
  const [presets, setPresets] = useState<MenuPreset[]>(() => loadPresets());
  const [preset, setPreset] = useState<MenuPreset>(() => loadPresets()[0] || { ...LOCKED_PRESET });
  // Batch B menu customisation draft. Initial value: the standalone
  // custom store if present, else the active preset's custom block,
  // else defaults — so a preset saved before batch B still loads.
  const [custom, setCustom] = useState<MenuCustomSettings>(() => {
    const stored = loadMenuCustom();
    const fromPreset = loadPresets()[0]?.custom;
    if (fromPreset) return { ...DEFAULT_MENU_CUSTOM, ...fromPreset, layout: { ...DEFAULT_MENU_CUSTOM.layout, ...fromPreset.layout }, backgroundPainted: false };
    return stored;
  });
  const setC = (patch: Partial<MenuCustomSettings>) => setCustom(c => ({ ...c, ...patch }));
  const setLayout = (patch: Partial<MenuCustomSettings['layout']>) => setCustom(c => ({ ...c, layout: { ...c.layout, ...patch } }));
  const [presetName, setPresetName] = useState('My Preset 1');
  const [savedMsg, setSavedMsg] = useState('');
  const [fontReturn, setFontReturn] = useState<Screen>('SETTINGS');
  // Batch A: which menu the per-menu panel colour / frame rows target.
  // Selector only — the colour / frame values themselves live in
  // the settings (draft) and are saved with the preset's snapshot.
  const [perMenuTarget, setPerMenuTarget] = useState<MenuKey>('SETTINGS');
  // Y2K skin selector (skins PR #151 wiring): one row per owed menu
  // in settingsRows below. Stored under menuSkins.ts's own
  // localStorage key and applied live (no reload, no save needed):
  // cycling a row writes immediately and re-renders the target menu
  // via the menuSkins change event. Independent of SAVE + EXIT and
  // of RESET TO LOCKED DEFAULT (v32) — skins never touch the locked
  // default, and the default is what a row returns to on 'Default'.
  const [skinChoices, setSkinChoices] = useState<MenuSkinChoices>(() => loadMenuSkinChoices());
  const cycleSkin = (menu: MenuSkinMenu, dir: 1 | -1) => {
    const flavours = MENU_SKIN_FLAVOURS.map(f => f.flavour);
    const next = cycle(flavours, skinChoices[menu], dir);
    setMenuSkin(menu, next);
    setSkinChoices(loadMenuSkinChoices());
  };
  const skinLabel = (menu: MenuSkinMenu) =>
    MENU_SKIN_FLAVOURS.find(f => f.flavour === skinChoices[menu])?.label || 'Default';

  // SETTINGS menu frame: per-menu override wins over the global
  // FRAME row when set (0 = follow global), per hudCustom.
  const accent = menuFrameAccent('SETTINGS', draft);
  const mainFontOpt = fontById(draft.mainFont);
  const menuFontOpt = fontById(draft.menuFont);
  const dialogueFontOpt = fontById(draft.dialogueFont);
  const smallFontOpt = fontById(draft.smallFont);
  const boldFontOpt = fontById(draft.boldFont);
  const battleFontOpt = fontById(draft.battleFont);

  // Batch B: saveAll also persists + applies the menu-custom draft
  // (live-on-return via applyMenuCustom) and mirrors it into the
  // preset being saved, so preset JSON export carries it. A preset
  // is never made the locked default by saving — only RESET does
  // that (see resetLocked, which passes the defaults explicitly,
  // because state setters above are async at that call site).
  const saveAll = (next: GameSettings, nextPreset?: MenuPreset, customOverride?: MenuCustomSettings) => {
    const c = customOverride ?? custom;
    setSettings(next);
    persistSettings(next);
    applyFontRoles(next);
    setSoundMode(next.sound);
    persistMenuCustom(c);
    applyMenuCustom(c);
    if (nextPreset) {
      const withCustom: MenuPreset = {
        ...nextPreset,
        custom: { ...c, layout: { ...c.layout } },
        layout: { ...nextPreset.layout, ...customToLayoutRecord(c) },
      };
      const list = presets.map(p => (p.name === withCustom.name ? withCustom : p));
      const finalList = list.some(p => p.name === withCustom.name) ? list : [...list, withCustom];
      setPresets(finalList);
      savePresets(finalList);
    }
    setSavedMsg('Saved.');
  };

  const saveAndBack = () => {
    saveAll(draft, preset);
    onBack();
  };

  const resetLocked = () => {
    const d = { ...DEFAULT_SETTINGS };
    const p = { ...LOCKED_PRESET, savedAt: Date.now() };
    const c = { ...DEFAULT_MENU_CUSTOM, layout: { ...DEFAULT_MENU_CUSTOM.layout } };
    setDraft(d);
    setPreset(p);
    setCustom(c);
    saveAll(d, p, c);
    setSavedMsg('Reset to Locked Default (v32).');
  };

  const exportPreset = () => {
    const blob = new Blob([presetToJson({ ...preset, settings: draft, custom: { ...custom, layout: { ...custom.layout } }, layout: { ...preset.layout, ...customToLayoutRecord(custom) } })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(preset.name || 'preset').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSavedMsg('Preset exported as JSON (layout-as-data, our own JSON).');
  };

  const set = (patch: Partial<GameSettings>) => setDraft(d => ({ ...d, ...patch }));
  const setP = (patch: Partial<MenuPreset>) => setPreset(p => ({ ...p, ...patch }));
  const cyclePresetField = <K extends keyof MenuPreset>(key: K, arr: any[], dir: 1 | -1) => {
    setP({ [key]: cycle(arr, (preset as any)[key], dir) } as any);
  };

  // --- Rows per screen -------------------------------------------------
  const settingsRows: Row[] = useMemo(() => [
    { label: 'TEXT SPEED', value: draft.textSpeed, onLeft: () => set({ textSpeed: cycle(TEXT_SPEEDS, draft.textSpeed, -1) }), onRight: () => set({ textSpeed: cycle(TEXT_SPEEDS, draft.textSpeed, 1) }), note: 'Dialogue typewriter speed. SLOW 45ms / MID 18ms / FAST 6ms per character.' },
    { label: 'BATTLE SCENE', value: draft.battleScene, onLeft: () => set({ battleScene: cycle(BATTLE_SCENES, draft.battleScene, -1) }), onRight: () => set({ battleScene: cycle(BATTLE_SCENES, draft.battleScene, 1) }), note: 'ON = battle animations play. OFF = animations skipped, results applied directly.' },
    { label: 'BATTLE STYLE', value: draft.battleStyle, onLeft: () => set({ battleStyle: cycle(BATTLE_STYLES, draft.battleStyle, -1) }), onRight: () => set({ battleStyle: cycle(BATTLE_STYLES, draft.battleStyle, 1) }), note: 'SHIFT = choose your next creature when one faints. SET = next creature sent automatically.' },
    { label: 'SOUND', value: draft.sound, onLeft: () => { const next = cycle(SOUNDS, draft.sound, -1); set({ sound: next }); setSoundMode(next); }, onRight: () => { const next = cycle(SOUNDS, draft.sound, 1); set({ sound: next }); setSoundMode(next); }, onSelect: () => { playUiPreview(); }, note: 'Routed through Web Audio (audioRouting.ts): STEREO keeps left/right separate, MONO downmixes to one channel. Press A (Enter) on this row to hear the left/right preview. Boot = Option B, press-start = M3 chirp, both wired via bootAudio.ts (PR #79), not this graph. NEED, not wired here: music / SFX banks and fade/ducking — no tracks exist yet to route.' },
    { label: 'BUTTON MODE', value: draft.buttonMode, onLeft: () => set({ buttonMode: cycle(BUTTON_MODES, draft.buttonMode, -1) }), onRight: () => set({ buttonMode: cycle(BUTTON_MODES, draft.buttonMode, 1) }), note: buttonModeNote(draft.buttonMode) + ' Q/E are the LR shoulders in list screens (Menu Creator pages, battle moves). NEED: dialogue LR, overworld LR, pause-menu keys, HELP toggle (no help system exists).' },
    { label: 'FRAME', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Original Mochiichao Y2K frames in Pokemon frame slots (1-10 FireRed base, 11-20 HeartGold/Platinum extra). Reloads live on return.' },
    { label: 'FONT SETTINGS', value: `${mainFontOpt.label} / ${menuFontOpt.label} / ${dialogueFontOpt.label}`, onLeft: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, onRight: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, onSelect: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, note: 'Six independent placements (Mars font correction): MAIN / MENU / DIALOGUE / SMALL / BOLD / BATTLE, each cycles every font in fonts-settings-list.md independently, including Default — Trebuchet MS / system sans. Applies live on return. DIAMOND VERSION subtitle font is PINNED and never changes.' },
    { label: 'MENU CREATOR', value: 'OPEN ►', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR'), note: 'Full screen: Logo / Background / Animation / Panels. Presets only, never overwrites v32.' },
    // Y2K skin rows (one per owed menu, skins PR #151 presets):
    // Default = the menu's existing look, unchanged. A flavour
    // recolours that menu's panels/text/selected frame only — layout,
    // actions and save data never change, and the locked v32 main
    // menu is never offered here. Saved immediately on cycling.
    ...MENU_SKIN_MENUS.map(m => ({
      label: `SKIN — ${m.label.toUpperCase()}`,
      value: skinLabel(m.menu),
      onLeft: () => cycleSkin(m.menu, -1),
      onRight: () => cycleSkin(m.menu, 1),
      note: `Per-menu Y2K skin preset (${m.presetFile}): Default / Pastel Day / Chrome Midnight / Bubblegum Pop. Applies live to ${m.label}; main menu and logo are never skinned.`,
    })),
    { label: 'MUSIC MIXER', value: 'OPEN ►', onLeft: () => setScreen('MUSIC_MIXER'), onRight: () => setScreen('MUSIC_MIXER'), onSelect: () => setScreen('MUSIC_MIXER'), note: 'Full dedicated screen: FL-Studio-style mixer for the title v3 + vocal stems (default project loads on open, DELETE removes a stem, NEW clears, LOAD DEFAULT restores). Draggable mixer window (Mars 2026-10-26, explicitly asked). Game music pauses while mixing.' },
    { label: 'CANCEL', value: 'SAVE + EXIT', onLeft: saveAndBack, onRight: saveAndBack, onSelect: saveAndBack, note: 'Saves all rows to the save + localStorage and returns to the main menu.' },
  ], [draft, mainFontOpt, menuFontOpt, dialogueFontOpt, preset, skinChoices]); // eslint-disable-line react-hooks/exhaustive-deps

  const menuCreatorRows: Row[] = useMemo(() => {
    const pages: Record<number, Row[]> = {
      1: [
        { label: 'LOGO IMAGE', value: preset.logoImage, onLeft: () => cyclePresetField('logoImage', LOGO_IMAGES, -1), onRight: () => cyclePresetField('logoImage', LOGO_IMAGES, 1), note: 'Preset only: OFFICIAL = Mars upload, V1/V2/V3 = kept options. Title logo art from a preset is NEED.' },
        { label: 'LOGO SIZE', value: String(preset.logoSize), onLeft: () => setP({ logoSize: Math.max(300, preset.logoSize - 50) }), onRight: () => setP({ logoSize: Math.min(1200, preset.logoSize + 50) }), note: 'Preset only on responsive screens. Locked v32 size is 900.' },
        { label: 'UI CREATOR', value: 'OPEN ►', onLeft: () => setScreen('UI_CREATOR'), onRight: () => setScreen('UI_CREATOR'), onSelect: () => setScreen('UI_CREATOR') },
        { label: 'LAYOUT EDITOR', value: 'OPEN ►', onLeft: () => setScreen('LAYOUT_EDITOR'), onRight: () => setScreen('LAYOUT_EDITOR'), onSelect: () => setScreen('LAYOUT_EDITOR') },
        { label: 'CURSOR CREATOR', value: 'OPEN ►', onLeft: () => setScreen('CURSOR_CREATOR'), onRight: () => setScreen('CURSOR_CREATOR'), onSelect: () => setScreen('CURSOR_CREATOR') },
        { label: 'PANEL FRAME EDITOR', value: 'OPEN ►', onLeft: () => setScreen('PANEL_FRAME_EDITOR'), onRight: () => setScreen('PANEL_FRAME_EDITOR'), onSelect: () => setScreen('PANEL_FRAME_EDITOR') },
        { label: 'FONT SETTINGS', value: `${mainFontOpt.label} / ${menuFontOpt.label} / ${dialogueFontOpt.label}`, onLeft: () => { setFontReturn('MENU_CREATOR'); setScreen('FONT_SETTINGS'); }, onRight: () => { setFontReturn('MENU_CREATOR'); setScreen('FONT_SETTINGS'); }, onSelect: () => { setFontReturn('MENU_CREATOR'); setScreen('FONT_SETTINGS'); }, note: 'Best submenu path: Settings > Menu Creator > Font Settings. Six rows: MAIN / MENU / DIALOGUE / SMALL / BOLD / BATTLE, each cycles every font independently.' },
        { label: 'MENU CUSTOMISATION', value: 'OPEN ►', onLeft: () => setScreen('MENU_CUSTOM'), onRight: () => setScreen('MENU_CUSTOM'), onSelect: () => setScreen('MENU_CUSTOM'), note: 'Batch B: themes, day/night colourways, animation, background, Sprite Proportions, text extras, camera shake, reduced motion, touch, safe area. Independent rows, live on return, presets never overwrite locked v32.' },
        { label: 'MENU EDITOR', value: 'OPEN ►', onLeft: () => setScreen('MENU_EDITOR'), onRight: () => setScreen('MENU_EDITOR'), onSelect: () => setScreen('MENU_EDITOR'), note: 'Mars 2026-10-26: edit everything the UI lane did, from inside the game — live preview, draggable/minimizable panels, per-layer values, template/theme/layer/background library, PNG + video export. Working preset only; locked v32 never overwritten.' },
        { label: 'CREATE INTRO VIDEO', value: 'OPEN ►', onLeft: () => setScreen('INTRO_VIDEO_CREATOR'), onRight: () => setScreen('INTRO_VIDEO_CREATOR'), onSelect: () => setScreen('INTRO_VIDEO_CREATOR'), note: 'Full dedicated screen: scene list, timeline ruler, keyframes, presets. Presets only; locked default never overwritten. Playback from a saved preset is now live on main (PR #112). Still GAP: Phase 2 video export; painted backgrounds; creatures 1/10 ready with 9/10 GAP labels; music slot empty/name-only.' },
        { label: 'CREATE START SCREEN', value: 'OPEN ►', onLeft: () => setScreen('START_SCREEN_CREATOR'), onRight: () => setScreen('START_SCREEN_CREATOR'), onSelect: () => setScreen('START_SCREEN_CREATOR'), note: 'Full dedicated screen: one scene, locked layout slots, creature / background / particles, SAVE AS PRESET + LOAD PRESET + EXPORT JSON. Playback from a saved preset and Phase 2 export are later batches (GAP).' },
        { label: 'NEXT PAGE', value: 'BACKGROUND ►', onLeft: () => setMenuPage(2), onRight: () => setMenuPage(2), onSelect: () => setMenuPage(2) },
      ],
      2: [
        { label: 'SYMBOLS', value: String(preset.symbolCount), onLeft: () => setP({ symbolCount: Math.max(0, preset.symbolCount - 10) }), onRight: () => setP({ symbolCount: Math.min(600, preset.symbolCount + 10) }), note: 'Locked v32: 300 symbols, golden angle 137.508°.' },
        { label: 'PANEL COLOR', value: preset.panelColor, onLeft: () => cyclePresetField('panelColor', PANEL_COLORS, -1), onRight: () => cyclePresetField('panelColor', PANEL_COLORS, 1) },
        { label: 'NEXT PAGE', value: 'ANIMATION ►', onLeft: () => setMenuPage(3), onRight: () => setMenuPage(3), onSelect: () => setMenuPage(3) },
      ],
      3: [
        { label: 'RISE SPEED', value: '5.5 (locked v32)', onLeft: () => undefined, onRight: () => undefined, note: 'Preset value, locked v32 animation: rise 5.5, sway 3, bob 2, seamless loop. Animation of the symbol layer in game is NEED.' },
        { label: 'SINE SWAY / BOB', value: '3 / 2', onLeft: () => undefined, onRight: () => undefined, note: 'FireRed sine method: offset = sine × amplitude on base position. See menu-background-animation-spec.md.' },
        { label: 'NEXT PAGE', value: 'PANELS ►', onLeft: () => setMenuPage(4), onRight: () => setMenuPage(4), onSelect: () => setMenuPage(4) },
      ],
      4: [
        { label: 'PANEL RADIUS', value: String(preset.panelRadius), onLeft: () => setP({ panelRadius: Math.max(0, preset.panelRadius - 2) }), onRight: () => setP({ panelRadius: Math.min(24, preset.panelRadius + 2) }), note: 'Applies to this screen\'s windows live (Y2K rounded panels).' },
        { label: 'WHITE BORDER', value: preset.whiteBorder ? 'ON' : 'OFF', onLeft: () => setP({ whiteBorder: !preset.whiteBorder }), onRight: () => setP({ whiteBorder: !preset.whiteBorder }) },
        { label: 'GLOSS', value: preset.gloss ? 'ON' : 'OFF', onLeft: () => setP({ gloss: !preset.gloss }), onRight: () => setP({ gloss: !preset.gloss }) },
        { label: 'GLOW', value: preset.glow ? 'ON' : 'OFF', onLeft: () => setP({ glow: !preset.glow }), onRight: () => setP({ glow: !preset.glow }) },
        { label: 'GRADIENT', value: preset.gradient ? 'ON' : 'OFF', onLeft: () => setP({ gradient: !preset.gradient }), onRight: () => setP({ gradient: !preset.gradient }) },
        { label: 'SAVE PRESET', value: presetName || 'My Preset 1', onLeft: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), onRight: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), onSelect: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), note: 'Saves as a preset. It does NOT become the default until Mars locks it in.' },
        { label: 'EXPORT PRESET JSON', value: 'DOWNLOAD', onLeft: exportPreset, onRight: exportPreset, onSelect: exportPreset, note: 'Layout-as-data idea (Tuxemon idea, our own JSON, not Tuxemon code).' },
        { label: 'RESET TO LOCKED DEFAULT (v32)', value: 'RESET', onLeft: resetLocked, onRight: resetLocked, onSelect: resetLocked },
        { label: 'BACK TO SETTINGS', value: '◄ BACK', onLeft: () => setScreen('SETTINGS'), onRight: () => setScreen('SETTINGS'), onSelect: () => setScreen('SETTINGS') },
      ],
    };
    return pages[menuPage] || pages[1];
  }, [menuPage, preset, draft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Batch A — UI Creator is now the HUD screen: each row is an
  // independent swappable setting, saved with SAVE + BACK and
  // applied live on return to BattleView / DialogueBox.
  const uiCreatorRows: Row[] = [
    { label: 'MENU UI — FRAME', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Applies to real windows on return, Pokemon FRAME pattern. A per-menu frame override (Panel Frame Editor) wins for that menu.' },
    { label: 'MENU UI — PANEL COLOR', value: preset.panelColor, onLeft: () => cyclePresetField('panelColor', PANEL_COLORS, -1), onRight: () => cyclePresetField('panelColor', PANEL_COLORS, 1), note: 'Preset row. Per-menu colours live in the Panel Frame Editor (Roster pink, Shop yellow, Bag green, Battle red, PC blue, Garden purple by default).' },
    { label: 'HUD — HEALTHBAR STYLE', value: draft.hudHealthbar, onLeft: () => set({ hudHealthbar: cycle(HEALTHBAR_STYLES, draft.hudHealthbar as HealthbarStyle, -1) }), onRight: () => set({ hudHealthbar: cycle(HEALTHBAR_STYLES, draft.hudHealthbar as HealthbarStyle, 1) }), note: 'BattleView HP bars. CLASSIC = pre-existing bar; SEGMENTED = ticked bar; SLIM = thin bar; NUMERIC = also shows enemy HP numbers.' },
    { label: 'HUD — BATTLE HUD LAYOUT', value: draft.hudBattleLayout, onLeft: () => set({ hudBattleLayout: cycle(BATTLE_HUD_LAYOUTS, draft.hudBattleLayout as BattleHudLayout, -1) }), onRight: () => set({ hudBattleLayout: cycle(BATTLE_HUD_LAYOUTS, draft.hudBattleLayout as BattleHudLayout, 1) }), note: 'BattleView healthbox positions. CLASSIC = enemy top-left / player bottom-right (pre-existing); SWAPPED = mirrored; STACKED_TOP = both across the top.' },
    { label: 'HUD — MOVE BUTTON LAYOUT', value: draft.hudMoveLayout, onLeft: () => set({ hudMoveLayout: cycle(MOVE_BUTTON_LAYOUTS, draft.hudMoveLayout as MoveButtonLayout, -1) }), onRight: () => set({ hudMoveLayout: cycle(MOVE_BUTTON_LAYOUTS, draft.hudMoveLayout as MoveButtonLayout, 1) }), note: 'BattleView move buttons. GRID_2X2 = pre-existing 2x2 grid; LIST = one column; ROW_4 = one row (4 across on wide screens).' },
    { label: 'HUD — PP/TYPE DISPLAY', value: draft.hudPpType, onLeft: () => set({ hudPpType: cycle(PP_TYPE_DISPLAYS, draft.hudPpType as PpTypeDisplay, -1) }), onRight: () => set({ hudPpType: cycle(PP_TYPE_DISPLAYS, draft.hudPpType as PpTypeDisplay, 1) }), note: 'BattleView selected-move line + per-button sub-line. FULL = type + PP (pre-existing); PP_ONLY / TYPE_ONLY / HIDDEN.' },
    { label: 'HUD — MESSAGE WINDOW STYLE', value: draft.hudMessageStyle, onLeft: () => set({ hudMessageStyle: cycle(MESSAGE_WINDOW_STYLES, draft.hudMessageStyle as MessageWindowStyle, -1) }), onRight: () => set({ hudMessageStyle: cycle(MESSAGE_WINDOW_STYLES, draft.hudMessageStyle as MessageWindowStyle, 1) }), note: 'DialogueBox + battle message panel. CLASSIC = pre-existing frame; ROUNDED / MINIMAL / GLOSS restyle the box only — position and 2-lines-per-page rules unchanged.' },
    { label: 'HUD — DAMAGE NUMBER STYLE', value: draft.hudDamageStyle, onLeft: () => set({ hudDamageStyle: cycle(DAMAGE_NUMBER_STYLES, draft.hudDamageStyle as DamageNumberStyle, -1) }), onRight: () => set({ hudDamageStyle: cycle(DAMAGE_NUMBER_STYLES, draft.hudDamageStyle as DamageNumberStyle, 1) }), note: 'BattleView floating damage number on impact (new in this batch — damage was HP-bar-only before). PLAIN / BOLD_POP / OUTLINE.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  const layoutRows: Row[] = [
    { label: 'LOGO X', value: String(preset.layout['logoX'] ?? 600), onLeft: () => setP({ layout: { ...preset.layout, logoX: (preset.layout['logoX'] ?? 600) - 10 } }), onRight: () => setP({ layout: { ...preset.layout, logoX: (preset.layout['logoX'] ?? 600) + 10 } }), note: 'Preset only on responsive screens. Locked v32 logo centre is (600, 454) on a 1200x1500 canvas.' },
    { label: 'LOGO Y', value: String(preset.layout['logoY'] ?? 454), onLeft: () => setP({ layout: { ...preset.layout, logoY: (preset.layout['logoY'] ?? 454) - 10 } }), onRight: () => setP({ layout: { ...preset.layout, logoY: (preset.layout['logoY'] ?? 454) + 10 } }) },
    { label: 'LOGO WIDTH', value: String(preset.layout['logoW'] ?? 900), onLeft: () => setP({ layout: { ...preset.layout, logoW: Math.max(100, (preset.layout['logoW'] ?? 900) - 50) } }), onRight: () => setP({ layout: { ...preset.layout, logoW: Math.min(1200, (preset.layout['logoW'] ?? 900) + 50) } }) },
    { label: 'DIALOGUE X / Y / W / H', value: '2 / 19 / 27 / 4 (HeartGold)', onLeft: () => undefined, onRight: () => undefined, note: 'Pokemon dialogue window fields, stored as the reference layout. Web dialogue is bottom full-width within safe margins.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  const cursorRows: Row[] = [
    { label: 'CURSOR SHAPE', value: `${CURSOR_SHAPES.find(c => c.id === draft.cursorShape)?.glyph || '►'} ${CURSOR_SHAPES.find(c => c.id === draft.cursorShape)?.label || 'Arrow'}`, onLeft: () => set({ cursorShape: cycle(CURSOR_SHAPES.map(c => c.id), draft.cursorShape, -1) }), onRight: () => set({ cursorShape: cycle(CURSOR_SHAPES.map(c => c.id), draft.cursorShape, 1) }), note: 'Pokemon base is the selector arrow (menu.c / list_menu.c, cursorPal + cursorShadowPal). Diamond/Star/Ring are Mochiichao extensions. Icon shapes: game-icons.net, CC BY 3.0, attribution — game-icons SVG files themselves are NOT shipped in this PR (NEED), current shapes are glyphs.' },
    { label: 'CURSOR COLOR', value: draft.cursorColor, onLeft: () => set({ cursorColor: cycle(CURSOR_COLORS, draft.cursorColor, -1) }), onRight: () => set({ cursorColor: cycle(CURSOR_COLORS, draft.cursorColor, 1) }), note: 'Applies to the selected-row marker in this screen and the main menu.' },
    { label: 'CURSOR SHADOW', value: draft.cursorShadow ? 'ON' : 'OFF', onLeft: () => set({ cursorShadow: !draft.cursorShadow }), onRight: () => set({ cursorShadow: !draft.cursorShadow }), note: 'Batch A: text shadow under the cursor glyph (Pokemon cursorShadowPal slot, Mochiichao CSS).' },
    { label: 'CURSOR GLOW', value: draft.cursorGlow ? 'ON' : 'OFF', onLeft: () => set({ cursorGlow: !draft.cursorGlow }), onRight: () => set({ cursorGlow: !draft.cursorGlow }), note: 'Glow halo on the cursor glyph (pre-existing setting; now also drives the glyph drop-shadow, not just a stored flag).' },
    { label: 'CURSOR SIZE', value: preset.cursorSize, onLeft: () => cyclePresetField('cursorSize', ['S', 'M', 'L'], -1), onRight: () => cyclePresetField('cursorSize', ['S', 'M', 'L'], 1), note: 'Batch A: now sizes the cursor glyph on this screen (S 12px / M 16px / L 20px). Main-menu glyph sizing is a later main-menu batch — layout untouched here.' },
    { label: 'CURSOR BLINK', value: draft.cursorBlink ? 'ON' : 'OFF', onLeft: () => set({ cursorBlink: !draft.cursorBlink }), onRight: () => set({ cursorBlink: !draft.cursorBlink }), note: 'Batch A: selected-row cursor glyph pulses (animate-pulse) instead of sitting static.' },
    { label: 'CURSOR BLINK SPEED', value: draft.cursorBlinkSpeed, onLeft: () => set({ cursorBlinkSpeed: cycle(CURSOR_BLINK_SPEEDS, draft.cursorBlinkSpeed as CursorBlinkSpeed, -1) }), onRight: () => set({ cursorBlinkSpeed: cycle(CURSOR_BLINK_SPEEDS, draft.cursorBlinkSpeed as CursorBlinkSpeed, 1) }), note: 'Batch A: blink pulse duration. SLOW 1.2s / MID 0.7s / FAST 0.35s. Only applies while CURSOR BLINK is ON.' },
    { label: 'HIGHLIGHT ROW COLOUR', value: draft.cursorHighlight, onLeft: () => set({ cursorHighlight: cycle(CURSOR_COLORS, draft.cursorHighlight, -1) }), onRight: () => set({ cursorHighlight: cycle(CURSOR_COLORS, draft.cursorHighlight, 1) }), note: 'Batch A: outline colour of the selected row on this screen (was fixed yellow ring before).' },
    { label: 'SOUND ON MOVE', value: draft.cursorSound ? 'ON' : 'OFF', onLeft: () => set({ cursorSound: !draft.cursorSound }), onRight: () => set({ cursorSound: !draft.cursorSound }), note: 'Batch A, flag only: stored + preset-saved, but NEED — no audio engine in this build yet to play a move sound through (same precedent as the SOUND flag). Not faked with a browser beep.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  const panelRows: Row[] = [
    { label: 'FRAME TYPE', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Kenney CC0-style rounded/square panel shapes as options (existing in-repo panel SVGs: panel-main, panel-small, panel-title). No Kenney file is copied in here.' },
    { label: 'FRAME PALETTE', value: preset.panelColor, onLeft: () => cyclePresetField('panelColor', PANEL_COLORS, -1), onRight: () => cyclePresetField('panelColor', PANEL_COLORS, 1) },
    { label: 'ROUNDED RADIUS', value: String(preset.panelRadius), onLeft: () => setP({ panelRadius: Math.max(0, preset.panelRadius - 2) }), onRight: () => setP({ panelRadius: Math.min(24, preset.panelRadius + 2) }), note: 'Applies to this screen\'s windows live.' },
    { label: 'BORDER WIDTH', value: String(preset.panelBorderWidth), onLeft: () => setP({ panelBorderWidth: Math.max(1, preset.panelBorderWidth - 1) }), onRight: () => setP({ panelBorderWidth: Math.min(4, preset.panelBorderWidth + 1) }) },
    { label: 'WHITE BORDER', value: preset.whiteBorder ? 'ON' : 'OFF', onLeft: () => setP({ whiteBorder: !preset.whiteBorder }), onRight: () => setP({ whiteBorder: !preset.whiteBorder }) },
    { label: 'GLOSS', value: preset.gloss ? 'ON' : 'OFF', onLeft: () => setP({ gloss: !preset.gloss }), onRight: () => setP({ gloss: !preset.gloss }), note: 'Batch A: gloss now renders as a top highlight on this screen\'s windows, not just a stored flag.' },
    { label: 'GLOW', value: preset.glow ? 'ON' : 'OFF', onLeft: () => setP({ glow: !preset.glow }), onRight: () => setP({ glow: !preset.glow }) },
    { label: 'GRADIENT', value: preset.gradient ? 'ON' : 'OFF', onLeft: () => setP({ gradient: !preset.gradient }), onRight: () => setP({ gradient: !preset.gradient }), note: 'Batch A: gradient now renders as a vertical panel gradient on this screen\'s windows.' },
    { label: 'SHADOW', value: draft.panelShadow ? 'ON' : 'OFF', onLeft: () => set({ panelShadow: !draft.panelShadow }), onRight: () => set({ panelShadow: !draft.panelShadow }), note: 'Batch A: independent drop shadow on this screen\'s windows, separate from GLOW (glow = accent halo, shadow = dark drop). Battle healthboxes + dialogue box also pick it up.' },
    { label: 'OPACITY', value: `${draft.panelOpacity}%`, onLeft: () => set({ panelOpacity: Math.max(70, draft.panelOpacity - 5) }), onRight: () => set({ panelOpacity: Math.min(100, draft.panelOpacity + 5) }), note: 'Batch A: panel opacity 70–100% in 5% steps, applied to this screen\'s windows, the dialogue box, and the battle message panel.' },
    { label: 'PER-MENU TARGET', value: perMenuTarget, onLeft: () => setPerMenuTarget(cycle(MENU_KEYS, perMenuTarget, -1)), onRight: () => setPerMenuTarget(cycle(MENU_KEYS, perMenuTarget, 1)), note: 'Batch A: which menu the next two rows edit. Selector only — not saved itself.' },
    { label: 'PER-MENU PANEL COLOUR', value: draft.perMenuPanelColor?.[perMenuTarget] || 'blue', onLeft: () => set({ perMenuPanelColor: { ...draft.perMenuPanelColor, [perMenuTarget]: cycle(PANEL_COLORS, draft.perMenuPanelColor?.[perMenuTarget] || 'blue', -1) } }), onRight: () => set({ perMenuPanelColor: { ...draft.perMenuPanelColor, [perMenuTarget]: cycle(PANEL_COLORS, draft.perMenuPanelColor?.[perMenuTarget] || 'blue', 1) } }), note: 'Batch A: accent colour for the target menu. Applied today to SETTINGS (this screen) and BATTLE (healthbox/message borders); other menus store the value for their per-menu skin batch — not silently applied to menus this batch does not touch.' },
    { label: 'PER-MENU FRAME', value: (draft.perMenuFrame?.[perMenuTarget] || 0) === 0 ? 'FOLLOW GLOBAL' : frameName(draft.perMenuFrame[perMenuTarget]), onLeft: () => set({ perMenuFrame: { ...draft.perMenuFrame, [perMenuTarget]: ((draft.perMenuFrame?.[perMenuTarget] || 0) - 1 + 21) % 21 } }), onRight: () => set({ perMenuFrame: { ...draft.perMenuFrame, [perMenuTarget]: ((draft.perMenuFrame?.[perMenuTarget] || 0) + 1) % 21 } }), note: 'Batch A: frame override for the target menu, 0 = FOLLOW GLOBAL (global FRAME row), else Frame 1–20. Applied today to SETTINGS; BATTLE healthboxes use the BATTLE accent colour, frame accent via the global row.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  // Batch B — Menu Customisation rows (Settings > Menu Creator >
  // Menu Customisation). Independent rows, draft until SAVE + BACK,
  // like every other row on this screen. Full wiring map (WIRED /
  // PREVIEW / GAP) is in src/lib/menuCustom.ts; the notes below
  // repeat the GAP labels so no row is ever mistaken for finished
  // work it does not do. The 6 font rows below are NOT rewritten
  // here (font batch owns them).
  const now = new Date();
  const gamePeriod = getGameTimeOfDay(now);
  const gameVisual = visualStateOf(gamePeriod);
  const blend = dayNightBlend(now.getHours(), now.getMinutes());
  const spriteScale = spriteDisplayScale(custom.spriteProportion);
  const loadTheme = (dir: 1 | -1) => {
    if (presets.length === 0) return;
    const i = presets.findIndex(p => p.name === preset.name);
    const next = presets[(i < 0 ? 0 : i + dir + presets.length) % presets.length];
    setPreset(next);
    setDraft({ ...next.settings });
    if (next.custom) setCustom({ ...DEFAULT_MENU_CUSTOM, ...next.custom, layout: { ...DEFAULT_MENU_CUSTOM.layout, ...next.custom.layout }, backgroundPainted: false });
    setSavedMsg(`Theme loaded (draft): ${next.name}. SAVE + BACK to persist.`);
  };
  const clampStep = (v: number, min: number, max: number, step: number, dir: 1 | -1) =>
    Math.min(max, Math.max(min, Math.round((v + dir * step) * 100) / 100));
  const customRows: Row[] = [
    // Layout — via the existing Layout Editor path (preset.layout
    // record, mirrored on save). Applied to this Settings screen's
    // own container (width / gap / anchor); application to other
    // menus is NEED, labelled — they do not read layout-as-data yet.
    { label: 'MENU X', value: String(custom.layout.x), onLeft: () => setLayout({ x: custom.layout.x - 10 }), onRight: () => setLayout({ x: custom.layout.x + 10 }), note: 'Layout Editor path: stored in preset.layout.menuX + preset.custom.layout.x. Shifts this screen\'s container; other menus: NEED.' },
    { label: 'MENU Y', value: String(custom.layout.y), onLeft: () => setLayout({ y: custom.layout.y - 10 }), onRight: () => setLayout({ y: custom.layout.y + 10 }), note: 'Layout Editor path: preset.layout.menuY. Vertical offset for this screen; other menus: NEED.' },
    { label: 'MENU W', value: String(custom.layout.w), onLeft: () => setLayout({ w: Math.max(100, custom.layout.w - 50) }), onRight: () => setLayout({ w: Math.min(1200, custom.layout.w + 50) }), note: 'Panel width (px). Applies to this screen\'s container max-width on return. Locked v32 canvas width is 900 (spec, not a web pixel).' },
    { label: 'MENU H', value: custom.layout.h === 0 ? 'AUTO' : String(custom.layout.h), onLeft: () => setLayout({ h: Math.max(0, custom.layout.h - 50) }), onRight: () => setLayout({ h: Math.min(800, custom.layout.h + 50) }), note: 'Panel height (px); 0 = AUTO (content height). Stored; fixed-height application to other menus is NEED.' },
    { label: 'MENU SPACING', value: String(custom.layout.spacing), onLeft: () => setLayout({ spacing: Math.max(0, custom.layout.spacing - 2) }), onRight: () => setLayout({ spacing: Math.min(32, custom.layout.spacing + 2) }), note: 'Gap (px) between panels on this screen. Applies to this screen\'s container gap on return.' },
    { label: 'MENU ORDER', value: custom.layout.order, onLeft: () => setLayout({ order: cycle(MENU_ORDERS, custom.layout.order, -1) }), onRight: () => setLayout({ order: cycle(MENU_ORDERS, custom.layout.order, 1) }), note: 'Row order for menus. Stored + exported; real reordering of other menus is NEED — preview strip below shows the chosen order label only.' },
    { label: 'MENU ANCHOR', value: custom.layout.anchor, onLeft: () => setLayout({ anchor: cycle(MENU_ANCHORS, custom.layout.anchor, -1) }), onRight: () => setLayout({ anchor: cycle(MENU_ANCHORS, custom.layout.anchor, 1) }), note: 'Vertical anchor for this screen: TOP / CENTER / BOTTOM. Applies to this screen\'s container on return.' },
    // Animation — style / speed / sway. Preview strip below shows
    // the chosen style at the chosen speed; title / main-menu
    // symbol-layer animation in game is NEED (existing page-3 note).
    { label: 'ANIMATION STYLE', value: custom.animationStyle, onLeft: () => setC({ animationStyle: cycle(ANIMATION_STYLES, custom.animationStyle, -1) }), onRight: () => setC({ animationStyle: cycle(ANIMATION_STYLES, custom.animationStyle, 1) }), note: 'SINE = sine offset x amplitude (FireRed Sin method); FLOW = flowing symbol motion; RISE_FADE = rise + fade (locked v32 motion). Preview strip below uses real Motion-frame motion; in-game menu animation: NEED.' },
    { label: 'ANIMATION SPEED', value: `${custom.animationSpeed.toFixed(2)}x`, onLeft: () => setC({ animationSpeed: clampStep(custom.animationSpeed, 0.5, 2, 0.25, -1) }), onRight: () => setC({ animationSpeed: clampStep(custom.animationSpeed, 0.5, 2, 0.25, 1) }), note: 'Global animation speed multiplier (also the gameplay-adjacent animation-speed row — one row, counted once). Sets --menu-anim-speed; preview strip duration follows it.' },
    { label: 'SWAY', value: String(custom.sway), onLeft: () => setC({ sway: Math.max(0, custom.sway - 1) }), onRight: () => setC({ sway: Math.min(8, custom.sway + 1) }), note: 'Sine sway amplitude (px, locked v32 = 3). Drives the preview strip SINE/FLOW motion live; full sine motion on real menus: NEED.' },
    // Background — biome / painted GAP / symbol layer / fade.
    { label: 'BACKGROUND BIOME', value: custom.backgroundBiome, onLeft: () => setC({ backgroundBiome: cycle(BACKGROUND_BIOMES, custom.backgroundBiome, -1) }), onRight: () => setC({ backgroundBiome: cycle(BACKGROUND_BIOMES, custom.backgroundBiome, 1) }), note: 'AUTO follows game time (NITE -> night, MORN/DAY -> grass, EVE -> forest). Applies as this screen\'s background gradient on return. Biomes are the existing 8 title biomes (generic terrain only).' },
    { label: 'PAINTED BACKGROUND', value: 'NEED — menu wiring', onLeft: () => undefined, onRight: () => undefined, note: 'GAP for menus, labelled: painted title backgrounds now exist for 8/8 biomes (Title Backgrounds lane, complete) but they are NOT wired as menu backgrounds yet, so this row changes nothing. Do not claim painted menu backgrounds until that wiring lands.' },
    { label: 'SYMBOL LAYER', value: custom.symbolLayer ? 'ON' : 'OFF', onLeft: () => setC({ symbolLayer: !custom.symbolLayer }), onRight: () => setC({ symbolLayer: !custom.symbolLayer }), note: 'Hearts / stars / sparkle layer over the background. Shown on this screen when ON (symbol strip below the header).' },
    { label: 'BACKGROUND FADE', value: `${custom.backgroundFade}%`, onLeft: () => setC({ backgroundFade: Math.max(0, custom.backgroundFade - 10) }), onRight: () => setC({ backgroundFade: Math.min(100, custom.backgroundFade + 10) }), note: 'Background-layer opacity %. Applies to this screen\'s background + symbol strip on return.' },
    // Day / night — HeartGold gf_rtc structure, GAME (device) time.
    { label: 'DAY/NIGHT MODE', value: custom.dayNightMode, onLeft: () => setC({ dayNightMode: cycle(DAY_NIGHT_MODES, custom.dayNightMode, -1) }), onRight: () => setC({ dayNightMode: cycle(DAY_NIGHT_MODES, custom.dayNightMode, 1) }), note: 'AUTO = game time colourway; CUSTOM = fixed period below; OFF = plain DAY palette. Applies as this screen\'s sky tint on return.' },
    { label: 'DAY/NIGHT PERIOD', value: custom.dayNightCustom, onLeft: () => setC({ dayNightCustom: cycle(DAY_NIGHT_VISUALS, custom.dayNightCustom, -1) }), onRight: () => setC({ dayNightCustom: cycle(DAY_NIGHT_VISUALS, custom.dayNightCustom, 1) }), note: 'Custom period used only when MODE = CUSTOM. Visual states MORN / DAY / EVE / NITE; LATE (0-3) renders as NITE, as in HeartGold\'s wild-param mapping.' },
    { label: 'GRADUAL TRANSITION', value: custom.dayNightTransition ? 'ON' : 'OFF', onLeft: () => setC({ dayNightTransition: !custom.dayNightTransition }), onRight: () => setC({ dayNightTransition: !custom.dayNightTransition }), note: 'ON = palette blends toward the next period across its last hour (e.g. 09:00-09:59 MORN -> DAY, by minute/60). OFF = hard cut at the boundary hour.' },
    { label: 'DAY/NIGHT TINT', value: `${custom.dayNightTint}%`, onLeft: () => setC({ dayNightTint: Math.max(0, custom.dayNightTint - 10) }), onRight: () => setC({ dayNightTint: Math.min(100, custom.dayNightTint + 10) }), note: 'Player customisation: strength of the day/night tint over this screen. 0% = tint off, 100% = full colourway tint.' },
    { label: 'GAME TIME NOW', value: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} — ${gamePeriod} (${gameVisual})${custom.dayNightTransition && blend.t > 0 ? ` -> ${blend.next} ${Math.round(blend.t * 100)}%` : ''}`, onLeft: () => undefined, onRight: () => undefined, note: 'Read-only: GAME time is the device clock (no simulated in-game clock exists yet — NEED). Hours: LATE 0-3, MORN 4-9, DAY 10-17, EVE 18-20, NITE 21-23 (HeartGold gf_rtc). Visible in Settings; tint while pausing/playing is NEED — PauseMenu has no Settings entry yet.' },
    // Themes — save / load / export JSON / reset. Never overwrites v32.
    { label: 'SAVE THEME', value: presetName || 'My Preset 1', onLeft: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), onRight: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), onSelect: () => saveAll(draft, { ...preset, name: presetName || 'My Preset 1', settings: draft, savedAt: Date.now() }), note: 'Saves this custom block + settings as a named theme preset. It does NOT become the default until Mars locks it in.' },
    { label: 'LOAD THEME', value: preset.name, onLeft: () => loadTheme(-1), onRight: () => loadTheme(1), onSelect: () => loadTheme(1), note: 'Cycles saved theme presets into the draft (settings + custom). SAVE + BACK persists the loaded theme.' },
    { label: 'EXPORT THEME JSON', value: 'DOWNLOAD', onLeft: exportPreset, onRight: exportPreset, onSelect: exportPreset, note: 'Downloads the current preset (settings + custom block + layout record) as JSON. Layout-as-data, our own JSON.' },
    { label: 'RESET TO LOCKED DEFAULT (v32)', value: 'RESET', onLeft: resetLocked, onRight: resetLocked, onSelect: resetLocked, note: 'Restores DEFAULT_SETTINGS + LOCKED_PRESET (v32) + these custom defaults. This is the only row that restores the locked default.' },
    // Sprite Proportions — chibi wired, Tall falls back, never blank.
    { label: 'SPRITE PROPORTIONS', value: custom.spriteProportion === 'TALL' ? 'TALL (falls back to Chibi)' : 'CHIBI (default)', onLeft: () => setC({ spriteProportion: cycle(SPRITE_PROPORTIONS, custom.spriteProportion, -1) }), onRight: () => setC({ spriteProportion: cycle(SPRITE_PROPORTIONS, custom.spriteProportion, 1) }), note: spriteScale.fallback ? 'TALL selected: display falls back to the chibi scale/art — NEVER blank, NEVER a missing sprite. Real tall rendering is NEED, not claimed.' : 'CHIBI (default): the only rendered sprite path in this build. TALL falls back to this path, never blank.' },
    // Text extras — the 6 font rows themselves are the font batch's.
    { label: 'TEXT SIZE', value: `${custom.textSize} (${TEXT_SIZE_PX[custom.textSize]}px)`, onLeft: () => setC({ textSize: cycle(TEXT_SIZES, custom.textSize, -1) }), onRight: () => setC({ textSize: cycle(TEXT_SIZES, custom.textSize, 1) }), note: 'Menu/dialogue text size. Applies to DialogueBox text + this screen\'s row labels via --menu-text-size on return.' },
    { label: 'LINE SPACING', value: custom.lineSpacing.toFixed(1), onLeft: () => setC({ lineSpacing: clampStep(custom.lineSpacing, 1, 2, 0.1, -1) }), onRight: () => setC({ lineSpacing: clampStep(custom.lineSpacing, 1, 2, 0.1, 1) }), note: 'Line-height multiplier for menu/dialogue text. Applies via --menu-line-height on return.' },
    { label: 'TEXT COLOUR', value: custom.textColor, onLeft: () => setC({ textColor: cycle(TEXT_COLORS_CUSTOM, custom.textColor, -1) }), onRight: () => setC({ textColor: cycle(TEXT_COLORS_CUSTOM, custom.textColor, 1) }), note: 'Menu/dialogue text colour. Applies to DialogueBox text + this screen\'s row labels via --menu-text-color on return.' },
    { label: 'TEXT SHADOW', value: custom.textShadow ? 'ON' : 'OFF', onLeft: () => setC({ textShadow: !custom.textShadow }), onRight: () => setC({ textShadow: !custom.textShadow }), note: 'Text shadow on menu/dialogue text. Applies via --menu-text-shadow on return.' },
    { label: 'DIALOGUE BOX STYLE', value: custom.dialogueBoxStyle, onLeft: () => setC({ dialogueBoxStyle: cycle(DIALOGUE_BOX_STYLES, custom.dialogueBoxStyle, -1) }), onRight: () => setC({ dialogueBoxStyle: cycle(DIALOGUE_BOX_STYLES, custom.dialogueBoxStyle, 1) }), note: 'Dialogue box corner style: ROUNDED 14 / SQUARE 2 / GLOSS 18 / MINIMAL 8 (px radius). Applies to DialogueBox via --menu-dialogue-radius on return.' },
    // Gameplay-adjacent.
    { label: 'CAMERA SHAKE', value: custom.cameraShake ? 'ON' : 'OFF', onLeft: () => setC({ cameraShake: !custom.cameraShake }), onRight: () => setC({ cameraShake: !custom.cameraShake }), note: 'Stored + exported. Camera-shake application in battle/world cameras is NEED — no camera in this build reads the flag yet, so this row claims storage only.' },
    { label: 'REDUCED MOTION', value: custom.reducedMotion ? 'ON' : 'OFF', onLeft: () => setC({ reducedMotion: !custom.reducedMotion }), onRight: () => setC({ reducedMotion: !custom.reducedMotion }), note: 'ON holds the preview strip static and sets --menu-reduced-motion=none on return; the strip is also static when the OS prefers-reduced-motion. Full motion suppression across battle/world animation is NEED.' },
    { label: 'TOUCH SIZE', value: `${custom.touchSize}px`, onLeft: () => setC({ touchSize: cycle([44, 48, 56], custom.touchSize, -1) }), onRight: () => setC({ touchSize: cycle([44, 48, 56], custom.touchSize, 1) }), note: 'Touch target height for rows. Default 48px (existing row height). Applies to this screen\'s row buttons immediately in this screen.' },
    { label: 'SAFE AREA', value: custom.safeArea ? 'ON' : 'OFF', onLeft: () => setC({ safeArea: !custom.safeArea }), onRight: () => setC({ safeArea: !custom.safeArea }), note: 'ON = screen padding honours env(safe-area-inset-*) (phone notch/home bar); OFF = fixed padding. Applies to this screen\'s outer padding on return.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  // Font Settings — Mars font CORRECTION (2026-10-25 18:30 CDT,
  // overrides the 2-row version) + Mars readability order
  // (2026-10-26): six rows, each cycles the full FONT_OPTIONS
  // list independently — both groups on every row: Pokemon Base
  // group (Pokemon Base + Pokemon slots) AND Mars's chosen fonts
  // (Yagiza / 01 Digitall / Y2K Google fonts). Applies live on
  // return, CANCEL saves + exits.
  // RESET FONTS restores, in row order:
  // MAIN=Yagiza / MENU=Pokemon Base / DIALOGUE=Pokemon Base /
  // SMALL=01 Digitall / BOLD=Yagiza / BATTLE=01 Digitall.
  // POKEMON BASE DEFAULT sets MENU + DIALOGUE to Pokemon Base
  // in one tap (other rows untouched).
  // ORIGINAL DEFAULTS applies the open-fonts preset (Bungee /
  // Titan One / Fredoka style). DIAMOND VERSION subtitle font is
  // PINNED — no row here touches it (see fonts.ts
  // PINNED_SUBTITLE_FONT, applied in IntroSequence).
  // Future custom logo font is NOT built here, not claimed.
  const cycleFont = (cur: string, dir: 1 | -1): string => {
    const i = FONT_OPTIONS.findIndex(f => f.id === cur);
    return FONT_OPTIONS[(i + dir + FONT_OPTIONS.length) % FONT_OPTIONS.length].id;
  };
  const resetFonts = () => { set({ mainFont: 'yagiza', menuFont: 'pokemon-base', dialogueFont: 'pokemon-base', smallFont: '01-digitall', boldFont: 'yagiza', battleFont: '01-digitall' }); setSavedMsg('Fonts reset: MAIN=Yagiza, MENU=Pokemon Base, DIALOGUE=Pokemon Base, SMALL=01 Digitall, BOLD=Yagiza, BATTLE=01 Digitall.'); };
  const pokemonBaseDefault = () => { set({ menuFont: 'pokemon-base', dialogueFont: 'pokemon-base' }); setSavedMsg('Pokemon Base applied: MENU=Pokemon Base, DIALOGUE=Pokemon Base. Other rows untouched. Save with CANCEL / SAVE + BACK to persist.'); };
  const originalDefaults = () => { set({ mainFont: 'bungee', menuFont: 'titan-one', dialogueFont: 'fredoka', smallFont: 'fredoka', boldFont: 'bungee', battleFont: 'fredoka' }); setSavedMsg('Original Defaults preset applied: MAIN=Bungee, MENU=Titan One, DIALOGUE=Fredoka, SMALL=Fredoka, BOLD=Bungee, BATTLE=Fredoka (open fonts only).'); };
  const fontRows: Row[] = [
    { label: 'MAIN FONT', value: mainFontOpt.label, onLeft: () => set({ mainFont: cycleFont(draft.mainFont, -1) }), onRight: () => set({ mainFont: cycleFont(draft.mainFont, 1) }), note: 'MAIN FONT (true starting default Yagiza) = titles, menus, headings, UI labels — via --game-font (body). ' + mainFontOpt.note },
    { label: 'MENU FONT', value: menuFontOpt.label, onLeft: () => set({ menuFont: cycleFont(draft.menuFont, -1) }), onRight: () => set({ menuFont: cycleFont(draft.menuFont, 1) }), note: 'MENU FONT (readable default Pokemon Base, Mars 2026-10-26) = menu selection row text ONLY — main-menu CONTINUE / NEW GAME / SETTINGS rows and Settings rows follow this. Main menu layout/logo/cloud/panels/colours are otherwise UNCHANGED (locked v32). ' + menuFontOpt.note },
    { label: 'DIALOGUE FONT', value: dialogueFontOpt.label, onLeft: () => set({ dialogueFont: cycleFont(draft.dialogueFont, -1) }), onRight: () => set({ dialogueFont: cycleFont(draft.dialogueFont, 1) }), note: 'DIALOGUE FONT (readable default Pokemon Base, Mars 2026-10-26) = dialogue boxes, NPC talk, body text — via --dialogue-font in DialogueBox. ' + dialogueFontOpt.note },
    { label: 'SMALL FONT', value: smallFontOpt.label, onLeft: () => set({ smallFont: cycleFont(draft.smallFont, -1) }), onRight: () => set({ smallFont: cycleFont(draft.smallFont, 1) }), note: 'SMALL FONT (starting 01 Digitall, Pokemon FONT_SMALL slot) = small labels and notes — speaker names, Settings notes/help. ' + smallFontOpt.note },
    { label: 'BOLD FONT', value: boldFontOpt.label, onLeft: () => set({ boldFont: cycleFont(draft.boldFont, -1) }), onRight: () => set({ boldFont: cycleFont(draft.boldFont, 1) }), note: 'BOLD FONT (starting Yagiza, FONT_BOLD slot) = bold headings and action buttons — Settings header, title logo, SAVE + BACK. ' + boldFontOpt.note },
    { label: 'BATTLE FONT', value: battleFontOpt.label, onLeft: () => set({ battleFont: cycleFont(draft.battleFont, -1) }), onRight: () => set({ battleFont: cycleFont(draft.battleFont, 1) }), note: 'BATTLE FONT (starting 01 Digitall) = battle log and HUD — BattleView message/log, healthboxes, move buttons. ' + battleFontOpt.note },
    { label: 'POKEMON BASE DEFAULT', value: 'APPLY ►', onLeft: pokemonBaseDefault, onRight: pokemonBaseDefault, onSelect: pokemonBaseDefault, note: 'One tap: MENU=Pokemon Base, DIALOGUE=Pokemon Base (readable defaults). Other rows untouched. Save with CANCEL / SAVE + BACK to persist. This is also what RESET FONTS restores for those two rows.' },
    { label: 'RESET FONTS', value: 'Yagiza / Pokemon Base', onLeft: resetFonts, onRight: resetFonts, onSelect: resetFonts, note: 'Restores, in row order: MAIN=Yagiza, MENU=Pokemon Base, DIALOGUE=Pokemon Base, SMALL=01 Digitall, BOLD=Yagiza, BATTLE=01 Digitall. Save with CANCEL / SAVE + BACK to persist.' },
    { label: 'ORIGINAL DEFAULTS', value: 'Bungee / Titan One / Fredoka', onLeft: originalDefaults, onRight: originalDefaults, onSelect: originalDefaults, note: 'Separate preset using non-proprietary open fonts (Bungee / Titan One / Fredoka style). Never a Pokemon font file. Save with CANCEL / SAVE + BACK to persist.' },
    { label: 'BACK', value: '◄ BACK', onLeft: () => setScreen(fontReturn), onRight: () => setScreen(fontReturn), onSelect: () => setScreen(fontReturn), note: 'Returns to ' + (fontReturn === 'MENU_CREATOR' ? 'Menu Creator' : 'Settings') + '. Use SAVE + BACK below to persist font changes.' },
  ];

  const rows = screen === 'SETTINGS' ? settingsRows
    : screen === 'MENU_CREATOR' ? menuCreatorRows
    : screen === 'MENU_CUSTOM' ? customRows
    : screen === 'UI_CREATOR' ? uiCreatorRows
    : screen === 'LAYOUT_EDITOR' ? layoutRows
    : screen === 'CURSOR_CREATOR' ? cursorRows
    : screen === 'FONT_SETTINGS' ? fontRows
    : panelRows;

  const title = screen === 'SETTINGS' ? 'SETTINGS'
    : screen === 'MENU_CREATOR' ? `MENU CREATOR — Page ${menuPage}`
    : screen === 'MENU_CUSTOM' ? 'MENU CUSTOMISATION — BATCH B'
    : screen === 'UI_CREATOR' ? 'UI CREATOR'
    : screen === 'LAYOUT_EDITOR' ? 'LAYOUT EDITOR'
    : screen === 'CURSOR_CREATOR' ? 'CURSOR CREATOR'
    : screen === 'FONT_SETTINGS' ? 'FONT SETTINGS'
    : 'PANEL FRAME EDITOR';

  const safeCursor = Math.min(cursor, rows.length - 1);

  useEffect(() => { setCursor(0); }, [screen, menuPage]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen === 'INTRO_VIDEO_CREATOR' || screen === 'START_SCREEN_CREATOR' || screen === 'MUSIC_MIXER' || screen === 'MENU_EDITOR') return; // creator screens own their keys (any-key-skips + B: BACK); the mixer owns its own keys (Esc / B: BACK)
      if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => (c - 1 + rows.length) % rows.length); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => (c + 1) % rows.length); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); rows[safeCursor]?.onLeft(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); rows[safeCursor]?.onRight(); }
      else if (isConfirmKey(e, draft.buttonMode)) { e.preventDefault(); const r = rows[safeCursor]; if (r?.onSelect) r.onSelect(); else r?.onRight(); }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (screen === 'SETTINGS') saveAndBack();
        else if (screen === 'MENU_CREATOR') setScreen('SETTINGS');
        else if (screen === 'FONT_SETTINGS') setScreen(fontReturn);
        else setScreen('MENU_CREATOR');
      } else if (shoulderKey(e, draft.buttonMode)) {
        // LR shoulders (Q = L, E = R): Menu Creator pages flip,
        // other rows cycle their value — the FR list-menu page
        // keys, via buttonMode.ts. Typing targets are exempt
        // inside shoulderKey(), so preset-name typing is safe.
        e.preventDefault();
        const shoulder = shoulderKey(e, draft.buttonMode);
        if (screen === 'MENU_CREATOR') setMenuPage(p => shoulder === 'L' ? (p <= 1 ? 4 : p - 1) : (p >= 4 ? 1 : p + 1));
        else if (shoulder === 'L') rows[safeCursor]?.onLeft();
        else rows[safeCursor]?.onRight();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, safeCursor, screen, draft, preset]);

  // Batch A: panel style now actually renders gloss / gradient /
  // shadow / opacity instead of storing them only. Glow = accent
  // halo, shadow = independent dark drop (both can stack).
  const panelStyle: React.CSSProperties = {
    borderRadius: preset.panelRadius,
    borderWidth: preset.panelBorderWidth,
    borderColor: preset.whiteBorder ? '#ffffff' : accent,
    opacity: Math.min(100, Math.max(70, draft.panelOpacity || 100)) / 100,
    background: preset.gradient
      ? 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(22,35,58,0.92) 45%)'
      : preset.gloss
        ? 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(22,35,58,0.92) 30%)'
        : undefined,
    boxShadow: [
      preset.glow ? `0 0 0 2px ${accent}55` : '',
      preset.gloss ? 'inset 0 1px 0 rgba(255,255,255,0.35)' : '',
      draft.panelShadow ? '0 10px 30px rgba(0,0,0,0.65)' : '0 6px 24px rgba(0,0,0,0.45)',
    ].filter(Boolean).join(', '),
  };
  const cursorGlyph = CURSOR_SHAPES.find(c => c.id === draft.cursorShape)?.glyph || '►';
  // Batch B render application (Settings screen only): day/night
  // palette + background biome gradient + fade, layout width/gap/
  // anchor, text extras on row labels, touch height on rows.
  const renderPalette = resolveDayNightPalette(custom.dayNightMode, custom.dayNightCustom, custom.dayNightTransition);
  const renderBiome = resolveBackgroundBiome(custom.backgroundBiome);
  const renderBackground = renderBiome
    ? biomeBackgroundCss(renderBiome, custom.backgroundFade)
    : `linear-gradient(180deg, ${renderPalette.skyTop} 0%, ${renderPalette.skyBottom} 100%)`;
  const anchorJustify = custom.layout.anchor === 'TOP' ? 'flex-start' : custom.layout.anchor === 'BOTTOM' ? 'flex-end' : 'center';

  if (screen === 'INTRO_VIDEO_CREATOR') {
    return <IntroVideoCreatorScreen onBack={() => setScreen('MENU_CREATOR')} />;
  }
  if (screen === 'MENU_EDITOR') {
    return <MenuEditorScreen onBack={() => setScreen('MENU_CREATOR')} onViewTitle={onViewTitle} />;
  }

  // CREATE START SCREEN is its own full dedicated screen (batch E).
  // B: BACK inside it returns to MENU_CREATOR via onBack.
  if (screen === 'START_SCREEN_CREATOR') {
    return <StartScreenCreator onBack={() => setScreen('MENU_CREATOR')} />;
  }

  // MUSIC MIXER is its own full dedicated screen under Settings (Mars
  // 2026-10-26). B: BACK inside it returns to SETTINGS via onBack.
  if (screen === 'MUSIC_MIXER') {
    return <MusicMixerScreen onBack={() => setScreen('SETTINGS')} />;
  }

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center relative overflow-hidden p-4" style={{ background: renderBackground, justifyContent: anchorJustify, paddingTop: custom.safeArea ? 'max(1rem, env(safe-area-inset-top))' : '1rem', paddingBottom: custom.safeArea ? 'max(1rem, env(safe-area-inset-bottom))' : '1rem' }}>
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      {custom.dayNightMode !== 'OFF' && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: renderPalette.tint, opacity: custom.dayNightTint / 100 }}></div>
      )}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
      <div className="relative z-10 w-full flex flex-col max-h-full overflow-y-auto" style={{ maxWidth: `${custom.layout.w}px`, gap: `${custom.layout.spacing}px` }}>
        <StdWindow style={panelStyle} className="p-4 text-center">
          <div className="text-white text-xl font-black tracking-widest" style={{ fontFamily: 'var(--bold-font, "Trebuchet MS", sans-serif)' }}>{title}</div>
          <div className="text-blue-200 text-xs mt-1">Pokemon layout, Y2K skin — full screen, not a popup</div>
          {custom.symbolLayer && (
            <div className="text-lg tracking-widest mt-2" style={{ opacity: custom.backgroundFade / 100, color: renderPalette.accent }} aria-hidden="true">✦ ♥ ★ ✦ ♥ ★ ✦ ♥ ★</div>
          )}
        </StdWindow>

        <StdWindow style={panelStyle} className="p-2">
          {rows.map((row, i) => (
            <button
              key={row.label}
              onClick={() => { setCursor(i); if (row.onSelect) row.onSelect(); }}
              onMouseEnter={() => setCursor(i)}
              onFocus={() => setCursor(i)}
              className={`w-full text-left px-3 py-2 flex justify-between items-baseline gap-2 rounded ${i === safeCursor ? 'bg-white/10' : ''}`}
              style={i === safeCursor ? { minHeight: `${custom.touchSize}px`, boxShadow: `inset 0 0 0 2px ${draft.cursorHighlight}` } : { minHeight: `${custom.touchSize}px` }}
            >
              <span className="font-bold tracking-widest text-sm" style={{ fontFamily: 'var(--menu-font, "Trebuchet MS", sans-serif)', fontSize: `${TEXT_SIZE_PX[custom.textSize]}px`, lineHeight: custom.lineSpacing, color: custom.textColor, textShadow: custom.textShadow ? '0 2px 0 rgba(0,0,0,0.6)' : 'none' }}>
                <span
                  className={i === safeCursor && draft.cursorBlink ? 'animate-pulse' : undefined}
                  style={{
                    color: draft.cursorColor,
                    fontSize: cursorGlyphSize(preset.cursorSize),
                    textShadow: draft.cursorShadow
                      ? '2px 2px 0 rgba(0,0,0,0.8)'
                      : draft.cursorGlow
                        ? `0 0 8px ${draft.cursorColor}`
                        : undefined,
                    animationDuration: i === safeCursor && draft.cursorBlink ? cursorBlinkDuration(draft.cursorBlinkSpeed as CursorBlinkSpeed) : undefined,
                  }}
                >{i === safeCursor ? `${cursorGlyph} ` : ''}</span>{row.label}
              </span>
              <span className="text-yellow-300 font-bold text-sm text-right">{row.value}</span>
            </button>
          ))}
        </StdWindow>

        {screen === 'MENU_CUSTOM' && (
          <StdWindow style={{ ...panelStyle, borderRadius: DIALOGUE_BOX_RADIUS[custom.dialogueBoxStyle] }} className="px-3 py-2">
            <div style={{ fontSize: `${TEXT_SIZE_PX[custom.textSize]}px`, lineHeight: custom.lineSpacing, color: custom.textColor, textShadow: custom.textShadow ? '0 2px 0 rgba(0,0,0,0.6)' : 'none' }}>
              <div className="font-bold">Preview — {custom.animationStyle} at {custom.animationSpeed.toFixed(2)}x, sway ±{custom.sway}px{custom.reducedMotion ? ' (reduced motion: static)' : ''}</div>
              <MenuPreviewMotion style={custom.animationStyle} speed={custom.animationSpeed} sway={custom.sway} reduced={custom.reducedMotion} />
              <div className="mt-1">Sprite: {custom.spriteProportion}{spriteScale.fallback ? ' — falls back to Chibi, never blank' : ' — chibi path'} · Order: {custom.layout.order} · Anchor: {custom.layout.anchor} · Biome: {renderBiome || 'none'} · Day/night: {custom.dayNightMode === 'AUTO' ? `${gameVisual} (game time)` : custom.dayNightMode === 'CUSTOM' ? custom.dayNightCustom : 'OFF'} · Camera shake: {custom.cameraShake ? 'ON (stored only — NEED in cameras)' : 'OFF'}</div>
            </div>
          </StdWindow>
        )}

        {rows[safeCursor]?.note && (
          <StdWindow style={panelStyle} className="px-3 py-2 text-sm text-slate-200">
            <span style={{ fontFamily: 'var(--small-font, "Trebuchet MS", sans-serif)' }}>{rows[safeCursor].note}</span>
          </StdWindow>
        )}

        {(screen === 'MENU_CUSTOM' || (screen === 'MENU_CREATOR' && menuPage === 4)) && (
          <StdWindow style={panelStyle} className="px-3 py-2">
            <label className="text-xs text-slate-300 block mb-1">Preset name (for SAVE PRESET)</label>
            <input
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 text-white min-h-[48px]"
            />
            <div className="text-xs text-slate-400 mt-2">Saved presets: {presets.map(p => p.name).join(' · ') || 'none'}</div>
          </StdWindow>
        )}

        {savedMsg && <div className="text-center text-teal-300 text-sm font-bold">{savedMsg}</div>}

        <StdWindow style={panelStyle} className="px-3 py-2 text-sm text-slate-200 text-center">
          A: SELECT &nbsp; LEFT/RIGHT: CHANGE &nbsp; B: BACK
        </StdWindow>
        <button onClick={saveAndBack} className="game-button px-4 py-3 font-bold min-h-[48px]" style={{ fontFamily: 'var(--bold-font, "Trebuchet MS", sans-serif)' }}>SAVE + BACK TO MAIN MENU</button>
      </div>
    </div>
  );
}
