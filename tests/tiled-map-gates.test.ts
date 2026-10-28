// Tiled map validator — gate-case Vitest scaffolding (no browser).
// The existing tests/wiring.test.ts already covers the happy path (sector0
// as a town) and one missing-exit case; these cases cover the remaining
// validator branches so a bad map cannot slip through silently.
import { describe, it, expect } from "vitest";
import {
  validateTmjMap,
  validateTown,
  type TmjMap,
} from "../src/lib/wiring/tiled-map";

function baseMap(overrides: Partial<TmjMap> = {}): TmjMap {
  return {
    id: "test_town",
    name: "Test Town",
    width: 10,
    height: 10,
    tiles: Array.from({ length: 10 }, () => Array(10).fill(0)),
    exits: {},
    npcs: [
      { id: "nurse", x: 1, y: 1, name: "Nurse", role: "heal" },
      { id: "shop", x: 2, y: 2, name: "Shop", role: "shop" },
    ],
    signs: [{ x: 0, y: 0, text: "Test Town" }],
    wildPool: ["mochii"],
    ...overrides,
  };
}

describe("tiled map validator gates", () => {
  it("rejects a non-flag gate name", () => {
    const map = baseMap({
      exits: { north: { to: "other", enterAt: [0, 0], gate: "Bad Gate!" } },
    });
    const other = baseMap({ id: "other" });
    const errors = validateTmjMap(map, { test_town: map, other });
    expect(errors.some((e) => e.includes("not a flag name"))).toBe(true);
  });

  it("rejects an exit landing outside the target map", () => {
    const map = baseMap({
      exits: { north: { to: "other", enterAt: [99, 99] } },
    });
    const other = baseMap({ id: "other" });
    const errors = validateTmjMap(map, { test_town: map, other });
    expect(errors.some((e) => e.includes("outside"))).toBe(true);
  });

  it("rejects a map with neither wildPool nor noWild", () => {
    const { wildPool: _dropped, ...noPool } = baseMap();
    const errors = validateTmjMap(noPool as TmjMap, {});
    expect(errors.some((e) => e.includes("no wildPool"))).toBe(true);
  });

  it("rejects a map whose tile rows do not match its height", () => {
    const map = baseMap({ tiles: [[0, 0]] });
    const errors = validateTmjMap(map, {});
    expect(errors.some((e) => e.includes("tile rows"))).toBe(true);
  });
});

describe("town completeness gates", () => {
  it("names each missing town piece separately", () => {
    const noHeal = baseMap({ npcs: [{ id: "shop", x: 2, y: 2, name: "Shop", role: "shop" }] });
    expect(validateTown(noHeal)).toEqual(["test_town: town has no heal NPC"]);
    const noShop = baseMap({ npcs: [{ id: "nurse", x: 1, y: 1, name: "Nurse", role: "heal" }] });
    expect(validateTown(noShop)).toEqual(["test_town: town has no shop NPC"]);
    const noSign = baseMap({ signs: [] });
    expect(validateTown(noSign)).toEqual(["test_town: town has no sign"]);
    expect(validateTown(baseMap())).toEqual([]);
  });
});
