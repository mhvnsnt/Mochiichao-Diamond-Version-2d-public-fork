# Intro / Title scene art — how Pokemon made it, what Mochiichao needs, 100% checklist
Mars, 2026-10-25 — research from actual decomp files in the repo, structure/order/timing only, no Pokemon art/code/dialogue copied.

## What "Diamond title content search" means (now done, see §5)
Diamond has NO file named title_screen.c. Searching by filename fails.
Searching by CONTENT (grep for title/opening/NARC references) finds it:
- arm9/src/filesystem.c lines 61 and 141 list demo/title/titledemo.narc
  and demo/title/op_demo.narc as filesystem entries.
- files/demo/title/ holds titledemo + op_demo (binary NARC assets).
- files/graphic/opening/ holds NSCR/NCGR/NCLR/NANR/NCER tile/palette/
  animation/cell assets for the opening.
- arm9/overlays/63/src/ov63_021DB450.c holds Title_SetupMonAnimationSprites
  — the Diamond title monster-animation code lives in overlay 63, not
  in a standalone title file like Platinum/HeartGold.
So Diamond title = overlay 63 code + titledemo/op_demo NARC art.
Mochiichao translation: title monster animation = our creature sprite
animated on the title screen, driven by PixiJS (see §4), original art only.

## How they made intro + title, game by game (actual files)
### FireRed — src/intro.c, then src/title_screen.c
Intro runs BEFORE title, ends ExitToTitleScreen. Order:
1. Game Freak scene: GF_OpenWindow, GF_Star, GF_RevealName,
   GF_RevealLogo, name sparkles small then big, "presents" sprite.
   Art needed in that slot: studio logo + star + sparkles.
2. Scene 1: grass close-up, Scene1_Task_AnimateGrass,
   Scene1_StartGrassScrolling, Scene1_Task_BgZoom. Art: grass tiles,
   background tiles, palettes (graphics/intro/scene_1/).
3. Scene 2: forest pan (Scene2_Task_PanForest), then close-ups of
   two creatures (Scene2_Task_PanMons, Scene2_CreateMonSprites).
   Art: forest background, two creature close-ups.
4. Scene 3: fight — entrance, bounce/hop, cry, attack, recoil + dust,
   swipe sprites, zooms (Scene3_GengarBounce, Scene3_NidorinoCry/Hop/
   Attack/Recoil, Scene3_CreateGengarSwipeSprites, affine zoom).
   Art: fight background, grass sprite, two creature anim sets
   (normal/cry/crouch/hop/attack), swipe + recoil-dust sprites.
Title after intro: FlashSprite lighten scanline 128→0 step −4,
fade-in, flame/leaf spawner, BlinkPressStart, A/START → CRY scene →
separate copyright screen after title.

### HeartGold — src/intro_movie.c + intro_movie_scene_1..5.c + scenes_lib
5 scenes, scene-func array Scene1–5, Init/Main/Exit per scene,
sprite manager, overlay application, skip allowed after a step timer.
- Scene 1: sun sprite + bird sprite, layered BGs (MAIN 0–3, SUB 0–3),
  palettes from demo_opening gs_opening NARC (NCGR/NSCR/NCLR/NANR/NCER).
  Art: sky/day background layers, sun, flying bird.
- Scene 2: flyover grass BG scroll anims, flower sprites appearing
  on a timing table (sIntroMovie_Scene2_FlowerSpriteAppearTiming),
  sprite pan effects (0xC0, then −0x20 for 0x5A frames), stepTimer >55
  advances. Art: grass flyover background, flower sprites.
- Scene 3: 3D map animation (GF3dRender_DrawModel, animObjs frame+1),
  map lighting/color params, whichMap 0→1→2, Eusine appear step 56,
  Unown slide step 145, Entei slide out step ≥145, silver BG appear
  delays. Art: 3 animated 3D maps (Mochiichao: Pixi camera pans over
  2D scene art, NOT a 3D model), Eusine-style character, Unown-style
  glyphs, legendary-style creature.
- Scene 4: 3 starter sprites, particle emitters per starter
  (StartParticleEmitters 0,1,2), FlipScreensAtNextVBlank between
  screens, stepTimer >25 advances. Art: 3 starter sprites + particles.
