# #31 — ITEM SYSTEMS ARCHITECTURE → item data layer

**What was studied.** The item-data architecture of the
reference games, publicly documented: a flat item registry where
every item is one record — id, display name, **category/pocket**,
a structured **effect** (which system it calls, with what
parameters), price fields, and use-context flags (field/battle/
held). The yield is the native registry shape below.

## NOT moves — the standing distinction

Mochiichao has a move-class system already: **General Moves /
Rare Moves** (the TM/HM-equivalent classes, owner-named, PR #366
registry). **Items are not moves and this layer never touches
that classification.** An item that *teaches* something, if
canon ever creates one, references a move id — it does not
become one, and no item record carries a General/Rare field.
Conflating the two systems is the one design error this doc
exists to prevent.

## The native record — `item.schema.json`

- `itemId` — stable kebab key; `displayName` separate (rename
  law). Canon display names already live: **Mochi Fruit**,
  **Mochi Cocoon** (display-sweep rulings) — they are recorded
  as *names canon holds*; their item records are NOT instanced
  here because canon has not fixed their category/effect in any
  source this lane can cite — they appear in the OPEN register
  below, not as invented rows.
- `category` — closed vocabulary (the documented pocket
  architecture, natively named): `consumable | held | key |
  care | capture | material`. A new category is a schema
  revision, never a free string.
- `effect` — `{system: status|heal|care|field|event|none,
  op: string, params: {}}` — `system` names the wired consumer:
  status → #27 records (`cureBy` joins here by item id), care →
  #28 activity/axis hooks, event → #12 flags. `params` values
  are null until a balance/canon source sets them.
- `useContext` — `{field: bool, battle: bool, held: bool}`
- `price` — `{buy: null, sell: null}` (economy numbers are
  List 3 #20's pass; the slots live here so the registry never
  reshapes when economy lands)
- `stack` — `{stackable: bool, max: null}`
- `status` — provenance per core convention

## Consistency checks the layer makes mechanical

1. Every #27 condition's `cureBy` id resolves to an item record
   whose `effect.system = status`. Dangling cure = data error.
2. Every `care` item's effect op names a #28 activity id.
3. No item record contains a move-class field (schema forbids
    additional properties — the distinction is enforced by the
    schema, not by vigilance).

## Coverage — honest

- **Architecture: fully documented.**
- **Contents: zero instanced.** Canon names two items (Mochi
  Fruit, Mochi Cocoon) without fixing their data in a citable
  source; the registry ships as schema + checks + an OPEN
  register naming those two as first-fill candidates. Prices,
  effects, and the rest of the item roster are owner/balance
  passes, flagged — not invented here.
