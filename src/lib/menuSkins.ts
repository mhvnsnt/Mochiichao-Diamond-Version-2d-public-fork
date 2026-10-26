import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import './menuSkins.css';

/**
 * Per-menu Y2K skin wiring (UI Art lane, skins PR #151 follow-up).
 *
 * PR #151 shipped preset DEFINITIONS only (docs/ui-art/menu-skins/),
 * explicitly not wired: no component imported them. This module is the
 * wiring side: it carries the same values in TypeScript (so components
 * can apply them without a JSON import, which this repo's tsconfig
 * does not enable), plus the per-menu selection store. Components
 * apply a skin by setting data-menu-skin + the CSS variables from
 * menuSkinVars() on their root/panel; menuSkins.css maps those
 * variables onto .game-panel / .std-window frames and text colours.
 * Variables (not per-variant CSS rules) keep this table the single
 * source of truth for values.
 *
 * Values below are copied verbatim from the #151 JSON files, except
 * the PC and Party rows: #151 shipped NO pc/party preset files (its 8
 * menus are main-menu, settings, bag, shop, pause, battle, save-slots,
 * dialogue), so the PC/Party rows use the bag preset values — the
 * sibling #0b1526 screen — and are defined in the two gap-fill files
 * docs/ui-art/menu-skins/pc.y2k-skins.json and party.y2k-skins.json
 * added in the same PR as this module. A verification script (kept in
 * the workspace, not shipped) diffs this table against those JSON
 * files so drift is caught, not silently shipped.
 *
 * Guards, unchanged from #151:
 * - Locked default title / v32 main menu: NEVER skinned. The
 *   main-menu presets exist in #151 but are deliberately NOT wired
 *   here — no main-menu flavour is offered, and this module has no
 *   main-menu row at all.
 * - Logo: always the PNG, never font text. Skins style panel fills,
 *   borders, text and the selected frame only; they never restyle,
 *   replace, or re-render the logo.
 * - Layout: a skin recolours panels in their locked slots; it never
 *   relocates a panel, changes an action, or changes save data.
 *   HP thresholds, move type colours and battle math are untouched.
 * - Default: flavour 'default' means the menu renders exactly as
 *   before (no skin style applied). A skin only renders once the
 *   player picks it on a Settings row. Nothing changes by default.
 * - Reduced motion: skins add no motion (no bob/sway), so the
 *   presets' "static; no sway" reduced-motion rule holds by
 *   construction.
 * - Pause / Bag / Shop are NOT re-wired here: they already render
 *   Y2K styling from earlier batches (.pause-y2k-panel, .bag-y2k,
 *   .shop-y2k in index.css) and are left exactly as they are.
 */

export type MenuSkinMenu = 'pc' | 'party' | 'save' | 'battle' | 'dialogue';
export type MenuSkinFlavour = 'default' | 'pastel-day' | 'chrome-midnight' | 'bubblegum-pop';

export interface MenuSkinVariant {
  id: string;
  name: string;
  flavour: Exclude<MenuSkinFlavour, 'default'>;
  panel: { fill: [string, string]; border: string; borderWidthPx: number; radiusPx: number; selectedFrame: string };
  text: { label: string; sublabel: string };
  cursor: string;
  background: string;
  symbols: string;
  gloss: boolean;
  glow: boolean;
}

export const MENU_SKIN_MENUS: { menu: MenuSkinMenu; label: string; presetFile: string }[] = [
  { menu: 'pc', label: 'PC Storage', presetFile: 'docs/ui-art/menu-skins/pc.y2k-skins.json' },
  { menu: 'party', label: 'Team (Party)', presetFile: 'docs/ui-art/menu-skins/party.y2k-skins.json' },
  { menu: 'save', label: 'Save Files', presetFile: 'docs/ui-art/menu-skins/save-slots.y2k-skins.json' },
  { menu: 'battle', label: 'Battle HUD', presetFile: 'docs/ui-art/menu-skins/battle.y2k-skins.json' },
  { menu: 'dialogue', label: 'Dialogue', presetFile: 'docs/ui-art/menu-skins/dialogue.y2k-skins.json' },
];

export const MENU_SKIN_FLAVOURS: { flavour: MenuSkinFlavour; label: string }[] = [
  { flavour: 'default', label: 'Default' },
  { flavour: 'pastel-day', label: 'Pastel Day' },
  { flavour: 'chrome-midnight', label: 'Chrome Midnight' },
  { flavour: 'bubblegum-pop', label: 'Bubblegum Pop' },
];

