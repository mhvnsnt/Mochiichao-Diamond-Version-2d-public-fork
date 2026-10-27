import { test, expect } from "@playwright/test";

// Smoke gate, run in CI / a playtest session — not run in the
// PR author's session. The dev server must be running on
// http://localhost:3000 (see package.json dev script).
test("title page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle(/Mochiichao|react/i);
});
