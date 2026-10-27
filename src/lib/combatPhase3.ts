/**
 * combatPhase3.ts — Phase 3 combat wiring, in Pokemon's order (NEW, 2026-10-26).
 *
 * This module EXTENDS the live base; it does not redo it and does not
 * replace the resolver. Live BattleView already resolves turns through
 * battleResolver.resolveTurn (PR #107) on top of battle-math.ts, so
 * systems 2-4 and 7 below were already live before this file existed —
 * this module names them, pins their locked values, and adds the two
 * pieces that were missing: the singles target table (5) and the
 * unified move-schema + script-routing accessor (1). Direction (part of
 * 6) is live in PixiBattleCanvas through combatAiming.ts; the camera
 * preset vocabulary (6) lives there too.
 *
 * The seven systems, in Pokemon's order, with their live status:
 *   (1) Move schema — FireRed shape (effect/power/type/accuracy/PP/
 *       secondary-chance/target/priority/flags) for the 36 game moves
 *       in moves.ts, plus the 563-key union script table in
 *       moveScripts.json. gameMoveSchema() routes a game move to its
 *       union script through gameMoveScriptMap.json (36/36 on main:
 *       10 exact-id + 26 mapped, 0 unmatched — verified against live
 *       main 2026-10-26, not from a local clone).
 *   (2) Effect dispatch — resolver effect kinds (none/status/stat/
 *       recoil/multiHit/highCrit/chargeTurn/flinch), applied by
 *       resolveTurn in pipeline order (can-act -> charge -> accuracy
 *       -> damage -> secondary -> recoil -> faint -> end-turn ticks).
 *       All 13 distinct effect strings in moves.ts map to a kind;
 *       none falls through to "none" by accident (see test).
 *   (3) Turn order — priority first, then effective Speed (stage-
 *       adjusted, paralysis quarters), then a coin flip on an exact
 *       tie (battle-math orderPair, via resolver orderActions).
 *   (4) Accuracy / crit / damage — battle-math: accuracy threshold
 *       from acc/eva stages, crit LOCKED at x2 with the stage table
 *       {16, 8, 4, 3, 2} (1-in-N), crit ignores the attacker's negative
 *       Atk stage and the defender's positive Def stage, base damage
 *       floored at each division step, STAB x1.5, roll 85-100 last.
 *       The old flat 6% / x1.5 crit is gone from this path.
 *   (5) Targets — singles table below: 35 moves target the foe, and
 *       EARTH_TREMOR targets allFoes (its game text is "all adjacent
 *       foes"). The resolver collapses allFoes to the foe in a 1v1,
 *       so singles behaviour is unchanged today and doubles-ready
 *       tomorrow. battleWiring.buildLegacyMoveTable() applies this
 *       override live; this table is its source of truth.
 *   (6) Camera — combatAiming.ts presets (wide / attacker close-up /
 *       impact shake / return to wide), XD/Colosseum-style framing
 *       language on the Pixi 2D canvas (not a true 3D camera — the
 *       game canvas is Pixi 2D, stated plainly).
 *   (7) HP drain — HP changes ONLY at the impact frame (BattleView
 *       onAttackImpact, driven by Pixi onImpact) or in a resolver
 *       event (damage / recoil / end-turn tick). Between-turn movement
 *       (battleIntegration.sampleBetweenTurnPose) is pose-only and
 *       moves 0 HP: hpUnchangedOutsideTurn() is the guard, and the
 *       Arena rule is absolute — no fighting move lands between turns.
 *
 * NOT in this phase (stated, not hidden): doubles target selection
 * (adjacent pick, Follow-Me / Lightning-Rod redirection), a true 3D
 * camera, True-Elements chart wiring (list locked at 19, matchup
 * values still owed — another lane owns it; the legacy chart stays
 * live here), union-move display names (the sibling rename map, not
 * yet landed — union keys here are decomp constants, never shown as
 * game-facing names), and per-move mouth/hand origins (sibling
 * origin/angle tables; v1 entries here are battler-centre).
 *
 * Proprietary rule governing this file (2026-10-26 ~20:39 CDT): only
 * species/characters, names, images, logos, literal dialogue and
 * cries are swapped out. Move structure, order, windows, inputs and
 * values are wired as Pokemon does them; no town names are used here.
 */

