// True-Elements type chart — structural Vitest scaffolding (no browser).
// This pins the chart's SHAPE and its own stated coverage counts; it does
// NOT rule on the chart itself. The chart is a derivation with owed and
// conflict cells (see src/lib/battleTypeChart.ts header) and stays a
// Mars judgment item — see docs/ci-budgets-2026-10-27.md.
import { describe, it, expect } from "vitest";
import {
  TRUE_ELEMENTS,
  TRUE_TYPE_CHART,
  CHART_COVERAGE,
  CONFLICT_CELLS,
  OWED_CELLS,
} from "../src/lib/battleTypeChart";

const ALLOWED = new Set([0, 0.5, 1, 2]);

describe("true-elements chart shape", () => {
  it("has 12 elements and a complete 12x12 grid", () => {
    expect(TRUE_ELEMENTS).toHaveLength(12);
    expect(new Set(TRUE_ELEMENTS)).toHaveLength(12);
    expect(Object.keys(TRUE_TYPE_CHART).sort()).toEqual([...TRUE_ELEMENTS].sort());
    for (const attacker of TRUE_ELEMENTS) {
      expect(Object.keys(TRUE_TYPE_CHART[attacker]).sort()).toEqual([...TRUE_ELEMENTS].sort());
      for (const defender of TRUE_ELEMENTS) {
        expect(ALLOWED.has(TRUE_TYPE_CHART[attacker][defender])).toBe(true);
      }
    }
  });

  it("coverage counts add up to the 144-cell grid", () => {
    expect(CHART_COVERAGE.totalCells).toBe(144);
    expect(
      CHART_COVERAGE.sourcedCells +
        CHART_COVERAGE.conflictCells +
        CHART_COVERAGE.owedCells,
    ).toBe(144);
    expect(
      CHART_COVERAGE.nonNeutralSourcedCells + CHART_COVERAGE.agreedNeutralCells,
    ).toBe(CHART_COVERAGE.sourcedCells);
  });

  it("conflict and owed lists match their stated counts", () => {
    expect(CONFLICT_CELLS).toHaveLength(CHART_COVERAGE.conflictCells);
    expect(OWED_CELLS).toHaveLength(CHART_COVERAGE.owedCells);
  });

  it("every Aero / Deep cell ships neutral (owed, not invented)", () => {
    for (const attacker of TRUE_ELEMENTS) {
      expect(TRUE_TYPE_CHART[attacker]["Aero"]).toBe(1);
      expect(TRUE_TYPE_CHART[attacker]["Deep"]).toBe(1);
      expect(TRUE_TYPE_CHART["Aero"][attacker]).toBe(1);
      expect(TRUE_TYPE_CHART["Deep"][attacker]).toBe(1);
    }
  });
});
