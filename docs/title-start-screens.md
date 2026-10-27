# Interchangeable title start screens

Interchangeable TITLE-phase screens, wired into the game. The locked
default title is untouched: with no preset selected, IntroSequence's
TITLE phase renders the locked phi stage exactly as before. A preset
replaces the TITLE scene only — never the logo, subtitle font, studio
card, main menu (v32), or the boot/intro flow.

## Presets (10/10)

| Preset id | Biome | Creature |
| --- | --- | --- |
| title-snow-yogiferno | snow | Yogiferno |
| title-grass-sproutle | grass | Sproutle |
| title-water-dorowani | water | Dorowani |
| title-sand-tyrage | sand | Tyrage |
| title-stone-razorgater | stone | Razorgater |
| title-forest-gabu | forest | Gabu |
| title-rain-mochii | rain | Mochii |
| title-night-wispkin | night | Wispkin |
| title-mythar-mythar | mythar | Mythar |
| title-lantern-kittember | lantern | Kittember |

Each preset's figure is the cutout already on main
(`src/assets/title/<slug>-walk-cutout.png`) and its painted
background is the biome painting already on main via TITLE_BIOMES
(`src/assets/title/title-bg-<biome>-v2.png`). No preset invents art,
and validation never substitutes another preset's art.

## The state machine

Modelled on Platinum's app states + FireRed's scene table, with
HeartGold's PROCEED_FLASH as the exit flash (research:
`ui-art/title-backgrounds/preset-research/cross-generation-title-research.md`):

```
INIT -> FADEIN -> RUN -> PROCEED -> FADEOUT -> MAIN_MENU
```

- Platinum (decomps/pokeplatinum/src/applications/title_screen.c,
  VERIFIED): INIT_RESOURCES -> SHOW_INTRO -> INIT_SOUND -> MAIN ->
  EXIT_NORMAL -> CLEANUP; exit fade delay 10 frames.
- FireRed (pokefirered-leafgreen/src/title_screen.c): INIT ->
  FLASHSPRITE -> FADEIN -> RUN -> RESTART / CRY; RUN tasks are the
  press-start blink + one spawner.
- HeartGold (pokeheartgold/src/title_screen.c): WAIT_FADE ->
  START_MUSIC -> PLAY -> PROCEED_FLASH -> FADEOUT.
- Black 2 title source was NOT found and Diamond title code was NOT
  found — neither machine is claimed. Black 2 weather/camera layers
  already inside TitleScene are reused, not a Black 2 title machine.

Pure transition table in `src/lib/titleStartScreens.ts`
(`titleStartNextState`): illegal events leave the state unchanged,
so a press during INIT/FADEIN is ignored, never queued.

Blink tempo (FireRed, shared with the locked default): first blink
60 frames (1000ms at 60fps), then 30 on / 30 off (500ms / 500ms).
The locked TITLE CSS renders exactly this
(`press-blink-first 1s steps(1) 1, press-blink 1s steps(1) 1s infinite`);
the preset overlay copies that CSS verbatim.

Press behaviour (reused, NOT redefined): any key/click in the TITLE
phase runs IntroSequence's existing advance path — M3 chirp press
sound, white fade 350ms, then MAIN_MENU. TitleScene's own
startPrompt/cry gate is NOT armed for presets (startPrompt=false),
so there is no double prompt and no double chirp.

## Layer order (bottom -> top)

1. Video — `src/assets/title/videos/<slug>-title-anim-final.mp4`,
   autoplay, loop, muted, playsInline, object-cover, full host.
2. TitleScene canvas — biome drift/weather/figure/effects. While
   the video plays it runs with `hideBackground=true`, so the video
   shows through the transparent Pixi canvas. TitleScene's own host
   is a 180px strip (its locked shape): the strip is anchored to
   the bottom of the host, below the LockedStage poster on portrait
   phones, so it does not cover the logo/subtitle/press slots; on
   other hosts it sits behind the overlay, which always wins.
3. Locked overlay — LockedStage + the logo PNG, DIAMOND VERSION
   subtitle (PINNED_SUBTITLE_FONT), PRESS ANY KEY, and studio logo
   at the locked coordinates (logo 900 wide, left 150 / top 185;
   subtitle 556 wide, left 322 / top 698; press top 905, width 1200;
   studio 556 wide, left 322 / top 944).

## Lazy load + fallback rule

Video loading is one STATIC dynamic import per preset
(`TITLE_START_VIDEO_LOADERS` in `titleStartScreens.ts`). Vite splits
each into its own chunk, so only the selected preset's video is
lazy-loaded — never all 10 in the initial bundle. A variable import
path would defeat that split and must not replace the map.

