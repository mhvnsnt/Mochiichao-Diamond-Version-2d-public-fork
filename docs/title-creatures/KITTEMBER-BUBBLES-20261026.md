# Kittember bubble recovery — staged research only, 2026-10-26

No merge, no PR, no repo edits. Repo `git status` verified clean at end.
Source: sheet crop template-matched to v3 at corr 0.999 —
`sprite-art/2d-sheets/kittember/media-generation-kittember-sheet-v1-0-64eacb16-d402-4e78-94df-6083f3bcdfce.webp`
crop (22, 32, 311, 344) = 289x312, exactly v3's frame.

## The two lost bubbles (identified by orange-component analysis)

Shipped in-game cutout (287x304, PR #84 u2netp) vs v3 (289x312):
- LOST top-right satellite: v3 orange area 60px, bbox (273, 70, 12, 11), norm (0.965, 0.240).
  In shipped: 0px orange, only a faint dark outline ring on black.
- LOST bottom-right satellite: v3 orange area 53px, bbox (266, 139, 12, 11), norm (0.940, 0.461).
  In shipped: 0px orange, only a faint dark outline ring on black.
- KEPT in shipped: top satellite 18px (v3: 21px at (218, 65)) and left satellite
  as an orange-ring fragment 39px at (192, 103) with hollow centre.
- Reference (v3, all satellites): main orb 3219px, tail 571px, eyes 39px / 34px.

## Candidates (all in this directory, all eye-checked on black)

| Candidate | Size | Method | Bubbles | Shadow | White spot | Dark-bg eye-check |
|---|---|---|---|---|---|---|
| kittember-bubbles-grabcut-iter10-20261026.png | 282x297 | OpenCV GrabCut, rect (2,2,285,308), 10 iter, source crop only | 4/4: top 21px, top-right 60px, bottom-right 53px, left present (merged with orb in orange mask, visible ring + white centre); orb 3219px, tail 571px — identical areas to v3 | OUT — no ellipse below feet on black | OUT — no light patch on body/whisker area; remaining 872 sheet-bg-coloured px are orb-halo fringe at x>=177 (orb area), not body | PASS |
| kittember-bubbles-grabcut-rect-20261026.png | 283x299 | OpenCV GrabCut, rect (2,2,285,308), 5 iter | 4/4, same areas as v3 | FAIL — gray shadow ellipse visible below feet | FAIL/unclear — 1380 sheet-bg-coloured px incl. shadow fringe | FAIL (shadow) |
| kittember-bubbles-grabcut-iter1-20261026.png | 284x307 | OpenCV GrabCut, rect (2,2,285,308), 1 iter | 4/4, same areas as v3 | Not eye-checked as a finalist (opaque 54029, bgcol 1533 — shadow/fringe heavier than iter10) | Not claimed out | NOT PASSED as finalist |
| kittember-bubbles-grabcut-rectshort-20261026.png | 283x283 | OpenCV GrabCut, rect bottom 285, 5 iter | 4/4, same areas | OUT | OUT by eye, but feet TRUNCATED at bottom (flat-cut legs) | FAIL (feet cut) |
| kittember-bubbles-u2netp-default-20261026.png | 289x303 | rembg u2netp default, re-run on source crop | Top-right PARTIAL 45px (vs 60px v3); bottom-right 0px; top 5px fragment | OUT | OUT (bgcol 79) | PARTIAL — bottom-right still lost |
| kittember-bubbles-u2netp-matting-erode0-20261026.png | 285x301 | rembg u2netp, alpha matting, erode 0, fg 200 / bg 10 | Top-right FULL 92px; bottom-right 0px; top 0px; left present (merged) | OUT | OUT (bgcol 3) | PARTIAL — bottom-right still lost, top lost |

On-black proofs (`*-onblack.png`) sit beside each candidate in this directory,
plus `kittember-bubbles-grabcut-iter10-20261026-orbzoom-onblack.png` (4x orb zoom).

## Recommendation

Show **kittember-bubbles-grabcut-iter10-20261026.png first**.
It is the only candidate passing all three stated criteria at once:
bubbles 4/4 with v3-identical orange areas, no baked shadow, no white spot
on the body/whisker area.

Disclose when showing it — one visible difference vs the shipped cutout:
the orb's pale peach glow halo is kept (as in the original sheet and v3),
where the shipped u2netp version has no halo. Figure, whiskers, ears,
tail and orb core are otherwise unchanged in scale and position.
Candidates are raw segmentation outputs (GrabCut alpha is binary);
the 1px alpha feather used on earlier shipped cutouts was NOT applied here,
so a feather pass would be a finishing step before any future ship decision,
not a change made in this research.

## Incident note (transparency)

A metrics script briefly wrote two `*-onblack.png` proof files outside this
directory (one into the repo's `src/assets/title/`, one beside v3 in
`cutouts/`). Both were deleted immediately in the same work session and the
repo was verified clean afterwards (`git status` empty). No shipped file was
overwritten and no repo edit remains.
