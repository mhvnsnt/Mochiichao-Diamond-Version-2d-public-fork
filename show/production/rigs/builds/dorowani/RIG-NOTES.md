# Dorowani — TextRig build v1 (2026-10-27)
Pilot-five rig pass, built through the wired TextRig pipeline
(flat canon cutout -> DragonBones) following the Wispkin v1
pattern. Whole-image DEFORM rig (the guide's sanctioned choice
for a fused-cluster character): 7 bones (root/body/shell/
head/fin/arm_l/arm_r), 3 animations: idle_breathe (4s loop —
body breath, head counter-tilt, dorsal fin sway, arms
counter-swing, shell settle), water_orb_charge (2.6s —
signature: crouch + both arms gather inward and hold in front
of the lower belly, the Water Orb charge pose; the orb itself
is an FX/prop layer, the rig supplies the pose), fin_flick
(1.2s — expression: dorsal fin snap with a head follow).
Source: canon cutout (263x398). Mesh: 352 vertices, 614
triangles, heat-diffusion weights. Build warnings: NONE.
Inspection log, recorded honestly: the first charge pass
(arms at +/-38 degrees) tore the hands across the shins at
full gather. One fix round — gather reduced to +/-22 degrees
with a smaller inward shift and more lift — and the hands now
converge cleanly in front of the lower belly for the hold;
mild mesh stretch at full convergence remains, acceptable for
v1, revisit if the charge ever needs a longer hold. Idle
filmstrip clean. Files: dorowani_ske.json + dorowani_tex.json
+ dorowani_tex.png (DragonBones runtime set for Pixi).
Likeness note: the rig deforms the CANON pixels themselves —
no redraw, no drift by construction.
Folder note: this directory also holds the earlier Tahoma2D
segmentation + pivot proof (README.md / rig-build.json /
rom-proof-v1.png, built from the 1600px bundle master). That
proof and its ROM findings belong to the Tahoma2D assembly
lane and are untouched; this TextRig set is the DragonBones
deform rig, matching the other five pilot species.
