// Budget-file sanity — Vitest scaffolding (no browser, no build output).
// This checks that tests/bundle-budgets.json is a sane budget file; the
// actual enforcement against a real build is tests/check-bundle-budget.mjs,
// run by the CI workflow after `vite build` (see docs/ci-budgets-2026-10-27.md).
import { describe, it, expect } from "vitest";
import budgets from "./bundle-budgets.json";

describe("bundle budgets file", () => {
  it("has positive budgets with gzip below raw and headroom over both baselines", () => {
    expect(budgets.largestJsChunkMaxBytes).toBeGreaterThan(0);
    expect(budgets.largestJsChunkGzipMaxBytes).toBeGreaterThan(0);
    expect(budgets.totalJsMaxBytes).toBeGreaterThan(budgets.largestJsChunkMaxBytes);
    expect(budgets.totalJsGzipMaxBytes).toBeGreaterThan(budgets.largestJsChunkGzipMaxBytes);
    expect(budgets.totalJsGzipMaxBytes).toBeLessThan(budgets.totalJsMaxBytes);
    // Live single-bundle baseline (curl, 2026-10-27).
    expect(budgets.measuredBaseline.liveBundleRawBytes).toBe(2266589);
    expect(budgets.measuredBaseline.liveBundleGzipBytes).toBe(518474);
    expect(budgets.largestJsChunkMaxBytes).toBeGreaterThan(budgets.measuredBaseline.liveBundleRawBytes);
    expect(budgets.largestJsChunkGzipMaxBytes).toBeGreaterThan(budgets.measuredBaseline.liveBundleGzipBytes);
    // Full-dist baseline (local vite build from main 08648398, 2026-10-27).
    expect(budgets.measuredBaseline.distTotalJsRawBytes).toBe(2969102);
    expect(budgets.measuredBaseline.distTotalJsGzipBytes).toBe(976249);
    expect(budgets.measuredBaseline.distJsFileCount).toBe(1465);
    expect(budgets.totalJsMaxBytes).toBeGreaterThan(budgets.measuredBaseline.distTotalJsRawBytes);
    expect(budgets.totalJsGzipMaxBytes).toBeGreaterThan(budgets.measuredBaseline.distTotalJsGzipBytes);
  });
});
