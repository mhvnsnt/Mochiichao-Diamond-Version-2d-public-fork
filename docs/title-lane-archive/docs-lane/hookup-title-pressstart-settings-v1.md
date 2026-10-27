# Hookup v1 — Boot → Title → Press Start, Main Menu locked, Settings full
Mars, 2026-10-25 — UI Art lane spec + wiring blueprint.
This is the hookup for everything UP TO Press Start, from the most
recent title pull (boot-title-pressstart-pull-local.md).
Main Menu is NOT changed by this hookup. Main Menu v32 stays locked.

## 0. Gap rule — read this first, it is how Mars sees the gaps
- In the GAME / PUSHED version, a gap is NEVER a Pokemon file.
  A gap is a labelled Mochiichao placeholder in the exact slot, e.g.
  a panel that says, in Mochiichao wording, what is missing and
  that original art / sound is needed. That way Mars can see every
  gap to fill, and nothing Pokemon ships in a public build.
- In the LOCAL-ONLY version, a left-out reference may sit in that
  same slot for exact comparison, gitignored, marked temporary,
  swapped to the Mochiichao placeholder before any push.
  Push gate is unchanged: replacement count = 0 for Pokemon items
  before a PR. A gap placeholder is not a Pokemon item — it is ours.
- No ROMs, no Pokemon logo tiles, art, music, cries, dialogue
  text, or names are copied into this file or into a PR.

## 1. Hookup flow — boot to press start, no main-menu change
Order, same as Pokemon, same as the pull file:
1. BOOT — black screen, M Heavensent Studios logo alone.
   HAVE: logo file (official upload, transparent version).
   Phi boot size: 742 wide, centre (600, 750) on a 1200x1500 canvas.
   GAP: boot hold time (Mars decision, not invented), boot sound
   (see §2).
2. INTRO MOVIE — skip with any key, music stops on skip.
   HAVE: scene order and beats (FireRed: studio -> grass close-up
   -> forest pan + creature close-ups -> fight; HeartGold: 5 scenes,
   each Init -> Main -> Exit, sprite manager; Crystal: 28-scene
   jumptable, any-key exit).
   REPLACE in exact slots: studio -> Heavensent scene (star,
   sparkles, reveal, presents beat, Mochiichao wording only);
   grass close-up -> Mochiichao world close-up; forest pan ->
   Mochiichao world pan + Mochii/partner close-ups; fight beat ->
   Mochiichao creature fight beat.
   GAP (labelled in game, not Pokemon art): all intro scene art.
   Until original art exists, each intro scene shows its GAP panel.
3. TITLE — phi spec, from title-screen-spec.md, most recent pull.
   Phases, any key skips to next phase:
   black -> shine sweep (x+=4, brighten to 31, darken to 0, twice)
   -> version banner slides left+right -> logo slides up slightly
   -> PRESS ANY KEY fades in + blinks -> studio logo fades in bottom
   -> A/Start -> white fade -> Main Menu v32.
   HAVE: logo 900 centre (600, 450), DIAMOND VERSION 556 centre
   (600, 735), PRESS ANY KEY at phi line 927 blink 30 on / 15 off,
   Heavensent logo 556 centre (600, 1222) top 944, particles =
   teal/pink symbols rising (FireRed spawner pattern, Pixi ticker).
   GAP: title background scene art (original only, same gap as
   main-menu NEED #10), title music (original, NEED, structure only:
   plays on title, fades out on A/Start).
   Platinum extra pulled: intro fade black -> white -> fade main,
   camera move-in (Pixi ease, not 3D), blur on exit, BGM fade 60.
   Black 2 extra: timeout 6780, hide layers 1740 — Mochiichao
   timeout is a Mars decision, NOT silently copied as a hidden
   timer; the timeout row, if used, is a Settings row, not a secret.
