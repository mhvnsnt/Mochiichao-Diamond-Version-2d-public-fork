# True chart fill + wire plan — STAGED ONLY (no PR, no merge, no game-tree edits)

## 1. The 19-count problem — read this first (blocks any wiring PR as a "19 True chart")

The task asked for a 19×19 True table (361 cells) and said elements were
"already locked at 19". That count does not match any locked source found:

- Locked True set on main: **12 elements** — `docs/unification-map.md` §1
  ("Canonical types (settled — GameData TYPE_COLORS, the 12 True Elements)")
  and `src/lib/battleTypeChart.ts` on main (sha
  `bb168160c85fec3e3db5127628e22d129171f4b8`, 12 elements, 144 cells).
  The 12 are: Water, Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Deep,
  Flame, Mythic, Normal.
- Memory (2026-10-26 True-elements side-by-side) confirms the same 12, with
  5 open roster words (Beast, Silk, Wind, Neon, Flora) still undecided — not
  locked elements.
- Mars's 2026-10-27 ~07:46 decision as recorded says "elements already
  locked" with **no number 19** attached to it.

So this stage does **not** invent 7 extra True element names to reach 19.
What is staged instead:

- (a) The real deliverable: a **12×12 True table, 144 cells**
  (`trueTypeChart.ts` + `true-chart.json`), fully cited per cell.
- (b) A separate reconciliation file (`19-reconciliation.json`) showing the
  only 19-name set derivable without invention — the 18 legacy type words +
  Deep = 19, 361 cells — explicitly labelled NOT the True vocabulary, so the
  task's 361 arithmetic can be checked without anyone wiring it as "True".

A wiring PR must not present (b) as the True chart. If Mars does lock a
19-element True set by name, this stage's generator re-runs with those names;
until then, 19 is unfillable as True, for the exact reason above.

## 2. Counts (12×12 True table, 144 cells — percentages per standing rule)

| Status | Cells | % of 144 | Meaning |
|---|---|---|---|
| Sourced, non-neutral (2 / 0.5 / 0) | 28 | 19% | Every legacy pair mapping to the cell agrees, value ≠ 1 |
| Sourced, agreed neutral (1.0) | 49 | 34% | Every legacy pair agrees on 1.0 |
| **Sourced total** | **77** | **53%** | Direct legacy agreement |
| Analogue-filled (Aero via Flying) | 19 | 13% | Flying analogue; mapping proposed, not locked |
| **Backed total (sourced + analogue)** | **96** | **67%** | Ships a value with a cited basis |
| Conflict-neutral (flagged 1.0) | 25 | 17% | Legacy pairs disagree; prior-lane rule, never averaged |
| No-equivalent (flagged 1.0, all Deep) | 23 | 16% | No source type exists on disk anywhere |
| **Flagged total** | **48** | **33%** | Ships 1.0 + a flag, not a sourced value |

Deep + new-element cells (cells involving Aero or Deep): 44 total
(Aero-involved 23 + Deep-involved 23 − 2 cells that are both, Aero vs Deep
and Deep vs Aero).

| Subset | Filled / total |
|---|---|
| Deep + new-element cells filled (all Aero analogue) | 19 / 44 = 43% |
| Deep + new-element cells flagged | 25 / 44 = 57% (23 Deep no-equivalent + 2 Aero conflicts: Earth vs Aero, Aero vs Earth) |
| Deep cells alone filled | 0 / 23 = 0% |
| Aero cells alone filled (excl. Deep overlap) | 19 / 21 = 90% (2 remaining are the Earth conflicts) |

19-reconciliation (NOT True, arithmetic only): 361 cells = 324 legacy
18×18 cells with a modern-chart value + 37 Deep-involved cells flagged
no-equivalent (19 + 19 − 1). Deep filled there: 0 / 37 = 0%.

Comparison with the prior lane's main chart: it had 76 sourced / 24
conflict / 44 owed. This fill moves 76 → 77 sourced (Mythic vs Chrome
resolved to 0.5 by the corrected modern chart, §5), 24 → 25 conflicts
(the 2 new Aero-vs-Earth conflicts surface once Flying is mapped, minus
the resolved Mythic vs Chrome), and 44 owed → 23 owed (Aero's 21
non-Deep cells leave the owed list: 19 analogue-filled + 2 conflict).

## 3. Sources actually used (nothing invented, nothing web-guessed)

