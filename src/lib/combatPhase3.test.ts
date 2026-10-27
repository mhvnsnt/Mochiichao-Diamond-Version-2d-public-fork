/**
 * combatPhase3.test.ts — Vitest tests for Phase 3 combat wiring.
 *
 * Every expected value below was derived by hand from the documented
 * pipeline (battle-math.ts, battleResolver.ts, combatAiming.ts), not
 * copied from a run. If a test fails, the module or the expectation is
 * wrong — do not "fix" the expectation to match a run without
 * re-deriving it by hand first.
 *
 * No creature or move names appear here except the game move ids the
 * wiring itself routes (moves.ts keys); battlers are generic numbers.
 */
import { describe, expect, it } from "vitest";
import {
  CRIT_LOCKED,
  DIRECTED_EXECUTION_COUNT,
  UNION_MOVE_COUNT,
  allGameMoveSchemas,
  cameraPresetForPhase,
  drainHpAtImpact,
  effectDispatchTable,
  gameMoveSchema,
  hpUnchangedOutsideTurn,
  scriptMapCounts,
  targetTable,
} from "./combatPhase3";
import {
  BLACK2_ANCHORS,
  FIRE_RED_ANCHORS,
  PIXI_ANCHOR_FRACTIONS,
  aimForCanvasAttack,
  aimFromFireRedAnchors,
  cameraPresetForPixiTime,
  sideSign,
  tableOffsetFor,
  type OriginAngleTable,
} from "./combatAiming";
import {
  accuracyThreshold,
  calculateDamage,
  orderPair,
  rngFromSequence,
  rollAccuracy,
  rollMultiHitCount,
  type BattlerInput,
  type MoveInput,
} from "./battle-math";
import { buildLegacyMoveTable } from "./battleWiring";
import moveScripts from "./generated/moveScripts.json";
import originAngleTable from "./generated/combatOriginAngleTable.json";

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
  return { power: 80, accuracy: 100, category: "Physical", element: "NORMAL", priority: 0, ...over };
}

describe("phase 3: live-main verification (36/36 script map)", () => {
  it("gameMoveScriptMap on main is 36/36 with 0 unmatched", () => {
    expect(scriptMapCounts()).toEqual({
      gameMoves: 36, exactId: 10, mappedHere: 26, totalMatched: 36, unmatched: 0,
    });
  });
  it("all 36 game moves have a schema and a script route, none unrouted", () => {
    const all = allGameMoveSchemas();
    expect(all).toHaveLength(36);
    expect(all.filter((s) => s.scriptRoute === "exact-id")).toHaveLength(10);
    expect(all.filter((s) => s.scriptRoute === "mapped")).toHaveLength(26);
    expect(all.filter((s) => s.scriptRoute === "unrouted")).toHaveLength(0);
    expect(all.every((s) => s.scriptKey !== null)).toBe(true);
  });
  it("IRON_BARRAGE routes to GEAR_GRIND (Mars multi-hit decision)", () => {
    expect(gameMoveSchema("IRON_BARRAGE")?.scriptKey).toBe("GEAR_GRIND");
    expect(gameMoveSchema("IRON_BARRAGE")?.effect).toBe("MULTI_HIT");
  });
  it("unknown game move id routes to nothing, never a guess", () => {
    expect(gameMoveSchema("NO_SUCH_MOVE")).toBeNull();
  });
});

describe("phase 3: union schema counts (moveScripts.json)", () => {
  it("563 union script keys: 560 Black 2 + 3 FireRed-only", () => {
    const ms = moveScripts as unknown as {
      unionMoves: number; scripts: Record<string, unknown>;
      black2OnlyCount: number; bothSources: number; fireredOnly: string[];
    };
    expect(ms.unionMoves).toBe(563);
    expect(Object.keys(ms.scripts)).toHaveLength(563);
    expect(ms.black2OnlyCount).toBe(209);
    expect(ms.bothSources).toBe(351);
    expect(ms.fireredOnly).toHaveLength(3);
    expect(UNION_MOVE_COUNT).toBe(563);
    expect(DIRECTED_EXECUTION_COUNT).toBe(1126);
  });
});

describe("phase 3: effect dispatch covers every effect string in moves.ts", () => {
  it("13 distinct effect strings, none silently falling through to none", () => {
    const table = effectDispatchTable();
    expect(Object.keys(table).sort()).toEqual([
      "ACC_DOWN1", "BURN", "CHARGE_TURN", "DEF_DOWN1", "FLINCH", "HIGH_CRIT",
      "MULTI_HIT", "NONE", "PARALYSIS", "POISON", "RECOIL_25", "SPDEF_DOWN1", "SPE_DOWN1",
    ]);
    expect(table["NONE"]).toBe("none");
    expect(table["BURN"]).toBe("status");
    expect(table["PARALYSIS"]).toBe("status");
    expect(table["POISON"]).toBe("status");
    expect(table["SPDEF_DOWN1"]).toBe("stat");
    expect(table["DEF_DOWN1"]).toBe("stat");
    expect(table["ACC_DOWN1"]).toBe("stat");
    expect(table["SPE_DOWN1"]).toBe("stat");
    expect(table["RECOIL_25"]).toBe("recoil");
    expect(table["MULTI_HIT"]).toBe("multiHit");
    expect(table["HIGH_CRIT"]).toBe("highCrit");
    expect(table["CHARGE_TURN"]).toBe("chargeTurn");
    expect(table["FLINCH"]).toBe("flinch");
  });
});

