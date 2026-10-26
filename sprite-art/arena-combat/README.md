# ARENA COMBAT — module README

Deterministic turn-based arena combat controller for Mochiichao.
Spec: `ARENA-COMBAT-SPEC.md` (same directory, § references below).
Research: `ARENA-COMBAT-RESEARCH.md`, `BATTLE-ANIMATION-RESEARCH.md`,
`animation/treatments/battleTreatments.js`.

## Balance law (spec §1 — read first)

ONLY chosen attacks deal real HP damage. Between-turn sparring NEVER
decides HP: clashes show contact, sparks and knockback-without-damage
only — no HP bar moves, no damage number, no status, no faint. The
only way between-turn play touches damage is the capped positioning
modifiers on the NEXT chosen attack (spec §3.3/§3.4: power capped
+15%, accuracy +10/−5 clamped 5–100%, crit NEVER modified, no
modifiers on healing/switch/items/run).

## Files

- `arenaCombat.js` — the controller. No game imports, no DOM, no
  `Math.random` in the sampled path (seeded PRNG only, so seeded
  battles replay exactly).
- `arenaCombat.test.js` — 40 tests (HP invariant, modifier math and
  caps, clash limits, turn-clock fallback, faint skips return, chosen
  attack uninterruptable, real-move mapping, driven mode).
- `demo.js` — scripted Mochii vs Razorgater scenario (spec §7, plus a
  second turn and a driven-mode epilogue). Console frame log.
- `arenaCombatIntegration.ts` + `arenaCombat.d.ts` (in the game repo
  under `src/lib/arena-combat/`) — the wiring adapter; see
  `INTEGRATION.md` there for the BattleView patch.

## Run

```sh
node --test arenaCombat.test.js   # 40 tests, must all pass
node demo.js                      # scripted battle, deterministic (seed 20261025)
```

The demo loads real move data from the repo's extracted decomp file
`src/lib/generated/decomp_black2_moves.json` (lane path first, then
the in-repo path) and aborts with a clear message if it is absent.

## SCOPE — final and standing (Mars, 2026-10-25 ~19:44 CDT)

Moves and animations are NOT replaced (you cannot copyright moves or
animations). The ONLY exclusions are:

1. Pokemon creature NAMES,
2. Pokemon SOUNDS,
3. Pokemon ART,
4. Pokemon DIALOGUE.

EVERYTHING ELSE comes in 100%: all moves, all animations, all fire,
all attacks, all motions, all environment stuff — wired into the
arena combat system with real data.

What this changed, concretely (nothing here was left genericized):

- The demo previously used a hand-written Tackle (power 40). It now
  uses REAL Black 2 data via `toArenaMove`: Tackle — Normal/Physical,
  power 50, accuracy 100, `MOVE_TACKLE`, effect `BATTLE_EFFECT_HIT`;
  Ember — Fire/Special, power 40, accuracy 100, `MOVE_EMBER`, effect
  `BATTLE_EFFECT_BURN_HIT`; Bite (foe) — same treatment. Source:
  `src/lib/generated/decomp_black2_moves.json` (source
  `pokebw2/res/moves/*/data.json`, 560 moves, already on main).
- The module gained `toArenaMove(decompEntry)`: Physical → `melee`
  (travel staging), Special → `projectile` (cast staging), Status →
  `status` (new non-damage kind: zero modifiers, resolved via
  `resolveNonDamageAction`; the game applies stat changes, the
  controller never invents them). Decomp accuracy 0 ("never misses")
  normalizes to 100 with `decompAccuracy` preserved, so the 5–100
  clamp never turns a never-miss move into a 5% move.
- Animation timing/motion data was already real, not genericized, and
  stays so: treatment beats 250/90/300/400 ms, hitstop 90 ms, clash
  beats 150/250/300 ms, camera tilts 4°/6°/8° — all from the research
  and `battleTreatments.js`, referenced by the arena timelines, never
  re-invented as second numbers.
- The spec §7 demo text ("Mochii's attack") is unchanged as prose;
  the DEMO now names the real moves above, and turn 2 adds a real
  fire attack (Ember) with projectile/CAST staging.

## Ring capture — design addendum (Mars ~19:45, refined ~19:49, zone ~19:51, theme ~19:54)

Read in order; the latest correction wins where they differ.

- **Default capture is normal Pokemon-style (Luigi Cubes).** That is
  a separate system, NOT this module. Ring capture is NEVER the
  default and is NEVER wired into arena combat turn resolution. This
  module contains NO capture code at all.
- **Ring capture returns as an OPTIONAL, gated subsystem.** It is
  introduced by a NEW zone, played there first, and then usable
  anywhere — only after BOTH gates pass (below). The zone and the
  shop items are separate work, NOT built here; this section
  documents the flags, unlock flow and gate checks the arena/overworld
  code must call.
- **The zone is NOT the Safari zone.** Mochiichao already has a
  Safari-type area in canon (Harbor City preserve / safari area,
  five-region canon, Dojo 6 / Wave-Ride beat). The ring zone is a
  DIFFERENT, NEW zone.
- **Zone theme (19:54 correction): arcade as THEME, not mechanic.**
  The zone IS like walking into a game arcade full of retro games —
  cabinets, neon, retro-game scenery/vibe as the setting — but it is
  NOT called "Arcade Zone". The ring capture MECHANIC itself stays
  ring capture, remade as Mochiichao's own proprietary thing, played
  inside that retro-arcade-themed zone. (This supersedes any
  "arcade-style ring mechanics / tokens / cabinets-as-mechanics"
  reading: arcade = setting and name direction, not the mechanic.)
