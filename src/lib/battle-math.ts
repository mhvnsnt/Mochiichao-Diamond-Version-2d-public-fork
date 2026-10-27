/**
 * battle-math.ts — Mochiichao battle math, staged (NOT yet wired into BattleView).
 *
 * What this is: a pure, dependency-free port of the battle-math SHAPE from the
 * three decomp baselines (FireRed first, then HeartGold, then Black 2 — see
 * BATTLE-MATH-PLAN.md for the per-file source map). Systems, structure, rules
 * and numbers come over literally; only literal creature/move names were ever
 * in the sources, and none appear here — every input is parameterized, so no
 * species stats are set by this module (Pebblefist HP and Dorowani/Gabu stats
 * are untouched, as ordered).
 *
 * What this is NOT: a copy of decomp code. The pipeline below is reimplemented
 * in this module's own structure, with its own names, and its own documented
 * step order. Where the three baselines disagree, the choice is documented
 * inline and in BATTLE-MATH-PLAN.md §4 (Divergences), never silently picked.
 *
 * Conventions used throughout (all taken from the baselines):
 * - Stat stages use the -6..+6 convention (0 = default), matching the game's
 *   existing MochiiInstance.stages shape. The baselines store 0..12 with 6 as
 *   default; this module converts at the boundary, it does not re-store.
 * - RNG is injected as `() => number` in [0, 1). Default is Math.random.
 *   Tests pass deterministic sequences, so every roll in this file is pinned.
 * - All damage arithmetic floors at each division step, exactly as the
 *   integer arithmetic in the baselines does. Do NOT "simplify" this into one
 *   floating-point expression: the floor placement changes results by 1.
 * - Damage step order in this module (pinned by the tests):
 *     base (stage-adjusted A/D) -> burn/screen -> weather -> +2 ->
 *     crit -> helping-hand/charged -> STAB -> type product -> roll (85-100)
 *   The Black 2 baseline applies the roll BEFORE STAB/type; that ordering
 *   differs only in 1-damage flooring cases and is flagged in the plan doc.
 *   This module applies the roll LAST to stay compatible with the game's
 *   current BattleView roll placement.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Element labels, exactly as the game's existing ElementType union spells them. */
export type BattleElement = string;

export type MoveCategory = "Physical" | "Special" | "Status";

export type Weather = "none" | "rain" | "sun" | "sandstorm" | "hail";

/** -6..+6 stage for one stat, or for accuracy / evasion. */
export type Stage = number;

export interface BattlerInput {
  level: number;
  /** Raw (pre-stage) stats. */
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  maxHp: number;
  /** Creature elements, e.g. ["WATER"] or ["WATER", "FLYING"]. */
  elements: BattleElement[];
  stages: {
    atk: Stage;
    def: Stage;
    spa: Stage;
    spd: Stage;
    spe: Stage;
    acc: Stage;
    eva: Stage;
  };
  /** Primary status: "sleep" | "poison" | "toxic" | "burn" | "freeze" | "paralysis" | null. */
  status: string | null;
  /** Turns of sleep remaining (counts down once per turn the battler is asleep). */
  sleepTurns?: number;
  /** Toxic counter: 1 on the first end-turn tick, +1 each tick after. */
  toxicCounter?: number;
  /** Volatile flags set by move effects this turn / battle. */
  flinched?: boolean;
  confusionTurns?: number;
}

export interface MoveInput {
  power: number;
  /** 0 (or negative) = never misses — the always-hit convention. */
  accuracy: number;
  category: MoveCategory;
  element: BattleElement;
  /** Priority bracket, e.g. 0 normal, +1 first-strike. Higher acts first. */
  priority: number;
  /** Extra crit stages from the move itself (high-crit moves contribute +1). */
  critStageBonus?: number;
}

export interface DamageOptions {
  /** Defending side's screen: "reflect" halves Physical, "lightscreen" halves Special. Singles only; doubles uses 2/3 (see plan doc). */
  screen?: "reflect" | "lightscreen" | null;
  weather?: Weather;
  /** Ally used a helping-hand-style boost this turn. */
  helpingHand?: boolean;
  /** Attacker is charged (doubles the next Electric-type move). */
  charged?: boolean;
  /** Crit multiplier. Default 2 — the value in ALL THREE baselines. The live
   *  BattleView currently uses 1.5; wiring must pick one (see plan doc §4). */
  critMultiplier?: number;
  /** Force the crit roll result (used by confusion self-damage: no crit). */
  forceCrit?: boolean;
  /** Skip STAB (used by confusion self-damage: typeless hit). */
  forceNoStab?: boolean;
  /** Per-defending-element multipliers, in the defender's element order.
   *  The caller owns the chart (the game already has one); this module only
   *  defines the SHAPE: multiply across elements, 0 wins, min 1 when nonzero. */
  typeMultipliers?: number[];
  rng?: Rng;
}

