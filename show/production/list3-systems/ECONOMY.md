# #20 — ECONOMY SYSTEMS → game economy spec

**Teardown (public documentation).** The reference economy is
deliberately simple at the core and structured at the edges: **one
currency**, integer-only; money enters from a short list of faucets
(battle winnings scaled by opponent class and level, item sales at a
fixed fraction of buy price, found money) and leaves through sinks
(shops, services). Prices are **data, not code** — a per-item price
field — and shop inventories are **per-shop stock lists** referencing
item ids, gated by progression flags (stock expands after story
beats). Sell price is a single global fraction (½), never per-item.
Nothing inflates; balance is tuned by faucet rates and price points.

**Native spec — `mochiichao/economy/v1`.**

- Currency: one in-world currency. **Its name is OPEN** — no canon
  name exists, and an in-world name must pass the display sweep (no
  overt computer tells), so this spec keys everything `currency` and
  leaves the display string to an owner naming pass. Amounts are
  integers; the data model has no decimals anywhere.
- Faucets (structure locked, rates OPEN): battle winnings =
  `class_base × level_band` (class bases keyed to the #18 opponent
  classes), item resale at the global fraction (½ PROPOSED, as
  reference), pickup/quest rewards as event-system effects (#12).
- Sinks: shops, Garden services (care loop, List-7 #65 when built),
  dojo-circuit fees if any (OPEN).
- Shops: `shop` records = `{shop_id, place_id, stock: [{item_id,
  gate_flag}]}` — stock rows appear when their #12 `progress.*` flag
  is set; prices read from the item record's price field (item data
  model is List-4 #31; until it lands, price is a named field this
  spec requires of it). No shop hardcodes a price.
- Anti-fragility rules from the teardown: no per-item sell fractions,
  no dynamic pricing, no second currency without an owner ruling
  (premium-currency patterns are explicitly out of scope).

**Wiring.** Event/flag architecture (#12) is the gate + reward rail;
route graph (#11) places shops at nodes; the completion loop (#14)
may grant currency but never gate routes with it (already its rule).
Show lane: money is game-lane system; the show shows Rangers living
in the world (market scenes, the night-goods stall of the dialogue
wiring) without ever displaying the model.

**Coverage.** Architecture: standard and fully documented. All rates,
the currency name, and shop contents are OPEN — contents wait on
canon places and the item model; nothing is priced in this package.

**Seats added at List 26 landing (2026-10-27), citing #253.** (1) `lossBase` — the single economy constant behind what a losing player pays out (`min(held, lossBase × highest party level)`): its seat is this file's data; the *value* is authored economy data, owed, and was not invented at landing. (2) `classBase` — the payout base keyed to opponent class (`classBase × level of the final opposing individual`): its seat is the authored-party record (`src/data/core/schemas/trainers.schema.json`), landed there citing #253; values likewise owed. The formulas are complete without the values; the currency name remains OPEN above.
