# #128 — BATTLE BACKGROUNDS → battle plate system (per-area plates under the current-version law)

**What was studied.** Battle background systems in the
reference games and their anime, as publicly documented:
each area carries a **battle plate** — the ground/backdrop
a fight is staged on — keyed to where the encounter fires
(grass, cave, water surface, dojo floor), with time/weather
variants of the same plate rather than different scenes.
The kit taken: the plate is a *piece* — a versioned,
registered artwork with variants — and the battle system
selects it by encounter context; it never improvises one.
No artwork, layouts, or palettes are copied.

## The standing laws this system answers to

- **Current-version law (owner, standing):** every piece
  has a marked CURRENT version in its registry
  (`parts-catalog.json` / `clip-index.json`, per
  SHOW-HOME.md), and later work builds on the marked-
  current piece — never a quiet fallback to the oldest
  base version. The law was set after composites were
  built on a v1 still plate instead of the current living
  background. Battles are a *use* of background pieces, so
  battles inherit the law whole.
- **Living backgrounds:** the show's backgrounds exist as
  living pieces (ambient cycles, LIVING-WORLD grammar —
  #61/#73's cycle entries are their weather layer). A
  battle staged in an area is staged in that area's living
  place, in the battle frame — the plate is the living
  background's battle rendering, not a separate still
  universe.
- **No baked shadows** (standing): plates carry no
  character shadows; combatant shadows are composite-stage
  work, as everywhere else.

## Native spec — `mochiichao/battle-plates/v1`

A plate is a parts-catalogue entry with a battle role:

- `plateId` — `<areaId>--battle` (area ids are #7 spawn-
  table / #11 graph ids; a plate may only cite an area
  that exists in those systems).
- `areaId` + `surface` — the encounter context the plate
  serves: the surface classes come from the encounter
  record that fired (grass/cave/water/floor per #7/#30's
  own vocabularies — this spec adds no surface class).
- `versions[]` — the piece's version chain, each entry
  `{version, status: current | superseded, supersedes}`,
  maintained under the current-version law: exactly one
  entry is `current` per plate *per use* (currency is per
  piece AND per use — a living variant may stay assigned
  to one context while a newer version serves another;
  the registry records which serves what).
- `living` — whether the current version is a living
  piece (ambient cycle ids it runs, joining #61/#73's
  `AMB-*` cycle registry) or a still. A still is a legal
  *version*; it is never the silent default where a
  living version exists (the law's always-wrong move).
- `variants` — time/weather renderings of the same plate
  (keys from #19's states and #61's WEATHER-STATE), each
  pointing at its own version chain — a variant is a
  versioned piece too, not a filter. The Dark Forest
  **depths** take the withholding treatment here as
  everywhere: no plate is asserted for the depths —
  battles there are unstocked space (#7's depths table is
  intentionally empty), so the depths plate slot ships
  EMPTY and adding one is a canon event, not a data fill.

**Selection:** the battle's plate is derived at encounter
time — area + surface + world state (#19) → the registry's
marked-current version for that use. The derivation is
read-only over the registry; battle state never writes
back into the catalogue (presentation reads the world, #10's
law: the living field is a snapshot and cannot affect the
fight — the plate is scenery under the same rule).

**Show lane:** the show stages fights on the same plates —
an episode's battle is composited over the area's current
living background, and the plate registry is how the show
and the game can never drift on what a place looks like
mid-fight. Episode boards (#53) cite `plateId` + version,
so a re-render after an upgrade is a registry lookup, not
an argument.

## Wiring

Registry home: `parts-catalog.json` (SHOW-HOME.md's shared
manifest — plates are entries in it, not a new registry).
Context joins: #7 (area/surface), #11 (area ids), #19
(world state), #61/#73 (living cycles + weather state),
#10 (battle flow's presentation layer consumes the
selection), #53 (boards cite plates). The catalogue's
in-repo home is a landing verification (see STAGING) —
this package registers plate *entries* as the shape, not
as landed rows.

## Coverage — honest

- **Architecture: fully documented** (area-keyed battle
  backgrounds across the reference eras).
- **Contents: zero plates instanced.** Which areas have
  plates, each plate's artwork, and every version chain
  are production work under the art lanes' gates — this
  spec fixes the registry shape and the selection rule so
  plates, once made, are wired pieces and not loose files.
  The living-background versions' contents belong to the
  background programme, not to this teardown.
