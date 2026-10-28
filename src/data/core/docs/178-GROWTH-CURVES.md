# #178 — GROWTH CURVES & LEVEL THRESHOLDS → level as a derived fact

**Doctrine seat:** two earlier packages left this exact
door open. #52 §2.3 founded the player-side curve
registry *as format only* — curve ids `swift | steady |
deep` (a native, OPEN set), a species sheet field
`growth_curve: <id | TBD>`, and the ruling that curve
*shapes* are an owner decision. And #126 deliberately
wrote **no level field** into the Hall of Fame snapshot,
because "no level field this package can cite" existed
in the audited canon data — growth-at-clear was left
OPEN "pending the level ruling." This package is that
ruling: it defines where level lives, completes #52's
registry with threshold tables as data, and feeds
level-up events into #129's flow. It asserts no
threshold value and assigns no species a curve.

**What was studied.** Growth systems in the publicly
documented record: a species belongs to one growth
curve family; the curve is a table (or formula) of
cumulative experience required per level; an
individual's level is read off its accumulated total —
the total is the stored fact, the level is what the
table says it means. Level caps exist as data. On
level-up, pending consequences (move offers, growth
events) fire per level crossed, in order. The kit
taken: level as a table lookup over a stored total,
per-species curve membership, and ordered per-level
events.

## Native spec — `mochiichao/growth/v1` (fragment beside this doc)

- **Where level lives: nowhere — it is derived.** For
  a kept individual, `level = 1 + (number of the
  species' curve thresholds its accumulated gain total
  has reached)`, the total being #177's derived sum
  over gain-event facts. No level field is added to
  the individual record; every consumer (battle stats
  via #17's `base(level, …)` term, #129's offers,
  #86's normalisation, displays) reads the derivation.
  This is the #14/#96 discipline applied to growth:
  facts stored, meanings derived.
- **The threshold tables (data, shipped empty).** One
  table per curve id in #52's registry: the cumulative
  gain totals at which levels 2, 3, … are reached.
  The tables ship with the three founded ids and
  **every cell null** — the curve shapes are the owner
  decision #52 reserved. The level cap is the table's
  length + 1: a data fact of the table, not a constant
  this spec names. (The documented pattern's familiar
  cap is deliberately not imported as a default.)
- **Curve membership is species data.** The sheet
  field #52 founded, `growth_curve`, carries `TBD`
  across the roster today; assignments are species-data
  work in the data lane. Until a species carries a
  curve id, its individuals' level derivation is
  undefined — and undefined means *unlevelled in data*,
  never silently `steady`.
- **Level-up events.** When a #177 gain event moves an
  individual's derived level, one level-up event per
  level crossed fires, lowest first, into #129's flow
  — #129's state machine runs per event (offer →
  space check → decision → record) against the
  learnset rows keyed to that level (the core data's
  level-keyed rows, per #129's own reading). Multiple
  crossings from one battle resolve sequentially;
  #129's flow is unchanged in every particular.
- **The #126 join (proposed into #126's home).** The
  Hall of Fame snapshot row gains `levelAtClear`: the
  derived level evaluated at the clear, **copied as a
  fact** — exactly #126's discipline (snapshots copy
  facts; the past must not re-derive against future
  tables). The field was left open pending this
  ruling; the proposal lands in #126's file at
  landing, with this package cited — it is not written
  here.
- **The two level notions, kept apart.** Encounter
  levels are *facts* #52 emits — authored bands for the
  wild, authored rows for set-pieces (B1/B2). Kept
  individuals' levels are *derivations* over gain.
  They meet at exactly one point: #177's yield reads
  an opponent's level as a fact. No opponent carries a
  gain total; no kept individual's level is ever
  authored. (#70's Dial A bands key off progression
  flags, never off this derivation — the world does
  not read the player's level, here either.)
- **Hatching.** A hatched individual (#77/#135) has
  zero gain events; its derived level is 1 by the
  formula. Nothing is written at hatch.

## Show lane

None. The show has no levels (#129); growth on screen
is story and #42's growth sequences, which are
evolution staging, never level staging.

## Wiring

Completes #52 §2.3's registry (same home — the tables
sit beside the registry, not in a new store); reads
#177's derived totals; fires into #129; proposes
`levelAtClear` into #126; consumed by #17's level
term, #86 normalisation, #43 scale displays where
level is shown.

## Coverage — honest

- **Architecture: fully documented** (curve families,
  cumulative thresholds, derived level are the standard
  published pattern; #52 had already founded the
  registry shape natively).
- **Contents: empty tables, by the owner's reservation.**
  Every threshold value, the curve set beyond the
  three founded ids, and every species' curve
  assignment are OPEN. The yield is the definition of
  level itself — the fact #126 waited for and #17's
  level term presupposes.
