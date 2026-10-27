/**
 * battle-math.test.ts — Vitest tests for battle-math.ts (staged).
 *
 * Every expected value below was computed BY HAND from the pipeline order
 * documented in battle-math.ts, not copied from a run. If a test fails, the
 * module or the expectation is wrong — do not "fix" the expectation to match
 * a run without re-deriving it by hand first.
 *
 * No creature or move names appear here: battlers are generic numbers.
 */
import { describe, expect, it } from "vitest";
import {
  ACCURACY_STAGE_RATIOS,
  CRIT_CHANCE_DENOMINATORS,
  accuracyThreshold,
  accuracyThresholdBlack2,
  actionOrderKey,
  applyStage,
  checkOHKOHit,
  escapeChance,
  calculateDamage,
  changeStage,
  checkCanAct,
  clampStage,
  combineTypeMultipliers,
  confusionDamage,
  critStageFrom,
  effectiveSpeed,
  endTurnStatusDamage,
  heldItemAttack,
  isGuaranteedHit,
  leftoversHeal,
  orderActions,
  orderPair,
  recoilDamage,
  rollAccuracy,
  rollCrit,
  rollEscape,
  rollMultiHitCount,
  rollQuickClaw,
  rollSecondaryEffect,
  rngFromSequence,
  stageRatio,
  weatherEndTurnDamage,
  weatherPowerRatio,
  type BattlerInput,
  type MoveInput,
} from "./battle-math";

function battler(over: Partial<BattlerInput> = {}): BattlerInput {
  return {
    level: 50,
    attack: 100,
    defense: 80,
    spAttack: 100,
    spDefense: 80,
    speed: 100,
    maxHp: 160,
    elements: ["NORMAL"],
    stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 },
    status: null,
    ...over,
  };
}

function move(over: Partial<MoveInput> = {}): MoveInput {
  return {
    power: 80,
    accuracy: 100,
    category: "Physical",
    element: "NORMAL",
    priority: 0,
    ...over,
  };
}

/** Roll-100 RNG (roll percent = 100 - floor(0*16) = 100). */
const roll100 = () => rngFromSequence([0]);
/** Roll-85 RNG (roll percent = 100 - floor(0.9375*16) = 100 - 15 = 85). */
const roll85 = () => rngFromSequence([0.9375]);

describe("stat stages", () => {
  it("clamps stages to -6..+6", () => {
    expect(clampStage(9)).toBe(6);
    expect(clampStage(-9)).toBe(-6);
    expect(changeStage(5, 2)).toBe(6);
    expect(changeStage(-5, -2)).toBe(-6);
    expect(changeStage(2, -1)).toBe(1);
  });

  it("uses exact stage fractions, not rounded decimals", () => {
    expect(stageRatio(-6)).toEqual([2, 8]);
    expect(stageRatio(0)).toEqual([2, 2]);
    expect(stageRatio(6)).toEqual([8, 2]);
    // -1 is 2/3, not 0.67: 80 * 2/3 floors to 53.
    expect(applyStage(80, -1)).toBe(53);
    expect(applyStage(100, 1)).toBe(150);
    expect(applyStage(100, 2)).toBe(200);
    expect(applyStage(100, -2)).toBe(50);
  });
});

