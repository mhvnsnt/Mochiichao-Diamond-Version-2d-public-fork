# RECONCILIATION VERDICT — clean/ vs game-ready (Segment 2, local staging only)

Date: 2026-10-26. Scope: `sprite-art/atlases/<creature>/` (locked atlases, PR #30) vs
`sprite-art/game-ready/<creature>/` (retarget/gap-coordinator staging), ALL sets, cell-by-cell.
Method: file inventory + SHA-256 identity + full pixel diffs on every same-name cell pair
(808 pairs, 64×64 RGBA), manifest frame-by-frame comparison, icon accounting, atlas-size
comparison. No files deleted, nothing pushed to GitHub, `~/workspace/mochiichao-work/fresh-start`
untouched, no Blender, no Gabu-bake / Kaggle interference. All sheets are ORIGINAL CANON DRAFT
LIKENESSES; no file already shown to Mars was overwritten — this report only adds one new file.

## VERDICT: SHIP THE GAME-READY (LOCKED) VARIANT — 51/51 sets = 100%

Ship, per set: `<name>_atlas_64_locked.png` + `<name>.manifest.locked.json` + (only where the
locked manifest points into `icons/`) `icons/<name>_icon64.png`. That is the variant PR #30
already shipped for the 50 atlas sets, plus the same pattern for the 51st set below.
Do NOT ship the clean/ variant as a second atlas, and do NOT ship `*_atlas_64_clean.png`,
`*_atlas_64_locked_clean.png`, `*_clean` cells, or `*_shadowfree` cells alongside it — they are
conflicting duplicates, not a second canonical set (see §4).

Why game-ready wins, in one paragraph: the clean variant is the ORIGINAL manifest plus a
white-spot removal pass and nothing else — its frame list is identical to the original for
50/50 sets = 100%, so it still ships merged-pair cells as single poses, swapped front/back
roles, a walk pose labelled "icon", action strips and effect variants as ordinary walk frames,
and no menu icon at all for 9/50 sets. The locked variant fixes all of that (+23 frames:
5 splits + 8 mirrors + 10 derived icons, §2), carries a standalone icon for 51/51 sets = 100%,
and every one of its 826 cell-path manifest frames is present on disk (826/826 = 100%) with
0 missing frames across 836 locked frames. The clean variant's only advantage is pixel-level:
its cleanup removed 25,010 px that the locked cleanup did not (§3) — a real gap, but a
follow-up cleanup pass on NEW files, not a reason to ship the wrong roles.

## 1. Headline counts (all counts verified on disk this run)

| Count | Value |
|---|---|
| Sets in scope | 51 = 50 atlas sets + 1 game-ready-only set (strikechamp_unsuited_full) |
| Atlases top-level cells on disk | 823 (vs 813 original-manifest frames — the +10 are orphans, §5) |
| Clean cells on disk | 813/813 = 100% of clean-manifest frames |
| Game-ready cells on disk, 50 atlas sets | 900 (vs 826 manifest cell-path frames — the +74 are non-manifest extras, §4) |
| Game-ready cells on disk, 51 sets | 930 = 900 + 30 (unsuited_full) |
| Original / clean manifest frames | 813 |
| Locked manifest frames, 50 sets | 836 = 813 + 23 |
| Locked manifest frames, 51 sets | 866 = 836 + 30 (unsuited_full) |
| Locked game_ready=true, 50 sets | 822/836 = 98.3% |
| Locked game_ready=true, 51 sets | 852/866 = 98.4% |
| Locked non-default frames (game_ready=false) | 14/836 = 1.7%, in 8 sets (§2) |
| Locked manifest identical in atlases/ vs game-ready/ | 50/50 = 100% (byte-identical JSON) — the manifest is NOT a differentiator; clean vs locked is |
| Clean manifest frames identical to original manifest | 50/50 = 100% — clean fixes zero roles |
| Standalone menu icons, game-ready | 51/51 = 100% (`icons/<name>_icon64.png`, all 64×64) |
| Standalone menu icons, clean variant | 0/51 = 0% (atlases/ has no `icons/` dir at all) |
| Game-ready icon files on disk | 55 = 51 canonical + 4 `*_icon64_clean.png` duplicates (finblade, mechapion, mothrix, punchkid) |
| Game-ready manifest frames present on disk | 836/836 = 100% (826 cell-path + 10 icon-path, 0 missing) |
| Same-name cell pairs pixel-compared | 808 pairs (unsuited_full excluded — it has no clean counterpart) |
| Original top cells byte-identical to game-ready cells | 604/808 = 74.8% (differing 204/808 = 25.2%, total diff 15,355 px — exactly the game-ready build report's cleared-px total, which validates the comparison) |
| Clean cells byte-identical to game-ready cells | 360/808 = 44.6% (differing 448/808 = 55.4%, total diff 40,365 px) |
| Sets where clean atlas PNG size != locked atlas PNG size | 5/50 = 10% (cragarm, dorowani, duskfiend, kickmaster, megalochrome — grid changed because frames were added/removed) |
| Whole-atlas image diff, locked vs clean (45 comparable sets) | 45/45 = 100% differ, 539,207 px total — layout-shifted, so this is NOT a per-pose measure; the cell-level numbers above are the honest measure |
| Locked atlas tile vs its own cell (812 tiles) | mean 184.5 px/tile differ (149,786 px total); 794/812 tiles in the 101–400 px band — same pose, edge-pixel-level rebuild differences, not different poses (sample: mochii frame 0 tile vs cell = 134 px, same centre pixel) |
| Clean atlas tile vs its own cell (813 tiles) | mean 717.2 px/tile differ (583,089 px total) — the clean atlas tracks its own cells ~3.9× worse than the locked atlas tracks its cells |
| `*_atlas_64_locked_clean.png` present | 13/50 sets = 26% (duneclaw, duskfiend, finblade, floatcalf, gearkid, mechapion, megalochrome, mothrix, punchkid, terradog, tyrage, wispkin, zephling); each differs from its locked atlas by only 76–565 px (3,164 px total) — near-duplicates, not a third variant |

### The "811 cells" claim, reconciled (every cited number explained)
- 811 = the game-ready build report's `game_ready` sum BEFORE the Krakenox cell-6 split (stale by 1).
- 812 = after that split (build-report basis).
- 822 = locked `game_ready=true` frames across the 50 atlas sets (812 + 10 derived-icon frames, which the build report did not count as cells).
- 852 = locked `game_ready=true` frames across all 51 sets (822 + 30 unsuited_full).
- 930 = game-ready `cells/` PNGs on disk across 51 sets (856 manifest cell-path frames + 74 non-manifest extras in the 50 atlas sets). Disk PNGs ≠ manifest frames; do not quote 930 as a frame count.

## 2. What exactly differs — manifest roles (the loser's defects)

Locked vs original (= clean, since clean changes no roles) frame arithmetic, 50 sets:
+23 frames = 5 merged-pair splits + 8 mirror frames + 10 derived-icon frames. No other count change.

- **Splits — 5 cells in 4 sets, 4/50 = 8% of sets:** aquariios cell 0, dorowani cell 1,
  krakenox cells 0 and 6, mythar cell 12. Each clean cell contains TWO figures; the locked
  variant ships two single-figure cells (`*_cell_00a/00b`, `01a/01b`, `06a/06b`, `12a/12b`).
  Clean ships the merged pair as one pose — wrong in game.
- **Mirrors — 8 frames in 4 sets, 4/50 = 8%:** duskfiend 11mir/12mir, gearkid 5mir/8mir,
  kickmaster 9mir/10mir, tiidebiite 8mir/9mir (plus unsuited_full 7mir/11mir). Clean has no
  opposite-side walk frame for these.
- **Front/back corrections — 3 sets:** ashemit cells 0/1 swapped (face vs no-face),
  dorowani cell 0 corrected to battle_front, manticlaw cell 0 corrected to battle_front and
  cell 3 promoted to battle_back. Clean ships the swapped roles.
- **Icon corrections — 10 derived-icon sets, 10/50 = 20%, plus 2 mislabels:** aerobeak,
  ashemit, cragarm, gearkid, kittember, megalochrome, shellguard, squirmite, terrapod,
  toxitacle have NO icon frame in the clean/original manifest at all for 9 of them (all
  except squirmite, whose "icon" cell 10 is actually a walk-side caterpillar, relabelled
  walk_side_3 in locked) — locked adds a head-crop `icon_derived` frame pointing at
  `icons/<name>_icon64.png`. Duskfiend cell 9 is labelled walk_back_1 in clean but is the
  icon (skull-face head) in locked. For the other 41/51 sets the game-ready icon file is
  byte-identical to the locked icon cell (41/41 = 100%) — no new art, just a standalone copy.
- **Non-default relabels — 14 frames in 8 sets, 8/50 = 16%:** cragarm 18 and dreadtoise 18
  (wide action strips, not walk frames), floatcalf 4/5/7/8 (ring-effect variants),
  megalochrome 0/1/4/5 (ripple-ring variants), mechapion 0 (glow-ring battle pose),
  pixilite 10 (hex-framed variant), sproutle 21 (hex-framed top-down view),
  yogiferno 14 (fire-platform walk variant). Clean presents all 14 as ordinary default
  frames; locked keeps the files on disk but flags them game_ready=false so the game
  does not use them as defaults.
- **Sets with ANY lock correction vs clean:** 24/50 = 48%. Sets with no lock correction:
  26/50 = 52% (astroleviathan, chromejaww, cocoonode, duneclaw, finblade, gabu, gorokappa,
  inklet, mochii, mothrix, oblivirex, pebblefist, punchkid, pupbble, pyromonk, pyropaw,
  quakehound, razorgater, reaperdile, stormtalon, strikechamp, strikechamp_unsuited,
  terradog, tyrage, wispkin, zephling) — for these 26, clean and locked differ ONLY in
  cleanup pixels (§3), not roles. Even there, game-ready is still the ship choice because
  it is the variant with the icon file and the locked manifest.
- **Stale count fields inside the locked manifest (pre-existing, in both copies):**
  `frame_count` != locked frame count for 17/50 sets = 34% (it still carries the original
  count); `game_ready_cell_count` != game_ready=true count for 10/50 sets = 20% (it
  excludes the derived-icon frame). Unsuited_full: `frame_count` 28 vs 30 frames.
  The frame LISTS are correct and identical in both copies; only these two summary fields
  are stale. Fix them only in a NEW ship-manifest file (canon rule: never overwrite a file
  already shown to Mars) — see merge plan §6.

## 3. What exactly differs — pixels (the loser's only advantage, and its size)

Three-way comparison on the 808 same-name pairs (original top cell vs clean cell vs
game-ready cell), counting pixels that differ from the original:

- Clean-only changed pixels: **25,010 px** (pixels the clean pass removed that the locked
  pass kept). Cells carrying only-clean changes: 313.
- Game-ready-only changed pixels: **3,353 px**. Cells carrying only-game-ready changes: 25.
- Changed by both passes: **12,002 px**.
- Clean pass total measured on cells: 37,012 px; clean changelog claims 37,065 px
  (`atlas_applied_px` summed over 50 manifests, 441 changed cells, 372 unchanged) —
  residual 53 px = 0.14%, unexplained at this granularity (atlas-level rounding or a
  changelog/cell mismatch); flagged, not hidden.
- Game-ready pass total: 15,355 px = build-report cleared total exactly (validates both).

Reading: the two cleanups are DIFFERENT passes with different gates (clean: interior +
sheet-background colour match, `atlases/_tools/clean_atlas.py`; game-ready: its own
near-sheet-background pass in `game-ready/build_game_ready.py`), not the same pass applied
twice. The clean pass is the more aggressive one. Largest clean-vs-locked cell diffs:
zephling 3,891 px, inklet 3,165 px, megalochrome 3,121 px, yogiferno 2,833 px,
chromejaww 2,312 px, mythar 2,225 px, mechapion 2,175 px. For inklet, cocoonode (1,328 px)
and finblade (888 px) the game-ready pass cleared 0 px while clean changed every cell —
so the locked atlas retains whatever the clean pass removed there. Whether those pixels
are trapped sheet background (good removal) or light design detail (bad removal) CANNOT
be decided from counts — it needs eyes (§5, item 1). It does not change the winner:
roles + icons outweigh a white-spot question, and a cleanup can be re-applied to the
locked cells later as NEW files, while wrong roles cannot be fixed by re-cleaning.

Sets where clean and game-ready cells are fully identical: cragarm 19/19, pebblefist 13/13,
pupbble 21/21, pyropaw 15/15, shellguard 13/13, squirmite 13/13 (same-name pairs only;
splits/mirrors/derived icons are separate files).

## 4. What exactly differs — file inventory (extras on each side)

**Game-ready disk extras NOT in any locked manifest (50 atlas sets): 74 files.**
- 52 `*_cell_NN_clean.png` duplicates (duneclaw 4, duskfiend 1, finblade 7, floatcalf 3,
  gearkid 2, mechapion 1, megalochrome 3, mothrix 3, oblivirex 1, punchkid 1,
  razorgater 8, reaperdile 4, tyrage 4, wispkin 3, zephling 7).
- 22 `*_cell_NN_shadowfree.png` files (aerobeak 6, kittember 14, razorgater 2) — a
  shadows-lane variant, NOT the default; see §5 item 3.
- Plus the 4 `*_icon64_clean.png` duplicates and 13 `*_atlas_64_locked_clean.png`
  near-duplicates (§1). None of these 74 + 4 + 13 files is referenced by any locked
  manifest. Ship none of them; keep them on disk (do not delete either variant).

**Clean-side extras NOT in the locked variant:** the whole `clean/` dir (813 cells),
`*_atlas_64_clean.png` (50/50 sets), and `*.manifest-clean.json` (50/50 sets) — all
superseded by the locked equivalents for role reasons (§2), even though 25,010 px of
their cleanup is not in the locked cells (§3).

**The 51st set — strikechamp_unsuited_full:** NO atlases/ counterpart at all (no clean
dir, no clean manifest, no clean atlas). Game-ready only: 30 cells, 30/30 game_ready,
1 icon (byte-identical copy of its icon cell 06), locked atlas 384×320, locked manifest
with `frame_count` 28 vs 30 frames (pre-existing mismatch, see §2). It ships ONLY under
the Segment 6 Strikechamp designation (suited = default, helmeted lower-only = regular,
no-helmet full = rare shiny ~10%) — this verdict does not re-decide that designation.

## 5. Orphans — files in NEITHER manifest (need Mars's eyes, §7 item 2)

Atlases top-level cells not in any manifest: 10 files in 3 sets, 6 unique images
(tiidebiite's 8 files are 4 unique images, each duplicated once — byte-identical pairs
15=19, 16=20, 17=21, 18=22):
- manticlaw_cell_16.png (8,755 bytes, unique)
- tiidebiite_cell_15.png / 16 / 17 / 18 (+ duplicates 19 / 20 / 21 / 22)
- tyrage_cell_19.png (8,467 bytes, unique)
The clean/ dir does NOT contain them (clean = 813 manifest frames exactly) and
game-ready does NOT contain them either. They are unshipped in both variants.

## 6. Merge plan — what the winning (game-ready) variant still needs

Ship ONE variant per set, from game-ready staging, with these additions — all as NEW
files where a shown file would otherwise be overwritten, per the canon rule:

1. **Ship files (per set):** `<name>_atlas_64_locked.png` + `<name>.manifest.locked.json`
   + `icons/<name>_icon64.png` ONLY for the 10 derived-icon sets (aerobeak, ashemit,
   cragarm, gearkid, kittember, megalochrome, shellguard, squirmite, terrapod, toxitacle).
   For the other 41 sets the icon is already an atlas cell, so the standalone icon file
   is a convenience copy, not a ship requirement. Total ship payload: 51 atlases +
   51 manifests + 10 required icons = 112 files (or 153 files if the 41 icon copies
   are included for menu convenience).
2. **Do NOT ship:** `*_atlas_64_clean.png`, `*_atlas_64_locked_clean.png`,
   `clean/` cells, `*_cell_NN_clean.png`, `*_cell_NN_shadowfree.png`,
   `*_icon64_clean.png`, or the 10 orphan top-level cells (§5) — until their owning
   lanes / Mars decide them. Keep all of them on disk; nothing in this verdict deletes
   anything.
3. **New ship-manifest (NEW filename, e.g. `<name>.manifest.ship.json`):** copy the
   locked manifest verbatim except correct the two stale summary fields
   (`frame_count` → locked frame count, `game_ready_cell_count` → game_ready=true
   count) for the 17/50 + 10/50 affected sets and unsuited_full (28 → 30). Do NOT
   edit `<name>.manifest.locked.json` in place — it is already shown / on main via PR #30.
   If the parent prefers verbatim manifests, ship the locked manifests as-is and note
   the stale fields in the PR description instead; the frame lists are correct either way.
4. **Follow-up cleanup (NEW files only, after eyes — §7 item 1):** re-run a cleanup pass
   over the locked cells and write it as a distinct variant (e.g. `_clean2` cells +
   atlas, as Segment 3 did for Razorgater idle) covering the 25,010 clean-only pixels,
   ONLY for cells Mars/eyes confirm are trapped background. Do not overwrite locked
   cells, and do not import clean cells wholesale — clean cells carry the wrong roles.
5. **Orphan decision (§7 item 2):** if Mars confirms any of the 6 unique orphan images
   are real poses, add them as NEW locked frames (new cell numbers, new manifest
   version); otherwise leave them unshipped on disk.
6. **No other gaps in the winner:** icons 51/51 = 100%, manifest frames present
   836/836 = 100%, splits 5/5, mirrors 8/8 (+2 unsuited_full), derived icons 10/10 —
   all present in game-ready staging. Nothing else needs to be pulled from clean/.

## 7. Needs Mars's eyes (show-first — NOT decided here)

1. **Clean-only pixels (25,010 px, §3):** show locked vs clean cells side-by-side for
   inklet, zephling, cocoonode, megalochrome, yogiferno — is the clean pass removing
   trapped sheet background or eating light design detail? This decides merge-plan item 4.
2. **Orphan cells (§5):** show manticlaw_cell_16, tiidebiite_cell_15–18, tyrage_cell_19 —
   real poses to add, or staging duplicates/junk to leave unshipped?
3. **Shadowfree cells (22 files):** aerobeak, kittember, razorgater shadowfree variants
   sit in game-ready/cells/ but are NOT the locked default — Segment 3 (Razorgater
   _clean2) owns the shadow decision; do not adopt them here.
4. **Derived-icon head crops (10 sets, §2):** eyeball the 10 `icons/*_icon64.png`
   crops before ship — they are crops, not atlas cells, and were never a clean-variant
   option (clean has no icons at all).
5. **Stale manifest count fields (§2/§6 item 3):** fix in a new ship manifest, or ship
   verbatim with a PR note? Parent/Mars call — either way the frame lists ship unchanged.
6. **Strikechamp designation:** unsuited_full ships only under the Segment 6 ruling
   (suited default / helmeted lower-only regular / no-helmet full rare shiny ~10%) —
   not re-decided by this segment.

## 8. Per-set table (disk counts + manifest counts + pixel identity)

Columns: A-top = atlases top-level cells, A-clean = atlases/clean/ cells,
G-disk = game-ready/cells/ PNGs, OrigFr = original-manifest frames, LockFr =
locked-manifest frames, GRtrue = locked game_ready=true frames, Icons =
game-ready/icons/ PNGs, C=G identical = clean cells byte-identical to game-ready
cells (same-name pairs), T=G identical = original top cells byte-identical to
game-ready cells, C-G diff px = total differing pixels clean-vs-game-ready
(same-name pairs), G-extra = game-ready cell files not in the locked manifest.

| Creature | A-top | A-clean | G-disk | OrigFr | LockFr | GRtrue | Icons | C=G identical | T=G identical | C-G diff px | G-extra |
|---|---|---|---|---|---|---|---|---|---|---|---|
| aerobeak | 11 | 11 | 17 | 11 | 12 | 12 | 1 | 0/11 | 2/11 | 681 | 6 |
| aquariios | 11 | 11 | 12 | 11 | 12 | 12 | 1 | 8/10 | 10/10 | 10 | 2 |
| ashemit | 8 | 8 | 8 | 8 | 9 | 9 | 1 | 2/8 | 4/8 | 177 | 0 |
| astroleviathan | 16 | 16 | 16 | 16 | 16 | 16 | 1 | 15/16 | 15/16 | 640 | 0 |
| chromejaww | 21 | 21 | 21 | 21 | 21 | 21 | 1 | 0/21 | 5/21 | 2312 | 0 |
| cocoonode | 11 | 11 | 11 | 11 | 11 | 11 | 1 | 0/11 | 11/11 | 1328 | 0 |
| cragarm | 19 | 19 | 19 | 19 | 20 | 19 | 1 | 19/19 | 19/19 | 0 | 0 |
| dorowani | 12 | 12 | 13 | 12 | 13 | 13 | 1 | 2/11 | 7/11 | 218 | 2 |
| dreadtoise | 24 | 24 | 24 | 24 | 24 | 23 | 1 | 10/24 | 24/24 | 82 | 0 |
| duneclaw | 19 | 19 | 23 | 19 | 19 | 19 | 1 | 3/19 | 11/19 | 715 | 4 |
| duskfiend | 17 | 17 | 20 | 17 | 19 | 19 | 1 | 5/17 | 9/17 | 1746 | 3 |
| finblade | 11 | 11 | 18 | 11 | 11 | 11 | 2 | 0/11 | 11/11 | 888 | 7 |
| floatcalf | 11 | 11 | 14 | 11 | 11 | 7 | 1 | 2/11 | 11/11 | 1214 | 3 |
| gabu | 20 | 20 | 20 | 20 | 20 | 20 | 1 | 19/20 | 20/20 | 8 | 0 |
| gearkid | 16 | 16 | 20 | 16 | 19 | 19 | 1 | 0/16 | 7/16 | 842 | 4 |
| gorokappa | 19 | 19 | 19 | 19 | 19 | 19 | 1 | 12/19 | 19/19 | 186 | 0 |
| inklet | 11 | 11 | 11 | 11 | 11 | 11 | 1 | 0/11 | 11/11 | 3165 | 0 |
| kickmaster | 18 | 18 | 20 | 18 | 20 | 20 | 1 | 6/18 | 12/18 | 953 | 2 |
| kittember | 24 | 24 | 38 | 24 | 25 | 25 | 1 | 10/24 | 21/24 | 210 | 14 |
| krakenox | 13 | 13 | 15 | 13 | 15 | 15 | 1 | 4/11 | 11/11 | 84 | 4 |
| manticlaw | 17 | 16 | 16 | 16 | 16 | 16 | 1 | 6/16 | 16/16 | 116 | 0 |
| mechapion | 21 | 21 | 22 | 21 | 21 | 20 | 2 | 0/21 | 18/21 | 2175 | 1 |
| megalochrome | 10 | 10 | 13 | 10 | 11 | 7 | 1 | 0/10 | 2/10 | 3121 | 3 |
| mochii | 19 | 19 | 19 | 19 | 19 | 19 | 1 | 13/19 | 19/19 | 42 | 0 |
| mothrix | 18 | 18 | 21 | 18 | 18 | 18 | 2 | 15/18 | 18/18 | 97 | 3 |
| mythar | 19 | 19 | 20 | 19 | 20 | 20 | 1 | 0/18 | 11/18 | 2225 | 2 |
| oblivirex | 14 | 14 | 15 | 14 | 14 | 14 | 1 | 0/14 | 3/14 | 1289 | 1 |
| pebblefist | 13 | 13 | 13 | 13 | 13 | 13 | 1 | 13/13 | 13/13 | 0 | 0 |
| pixilite | 12 | 12 | 12 | 12 | 12 | 11 | 1 | 10/12 | 12/12 | 11 | 0 |
| punchkid | 12 | 12 | 13 | 12 | 12 | 12 | 2 | 3/12 | 11/12 | 440 | 1 |
| pupbble | 21 | 21 | 21 | 21 | 21 | 21 | 1 | 21/21 | 21/21 | 0 | 0 |
| pyromonk | 30 | 30 | 30 | 30 | 30 | 30 | 1 | 22/30 | 26/30 | 292 | 0 |
| pyropaw | 15 | 15 | 15 | 15 | 15 | 15 | 1 | 15/15 | 15/15 | 0 | 0 |
| quakehound | 17 | 17 | 17 | 17 | 17 | 17 | 1 | 2/17 | 7/17 | 1385 | 0 |
| razorgater | 17 | 17 | 27 | 17 | 17 | 17 | 1 | 0/17 | 6/17 | 1826 | 10 |
| reaperdile | 11 | 11 | 15 | 11 | 11 | 11 | 1 | 0/11 | 2/11 | 1345 | 4 |
| shellguard | 13 | 13 | 13 | 13 | 14 | 14 | 1 | 13/13 | 13/13 | 0 | 0 |
| sproutle | 23 | 23 | 23 | 23 | 23 | 22 | 1 | 9/23 | 15/23 | 257 | 0 |
| squirmite | 13 | 13 | 13 | 13 | 14 | 14 | 1 | 13/13 | 13/13 | 0 | 0 |
| stormtalon | 11 | 11 | 11 | 11 | 11 | 11 | 1 | 6/11 | 6/11 | 297 | 0 |
| strikechamp | 25 | 25 | 25 | 25 | 25 | 25 | 1 | 24/25 | 24/25 | 269 | 0 |
| strikechamp_unsuited | 26 | 26 | 26 | 26 | 26 | 26 | 1 | 16/26 | 26/26 | 460 | 0 |
| terradog | 18 | 18 | 18 | 18 | 18 | 18 | 1 | 2/18 | 4/18 | 825 | 0 |
| terrapod | 12 | 12 | 12 | 12 | 13 | 13 | 1 | 1/12 | 5/12 | 607 | 0 |
| tiidebiite | 23 | 15 | 17 | 15 | 17 | 17 | 1 | 11/15 | 14/15 | 49 | 2 |
| toxitacle | 22 | 22 | 22 | 22 | 23 | 23 | 1 | 18/22 | 22/22 | 17 | 0 |
| tyrage | 20 | 19 | 23 | 19 | 19 | 19 | 1 | 4/19 | 12/19 | 661 | 4 |
| wispkin | 10 | 10 | 13 | 10 | 10 | 10 | 1 | 6/10 | 8/10 | 376 | 3 |
| yogiferno | 18 | 18 | 18 | 18 | 18 | 17 | 1 | 0/18 | 1/18 | 2833 | 0 |
| zephling | 11 | 11 | 18 | 11 | 11 | 11 | 1 | 0/11 | 1/11 | 3891 | 7 |
| strikechamp_unsuited_full | — (no atlases dir) | — | 30 | — | 30 | 30 | 1 | — (no clean counterpart) | — | — | 0 |

Notes on the table: manticlaw A-top 17 vs OrigFr 16 = orphan cell 16. Tiidebiite A-top 23
vs OrigFr 15 = orphan cells 15–22. Tyrage A-top 20 vs OrigFr 19 = orphan cell 19.
Tiidebiite and tyrage A-clean counts (15, 19) match their manifests — the orphans exist
only at atlases top level. G-extra counts are the §4 extras (clean duplicates +
shadowfree); split/mirror cells are IN the locked manifest, so they are not extras.
Aquariios/dorowani/krakenox/mythar C=G and T=G denominators are smaller than their
cell counts because split halves have new filenames with no same-name counterpart.
