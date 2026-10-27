# Yogiferno white-speck clean v3 — halo ring only (2026-10-26, staged only)

Base: yogiferno-white-speck-clean-v2-20261026.png (145x190 RGBA, opaque 13,669 px).
Mars's judgement on v2 (~15:43 CDT): body is PERFECT, all body specks gone — but specks
around his little fire halo remained. This v3 touches ONLY the halo ring.

## Measurement (before removal)

- Warm fire core: 693 px, bbox x74-138, y0-13. Warm = R-G>=30 AND R-B>=40 AND R>=120.
- Halo zone = within 15 px (Euclidean) of a warm pixel.
- Halo-zone non-warm, non-barrier pixels: 688 px total.
- The halo fringe ring, within 6 px of the warm core, light (min>=200, spread<=60):
  dist 1-3: 141 px (52 neutral spread<=20 + 89 pale-gradient spread 21-60)
  dist 4-6: 56 px (all neutral)
  fractional distances in (3,4): 13 px
  TOTAL REMOVAL: 210 px, bbox x69-143, y0-19.
- The 89 pale-gradient pixels include the 21 ambiguous pixels v2 deliberately left plus
  68 more that v2's row/column barrier test had classed as inside — all 89 are within
  3 px of the warm core, i.e. halo fringe, and Mars has now explicitly ordered the
  halo specks gone, so all 89 go in v3.

## What was deliberately NOT removed (and why)

- Warm fire core: 693 px, 0 changed. Bright yellow fire glow (spread>60, 160 px at
  dist 1-3, mean ~254/237/130) is fire design, kept.
- Black outline / barrier pixels in the halo zone: 105 px, 0 changed.
- Halo-to-head transition shading: 33 px at dist<=6, y13-19, min 150-199 (grey/tan) —
  darker junction shading, not white specks; left.
- Head-top light pixels at dist 7-15: 272 px, x87-125, y20-28, mean ~242-244 neutral.
  These are HEAD FUR, not halo specks: columns at x95/105/115 are continuously opaque
  from y18 through y45+, and row widths widen steadily downward (y20: 29 px -> y29: 44 px)
  exactly as a head widens. Removing them would erase the top of his head. Body is
  perfect per Mars, so they stay. If Mars still sees white there, that white is his
  head fur, not sheet — say so plainly rather than deleting it.
- Everything at y>=20: byte-identical to v2 (verified).

## Removal rule (scripted, no hand edits)

opaque AND Euclidean distance to warm core <= 6 AND NOT warm AND NOT barrier
(barrier = max<110 OR (max<170 AND spread<=50)) AND min channel >= 200 AND
channel spread <= 60. Alpha only: removed pixels get alpha 0, RGB channels untouched.

## Verification (reloaded from the saved v3 file)

- v3 opaque: 13,459 px = 13,669 - 210. Exact.
- Warm core preserved: 693/693.
- RGB identical everywhere: yes (0 RGB px changed).
- Alpha differs exactly on the 210-px removal set: yes.
- Body region y>=20 byte-identical: yes. Body-changed count: 0.
- Halo-ring light pixels remaining after v3 (dist<=6, min>=200, spread<=60): 0.
- No removal pixel at y>=20, none overlapping warm, none overlapping barrier.

## Version-save status

- New dated file: yogiferno-white-speck-clean-v3-20261026.png — this is the NEWEST
  Yogiferno clean edit and supersedes clean v2 as the candidate to show (per Mars's
  save rule, 2026-10-26 ~15:43 CDT: newest dated edit is the version to use).
- It does NOT become the shipped lock until Mars confirms it in words after seeing
  the show sheet. No repo edit, no PR, no shipped file replaced or deleted.
- CPU-only: tiny 145x190 PNG alpha work — GPU genuinely cannot help that step.

## Files

- yogiferno-white-speck-clean-v3-20261026.png (145x190 RGBA)
- show-100/yogiferno-white-speck-clean-v3-show-20261026.png (before v2 vs after v3,
  black + dark ground 24,32,48, full figure + 6x halo zooms)
- yogiferno-white-speck-clean-v3-20261026.json (counts)
- yogiferno-white-speck-clean-v3-20261026-notes.md (this file)