describe("damage formula", () => {
  it("base case: L50, power 80, A100 vs D80, STAB, roll 100 -> 69", () => {
    // levelTerm = 2*50/5+2 = 22; 22*80*100/80 = 2200; /50 = 44; +2 = 46;
    // STAB floor(46*15/10) = 69; type 1; roll 100 -> 69.
    const r = calculateDamage(
      battler({ elements: ["WATER"] }),
      battler(),
      move({ element: "WATER" }),
      { forceCrit: false, typeMultipliers: [1], rng: roll100() },
    );
    expect(r.damage).toBe(69);
    expect(r.isStab).toBe(true);
    expect(r.preRollDamage).toBe(69);
    expect(r.rollPercent).toBe(100);
  });

  it("crit x2 then double effectiveness then roll 85 -> 156", () => {
    // base 46 -> crit 92 -> type x2 = 184 -> roll 85: floor(184*85/100) = 156.
    const r = calculateDamage(
      battler(),
      battler(),
      move({ element: "FIRE" }),
      { forceCrit: true, typeMultipliers: [2], rng: roll85() },
    );
    expect(r.damage).toBe(156);
    expect(r.isCrit).toBe(true);
  });

  it("applies attack/defence stages: +1 atk, -1 def, power 40 -> 51", () => {
    // A = 150, D = floor(80*2/3) = 53; 22*40*150 = 132000; /53 = 2490;
    // /50 = 49; +2 = 51.
    const atk = battler({ elements: ["WATER"], stages: { atk: 1, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } });
    const def = battler({ stages: { atk: 0, def: -1, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } });
    const r = calculateDamage(atk, def, move({ power: 40 }), {
      forceCrit: false,
      typeMultipliers: [1],
      rng: roll100(),
    });
    expect(r.damage).toBe(51);
  });

  it("crit ignores unfavourable stages: -2 atk / +2 def crit -> 92, non-crit -> 13", () => {
    const atk = battler({ elements: ["WATER"], stages: { atk: -2, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } });
    const def = battler({ stages: { atk: 0, def: 2, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } });
    // Crit: raw A100 / raw D80 -> base 46 -> crit 92.
    expect(
      calculateDamage(atk, def, move(), { forceCrit: true, typeMultipliers: [1], rng: roll100() }).damage,
    ).toBe(92);
    // Non-crit: A50 / D160 -> 22*80*50 = 88000; /160 = 550; /50 = 11; +2 = 13.
    expect(
      calculateDamage(atk, def, move(), { forceCrit: false, typeMultipliers: [1], rng: roll100() }).damage,
    ).toBe(13);
  });

  it("burn halves Physical before +2 -> 24", () => {
    // basePre 44 -> burn 22 -> +2 = 24.
    const r = calculateDamage(
      battler({ elements: ["WATER"], status: "burn" }),
      battler(),
      move(),
      { forceCrit: false, typeMultipliers: [1], rng: roll100() },
    );
    expect(r.damage).toBe(24);
  });

  it("reflect halves Physical before +2 -> 24", () => {
    const r = calculateDamage(battler({ elements: ["WATER"] }), battler(), move(), {
      forceCrit: false,
      screen: "reflect",
      typeMultipliers: [1],
      rng: roll100(),
    });
    expect(r.damage).toBe(24);
  });

  it("sun boosts Fire special: 44 -> 66 -> 68; rain halves Fire -> 24", () => {
    const fire = move({ category: "Special", element: "FIRE" });
    expect(
      calculateDamage(battler(), battler(), fire, {
        forceCrit: false,
        weather: "sun",
        typeMultipliers: [1],
        rng: roll100(),
      }).damage,
    ).toBe(68);
    expect(
      calculateDamage(battler(), battler(), fire, {
        forceCrit: false,
        weather: "rain",
        typeMultipliers: [1],
        rng: roll100(),
      }).damage,
    ).toBe(24);
  });

  it("type product: 0 wins, 2 x 0.5 = 1, 2 x 2 = 4", () => {
    expect(combineTypeMultipliers([0, 2])).toBe(0);
    expect(combineTypeMultipliers([2, 0.5])).toBe(1);
    expect(combineTypeMultipliers([2, 2])).toBe(4);
    const noEffect = calculateDamage(battler({ elements: ["WATER"] }), battler(), move(), {
      forceCrit: false,
      typeMultipliers: [0],
      rng: roll100(),
    });
    expect(noEffect.damage).toBe(0);
    expect(noEffect.typeMultiplier).toBe(0);
    const neutral = calculateDamage(battler({ elements: ["WATER"] }), battler(), move(), {
      forceCrit: false,
      typeMultipliers: [2, 0.5],
      rng: roll100(),
    });
    expect(neutral.damage).toBe(46);
  });

  it("damage roll 85 on base 46 -> 39", () => {
    const r = calculateDamage(battler({ elements: ["WATER"] }), battler(), move(), {
      forceCrit: false,
      typeMultipliers: [1],
      rng: roll85(),
    });
    expect(r.rollPercent).toBe(85);
    expect(r.damage).toBe(39);
  });

  it("status moves deal 0 and tiny stats floor to minimum base 3", () => {
    expect(
      calculateDamage(battler(), battler(), move({ category: "Status", power: 0 }), {}).damage,
    ).toBe(0);
    // L5: levelTerm = 2*5/5+2 = 4; 4*40*10 = 1600; /200 = 8; /50 = 0 -> min 1; +2 = 3.
    const tiny = calculateDamage(
      battler({ level: 5, attack: 10, elements: ["WATER"] }),
      battler({ defense: 200 }),
      move({ power: 40 }),
      { forceCrit: false, typeMultipliers: [1], rng: roll100() },
    );
    expect(tiny.damage).toBe(3);
  });

  it("confusion self-damage is a 40-power physical hit on self -> 24", () => {
    // 22*40*100 = 88000; /80 = 1100; /50 = 22; +2 = 24; roll 100.
    expect(confusionDamage(battler(), roll100())).toBe(24);
  });
});

