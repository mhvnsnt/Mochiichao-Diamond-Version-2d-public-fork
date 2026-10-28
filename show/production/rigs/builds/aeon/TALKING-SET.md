# Aeon (Prof. Aeon) — talking set

Spec: `../_shared/TALKING-SEAT-SPEC.md` (shared human talking seat).
Machine-readable wiring: `mouth-swap-spec.json` (this folder).

- Slot `mouth`, parent bone `head`, Graphic symbol, 10 Blair displays:
  rest / A_I / E / O / U / M_B_P / F_V / L_T_D_N_Th / C_D_G_K_S_Z / W_Q.
- `rest` = Aeon's own mouth from the canon art (never redrawn).
  Other 9 = Blair-chart mouth patches in his own line/colour style,
  colours sampled from the canon face.
- SPECIAL — beard: Aeon wears a grey beard. Mouth patches must be cut
  to sit INSIDE the beard silhouette (mouth window only), and the jaw
  shapes (A_I, E) should key a small chin/beard follow on the head
  bone's lower mesh rather than stretching the mouth patch itself.
  Exact mouth window is measured from the canon art at build time —
  not estimated from description.
- Driven by Rhubarb 1.13 cues via the shared Rhubarb->Blair map
  (X->rest, A->M_B_P, B->C_D_G_K_S_Z, C->E, D->A_I, E->O, F->U,
  G->F_V, H->L_T_D_N_Th; W_Q by W-onset override).
- Voice render params (context): Chatterbox exaggeration 0.4 / CFG 0.55.
  Register: warm low, unhurried lecturer; thesis lines get space
  (VOICE-DESIGN.md). Rig consequence: longer `rest` holds between
  phrases read as the lecturer's pauses — do not tighten them.
- Casting status: reference audio AWAITING OWNER CASTING — the talking
  set is casting-independent; scratch lines stay labelled VOICE-SCRATCH.
- Character note: round glasses — an eye/glint swap is out of scope for
  v1; glasses ride the head bone with the face.
- Mouth anchor MEASURED from the canon art: (570, 393) in
  1120x2240 image px; window 150x80, cut inside the beard. Patch
  set built: `talking/` (rest = his own mouth cropped from the
  canon cutout; 9 Blair chart patches in the sampled palette).
  Status: BUILT v1, pending owner eye-check like every rig gate.
