// Opponent VFX code-true origin + angle table — GAME-USABLE (not reference-only).
//
// TABLE FIRST, NO ART FLIPS. This module is the table Mars ordered 2026-10-26
// 20:26 CDT: every opponent-side attack must come toward the player side at
// the code's angle AND from its correct origin (mouth/hand/cannon/whatever).
// A plain horizontal flip of player-side art is NOT enough where origin or
// angle is wrong, and the generic anchor-to-anchor angle is NOT the code-true
// angle for any set with a nonzero origin offset — which is all 204 of them
// (verified: every row's origin-corrected angle differs from the generic
// anchor-to-anchor angle by >5 degrees on both square and 16:9 canvases).
//
// PROVENANCE — read before citing any number in this file:
// ---------------------------------------------------------------------------
// [B2-1] Black 2, pokebw2 @ e522642, src/ov168/btlv_effvm.c,
//   BtlvEffvm_GetTargetPosition (line 3169): position code 14 = attacker,
//   16 = defender; a missing defender falls back to the opposite side
//   (attacker & 1 / attacker ^ 1). BtlvEffvm_SwapSide: flipSides swaps a
//   position with pos ^ 1 — side is position parity, never a fixed angle.
// [B2-2] Black 2, same file, BtlvEffvm_InitEmitter (line 3355): an emitter's
//   start ("from") is the ATTACKER's battler default position
//   (BtlvMcss_GetDefaultPos, line 3424) and its aim ("to") is the
//   DEFENDER's battler position (line 3487). The travel direction is
//   dir = to - from, normalized, and the arc radius is |to - from| / 2.
//   The emitter is placed at "from". There is no fixed per-move angle.
// [B2-3] Black 2, pokebw2 @ e522642, src/ov168/btlv_mcss.c,
//   BtlvMcss_GetDefaultPosForStyle (line 662) + singles table (lines
//   192-195): singles pos 0 (player side) = {0x800, 0x666, 0x7000} =
//   (0.5, 0.4, 7.0); pos 1 (opponent side) = {0x4cd, 0x666, -0xa000} =
//   (0.3, 0.4, -10.0). Opponent-to-player travel is the exact reverse of
//   player-to-opponent travel (vectors_world_xz in the staging file).
// [FR-1] FireRed, pokefirered-leafgreen @ ce6406d,
//   src/battle_anim_mons.c, InitSpritePosToAnimAttacker (line 805): a
//   projectile sprite STARTS at the attacker's coords (BATTLER_COORD_X_2 /
//   BATTLER_COORD_Y_PIC_OFFSET). Origin = attacker anchor, never a mirror.
// [FR-2] FireRed, same file, SetAnimSpriteInitialXOffset (line 735): the
//   initial X offset is applied TOWARD THE TARGET — attackerX > targetX
//   subtracts, attackerX < targetX adds, equal falls back to the side
//   (non-player subtracts). For the foe (176 > 72) the offset subtracts:
//   sideSign -1. This is the code-true origin rule, not a blind flip.
// [FR-3] FireRed, same file, TranslateAnimSpriteToTargetMonLocation
//   (line 1440) and AnimThrowProjectile (line 1469): the destination is
//   the TARGET's coords, and the target-side lateral argument (args[2])
//   is NEGATED when the attacker is not B_SIDE_PLAYER
//   (include/constants/battle.h lines 37-38: B_SIDE_PLAYER 0,
//   B_SIDE_OPPONENT 1). Travel is a linear interpolation origin -> target
//   (StartAnimLinearTranslation) or an arc (InitAnimArcTranslation).
// [FR-4] FireRed, same file, battle_anim.c (lines 397-398): visual tasks
//   spawn at the target's coords — impact sits on the target, not on a
//   mirrored copy of the attacker's position.
// [LIVE] Game anchors on main 08648398: src/lib/combatAiming.ts —
//   FIRE_RED_ANCHORS foe (176, 40), player (72, 80);
//   PIXI_ANCHOR_FRACTIONS foe (0.78, 0.42), player (0.22, 0.78);
//   src/components/game/PixiBattleCanvas.tsx — foe sprite size
//   0.36 x min(vw, vh), player 0.42 x min(vw, vh).
//
// CODE-TRUE RULE IMPLEMENTED HERE (opponent side only):
//   attackerSizePx = 0.36 * min(canvasW, canvasH)          [LIVE]
//   originPx = (foeAnchor.x + sideSign * xForward * attackerSizePx,
//               foeAnchor.y - yUp * attackerSizePx)        [FR-1, FR-2]
//     where sideSign = -1 for the foe. xForward >= 0 points TOWARD the
//     player side; a negative xForward (trailing origin, e.g. a tail
//     sweep) points away from it. sideSign is applied EXACTLY ONCE:
//     the 2026-10-26 staging draft's origin_rule string ("anchor +
//     sideSign x bodyPartOffset" where bodyPartOffset itself already
//     contained sideSign) would have double-applied it and put the
//     origin on the wrong side; this module corrects that string.
//     The Y offset is side-independent, as in FireRed (sprite->y +=
//     args[1] unconditionally, [FR-1]): "up" is up on both sides.
//   targetPx = player anchor                                [B2-2, FR-3]
//   vector = targetPx - originPx; angleDeg = atan2(dy, dx) in screen
//   coords (y down). directionSign = sign(vector.x); for every foe row
//   it is -1 (toward the player side). Angles are aspect-dependent:
//   never quote one without its canvas size — this module always takes
//   (canvasW, canvasH) and computes for that canvas.
//
// BODY-PART HONESTY (do not misread this table):
//   No generation on disk has a per-move body-part origin table
//   (mouth/hand/cannon). Every bodyPart value below is an AUTHORED draft
//   carried verbatim from the 2026-10-26 staging file, labelled AUTHORED
//   there and here, drafted from set names for the art side to confirm
//   against actual cell pixels. NEVER claim a body-part value in this
//   file was pulled from a decomp table. The side, vector, angle and
//   category mapping ARE code-derived ([B2-*], [FR-*] above).
//   The Black-2-code-true fixed art set is a SEPARATE Mars eye-check
//   step that takes this table as its basis; this module flips,
//   regenerates, or replaces no art cells.
//
// COVERAGE: 204 rows = 51 folders x 4 slots (physical / special /
// signature / heavy). Verified against main 08648398: the 51 folders
// match sprite-art/animation/attack/ exactly (0 missing either way);
// all 47 names in src/lib/global_roster.json are covered by these
// folders, plus 4 extra art folders (dorowani, gabu,
// strikechamp_unsuited, strikechamp_unsuited_full — the last two share
// species id "variant"). Named slot art exists for 80/204 rows
// (39.2%); 100/204 rows (49.0%) fall back to the generic 4-frame
// transform set; 24/204 articulation rows have no named special set.
// 204/204 slot-row coverage is NOT art coverage — see the counts const.
//
// This file lives under src/lib/ (game-usable) on purpose: it is NOT
// under src/lib/generated/, which validate-reference.ts treats as
// reference-only. It imports nothing, so it cannot break that rule.

