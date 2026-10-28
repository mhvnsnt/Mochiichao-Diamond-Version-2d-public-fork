# STAGING — list8-systems teardown package

**Size class: repo-sized, with one flagged future exception.**
Everything in this package is Markdown + small JSON (tens of KB
total) and belongs in GitHub per Jamar's staging rule, landing
through the side lane's PR flow (this package is the repo-ready
source, staged in the workspace only until that landing). The one
TeraBox-class payload the package *names* (it does not contain it):
**#72 instrument-bank sample audio**, if/when sample-kind entries
are ever recorded — audio payloads stage on TeraBox once, with the
repo holding the bank entries + a SHA-256 manifest (same pattern as
the voice-kit manifest). No audio exists in this package today.

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths

| File | Proposed home | Why there |
|---|---|---|
| `67-WEATHER-BEHAVIOUR.md` | `show/production/world-systems/` | Beside the #14 completion spec and SPAWN-TABLES — it is the behaviour half of the world-systems cluster |
| `behaviour-table-fragment.json` | `src/data/core/schemas/behaviour-table-fragment.json` (format `mochiichao/behaviour-table/v1`) | With the core schemas; the game reads the same tables the show boards from |
| `68-TRADE-PROTOCOL.md`, `trade-record-fragment.json` | `show/production/world-systems/` + fragment to `src/data/core/schemas/` | Design-only spec; lives with world-systems so a future build finds the guardrails with the formats |
| `69-ACHIEVEMENTS.md`, `achievements-fragment.json` | `show/production/world-systems/` + fragment beside the completion spec's landing | It is the completion loop's record layer — must land adjacent to #14 or the no-double-paying rule gets lost |
| `70-DIFFICULTY.md` | `show/production/world-systems/` | Difficulty dials are fields on the spawn/encounter formats in the same folder |
| `71-ONBOARDING.md` | `show/production/world-systems/` | Beat sheet annotates the #11 route graph; lands beside it |
| `72-INSTRUMENT-BANK.md` | `show/production/` (beside ADAPTIVE-MUSIC's landing home) | The bank serves the MUS system; keep bank + stem spec adjacent |
| `instrument-bank-fragment.json` | `show/production/instrument-bank-fragment.json` + (future) `show/production/INSTRUMENT-MANIFEST.sha256` when sample payloads exist on TeraBox | Entries in repo; payloads on TeraBox per the staging rule |
| `73-WEATHER-FX.md` | `show/production/` (beside LIVING-WORLD.md) | Its slots register in the LIVING-WORLD Ambient Cycle Library — the doc is that library's weather chapter |
| `74-BRAND-GUIDE.md` | `show/` (top level of the show tree) | The guide is an assembly/index document over the whole show tree; it points into production/, it does not live inside one system |
| `75-DELIVERY-SPEC.md` | `show/production/` | Finish-gate document; consumed at episode landing |
| `76-WEB-EXPORT.md`, `web-export-fragment.json` | `show/production/` + fragment with the species-data docs | Export format derives from the sheet schema; lands near it. **No site, no publishing** — format only |
| `README.md` | `show/production/list8-systems-INDEX.md` at landing (or folded into the production index) | Package index |
| `STAGING.md` | stays with the package until landing; then `show/production/STAGING-list8-2026-10-27.md` as the landing record | Landing bookkeeping, per lane convention |

## Landing notes for the side lane

- No existing repo file is modified by this package. All fragments
  are additive; the spawn-table schema gains nothing from List 8
  (#70's director weight-windows are *described* as additive nullable
  fields — the schema edit itself is a landing-lane decision, not
  smuggled in here).
- #69 must land in the same wave as (or after) #14's completion
  spec, with the no-double-paying note intact.
- #76's fragment is a shape example: its example record carries nulls
  where canon has not locked values (notably Mochii's public number,
  blocked on the TBD D1 numbering ruling). Do not "complete" it at
  landing.
- #72's two seed bank entries reference the title stems by the
  cue sheet's glob (`public/audio/mixer/mixer-title-*.wav`) — exact
  filename + loop-point verification is the same flag #13 already
  carries; resolve once, in both places.
