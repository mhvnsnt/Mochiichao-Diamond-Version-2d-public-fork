# #102 — HABITAT / RANGE MAPS → derived distribution cartography

**What was studied.** Distribution-map architecture in the
reference games, as publicly documented: the dex's area view —
a map of the region with the places a species can be met lit up.
Underneath, it is not cartography at all: it is a **reverse
index of the encounter tables** (species → the areas whose
tables contain it), rendered over the world map. Later systems
add nests/roaming pins, but the core stays a projection: change
a table and the map changes. The kit taken: range as a derived
reverse index, never as authored data. No map art, area data,
or species placements are copied — our placements come only
from our own tables.

## Native rule — a range map is GENERATED, never drawn

A hand-authored range map is a second source of truth that
*will* desync from the spawn tables (the #12/#14 derived-data
law, applied to geography). So:

- **Inputs (the only sources):** spawn tables (#7 — species ×
  area × method × time/weather), ecology tables (#29 — species
  × habitat zone residency, with its canon-evidence rule), and
  the route graph (#11 — the geography the projection renders
  over: nodes + their areas).
- **Derivation:** `range(species) = { areaId | a #7 row stocks
  the species in that area } ∪ { zoneId | a #29 resident row
  places it }`, each cell carrying its qualifiers (method,
  time bands, residency kind) and its **provenance pointer**
  (which table, which row). A cell with no provenance does not
  render. There is no editing surface: to change a range, you
  change a spawn or ecology row — in its home package, through
  its own canon-evidence rules.
- **Output shape** — `mochiichao/range-map/v1` (fragment beside
  this doc): one generated record per species per region,
  stamped with the input tables' versions so a stale map is
  detectable (currency law: the map names what it was generated
  from).

## The Dark Forest depths rule

The depths spawn table (#7) is **intentionally empty** and the
depths ecology zone (#29) exists with `residents: []`. The
projection therefore has *no rows* for the depths — and the map
must not render that as "nothing lives here." It renders
**unsurveyed**: the depths are a place the cartography does not
claim knowledge of (the same withholding discipline as #41's
mythical grammar and #84's empty depths sound table). A range
map that showed the depths as confidently empty would be a
canon claim canon has never made. Adding a depths row to any
input table is a canon event; the map then changes by itself.

## Surfaces

- **In-game:** the Mochiioteca's map module (#32) is the
  consumer — its reveal states already derive from flags over
  route-graph nodes; range cells render only for areas the
  module has revealed, and only for species at `seen` or beyond
  (#14: an unseen species has no entry to hang a map on).
- **Show-side:** production cartography — the same projection,
  printed for the writers' room, is how episode planning knows
  which species a location may *show* (roster-binding, #84's
  law, visual twin). The show never stages a species somewhere
  its range record has no provenance for.

## Wiring

Pure consumer: #7 + #29 + #11 in, range records out; #32 map
module and #14 discovery states gate the display. Regeneration
is a landing-pipeline step (a tool beside the spawn-table
schemas, run when either input table changes — STAGING names
it). No new stored state: range records are build artefacts,
recomputable at any time, and #96's save spec does not carry
them.

## Coverage — honest

- **Architecture: fully documented** (reverse-index projection
  is the documented dex-map mechanism).
- **Contents: exactly as complete as the inputs.** Region 1's
  canon-seeded tables yield a Region 1 map (Garden complex,
  Forest surface, cave route); Regions 2–5 yield nothing until
  their #7/#29 instances exist — the design lane's wave-1 work,
  flagged in #29 already. No range is asserted beyond a table
  row's evidence.