describe("accuracy", () => {
  it("stage math: +1 acc -> 106 on acc 80; +1 eva -> 75 on acc 100", () => {
    const att = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 1, eva: 0 } });
    expect(accuracyThreshold(move({ accuracy: 80 }), att, battler())).toBe(106);
    const eva = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 1 } });
    expect(accuracyThreshold(move({ accuracy: 100 }), battler(), eva)).toBe(75);
  });

  it("clamps the net stage: -6 acc vs +6 eva -> 33 on acc 100", () => {
    const att = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: -6, eva: 0 } });
    const def = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 6 } });
    // net clamped to -6 -> ratio 6/18 -> floor(100*6/18) = 33.
    expect(accuracyThreshold(move({ accuracy: 100 }), att, def)).toBe(33);
    expect(ACCURACY_STAGE_RATIOS.length).toBe(13);
  });

  it("foresight ignores evasion", () => {
    const def = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 6 } });
    expect(accuracyThreshold(move({ accuracy: 100 }), battler(), def, { foresight: true })).toBe(100);
  });

  it("accuracy 0 always hits; roll 100 vs threshold 100 hits, 76 vs 50 misses", () => {
    expect(rollAccuracy(Infinity, rngFromSequence([0.999]))).toBe(true);
    expect(rollAccuracy(100, rngFromSequence([0.99]))).toBe(true);
    expect(rollAccuracy(50, rngFromSequence([0.75]))).toBe(false);
    expect(rollAccuracy(50, rngFromSequence([0.49]))).toBe(true);
  });

  it("evasion item param 10 scales 100 -> 90", () => {
    expect(
      accuracyThreshold(move({ accuracy: 100 }), battler(), battler(), { evasionItemParam: 10 }),
    ).toBe(90);
  });
});

describe("crit stages", () => {
  it("table is 16/8/4/3/2 and stages add then clamp at 4", () => {
    expect([...CRIT_CHANCE_DENOMINATORS]).toEqual([16, 8, 4, 3, 2]);
    expect(critStageFrom({})).toBe(0);
    expect(critStageFrom({ highCritMove: true })).toBe(1);
    expect(critStageFrom({ focusEnergy: true, highCritMove: true })).toBe(3);
    expect(
      critStageFrom({ focusEnergy: true, highCritMove: true, scopeLensItem: true, moveBonus: 5 }),
    ).toBe(4);
  });

  it("rollCrit is 1-in-N: stage 0 hits on 0.0, misses on 0.5", () => {
    expect(rollCrit(0, rngFromSequence([0]))).toBe(true);
    expect(rollCrit(0, rngFromSequence([0.5]))).toBe(false);
  });
});

describe("priority and speed order", () => {
  function entry(priority: number, effSpeed: number, id: string) {
    return { id, move: move({ priority }), battler: battler(), effSpeed };
  }

  it("priority beats speed", () => {
    const [first] = orderPair(entry(1, 10, "fast-move"), entry(0, 999, "fast-body"));
    expect(first.id).toBe("fast-move");
  });

  it("equal priority: faster body first", () => {
    const [first] = orderPair(entry(0, 120, "quick"), entry(0, 80, "slow"));
    expect(first.id).toBe("quick");
  });

  it("exact tie is a coin flip", () => {
    const [a] = orderPair(entry(0, 100, "a"), entry(0, 100, "b"), rngFromSequence([0.25]));
    expect(a.id).toBe("a");
    const [b] = orderPair(entry(0, 100, "a"), entry(0, 100, "b"), rngFromSequence([0.75]));
    expect(b.id).toBe("b");
  });

  it("paralysis quarters speed; +2 speed stage doubles it", () => {
    expect(effectiveSpeed(battler({ status: "paralysis" }))).toBe(25);
    expect(
      effectiveSpeed(battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 2, acc: 0, eva: 0 } })),
    ).toBe(200);
  });
});

