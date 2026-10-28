# HARVEST STATUS — scene kernel output download blocked again (new attempt, 2026-10-28)

## Outcome
STOPPED per the standing 429 rule. Two harvest calls in this attempt, both
429. No further Kaggle requests were made after the second 429 — no retry,
no alternate endpoint, no seg3 work. `scene-raw/` is empty (0 files).

## Exact errors (verbatim CLI output, both calls)

Attempt 1 — started 2026-10-28T10:07:31Z (after a ~12-minute pre-wait,
09:55:29Z–~10:07:29Z):

```
429 Client Error: Too Many Requests for url: https://api.kaggle.com/v1/kernels.KernelsApiService/ListKernelSessionOutput

You have been rate limited. Wait a little while before retrying.
```
CLI exit code 1. `scene-raw/` total 0.

Retry 1 (the single permitted retry, after a 15-minute wait
10:08:32Z–~10:23:32Z) — started 2026-10-28T10:23:34Z, command run ended
2026-10-28T10:24:34Z:

```
429 Client Error: Too Many Requests for url: https://api.kaggle.com/v1/kernels.KernelsApiService/ListKernelSessionOutput

You have been rate limited. Wait a little while before retrying.
```
CLI exit code 1. `scene-raw/` total 0.

Status file written 2026-10-28T10:24:39Z.

For reference, the previous attempt's identical 429 was at 09:52 UTC the
same day (TEST-REPORT.md §6).

## Local prep — verified in this attempt (no Kaggle involved)
- `python3 -m py_compile postprocess.py build_seg3.py` — OK, no syntax errors.
- Background plate exists: 
  `~/workspace/mochiichao-show/repo-add/show/episodes/EP01/animatic/EP01-CUT01-composite-life-proof-v1.mp4`
  — 488,726 bytes, md5 `d2f1bf1d709d3a0e9d9d0f58dccc6c31` (matches the
  expected/registry md5 exactly), ffprobe: h264, 1280×720, 24 fps,
  192 frames, 8.0 s.
- Canon cutouts present: `~/workspace/mochiichao-show/canon-cutouts/wispkin.png`
  (129,111 bytes), `~/workspace/mochiichao-show/canon-cutouts/dorowani.png`
  (123,418 bytes).
- Postprocess dependencies present on disk: `white_matte.py`,
  `verify_proof.py`, `likeness_gate.py`; `ffmpeg`/`ffprobe` on PATH;
  Kaggle CLI 2.2.5 at `~/opt/tools/kaggle-venv/bin/kaggle` (not invoked
  again after the second 429).

## What was NOT done (blocked on the harvest, nothing else)
- No segment MP4s downloaded, so: no ffprobe of the 4 segments, no reading
  of `scene-run-report.json` (RIFE outcome still unknown), no
  `postprocess.py` run, no TEST-SCENE.mp4 / contact-sheet.png, no track
  measurements, no likeness/seam numbers, no frame-1 verdicts for the
  scene tracks.
- Seg3 follow-up NOT started (it depends on harvested seg2 last frames).

## Resume commands (run in a NEW attempt, after the rate limit clears)
```bash
cd ~/workspace/avatar-tool-build/test-scene
~/opt/tools/kaggle-venv/bin/kaggle kernels output marsfmmg/mochiichao-wan-scene-test -p scene-raw --force \
  --file-pattern ".*(\.mp4|scene-run-report\.json|run-report\.json|\.log)"
# then:
ls -lh scene-raw && cat scene-raw/scene-run-report.json
python3 postprocess.py
# then seg3 (build_seg3.py extracts seg2 last frames, writes scene-job3/):
python3 build_seg3.py
~/opt/tools/kaggle-venv/bin/kaggle datasets version -p scene-job3 -m "seg3 follow-up job"
~/opt/tools/kaggle-venv/bin/kaggle kernels push -p scene-kernel
```
Note: the dataset-version / kernel-push lines above are the standard
Kaggle CLI form for the existing dataset `marsfmmg/mochiichao-scene-job`
and kernel `marsfmmg/mochiichao-wan-scene-test` recorded in
`scene-kernel/kernel-metadata.json` / `scene-job/dataset-metadata.json`;
they were NOT run in this attempt (all Kaggle work stopped at the 429).
