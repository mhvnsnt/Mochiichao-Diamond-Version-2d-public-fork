# Scene Job Format v2 — the "freedoms" job format

Date: 2026-10-28. Folder: `show/production/tooling/avatar-stack/freedom/`

## What this replaces

The hosted avatar tool only ever ran **fixed slots** (idle / working /
making_something / milestone_level_up), **one character at a time**, and
only after a candidate was **activated** as the live avatar. Job format
v2 removes all three limits:

- **Any number of characters in one scene.**
- **Each character has a LIST of segments** — as many as the scene needs.
- **Each segment's action is FREE TEXT.** There are no slot names. If
  Jamar can describe the action in words, it is a valid segment.
- **No activation gate.** A job is just a file; the Kaggle/ComfyUI seat
  runs whatever jobs it is handed (job control = ComfyUI headless API,
  teardown piece 4).

## How a job runs (the wired path)

1. For each character, each segment is generated on its own with the
   existing backend interface (`run_backend.py` in
   `ep01-rebuild/animation-backend/`, same job fields: cutout, prompt,
   negative, duration, seed, width, height, fps). Segment 1 starts from
   the character's canon cutout on a white field
   (`prep_start_frame.py`).
2. `chain_segments.py` (this folder) extracts the **last frame** of each
   finished segment; that frame becomes the **start frame of the next
   segment**, so a performance continues instead of resetting to the
   canon pose. It then joins the character's segments into one clip and
   writes a **seam report** (mean frame difference across each joint vs
   the clip's median — a big ratio means a visible jump; re-generate
   that segment from its extracted start frame).
3. Each character's joined white-field clip is keyed to a transparent
   WebM twin by the existing `white_matte.py` path (the wired
   `local-white-matte` backend in `../backends.json`).
4. `scene_composite.py` (this folder) lays every character's twin over
   the scene's background at its layer position / scale / z-order /
   start offset, drawing a **soft contact shadow per character at
   composite time only** (character art never carries a baked shadow).
5. Optional smoothing: the RIFE workflow in this folder
   (`rife_workflow.json`, see `interpolation.md`) doubles the frame
   rate on the Kaggle seat, which also softens chained seams.

## The format

```jsonc
{
  "schema": "mochiichao-show/scene-job/v2",
  "scene_id": "string - stable id, used in output filenames",
  "canvas":  { "width": 1280, "height": 720 },   // scene output size
  "fps": 24,                                      // scene output fps
  "background": {
    "clip": "path or repo path of the background MP4 (a LIVING background where one exists)",
    "note": "which background piece + which version is current for this scene"
  },
  "characters": [
    {
      "character": "canon character id, e.g. wispkin",
      "cutout": "canon cutout / model-sheet path the segments start from",
      "segments": [
        {
          "action": "FREE TEXT - the performance, in plain words",
          "duration_s": 3.0,
          "seed": 1201
          // "start_frame": filled in by chain_segments.py for segment 2+
          //   (the previous segment's extracted last frame)
        }
      ],
      "layer": {
        "x": 0.30,            // horizontal CENTRE of the character, 0..1 of frame width
        "y": 0.92,            // GROUND LINE (feet/base), 0..1 of frame height
        "scale": 0.50,        // character height as a fraction of frame height
        "z_order": 1,         // back-to-front: lower = further back
        "start_offset_s": 0.0 // when this character enters the scene
      }
      // "chained_clip": filled in after generation + chaining +
      //   white-matte: the transparent WebM scene_composite.py consumes
    }
  ]
}
```

Rules that keep the wiring honest:

- Segment counts and durations are unbounded by the format. The current
  Wan seat generates short clips per call, so long performances are
  built from more segments — that is what the chaining step is for.
- Seeds are per segment, so one segment can be re-rolled without
  re-rolling the whole performance.
- The background entry names the CURRENT version of the piece for this
  scene (current-version law): an upgrade is a new file, and the job
  says which one this scene uses.
- Prompts should be drawn from `prompt_library.json` in this folder
  where a canon action already has a proven wording; new free-text
  actions are always allowed — the library is a starting point, not a
  slot list.

Worked example: `scene_job.example.json` in this folder — Wispkin and
Dorowani performing together at the Gate.
