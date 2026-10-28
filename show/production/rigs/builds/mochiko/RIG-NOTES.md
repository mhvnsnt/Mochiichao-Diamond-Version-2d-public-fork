# Mochiko — TextRig build v1 (2026-10-27/28)

Human rig pass, built through the wired TextRig pipeline (flat canon
art -> DragonBones) following the pilot-six creature pattern.
Whole-image DEFORM rig: 15 bones (root/spine/chest/head/mouth/
twintail_l/twintail_r/arm_l/forearm_l/arm_r/forearm_r/leg_l/foot_l/
leg_r/foot_r), 3 animations: idle_breathe (4s loop — spine settle,
chest breath scale, head counter-tilt, arms counter-swing, twin
tails lag the head 2–3 frames), talk_nod (2.4s loop — the dialogue
performance: mouth-bone jaw oscillation + head nod, body held per
the Hanna-Barbera dialogue method; per-line mouth swaps key from
Rhubarb cues, see TALKING-SET.md), head_tilt (1.6s — expression:
head tilt with twin-tail follow).
Source: canon v2 model sheet (1120x2240, see PROVENANCE.md) keyed to
a transparent cutout with TextRig's uniform-border key
(normalize_input, tolerance 30) + a 36-step alpha defringe; the
defringed cutout is the CURRENT texture. Mesh: 1103 vertices, 2012
triangles, heat-diffusion weights (--cols 20).
Build warnings recorded: arm_r 32 source cells, forearm_r 1,
foot_l 7, foot_r 17 source cells fell outside the silhouette and
were clamped to the nearest masked cell (bone lines at the body's
outer edge — sleeve hem / shoe soles). Idle renders clean anyway;
revisit if the right arm ever tears at extremes.
Inspection (TextRig checklist): idle filmstrip + GIF rendered
headlessly — 8/8 distinct frames, 8/8 distinct mesh vertex states
(real deformation, not a slideshow). Static zones still, no joint
separation, no revealed holes, loop seam invisible at shipped
amplitudes. talk_nod also rendered (7/8 distinct frame checksums,
8/8 vertex states). Known v1 shortfall: a faint light edge remains
on the hair silhouette against very dark backgrounds (keying
residue at the hair's own highlight edge) — clean-up pass candidate,
does not affect the deform.
Talking set: `talking/` — 10 Blair displays; `mouth_rest.png` is her
own mouth cropped from the canon cutout (anchor 566,435; window
150x90); the other 9 are v1 Blair chart patches in her sampled
palette, wired per `mouth-swap-spec.json` (slot `mouth`, parent
`head`). Files: mochiko_ske.json + mochiko_tex.json + mochiko_tex.png
(DragonBones runtime set for Pixi). Likeness note: the rig deforms
the CANON pixels themselves — no redraw, no drift by construction.
No baked shadow: source sheet is flat-lit on a uniform field; alpha
row audit under the feet found no shadow band (opaque px go to 0
below the soles).

## HAIR-GAP FIX — CURRENT VERSION (2026-10-28)

Owner-spotted while watching her animation: white spaces between
Mochiko's hair and her head. Cause, measured on the shipped texture:
the canon sheet's light field colour (#E8E8E8, fully opaque) survived
keying inside three pockets the border-key could not reach because
art encloses them — the two fields flanking the neck between the
twin-tails and the jaw/collar (12,819 px at x381–516/y399–562 and
15,729 px at x608–756/y399–677) and a small wedge between the right
tail's strands at x752–767/y685–722 (243 px). The TextRig mesh
deforms those pixels with the head/twintail bones, so in motion the
pale slabs ride beside her neck — the owner's white gaps.

Fix: the 29,299 pocket pixels (field cores + their anti-aliased rims,
flood-grown from the pocket cores through pixels brighter than the
dark outlines, stopping at skin/hair/outline colours) were set to
transparent RGBA(0,0,0,0), the texture's own transparent convention.
Pixel-diff verification: changes confined to x381–766 / y398–722;
zero pixels changed anywhere else; eyes, jar highlights, and shoe
soles (the other legitimate bright art) byte-identical.

CURRENT texture: `mochiko.png` / `mochiko_tex.png` in this folder,
MD5 `3e142dff199de4c70cca9aa22c01bc11` — this is the version every
later use takes. It SUPERSEDES the gapped texture MD5
`e3eeb13ec3771fd43529fa45aba66b6f` (kept for audit at
`~/workspace/ep01-ed-gag/work/mochiko-hair-fix/mochiko-GAPPED-superseded.png`).
The identical fixed bytes were written to the still-to-build
original and to the TextRig out/ copies (mochiko_tex.png,
gag2/gag3/gag4mochiko_tex.png) so the ending-gag rig renders the
fixed art. Skeleton, mesh, weights, and animations are unchanged —
the deform now carries transparency where the field slabs were.
Full evidence (BEFORE/AFTER zooms, diff overlay, method):
`~/workspace/ep01-ed-gag/work/mochiko-hair-fix/FIX-NOTE.md`.
The pre-existing "faint light edge on the hair silhouette" note
above is a separate outer-edge keying residue and is unchanged.
