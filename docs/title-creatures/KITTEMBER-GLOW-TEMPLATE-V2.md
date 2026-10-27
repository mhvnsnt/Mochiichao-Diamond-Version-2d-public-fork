# KITTEMBER GLOW TEMPLATE V2 — reusable glow recipe (2026-10-26)

Mars corrections (2026-10-26 ~10:22 CDT) over glow v1:
1. MORE BLUR + whiter as it grows: Gaussian blur on the glow layer, and
   the core colour moves toward white as radius/peak grow — like an
   actual glow, not a flat peach disc.
2. CIRCULAR crop: v1's rectangular feathered mask (x>=180, y 40..200)
   left a square fade at the edges. V2 has NO rectangular mask: falloff
   is pure Euclidean distance from the orb centre (a true circle),
   with a smooth cosine ANGULAR feather on the whisker side (wide
   angle ramp, no step) and a smooth cosine VERTICAL feather below
   the feet (y 190..215), instead of any axis-aligned cut.

## Sources (Pokemon-first rule, checked honestly)
- Pokemon files — shape + pulse model only, no blur math exists there:
  - FireRed `pokefirered-leafgreen/src/battle_anim_bug.c:170-179`:
    TailGlow orb affine anim scales a radial glow sprite (0x10 -> 0x8
    over 18 frames, then +-0x5 oscillation loop x5) — Pokemon's glow
    pulses by scaling a radial sprite.
  - FireRed `graphics/battle_anims/sprites/glowy_red_orb.png` (+
    glowy_blue/green_orb.pal): the glow shape itself is a radial disc.
  - Black 2 field-effect glows (`src/ov036/fldeff_d06denki.c`,
    `src/ov079/c_gear_sw.c`) are 3D-model/UI glows, not a reusable
    2D glow recipe — noted, not used.
  - Stated plainly: no Gaussian blur, hot-core gradient, or radial
    falloff code was found in the decomp files. That part is
    open-source technique (see below), not a Pokemon copy.
- Open-source technique:
  - Multi-scale blur falloff for light emission (bright centre,
    gradual near field, faint far halo) — e.g. the crtimg Gaussian
    blur + additive blending write-up (deepwiki, noau/crtimg §7.2).
  - Radial gradient + Screen/additive-style layering for light halos
    (standard Photoshop/GIMP glow practice: radial gradient, blur,
    lightening blend; Tuts+/Phlearn glow tutorials).
  - CSS/SVG radial-gradient practice: `radial-gradient(circle ...)`
    with stops fading to transparent — the "circle, not square" rule
    in gradient form.

## Recipe (exact parameters — builder: build_glow_v2.py)
Base: the clean figure, untouched on top. Glow drawn UNDERNEATH only.
Centre: orb centroid measured from the figure itself (this build:
(237.1, 123.2); v1 documented (245,125) — re-measure per figure,
never hard-code across creatures).

Per pixel, with d = euclidean distance from centre / R:
- falloff alpha = peak * (1-d)^1.6 for d <= 1, else 0
  (derivative 0 at the edge — no step; exponent 1.6 keeps the halo
  brighter than v1's squared curve)
- colour = lerp(core_white, peach(253,213,168), s),
  s = clamp((d - 0.15) / 0.85, 0, 1)
  (white persists past the orb surface; full peach only at the edge)
- angular feather (whisker side): raised-cosine ramp over the
  direction cosine in [-0.35, 0.35] — full strength pointing at the
  orb side, 0 pointing away, centre pixel weight 1
- vertical feather: raised-cosine ramp y 190 -> 215, applied BEFORE
  and AFTER blur so blur spill cannot leak below the feet
- Gaussian blur over the whole glow layer (sigma per frame)
- composite: glow UNDER figure (opaque figure pixels unchanged)

Frame parameters (this build):
| frame | R | peak alpha | blur sigma | core colour |
|---|---|---|---|---|
| B2 (glow-on) | 80 | 0.75 | 6 | (255,245,230) |
| C2 (stronger) | 115 | 0.95 | 10 | (255,252,246) |
Rule for new frames: bigger R -> bigger sigma AND whiter core.
Cycle: A -> B2 -> C2 -> B2 -> A, 500ms/frame, 2500ms loop (proposal).

## Verification (this build — builder writes glow-v2-verification.json)
- Figure identity: 0 changed fully-opaque px in B2 and C2.
- Near-white (min RGB >= 240): base 71, B2 71, C2 71 — 0 NEW near-white
  px anywhere. Honest note: the white-hot core sits BEHIND the opaque
  orb, so it cannot show as pure-white pixels; what the eye sees is
  the visible ring, which DOES whiten with size:
  visible-ring mean min-channel B2 = 199.6, C2 = 213.1
  (peach = 168; higher = whiter). Core-white count is therefore
  reported as 0 by the >=240 metric and the ring metric is the real
  whiteness proof — do not claim pure-white core pixels that are
  hidden behind the orb.
- Outside-disc white: 0 new px outside R + 2*sigma, both frames.
- Corners: glow alpha 0 at all four corners, both frames.
- Whisker side (x < 180): max glow alpha 0, both frames.
- Below feet: B2 0; C2 max 13 alpha inside the y 200..215 feather
  band, 0 below y = 215 (the band IS the fade, not a leak).
- Edge profiles (glow layer alone, alpha at fractions of R):
  down-ray B2: 80, 58, 31, 10, 1, 0, 0 — smooth, monotonic, no step.
  down-ray C2: 100, 73, 38, 0, 0, 0, 0 — smooth, monotonic.
  (Right ray runs off-canvas: the orb sits near the image's right
  edge, so the disc is cut by the canvas itself, same as v1 — that
  is a canvas limit, not a fade shape.)
- Angular profile at 0.5R, 0..180 deg: declines smoothly from the
  orb side to 0 on the whisker side (see verification JSON).
- Eye-check: strip on black reads off -> soft -> bigger/brighter/
  whiter -> soft -> off; halo is circular with no square edge.

## Files (this build, staging only — NOT shipped, NOT wired)
- kittember-bubbles-clean-glow-v2-20261026.png (B2)
- kittember-bubbles-clean-glow-strong-v2-20261026.png (C2)
- kittember-illumination-cycle-glow-v2-20261026.gif (cycle)
- kittember-illumination-cycle-glow-v2-20261026-strip-onblack.png
- build_glow_v2.py (builder), glow-v2-verification.json (numbers)
- V1 files untouched: clean, clean-glow, clean-glow-strong,
  illumination-cycle-20261026.gif, shipped #84 cutout, PR #162 static.

## Reuse notes (for the next glow)
1. Re-measure the light-source centroid from the figure; do not reuse
   (237.1, 123.2) for another creature.
2. Keep the glow UNDER the figure; verify 0 changed opaque px.
3. Bigger glow = bigger sigma + whiter core, always together.
4. Never a rectangular mask: radial distance + cosine angular/edge
   feathers only. Sample edge profiles on the GLOW LAYER ALONE —
   sampling the composite hits the opaque figure and lies.
5. Report ring-whiteness (mean min-channel), not just >=240 counts,
   whenever the hot core sits behind an opaque object.