import { MOVES_DB } from "./moves";
import {
  CRIT_CHANCE_DENOMINATORS,
  accuracyThreshold,
  calculateDamage,
  orderPair,
  rollAccuracy,
  rollCrit,
  rollMultiHitCount,
  type BattlerInput,
  type MoveInput,
} from "./battle-math";
import {
  legacyEffectToResolverEffect,
  legacyMoveToResolverMove,
  orderActions,
  resolveTurn,
  type ResolverMove,
} from "./battleResolver";
import gameMoveScriptMap from "./generated/gameMoveScriptMap.json";
import {
  BLACK2_ANCHORS,
  FIRE_RED_ANCHORS,
  ORIGIN_ANGLE_TABLE_PATH,
  aimFromFireRedAnchors,
  aimForCanvasAttack,
  cameraPresetForPhase,
  sideSign,
  type CameraPhase,
  type CombatSide,
} from "./combatAiming";

export {
  BLACK2_ANCHORS,
  FIRE_RED_ANCHORS,
  ORIGIN_ANGLE_TABLE_PATH,
  aimFromFireRedAnchors,
  aimForCanvasAttack,
  cameraPresetForPhase,
  sideSign,
  type CameraPhase,
  type CombatSide,
};
export { orderActions, resolveTurn };
export {
  CRIT_CHANCE_DENOMINATORS,
  accuracyThreshold,
  calculateDamage,
  orderPair,
  rollAccuracy,
  rollCrit,
  rollMultiHitCount,
  type BattlerInput,
  type MoveInput,
};

/** Crit rule, LOCKED (Mars order + all three baselines): x2, 1-in-{16,8,4,3,2}. */
export const CRIT_LOCKED = Object.freeze({
  multiplier: 2,
  denominators: CRIT_CHANCE_DENOMINATORS,
  ignoresAttackerNegativeAtkStage: true,
  ignoresDefenderPositiveDefStage: true,
});

/** Union script keys (moveScripts.json): 560 Black 2 + 3 FireRed-only = 563. */
export const UNION_MOVE_COUNT = 563;
/** Directed executions: each union move from 2 sides (player + foe). */
export const DIRECTED_EXECUTION_COUNT = UNION_MOVE_COUNT * 2; // 1,126

// ---------------------------------------------------------------------------
// (1) Move schema (FireRed shape) + script routing
// ---------------------------------------------------------------------------

export interface GameMoveSchema {
  id: string;
  name: string;
  type: string;
  category: "Physical" | "Special" | "Status";
  power: number;
  accuracy: number;
  pp: number;
  priority: number;
  effect: string;
  effectChance: number;
  /** Singles target kind (see (5)); resolver target for this move. */
  target: ResolverMove["target"];
  /** Resolver effect kind this effect string dispatches to (see (2)). */
  resolverEffectKind: string;
  /** Union script key this game move routes to (gameMoveScriptMap.json). */
  scriptKey: string | null;
  /** "exact-id" when the game id resolves directly, else "mapped". */
  scriptRoute: "exact-id" | "mapped" | "unrouted";
}

const SCRIPT_MAP = gameMoveScriptMap as unknown as {
  exactIdMatches: string[];
  mapping: Record<string, string>;
  counts: { gameMoves: number; exactId: number; mappedHere: number; totalMatched: number; unmatched: number };
};

/** The 36 game moves, each with its singles target (35 foe + EARTH_TREMOR allFoes). */
export function gameMoveTarget(moveId: string): ResolverMove["target"] {
  return moveId === "EARTH_TREMOR" ? "allFoes" : "foe";
}

