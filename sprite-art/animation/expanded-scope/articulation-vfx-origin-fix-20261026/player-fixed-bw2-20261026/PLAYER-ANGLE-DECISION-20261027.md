# Player VFX angle decision — 30° (Black 2 code-true) — 2026-10-27

## Decision
The player-side VFX angle is **30° up-right**, from Black 2's own code.
Mars confirmed this set 2026-10-27 ~07:26 CDT on the condition "if the Pokemon
code says 30 degrees then we go for 30 degrees." The condition is met: Black 2's
angle recomputes to exactly 30.0° in cell space (see below). So 30° is the player
set to use.

## What this supersedes
The 45° aimfix set (Mars's rule, shipped via PR #263) is now SUPERSEDED for the
player side. It stays on main, marked superseded here — never deleted, never
overwritten. The staged BW2 report's "additional set only / does NOT supersede /
NO PR / NO lock" notes are likewise superseded by Mars's 2026-10-27 confirmation;
they described the staging state, not the shipped state.

## Code evidence (recomputed, not taken on faith)
Script staged locally: `bw2_angle_recompute_20261026.py`. Sources verified in
`pokebw2/src/ov168/` on disk:
- `btlv_mcss.c`, `data_ov168_021f327c` (singles): player pos (2.0, 0.4, 28.0),
  enemy pos (1.2, 0.4, -40.0). World vector player→enemy = (-0.8, 0, -68.0).
- `btlv_camera.c`: default pos (6.7, 6.7, 17.3), target (0, 2.6, 0), up (0, 1, 0).
- `btlv_effect.c:1403` `BtlvEffTool_CalcStepVec`: linear attacker→target step.
- Projection through the camera basis: camera-space (23.812, 13.746) →
  **29.997° ≈ 30.00° above horizontal**. Render angle used: exactly 30.0° in
  cell space (up-right, dx>0, dy<0). Mean measured across the set: 29.9°.
- Honest limits: the default BW2 camera frames the enemy only; the transferable
  code value is the DIRECTION angle through the camera basis, not absolute
  default-camera screen positions. Per-move spawn offsets are effect-script data,
  not readable C source in this slice; origins are BW2's attacker anchor + the
  measured art zones from the aimfix manifest, labelled as adaptation, never
  claimed as BW2 script values. Pokemon's code names no per-species body-part
  origin; body parts come from the move's nature + measured art.

## What ships in this PR
- 1,122 cells (51 creatures × 4 sets: heavy 6, physical 5, signature 6,
  special 5 = 22 per creature), rebuilt from the ORIGINAL base cells at the
  aimfix manifest's measured origins (origins NOT re-measured, NOT moved;
  base cells NOT edited).
- 51 before/after show sheets + 1 Dorowani direction proof + 6 combined
  contact sheets + 51 GIFs = 58 show PNGs + 51 GIFs.
- Manifest (this shipped copy carries a ship_note; the staged original is
  untouched) + the staged report as-is + this decision doc.
- Total: 1,231 media + 3 docs = 1,234 files, 0 deletions.
- NOT shipped: build/recompute .py scripts (staged-only record), opponent sets,
  aimfix 45° files (stay on main, superseded), game code, any other lane's files.

## Status
Merged ≠ live on the game site until a Pages rebuild + playtest, a separate
LAST step owned elsewhere.
