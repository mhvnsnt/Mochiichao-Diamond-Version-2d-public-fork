# True-Elements wiring note — STAGED ONLY, no PR, no game change

## What this is

A unified diff that WOULD switch live battles from the Pokemon chart in
`src/lib/constants.ts` to the Mars-locked 19-element True chart, written
against the RESOLVER-based BattleView as it exists on live main. It is
staged for Mars to judge alongside the matchup chart. Nothing in it has
been applied to main, to any branch, or to any PR.

## Files the diff touches (3 files, +114/−7, verified by git apply --check)

1. **NEW `src/lib/trueElementsChart19.ts`** (+71 lines): `TRUE_ELEMENTS_19`,
   `LEGACY_TO_TRUE_ELEMENT` (legacy word → True name, 1:1 for all 18
   Pokemon types), `TRUE_TYPE_CHART_19` (18 rows × 18 keys; Deep row and
   Deep column keys DELIBERATELY ABSENT — see Deep safety below),
   `TRUE_CHART_COVERAGE` (361 / 289 / 35 / 37 / 324).
2. **`src/lib/battleWiring.ts`** (+36, −0): a new import of the chart
   module, plus three adapter functions after the existing
   `LEGACY_TYPE_CHART` block (which is LEFT IN PLACE, untouched, as the
   rollback path): `buildTrueMoveTable()` (maps each move's type through
   `legacyMoveToResolverMove` then to its True name),
   `mapSpeciesTypesToTrue()` (maps a species' legacy types to True
   names), `makeTrueResolverBattler()` (wraps `makeResolverBattler`
   with that mapping). Vocabulary is mapped at ONE boundary, for BOTH
   moves and battlers, so STAB comparisons inside the resolver stay
   consistent.
3. **`src/components/views/BattleView.tsx`** (14 changed lines, 7+/7−):
   import block swaps `LEGACY_TYPE_CHART`/`buildLegacyMoveTable`/
   `makeResolverBattler` for `TRUE_TYPE_CHART_19`/`buildTrueMoveTable`/
   `makeTrueResolverBattler`; battler construction lines swap to the
   True wrapper; the `resolveTurn` call swaps its move table and chart
   arguments. Nothing else in BattleView changes.

## Exact call sites (live main, verified in a sparse clone of HEAD)

- `BattleView.tsx:14-20` (battleWiring imports), `:345-346`
  (`makeResolverBattler` for player/foe, fed by
  `SPECIES_DB[...].types`), `:353-357` (`resolveTurn(..., 
  buildLegacyMoveTable(), LEGACY_TYPE_CHART)` — the single live
  resolver call site).
- `battleWiring.ts:46` (`calcTypeMultiplier`/`TYPES` import from
  constants.ts), `:59-68` (`LEGACY_TYPE_CHART` built by probing
  `calcTypeMultiplier`), `:70+` (new adapter inserted after it).
- `battleResolver.ts`: NOT TOUCHED. Its `typeMultiplier` (chart row
  lookup, missing → `{multiplier: 1, missing: true}`) and
  `calculateDamage` (absent pair → ×1 + `typeChartMissing` flag) take
  the chart as a parameter and are vocabulary-agnostic — that is why
  this swap is a call-site change, not a resolver change. Damage
  formula, crit stage table {16,8,4,3,2} ×2, multi-hit 35/35/15/15,
  speed ties, priority, effects and turn order are all untouched.

## Deep safety (read this before judging)

Deep keys are ABSENT from `TRUE_TYPE_CHART_19`, not filled with 1.
A Deep lookup therefore flags `typeChartMissing` in the resolver and
plays ×1 — flagged, never silent. This is safe for Gen 1 because NO
legacy type maps to Deep, so no Gen 1 move or battler can produce a
Deep lookup (Deep TBD cells affect zero Gen 1 battles). The wiring PR
must NOT fill Deep with 1s; it must wait for Mars's four Deep answers
(strong/weak/immune/resist, both directions) or ship with the flag.

## What live battles would actually change (honest preview)

Because the mapping is 1:1, the swap changes only **6 numeric cells**
versus what live battles do today — the six cells where the live
modern chart omits a decomp resistance (live 1× → True-chart ½×):
Frost-vs-Flame, Frost-vs-Chrome, Bug-vs-Toxic, Paranormal-vs-Chrome,
Mythic-vs-Chrome, Umbral-vs-Chrome. Every other mapped cell has the
same value as live (Fairy/Cryptid cells are modern values in both).
Everything else about a battle is vocabulary relabeling only.

## Overlap risk with other lanes' BattleView work

- **Any in-flight PR touching `BattleView.tsx` (especially lines
  14-20, 345-357), `battleWiring.ts`, or `battleResolver.ts` will
  conflict with this diff.** The diff must be rebased onto whatever
  lands first and re-verified with `git apply --check` before any
  wiring PR. Main moves often; do not apply a stale copy.
- **The cancelled battle-math swap is NOT revived here.** The world
  lane cancelled swapping BattleView to `battle-math.ts` because it
  would clobber the resolver's crit/multi-hit behaviour. This diff
  proposes no such swap: the resolver stays, only its chart argument
  changes.
- **`ArenaBattleView.tsx` is out of scope and unaffected** — verified:
  it contains no `LEGACY_TYPE_CHART`, `resolveTurn`, or
  `calcTypeMultiplier` references on live main.
- **Old chart file retirement is owed by the wiring PR, not this
  diff.** `src/lib/battleTypeChart.ts` (old 12-element derivation,
  merged Umbral/Mythic, 24 conflict cells, 44 owed cells) must be
  retired when the new chart ships — its header warns that shipping
  two charts makes two battles from the same move. That deletion must
  be NAMED in the wiring PR (repo anti-clobber laws); it is
  deliberately not in this staged diff so Mars judges the chart first.

## What the wiring PR still needs (after Mars judges the chart)

1. Mars's Deep answers, or explicit acceptance of flagged-×1 for
   Gen 2+ Deep lookups.
2. A grep check for battler-type display uses in BattleView (move
   display reads `TYPES[mv.type]` from `MOVES_DB` directly and is
   untouched by this diff; battler-type display must be confirmed
   the same way before merge).
3. Named retirement of `src/lib/battleTypeChart.ts` in the PR body.
4. Gates (lint/build/validate) in a CLEAN tree at live main, and a
   re-check that the diff still applies (`git apply --check`).
5. Pages rebuild + battle playtest after merge. The diff was NOT
   compiled or typechecked here (no full tree was built for it) —
   that is the wiring PR's gate, not a claim made by this staging.
