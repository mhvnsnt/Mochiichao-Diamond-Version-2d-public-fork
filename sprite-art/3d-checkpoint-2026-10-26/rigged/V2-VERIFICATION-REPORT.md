# V2 Rig Fix Verification + mapTo3D Proof — DRAFT (renders pending)
Date: 2026-10-26 (work started 2026-10-25 ~21:52 CDT). Lane: Mochiichao Sprite Art.
Scope: consolidated owed list items 1 + 9, plus Mars's locked decision (2026-10-25
~21:55 CDT): Dorowani idle T-pose arms = IDLE CLIP CHOICE fix, NOT a rig rebuild
(Phase B; does not gate Phase A verification).
Rules honoured: GLBs LOCAL ONLY (never pushed, never in a PR from this batch).
v1 files untouched (all outputs are new files). Slots #047–#146 stay UNFILLED.
No baked shadows in any rig render (engine shadow layer is separate).
Clips that still tear are STAGED with path + preview, never blocking the rest.

## 1. Files verified (measured from the files, not the brief)
| Creature | File (LOCAL ONLY) | Skin joints | Blender pose bones | Actions |
|---|---|---|---|---|
| Dorowani v2-fixed | sprites-bake/rigged/dorowani/v2-fixed/dorowani-v2-fixed.glb (116,972,240 bytes) | 31 | 43 | attack, faint, hit, idle, ready, walk |
| Gabu v2-fixed | sprites-bake/rigged/gabu/v2-fixed/gabu-v2-fixed.glb (116,143,600 bytes) | 25 | 25 | attack, faint, hit, idle, ready, walk |

CORRECTION to the task brief: brief "33/27 joints" = v2-fixed-PASS1 skin counts.
Final v2-fixed drops 2 decorative joints per creature vs pass1 — Dorowani:
shell_main, fin_root; Gabu: shell_main, spike_top — leaving 31/25. Dorowani's
43 Blender pose bones include shoulder/palm helper bones that carry no skin
weights (31 vertex groups on the main mesh = the 31 skin joints). Retarget
verification in §4 uses the FINAL 31/25.
Dorowani v1 skin joints re-measured: 76 (matches brief "down from 76").
Gabu v1 file gabu-rigged.glb does not exist; existing file is gabu_rigged.glb
(v1 Gabu joint count not re-verified — not needed for v2 coverage).
MID-BATCH FILE CHANGES (other lanes, recorded not hidden): Gabu
v2-fixed.glb was replaced twice during this batch — pass 2c promoted
04:48 UTC (my early Gabu inspect measured pass2), then replaced again
06:46 UTC (new md5 1a581ebb…, same size, same 25 joints + 6 animations
re-parsed). All Gabu renders + weights in this report are on the CURRENT
(06:46 UTC) file; the retarget check was re-run against it (still 70/70).
Dorowani v2-fixed.glb mtime refreshed 06:05 UTC by another lane (same size);
walk animation channels re-decoded from the current file are BYTE-IDENTICAL
to the 01:54 file's values, so all Dorowani renders stand whichever
identical-content copy was imported.
Stray mesh note: both final GLBs import an extra "Icosphere" (42 verts, no
weights) in Blender that is NOT in the GLB mesh list (GLB meshes: 1). It is
hidden in every verification render; only the skinned character mesh renders.

## 2. Weights (final GLBs, main character mesh only)
| Creature | Verts | Weight sums off (>0.01) | Orphans | ≤2 influences, raw | ≤2, weights >0.05 |
|---|---|---|---|---|---|
| Dorowani | 1,623,460 | 0 | 0 | 74.8% | 77.5% |
| Gabu (current 06:46 UTC file) | 1,599,257 | 0 | 0 | 79.7% | 79.8% |

Brief's 85.3%/87.7% NOT reproduced under any threshold tried (Dorowani raw/
>0.001/>0.01 all 74.8%, >0.05 77.5%; Gabu pass2 measured 78.7%, current file
79.7% raw — the 2c weight work moved it +1.0 pt). Reported as measured.
The 95% soft target is NOT met either way — per the brief, remaining blends
are legitimate and are NOT chased. Max influences 4 on both meshes.

