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

/** Exact stat-stage ratios (Black 2 btl_calc.c: 2/8..8/2), -6..+6.
 *  The old table rounded -5 to 0.29 and -1 to 0.67; the exact
 *  fractions 2/7 and 2/3 change knife-edge speed comparisons. */
export const STAGE_RATIOS: ReadonlyArray<readonly [number, number]> = [
  [2, 8], [2, 7], [2, 6], [2, 5], [2, 4], [2, 3], [2, 2],
  [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2],
];

/** Exact accuracy/evasion-stage ratios (Black 2: 6/18..18/6). */
export const ACCURACY_STAGE_RATIOS: ReadonlyArray<readonly [number, number]> = [
  [6, 18], [6, 16], [6, 14], [6, 12], [6, 10], [6, 8], [6, 6],
  [8, 6], [10, 6], [12, 6], [14, 6], [16, 6], [18, 6],
];

export function stageMult(stage: number): number {
  const [num, den] = STAGE_RATIOS[Math.max(-6, Math.min(6, Math.trunc(stage))) + 6];
  return num / den;
}

/** Effective Speed for turn order: stage-adjusted (floored), then
 *  paralysis quarters it, then the Black 2 cap of 10000, then the
 *  Trick-Room-style inversion (10000 - speed) when requested. */
export function effectiveSpeed(
  battler: Battler,
  opts: { trickRoom?: boolean } = {},
): number {
  const [num, den] = STAGE_RATIOS[Math.max(-6, Math.min(6, Math.trunc(battler.statStages?.spe ?? 0))) + 6];
  let speed = Math.floor((battler.spe * num) / den);
  if (battler.status === "paralysis" || battler.status === "PARALYSIS") {
    speed = Math.floor(speed / 4);
  }
  if (speed > 10000) speed = 10000;
  if (opts.trickRoom) speed = 10000 - speed;
  return speed;
}

/** Accuracy step, before damage. Returns false on a miss. */
export function accuracyHits(move: Move, rng: Rng = Math.random): boolean {
  if (move.acc >= 100) return true;
  return rng() * 100 < move.acc;
}

/**
 * Stage-aware accuracy (Black 2 ServerEvent_CheckHit shape): net stage
 * = clamp(accStage - evaStage, -6, +6); threshold = accuracy x ratio,
 * capped at 100; hit iff floor(rng * 100) < threshold. A Black 2-style
 * accuracy of 0 means never-misses (the move's always-hit sentinel),
 * distinct from this module's accuracyHits where 100 means never-miss:
 * callers pass a real 1..100 accuracy here, or bypass via a guaranteed
 * hit for a never-miss move. Foresight (Black 2 rule) neutralizes only
 * a positive evasion stage; the FireRed rule (ignore evasion entirely)
 * is available as foresightRule "firered".
 */
export function accuracyHitsWithStages(
  move: Move,
  accStage: number,
  evaStage: number,
  opts: { foresight?: boolean; foresightRule?: "firered" | "black2"; evasionItemParam?: number } = {},
  rng: Rng = Math.random,
): boolean {
  if (move.acc <= 0) return true;
  const clamp = (v: number) => Math.max(-6, Math.min(6, Math.trunc(v)));
  let net: number;
  if (opts.foresight && opts.foresightRule === "firered") {
    net = clamp(accStage);
  } else if (opts.foresight) {
    net = clamp(accStage - (evaStage > 0 ? 0 : evaStage));
  } else {
    net = clamp(accStage - evaStage);
  }
  const [num, den] = ACCURACY_STAGE_RATIOS[net + 6];
  let threshold = Math.floor((move.acc * num) / den);
  if (opts.evasionItemParam !== undefined) {
    threshold = Math.floor((threshold * (100 - opts.evasionItemParam)) / 100);
  }
  if (threshold > 100) threshold = 100;
  return Math.floor(rng() * 100) < threshold;
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

/** Turn order step: priority bracket first, then effective speed
 *  (stage-adjusted, paralysis-quartered, capped at 10000, optionally
 *  Trick-Room-inverted), then — only when the caller passes an rng —
 *  a random shuffle of exact ties (Black 2 ActionOrder_Sort shape);
 *  without an rng, ties keep input order, as before. This is the
 *  order every gen from Gen 3 on uses, and Gen 5's battle_action
 *  overlay uses the same bracket. */
export function orderTurns<T extends { move: Move; battler: Battler; index: number }>(
  actions: T[],
  opts: { trickRoom?: boolean; rng?: Rng } = {},
): T[] {
  const sorted = [...actions].sort((a, b) => {
    if (b.move.pri !== a.move.pri) return b.move.pri - a.move.pri;
    const aSpe = effectiveSpeed(a.battler, { trickRoom: opts.trickRoom });
    const bSpe = effectiveSpeed(b.battler, { trickRoom: opts.trickRoom });
    if (bSpe !== aSpe) return bSpe - aSpe;
    return a.index - b.index;
  });
  const rng = opts.rng;
  if (rng === undefined) return sorted;
  let start = 0;
  while (start < sorted.length) {
    let end = start + 1;
    while (
      end < sorted.length &&
      sorted[end].move.pri === sorted[start].move.pri &&
      effectiveSpeed(sorted[end].battler, { trickRoom: opts.trickRoom }) ===
        effectiveSpeed(sorted[start].battler, { trickRoom: opts.trickRoom })
    ) {
      end += 1;
    }
    for (let i = end - 1; i > start; i -= 1) {
      const j = start + Math.floor(rng() * (i - start + 1));
      const tmp = sorted[i];
      sorted[i] = sorted[j];
      sorted[j] = tmp;
    }
    start = end;
  }
  return sorted;
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

/** Multi-hit step (Black 2 btl_calc.c cutoffs {0,0,35,70,85,100}):
 *  roll <35 -> 2 hits, <70 -> 3, <85 -> 4, else 5
 *  (35/35/15/15%). The old uniform 2+floor(rng*4) gave 25% each
 *  and is replaced by this table. Deterministic in tests when
 *  rng is a fixed sequence. */
export function multiHitCount(move: Move, rng: Rng = Math.random): number {
  if (move.effect !== "MULTI_HIT") return 1;
  const roll = Math.floor(rng() * 100);
  if (roll < 35) return 2;
  if (roll < 70) return 3;
  if (roll < 85) return 4;
  return 5;
}
