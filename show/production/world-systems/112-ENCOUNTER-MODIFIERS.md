# #112 — REPEL / LURE SYSTEMS → encounter modifier class

**What was studied.** The encounter-modifier architecture of
the reference games, as publicly documented: a family of
field items (and, in later systems, ability side-effects)
that do not change any encounter table but change **the roll
made against it** — repels suppress encounters (classically,
those below a level threshold tied to the party's lead), lures
and incenses raise the relative chance of chosen slots, and
the modifier is a timed/consumable state with a step or
duration budget. The architectural kit: **modifiers are a
transform layer between the table and the roll.** The table
is authored truth; the modifier is a player's temporary lens
on it.

## Native format — items, in the item layer, nothing new

A modifier is an ordinary record in the **#31 item layer**
(`list4-systems/schemas/item.schema.json`, verified: closed
category vocabulary, structured `effect {system, op, params}`,
`useContext`, schema-enforced additional-properties ban).
It uses only values #31 already defines:

```
item {
  category: "consumable",
  effect: { system: "field",
            op: "spawn.repel" | "spawn.lure",
            params: { ...per op, below... } },
  useContext: { field: true, battle: false, held: false }
}
```

- `spawn.repel` params: `{ mode: "level-floor", floor: null,
  budget: null }` — while active, slots whose rolled level
  band falls entirely below `floor` are removed from the pick
  **for that roll**. `floor` and `budget` (steps/duration)
  ship null: values are balance content, OPEN.
- `spawn.lure` params: `{ match: { speciesId | habitatClass |
  typeId }, weightFactor: null }` — matching slots' weights
  are multiplied at roll time. `weightFactor` null = unvalued,
  OPEN.
- **The transform is roll-time only.** Exactly as #113's
  overlays: no modifier ever writes to a spawn table file.
  Removing a modifier system from the game leaves every table
  byte-identical — the check that proves the layering.
- **The General/Rare distinction is untouched, by schema.**
  #31 check 3 already makes it mechanical: the item schema
  forbids additional properties, so no item record *can* carry
  a move-class field; and a modifier's `effect` calls the spawn
  system, never the move registry. A "modifier" that taught or
  altered a move would not be this class — it would violate
  two standing laws at once (items-are-not-moves, #31; the
  machine registry's own classes, PR #366).

## The shared interface with #107

Field-effecting **abilities** (#107) that influence encounters
speak this same op language (`spawn.*` transforms against the
#7 roll). One transform implementation serves items and
abilities; the difference is only the source record (a
consumable state vs a present individual's slot). Neither
source gets a private dialect.

## ⚠ Interface tension with #52 — flagged, not resolved

#52 (encounter balance) states its law plainly: **wild area
bands never read party state.** The reference repel, however,
classically keys its floor to the party lead's level — a party
read. Both cannot hold in their strongest forms. This package
does **not** pick a winner; it records the two honest shapes
and leaves the ruling to the owner (STAGING.md carries it as
an owner-decision slot):

- **Shape A (reference-true):** `floor` is relative — set from
  the lead individual's level when the item is used. Reads
  party state at *use* time; the authored bands still never
  change (#52's letter holds for tables; its spirit is bent
  for rolls).
- **Shape B (#52-absolute):** `floor` is a fixed value carried
  in the item's own params (stronger items, higher floors).
  No party read anywhere; repel strength becomes item content
  and a balance/economy decision (#20).

Until ruled, `floor`'s semantics are **OPEN** and no repel
item may be instanced — a record whose central parameter has
two meanings is worse than no record.

## Wiring

- Records: #31 item registry (zero instanced — consistent
  with #31's own zero-instance register and its OPEN list;
  modifier items are first-fill candidates alongside Mochi
  Fruit / Mochi Cocoon, not asserted rows).
- Roll: #7 spawn roll pipeline — the transform runs after
  table selection, before the weighted pick; #113 overlays
  run in the same window (composition order **OPEN**: overlay
  then modifier, or modifier then overlay, is a landing
  decision recorded in #113's staging note as well).
- Economy: #20 prices live on the item record's existing
  `price` slots when the economy pass values them.
- Show: modifiers are game-lane instruments. The show has no
  repel spray; a Ranger keeping distance from wild Mochi on
  screen is staging and behaviour, never this system.

## Coverage — honest

- **Architecture: fully documented** (transform-layer
  modifiers over authored tables).
- **Contents: zero items, zero values.** Both ops' params ship
  null, and the repel floor's very *semantics* await an owner
  ruling against #52. The yield is the class, the ops, and the
  tension — written down instead of smoothed over.
