# Title Screen Pull — 100% of what CAN go in, local-first, replace bit by piece, then push (Mars, 2026-10-25 17:46 CDT)
Workflow agreed: pull every legal piece, leave out ONLY the things
that absolutely cannot go in a public repo, replace those by
looking at exactly how Pokemon set them up, in a LOCAL version
first, bit by piece, then push ONLY the Mochiichao version.
Local version = work files in ui-art / work clone, gitignored
where marked, never a PR until replacement count = 0 for that piece.

## Legend
- PULL: structure / order / values / data shape from decomp files
  already in the repo. Pulled, in this file and in title-screen-spec.md.
- REPLACE: Mochiichao version written in that exact slot, same
  step, same file. This is the version that goes to a PR.
- LEAVE OUT (public repo): actual Pokemon logo tiles, Pokemon
  art/sprites, Pokemon music/MIDI, Pokemon dialogue text, Pokemon
  names/towns/characters, ROMs, paid assets. NEVER in a PR, even
  as a "temporary" file — git history keeps it.
- LOCAL ONLY (Mars correction, 2026-10-25): items in LEAVE OUT
  above MAY be brought into the local-only working copy, for
  exact-slot comparison, and swapped out real quick for the
  Mochiichao version. Local-only means: gitignored, never
  committed, never in a PR, never in a public build, marked as
  temporary, and replaced before any push. Push gate stays the
  same: replacement count = 0 for that piece before it goes to
  a PR. No ROM downloads — local material is only what is
  already in the decomps in the repo or what Mars uploads himself.
- READ NEXT: title file exists in decomps but was not read in
  detail yet for this pull. Not claimed as pulled until read.

## Everything before the main menu, in order
Order is the game flow, not a random list:
Boot -> Title Screen -> Press Start -> Copyright Screen (FireRed)
-> Main Menu (v32). In Ruby/Sapphire, Title -> Press Start ->
Main Menu, with copyright as a banner on title, not a separate screen.

### 1. Boot / splash (structure only)
- PULL: GBA/DS boot goes straight to title, no menu before title.
- REPLACE: Mochiichao boot = black screen, then title (no splash
  menu invented). M Heavensent logo is NOT a boot splash — it is
  a title copyright logo, per title-screen-spec.md.
- LEAVE OUT: Nintendo / Game Freak logos, Pokemon boot art.

### 2. Title background layers
- PULL (FireRed): logo BG0/BG1, copyright+press BG2, separate layers.
- PULL (Ruby): background color layer, logo layer, version banner sprites.
- PULL (HeartGold): 2D background layers + 3D objects layer, top-screen glow layer.
- PULL (Black 2, ov162/title.c): 3D scene under a camera following
  a curve, 2D layers over it, motion blur by blending each frame
  with the last (display capture, Eva/Evb out of 16).
- REPLACE: Mochiichao layers = Pixi background (black + symbol layer),
  logo layer, version banner layer, press layer, studio layer.
  Camera curve -> Pixi camera ease (scale/position), motion blur
  -> Pixi blur filter, NOT a 3D engine switch.
- LEAVE OUT: Pokemon background art, Kyogre/Groudon/Kyurem/legendary
  silhouettes, Pokemon 3D models.

### 3. Logo shine / flash (the "flash" Mars described)
- PULL (Ruby): shine sprite x=0, y=68, x += 4/frame, bg brighten
  +2 to 31 before halfway, darken -2 to 0 after, shine twice
  (frames 160 and 64 countdown).
- PULL (Emerald): same, plus fast mode flashes bg green for 4 frames.
- PULL (FireRed): FlashSprite BLDCNT lighten, scanline 128 -> 0 step -4,
  then fade in, grayscale tint, blend gradually.
- PULL (HeartGold): top-screen glow, title layer fade in.
- PULL (Black 2): white flash at 1740 frames, layers hide/show.
- REPLACE: Mochiichao shine = white vertical band, Pixi, x += 4
  (scaled to screen), bg brighten/darken same numbers, twice,
  then version banner. Flash = lighten blend, not a whole-screen strobe.
