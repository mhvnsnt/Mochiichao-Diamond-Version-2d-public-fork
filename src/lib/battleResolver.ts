/**
 * Battle resolver — Showdown-style DATA-TABLE + RESOLVER architecture, ported
 * as architecture only (Showdown server is MIT; no Showdown data, code, or
 * Pokemon values are copied here).
 *
 * Turn loop (plan §1b / §2f): turn order by Speed → action select → target
 * select → resolve → win/lose check. Damage and effect resolution are driven
 * by move tables (ResolverMove) + a type chart (TypeChart), never by code
 * written per move. Effects are data: a move's `effect` object is interpreted
 * by the generic `applyEffect` below.
 *
 * This module is deliberately a MOD LAYER, not a rewrite: BattleView.tsx
 * keeps its own inline damage path untouched. A later wiring PR may route
 * BattleView through `resolveTurn`; until then this resolver is testable
 * standalone (pure functions, injectable rng) and does not change live play.
 *
 * Battle-math wiring (PR batch 1): damage, speed, accuracy, turn order,
 * multi-hit, recoil, secondary rolls and end-turn ticks now route through
 * src/lib/battle-math.ts, so the numbers below are the battle-math ones,
 * NOT the old resolver ones. Player-visible changes vs the old resolver:
 * crit uses the stage table {16,8,4,3,2} at x2 (HIGH_CRIT = +1 stage) and
 * ignores unfavourable stages on a crit; the old flat 6% / x1.5 is gone.
 * Stat stages use exact fractions (not the rounded table below, which is
 * kept only for backwards-compatible exports); paralysis quarters Speed
 * (was x0.5); burn/poison end-turn ticks are 1/8 max HP (was 1/16);
 * multi-hit is 2/3/4/5 at 35/35/15/15 (was uniform 2–5); speed ties are a
 * coin flip (was player-first); paralysis is a 25% full-paralysis can-act
 * check (was never blocking). Screens, weather and held items are
 * parameter-ready in battle-math and in calculateDamage/resolveTurn
 * options, but no move or system on main sets them yet, so they default
 * to none — see battle-math.ts for the exact rules when they land.
 * Charge-turn moves already had a state machine here (chargingMoveId)
 * and keep it; battle-math deliberately holds no charge state (it is
 * turn state, not math), so that item is not a new held item.
 *
 * Data gaps are NOT filled silently (see docs/battle-resolver.md):
 * - A move type absent from the chart resolves at x1.0 and the event is
 *   flagged `typeChartMissing: true`.
 * - A move id absent from the move table resolves as a failed action
 *   (`unknownMove: true`), never as an invented move.
 * - Species stats, move powers and type matchups are inputs, not defaults.
 */

import {
  accuracyThreshold,
  calculateDamage as battleMathCalculateDamage,
  checkCanAct,
  confusionDamage,
  effectiveSpeed as battleMathEffectiveSpeed,
  endTurnStatusDamage,
  recoilDamage,
  rollAccuracy,
  rollMultiHitCount,
  rollSecondaryEffect,
  weatherEndTurnDamage,
  type BattlerInput as BattleMathBattler,
  type MoveInput as BattleMathMove,
  type Weather as BattleMathWeather,
} from "./battle-math";

export type SideId = "player" | "foe";

