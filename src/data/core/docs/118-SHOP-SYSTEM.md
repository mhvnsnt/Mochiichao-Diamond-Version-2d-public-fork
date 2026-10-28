# #118 — MART / SHOP SYSTEMS → shop system architecture

**What was studied.** The shop architecture of the reference
games, as publicly documented: each shop is an **inventory
list in data**, not code — a list of item ids, in some
generations tiered by league progress so the same counter
stocks more as the player advances; buying pays the item's
list price, selling returns a fixed fraction of it, and
speciality counters (herb sellers, bargain stalls) are the
same record with a different list and flavour. The kit
taken: stock is data, price lives on the item, availability
is a function of progress. No inventories, prices, or shop
text are copied.

## Canon anchors (verified)

- **#20 ECONOMY** fixes the money this system spends: one
  integer currency (name OPEN), no dynamic pricing, no
  second currency — and it already defers to this spec:
  "shop contents are OPEN — contents wait on" the item
  layer and a shop system. Prices are **item data** (#20's
  ruling): a price is read from the #31 item record, never
  restated in a shop.
- **#31 ITEM-DATA-LAYER** is the stock universe: flat
  registry, closed category vocabulary (`consumable | held |
  key | care | capture | material`). A shop row that names
  an item id with no #31 record is a data error.
- **#101 MOVE-TUTORING** is the neighbouring service
  economy, and the two must not blur: tutoring is a
  *service* bought from a person (its own cost shape against
  #20); a shop sells *items* from stock. A counter that does
  both is two records, not one hybrid.

## Native spec — `mochiichao/shops/v1`

A shop record:

- `shopId` — stable id (`shop.<place-slug>` shape, following
  the packages' id conventions).
- `placeId` — a route-graph node id (#11) or an interior id
  (#119). A shop with no real place is not a shop; landing
  verifies the place exists.
- `stock` — an ordered list of rows:
  `{itemId, unlock: null | <progress.* flag (#12)>}`.
  A row with `unlock: null` is stocked from the start; a
  gated row appears when its flag exists. **Availability is
  derived at read time** from the flag state — the stock
  list itself never mutates, so a save can never hold a
  stock state the flags contradict (the #14/#96 derivation
  law, applied to shelves).
- `services` — closed vocabulary at this layer: `buy`,
  `sell`. Anything richer (healing, tutoring, crafting) is
  another system's record referenced from the same place,
  never a shop-service string.
- **Sell-back:** the reference documentation's fixed
  fraction is one half of list price. Recorded here as
  **PROPOSED default, not canon** — the fraction is a
  one-field owner/game-design ruling (`sellFraction`), and
  key items (`category: key`, #31) are unsellable by schema
  rule, not by per-shop flag.
- **Stock rotation:** where the reference games rotate stock
  (daily bargains), rotation is a *selection function* over
  the stock list keyed to #19's clock — the #124 rotation
  system's territory. A shop may declare a rotating subset;
  the rotation mechanism is #124's, cited, not rebuilt here.
- All player-facing strings (shop names, keeper lines,
  refusal text) resolve through #23 lookups; keeper NPCs,
  where scheduled, are #93 records — the shop record names
  a place, not a person.

## Wiring

Reads #31 (every stock row resolves), #20 (currency +
faucet/sink accounting: shops are the economy's primary
sink), #11/#119 (places), #12 (stock gating flags), #23
(strings), #124 (rotation, where declared). Save impact:
none — purchases mutate the roster's item holdings and the
currency balance (#20/#96 own those facts); the shop itself
stores nothing.

## Coverage — honest

- **Architecture: fully documented**; tiered stock and
  fixed-fraction sell-back are the documented pattern.
- **Contents: every inventory, every shop's place and name,
  and the keeper cast are OPEN** — canon names no shop.
  The sell fraction is a PROPOSED default awaiting the
  owner's ruling, and the currency's name is inherited
  OPEN from #20. Zero stock rows are instanced.
