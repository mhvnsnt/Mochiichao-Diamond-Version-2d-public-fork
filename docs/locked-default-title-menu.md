# Locked default: title + main menu (restoration, 2026-10-26)

Mars approved this restoration 2026-10-26 06:35 CDT ("Revert preset
playback to my locked default"), corrected 06:41 CDT (logo is never
font text), and scope-narrowed 06:47 CDT (UI Art lane's part only).
This note exists so a later lane does not re-break the default by
re-wiring a player into it.

## The default path (IntroSequence.tsx, BOOT -> INTRO -> TITLE -> MAIN_MENU)

- BOOT: untouched. Heavensent Studios card, Option B rising
  arpeggio, any key to skip. Boot audio lives in `bootAudio.ts`.
- INTRO: restored locked path, 4 text scenes (studio / world
  close-up / world pan + creature close-ups / creature fight beat).
  Any key or tap steps to the next scene, then TITLE. The intro
  music footer is corrected: PR #104 wires the official intro
  track by phase, so no "Music: GAP" label appears on this path.
- TITLE: locked phi stage (`LockedStage`, 1200x1500, resize-aware
  scale recomputed on every host resize, never frozen at init).
  Logo = Mars's uploaded logo PNG
  (`src/assets/ui/mochiichao-main-logo.png`: black-space-only
  crop 107,785,871,1235 of `ui-art/mochiichao-main-logo-official.png`,
  transparent key max-channel < 30 ramped to 60; original file
  untouched), 900 wide, centre (600,450). DIAMOND VERSION banner,
  pinned subtitle font, 556 wide, centre (600,735). PRESS ANY KEY
  at y927, blink 30 on / 15 off. Heavensent logo 556 wide, centre
  (600,1222). Ruby shine sweep kept (it already lived in the
  pre-#101 title code).
- MAIN MENU: locked v32 exactly
  (`ui-art/main-menu-default-locked-v32.md`): v32 background art
  (`main-menu-v32-background.png`), logo y180 w900, puffy-cloud
  SVG centre (600,738) 700x180, Mochii cue x170 y~790 w110,
  CONTINUE pink y788 h110 / NEW GAME yellow y918 h70 / SETTINGS
  blue y1008 h70 / BACK TO TITLE green y1098 h70. Panel labels
  follow MENU FONT; the logo is the image, never font text.
- MUSIC: PR #104 wiring kept on top (intro one-shot, title loop,
  main-menu loop; boot B + press-start M3 stay in `bootAudio.ts`).

## Presets, never default

`StartScreenPlayer` / `IntroVideoPlayer` and
`startScreenPlayback.ts` are PRESERVED (0 file deletions) as the
creator preset system: Start Screen Creator / Intro Video Creator
edit and save presets, and the players render them. No preset
plays as the default TITLE or INTRO phase. A future "set preset
as default" action would break this lock and needs Mars's own yes.

## Known conflict, reported not guessed

The pre-#101 DOM title also showed a featured-creature figure
(rotation + YogifernoTitleWalk / TitleCreatureFigure, which are
full TitleScene canvases). The locked phi spec has no figure slot
(press 927 to studio top 944 is a 17px gap), so no figure renders
on the default title. Figures are Title Creatures lane pieces
living in TitleScene/presets. If Mars wants the rotation figure
back on the default title, he says where it goes — no placement
was invented here.

## Phone fit, honestly

`LockedStage` scales by min(width/1200, height/1500) on every
resize, so on a ~390px phone the stage is 390 wide and the logo
cannot truncate. The background bleeds full-host so taller
screens do not show empty black bars around the poster. A real
390x844 phone check has NEVER been done by any browser run in
this project; the final phone check is Mars on the live build,
not a claim in this note.

## Main-menu layer fix (2026-10-26) — the v32 PNG is NOT a background

Mars's phone screenshot (2026-10-26 09:07 CDT) proved the live menu
showed TWO menus at once. Root cause, verified by looking at the
file: `src/assets/ui/main-menu-v32-background.png` IS a full-menu
picture — logo, cloud, Mochii, and all four panels painted in. The
restored MAIN_MENU drew that PNG as the background AND drew the live
logo/cloud/Mochii/buttons on top, at two different scalings (the
background stretched full-host while the stage scaled), so the two
sets misaligned on a phone.

Fix (this PR): MAIN_MENU is layers only —
- L0 `src/components/game/MainMenuBackground.tsx`: white + rainbow
  arcs (SVG, centre 600,454, palette sampled from v32) + confetti
  symbols as separate shapes. Symbol positions/sizes/colours were
  extracted from the v32 PNG's visible areas (outside the
  logo/cloud/panel/Mochii rects) into
  `src/lib/mainMenuSymbols.ts` (94 symbols) — same palette and
  density as v32, no new look hand-painted. Animation is the
  approved rise+fade+sine system (spec
  `ui-art/menu-background-animation-spec.md`): sine sway, slow rise,
  phi fade (0 at y620, 0.35 at 729, 1.0 at 905+), respawn at bottom,
  pointer-events none, behind panels, reduced-motion freezes.
- The whole locked menu is data now: `src/lib/lockedV32Menu.ts`
  (`LOCKED_V32_MENU` — canvas, logo, cloud, Mochii, panels with
  gradients/coords, background layers, animation params). MAIN_MENU
  and MainMenuBackground render FROM that object; the spec numbers
  are copied exactly, not redesigned.
- L1 logo PNG + cloud SVG + Mochii cue, spec coords, bob kept.
- L2 live panels only, spec coords/colors, exactly one set.
- The LockedStage background prop is now a plain white bleed div,
  so taller screens still show white, not black bars.
