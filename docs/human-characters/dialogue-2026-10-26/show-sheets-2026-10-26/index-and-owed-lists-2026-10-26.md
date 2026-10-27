# Show sheets index + owed lists -- 2026-10-26

Status: SHOW-FIRST / STAGED ONLY. NOT IN REPO, NOT WIRED, NOT LIVE, NOT LOCKED CANON.
Mars decides all picks and locks. This index prepares; it never locks.
No Mars-seen file was overwritten to make these sheets. All sheets below are NEW dated files in show-sheets-2026-10-26/.

## New show sheets in this batch (12 files)
Dojo/elite, one per character, lines copied verbatim from dialogue-drafts.json:
1. show-sheet-dojo_3_tetsu-2026-10-26.md -- Tetsu, Dojo 3 Chrome Neon City, 9 lines, 4/4 speeches drafted, approval PENDING.
2. show-sheet-dojo_4_kenji-2026-10-26.md -- Kenji, Dojo 4 Strike Market City, 9 lines, 4/4 speeches drafted, approval PENDING.
3. show-sheet-dojo_5_phantom-2026-10-26.md -- Phantom, Dojo 5 Umbral Central City, 9 lines, 4/4 speeches drafted, approval PENDING.
4. show-sheet-dojo_6_shizuku-2026-10-26.md -- Shizuku, Dojo 6 Water Harbor City, 9 lines, 4/4 speeches drafted, approval PENDING.
5. show-sheet-dojo_7_homura-2026-10-26.md -- Homura, Dojo 7 Flame Ember Island, 9 lines, 4/4 speeches drafted, approval PENDING.
6. show-sheet-elite_1_umi-2026-10-26.md -- Umi, Elite seat 1 Water Plateau, 9 lines, 4/4 speeches drafted, approval PENDING.
7. show-sheet-elite_2_gin-2026-10-26.md -- Gin, Elite seat 2 Chrome Plateau, 9 lines, 4/4 speeches drafted, approval PENDING.
8. show-sheet-elite_3_hono-2026-10-26.md -- Hono, Elite seat 3 Flame Plateau, 9 lines, 4/4 speeches drafted, approval PENDING.
9. show-sheet-elite_4_yoru-2026-10-26.md -- Yoru, Elite seat 4 Umbral Plateau, 9 lines, 4/4 speeches drafted, approval PENDING.
New drafts and pick sheets:
10. show-sheet-nurse-faye-battle-2026-10-26.md -- Faye battle lines, NEW draft, 9 lines (intro 3, about-to-win 2, defeat 2, after 2), approval PENDING.
11. show-sheet-rename-picks-2026-10-26.md -- broker / mechanic / cook picks + stall-name rule + locked Voss dual ruling, 0/3 picked.
12. show-sheet-iwao-carryover-2026-10-26.md -- Iwao dual placement + carryover proposal + revision flags, 0/1 team picked, 0/9 revised lines locked.
Plus this index file itself (13th new file, not a show sheet).

## Dialogue lock percentages (percentage rule, counts behind every figure)
- Dojo/elite speeches drafted: 36/36 = 100% drafted (81 lines).
- Dojo/elite speeches locked: 0/36 = 0% locked until Mars approves line by line.
- Faye battle speeches drafted: 4/4 = 100% drafted (9 lines). Locked: 0/4 = 0%.
- Faye heal lines: 10 lines already drafted in mars-voice-dialogue-2026-10-26.md (not re-approved here). Battle lines do not change heal lines.
- Coordinator B dialogue set (context, from brief): 194 spoken lines across 19/19 characters = 100% present in mars-voice-dialogue-2026-10-26.md. That file itself is NOT overwritten by this batch.
- Overall dialogue in this batch: show sheets cover 81 + 9 = 90 lines, all PENDING.

