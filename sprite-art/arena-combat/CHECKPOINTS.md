# Arena combat — checkpoints (segments, so a restart resumes, never restarts)

## Segment 1 — ESM fix verification (2026-10-26)
- Finding: the three named suites were ALREADY converted to ESM by a prior completion pass
  (headers state "converted 2026-10-25 from require(); assertions unchanged").
  The only `require(` matches left in test files are those header comments, not code.
- Full suite run in this directory: `node --test *.test.js follower/*.test.js`
  → 89 tests, 89 pass, 0 fail (arenaCombat 40, captureLoop 15, fanMechanics 16,
  followerWalk 7, moveData 11). Before: core 40/40 only, 3 suites failing on CJS harness.
- No logic changes made in this segment; no test assertions changed.
- Demo re-run: invariant holds — sparring clashes HP delta 0; only chosen attacks
  (Tackle, Ember) change HP. Fight-as-creature driven mode verified same invariant.

## Segment 2 — PR contents decision (2026-10-26)
- NEW files (404 on main, safe to add): arenaCombat.js, arenaCombat.test.js, demo.js,
  README.md, CHECKPOINT-MOVEDATA-CORRECTION.md, CORRECTION-SECTION.md.
- UPDATED files (local newer, ESM exports/import conversion only, assertions unchanged):
  fanMechanics.js, fanMechanics.test.js, follower/followerWalk.js,
  follower/followerWalk.test.js — uploaded with their main blob SHAs.
- SKIPPED (do not regress main): FAN-MECHANICS-SUMMARY.md, REPLACEMENTS.md —
  main's versions are NEWER (they already contain the ring-gating + real-move
  corrections); local copies predate them. captureLoop.js/.test.js, moveData.js/.test.js,
  follower specs, ring-capture-zone-spec.md are byte-identical to main — skipped.
- CONFIRMATION ITEM STAGED, NOT DECIDED (show-first rule): ring capture zone exact
  name — candidates staged in sprite-art/arena-combat/ring-capture-zone-spec.md
  (already on main, §2): The Ringcade, Neon Loop Hall, Pixel Ring Hall.
  Nothing in this batch locks a name; parent presents the candidates to Mars.

## Segment 3 — PR (to be filled on merge)
- Branch, PR number/URL, merge SHA, main head after merge: (pending)
