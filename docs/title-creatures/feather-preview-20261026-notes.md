# Feather previews — Mochii + Yogiferno — 2026-10-26 (STAGED PREVIEWS ONLY)

NOT shipped, NO repo edit, NO PR. Mars asked 2026-10-26 ~16:35 CDT to be SHOWN
what the feather versions mean, after the lane reported "versions aren't ordered
yet". That phrase meant: the 2026-10-26 feather audit only MEASURED (it created
no versions). These previews are the first feathered versions built for these
two creatures. Mars has NOT approved shipping a feathered version.

## Bases (verified before building)

| Creature | Base file | Size | md5 check |
|---|---|---|---|
| Mochii | shipped `mochii-walk-cutout.png` (gate clone) | 380x380 | aa95714f06b146c3464d139837b6cbab — matches feather audit |
| Yogiferno | NEW locked `yogiferno-white-speck-clean-v3-20261026.png` | 145x190 | ca3626b78431a6022ace8854d8dcf0aa — Mars-confirmed new lock 16:35 CDT |

Yogiferno base is v3 on purpose: NOT the old shipped Yogiferno, NOT clean
v1/v2. If a feathered Yogiferno is ever approved, it succeeds v3 as the
newest dated version per the save rule; v3 itself stays untouched.

## Method (PR #51 description, scripted — no hand pixel edits)

- Boundary = opaque pixel (alpha 255) with >= 1 transparent (alpha 0)
  8-neighbour. Both bases are binary alpha (0/255), verified.
- Boundary pixels get alpha 128 (50%). Interior pixels (all 8 neighbours
  opaque) are byte-identical. Transparent pixels stay transparent.
- RGB untouched everywhere. Silhouette extent unchanged.
- Script: `feather-preview-20261026.py` (same folder).

## Measurements (before -> after)

| | Mochii | Yogiferno (v3 base) |
|---|---|---|
| Size | 380x380 | 145x190 |
| Opaque px before | 78,949 | 13,459 |
| Intermediate-alpha px (1-254) before | 0 | 0 |
| Boundary px feathered | 2,047 | 1,055 |
| Intermediate-alpha px after | 2,047, all exactly 128 | 1,055, all exactly 128 |
| Ramp width | 1 px (0 -> 128 -> 255, verified on sample rows) | 1 px (same) |
| Non-zero-alpha px after | 78,949 (unchanged) | 13,459 (unchanged) |
| Bbox before -> after | [13,12,363,328] -> identical | [18,0,144,189] -> identical |
| Alpha mass before -> after | 20,131,995 -> 19,872,026 | 3,432,045 -> 3,298,060 |
| Interior byte-identical | YES | YES |
| RGB unchanged everywhere | YES | YES |
| Thin boundary px (<= 2 opaque neighbours) | 20 | 4 |

Thin-boundary note: a handful of edge pixels belong to tiny detached
details (e.g. Mochii's small satellite droplets). At 50% alpha they stay
visible — the show sheet's full figures show them intact — but they are
the faintest part of the feather. Mars's eye is the judge here.

## Does the feather change the silhouette?

NO change in extent: same dimensions, same bounding box, same count of
non-zero-alpha pixels. What changes is only the outermost 1px ring's
opacity (255 -> 128), so the cut edge reads as a soft 1px step instead of
a hard 0 -> 255 step. At full title size the before/after figures look
near-identical; the difference is visible only in the 6x edge zooms.
The figure does NOT shrink.

Two honest context points for Mars's decision:
1. The other 7 cutouts have 4-5px ramps (audit) — softer than this 1px
   feather. Shipping this 1px feather makes Mochii/Yogiferno no longer
   hard cuts, but still the crispest edges in the pool. Matching the
   others' 4-5px softness would be a different, wider feather — not
   what was built here, which follows the PR #51 1px spec exactly.
2. Yogiferno's fire-halo outer ring is part of the figure edge, so it
   gets the same 1px feather as the body edge. The warm fire core itself
   is interior and untouched.

## Ship-safety assessment (if Mars later says so)

- Mochii preview: SAFE to ship as a files-only cutout replacement —
  alpha-only, interior identical, RGB identical, extent identical.
  Only judgement call: the 20 thin-detail pixels at 50%.
- Yogiferno preview: SAFE to ship on the same terms, based on the v3
  lock — alpha-only, interior identical, RGB identical, extent
  identical. Only judgement call: the 4 thin-detail pixels at 50%.
- Neither preview ships without Mars approving a feathered version in
  words. Approval would make the feathered file the newest dated
  version (and, for Yogiferno, the successor to the v3 lock).

## Deliverables (new dated files, no shown file overwritten)

- `mochii-feather-preview-20261026.png` (380x380 RGBA)
- `yogiferno-feather-preview-20261026.png` (145x190 RGBA)
- `show-100/feather-preview-show-20261026.png` (full before/after on
  black AND dark ground (24,32,48) + 48px crops at 6x edge zooms)
- `feather-preview-20261026.json` (machine-readable measurements)
- `feather-preview-20261026.py` (build script)

CPU-only: tiny PNG alpha work (380x380, 145x190) — a GPU genuinely
cannot help this step, stated plainly.
