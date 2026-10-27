# Boot → Title → Press Start — local pull, everything up to Press Start
Mars, 2026-10-25 — local only, NOT a PR, NOT a public build.
Rule from the last correction: LEAVE OUT = out of the public repo/PR only.
LOCAL ONLY = gitignored, marked temporary, exact-slot comparison in the
local working copy only, swapped to the Mochiichao version before any push.
Push gate: replacement count = 0 before a PR.
No ROM downloads. Local material is only structure/order/values from the
decomp files already in the repo, plus files Mars uploads himself.
No Pokemon art, music, dialogue text, or logo tiles are copied into this file.

## Flow, in order — this is the whole chain before Main Menu
Power on / page load
  -> Boot logo (M Heavensent Studios, see §1)
  -> Boot sound (see §2, NEED — no sound made yet)
  -> Intro movie (see §3)
  -> Title screen (see §4)
  -> Press Start / Press Any Key (see §5)
  -> Main Menu v32 (locked, see §6 audit — main menu is NOT 100% in game yet)
  -> next screen only after §6 gaps are closed

## 1. Boot — PULL / REPLACE / NEED
- PULL (hardware, not game code): GBA/DS power-on shows the hardware
  logo first, then the game starts. No game menu comes before title.
- PULL (FireRed intro.c, first scene): the game opens with a studio
  scene — star sprite, name sparkles small then big, name reveal,
  logo reveal, "presents" sprite — then it exits to title.
  That studio scene is the slot Mochiichao reuses.
- REPLACE: Boot = black screen, M Heavensent Studios logo alone.
  Same uploaded image Mars gave (m-heavensent-studios-logo-official.png).
  Phi boot size, single logo on black, no press line to avoid:
  width = 1200 / phi = 742, height 742 (square), centre (600, 750).
  This is NOT the title copyright slot size — title slot is 556
  wide, centre (600, 1222), because the press line sits above it.
  Do not use the 742 size on the title screen.
- HAVE: Heavensent logo file, transparent version.
- NEED: boot logo timed hold (how many seconds — Mars decision, not
  invented), boot sound (see §2), and the boot → intro transition
  (fade, not a cut — same pattern as title → main menu white fade).

## 2. Boot sound — research pulled, sound NOT made
- PULL (Game Boy / DS, from public research, not from a file):
  two-note chime, logo descends slowly, sound confirms the load
  worked. Delayed gratification / anticipation is the effect
  people describe, not a measured neurotransmitter result.
- RESEARCH (labelled, not lab-validated for a chime):
  sonic-logo guides say 2-5 seconds, 3-5 distinct elements max,
  a simple repeatable melody is more identifiable than a sound
  with no melody. Marketing-guide claims (+36% audio scores,
  +88% recall with consistent use) are guide claims, not lab facts.
  Lab bridge, from the existing color/neurochemistry report:
  dopamine = anticipation / prediction error (Schultz; Koepp 1998
  PET during gameplay) — a short rising anticipation shape fits
  that, it does not prove a chime releases dopamine.
- REPLACE (design, NOT a file yet): short, 2-5s, 3-5 elements,
  rising anticipation shape, then a resolve on the logo reveal.
  Original Mochiichao sound, not a Pokemon chime copy.
- NEED: compose / generate the actual boot sound, Mars ear-check,
  then wire it to boot logo reveal. Do NOT claim a boot sound exists.

## 3. Intro movie — the missing part between boot and title
- PULL (FireRed intro.c, already read): intro runs BEFORE title,
  ends by exiting to title. Scenes in order:
  (1) studio scene, (2) Scene 1 — brief close-up of grass, scroll
  + zoom, (3) Scene 2 — panning wide forest shot, then close-ups
  of two creatures, (4) Scene 3 — a fight: entrance, fight, grass
  sprite, bounce, cry, hop, attack, recoil + recoil dust, swipe
  sprites, zooms on each creature.
- PULL (Crystal intro.asm, newly read this turn): CrystalIntro is
  a jumptable of 28 scenes, IntroScene1-28, any button press
  shuts off the music and exits (clear palettes/sprites/tilemap).
  Structure only — scene art is LEAVE OUT / LOCAL ONLY.
- PULL (HeartGold intro_movie.c, newly read this turn): 5 scenes,
  sIntroMovieSceneFuncs = Scene1, Scene2, Scene3, Scene4, Scene5,
  run as an overlay application, sprite manager init/teardown,
  graphics banks set, then exit to title. Scene-by-scene contents
  NOT yet read in detail — that is still NEED, do not claim it.
- PULL (Yellow intro, files found, not detailed): intro.asm +
  intro_yellow.asm + intro SFX files + intro sprite frames exist
  in pokeyellow/engine/movie/ and audio/sfx/. Structure to pull
  next, same legend.
