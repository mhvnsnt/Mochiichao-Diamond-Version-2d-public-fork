# PICK-A HAND PASS 20261026 — STAGED ONLY, NO PR, NO LOCK

Hand pass for strikechamp + shellguard ONLY, rebuilt on their pick-A back-view
sets (`trueback-sets-pickA-20261026/`, from relabeled cells strikechamp_cell_04
and shellguard_cell_01 — Mars's pick A, 2026-10-26 ~18:23 CDT). The
trueback-hand-pass-20261026 sets for these two were built on the superseded
generated bases and are held as SUPERSEDED-HELD there; this pass replaces
them. Held dirs were left intact (40 files each, untouched); nothing else
was overwritten.

## Counts (percentage rule)

- Creatures: 2/2 = 100% resolved, 0 excluded.
- Cells: 72/72 = 100% (2 × 36: 22 attack + 14 hurt; idle excluded).
- Hand frames applied: 13/16 = 81% — strikechamp 6/8, shellguard 7/8.
- Flagged (base copy + flag, never guessed): 3/16 = 19%, all
  `anchor-outside-silhouette` on hurt frame 0 (strikechamp heavy knockback
  + near-faint stagger; shellguard heavy knockback) — side anchors landing
  in transparent gaps of squashed hurt silhouettes.
- Copy frames: 59/59 byte-identical to pick-A bases (G1 verified
  independently, 0 failures). Hand-frame diffs all inside base silhouette
  dilated by 2px (G2 verified independently, 0 failures). GIFs: 4/4
  (attacks 22 frames + hurts 14 frames per creature, exact).

## Method (trueback hand-pass verbatim)

Anchors derived PER FRAME from that pick-A frame's own silhouette bbox;
Mode A impact-only (attack frame 3, hurt frame 0); cast glow
element-neutral; no claw-swipe from behind (no plain claw arc visible in
either pick-A physical impact cell); skin = median opaque RGB in a 7px box
(front rule, unchanged). HANDS ONLY — zero face overlays; true backs show
no expression, ever. NO baked shadows: pick-A idle00 bottom rows measured
(strikechamp y56-60, shellguard y56-57, multicolour body/feet pixels, no
flat grey ground ellipse), and the pass adds 0 shadow pixels.

## Files

- Per creature: `<creature>/` — 36 hand-pass cells + 2 GIFs + manifest +
  show sheet (wrapped labels, base left / hand pass right).
- `combined/pickAhand20261026-combined-show-sheet.png` — physical impact
  + heavy knockback per creature (labels wrapped; an earlier combined
  render clipped labels and was regenerated before delivery).
- Index manifest: `pickAhand20261026-manifest.json`.
- Builder: `build_pickA_hand_pass.py` (adapted from
  `trueback-hand-pass-20261026/build_trueback_hand_pass.py`: input paths
  switched to pick-A sets, manifest reader switched to
  `manifest-pickA-20261026.json`, creatures limited to these two).

## GPU note

Pixel work on existing art, local CPU. Kaggle GPU genuinely cannot help
these steps; no Kaggle job was opened for this pass.
