# LOCK UPDATE — Re-lock pass, 2026-10-26

Mars-ordered re-lock (2026-10-26 ~12:32 CDT): the edited / updated / corrected
versions BECOME the locked versions. Old locked versions that were already
correct stay. Built from live main head `023e0387` (Merge PR #175, discovery
silhouettes) — base atlases/manifests taken from that head, never from stale
local `atlases/` copies.

## Result counts

- KEEP — 42/51 creatures, no file changes.
- REPLACE — 6/51 creatures (3 pixel tile swaps + 3 manifest role relabels, 0px).
- DECIDE (held, no changes) — 3/51 creatures: pupbble, pyromonk, mechapion.
- Files in this PR: 10 — 3 updated atlas PNGs, 6 updated manifests, this note.
  0 deletions. No other paths touched: no Batch B, no Razorgater take-4, no
  approved finals, no shinies, no footprints/silhouettes, no other creature.

## REPLACE — pixel tiles (3 creatures, 8 tiles, 299px total)

All diffs are visible diffs (audit definition: both-alpha-0 ignored) and every
changed pixel runs locked-opaque → transparent. No pixel was added anywhere.
Every other tile in each atlas is byte-identical to base. Splices at exact
manifest `atlas_x`/`atlas_y`, cell 64, via Pillow.

### Razorgater — cell 4 `battle_front`, atlas (256, 0) — 191px

- Source: `sprite-art/animation/expanded-scope/batch-a/corrected-bases/razorgater_cell_04_groundblob_removed.png`
- Diff: exactly 191px locked-opaque → transparent (177px flat-grey ground blob
  x20–43, y48–59 + 14px disconnected bottom arc x22–31, y59–60). Feet, claws,
  steel cracks intact. Verified: 191 == expected, reverse direction 0px.
- DECISION (flagged): the clean2-only 62px was NOT applied. Idle
  `idle_a_clean2` differs from locked cell 4 by 250 visible px, of which 62 are
  clean2-only grey shadow-ellipse pixels (x19–33, y48–60, grey ~90–173) that the
  corrected base keeps opaque. Idle files are NOT atlas tiles, and the shadows
  stay per the shadows-separate rule. Open question for Mars: is the 62px
  shadow-ellipse cut idle-only, or should it also be applied to locked atlas
  cell 4 on top of this 191px replacement? This PR applies the 191px only.
- NOT used: `razorgater_cell_04_clean.png` and any `*_clean` / `*_shadowfree`
  file (rejected class, Mars 2026-10-26 ~07:33).

### Sproutle — 6 tiles only — 61px total

- Sources: `sprite-art/stage-show-sproutle-fix/sproutle_cell_{01,02,03,06,16,19}_spotfree.png`,
  mapped by manifest cell number → atlas coords:

| Cell | Role | Atlas (x, y) | Diff (px, locked near-white opaque → transparent) |
|------|------|--------------|---------------------------------------------------|
| 1 | battle_back | (64, 0) | 13 |
| 2 | overworld_back | (128, 0) | 9 |
| 3 | overworld_back_2 | (192, 0) | 5 |
| 6 | overworld_front_3 | (0, 64) | 10 |
| 16 | overworld_front_13 | (256, 128) | 9 |
| 19 | walk_front_1 | (64, 192) | 15 |
| **Total** | | | **61** |

- All six verified exactly (13/9/5/10/9/15), reverse direction 0px each.
- DECISION (flagged): the other 8 spotfree cells (0, 4, 12, 14, 15, 17, 18, 20)
  were NOT swapped. The locked lineage is already cleaner there: a verbatim
  swap would ADD BACK 60px (1, 1, 4, 6, 3, 15, 18, 12 px respectively),
  including pure-white spot pixels in walk cells 17/18/20. Open question for
  Mars: confirm the locked lineage's fuller clean stands for those 8 cells
  (i.e. nothing further wanted for them). This PR's 6-tile replacement does
  not depend on that answer.

### Tyrage — cell 3 `battle_front`, atlas (192, 0) — 47px

- Source: `sprite-art/animation/expanded-scope/batch-a/corrected-bases/tyrage_cell_03_spotfree.png`
- Diff: exactly 47px locked-opaque → transparent (white leg-gap component
  x26–40, y46–50). Tan belly, legs, claws intact; bottom teal streaks
  untouched. Verified: 47 == expected, reverse direction 0px.