describe("status: can-act and end-turn", () => {
  it("sleep counts down and wakes at 0", () => {
    const asleep = checkCanAct(battler({ status: "sleep", sleepTurns: 2 }));
    expect(asleep.canAct).toBe(false);
    if (!asleep.canAct) expect(asleep.battler.sleepTurns).toBe(1);
    const waking = checkCanAct(battler({ status: "sleep", sleepTurns: 1 }));
    expect(waking.canAct).toBe(true);
    if (waking.canAct) expect(waking.battler.status).toBeNull();
  });

  it("freeze thaws on 20%: 0.1 thaws, 0.5 stays frozen", () => {
    expect(checkCanAct(battler({ status: "freeze" }), rngFromSequence([0.1])).canAct).toBe(true);
    const frozen = checkCanAct(battler({ status: "freeze" }), rngFromSequence([0.5]));
    expect(frozen.canAct).toBe(false);
    expect("reason" in frozen ? frozen.reason : undefined).toBe("frozen");
  });

  it("paralysis fully paralyzes on 25%: 0.1 blocks, 0.5 acts", () => {
    expect(checkCanAct(battler({ status: "paralysis" }), rngFromSequence([0.1])).canAct).toBe(false);
    expect(checkCanAct(battler({ status: "paralysis" }), rngFromSequence([0.5])).canAct).toBe(true);
  });

  it("flinch blocks once and clears; confusion snaps out at 0, else 50% self-hit", () => {
    const flinched = checkCanAct(battler({ flinched: true }));
    expect(flinched.canAct).toBe(false);
    if (!flinched.canAct) expect(flinched.battler.flinched).toBe(false);
    const snapped = checkCanAct(battler({ confusionTurns: 1 }), rngFromSequence([0]));
    expect(snapped.canAct).toBe(true);
    const selfHit = checkCanAct(battler({ confusionTurns: 3 }), rngFromSequence([0.4]));
    expect(selfHit.canAct).toBe(false);
    if (!selfHit.canAct) {
      expect("reason" in selfHit ? selfHit.reason : undefined).toBe("confusion-self-hit");
      expect(selfHit.battler.confusionTurns).toBe(2);
    }
    const acts = checkCanAct(battler({ confusionTurns: 3 }), rngFromSequence([0.6]));
    expect(acts.canAct).toBe(true);
    if (acts.canAct) expect(acts.battler.confusionTurns).toBe(2);
  });

  it("end-turn ticks: poison/burn 1/8, toxic 1/16 x counter, min 1", () => {
    expect(endTurnStatusDamage(battler({ status: "poison", maxHp: 80 }))).toBe(10);
    expect(endTurnStatusDamage(battler({ status: "burn", maxHp: 80 }))).toBe(10);
    expect(endTurnStatusDamage(battler({ status: "toxic", maxHp: 80, toxicCounter: 2 }))).toBe(10);
    expect(endTurnStatusDamage(battler({ status: "toxic", maxHp: 80, toxicCounter: 1 }))).toBe(5);
    expect(endTurnStatusDamage(battler({ status: "poison", maxHp: 7 }))).toBe(1);
    expect(endTurnStatusDamage(battler({ status: null }))).toBe(0);
  });

  it("weather end-turn: sandstorm spares Rock/Ground/Steel, hail spares Ice, 1/16 otherwise", () => {
    expect(weatherEndTurnDamage(battler({ elements: ["ROCK"] }), "sandstorm")).toBe(0);
    expect(weatherEndTurnDamage(battler({ elements: ["NORMAL"] }), "sandstorm")).toBe(10);
    expect(weatherEndTurnDamage(battler({ elements: ["ICE"] }), "hail")).toBe(0);
    expect(weatherEndTurnDamage(battler({ elements: ["NORMAL"] }), "hail")).toBe(10);
    expect(weatherEndTurnDamage(battler(), "rain")).toBe(0);
    expect(weatherEndTurnDamage(battler(), "sun")).toBe(0);
  });

  it("leftovers heals 1/16 capped at full HP", () => {
    expect(leftoversHeal(100, 160)).toBe(10);
    expect(leftoversHeal(155, 160)).toBe(5);
    expect(leftoversHeal(160, 160)).toBe(0);
  });
});

