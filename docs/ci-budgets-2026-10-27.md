# CI + test budgets — 2026-10-27 (base main 08648398, PR #272 merge)

## 1. Atlas: what exists on main today (counted, not estimated)

- Test files on main: 4, not 3 (the brief said 3; the fourth is the e2e smoke
  spec — counted from the main tree at 08648398):
  - `src/lib/battle-math.test.ts`
  - `tests/battle-math.test.ts`
  - `tests/wiring.test.ts`
  - `tests/e2e/smoke.spec.ts`
- Workflows on main: 1 (`no-deletion-guard.yml`). This PR adds the second,
  `ci-budgets.yml`; it does not duplicate or replace the guard.
- Test runners already in `package.json` devDependencies (no new dependency
  added by this PR): `vitest ^3.2.4`, `@playwright/test ^1.64.1`.
  Existing script `test` runs `vitest run src/lib` only, so the new
  `tests/*.test.ts` files need the new `test:tests` script to run at all.
- Pure-logic modules scaffolded here (browser-free, Vitest-safe):
  `src/lib/battleTypeChart.ts`, `src/lib/opponentDirection.ts`,
  `src/lib/wiring/tiled-map.ts`, `src/lib/wiring/dialogue-ink.ts` plus the
  Region 1 truck-start compiled ink JSON. Modules NOT scaffolded here because
  they need a browser or held numbers: Pixi/React components, `save-store.ts`
  (IndexedDB), `creatureCooldowns.ts` (provisional numbers, HELD),
  audio/Tone modules, and the full battle resolver (owned by the battle-math lane).

## 2. Bundle budget (measured fresh 2026-10-27, enforced by CI)

Two scopes, kept separate — confusing them was the first version's bug
(it set the dist-total gzip budget to the single-bundle figure, and the
check correctly failed on main's own build):

| Item | Measured 2026-10-27 | Budget (enforced) | Headroom |
| --- | --- | --- | --- |
| Live single bundle `index-r-Trvo3i.js`, raw (curl, Pages) | 2,266,589 bytes | — (baseline) | — |
| Live single bundle, gzip (curl, Pages) | 518,474 bytes | — (baseline) | — |
| Largest single JS chunk in local `dist/` (same bundle) | 2,266,589 bytes | 2,500,000 bytes raw | ~10% |
| Largest single JS chunk, gzip | ~519,500 bytes (vite estimate) | 700,000 bytes | ~35% |
| Total JS in local `dist/`, raw (1,465 JS files) | 2,969,102 bytes | 3,300,000 bytes | ~11% |
| Total JS in local `dist/`, gzip | 976,249 bytes | 1,100,000 bytes | ~13% |

The local build reproduces the live bundle byte-for-byte
(`index-r-Trvo3i.js` = 2,266,589 bytes in both), but `dist/` holds far more
than that one bundle: Pixi vendor chunks plus many small asset chunks
(1,465 JS files under `dist/assets/`). Budgets therefore cover the whole
`dist/` JS total, not just the main bundle.

Budgets live in `tests/bundle-budgets.json` (single source of truth).
Enforcement: `node tests/check-bundle-budget.mjs dist` after `vite build`
— exit 1 when any budget is exceeded, exit 2 when `dist/` has no JS.
The workflow `.github/workflows/ci-budgets.yml` runs it on every PR.
Tightening a budget is a Mars decision; a PR that merely exceeds one must
split the bundle or raise the budget explicitly, never silently edit the JSON.

## 3. Vitest scaffolding added by this PR (tests only, no src/ changes)

| File | Covers |
| --- | --- |
| `tests/type-chart.test.ts` | 12-element chart shape, 144-cell grid, coverage arithmetic (76 sourced + 24 conflict + 44 owed), Aero/Deep all-neutral. Does NOT rule on the chart — True Elements stays a Mars judgment. |
| `tests/opponent-direction.test.ts` | Vector arithmetic (dx/dy, atan2 angle, down-left) and `unconfirmed` origins for every row. Art flips are a separate Mars eye-check. |
| `tests/tiled-map-gates.test.ts` | Validator branches the existing wiring test does not cover: bad gate flag, out-of-bounds exit, missing wildPool, row/height mismatch, per-piece town completeness. |
| `tests/dialogue-structure.test.ts` | Truck-start compiled ink shape + inkjs adapter first lines + `clock_set` flag. Regions 2–5 exit/flag checks belong to the ink-dialogue lane. |
| `tests/ci-budgets.test.ts` | Budget-file sanity (positive, gzip < raw, above the live baseline). Real enforcement is the budget script + CI, not this test. |

Run: `npm run test:tests` (new), `npm run test` (existing, unchanged),
`npm run test:all` (both, new).

## 4. Playwright gate spec (skeleton only — NO browser run in this PR)

`tests/e2e/gates.spec.ts` holds one live assertion (title page loads) and
three `test.skip` gates with the exact live check each needs: title-preset
persistence after reload, reduced-motion canvas freeze, and 390×844 no
horizontal overflow. The parent runs it (leaf workers cannot operate a live
browser):

```
npm run dev
npm run test:e2e:gates   # = playwright test tests/e2e/gates.spec.ts
```

Do NOT un-skip a gate until its selector has been confirmed in a live
session. The existing `tests/e2e/smoke.spec.ts` is untouched.

## 5. Lighthouse budgets (PROPOSED targets — NOT yet enforced)

No Lighthouse run was done in this PR (no browser run allowed here), so
these are targets for the parent's first Lighthouse run, not measured values
and not CI-enforced yet. Enforcement (a `lighthouse-ci` config or a budget
file) is a follow-up PR after the first real measurement.

| Metric | Proposed budget | Notes |
| --- | --- | --- |
| LCP | ≤ 2,500 ms | Standard "good" Web Vital threshold |
| INP | ≤ 200 ms | Standard "good" Web Vital threshold |
| CLS | ≤ 0.10 | Standard "good" Web Vital threshold |
| Total JS (transfer) | ≤ 1,100,000 bytes gzip | Matches the enforced dist-total bundle budget above |
| Lighthouse performance score | ≥ 90 | Target only until a real run exists |

## 6. What remains (with counts)

- Playwright gates un-skipped: 3/4 = 75% of `gates.spec.ts` still skipped
  (1 live assertion done, 3 TODO gates owed to a parent live session).
- Lighthouse enforcement: 0/1 = 0% (targets written, no config, no run).
- Vitest coverage of the 91 non-generated `src/lib/*.ts` modules: this PR
  adds 4 module families; the remaining pure-logic modules (resolver,
  garden/daycare, human systems, tilesets, and others) are uncounted here
  and belong to their owning lanes, not a bulk claim.
- Held items (not decided here): True Elements chart judgment, Garden
  fruit→stat map, breeding species-choice, cooldown numbers, and every
  item on the coordinator's HELD list — none of them is settled by a test
  in this PR.
