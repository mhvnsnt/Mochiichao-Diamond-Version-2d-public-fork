# Drift reconciliation — PR Batch 2 (moves / learnsets / evolutions) — HELD, NOT MERGED

Date: 2026-10-26. Main verified via GitHub API: `dfffd01027d2035045aa08e778d7c40e2851762c`.
Staged source: `~/workspace/mochiichao-work/pokemon-parity-fill/moves-learnsets/`
(validate.py ALL CHECKS PASSED, re-run 2026-10-26; tsc --noEmit --strict exit 0).

## Verdict

NO provable reconciliation exists from repo evidence alone. Both authority
files still disagree on main at dfffd010: `src/lib/species.ts` (code, 12
entries) vs `src/lib/global_roster.json` (roster, 47 entries). No third file
on main corrects one side — the roster authority is only
global_roster.json and the code authority is only species.ts. Therefore:
**no winner was picked, no existing file was edited in this branch, and
the PR is HELD pending Mars's drift decision. Do not merge as-is.**

## Reconciliation table

Stats order: hp/atk/def/spa/spd/spe. "Staged built against" is proven by
validate.py: learnset names == roster names (0 mismatches), evolution
links == roster verbatim (0 mismatches).

| ID | Code (species.ts, main) | Roster (global_roster.json, main) | Staged built against | Impact if merged as-is |
|---|---|---|---|---|
| 003 | "Aquari-OS", 79/83/100/85/105/78, no evo | "AquariiOS", 79/83/100/85/105/78, no evo | ROSTER ("AquariiOS") | NAME-ONLY. Stats agree exactly. By ID the learnset (8 level / 8 TM / 4 tutor) lands on the right creature; by name it finds no "AquariiOS" in code. Needs a name pick. |
| 005 | "Chromedile", 65/80/80/59/63/58, evo 005→006 Lv30 | "Chromejaww", 65/80/80/59/63/58, evo 005→006 Lv30 | ROSTER ("Chromejaww") | NAME-ONLY. Stats and evo id/level agree. By ID the learnset (7/7/3) lands correctly; by name it finds no "Chromejaww" in code. Needs a name pick. |
| 038 | "Sproutle", 50/60/50/40/40/30, evo 038→039 Lv18 | "Sproutle", 55/68/64/45/55/31, evo 038→039 Lv18 | ROSTER for name/evo; learnsets carry no stats | STATS CONFLICT, name/evo agree. Staged Sproutle learnset (5 level / 6 TM / 2 tutor / 3 egg) attaches by ID to a code entry whose stats are all lower than roster. Battle balance would follow the wrong stat set until Mars picks one. |
| 039 | "Dreadtoise", 90/90/110/60/80/40, NO evo in code | "Shellguard", 75/89/85/55/65/36, evo 039→040 Lv32 | ROSTER ("Shellguard", evo →040 "Dreadtoise" Lv32) | HIGH — ID SHIFT. By ID, Shellguard's learnset (7/7/3) lands on a "Dreadtoise" code entry whose stats match NEITHER roster 039 nor roster 040 (040 = 95/109/105/75/85/56). By name, Shellguard has no code entry at all. Code 039 is also terminal while roster 039 evolves. This is the merge blocker. |
| 040 | NO code entry (species.ts has only 001–010, 038, 039) | "Dreadtoise", 95/109/105/75/85/56, no evo | ROSTER ("Dreadtoise", 10 level / 8 TM / 4 tutor) | ORPHAN. Staged 040 learnset has nowhere to attach in code. It must NOT be folded into code 039. Needs a new 040 code entry once Mars decides. |
| 035 | No code entry | "Pebblefist", HP literally `"hp": 4-5` (not a number) | ROSTER name/evo (035→036 "Cragarm" Lv25); learnsets carry no stats | NOT drift, but open: HP is Mars-only, still null in tolerant parse. No stat was invented. |
| 002 (typo) | Tiidebiite atk 63 (matches tolerant roster) | Line 14: `"atk: 63` — missing closing quote; strict JSON parse FAILS | Tolerant parse (`"atk": 63`) | PROVABLE VALUE, FIX NOT APPLIED HERE. The value 63 is corroborated by species.ts, but fixing it would make this branch a change-to-existing-file branch. To keep the held diff additions-only (0 deletions), the 1-character fix rides with the Mars decision batch, not this PR. |
| 266 (typo) | — | Line 266: Pebblefist `"hp": 4-5` — strict JSON parse FAILS | Tolerant parse (`"hp": null`) | NOT fixed here: any numeric HP would be invented. Mars-only. |