- NOT used: `tyrage_cell_03_clean.png` (rejected class) or any `*_clean` /
  locked-clean atlas.

## REPLACE — manifest role relabels only, 0px (3 creatures, 14 cells)

Atlas PNGs untouched for these three. Only `role` strings changed, plus the
`relock_2026_10_26` object and one appended `notes` line per manifest.
`version`, `frame_count`, `game_ready_cell_count`, frame order, frame coords,
and all other frame fields unchanged.

### Ashemit — 2 cells

| Cell | Old role | New role |
|------|----------|----------|
| 02 | overworld_back | overworld_side |
| 04 | overworld_side | overworld_back |

Source: `sprite-art/walk-frames/ashemit/ashemit.walk.json` (eye-checked,
"supersedes manifest labels": down = cell 03 front, right = cell 02 side,
up = cell 04 back). Cell 03 `overworld_front` already agreed in both.

### Dreadtoise — 6 cells (3-way rotation)

| Cell | Old role | New role |
|------|----------|----------|
| 06 | walk_side_0 | walk_front_0 |
| 07 | walk_side_1 | walk_front_1 |
| 17 | walk_front_0 | walk_back_0 |
| 14 | walk_front_1 | walk_back_1 |
| 10 | walk_back_0 | walk_side_0 |
| 11 | walk_back_1 | walk_side_1 |

Source: `sprite-art/walk-frames/dreadtoise/dreadtoise.walk.json` + walk stage
batch note (down = fronts 06/07, up = backs 17/14, sides face right = 10/11).
No duplicates result: the swap is a closed rotation.

### Duskfiend — 6 cells

| Cell | Old role | New role |
|------|----------|----------|
| 08 | walk_back_0 | walk_side |
| 16 | walk_back_2 | walk_side |
| 12 | walk_side_1 | walk_back |
| 13 | walk_side_0 | walk_back |
| 11 | walk_side_2 | walk_back |
| 14 | walk_back_4 | walk_side |

Source: `sprite-art/walk-frames/duskfiend/duskfiend.walk.json` + walk stage
batch note (walk_back 08/16 are side views, walk_side 12/13 are backs,
down = 07/05 fronts, up = true backs 11/12, sides face right = 08/14).
Cells 05/07 `walk_front` already agreed in both.

## KEEP — 42/51 creatures, no file changes

Group A (14): aerobeak, aquariios, astroleviathan, chromejaww, cocoonode,
cragarm, dorowani, duneclaw, finblade, floatcalf, gabu, gearkid, gorokappa,
inklet. (Gearkid PR #146 cell 16 true-back already locked, 0px diff — nothing
new to promote.)

Group B (14): kickmaster, kittember, krakenox, manticlaw, megalochrome,
mochii, mothrix, mythar, oblivirex, pebblefist, pixilite, punchkid, pyropaw,
quakehound. (Locked vs plain game-ready visible diff 0 throughout; kittember
and mochii explicitly NO REBUILD in SOURCE-FRESHNESS.md.)

Group C (14): reaperdile, shellguard, squirmite, stormtalon, strikechamp,
strikechamp_unsuited, strikechamp_unsuited_full, terradog, terrapod,
tiidebiite, toxitacle, wispkin, yogiferno, zephling. (Reaperdile, tiidebiite
explicitly NO REBUILD; wispkin's documented correct edit is 0px — its
bone-white mask is design, not a spot.)

Rejected-class files (`*_clean.png`, `*_shadowfree.png`, clean atlases /
clean manifests) were recorded in the audits and never promoted, even where
present.

## DECIDE — held, no changes (3 creatures)

- **Pupbble** (walk-gate pending): locked cells 12/13/14 labelled side are
  fronts by eye-check; cells 04/09 are the true sides. Held because the walk
  file assigns no exact replacement role strings (front_N numbering TBD) and
  Mars's walk-gate pick (locked-sheet walk art vs walk-frames dirs) is still
  pending — and because it is unsettled whether a relabel lands before or
  only after that pick.
