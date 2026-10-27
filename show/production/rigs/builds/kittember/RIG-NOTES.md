# Kittember — TextRig build v1 (2026-10-27)
Pilot-five rig pass, built through the wired TextRig pipeline
(flat canon cutout -> DragonBones) following the Wispkin v1
pattern. Whole-image DEFORM rig (the guide's sanctioned choice
for a fused-cluster character): 5 bones (root/body/head/tail/
flame), 3 animations: idle (3.8s loop — body breath, head
counter-tilt, tail sway, flame flicker pulse), tail_flame_
wave (2.2s — signature: tail sweeps, the tail-tip flame flares
and rolls), head_tilt (1.6s — expression: held head tilt, tail
answers slightly). Canon: the flame is attached to the tail
TIP — the flame bone is parented to the tail bone and the
flame is never a free-floating orb. Source: canon cutout
(287x304). Mesh: 247 vertices, 420 triangles, heat-diffusion
weights. Build warnings recorded: bone 'head' 9 source cells
outside the silhouette, bone 'tail' 30 source cells outside,
bone 'flame' 1 source cell outside — all clamped to the
nearest masked cell (the tail segment crosses the background
gap between the body and the flame orb; the head segment
clips the ear tips). 13 mesh vertices on mask islands fell
back to IDW weights — the spark bubbles beside the flame.
Inspection: idle filmstrip clean, tail + flame travel as one
unit with no visible artifact at v1 amplitudes; revisit the
tail path if larger tail swings ever smear across the gap.
Files: kittember_ske.json + kittember_tex.json +
kittember_tex.png (DragonBones runtime set for Pixi).
Likeness note: the rig deforms the CANON pixels themselves —
no redraw, no drift by construction.
