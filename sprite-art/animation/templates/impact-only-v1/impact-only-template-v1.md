# IMPACT-ONLY TEMPLATE v1 — Dreadtoise hurts (Mars-approved template)

**Status: APPROVED AS PERFECT + TEMPLATE by Mars, 2026-10-26 ~09:31 CDT**
(replying to Dreadtoise hurts impact-only): "this one's perfect now, that'll be
the template for doing impact only correctly."

**Save rule governing this package (Mars, standing, TRUE RESTORE definition):**
a "saved" thing is NOT a code description and NOT a static picture. It must be
a COMPLETE, RESTORABLE package IN THE REPO that reproduces the result EXACTLY
— layers and all — so it can be gotten back to if anything happens. This
package meets that rule: `RESTORATION-PROOF.md` proves a rebuild from THIS
package alone reproduces the shipped set byte-for-byte. If the proof ever
fails, the template is broken — fix the spec, do not claim it saved.

## What this template is

The impact-only (Mode A) articulation recipe, as shipped in PR #158
(merge `2f5b4b86d8e390f841047158c4cf11b25b905667`), for one creature's
hurt sets: Dreadtoise, 4 sets / 14 cells. It is the template for doing
impact-only correctly on ANY creature: same layers, same timing, same gates,
new creature's anchors + anatomy plugged in.

## The exact recipe (layers, in order)

1. **BASE FACE LAYER (bottom):** the pilot base cell for the frame, untouched.
   Source cells live in `inputs/cells/` (copies of the pilot hurt cells);
   source manifest in `inputs/dreadtoise.pilot-manifest.json`. Base layer is
   NEVER redrawn — it is the creature's own art.
2. **OVERLAY LAYER (top, impact frame ONLY):** mouth + eye states drawn with
   PIL `ImageDraw` at the propagated anchors below, ONLY on the frame whose
   role is `impact`. Every other frame ships as base (pixel-identical).
3. **Layer order:** base cell → mouth overlay → eye overlay. Nothing else.
   No body, background, or cannon pixel is ever touched (frame-diff gate
   proves it: overlay diffs confined to eye anchors ±9px, mouth anchor ±11px).

## Timing (Mode A, impact-momentary — Mars 2026-10-26 ~09:13 CDT)

- Overlay shows ONLY momentarily at the moment of CONNECTION/impact.
- NOT before (windup) and NOT after (recover): the base face resumes for the
  remainder of the beat. Leaving an overlay on too long replaces the whole
  face — that is the failure this template exists to prevent.
- `IMPACT_FLASH_MS = 120`: if the impact beat lasts longer than 120ms, the
  GIF shows the overlay for 120ms, then the BASE face for the remainder of
  the same beat. Total set duration is UNCHANGED.
- Overlay visibility per set (from the shipped manifest): flinch 120ms,
  knockback 0ms (see exception), wobble 120ms, stagger 120ms.
- Total set durations (unchanged by the template): flinch 520ms, knockback
  700ms, wobble 740ms, stagger 1180ms.

## Builder + exact parameters