export type OpponentSlot = "physical" | "special" | "signature" | "heavy";

export type OpponentMotion = "lunge" | "projectile";

/** One opponent-side attack set: a folder x slot row, code-true ready. */
export interface OpponentCodeTrueRow {
  /** Art folder under sprite-art/animation/attack/ (also the Pixi folder). */
  folder: string;
  /** Staging species id; "variant" for the two strikechamp variant folders. */
  species: string;
  slot: OpponentSlot;
  motion: OpponentMotion;
  pokemonCategory: string;
  pixiCategory: string;
  /** Named art set, or null for the generic 4-frame transform fallback. */
  namedSet: string | null;
  renderSource: string;
  artStatus: string;
  /**
   * AUTHORED draft body part (mouth / body / fist / cannon / claw /
   * tail / lash_limb / hands_thrown). NOT pulled from any decomp table:
   * the art side must confirm it against the actual cell pixels.
   */
  bodyPartAuthored: string;
  /** AUTHORED draft basis, verbatim from the staging file. */
  bodyPartBasisAuthored: string;
  /**
   * Origin offset in fractions of attackerSize (foe: 0.36 x min(vw, vh)).
   * xForward: forward = toward the player side (>= 0; negative trails).
   * yUp: upward from the attacker anchor (>= 0).
   */
  xForward: number;
  yUp: number;
}

export interface OpponentCodeTruePoint {
  x: number;
  y: number;
}

