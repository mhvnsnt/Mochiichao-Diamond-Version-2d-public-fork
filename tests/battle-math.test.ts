import { describe, it, expect } from "vitest";
import {
  accuracyHits, accuracyHitsWithStages, calcDamage, critHits, orderTurns, rollEffect,
  recoilDamage, multiHitCount, type GameMove, type Battler,
} from "../src/lib/wiring/battle-math";

const chart = (atk: string, defs: string[]) => {
  if (atk === "WATER" && defs.includes("FLAME")) return 2;
  if (atk === "FLAME" && defs.includes("WATER")) return 0.5;
  return 1;
};
const battler = (over: Partial<Battler> = {}): Battler => ({
  level: 5, atk: 10, def: 10, spa: 10, spd: 10, spe: 10,
  types: ["WATER"], hp: 20, maxHp: 20, ...over,
});
const move = (over: Partial<GameMove> = {}): GameMove => ({
  bp: 40, acc: 100, pri: 0, cat: "Physical", effect: "NONE", effectChance: 0, type: "WATER", ...over,
});

describe("accuracy", () => {
  it("acc 100 always hits, acc 80 misses on rng 0.9 and hits on rng 0.5", () => {
    expect(accuracyHits(move({ acc: 100 }), () => 0.99)).toBe(true);
    expect(accuracyHits(move({ acc: 80 }), () => 0.9)).toBe(false);
    expect(accuracyHits(move({ acc: 80 }), () => 0.5)).toBe(true);
  });
});

describe("turn order", () => {
  it("priority beats speed, speed beats input order on ties", () => {
    const slowPri = { move: move({ pri: 1 }), battler: battler({ spe: 5 }), index: 1 };
    const fast = { move: move({ pri: 0 }), battler: battler({ spe: 99 }), index: 0 };
    expect(orderTurns([fast, slowPri])[0]).toBe(slowPri);
    const a = { move: move(), battler: battler({ spe: 20 }), index: 0 };
    const b = { move: move(), battler: battler({ spe: 10 }), index: 1 };
    expect(orderTurns([b, a])[0]).toBe(a);
  });
});

describe("damage", () => {
  it("STAB + super-effective multiplies, status moves deal 0", () => {
    const atk = battler({ types: ["WATER"] });
    const def = battler({ types: ["FLAME"] });
    const hit = calcDamage(atk, def, move({ bp: 40 }), chart, () => 0.99);
    expect(hit.damage).toBeGreaterThan(0);
    expect(hit.typeMult).toBe(2);
    const status = calcDamage(atk, def, move({ cat: "Status", bp: 0 }), chart, () => 0.5);
    expect(status.damage).toBe(0);
  });
  it("crit rate is 1/24 base, 1/8 for HIGH_CRIT", () => {
    expect(critHits(move(), () => 0.04)).toBe(true);
    expect(critHits(move(), () => 0.05)).toBe(false);
    expect(critHits(move({ effect: "HIGH_CRIT" }), () => 0.1)).toBe(true);
    expect(critHits(move({ effect: "HIGH_CRIT" }), () => 0.2)).toBe(false);
  });
});

describe("effects", () => {
  it("burn applies at 10% chance, recoil is 25%, multi-hit is 2-5", () => {
    expect(rollEffect(move({ effect: "BURN", effectChance: 10 }), () => 0.05)?.effect).toBe("BURN");
    expect(rollEffect(move({ effect: "BURN", effectChance: 10 }), () => 0.5)).toBeNull();
    expect(recoilDamage(move({ effect: "RECOIL_25" }), 40)).toBe(10);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.0)).toBe(2);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.99)).toBe(5);
  });
});

describe("black2 extraction: wiring fixes", () => {
  it("multi-hit follows 35/35/15/15 cutoffs, not uniform quarters", () => {
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.34)).toBe(2);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.35)).toBe(3);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.69)).toBe(3);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.70)).toBe(4);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.84)).toBe(4);
    expect(multiHitCount(move({ effect: "MULTI_HIT" }), () => 0.85)).toBe(5);
    expect(multiHitCount(move({ effect: "NONE" }), () => 0.99)).toBe(1);
  });

  it("exact stage ratios change knife-edge speed: 100 at -1 (66) loses to 67, paralysis quarters, trick room inverts", () => {
    const a = { move: move(), battler: battler({ spe: 100, statStages: { spe: -1 } }), index: 0 };
    const b = { move: move(), battler: battler({ spe: 67 }), index: 1 };
    expect(orderTurns([a, b])[0]).toBe(b);
    const paralyzed = { move: move(), battler: battler({ spe: 100, status: "paralysis" }), index: 0 };
    const slow = { move: move(), battler: battler({ spe: 30 }), index: 1 };
    expect(orderTurns([paralyzed, slow])[0]).toBe(slow);
    const quick = { move: move(), battler: battler({ spe: 100 }), index: 0 };
    const slow2 = { move: move(), battler: battler({ spe: 30 }), index: 1 };
    expect(orderTurns([quick, slow2], { trickRoom: true })[0]).toBe(slow2);
  });

  it("exact ties shuffle with rng (0.25 swaps, 0.75 keeps) and keep input order without rng", () => {
    const a = { move: move(), battler: battler({ spe: 50 }), index: 0 };
    const b = { move: move(), battler: battler({ spe: 50 }), index: 1 };
    expect(orderTurns([a, b], { rng: () => 0.25 })[0]).toBe(b);
    expect(orderTurns([a, b], { rng: () => 0.75 })[0]).toBe(a);
    expect(orderTurns([a, b])[0]).toBe(a);
  });

  it("stage-aware accuracy: acc 100 vs +1 eva -> threshold 75; acc 0 always hits; +1 acc on 80 caps at 100", () => {
    expect(accuracyHitsWithStages(move({ acc: 100 }), 0, 1, {}, () => 0.74)).toBe(true);
    expect(accuracyHitsWithStages(move({ acc: 100 }), 0, 1, {}, () => 0.75)).toBe(false);
    expect(accuracyHitsWithStages(move({ acc: 0 }), 0, 6, {}, () => 0.99)).toBe(true);
    expect(accuracyHitsWithStages(move({ acc: 80 }), 1, 0, {}, () => 0.99)).toBe(true);
    // Black2 foresight: lowered evasion (-2) still helps -> threshold 166 capped 100, always hits.
    expect(accuracyHitsWithStages(move({ acc: 100 }), 0, -2, { foresight: true }, () => 0.99)).toBe(true);
  });
});
