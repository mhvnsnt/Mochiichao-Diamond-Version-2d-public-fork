/**
 * combatAiming.ts — Phase 3 combat aiming + camera presets (NEW, 2026-10-26).
 *
 * The FireRed aiming model, as inventoried from the decomp code on disk
 * (battle_anim_mons.c battler anchors + battle_anim_utility_funcs.c
 * side-mirroring), with Black 2's battler tables for the 3D anchor set:
 *
 *   origin    = sideAnchor + sideSign x scriptOffset
 *   direction = targetAnchor - origin
 *
 * sideSign: player +1, foe -1. A script offset is written in
 * attacker-facing space (positive = toward the target), so the foe's
 * offset is negated on screen — that negation is the whole reason an
 * opponent attack travels TOWARD the player side instead of mirroring
 * the player's up-right angle. Pokemon does NOT hardcode 45 degrees:
 * the FireRed single-battle anchors give player->foe atan2(-40, 104)
 * = about -21 degrees (up-right, y down), foe->player about 159 degrees
 * (down-left, toward the player side). The 45-degree cell rendering is
 * Mars's rule on top of this direction, owned by the VFX/aimfix pass,
 * not by this module.
 *
 * ORIGIN / ANGLE TABLE PATH (the sibling origin/angle worker's table
 * lands here; this module defines the contract it must satisfy):
 *   src/lib/generated/combatOriginAngleTable.json
 * Until per-move body-part offsets exist, every entry carries offset
 * [0, 0] — battler-centre origin, exactly what the inventory proved:
 * no generation on disk has a per-move mouth/hand/cannon table, and
 * this module invents none. A missing entry falls back to centre too,
 * never to a guessed body part. The staged v1 table (36 game moves,
 * centre offsets) is verified against these anchors by
 * combatPhase3.test.ts.
 *
 * Camera: battles are turn-based core with XD/Colosseum-style camera
 * LANGUAGE (wide establishing shot, attacker close-up on windup,
 * impact shake, return to wide). The live canvas is Pixi 2D, not a 3D
 * engine, so these presets are a framing vocabulary, not a 3D camera:
 * PixiBattleCanvas already implements them through battleTreatments
 * sampling (attacker cameraZoom on windup, sampled shake on impact).
 * This module names the presets so a future 3D canvas can consume the
 * same phase vocabulary without re-deriving it.
 *
 * This module is pure: no imports, no DOM, no game state. PixiBattleCanvas
 * imports it (the live direction wiring); combatPhase3.ts documents the
 * full seven-system chain around it.
 */

export type CombatSide = "player" | "foe";
/** PixiBattleCanvas side spelling; "enemy" is the canvas word for "foe". */
export type PixiSide = "player" | "enemy";

export function pixiSideToCombatSide(side: PixiSide): CombatSide {
  return side === "enemy" ? "foe" : "player";
}

export function otherSide(side: CombatSide): CombatSide {
  return side === "player" ? "foe" : "player";
}

/**
 * Side sign for the aiming model. Player +1, foe -1: the foe's script
 * offset is negated, so a foe's projectile/burst travels toward the
 * player side (negative screen-x in both anchor systems below).
 */
