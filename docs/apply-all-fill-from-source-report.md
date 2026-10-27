# Fill-from-source pass — report (STAGED ONLY)

No PR, no merge, no game-tree edits, no edits to the dirty work
tree, no edits to other lanes' staging. Sibling staging
(`apply-all/menus-wallpapers/`, `apply-all/true-chart/`,
`apply-all/body-origins/`) was read and referenced, never edited.
Opponent body-part origins are NOT in this pass (separate worker).

Rule applied: Mars fill-from-source rule 2026-10-27 ~07:43 CDT —
any gap Pokemon game code itself, all games on disk, or the
modding community can fill is filled from that source at 100%
and not asked. Black 2 (most recent gen on disk) is canonical
where generations differ; source values/structures as-is
elsewhere. Mars decisions 2026-10-27 ~07:46 CDT applied on top
and kept in separate, labelled fields (caps lifted, swappable
menus, True chart 19, wallpapers + upload path).

## Files staged (this directory only)

- `filled-from-source.ts` — typed constants, zero imports.
  Per-move category array (560 entries), ability resolution,
  badge, bag/box (+ Mars caps-lifted overlay), PC release,
  save, frame types, weather, camera, lighting shape, season,
  shop progression, facility absence.
- `filled-from-source.json` — manifest with per-row source
  citations (decomp file path + line, or data JSON path + field).
- `fill-from-source-report.md` — this report.

## Counts

### Task items: 10/11 = 91% filled, 1/11 = 9% genuinely absent

| # | Item | Result |
|---|---|---|
| 1 | Placeholder ability | FILLED — 353 placeholder slots -> null, 0 -> named ability, 1603 real slots (1956 examined) |
| 2 | Physical/special canonical | FILLED — explicit per-move field; playable 221 physical / 143 special / 195 status (+1 placeholder status) |
| 3 | Badge boost | FILLED — Black 2 has NO stat boost; obedience cap (badges+1)*10, badges < 8. Gen-3 x110/100 recorded as cross-gen only |
| 4 | Bag + box counts | FILLED + Mars caps-lifted overlay — Black 2: 6 pockets, 614 slots, stacks 999/1, 24 boxes x 30 = 720 source, party 6; caps lifted to unbounded per 07:46 |
| 5 | Release in PC | FILLED — YES, with 4 coded blocks + yes/no confirm; move-lock trigger is a constant -1 stub, so no move blocks a release as coded |
| 6 | Save shape | FILLED — Black 2 block table + main/backup copies, magic 0x31053527, CRC-16-CCITT 0x1021, per-block recopy recovery. Gen-3 sector shape recorded as contrast only |
| 7 | Options frame types | FILLED per gen — Black 2: no user option (9-piece frame by archive type); FireRed: 10-entry table (5-bit field, 20-guard); HeartGold: 20 choices. Frame ART not staged (original art owed) |
| 8 | Weather/camera/lighting | FILLED — field weather 15 overlays, 2 transitions, precedence order; battle weather 1-4; camera 3 transforms / 4 boundary funcs / delay 7/6/2 / create zoom 120; lighting 210 sets x 15 x 4 = 12600 lights (full numerics already in batch-b, cited not duplicated) |
| 9 | Season clock | FILLED — device RTC cached date, (month-1)%4, force-sync flag overrides |
| 10 | Shop stock progression | FILLED as a rule — badge-mart file = [0,1,1,2,2,3,3,4,5] for badges 0..8; other shops fileId+6. Per-file item lists are archive extraction work, not invented |
| 11 | Facility level rules | NOT FILLED FROM SOURCE — genuinely absent: 0/1285 trainer files and 0/6000 set files carry a level field; the subway picker's "level" is a difficulty tier, not a creature level. Nothing invented (no "level 50" staged) |

### Previously-blocked rows (all-sources 26): 11/26 = 42% filled

Filled rows (11): B7, B13, C6, D1, D2, D3, E14, F12, F16, H7,
7.8. Still blocked (15/26 = 58%): A9, F10 (art only — wallpaper
types are filled), 2.18, 3.11, 4.5, 5.5, 6.9, DS1, DS7, DS9,
DS10, DS11, DS15, DS16, DS18. Of those 15, 1 (DS18) is
genuinely-absent-from-source and 14 are truly-needs-Mars /
original work. Partial sub-parts staged inside blocked rows
(wallpaper types, True-chart 19-set by reference) do NOT flip
those rows to filled — the count stays conservative.

