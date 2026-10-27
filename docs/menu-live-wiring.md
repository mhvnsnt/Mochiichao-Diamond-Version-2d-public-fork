# Menu live wiring — staged report (PR worker: update with PR number/merge SHA)

Base: main 977bbb357d89a75004efe0de91d3827c14787672 (re-verified via GitHub API).
Catalogue: src/lib/menuLayoutCatalogue.ts on main (PR #314, 45 entries = 5 gens x 9 types),
SHA b95b2981855f30a11abaccde8b5ee71cd1c87e2c, unchanged by this PR.

## What this PR does
The catalogue was 45/45 selectable by id but 0 views read it. This PR wires it live:
- NEW src/lib/menuLayoutLive.ts — global preset (mochiichao_menu_layout_preset_v1) +
  per-menu override (mochiichao_menu_layout_v1, shared with the skeleton) + custom
  overrides (mochiichao_menu_layout_custom_v1). Precedence: per-menu > global > gen5.
  Default is gen5 for EVERY menu type, per the task instruction. This supersedes the
  staged spec's gen3-settings exception — flagged, not silently changed. First-boot
  default remains Mars's decision if he picks otherwise.
- NEW src/components/game/MenuLayoutLiveEditors.tsx — 7 editors in a new additive
  section on the SETTINGS screen: battle, pause, bag, pc, shop, save, settings.
  Each has layout select (5 gens), alignment, row spacing, help-bar toggle, the
  fields that apply to that type, live preview on dummy data, reset-to-gen5-default
  and delete-custom-overrides. No existing settings row/value/preset/editor is edited.
- Views wired (7/7 in the task list):
  - BattleView: corner-panel anchors right, touch-2x2 gets taller buttons, grid-2x2 unchanged.
    HUD move-layout setting still decides buttons inside the container.
  - GameShell PauseMenu: gen2 right-edge, gen4 bottom sheet, others centred; help bar
    + row spacing from overrides; MenuList gains an optional gapPx (default 15, unchanged).
  - BagView: gen1.bag renders a flat list (no pockets in that gen); side pocket tabs
    (one pocket at a time) when the editor sets tabPosition=side; per-pocket cursor
    (default on gen3+, flagged new cursor model on gen1/gen2).
  - PcView: gen1/gen2 PC renders as a list, gen3+ as a grid; grid-columns override;
    box-header and wallpaper-row toggles.
  - ShopView: alignment + row spacing from overrides (all gens are single-column lists,
    so no arrangement-family change is visible here — stated, not inflated).
  - SaveMenu: gen3.save adds a stats window (party size + map + save count, all already
    in state); gen4.save uses larger confirm buttons; alignment from overrides.
  - SettingsScreen: editors section on the SETTINGS screen; rows container takes
    alignment + row spacing from overrides; root carries data-menu-layout.
- Save layouts (5) come from the staged 7-type registry, NOT the catalogue, because
  the catalogue has no save type. No save pattern is invented: gen1/gen2 start-menu-item,
  gen3 stats-window-plus-confirm, gen4 app-plus-confirm, gen5 list-plus-confirm.

## Counts (honest)
- Views wired: 7/7 in the task list (BattleView, GameShell pause, BagView, PcView,
  ShopView, SaveMenu, SettingsScreen).
- Editors built: 7/7 (battle, pause, bag, pc, shop, save, settings).
- Layouts live-swappable: 35/45 — the 7 wired menu types x 5 gens. NOT live: title (5)
  — the locked title default is never touched by this PR — and party (5) + dex (5),
  whose views (RosterView, DexView) are outside this task's view list and were not
  changed. The catalogue itself is untouched, so 45/45 remain selectable by id.
- Title/logo/studio files touched: 0. File deletions: 0.

## NOT live in this PR (flagged, not hidden)
- Shop quantity selector: stored by the editor, not rendered — it is new UI, not a
  layout swap.
- Family-only entries (34/45 in the catalogue): views keep current numeric spacing
  and only adopt the arrangement family, per the staged spec.
- Per-pocket cursor in BagView's grouped (top) mode is restored via a "cursor" button
  on the pocket heading; side-tab mode restores it on tab switch.
- Settings rows themselves still follow the existing Menu Creator settings; this PR
  only adds the layout editors section and alignment/spacing overrides to the rows
  container.
