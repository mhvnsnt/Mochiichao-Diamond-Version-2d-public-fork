# #7 — ENCOUNTER / SPAWN TABLES (teardown → native system)

**What was studied.** The encounter-table architecture of the
creature-collector games, as documented publicly and in the open
community decomp projects (pret family): a per-area table of *slots*,
each slot = species + level range + a relative weight; tables split by
**encounter method** (grass, water-surface, fishing, cave floor…), and
in later generations by **time of day** and weather. The roll is:
pick a table by method × time, then a weighted pick among its slots.
Nothing about that architecture is a game asset — it is a data shape,
and it is the shape our own canon core already uses in seed form.

**What canon already has (the seed this extends).**
`src/data/core/encounters.json` (game repo, PR #98 data-core) is a
seed: **3 maps, 4 tables, 13 species**, rows shaped
`{mapId, method, minLevel, maxLevel, weight}` with `timeOfDay` /
`weather` fields present but null. The seed rows (via Sideline A's
gap-fill extraction, `species-data-system/gap-fills/
body-and-discovery-fills.json`):

- `meadow-route-01` (grass): sproutle 30 · pupbble 25 · squirmite 20 ·
  zephling 15 · kittember 10 — levels 2–5
- `pond-route-01` (surf / fish): mochii 40/40 · inklet 30/25 ·
  finblade 20/35 · floatcalf 10 (surf only) — levels 3–7
- `cave-route-01` (cave): gearkid 35 · pebblefist 30 · punchkid 20 ·
  pixilite 15 — levels 5–9

Rarity in canon is dual-sourced: encounter **weight** (how often you
meet it) and species **catchRate** (how hard it is to keep) are
separate fields and stay separate in this schema — the wave-1 sheets'
prose rarity words (common/uncommon/rare) map onto weight bands when
the lane codes new tables, never onto catchRate.

## The native schema — `spawn-table.schema.json`

One file per **area**. An area holds one table per **method**; a table
holds slots optionally split by time band.

- `areaId` / `areaName` — canon place ids (kebab, matching core style)
- `depthTier` — `null` everywhere except the Dark Forest, which is
  tiered (`surface` / `depths`) because canon treats them as different
  worlds: the surface hums and is inhabited; the depths are where
  things stopped moving
- `method` — canon vocabulary only: `grass`, `surf`, `fish`, `cave`
  (forest floor rolls on `grass`; see the Forest instance)
- slot — `{speciesId, minLevel, maxLevel, weight, timeOfDay, weather,
  habitatClass, status}`; `timeOfDay`/`weather` are `null` until a
  canon source splits them (the seed's own convention), `habitatClass`
  is the show-wiring field below, `status` follows the core README
  convention (`canon: <source>` / `seed` / `provisional` / `OPEN`)
- time bands, when split: `morning | day | dusk | night` (the four
  bands the show's time-truth law already speaks in)

## The worked instance — `garden-complex.spawn-tables.json`

The Garden complex's encounter-bearing maps, lifted **verbatim** from
the canon seed rows above (weights and levels unchanged), re-homed in
the schema: `meadow-route-01` = the Green's meadow edge, `pond-route-01`
= the Pond. The `cave-route-01` seed is **not** a Garden table — it
belongs to the Cave of Echoes side of the world and is left in the
core where it lives; it is listed here only so nobody "loses" it.
Time-of-day splits and habitat classes for these slots are marked
owed, not invented (see Wiring).

## The Forest instance — `dark-forest.spawn-tables.json`

- **Surface:** one canon-prose row — wild **Kittember** (season canon
  map: the Forest's canon contents include wild Kittember). Levels and
  weight are `null`, status `canon-prose, numbers owed`: canon says
  the species is there and has never numbered it. Kittember *also*
  holds a meadow seed row (weight 10) — both are canon; a kept garden
  edge and a wild forest population are not a contradiction.
- **Depths:** the table exists and is **empty on purpose** —
  `status: OPEN`. Canon does not stock the depths and does not answer
  what stopped moving there. An empty table with an OPEN flag is the
  honest data shape for that; the first canon ruling that stocks the
  depths fills slots, not schema.

## Wiring — show side (LIVING-WORLD)

The game tables and the show's ambient population are two consumers of
one binding, per LIVING-WORLD (`repo-add/show/production/
LIVING-WORLD.md` §2.2):

- **P2 roster binding** — ambient picks are species IDs from the
  canonical roster bound by **habitat class × location**. LIVING-WORLD
  leaves that binding table as an open build item ("names are canon
  and canon is the roster's"); the schema's per-slot `habitatClass`
  field is its home. Filled so far only where the encounter method
  itself proves the class (pond `surf`/`fish` rows → `water`).
- **Population classes** map onto areas, not species: Gate/Green skies
  → `POP-SKY`, crossings → `POP-FG-CROSS` / `POP-BG-CROSS`, fence and
  stones → `POP-PERCH`, Pond → `POP-WATER`. Density budgets (P5) and
  time truth (P6: dawn chorus, dusk water class, night class at the
  Gate, the garden sleeps) are show-side rules that read the same
  habitat classes — they do not change game weights.
- **P1** — principals are never ambient in their own scene: a spawn
  row never casts a named cast member as background. The tables are
  species-level; casting is episode-level.
- **The Forest exception (P5)** — show population in the Dark Forest
  is **0 at every tier**, and the zero is a plot point. The game may
  roll Kittember on the surface; the show frame stays empty. The two
  lanes sharing one schema does not make them share one behaviour.

## Wiring — data side

- New areas/tables land as instances of this schema beside
  `src/data/core/encounters.json` (STAGING.md); the core file's seed
  rows migrate into instances without value changes.
- The wave-1 sheets' **Discovery** field (region — habitat; rarity
  word; method; level band in words) is the prose source from which
  future tables for Regions 2–4 are coded — same fields, words →
  numbers only at the owner's canon lock, exactly as the design lane
  already treats stat numbers.
- A species' sheet `discovery` element stays prose + pointers; the
  tables are the machine-readable side. Neither duplicates the other.

## Coverage — honest

- **Architecture: fully documented.** Slot/weight/method/time table
  structure is one of the most completely documented systems in the
  decomp literature; nothing in this schema rests on guesswork about
  how the reference systems are shaped.
- **Our canon contents: seed-stage, by canon's own account.** 13 of 49
  Gen-1 species have encounter rows anywhere; the Forest has prose
  only; time/weather splits exist as fields and are unpopulated.
  This package extends the *shape* to every area the specs need and
  fills *contents* only from canon — the rest is flagged, not filled.

**Consumer citation (List 17 #163, landing 2026-10-27):** mythical-habitat sealing behaviour is decided in 163-MYTHICAL-HABITAT-SEALING.md (show/production/world-systems/), not in this document.

**Slot registered (List 22 #209, landing 2026-10-27):** the `ambush` eligibility slot is in the spawn-table schema beside #158's `horde` slot (209-AMBUSH-ENCOUNTERS.md). No table carries ambush contents; the initiation kind is cited into the encounter-record vocabulary in its own home, not forked here.