4. PRESS START — PRESS ANY KEY, same beat in every generation.
   HAVE: blink 30/15, A/Start/tap -> white fade -> Main Menu.
   Crystal/Gold/Yellow/Platinum press beats are the same slot:
   press text blinks, any key advances, exit fade follows.
   GAP: none in the press beat itself — the press beat is fully
   specced. What is still GAP is the title art/music behind it.
5. MAIN MENU — DO NOT TOUCH.
   v32 locked: logo 900, cloud (600, 738) 700x180, CONTINUE 788
   pink, NEW GAME 918 yellow, SETTINGS 1008 blue, BACK TO TITLE
   1098 green, stack ends ~1168, background full 905, gone 620,
   fade 285 (620-729 fainter, 729-905 stronger).
   This hookup ends AT Press Start. Press Start -> white fade ->
   existing Main Menu v32, unchanged. No panel, colour, coordinate,
   or lock change is made by this hookup.

## 2. Boot sound — hookup slot, sound still NEED
Slot: plays on boot logo reveal, stops / fades when intro starts.
Design (from research, labelled): 2-5 seconds, 3-5 elements,
rising anticipation shape then resolve. Original Mochiichao sound.
GAP in game until Mars ear-checks a composed sound. No Pokemon
chime is copied, and no sound file is claimed to exist.

## 3. Settings — FULL pull, all games, wired in Pokemon layout
Mars's rule for this section: settings structure is functional,
not proprietary expression. Short functional labels (TEXT SPEED,
etc.) are used as row names; no Pokemon message text, dialogue,
or copyrighted wording is copied. All values are Mochiichao's own
implementation of the same function.

### 3a. Union across games — every row, no game dropped
FireRed option_menu.c, counts {3,2,2,2,3,10,0}:
  TEXT SPEED 3, BATTLE SCENE 2, BATTLE STYLE 2, SOUND 2,
  BUTTON MODE 3, FRAME 10, CANCEL 0.
HeartGold options_app.c, entries TEXT SPEED, BATTLE SCENE,
  BATTLE STYLE, SOUND METHOD, BUTTON MODE, FRAME, entry 6 (close):
  same 6 functional rows, FRAME = 20 choices, values saved back
  to player Options on exit, frame reloads live.
Platinum options_menu.c, counts {3,2,2,2,3,20,0} in order:
  TEXT SPEED 3, SOUND MODE 2, BATTLE SCENE 2, BATTLE STYLE 2,
  BUTTON MODE 3, MESSAGE BOX FRAME 20, CLOSE 0.
  Note: Platinum calls FRAME "MESSAGE BOX FRAME" — same slot,
  different label. Mochiichao row name: FRAME.
Black 2 config_panel.c (title/start settings panel):
  TEXT SPEED, BATTLE SCENE, BATTLE STYLE, SOUND — same 4 core rows,
  in a scroll panel with a confirm bar. No new functional row
  beyond the union above; button/frame rows come from the other
  games, not invented here.
Crystal / Gold / Yellow options: same core (text speed, battle
  scene, battle style, sound) in a list menu; GB-printer-only rows
  are hardware-only and are DROPPED, labelled, not carried over —
  Mochiichao has no GB printer, so that row would be dead.
Union, deduplicated, in FireRed order (the order Mochiichao uses):
  1 TEXT SPEED — SLOW / MID / FAST
  2 BATTLE SCENE — ON / OFF
  3 BATTLE STYLE — SHIFT / SET
  4 SOUND — MONO / STEREO (HeartGold/Platinum: SOUND METHOD/MODE,
    same slot)
  5 BUTTON MODE — NORMAL / LR / L=EQUALS=A
  6 FRAME — 1-20 (FireRed 1-10 base, HeartGold/Platinum 11-20 extra)
  7 CANCEL / CLOSE / BACK — saves and exits
No other functional settings row exists in these games' options
menus. If a later game adds one, it goes here as a new row, not
as a silent change to an existing row.