export function sideSign(side: CombatSide): 1 | -1 {
  return side === "player" ? 1 : -1;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

/** FireRed single-battle battler coords, 240x160, y down (sBattlerCoords). */
export const FIRE_RED_ANCHORS: Record<CombatSide, Point2D> = Object.freeze({
  player: Object.freeze({ x: 72, y: 80 }),
  foe: Object.freeze({ x: 176, y: 40 }),
});

/**
 * Pixi canvas battler fractions, taken from PixiBattleCanvas.place():
 * player lower-left (0.22w, 0.78h), foe upper-right (0.78w, 0.42h).
 * Same layout as FireRed, so the same up-right / down-left directions
 * hold on canvas.
 */
export const PIXI_ANCHOR_FRACTIONS: Record<CombatSide, Point2D> = Object.freeze({
  player: Object.freeze({ x: 0.22, y: 0.78 }),
  foe: Object.freeze({ x: 0.78, y: 0.42 }),
});

/**
 * Black 2 single-battle battler position/scale table (btlv_mcss.c):
 * player (0.5, 0.4, 7.0), foe (0.3, 0.4, -10.0). Front/back parity
 * (even = back/near, odd = front/far) is a doubles-slot rule and does
 * not change these singles anchors.
 */
export const BLACK2_ANCHORS: Record<CombatSide, Point3D> = Object.freeze({
  player: Object.freeze({ x: 0.5, y: 0.4, z: 7.0 }),
  foe: Object.freeze({ x: 0.3, y: 0.4, z: -10.0 }),
});

/** Path (repo-relative) of the origin/angle table this wiring reads from. */
export const ORIGIN_ANGLE_TABLE_PATH =
  "src/lib/generated/combatOriginAngleTable.json";

/** One row of the origin/angle table: per-move script offset, centre by default. */
export interface OriginAngleEntry {
  moveId: string;
  /** Script offset in attacker-facing space; [0, 0] = battler centre. */
  offset: [number, number];
  /** Optional authored note; never a body-part claim unless the table says so. */
  note?: string;
}

export interface OriginAngleTable {
  version: string;
  model: string;
  tablePath: string;
  anchors: {
    fireRed: Record<CombatSide, Point2D>;
    pixiFractions: Record<CombatSide, Point2D>;
    black2: Record<CombatSide, Point3D>;
  };
  entries: Record<string, OriginAngleEntry>;
}

/** Table lookup with a centre fallback: unknown move = battler centre, never a guess. */
export function tableOffsetFor(
  table: OriginAngleTable | null | undefined,
  moveId: string | undefined,
): [number, number] {
  if (!table || !moveId) return [0, 0];
  const entry = table.entries[moveId];
  if (!entry || !Array.isArray(entry.offset) || entry.offset.length !== 2) return [0, 0];
  const [x, y] = entry.offset;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [0, 0];
  return [x, y];
}

export interface Aim {
  attacker: CombatSide;
  /** origin = sideAnchor + sideSign x scriptOffset (FireRed model). */
  origin: Point2D;
  target: Point2D;
  /** direction = target - origin, in screen coords (y down). */
  vector: Point2D;
  length: number;
  /** atan2(dy, dx) in degrees, screen coords (y down). */
  angleDeg: number;
  /** Treatments direction sign: +1 rightward hit, -1 leftward hit. */
  directionSign: 1 | -1;
  /** True exactly when the attacker is the foe: the hit travels toward the player side. */
  towardPlayerSide: boolean;
}

function buildAim(
  attacker: CombatSide,
  origin: Point2D,
  target: Point2D,
): Aim {
  const vector = { x: target.x - origin.x, y: target.y - origin.y };
  const length = Math.hypot(vector.x, vector.y);
  return {
    attacker,
    origin,
    target,
    vector,
    length,
    angleDeg: (Math.atan2(vector.y, vector.x) * 180) / Math.PI,
    directionSign: vector.x < 0 ? -1 : 1,
    towardPlayerSide: attacker === "foe" && vector.x < 0,
  };
}

/** Aim from the FireRed 2D anchors + a script offset (attacker-facing space). */
export function aimFromFireRedAnchors(
  attacker: CombatSide,
  offset: [number, number] = [0, 0],
): Aim {
  const sign = sideSign(attacker);
  const anchor = FIRE_RED_ANCHORS[attacker];
  const origin = { x: anchor.x + sign * offset[0], y: anchor.y + sign * offset[1] };
  return buildAim(attacker, origin, FIRE_RED_ANCHORS[otherSide(attacker)]);
}

/** Aim from live Pixi canvas bases + a script offset (attacker-facing space). */
export function aimForCanvasAttack(
  attacker: CombatSide,
  attackerBase: Point2D,
  targetBase: Point2D,
  offset: [number, number] = [0, 0],
): Aim {
  const sign = sideSign(attacker);
  const origin = {
    x: attackerBase.x + sign * offset[0],
    y: attackerBase.y + sign * offset[1],
  };
  return buildAim(attacker, origin, targetBase);
}

// ---------------------------------------------------------------------------
// Camera presets (framing vocabulary; Pixi implements them via treatments)
// ---------------------------------------------------------------------------

export type CameraPhase = "wide" | "windup" | "travel" | "impact" | "recover";

export interface CameraPreset {
  phase: CameraPhase;
  /** What the camera frames: the whole arena, the attacker, or the target. */
  focus: "wide" | "attacker" | "target";
  /** Whether the impact shake runs during this phase. */
  shake: boolean;
  note: string;
}

export const CAMERA_PRESETS: Record<CameraPhase, CameraPreset> = Object.freeze({
  wide: Object.freeze({
    phase: "wide" as const,
    focus: "wide" as const,
    shake: false,
    note: "Establishing shot: both battlers on screen, XD/Colosseum-style wide frame.",
  }),
  windup: Object.freeze({
    phase: "windup" as const,
    focus: "attacker" as const,
    shake: false,
    note: "Attacker close-up (treatments cameraZoom on the attacker, 250 ms windup).",
  }),
  travel: Object.freeze({
    phase: "travel" as const,
    focus: "attacker" as const,
    shake: false,
    note: "Zoom held at its windup-end value while the lunge/projectile travels.",
  }),
  impact: Object.freeze({
    phase: "impact" as const,
    focus: "target" as const,
    shake: true,
    note: "Impact frame: sampled treatments shake + flash on the target, HP drains at hold end.",
  }),
  recover: Object.freeze({
    phase: "recover" as const,
    focus: "wide" as const,
    shake: false,
    note: "Return to wide as the attacker recovers to base.",
  }),
});

export function cameraPresetForPhase(phase: CameraPhase): CameraPreset {
  return CAMERA_PRESETS[phase];
}

/** Pixi timeline phase -> camera preset (the mapping PixiBattleCanvas follows). */
export function cameraPresetForPixiTime(tMs: number): CameraPreset {
  if (tMs < 250) return CAMERA_PRESETS.windup;
  if (tMs < 700) return CAMERA_PRESETS.travel;
  if (tMs < 1090) return CAMERA_PRESETS.impact;
  return CAMERA_PRESETS.recover;
}
