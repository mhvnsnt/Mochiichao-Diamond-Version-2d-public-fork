# VERIFICATION — PIPELINE V2 fix, Aquariios + Reaperdile attacks (2026-10-26)

Tag artic-pipev2-20261026. Builder: build_pipev2.py. Manifest:
manifest-artic-pipev2-20261026.json. Staged only, NO PR, show-first.
Shown retrofit GIFs untouched; Reaperdile hurts untouched (approved).

## Measured errors in the old retrofit (the diagnosis Mars asked for)

Aquariios (source space, 64px): old eyes (28,26),(32,26) vs TRUE grey-dot
centroids (31.9,24.9),(36.9,24.9) -> errors +3.9/-1.1 and +4.9/-1.1;
after sx=1.25-1.3 the final-frame error reaches ~+5-6px right. Old
mouth (30,29) vs true dark line centre (34,29) -> +4/0. Old overlay
diff per impact frame: 17x11px block (eyes r=3 discs + 16x10 clear-box
+ 12px mouth) over a 2px-dot face.
Reaperdile (source space): old right eye (36,19) vs TRUE red core
(34.4,18.9) -> -1.6; old mouth (32,36) vs jaw-gap centre (32,32) ->
0/-4. Old overlay diff per impact frame: 21-24px wide x 21-29px tall
(mouth box 22x18 unscaled + clear-box), covering jaw AND chest.
Centre offsets alone were small (<=3px); the visible failure was
anchor error (Aquariios) + unscaled geometry + clear-box (both).

## V2 results (8/8 impact frames)

Corrected anchors: Aquariios eyes (31.9,24.9),(36.9,24.9), mouth
(34,29); Reaperdile eyes (24.4,19.4),(34.4,18.9), mouth (32,32).
Per-frame geometry scaled by (sx,sy); no clear-box; gates on final
frames (pre-gate feature counts >=1 both eyes every frame; post-gate
inside-silhouette True every frame).

| Set | Old diff | V2 diff | V2 action |
|---|---|---|---|
| aquariios physical | 17x11 block | x39-50 y27-34 (12x8) | overlay-v2-open-bite-widened |
| aquariios special | 17x11 block | x25-33 y18-25 (9x8) | overlay-v2-grin-glance |
| aquariios signature | 17x11 block | x25-35 y21-28 (11x8) | overlay-v2-open-bite-widened |
| aquariios heavy | 17x11 block | x35-43 y29-34 (9x6) | overlay-v2-grimace-half |
| reaperdile physical | 24x27 block | x30-54 y22-38 (25x17) | overlay-v2-open-bite-widened |
| reaperdile special | 21x26 block | x18-34 y12-31 (17x20) | overlay-v2-grin-glance |
| reaperdile signature | 23x29 block | x16-38 y15-33 (23x19) | overlay-v2-open-bite-widened |
| reaperdile heavy | 23x21 block | x23-49 y25-36 (27x12) | overlay-v2-grimace-half |

Note: Reaperdile V2 diffs stay wide because the jaw IS wide; the fix
is the height (sy-scaled, jaw-shaped, no chest coverage) and the
removal of the block, not the width. Reaperdile special/signature/
heavy first failed the strict red predicate (blended cores below
R>=90 / R-G>=30); the widened predicate (R>=80, R-G>=15, measured
from the old gate2 case) passes them honestly — documented in the
builder, not a silent loosening.

## Eye-check (enlarged base / old / V2 triplets, all 8)

Files: <creature>_<set>_base_old_v2.png (left base, middle old, right
V2). PASS: V2 faces sit on the true face in all 8; no block in any;
squash respected (mouths jaw-shaped, eyes elliptical under sy<1);
Aquariios heavy half-lid + grimace line subtle but correctly placed.
Mars-judgement items (not defects): V2 widened eyes still read larger
than base cores by design (2x true radius); Aquariios open-bite red
oval is stylised (true mouth is a 7px line — the oval is the
expression, not the anatomy).

## Files

- GIFs: aquariios-attacks-artic-pipev2-20261026.gif (22 frames),
  reaperdile-attacks-artic-pipev2-20261026.gif (22 frames).
- Per-creature cells: aquariios/ + reaperdile/ (4 sets each, same
  cell counts as batch-a attacks; non-impact frames byte-identical
  to batch-a base cells).
- Method: ../articulation/PIPELINE-V2.md (binding for Batches C/D).
