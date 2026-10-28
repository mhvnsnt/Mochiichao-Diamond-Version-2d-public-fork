# WORLD-SYSTEMS TEARDOWNS — List 2, game-world cluster (Sideline G)

Five teardowns from Jamar's List 2, built as native Mochiichao
systems: studied from public documentation and the open community
decomp projects (pret family), written as our own specs, schemas and
data — **staged repo-ready and wired** into the systems that already
exist (core data, LIVING-WORLD, the species sheets, the dialogue
kit). Method law throughout: canon fills what canon covers, gaps are
flagged OPEN/TBD in the data itself, nothing is invented to make a
table look complete.

| # | System | Doc | Machine-readable |
|---|---|---|---|
| 7 | Encounter / spawn tables | `SPAWN-TABLES.md` | `spawn-table.schema.json`, `garden-complex.spawn-tables.json` (canon seed rows, verbatim), `dark-forest.spawn-tables.json` (surface prose-only; depths OPEN/empty) |
| 8 | Evolution data structures | `EVOLUTION-DATA-MODEL.md` | `evolution.schema.json`, `evolution-edges.wave1.json` (64 edges / 60 lines, parsed from the confirmed sheets) |
| 11 | Route / gate graph | `REGION1-ROUTE-GRAPH.md` | `region1-route-graph.json` (Region 1: canon places, canon spine, open slots open) |
| 12 | Event / flag architecture | `EVENT-FLAG-ARCHITECTURE.md` | `event-flag.schema.json` (flags, conditions, effects, dialogue-kit pointers) |
| 14 | Completion systems | `MOCHIIOTECA-COMPLETION.md` | — (consumes the canon dex registry's rules; adds no data) |

## The wiring, in one paragraph

The route graph's gates test the event system's flags; the event
system's encounters roll the spawn tables; spawn tables feed the
discovery states the completion loop counts; evolution edges reuse
the event system's condition shape; the show's LIVING-WORLD
population reads the spawn tables' habitat classes through its P2
roster binding. Species ids, place ids and flag ids are spelled the
same way in every file in this package and match the core data /
canon map they came from — one world, one vocabulary, five small
systems that point at each other instead of duplicating each other.

## Coverage summary (details in each doc)

- **Architectures: fully documented publicly** — all five systems'
  shapes are standard, decomp-documented patterns; no spec here
  rests on a guess about how the reference systems work.
- **Contents: exactly as complete as canon is.** Spawn contents are
  seed-stage (13/49 species); evolution numbers are zero by design
  pending the owner's canon lock; route thresholds are flagged
  inference or open; reward contents are open owner decisions. The
  package's completeness claim is about *shape and wiring*, and each
  doc says so in its own coverage section.
