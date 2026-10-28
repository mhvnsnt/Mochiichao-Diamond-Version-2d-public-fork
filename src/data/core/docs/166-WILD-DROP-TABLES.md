# #166 — WILD DROP TABLES → what the wild carries, and how it changes hands

**Doctrine seat:** a drop table is a claim about the
world, written in the item layer's language: *this
species, in the wild, may be carrying this thing.* It
is not a loot fountain bolted onto battles. This spec
defines one row shape with two reads — the encounter
reads it to decide what a wild individual is holding;
the battle's end reads it to decide what changes
hands — and one hard rule over both: **nothing drops
that the item layer doesn't hold.** Every `itemId`
resolves in #31's registry, or the row is invalid.

**What was studied.** Wild item systems in the
publicly documented record, in their two documented
forms: wild creatures encountered *holding* items
(which transfer if the creature is caught, and can
sometimes be taken without catching), and defeat
drops (items yielded when a wild creature is beaten,
table-driven per species with rates). The kit taken:
the per-species row with a rate, the held-item form
as the primary fiction (the drop is a *carried thing*,
not spawned loot), and the channel distinction —
defeat and capture are different ways for a carried
thing to change hands, with different rules.

## Native spec — `mochiichao/drop-tables/v1` (fragment beside this doc)

- **The row:** `{speciesId, itemId (#31 — must
  resolve), weight (relative within the species' drop
  set; normalised at roll, in #7's weight idiom),
  channels[] (defeat | kept)}`. No row = no drop:
  the default state of every species is carrying
  nothing, and a drop set is the exception, authored
  per species. **All weights are data; no row is
  instanced by this package.**
- **Read 1 — the encounter's held slot.** When an
  encounter individual is generated from a table that
  stocks its species (#7), the drop set rolls once:
  on a hit, the individual carries the item in its
  held slot. This is the same held slot the rest of
  the programme already reads — #109's validator
  checks an entrant's held item against #31 with
  `useContext.held == true`, so a kept individual's
  carried item is legible to every downstream system
  without new fields. (A drop row whose item fails
  the held-context check is malformed for the kept
  channel — validation note, stated here so landing
  tests it.)
- **Read 2 — the transfer.**
  - `kept` channel: if the individual is kept (#38's
    kept moment), the carried item stays in its held
    slot — the Ranger gains the creature *and what it
    was carrying*, as one fact. Nothing moves to the
    bag; nothing is duplicated.
  - `defeat` channel: if the encounter ends by defeat
    (not flight, not keep), the row rolls at battle
    end; on a hit, the item passes to the Ranger's
    bag. A defeated individual that was *also* the
    rolled carrier yields its carried item this way —
    one item, one transfer, never both channels for
    the same object.
  - An encounter that ends any other way (Ranger
    flees, wild flees/vanishes per #152) transfers
    nothing, whichever channel the row names.
- **Rates are encounter facts, not faucets with
  memory.** Each encounter rolls fresh; there is no
  pity counter, no streak bonus, no stored luck —
  the save records the bag's contents, never the
  rolls. (Economy note: drop tables *are* an item
  faucet in #20's accounting sense. #20's faucet list
  is its own file's content; a sentence adding
  wild drops to it is proposed at landing, in #20's
  home — this package does not edit #20.)
- **What drops may be:** any #31 category the held/
  field fiction supports — in practice `material` and
  `care` classes and held-class items; a `key` item
  may never appear in a drop row (key items are
  authored placements; a validation rule, stated
  here). Drop fiction follows the species: a row
  should make sense against the species' sheet
  (#152 profile / ecology) — that is a content review
  standard for the data lane, not a schema rule, and
  it is OPEN content by definition.

## Show lane

The show does not roll drops. A wild Mochi on screen
carries something only if a story puts it in its
hands, and a kept partner's held item in the show is
a story fact under #82 conservation — never the
output of this table. The table is game-lane world
data, invisible to the boards except as the world's
background plausibility.

## Wiring

Rows join #7's area/species data layer (the drop set
is a species annex read at encounter generation);
items resolve in #31 (validation: resolution +
held-context for kept channel + no-key rule);
encounter generation reads beside #7's slot rolls;
transfers write the individual's held slot (#80
model as read by #109) or the bag (#31/#118 stock
posture); capture join #38; economy note proposed to
#20.

## Coverage — honest

- **Architecture: fully specified** (row shape, two
  reads, channel rules, validation rules).
- **Instances: zero.** No species has a drop row; all
  weights and all item choices are OPEN content.
  Whether the defeat channel should exist for a given
  species at all is a per-species content call — the
  shape permits it and asserts none.
