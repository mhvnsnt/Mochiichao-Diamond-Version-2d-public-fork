/**
 * Menu layout catalogue — STAGED ONLY, imported nowhere yet.
 * No PR, no merge, no game-tree edits. Base: current main at
 * 7f116702 (2026-10-27), read via the GitHub API helper.
 *
 * Mars decision 2026-10-27 ~07:46 CDT: do NOT pick one layout.
 * Every generation layout on disk is a swappable entry here, and
 * the settings editor spec (menuEditorSpec.md in this folder)
 * gives one editor per menu type. A view that adopts this
 * catalogue reads `menuLayoutFor(menuType)` and renders that
 * entry's `arrangement`; it never hard-codes a single gen.
 *
 * What "verified" means in this file:
 * - `geometry: 'verified'` — a numeric anchor was read from a
 *   decomp source file in this pass (tile/window coords, row
 *   step, row/column counts). The anchor is in `source`.
 * - `geometry: 'family-only'` — the arrangement family (list,
 *   grid, corner panel, dual-screen, touch page) is supported
 *   by the cited source file, but no numeric anchor was
 *   extracted in this pass. The entry is still swappable by
 *   family + its `notes`; exact numbers are NOT claimed.
 * Nothing in this file is copied text from a source game: item
 * labels are described by role only, never quoted.
 *
 * Gens present on disk for this pass (decomp directories):
 * gen1 = pokered / pokeyellow, gen2 = pokegold / pokecrystal,
 * gen3 = pokeruby / pokeemerald / pokefirered-leafgreen,
 * gen4 = pokediamond / pokeplatinum / pokeheartgold,
 * gen5 = pokebw2. "Gen" is used instead of a title wherever a
 * title would add nothing the directory path does not already
 * carry in `source`.
 */

export type MenuType =
  | 'title'
  | 'pause'
  | 'battle'
  | 'party'
  | 'bag'
  | 'pc'
  | 'shop'
  | 'dex'
  | 'settings';

export type Arrangement =
  | 'single-column-list'
  | 'two-column-list'
  | 'grid-2x2'
  | 'grid-5x6'
  | 'grid-3x5'
  | 'corner-panel-2x2'
  | 'bottom-screen-touch-2x2'
  | 'dual-screen-grid-plus-touch-menu'
  | 'paged-4-per-page'
  | 'full-screen-list-with-detail'
  | 'full-screen-grid';

export type GeometryEvidence = 'verified' | 'family-only';

export interface MenuLayoutEntry {
  /** Stable id a settings row stores, e.g. `gen3.battle`. */
  id: string;
  gen: 1 | 2 | 3 | 4 | 5;
  menuType: MenuType;
  arrangement: Arrangement;
  /** Rows x columns where the source fixes them, else null. */
  rows: number | null;
  columns: number | null;
  /** Screen placement in plain words (no invented pixels). */
  placement: string;
  geometry: GeometryEvidence;
  /** Decomp file(s) read, relative to the decomp root. */
  source: string[];
  /** Numeric anchor or structural fact actually read, if any. */
  anchor: string | null;
  notes: string;
}

export const MENU_TYPES: readonly MenuType[] = [
  'title',
  'pause',
  'battle',
  'party',
  'bag',
  'pc',
  'shop',
  'dex',
  'settings',
];

