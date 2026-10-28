# #257 — BLOOM STATES → flowering as a state the world reads, never a fact that's stored

**The gap this fills.** Plant-bodied species flower.
Verdilance's crown *is* a bloom — but that bloom is its
evolved body, permanent, the way Bastihound's shield is
permanent. Nothing yet covers the other kind: the
species whose flowering comes and goes with the year,
the weather, the hour — open in the morning sun, shut
by frost — and what the game and the show should do
with that difference. This spec covers it with the
narrowest possible claim: **bloom is a state read from
the world, the way mood (#202) and life stage (#243)
are reads. It is stored nowhere.**

**How the reference record fills the same gap:**
Pokémon has exactly this, twice over. Cherrim sits
closed under cloud and opens into its Sunshine Form
under strong sun — a form change keyed to the weather,
reversible, nothing saved. Castform reshapes with the
weather the same way. The lesson taken whole: the
form follows the sky at the moment you look; when the
sky changes, the form is re-read, not remembered.

## Native spec — `mochiichao/bloom-state/v1` (fragment beside this doc)

- **Bloom lives on #130's axis — it does not found a
  fourth one.** A species that blooms carries a form
  family (#130's `formFamily` on the species record)
  whose members are its unbloomed and bloomed bodies.
  What this spec adds is the family's *criterion*: the
  active form is **derived at read time from world
  state** — #61's weather (strong sun reads CLEAR in
  the day phases; FROST and the depths' NONE never
  bloom anything), #19's phase (bloom is a day-side
  read; night closes what the sheet says closes at
  night), and #195's season where a calendar exists
  (until the calendar is ruled, season simply doesn't
  vote — the read runs on weather + phase alone, and
  says so). One proposal rides with this spec into
  #130's home: #130's `state` criterion kind, written
  for battle states, is widened to admit a *world-state*
  read of this shape. The widening lands in #130's
  file, with citation (the `RIDDEN` precedent); #130's
  battle-state criteria are untouched by it.
- **In battle, the read re-fires with the sky.** A
  bloom family's form is re-derived when the battle's
  weather changes, in #184's `weather-react` seat —
  the same seat where the sky's other consequences
  resolve, before entry effects of anything the change
  brings in. Between battles the question doesn't
  arise: the form is whatever the current sky says,
  every time it's asked. `persistAfterBattle` is
  meaningless for a bloom family and is refused in
  its record — there is nothing to persist; there is
  only the weather.
- **What bloom changes is sheet data, per species.**
  Presentation always (the opened crown, the colour
  shift — the species' own art carries both bodies,
  per #130's family discipline). Anything further —
  a `statBlock`/`typeDelta` on the bloomed form, a
  move or ability that only the bloomed body can use
  — rides #130's delta discipline exactly (only what
  changes is listed), and this package asserts **zero**
  deltas. A bloomed form that breaks the species'
  silhouette primitive is a different species wearing
  the name (#130's E4 law, unchanged).
- **Permanent bloom is not a bloom state.** Verdilance
  is always bloomed because it *evolved* that way;
  its crown is anatomy (#259's helm/crown class), not
  a family member waiting on weather. The two must
  never be merged in data: an evolved-bloom species
  has no bloom family, and a bloom-family species'
  sheets say so in those words. **Canon instances
  today: zero bloom families.** No wave-1 sheet
  declares one — the A3 line blooms by evolution, not
  by state. The first declaration is a design-lane
  act on a sheet, and this machinery waits for it the
  way #243's machinery waits for its ruling.

## Show lane

A bloom in the show is **cast, never rolled** — #200's
lustre discipline, word for word: the episode decides
who is in bloom the way it decides who is lustre, and
the vocabulary here (unbloomed / opening / in bloom /
closing) is what keeps the decision legible on the
board. The game's read and the show's casting are two
doors into the same two bodies; neither counterfeits
the other.

## Wiring

Form family + criterion: #130 (axis, record shape,
delta discipline; the `state`-widening proposal lands
in #130's home). Reads: #61 (weather), #19 (phase),
#195 (season, when a calendar exists), #184
(weather-react seat in battle). Presentation bodies:
the species' art/rig family (#259 names the parts).
Writes: nothing — the read is the whole system.

## Open slots

None that are mechanics. Whether any given species
blooms by state is a fact on its sheet (design-lane
content), and no sheet declares it yet — recorded
here as the honest contents state, not as a question
parked for the owner.

## Coverage — honest

- Architecture: fully documented in the reference
  record (weather-keyed reversible forms), re-expressed
  as a read-time derivation over #130's existing axis.
- Contents: zero families instanced; the worked
  neighbour case (Verdilance) is named precisely to
  keep it *out* of this system.
