# #29 — HABITAT / BIOME ECOLOGY TABLES → per-region ecology format

**What was studied.** How the reference games structure a
region's living layer in data: habitat groupings attached to
species (the habitat field of the dex record — MOCHIIOTECA-
FORMATS #1), area encounter tables (#7), and time/weather
variation layered on both. The architecture: **ecology is the
join** — species × habitat class × area × time — from which both
the game's encounters and the show's ambient population are
derived, so the world can never contradict itself between lanes.

## The native format — one ecology file per region

`ecology-table.schema.json`. A region file lists **habitat
zones**; each zone binds an area, its habitat classes, and the
species the canon sources place there.

- `regionId` / `regionName` — canon region ids; display names
  follow the display sweep (Region 1 displays as **Iridescence**;
  production name Mainframe stays in production docs only —
  two-lane law)
- `zone` — `{zoneId, areaId (joins #7 spawn files), showLocation,
  habitatClasses: [...], notes}`
- `habitatClasses` — the spawn schema's existing enum, reused
  verbatim: `sky | small-ground | water | perch | night`. This
  package **extends** it with two classes the Forest and Garden
  force: `canopy` (Forest surface — inhabited, humming) and
  `depths` (Forest deep interior). Extension is additive; the
  spawn schema's enum update is a landing note in STAGING.md,
  flagged, not silently assumed.
- `residents` — `{speciesId, residency: wild|kept|ambient-only,
  evidence: canon source, status}`. A resident row requires a
  canon source in `evidence`; prose canon yields `status:
  canon-prose` rows with no numbers anywhere (there are no
  numbers in this format at all — weights live in #7, rates
  live nowhere until canon sets them).
- `timeBands` — the show's four bands (morning/day/dusk/night)
  as *presence* marks only where a canon source speaks in time
  terms (P6 time truth); unmarked = canon silent = field null.

## Worked instance — `examples/region1.ecology.json`

Region 1 only, and only what canon proves:

- **Garden complex** (meadow edge + Pond): residents = the #7
  seed species, evidence = encounters.json seed; habitat classes
  from method-proof (surf/fish → water) + meadow grass →
  small-ground (method-proves-class, same rule as #7).
- **The Dark Forest, surface**: wild Kittember (canon prose,
  SEASON-CANON-MAP); classes canopy + small-ground; NPC-adjacent
  species are NOT listed (NPCs are people, not ecology).
- **The Dark Forest, depths**: zone exists, `residents: []`,
  `status: OPEN` — mirrors the empty depths spawn table exactly.
- **Cave of Echoes side** (cave-route-01 seed species): zone
  listed with evidence = seed, showLocation null (no show
  counterpart established).
- **Regions 2–5**: files are **not** instanced here. The regions
  exist in canon, but their contents are the side/design lane's
  active work (wave-1 sheets carry Discovery prose per region);
  ecology instances for R2–R4 are coded from those sheets at
  canon lock — the format is region-ready, the contents are
  OPEN, and this package does not pre-empt the lane.

## Wiring

- **→ #7 spawn tables**: a spawn slot's `habitatClass` must
  exist in its area's ecology zone — a mechanical consistency
  check the landing can run (slot class ∈ zone classes).
- **→ LIVING-WORLD P2 binding**: the show's ambient roster
  binding (habitat class × location) reads ecology `residents`
  with `residency: wild|ambient-only`; `kept` residents never
  ambient (they are somebody's partner — P1 principals rule
  generalises: kept creatures appear as cast or not at all).
- **→ #14 completion / discovery**: a species' discovery entry
  (three-state, species-systems #3) cites its ecology zones;
  "where is it found" is answered by this file, so dex prose
  and encounter data cannot drift apart.

## Coverage — honest

- **Architecture: fully documented** (habitat fields, encounter
  joins, time layering are public decomp/documented shapes).
- **Contents: Region 1 seed-level, everything else OPEN** —
  exactly canon's own state. The format's job is to give the
  wave-1 Discovery prose a machine home as it locks, region by
  region, without restructuring.