- Scene 5: camera-shutter wipe in (18 frames), BG scroll on MAIN 1–2
  and SUB 1–2 (speed −0x40 / BG_SCROLL_SPEED, 73 frames), stepTimer
  ≥20 → white fade out (50 frames) → title. Art: scrolling
  background layers, wipe/fade only (no new creature art).

### Crystal — engine/movie/intro.asm + title.asm + splash.asm
CrystalIntro = jumptable of 28 IntroScenes, JoyTextDelay loops,
ANY button shuts off music and exits. Early scenes load Unown +
pulse graphics. Title: clear palettes/sprites/tilemap, logo gradient
palettes (lines 3–9), version text 11 chars at (5,9), creature art
lower screen, copyright line 0, logo 20×7 tiles.

### Gold / Yellow
Gold title.asm: decompress lower, then upper, then legendary sprite,
fill palettes, load tilemap — that order. Yellow title_yellow.asm:
logo tilemap 16×7, creature tilemap 12×9, speech bubble 7×4, creature
eyes OAM (creature is animated on title).

### Ruby / Emerald — src/intro.c + src/title_screen.c
Intro: copyright tiles/palette/tilemap, intro tiles, Intro1 BG0–BG3
+ leaves, Intro3 creature-ball graphics, streaks, Eon graphics.
Title: shine sprite x=0 y=68, x+=4/frame, background brightens +2 to
31 before halfway then darkens −2 to 0, shine fires again at counters
160 and 64; version banner left+right sprites slide to meet; logo
slides up while press banner is created; Press Start (DISPLAY/2,108)
Ruby / (128,108) Emerald, Copyright y=148; banners 5×32×8 segments;
A/START → white palette fade → main menu; A/B/Start/Select skips.

### Platinum — src/applications/title_screen.c + game_opening/
States INIT → SHOW_INTRO → INIT_SOUND → MAIN → EXIT; intro fades
black → white → fade main, camera move-in, blur on exit, BGM fade
out 60 frames, exit fade black 6 then white 6, press-start layer toggle.
TitleScreenAppTemplate is enqueued from game_opening ov77_021D25B0.c.

### Black 2 — src/ov162/title.c
3D scene under a camera curve, motion blur by blending each frame
with the last (Eva/Evb /16), white flash at 1740 frames, TIMEOUT 6780,
camera curve loop 7300 / end 7780 / leave 7001. Hidden keys listed
as system keys only, NOT copied as hidden features.

## How it was made, in one sentence per layer
Pokemon intro/title art is NOT a video file. It is: background tile
layers (BG0–BG3 / MAIN/SUB) + sprite layers (OAM, affine zoom/pan) +
palette fades + a step-timer state machine (Init/Main/Exit per scene,
any key skips) + a music track that fades out on A/Start. Every scene
is a list of art assets + a list of timed moves for those assets.
Mochiichao does the same with PixiJS v8: 2D sprite sheets + tile
layers + camera pan/zoom + palette/alpha fades + a step-timer, no video.

## Open source that gives us the full ability (no Pokemon files)
- PixiJS v8 (MIT, already in game): layers, sprites, affine zoom/pan,
  alpha fades, ticker — replaces BG/OAM/affine hardware.
- Kenney CC0 UI shapes: panel/frame structure only, not scene art.
- game-icons.net (CC BY 3.0, attribution): small icon/sparkle shapes.
- Godot / GB Studio intro analysis (public docs, reference only):
  state-machine scene structure, NOT engine switch.
- Web Audio API (built-in): boot sound playback, no plugin needed.
- Blender (for 3D-to-2D renders, already used in sprite lanes):
  render a scene, export 2D sheets — game only ever eats 2D sheets.

## Mochiichao art needed — ready to send to Sprite Art + Character Art lanes
Count: 14 art items. HAVE = already in a lane, NEED = to be made.
1. Boot: Heavensent logo alone, phi 742, black — HAVE (Mars upload).
2. Studio scene: Heavensent logo + star + sparkles, "presents" —
   HAVE logo, NEED sparkles/star animation art (1 item).
3. World dawn: wide world / grass close-up — HAVE via sprite-art
   intro-frame-01-world-dawn-v1.png (PASS).
