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

## Correction 2026-10-25 (ring capture gating + arcade theme)

- The ring capture spec is now Mochiichao's own gated optional system (see captureLoop.js +
  ring-capture-zone-spec.md), NOT an ungated default path. Arcade elements are theme/setting
  only — no token economy, cabinet mini-games, or high-score mechanics. Zone name candidates
  (The Ringcade, Neon Loop Hall, Pixel Ring Hall) are proposals for Mars to pick, not locked names.

## CORRECTION (2026-10-25) — §2 genericization superseded: real move data restored

What was genericized (PR #35, §2 above): move/attack names were
replaced with generic vocabulary only — aim shapes (lane, wedge,
zone, self, beam, dash), kinds (damage, heal, buff, rest,
teleport-strike), and generic test moves (Pounce, Spark Burst,
Mud Toss, Gust Slash). That genericization is now WRONG and is
superseded by this correction. The generic test moves in
fanMechanics.js / fanMechanics.test.js were Mochiichao-original
fixture names, not franchise names, and are kept as fixtures only;
they are NOT the game's move data.

What real move data replaces it (this PR):
- NEW `sprite-art/arena-combat/moveData.js` — 560 real moves:
  name, type, category, power, accuracy, pp, priority, effect,
  copied field-for-field from the Black 2 decomp extraction
  already on main (`src/lib/generated/decomp_black2_moves.json`,
  560 moves; order identical by sourceConstant; category
  title-cased only). Accuracy 101 is kept verbatim as the source's
  never-miss marker (`neverMisses`), not rewritten to 100. Power 1
  is the source's fixed/variable-damage placeholder; the effect
  field states the real rule — it is not 1 point of damage.
- FireRed-era join, labelled and never mixed into Black 2 values:
  target / makesContact / effectChance from
  `src/lib/generated/decomp_firered_moves.json` (354 moves) for
  351 of the 560 moves; the other 209 moves have no FireRed row
  and carry null for all three fields. FireRed values never
  overwrite Black 2 fields (e.g. Tackle 35 power / 95 accuracy in
  FireRed vs 50 / 100 in Black 2; Protect priority 3 vs 4).
- Per-move animation data: aim shape + motion + impact flavour
  from the fanMechanics.js shape vocabulary (lane 325, melee 107,
  self 81, zone 20, beam 19, dash 6, wedge 2), mapped to the 12
  True Elements where a mapping exists (525 mapped; ICE 20 +
  ROCK 15 = 35 moves keep their own element name with
  `elementMappedToTrue: false` — nothing invented to force them
  in). Timing is the treatments timeline on every move: windup
  250 ms, strike (impact hold) 90 ms, follow-through 700 ms
  (recoil 300 + recover 400), total 1040 ms; at 60 fps:
  startup 15 / active 5 / recovery 42 / total 62 frames.
  Cooldown/PP economy: pp verbatim; arenaUses =
  max(5, round(pp x 1.5)) x 2; status moves carry the
  fanMechanics.js realtime constants (cooldownMs 8000,
  energyCost 50); damage moves carry 0/0 because no per-damage-
  move realtime cooldown or energy cost is defined — none invented.
- Two real bugs in the pre-existing draft, fixed in this PR:
  (a) `fanMechanics.js movePickScore` reads `reachU` (defaulting
  to 99 when absent); the draft carried only `rangeU`, so real
  moves would have scored as infinite-reach. Every entry now
  carries `reachU` = `rangeU`. (b) `AIM_SHAPES` omitted `melee`
  although 107 moves use it; `melee` is now in the list.
- NEW `sprite-art/arena-combat/moveData.test.js` — 11 tests
  (count, lookups, verbatim spot checks, shape/range/reach
  consistency, timing/frames, arenaUses formula, element
  mapping, FireRed join counts, movePickScore reach behaviour,
  kind vocabulary). Full arena suite at ship time: 82 pass,
  1 skipped, 0 fail (was 71 pass + 1 skipped before this batch).

Standing rule restated (Mars, 2026-10-25 ~19:44 CDT): moves and
animations are NOT replaced — you cannot copyright moves or
animations. The ONLY exclusions are Pokemon creature NAMES,
Pokemon SOUNDS, Pokemon ART, and Pokemon DIALOGUE. EVERYTHING
ELSE comes in 100%. This correction applies that rule: real move
names and mechanics are in scope (move names are not creature
names), and the four exclusions stay out — verified below.

Correction verification (ship-time, new files + this file):
- Creature names: 0/560 move names equal any Black 2 species
  name, and 0 whole-word collisions, checked against
  `decomp_black2_species.json` (650 named species entries).
  No species name occurs as a standalone word in the new files.
- Sounds: no audio files, no cry identifiers, no sound
  references in the new files (feedback is numeric/visual data
  only, as in PR #35 §4).
- Art: no images of any kind in this PR (code + markdown only).
- Dialogue: no dialogue strings in the new files.
- Old → new in this PR: `REPLACEMENTS.md` gains this section
  only (no earlier section rewritten); `moveData.js` and
  `moveData.test.js` are new paths; no other file is touched
  and no file is deleted.
