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

## v2 texture — shadow-free (2026-10-27)
Texture updated to the shadow-free canon cutout: the v1 texture
carried Sproutle's baked-in gray ground shadow (an ellipse under
the feet, part of the source art). Owner direction: shadows are
NEVER baked into art — shadows are added in post / compositing
only, so they can match the scene. The baked shadow was removed
from the canon cutout (2,803 warm beige-gray ellipse pixels
cleared in the ground band; claw pixels untouched; zero changes
above the shadow band) and `sproutle_tex.png` now carries the
cleaned pixels. Rig data is UNCHANGED — mesh, bones and
animations are identical; the cleared pixels sat outside the
body silhouette in the ground band, so no weights move. The v1
(shadowed) texture is SUPERSEDED and NOT USABLE; v2 (this
texture) is the current usable version.
