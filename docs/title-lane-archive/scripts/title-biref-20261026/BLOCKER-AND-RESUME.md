# Title BiRefNet 20261026 — BLOCKER + RESUME NOTE (2026-10-26, ~07:00 CDT)

## Status
- BiRefNet drafts produced: 0/7 = 0%.
- PR created: NONE. No files uploaded, no wiring changed, no deletions.
- Do NOT claim any of the 7 as done. Mars has not confirmed any BiRefNet cutout.

## Blocker: BiRefNet inference is OOM-Killed on this machine
- Machine: 8 GB RAM, 0 swap, 2 CPUs, shared with other lanes (Blender bake
  ~1.35 GB RSS, tsc jobs, daemon). Available RAM at launch attempts: 2.1–4.3 GB.
- BiRefNet-general (1024x1024, ~/.u2net/birefnet-general.onnx, 972,666,916 bytes,
  md5 7a35a0141cbbc80de11d9c9a28f52697 — matches rembg's expected checksum):
  Killed (bash "Killed", exit 137) on 3 inference attempts (batch, dorowani
  single, gabu single). The first batch run was NOT an inference failure: it
  was downloading to the wrong filename (see below) and was killed by me.
- BiRefNet-general-lite (1024x1024, ~/.u2net/birefnet-general-lite.onnx,
  224,005,088 bytes, md5 4fab47adc4ff364be1713e97b7e66334 — matches rembg):
  Killed (exit 137) on gabu single after ~138 s; the 7-crop lite batch also
  died with no output.
- 512px shortcut does NOT work: the lite ONNX graph has FIXED 1024x1024 input
  dimensions (ONNX InvalidArgument, fast failure, not OOM). Do not retry 512.
- 1-thread general did not finish in 280 s (timeout, not a kill) — too slow
  to be the answer on 2 CPUs under load.

## What is already done and verified (resume from here, do not redo)
- Deconfliction (GitHub API): main at start aea72204, then e9504e54 (PR #100),
  then 74dcbe0c (PR #106) at last check. Open PRs: none claiming title cutouts.
  Razorgater is DONE — Mars-approved, PR #95 merged (razorgater-walk-cutout.png
  265x266 on main). Do NOT re-cut Razorgater.
- No dated BiRefNet file exists on main or in an open PR for any of the 7.
- Crops (this dir, crops/): one front figure per creature from its own sheet,
  eye-checked as crops (not yet as cutouts):
  - wispkin: V1 sheet sheet-0-dcd0, box (0,0,403,630) — Duskfiend/Tiidebiite NOT used
  - tyrage: sheet-v1, box (0,0,370,387), ground cracks included
  - kittember: sheet-v1, box (0,0,326,387), ember tail orb included
  - sproutle: sheet-0-819475, box (0,0,370,387), goggles + shell
  - dorowani: dorowani_sheet_v1, box (1010,20,1370,475), front arms-down pose
  - gabu: gabu_sheet_v1, box (979,13,1421,340), front pose, feet complete
  - mythar: sheet-0-09ce45, box (0,0,451,365), wings + halo ring
- Confirmed files re-verified (hashes match the handoff exactly):
  - mochii-title-cutout-20261025-v1.png 380x380, sha256 f0f9e208…
  - yogiferno-walk-cutout-20261025-v2.png 134x190, sha256 60dcb1aa…
  Mochii v1 is byte-identical to main's mochii-walk-cutout.png. Yogiferno v2
  differs from main's v1 (43,174 vs 40,283 bytes) — its file + import swap
  (YogifernoTitleWalk.tsx → dated v2, TitleCreatureFigure.tsx → dated v1,
  latest file now 5,141 bytes at src/components/game/TitleCreatureFigure.tsx)
  still needs re-applying to latest main via Contents API; it was NOT done
  in this slice (drafts-only rule) and must NOT be copied from the dirty
  gate clone ~/workspace/mochiichao-work/menu-title-build-clone.
- Gate clone (this dir, gate-clone/): clean depth-1 clone at bfaee9b2,
  status clean, scripts build=vite build / lint=tsc --noEmit /
  validate:reference=tsx src/lib/validate-reference.ts. Main has moved since
  (74dcbe0c), so fetch/checkout latest main there before any gate run.
  NEVER commit from any work clone; PR via Contents API only.
- Scripts in this dir: finalize.py (auto decontaminate + 1px alpha feather +
  trim → <name>-title-cutout-20261026-v1.png), check_on_black.py (black/white
  eye-check composites), upload_pr.py (7 dated PNGs, drafts only, NO wiring),
  run_biref_lite512.py (DO NOT USE — 512 rejected by the ONNX graph).
- Model filename trap: rembg looks for ~/.u2net/birefnet-general.onnx, NOT
  BiRefNet-general-epoch_244.onnx. The 928 MB file under the epoch name is
  byte-identical (same md5) and was copied to the expected name. A fresh
  rembg run will NOT re-download if the expected name exists.

## Legitimate next options (parent/Mars decides, worker does not pick alone)
1. Re-run BiRefNet (general first, lite second) when the machine is quiet,
   or with swap / a bigger VM — the only change needed is RAM headroom.
   Then: finalize.py → eye-check on black/white → gate build/lint/validate
   in gate-clone → upload_pr.py → report PR + settle + merge gate.
2. Parent-approved fallback to u2netp (cached, tiny, previously used for
   these very cutouts and Mars-approved for Razorgater) — labelled as u2netp,
   NOT BiRefNet. This worker did NOT do that, because the task mandates
   BiRefNet and a silent substitution would mislabel the PR.

## UPDATE 2026-10-26 ~07:1x CDT — corrected scope (PR #109)
- Confirmed set is now 8/10 = 80% (Yogiferno v2, Mochii v1, Sproutle /
  Dorowani / Tyrage / Kittember via PR #84 "those are all perfect", Gabu
  "confirmed fine", Razorgater shadow fix). Do NOT re-cut any of those 8.
  Remaining: 2/10 = 20% = Wispkin + Mythar ONLY.
- MYTHAR — candidate already on main, UNWIRED, awaiting Mars's show-first
  decision (wire / reject / manual edge pass). File:
  src/assets/title/mythar-walk-cutout-20261026-u2netp.png, 246,840 bytes,
  434x350, sha ceae11aedd, via PR #109 (merged c50c1dfc). TitleCreatureFigure
  on main 5b6dc6b9 still imports mythar-walk-cutout.png (238,243 bytes) —
  candidate is NOT imported. Eye-check + diff (this dir, mythar-check/):
  candidate is a strict subset of wired (only-candidate opaque = 0,
  only-wired opaque = 2,279, -2.7% opaque: 80,635 vs 82,914); same pose,
  wings, halo ring and sparkles visually intact at full size; differences
  concentrate at wing-tip edges and the lower halo/feet band. Verdict:
  wireable (cleaner edges, no major element lost), but the benefit over
  wired is marginal — Mars decides wire / reject / manual edge pass.
  This worker did NOT wire it.
- WISPKIN — BiRefNet-lite, SERIALIZED (no parallel BiRefNet job running,
  Blender bake pid 8493 finished before launch, available 2,792 MB at
  launch): single wispkin crop, log wispkin-lite.log — process vanished
  mid-inference with no output, same Killed pattern as before. BiRefNet
  (general x3 Killed, lite x1 Killed, lite batch died, wispkin lite
  serialized Killed) cannot run on this 7.8 GB no-swap VM under current
  load, even serialized. u2netp deletes 99.4% of Wispkin smoke (PR #109
  worker measurement) — do NOT ship a u2netp Wispkin.
- Wispkin flood-fill smoke test (this turn, light RAM, NOT shipped):
  flood-fill thresh 60 on crops/wispkin-crop.png → 288x593, 83,362 opaque
  vs wired 288x609, 83,770 opaque. Near-duplicate with a 16 px SHORTER
  smoke tail — rejected as a meaningful new candidate, not uploaded.
  Test file kept only in mythar-check/wispkin-flood60-test.png for reference.
- Wispkin therefore remains production-owed: needs BiRefNet on a machine
  with RAM headroom (or swap / bigger VM). Do NOT re-run BiRefNet while
  a heavy job (Blender bake, another BiRefNet job) is running.
- Yogiferno v2 nuance: counted in the confirmed 8, but its dated file +
  import swap are still NOT on main (main still serves yogiferno-walk-cutout
  v1, 40,283 bytes). That wiring remains owed separately from the 2/10
  above. Mochii v1 is byte-identical to the wired file, so its swap is moot.

## Counts (for the parent report)
- Pool 10: Mars-confirmed 3/10 = 30% (Mochii v1, Yogiferno v2, Razorgater PR #95).
  Live on main as confirmed: 2/10 = 20% (Mochii wired file identical, Razorgater
  PR #95); Yogiferno v2 confirmed but NOT yet on main (landing + swap owed).
- This slice's new drafts: 0/7 = 0% (Wispkin, Tyrage, Kittember, Sproutle,
  Dorowani, Gabu, Mythar) — all blocked on BiRefNet OOM, none eye-checked,
  none uploaded, none wired.
- Deletions: 0. Force-push: none. Pages publish: none (coordinator owns it).
