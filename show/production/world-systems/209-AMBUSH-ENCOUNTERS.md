# #209 — AMBUSH ENCOUNTERS → the wild moves first

**Doctrine seat:** #7 founded the spawn tables — the
areas, slots, and provenance discipline every wild
encounter in the game draws from — and #10 founded
the battle flow the encounter lands in, including
`LIVING_FIELD`'s `tempo_state` (calm / tense / dread,
presentation only). Every encounter class so far
begins with the Ranger's step or the Ranger's choice.
An ambush begins with the **wild Mochi's** move: it
charges, and the battle starts on its terms. This
package specifies that initiation class over #7's
tables. It changes nothing about the battle that
follows — resolution is #17/#18's, the flow is #10's —
only about *who starts it* and how that start reads.

**What was studied.** Wild-initiated contact in the
publicly documented record: overworld creatures that
pursue and make contact (the modern open-area games'
signature pressure), ambush/back-attack openings in
turn-based battle systems, and this programme's own
precedent for table-level encounter classes — #158
founded horde composition as a *proposed table-level
slot, null everywhere*, and #209 follows that
precedent exactly rather than inventing a second
mechanism.

## Native spec — `mochiichao/ambush-encounters/v1` (fragment beside this doc)

- **Eligibility is table data (proposed into #7's
  home).** An `ambush` slot on the area's table —
  proposed as an edit in `SPAWN-TABLES.md` + the
  spawn-table schema, per the #158 `horde` precedent:
  absent / null = the area produces no ambushes,
  which is every table's state today. Where a table
  carries the slot, it names which of the table's own
  stocked species may initiate (a species not in the
  table can never ambush from it — roster-binding,
  #84's law in encounter form) and under what table
  conditions (time band, habitat class — the slot
  schema's existing fields, read not extended).
  Eligibility *contents* are authored data: zero
  rows are instanced here.
- **Initiation.** On contact, the encounter record
  is written with `initiation: "ambush"` (the record
  family #30/#37's encounters already keep — the
  initiation kind joins its vocabulary there, by
  citation, not by a parallel record). The battle
  itself is an ordinary wild battle: #18's wild
  class, #17's pipeline, #38's capture rules. An
  ambush grants the wild side **no mechanical edge**
  — no free hit, no stat change, no capture modifier.
  Its whole effect is presentational and positional:
  the Ranger did not choose this fight's start, and
  the game says so honestly instead of dressing a
  system advantage as surprise.
- **Presentation.** The field→battle cut uses #148's
  transition grammar for the area, and #10's flow
  opens with `LIVING_FIELD` tempo at **`tense`** —
  the startled register. `dread` is never an ambush
  tempo: dread is the Dark Forest's owned register,
  and an ambush is a startle, not a haunting. The
  wild individual's entrance cue is its charge (the
  animscript-class entrance #10's INTRO already
  seats), read from its #152 wild-view behaviour
  profile where one exists.
- **Exclusions (structural, not exception tables).**
  - **Sanctuary:** where the area's `encounterMode`
    is `sanctuary` (#110's field), ambush initiation
    does not fire — sanctuary means battles do not
    start uninvited there. The same holds under
    `safari` (#170's sibling value): a battle-free
    zone by construction cannot host a battle
    initiation.
  - **The depths:** the Dark Forest depths table is
    **empty** — verified at build from
    `dark-forest.spawn-tables.json` (the depths area
    carries 0 slots, status OPEN, canon does not
    stock the depths). Nothing can charge from a
    table that stocks nothing. The exclusion is
    arithmetic, not a special case, and it survives
    any future stocking decision only if that
    decision also rules on ambush — which would be
    a canon act, not this package's.

## Show lane

An ambush is native show grammar (the autonomous
doctrine: creatures act first, Rangers react) — a
wild charge that opens a scene needs no system
permission. Episode use cites the same eligibility
honesty: a creature that charges in the show is one
the place stocks (#84), and the Forest's depths do
not produce charges on screen either — the depths'
stillness is canon in both lanes (#148's law).

## Wiring

The `ambush` slot is proposed into #7's table spec +
schema (its home disposes); the initiation kind is
cited into the encounter-record vocabulary (#30/#37
homes); presentation reads #148 + #10 unchanged;
exclusions read #110/#170's `encounterMode` values
and #7's table contents — no exclusion list is
maintained here.

## Coverage — honest

- **Architecture: fully specified** over verified
  machinery (tables, flow, tempo, encounterMode).
- **Contents: none.** No table carries the slot; no
  species is named an ambusher; the Dark Forest
  surface table also currently carries 0 slots in
  data, so ambush — like every wild encounter class —
  instances nothing until canon stocks the tables.

## Open slots (nothing invented)

Every table's `ambush` eligibility rows and
conditions (authored data, per table) · per-species
charge entrance cues (#147's coverage ledger owns
the owed-animation accounting) · whether any area
should ever ambush during story beats (#12's facts
would gate it — the gate shape is the story lane's,
not asserted here).


**Landing note — List 27 #265 (2026-10-27):** this system's initiation read now also reads #152's `challengeStyle` (proposed by #265 into #152's annex and carried there): a `formal` species' initiation renders the wild-duel three beats (265-WILD-DUEL-ETIQUETTE.md). A staging switch, not new arithmetic — encounter tables and rates are untouched.
