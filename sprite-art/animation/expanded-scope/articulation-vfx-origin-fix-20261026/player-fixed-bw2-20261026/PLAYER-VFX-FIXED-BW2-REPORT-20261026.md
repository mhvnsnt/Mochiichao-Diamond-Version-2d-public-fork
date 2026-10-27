# Player (back-view) VFX CODE-TRUE FIXED SET — Black 2 code-derived angle, 204/204 = 100% (2026-10-26)

Mars order 2026-10-26 ~20:09 CDT, ADDITIONAL set. The aimfix sets (up-right 45 deg,
Mars's rule) are KEPT and untouched — this set does NOT supersede them, and the
flat-right player/ dir is likewise untouched. Staged only, new dated dir, NO PR,
NO lock, show-first. Pixel/art work is local CPU — GPU genuinely cannot help
these steps, no Kaggle job.

## Code angle — recomputed in code, not taken on faith

Script: `bw2_angle_recompute_20261026.py` (in this dir). Sources verified in
`pokebw2/src/ov168/` on disk:

- `btlv_mcss.c`, `data_ov168_021f327c` (singles): player pos 0 =
  {0x800, 0x666, 0x7000}, enemy pos 1 = {0x4cd, 0x666, -0xa000} — task floats
  (2.0, 0.4, 28.0) and (1.2, 0.4, -40.0). World vector player→enemy =
  (-0.8, 0, -68.0). Separation is almost entirely depth.
- `btlv_camera.c`: default pos (6.7, 6.7, 17.3), target (0, 2.6, 0), up (0, 1, 0);
  FOV sin/cos = 13 deg half-angle (projection only, does not change direction).
- `btlv_effect.c:1403` `BtlvEffTool_CalcStepVec`: step = (end − start)/frames
  per axis — linear attacker→target, same model as FireRed's
  `TranslateSpriteLinearFixedPoint`.
- Projection through the camera basis (forward = target−pos normalised;
  right = cross(forward, up); camera-up = cross(right, forward)):
  camera-space (23.812, 13.746) → **29.997 deg ≈ 30.00 deg above horizontal**.
  Render angle used: exactly 30.0 deg in cell space (up-right, dx>0, dy<0).
  Opponent mirror (not in this pass): 30.0 deg below horizontal, down-left.
- fx32 scale note (honest): raw fx32 /4096 gives x/z at 1/4 of the task floats
  (0.5/7.0 vs 2.0/28.0) while y matches exactly (0.400). The world vector is
  proportional under either scaling — (-0.2, 0, -17.0) = 0.25 × (-0.8, 0, -68.0)
  — so the projected angle is identical (29.996 deg raw vs 29.997 deg task
  floats). The angle, not the absolute scale, is the transferable code value.

## Honest limits (stated, not hidden)

(a) The DEFAULT BW2 camera position frames the enemy only — the player mon sits
behind its plane — because effect scripts move the camera during play; the
transferable code value is the DIRECTION angle through the camera basis, not
absolute default-camera screen positions.
(b) Per-move spawn offsets and per-move camera moves are effect-script DATA,
not readable C source in this slice — origins are BW2's attacker anchor + the
measured art zones from PLAYER-VFX-MANIFEST-20261026.json (mouth/cannon/hand),
labelled as adaptation, never claimed as BW2 script values.
(c) Pokemon's code names no per-species body-part origin; body parts come from
the move's nature + measured art, labelled as such.

## What was rebuilt, and what was reused verbatim

- REUSED from the aimfix manifest: every set's measured origin (x,y), origin
  fraction/basis, element palette, base cell dir + files, and GIF durations.
  Origins were NOT re-measured and NOT moved. Base cells were NOT edited.
- REBUILT from the ORIGINAL base cells (aimfix manifest base_dir) — NOT from
  aimfix output cells, which would have stacked two angles on top of each other.
- Per-set beams are PARALLEL: the same 30 deg code vector from each set's own
  origin — same vector, different spawn points, exactly like BW2.
- Free class (aimfix old_direction_class == free, 35/204 = 17.2%): diagonal BEAM
  from the origin up-right at 30 deg, head clipped at the cell bounds (right
  edge or top edge), never outside. Tapering width, bright core, bright head
  diamond at the up-right end.
- Edge class (169/204 = 82.8%): diagonal WEDGE on the 30-deg line THROUGH the
  origin. Burst sets use the same wedge with a wider base + symmetric spark
  pairs (pairs, so sparks cannot skew the line fit).
- Frames: 02 emerging (60% length), 03 impact full, 04 hold/fade (85% length,
  alpha 150 for 5-cell / 200 for 6-cell sets, matching the aimfix pass).
  Cells 00/01 are byte-identical base copies; cell-05 recover on 6-cell sets
  is an unchanged base copy (byte-identical re-check: 0 mismatches).
- No faces drawn on any back frame (Mars 2026-10-26 ~18:07 CDT). No baked
  shadows in any output cell.

## Geometry note for edge-at-clip sets (stated, not hidden)

110/204 origins sit at x=63, so no up-right run exists beyond the origin. For
those sets the origin IS the clipped up-right end of the diagonal wedge (the
bright head) and the wedge body runs down-left from it along the 30-deg
diagonal, inside the cell. This is geometry, not a failure: the fitted
trajectory is still up-right at ~30 deg, and moving the origin to fake room
would have broken the do-not-change-origins rule. Flagged per set in the
manifest ("EDGE-AT-CLIP geometry note").

## Verification — measured per set, never forced uniform (tolerance 20–40 deg)

- Method: diff mask = pixels differing between base cell-03 and output
  cell-03; PCA principal axis of the diff pixels, oriented so dx>0; angle =
  atan2(−dy,dx) in degrees (image coords, y down, so up-right reads positive).
  Gate = angle in [20,40] deg AND oriented dx>0, dy<0 AND base→head trajectory
  vector dx>0, dy<0 AND impact VFX pixels ≥ 15 AND all frame-03 diff colours
  in the manifest palette. Independently re-verified from disk with a fresh
  code path (numpy eigendecomposition, not the builder's formula): 204 sets,
  0 angle mismatches > 0.15 deg, 0 other failures.
- Rebuilt: 204/204 = 100%. Output cells: 1,122 (612 with VFX on frames 02–04 +
  510 unchanged copies). Impact-frame VFX pixels total: 33,588 (aimfix total
  was 35,472; the shallower 30-deg beams are shorter in the vertical direction,
  so they cover slightly fewer pixels — expected, not a shortfall).
- Angle stats (impact frame, 204 sets): **mean 29.9 deg, min 29.6 deg,
  max 31.1 deg**. Every set is within 1.1 deg of the 30.0 deg code angle; no
  set was forced to a uniform value — this spread is the measured result.
  Distribution by 0.1-deg reading: 29.6: 55 sets, 29.7: 11, 29.8: 18, 29.9: 79,
  30.0: 9, 30.1: 5, 30.2: 1, 30.3: 6, 30.5: 8, 30.9: 8, 31.1: 4.
  (192/204 round to 30 deg at whole-degree precision.)
- Outliers, listed explicitly (farthest from 30.0 deg; all still inside the
  20–40 deg gate, all up-right, all with trajectory dx>0, dy<0):
  - 31.1 deg (4 sets, all short free beams, 78 VFX px, lattice + head-diamond
    weighting on a short beam is the variation source, not cell clipping):
    kittember atk_heavy_blaze_crash_finisher (origin 51,40),
    megalochrome atk_signature_chrome_barrage (51,20),
    squirmite atk_heavy_coil_crash_finisher (51,40),
    squirmite atk_signature_swarm_burst (51,18).
  - 30.9 deg (8 sets, same short-beam lattice source, 83 VFX px): dorowani
    atk_heavy_deluge_finisher (50,34), dorowani atk_signature_wave_barrage
    (50,20), dorowani atk_special_spray_jet (49,16), megalochrome
    atk_special_steel_shot (49,16), pyropaw atk_heavy_blaze_crash_finisher
    (49,40), pyropaw atk_signature_pyro_burst (50,18), squirmite
    atk_special_silk_shot (49,18), wispkin atk_special_wisp_shot (50,17).
  - Lowest readings, 29.6 deg (55 sets, all edge wedges at x=63 — the wedge
    body is clipped at the right edge by construction, which is the expected
    clipping variation source): e.g. aerobeak atk_heavy_sky_crash_finisher,
    aquariios atk_heavy_maelstrom_finisher, aquariios atk_physical_aqua_ram,
    ashemit atk_physical_ash_charge, astroleviathan atk_heavy_starfall_finisher
    (full list is in the manifest: every set at 29.6 deg has origin x=63 and
    geometry code_wedge_30deg).
- Verification failures: 0/204. Sets outside the 20–40 deg tolerance: none.
  Non-palette pixels on impact frames: 0. Minimum impact VFX pixels per set:
  65. All 204 base→head trajectory vectors read dx>0, dy<0.
- Aimfix dir check: aimfix cell-03 differs from code-true cell-03 on 204/204
  sets (expected: different angle, same origin/palette); the aimfix dir was
  read-only in this pass and was not written to.
- Eye-checked: Dorowani direction proof (all 4 sets read up-right at 30 deg,
  mouth-height origins unchanged; the code beams are visibly shallower than
  the aimfix 45-deg beams) + Dorowani before/after sheet.

## Dorowani (unchanged aim rules + T-pose correction applied)

- Origin stays mouth-height (frac 0.37 transfer from front art: front rest-cell
  mouth y=21 / front bbox y0-57), direction now UP-RIGHT 30 deg, not 45 deg
  aimfix and not flat right: special_spray_jet origin (49,16) angle 30.9 deg
  (code beam, 83 px), signature_wave_barrage (50,20) angle 30.9 deg (code beam),
  heavy_deluge_finisher (50,34) angle 30.9 deg (code beam),
  physical_glide_ram (55,33) angle 29.9 deg (code wedge, 252 px, trajectory
  base→head [26.6, −15.0]). No face on any back frame.
- T-POSE CORRECTION (Mars 2026-10-26 ~19:36 CDT, Dorowani ONLY): the no-T-pose
  part of the earlier refinement is LIFTED for Dorowani — T-pose is fine for him
  (some Pokemon stand in T-pose). This pass did NOT redo any Dorowani work to
  escape a T-pose base, and did NOT switch his bases: his player sets keep the
  original manifest's back-view action-frame bases. His other front
  character-sheet poses remain usable where they exist. The 2D-only game-path
  rule is NOT lifted: no 3D/T-pose assets enter the game path.
- Carried flags, unchanged: Strikechamp + Shellguard keep pick-A bases (8/8
  sets); Stormtalon + Finblade keep the back-cell revisit flag (re-check if
  their back cells are regenerated from the approved front rebuilds).

## What this set is NOT

- NOT a supersession of the aimfix 45-deg set: both sets now exist side by
  side (aimfix = Mars's rule, code-true = BW2's code angle). Mars picks which
  one ships; neither dir was overwritten.
- NOT in this pass: opponent-side down-left mirroring (separate opponent
  order), any PR, any lock, any game wiring. Show-first: Mars eye-check still
  owed on all 51 before/after sheets + the Dorowani proof sheet + 51 GIFs
  before any ship step. (51 = creature keys in the manifest: 49 species +
  strikechamp_unsuited + strikechamp_unsuited_full, 4 sets each = 204.)
- NOT duplicated here: the broader combat-wiring coordinator's move/effect
  inventory work (this lane is VFX art only).

## Files

- Cells: `player-fixed-bw2-20261026/<creature>/` (1,122 PNGs, 64px, base
  filenames kept verbatim)
- Manifest: `player-fixed-bw2-20261026/PLAYER-VFX-FIXED-BW2-MANIFEST-20261026.json`
  (per-set origin, element, palette, old/new geometry, verification incl. PCA
  angle + trajectory vector, flags, code-angle block, honest limits)
- Report: this file
- Sheets: `player-fixed-bw2-20261026/show-sheets/` (51 before/after aimfix-45
  vs code-true-30 + Dorowani direction proof = 52 sheets)
- GIFs: `player-fixed-bw2-20261026/gifs/` (51, aimfix manifest durations reused)
- Builders: `player-fixed-bw2-20261026/build_player_fixed_bw2_20261026.py`,
  `build_player_fixed_bw2_sheets_20261026.py`,
  `bw2_angle_recompute_20261026.py`