- LEAVE OUT: Pokemon logo shine tiles themselves.

### 4. Version banner
- PULL (Ruby/Emerald): left + right sprites, initially invisible,
  slide to meet in middle, version banner X/Y, blend as it passes over logo.
- REPLACE: DIAMOND VERSION banner, width 556 (=900/phi), centre
  (600,735), slides left+right, pink outline / white font (already made).
- LEAVE OUT: Pokemon version banner tiles, "Ruby/Sapphire/Emerald" text.

### 5. Logo slide up
- PULL (Ruby Phase2): REG_BG2Y = data[3] * 256, logo moves up
  while press banner is created.
- REPLACE: Pixi logo y ease up slightly after version banner,
  same phase order, not a new animation invented from scratch.

### 6. Press Start / Press Any Key + Copyright
- PULL (Ruby): Press Start banner (DISPLAY/2,108), Copyright banner y=148,
  each 5x 32x8 segments, animated in order.
- PULL (Emerald): Press Start (128,108), Copyright (128,148).
- PULL (FireRed): Copyright + Press Start tiles on BG2, BlinkPressStart task.
- PULL (HeartGold): Start instruction flash 30 on / 15 off / 45 total,
  A/START/touch -> white fade 12 / black fade 6.
- PULL (Black 2): A/Start -> start menu, Up+Select+B -> delete save,
  Down+X+Y -> mic test, timeout 6780 frames, hide layers 1740 frames,
  camera curve loop 7300 / end 7780 / leave 7001.
- REPLACE: PRESS ANY KEY, blinking 30/15, at phi line y=927,
  A/Start/tap -> white fade -> Main Menu v32.
  Copyright = M HEAVENSENT STUDIOS logo, bottom, 556 wide,
  centre (600,1222), top 944. Delete-save / mic-test key combos
  are NOT copied as hidden features — they are listed here as
  Pokemon system keys, and Mochiichao equivalents are a Mars decision,
  not silently added.
- LEAVE OUT: Pokemon copyright text, Pokemon press start tiles.

### 7. Particles / ambient motion
- PULL (FireRed): FlameSpawner / LeafSpawner, rising particles in RUN scene.
- PULL (HeartGold): camera + glow motion, 3D objects animating.
- PULL (Black 2): camera curve motion, scrolling sub BG2 (one way in
  Black 2, other way in White 2).
- REPLACE: teal/pink symbol particles rising, same spawn pattern,
  Pixi ticker, symbol layer rising + sine (matched animation, already approved).
- LEAVE OUT: Pokemon flame/leaf sprites, legendary 3D models.

### 8. Music / sound (structure only, NOT files)
- PULL: title music plays on title, fades out on A/Start
  (FireRed FadeOutBGM(4), HeartGold SndStreamFadeStop, Black 2 fade stop).
- REPLACE: Mochiichao title music (original, not yet made — NEED),
  fade out on press, same timing pattern.
- LEAVE OUT: Pokemon title MIDI / audio files, Pokemon cries
  (Black 2 Kyurem cry on press is LEAVE OUT, not copied).

### 9. After title: Main Menu
- Already locked: v32 main menu, Menu Creator / UI Creator /
  Layout Editor / Cursor Creator / Panel Frame Editor specs.
- Title -> Main Menu transition: white fade (Ruby/FireRed pattern),
  not a cut, not a popup.

## Generations status for this pull
- READ + PULLED: Ruby, Emerald, FireRed/LeafGreen, HeartGold, Black 2 title.
- READ NEXT (files exist, not yet read in detail): Crystal title.asm
  (pokecrystal/engine/movie/title.asm, Suicune/logo art = LEAVE OUT),
  Gold title.asm, Diamond/Platinum title (not found by filename
  grep in decomps — search needed, not claimed), Yellow title.
  Those go into this file as a second batch, same legend, before
  title is called 100% across generations.
- 100% here means: 100% of the PULL + REPLACE list above for the
  generations read, with LEAVE OUT items explicitly listed, not
  silently missing. It does NOT mean 100% of Pokemon's files copied.
