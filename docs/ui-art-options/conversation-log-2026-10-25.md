# UI Art conversation log — 2026-10-25 (UI Art lane, ongoing)

STANDING RULE (Mars, 2026-10-25 16:36 CDT): document ALL of our
conversation and everything we say from here going forward, in the
repo and in documents. Keep researching color / neurochemistry /
design research like this to continue building the game. This file
is the log for this lane; append, never rewrite history, never
delete earlier entries.

## 2026-10-25, main menu / logo / Y2K thread
- FireRed FIRST, one by one (v11 log): FireRed 100%, then HeartGold,
  then Black 2. NOT all games at once. Element -> replacement ->
  HAVE / NEED, no random art without a label. NO battle on main menu.
- Main menu = CONTINUE (tall, stats) / NEW GAME (short) / SETTINGS
  (real settings, not a note) / BACK TO TITLE, separate framed
  windows, FireRed main_menu.c:74-120, palette 15.
- Logo method (Pokemon): Chris Maple, 1998, 1 month, paper + toys
  only, chunky arched letters, yellow fill / blue outline, version
  word below in a different font/color per game.
- Y2K style (Mars): bubbly italic rounded, chrome gradient, stars,
  orbit rings. Mixed Y2K: blue bubbly (Areion/Cyber Angel) + black
  blocky white-outline (Bloom Bloom, Giddy Up, Reveal, The Stealer).
  Menus each a different neon/pastel color, glossy rounded, white
  border, soft glow. Feel = Japanese Y2K anime, kawaii, sparkles.
  Paid fonts NOT bought/copied without Mars approval.
