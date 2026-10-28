# Mochiko — talking set

Spec: `../_shared/TALKING-SEAT-SPEC.md` (shared human talking seat).
Machine-readable wiring: `mouth-swap-spec.json` (this folder).

- Slot `mouth`, parent bone `head`, Graphic symbol, 10 Blair displays:
  rest / A_I / E / O / U / M_B_P / F_V / L_T_D_N_Th / C_D_G_K_S_Z / W_Q.
- `rest` = Mochiko's own mouth from the canon art (never redrawn).
  Other 9 = Blair-chart mouth patches in her own line/colour style,
  colours sampled from the canon face.
- Driven by Rhubarb 1.13 cues via the shared Rhubarb->Blair map
  (X->rest, A->M_B_P, B->C_D_G_K_S_Z, C->E, D->A_I, E->O, F->U,
  G->F_V, H->L_T_D_N_Th; W_Q by W-onset override).
- Voice render params (context): Chatterbox exaggeration 0.45 / CFG 0.5.
  Register: bright mid-high, quick/eager, wonder contour up, reverence
  contour flat/slow for Manual lines (VOICE-DESIGN.md).
- Casting status: reference audio AWAITING OWNER CASTING — the talking
  set is casting-independent; scratch lines stay labelled VOICE-SCRATCH.
- Character note: Mochiko's twin tails are on wave/path-style lag in the
  body rig (hair follows head 2–3 frames late, per repo motion language);
  during dialogue the body is held and the mouth/head-nod carry the line.
- Mouth anchor MEASURED from the canon art: (566, 435) in
  1120x2240 image px; window 150x90. Patch set built: `talking/`
  (rest = her own mouth cropped from the canon cutout; 9 Blair
  chart patches in her sampled palette — see mouth-contact-sheet.png).
  Status: BUILT v1, pending owner eye-check like every rig gate.