export type Rng = () => number;

// ---------------------------------------------------------------------------
// Tables (exact fractions — no rounded decimals)
// ---------------------------------------------------------------------------

/** Stat-stage ratios, -6..+6. FireRed stores these as 10/40..40/10; Black 2
 *  stores the same ratios reduced as 2/8..8/2. Same values either way. */
export const STAT_STAGE_RATIOS: ReadonlyArray<readonly [number, number]> = [
  [2, 8], // -6
  [2, 7], // -5
  [2, 6], // -4
  [2, 5], // -3
  [2, 4], // -2
  [2, 3], // -1
  [2, 2], //  0
  [3, 2], // +1
  [4, 2], // +2
  [5, 2], // +3
  [6, 2], // +4
  [7, 2], // +5
  [8, 2], // +6
];

/** Accuracy/evasion-stage ratios, -6..+6. Black 2's exact fractions
 *  (6/18..18/6). FireRed rounds the same ratios to hundredths
 *  (33/100, 36/100, 43/100, ...); the fractions are used here. */
export const ACCURACY_STAGE_RATIOS: ReadonlyArray<readonly [number, number]> = [
  [6, 18], // -6
  [6, 16], // -5
  [6, 14], // -4
  [6, 12], // -3
  [6, 10], // -2
  [6, 8], // -1
  [6, 6], //  0
  [8, 6], // +1
  [10, 6], // +2
  [12, 6], // +3
  [14, 6], // +4
  [16, 6], // +5
  [18, 6], // +6
];

/** Crit chance at each crit stage: 1 in N. Identical in all three baselines. */
export const CRIT_CHANCE_DENOMINATORS = [16, 8, 4, 3, 2] as const;

/** Multi-hit distribution for 2–5-hit moves (Black 2 table, percent cutoffs):
 *  roll <35 -> 2 hits, <70 -> 3, <85 -> 4, else 5. */
export const MULTI_HIT_CUTOFFS = [35, 70, 85] as const;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

export function clampStage(stage: number): number {
  return Math.max(-6, Math.min(6, Math.trunc(stage)));
}

/** Stage ratio as an exact [numerator, denominator] pair. */
export function stageRatio(stage: number): readonly [number, number] {
  return STAT_STAGE_RATIOS[clampStage(stage) + 6];
}

/** Apply a stat stage to a raw stat, floored (integer division in baselines). */
export function applyStage(raw: number, stage: number): number {
  const [num, den] = stageRatio(stage);
  return Math.floor((raw * num) / den);
}

/** Change a stage by delta, clamped to -6..+6. Returns the new stage. */
export function changeStage(current: number, delta: number): number {
  return clampStage(current + delta);
}

/** Deterministic RNG from a fixed sequence (for tests and replays). Loops. */
export function rngFromSequence(values: number[]): Rng {
  let i = 0;
  return () => {
    const v = values[i % values.length];
    i += 1;
    return v;
  };
}

// ---------------------------------------------------------------------------
// Speed order + priority
// ---------------------------------------------------------------------------

/**
 * Effective Speed for turn order: raw Speed, stage-adjusted, then paralysis
 * quarters it (baseline rule, applied after stages). A weather-speed
 * multiplier (×2 in rain/sun for the matching trait) and a held-item speed
 * halver are accepted as explicit parameters because the game has no
 * trait/held-item system yet — wiring passes 1 / false until it does.
 *
 * Black 2 additions (btl_server_flow.c ServerEvent_CalculateSpeed):
 * the result is capped at 10000, and when the inversion flag is set
 * (the Trick-Room-style effect) the capped speed is replaced by
 * 10000 - speed. The cap is applied BEFORE the inversion, exactly as
 * in the baseline: a capped 10000 speed inverts to 0.
 */
