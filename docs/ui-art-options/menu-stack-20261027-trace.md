# Menu-stack follow-up — trace (2026-10-27, Mars verdicts batch item 1)

UNMERGED PROPOSAL. Mars judges the renders first. This PR does NOT
change the locked v32 default on main, the locked v32 doc/picture, or
the locked title. It proposes, on a branch only:

## (a) Pink heart mirrored — and the honest visibility result

- Blue heart: (169, 421.5), 63x50, #8cd2ff. This is the verdict's
  position, corrected from main's #214 approximation (169, 405,
  63x51, #95cbfe — blue y was 16.5px off, colour 9/7/2 RGB steps off).
- Pink heart: (970, 640.5), 53x40, #ff96c8 — mirrored across x=600
  from (230, 640.5), same size/colour. Main's #214 pink was
  (230, 637, 53x37, #fe95c7).
- Layer unchanged: hearts render last in MainMenuBackground's SVG
  (above arcs + symbols, below logo/cloud/panels) — no
  MainMenuBackground.tsx change was needed; only the two
  logoEmblems entries in lockedV32Menu.ts changed.
- VISIBILITY, measured against the current orbitfix logo asset
  (900x548, slot 150,180): pink-right box 100% logo-opaque, so a
  heart UNDER the logo there is 0% visible; the render confirms 0
  #ff96c8 pixels in the (970, 640.5) box. Pink-left box is 0%
  logo-opaque and blue box 28% logo-opaque (~72% visible). The
  renders show: blue heart visible at left, NO pink heart at left
  (moved, not copied), NO pink heart at right (hidden by the O).
  If the pink heart must be seen, Mars must order a new position
  (above the logo, or a transparent gap) — this move alone hides it.
  Do NOT merge this expecting a visible right heart.

## (b) Panel label styles — re-measured from all three targets

v32 picture + matched GIF frame 0 + proof GIF agree exactly:

| Panel | Target (measured) | Code before | This PR |
|---|---|---|---|
| CONTINUE | white + black outline (white 1530 / black 2008 px in label band) | black + white halo | white + black halo (2px) |
| SETTINGS | white + black outline (1314 / 1805) | black + white halo | white + black halo (2px) |
| NEW GAME | plain black (white px 0) | plain black | UNCHANGED |
| BACK TO TITLE | plain black (white px 0) | plain black | UNCHANGED |
| CONTINUE sublabel | white + black outline (2018 / 2708) | black + white halo | white + black halo (1px) |

BACK TO TITLE note: the task wording said "black letters with
white outline (as current)". All three targets AND current code
give plain black (white px 0 in every label band), so no white
halo was added — adding one would contradict the targets. If Mars
saw a white halo on BACK somewhere else, that is a separate call
(one line: give BACK the white halo).

Cursor: untouched. It stays settings-driven (amber #fbbf24 by
default), so the renders show an amber ►, not the target picture's
white ▷. That difference is pre-existing, not this PR.

## (c) Alignment + decomp check — what the code actually pins

Alignment: already left on main via merged PR #206. Verified
against the v32 targets (panel left edge x=300):

| Panel | Target label left | Code label left | Delta |
|---|---|---|---|
| CONTINUE (cursor) | 327 | 327 | 0 |
| CONTINUE sublabel | 329 | 330 | +1 |
| NEW GAME | 332 | 333 | +1 |
| SETTINGS | 329 | 329 | 0 |
| BACK TO TITLE | 332 | 333 | +1 |

This PR changes NO margins, NO alignment, NO sizes. Render label
lefts land within 0–4px of targets (spread is fallback-font
variance: Trebuchet MS is not installed in headless Chrome).

Decomp — Mars's belief checked against the real files:

- FireRed (pokefirered-leafgreen/src/main_menu.c): labels ARE
  left-aligned. Each item is its own window (CONTINUE tilemapTop 1
  height 10, NEW GAME top 13 height 2, tilemapLeft 3, width 24,
  palette 15); labels print at x=2, y=2 inside the window
  (AddTextPrinterParameterized3, lines ~352–377); stats lines at
  x=2, y=18/34/50/66 with values at x=62 (PrintContinueStats).
  Label colour sTextColor1 = {10, 11, 12} (line 126) = WHITE fg /
  dark-gray bg / light-gray shadow per
  graphics/main_menu/textbox.pal (10 = 255,255,255; 11 = 98,98,98;
  12 = 213,213,205). Stats colour sTextColor2 = {10, 1, 12}.
  So: left alignment + white letters are Pokemon-faithful. The
  BLACK outline, the coloured panel fills, the 27/29/33px margins,
  SETTINGS-as-a-row and BACK TO TITLE are Mochiichao spec, NOT
  decomp values (FireRed has no SETTINGS/BACK rows and no coloured
  panels; its outline/shadow is light gray, not black).
- HeartGold (pokeheartgold/src/application/main_menu/main_menu.c):
  CONTINUE sub-labels print at x=32 (MainMenu_PrintContinueButton,
  ~line 940); values are RIGHT-aligned with a 32px right margin
  (PrintPlayerInfoField, ~line 894: x = windowWidth*8 −
  (stringWidth + 32)). Colour is a palette triple
  (MAKE_TEXT_COLOR(3,4,15) / (7,8,15), gender-dependent) — no RGB
  pinned in code. Structure (left labels, fixed left inset)
  matches; no Mochiichao number comes from here.
- Black 2 (pokebw2 tree in this workspace): NO main-menu
  text-placement module was found (no main_menu source under
  src/include; startmenu graphics exist but no CONTINUE/NEW GAME
  print code was located). Black 2 pins nothing for this item.

## Renders (this PR, docs/ui-art-options/ + workspace ui-art/)

- menu-stack-20261027-stage-1200x1500.png — live headless-Chrome
  (CDP device-metrics, exact 1200x1500 viewport) shot of an HTML
  replica built from the PR's exact panel geometry, fills, fonts,
  outlines and heart positions, with the game logo PNG and cloud
  SVG. NOT a live game screenshot: the live game shows CONTINUE
  only when a save exists, and animates the symbols; this is a
  static t=0 frame with all four panels so Mars can judge the
  changes. Symbols are the current formula field at base positions
  with the locked phi fade.
- menu-stack-20261027-panels-closeup.png — crop of the stage shot
  (panels x280–920, y770–1190), 2x NEAREST. Labelled as a crop.
- menu-stack-20261027-hearts-closeup.png — crop of the stage shot
  (logo/hearts x100–1100, y350–720), 2x NEAREST. Shows the blue
  heart visible at left and the O covering the mirrored pink
  position at right. Labelled as a crop.
- menu-stack-20261027-phone-390.png — live 390-wide CDP shot
  (exact 390x488 viewport) of the same stage scaled 0.325 to fit
  390 wide. NOT a post-processed resize of the stage PNG.

Known render artefacts (pre-existing, not this PR): the CONTINUE
sublabel wraps to two lines in headless Chrome because Trebuchet
MS is not installed here (fallback Liberation/DejaVu measure the
26px sublabel at 619–747px vs 567px available); on Trebuchet
systems it fits one line as in the target. Sublabel size/width
are PR #206's, unchanged here. The logo asset is untouched.

## Stacking

- Base: current main 359dbe1d (PR #298, 2026-10-27 10:09 CDT),
  verified via the GitHub API. The local fresh-start clone is
  stale/dirty and was NOT used for commits.
- PR #261 (head 510bb3bc, cloud + slow hearts + logo hearts):
  OPEN but mergeable=false / dirty vs current main — it cannot be
  a clean base, and its slow-rise default + cloud retune are NOT
  this task. This PR adopts ONLY its heart measurements
  (blue/pink centres, sizes, colours) and applies Mars's 2026-10-27
  mirror to the pink one. If #261 later merges, its left pink
  heart and this PR's right pink heart must be deduped — do NOT
  merge both without removing one heart set.
- PR #233 (cloud shape fix), #214 (formula symbols v2 + emblems),
  #215 (section-O orbit fix), #206 (panel text exact): all
  MERGED into current main already. Their work is the base, not
  duplicated here. In particular #206's left margins are already
  live, which is why (c) needs no code change.
- NOT touched: menuEditor.ts (sibling editor agent owns it),
  locked v32 doc/picture, locked title, logo PNG, animation
  default (still "perfect"), cloud, arcs, symbols, panel
  positions/fills/sizes. NOT merged, NOT published to Pages.
