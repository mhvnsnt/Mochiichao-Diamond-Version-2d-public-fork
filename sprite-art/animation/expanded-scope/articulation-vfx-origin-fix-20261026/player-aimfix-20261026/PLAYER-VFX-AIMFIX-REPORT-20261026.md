# Player (back-view) VFX AIM CORRECTION — 204/204 = 100% re-aimed (2026-10-26)

Mars binding rule 2026-10-26 ~19:31 CDT: flat-horizontal-right player aiming is
SUPERSEDED, not confirmed. All 204 staged player back-view attack sets have been
REBUILT (not flipped, not shifted) as UP-RIGHT ~45° diagonals in cell space.
Staged only, new dated dir, NO PR, NO lock, show-first. Pixel/art work is local
CPU — GPU genuinely cannot help these steps, no Kaggle job.

## Pokemon element -> Mochiichao replacement (honesty note)

- FireRed `battle_anim_mons.c:576` `TranslateSpriteLinearFixedPoint`: projectiles
  step by fixed-point increments from start toward target — a STRAIGHT-LINE
  DIAGONAL from attacker anchor to target anchor. No horizontal-only mode, no
  hardcoded angle; direction = (target − attacker) vector.
- FireRed `sBattlerCoords` (single battle, 240×160, y down): player slot (72,80)
  lower-left, opponent (176,40) upper-right → player→opponent = RIGHT + UP,
  battlefield slope atan(40/104) ≈ 21°. Pokemon does NOT hardcode 45° — the
  DIRECTION (up-right) is Pokemon's; the 64px-cell rendering angle (~45°, so the
  diagonal reads clearly in one cell) is Mars's rule. Never claim Pokemon
  hardcodes 45°. Black 2 position constants are not readable in this decomp
  slice — no BW2 number is claimed.
- Opponent mirror (down-left) is NOT in this pass; this pass is player side only.

## What was rebuilt, and what was reused verbatim

- REUSED from `player/PLAYER-VFX-MANIFEST-20261026.json`: every set's measured
  origin (x,y), origin fraction/basis, element palette, base cell dir + files.
  Origins were NOT re-measured and NOT moved. Base cells were NOT edited.
- REBUILT from the base cells: VFX on frames 02 (emerging, 60% length), 03
  (impact, full), 04 (hold/fade, 85% length, alpha 150 for 5-cell / 200 for
  6-cell sets, matching the old pass). Cells 00/01 are byte-identical base
  copies; cell-05 recover on 6-cell sets is an unchanged base copy
  (byte-identical re-check: 0 mismatches).
- Free class (old beam_room_px ≥ 10, 35/204 = 17.2%): diagonal BEAM from the
  origin up-right, head clipped at the cell bounds (right edge or top edge),
  never outside. Tapering width, bright core, bright head diamond at the
  up-right end.
- Edge class (old beam_room_px < 10, 169/204 = 82.8%): diagonal WEDGE on the
  diagonal line THROUGH the origin. Burst sets use the same wedge with a wider
  base + symmetric spark pairs (pairs, so sparks cannot skew the line fit).
- No faces drawn on any back frame (Mars 2026-10-26 ~18:07 CDT). No baked
  shadows in any output cell. No old flat-right beam was flipped or shifted:
  the VFX layer was drawn fresh from base + origin + palette.

## Geometry note for edge-at-clip sets (stated, not hidden)

110/204 origins sit at x=63, so no up-right run exists beyond the origin. For
those sets the origin IS the clipped up-right end of the diagonal wedge (the
bright head) and the wedge body runs down-left from it along the diagonal,
inside the cell. This is geometry, not a failure: the fitted trajectory is
still up-right at ~45°, and moving the origin to fake room would have broken
the do-not-change-origins rule. Flagged per set in the manifest
("EDGE-AT-CLIP geometry note").

## Verification — measured per set, not eyeballed (tolerance 35–55°)

- Method: diff mask = pixels differing between base cell-03 and output cell-03;
  PCA principal axis of the diff pixels, oriented so dx>0; angle =
  atan2(−dy,dx) in degrees (image coords, y down, so up-right reads positive).
  PASS = angle in [35,55]° AND oriented dx>0, dy<0 AND base→head trajectory
  vector dx>0, dy<0 AND impact VFX pixels ≥ 15 AND all frame-03 diff colours in
  the manifest palette. Independently re-verified from disk with a fresh code
  path (same result).
- Re-aimed: 204/204 = 100%. Impact-frame VFX pixels total: 35,472.
- Angle stats (impact frame, 204 sets): mean 44.99°, min 43.2°, max 45.0°.
  202/204 read exactly 45.0°; the only two below 45° are stormtalon
  atk_heavy_tempest_crash_finisher (43.2°) and finblade
  atk_heavy_maelstrom_finisher (44.5°) — both inside tolerance, both up-right,
  both listed here explicitly, not silently passed.
- Verification failures: 0/204. Sets outside the 35–55° tolerance: none.
  Non-palette pixels on impact frames: 0. Output cells: 1,122 (612 with VFX on
  frames 02–04 + 510 unchanged copies).
- Eye-checked: Dorowani direction proof (all 4 sets read up-right, mouth-height
  origins unchanged) + Mochii before/after (zoom-checked: the wedge's white core
  runs bottom-left → top-right at the cell corner; at sheet scale it is subtle
  against his light-blue body because most of the wedge overlaps the body —
  the same overlap the old flat-right wedge had — but the measured angle is
  45.0° and the zoomed cell reads diagonal).

## Dorowani (unchanged aim rules + T-pose correction applied)

- Origin stays mouth-height (frac 0.37 transfer from front art: front rest-cell
  mouth y=21 / front bbox y0-57), direction now UP-RIGHT, not flat right:
  special_spray_jet origin (49,16) angle 45.0°, signature_wave_barrage (50,20)
  angle 45.0°, heavy_deluge_finisher (50,34) angle 45.0° (diag beam),
  physical_glide_ram (55,33) angle 45.0° (diag wedge). No face on any back frame.
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

## Supersession

- `articulation-vfx-origin-fix-20261026/player/` (flat-right) is SUPERSEDED,
  marked so in the NEW manifest only. It was NOT overwritten and NOT deleted
  (verified: 0 files in that dir modified during this pass; its files still
  carry the original pass's timestamps).
- NOT in this pass: opponent-side down-left mirroring, any PR, any lock, any
  game wiring. Show-first: Mars eye-check still owed on all 51 before/after
  sheets + the Dorowani proof sheet + 51 GIFs before any ship step.
  (51 = creature keys in the manifest: 49 species + strikechamp_unsuited +
  strikechamp_unsuited_full, 4 sets each = 204.)

## Files

- Cells: `player-aimfix-20261026/<creature>/` (1,122 PNGs, 64px, base filenames
  kept verbatim)
- Manifest: `player-aimfix-20261026/PLAYER-VFX-AIMFIX-MANIFEST-20261026.json`
  (per-set origin, element, palette, old/new geometry, verification incl. PCA
  angle + trajectory vector, flags)
- Sheets: `player-aimfix-20261026/show-sheets/` (51 before/after flat-right vs
  diagonal + Dorowani direction proof)
- GIFs: `player-aimfix-20261026/gifs/` (51, old manifest durations reused)
- Builders: `player-aimfix-20261026/build_player_aimfix_20261026.py`,
  `player-aimfix-20261026/build_player_aimfix_sheets_20261026.py`
