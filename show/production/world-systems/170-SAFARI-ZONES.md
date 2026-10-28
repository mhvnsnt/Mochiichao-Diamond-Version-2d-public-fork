# #170 — SAFARI CAPTURE ZONES → battle-free capture as a game of approach

**Seat in the doctrine:** #110 built **sanctuary** —
a property of a place, expressed as one proposed field
on #7's area schema (`encounterMode`), where encounters
resolve as quiet meetings: capture flow directly, flee
replacing fainting, the Garden explicitly not
reclassified, zero areas designated. A safari zone is
sanctuary's managed cousin. The fiction differs: a
sanctuary is a preserve where battling is simply not
done; a **safari zone is a place you enter on terms**,
where capture is a game of approach — thrown items,
patience, reading the creature — and the zone's rules,
not a battle, supply the tension. Same population
data, different resolution *play*.

**What was studied.** Safari-zone architecture in the
publicly documented record: a bounded area, a session
entered on terms, a thrown-item vocabulary (bait that
holds a creature's attention; the capture instrument
thrown directly), no battling or weakening, and an
encounter that ends when the creature leaves. The kit
taken: zone record + closed throw verbs + capture math
with the battle terms absent. No zone layouts, item
names, or session prices are copied.

## Native spec — `mochiichao/safari-zone/v1` (fragment beside this doc)

- **The zone record:** `{zoneId, areaRef, thrownItems[],
  entryTerms, tableRef}`. `areaRef` is a #7 area
  carrying `encounterMode: "safari"` — **proposed here
  as a sibling value in #110's field**, landing in #7's
  schema home in the same patch as #110's `sanctuary`
  value (one field, one edit, both packages cited).
  `tableRef` points at the area's **ordinary #7 tables**
  — exactly as #110 ruled for sanctuary, the zone
  changes resolution, never what lives there.
  `entryTerms` (session shape: count of instruments,
  time, fee) is a slot whose **contents are OPEN**.
- **The throw vocabulary (closed):** `offer` — throw a
  bait-class item; the creature may approach, eat,
  stay. `toss` — throw the keeper instrument: a
  capture attempt under the math below. `wait` — do
  nothing; time passes and behaviour plays. **No other
  verbs exist in the zone.** There are no battle verbs
  to withhold: no moves are usable, nothing can be
  weakened, no status can be inflicted — the
  vocabulary's *absence* is the rule, not a lock on a
  fuller menu.
- **Bait legality.** An item is throw-able as bait iff
  it is a #31 record carrying the proposed
  `useContext.safari` flag (a proposal into #31's
  schema home — one boolean beside field/battle/held,
  landing only there, per the proposal discipline) and
  its effect is a field/care-class op the zone reads as
  attraction. The zone record's `thrownItems[]` lists
  the item ids legal *here*; the flag is what makes an
  item safari-shaped anywhere. Bait item instances and
  effect params are #31 content — **OPEN, zero
  instanced**.
- **Capture math is #38's with the battle terms
  removed BY CONSTRUCTION.** The safari resolution
  record has **no vitality field and no status field**:
  `pCondition = pBase × instrumentTier` only —
  `vitalityFactor` reads *unweakened* (the consequence
  #110 already stated for sanctuary's non-battle path)
  and `statusFactor` takes the neutral factor, the only
  legal value without a battle (#38's own rule). This
  is stronger than a flag: there is no input by which a
  safari attempt *could* read a weakened target, so no
  caller can smuggle weakening in. Instruments in a
  zone are zone-issued tiers in #38's tier-list shape;
  **tier instances are OPEN** — canon names no capture
  instruments at all.
- **The tension is approach behaviour.** The encounter
  is a behaviour read: #152's **wild view**
  (`threatResponse`, `curiosity`, activity by phase)
  drives whether the creature approaches, holds, or
  leaves, and bait shifts the read — a bold creature
  comes sooner; a wary one may still go. The three
  endings are #110's: bond (a #38 capture record,
  non-battle path), the creature leaves (flee roll —
  its rate lives in #38's slot data, **OPEN**), or the
  Ranger withdraws (session end; nothing recorded
  beyond `seen`, per #110's discovery discipline). The
  Ranger's skill is reading the profile in front of
  them — there is nothing to grind down.
- **The Dark Forest is never a safari zone.** Stated
  flatly, as law: no Forest area — surface or depths —
  may carry the safari mode, and a zone record naming
  a Forest area is a data error at validation. The
  depths could not stock one in any case (their table
  is verified empty, #163); the surface is excluded by
  this rule, not by absence of data — the Forest's
  register is dread and care, never a capture game.
- **Show lane:** a safari sequence is choreography
  under the same shape — approach behaviour played per
  profile, thrown items as props, a bond staged as a
  meeting. The show never depicts a safari capture as
  a fight, and never borrows battle staging for one.

## Open slots (nothing invented)

Any zone's designation (none exists; designation is an
owner ruling on a named area, as #110 ruled for
sanctuary) · entry terms and session limits entire ·
the bait item roster and the `useContext.safari`
acceptance in #31's home · zone-issued instrument
tiers · flee rates (inherited #38 slot) · whether a
zone may border a sanctuary area (geography is content).
