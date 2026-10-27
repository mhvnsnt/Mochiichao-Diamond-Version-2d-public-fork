# KITTEMBER ILLUMINATION CYCLE — staging note (2026-10-26)

Mars ruling (2026-10-26 ~10:14 CDT): BOTH existing candidates are good as
animation frames, not a single pick. Clean (no glow) = glow-off frame,
clean-glow = glow-on frame, plus a THIRD stronger-glow frame so the cycle
phases in and out subtly. Staged only — NOT shipped, NOT wired into game
code, NO repo edits until Mars sees the cycle and says how it ships.

## Frames (all 287x304, same shipped #84 clean figure + restored bubbles)
- A — kittember-bubbles-clean-20261026.png (glow-off, existing)
- B — kittember-bubbles-clean-glow-20261026.png (glow-on, existing;
  radius 72, peak alpha 0.55, colour RGB 253,213,168, underneath figure)
- C — kittember-bubbles-clean-glow-strong-20261026.png (NEW, this task)

## Frame C method (program-generated, no sheet background added back)
- Base figure = frame A, untouched on top. Glow drawn UNDERNEATH only.
- Radial gradient, centre (245,125) at the orb, colour RGB 253,213,168
  (same sampled family as B), radius 105 (B: 72), peak alpha 0.80
  (B: 0.55), linear falloff.
- Orb-zone mask with 25px feathered edges: glow confined to x>=180
  (nothing on the whisker side), y 40..200 (nothing below tail/feet).
  First pass used a hard mask and showed a visible rectangular edge on
  black — rejected on eye-check, rebuilt with the feathered mask.
- iter10 (sheet-background-add-back) approach NOT used; iter10 stays
  rejected. Shipped #84 cutout and frames A/B untouched (no overwrites).

## Verification counts (metric: alpha>0 and min(RGB)>=240)
- Near-white: A = 71, B = 57, C = 69 (near shipped's ~60; glow colour
  is peach, no white added).
- Figure identity: C vs A on fully-opaque figure pixels = 0 changed px.
  Frame C changes ONLY the glow layer.
- C glow-only px = 8,044, bbox x181-286, y41-199; max visible glow
  alpha = 156 (0.61) vs B's visible max 77 — stronger, as ordered.
- Glow-free zones: 0 new px with x<180, 0 new px with y>200.

## Cycle
- kittember-illumination-cycle-20261026.gif — frames A -> B -> C -> B -> A,
  500ms per frame, 2,500ms per loop, loops forever.
- kittember-illumination-cycle-20261026-strip-onblack.png — all 5 frames
  side by side on black for eye-check.
- Eye-check: C on black + dark ground PASS (soft halo, no hard edge,
  figure/bubbles/whiskers unchanged); strip PASS (phasing reads
  off -> on -> stronger -> on -> off).
- Timings are a proposal in this note only — game wiring (if Mars wants
  it in-game) is a separate step, not done here.
