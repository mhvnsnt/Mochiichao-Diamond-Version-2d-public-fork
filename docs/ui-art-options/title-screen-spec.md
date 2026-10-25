# Title Screen — Pokemon-first spec, Ruby/Sapphire favourite (Mars, 2026-10-25 17:43 CDT)
This is the screen BEFORE the main menu. It is NOT a simple still.
Pokemon title screens are animated, in phases, with a flash/shine,
a sliding version banner, a sliding logo, and a blinking press prompt.

## How Pokemon does it — files read, all generations we have
### Gen 3 Ruby / Sapphire (favourite, pokeruby/src/title_screen.c)
Sequence, in order, skippable with A/B/Start/Select at any phase:
1. Logo shine sprite starts at x=0, y=68, moves x += 4 per frame.
   While x < DISPLAY_WIDTH/2, background color brightens (+2 per
   frame, up to 31); after halfway, it darkens (-2 per frame to 0).
   That is the "flash" — a shine sweep, not a whole-screen flash.
2. Shine again: Task_TitleScreenPhase1 fires StartPokemonLogoShine(TRUE)
   at frame 160 and again at frame 64 (counting down).
3. Version banner slides in: left + right sprites, initially
   invisible, then slide to meet in the middle (VERSION_BANNER_X/Y).
4. Logo slides UP: Phase2, REG_BG2Y = data[3] * 256, logo moves up
   while Press Start banner is created.
5. Press Start banner at (DISPLAY_WIDTH/2, 108) in Ruby,
   (128, 108) in Emerald, + Copyright banner at y=148 (Ruby) /
   (128, 148) in Emerald. Press Start + Copyright are each 5
   32x8 segments, animated in order.
6. Phase3: Kyogre/Groudon silhouette shows, input: A or START ->
   FadeOutBGM, white palette fade, GoToMainMenu. B/Select combos
   are save-clear / other system keys, not title art.
### Gen 3 Emerald (pokeemerald/src/title_screen.c, same structure)
- Same shine, version banner, press start (128,108) + copyright
  (128,148), logo slide up. Extra: logo shine in Emerald can
  flash background green for 4 frames (SpriteCB_PokemonLogoShine
  fast mode), and version banner blends as it passes over.
### Gen 3 FireRed / LeafGreen (pokefirered-leafgreen/src/title_screen.c)
- FlashSprite scene: BLDCNT lighten, scanline buffer 128 -> 0,
  step -4 per frame, then fade in.
- FadeIn scene: palette fade from black, grayscale tint, blend
  gradually, then RUN scene.
- RUN: BlinkPressStart task, FlameSpawner (FireRed) / LeafSpawner
  (LeafGreen) particles rising, Slash sprite, A/START -> CRY scene
  -> copyright screen after title (CB2_InitCopyrightScreenAfterTitleScreen).
- Copyright + Press Start tiles are a separate background layer
  (BG2, tiles + map), logo is BG0/BG1.
### Gen 4 HeartGold (pokeheartgold/src/title_screen.c)
- 3D objects + camera: TitleScreenAnim_InitObjectsAndCamera,
  camera moves to next position, game title layer fades in.
- Top-screen glow: TitleScreenAnim_RunTopScreenGlow.
- Start instruction flash: timer 0 = show, 30 = hide, 45 = reset
  (45-frame blink cycle). A/START/touch -> white fade (12 frames)
  or black fade (6 frames) -> main menu.
- Mochiichao translation: camera move = Pixi scale/position ease,
  3D glow = glow filter, NOT a real 3D engine switch (game is 2D).

## Mochiichao title screen — phi layout, 1200x1500, phi=1.618, pi=3.1416 for orbits
Phi lines: y = 1500*0.382 = 573 (top phi), y = 1500*0.618 = 927 (bottom phi).
Pi is for circles/orbits (circumference = 2*pi*r), phi is for
proportion/scale/placement — they are different constants, do not
swap them.
- MOCHIICHAO logo: 900 wide (75% of screen width), centre (600, 450).
  Logo centre 450 is in the top third, leaving the phi band below
  for version + press + studio.
- DIAMOND VERSION banner: slides in left+right (Ruby pattern),
  width = 900 / phi = 556, height 74, centre (600, 735).
  735 = logo centre 454 (main menu) * phi, and in title layout
  it sits between logo bottom and press line, on the cloud layer.
- PRESS ANY KEY: blinking, at bottom phi line y=927, white bold,
  blink cycle from HeartGold: 30 frames on, 15 off, 45 total.
  A / START / tap -> white fade -> main menu (Ruby Phase3 pattern).
- M HEAVENSENT STUDIOS logo: title copyright slot, bottom.
  Width = logo width / phi = 556, height 556 (square logo),
  centre (600, 1222), top 944, bottom 1500. Gap from press line
  927 to studio top 944 = 17px, so press key never overlaps studio logo.
  Previous 742-wide version was too big and overlapped press key —
  phi version fixes that.
- Negative space fill (design principles, not random scatter):
  * Background: 60% black, 30% white/purple (Heavensent palette),
    10% teal/pink accents (60-30-10, from color research).
  * Symbols/sparkles: golden angle 137.508°, pastel, saturated
    red/orange <2% of field, max 1 twinkle per 3-7s.
  * Orbits: ellipse circumferences by pi, blue + pink, same as logo orbit.
  * Shine sweep: white vertical band, x += 4 per frame (Ruby),
    background brighten to 31 then darken to 0, twice, then
    version banner slides in.
  * Particles: FireRed flame / LeafGreen leaf pattern, translated
    to Mochiichao: teal/pink symbol particles rising, same spawn
    pattern, not a new particle system invented from scratch.
- Animation sequence for Mochiichao (Ruby + FireRed + HeartGold combined):
  1 Black -> 2 Logo shine sweep (brighten/darken) -> 3 Shine again
  -> 4 Version banner slides in left+right -> 5 Logo slides up
  slightly (BG2Y pattern, Pixi y ease) -> 6 Press Any Key fades in
  + blinks -> 7 Studio logo fades in bottom -> 8 A/Start -> white
  fade -> Main Menu (v32). Any key skips to next phase, like Pokemon.
- Open source / industry: PixiJS v8 ticker + filters (MIT, already
  in game) for shine/glow/particles, GSAP-style ease (not needed
  for v1), CSS/Pixi blend modes for flash (FireRed BLDCNT lighten
  pattern). No new engine, no 3D switch.