- **Pyromonk** (walk-gate pending): locked cells 05/06 labelled walk_back are
  fronts; cells 27/28 labelled walk_side are upside-down tumble poses, not
  walk sides. Held for the same two reasons (exact replacement strings TBD;
  walk-gate pick pending). Scope caution: the walk file says nothing about
  the rest of the locked walk_back range (07–24) — no wider relabel proposed.
- **Mechapion** (back-cell question): no frame carries role `battle_back`;
  battle_back is currently served only by fallback to cell 2
  (`overworld_back`). Held: does Mars approve cell 2 as the standing
  battle_back fallback, or is a dedicated battle_back cell to be made? No
  back cell invented here; the rejected `cell_04_clean.png` and the ringed
  cell 0 pose were NOT promoted as backs.

## COUNT FIELDS — deliberately NOT changed in this PR (flagged follow-up)

`frame_count` and `game_ready_cell_count` are unchanged in all 6 manifests,
even where they disagree with `len(frames)`. Reason: the field definition is
not established, and the two anchor cases point in opposite directions:

- **Tiidebiite**: `frame_count` 15 vs `len(frames)` 17 is RECON-agreed with
  mirrors excluded (2 mirror cells `8mir`/`9mir` verified as exact flips).
  Under a "mirrors excluded" definition, 15 is CORRECT.
- **Sproutle**: `frame_count` 23 = `len(frames)` 23, and that 23 INCLUDES cell
  21 (`extra_top_view`, no atlas coords). Under a "manifest entries"
  definition, 23 is CORRECT — but then tiidebiite's 15 is wrong.
- **Dreadtoise** (this PR, unchanged): `frame_count` 24 = `len(frames)` 24
  while atlas tiles = 23 (cell 18 `extra_action_strip` has no coords) — a
  third behaviour: entries counted, no-coords entry included.

So "correct to len(frames)" is not proven and could break the reconciliation
agreement. The definition must be settled first (entries? tiles? mirrors
excluded? no-coords entries included?), then all fields fixed in one pass.

Mismatch table (fresh base, standalone-dir manifests; `fc` = frame_count,
`len` = len(frames), `grc` = game_ready_cell_count, `grT` = game_ready=true
count, `tiles` = frames with atlas coords). 18/51 creatures mismatch under
the naive `fc == len and grc == grT` reading:

| Creature | fc | len | grc | grT | tiles | Known cause (per audit) |
|----------|----|-----|-----|-----|-------|-------------------------|
| aerobeak | 11 | 12 | 11 | 12 | 11 | — |
| aquariios | 11 | 12 | 12 | 12 | 12 | — |
| ashemit | 8 | 9 | 8 | 9 | 8 | extra entry is `icon_derived` (no coords) |
| cragarm | 19 | 20 | 18 | 19 | 18 | extra entry is game_ready=false cell 18 |
| dorowani | 12 | 13 | 13 | 13 | 13 | — |
| duskfiend | 17 | 19 | 19 | 19 | 19 | — |
| gearkid | 17 | 20 | 18 | 20 | 19 | — |
| kickmaster | 18 | 20 | 20 | 20 | 20 | 2 walk_side_mirror entries |
| kittember | 24 | 25 | 24 | 25 | 24 | extra entry is `icon_derived` (no coords) |
| krakenox | 13 | 15 | 15 | 15 | 15 | split-pair extras 0a/0b, 6a/6b |
| megalochrome | 10 | 11 | 6 | 7 | 6 | `icon_derived` + no-coords effect frames |
| mythar | 19 | 20 | 20 | 20 | 20 | split-pair extra 12a/12b |
| shellguard | 13 | 14 | 13 | 14 | 13 | extra entry is `icon_derived` (no coords) |
| squirmite | 13 | 14 | 13 | 14 | 13 | extra entry is `icon_derived` (no coords) |
| strikechamp_unsuited_full | 28 | 30 | 30 | 30 | 30 | mirrors `7mir`/`11mir` excluded from fc |
| terrapod | 12 | 13 | 12 | 13 | 12 | extra entry is `icon_derived` (no coords) |
| tiidebiite | 15 | 17 | 17 | 17 | 17 | mirrors `8mir`/`9mir` excluded from fc (RECON-agreed) |
| toxitacle | 22 | 23 | 22 | 23 | 22 | extra entry is `icon_derived` (no coords) |

