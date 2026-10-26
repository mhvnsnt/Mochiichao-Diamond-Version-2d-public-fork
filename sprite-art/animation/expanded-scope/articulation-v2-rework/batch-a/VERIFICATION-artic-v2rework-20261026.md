# PIPELINE-V2 REWORK — BATCH A, EYES-ONLY under MOUTH HOLD (2026-10-26, tag artic-v2rework-20261026)

Staged only, NO PR, show-first. Builder: `build_v2rework.py` in this dir.
Manifest: `manifest-artic-v2rework-20261026.json` (per-frame actions,
propagated eyes, held mouth positions, gate counts, diff bboxes).

## What this is — and what it is NOT

Mars approved PIPELINE-V2 on Aquariios + Reaperdile attacks (~10:48 CDT);
those two are DONE and were NOT touched here. This rework covers the other
five Batch A articulated creatures: razorgater, tyrage, kittember, sproutle,
tiidebiite, attacks only. Chromejaww stays BASE (flagged, no overlays).
All hurts stay BASE (face-changing; nothing hurt-related was touched).

MOUTH HOLD (Mars ~10:50 CDT Kittember, ~10:51 CDT Tiidebiite): the old
retrofit mouths on Kittember and Tiidebiite attacks were rejected because
the skin/fur-coloured crop around the mouth goes square and does not fit.
A V3 contour-fit mouth module (face-following, feathered, NO rectangular
crops/clear-boxes) is being wired as the new standard, with Kittember +
Tiidebiite as the proof scope. THEREFORE: NO mouth is finalized in this
build. Impact frames carry EYES ONLY under V2; every mouth position is
recorded in the manifest as `prop_mouth_held_v3` and NO mouth shape, crop,
or clear-box rectangle was drawn anywhere. The triplets prove it: in every
V2 (right) tile the mouth is the untouched base mouth, while the OLD
(middle) tile shows the rejected square block (Kittember/Tiidebiite heavy
and physical are the clearest examples). When PIPELINE-V3.md + the contour
module land, V3 mouths are applied on top of THESE eyes-only frames and the
delta vs these V2 versions is reported (mouths changed vs V2 = all of them,
since V2 mouths here are base by hold, not by design).

Base cells are the clean batch-a cells (razorgater/tyrage/sproutle from
`batch-a/*-rebased/`, kittember/tiidebiite from `batch-a/<creature>/`),
NOT the retrofit cells — retrofit impact cells already carry old overlays
and reusing them would double-overlay. This matches the pipev2 precedent.

## Corrected eye anchors (64px source coords) — re-measured, not copied

Method (V2 rule 1): cluster centroids of TRUE feature pixels on the
untransformed source front cell, then eye-checked on enlarged markers
(old cyan cross vs new magenta cross, in `_measure/`; Tyrage also has a
16x head crop). Old marker crosses were treated as hypotheses, as V2
requires — and they were wrong in every case except Tiidebiite (near-exact).

| Creature | OLD eyes | NEW eyes (this build) | Change (left / right) | True feature measured | eye_r |
|---|---|---|---|---|---|
| Razorgater | (22,22),(38,22) | (21.7,21.3),(37.7,21.3) | -0.3/-0.7 ; -0.3/-0.7 | red cores, 3px clusters (left x21-22 y21-22; right x37-38 y20-22) | 1 |
| Tyrage | (21,17),(35,18) | (20.2,15.0),(35.5,14.7) | -0.8/-2.0 ; +0.5/-3.3 | dark discs + white bar (right bar x37 y14-16; right centre = dark+bar combined, dark-only centroid was 35.2,14.5) | 2 |
| Kittember | (17,26),(31,26) | (16.0,26.3),(30.3,25.8) | -1.0/+0.3 ; -0.7/-0.2 | amber clusters (left 7px x15-17 y24-28; right 9px x29-31 y23-28) | 2 |
| Sproutle | (24,21),(40,21) | (24.3,20.1),(38.5,19.7) | +0.3/-0.9 ; -1.5/-1.3 | teal discs in visor (left 9px x23-26 y19-21; right 13px x37-40 y17-21) | 2 |
| Tiidebiite | (23,21),(31,20) | (23.0,21.6),(31.2,20.0) | 0/+0.6 ; +0.2/0 | black discs (left 5px x22-24 y21-22; right 5px x30-32 y19-21) | 1 |

Largest corrections: Tyrage right eye -3.3px in y (old cross sat BELOW the
disc, confirmed on the 16x head crop) and Sproutle right eye -1.5x/-1.3y
(old cross sat on the visor edge, right of the disc). Razorgater/Kittember
corrections are sub-pixel to ~1px but real (old crosses sat low/right of
the true cores). Tiidebiite old anchors were essentially correct; the
+0.6y left shift is the disc centroid vs the old round number.

Mouth anchors: NOT re-measured to final. Old retrofit mouths are carried
in the manifest only as held positions — razorgater (32,40), tyrage
(31,28), kittember (23,31), sproutle (32,33), tiidebiite (27,24) — pending
V3 contour-fit. No mouth change is claimed in this build.

