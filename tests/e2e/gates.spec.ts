// Playwright gate spec SKELETON — specs and budgets only, no browser run here.
// This file is NOT run by the PR author (leaf workers cannot operate a live
// browser). The parent runs it against a dev server or the live Pages build:
//   npm run dev   (http://localhost:3000, see package.json)
//   npx playwright test tests/e2e/gates.spec.ts
// Only the first test asserts anything today; the rest are skipped with the
// exact live check they need, so a future playtest session can un-skip them
// one at a time instead of guessing selectors. Do NOT un-skip a test until
// its selector has been confirmed in a live session.
import { test, expect } from "@playwright/test";

const BASE = process.env.MOCHIICHAO_BASE_URL || "http://localhost:3000/";

test("title page loads", async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Mochiichao|react/i);
});

test.skip("title preset selection persists after reload (needs live selector confirmation)", async ({ page }) => {
  // TODO (parent playtest): open Settings, pick a title preset, reload, and
  // confirm the same preset renders. The RESET row behaviour was proven live
  // on desktop 2026-10-27 (PR #272 build); this spec turns that manual check
  // into a repeatable gate once its selectors are confirmed live.
  await page.goto(BASE);
});

test.skip("reduced-motion title freezes canvas motion (needs live CDP / reduced-motion run)", async ({ page }) => {
  // TODO (parent playtest): run with reducedMotion: "reduce" and compare
  // canvas frames over 2.5s; the 2026-10-27 VM CDP check found 0.00% canvas
  // diff under reduced motion. This spec codifies that check.
  await page.goto(BASE);
});

test.skip("phone viewport has no horizontal overflow (needs 390x844 live run)", async ({ page }) => {
  // TODO (parent playtest): set viewport 390x844, load the title, and assert
  // document scrollWidth <= 390 and the RESET TITLE button is inside the
  // viewport. Proven 2026-10-27 via VM CDP against the local dist build;
  // this spec makes it a live gate.
  await page.goto(BASE);
});
