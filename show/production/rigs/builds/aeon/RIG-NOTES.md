# Aeon (Prof. Aeon) — TextRig build v1 (2026-10-27/28)

Human rig pass, built through the wired TextRig pipeline (flat
canon art -> DragonBones) following the pilot-six creature pattern.
Whole-image DEFORM rig: 13 bones (root/spine/chest/head/mouth/
arm_l/forearm_l/arm_r/forearm_r/leg_l/foot_l/leg_r/foot_r),
3 animations: idle_breathe (4s loop — spine settle, chest breath
scale, head counter-tilt, arms counter-swing), talk_nod (2.4s
loop — mouth-bone jaw oscillation + head nod, body held per the
Hanna-Barbera dialogue method; per-line mouth swaps key from
Rhubarb cues, see TALKING-SET.md), head_tilt (1.6s — expression;
reads as the lecturer's acknowledging nod/tilt).
Anatomy note: Aeon's left arm (image right) is BENT in the canon
sheet, holding the data tablet at his chest — forearm_r is placed
along that bent arm (rotation -158°, length 234) and is NOT
animated in v1; swinging it would fold the tablet through the coat.
The tablet rides the forearm/chest mesh. Any future arm-raise pose
needs a pose-specific build, not a bigger keyframe.
Source: canon v2 model sheet (1120x2240, see PROVENANCE.md) keyed
to a transparent cutout with TextRig's uniform-border key
(normalize_input, tolerance 30) + a 36-step alpha defringe; the
defringed cutout is the CURRENT texture. Mesh: 1162 vertices, 2100
triangles, heat-diffusion weights (--cols 20).
Build warnings recorded: foot_l 1, foot_r 22 source cells fell
outside the silhouette and were clamped to the nearest masked cell
(boot soles). Idle renders clean.
Inspection (TextRig checklist): idle filmstrip + GIF rendered
headlessly — 8/8 distinct frames, 8/8 distinct mesh vertex states
(real deformation). Static zones still, no joint separation, no
revealed holes, loop seam invisible. The lab coat's long hem rides
the leg bones softly — correct at idle amplitudes; a walk cycle is
out of v1 scope.
Talking set: `talking/` — 10 Blair displays; `mouth_rest.png` is
Aeon's own mouth cropped from INSIDE the beard (anchor 570,393;
window 150x80); the other 9 are v1 Blair chart patches in the
sampled palette, wired per `mouth-swap-spec.json` (slot `mouth`,
parent `head`). Beard rule (TALKING-SET.md): patches sit inside the
beard silhouette; jaw shapes key the mouth bone, never stretch the
patch. Files: aeon_ske.json + aeon_tex.json + aeon_tex.png
(DragonBones runtime set for Pixi). Likeness note: the rig deforms
the CANON pixels themselves — no redraw, no drift by construction.
No baked shadow: source sheet is flat-lit on a uniform field;
alpha row audit under the boots found no shadow band.
Canon note: Aeon v1 (pale) exists in the repo as a kept VARIANT
per CANON-HUMAN-CHARACTERS.md; this rig is built on the PRIMARY v2
(Black) sheet only.
