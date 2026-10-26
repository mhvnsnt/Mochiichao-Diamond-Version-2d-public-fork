# SHADOW LAYER SPEC (Mochiichao) — engine layer only

## 1. The rule

Shadow is an ENGINE layer. Art cells ship SHADOW-FREE. The engine draws one
shared ellipse under the creature at runtime. No character art file may
contain a baked ground shadow; the strip passes
(sprite-art/SHADOW-STRIP-REPORT.md) remove baked shadows, and this
module (`src/lib/shadowLayer.ts`, `computeShadow`) is the only place a
shadow is computed.

Decomp proof: sprite-art/SHADOW-LAYER-RESEARCH.md — FireRed battle +
field, HeartGold Pokepic, Black 2 field task, all separate objects.

## 2. Parameters (decomp-grounded unless marked MOCHII)

| Parameter | Value | Source |
|---|---|---|
| Shape | Ellipse, height/width = 0.25 | FireRed 32x8, HeartGold 64x16 |
| Default opacity | 0.6129 (19/31) | Black 2 fldeff_shadow.c alpha 19 |
| Minimum opacity (high flyer/jump) | 0.25 | MOCHII extension |
| Field squash | 0.75 axis squash in 3D | Black 2 SHADOW_SCALE (2D ellipse aspect covers this) |
| Ground lift | +1 px above ground line | Black 2 pos.y += FX32_ONE |
| Battle offset (FireRed) | battler Y + 29 at FireRed scale | battle_gfx_sfx_util.c |
| Size classes | S 0.45 / M 0.62 / L 0.80 / XL 0.95 of sprite width | FireRed SHADOW_SIZE_S/M/L/XL (fractions MOCHII) |
| Field vertical offsets | S/M/L 4, XL 16 (at FireRed scale) | field_effect_helpers.c |

## 3. Per-class behaviour

| Class | Ground shadow | When hidden | Height effect |
|---|---|---|---|
| grounded | Full size, full opacity | hidden creature / substitute / disabled / grass / water / reflective (overworld) | Jump only: shrink to min 0.5, fade to min 0.25, Y stays on ground |
| hover | Full size at rest | Same as grounded | Elevation/jump shrink: scale = 1/(1+h/100), floored 0.5; opacity fades with scale, floored 0.25 |
| flyer | Shrunk + faded by elevation | Same as grounded | Same shrink formula as hover |
| swimmer | Battle: visible (water arena). Overworld: hidden on water terrain (FireRed surfable rule); visible on land | Same as grounded | Jump shrink only |
| seated | Full size, never shrinks except jump | Same as grounded | Jump shrink only |
| static (crystal etc.) | Full size, never moves | Same as grounded | Jump shrink only (a static object should not jump; the rule exists for safety, not for use) |

Battle modes: `standard` (default in Mochiichao battle — every battler on
the ground gets a shadow) and `firered-elevated-only` (FireRed's actual
rule: shadow ONLY when elevation > 0; grounded battlers get none).
The Step 2 battle lane picks the mode per view and records it; do not
silently mix modes in one view.

## 4. API for the Step 2 (battle) and Step 3 (overworld) lanes

```ts
import { computeShadow, paintShadowEllipse, shadowClassFor } from "../lib/shadowLayer";
// per frame, per creature:
const s = computeShadow({
  creatureId, spriteWidthPx, spriteHeightPx,
  spriteCenterXPx, groundYPx,
  view: "battle" | "overworld",
  battleMode: "standard",        // battle only
  elevationPx, jumpHeightPx,
  creatureVisible, behindSubstitute, shadowsEnabled,
  terrain,                        // overworld only
});
if (s.visible) {
  // Draw FIRST (under the creature, above the ground):
  paintShadowEllipse(ctx, s);    // DOM canvas, or:
  // graphics.drawEllipse(s.xPx, s.yPx, s.rxPx, s.ryPx) with alpha s.opacity  // Pixi
}
```

Draw-order contract: ground -> shadow ellipse -> creature sprite.
Never draw the shadow from art pixels. Never edit BattleView/WorldEngine
from this lane — this spec + module is the handoff; the owning lanes wire
it in (see §6).

## 5. Class assignments (PROVISIONAL — owning lanes confirm)

`shadowClassFor()` defaults every creature to grounded/M. Provisional
overrides in the module: aerobeak flyer/M, floatcalf hover/M, wispkin
hover/S, zephling flyer/S, aquariios swimmer/L, megalochrome hover/L
(see §8 for Megalochrome). These are Mochiichao design assignments, NOT
decomp facts. If a lane reassigns a creature, it edits
SHADOW_CLASS_OVERRIDES and notes the change in this spec — it does not
fork the module.

