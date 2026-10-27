# STEP 3 PILOT VERIFICATION — Mochii (2026-10-26, local staging only, NOT PR'd)

Eye-checked: every set at 64px native (2 key cells viewed native) and enlarged
(preview_attacks_4x.png / preview_hurts_4x.png, 128px/cell). All 36 cells are
64x64 RGBA. Method: transforms of existing cells + procedural PIL VFX only;
0 image generations used. Sources: battle_front mochii_cell_00, hurt
mochii_hurt_cell_00, walk mochii_cell_08. Canon: blue droplet slime; hurt =
arms folded to front, hands together (NOT an ambiguous oval arm).

## What reads
- atk_physical_body_slam (5, 790 ms): squash -> lean -> stretched lunge ->
  impact squash + starburst -> recover. Reads clearly.
- atk_special_aqua_shot (5, 860 ms): gather -> aim -> dark-outlined water jet
  protruding right to the frame edge -> splash head -> recover. Jet reads at
  enlarged size clearly; at native 64px it is a short blue spike (~8 px) —
  in-game code travel (as with existing attack treatments) would extend it.
- atk_signature_aqua_cannon (6, 1,080 ms): hands-together ready -> tall charge
  with orbiting droplets -> blast + muzzle flash -> full blast + splash burst
  -> splash impact -> recover. Reads as the bigger, heavier water move.
- atk_heavy_hydro_surge_finisher (6, 1,160 ms): deep crouch -> rise -> surge
  wave (blue scallop line under body) + jet -> crash + burst -> settling
  droplets -> slow recover. Wave reads enlarged; at 64px it is a thin line.
- hurt_light_flinch (3, 520 ms): hurt cell (eyes shut, folded arms) tilted
  back, pushed further, recover. Reads.
- hurt_heavy_knockback (4, 700 ms): white hit-flash (80 ms, intentionally
  pale) -> tilted knockback + speedlines -> low skid + dust -> recover. Reads.
- hurt_status_wobble (3, 740 ms): left/right tilt + green status bubbles +
  green-tinted settle. Bubbles are subtle at 64px; the tilt carries it.
- hurt_near_faint_stagger (4, 1,180 ms): lean -> droop + darkened -> sway +
  dizzy stars -> dim barely-standing pose. Reads.

## What does NOT fully read / limits (honest)
- Signature vs special differ by VFX (jet thickness, muzzle flash, splash
  burst), NOT by body pose: no new hands-together blast pose was drawn —
  transforms cannot invent one. A redrawn hands-together blast pose is the
  one Mochii polish item owed if Mars wants pose-level distinction.
- Jets/wave are VFX overlays on the same body; at native 64px they are
  small. They are pilot-grade, not final VFX art.
- First internal build (v1, never shown to Mars) had jets buried inside the
  body and was rebuilt in place before delivery: body shifted left on
  projectile cells, jets dark-outlined and extended to the frame edge.

## Totals
8 sets, 36 cells. Attacks 22 cells / 3,890 ms; hurts 14 cells / 3,140 ms.
Manifest: mochii.pilot-manifest.json (per-cell source + transform + timing).
No files outside animation/expanded-scope/pilot/mochii/ were written.
