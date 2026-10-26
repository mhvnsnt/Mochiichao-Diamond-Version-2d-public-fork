# Title backgrounds — Pokemon layer structure -> Mochiichao mapping

Structure/order only. No Pokemon background art, creature art, code, names,
dialogue, or music is copied. All 8 paintings are original procedural art
from `paint_title_backgrounds.py` in this folder, restyled Y2K
(teal/pink/gold edge glows). No text is baked into any background file.

## What was actually read this turn

- FireRed, in-repo: `pokefirered-leafgreen/src/intro.c` (scene_1 grass +
  bg, scene_2 forest bg + close-ups, scene_3 fight bg + grass + swipe +
  recoil dust) and `src/title_screen.c` (title scene state machine:
  INIT -> FlashSprite -> FadeIn -> Run -> Cry; border_bg background,
  logo tiles, box-art creature tiles, copyright/press-start tiles,
  flame/leaf spawner sprites on top; `BlinkPressStart` task).
- HeartGold, in-repo: `pokeheartgold/src/intro_movie_scene_1.c`
  (MAIN 0-3 / SUB 0-3 background layers, farthest to nearest, separate
  palettes; scene-1 sun + bird sprites over layered BGs) and the prior
  100% intro/title research doc (scenes 1-5, step-timer Init/Main/Exit).
- Ruby/Emerald: NO decomp submodule for Ruby/Emerald is in this repo,
  so no Ruby/Emerald file was re-read this turn. Its title structure
  below is taken from the prior `intro-title-scene-art-research-100pct.md`
  (BG0-BG3 + leaves, shine sprite sweep, version banner slides,
  logo slides up, press banner, copyright), not presented as a fresh
  file read.

## Layer order, back to front (applies to all 8 biomes)

| # | Pokemon layer (structure) | Mochiichao layer in these PNGs + TitleScene |
|---|---------------------------|---------------------------------------------|
| 0 | FireRed scene bg / HeartGold MAIN 3 (farthest) | Far sky gradient (L0 in the painter) |
| 1 | FireRed scene_2 bg / HeartGold MAIN 2 | Distant silhouettes: hills, dunes, cliffs (L1) |
| 2 | HeartGold MAIN 1 | Mid haze / horizon, soft blob texture + grain (L2) |
| 3 | FireRed scene grass / HeartGold MAIN 0 (nearest) | Near foreground framing at edges + bottom only (L3) |
| 4 | FireRed title flame/leaf spawner; Ruby/Emerald shine sprite | Particles: snow, pollen, bubbles, dust, leaves, rain, stars, fireflies (L4; in-game these stay as live Pixi weather in TitleScene, not baked motion) |
| 5 | FireRed copyright/press-start tiles (position only) | Vignette + bottom press-line scrim, NO text (L5) |
| 6 | FireRed box-art creature / HeartGold title creature (on top) | Creature slot: TitleScene figure sprite layer, unchanged, drawn OVER the PNG |
| 7 | FireRed logo tiles; Ruby/Emerald logo slide-up | Logo (phi) + PRESS line: game UI layers, unchanged, drawn OVER the PNG |

## Title-safe rule (why the centre looks empty)

The title layout that must stay readable is, in the current game code
(`IntroSequence.tsx` TITLE phase + `TitleScene.tsx` host):
logo in the middle, creature slot above it, PRESS ANY KEY near the
bottom, copyright at the very bottom. So every painting keeps
x 30-70% / y 18-72% as smooth haze: no hard edges, no bright spots,
no silhouette crossing it. All hard detail is at the left/right
edges, top corners, and bottom foreground frame. The bottom scrim
(L5) darkens only the lowest ~140px, for the press line.

## The 8 biomes (all 1600x900 PNG, v2)

- snow: pale sky, icy peaks at the edges, falling snow, frozen ground.
- grass: rolling hills, tall-grass tufts at bottom corners only, pollen.
- water: deep teal, light rays at corners, ripples + bubbles at bottom.
- sand: gold dunes, sun glow top-right corner, drifting sand grains.
- stone: grey-purple canyon cliffs at both sides, dust motes, rocky ground.
- forest: canopy blobs in top corners only, light shafts at sides,
  fern silhouettes at bottom corners, fireflies.
- rain: slate sky, diagonal rain streaks, puddle sheen at bottom.
- night: navy-purple starfield, moon top-right corner, dark hills.
- mythar: pearlescent diamond-pearl haze (pink / blue / gold /
  lavender), sine waves top + bottom bands, white + gold diamond
  sparkles at edges/corners, centre kept as smooth haze.
- lantern: night navy, warm lanterns hanging/standing at left +
  right edges and bottom corners, warm glow pools illuminating
  the area, centre kept clear for the figure + its ember glow.

## Wiring (TitleScene, PR batches)

