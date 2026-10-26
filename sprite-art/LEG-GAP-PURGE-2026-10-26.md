# LEG-GAP PURGE — 2026-10-26 (Mars authorized ~14:01 CDT: all 140 edited cells confirmed good)

Deletion + rename to locked names, shipped as content updates at existing repo paths.
Old blobs remain in git history; this PR makes 0 deletions and rewrites no history.

Branch: `feature/leg-gap-purge-20261026` — base main head (branch point, after PR #187 docs-only merge): `d75a5e74309e3f7213b5025fb584e6f5f63fecca`.

## Repo-path mapping correction (read first)

The audit table's `atlases/<creature>/<creature>_cell_XX.png` paths are the LOCAL
staging copies under `sprite-art/atlases/` in the workspace. On main, `sprite-art/atlases/`
holds only `_tools/` and the Sproutle spotfree files — the 140 atlas cell files do NOT
exist as repo paths, so they were NOT created as 140 new unreferenced files.
The live repo copies of each locked cell are:
- `sprite-art/game-ready/<creature>/cells/<creature>_cell_XX.png` (the cell file), and
- the locked atlas sheet tile for that cell in BOTH
  `sprite-art/game-ready/<creature>/<creature>_atlas_64_locked.png` and
  `src/assets/sprite-atlases/<creature>/<creature>_atlas_64_locked.png`
  (the game loads ONLY the `src/assets` sheet, sliced by `*.manifest.locked.json` atlas_x/y).
Sheet tiles were verified to follow the game-ready cells on visible pixels (alpha >= 200);
exact-RGBA comparison is invalid here because sheets zero the RGB of fully transparent
pixels while extracted cells carry junk RGB at alpha 0 (see `atlases/_tools/rebuild_atlases.py`).
Rebuilt sheet tiles paste the approved replacement with transparent RGB zeroed to sheet
convention; every other tile is visible-identical to the original sheet, and pixels
outside replaced tiles are byte-identical. No manifest, code, or other file changed.

## Per-creature counts (cells in scope / game-ready cells updated / already correct / sheets updated)

| Creature | Cells | GR cells updated | Already correct | Sheets (GR + src) |
|---|---|---|---|---|
| aerobeak | 5 | 3 | 2 | 2 (1 + 1) |
| ashemit | 4 | 4 | 0 | 2 (1 + 1) |
| chromejaww | 15 | 11 | 4 | 2 (1 + 1) |
| dorowani | 7 | 3 | 4 | 2 (1 + 1) |
| duneclaw | 16 | 12 | 4 | 2 (1 + 1) |
| kickmaster | 1 | 1 | 0 | 2 (1 + 1) |
| mythar | 14 | 13 | 1 | 2 (1 + 1) |
| oblivirex | 13 | 11 | 2 | 2 (1 + 1) |
| pyromonk | 2 | 1 | 1 | 2 (1 + 1) |
| quakehound | 16 | 15 | 1 | 2 (1 + 1) |
| razorgater | 5 | 5 | 0 | 2 (1 + 1) |
| reaperdile | 8 | 5 | 3 | 2 (1 + 1) |
| sproutle | 3 | 1 | 2 | 2 (1 + 1) |
| terradog | 7 | 3 | 4 | 2 (1 + 1) |
| terrapod | 10 | 4 | 6 | 2 (1 + 1) |
| tiidebiite | 1 | 1 | 0 | 2 (1 + 1) |
| tyrage | 13 | 11 | 2 | 2 (1 + 1) |
| **Total** | **140** | **104** | **36** | **34** |

Game-ready overlap (audit table, 140-cell set): 87 cells
also defective in their game-ready copy; the rest were atlas-only defects plus sliver
differences (1–3 px whole-notch leftovers fixed in the confirm pack) — every cell whose
repo blob differed from its approved replacement was updated, in both the cell file and
both sheet tiles, regardless of the detector-only overlap flag.

## Exclusions — never touched

- Yogiferno (14 cells): Mars-exempt, cream-fur/design white, detector error.
- Pixilite (1 cell) and Mechapion (5 cells): Mars-ruled good as-is. Their staged
  replacements exist locally but were NOT shipped in this PR.
- Design whites: Mythar orbit ring / wing loops / leg fur, Wispkin smoke, and all other
  audit-excluded whites. Mythar replacements keep the ring/loop/fur pixels untouched.
- Nothing outside the 140-cell table: no manifests, no game code, no _clean or
  _shadowfree sheets, no icons, no idle/hurt/attack animation sets, no other creatures.

## Scope boundaries / follow-ups (not in this PR)

- Local staging `sprite-art/atlases/<creature>/` cells still hold the old defective
  pixels on disk (this PR ships via GitHub Contents API only; no work-clone changes).
  A staging sync, if wanted, is a separate step.
- Animation sets derived from defective battle_front cells (idle/hurt/attack transforms)
  were NOT touched: they are outside the 140-cell table and need their own Mars call.
- This PR fixes the game-visible sheets; a live playtest after the next publish is still
  owed to confirm the gaps are gone on screen (not claimed here).

