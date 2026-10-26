# SPRITE-ART LANE — DEFINITIVE 100% CHECKLIST (audit only, no generation, no PR)

Date: 2026-10-25 ~19:27–19:35 CDT. Auditor: sprite-lane audit worker for the coordinator.
Rule applied throughout: every item carries a counted % + count (Mars's percentage rule).
Never "not done" without X% and the count behind it.

## Counting bases — read this first, or the numbers look contradictory

- **49 named creatures** = #001–#046 (46) + #147 Dorowani + #148 Gabu + #331 Mythar.
- **51 sets** = 49 creatures + Strikechamp's 2 extra looks (helmeted lower-only regular
  second look + no-helmet full rare shiny ~10%). Suited is the default look.
  Strikechamp structure is DECIDED (Mars 2026-10-25 ~19:01 CDT) and is NOT listed as blocked.
- **50 atlas dirs** = 49 creatures + Strikechamp unsuited (lower-only) variant dir.
  The 51st game-ready set (Strikechamp unsuited-full) was built by the lock pass from
  the full unsuited sheet; it has no separate atlas dir.
- **Roster slots #047–#146 (100 slots)** are NOT counted in any "100%" below for the
  playable game: they have no designs or names, and per Mars 2026-10-25 ~19:30 CDT they
  stay empty ON PURPOSE until the game is more built (a discoverable thing, made as the
  game goes). Priority is getting the game playable first. They are listed once, in
  §BLOCKED, as intentionally deferred — not as a playable-game blocker.
- Sources reconciled: NEXT-STEPS-AUDIT.md, NEXT-STEPS-QA.md, ATLAS-LOCK-REPORT-PHASE2.md,
  animation/idle/IDLE-INDEX.md, animation/hurt/HURT-INDEX.md, TITLE-SEQUENCE-ART-SPEC.md
  (present), BATTLE-ANIMATION-RESEARCH.md, ARENA-COMBAT-SPEC.md (present),
  GAME-INTEGRATION-ART-GAP.md, GAME-INTEGRATION-BUILD-QUEUE.md, ANIMATION-INDEX.md,
  local disk counts re-verified 2026-10-25, and live GitHub API read-only checks
  (mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start, src/assets/sprite-atlases/ = 52
  entries, src/assets/sprites-2d/ = 53 entries — both include an `animation` dir and
  other non-creature entries, so the repo counts are NOT directly comparable to the
  50/51 local counts; per-creature repo verification is still owed by the PR lane).
- Status key: DONE = evidence on disk cited. IN-PROGRESS = a named job is working it;
  this audit does not duplicate it. OWED = buildable now, one-line brief given.
  BLOCKED-ON-MARS = design decision only; nothing invented here.

## 1. Creature 3-sheet sets (main + angles + lighting)

- DONE — 49/49 creatures = 100%. Evidence: sprite-art/2d-sheets/ (49 creature dirs;
  50 entries incl. README.md). Strikechamp holds suited + unsuited variants in one dir.
- Caveat carried forward (not a recount): 6 starter evolutions #002 Tiidebiite, #003
  AquariiOS, #005 Chromejaww, #006 Reaperdile, #008 Duneclaw, #009 Oblivirex are
  roster-name drafts — art official-for-now under current names, naming set not closed
  (see BLOCKED Q6). Drift notes still open per NEXT-STEPS-AUDIT: Razorgater eye colour
  (red main vs blue angles), Kittember eye shade, Toxitacle eye colour, Pupbble
  bipedal-vs-quadruped read, Stormtalon/Floatcalf/Gearkid style drift between sheets.
  Drift resolution is a canon pass, not new sheets: 0/49 sheets need regeneration for drift.

## 2. Locked atlases (64x64 + locked manifest)

- DONE — 51/51 game-ready sets = 100% (50 atlas dirs + Strikechamp unsuited-full).
  Evidence: sprite-art/game-ready/<name>/<name>_atlas_64_locked.png +
  <name>.manifest.locked.json, 51/51; ATLAS-LOCK-REPORT-PHASE2.md.
  Game-ready cells: 842 total (812 across the 50 atlas dirs + 30 unsuited-full).
- DONE — battle_front + battle_back eye-confirmed: 51/51 sets = 100%.
- DONE — icons in game-ready sets: 51/51 = 100% (39 original atlas icons + 1 relabelled
  + 10 derived head crops + 1 new unsuited-full icon; GAME-INTEGRATION-ART-GAP.md).
  This supersedes the old QA icon gap (Shellguard, Megalochrome): both now served by
  derived head crops from battle_front, eye-verified in the 51-icon montage.