## 6. Handoff (no duplication, no clobbering)

- Battle integration (Step 2 lane): owns BattleView / PixiBattleCanvas.
  This lane delivers `src/lib/shadowLayer.ts` + this spec + tests; it does
  NOT edit battle files.
- Overworld integration (Step 3 lane): owns WorldEngine / PixiWorldCanvas.
  Same delivery; it does NOT edit world files.
- If either lane finds the API insufficient, it files the gap against
  this spec (function + case + numbers) instead of writing a second
  shadow implementation.

## 7. Note on the brief's filename

The brief named the module `shadowLayer.js`. The repo's `src/lib/` is
entirely TypeScript, so the module is delivered as `shadowLayer.ts`
(same API, type-checked with `tsc --strict`, tested with tsx). Renaming
to .js would drop the repo's type checking for no benefit; if the parent
still wants a .js filename, that is a one-line rename, not a rewrite.

## 8. Megalochrome verdict — shadow vs ripples (conflict checked from files, 2026-10-25)

Two Mars statements are in tension, and both are recorded here verbatim
in substance, neither silently dropped:
- 21:55 locked: "Megalochrome needs an engine shadow underneath (it gets
  NO legs — do not add legs anywhere; the shadow is the grounding)."
- 22:15 idle-audit correction (sprite-art/animation/idle/megalochrome/
  megalochrome.idle.reconciled-20261025.json line 77, and
  sprite-art/CHECKPOINT-IDLE-RECONCILIATION.md line 21): "already HAS
  water (blue ripple rings in idle), so no shadow/water owed" — and the
  same JSON line also says "Levitator (Mars-locked: no legs, engine
  shadow underneath, never legs)."

File evidence (look, don't assume):
- `sprite-art/animation/idle/megalochrome/idle_a.png`: chrome levitator
  with NO legs, floating above concentric BLUE RIPPLE RINGS at the
  bottom. No dark shadow ellipse in the art.
- `sprite-art/game-ready/megalochrome/cells/megalochrome_cell_00.png`:
  same creature inside a blue ring. No dark shadow ellipse, no legs.
- `sprite-art/animation/ripple/megalochromeRipple.js`: an ENGINE ripple
  module already exists (expanding rings, Step 4 VFX hookup) — ripples
  are an engine layer too, not only baked art.
- Decomp rule (SHADOW-LAYER-RESEARCH.md §2): FireRed field shadows are
  REMOVED on surfable water. A dark ground shadow under a creature that
  floats on water contradicts Pokemon's own rule.

VERDICT (terrain-gated, implemented in shadowLayer.ts):
- On WATER terrain (overworld, and any battle arena flagged water):
  NO dark engine shadow — `computeShadow` returns hidden
  ("surfable-water") and the blue ripple rings are the grounding.
  Drawing a dark ellipse under blue rings would double-ground the
  creature and contradict both the art and the FireRed water rule.
- On DRY ground / dry battle ground: the engine shadow APPLIES
  (hover class, shrunk/faded by elevation). This preserves the 21:55
  locked item exactly where it does not contradict the files.
- NO legs are added anywhere, in any view. Megalochrome's grounding is
  shadow-or-ripples, never legs. Its art was verified legless and left
  untouched by this lane.
- RESIDUAL QUESTION staged for Mars (show-first, does NOT block wiring
  or this PR — the terrain gate makes the behaviour switchable per
  arena): if Mars wants ripples EVERYWHERE including dry battle ground
  (i.e. the 22:15 "no shadow owed" read literally, superseding 21:55),
  the Step 2 lane passes shadowsEnabled=false for Megalochrome and the
  ripple module draws instead. Parent: show Mars idle_a.png +
  cell_00.png and ask that one question; do not change the gate until
  he answers. The contrast case is Finblade (same audit: "needs shadow /
  has NO water") — Finblade gets a shadow precisely because it has no
  water, which is why Megalochrome's water case is different.

## 9. Confirmation items (staged, not blocking)

- Mechapion hurt candidate (27 sparse px) is HELD for Mars to look at
  first: proof at `sprite-art/_shadow_work/mechapion_hurt_proof.png`.
  It is NOT part of this module or spec, and it does not block wiring:
  grounded/M default + engine shadow apply to Mechapion regardless.
- Megalochrome residual question (§8): staged, same rule.
- Ashemit rembg: run and REJECTED (flame tail eaten) — see
  sprite-art/ASHEMIT-REMBG-REPORT.md. No rembg file ships; originals kept.
