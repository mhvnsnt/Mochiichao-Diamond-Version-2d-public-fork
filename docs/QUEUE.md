# Mochiichao Work Queue — nothing left behind

Created 2026-10-25, from the full Mars / Muse conversation to date.
Rule for this queue: additions only. No existing file is overwritten or deleted
to clear a queue item. Main is PR-only. A queue item moves to DONE only when
its result is verified in the repo / in a build / on a live site, not when it
is merely started.

## Status key
- DONE = verified
- IN PROGRESS = started, result not yet verified
- QUEUED = approved in conversation, not started
- BLOCKED / NEEDS MARS = cannot finish without a Mars decision, login, or
  approval that is named in the item
- RESEARCH = design / research done or needed before building

## DONE (verified in conversation)
- [x] Fresh-start repo renamed, public, private mirror untouched
- [x] Three decomp submodules on main via PRs: pokeheartgold, pokefirered-leafgreen, pokebw2
- [x] Game audit 2026-10-25: React/Vite/TS web game, 12 species in species.ts, ~36 moves in moves.ts, CSS/emoji renderer, no image sprites, SpriteGenerator placeholder model, roster JSON bugs found
- [x] Roster JSON bugs fixed locally (2 bugs, 47 entries parse): line 14 missing quote, line 266 hp 4-5. HP fix value 45 is a GUESS, not confirmed by Mars — see NEEDS MARS.
- [x] Research reports delivered: 2026 web stack / sprites / cheats; decomp -> TS/JSON mapping; Digimon / Ranger / Mystery Dungeon / Arena 2D / Battle Advanced; Chao Garden conversion; 50-item pull list (see docs/PULL-LIST-50.md when added, and goal files)
- [x] GB Operator price verified from Epilogue: $49.99 incl. VAT, ships Oct 30, 2026, GBA only
- [x] FireRed/LeafGreen decomp copied into persistent work clone: pokefirered-leafgreen @ ce6406d8, src/data/pokemon/ readable
- [x] HeartGold decomp copied into persistent work clone: pokeheartgold @ 69881586

## IN PROGRESS
- [ ] Black 2 decomp copy-in: pokebw2 pulling one at a time, after FireRed + HeartGold. Do NOT claim done until submodule status shows it checked out.
- [ ] Kaggle hookup: logins saved 2026-10-25 (see DEVLOG). Browser task retry sent 2026-10-25 to sign in with saved login and report free GPU availability. No notebook / train / upload / pay without specific approval.
- [ ] Netlify hookup: login saved 2026-10-25. Browser task started 2026-10-25 to sign in, list existing sites, check for a site already connected to mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start. No new site / deploy created yet.
- [ ] This queue + DEVLOG: first versions added on branch feature/unified-data-sprites-2.5d, not yet pushed / PR'd / merged.

