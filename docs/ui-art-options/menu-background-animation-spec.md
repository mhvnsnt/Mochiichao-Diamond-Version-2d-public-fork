# Main menu background animation spec — LOCKED v32 base
Locked placement: v32 (see main-menu-default-locked-v32.md).
Gone point 620, golden line 729, full start 905, bottom 1500.
This spec does NOT move those points. Animation is layered on top.

## Method — NOT hand-tooled, industry standard + game-file method
1. Engine: PixiJS v8 (MIT), already in the game (PixiWorldCanvas /
   PixiBattleCanvas). Use its ticker (delta time), NOT setInterval
   frame-by-frame Pillow drawing, NOT CSS keyframes per symbol.
2. Game-file method: FireRed battle_anim_effects_1.c
   AnimTranslateLinearSingleSineWave — sprite offset = sine table
   * amplitude, applied as x2/y2 on top of base x/y. Same idea in
   Pixi: y = baseY + sin(t * speed + phase) * amplitude.
   Base positions never change; only the sine offset moves.
   That is how the original games bob sprites, waves, and particles.

## Two modes (both use the same sine + fade system, toggle in Settings)
### A. Dance / bob in place (default, calm)
- Each symbol keeps its golden-ratio base position.
- y = baseY + sin(t * 2pi / period + phase) * amplitude
  amplitude 6-12px (small symbols 6, large 12), period 4-6s,
  phase = golden angle * index (so neighbours never sync ugly).
- x = baseX + sin(t * 2pi / period * 0.5 + phase) * 3px (gentle sway)
- Opacity = locked fade at that y: 0 at 620, 109/176 split at 729,
  1.0 at 905+. Bobbing never pushes a symbol above its fade opacity
  for that y — it fades INTO where it is faded at, as Mars said.
- Rotation: +/- 4 degrees sine, slow. No scaling pops, no flashing.

### B. Flow up and disappear (the flowing version)
- Same sine sway, PLUS a slow upward drift: vy = -8 to -14 px/s
  (about 60-90s to cross the whole background zone).
- As y crosses 905 -> 729 -> 620, opacity follows the locked fade:
  1.0 -> 0.35 at 729 -> 0 at 620. Symbol disappears AT the gone
  point, exactly where the fade ends — it does not pop out.
- On reaching 620, respawn at bottom (1500, random x by golden
  angle, new phase, new pastel color from the locked palette).
  Object pool: fixed count (same count as static v32), no allocation
  per frame, no garbage churn — standard particle-system practice.
- Waving while flowing: x sway amplitude grows slightly as y
  rises (3px at bottom -> 8px near gone), so the flow looks like a
  wave, not a straight elevator.

## Rules that keep it from looking ugly / hand-tooled
- Delta-time, not frame count: same speed at 30fps and 120fps.
- Sine easing only (easeInOutSine). No linear, no random jumps.
- Max 1 symbol twinkling per 3-7s (research rule), rest are slow.
- Respect prefers-reduced-motion: freeze to static v32, no drift.
- Symbols are pointer-events none, behind logo/cloud/panels,
  never over button text. Panels stay opaque on top.
- Open-source options if Pixi particles are wanted later:
  pixi-particles (MIT) or GSAP (free) — NOT needed for v1, Pixi
  ticker + sine is enough and already shipped in the game.
