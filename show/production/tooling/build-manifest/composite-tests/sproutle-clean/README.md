# Composite test — clean Sproutle (no-baked-shadows proof)

The proof of record for the no-baked-shadows law, built with
`composite_shot.py` (see ../..) on 2026-10-27: Sproutle idles
on the living Garden Gate plate, and the shadow under its feet
is NOT in the character art — it was generated at composite
time.

- Source art: the clean Sproutle cutout
  (`show/production/canon-cutouts/sproutle.png`), verified to
  contain 0 warm-beige shadow-band pixels (the v1 baked file
  carried 2,665). The character clip
  (`sproutle-idle-clean.webm`, VP9 alpha) was rendered from
  the committed rig with the clean texture.
- Post shadow: `sproutle-shadow-post.webm` — derived per
  frame from the character clip's own alpha (silhouette
  squashed x0.22, gaussian blur, 0.35 opacity, anchored to
  each frame's feet line), so it tracks the idle.
- Shot spec: `sproutle-gate-shot.json` (background = living
  Gate plate v2, audio = background's own wind bed).
- Final: `TEST-sproutle-gate-clean.mp4` (1280x720, 24 fps,
  8.0 s) + frame grabs (`grab-early-t1.0.png`,
  `grab-late-t6.5.png`) + `zoom-feet-shadow.png`.

Loudness, honestly: the Gate wind bed measures -56.19 LUFS
integrated with peaks at -14.27 dBTP, so the -14 LUFS house
target is physically unreachable on this bed; the tool
reported final -42.18 LUFS / -2.15 dBTP and flagged
loudness_within_1LU: false rather than forcing it.

Only the finals are staged here. The frame intermediates
(158 frames, shadow frames, filmstrips) are scratch and stay
local by verdict.

| File | Bytes | MD5 |
|---|---|---|
| TEST-sproutle-gate-clean.mp4 | 804478 | `71d53a372b731b6c0f8e4c626cac2f00` |
| sproutle-idle-clean.webm | 225643 | `2c9c93fdc3504305e6a0362ff9c38ef5` |
| sproutle-shadow-post.webm | 6959 | `52a7823dcf74060ab463051cf6ce235d` |
| sproutle-gate-shot.json | 543 | `991d346d4448407caa06bb84c2604658` |
| grab-early-t1.0.png | 1033957 | `1dca28e3db22d0b7bb177a52936442df` |
| grab-late-t6.5.png | 1066620 | `7a141cf64fe3abda6d8f7f918890aaf3` |
| zoom-feet-shadow.png | 64269 | `2ad81ac6eeceb38871aaa2c195dee952` |
