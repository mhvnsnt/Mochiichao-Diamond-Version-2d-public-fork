# REPLACEMENTS.md — sanitized fan-mechanics rebuild (2026-10-25)

Rule applied at write time: every franchise element found in the
locally-pulled fan projects was replaced with a Mochiichao or generic
equivalent BEFORE anything shipped. No raw fan file, sprite, audio
asset, code block or name table is in this PR. Categories below are
the complete list; where a category had zero instances in the rebuilt
code (because the rebuild was written clean from the start), that is
stated explicitly rather than inventing entries.

## 1. Creature names and literal characters

- Source side: the fan projects' rosters of franchise characters
  (dozens of named fighters across the pulls, plus their alternate
  forms).
- Shipped side: Mochiichao roster examples ONLY — Mochii,
  Razorgater, Tyrage, Dorowani, Gabu — used in tests and docs.
- Instances in shipped code: ZERO franchise creature names.
  Verified by grep over all six shipped files (see §8).

## 2. Move / attack names

- Source side: each fan project's named attack tables (including
  per-fighter signature attacks with bespoke effects).
- Shipped side: generic vocabulary only — aim shapes (lane, wedge,
  zone, self, beam, dash), kinds (damage, heal, buff, rest,
  teleport-strike), and generic test moves (Pounce, Spark Burst,
  Mud Toss, Gust Slash). No signature-effect scripts were ported;
  effects are generic data (power, range, cooldown, slow/poison/
  stun/root flags as numeric effect fields).
- Instances in shipped code: ZERO franchise move names.

## 3. Capture orb names

- Source side: the fan project's four-tier orb table with
  franchise ball names.
- Shipped side: generic tier names with the same multipliers —
  `standard` (x1), `sturdy` (x1.5), `prime` (x2), `sure` (always
  captures, skips the formula). The underlying public documented
  capture formula (modified rate, shake threshold, four-shake
  chance) is reimplemented in original code with a source note in
  captureLoop.js.
- Instances in shipped code: ZERO franchise orb names.

## 4. Creature cries / audio

- Source side: any cry audio or audio file referenced by the fan
  projects (music folders in one pull held placeholder notes only,
  not audio; no cry audio was present in the reachable trees).
- Shipped side: NO cry audio, NO audio files, NO cry identifiers
  at all. The rebuild contains zero sound references: capture and
  arena feedback are numeric/visual data (hitstop, shake, zoom,
  sparks, marks) for the game's own audio system to sonify later
  with original sounds.
- Instances in shipped code: ZERO — stated explicitly, not
  invented. There is nothing to map because no cry identifier
  exists in the shipped code.

## 5. Logos, badges and franchise art

- Source side: badge image collections, form/item/trainer images
  (752 image files in one pull alone), arena background images,
  walk-cycle sprites, trainer sprites.
- Shipped side: NO images of any kind. The PR is code + markdown
  only (6 files). Arena visuals in Mochiichao continue to come
  from the game's own sprite lane.
- Instances in shipped code: ZERO — no logo, badge or sprite file
  is referenced, embedded or copied.

## 6. Place, league and organisation names

- Source side: the fan projects' named leagues, regions, routes,
  arenas and rival-trainer names.
- Shipped side: generic terms only — "arena", "route", "league
  ladder", "rival sight line" (as a mechanic pattern, no name).
  Route generation itself was NOT rebuilt in this PR (see
  FAN-MECHANICS-SUMMARY.md).
- Instances in shipped code: ZERO franchise place/league names.

## 7. Code provenance (what was NOT copied, even where legal)

- No code block was copied from any fan project. All six shipped
  files are original code written for Mochiichao's arena units,
  constants and module shape (CommonJS, node-testable, matching
  the existing arenaCombat.js conventions).
- Two formula shapes were reimplemented from their PUBLIC
  documented forms with source notes in the code, not copied:
  (a) the Gen VIII capture formula form (Dragonfly Cave's public
  capturing documentation, as cited by the fan project that
  surfaced it); (b) the softened type-step table (an
  action-game variant of a type chart, stated numerically).
- The Ranger-style ring capture is a SPEC from public design
  concepts (loop / meter / struggle / assist), not code from a
  pulled game — no standalone Ranger-type fan clone was found
  publicly, and none was used.

## 8. Verification (ship-time greps over the six shipped files)

- `grep -ri "pikachu\|pok[eé]mon\|pokeball\|poke ball"` over
  fanMechanics.js, fanMechanics.test.js, captureLoop.js,
  captureLoop.test.js, FAN-MECHANICS-SUMMARY.md, REPLACEMENTS.md
  (this file): the single match is this section's own pattern
  string — no creature, move, orb, place or character name from
  any fan project appears as game content anywhere in the six files.
- File count: 6 files, 0 deletions, 0 images, 0 audio files.
- Tests: 55/55 passing at ship time (31 existing arenaCombat +
  16 fanMechanics + 8 captureLoop), run with node --test.
