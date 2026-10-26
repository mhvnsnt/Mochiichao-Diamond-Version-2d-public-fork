# PIPELINE V2 — transform-aware articulation placement (2026-10-26)

Supersedes the old retrofit method for every overlay drawn from here on.
Batches C/D adopt this before any overlay is presented as final.
The Batch C held overlays (PIPELINE-HOLD-20261026.md) are unblocked by
this method, not by re-running the old builder.

## Why V1 failed (measured, not theorised)

Mars rejections 2026-10-26 ~10:15 CDT: Aquariios attacks "not getting
its face placed correctly"; Reaperdile attacks "not getting its face
scaled in place accurately or correctly". Three measured causes:

1. WRONG SOURCE ANCHORS. Old Aquariios eyes (28,26),(32,26) sit on
   uniform head colour. True eye dots (grey clusters on the 8x front
   cell) are (31.9,24.9),(36.9,24.9) — errors +3.9/-1.1 and +4.9/-1.1 px
   in source space, up to ~+6px after sx=1.3. True mouth is the dark
   line y=29 x31-37, centre (34,29); old mouth (30,29) was 4px too far
   left. Reaperdile old right eye (36,19); true red core (34.4,18.9),
   error -1.6. Old mouth (32,36); jaw-gap centre ~(32,32), error 0/-4.
   Marker images are NOT proof by themselves: the old marker-v2
   crosses sat on the wrong spots and were still called verified.
2. UNSCALED OVERLAY GEOMETRY. Old shapes were fixed-size at propagated
   positions: eye discs r=3 (6-7px) over true 1-2px cores; mouth boxes
   16-22px wide x 10-18px tall regardless of the frame's sx/sy, so a
   sy=0.72 squash still got an 18px-tall mouth block covering jaw+chest.
3. CLEAR-BOX RECTANGLES. Old draw_mouth painted a flat patch_median
   rectangle under every mouth — visible as a solid block over the head.
   This alone made both creatures read as "face pasted on wrong".

## V2 rules (binding)

1. ANCHORS FROM TRUE FEATURES. Eye/mouth anchors are cluster centroids
   of the actual feature pixels (grey dots, red cores, dark mouth line),
   measured on the enlarged source cell AND re-checked on the final
   frame. A marker cross is a hypothesis, not a measurement.
2. DRAW AFTER THE TRANSFORM, IN FINAL-FRAME COORDINATES. Final centre
   = propagate(corrected anchor, frame transform). Every overlay
   dimension is multiplied by that frame's (sx, sy): ellipses, not
   circles, under squash/stretch; rot rotates the shape about its own
   centre. Nothing is drawn in source space and carried through.
3. NO CLEAR-BOX RECTANGLES. Mouth shapes only (arc / ellipse / line),
   drawn directly on the base pixels. No patch_median fill under a mouth.
4. SIZE CAPS FROM MEASURED FEATURES. Eye base radius = true source
   radius (Aquariios 1px, Reaperdile 1px); widened <= 2x true radius
   (scaled); mouth width from measured source mouth width (Aquariios
   7px, Reaperdile jaw 20px) x sx, height x sy.
5. GATES ON THE FINAL FRAME. Pre-draw: true-feature px present within
   +/-3px of each propagated corrected anchor (Aquariios grey dots,
   Reaperdile red cores with the WIDENED predicate R>=80, R-G>=15 —
   LANCZOS-blended 1-2px cores fall below the strict predicate; that
   is measured, not a loosening). Post-draw: every changed px within
   2px of the base silhouette. Fail either gate = base, never a guess.
6. CORRECTED ANCHOR TABLE (64px source coords, this fix):
   Aquariios eyes (31.9,24.9),(36.9,24.9), mouth (34,29), eye_r 1,
   mouth_w 7, mouth_h 5, teeth NO (ambiguous at 2px, not drawn).
   Reaperdile eyes (24.4,19.4),(34.4,18.9), mouth (32,32), eye_r 1,
   mouth_w 20, mouth_h 10, teeth YES (front jaw fangs).

## Proof on this fix

Builder: articulation-pipev2/build_pipev2.py, tag artic-pipev2-20261026.
8/8 impact frames overlaid (4 Aquariios + 4 Reaperdile), pre-gate
feature counts >=1 at both eyes on every frame, post-gate
inside-silhouette True on every frame. Diff bboxes shrank and moved
onto the face (e.g. Aquariios physical old 17x11 block -> V2 12x8 on
the head; Reaperdile physical old 24x27 block -> V2 25x17 jaw-shaped,
no chest coverage). Enlarged base/old/V2 triplets for all 8 impact
frames sit beside the builder; eye-check PASS (V2 faces sit on the
true face, no block, squash respected). GIFs are show-first, staged
only, no PR. Reaperdile hurts untouched (approved as-is).
