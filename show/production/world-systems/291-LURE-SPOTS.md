# #291 — LURE SPOTS → the wild comes to you (Poké Spots native)

**Doctrine seat:** Every encounter system in the
programme so far is *travelling* — the Ranger walks,
casts, or dives into habitat (#7 tables, #111
angling, #192 dive). The documented XD design adds
the inverse: **fixed wild spots where you set out
food, leave, and the wild arrives** — checked later,
on a device alert, sometimes holding a special
individual worth crossing the map for. This package
seats lure spots in #66's habitat family as the
third stationary encounter system, beside angling.

**What was studied.** The documented record: a small
set of named spots in fitting terrain; a lure item
placed in a feeder (a capped stock); food depleting
over time and steps whether or not anything comes;
encounters drawn from the spot's own small table
while food lasts; a carried monitor that alerts when
something is at a spot; and rare special visitors
announced the same way — the system's whole drama
is *waiting, then hurrying back*. The kit taken:
the feeder, the depletion, the alert, the spot
table. Names, spots, and tables are native.

## Native spec — `mochiichao/lure-spot/v1` (fragment beside this doc)

- **The spot record** (proposed into #66's habitat
  family, in its home): `{ spotId, area (#7 ref),
  feeder: { stock: <0..cap>, lureItem (#31 ref) },
  tableId }`. A spot is a *place*, authored like any
  habitat — which places hold spots is world content;
  this package instances none. Spots never seat in
  the Dark Forest depths (#66's sealing discipline,
  inherited whole: a depths spot is unrepresentable).
- **The feeder loop.**
  - **Stocking** is a field action at the spot: lure
    items (#31 class — food-class items, instanced by
    the item pass, none here) go in up to the cap
    (data; the documented shape is a small cap).
  - **Depletion** runs on #19's clock + step count
    while stocked — food goes whether or not a
    visitor comes (the documented rule; waiting is
    the cost).
  - **Visitation:** while stock lasts, the spot's
    table (its own small spawn table in #7's schema
    idiom, keyed to the spot and the lure class)
    rolls on the world tick; a successful roll seats
    **one visiting individual** at the spot — a real
    wild individual generated under #214's family,
    present at the spot until it finishes eating
    (a visit window, data) or is met.
  - **Meeting it** is an ordinary encounter on
    arrival: ordinary capture (#38), ordinary rules.
    Nothing about a lured individual makes it easier,
    rarer-classed, or owed to the player — the spot
    bought a *meeting*, never an outcome.
- **The tracker — Spot Monitor native.** A device
  function on the Mochiioteca (#81 game behaviour;
  #149 `alert` class in the show's grammar — the
  closed set holds, no new class): when a visitor
  seats at any stocked spot, the device alerts at
  the next quiet moment (the documented delay is
  the drama — alerts do not interrupt battles or
  conversations; the queueing rule is #149's pacing
  grammar applied). A **special visitor** — an
  individual the spot's table flags as its rare seat
  (a lustre-class or out-of-place species record,
  authored per table) — alerts with the distinct
  alert form (the two alert weights are device data).
  The monitor reports *that* something is there,
  never what — identification happens at the spot,
  with your eyes (#287's reader has no seat here).
- **Records.** A visit writes: the spot's feeder
  facts (stock, beats) and, if met, an ordinary
  encounter history. Unmet visitors leave when the
  window closes and are gone — no record chases the
  player, no second chance is owed (#70's refusal
  of rubber-banding, applied to luck). Encounter
  counts for #255's pacing read spot visits as their
  own class so lure design can be tuned separately
  from walked rates.

## Show lane

A lure spot is a gift to episode structure: set the
food in act one, the alert lands in act three —
#82's arc grammar already knows this shape as a
 planted beat. The device alert on screen follows
#149 (assemble → settle; the Ranger's face by the
last third). What visits is casting's choice, told
honestly as casting, never as the game's odds.

## Wiring

Spot record proposed into #66's family; table in
#7's schema idiom; depletion ticks on #19; visitor
generation reads #214; meeting re-enters #38/#255;
alert seats in #81 (game) and #149 `alert` (show).
STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — spot, feeder,
  depletion, visitation, alert, records.
- **Contents: zero spots, zero tables, zero lure
  items instanced.** Which places, which tables, and
  which item is a lure are world/item content. The
  yield is the programme's first *patient* encounter
  system: the wild, arriving on its own schedule.
