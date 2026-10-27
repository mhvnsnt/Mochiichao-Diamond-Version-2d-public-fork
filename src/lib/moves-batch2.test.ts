/**
 * Moves batch 2 live wiring (2026-10-27, wiring lane).
 *
 * Locks the merge of the 84-entry roster-wins catalogue
 * (src/lib/generated/mochiichao_moves_catalogue.ts, landed on main via
 * PR #205 as staged data) into the live MOVES_DB in src/lib/moves.ts.
 * Before this PR the live game only knew 37 moves; the 84 catalogue
 * moves were dead data. After it, MOVES_DB has 121 entries and the
 * resolver's move table (buildLegacyMoveTable, called by BattleView)
 * picks them up automatically.
 *
 * Known limitation, by design: the catalogue introduced 14 effect
 * strings the resolver did not map yet. 7 of them dispatch now through
 * the existing "stat" kind (ATK_UP1, ATK_DOWN1, ATK_DOWN2, DEF_UP1,
 * DEF_UP2, SPDEF_UP1, SPDEF_UP2 -- see legacyEffectToResolverEffect).
 * The other 7 (ALL_UP1, CONFUSE, DRAIN, FREEZE, PROTECT, SLEEP, TRAP)
 * have no resolver kind yet and degrade to kind "none" -- named as
 * pending in combatPhase3.test.ts, never silent. The moves still deal
 * their base damage with correct power / accuracy / priority / type;
 * only those secondaries are inert until the resolver grows those
 * kinds (separate follow-up, not this PR).
 */
import { describe, expect, it } from "vitest";
import { MOVES_DB } from "./moves";
import { MOCHIICHAO_MOVES_NEW } from "./generated/mochiichao_moves_catalogue";
import { SPECIES_DB } from "./species";
import type { Move } from "./types";

const CATALOGUE = MOCHIICHAO_MOVES_NEW as Record<string, Move>;
const BASE_COUNT = 37; // live moves before batch 2
const BATCH2_COUNT = 84;

describe("moves batch 2 live", () => {
  it("merges the full catalogue: 37 + 84 = 121 entries, none lost", () => {
    expect(Object.keys(CATALOGUE)).toHaveLength(BATCH2_COUNT);
    expect(Object.keys(MOVES_DB)).toHaveLength(BASE_COUNT + BATCH2_COUNT);
    for (const [key, entry] of Object.entries(CATALOGUE)) {
      expect(MOVES_DB[key]).toEqual(entry);
    }
  });

  it("every catalogue entry is a valid Move (fields in range)", () => {
    const validCats = new Set(["Physical", "Special", "Status"]);
    for (const [, m] of Object.entries(CATALOGUE)) {
      expect(typeof m.name).toBe("string");
      expect(m.name.length).toBeGreaterThan(0);
      expect(validCats.has(m.cat)).toBe(true);
      expect(m.bp).toBeGreaterThanOrEqual(0);
      expect(m.bp).toBeLessThanOrEqual(250);
      expect(m.acc).toBeGreaterThanOrEqual(0);
      expect(m.acc).toBeLessThanOrEqual(100);
      expect(m.pp).toBeGreaterThanOrEqual(1);
      expect(m.pp).toBeLessThanOrEqual(40);
      expect(m.pri).toBeGreaterThanOrEqual(-7);
      expect(m.pri).toBeLessThanOrEqual(7);
      expect(m.effectChance).toBeGreaterThanOrEqual(0);
      expect(m.effectChance).toBeLessThanOrEqual(100);
      expect(typeof m.desc).toBe("string");
      expect(typeof m.anim).toBe("string");
    }
  });

  it("every species learnset moveId resolves in the live MOVES_DB", () => {
    const missing: string[] = [];
    for (const species of Object.values(SPECIES_DB)) {
      for (const step of species.learnset ?? []) {
        if (!MOVES_DB[step.moveId]) missing.push(`${species.id}:${step.moveId}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("catalogue names stay Mochiichao originals (no clash with live names)", () => {
    const liveNames = new Set(
      Object.entries(MOVES_DB)
        .filter(([k]) => !(k in CATALOGUE))
        .map(([, m]) => m.name),
    );
    const clashes = Object.values(CATALOGUE)
      .map((m) => m.name)
      .filter((n) => liveNames.has(n));
    expect(clashes).toEqual([]);
  });
});
