# Mars small-visual-calls comparisons — method notes — 2026-10-27

Renders only. No game, default, or repo change was made. No PR, no merge, no publish.
No logo was recreated with font text: every logo pixel in these files is a pixel crop
of the v32 picture (or, for (b), a synthetic symbol field that contains no logo at all).

## (a) TOP SPARKLE — mars-compare-top-sparkle-20261027.png (1280×1080)

- Left: pixel crop of mochiichao-main-menu-phi-fade-v32.png, full coords x 450–750,
  y 100–300, enlarged 2× with NEAREST (no pixels invented). Red box = measured star box.
- Right: pixel crop of menu-perfect-verification-proof-20261026.gif frame 0,
  half coords x 225–375, y 50–150, enlarged 2× with NEAREST. Dashed red box = same
  relative window, empty.
- Re-measured 2026-10-27: v32 star box x 580–620, y 174–214 = 41 × 41 px,
  centre (600, 194), 521 black pixels (all channels < 40); no other black pixels in
  x 560–640, y 160–230.
- Right side: 0 black pixels (< 40, and also 0 at < 80) in half-scale window
  x 270–330, y 75–120 in BOTH the matched GIF frame 0 and Mars's proof, and 0 in the
  scaled star box x 290–310, y 87–107. Darkest channel-sum there: 605 (matched) /
  556 (proof) — white / light grey only.
- Mars's call: keep the v32 star, or drop it to match the GIF / proof?

## (b) FADE FAINT SEGMENT — mars-compare-fade-faint-20261027.png (1120×1240)

- Both panels use the SAME deterministic synthetic symbol layout (170 shapes, 7 flat
  palette colours, seeded 20261027), drawn over white with per-symbol alpha from the
  curve being shown. Top = gone y 620, mid line = y 729, bottom = full y 905.
- Left curve = code's piecewise-linear fadeAt: 0 @ 620 → 0.35 @ 729 → 1 @ 905.
- Right curve = interpolation of this task's own re-measurement (NOT a fitted law,
  NOT a code change): anchors (full y, opacity) 620 → 0, 650 → 0.108, 670 → 0.129,
  690 → 0.156, 710 → 0.198, 726 → 0.228, 729 → 0.35, 905 → 1.0, linear between anchors.
- Re-measurement method (2026-10-27, all 80 frames of menu-v32-rise-fade-sine-matched.gif):
  side strips x < 75 / x > 525 at half scale (avoids logo/cloud/panels), chromatic
  palette only (black excluded), white-blend fit residual ≤ 12, per-pixel alpha from
  (255 − observed) / (255 − colour), binned by y.
- Results: faint segment 620–729 measures BELOW code's line, growing toward mid.
  10-px bin medians (full y): 650 +0.014, 670 −0.031, 690 −0.069, 710 −0.094 (max bin gap).
  Per-row medians reach −0.112 at y 726 full. Strong segment 729–905 matches code
  within ±0.011 (e.g. y 810 full: measured 0.648 vs code 0.649). The y 630 bin (n = 35)
  reads +0.076 — small-sample selection bias at near-zero alpha, not a curve feature.
  These numbers are close to, but not copied from, the 2026-10-26 audit (which reported
  about −0.093 / −0.134 by a large-interior method); the difference is method, stated here.
- Mars's call: keep code's straight line, or order the GIF's faint curve (with its
  steep catch-up around y 729)?

## (c) PHONE FRAMING — mars-compare-phone-framing-20261027.png (1100×1260)

- METHOD — POST-PROCESSED COMPOSITES, NOT LIVE PHONE SCREENSHOTS. Both sides are built
  in PIL from the v32 picture (scaled + centred / cropped). No live 390-px screenshot
  was taken for this item, and neither side is a screenshot of a running phone build.
- Left (as now): width-fit stage 390 × 487 (scale 390/1200 = 0.325) centred in the
  844-high screen: 179 px white above, 178 px white below (stage rows 179–665 in the
  prior 390×844 render). That white is host letterbox, NOT menu field space — the menu
  itself already fills to its own bottom edge.
- Right (proposal, render only): height-fit stage, scale 844/1500 = 0.563, stage
  675 px wide, centre-cropped to 390 (142 px cropped each side at phone scale,
  ≈ 253 px each side at full 1200 scale; kept window ≈ full x 253–947). Panel boxes
  (x 300–900) still fit inside the kept window; logo side stars (x ~140 / ~1060) and
  arc extremes are cropped out. Note visible in the render: the long CONTINUE sublabel
  runs to the right edge in the fill version.
- FRAMING CHANGE REQUIRED (Mars decision, NOT applied): LockedStage must change from
  width-fit / contain (scale to width, centre, letterbox) to height-fit / cover
  (scale to height, centre-crop horizontally, allow horizontal overflow to be cropped).
  No panel, logo, cloud, or symbol content change — framing only.
- Mars's call: keep letterbox, or switch LockedStage to fill-height framing?

## Still needing Mars's word

1. Top sparkle: keep or drop (see (a)).
2. Fade faint segment: keep code's linear interpolation, or order the GIF curve (see (b)).
3. Phone framing: keep letterbox, or approve the LockedStage fill-height change (see (c)).
   Until Mars approves (3), no framing change is applied anywhere.

## Disk note (honest, not a deletion)

Home disk was 100% full during this task (87 MB free at first save, ~55 MB after these
files landed; one save initially failed with "No space left on device" and succeeded on
retry via /tmp). Nothing was deleted for this item. The three PNGs + this note total
under 1 MB. A separate disk-cleanup decision is already pending with Mars in other lanes.
