# Menu Editor — Pokemon settings trace + parity list (2026-10-26)

Mars order 2026-10-26 19:59 CDT, refined 19:59 / 20:32 / 20:34 / 20:40 CDT:
build a Menu Editor on top of the Menu Creator so everything the UI lane
did can be edited by Mars from inside the game, in Pokemon menu style.

## 1. Pokemon structure first (what was actually read)

Research files (workspace, not repo): `ui-art/menu-editor-pokemon-settings-trace-20261026.md`
(settings, FireRed → HeartGold → Black 2),
`ui-art/mochioteka-pause-research-20261026.md` (Pokedex + pause, all 11 trees),
`ui-art/menu-editor-editable-audit-20261026.md` (code-editable audit + fan wants —
spawn blocked by a runtime database timeout, so the audit below was done
directly from the decomp trees + the two delivered research files instead;
no source was invented).

On-disk generations inventoried (11 trees, 5 generations — never invented):
Gen 1 pokered, pokeyellow; Gen 2 pokegold, pokecrystal; Gen 3 pokeruby,
pokeemerald, pokefirered-leafgreen; Gen 4 pokediamond, pokeplatinum,
pokeheartgold; Gen 5 pokebw2.

### 1a. Options/settings screens — the shared Pokemon structure

| Pokemon element (exact spot) | Mochiichao editor replacement in that exact spot | Status |
|---|---|---|
| Dedicated full screen entered from the Start/field menu, never a popup (FR `CB2_OptionsMenuFromStartMenu`, HG `OptionsMenu_LaunchApp`, BW2 `CONFIG_PANEL_PROC_FUNCTIONS`) | Editor entered from Settings → Menu Creator → MENU EDITOR; the game menus themselves stay full screens. The editor tool's own submenus are draggable/minimizable layers over a live preview (Mars 20:32 CDT explicit call — the tool's pattern, not a change to game menus) | DONE |
| Row list: name left + value right (FR `WIN_OPTIONS` 26×12 at (2,7); HG `windows.selectedOption` (1,3) 30×18; BW2 `sConfigPanelLabels`) | Editor rows: name left + value right, ◄ ► cycle, click/tap, keyboard mirrors SettingsScreen | DONE |
| Row highlight: band, not a moving icon (FR `UpdateSettingSelectionDisplay` WIN0 band; HG BG-scroll border + colour; BW2 row palettes + pulse) | Selected editor row: white/10 band + yellow ring, ► cursor glyph | DONE |
| Value cycling Left/Right, wrapping (FR/HG) or clamped (BW2) | Left/Right cycles choice lists (wraps); numbers nudge with clamps; the wrap-vs-clamp choice is per row and noted in-row | DONE |
| Confirm/Quit exit rows + Yes/No dialog on changed exit (HG `MENU_ENTRY_6`; BW2 `BUTTON_CONFIRM/QUIT/CLOSE` + "Would you like to make these changes?") | SAVE WORKING PRESET + SAVE + BACK + DISCARD CHANGES (Black 2 snapshot discipline: entry snapshot restored on discard, NOT HeartGold's live-leak) | DONE |
| Live preview box (HG `frameAndTextSpeedTest`: current frame + text speed rendering sample text) | Full live preview of the menu being edited under the panels, updating on every change, no save-and-reload | DONE |
| Per-row explanation (BW2 message window under the cursor) | Note line under the selected editor row, explaining the row | DONE |
| Text Speed 3 / Battle Scene 2 / Battle Style 2 / Sound 2 (all three games) | GAME OPTIONS panel: TEXT SPEED, BATTLE SCENE, BATTLE STYLE, SOUND — same values, writing the same GameSettings the Settings screen edits | DONE |
| Button Mode (FR 3, HG 2, BW2 none) | GAME OPTIONS panel: BUTTON MODE NORMAL/LR/L_EQUALS_A (note names that Black 2 has no such field) | DONE |
| Frame Type (FR 10 frames `gUserFrames`, HG 20 frames, BW2 none) | GAME OPTIONS panel: FRAME 1–20 (Mochiichao ORIGINAL Y2K variants in those slots per gameSettings.ts, not Pokemon frame tiles); panel frame radius/border in PANELS panel | DONE |
| Window templates + frame graphics (FR `WindowTemplate`/`GetUserWindowGraphics`, HG `AddWindowParameterized`, BW2 `BmpWin_DrawFrame`) | PANELS panel: per-panel geometry + fill + radius + border + label font (the direct analogue of Frame Type) | DONE |
| Font + colour triples as parameters everywhere (FR `FONT_NORMAL`/`FONT_SMALL`, HG `MAKE_TEXT_COLOR`, BW2 `GFL_FontCreate`) — but NO font picker in any game | FONTS panel: 6 role rows cycling real wired fonts + POKEMON BASE DEFAULT behaviour + subtitle font row (pinned default) | DONE |
| BG layers + priorities + window stacking (FR 3 BGs, HG 5 BGs, BW2 6 BGs + `GFL_BGSysSetBGEnabled`) — but NO user layer editor in any game | LAYERS panel: per-layer visible on/off + order 0–10, applied as zIndex + visibility in the real menu | DONE |
| Full-screen fades on entry/exit (FR/HG `BeginNormalPaletteFade`, BW2 `GFL_FadeSet` + confirm-dialog brightness blend) — no per-background fade slider in any game | FADE panel: gone/mid/full points + paper colour, driving the real menu's phi fade | DONE |
| Title/header window slot (FR `WIN_TEXT_OPTION`, HG `windows.optionsTitle`, BW2 `WINDOW_TITLE`) — a fixed label, not editable | TITLE panel: logo slot, subtitle slot + text + font, press slot + text + blink, Heavensent slot + visibility | DONE |
| Config struct fields NOT on the panel (BW2 `kanji`, `cgearOn`) | NOT added as fake rows — named in the GAME OPTIONS note | DONE (by omission, stated) |
| Save-Before-IR (BW2 only, no Mochiichao equivalent) | NOT ported — no IR hardware; named in the GAME OPTIONS note | DONE (by omission, stated) |
| Volume/brightness sliders | NONE in any of the three games — none invented | DONE (by omission, stated) |
| Presets / export / layer editor / symbol picker / cloud editor / logo slot editor | NO Pokemon options equivalent — designed new for Mochiichao, labelled as such (see §2) | DONE (new design) |

### 1b. Pause / start menus — per generation (in-game menu, not title menu)

Black 2 warning, verified in the files: `src/ov162/startmenu.c` is the
TITLE menu (Continue / New Game / …), NOT the pause menu. The Gen 5
pause menu is `src/ov036/field_menu.c`. Do not wire the title menu in
as a pause menu.

| Gen | Normal-field entries in order | Layout | Mochiichao pause replacement |
|---|---|---|---|
| 1 Red/Yellow (`engine/menus/draw_start_menu.asm`, `home/start_menu.asm`) | POKéDEX, POKéMON, ITEM, [player], SAVE/RESET, OPTION, EXIT | Text box (10,0), 8 wide, 14/12 high, remembered cursor, wrap-around | Pause editor edits the real PauseMenu (GameShell.tsx): title, width, gap, sparkles, labels, help, visibility, order |
| 2 Gold/Crystal (`engine/menus/start_menu.asm`) | #DEX, #MON, PACK, POKéGEAR, [player], SAVE/QUIT, OPTION, EXIT | Variable box + optional description box (0,13) when MENU_ACCOUNT set | Help lines = the description box; remembered cursor = NEED (PauseMenu resets selection on open) |
| 3 Ruby/Emerald (`src/start_menu.c`) | POKéDEX, POKéMON, BAG, POKéNAV, [player], SAVE, OPTION, EXIT | Framed window, items x=8, 16-px rows | Row geometry model for the pause rows |
| 3 FireRed (`src/start_menu.c`) | POKéDEX, POKéMON, BAG, [player], SAVE, OPTION, EXIT (no POKéNAV — verified absence) | Same window system + per-item descriptions | FireRed order is the closest single preset to the shipped PauseMenu |
| 4 Diamond | GAP — no `start_menu.c`; `include/start_menu.h` is a TODO stub | — | NOT offered as a preset; never inferred from Platinum |
| 4 Platinum (`src/start_menu.c`) | POKéDEX, POKéMON, BAG, TRAINER_CASE, SAVE, OPTIONS, EXIT | Icon sprites + sprite cursor + wiggle on select | Container-style preset = NEED (shipped pause is a text list, not icons) |
| 4 HeartGold (`src/start_menu.c`) | Enum: POKéDEX, POKéMON, BAG, TRAINER_CARD, SAVE, OPTIONS, RUNNING_SHOES, …, RETIRE, …, POKéGEAR — display order NOT verified as enum order | Button/icon menu, key + touch, sprite cursor | Display order NOT shipped as HeartGold's; RUNNING_SHOES toggle = NEED |
| 5 Black 2 (`src/ov036/field_menu.c`) | POKéMON, POKéDEX, BAG, TRAINER_CARD, SAVE, OPTIONS, RETURN | 2-col icon grid, 7 slots, pulsing cursor, per-type cursor-move tables | Gen 5 order break kept as its own preset (POKéMON before POKéDEX — the only gen that does this); icon-grid container = NEED |

Pause mapping vs the REAL PauseMenu (GameShell.tsx — the earlier
research file checked only the views dir and missed it, so its 0/10
is corrected here): container HAVE, entries Dex/Party/Bag/Save/
Exit HAVE, Trainer Card NEED, Options entry NEED (Settings lives in
the main menu), descriptions HAVE, remembered cursor NEED, variant
hiding rules (Safari/Link/Union/No-Dex) NEED, container-style presets
(text box / icon menu / icon grid) NEED. Pause: HAVE 6/10, PARTIAL
1/10 (descriptions HAVE, remembered cursor NEED), NEED 3/10.

### 1c. Pokedex (Mochioteka) layouts — per generation

| Gen | Layout verified | Mochiichao look |
|---|---|---|
| 1 Red/Yellow (`engine/menus/pokedex.asm`) | 1 col, 7 rows, number + ball + name/`----------`, SEEN/OWN right side; detail bordered frame, sprite (1,1), name (9,2), category (9,4), № (2,8), HT/WT (9,6); side menu DATA/CRY/AREA/QUIT; cry on entry | SELECTABLE — Gen 1 look in DexView: counts bar, 7-row list, framed detail, DATA/CRY/AREA/QUIT (CRY plays the real title cry when discovered; AREA states plainly that area data is not in the roster) |
| 2 Gold/Crystal (`engine/pokedex/pokedex.asm`) | Sidebar boxes (SEEN/OWN, SELECT > OPTION, START > SEARCH); 1-col list, 2-tile rows; detail bottom bar PAGE/AREA/CRY/PRNT; footprint 2×2 (18,1); cry on entry; option modes OLD/ABC/NEW | SELECTABLE — Gen 2 look: sidebar + OPTION (OLD/ABC — NEW needs discovery-order data, not offered) + SEARCH filter + PAGE (description ↔ data page) / AREA / CRY. PRNT omitted: Game Boy Printer hardware, no web equivalent |
| 3 Ruby/Emerald (`src/pokedex.c`) | Full-screen window, smooth scroll, 4 sprites, caught ball; select bar INFO/AREA/CRY/SIZE/CANCEL; footprint (25,8); VU meter; 6 sort orders | NEED — window layout verified, pixel-faithful port needs a second pass |
| 3 FireRed (`src/pokedex_screen.c`) | Mode-select first (Numerical OR 9 habitat categories, 4 per page); dex-counts + icon windows; cry via START | NEED — dex-page pixel fields unquoted (window printers, not one print function) |
| 4 Diamond | GAP — `arm9/src/pokedex.c` is save-data logic only | GAP — never offered, never inferred from Platinum |
| 4 Platinum (`src/applications/pokedex/*`) | DS app, main+sub screens, Info/Forms/Cry/Height-check/Area/Search/Sort | NEED — screen set verified, pixel fields unquoted |
| 4 HeartGold (`src/application/pokedex/ov18_*.c`) | DS overlay app, 3-digit tile-buffer list rows, NatDex-gated | NEED — app/data verified, names obfuscated, fields unquoted |
| 5 Black 2 (`src/ov298/zukan_detail*.c`, `ov299/zukanlist.c`) | Detail pages INFO/MAP/VOICE/FORM via touch bar + headbar; search proc | NEED — pages verified, list/detail pixels unquoted |

Mochioteka mapping (dex elements, 18 counted): full HAVE 7/18 (number
rows, name/???, static portraits, silhouettes, unfilled slots, large
detail portrait, number+name+status), PARTIAL 4/18 (caught icon → status
text only; separate Seen vs Own → combined header line in the current
look, separate in Gen 1/Gen 2 looks; types 12/49 species; description
12/49 species), NEED 7/18 (height/weight — no data in species.ts, shown
as ??? when owned, never invented; category line — same; footprint —
not wired in DexView, stated, not faked; cry playback in current look —
Gen 1/Gen 2 looks have it; sub-screen tabs AREA/SIZE/FORM; search/sort
— Gen 2 look has OPTION + SEARCH, current look does not; keyboard/D-pad
navigation — click/tap only in all looks).

## 2. Parity list — everything the agents could do, can Mars do in-menu?

Counts are parameters/panels, not vibes. "Done" = editable in the
editor AND wired to the real game config (working preset the game
loads). Locked Default (v32) is never overwritten by editing.

### Title section — 16/16 done (100%)
Logo X/Y/W, subtitle text/X/Y/W/H, subtitle font (pinned default),
press text/Y/blink, Heavensent X/Y/W/visible. (Title figure: the locked
phi title has NO figure slot — that open call is unchanged, not
invented here.)

### Main menu section — 107/107 done (100%)
- Cloud 7: frame X/Y/W/H, bob on/off, bob amp, bob period.
- Symbols 8: speed (PERFECT / SLOW-RISE named), sway amp, sway cycles,
  bob amp, bob cycles, field left, field right, count.
- Emblems 30: 6 emblems × (X, Y, W, H, visible). Top sparkle toggle
  included; Mars's picture-vs-proof call on it is still open (OFF is
  one toggle in the editor).
