# ATLAS LOCK REPORT — Phase 2 lock completion (2026-10-25)

Scope: the 50 atlases in `sprite-art/atlases/` (49 creatures + Strikechamp
unsuited variant), 813 original cells, plus the 51st game-ready set
(Strikechamp unsuited-full, built by the lock pass from the full unsuited
sheet). Locked manifests are NEW files (`*.manifest.locked.json`); no
original manifest or atlas was overwritten.

## What was already locked before this session

A prior lock pass had already cleared `role_unconfirmed` to `[]` in all 50
locked manifests, eye-confirming battle_front / battle_back / icon per
atlas (50/50 = 100%), and had recorded these named decisions:

- Squirmite cell 10: icon → walk_side_3 (horizontal side caterpillar,
  not an icon). FIXED, carried forward unchanged.
- Duskfiend cell 9: walk_back_1 → icon (skull-face head with purple
  flames, QA head mid-right). CONFIRMED, carried forward unchanged.
- Merged pairs SPLIT: Krakenox cell 0 (0a front red-eye / 0b back spiky),
  Mythar cell 12 (12a / 12b side poses), Dorowani cell 1, Aquariios cell 0.
  Keeping them would ship two-creature frames.
- Swaps/corrections: Ashemit BF/BB swap, Dorowani cell 0 → battle_front,
  Manticlaw cell 0 → battle_front (true back = cell 3), Mechapion ringed
  cell 0 → extra (game BF = clean cell 1, BB = cell 2).
- Judgement (faceless, front/back indistinguishable by eye): Cocoonode,
  Pixilite — kept as labelled, flagged in the manifest, not silently fixed.
- Provisional: Gearkid battle_back (eyes visible at 64px, key visible) —
  re-verify at sheet resolution before shipping battle.

## What this session closed (the one gap left in the named decisions)

- **Krakenox cell 6: SPLIT (was left unsplit by the first lock pass).**
  Eye-check at 512px upscale of the original cell shows TWO whole figures:
  left = front (red eye, gold-tinged tentacle base), right = back (spiky,
  no face) — the same front/back pair pattern as cell 0. Decision: SPLIT,
  same method as the other splits (64px cell halves, centred, no rescale).
  New cells: 06a = overworld_front_4 (front half), 06b = overworld_back_2
  (back half). Both verified as clean singles at 512px. Krakenox game-ready
  cells: 14 → 15. Total game-ready cells: 811 → 812.
  Implementation: `game-ready/build_game_ready.py` CORRECT + SPLITS entries
  added; builder re-run; hash-diff confirmed ONLY Krakenox outputs changed
  (locked manifests ×2, locked atlas PNG, 2 new split cells). The stale
  unsplit game-ready cell `krakenox_cell_06.png` was moved to recoverable
  trash (trash_id 20261025-234255-0488e4d4fcbe407bbdbb33121353f3e4,
  expires 2026-11-24); the atlas original `atlases/krakenox/krakenox_cell_06.png`
  is untouched.
- **Manifest atlas-pointer fix (builder bug, 5 + 1 manifests).**
  Locked manifests pointed `atlas_file`/`atlas_size` at the ORIGINAL atlas,
  not the rebuilt locked atlas. Mismatches found and fixed: Cragarm,
  Dorowani, Duskfiend, Kickmaster, Megalochrome (size), plus
  Strikechamp-unsuited-full (filename pointed at a non-existent
  `*_unsuited-full_atlas_64.png`). Builder patched so future runs set
  `atlas_file` = locked filename and `atlas_size` = locked PNG size.
  Post-fix verification: 0/51 game-ready manifests mismatch their locked
  atlas PNG size/filename; all frame atlas_x/y are in bounds.
- **Strikechamp second atlas: DECIDED.**
  Canonical second atlas = the FULL unsuited sheet (no helmet, red suit):
  30 game-ready cells (28 base + 2 mirrors), battle_front 0, battle_back 1,
  icon 6, QA PASS at sheet level. The lower-only helmeted set (26 cells)
  is RETAINED as a variant only — it lacks a walk-up cycle. Suited remains
  the default look regardless. OPEN, needs Mars: the LOOK difference
  (no-helmet red suit vs helmeted bare chest) is a canon-look choice, not
  settled by QA — confirm before the full set replaces anything as a
  shipped default.

## Honest scope limit (do not overclaim)

- Eye-confirmed per atlas: battle_front, battle_back, icon (50/50).
- Walk/overworld sub-roles: extractor-assigned and montage-spot-checked,
  NOT cell-by-cell direction-verified, except QA-PASS sets where QA
  verified walk at sheet level. The locked manifests say this in
  `lock_method`. Full direction-level verification of every walk cell is
  still owed if Mars wants it before shipping walk cycles.
- Walk-complete sets remain 15/50 = 30% (QA count); the rest are
  battle + overworld + icon complete with walk gaps documented in
  NEXT-STEPS-QA.md. This lock pass does not invent walk frames.

## Game-ready set adopted for PR (Phase 2b)

`sprite-art/game-ready/<name>/<name>_atlas_64_locked.png` +
`<name>.manifest.locked.json`, 51 sets (50 atlas dirs + Strikechamp
unsuited-full). This set already includes the surgical white-spot cleanup
(cleared background components only) AND all lock corrections, so it
supersedes `atlases/<name>/*_atlas_64_clean.png` + `manifest-clean.json`
for lock-passed creatures — the `*_clean` files still carry merged-pair
cells and pre-lock roles and are NOT pushed, to avoid shipping two
conflicting atlases for the same creature.

## Counts (Phase 2 lock state)

- Locked manifests: 50/50 atlas dirs + 1 unsuited-full = 51/51 = 100%.
- role_unconfirmed: 0 in every locked manifest.
- Game-ready cells total: 812 (was 811 before the Krakenox 6 split) across
  the 50 atlas dirs, plus 30 for Strikechamp unsuited-full = 842 cells in
  the 51 shipped sets.
- Battle front/back present: 51/51 sets. Icons: 51/51 sets.
- Named Phase 2(a) decisions closed this session: Krakenox 6 split (1),
  Strikechamp second-atlas decision (1), manifest pointer fixes (6).
  Squirmite 10, Duskfiend 9, Krakenox 0, Mythar 12 were already decided
  and were verified, not re-decided.
