# Push-Then-Clean Audit — Sprite Lane — 2026-10-27 ~08:52 CDT

Rule (Mars, 2026-10-27 ~08:43 CDT, standing forever, already in
~/AGENTS.md + ~/MEMORY.md — not re-recorded here in full): push everything
on disc into its repo, merged cleanly, verified by blob SHA / main head /
file count, THEN clean the disc copy — and only a copy verified in a
repo. Game-usable work goes to the public Mochiichao repo; Pokemon /
Sonic Adventure / Sonic proprietary material goes to the private repo,
never public. NEVER delete our work: never a sole copy, never a file not
verified in a repo. Gate for every batch: PR-only, additions only,
0 deletions unless Mars approved that specific deletion, no force-push,
mergeable CLEAN, build + lint + validate pass.

Main head at audit time: 60b5e62d (2026-10-27 ~08:52 CDT).
Disc root: ~/workspace/mochiichao-work/sprite-art/ = 1.1 GB total.

## Disc vs main, by directory (file counts, not just bytes)

Finished / shippable sets — essentially IN REPO already (counts match
within a few files; per-file SHA verification still owed per batch):
- game-ready: disc 1,103 vs main 1,107 (main has 4 more from other lanes)
- animation/attack: disc 317 vs main 313
- animation/hurt: disc 276 vs main 142 (disc carries extra variants;
  core PR #115 set = 142 — extra variants need a keep-or-drop decision,
  NOT auto-pushed)
- animation/idle-second-pose: disc 51 vs main 51
- animation/faint: disc 24 vs main 24
- portraits-scripted-v3: disc 50 vs main 50
- garden-poses: disc 251 vs main 250
- battle-backgrounds-v3: disc 12 vs main 6 (v3d only shipped; v3
  structure files deliberately not shipped)
- title (curated): disc 42 vs main 9 (curated ship only, PR #126;
  superseded variants deliberately NOT shipped)

Only-on-disc bulk — NOT finished game assets, do NOT blind-push:
- animation/expanded-scope: disc 24,349 vs main 5,431 = 22% in repo.
  18,918 files only on disc: 22,027 PNG + 1,529 GIF + 525 JSON +
  110 .py + docs. These are articulation / VFX-origin work products:
  batches, rebases, reworks, wide variants (v2/v3/wide/wide2-6),
  retrofit passes — i.e. intermediates + superseded takes, under the
  version-lock rule (superseded = DO NOT USE, never silently reused).
  Pushing all 18,918 files would bloat the public repo with takes Mars
  has not approved as current. Next segment: inventory expanded-scope
  for CURRENT takes only (registry-checked), push those, leave the rest
  classified as scratch/superseded — with that classification shown to
  Mars before any cleanup, never deleted silently.
- atlases creature sheets: disc ~1,886 files (~24 MB) vs main 25 files
  = ~1% in repo. Earlier standing decision: the shippable locked set is
  game-ready/ (1100 files, ~15 MB); the full 282 MB atlases sheets were
  deliberately NOT shipped. That decision is NOT overturned by this
  audit — full sheets are flagged for a push-or-keep decision, not
  auto-pushed as a 24 MB / 1,886-file batch.
- atlases/_tools: 258 MB of the 282 MB is a Python venv
  (.venv-opencv — numpy/cv2/PIL packages, 2,690 files). This is
  REINSTALLABLE TOOLING, not work product, and it must never go into
  any repo. It is also NOT a repo-verified duplicate, so under the
  rule it is NOT cleaned this turn — it is reported here as the single
  biggest disc item (258 MB) so Mars can call it. Deleting a venv loses
  no work; reinstall is `pip install opencv-python pillow numpy`.
- 2d-sheets: disc 385 vs main 0 — BUT already covered by open PR #291
  ("Phase 1 ship: Dorowani hurtfix + 2D cleaned sheets + sweep docs").
  Do NOT push a duplicate batch; verify #291's branch contents first.
- blender-bakes: disc 18 files / 55 MB vs main 0 (dorowani/gabu/
  kaggle-corrected + README + VIEW-MAPPING). Kaggle/GPU work products;
  route to repo only as the corrected deliverables, not raw bakes,
  and only after checking open-PR overlap.
