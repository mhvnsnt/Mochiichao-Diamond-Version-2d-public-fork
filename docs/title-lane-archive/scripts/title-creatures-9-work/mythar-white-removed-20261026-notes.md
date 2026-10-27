# Mythar white-gap removal — staged, show-first (2026-10-26)

Mars ruling (2026-10-26 ~14:57 CDT, on the Mythar final-lock show sheet):
the sheet should have shown a more updated version with the little white
between the body and the wings, and the little white in the light ring
surrounding it, removed. That fix becomes the new lock, and THEN the old
version gets deleted — but ONLY after Mars confirms in words that the new
version is right the first time.

## Deliverables (staged only, no repo edit, no PR, no deletion)

- New cutout: `work/mythar-white-removed-20261026.png` (434x350 RGBA)
- Before/after show sheet: `work/show-100/mythar-white-removed-show-20261026.png`
  (full figure before/after on black and on dark ground (24,32,48), plus
  4x zoom pairs of both gaps on black)
- This notes file.

## Source

- Shipped cutout: `repo/src/assets/title/mythar-walk-cutout.png`,
  434x350 RGBA, md5 `474b1583464fe377fb32098781b37bcf` — verified
  UNCHANGED after this task (same md5 before and after; `git status`
  shows no change to that file). The staged cry files visible in the
  gate clone's git status belong to a sibling worker, not this task.

## Method (scripted, open-source only — no hand pixel edits)

1. Compared the shipped cutout against the lane's own u2netp candidate
   (`mythar-walk-cutout-20261026-u2netp.png`, same 434x350): shipped
   opaque 77,944 px, u2netp opaque 74,673 px, shipped-only 3,271 px,
   u2netp-only 0 px.
2. Took connected components (OpenCV 5.0.0, 8-connectivity) of the
   shipped-only mask and kept ONLY components that are sheet gaps:
   size >= 500 px, mean RGB overall >= 242, bbox y >= 200, side zones
   (x < 170 or x > 260). Exactly 2 components passed.
3. Set alpha = 0 on exactly those pixels in a copy of the shipped
   file. RGB values were NOT touched anywhere.

## What was removed (per zone) — total 1,532 px

| Zone | Pixels | Bounding box (x, y, w, h) | Mean RGB | Near-white >=235 |
|---|---|---|---|---|
| LEFT — between body/left wing, inside ring | 783 | 121, 214, 35, 41 | (245.1, 243.0, 239.7) | 90.2% |
| RIGHT — between body/right wing, inside ring | 749 | 272, 213, 34, 41 | (245.5, 243.8, 241.6) | 97.7% |

Both zones are the same two pockets seen from both descriptions: they
sit between the body/legs and the lower wing tips AND inside the light
ring ellipse. No separate upper body-wing sheet pocket exists — measured:
the upper near-white components are wing-pane light spots and face
highlights that the u2netp segmentation also keeps, so they were NOT
removed. If Mars meant a different upper gap, the show-sheet zooms let
him point at it; nothing was invented here.

## What was NOT removed (explicitly excluded)

- The u2netp candidate's other 1,739 shipped-only pixels (wing-tip and
  horn edge trims, mean RGB ~213-234, low near-white share) — those
  would alter design edges, so they were NOT applied. The new file
  keeps the shipped outline everywhere except the two gaps.
- Face/forehead highlights, chest iridescence, wing-pane light spots,
  and the white tail hanging between the legs (center, x199-213,
  y204-228) — all design, all preserved byte-identical.
- The light ring / halo itself (gold ellipse + sparkles): untouched.
  Only the white sheet trapped inside it was removed.

## Verification (measured, not claimed)

- Diff old vs new: exactly 1,532 px, and diff == removal mask exactly.
- Alpha-only change: 1,532 px changed alpha, 0 px changed RGB.
- New opaque count: 76,412 px (77,944 - 1,532).
- Output size/mode unchanged: 434x350 RGBA.
- Eye-check: new file on black shows both side gaps black
  (transparent), ring intact, body/wings/legs/tail/face intact.
- Sheet check: first sheet draft had truncated title, overlapping
  labels, and a zoom row running off the right edge — rebuilt with
  short labels and two zoom rows; final sheet 940x1648 verified with
  captions present at the bottom.

## Gated next step (NOT done here)

Deletion of the old file + new lock happen ONLY after Mars confirms
in words that this new version is right the first time, as a separate
step. Until then: old shipped file stays, new file stays staged.
