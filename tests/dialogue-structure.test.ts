// Region 1 truck-start dialogue — structural Vitest scaffolding (no browser).
// Pins the compiled ink JSON's shape and the inkjs adapter's first lines,
// without asserting any held dialogue wording beyond the flag the scene is
// built around (clock_set). Full exit/flag checks for regions 2-5 belong to
// the ink-dialogue lane, not this scaffolding.
import { describe, it, expect } from "vitest";
import { loadInkStory } from "../src/lib/wiring/dialogue-ink";
import truckStart from "../src/lib/wiring/dialogue/region1-truck-start.json";

describe("region 1 truck-start dialogue", () => {
  it("is a compiled ink story with the truck-start knots", () => {
    const raw = JSON.stringify(truckStart);
    expect(raw).toContain("mom_truck");
    expect(raw).toContain("house_2f_clock");
    expect(raw).toContain("clock_set");
    expect((truckStart as { inkVersion?: number }).inkVersion).toBeGreaterThanOrEqual(20);
  });

  it("plays through the inkjs adapter and sets clock_set", () => {
    const story = loadInkStory(JSON.stringify(truckStart));
    const lines = story.continueAll();
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]).toContain("Mom:");
    // Walk the story to the clock scene: every knot jump is data-driven,
    // so drain choices (if any) until the clock line appears or it ends.
    let guard = 0;
    while (!lines.some((l) => l.includes("clock")) && story.choices().length > 0 && guard < 20) {
      story.choose(0);
      lines.push(...story.continueAll());
      guard += 1;
    }
    expect(lines.some((l) => l.toLowerCase().includes("clock"))).toBe(true);
  });
});
