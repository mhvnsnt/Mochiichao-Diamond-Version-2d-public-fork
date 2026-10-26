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
  ring capture GATED behind (arcade ring zone visited + played) AND
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

- Ring capture zone exact name: NOT chosen. Candidates are staged in
  `ring-capture-zone-spec.md` §2 for Mars to pick (none locked, none used
  in code). Code and docs refer to it only as the arcade ring zone (name TBD).
- Scope (Mars 2026-10-25 ~19:44): moves and animations are real, not
  genericized. The ONLY exclusions are Pokemon creature names, sounds, art,
  and dialogue. REPLACEMENTS.md's old move genericization is superseded by
  the real move data in `moveData.js`.