export interface BattlerStats {
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export type StatName = "atk" | "def" | "spa" | "spd" | "spe" | "acc" | "eva";

export type StageMap = Record<StatName, number>;

export interface ResolverBattler {
  side: SideId;
  /** Display name (nickname or species name). */
  name: string;
  speciesId: string;
  /** Element names in the caller's vocabulary (12 True Elements preferred;
   *  the chart supplied decides the vocabulary — see battleTypeChart.ts). */
  types: string[];
  level: number;
  hp: number;
  maxHp: number;
  stats: BattlerStats;
  stages: StageMap;
  /** e.g. "burn" | "paralysis" | "poison" | null. */
  status: string | null;
  moves: string[];
  /** Parallel to `moves`; omitted entries default to the move's full PP. */
  pp?: number[];
  /** Volatile per-battle state (charging, flinch) — never persisted. */
  volatile?: {
    chargingMoveId?: string | null;
    flinched?: boolean;
    sleepTurns?: number;
    confusionTurns?: number;
  };
  /** Toxic counter for end-turn ticks (1 on first tick, +1 each tick). */
  toxicCounter?: number;
}

/** Effect as data (plan §1b shape), not code per move. */
export interface ResolverEffect {
  kind:
    | "none"
    | "status"
    | "stat"
    | "recoil"
    | "multiHit"
    | "highCrit"
    | "chargeTurn"
    | "flinch";
  /** For kind "status": "burn" | "paralysis" | "poison" | ... */
  status?: string;
  /** For kind "stat": which stat, and how many stages (-6..+6). */
  stat?: StatName;
  stages?: number;
  /** For kind "recoil": fraction of damage dealt returned to the user. */
  recoilFraction?: number;
  /** Secondary chance 0..1. A primary effect uses chance 1. */
  chance: number;
}

export interface ResolverMove {
  id: string;
  name: string;
  type: string;
  category: "Physical" | "Special" | "Status";
  power: number;
  accuracy: number;
  pp: number;
  priority: number;
  /** Single-target foe by default; "self" for self-targeting moves. */
  target: "foe" | "self" | "allFoes";
  effect: ResolverEffect;
  /** Flags as data (e.g. ["contact"] when a canon source says so). */
  flags?: string[];
}

/** Attacker -> defender -> multiplier. Absent pairs mean x1.0 (flagged). */
export type TypeChart = Record<string, Record<string, number>>;

export interface MoveTable {
  moves: Record<string, ResolverMove>;
}

export type Action =
  | { kind: "move"; side: SideId; moveId: string; targetSide?: SideId }
  | { kind: "pass"; side: SideId }
  | { kind: "run"; side: SideId };

export interface BattleEvent {
  text: string;
  actor?: SideId;
  target?: SideId;
  moveId?: string;
  damage?: number;
  isCrit?: boolean;
  typeMultiplier?: number;
  /** True when the move's type was absent from the supplied chart. */
  typeChartMissing?: boolean;
  unknownMove?: boolean;
  missed?: boolean;
  fainted?: SideId;
  statusApplied?: string;
  statChanged?: { stat: StatName; stages: number; target: SideId };
}

export interface TurnResult {
  battlers: Record<SideId, ResolverBattler>;
  events: BattleEvent[];
  /** Checked after every action and again at turn end. */
  outcome: "ongoing" | "player-win" | "foe-win";
}

/** Injectable rng so tests and replays are deterministic. Default: Math.random. */
export type Rng = () => number;

export const STAGE_MULTIPLIERS: Record<number, number> = {
  "-6": 0.25, "-5": 0.29, "-4": 0.33, "-3": 0.4, "-2": 0.5, "-1": 0.67,
  "0": 1, "1": 1.5, "2": 2, "3": 2.5, "4": 3, "5": 3.5, "6": 4,
};

export function stageMultiplier(stage: number): number {
  const s = Math.max(-6, Math.min(6, Math.round(stage)));
  return STAGE_MULTIPLIERS[s] ?? 1;
}

export function effectiveSpeed(b: ResolverBattler): number {
  // Battle-math: stage-adjusted, then paralysis quarters (was x0.5 here).
  return battleMathEffectiveSpeed(toBattleMathBattler(b));
}

/** Adapter: a resolver battler -> battle-math's parameterized battler input.
 * No species or move names are involved; only numbers, elements and stages. */
export function toBattleMathBattler(b: ResolverBattler): BattleMathBattler {
  return {
    level: b.level,
    attack: b.stats.atk,
    defense: b.stats.def,
    spAttack: b.stats.spa,
    spDefense: b.stats.spd,
    speed: b.stats.spe,
    maxHp: b.maxHp,
    elements: [...b.types],
    stages: {
      atk: b.stages.atk, def: b.stages.def, spa: b.stages.spa,
      spd: b.stages.spd, spe: b.stages.spe, acc: b.stages.acc, eva: b.stages.eva,
    },
    status: b.status,
    sleepTurns: b.volatile?.sleepTurns,
    toxicCounter: b.toxicCounter,
    flinched: b.volatile?.flinched,
    confusionTurns: b.volatile?.confusionTurns,
  };
}

export function typeMultiplier(
  chart: TypeChart,
  moveType: string,
  defenderTypes: string[],
): { multiplier: number; missing: boolean } {
  let m = 1;
  let missing = false;
  const row = chart[moveType];
  if (!row) return { multiplier: 1, missing: true };
  for (const t of defenderTypes) {
    if (row[t] === undefined) {
      missing = true;
    } else {
      m *= row[t];
    }
  }
  return { multiplier: m, missing };
}

/**
 * Order actions: priority first, then effective Speed (battle-math), then
 * a coin flip on an exact tie. Ties get a random key (rng is consumed
 * only when a tie exists); non-tied actions consume no rng. This replaces
 * the old player-first tie-break, which matched no baseline.
 */
export function orderActions(
  actions: Action[],
  battlers: Record<SideId, ResolverBattler>,
  moves: MoveTable,
  rng: Rng = Math.random,
): Action[] {
  const priorityOf = (a: Action): number =>
    a.kind === "move" ? (moves.moves[a.moveId]?.priority ?? 0) : 0;
  const decorated = actions.map((a) => {
    const tied = actions.some(
      (o) =>
        o !== a &&
        priorityOf(o) === priorityOf(a) &&
        effectiveSpeed(battlers[o.side]) === effectiveSpeed(battlers[a.side]),
    );
    return { action: a, priority: priorityOf(a), speed: effectiveSpeed(battlers[a.side]), tieKey: tied ? rng() : 0 };
  });
  decorated.sort((x, y) => y.priority - x.priority || y.speed - x.speed || x.tieKey - y.tieKey);
  return decorated.map((d) => d.action);
}

export interface DamageResult {
  damage: number;
  isCrit: boolean;
  typeMultiplier: number;
  typeChartMissing: boolean;
}

export interface BattleMathDamageOptions {
  /** Defending side's screen; singles rule. No move sets one on main yet. */
  screen?: "reflect" | "lightscreen" | null;
  /** Battle weather; no move or system sets one on main yet. */
  weather?: BattleMathWeather;
}

export function calculateDamage(
  attacker: ResolverBattler,
  defender: ResolverBattler,
  move: ResolverMove,
  chart: TypeChart,
  rng: Rng = Math.random,
  opts: BattleMathDamageOptions = {},
): DamageResult {
  // Per-element multipliers from the caller's chart; an absent pair is x1
  // and flags typeChartMissing, exactly as the old resolver did.
  const row = chart[move.type];
  const missing = !row || defender.types.some((t) => row[t] === undefined);
  const typeMultipliers = defender.types.map((t) => row?.[t] ?? 1);
  const bmMove: BattleMathMove = {
    power: move.power,
    accuracy: move.accuracy,
    category: move.category,
    element: move.type,
    priority: move.priority,
    // HIGH_CRIT is +1 crit stage in battle-math (table {16,8,4,3,2}).
    critStageBonus: move.effect.kind === "highCrit" ? 1 : 0,
  };
  const result = battleMathCalculateDamage(
    toBattleMathBattler(attacker),
    toBattleMathBattler(defender),
    bmMove,
    {
      typeMultipliers,
      rng,
      screen: opts.screen ?? null,
      weather: opts.weather ?? "none",
    },
  );
  return {
    damage: result.damage,
    isCrit: result.isCrit,
    typeMultiplier: result.typeMultiplier,
    typeChartMissing: missing,
  };
}

function cloneBattler(b: ResolverBattler): ResolverBattler {
  return {
    ...b,
    types: [...b.types],
    stats: { ...b.stats },
    stages: { ...b.stages },
    moves: [...b.moves],
    pp: b.pp ? [...b.pp] : undefined,
    toxicCounter: b.toxicCounter,
    volatile: { ...(b.volatile ?? {}) },
  };
}

function checkOutcome(b: Record<SideId, ResolverBattler>): TurnResult["outcome"] {
  if (b.foe.hp <= 0) return "player-win";
  if (b.player.hp <= 0) return "foe-win";
  return "ongoing";
}

function applyStatChange(
  b: ResolverBattler,
  stat: StatName,
  stages: number,
): number {
  const before = b.stages[stat];
  b.stages[stat] = Math.max(-6, Math.min(6, before + stages));
  return b.stages[stat] - before;
}

/**
 * Resolve one full turn. `actions` must contain at most one action per side;
 * sides with no action pass. State is never mutated in place: a new
 * battler record is returned, so callers (and replays) keep the old state.
 *
 * Steps per action, in order: battle-math can-act check (flinch -> sleep
 * -> freeze -> paralysis -> confusion) -> charging check -> accuracy
 * roll -> damage -> secondary effect (chance roll) -> recoil -> faint
 * check. End of turn: battle-math status ticks (poison/burn 1/8, toxic
 * 1/16 x counter) + weather damage when opts.weather is set.
 */
export function resolveTurn(
  state: Record<SideId, ResolverBattler>,
  actions: Action[],
  moves: MoveTable,
  chart: TypeChart,
  rng: Rng = Math.random,
  opts: { weather?: BattleMathWeather } = {},
): TurnResult {
  const battlers: Record<SideId, ResolverBattler> = {
    player: cloneBattler(state.player),
    foe: cloneBattler(state.foe),
  };
  const events: BattleEvent[] = [];
  const ordered = orderActions(actions, battlers, moves, rng);

  for (const action of ordered) {
    const actor = battlers[action.side];
    const foeSide: SideId = action.side === "player" ? "foe" : "player";
    if (actor.hp <= 0) continue;
    if (action.kind === "run") {
      events.push({ text: `${actor.name} fled the battle!`, actor: action.side });
      continue;
    }
    if (action.kind === "pass") continue;
    // Battle-math can-act gate. Counters/status cleared by the gate are
    // written back so the next turn sees them. Sleep/freeze/confusion
    // have no inflicting move on main yet (dormant branches); paralysis
    // full-paralysis (25%) is live. Confusion self-damage is a 40-power
    // typeless hit against the actor itself, via battle-math.
    {
      const gate = checkCanAct(toBattleMathBattler(actor), rng);
      actor.status = gate.battler.status;
      actor.volatile = {
        ...(actor.volatile ?? {}),
        flinched: gate.battler.flinched ?? false,
        sleepTurns: gate.battler.sleepTurns,
        confusionTurns: gate.battler.confusionTurns,
      };
      if (!gate.canAct) {
        // Non-strict-safe: the repo tsconfig has no "strict", so the
        // discriminated union does not narrow on canAct here; use the
        // "in" check instead of gate.reason directly.
        const gateReason = "reason" in gate ? gate.reason : "couldn't move";
        if (gateReason === "confusion-self-hit") {
          const selfDmg = confusionDamage(toBattleMathBattler(actor), rng);
          actor.hp = Math.max(0, actor.hp - selfDmg);
          events.push({
            text: `${actor.name} is confused! It hurt itself in its confusion!`,
            actor: action.side, target: action.side, damage: selfDmg,
          });
          if (actor.hp <= 0) events.push({ text: `${actor.name} fainted!`, target: action.side, fainted: action.side });
          if (checkOutcome(battlers) !== "ongoing") break;
        } else {
          const reasonText =
            gateReason === "flinched" ? `${actor.name} flinched and couldn't move!`
            : gateReason === "asleep" ? `${actor.name} is fast asleep!`
            : gateReason === "frozen" ? `${actor.name} is frozen solid!`
            : gateReason === "fully-paralyzed" ? `${actor.name} is fully paralyzed! It can't move!`
            : `${actor.name} couldn't move!`;
          events.push({ text: reasonText, actor: action.side });
        }
        continue;
      }
    }
    const move = moves.moves[action.moveId];
    if (!move) {
      events.push({
        text: `${actor.name} tried an unknown move (${action.moveId})!`,
        actor: action.side, moveId: action.moveId, unknownMove: true,
      });
      continue;
    }
    // Target select: default foe; a fainted foe retargets to the only
    // remaining foe in a 1v1, which is the same battler — so a fainted
    // target means the battle is already decided and we stop early.
    const targetSide: SideId = move.target === "self" ? action.side : foeSide;
    const target = battlers[targetSide];
    if (target.hp <= 0 && move.target !== "self") {
      events.push({ text: `${actor.name} used ${move.name}, but there was no target!`, actor: action.side, target: targetSide, moveId: move.id });
      continue;
    }
    // PP: decrement when tracked; a move at 0 PP fails instead of firing.
    const moveIdx = actor.moves.indexOf(action.moveId);
    if (moveIdx >= 0 && actor.pp && actor.pp[moveIdx] !== undefined) {
      if (actor.pp[moveIdx] <= 0) {
        events.push({ text: `${actor.name} has no PP left for ${move.name}!`, actor: action.side, moveId: move.id });
        continue;
      }
      actor.pp[moveIdx] -= 1;
    }
    // Charge-turn moves: first use charges, second use fires.
    if (move.effect.kind === "chargeTurn" && actor.volatile?.chargingMoveId !== move.id) {
      actor.volatile = { ...actor.volatile, chargingMoveId: move.id };
      events.push({ text: `${actor.name} began charging ${move.name}!`, actor: action.side, moveId: move.id });
      continue;
    }
    if (actor.volatile?.chargingMoveId === move.id) {
      actor.volatile = { ...actor.volatile, chargingMoveId: null };
    }

    if (move.category === "Status" || move.power === 0) {
      // Status path: the effect object IS the move (data, not code).
      events.push({ text: `${actor.name} used ${move.name}!`, actor: action.side, target: targetSide, moveId: move.id });
      applyEffectEvents(move, actor, target, events, rng);
      if (checkOutcome(battlers) !== "ongoing") break;
      continue;
    }

    const threshold = accuracyThreshold(
      { power: move.power, accuracy: move.accuracy, category: move.category, element: move.type, priority: move.priority },
      toBattleMathBattler(actor),
      toBattleMathBattler(target),
    );
    if (!rollAccuracy(threshold, rng)) {
      events.push({ text: `${actor.name} used ${move.name}, but it missed!`, actor: action.side, target: targetSide, moveId: move.id, missed: true });
      continue;
    }

    const hits = move.effect.kind === "multiHit" ? rollMultiHitCount(rng) : 1;
    let totalDamage = 0;
    let lastCrit = false;
    let lastMult = 1;
    let lastMissing = false;
    for (let h = 0; h < hits; h++) {
      if (target.hp <= 0) break;
      const dmg = calculateDamage(actor, target, move, chart, rng, { weather: opts.weather });
      target.hp = Math.max(0, target.hp - dmg.damage);
      totalDamage += dmg.damage;
      lastCrit = dmg.isCrit;
      lastMult = dmg.typeMultiplier;
      lastMissing = dmg.typeChartMissing;
    }
    let text = `${actor.name} used ${move.name}!`;
    if (hits > 1) text += ` Hit ${hits} time${hits === 1 ? "" : "s"}!`;
    if (lastMult > 1) text += " It's super effective!";
    if (lastMult > 0 && lastMult < 1) text += " It's not very effective...";
    if (lastMult === 0) text += " It had no effect...";
    if (lastCrit) text += " A critical hit!";
    const ev: BattleEvent = {
      text, actor: action.side, target: targetSide, moveId: move.id,
      damage: totalDamage, isCrit: lastCrit, typeMultiplier: lastMult,
    };
    if (lastMissing) ev.typeChartMissing = true;
    events.push(ev);

    if (move.effect.kind === "recoil" && totalDamage > 0) {
      const recoil =
        move.effect.recoilFraction === undefined || move.effect.recoilFraction === 0.25
          ? recoilDamage(totalDamage)
          : Math.floor(totalDamage * move.effect.recoilFraction);
      actor.hp = Math.max(0, actor.hp - recoil);
      events.push({ text: `${actor.name} took ${recoil} recoil damage!`, actor: action.side });
    }
    // Secondary effects (including flinch/stat/status) roll after damage.
    applyEffectEvents(move, actor, target, events, rng, true);
    if (target.hp <= 0) events.push({ text: `${target.name} fainted!`, target: targetSide, fainted: targetSide });
    if (actor.hp <= 0) events.push({ text: `${actor.name} fainted!`, target: action.side, fainted: action.side });
    if (checkOutcome(battlers) !== "ongoing") break;
  }

  // End-of-turn ticks (only while the battle is still ongoing).
  if (checkOutcome(battlers) === "ongoing") {
    for (const side of ["player", "foe"] as SideId[]) {
      const b = battlers[side];
      if (b.hp <= 0) continue;
      const tick = endTurnStatusDamage(toBattleMathBattler(b));
      if (tick > 0) {
        if (b.status === "toxic") b.toxicCounter = (b.toxicCounter ?? 1) + 1;
        b.hp = Math.max(0, b.hp - tick);
        events.push({ text: `${b.name} took ${tick} damage from ${b.status}!`, target: side });
        if (b.hp <= 0) events.push({ text: `${b.name} fainted!`, target: side, fainted: side });
      }
      if (b.hp > 0) {
        const weatherTick = weatherEndTurnDamage(toBattleMathBattler(b), opts.weather ?? "none");
        if (weatherTick > 0) {
          b.hp = Math.max(0, b.hp - weatherTick);
          events.push({ text: `${b.name} took ${weatherTick} damage from the weather!`, target: side });
          if (b.hp <= 0) events.push({ text: `${b.name} fainted!`, target: side, fainted: side });
        }
      }
      if (b.volatile) b.volatile.flinched = false;
    }
  }

  return { battlers, events, outcome: checkOutcome(battlers) };
}

/** Interpret a move's effect object. `secondary` = roll the chance; primary (status moves) always applies. */
function applyEffectEvents(
  move: ResolverMove,
  actor: ResolverBattler,
  target: ResolverBattler,
  events: BattleEvent[],
  rng: Rng,
  secondary = false,
): void {
  const eff = move.effect;
  if (eff.kind === "none" || eff.kind === "highCrit" || eff.kind === "multiHit" || eff.kind === "chargeTurn") return;
  if (secondary && !rollSecondaryEffect(eff.chance * 100, rng)) return;
  if (eff.kind === "status" && eff.status) {
    if (target.hp > 0 && !target.status) {
      target.status = eff.status;
      events.push({ text: `${target.name} was ${eff.status === "paralysis" ? "paralyzed" : eff.status === "burn" ? "burned" : "poisoned"}!`, target: target.side, statusApplied: eff.status });
    }
    return;
  }
  if (eff.kind === "stat" && eff.stat && eff.stages) {
    // Stat-down secondaries hit the target; stat-up primaries hit the user.
    // Legacy moves on main are all secondaries, so target is the default.
    const who = eff.stages < 0 ? target : actor;
    const applied = applyStatChange(who, eff.stat, eff.stages);
    if (applied !== 0) {
      events.push({
        text: `${who.name}'s ${eff.stat} ${eff.stages < 0 ? "fell" : "rose"}!`,
        target: who.side, statChanged: { stat: eff.stat, stages: applied, target: who.side },
      });
    }
    return;
  }
  if (eff.kind === "flinch" && target.hp > 0) {
    target.volatile = { ...target.volatile, flinched: true };
    events.push({ text: `${target.name} flinched!`, target: target.side });
  }
}

/**
 * Adapter: legacy moves.ts Move (species.ts shape) -> plan-shaped ResolverMove.
 * Effect strings are mapped by a TABLE (data), not per-move code. Unknown
 * effect strings map to kind "none" and are reported by the validator in
 * docs/battle-resolver.md — never guessed.
 */
export function legacyEffectToResolverEffect(
  effect: string,
  effectChance: number,
): ResolverEffect {
  const chance = effectChance / 100;
  switch (effect) {
    case "BURN": return { kind: "status", status: "burn", chance };
    case "PARALYSIS": return { kind: "status", status: "paralysis", chance };
    case "POISON": return { kind: "status", status: "poison", chance };
    case "SPDEF_DOWN1": return { kind: "stat", stat: "spd", stages: -1, chance };
    case "DEF_DOWN1": return { kind: "stat", stat: "def", stages: -1, chance };
    case "ACC_DOWN1": return { kind: "stat", stat: "acc", stages: -1, chance };
    case "SPE_DOWN1": return { kind: "stat", stat: "spe", stages: -1, chance };
    // Batch 2 (2026-10-27, wiring lane): the catalogue's stat-stage
    // tokens dispatch through the existing "stat" kind. Positive stages
    // apply to the actor (self-buffs and on-hit self-raises), negative
    // stages to the target -- the resolver's existing convention.
    case "ATK_UP1": return { kind: "stat", stat: "atk", stages: 1, chance };
    case "ATK_DOWN1": return { kind: "stat", stat: "atk", stages: -1, chance };
    case "ATK_DOWN2": return { kind: "stat", stat: "atk", stages: -2, chance };
    case "DEF_UP1": return { kind: "stat", stat: "def", stages: 1, chance };
    case "DEF_UP2": return { kind: "stat", stat: "def", stages: 2, chance };
    case "SPDEF_UP1": return { kind: "stat", stat: "spd", stages: 1, chance };
    case "SPDEF_UP2": return { kind: "stat", stat: "spd", stages: 2, chance };
    case "RECOIL_25": return { kind: "recoil", recoilFraction: 0.25, chance: 1 };
    case "MULTI_HIT": return { kind: "multiHit", chance: 1 };
    case "HIGH_CRIT": return { kind: "highCrit", chance: 1 };
    case "CHARGE_TURN": return { kind: "chargeTurn", chance: 1 };
    case "FLINCH": return { kind: "flinch", chance };
    default: return { kind: "none", chance: 1 };
  }
}

export interface LegacyMove {
  name: string;
  type: string;
  cat: "Physical" | "Special" | "Status";
  bp: number;
  acc: number;
  pp: number;
  pri: number;
  effect: string;
  effectChance: number;
}

export function legacyMoveToResolverMove(id: string, m: LegacyMove): ResolverMove {
  return {
    id,
    name: m.name,
    type: m.type,
    category: m.cat,
    power: m.bp,
    accuracy: m.acc,
    pp: m.pp,
    priority: m.pri,
    target: "foe",
    effect: legacyEffectToResolverEffect(m.effect, m.effectChance),
  };
}

/** Adapter: a game MochiiInstance + its species types -> ResolverBattler. */
export function instanceToResolverBattler(
  side: SideId,
  instance: {
    nickname: string;
    speciesId: string;
    level: number;
    hp: number;
    maxHp: number;
    stats: BattlerStats;
    stages: StageMap;
    status: string | null;
    moves: string[];
    pp: number[];
  },
  speciesTypes: string[],
): ResolverBattler {
  return {
    side,
    name: instance.nickname,
    speciesId: instance.speciesId,
    types: [...speciesTypes],
    level: instance.level,
    hp: instance.hp,
    maxHp: instance.maxHp,
    stats: { ...instance.stats },
    stages: { ...instance.stages },
    status: instance.status,
    moves: [...instance.moves],
    pp: [...instance.pp],
    volatile: {},
  };
}
