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

## Wiring (TitleScene, PR batches)

`src/lib/titleBiomes.ts` gains an optional `backgroundImage` per biome
(pointing at `src/assets/title/title-bg-<biome>-v2.png`). `TitleScene.tsx`
loads it as layer 0 (cover-crop, centre) when present and falls back
to the old Pixi sky/ground rectangles when absent or when the load
fails, so no biome regresses. Pixi weather, clouds, figure, and fire
trail stay on top, unchanged. The full-screen TITLE phase in
`IntroSequence.tsx` still uses its old gradient + stardust until the
main lane swaps it — that swap is NOT claimed here.

## Animation (partly inherited, dedicated pass still next)

Per Pokemon title timings (structure only): FireRed flash 128->0 step -4
then fade-in, `BlinkPressStart` blink; Ruby/Emerald shine sweep
(x += 4/frame, brighten +2 to 31 then darken -2 to 0, re-fire at
counters 160 and 64); HeartGold 60-frame fade on A/Start. On current
main, TitleScene already wires those systems (`titleAnimations.ts`:
FireRed spawner, HeartGold flash, Ruby shine, Black 2 camera/blur,
Platinum fades) — and the painted layer is added to the Black 2
camera container, so it pans/zooms with the camera and the Pixi
weather/figure layers move over it. What is still NOT done, and
follows AFTER Mars sees the static v2 set, is a dedicated
per-biome PNG motion pass (scroll/parallax beyond the camera, and
any biome-specific drift) — so a rejected painting is not animated
in its own right.

## Counts

- Painted backgrounds: 8/8 = 100% (v2 files, v1 kept untouched in this folder)
- Layer map: 1/1 = 100%
- TitleScene wiring: batch 1 (snow, grass, water, sand) + batch 2
  (stone, forest, rain, night) — see PRs, each additions only, 0 deletions
- Animation per Pokemon timings: TitleScene systems on main inherited
  (camera/weather/shine/fades move over and with the painting);
  dedicated per-biome PNG motion: 0/8 = 0% (next step, after Mars eye-check)
- Pokemon art in any shipped file: 0 files
- Text baked into any background: 0 files
