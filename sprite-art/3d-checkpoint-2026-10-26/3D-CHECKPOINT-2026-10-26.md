# 3D CHECKPOINT — 2026-10-26 (3D PAUSED per Mars order ~12:53 CDT)

All 3D work is PAUSED. This checkpoint preserves the 3D state cleanly so
nothing is lost and nothing is clobbered. No new 3D rig work was started
for this checkpoint. 2D animation and game wiring are separate phases and
are NOT in this PR.

## What is in this PR (all new paths, 0 deletions)

- `rigged/dorowani/v2-fixed/` — Dorowani v2-fixed manifest + preview PNGs
  (previews + previews_wide). Verdict in the manifest: 6/6 clips PASS
  (idle, ready, walk, attack, hit, faint) against the 2.5 edge-p999 gate.
- `rigged/gabu/v2-fixed/` — Gabu v2-fixed manifest + preview PNGs
  (previews + previews_wide). Companion to the Dorowani v2-fixed gates.
- `rigged/gabu/rerig-v1/` — Gabu re-rig v1 through iter6: ITERATION-LOG.md,
  gate JSONs + gate logs, gap logs, iter6 tool scripts (iter6_*.py),
  iter6 run logs, and preview PNG sets previews-iter5, previews-iter6-keep4,
  previews-iter6-keep2, previews-iter6-blend (+ their logs), plus the
  rerig-v1 manifest and gap/iter5 metric JSONs.
- `rigged/v2-work/` — v2 gate JSONs + gate logs and fastgate.py, the gates
  the v2-fixed manifests cite.
- `rigged/CHECKPOINT-V2-VERIFICATION.md`, `rigged/V2-VERIFICATION-REPORT.md`,
  `rigged/RIG-FIX-RESEARCH.md` — checkpoint / verification / research docs.
- Top-level bake tooling/scripts: bake.py, bake_v2.py, bake_rigged.py,
  bake_rigged_v2.py, bake_rigged_resume.py, bake_gabu_single.py,
  make_sheets.py, make_sheets_v2.py, make_rigged_sheets.py,
  build_rigged_sheets_after_bake.py, build_rigged_sheets_per_creature.py,
  bake_monitor.sh, run_gabu_single_chain.sh, run_gabu_retry_chain.sh,
  run_resume_second_recovery.sh.

## Status at pause (from the logs, not re-derived here)

- Dorowani v2-fixed: SHIPPED state, 6/6 clips pass (see its manifest).
- Gabu re-rig iter6: DOES NOT PASS. Bridged-cut keep4 + keep2 both stretch
  1.0 on all clips with floor 0.0 but only 2/12 previews visually clean
  (idle only) — no knee; bridge fraction changes nothing. Blend v1/v2/v3
  all worse. The weight-field family is exhausted; a future iter7 (NOT
  started, 3D is paused) must rebuild zones from geometry and/or weld
  the 208k-component mesh soup first. Do NOT grind more cut/blend fractions.
- Bake: STOPPED at pause. Dorowani + Gabu 3D rig sprites are replaced by
  their 2D sprites in the next phase (separate work, not this PR).

## Deliberately NOT in this PR (LOCAL-ONLY)

- ALL Dorowani/Gabu Tripo-derived GLB and FBX files (v2-fixed GLBs/FBXs,
  all rerig-v1 iter6 GLBs, and the GLB split/blend metadata JSONs). These
  stay local under `sprites-bake/` only, per Mars's order. They are NOT
  in this PR, NOT in its body, and no signed URL appears anywhere here.
- The full local-only list, with reasons, lives in the dated local
  manifest `sprites-bake/LOCAL-ONLY-3D-CHECKPOINT-2026-10-26.md`
  (local file, never uploaded). Anything whose public-repo safety was
  uncertain was left local, not guessed safe.
- Other 3D working files outside the named scope (earlier-iteration rig
  scripts, .blend working files, decompressed GLBs, baked 2D renders and
  sheets) also stay local; the baked 2D renders/sheets belong to the
  separate 2D phase, not this 3D checkpoint.

## Safety scan performed before upload

Every uploaded text file was scanned for signed-URL markers (X-Amz,
Signature=, token=) and for embedded URLs: the only URLs found are public
research/documentation links in RIG-FIX-RESEARCH.md. No signed URL is in
this PR. Uploaded PNGs contain no embedded URLs (strings scan clean).