`src/lib/titleBiomes.ts` gains an optional `backgroundImage` per biome
(pointing at `src/assets/title/title-bg-<biome>-v2.png`). `TitleScene.tsx`
loads it as layer 0 (cover-crop, centre) when present and falls back
to the old Pixi sky/ground rectangles when absent or when the load
fails, so no biome regresses. Pixi weather, clouds, figure, and fire
trail stay on top, unchanged. The full-screen TITLE phase in
`IntroSequence.tsx` still uses its old gradient + stardust until the
main lane swaps it — that swap is NOT claimed here.

## Animation — dedicated per-biome motion + per-card effects (batch 3, 2026-10-25)

Mars approved all 8 static v2 backgrounds, then ordered movement,
layering like the Pokemon files, and effects per title card and per
creature canon. Batch 3 adds that in `src/lib/titleCardEffects.ts`
(data only) + `TitleScene.tsx` (wiring), with no painting repainted
and no creature art changed.

Layer order, back to front, updated (TitleScene now):

| # | Pokemon layer (structure) | Mochiichao layer |
|---|---------------------------|------------------|
| 0 | HeartGold MAIN 3 (farthest) | Painted background, drifting per biome (far layer = slowest, HG scene_2 speed order: 0x140 / 0xC0 / 0x40) |
| 1 | HeartGold MAIN 2 / MAIN 1 | Pixi sky/ground fallback only (skipped when a painting shows) |
| 2 | FireRed box-art creature | Figure sprite, walking + sine sway (existing) |
| 2.5 | FireRed scene grass (nearest, in front) | Foreground frame in front of the figure's feet: grass/forest tufts, water line, snow drifts, forest top corners, bottom scrim |
| 3 | FireRed flame/leaf spawner | Weather particles (existing) |
| 4 | Ruby shine / HG flash (overlay) | Per-card signature effect: snow twinkle, grass pollen, water ripple rings, sand dust motes, stone scan-line (Razorgater only; others get motes), forest fireflies, rain lightning flash (every 420 frames) + splashes, night star twinkle, mythar diamond sparkle twinkle, lantern warm-amber glow pulse |
| 5 | FireRed scene 3 fight beat | Per-creature action burst: 360-frame cycle — idle, hop (frames 240-269), burst at 270, recoil (270-281), settle. Burst kind per creature manifest VFX (see table below) |
| 6 | FireRed logo / press tiles | Logo + PRESS line: game UI layers, unchanged, over everything |

Per-biome drift (px at the 180px host, sine; painting is cover x 1.06
overscan, so drift can never reveal an edge — safe margin ~10px
vertical / ~21px horizontal):

- snow 10/3 @0.25, grass 8/2 @0.35, water 4/6 @0.50, sand 10/2 @0.30,
  stone 0/0 (rock steady, intentional), forest -5/2 @0.22,
  rain 2/6 @0.40, night -3/1 @0.12, mythar -2/2 @0.15,
  lantern -3/1 @0.12. Values are assistant proposals
  from the HG speed ratios, in one data file for Mars to tune.

FireRed intro Scene 1 background zoom (pull-in 1c): TitleScene
zooms the painted background only over the first 60 frames
(0.97 -> 1.00 of the stored cover scale, then held); the Black 2
scene camera is untouched, and prefers-reduced-motion skips it.

Creature-to-card assignment (sources labelled; PROPOSED = no canon
source yet, shown to Mars first for correction). Count, plain:
10 cards, 10 title-pool creatures — one creature per card, total
10, no card empty. The old "8 cards, night holds 3" model is
superseded by batch 6 and must not be quoted.

Corrections (Mars, 2026-10-25 ~23:44 CDT): Wispkin goes on the
purple/night card (was forest); Dorowani goes on water; Gabu does
NOT go on water; Mochii goes on rain.

