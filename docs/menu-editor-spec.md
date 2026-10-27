# Menu editor spec — one editor per menu type (STAGED ONLY)

No PR, no merge, no game-tree edits. This spec does NOT touch
any existing settings file. In particular it does not edit
`src/lib/gameSettings.ts` (settings key
`mochiichao_settings_v1`, per-menu panel colour / frame rows),
`src/components/game/SettingsScreen.tsx` (Panel Frame Editor,
Layout Editor path), or `src/lib/menuCustom.ts`. Those editors
already exist on main and keep working unchanged; the editors
below are a NEW, separate layer that only reads and writes the
new keys in §1. The staged skeleton component
(`MenuLayoutEditorSkeleton.tsx` in this folder) is the only
code for these editors, and it is imported nowhere yet.

## 1. Persistence — new keys only

| Key | Shape | Notes |
|---|---|---|
| `mochiichao_menu_layout_v1` | `Record<MenuType, MenuLayoutId>` — a partial record; any menu type absent from the record uses its default (see §2) | Layout choice per menu type. Stored as JSON in localStorage, same session-fallback pattern as settings: if storage is unavailable, the choice lives for the session only and nothing is erased. |
| `mochiichao_menu_layout_custom_v1` | `Record<MenuType, MenuLayoutOverrides>` — partial record; overrides are merged over the chosen catalogue entry, never over another menu type's entry | Per-menu overrides (spacing, alignment, panel position, grid columns where the arrangement allows it). Absent = catalogue entry as-is. |
| `mochiichao_pc_wallpaper_uploads_v1` | `Record<uploadId, { name, mime, dataUrl, width, height, createdAt }>` | Uploaded wallpaper art. Outside settings and outside the save JSON (see wallpaper spec in README §4). |
| `mochiichao_pc_wallpapers_v1` | `Record<boxIndex, wallpaperId>` where wallpaperId is a preset id or `upload:<id>` | Per-box wallpaper assignment. This is the staged assignment record; the PR worker decides whether it lives as its own key or as the additive `pcWallpapers` field on the save record — the two must not both become truth. If it becomes a save field, this key is dropped, not duplicated. |

Defaults (§2): every menu type defaults to its gen5 entry
(`gen5.<menuType>`), because Black 2 is canonical for storage
and the most recent gen on disk — EXCEPT `pc`, which also
defaults to gen5, and `settings`, which defaults to gen3
(label/value rows with help bar, the pattern the existing
options editors already follow). A default is a fallback, not a
pick: the user can change any menu type independently, and
changing one menu type never changes another.

Validation on load: an unknown layout id, an unknown menu
type, or a malformed record falls back to that menu type's
default and leaves the stored record untouched (no silent
rewrite). Unknown override fields are ignored, not applied.

## 2. One editor per menu type

Each editor below is a separate section in Settings (or a
separate screen reached from Settings — the PR worker picks
the container; the spec fixes the fields). Every editor has
the same three blocks: LAYOUT (pick a catalogue entry),
OVERRIDES (the fields in its row), PREVIEW (live preview of
that menu type only, using the current store data where the
menu has data, e.g. the real party list for the party editor).
No editor edits another menu type's fields. No editor edits
fonts, colours, frames, or the locked title default — those
stay in the existing editors.

