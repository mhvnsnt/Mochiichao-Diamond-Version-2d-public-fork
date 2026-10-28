# Gabu — TextRig build v1 (2026-10-27)
Pilot-five rig pass, built through the wired TextRig pipeline
(flat canon cutout -> DragonBones) following the Wispkin v1
pattern. Whole-image DEFORM rig (the guide's sanctioned choice
for a fused-cluster character): 5 bones (root/body/shell/
head/jaw), 3 animations: idle_breathe (4s loop — body breath,
head counter-tilt, shell settle, jaw micro-flex), jaw_chomp
(1.4s — signature: jaw opens, snaps shut with a head dip),
head_tilt (1.6s — expression: held head tilt, shell follows).
Source: canon cutout (292x295). Mesh: 264 vertices, 458
triangles, heat-diffusion weights. Build warnings: NONE.
Inspection shortfall, recorded honestly: jaw_chomp reads
subtle — the canon muzzle is front-facing and fused, with no
separate lower-jaw silhouette to swing, so even after one fix
round (jaw amplitude 16 -> 26 degrees, deeper head dip) the
chomp lands as a head dip + muzzle flex rather than a visible
open mouth. A true open-mouth chomp needs a cut/pieces pass
with a drawn open-jaw variant — v2 work, not hidden here.
Idle filmstrip clean. Files: gabu_ske.json + gabu_tex.json +
gabu_tex.png (DragonBones runtime set for Pixi). Likeness
note: the rig deforms the CANON pixels themselves — no
redraw, no drift by construction.
