# STAGING — List 11 (items 97–106)

All ten yields are text specs (Markdown + JSON fragments,
~76 KB total, measured). **Nothing is TeraBox-class; nothing was
downloaded or staged locally** (workspace staging rule — local
disk is the workbench; these land in GitHub with the other
teardown packages, through the side lane's PR flow).

**Real-code wiring law applies to every step below** (standing,
2026-10-27): before wiring, the landing lane audits the actual
repo for what exists — real files, real schemas, real paths —
and wires into THAT. The paths and joins named here are the
*proposed* homes and the *intended* connections, written from
the teardown packages' own records. Where a target does not
exist in the repo yet, the honest landing is the spec plus the
gap flagged in the PR body — never invented glue presented as
wired. Every landing PR report names the real files it touched
and what changed in them.

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths (game repo, show-inside-repo layout)

| File | Proposed home |
|---|---|
| `97-RESEARCH-TASKS.md` + `research-tasks-fragment.json` | `show/production/world-systems/` (beside MOCHIIOTECA-COMPLETION.md, the #14 spec it extends) |
| `98-RANGER-LICENCE.md` + `licence-fragment.json` | `show/production/world-systems/` |
| `99-SYNDICATE-ENCOUNTERS.md` | `show/production/world-systems/` (encounter cluster, beside the #30/#45 packages) |
| `100-CHAMPION-GAUNTLET.md` + `gauntlet-fragment.json` | `show/production/world-systems/` (beside the dojo-circuit package, #45) |
| `101-MOVE-TUTORING.md` | game data docs beside the moves registry + cross-ref from `show/production/` (two-lane spec: game record + show grammar) |
| `102-HABITAT-RANGE-MAPS.md` + `range-map-fragment.json` | `show/production/world-systems/` (beside SPAWN-TABLES / ECOLOGY-TABLES) |
| `103-ITEM-CRAFTING.md` + `crafting-fragment.json` | game data docs beside the #31 item data layer |
| `104-INDIVIDUAL-HONOURS.md` + `honours-fragment.json` | `show/production/species-data/` (beside #80's individual-variation package — the record honours live on) |
| `105-FESTIVAL-CALENDAR.md` + `festival-fragment.json` | `show/production/world-systems/` |
| `106-MOCHI-STORAGE.md` + `storage-fragment.json` | game data docs beside `src/data/core/` (roster/save neighbourhood, with #96) |
| `README.md` | `show/production/list11-systems-INDEX.md` on landing, or folded into the production research INDEX |
| `STAGING.md` | stays with the package until landing; then `show/production/world-systems/STAGING-list11-2026-10-27.md` as the landing record |

## Concrete wiring steps for the landing lane

1. **Cross-reference index entries.** Add all ten items to the
   production research INDEX / parts-catalogue with their
   numbers (97–106), and add reciprocal links from the packages
   each item extends: #14's completion doc → #97; #12/#45 docs
   → #98; #30/#45 docs → #99 + #100; moves-registry docs →
   #101; #7/#29 docs → #102; #31 doc → #103; #80 doc → #104 +
   #106; #19/#93 docs → #105. Links point both ways or the
   wiring is not done.
2. **#97 → save payload.** Register a `research` section in
   #96's payload map (facts section: tallies only; levels
   derived). Verify the real save/registry code first — if no
   save implementation exists yet, land as spec + flagged gap.
3. **#99 → #30 schema note.** The Syndicate admin wrapper needs
   `tier: syndicate` added to the dojo-encounter tier vocabulary
   (`dojo | elite | champion` today). One additive enum value,
   cut as a schema patch at landing against the real schema
   file; if the schema is not yet in the repo, the note lands
   with the spec instead — do not invent a schema file path.
4. **#100 → gauntlet records.** Instance *no* parties. The
   landing creates only the run-record shape (fragment) beside
   the #45 package and links the #30 records for Umi/Gin/Hono/
   Yoru/Hex when those records exist; missing records are
   flagged gaps, not fabricated encounters.
5. **#101 → owed-field registration.** Register the per-species
   `tutor` compatibility list as an **owed field** in the
   TBD-REGISTER beside the existing learnset/eggGroups entries
   (field registered; contents OPEN). Do not populate it.
6. **#102 → generation step.** The range projection is a build
   artefact: landing adds the regeneration step to the pipeline
   notes beside the spawn-table schemas (run when #7 or #29
   inputs change; output stamped with input versions). No
   range data is committed by hand — ever.
7. **#103 → #31 checks.** If/when a recipes file is cut as a
   schema, it must carry #31's enforcement style (output id
   resolves to an item record; no move-class field;
   `additionalProperties: false`). Zero recipes land now.
8. **#104/#106 → individual record.** One schema note against
   the real individual-record schema (verify it exists first):
   `honours[]` (#104 stamps) and `location` (#106) are additive
   fields on that one record. #106's release tombstone joins
   the save-history shape; #68's `story_locked` is referenced,
   never redefined.
9. **#105 → calendar slot.** No wiring is possible until the
   calendar itself is ruled (day kinds OPEN since #93). Land
   the spec + fragment, cross-linked from #19/#93, with the
   dependency stated in the PR body.
10. **Open-slot discipline (all items).** Every OPEN below
    lands open. Where a spec flags an owner decision, the
    package lands with the slot empty — per the full-wiring
    order, an open slot never holds a package.

## Wiring summary (what each plugs into)

- **97** consumes #7/#28/#39/#9/#89/#31; feeds #14 (milestone
  kind, PROPOSED) + #81; save facts section per #96.
- **98** renders #12 flags + #14 derivations + #100 standing;
  slots from #30/#45 records; strings via #23; identity home
  #96 `meta`.
- **99** grunt pools under #52/#70 law (story tier × area band,
  never party state; #94 machinery under authored pool
  constraints); admins/boss = #37 records in #30 wrappers;
  hideouts = #12 flags + #93 patrols + #11 nodes; Dojo 8 flag
  shared with #45.
- **100** spine/composition #45; records #30 over #37 parties;
  gates #11 `sequence_clear`; state #12; standing displayed by
  #98; rematches #87; housing #66/#86 (OPEN).
- **101** join key = moves registry (PR #366) both lanes; game:
  #93 + #11 + #20 + #31 + owed tutor field; show: #37 + #9 +
  #82. Lanes never share mechanics.
- **102** pure projection of #7 + #29 over #11; display gated
  by #32 + #14; depths render UNSURVEYED.
- **103** recipes over #31 (`material` category); gates #12/#11;
  produce pointer #79; fees in #101's cost shape against #20.
  Individual fusion refused — see #8's OWNER_DECISION.
- **104** stamps on #80's individual record; sources #28
  careLog / #78 results / battle records (#30/#45/#99/#100);
  travel via #68/#106; save via #96 roster.
- **105** consumes #19 clock; announces via #90; gathers via
  #93 overrides; hosts #56/#78/#97; records via #12 vars.
- **106** one `location` field on the roster record; locks from
  #68; dex permanence per #14; Garden residence read by
  #58/#65; eggs #77; tombstones beside #12 history.

## Open slots inventory (nothing invented)

Research task lists/targets/weights/level bands + proposed
#14 milestone contents (#97) · licence-issuing beat, case
physical design, tier thresholds/names (#98) · **Dojo 8 /
Syndicate boss name**, all Syndicate members, parties,
hideouts, motives (#99) · heal-gate kinds per gate, fragment
threshold (8 = inherited structural inference), rematch housing
(#100) · all tutor NPCs/move lists/prices, the per-species
tutor compatibility contents, whether tutors may teach
Rare-class moves, currency name (inherited from #20) (#101) ·
Regions 2–5 ranges (await their #7/#29 instances) (#102) ·
every recipe, the materials roster, station vocabulary,
quantities (#103) · the entire honour catalogue: ids, names,
icons, thresholds (#104) · the calendar itself (day kinds,
seasons) and every festival instance; the no-Forest-festivals
rule is PROPOSED for owner confirmation (#105) · box count,
slot capacity, whether the partner may be stored (#106).

## Interface-check note for landing

Several #97–#106 joins are **interface-level** (the sibling
packages they cite — #96's payload map, #30's tier vocabulary,
the individual-record schema — are themselves landing in the
same wave). One link/pass check after all packages land is
worth doing: confirm the `research` save section, the
`syndicate` tier value, and the `honours[]`/`location` fields
each exist exactly once, in exactly one home, and that no spec
here or there defines them twice.
