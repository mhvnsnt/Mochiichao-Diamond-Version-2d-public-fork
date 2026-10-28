# LIST 11 TEARDOWNS (items 97–106) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list IS the
order, 2026-10-27). Same standard as Lists 1–10: public
documentation / open sources → **native** Mochiichao
specs/formats, staged repo-ready **and wired** to the systems
already built. No copied game assets, data tables, dialogue,
or text. Canon is never invented — every spec names its open
slots, and owner decisions land OPEN.

| # | File | Yield in one line |
|---|---|---|
| 97 | `97-RESEARCH-TASKS.md` + `research-tasks-fragment.json` | Per-species Mochiioteca research levels: a closed task vocabulary (observe / feed / battle-witness / track / care) whose tallies are stored *facts* and whose levels are **derived at read time**, extending #14 without duplicating it |
| 98 | `98-RANGER-LICENCE.md` + `licence-fragment.json` | The league progression record: the Ranger licence (identity + derived standings only) and the Fragment case (a render of #12 `progress.*` flags — Fragments derived, never stored, per #12/#45) |
| 99 | `99-SYNDICATE-ENCOUNTERS.md` | Region 1 Syndicate encounter system: grunt pools scaled by story-flag tier and area band (never by party state), authored admin set-pieces in the #37/#30 grammar, and a hideout event grammar on #12 flags. Dojo 8 boss name stays OPEN |
| 100 | `100-CHAMPION-GAUNTLET.md` + `gauntlet-fragment.json` | The Elite Four run as one `sequence_clear` set (Umi/Gin/Hono/Yoru) with typed heal gates between bouts, Champion Hex as the #37 chain terminus, and a rematch ladder housed in #87 records |
| 101 | `101-MOVE-TUTORING.md` | Move tutoring in both lanes, kept distinct: game-lane tutor NPC records + cost model on the #20 economy / #31 items, and the show-lane training grammar (observe → attempt → fail-forward → mastery) the two-lane doctrine requires |
| 102 | `102-HABITAT-RANGE-MAPS.md` + `range-map-fragment.json` | Per-species distribution cartography **generated** from the #7 spawn tables joined to #29 ecology zones over the #11 route graph — never hand-authored data; the Dark Forest depths render unsurveyed, not empty |
| 103 | `103-ITEM-CRAFTING.md` + `crafting-fragment.json` | A recipe layer over the #31 item registry (the `material` category is its home): recipes reference item ids only, can never output or reclassify a move, and "fusion" of individuals is refused in writing — that word belongs to #8's owner-decided pair-merge |
| 104 | `104-INDIVIDUAL-HONOURS.md` + `honours-fragment.json` | Per-Mochi ribbons/medals: stored honour stamps on the **individual** record (#80), accrued from Garden care (#28), showcase (#78), and battle records — architecturally distinct from #69's player achievements, which are derived predicates over Ranger state |
| 105 | `105-FESTIVAL-CALENDAR.md` + `festival-fragment.json` | Seasonal festivals as recurring windows on the #19 world clock: announcement (#90) → gathering (#93 overrides) → activity (#56/#78) → closing beat. Time-locked means *when*, never *hurry* — #56's no-pressure law applied to the calendar |
| 106 | `106-MOCHI-STORAGE.md` + `storage-fragment.json` | Keeping / organising / releasing individuals: one individual record, one location field (party / Garden / storage), views derived never stored, story-locked individuals unreleasable (#68's lock reused verbatim), and release modelled honestly — permanent, tombstoned, and it never un-completes the dex (#14) |

**Cross-package wiring at a glance:** #97→#14 completion +
#28/#39 care + #89 tracking + #9 battle-witness; #98→#12 flags +
#30/#45 circuit records + #23 display lookups; #99→#52 balance
law + #37/#30 encounter grammar + #93 patrol schedules + #94
grunt-party generation constraints; #100→#45 gauntlet spine +
#30 tiers + #87 rematch + #12 `story.champion_defeated`;
#101→moves registry (PR #366) + #20 economy + #31 items + show
training grammar; #102→#7 + #29 + #11 + #32 map module;
#103→#31 item layer + #20 economy + #8 pair-merge boundary;
#104→#80 individual record + #28 careLog + #78 showcase + #68
provenance precedent; #105→#19 world clock + #90 media + #93
schedules + #56/#78 activities; #106→#80/#96 roster + #68 locks
+ #14 kept-state permanence + #58 roster-binding.

**Nothing here is TeraBox-class.** All files are Markdown +
JSON, repo-sized (see STAGING.md).
