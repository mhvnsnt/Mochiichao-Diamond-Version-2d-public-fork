# Interchangeable start screens — cross-generation title research (structure only)

Format: Pokemon element -> Mochiichao replacement -> HAVE / NEED. No Pokemon art,
creature art, sound, name, dialogue, logo, or cry is copied anywhere in this work.
All file paths below were checked on disk in ~/workspace/mochiichao-work/fresh-start
or on main via the GitHub API. If a file is not there, this doc says so plainly.

## Generations actually on disk: CORRECTION — 5 generations in workspace decomps/

The REPO holds three decomp submodules (FireRed Gen 3, HeartGold Gen 4,
Black 2 Gen 5), but ~/workspace/mochiichao-work/decomps/ holds eight more
decomp trees covering Gens 1-5: pokeyellow, pokered, pokegold, pokecrystal,
pokeruby, pokeemerald, pokediamond, pokeplatinum. Mars's "five generations"
count IS supported by the workspace inventory (Gen 1, 2, 3, 4, 5). The
entries below were re-checked against decomps/ after this correction; the
earlier draft's "NOT ON DISK" labels for Ruby/Diamond were wrong for Ruby
(verified below) and remain only for Diamond's title code (see Diamond entry).

## FireRed / LeafGreen (Gen 3) — pokefirered-leafgreen/src/title_screen.c, intro.c — HAVE (in TitleScene) / NEED (preset machine)

- State machine: TITLESCREENSCENE_INIT -> FLASHSPRITE -> FADEIN -> RUN ->
  RESTART / CRY (function table at title_screen.c:281-286). Tasks in RUN:
  press-start blink + one spawner (FireRed flame / LeafGreen leaf).
  -> Mochiichao: TitleScene already runs blink + spawner tasks; the preset
  screen needs its own small machine (INIT -> FADEIN -> RUN -> PROCEED ->
  FADEOUT). NEED (new component, not a TitleScene change except one prop).
- Press-start blink: first blink 60 frames, then alternating every 30 frames.
  -> Mochiichao: locked default already renders this tempo (CSS steps in
  IntroSequence TITLE); presets reuse the SAME tempo, same prompt text.
  HAVE (tempo) / NEED (preset reuse of it).
