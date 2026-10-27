# Mod-community / open-source / fan-reference inventory — real files only

Date: 2026-10-26. Worker 6/6. Verified on disk by file listing and counts.
Scope: `~/workspace/mochiichao-work/fan-reference/`, `~/workspace/mochiichao-work/gen5plus/`
(including `pokeapi-src`), the repo/workspace inventory docs, and vendored `tools/` in the
fresh-start work clone. Nothing in this file copies fan art, audio, dialogue, or
swap-bucket strings — it is an inventory of paths, counts, systems, and licences only.

Proprietary rule applied (Mars 2026-10-26 20:39, supersedes earlier town/cry flagging):
swap out ONLY species/characters, species names, images, logos, and actual literal dialogue
(cries in the swap bucket). Literally everything else is usable at 100%: code, move names /
moves, systems, structure, values. Licence caveat is separate from that rule and is stated
per source below: where no licence file was found, the system/structure is usable as a
re-implementation reference, not as verbatim code to vendor, until a licence is confirmed.

Counting rule: `.git` internals are excluded from every count below. Duplicate clones are
counted as 0 new sources (see §5). All counts below are non-`.git` files actually present.

## 1. Fan-reference projects — 6/6 inventoried = 100%

Total fan-reference files (non-`.git`): 936 = 934 project files + 2 top-level notes.
Breakdown of the 934: code 84, images 803, docs/data 32, other 15.
Top-level notes (2 files, not project files): `LICENCES-NOTES.md`, `MECHANICS-EXTRACT.md`
(mechanics notes only, local study, nothing shipped from them).

### 1.1 BerserkLove_PokemonColosseum — 792 files
- Path: `~/workspace/mochiichao-work/fan-reference/BerserkLove_PokemonColosseum/`
- Code 34: 30 `.js` files (8,678 lines total incl. the single `.html` shell) + 2 `.css` +
  1 `.html` + 1 `.mjs` smoke tool. Systems covered: battle simulation (`03_battle_sim.js`),
  game flow (`02_game.js`), league (`03_league.js`), quests (`05_quests.js`), results
  (`06_results.js`), collection (`07_collection.js`), trainer panel (`07_trainer_panel.js`),
  economy (`08_economy.js`), item use (`09_item_use.js`), starter flow
  (`10_starter_flow.js`), validation (`11_validation.js`), UI/render/components/modals.
- Data 1: `data/evolution_mapping.json` (evolution structure; species keys are swap-bucket).
- Docs 4: `ARCHITECTURE.md`, `BUILD_INFO.md`, `TESTING.md`, `README.txt`.
- Images 752: `assets/` 681 (trainer portraits 404, custom-form art 106, gigantamax-style
  art 32, item art 34, other-form art 48, professor portraits 12, special-form art 36,
  shop art 8, plus 1 top-level artwork file) + `PokemonGymBadges/` badge art 71.
- Licence: NO licence file found in the tree (per `LICENCES-NOTES.md`).
- Verdict: code systems/structure = usable as re-implementation reference (not verbatim
  vendoring until licence confirmed); ALL 752 images + all name-bearing data files =
  REFERENCE-ONLY, never copied. This is the largest fan source and also the largest
  reference-only image set in this inventory.

### 1.2 Blynch17_poke-arena — 66 files
- Path: `~/workspace/mochiichao-work/fan-reference/Blynch17_poke-arena/`
- Code 19: 15 `.ts` + 1 `.html` + 3 `.py` tools. Systems: battle scene (`src/scenes/BattleScene.ts`),
  overworld/world scene (`src/scenes/WorldScene.ts`), select scene, boot scene, capture
  formula (`src/capture.ts`, documented as implementing a published Gen VIII capture
  formula), route, tiles, FX, settings, music/SFX stubs.
- Images 37: 36 creature sprites (front/back/walk sets) + 1 docs preview image.
- Docs/data 8: `README.md`, `docs/AGREGAR-POKEMON.md`, package/config JSON files, 2 `.txt`
  placeholders in `public/music/` and `public/sfx/` (LEEME-style notes, no audio files).
- Other 2: workflow config + ignore file.
- Licence: NO licence file found in the tree (per `LICENCES-NOTES.md`); README describes
  it as a personal, non-commercial project with sprites from a public sprite API.
- Verdict: battle/overworld/menu/capture systems = usable as re-implementation reference;
  all 37 images = REFERENCE-ONLY. Gap: audio directories contain placeholders only, 0 audio
  files present.