1. Modern 18 chart as encoded in repo `src/lib/constants.ts`
   (super / notVery / noEffect lists), **as corrected** — see §5.
   This is the most-recent-games chart (Gen 6+): Fairy included.
2. FireRed decomp on disk: `pokefirered-leafgreen/src/battle_main.c`,
   `gTypeEffectiveness[336]`, 112 triples parsed. HeartGold decomp on disk:
   `pokeheartgold/src/battle/overlay_12_0224E4FC.c`,
   `sTypeEffectiveness`, 112 triples parsed — **identical to FireRed on all
   17 shared types (0 diffs)**, so the two gens cross-check each other.
3. Black 2 decomp on disk: `pokebw2/src/ov167/btl_calc.c`
   `GetTypeEffectiveness` — type index 17 (placeholder) returns neutral,
   confirming the 17-type system; but the effectiveness matrix itself is
   binary data (`data_ov167_021d7500`), not a readable source table, so
   Black 2 is cited as canonical-gen confirmation, **not** as the parsed
   matrix. Black 2, FireRed and HeartGold all predate Fairy: **no decomp on
   disk contains any Fairy cell**.
4. Published Gen 6+ chart summaries (web search, used only as a cross-check,
   never as the sole source for a cell): Fairy super Fighting/Dragon/Dark,
   not-very Fire/Poison/Steel, resists Fighting/Bug/Dark, immune Dragon,
   weak Poison/Steel; Steel lost Ghost/Dark resistances in Gen 6; Ice
   not-very Steel/Fire/Water/Ice; Dragon not-very Steel, no-effect Fairy;
   Bug not-very Poison.
5. Modding-community sources on disk: searched
   `docs/modding-pulls-inventory.md`, `docs/pret-gen1-4-pull-summary.md`,
   the `gen5plus` PokeAPI extract, and `chao-modding-docs` — **none contains
   a type-effectiveness table or a Deep matchup**. Modding-community fill
   is therefore 0 cells directly; this is reported, not papered over.
6. Prior lane (main): `src/lib/battleTypeChart.ts` — its legacy→True
   mapping (WATER→Water, FIRE→Flame, GRASS→Earth, GROUND→Earth, ROCK→Core,
   STEEL→Chrome, DARK→Umbral, GHOST→Umbral, PSYCHIC→Mythic, DRAGON→Mythic,
   FIGHTING→Strike, NORMAL→Normal, BUG→Bug) is reused, and its conflict
   rule (disagreement → flagged neutral 1.0, never averaged) is retained.
   Its OWED Deep cells remain owed here.
7. Aero analogue (the one judgement call, labelled as such): roster Wind
   creatures are typed Aero (unification-map §2) and the Mars starting
   mapping recorded 2026-10-26 is Wind → Flying, so Aero is filled from
   Flying rows/columns with status `analogue-filled`, never `sourced`.
   If Mars rejects Wind → Flying, all 19 analogue cells revert to owed.

## 4. Unfillable — exact reasons (no guessing)

- **23 Deep cells (Deep vs every element + every element vs Deep,
  including Deep vs Deep):** Deep is used by 0 roster creatures, appears in
  no game on disk as a type, and in no modding doc on disk as a matchup.
  There is no source to fill from. Ships flagged neutral 1.0 only.
- **25 conflict cells:** two legacy types merge into one True element and
  the merged sources disagree (e.g. Umbral vs Normal: Ghost→Normal = 0,
  Dark→Normal = 1; Earth vs Earth: Grass→Grass = 0.5, Grass→Ground = 2,
  Ground→Grass = 1, Ground→Ground = 1). Picking one source would be a Mars
  decision, not a derivation, so they ship flagged neutral 1.0. Full list
  with disagreeing pairs: `CONFLICT_CELLS` in `trueTypeChart.ts`, and per
  cell in `true-chart.json`.
- **Unmapped legacy words (not True cells, but a wiring gap):**
  ELECTRIC, ICE, POISON, FAIRY have no target in the locked 12. Their
  legacy cells do not map to any True cell, so they are not counted as
  missing True cells — but live `MOVES_DB` contains ELECTRIC ×3 and
  POISON ×1 moves, so a naive swap would silently neutralise those 4
  moves. The patch handles them with a legacy fallback + flag (§6).
- **The 19-element True table itself:** unfillable without inventing
  element names — see §1. Needs Mars to name the 19, or to confirm the
  12 as the True set.

## 5. Four bugs found in the live old chart (NOT fixed here — staged only)

