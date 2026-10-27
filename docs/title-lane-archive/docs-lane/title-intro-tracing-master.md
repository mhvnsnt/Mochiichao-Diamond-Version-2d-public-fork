# Title / Intro tracing master — recreate the scene, with our stuff, in the exact spots
Mars, 2026-10-25 — method Mars just confirmed: trace the Pokemon scene
layout, place Mochiichao proprietary art in the exact spots, fill gaps
from open source + our character art. NOT a copy of Pokemon art, code,
dialogue, or names — the LAYOUT is traced, the CONTENT is ours.
Repeat this tracing for every title, same method each time.

## Tracing rule, per scene, per spot
Pokemon element -> exact spot (position / layer / timing) ->
Mochiichao replacement in that spot -> HAVE / NEED TO MAKE.
If a spot has no Mochiichao art yet, the spot stays as a labelled
Mochiichao GAP panel in that exact spot — never a Pokemon file in a PR.

## 1. FireRed title + intro — traced
Intro order: studio scene -> grass close-up -> forest pan ->
2 creature close-ups -> fight -> title.
- Studio logo spot (centre, star + sparkles + "presents") ->
  M Heavensent Studios logo, phi 742 boot / 556 title -> HAVE logo,
  NEED sparkles/star animation (open source sparkle frames).
- Grass close-up spot (full BG, scroll + zoom) ->
  Binary Woods / grass background, Mochiichao grass tiles -> NEED.
- Forest pan spot (wide BG pan, then close-ups) ->
  Forest background + 2 creature close-ups (rotation pool) -> HAVE
  creature sheets, NEED forest background.
- Fight spot (2 creatures, entrance/bounce/cry/attack/recoil/dust/
  swipe/zoom) -> Dorowani + Gabu faceoff (HAVE intro-frame-03),
  NEED fight anim sets + swipe/dust (open source CC0 effects).
- Title spot: FlashSprite lighten 128->0 step -4, flame/leaf spawner,
  BlinkPressStart, A/START -> CRY -> copyright screen ->
  Mochiichao: shine, version slide, logo slide up, PRESS ANY KEY
  blink 30/15, white fade -> Main Menu v32, Heavensent logo in
  copyright slot 556 wide, centre (600,1222) -> HAVE spec/logo,
  NEED title background scene art V2.

## 2. HeartGold title + intro movie — traced
5 scenes, Init/Main/Exit each, any key skips after step timer.
- Scene 1 spot: sun + bird, layered BGs MAIN 0-3 / SUB 0-3 ->
  Sun + bird (Mochiichao bird creature, NEED) over sky layers (NEED).
- Scene 2 spot: grass flyover scroll + flowers on timing table ->
  Grass flyover + Data-Fruit / flower sprites (HAVE garden art
  concepts, NEED flyover background).
- Scene 3 spot: 3 animated maps, lighting changes, character
  appear step 56, glyph slide 145, legendary slide out ->
  3 Pixi-panned Mochiichao maps (NEED), Aeon (HAVE human art),
  glyphs (NEED), Mythar (HAVE sheet, pearl theme).
- Scene 4 spot: 3 starters + particle emitters + screen flips ->
  Mochii / Razorgater / Tyrage (HAVE sheets) + particles
  (CC0 fire/smoke/auras, NEED download finish).
- Scene 5 spot: shutter wipe 18f, BG scroll 73f, white fade 50f ->
  Same timings, Mochiichao scrolling layers (NEED).

## 3. Crystal / Gold / Yellow — traced
- Crystal: 28-scene jumptable, any button exits, Unown + pulse early
  -> Mochiichao: 28-beat outline (structure only), glyphs + pulse
  effects (NEED), any key skips.
- Crystal title: logo gradient palettes, version 11 chars at (5,9),
  creature lower screen, copyright line 0, logo 20x7 ->
  Mochiichao logo lockup, DIAMOND VERSION (locked font, do NOT change),
  rotation creature lower, Heavensent copyright slot.
- Gold title: decompress lower, then upper, then legendary, fill
  palettes, load tilemap (that order) -> same order, Mochiichao art.
- Yellow title: logo 16x7, creature 12x9, speech bubble 7x4, eyes OAM
  (creature animated) -> Mochiichao logo, rotation creature animated
  (blink/eyes from sheet), speech bubble = dialogue box (Digitall).

## 4. Ruby / Emerald — traced
- Shine x=0 y=68, x+=4, brighten +2 to 31 then darken -2 to 0,
  shine again at 160 and 64 -> same shine math, Mochiichao shine sprite.
- Version banner left+right slide to meet -> DIAMOND VERSION slide.
- Logo slides up, press banner created -> Mochiichao logo slide up.
- Press Start (DISPLAY/2,108) Ruby / (128,108) Emerald, Copyright
  y=148, banners 5x32x8 segments, A/START -> white fade -> main menu
  -> Mochiichao phi equivalents (press y=927, studio logo y=1222).

## 5. Platinum — traced
- States INIT -> SHOW_INTRO -> INIT_SOUND -> MAIN -> EXIT,
  fade black->white->main, camera move-in, blur on exit, BGM fade
  60f, exit fade black 6 then white 6, press layer toggle ->
  Same states, Pixi camera ease + glow (translation, NOT 3D model),
  Mochiichao title music (original, NEED composition).

## 6. Black 2 — traced
- 3D scene camera curve, motion blur blend /16, white flash 1740f,
  TIMEOUT 6780, curve loop 7300 / end 7780 / leave 7001 ->
  Pixi camera curve over 2D scene art, motion blur = frame blend,
  white flash, same frame counts as a starting point (Mars can
  retime), creature = rotation pool.

## 7. Diamond — traced (content search, see intro research file)
- Overlay 63 Title_SetupMonAnimationSprites + titledemo/op_demo
  NARC assets + graphic/opening NSCR/NCGR/NCLR/NANR/NCER ->
  Mochiichao: title monster animation = rotation creature animated
  on title, with Pixi, original art only.

## Gap filling — open source + our character art, in that order
1. Our character art first: sprite-art sheets (49 creatures, Dorowani/
   Gabu 3-sheet sets, Mochii, Wispkin, Yogiferno, Mythar, etc.),
   human-characters sheets (Aeon, Mochiko, Hex, Mom, Player A).
2. Open source second: CC0 fire/smoke/auras (Free Pixel Loops),
   Parazona fire pillar sampler, Kenney CC0 UI/particles, game-icons
   CC BY 3.0 with attribution, PixiJS v8 particles, Web Audio.
3. Academic / industry third: scene state-machine structure,
   sonic logo 2-5s / 3-5 elements, golden ratio placement,
   colour/neurochemistry report (labelled, not lab-validated).
4. Still NEED, not invented: title background scene art V2,
   forest/grass/flyover backgrounds, fight anim sets, title music,
   boot sound pick (A/B/C), snow background, Aeon lab background A2,
   featured-creature pick for silhouette reveal I4 (now rotation
   pool, not a single pick), starter presentation art S1.

## Rotation pool in every tracing (current, 2026-10-25)
Mochii, Razorgater, Tyrage, Kittember, Sproutle, Dorowani, Gabu,
Wispkin, Yogiferno, Mythar — 10. Tiidebiite OUT, Duskfiend OUT.
Yogiferno screen: walks through, fire trail behind, snow variant.
Wispkin screen: black/white ghost/wisp theme, own screen.
Mythar screen: pearl/diamond iridescent, sine wave, diamond sparkles.
Each creature's screen uses the SAME traced layout, different
creature + theme in the exact creature spot.
