# VERIFICATION — Dreadtoise attacks, PIPELINE V3 (2026-10-26, FINISH-FIRST Phase 1)

Status: STAGED ONLY, show-first, NO PR. (V3 precedent — build_v3.py for
Kittember/Tiidebiite — is staged-only; this build follows it. Mars
eye-checks before any PR. No files Mars has seen were overwritten:
everything here is new, tag artic-pipev3-20261026, under the new
`articulation-pipev3/dreadtoise/` subdir.)

## What was built (4 sets / 22 cells / 1 GIF)

- `dreadtoise-attacks-artic-pipev3-20261026.gif` — 22 frames, 256px,
  pilot durations verbatim + 250 ms hold on each set's last frame:
  shell_ram 200/130/110/90/550, water_gun 200/120/110/110/550,
  twin_barrage 200/100/100/140/120/550, fortress_slam
  220/140/120/120/100/670 (totals 830/840/960/1120 ms + holds).
- Per-set cells `dreadtoise-artic-pipev3-20261026-<set>-cell-NN.png`
  (22). Method: pilot attack cells verbatim EXCEPT index 3 (the impact
  role in all four sets), which carries a V3 contour-fit mouth.
- Expressions (pipev3 EXPR mapping, unchanged): physical + signature
  -> open-bite with teeth (Dreadtoise keeps its teeth, per the
  approved impact-only template); special -> grin; heavy -> grimace.
- Mouth source centre: cross-checked mean (31.7, 37.0) — enlarged
  locked cell_00 opening bbox ~(32.5, 38), and inverse-propagated red
  mouth bbox centres from all four pilot impact frames:
  (31.59, 36.94), (31.50, 37.00), (32.00, 37.20), (31.57, 36.73),
  spread 0.5 px. Approved impact-only template anchor (32, 38) is
  within 1.0 px. Propagate math is exactly the pilot compose math
  (scale about bottom-centre (128,232)@256, translate, /4) — verified
  against the pilot recover frame (alpha bbox y3-47 vs source y9-53,
  the 6 px up-shift from the 232 anchor).
- Builder: `../build_v3_dreadtoise.py` (new file, no overwrites).
  Manifest: `manifest-artic-pipev3-20261026.json` in this dir.

## Gates (V3, all pass)

| Set | Impact action | Changed px | Changed bbox | Fill ratio | Inside mask | Off-silhouette |
|---|---|---|---|---|---|---|
| shell_ram | v3-mouth-open-bite | 189 | 20x13 | 0.727 | yes | no |
| water_gun | v3-mouth-grin | 112 | 16x9 | 0.778 | yes | no |
| twin_barrage | v3-mouth-open-bite | 183 | 18x15 | 0.678 | yes | no |
| fortress_slam | v3-mouth-grimace | 126 | 18x9 | 0.778 | yes | no |

All fill ratios < 0.85 (shaped patches, not blocks), 0 px
off-silhouette. Non-impact cells: 18/18 byte-identical to pilot.
Pre-gate (mouth centre inside pilot silhouette) passed on all four
impact frames. No rectangles, no flat median patches anywhere (V3
mouth_fit module used verbatim).

## Eye-check at 512px (this run)

- shell_ram impact: open-bite sits ON the face — white teeth row +
  red mouth under the amber eyes, aligned with the jaw. Reads as an
  impact roar. Bold by design (open-bite + 1.22x stretch); Mars
  judges the size.
- water_gun impact: grin arc sits on the face at the propagated
  centre; old open mouth cleared to blurred base (no block). Reads
  subtler than the open-bites (arc, not a filled mouth) — expected
  for a grin; Mars judges.
- twin_barrage impact: open-bite on the face, same read as shell_ram.
- fortress_slam impact: grimace zigzag line across the mouth area,
  subtle (line only, no fill) — same behaviour as pipev3 grimaces.
- Triplets (pilot base | old artic20261026 | V3) + mouth-zone zooms
  for all four impact frames are in this dir
  (`dreadtoise_<set>_base_old_v3.png`,
  `dreadtoise_<set>_mouthzoom_base_old_v3.png`), plus a 512px
  contact of all four triplets
  (`dreadtoise-impact-triplets-512.png`). The old middle tiles show
  the failure this build replaces: giant white-sclera cartoon eyes
  pasted over the face (Dreadtoise anatomy is amber iris + dark
  pupil, never white sclera) and mouths on the chin/plastron.

## SHELL_RAM CELL_06 — RESOLVED WITHIN LOCKED CANON (no new judgment taken)

The hold, stated precisely (the task's "middle frame" is ambiguous,
so both readings are answered):

1. ONLY pilot shell_ram frame index 1 (role lean, the charge step)
   is sourced from dreadtoise_cell_06. The literal middle frame
   (index 2, strike), and every other shell_ram frame, is cell_00.
2. cell_06 IS locked canon: locked-manifest role walk_side_0,
   game_ready=true, same source sheet as cell_00, Dreadtoise v2
   animal body, 2 cannons visible. Despite the role name
   "walk_side", its head faces FORWARD: measured on the enlarged
   cell_06, eyes amber at (27-28, 29-30) and (36-37, 29-30), closed
   mouth line centre ~(32, 37) — the SAME face position as cell_00
   (eyes y29-30, open mouth centre (32.5, 38)) within ~1 px. Its body
   differs (walk stance, legs spread, taller frame); its face does
   not move, and it is NOT a side-angle face and NOT a likeness
   change.
3. The old artic20261026 failure on that frame is therefore NOT a
   cell_06 problem. The old builder drew every frame at FIXED anchors
   (eyes (27,36),(39,36), mouth (33,43)) with no per-frame
   propagation. Against pilot frames (identity face: eyes y~23.5,
   mouth y~32 after the 232-anchor shift) those anchors sit
   ~11-12 px BELOW the true face on EVERY dreadtoise frame, cell_00
   and cell_06 alike — grimace on the plastron, "eyes" on the teeth,
   guard circles on the spread legs. On the lean frame it only reads
   worst.
4. Resolution taken here (no new cell, no re-base, no likeness
   change): the cell_06 lean frame ships as pilot base VERBATIM in
   this build (V3 touches impact frames only), so no overlay can
   misplace on it, and its true face position is now recorded above
   for any future full-articulation pass, which must propagate
   measured anchors per frame instead of reusing fixed ones.

## FLAGGED FOR MARS (not decided here, not a blocker for this staging)

1. Keep-vs-re-base (Mars's call): the lean frame could be re-based
   onto battle_front cell_00 (the precedent used for Dreadtoise
   hurts, where a side-angle hurt cell broke front-battle
   continuity). That would CHANGE approved pilot motion (walk-step
   -> front brace), so it was NOT done here. If Mars wants it, it is
   a one-frame pilot change + rebuild, not a new drawing.
2. Mouth size/read on the impact frames (especially the bold
   open-bites) is Mars's eye-check call, as with pipev3 ("V3
   grimaces read smaller/subtler... its size is Mars's call").
3. This build articulates mouths ONLY (V3 scope). The old
   artic20261026 eye/hand overlays (white sclera, fixed anchors) are
   NOT carried over and are NOT fixed here — a full eye articulation
   pass for attacks, if wanted, needs amber-anatomy eyes + propagated
   anchors and is a separate, later item. Do NOT ship the old
   artic20261026 attack GIF as finished: its face overlays are
   misplaced ~11-12 px low on pilot frames (see above).

## Untouched

Pilots, artic20261026 files, impact-only template package, hurts
(PR #158 approved set), all other creatures' pipev3 files, the repo
work clone (no push, no PR from this task).