- REPLACE, bit by piece, in the exact slots:
  studio scene -> M Heavensent scene (same star/sparkle/reveal beats)
  Scene 1 grass close-up -> Mochiichao world close-up (original art, NEED)
  Scene 2 forest pan + creature close-ups -> Mochiichao world pan +
  Mochii / partner close-ups (original art, NEED)
  Scene 3 fight -> Mochiichao creature fight beat (original art, NEED)
  Any-key skip -> same: any key shuts off intro music and goes to title.
- NEED: all intro scene art. Mars already said more images will
  need to be made for this. No intro movie exists in game yet.

## 4. Title screen — second batch pulled this turn
Already pulled (first batch, title-screen-pull-100pct.md): Ruby,
Emerald, FireRed/LeafGreen, HeartGold, Black 2 — shine, version
banner, logo slide, press + copyright, particles, music structure.

Newly pulled this turn, structure only:
- Crystal title.asm: clear palettes/sprites/tilemap, logo gradient
  palettes on lines 3-9, version text 11 chars at (5, 9), creature
  art in the lower screen area, copyright line at line 0, logo
  drawn 20 wide x 7 high. Art = LEAVE OUT / LOCAL ONLY.
- Gold title.asm: decompress lower title art, then upper title art,
  then legendary sprite art, fill title palettes, load title tilemap.
  Order = lower, upper, creature, palettes, tilemap. Art = LEAVE OUT.
- Yellow title_yellow.asm: logo tilemap 16x7, creature tilemap 12x9,
  speech-bubble tilemap 7x4, creature eyes OAM data. The creature
  is animated on title (eyes), not a still. Art = LEAVE OUT.
- Platinum title_screen.c: states INIT -> SHOW_INTRO -> INIT_SOUND
  -> MAIN -> EXIT. Intro states: fade from black, wait, fade to
  white, fade from white, move title camera in, wait + fade.
  Main state: configure BGs, blink press text. Exit: BGM fade out
  over 60 frames, blur effect, fade out black 6 frames, then fade
  out white 6 frames. Press-start layer toggle. Camera + 3D model
  layer = LEAVE OUT; Pixi camera ease + glow filter is the
  Mochiichao translation, not a 3D switch.
- Diamond: NOT pulled. No title_screen.c found by filename in the
  Diamond decomp (its layout is arm9/, not src/applications/).
  Do NOT claim Diamond title is pulled. Search by content in
  arm9/src is still NEED.
- REPLACE (unchanged, phi title spec): logo 900 centre (600, 450),
  DIAMOND VERSION 556 centre (600, 735), PRESS ANY KEY at phi line
  927 blink 30 on / 15 off, Heavensent logo 556 centre (600, 1222),
  shine x+=4 brighten to 31 then darken to 0 twice, version slides
  left+right, logo slides up, A/Start -> white fade -> Main Menu v32.
