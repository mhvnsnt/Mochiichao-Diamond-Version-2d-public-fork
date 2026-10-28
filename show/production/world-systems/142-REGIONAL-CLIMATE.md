# #142 — REGIONAL CLIMATE SYSTEM → per-region weather identity

**Seat in the doctrine:** regions in one connected world
must *feel* different before they are understood
differently, and the first difference a traveller meets is
the sky. #61 built the weather system (WEATHER-STATE, a
build-manifest global alongside WIND-STATE and
SCORE-STATE) and #67 keyed creature behaviour tables to
world state; neither said what makes one *region's*
weather its own. This spec is that layer: a climate is a
region's standing bias over the shared weather machinery —
a design input, declared per region, consumed by every
weather reader at once.

**What was studied.** Climate in the publicly documented
record: route-level weather in the reference games is
*placed* (this route rains, that one is a sandstorm) — a
per-area authored fact; open-world design writing treats
regional climate as identity (the cold region, the storm
coast) expressed as *weights and exclusions* over a global
weather set rather than bespoke systems per region. The
kit taken: one weather machine (#61), one per-region
weight table over it, and hard exclusions where canon
demands them.

## Native spec — `mochiichao/regional-climate/v1` (fragment beside this doc)

- `climate` record, one per region: `{regionId, climateId
  (nullable), phaseBias — per-#19-phase adjustments,
  weatherWeights — over #61's weather vocabulary,
  exclusions[] — weather states that never occur here,
  behaviourTables (#67 refs), fx (#73 refs)}`.
- **Consumers read through the climate, never around it:**
  an area's effective weather = #61's producer output
  filtered and weighted by its region's climate record
  (border zones read the seam — #140: the two climates'
  weights meet, neither simply wins; the seam rule is
  authored per zone, OPEN). #67 behaviour tables key to
  the *effective* state, so a species' weather behaviour
  is automatically regional where its range is (#144).
- **Hard canon already on the books, carried verbatim:**
  the Dark Forest *depths* are weather **NONE** — #61's
  escalation-by-subtraction; a climate record may weight
  many things but may never give the depths weather.
  Frost nights are a named composite (`night + frost-
  trace`, #19) and Region 1's climate record points at
  that composite rather than redefining it.

**Seeding — exactly as far as canon reaches, no further:**

| Region | climateId | Record state |
|---|---|---|
| Region 1 (Iridescence) | OPEN (identity name unruled) | Weights *are* the #61/#67 tables as they stand — the record references them; frost-night composite + Forest-depths NONE carried as exclusions/facts |
| Regions 2–5 | OPEN | Slot only: a null record per region, so the shape exists and the design lane fills identity when each region is built |

A climate *identity* (the one-line feel — storm coast,
high dry plateau) is a design-lane input per region, in
the same spirit as #102's habitat ranges: this system
defines where the identity plugs in (weights, exclusions,
phase bias) and refuses to invent the identities.

## Wiring

Biases #61's producer output; behaviour via #67; FX via
#73 (at the Forest's STILLED dread all cycles hold,
weather included — inherited); species/habitat expression
via #102 range maps (a range's climate column is this
record, read per region); border seams via #140; media
weather reports via #90's state-reading generators (they
may only report the *effective* state — no forecasting
fiction the system can't back).

## Coverage — honest

- **Architecture: fully specified** (one record shape,
  one consumption rule, canon exclusions carried).
- **Identities: OPEN for all five regions** — including
  Region 1's name. The weights that exist today are
  exactly the #61/#67 tables; this package authors no new
  weather content and no region's climate character.
