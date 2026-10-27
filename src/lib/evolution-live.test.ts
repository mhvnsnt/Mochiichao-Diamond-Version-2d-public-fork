/**
 * Mid-fight evolution, wired live (2026-10-27, wiring lane).
 *
 * Locks evolveInstance (engine.ts) + the safe-chain lookup
 * (evolution-hook.ts) that BattleView's victory tail calls after a
 * level-up in battle. The prompt UI itself is BattleView state; the
 * pure behaviour -- who evolves, into what, with what stats/moves/HP --
 * is pinned here.
 *
 * Scope: SAFE chains only (013-014-015 Pupbble, 038-039-040 Sproutle).
 * A multi-level jump past two rules evolves once, to the immediate
 * target; the next rule fires on the next level-up. Out-of-battle
 * level-ups (party/daycare) do not call this yet -- that is still
 * open (evolution-hook.ts checklist item 2).
 */
import { describe, expect, it } from "vitest";
import { createMochii, evolveInstance } from "./engine";
import {
  buildMidFightPrompt,
  getSafeEvolutionRule,
  safeEvolutionReady,
  MID_FIGHT_SHOWCASE,
} from "./evolution-hook";
import { SPECIES_DB } from "./species";
import { MOVES_DB } from "./moves";

describe("evolution live: safe-chain readiness", () => {
  it("Pupbble 013 evolves at 16, not 15; Terradog 014 at 32; Sproutle chain 18/32", () => {
    expect(safeEvolutionReady("013", 15)).toBe(false);
    expect(safeEvolutionReady("013", 16)).toBe(true);
    expect(getSafeEvolutionRule("013")).toEqual({
      speciesId: "013",
      targetId: "014",
      method: "level",
      level: 16,
    });
    expect(safeEvolutionReady("014", 31)).toBe(false);
    expect(safeEvolutionReady("014", 32)).toBe(true);
    expect(safeEvolutionReady("038", 18)).toBe(true);
    expect(safeEvolutionReady("039", 32)).toBe(true);
    expect(safeEvolutionReady("001", 99)).toBe(false);
    expect(safeEvolutionReady("015", 99)).toBe(false);
  });

  it("showcase case matches the safe chain", () => {
    expect(MID_FIGHT_SHOWCASE).toEqual({
      speciesId: "013",
      targetId: "014",
      fromName: "Pupbble",
      toName: "Terradog",
    });
  });
});

describe("evolution live: evolveInstance", () => {
  it("Pupbble Lv16 -> Terradog: species, nickname, stats, moves, HP proportion", () => {
    const inst = createMochii("013", 16)!;
    inst.hp = Math.floor(inst.maxHp / 2); // damage it first: proportion must survive
    const hpBefore = inst.hp / inst.maxHp;
    expect(evolveInstance(inst, "014")).toBe(true);
    expect(inst.speciesId).toBe("014");
    expect(inst.nickname).toBe("Terradog");
    expect(inst.level).toBe(16);
    expect(inst.maxHp).toBeGreaterThan(0);
    expect(Math.abs(inst.hp / inst.maxHp - hpBefore)).toBeLessThan(0.05);
    const target = SPECIES_DB["014"];
    const expectedMoves = target.learnset
      .filter((l) => l.level <= 16)
      .map((l) => l.moveId)
      .slice(-4);
    expect(inst.moves).toEqual(expectedMoves);
    expect(inst.pp).toEqual(expectedMoves.map((m) => MOVES_DB[m]?.pp || 10));
  });

  it("keeps a player-set nickname; unknown target is a no-op", () => {
    const inst = createMochii("013", 16)!;
    inst.nickname = "Bubbles";
    expect(evolveInstance(inst, "014")).toBe(true);
    expect(inst.nickname).toBe("Bubbles");
    expect(evolveInstance(inst, "999")).toBe(false);
    expect(inst.speciesId).toBe("014");
  });

  it("Sproutle Lv18 -> Shellguard, then Lv32 -> Dreadtoise (chained, one rule at a time)", () => {
    const inst = createMochii("038", 18)!;
    expect(evolveInstance(inst, "039")).toBe(true);
    expect(inst.nickname).toBe("Shellguard");
    inst.level = 32; // simulate the next level-up reaching the second rule
    expect(safeEvolutionReady("039", 32)).toBe(true);
    expect(evolveInstance(inst, "040")).toBe(true);
    expect(inst.nickname).toBe("Dreadtoise");
  });
});

describe("evolution live: prompt shape", () => {
  it("buildMidFightPrompt is cancellable and names both sides", () => {
    let confirmed = false;
    let cancelled = false;
    const prompt = buildMidFightPrompt(
      {
        kind: "levelUpInBattle",
        speciesId: "013",
        newLevel: 16,
        rule: getSafeEvolutionRule("013")!,
      },
      "Pupbble",
      "Terradog",
      () => {
        confirmed = true;
      },
      () => {
        cancelled = true;
      },
    );
    expect(prompt.promptTitle).toBe("Pupbble is evolving!");
    expect(prompt.promptBody).toBe("Pupbble is evolving into Terradog! Let it evolve?");
    expect(prompt.confirmLabel).toBe("Let it evolve");
    expect(prompt.cancelLabel).toBe("Stop evolution");
    expect(prompt.canCancel).toBe(true);
    prompt.onConfirm();
    expect(confirmed).toBe(true);
    prompt.onCancel();
    expect(cancelled).toBe(true);
  });
});
