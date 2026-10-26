# Arena combat — integration note (NOT wired yet; this PR ships new files only)

This directory ships the arena combat controller as standalone, game-import-free
modules. No `src/` file is edited by this PR: other lanes are editing battle code
in flight, so wiring is a separate, explicit step — do not force it here.

## What ships here

- `arenaCombat.js` — turn-based core + continuous between-turn layer.
  Exports: `ARENA, BODY_TYPES, MOVE_KINDS, CAMERA_SHOTS, createArenaBattle,
  computeModifiers, noModifiers, buildChosenAttackTimeline, severityFor,
  rangeBand, flankArc, toArenaMove`.
- `arenaCombat.test.js` — 40 tests. Full folder suite (with the files already on
  main): 89 tests, 89 pass, 0 fail (`node --test *.test.js follower/*.test.js`
  from this directory; `package.json` in the local lane dir declares
  `"type": "module"` — the ESM suite the tests were converted to).
- `demo.js` — scripted Mochii vs Razorgater battle, deterministic seed
  20261025. Run: `node demo.js`. Proves the invariant: sparring clashes move
  ZERO HP; only chosen attacks (Tackle, Ember — real Black 2 move data via
  `moveData.js`, already on main) change HP.
- `moveData.js` (already on main) — 560 real moves from the repo's Black 2
  decomp extraction (`src/lib/generated/decomp_black2_moves.json`).
- `follower/` (already on main) — follower walking + fight-as-creature specs
  and `followerWalk.js` (driven mode: driving moves, only choosing hurts).
- `captureLoop.js` (already on main) — normal capture default (Luigi Cubes);
  ring capture GATED behind (The Ringcade visited + played) AND
  (ring-capture items owned). See `ring-capture-zone-spec.md`.
- `fanMechanics.js` (already on main, ESM export added here) — dash/energy,
  aim shapes, AI movement, dodge, hit feedback, ground marks, sudden death.

## How to wire it (integrator's steps, not done here)

