/**
 * Menu layout LIVE state — the switch that actually changes menus.
 *
 * Source: src/lib/menuLayoutCatalogue.ts on main (PR #314, 45 entries:
 * 5 gens x 9 types: title, pause, battle, party, bag, pc, shop, dex,
 * settings), plus the staged 7-type registry
 * (swappable-menus-wallpapers/layout-registry.json) for the SAVE type,
 * which the catalogue does not carry. No new layout pattern is invented
 * here: every entry id below is either a catalogue id or a registry
 * save id, with its source pattern in the comment.
 *
 * Precedence (staged spec): per-menu override > global preset > gen5
 * default. Default is gen5 (Black 2, most recent gen, canonical) for
 * EVERY menu type in this job, per the task instruction — this
 * supersedes the staged spec's gen3-settings exception (flagged in
 * the PR body, not silently changed). First-boot default is still
 * Mars's decision if he picks otherwise; nothing here claims it.
 *
 * Keys: per-menu + custom reuse the skeleton keys
 * (mochiichao_menu_layout_v1 / mochiichao_menu_layout_custom_v1) so
 * the skeleton editor and this live module read the same record.
 * Global preset is a NEW key: mochiichao_menu_layout_preset_v1.
 * No existing settings key (mochiichao_settings_v1, menuCustom,
 * menuSkins) is read or written by this module.
 *
 * Family-only honesty (staged spec §3.1): a family-only entry has no
 * numeric anchor, so a view adopting it keeps its current numeric
 * spacing and only adopts the arrangement family. Views must not
 * invent numbers to fill the gap.
 */
import { useEffect, useState } from 'react';
import {
  layoutById,
  layoutsFor,
  type MenuType as CatalogueMenuType,
} from './menuLayoutCatalogue';

export type LiveMenuType =
  | 'battle'
  | 'pause'
  | 'bag'
  | 'pc'
  | 'shop'
  | 'save'
  | 'settings';

export type MenuLayoutOverrides = {
  alignment?: 'left' | 'centre' | 'right';
  rowSpacing?: number;
  helpBar?: boolean;
  detailPane?: boolean;
  gridColumns?: number;
  wallpaperRow?: boolean;
  boxHeader?: boolean;
  tabPosition?: 'top' | 'side';
  perPocketCursor?: boolean;
  quantitySelector?: boolean;
};

export const MENU_LAYOUT_KEY = 'mochiichao_menu_layout_v1';
export const MENU_LAYOUT_CUSTOM_KEY = 'mochiichao_menu_layout_custom_v1';
export const MENU_LAYOUT_PRESET_KEY = 'mochiichao_menu_layout_preset_v1';
export const MENU_LAYOUT_CHANGE_EVENT = 'mochiichao-menu-layout-change';

export type MenuLayoutSelection = Partial<Record<string, string>>;
export type MenuLayoutCustom = Partial<Record<string, MenuLayoutOverrides>>;

/** Save entries — from the staged 7-type registry, not the catalogue. */
export interface SaveLayoutEntry {
  id: string;
  gen: 1 | 2 | 3 | 4 | 5;
  arrangement: string;
  placement: string;
  source: string;
}
export const SAVE_LAYOUTS: readonly SaveLayoutEntry[] = [
  { id: 'gen1.save', gen: 1, arrangement: 'start-menu-item', placement: 'start-menu item list', source: 'pokered start menu Save row (registry)' },
  { id: 'gen2.save', gen: 2, arrangement: 'start-menu-item', placement: 'start-menu item list', source: 'pokecrystal start menu (registry)' },
  { id: 'gen3.save', gen: 3, arrangement: 'stats-window-plus-confirm', placement: 'stats window + confirm', source: 'pokefirered-leafgreen sSaveStatsWindowTemplate (1,1,14x9) (registry)' },
  { id: 'gen4.save', gen: 4, arrangement: 'app-plus-confirm', placement: 'app + confirm', source: 'pokeheartgold application/delete_savedata.c pattern (registry)' },
  { id: 'gen5.save', gen: 5, arrangement: 'list-plus-confirm', placement: 'list + confirm', source: 'pokebw2 save-block system, save_control.h (registry)' },
];

export const LIVE_MENU_TYPES: readonly LiveMenuType[] = [
  'battle', 'pause', 'bag', 'pc', 'shop', 'save', 'settings',
];

export function defaultLayoutId(menu: LiveMenuType): string {
  return `gen5.${menu}`;
}

