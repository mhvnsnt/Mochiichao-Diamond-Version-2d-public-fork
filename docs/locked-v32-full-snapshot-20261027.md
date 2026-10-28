# Locked v32 FULL SNAPSHOT preset — Item 4 (2026-10-27)

A persisted, loadable preset that restores ALL of the locked main menu
plus its surrounding settings in ONE Settings row, with a real
change-away path. This closes the gap named in
`src/lib/lockedV32Menu.ts` ("selecting a preset from Settings does not
yet swap this object") for the main menu. The Menu Editor from
PR #260 has since MERGED onto main (see reconciliation below); this
PR composes with it rather than replacing it: the render path is the
editor's `menuCfg`, and restore clears the editor working preset so
that path returns the locked default.

## The true-restore definition, and how this PR meets it

| Definition part | This PR |
|---|---|
| Persisted, loadable preset (data the game loads) | `src/lib/lockedV32Snapshot.ts`: full snapshot JSON under localStorage key `mochiichao_locked_v32_snapshot_active_v1`, built LIVE from `LOCKED_V32_MENU` + `DEFAULT_SETTINGS` + `DEFAULT_MENU_CUSTOM` + `LOCKED_PRESET` — never a stale copy. |
| Restores layout, colours, fonts, logo, cloud, panels, background layers, symbol animation | 19 dimensions (list below), all in the snapshot's `menu` + `settings` + `custom` + `preset` blocks + the editor-working clear. |
| Selectable in Settings via a RESTORE LOCKED V32 row | `SettingsScreen`: `RESTORE LOCKED V32` on the main Settings screen + `RESTORE LOCKED V32 (SNAPSHOT)` on Menu Creator page 4, next to the old RESET row. |
| Real change-away path (change away, restore again) | Edit any row + save, OR save a Menu Editor working preset → `isLockedV32SnapshotActive()` returns false (live stores no longer equal the snapshot, or a working preset is present) and the row value flips from `LOCKED v32 ACTIVE` back to `RESTORE ►`. Selecting the row again re-restores. Verified headless (see below). |
| One click, not draft-then-save | `restoreLockedV32Snapshot()` persists the snapshot + settings + custom + preset stores + clears title pick + speed override + editor working preset in the same call; the row mirrors the same values into zustand state, so it shows ACTIVE immediately. No second SAVE step. |
| Locked default never overwritten; logo PNG never replaced with font text | The snapshot module only READS `LOCKED_V32_MENU`; `lockedV32Menu.ts` is untouched. Logo stays the v32-matched PNG (`mochiichao-main-logo-v32-matched.png`); cloud stays the original `puffy-cloud.svg`. |
| The game actually reads it on restore | On current main, `IntroSequence` MAIN_MENU + `MainMenuBackground` render `menuCfg = getActiveMenuConfig()` (editor working if saved, else locked). Restore clears the working preset, so that path returns the locked default exactly and the menu renders locked values on return (remount on phase change — the same live-on-return pattern as every other Settings row). This PR deliberately does NOT re-route Intro/MMB to read the snapshot JSON instead: that would fight the editor, whose edited values must survive until a restore. The snapshot JSON is the persisted preset record + the row's active-state source; `getActiveV32Menu()` is its loadable accessor, verified deep-equal to `LOCKED_V32_MENU`. |

## The 19 restored dimensions (19/19 = 100% of the snapshot)

1. Canvas 1200x1500, centre 600. 2. Logo image v32-matched PNG,
   x150 y180 w900 (never font text). 3. Cloud original puffy-cloud.svg,
   frame x250 y648 w700 h180, centre 600,738, bob 6px/5s, rendered
   imgBox 224,599,825x264 (PR #233's calibrated frame, recalibrated
   on main since).
   4. Mochii cue x170 y790 w110 h110, bob 8px/4.5s. 5. Panels CONTINUE
   (300,788, 600x110, #ff96c8, size 35, margin 27, spacing 0.10),
   NEW GAME (300,918, 600x70, #ffe696, 26, 33, 0.14), SETTINGS
   (300,1008, 600x70, #8cd2ff, 35, 29, -0.07), BACK TO TITLE (300,1098,
   600x70, #a0e6b4, 31, 33, 0). 6. Panel label font Trebuchet MS stack,
   weight 800, stroke labels CONTINUE + SETTINGS, sublabel size 26,
   margin 30, lineHeight 1.15. 7. Panel style radius 28, border 3.
   8. Background paper #ffffff. 9. Rainbow arcs centre 600,454, radii
   325/353/381/411/437, colours, stroke 5, plus the logo emblem layer.
   10. Orbits blue 515x265 + pink 475x230, rotate 0. 11. Phi fade gone
   620 / mid 729 / full 905. 12. Symbol animation locked speed:
   slow-rise default (vy 8-14, sway 3-8, rotate ±4, period 4-6s;
   perfect 157.14 px/s, sway 6, bob 4, loop 5.6s, 2 cycles kept as
   the option). 13. Symbol field: FORMULA v2, 300 entries.
   14. Game settings: every
   `DEFAULT_SETTINGS` field (text/battle/sound/button/frame, all 6
   font rows, cursor, HUD, panel, per-menu). 15. Menu custom: every
   `DEFAULT_MENU_CUSTOM` field. 16. Preset fields: logoImage/size,
   radius, border, white/gloss/glow/gradient, panelColor, symbolCount,
   cursorSize, layout. 17. Title start-screen pick cleared (null =
   locked default). 18. Animation-speed override cleared (locked
   speed applies, not a stale override). 19. Menu Editor working
   preset cleared (menuCfg returns locked; the editor library of
   saved named templates is kept).

## PR #260 reconciliation — VERDICT: MERGED, BUT STILL FALLS SHORT of this definition

UPDATE (base main f5fa59a4): PR #260 (`feature/menu-editor-20261026`)
has MERGED onto main since this item was scoped — `src/lib/menuEditor.ts`
is now on main (blob 242620cb7fc7d92032465554cae6a95fadc6cf30,
22,021 bytes), `MenuEditorScreen` is wired into `SettingsScreen`
(MENU EDITOR row), and `IntroSequence` MAIN_MENU +
`MainMenuBackground` now render `menuCfg = getActiveMenuConfig()`.
#260's branch itself was never edited by this worker (read-only
inspection, then main's merged code). What the merged editor meets,
with evidence on current main:

- `menuEditor.ts` `lockedMenuEditorConfig()` (line 260) builds the
  editor config LIVE from `LOCKED_V32_MENU`, and
  `getActiveMenuConfig()` (line 397) returns the working preset if
  saved, else the locked default — so the editor covers menu
  geometry / colours / cloud / panels / background / symbol
  animation (188 editable values).
- `MenuEditorScreen` `restoreLocked` + `RESTORE LOCKED DEFAULT (v32)`
  row, and the Intro/MMB edits read the active editor config — the
  read path exists on main.

Why it still falls short of THIS item's definition (4 gaps remain):

1. NOT IN SETTINGS. The editor's RESTORE row lives only inside
   `MenuEditorScreen`'s EDITOR panel, reachable only via Settings →
   Menu Creator → MENU EDITOR. There is NO `RESTORE LOCKED V32` row
   in Settings itself — this PR adds it (Settings screen + Menu
   Creator page 4).
2. NOT A ONE-CLICK PERSISTED SELECTION. The editor's `restoreLocked()`
   only calls `setDraft(lockedMenuEditorConfig())` — a draft. Its
   own message says "Save to make it the working preset". Nothing
   is persisted until a separate SAVE / SAVE + BACK. Closing
   without saving loses it. That is a draft reset, not a selectable
   persisted preset. This PR's row persists in the same call.
3. NOT ALL SETTINGS AS ONE SNAPSHOT. The editor's working store
   (`mochiichao_menu_editor_working_v1`) is separate from the
   GameSettings store (`mochiichao_settings_v1`), the menuCustom
   store (`mochiichao_menu_custom_v1`), the preset store
   (`mochiichao_menu_presets_v1`) and the title-start-screen pick.
   Its RESTORE does not write `DEFAULT_SETTINGS`,
   `DEFAULT_MENU_CUSTOM`, `LOCKED_PRESET` or the title pick in one
   atomic restore; fonts / game options are written piecemeal by
   other editor panels. This PR's restore writes all of them.
4. NOTHING CLEARS THE WORKING PRESET. The old `RESET TO LOCKED
   DEFAULT (v32)` row writes settings/preset/custom + clears the
   title pick, but does NOT remove the editor working preset — so
   after editor edits, even RESET leaves the edited menu on screen
   (menuCfg keeps returning the working preset). This PR's restore
   is the one row that clears it, which is what actually restores
   the menu on current main.

This PR does NOT duplicate #260: #260 is a full in-game editor
(188 values, library, export); this PR is the single selectable
full-snapshot restore row + the persisted snapshot record + the
working-preset clear. Because #260 merged first, this PR
deliberately does NOT edit `IntroSequence` or `MainMenuBackground`:
the editor owns that render path now, and a second read path would
fight it. (Note: #260's PR body claimed "0 deletions" but its API
record reported -129 lines; this PR reports its own +/- exactly,
and with no edited-file deletions at all — see PR body.)

## What this PR does NOT claim (honest limits)

- Symbol field is the locked FORMULA v2 field, 300 entries (the
  round-2 measured 285 set is SUPERSEDED — DO NOT USE — by Mars's
  2026-10-26 14:18 CDT order; the snapshot follows the live locked
  field, it does not re-decide it).
- Locked animation speed is slow-rise, NOT perfect: Mars's
  2026-10-26 19:54 CDT order made slow-rise the default (perfect is
  kept as the option). An earlier version of this PR's text said
  perfect; that was stale against current main and is corrected
  here — the snapshot restores the CURRENT locked speed, whatever
  it is, and never overrides a lock Mars made.
- TITLE-phase slots (subtitle, press, Heavensent) are NOT in this
  snapshot — only the title-start-screen PICK is cleared. The title
  scene itself is untouched.
- Pause menu / Mochioteka layouts are NOT in this snapshot — they
  belong to the editor config, not to the locked main-menu spec.
  The editor LIBRARY (saved named templates) is likewise untouched
  by restore — only its working preset is cleared.
- Menu geometry CAN diverge on current main via the editor; that is
  exactly why restore clears the editor working preset. The
  change-away that exists today
  is settings / custom / fonts / title pick / speed, which this
  snapshot covers and which the row restores. (Geometry divergence
  becomes possible only when an editor like #260 lands.)
- The old `RESET TO LOCKED DEFAULT (v32)` row is KEPT unchanged
  alongside the new row (it restores settings/preset/custom but
  writes no snapshot JSON — that is exactly why it alone never
  satisfied this item).
- Live-browser playtest (tap the row on a phone, watch the main menu)
  is NOT verified here: no live browser is available to this worker.
  The headless verification below + the vite build are the evidence;
  a phone tap-through remains owed before this item is called
  live-verified.

## Files changed (3 files, 0 files deleted, 0 lines deleted)

- NEW `src/lib/lockedV32Snapshot.ts` (299 lines) — snapshot type,
  build/load/restore/active/menu accessors, 19-dimension list,
  editor-working clear.
- EDIT `src/components/game/SettingsScreen.tsx` (+27/-0) — import +
  restore handler + RESTORE rows on Settings + Menu Creator p.4.
- NEW `docs/locked-v32-full-snapshot-20261027.md` (this file).
- NOT edited, deliberately: `src/components/IntroSequence.tsx`
  and `src/components/game/MainMenuBackground.tsx` — on current
  main they already render `menuCfg = getActiveMenuConfig()`, and
  restore clears the working preset so that path returns locked.
  A second read path would fight the editor (see reconciliation
  above). `src/lib/lockedV32Menu.ts` (locked values),
  `src/assets/ui/mochiichao-main-logo-v32-matched.png`,
  `src/assets/ui/puffy-cloud.svg`, PR #260's branch, and every
  decision-gated PR (#261, #260, #233, #215, #214, #212, #206,
  #199, #157, #155, #154, #153, #167) are likewise untouched.

Base: live main f5fa59a4 at upload time; the one edited file was
verified unchanged against its base blob before upload (see the
upload script's base-blob guard). The patch was rebased onto this
main after earlier lanes landed: the Menu Editor merge, cloud
imgBox (PR #233), label margins / letter-spacings / sublabel
metrics, and the logo emblem layer are all later locked values
that the snapshot follows live from `LOCKED_V32_MENU` — none of
them were re-decided here.