- walk-frames: disc 591 vs main 322 (269 only on disc — local walk
  sheets/frames beyond the shipped dirs; reconcile against the
  36/51 walk-dirs count before any batch).
- overworld: disc 382 vs main 265 (117 only on disc).
- game-ready-canonical: disc 113 vs main 0 (canonical duplicate of
  game-ready? — verify whether it duplicates shipped files before
  pushing anything; duplicates are NOT pushed).
- show-first-2026-10-25 (71 files), show-packs, qa, stage-* dirs,
  _shadow_work, _recon-scratch, mouth-shape-*: QA/show evidence and
  scratch, not game assets. These stay on disc as lane evidence until
  classified; they are small (all under 5 MB combined except
  show-first 4.7 MB).

## Totals (honest, with the caveat)

- Disc sprite-art files: ~33,400 (all subdirs + docs).
- Main sprite-art files: 9,066.
- By raw file count: 9,066 / 33,400 = 27% in repo.
- By finished shippable sets: ~100% in repo (game-ready, attack,
  hurt core, idle-second, faint, portraits, garden, backgrounds).
- The 73% gap is NOT 73% lost work: it is venv (2,690 files),
  intermediates/superseded takes (~18,918 files), full atlas sheets
  held local by an earlier decision (~1,886 files), and small
  local-only sets (some already in open PR #291).

## Push batches, in order (none pushed this turn — see why)

1. Overlap check (next segment, autonomous runs): compare every
   local-only set against ALL open PR branches (#291 first, then
   #290/#282/#261/#260/#256/#249 and the rest) so no duplicate batch
   is pushed and no other lane's in-flight work is clobbered.
2. Small finished local-only sets NOT in any open PR (icons, vfx,
   dorowani/gabu manifests + icon64, canonical-after-dedupe):
   gate-checked PR, additions only, SHA/count verified on main.
3. Walk-frames + overworld local-only files, after reconciling
   against main counts (322 / 265) — push only files absent on main.
4. Expanded-scope CURRENT takes only (registry-checked, Mars-shown
   where visual) — never the full 18,918-file dump.
5. Atlas sheets + blender-bakes: only on an explicit push-or-keep
   decision for those two, shown to Mars first (size + supersession
   status). No silent bulk push.
6. Cleanup, LAST and only then: delete only files verified in a repo
   by SHA + count on main head, never a sole copy, never the venv
   under this rule's wording (venv needs Mars's explicit call, since
   it has no repo copy — it is reported, not deleted).

## What was NOT done this turn (plainly)

- NOTHING was deleted from disc. Zero deletions.
- NO push batch was opened this turn, because open PR #291 already
  covers 2d-sheets and overlap with other open PRs is unchecked —
  pushing now would risk duplicate/conflicting batches.
- No proprietary Pokemon / Sonic material was found in the audited
  sprite-art dirs (all Mochiichao original art + tooling); if any
  batch turns up proprietary material, it routes to the private repo,
  never public, and that batch stops for Mars's call.

## Update 2026-10-27 ~09:15 CDT (disc-to-repo rule, UI Art lane handoff)

- PR #291 MERGED since the 08:52 audit (91 files, closed/merged):
  Dorowani hurtfix use-these set + articulation VFX-origin-fix
  manifests/docs, all under sprite-art/animation/expanded-scope/.
  Spot-verified on main by API (file 200 + size + blob SHA).
  Main head has moved past 60b5e62d; recount main before any new batch.
- Open-PR overlap check (21 open PRs, first 100 files each): NO open
  PR's first page touches any sprite-art/ target dir (2d-sheets,
  blender-bakes, walk-frames, overworld, game-ready-canonical, icons,
  vfx, dorowani, gabu, expanded-scope, atlases, show-first). Caveat,
  stated plainly: PRs with 100+ files could hide sprite-art files past
  page 1 — full per-PR file-list check is still owed before a batch
  that shares a path with a big open PR.
- NOTHING deleted this turn. No new batch pushed from this lane this
  turn: the audit + overlap check is the segment done here; the next
  segment (small finished local-only batch, gate-checked, additions
  only, SHA/count verified on main) runs via the autonomous runs, and
  cleanup only after that verification, never a sole copy.
