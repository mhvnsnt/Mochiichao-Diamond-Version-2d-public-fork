# VERIFICATION — articulation v3 retime (retime20261026)

Mars rulings implemented (2026-10-26):
- ~09:13 CDT, Dreadtoise hurts v2: PLACEMENT APPROVED + IMPACT-MOMENTARY RULE
  (faces show ONLY momentarily at connection/impact, not before/after).
- ~09:14 CDT, Mochii attacks v2: MOCHII HAS NO TEETH (redo open-bite teeth
  overlays toothless); squiggly mouth + lowered eyes APPROVED ("really good").
- ~09:15 CDT, Mochii attacks v2: TIMING IS PER-CHARACTER / PER-SET — Mochii
  attacks keep the LONGER overlay duration (persistent through the phase);
  never retime a mode-B set down to impact-only.

## Timing modes (named parameters in build_v3_impact.py)

- Mode A `impact` (Dreadtoise hurts): overlay ONLY on the impact-role frame.
  GIF flash capped at IMPACT_FLASH_MS=120ms: if the impact beat lasts longer,
  the GIF shows the overlay for 120ms then the BASE face for the remainder —
  total set duration unchanged, overlay visibility <= 150ms.
- Mode B `persistent` (Mochii attacks): overlay through the whole phase.
- Mode `base` (Mochii hurts): no overlays — face-change detection says his
  hurt face already changes on its own (hurt-face -> recover front-face).

## Frame-diff gate: PASS (verify_v3_impact.py, 2026-10-26)

- Non-overlay cells: pixel-IDENTICAL to pilot base cells (0 diff px).
- Overlay cells: diff confined to face boxes only (eye anchors +/-9px,
  mouth anchor +/-11px); no body/background pixel changed.
- Mochii teeth check: ZERO new pure-white pixels inside the mouth box
  (excluding eye boxes) on any Mochii overlay cell. An earlier naive check
  flagged eye-highlight dots overlapping the mouth box; the corrected check
  excludes eye boxes and passes — the flagged pixels were eye highlights,
  not teeth, and the builder draws no teeth on Mochii by construction
  (`teeth = creature != 'mochii'`).
- Overlay visibility per set (from manifest):
  - Dreadtoise hurts: flinch 120ms, knockback 0ms, wobble 120ms, stagger 120ms.
  - Mochii hurts: 0ms all sets (base art).
  - Mochii attacks: 790 / 860 / 1080 / 1160ms (full phase, Mode B as approved).

## Honest exception (not hidden)

- Dreadtoise hurt_heavy_knockback impact frame is a WHITE HIT-FLASH: eye
  anchors unverifiable through the wash, so the overlay is SKIPPED and the
  frame ships as base. That set therefore carries 0ms of overlay; its
  momentary impact read comes from the flash itself. This matches the v2
  verification gate Mars already approved, and the frame-diff gate confirms
  the frame is base-identical.

## Enlarged eye-check: PASS (impact_before_after_4x.png)

Left = base, right = retimed, impact frames only, 4x:
- Dreadtoise flinch: o-shock mouth + widened amber eyes on the face.
- Dreadtoise knockback: identical (flash skip, as documented).
- Dreadtoise wobble: dizzy X eyes + grimace mouth on the face.
- Dreadtoise stagger: half-lid eyes + frown mouth on the face.
- Mochii body_slam: open TOOTHLESS red mouth + black/white-inside eyes.
- Mochii aqua_shot: grin arc (no teeth) + glance eyes.
- Mochii aqua_cannon: open TOOTHLESS mouth + widened eyes.
- Mochii hydro_surge: squiggly grimace mouth + lowered (half) eyes.

## Files

- 50 retimed cells (dreadtoise 14, mochii 36 = 14 hurts + 22 attacks).
- 3 GIFs + 3 previews + manifest + this verification + builder + verifier.
- NOT shipped: v1 articulation files, non-retimed v2-place files. No file
  Mars has seen was overwritten; all retimed files carry retime20261026.