- **Zone name: The Ringcade (LOCKED 2026-10-25 ~21:18 CDT, Mars decision).**
  Direction-locked (ring + arcade blend); see ring-capture-zone-spec.md §2.
  Code and docs refer to the zone as The Ringcade from here on.
- **Unlock flow (the flags):**
  1. Player visits The Ringcade and plays its
     ring-capture introduction → sets flag `ringCaptureUnlocked`.
  2. Shops then sell ring-capture items → player buys them →
     `ringItemsOwned > 0` (consumable items; one spent per ring
     attempt — exact item economics belong to the shop/capture
     system, not to arena combat).
  3. Only then is ring capture offered as an option alongside the
     default Luigi Cube capture.
- **Gate check (BOTH conditions, no exceptions):**

  | `ringCaptureUnlocked` | `ringItemsOwned > 0` | Ring-capture attempt |
  |---|---|---|
  | true | true | ALLOWED (consumes one ring item) |
  | true | false | REFUSED — fall back to Luigi Cube capture |
  | false | true | REFUSED — fall back to Luigi Cube capture |
  | false | false | REFUSED — fall back to Luigi Cube capture |

  A ring attempt without BOTH must fall back to (or be refused in
  favour of) the default Luigi Cube capture. It must NEVER silently
  succeed as a ring capture, and it must never silently become the
  default. The gate lives in the capture/overworld code, not in
  `arenaCombat.js` — arena turn resolution never calls it.
- **Relation to PR #35's `captureLoop.js`:** that file is another
  lane's work, not this module's, and this lane does not edit it. Per
  the ~19:49 refinement its ring track is NOT deleted and NOT marked
  unused: it is the future gated optional subsystem's reference,
  to be gated (zone unlock + item ownership) when its owner wires
  it — never as a default, never inside arena resolution.
- **Verification (what was removed):** nothing. A grep of this
  module, its tests, its demo and the spec for a ring-capture loop
  finds ZERO references (the only matches are the substring in
  "during"). There was no ring-capture loop here to remove; the
  exclusion above is recorded so none is added later by accident.

## Fight-as-creature mode (Mars ~19:45)

`createArenaBattle({ ..., mode: 'driven' })` (default mode is `'ai'`).
In driven mode the PLAYER drives the player's creature between turns
with `setDriveInput({ x, y })` — a held direction vector, normalized
when its magnitude exceeds 1, held until set again — while the foe
stays AI-driven. Rules that do NOT change in driven mode: the
turn-based core (only chosen attacks deal real HP damage), the
positioning modifiers and caps, the 30 s turn clock and fallback,
the clash limits (driving into contact spars visually, zero HP),
and the interrupt rule (choosing freezes all motion). Differences,
all explicit: the player's between-turn behaviour label is `DRIVEN`
(not a new state-machine substate — the six spec substates are
unchanged); auto-separation after the 6th clash still overrides
drive input; static creatures ignore drive input (they never
translate); facing still tracks the foe, so flank math stays
spec-true. `setDriveInput` in `ai` mode throws; an unknown mode
throws at creation.

## Followers — integration note, not a system (Mars ~19:45)

What Mars wanted from Ranger-type material is the way creatures walk
around WITH you. This module does not manage followers (no follower
state, no follower code), and the game should not look for any here.
Wiring points, for the game side:

- Overworld: party creatures render as followers alongside the player
  (WorldEngine concern — follower offsets and walk cycles live there,
  reusing the locked idle/walk art, not this controller).
- Arena sidelines: non-active party members stand at sideline slots
  outside the 10 u arena circle. The integration adapter provides
  `sidelineSlot(index, count)` — pure sideline geometry, presentation
  only — so the game can place them from the party list plus the
  arena pose midpoint.
- When a follower becomes the active creature it enters the battle as
  an ordinary creature def (`player`/`foe`); nothing about the arena
  state machine treats it specially.

## API summary

- `createArenaBattle({ player, foe, seed?, reduceMotion?, mode? })`
  → battle object: `start()`, `tick(dtMs)`, `chooseMove(i)`,
  `resolveAttack({ damage | damagePerHit, isCrit?, hit? })`,
  `resolveNonDamageAction({ heal? })`, `skipToResolution()`,
  `finishResolution()`, `setDriveInput(vec)` (driven only),
  `sampleArenaPose()`, `sampleClashPose(clash?, elapsedMs?)`,
  `mapArenaPoseTo3D(pose2d)`, `snapshot()`, plus demo/test hooks
  `setPositions` / `setFacing` / `setBehaviour`.
- `computeModifiers({ spacing, bankedFlankArc, momentum, kind,
  baseAccuracy, critChance })` — pure, capped per spec §3.4.
- `toArenaMove(decompEntry)` — real decomp move → arena move def.
- `buildChosenAttackTimeline(move, modifiers)` — spec §2.1 phases +
  treatment beats 250/90/300/400.
- `ARENA` — every constant (radius 10 u, neutral 6 u, min separation
  1.2 u, clash range 1.8 u, clock 30 s / prompt 20 s, clash floor
  1.2 s / 0.9 s under pressure, max 6 clashes, momentum +8 / +15,
  decay −5/s after 10 s, power cap +15%, accuracy +10/−5 clamp
  5–100%, camera tilts 4°/6°/8°).