describe("phase 3: crit is LOCKED (x2, stage table {16,8,4,3,2})", () => {
  it("locked constants", () => {
    expect(CRIT_LOCKED.multiplier).toBe(2);
    expect([...CRIT_LOCKED.denominators]).toEqual([16, 8, 4, 3, 2]);
    expect(CRIT_LOCKED.ignoresAttackerNegativeAtkStage).toBe(true);
    expect(CRIT_LOCKED.ignoresDefenderPositiveDefStage).toBe(true);
  });
  it("a crit ignores a -6 attacker Atk stage (damage equals stage-0 crit)", () => {
    const rng = rngFromSequence([0]); // damage roll 100%
    const critNeg = calculateDamage(
      battler({ stages: { atk: -6, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } }),
      battler(), move(), { forceCrit: true, typeMultipliers: [1], rng },
    );
    const critZero = calculateDamage(battler(), battler(), move(), { forceCrit: true, typeMultipliers: [1], rng: rngFromSequence([0]) });
    expect(critNeg.isCrit).toBe(true);
    expect(critNeg.damage).toBe(critZero.damage);
    expect(critNeg.damage).toBeGreaterThan(0);
  });
  it("a crit ignores a +6 defender Def stage (damage equals stage-0 crit)", () => {
    const critPos = calculateDamage(
      battler(),
      battler({ stages: { atk: 0, def: 6, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } }),
      move(), { forceCrit: true, typeMultipliers: [1], rng: rngFromSequence([0]) },
    );
    const critZero = calculateDamage(battler(), battler(), move(), { forceCrit: true, typeMultipliers: [1], rng: rngFromSequence([0]) });
    expect(critPos.damage).toBe(critZero.damage);
  });
  it("a non-crit DOES apply the negative stage (damage is lower)", () => {
    // rng: crit roll 0.5 -> floor(0.5*16)=8, not 0, so no crit; damage roll 0 -> 100%.
    const noCrit = calculateDamage(
      battler({ stages: { atk: -6, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 } }),
      battler(), move(), { typeMultipliers: [1], rng: rngFromSequence([0.5, 0]) },
    );
    const plain = calculateDamage(battler(), battler(), move(), { typeMultipliers: [1], rng: rngFromSequence([0.5, 0]) });
    expect(noCrit.isCrit).toBe(false);
    expect(noCrit.damage).toBeLessThan(plain.damage);
  });
});

describe("phase 3: turn order and accuracy (battle-math, via resolver order)", () => {
  it("priority beats speed; speed beats on equal priority", () => {
    const fast = { id: "fast", move: move({ priority: 0 }), battler: battler(), effSpeed: 200 };
    const slowPri = { id: "slowPri", move: move({ priority: 1 }), battler: battler(), effSpeed: 10 };
    expect(orderPair(fast, slowPri)[0].id).toBe("slowPri");
    const slow = { id: "slow", move: move({ priority: 0 }), battler: battler(), effSpeed: 10 };
    expect(orderPair(fast, slow)[0].id).toBe("fast");
  });
  it("accuracy threshold is the move accuracy at stage 0; 0 accuracy never misses", () => {
    expect(accuracyThreshold(move({ accuracy: 80 }), battler(), battler())).toBe(80);
    expect(rollAccuracy(Infinity)).toBe(true);
    expect(rollAccuracy(accuracyThreshold(move({ accuracy: 0 }), battler(), battler()))).toBe(true);
  });
  it("multi-hit distribution: 35/35/15/15 cutoffs", () => {
    expect(rollMultiHitCount(rngFromSequence([0.1]))).toBe(2);
    expect(rollMultiHitCount(rngFromSequence([0.5]))).toBe(3);
    expect(rollMultiHitCount(rngFromSequence([0.8]))).toBe(4);
    expect(rollMultiHitCount(rngFromSequence([0.9]))).toBe(5);
  });
});

describe("phase 3: targets (singles table, live in battleWiring)", () => {
  it("35 foe + EARTH_TREMOR allFoes, in both the table and the live move table", () => {
    const rows = targetTable();
    expect(rows).toHaveLength(36);
    expect(rows.filter((r) => r.resolverTarget === "allFoes").map((r) => r.moveId)).toEqual(["EARTH_TREMOR"]);
    expect(rows.filter((r) => r.resolverTarget === "foe")).toHaveLength(35);
    expect(rows.find((r) => r.moveId === "EARTH_TREMOR")?.black2Target).toBe("ADJACENT_FOES");
    const live = buildLegacyMoveTable();
    expect(Object.keys(live.moves)).toHaveLength(36);
    expect(live.moves["EARTH_TREMOR"].target).toBe("allFoes");
    expect(live.moves["TACKLE"].target).toBe("foe");
  });
});

