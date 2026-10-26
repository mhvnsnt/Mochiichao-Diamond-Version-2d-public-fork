import React, { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import StdWindow from './StdWindow';
import {
  GameSettings, DEFAULT_SETTINGS, TEXT_SPEEDS, BATTLE_SCENES, BATTLE_STYLES,
  SOUNDS, BUTTON_MODES, frameAccent, frameName, persistSettings,
  MenuPreset, LOCKED_PRESET, loadPresets, savePresets, presetToJson,
} from '../../lib/gameSettings';
import { FONT_OPTIONS, fontById, applyFontRoles } from '../../lib/fonts';
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

type Screen = 'SETTINGS' | 'MENU_CREATOR' | 'UI_CREATOR' | 'LAYOUT_EDITOR' | 'CURSOR_CREATOR' | 'PANEL_FRAME_EDITOR' | 'FONT_SETTINGS';

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
  const [presetName, setPresetName] = useState('My Preset 1');
  const [savedMsg, setSavedMsg] = useState('');
  const [fontReturn, setFontReturn] = useState<Screen>('SETTINGS');
  // Batch A: which menu the per-menu panel colour / frame rows target.
  // Selector only — the colour / frame values themselves live in
  // the settings (draft) and are saved with the preset's snapshot.
  const [perMenuTarget, setPerMenuTarget] = useState<MenuKey>('SETTINGS');

  // SETTINGS menu frame: per-menu override wins over the global
  // FRAME row when set (0 = follow global), per hudCustom.
  const accent = menuFrameAccent('SETTINGS', draft);
  const mainFontOpt = fontById(draft.mainFont);
  const menuFontOpt = fontById(draft.menuFont);
  const dialogueFontOpt = fontById(draft.dialogueFont);
  const smallFontOpt = fontById(draft.smallFont);
  const boldFontOpt = fontById(draft.boldFont);
  const battleFontOpt = fontById(draft.battleFont);

  const saveAll = (next: GameSettings, nextPreset?: MenuPreset) => {
    setSettings(next);
    persistSettings(next);
    applyFontRoles(next);
    if (nextPreset) {
      const list = presets.map(p => (p.name === nextPreset.name ? nextPreset : p));
      const finalList = list.some(p => p.name === nextPreset.name) ? list : [...list, nextPreset];
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
    setDraft(d);
    setPreset(p);
    saveAll(d, p);
    setSavedMsg('Reset to Locked Default (v32).');
  };

  const exportPreset = () => {
    const blob = new Blob([presetToJson({ ...preset, settings: draft })], { type: 'application/json' });
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
    : screen === 'UI_CREATOR' ? uiCreatorRows
    : screen === 'LAYOUT_EDITOR' ? layoutRows
    : screen === 'CURSOR_CREATOR' ? cursorRows
    : screen === 'FONT_SETTINGS' ? fontRows
    : panelRows;

  const title = screen === 'SETTINGS' ? 'SETTINGS'
    : screen === 'MENU_CREATOR' ? `MENU CREATOR — Page ${menuPage}`
    : screen === 'UI_CREATOR' ? 'UI CREATOR'
    : screen === 'LAYOUT_EDITOR' ? 'LAYOUT EDITOR'
    : screen === 'CURSOR_CREATOR' ? 'CURSOR CREATOR'
    : screen === 'FONT_SETTINGS' ? 'FONT SETTINGS'
    : 'PANEL FRAME EDITOR';

  const safeCursor = Math.min(cursor, rows.length - 1);

  useEffect(() => { setCursor(0); }, [screen, menuPage]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
      <div className="relative z-10 w-full max-w-lg flex flex-col gap-3 max-h-full overflow-y-auto">
        <StdWindow style={panelStyle} className="p-4 text-center">
          <div className="text-white text-xl font-black tracking-widest" style={{ fontFamily: 'var(--bold-font, "Trebuchet MS", sans-serif)' }}>{title}</div>
          <div className="text-blue-200 text-xs mt-1">Pokemon layout, Y2K skin — full screen, not a popup</div>
        </StdWindow>

        <StdWindow style={panelStyle} className="p-2">
          {rows.map((row, i) => (
            <button
              key={row.label}
              onClick={() => { setCursor(i); if (row.onSelect) row.onSelect(); }}
              onMouseEnter={() => setCursor(i)}
              onFocus={() => setCursor(i)}
              className={`w-full text-left px-3 py-2 min-h-[48px] flex justify-between items-baseline gap-2 rounded ${i === safeCursor ? 'bg-white/10' : ''}`}
              style={i === safeCursor ? { boxShadow: `inset 0 0 0 2px ${draft.cursorHighlight}` } : undefined}
            >
              <span className="font-bold tracking-widest text-white text-sm" style={{ fontFamily: 'var(--menu-font, "Trebuchet MS", sans-serif)' }}>
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

        {rows[safeCursor]?.note && (
          <StdWindow style={panelStyle} className="px-3 py-2 text-sm text-slate-200">
            <span style={{ fontFamily: 'var(--small-font, "Trebuchet MS", sans-serif)' }}>{rows[safeCursor].note}</span>
          </StdWindow>
        )}

        {screen === 'MENU_CREATOR' && menuPage === 4 && (
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
