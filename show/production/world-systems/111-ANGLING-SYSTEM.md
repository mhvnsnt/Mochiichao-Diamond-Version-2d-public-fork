# #111 — FISHING SYSTEMS → angling & water-encounter system

**What was studied.** The angling architecture of the
reference games, as publicly documented: fishing is not a
separate encounter system but a **method** within the
encounter tables, refined over generations by **rod tiers** —
each rod class reads a different sub-table of the same water
body (better rods reach rarer slots) — and by a **bite
sequence**: cast → wait → bite cue → a reaction window →
hooked or lost. The water body keeps ONE population; the rod
chooses which slice of it can answer.

## The real-code anchor (verified)

Canon seed data already fishes. `src/data/core/encounters.json`
carries a `fish` method (one of the four canon methods in
#7's schema enum: `grass | surf | fish | cave`), and
`pond-route-01` holds surf/fish rows — per #7's re-homing:
Mochii 40/40, Inklet 30/25, Finblade 20/35 (surf/fish weights),
Floatcalf surf-only, levels 3–7. So angling in Mochiichao is
**a refinement of an existing method over existing rows**,
not a new system and not new data. Nothing below adds,
removes, or reweights a single canon slot.

## Native format — a slot discriminator, seed-convention style

#7's slot shape already carries two optional discriminators
that ship null until canon splits them (`timeOfDay`,
`weather`). Rod tier joins them in exactly the same posture —
one proposed optional slot field:

```
rodTier: null | <tier key>   // null = answers any rod (today's rows)
```

- Proposed here; applied to `world-systems/
  spawn-table.schema.json` at landing (STAGING.md), with this
  spec as referent. Until a canon source splits a water table
  by rod, every slot's `rodTier` is null and every rod fishes
  the whole table — which is precisely correct for the seed.
- **Rod tiers themselves are OPEN**: how many tiers, their
  names (display-layer, #23 lookups), and which tables they
  split are owner/balance content. The reference pattern
  (three tiers) is documented but is **not adopted as a
  number** here — the discriminator exists so any tiering the
  owner rules has a home.
- **The rod as an item is an OPEN classification.** #31's
  category vocabulary is closed (`consumable | held | key |
  care | capture | material`); a rod fits none self-evidently
  (`key` is the nearest — a non-consumable tool the fiction
  requires — but reading it in would be this package inventing
  a ruling). The rod records, when created, land in #31 with
  the category the owner/lane rules; this spec only fixes that
  an angling session *requires* a rod item id in hand, whatever
  its category turns out to be. Effect linkage: the item's
  `effect.system` would be `field` — the one value #31 already
  defines that fits a tool that opens a method.

## The bite sequence (cue grammar, both lanes)

Game lane, as a state chain over one cast:

```
CAST → WAIT → BITE (cue) → WINDOW → HOOKED | SLIPPED
```

- `BITE` is a **cue**, not a timer readout: the chain's sounds
  are #51 SFX-library records — a ripple/plip class cue for
  WAIT ambience, a distinct strike cue at BITE. Cue ids are
  **OPEN** (the library's seed rows are EP01's; no angling cue
  is canon). Window length and slip chance are balance values:
  **OPEN**, carried as data on the session, never hardcoded in
  this spec.
- Show lane: the same chain is a **blocking beat** — cast,
  held quiet (the show's silence tool), the cue, the strike —
  boarded with the #53 board pipeline's audio-column-first
  discipline. A fishing scene's catch, if any, resolves through
  #38 capture presentation, never a battle frame; and the
  species caught must be one the water's table actually holds
  (#84's roster-binding law, applied to fiction: a place only
  yields what its table stocks).

## Wiring

- Table side: #7 spawn schema (proposed `rodTier` patch) +
  the existing pond rows, untouched.
- Item side: #31 registry (rod records, category OPEN).
- Session consumers: #38 capture (hooked → bond attempt),
  #97 research tasks (list11 — an `observe`/`track` tally may
  accrue from angling sessions; interface noted, list11 owns
  its side), #51 SFX (cue records, OPEN), #19 phase (water
  tables already accept `timeOfDay` splits when canon makes
  them — angling adds no clock of its own).

## Coverage — honest

- **Architecture: fully documented; anchor rows real.** The
  fish method and the pond population are canon seed data,
  verified above.
- **Contents beyond the seed: none.** Tiers, rod items, cues,
  and every timing/chance value are OPEN. The yield is the
  discriminator, the session chain, and the rule that angling
  refines the table it fishes — it never replaces it.