| Editor (menu type) | LAYOUT choices (catalogue ids) | Override fields (all optional, merged over the entry) | What the PR worker must NOT do |
|---|---|---|---|
| Title editor | gen1.title, gen2.title, gen3.title, gen4.title, gen5.title | panel position (x/y offset), list alignment (left/centre/right), row spacing | Do not touch the locked v32 title default or the logo image. |
| Pause editor | gen1.pause, gen2.pause, gen3.pause, gen4.pause, gen5.pause | list alignment, row spacing, help-bar on/off, right-edge vs centred placement (gen2 right-edge is an entry, not an override) | Do not reorder GameShell's launch rows by inventing an order; the entry's order is the catalogue order. |
| Battle editor | gen1.battle, gen2.battle, gen3.battle, gen4.battle, gen5.battle | action grid position (corner panel / bottom bar / bottom-screen buttons), columns (2 only where the entry is a grid; 1 for lists), row spacing | Do not add party/bag buttons to BattleView as part of a layout swap — those screens do not exist in battle on main, and a layout id cannot create them. |
| Party editor | gen1.party, gen2.party, gen3.party, gen4.party, gen5.party | list alignment, detail pane on/off, row spacing | Do not change party size (6) — that is a party rule, not a layout. |
| Bag editor | gen1.bag, gen2.bag, gen3.bag, gen4.bag, gen5.bag | pocket tab position (top / side), per-pocket cursor on/off (default on for gen3+ entries; turning it on for gen1/gen2 entries is a NEW cursor model, flagged as new behaviour), row spacing | Do not wire source slot maxima (310/83/109/48/64) as limits — see uncappedStorage.ts. |
| PC editor | gen1.pc, gen2.pc, gen3.pc, gen4.pc, gen5.pc | grid columns (only where the entry is a grid; gen3/gen4 fix 5x6 by source, gen5 leaves columns to the renderer), box-name header on/off, wallpaper row on/off, wallpaper picker (preset list + upload button — see README §4) | Do not add Release. Do not cap boxes. Wallpaper assignment is per box (see §1). |
| Shop editor | gen1.shop, gen2.shop, gen3.shop, gen4.shop, gen5.shop | list alignment, quantity selector on/off (default off: main ShopView buys one at a time; turning it on is NEW UI, flagged as new behaviour), row spacing | Do not change prices or the buy/sell/quit order as part of a layout swap. |
| Dex editor | gen1.dex, gen2.dex, gen3.dex, gen4.dex, gen5.dex | list alignment, detail pane on/off, row spacing | Do not invent dex entries; the editor only lays out existing data. |
| Settings editor | gen1.settings, gen2.settings, gen3.settings, gen4.settings, gen5.settings | label/value alignment, help-bar on/off, row spacing | Do not duplicate the existing SettingsScreen rows. This editor changes the SETTINGS menu's own layout only; the settings VALUES stay in the existing editors. |

## 3. How a view adopts a layout (PR worker checklist)

1. The view reads `menuLayoutFor(menuType)` (skeleton helper
   in `MenuLayoutEditorSkeleton.tsx`) and gets an entry + its
   overrides. If the entry is `family-only` (no numeric
   anchor), the view keeps its current numeric spacing and
   only adopts the arrangement family (list vs grid vs corner
   panel vs touch buttons) — it does not invent numbers to
   fill the gap.
2. Dual-screen entries (gen4/gen5 pc, gen4 pause, gen4/gen5
   battle) map to a single web screen as: primary content on
   top / full width, touch menu as a bottom bar. The mapping
   is documented in the view's patch header, not hidden.
3. A layout swap is outcome-identical in data: it never
   changes what actions exist, what they cost, or what they
   save. Any patch that adds an action, a quantity selector,
   a per-pocket cursor, or Release must flag that as NEW
   BEHAVIOUR in its patch header, as the staged patches in
   this folder do.
4. SettingsScreen, gameSettings.ts, and menuCustom.ts are not
   edited by layout adoption. If a future worker finds that
   impossible, that is a blocker to report, not a licence to
   edit them silently.

## 4. Unfilled editor questions (not invented)

- Exact button rects for gen4/gen5 bottom-screen touch
  battle menus: not extracted in this pass. The battle editor
  therefore offers the touch-2x2 family with the view's
  current button sizing until rects are extracted.
- Exact tile origins for gen1 pause, gen1/gen3/gen4/gen5
  title, and most dex/shop lists: not extracted. Those
  editors offer family + alignment/spacing only.
- Whether the PC editor's wallpaper picker lives inside the
  PC view or inside Settings: the staged PcViewWallpaper.patch
  puts a wallpaper row in PcView (the box it affects is
  visible there); the Settings-side picker is the same picker
  reached from the PC editor row. The PR worker must pick one
  entry point as primary and link the other, not ship two
  divergent pickers.