## QUEUED — build order (Mochiichao game)
Order approved 2026-10-25, Chao Garden inserted as core after roster unify:
1. [ ] Unify data: fixed global_roster.json (47) + one canonical species/moves file. Resolve: 12 vs 47 species, 3 type vocabularies, 2 move systems, 2 map systems. No existing species.ts / global_roster.json overwritten in the first PR — canonical file is ADDITIVE, migration follows after validation.
2. [ ] Custom sprites + sprite manifest: public/assets/sprites/, manifest mapping every roster ID to front/back/walk/battle frames, 64x64 DS-style cell, locked palette, ground line, origin. Replace PokeAPI sprite URLs in RosterView / BattleView / WorldEngine with manifest paths. Starters first (Mochii, Razorgater, Tyrage), then all 47.
3. [ ] 2.5D renderer: Phase A CSS depth-sort fix (sort by y, z-index, scale by depth, shadow first). Phase B PixiJS v8 canvas for world/battle, React for menus/HUD, Zustand for state. Target look: HeartGold / Black-White billboard sprites on 3D-ish ground, X/Y HD-2D lighting, Switch 2 style polish — NOT a full 3D model engine in v1.
4. [ ] Chao Garden mode: Mainframe Gardens (Sector 0 Plaza / Aeon Spire / Deep Sector), Garden Stats Dive/Glide/Sprint/Might/Endurance 1-99, Data Shards, Garden Critters, Bright/Neutral/Umbral alignment, Data Cocoon Garden Form I/II, Data Rebirth, Mythic Form, Bonding Season / Heart Berry breeding, Mochiko Academy, Market, Races, Dojo Sparring, Data-Fruit farming. See docs/CHAO-GARDEN-CONVERSION.md when added.
5. [ ] Creature Mode prototype: one map, one creature, move + dodge (i-frames, Perfect Dodge) + cooldown moves + one boss arena, real-time, in-place fights, no battle screen.
6. [ ] Raising / branching evolution: care, careMistakes, discipline, bond hearts, training points, evolutions[] gates for starter lines first, Burst Form (battle only, 3 turns).
7. [ ] Ranger Capture Mode: one mission area, loop capture, Styler HP, one field assist, release after use.
8. [ ] Hub building: recruited creatures open buildings in Silicon Town / MochiiPlex (Silk Shop, Smithy, Waterworks, Archive), unlocking training / shops / quests.
9. [ ] Open-world RPG layer: quests, crafting, day/night + weather effects on battles, gated routes — LAST, on top of working combat + raising.
10. [ ] Cheat console + emulator-like features: allowlisted word codes (MOCHII-ALL, MAX-LVL, MONEY-999999 clamped, ENCOUNTER-0/MAX, SHINY-ON, NOCLIP, WARP-SECTOR0), save-state slots 1-4, fast-forward 1x/2x/4x, debug panel. save.cheated = true, destructive codes need confirmation + backup slot.
11. [ ] Decomp extraction into TS/JSON: FireRed first (clean C tables), HeartGold second (NARC, pinned commit), Black 2 last (verify paths at pinned commit). Neutral JSON with sourceId/sourceConstant first, then normalised web format. Validation before any PR: every learnset moveId and evolution targetId resolves, no duplicate IDs, sane BST/PP/accuracy, counts report, effectUnmapped list.
12. [ ] Ghidra + MCP tools (after generated JSON validates): small Ghidra scripts + notes in tools/ only, local desktop research. MCP v1 read-only, local stdio, over generated JSON only (get_species, list_species, get_move, list_moves, get_map, list_encounters, search_creatures, validate_data).
13. [ ] 50-item pull list expansion: Slime Rancher, Monster Rancher, Minecraft seeding, Viva Pinata, Palworld, Creatures/Norns, Mendel's Monster, Wobbledogs, Leafblade, Mystery Dungeon, Arena 2D / Battle Advanced / Empress, Pokken phases, Colosseum purification, Snap photo dex, SMT fusion, Minetest, No Man's Sky, WFC, Stardew, Animal Crossing, Factorio, Dwarf Fortress, RimWorld, GB/GBA/GameCube/DS/Wii/Switch systems, Yo-Kai, Jade Cocoon, Ni no Kuni, OpenC2E, PokeSurvivor, Pixel Dungeon / Brogue, Tierra. Wire up in batches, starting with suggested first 10: Chao, decomps, Slime Rancher, Viva Pinata, Mystery Dungeon, Battle Advanced, Minecraft seeding, WFC, OpenC2E, PokeSurvivor.
14. [ ] Playable + testable + deployed: npm run build passes, npm run lint passes, PR with zero deletions, CI green if present, merge to main via PR only, Netlify preview from main, manual playthrough: walk, encounter, catch/battle, save, reload.
15. [ ] Universe / canon doc (proprietary Mochiichao): one lore doc consolidating Mainframe Region, starters, Prof. Aeon / Mochiko, rival Hex, Hackers / Syndicate / Liberation Front, Junk Warlord Krix, Luigi Castagnoli, Champion Mythar, dojos/badges, maps (Sector 0, Route 1.0, The Dark Forest, Quartz Caverns, Silicon Town, MochiiPlex, Castagnoli Island). No scattered canon only in code after this.