export function effectiveSpeed(
  battler: BattlerInput,
  opts: {
    weatherSpeedMultiplier?: number;
    speedHalvedByItem?: boolean;
    /** Trick-Room-style inversion: capped speed becomes 10000 - speed. */
    trickRoom?: boolean;
  } = {},
): number {
  let speed = applyStage(battler.speed, battler.stages.spe);
  speed = Math.floor(speed * (opts.weatherSpeedMultiplier ?? 1));
  if (opts.speedHalvedByItem) speed = Math.floor(speed / 2);
  if (battler.status === "paralysis") speed = Math.floor(speed / 4);
  if (speed > 10000) speed = 10000;
  if (opts.trickRoom) speed = 10000 - speed;
  return speed;
}

export interface OrderEntry {
  id: string;
  move: MoveInput;
  battler: BattlerInput;
  /** Effective speed, precomputed by the caller via effectiveSpeed. */
  effSpeed: number;
}

/**
 * Order two battlers for one turn, baseline shape:
 *   1. Higher move priority acts first, regardless of Speed.
 *   2. On equal priority, higher effective Speed acts first.
 *   3. On an exact tie, a coin flip decides (baseline: 1 random bit).
 * Returns [first, second]. A non-move action (e.g. switching) is NOT given a
 * magic priority here — the caller maps it (Black 2 sorts switch/shift
 * actions ahead of fight actions; see plan doc §3.6).
 */
export function orderPair(
  a: OrderEntry,
  b: OrderEntry,
  rng: Rng = Math.random,
): [OrderEntry, OrderEntry] {
  if (a.move.priority !== b.move.priority) {
    return a.move.priority > b.move.priority ? [a, b] : [b, a];
  }
  if (a.effSpeed !== b.effSpeed) {
    return a.effSpeed > b.effSpeed ? [a, b] : [b, a];
  }
  return rng() < 0.5 ? [a, b] : [b, a];
}

/** Action kind for the full turn-order key, Black 2 values
 *  (btl_server_flow.c ServerControl_MakeActionOrder): fight/shift/skip
 *  = 0, rotation = 1, item = 2, change = 3, escape/null = 4. A higher
 *  kind acts before any lower kind, whatever the move priority is. */
export type ActionKind = 0 | 1 | 2 | 3 | 4;

export interface OrderActionEntry {
  id: string;
  /** Signed move priority (-7..+7); non-move actions ignore this. */
  priority: number;
  /** Effective speed, precomputed by the caller via effectiveSpeed. */
  effSpeed: number;
  kind?: ActionKind;
  /**
   * Special priority (bits 13..15 of the Black 2 key): default 1.
   * A Stall-style effect rewrites it to 0, so the battler acts last
   * inside its own priority bracket without changing its priority.
   */
  specialPriority?: number;
}

/**
 * Black 2 turn-order key (btl_server_flow.c ActionOrder_MakeKey),
 * sorted descending: kind<<22 | (priority+7)<<16 | specialPriority<<13
 * | (effSpeed & 0x1fff). The +7 offset maps signed priority -7..+7
 * to the unsigned 0..14 range the baseline stores. Speed is masked
 * to 13 bits, matching the baseline (effectiveSpeed already caps at
 * 10000, which fits in 13 bits).
 */
export function actionOrderKey(entry: OrderActionEntry): number {
  const kind = (entry.kind ?? 0) & 7;
  const priority = (entry.priority + 7) & 0x3f;
  const special = (entry.specialPriority ?? 1) & 7;
  const speed = entry.effSpeed & 0x1fff;
  return (kind << 22) | (priority << 16) | (special << 13) | speed;
}

/**
 * Order any number of actions for one turn by the full Black 2 key.
 * Exact key ties are broken randomly when an rng is given (Fisher-Yates
 * shuffle inside each equal-key group, matching the baseline's random
 * tie in ActionOrder_Sort); without an rng, ties keep input order.
 * orderPair above is the 2-battler convenience form of this rule.
 */
