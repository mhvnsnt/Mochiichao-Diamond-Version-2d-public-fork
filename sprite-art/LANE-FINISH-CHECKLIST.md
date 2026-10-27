# LANE FINISH CHECKLIST — sprite-art lane (2026-10-26, lane-finish drive)

Counts everywhere, per standing rule. "Shipped" = merged to main AND
verified; "staged" = on disk, not merged; "delegated" = a live browser
or publish step this lane cannot run itself.

## DONE AND SHIPPED (merged, 0 deletions each)

- 2D sheets: 51/51 = 100% sets, 3 sheets each, locked.
- Locked atlases: 51/51 = 100% (PR #30, 842 cells).
- Idle loops: 51/51 = 100% staged + shipped (PR #66).
- Hurt sets (baseline 1/creature): 51/51 = 100% staged + shipped (PR #67).
- Treatments module + wiring + 3D proof: shipped (PR #69).
- Idle timing reconciliation: 51/51 = 100% (PR #144, 0 retimes;
  47 keep / 3 adjust-at-wiring / 1 hold Aquariios).
- Gate C stack: shipped (PR #140). Ringcade spec: shipped (PR #141).
- Strikechamp correction: shipped (PR #142). Reconciliation + verified
  counts: shipped (PR #143). Region 1 verification pack: shipped (PR #145,
  checklist only).
- Gearkid true battle_back: shipped (PR #146, cell 16, rebuilt atlas,
  relabeled manifest). Title v4 + lab crop: shipped (PR #147).
- Razorgater _clean2 idle adoption: shipped (PR #148, Mars-approved
  "way better").
- Game-ready verdict: ship game-ready locked variant 51/51 = 100%
  (clean/ edited variants REJECTED by Mars 07:33 CDT, except the
  individually approved Razorgater clean2 and Sproutle spotfree fixes).
- Wispkin: perfect as-is, 0px correct edit, confirmed by Mars.
- Sproutle spot fix + tool: SHIPPED (PR #150, merge `17e66ccc`, 16
  files, 0 deletions, blob-SHA-verified on main). 14 *_spotfree.png in
  `sprite-art/atlases/sproutle/` + tool at
  `sprite-art/atlases/_tools/remove_ground_spot.py`. Title art: no fix
  file — main sheet verified spot-free.
- Phone-menu fix: SHIPPED (PR #149, LockedStage centering + locked menu
  movement). Main head is now `f6205c18` (#149, after #150) — NOT
  `f4581afd`. Pages still publish16 (`dccb5007`), now 12 merges behind
  main (#139–#150, 0/12 published). PUBLISH HOLD CLEARED: the
  phone-menu fix is on main, so the next publish + phone/desktop
  re-playtest are unblocked (publish still parent-delegated; the
  Sproutle-PR precondition from Segment 1 is now met).
- Title art Sproutle check: VERIFIED CLEAN — main sheet shows no
  between-feet spot; the spot was an atlas-cell artifact only.

## DONE IN THIS DRIVE (staged, not merged)

- Segment 1 — Pages publish readiness: 5/5 procedure steps documented
  = 100% ready, 0/1 published. Stale-clone trap documented (local
  pages-build/main-clone head fa77806 ≠ main f4581afd — fetch+reset
  required). Publish AFTER the Sproutle PR merges AND after confirming
  no other lane publish is in flight. File:
  `sprite-art/stage-publish-readiness/PUBLISH-READINESS-2026-10-26.md`.
- Segment 2 — Region 1 live-check script: runnable, updated for PR #146
  (Gearkid back now EXPECTED PASS, Mechapion still pose-only, PR #83
  wiring agent-reported not parent-verified). File:
  `sprite-art/stage-verify-region1/REGION1-LIVE-CHECK-SCRIPT.md`.
  Live run itself: 0/1 — parent browser delegation owed.

## DELEGATED IN THIS DRIVE (children running, results pending)

- Segment 3 — Expanded animation Batch A: COMPLETE (staged, NOT PR'd —
  PRs wait for Mars's pilot okay). 8/8 new creatures = 100%, 64/64 sets
  = 100%, 288/288 cells = 100%, 0 image generations (transforms +
  procedural VFX only); pilots verified Mochii 36/36 + Dreadtoise 36/36,
  so Batch A total = 10/10 creatures = 100%, 360 cells. Creatures:
  Razorgater, Tyrage, Kittember, Sproutle, Tiidebiite, Aquariios,
  Chromejaww, Reaperdile. Files under
  `sprite-art/animation/expanded-scope/batch-a/` (builder +
  VERIFICATION.md + per-creature manifest + 36 cells + 2 previews
  each). Honest gaps: signature vs special differ by VFX, not body
  pose — pose-redrawn 0/8 = 0%; hurt angle jump at recovery for
  Razorgater / Chromejaww / Reaperdile 3/8 = 37.5% (front-angle hurt
  face redraw owed for those 3 if Mars wants single-angle hurts);
  native-64px jets small (Tyrage flame ~10px, Aquariios bar subtle),
  same pilot caveat — in-game code travel extends them. NOTE: Sproutle
  Batch A cells use locked game-ready cell_00, NOT the spotfree files
  from the Sproutle PR lane (reported as PR #150) — a spotfree-base
  re-run is a possible follow-up, not done here.
- Segment 4 — Walk frames: COMPLETE (staged, NOT PR'd; building the
  dirs does NOT decide the walk-gate). Before 36/50 dirs = 72%, 260
  PNGs; this batch touched 16/16 dirs at 8/8 = 100% (14 missing + 2
  partial top-ups: sproutle 2/8 → 8/8, strikechamp_unsuited 2/8 → 8/8),
  124 new PNGs, 0 generations (locked-cell transforms only: copy /
  mirror / 2px bob). After: 50/50 dirs present = 100%, 384 PNGs total;
  full 8-frame dirs 42/50 = 84%. Per-creature: all 16 at 8/8 (down 2 /
  up 2 / left 2 / right 2). Important find: 6 lock-label corrections
  (dreadtoise, duskfiend, pupbble, pyromonk, toxitacle, tyrage —
  locked manifest role labels pointed at wrong-direction frames;
  caught by final montage eye-check, corrected mappings live in each
  walk manifest; locked manifests NOT edited, fixing at source is
  another lane's call). Honest residuals: 8/50 dirs = 16% below 8 PNGs
  by prior design (flyer/swimmer/hover treatments: aerobeak 4,
  finblade 4, megalochrome 4, mothrix 4, zephling 4, floatcalf 6,
  stormtalon 5, squirmite 4 — filling them would invent leg frames
  for flyers/swimmers, deliberately not done); subtle bob-variant
  pairs 3/16 = 19% (cragarm up, gorokappa left, strikechamp left —
  widening needs new art, not transforms). Files:
  `sprite-art/walk-frames/WALK-STAGE-BATCH-2026-10-26.md` + per-creature
  `<creature>.walk.json` manifests (source + provenance + eye-check +
  walk-gate note).

## RUNNING ELSEWHERE (not duplicated by this drive)

- Gabu bake: 15/31 = 48% at last check (was 13/31); Dorowani 27/27
  = 100%. Blender, do not launch a second instance.
- Gabu mesh-separation: sequenced after bake, no second Blender.
- Sproutle + tool PR-push: in flight (see above).
- Expanded-animation pilot: shown to Mars, mass PRs gated on his okay.
- Other-lane note (MEMORY, 08:48 CDT): title creatures audit 10/10
  cutouts present on main; Kittember bubble recovery STARTED by that
  lane (staged test before any swap) — not this drive's work, not
  duplicated here.

## DECISION-BLOCKED (explicitly NOT decided here — Mars only)

- Walk-gate pick: locked-sheet vs walk-frames dirs (blocks Phase A
  game-ready PR).
- S2 wording variant: A / B / C / mix (picker sent, unanswered).
- Orphan cells (10 files / 6 images): keep / drop.
- Shadowfree files (22): ship / no-ship.
- Derived icons (10 head crops): approval pending.
- Mechapion battle_back role: pose-only, never guessed.
- Aquariios idle: hover vs swim (holds its 1800ms).
- Pebblefist HP, Beast / Flora / Neon elements, Dorowani/Gabu stats.
- Flinch echo in sparring (150–250ms, standing-only fallback exists).

## NOT DONE, NOT BLOCKED (still owed after this drive)

- Pages publish itself: 0/1 (see Segment 1).
- Region 1 live playtest run: 0/1 (see Segment 2).
- Expanded animation Batches B–D: 0/3 batches (41 creatures after
  Batch A at pilot pattern).
- Move→set assignment table for all 51 creatures: 0/51.
- Game-ready atlas ship (112-file delta per reconciliation verdict):
  pending stale-field route + show-first items above.
