# RESTORATION PROOF — impact-only template v1 (required, not optional)

**Date:** 2026-10-26. **Method:** rebuild the Dreadtoise hurts impact set
from THIS package alone — `builder/restore_impact_only.py` reading ONLY
`inputs/` inside this package — into a fresh output directory, then diff
against the shipped set stored in `outputs/`.

**Command:**
`python3 builder/restore_impact_only.py /tmp/impact-only-restore`

**Builder run output (verbatim actions):**
- hurt_light_flinch: mode=impact, changing=False, overlay_ms=120,
  actions=[overlay-o-shock-widened, base, base]
- hurt_heavy_knockback: mode=impact, changing=False, overlay_ms=0,
  actions=[base-skipped-unverified-flash, base, base, base]
- hurt_status_wobble: mode=impact, changing=False, overlay_ms=120,
  actions=[overlay-grimace-dizzy, base, base]
- hurt_near_faint_stagger: mode=impact, changing=False, overlay_ms=120,
  actions=[overlay-frown-half, base, base, base]

**Results (all must be identical — all are):**

| Check | Result |
|---|---|
| 14 retime cells, pixel-by-pixel vs `outputs/cells/` | 14/14 PIXEL-IDENTICAL, 0 diff px on every cell |
| GIF `dreadtoise-hurts-retime20261026.gif`, SHA-256 | shipped `d82e785828be6ad28ca8846b50eef0624a698557bb7689b76a52f66aa7564963` = restored `d82e785828be6ad28ca8846b50eef0624a698557bb7689b76a52f66aa7564963` — BYTE-IDENTICAL |
| GIF frames (16 items, durations included) | 16/16 FRAME-IDENTICAL |
| Preview montage `dreadtoise-hurts-retime20261026-preview.png` | BYTE-IDENTICAL |
| Manifest `dreadtoise_hurts` section | IDENTICAL |

**Verdict: TEMPLATE VERIFIED RESTORABLE.** Rebuilding from this package
alone reproduces the Mars-approved shipped set exactly — layers, anchors,
timing, and all. If any future edit breaks any row above, the template is
NOT saved until the spec is fixed and this proof passes again.

**Shipped source of `outputs/`:** PR #158, merge
`2f5b4b86d8e390f841047158c4cf11b25b905667` (branch
`feature/articulation-v3-retime`, from live-verified main `1184da22`).
`outputs/` files are copies; originals untouched.
