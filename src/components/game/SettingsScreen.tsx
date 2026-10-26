import React, { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import StdWindow from './StdWindow';
import {
  GameSettings, DEFAULT_SETTINGS, TEXT_SPEEDS, BATTLE_SCENES, BATTLE_STYLES,
  SOUNDS, BUTTON_MODES, frameAccent, frameName, persistSettings,
  MenuPreset, LOCKED_PRESET, loadPresets, savePresets, presetToJson,
} from '../../lib/gameSettings';
import { FONT_OPTIONS, fontById, applyFontRoles } from '../../lib/fonts';
import IntroVideoCreatorScreen from './IntroVideoCreatorScreen';
import StartScreenCreator from './StartScreenCreator';
import {
  MenuCustomSettings, DEFAULT_MENU_CUSTOM, loadMenuCustom, persistMenuCustom,
  applyMenuCustom, customToLayoutRecord, resolveDayNightPalette,
  resolveBackgroundBiome, biomeBackgroundCss, spriteDisplayScale,
  ANIMATION_STYLES, MENU_ANCHORS, MENU_ORDERS, BACKGROUND_BIOMES,
  SPRITE_PROPORTIONS, TEXT_SIZES, TEXT_SIZE_PX, TEXT_COLORS_CUSTOM,
  DIALOGUE_BOX_STYLES, DIALOGUE_BOX_RADIUS, DAY_NIGHT_MODES, DAY_NIGHT_VISUALS,
  getGameTimeOfDay, visualStateOf, dayNightBlend,
} from '../../lib/menuCustom';

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
 * SOUND is a stored flag only — there is no audio engine in this
 * build to route yet (map music fields are names only), labelled
 * NEED in the UI, not faked. BUTTON MODE is honoured in this screen
 * (LEFT/RIGHT cycle, L confirms when L=EQUALS=A); wider control
 * remapping is NEED, labelled in the UI.
 *
 * Preset rows (Menu Creator family) are saved as presets and NEVER
 * overwrite locked v32 until Mars locks a new one. Reset to Locked
 * Default restores DEFAULT_SETTINGS + LOCKED_PRESET.
 */

type Screen = 'SETTINGS' | 'MENU_CREATOR' | 'MENU_CUSTOM' | 'UI_CREATOR' | 'LAYOUT_EDITOR' | 'CURSOR_CREATOR' | 'PANEL_FRAME_EDITOR' | 'FONT_SETTINGS' | 'INTRO_VIDEO_CREATOR' | 'START_SCREEN_CREATOR';

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

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
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

  const accent = frameAccent(draft.frame);
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
    { label: 'SOUND', value: draft.sound, onLeft: () => set({ sound: cycle(SOUNDS, draft.sound, -1) }), onRight: () => set({ sound: cycle(SOUNDS, draft.sound, 1) }), note: 'NEED: stored flag only — no audio engine in this build yet to route mono/stereo.' },
    { label: 'BUTTON MODE', value: draft.buttonMode, onLeft: () => set({ buttonMode: cycle(BUTTON_MODES, draft.buttonMode, -1) }), onRight: () => set({ buttonMode: cycle(BUTTON_MODES, draft.buttonMode, 1) }), note: 'Honoured in Settings: LEFT/RIGHT cycle, L confirms when L=EQUALS=A. Wider remapping is NEED.' },
    { label: 'FRAME', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Original Mochiichao Y2K frames in Pokemon frame slots (1-10 FireRed base, 11-20 HeartGold/Platinum extra). Reloads live on return.' },
    { label: 'FONT SETTINGS', value: `${mainFontOpt.label} / ${menuFontOpt.label} / ${dialogueFontOpt.label}`, onLeft: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, onRight: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, onSelect: () => { setFontReturn('SETTINGS'); setScreen('FONT_SETTINGS'); }, note: 'Six independent placements (Mars font correction): MAIN / MENU / DIALOGUE / SMALL / BOLD / BATTLE, each cycles every font in fonts-settings-list.md independently, including Default — Trebuchet MS / system sans. Applies live on return. DIAMOND VERSION subtitle font is PINNED and never changes.' },
    { label: 'MENU CREATOR', value: 'OPEN ►', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR'), note: 'Full screen: Logo / Background / Animation / Panels. Presets only, never overwrites v32.' },
    { label: 'CANCEL', value: 'SAVE + EXIT', onLeft: saveAndBack, onRight: saveAndBack, onSelect: saveAndBack, note: 'Saves all rows to the save + localStorage and returns to the main menu.' },
  ], [draft, mainFontOpt, menuFontOpt, dialogueFontOpt, preset]); // eslint-disable-line react-hooks/exhaustive-deps

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
        { label: 'CREATE INTRO VIDEO', value: 'OPEN ►', onLeft: () => setScreen('INTRO_VIDEO_CREATOR'), onRight: () => setScreen('INTRO_VIDEO_CREATOR'), onSelect: () => setScreen('INTRO_VIDEO_CREATOR'), note: 'Full dedicated screen: scene list, timeline ruler, keyframes, presets. Presets only; locked default never overwritten. Playback from a saved preset + video export are later batches (GAP).' },
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

  const uiCreatorRows: Row[] = [
    { label: 'MENU UI — FRAME', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Applies to real windows on return, Pokemon FRAME pattern.' },
    { label: 'MENU UI — PANEL COLOR', value: preset.panelColor, onLeft: () => cyclePresetField('panelColor', PANEL_COLORS, -1), onRight: () => cyclePresetField('panelColor', PANEL_COLORS, 1), note: 'Preset row. Per-menu colours: Roster pink, Shop yellow, Bag green, Battle red/orange, PC blue, Garden purple.' },
    { label: 'BATTLE UI — HEALTHBOX', value: 'Enemy top-left / Player bottom-right', onLeft: () => undefined, onRight: () => undefined, note: 'Already in game (BattleView healthboxes, HP green >50% / yellow >20% / red <=20%). Y2K skin via game-panel.' },
    { label: 'BATTLE UI — ACTION MENU', value: '2x2 + PP/TYPE', onLeft: () => undefined, onRight: () => undefined, note: 'Already in game (BattleView 2x2 grid, PP/TYPE line, Luigi Cube, Flee).' },
    { label: 'SYSTEM UI — DIALOGUE', value: 'Bottom full-width', onLeft: () => undefined, onRight: () => undefined, note: 'Already in game (DialogueBox, 2 lines per page, text speed row applies).' },
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
    { label: 'CURSOR GLOW', value: draft.cursorGlow ? 'ON' : 'OFF', onLeft: () => set({ cursorGlow: !draft.cursorGlow }), onRight: () => set({ cursorGlow: !draft.cursorGlow }) },
    { label: 'CURSOR SIZE', value: preset.cursorSize, onLeft: () => cyclePresetField('cursorSize', ['S', 'M', 'L'], -1), onRight: () => cyclePresetField('cursorSize', ['S', 'M', 'L'], 1) },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  const panelRows: Row[] = [
    { label: 'FRAME TYPE', value: frameName(draft.frame), onLeft: () => set({ frame: draft.frame <= 1 ? 20 : draft.frame - 1 }), onRight: () => set({ frame: draft.frame >= 20 ? 1 : draft.frame + 1 }), note: 'Kenney CC0-style rounded/square panel shapes as options (existing in-repo panel SVGs: panel-main, panel-small, panel-title). No Kenney file is copied in here.' },
    { label: 'FRAME PALETTE', value: preset.panelColor, onLeft: () => cyclePresetField('panelColor', PANEL_COLORS, -1), onRight: () => cyclePresetField('panelColor', PANEL_COLORS, 1) },
    { label: 'ROUNDED RADIUS', value: String(preset.panelRadius), onLeft: () => setP({ panelRadius: Math.max(0, preset.panelRadius - 2) }), onRight: () => setP({ panelRadius: Math.min(24, preset.panelRadius + 2) }), note: 'Applies to this screen\'s windows live.' },
    { label: 'BORDER WIDTH', value: String(preset.panelBorderWidth), onLeft: () => setP({ panelBorderWidth: Math.max(1, preset.panelBorderWidth - 1) }), onRight: () => setP({ panelBorderWidth: Math.min(4, preset.panelBorderWidth + 1) }) },
    { label: 'WHITE BORDER', value: preset.whiteBorder ? 'ON' : 'OFF', onLeft: () => setP({ whiteBorder: !preset.whiteBorder }), onRight: () => setP({ whiteBorder: !preset.whiteBorder }) },
    { label: 'GLOSS', value: preset.gloss ? 'ON' : 'OFF', onLeft: () => setP({ gloss: !preset.gloss }), onRight: () => setP({ gloss: !preset.gloss }) },
    { label: 'GLOW', value: preset.glow ? 'ON' : 'OFF', onLeft: () => setP({ glow: !preset.glow }), onRight: () => setP({ glow: !preset.glow }) },
    { label: 'GRADIENT', value: preset.gradient ? 'ON' : 'OFF', onLeft: () => setP({ gradient: !preset.gradient }), onRight: () => setP({ gradient: !preset.gradient }) },
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
    { label: 'ANIMATION STYLE', value: custom.animationStyle, onLeft: () => setC({ animationStyle: cycle(ANIMATION_STYLES, custom.animationStyle, -1) }), onRight: () => setC({ animationStyle: cycle(ANIMATION_STYLES, custom.animationStyle, 1) }), note: 'SINE = sine offset x amplitude; FLOW = flowing symbol motion; RISE_FADE = rise + fade (locked v32 motion). Preview strip only in this batch; in-game menu animation: NEED.' },
    { label: 'ANIMATION SPEED', value: `${custom.animationSpeed.toFixed(2)}x`, onLeft: () => setC({ animationSpeed: clampStep(custom.animationSpeed, 0.5, 2, 0.25, -1) }), onRight: () => setC({ animationSpeed: clampStep(custom.animationSpeed, 0.5, 2, 0.25, 1) }), note: 'Global animation speed multiplier (also the gameplay-adjacent animation-speed row — one row, counted once). Sets --menu-anim-speed; preview strip duration follows it.' },
    { label: 'SWAY', value: String(custom.sway), onLeft: () => setC({ sway: Math.max(0, custom.sway - 1) }), onRight: () => setC({ sway: Math.min(8, custom.sway + 1) }), note: 'Sine sway amplitude (px, locked v32 = 3). Preview strip label only in this batch; full sine motion on real menus: NEED.' },
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
    { label: 'REDUCED MOTION', value: custom.reducedMotion ? 'ON' : 'OFF', onLeft: () => setC({ reducedMotion: !custom.reducedMotion }), onRight: () => setC({ reducedMotion: !custom.reducedMotion }), note: 'ON stops the preview strip animation and sets --menu-reduced-motion=none on return. Full motion suppression across battle/world animation is NEED.' },
    { label: 'TOUCH SIZE', value: `${custom.touchSize}px`, onLeft: () => setC({ touchSize: cycle([44, 48, 56], custom.touchSize, -1) }), onRight: () => setC({ touchSize: cycle([44, 48, 56], custom.touchSize, 1) }), note: 'Touch target height for rows. Default 48px (existing row height). Applies to this screen\'s row buttons immediately in this screen.' },
    { label: 'SAFE AREA', value: custom.safeArea ? 'ON' : 'OFF', onLeft: () => setC({ safeArea: !custom.safeArea }), onRight: () => setC({ safeArea: !custom.safeArea }), note: 'ON = screen padding honours env(safe-area-inset-*) (phone notch/home bar); OFF = fixed padding. Applies to this screen\'s outer padding on return.' },
    { label: 'BACK TO MENU CREATOR', value: '◄ BACK', onLeft: () => setScreen('MENU_CREATOR'), onRight: () => setScreen('MENU_CREATOR'), onSelect: () => setScreen('MENU_CREATOR') },
  ];

  // Font Settings — Mars font CORRECTION (2026-10-25 18:30 CDT,
  // overrides the 2-row version): six rows, each cycles the full
  // FONT_OPTIONS list independently (including the named entry
  // "Default — Trebuchet MS / system sans" on every row), applies
  // live on return, CANCEL saves + exits.
  // RESET FONTS restores, in row order:
  // MAIN=Yagiza / MENU=Yagiza / DIALOGUE=01 Digitall /
  // SMALL=01 Digitall / BOLD=Yagiza / BATTLE=01 Digitall.
  // ORIGINAL DEFAULTS applies the open-fonts preset (Bungee /
  // Titan One / Fredoka style). DIAMOND VERSION subtitle font is
  // PINNED — no row here touches it (see fonts.ts
  // PINNED_SUBTITLE_FONT, applied in IntroSequence).
  // Future custom logo font is NOT built here, not claimed.
  const cycleFont = (cur: string, dir: 1 | -1): string => {
    const i = FONT_OPTIONS.findIndex(f => f.id === cur);
    return FONT_OPTIONS[(i + dir + FONT_OPTIONS.length) % FONT_OPTIONS.length].id;
  };
  const resetFonts = () => { set({ mainFont: 'yagiza', menuFont: 'yagiza', dialogueFont: '01-digitall', smallFont: '01-digitall', boldFont: 'yagiza', battleFont: '01-digitall' }); setSavedMsg('Fonts reset: MAIN=Yagiza, MENU=Yagiza, DIALOGUE=01 Digitall, SMALL=01 Digitall, BOLD=Yagiza, BATTLE=01 Digitall.'); };
  const originalDefaults = () => { set({ mainFont: 'bungee', menuFont: 'titan-one', dialogueFont: 'fredoka', smallFont: 'fredoka', boldFont: 'bungee', battleFont: 'fredoka' }); setSavedMsg('Original Defaults preset applied: MAIN=Bungee, MENU=Titan One, DIALOGUE=Fredoka, SMALL=Fredoka, BOLD=Bungee, BATTLE=Fredoka (open fonts only).'); };
  const fontRows: Row[] = [
    { label: 'MAIN FONT', value: mainFontOpt.label, onLeft: () => set({ mainFont: cycleFont(draft.mainFont, -1) }), onRight: () => set({ mainFont: cycleFont(draft.mainFont, 1) }), note: 'MAIN FONT (true starting default Yagiza) = titles, menus, headings, UI labels — via --game-font (body). ' + mainFontOpt.note },
    { label: 'MENU FONT', value: menuFontOpt.label, onLeft: () => set({ menuFont: cycleFont(draft.menuFont, -1) }), onRight: () => set({ menuFont: cycleFont(draft.menuFont, 1) }), note: 'MENU FONT (separate row, starting default also Yagiza) = menu selection row text ONLY — main-menu CONTINUE / NEW GAME / SETTINGS rows and Settings rows follow this. Main menu layout/logo/cloud/panels/colours are otherwise UNCHANGED (locked v32). ' + menuFontOpt.note },
    { label: 'DIALOGUE FONT', value: dialogueFontOpt.label, onLeft: () => set({ dialogueFont: cycleFont(draft.dialogueFont, -1) }), onRight: () => set({ dialogueFont: cycleFont(draft.dialogueFont, 1) }), note: 'DIALOGUE FONT (01 Digitall) = dialogue boxes, NPC talk, body text — via --dialogue-font in DialogueBox. ' + dialogueFontOpt.note },
    { label: 'SMALL FONT', value: smallFontOpt.label, onLeft: () => set({ smallFont: cycleFont(draft.smallFont, -1) }), onRight: () => set({ smallFont: cycleFont(draft.smallFont, 1) }), note: 'SMALL FONT (starting 01 Digitall, Pokemon FONT_SMALL slot) = small labels and notes — speaker names, Settings notes/help. ' + smallFontOpt.note },
    { label: 'BOLD FONT', value: boldFontOpt.label, onLeft: () => set({ boldFont: cycleFont(draft.boldFont, -1) }), onRight: () => set({ boldFont: cycleFont(draft.boldFont, 1) }), note: 'BOLD FONT (starting Yagiza, FONT_BOLD slot) = bold headings and action buttons — Settings header, title logo, SAVE + BACK. ' + boldFontOpt.note },
    { label: 'BATTLE FONT', value: battleFontOpt.label, onLeft: () => set({ battleFont: cycleFont(draft.battleFont, -1) }), onRight: () => set({ battleFont: cycleFont(draft.battleFont, 1) }), note: 'BATTLE FONT (starting 01 Digitall) = battle log and HUD — BattleView message/log, healthboxes, move buttons. ' + battleFontOpt.note },
    { label: 'RESET FONTS', value: 'Yagiza / Yagiza / Digitall', onLeft: resetFonts, onRight: resetFonts, onSelect: resetFonts, note: 'Restores, in row order: MAIN=Yagiza, MENU=Yagiza, DIALOGUE=01 Digitall, SMALL=01 Digitall, BOLD=Yagiza, BATTLE=01 Digitall. Save with CANCEL / SAVE + BACK to persist.' },
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
      if (screen === 'INTRO_VIDEO_CREATOR' || screen === 'START_SCREEN_CREATOR') return; // creator screens own their keys (any-key-skips + B: BACK)
      if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => (c - 1 + rows.length) % rows.length); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => (c + 1) % rows.length); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); rows[safeCursor]?.onLeft(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); rows[safeCursor]?.onRight(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const r = rows[safeCursor]; if (r?.onSelect) r.onSelect(); else r?.onRight(); }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (screen === 'SETTINGS') saveAndBack();
        else if (screen === 'MENU_CREATOR') setScreen('SETTINGS');
        else if (screen === 'FONT_SETTINGS') setScreen(fontReturn);
        else setScreen('MENU_CREATOR');
      } else if (draft.buttonMode === 'L_EQUALS_A' && e.key.toLowerCase() === 'l') {
        e.preventDefault(); const r = rows[safeCursor]; if (r?.onSelect) r.onSelect(); else r?.onRight();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, safeCursor, screen, draft, preset]);

  const panelStyle: React.CSSProperties = {
    borderRadius: preset.panelRadius,
    borderWidth: preset.panelBorderWidth,
    borderColor: preset.whiteBorder ? '#ffffff' : accent,
    boxShadow: preset.glow ? `0 0 0 2px ${accent}55, 0 6px 24px rgba(0,0,0,0.45)` : undefined,
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

  // CREATE START SCREEN is its own full dedicated screen (batch E).
  // B: BACK inside it returns to MENU_CREATOR via onBack.
  if (screen === 'START_SCREEN_CREATOR') {
    return <StartScreenCreator onBack={() => setScreen('MENU_CREATOR')} />;
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
              className={`w-full text-left px-3 py-2 flex justify-between items-baseline gap-2 rounded ${i === safeCursor ? 'bg-white/10 ring-2 ring-yellow-300' : ''}`}
              style={{ minHeight: `${custom.touchSize}px` }}
            >
              <span className="font-bold tracking-widest text-sm" style={{ fontFamily: 'var(--menu-font, "Trebuchet MS", sans-serif)', fontSize: `${TEXT_SIZE_PX[custom.textSize]}px`, lineHeight: custom.lineSpacing, color: custom.textColor, textShadow: custom.textShadow ? '0 2px 0 rgba(0,0,0,0.6)' : 'none' }}>
                <span style={{ color: draft.cursorColor }}>{i === safeCursor ? `${cursorGlyph} ` : ''}</span>{row.label}
              </span>
              <span className="text-yellow-300 font-bold text-sm text-right">{row.value}</span>
            </button>
          ))}
        </StdWindow>

        {screen === 'MENU_CUSTOM' && (
          <StdWindow style={{ ...panelStyle, borderRadius: DIALOGUE_BOX_RADIUS[custom.dialogueBoxStyle] }} className="px-3 py-2">
            <div style={{ fontSize: `${TEXT_SIZE_PX[custom.textSize]}px`, lineHeight: custom.lineSpacing, color: custom.textColor, textShadow: custom.textShadow ? '0 2px 0 rgba(0,0,0,0.6)' : 'none' }}>
              <div className="font-bold">Preview — {custom.animationStyle} at {custom.animationSpeed.toFixed(2)}x, sway ±{custom.sway}px</div>
              <div className={custom.reducedMotion ? '' : 'animate-pulse'} style={{ animationDuration: `${1 / custom.animationSpeed}s`, animationPlayState: custom.reducedMotion ? 'paused' : 'running' }}>
                ✦ Menu preview strip — pulse only in this batch; full sine/flow/rise-fade motion on real menus is NEED.
              </div>
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
