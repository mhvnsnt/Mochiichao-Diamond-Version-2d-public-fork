# Roster-wins corrections — decision batch for PR #186 (Mars 2026-10-26 ~14:15 CDT)

Old base: `dfffd01027d2035045aa08e778d7c40e2851762c` (PR #186's base).
New main head at branch time: `d75a5e74309e3f7213b5025fb584e6f5f63fecca` (PR #187 merged,
docs-only, 6 files added, 0 modified, 0 deleted). The superseding branch is cut
from the NEW head so #187 is never clobbered; #186 itself is left open (superseded)
if its old branch cannot be updated cleanly — the report states which path was taken.

Roster wins over species.ts in every drift case. Nothing below invents a number.

## Corrections applied, file by file

1. `src/lib/species.ts` — 003: `Aquari-OS` → `AquariiOS` (hyphen out). Stats
   unchanged (79/83/100/85/105/78 agree on both sides).
2. `src/lib/species.ts` — 005: `Chromedile` → `Chromejaww`. Chromedile is an OLD
   NAME, not a separate evolution — no Chromedile evolution entry is created,
   and every reference is renamed consistently (see reference sweep below).
3. `src/lib/species.ts` — 038 Sproutle stats: code 50/60/50/40/40/30 → roster
   55/68/64/45/55/31. Evolution 038→039 Lv18 unchanged (target is now Shellguard).
4. `src/lib/species.ts` — 039: `Dreadtoise` → `Shellguard`, stats → roster
   75/89/85/55/65/36, evolution ADDED 039→040 Lv32. The old code 039 stats
   (90/90/110/60/80/40) matched NEITHER roster 039 nor roster 040 and do not
   survive anywhere — roster wins, so they are replaced, not preserved.
5. `src/lib/species.ts` — 040: NEW entry `Dreadtoise`, roster stats
   95/109/105/75/85/56, no evolution (terminal). This is the home the staged
   040 learnset (10 level / 8 TM / 4 tutor) was orphaned from; it is NOT folded
   into 039.
6. `src/lib/global_roster.json` — line 14 quote typo ONLY: `"atk: 63` →
   `"atk": 63`. Value 63 corroborated by species.ts 002. Documented as a typo
   fix, not a content deletion.
7. `src/lib/global_roster.json` — line 266 Pebblefist HP `"hp": 4-5` LEFT
   UNTOUCHED. Mars-only value; no number invented, HP stays null in tolerant
   parse. Strict JSON parse of the roster therefore still fails on this line
   by design — the next slice must not "fix" it with a guessed number.
8. Trainer reference — Bug Catcher Rick: species 016 Squirmite, NOT 004
   Razorgater. VERIFIED ALREADY CORRECT on main at branch time:
   `src/world/FullWorldMaps.ts` `trainer_bugcatcher` already lists id 016
   Squirmite (another lane landed it), so this batch makes NO Rick change.
   The old 004-carry-over note survives only in staged
   `teams-items/fixed-teams.json`, which is not shipped here. Likewise the
   `champion_mythar` team member already reads `AquariiOS` on main — no
   rename needed there. What this batch DOES change in world data:
   `master_lin` team member id 039 `Dreadtoise` → `Shellguard` (name only;
   instance stats untouched), plus the `WorldEngine.tsx` trainerBattleMon
   comment example updated from the stale 004/Squirmite wording to the
   current 016/no-code-entry-yet state.
9. `src/lib/moves.ts` — existing 16/36 names that match Black 2 verbatim are NOT
   renamed (separate non-decision). Reference sweep result recorded in the PR
   body: every `Aquari-OS` / `Chromedile` / `Dreadtoise`-as-039 reference found
   by grep across `src/` is listed there; no other file referenced the old names.
10. Staged data files (`mochiichao_learnsets.json`, `mochiichao_evolutions.json`,
    `mochiichao_moves_catalogue.ts`, provenance) — NO content change needed:
    they were already built against roster names/IDs, so 039 Shellguard
    (7/7/3) and 040 Dreadtoise (10/8/4) now attach to the right code entries.
    `evolution-hook.ts` is extended (not rewritten) with the two safe chains
    as data + pure resolver; BattleView hook-up stays 0% (see below).

## Evolution-hook wiring (honest %)

- Data-ready: 100% for the two safe chains (013→014 Lv16→015 Lv32, canCancel
  true; 038→039 Lv18→040 Lv32).
- BattleView-wired: 0%. Species 013/014/015 still have no species.ts code entry,
  and 040 enters code only with this batch, so wiring BattleView calls now
  would attach to nothing or to a just-moved target. The wiring batch is a
  separate gated step with its own checklist (in evolution-hook.ts).

## Counts after this batch

- Moves catalogue: 120/354 FireRed = 34% (120/560 = 21% vs Black 2). Live game
  still uses 36 until the merge-into-MOVES_DB wiring batch.
- Learnsets: level 47/47 species, 333 entries; TM 47/47, 328 entries (20-slot
  catalogue); tutor 47/47, 138; egg 16/16 applicable base forms, 48; HM 0/47
  shape-only.
- Evolutions: 29/29 roster links, 18 terminal/single null.
- Transform system (separate PR): code-ready 100%, BattleView/dialogue-wired 0%.

## Still held (not invented, not hidden)

- Pebblefist 035 HP — Mars-only.
- Roster slots 047–146 — NOT filled by this batch.
- HM assignments, TM catalogue expansion 20 → 50+8 — later batches.
- 14 new battle-effect tokens — data only, BattleView support unwired.

## Addendum — additional rename targets + gate heads (same batch)

- `src/lib/spriteSheets.ts`: 003 → `AquariiOS`, 005 → `Chromejaww`,
  039 → `Shellguard` (display names only; sheet URLs already read
  `atlas_aquariios` / `atlas_chromejaww` / `atlas_shellguard`, and 040 was
  already `Dreadtoise` with `atlas_dreadtoise` — art already roster-correct).
- `src/lib/generated/battleSpriteRegistry.json`: displayNames 003 →
  `AquariiOS`, 005 → `Chromejaww`, 039 → `Shellguard` (slugs already
  `aquariios` / `chromejaww` / `shellguard`). If this registry is ever
  regenerated, its generator must use roster names or the drift returns.
- `src/lib/moves.ts`: full sweep — ZERO references to `Aquari-OS`,
  `Chromedile`, `Dreadtoise`, or `Shellguard`; no change needed. The 16/36
  existing move names matching Black 2 verbatim are NOT renamed.
- Checked and intentionally LEFT: `src/world/GameData.ts` id 13 `Dreadtoise`
  (its own small index, not a roster id; `Dreadtoise` remains a valid roster
  name as 040); `creatureAnimation.ts` / animation-index comments mentioning
  `Dreadtoise` as a family/pilot label (still a valid creature); docs
  mentioning `Dreadtoise` historically (still valid as 040).
- Gate heads: PR #186's old base `dfffd010`; PR #187 head `d75a5e7`;
  full build gate first run on clean clone at `0ff17d9` (PR #194) + this diff
  (Vite build exit 0, `tsc --noEmit` exit 0, staged `validate.py` ALL PASSED,
  roster-wins check ALL PASSED), then RE-RUN on clean clone at `d5ec537`
  (PR #201) + this diff after an upstream dialogue-only change to
  `FullWorldMaps.ts` (4 lines, no master_lin change) forced a rebase of that
  one file — the re-gate passed identically, and a final pre-upload sha
  check confirms none of the 6 modified files moved again before upload.
- `npm ci` note (pre-existing, not this PR): main's `package-lock.json` is
  out of sync (`easystarjs` missing from the lock), so `npm ci` fails on a
  fresh clone before any of this PR's files are involved. The gate used
  `npm install` (237 packages) + build + lint, the same route prior merged
  PRs used. The lock file modified by that install is a gate artifact only
  and is NOT uploaded with this PR.
- File deletions in this PR: NONE. Line-level changes inside the 6 modified
  files are exactly the Mars-approved roster-wins corrections above
  (including dropping the optional `pokeApiId` from corrected 039, which
  belonged to the mis-numbered entry, and the 1-line roster quote fix).
  New files: 9 (4 generated data + `evolution-hook.ts` + 4 docs).
