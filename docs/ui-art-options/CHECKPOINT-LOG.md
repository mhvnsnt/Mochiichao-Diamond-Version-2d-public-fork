# Checkpoint log (append-only — never rewrite, never delete)

Each entry names the checkpoint file, what it locks, and whether Mars
locked it, approved it, or only saw it. New entries go at the end.

## 2026-10-26 ~20:15 CDT — cloud fixed3, CURRENT-restorable, NOT perfect

- File: `docs/ui-art-options/cloud-fixed3-checkpoint-20261026-2015.md`
- Locks: PR #233 (`feature/cloud-shape-fix-20261026`, head `fd2516c4`),
  cloud frame `{ x: 225, y: 599, w: 823, h: 258 }`, original puffy-cloud.svg
  byte-untouched, traced cloud banned. Measured: fixed3 interior 258-942
  (684 wide) x 653-811, centre (600,732), vs target 257-942 (685) x
  655-815, centre (599.5,735) — 99.9% width, NOT exact.
- Status: ordered locked by Mars 2026-10-26 19:54 CDT as restorable;
  NOT perfect — emblem slow speed, emblem field widening, and logo
  blue/pink hearts still pending on top of it; forward cloud fix must
  meet the 19:57 CDT bar (look like TARGET exactly, not close).
- Renders: `~/workspace/mochiichao-work/ui-art/cloudpos-fixed3-20261026.png`,
  `cloudpos-fixed3-phone-20261026.png`,
  `cloudpos-fixed3-moving-20261026-moving.gif` (28x200ms sampling),
  `cloudpos-closeup-compare-20261026.png`.
