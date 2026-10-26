/**
 * shadowLayer.ts — engine shadow layer for battle + overworld (Mochiichao).
 *
 * RULE (Mars, 2026-10-25): shadows are an ENGINE layer, never part of the
 * character art. Art cells ship shadow-free (see sprite-art/SHADOW-STRIP-REPORT.md);
 * this module computes the separate ellipse the engine draws UNDER the creature.
 *
 * Decomp grounding (full citations: sprite-art/SHADOW-LAYER-RESEARCH.md):
 * - FireRed battle: a separate 32x8 sprite (battle_anim_smokescreen.c,
 *   sOamData_EnemyShadow), created at battler Y + 29 (battle_gfx_sfx_util.c,
 *   LoadAndCreateEnemyShadowSprites), following battler X, shown ONLY when
 *   gEnemyMonElevation[species] != 0 (SetBattlerShadowSpriteCallback), hidden
 *   when the battler is invisible / behind Substitute / animating.
 * - FireRed field: a separate field-effect sprite in size classes S/M/L/XL
 *   (include/constants/event_objects.h), vertical offsets 4/4/4/16
 *   (field_effect_helpers.c, gShadowVerticalOffsets), following the linked
 *   object, REMOVED on tall grass / surfable water / reflective tiles
 *   (UpdateShadowFieldEffect).
 * - HeartGold Pokepic: a separate shadow.png texture (pokepic.c, NARC
 *   otherpoke 259), drawn 64x16 as its own sprite call, gated on
 *   shadow.palSlot != 0 && shadow.size != 0.
 * - Black 2 field: a per-actor shadow task (ov036/fldeff_shadow.c), shared
 *   texture squashed to 0.75 (SHADOW_SCALE), alpha 19/31 (~0.61), positioned
 *   at ground plane + 1 unit, hidden while the actor is hidden, flagged
 *   0x8000, or shadows are disabled.
 *
 * Numbers that are NOT decomp facts are labelled MOCHII below. In particular:
 * no decomp file gives a jump-height shadow-scale formula, so jump scaling
 * here is a Mochiichao extension (linear shrink, floored at 0.5), not a
 * Pokemon rule. FireRed battle's elevated-only behaviour is preserved as
 * mode "firered-elevated-only"; Mochiichao battle defaults to "standard"
 * (a shadow under every battler standing on the ground), because our battle
 * view grounds both sides.
 *
 * This module is pure and deterministic: no Date, no Math.random, no I/O.
 * Renderers (PixiBattleCanvas / PixiWorldCanvas / DOM canvas) take the
 * returned ShadowParams and draw one ellipse; they do NOT read shadow
 * pixels out of character art.
 */

/** Creature shadow class. Assigned per creature in SHADOW_CLASS_OVERRIDES;
 * everything not listed defaults to "grounded". Overrides marked PROVISIONAL
 * are Mochiichao design assignments for the Step 2 / Step 3 lanes to confirm,
 * not decomp facts. */
export type ShadowClass =
  | "grounded"
  | "hover"
  | "flyer"
  | "swimmer"
  | "seated"
  | "static";

/** Footprint size class, FireRed's four classes (SHADOW_SIZE_S/M/L/XL). */
export type ShadowSizeClass = "S" | "M" | "L" | "XL";

export type BattleShadowMode = "standard" | "firered-elevated-only";
export type TerrainKind =
  | "normal"
  | "tallGrass"
  | "water"
  | "reflective"
  | "indoors";

/** Width of the shadow ellipse as a fraction of the creature's display width. */
export const SHADOW_WIDTH_FRACTION: Record<ShadowSizeClass, number> = {
  S: 0.45,
  M: 0.62,
  L: 0.8,
  XL: 0.95,
};

/** Ellipse height / width. FireRed 32x8 and HeartGold 64x16 both give 0.25. */
export const SHADOW_ASPECT = 0.25;

/** Default opacity. Black 2 field shadow: alpha 19/31 = 0.6129. */
export const SHADOW_OPACITY = 19 / 31;

/** Minimum opacity for a high flyer / high jump (MOCHII extension). */
export const SHADOW_MIN_OPACITY = 0.25;

/** Fill colour for the ellipse. Black 2 uses a dark texture at alpha 19;
 * in a 2D canvas/Pixi ellipse this is solid black at SHADOW_OPACITY. */
export const SHADOW_FILL = "#000000";

export interface ShadowInput {
  /** Creature id, e.g. "mochii". Used only for the class/size override lookup. */
  creatureId: string;
  /** Display width of the creature sprite in px (already scaled). */
  spriteWidthPx: number;
  /** Display height of the creature sprite in px (already scaled). */
  spriteHeightPx: number;
  /** X of the creature sprite centre in px. Shadow follows X exactly. */
  spriteCenterXPx: number;
  /** Y of the GROUND line under the creature in px (feet line when grounded). */
  groundYPx: number;
  /** "battle" or "overworld". */
  view: "battle" | "overworld";
  /** Battle shadow mode; ignored in overworld. Default "standard". */
  battleMode?: BattleShadowMode;
  /** Elevation in px (FireRed gEnemyMonElevation analogue): 0 = grounded,
   * > 0 = floating/flying above the ground line. */
  elevationPx?: number;
  /** Current jump height in px (0 when not jumping). MOCHII extension. */
  jumpHeightPx?: number;
  /** Whether the creature sprite itself is currently visible. */
  creatureVisible?: boolean;
  /** Substitute-equivalent active (FireRed hides the shadow behind Substitute). */
  behindSubstitute?: boolean;
  /** Map/zone shadows disabled (Black 2 FldActSys_AreShadowsEnabled false). */
  shadowsEnabled?: boolean;
  /** Overworld terrain under the creature (FireRed field hide rules). */
  terrain?: TerrainKind;
}

