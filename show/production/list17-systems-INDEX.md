# LIST 17 TEARDOWNS (items 157–166) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list IS the
order, 2026-10-27). Same standard as Lists 1–16: public
documentation / open sources → **native** Mochiichao
specs/formats, staged repo-ready **and wired** to the systems
already built. No copied game assets, data tables, or text.
Canon is never invented — every spec names its open slots, and
owner decisions land OPEN.

**This is the BATTLE-AND-FIELD list.** Lists 1–16 built the
world, its data, and its battle machinery for the standard
case: one Ranger, one opponent, one active Mochi per side.
List 17 covers everything that bends that case — more
combatants (#157), more opponents (#158), borrowed teams
(#159), a partner who helps outside battle (#160), records
that wait on measurements the canon data doesn't have yet
(#161), the care service that lives outside the centres'
boundary (#162), the habitats that are withheld on purpose
(#163), repeatable work below story rank (#164), the bag as
a battle command (#165), and what the wild carries (#166).

**Built under the REAL-CODE WIRING LAW (Jamar, 2026-10-27):**
every cross-reference below was checked against the actual
earlier packages before being cited (formats, class tables,
flag namespaces, schema fields, and fragments verified in
this workspace; List 16's landed specs read for #151/#152 —
its STAGING/README did not exist yet at this build and are
registered as such in STAGING). Where a target could not be
verified, the spec says so in-line and STAGING.md registers
it as an **UNVERIFIED TARGET** — a gap flagged, never a path
invented.

| # | File | Yield in one line |
|---|---|---|
| 157 | `157-MULTI-BATTLE-FORMATS.md` + `multi-battle-fragment.json` | Doubles/multi as a #109 ruleset plus a sides block (slots × controllers): clauses and validation inherited per entrant, targets resolved per-target through #17 unchanged, partner AI = #18's stack under partner constraints — game lane only, by doctrine |
| 158 | `158-HORDE-BATTLES.md` | Hordes as roll-time composition over #7's existing rows (eligibility is a proposed table-level slot; a horde stocks only what the table stocks), #157 geometry + #18 `wild`, and #38's capture given its thin-then-take legality rule; the absent experience system is named, not faked |
| 159 | `159-RENTAL-BATTLES.md` + `rental-fragment.json` | Rental snapshots under #86's draft/swap slots: #80-shaped, #94-generated, living only inside the run record — no roster write, no #106 location, no honours/tallies/kept state for the borrowed species; total expiry at run end; the #109 validator exception registered openly |
| 160 | `160-FIELD-PARTNER-AI.md` + `field-partner-fragment.json` | The #58 follower grown helpful with no new states: assistance as REACT trigger classes (sign / find / danger) proposed into #58's vocabulary, perception shaped by #152+#108, under the standing boundary — sets no flags, collects nothing, reads nothing for the Ranger |
| 161 | `161-SIZE-RECORDS.md` + `size-records-fragment.json` | Size records as derivation over append-only measurement facts (the #97 stored-fact class) plus specimen/fishing contest grammar — shipped as shape only, instancing NOTHING, because height/weight are TBD for all 49 Gen 1 species and no measurement exists to record |
| 162 | `162-GROOMING-SPA.md` | Grooming defined by its two permitted writes (an inert null-axis careLog event in #28's shape; a transient proposed `presentation.groomedUntil`) and its exhaustive non-writes — no axes, no effort, no bond, no cures — with the Garden/centre/groomer boundary in one table |
| 163 | `163-MYTHICAL-HABITAT-SEALING.md` + `sealing-fragment.json` | The withholding discipline as data: a sealed habitat record with nothing in it to leak (no area, no row, no coordinates), per-consumer behaviour for #7/#102/#137/#84/#90, NO unseal operation by construction, and the depths clause as law — the verified-empty depths table stays empty |
| 164 | `164-MISSION-BOARD.md` + `mission-fragment.json` | Repeatable Ranger work as templates + derived acceptance facts (no quest-log store), a closed task-kind vocabulary, and a rank fence below #138: missions never set spine/circuit/capstone flags, never gate a connection, and never pay in power (#56) |
| 165 | `165-BATTLE-BAG.md` + `battle-bag-fragment.json` | The bag as a peer command in #10's ring: reachability read verbatim from #31's `useContext.battle`, depletion at resolution, capture attempts as bag commands (#38, with #158's command-time legality), and AI symmetry via a proposed per-class `bagAccess` flag on #18's table (values OPEN; `wild: none` is structural) |
| 166 | `166-WILD-DROP-TABLES.md` + `drop-tables-fragment.json` | One drop row per species with two reads — encounter generation fills the wild individual's held slot (the slot #109's validator already reads); battle end transfers by channel (kept: stays held; defeat: to the bag) — under the hard rule that nothing drops that #31 doesn't hold, and no key item ever drops |

Shared conventions: format ids are `mochiichao/<name>/v1`;
display names are always #23 lookups; anything countable is
derived at read time, never stored (#14/#96 law); proposals
into another package's file land only in that file, with
citation (the #58 `RIDDEN` precedent); OPEN means the owner
decides, and an open slot never holds a package.
