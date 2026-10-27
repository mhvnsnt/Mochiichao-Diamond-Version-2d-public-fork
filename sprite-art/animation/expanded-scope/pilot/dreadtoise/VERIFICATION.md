# STEP 3 PILOT VERIFICATION — Dreadtoise (2026-10-26, local staging only, NOT PR'd)

Eye-checked: every set at 64px native (twin-barrage cell viewed native) and
enlarged (preview_attacks_4x.png / preview_hurts_4x.png, 128px/cell). All 36
cells are 64x64 RGBA. Method: transforms of existing cells + procedural PIL
VFX only; 0 image generations used. Sources: battle_front dreadtoise_cell_00,
walk dreadtoise_cell_06. Canon: Dreadtoise v2 = animal body with cannons,
2 in every view (NOT superseded mechanical v1); every cell keeps the full
body in frame so no crop ever removes a cannon — verified in all previews.

## What reads
- atk_physical_shell_ram (5, 830 ms): brace -> walk-cell charge step +
  speedlines -> stretched ram lunge -> impact burst -> recover. Reads.
- atk_special_water_gun (5, 840 ms): BOTH cannon tips glow -> dark-outlined
  jet streaming right from the right cannon -> jet to frame edge -> splash
  impact -> recover. Muzzle flashes sit on the cannon tips (v1 put them on
  the face; fixed before delivery). Reads.
- atk_signature_twin_cannon_barrage (6, 960 ms): both tips charge-flash ->
  upper stream -> lower stream -> TWIN streams together -> barrage impact
  burst -> recover. Twin streams read clearly even at native 64px.
- atk_heavy_fortress_slam_finisher (6, 1,120 ms): rear up -> squash slam +
  dust -> shockwave ring + burst -> wider ring + dust -> settling -> slow
  recover. Ring reads as a ground shockwave. Reads.
- hurt_light_flinch (3, 520 ms): tilt back, further tilt, recover. Reads.
- hurt_heavy_knockback (4, 700 ms): white hit-flash -> tilted knockback +
  speedlines -> low skid + dust -> recover. Reads.
- hurt_status_wobble (3, 740 ms): left/right tilt + bubbles + green-tinted
  settle. Bubbles subtle at 64px; tilt + tint carry it.
- hurt_near_faint_stagger (4, 1,180 ms): droop lean -> darkened droop ->
  sway + dizzy stars -> dim barely-standing pose. Reads.

## What does NOT fully read / limits (honest)
- Dreadtoise hurts are based on battle_front, NOT on the existing
  dreadtoise_hurt_cell_00: that cell is a SIDE-angle pose, and the v1 pilot
  proved it breaks front-battle continuity (angle jumps every cell, then
  snaps back to front on recover). Hurt therefore reads via tilt / flash /
  darken / dizzy stars, NOT via a closed-eye hurt face. A front-angle hurt
  face is the one Dreadtoise polish item owed (would need a new drawing;
  not generated here, transforms-only per pilot brief).
- Twin streams are drawn in front of the body (left cannon's stream crosses
  the body to reach the right) — standard 2D battle-art shorthand, but it is
  a shorthand, not a physically traced trajectory.
- First internal build (v1, never shown to Mars) had muzzle flashes on the
  face and jets buried in the body; rebuilt in place before delivery with
  corrected cannon-tip coordinates (left tip ~28,95; right tip ~232,95 in
  256px work coords) and dark-outlined jets.

## Totals
8 sets, 36 cells. Attacks 22 cells / 3,750 ms; hurts 14 cells / 3,140 ms.
Manifest: dreadtoise.pilot-manifest.json (per-cell source + transform + timing).
No files outside animation/expanded-scope/pilot/dreadtoise/ were written.
