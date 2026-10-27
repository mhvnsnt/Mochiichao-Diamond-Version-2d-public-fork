# CODE-TRUE OPPONENT SET — REPORT 20261026

Task: Mars 2026-10-26 ~20:26 CDT — opponent attacks going the wrong direction;
fix with the ACTUAL Pokemon code from ALL games we have so every opponent-side
attack comes toward the player side, at the code's angle, FROM the correct
place (mouth/hand/cannon/whatever the move's origin is). This REFINES the
opponent mirror sweep; the 45-degree Mars-rule set is a SEPARATE variant and
is NOT overwritten here. Staged, show-first, NO PR, NO lock.

## Code angle (recomputed in code, not assumed)

- Black 2 ov168 positions: player (2.0, 0.4, 28.0), enemy (1.2, 0.4, -40.0).
- Camera: pos (6.7, 6.7, 17.3), target (0, 2.6, 0), up (0, 1, 0).
- World vector enemy-player = (-0.8, 0, -68.0). Through the camera basis:
  camera-space (x, y) = (23.812, 13.746), angle = atan(13.746/23.812) =
  29.9966 degrees above horizontal. Opponent mirror = **30 degrees BELOW
  horizontal (down-left in cell space)**. This is the code-true angle.
- FireRed model: `battle_anim_mons.c` `SetSpriteCoordsToAnimAttackerCoords` —
  every effect spawns AT the attacker anchor, then per-move script offsets;
  opponent side subtracts X offset / negates velocity (side-sign flip).
  `TranslateSpriteLinearFixedPoint` steps projectiles on a straight diagonal
  attacker anchor → target anchor (CalcStepVec linear (end-start)/frames in BW2).

## Honest limits (what the code does NOT give)

- Pokemon has NO per-species mouth/hand coordinate anywhere in the sources.
  Every origin POINT used here is measured from the creature's own art and is
  labelled **move-nature+art-measured** in the manifest — never claimed as a
  Pokemon value. The code names no body part per move (FireRed anim functions
  use the generic attacker anchor; BW2 effvm uses effect numbers, not body
  parts), so the body part comes from the move's nature + measured art
  (breath/beam/spit → mouth, punch → fist/glove, cannon → cannon, etc.).
- HeartGold slice has NO battle-anim sprite-coordinate source (controllers /
  commands only) — no HeartGold value is claimed anywhere in this set.
- Per-move spawn offsets + camera moves are effect-script DATA, not readable
  C — origins are BW2/FireRed attacker anchor + measured art zones.
- Default camera frames the enemy only (player mon behind its plane) because
  effect scripts move the camera during play — the transferable code value is
  the DIRECTION angle, not absolute default-camera positions.
- Perspective FOV sin/cos 13 degrees governs perspective foreshortening, not
  the 2D cell angle; it is not used as the trajectory angle.

## Scope accounting — 204/204 = 100% (0 missing)

Nominal 204 = 51 footprint-manifest entries × 4 families. Composition:

- 192/204 = 94% — sweep universe (48 creatures × 4), already audited.
- 12/204 = 6% — sets the sweep missed or collapsed, built in this task:
  - chromejaww × 4 (batch-a retrofit; the sweep enumeration never scanned
    batch-a, so the earlier "3 creatures missing" claim was WRONG for him —
    he has full staged attack cells; corrected here).
  - strikechamp_unsuited × 4 + strikechamp_unsuited_full × 4 (batch-d
    variants; the sweep collapsed variants to canonical strikechamp).
- 0 sets missing, 0 sets undetermined. Duplicate-source versions (mochii
  articulation, dreadtoise articulation, batch-b stormtalon/finblade) are
  SUPERSEDED variants, not additional sets; code-true uses canonical versions
  (mochii v3-impact, dreadtoise pipev3, stormtalon/finblade front rebuilds).

## Direction decisions for the 12 new sets (visual governs, metrics noisy)

All 12 visually RIGHT → whole-cell flip (bars/bursts on the right in every
impact cell; strip metrics agreed for physical/heavy but were CLOSE/polluted
for specials/signatures — visual overruled metric, per the sweep's own rule).
Chromejaww front-view confirmed by visible eyes/face in the base cell at 8x
(retrofit is in the front-view attack lane, not the trueback lane).
Chromejaww source cells carry a baked ground-shadow ellipse; it is carried
flipped unchanged (shadow-stripping is separate cleanup — feet must not be cut).

## Per-type definitions (how each attack type was treated)

- Special / Signature (projectile, 102 sets): beam/streak starts INSIDE the
  measured origin zone and travels down-left at 30 degrees (bar-core pixels
  rotated about the bar's own right end at the origin row; twin bars rotate
  about their own barrel pivots). Splash/spray pixels rotate with the bar but
  are EXCLUDED from the angle fit.
- Physical (contact, 51 sets): body lunge LEFT (whole-cell flip where the set
  was still RIGHT); impact point = hand/foot/claw point where the lunging
  limb meets the target side (left edge of the limb at impact). No travelling
  beam exists to angle, so no angle is applied.
- Heavy (finisher, 51 sets): same as physical (body/ground effect, lunge
  LEFT); ground effects stay ground-level and are not diagonalised.
- Bursts (mochii special + signature, 2 sets): radial clouds at the origin
  with no trajectory in-frame — re-aiming a cloud into a diagonal band would
  destroy the cloud shape. Kept at origin, exempt from angle.
- Ground shots (cragarm special crystal_shot, 1 set): ground-level trajectory
  by attack semantics — a 30-degree diagonal would exit the cell bottom
  within ~20px. Kept ground-level, exempt from angle.

## Method (what changed vs the failed 45-degree aim run)

- Pivot = the BAR's own right end at the origin row (the attachment point),
  per row-group (twin bars get their own pivots) — NOT the body edge, which
  fails when ears/wings jut left of the origin (that bug produced the
  near-vertical 85-90 degree slivers in the 45-degree run).
- Bar/splash split: core rows (mask count >= 50% of max row count) form the
  bar; the rest is spray. Both rotate; only bar pixels enter the fit.
- Verification = PCA (total least squares) on bar-core pixels only, canvas-
  boundary pixels excluded (y==0/63, x==0), tolerance 20-40 degrees
  (30 +/- 10), quadrant must read down-left (dx<0, dy>0 in image coords).
  Clouds (no bar core) verify by centroid displacement: drawn mass must sit
  down-left of the pivot.
- Earlier fits (PCA on all drawn pixels, all-rows median LSQ, full-width-row
  median LSQ) all failed for real VFX shapes (splash blobs, fans, sheets,
  orbit rings pull the fit off-axis even when the streak itself is diagonal).
  The bar-core PCA is the fit that matches what the eye sees; it is stated
  here so the verification can be checked, not hidden.

## Counts (percentages with counts)

### Coverage

- Total opponent sets: 204/204 = 100% built (1122 cells).
- Sets travelling leftward or diagonally down-left: 201/204 = 98.5%.
- In-place symmetric (no travel direction; flipping a symmetric pose is
  pointless): 3/204 = 1.5% (duskfiend physical, cragarm physical, finblade
  physical).
- Sets still travelling RIGHT: 0/204 = 0%.

### Projectile sets (102)

- Origin-correct already: 37/102 = 36% (33 verified-pass + 4 no-bar-copy
  relabelled pass: mochii ×2, dreadtoise ×2 — mask not applicable on
  wide-body blob/cannon cases, pass verified by eye-check).
- Origin moves needed and done: 64/102 = 63%.
- Ground-exempt (cragarm special): 1/102 = 1%.
- Angle changes (flat → 30-degree diagonal): 99/102 = 97%.
- BOTH origin move + angle: 64/102 = 63%.
- Angle only: 35/102 = 34%.
- Origin only: 0/102 = 0%.
- Neither (exempt bursts + ground): 3/102 = 3%.

### Projectile verification (per impact cell, tolerance 20-40 deg, down-left)

- Impact windows total: 255 cells (aimed 248 + exempt 7).
- Measured cells: 240/255 = 94% (233 bar + 7 cloud).
- Measured cells passing the gate: 214/240 = 89%.
- Measured cells reading down-left quadrant: 240/240 = 100%.
- Flat-left leftover cells (no bar found in that frame, copied unchanged,
  still LEFT but not diagonal): 8/255 = 3%:
  floatcalf signature c03, razorgater signature c03, razorgater special c03,
  shellguard signature c03, strikechamp special c02, toxitacle signature c02,
  toxitacle signature c04, yogiferno signature c03.
- Exempt windows (no trajectory by nature): 7/255 = 3% (mochii bursts 5,
  cragarm ground 2).

### Projectile set statuses (all impact cells must pass for `pass`)

- Pass: 75/102 = 74%.
- Partial (some cells pass): 19/102 = 19% — listed below.
- Fail (no cell passes the gate): 5/102 = 5% — listed below.
- Exempt: 3/102 = 3%.

### Physical / heavy sets (102)

- Newly flipped to LEFT in this program: 49/102 = 48% (43 sweep + 6 new).
- Already LEFT from the flip pass (carried unchanged): 50/102 = 49%.
- In-place symmetric, no flip: 3/102 = 3%.

## Fail sets (5/102 = 5%) — explicit, with reasons

- finblade special_aqua_jet (mean 14.2 deg) + finblade signature_blade_barrage
  (mean 10.1 deg): DEEP-ORIGIN JET SHEET (origin cy 53). The VFX is a wide
  jet sheet, not a thin streak, and a 30-degree streak from cy 53 exits the
  canvas bottom (53 + 26×tan30 = 68 > 63). The visible portion is bottom-
  clipped, so any fit on visible pixels reads shallow. The trajectory IS 30
  degrees by construction (rotation math); the visible-portion fit cannot
  show it. Quadrant down-left on all cells. No redraw fixes this without
  changing the VFX (a shallower streak would be wrong; a shorter streak
  would cut the jet).
- gabu signature_canopy_burst (cells 12.5 / 44.4 / 67.2 deg): BURST/CLOUD, not
  a bar — PCA is unstable across cells (mean linearity 0.63). No stable bar
  axis exists to measure; the green burst mass sits down-left of origin in
  all impact cells. Classified cloud-shape, not a direction failure.
- zephling special_gale_jet (44.2 / 44.8 deg): borderline-steep, just outside
  the gate; visually diagonal down-left.
- krakenox special_ink_jet (42.5 / 41.4 deg): borderline-steep, just outside
  the gate; visually diagonal down-left.

## Partial sets (19/102 = 19%) — pass cells / window cells

- aerobeak signature_tempest_dive 1/3 (c03 45.9, c04 46.2 steep).
- squirmite signature_swarm_burst 2/3 (c03 41.5).
- kittember signature_inferno_pounce 2/3 (c04 48.0, late impact frame).
- kittember special_ember_spray 1/2 (c02 50.1).
- dreadtoise signature_twin_cannon_barrage 2/3 (c03 43.4; twin pivots fixed c04).
- ashemit special_ember_spray 1/2 (c02 57.9, spray diffusion in that frame).
- floatcalf signature_sky_barrage 2/3 (c03 no-bar leftover, flat-left).
- inklet signature_abyss_barrage 2/3 (c02 41.5).
- krakenox signature_abyss_surge 2/3 (c02 41.6).
- mythar signature_orbit_barrage 2/3 (c02 50.1; orbit rings pollute the fit —
  the left streak itself is diagonal).
- stormtalon signature_thunder_barrage 2/3 (c04 44.8, late impact frame).
- razorgater signature_cross_slash 2/3 (c03 no-bar leftover, flat-left).
- razorgater special_blade_wave 1/2 (c03 no-bar leftover, flat-left).
- shellguard signature_shield_barrage 1/3 (c02 51.4; c03 no-bar leftover).
- strikechamp special_power_shot 1/2 (c02 no-bar leftover, flat-left).
- toxitacle signature_venom_barrage 1/3 (c02 + c04 no-bar leftovers, flat-left).
- yogiferno signature_inferno_barrage 2/3 (c03 no-bar leftover, flat-left).
- yogiferno special_flame_shot 1/2 (c03 41.3).
- strikechamp_unsuited_full signature_suit_barrage 2/3 (c04 78.9, late
  impact frame, short/fading bar; direction still down-left).

Every partial/fail cell still reads down-left (correct side); the failures
are steepness/shape/measurement-limit cases, NOT wrong-direction cases.

## Carried judgments and caveats (not hidden)

- Borderline origin passes carried from origin work: stormtalon signature
  (diff 4.5), kittember signature (diff 4.5), quakehound (diff 2.3-3.0),
  krakenox signature (diff 4.3), inklet special (diff 4.7), megalochrome,
  duneclaw/manticlaw signature at claw height, ashemit signature at tail
  height. Pyropaw signature uses the impact-frame mouth (cy 33), not the base
  front-art mouth (29) — impact head sits lower.
- Ashemit special ember_spray treated as MOUTH per lane convention (a
  hand-throw reading exists; recorded, not hidden).
- Pupbble mouth cy 23 from base front art (mouth may actually be ~27-30;
  accepted as shown in origin work; eye-check in final sheets).
- Kickmaster body-core origin cy 32 is an estimate (±3), not a measured
  mouth/hand point. Wispkin body-mass origin cy 20 is an estimate (±3) for a
  creature with no mouth/hands.
- Wispkin front/back caveat (carried): another lane recorded a Wispkin
  front/back mislabel on LUSTRE revision-sheet images (a file labeled front
  is actually a back). This set treats wispkin's ATTACK sets as front-view
  per the lane audit (the attack cells show a symmetric front-facing wisp);
  if his attack base were actually a back, the wispkin code-true cells would
  need revisiting — flagged explicitly, not assumed away.
- Dorowani: blast from the MOUTH (39,18), down-left 30 degrees, option-3-style
  face treatment kept on front impact frames, T-pose lift stands (T-pose fine
  for Dorowani only). Formal option-3 approval is STILL owed (Mars 2026-10-26
  ~20:56 clarification: his 20:26 reply flagged direction, it did not verdict
  option 3); the manifest flag reads "mouth treatment per Mars 18:22
  refinement" (treatment works), not an option-3 approval.
- Chromejaww baked ground shadow carried flipped (see above).
- Prior outputs intact as separate variants: sweep flips
  (`direction-sweep/`), origin fixes (`origin-fix/`, `sweep-origin-fix/`),
  45-degree aim (`aim-fix/`). Code-true cells live ONLY in
  `code-true-20261026/` — nothing was overwritten.

## Still owed (not this task, not silently dropped)

- 45-degree Mars-rule aim set (`aim-fix/`): verification FAILED for most sets
  in the prior run (pivot + fit bugs documented in the lane summary). This
  task did NOT repair it — the 45-degree set stays as-is (0% shippable) until
  a repair is ordered. The code-true set does not depend on it.
- Sweep narrative report + aim manifest from prior work (per-set direction
  and origin records are subsumed by the code-true manifest, but the sweep
  narrative and the aim manifest files themselves are still unwritten).
- Mars eye-check on this set (show-first; NO PR, NO lock until he confirms).

## GPU statement

Pixel/art work is local CPU — the GPU genuinely cannot help these steps
(mask finding, rotation, compositing, measurement are per-pixel CPU work with
no trainable model involved). No Kaggle job. No game-path change: staged only.

## Files

- Manifest (204 sets): `CODE-TRUE-MANIFEST-20261026.json` in this dir.
- Cells (1122 PNGs): `code-true-20261026/<source>/<creature>/`.
- Before/after sheets (51 entries): `show-sheets/code-true-20261026/`.
- GIFs (408 = 204 in + 204 out): `show-sheets/code-true-20261026/gifs/`.
- Builders: `_sweep-tools/code_true.py`, `_sweep-tools/code_true_new.py`,
  `_sweep-tools/code_true_deliver.py`, results in `_sweep-tools/
  code_true_results.json` + `code_true_new_results.json`.
