
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
