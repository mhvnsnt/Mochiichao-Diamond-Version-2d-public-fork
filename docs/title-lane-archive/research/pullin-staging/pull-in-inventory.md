# Title Backgrounds lane — pull-in inventory (Pokemon-first rule)

Format per item: Pokemon element -> Mochiichao replacement in that spot -> HAVE / WIRED / NEED / REJECTED, with evidence. No Pokemon creature art, background art, logo, or sounds are shipped anywhere in this batch. Lane scope only: backgrounds, cards, drift/effects, actions, shots, anims, videos, TitleScene wiring. Never touched: logo, fonts, subtitle, main menu, IntroSequence phase flow, players, default title/menu.

## 1. Pokemon files

### 1a. FireRed title FadeIn palette fade -> TitleScene entry fades — HAVE
`pokefirered-leafgreen/src/title_screen.c` SetTitleScreenScene_FadeIn (BeginNormalPaletteFade) -> TitleScene Platinum entry/exit fades (entry black 48 frames, exit delay 10 + white 6 + white-in 6, clear-save black 6, BGM fade 60 frames documented). Verified in TitleScene header + ticker code. No new work.

### 1b. Ruby logo shine sweep -> TitleScene Ruby shine band — HAVE
`pokeruby/src/title_screen.c` SpriteCallback_PokemonLogoShine (x+=4, brightness to 31/0, re-fire at counters 160 and 64) -> TitleScene shineBand + shineBg on app.stage. Verified in code. No new work. (Logo itself is Mars's uploaded PNG, never font text — unchanged.)

### 1c. FireRed intro Scene 1 background zoom -> TitleScene background zoom-in — NEED (patch staged, not in this PR)
`pokefirered-leafgreen/src/intro.c` Scene1_Task_BgZoom -> a background-only zoom-in over the first 60 frames of a TitleScene, settling at the current cover scale. TitleScene already has Black 2 camera pan/zoom on the scene container, so this must apply ONLY to bgSprite, never to the scene camera, or the two cameras fight. Staged patch (apply + build-gate before any future PR):
- Store `bgBaseScale` when the painted background sprite is created (currently scale is set once and never stored).
- In the ticker, while frame < 60: `bgSprite.scale.set(bgBaseScale * (0.97 + 0.03 * frame / 60))`; at frame >= 60: `bgSprite.scale.set(bgBaseScale)`.
- Safety: 0.97 * 1.06 overscan = 1.028 > 1.0 cover, so the zoom can never reveal an edge. Reduced-motion path must skip it (static painting).
- Why not in this PR: local git clone/fetch was blocked by network contention this turn, so the Vite build gate for a TitleScene edit could not run. A TitleScene edit without a build gate does not ship. Patch text is preserved here so it is not lost.

### 1d. FireRed intro Scene 2 forest pan -> TitleScene per-biome drift + foreground frame — HAVE
`intro.c` Scene2_Task_PanForest (background trees right, foreground plants left) -> HeartGold parallax drift (far layer slowest) + foreground frame in TitleScene. Verified in ticker. No new work.

### 1e. Field weather particle systems -> TitleScene weather — PARTIAL HAVE, full swap NEED
Black 2 `ov076/weather_rain.c`, `ov077/weather_sandstorm.c`, HeartGold field weather -> `src/lib/fieldWeather.ts` already holds the full systems: rain drops with splash states, sand grains with wind tables (SAND_WIND_X/Y, 320-frame cycle, 40-frame steps), blizzard flakes, snow sway table, flutter flakes, specks, thunderstorm lightning counts (1–3), tint levels. TitleScene's weather layer uses simplified particles only (rain lines, leaf shapes, dust dots, snow flakes) and does NOT call fieldWeather step functions. Full step-function swap is NEED: it is a ticker rewrite, and the benefit over the current simplified particles does not justify that risk in this batch. Plain reason, not a claim that weather is missing — weather is present, just simplified.

### 1f. Day/night palette tint -> REJECTED for title cards
HeartGold `gf_rtc.c` TIME_OF_DAY_BY_HOUR (MORN/DAY/EVE/NITE/LATE) -> already HAVE in `fieldWeather.ts` for world/field lanes. NOT wired to title cards because title cards are fixed scenes, not clock-driven: night and lantern cards are always night by painting. A time tint would darken approved night/lantern paintings and change the locked look. Rejected for this lane, kept for world lanes.

## 2. Open source already in repo tools/

### 2a. FastNoiseLite -> REJECTED
`tools/fastnoise/FastNoiseLite.h` -> no title use. Backgrounds are locked, Mars-approved painted PNGs; a noise overlay would change approved art, and repainting backgrounds with noise was not ordered. No visible improvement without repainting. Rejected, not wired.

### 2b. WFC (Wave Function Collapse) -> REJECTED
`tools/wfc/` (C# models, samples, tilesets) -> no title use. Its tilesets are generic samples that do not match the painted cards, and background detail variation would mean new background variants, not ordered. Rejected, not wired. (rot.js, DSDecmp, ndstool in tools/ are also not title-lane tools — they belong to other lanes and were not pulled here.)

## 3. Open source production tooling

### 3a. OpenCV hand/landmark tracking -> NOT WIRED this batch (do not duplicate in-flight work)
OpenCV is NOT installed on this VM (import cv2 fails). PIL + numpy fist measurement is already used by the in-flight Yogiferno v4 torch tracker for the front fist. Adding an OpenCV tracker here would duplicate that work. MediaPipe human-face models are REJECTED for faces — documented failure on creature faces, never reuse for faces. OpenCV template matching remains a possible later upgrade for hand tracking, not a gap in the shipped videos.

### 3b. ffmpeg filters -> PARTIAL HAVE; WebM VP9 REJECTED this batch
ffmpeg/libx264 is already the video path (v1/v2/v3 builders). Denoise: not needed — source poses are clean cutouts, denoise would soften them. Scale (Lanczos): wired via `tools/title_phone.py`. WebM VP9 web version: REJECTED this batch — a single 6-second VP9 encode timed out past 180s on CPU, MP4 H264 is already web-playable, and there is no user-visible benefit for title previews. Later route: GPU encode at scale via the Kaggle template, with hours re-checked first.

### 3c. Sprite-atlas packing -> WIRED
`tools/title_atlas.py` packs pose PNGs into one atlas + JSON cell map, deterministic row packing, no scaling, no art change. Output in this PR: `src/assets/title/title-poses-v2-atlas.png` (2048×3059, 40 cells, 3.5 MB) + `src/assets/title/title-poses-v2-atlas.json` (cell x/y/w/h per pose file). Verified in staging: 40/40 cells present, first cell dorowani-pose-stand 263×398.

## 4. Industry-standard lane pipeline -> WIRED (this PR)

- `tools/title_manifest.py` — deterministic manifest builder: path, bytes, sha256, PNG dimensions/mode, video width/height/fps/frames/duration via ffprobe. Staging run on action-videos-v2: 56 files, 9,284,322 bytes, manifest PASS.
- `tools/title_verify.py` — verification gate: video duration + frame-diff across the loop (evidence gate — a single still is not proof of animation), manifest existence + sha256 match. Staging run: all 10 v2 videos PASS at 3.0s vs 3.5s, min diff 0.5 — Yogiferno 1.35, Dorowani 6.06, Razorgater 2.14, Gabu 2.40, Wispkin 5.56, Sproutle 4.56, Tyrage 5.74, Mochii 8.94, Kittember 6.57, Mythar 18.01 (within-pose baseline ~0.03).
- `tools/title_phone.py` + 10 phone previews — 390×844 renders: landscape background scaled to fit 390px width, centred vertically on a dark field, NO text added. In this PR: `src/assets/title/phone/title-bg-<biome>-phone-390x844.png` for snow, grass, water, sand, stone, forest, rain, night, mythar, lantern (50–100 KB each, 744 KB total). Eye-checked: snow preview shows the full painting centred, no crop, no text.
- This inventory file itself: `docs/title-pull-in-inventory.md`.

## 5. Kaggle GPU -> HAVE (template), NOT run for this batch

Repo doc `docs/gpu-workflow.md` (PR #204 merged) + proven template notebook (Kaggle, Mars FMMG, T4 x2, Blender 4.2.0, GPU test render 256×256 32 samples, 55,666 bytes, GPU_RENDER_OK). NOT run for this batch, with the stated reason: pipeline tools here are tiny Python/PNG work and a 6-second 2D encode — GPU genuinely cannot help that step, and claiming otherwise would break the evidence gate. GPU remains the route for Blender bakes and encode-at-scale later, with hours re-checked before every job, free only, original art only.

## What is NOT in this PR, plainly

- Final title videos are NOT shipped here. Parent's latest call: repo save of final videos waits on the hand-drawn Yogiferno opposite-stride frame + the v5 flip fix. Shipping v2/v3 videos now would freeze a Yogiferno that Mars has explicitly said is not final.
- TitleScene intro-zoom (1c) and full fieldWeather step swap (1e) are NEED, not wired, for the reasons above. No TitleScene file is modified in this PR, so no game behaviour changes from this batch — it is pipeline + previews + inventory only.
- No logo, font, subtitle, menu, IntroSequence, or player file is touched. No Pokemon art, background art, logo, or sounds are in any file in this PR.

## Counts

- Evaluated: 13 items (1a–1f, 2a–2b, 3a–3c, 4, 5).
- HAVE already: 3 (1a, 1b, 1d) + partial HAVE: 2 (1e, 3b).
- WIRED this batch: 2 groups (3c atlas, 4 pipeline) = 17 new files in PR.
- REJECTED with reason: 4 (1f, 2a, 2b, 3b-WebM).
- NEED (not wired): 3 (1c patch staged, 1e full weather swap, 3a OpenCV upgrade) + final videos (blocked on parent's Yogiferno call, not on this batch).
