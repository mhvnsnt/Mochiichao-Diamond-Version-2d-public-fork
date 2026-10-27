# BATCH-E PIPELINE-V2 REWORK — VERIFICATION, EYES ONLY (2026-10-26)
Tag: artic-v2rework-20261026. Staged only, NO PR, show-first.
Builder: build_v2rework_eyesonly.py in this dir. Manifest: manifest-artic-v2rework-20261026-eyesonly.json.

## MOUTH HOLD (Mars 2026-10-26 ~10:50 CDT) — obeyed
NO mouth overlay is drawn on any frame in this batch. No rectangular crop,
no clear-box, no patch_median anywhere in the builder. Mouths are 0/8 = 0%
finalized and wait for the V3 contour-fit module (PIPELINE-V3.md). When V3
lands, contour-fit mouths go onto these exact eyes-only frames, and the
per-mouth delta vs this eyes-only baseline is reported then. These GIFs
are NOT final attacks until V3 mouths land. V2 mouth shapes were NOT drawn
as a stopgap, per the hold order (eyes may proceed, mouths wait).

## Scope
- punchkid + pyromonk attacks only. pixilite + shellguard untouched (base-only).
- Mode A: overlay on impact frame only (cell-03 of each attack set).
- Hurts untouched: base, face-changing (per batch-e manifest detection).
- Batch-e originals, Batch B, pilots, approved hurts untouched. New filenames only.

## Anchors RE-MEASURED (64px source coords) — old vs new
Old anchors recovered from the old held top cells themselves (separated
disc centroids, inverse-propagated; special/signature merged-disc midpoints
agree). Old disc radius was 5 in source terms (11px final bbox) on both
creatures — far over the true eye size, which is why the old faces read as
pasted-on whole-face discs.

| Creature | Eye | Old (source) | New true (source) | Delta (new-old) | True feature |
|---|---|---|---|---|---|
| punchkid | left | (27.1, 18.8) | (25.9, 16.7) | -1.2, -2.1 | blue/dark-blue cluster, bbox 3w x 6h, centroid of 2 predicates (agree <0.2px), grounding check (26.8, 16.8) within 0.9px |
| punchkid | right | (38.1, 18.8) | (37.2, 16.2) | -0.9, -2.6 | blue cluster, bbox 3w x 6h, grounding (36.8, 16.6) within 0.4px |
| pyromonk | left | (27.2, 13.0) | (25.5, 13.0) | -1.7, 0.0 | white sclera (25,13) + dark pupil (26,13) |
| pyromonk | right | (35.0, 13.0) | (31.7, 12.2) | -3.3, -0.8 | dark (31,12) + grey (32,12) + light (33,12); grounding (31.4, 12.3) within 0.6px |

Old errors in final-frame terms: up to ~+4px at sx=1.3 (pyromonk right eye),
plus the 11px discs covering jaw/cheek. New size caps: punchkid widened
ellipse rx=3*sx, ry=3*sy (true half 1.5w x 3h, width doubled, height held);
pyromonk widened rx=2*sx, ry=2*sy (true half 1x1, pipev2 formula). Glance =
true size shifted +1*sx. Impact eye states (Batch C corrected table):
physical widened, special glance, signature widened, heavy widened
(NOT half-lid — half-lid bars read as face paint on punchkid's red band /
pyromonk's red-white box).

Eye anatomy / teeth: punchkid blue vertical ovals, no teeth visible (mouth
is a thin dark line, no white teeth) -> teeth NO. Pyromonk white sclera +
dark pupil, no teeth visible -> teeth NO. Mouth candidates recorded for
V3 only, NOT drawn, NOT claimed final: punchkid (32.5, 21.0) dark line
x31-34 y21; pyromonk mouth NOT cleanly measurable on the front cell
(no clear dark mouth line at face centre; chin shading at y20-21 is not
a mouth) — V3 must measure it, do not guess.

## Gates ON THE FINAL FRAME (per frame, cell-03)
Pre-gate: true-feature px within +/-3px of each propagated corrected
anchor. Post-gate: every changed px within 2px of the base silhouette.
Fail either = base, never forced. One first-run failure, fixed by a
MEASURED predicate change (not a loosening for convenience): pyromonk
heavy first failed pre-gate at the right eye (0 px) because the LANCZOS-
blended highlight falls to (196,193,179), below the strict all>200 white
test — the same blended-core case pipev2 documented for Reaperdile.
Added clause: channel range <30 AND luminance >180 (skin lum ~150-170
with range 70-90, and gold pattern, stay excluded). Re-run: heavy right
eye count 1 (that exact blended highlight, 1.4px from the propagated
anchor). All 8 frames then pass both gates.

| Creature | Set | Propagated eyes (final) | sx,sy | Eye state | Pre-gate counts L/R | Diff bbox (x0,x1,y0,y1,n) | Post-gate inside silhouette |
|---|---|---|---|---|---|---|---|
| punchkid | physical jab_rush | (33.9,22.5),(48.0,22.2) | 1.25,0.75 | widened | 14 / 14 | 30,52,20,25,66 | True |
| punchkid | special power_shot | (20.2,10.7),(30.9,10.2) | 0.95,1.00 | glance | 16 / 16 | 20,33,7,14,34 | True |
| punchkid | signature combo_barrage | (20.0,15.4),(33.0,15.0) | 1.15,0.90 | widened | 16 / 15 | 17,36,12,18,74 | True |
| punchkid | heavy knockout_finisher | (28.1,23.9),(42.8,23.6) | 1.30,0.72 | widened | 14 / 12 | 24,47,22,26,66 | True |
| pyromonk | physical flame_fist | (33.4,19.8),(41.1,19.2) | 1.25,0.75 | widened | 2 / 2 | 31,43,17,22,42 | True |
| pyromonk | special flame_shot | (19.8,7.0),(25.7,6.2) | 0.95,1.00 | glance | 2 / 3 | 20,28,5,8,10 | True |
| pyromonk | signature inferno_barrage | (19.5,12.1),(26.7,11.4) | 1.15,0.90 | widened | 3 / 1 | 18,29,9,14,42 | True |
| pyromonk | heavy blaze_crash_finisher | (27.5,21.3),(35.6,20.7) | 1.30,0.72 | widened | 3 / 1 | 25,39,20,22,34 | True |

Result: 8/8 impact frames overlaid eyes-only = 100% of eyes; 0/8 mouths = 0%.

## Counts
- Per creature: 22 attack cells (5+5+6+6), 18 byte-identical to batch-e base,
  4 overlaid (cell-03 only). 44 cells total, 8 overlaid.
- GIFs (pilot timings verbatim, +250ms on each set's last cell per pipev2):
  punchkid-attacks-artic-v2rework-20261026-eyesonly.gif (22 frames),
  pyromonk-attacks-artic-v2rework-20261026-eyesonly.gif (22 frames).
- Enlarged eye-check: per-set base/old/V2-eyesonly triplets (4x) in each
  creature dir + per-creature eye-check sheets. Eye-check PASS on both
  sheets: V2 eyes sit on the true eyes, no block, squash respected
  (heavy rows wide + short), mouths stay base; old middle tiles show the
  huge discs + square mouth blocks for contrast.
- Diff bboxes are eye-row only (heights 5-8px); zero mouth-row px changed,
  proving no mouth was drawn.

## Owed (percentage rule)
- Mouths: 0/8 = 0% finalized — HELD for V3 contour-fit. When V3 lands:
  apply to these 8 frames, report per-mouth delta vs this eyes-only baseline.
- Nothing else owed in this batch's eyes scope: eyes 8/8 = 100%.
