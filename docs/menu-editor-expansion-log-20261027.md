# Menu Editor expansion log — 2026-10-27 (append-only)

## Final verification + route change (appended 2026-10-27 evening)

- Build: `npx vite build --base=./` PASS (final dist bundle
  index-W-f5wE_P.js; the `--base=./` matters — a plain build emits
  absolute /assets paths that fail on file://, which blanked the
  first screenshot runs).
- tsc: 0 errors in PR files. Only errors in the whole tree are the
  3 pre-existing GardenView errors (raceWins/sparWins/egg, same file
  and lines as the #260 body's pre-existing claim, proven by path).
- Runtime bugs found and fixed during proof (this is why the
  screenshot drive is run before any upload): TOUCH_MIN and
  PRINT_SWATCH were used but never defined; the preview touch
  handlers were named onPinchStart/Move/End but the return layout
  referenced onTouchStart/Move/End; the RETRO block rendered
  `{typeSample}` while the state is `typedSample`; PanelState /
  EditorPanelGeom / setEditorGeom lacked the `ghost` field the
  renderPanel code reads. All fixed; the final drive below runs on
  the fixed dist.
- Screenshots (final set, 2026-10-27 17:44 UTC, viewed before
  reporting): editor-depth-pinch-scale (PREVIEW 150% readout +
  slider + RESET 100%, ghosted PANELS panel, preview behind),
  editor-mid-drag (PANELS panel at a dragged offset, pointer still
  down, preview behind — a genuine mid-drag frame; the 17:35
  mid-drag file was identical to the pinch-scale file because the
  drag selector missed, and was discarded, not reported),
  editor-library-depth (RENAME/DUPLICATE/UPDATE rows + search
  "Depth" + TEMPLATE chip + "Showing 1 of 1 entries"),
  editor-per-line-style (CONTINUE LABEL COLOR black / OUTLINE
  COLOR white / OUTLINE WIDTH 2 / LABEL FONT Locked v32 stack /
  ALIGN LEFT / LABEL MARGIN 70px / LETTER SPACING 0px),
  editor-retro-access (GEN 1 BATTLE ANIMATION, YELLOW SOUND MONO,
  PRINT BRIGHTNESS, MENU ACCOUNT, SAVE BEFORE IR, HG/PLAT BUTTON
  MODE, FRAME SET EMERALD 20, OPTIONS LAYOUT FIRERED),
  editor-access (REDUCED MOTION, HIGH CONTRAST, TOUCH TARGET M,
  PREVIEW FONT SCALE 100%, FOCUS RING ON).
- ROUTE CHANGE — PR #260 MERGED DESPITE THE HOLD (same failure mode
  as #178/#259/#279): API-verified 2026-10-27: PR #260 state closed,
  merged true, merge commit 5f5ac9c8, merged_at 2026-10-27T16:10:14Z,
  head 0b98743e (not the brief's 63d3be8d). The expansion was
  therefore NOT uploaded to feature/menu-editor-20261026: that
  branch is merged, and uploading there would not reopen it.
- Main has since moved to e1eecd70 (merge #324). Main-side content
  my tree does NOT have (reconciliation scope, not uploadable
  wholesale — a wholesale upload would regress it): IntroSequence
  preset-title system + trap-fix R recovery + orbitfix logo +
  #206/#214/#233 hunks (239 main-side lines); MainMenuBackground
  formula-v2 symbols + logo hearts (29); menuEditor.ts newer
  canonical bits incl. slow-rise default (25); GameShell day/night
  variant import (12). My tree's files that match main exactly
  (MenuEditorScreen, MenuList, menuEditorExport blobs) carry only
  my expansion on top. Next step needs a parent call: open a NEW
  follow-up PR from current main and re-apply the expansion hunks
  onto main's files (IntroSequence label-style/emblem-z/opacity
  hunks, MainMenuBackground opacity attributes, GameShell pause
  overrides, menuEditor.ts new fields/functions), with #322 (open,
  sibling: mirrored pink heart + white/black label outlines in the
  main render) sequenced so the two IntroSequence label changes do
  not clobber each other. Nothing was pushed, nothing merged, no
  Pages publish in this pass.

Checkpoint log for the Menu Editor depth expansion on branch
`feature/menu-editor-20261026` (PR #260, NOT merged — Mars judges the
new screenshots first). This file is new in the expansion; it does not
rewrite any existing log.

## Baseline

- PR #260 branch head at expansion start: 63d3be8d (re-verified at
  upload time, not trusted from the brief).
- Prior claim: 188 editable values. Counting method unstated and NOT
  reproduced from rowsFor as written (a row count of the same code
  comes out higher) — the expansion report states the baseline as the
  prior claim and gives added-row arithmetic transparently.