- Title creature is a static box-art BG layer, NOT a moving sprite.
  -> Mochiichao: ADAPTATION, labelled as such — our presets move the figure
  centre -> rest side -> action loop (that movement is FireRed INTRO movement,
  intro.c Scene 3, not title canon). HAVE (TitleScene v2, PR #152).
- Intro Scene 1 background zoom, Scene 2 forest pan, Scene 3 entrance.
  -> Mochiichao: bg zoom wired in PR #223 (bgSprite only, 60 frames);
  forest pan = HeartGold parallax drift. HAVE.

## Ruby (Gen 3) — decomps/pokeruby/src/title_screen.c — VERIFIED ON DISK

- Task chain Task_TitleScreenPhase1 -> Phase2 -> Phase3 (created at
  line 568), shine sprite callback SpriteCallback_PokemonLogoShine
  (line 460) with sprite->x += 4 (line 488), brightness to 31/0, re-fire
  at counters 160 and 64.
  -> Mochiichao: shine band already in TitleScene/titleAnimations.ts
  (HAVE); the Phase1/2/3 task chain is the model for the preset machine's
  INIT -> FADEIN -> RUN phases (NEED, new component).
- Ruby title structure beyond shine/phases (e.g. press handling in
  Phase3): present in the file but not re-typed here; the preset press
  path keeps the locked default's chirp + white fade, not a Ruby press
  handler copy. HAVE (shine) / NEED (machine, modelled on phases).

## Gen 1 / Gen 2 — decomps/pokeyellow, pokered, pokegold, pokecrystal — VERIFIED ON DISK

- Yellow/Red title.asm, Crystal title.asm (engine/movie/title.asm):
  title creature slides/drops into place, logo, palettes, press-start
  timer (wTitleScreenTimer, wTitleScreenSelectedOption).
  -> Mochiichao: the oldest pattern — one scene, one figure, one
  press prompt — is exactly what a preset screen is. The preset machine
  keeps that shape (no scene cuts inside a preset; cf. startScreenPreset
  timeline.sceneCount = 1). HAVE (pattern) / NEED (preset machine).

## Emerald (Gen 3) — decomps/pokeemerald/src/title_screen.c — VERIFIED ON DISK

- title_screen.c present with title enums (lines 26, 456); Emerald's
  title follows the same GBA task/phase shape as Ruby/FireRed.
  -> Mochiichao: no separate Emerald element is needed beyond the
  shared GBA phase model. HAVE (model shared with Ruby/FireRed).

## HeartGold / SoulSilver (Gen 4) — pokeheartgold/src/title_screen.c, intro_movie*.c — HAVE (parts) / NEED (preset machine)

- Main states: TITLESCREEN_MAIN_WAIT_FADE -> START_MUSIC -> PLAY ->
  PROCEED_FLASH -> PROCEED_FLASH_2 / PROCEED_NOFLASH -> FADEOUT.
  Model states OFF/STOP/RUN, anim SETUP/RUN, top-screen glow
  SETUP/GLOW_IN/GLOW_OUT/GLOW_PAUSE. TITLE_SCREEN_DURATION 2340.
  -> Mochiichao: preset press path = PROCEED_FLASH (white flash) -> FADEOUT
  -> MAIN_MENU, matching the locked default's existing white fade 350ms +
  M3 chirp press sound. The machine states are the preset component's states;
  the press behaviour itself is NOT changed. NEED (preset machine).
- Intro movie layers scroll far-slowest to near-fastest.
  -> Mochiichao: per-biome drift already in TitleScene. HAVE.
- Start flash prompt cycle 0 show / 30 hide / 45 cycle (already in
  titleAnimations.ts as HeartGold start flash).
  -> Mochiichao: presets keep the locked press prompt, not the HG flash
  cycle, to avoid double prompts (same rule as #157's seam note). HAVE
  (decision recorded, not wired twice).

## Platinum (Gen 4) — decomps/pokeplatinum/src/applications/title_screen.c — VERIFIED ON DISK

- App states: INIT_RESOURCES -> SHOW_INTRO -> INIT_SOUND -> MAIN ->
  EXIT_NORMAL / EXIT_REPLAY_OPENING -> CLEANUP. Intro states include
  FADE_FROM_BLACK, WAIT_AND_FADE_TO_WHITE, MOVE_IN_TITLE_CAMERA,
  FADE_MAIN_FROM_BLACK. Main state includes BLINK_TEXT. Exit fade
  delay: TITLE_SCREEN_EXIT_FADE_DELAY_FRAMES = 10.
  -> Mochiichao: this is the closest model to the preset machine —
  INIT (resources) -> SHOW (fade in) -> MAIN (blink + run) ->
  EXIT_NORMAL (fade out, 10-frame delay) -> MAIN_MENU. The preset
  machine below is modelled on Platinum's app states + FireRed's
  scene table, with HeartGold's PROCEED_FLASH as the exit flash.
  NEED (preset machine, modelled here).
- Diamond: NO title_screen source was located in decomps/pokediamond
  (only files/demo/title titledemo assets were found). Diamond title
  code: NOT VERIFIED — do not invent it; Platinum stands in for the
  Gen 4 DS title structure, labelled as Platinum, not Diamond.

## Black 2 / White 2 (Gen 5) — pokebw2 — title source NOT FOUND / other systems HAVE

- A title_screen.c was NOT located in pokebw2/src (searched src/ and
  include/; only unrelated constants like DPCBMP_WIN_TITLE / MANUAL title
  data matched). Black 2's title-screen source is therefore NOT VERIFIED
  from this decomp, stated plainly — no Black 2 title state machine is
  claimed in the preset code.
- Verified Black 2 contributions already in use: ov075/weather_particles.c
  blizzard (speed/gust tables, used for Yogiferno v6), camera pan/zoom +
  motion-blur ghost (in titleAnimations.ts / TitleScene), field weather
  systems (in src/lib/fieldWeather.ts). HAVE.
- Black 2 is the NEWEST generation we have, but newest does not mean its
  title code is present: the preset machine is built on the FireRed +
  HeartGold machines that ARE on disk, with Black 2 weather/camera layered
  in. That substitution is labelled here, not hidden.

## Mod-community / open-source files in tools/ — NO title system found

- tools/ holds rot.js, FastNoiseLite, WFC, DSDecmp, ndstool, extraction
  scripts, and the title pipeline (tools/title_atlas.py,
  title_manifest.py, title_verify.py, title_phone.py, PR #213). None of
  these is a title-screen system; none is pulled in as preset code.
  Title-relevant mod/open-source contribution: NONE this batch, stated
  plainly. The pipeline tools ARE reused for preset renders (phone
  previews, verification gates).

## Existing preset work — gap list (checked on main + open PRs)

- PR #157 (OPEN, unmerged): definitions only — 10 presets
  (title-snow-yogiferno, title-grass-sproutle, title-water-dorowani,
  title-sand-tyrage, title-stone-razorgater, title-forest-gabu,
  title-rain-mochii, title-night-wispkin, title-mythar-mythar,
  title-lantern-kittember), src/lib/titleScreenPresets.ts + .json.
  NOT on main. Renders nothing, wires nothing.
- PR #199 (OPEN, unmerged, stacks on #157): selection storage
  (localStorage key mochiichao_player_title_screen_preset), Settings
  TITLE SCREEN row, IntroSequence branch. NOT on main, and it imports
  #157's module, so it cannot merge to main alone.
- On main today: NO preset registry, NO selection, NO video layer
  (TitleScene has 0 occurrences of "video"), NO preset screen component.
  TitleScene props on main: biome, figureUrl, figureCycleUrls,
  figureName, fireTrail, caption, startPrompt, exitKind.
- GAP LIST for this task (all NEED, none on main):
  1. Preset registry (new module, preset ids compatible with #157 so a
     later #157 merge does not rename anything; do NOT recreate
     #157's filenames).
  2. Video background layer, lazy-loaded per selected preset only,
     with painted-background + TitleScene fallback on load error.
  3. Preset state machine (INIT -> FADEIN -> RUN -> PROCEED -> FADEOUT).
  4. Selection UI (Settings row, full-screen pattern, not a popup) +
     IntroSequence TITLE branch that renders the preset ONLY when one
     is selected and otherwise runs the locked default path untouched.
  5. Phone-size (390x844) renders of the presets + a live playtest plan.
  6. (Not this task) Merging #157/#199 themselves — that is their lanes'
     call; this task must merge to main WITHOUT them.
