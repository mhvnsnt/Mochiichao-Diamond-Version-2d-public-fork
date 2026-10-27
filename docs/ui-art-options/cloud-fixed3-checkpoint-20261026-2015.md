# Checkpoint: cloud fixed3 — CURRENT-restorable, NOT perfect

Date locked: 2026-10-26 ~20:15 CDT, by Mars's order 2026-10-26 19:54 CDT:
"lock in what you got as one we can get back to at any point in time."

## What this checkpoint IS

The cloud-positioning fix as it stood when Mars ordered the lock, before the
three forward fixes below. Restoring this checkpoint returns the menu to
exactly this state: cloud shaped (transform only, no drawing, no redraw),
original puffy-cloud.svg byte-untouched, traced cloud nowhere in use.

## Restore path (no guessing, no re-deriving)

- Code: PR #233, branch `feature/cloud-shape-fix-20261026`,
  head `fd2516c47b07127ce6d970fce2236db1ee159107`, from main `5c1e143a`.
  `git checkout feature/cloud-shape-fix-20261026` (or that head) restores
  the code. PR #233 is OPEN, not merged, not published, at lock time.
- Cloud element: `src/components/IntroSequence.tsx` — cloud rendered as
  `<svg><image href={puffyCloud} preserveAspectRatio="none">`, import
  unchanged (`../assets/ui/puffy-cloud.svg`, 597 bytes, blob sha
  `5ebd1125…`). Traced file `mochiichao-main-cloud-v32.svg` is BANNED /
  DO NOT USE anywhere; it appears in no file of this checkpoint.
- Cloud frame (lockedV32Menu.ts `cloud.imgBox`):
  `{ x: 225, y: 599, w: 823, h: 258 }`.
  Rendering factors measured for this element (Chrome headless, standalone
  exact-construct render AND menu render agree): content = 0.851 x frame
  width, centre 0.044 x frame width LEFT of frame centre, 0.671 x frame
  height tall, top at 0.191 x frame height.
- Cloud spec box (unchanged, v21 step): visible shape x250-950, y648-828,
  centre (600,738), 700x180. Cloud bob (PR #149, never Mars-locked):
  amp 6px, period 5s, still active in this checkpoint.

## Measured numbers (same white-interior method, every row)

| render | interior x-span | width | interior y-span | centre |
|---|---|---|---|---|
| TARGET (v32 picture) | 257-942 | 685 | 655-815 | (599.5, 735) |
| CURRENT (before fix) | 422-742 | 320 | 686-787 | (582, 736.5) |
| FIXED3 (this checkpoint) | 258-942 | 684 | 653-811 | (600, 732) |

FIXED3 vs TARGET: left +1px, right 0px, top -2px, bottom -4px.
Width 684 vs 685 = 99.9%. Close, NOT exact — see below.

## Renders proving this checkpoint (workspace, never overwritten)

- `~/workspace/mochiichao-work/ui-art/cloudpos-fixed3-20261026.png`
  (full render, stage-frozen, 1200x1413)
- `~/workspace/mochiichao-work/ui-art/cloudpos-fixed3-phone-20261026.png`
  (phone render, seeded)
- `~/workspace/mochiichao-work/ui-art/cloudpos-fixed3-moving-20261026-moving.gif`
  (28 frames x 200ms = 5.6s loop — SAMPLING, not 80x70ms full-rate)
- `~/workspace/mochiichao-work/ui-art/cloudpos-closeup-compare-20261026.png`
  (current vs target vs corrected cloud crops, same region)
- Full trace: `~/workspace/mochiichao-work/ui-art/hidden_files/cloudpos-fix-checkpoint-2026-10-26.md`

## Status: NOT perfect yet — three fixes still pending on top of this

Mars, 2026-10-26 19:54 CDT, on the fixed3 moving GIF:

1. Emblem rise speed TOO FAST — use the slow speed locked earlier today
   (PR #163 slow-rise, saved option), not the matched-GIF perfect speed.
2. Emblem field TOO NARROW — too much white negative space on both sides
   of the rising emblems; the field area must be widened on both sides.
3. Blue heart + pink heart BY THE LOGO missing — restore them at their
   exact yesterday placements, on their exact layer.

And Mars, 2026-10-26 19:57 CDT, acceptance bar for the forward fix: the
corrected cloud must look like the TARGET panel EXACTLY — shape and
everything in that crop, not close, not 99.9%. This checkpoint does NOT
meet that bar (see table above); the forward fix must.

## What is NOT in this checkpoint

- No symbol-speed change (perfect speed still default here).
- No emblem-field change (measured symbol set, 285 symbols, as on main
  via PR #178 — the formula-v2 300-symbol set is PR #214, still open).
- No logo hearts (blue/pink hearts are PR #214-only, still open).
- No merge, no publish, no default title/menu change beyond PR #233's
  own cloud lines. Sine/speed work stays PARKED except the explicit
  emblem-speed order above.
