# Gabu re-rig — iteration log (Mars 100% order, 2026-10-26)

Gate bar (all must pass before anything is shown): stretch p999 ≤ 2.5 on ALL
6 clips, 512px front+side no-tear proof on ALL 6 clips, floor contact held
(faint held pose minY = 0.0), mouth/silhouette intact. Bake stays STOPPED
until a version passes; pass1 renders are never representative.
Dorowani untouched throughout. All files are NEW; v2-fixed finals never
overwritten.

## Per-iteration gate table (stretch p999; bar 2.5)

| Iter | File / change | attack | faint | hit | ready | walk | idle | floor (faint held) | visual 512px |
|------|---------------|--------|-------|-----|-------|------|------|--------------------|--------------|
| 0 baseline | v2-fixed 2c (shipped) | 6.328 | 9.494 | 6.232 | 5.590 | 4.053 | ~1.6 PASS | 0.0 held | FAIL: chest shred band, blade arms, hanging strips (diagnosis annotated proofs) |
| 1 | v2 + seam cut T=0.4 only (piece-mean) | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | (not run) | FAIL: held −0.045…−0.062 (settle lift broken by piece means) | never rendered |
| 2 | rerig-v1 zone-pure + moved pivots, BUGGY build (weights written, JOINTS not) | 8.046 | 21.289 | — | — | — | — | — | INVALID: rest_vs_authored 2.06 m; 35,836 verts > 0.01 off. Do not cite. |
| 3 | rerig-v1 FIXED (JOINTS written; rest 8.39e-06) | 14.864 | 33.009 | — | — | — | — | −0.0521 = v2 baseline (preserved) | never rendered. Lesson: zone-pure WITHOUT topology separation makes stretch WORSE (pure-opposite boundary edges; mixed-dom share in worst-100 edges 25% → 45%). |
| 4 | rerig-v1 + cut T=0.4 (combined) | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | FAIL: held −0.0446…−0.0617 (same as Iter 1) | never rendered |
| 5 | Iter 4 + faint settle lift re-derived (Hips-Y pose edit; ramp + exact held deficits) | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | PASS: held 0.0 all 13 frames (re-verified on repaired file) | FAIL: 2/12 clean (idle front+side only). See below. |

## Iter 5 file

- `rigged/gabu/rerig-v1/gabu-rerig-v1-cut-t04-lift.glb` (267,565,120 bytes,
  1,609,081 verts, 25 joints; repaired 2026-10-26: 33 bufferViews gained the
  missing `"buffer": 0` field that Blender's strict glTF parser requires —
  binary chunk untouched; faint re-gate on the repaired file reproduces
  p999 1.0 / held 0.0 / rest 8e-06 exactly).
- Builders: `rerig.py` (zone-pure + shoulder pivots ±0.40), `seam_split.py`
  (T=0.4 cut; both scripts fixed to emit `"buffer": 0`), `iter5_lift.py`
  (faint lift: ramp 0.0103→0.0514, held 0.0617→0.0446), `repair_buffer.py`.
- Gates: `gate_combined_{attack,faint,hit,ready,walk,idle}.json`,
  `gate_iter5_faint.json`, `gate_iter5_faint_repaired.json`.
- Previews: `previews-iter5/` — 12 PNGs, 512px Workbench, ortho 3.2,
  gate frames idle 44 / ready 14 / walk 22 / attack 14 / hit 3 / faint 44.

## Iter 5 floor detail (why the lift was needed)