## BLOCKED / NEEDS MARS (do not nag, do not invent an answer)
- [ ] Pebblefist HP: tentative fix 45 in roster — confirm 45, or give another handling. No roster PR merges with a guessed stat presented as confirmed.
- [ ] First PR scope / push / merge go-ahead: branch feature/unified-data-sprites-2.5d is local only until Mars confirms push + PR. This queue does NOT authorise a direct push to main.
- [ ] Private-duplicate repo: yes/no, name if yes (candidate Mochiichao-Diamond-Version-2d-private, availability to re-check at creation), recreate main-branch protection?
- [ ] GB Operator order: go-ahead or not? $49.99, ships Oct 30, 2026, LeafGreen only, not HeartGold.
- [ ] Gmail batch 1 deletion: archive complete + verified (3,625 emails, ~192 MB, outside Google, supahpez + Microsoft/Xbox excluded). Deletion blocked on Gmail trash permission. Auto-watch expired 2026-10-20. Deletion runs only on Mars manual go-ahead or re-armed watch with his say-so, and first confirm trash-only vs trash-then-permanent-delete (Mars said "free up that 900 mb", prepared script does trash-then-permanent-delete).
- [ ] Gmail batch 2 + remaining promos: hold until batch 1 deletion confirmed. Batch 2 ~14,064 social notifications, ~400 MB estimated. Remaining old promos ~12,500.
- [ ] Google/Drive switch-back: after Gmail cleanup fully completes, offer once to switch back to dm333n@gmail.com.
- [ ] "Trailblazers": which trending title did Mars mean? Search did not resolve it to a creature game. Closest: Trailmakers / board-game Trailblazers.
- [ ] Kaggle GPU: if saved login is rejected by Kaggle, report that and stop — do not retry with another account, do not ask for password in chat.
- [ ] Netlify deploy: if saved login is rejected, report and stop. If sign-in works, deploy only the build that passed locally, from the merged main branch, unless Mars says deploy a branch preview.

## RESEARCH STILL NEEDED
- [ ] HD-2D / PixiJS v8 renderer: atlas + JSON frame map, y-sort, shadows, lighting, day/night + weather shaders, performance on integrated graphics
- [ ] Custom sprite pipeline at scale: reference frames for 47 creatures, back views, walk cycles, battle front/back, QA pass, AI draft vs hand-clean workflow, palette locking
- [ ] Procedural world seeding: Perlin/Simplex, WFC tile generation, seeded encounters, route generation that still feels hand-designed
- [ ] Breeding genetics: grade inheritance, recessive genes, mutation rates, balancing S-grade farming vs play time
- [ ] Battle balance: real-time cooldowns vs turn-based stats, boss telegraphs, Perfect Dodge economy, Burst Form balance
- [ ] Audio: music / SFX pipeline for web (no commercial tracks), adaptive battle music
- [ ] Save / sync: IndexedDB save states, cross-device saves, backup / export, anti-loss (repo anti-clobber rules apply to code, save anti-loss applies to player data)
- [ ] Multiplayer / trading / co-op: later, after single-player vertical slice is 100%. Research only until then.
- [ ] Accessibility + mobile/touch: touch controls for Creature Mode and Ranger loops, readable UI, colour-blind palettes
- [ ] Hugging Face / Kaggle GPU sprite training: what model, what dataset (original Mochiichao art only), licensing, cost, and whether GPU is even needed for the offline pipeline

## What else is needed to hook up (outside the repo)
- Kaggle: GPU notebooks — sign-in check in progress, no training yet
- Netlify: deploy hosting — sign-in check in progress, no site created yet
- GitHub: already connected via token as mhvnsnt — used for PRs, not for direct main pushes
- Gmail: already connected as marz6kdabest@gmail.com — cleanup only, see BLOCKED
- Hugging Face: SpriteGenerator placeholder model — needs a real, original-art model or a hand-drawn pipeline; do NOT use a placeholder name in a shipped build
- No other service is authorised yet. A new service gets added to this list only when Mars names it or a queued item names it.
