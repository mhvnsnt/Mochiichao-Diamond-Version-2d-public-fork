# Title full-res videos (1600x900)

Native re-renders at 1600x900, 30fps, 6s, from the FINAL set — NOT upscales.
Method: the v2/v3/v6 builders (1280x720, hardcoded geometry) were copied and
every pixel geometry scaled by 1.25x (canvas, centre, feet line, pose height,
rest offset, burst radius, streaks, glows, font, blizzard speeds and flake
sizes); frame counts, timing, poses, bursts, and PRESS START tempo are
unchanged. Backgrounds are already 1600x900 paintings, so no background
upscale is involved. No audio, no logo baked in, no mirrored look-back
frames, no Pokemon art/sound. Previews only, not imported by game code.

| Creature | Source version | Render | Size (bytes) |
|---|---|---|---|
| Yogiferno | v6 blizzard | native | 2723709 |
| Dorowani | v2 | native | 535268 |
| Gabu | v2 | native | 584328 |
| Wispkin | v2 | native | 430894 |
| Sproutle | v2 | native | 498640 |
| Tyrage | v2 | native | 662055 |
| Mythar | v2 | native | 1082331 |
| Razorgater | v3 | native | 398613 |
| Mochii | v3 | native | 838133 |
| Kittember | v3 | native | 685231 |

Builders (staging): action-videos-fullres/make_fullres_builders.py,
build_videos_fullres_v2.py, build_videos_fullres_v3.py,
build_video_fullres_v6.py. Source v2/v3/v6 files untouched (md5s re-verified
after the build). Verification: every file ffprobe 1600x900, 6.0s; extracted
frames eye-checked for Dorowani (rest, feet on ground line), Yogiferno
(blizzard right-to-left, torch flame bent back, figure readable), Kittember
(tail-orb glow, lanterns), Mochii (round pose, tip pointed, no crop),
Mythar (centred, wings, sparkles, sine waves).

Known carry-over, not introduced here: the vertical background seam at the
right edge from the v4/v5 scrolling-strip wrap is still visible in the
Yogiferno blizzard frames.
