# HAND-MOVEMENT PASS — Layer 2, Phase 1 (2026-10-26)

FINISH-FIRST PHASE 1, hand-movement pass only. Faces-only articulation
(V2/V3) is the base; this pass adds HAND/ARM overlays on top of it.
No likeness changes, no new canon judgments, no overwrites of anything
Mars has seen. New files only, under `hand-pass-20261026/` (ship) and
`hand-pass-20261026-staged/` (staged-only).

## 0. What "hand pass" means here

Per-creature attack + hurt poses, Layer 2, following the grammar in
`articulation/ARTICULATION-GRAMMAR.md` §3–§5. Hand states (H):

| State | Drawn as (64px, PIL, pilot method) | Used for |
|---|---|---|
| H-guard | 2 skin-colour fist circles, body sides | windup, flinch impact |
| H-punch | 1 fist circle forward + 3 motion streaks | physical strike/impact |
| H-claw-swipe | 3 white arc streaks from the forward point | physical strike/impact, clawed creatures only |
| H-cast | element-neutral glow (white core, grey halo) | special/signature charge + release |
| H-brace | 2 skin-colour fist circles, body sides | signature strike/impact (Mochii: guard fallback, pilot verbatim) |
| H-grab | 2 fist circles, front-centre together | heavy windup/impact/hold |
| H-flail | 2 fist circles, high + apart | heavy knockback impact/recoil |
| H-droop | 2 fist circles, low at body sides | near-faint stagger |
| H-folded / H-none | NO overlay (base hands already together / no hands) | recover, limbless/levitating creatures |

Family → role → hand mapping is the pilot `FAMILY` table verbatim
(physical / special / signature / heavy / flinch / knockback / wobble /
stagger). Claw-swipe is used ONLY for physical impacts of creatures
whose front cell plainly shows claws: aquariios, reaperdile, tyrage,
duneclaw, oblivirex, razorgater (staged). Every other physical impact
uses punch. Claw-swipe for any other creature is Phase 2, pending a
per-creature claw confirmation — it is not guessed here.

Cast glow is element-NEUTRAL (white/grey) in this pass, deliberately
NOT the pilot's blue: the pilot's blue was water-correct for Mochii +
Dreadtoise only, and reusing it for fire/grass/etc. creatures would
invent element colours. Element-coloured glows are Phase 2, pending an
approved element→glow mapping.

## 1. Timing modes — hands follow the approved FACE timing

Mars rulings carried over (retime manifest `articulation-v3-impact`,
2026-10-26):

- Mode B `persistent` — Mochii attacks ONLY (Mars ~09:15 CDT). Hand
  state applies on EVERY frame whose grammar state is not folded;
  folded frames are byte-identical copies of the approved final.
- Mode A `impact` — every other approved final (Dreadtoise hurts,
  pipev2, v3q, v2rework attacks). The face evidence is one impact-frame
  overlay per set, so the hand overlay goes ONLY on that set's impact
  frame; all other frames are byte-identical copies of the final.
- Mode `base` — Mochii hurts (face already changes; arms already
  folded front / hands together by canon). NO hand overlays, NO hand
  cells — the manifest entry is the whole pass for those sets.
