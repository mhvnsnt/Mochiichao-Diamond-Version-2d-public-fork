// Opponent attack origin/angle table — structural Vitest scaffolding (no browser).
// Pins vector arithmetic, not art: every row's dx/dy must equal target minus
// attacker, angles must match atan2, and origins stay "unconfirmed" (the code
// gives a generic anchor only — see src/lib/opponentDirection.ts header).
// Art flips / body-part origins are a separate Mars eye-check, not this test.
import { describe, it, expect } from "vitest";
import {
  OPPONENT_VECTORS,
  OPPONENT_MOVE_ROWS,
  type BattleFormat,
} from "../src/lib/opponentDirection";

const FORMATS: BattleFormat[] = ["single", "doubles_left", "doubles_right"];

describe("opponent attack vectors", () => {
  it("the three format anchors travel down-left with consistent dx/dy/angle", () => {
    for (const format of FORMATS) {
      const v = OPPONENT_VECTORS[format];
      expect(v.dx).toBe(v.target[0] - v.attacker[0]);
      expect(v.dy).toBe(v.target[1] - v.attacker[1]);
      expect(v.dx).toBeLessThan(0);
      expect(v.dy).toBeGreaterThan(0);
      expect(v.direction).toBe("down-left");
      const expectedAngle = (Math.atan2(v.dy, v.dx) * 180) / Math.PI;
      expect(Math.abs(v.angle_atan2_deg - expectedAngle)).toBeLessThan(0.05);
      expect(v.slope_below_horizontal_deg).not.toBeNull();
    }
  });

  it("every move row is unconfirmed-origin with consistent per-format vectors", () => {
    expect(OPPONENT_MOVE_ROWS.length).toBeGreaterThan(0);
    const slugs = new Set<string>();
    for (const row of OPPONENT_MOVE_ROWS) {
      expect(row.origin_label).toBe("unconfirmed");
      expect(row.move_slug).toBeTruthy();
      expect(slugs.has(row.move_slug)).toBe(false);
      slugs.add(row.move_slug);
      if (row.vectors === null) continue;
      for (const format of FORMATS) {
        const v = row.vectors[format];
        expect(v.dx).toBe(v.target[0] - v.attacker[0]);
        expect(v.dy).toBe(v.target[1] - v.attacker[1]);
        expect(v.direction).toBe("down-left");
      }
    }
  });
});
