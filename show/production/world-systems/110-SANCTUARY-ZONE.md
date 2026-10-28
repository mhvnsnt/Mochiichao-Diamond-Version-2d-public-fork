# #110 — CAPTURE-ONLY AREAS → sanctuary encounter zone

**What was studied.** The capture-only area architecture in
the public game record: zones where the normal battle entry
is replaced by a **capture encounter** — the creature is met,
observed, and offered instruments directly; the encounter
resolves on approach behaviour and capture checks, with a
**flee chance** standing where HP and damage would be; and,
in the preserve variant, zones where battling is simply not
something the fiction permits and encounters are meetings,
not fights. The architectural kit: *same population data,
different resolution path* — the zone changes what an
encounter **does**, never what lives there.

## Native format — one area flag, no new tables

The #7 spawn schema (`world-systems/spawn-table.schema.json`,
verified) models an area as `{areaId, areaName, depthTier,
tables[], status}`. Sanctuary is a property of the **area**,
so it lands as one proposed optional field on that shape:

```
encounterMode: "standard" | "sanctuary"    // absent = standard
```

- This package **proposes** the field and its semantics; it
  does not edit world-systems' schema file. The patch is a
  landing step (STAGING.md), applied to the real schema, with
  this spec as its referent.
- A sanctuary area's tables are **ordinary #7 tables** —
  same methods (`grass | surf | fish | cave`), same slots,
  same weights. Sanctuary-ness lives in resolution, not data:
  **encounter → #38 capture flow directly; the battle system
  never initialises.** The #38 capture record for a sanctuary
  meeting uses its non-battle bond path (the capture system's
  staged checks minus the battle-weakened input — the vitality
  term reads unweakened, which is a *consequence of the mode*,
  stated here so #38's landing wires it deliberately, not a
  new capture formula).
- **Fleeing replaces fainting.** A sanctuary encounter can end
  three ways only: bond (#38 record written), release/ignore
  (Ranger's choice, no record beyond a `seen` update), or the
  creature leaves (flee roll — its rate is slot data, and no
  slot carries one yet: **OPEN**). Nothing in a sanctuary can
  be hurt; there is no fourth outcome.
- **Discovery works as everywhere:** meeting a species sets
  `seen` (species-systems discovery bitsets); only a bond sets
  `met`. Sanctuary is not a completion shortcut.

## What sanctuary is NOT (guardrails, written down)

- **The Garden is not reclassified.** The Garden complex holds
  canon encounter-bearing tables (the `garden-complex`
  spawn bundle re-homes the meadow/pond seed rows verbatim).
  Canon stocks those tables; this package does not relabel
  their areas. If the owner ever designates a sanctuary, it
  will be by ruling, on a named area — the first designation
  is an **OPEN** slot, and it is not this package's to fill.
- **Not a difficulty mode.** Sanctuary is not "easy area":
  flee rates and unweakened capture checks can make a bond
  *harder* to land than a battled one. No balance claim is
  made either way.
- **Not a show rule.** The show stages no battles in care
  spaces because of its own doctrine (the Garden's grammar is
  care, #65); that is a parallel truth, not this system's
  doing, and sanctuary's game flag must never be cited as the
  reason a show scene plays as it does.

## Wiring

- Schema patch → `world-systems/spawn-table.schema.json`
  (landing step, named in STAGING.md).
- Resolution hand-off → #38 capture system (non-battle path);
  flee-rate field, when valued, joins #38's slot data, not #7's
  tables — capture tuning stays in the capture system.
- Sound ecology (#84): a sanctuary area's bed follows its
  tables exactly as elsewhere (roster binding unchanged);
  battle music states (SCORE-STATE, #13) are unreachable in a
  sanctuary area by construction.
- Map module (#32): sanctuary areas, once any exist, reveal
  with a distinct mode marker — presentation only, derived
  from the same flag.

## Coverage — honest

- **Architecture: fully documented** (capture-only resolution
  over ordinary population data is the documented pattern).
- **Contents: zero areas designated, zero flee rates valued.**
  The flag, the resolution path, and the guardrails are the
  yield. Canon currently names no sanctuary anywhere.