const pastel = (radiusPx: number, background: string): MenuSkinVariant => ({
  id: 'pastel-day', name: 'Pastel Day', flavour: 'pastel-day',
  panel: { fill: ['#ffffff', '#fdf2f8'], border: '#000000', borderWidthPx: 3, radiusPx, selectedFrame: '4px solid #fbbf24 + soft glow' },
  text: { label: '#0f172a', sublabel: '#334155' }, cursor: '#f472b6',
  background, symbols: 'hearts + stars, pointer-events none, behind panels', gloss: true, glow: false,
});
const chrome = (radiusPx: number, background: string): MenuSkinVariant => ({
  id: 'chrome-midnight', name: 'Chrome Midnight', flavour: 'chrome-midnight',
  panel: { fill: ['#16233a', '#0f172a'], border: '#22d3ee', borderWidthPx: 3, radiusPx, selectedFrame: '4px solid #fbbf24 + gold glow' },
  text: { label: '#f1f5f9', sublabel: '#cbd5e1' }, cursor: '#fbbf24',
  background, symbols: 'orbit rings, pointer-events none, behind panels', gloss: true, glow: true,
});
const bubblegum = (radiusPx: number, background: string): MenuSkinVariant => ({
  id: 'bubblegum-pop', name: 'Bubblegum Pop', flavour: 'bubblegum-pop',
  panel: { fill: ['#f472b6', '#db2777'], border: '#000000', borderWidthPx: 4, radiusPx, selectedFrame: '4px solid #fbbf24 + hot-pink glow' },
  text: { label: '#000000', sublabel: '#1e293b' }, cursor: '#22d3ee',
  background, symbols: 'stars + sparkles, pointer-events none, behind panels', gloss: true, glow: true,
});

/** Variant ids are prefixed per menu to match the preset files. */
const withIds = (menu: string, variants: MenuSkinVariant[]): Record<string, MenuSkinVariant> => {
  const out: Record<string, MenuSkinVariant> = {};
  for (const v of variants) out[v.flavour] = { ...v, id: `${menu}-${v.flavour}` };
  return out;
};

const SKINS: Record<MenuSkinMenu, Record<Exclude<MenuSkinFlavour, 'default'>, MenuSkinVariant>> = {
  // Gap-fill rows (bag values, screen bg #0b1526): see header note.
  pc: withIds('pc', [pastel(28, '#fdf2f8'), chrome(28, '#0b1526'), bubblegum(28, '#fdf2f8')]),
  party: withIds('party', [pastel(28, '#fdf2f8'), chrome(28, '#0b1526'), bubblegum(28, '#fdf2f8')]),
  // Verbatim from save-slots.y2k-skins.json (radius 28).
  save: withIds('save-slots', [pastel(28, '#fdf2f8'), chrome(28, '#050810'), bubblegum(28, '#fdf2f8')]),
  // Verbatim from battle.y2k-skins.json (radius 28, screen bg #0b1526 all flavours).
  battle: withIds('battle', [pastel(28, '#0b1526'), chrome(28, '#0b1526'), bubblegum(28, '#0b1526')]),
  // Verbatim from dialogue.y2k-skins.json (radius 14, matching the
  // --menu-dialogue-radius default the box already uses).
  dialogue: withIds('dialogue', [pastel(14, '#fdf2f8'), chrome(14, '#050810'), bubblegum(14, '#fdf2f8')]),
};

/** Selected-frame rendering of each preset's selectedFrame string:
 *  the gold 4px frame plus the flavour's glow colour. Components use
 *  this INSTEAD of the yellow ring class while a skin is active, so
 *  a selected row never wears two frames at once. */
const SELECTED_GLOW: Record<Exclude<MenuSkinFlavour, 'default'>, string> = {
  'pastel-day': '0 0 0 4px #fbbf24, 0 0 16px rgba(251,191,36,0.45)',
  'chrome-midnight': '0 0 0 4px #fbbf24, 0 0 20px rgba(251,191,36,0.60)',
  'bubblegum-pop': '0 0 0 4px #fbbf24, 0 0 16px rgba(236,72,153,0.55)',
};

/** Panel glow only (no frame): the second shadow of SELECTED_GLOW. */
const PANEL_GLOW: Record<Exclude<MenuSkinFlavour, 'default'>, string> = {
  'pastel-day': '0 0 16px rgba(251,191,36,0.45)',
  'chrome-midnight': '0 0 20px rgba(251,191,36,0.60)',
  'bubblegum-pop': '0 0 16px rgba(236,72,153,0.55)',
};