## Still truly needs Mars / original work (explicit list, never invented)

1. Original item descriptions (DS7/WG1) — 639 items; mechanical
   effect descriptions may be drafted from effect data, but the
   original Mochiichao text is Mars's.
2. Species conversion to the original roster (DS1) — which
   decomp slot maps to which original creature.
3. Zone / encounter / lighting assignments to Mochiichao maps
   (2.18, 5.5, 6.9, WG4) — which staged set goes on which map;
   code values themselves are filled (row 8).
4. Weather-code -> Mochiichao-state meaning (3.11/WG18) and
   projection/camera value meanings per map (4.5) — the numeric
   codes are filled; what each means in Mochiichao states is
   Mars's.
5. Original role names (DS15) and trainer personal names (DS16).
6. Deep + new-element matchup values (DS10/DS11) — the 19-set
   is staged by reference with Deep cells flagged neutral 1.0
   (no-equivalent); real Deep values, if any exist, are Mars's.
   Vocabulary flag: live game code uses 12 True Elements while
   the 07:46 decision locks 19 — the 12-vs-19 reconciliation is
   owed parent-lane work, not silently decided here.
7. Original art / audio / dialogue — frame art (C6 remainder),
   PC wallpaper art (F10 remainder; types + upload path staged
   by reference), palettes/art (WG14), sound (WG15), dialogue
   (WG26), place names (WG6), season-to-form (WG17), shop
   catalogue originals (WG21), battle constants as original
   values (WG20), nature assignments (DS9/WG2).
8. Link play (A9) — link-player row depends on a later lane.
9. Facility level rule as Mochiichao design (DS18/WG5) — no
   source rule exists (row 11 above); picking one is a design
   decision, not a lookup.
10. PC release policy conflict (flag, not a source row): the
    playable-wiring map records the game as currently stating
    release is deliberately not offered, while Black 2 code
    offers it. This pass stages the source value (YES); whether
    the no-release policy stays is for the parent lane, not
    decided here.

## Owed work that is NOT a Mars decision (extraction, for the PR worker)

- Per-file shop item lists from the shop-items archive
  (badge-mart files 0-5 + each fileId+6 file) — progression rule
  is filled; lists are not in any decomp JSON on disk.
- `tsc` gate on `filled-from-source.ts` before any merge —
  NOT run here (see validation below).

## Validation

- JSON parse: `filled-from-source.json` — parsed successfully
  (12 rows), re-parsed after the forbidden-check wording edit.
- TS array: `MOVE_CATEGORY_BY_INDEX` length 560, verified
  against `generated/moves.txt` order (index 0 placeholder,
  1..559 playable; counts 221/143/195 playable).
- Forbidden grep: 0 SPECIES_ hits, 0 species-name
  reproductions, 0 literal-dialogue hits over this directory's
  staged files (checked against the 652 species data-dir slugs
  as standalone tokens, plus manual review for character/place
  names, images, logos, creature voices). The only standalone
  "none" tokens are generic English, the code boundary-function
  label "none" (NULL table entry), and the path
  res/abilities/none.json (the ability placeholder file) —
  none reproduces a species name. Generic vocabulary (water,
  mail, box, pocket) is not a species/character/place name
  and is not counted.
- NOT validated here: full `tsc` strict gate — the disk is
  100% full (25 MB free at check; a sibling lane also reported
  the same blocker), so no node_modules work was attempted.
  The PR worker must run `tsc` on a clean tree before any
  merge. No deletions were made to free space (that needs
  Mars's word on what to free, per the sibling disk report).

## What was NOT done, and why

- No per-species ability table by name: species identifiers
  are forbidden in staged output, so abilities are staged as
  the resolution rule + aggregate counts, not a named roster.
- No duplicated lighting numerics, True-chart 361 cells,
  wallpaper catalogue, menu catalogue, or body-part origins:
  lighting numerics already live in batch-b, the other three
  in sibling staging, origins with the separate worker.
  Duplicating them would waste the remaining disk and risk
  clobbering another lane.
- No Black 2 badge stat boost, no facility level 50, no
  per-file shop lists, no frame art: each would be invented,
  and the task forbids guessing.