- Prior missing from the editor (audit against Mars's full list):
  per-panel label color/outline/width/font; per-panel alignment +
  margins; per-line (pause item) color/font/align; per-emblem layer z;
  layer opacity; panel letter-spacing; sublabel styles; library
  rename/duplicate/update/search/section/piece; editor panel geometry
  persistence (positions were session-only); preview scale/pinch/
  ghost/park; undo/redo; snap; align tools; copy-style; preset pack
  export; retro Gen 1–5 / Black 2 rows; accessibility block (reduced
  motion / high contrast / touch targets / font scale / focus ring).
- Already present before this pass (NOT double-counted): cloud
  frame/bob, symbol speed/sway/bob/field/count, logo slot x/y/w,
  fade gone/mid/full/paper, title logo/sub/press/Heavensent slots,
  panel position/size/labels/fills/labelSize, layer visible/order,
  emblem x/y/w/h/color/visible, pause title/maxW/gap/sparkles/
  order/labels/help/visible, mochioteka looks, GAME_OPTIONS six rows,
  theme/layer/background saves.

## What was added (counts verified against final code at upload)

- EDITOR rows: 10 (UNDO, REDO, SNAP GRID, ALIGN LEFT, ALIGN CENTRES,
  ALIGN RIGHT, COPY CONTINUE STYLE TO ALL, EXPORT PRESET PACK,
  RETRO_OPTIONS category row, ACCESS category row).
- EMBLEMS rows: 7 (per-emblem LAYER z ×6 + MIRROR PINK HEART).
- PANELS rows: 36 (per panel ×4: LABEL COLOR, OUTLINE COLOR,
  OUTLINE WIDTH, LABEL FONT, ALIGN, LABEL MARGIN, LETTER SPACING,
  LABEL STYLE PRESET = 8 × 4 = 32; CONTINUE-only SUBLABEL COLOR,
  SUBLABEL OUTLINE COLOR, SUBLABEL OUTLINE WIDTH, SUBLABEL MARGIN
  = 4).
- TITLE rows: 1 (PRESS ALIGN).
- LAYERS rows: 7 (per-layer OPACITY ×7).
- PAUSE rows: 44 (per item ×14: LABEL COLOR, LABEL FONT, ALIGN = 3
  × 14 = 42; LABEL MARGIN = 1; RESET LINE STYLES = 1).
- LIBRARY rows: 6 (SEARCH, KIND FILTER, SECTION TAG, PIECE TO SAVE,
  SAVE AS PIECE, plus per-item RENAME/DUPLICATE/UPDATE counted
  separately as library operations, not rows).
- RETRO rows: 10 editable (GEN 1 BATTLE ANIMATION, YELLOW SOUND,
  PRINT BRIGHTNESS, MENU ACCOUNT, SAVE BEFORE IR, HG BUTTON MODE,
  PLAT BUTTON MODE, FRAME SET, OPTIONS LAYOUT, OPTIONS THEME) + 3
  info rows (C-GEAR, KANJI, TEXT DELAYS — not counted as editable).
- ACCESS rows: 5 (REDUCED MOTION, HIGH CONTRAST, TOUCH TARGET S/M/L,
  PREVIEW FONT SCALE, FOCUS RING).
- New base rows total: 126 → 188 + 126 = 314 editable values on the
  prior claim's baseline.
- Controls (counted separately, not rows): preview scale slider,
  RESET 100%, GHOST toggle, PARK PANELS, MINIMIZE ALL, panel scale
  −/%/+, panel ghost ◐, resize grip, pinch, Ctrl+wheel = 10.
- Library operations added: rename in place, duplicate, update from
  draft, search by name/section, kind filter, section tag, save as
  piece, load piece (piece = one emblem, one panel, subtitle, or
  pause order).

## Wiring added

- IntroSequence: per-panel label color/outline/width/font/
  letter-spacing with locked-identical defaults; CONTINUE sublabel
  color/outline; emblems sorted by z; layer opacity on
  logo/cloud/Mochii/emblems/panels.
- MainMenuBackground: layer opacity on arcs + symbols groups.
- GameShell PauseMenu + MenuList: per-item label color/font/align/
  margin (optional MenuListItem fields, backward compatible).
- menuEditorExport: panel export uses label styles (color, halo
  outline, align, margins, font fallback) with locked fallbacks.

## Boundaries (stated, not claimed)

- Per-heart-above-logo stacking NOT implemented: per-heart layer is
  z-order WITHIN the emblem group; the whole group moves on the
  LAYERS panel. Lifting one heart above the logo while others stay
  below needs per-heart stacking contexts.
- Real-menu label alignment NOT wired: preview defaults LEFT, real
  menu stays centered on this branch until the #260 merge
  reconciles with #206 (merged on main 2026-10-27). #214 and #233
  also merged on main 2026-10-27 after #260's base — the #260 merge
  will need reconciliation with all three (IntroSequence label divs,
  emblem rendering, cloud element). No rebase was done in this pass
  (guard: no rebase); the merge lane handles reconciliation.
- Font-picker entries NOT added for FireRed/Emerald/HeartGold font
  ids — no font files exist; they are reference-only in the layout
  doc.
- Symbol rotation row CUT: the stage exposes no per-symbol rotation
  to wire it to; rotateDeg stays in the type at default 0, unused
  by rows.
- Layer opacity IS fully wired (arcs/symbols groups + all
  IntroSequence layers), not preview-only.

## Screenshots (new dated 20261027 filenames, never overwriting 20261026)

- editor-depth-pinch-scale-20261027.png (control bar scale readout,
  ghosted panel, preview behind)
- editor-mid-drag-20261027.png (panel mid-drag, preview visible
  behind — captured BEFORE pointer-up, then released)
- editor-library-depth-20261027.png (search + chips + rename/
  duplicate/update + piece rows)
- editor-per-line-style-20261027.png (new PANELS rows + left-aligned
  preview)
- editor-retro-access-20261027.png (RETRO + ACCESS panels)
- Each PNG was viewed before reporting. Drive script modelled on
  menu-editor-shots/shot-editor.js (headless Chromium CDP, file://
  dist, 390×844).
