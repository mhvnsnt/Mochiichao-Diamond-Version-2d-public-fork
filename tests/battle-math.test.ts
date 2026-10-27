import { describe, it, expect } from "vitest";
import {
  accuracyHits, calcDamage, critHits, orderTurns, rollEffect,
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
