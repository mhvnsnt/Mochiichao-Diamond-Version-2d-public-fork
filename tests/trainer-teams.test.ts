import { describe, it, expect } from "vitest";
import { TRAINER_TEAMS } from "../src/lib/trainerTeams";
const ALLOWED = new Set([...Array.from({ length: 46 }, (_, i) => String(i + 1).padStart(3, "0")), "147", "148", "331"]);
const AIS = new Set(["Novice", "Balanced", "Type-aware", "Defensive", "Aggressive", "Elite"]);
describe("trainer teams", () => {
  it("has 265 rows with unique ids", () => {
    expect(TRAINER_TEAMS.length).toBe(265);
    expect(new Set(TRAINER_TEAMS.map((r) => r.id)).size).toBe(265);
  });
  it("uses only species in species.ts, valid levels, AI profiles, rewards", () => {
    for (const r of TRAINER_TEAMS) {
      expect(AIS.has(r.ai)).toBe(true);
      expect(r.reward).toBeGreaterThan(0);
      expect(r.team.length).toBeGreaterThan(0);
      for (const m of r.team) {
        expect(ALLOWED.has(m.speciesId)).toBe(true);
        expect(m.level).toBeGreaterThanOrEqual(3);
        expect(m.level).toBeLessThanOrEqual(100);
      }
    }
  });
  it("covers all 5 regions", () => {
    for (const reg of ["R1", "R2", "R3", "R4", "R5"]) {
      expect(TRAINER_TEAMS.filter((r) => r.id.startsWith(reg + "-")).length).toBeGreaterThan(0);
    }
  });
});
