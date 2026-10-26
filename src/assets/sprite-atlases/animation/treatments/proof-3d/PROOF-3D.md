# PROOF-3D — mapTo3D() exercised against LIVE rigs

Status: 2026-10-25. This is no longer "documented, not exercised": the
values below come from the REAL `battleTreatments.js` module (via
`dump_samples.js`, which requires the module — no reimplementation)
applied by TRUE linear-blend skinning to the REAL rigged GLB meshes
(`proof_3d.py` reads each file's own skin joints + inverse-bind
matrices + vertex positions/weights; ~1.6M vertices per creature,
plotted every 25th vertex, ~64k points per frame).

## 1. Rig versions used (recorded, not assumed)

- **Dorowani: v2-fixed, USED.** `sprites-bake/rigged/dorowani/v2-fixed/dorowani-v2-fixed.glb`
  (116,972,572 bytes, 82 nodes, 1 skin, 6 animations: attack, faint,
  hit, idle, ready, walk). This is the rig-fix pass output; the older
  `dorowani-rigged.glb` (78 nodes) was NOT used.
- **Gabu: NO v2-fixed file exists.** `sprites-bake/rigged/gabu/v2-fixed/`
  is an EMPTY directory (checked 2026-10-25). Used instead:
  `sprites-bake/rigged/gabu/gabu_rigged.glb` (116,141,880 bytes,
  27 nodes, 1 skin, 6 animations, same six clip names). If the rig-fix
  pass later produces a Gabu v2, this proof must be RE-RUN against it
  before anyone claims Gabu v2 is proven — this proof covers Gabu
  original only.
- No Nintendo art/model/music files are involved anywhere here: both
  rigs are Mochiichao's own.

## 2. Exchanges rendered (one attack exchange per creature, both directions)

- **ex1 — Dorowani attacks Gabu.** Gabu defender, direction +1 (knocked
  right), HEAVY hit (damageFraction 0.50, seed 7), 20 particles,
  camera zoom 1.14×, dolly 0.28 m.
- **ex2 — Gabu attacks Dorowani.** Dorowani defender, direction −1
  (knocked left), CRITICAL hit (isCrit true at damageFraction 0.10,
  seed 11), 28 particles, camera zoom 1.20×, dolly 0.40 m.
- Frames per exchange (5 each, 10 total): rest 0 ms, windup 125 ms,
  impact hold 300 ms (frozen), peak recoil 639 ms, recover end 1040 ms.
  File names: `ex1_dorowani_hits_gabu_<frame>.png`,
  `ex2_gabu_hits_dorowani_<frame>.png`. Each frame has two panels:
  FULL ARENA (attacker gold, scaled by cameraZoom about its ground
  point — the camera push ON THE ATTACKER, visible as the attacker
  growing from 1.00× to 1.14×/1.20× — vs defender blue, recoiled) and
  DEFENDER CLOSE-UP (rest grey vs mapTo3D pose red, same axes).

## 3. Joint mapping applied (exact node names from the files)

- Dorowani: hips node `Hips` (75) takes rootOffsetX/Y as a translation
  add. Spine lean distributed over `Spine` (57) 50% / `Spine1` (56)
  30% / `Spine2` (55) 20%, as Z-rotations. Head pitch split over
  `Neck` (54) 50% / `Head` (53) 50%, as X-rotations.
- Gabu: hips node `Hips` (23) takes rootOffsetX/Y. Spine lean over
  `Spine` (11) 50% / `Chest` (10) 50%, Z-rotations. Head pitch over
  `Neck` (1) 50% / `Head` (0) 50%, X-rotations.
- `hurtPoseWeight` is NOT a joint in either rig (neither file has a
  hurt-pose blend target); the proof renders it as the hurt-frame
  window (art='hurt' at 340–840 ms in both exchanges) and the head
  pitch that accompanies it. A real hurt-pose blend in the arena
  renderer is still owed work (see §6) — the proof does not fake one.
- Camera dolly: rendered as attacker scale (zoom), NOT as a camera
  move, because the proof has no arena camera; the dolly metres
  (0.28 / 0.40) are the module values for those zooms and are recorded
  in the frame titles and in metrics.json.

## 4. Axis conventions (the two things the live rigs taught us)

- **Rig Y is UP** (Dorowani hips y=0.918, spine chain climbing +Y;
  Gabu hips y=0.82, spine +Y) while screen Y is DOWN. The module's
  `mapTo3D().rootOffsetY` was NEGATED in this pass (was: the 2 px
  screen "lift" became a 0.02 m dip in rig space; now: +0.02 m lift at
  peak recoil in both exchanges). Magnitude is small; the sign was
  wrong and is now fixed and tested.