- Staged default — staged bases have no Mars hand ruling, so staged
  hand cells use Mode A by the standing Batch B default ("no ruling =
  Mode A stands"). Labelled staged-default, never presented as a
  Mars ruling.

Impact frame = the set's face-overlay frame from its own manifest
(retime role `impact`; pipev2 action `overlay-*`; v3q action
`v3-mouth-*`; v2rework action `overlay-v2-eyes-only-*`; staged
batch-b/batch-cd: the manifest's impact frame, else index 3 for
5/6-cell attacks and index 0 for hurts).

## 2. Anchors — measured where they exist, derived + gated elsewhere

- Mochii + Dreadtoise: pilot `fist` anchors VERBATIM from
  `articulation/build_articulation.py` (measured off enlarged pilot
  cells). Mochii hurt canon kept: hurts are base, so no flail-apart
  question arises; had hurts been overlaid, flail would remap to
  guard per pilot code.
- Every other creature: anchors DERIVED per frame from that frame's
  own alpha silhouette bbox (x0,y0,x1,y1,w,h,cx,cy), NOT copied from
  another creature and NOT hand-estimated:
  - guard (x0+0.20w, y0+0.60h), (x1-0.20w, y0+0.60h)
  - punch / claw origin (x1-0.08w, y0+0.55h)
  - grab (cx-0.12w, y0+0.68h), (cx+0.12w, y0+0.68h)
  - flail (x0+0.10w, y0+0.28h), (x1-0.10w, y0+0.28h)
  - droop (x0+0.14w, y1-0.10h), (x1-0.14w, y1-0.10h)
  - cast (cx+0.18w, y0+0.42h)
  - brace (x0+0.16w, y0+0.50h), (x1-0.16w, y0+0.50h)
- Skin colour: median opaque RGB in a 7px box around (cx, y0+0.72h),
  falling back to (cx, cy), else flagged and the frame ships as base.
- Paw note: for terradog, manticlaw, pyropaw, quakehound, mythar the
  fist circles sit at forepaw positions and read as paw markers in
  body colour at 64px. That reading is flagged in each manifest and
  is Mars's call to overturn, not a likeness claim.

## 3. Gates (every hand frame; failure = base copy + flag, never a guess)

- G1 non-hand frames byte-identical to the approved/staged base.
- G2 every changed pixel lies inside the base silhouette dilated by
  2px (hand layer is masked by the dilated silhouette by
  construction; verified by diff, not assumed).
- G3 every fist centre lies inside the dilated silhouette; a centre
  outside fails the frame to base + flag `anchor-outside-silhouette`.
- G4 hand frame changed-pixel count > 0 (the overlay is visible).
- G5 canon: Mochii no-teeth is untouched (no mouth is drawn here);
  Dreadtoise cannons are never covered (brace is not used in any
  shipped Dreadtoise set; shipped Dreadtoise sets are hurts only).
- Ship rule: a SET ships only if its base is a Mars-approved final
  AND its hand frames pass G1–G4. A failed set ships as byte-identical
  base copies + a flag in its manifest (Batch B precedent: failed
  impact frames shipped as base, flagged — the failure is disclosed,
  never hidden). A creature whose base is not Mars-approved stays
  staged in full regardless of gates. Amendment note (2026-10-26,
  pre-ship, this file not yet shown to Mars): the first draft of
  this rule demoted a whole creature for one failed set; set-level
  shipping is the Batch B precedent and the honest unit, since a
  hand pass is per-set (attack/hurt poses). Applied: aquariios
  special (cast anchor outside silhouette on the impact frame) and
  dreadtoise near-faint stagger (droop anchors outside silhouette
  on the impact frame) ship as flagged base sets; their other sets
  ship as hand passes.

## 4. Coverage definitions (counts in the manifest + lane log)

- Hand-pass CELLS: sets whose hand frames were drawn + gated.
- Hand-pass H-NONE: creatures with no hands by canon/evidence
  (limbless or levitating, no arms visible) — the manifest entry is
  the pass; no cells are drawn, because drawing hands would invent
  anatomy.
- EXCLUDED: hand pose needs a Mars canon call (tentacles, wings /
  talons, tucked paws, undelineated limbs, head-only framing) or no
  staged 4-set base exists. Listed with the reason, never guessed.
- SHIPPED vs STAGED: shipped = approved-base + all gates pass, in
  the Contents API PR. Staged = everything else, local only.

## 5. What this pass does NOT do (Phase 2+)

- No claw-swipe beyond the 6 claw-evident creatures above.
- No element-coloured cast glows.
- No new poses, no redrawn limbs, no Layer 3 generations.
- No move→set assignment (separate owed item).
- No wiring into BattleView (game lane).
- No playtest (FINISH-FIRST order: playtest LAST).