export function layoutOptionsFor(menu: LiveMenuType): Array<{ id: string; gen: number; arrangement: string; placement: string }> {
  if (menu === 'save') {
    return SAVE_LAYOUTS.map((s) => ({ id: s.id, gen: s.gen, arrangement: s.arrangement, placement: s.placement }));
  }
  return layoutsFor(menu as CatalogueMenuType).map((e) => ({
    id: e.id, gen: e.gen, arrangement: e.arrangement, placement: e.placement,
  }));
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function loadSelection(): MenuLayoutSelection {
  return loadJson<MenuLayoutSelection>(MENU_LAYOUT_KEY, {});
}
export function loadCustom(): MenuLayoutCustom {
  return loadJson<MenuLayoutCustom>(MENU_LAYOUT_CUSTOM_KEY, {});
}
export function loadPreset(): number | null {
  try {
    const raw = localStorage.getItem(MENU_LAYOUT_PRESET_KEY);
    if (!raw) return null;
    const n = Number(JSON.parse(raw));
    return n >= 1 && n <= 5 ? n : null;
  } catch {
    return null;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session-only fallback, same pattern as settings: nothing erased.
  }
  try {
    window.dispatchEvent(new Event(MENU_LAYOUT_CHANGE_EVENT));
  } catch {
    // Non-DOM environment: state is still in localStorage.
  }
}

export function setLayoutFor(menu: LiveMenuType, id: string): void {
  const next = { ...loadSelection(), [menu]: id };
  saveJson(MENU_LAYOUT_KEY, next);
}
export function setOverridesFor(menu: LiveMenuType, patch: MenuLayoutOverrides): void {
  const next = { ...loadCustom(), [menu]: { ...(loadCustom()[menu] ?? {}), ...patch } };
  saveJson(MENU_LAYOUT_CUSTOM_KEY, next);
}
export function clearLayoutFor(menu: LiveMenuType): void {
  const sel = { ...loadSelection() };
  delete sel[menu];
  const cust = { ...loadCustom() };
  delete cust[menu];
  saveJson(MENU_LAYOUT_KEY, sel);
  saveJson(MENU_LAYOUT_CUSTOM_KEY, cust);
}
export function clearCustomFor(menu: LiveMenuType): void {
  const cust = { ...loadCustom() };
  delete cust[menu];
  saveJson(MENU_LAYOUT_CUSTOM_KEY, cust);
}
export function setGlobalPreset(gen: number | null): void {
  if (gen === null) {
    try { localStorage.removeItem(MENU_LAYOUT_PRESET_KEY); } catch { /* ignore */ }
    try { window.dispatchEvent(new Event(MENU_LAYOUT_CHANGE_EVENT)); } catch { /* ignore */ }
    return;
  }
  saveJson(MENU_LAYOUT_PRESET_KEY, gen);
}

/** 'centre' (catalogue spelling) -> CSS 'center'; anything else passes through or drops. */
export function cssAlignment(a?: string): 'left' | 'center' | 'right' | undefined {
  if (a === 'centre') return 'center';
  if (a === 'left' || a === 'right') return a;
  return undefined;
}

export interface ResolvedMenuLayout {
  entryId: string;
  gen: 1 | 2 | 3 | 4 | 5;
  arrangement: string;
  placement: string;
  overrides: MenuLayoutOverrides;
  source: 'per-menu' | 'global-preset' | 'gen5-default';
}

export function resolveMenuLayout(
  menu: LiveMenuType,
  selection?: MenuLayoutSelection,
  custom?: MenuLayoutCustom,
  preset?: number | null,
): ResolvedMenuLayout {
  const sel = selection ?? loadSelection();
  const cust = custom ?? loadCustom();
  const pre = preset === undefined ? loadPreset() : preset;
  const overrides = cust[menu] ?? {};
  const wanted = sel[menu];
  if (menu === 'save') {
    const entry = SAVE_LAYOUTS.find((s) => s.id === wanted) ??
      (pre !== null ? SAVE_LAYOUTS.find((s) => s.gen === pre) : undefined) ??
      SAVE_LAYOUTS.find((s) => s.gen === 5)!;
    return {
      entryId: entry.id, gen: entry.gen, arrangement: entry.arrangement,
      placement: entry.placement, overrides,
      source: wanted && SAVE_LAYOUTS.some((s) => s.id === wanted) ? 'per-menu' : pre !== null ? 'global-preset' : 'gen5-default',
    };
  }
  const catalogueEntry = wanted ? layoutById(wanted) : undefined;
  if (catalogueEntry && catalogueEntry.menuType === menu) {
    return { entryId: catalogueEntry.id, gen: catalogueEntry.gen, arrangement: catalogueEntry.arrangement, placement: catalogueEntry.placement, overrides, source: 'per-menu' };
  }
  if (pre !== null) {
    const presetEntry = layoutById(`gen${pre}.${menu}`);
    if (presetEntry) {
      return { entryId: presetEntry.id, gen: presetEntry.gen, arrangement: presetEntry.arrangement, placement: presetEntry.placement, overrides, source: 'global-preset' };
    }
  }
  const fallback = layoutById(defaultLayoutId(menu))!;
  return { entryId: fallback.id, gen: fallback.gen, arrangement: fallback.arrangement, placement: fallback.placement, overrides, source: 'gen5-default' };
}

/** React hook: re-reads on storage events and on in-page saves. */
export function useMenuLayout(menu: LiveMenuType): ResolvedMenuLayout {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener('storage', bump);
    window.addEventListener(MENU_LAYOUT_CHANGE_EVENT, bump);
    return () => {
      window.removeEventListener('storage', bump);
      window.removeEventListener(MENU_LAYOUT_CHANGE_EVENT, bump);
    };
  }, []);
  return resolveMenuLayout(menu);
}