- Panels 31: 4 panels × (label, X, Y, W, H, fill, label size) = 28,
  + CONTINUE sublabel + panel radius + panel border width = 31.
  (Panel label font is counted under Fonts.)
- Logo 3: X, Y, W. Mochii 7: X, Y, W, H, bob on/off, bob amp, bob period.
- Fade 4 + arcs 3: gone, mid, full, paper; arc centre X/Y, arc stroke.
  (Arc radii/colours live in locked data and are NOT editable rows —
  5 radii + 5 colours + 2 orbit pairs = 12 values NOT yet editable:
  see §4.)
- Layers 14: 7 layers × (visible, order).

### Pause section — 46/46 values done (100%) + reorder action done
Title, panel max width, gap, sparkles = 4; 14 items × (label, help,
visible) = 42. Reorder (move ▲/▼ per item) is done as an action, not a
value. NEED: remembered cursor, variant hiding rules, container-style
presets (text box / icon menu / icon grid), Trainer Card entry,
Options entry.

### Mochioteka section — looks 3/9 selectable (33%), values 6/6 done (100%)
Looks selectable: Mochiichao current, Gen 1, Gen 2 = 3/9 (Diamond is a
gap, not a look; the other 5 are NEED per §1c). Values done: look,
list %, list portrait, detail portrait, help line, accent = 6/6.

