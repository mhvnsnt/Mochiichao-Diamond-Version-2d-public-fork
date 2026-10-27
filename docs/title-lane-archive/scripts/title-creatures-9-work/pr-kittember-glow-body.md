Kittember glow ship — Mars approved 2026-10-26 ~09:53 CDT, shown first.

WHAT SHIPS (2 files, 0 files deleted):
- src/assets/title/kittember-walk-cutout.png — REPLACED with the approved
  clean-glow candidate (287x304, 64779 bytes, md5 6ac90f4a8c4cde22169248a62baf84e1):
  shipped #84 clean figure + two satellite bubbles restored + new
  soft-orange composite glow behind the big orb only. No 1px feather
  applied, exactly as approved — a feather pass would be a new version.
- docs/title-cutout-white-background-glow-method.md — NEW doc: the exact
  reusable method (white-background removal + effect restoration +
  composite glow), so any future creature can be done the same way.

WHAT IT FIXES: PR #84 lost the two satellite bubbles' orange fill
(top-right 77px, bottom-right 73px, identical to v3). The rejected
GrabCut iter10 recovered them but brought the sheet background back
(1055 near-white pixels vs shipped 60) and was rejected by Mars.
This version keeps white out: near-white (R,G,B>235, alpha>128) shipped
60, clean 79, glow 64; glow sampled RGB (253,213,168) from the v3 halo,
radius 72, peak alpha 0.55, underneath the figure, region x177-286
y46-189, 0 glow at x<120 (whisker side) and 0 at y>200 (tail/feet).

GATES (gate tree, base main 28196096): lint (tsc --noEmit) PASS,
build (vite build) PASS (2m10s, JS index-jHaYWTvW.js), validate:reference
PASS (warnings are open decisions, not failures). Diff check before
commit: 1 modified PNG + 1 added doc, 0 deletions. Main was still
28196096 at upload time. TitleCreatureFigure size metadata for
Kittember (287x304) is unchanged and still correct, so no code change.
