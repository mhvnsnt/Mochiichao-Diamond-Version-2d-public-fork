# Character Sheets — Pilot Six Clip Bundles

Character-sheet clip bundles for the six pilot species of the Mochiichao
show — every creature character in EP01, moving, on a transparent
background, in the avatar-stack bundle format.

## What these are

Each `<species>/` folder is one character sheet:

- `<species>-<animation>.mp4` — the clip on a **white field** (the avatar
  format; MP4 cannot hold transparency, so the MP4 is the white-field copy)
- `<species>-<animation>.transparent.webm` — the **transparent twin**
  (VP9 with alpha, `alpha_mode=1`) for compositing over any background
- `<species>-poster.png` — transparent poster (frame 0 of the idle)
- `manifest.json` — ffprobe-measured spec + sha256 of every file in the
  bundle, motion verification, and the likeness-gate packet summary
- `gate-packet.json` — the full likeness-gate packet for the idle clip

## Motion source — the rigs, not a generator

Every frame is a render of the species' TextRig whole-image DEFORM rig
(`show/production/rigs/builds/<species>/`), which deforms the canon
cutout's own pixels — likeness-exact by construction, no redraw, no drift.
The renderer was driven with a transparent stage (native alpha frames, no
keying), at 30 fps on a 512×512 square sheet canvas, one full animation
loop per clip. Motion is verified per animation in each manifest
(per-frame checksums + mesh vertex-buffer checksums: the vertex states
move only when skinning/FFD actually deforms the mesh).

Animations are named exactly as the rigs name them (see each rig's
RIG-NOTES.md): idle / signature animation / expression animation per
species. No shared move template is implied: Dorowani's
`water_orb_charge` is his canon Water Orb attack animation — his alone.
Per-species canon attack naming for the other signatures is mapped
separately from game data and layers in later; these bundles keep the
rig names.

Sproutle's texture is the shadow-free canon cutout (no baked shadows —
shadows are a post/compositing step, per the standing law).

## Gate status (recommendations — promotion is the owner's call)

Likeness gate run in full-body mode against the canon full-body cutouts,
shipped thresholds (SSIM ≥ 0.50 / silhouette IoU ≥ 0.55 / RGB MAD ≤ 40),
on each species' idle clip. Every bundle is `quality_status:
PENDING_GATE`, `promotion_status: PENDING_OWNER`.

| Species | Idle clip | SSIM | IoU | MAD | Gate recommendation |
| --- | --- | --- | --- | --- | --- |
| mochii | idle_bob | 0.5814 | 0.9126 | 26.76 | PASS |
| gabu | idle_breathe | 0.6543 | 0.9676 | 24.32 | PASS |
| kittember | idle | 0.4985 | 0.7520 | 53.45 | FAIL |
| sproutle | idle_breathe | 0.7711 | 0.9721 | 15.92 | PASS |
| dorowani | idle_breathe | 0.5122 | 0.9186 | 29.03 | PASS |
| wispkin | float_idle | 0.6895 | 0.8253 | 20.64 | PASS |

Kittember's FAIL is recorded as measured: the gate samples the idle's
mid-loop frame (tail + tail-tip flame displaced from the rest pose, body
mid-breath), which costs SSIM (0.4985 vs the 0.50 line) and MAD. The
silhouette still matches (IoU 0.752) and the frames are the canon pixels
themselves — this is the known pose-phase effect, not a redraw. The
packet stands as the instrument's honest read; promotion stays the
owner/scorer's decision.

## Staging

Built on the local workbench and staged here in the repo (staging law:
production material lives in GitHub for what fits — this whole set is
~6 MB — and TeraBox only for what doesn't). Nothing in this folder is
local-only.