### 3b. What each row DOES in Mochiichao (wiring, not just a label)
- TEXT SPEED: dialogue text reveal speed. SLOW / MID / FAST map
  to the game's dialogue printer speed. Default MID, like Pokemon.
- BATTLE SCENE: ON = Pixi battle animations play; OFF = animations
  skipped, damage numbers / results only. Same function as Pokemon.
- BATTLE STYLE: SHIFT = after an opponent creature faints, the
  player is offered a switch before the next creature comes out;
  SET = no switch offer, next creature comes out directly.
- SOUND: MONO / STEREO WebAudio output mode. No Pokemon audio file
  is used; the toggle only changes output routing.
- BUTTON MODE: NORMAL = A confirm / B back as in game; LR =
  shoulder-style alternate mapping; L=EQUALS=A = that button also
  confirms. Mapped to keyboard/touch controls in the web game,
  labelled on the help bar, not hidden.
- FRAME: 1-20, ORIGINAL Mochiichao frames in those slots, Y2K
  glossy rounded panels as the Mochiichao frame set. Changing
  FRAME reloads the window graphics live on return to the real
  screen — Pokemon's live-preview pattern, not a preview popup.
  Frame palettes: stdpal-style palette rows become Mochiichao
  palette rows (pink/yellow/blue/green + per-menu colours).
- CANCEL: saves all rows to the player's saved settings and
  returns to the previous screen (Main Menu -> SETTINGS -> back).
  Settings are SAVED, not session-only. That is the "locked in
  saved" part Mars asked for: a changed setting persists in the
  save, and Reset to Locked Default (v32) is a row, not a delete.

### 3c. Look — Pokemon layout, Y2K skin, nothing else changed
Layout, exactly Pokemon, FireRed option_menu.c:
  header window 26x2 at (2,3), list window 26x12 at (2,7),
  help bar 30x2 at (0,0), label left / value right,
  UP/DOWN wraps, LEFT/RIGHT cycles value, CANCEL saves+exits.
Skin, exactly Mochiichao main-menu Y2K:
  glossy rounded panels, white border, soft glow, neon+pastel
  colours, per-menu colours (Settings blue, like the v32 SETTINGS
  panel), stars/hearts accents, OFL fonts only (Bungee / Titan One /
  Fredoka in Phase 2, never a paid font, never a Pokemon font file).
  Only the SURROUNDING look changes — the layout, order, inputs,
  and save-on-exit behaviour stay Pokemon, as Mars asked.
  No terminal menu, no overlay popup. Settings is a dedicated
  full screen, then Menu Creator / UI Creator / Layout Editor /
  Cursor Creator / Panel Frame Editor are full screens under it,
  B: BACK to the previous screen, same as CANCEL.

### 3d. Settings sub-menus — same layout, same skin
Settings -> Menu Creator (Logo / Background / Animation / Panels,
  NEXT PAGE row, presets only, Reset to v32)
Settings -> Menu Creator -> UI Creator (Menu UI / Battle UI /
  System UI, element edit pages: Frame, Outline, Radius, Border,
  Glow, Panel Color, Text Color)
Settings -> Menu Creator -> Layout Editor (Menu / Battle / System
  layout: X/Y/W/H, spacing, order, anchor, safe area)
Settings -> Menu Creator -> Cursor Creator (Shape, Color, Shadow,
  Glow, Size, Blink, Highlight, Sound on Move)
Settings -> Menu Creator -> Panel Frame Editor (Frame 1-20, Palette,
  Radius, Border, White Border, Gloss, Glow, Shadow, Gradient,
  Panel Color per menu)
All full screens, all Y2K skin, all presets until Mars locks a new
default. No sub-menu overwrites v32.

## 4. Other menus — same upgrade rule, decked out, not replaced
Mars: same for any other menus — upgrade and deck out their menus
completely, make them way cooler, in our theme.
Rule, applied to every menu, in Pokemon order first:
- Pause / Start Menu: FireRed start_menu order first, then Y2K skin,
  per-menu colour, glossy panels, cursor, help bar. Full screen
  over the world, not a popup.