4. Forest pan + grass zoom — NEED (1 background).
5. Starter trio presentation — HAVE via intro-frame-02-starter-trio-v1.png (PASS).
6. Dorowani + Gabu faceoff / fight — HAVE via intro-frame-03-dorowani-gabu-faceoff-v1.png (PASS).
7. Fight anim sets: 2 creatures, normal/cry/crouch/hop/attack +
   swipe + recoil dust — NEED (2 creature sets + 2 effect sprites).
8. Sun + bird flyover — NEED (sun sprite, bird sprite, sky layers).
9. Flower flyover background — NEED (1 background + flower sprites).
10. 3 scrolling world maps (Pixi pans, not 3D models) — NEED (3 maps).
11. Lab character (Aeon) + glyphs + legendary-style creature —
    NEED Aeon lab background A2 (location not locked), NEED glyphs,
    NEED featured-creature pick for silhouette reveal I4.
12. Title background scene art — NEED V2 (title-bg-key-art-v1.png
    NEEDS V2: Tyrage missing, Gabu duplicated — do NOT present v1 final).
13. Title logo lockup + DIAMOND VERSION + PRESS ANY KEY — HAVE
    (phi layout, locked main logo, subtitle asset).
14. Boot sound — HAVE as 3 options below, Mars ear-pick needed.

## Boot sound — research + 3 options made
Research, labelled (not lab-validated for boot chimes): short 2–5s,
3–5 distinct elements, melody helps recall, brand-name-in-sound helps
identification, anticipation/delayed gratification (sound only on
successful boot) is why Game Boy's two-note chime sticks. No lab study
measures neurotransmitter release from a boot chime; dopamine =
anticipation/prediction (Schultz) is the bridge, labelled as such.
Files in ui-art/boot-sounds/ (WAV, 44.1kHz mono, original notes,
NOT Nintendo's notes/logo):
- Option A — boot-sound-option-a-two-note-chime.wav, 1.55s, 134K:
  A4 0.4s, pause 0.25s, E5 0.9s. Closest to GB structure, simplest.
- Option B — boot-sound-option-b-rising-arpeggio.wav, 1.95s, 168K:
  C5, E5, G5, C6, rising, resolve on high C.
- Option C — boot-sound-option-c-melodic-logo.wav, 2.30s, 199K:
  D5, F#, A, G, D6 — 5-element melodic logo, rise then resolve.
Mars ear-pick needed: A, B, or C, or "mix A+B" etc. No sound is wired
into the game until Mars picks one.

## Order after intro (Mars, 2026-10-25)
Boot → Intro Movie → Title → Press Start → Main Menu (built, v32
locked) → next menus in order: Settings (in code worker), Pause,
Bag, Shop, PC, Party/Roster, Save, Battle UI, Dialogue — then
gameplay experience after that, until first playable win path.
Truck-start Region 1 (World Builder lane) starts AFTER v5.2 playtest
+ win, not on top of it mid-test.

## 100% checklist with percentages (per Mars percentage rule)
- Intro/title research from actual files: 11/12 games = 92%
  (FireRed, HeartGold, Crystal, Gold, Yellow, Ruby, Emerald, Platinum,
  Black 2, Diamond located, Black 2 title; Platinum options details
  still partial — 1 item left)
- Diamond title content search: located 100% (overlay 63 + NARC
  assets), detailed logic extraction 1/5 = 20% (only monster-anim
  function named in that overlay file so far)
- HeartGold intro scene details: 5/5 scenes = 100% structure,
  art lists 5/5 = 100% (see §HeartGold above)
- Boot sound: research 100%, 3 options made 3/3 = 100%, Mars pick 0/1 = 0%
- Boot sequence spec: 1/1 = 100% (logo phi 742, hold time still Mars decision)
- Title spec/phi layout: 100% (locked)
- Press Start spec: 100% (blink 30/15, any key, white fade)
- Intro scene art items: HAVE 5/14 = 36% (boot logo, world dawn,
  starter trio, faceoff, title lockup; the other 9 items are NEED
  in the list above, including title-bg V2)
- Fonts: downloaded 2/3 = 67%, wired in game 0% (code worker running),
  main/dialogue roles defined 100%
- Title/press/settings code wiring: 0% merged (code worker running,
  editing IntroSequence.tsx — do NOT claim done)
- Next menus after main menu: 0/8 = 0% merged (specs 8/8 = 100%)
