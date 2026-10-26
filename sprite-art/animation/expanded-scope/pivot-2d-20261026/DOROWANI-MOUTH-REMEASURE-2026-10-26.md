# DOROWANI MOUTH RE-MEASURE — PIVOT PHASE 2 (2026-10-26, show-first, NOT placed)

Question from the pivot task: Dorowani's attacks go through the same V3
pipeline as Gabu's approved V3 attack. Result, re-measured this phase:

## Verdict: 0/4 V3 mouths for Dorowani — pipev3q's flag STANDS, no mouth placed

- Pipev3q record (pre-existing, verified this phase):
  `articulation-v2-rework-v3/batch-c/manifest-artic-pipev3q-20261026.json` —
  Dorowani `mouth_applied_sets: 0`, reason on all 4 impact frames: "no
  distinct mouth line on front cell; old (31,24) sits on plain snout".
  Gabu, same file: `mouth_applied_sets: 4`, source (32,29), all 4 gates pass
  (fill ratios 0.772–0.838, all < 0.85; 0 px off-silhouette).
- Re-measurement this phase, two independent checks:
  1. 64px locked battle_front (`dorowani_cell_00.png`) pixel scan, head rows
     y26–36: the snout is smooth blue; below it sits a pale jaw/chin block
     (rows 30–36, x~28–35, ~210–250 brightness). There is NO drawn dark
     mouth line — only the snout/jaw colour boundary at y≈29/30.
  2. Full-resolution source sheet (`sprite-art/dorowani/...sheet-v1...webp`,
     1920x1280, top-left front figure): same finding at full res — smooth
     muzzle, pale lower jaw, no mouth line. Side figures DO show a long jaw
     seam under the snout, but attack frames are built from the FRONT cell;
     a side-measured mouth does not transfer to the front face.
- PIPELINE-V3 rule 7 binds here: "If a future creature's mouth line is not
  cleanly measurable … V3 must measure, not guess — flag it, do not place
  it." Placing a V3 ellipse on the jaw boundary at (31,30) would be a
  guess wearing a gate pass (the gate checks shape/silhouette, not whether
  the centre is a real mouth). Not done.

## What Dorowani attacks ship as in this pivot (show-first)

- V2-rework eyes-only attacks: 4 sets, 22 cells, 22-frame GIF
  (`dorowani-attacks-pivot-2d-20261026-CARRY.gif`, byte-identical carry of
  the pipev3q eyes-only GIF). Eyes change windup → strike → recover; the
  mouth is HELD (base face) on every frame. This is the honest current set.
- NOT carried: Batch C old-method attack mouths (open-bite/grin drawn with
  the flat `patch_median` rectangle). That is exactly the square-block
  fault Mars flagged that created V3 — carrying it would reintroduce a
  rejected defect.
- The contact sheet in this dir labels the Dorowani impact frame
  "atk impact EYES-ONLY (V2)" so Mars sees the gap, not a disguised mouth.

## Mars decisions owed (nothing decided here)

1. ACCEPT eyes-only Dorowani attacks as the pivot set (mouth gap stays
   open, attacks read on eyes + body transform + VFX like Batch B's
   no-mouth creatures: Terradog, Squirmite).
2. ORDER a Layer-3 generated open-jaw keyframe (articulation grammar §6
   Layer 3: generation ONLY where an overlay cannot carry the pose —
   "open-jaw bite on a closed-mouth base" is the grammar's own example).
   That would be new art from the locked battle_front reference under the
   likeness rule (reference first, attributes only, no name in prompt),
   shown first, never auto-locked.
3. ORDER a jaw-edge candidate (V3 ellipse centred on the y≈29/30 jaw
   boundary) shown as an EXPERIMENT, explicitly not V3-passed, for his eye
   only. Not built in this phase so the pivot package contains no guessed
   mouth.

## Counts (percentage rule)

- Dorowani V3 mouths: 0/4 sets = 0% (physical, special, signature, heavy).
- Dorowani attacks with a shipped face change (eyes): 4/4 sets = 100%.
- Gabu V3 mouths (untouched, stands): 4/4 sets = 100%.
- New Dorowani mouth art invented in this phase: 0 frames.