- Builder: `builder/restore_impact_only.py` — a template-relative adaptation
  of the shipped `build_v3_impact.py` (PR #158). Same code path, same math.
- Run it: `python3 builder/restore_impact_only.py <fresh-output-dir>`
  from anywhere; it reads ONLY `inputs/` inside this package and writes the
  rebuilt set to the fresh dir. It needs nothing outside this package.
- Named parameters (do not change without re-running the proof):
  - `TAG = 'retime20261026'`
  - `IMPACT_FLASH_MS = 120`
  - `IMPACT_ROLES = ('impact',)` — the ONLY role that carries an overlay
  - Source anchors (64px cell space, before propagation):
    Dreadtoise eyes `[(26, 31), (38, 31)]`, mouth `(32, 38)`
  - Propagation: scale about bottom-centre, translate, rotate, downscale —
    the exact `propagate()` math in the builder, driven by each pilot cell's
    recorded `transform` (squash/lean/shift/rotation).
  - Verification gate: eye-window feature counts must pass at the propagated
    anchors — Dreadtoise amber count ≥ 5 per eye — else the frame ships as
    base. Flash frames ALWAYS fail the gate and are skipped (see exception).

## Anchor coordinates per frame (propagated, 64px space; from the manifest)

| Set | Frame | Role | Eyes (L, R) | Mouth | Eye counts | Verified | Action |
|---|---|---|---|---|---|---|---|
| hurt_light_flinch | 0 | impact | (22.9, 25.4), (34.5, 24.8) | (29.1, 32.1) | 17, 11 | yes | overlay-o-shock-widened |
| hurt_light_flinch | 1 | recoil | (20.6, 25.2), (32.0, 24.2) | (26.9, 31.9) | 16, 12 | yes | base |
| hurt_light_flinch | 2 | recover | (26.0, 25.0), (38.0, 25.0) | (32.0, 32.0) | 14, 11 | yes | base |
| hurt_heavy_knockback | 0 | impact | (25.0, 25.0), (37.0, 25.0) | (31.0, 32.0) | 0, 0 | NO (flash) | base-skipped-unverified-flash |
| hurt_heavy_knockback | 1 | recoil | (15.4, 26.6), (26.7, 24.9) | (22.2, 32.8) | 15, 10 | yes | base |
| hurt_heavy_knockback | 2 | stagger | (17.8, 30.9), (31.2, 30.9) | (24.5, 36.9) | 19, 18 | yes | base |
| hurt_heavy_knockback | 3 | recover | (26.0, 25.0), (38.0, 25.0) | (32.0, 32.0) | 14, 11 | yes | base |
| hurt_status_wobble | 0 | impact | (27.6, 24.3), (39.5, 25.7) | (32.7, 32.0) | 14, 12 | yes | overlay-grimace-dizzy |
| hurt_status_wobble | 1 | recoil | (24.5, 25.7), (36.4, 24.3) | (31.3, 32.0) | 14, 9 | yes | base |
| hurt_status_wobble | 2 | recover | (26.0, 25.0), (38.0, 25.0) | (32.0, 32.0) | 18, 14 | yes | base |
| hurt_near_faint_stagger | 0 | impact | (26.7, 24.4), (38.7, 25.5) | (32.1, 31.9) | 13, 9 | yes | overlay-frown-half |
| hurt_near_faint_stagger | 1 | recoil | (25.7, 30.0), (38.3, 30.0) | (32.0, 36.1) | 11, 6 | yes | base |
| hurt_near_faint_stagger | 2 | stagger | (27.7, 27.3), (39.4, 28.1) | (33.1, 34.1) | 8, 5 | yes | base |
| hurt_near_faint_stagger | 3 | recover | (25.7, 28.3), (38.3, 28.3) | (32.0, 34.6) | 13, 7 | yes | base |

Overlay states used (Dreadtoise anatomy — AMBER iris + DARK pupil, never
white sclera): o-shock mouth + widened eyes; grimace mouth + dizzy X eyes;
frown mouth + half-lid eyes. Dreadtoise keeps its teeth (its own art has
them) — the Mochii no-teeth rule does NOT apply here; it applies to Mochii.

## Honest exception (part of the template, not a flaw to hide)

- Dreadtoise hurt_heavy_knockback's impact frame is a WHITE HIT-FLASH: eye
  anchors are unverifiable through the wash (counts 0, 0), so the overlay is
  SKIPPED and the frame ships as base. That set carries 0ms of overlay; its
  momentary impact read comes from the flash itself. Any future creature
  whose impact frame is a full flash inherits this same skip — do not force
  an overlay through a flash.

## Verification gates (all must pass; see RESTORATION-PROOF.md)

1. Non-overlay cells pixel-IDENTICAL to base cells (0 diff px).
2. Overlay cells: diff confined to face boxes only.
3. GIF: 16 items, overlay visibility 120/0/120/120ms, total durations
   unchanged, last frame of each set +250ms hold (builder behavior).
4. Restoration: rebuild from this package alone reproduces all 14 cells
   pixel-identical, the GIF byte-identical, the preview byte-identical,
   and the manifest dreadtoise_hurts section identical.

## How to reuse this template for another creature

1. Copy this directory; replace `inputs/` with that creature's pilot base
   cells + pilot manifest.
2. Measure that creature's source eye/mouth anchors from its own art and
   its own eye anatomy (never copy Dreadtoise's amber eyes or Mochii's
   black eyes onto another creature; never default to human white sclera).
3. Set the per-set timing mode (impact / persistent / base) from Mars's
   ruling for that creature — timing is per-character, never universal.
4. Run the builder into a fresh dir, run the same four gates, and write a
   new RESTORATION-PROOF.md before claiming the new template saved.

## What is NOT in this package (deliberately)

- v1 articulation files (estimated anchors — the misplacement Mars rejected).
- Non-retimed v2-place files.
- The superseded v2-place Mochii attackpersist GIF.
- Mochii sets (different timing mode + different anatomy — they get their
  own template package when Mars orders it; this package is Dreadtoise
  hurts impact-only ONLY).