The v2 settle lift was tuned to v2's weights. Piece-mean redistribution
broke it: lowest held-faint verts are foot-sole verts (rest y ≈ 0.006) whose
ToeBase share fell 0.78 → 0.52 (Leg 0.09 → 0.38), so the slumped foot dips
below floor; 2,832 verts < −0.01 in Iter 4 held faint vs 0 in v2. Worse, some
foot-level verts were LeftArm 1.0 in v2 (a v2 weight error — they flew to
y ≈ 1.29 in v2 held faint, hiding them); the cut reassigned them to the foot
piece, exposing them as sinkers. The Iter 5 lift re-derives the settle for
the NEW weights: pure Hips translation shifts all descendants equally, so it
changes minY exactly by the lift and never changes edge stretch (verified:
stretch stayed 1.0, max_disp unchanged 0.1159). Transient dips remain and are
accepted as transients, same class as v2: attack −0.1000 (= v2 baseline),
hit −0.0600 (= v2 exactly), faint mid-fall frame 18 −0.0857 (v2: −0.0521).

## Iter 5 visual verdict — FAIL (the stretch gate is blind to seam gaps)

Eye-checked all 12 previews by the agent (not shown to Mars):

- idle front + idle side: CLEAN (only passes).
- attack front: torso intact (chest shred GONE vs v2) but thin horizontal
  side fins at shoulder height. attack side: LARGE white void through the
  shell mid-section + jaw fragments + tail-base tear.
- hit front: torn band across upper chest/neck + side fins. hit side: large
  white gap through chest/shoulder + shell-front tear.
- ready front: hands shredded into dark fragments + chest band.
  ready side: shell-front white gap + neck/chest tear.
- walk front: big torn patch across mid-torso, leg/foot fragments.
  walk side: shell-front/side white gap + chest tear.
- faint front: torso/belly shredded, jagged dark band, fragmented feet.
  faint side: see-through torso void (whole mid-body open) + head/leg fragments.

## Gap metric (new, `gap_metric.py` → `gap_metric_iter5.json`)

Cut-made dup groups = 6,540 (rest positions appearing once in v2 but ≥2x in
Iter 5; rest spread 0.000000 sanity ✓). Max pairwise separation at gate frames:

| clip | max gap | p99 gap | mean gap | groups > 5 cm |
|------|---------|---------|----------|---------------|
| idle | 0.179 m | 0.124 m | 0.027 m | 899 / 6540 |
| ready | 0.745 m | 0.670 m | 0.135 m | 4356 |
| walk | 0.483 m | 0.436 m | 0.139 m | 5604 |
| attack | 1.113 m | 0.857 m | 0.261 m | 5270 |
| hit | 1.051 m | 0.594 m | 0.209 m | 5187 |
| faint | 0.934 m | 0.882 m | 0.291 m | 6147 (94%) |

Model height 2.749 m — a 1.11 m seam separation is 40% of body height.
Mechanism: seam copies that were coincident at rest now follow DIFFERENT
piece-mean weights, so under big deformations they fly to different bones'
positions. Full cutting converts stretch shred into see-through voids. It is
NOT shippable. Idle's gaps are mostly interior/hidden (idle looks clean);
surface seams (shell-front, chest, shoulder) are where voids show.

## Rest-baseline discrepancy — RESOLVED, not outstanding

The parent brief's "rest baseline suspect" refers to Iter 2's buggy build
(rest 2.06 m, JOINTS not written). Iter 3+ fixed it (rest 8.39e-06); Iter 5
rest is 8e-06 on every gate. No rest discrepancy remains in any reported
number.

## Iter 6 plan (queued, not started this turn)

Do NOT grind full-cut thresholds further. Two-metric optimization required
(stretch p999 ≤ 2.5 AND gap small, both measured per clip):

1. FIRST: bridged-cut sweep — seam_split with a --keep-bridges option (keep
   every Nth seam edge / a fraction of seam verts welded) at 2–3 settings;
   gate each with fastgate (stretch) + gap_metric (gap); pick the knee where
   stretch stays ≤ 2.5 and surface gaps close. Bridges hold pieces together
   by construction; the question is only how much stretch returns.
2. FALLBACK if the sweep's knee still fails visual: seam-weight BLEND (no
   topology change, so no voids possible) — smooth the weight field across
   identified seams with a falloff instead of splitting verts.

## Iter 6 — keep4 (25% bridges) — NUMERIC PASS, VISUAL FAIL, same as Iter 5