- **Spine lean sign:** `mapTo3D().spineLeanDeg` keeps its 2D screen
  rotation sign in the return value (existing test pins spineLeanDeg
  > 0 for a +1 hit). In Y-up rig space a Z-rotation must be NEGATED
  for the spine top to follow the displacement direction, so the proof
  applies `Rz(-lean)`. The arena renderer MUST apply the same negation
  — applying the raw value would lean the defender INTO the hit.
  This is a wiring note, not a silent module change (see WIRING.md §2).
- **IBM orientation differs per exporter (found by this proof, and it
  matters):** Dorowani's inverse-bind matrices read row-major
  (world @ IBM = identity as read); Gabu's read column-major
  (world @ IBM-transpose = identity). The proof picks the orientation
  PER FILE by the bind-pose identity test. The first render run got
  this wrong for Gabu (uniform assumption) and produced a tangled blob
  — that run's Gabu frames were DISCARDED, not shipped, and the run was
  repeated with the per-file test. Any future arena skinning code that
  assumes one IBM layout for both rigs will break one of them; test
  both, as proof_3d.py does.

## 5. Eye-check results (frames viewed enlarged)

- **Dorowani (ex2, peak recoil 639 ms): PASS, no defect.** Close-up:
  whole body shifted left by the 0.38 m root offset, spine leaning
  with the displacement, head pitched, arms/legs/head all attached and
  coherent — no tearing, no detached parts, no stretched limbs; max
  vertex displacement 0.518 m, mean 0.343 m (64,939 plotted points).
  The silhouette reads as the same creature displaced and leaning,
  not deformed.
- **Gabu (ex1, peak recoil 639 ms): PASS after the IBM fix.** Close-up:
  coherent Gabu silhouette (spiky crest, wide arms, body, jaw) shifted
  right by the 0.28 m root offset and leaning with it, head pitched
  −16°, max vertex displacement 0.567 m, mean 0.320 m (63,971 plotted
  points) — no tearing, no detached body part. A few sparse stray
  points near the left arm tip are low-weight fingertip/claw vertices,
  not a detachment. Note the projection shows the rig's bind
  orientation (not a retargeted front view), so the jaw reads at the
  lower right; that is the file's own pose, not a proof distortion.
- **Camera push (both exchanges, windup 125 ms vs peak frames): PASS.**
  Attacker gold silhouette is visibly larger at peak (1.14× / 1.20×)
  than at rest, scaled about its ground point (feet stay grounded,
  head rises) — the push reads as a push ON THE ATTACKER, not a
  whole-scene zoom, because the defender is unscaled.
- **Recover (1040 ms frames): PASS.** Both defenders return exactly to
  rest (max vertex displacement 0.000 m in metrics.json) — no drift
  accumulation across the hit, which is the Colosseum return beat.
- **Impact hold (300 ms frames): PASS as a still.** Defender
  displacement is 0.000 m (frozen=true in the samples) while the camera
  is already pushed in (zoom 1.136 heavy / 1.194 critical) — the hold
  reads as a held frame, not a dropped frame, because the camera and
  (in the game) flash/particles are the only moving things.
- **Caveat (honest limit of this proof):** these are point-cloud
  projections of skinned vertices, NOT shaded mesh renders — there is
  no Blender on this machine and no GPU renderer, so surface tearing
  finer than the 25-vertex sampling stride could hide between plotted
  points. What the proof DOES establish: joint mapping, displacement
  magnitudes, lean direction, camera subject, return-to-rest, and no
  gross tearing/detachment at the sampled resolution. A shaded render
  in the arena renderer itself is still owed before a final visual
  sign-off, and it is listed in §6 — it is not claimed here.

## 6. Still below 100% (3D track only)

- Gabu v2-fixed proof: 0% — no v2 file exists yet; re-run this proof
  when it lands.
- Arena renderer (the thing that would consume mapTo3D in-game): 0% —
  no renderer exists in the game yet; ArenaBattleView is still a
  placeholder (see WIRING.md §6).
- Hurt-pose blend target in either rig: 0% — neither GLB has one;
  hurtPoseWeight currently maps to head pitch + the hurt window only.
- Shaded (not point-cloud) visual sign-off: 0% — see §5 caveat.
- Everything else in this proof: done — both rigs exercised, both
  directions, bone-space recoil + camera push rendered, eye-checked
  enlarged, metrics recorded.
