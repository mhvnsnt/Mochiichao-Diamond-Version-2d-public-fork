/**
 * Menu layout editor — SKELETON ONLY, staged, imported nowhere.
 * No PR, no merge, no game-tree edits. This file does not touch
 * src/lib/gameSettings.ts, SettingsScreen, or menuCustom.ts.
 * It reads/writes ONLY the new keys from menuEditorSpec.md §1.
 *
 * A PR worker copies this file into the tree (as a new file,
 * not an edit to an existing settings file), wires it into
 * Settings as a new section, and replaces the skeleton preview
 * (a labelled box naming the chosen entry) with a live preview
 * of the menu type being edited. Until then it renders nothing
 * in the game: it is not imported by any view.
 */
import React, { useState } from 'react';
import {
  MENU_TYPES,
  layoutsFor,
  layoutById,
  type MenuType,
  type MenuLayoutEntry,
} from '../../lib/menuLayoutCatalogue';

export const MENU_LAYOUT_KEY = 'mochiichao_menu_layout_v1';
export const MENU_LAYOUT_CUSTOM_KEY = 'mochiichao_menu_layout_custom_v1';

export type MenuLayoutOverrides = {
  alignment?: 'left' | 'centre' | 'right';
  rowSpacing?: number;
  helpBar?: boolean;
  detailPane?: boolean;
  gridColumns?: number;
  wallpaperRow?: boolean;
};

export type MenuLayoutSelection = Partial<Record<MenuType, string>>;
export type MenuLayoutCustom = Partial<Record<MenuType, MenuLayoutOverrides>>;

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Session-only fallback, same pattern as settings: nothing erased.
  }
}

/** Default layout id per menu type (spec §1: gen5, except settings -> gen3). */
export function defaultLayoutId(menuType: MenuType): string {
  return menuType === 'settings' ? 'gen3.settings' : `gen5.${menuType}`;
}

/** Stored choice for one menu type, validated against the catalogue. */
export function menuLayoutFor(
  menuType: MenuType,
  selection?: MenuLayoutSelection,
  custom?: MenuLayoutCustom,
): { entry: MenuLayoutEntry; overrides: MenuLayoutOverrides } {
  const sel = selection ?? loadJson<MenuLayoutSelection>(MENU_LAYOUT_KEY, {});
  const cust = custom ?? loadJson<MenuLayoutCustom>(MENU_LAYOUT_CUSTOM_KEY, {});
  const wanted = sel[menuType];
  const entry =
    (wanted ? layoutById(wanted) : undefined) ??
    layoutById(defaultLayoutId(menuType))!;
  return { entry, overrides: cust[menuType] ?? {} };
}

/**
 * Skeleton editor: one section per menu type, each with a
 * layout <select> and the override fields from the spec.
 * Preview is a labelled box only — the PR worker replaces it
 * with a live preview of that menu type. No existing settings
 * component is imported or rendered here.
 */
export default function MenuLayoutEditorSkeleton() {
  const [menuType, setMenuType] = useState<MenuType>('pc');
  const [selection, setSelection] = useState<MenuLayoutSelection>(() =>
    loadJson<MenuLayoutSelection>(MENU_LAYOUT_KEY, {}),
  );
  const [custom, setCustom] = useState<MenuLayoutCustom>(() =>
    loadJson<MenuLayoutCustom>(MENU_LAYOUT_CUSTOM_KEY, {}),
  );
  const { entry, overrides } = menuLayoutFor(menuType, selection, custom);

  const pick = (id: string) => {
    const next = { ...selection, [menuType]: id };
    setSelection(next);
    saveJson(MENU_LAYOUT_KEY, next);
  };
  const setOverride = (patch: MenuLayoutOverrides) => {
    const next = { ...custom, [menuType]: { ...(custom[menuType] ?? {}), ...patch } };
    setCustom(next);
    saveJson(MENU_LAYOUT_CUSTOM_KEY, next);
  };

  return (
    <div>
      <h2>Menu Layout Editor (staged skeleton — not wired into Settings yet)</h2>
      <label>
        Menu type{' '}
        <select value={menuType} onChange={(e) => setMenuType(e.target.value as MenuType)}>
          {MENU_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        Layout{' '}
        <select value={entry.id} onChange={(e) => pick(e.target.value)}>
          {layoutsFor(menuType).map((l) => (
            <option key={l.id} value={l.id}>
              {l.id} — {l.arrangement} ({l.geometry})
            </option>
          ))}
        </select>
      </label>
      <label>
        Alignment{' '}
        <select
          value={overrides.alignment ?? ''}
          onChange={(e) => setOverride({ alignment: (e.target.value || undefined) as MenuLayoutOverrides['alignment'] })}
        >
          <option value="">Catalogue default</option>
          <option value="left">Left</option>
          <option value="centre">Centre</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label>
        Help bar{' '}
        <input
          type="checkbox"
          checked={overrides.helpBar ?? false}
          onChange={(e) => setOverride({ helpBar: e.target.checked })}
        />
      </label>
      <div>
        Preview (skeleton): {entry.id} — {entry.arrangement}, {entry.placement}.
        Geometry evidence: {entry.geometry}.
      </div>
    </div>
  );
}