- `main-menu-v32-background.png` STAYS in the repo as the locked
  reference picture. Nothing references it from src any more; that
  is a use removal, not a file deletion (0 files deleted in this PR).

## Full snapshot preset gap — what this PR does NOT claim (2026-10-26)

Mars's definition (09:26 CDT): a saved preset is data the game
loads that takes ALL settings back to exactly how they were, so
selecting it restores all of it and nothing has to be hand-built
again. A picture, a partial reset, or the default code path alone
does NOT meet it.

Status after this PR, honestly:
- DONE HERE: the locked menu itself is data (`lockedV32Menu.ts`)
  and the default code path renders from it. The settings-store
  fields (font rows, cursor, sound, button mode, frame, themes)
  already restore through Settings' RESET row via LOCKED_PRESET.
- NOT DONE HERE, and NOT claimed: a Settings-selectable snapshot
  that swaps the menu definition. Proof of the gap, from the code:
  the existing preset fields (panelRadius, panelColor, logoSize,
  logoImage, symbolCount, layout) are read only by SettingsScreen's
  own windows — MAIN_MENU never read them (its layout was hardcoded
  literals, now it reads the locked constant directly). So today no
  user action can change the locked menu away, and no Settings row
  can swap it back — there is nothing to restore *from* yet.
- FOLLOW-UP PR must contain, in order:
  1. A persisted `activeMenuConfig` field in the settings store,
     defaulting to `LOCKED_V32_MENU`, and MAIN_MENU reading that
     field instead of importing the constant directly.
  2. A Settings row "RESTORE LOCKED V32" that writes the locked
     definition into that field (never overwriting the locked
     definition itself, never font-text logo).
  3. A change-away path that actually moves the menu (Menu Creator
     / Layout Editor writing menu-config edits the main menu reads),
     so the restore can be tested.
  4. Verification by the evidence gate: change settings away
     (font row, panel colour, layout), select RESTORE LOCKED V32,
     screenshot at 390x844, and show the render identical to the
     locked render (same coords, same panels, same animated
     background) — a pixel/diff comparison, not a claim.
  Until that PR merges, the existing RESET row restores settings
  fields only, and this PR's restore point is the locked data in
  code, not a selectable snapshot. Do not describe it otherwise.

## Perfect-menu rebuild (2026-10-26, PR: perfect menu rebuilt exactly)

Mars rejected the PR #163 render (2026-10-26 10:53 CDT: "close but
not right or correct, looks guessed"). This rebuild traces the
perfect version from the 2026-10-25 history (conversation log,
locked v32 spec, matched GIF) and restores it attribute by
attribute. Trace file (workspace checkpoint, appended not rewritten):
`hidden_files/perfect-menu-trace-2026-10-26.md`.

- Perfect animation (default): 300 symbols, 80 frames x 70ms =
  5.6s loop, rise 157.14 px/s (11px/frame full scale), sway sin*6px,
  bob sin*4px on top of rise, 2 cycles per loop, phase by golden
  angle, fade gone 620 / mid 729 / full 905, clamped never above
  620, no rotation. Symbol layer only; logo/cloud/panels on top.
- Perfect panels: FLAT fills sampled from the locked picture —
  CONTINUE #ff96c8, NEW GAME #ffe696, SETTINGS #8cd2ff, BACK TO
  TITLE #a0e6b4; upright bold Trebuchet/Arial labels (NOT the
  slanted Yagiza that MENU FONT gives by default); white halo on
  CONTINUE/SETTINGS labels and the CONTINUE sublabel (8-way
  text-shadow, painted behind the fill so the black core stays
  solid at phone scale — WebkitTextStroke washed SETTINGS out in
  the first rebuild render); 3px black border always, no gold
  selection frame, no drop shadow; selection is the cursor glyph.
- Cloud: the 600x280 SVG fills the full 700x180 spec box
  (objectFit fill — object-contain letterboxed it to ~386px).
- Slow-rise option (Mars, 2026-10-26 10:54 CDT): the PR #163 speed
  (vy 8-14 px/s, sway 3->8px, rotate +/-4deg, period 4-6s) is saved
  as `animationSpeeds["slow-rise"]` in lockedV32Menu, selectable via
  `background.animationSpeed` (or the `mochiichao-menu-animation-speed`
  localStorage key). Perfect remains the default; slow-rise is an
  option only, never the default. Shipping note: both branches are
  verified present in the built bundle (slow-rise 3x) — an earlier
  build dropped slow-rise entirely because `as const` on the locked
  object re-narrowed animationSpeed to the literal "perfect".
- Selection-hint line removed: the "Start a new adventure." div at
  stage top 1210 was in the PR #163 render but is NOT in the locked
  picture or Mars's verification proof; it sat in the symbol zone.
  Removed (MAIN_MENU only). Selection is still the cursor glyph.
- Verification (headless Chromium, 390x844): exactly one panel set;
  spec coords to the pixel (NEW GAME 98,477 / SETTINGS 98,506 /
  BACK 98,535, all 195x23; logo 49,237,293 wide; cloud 81,389,228
  wide; Mochii 55,435,36 wide); 300 SVG symbol groups; frame diff
  31,275 px with panel interiors 0 px changed; SETTINGS tap opens
  Settings. Side-by-side proof (new dated names, PR #163 proof
  untouched): `ui-art/perfect-menu-side-by-side-20261026.png` and
  `ui-art/perfect-menu-render-20261026.png`.
- The "Full snapshot preset gap" section above is unchanged by this
  PR: the Settings-selectable full snapshot is still the follow-up
  item, NOT claimed here. This PR makes the DEFAULT menu perfect;
  it does not by itself deliver the selectable snapshot.
