# ToonCrafter inbetweening kernel — RAN 2026-10-28, FAILED AT PRE-FLIGHT; FIXED, RE-RUN PENDING

Kernel: `marsfmmg/mochiichao-tooncrafter` (script, GPU, internet on).

**First run (2026-10-28): FAILED, zero generation.** Kaggle stamped the
run "success", but the kernel died at ~144 s in pre-flight validation:
`AttributeError: 'str' object has no attribute 'get'` at `validate()`
(`node.get("class_type")`). Cause: the embedded workflow
(`workflows/tooncrafter_inbetween_api.json`) carries documentation as a
top-level `"_comment"` entry whose value is a **string**, and
`validate()` iterated every top-level entry assuming each is a node
dict. When it reached `_comment`, it crashed — after setup (clones,
checkpoint, keyframe prep all verified good) and before the prompt was
ever queued, so no clip existed. The same string entry would also have
been POSTed to /prompt inside the graph.

**Fix (2026-10-28, parse-time normalisation, validation stays strict):**
`normalize_workflow()` (in `tools/validate_workflow.py`, inlined in the
kernel) splits the parsed workflow into node entries (dicts) and
metadata (anything else) immediately after `json.loads`; the kernel
validates and queues only the node dict. `_comment` stays in the
workflow file as documentation — it just never enters the graph.
`validate()` additionally reports any non-dict entry that somehow
reaches it as a named validation error instead of crashing. Verified
locally: the pre-fix validator reproduces the exact AttributeError on
this workflow; the fixed one passes the real graph and still rejects
deliberately broken graphs. The kernel source on Kaggle must be
re-uploaded from this fixed copy before any re-run; the re-run itself
is a separate decision.
Dataset source: `marsfmmg/mochiichao-likeness-datasets` (the tarball in
`../likeness-datasets.tar` — upload it as that dataset first; this
account's CLI drops dataset subfolders, so the tar is the unit).

What it does, in order:
1. Clones ComfyUI + ComfyUI-DynamiCrafterWrapper (pinned d312c629) +
   VideoHelperSuite (pinned 4d907bee).
2. Downloads the ToonCrafter pruned FP16 checkpoint from
   `Kijai/DynamiCrafter_pruned` and **verifies sha256 7a60eefa…** before
   use; stages the matching sketch encoder beside it.
3. Builds the proof job from the datasets tarball: frames 0 / 46 / 92 of
   the canon Dorowani `idle_breathe` clip → start/end keyframes prepped
   onto 512×320 white canvases (hash-logged), real middle frame saved.
4. Starts ComfyUI, **validates the embedded workflow against the live
   /object_info** (refuses to queue on any defect), runs
   `workflows/tooncrafter_inbetween_api.json` (DDIM 50 steps, 16 frames).
5. Collects the gate packet in `out/`: generated clip, generated middle
   frame, the REAL middle frame, both input keyframes, RUN-LOG.txt.

Gate after the run: generated middle vs real middle + frame-1 check.
Wrong character anywhere = FAIL, re-run via different keyframes — the
video model is never "fixed" after the fact.

Notes: the wrapper's CLIP / CLIP-vision loader nodes fetch their own
small files on first use (SD 2.1 CLIP fp16 from stabilityai, ViT-H fp16
from Kijai/CLIPVisionModelWithProjection_fp16) — wrapper-managed,
unpinned upstream downloads, recorded here so the run log surprises no
one. The ToonCrafter checkpoint itself is hash-pinned (step 2).
Licence: ToonCrafter + wrapper Apache-2.0 (upstream LICENSE governs the
checkpoint; the Kijai pruned repo declares no licence of its own — see
`../../research/weights-and-licences.md` §2.1).
