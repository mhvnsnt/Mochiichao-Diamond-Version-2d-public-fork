# Human Characters Checkpoint — 2026-10-26 ~00:19 CDT

Purpose: so no Human-lane work gets lost if a worker dies, a chat
compacts, or a new agent picks this up. This file is the single
resume point. It names what is DONE, what is OWED, and where every
file lives. It does not decide any Mars-only question.

## Where we are, counted (Pokemon 8-step checklist)

Pokemon per-character checklist, from FireRed/HeartGold structure:
(1) model sheet, (2) world front/back/left/right, (3) walk frames,
(4) battle back (player) / battle front (trainer), (5) portrait icon,
(6) special-action variants only where the character does that thing,
(7) data, (8) 64x64 atlas + JSON manifest.
Three-quarter battle views are an EXTRA Mars rule on top of the 8,
counted separately below, not inside the 8.

Counted 2026-10-26, labelled as a counted estimate (partial steps
counted as done only where the file exists and was eye-checked):
- Characters in scope: 34
- Total steps: 34 x 8 = 272
- Steps done: 115
- Human character art: 115/272 = 42% done, 157 steps owed

Breakdown:
- Players A/B/C/D: A 7/8, B 5/8, C 5/8, D 5/8 = 22/32
- Named canon Hex/Aeon/Mochiko: 7/8, 7/8, 6/8 = 20/24
- Mom variants x4 (Black/East Asian/Latina/White): 4/8 each = 16/32
- Trainers Dojo/Garden/Tech/Shopkeeper: 6/8 each = 24/32
- Antagonists Krix/Syndicate/Liberation: 6/8 each = 18/24
- Townspeople flame/racing/logo/junkyard: 1/8 each = 4/32
- Secondary Ferry/Announcer/PC clerk/Garden Race Official v2: 1/8 each = 4/32
- Lin v2 / Terra Warp A / Hoshino / Cowboy Farmer Kid / Lab Assistant / Hacker grunt: 1/8 each = 6/48
- Champion Mythar (human): 1/8
- Castagnoli: 0/8 — UNVERIFIED, blocked on Mars's canon, not counted as done

Three-quarter battle sets (extra, full size, 4 views each):
Player A done, Hex done (Mars ❤️ 2026-10-26), Aeon done,
Mochiko done = 4 sets. Owed: Dojo, Garden, Tech, Shopkeeper,
Krix, Syndicate, Liberation, Lin, Terra, Hoshino, Cowboy,
Lab Assistant, Ferry, Announcer, PC clerk, Garden Race Official,
Champion Mythar, plus B/C/D player backs in full size and
Liberation full-size front.

## What is DONE and where it lives

Local lane root: ~/workspace/mochiichao-work/human-characters/
- Model sheets: players/, named-canon/, trainers/, antagonists/,
  townspeople/ (see CANON-HUMAN-CHARACTERS.md for approvals)
- Step-8 sheets + atlases: in-game-sheets/
  - Atlases DONE 11/11 for Mom/trainers/antagonists
    (mom-black, mom-east-asian, mom-latina, mom-white,
    dojo-student, garden-keeper, tech-tinkerer, shopkeeper,
    krix, syndicate-grunt, liberation-front) + player A/B/C/D,
    hex, aeon, mochiko atlases.
  - Cutters: cut_atlas.py, cut_atlas_layoutb.py,
    cut_atlas_generic.py (run-detection only, never grid)
- On main via PRs: #15 (batch 1), #18 (Player A swap).
  Atlas batch 11 sent to main chat 2026-10-25 ~23:56 CDT
  (submission 632ee74e) — PR number NOT yet returned, do NOT
  claim merged until main chat reports it.
- Canon rulings that must NOT be re-asked: see
  CANON-HUMAN-CHARACTERS.md and CONVERSATION-LOG-2026-10-25.md.
  Highlights: balanced cast; Krix dreadlocks + gold tooth canon;
  Liberation current = v2; Terra current = Warp A;
  Garden Keeper front current = v2; Shopkeeper portrait current
  = v2 cel; Dojo front current = v2; Mom race varies with player
  pick; Castagnoli UNVERIFIED.

## What is OWED, in order (producer order)

1. Main-chat atlas PR (above) — merge gate, additions only,
   0 deletions, build/lint/validate pass, mergeable CLEAN.
2. Three-quarter sets: Dojo, Garden, Tech, Shopkeeper, then
   Krix, Syndicate, Liberation, then Lin/Terra/Hoshino/Cowboy/
   Lab Assistant/secondary.
3. Step 8 for model-only characters: Hacker grunt, Lin v2,
   Terra Warp A, Hoshino, Cowboy Farmer Kid, Lab Assistant,
   Ferry Captain, Arena Announcer, PC Clerk, Garden Race
   Official v2, Champion Mythar, townspeople x4 — walk, battle
   front/back, portrait, atlas each.
4. Battle-pack gaps: B and C full-size backs, Liberation
   full-size front, Hex/Aeon/Mochiko battle backs wiring.
5. Main-chat wiring: B/C/D/Hex/Aeon/Mochiko swaps, battle
   front/back wiring, TWO separate proportion Options
   (World Full/Chibi default Chibi; Battle Full/Chibi
   default Full Size), clothing-system slot wiring.
6. Playtest on a published build, cut/fix what fails, THEN
   new gap characters only.
7. BLOCKED, Mars only: Castagnoli canon; Mom parents-race
   selector; Hoshino party proposal; Cowboy party + name;
   Champion Mythar capsule fox; non-binary and
   disabled/prosthetic representation (do NOT invent).

## How to resume after a loss

1. Read this file first, then CANON-HUMAN-CHARACTERS.md,
   CONVERSATION-LOG-2026-10-25.md, and the three batch logs
   in in-game-sheets/ (MOM/TRAINERS/ANTAGONISTS).
2. Verify on-disk files before re-generating anything — a
   daemon restart does NOT delete files, only workers.
3. Never overwrite a file Mars has seen; new version =
   new filename. Never assume a regular grid in a walk sheet.
4. Never hand-edit images. No new likeness for a character
   that already has one. Show confirmation items to Mars
   first, never block other work on them.
5. Autonomous cron: mochiichao-autonomous-continue, every
   10 minutes, goal-owned, delivery to main chat. Do NOT
   create a duplicate; update that one.