## 3. Per-clip 512px verification — DOROWANI DONE, GABU DONE (all renders)
Renderer for all proofs below: Blender 4.2.3 Workbench, solid/flat/material,
512×512, ortho (2.3, except faint wide 4.0 — see framing note), transparent
background, no floor, no baked shadow. Files: sprites-bake/rigged/v2-proof/.
Eye-check standard: silhouette continuity (through-tear = a gap through the
body outline or a visible interior hole), limb/body deformation blowout,
pose readability. Flat-shading speckle note (applies to every Dorowani
verdict): the dense Tripo mesh shows scattered few-px dark speckles on the
surface at flat shading (notably head/neck, groin/tail-base in attack) —
these are NOT silhouette breaks and are NOT called tears on this evidence
alone; a textured EEVEE closeup is owed to close them (see §8).
| Clip | Frames (front+side) | Verdict |
|---|---|---|
| Dorowani idle | f15, f30 | PASS (pose) + FIX OWED (Phase B): arms exactly horizontal T-pose in both frames, both views — confirms Mars's NME-5 note. Silhouette otherwise continuous, no tear. Idle-fix §7 corrects the clip; the T-pose is a clip fault, not a rig fault. |
| Dorowani ready | f15 | PASS: battle-guard stance reads (arms raised-guard, wide leg stance, tail between legs). Silhouette continuous, no tear. |
| Dorowani walk | f10, f30 + f0, f20 | PASS (pose + silhouette): f0 front shows a clear stride (one leg kicked out, body leaning); f20 front shows the opposite passing phase (legs together/crossed). The f10 ≡ f30 identity is a SOURCE-DATA finding (decoded GLB walk channels byte-identical at t=0.4167 vs 1.25 — the clip repeats a pose 20 keys apart; render path exonerated). No tear in any walk frame. Walk arms stay open in the authored walk clip — that is the walk clip, not the idle fix scope. |
| Dorowani attack | f10 (gate peak), f18 | PASS (pose + silhouette): f10 side reads as a forward lunge/swipe (arm extended, legs striding, mouth open); f10 front arms-wide swipe. Silhouette continuous, no through-tear. Speckle cluster at groin/tail-base in f10 front — staged for Mars's eyes + EEVEE closeup, not called a tear. |
| Dorowani hit | f4 (gate peak), f10 | PASS (pose + silhouette): f4 side reads as hit recoil (body arched back, head thrown back, arm flung). Silhouette continuous, no through-tear. Gate-flagged hand spikes (frames 7–8, RightHandIndex1/Thumb1) fall between the rendered frames — f7/f8 closeup owed only if Mars wants it; f4/f10 hands read intact. |
| Dorowani faint | f20, f30 + wide (4.0) | PASS (wide renders): f20 side-wide shows the full collapse (lying on back/side, head + fin left, one arm raised high, one hanging, shell hump, legs tucked) — reads as a proper faint, silhouette continuous, no tear. Standard 2.3 ortho CROPS this pose in all 4 standard renders (front touches top y=0; side exits right x=512 + top) — those 4 are framing-incomplete and are superseded by the wide pair for the verdict. f20 ≡ f30 is genuine (end-hold; gate values constant from t≈0.875). |
| Dorowani mapTo3D | ready f15 before/after, front+side | PASS (mapping reads): after-frame shifted +58px X (0.28 m at ortho 2.3 = 62 px predicted — matches), lifted ~5px (0.02 m), spine lean + head pitch read as knocked-back in both views (§6). |
| Gabu idle f15/f30 front+side (ortho 4.0) | PASS (pose + silhouette): wide spiked shell dome, arms out to sides with clawed hands fully in frame, legs apart. Silhouette continuous, no tear. Note (observation, NOT a fix in this batch): Gabu idle arms also read open/horizontal — Mars's locked idle-fix decision covers Dorowani only; no Gabu idle change was instructed or made. |
| Gabu ready f15 front+side | PASS (pose + silhouette): battle-guard stance — arms raised up-out with long claws, spiked shell, legs wide (front); profile shows snout, shell dome, spiky tail trailing (side). Silhouette continuous, no tear. |
| Gabu walk f8/f23 front+side | PASS (pose + silhouette): f8/f23 show opposite stride phases (legs striding, arms swinging, tail visible). Silhouette continuous, no tear. |
| Gabu attack front f15 + side f5/f10/f15/f20/f25 | PASS — see §5 (side-attack verdict): true rig side sweep, bite reads in profile. Silhouette continuous, no tear in any of the 6 attack frames. |
| Gabu hit f4/f10 front+side | PASS (pose + silhouette): f4 side reads as hit recoil (head thrown back/up, mouth open, body leaning back). Silhouette continuous, no tear. |
| Gabu faint f25/f45 front+side (ortho 4.0) | PASS (pose + silhouette): f25 mid-collapse (arms flung up, body slumped); f45 end pose (body slumped low-forward, head hanging, tail curled up). Silhouette continuous, no tear. |
| Gabu framing audit (all 28 files) | PASS: every Gabu render fits inside the frame at ortho 4.0 (no edge touches). The first attempt's 2 ortho-2.3 idle frames were CROPPED at both side edges (Gabu arm span > 2.3 m) and were DELETED — the 4.0 set supersedes them. |
Framing audit (all 26 Dorowani renders, alpha bbox): every non-faint render
fits inside the frame; mapTo3D after-front reaches x=502 (inside, not
clipped); only faint touches edges (above). Prior numeric gates (reference
only, NOT a substitute for visual proof): Dorowani v2 pass2 gate —
attack edge_p999 peak 2.747 at t≈0.417, hit spikes at RightHandIndex1/Thumb1
(frames 7–8), idle max disp 0.0088 m (cleanest clip), walk edge_max 4.526
(largest stretch; visual check owed most here). Source:
v2-work/gate_dorowani_v2p2.json.

