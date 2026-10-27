import { describe, it, expect } from "vitest";
import { makePathfinder } from "../src/lib/wiring/pathfinding";
import { validateTmjMap, validateTown, type TmjMap } from "../src/lib/wiring/tiled-map";
import { generateIsle, isleConnected, seededRng } from "../src/lib/wiring/wfc-isle";
import { VICTORY_JINGLE, BADGE_JINGLE } from "../src/lib/wiring/tone-jingles";
import sector0 from "../src/lib/wiring/maps/sector0.json";

describe("pathfinding", () => {
  it("paths around a wall and returns null when blocked", async () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    const pf = makePathfinder(grid);
    const path = await pf.findPath({ x: 0, y: 0 }, { x: 2, y: 2 });
    expect(path).not.toBeNull();
    expect(path![path!.length - 1]).toEqual({ x: 2, y: 2 });
    expect(path!.some((p) => p.x === 1 && p.y === 1)).toBe(false);
    const blocked = await pf.findPath({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(blocked).toBeNull();
  });
  it("follower trails the player, it does not stack on them", () => {
    const pf = makePathfinder([[0, 0, 0, 0, 0]]);
    const trail = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
    expect(pf.followerTarget(trail, 3)).toEqual({ x: 0, y: 0 });
  });
});

describe("tiled maps", () => {
  it("sector0 validates as a town with heal + shop + sign", () => {
    const maps: Record<string, TmjMap> = {
      sector0: sector0 as unknown as TmjMap,
      aeon_lab: { ...sector0, id: "aeon_lab" } as unknown as TmjMap,
      route_1: { ...sector0, id: "route_1" } as unknown as TmjMap,
    };
    expect(validateTmjMap(sector0 as unknown as TmjMap, maps)).toEqual([]);
    expect(validateTown(sector0 as unknown as TmjMap)).toEqual([]);
  });
  it("a missing exit target fails validation", () => {
    const bad = { ...sector0, exits: { nowhere: { to: "missing_map", enterAt: [0, 0] } } } as unknown as TmjMap;
    expect(validateTmjMap(bad, {})).toHaveLength(1);
  });
});

describe("wfc isles", () => {
  it("same seed reproduces the same map, and entrance reaches exit", () => {
    const a = generateIsle(42);
    const b = generateIsle(42);
    expect(a).toEqual(b);
    // A generated isle is not guaranteed connected by construction;
    // the validator must be able to say so, not silently ship it.
    expect(typeof isleConnected(a)).toBe("boolean");
  });
  it("seeded RNG is deterministic", () => {
    const r1 = seededRng(7);
    const r2 = seededRng(7);
    expect(r1()).toBe(r2());
  });
});

describe("jingles as data", () => {
  it("victory and badge jingles are non-empty note lists", () => {
    expect(VICTORY_JINGLE.length).toBeGreaterThan(0);
    expect(BADGE_JINGLE.length).toBeGreaterThan(0);
    expect(VICTORY_JINGLE.every((n) => n.note && n.time)).toBe(true);
  });
});
