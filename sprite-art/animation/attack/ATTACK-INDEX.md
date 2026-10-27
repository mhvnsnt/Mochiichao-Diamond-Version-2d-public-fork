# ATTACK INDEX — all 51 sets (Step 1, local staging, 2026-10-25)

## Before -> after
- Before (PR #32 index): attack extracted 1/51 = 2% (strikechamp_unsuited_full
  only, 7 cells); other 50 sets: attack status `gap`, files `[]`.
- After this pass: attack sets 51/51 = 100% staged.
  - 50/51 transform sets (4 frames each = 200 PNGs): windup, strike lunge,
    impact hold, recover, rendered from each creature's own locked
    battle_front cell. Validator: `validate_attack.py` -> 51 checked, 0 errors.
  - 1/51 extracted set kept as-is (strikechamp_unsuited_full, 7 cells from
    game-ready/strikechamp_unsuited_full/cells/, NOT regenerated).
- Existing `*.animation.json` files were NOT edited (new-filenames-only);
  these manifests + this index are the reconciliation.

## Method (honest, same precedent as the accepted idle loops)
Locked atlases carry NO attack-role cell for 50/51 sets, so a redrawn pose
per creature would be 50 generations with likeness-drift risk. Transform
frames from the locked battle_front cell guarantee likeness and visibly
move (lean-back -> lunge -> hold -> recover). They are NOT redrawn attack
poses; redrawn poses are a per-creature stage-7 polish upgrade, not a
wiring blocker — exactly as idle noted for redrawn poses.

