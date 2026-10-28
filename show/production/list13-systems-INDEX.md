# LIST 13 TEARDOWNS (items 117–126) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list IS the
order, 2026-10-27). Same standard as Lists 1–12: public
documentation / open sources → **native** Mochiichao
specs/formats, staged repo-ready **and wired** to the systems
already built. No copied game assets, data tables, or text.
Canon is never invented — every spec names its open slots, and
owner decisions land OPEN.

**Built under the REAL-CODE WIRING LAW (Jamar, 2026-10-27):**
every wiring claim below was checked against the actual
evidence — the repo audit in `species-data-system/
AUDIT-WHAT-EXISTS.md` (read-only, against `main`), the earlier
teardown packages' real schemas and fragments, and this
workspace's files. Where a target could not be verified from
those sources, the spec says so in-line and STAGING.md
registers it as an **UNVERIFIED TARGET** — a gap flagged,
never a path invented.

| # | File | Yield in one line |
|---|---|---|
| 117 | `117-FIELD-TECHNIQUES.md` + `techniques-fragment.json` | Rare Moves as playable overworld techniques: a registry joining the machine registry's Rare class to #12's `tech.*` flags and #11's `technique` gates. Illuminate is the only canon-named technique; the roster is OPEN |
| 118 | `118-SHOP-SYSTEM.md` | Shop architecture: stock as data over #31 item ids, prices stay on the item record (#20), availability derived from #12 progress flags at read time. Every inventory OPEN |
| 119 | `119-INTERIOR-AREAS.md` | Interior layout grammar: room sub-graphs hanging off #11 nodes, #59 gates placed in rooms, sight-line encounters referencing #30 records, #99 hideout beats as the event layer above the rooms. Zero interiors instanced |
| 120 | `120-CUTSCENE-STAGING.md` | In-engine cutscene format: a closed cue vocabulary that reuses #21 camera records verbatim, #12's pointer-only dialogue rule, and #2 cry parameters. Camera and text are never re-invented inside a scene |
| 121 | `121-ACCESSIBILITY.md` | Game-lane accessibility options: colour-vision modes constrained by #27's reserved-ink law, text scaling over #23 rendering, input remapping, and a game subtitle standard explicitly distinct from the show's silent-film law |
| 122 | `122-NEW-GAME-PLUS.md` + `ngplus-fragment.json` | NG+ as a disposition table over #96's save sections — every section ruled persist / reset / re-derive. **The mode itself is PROPOSED, not canon**; roster disposition is the owner's call, options and consequences spelled out |
| 123 | `123-MOUNT-TRAVERSAL.md` | Riding partner Mochi: eligibility derived from #43 size class + sheet anatomy (anatomy-variance doctrine), never from a move. Zero eligibility lists asserted; the #58 state-vocabulary extension is flagged, not taken |
| 124 | `124-EVENT-ROTATION.md` | Daily/weekly rotation as a deterministic function over #19's clock, writing #96 `world` schedule overrides, announced via #90. The calendar (day kinds) is still unruled — the mechanism ships, the fixtures wait |
| 125 | `125-FAST-TRAVEL.md` + `fast-travel-fragment.json` | Fast travel as a derived set over #11's route graph: eligible = travel-point node + prior-arrival evidence (the same evidence #32's map reveal derives from). Nothing stored; sequence-breaking impossible by construction |
| 126 | `126-HALL-OF-FAME.md` + `hall-of-fame-fragment.json` | Champion team records written at #100's capstone clear: id-keyed snapshots under the standing derived/rendered archive — history that stays rename-safe because names render by #23 lookup, never stored strings |

Shared conventions: format ids are `mochiichao/<name>/v1`;
display names are always #23 lookups; anything countable is
derived at read time (#14/#96 law); OPEN means the owner
decides, and an open slot never holds a package.
