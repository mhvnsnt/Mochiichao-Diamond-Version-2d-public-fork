# #264 — GARDEN PLANTING SPOTS → a plant resident can be planted in the Garden's soil, and stays a resident

**The gap this fills.** The Garden (#28/#65) is
where kept Mochi live their between-adventure lives.
Its plant-bodied residents currently idle in it like
everyone else — on it, never *in* it. But a plant's
home ground is soil: the place it roots, takes sun,
and blooms. This spec gives the Garden **planting
spots** — authored places in its soil where a
plant-bodied resident can be planted — and is strict
about the one thing that matters: **planting is a
way of being in the Garden, never a change of
custody or record.** A planted resident is a
resident, full stop.

## Native spec — `mochiichao/garden-planting-spots/v1` (fragment beside this doc)

- **The spot.** A record in the Garden-complex
  authoring, beside its other features:
  `{spotId, position (Garden-complex place), sunClass
  (how much of #262's light the spot takes — authored
  from the Garden's layout), soilNote (one line of
  place prose)}`. Spots are finite and authored — a
  Garden has as many as its design gives it (the
  Garden-complex authoring owns the count; **zero
  are placed by this package**). Sun spots (#262)
  and planting spots are cousins, not twins: a sun
  spot is light; a planting spot is soil; the good
  ones are both, and the authoring says which.
- **Being planted.** A plant-bodied resident
  (anatomy read from the sheet, as #263) assigned to
  a spot by the keeper's ordinary Garden management
  — the same class of act as every other Garden
  arrangement — enters the planted presentation:
  #263's ROOTED posture as a standing Garden state
  (the Garden is the one place rooting is a home
  state rather than a pause), #262's sunlight input
  accruing at the spot's `sunClass`, and #257's
  bloom derivation reading the spot's sky like any
  other place's. Lifting out is the reverse act,
  same door, no ceremony in the data — the *show*
  may make one; the record doesn't.
- **What never changes.** The individual's record
  (#80) is untouched: location stays the Garden
  (planting is not a sub-location in #106's
  discipline), keeper unchanged, no custody event,
  no care-axis write beyond what #28's loop itself
  does with the sunlight input. The spot assignment
  lives on the Garden's side (a presentation/
  behaviour seat, the family #58's PARKED spots
  belong to — the care loop owns it while the
  resident is planted), so a transferred or released
  resident leaves no planting residue anywhere:
  the spot simply stands empty for the next plant.
- **Visitors and life around the spot.** Garden
  visitors (#212) encounter planted residents as
  part of the Garden's stocked life — a visitor
  meeting a planted Verdilance-class resident meets
  it *rooted*, which is #212's roster-binding read
  with the spot's posture applied. Residents visit
  each other across spots in idle behaviour (#152's
  Garden view) — the planting bed is a neighbourhood,
  drawn as one.

## Show lane

The Garden's planting beds are a standing set: the
show's Garden scenes inherit rooted residents as
background truth (the roster-binding law in
furniture form — a bed shown planted in one episode
is planted until the story moves it). A planting or
lifting-out is a quiet care beat in #65's RETURN-step
family: small, warm, and exactly as important as the
episode decides.

## Wiring

Spot records join the Garden-complex authoring
(tables beside the verified garden-complex spawn
tables); assignment seat owned by the care loop
(#65) alongside PARKED; reads #263 (posture), #262
(sun), #257 (bloom), #212 (visitor reads), #152
(Garden behaviour). Writes: no #80/#106 writes —
stated as the spec's hard fence and as a landing
check.

## Open slots

None that are mechanics. Spot count, positions, and
soil notes are Garden content (the Garden-complex
authoring pass owns them).

## Coverage — honest

- Architecture: one feature class + its fences,
  built entirely from verified joins (#65's seat
  discipline, #106's location law, #263/#262/#257
  reads).
- Contents: zero spots placed; the worked picture
  (a planted resident, rooted, in sun, in bloom
  when the sky says so) composes four systems that
  each already exist or are specified in this list.
