# v8 walk proof — drawn-gate record

Instruments: `measure8.py` on the rendered poses (ID mattes from the same
geometry code as the beauty renders + beauty-alpha cross-checks), ground
calibration on the shoe pixels themselves (`calibrate8.py`), and the
landed repo checker (`gate/verify_proof.py`, the copy landed on main)
for timing/likeness. All distances in still px (1024² canvas, ground
y=952) unless stated. **Gate 8 — the owner's eye — is not in this file.**

## Drawn gates

| # | gate | result |
|---|---|---|
| 1 | Ground contact — beauty/matte bottom = ground at all 8 poses; support lifts: p0 +0/+1, p1 +1, p2 +0, p3 +0, p4 +1/+1, p5 +0, p6 +1, p7 +0 (calibration residuals ≤1 px) | **PASS** |
| 2 | Support stick — toe-end track per leg, step 58 still px/slot (v8 stride, sized to her sheet leg length): near velocities [+1.0, −1.0, 0.0], far [−1.0, +1.0, +1.0]; target ≤3 | **PASS** |
| 3 | Support continuity — every pose has a shoe at lift ≤1; no flight phase in the cycle | **PASS** |
| 4 | Shoe read — toe-end forward reach beats backward reach at every pose, both shoes (fwd 44–83 vs bwd 18–44 still px); toe-off poses (3 near 51/40, 4 near 44/44, 7 far 49/41) read toe-down with the tip planted, never backward-dominant. The drawn profile shoe points along travel everywhere — v7's MIXED row is closed | **PASS** |
| 5 | Knee fold — swing folds measured off the hip→ankle line: recoil folds +111.7 (p1 far) / +105.6 (p5 near); passing folds +50.2 (p2 far) / +54.6 (p6 near). **No backward knee anywhere in the cycle** (minimum deviation +2.5, a near-straight support leg at passing, which is correct) | **PASS** |
| 6 | Silhouette variance — consecutive poses differ 33.9–40.5%; half-cycle pairs 10.9–13.7% | **PASS** |
| 7 | Bob/phase order — head-top sequence follows contact 93 / recoil 101 / passing 89 / high-point 87 (×2): lowest at recoil, highest at high point | **PASS** |

## Expanded-audit rows (defects 8–20 from the owner's re-inspection of v7)

| item | v8 disposition |
|---|---|
| 8 — far arm missing | Far arm exists on the sheet and in the rig, darker + offset, swinging in opposite phase (authored chart ARM1_F = −ARM1_N). Measured hand offsets agree in sign with opposition in every pose where the far arm is visible (p0 +80.5, p1 +65.8 sliver, p3 −34.7, p4 −57.3, p5 −37.5 sliver, p7 +78.3 still px). **PARTIAL:** at the two passing poses (2, 6) the far arm is fully occluded behind the torso — geometrically true in strict profile (arms vertical, far arm behind the body), named here rather than hidden |
| 9 — hair furniture floats | Scrunchies and the black ribbon are drawn seated on the hair mass/tail root on the sheet; tails + scrunchies move as head-group parts. Inspected at full size on the sheet and in all poses — no detached pieces |
| 10 — far-side face furniture | Profile head carries one eye, one ear; nothing from the front face's far side |
| 11 — jars at one depth / buried by arm | Sheet: jars recede (front full, mid, back most occluded). Walk: jar-row matte area 8,722–8,725 px vs 8,723 at rest — **~100% visible in all 8 poses**; jars are drawn after the arm, so the arm never covers them |
| 12 — front skirt, static, solve-slash | Sheet skirt is a wrapped side skirt. Walk: skirt is one piece drawn over the hip joints (legs under it — no slash in any pose, inspected); hem sway charted (counter-rotation + lag, below) — measured hem-centroid range 5.2 still px: present, small |
| 13 — legs don't separate | Far leg/shoe: darker sheet tones + hip offset back; drawn 1% smaller (a larger cut cannot reach the ground at her leg length — derivation in BUILD-NOTES). Separation read visually at both passings (poses 2, 6 inspected at full size: two legs distinguishable, far shoe behind) |
| 14 — hair/tails/straps frozen | Tails carry a charted lag rotation per pose (TAIL_ROT_N/F in `puppet8.py`); measured tail-centroid travel 25.4 still px across the cycle. Straps ride the torso group (they lean with it) |
| 15 — expression frozen | One blink in the retimed clip, frames 40–42 (the pose-2 span at frame 40 — off every chart contact and both accent bursts). Verified in the encoded frames: the pose-2/blink diff is 562 px confined to the eye box (still x 533–561, y 186–213). Lid drawn by the sheet's own `draw_eye` closed form |
| 16 — head squashed ×0.82 | No anisotropic scaling anywhere in v8. Sheet proportions measured against canon (SHEET-NOTES table): head/figure 0.193 vs canon 0.199 |
| 17 — white fringe | Parts are drawn on transparency (no matte to fringe). Instrument: 2–8 near-white edge px per pose (jar-glass highlights/sole edges at the silhouette). Poses 0 and 3 inspected on black in the contact sheet — edges clean |
| 18 — neck perch | Neck drawn into the collar on the sheet; head part carries a neck extension the collar draws over. Instrument: transparent gap at the neck column = **0 px in all 8 poses**; inspected at full size — no notch |
| 19 — recoil reads wrong | Recoils (1, 5): body at its lowest (root 614, head-top 101 = cycle low); **support knee folds FORWARD under load: +59.7 (p1 near) / +64.2 (p5 far)** still px ahead of the hip→ankle line, instrument + full-size visual agree; raised leg's knee leads and the shin unfolds through the passings (poses 2, 6 inspected — no tangle) |
| 20 — rigid torso | Charted: torso lean into travel 2.5–5.0° by phase (contact 4.0, recoil 5.0, passing 3.5, high 2.5), skirt counter-rotates at −0.45× lean plus hem lag (charts in `puppet8.py`). Head steadier than torso: **head-top range 14 still px vs root bob range 28** (head keeps 45% of the bob by design; measured 50%) |

