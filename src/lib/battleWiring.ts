/**
 * BattleView wiring adapter — routes live BattleView through the PR #107
 * resolver (`resolveTurn`) WITHOUT switching the type chart and WITHOUT
 * changing the base damage formula.
 *
 * CHART (Mars decision, NOT made here): this adapter builds its chart by
 * probing `calcTypeMultiplier` from constants.ts — the exact chart live
 * BattleView already used. The True-Elements chart in battleTypeChart.ts
 * is deliberately NOT used: it is derived (76/144 sourced, 24 conflict,
 * 44 owed) and picking it would silently change matchups. Legacy-vs-True,
 * plus the Beast/Silk/Wind/Neon/Flora rulings and Pebblefist HP, remain
 * open Mars decisions (see docs/battle-resolver.md).
 *
 * DAMAGE: `calculateDamage` in battleResolver.ts was verified identical
 * to the old BattleView.executeDamage at stage 0 (972/972 tested cases;
 * base formula, STAB 1.5, crit 1.5 at 6%, roll 85-100%). The resolver-only
 * rules that now become live through the Resolve step — and only through
 * it — are labelled in battleResolver.ts, not retuned here: HIGH_CRIT
 * crit 12%, burn halving Physical base, accuracy rolls, secondary
 * stat/status/recoil/multi-hit/flinch application, end-of-turn
 * burn/poison ticks of 1/16 max HP.
 *
 * BATTLE-MATH PR (batch 1): the resolver damage path above now routes
 * through src/lib/battle-math.ts — crit is the stage table {16,8,4,3,2}
 * at x2 (the old flat 6% / x1.5 is gone), stages are exact fractions,
 * paralysis quarters Speed and is a 25% full-paralysis check, burn/poison
 * ticks are 1/8 max HP, multi-hit is 35/35/15/15, and speed ties are a
 * coin flip. The DAMAGE paragraph above describes the pre-batch resolver
 * and is superseded by battleResolver.ts's battle-math header for those
 * numbers; the chart decision in this file (legacy chart, not True
 * Elements) is unchanged.
 *
 * SCOPE (per-battle only, no store schema change): stat stages, status
 * and volatile (charging) state are carried in a BattleView ref for the
 * duration of one battle and are NEVER written back to the store, so a
 * battle's stages reset when the battle ends. PP is fed to the resolver
 * (so its copy decrements per turn) but is likewise NEVER written back:
 * writing it back would introduce PP depletion with no restore mechanic
 * in BattleView — that write-back is an owed follow-up decision, not
 * something this wiring invents. Enemy move choice stays in BattleView
 * (random pick); the resolver accepts actions as input and does not
 * choose them. No switching, AI, double-battle, capture-in-resolver, or
 * status move is added here — all owed separately.
 */

import { calcTypeMultiplier, TYPES } from './constants';
import { MOVES_DB } from './moves';
import {
  instanceToResolverBattler,
  legacyMoveToResolverMove,
  type MoveTable,
  type ResolverBattler,
  type StageMap,
  type TypeChart,
} from './battleResolver';
import type { ElementType, MochiiInstance } from './types';

/** The legacy 18-type chart, exactly as constants.ts computes it. */
export const LEGACY_TYPE_CHART: TypeChart = (() => {
  const chart: TypeChart = {};
  for (const atk of Object.keys(TYPES) as ElementType[]) {
    chart[atk] = {};
    for (const def of Object.keys(TYPES) as ElementType[]) {
      chart[atk][def] = calcTypeMultiplier(atk, def);
    }
  }
  return chart;
})();

/** All 36 moves.ts moves converted through the resolver's legacy adapter. */
export function buildLegacyMoveTable(): MoveTable {
  const moves: MoveTable['moves'] = {};
  for (const [id, m] of Object.entries(MOVES_DB)) {
    moves[id] = legacyMoveToResolverMove(id, m);
  }
  // PHASE 3 targets (combatPhase3.ts targetTable): EARTH_TREMOR's game
  // text is "all adjacent foes", so its resolver target is allFoes.
  // The resolver collapses allFoes to the foe in a 1v1, so singles
  // behaviour is unchanged today and doubles-ready tomorrow. Every
  // other game move targets the single foe.
  if (moves['EARTH_TREMOR']) moves['EARTH_TREMOR'].target = 'allFoes';
  return { moves };
}

/** Per-battle carried state for one side (stages/status/volatile only). */
export interface CarriedBattlerState {
  stages: StageMap;
  status: string | null;
  volatile: { chargingMoveId?: string | null };
}

/** Fresh carried state from an instance (battle start / switch-in). */
export function carriedFromInstance(inst: MochiiInstance): CarriedBattlerState {
  return { stages: { ...inst.stages }, status: inst.status, volatile: {} };
}

/**
 * Build a resolver battler from a live instance + its per-battle carried
 * state. `inst` supplies nickname/species/level/HP/stats/moves/PP;
 * `carried` supplies stages/status/volatile, which the store instance
 * itself does not track across a battle.
 */
export function makeResolverBattler(
  side: 'player' | 'foe',
  inst: MochiiInstance,
  speciesTypes: string[],
  carried: CarriedBattlerState,
): ResolverBattler {
  const battler = instanceToResolverBattler(
    side,
    {
      nickname: inst.nickname,
      speciesId: inst.speciesId,
      level: inst.level,
      hp: inst.hp,
      maxHp: inst.maxHp,
      stats: { ...inst.stats },
      stages: { ...carried.stages },
      status: carried.status,
      moves: [...inst.moves],
      pp: [...inst.pp],
    },
    speciesTypes,
  );
  battler.volatile = { ...(carried.volatile ?? {}) };
  return battler;
}