## 4. Re-retarget verification (v1 maps vs v2-FINAL skeletons) — DONE
Method: parsed the GLB JSON chunk of every retargeted v1 GLB (no Blender
needed) and checked every skin joint against the v2-final skin-joint set.
Script + full data: sprites-bake/rigged/v2-work/retarget_v2_check.py,
sprites-bake/rigged/v2-work/retarget_v2_check.json.
Source library: western-heart-anims/retarget-manifest.json — 125 human clips,
target skeleton WH-Canonical-22 (22 bones). Retargeted GLBs on disk:
western-heart-anims/retargeted/{dorowani,gabu}-v1, 70 files each, IDENTICAL
filename sets for both creatures.
| Creature | Retargeted clips mapping clean onto v2-final | Coverage of 125-clip library | Unmapped |
|---|---|---|---|
| Dorowani | 70/70 = 100% | 70/125 = 56.0% | 55/125 = 44.0% |
| Gabu | 70/70 = 100% | 70/125 = 56.0% | 55/125 = 44.0% |
Per-family (both creatures, identical): attack 41/41, crouch 2/2, faint 1/1,
guard 3/3, hit 3/3, idle 3/3, jog 1/1, jump 5/5, rise 1/1, roll 3/3, run 2/2,
shield 2/2, walk 3/3 clean.
WH-Canonical-22 skeleton match vs v2-final: all 15 required bones map on both
creatures (Dorowani Chest/Spine via the Spine2 torso joint per the alias
table; Gabu exact names); all 4 optional bones (Spine, Neck, ToeBase L/R)
also map. NO retargeted clip references a dropped v2 joint (shell_main,
fin_root, spike_top were never retarget bones) — the v2 joint reduction
breaks ZERO retargeted clips.
The 55/125 per creature that stay unmapped were NEVER retargeted (no GLB on
disk); that is the reason, not a v2 incompatibility — nothing invented to
close the gap. Note: the manifest still marks all 125 clips
retarget_status "pending" (stale flag); coverage above rests on the GLBs on
disk + the joint-map check, not the manifest flag.

## 5. Gabu side-attack proof — DONE, verdict: BITE READS IN PROFILE, no fix needed
True rig side sweep, 512px Workbench, ortho 4.0, in v2-proof/:
gabu_attack_side_f5/f10/f15/f20/f25.png + gabu_attack_f15_front.png.
Sweep read: f5 windup (head forward, mouth OPEN with teeth visible in
profile); f10 peak (head up/back, mouth WIDE open — the bite snap, jaw gap
and teeth clear in profile); f15 follow-through (head forward, jaw closing);
f20/f25 recovery toward neutral. The attack clip DOES read as a bite/lunge
in profile — head-driven (Gabu is a squat shell creature; the bite is a
head/jaw snap, not a full-body lunge). No pose-key fix was needed; none was
made. This replaces the 256px front frame and the 2D locked-cell preview,
neither of which is presented as proof here.

## 6. mapTo3D exercised against the live rigs — DONE (both creatures)
Code: sprite-art/animation/treatments/battleTreatments.js, mapTo3D(timeline,
pose). Canonical scenario run in Node against the real function (no values
guessed): buildHitTimeline({damageFraction: 0.5, direction: +1, seed: 1})
-> severity HEAVY, totalMs 1040. Sampled at peak recoil t = 640 ms
(sampleHitPose: defenderOffsetX 28 px, defenderOffsetY -2 px,
defenderRotationDeg 4°, defenderArt 'hurt', cameraZoom 1.14, flash 0).
mapTo3D output applied in Blender bone space (Blender Z-up after glTF
import; hit axis +X = screen-right from the front camera; up +Z):
- rootOffsetX 0.28 m -> armature +X 0.28
- rootOffsetY 0.02 m -> armature +Z 0.02 (screen-Y-down negated per code comment)
- spineLeanDeg 10 -> top torso bone (Dorowani Spine2, Gabu Chest) rotated
  +10° about the facing axis (Y), so the spine top moves toward +X
