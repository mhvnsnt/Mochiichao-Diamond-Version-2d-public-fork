# BATCH D — PIPELINE V2 REWORK VERIFICATION (2026-10-26, show-first, NO PR)

Tag: `artic-v2rework-20261026`. Staged only under
`animation/expanded-scope/articulation-v2-rework/batch-d/`.
Batch D originals untouched (0 v2rework files in `articulation-batch-cd/batch-d/`),
Batch B untouched, pilots untouched, approved hurts untouched (hurts not staged).

## Result: 36/36 impact frames overlaid, 9/9 creatures, 9/9 eye-checks PASS

- 198 staged cells (22 per creature: 4 attack sets, 5–6 frames each, all frames
  staged; only impact frame 3 carries an overlay, the rest are base copies).
- 36 per-set attack GIFs (one per attack set, pilot durations verbatim, no +250 tail).
- 9 eye-check sheets (top row = base impact, bottom row = V2 impact, 4x, columns
  = physical / special / signature / heavy in manifest order).
- Teeth: none drawn anywhere. Enlarged measurement confirms no Batch D front cell
  shows teeth — same as the old Batch D finding, re-verified, not assumed.
- Mouths: NOT drawn. MOUTH HOLD (Mars 2026-10-26 ~10:50 CDT): mouth overlays wait
  for the V3 contour-fit module. The two unsuited humanoids' mouth anchors were
  measured and recorded for V3 (unsuited (32,17), unsuited_full (30,18)) but no
  mouth shape, crop, or clearing box exists in this build. When V3 lands, mouths
  are applied on top of these V2 eyes and the delta is reported.
- terrapod + wispkin: stay BASE, not in this rework (terrapod: no measurable eye
  pair; wispkin: blank mask by design).

## Method (PIPELINE-V2.md, binding)

Overlay drawn AFTER the cell transform in final-frame coordinates; every dimension
multiplied by that frame's (sx, sy); ellipses under squash (visor/slit shapes are
scaled rectangles rotated about their own centre); NO clear-box rectangles anywhere;
size caps from measured true features; gates run ON the final frame.

- Pre-gate: >= 1 true-feature px within +/-3px of each propagated corrected anchor
  on the final frame. All 36 impact frames passed (lowest counts: toxitacle
  signature right eye = 1, toxitacle special = 2/2 — placement confirmed on the
  eye-check sheet, not by the count alone).
- Post-gate: every changed px within 2px of the base silhouette, where silhouette
  = any non-transparent rendered px (alpha > 0). First run used alpha >= 128 and
  failed all 4 stormtalon frames by 3 px; those px sit on the semi-transparent
  cyan glow (alpha 114) — rendered sprite, not background — so the silhouette
  definition was corrected to alpha > 0 and all 4 passed. This is recorded, not hidden.
- No frame was forced through a failed gate: in the first run the 4 stormtalon
  frames shipped as base copies until the gate definition was corrected and rerun.

## Anchor re-measurements (old -> new, 64px source coords)

Old marker-cross anchors were treated as hypotheses, per the V2 diagnosis.
Re-measured by feature-cluster centroid + enlarged-cell visual check:

| creature | old eyes | new eyes | change |
|---|---|---|---|
| squirmite | (25,17),(38,17) | (25.5,16.9),(37.6,17.0) | +0.5/-0.1, -0.4/0.0 — cluster centroid, visual discs confirm |
| stormtalon | (27,22),(36,22) | (26.3,21.0),(36.0,21.0) | -0.7/-1.0, 0.0/-1.0 — cyan blobs sit 1px above old crosses |
| strikechamp | (26,15),(38,15) | (26,15),(38,15) | UNCHANGED — cluster centroid REJECTED (merged with mask dark areas, bbox x19-33); visual slit centres confirm old |
| strikechamp_unsuited | (29,14),(34,14) | (29,14),(34,14) | UNCHANGED — cluster centroid REJECTED (merged with hair/face dark); visual 1-2px dots confirm old |
| strikechamp_unsuited_full | (28,14),(32,14) | (28,14),(32,14) | UNCHANGED — same rejection reason; visual dots confirm old |
| terradog | (25,13),(38,13) | (24.5,13.2),(38.3,13.2) | -0.5/+0.2, +0.3/+0.2 — dark eye patches |
| toxitacle | (25,26),(34,26) | (24.5,26.0),(33.7,25.7) | -0.5/0.0, -0.3/-0.3 — strict-predicate cluster understates the visual blob; visual bbox used for the cap |
| yogiferno | (28,20),(35,20) | (28,20.5),(35,20) | 0.0/+0.5, 0.0/0.0 — pale slits |
| zephling | (26,19),(37,19) | (25.8,18.8),(37.2,18.8) | -0.2/-0.2, +0.2/-0.2 — black beads |

## Size-cap corrections vs the old method

- zephling: REAL CORRECTION. Old widened r5 exceeds the 2x cap (true bead r~1.75,
  cap 3.5). V2 radius cut 5 -> 3.5 (scaled per frame). Eye-check confirms the
  smaller discs still read as widened and sit on the beads.
- All others within cap: squirmite r5 (true ~3.2, cap 6.5), stormtalon r3 (true
  ~1.5, cap 3, at cap), strikechamp visor rect (3,2) (slit half ~4,1.5),
  unsuited humanoids r2 (true ~1, cap 2, at cap), terradog r4 (true ~2.5, cap 5),
  toxitacle r3 (visual blob r~2, cap 4), yogiferno slit rect (1,3) (slit half ~0.5,2.5).

## Eye-check notes (agent eye-check, Mars verdict still open)

- squirmite: widened discs + highlights sit on the true discs. PASS.
- stormtalon: cyan eyes now clearly visible on the face in all 4 impacts. PASS.
- strikechamp: visor bars are bold by design (widened) but sit exactly on the
  slits; no spill onto the gold mask. PASS (Mars to judge boldness).
- strikechamp_unsuited: dark discs + highlights on the true dots; no mouth drawn
  (HELD). PASS.
- strikechamp_unsuited_full: discs read as a dark eye band across the true eyes.
  PASS (Mars to judge band read).
- terradog: discs are big/bold over the angry patches — widened-impact intent,
  within cap. PASS (Mars to judge boldness).
- toxitacle: purple eyes on the true blobs; physical frame reads as squashed
  ellipses, correctly following sy=0.75. PASS.
- yogiferno: pale slits subtly brighter/wider, on the true slits. PASS.
- zephling: capped discs on the true beads, highlight visible. PASS.

## Open items for Mars / parent

1. Mars verdict on the 9 eye-check sheets + 36 GIFs (show-first, not merged).
2. V3 contour-fit module: when it lands, apply mouths to strikechamp_unsuited /
   strikechamp_unsuited_full only, and report mouth delta vs this V2 eyes-only build.
3. Boldness calls: strikechamp visor bars, terradog discs, unsuited_full eye band
   — all within V2 caps, but Mars may still want them smaller.
