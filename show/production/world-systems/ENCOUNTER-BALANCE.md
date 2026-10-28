# 52 — ENCOUNTER BALANCE TABLES (opponent level-scaling)

Teardown List 6, item 52. Native format for Jamar's Mochiichao
game lane. Sources: publicly documented level-scaling practice in
creature-collector RPGs (curve families and table structures as
documented in public game-data references), re-expressed as an
original format. **Canon sets almost no numbers in this domain**
(base stats are owner-TBD across the roster), so this teardown
delivers the *table format and curve vocabulary* — every value cell
is OPEN until the owner locks stats. A format with honest empty
cells beats invented balance.

Pairs with: SPAWN-TABLES.md (List 2 #7 — *which* species, *where*),
EVENT-FLAG-ARCHITECTURE.md (progress flags — the scaling inputs),
47-BATTLE-FIELD.md (field modifiers multiply through these curves).

---

## 1. Teardown — how opponent scaling is structured

- **Wild encounters scale by area band, not by player.** The classic
  structure: each area carries a level *range*; the rolled level is
  drawn from the band. The player's progress moves them to new
  bands; the band never reads the player's team. (Keeps the world
  honest; rubber-banding is a different, later invention.)
- **Set-piece opponents (rivals, dojo masters) scale by progress
  checkpoints.** Documented trainer data is keyed to story progress:
  the same rival is a *table of teams*, one row per encounter, each
  row gated by a progress flag — levels and team size step at the
  flags, not continuously.
- **The growth curve is a separate, per-species fact.** XP/level
  curves (the documented families: fast / medium / slow and their
  variants) belong to species data, not to encounter tables; the
  encounter system only ever *outputs a level*.

## 2. Native format

### 2.1 Wild band table (extends the spawn-table instance shape)

One row per (area, method) — joins SPAWN-TABLES on `mapId + method`:

```
{ mapId, method,
  level_band: { min: OPEN, max: OPEN, curve: "flat" | "bell" | OPEN },
  party_level_reference: null        // wild bands NEVER read party state (law B1)
}
```

`curve` vocabulary: `flat` = uniform in band; `bell` = weighted to
band centre (the common documented behaviour for encounter rolls).
Default until owner rules otherwise: **unset = OPEN**, not flat —
no silent default.

### 2.2 Set-piece scaling table (rivals / dojo / Elite)

```
{ encounter_id,                 // stable id
  rows: [ { gated_by: <progress.* flag id>,   // EVENT-FLAG namespace
            team: [ { species_id, level: OPEN, moves: [ids] | "learnset@level" } ],
            field: <battle-field condition id | null>   // #47 hook
          } ] }
```

Rows are cumulative canon: each flag-gated row is a distinct,
authored team (Hex's rows step at the story flags canon already
sets). **No interpolation between rows** — an ungated state uses the
highest unlocked row (law B2).

### 2.3 Player-side curve registry (format only)

```
growth_curve_id ∈ { "swift", "steady", "deep" }   // native names, OPEN set
species sheet field: growth_curve: <id | TBD>
```

Curve *shapes* (XP per level formulas) are **OPEN — owner/design
decision**; the format only fixes that a species names exactly one
curve and the registry holds the definitions in one place.

## 3. House laws for this system

- **B1 — Wild honesty.** Wild bands never read party level, badges,
  or playtime. If an area should feel harder later, that is a new
  band gated by a story flag, authored openly (e.g. post-incident
  Forest surface) — not a hidden multiplier.
- **B2 — No interpolation.** Set-piece difficulty is authored rows,
  not formulas. The owner can read every fight that exists.
- **B3 — Levels are the only output.** This system never touches
  stats, moves, or species data; it emits (species, level) pairs
  into the encounter/battle systems.
- **B4 — Two-lane.** The show lane ignores these tables (show
  battles are autonomous-action, Battle Doctrine); the *characters'*
  relative strength reads in the show come from canon, not curves.
  Game-only system, flagged as such so nobody wires it into a board.

## 4. Worked structure (no numbers — the shape, filled)

Region 1 skeleton: Boot Harbor / Route Topaz bands = OPEN rows on
the existing spawn instances; Dark Forest surface band exists as a
row (wild Kittember canon) with band OPEN; depths = **no row** —
canon does not stock the depths (consistent with G's empty table).
Dojo rows: 8 dojos × gated_by `progress.fragment_<n>` — team
contents OPEN (masters canon, teams unruled). Champion Hex: final
row gated by `progress.elite_four_clear` — flag name PROPOSED.

## 5. Wiring points

- `src/data/core/encounters/` beside the spawn-table instances
  (world-systems STAGING homes); set-piece tables beside the route
  graph (`src/data/core/routes/`).
- Inputs: EVENT-FLAG `progress.*` flags; outputs consumed by the
  battle system beside BATTLE-UI-FLOW's game-side implementation.
- Blocked-by: owner stat locks (Sideline A TBD-REGISTER carries the
  base-stat decisions). This format lands now; its cells fill when
  stats do.

## 6. Coverage notes

The two-pattern structure (area bands for wild, flag-gated authored
rows for set-pieces, per-species growth curves) is uniformly
documented public practice — high confidence. Everything numeric is
OPEN because canon has set almost none of it; that is the project's
real state, recorded rather than papered over. Curve *names* are
native coinages; the underlying families are the documented ones.

**Early-arrival class declaration (#139, landing 2026-10-27):** encounter bands are WORLD-OPEN under #139's two-class rule — fully live from the moment of arrival, reading presence + world state, never story progress; no scaling, ever (this doc's law B1 is the early-arrival law). The ruling layer is `src/data/core/docs/139-EARLY-DISCOVERY.md`.
