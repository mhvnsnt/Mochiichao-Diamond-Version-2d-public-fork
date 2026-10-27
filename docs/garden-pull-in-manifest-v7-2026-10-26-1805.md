# Garden pull-in manifest — Chao Garden lane — 2026-10-26

Rule for this lane (Mars, 2026-10-26, standing): pull in 100% first, before
hand-tooling anything. Excluded from every pull, verified 0 in this file:
a creature name, a character name, dialogue, a cry, a logo, a town name,
art, or sound from the Pokemon games or from Sonic Adventure. Everything
else — system structure, order, windows, inputs, values, save fields —
is pulled and mapped below, then swapped to Mochiichao originals.

This manifest is the pull-in step. No Garden code was hand-tooled from it
yet, and no new sprite was generated from it yet. GPU check for the first
render batch is running separately (Kaggle, Mars FMMG, free only) — its
result, not a submission receipt, is the gate for any render claim.

## 1. Template base we already have — HAVE, do not rebuild from scratch

- `src/lib/mochiichao-systems.ts` (183 lines, on main via PR #9, merged):
  GardenStats Dive/Glide/Sprint/Might/Endurance 0–99, `applyGardenItem`
  (clamped), `dominantStat`, `gardenBattleBonus` capped +9%, `gardenForm`
  Form I at total 150 / Form II at 300, `colorwayFor` (string only, no
  palette/overlay/aura definitions yet), `typeVariant` (only on a 20-point
  stat lead, dive→Aqua, glide→Aero, sprint→Strike, might→Chrome,
  endurance→Earth), `dataRevert` (Garden stats halved, colorway/parts kept).
- `src/components/views/GardenView.tsx` (196 lines, pass 1): Mainframe
  Gardens screen, party list, Garden Stats bars, alignment (±25 neutral
  band), Form, bonus, colorway string, type variant, Data-Fruit buttons,
  places Academy / Market / Race Track / Sparring Ring / Farm Plots.
  Stated limits in the file itself: Garden records are local placeholder
  records, NOT yet persisted to the save; places are PLACEHOLDER text.
- `src/lib/art-sets.ts` (72 lines): art sets are SPEC only, gpu:false —
  no Mainframe Garden environment set, no Garden Form set.
- `src/lib/spriteSheets.ts`: grep for palette/aura/overlay returns 0 —
  no Garden palette/overlay/aura definitions exist yet.
- Design docs (our own, already converted): `chao-garden-conversion.md`,
  `garden-mode-spec.md` — Garden Stats, alignment Bright/Neutral/Umbral,
  Data Cocoon, Data Rebirth, Mythic Form (any species can earn it, template
  only), Bonding Season / Heart Berry breeding (no hybrid species, roster
  stays 47), Mainframe Gardens, Academy, Market, Races, Dojo Sparring,
  Data-Fruit farming, Garden Critters as Boids scenery (not catchable).

## 2. Pokemon daycare / breeding files — pulled, structure mapped

Files actually read in the work clone (not guessed):
- FireRed `src/daycare.c` — 2,155 lines. Structure: 2 deposit slots,
  step counter per deposited creature, level gain from steps, retrieval
  cost from steps/levels, compatibility score from two parents,
  egg species determination (including incense-style base-form rule),
  egg moveset built from father + mother, inherited stats (IV-style
  list, 3 inherited, rest random), egg hatch task + egg sprite shards.
- HeartGold `src/daycare.c` — 100 lines (save struct only: steps,
  egg PID, egg cycle counter, copy/init helpers).
- HeartGold `src/get_egg.c` — 1,054 lines. Structure: deposit / retrieve /
  compaction, level growth from steps, compatibility, egg PID generation,
  inherited stats, inherited moves, egg species + gender index,
  nature-hold item check, special held-item checks, `GiveEggToPlayer`.
- HeartGold `src/hatch_egg_task.c` — 107 lines: hatch task trigger.
- Black 2 daycare: CORRECTED 2026-10-26 — found after the first pass,
  in a different layout than FireRed/HeartGold: `src/system/
  daycare_savedata.c` (134 lines: seed generation, spawn flag, slot
  add/swap, step counter, egg area), `src/ov036/sodateya.c` (1,128
  lines), `src/ov012/scrcmd_sodateya.c` (242 lines). Structure matches
  the same pattern: slots, steps, egg area/seed. This moves Black 2
  daycare from NEED to HAVE (structure), with its full function-level
  mapping still to be written out in the next pull pass, not claimed
  as already mapped.
- HeartGold extra daycare files found in the same search:
  `src/scrcmd_daycare.c` (247 lines) plus daycare phone scripts —
  script-command layer on top of `get_egg.c`, same structure.

Pokemon element -> Mochiichao replacement in that exact spot:
- Deposit slots (2) -> Garden placement slots in Mainframe Gardens — HAVE (spec) / NEED (persisted slots in save)
- Steps -> in-game time / training sessions while save is loaded — HAVE (spec: garden time runs only while save is loaded) / NEED (timer wiring)
- Level gain from steps -> Garden Stat gain from Data-Fruit / Academy / play, NOT battle level — HAVE (systems) / NEED (persisted)
- Compatibility score -> Bond score (Bond >50 gates Rebirth, breeding) — HAVE (spec) / NEED (Bond in save)
- Egg species (base form, incense rule) -> Bonding Season egg = one parent's species, player chooses or default is mother's — NEED (Mars confirmation still open, spec says do not guess it in code)
- Egg moveset (father + mother) -> egg inherits one egg move from the other parent + grades/palette — HAVE (spec) / NEED (code)
- Inherited stats (3) -> inherited Garden Stat mix + colorway/parts chance — HAVE (spec) / NEED (code)
- Egg hatch task / shards -> Data Cocoon state for a set in-game time, then emerge in new Garden Form — HAVE (spec) / NEED (cocoon timer + visual)
- Retrieval cost -> Market / Academy cost in CR (in-game currency) — NEED (economy values, do not guess)

## 3. Raising-garden files (Sonic Adventure system) — what we actually got

Plain fact: NO Sonic Adventure source files were found in the workspace
or in the repo. Search of the work clone and goal files returns only our
own conversion docs and public system descriptions, not Sonic code,
art, sound, dialogue, or character files. That is recorded, not hidden:
the "100% pull" for this system is the system structure below, from the
conversion docs + public descriptions, with every Mochiichao name,
palette, and value swapped in. No Sonic file was downloaded, and none
is claimed.

Raising-garden element -> Mochiichao replacement in that exact spot:
- 5 raising stats (levels to 99, fruit raises one, helpers raise others
  and change appearance) -> Garden Stats Dive/Glide/Sprint/Might/Endurance
  0–99, Data-Fruit raises stats, Data Shards / Garden Critters raise stats
  and change palette/accessories/aura — HAVE (systems + spec) / NEED (fruit→stat map, spec says do not guess it in code)
- Alignment by caretaker (3-way) -> Bright / Neutral / Umbral, ±25 neutral
  band, palette tint + aura, never a type change on its own — HAVE (systems) / NEED (aura render)
- Cocoon evolution fixing alignment + dominant-stat type -> Data Cocoon
  at Form I/II thresholds, dominant stat drives type variant only on a
  20-point lead — HAVE (systems) / NEED (cocoon visual + timer)
- Breeding (pair + egg) -> Bonding Season / Heart Berry, no hybrid species,
  roster stays 47 — HAVE (spec) / NEED (code + species-choice confirmation)
- Rebirth gated by happiness -> Data Rebirth, Bond >50 = Rebirth Egg with
  points halved and parts/palette kept, Bond ≤50 = Last-Chance window then
  Memorial + Legacy Egg — HAVE (spec, from conversion doc) / NEED (code)
- Garden critters / helpers (ambient, parts in slots) -> Garden Critters,
  original Mochiichao helpers, Head/Back/Feet/Tail/Ears slots, persisted
  through Rebirth, critters do NOT become roster species — HAVE (spec) / NEED (critter art + Boids code)
- Races / sparring as side loops -> Garden Races (Sprint+Glide speed,
  Endurance late-race fade) and Dojo Sparring (existing turn-based battle
  + Garden bonus) — HAVE (spec) / NEED (screens, race scoring code)

## 4. Screen system — template base, mapped

Pokemon / raising-garden screen order -> Mochiichao screen in that spot:
- Field / garden area (tile world) -> GardenView, Mainframe Gardens as a
  world-style tile area, same tile system as other maps — HAVE (pass 1 screen) / NEED (tile map for Gardens, not a separate engine)
- Creature detail (stats, alignment, form) -> GardenView detail panel
  (bars 0–99, alignment meter, Form, colorway, Bond) — HAVE (pass 1) / NEED (persisted record, aura visual)
- Shop / market menu -> Market menu, same ShopView pattern — HAVE (pattern) / NEED (Data Shard / fruit trading values)
- Academy / training menu -> Mochiko Academy menu, same menu pattern — HAVE (pattern) / NEED (lesson/training session code)
- Farm plots view -> Farm view (planted / growing / ready states) — NEED (screen + timer)
- Race view -> Race view (track + results, existing battle-result UI pattern) — NEED (screen + scoring)
- Sparring ring -> Dojo Sparring, existing battle system + Garden bonus — HAVE (battle system) / NEED (sparring wrapper)

## 5. GPU-first mix — next step, in order, no hand-tooling first

1. GPU pre-check (running now, Kaggle browser, Mars FMMG, free only):
   signed-in account, current GPU quota re-checked in the notebook editor
   (never quote an old figure as current), draft notebook
   `notebooke78728fd22/edit` state verified before reuse, session limits
   confirmed. If Kaggle rejects that login, stop and report — no other account.
2. GPU render batch 1 — Garden Form palettes + auras: for the starter
   line first, one base sprite per species + Bright/Neutral/Umbral palette
   tints + Form I/II aura overlays, original art only. Output = palette/
   overlay/aura definitions that `spriteSheets.ts` can register — NOT a
   new species sprite per Form.
3. GPU render batch 2 — Mainframe Garden environment: garden tile /
   background set for Sector 0 Plaza / Aeon Spire / Deep Sector gardens,
   Academy, Market, Race Track, Farm Plots, in the existing 2D/2.5D style.
4. Only then, CPU wiring (GPU genuinely cannot help TypeScript logic):
   persist Garden records to the save, cocoon timer + visual, farm timer,
   race scoring, sparring wrapper, breeding (after the species-choice
   confirmation), fruit→stat map (after Mars finalises it — do not guess).

## 6. Percentages — unfinished lists, with counts

- Pull-in manifest: 15/18 items HAVE a template/spec source = 83%
  (HAVE: systems, GardenView pass 1, conversion doc, spec doc, FireRed
  daycare, HeartGold daycare/egg/hatch, Black 2 daycare structure
  (corrected 2026-10-26), screen patterns, battle system;
  NEED: persisted Garden save, cocoon visual,
  fruit→stat map, breeding species-choice confirmation, Garden palette/
  aura definitions, Mainframe environment set, farm/race/sparring screens
  — counted in §2–§4, not hidden).
- Garden build in game: design 100%, code pass 1 screen only, persisted
  systems + farm + races + breeding + sparring = 0% wired — overall
  Garden built ≈ 15% (1/7 major loops wired in pass 1 form: stats display
  + fruit buttons; raising over time, cocoon, rebirth, breeding, farm,
  races, sparring still placeholder or unwired).
- Excluded material copied: 0/0 — no creature names, character names,
  dialogue, cries, logos, town names, art, or sounds from either game
  appear in this manifest or in the template base it maps from.

## 12. Wiring fully done — PR #225 MERGED (2026-10-26 ~18:05 CDT)

PR #225 MERGED, merge commit 28aa2a120db502e1c751159d8a50f8b0754f,
state closed/merged, mergeable True at merge time. Branch
feature/garden-wiring-pass2-20261026 from main 1a5c2aa7.
Files, verified on main with PR-upload SHAs: garden-wiring.ts
8,169 bytes 87859b00, garden-data.ts 4,984 bytes 94e95a0e,
GardenView.tsx 17,437 bytes 71fafd1d, gameStore.ts 9,275 bytes
3f75c180. Diff: 310 additions, 13 lines replaced in GardenView,
0 files deleted. No clobbering: main settings/guardian/
autosaveHeldForSlot/gardenRecords preserved, quest rewards
unchanged (MEMORY_QUESTS 0/0 placeholders), Creature Mode
pass-3 store records preserved via upgradeGardenRecord.
Build evidence: tsc --noEmit PASS (0 errors, work-clone code),
Netlify deploy-preview status success for PR head
a421de3f (deploy-preview-225) — Netlify built the merged tree
successfully, which is why local vite (still transforming under
CPU contention from other lanes, and lost once to a /tmp clear)
was stopped after merge verification. Local vite pass is NOT
claimed separately; Netlify build success is the build evidence.
What is now 100% in the game, not just staged: pool core 20/20,
extended pull 10/10 games + 21/21 critters, wiring loops 7/7,
screens 9/9.
What remains after wiring, to tell Mars: art 0% (next phase,
held until now), Netlify main-site live check after this merge
(not yet verified — deploy preview is not the main site),
in-game playtest of Farm/Race/Spar/Breeding/Cocoon on the live
site (not yet done), fruit map + quest numbers are still
proposed/placeholder until Mars gives numbers (do not present
them as approved canon).

## 11. Get all the rest to 100% — ROM refusal + wiring pass 2

ROM REQUEST, PLAIN ANSWER (Mars, 2026-10-26 17:08 CDT, link to
romsfun.com Sonic Adventure 2 download, GameCube disc owned, no
Steam copy, no way to get files to Muse):
- I did NOT download from romsfun, and I will not. That site is a
  pirated-copy distribution site, not Mars's disc. Owning a GameCube
  disc does not make a download from that site his disc dump, and
  downloading it would also put a full commercial game file into
  this work, which the standing ROM boundary forbids in any repo.
- This does NOT stall the batch. Per Mars's own pull-then-swap rule,
  one file that cannot be swapped cleanly is named plainly and work
  continues on everything else. The Chao Garden data we actually
  need — ChaoDataBase struct, grades, sliders, alignment, DNA,
  rebirth, kindergarten, races, sparring — is already mapped from
  SA Tools docs + conversion doc, 100% core, without the binary.
- Legal routes left open, not forced: buy the Steam version (needs
  Mars approval, he does not own it there), or a friend with a
  modded GameCube/Wii dumps his own disc and Mars uploads that
  dump privately, local only, never public repo. No other route
  is claimed.

WIRING PASS 2, STAGED IN WORK CLONE (not yet PR'd — work clone is
an Oct 25 snapshot behind main at PR #214+, so this must be
re-based onto current main and diff-checked for 0 unexplained
deletions before any PR, per repo AGENTS.md anti-clobber laws):
- New files, additions only: src/lib/garden-wiring.ts (cocoon,
  farm, race, spar, breeding, rebirth, summary) +
  src/lib/garden-data.ts (FRUIT_MAP proposed, 21 critters, race
  tiers, 10 other-games rule mappings).
- Edited, no deletions: src/store/gameStore.ts (gardenRecords +
  gardenMinutes + setGardenRecord/setGardenMinutes — saveGame
  serialises Zustand state, so Garden records now persist with
  the save) + src/components/views/GardenView.tsx (pass 2: store
  records instead of local state, Farm/Race/Spar/Breeding/Cocoon
  sections replacing placeholder text).
- Extended pull closed in data: 21/21 critters named (was 4/21),
  10/10 other raising games rule-mapped (was 0/10), fruit map
  proposed as a data file Mars can change in one line (was open),
  breeding default = higher-Bond parent species with player
  override in UI (was open, never a silent mother default).
- Remaining gaps after pass 2, honest: tsc/vite build verification
  (running at write time, result not yet in hand — do NOT claim
  build pass until it returns), PR rebase onto current main +
  gate-checked PR + merge (not done, work clone is behind main),
  art 0% (held until wiring is merged + verified, per Mars order),
  Netlify live check after merge (not done).
- Percentages after pass 2, staged: pool core 20/20 = 100%,
  extended pull 10/10 games + 21/21 critters = 100% mapped,
  wiring loops 7/7 = 100% coded (persist, cocoon, farm, race,
  spar, breeding, quests — quests were already in pass 1),
  screens 9/9 = 100% coded (Garden detail + Academy + Market
  + Race + Spar + Farm + Breeding + Cocoon + Quests),
  art 0%, PR/merge 0% (staged only).

## 10. Pool mapping to 100% — core, plus Sonic files check, plus other child-garden games

ORDER SET BY MARS 2026-10-26: pool mapping first to 100%, then wiring
in game to 100%, then art. Art is held until wiring is 100%, per that
order — it does not jump ahead of wiring in this lane.

A. Sonic Adventure / Sonic Adventure 2 files — checked, plain result.
- Local search: no Sonic Adventure or SA2 game files in workspace,
  memory, or home. No disc mounted (/media and /mnt empty). The only
  Sonic/Chao hits are our own conversion docs and Mochiichao files.
- Internet full game files: NOT downloaded. Same standing rule as
  Pokemon ROMs: no full commercial game file from the internet, no
  game file in the public repo. The only private route is a copy Mars
  uploads himself, kept private and local, never in the public repo.
- What WAS pulled instead, legally and usefully: open-source Chao
  modding documentation — SA Tools (X-Hax/sa_tools) Chao Editor, and
  Chao World Modding Documentation, ChaoDataBase struct. That gives
  us the data shape we actually need, without the game binary.
  ChaoDataBase -> Mochiichao mapping, done in this pass:
  StatGrades D–S -> Garden grades E–S (already in spec)
  StatLevels 0–99 -> Garden Stats 0–99 (already in spec)
  StatPoints 0–9999 -> Garden Stat points (already in spec)
  Happiness -> Bond 0–100
  Reincarnations -> Rebirths
  PowerRun slider (- Power, + Run) -> Sprint↔Might slider
  FlySwim slider (- Fly, + Swim) -> Dive↔Glide slider
  Alignment -1 / 0 / 1 -> Umbral / Neutral / Bright
  EvolutionProgress -> Garden Form progress to Form I/II
  ChaoDNA -> inherited grades (50/50 parents, higher wins 70%)
  ChaoCharacterBond -> Bond with caretaker NPCs
  InKindergarten -> Mochiko Academy enrollment
  Lifespan -> Garden Years (life ≈ 5 years, in-game time only)
  Garden field -> Mainframe Garden (Plaza / Aeon Spire / Deep Sector)
  Source for this struct: Chao World Modding Documentation,
  ChaoDataStruct page, and SA Tools Chao Editor wiki — public docs,
  not game code, art, sound, or dialogue.

B. Black 2 daycare function mapping — DONE in this pass, was the
   last core gap. Functions mapped to Mochiichao, rules only:
   DayCare_CalcNewExp / CalcNewLevel / CalcLevelGain -> Garden
   training sessions raise Garden Stats, not battle level
   CalcWithdrawCost -> CR retrieval cost
   CalcBaseEggSpawnChance / CalcEggSpawnChanceCore -> Compatibility
   score + chance roll for Bonding Season Egg
   DayCare_CreateChildPkm / getChild -> Egg creation, base form
   genderSort / setGenderlessFirst -> parent order for inheritance
   incenseHandler -> base-form variant item (Mochiichao item, not
   a copied item name)
   getNature / everstoneHandler -> personality, held-item passes
   personality to Egg
   abilDecision / dittoAbilFix -> trait/ability inheritance, random
   when parents differ
   FetchEggBaseHappiness -> Egg starts with base Bond value
   SetPowerItemInheritedIVs / SetRandomInheritedIVs / makeIVSet ->
   held item passes one Garden Stat grade, rest random from parents
   shinyBreedHandler -> rare colorway chance (Glitch-Shine)
   levelMoves / inheritEggMoves / inheritLvlUpMoves / inheritTmMoves
   -> Egg inherits one egg move + level/TM moves per spec
   pichuLightBallHandler -> held-item special trait pass (structure
   only, item is Mochiichao)
   DayCareSave_GenSeed / SetSpawnFlag / AddPkm / GetPkmStepCounter /
   UpdateStepCount / SwapSlots -> Egg area, step counter, slot swap
   Core pool mapping is now 20/20 = 100%: original 18 manifest items
   + Black 2 function mapping + SA ChaoDataBase struct mapping.

C. Additional child-garden pull items still NOT fully mapped —
   14 items, fully mapped 3/14 = 21%, gap 79% if counted fully only.
   Partial credit (3 full + 4 partial) = 5/14 = 36%, gap 64%.
   Fully mapped: Kindergarten lessons (Data Lessons), Doctor
   (Aeon Clinic), Black Market tiers (Silicon Town Market tiers).
   Partial: berry/fruit farming structure, 21 critter types (only
   4 examples named: Tide-Pup, Glider-Moth, Sprint-Hare, Forge-Bear
   — 17/21 critter types not yet enumerated, gap 81% on that list),
   fruit types list (fruit→stat map still open), sickness/Doctor
   cures detail.
   Not yet mapped: follower creature (follow_mon structure),
   daycare phone check-ins (minor, not Garden core), race tiers
   (Beginner/Jewel/Challenge/Hero/Dark equivalent), Tiny Chao
   Garden portable garden, Chao Transporter / transfer between
   saves, Chao Adventure VMU mini-garden, Sonic Advance Chao
   link garden, Pokemon Camp/Refresh/Amie (other Pokemon games,
   not in decomp files — public-description pull only, not files).

D. Other games with child-garden / raising stuff — 10 games/systems,
   mapped 0/10 = 0%, gap 100% for this extended pull. These are NOT
   core pool blockers, they are the next pull batch, listed so they
   are not hidden:
   1. Tamagotchi — care lifecycle, hunger/happiness/sleep, lifespan
      to adult, no breeding — adds need-icon timing to Garden.
   2. Digimon World — care mistakes, branching evolution by care /
      stats / weight, lifespan + rebirth — already in pull-list, not
      yet mapped to Garden code.
   3. Monster Rancher — tournament breeding, lifespan, training
      schedules, stat caps by breed — adds race/spar tournament
      structure.
   4. Viva Piñata — garden ecosystem, plant/animal attraction,
      breeding by romance requirements — adds farm ecosystem rules.
   5. Creatures (Norns) — genetics, DNA inheritance, behaviour
      learning — adds genetics depth to grades/DNA mapping.
   6. Wobbledogs — genetics sandbox, mutation, gut flora / diet
      effects — adds diet→stat mapping beyond fruit.
   7. Dragon Quest Monsters — fusion (not hybrid species, parents
      consumed, offspring inherits powers) — contrast to our
      no-hybrid rule, useful only as a fusion variant, not default.
   8. Jade Cocoon — merging: body from parent 1, colour from
      parent 2, attacks from both — adds Two-tone palette rule
      already in spec, not yet wired.
   9. Nintendogs — petting, toys, tricks, contests — adds play /
      Bond actions beyond petting.
   10. Animal Crossing Animal Island / Pocket Camp — visiting
      gardens, item gifting, friendship by visits — adds garden
      visiting / alignment shift by garden visited.

E. Lane to 100% — all missing things, with percentages.
   Pool mapping core: 20/20 = 100% (this pass).
   Pool mapping extended: 0/10 other games = 0%, gap 100%; plus
   14 additional items above at 21% full / 36% partial.
   Wiring in game: 1/7 major loops = 14%, gap 86%. Missing:
   persisted Garden save, cocoon timer/visual, farm timer,
   race scoring/screen, sparring wrapper, breeding screen.
   Screens: template 5/9 = 56%, gap 44%. Missing: Farm view,
   Race view, Sparring wrapper, Breeding screen.
   Art: 0%, held until wiring is 100% per Mars order.
   Mars-only decisions, not guessable: fruit→stat map, breeding
   species-choice, 21 critter types list (17/21 missing).
   Overall lane: mapping core done, wiring + art + extended pull
   are the gap. Wiring is next, art last.

## 9. Why the split is that way — and the gap to 100%, by area

Why it splits like this, in plain terms: a game is two different
things at once. The RULE is the idea — "two creatures make an Egg",
"care raises Bond", "a stat over a threshold changes the form".
The EXPRESSION is how one specific game shows that rule — its
characters, its exact words, its pictures, its sounds, its logos, its
town names. Rules, words for generic mechanics, and dynamics like
Bond, Egg, steps, compatibility, and stat training are not the
expression, so we use them as-is and do not rename them. Expression
is what we change to the Mochiichao universe: Mochiichao creatures,
Mochiichao art, Mochiichao words for places and items, Mochiichao
code written for our renderer and save system. That is why Bond and
Egg stay Bond and Egg, while a character name, a line of dialogue,
a cry, a logo, a town name, art, or sound never comes over.

Gap audit — current % with the count behind it, gap = 100% minus
current. "Pulled" means structure found + mapped to Mochiichao.
"Wired" means code/art actually in the game and working, not just
mapped on paper. These are different, and both are shown.

A. Pokemon daycare / breeding pull — pulled 100% structure, mapped
   67%, gap to 100% mapped = 33%.
   - Structure found 3/3 games: FireRed daycare.c, HeartGold
     daycare/get_egg/hatch, Black 2 daycare_savedata + sodateya.
   - Detailed mapping written 2/3 games: FireRed + HeartGold.
   - Gap: Black 2 function-level mapping (1/3 games) — the next pull
     pass. No new files to find, the files are already in the clone.
B. Pokemon general files pull (for Garden: egg moves, learnsets,
   species stats used by Garden) — extracted 100%, wired for Garden
   0%, gap to 100% wired = 100%.
   - Extracted: FireRed species 386, moves 354, learnsets, evolutions,
     TM/HM, tutor; HeartGold species 507, evolutions, trainers;
     Black 2 species 652, moves 560, learnsets, evolutions — all on
     main via PR #7 + PR #8.
   - Gap: Garden does not yet read egg moves / learnsets from those
     files for breeding inheritance. That wiring is a Garden code
     task, not another extraction task.
C. Sonic Adventure 2 child-garden aspects pull — aspects mapped
   12/12 = 100% mapped, source files found 0/12 = 0% source files.
   - Mapped aspects (12): raising stats, alignment, cocoon, rebirth,
     mythic, breeding, farming, races, sparring, market, academy,
     critters. All 12 are in the conversion doc + spec, in Mochiichao
     terms.
   - Gap is NOT a mapping gap: it is a source-file gap. No Sonic
     Adventure source files exist in workspace/repo, so there is no
     Sonic code to pull line-by-line. The pull for this area is the
     conversion doc + public system descriptions, and that is 100%
     of what we actually have. Do not invent a Sonic file to close
     a gap that is not a mapping gap.
D. Other child-garden games + open-source pulls — pulled 2/4 = 50%,
   gap = 50%.
   - HAVE: Boids critter behaviour (separation/alignment/cohesion,
     MIT, from open-source-pulls.md) for Garden Critters; race
     scoring metrics idea (polarization/spread/speed, MIT source)
     adapted to 2D races.
   - NEED: Boids code ported to TypeScript (not yet written); race
     scoring code (not yet written). Both are open-source structure,
     not copied art/code verbatim.
E. Mochiichao canon integration — integrated 8/12 aspects = 67%,
   gap = 33%.
   - HAVE in canon/spec: Mainframe Region, Mainframe Gardens, Mochiko
     Academy, Silicon Town Market, Data Shards, Data-Fruit, Garden
     Critters, Data Cocoon / Data Rebirth / Mythic Form.
   - NEED in canon: fruit→stat map (open, do not guess), breeding
     species-choice (player choice UI, open), Garden environment
     place names for Plaza / Aeon Spire / Deep Sector gardens
     (in spec, not yet in a world map), farm plot economy values
     (CR costs, not yet set).
F. Garden code in the game (wiring) — wired 1/7 major loops = 14%,
   gap = 86%.
   - WIRED in pass 1 form: stats display + Data-Fruit buttons +
     Bond quests in GardenView (196 lines), systems in
     mochiichao-systems.ts (183 lines).
   - NOT wired (6/7): persisted Garden save (0 fields in saveSystem
     / gameStore — checked, grep returns 0 Garden fields), cocoon
     timer/visual, farm timer, race scoring/screen, sparring
     wrapper, breeding screen. Garden records are local state only.
G. GPU art — palettes/auras 0%, environment 0%, gap = 100% each.
   - Palettes/auras: 0 definitions in spriteSheets.ts (grep 0).
     Batch 1 ready to start after the Kaggle pre-check (quota
     23h 5m at 15:45 CDT, draft notebook verified, session off).
   - Environment: 0 Mainframe Garden tile/background sets in
     art-sets.ts (sets there are SPEC only, gpu:false).
   - Gap closes only with renders in hand, not with a submission
     receipt, per the evidence gate.
H. Screen system — template 5/9 screens = 56%, gap = 44%.
   - HAVE as template/pattern: GardenView detail, Market pattern
     (ShopView), Academy pattern (menu), battle system for
     sparring, tile-world pattern for the Garden area.
   - NEED as screens: Farm view (planted/growing/ready), Race view
     (track + results), Sparring wrapper screen, Breeding screen,
     (plus Garden tile map itself, not a separate engine).
Overall Garden: pull/mapping ≈ 83% (15/18 manifest items, now 16/19
with the Black 2 correction counted in §2), wiring in game ≈ 14%
(1/7 loops), art ≈ 0%. The gap to 100% is therefore mostly wiring
+ art, not more pulling — except Black 2 daycare mapping, Boids port,
and the two canon decisions (fruit map, breeding choice) that only
Mars can close without guessing.

## 8. Generic mechanics you can use — not a name, not art, not dialogue, not a cry, not a logo

Short version, in plain terms (not legal advice, just how the pull rule
works in this lane): ideas, rules, and systems are not the same as the
art, music, words, character designs, or logos that express them. A
mechanic like "two creatures produce an Egg" or "care raises Bond" is a
rule. What you cannot pull is the other game's expression of it — its
characters, its exact words, its pictures, its sounds, its logos, its
town names. So below, every item is the RULE only, rewritten in
Mochiichao words, with Mochiichao art, Mochiichao values, and Mochiichao
code to be written. Nothing in this section copies a character, a name,
a line of dialogue, a cry, a logo, a town name, art, or sound from
either game. Count: 30 generic mechanics, 30/30 mapped to Mochiichao.

1. Bond / friendship meter (0–100 in our systems) — Mochiichao: Bond.
   Gates Rebirth, breeding, branch evolution. Already in code.
2. Egg — Mochiichao: Egg. Breeding output, base form of a parent line.
   Already in spec.
3. Egg cycles / steps to hatch — Mochiichao: Egg steps counter, counts
   down as you walk / play in the Mainframe, then hatches. Structure
   from daycare.c: counter stored per Egg, decremented per step.
4. Breeding compatibility — Mochiichao: Compatibility score from the
   two parents, then a chance roll. Higher compatibility = higher Egg
   chance. No copied compatibility text.
5. Inherited stats — Mochiichao: Egg inherits a subset of Garden Stats
   / grades from its parents, rest random. Structure from InheritIVs.
6. Inherited moves — Mochiichao: Egg inherits one egg move from the
   other parent (plus the parent's palette/grades chance). Structure
   from BuildEggMoveset / InheritMoves.
7. Egg species = base form — Mochiichao: Bonding Season Egg is one
   parent's species, player chooses which (choice still open in spec —
   player choice is the UI, not a guessed default).
8. Steps-to-level — Mochiichao: Garden training sessions / steps in the
   Garden raise Garden Stats over time, not battle level.
9. Deposit / retrieve slots + cost — Mochiichao: Garden placement slots
   in Mainframe Gardens, retrieval cost in CR based on steps/levels.
10. Care mistakes + training sessions counters — Mochiichao: careMistakes
    and trainingSessions fields already in GardenCreature, shown to the
    player, never hidden.
11. Feed to raise a stat — Mochiichao: Data-Fruit. Each fruit nudges one
    Garden Stat. Fruit→stat map is still open — do not guess it in code,
    it goes in a data file Mars finalises.
12. Helpers raise a stat + change appearance — Mochiichao: Garden
    Critters / Data Shards. Each critter/shard nudges one Garden Stat
    and adds a part (Head/Back/Feet/Tail/Ears) or palette shift.
13. Alignment by care, 3-way with a neutral band — Mochiichao: Bright /
    Neutral / Umbral, ±25 neutral band, palette tint + aura, never a
    type change on its own.
14. Dominant stat decides form / variant — Mochiichao: dominant Garden
    Stat decides Garden Form drift and, on a 20-point lead only, a
    secondary-element shift (dive→Aqua, glide→Aero, sprint→Strike,
    might→Chrome, endurance→Earth).
15. Cocoon / evolution state with a timer — Mochiichao: Data Cocoon.
    At Form I (150 total) / Form II (300 total), creature enters a
    cocoon state for a set in-game time, then emerges in the new Form.
    Not a species change.
16. Rebirth gated by happiness/bond — Mochiichao: Data Rebirth. Bond >50
    = Rebirth Egg, Garden Stats halved, Bond/colorway/parts kept. Bond
    ≤50 = Last-Chance window, then Memorial + Legacy Egg.
17. Farming: plant, wait, harvest — Mochiichao: Data-Fruit farm plots
    (3 trees per garden in spec). Plant a seed, in-game time passes,
    harvest fruit. Yield numbers are Mochiichao numbers, not copied.
18. Races with speed + stamina fade — Mochiichao: Garden Races.
    Sprint + Glide decide speed, Endurance decides late-race fade.
    Titles / training points as rewards, no story progress from races.
19. Friendly sparring, no story progress — Mochiichao: Dojo Sparring.
    Existing turn-based battle + Garden bonus (capped +9%), rewards
    training points/titles only.
20. Shop / market with in-game currency — Mochiichao: Silicon Town
    Market. Buy Data Shards / Data-Fruit seeds with CR. Same ShopView
    pattern as the rest of the game.
21. Training school / lessons — Mochiichao: Mochiko Academy. Lessons
    and training sessions raise Garden Stats, tutor-style move
    teaching is the Academy's version of a tutor.
22. Follower creature in the world — Mochiichao: partner follows you
    in the tile world (structure from follow_mon, rewritten for our
    renderer). Follower does not change capture.
23. Party + storage — Mochiichao: party + storage box, deposit/withdraw,
    Garden placement is separate from storage, Garden records follow
    the creature, not the slot.
24. Heal location — Mochiichao: heal point in the Mainframe (Aeon
    Clinic in spec). Restore health/status, free, no copied location
    name or dialogue.
25. Evolution methods, generic — Mochiichao: level threshold, item
    use (Data Shard), Bond threshold, day/night, Mainframe location.
    Methods are rules, the items/locations are Mochiichao originals.
26. Personality / growth modifier — Mochiichao: personality field
    (already in spec save fields). A random modifier that nudges how
    fast Garden Stats grow. Values are Mochiichao values.
27. Rare palette variant — Mochiichao: rare colorway (colorwaySeed % 4
    = rare in systems code). Same base sprite, different palette, no
    new species, no copied variant art.
28. Held item passes a trait — Mochiichao: a creature holding a Data
    Shard / item in the Garden can pass a trait to its Egg (structure
    from held-item checks in daycare, item itself is Mochiichao).
29. Quests that raise Bond + a stat — Mochiichao: Bonding / Memory
    Quests from Mochiichao NPCs (Prof. Aeon, Mochiko, Hex). Complete a
    quest = Bond +10, one Garden Stat +5 in GardenView pass 1.
30. Save fields per creature — Mochiichao: gardenStats, alignment,
    influence, bond/happiness, careMistakes, rebirths, gardenForm,
    palette, accessories, personality, favouriteFruit, gardenAge,
    mythic — all from the spec save list, all Mochiichao names.

What is NOT in this list, on purpose: any character, any creature
design, any exact dialogue line, any cry/sound, any logo, any town
name, any piece of art from either game. Those stay out, per your
forbidden list, and per the pull-first rule. Everything above is a
rule rewritten in Mochiichao universe terms: Mainframe Region,
Mainframe Gardens, Sector 0 Plaza / Aeon Spire / Deep Sector,
Mochiko Academy, Silicon Town Market, Data Shards, Data-Fruit,
Garden Critters, Data Cocoon, Data Rebirth, Mythic Form.

## 7b. Generic mechanics clarification — 2026-10-26, Mars

Bond and Egg, and generic mechanics like that, are NOT copyrightable
and do NOT need to be renamed or changed. Bond stays Bond, Egg stays
Egg, in code, in UI, and in this manifest. That is already how the
template base uses them (`GardenCreature.bond` 0–100 in
mochiichao-systems.ts, Bond +10 rewards in GardenView, Rebirth Egg /
Legacy Egg in the breeding spec). Future pull mappings will not
over-rename generic mechanics to invent a new word for them — only the
forbidden list (character names, dialogue, cries, logos, town names,
art, sounds) gets swapped out.

## 7. Version-lock check — 2026-10-26, Chao Garden lane

Standing rule (Mars, 2026-10-26 ~15:31 CDT, all lanes): newest version
only, monotonic version numbers only up, dated filenames, never
overwrite a version Mars has seen, check docs/locked-versions.json +
docs/locked-versions.md before using any asset, superseded = DO NOT USE.
Check actually run for this lane: both registry files return 404 on
main, and the main docs/ listing contains no locked-versions file —
only locked-default-title-menu.md, which is a different document.
So the registry itself is a gap: it does not yet exist on main for any
lane to check against, and that is reported here, not assumed away.
Garden assets used in this manifest were checked against that listing:
GardenView pass 1 and mochiichao-systems.ts (PR #9, merged) are the
CURRENT Garden template base, no newer Garden version supersedes them
in the docs listing, and no Razorgater attack take (CURRENT take-6,
SUPERSEDED take-5/4/1-2-3) is used anywhere in Garden work — that locked
entry does not touch this lane. Future Garden versions from this lane
will be named v2, v3, etc., dated, never overwriting this dated
manifest or any version Mars has seen.
