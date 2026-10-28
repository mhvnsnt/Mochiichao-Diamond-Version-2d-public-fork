# Hex — talking set

Spec: `../_shared/TALKING-SEAT-SPEC.md` (shared human talking seat).
Machine-readable wiring: `mouth-swap-spec.json` (this folder).

- Slot `mouth`, parent bone `head`, Graphic symbol, 10 Blair displays:
  rest / A_I / E / O / U / M_B_P / F_V / L_T_D_N_Th / C_D_G_K_S_Z / W_Q.
- `rest` = Hex's own mouth from the canon art (never redrawn).
  Other 9 = Blair-chart mouth patches in his/her own line/colour style,
  colours sampled from the canon face.
- Driven by Rhubarb 1.13 cues via the shared Rhubarb->Blair map
  (X->rest, A->M_B_P, B->C_D_G_K_S_Z, C->E, D->A_I, E->O, F->U,
  G->F_V, H->L_T_D_N_Th; W_Q by W-onset override).
- Voice render params (context): Chatterbox exaggeration 0.3 / CFG 0.6.
  Register: lower, drier, deliberate — beats land on the LAST word;
  dead-level melody (VOICE-DESIGN.md). Performance consequence for the
  rig: Hex's dialogue keys should favour longer holds and fewer
  mid-word shape changes — apply the <40 ms drop rule strictly, and
  prefer `rest` holds at phrase ends (the quiet IS the acting).
- Casting status: reference audio AWAITING OWNER CASTING — the talking
  set is casting-independent; scratch lines stay labelled VOICE-SCRATCH.
- Character note: high-collar jacket — keep head-bone rotation small in
  dialogue (collar clearance); the mouth set carries the performance.
- Mouth anchor MEASURED from the canon art: (570, 403) in
  1120x2240 image px; window 190x90 (the grin is wide). Patch set
  built: `talking/` (rest = Hex's own grin cropped from the canon
  cutout; 9 Blair chart patches in the sampled palette).
  Status: BUILT v1, pending owner eye-check like every rig gate.
