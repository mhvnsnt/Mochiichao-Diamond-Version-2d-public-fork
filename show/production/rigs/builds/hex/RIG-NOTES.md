# Hex — TextRig build v1 (2026-10-27/28)

Human rig pass, built through the wired TextRig pipeline (flat canon
art -> DragonBones) following the pilot-six creature pattern.
Whole-image DEFORM rig: 13 bones (root/spine/chest/head/mouth/
arm_l/forearm_l/arm_r/forearm_r/leg_l/foot_l/leg_r/foot_r),
3 animations: idle_breathe (4s loop — spine settle, chest breath
scale, head counter-tilt, arms counter-swing; amplitudes kept
restrained — restraint is Hex's performance, per VOICE-DESIGN),
talk_nod (2.4s loop — mouth-bone jaw oscillation + head nod, body
held per the Hanna-Barbera dialogue method; per-line mouth swaps
key from Rhubarb cues, see TALKING-SET.md), head_tilt (1.6s —
expression). Head rotation in dialogue stays small: the
high-collar jacket leaves little collar clearance.
Source: canon v2 model sheet (1120x2240, see PROVENANCE.md) keyed to
a transparent cutout with TextRig's uniform-border key
(normalize_input, tolerance 30) + a 36-step alpha defringe; the
defringed cutout is the CURRENT texture. Mesh: 1224 vertices, 2196
triangles, heat-diffusion weights (--cols 20).
Build warnings recorded: arm_l 2, leg_r 6, foot_r 37 source cells
fell outside the silhouette and were clamped to the nearest masked
cell (chunky boot soles are wider than the leg bone line). Idle
renders clean; revisit if the right boot ever tears at extremes.
Inspection (TextRig checklist): idle filmstrip + GIF rendered
headlessly — 7/8 distinct frame checksums (one sampled pair is
pixel-identical at checksum level; the motion is deliberately
subtle) with 8/8 distinct mesh vertex states (real deformation).
Static zones still, no joint separation, no revealed holes, loop
seam invisible.
Talking set: `talking/` — 10 Blair displays; `mouth_rest.png` is
Hex's own grin cropped from the canon cutout (anchor 570,403;
window 190x90 — the grin is wide); the other 9 are v1 Blair chart
patches in the sampled palette, wired per `mouth-swap-spec.json`
(slot `mouth`, parent `head`). Files: hex_ske.json + hex_tex.json +
hex_tex.png (DragonBones runtime set for Pixi). Likeness note: the
rig deforms the CANON pixels themselves — no redraw, no drift by
construction. No baked shadow: source sheet is flat-lit on a
uniform field; alpha audit under the boots found only the boot
soles themselves, no shadow band.
Canon note: Hex v1 (pale) exists in the repo as a kept VARIANT per
CANON-HUMAN-CHARACTERS.md; this rig is built on the PRIMARY v2
(Black) sheet only. A v1-variant rig is a separate build if wanted.
