# Yogiferno white-speck clean v2 — notes 2026-10-26

Base: v1 clean yogiferno-white-speck-clean-20261026.png (145x190, itself from shipped PR #33 cutout).
Task: Mars judged v1 (2026-10-26 ~15:21 CDT): body specks better but NOT fully cleaned, and the stuff around his little fire halo was not gotten at all. His point is correct: Yogiferno has a black outline, so the outline should be the boundary.

## Why pass 1 missed things (measured, not guessed)
- Pass 1 removed ONLY disconnected near-white components: 50 clusters / 113 px, all R,G,B > 235.
- After pass 1, the v1 file has exactly ONE alpha component (14,410 px, bbox x18-144 y0-189) and ZERO disconnected specks. So pass 1's own criterion reports "0 left" — yet fringe remains, because it is CONNECTED to the figure.
- Remaining fringe in v1 is attached edge banding, not specks: boundary light-neutral pixels 544 (near-white boundary 421), light-neutral pixels within 3 px of transparent background 778.
- Halo: warm fire core is 693 px at y0-13, x74-138, with a pale gradient outward to neutral white at the edges (scan y=2: fire core -> pale orange -> near-white over ~5 px each side). Those gradient/fringe pixels are connected to the warm core, and many are not >235 neutral (channel spread up to ~50), so pass 1 excluded them.
- Outline: the dark outline is FRAGMENTED, not one closed loop (27 dark components, largest 824 / 534 px; grey shading pixels at 143-188 sit between fringe and dark). A naive flood-fill through non-dark pixels LEAKS into interior cream fur (tested: even with dark dilation 3, 175 deep-interior neutral pixels fall in the fill). That is why "just flood-fill from the outline" does not work as stated — v2 uses a row/column barrier rule instead (below), which does not leak.

## v2 method (scripted, open-source only — no hand pixel edits)
- Barrier B = opaque pixels with (max channel < 110) OR (max < 170 AND channel spread <= 50). This covers black outline plus grey outline shading, but not blue markings with spread > 50 or warm fire.
- For each row run and each column run of the opaque mask, pixels lying before the first barrier pixel or after the last barrier pixel in that run are "outside the outline" in that direction.
- Removal = opaque AND neutral-light (min channel >= 200 AND channel spread <= 20) AND (row-outside OR column-outside) AND within 10 px of transparent background (distance transform). Alpha only: removed pixels get alpha 0, RGB untouched everywhere.
- Halo zone = within 15 px of a warm fire pixel (warm = R-G >= 30 AND R-B >= 40 AND R >= 120). Body zone = everything else.
- Ambiguous rule: pale halo pixels (min >= 200, spread 21-60, not warm-defined) are LEFT, not deleted — they are the fire-glow gradient, indistinguishable from sheet by colour alone. Counted below.

## v2 removal counts
- Total removed: 571 px
- Halo zone removed: 136 px
- Body zone removed: 435 px
- Removal components: 110 (thin fringe bands, not interior blobs)
- Ambiguous halo pixels LEFT (outside-candidate pale gradient): 21 px (all halo pale mn>=200 spread 21-60, not warm: 89 px)

## Guardrail verification
- Changed pixels == removal set exactly: True (571 px)
- RGB changed: 0 px (alpha only)
- Warm fire pixels changed: 0 px
- Barrier (outline) pixels changed: 0 px
- Pixels with distance > 10 px from transparent changed: 0 by construction (dist<=10 guard)
- New opaque: 13839 px (was 14410 px)
- New alpha components: 35 areas [13669, 22, 19, 13, 12, 12, 10, 9, 7, 6, 6, 5, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]

## What was NOT removed
- Warm fire core (693 px) and pale fire gradient (ambiguous, above) — fire colours preserved.
- Cream fur interior: light-neutral interior pixels (v1 body-zone light-neutral total 3707 px, mostly interior fur) — only the fringe subset outside the barrier was removed.
- Dark/grey outline, blue markings, hands, feet, eyes — none changed (barrier pixels are not neutral-light, so they cannot be in the removal set).

## Status
STAGED ONLY. No repo edit, no merge, no PR, no deletion, no replacement of the shipped file. Ships only after Mars confirms this v2 in words.
Deliverables: work/yogiferno-white-speck-clean-v2-20261026.png, work/show-100/yogiferno-white-speck-clean-v2-show-20261026.png, this notes file + JSON.

## Stage 3 — detached sheet blobs (added after first v2 build, before any showing to Mars)
Fringe removal alone left 34 small disconnected components totalling 170 px, all neutral light (mean RGB ~241-247, spread <= 20), sizes 1-22 px, sitting outside the body barrier with transparent gaps between them and the body. In v1 these blobs were connected to the main figure only through fringe bridges, so pass 1 (disconnected-only) and stage 1 (barrier runs with a barrier in the run) both missed them: a blob that forms its own row run with no barrier pixel in that run was skipped by stage 1.
Stage 3 removes exactly those components: area <= 30 px, mean neutral light, disconnected from the main component, not warm, not barrier. Count: 34 components, 170 px.
Final totals vs v1: 741 px removed (571 fringe + 170 detached blobs). Final boundary light-neutral pixels: 89 (was 544 in v1) — the remainder is the figure's own cream-fur edge and pale halo gradient where it meets the background, which cannot be removed without eroding the figure itself; warm fire and ambiguous pale gradient (21 px outside-candidate, see above) are still preserved.
Final components: 1 (the main figure only — all 34 detached sheet blobs are gone, no floating bits left).
