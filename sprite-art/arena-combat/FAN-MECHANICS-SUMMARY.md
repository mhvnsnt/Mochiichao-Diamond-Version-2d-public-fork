# FAN MECHANICS — sanitized rebuild summary (Mochiichao arena-combat)

Date: 2026-10-25. Status: SHIPPED via PR (see REPLACEMENTS.md in the
same folder). This document describes Mochiichao's own original code
only. It does not reproduce any fan project's code, art, music,
names or characters. Full per-project extraction notes stay local
under `fan-reference/` (never pushed) in MECHANICS-EXTRACT.md.

## What shipped (this folder)

- `fanMechanics.js` — arena mechanics layer, no DOM, no game
  imports, deterministic except caller-injected rng:
  - Dash pool: 3 charges, one back every 3 s, 2.5 u travel over
    170 ms, 200 ms invulnerability. Sparring dodges use the same
    pool and are position-only (never HP).
  - Energy pool: 100 max, 12/s regen; status moves cost 50 with an
    8 s cooldown and 2 s movement lock per stage raised.
  - Move-use cap: uses = max(5, round(baseUses x 1.5)) x 2.
  - Speed compression: speed stat 30–143 maps to 1.6–2.3 u/s.
  - Knockback decay exp(-7 x dt); circular-body separation so
    fighters never overlap (except dash-through / buried /
    airborne, which the caller flags).
  - Aim shapes (lane / wedge / zone / self / beam / dash), aim
    angle, turn-rate-clamped homing, projectile reach = speed x
    life, dash reach = dash distance + both radii.
  - AI movement: preferred-range spacing, timed strafe (1–2.6 s),
    lateral threat dodges, obstacle repulsion, centre pull near
    walls; AI aim error ±0.15 rad re-rolled every 500–1000 ms.
  - Move scoring with reach falloff (melee out of reach 0.05x,
    projectile beyond reach 0.25x, dash beyond reach 0.15x,
    zone beyond max 0.1x), heal/buff/rest/teleport-strike rules,
    second-charge 3x bonus; matchup switch scoring (own offence
    − 0.85 x foe offence + 0.4 x own HP fraction), switch margin 1.0.
  - Softened type steps: immune 0.33, double resist 0.5, resist
    0.75, neutral 1, super 1.33, double weak 1.66, same-type 1.25.
  - Hit feedback: hitstop 20 ms + damage scaling, capped 90 ms;
    shake/zoom bands; ground marks (scorch 2.5 s, frost 3 s,
    crack 4 s, visual only); delayed ground zones that fire once
    for chosen-attack resolution only.
  - Switch cooldown 4 s + 0.8 s entry invulnerability; extra
    invulnerability windows (orb hit 0.8 s, knockdown 1.2 s,
    item use 1.5 s); sudden-death ramp after 180 s (+1 per 40 s).
  - Perfect Dodge, two forms kept apart: sparring dodge (visual
    only) and chosen Dodge action (costs the turn; a dodge landing
    within 150 ms before the telegraph end is perfect and negates
    the incoming chosen attack's damage).
- `captureLoop.js` — two capture paths, generic vocabulary only:
  - Ring capture (Ranger-style spec from public design concepts):
    draw a loop (min path 6 u, closure within 0.8 u of start);
    each completed loop +25 meter (x1.5 with a matching-affinity
    ally assist); meter decays 5/s; creature struggle drains 12
    and breaks the in-progress ring; full meter (100) captures.
  - Orb-throw capture (public documented Gen VIII formula form,
    source noted in the file): modified rate X from HP fraction,
    species rate, orb multiplier (standard x1, sturdy x1.5,
    prime x2, sure always) and low-level bonus ((30 − level)/10
    below level 21); shake threshold floor(65536/(255/X)^(3/16));
    total chance (Y/65536)^4; 4 shakes to capture.
- `fanMechanics.test.js` (16 tests) + `captureLoop.test.js`
  (8 tests), node-testable, injected rng. Together with the
  existing `arenaCombat.test.js` (31 tests) the folder suite is
  55 tests, all passing at ship time.
- `REPLACEMENTS.md` — every replaced element category, what it
  became, and which categories had zero instances in the rebuild.

## Turn-based law (unchanged, from ARENA-COMBAT-SPEC.md §1)

Between-turn play (sparring, dodging, circling, ground marks,
zones shown between turns) NEVER moves HP, inflicts a status, or
faints a creature. Only a chosen attack — or a spent chosen Dodge
action negating one — touches damage. The new modules enforce this
by construction: sparring paths carry hpDelta 0 and visualOnly
flags, and zone effects fire only through chosen-attack resolution.

## What was deliberately NOT rebuilt here

- Seeded route generation + tall-grass encounter tables (pattern
  documented in the local extract; the route builder belongs to a
  world/route PR, not this arena PR).
- League-ladder / draft / certificate structure (documented in the
  local extract; the game's own progression wiring owns it).
- The iOS porting shell, its build workflow and its name tables
  (packaging only; Mochiichao is already a web game).
- Any art, music, sprite, logo, character, cry audio, or
  franchise-named table from any pull. Zero such files are in
  this PR (see REPLACEMENTS.md).

## Roster examples used in tests/docs

Mochii, Razorgater, Tyrage, Dorowani, Gabu only. No other
creature names appear in the shipped code.

## Correction 2026-10-25 (ring capture gating + arcade theme, supersedes §captureLoop above)

- Ring capture is NOT removed and NOT the default: it is an OPTIONAL system gated on
  (zone visited + played) AND (ring-capture items owned); without both, only normal
  orb-throw capture (Luigi Cubes) is offered. See captureLoop.js gate + ring-capture-zone-spec.md.
- The ring zone is a NEW, SEPARATE zone — NOT the Harbor City Safari/preserve — with a
  retro-arcade THEME (cabinets, neon, retro scenery as setting only). Its name is NOT locked;
  ring-capture-zone-spec.md proposes candidates (The Ringcade, Neon Loop Hall, Pixel Ring Hall)
  for Mars to pick. No token economy, cabinet mini-games, or high-score mechanics are included.
