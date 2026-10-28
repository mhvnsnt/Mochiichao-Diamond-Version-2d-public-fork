# #91 — EVOLUTION TRIGGER-ITEM TAXONOMY → evolution item data format

**What was studied.** The trigger-item family in the public
collector-game record: items whose *only* job is to be the operand
of an evolution — classically a small taxonomy (elemental stones
by type; later hold-to-trigger and location-surrogate items).
Documented structure: the item record is ordinary (id, name, bag
class); the *evolution* record is what points at it. Items do not
know what they evolve.

**Native format — plugs the existing edge model, changes nothing
in it.** world-systems EVOLUTION-DATA-MODEL already defines the
edge `{from, to, methodClass: "item", trigger: {item: id}}` and
notes: *class exists, edges don't*. This file defines the item
side of that reference:

```
evo_item { item_id, display_name, class, scope, status }
```

- `class` — the taxonomy axis, native terms: `elemental` (keyed
  to a type), `bond-token` (keyed to a relationship state),
  `place-surrogate` (stands in for a location), `form-key` (keyed
  to a form/body state). Classes are *roles*, so one item has
  exactly one class; an item wanting two roles is two items.
- `scope` — `use` (consumed on the creature) | `hold` (held
  through the trigger moment). Mirrors the reference taxonomy's
  use/hold split; the edge's `conditions[]` carries `held_item`
  for the hold case, per the shared #12/#8 condition shape.
- Item records live with the item data layer (List 4 #31) — this
  format is a *view*: any item whose id appears as an edge trigger
  gains an `evo_item` classification row. No parallel item
  database is created.
- `display_name` — **all slots OPEN.** No evolution item is canon:
  no name, element keying, or species pairing is asserted. The
  taxonomy ships with zero items, the same discipline the edge
  model used for the `item` class itself.

**Wiring.** Edge side: world-systems `evolution.schema.json`
(`trigger: {item: id}` — already the specified shape; this file
is the missing referent spec, not a schema change). Item side:
List 4 #31 item data layer carries the base record; List 5 #40
regional variants and #57 habitat variants (list7) may *reference*
an evo item as a variant trigger only through an edge — variants
never point at items directly.

**Coverage.** Taxonomy: completely documented publicly.
Contents: zero canon items — format only, by design; the first
canon item evolution will exercise `elemental` or `form-key`
first if it follows the sheets' biology, but that is an
observation, not an assertion.