### 1.3 Freakyy-11_Arena-2D — 28 files
- Path: `~/workspace/mochiichao-work/fan-reference/Freakyy-11_Arena-2D/`
- Code 13: 11 `.js` + 1 `.html` + 1 `.css`. Systems: real-time arena game loop (`js/jeu.js`),
  attack shapes/effects (`js/attaques.js`, the largest file at ~2,001 lines per
  `MECHANICS-EXTRACT.md`), simulation, AI (`js/ia.js`), rendering, league, menu, audio
  driver, arena data, fighter data.
- Images 11: 7 arena background images + 4 app icons.
- Docs 2: `README.md`, `arenes/LISEZMOI.md`.
- Other 2: web manifest + ignore file.
- Licence: NO licence file found; README credits in-combat sprites to a third-party
  sprite collab under CC BY-NC 4.0 and menu portraits to a public sprite API, and
  describes the project as an unofficial, non-commercial fan project.
- Verdict: real-time arena mechanics (aim/release attacks, shape vocabulary, dash
  charges, knockback decay — as described in `MECHANICS-EXTRACT.md`) = usable as
  re-implementation reference; all 11 images = REFERENCE-ONLY. Gap: `js/audio.js` is
  code only — 0 audio asset files present in the tree.

### 1.4 hiro-s-2000_pokemon_arena_2d — 2 files
- Path: `~/workspace/mochiichao-work/fan-reference/hiro-s-2000_pokemon_arena_2d/`
- Files: `LICENSE` + `README.md` only. 0 code files, 0 asset files.
- Licence: Apache License 2.0 (file present; there is no code bulk for it to attach to).
- Verdict: REFERENCE-ONLY (title/README reference only). Usable systems from this
  source: 0/0 — nothing to extract. Gap: the arena project itself is not in the
  reachable tree.

### 1.5 lcheng871118-glitch_Empress-iOS — 41 files
- Path: `~/workspace/mochiichao-work/fan-reference/lcheng871118-glitch_Empress-iOS/`
- Code 16: 2 Swift sources + 1 bridging header (iOS porting shell / app entry) + 11 `.py`
  dictionary/fetch scripts + 1 `.cjs` bootstrap + 1 build script.
- Docs/data 14: 4 docs (README, BUILD, INSTALL, Chinese README) + 5 dictionary JSON files
  + 5 dictionary CSV files (ability/move/type/species name tables and flavour-text
  tables — name and flavour columns are swap-bucket content).
