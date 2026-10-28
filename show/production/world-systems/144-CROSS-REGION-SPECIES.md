# #144 — CROSS-REGION SPECIES & MIGRATION → one species, many regions

**Seat in the doctrine:** a connected world reuses its
creatures. The same species lives in Region 1 and Region
3; some species *move* — seasonally, visibly. Both facts
must hold without ever forking the species: #127 already
ruled the dex is one store with regional views. This spec
is the species-side of that ruling: how presence across
regions is represented (derived, like everything else in
this programme), how the *exception* (a genuinely
different regional form) is expressed, and how migration
is staged on machinery that already exists.

**What was studied.** Cross-region species in the publicly
documented record: shared rosters across the two-region
games (the same record, encountered in both), regional
forms as the celebrated exception (a species whose
regional population differs in type/look — expressed in
the data as a form of the one species, never a second
species), and migration/roaming as timed presence (a
species' table entry exists only inside a window). The
kit taken: presence is a *projection*, difference is a
*delta*, movement is an *overlay* — three derived shapes,
zero new stores.

## The three shapes

1. **Presence (the rule) — derived from #102.** Range
   maps already are a reverse index over #7 spawn tables
   + #29 ecology, projected over #11 areas. Grouping that
   projection by region yields, per species, its region
   set — no field is added to any species record, and the
   core data's one-record-per-species shape (verified in
   the audit: `species.json` + range/dex layers over it)
   is untouched. A species "in three regions" is a
   sentence the projection says, not a fact someone
   maintains. Regional dex sections (#127) are this same
   projection read from the region's side.
2. **Regional variants (the exception) — #40's delta
   records, unchanged.** Where a regional population
   genuinely differs, #40 already carries it: a delta
   record against the base species, listing only what
   changes; identity locks (silhouette primitive,
   signature motif) never change; a variant never re-files
   the species. Composition order stands (#57): base →
   regional variant → habitat variant → lustre. This spec
   adds one sentence to #40's law, proposed in STAGING
   for #40's own file: a variant record names the region
   it belongs to, so the projection in (1) can render it
   as that region's face of the species.
3. **Migration (the movement) — #113 overlays, paired.**
   A migration is two #113 swarm overlays sharing a
   window and a species: presence *leaves* area set A and
   *arrives* in area set B (which may cross a region
   border — the overlay mechanism is area-keyed and
   region-blind, verified in #113's shape). This spec
   defines the pairing convention — `{migrationId}` on
   both overlays, departure/arrival roles, the window
   from #19's clock via #124's rotation — and instances
   none. Announcements ride #90's `spawn_report` under
   its standing rule (never naming an unmet species).
   Roaming *individuals* are #114's system and stay
   there; migration is populations, not persons.

**Encounter consequences, stated once:** meeting a
species in any region sets the same global `seen`/`met`
bits (#96/#14) — the dex does not care where you met it,
and neither does completion. What a region's *view*
shows is where its section says the species lives
(#102), including "lives here only in migration windows,"
which is a rendering of (3), not a fourth state.

## Wiring

Presence joins #102/#7/#29/#11; variants join #40/#57;
migration joins #113/#124/#19/#90; dex consequences join
#14/#96/#127; climate fit for a range (why a species
lives where it lives) reads #142's records; border-zone
gradient tables (#140) are this system's nearest
neighbour — a gradient is authored presence, not a
migration, and the two must not be conflated at landing.

## Coverage — honest

- **Architecture: fully specified** (three derived
  shapes; one proposed sentence for #40's file, flagged
  as a proposal to its owner, not taken here).
- **Instances: none asserted.** Which species are
  cross-region, which carry variants, and every migration
  — all OPEN content, owned by each region's design and
  the design lane's wave work. In particular this package
  does not extend any Gen 1 species' range beyond what
  #102's canon-seeded projection already says (13/49
  habitat-seeded at audit — the projection is sparse
  because the data is, and this system preserves that
  honesty rather than papering over it).