/** Code-true aim for one row on one canvas: origin, target, vector, angle. */
export interface OpponentCodeTrueAim {
  folder: string;
  slot: OpponentSlot;
  /** Projectile/lunge origin in canvas px (code-true, [FR-1] + [FR-2]). */
  origin: OpponentCodeTruePoint;
  /** Target anchor in canvas px (player side). */
  target: OpponentCodeTruePoint;
  /** vector = target - origin, canvas px ([B2-2], [FR-3]). */
  vector: OpponentCodeTruePoint;
  length: number;
  /** atan2(dy, dx) in degrees, screen coords (y down). */
  angleDeg: number;
  /** Angle from the bare anchors (centre origin) on the same canvas. */
  genericAngleDeg: number;
  /** angleDeg - genericAngleDeg: the correction a plain flip misses. */
  correctionDeg: number;
  /** -1 for every foe row: travel toward the player side. */
  directionSign: 1 | -1;
  /** True for every foe row: the hit travels toward the player side. */
  towardPlayerSide: boolean;
}

/** Live Pixi canvas anchors, fractions of canvas size (combatAiming.ts). */
export const OPPONENT_FOE_ANCHOR_FRAC: OpponentCodeTruePoint = Object.freeze({
  x: 0.78,
  y: 0.42,
});
export const OPPONENT_TARGET_ANCHOR_FRAC: OpponentCodeTruePoint = Object.freeze({
  x: 0.22,
  y: 0.78,
});
/** Foe sprite size as a fraction of min(canvasW, canvasH) (PixiBattleCanvas). */
export const OPPONENT_FOE_SIZE_FRAC = 0.36;
/** Foe side sign: the FireRed toward-target sign for attackerX > targetX. */
export const OPPONENT_SIDE_SIGN = -1;
/** FireRed 240x160 generic foe vector (opponentDirection.ts OPPONENT_VECTORS). */
export const OPPONENT_GENERIC_FIRE_RED_VECTOR = Object.freeze({
  attacker: Object.freeze({ x: 176, y: 40 }),
  target: Object.freeze({ x: 72, y: 80 }),
  dx: -104,
  dy: 40,
  angleDeg: 158.96,
  direction: "down-left",
});