Corrections (Mars, 2026-10-26 ~00:14 CDT): Mythar gets his OWN
card — pearlescent iridescent diamond-pearl background with
sparkles and sine waves, real sparkly and diamond-like (his
2026-10-25 description, recovered from memory: "pearl / diamond
iridescent — sine-wave rings, diamond sparkles"). Kittember gets
his OWN card too — a night card with lanterns surrounding it,
illuminating the area, while Kittember's ember also illuminates
the area. Night keeps Wispkin only.

Confirmation (Mars, 2026-10-26 ~00:15 CDT): "Gabu is good for
forest." Forest is canon for Gabu, no longer a proposed fill.

- snow: Yogiferno (canon-habitat: snow/ice in titleRotation; snow walk variant already shipped)
- grass: Sproutle (canon-vfx: Flora/Chrome, fresh sprout)
- water: Dorowani (Mars-confirmed; title-vibe: blue water starter)
- sand: Tyrage (canon-vfx: sheds sand, roar dust storm)
- stone: Razorgater (canon-vfx: scanning lasers, blue-electricity sparks)
- forest: Gabu (Mars-confirmed 2026-10-26: "Gabu is good for forest")
- rain: Mochii (Mars-confirmed; canon-vfx: glides, ripple, bubbles)
- night: Wispkin (Mars-confirmed purple/night; canon-vfx: bobs, dark smoke)
- mythar: Mythar (Mars-confirmed own card; pearlescent diamond-pearl, sparkles, sine waves; canon-vfx: never touches ground, three golden rings orbit)
- lantern: Kittember (Mars-confirmed own card; lantern night, lanterns illuminating + ember illuminating; ember tail orb)

Per-creature action + burst (from each creature's own manifest VFX
where one exists; no audio — cries/chimes are visual only here):

- Mochii glide + bubbles, Dorowani glide + bubbles, Gabu hop + LEAVES (Mars 2026-10-26 ~06:52 CDT: leaves instead of bubbles; bubbles were a leftover from his old water placement)
- Razorgater scan + sparks, Tyrage roar + sand, Kittember bounce + fire
- Sproutle shield + shield ring, Wispkin bob + smoke,
  Yogiferno roar + fire, Mythar orbit (hovers, never grounds) + sparkle

## Animation — water ripple filter (batch 4, 2026-10-25)

The DisplacementFilter water ripple is now wired, water card only:
PixiJS v8 `DisplacementFilter` (official Pixi docs, red = horizontal
offset, green = vertical), scale {x: 14, y: 10}, map generated in
code (64x64 random grayscale upscaled with smoothing to 256x256,
repeat wrap, scrolling 20px/s horizontal / 12px/s vertical), map
sprite added to the scene with renderable=false (the filter
constructor sets that, so the map itself never draws). Ripple rings
+ shimmer stay as the fallback. Skipped under
prefers-reduced-motion.

Rain card candidate, SUPERSEDED by Mars 2026-10-25 ~23:45 CDT:
Stormtalon #021 was researched (canon: "summons dark clouds and
lightning when it flaps") but Mars said the rain card can be
Mochii, so Stormtalon is NOT assigned and rain is Mochii. Kept
here only so the research is not lost.

NOT wired, stated plainly: the full-screen TITLE phase in
IntroSequence still uses its old gradient + stardust (that swap is
main-lane work, not claimed here); live animated playback needs a
Pages rebuild — merged code alone is not a playable show.

## Counts

- Painted backgrounds: 10/10 = 100% (v2 files, v1 kept untouched in this folder)
- Layer map: 1/1 = 100%
- TitleScene wiring: batch 1 (snow, grass, water, sand) + batch 2
  (stone, forest, rain, night) + batch 6 (mythar, lantern) — see PRs, each additions only, 0 deletions
- Dedicated per-biome background motion: 10/10 = 100% (drift values in titleCardEffects.ts)
- Per-card signature effects: 10/10 = 100% (one per card)
- Per-creature card assignment: 10/10 creatures assigned across 10/10 cards = 100% filled, one per card, 0/10 PROPOSED (Gabu forest Mars-confirmed, Mythar own pearl card Mars-confirmed, Kittember own lantern card Mars-confirmed); night now Wispkin only
- Per-creature action bursts: 10/10 = 100% (one action + burst per title-pool creature)
- Water DisplacementFilter ripple: 1/1 = 100% (water card only, generated map, no asset shipped)
- Pokemon art in any shipped file: 0 files
- Text baked into any background: 0 files
- Action-shot drafts saved: 10/10 = 100% (draft-<creature>-action-shot-v*.png, Gabu v2 leaves, Tyrage v2; superseded Tyrage v1 + Gabu v1 bubbles stay staging-only, NOT in repo)
- Action-shot layering + setup saved: 1/1 = 100% (docs/title-action-shots-layer-setup.md + src/lib/titleActionShots.ts, draft + per-card animation styles)
- Per-card animation styles defined: 10/10 = 100% (each card its own rest side + action; Mythar stays centre)
- Animated versions built: 0/10 = 0% (next step, different filenames, never overwrite drafts)
- Per-card animation styles LOCKED: 10/10 = 100% (Mars 2026-10-26 ~07:07 CDT)
- TitleScene v2 wiring (staged PR, NOT merged): 1/1 = 100% of the wiring step - centre entrance (frames 0-59 fade) -> ease-out to locked rest offset (frames 60-119) -> action loop at rest, old walk replaced for styled figures only, unset figures keep old walk; 4 v2 wind streaks behind the figure, speed 7 px/frame at 1600 reference scaled by W/1600, alpha 0.3, heights cycling. Bursts, card effects, drift, camera, foreground, shadow otherwise unchanged.
- Pokemon leaf research saved: 1/1 = 100% (docs/title-pokemon-leaf-research.md, LeafGreen leaf structure, Mochiichao leaf swap, no Pokemon tile pixels shipped)
- Complex animation v2 spec saved: 1/1 = 100% (docs/title-animation-v2-complex.md, 9 moving layers vs Pokemon title's 2)