`src/lib/constants.ts` disagrees with both the decomp tables and the
modern chart on 4 cells (all omissions from a notVery list):

| Cell | constants.ts | Correct (decomp + modern chart) |
|---|---|---|
| ICE vs FIRE | 1 | 0.5 |
| ICE vs STEEL | 1 | 0.5 |
| BUG vs POISON | 1 | 0.5 |
| DRAGON vs STEEL | 1 | 0.5 |

Only DRAGON vs STEEL changes a True cell (Mythic vs Chrome: Psychic vs
Steel 0.5 + Dragon vs Steel 0.5 now agree → sourced 0.5, not a conflict).
The other three involve unmapped words (ICE attacker, POISON defender),
so they change no True cell — but they do mean BattleView's current live
damage is wrong on those 4 legacy matchups. A wiring PR should fix
constants.ts (or retire it) as a separate, named change; this stage only
records the bugs and uses the corrected values in `true-chart.json`.

Gen-6 Steel change, also recorded: FireRed/HeartGold (and Gen 5) have
Ghost vs Steel = 0.5 and Dark vs Steel = 0.5; the modern chart has both
= 1.0. Modern wins per this task, so Umbral vs Chrome = 1.0 sourced.
If a future lane instead rules Black 2 canonical for the chart, that one
cell flips to 0.5 — it is the only cell where the gen choice matters
after the §5 corrections (Fairy cells aside, which exist only in modern).

## 6. Wire plan (staged patch: `battleview-swap.patch`, NOT applied)

Steps for the future wiring PR, in order:

1. Copy `trueTypeChart.ts` into `src/lib/` unchanged (it is generated
   from `true-chart.json`; never hand-edit one without regenerating).
2. Apply `battleview-swap.patch` to `BattleView.tsx`:
   - Import `trueTypeMultiplier, LEGACY_TO_TRUE_ELEMENT` (keeps the
     legacy import for the fallback — do not delete it in the same PR).
   - In `executeDamage`, translate move + defender words through
     `LEGACY_TO_TRUE_ELEMENT`, then look up the True table.
   - Fallback, must-not-crash rule (prior-lane rule, cited): any flagged
     True cell ships its table value 1.0 **plus a flag** (the patch's
     `chartFlagged`, surfaced in the log line only after its wording is
     approved). Any **unmapped** legacy word (ELECTRIC/POISON moves,
     4/36 in live `MOVES_DB`) keeps the legacy calculation for that move
     and is flagged — it is not forced to 1.0, because 1.0 would silently
     change that move's damage.
   - STAB stays on legacy words (both sides untranslated) — untouched.
   - `TYPES` display names/colours stay untouched (True palette is a
     separate lane decision).
3. Decide ONE live chart and say so in the PR body: BattleView uses this
   True chart, and `battleResolver` receives the same chart object (it
   already accepts an injected chart). Do not ship BattleView on True
   while the resolver runs the old main chart — the warning already on
   main in `battleTypeChart.ts` applies verbatim.
4. Gate before merge: build passes; a test battle for each flagged cell
   returns 1.0 + flag (not a crash, not a sourced-looking value); the 4
   ELECTRIC/POISON moves still deal legacy damage; dual-type STAB cases
   unchanged.

## 7. Validation performed in this stage

- `true-chart.json` parses; 144 cells; 12 rows × 12 cols; every cell has
  value + status + reason + source list (Deep cells: empty source list
  by design, reason states why).
- `trueTypeChart.ts` was generated from the same JSON by one script, so
  the module and the JSON cannot drift; row/col counts re-checked after
  generation.
- `19-reconciliation.json` matrix checked: 19 rows × 19 cols = 361.
- Forbidden grep over all staged files: 0 hits for creature names,
  spoken lines, sound references, or image/brand-mark references
  (citations use type-category words and file paths only; no creature is
  named anywhere in this stage).
- No game-tree file was touched: only files under
  `black2-everything-else/apply-all/true-chart/` were written. No PR, no
  merge, nothing imported anywhere.

## 8. Files staged

- `true-chart.json` — 144 cells with per-cell source citations.
- `trueTypeChart.ts` — typed TS module, imported nowhere yet.
- `battleview-swap.patch` — exact BattleView swap + fallback, staged only.
- `19-reconciliation.json` — 18-legacy-plus-Deep 361-cell arithmetic, NOT True.
- `wire-plan.md` — this file.
