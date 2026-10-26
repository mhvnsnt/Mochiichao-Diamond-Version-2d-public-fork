# Title action shots: drafts, layering, setup, and animation research

Saved 2026-10-26 (Mars ~06:52-06:55 CDT). This doc is the saved setup
for the 10 title action-shot drafts, so the same stack can be reused
for combat scenes, battle scenes, and environment scenes later. Those
later scenes are NOT built here - this doc only saves how the title
drafts were made, and the animation research for the next step.

## 1. The drafts - saved exactly, never overwritten

All 10 drafts are in `src/assets/title/draft-<creature>-action-shot-v*.png`,
1600x900, shown to Mars 2026-10-26 and called "really good" by him.
Draft filenames are fixed. The animated versions that come next use
DIFFERENT filenames (`<creature>-action-anim-v1.png`), so no animated
version can ever overwrite a draft. Superseded staging versions are
NOT in the repo: Tyrage v1 (faint sand) and Gabu v1 (bubbles) stay
staging-only in `ui-art/title-backgrounds/action-shots/`.

| Creature | Card | Draft file | Bytes | Burst |
|---|---|---|---|---|
| Yogiferno | snow | draft-yogiferno-action-shot-v1.png | 626,683 | fire |
| Sproutle | grass | draft-sproutle-action-shot-v1.png | 640,462 | shield ring |
| Dorowani | water | draft-dorowani-action-shot-v1.png | 611,825 | bubbles |
| Tyrage | sand | draft-tyrage-action-shot-v2.png | 647,846 | sand |
| Razorgater | stone | draft-razorgater-action-shot-v1.png | 549,926 | sparks |
| Gabu | forest | draft-gabu-action-shot-v2.png | 539,790 | LEAVES |
| Mochii | rain | draft-mochii-action-shot-v1.png | 598,160 | bubbles |
| Wispkin | night | draft-wispkin-action-shot-v1.png | 521,600 | smoke |
| Mythar | mythar | draft-mythar-action-shot-v1.png | 1,058,616 | sparkle |
| Kittember | lantern | draft-kittember-action-shot-v1.png | 512,929 | fire |

Data version of this table: `src/lib/titleActionShots.ts`
(`TITLE_ACTION_SHOT_DRAFTS` + `TITLE_CARD_ANIMATION_STYLES`).

## 2. Layering - how a draft was made, in order

L0 - Card background: the card's v2 painting, full 1600x900.
    Centre kept as smooth haze so the figure and the game UI layers
    (logo, press line, drawn OVER the PNG by the game, never baked in)
    stay readable. No text, no logo, no font baked into any PNG.
L1 - Card effect: the card's signature effect from
    `titleCardEffects.ts` (snow twinkle, grass pollen, water ripples,
    sand dust, stone scan, forest fireflies, rain lightning, night
    stars, mythar diamond sparkle, lantern amber glow).
L2 - Figure: the creature's existing clean walk cutout ONLY.
    No redraw, no new likeness. Draft placement: centred horizontally,
    feet on the card ground line, at the burst moment.
L3 - Action burst: at the FireRed intro scene-3 burst moment
    (idle -> hop -> burst at frame 270 -> recoil -> settle,
    360-frame / 6-second cycle, `creatureActionFrame` in
    `titleCardEffects.ts`). One burst per creature, from its own
    manifest VFX where one exists.
L4 - Foreground frame: in front of the figure's feet.

Gabu correction (Mars 2026-10-26 ~06:52 CDT): Gabu's burst is LEAVES,
not bubbles. Bubbles were a leftover from his old water placement.
`titleCardEffects.ts` now says `burst: 'leaves'`, colour 0x4ade80,
and `TitleScene.tsx` draws leaves as green ellipses that flutter
down and sway, matching the forest leaf weather shape. Gabu's exact
draft placement is on file: cutout 292x295 scaled 554x560, x 523,
y 122, feet y 700, hop -18. For the other 9 drafts the staging worker
did not save per-pixel numbers, so this doc records centre + ground
line + burst moment (what the PNGs show) and does NOT invent numbers.