Separate pre-existing quirk, NOT changed here: `strikechamp/` on main also
contains copies of `strikechamp_unsuited.manifest.locked.json` and
`strikechamp_unsuited_full.manifest.locked.json` alongside the standalone
dirs; the copies differ by hash from the standalone manifests. The audits
used the standalone dirs. Whether the nested copies are stale duplicates to
remove is a separate decision — 0 deletions in this PR, so they stay.

## All open questions (for Mars)

1. Razorgater: is the clean2-only 62px shadow-ellipse cut idle-only, or
   should it also apply to locked atlas cell 4 on top of the 191px?
2. Sproutle: confirm the locked lineage's fuller clean stands for spotfree
   cells 0, 4, 12, 14, 15, 17, 18, 20 (no verbatim re-swap).
3. Dreadtoise scope: do the remaining walk cells (04, 05, 08, 09, 12, 13, 15,
   16, 20, 21, 22, 23) get the same rotation, or only the 6 mapped cells?
4. Duskfiend scope: roles for cells 15 (`walk_back_3`), 06 (`walk_front_2`),
   10 (`walk_front_3`), 04 (`overworld_back`) — no corrected mapping exists
   for them. And: if cells 11/12 are backs, do their mirrors `11mir`/`12mir`
   (currently `walk_side_mirror`) become `walk_back_mirror`?
5. Pupbble: approve relabelling 12/13/14 side → front roles (exact strings
   TBD) and 04/09 → side roles, and before or only after the walk-gate pick?
6. Pyromonk: approve relabelling 05/06 walk_back → front roles (exact
   strings TBD) and 27/28 walk_side → tumble/excluded roles, and before or
   only after the walk-gate pick?
7. Mechapion: approve cell 2 (`overworld_back`) as the standing battle_back
   fallback, or make a dedicated battle_back cell?
8. Tyrage walk roles (recorded, NOT changed here): if the walk gate picks
   the tyrage walk json, what do locked roles for cells 08, 11, 12, 16, 17
   become? (Walk json uses 08/12 as sides, 11 as a front, 16/17 as sides;
   current locked roles are 08 overworld_back_5, 11 overworld_back_8,
   12 overworld_back_9, 16 walk_back_0, 17 walk_back_1.)
9. Count-field definition (see above): entries, tiles, mirrors excluded,
   no-coords entries included — settle before any mechanical fix.
10. Oblivirex `draft=true` on its locked manifest — recorded in audit B;
    re-lock should confirm whether draft is still intended. (No change here.)

## Verification (build gate, before ship)

- Base: `relock/main` reset to `origin/main` = `023e0387`.
- Per-tile diffs exact: razorgater 191, sproutle 13/9/5/10/9/15 (= 61),
  tyrage 47; all locked-opaque → transparent, reverse 0px, other-visible 0px.
- Every other tile byte-identical; 0 differing pixels outside swapped tiles.
- Manifest diffs: roles exactly as tabled + `relock_2026_10_26` object +
  one appended `notes` line per changed creature; `version`,
  `frame_count`, `game_ready_cell_count`, frame order/coords untouched.
- All 6 shipped JSONs parse. Build script:
  `mochiichao-work/relock/build_relock.py` (324 checks PASS, 0 FAIL).
- Audits: `mochiichao-work/relock/audit-a.json`, `audit-b.json`,
  `audit-c.json` (+ `.md` versions).

## Files changed in this PR (10)

- `src/assets/sprite-atlases/razorgater/razorgater_atlas_64_locked.png`
- `src/assets/sprite-atlases/sproutle/sproutle_atlas_64_locked.png`
- `src/assets/sprite-atlases/tyrage/tyrage_atlas_64_locked.png`
- `src/assets/sprite-atlases/razorgater/razorgater.manifest.locked.json`
- `src/assets/sprite-atlases/sproutle/sproutle.manifest.locked.json`
- `src/assets/sprite-atlases/tyrage/tyrage.manifest.locked.json`
- `src/assets/sprite-atlases/ashemit/ashemit.manifest.locked.json`
- `src/assets/sprite-atlases/dreadtoise/dreadtoise.manifest.locked.json`
- `src/assets/sprite-atlases/duskfiend/duskfiend.manifest.locked.json`
- `sprite-art/LOCK-UPDATE-2026-10-26.md` (this note)