- Images 1: app icon only.
- Other 10: project/CI/plist/batch helper files.
- Licence: LICENCE file present but covers ONLY the porting shell (free to view/fork/
  build/install on personal devices; modifying the shell, making derivatives, or publicly
  distributing a modified version requires the author's prior written consent). The same
  file states the game itself is copyright its original author, franchise IP belongs to
  its rights holders, and the project is not affiliated/endorsed.
- Verdict: shell/build-script structure + dictionary-fetch script structure = usable as
  reference (shell derivatives need written consent per its licence); the game bundle
  itself is NOT in the tree, and all name/flavour CSV content = REFERENCE-ONLY.
  Gap: 0 game files present — this source cannot supply battle, menu, or overworld
  systems, only a porting shell and data-dictionary tooling.

### 1.6 sunsunyul2014-ai_pokemon-arena — 5 files
- Path: `~/workspace/mochiichao-work/fan-reference/sunsunyul2014-ai_pokemon-arena/`
- Code 2: `index.html` + `pokemon_arena.html` (browser arena pages; README lists
  fighters and controls).
- Images 2: walk-sprite images.
- Docs 1: `README.md`.
- Licence: NO licence file found in the tree.
- Verdict: arena page structure = usable as re-implementation reference only;
  both images = REFERENCE-ONLY. Smallest usable fan source.

## 2. Gen 5+ substitute set — gen5plus — 7 files + pokeapi-src 212 files

### 2.1 gen5plus extracted outputs — 7 files
- Path: `~/workspace/mochiichao-work/gen5plus/`
- `gen5plus_species.json` — 532 entries (Gen 5–9 scope, per `gen5plus_summary.json`).
- `gen5plus_moves.json` — 871 entries (452 introduced Gen 5+, 714 referenced by Gen 5+
  level learnsets, union 871).
- `gen5plus_learnsets.json` — 532 species keys, 8,541 deduplicated level entries,
  0 unresolved move IDs.
- `gen5plus_evolutions.json` — 380 evolutions, 0 unresolved.
- `gen5plus_summary.json`, `GEN5PLUS-SUBSTITUTES.md`, `extract_pokeapi_gen5plus.py`
  (the extractor script itself).
- Verdict: moves file = usable at 100% under the proprietary rule (move names/moves are
  explicitly usable); learnset/evolution STRUCTURE and values = usable once species keys
  are swapped to Mochiichao roster entries; species file = REFERENCE-ONLY until that swap
  (it is keyed by swap-bucket names). So: fully usable now 1/4 JSON files (25%),
  usable-after-key-swap 2/4 (50%), reference-only until converted 1/4 (25%). The
  extractor script itself (1 file) is fully usable.

### 2.2 pokeapi-src — 212 non-`.git` files
- Path: `~/workspace/mochiichao-work/gen5plus/pokeapi-src/` (PokeAPI API codebase clone).
- Breakdown: 187 CSV data tables under `data/v2/csv/` + 25 other files (API code,
  build script, config, docs, `LICENSE.md`).
- Licence: BSD-3-Clause code per `LICENSE.md`; the licence text itself notes that
  species/character names are trademarks of their owner, and `gen5plus_summary.json`
  records "BSD-3-Clause code; data/trademarks separate".
- Systems covered: none as game systems — this is a data API, not a game. It supplies
  data shapes for species, moves, abilities, evolutions, encounters, items, types,
  and related tables.
- Verdict: code/build structure = usable under BSD-3-Clause (with its conditions);
  CSV data tables = MIXED — table structure, IDs, numeric values, and move names are
  usable; species-name, flavour-text, and trademark columns are swap-bucket and
  REFERENCE-ONLY. Do not vendor the CSVs wholesale into the public repo without
  stripping swap-bucket columns.

## 3. Inventory docs — actual paths found (3 requested docs)

Canonical copies in the work clone (use these, not the pages-build copies):
- `~/workspace/mochiichao-work/fresh-start/docs/modding-pulls-inventory.md` — 86 lines.
  Covers: 3 already-in-repo decomps, 8 further pret projects in pull order, Gen 5+
  substitutes (PokeAPI, PKHeX GPL-3.0, pkNX GPL-3.0, Project Pokemon tools), and
  open-source modding tools with licence flags. Explicitly NOT verified: pret Gen 5
  (non-BW2), Gen 6/7/8, Switch decomps, Colosseum/Ranger/Stadium decomps.
- `~/workspace/mochiichao-work/fresh-start/docs/open-source-pulls.md` — 70 lines.
  Covers: MIT-safe ports (flocking rules, engine node model), licence-flagged items
  (verify before vendoring), design-reference-only items (proprietary/GPL/NonCommercial).
- `~/workspace/goals/mochiichao-fresh-start-repo/files/pulled-in-inventory.md` — 5,647 bytes.
  NOTE: this doc has NO copy under `fresh-start/docs/` (checked — file does not exist
  there). Goal-files copies also exist for the other two:
  `~/workspace/goals/mochiichao-fresh-start-repo/files/modding-pulls-inventory.md`
  (13,986 bytes) and `~/workspace/goals/mochiichao-fresh-start-repo/files/open-source-pulls.md`
  (8,414 bytes) — same docs, goal-files mirrors, not separate sources.
- Related but NOT among the three requested: `fresh-start/docs/pret-gen1-4-pull-summary.md`
  and `fresh-start/docs/tripo-pull-route.md` — noted, not counted in this inventory's
  requested-doc total (3/3 requested docs located = 100%).

## 4. Vendored tools in the fresh-start work clone — 248 files

- Path: `~/workspace/mochiichao-work/fresh-start/tools/` (work clone, branch
  `feature/unified-data-sprites-2.5d`; work tree is dirty with other lanes' changes —
  NO commit, NO PR, NO deletions made by this worker).
- Breakdown: own extraction scripts 15 + `README.md` + `fetch-full-tools.sh` = 17 files;
  `rot.js/` 2 files (built script + licence file present); `fastnoise/` 2 files
  (single header + MIT licence); `wfc/` 175 files (core C# models + samples + tilesets
  + MIT licence; upstream images set ~28 MB NOT copied, per tools README);
  `dsdecmp/` 14 files (formats + utils + licence file present); `ndstool/` 38 files
  (full source + COPYING file present).
- Systems covered: procedural world/map generation (rot.js, FastNoiseLite, WFC),
  DS compression/container study for conversion research only (DSDecmp, ndstool),
  decomp extraction (the 15 own scripts, covering FireRed/HeartGold/Black 2 plus
  Emerald/Ruby/Crystal/Diamond/Yellow extractors).
- Licence status as stated in files (not re-read in full this pass): FastNoiseLite MIT,
  WFC MIT, rot.js licence file present, DSDecmp licence file present, ndstool COPYING
  present. Own scripts/README/fetch script: fully usable.
- Verdict: all 248 files are usable tooling under their stated licences (DS tools are
  research/conversion tooling, not game content). 0 files in this set are swap-bucket
  content. Note: `~/workspace/mochiichao-work/tools/` (study clones such as PKHeX/pkNX
  references) is a SEPARATE directory from the vendored `fresh-start/tools/` and is NOT
  counted here — it belongs to the decomp/tool-study lane, not this mod-community count.

## 5. Duplicate clones — counted as 0 new sources

- 67 directories under `~/workspace/mochiichao-work/` match the duplicate-clone patterns
  (`*clean*`, `*clone*`, `batch*`, `title-bg-work`, etc.). Spot-checked: `v53-clone`,
  `clean-batch2`, `batch-a-clean`, `title-bg-work` each contain the same fresh-start
  clone layout (repo docs, app source, `docs/`), i.e. copies of the same 3-submodule
  repo, NOT new mod-community sources. Counted as 0 new sources, 0 new files.
- `~/workspace/mochiichao-work/pages-build/main-clone*/docs/` copies of the inventory
  docs are likewise copies of the same 3 docs, counted as 0.
- `~/workspace/mochiichao-work/decomps/` (Gen 1–5 decomp trees) is NOT counted here:
  it is the decomp lane's source set, already covered by other workers, and counting it
  here would double-count it as a "mod-community" source.
- Fan-reference `.git` internals (173 files across the 6 projects) are excluded from
  all counts above; they are version-control metadata, not sources.

## 6. Usable vs reference-only totals (this worker's scope)

Counts below use the proprietary rule + licence caveat in the header. A file is counted
once, in its primary bucket.

- Fan-reference code (systems/structure, re-implementation reference): 84 files.
- Fan-reference images (swap bucket, never copied): 803 files.
- Fan-reference docs/data/other with swap-bucket or unlicenced content (reference-only
  unless sanitised): 49 files (32 docs/data + 15 other + 2 top-level notes = 49).
- Fan-reference total: 84 + 803 + 49 = 936 files. Usable-structure share: 84/936 = 9%;
  reference-only share: 852/936 = 91%. The low usable share is driven by image bulk
  (803/936 = 86%), not by a lack of systems — the 84 code files cover battle, league,
  economy, quests, collection, capture, overworld, menu, AI, and real-time arena play.
- Gen 5+: fully usable now — moves JSON (1) + extractor script (1) + pokeapi-src code/
  build files (25) = 27 files; usable-after-species-key-swap — learnsets + evolutions
  JSONs (2); reference-only until converted — species JSON (1); mixed CSV tables
  (structure/values usable, name/flavour columns swap) — 187 files.
- Vendored tools: usable 248/248 = 100% (under stated licences; DS tools research-only).
- Inventory docs located: 3/3 requested = 100% (plus 2 adjacent docs noted, not counted).

## 7. Gaps (unfinished / missing, with counts)

- Fan projects with NO licence file for their own code: 4/6 = 67% (all except the
  shell-restricted port and the licence-only reference). Verbatim vendoring of their
  code is blocked until a licence is confirmed; re-implementation from their mechanics
  is the usable route.
- Fan projects with 0 usable game systems on disk: 1/6 = 17% (licence-only reference).
- Fan projects with a game bundle absent from the tree: 1/6 = 17% (porting shell only).
- Audio assets present in fan-reference: 0 files (2 projects have audio driver code or
  placeholder notes, 0 audio files). Audio must come from elsewhere or be original.
- Decomp coverage gaps carried from the inventory docs (not re-verified here, stated
  in `modding-pulls-inventory.md`): no verified pret-style decomps for Gen 6/7/8,
  Switch, Colosseum, Ranger, or Stadium — those systems, if wanted, must come from
  substitutes (PokeAPI/PKHeX shapes) or original builds, not from a decomp pull.
- `pulled-in-inventory.md` has no `fresh-start/docs/` copy — if another lane reads
  only the repo docs tree, it will miss that doc (1/3 docs affected = 33%).

## 8. What was NOT done (per task boundaries)

- Did NOT touch `~/workspace/mochiichao-work/black2-everything-else/` or any other
  lane's staging.
- Did NOT commit, create/merge a PR, or delete anything (0 deletions) from the dirty
  `fresh-start` work tree.
- Did NOT copy any fan art, audio, dialogue, or swap-bucket string into this inventory
  or any output — only paths, counts, system names, and licence statements.
- Did NOT count duplicate clones, `.git` internals, `pages-build` doc copies, or the
  `decomps/` trees as new sources.