/** Full FireRed-shape schema + script route for one game move; null when unknown. */
export function gameMoveSchema(moveId: string): GameMoveSchema | null {
  const m = MOVES_DB[moveId];
  if (!m) return null;
  const exact = SCRIPT_MAP.exactIdMatches.includes(moveId);
  const mapped = SCRIPT_MAP.mapping[moveId];
  const base = legacyMoveToResolverMove(moveId, m);
  return {
    id: moveId,
    name: m.name,
    type: m.type,
    category: m.cat,
    power: m.bp,
    accuracy: m.acc,
    pp: m.pp,
    priority: m.pri,
    effect: m.effect,
    effectChance: m.effectChance,
    target: gameMoveTarget(moveId),
    resolverEffectKind: base.effect.kind,
    scriptKey: exact ? moveId : (mapped ?? null),
    scriptRoute: exact ? "exact-id" : mapped ? "mapped" : "unrouted",
  };
}

/** All 36 game-move schemas, in moves.ts order. */
export function allGameMoveSchemas(): GameMoveSchema[] {
  return Object.keys(MOVES_DB)
    .map((id) => gameMoveSchema(id))
    .filter((s): s is GameMoveSchema => s !== null);
}

/** Script-map counts, straight from the live-main file (36/36, 0 unmatched). */
export function scriptMapCounts(): { gameMoves: number; exactId: number; mappedHere: number; totalMatched: number; unmatched: number } {
  return { ...SCRIPT_MAP.counts };
}

// ---------------------------------------------------------------------------
// (2) Effect dispatch — effect string -> resolver kind (table, not per-move code)
// ---------------------------------------------------------------------------

/** Every distinct effect string in moves.ts, and the kind it dispatches to. */
export function effectDispatchTable(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of Object.values(MOVES_DB)) {
    if (!(m.effect in out)) {
      out[m.effect] = legacyEffectToResolverEffect(m.effect, m.effectChance).kind;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// (5) Targets — singles table
// ---------------------------------------------------------------------------

export interface TargetRow {
  moveId: string;
  /** Black 2 target shape: SELECTED (single foe) or ADJACENT_FOES (spread). */
  black2Target: "SELECTED" | "ADJACENT_FOES";
  /** Resolver target live in battleWiring (allFoes collapses to foe in 1v1). */
  resolverTarget: ResolverMove["target"];
}

export function targetTable(): TargetRow[] {
  return Object.keys(MOVES_DB).map((id) => ({
    moveId: id,
    black2Target: id === "EARTH_TREMOR" ? ("ADJACENT_FOES" as const) : ("SELECTED" as const),
    resolverTarget: gameMoveTarget(id),
  }));
}

// ---------------------------------------------------------------------------
// (7) HP drain — impact-only drain + the between-turn guard
// ---------------------------------------------------------------------------

/** HP after one impact drain, clamped at 0 (mirrors BattleView onAttackImpact). */
export function drainHpAtImpact(currentHp: number, damage: number): number {
  return Math.max(0, currentHp - Math.max(0, damage));
}

/**
 * Arena Combat absolute rule, as a guard: outside a resolved turn
 * (between-turn movement, animation frames, camera moves), HP must not
 * change. Returns true when the rule holds. Resolver events (damage /
 * recoil / end-turn ticks) are inside a turn, not between turns, so
 * they are checked by the turn result itself, never by this guard.
 */
export function hpUnchangedOutsideTurn(beforeHp: number, afterHp: number): boolean {
  return beforeHp === afterHp;
}

/**
 * HP changes inside one resolver turn, by cause, for auditing: damage
 * events move HP at impact, recoil events move the attacker's HP, and
 * end-turn tick events move HP at turn end. Anything else in the event
 * list must not move HP — a turn whose events violate that is a wiring
 * bug, not a new rule.
 */
export function hpMovingEventKinds(): string[] {
  return ["damage", "recoil", "end-turn-tick"];
}
