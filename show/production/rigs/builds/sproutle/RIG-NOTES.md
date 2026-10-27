# Sproutle — TextRig build v1 (2026-10-27)
Pilot-five rig pass, built through the wired TextRig pipeline
(flat canon cutout -> DragonBones) following the Wispkin v1
pattern. Whole-image DEFORM rig (the guide's sanctioned choice
for a fused-cluster character): 4 bones (root/body/head/
sprout), 3 animations: idle_breathe (3.6s loop — body breath,
head counter-tilt, sprout sway lagged), sprout_wiggle (1.8s —
signature: quick sprout shake with a head bob), head_tilt
(1.6s — expression: held head tilt, visor catches the lean).
The sprout bone sits at the helmet-dome top, where the canon
art carries its sprout/leaf marks; the visor is fused to the
head in v1 (no separate visor bone — it moves with the head,
which is how the sheet draws it). Source: canon cutout
(261x337). Mesh: 325 vertices, 570 triangles, heat-diffusion
weights. Build warnings: NONE. Inspection: idle filmstrip
clean, loop seam invisible. Files: sproutle_ske.json +
sproutle_tex.json + sproutle_tex.png (DragonBones runtime set
for Pixi). Likeness note: the rig deforms the CANON pixels
themselves — no redraw, no drift by construction.
