# STAGING — List 18 (items 167–176)

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
earlier teardown packages, Lists 11–17's landed files, and
`species-data-system/GAP-AUDIT.md` + `AUDIT-WHAT-EXISTS.md`).
Where a target could not be verified from those sources, it
is registered below as an **UNVERIFIED TARGET** — the honest
landing for those steps is the spec plus the gap flagged in
the PR body, never invented glue presented as wired. Every
landing PR report names the real files it touched and what
changed.

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths (game repo, show-inside-repo layout)

| File | Proposed home |
|---|---|
| `167-PERFORMANCE-CONTESTS.md` + `contest-fragment.json` | `show/production/world-systems/` (beside the #78 showcase + #151 tournament packages — the institution sits with its two neighbours) |
| `168-RANGER-TRADING.md` + `trade-transfer-fragment.json` | game data docs beside the #80 individual-variation package (the record it operates on), cross-ref from #68's trade-protocol home |
| `169-RANGER-HIDEOUTS.md` + `hideout-fragment.json` | `show/production/world-systems/` (beside the #119 interiors package) |
| `170-SAFARI-ZONES.md` + `safari-fragment.json` | `show/production/world-systems/` (beside SPAWN-TABLES / the #110 sanctuary package — the #7/#38 pair it joins) |
| `171-BREEDING-COMPATIBILITY.md` + `compatibility-fragment.json` | with the species-data system docs (beside the #77 egg-system package — the validator is cited from #77's home) |
| `172-BROADCAST-MEDIA.md` + `broadcast-fragment.json` | `show/production/world-systems/` (beside the #90 media package) |
| `173-REMATCH-SYSTEM.md` + `rematch-availability-fragment.json` | `show/production/battle-systems/` (beside the #87 rematch + #100 gauntlet packages) |
| `174-AGRICULTURE-CULTIVATION.md` + `cultivation-fragment.json` | game data docs beside `src/data/core/` (with #79's farm package cross-referenced — the layer lands with the economy data it feeds) |
| `175-WEATHER-FORMES.md` + `weather-forme-fragment.json` | `show/production/battle-systems/` (beside the #130 forme-change package — its criterion proposal is cited there) |
| `176-TOWN-ARCADE.md` + `arcade-fragment.json` | `show/production/world-systems/` (beside the #56 minigame + #119 interiors packages) |
| `README.md` | `show/production/list18-systems-INDEX.md` on landing, or folded into the production research INDEX |
| `STAGING.md` | stays with the package until landing; then `show/production/world-systems/STAGING-list18-2026-10-27.md` as the landing record |

## Concrete wiring steps for the landing lane

1. **Cross-reference index entries.** Add all ten items to
   the production research INDEX / parts-catalogue with
   their numbers (167–176), and add reciprocal links from
   the packages each item extends: #78/#151/#147 docs →
   #167; #68/#80/#106 docs → #168; #119/#99/#31 docs →
   #169; #110/#7/#38/#152 docs → #170; #77/#80 docs →
   #171; #90/#142/#153/#143 docs → #172; #87/#100/#124
   docs → #173; #79/#20/#118 docs → #174; #130/#61/#142
   docs → #175; #56/#119/#104 docs → #176. Links point
   both ways or the wiring is not done.
2. **#170 → `safari` lands in the same schema patch as
   #110's field.** The `encounterMode` field itself is
   #110's proposal into `world-systems/spawn-table.schema.json`;
   landing applies ONE edit in #7's home carrying both
   values (`sanctuary` from #110, `safari` from #170),
   citing both packages. Until that edit lands, both modes
   are spec-level and **no area gains the field**. The
   Forest-exclusion validation rule lands with the patch
   as a schema-adjacent test.
3. **#170 → `useContext.safari` proposed into #31's
   schema.** Lands only as an edit in ITEM-DATA-LAYER's
   home (`item.schema.json`) citing this package — one
   boolean beside field/battle/held. No item is flagged by
   this landing; bait legality stays vacuous until #31
   content exists.
4. **#171 → cited from #77 as its validator section.**
   Landing adds the citation in #77's home (EGG-SYSTEM)
   pointing at #171 for the derivation + V1–V5, and
   registers the coverage read (0/47 assigned, 0 evaluable
   pairs) beside GAP-AUDIT item 4. **No assignment is made
   by this landing** — assignments are a data-lane fill
   under V1–V5, and the Dorowani/Gabu core-record gap
   (Sideline A) closes first for those two species.
5. **#168 → keeper-history seat decided once.** Landing
   chooses the history array's home (#80's record vs #96's
   history section beside #106's tombstones) by where the
   repo's individual records actually live at audit time,
   and records the choice in the PR body. One home; #68's
   protocol doc cross-references it. The escrow-lock is
   demonstrated as a negative test (no release, no location
   move while escrowed), not just stated.
6. **#175 → the `weather` kind lands only in #130's
   file.** The criterion-vocabulary edit is made in
   FORME-CHANGE's home citing #175, including the
   NONE-exclusion as a schema-level rule (a criterion
   naming NONE fails validation). No family gains the
   kind at landing; Strikechamp's pairing stays OPEN.
7. **#172 → forecast wording audit.** When #172 lands,
   any media-facing text generated from its classes is
   checked against #142's law: forecasts appear only as
   labelled projections of #124/#153 derivations. The
   clarification (below) is recorded in the PR body so the
   brief's original wording is not silently propagated
   into copy.
8. **#167/#173/#176 → honours occasions proposed into
   #104's catalogue.** Contest ribbons, rematch honours,
   and arcade stamp occasions are proposed into #104's
   home as catalogue occasions (the catalogue is the
   owner's slot, per #151); until accepted there, all
   three systems' honours references are spec-level and
   no stamp is instanced.
9. **#169 → no care-location creep.** Landing verifies
   mechanically that #106's `location.kind` vocabulary is
   unchanged by this package (party | garden | storage —
   no `hideout`), and that the hideout record's placements
   reference #31 items without copying them. If a future
   proposal wants Mochi resident at hideouts, it arrives
   as a care-law revision, not a schema tweak.
10. **Open-slot discipline (all items).** Every OPEN below
    lands open. In particular: no contest, hideout, safari
    zone, broadcast channel, crop, arcade, or rematch rung
    is instanced by this landing — the package ships forms
    and derivations, and canon content remains the owner's
    and the data lane's to make.

## UNVERIFIED TARGETS register (nothing here was invented)

| Target | Needed by | What was actually verified |
|---|---|---|
| Game engine / runtime code (contest presentation, safari resolution, availability consumers, forme re-evaluation) | #167, #170, #173, #175 | Carried from Lists 13/15/17's registers: the audited sources are data + docs; no engine code exists in them. All consumption rules in this package are spec-level; no PR may describe them as engine-wired |
| Move registry's + animscripts' in-repo homes | #167 (via #147) | Carried from #147's own register: #147's ledger is itself a derivation rule awaiting those verifications, so #167's contest-legality derivation inherits the wait — it derives from the ledger, never from a hand list, whenever the ledger first runs |
| Ranger record home (for #168's keeper seat + #169's keeper ref) | #168, #169 | Carried from List 16's register (#150): #80's model and #96's roster section are verified workspace specs; where landed Ranger/individual records live is a landing-audit fact. Step 5 seats the history array by that audit |
| Spawn schema's in-repo home | #170 | Workspace copy verified (`world-systems/spawn-table.schema.json`, read via #110's citation and List 17's register); repo home to confirm at landing before the `encounterMode` patch (step 2) is treated as wired |
| #41's `presentationClass` field in the sheet standard | #172 (via #163) | Carried from List 17's register: verified as a *proposal* on #41's face. #172's `forest_bulletin` class behaviour is defined over #163's sealing either way, but the mythical-class set it reads stays owner-declared until the field lands |
| #104's honours catalogue — landed home and shape | #167, #173, #176 | #104 verified as honours stamps on the individual record with the catalogue as an owner slot (#151's citation). The catalogue's landed home is a landing-audit fact; step 8's occasions are proposals until it is found and accepts them |
| The calendar (day kinds, seasons) | #172 (schedules), #174 (seasons) | Not unverified but *unruled canon*, carried from #93/#105/#124's registers: the mechanism in both specs is complete against the OPEN vocabulary and instances nothing until the owner rules the calendar. Registered here so the dependency is visible in one place |

## Wiring summary (what each plugs into)

- **167** event engine #78 (format consumed verbatim);
  repertoire derived via #147; effects closed list shared
  with #151; honours #104; standing derived per #14;
  show arcs #82.
- **168** protocol #68 (locks, stamps, atomicity);
  record #80; location/escrow #106; completion #14;
  honours/care history ride in-record (#104/#28).
- **169** interiors #119; event grammar neighbour #99
  (Syndicate — distinct); placements over #31 items
  (decor kind per #56); presence #58; social discovery
  #90/#93 + atlas restraint #137/#163.
- **170** mode field → #7 schema (with #110); tables #7;
  capture #38 (non-battle path); behaviour #152 wild
  view; item flag → #31 (proposed); discovery #14/#110.
- **171** taxonomy + egg record + day-care #77 (validator
  cited back); inheritance untouched in #80; residency
  #77/#12; coverage derived from core data (GAP-AUDIT).
- **172** grid + generators #90; weather reads #61 via
  #142; phenomena #153; league #143/#151/#100; Forest
  #163/#84; scheduling #124/#19; voice law #81/#84.
- **173** record home #87; fixtures #30 over #37;
  sources #45/#100/#151; availability projection #124;
  presence #93; honours #104; flags #12 (monotonic).
- **174** plot machinery #79 (not restated); items #31;
  prices/currency #20; shop stock sources #118; climate
  reads #142/#19; tenders' timetables #93.
- **175** criterion vocabulary → #130 (proposed kind);
  weather #61; climate filter #142; presentation #9;
  axes kept separate from #40/#15 per #130.
- **176** interiors #119; ethics inherited from #56
  (M1/M4) + #20 one-currency rule; prizes #31 + #104
  (proposed occasions); rotation #124; facts #12.

## Open slots inventory (nothing invented)

Whether any contest institution exists; tiers, venues,
judges, ribbon design, per-move `appeal` values (#167) ·
whether in-world trading exists as a feature;
`species_untradeable` values; gift channels; the
keeper-history seat (#168) · whether hideouts exist;
every instance; decor roster; visiting default (#169) ·
every zone designation; entry terms; bait roster; zone
instrument tiers; flee rates (#170) · **every `eggGroups`
assignment (0/47 today)**; the `aether` roster (#171) ·
every channel/programme/personality; block schedules;
league coverage beyond R1 (#172) · the rematch gate's
values entire; **every rung's contents, incl. all dojo
leaders and Hex**; rematch housing (#173) · every crop;
field sites; NPC farm rosters; the calendar/seasons
(#174) · the `weather` kind's acceptance; every family's
pairing; the FROST-trigger question (#175) · every
arcade, game design, price, and prize table; whether any
chance-class game exists (#176).

## Interface-check note for landing

Five joins in this package are **interface-level** (their
targets are owned by other packages or land in the same
wave): the `encounterMode` two-value patch (step 2 — one
edit in #7's home citing #110 + #170), `useContext.safari`
proposed to #31 (step 3), #171 cited as #77's validator
(step 4), the `weather` criterion kind proposed to #130
(step 6), and the honours occasions proposed to #104
(step 8). One link check after all packages land is worth
doing: confirm each proposal is either accepted in its
owner's file (with citation) or explicitly declined —
never left ambiguous.

**Three clarifications registered for that check (none is
a contradiction with an earlier package):**
1. **#68 vs #168, show lane.** #68's "the show lane never
   trades" governs the trade *system*; #168's mirror
   covers a *depicted* transfer of care as story. If the
   owner reads #68 as barring even depiction, that
   reading wins and #168's paragraph is void. Flagged in
   both specs; not silently resolved.
2. **#172 vs #142, forecasts.** The commissioning brief's
   "weather forecasts" survive only as labelled
   projections of deterministic derivations (#124/#153),
   per #142's verbatim law (media reports the effective
   state; no forecasting fiction). #172's format has no
   field for an unbacked forecast.
3. **#174 vs #79, and #173 vs #87.** Layerings, stated on
   each spec's face: #174 instances no plot mechanics
   (#79 owns them) and #173 defines no record shape
   (#87 owns it). Landing should treat any apparent
   overlap as a citation to add, not a conflict to
   resolve.

**OWNER RULING — flag RESOLVED (2026-10-27, applied at the List 18 landing):** the show MAY depict trades — as stories, side stories, and backstory (characters talk about how they got their Mochi in a trade, and how they evolved). #68's "the show lane never trades" is the SYSTEM rule only (the show never runs the trading mechanic); #168's show mirror STANDS as legitimate. A depicted trade turns on the Mochi's own wishes — creature agency stays at the centre. The earlier either/or flag is removed as resolved-by-ruling.

**Annotation (List 23 landing, 2026-10-27):** this record's #68-vs-#168 flag is RESOLVED by owner ruling (the show may depict trades as stories; the system rule stands) — annotated, not rewritten. #218 (218-SHOW-TRADE-STORY-GRAMMAR.md) states the grammar.