## Species where code and roster AGREE (no conflict)

001 Mochii, 002 Tiidebiite, 004 Razorgater, 006 Reaperdile, 007 Tyrage,
008 Duneclaw, 009 Oblivirex, 010 Kittember — names and all six stats
identical in both files; evo ids/levels also agree where code has them
(001→002 Lv16, 002→003 Lv36, 004→005 Lv18, 005→006 Lv30, 007→008 Lv16,
008→009 Lv34, 038→039 Lv18). Their staged learnsets attach by ID without
conflict, but they are held with the batch so the merge is not partial.

## Evolution hook — left shape-only, deliberately

- Showcase pair is safe AS DATA: roster Pupbble #013 → Terradog #014 Lv16
  → Quakehound #015 Lv32, staged evolutions.json agrees verbatim, and
  evolution-hook.ts MID_FIGHT_SHOWCASE (013→014) agrees. canCancel true.
- It is NOT wired: species.ts on main has no 013/014/015 entries, and
  BattleView does not call the hook. Wiring now would attach to nothing
  (or, worse, to a wrong species after any id shift). Wiring is a later
  batch, after the drift decision and after 013–015 code entries exist.
- No other evolution method is data: roster uses LEVEL only (29 links,
  18 terminal/single null). Item/trade/friendship/etc. exist in the hook
  as TYPES with 0 roster instances.

## Existing-move names — NOT renamed

16/36 existing moves.ts names match Black 2 move names verbatim (Aqua Jet,
Fire Punch, Razor Leaf, Thunderbolt, Wild Charge, Flash Cannon, Earth
Power, Bulldoze, Dark Pulse, Night Slash, Crunch, Tackle, Quick Attack,
Body Slam, Dragon Claw, Poison Jab). Renaming them would break species.ts
references. New moves: 0 names equal a Black 2 move name (validate.py gate).

## What Mars must decide (in plain language)

1. 003: "Aquari-OS" or "AquariiOS"?
2. 005: "Chromedile" or "Chromejaww"?
3. 038 Sproutle stats: code 50/60/50/40/40/30 or roster 55/68/64/45/55/31?
4. 039/040: is code 039 really roster 040 Dreadtoise mis-numbered, with
   roster 039 Shellguard missing from code — and what are code 039's
   90/90/110/60/80/40 stats, since they match neither roster entry?
5. Pebblefist 035 HP (the "4-5" placeholder) — Mars-only value.
6. Confirm the line-14 quote fix (`"atk": 63`) rides with that decision.

Until those answers land, this PR stays open and unmerged. Nothing in it
touches Netlify, Pages, or any live game code: all 8 files are new,
species.ts and moves.ts are untouched, and the live game still uses 36 moves.

## RESOLUTION — roster wins (Mars 2026-10-26 ~14:15 CDT, supersedes the HELD status above)

This held batch is superseded by a gated PR branched from the then-current
main head (see docs/roster-wins-corrections-2026-10-26.md for the file-by-file
record). Decisions applied: 003 = AquariiOS; 005 = Chromejaww (Chromedile is
an old name, not an evolution); 038 Sproutle stats = roster 55/68/64/45/55/31;
039 = Shellguard (75/89/85/55/65/36, evolves →040 Lv32); 040 = Dreadtoise final
(95/109/105/75/85/56); roster line-14 quote typo fixed (`"atk": 63`); Bug
Catcher Rick = Squirmite 016 (verified already correct on main at branch time
— no change needed in this batch). Pebblefist 035 HP stays Mars-only (not
resolved by this call; see the corrections doc for the later HP-40 note flagged
to the coordinator, which this batch does NOT apply on its own authority).
The original held analysis above is preserved unchanged; only this section
was added at resolution time.