## Arm opposition (near arm — the audit's sign check)

Near-arm hand offset vs its shoulder (still px, + = forward), against the
legs' phase: p0 **−65.4** (near leg forward at contact) · p1 −27.2 ·
p2 +25.3 · p3 **+64.9** · p4 **+74.2** (far leg forward at contact) ·
p5 +47.5 · p6 +16.7 · p7 −25.4. Sign is opposite the near leg / with
the far leg at both contacts, both toe-offs and both recoils. At the two
passings the arm and the near leg are both within ±25 px of neutral
(zero-crossing) — recorded, not rounded into a claim.

## High points (v7 defect 7 — march lift), measured both versions

| airborne shoe | v7 lift | v8 lift |
|---|---|---|
| high point, pose 3 (far, swing_reach) | 58 | **39** |
| high point, pose 7 (near, swing_reach) | 60 | **36** |
| passing, pose 2 (far) | 99 | **18** |
| passing, pose 6 (near) | 94 | **15** |
| recoil folded, pose 1 (far) | 93 | **65** |
| recoil folded, pose 5 (near) | 91 | **65** |

(v7 figures from v7's own `measures.json`. Still px, same canvas/ground.)

## Timing (repo checker, `gate/`)

- **Retimed clip: 10.0 new drawings/sec** (40 spans / 96 frames, 24fps) —
  above the 8/sec credits floor. 7 one-frame accent spans at exactly the
  charted burst frames (22–25, 73–75); longest hold 12f at frame 45 =
  the charted settle; **chart conformance 0 deviations** (`--chart`).
- In-place clip: 8.0 drawings/sec, on-3s grid fit 1.000.
- Chart: `~/workspace/above-the-floor/proof/walk-above-floor-chart.json`
  (V6-WALK-ABOVE-FLOOR-RETIME) applied unchanged to the v8 drawings.

## Likeness diagnostics (checker `--likeness`; diagnostics, never a grade)

Reference: the profile sheet's own figure (tight crop
`scratch/profile-figure.png`, sha256 81dff612… — the sheet with its
eye-inset panel excluded, because the checker's bbox alignment counts
the panel as foreground; the run against the full sheet is also on
record in `gate/likeness-runs-v8.json`, its IoU dragged to 0.3307 by
that panel). Same view as the poses — **no front/profile confound**.

40 drawings vs the sheet figure, medians: SSIM **0.3714** · colour-hist
L1 **0.1232** · Bhattacharyya **0.9649** · silhouette IoU **0.578** ·
mean abs RGB diff **21.46**. (v7's run vs the FRONT canon art, for the
record: SSIM 0.1917, L1 0.1753, IoU 0.4707, diff 30.41 — different
reference and view, so the honest comparison is the direction, not a
score: every axis moved the right way, and this run has no view confound
to hide behind.) Comparison sheet: `likeness-comparison.png` (sheet
beside poses 0/2/3 at equal height), recorded in the run.
