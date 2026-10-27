Title creature Razorgater — baked shadow removed (last shadow carrier)

Razorgater was the last title cutout still carrying a baked sheet
ground shadow (noted in TitleCreatureFigure after PR #84). This PR
removes it, same open-source method as PR #84, no hand-painting.

Files (2 files, 0 file deletions):
- src/assets/title/razorgater-walk-cutout.png: 265x266 (was 268x285).
  rembg u2netp on the original Mochiichao sheet (crop 0.00, 0.05,
  0.165, 0.35, as in the PR #51 cut). OpenCV GrabCut was tried and
  REJECTED for him: it left the shadow ellipse in. u2netp removed
  the shadow with body, teeth, fins, spikes and claws intact,
  eye-checked on black.
- src/components/game/TitleCreatureFigure.tsx: size string updated
  (268x285 -> 265x266), shadow note updated.

Verified on black, not claimed from code alone:
- Razorgater (this PR): no ground shadow, body intact.
- Wispkin, Mythar, Yogiferno (checked on black for this PR, NOT
  changed): no baked ground shadow — Wispkin wisp smoke, Mythar
  halo ring and Yogiferno fire halo are design elements, not
  ground shadows. Gabu was confirmed fine by Mars and is untouched.
  Mochii was Mars-confirmed. After this PR, no cutout in the
  10-pool carries a baked ground shadow.

NOT in this PR:
- Razorgater eye-colour drift (main sheet red eyes vs angles
  sheets blue eyes) — Mars to pick, not decided here.
- Engine-drawn shadow layer in TitleScene (FireRed separate
  32x8 shadow sprite pattern) — next step, separate PR.
- Per-creature biome assignment — title-backgrounds batch.

Gates (local, on the verified main tree): lint (tsc --noEmit),
build (vite), validate:reference. Lint on current main carries
pre-existing errors in src/lib/battleTreatments.ts from another
lane, untouched by this PR — reported, not hidden. Deletions: NONE.