### Settings / creator section — 13/13 done (100%)
Fonts 7 (6 roles + panel label font; subtitle font counted under
Title), game options 6 (text speed, battle scene, battle style,
sound, button mode, frame), discard/snapshot discipline 1 (counted
separately from values below), library 4 kinds, export 3 routes
(PNG, WebM video, JSON) — see §3. (TEXT panel re-exposes panel
labels, sublabel, subtitle text and press text — already counted
under Panels/Title/Pause, not double counted.)

### Editor tooling itself — 5/5 done (100%)
Draggable panels, minimizable panels (dock bar), live preview,
per-layer customization (content values, not just position/visibility),
template/theme/layer/background saves (library CRUD + import/export +
share-via-clipboard). Saving one layer never forces a whole-menu save;
loading a theme/layer never touches the locked default.

### Totals
- Editor panels: 17 (EDITOR + TITLE + CLOUD + SYMBOLS + EMBLEMS +
  PANELS + LOGO + MOCHII + FADE + LAYERS + PAUSE + MOCHIOTEKA + TEXT +
  FONTS + GAME_OPTIONS + LIBRARY + EXPORT).
- Editable values wired to the game: title 16 + main 107 + pause 46 +
  mochioteka 6 + fonts 7 + game options 6 = 188 values, all wired
  through the working preset except fonts/game options, which write
  the live game settings directly (Pokemon live-apply pattern).
