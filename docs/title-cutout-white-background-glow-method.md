# Title cutout: white-background removal + effect restoration + composite glow

Standing method, approved by Mars 2026-10-26 ~09:53 CDT on the Kittember
example below. Use this exact recipe any time a title cutout needs its
little white sheet background removed and an effect that was obscured by
that background put back. Never re-add the sheet background to get an
effect back. Never hand-paint the figure.

## Approved example: Kittember

- Shipped file: `src/assets/title/kittember-walk-cutout.png`, 287x304.
- Shipped version: `work/kittember-bubbles/kittember-bubbles-clean-glow-20261026.png`
  (clean figure + bubbles + composite glow), shown to Mars first and
  approved in words before shipping. No-glow comparison staged beside it:
  `kittember-bubbles-clean-20261026.png`.
- Previous version it replaces: PR #84 u2netp cutout (287x304), which had
  the white spot and baked shadow out but had lost the two satellite
  bubbles' orange fill.
- Rejected version, do not reuse: GrabCut iter10
  (`kittember-bubbles-grabcut-iter10-20261026.png`, 282x297). It recovered
  the bubbles but brought the sheet background back: 1,055 near-white
  opaque pixels spanning x 68-277, y 66-168, versus 60 in the shipped
  cutout. Mars rejected it on sight. Its halo colour is also wrong for
  reuse (see step 4).

## Step 1 — Start from the clean, white-removed base

Start from the shipped clean cutout, not from a whole-figure segmentation
that brings background back. The base must already have: white removed
between whiskers, around the tail, and behind the figure; white spot out;
baked ground shadow out. Measure its near-white baseline first
(definition used throughout: R, G, B > 235, alpha > 128).
Kittember shipped baseline: 60 near-white pixels.

## Step 2 — Identify exactly which effects the white removal obscured

Compare the clean base against the earlier version / sheet by
alpha-component analysis. List every lost effect with a pixel count and
a bounding box, under one consistent colour definition. Do not guess
from a thumbnail.
Kittember orange definition: R > 140, G 60-210, B < 130, R > G, R-B > 70,
alpha > 128. Lost effects found: top-right satellite 77px at
(273, 70, 12, 12), bottom-right satellite 73px at (266, 140, 12, 12),
both identical to the earlier v3 under this definition. Unchanged for
contrast: top satellite 28px, left satellite 35px. Total orange:
shipped 4,284 -> clean + bubbles 4,434 (+150 = 77 + 73).

## Step 3 — Restore only the lost effects, nothing else

Align by a measured registration point, then paste only inside the
effect masks. Kittember registration: orb-disc centroids v3
(238.3, 116.6) vs shipped (238.3, 117.6), shift (0, +1). Masks: disc
radius 7.5 around each bubble centre, source alpha > 128. Verify the
redo changes only the effects: Kittember clean candidate changes exactly
273 pixels vs shipped, 0 of them outside the two bubble discs. If a
draft pastes the whole figure (this happened once in the Kittember run),
delete that draft before anything is shown and redo it with disc masks.

## Step 4 — Build the glow as a NEW composite layer, never as background

Sample the glow colour from the original halo ring of the illuminating
object, not from a background-contaminated version. Kittember: median
RGB (253, 213, 168), soft peach-orange, sampled from the v3 orb halo
ring 38-55px around the orb centre. Do not use the iter10 halo median
(251, 219, 187): it is paler because it is washed with sheet background.
Draw the glow programmatically as a radial gradient: centre = orb centre
in shipped coords (238.3, 117.6), radius 72, peak alpha 0.55, smoothstep
falloff to transparent. Composite it UNDERNEATH the figure (glow layer
first, figure on top), so figure pixels stay untouched wherever the
figure is opaque. The glow belongs behind the illuminating orb only —
like light coming from the orb — never behind the tail, back, whiskers,
or body. Kittember glow region check: x 177-286, y 46-189, 0 glow pixels
at x < 120 (whisker side) and 0 at y > 200 (tail/feet zone). The glow
adds no white: its green channel (213) is below the near-white
threshold.

## Step 5 — Verify before showing, then show first

- Near-white count (same definition as step 1): Kittember clean +
  bubbles 79 (the 19 new pixels vs shipped are all highlight dots inside
  the two bubble discs), glow version 64 (glow tints some highlight dots
  peach, so it reads lower than clean). Both are near the shipped 60
  and nowhere near the rejected iter10's 1,055.
- Eye-check on black AND on a dark title-ground tone (24, 32, 48).
  Required passes: no white between whiskers, no white around the tail,
  no white behind the figure, no baked shadow ellipse below the feet,
  no white spot return, glow visible around the illuminating orb only.
- Show the candidate to Mars first. No swap or ship until he picks it
  in words. Staged candidates live under
  `work/kittember-bubbles/` (or the equivalent lane work folder) with new
  dated filenames; never overwrite a file already shown to Mars.

## Step 6 — Ship only the approved file, unchanged

Ship via a gate-checked PR (lint, build, validate) with 0 files deleted.
Do not silently add finishing passes to an approved file. Kittember
note: the shipped glow version is raw segmentation with the 1px alpha
feather NOT applied, exactly as approved. A feather pass, if Mars ever
asks for one, is a new version shown first, never an edit to this file.

## Reuse for another creature

Repeat steps 1-5 with that creature's own measured numbers: its clean
baseline, its lost effects with counts and boxes, its registration
shift, its halo colour sampled from its own light, and its glow placed
behind its own illuminating orb/object only. Keep every rule above
unchanged: background never comes back, figure never hand-painted,
candidate shown first, shipped file unchanged from the approved one.
