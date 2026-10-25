# Atlas cleanup report — surgical white-background removal

Date: 2026-10-25. Ordered by Mars ~18:16 CDT replying to the atlas
presentation (Mochii, Wispkin, Pyromonk): atlases look good, but Pyromonk
("monkey guy") has a few WHITE SPOTS between his legs that need cutting
out — small focused surgical cuts only, no scrapping, no hand-tooling,
open-source scripting only. Applied to ALL atlases, not just Pyromonk.

## Tools (open source only)
- Pillow 10.2.0 + numpy 1.26.4. No OpenCV on this VM (not installed for
  this task); no paid tools; no image-editor hand edits; no regeneration
  from sheets; no re-extraction.
- Script: `atlases/_tools/clean_atlas.py` (usage: `clean_atlas.py [--all |
  <creature> ...] [--force]`).

## Diagnosis (before cutting anything)
Pyromonk inspected programmatically AND by eye (cells enlarged 4x with
candidate regions highlighted magenta):
- 8 cells with trapped near-white cream components, all mean RGB
  ~246–251, 246–249, 241–245 — i.e. the source sheet's background colour
  (corner median of the Pyromonk source sheet: 247, 246, 240), NOT a
  design colour. Pyromonk has no white fur; its design whites do not
  exist, and its gold markings/flames are high-chroma and excluded.
- Confirmed trapped spots: cell 04 (64 px, arm/torso junction), cell 12
  (37 px, vertical strip BETWEEN THE LEGS, back view — exactly the spot
  Mars flagged), cell 14 (21 + 4 px), cell 19 (10 px), cell 25 (12 px),
  cell 26 (47 px, chest/arm junction), cell 27 (85 px, torso/leg gap in
  cartwheel pose), cell 29 (5 + 7 px). Total 292 px.
- The same artifact class exists across the roster: enclosed
  sheet-background patches the original extraction left behind because
  extraction only removed border-connected background.

## Method (final, after one corrected mistake)
A candidate pixel must pass ALL gates, or it is kept:
1. Near-background: opaque (alpha >= 200), min(R,G,B) >= 215,
   (max-min) <= 30.
2. Component 3–400 px, not touching the cell border.
3. FULLY INTERIOR: every 4-neighbour of every component pixel is opaque.
4. Colour match: component mean within 25/channel of that creature's
   own source-sheet background (corner median).

Atlas handling: the clean atlas starts from the ORIGINAL atlas and
applies ONLY the cut masks. (First rebuild attempt reassembled the
atlas from cells and changed ~805 extra edge pixels the original atlas
build had dropped; that output was discarded and the method fixed —
verified afterwards: clean atlas differs from original by exactly the
cut pixels, alpha-only, zero RGB changes.)

### Two honest corrections during this task
- v1 of the script used a flood-fill "gap test" (removed patch must
  connect to border). That test was WRONG: trapped background in a
  silhouette is enclosed by definition, so v1 cut 0 px on Pyromonk. The
  test was replaced by the fully-interior + colour-match gates above,
  and v1's zero-change Pyromonk outputs were overwritten with --force.
- The script first named strikechamp_unsuited's clean outputs from the
  creature field ("strikechamp") instead of the manifest stem. The
  misnamed files were deleted and the dir re-run; outputs are now
  `strikechamp_unsuited_atlas_64_clean.png` /
  `strikechamp_unsuited.manifest-clean.json`, diff verified 460
  alpha-only px. No other dir mismatches (checked all 50).

## Results — 50/50 atlases cleaned, originals untouched
- Changed cells: 441. Removed pixels: 37,065. Kept surface components:
  595 (white design kept: fur, masks, bellies, glow — never cut).
  Skipped components: 5 (border-touching / oversize, flagged in the
  manifests, not cut).
- Every creature dir now holds `<stem>_atlas_64_clean.png`,
  `<stem>.manifest-clean.json` (original manifest + clean_changelog),
  and `clean/` with every cell. Original atlas PNGs, manifests, and
  per-cell PNGs were never written to (originals still present in all
  50 dirs; Pyromonk original mtime predates this run).
- Zero-change dirs (no trapped background found, clean files still
  written, content identical): cragarm, pebblefist, pupbble, pyropaw,
  shellguard, squirmite.

Per-creature changed cells / removed px:
aerobeak 10/599, aquariios 2/10, ashemit 6/177, astroleviathan 1/628,
chromejaww 21/2301, cocoonode 11/1328, cragarm 0/0, dorowani 9/218,
dreadtoise 14/82, duneclaw 16/715, duskfiend 12/1733, finblade 11/888,
floatcalf 9/1214, gabu 1/8, gearkid 16/842, gorokappa 7/186,
inklet 11/3165, kickmaster 12/918, kittember 14/205, krakenox 7/84,
manticlaw 10/116, mechapion 21/2127, megalochrome 10/2925,
mochii 6/42, mothrix 3/97, mythar 19/2188, oblivirex 10/621,
pebblefist 0/0, pixilite 2/11, punchkid 9/440, pupbble 0/0,
pyromonk 8/292, pyropaw 0/0, quakehound 13/960, razorgater 17/1808,
reaperdile 11/1325, shellguard 0/0, sproutle 14/254, squirmite 0/0,
stormtalon 5/284, strikechamp 1/125, strikechamp_unsuited 10/460,
terradog 16/795, terrapod 11/597, tiidebiite 4/45, toxitacle 4/17,
tyrage 15/661, wispkin 4/369, yogiferno 17/1995, zephling 11/3210.

Large-removal notes (eye-checked, not blind): inklet (jar interiors),
zephling (wing/body gaps), megalochrome (mouth/fin gaps), chromejaww
and mythar (limb/wing gaps) — all checked below; no design eaten.

## Verification by eye (12 atlases, incl. all problem classes)
- Pyromonk clean atlas + enlarged cleaned cells 04, 12, 27: white
  patches gone, gaps now transparent; crimson fur, gold markings,
  flames, faces intact.
- Clean atlases read in full: inklet, zephling, megalochrome,
  chromejaww, mythar, mechapion, mochii, wispkin, dorowani, gabu,
  tiidebiite. In every one: no holes in bodies, white design kept
  (Zephling white bellies, Wispkin white masks, Mythar cream bodies,
  Yogiferno-class fur kept via the kept-component gate), flames/rings/
  shells/teeth intact.
- Cell counts unchanged in every atlas (clean manifests carry the
  original frame lists). No creature reverted as unfixable-by-script;
  nothing was shipped damaged. The 5 skipped components are logged in
  their manifests for a future look, not silently cut.
- NOT pushed, NOT wired into the game: clean atlases are local staging
  in `atlases/<creature>/` until a push batch adopts them.
