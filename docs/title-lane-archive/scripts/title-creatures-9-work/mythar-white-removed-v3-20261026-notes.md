# Mythar white-removed v3 — leg/fur restoration (staged only)

Mars's judgement on v2 (2026-10-26 ~16:34 CDT, replying to the v2 show sheet):
the little white background parts are gone now and that part is PERFECT, but
v2 (cumulatively with v1) also took out some colour on his legs and fur, so
his legs look reduced. V2 is therefore NOT approved as-is: not shipped,
nothing deleted.

## Measurement (not guessed)

Base files, all 434x350 RGBA:
- Shipped: `repo/src/assets/title/mythar-walk-cutout.png`,
  md5 `474b1583464fe377fb32098781b37bcf` (verified unchanged).
- V1: `work/mythar-white-removed-20261026.png`.
- V2: `work/mythar-white-removed-v2-20261026.png`.

Cumulative removal shipped -> v2, verified: **2,254 px = 1,532 (v1) + 722 (v2)**.
RGB is identical everywhere both versions stay opaque (0 differing pixels).

Per-pass, per-component removal (shipped colours, neutral near-white throughout):
- V1: LEFT 783 px, bbox x121-155 y214-254, mean (245,243,240);
  RIGHT 749 px, bbox x272-305 y213-253, mean (246,244,242).
- V2: 346 px x298-328 y214-248 mean (244,242,239); 145 px x102-113 y212-235
  mean (247,244,241); 119 px x76-85 y207-229 mean (246,244,240);
  107 px x345-353 y207-223 mean (246,244,241); plus 5 tiny pixels (1-2 px each).

### Which pass ate the legs — pixel truth, stated plainly

Neither pass removed a dark leg pixel or a lavender leg-fur pixel. All 2,254
removed pixels are neutral sheet-white (mean 244-247, spread ~5-6), and every
removed component sits in the side gaps between body/legs and the lower wing
tips / ring — outside the legs' outlines. Below y254 (the legs proper,
y255-350) there are **0 removals in v2 and 0 in v3**: the legs themselves are
byte-identical to shipped in every version so far.

What Mars's eye caught is real anyway: the pockets are bordered almost
entirely by pale fur (506 of 616 sampled neighbour colours are pale fur, 0 are
gold, 30 dark), with no dark outline separating fur-white from sheet-white
along most of the pocket edge. In the shipped image the white pocket and the
white fur read as one continuous fluffy mass flanking the legs, so taking the
pocket out makes the leg/belly mass read narrower — the legs *look* reduced
even though no leg pixel was deleted. The fix below restores exactly the
ambiguous boundary layer where fur and sheet cannot be told apart.

## V3 restoration (scripted, alpha only, no invented colour)

Rule: a removed pixel is restored iff it is 4-connected to a pale-fur pixel
still present in v2. Pale fur in v2 = opaque, mean channel > 165, channel
spread < 55, blue > 110 (this excludes gold ring, stained-glass wing panes,
and dark outlines). Every restored pixel takes its EXACT shipped RGBA value.

- Restored (fringe): **383 px — 150 from v1's removal, 233 from v2's removal**;
  left side (x<170) 180 px, right side (x>=260) 203 px, middle 0 px.
  These are the ambiguous-restored pixels: the 1 px layer where fur meets
  pocket, where leg-intact wins over gap removal by Mars's rule.
- Still removed (true pocket interiors): **1,871 px** — 706 px x122-155
  y214-253; 690 px x272-306 y213-252; 246 px x310-327 y217-238;
  95 px x104-112 y213-232; 67 px x346-352 y207-222; 65 px x77-83 y208-226;
  plus 2 px at x84 y227-228.
- V3 opaque: 83,601 px (v2: 83,218; shipped: 85,472).
- Verification on reload: restored pixels byte-identical to shipped (True);
  RGB differs nowhere both versions stay opaque (0 px); v3 vs shipped diff is
  exactly the 1,871 still-removed pixels; nothing below y254 removed.

Deliberately NOT restored: pocket interiors (above), and the design whites
from pass 1/2 (face/forehead highlights, chest iridescence, wing-pane light
spots, white tail x199-213 y204-228, gold ring/halo, wing-tip/horn edges) —
those were never removed and are untouched.

## Deliverables (new dated files, v2 and all shown files untouched)

- `work/mythar-white-removed-v3-20261026.png` (434x350 RGBA)
- `work/show-100/mythar-white-removed-v3-show-20261026.png` — shipped vs v3
  on black AND dark ground (24,32,48), full figure + zooms: left flank,
  right flank, both legs. Eye-checked: pocket interiors stay open/black,
  fur-edge fringe is back along the flank, legs identical to shipped.
- `work/mythar-white-removed-v3-20261026-notes.md` (this file)
- `work/mythar-white-removed-v3-20261026.json` (counts)

## Status

STAGED ONLY. No repo edit, no PR, no ship, no deletion. V2 is superseded for
showing by v3 (newest dated edit, per the save rule). Deletion of the old
shipped file + new lock remain gated on Mars confirming v3 in words.

CPU-only step, stated plainly: a 434x350 PNG alpha operation — a GPU
genuinely cannot help that step.