export interface ShadowParams {
  visible: boolean;
  /** Centre X of the ellipse (= creature centre X). */
  xPx: number;
  /** Centre Y of the ellipse (= ground line, never the creature's Y). */
  yPx: number;
  /** Horizontal radius in px. */
  rxPx: number;
  /** Vertical radius in px. */
  ryPx: number;
  /** Opacity 0..1. */
  opacity: number;
  /** Why the shadow is hidden, when visible is false ("" when visible). */
  hiddenReason: string;
}

/** PROVISIONAL Mochiichao assignments (Step 2 / Step 3 lanes to confirm).
 * Every other creature defaults to grounded / M. */
export const SHADOW_CLASS_OVERRIDES: Record<string, { cls: ShadowClass; size: ShadowSizeClass }> = {
  aerobeak: { cls: "flyer", size: "M" },
  floatcalf: { cls: "hover", size: "M" },
  wispkin: { cls: "hover", size: "S" },
  zephling: { cls: "flyer", size: "S" },
  aquariios: { cls: "swimmer", size: "L" },
  // Megalochrome: levitator, NO legs ever. See SHADOW-LAYER-SPEC.md §8 for
  // the shadow-vs-ripples verdict: hover class here (so elevation shrink /
  // fade applies), but on water terrain the shadow is HIDDEN by the
  // terrain rule and blue ripple rings are the grounding instead.
  megalochrome: { cls: "hover", size: "L" },
};

export function shadowClassFor(creatureId: string): { cls: ShadowClass; size: ShadowSizeClass } {
  return SHADOW_CLASS_OVERRIDES[creatureId] ?? { cls: "grounded", size: "M" };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Compute the engine shadow for one creature in one frame.
 * The shadow NEVER follows the creature's Y: it stays on the ground line
 * (FireRed battle: battler Y + 29 constant offset; Black 2 field: ground + 1).
 * Height above ground only shrinks/fades it.
 */
export function computeShadow(input: ShadowInput): ShadowParams {
  const hidden = (reason: string): ShadowParams => ({
    visible: false, xPx: input.spriteCenterXPx, yPx: input.groundYPx,
    rxPx: 0, ryPx: 0, opacity: 0, hiddenReason: reason,
  });
  if (input.creatureVisible === false) return hidden("creature-hidden");
  if (input.behindSubstitute) return hidden("behind-substitute");
  if (input.shadowsEnabled === false) return hidden("shadows-disabled");

  const { cls, size } = shadowClassFor(input.creatureId);
  const elevation = Math.max(0, input.elevationPx ?? 0);
  const jump = Math.max(0, input.jumpHeightPx ?? 0);
  const heightAboveGround = elevation + jump;

  if (input.view === "battle") {
    const mode = input.battleMode ?? "standard";
    // FireRed rule, preserved as a mode: elevated-only battle shadows.
    if (mode === "firered-elevated-only" && elevation === 0 && jump === 0) {
      return hidden("firered-elevated-only-grounded");
    }
  } else {
    // FireRed field rule: no shadow on tall grass, surfable water, reflective tiles.
    if (input.terrain === "tallGrass") return hidden("tall-grass");
    if (input.terrain === "water") return hidden("surfable-water");
    if (input.terrain === "reflective") return hidden("reflective-tile");
  }

  const baseRx = (input.spriteWidthPx * SHADOW_WIDTH_FRACTION[size]) / 2;
  // Height above ground shrinks + fades the shadow (MOCHII extension:
  // linear shrink, floored so a high flyer never vanishes entirely).
  // Grounded / seated / static creatures never shrink.
  let scale = 1;
  if ((cls === "hover" || cls === "flyer") && heightAboveGround > 0) {
    scale = clamp(1 / (1 + heightAboveGround / 100), 0.5, 1);
  } else if (jump > 0) {
    scale = clamp(1 - jump / (input.spriteHeightPx * 2), 0.5, 1);
  }
  const rx = baseRx * scale;
  const ry = rx * SHADOW_ASPECT;
  const opacity = Math.max(SHADOW_MIN_OPACITY, SHADOW_OPACITY * scale);

  return {
    visible: true,
    xPx: input.spriteCenterXPx,
    // Ground line, plus a 1-px lift so the ellipse never z-fights the floor
    // (Black 2: pos.y += FX32_ONE).
    yPx: input.groundYPx + 1,
    rxPx: rx,
    ryPx: ry,
    opacity,
    hiddenReason: "",
  };
}

/**
 * Canvas painter (DOM 2D context). Pixi lanes can use the same params with
 * PIXI.Graphics.drawEllipse; this helper keeps the module renderer-agnostic.
 * Draw order contract: call this BEFORE drawing the creature sprite, so the
 * shadow sits under the creature and above the ground.
 */
export function paintShadowEllipse(
  ctx: { beginPath(): void; ellipse(x: number, y: number, rx: number, ry: number, rot: number, a0: number, a1: number): void; fillStyle: string | CanvasGradient | CanvasPattern; globalAlpha: number; fill(): void },
  params: ShadowParams,
): void {
  if (!params.visible) return;
  ctx.beginPath();
  ctx.ellipse(params.xPx, params.yPx, params.rxPx, params.ryPx, 0, 0, Math.PI * 2);
  ctx.fillStyle = SHADOW_FILL;
  ctx.globalAlpha = params.opacity;
  ctx.fill();
  ctx.globalAlpha = 1;
}