Fallback, in order: video loads -> video shows. Video loader fails
OR the `<video>` element fires onError -> `hideBackground` flips
to false and TitleScene's painted background for the SAME preset
becomes the background. The fallback is never another preset's
video, figure, or background, and never a blank screen.

`validateTitleStartScreens()` reports any missing figure, painted
background, or video loader as a GAP for that preset. At branch
time all 10 validate with 0 gaps.

## Files

- `src/lib/titleStartScreens.ts` (NEW) — registry, storage, machine,
  video loaders, validation.
- `src/components/game/TitleStartScreen.tsx` (NEW) — one preset's
  screen (video -> TitleScene -> locked overlay).
- `src/components/game/TitleScene.tsx` — ADDITIVE prop only:
  `hideBackground?: boolean` (default false). When true it skips
  the painted bgSprite layer AND the Pixi sky/ground/tuft/shimmer
  fallback (skipping only bgSprite would leave those rectangles
  covering the video), while drift/weather/figure/effects keep
  running. The locked default never passes it, so its render is
  unchanged in behaviour.
- `src/components/IntroSequence.tsx` — TITLE branch only: a
  selected preset renders `<TitleStartScreen>`; null renders the
  existing locked TITLE render exactly as before (not refactored,
  not moved).
- `src/components/game/SettingsScreen.tsx` — one TITLE SCREEN row
  (Locked Default first, then the 10 presets, LEFT/RIGHT cycles in
  the existing FireRed option_menu.c row pattern, saved immediately
  on cycling like the skin rows). RESET TO LOCKED DEFAULT clears
  the selection.

## #157 / #199 compatibility

Open PR #157 (definitions only, 10 presets, NOT on main) uses
`src/lib/titleScreenPresets.ts`; open PR #199 (selection + Settings
row + IntroSequence branch, stacks on #157, NOT on main) uses
`src/lib/titleScreenPresetSelection.ts`. This batch merges to main
WITHOUT either: its filenames are new
(`titleStartScreens.ts`, `TitleStartScreen.tsx`), but its preset ids
are IDENTICAL to #157's and its localStorage key is IDENTICAL to
#199's (`mochiichao_player_title_screen_preset`, null = locked
default), so a later #157/#199 merge renames nothing and does not
collide on a filename. When that merge lands, the two registries
and the two selection modules must be reconciled into one — that
reconciliation is that merge's job, not a silent rename here.

Note the deliberate differences from #199's approach: #199 added a
`fullHeight` prop to TitleScene and carried NO logo overlay on
presets; this batch adds only `hideBackground` to TitleScene and
carries the locked overlay verbatim (see the sync warning in
`TitleStartScreen.tsx`'s file header). If the locked default ever
changes, the overlay copy in `TitleStartScreen.tsx` must be
re-synced by hand — the locked default code path itself is
untouched.

Not wired here (deliberately, not silently): Kittember's glow frame
cycle (`figureCycleUrls`) and Yogiferno's fire trail (`fireTrail`)
are not passed to TitleScene for presets — the prop list is
biome/figure/figureName/startPrompt(false). Both are later wiring
decisions, not additions smuggled into this batch.

## Phone renders + playtest plan

Phone renders (390x844, built with the `tools/title_phone.py`
pattern extended to the video layer's object-cover behaviour —
painted background cover-cropped to 390x844, figure cutout
composited at title scale in the bottom scene strip) are produced
alongside this doc as evidence, not as live screenshots (no logo
overlay, no video frame, and no live game are in them). At
minimum: snow/Yogiferno and mythar presets. They are eye-checked
for: background fills the phone without stretching, figure sits on
the ground line (Mythar hovers, never grounds), no text is baked
into the background painting, and the figure reads cleanly over
the background at phone size.

Live playtest checklist (NOT done by this batch — a live Pages
publish is the parent's step, not this batch's; do not claim live
until a rebuild is published):

1. Fresh load, no preset: locked phi title exactly as before
   (logo, subtitle, press blink, studio logo, chirp, white fade,
   main menu v32).
2. Settings > TITLE SCREEN, cycle RIGHT once: value reads
   'Snow — Yogiferno'; return to title (B / BACK TO TITLE):
   snow video + Yogiferno scene + locked overlay; press any key:
   chirp, white fade, main menu.
3. Cycle through all 10 presets: each shows its own video and
   figure, none shows another preset's art, none blanks.
4. Video-failure path: (dev-only) block the video chunk — the same
   preset's painted background shows instead, overlay intact.
5. RESET TO LOCKED DEFAULT: title returns to the locked phi stage;
   localStorage key is cleared.
6. Phone (390px): overlay slots readable, press prompt tappable,
   scene strip below the poster, no horizontal scroll.
7. Reduced motion: scene renders static (existing TitleScene
   behaviour), press path unchanged.
