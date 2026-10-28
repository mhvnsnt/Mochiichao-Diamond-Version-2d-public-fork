# #94 — PROCEDURAL PARTY GENERATION → facility party generator spec

**What was studied.** Battle-facility party builders in the public
record (the Battle Factory/Tower family): parties are not authored
per opponent — they are *drawn* from a species/move pool by a
generator with constraints: a pool tier keyed to round depth,
banned-list exclusions, no duplicate species, move sets sampled
from the species' legal pool, and a difficulty curve expressed as
*which pool tier you draw from*, never as stat edits to drawn
creatures. The opponent's identity is a wrapper; the party is a
sample.

**Pairs with List 9 #86** (facility formats/rules — rounds,
streaks, facility structure). #86 is the building; this is the
machine inside it that decides who you fight.

**Native spec — generator contract:**

```
generate { facility_id, round, seed } ->
party { members[] { species_id, level_band, moves[4], variant } }
```

- **Pool tiers.** `pool_tier(round)` is data: a table mapping
  round bands to species-pool ids + level bands. Tier contents
  draw only from species with complete data sheets (the design
  lane's apparatus) — a species without a coded learnset cannot
  enter a pool; the generator treats missing data as absence,
  never as a prompt to invent a move set.
- **Move sampling.** From the species' own learnset (game data
  core), sampled under facility constraints (no duplicates within
  a set; signature-move inclusion is a *pool rule*, not a
  guarantee — authored Rangers guarantee signatures, generated
  parties only sample). Move display names resolve through the
  rename law at presentation; the generator works in ids.
- **Constraints (hard, in order):** banned list (facility data) →
  no duplicate species per party → anatomy sanity (a move is only
  sampleable if the species' performance block can anchor it —
  the animscript anchor vocabulary, battle-presentation #9, is
  the check) → variant roll (lustre check per #92 odds, using the
  facility's own odds scope if set, else none).
- **Seeded, reproducible.** Same seed + round + facility =
  same party. Facilities are testable and a disputed streak is
  replayable; the seed derives from the streak record (#86), not
  from wall-clock randomness.
- **The boundary:** generated parties belong to *facilities and
  nobody else*. Named Rangers — Hex, dojo masters, rivals — have
  authored parties (#87 rematches reference them; #37 rival
  construction authors them). A generator that can produce the
  Champion's team is a bug in this spec's terms.

**Canon state, honestly.** No battle facility is canon yet
(#86's formats are likewise format-first). Pool contents, tier
breakpoints, and banned lists are all OPEN — they depend on a
facility existing. The generator contract is complete without
them.

**Wiring.** Inputs: species core data + learnsets (repo game
data), #92 odds, #9 animscript anchors. Outputs feed #86 facility
rounds and #87's `repeat_rung` *only if* a rematch is ever
facility-hosted (flagged: organic Ranger rematches stay
authored). Show lane: none — facilities are game systems; a show
facility visit uses authored parties per script (two-lane law).

**Coverage.** Generator architecture: fully documented publicly
(pool/tier/constraint sampling is the known facility pattern).
Contents: zero canon — contract + constraint order are the yield.