- File: `gabu-iter6-keep4-lift.glb` (267,022,408 bytes; from
  `gabu-rerig-v1.glb` via `iter6_seam_split.py --keep-every 4` + `iter6_lift.py`
  + `iter6_repair_buffer.py` — 27 lift-added bufferViews needed the
  `"buffer": 0` fix before Blender would import; same fault class as Iter 5).
- Split: 15,480 cut edges (5,160 bridges kept), 208,983 pieces, only 138 dup
  verts / 33 cut-made dup groups (vs 9,824 / 6,540 in full cut — the collapse
  is real but NOT understood; do not cite it as "bridges healed the seams"
  until explained. Working hypothesis: most full-cut dups were verts whose
  triangles' FIRST verts sat in different pieces; bridges change
  first-vertex piece assignment more than piece count suggests).
- Stretch: p999 1.0 ALL 6 clips (fastgate, long edges ≥ 1.37 cm only —
  the gate is blind to sub-cm shred fins; see visual).
- Gap (split verts only): 33 groups, max attack 0.793 m, faint 0.870 m,
  ready 0.593 m, hit 0.568 m, walk 0.373 m, idle 0.111 m — NOT closed.
  Bridges did not fix the remaining split verts' separation.
- Floor: faint held deficit IDENTICAL to Iter 4 (−0.0617…−0.0446) — the
  settle deficit is not caused by the cut at all. Iter 5 lift ramp applies
  verbatim; re-gate confirms held 0.0 all 13 + p999 1.0.
- Visual 512px (previews-iter6-keep4/, 12/12): **2/12 clean (idle front+side
  only) — same count as Iter 5.** Motion clips fail with a different mix:
  big shell voids mostly gone, replaced by shred fins + tears (attack
  front shoulder fins; hit front horizontal arm fins + chest band; ready
  raised-arm fins + chest tear; walk torso patch + leg fragments; faint
  side still see-through torso void + shell-front gap). Keep4 is NOT the
  knee and NOT shippable.
- Mechanism note for Iter 7: tears may sit at NATURAL component boundaries
  (Tripo soup = 208k components, never connected), where no bridge edge
  exists to keep — if so, no bridge fraction has a knee, and the blend
  fallback (smoothing the weight FIELD in space, topology-independent) is
  the correct next path, not keep2/keep8 grinding. Keep2 runs as the
  sweep's second point to test whether bridge fraction matters at all.

## Iter 6 — keep2 (50% bridges) — SWEEP VERDICT: NO KNEE, visual FAIL

- File: `gabu-iter6-keep2-lift.glb` (267,015,184 bytes; same pipeline as
  keep4: split --keep-every 2 + lift + buffer repair).
- Split: 10,320 cut edges (10,320 bridges kept), 208,329 pieces, 9 dup verts.
- Stretch: p999 1.0 ALL 6 clips — the gate is SATURATED and cannot
  discriminate between bridge fractions (full cut, keep4, keep2 all 1.0).
- Floor: faint held deficit identical again (−0.0617…−0.0446); same lift.
- Visual 512px (previews-iter6-keep2/, 12/12 eye-checked): **2/12 clean
  (idle front+side only) — identical failures, identical locations to
  keep4** (attack shoulder fins, hit arm fins + chest band, ready
  raised-arm fins, walk torso patch, faint see-through torso void).
  Bridge fraction 0% → 25% → 50% changes NOTHING visible: the failures
  are NOT at the cut seams being bridged. The bridged-cut family has NO
  knee. Do not grind keep8 or other fractions.
- Next: the blend fallback (iter6_blend.py, built + compiles) — smooth the
  weight field across seams with a hop falloff, no topology change.

## Iter 6 — blend v1 (hops 3, iters 3, α 0.7) — STRETCH FAIL, floor fixed

- File: `gabu-iter6-blend.glb` (192,926,256 bytes; from `gabu-rerig-v1.glb`
  via `iter6_blend.py`; same 27 bufferViews 465–491 needed the repair —
  they come from rerig.py itself, so EVERY rerig-derived file needs it).