## 3. Animation research - what the Pokemon files actually do

Read from the repo's decomp submodules, structure only, no art or
code copied: `pokefirered-leafgreen/src/title_screen.c` and
`src/intro.c`, plus HeartGold's intro movie layer order (from the
earlier research pass).

What the files SAY:
- FireRed title screen state machine: INIT -> FlashSprite -> FadeIn
  -> Run -> Cry. In Run, two tasks run together: the press-start
  blink task and a version spawner (FireRed flame spawner,
  LeafGreen leaf spawner). The title creature is a static box-art
  background layer, not a sprite that walks across the title screen.
- Press-start blink (`Task_TitleScreen_BlinkPressStart`): the first
  blink lasts 60 frames, then it alternates every 30 frames (palette
  swap on/off). That 60-then-30 rhythm IS the tempo of the title
  screen: 1 second first, then 0.5 seconds on/off at 60fps.
- FireRed INTRO (not the title screen) is where creatures move:
  Scene 1 grass close-up + background zoom + grass scrolling;
  Scene 2 forest pan + creature pan + close-ups; Scene 3 entrance
  (creature enters from a start X to an end X at a speed, then hop,
  cry, attack swipe, recoil, zoom). So "appears, then moves over to
  a side" is INTRO movement, not title-screen movement.
- HeartGold intro movie: layers scroll at different speeds, far
  layer slowest, near layer fastest (parallax order). That is the
  order already used for the per-biome background drift.

What the files do NOT say (plainly, per the Pokemon-first rule):
no Pokemon title-screen file was found where the title creature
enters centre, moves to a side, and then loops its action while the
press-start blinks. That centre -> side -> action shape is
MARS'S description of how it should FEEL, and it is adopted here as
a MOCHIICHAO adaptation, not as Pokemon canon: entrance at centre,
move to the card's rest side, then the action loop, with the
press-start blink (60 then 30 frames) setting the tempo, and the
card effects moving WITH the figure to its rest side.

## 4. Per-card animation styles - each card its own, not all the same

Full table: `TITLE_CARD_ANIMATION_STYLES` in `titleActionShots.ts`.
Shape for every card: centre entrance -> move to rest side ->
action loop (360-frame cycle) -> effects follow the figure.
Rest sides: left (-140px): Yogiferno, Dorowani, Razorgater, Gabu,
Wispkin. Right (+140px): Sproutle, Tyrage, Mochii, Kittember.
Centre (0, the exception): Mythar - it never grounds and never
steps aside; the rings orbit it at centre.

Each style is tied to what is happening in the image, so the
animation gives the creature and its world a story and an identity:
snow + fire roar, grass + shield, water + bubbles, sand + storm,
stone + scan, forest + leaves, rain + lightning, night + smoke,
mythar + orbit sparkle, lantern + fire glow. The bubbles, dirt,
fire, leaves and smoke are a taste of the universe: what you see
on a title card is what that creature's world feels like.

## 5. Reuse for combat, battle, and environment scenes

Mars (2026-10-26 ~06:52 CDT): this setup is to help build combat,
battle, and environment scenes that are more detailed, more built,
and more interactive than the Pokemon games. The reusable stack is
the layer order above: environment background -> environment
effects -> figure -> action burst -> foreground frame, with the
figure's action (hop/glide/roar/scan/bounce/bob/orbit) and its burst
as separate layers, and the effects following the figure when it
moves. A combat or battle scene adds a second figure layer and a
target layer on the same stack; it does not need a new layering
invention. Those scenes are NOT built in this batch - this doc only
saves the template so they can be built from it, with new filenames
every time, never overwriting a draft.

## 6. Gaps still owed (not claimed done)

- Animated versions (`<creature>-action-anim-v1.png` + wiring) are
  the NEXT step, not this batch. This batch saves drafts + research.
- A live animated playtest on phone + desktop is owed after the
  animated versions land and a Pages rebuild contains them.
- Per-pixel placement numbers for the 9 non-Gabu drafts were never
  saved by staging; they are recorded as centre + ground line +
  burst moment, not invented.
