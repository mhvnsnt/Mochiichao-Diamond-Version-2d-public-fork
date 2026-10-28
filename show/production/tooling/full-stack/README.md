# tooling/full-stack/ — the one-pass full-stack wiring package

Landed 2026-10-28 from the episode-rebuild lane's working package.
This folder is the record of the owner's one-pass order: pull free
full-stack public solutions for the generated-animation problem
(the character must be CORRECT), wire them in one pass, and grade
everything exactly as it stands — never upgraded.

## Stack of record

The native ComfyUI VACE route on the staged VACE-1.3B weights —
wired end-to-end and run twice on Kaggle. The conditioning inputs
(reference image, control video, mask, first/last anchors) are
the graph's required inputs; an in-kernel audit asserts graph
dimensions and the model file's byte size against the staging
manifest before queueing.

## Proof state (graded exactly, never upgraded)

- **Attempt 2** (kernel `marsfmmg/mochiichao-vace-fullctl`):
  COMPLETE but **NOT GRADED** — its frames are stranded behind
  Kaggle's output-endpoint 429; retrieval is the main lane's
  bounded attempt, one command, written in `LANDING.md`.
- **Attempt 1** (kernel `marsfmmg/mochiichao-vace-flf`): status
  **ERROR**. An earlier COMPLETE claim for attempt 1 was
  **withdrawn in writing** in `FULL-STACK-REPORT.md` and in
  `run-records/RUN-RECORD.md`; the correction blocks there are
  part of this landing.
- The cycle's only graded generation evidence remains the
  baseline plain-I2V **FAIL** (reference never anchored).
- Gate law for any retrieved frames: frame-1 check against the
  fed reference; PASS only if the correct Dorowani performs
  Water Orb; anything else is FAIL. No partial credit.

## Grades (from TARGET-WIRING-REPORT.md)

**WIRED-PARTIAL (5)** — missing piece named per item in the
report:

- `flow/` — OpenX-Inc/flow (MIT, vendored). Missing: a
  ComfyUI/Kaggle GPU-backend adapter + a T4-class (1.3B/5B)
  model profile; paid seats flagged, free seats named.
- `wan22/` — Wan-Video/Wan2.2 official suite (Apache-2.0,
  vendored). Missing: the S2V-14B / Animate-14B weights are not
  staged (T4-marginal).
- `lightx2v/` — LightX2V (Apache-2.0, vendored). Missing:
  runtime integration; no LightX2V runner has been executed.
- `synctoon/` — synctoon (GPL-3.0, vendored). Missing: not yet
  executed here. Copyleft: keep it a standalone production
  tool; do not link it into shipped game code.
- `musetalk/` — MuseTalk (MIT, vendored). Missing: its weights
  are not staged; never run here. Seat confirmed: human-cast
  lip-sync, downstream of the voice pipe.

**NOT WIRED (3)** — reference notes only; no code landed:

- lilinsong1/comfyui-wan-video-pipeline — **no licence**, so it
  cannot be wired lawfully; its function is already covered by
  our Kaggle runner. Its staged tree does NOT land here.
- AIComicBuilder — every generation seat is a **paid hosted
  API**; there is no local generation path. The one adoptable
  asset, named as such: its prompt registry, including the
  four-view character-consistency templates. Its staged tree
  does NOT land here.
- meriasatryan/cartoon-story-generator — does not land at all:
  unlicensed + paid seats (OpenAI, RunwayML) + a local path
  broken as shipped. Its NOT WIRED record inside the reports
  suffices.

**Discovery (1):** gzxx-2025/aid-studio (MIT) — held for a
future source-verification pass; noted in the report only.

## What's here

- `FULL-STACK-REPORT.md` — the stack, the wiring map, the speed
  method, gate results with the attempt-1 correction.
- `TARGET-WIRING-REPORT.md` — the owner's nine targets, verified
  at source and graded, plus the dated deep-dive addendum.
- `LANDING.md` — this package's landing orders, the honest-state
  table, and the **retrieval debt** (one `kaggle kernels output`
  command per kernel), kept as written.
- `run-records/` — RUN-RECORD.md (exact inputs + sha256, gates,
  both attempts, correction block), INPUT-HASHES.txt, and the
  staging logs.
- `workflows/workflow.json` — the patched VACE first/last-frame
  workflow (in-kernel audited).
- `kaggle/` — the runners: `kernel/` (notebook form),
  `kernel2/` (self-sufficient script kernel), `job/` (the job
  dataset: metadata, canon cutout, control + mask videos, and
  its copy of the workflow), and the build scripts the reports
  name (`make_notebook.py`, `patch_workflow.py`,
  `stage_repos.py`).
- `flow/`, `wan22/`, `lightx2v/`, `synctoon/`, `musetalk/` —
  vendored reference trees. Each lands **with its licence file
  and its FETCH-MANIFEST.json** (pinned commit + per-file
  sha256) beside it.

Held local, NOT landed: `src/` in the source package — the
unpinned ~65 MB ComfyUI-WanVideoWrapper clone plus duplicate
staging dirs — local reference only.
