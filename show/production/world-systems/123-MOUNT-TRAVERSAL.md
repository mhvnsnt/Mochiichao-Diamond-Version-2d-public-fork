# #123 — RIDE / MOUNT SYSTEMS → mount & traversal system

**What was studied.** Mount and ride systems across the
publicly documented record, in two eras: the move-gated era
(traversal unlocked by a technique a party member performs)
and the ride era (traversal as a *capability of the species*
— dedicated ride partners whose bodies do the work: run,
swim, climb, fly). The documented shift between them is the
finding: the genre moved traversal from the move list to
the anatomy. Mochiichao's doctrine was already there. The
kit taken: eligibility is a property of the body, speed and
terrain are classes, and the rider's partner is a specific
individual, not a menu. No ride lists, maps, or speed values
are copied.

## Canon anchors (verified)

- **Anatomy-variance doctrine** (standing): what a body can
  do follows its shape/size/class. A traversal system that
  keying eligibility to a *move* would contradict the
  doctrine; keying it to anatomy *is* the doctrine.
- **#43 SCALE-CHART-SYSTEM** records every species' size
  class — **Palm / Knee / Waist / Tower** — in cast data.
  That ladder is this system's substrate: a Palm-class
  partner cannot be ridden, whatever its species.
- **#117 field techniques are the neighbouring layer, and
  the two must not merge:** a technique gate (#11) tests a
  Rare Move performed by a party member; a mount is a body
  the Ranger rides. A gate may require both in sequence —
  the records stay separate, so the show lane (techniques
  innate, mounts as staged partnership) can read each
  correctly.
- **#58 GARDEN-FOLLOWER-SYSTEM** owns the partner's
  out-of-ball presence: a five-state machine (FOLLOW /
  CATCHUP / IDLE / REACT / PARKED), the follower being the
  PRINCIPAL individual under roster-binding.

## Native spec — `mochiichao/traversal/v1`

- **Eligibility is derived, never listed per species by
  hand-waving:** an individual is ride-eligible iff
  (a) its species' size class (#43) is Waist or Tower, and
  (b) its recorded anatomy (the species sheet's anatomy
  fields — the same apparatus the design lane's sheets
  carry) supports a rider for its locomotion class.
  Locomotion classes are read from the species data's own
  vocabulary (quadruped / swimmer / flyer classes as the
  sheets record them); **this spec asserts no species'
  eligibility** — the per-species results are a derivation
  pass over data the design lane owns, registered as a
  work item in STAGING.md, not filled in here.
- **Terrain classes** join the world systems' vocabulary:
  traversal modes are keyed to the area kinds the spawn
  system already uses (#7 tables are per-area; water areas
  are where the `fish` method lives, per #111). A mount's
  terrain affordances are `{land}` by default shape, with
  `water` / `air` affordances present only where the
  anatomy derivation yields them. Traversal changes how
  the Ranger *moves through* an area; it never changes
  what the area *stocks* — encounter tables roll as #7/#52
  rule, mounted or not (whether mounted travel alters
  encounter *rates* is an OPEN design question, flagged,
  not defaulted).
- **Speed classes** are relative and closed at the shape
  level — `field` (on foot) vs `mounted` gaits — with all
  numeric speeds OPEN. The world clock (#19) is the only
  time authority: traversal consumes phases as the clock
  rules, and no speed value in this system may be stated
  as a clock fact.
- **The ridden state and #58:** riding is a follower state
  the current vocabulary does not have. This spec
  **proposes** `RIDDEN` as a sixth state in #58's machine
  (the follower is the mount; FOLLOW/CATCHUP do not run;
  REACT cues become traversal reactions) — and flags it as
  a **vocabulary extension owned by #58's package**, to be
  accepted there or not at all. It is not taken here by
  fiat (registered in STAGING.md).
- **The Dark Forest:** mounting in the Forest — and above
  all in its unstocked depths — is canon-sensitive ground
  (the Forest's dread grammar is built on stillness and
  foot-pace, #19/#21). **No Forest traversal rule is
  asserted**; whether mounts enter, and what the Forest
  does to mounted pace, is an owner ruling, OPEN.

## Wiring

Derives from #43 (size classes) + species-sheet anatomy;
joins #7/#52 (areas and encounter law, unchanged), #19
(clock), #58 (follower states — extension proposed, not
taken), #117/#11 (technique gates stay a separate layer),
#106 (the mount is a roster individual with a `location`;
a stored individual cannot be mounted until present —
read from the same field, no copy). Save impact: none new.

## Coverage — honest

- **Architecture: fully documented**, both eras; the
  anatomy-keyed form is the documented modern pattern and
  the house doctrine independently.
- **Contents: zero eligibility results, zero speeds, the
  encounter-rate question, the #58 extension, and the
  Forest ruling are all OPEN.** The derivation rule is the
  yield; applying it is a data pass over sheets this
  package does not own.

**Annex (List 20 #192, landing 2026-10-27):** water traversal and dive modes annex into THIS traversal format (192-WATER-TRAVERSAL-AND-DIVE.md) — there is no second traversal format. The `dive` gate kind is proposed to the #11 edge / #59 lock vocabularies in their owners' files, and the `dive` method is proposed into #7's spawn schema at this landing. Zero dive points, dive areas, and water routes are instanced; #66's isle contents are untouched.