export const OPPONENT_CODE_TRUE_ROWS: readonly OpponentCodeTrueRow[] = Object.freeze([

  Object.freeze({ folder: "aerobeak", species: "020", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "aerobeak", species: "020", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "aerobeak", species: "020", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "aerobeak", species: "020", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "aquariios", species: "003", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "aquariios", species: "003", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "aquariios", species: "003", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "aquariios", species: "003", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "ashemit", species: "044", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_ash_charge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "ashemit", species: "044", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "ashemit", species: "044", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_flame_tail_sweep", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "tail", bodyPartBasisAuthored: "set name contains tail", xForward: -0.2, yUp: 0.45 }),
  Object.freeze({ folder: "ashemit", species: "044", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_inferno_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "astroleviathan", species: "025", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "astroleviathan", species: "025", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "astroleviathan", species: "025", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "astroleviathan", species: "025", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "chromejaww", species: "005", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "chromejaww", species: "005", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "chromejaww", species: "005", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "chromejaww", species: "005", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "cocoonode", species: "017", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "cocoonode", species: "017", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "cocoonode", species: "017", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "cocoonode", species: "017", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "cragarm", species: "036", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "cragarm", species: "036", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "cragarm", species: "036", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "cragarm", species: "036", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "dorowani", species: "147", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_glide_ram", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "dorowani", species: "147", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "dorowani", species: "147", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_wave_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "dorowani", species: "147", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_deluge_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "dreadtoise", species: "040", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_shell_ram", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "dreadtoise", species: "040", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_special_water_gun", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "dreadtoise", species: "040", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_twin_cannon_barrage", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "cannon", bodyPartBasisAuthored: "set name contains cannon", xForward: 0.26, yUp: 0.62 }),
  Object.freeze({ folder: "dreadtoise", species: "040", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_fortress_slam_finisher", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "duneclaw", species: "008", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "duneclaw", species: "008", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "duneclaw", species: "008", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "duneclaw", species: "008", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "duskfiend", species: "043", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "duskfiend", species: "043", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "duskfiend", species: "043", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "duskfiend", species: "043", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "finblade", species: "022", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "finblade", species: "022", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "finblade", species: "022", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "finblade", species: "022", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "floatcalf", species: "024", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_float_ram", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "floatcalf", species: "024", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "floatcalf", species: "024", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_sky_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "floatcalf", species: "024", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_cloud_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gabu", species: "148", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_forest_lunge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gabu", species: "148", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gabu", species: "148", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_canopy_burst", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gabu", species: "148", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_timber_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gearkid", species: "032", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gearkid", species: "032", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gearkid", species: "032", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gearkid", species: "032", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gorokappa", species: "034", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "gorokappa", species: "034", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gorokappa", species: "034", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "gorokappa", species: "034", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "inklet", species: "026", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_ink_lash", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "lash_limb", bodyPartBasisAuthored: "set name contains lash/vine/tentacle", xForward: 0.3, yUp: 0.55 }),
  Object.freeze({ folder: "inklet", species: "026", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "inklet", species: "026", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_abyss_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "inklet", species: "026", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_ink_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "kickmaster", species: "031", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "kickmaster", species: "031", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "kickmaster", species: "031", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "kickmaster", species: "031", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "kittember", species: "010", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_ember_pounce", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "kittember", species: "010", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "kittember", species: "010", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_inferno_pounce", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "kittember", species: "010", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_blaze_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "krakenox", species: "028", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_tentacle_lash", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "lash_limb", bodyPartBasisAuthored: "set name contains lash/vine/tentacle", xForward: 0.3, yUp: 0.55 }),
  Object.freeze({ folder: "krakenox", species: "028", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "krakenox", species: "028", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_abyss_surge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "krakenox", species: "028", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_kraken_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "manticlaw", species: "012", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "manticlaw", species: "012", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "manticlaw", species: "012", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "manticlaw", species: "012", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mechapion", species: "033", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mechapion", species: "033", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mechapion", species: "033", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mechapion", species: "033", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "megalochrome", species: "023", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "megalochrome", species: "023", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "megalochrome", species: "023", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "megalochrome", species: "023", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mochii", species: "001", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_body_slam", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mochii", species: "001", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_special_aqua_shot", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mochii", species: "001", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_aqua_cannon", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "cannon", bodyPartBasisAuthored: "set name contains cannon", xForward: 0.26, yUp: 0.62 }),
  Object.freeze({ folder: "mochii", species: "001", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_hydro_surge_finisher", renderSource: "pilot", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mothrix", species: "018", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mothrix", species: "018", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mothrix", species: "018", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mothrix", species: "018", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mythar", species: "331", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_star_pounce", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "mythar", species: "331", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mythar", species: "331", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_orbit_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "mythar", species: "331", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_nova_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "oblivirex", species: "009", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "oblivirex", species: "009", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "oblivirex", species: "009", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "oblivirex", species: "009", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pebblefist", species: "035", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_rock_punch", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "pebblefist", species: "035", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pebblefist", species: "035", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_boulder_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "hands_thrown", bodyPartBasisAuthored: "boulder barrage = thrown by hands", xForward: 0.28, yUp: 0.58 }),
  Object.freeze({ folder: "pebblefist", species: "035", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_avalanche_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pixilite", species: "041", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pixilite", species: "041", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pixilite", species: "041", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pixilite", species: "041", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "punchkid", species: "029", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_jab_rush", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "punchkid", species: "029", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "punchkid", species: "029", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_combo_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "punchkid", species: "029", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_knockout_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pupbble", species: "013", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pupbble", species: "013", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pupbble", species: "013", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pupbble", species: "013", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pyromonk", species: "045", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_flame_fist", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "pyromonk", species: "045", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pyromonk", species: "045", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_inferno_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pyromonk", species: "045", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_blaze_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pyropaw", species: "011", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "pyropaw", species: "011", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pyropaw", species: "011", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "pyropaw", species: "011", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "quakehound", species: "015", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "quakehound", species: "015", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "quakehound", species: "015", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "quakehound", species: "015", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "razorgater", species: "004", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_razor_rush", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "razorgater", species: "004", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "razorgater", species: "004", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_cross_slash", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "claw", bodyPartBasisAuthored: "set name contains slash/claw/talon", xForward: 0.28, yUp: 0.55 }),
  Object.freeze({ folder: "razorgater", species: "004", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_jaw_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "reaperdile", species: "006", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "reaperdile", species: "006", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "reaperdile", species: "006", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "reaperdile", species: "006", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "shellguard", species: "039", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "shellguard", species: "039", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "shellguard", species: "039", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "shellguard", species: "039", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "sproutle", species: "038", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_vine_lunge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "lash_limb", bodyPartBasisAuthored: "set name contains lash/vine/tentacle", xForward: 0.3, yUp: 0.55 }),
  Object.freeze({ folder: "sproutle", species: "038", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "sproutle", species: "038", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_bloom_burst", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "sproutle", species: "038", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_overgrowth_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "squirmite", species: "016", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_coil_lunge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "squirmite", species: "016", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "squirmite", species: "016", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_verdant_burst", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "squirmite", species: "016", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_overrun_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "stormtalon", species: "021", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_talon_dive", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "claw", bodyPartBasisAuthored: "set name contains slash/claw/talon", xForward: 0.28, yUp: 0.55 }),
  Object.freeze({ folder: "stormtalon", species: "021", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "stormtalon", species: "021", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_tempest_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "stormtalon", species: "021", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_thunder_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp", species: "030", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_champ_punch", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp", species: "030", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "strikechamp", species: "030", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_champ_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "champ barrage = fist flurry", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp", species: "030", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_knockout_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited", species: "variant", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_bare_punch", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited", species: "variant", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "strikechamp_unsuited", species: "variant", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_bare_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "champ barrage = fist flurry", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited", species: "variant", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_knockout_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited_full", species: "variant", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_suit_punch", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "set name contains punch/jab/fist", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited_full", species: "variant", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "strikechamp_unsuited_full", species: "variant", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_suit_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "fist", bodyPartBasisAuthored: "champ barrage = fist flurry", xForward: 0.3, yUp: 0.5 }),
  Object.freeze({ folder: "strikechamp_unsuited_full", species: "variant", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_knockout_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "terradog", species: "014", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_terra_charge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "terradog", species: "014", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "terradog", species: "014", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_terra_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "terradog", species: "014", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_quake_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "terrapod", species: "037", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "terrapod", species: "037", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "terrapod", species: "037", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "terrapod", species: "037", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "tiidebiite", species: "002", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_tide_ram", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "tiidebiite", species: "002", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "tiidebiite", species: "002", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_surge_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "tiidebiite", species: "002", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_tsunami_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "toxitacle", species: "027", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_tentacle_lash", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "lash_limb", bodyPartBasisAuthored: "set name contains lash/vine/tentacle", xForward: 0.3, yUp: 0.55 }),
  Object.freeze({ folder: "toxitacle", species: "027", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "toxitacle", species: "027", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_venom_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "toxitacle", species: "027", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_toxic_crash_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "tyrage", species: "007", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_rage_charge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "tyrage", species: "007", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "tyrage", species: "007", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_tyrant_flare", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "tyrage", species: "007", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_cataclysm_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "wispkin", species: "042", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "wispkin", species: "042", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "wispkin", species: "042", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "wispkin", species: "042", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: null, renderSource: "transform", artStatus: "generic transform fallback (4 frames, not slot-named)", bodyPartAuthored: "body", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "yogiferno", species: "046", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_yogi_charge", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "yogiferno", species: "046", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "yogiferno", species: "046", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_inferno_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "yogiferno", species: "046", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_blaze_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "zephling", species: "019", slot: "physical", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_physical_zephyr_dive", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
  Object.freeze({ folder: "zephling", species: "019", slot: "special", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: null, renderSource: "articulation", artStatus: "NO named set \u2014 falls back to category selection / transform fallback", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "slot default (no named set)", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "zephling", species: "019", slot: "signature", motion: "projectile", pokemonCategory: "Special", pixiCategory: "Special", namedSet: "atk_signature_cyclone_barrage", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "mouth", bodyPartBasisAuthored: "beam/barrage emitter default = mouth", xForward: 0.18, yUp: 0.72 }),
  Object.freeze({ folder: "zephling", species: "019", slot: "heavy", motion: "lunge", pokemonCategory: "Physical", pixiCategory: "Physical", namedSet: "atk_heavy_tempest_finisher", renderSource: "articulation", artStatus: "named set", bodyPartAuthored: "body", bodyPartBasisAuthored: "ram/charge/pounce/dive/slam/crash/body default = leading body", xForward: 0.22, yUp: 0.5 }),
]);

/** Rows keyed "folder/slot" for O(1) lookup; unknown keys resolve to null, never a guess. */
const OPPONENT_CODE_TRUE_BY_KEY: Readonly<Record<string, OpponentCodeTrueRow>> =
  Object.freeze(
    Object.fromEntries(
      OPPONENT_CODE_TRUE_ROWS.map((row) => [`${row.folder}/${row.slot}`, row]),
    ),
  );

export function opponentCodeTrueRowFor(
  folder: string,
  slot: OpponentSlot,
): OpponentCodeTrueRow | null {
  return OPPONENT_CODE_TRUE_BY_KEY[`${folder}/${slot}`] ?? null;
}

export function opponentCodeTrueRowsForFolder(
  folder: string,
): OpponentCodeTrueRow[] {
  return OPPONENT_CODE_TRUE_ROWS.filter((row) => row.folder === folder);
}

/** All 51 folders, in row order (first-seen). */
export const OPPONENT_CODE_TRUE_FOLDERS: readonly string[] = Object.freeze(
  Array.from(new Set(OPPONENT_CODE_TRUE_ROWS.map((row) => row.folder))),
);

/** Coverage counts, computed from the rows (not hand-typed) so they cannot drift. */
export const OPPONENT_CODE_TRUE_COUNTS = Object.freeze({
  rowsTotal: OPPONENT_CODE_TRUE_ROWS.length,
  foldersTotal: OPPONENT_CODE_TRUE_FOLDERS.length,
  slotsPerFolder: 4,
  rowsWithNamedArt: OPPONENT_CODE_TRUE_ROWS.filter((row) => row.namedSet !== null).length,
  rowsTransformFallback: OPPONENT_CODE_TRUE_ROWS.filter(
    (row) => row.renderSource === "transform",
  ).length,
  rowsBySlot: Object.freeze({
    physical: OPPONENT_CODE_TRUE_ROWS.filter((row) => row.slot === "physical").length,
    special: OPPONENT_CODE_TRUE_ROWS.filter((row) => row.slot === "special").length,
    signature: OPPONENT_CODE_TRUE_ROWS.filter((row) => row.slot === "signature").length,
    heavy: OPPONENT_CODE_TRUE_ROWS.filter((row) => row.slot === "heavy").length,
  }),
});

/**
 * Code-true aim for one row on a canvas of (canvasW, canvasH) px.
 * Pure: no imports, no DOM, no game state. Aspect-dependent by design —
 * the caller must pass the real canvas size; there is no aspect-free angle.
 */
export function opponentCodeTrueAim(
  row: OpponentCodeTrueRow,
  canvasW: number,
  canvasH: number,
): OpponentCodeTrueAim {
  const attackerSizePx = OPPONENT_FOE_SIZE_FRAC * Math.min(canvasW, canvasH);
  const origin = {
    x:
      OPPONENT_FOE_ANCHOR_FRAC.x * canvasW +
      OPPONENT_SIDE_SIGN * row.xForward * attackerSizePx,
    y: OPPONENT_FOE_ANCHOR_FRAC.y * canvasH - row.yUp * attackerSizePx,
  };
  const target = {
    x: OPPONENT_TARGET_ANCHOR_FRAC.x * canvasW,
    y: OPPONENT_TARGET_ANCHOR_FRAC.y * canvasH,
  };
  const vector = { x: target.x - origin.x, y: target.y - origin.y };
  const length = Math.hypot(vector.x, vector.y);
  const angleDeg = (Math.atan2(vector.y, vector.x) * 180) / Math.PI;
  const genericOrigin = {
    x: OPPONENT_FOE_ANCHOR_FRAC.x * canvasW,
    y: OPPONENT_FOE_ANCHOR_FRAC.y * canvasH,
  };
  const genericAngleDeg =
    (Math.atan2(
      target.y - genericOrigin.y,
      target.x - genericOrigin.x,
    ) *
      180) /
    Math.PI;
  return {
    folder: row.folder,
    slot: row.slot,
    origin,
    target,
    vector,
    length,
    angleDeg,
    genericAngleDeg,
    correctionDeg: angleDeg - genericAngleDeg,
    directionSign: vector.x < 0 ? -1 : 1,
    towardPlayerSide: vector.x < 0,
  };
}

/** Lookup + aim in one call; null for an unknown folder/slot (never a guess). */
export function opponentCodeTrueAimFor(
  folder: string,
  slot: OpponentSlot,
  canvasW: number,
  canvasH: number,
): OpponentCodeTrueAim | null {
  const row = opponentCodeTrueRowFor(folder, slot);
  return row === null ? null : opponentCodeTrueAim(row, canvasW, canvasH);
}

