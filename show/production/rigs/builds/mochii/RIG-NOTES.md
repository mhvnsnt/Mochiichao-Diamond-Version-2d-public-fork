# Mochii — TextRig build v1 (2026-10-27)
Pilot-five rig pass, built through the wired TextRig pipeline
(flat canon cutout -> DragonBones) following the Wispkin v1
pattern. Whole-image DEFORM rig (the guide's sanctioned choice
for a fused-cluster character): 3 bones (root/body/tip),
3 animations: idle_bob (3.6s loop — body bob + squash-and-
stretch breathing, droplet tip sways lagged), squash_hop
(1.6s — signature: squash down, hop, settle), tip_wiggle
(1.8s — expression: the droplet point wiggles, body follows
slightly). Source: canon cutout (380x380). Mesh: 286 vertices,
498 triangles, heat-diffusion weights. Build warning recorded:
65 mesh vertices on mask islands with no bone source fell back
to IDW weights — those are the floating water droplets around
the body; they ride the mesh softly in the filmstrip and read
as shimmer, acceptable for v1; revisit if a droplet ever needs
independent motion. Inspection: idle filmstrip clean, no
tearing, loop seam invisible. Files: mochii_ske.json +
mochii_tex.json + mochii_tex.png (DragonBones runtime set for
Pixi). Likeness note: the rig deforms the CANON pixels
themselves — no redraw, no drift by construction.