## Validation results (re-run 2026-10-26, this batch)
- node validate-dialogue.mjs: ALL CHECKS PASS. Leaders 9/9, speeches 36/36, lines 81, open slots noted 8.
- Em dash check on dialogue-drafts.json, ink-dialogue.json, mars-voice-dialogue-2026-10-26.md, and all 13 new files in show-sheets-2026-10-26/: 0 em dashes and 0 en dashes total in the new directory, and 0 inside any quoted spoken line anywhere in the batch (verified by extracting every quoted string from the new sheets and checking it).
- Superseded Dojo 5 name check: 0 occurrences of the superseded Dojo 5 name in any spoken line, character sheet, or source dialogue file. The only occurrence of that string in the new batch is this index sentence itself, naming the term being checked. Phantom is the locked Dojo 5 name.
- Pokemon exact-dialogue verbatim check: 0 copied lines claimed. All 81 dojo/elite lines are the staged Mochiichao drafts from dialogue-drafts.json; all 9 Faye battle lines are new drafts written for the Faye sheet; no Pokemon character, species, or town name appears in any spoken line on any new sheet. Method note, stated honestly: this is a source-and-grep check (staged sources + name grep), not a line-by-line comparison against the full Pokemon script corpus, which is not in this workspace.
- Version-lock registry check: docs/locked-versions registry read at ~/workspace/mochiichao-work/version-lock/locked-versions.md. Only locked entry relevant here is Razorgater attacks CURRENT take-6 / SUPERSEDED take-5 and earlier. This dialogue batch references no Razorgater asset, so no superseded asset was used. Dialogue files themselves are not in that registry; the version-lock rule applied here is: new dated filenames, never overwrite a Mars-seen file, PENDING approval state on every sheet.

## Admin Ink knots still owed (admin dialogue exists in SYNDICATE-ADMINS, not in Ink)
- Ink knots present now: 21/21 in ink-dialogue.json (dojo 1-8 incl. 2 Luigi branches, elite 1-4, iwao, jax, cowboy, merv, hoshino, nurse_faye_heal, shop_generic, greeting_generic).
- Admin Ink knots present: 0/10 = 0% in Ink. Admin dialogue drafted in SYNDICATE-ADMINS-2026-10-26.md: 10/10 admins = 100% drafted in prose, 0/10 ported to Ink.
- Lines to port: 40 lines total (4 per admin: intro, mid-battle, defeat, after). Per admin:
  1. Voss -- Region 1, Pale Town Tower, Archivist (Umbral records), team 2 (Inklet Lv24, Duneclaw Lv25) -- 4 lines, knot owed.
  2. Ferren -- Region 1, Central City HQ top, Warden (Chrome machinery), team 3, Lv32-34 -- 4 lines, knot owed.
  3. Marlow -- Region 2, Mahogany Hideout, Smuggler (water/earth routes), team 3, Lv43-45 -- 4 lines, knot owed.
  4. Tamsin -- Region 2, Goldenrod Radio Tower, Signal Hijacker (neon/silk), team 4, Lv45-46 -- 4 lines, knot owed.
  5. Corvin -- Region 3, Lilycove Hideout, Frontier Fixer (heavy generalist), team 4, Lv52-54 -- 4 lines, knot owed.
  6. Ilsa -- Region 3, Mauville, Power Engineer (industrial), team 4, Lv55-57 -- 4 lines, knot owed.
  7. Aldous -- Region 4, Jubilife City, Institute Public Face (specimens), team 5, Lv62-64 -- 4 lines, knot owed.
  8. Mireille -- Region 4, Veilstone warehouses, Rift Sampler (heavy specimens), team 5, Lv66-68 -- 4 lines, knot owed.
  9. Cassian -- Central/roving, Rift gate, Coordinator (whole network), team 6, Lv70-72 -- 4 lines, knot owed.
  10. Soren -- Central/roving, Rift gate, Rift Hunter (Rift pursuit), team 6, Lv74-76 -- 4 lines, knot owed.
