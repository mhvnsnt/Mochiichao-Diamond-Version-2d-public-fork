# Mochiko — PROFILE MODEL SHEET (v8 Phase 1)

**Status: DERIVED-FROM-CANON.** No profile design of Mochiko existed. This
sheet is a *turn* of the existing front design — every element below is
derived from a named feature of the canon art. No new accessories, no
colour changes, no hairstyle changes.

**Canon source:** `../mochiko-hair-fix/mochiko-fixed.png`
MD5 `3e142dff199de4c70cca9aa22c01bc11` (verified before use) · sha256
`e81324d56bdded5ebfc2e2af6ed993337131d6e819f93ecde8227c71437172a5` ·
1120×2240 · figure bbox 2055 px tall.

**Sheet:** `profile-sheet.png`, same canvas/scale (1120×2240, facing +x =
direction of travel). Drawn programmatically (`draw_sheet.py`) with
spline shapes at 3× supersample, in the canon drawing manner: flat cel
fills, one shade step per material, near-black outline.

## Samples taken from the canon art (measured, not eyeballed)

Scripts: `sample_canon.py`, `sample2.py` (region medians, point samples,
28-cluster palette over all opaque pixels, dark-run scans).

- **Line:** modal ink cluster `#19050a`/`#0f0813` → sheet ink `#1c0a10`.
  Outline core measured **4 art px** (dark run across the top of the head,
  anti-aliased halo included in the 5 px drawn weight).
- **Hair** `#503931` base · `#4e3730` mid · `#331f1b`/`#3c2823` shade.
- **Skin** `#db966d` · shade `#ac644d`.
- **Jacket navy** `#2e3d5e` · deep navy (backpack) `#202741`.
- **Teal** (skirt/tights/trim) `#18969b` · lit `#19a7ab` · deep shade `#0f626d`.
- **Scrunchie** `#199ba0`. **Iris** `#199aa1` · deep rim `#215c67`.
- **Shoe navy** `#333e58` · lace teal `#23969d` · sole off-white `#e3e7ed`.
- **Jar glass** lit `#ecebf4` · shade `#979faa`.

## Proportions (measured; defect-audit item 16 — no anisotropic scaling)

| measure | canon front | this sheet |
|---|---|---|
| figure height | 2055 px | 2073 px (hair crown to sole) |
| head height (crown→chin) | 409 px (chin y≈508 measured) | 400 px incl. hair crown |
| head / figure | 0.199 | 0.193 |

The sheet's head reads ~3% small against canon — inside drawing
tolerance, recorded here rather than hidden. Nothing anywhere in the
sheet is non-uniformly scaled; the profile shoe is *drawn*, not stretched.

## Element-by-element derivation

| sheet element | derived from (canon feature) | how it was turned |
|---|---|---|
| Profile head | front face: warm brown skin, small nose dot, small smile | Skull turned to face +x: nose becomes a profile bridge/tip at the canon eye line, mouth a short line under it, chin/jaw curve to a neck that descends **into** the collar (no notch — audit item 18) |
| Profile eye | her eye design: teal iris, dark pupil, twin highlights (big upper, small lower), heavy upper lash | ONE eye, same construction at the same centre height (y=350); almond narrowed for the side view; enlarged open/closed insets drawn on the sheet with the same code (`draw_eye`) — the closed form is the walk's blink source |
| Ear | ears visible at the head sides in front view | One ear at the side of the head, simple inner curve, partly under the hair edge (audit item 10: no far-side face furniture) |
| Hair mass | dark-brown hair, side-swept fringe, rounded crown | Crown and back mass in profile; fringe swept to a point at the temple with strand separations; back mass falls behind the neck to shoulder level |
| Twin tails | twin tails with teal scrunchies + black ribbons at the bases | Both tails arranged behind the shoulder/back line: near tail full, far tail offset back/down in the deep shade tone, tips separated; **both scrunchies visible, seated on the hair mass; black ribbon seated at the near tail base — nothing floats** (audit item 9) |
| Collar | navy high collar with teal front stripe | Band wrapping the neck in profile, front stripe at the front edge; drawn over the neck base so the neck is seated, never perched (items 3/18) |
| Torso | navy jacket, teal placket trim, teal buttons, teal star pin on the chest | Profile torso with a slight chest/back curve; placket at the front edge with 3 buttons edge-on; star pin on the chest front, clear of arm and strap |
| Strap | teal backpack straps running shoulder→waist jars | One strap over the shoulder continuing as a diagonal band down the chest front to the jar tops, adjuster lines as in canon |
| Backpack | navy pack, teal horizontal band + buckle (visible at her side in canon) | Rounded side mass behind the torso, band + buckle on its face, top below the shoulder line |
| Waist jars | three capsule jars on straps at the waist: green sprout creature, blue drop creature, purple horned creature | Row **recedes in profile** (audit item 11): front (green) jar full, blue behind it, purple rearmost and most occluded; caps/bases teal-dark, glass highlight sliver. Creatures are simplified silhouettes of the canon creatures — the one deliberate simplification on this sheet, flagged here |
| Arms | long navy sleeves, teal cuff bands, skin hands with fingers | **Near AND far arms drawn** (audit item 8): far arm offset back and one value darker. Sleeve given a +value step of the same navy so the arm reads against the torso. Hands hang beside the skirt with finger separations and a thumb curve |
| Skirt | pleated teal skirt | Wrapped side skirt: pleats converge to the waist, fold shading, slight A-flare, hem shade edge (audit item 12 — the walk adds charted hem sway) |
| Legs | teal tights | Profile legs with knee and calf shaping, back-edge shade, knee fold line |
| Profile shoe | navy sneakers: teal stripes, teal laces, white sole with teal bottom edge | **True profile shoe, drawn**: long toe-forward/heel-back silhouette; 3 diagonal teal side stripes, 4 teal lace bars, teal heel tab, white sole band with the teal bottom edge (v7 defect 6 — the front shoe is never stretched) |

## Flags

- DERIVED-FROM-CANON: this sheet is a construction from the front design,
  not a recovered canon asset. It needs the owner's eye like any model
  sheet before it becomes the standing profile reference.
- Head ~3% small vs canon ratio (table above).
- Jar creatures simplified (above).
- Hair crown flatter than canon's rounder top; face slightly more angular
  than canon's soft front read. Both are the drawing hand, recorded.
