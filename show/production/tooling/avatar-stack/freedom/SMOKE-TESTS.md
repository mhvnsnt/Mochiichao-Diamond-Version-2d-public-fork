# Smoke tests — run locally on 2026-10-28

Both tests ran on this VM against clips and backgrounds that already
exist locally. Scratch lived under `~/workspace/avatar-tool-build/wiring/work/`
(/tmp pinch rule). The test outputs themselves are local workbench
evidence, not staged assets.

## 1. chain_segments.py

Command:

```
python3 freedom/chain_segments.py \
  ~/workspace/mochiichao-show/character-sheets/wispkin/wispkin-float_idle.mp4 \
  ~/workspace/mochiichao-show/character-sheets/wispkin/wispkin-mask_tilt_left.mp4 \
  --out work/wispkin-chained-smoke.mp4 \
  --report work/wispkin-chained-smoke.seams.json \
  --workdir work/chain-work
```

Result:

- Segments: float_idle (512×512, 30 fps, 4.0 s) + mask_tilt_left
  (512×512, 30 fps, 1.6 s).
- Joined output: `work/wispkin-chained-smoke.mp4` — 512×512, 30 fps,
  **5.6 s** (= 4.0 + 1.6, as expected).
- Next-start frame extracted: `work/chain-work/wispkin-float_idle_next_start.png`.
- Seam measurement: **seam mean abs diff 0.3485** vs **clip median
  consecutive diff 0.1652** → **seam ratio 2.11**. The tool flagged the
  joint as "visible jump likely" — correct behaviour: these two clips
  were NOT generated as a chained pair (the second was not conditioned
  on the first's last frame), and the report says exactly what to do
  about it. The instrument works; a truly conditioned pair should land
  near ratio 1.

## 2. scene_composite.py

Command:

```
python3 freedom/scene_composite.py \
  ~/workspace/mochiichao-show/repo-add/show/episodes/EP01/animatic/EP01-CUT01-composite-life-proof-v1.mp4 \
  work/scene-smoke.mp4 \
  --layer .../wispkin/wispkin-float_idle.transparent.webm --x 0.30 --y 0.92 --scale 0.50 --z 1 --start 0.0 \
  --layer .../bundle-ship/dorowani-idle.transparent.webm  --x 0.68 --y 0.95 --scale 0.62 --z 2 --start 0.5 \
  --workdir work/scene-work
```

Background: the CURRENT living Gate background (life-proof v1,
1280×720, 24 fps, 8.0 s) — the same file `gate-proof-shot.json` pairs
composites against. Layers: two real transparent twins (VP9 WebM with
alpha) — Wispkin back (z 1), Dorowani front (z 2, entering at 0.5 s).

Result:

- Output: `work/scene-smoke.mp4` — **1280×720, 24 fps, 8.000 s**.
- Plate-defect guard passed: corner mean RGB **(109.1, 143.9, 118.9)**
  — the corners are the garden plate, not a flattened black box.
- Frames extracted and **read by eye**:
  - **t = 2 s**: both characters on screen over the Gate — Wispkin left
    (mask, hands, smoke trail), Dorowani right (blue, red fin cheeks)
    — alpha edges clean, no rectangles, and a soft elliptical contact
    shadow sits under each character (drawn by the tool at composite
    time; the character clips themselves carry no shadow).
  - **t = 6 s**: Wispkin is gone (its clip is 4.0 s, so its window
    ended — correct), Dorowani remains with its shadow. Confirms the
    per-layer start/duration windows work.
