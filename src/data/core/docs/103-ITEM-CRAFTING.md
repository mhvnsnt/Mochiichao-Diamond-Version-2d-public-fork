# #103 — ITEM CRAFTING / COMBINATION → recipe layer over the item registry

**What was studied.** Crafting/combination architecture in the
reference games and the wider documented genre pattern: a
**recipe** is a data record — a multiset of input items, one
output item, and a gate (a station, a learned-recipe flag, or a
place) — executed against the inventory by a system that knows
nothing about what the items *do*; effects live on the item
records, recipes only move quantities. The durable lessons:
recipes reference items **by id**; the recipe book is itself
unlockable content; and crafting economies stand or fall on
their material sources and sinks. The kit taken: recipe-as-data,
id references, station/flag gates. No recipes, items, or numbers
are copied — and per #31, almost no Mochiichao items exist yet
to write recipes over, which shapes this spec honestly.

## The layer it sits on (#31, inherited whole)

#31 fixed the item registry: flat records, a closed category
vocabulary — `consumable | held | key | care | capture |
material` — structured effects, and the standing distinction
this spec exists under: **items are not moves; the General/Rare
move-class distinction is enforced by schema, and no item record
carries a move-class field.** Crafting inherits every word:

- The **`material`** category is crafting's home: materials are
  items whose primary role is to be recipe inputs. #31 already
  ships the category; this spec gives it its consumer.
- **A recipe can never output a move, teach a move, or carry a
  move-class field.** A recipe whose output id does not resolve
  to a #31 item record is a data error, mechanically checked —
  the same enforcement style as #31's `cureBy` resolution checks.
  If canon ever wants an item that teaches, that is #101's tutor
  question and #31's reference rule (an item *references* a move
  id; it does not become one), decided by the owner — not
  smuggled in through a recipe.

## Native spec — `mochiichao/recipes/v1` (fragment beside this doc)

- **Recipe record:** `{recipeId, inputs: [{itemId, qty}],
  output: {itemId, qty}, gate, status}`.
  - `gate` — `{kind: station | flag | place, ref}`: `flag`
    resolves to a #12 flag (a learned recipe is a `vars.`/
    `story.` fact); `place` to a #11 node; `station` to a
    station id — **the station vocabulary is OPEN** (no crafting
    station exists in canon; the Garden is the obvious candidate
    home and is named here only as a candidate, not a ruling).
  - Quantities ship as slots: any recipe *instanced* at landing
    would need real numbers, and **no recipe is instanced here**
    (see Coverage) — the fragment ships the shape with the two
    canon-named items in the OPEN register only.
- **Fusion — refused, in writing, and the word reassigned.**
  "Fusion" of *individuals* is not a crafting operation and
  this system does not provide it: a kept Mochi is an individual
  record (#80) with provenance (#68) and honours (#104), not a
  material. The one fusion-shaped idea canon actually holds is
  the **A9 pair-merge evolution edges** in the evolution data
  model (#8) — flagged OWNER_DECISION there, unresolved — and
  it belongs to the evolution system if the owner ever rules
  it, never to an item recipe. Item *combination* (two items →
  one item) is fully inside this spec; individual fusion is
  outside it permanently. Naming the boundary here so no later
  pass "adds fusion" to the wrong system.
- **Sources and sinks:** a recipe layer without material
  sources is a dead system, so the format names the join
  points without filling them: materials enter via #31 item
  acquisition (spawn-adjacent gathering is #7/#29 territory —
  a gatherable is an ecology row's business, OPEN) and via the
  Mochi Fruit farm's produce (#79, whose fruit table is itself
  OPEN). Every such join is a pointer, not an assertion.

## Economy interface

Crafting is a transformation inside #20's one-currency economy,
not a second economy: recipes move items, never mint currency;
if a recipe ever carries a currency fee, it is a cost slot of
the #101 shape (`{kind: currency, ref, amount}`) against #20's
currency — whose name remains OPEN, inherited unfilled.

## Wiring

Consumes #31 (item ids, categories, effect checks), #12
(recipe-learned flags), #11 (place gates), #79 (farm produce
pointer). Consumed by nothing yet — crafting is a leaf system
by design; the inventory UI reads recipes through this format.

## Coverage — honest

- **Architecture: fully documented**; recipe-as-data over an
  item registry is the standard documented shape.
- **Contents: zero recipes instanced.** Canon names exactly two
  items (Mochi Fruit, Mochi Cocoon — #31's OPEN register) and
  fixes neither's category nor effect; a recipe over unfixed
  items would be invention stacked on invention. The OPEN
  register in the fragment names the first-fill candidates and
  the owner/balance passes owed (materials roster, stations,
  quantities) — the machine ships; the cookbook is the owner's.