describe("move effects, multi-hit, recoil, held items", () => {
  it("multi-hit cutoffs: 34->2, 35->3, 70->4, 85->5", () => {
    expect(rollMultiHitCount(rngFromSequence([0.34]))).toBe(2);
    expect(rollMultiHitCount(rngFromSequence([0.35]))).toBe(3);
    expect(rollMultiHitCount(rngFromSequence([0.69]))).toBe(3);
    expect(rollMultiHitCount(rngFromSequence([0.7]))).toBe(4);
    expect(rollMultiHitCount(rngFromSequence([0.84]))).toBe(4);
    expect(rollMultiHitCount(rngFromSequence([0.85]))).toBe(5);
  });

  it("recoil is floor(dealt / 4)", () => {
    expect(recoilDamage(100)).toBe(25);
    expect(recoilDamage(101)).toBe(25);
  });

  it("held items: choice band x1.5 physical only; type-boost +10% on match only", () => {
    expect(heldItemAttack(100, { kind: "choice-band" }, move({ category: "Physical" }))).toBe(150);
    expect(heldItemAttack(100, { kind: "choice-band" }, move({ category: "Special" }))).toBe(100);
    expect(
      heldItemAttack(100, { kind: "type-boost", element: "FIRE", percent: 10 }, move({ element: "FIRE" })),
    ).toBe(110);
    expect(
      heldItemAttack(100, { kind: "type-boost", element: "FIRE", percent: 10 }, move({ element: "WATER" })),
    ).toBe(100);
  });

  it("quick claw: 20% item strikes first on 0.1, not on 0.5", () => {
    expect(rollQuickClaw(20, rngFromSequence([0.1]))).toBe(true);
    expect(rollQuickClaw(20, rngFromSequence([0.5]))).toBe(false);
  });

  it("secondary effects: 10% hits on 0.05, misses on 0.5; 100 always, 0 never", () => {
    expect(rollSecondaryEffect(10, rngFromSequence([0.05]))).toBe(true);
    expect(rollSecondaryEffect(10, rngFromSequence([0.5]))).toBe(false);
    expect(rollSecondaryEffect(100)).toBe(true);
    expect(rollSecondaryEffect(0)).toBe(false);
  });

  it("weather power ratios: rain Water 15/10, rain Fire 5/10, sun Fire 15/10", () => {
    expect(weatherPowerRatio("rain", "WATER")).toEqual([15, 10]);
    expect(weatherPowerRatio("rain", "FIRE")).toEqual([5, 10]);
    expect(weatherPowerRatio("sun", "FIRE")).toEqual([15, 10]);
    expect(weatherPowerRatio("none", "WATER")).toEqual([1, 1]);
  });
});

describe("black2 extraction: speed cap + trick room", () => {
  it("caps at 10000, then inverts under trick room (cap first, so 20000 -> 0)", () => {
    expect(effectiveSpeed(battler({ speed: 20000 }))).toBe(10000);
    expect(effectiveSpeed(battler({ speed: 100 }), { trickRoom: true })).toBe(9900);
    expect(effectiveSpeed(battler({ speed: 20000 }), { trickRoom: true })).toBe(0);
    expect(effectiveSpeed(battler({ speed: 100, status: "paralysis" }), { trickRoom: true })).toBe(9975);
  });
});

describe("black2 extraction: full action-order key", () => {
  it("kind beats priority: an item (kind 2, pri 0) acts before a fight move (kind 0, pri 5)", () => {
    const ordered = orderActions([
      { id: "fight", priority: 5, effSpeed: 999, kind: 0 as const },
      { id: "item", priority: 0, effSpeed: 1, kind: 2 as const },
    ]);
    expect(ordered[0].id).toBe("item");
    expect(actionOrderKey({ id: "x", priority: 0, effSpeed: 100 })).toBe(
      (0 << 22) | (7 << 16) | (1 << 13) | 100,
    );
  });

  it("special priority sits between priority and speed: default 1 beats stall 0 at equal priority+speed", () => {
    const ordered = orderActions([
      { id: "stall", priority: 0, effSpeed: 100, specialPriority: 0 },
      { id: "normal", priority: 0, effSpeed: 100, specialPriority: 1 },
    ]);
    expect(ordered[0].id).toBe("normal");
  });

  it("exact key ties shuffle with rng (2-group Fisher-Yates: 0.25 swaps, 0.75 keeps) and keep input order without rng", () => {
    const pair = [
      { id: "a", priority: 0, effSpeed: 100 },
      { id: "b", priority: 0, effSpeed: 100 },
    ];
    expect(orderActions(pair, rngFromSequence([0.25]))[0].id).toBe("b");
    expect(orderActions(pair, rngFromSequence([0.75]))[0].id).toBe("a");
    expect(orderActions(pair)[0].id).toBe("a");
  });
});