export function orderActions<T extends OrderActionEntry>(
  actions: T[],
  rng?: Rng,
): T[] {
  const sorted = [...actions].sort((a, b) => {
    const keyDiff = actionOrderKey(b) - actionOrderKey(a);
    return keyDiff !== 0 ? keyDiff : 0;
  });
  if (rng === undefined) return sorted;
  // Shuffle each maximal run of equal keys, in place, last-to-first.
  let start = 0;
  while (start < sorted.length) {
    let end = start + 1;
    while (end < sorted.length && actionOrderKey(sorted[end]) === actionOrderKey(sorted[start])) {
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

// ---------------------------------------------------------------------------
// Accuracy
// ---------------------------------------------------------------------------

/**
 * Accuracy threshold (percent) for a move, baseline shape:
 *   netStage = clamp(attacker acc stage - defender eva stage, -6, +6)
 *   threshold = move accuracy × accuracy-stage ratio at netStage
 * Foresight-style effects: pass foresight=true. Two baselines differ
 * here, so the rule is explicit:
 *   - "firered" (default, kept for the pinned tests): evasion is
 *     ignored entirely — net = attacker acc stage alone.
 *   - "black2" (btl_server_flow.c ServerEvent_CheckHit): only a
 *     POSITIVE evasion stage is neutralized (evasion forced to 0);
 *     a lowered evasion stage still helps the attacker.
 * An evasion-boosting held item scales the threshold by
 * (100 - param)/100 afterwards.
 * Accuracy 0 (or less) = always hits; the caller must still check the
 * never-miss result, it does not roll. Thresholds above 100 are NOT clamped
 * here (FireRed's uncapped calc; a roll of 1..100 still always hits).
 * For the Black 2 capped value, use accuracyThresholdBlack2.
 */
export function accuracyThreshold(
  move: MoveInput,
  attacker: BattlerInput,
  defender: BattlerInput,
  opts: {
    foresight?: boolean;
    foresightRule?: "firered" | "black2";
    evasionItemParam?: number;
  } = {},
): number {
  if (move.accuracy <= 0) return Infinity;
  let net: number;
  if (opts.foresight && opts.foresightRule === "black2") {
    const effEva = defender.stages.eva > 0 ? 0 : defender.stages.eva;
    net = clampStage(attacker.stages.acc - effEva);
  } else if (opts.foresight) {
    net = clampStage(attacker.stages.acc);
  } else {
    net = clampStage(attacker.stages.acc - defender.stages.eva);
  }
  const [num, den] = ACCURACY_STAGE_RATIOS[net + 6];
  let threshold = Math.floor((move.accuracy * num) / den);
  if (opts.evasionItemParam !== undefined) {
    threshold = Math.floor((threshold * (100 - opts.evasionItemParam)) / 100);
  }
  return threshold;
}

/**
 * Black 2-exact accuracy threshold (btl_calc.c
 * BtlCalc_ApplyAccuracyStage + btl_server_flow.c ServerEvent_CheckHit):
 * same stage math as accuracyThreshold, but the stage-adjusted value is
 * capped at 100 (ApplyAccuracyStage caps, and CheckHit caps again after
 * its accuracy ratio, which defaults to 1 here). The roll is still
 * rollAccuracy: Black 2 rolls BattleRandom(100) < chance, which has
 * the same hit probability as this module's 1..100 roll.
 */
export function accuracyThresholdBlack2(
  move: MoveInput,
  attacker: BattlerInput,
  defender: BattlerInput,
  opts: {
    foresight?: boolean;
    foresightRule?: "firered" | "black2";
    evasionItemParam?: number;
  } = {},
): number {
  if (move.accuracy <= 0) return Infinity;
  const threshold = accuracyThreshold(move, attacker, defender, opts);
  return Math.min(100, threshold);
}

/**
 * Guaranteed-hit bypass (btl_server_flow.c IsGuaranteedHit +
 * ServerEvent_CheckAlwaysHit): true when either battler has the
 * No-Guard-style ability, the attacker has a Lock-On-style condition
 * on this target, the attacker has an Always-Hit condition, or the
 * move itself is flagged always-hit. A guaranteed hit skips the
 * accuracy roll entirely; the caller still checks type immunity
 * separately, exactly as the baseline does.
 */
export function isGuaranteedHit(opts: {
  noGuard?: boolean;
  lockOn?: boolean;
  alwaysHitCondition?: boolean;
  alwaysHitMove?: boolean;
} = {}): boolean {
  return Boolean(
    opts.noGuard || opts.lockOn || opts.alwaysHitCondition || opts.alwaysHitMove,
  );
}

/**
 * One-hit-KO hit check (btl_server_flow.c ServerEvent_CheckOHKOHit,
 * same shape in HeartGold BtlCmd_TryOHKOMove): an attacker below the
 * target's level never lands it; otherwise the chance is the move's
 * accuracy plus one per level the attacker leads by, rolled as
 * floor(rng * 100) < chance. A guaranteed hit bypasses the roll.
 */
export function checkOHKOHit(
  attackerLevel: number,
  targetLevel: number,
  moveAccuracy: number,
  rng: Rng = Math.random,
  opts: { guaranteed?: boolean } = {},
): boolean {
  if (opts.guaranteed) return true;
  if (attackerLevel < targetLevel) return false;
  const chance = moveAccuracy + (attackerLevel - targetLevel);
  return Math.floor(rng() * 100) < chance;
}

/**
 * Escape chance on the Black 2 0..256 scale
 * (btl_server_flow.c ServerControl_EscapeSub, integer arithmetic kept
 * exact: floor(floor(speed*4096/enemySpeed)*128/4096) + 30 per prior
 * failed attempt). A faster raw speed escapes automatically — that
 * case is handled by rollEscape, not by this number.
 */
export function escapeChance(
  speed: number,
  enemySpeed: number,
  failedAttempts = 0,
): number {
  if (enemySpeed <= 0) return 256;
  const base = Math.floor(Math.floor((speed * 4096) / enemySpeed) * 128 / 4096);
  return base + failedAttempts * 30;
}

/**
 * Escape roll: true when the battler gets away. Faster raw speed
 * always escapes; otherwise floor(rng * 256) < escapeChance must hold,
 * so a chance of 256+ (many failed attempts) always escapes and a
 * chance of 0 never does.
 */
export function rollEscape(
  speed: number,
  enemySpeed: number,
  failedAttempts = 0,
  rng: Rng = Math.random,
): boolean {
  if (speed > enemySpeed) return true;
  return Math.floor(rng() * 256) < escapeChance(speed, enemySpeed, failedAttempts);
}

/**
 * Roll the accuracy check. Hit iff (floor(rng*100) + 1) <= threshold — the
 * baseline rolls 1..100 and misses only when the roll EXCEEDS the threshold,
 * so a threshold of exactly 100 with a roll of 100 still hits.
 */
export function rollAccuracy(threshold: number, rng: Rng = Math.random): boolean {
  if (!Number.isFinite(threshold)) return true;
  return Math.floor(rng() * 100) + 1 <= threshold;
}

// ---------------------------------------------------------------------------
// Critical hits
// ---------------------------------------------------------------------------

/**
 * Crit stage from its additive sources (baseline shape):
 * focus-energy-style effect +2, high-crit move +1, scope-lens-style item +1,
 * plus any move bonus passed in. Clamped to 0..4 (table length - 1).
 */
export function critStageFrom(opts: {
  focusEnergy?: boolean;
  highCritMove?: boolean;
  scopeLensItem?: boolean;
  moveBonus?: number;
} = {}): number {
  const stage =
    (opts.focusEnergy ? 2 : 0) +
    (opts.highCritMove ? 1 : 0) +
    (opts.scopeLensItem ? 1 : 0) +
    (opts.moveBonus ?? 0);
  return Math.max(0, Math.min(4, stage));
}

/**
 * Roll a crit at a crit stage: 1-in-N chance, N from the table
 * (Black 2: BattleRandom(denom) == 0). An always-crit move bypasses
 * the roll (ServerEvent_CheckCritical: PML_MoveIsAlwaysCrit).
 */
export function rollCrit(
  critStage: number,
  rng: Rng = Math.random,
  opts: { alwaysCrit?: boolean } = {},
): boolean {
  if (opts.alwaysCrit) return true;
  const denom =
    CRIT_CHANCE_DENOMINATORS[Math.max(0, Math.min(4, critStage))];
  return Math.floor(rng() * denom) === 0;
}

// ---------------------------------------------------------------------------
// Weather power modifier
// ---------------------------------------------------------------------------

/** Rain: Water ×1.5, Fire ×0.5. Sun: Fire ×1.5, Water ×0.5. Else ×1.
 *  Returns [numerator, denominator] so callers floor exactly once. */
export function weatherPowerRatio(
  weather: Weather,
  element: BattleElement,
): readonly [number, number] {
  if (weather === "rain") {
    if (element === "WATER") return [15, 10];
    if (element === "FIRE") return [5, 10];
  }
  if (weather === "sun") {
    if (element === "FIRE") return [15, 10];
    if (element === "WATER") return [5, 10];
  }
  return [1, 1];
}

// ---------------------------------------------------------------------------
// Damage
// ---------------------------------------------------------------------------

export interface DamageResult {
  damage: number;
  isCrit: boolean;
  /** Type product across the defender's elements (0, 0.25, 0.5, 1, 2, 4, ...). */
  typeMultiplier: number;
  isStab: boolean;
  /** Damage-roll percent actually rolled, 85..100. */
  rollPercent: number;
  /** 0 for a damaging move that had no effect; otherwise the pre-roll value. */
  preRollDamage: number;
}

/**
 * Full damage pipeline for one damaging move. Status moves (power 0 /
 * category "Status") return 0 — the caller handles their effects separately.
 *
 * Crit stage rule (baseline, both Physical and Special): a crit IGNORES the
 * attacker's unfavourable attack stage (uses the raw stat when the stage is
 * negative) and IGNORES the defender's favourable defence stage (uses the
 * raw stat when the stage is positive). Favourable attacker / unfavourable
 * defender stages still apply on a crit.
 */
export function calculateDamage(
  attacker: BattlerInput,
  defender: BattlerInput,
  move: MoveInput,
  opts: DamageOptions = {},
): DamageResult {
  const rng = opts.rng ?? Math.random;
  const noEffect: DamageResult = {
    damage: 0,
    isCrit: false,
    typeMultiplier: 0,
    isStab: false,
    rollPercent: 100,
    preRollDamage: 0,
  };
  if (move.category === "Status" || move.power <= 0) return { ...noEffect, typeMultiplier: 1 };

  const isPhysical = move.category === "Physical";
  const rawAtk = isPhysical ? attacker.attack : attacker.spAttack;
  const rawDef = isPhysical ? defender.defense : defender.spDefense;
  const atkStage = isPhysical ? attacker.stages.atk : attacker.stages.spa;
  const defStage = isPhysical ? defender.stages.def : defender.stages.spd;

  const isCrit =
    opts.forceCrit ?? rollCrit(critStageFrom({ moveBonus: move.critStageBonus ?? 0 }), rng);

  // Stage-adjusted attack / defence, with the crit-ignore rule.
  const atk = isCrit
    ? atkStage > 0
      ? applyStage(rawAtk, atkStage)
      : rawAtk
    : applyStage(rawAtk, atkStage);
  const def = isCrit
    ? defStage < 0
      ? applyStage(rawDef, defStage)
      : rawDef
    : applyStage(rawDef, defStage);

  // Base: floor(floor(floor((2L/5 + 2) * power * A / D) / 50)); min 1, then +2.
  const levelTerm = Math.floor((2 * attacker.level) / 5) + 2;
  let basePre = Math.floor((levelTerm * move.power * atk) / def);
  basePre = Math.floor(basePre / 50);
  // Burn halves Physical damage (before +2). No Guts-style exception exists
  // in the game yet, so no exception parameter is offered.
  if (isPhysical && attacker.status === "burn") basePre = Math.floor(basePre / 2);
  // Screens halve the matching category (singles rule).
  if (isPhysical && opts.screen === "reflect") basePre = Math.floor(basePre / 2);
  if (!isPhysical && opts.screen === "lightscreen") basePre = Math.floor(basePre / 2);
  // Weather power mod.
  const [wNum, wDen] = weatherPowerRatio(opts.weather ?? "none", move.element);
  basePre = Math.floor((basePre * wNum) / wDen);
  if (basePre === 0) basePre = 1;
  let damage = basePre + 2;

  // Crit, then helping-hand / charged boosts.
  if (isCrit) damage = Math.floor(damage * (opts.critMultiplier ?? 2));
  if (opts.helpingHand) damage = Math.floor((damage * 15) / 10);
  if (opts.charged && move.element === "ELECTRIC") damage = damage * 2;

  // STAB: ×1.5 when the move element matches an attacker element.
  const isStab =
    !opts.forceNoStab && attacker.elements.includes(move.element);
  if (isStab) damage = Math.floor((damage * 15) / 10);

  // Type product across defending elements; 0 wins outright.
  const multipliers = opts.typeMultipliers ?? defender.elements.map(() => 1);
  const typeMultiplier = multipliers.reduce((acc, m) => acc * m, 1);
  if (typeMultiplier === 0) return { ...noEffect, typeMultiplier: 0, isCrit, isStab };
  damage = Math.floor(damage * typeMultiplier);
  if (damage === 0) damage = 1;
  const preRollDamage = damage;

  // Damage roll: 85..100 (baseline rolls 0..15 and subtracts from 100).
  const rollPercent = 100 - Math.floor(rng() * 16);
  damage = Math.floor((damage * rollPercent) / 100);
  if (damage === 0) damage = 1;

  return {
    damage,
    isCrit,
    typeMultiplier,
    isStab,
    rollPercent,
    preRollDamage,
  };
}

/** Combine per-element multipliers (the type-effectiveness SHAPE).
 *  Example: [2, 0.5] -> 1; [2, 2] -> 4; anything containing 0 -> 0. */
export function combineTypeMultipliers(multipliers: number[]): number {
  return multipliers.reduce((acc, m) => acc * m, 1);
}

/**
 * Confusion self-damage: a 40-power, typeless Physical hit against the
 * battler itself (baseline rule), no STAB, no crit, type multiplier 1.
 */
export function confusionDamage(
  battler: BattlerInput,
  rng: Rng = Math.random,
): number {
  const result = calculateDamage(
    battler,
    battler,
    { power: 40, accuracy: 0, category: "Physical", element: "__TYPELESS__", priority: 0 },
    { forceCrit: false, forceNoStab: true, typeMultipliers: [1], rng },
  );
  return result.damage;
}

/** Recoil damage from damage dealt: floor(dealt * numerator / denominator).
 *  The game's recoil move uses 1/4. Minimum 0 (recoil never exceeds dealt). */
export function recoilDamage(
  dealt: number,
  numerator = 1,
  denominator = 4,
): number {
  return Math.floor((dealt * numerator) / denominator);
}

/** Multi-hit count for a 2–5-hit move from one roll. */
export function rollMultiHitCount(rng: Rng = Math.random): number {
  const roll = Math.floor(rng() * 100);
  if (roll < MULTI_HIT_CUTOFFS[0]) return 2;
  if (roll < MULTI_HIT_CUTOFFS[1]) return 3;
  if (roll < MULTI_HIT_CUTOFFS[2]) return 4;
  return 5;
}

// ---------------------------------------------------------------------------
// Held-item effects that touch battle math (no held-item system exists in the
// game yet — BagView "Give" is disabled — so these are pure functions the
// wiring calls once a held item is actually equipped).
// ---------------------------------------------------------------------------

export type HeldItemEffect =
  | { kind: "choice-band" }
  | { kind: "type-boost"; element: BattleElement; percent: number }
  | { kind: "scope-lens" }
  | { kind: "evasion-up"; param: number }
  | { kind: "quick-claw"; percent: number }
  | { kind: "leftovers" }
  | { kind: "none" };

/** Attack after a held-item boost. Choice Band ×1.5 (Physical only — the
 *  caller checks the category). Type-boost items: ×(100 + param)/100, where
 *  the baseline param is 10 for the standard type items. */
export function heldItemAttack(
  attack: number,
  item: HeldItemEffect,
  move: MoveInput,
): number {
  if (item.kind === "choice-band" && move.category === "Physical") {
    return Math.floor((attack * 15) / 10);
  }
  if (
    item.kind === "type-boost" &&
    item.element === move.element
  ) {
    return Math.floor((attack * (100 + item.percent)) / 100);
  }
  return attack;
}

/** Quick Claw-style first strike: true iff the roll beats the item percent. */
export function rollQuickClaw(percent: number, rng: Rng = Math.random): boolean {
  return Math.floor(rng() * 100) < percent;
}

// ---------------------------------------------------------------------------
// Status: can-act checks (start of the battler's turn) and end-turn ticks
// ---------------------------------------------------------------------------

export type CanActResult =
  | { canAct: true; battler: BattlerInput }
  | { canAct: false; reason: string; battler: BattlerInput };

/**
 * Start-of-turn cancellers, in baseline order of relevance for this game:
 * flinch (blocked for this turn) -> sleep (counts down, wakes at 0) ->
 * freeze (20% thaw per turn) -> paralysis (25% full paralysis) ->
 * confusion (counts down, snaps out at 0, else 50% self-hit).
 * Returns the updated battler (counters already decremented) so the caller
 * just stores it. Self-hit damage is NOT applied here — the caller rolls
 * confusionDamage() when reason is "confusion-self-hit".
 */
export function checkCanAct(
  battler: BattlerInput,
  rng: Rng = Math.random,
): CanActResult {
  if (battler.flinched) {
    return {
      canAct: false,
      reason: "flinched",
      battler: { ...battler, flinched: false },
    };
  }
  if (battler.status === "sleep") {
    const remaining = (battler.sleepTurns ?? 1) - 1;
    if (remaining <= 0) {
      return {
        canAct: true,
        battler: { ...battler, status: null, sleepTurns: 0 },
      };
    }
    return {
      canAct: false,
      reason: "asleep",
      battler: { ...battler, sleepTurns: remaining },
    };
  }
  if (battler.status === "freeze") {
    // Baseline: Random() % 5 == 0 thaws (20% per turn).
    if (Math.floor(rng() * 5) === 0) {
      return { canAct: true, battler: { ...battler, status: null } };
    }
    return { canAct: false, reason: "frozen", battler };
  }
  if (battler.status === "paralysis") {
    // Baseline: Random() % 4 == 0 fully paralyzes (25%).
    if (Math.floor(rng() * 4) === 0) {
      return { canAct: false, reason: "fully-paralyzed", battler };
    }
  }
  const confusionTurns = battler.confusionTurns ?? 0;
  if (confusionTurns > 0) {
    const remaining = confusionTurns - 1;
    if (remaining <= 0) {
      return {
        canAct: true,
        battler: { ...battler, confusionTurns: 0 },
      };
    }
    // Baseline: Random() & 1 — 50% self-hit.
    if (rng() < 0.5) {
      return {
        canAct: false,
        reason: "confusion-self-hit",
        battler: { ...battler, confusionTurns: remaining },
      };
    }
    return {
      canAct: true,
      battler: { ...battler, confusionTurns: remaining },
    };
  }
  return { canAct: true, battler };
}

/** Sleep duration on infliction: 2–5 turns (baseline). */
export function rollSleepTurns(rng: Rng = Math.random): number {
  return Math.floor(rng() * 4) + 2;
}

/** Confusion duration on infliction: 2–5 turns (baseline). */
export function rollConfusionTurns(rng: Rng = Math.random): number {
  return Math.floor(rng() * 4) + 2;
}

/**
 * End-turn status damage (min 1, floored): poison 1/8 max HP, burn 1/8,
 * toxic 1/16 × toxicCounter. Returns 0 when the status does not tick.
 * Weather damage (sandstorm/hail) is separate: see weatherEndTurnDamage.
 */
export function endTurnStatusDamage(battler: BattlerInput): number {
  const min1 = (v: number) => Math.max(1, Math.floor(v));
  if (battler.status === "poison") return min1(battler.maxHp / 8);
  if (battler.status === "burn") return min1(battler.maxHp / 8);
  if (battler.status === "toxic") {
    return min1(battler.maxHp / 16) * Math.max(1, battler.toxicCounter ?? 1);
  }
  return 0;
}

/**
 * End-turn damaging-weather damage: 1/16 max HP (min 1), unless the battler
 * is immune — sandstorm spares Rock / Ground / Steel elements, hail spares
 * Ice. Rain and sun deal no end-turn damage.
 */
export function weatherEndTurnDamage(
  battler: BattlerInput,
  weather: Weather,
): number {
  if (weather === "sandstorm") {
    if (battler.elements.some((e) => e === "ROCK" || e === "GROUND" || e === "STEEL")) return 0;
    return Math.max(1, Math.floor(battler.maxHp / 16));
  }
  if (weather === "hail") {
    if (battler.elements.includes("ICE")) return 0;
    return Math.max(1, Math.floor(battler.maxHp / 16));
  }
  return 0;
}

/** Leftovers-style end-turn heal: 1/16 max HP (min 1), capped at full HP. */
export function leftoversHeal(currentHp: number, maxHp: number): number {
  if (currentHp >= maxHp) return 0;
  return Math.min(maxHp - currentHp, Math.max(1, Math.floor(maxHp / 16)));
}

/**
 * Apply one secondary-effect chance roll: true iff the roll beats the
 * effect chance (percent). A chance of 100 always applies, 0 never does.
 */
export function rollSecondaryEffect(
  chancePercent: number,
  rng: Rng = Math.random,
): boolean {
  if (chancePercent <= 0) return false;
  if (chancePercent >= 100) return true;
  return Math.floor(rng() * 100) < chancePercent;
}