- IN-PROGRESS / OWED split on lock depth (do not overclaim):
  - DONE — BF/BB/icon lock: 51/51 = 100%.
  - OWED — full direction-level verification of every walk/overworld cell:
    3/50 atlas dirs = 6% had it before the lock pass (Chromejaww, Mochii, Tiidebiite
    via prior overrides); 47/50 = 94% remain extractor-assigned + montage-spot-checked
    only. Brief: verify each walk/overworld cell's direction by eye at 64px, record
    corrections in the locked manifest, re-run game-ready/build_game_ready.py.
  - DONE — named lock decisions closed: Krakenox cell 6 split, Strikechamp second-atlas
    decision (full unsuited = shiny, lower-only = regular variant), 6 manifest
    atlas-pointer fixes (ATLAS-LOCK-REPORT-PHASE2.md).
  - OWED — Gearkid battle_back provisional: 0/1 = 0% re-verified at sheet resolution
    (eyes visible at 64px, key visible). Brief: eye-check Gearkid battle_back at sheet
    resolution and confirm or replace the cell before shipping battle.

## 3. Cleaned atlases (white-spot / background cleanup)

- DONE — cleaned atlas PNG + manifest-clean: 50/50 atlas dirs = 100%.
  Evidence: sprite-art/atlases/<name>/*_atlas_64_clean.png + *.manifest-clean.json,
  50/50; atlases/_tools/clean_atlas.py + CLEANUP-REPORT.md.
- NOT SHIPPED BY DESIGN — the *_clean files still carry merged-pair cells and
  pre-lock roles; the game-ready locked set supersedes them (ATLAS-LOCK-REPORT-PHASE2).
  Do not push both variants; the PR lane must ship locked only.
- DONE (tool) / OWED (rollout) — white-spot tool upgrade, CORRECTED by late evidence
  2026-10-25 (background check finished after the first audit draft): the upgrade
  DOES exist as sprite-art/atlases/_tools/spot_check.py + SPOT-CHECK-UPGRADE.md.
  It is the pre-presentation gate Mars ordered (2026-10-25 ~19:14–19:15 CDT):
  Gate A trapped near-white patch (>=30px, mean min-channel >=240, fully interior,
  no border touch) auto-cut; Gate B flat ground patch (flat mid-gray colours
  occurring nowhere else, bottom 25% of cell) cut by exact colour; small clusters
  (<30px: teeth, highlights, claw tips) NOT cut; large patches failing the gates are
  FLAGGED and the run exits 1 (no presentation until resolved); originals never
  overwritten (cleaned copies are *_clean.png). v2 correction: v1 cut 126px of
  Razorgater idle design highlights and missed the ground patch — v1 _clean files
  were deleted; v2 cuts exactly 95px (Razorgater HURT) and 139px (Razorgater IDLE
  a/b/c) and nothing else. Separating body-gray (design) from negative-space light
  spots (background) is by component/position + exact-colour uniqueness, not colour
  alone — the trap Mars flagged is handled.
  - OWED — rollout: pipeline integration into tools/sprite-stack/sprite_pipeline.py
    (extract -> spot_check --clean --fail-on-flagged -> pack -> manifest) is specified
    in SPOT-CHECK-UPGRADE.md but its wiring into the pipeline was not verified here.
  - OWED — re-run report: run spot_check over all 51 idle sets + 51 hurt sets + 842
    game-ready cells and record a clean/dirty report: 0/51 idle sets and 0/51 hurt
    sets re-verified under the new detector in a single recorded run = 0% re-verified.
  - Razorgater HURT + IDLE spots themselves: CUT by spot_check v2 (95px + 139px) per
    the upgrade note — the shipped-cell files carrying those cuts still need a
    per-file confirmation (which *_clean.png is the shipped one) before presenting
    Razorgater hurt/idle as clean; do not re-cut them.

## 4. Idle loops

- DONE — idle loops delivered: 51/51 sets = 100%. Evidence: animation/idle/<creature>/
  (51 .idle.json manifests, 153 frame PNGs = 51 × 3, 4-step [A,B,A,C], loop=true).
- DONE — idle timing reconciliation: 51/51 = 100% (grounded 25 @2400ms, small_bouncy 7
  @1600ms, float_hover 2 @1800ms, hover_swim 9 @1800ms, seated 1 @2400ms,
  static_crystal 1 @2200ms, heavy_slow 6 @2800ms; IDLE-INDEX.md).
- DONE — idle eye-check sample: 7/51 sets enlarged-4x verified (Mochii, Wispkin,
  Cocoonode, Ashemit, Zephling, Strikechamp unsuited, Manticlaw).
- OWED — idle eye-check for the remaining sets: 44/51 = 86% not individually eye-checked
  (7/51 = 14% checked). Brief: enlarged-4x contact-sheet check per remaining set,
  confirming bob/breath/hover/pulse reads as idle, not attack or walk.
- OWED — optional per-creature redrawn second poses: 0/51 = 0% (not required for a
  moving loop; only if Mars wants redrawn poses). Brief: generate one redrawn second
  pose per creature from its locked battle_front, same likeness, transparent 64x64.
- OWED — Dorowani/Gabu rig-idle-clip timing: 0/2 = 0% (no rig clip file found locally;
  dorowani-gabu-pulled/ holds only a README). Brief: read the real rig idle clip and
  replace the grounded-baseline fallback timing in the 2 idle manifests — owned by the
  rig-fix lane, not invented here.
- OWED — idle push to repo / src/assets wiring: 0/51 = 0% (local staging only by design).
  Brief: PR the 51 idle manifests + 153 PNGs into src/assets and wire the battle scene
  to play them (see §11 treatments wiring — same PR lane, not this audit).

## 5. Attack frames

- DONE — attack frames extracted from locked sets: 1/51 sets = 2%
  (Strikechamp unsuited-full cells 21–27, 7 cells, ANIMATION-INDEX.md).
  All other 50/51 sets = 98% have 0 attack-role cells in the locked set.
- OWED — attack frames to generate: 50/51 sets = 98%. Brief (per set): generate one
  distinct striking/lunging pose from the locked battle_front cell, matching the main
  sheet exactly, 64x64 transparent, no baked text, no glow ring/platform/grid; at 64px
  attack ≠ idle and attack ≠ hurt. Incidental style references only (not shippable
  crops): Pyromonk side attack cells 25–28, Duskfiend large main-sheet attack pose,
  Yogiferno staff/fire poses (crop the fire platform by default).
- IN-PROGRESS — attack presentation is carried by code, not art, for the 50 sets
  without attack art: battleTreatments.js staging (windup/hitstop/recoil/recover) +
  ARENA-COMBAT-SPEC §2.1 travel/strike staging. That code path is DONE as a module
  (see §11); the per-creature art is still OWED above. Do not confuse the two.
- OWED — Mochii attack pilot exists only as a proof file (animation/pilot/ +
  animation/proof/attack-exchange-mochii-razorgater.png): 1 pilot, not a shipped
  attack set. Brief: cut the approved pilot pose to a 64px game cell + manifest entry
  for Mochii, or regenerate if the pilot is not approved as the shipped frame.
- OWED — faint-collapse art per body archetype: 0 archetypes = 0% drawn (staging +
  timing specified in ARENA-COMBAT-SPEC §2.1, 800–1200ms + 300–500ms fade; drawings
  not made). Brief: draw one faint-collapse pose per body archetype (grounded,
  quadruped, flyer, swimmer, floater, seated, crystal, heavy), 64x64 transparent.
- OWED — dedicated sparring/clash pose art per creature: 0/51 = 0% (2D clashes reuse
  idle transforms + translation per ARENA-COMBAT-SPEC §5.1; dedicated poses are a
  future per-creature generation job if Mars wants them, not a blocker).

## 6. Hurt frames

- DONE — hurt manifests reporting done: 50/51 sets = 98% (all except Pupbble).
  Evidence: animation/hurt/<creature>/<creature>.hurt.json, status=done, 50/51.
- DONE — hurt cell files present on disk: 51/51 creature dirs = 100% have at least
  one *_hurt_cell_*.png (56 cell files total incl. superseded v1/v2 variants).
  Note the discrepancy this audit found: Pupbble's manifest still says `gap`, yet
  pupbble_hurt_cell_00.png (6,191 bytes) plus a v2 raw generation now exist on disk.
  The manifest was not updated when the cell landed. That is a manifest-sync fix,
  not a new generation — see OWED below.
- DONE — Mochii hurt pilot: APPROVED as-is by Mars (2026-10-25 ~19:01 CDT, "looks
  perfect"); pilot file untouched, 64px cell cut. NOT owed, NOT regenerated.
- IN-PROGRESS — finish-to-100% hurt/treatments agent (Mars 2026-10-25 ~19:13 CDT):
  everything from the battle-animation report to 100% — hurt art from 4/51 = 8% (old
  count) to 51/51, plus the full code-treatments list. Delivered so far per
  HURT-INDEX.md: Batch 1 (9 sets) + Batch 3 (13 sets) + Batch 4 (13 sets) + parallel
  batches = 50/51 manifests done. What that agent has NOT yet delivered at audit time:
  (a) Pupbble manifest sync, (b) eye-check certification for all 50 done sets by one
  pass (Batch 4 certified only its own 13; Batch 1's 9 + original 4 certified by their
  own passes; the remaining 24 manifest-done sets are NOT certified by a single
  eye-check pass in HURT-INDEX.md §8), (c) game wiring (see §11).
- OWED — Pupbble hurt manifest sync: 0/1 = 0% synced. Brief: eye-check
  pupbble_hurt_cell_00.png enlarged AND at 64px against the locked battle_front; if
  it passes, flip pupbble.hurt.json status to done with source + timing (500ms hold);
  if it fails, regenerate one Pupbble hurt frame (v1 failed on integrity_check, v2
  raw exists but was never certified).
- OWED — single-pass hurt eye-check certification: 26/50 done sets = 52% certified
  by their own batches (13 Batch 4 + 9 Batch 1 + 4 original); 24/50 = 48% uncertified
  by any named pass. Brief: enlarged + 64px eye-check per uncertified set, record
  pass/fail + caveats in its .hurt.json (do not re-generate passing sets).
- OWED — hurt art for Strikechamp's three looks is DONE (suited + lower-only +
  shiny all in the 50), so no Strikechamp hurt item remains. Do not re-list it.

## 7. Walk frames in all 4 directions (2+ frames per direction, mirror allowed)

- DONE — walk-complete sets: 15/50 atlas sets = 30% (14/49 creatures = 29%).
  PASS sets: #002 Tiidebiite, #005 Chromejaww, #007 Tyrage, #013 Pupbble,
  #027 Toxitacle, #030 Strikechamp suited + unsuited-full, #033 Mechapion,
  #034 Gorokappa, #036 Cragarm v2, #040 Dreadtoise v2, #043 Duskfiend,
  #045 Pyromonk, #046 Yogiferno, #331 Mythar (NEXT-STEPS-QA.md).
- OWED — walk-incomplete sets: 35/50 = 70% (34 creatures + Strikechamp lower-only
  counted separately as a partial set). Breakdown by queue (GAME-INTEGRATION-BUILD-QUEUE):
  - BQ1a walk D+U together, 17 creatures: Mochii #001, AquariiOS #003, Razorgater #004,
    Reaperdile #006, Oblivirex #009, Pyropaw #011, Manticlaw #012, Quakehound #015,
    Mothrix #018, Aerobeak #020, Stormtalon #021, Finblade #022, Floatcalf #024,
    Astroleviathan #025, Inklet #026, Krakenox #028, Pebblefist #035.
    Brief (per creature): generate D+U walk/movement cycles in one pass from main
    sheet + game-ready side cells, back view = no face, 2+ distinct frames per
    direction, 64x64 transparent, no baked text/ring/platform/grid.
  - BQ1b walk-up only, 6 creatures: Duneclaw #008, Terradog #014, Punchkid #029,
    Kickmaster #031, Gearkid #032, Shellguard #039.
    Brief (per creature): generate one back-view walk cycle (up only, down already
    usable), same acceptance as BQ1a.
  - BQ1c single-frame top-ups, 4 creatures: Terrapod #037 (D+U), Sproutle #038 (D),
    Dorowani #147 (D+U), Gabu #148 (D missing + U single-frame).
    Brief (per creature): generate 1+ more frames per short direction to reach 2+,
    OR close without generation if Mars accepts a 1-frame bob (see BLOCKED Q5).
  - BQ5 mirror identification (extraction, not generation), 3 creatures: Cragarm #036,
    Pixilite #041, Yogiferno #046. Brief (per creature): identify which existing
    cells are side poses (labels unreliable), mirror one side, record source cell
    in the locked manifest, view at 64px.
  - Walk direction weakness overall: down weak/missing 27 creatures; up weak/missing
    34 creatures (every non-passing creature); side: no creature lacks a side view;
    mirror-only for one side: 7 sets (#002 R, #031 R, #032 R, #036 L, #041 R, #043 R,
    #046 R partial) — mirroring is an atlas-step action, already built for Tiidebiite,
    Kickmaster, Duskfiend, Gearkid; still owed for Cragarm, Pixilite, Yogiferno (BQ5).
- BLOCKED (not OWED) — movement-treatment creatures, see BLOCKED Q3/Q4: Ashemit #044,
  Wispkin #042, Cocoonode #017 (no walk at all), Squirmite #016 (orientation decision),
  Zephling #019 + Megalochrome #023 (flyer/swimmer D/U, in BQ4b), Pixilite #041
  (front/back walk treatment). Generation follows the decision, not the other way round.

## 8. Battle front/back + overworld views

- DONE — battle_front present: 51/51 sets = 100%. Battle_back present and a true back
  view: 51/51 = 100%, with 2 indistinguishable-by-eye judgements kept as labelled
  (Cocoonode #017, Pixilite #041 — faceless by design; front-as-back is a judgement
  call, flagged in manifests, not silently fixed).
- DONE — overworld front/back/side standing views: 51/51 sets = 100% each as standing views.
- OWED — nothing new to generate for battle/overworld standing views: 0/51 sets owed.
  The only open overworld item is the Gearkid battle_back provisional re-verification
  (§2) and the walk-direction verification (§2, §7).

## 9. Icons + portraits

- DONE — icons: 51/51 game-ready sets = 100% (§2). No icon generation owed.
- OWED — dedicated large portraits (separate from 64px icon): 0/49 creatures = 0%.
  Brief (after BLOCKED Q7 decision): either (a) scripted upscale of battle_front
  (no new art), (b) generate one bust portrait per creature (128px+ source, main-sheet
  style, clean background, downscaled), or (c) reuse the 51 game-ready icons as
  portraits (no new work). Do not generate 49 busts until Mars picks (a)/(b)/(c).

## 10. Title / intro art

- PRESENT — TITLE-SEQUENCE-ART-SPEC.md exists (not absent). Spec completeness:
  11/11 rows specced = 100%.
- DONE — title/intro image assets newly made + referenced: 6/9 = 67% exist somewhere
  in the original spec count; UPDATED at audit time (files found on disk beyond the
  spec text): title-bg-key-art-v2.png EXISTS (v1 had Tyrage missing + Gabu duplicated;
  v2 is the corrected background — v2 still needs an eye-check verdict recorded),
  starter presentation art S1 EXISTS (starter-mochii-s1.png, starter-razorgater-s1.png,
  starter-tyrage-s1.png). Revised count: T2 (title background, v2) + I1 + I2 + I3 +
  S1 (3 files) = 7 image assets made; T1 (logo lockup, UI-art lane) + A1 (Professor
  Aeon, human-characters lane) already had = 2 referenced. Total existing: 9/10 = 90%.
- OWED — title-bg v2 eye-check verdict: 0/1 = 0% recorded. Brief: view v2 at full size,
  confirm all five distinct creatures (Mochii, Razorgater, Tyrage, Dorowani, Gabu)
  present exactly once each, logo/version/press/studio bands clear, no baked text,
  no Pokemon motifs; record PASS or NEEDS-V3 in the spec.
- OWED — title/intro wiring (T3 composite + shine/banner/blink/fade): 0% in this lane
  (UI-art lane's owed wiring; spec only here). Brief: implement the layer stack
  (T2 background → T1 logo → version banner → PRESS ANY KEY blink 30/15 → studio logo)
  with the §1 animation phases, any-key skip, in game code.
- BLOCKED — I4 silhouette→colour reveal frame: 0/1, needs Mars's pick of the featured
  creature (see BLOCKED Q8). A2 Aeon lab/garden background: 0/1, needs the lab/garden
  location design locked (see BLOCKED Q9). I5 studio-beat frame: NOT owed — duplicates
  the UI-art studio asset; excluded from the owed count.
- OWED — title/intro frame size conformance: 4/4 made frames are off-spec size
  (T2 v1 was 1120x2240 vs specced 1200x1500; I1/I3 1920x1280 vs 1920x1080; I2 2352x1008
  vs 1920x1080). Brief: resize/centre-crop each frame to spec at wiring time; verify
  v2/S1 sizes at the same pass (sizes not recorded in the spec for v2/S1).

## 11. Battle backgrounds + arena/3D bakes + treatments wiring

- OWED — battle backgrounds (dedicated arena/battle-scene backgrounds): 0 named
  battle-background assets found in this lane = 0%. Brief: paint one battle background
  per arena surface type (garden, dojo, lake, cave, tournament — list to be confirmed
  against the game's arena list; do not invent surface types beyond the game's arenas),
  1920x1080, no creatures, no baked text, layers separate from creature sprites.
  Note: intro/title frames (I1–I3) are NOT battle backgrounds and must not be counted
  as them.
- DONE — arena/3D bakes from rigs (Dorowani + Gabu only): bake frames exist —
  Dorowani bake v1+v2, Gabu bake v1+v2, Manticlaw special-variant bake only,
  Megalochrome bake (NEXT-STEPS-AUDIT). Kaggle-corrected 64px bakes: Dorowani +
  Gabu front/side-left/side-right (+256px masters) with manifests
  (blender-bakes/kaggle-corrected/). Count: 2/2 rig creatures = 100% have bake frames;
  47/49 creatures = 96% have no rig/bake (2D-only by design, not a gap for the 2D game).
- IN-PROGRESS — Dorowani/Gabu rig fix (tears/weights): status NOT verified as fixed
  on disk at audit time. The bake renders exist, but no rig-fix completion report was
  found in sprite-art/ at audit time; the gap doc records it as "separate and
  read-only here; it does not block the 2D game-ready sets." Brief for the rig lane:
  fix tears/weights, re-bake Dorowani + Gabu front/side/back + walk + battle poses,
  verify root-motion + facing bones (ARENA-COMBAT-SPEC §5.2 requirements 1–5).
- IN-PROGRESS — retarget pass: 125/125 clips staged = 100% staged, 0/125 retargeted
  = 0% (western-heart-anims/retarget-manifest.json + STAGE-2-SUMMARY.md: all 125
  `retarget_status: "pending"`; staged files exist on disk, 0 missing). Previews exist
  for Dorowani-v1/Gabu-v1 attack clips (retargeted/previews/). This is a separate
  (western-heart) lane's pass, not sprite-art's; sprite-art's dependency is only:
  retargeted Dorowani/Gabu clips must land before arena 3D claims are made for them.
  Brief for the retarget lane: retarget 125 staged clips to the Dorowani/Gabu rigs,
  verify root-motion + facing bones per clip, record per-clip status (not "pending").
- DONE — arena combat spec: ARENA-COMBAT-SPEC.md PRESENT (not absent), spec only,
  100% specced (state machine, modifiers, camera shots, demo scenario). NOT game code.
- DONE — arena combat module: sprite-art/arena-combat/arenaCombat.js + captureLoop.js
  + demo.js + fanMechanics.js, with tests (arenaCombat.test.js, fanMechanics.test.js,
  captureLoop.test.js). Test results VERIFIED 2026-10-25 (late background run):
  node --test on all three test files = 55 tests, 55 pass, 0 fail.
- IN-PROGRESS — arena combat agent (build agent): owns wiring arenaCombat.js +
  sampleArenaPose/sampleClashPose into the battle scene per ARENA-COMBAT-SPEC §5.1/§6.
  Delivered so far: spec + module + tests (local staging). Game wiring: 0%.
- DONE — treatments module: animation/treatments/battleTreatments.js, 8/8 checks pass
  (HURT-INDEX §5; Node v24.22.1 at that pass), plus battleTreatments.test.js and the
  3D proof (animation/treatments/proof-3d/, Dorowani↔Gabu impact/recoil renders).
  Beats: windup 250ms → hitstop 90ms → recoil 300ms → recover 400ms = 1,040ms total;
  severity from damage fraction only; mapTo3D documented.
- IN-PROGRESS — treatments wiring agent: WIRING.md + treatments-wiring.patch +
  battleTreatments.ts.txt are DONE as deliverables, but the in-place game edit is
  BLOCKED (work clone has uncommitted BattleView/App/gameStore/WorldEngine/etc.
  modifications from other lanes; anti-clobber law forbids editing over them).
  Game wiring: 0%. Brief for the PR lane: apply the patch AFTER those lanes land or
  on a clean checkout, together for BattleView + PixiBattleCanvas (shared
  BattleAttack/onImpact/onDone contract), then run the 8-point verification.
- OWED — treatments wiring follow-ups (at wiring time, not new art): per-move particle
  flavours (colour/shape per move type): 0 moves = 0% mapped; arena-rig verification
  of mapTo3D on live Dorowani/Gabu rigs: 0/2 rigs = 0% exercised; reconciliation of
  animation/*.animation.json hurt fields (still say "gap" for sets now done in
  hurt/*.hurt.json): 0/51 = 0% reconciled — parent reconciles at PR time.
  Brief: map particle flavour per move type in the treatment module; exercise mapTo3D
  against both live rigs and record root/facing/spine/head results; rewrite the 51
  animation manifests' hurt fields from the hurt manifests (do not hand-edit per set).
- OWED — Megalochrome anti-gravity water ripple VFX: 0/1 = 0% as a separate animated
  layer. Brief: build one looping ripple-ring effect layer (transparent PNG sequence
  or shader/particle layer, sized to the Megalochrome cell, timed to its hover_swim
  idle 1800ms class), applied UNDER/AROUND the creature sprite at runtime — NEVER
  baked into model geometry and never baked into the locked atlas cells (the atlas
  cells stay clean; the ripple is an effect variant only, per BUILD-QUEUE BQ4b note).
  Floatcalf ripple cells, if any, are effect variants under the same rule.
- OWED — Gabu side-view attack preview: 0/1 = 0% as a named preview artefact.
  Brief: render one side-view Gabu attack preview (front + side pair, like the
  retargeted/previews/ Dorowani-v1 attack pairs) from the Gabu rig/bake, for the
  arena-combat demo; record it under sprite-art/arena-combat/ or blender-bakes/gabu/.
  Note: Gabu side views DO exist as bake frames (side_left/side_right 64px + 256px);
  what is owed is the attack preview pairing, not the side view itself. Do not confuse
  the two.

## 12. Garden / Creature-Mode / Arena pose extensions

- OWED — garden-specific poses (feed/play/sleep/reactions): 0/49 creatures = 0%.
  Brief: only after BLOCKED Q10 (garden pose list) is decided — do not generate until
  the list exists (BUILD-QUEUE BQ7).
- OWED — Creature-Mode / Arena named animation sets beyond BQ1 walk + BQ3 attack/hurt:
  0/49 = 0% as named sets; no separate queue items until playtesting shows a missing
  pose (BQ7). Brief: playtest Creature Mode + Arena with walk + attack + hurt wired,
  log missing poses per creature, then generate only the logged poses.
- OWED — arena floor visuals (surface types, scorch/crater/splash aftermath marks
  persisting to battle end): 0 surfaces = 0% painted (staging specified in
  BATTLE-ANIMATION-RESEARCH §4d / ARENA-COMBAT-SPEC §8; art is a separate job).
  Brief: paint one aftermath-mark set per surface type (scorch, crater, splash),
  transparent overlays, fade at battle end.

## 13. Repo / PR state (this lane's staging vs the live repo)

- DONE (local) — everything above is local staging under sprite-art/; nothing in this
  audit was pushed, and no work-clone git changes were made by this audit.
- OWED — PR batch(es) to land the local staging into the repo: idle (51 manifests +
  153 PNGs), hurt (50 done manifests + cells + Pupbble sync), treatments module +
  wiring patch, arena module, title v2 + S1, and the locked game-ready set if not
  already on main. The live repo already contains src/assets/sprite-atlases/ (52
  entries incl. animation dir) and src/assets/sprites-2d/ (53 entries incl.
  manticlaw-special-variant) per read-only API check 2026-10-25 — the PR lane must
  diff local vs repo per creature before pushing, and must NOT push both the
  *_clean and locked variants for the same creature (§3).
- OWED — repo verification of hurt/idle/title files: 0/51 hurt sets, 0/51 idle sets,
  0 title files verified present in src/assets/ at audit time (API checks above
  listed top-level dirs only; per-file verification is the PR lane's job).

## IN-PROGRESS (do not duplicate — owners + what they have actually delivered)

1. Dorowani/Gabu rig fix — owner: rig-fix lane. Delivered: bake renders (v1+v2) +
   Kaggle-corrected 64px bakes exist. NOT delivered at audit time: a rig-fix
   completion report (tears/weights fixed) or re-baked poses from fixed rigs.
   Blocks: arena 3D claims for Dorowani/Gabu only; does NOT block the 2D game-ready sets.
2. Retarget pass — owner: retarget lane (western-heart-anims). Delivered: 125/125
   clips staged, 0 missing; Dorowani-v1/Gabu-v1 attack previews. NOT delivered:
   any retargeted clip (0/125, all `retarget_status: "pending"`).
3. Finish-to-100% hurt/treatments agent — owner: hurt/treatments lane. Delivered:
   50/51 hurt manifests done, treatments module 8/8 tests, WIRING.md + patch + TS port,
   3D proof renders. NOT delivered: Pupbble manifest sync, single-pass eye-check for
   24/50 done sets, game wiring (blocked on dirty work clone, §11).
4. Arena combat agent — owner: arena-combat lane. Delivered: ARENA-COMBAT-SPEC.md,
   arenaCombat.js + captureLoop.js + demo.js + fanMechanics.js + tests (local staging).
   NOT delivered: game wiring (0%), sampleArenaPose/sampleClashPose in the battle
   scene, mapTo3D exercised on live rigs (0/2).
5. White-spot tool upgrade agent — owner: white-spot lane. Delivered (CORRECTED):
   atlases/_tools/spot_check.py + SPOT-CHECK-UPGRADE.md, v2 cutting exactly Razorgater
   HURT 95px + IDLE 139px, with flag-and-exit-1 on unresolvable patches. NOT delivered:
   pipeline wiring into tools/sprite-stack/sprite_pipeline.py, or a single recorded
   re-verification run over all idle/hurt/game-ready cells.
6. Fan-project pull agent — owner: fan-pull lane. Delivered (CORRECTED by late evidence):
   LOCAL STUDY ONLY pulls under mochiichao-work/fan-reference/ — 6 projects:
   Freakyy-11_Arena-2D, sunsunyul2014-ai_pokemon-arena, Blynch17_poke-arena,
   BerserkLove_PokemonColosseum, lcheng871118-glitch_Empress-iOS, hiro-s-2000_pokemon_arena_2d
   — plus fan-reference/MECHANICS-EXTRACT.md (what was observed vs taken, in own words)
   and fan-reference/LICENCES-NOTES.md (factual licence status per project: 4 no licence
   file found, Empress-iOS licence covers porting shell only, hiro-s-2000 Apache-2.0
   with only LICENSE+README in the reachable tree). Shipped code is Mochiichao's own
   rebuild in sprite-art/arena-combat/ (fanMechanics.js, captureLoop.js); NOTHING from
   the fan pulls is shipped to the repo or the game (MECHANICS-EXTRACT.md states this
   explicitly). Sanitization rule stands: Pokemon names/cries/logos/characters →
   Mochiichao equivalents before anything ships. NOT delivered: any fan file in the
   public repo (by design, none should be there).

## OWED BUILD QUEUE (briefs — buildable now, in order)

1. Pupbble hurt manifest sync (1 set) — eye-check cell, flip status or regenerate.
2. Walk BQ1a D+U (17 creatures) + BQ1b up-only (6) + BQ1c top-ups (4) — 27 creatures
   total in the walk queue (BQ4b flyer/swimmer overlaps are decided by Q4, not here).
3. Attack frames (50 sets) — one striking pose per set from locked battle_front.
4. Mirror identification BQ5 (3 creatures: Cragarm, Pixilite, Yogiferno).
5. Full walk/overworld direction verification (47/50 atlas dirs).
6. Gearkid battle_back sheet-resolution re-verification (1 cell).
7. Idle eye-check for remaining 44 sets (enlarged 4x contact sheets).
8. Hurt single-pass eye-check certification (24 uncertified done sets).
9. Treatments + arena game wiring (patch application after clean checkout) + hurt-field
   reconciliation in the 51 animation manifests + per-move particle flavours.
10. Title-bg v2 eye-check verdict + frame size conformance (T2/I1/I2/I3 + v2/S1).
11. Title/intro wiring T3 (UI-art lane's implementation; this lane supplies T2/I1–I3/S1).
12. Battle backgrounds (per arena surface type) + arena aftermath marks.
13. Megalochrome ripple VFX as a separate animated layer (never baked geometry/cells).
14. Gabu side-view attack preview pairing (front + side).
15. Faint-collapse art per body archetype (8 archetypes).
16. Dedicated portraits (49) — only after Q7 decision; do not start before the decision.
17. Garden poses (49 creatures) — only after Q10 pose list; do not start before it.
18. Idle redrawn second poses (51) — optional polish only, after the playable core.
19. Dedicated clash poses (51) — optional, only if Mars wants them after playtesting.
20. PR batches: idle, hurt, treatments, arena, title, locked-set diff vs repo (no dual
    clean+locked push).

## BLOCKED-ON-MARS (design decisions only — exact questions, nothing invented)

- Q1. Roster slots #047–#146 (100 slots): INTENTIONALLY EMPTY, not a playable-game
  blocker. Per Mars 2026-10-25 ~19:30 CDT: "do NOT fill the 100 empty slots yet. They
  stay empty ON PURPOSE until the game is more built — a fun DISCOVERABLE thing, made
  as the game goes. Priority is getting the GAME PLAYABLE FIRST." Question for later
  (not now): when the game is more built, which slot order + design direction should
  the first discoverable batch follow? No designs or names invented here.
- Q2. Starter evolution names (#002/#003/#005/#006/#008/#009): art is official-for-now
  under current roster names; is the naming set closed, or are replacement names still
  coming? (Manifests flag these "draft" for names only.)
- Q3. Movement treatments for Ashemit #044, Wispkin #042, Cocoonode #017 (no walk at
  all): (a) generate a standing walk set in all four directions, or (b) Ashemit
  floats/meditates while moving / Wispkin bobs in place / Cocoonode rolls-or-rotates?
  Generation follows this decision.
- Q4. Flyer/swimmer D/U movement (Zephling #019, Aerobeak #020, Stormtalon #021,
  Finblade #022, Megalochrome #023, Floatcalf #024, Astroleviathan #025): confirm
  movement frames (wing-beat / tail-swim position changes, not legs) are the right
  approach, and that side movement + top-down front/back standing poses are the
  correct references? (Also covers Squirmite #016 orientation decision and Pixilite
  #041 front/back walk treatment.)
- Q5. Single-frame bob acceptance (Terrapod #037 D+U, Sproutle #038 D, Dorowani #147
  D+U, Gabu #148 D+U): accept a 1-frame bob as complete, or generate 1+ more frames
  per short direction?
- Q6. (Merged into Q2 — starter names; no separate question.)
- Q7. Portrait approach: (a) upscale battle_front, (b) generate new bust portraits,
  or (c) reuse the 51 game-ready icons as portraits?
- Q8. Intro silhouette→colour reveal frame I4: which creature is featured?
- Q9. Aeon intro-scene background A2: what is the lab/garden location design?
  (A guessed lab would be rework; location design must be locked first.)
- Q10. Garden pose list: which poses (feed/play/sleep/reactions) per creature, and
  does Creature-Mode/Arena need any pose beyond walk + attack + hurt?
- Q11. Cocoonode/Pixilite front-as-back judgement: locked as labelled (faceless) —
  override only if Mars picks different rotations. (Recorded as decided-unless-overridden,
  not as an open generation item.)
- NOT blocked (decided, do not re-ask): Strikechamp structure — suited default,
  helmeted lower-only regular second look, no-helmet full unsuited rare shiny ~10%.
  Mochii hurt pilot — APPROVED as-is, not owed. Wispkin V1 = default set; V2/V3 trait
  sheets are a separate folder, never the main set.

## Overall lane percentage (counted, not vibes)

Playable-core sprite items (this lane, excluding intentionally-empty slots #047–#146
and excluding optional polish): DONE items above vs the full item list in §1–§13.
Headline roll-up for the coordinator:
- 3-sheet sets 49/49 = 100% · locked atlases 51/51 = 100% · cleaned atlases 50/50 = 100%
- battle front/back 51/51 = 100% · overworld standing 51/51 = 100% · icons 51/51 = 100%
- idle loops 51/51 = 100% (timing reconciled 51/51 = 100%)
- hurt manifests 50/51 = 98% · hurt cells on disk 51/51 dirs = 100% (1 manifest unsynced)
- attack frames 1/51 = 2% · walk-complete 15/50 sets = 30%
- title/intro assets 9/10 = 90% exist (wiring 0%) · portraits 0/49 = 0%
- treatments module DONE (8/8 tests) but game wiring 0% · arena spec+module DONE locally,
  game wiring 0% · retarget staged 125/125 = 100%, retargeted 0/125 = 0%
- rig-fix completion: NOT verified (0/2 rigs confirmed fixed) · white-spot upgrade tool:
  DELIVERED (spot_check.py v2, Razorgater 95px + 139px cut); pipeline wiring + full
  re-verification run still owed · battle backgrounds 0 surfaces = 0%
- garden poses 0/49 = 0% · faint art 0 archetypes = 0% · ripple VFX 0/1 = 0%
  · Gabu attack preview pairing 0/1 = 0%
- Slots #047–#146: 0/100 designed, intentionally deferred per Mars 19:30 CDT — excluded
  from the playable-100% denominator, not counted as owed work for the playable game.
