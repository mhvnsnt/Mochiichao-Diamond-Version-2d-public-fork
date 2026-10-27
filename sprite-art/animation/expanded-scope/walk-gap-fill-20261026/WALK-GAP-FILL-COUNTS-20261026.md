# WALK GAP FILL — COUNTS REPORT (2026-10-26, staged only, NO PR, NO lock)
Source audit: WALK-CELLS-AUDIT-20261026.md (51/51 sets checked). Mars order 17:56 CDT: fill the gaps, do not flag them.

## Per category (percentages with counts)
- Locked-side gaps: 10/10 = 100% (20 cells: 7 creatures × 2 in locked-side/ + aerobeak/floatcalf/megalochrome × 2 in partial-dirs/)
- Partial walk-frames dirs: 8/8 = 100% (32 frames: left_0/1 + right_0/1 × 8 creatures)
- Punchkid 2nd side frame: 1/1 = 100%
- 51st look (strikechamp_unsuited_full) walk dir: 1/1 = 100% (8 frames, built from its OWN locked cells, 0 base Strikechamp frames)
- Overall audit gaps filled: 61 new files / 61 owed = 100% (20 locked-side cells + 32 frames + 1 Punchkid cell + 8 51st-look frames)
- Unique sets touched: 17 (7 locked-side + 8 partial dirs, 3 overlapping + Punchkid + 51st look)
- Roster walk coverage after fill: 51/51 sets = 100% (33 previously OK + Razorgater filled earlier + all gaps above)

## Method + rules verified
- Own-art first (md5-verified copies where copied); 0 new colours vs each creature's own-art universe on all files (locked-side palette qualifier: walk-frames palettes differ from locked cells — a future lock must accept the walk-frames palette).
- NO baked shadows in any new file (rows 56-63 checks); shadows stay engine-rendered.
- NO face changes; NO generation used in locked-side or Punchkid/51st work (likeness rule not triggered); partial-dirs built from own art, one scripted floatcalf hover-bob phase.
- NO locked atlas/manifest overwritten; NO PR; show-first — ship + lock only after Mars confirms in words.

## Caveats (Mars's eye, not hidden)
- Megalochrome: faint 1-2px ripple arc remnant rows ~48-51 (removing it would cut fin pixels).
- Stormtalon: storm-cloud puffs retained on cell09-derived frames (connected to talons, not ground shadow).
- Punchkid side_2 is walk-sheet style, not a locked-pixel redraw (redraw = separate order).
- 51st look locked manifest labels are wrong (e.g. cell 03 labelled front is a back) — NOT rewritten here; separate manifest-relabel task.
- Shellguard locked manifest: frame_count says 13, lists 14 entries (pre-existing, untouched).
- Cocoonode sides reuse front cell (scale pulse); wispkin sides are front tilt variants (hover bob) — not newly drawn profiles.
- Combined sheet: walk-gap-fill-combined-20261026.png (61 new tiles).