- headPitchDeg -16 -> Head rotated -16° about screen-right axis (X), head snaps back
- cameraDollyM 0.28 -> reported value; camera kept FIXED for before/after
  comparability (dolly moves the arena camera, not the pose)
- hurtPoseWeight 1, flash 0, flashColor white, frozen false
Base pose for before/after: ready clip frame 15, unmodified vs same frame +
above offsets. Proof files (512px, Workbench): v2-proof/dorowani_mapto3d_
before/after_{front,side}.png (ortho 2.3) and v2-proof/gabu_mapto3d_before/
after_{front,side}.png (ortho 4.0 — Gabu's wider box; mapTo3D camera now
honours the spec ortho, fixed in v2-verify.py for the Gabu run).
Dorowani read: after-frame shifted +58px X (0.28 m at ortho 2.3 predicts
62px — matches), lifted ~5px, spine lean + head pitch read as knocked-back
in both views; side bboxes confirm X unchanged in side view (hit axis is
depth, as expected).
Gabu read: after-front shifted +40px X (0.28 m at ortho 4.0 predicts 36px —
matches), guard stance held while leaning back; after-side top lifted 25px
(lean + head pitch). Before-front bbox == ready f15 bbox exactly
(89,147,422,372), confirming the base pose is unmodified ready f15.

## 7. Dorowani idle T-pose — clip-choice fix (Phase B) — DONE + VERIFIED
Mars locked decision: fix by choosing/correcting the idle clip pose keys on
the existing v2-fixed rig — NO rig rebuild. Complied: no rig rebuild, no
mesh/weight change, no v2-fixed overwrite.
Diagnosis (measured): pose dump (v2-work/pose_dump.log) — idle arm/shoulder
rotations are IDENTITY ±1.1° at f0/f15/f30/f45: the idle clip never poses
the arms, so they sit at the rest pose, which reads as T-pose. Probe
(v2-work/probe_arm.log): rest arm direction shoulder→fingertip is ~30°
below horizontal, but the horizontal shoulder stubs + sideways hand fans
read as T-pose in front view; ready arms are a raised guard (not copied).
Fix (hand-keyed FK, script v2-work/idle_fix2.py): mirrored shoulder
rotation ±25° about the facing axis (Y) through each shoulder head, written
as ABSOLUTE keys on all 61 idle frames (shoulder f15/f30 after-Euler:
Left [-23.5, 8.8, -1.3], Right mirrored). Target arm ~55° below horizontal,
hand fan near level — matches the 2D standing cell's diagonal arm.
Attempt 1 FAILED honestly and was discarded, not shipped: v1 rotated the
evaluated matrix per frame, but shoulder rotation channels in idle_rig
have only 2 keys with STEP interpolation, so each frame re-rotated the
previous frame's inserted key — compounding to 16×35° by f15 (arms-up
renders + a compounded .blend, all DELETED). v2's two-pass pristine
snapshot method is immune (verified: single ~25° Euler, not a compound).
Before proof: v2-proof/dorowani_idle_f15/f30_front/side.png (arms horizontal).
After proof: v2-proof/dorowani_idle_after2_f15/f30_front/side.png (arms
clearly diagonal down-out in front view at both frames, bbox narrows from
53–458 to 121–391 px; side view near-identical because a Y-rotation moves
arms in X-Z, which side view sees only as depth — side frames serve as
no-regression checks, silhouette intact, no new tears).
Preserved fix: v2-proof/dorowani-v2-fixed-idlefix2.blend (LOCAL ONLY — the
GLB export of the 1.6M-vert mesh died during primitive extraction in an
earlier session; re-export to GLB is owed only if a downstream lane needs
a GLB, the .blend holds the exact fixed action). v2-fixed.glb untouched.