- MAIN LOGO (Mars upload, 16:11 CDT): chrome Y2K MOCHIICHAO, arched,
  blue/pink chrome, stars + orbit ring, black background.
  File: user/files/1000177400_12_rofh.png, copy ui-art/
  mochiichao-main-logo-official.png. Supersedes logo drafts v1/v2/v3
  as main logo; v1-v3 stay as options (PR #20).
- Main menu versions v12-v26 (all saved as options, none deleted):
  v12 logo top + dark panels; v13 logo middle + v3 colors + pause
  menu colors; v14 white bg, blue/pink circles, blue/pink hearts,
  black sparkles; v15 circles kept + 90-degree rainbow semi-circles,
  decorations lowered to logo centre; v16 rainbow rotated clockwise
  (WRONG direction, opening left); v17 rainbow rotated 90 deg
  counterclockwise from v16 (Mars correction); v18 white puffy
  cloud over rainbow, under logo, behind opening + CONTINUE;
  v19 real SVG puffy cloud, wider, NOT circles; v20 cloud back to
  v18 centre (600,738); v21 cloud centred 50/50 horizontally
  (250-950, centre 600); v22 cloud behind logo centre (WRONG move);
  v23 cloud on top of logo, behind CONTINUE (WRONG move, scale/
  place changed); v24 LAYER ONLY: cloud back to v21 place/scale,
  layer rainbow < logo < cloud < CONTINUE; v25 everything centred
  50/50 at x=600 (logo, arcs, circles, cloud, panels, hearts/stars
  mirrored — v24 was already mostly centred, v25 fixed 10px heart/
  star asymmetries); v26 golden-ratio spread: 42 solid-color symbols
  (stars/hearts/diamonds/circles, black/blue/pink/yellow/purple/
  green/red, one solid color each), golden angle 137.508°, radius
  sqrt(n)*phi, sizes scaled by phi, spread around white background.
- Color / neurochemistry research (2026-10-25, deep research):
  see docs/research/color-neurochemistry-design.md in this repo
  (full report) + artifact mochiichao-color-and-neurochemistry-design.
  Headlines: keep 75-85% of bottom white area blank, 12-18 symbols
  only, fade 100% behind logo to pure white 16-24px above CONTINUE,
  pastel Y2K (baby-blue/mint calm, bubblegum pink bonding, butter-
  yellow reward, lavender curiosity), saturated red/orange 0% field /
  <2% total. Dopamine = anticipation, not pleasure after reward.
  Serotonin = pride/recall (CONTINUE stats). Oxytocin = bonding
  (cute mascot). Endorphins = real challenge, not menu clicks.
  Closest lab studies (not menu colors): Koepp Nature 1998 PET
  dopamine during video game; Kim Tetris monetary reward PET
  (caudate -15%, putamen -30%); Santaniello 2025 blood oxytocin/
  serotonin during dog AAA; Takagi iScience cat-owner oxytocin;
  Dunbar 2016 group singing pain-threshold endorphin proxy.
  NO lab study measures dopamine etc. from a menu color/symbol
  count — recommendations are to A/B-test, not proven thresholds.
- PR #20 MERGED (15:47 CDT): docs/ui-art-options/, 11 files, 0 deletions.
  Next options batch (v12-v26, logo, cloud SVG, this log, research)
  is to be pushed the same way: additions only, 0 deletions, 0 overwrites.

## v27 full research menu (2026-10-25, Mars request)
- All research + all previous elements in one: pastel Y2K, white dominant,
  fade pastel top -> pure white 20px above CONTINUE, buttons on 100% white,
  bottom 75-85% blank with only 15 small pastel symbols (golden angle),
  no saturated red/orange, CONTINUE sublabel Last: Core Fragment
  (serotonin cue), Mochii mascot by CONTINUE (oxytocin cue), yellow
  sparkles (dopamine/anticipation cue), lavender stars (curiosity).
  Shown as mochiichao-main-menu-full-research-v27.png.

## Similar-state rule (Mars, 2026-10-25 16:38 CDT)
- Synchronized singing / exercise do NOT have to be literal.
  Any activity that puts you in a similar mental state / activates
  similar systems counts: synchrony, rhythmic prediction, shared
  attention, laughter/play, helping, creating, nature, achievement.
  Study those equivalents and build them as gameplay activities,
  not as literal singing/exercise mini-games.

## v28 full-fill background (2026-10-25 16:39 CDT, Mars, replying to v27)
- Background symbols fill from HALF of CONTINUE down, full width
  across the white screen, to the bottom. Above CONTINUE, for about
  5% of screen height (75px on 1500 canvas), the background fades
  upward, behind the Mochi logo, arcs, and cloud, over white.
  Layer: white -> background symbols (fade band above CONTINUE)
  -> arcs/circles/hearts -> logo -> cloud -> panels on top.
  This is a Mars direction and supersedes the v27 research
  recommendation (75-85% blank, 12-18 symbols only) for this version;
  v27 is kept as an option, not deleted.
  Shown as mochiichao-main-menu-full-fill-v28.png.

## v29 lower start + double fade (2026-10-25 16:41 CDT, Mars, replying to v28)
- Background start moved LOWER: full zone starts at y=1280, below
  all menu panels (panels end ~1168), not at half-CONTINUE (843).
- Upward fade is now TWO 5% bands (75px each on 1500 canvas):
  1280-1205: fade 90->255 (first 5%), 1205-1130: fade even more
  0->60 (second 5%), above 1130: gone, pure white.
- Placement still golden ratio (137.508 deg, sqrt(n) radius, full width).
- Layer: white -> background (double fade) -> arcs/logo/cloud -> panels.
  Shown as mochiichao-main-menu-lower-fade-v29.png.

## v30 reach up 25% higher (2026-10-25 16:42 CDT, Mars, replying to v29)
- Background shifted UP 25% of screen height (375px on 1500 canvas)
  from v29: start 1280 -> 905, fade1 1205-1280 -> 830-905,
  fade2 1130-1205 -> 755-830, gone above 755 (was 1130).
- Double 5% fade structure kept, golden-ratio placement kept.
- Panels still on top, so fade behind CONTINUE is mostly hidden
  except the faint band 755-788 above CONTINUE top.
  Shown as mochiichao-main-menu-reach-up-v30.png.

## Golden-ratio reading of v30 (2026-10-25 16:44 CDT, Mars)
- v30 background: full start 905, fade top gone 755.
- Golden lines on 1500 canvas: 573 (38.2% down) and 927 (61.8% down).
- v30 full start 905 is 22px from 927 golden line — essentially on it.
- v30 fade top 755 is 182px below 573 golden top, 172px above 927 —
  i.e. at ~50%, not at phi. Perfect phi top = 573 (v31).
- Logo centre 454, cloud centre 738 (close to v30 fade top 755),
  CONTINUE top 788, menu stack ends 1168.

## v32 phi fade length, back to v30 (2026-10-25 16:45 CDT, Mars)
- Correction: v31 moved background too high, left too much space.
  v30 start is PERFECT, do NOT move start up/down, do NOT add
  negative space underneath. Question was fade LENGTH only.
- Golden ratio fade, measured from v30 background top down:
  v30 bg height 755->1500 = 745px. Phi split: full 460px,
  fade 285px (38.2% of bg height, full/fade = 1.614 ~ phi).
  v30 fade was only 150px (20.1%), too short.
- v32 keeps v30 start 905 and bottom 1500 exactly, only fade
  length changes to 285px: top 620, split 729-905 stronger,
  620-729 fainter, gone above 620.
  Shown as mochiichao-main-menu-phi-fade-v32.png.

## LOCKED DEFAULT v32 (2026-10-25 16:47 CDT, Mars)
- v32 is LOCKED as main default main menu placement.
- Rule: a later tweak changes the default ONLY when Mars locks
  it in again. Until then v32 stays default.
- File: ui-art/main-menu-default-locked-v32.md (all coordinates).
- Golden line question answered from gone point 620: screen phi
  lines 573 / 927; fade internal phi line 729 (620+109 fainter,
  729+176 stronger, ratio 1.615).

## LOCK CONFIRMED + background animation (2026-10-25 16:49 CDT, Mars)
- v32 LOCKED again, confirmed as the one. Default rule stands.
- Animation question: how to move/dance the fade background symbols
  in an industry-standard / game-file way, not hand-tooled.
- Spec: ui-art/menu-background-animation-spec.md — PixiJS v8 ticker
  (MIT, already in game) + FireRed sine-table method
  (battle_anim_effects_1.c AnimTranslateLinearSingleSineWave:
  offset = sine * amplitude on top of base position).
- Modes: A bob in place (6-12px, 4-6s, phase by golden angle,
  opacity = locked fade at that y); B flow up and disappear
  (drift -8 to -14 px/s, sway grows 3->8px, opacity follows fade
  to 0 at gone 620, respawn at bottom, fixed object pool).
- Demo GIF: menu-background-flow-demo.gif (flow + bob + fade at gone).

## Sine-only correction (2026-10-25 17:05 CDT, Mars)
- Correction: previous scrolling demo was cheap/fast, NOT Pokemon
  sine, and moved whole layers / above logo. Do NOT do that again.
- Correct method: SYMBOL LAYER ONLY, FireRed
  AnimTranslateLinearSingleSineWave: offset = sine * amplitude,
  base position unchanged, NO upward drift, NO scrolling tile.
- Clamps: symbols stay in layer 620-1500 full scale (310-750 half),
  never above gone 620, never over logo/cloud/panels — top layers
  drawn ON TOP of symbol layer, panels opaque.
- Demo: menu-v32-sine-only.gif, 300 symbols, v32 density, sine bob
  6-12px full scale, phase by golden angle.

## Combined rise + fade + sine, ALL symbols (2026-10-25 17:08 CDT, Mars)
- Correction: sine-only had bob but NO rise/fade loop; flow-only
  had rise/fade but NO sine and was sparse. Do NOT regress to
  either alone, and do NOT blame default programming.
- Combined, on ALL 300 v32 symbols (full density, across bottom):
  rise = modulo loop zone 620-1500 (310-750 half), drift = zone
  / frames, seamless; fade = locked v32 (full 905, faint 729,
  gone 620); sine = FireRed AnimTranslateLinearSingleSineWave
  on top of rise (bob 6-12px full, sway half, phase golden angle).
- Symbol layer only, top layers (logo/cloud/panels) on top,
  clamped never above gone 620.
- Demo: menu-v32-rise-fade-sine-all.gif

## Speed + sway matched to old flow GIF (2026-10-25 17:10 CDT, Mars)
- Old flow GIF (menu-background-flow-actual-menu.gif) parameters
  are the reference: 80 frames x 70ms = 5.6s loop, rise drift
  5.5px/frame half scale (440/80), side sway 3px, bob 2px.
- Combined version updated to match exactly those numbers:
  FR 80, duration 70, drift 5.5, dx sin*3, dy sin*2, frequencies
  made seamless (2 cycles / 80 frames = 0.157 rad/frame, vs old
  0.15 / 0.20, so loop has no jump).
- Still ALL 300 symbols, rise + fade + sine, symbol layer only,
  top layers on top, locked v32 placement unchanged.
- Demo: menu-v32-rise-fade-sine-matched.gif

## Settings > Menu Creator approved (2026-10-25 17:12 CDT, Mars)
- Matched animation is PERFECT (speed 5.5, sway 3, bob 2, all 300).
- New: Settings sub-menu "Menu Creator" that lets Mars create/edit
  the main menu screen with everything used to create v32:
  logo (size/position/outline/backing/chrome/orbit/arcs),
  background (symbols/count/colors/golden angle/fade/gone/golden
  line/coverage), animation (rise/sine/fade/loop/reduced motion),
  panels/outline feel (colors/radius/border/glow/cloud/mascot/
  CONTINUE sublabel). Live preview on real menu, save as preset,
  only becomes default on a new lock. Reset to v32 always visible.
- Phase 2 later: font, full colors, themes, day/night colorways.
- Spec: settings-menu-creator-spec.md
  Mock: settings-menu-creator-mock.png

## Pokemon-first rule + Menu Creator v2 (2026-10-25 17:14 CDT, Mars)
- Correction: v1 Menu Creator mock was a dark terminal overlay popup.
  Mars does NOT want that. Rule, forever, all agents: build from real
  game files FIRST, then build Mars's request on top of that
  structure, never hand-tool new shit outside real game flow.
- FireRed option_menu.c read: full dedicated screen, header 26x2
  (2,3), list 26x12 (2,7), help bar 30x2, label left / value right,
  UP/DOWN wrap, LEFT/RIGHT cycle, CANCEL saves+exits, FRAME live
  reload. HeartGold options_app.c same structure, later.
- Menu Creator v2: full screen, same layout, 4 pages, NEXT PAGE
  row, B: BACK saves to Settings, preview = real main menu.
- Rule written to: ~/AGENTS.md, ~/SOUL.md, ~/MEMORY.md,
  ui-art/pokemon-first-rule.md, goal files/pokemon-first-rule.md
  (staged for next additions-only PR batch, NOT yet PR'd).
- Spec v2: settings-menu-creator-spec.md
  Mock v2: settings-menu-creator-pokemon-style.png
  Mock v1 overlay: superseded, do NOT use as presentation.

## Pokemon-first confirmed (2026-10-25 17:16 CDT, Mars: "Exactly")
- Rule applies to anything Mars asks. Sources: game files first,
  then open source, then anything else legal we can find, then
  industry-standard and academic projects. Those add to, never
  replace, the game-file structure. No hand-tooled terminal UI.
- Rule files updated (ui-art + goal files, staged for next PR).

## UI Creator sub-menu (2026-10-25 17:18 CDT, Mars)
- Inside Menu Creator, a sub-menu called UI CREATOR (also UI
  Editor, NOT Menu Editor). Path: Settings -> Menu Creator ->
  UI Creator, all full screens, no popups, B: BACK to Menu Creator.
- Pokemon-first: same option_menu.c layout as Menu Creator v2,
  plus FireRed FRAME precedent (pick frame type, live reload).
- Pages: Menu UI / Battle UI / System UI; each element opens its
  own full-screen edit page (Frame, Outline, Radius, Border, Glow,
  Panel Color, Text Color). Edits are presets, lock rule unchanged.
- Spec appendix in settings-menu-creator-spec.md
  Mock: ui-creator-pokemon-style.png

## UI vs Layout — both sub-menus (2026-10-25 17:19 CDT, Mars)
- UI and layout are NOT the same, so BOTH exist inside Menu Creator:
  UI CREATOR = what it looks like (frame/outline/radius/glow/color).
  LAYOUT EDITOR = where it goes / how big (x/y/w/h/spacing/anchor).
- Path: Settings -> Menu Creator -> UI Creator, and Settings ->
  Menu Creator -> Layout Editor. All full screens, B: BACK to
  Menu Creator.
- Everything pulled in: game files (FireRed windows/inputs,
  HeartGold dialogue, Black 2 reference), Mochiichao HAVE
  (v32, Y2K, uiArt, Pixi positions), open source (PixiJS MIT,
  Tuxemon GPL reference, Kenney CC0, game-icons CC BY,
  OFL fonts Phase 2), industry/academic rules (60-30-10, phi,
  reduced motion, 48px touch). Paid/commercial/ROM excluded,
  same boundary as tools/README.
- Spec appendix in settings-menu-creator-spec.md
  Mock: layout-editor-pokemon-style.png

## All Pokemon frames/fonts/options + extra freedom (2026-10-25 17:20 CDT, Mars)
- Pokemon-native: Text Speed 3, Battle Scene 2, Battle Style 2,
  Sound Mono/Stereo, Button Mode 3, Frame FireRed 10 / HeartGold
  20, palettes stdpal_0-4 + option/main/signpost/quest, fonts
  Small/Normal/Bold/Male/Female/Braille, text fg/bg/shadow colors,
  dialogue X/Y/W/H + arrow, all window panels listed.
- Extra freedom, labelled X (not Pokemon options): radius, glow,
  shadow, opacity, border width, white border, gradient, per-
  element frame override, cursor style, animation rows, sound on
  move, 48px touch, safe area, day/night override, preset JSON.
- All as rows in Menu Creator / UI Creator / Layout Editor.
- Spec appendix in settings-menu-creator-spec.md

## Pull-all-then-edit rule requested, NOT adopted (2026-10-25 17:21 CDT, Mars)
- Mars asked for a rule against Muse saying not to pull stuff in:
  pull everything in, then immediately edit it to be proprietary
  to his universe in the same second.
- NOT adopted as a rule. Boundary held: no commercial Pokemon
  art/code/dialogue/towns/names, no ROM downloads, no paid fonts
  without licence, and no such files in the public repo — that is
  a distribution / takedown risk, not an invented assistant rule.
- What IS adopted, and gives Mars the same speed: in the same
  turn, for any element, show the Pokemon structure from the
  decomp files already in the repo, then immediately write the
  Mochiichao version into that exact slot. No proprietary file
  is copied or stored, the Mochiichao version is proprietary
  from the first write. Private-local test placeholders only,
  marked, gitignored, never PR'd; releasable build = 0 placeholders.
- Paid fonts: if Mars approves buying a specific licence, that
  font can then be used. Until then, OFL lookalikes.
- ROMs: no downloads; only a dump Mars uploads himself, kept
  private and local, never in the public repo.

## Pull-then-edit-5-minutes requested again, NOT adopted (2026-10-25 17:22 CDT, Mars)
- Mars: put Pokemon logo/dialogue/art/code in, nobody will see it,
  he would change it within 5 minutes, same as menu setup.
- NOT adopted for the public repo. Reason given: a public repo
  is public, and git history keeps a pushed file forever even
  after it is edited 5 minutes later — editing does not erase
  the earlier commit/PR diff. "Nobody will see it" is not true
  for a pushed public repo.
- Offered alternative: local-only, never-pushed test in the same
  session, replaced before any PR, using a structural stand-in
  (not the actual Pokemon logo/dialogue/art/code) for verification.

## Local-only proprietary test rule — AGREED (2026-10-25 17:23 CDT, Mars)
- Mars agreed to the local-only workflow: anytime he asks to put
  something proprietary-type (dialogue, art, exact code) into the
  game, do it LOCALLY ONLY, and edit/replace it with the
  Mochiichao version BEFORE any push.
- Precise form, to avoid a leak into a PR: local test item is a
  marked stand-in in the exact slot, gitignored, never committed,
  never in a PR, replaced with the Mochiichao version before any
  push, and a releasable build has 0 such items. The actual
  Pokemon file is not copied into the repo, even locally as a
  shipped asset — the test is the structure + a stand-in, then
  the Mochiichao rewrite.
- This is now the standing workflow for such requests, no need
  to re-argue it each time.

## By-parts clarification (2026-10-25 17:24 CDT, Mars)
- Mars: you can't copy 100% of a complete file in at once, but
  you can do it by parts.
- Clarified, not agreed as a loophole: doing it by parts is the
  RIGHT way to CONVERT — one window, one dialogue beat, one
  frame slot at a time, each part immediately rewritten as
  Mochiichao. It is NOT a way to reassemble 100% of a proprietary
  file piece by piece — that ends up as the same full copy, just
  slower, and is still not done. Parts = conversion steps, not
  reconstruction steps.

## Backbone clarification CONFIRMED (2026-10-25 17:25 CDT, Mars)
- Mars confirms: by-parts conversion is the way, NOT reassembling
  100% of an original file, NOT making an exact Pokemon game.
- He wants their stuff as the BACKBONE only, then altered to his
  universe and his game. That is exactly the Pokemon-first rule:
  structure/template from decomp files, Mochiichao words/names/
  art in each slot, end state is a Mochiichao game, not a Pokemon
  game.

## Dialogue conversion example CONFIRMED (2026-10-25 17:26 CDT, Mars)
- Mars's own example of the backbone rule: a dialogue BEAT where
  an NPC says they need to go heal their creature is kept as a
  beat (place, timing, reason), but the WORDS are changed
  immediately to Mochiichao universe words — e.g. they need to
  go heal their Mochiichao, not a Pokemon.
- That is the conversion rule in action: beat/order/structure
  from the files, words/names rewritten to Mochiichao in the same
  step. No Pokemon dialogue line is kept as a shipped line.

## Interchangeable prototype elements (2026-10-25 17:27 CDT, Mars)
- All first prototype drafts' elements must be bringable back,
  interchangeable, through Menu Creator / UI Creator / Layout Editor.
- Index created: menu-elements-interchangeable-index.md —
  logos v1/v2/v3/official, white + blue gradient backgrounds,
  blue/pink circles, hearts, black stars, rainbow arcs, puffy
  cloud (all placements), panel colors, symbol counts/coverage/
  fade versions v26-v32, animation modes static/sine/flow/
  combined/matched, Mochii cue, sublabel, cursor, 48 SVG pieces.
- Rejected-as-default kept as options, labelled. NEED items
  (title scene, DIAMOND VERSION subtitle, etc.) still marked NEED.

## Main menu NEED list, fastest first (2026-10-25 17:28 CDT, Mars)
- List created: main-menu-need-list-100pct.md, 10 main-menu items
  + 5 next screens, in fastest-first order, 100% (no skipping).
- Fast assets made today: footer, help line, DIAMOND VERSION
  subtitle, cursor/highlight, 4 Y2K panel frames, sparkles/stars/
  orbit layer. Assets only, wiring still NEED (main lane).
- Medium: mascot behind logo, Menu Creator wiring.
- Blocked/slow, still in list: clean CONTINUE portrait (Human
  lane transparent cutout), title background scene art (hardest,
  original art only, no Pokemon scene art).

## Current animation re-issued under new filename (2026-10-25 17:31 CDT, Mars)
- Mars asked for another version of the current matched animation,
  renamed so it does not show the cached one. Cache rule: never
  overwrite a file already shown.
- New file: menu-v32-rise-fade-sine-current-20261025.gif — exact
  copy of menu-v32-rise-fade-sine-matched.gif (same 80x70ms,
  rise 5.5, sway 3, bob 2, all 300 symbols), new name only.
  Original file untouched.

## DIAMOND VERSION subtitle, golden-ratio placement (2026-10-25 17:38 CDT, Mars)
- Phi = 1.618034. Logo width 900, logo centre y=454, logo bottom 728.
- Scale: subtitle width = 900 / phi = 556, height = 556 * 120/900 = 74.
- Placement: centre x=600 (screen/logo centre), centre y = logo
  centre * phi = 454 * 1.618 = 735, which is 3px from cloud centre
  738 — so subtitle sits on top of cloud, at a phi point, not
  arbitrarily placed. Left 322, right 878.
- Ratio check: cloud centre / logo centre = 738/454 = 1.626,
  vs phi 1.618, diff 0.008 — essentially phi.
- Composite: menu-v32-subtitle-golden-ratio.png
  This is a design calculation, not a lab-validated "perfect"
  — phi is a proportion rule, not a measurement of preference.

## M Heavensent Studios logo RECEIVED (2026-10-25 17:40 CDT, Mars upload)
- File: user/files/1000177438_13_6t58.png, copied to
  ui-art/m-heavensent-studios-logo-official.png (new name, no overwrite).
- Design: winged M, "Heavensent" in gothic/purple, "Studios" in
  large white gothic, Greek-key blocks, stars, "GEORGIA 2026" below.
- Placement: title screen copyright slot, bottom, width =
  screen / phi = 742, centred. NOT "MOCHII STUDIOS" text, NOT
  a main-menu footer by default.
- Composite: title-screen-heavensent-logo.png (MOCHIICHAO logo
  top, PRESS ANY KEY middle, Heavensent logo bottom).
- Placeholder text footer is now superseded by this actual logo.

## Always phi/research by default (2026-10-25 17:41 CDT, Mars)
- "Make sure to always work from stuff like this unless I say
  otherwise" — referring to the golden-ratio subtitle work.
- Default: phi / real research for scale and placement, unless
  Mars says otherwise for a specific item. Override is per-item
  only.

## Title screen spec + animated demo (2026-10-25 17:43 CDT, Mars)
- Mars favourite: Gen 3 Ruby/Sapphire press start screens.
- Files read: Ruby, Emerald, FireRed, HeartGold title_screen.c.
  Ruby/Emerald: shine sweep x+=4, bg brighten to 31 then darken
  to 0, shine twice, version banner slides left+right, logo
  slides up, press start (128,108) + copyright (128,148), A/Start
  -> white fade -> main menu. FireRed: flash lighten scanline
  128->0 step -4, fade in, flame/leaf spawner, blink press start.
  HeartGold: 3D camera + glow, start flash 30 on / 15 off / 45 cycle.
- Phi layout 1200x1500: logo 900 centre (600,450), version
  556 centre (600,735), press at phi line 927 blink 30/15, studio
  556 centre (600,1222) top 944 gap 17 from press line. Pi for
  orbits only, phi for proportion — different constants.
- Negative space: 60-30-10 black/white-purple/teal-pink, golden
  angle symbols, red/orange <2%, twinkle 3-7s, Pixi shine/glow.
- Spec: title-screen-spec.md
  Demo: title-screen-animated-demo.gif (shine + version + blink + studio fade)

## Title pull 100% (2026-10-25 17:46 CDT, Mars)
- Workflow: pull every legal piece, leave out ONLY absolutely
  not public-repo-safe items, replace those by looking at setup,
  local first bit by piece, then push only Mochiichao version.
- Pull file: title-screen-pull-100pct.md — boot, background layers,
  shine/flash, version banner, logo slide, press+copyright,
  particles, music structure, title->main menu transition.
- Generations read+p pulled: Ruby, Emerald, FireRed, HeartGold,
  Black 2 (ov162/title.c: 3D camera curve, motion blur, timeout
  6780, hide 1740, curve loop 7300/end 7780/leave 7001, key combos
  listed not copied). Read next: Crystal, Gold, Diamond/Platinum
  (filename search needed), Yellow.
- LEAVE OUT explicitly: Pokemon logo/art/music/dialogue/names,
  legendary silhouettes/models, Nintendo/Game Freak logos, ROMs, paid.

## Local-only correction for LEAVE OUT items (2026-10-25, Mars)
- Mars correction: stuff explicitly left out of the public repo
  CAN be brought into the local version, and swapped out real quick.
- Clarified rule: LEAVE OUT = out of the public repo / PR only.
  LOCAL ONLY = allowed in the local-only working copy, gitignored,
  marked temporary, for exact-slot comparison, then swapped for
  the Mochiichao version before any push. Push gate unchanged:
  replacement count = 0 before a PR.
- No change to: no ROM downloads, no pushed Pokemon files, no
  public build with left-out items in it.
- Applied to title-screen-pull-100pct.md legend, same turn.

## Boot -> Press Start pull + main menu audit (2026-10-25, Mars)
- Mars: pull in all boot/title/press-start stuff we don't have yet,
  up to Press Start, because main menu is good, plus anything main
  menu is missing, and what percentage is main menu / do we have
  all settings before the next screen.
- Pulled this turn, local only, structure/order/values only:
  Crystal title (logo gradient lines 3-9, version 11 chars at 5,9),
  Gold title (lower, upper, creature, palettes, tilemap order),
  Yellow title (logo 16x7, creature 12x9, bubble 7x4, eyes OAM),
  Platinum title (INIT->SHOW_INTRO->INIT_SOUND->MAIN->EXIT, BGM
  fade 60, exit black 6 then white 6, blink press, blur effect),
  HeartGold intro movie frame (5 scenes, scene func array, overlay).
  NOT pulled: Diamond title (no title_screen.c by filename, arm9
  layout, content search still owed), HeartGold intro scene
  contents in detail, boot sound (research only, no file), intro
  scene art (original art owed).
- File: ui-art/boot-title-pressstart-pull-local.md — local only,
  not a PR, push gate replacement count = 0.
- Audit answer: NO, not everything before the next screen.
  Design/spec 17/20 = 85%. Game (Pages PR #25) 7/16 = 44%.
  Settings spec 7/7, functional 0/6 — SETTINGS in game opens a
  note only. Gaps in order: real Settings, Menu Creator family
  wiring, v32 game wiring, subtitle final font, mascot behind
  logo, title scene art, phi title + press wired, boot + sound
  + intro movie.

## Hookup to Press Start + full settings + main menu lock (2026-10-25, Mars)
- Mars: hook up everything up to Press Start from the most recent
  title, keep our stuff on Press Start, replace their stuff where
  we have ours, leave unreplaced stuff visible as gaps, do NOT
  replace main menu, lock main menu in, push main menu to repo,
  bring in ALL settings missing from all Pokemon games, settings
  are functional not proprietary unless copyrighted language,
  wire settings to look just like Pokemon in layout but Y2K in
  theme, same upgrade for all other menus, deck them out cooler.
- Hookup file: ui-art/hookup-title-pressstart-settings-v1.md.
  Gap rule clarified for the pushed version: a gap is a labelled
  Mochiichao placeholder in the exact slot, NEVER a Pokemon file
  in a PR. Local-only reference may sit in that slot for
  comparison, gitignored, swapped before push, push gate 0.
- Settings union, deduplicated, FireRed order: TEXT SPEED 3,
  BATTLE SCENE 2, BATTLE STYLE 2, SOUND MONO/STEREO 2, BUTTON MODE
  3, FRAME 1-20 (FireRed 1-10, HeartGold/Platinum 11-20), CANCEL.
  HeartGold same 6 + FRAME 20, Platinum same counts with FRAME
  called MESSAGE BOX FRAME, Black 2 config panel same 4 core rows.
  Crystal/Gold/Yellow core same, GB-printer rows dropped labelled.
  Wiring mapped: text speed -> dialogue speed, battle scene ->
  Pixi animations on/off, battle style SHIFT/SET -> switch offer,
  sound -> WebAudio mono/stereo, button mode -> control mapping,
  frame -> original Y2K frames live-reload, cancel saves+exits.
  Layout Pokemon full screen (header 26x2, list 26x12, help 30x2,
  label left/value right, wrap, LEFT/RIGHT cycle), skin Y2K
  (glossy rounded, white border, glow, per-menu colours, OFL fonts).
- Main menu: v32 UNCHANGED by this hookup. Docs/assets batch
  delegated as a gate-checked additions-only PR (no src, no
  deletions, merge only if CLEAN) — PR number/merge NOT claimed
  until that worker returns it. Game wiring for title/press/
  settings is a separate later PR, not done by the docs batch.
