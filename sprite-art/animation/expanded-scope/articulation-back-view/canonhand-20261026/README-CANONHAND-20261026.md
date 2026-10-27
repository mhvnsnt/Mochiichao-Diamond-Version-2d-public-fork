# Canon-anchor hand pass 2026-10-26 — README

Staged only, NO PR, NO lock, show-first. Re-dispatch: the first worker died
in a daemon restart with no checkpoint; this build replaces it from scratch
(no checkpoint existed to resume from).

## Authority
Mars confirmation 2026-10-26 ~18:44 CDT:
- WINGS/TALONS AS HANDS: aerobeak, stormtalon, zephling.
- TENTACLE TIPS AS HANDS: astroleviathan, inklet, krakenox, toxitacle.
- NO HANDS (not built here): kittember, pebblefist, terrapod. Terrapod
  nuance: it HAS feet, but no hands — its rocks float apart, not hands —
  so terrapod stays H-none for hands despite having feet.

## Method
Verbatim from back-hand-pass-20261026 / trueback-hand-pass-20261026, with
one adaptation: the anchor POINT is a TIP, measured per frame from that
frame's own silhouette extremes (wings: lateral extremes; tentacles:
middle-band 35%-85% lateral extremes, so top props never become anchors).
Two-point states use left+right tips; flail uses top-band tips; droop uses
bottom-band tips; punch/cast use the right (attacking-side) tip. Tips are
shifted inward (5px pair / 8px single) so fists render whole; raw-extreme
fallback, else base copy + flag — never guessed. Mode A impact-only
(attack f3, hurt f0); cast glow element-neutral; no claw-swipe from
behind; HANDS ONLY, zero face overlays; 0 shadow pixels added, none
stripped.

## Bases
- stormtalon: trueback-sets-20261026/stormtalon (its current true back).
- Other 6: their staged articulation-back-view/<creature>/ back sets.
Back-set files untouched; G1 (copy frames byte-identical) verified true
for all 7.

## Counts
- Creatures resolved: 7/7 = 100%, 0 excluded in this pass.
- Cells: 252 (7 x 36: 22 attack + 14 hurt; idle excluded as in prior passes).
- Hand frames applied: 56/56 = 100%, flagged: 0.
- GIFs: 14 (attacks + hurts per creature). GIF frame counts: hurts 14
  exact everywhere; attacks 22 for aerobeak/stormtalon, 21 for the other
  5 — Pillow merges pixel-identical frames, and those 5 base sets reuse
  one identical base pose across set boundaries (e.g. astroleviathan's
  physical-recover = signature-windup = signature-hold = special-recover
  cell). The 22 PNGs per creature are authoritative, not the GIF count.
  This is the lane's known Pillow quirk, not a missing cell.
- Files: 252 cells + 7 per-creature show sheets + 1 combined sheet
  + 7 per-creature manifests + 1 index manifest + this README + builder.

## Shadow notes (measured on idle00 bottom rows 56-63, reported not stripped)
- aerobeak 0, astroleviathan 0, krakenox 0, toxitacle 0 grey px.
- stormtalon 152, zephling 89, inklet 82 grey px = cloud props / ring /
  jar base, not ground ellipses; nothing stripped.

## Fixes during this build (disclosed)
1. First run: punch fists at frame-edge extremes rendered half-clipped.
   Fix: inward shift 5px pair / 8px single (was 3px) — fists now whole.
2. Second run: 2 cast frames flagged (stormtalon + zephling special f3) —
   the raw-extreme fallback only handled two-point states. Fix: fallback
   now handles single-point punch/cast too. Final run: 56/56, 0 flagged.
