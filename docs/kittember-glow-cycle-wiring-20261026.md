# Kittember glow cycle wiring (2026-10-26)

## What this wires
Kittember's title figure now cycles its ember glow in-game, instead of
showing one static glow frame:

- A (glow off) -> B (glow on) -> C (stronger glow) -> B -> A,
  500ms per frame, 2500ms loop. The final A is the loop wrap, so A is
  held 1000ms per loop — exactly the staged cycle GIF's timing.

## Frames (all 287x304, same figure, glow underneath only)
- A — NEW `src/assets/title/kittember-glow-cycle-a-off-20261026.png`
  (57,892 bytes, md5 07126ccdde9786207af2d18c163b65cb) — staged
  `kittember-bubbles-clean-20261026.png`, copied byte-identical.
- B — REUSED, NOT duplicated, NOT overwritten:
  `src/assets/title/kittember-walk-cutout.png` — the PR #162 shipped
  clean-glow cutout (64,779 bytes, md5 6ac90f4a8c4cde22169248a62baf84e1,
  blob 5dbb6ead7654b87621afb6eaa985d5ea21b231b4), byte-identical to
  staged `kittember-bubbles-clean-glow-20261026.png`.
- C — NEW `src/assets/title/kittember-glow-cycle-c-strong-20261026.png`
  (61,779 bytes, md5 4089770f218f2cfa7d7df323fa00bf73) — staged
  `kittember-bubbles-clean-glow-strong-20261026.png`, copied byte-identical.

No art was edited in this PR: A and C are verbatim staged copies, B is
the already-shipped file, and the shipped cutout itself is untouched.

## Why v1, not v2
The cycle Mars was shown (ruling ~10:14 CDT: clean = off frame,
clean-glow = on frame, plus a third stronger frame) is the v1 set
above. The later v2 rebuild (B2: R80/peak 0.75/sigma 6/core 255,245,230;
C2: R115/peak 0.95/sigma 10/core 255,252,246; circular crop, blur +
whiter core — `KITTEMBER-GLOW-TEMPLATE-V2.md`, `build_glow_v2.py`,
`glow-v2-verification.json` in the staged `kittember-bubbles/` dir)
stays staged only. Swapping this wiring to v2 later is a refs-only
change (two new dated files + the cycle array); it is NOT smuggled
into this PR, and v2 is NOT claimed as shipped or wired here.

## Code (2 files modified, Kittember only)
- `src/components/game/TitleCreatureFigure.tsx` — Kittember entry
  gains a `cycle` array [A, B, C, B, A] (module constant, stable
  reference) and passes `figureUrl=cycle[0]`, `figureCycleUrls`,
  `figureCycleMs=500` to TitleScene. Every other creature passes no
  cycle and renders exactly as before.
- `src/components/game/TitleScene.tsx` — new optional props
  `figureCycleUrls` / `figureCycleMs` (default 500). When set, all
  frames are preloaded once and the ticker swaps `figure.texture`
  (and the Black 2 motion-blur ghost's texture) every 30 frames at
  60fps — the scene, sprite, position, scale, shadow and action
  burst are never recreated per frame. If any frame fails to load,
  cycling disables and the base figure (A) stays. Under
  `prefers-reduced-motion` the ticker never runs, so the figure
  stays on A (glow off). All cycle frames share 287x304, so the
  engine-drawn shadow size (computed from the first frame) stays
  correct for every step.

## Sources (Pokemon-first, stated plainly)
Shape/pulse model only, from FireRed decomp files:
`pokefirered-leafgreen/src/battle_anim_bug.c:170-179` (TailGlow affine
pulse) + `graphics/battle_anims/sprites/glowy_red_orb.png` (radial
disc). No blur math exists in the decomps; the v1 glow itself is the
staged program-generated radial gradient (centre (245,125), peach
253,213,168, B radius 72/peak 0.55, C radius 105/peak 0.80, feathered
orb-zone mask x>=180, y 40..200 — see
`KITTEMBER-ILLUMINATION-CYCLE-20261026.md`).

## Version-lock check
`docs/locked-versions.json` on main at PR time lists only
Razorgater attacks (take-6 CURRENT); it contains no Kittember glow
entry, so no locked asset is superseded or reused against the
registry here. The PR #162 cutout is reused, never overwritten, and
the new frames carry dated names, never overwriting a version Mars
has seen.

## NOT touched
Any other creature, Batch B, shiny/LUSTRE, footprints, walk-gate,
IRON_BARRAGE, bake PNG deletion, deploy/playtest, any other
worker's branch, and the dirty work clone
`~/workspace/mochiichao-work/fresh-start` (never pushed from, no git
changes made in it). Live playtest on a Pages build containing this
PR is still owed after merge — it is not claimed here.

## Gates (recorded in the PR body at ship time)
Clean-clone `npm run build` + `npx tsc --noEmit` on the branch tree;
0 errors required. Branch is created from live-verified main head
at upload time, new paths 404-checked, 0 deletions.