- Blend scope: seam verts 23,263 (1.45%); blended verts 77,178 (4.8%).
  Mean max-weight barely moved (0.868 → 0.867) — smoothing was local.
- Stretch (fastgate): attack 6.839, faint 12.511, hit 6.689, ready 7.129,
  walk 4.395, idle 1.611 PASS — FAIL on 5/6 vs bar 2.5. Better than uncut
  rerig-v1 (attack 14.9, faint 33.0) but not passing. Gap metric is
  vacuous here (nothing split, 0 dup groups) — the two gates for blend
  are stretch + visual.
- Floor: faint held minY 0.0…+0.0219 (feet float ≤ 2 cm at held, no sink);
  mid-fall min −0.0521 = v2 baseline exactly. No lift needed for sink,
  but a +2 cm hover at held is a minor float to note at visual check.
- Previews rendering (previews-iter6-blend/) to see whether the failure
  mode changed (soft stretch vs fins/voids) — that decides whether a
  stronger blend (wider hops, more iters) is worth sweeping, or whether
  the blend family also fails and Iter 7 needs a different approach
  (mesh welding / remeshing / anatomical volume painting).

## Iter 6 — blend v1 visual — FAIL, 2/12 clean, arms WORSE

- Visual 512px (previews-iter6-blend/, 12/12 eye-checked): **2/12 clean
  (idle front+side only) — same count as the cut family, worse arm
  artifacts.** Arms stretch into long thin blades (attack/hit/ready
  fronts, faint front); torso shreds into vertical strips (faint);
  shell-front dark stretched bands (attack/walk sides); chest/neck
  strip tears (hit side). Blending DRAGS arm verts toward torso bones —
  more uniform blending would make blades worse, not better. The arm
  boundary must stay SHARP while chest/shell seams smooth: that is the
  blend2 hypothesis (arm-dominant verts protected, s=0).
- Blend v1 is NOT shippable and NOT an improvement. Do not pursue
  stronger uniform blends.

## Iter 6 — blend v2 (arm-protected) — in flight

- `gabu-iter6-blend2.glb` via `iter6_blend.py --protect-joints` (all 8
  arm-chain joints): 284,938 arm-dominant verts protected, 52,980
  blended. Gate running; previews only if stretch nears the bar.

## Iter 6 — blend v2 gate — STRETCH WORSE (step concentration)

- Stretch: attack 8.312 (max 76.2), faint 17.794 (58.8), hit 8.110
  (70.4), ready 10.468 (40.7), walk 5.928 (15.9), idle 1.827 (3.4) —
  WORSE than uniform blend v1 on every clip. Binary protection
  concentrates the transition into a step at the arm boundary, and
  steps are exactly what stretch measures. Lesson: the transition
  must be GRADUAL, not binary — blend3 ramps s 0→1 over 4 hops from
  arm verts (same seam falloff otherwise). Blend2 previews SKIPPED
  (stretch fails 3–7x; visual cannot rescue a stretch fail).
- Floor: faint held 0.0…+0.0219, same as blend v1 (float, no sink).

## Iter 6 — blend v3 (gradual arm falloff) — in flight

- `gabu-iter6-blend3.glb` via `--arm-falloff 4`. Gate running. This is
  the last blend variant in Iter 6: if it also fails stretch, the
  weight-field family is exhausted and Iter 7 must change structure
  (weld/remesh/repaint), not tune blend parameters.

## Iter 6 — blend v3 gate — STRETCH WORSE STILL, weight-field family EXHAUSTED

- Stretch: attack 12.181 (max 76.2), faint 27.346 (58.8), hit 11.499
  (70.4), ready 16.204 (40.7), walk 7.151 (23.9), idle 2.125 (4.8) —
  FAIL 6/6 (idle now fails too). Ranking by stretch: uniform blend v1
  (6.8/12.5) < binary-protected v2 (8.3/17.8) < gradual v3 (12.2/27.3)
  < uncut rerig-v1 (14.9/33.0). More blending = better stretch,
  monotonically; but v1 already showed blades, so wider blending
  trades stretch for worse arm shape. No sweet spot in this family.
