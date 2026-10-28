# STAGING — List 26 (items 247–256)

All ten yields are text specs (Markdown + JSON fragments,
measured at build close — see the package inventory in the
build report). **Nothing is TeraBox-class; nothing was
downloaded or staged locally** (workspace staging rule —
local disk is the workbench; these land in GitHub with the
other teardown packages, through the side lane's PR flow).

**Real-code wiring law applies to every step below**
(standing, 2026-10-27): before wiring, the landing lane
audits the actual repo for what exists — real files, real
schemas, real paths — and wires into THAT. The paths and
joins named here are the *proposed* homes and the *intended*
connections, written from verified workspace evidence (the
earlier teardown packages, Lists 1–25, where present). Where
a target could not be verified from those sources, it is
registered below as an **UNVERIFIED TARGET** — the honest
landing for those steps is the spec plus the gap flagged in
the PR body, never invented glue presented as wired. Every
landing PR report names the real files it touched and what
changed, and — per the owner's newest working rules — reports
in plain words, clearly separating what is done from what
genuinely needs Jamar himself.

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths (game repo, show-inside-repo layout)

| File | Proposed home |
|---|---|
| `247-BASE-COMPLETENESS-AUDIT.md` + `audit-fragment.json` | `show/production/` research docs (beside the Lists 1–25 packages it maps — the audit lives with what it audits) |
| `248-BATTLE-DAMAGE-FORMULA.md` + `damage-fragment.json` | `show/production/battle-presentation/` (beside #10's flow and #17's type-system home — the battle arithmetic shelf) |
| `249-TYPE-EFFECTIVENESS-CHART.md` + `type-effectiveness-fragment.json` | with #17's `TYPE-SYSTEM.md` (the chart's format home; the fragment lands as the filled contents of #17's `type-chart-fragment.json` shape — see step 2) |
| `250-STAT-STAGES-ACCURACY.md` + `stages-fragment.json` | `show/production/battle-presentation/` (beside #248 — the arithmetic shelf) |
| `251-PRIORITY-TURN-ORDER.md` | `show/production/battle-presentation/` (beside #10's flow — it is #10's missing order clause) |
| `252-WEATHER-BATTLE-EFFECTS.md` + `weather-effects-fragment.json` | with #47's battle-field package (the WEATHER rows' contents land as record data in #47's home) |
| `253-PRIZE-MONEY-REWARDS.md` | with #20's economy package (the payout formulas are economy facts) |
| `254-ESCAPE-FLEEING.md` | `show/production/battle-presentation/` (beside #10 — the RUN command's rule) |
| `255-ENCOUNTER-RATE-PACING.md` + `encounter-rate-fragment.json` | with the world-systems spawn package (#7's home — the field lands in #7's schema, step 4) |
| `256-CENTRE-SERVICES-FLOW.md` | with #132's care-centres package (the flow lands as #132's presentation companion) |
| `README.md` | `show/production/list26-systems-INDEX.md` on landing, or folded into the production research INDEX |
| `STAGING.md` | stays with the package until landing; then `show/production/battle-presentation/STAGING-list26-2026-10-27.md` as the landing record |

## Concrete wiring steps for the landing lane

1. **Cross-reference index entries.** Add all ten items to
   the production research INDEX / parts-catalogue with
   their numbers (247–256), and reciprocal links from every
   package this list completes: #17 → #248/#249/#250 (its
   PROPOSED register closes); #47/#181 → #252; #20 → #253;
   #10 → #251/#254; #7/#112 → #255; #132 → #256; #247 from
   every row it maps. Links point both ways or the wiring
   is not done.
2. **#249 → the chart lands as contents, in #17's file
   shape.** The fragment is already in `mochiichao/type-chart/v1`
   format. Landing replaces the `matchups: []` of #17's
   landed fragment with #249's 85 triples and updates #17's
   doc coverage line by citation ("contents asserted by
   #249 under the Pokémon-base rule") — the supersession is
   recorded in both files, never a silent overwrite. The
   `damage_pipeline` block #17 carries is likewise updated
   by citation to #248 (constants locked) or left pointing
   at #248's fragment — one source of arithmetic truth,
   chosen at landing and stated in the PR.
3. **#248/#250 → one arithmetic source.** #17's fragment
   carries `stat_stages.table_status: PROPOSED` — landing
   closes that flag by citation to #250, and #248's
   fragment becomes the pipeline's constants home wherever
   the battle arithmetic lands. No consumer may keep a
   private copy of a fraction: #18's scorer and #10's
   resolution read the landed fragments.
4. **#255 → two edits in other packages' homes (proposal
   discipline).** (a) `encounterRate` is added to #7's
   spawn-table schema in #7's own file, citing #255;
   existing canon tables take `null` (class defaults
   apply) — no table is rewritten. (b) #112's fragment
   `semanticsStatus: OPEN` closes by citation to #255's
   resolution (Shape A + the #52 reconciliation, verbatim
   in #255) — #112's transform shape does not change.
5. **#252 → effects land as #47 record data.** The RAIN /
   STORM / FROST rows' battle contents are written into
   #47's WEATHER records citing #252; the FROST row ships
   with `chipExemptTypes: []` exactly as #252 states —
   landing does not fill the list from design-lane labels
   (that is hole H3, an owner vocabulary ruling).
6. **#253 → seats, not values.** Landing adds the
   `classBase` seat to the authored-party record shape
   (#37/#45/#52 homes) and the `lossBase` constant's seat
   to #20's economy data — both as empty/authored-later
   data. No payout number is invented at landing; the
   formulas are complete without them.
7. **#256 → verify the service seats in #132's file.**
   The flow assumes centre records can seat services
   (#118-class counters). Landing confirms the seat's
   home in #132's landed file; if the seat does not
   exist there, it is added to #132's file citing #256 —
   not founded in #256's.
8. **Base-rule discipline (all items).** Mechanics gaps
   discovered during this landing are filled canon-first,
   then Pokémon's way, and the fill is named in the PR —
   they are not parked as owner questions. The only
   owner-facing items this package may surface are the
   story/canon facts in the open-slots inventory.

## UNVERIFIED TARGETS register (nothing here was invented)

| Target | Needed by | What was actually verified |
|---|---|---|
| Game engine / runtime code (battle resolution, encounter roller, centre interiors) | #248–#256 passim | Carried from Lists 13/15/17/18/20's registers: the audited sources are data + docs; no engine code exists in them. All rules in this package are spec-level; no PR may describe them as engine-wired |
| Move registry's in-repo home + the merge path with core `moves.json` | #248 (power/category source), #249 (move `type` fields), #251 (priority column) | Carried (audit hole H5): the registry (352, PR #366) and the core file (36/36) are both verified as workspace facts; which one the game reads is a landing-audit fact. Specs key off "move data" without choosing a file |
| Species records' in-repo home (`types[]` field shape) | #249 | Verified in workspace data: the design lane's `species-data-draft.json` carries `types[]` with the design-lane labels, and core records carry the template vocabulary (via #17 + the gap-audit's own text). The landed core record's exact field is confirmed at landing; the chart keys by element id either way |
| #37/#45/#52 authored-party record shape (for `classBase`) | #253 | The packages are verified (rival/dojo/encounter systems, read at their own files' level); the party records' landed field layout is a landing-audit fact — step 6 seats the field wherever those records live |
| Lists 23/24/25 STAGING + README (reconciliation) | package hygiene | At this package's build time, Lists 23/24 were present as specs + fragments without README/STAGING in the workspace, and List 25 was still building. No List 26 spec depends on a List 23–25 item's staging claims; cross-references into that range cite spec files read directly (#211 is not cited by this package — see the clarification below). Reconciliation is assigned to the one-pass link check (the List 15↔14 precedent) |

## Wiring summary (what each plugs into)

- **247** the whole teardown shelf (Lists 1–26) — it
  writes nothing but the map and the hole register.
- **248** pipeline #17; stats from #80/#39/#108 (+#179);
  level #178; chain consumers #10/#18; steps from
  #249/#252/#250.
- **249** format + consumers #17; chain seat #248;
  scoring #18; messaging #10; vocabulary fence H3.
- **250** stats #248; speed #251; changes via
  #10/#184; AI #18.
- **251** turn construction #10; seats #165 (bag) and
  the switch command; multis #157; triggers #184;
  replay #187; draw #94.
- **252** world weather #61/#19; slot + order #47/#181;
  chain seat #248; END_CHECK #10.
- **253** economy #20; parties #37/#45/#52; levels #178;
  battle-end order with #177; exclusions #109/#86/#159;
  blackout entry #256.
- **254** ring #10; speeds #248/#250; draw #94; seats
  #107/#31 via #183/#184; horde rule #158.
- **255** tables #7; bands #52; overlays #113;
  transforms #112; fishing boundary #111; audits #208.
- **256** boundary #132; access #106/#190; services
  #118 et al. as seated; entry #253; skin #142/#215.

## Open slots inventory (story/canon facts only — nothing mechanical)

The element-vocabulary reconciliation entire (H3:
Frost/Venom seats, Terra/Gale/Volt mappings, Aero vs
Wind TBD D6) · the currency's name (#20's standing slot —
#253 keys `currency` and touches nothing) · the calendar
(H6) · whether any contest exists in canon (#167's slot,
unchanged) · the Dojo 8 Syndicate boss name and other
standing story slots in earlier packages (untouched by
this list). **Data passes owed (not owner questions —
authored contents under the base rule, filled by their
lanes):** temperament→stat mapping (H4) · `gainYield`
values + curve thresholds + split weights (#177/#178) ·
`classBase` values + `lossBase` (#253) · per-area
`encounterRate` overrides (#255) · priority values on
registry moves (#251) · condition roster contents
(#182/#27) · ability assignments (#107) · `eggGroups`
assignments (#171) · the first canon terrains (H7).

## Interface-check note for landing

Four joins in this package are **interface-level**:
#249's contents landing inside #17's format (step 2 —
citation, not silent overwrite), #255's two edits in
#7's and #112's homes (step 4 — proposals land only in
their owners' files), #252's contents landing as #47
record data (step 5), and #253's seats landing in the
party/economy records (step 6). One link check after all
packages land: confirm each is either accepted in its
owner's file with citation or explicitly declined —
never left ambiguous.

**Two clarifications registered for that check (neither
is a contradiction with an earlier package):**
1. **#112's repel semantics** were OPEN by List 12's
   deliberate act, against #52's law. #255 closes them
   under a *newer standing rule* (the Pokémon-base rule,
   2026-10-27) with the reconciliation written into
   #255's spec and fragment — if the landing lane reads
   any conflict between the closure and List 12's flag,
   #255's recorded reconciliation is the text to cite;
   the flag's history is not deleted.
2. **Release-return (owner ruling, landed in memory
   while this package built):** the ruling supersedes
   List 22 #211's game-side stance. No List 26 spec
   cites #211 or takes a position on release — the
   revision belongs to #106/#211's landing per List 28,
   and #247's map deliberately leaves release out of
   the base checklist for that reason.
