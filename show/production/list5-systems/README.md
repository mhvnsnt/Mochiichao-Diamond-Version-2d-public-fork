# LIST-5 TEARDOWNS — items 37–46 (encounters, capture, growth, presentation)

Ten teardowns from Jamar's List 5, built as native Mochiichao
systems: studied from public documentation of how creature-collector
games and creature-catcher anime structure these things, written as
our own specs, schemas and formats — **staged repo-ready and wired**
into the systems that already exist (core data, Lists 1–2 teardown
packages, DESIGN-PRINCIPLES state grammar, the species sheets, the
show's house script format). Method law throughout: canon fills what
canon covers, gaps are flagged OPEN/TBD in the data itself, nothing
is invented to make a spec look complete. Story hooks in #44 are
labelled PROPOSAL everywhere they appear — they are not canon.

| # | System | Doc | Machine-readable |
|---|---|---|---|
| 37 | Rival team construction | `37-RIVAL-TEAM-CONSTRUCTION.md` | `rival-encounter.schema.json` |
| 38 | Capture mechanics | `38-CAPTURE-SYSTEM.md` | `capture.schema.json` |
| 39 | Training structures | `39-TRAINING-SYSTEM.md` | — (extends learnset/evolution shapes; adds no store) |
| 40 | Regional variant systems | `40-REGIONAL-VARIANTS.md` | `regional-variant.schema.json` |
| 41 | Mythical presentation grammar | `41-MYTHICAL-PRESENTATION.md` | — (show format; axis field proposed for sheets) |
| 42 | Transformation sequences | `42-TRANSFORMATION-SEQUENCES.md` | — (show format on DESIGN-PRINCIPLES §E) |
| 43 | Creature scale systems | `43-SCALE-CHART-SYSTEM.md` | — (consumes cast.json size class; adds chart format) |
| 44 | Fossil / extinct revival | `44-EXTINCT-REVIVAL.md` | — (hooks = PROPOSAL; system fields only) |
| 45 | Tournament / dojo circuit | `45-DOJO-CIRCUIT.md` | — (consumes route graph + event flags) |
| 46 | Lab exposition systems | `46-LAB-EXPOSITION.md` | — (show script format; house blocks) |

## The wiring, in one paragraph

A rival encounter (#37) is a *party built by grammar* whose members
are rolled from the same spawn tables (#7) and whose stakes are paid
in the circuit's currency (#45). Capture (#38) is the moment an
encounter becomes a bond: it reads the species' `catchRate` from core
data and writes the discovery state the completion loop (#14) counts.
Training (#39) is how a kept Mochi's learnset and growth edges (#8)
advance between encounters. A regional variant (#40) is a species
record wearing a deeper delta than lustre — it composes *under* the
palette map, never instead of it. On the show side, the same cast is
staged by class (#43), transformed by the state grammar (#42),
mythicals are presented on their own axis (#41), the lab is where
the world explains itself (#46), and the extinct (#44) are the one
class the Mochiioteca cannot complete by walking — by design.

## Coverage summary (details in each doc)

- **Architectures: fully documented publicly.** Party grammar,
  capture probability curves, effort-training ledgers, form-delta
  records, bracket progression, lab-reveal scene grammar — all are
  standard, publicly documented patterns; no spec here rests on a
  guess about how the reference systems work.
- **Contents: exactly as complete as canon is.** Canon fixes the
  Region 1 spine (8 dojos → Elite Four → Champion Hex), the five
  starters, the state ladder, the size ladder, and `catchRate` as a
  core field. It does not fix capture-device fiction details, any
  training numbers, any variant instances, any mythical roster, or
  any extinct species. Those are OPEN slots or PROPOSALs in the
  files themselves — the package's completeness claim is about
  *shape and wiring*, and each doc says so in its coverage section.