const STORAGE_KEY = 'mochiichao-menu-skins-v1';
const CHANGE_EVENT = 'mochiichao-menu-skin-changed';

export type MenuSkinChoices = Record<MenuSkinMenu, MenuSkinFlavour>;

export const DEFAULT_MENU_SKIN_CHOICES: MenuSkinChoices = {
  pc: 'default', party: 'default', save: 'default', battle: 'default', dialogue: 'default',
};

export function loadMenuSkinChoices(): MenuSkinChoices {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_MENU_SKIN_CHOICES };
    const parsed = JSON.parse(raw) as Partial<MenuSkinChoices>;
    const out = { ...DEFAULT_MENU_SKIN_CHOICES };
    (Object.keys(out) as MenuSkinMenu[]).forEach(m => {
      if (MENU_SKIN_FLAVOURS.some(f => f.flavour === parsed[m])) out[m] = parsed[m] as MenuSkinFlavour;
    });
    return out;
  } catch {
    return { ...DEFAULT_MENU_SKIN_CHOICES };
  }
}

/** Returns the flavour stored for a menu, or 'default' when none is set. */
export function getMenuSkinFlavour(menu: MenuSkinMenu): MenuSkinFlavour {
  return loadMenuSkinChoices()[menu];
}

/** The active variant for a menu, or null when it renders its default look. */
export function getMenuSkin(menu: MenuSkinMenu): MenuSkinVariant | null {
  const flavour = getMenuSkinFlavour(menu);
  if (flavour === 'default') return null;
  return SKINS[menu][flavour];
}

/** Persists a choice (own localStorage key, independent of the game
 *  save and of Settings SAVE + EXIT) and notifies mounted menus so
 *  they re-render live without a reload. */
export function setMenuSkin(menu: MenuSkinMenu, flavour: MenuSkinFlavour): MenuSkinFlavour {
  const next = { ...loadMenuSkinChoices(), [menu]: flavour };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode: callers still re-render in-session via the event below */
  }
  try {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { menu, flavour } }));
  } catch {
    /* non-DOM test hosts: storage still holds the choice */
  }
  return flavour;
}

/** Live skin for a menu: re-reads on storage events and on setMenuSkin. */
export function useMenuSkin(menu: MenuSkinMenu): MenuSkinVariant | null {
  const [skin, setSkin] = useState<MenuSkinVariant | null>(() => getMenuSkin(menu));
  useEffect(() => {
    const refresh = () => setSkin(getMenuSkin(menu));
    window.addEventListener('storage', refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [menu]);
  return skin;
}

/** Panel shadow for a skin, for the few components whose inline
 *  boxShadow would otherwise clobber the CSS panel glow (BattleView
 *  healthboxes, DialogueBox). Null skin = undefined (caller keeps
 *  its existing shadow logic). */
export function menuSkinPanelShadow(skin: MenuSkinVariant | null): string | undefined {
  if (!skin) return undefined;
  return skin.glow ? PANEL_GLOW[skin.flavour] : '0 6px 24px rgba(0,0,0,0.45)';
}

/** CSS variables for a skin, set inline on the skinned container
 *  alongside data-menu-skin={skin.id}. Null skin = undefined, so
 *  callers spread nothing and the default look is byte-identical.
 *  The variables exist only to feed menuSkins.css; components must
 *  NOT also hand-apply panel fills, or the two would drift. */
export function menuSkinVars(skin: MenuSkinVariant | null): CSSProperties | undefined {
  if (!skin) return undefined;
  return {
    '--skin-panel-fill': `linear-gradient(180deg, ${skin.panel.fill[0]}, ${skin.panel.fill[1]})`,
    '--skin-panel-border': skin.panel.border,
    '--skin-border-width': `${skin.panel.borderWidthPx}px`,
    '--skin-radius': `${skin.panel.radiusPx}px`,
    '--skin-text': skin.text.label,
    '--skin-subtext': skin.text.sublabel,
    '--skin-cursor': skin.cursor,
    '--skin-bg': skin.background,
    '--skin-panel-glow': skin.glow ? PANEL_GLOW[skin.flavour] : '0 6px 24px rgba(0,0,0,0.45)',
    '--skin-selected-glow': SELECTED_GLOW[skin.flavour],
  } as CSSProperties;
}