- Bag: pocketed list (Capture / Medicine / Storage / Other),
  cursor, icon + description, Use / Give / Toss / Quit — Pokemon
  bag structure, Y2K skin, Bag green.
- Shop: Buy / Sell / Quit first, then item list, confirm before
  money moves, back to list — Pokemon shop structure, Y2K skin,
  Shop yellow.
- PC Storage: boxes, grid slots, Deposit / Withdraw with confirm,
  cursor preserved per box — Pokemon storage structure, Y2K skin,
  PC blue.
- Party / Roster: one box per slot, preserved cursor, context menu
  Summary / Switch / Give / Take / Cancel — Pokemon party structure,
  Y2K skin, Roster pink. Release is NOT added without Mars's say-so.
- Battle UI: healthboxes, 2x2 action menu + PP/TYPE, message window
  bottom full-width, HP green >50% / yellow >20% / red <=20% —
  Pokemon battle structure, Y2K skin, Battle red/orange.
- Save Menu: save slots, overwrite confirm before erasing, saving
  message, result — Pokemon save structure, Y2K skin.
- Dialogue: bottom full-width window, 2 lines, arrow, text speed
  row applies here, frame row applies here.
In every case: Pokemon order/inputs/structure first, Mochiichao
Y2K skin on top, gaps labelled in the exact slot, never a Pokemon
file in a PR. "Way cooler" = Y2K gloss, glow, stars, orbits, phi
layout, matched sine animation where a menu has a symbol layer —
not a new menu pattern invented outside Pokemon flow.

## 5. Main-menu repo batch — prepared, game code NOT in it
Batch type: additions only, 0 deletions, 0 overwrites, no src/ changes.
Verify first: current main head before branching. Last verified in
this lane: PR #25 merge a084b5ff (main, Pages build). The batch
worker must re-verify main head via API before branching — if main
moved, branch from the new head, do not branch from a stale head.
Files in the batch (docs/assets only):
  v28, v29, v30, v31 (option), v32, annotated v32,
  main-menu-default-locked-v32.md,
  menu-background-animation-spec.md, all animation GIFs
  (flow demo, flow actual, animated-full, this-one-moving,
  sine-only, rise-fade-sine-all, rise-fade-sine-matched,
  rise-fade-sine-current-20261025),
  settings-menu-creator-spec.md + Pokemon-style mocks,
  cursor + panel sub-specs, pokemon-first-rule.md,
  title-screen-spec.md, title-screen-pull-100pct.md,
  boot-title-pressstart-pull-local.md, this hookup file,
  subtitle assets + golden placement, sparkle layer, Y2K panel
  frames, cursor asset, Heavensent logo files, conversation-log
  entries after v27, ui-art-options-index.md update.
NOT in the batch: any src/ game code, any Pokemon file, any
title-art PNG stopped for likeness drift, any file already on main.
Game wiring (title/press/settings in code) is a SEPARATE PR after
this docs/assets batch, diffed vs main via API, build/lint/
validate first, Pages rebuild + playtest after — do not claim
game wiring is done when the docs batch lands.

## 6. What is still GAP, in one list (so Mars can fill it)
- Boot hold time, boot sound file, intro scene art (all scenes),
  title background scene art, title music (original),
  subtitle final OFL font, mascot behind logo,
  Diamond title (content search), HeartGold intro scene contents
  in detail, Crystal/Gold/Yellow options details beyond the core
  rows (hardware rows dropped, labelled).
- Settings functional wiring in game (spec is complete, code is not).
- Title/press wiring in game (spec is complete, code is not).
- Main-menu v32 game wiring to Y2K panels/animation (spec is
  complete, code is partial, 44% in the last audit).
Every GAP above is a labelled Mochiichao placeholder in the pushed
version, and a local-only reference in the local version, never a
Pokemon file in a PR.