export const MENU_LAYOUT_CATALOGUE: readonly MenuLayoutEntry[] = [
  // ---- Gen 1 ------------------------------------------------
  { id: 'gen1.title', gen: 1, menuType: 'title', arrangement: 'full-screen-list-with-detail', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokered/engine/menus/main_menu.asm'], anchor: null, notes: 'Title / main-menu list. Exact tile origin not extracted in this pass.' },
  { id: 'gen1.pause', gen: 1, menuType: 'pause', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'field menu, single-column list', geometry: 'family-only', source: ['pokered/engine/menus/draw_start_menu.asm'], anchor: null, notes: 'Field (start) menu list. Exact tile origin not extracted in this pass.' },
  { id: 'gen1.battle', gen: 1, menuType: 'battle', arrangement: 'corner-panel-2x2', rows: 2, columns: 2, placement: 'bottom-right corner panel', geometry: 'verified', source: ['pokered/data/text_boxes.asm', 'pokered/engine/battle/core.asm'], anchor: 'Battle menu text box tiles x8 y12 to x19 y17; input code branches on a left-column / right-column cursor.', notes: 'The corner-panel archetype: a small 2x2 panel anchored to the bottom-right, not a full-width bar.' },
  { id: 'gen1.party', gen: 1, menuType: 'party', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with per-member detail', geometry: 'family-only', source: ['pokered/engine/menus/party_menu.asm'], anchor: null, notes: 'Party list. Row geometry not extracted in this pass.' },
  { id: 'gen1.bag', gen: 1, menuType: 'bag', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column item list', geometry: 'family-only', source: ['pokered/engine/menus/start_sub_menus.asm'], anchor: null, notes: 'Gen 1 bag is one flat list (no pockets yet in this gen). Pocket structure arrives in later gens; see gen5.bag.' },
  { id: 'gen1.pc', gen: 1, menuType: 'pc', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column storage list', geometry: 'family-only', source: ['pokered/engine/menus/pc.asm', 'pokered/engine/menus/players_pc.asm', 'pokered/engine/menus/league_pc.asm'], anchor: null, notes: 'Gen 1 storage is a list system, not a box grid, and has no wallpaper concept. Wallpaper presets start at gen3 (see wallpaperCatalogue.ts).' },
  { id: 'gen1.shop', gen: 1, menuType: 'shop', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column buy/sell list', geometry: 'family-only', source: ['pokered/engine/menus/start_sub_menus.asm'], anchor: null, notes: 'Shop list. Geometry not extracted in this pass.' },
  { id: 'gen1.dex', gen: 1, menuType: 'dex', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with detail pane', geometry: 'family-only', source: ['pokered/engine/menus/pokedex.asm'], anchor: null, notes: 'Dex list. Geometry not extracted in this pass.' },
  { id: 'gen1.settings', gen: 1, menuType: 'settings', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, label-left / value-right rows', geometry: 'family-only', source: ['pokered/engine/menus/main_menu.asm'], anchor: null, notes: 'Options list. This is the ancestor of the label/value row pattern reused by gen3 options.' },
  // ---- Gen 2 ------------------------------------------------
  { id: 'gen2.title', gen: 2, menuType: 'title', arrangement: 'full-screen-list-with-detail', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokecrystal/engine/menus/main_menu.asm'], anchor: null, notes: 'Title / main-menu list. Exact tile origin not extracted in this pass.' },
  { id: 'gen2.pause', gen: 2, menuType: 'pause', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'right-side full-height list', geometry: 'verified', source: ['pokecrystal/engine/menus/start_menu.asm'], anchor: 'Menu coords x10 y0 to screen-width-1, screen-height-1 (contest variant y2 instead of y0).', notes: 'The right-edge list archetype: the pause menu hugs the right side at full height, unlike the gen1/gen3 centred boxes.' },
  { id: 'gen2.battle', gen: 2, menuType: 'battle', arrangement: 'corner-panel-2x2', rows: 2, columns: 2, placement: 'bottom-right corner panel', geometry: 'verified', source: ['pokecrystal/engine/battle/menu.asm'], anchor: 'Menu coords x8 y12 to screen-width-1, screen-height-1; menu data 2 rows, 2 columns, spacing 6.', notes: 'Same corner-panel family as gen1, with an explicit 2x2 data table in source.' },
  { id: 'gen2.party', gen: 2, menuType: 'party', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokecrystal/engine/menus/start_menu.asm'], anchor: null, notes: 'Party list. Geometry not extracted in this pass.' },
  { id: 'gen2.bag', gen: 2, menuType: 'bag', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with pocket grouping', geometry: 'family-only', source: ['pokecrystal/engine/menus/start_menu.asm'], anchor: null, notes: 'Bag list with pocket grouping. Pocket ids are not catalogued here; see gen5.bag for the canonical pocket set.' },
  { id: 'gen2.pc', gen: 2, menuType: 'pc', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column storage list', geometry: 'family-only', source: ['pokecrystal/engine/menus/start_menu.asm'], anchor: null, notes: 'Gen 2 storage is still a list system. The box grid arrives in gen3.' },
  { id: 'gen2.shop', gen: 2, menuType: 'shop', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column buy/sell list', geometry: 'family-only', source: ['pokecrystal/engine/menus/start_menu.asm'], anchor: null, notes: 'Shop list. Geometry not extracted in this pass.' },
  { id: 'gen2.dex', gen: 2, menuType: 'dex', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with detail pane', geometry: 'family-only', source: ['pokecrystal/engine/menus/main_menu.asm'], anchor: null, notes: 'Dex list. Geometry not extracted in this pass.' },
  { id: 'gen2.settings', gen: 2, menuType: 'settings', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, label-left / value-right rows', geometry: 'family-only', source: ['pokecrystal/engine/menus/options_menu.asm'], anchor: null, notes: 'Options list. Geometry not extracted in this pass.' },
  // ---- Gen 3 ------------------------------------------------
  { id: 'gen3.title', gen: 3, menuType: 'title', arrangement: 'full-screen-list-with-detail', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokefirered-leafgreen/src/main_menu.c'], anchor: null, notes: 'Title / main-menu list. Geometry not extracted in this pass.' },
  { id: 'gen3.pause', gen: 3, menuType: 'pause', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'field menu, single-column list with help bar', geometry: 'verified', source: ['pokefirered-leafgreen/src/start_menu.c'], anchor: 'Item text x offset 8, row step 15 (text y = index * 15); cursor step 15; help bar below the list.', notes: 'The list-plus-help-bar archetype: the selected entry shows its help text in a bar, which current main MenuList already mirrors as MenuHelpLine.' },
  { id: 'gen3.battle', gen: 3, menuType: 'battle', arrangement: 'grid-2x2', rows: 2, columns: 2, placement: 'bottom action window, 2x2 grid', geometry: 'family-only', source: ['pokefirered-leafgreen/src/battle_controller_player.c', 'pokefirered-leafgreen/src/battle_message.c'], anchor: 'Action menu rendered into the action window; layout is two columns by two rows by construction. No label text is reproduced here.', notes: 'Family verified, exact window tile coords not extracted in this pass — marked family-only, not verified.' },
  { id: 'gen3.party', gen: 3, menuType: 'party', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with per-member detail', geometry: 'family-only', source: ['pokefirered-leafgreen/src/party_menu.c'], anchor: null, notes: 'Party list. Geometry not extracted in this pass.' },
  { id: 'gen3.bag', gen: 3, menuType: 'bag', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, pocket tabs across the top, per-pocket cursor', geometry: 'verified', source: ['pokefirered-leafgreen/include/item_menu.h'], anchor: 'Per-pocket cursor/scroll arrays (one cursor position kept per pocket, not one flat cursor).', notes: 'Per-pocket cursor is the gen3 bag invention current main BagView does NOT have (one flat selected index) — adopting this layout needs that cursor model, flagged in the spec.' },
  { id: 'gen3.pc', gen: 3, menuType: 'pc', arrangement: 'grid-5x6', rows: 5, columns: 6, placement: 'full screen, box grid with box-name header', geometry: 'verified', source: ['pokefirered-leafgreen/include/pokemon_storage_system.h'], anchor: '14 boxes; 5 rows x 6 columns = 30 slots per box; box name length 8.', notes: 'The box-grid archetype. Current main PcView already renders 5-per-row wrapping of the same 30-slot box, so this layout is the closest source match to live main.' },
  { id: 'gen3.shop', gen: 3, menuType: 'shop', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, menu / buy-list / how-many / confirm flow', geometry: 'family-only', source: ['pokefirered-leafgreen/src/shop.c'], anchor: null, notes: 'Shop flow order (menu, list, quantity, confirm) is the source flow; current main ShopView has buy/sell confirm but no quantity selector — that step is new UI, not a layout swap.' },
  { id: 'gen3.dex', gen: 3, menuType: 'dex', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with detail pane', geometry: 'family-only', source: ['pokefirered-leafgreen/src/pokedex.c'], anchor: null, notes: 'Dex list. Geometry not extracted in this pass.' },
  { id: 'gen3.settings', gen: 3, menuType: 'settings', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, header window + list window + help bar, label-left / value-right', geometry: 'family-only', source: ['pokefirered-leafgreen/src/option_menu.c'], anchor: null, notes: 'Options pattern already cited by the prior menu-editor work on main: header, list, help bar, UP/DOWN wrap, LEFT/RIGHT cycle.' },
  // ---- Gen 4 ------------------------------------------------
  { id: 'gen4.title', gen: 4, menuType: 'title', arrangement: 'full-screen-list-with-detail', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokeheartgold/src/title.c'], anchor: null, notes: 'Title / main-menu list. Geometry not extracted in this pass.' },
  { id: 'gen4.pause', gen: 4, menuType: 'pause', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'bottom-screen list (dual-screen: field on top, menu below)', geometry: 'family-only', source: ['pokeheartgold/src/field_menu.c'], anchor: null, notes: 'Dual-screen split: the pause menu lives on the lower screen while the field stays on the upper screen. On a single web screen this maps to a bottom sheet / lower panel, not a full-screen takeover.' },
  { id: 'gen4.battle', gen: 4, menuType: 'battle', arrangement: 'bottom-screen-touch-2x2', rows: 2, columns: 2, placement: 'bottom screen, four large touch buttons in a 2x2 grid', geometry: 'family-only', source: ['pokeheartgold/src/battle/battle_controller.c', 'pokediamond/src/battle.c'], anchor: null, notes: 'Touch-button archetype: battle actions are large tappable buttons, not a cursor list. Exact button rects not extracted in this pass.' },
  { id: 'gen4.party', gen: 4, menuType: 'party', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'bottom-screen list with per-member touch rows', geometry: 'family-only', source: ['pokeheartgold/src/party_select_list.c'], anchor: null, notes: 'Party list with preview pane. Geometry not extracted in this pass.' },
  { id: 'gen4.bag', gen: 4, menuType: 'bag', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'bottom-screen list, pocket tabs, per-pocket cursor', geometry: 'verified', source: ['pokeheartgold/include/bag.h', 'pokeheartgold/include/bag_cursor.h', 'pokeheartgold/include/bag_view.h'], anchor: 'BagView is created with a subset of pockets; per-pocket cursor state is a named struct (cursor + view), not a flat index.', notes: 'Per-pocket cursor, as in gen3, with an explicit view/cursor split.' },
  { id: 'gen4.pc', gen: 4, menuType: 'pc', arrangement: 'dual-screen-grid-plus-touch-menu', rows: 5, columns: 6, placement: 'upper screen: box grid; lower screen: touch menu', geometry: 'verified', source: ['pokeheartgold/include/constants/pokemon.h', 'pokeheartgold/include/pokemon_storage_system.h', 'pokeplatinum/include/pc_boxes.h'], anchor: '18 boxes x 30 slots; Platinum header fixes the grid at 5 rows x columns totalling 30; box name length 20 (gen4) vs 8 (gen3).', notes: 'Dual-screen box archetype. On a single web screen this maps to grid on top + menu bar below, which current main PcView already approximates (grid + party column).' },
  { id: 'gen4.shop', gen: 4, menuType: 'shop', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, menu / buy-list / how-many / confirm flow', geometry: 'family-only', source: ['pokeheartgold/src/shop.c'], anchor: null, notes: 'Shop flow as gen3. Geometry not extracted in this pass.' },
  { id: 'gen4.dex', gen: 4, menuType: 'dex', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with detail pane', geometry: 'family-only', source: ['pokeheartgold/src/pokedex.c'], anchor: null, notes: 'Dex list. Geometry not extracted in this pass.' },
  { id: 'gen4.settings', gen: 4, menuType: 'settings', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, label-left / value-right rows', geometry: 'family-only', source: ['pokeheartgold/src/options.c'], anchor: null, notes: 'Options list. Geometry not extracted in this pass.' },
  // ---- Gen 5 (canonical for storage; see uncappedStorage.ts) --
  { id: 'gen5.title', gen: 5, menuType: 'title', arrangement: 'full-screen-list-with-detail', rows: null, columns: 1, placement: 'full screen, single-column list', geometry: 'family-only', source: ['pokebw2/src/title.c'], anchor: null, notes: 'Title / main-menu list. Geometry not extracted in this pass.' },
  { id: 'gen5.pause', gen: 5, menuType: 'pause', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'bottom-screen app-launcher list (field menu picks an app)', geometry: 'verified', source: ['pokebw2/src/ov012/event_field_menu.c'], anchor: 'Field menu selection is mapped to an app id and launched as an app event; menu items are app entries, not inline actions.', notes: 'App-launcher archetype: the pause menu is a launcher, which is why current main GameShell routes to views. A gen5 pause layout therefore renders as a list of view-launch rows.' },
  { id: 'gen5.battle', gen: 5, menuType: 'battle', arrangement: 'bottom-screen-touch-2x2', rows: 2, columns: 2, placement: 'bottom screen, four large touch buttons in a 2x2 grid', geometry: 'family-only', source: ['pokebw2/src/ov286/b_bag_anm.c', 'pokebw2/src/battle/battle_main.c'], anchor: null, notes: 'Touch-button archetype as gen4. Exact button rects not extracted in this pass. Battle bag animation/button code is the cited touch-button evidence, not a rect table.' },
  { id: 'gen5.party', gen: 5, menuType: 'party', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'bottom-screen list with preview window', geometry: 'family-only', source: ['pokebw2/src/ov036/party_select_list.c'], anchor: null, notes: 'Party list with preview window and icon resources. Geometry not extracted in this pass.' },
  { id: 'gen5.bag', gen: 5, menuType: 'bag', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, pocket tabs, per-pocket scroll + row cursor, plus a Free Space view', geometry: 'verified', source: ['pokebw2/include/constants/bag.h', 'pokebw2/include/save/bag.h'], anchor: 'Pockets in order: items, medicine, move-machines, berries, key items, plus Free Space (index 5) and a none sentinel (6); cursor keeps one scroll + row per pocket; battle bag uses 4 pockets.', notes: 'Canonical pocket set for the uncapped module. Source slot maxima (items 310, key 83, move-machines 109, medicine 48, berries 64) are SOURCE caps only — the uncapped module in this folder sets every effective maximum to null.' },
  { id: 'gen5.pc', gen: 5, menuType: 'pc', arrangement: 'dual-screen-grid-plus-touch-menu', rows: null, columns: null, placement: 'upper screen: box grid; lower screen: touch menu incl. wallpaper menu', geometry: 'verified', source: ['pokebw2/include/save/box.h', 'pokebw2/src/system/box_savedata.c', 'pokebw2/src/ov255/box2_seq.c', 'pokebw2/src/ov255/box2_main.c'], anchor: '30 slots per box; boxes open 8, then +8 to 24 in source; wallpaper menu picks a theme then a wallpaper, paged 4 per page (position = slot + (page - 1) * 4).', notes: 'Canonical box shape for the uncapped module, with the box-count cap (24) and the 8-at-a-time unlock REMOVED by Mars decision — see uncappedStorage.ts. Rows/columns for the gen5 grid are left null: the source fixes 30 slots, not a row count, in the files read.' },
  { id: 'gen5.shop', gen: 5, menuType: 'shop', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, menu / buy-list / how-many / confirm flow', geometry: 'family-only', source: ['pokebw2/src/shop.c'], anchor: null, notes: 'Shop flow as gen3/gen4. Geometry not extracted in this pass.' },
  { id: 'gen5.dex', gen: 5, menuType: 'dex', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, single-column list with detail pane', geometry: 'family-only', source: ['pokebw2/src/pokedex.c'], anchor: null, notes: 'Dex list. Geometry not extracted in this pass.' },
  { id: 'gen5.settings', gen: 5, menuType: 'settings', arrangement: 'single-column-list', rows: null, columns: 1, placement: 'full screen, label-left / value-right rows', geometry: 'family-only', source: ['pokebw2/src/options.c'], anchor: null, notes: 'Options list. Geometry not extracted in this pass.' },
];

/** Entries for one menu type, in gen order. */
export function layoutsFor(menuType: MenuType): MenuLayoutEntry[] {
  return MENU_LAYOUT_CATALOGUE.filter((e) => e.menuType === menuType);
}

/** One entry by id, or undefined. No fallback invention: callers decide. */
export function layoutById(id: string): MenuLayoutEntry | undefined {
  return MENU_LAYOUT_CATALOGUE.find((e) => e.id === id);
}

/** Counts used by the README. Verified = numeric anchor present. */
export const MENU_LAYOUT_COUNTS = {
  totalEntries: MENU_LAYOUT_CATALOGUE.length,
  gens: 5,
  menuTypes: MENU_TYPES.length,
  verifiedGeometry: MENU_LAYOUT_CATALOGUE.filter((e) => e.geometry === 'verified').length,
  familyOnly: MENU_LAYOUT_CATALOGUE.filter((e) => e.geometry === 'family-only').length,
} as const;
