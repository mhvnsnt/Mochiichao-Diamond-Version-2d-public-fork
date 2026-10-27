# Avatar Pipeline — the Muse avatar pipeline, recreated for Mochiichao characters

Mars, 2026-10-27: *"The exact pipeline that makes your avatar — create that
pipeline in my repo. For my characters so we can make the show with it."*

## What the Muse pipeline is (measured, not guessed)

When Muse's avatar ("Doro", the rebuilt Dorowani) was set on 2026-10-27,
the delivered bundle was inspected with `avatar.get` + `ffprobe`. Full
numbers in `SPEC.json`:

1. **One still in** — a reference image / description.
2. **Poster still out** — 1600×1600 WebP on white.
3. **State-variant videos out** — 6 names, 4 unique files (two pairs share
   a file), each **720×720, 8.0 s, 24 fps, H.264 MP4, on white**:
   `idle` (= `connecting`), `working` (= `waiting_for_subagents`),
   `making_something`, `milestone_level_up`. The app plays the variant
   that matches what the character is doing.
4. **Manifest out** — a JSON record naming the poster, the variants, and
   which files they share.

That hosted pipeline's source and model weights belong to Muse/Meta and
are not in this repo — nothing here copies them. What this folder *does*
recreate, exactly, is the pipeline's **contract**: same inputs, same
variant names, same video/poster specs, same manifest shape — rendered
deterministically and locally, so it runs on **every Mochiichao
character**, as many times as we want, for the game, the show, and
marketing.

## Two Mochiichao additions (needed for the show)

- **Transparent background.** MP4/H.264 *cannot* store alpha — Muse
  ships white MP4s, and a "transparent MP4" does not exist. So every
  variant is rendered twice from the same frames: the white **MP4**
  (exact Muse format) and a transparent **WebM** (VP9 + alpha), plus a
  transparent PNG still. The WebMs drop straight into the Vite/Pixi game,
  a video editor, or a stream overlay.
- **Batch mode for the whole roster** (see below). Muse makes one
  avatar at a time; we need 47 species + the human cast.

## Run it

```sh
pip install -r requirements.txt   # Pillow, numpy, scipy + ffmpeg on PATH

# One character, from any front still:
python3 avatar_pipeline.py --image ../../public/assets/variants/lustre/dorowani_lustre_front.png \
    --name dorowani --out output/dorowani

# The pilot batch (the show-plan six):
python3 batch.py --only mochii,dorowani,gabu,kittember,sproutle,wispkin

# The whole roster:
python3 batch.py
```

Output per character (`output/<name>/`):

| File | What it is |
|---|---|
| `<name>.webp` | Poster still, 1600×1600, white — Muse format |
| `<name>.transparent.png` | Cut-out still (border flood-fill, belly/teeth safe) |
| `<name>-idle.mp4` / `.transparent.webm` | also serves `connecting` |
| `<name>-working.mp4` / `.transparent.webm` | also serves `waiting_for_subagents` |
| `<name>-making_something.mp4` / `.transparent.webm` | |
| `<name>-milestone_level_up.mp4` / `.transparent.webm` | |
| `manifest.json` | The bundle record, same shape as Muse's |

## Motion recipes (v1, whole-sprite, no rig)

`idle` gentle bob + breathing scale · `working` small fast bob + tilt sway ·
`making_something` rhythmic bounce + alternating tilt ·
`milestone_level_up` two celebration jumps + sparkles.
Recipes live in `frame_transform()` in `avatar_pipeline.py` — one function
to tune, and characters with real frame sets (e.g.
`sprite-art/animation/idle/<name>/idle_a/b/c.png`) can be fed frame-by-frame
later without changing the output contract.

## Generative backend (optional hook)

Set `AVATAR_PIPELINE_GENERATOR` to a command containing `{image}`,
`{variant}`, `{out_mp4}` and the MP4 stage will call it instead of the
local renderer — e.g. to plug in a hosted image-to-video model for hero
shots, while local renders cover the roster in bulk. The transparent
WebMs and manifest are still produced locally.

## Shipping an example

Generated `output/` is git-ignored. To ship a finished character in the
game, copy its bundle to a new folder, e.g.
`public/assets/show-bundles/<name>/`, in its own PR — never overwrite an
existing asset (checkpoint + no-data-loss rules).

## Rules kept

New files only · no deletions · branch + PR (`feature/avatar-pipeline-1`) ·
WORKLOG entry added with this change.