Eye grammar (no sclera anywhere): razorgater red-brown disc + dark centre;
tyrage dark disc + white vertical bar (bar drawn on widened/glance, not a
dot); kittember amber disc + dark pupil; sproutle dark-teal disc + white
highlight dot inside the visor; tiidebiite black disc + white highlight
dot. Teeth: drawn nowhere in this build (teeth belong to mouths, held).

## V2 geometry + gates (all on the final frame)

- Overlay drawn AFTER the cell transform in final-frame coordinates;
  every eye dimension multiplied by that frame's (sx, sy) — ellipses, not
  circles, under squash (e.g. physical sx=1.25/sy=0.75, heavy sx=1.3/sy=0.72).
- NO clear-box rectangles anywhere. The heavy `half` state draws a lid over
  the top half of the eye disc itself, not a patch over the face.
- Size caps: eye base radius = true radius above; widened = 2x true radius
  (scaled), exactly the pipev2 formula.
- Pre-gate (final frame, 7x7 window at each propagated eye): feature px
  >= threshold — razorgater red-widened >=1, tyrage dark >=2, kittember
  amber >=3, sproutle teal >=3, tiidebiite dark >=2 (thresholds set from
  source-window counts, allowing squash loss; no gate2, no forcing).
- Post-gate: every changed px within 2px of the base silhouette.
  Fail either gate = base, never a guess.
- Timing: Mode A impact-momentary — overlay ONLY on cell_03 of each attack
  set. Expressions by family (pilot timings): physical widened, special
  glance, signature widened, heavy half.

## Results — 20/20 impact frames, eyes-only, both gates pass

| Creature | GIF (22 frames each) | Impact frames overlaid | Pre-gate counts (L,R per set: phys/spec/sign/heavy) | Diff bboxes (eye-row only, y-height <= 9px) |
|---|---|---|---|---|
| Razorgater | razorgater-attacks-artic-v2rework-20261026.gif | 4/4 | (3,4) (4,5) (5,4) (3,4) | x13-51, y-heights 5,3,5,3 |
| Tyrage | tyrage-attacks-artic-v2rework-20261026.gif | 4/4 | (5,7) (6,8) (7,9) (6,8) | y-heights 7,5,9,3 |
| Sproutle | sproutle-attacks-artic-v2rework-20261026.gif | 4/4 | (8,10) (7,9) (8,8) (8,9) | y-heights 7,5,9,3 |
| Kittember | kittember-attacks-artic-v2rework-20261026.gif | 4/4 | (8,8) (8,7) (10,10) (8,8) | y-heights 8,5,9,4 |
| Tiidebiite | tiidebiite-attacks-artic-v2rework-20261026.gif | 4/4 | (4,4) (4,5) (5,4) (5,4) | y-heights 6,5,7,4 |

Post-gate inside-silhouette: True on all 20. Non-impact frames: 18/22 cells
per creature byte-identical to batch-a base cells; the only differing
cells are the 4 overlaid impact frames, and their diffs are confined to
the eye row (see diff bboxes above — no mouth-row px changed anywhere,
which is the mechanical proof of the mouth hold). Total: 110 cells
(5 x 22), 20 overlaid eyes-only, 0 mouths finalized, 0 hurts touched,
0 Aquariios/Reaperdile/Chromejaww/Batch B files touched.

## Enlarged eye-check (base / old / V2-eyes triplets, all 20 impact frames)

Files: `<creature>_<set>_base_old_v2eyes.png` (left base, middle old
retrofit, right this build). Eye-checked: all 5 physical triplets + both
V3-proof-scope heavy triplets (Kittember, Tiidebiite); remaining 13
triplets staged alongside for Mars. PASS on placement in every checked
tile: V2 eyes sit on the true eyes; no block in any V2 tile; squash
respected (eyes elliptical under sy<1). What the triplets also show,
plainly: the OLD middle tiles carry the rejected square mouth blocks
(Razorgater jaw grey box, Kittember/Tiidebiite grey/black mouth blocks,
Sproutle/Tyrage open mouths) — all absent from the V2 tiles, whose mouths
are base. Mars-judgement items (not defects): widened eyes read large by
design (2x true radius, same as approved pipev2); Tyrage widened discs
read especially large on the small head, as in the old retrofit.

## Held / owed (explicit, with percentages)

- Mouths: 0/20 = 0% finalized — HELD for V3 contour-fit on all 5 creatures
  (Kittember + Tiidebiite are the V3 proof scope; the other 3 mouths ride
  the same module once proven). This build is the eyes-only foundation V3
  applies on top of; it is NOT a finished attack set.
- Eyes: 20/20 = 100% of Batch A rework impact frames, both gates pass.
- Overall Batch A V2 rework (eyes + mouths, 5 creatures): eyes 100%,
  mouths 0% — do not present these GIFs as final attacks until V3 lands.
- Aquariios + Reaperdile V2 (artic-pipev2-20261026): untouched, still done.
- Next step when V3 lands: apply contour-fit mouths to these 20 frames,
  report per-mouth delta vs this V2 eyes-only baseline (every mouth will
  read as changed, since V2 mouths here are base), re-run both gates on
  the final frames, and re-stage under a V3 tag without overwriting this
  build.
