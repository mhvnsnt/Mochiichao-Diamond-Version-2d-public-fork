# LIST 4 TEARDOWNS (items 27–36) — systems cluster

Same standard as Lists 1–2: public documentation / open sources →
**native** specs and formats for Mochiichao, staged repo-ready
and wired into the existing systems. No copied game assets, data
tables, condition/item names, or card art — architectures only,
re-expressed in our own shapes. Where canon is silent, the slot
ships **OPEN / null**, flagged — never silently filled.

| # | Item | File(s) | One-line yield |
|---|---|---|---|
| 27 | Status/ailment systems | `STATUS-SYSTEM.md` + `schemas/status-condition.schema.json` | Two-class (persistent/volatile) condition record + shape/colour/tag icon grammar; roster and all numbers OPEN |
| 28 | Chao-style care/raising | `GARDEN-RAISING-SYSTEM.md` + `schemas/care-profile.schema.json` | Per-individual care profile (5 axis slots, alignment, drives, staged growth reads) over the repo's existing garden poses/palettes; log is truth, profile derived |
| 29 | Habitat/biome ecology | `ECOLOGY-TABLES.md` + `schemas/ecology-table.schema.json` + `examples/region1.ecology.json` | Per-region ecology join (species × habitat × area × time) feeding #7 spawn tables and the show's P2 binding; Region 1 instanced from canon only |
| 30 | Dojo/boss structure | `DOJO-ENCOUNTERS.md` + `schemas/dojo-encounter.schema.json` + `examples/region1-dojo-circuit.json` | Scripted leader-encounter record (script pointers, party slots, signature slot, Fragment flag wiring); full R1 circuit instanced with all contents OPEN, Dojo 8 name OPEN |
| 31 | Item architecture | `ITEM-DATA-LAYER.md` + `schemas/item.schema.json` | Flat item registry (closed category vocabulary, effect→system joins, cure/care consistency checks); schema-enforced separation from General/Rare move classes |
| 32 | World-map/minimap | `MOCHIIOTECA-MAP-MODULE.md` + `schemas/map-reveal.schema.json` | Mochiioteca map data+behaviour: derived unreached/reached/known reveal states joining route graph + ecology; device physical design stays OPEN |
| 33 | Human sheet systems | `HUMAN-MODEL-SHEET-STANDARD.md` | 9-section human model-sheet standard (turnaround → device interaction) on the distinct human track, with gate checks H-1/H-2; builds from repo `docs/human-characters/` under the likeness law |
| 34 | Eyecatch/bumper grammar | `EYECATCH-FORMAT.md` | Castable eyecatch record formalising LIVING-WORLD §1.3/§2.3 (BANK `BR-*` + device frame, A/B pair rule, no Forest eyecatch — ever) |
| 35 | Toyetic constraints | `TOY-READ-TEST.md` | Proposed gate addition **G-13 TOY-READ** (palm read / ≤5 colour blocks / no fragile reads / face at 2 m), running as a reported PROCESS.md step-4 check until adopted |
| 36 | Card frame grammar | `MOCHI-CARDS-SPEC.md` + `schemas/mochi-card.schema.json` | "Mochi Cards" (canon display name) frame anatomy + join-only card record — stats/type/art join from species data at print time; set/rarity/rules OPEN |

**Wiring summary** — #29 habitat classes must contain every #7
slot class (mechanical check); #27 `cureBy` ⇔ #31 status items
(bidirectional data check); #31 care effects → #28 activities;
#28 residents are `kept` creatures (#14 states), never spawns;
#30 rewards set #12 `progress.*` flags and Fragment counts stay
derived (#12/#14); #32 reveal states derive from #12 flags over
#11 graph nodes + #29 zones; #34 casts from the LIVING-WORLD
BANK and reserves slots in the #16 xsheet timing; #35/#36 both
consume the same approved art and silhouette discipline as the
design gate (G-1/G-2) and the #15 lustre system.

**Coverage, one line** — every *architecture* here is fully
publicly documented; almost every *content* is canon-silent and
ships OPEN by design. Per-item honesty notes are in each doc.