describe("phase 3: aiming model (FireRed origin + side sign, Black 2 anchors)", () => {
  it("anchors are the inventoried values", () => {
    expect(FIRE_RED_ANCHORS.player).toEqual({ x: 72, y: 80 });
    expect(FIRE_RED_ANCHORS.foe).toEqual({ x: 176, y: 40 });
    expect(BLACK2_ANCHORS.player).toEqual({ x: 0.5, y: 0.4, z: 7.0 });
    expect(BLACK2_ANCHORS.foe).toEqual({ x: 0.3, y: 0.4, z: -10.0 });
    expect(PIXI_ANCHOR_FRACTIONS.player).toEqual({ x: 0.22, y: 0.78 });
    expect(PIXI_ANCHOR_FRACTIONS.foe).toEqual({ x: 0.78, y: 0.42 });
    expect(sideSign("player")).toBe(1);
    expect(sideSign("foe")).toBe(-1);
  });
  it("player attacks up-right (~-21 deg); foe attacks down-left toward the player side (~159 deg)", () => {
    const p = aimFromFireRedAnchors("player");
    const f = aimFromFireRedAnchors("foe");
    expect(p.directionSign).toBe(1);
    expect(p.towardPlayerSide).toBe(false);
    expect(Math.abs(p.angleDeg - -21.04)).toBeLessThan(0.5);
    expect(f.directionSign).toBe(-1);
    expect(f.towardPlayerSide).toBe(true);
    expect(Math.abs(f.angleDeg - 158.96)).toBeLessThan(0.5);
  });
  it("canvas aim: foe base to player base travels leftward (toward the player side)", () => {
    const aim = aimForCanvasAttack("foe", { x: 780, y: 420 }, { x: 220, y: 780 });
    expect(aim.vector.x).toBeLessThan(0);
    expect(aim.directionSign).toBe(-1);
    expect(aim.towardPlayerSide).toBe(true);
    expect(aim.origin).toEqual({ x: 780, y: 420 });
  });
  it("a foe script offset is negated on screen (side-mirroring)", () => {
    const aim = aimForCanvasAttack("foe", { x: 780, y: 420 }, { x: 220, y: 780 }, [10, 0]);
    expect(aim.origin.x).toBe(770);
    const playerAim = aimForCanvasAttack("player", { x: 220, y: 780 }, { x: 780, y: 420 }, [10, 0]);
    expect(playerAim.origin.x).toBe(230);
  });
  it("staged origin/angle table: 36 centre entries, anchors matching the module", () => {
    const table = originAngleTable as unknown as OriginAngleTable;
    expect(Object.keys(table.entries)).toHaveLength(36);
    expect(table.entries["TACKLE"].offset).toEqual([0, 0]);
    expect(table.entries["EARTH_TREMOR"].offset).toEqual([0, 0]);
    expect(Object.values(table.entries).every((e) => e.offset[0] === 0 && e.offset[1] === 0)).toBe(true);
    expect(table.anchors.fireRed).toEqual(FIRE_RED_ANCHORS);
    expect(table.anchors.black2).toEqual(BLACK2_ANCHORS);
    expect(tableOffsetFor(table, "TACKLE")).toEqual([0, 0]);
    expect(tableOffsetFor(table, "NO_SUCH_MOVE")).toEqual([0, 0]);
    expect(tableOffsetFor(null, "TACKLE")).toEqual([0, 0]);
  });
});

describe("phase 3: camera presets", () => {
  it("windup frames the attacker, impact shakes on the target, wide does not shake", () => {
    expect(cameraPresetForPhase("windup").focus).toBe("attacker");
    expect(cameraPresetForPhase("windup").shake).toBe(false);
    expect(cameraPresetForPhase("impact").focus).toBe("target");
    expect(cameraPresetForPhase("impact").shake).toBe(true);
    expect(cameraPresetForPhase("wide").shake).toBe(false);
    expect(cameraPresetForPixiTime(0).phase).toBe("windup");
    expect(cameraPresetForPixiTime(300).phase).toBe("travel");
    expect(cameraPresetForPixiTime(800).phase).toBe("impact");
    expect(cameraPresetForPixiTime(1200).phase).toBe("recover");
  });
});

describe("phase 3: HP drain — impact only, 0 HP between turns", () => {
  it("impact drain clamps at 0 and never goes negative", () => {
    expect(drainHpAtImpact(50, 20)).toBe(30);
    expect(drainHpAtImpact(10, 50)).toBe(0);
    expect(drainHpAtImpact(0, 0)).toBe(0);
  });
  it("between-turn HP is unchanged; any change between turns fails the guard", () => {
    expect(hpUnchangedOutsideTurn(60, 60)).toBe(true);
    expect(hpUnchangedOutsideTurn(60, 52)).toBe(false);
  });
});