- Generation looks: 3/9 selectable (33%); 5 NEED + 1 gap (Diamond).
- Pause presets by generation: 0/8 container/entry-order presets
  (values editable, presets not yet built).

## 3. Tools / sources — what the lane uses, and what Mars gets in-menu

| Tool / source | In-browser? | What it contributed / in-game equivalent |
|---|---|---|
| MediaRecorder web route (creator Phase 2, open PR #155 `introVideoExport.ts`, 527 lines: `pickExportMimeType`, `startCanvasRecording`) | YES | EXPORT panel: RECORD MENU VIDEO (5.6s WebM, one perfect loop). The editor implements its own canvas + MediaRecorder export with the same mime fallback list (vp9 → vp8 → webm → mp4) and does NOT import #155's file, since #155 is not on main. Sharing the helper is a follow-up after #155 merges. |
| Canvas 2D stage render (`menuEditorExport.ts`: arcs, symbols, emblems, logo, cloud, Mochii, panels at 1200×1500) | YES | EXPORT panel: EXPORT MENU PNG. Also the live preview's stage. No html2canvas, no new dependency. |
| JSON templates (working preset + library) | YES | LIBRARY panel: save/load/export/import/share (clipboard) for templates, themes, layers, backgrounds. |
| Headless Chromium CDP screenshots (lane script `shot-menu.js`) | NO (agent-side) | Proof renders only — Mars judges from screenshots; the in-game equivalent is EXPORT MENU PNG. |
| Native FFmpeg (LGPL/GPL) | NO — cannot run in a browser | Named plainly in the EXPORT panel. In-game equivalent: WebM export; desktop conversion `ffmpeg -i mochiichao-menu-export.webm mochiichao-menu-export.mp4`. |
| Native Blender | NO — cannot run in a browser | Named plainly in the EXPORT panel. In-game equivalent: the canvas stage render. |
| ndstool / DSDecmp (native, in repo `tools/`) | NO — cannot run in a browser | Named plainly. No menu-editor use (DS ROM tooling); not wired, not claimed. |
| rot.js, WFC, FastNoiseLite (JS, vendored in `tools/`) | YES as libraries, NO for menus | Game-world tools (dungeon gen, map gen, noise), not menu tools — not wired into the editor, not claimed. |
| Python extract scripts (`tools/extract_*.py`) | NO (agent-side) | Data extraction only; no menu-editor use. |
| Pokemon decomp trees (11, §1) | Reference only | Structure source for every panel above; no Pokemon names/art/sprites/dialogue/cries verbatim in the public copy (reskin only). |

## 4. NOT yet done — stated plainly, with why

- Arc radii/colours (5 + 5 + 2 orbit pairs = 12 values): locked data
  only, no editor rows yet. Follow-up: add ARCS rows to the FADE panel.
- Painted menu backgrounds: 10/10 paintings exist (Title Backgrounds
  lane) but menu-background wiring is 0/10 — show-first still owed by
  that lane (Mars must SEE the 10 PNGs and approve in words). The
  editor's background slice covers arcs + fade + paper only, and does
  NOT claim painted backgrounds.
- Pause container-style presets (Gen 1 text box / Gen 4 icon menu /
  Gen 5 icon grid) + entry-order presets per generation: values are
  editable, presets are not built yet.
- Pause remembered cursor + variant hiding rules (Safari/Link/Union/
  No-Dex): NEED, named in §1b.
- Mochioteka looks NEED: Gen 3 Ruby/Emerald, FireRed, Platinum,
  HeartGold, Black 2 (§1c). Diamond is a gap, not a look.
- Mochioteka current look: no search/sort, no keyboard navigation, no
  cry button, no footprint, no height/weight/category data (species.ts
  has 12 entries with description/types only). Gen 1/Gen 2 looks have
  search/sort/cry; footprints stay unwired until their PR lands.
- Mirroring the editor working preset into the MenuPreset list (open
  PRs #157/#199): deliberately NOT done here — the editor uses its own
  working/library keys so it cannot clobber those open PRs. Follow-up,
  labelled, not claimed.
- Fan customizations NOT wired (named, with why): run toggle (no
  Mochiichao run-toggle setting exists — gameplay setting, not a menu
  value); menu recolours beyond panel fills + themes (frame-tile
  recolouring needs the frame-tile system, which the web game does not
  have — panels are CSS fills); custom font FILE upload (fonts are
  wired by id from shipped files; Behance Y2K is still FILE PENDING and
  falls back); volume/brightness sliders (no Pokemon options equivalent
  in any generation — not invented).
- Fan customizations WIRED (from the mod/community wants, mapped to
  Pokemon structure): custom frames (PANELS radius/border + GAME
  OPTIONS frame 1–20), menu recolours (PANELS fills + LIBRARY themes),
  custom fonts (FONTS panel, real wired fonts), fast text (GAME
  OPTIONS text speed), layout rearrangement (LAYERS order + PANELS
  geometry + TITLE slots), per-element toggles (LAYERS visibility +
  EMBLEMS visibility), preset sharing (LIBRARY export/import/clipboard).

## 5. Coordination notes (read before merging)

- PR #233 (cloud shape fix, open): changes the IntroSequence cloud
  element from `<img>` to `<svg><image>` + imgBox. This PR's
  IntroSequence edit touches the SAME element (reads its frame from
  menuCfg.cloud). Whoever merges second rebases that one element to
  read its frame from menuCfg.cloud. The editor's cloud-frame default
  is runtime-derived from LOCKED (imgBox-aware), so #233's merge flows
  into the editor default without a hardcoded copy.
- PR #214 (formula symbols + emblems, open): the editor's emblem
  defaults use its v32-picture numbers, but the editor does NOT copy
  its branch files. If #214 merges, its emblem rendering and this
  PR's emblem layer both render emblems — the second merger must keep
  exactly one emblem layer (this PR's, driven by menuCfg.emblems).
- PR #206 (panel text, open): touches the same BACK button line this
  PR changes (label now from menuCfg). The editor's BACK default
  keeps main's current "◄ BACK TO TITLE (B)" text exactly, so this PR
  does not silently land #206's ◄ removal.
- PR #155 (creator Phase 2 export, open): the editor reuses its
  MediaRecorder PATTERN, not its file. After #155 merges, the two
  exports should share one helper.
- PRs #157/#199 (preset definitions/wiring, open): the editor uses
  its own working/library localStorage keys deliberately; mirroring
  into MenuPreset is a follow-up.
- Pre-existing tsc errors (NOT this PR): GardenView.tsx 3 errors
  (`raceWins`, `sparWins`, `egg` not in `GardenCreature`) exist on
  base main and are untouched by this PR (0 errors in this PR's files).
- Slow-rise vs perfect: PERFECT (matched GIF 157.14 px/s, 5.6s loop)
  is the default; SLOW-RISE (PR #163 vy 8–14 px/s) is a named option
  only, and keeps its own fixed numbers — the sway/bob rows apply to
  PERFECT.
- Subtitle font: DEFAULT is the pinned v32 stack and never changes on
  its own; picking another font in the editor is Mars changing it
  himself, his call, not an agent default change.
- Top sparkle: v32 picture HAS the star, the matched proof has none
  there — Mars's call is still open; OFF is one toggle in the editor.
- Locked v32 default: never overwritten by editing. Editing works on
  a copy (the working preset); only Mars locking a version makes a
  new default. The working preset is what the game loads.
- Preview fidelity: the editor preview hides CONTINUE when no saves
  exist, exactly like the real menu (fresh profile) — the preview
  never shows a panel the real menu would not show. All other
  preview panels are the draft's design values.
- Editor readability fix (proof run 1): the first screenshots
  rendered editor rows in the game screen's slanted display font,
  whose digits read as dashes. The editor now forces the locked
  picture label stack (Trebuchet/Arial, upright) on its own panels,
  so every value reads cleanly; proof run 2 re-shot with the fix.
- Emblem coordinates are CENTRES (v32 picture placements are
  centres). Heart defaults follow open PR #261's measured
  corrections, not PR #214's first numbers: blue (169,421.5) 63x50,
  pink (230,640.5) 53x40. The first #260 upload rendered emblems
  from top-left (wrong by half a size) and clobbered #259/#243-era
  DexView + SettingsScreen lines; the repair commit on this branch
  restores those lines (3-way merge, 0 files deleted) and switches
  all three emblem render sites (game menu, editor preview, canvas
  export) to centre coordinates. If #261 merges, its heart layer
  and this PR's emblem layer must be reconciled to exactly one
  layer (same rule as #214 above).
- Deletion count, stated plainly: 0 FILE deletions in this PR.
  The 340 "deletions" in GitHub's diff stat are replaced LINES
  inside the 5 edited files (rewrites + reconciliations), which the
  lane's standing rule counts as normal edits, not file deletions.