## 8. Renderer actually used — HONEST STATUS (updated as jobs land)
- Blender 4.2.3 LTS, ~/workspace/tools/blender/blender-4.2.3-linux-x64/blender.
- libegl1: present at session start (1.7.0), LOST when the VM was replaced
  mid-session (brief's warning, verbatim outcome); reinstalled 2026-10-26
  via apt (libegl1 + libgl1 + libglx-mesa0 + libglvnd0) — record for the
  next replacement: `apt-get update && apt-get install -y libegl1` (root).
- EEVEE headless: EGL_BAD_MATCH (0x3009), 0 renders, stuck on sample 1.
  EEVEE under Xvfb: SIGKILLed before first frame (same 137 pattern as the
  concurrent sheets-rigged bake kills that night). Plain-background EEVEE
  on the concurrent bake job crawls at ~5–45 min per 256px frame on this
  1.6M-vert mesh, so 54 EEVEE frames at 512px is infeasible in this batch.
- Renderer actually used for ALL proof renders in this batch: Blender
  Workbench (CPU rasterizer, solid/flat/material, 512px, full mesh, real
  poses, transparent background, no floor, no baked shadow) — geometry
  proof for tears/deformation/pose; textures not shown. Dorowani: ortho 2.3
  (faint wide 4.0). Gabu: ortho 4.0 throughout (arm span > 2.3 m).
  libegl1 was lost TWICE more to VM replacements during this batch and
  reinstalled each time (apt logs v2-work/apt_egl2.log, apt_egl3.log);
  after any future VM replacement, reinstall libegl1 before rendering.
  EEVEE texture subset (Gabu side-attack peak + Dorowani idle-fix after):
  ATTEMPTED next (see §9 note) — reported as completed or still-running,
  never claimed before it exists.
- Prior bake context: the concurrent sheets-rigged Dorowani bake (256px
  EEVEE) produced 11 renders before the restart wave; its renders are
  256px and do NOT substitute for this batch's 512px proofs.

## 9. Status, counts, and what is still owed
- Checkpoint: sprites-bake/rigged/CHECKPOINT-V2-VERIFICATION.md (per-segment).
- Lane-log entry: appended to sprite-art lane log on completion (below).
- NO PR opened in this batch (per task). Proof renders staged locally under
  sprites-bake/rigged/v2-proof/ only. GLBs stay LOCAL ONLY.
- COUNTS: Dorowani clips verified 6/6 = 100% (22 main clip renders + 8
  supplemental + 4 idle-after2 + 4 mapTo3D = 38 PNGs + the preserved
  idlefix2 .blend = 39 artifacts); Gabu clips verified 6/6 = 100%
  (24 clip renders + 4 mapTo3D = 28 PNGs). Total proof files in v2-proof/:
  67 (39 Dorowani + 28 Gabu). Retarget: 70/70 = 100% of retargeted clips
  map clean onto v2-final per creature; coverage 70/125 = 56.0% of the
  125-clip library per creature; unmapped 55/125 = 44.0% (never
  retargeted, not a v2 incompatibility).
- STILL OWED (percentage rule): EEVEE textured proof 0/2 = 0% (Gabu
  side-attack peak + Dorowani idle-fix after-frame — attempt next, see
  below); speckle-cause closeout 0/1 = 0% (flat-shading noise hypothesis
  only, needs the EEVEE closeup); Dorowani idle-fix GLB re-export 0/1 = 0%
  (owed only if a downstream lane needs a GLB; .blend holds the fix);
  hit f7/f8 hand-spike closeup 0/1 = 0% (gated on Mars wanting it).
  Nothing else in this batch's scope is owed.
- EEVEE ATTEMPT (honest, TERMINAL): attempted 08:19–08:30 UTC for the 2
  texture frames (v2-work/eevee_subset.py + run_eevee_subset.sh, logs
  v2-work/eevee_subset.log + eevee_gabu2.log; targets
  gabu_attack_side_f10_eevee.png + dorowani_idle_after2_f15_front_eevee.png).
  Outcome 0/2 = 0%: Gabu job 1 died on a script bug (pose_position
  AttributeError, fixed in the script, then retried); Dorowani job stalled
  on EEVEE sample 1 (EGL_BAD_MATCH, no output, process exited unsaved);
  Gabu retry stalled identically on sample 1 (Time 01:54, no progress)
  and was killed. EEVEE headless cannot render on this VM (same
  EGL_BAD_MATCH failure as the batch's first EEVEE attempt; Xvfb EEVEE
  was SIGKILLed earlier). NO EEVEE frame exists or is claimed. Textured
  proof + speckle-cause closeout need a GPU-capable or Xvfb-stable
  runner — not available in this batch. All geometry verdicts above rest
  on the Workbench renders, which are complete.
