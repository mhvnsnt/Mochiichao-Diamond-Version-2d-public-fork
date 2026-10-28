# Frame interpolation — RIFE on the Kaggle seat

Date: 2026-10-28. Workflow: `rife_workflow.json` in this folder
(ComfyUI API format: Load Video → RIFE VFI → Video Combine).

## What it is for

Two jobs in the freedom path:

1. **Doubling the frame rate** — a chained character clip generated at
   the Wan seat's working rate comes out at 2× fps (24 → 48 in the
   shipped workflow), same duration, smoother motion.
2. **Softening chained seams** — interpolation invents the in-between
   frames, which takes the edge off the joints `chain_segments.py`
   measures in its seam report. (It softens a seam; it does not fix a
   bad one. A seam ratio far above 1 still means re-generate that
   segment from its extracted start frame.)

## The node pack (exact name)

**ComfyUI-Frame-Interpolation** by Fannovel16 —
`https://github.com/Fannovel16/ComfyUI-Frame-Interpolation`

- The workflow's middle node is that pack's **RIFE VFI** node
  (`class_type: "RIFE VFI"`, category
  `ComfyUI-Frame-Interpolation/VFI`).
- Licence, verified at the source repo on 2026-10-28: the pack itself
  is **MIT License** (the repo's LICENSE file; GitHub reports
  "MIT License" for Fannovel16/ComfyUI-Frame-Interpolation). Bucket:
  **open source (MIT)**. The RIFE method it wraps is from Huang et al.,
  ECCV 2022 (citation in the pack's README).
- Load/Combine nodes are ComfyUI-VideoHelperSuite's `VHS_LoadVideo` /
  `VHS_VideoCombine`, the same suite the Kaggle Wan seat already uses.

## THE GAP — the flownet is staged nowhere (read this before running)

The RIFE flownet checkpoint the node needs (**`rife47.pth`**, set as
`ckpt_name` in the workflow) is **not staged anywhere in our system**:
not in this repo, not in the Kaggle consistency-kit datasets, not on
TeraBox. That is a recorded gap, not an oversight in this file.

How it closes, by design: the pack's own loader downloads the flownet
checkpoint automatically on first use. So the **scene notebook on the
Kaggle seat must fetch the flownet in-session** — clone/install the
pack into the notebook's ComfyUI `custom_nodes`, run `python install.py`
inside that environment (the pack's documented Linux install step), and
let the first RIFE VFI execution pull `rife47.pth` into the pack's
`vfi_models` folder. Budget a slow first run for that download; later
runs in the same session reuse it.

Still owed after that first run (staging law — local/session copies are
a workbench, not a warehouse): stage the fetched flownet + the pack
into the Kaggle consistency-kit dataset or TeraBox, with a manifest
entry, so no future session re-downloads it. Until that staging lands,
every fresh Kaggle session pays the in-session fetch. This file flags
the gap in writing rather than pretending the workflow runs as-is.

## Running notes

- Set the Load node's video to the chained clip and the Combine node's
  `frame_rate` to **exactly 2× the clip's fps** — the multiplier adds
  frames, it does not set playback speed; mismatching them produces
  slow motion, not smoothness.
- Interpolate the **character clip before compositing** (or the finished
  scene — both work; per-character is cheaper and keeps the background's
  own motion untouched).
- Kaggle seat only: RIFE leans on CUDA/cupy. There is no local-VM run of
  this workflow in the smoke tests for this package; the two local smoke
  tests cover `chain_segments.py` and `scene_composite.py` (results in
  `SMOKE-TESTS.md`).