describe("black2 extraction: accuracy cap + foresight rules", () => {
  it("black2 caps the stage-adjusted threshold at 100: acc 80 at +1 acc -> 100 (uncapped fn gives 106)", () => {
    const att = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 1, eva: 0 } });
    expect(accuracyThresholdBlack2(move({ accuracy: 80 }), att, battler())).toBe(100);
    expect(accuracyThreshold(move({ accuracy: 80 }), att, battler())).toBe(106);
  });

  it("black2 foresight neutralizes only positive evasion; firered ignores evasion entirely", () => {
    // Defender evasion -2 (lowered): black2 still benefits the attacker
    // (net +2 -> 166 uncapped), firered foresight gives exactly 100.
    const lowEva = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: -2 } });
    expect(
      accuracyThreshold(move({ accuracy: 100 }), battler(), lowEva, { foresight: true, foresightRule: "black2" }),
    ).toBe(166);
    expect(
      accuracyThreshold(move({ accuracy: 100 }), battler(), lowEva, { foresight: true, foresightRule: "firered" }),
    ).toBe(100);
    // Defender evasion +6: both rules give 100.
    const highEva = battler({ stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 6 } });
    expect(
      accuracyThreshold(move({ accuracy: 100 }), battler(), highEva, { foresight: true, foresightRule: "black2" }),
    ).toBe(100);
  });

  it("guaranteed hit: any of no-guard / lock-on / always-hit condition / always-hit move", () => {
    expect(isGuaranteedHit({})).toBe(false);
    expect(isGuaranteedHit({ noGuard: true })).toBe(true);
    expect(isGuaranteedHit({ lockOn: true })).toBe(true);
    expect(isGuaranteedHit({ alwaysHitCondition: true })).toBe(true);
    expect(isGuaranteedHit({ alwaysHitMove: true })).toBe(true);
    expect(isGuaranteedHit({ noGuard: false, lockOn: true })).toBe(true);
  });
});

describe("black2 extraction: ohko + escape + always-crit", () => {
  it("ohko: lower level never lands; chance = accuracy + level lead; guaranteed bypasses", () => {
    expect(checkOHKOHit(40, 50, 30, rngFromSequence([0]))).toBe(false);
    // L50 vs L40, acc 30 -> chance 40: roll 39 hits, roll 40 misses.
    expect(checkOHKOHit(50, 40, 30, rngFromSequence([0.39]))).toBe(true);
    expect(checkOHKOHit(50, 40, 30, rngFromSequence([0.4]))).toBe(false);
    expect(checkOHKOHit(40, 50, 30, rngFromSequence([0.99]), { guaranteed: true })).toBe(true);
  });

  it("escape: faster always escapes; 100 vs 200 -> chance 64/256, +30 per failed attempt", () => {
    expect(escapeChance(100, 200, 0)).toBe(64);
    expect(escapeChance(100, 200, 2)).toBe(124);
    expect(rollEscape(201, 200)).toBe(true);
    // roll floor(0.24*256)=61 < 64 escapes; floor(0.25*256)=64 does not.
    expect(rollEscape(100, 200, 0, rngFromSequence([0.24]))).toBe(true);
    expect(rollEscape(100, 200, 0, rngFromSequence([0.25]))).toBe(false);
    // One failed attempt: chance 94; roll floor(0.36*256)=92 escapes.
    expect(rollEscape(100, 200, 1, rngFromSequence([0.36]))).toBe(true);
  });

  it("always-crit bypasses the roll", () => {
    expect(rollCrit(0, rngFromSequence([0.99]), { alwaysCrit: true })).toBe(true);
    expect(rollCrit(0, rngFromSequence([0.99]))).toBe(false);
  });
});