## Timing (matches battleTreatments.js, unchanged)
Windup 250 ms / hitstop (impact hold) 90 ms / recoil 300 ms / recover 400 ms
= 1,040 ms for the hit. Attacker frames: windup 250, strike lunge 120
(travel pre-phase on top of the 1,040 ms), impact hold 90, recover 400.
Defender recoil is carried by the hurt set (51/51 done, untouched here;
Mochii's approved hurt pilot kept exactly as-is, never regenerated).

## Move data — scope correction applied (Mars ~19:44 CDT)
Moves and animations are NOT replaced. NO move name was genericized into
a shape in this lane. Every attack manifest carries `move_data`:
- Decomp source: fresh-start/src/lib/generated/decomp_firered_moves.json
  (pret pokefirered battle_moves.h, 354 moves) — reference contact moves:
  Pound 40/100/35 Physical, Tackle 35/95/35 Physical, Quick Attack
  40/100/30 Physical (priority), Scratch 40/100/35 Physical, Ember
  40/100/25 Special, Water Gun 40/100/25 Special.
- Mochiichao canon: fresh-start/src/lib/moves.ts MOVES_DB (36 moves, e.g.
  Water Orb 40/100/25, Aqua Cannon 90/100/15, Hydro Surge 120/80/5).
- Rule: Step 2 selects the creature's actual move from MOVES_DB; these
  lunge frames play under it, and Step 4 adds the move's real elemental
  VFX by move name. Move power/accuracy/priority change damage and turn
  order, NOT frame durations.
- Exclusions kept: Pokemon creature names, sounds, art, dialogue only.
- Slots #047-#146: NOT designed, named, or generated here — empty on purpose.

## Capture (standing corrections, for the record)
No capture track was built or wired by this lane. Default capture stays
normal Pokemon-style (Luigi Cubes). Ring capture is a separate, later,
OPTIONAL gated system (new retro-arcade-THEMED zone, NOT the existing
Harbor City Safari/preserve, NOT literally called "Arcade Zone", name
still open for Mars to pick; mechanic stays ring capture, Mochiichao's
own version) — built by its own follow-up batch, not here, not default.

## Research sweep wired in this batch (standing continuation order)
- PixiJS AnimatedSprite per-frame custom timing ({texture, time}
  FrameObjects, MIT PixiJS docs): manifests already carry duration_ms
  per frame, so `pixiAnimationAdapter.js` (toPixiFrames + loopFor) maps
  them 1:1 for Step 2's PixiJS v8 adapter. No retiming, no new dependency.
- 12 principles of animation, frame-count guideline (industry-standard):
  attack 3-6 frames = snappy, idle breathing 4-8 = subtle. Our attack
  sets are 4 frames and idle loops 4 steps — both fit, no change made.
- Already-reviewed, NOT re-pulled: Beasts CC0 easing + Tuxemon GPL
  technique-only (see treatments/WIRING.md); decomp FireRed/HeartGold/
  Black 2 extraction JSONs (moves/learnsets/evolutions/trainers).
- NOT pulled on purpose (per World Builder lane list): Tuxemon GPL code,
  LPC share-alike art, engine rewrites, Pokemon code/art/music/dialogue.

## White-spot gate (spot_check.py v2, upgraded tool)
Ran on animation/attack/: 200 files scanned, 84 with findings,
flagged-unresolved. Root cause checked, NOT a new defect: the source
locked cells themselves flag identically (e.g. Zephling battle_front
cell_02 flags 379px mean-too-dark + 102px not-fully-interior) — the
transform only shifts/scales source pixels, so flags are inherited
locked-art properties (design whites: Zephling bellies, etc.), not new
trapped background introduced by this pass. `_clean` derivatives from
the scan were deleted; attack frames themselves are the deliverable.
The pre-existing flagged queue (191 flagged-only files in the idle/
game-ready sweep) stays a review queue for the QA-lock step; no flagged
file is presented as clean.

## Handoff to Steps 2-6 (do NOT build here)
- Step 2 (battle): attack manifests + pixiAnimationAdapter.js +
  treatments module + treatments-wiring.patch (blocked in-place edit,
  patch applies after dirty work-clone lanes land). Treatments tests
  11/11 pass; arena suite 55/55 pass (re-run 2026-10-25).
- Step 3 (overworld): walk-complete 17/51 = 33% (see WALK note below);
  follower-walking + fight-as-creature are Step 3's scope, not built here.
- Step 4 (VFX/sound): ripple module + megalochromeRipple.js; move VFX
  by real move name (see Move data above).
- Steps 5-6 (playtest/QA): validate_attack.py is the QA-lock gate for
  this batch; full QA lock still owed (see Remaining below).

## Other finishing items in this batch
- Hurt: 51/51 = 100% (manifest + <creature>_hurt_cell_00.png per set,
  reconciled from manifests, NOT the stale HURT-INDEX.md table).
  Razorgater hurt/idle white-spot fixes: DONE by the upgraded tool
  (hurt 95px + idle a/b/c 139px cut to _clean files, teeth intact).
  Mochii hurt pilot: untouched, approved as-is.
- Idle timing reconciliation: 51/51 = 100% recorded (IDLE-INDEX.md):
  grounded 25 @2400ms, small_bouncy 7 @1600ms, float_hover 2 @1800ms,
  hover_swim 9 @1800ms, seated 1 @2400ms, static_crystal 1 @2200ms,
  heavy_slow 6 @2800ms; retimed 41/51, kept-with-justification 10/51.
  No PNG changed, no silent retime.
- Icons: 2/2 = 100% — by the OTHER (walk/icons) lane, canonical at
  sprite-art/icons/shellguard/shellguard_icon_v1.png and
  sprite-art/icons/megalochrome/megalochrome_icon_v1.png (+ 64px copies
  in game-ready/*/icons/). This lane generated duplicates, found the
  earlier delivery on disk, and DELETED its own duplicates — do not
  re-add them; PR the canonical files only.
- Title/intro (spec 9-image target, TITLE-SEQUENCE-ART-SPEC.md):
  T2 title-bg v2 + I1/I2/I3 + S1 starter trio (3) + I4 silhouette-reveal
  (this batch, Mochii #001 composite from locked S1 art; v1 failed
  eye-check as a black rectangle because S1 has a baked cream
  background — v2 rebuilt by background-difference mask, PASS) +
  A2 Aeon lab background (this batch, provisional garden-lab, PASS:
  no people, no text, centre clear) = 9/9 image assets exist
  (T1 + A1 referenced from UI-art/human lanes; I5 excluded — duplicates
  the UI-art studio asset). A2 stays PROVISIONAL until the lab/garden
  location design locks; I4 featured creature is a labelled Mochii
  default, swappable if Mars picks another. T3 press-start composition
  wiring remains UI-art lane's (code, not art).
- Megalochrome ripple VFX: done — 4 frames (radii 18/30/44/60) +
  megalochromeRipple.js drawRipple() for Step 4. Eye-check PASS.
- Gabu side-view attack preview: done as a 512px 2D preview from the
  locked walk_side_0 cell + lunge transform (eye-check PASS: side
  profile, teal + brown shell + spiky fringe). NOT a Blender rig
  render: Gabu's rig attack preview on disk is FRONT view at 256px
  (clip_attack_f15.png); no Blender binary in this session, so a
  native 512px rig side render remains owed IF the rig lane requires
  a true rig render (Dorowani side rig render attack_f10_side.png
  exists at 256px for comparison).
- Rig fix: v2-fixed GLBs exist for BOTH Dorowani (33 joints, 76->33)
  and Gabu (27 joints); weights verified sums 1.0, 0 orphans,
  <=2 influences 85.3% Dorowani / 87.7% Gabu (95% soft target NOT met
  — remaining 3-4 influence verts are legitimate blends, not chased).
  v1 rigged files untouched (new v2-fixed names only). Native 512px
  rig preview renders still owed (existing previews are 256px).
- Retarget: wiring-manifest 125 human clips (111 direct-preview
  verified, 9 joint-render, 4 partial, 0 unverified; 5 actions
  pending-not-wired with reasons, intro among them — no segment
  invented). Creature retarget GLBs: dorowani-v1 70 + gabu-v1 70 =
  140 files; retarget previews 360 PNGs (dorowani 108, gabu 108,
  human 144). Creature coverage is 70 source clips per creature,
  NOT 125/125 — the remaining wiring clips per creature are NOT
  retargeted, and the manifest itself marks Dorowani/Gabu retarget
  as pending until the rigging coordinator confirms skeleton match
  + a render on the creature rig proves it. That confirmation is
  the retarget blocker; no clip was invented to close it.
- Arena combat: arenaCombat.js + captureLoop.js + fanMechanics.js +
  demo.js + tests, suite 55/55 passing (re-run 2026-10-25). Ring
  capture NOT wired by this lane (see Capture above).
- Treatments: battleTreatments.js + tests 11/11 pass; mapTo3D proven
  against live Dorowani/Gabu rigs (proof-3d/, rig-Y sign fix applied).
  In-game wiring 0% (patch delivered, blocked on dirty work clone)
  — Step 2's item, not this lane's.

## WALK note (not this batch's claim)
Walk-complete (QA definition: 2+ frames in all four directions):
17/51 = 33% (15 QA PASS + Mochii + Razorgater from the walk/icons
batch). Owed 34/51 = 67% (23 leg-walker/general, 8 flyer/swimmer
down/up, 3 movement-treatment: Wispkin/Ashemit/Cocoonode). Baseline
discrepancy unresolved: producer-next note said 16/51 before that
batch vs QA baseline 15 — 1-set difference, parent to reconcile.
sprite-art/overworld/walk/ holds transform steps for 51 dirs but
per-dir files run 3-9 (only 12 dirs with 8 PNGs) — partial, NOT
counted as complete. Walk completion belongs to Step 3 (overworld),
not Step 1.

## Remaining below 100% (exact blockers)
1. Walk-complete 17/51 = 33% — blocker: per-creature generation /
   movement-treatment batches (Step 3); transform steps alone do not
   make leg-articulated walks.
2. Treatments in-game wiring 0% — blocker: dirty work clone
   (BattleView.tsx + 12 other files modified by other lanes); patch
   applies after those lanes land or on a clean checkout.
3. Retarget creature coverage 70/125 clips per creature — blocker:
   rigging-coordinator skeleton-match confirmation + creature-rig
   render proof; no segment invented.
4. Native 512px rig previews — blocker: no Blender binary in this
   session (existing previews 256px; 2D 512px Gabu preview delivered).
5. Title A2 provisional + I4 default — blocker: lab location design
   lock + Mars's featured-creature pick (both swappable, not blocking
   wiring).
6. PR batch — NO PR number yet: staging is local-only in
   sprite-art/ (not the fresh-start repo); parent/wiring coordinator
   opens the batch PR from a live-verified main head (latest noted
   main 8ea59854, PR #36 title music) with 404-check, 0 deletions,
   mergeable + clean gate. Never bundle with other lanes' work;
   never overwrite a file already shown to Mars (all files here are
   new names; canonical icons are the other lane's files).

## Files (this batch, new names only)
- sprite-art/animation/attack/_build_attack.py
- sprite-art/animation/attack/<creature>/<creature>.attack.json (51)
- sprite-art/animation/attack/<creature>/attack_{a_windup,b_strike,c_impact,d_recover}.png (200)
- sprite-art/animation/attack/pixiAnimationAdapter.js
- sprite-art/animation/attack/validate_attack.py (51 checked, 0 errors)
- sprite-art/animation/attack/ATTACK-INDEX.md (this file)
- sprite-art/animation/ripple/megalochrome/ripple_0..3.png + megalochrome.ripple.json + megalochromeRipple.js
- sprite-art/animation/gabu-side-attack-preview/gabu_attack_side_512.png + gabu-side-attack-preview.json
- sprite-art/title/intro-frame-04-silhouette-reveal-mochii-v1.png + .json
- sprite-art/title/media-generation-aeon-lab-background-provisiona-0-8ad70ff1-5e83-4c07-bc40-1e850365f2b7.png (A2 provisional)
