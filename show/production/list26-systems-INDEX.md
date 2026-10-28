# LIST 26 TEARDOWNS (items 247–256) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list IS the
order, 2026-10-27). Same standard as Lists 1–25: public
documentation / open sources → **native** Mochiichao
specs/formats, staged repo-ready **and wired** to the systems
already built. No copied game assets or text; the only data
carried over is publicly documented *formula shape* — which
is exactly what this list was commissioned to carry.

**This is the FINISH-THE-BASE list.** It is built under the
owner's POKÉMON-BASE RULE (2026-10-27, the refinement of the
gap-filling rule): everything stands on the full Pokémon
base; gaps in mechanics are filled the way Pokémon does it;
Jamar's canon sits on top and overrides where it speaks;
owner flags remain ONLY for story/canon facts. So this list
behaves differently from its predecessors on purpose: where
Lists 3–25 specified shapes and left constants PROPOSED or
matchups unasserted, List 26 **asserts the documented
arithmetic** — the damage formula, the filled type chart,
the stage tables, turn order, weather effects, prize money,
escape odds, encounter rates. The one place the fill stops
is the one place the base rule itself stops: canon
vocabulary (#249's unseated Frost/Venom labels) — a story
fact, flagged in the open as hole H3.

**Built under the REAL-CODE WIRING LAW (Jamar, 2026-10-27):**
every cross-reference below was read in the earlier
packages' own files before being cited (#17's pipeline and
its PROPOSED register, #47's field vector, #61's weather
vocabulary, #112's repel fragment and its OPEN semantics,
#7's spawn-table schema, #132's write boundary, #20's
faucets, #10's command ring — all verified in place).
Where a target could not be verified, the spec says so
in-line and STAGING.md registers it as an **UNVERIFIED
TARGET** — a gap flagged, never a path invented.

| # | File | Yield in one line |
|---|---|---|
| 247 | `247-BASE-COMPLETENESS-AUDIT.md` + `audit-fragment.json` | The sweep: every core base system mapped to where Mochiichao keeps it (present / filled here / data debt), and the seven true remaining holes named — side conditions, switching-as-a-system, the element-vocabulary reconciliation, the temperament mapping, the registry's landed home, the calendar, terrain contents |
| 248 | `248-BATTLE-DAMAGE-FORMULA.md` + `damage-fragment.json` | The full documented arithmetic over #17's pipeline: stat formula (base/variance/effort/temperament seats), the base term, and the chain — STAB 1.5, chart product, field, crit 1.5, burn 0.5, spread 0.75, variance 0.85–1.00 last; #17's PROPOSED constants closed |
| 249 | `249-TYPE-EFFECTIVENESS-CHART.md` + `type-effectiveness-fragment.json` | The filled chart in #17's format: 85 triples — 56 transposed from each type's nearest Pokémon analogue, 29 authored for Core/Silk/Wind (marked); supersedes List 3's zero-asserted stance for the contents, in writing |
| 250 | `250-STAT-STAGES-ACCURACY.md` + `stages-fragment.json` | The stage tables locked: stat multipliers (2/(2−s) … (2+s)/2), the accuracy/evasion thirds table, crit rates 1/24 → always; stages as battle-only state, reset on switch, announced through #10's queue |
| 251 | `251-PRIORITY-TURN-ORDER.md` | Who acts first: switch commands, then bag, then moves by priority bracket (−7…+7, move data) → effective Speed → #94's seeded draw; reversal is a #47 room-record flag, never machinery |
| 252 | `252-WEATHER-BATTLE-EFFECTS.md` + `weather-effects-fragment.json` | Per-state battle effects for canon's actual vocabulary: RAIN (Aqua ×1.5 / Flame ×0.5), STORM (rain + the storm-true accuracy seat), FROST (1/16 chip; exemption list empty by named cause), CLEAR/OVERCAST/MIST neutral, NONE = no slot at all in the depths |
| 253 | `253-PRIZE-MONEY-REWARDS.md` | Payout = classBase × final opponent's level (Ranger battles only — wild battles pay nothing); losing pays `lossBase × highest own level` (capped at held) and wakes at the last centre; versus/facilities/rentals pay no money, matching #177's exclusions |
| 254 | `254-ESCAPE-FLEEING.md` | The documented escape arithmetic `((A×128/B) + 30×attempts) mod 256`, horde `B` = fastest opposing Speed; guarantee/trap as ability/item data seats; no escape from Ranger battles — the RUN command is absent, not greyed |
| 255 | `255-ENCOUNTER-RATE-PACING.md` + `encounter-rate-fragment.json` | `encounterRate` proposed into #7's schema (defaults: grass/cave 0.10, surf 0.05, fish = #111's), pacing classes as authored data that never adapts, and the repel floor **resolved** party-relative with the #52 reconciliation written out; roll composition order fixed |
| 256 | `256-CENTRE-SERVICES-FLOW.md` | The centre visit as one five-step flow (arrive → heal → storage access → seated services → depart), identical in every centre over #132's boundary; regional skin on top, custody never here (daycare stays in #77's Garden housing) |

Shared conventions: format ids are `mochiichao/<name>/v1`;
display names are always lookups under the display-layer
naming law; anything countable is derived at read time,
never stored (#14/#96 law); proposals into another
package's file land only in that file, with citation (the
#58 `RIDDEN` precedent); OPEN means the owner decides —
and after this list, OPEN survives only where the base
rule says it should: story and canon facts.
