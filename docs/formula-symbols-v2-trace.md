# Formula symbols v2 + logo emblems — trace (2026-10-26)

Mars's orders: 2026-10-26 14:18 CDT "stop cheating. Follow the formula"
(reject the round-2 measured-position mapping); 14:59 CDT widened brief
(every version v1–v35, restore the missing small emblems, use the
research's golden-ratio randomness numbers, fix the field floating too
high / leaving negative space at the bottom); 16:22 CDT still his main
complaint (too much negative space at the bottom — judged on the moving
render). This PR is the v2 answer. No merge by the worker — Mars judges
renders first.

## What changed (4 files, 0 file deletions)

- `src/lib/mainMenuSymbols.ts` — 300 symbols by the formula v2 below
  (replaces the round-2 measured set).
- `src/lib/lockedV32Menu.ts` — `background.logoEmblems`: 6 static
  logo-zone emblems (table below).
- `src/components/game/MainMenuBackground.tsx` — renders the emblems
  after the symbol field (solid over the faded field, as in the
  picture); header comments corrected to the formula field.
- This doc (addition only).

NOT touched: cloud files (PR #189 owns the original-cloud swap),
panel text (PR #206 owns it), logo image, arcs, panels, motion, fade,
speed. The renders for this PR were built with the original
puffy-cloud.svg applied locally for display only (version-lock);
that swap is NOT in this PR.

## Formula v2 (constants stated, checkable)

Research numbers (research_notes/mochiichao-color-neurochemistry-
design-20261025-2130/report.md §3.4/§4.3, quoted in the full trace):
phi-lattice, golden-angle ~137.5° steps, radius ∝ √n, centred at
61.8% across / 38.2% down the bottom zone, jittered ±10–15%,
Fibonacci sizes 8/13/21/34 (or scaled equivalents), densest cluster
at the φ point, density falling off. History lines
(conversation-log-2026-10-25.md): v26 golden angle 137.508°,
radius sqrt(n)*phi, sizes scaled by phi; v29/v30 "Placement still
golden ratio (137.508 deg, sqrt(n) radius, full width)"; v28
full-fill from HALF of CONTINUE to the bottom; v32 bottom 1500
full to edge, do NOT move start up/down.

Implemented: PHI = 1.6180339887; GOLDEN_ANGLE = 137.508°; N = 300;
bottom zone x 0..1200, y 620..1500; centre = (0.618×1200,
620 + 0.382×880) = (741.6, 956.2); theta = i × GOLDEN_ANGLE;
rho = sqrt(n) × PHI; K = 26.0 (outer radius 729px — the one constant
the log does not pin, chosen as the scale giving the flattest
full-width column coverage at this centre: per-100px columns 22–29,
sd 2.1); x = 741.6 + rho·K·cos(theta); y = 956.2 + rho·K·sin(theta);
jitter = research ±10–15% midpoint 12.5% of mean lattice spacing
D = sqrt(1200×880/300) = 59.3px (amp 7.4px/axis), deterministic
golden-ratio fractions (frac(i·PHI²), frac(i·PHI³)) — no random
module, no measured positions, no per-symbol hand tweaks; fold
x mod 1200, y = 620 + ((y−620) mod 880) (the same modulo the rise
motion uses). Sizes: Fibonacci 8/13/21/34 ×1.38 = {11, 18, 29, 47}
(75 each; largest tier 47px — the largest v32 field size that is
not a blob; round-1/round-2 blobs were 71–120). Shapes cycle the
v26 four (diamond/star/circle/heart); colours cycle the v26 solid
palette (7). Motion, fade, speed: UNCHANGED from locked v32.

Why fold, not crop: at K = 26 the sunflower density is
1/(π(Kφ)²) = 1/5560 px², so the zone holds at most ~190 spiral
points — a crop-to-zone loop can never reach 300 in-zone points.
The fold is forced by "300 symbols + zone + sunflower density",
and the game's own motion code folds y the same way.

## Logo emblems restored (measured from the v32 picture)

No coordinate table exists in the history, so picture measurement
is the only source, labelled as such. The game already drew arcs +
logo + cloud + Mochii + panels + field; these six were missing:

| Shape | Centre | Size | Colour |
|-------|--------|------|--------|
| black 4-point star | (600,194) | 41×41 | #000000 |
| black 4-point star | (139,533) | 45×45 | #000000 |
| black 4-point star | (1059,533) | 53×53 | #000000 |
| blue heart | (169,405) | 63×51* | #95cbfe |
| pink heart | (230,637) | 53×37 | #fe95c7 |
| pink circle | (1054,412) | 46×46 | #fe95c7 |

\* Blue heart height is the crop-visual value (opened bbox merged
with the arc below). Version sources: v14 (circles/hearts/sparkles),
v15, v25 (mirrored). The "little emblems at the bottom" are the
field itself, not a separate asset set (v27's 15 pastels were
superseded by v28's full-fill field).

## Bottom-fill evidence (Mars 16:22 CDT complaint, measured)

- Simulation over the full loop with the EXACT game motion formula
  (80 frames × 70ms, rise 157.14 px/s, sway 6px, bob 4px, phase =
  golden angle × index, modulo zone 620–1500): bottom gap
  (1500 − lowest symbol bottom edge) is NEGATIVE every frame
  (min −27.3, max −0.2, mean −15.2) — the lowest symbol overlaps
  the bottom edge at every frame; there is no in-stage bottom gap
  at any point in the loop.
- Real moving render, 8 frames × 700ms = one full 5.6s loop at
  600×750 (exact half-scale stage): lowest non-white row = 749
  (gap 0) in 8/8 frames. The v32 picture target measures the same:
  lowest row 1499 (gap 0).
- Phone render (390×844, seeded, all 4 panels): lowest non-white
  row 665 vs stage bottom 666 (gap 1px screen ≈ 3px full-scale).
- The white Mars sees BELOW the menu on a phone render is the
  letterbox, not field space: the 1200×1500 stage at phone width
  is 390×487px, centred in 844px, leaving 179px of HOST background
  above and below the stage. "Fills to the bottom" means to the
  stage bottom edge (1500), which the field does every frame.
  Filling the phone screen itself would need a framing change
  (fill-height crops the stage sides) — that is a Mars decision,
  NOT changed here.

## Conflicts, stated plainly

- Min-gap: the research 1.5× rule was written for 12–18 symbols.
  At 300 + full density it cannot hold for every large–large pair:
  190 of 44,850 pairs sit closer than 1.5× the larger size; worst
  pair 2.6px apart (indices 147/175, both 47px black hearts)
  renders as one 47px heart, not a blob. Reported, not hand-fixed.
- Button corridor: satisfied above/between panels by the opaque
  panels on top; SUPERSEDED below panels by v28 full-fill.
- Rotation: research Fibonacci rotation steps NOT applied — the
  perfect animation lock (rotate 0) supersedes them.
- Research count recommendation (12–18 symbols, 75–85% blank) is
  SUPERSEDED for this field by v28 full-fill + the 300-symbol lock.

## Superseded — DO NOT USE

- Round-2 measured-position symbol set (285, PR #178) — rejected
  as a cheat by Mars 14:18 CDT; never fall back, never mix in.
- Formula field v1 (centre 600,1060, no jitter, sizes 18/29/47) —
  superseded by this v2 research placement.
- Traced cloud #184 — superseded by original puffy-cloud.svg
  (PR #189 owns that swap).
- v33–v35 do NOT exist as files in ui-art; v1–v9 placement numbers
  are NOT in the files (only fragments survive). Neither is
  invented here. Full version table (v1–v35) is in the worker's
  trace (goals hidden_files, formula-symbols-trace-v2-20261026.md).

## Verification

- tsc: 0 errors. Vite build (`--base=./`): pass, bundle
  `index-BDm3vErv.js` contains v2 first symbol 776.3 and emblem
  x=1059; cloud resolves to the original puffy-cloud.svg data URI.
- Render: phone 390×844 seeded (4/4 panels, 306 SVG groups =
  300 symbols + 6 emblems, 3 images) + 8-frame loop GIF at
  600×750 + side-by-side vs the three targets (v32 picture,
  matched GIF frame 0, Mars verification proof).
- The game still cannot be driven through INTRO with keys alone
  (separate owed bug: INTRO keydown handler closes over stale
  introScene — a 4th key press renders undefined → black screen);
  renders here were driven with INTRO button clicks, which are
  safe. That bug is NOT fixed in this PR.