- HAVE in spec/demo: title-screen-spec.md + title-screen-animated-demo.gif.
- NEED in game: the phi title itself is NOT wired in game yet.
  The live game title (Pages PR #25, main a084b5ff) is still the
  older title text, not this phi title, not the Heavensent logo,
  not the shine/version slide. Do not call title 100% in game.

## 5. Press Start — PULL / REPLACE
- PULL: Ruby (DISPLAY/2, 108) + copyright y=148, Emerald (128, 108)
  + (128, 148), each banner 5 x 32x8 segments animated in order.
  FireRed: BlinkPressStart task, copyright + press on BG2, A/START
  -> CRY scene -> copyright screen after title.
  HeartGold: blink 30 on / 15 off / 45 total, A/START/touch ->
  white fade 12 frames or black fade 6 frames.
  Black 2: timeout 6780 frames, hide layers 1740, camera loop 7300 /
  end 7780 / leave 7001, A/Start -> start menu.
  Platinum: blink press text in MAIN state, exit fade as in §4.
  Crystal/Gold/Yellow: press is part of the title loop, any key
  advances — same beat, different tile layout.
- REPLACE: PRESS ANY KEY, phi line 927, blink 30/15, A/Start/tap ->
  white fade -> Main Menu v32. Any key skips phases, like Pokemon.
  Delete-save / mic-test key combos are listed in the first pull
  file as Pokemon system keys only — NOT copied as hidden features.
  Mochiichao equivalents are a Mars decision.
- HAVE: spec + demo blink. NEED: wiring in game, with the phi title.

## 6. Main menu audit — what percentage, do we have all settings?
Answer first: NO, we do not have everything before the next screen.
Main menu is good as a locked design, not as a finished game screen.
Settings are spec-only, 0% functional in game.

### 6a. Design / spec side: 17 / 20 = 85%
HAVE (17): official Mars logo, DIAMOND VERSION subtitle asset at
phi placement, 4 Y2K panels (pink/yellow/blue/green), puffy cloud,
rainbow arcs/circles, v32 symbols + phi fade (905 full, 620 gone,
285 fade), matched animation demo (80 frames, rise 5.5, sway 3,
bob 2, all 300 symbols), cursor art, Y2K panel frame assets,
sparkles/stars/orbit layer, Mochii cue by CONTINUE, Heavensent
logo + title phi placement, help-line asset (belongs in Settings,
not main menu), Menu Creator spec, UI Creator spec, Layout Editor
spec, Cursor Creator spec, Panel Frame Editor spec.
NEED (3): (1) subtitle final OFL font — current asset is DejaVu
Bold draft, Phase 2 swap still owed, (2) mascot placed BEHIND the
logo — only the by-CONTINUE cutout exists, (3) title background
scene art — hardest, original art only, no v32 composite faked
as scene art.
85% is design/spec only. It is NOT a game percentage.

### 6b. Game side (Pages PR #25, main a084b5ff): 7 / 16 = 44%
YES (5): CONTINUE window, NEW GAME window, BACK TO TITLE control,
separate framed windows (StdWindow in v4, not Y2K SVG panels),
save-slot flow.
PARTIAL (2, counted as 1 each in the 7): selected-window highlight
(gold/teal, not the v32 cursor art + glow), CONTINUE stats (player
name, caught count, team size, dojos cleared, CR, map, saved date
— play time and /total honestly omitted, because the save does
not hold them).
NO (9): SETTINGS does anything (opens a note only), v32 Y2K panel
colours/gloss in game, v32 1200x1500 coordinates (game is responsive
web layout, not that canvas), official chrome logo in main menu
(not verified in game), subtitle phi placement in game, symbol
rise/fade/sine animation in game, mascot by CONTINUE in game,
Menu Creator wiring, UI Creator / Layout / Cursor / Panel wiring.
7 / 16 = 43.75%, rounded to 44%. That is the honest game number.

### 6c. Settings — spec 7 / 7, functional 0 / 6
Pokemon options rows, FireRed option_menu.c:
sOptionMenuItemCounts = {3, 2, 2, 2, 3, 10, 0} =
TEXT SPEED 3, BATTLE SCENE 2, BATTLE STYLE 2, SOUND 2, BUTTON MODE 3,
FRAME 10, CANCEL 0. HeartGold FRAME = 20 choices.
Spec: all 7 rows specced, plus FRAME palettes, fonts, dialogue
X/Y/W/H, all window panels, plus extra-freedom rows (radius, glow,
shadow, opacity, border, gradient, per-element frame, cursor,
animation, sound on move, 48px touch, safe area, day/night override,
preset JSON) — all in settings-menu-creator-spec.md.
In game: 0 of the 6 functional rows work. SETTINGS opens a note
that no settings screen exists in this build. Sprite Proportions
(Chibi default / Tall later, fallback to chibi) is also spec-only,
not coded.
So: do we have all settings? No. We have the settings SPEC, not
the settings SCREEN. That screen is the next main-menu gap, before
any new screen after main menu.

### 6d. What is missing before we go to the next screen, in order
1. Real Settings screen (Pokemon full-screen layout, not a popup),
   with the 6 functional rows actually changing something.
2. Menu Creator / UI Creator / Layout Editor / Cursor Creator /
   Panel Frame Editor wired as full screens, presets only,
   Reset to Locked Default (v32) present.
3. v32 game wiring: Y2K panels, phi layout as far as web layout
   allows, symbol animation, cursor art, mascot cue — or a Mars
   decision that the web layout keeps its own proportions.
4. Subtitle final OFL font, mascot behind logo (Mars eye-check),
   title background scene art (original only).
5. Phi title + press start wired in game (this file §4-§5),
   boot logo + boot sound + intro movie (§1-§3).
Only after 1-5 is main menu + everything before it actually 100%
in game. Until then, "main menu is good" means the locked v32
design is good — it does not mean the game screen is finished.

## Status of this pull
- Boot -> Title -> Press Start: structure pulled for Ruby, Emerald,
  FireRed, HeartGold, Black 2, Crystal, Gold, Yellow, Platinum.
  Diamond title: NOT pulled. HeartGold intro scene contents:
  NOT detailed. Boot sound: NOT made. Intro scene art: NOT made.
- This file is local only. Nothing in it is a PR, nothing in it
  is a public build, and nothing here claims a game feature exists
  until it is on Pages and playtested.