- Admin teams total: 42 creature slots (2+3+3+4+4+4+5+5+6+6), per the SYNDICATE file summary table.
- Other Ink knots owed (not admin, listed so nothing is silently dropped):
  - Nurse Faye battle knot: 0/1 = 0% in Ink (drafted in this batch, 9 lines, 4 stitches). Heal knot nurse_faye_heal already exists.
  - Iwao revised knot: 0/1 = 0% revised (existing iwao knot is the stale side-trainer draft; revision PENDING Mars's dual-placement lines).
  - Representation named-pick knots (broker, mechanic, cook, cartographer Voss): 0/4 = 0% in Ink (names not yet picked, no dialogue drafted for them; generic greeting lines only).
  - Champion after Elite knot: 0/1 = 0% (conflict unresolved, Yoru names nobody; NOT decided here).
  - Luigi Dojo 8 team: named in no dialogue line; team decision still open (not an Ink knot, listed as a blocker).
- Total Ink knots owed: 10 admin + 1 Faye battle + 1 Iwao revision + 4 representation = 16/16 owed = 0% ported/revised (counting only knots with drafted-or-pickable content; Champion knot excluded because its content does not exist yet).

## Capsule shop price-TBD lines -- MUST be updated to the priced table before any PR
- Source lines to update (in mars-voice-dialogue-2026-10-26.md, NOT edited by this batch -- Mars-seen file untouched):
  - Shopkeeper, Capture Capsules (price TBD, do not invent a number), 2 lines: "Hey, we got capture capsules here, but they cost more than a Luigi Cube. A Luigi Cube is 250 CR, and a capsule is dearer than that." / "They are worth it, if your team is ready for them. If not today, they will still be here when you are."
  - Shopkeeper, cannot afford (capsules, by design usually unaffordable at the first store), 2 lines: "Not quite enough for a capsule yet. That is normal this early. Fight a little, save a little, and come back." / "The capsules are not going anywhere. Your team will be ready for them soon enough."
  - Lines to update: 4/4 = 100% of the capsule price lines are still TBD-worded. Updated: 0/4 = 0%.
- Priced table to update them TO (CAPSULE-STATS-FILL-2026-10-26.md section 1c, buy / sell, sell = floor(buy / 2)):
  - Luigi Cube: 250 CR (locked canon, unchanged).
  - Gleam Capsule: 750 buy / 375 sell, x1.5 always.
  - Prime Capsule: 1500 buy / 750 sell, x2.0 always.
  - Mesh Capsule: 1250 buy / 625 sell, x3.0 vs Aqua or Bug targets, else x1.0.
  - Echo Capsule: 1250 buy / 625 sell, x3.0 if species already caught in the Dex, else x1.0.
  - Sprout Capsule: 1250 buy / 625 sell, (40 - target level) / 10, floored at x1.0.
- PROPOSED replacement wording (proposal only, NOT applied to the Mars-seen file, Mars approves or rewrites):
  - Capsules set: "Hey, we got capture capsules here. Gleam Capsules are 750 CR, and the Prime Capsule is 1500 CR. A Luigi Cube is 250 CR, and every capsule costs more than that." / "Mesh, Echo, and Sprout Capsules are 1250 CR each, and each one only beats a Luigi Cube when its condition holds. Ask me about the condition before you spend."
  - Cannot-afford set: keep the shape, price it: "Not quite enough for a Gleam Capsule yet at 750 CR. That is normal this early. Fight a little, save a little, and come back." / "The capsules are not going anywhere. Your team will be ready for them soon enough."
- FLAG, stated plainly (not resolved here): the old TBD wording assumed capsules are usually unaffordable at the first store, but the priced-table fill notes Gleam at 750 CR may be affordable on a fresh wallet, which would change the first-store beat. Mars decides whether the first-store beat or the Gleam price changes. Do NOT ship either version until that is decided.
- PR gate: 0 PRs opened by this batch. No shop line is live until the 4 TBD lines above are replaced AND Mars approves the replacements.

## What was NOT done (percentage rule)
- No file in dialogue-2026-10-26/ was overwritten: 0 overwritten, 13 new files added in show-sheets-2026-10-26/.
- No dialogue locked: 0/36 dojo/elite + 0/4 Faye battle + 0/3 rename picks (Voss locked separately, not by this batch).
- No Ink knots added: 0/16 owed knots ported in this batch (drafting and indexing only; porting waits on Mars approvals).
- No PR: 0 PRs, 0 repo edits, 0 game wiring. Wiring stays 0% until approvals + PR gate.
- GPU: dialogue text work is CPU-only. A GPU genuinely cannot help writing, counting, or validating text lines, so no Kaggle job was used or needed for this batch. That reason is stated plainly per the GPU-first rule; GPU-able work in other lanes still goes to Kaggle first.