- Identical maxima across v2/v3 (76.2/58.8/70.4/40.7) = the worst edges
  are untouched by either protection scheme; the failure is not at
  the arm boundary alone.
- Blend v3 previews SKIPPED (stretch fails 3–11x; visual cannot rescue).
- Floor: faint held 0.0…+0.0219, same as v1/v2 (float, no sink).

## Iter 6 — zone diagnostic (why weight-field work is exhausted)

- Dominant-bone histogram by |x| band in rerig-v1: torso band
  (|x|<0.35) is 45.3% Head; far band (|x|>0.55) mixes TailTip 11.5%,
  arm bones ~6–11% each, legs ~8–9% each. The rest pose is sprawled
  so bands mix anatomy, but the field is spatially chaotic — v2's
  weights were noisy to begin with (foot verts at LeftArm 1.0, etc.).
  No cut/bridge/blend on top of these weights can fix zones that are
  wrong at the source.

## ITER 6 VERDICT: DOES NOT PASS — no candidate meets all gates

- Bridged-cut sweep: full cut (Iter 5), keep4, keep2 — all 2/12 clean
  (idle only), stretch gate saturated at 1.0, bridge fraction changes
  nothing visible. NO KNEE. Do not grind further fractions.
- Blend family: v1 stretch fail 5/6 + blades worse; v2 stretch worse
  (step concentration); v3 stretch worst of the three. NO PASS.
- Best numeric: keep4/keep2 (stretch 1.0, floor 0.0 after lift) but
  visual 2/12. Best visual: none above 2/12. NOTHING is shippable;
  nothing shown to Mars (correct — no version passed).
- Bake stays STOPPED (verified: no bake_gabu_single process running
  at Iter 6 close). Dorowani untouched. All Iter 6 files are NEW
  (gabu-iter6-keep4[-lift].glb, gabu-iter6-keep2[-lift].glb,
  gabu-iter6-blend[123].glb + gates + previews-iter6-keep4/keep2/blend/
  + iter6_seam_split.py, iter6_gap.py, iter6_lift.py,
  iter6_blend.py, iter6_repair_buffer*.py). No PR, no deletions.

## Iter 7 must try (in order)

1. GEOMETRY-FIRST REPAINT: rebuild zones from spatial volumes, not
   from v2 weights — shell volume → Chest/Spine only, arm volumes →
   arm chains, head volume → Head/Neck, leg volumes → leg chains,
   tail volume → tail chain — then smooth-skin within volumes.
   This attacks the diagnosed root cause (chaotic source weights).
2. WELD THE SOUP FIRST (alternative/complement): merge coincident
   verts across the 208k Tripo components into a connected mesh,
   then standard smooth skinning; re-measure — gaps/fins that were
   inter-component drift should collapse.
3. If either passes stretch + floor, render 512px front+side previews
   on ALL 6 clips and eye-check before ANY claim; only then re-point
   the bake (shipped file only, never pass1).

## Incidents this turn

- A pass1 bake retry chain ("GABU RETRY CHAIN PASS 2", targeting 8 missing
  pass1 frames: hit f1/f5, faint f15/f30/f45, attack side f8/f15/f22) was
  found running during the preview render (chain PID 4521 + Blender child).
  Per the standing bake-STOPPED / never-pass1 order it was KILLED (chain +
  child; no new pass1 frame was written — render dir still 23 files, latest
  12:23 UTC). The chain's owner should be told it was stopped on purpose.
- A VM/service restart mid-turn killed the first Iter 5 faint gate run; it
  was re-run cleanly afterwards. No data lost.
- Blender glTF strictness found and fixed (see Iter 5 file note); both
  writer scripts patched for future runs.