1. Import from game code (Vite project root covers this dir):
   `import { createArenaBattle, buildChosenAttackTimeline, toArenaMove }
   from '../../sprite-art/arena-combat/arenaCombat.js';`
   (adjust the relative path to the importing file's location).
2. On battle start: `createArenaBattle(playerCreature, foeCreature)`; drive the
   between-turn layer each frame (circling, sparring clashes, positioning).
   Sparring NEVER writes HP.
3. On the player's chosen attack: map the move with `toArenaMove(moveData)`,
   build the timeline with `buildChosenAttackTimeline(...)`, play
   TELEGRAPH → TRAVEL/CAST → WINDUP → STRIKE → IMPACT_HOLD → RECOIL → RETURN,
   and apply damage ONLY at RESOLUTION from the chosen attack.
4. Treatment hook: the timeline's `treatmentBeats` use the same numbers as
   `sprite-art/animation/treatments/battleTreatments.js`
   (windup 250 ms, impact hold / hitstop 90 ms, recoil 300 ms, recover 400 ms).
   Frame-0 rule: flash, particles, shake, and hitstop land together on the
   contact frame; HP drains after hitstop, never during it.
5. Camera: use `CAMERA_SHOTS` (NEUTRAL, FOLLOW, CLASH push-in only with
   shake 0, WINDUP_PUSH, IMPACT_CUT, IMPACT_SHAKE, TILT_BIG, RETURN_NEUTRAL).

## Held for Mars (show-first rule — nothing here decides them)

- Ring capture zone exact name: The Ringcade (LOCKED 2026-10-25 ~21:18 CDT,
  Mars decision; see `ring-capture-zone-spec.md` §2). Code and docs refer
  to it as The Ringcade from here on.
- Scope (Mars 2026-10-25 ~19:44): moves and animations are real, not
  genericized. The ONLY exclusions are Pokemon creature names, sounds, art,
  and dialogue. REPLACEMENTS.md's old move genericization is superseded by
  the real move data in `moveData.js`.

## Appendix (2026-10-25 completion pass) — precise BattleView patch, staged not applied

Clarification on scope: "no `src/` file is edited by this PR" (above)
is exact — but this PR is NOT new-files-only inside this directory.
Blob comparison against live main at landing time shows four files in
this directory must be UPDATED (not just added), because main still
carries their pre-ESM versions and the repo root `package.json`
declares `"type": "module"`, so their `require()` calls fail on a
main checkout today: `fanMechanics.js`, `fanMechanics.test.js`,
`follower/followerWalk.js`, `follower/followerWalk.test.js` (ESM
import/export conversion, assertions unchanged). Files already
identical on main are NOT re-uploaded: `captureLoop.js`,
`captureLoop.test.js`, `moveData.js`, `moveData.test.js`, both
follower specs, `ring-capture-zone-spec.md`. `FAN-MECHANICS-SUMMARY.md`
and `REPLACEMENTS.md` are deliberately NOT uploaded: main is AHEAD of
the lane copies there (correction addenda); overwriting would revert
them. Their stale test counts (55/31/8) still need a main-side
correction to 89 (40 + 15 + 16 + 7 + 11).

Demo note: `demo.js` reads the extracted catalog JSON directly
(`src/lib/generated/decomp_black2_moves.json` on a main checkout —
fourth catalog candidate, added in this pass; lane candidates still
first, so lane runs are unchanged), not `moveData.js` itself;
`moveData.js` is the compiled 560-move catalog the game imports.

### The BattleView patch (file, anchor, exact edit — NOT applied here)

File: `src/components/views/BattleView.tsx` (live main blob at landing
time: `16f0ecd93e82f421b0e5ccfd19410dd15c9375bd`, 23,520 bytes).
Anchors (live main line numbers):

- Import block, lines 1–15.
- `executeDamage(attacker, defender, moveId)`, line 121 (Status
  returns 0 damage at line 123).
- `onAttackImpact`, line 144 — applies `pendingRef` damage to HP.
- `onAttackDone`, line 159.
- Player move-choice branch, line 213 — computes
  `executeDamage(fusedAttacker || playerActive, enemy, moveId)`,
  then applies damage directly when the battle scene is OFF (line 215).

Exact edit, in order:

1. Add to the import block:
   `import { createArenaBattleFromParty, arenaModifiersFor } from
   '../../lib/arena-combat/arenaCombatIntegration';`
2. Create `src/lib/arena-combat/arenaCombatIntegration.ts` (new file,
   owed — not in the landing PR). It re-exports `createArenaBattle`,
   `computeModifiers`, `toArenaMove`, `buildChosenAttackTimeline`
   from `../../../sprite-art/arena-combat/arenaCombat.js`, and
   provides `createArenaBattleFromParty(playerActive, enemy)`
   (moves mapped through `toArenaMove` against the decomp catalog,
   falling back to the game's `MOVES_DB` shape),
   `arenaModifiersFor(battle)` (current spacing/flank/momentum at
   choice time), and `sidelineSlot(index, count)` (pure sideline
   geometry outside the 10 u arena circle, presentation only).
3. In the line-213 branch, before `executeDamage`: create (or reuse,
   per battle) the arena battle, call `chooseMove(i)` for the
   player's chosen move, read `arenaModifiersFor`, and pass the
   modified power/accuracy into the `executeDamage` path. The
   between-turn layer (`tick`) drives presentation between choices;
   it must never write HP — HP still changes only through
   `onAttackImpact`'s existing application of the resolved chosen
   attack.
4. Driven mode (`mode: 'driven'`, `setDriveInput`) is for the
   fight-as-creature view only; default BattleView stays
   `mode: 'ai'`. Do not change the default.

Why staged: `BattleView.tsx` is an active UI surface with in-flight
work in other lanes, and the local work clone is dirty on
`BattleView.tsx` (plus `App.tsx`, `gameStore.ts`), so no local build
could verify a UI edit from this lane. The patch author must
re-verify the anchor lines against main at patch time (they move as
other lanes land).

### Still owed (not in this PR)

- The `src/lib/arena-combat/arenaCombatIntegration.ts` adapter + the
  BattleView patch above.
- `ARENA-COMBAT-RESEARCH.md` §2 (Empress), §3 (synthesis), §4 (pull
  list): the lane copy is truncated mid-sentence at §1.6, so it was
  NOT uploaded; §0 corrections + §1 (Arena 2D) are the usable part.
- No Nintendo art/model/music files are in this module, ever.
