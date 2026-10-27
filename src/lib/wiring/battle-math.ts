/**
 * Mochiichao battle-math — pure, seedable, zero-dependency.
 * How Pokemon does it, across the five generations in the repo:
 * - Gen 1/2 (pokered/yellow/gold/crystal, assembly in decomps/):
 *   damage, accuracy, and speed order as separate steps, no
 *   abilities, no physical/special split yet.
 * - Gen 3 (ruby/emerald/firered, C in decomps/ + fresh-start):
 *   battle_util.c + battle_ai_script_commands.c — accuracy
 *   roll, priority, speed, type, STAB, crit, random roll,
 *   effect chance, all as separate steps.
 * - Gen 4 (diamond/platinum/heartgold): physical/special
 *   split by move category, not by move type.
 * - Gen 5 (pokebw2, GPL-3.0, NOT vendored): battle as
 *   overlay modules (ov167 battle_action / battle_condition /
 *   battle_event), same step order, more conditions.
 * This module reimplements that STEP ORDER in original
 * TypeScript, for Mochiichao's own moves/species only.
 * No decomp code, no Pokemon move data, no creature data,
 * no dialogue, no town names, no art, no sounds are copied.
 * The type chart is supplied by the caller (the game's
 * constants.ts), so this module never hard-codes a chart.
 * RNG is injected: pass a deterministic rng in tests,
 * Math.random in the game. A move with no rng argument
 * uses Math.random.
 */
export type MoveCat = "Physical" | "Special" | "Status";
export type Move = {
  bp: number;
  acc: number; // 0-100, 100 = never misses on accuracy alone
  pri: number;
  cat: MoveCat;
  effect: string;
  effectChance: number; // 0-100
};
export type Battler = {
  level: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  types: string[];
  hp: number;
  maxHp: number;
  status?: string | null;
  statStages?: Record<string, number>;
};
export type Rng = () => number;

export function stageMult(stage: number): number {
  const table: Record<number, number> = {
    "-6": 0.25, "-5": 0.29, "-4": 0.33, "-3": 0.4, "-2": 0.5, "-1": 0.67,
    "0": 1, "1": 1.5, "2": 2, "3": 2.5, "4": 3, "5": 3.5, "6": 4,
  };
  return table[Math.max(-6, Math.min(6, stage))] ?? 1;
}

/** Accuracy step, before damage. Returns false on a miss. */
export function accuracyHits(move: Move, rng: Rng = Math.random): boolean {
  if (move.acc >= 100) return true;
  return rng() * 100 < move.acc;
}

/** Crit step. Base 1/16 in older gens, 1/24 in modern gens;
 *  this module uses modern 1/24 (6.25% → crit x1.5), with
 *  HIGH_CRIT raising the rate to 1/8 (12.5%). Documented,
 *  not silently changed. */
export function critHits(move: Move, rng: Rng = Math.random): boolean {
  const rate = move.effect === "HIGH_CRIT" ? 1 / 8 : 1 / 24;
  return rng() < rate;
}

/** Damage step, Gen 3+ formula shape:
 *  floor(floor(floor(2*L/5+2)*BP*A/D)/50)+2, then STAB,
 *  type, crit, random 85-100%. Status moves deal 0. */
export function calcDamage(
  attacker: Battler,
  defender: Battler,
  move: Move,
  typeMultiplier: (atkType: string, defTypes: string[]) => number,
  rng: Rng = Math.random,
): { damage: number; crit: boolean; typeMult: number } {
  if (move.cat === "Status" || move.bp <= 0) return { damage: 0, crit: false, typeMult: 1 };
  const aStat = move.cat === "Physical" ? attacker.atk : attacker.spa;
  const dStat = move.cat === "Physical" ? defender.def : defender.spd;
  const base = Math.floor(Math.floor(Math.floor((2 * attacker.level) / 5 + 2) * move.bp * aStat / dStat) / 50) + 2;
  const stab = attacker.types.includes(moveType(move)) ? 1.5 : 1;
  const typeMult = typeMultiplier(moveType(move), defender.types);
  const crit = critHits(move, rng);
  const random = (85 + rng() * 15) / 100;
  const damage = Math.floor(base * stab * typeMult * (crit ? 1.5 : 1) * random);
  return { damage, crit, typeMult };
}

// Move type is carried on the move object in the game (MOVES_DB
// has a `type` field). This helper keeps the signature honest:
// callers pass a move with a type, not a bare bp/acc struct.
export type GameMove = Move & { type: string };
function moveType(move: Move): string {
  return (move as GameMove).type ?? "";
}

/** Turn order step: priority bracket first, then speed
 *  (with stat stages), then input order on a tie. This is
 *  the order every gen from Gen 3 on uses, and Gen 5's
 *  battle_action overlay uses the same bracket. */
export function orderTurns<T extends { move: Move; battler: Battler; index: number }>(actions: T[]): T[] {
  return [...actions].sort((a, b) => {
    if (b.move.pri !== a.move.pri) return b.move.pri - a.move.pri;
    const aSpe = a.battler.spe * stageMult(a.battler.statStages?.spe ?? 0);
    const bSpe = b.battler.spe * stageMult(b.battler.statStages?.spe ?? 0);
    if (bSpe !== aSpe) return bSpe - aSpe;
    return a.index - b.index;
  });
}

/** Effect step, after damage. Returns the effect that
 *  actually applied, or null. Chance is rolled once, and
 *  only if the move has a chance > 0. Stat-down effects
 *  are returned as a stage change for the caller to apply. */
export function rollEffect(
  move: Move,
  rng: Rng = Math.random,
): { effect: string; stageChange?: { stat: string; stages: number } } | null {
  if (!move.effect || move.effect === "NONE") return null;
  if (move.effect === "HIGH_CRIT" || move.effect === "CHARGE_TURN" || move.effect === "MULTI_HIT") {
    return { effect: move.effect };
  }
  if (move.effectChance <= 0) return null;
  if (rng() * 100 >= move.effectChance) return null;
  const down: Record<string, { stat: string; stages: number }> = {
    SPDEF_DOWN1: { stat: "spd", stages: -1 },
    DEF_DOWN1: { stat: "def", stages: -1 },
    SPE_DOWN1: { stat: "spe", stages: -1 },
    ACC_DOWN1: { stat: "acc", stages: -1 },
  };
  if (down[move.effect]) return { effect: move.effect, stageChange: down[move.effect] };
  return { effect: move.effect };
}

/** Recoil step: RECOIL_25 returns 25% of damage dealt. */
export function recoilDamage(move: Move, damage: number): number {
  return move.effect === "RECOIL_25" ? Math.floor(damage * 0.25) : 0;
}

/** Multi-hit step: 2-5 hits, rolled from rng. Deterministic
 *  in tests when rng is a fixed sequence. */
export function multiHitCount(move: Move, rng: Rng = Math.random): number {
  if (move.effect !== "MULTI_HIT") return 1;
  return 2 + Math.floor(rng() * 4);
}
