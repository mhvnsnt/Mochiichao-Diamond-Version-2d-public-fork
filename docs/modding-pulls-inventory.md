# Legal modding-community pull inventory for Mochiichao

Scope and method: web search and public docs only. Nothing was downloaded, no game files were touched, and nothing was committed to any repo. Repo names are search-verified; extraction counts for new games are deliberately NOT claimed — they must be generated on pull, the way FireRed / HeartGold / Black 2 counts already were. This inventory covers only the legal/public part of the "get it from wherever" demand. The Tripo URL-pull question is separate and is not covered here.

## 1. Already in the repo (baseline — do not re-pull)

- `pret/pokefirered-leafgreen` — FireRed/LeafGreen, GBA, Gen 3. Extracted: 386 species, 354 moves, 4,052 level-up learnsets, TM/HM, tutor, evolutions.
- `pret/pokeheartgold` — HeartGold/SoulSilver, DS, Gen 4. Extracted: 507 species, evolutions, 738 trainers / 1,776 party members.
- `pokebw2` — Black 2/White 2, DS, Gen 5, `res/pokemon/*/data.json` layout. Extracted: 652 species, 560 moves, learnsets, evolutions, 814 trainers. Author/licence now confirmed (2026-10-25 update): `fuddlesworth/pokebw2`, NOT pret, GPL-3.0, ~97% code matched, 99% of functions, both USA/EUR ROMs rebuild byte-for-byte, goal is a native PC port. Keep it in the reference-only treatment it already has; do not vendor its code without a GPL decision.
- Tools already vendored: rot.js, FastNoiseLite, WFC, DSDecmp, ndstool.

## 2. Other public pret decomp projects — verified, in pull order

Critical licence flag for ALL pret projects: GitHub's own API record for `pret/pokeemerald` shows `"license": null`, and a downstream project notes that pret disassemblies ship no licence file. So pret = public and readable, but unlicenced. Treatment must stay exactly as it is for the three already in: submodule reference + extraction of neutral data shapes into JSON (stats, move power/accuracy/type, learnset lists, evolution methods, trainer party composition, encounter tables). Do NOT vendor pret code, text, music, or sprites wholesale into the Mochiichao public repo, and do NOT build a ROM from them in the repo. If a future step wants to vendor pret code, that needs a separate licence decision.

| # | Repo | Game / system | What it gives Mochiichao |
|---|---|---|---|
| 1 | `pret/pokeemerald` | Emerald, GBA, Gen 3 | Highest value first. Same Gen 3 C-data pattern as FireRed, so the existing FireRed extractors are the template. Species base stats, moves, level-up / TM-HM / tutor learnsets, evolutions, trainer parties, wild encounters, Battle Frontier-adjacent structure. Also unlocks the Porymap / expansion ecosystem. |
| 2 | `pret/pokeruby` | Ruby/Sapphire, GBA, Gen 3 | Same shapes as Emerald. Fills Ruby/Sapphire-only species/move/encounter/trainer differences for cross-checking, not a second copy of Emerald data. |
| 3 | `pret/pokecrystal` | Crystal, GBC, Gen 2 | Earliest clean Gen 2 set. Assembly tables. Most useful for: pre-Gen-3 evolution methods, egg groups / breeding shapes, held items, day/night and time-based encounter shapes — directly relevant to Garden/breeding design. |
| 4 | `pret/pokegold` | Gold/Silver, GBC, Gen 2 | Same Gen 2 shapes as Crystal, minus Crystal-only additions. Pull for cross-checking Crystal, not as a standalone data source. |
| 5 | `pret/pokeyellow` | Yellow, GB/GBC, Gen 1 | Species base stats, move tables, evolution/move data in assembly. Lowest data value — small move pool, pre-modern types — but completes the Gen 1 baseline. |
| 6 | `pret/pokered` | Red/Blue, GB, Gen 1 | Same Gen 1 shapes as Yellow. Pull last among Gen 1/2, for cross-checking only. |
| 7 | `pret/pokeplatinum` | Platinum, DS, Gen 4 | Bridges HeartGold → Black 2. Meson build, C source, `src/encounter.c`, field/map systems. Verify completeness/WIP status on clone before extracting — other, abandoned Platinum efforts exist, so do not assume this tree is complete until its species/trainer/encounter files are inspected. |
| 8 | `pret/pokediamond` — VERIFY FIRST | Diamond/Pearl, DS, Gen 4 | Listed in the disassembly-projects table as a pret Diamond/Pearl disassembly, but no pret/pokediamond repo page was directly returned in this search. Do not pull on name alone: confirm the repo, branch, and completeness first, then treat it like Platinum. Lowest priority. |

Explicitly NOT verified as pret decomps — do not claim them:
- No pret Gen 5 Black/White (non-BW2), Gen 6 X/Y, Gen 7, Gen 8, or Switch decomp was found. The "no decomps found" finding was correct for pret-style projects.
- Gen 5 Black/White (non-BW2): a very early non-pret decomp exists, `pokemodding/pokeblack` (also under squiddonaut), matching ROM rebuild works but decomp progress is ~0.03%, almost everything still raw assembly with placeholder names — not usable as a data source, skip for now.
- Gen 8: early experimental only, `charlieduzstuf/pokesword`, low progress — skip for now.
- Switch (Gen 8+): no usable matching decomp. Some static recomp experiments (Let's Go Recomp, uDPR for Brilliant Diamond) appeared in Oct 2026, but these are AI-assisted recompiles, not clean matching decomps, and still require the original game — skip unless native ports are specifically wanted later.
- No Coliseum, Pokémon Ranger, or Stadium (playable, non-inactive) decomp was found. The disassembly list marks pret Stadium, Stadium 2, Pinball, Puzzle Challenge, Trading Card Game, Mystery Dungeon: Red, and Battle Revolution as inactive — skip all of them.

## 2b. Gen 5+ substitute — structured extraction, not decomps (2026-10-25 update)

You do not need a full matching decomp to get data shapes (stats, moves, learnsets, evolutions, trainers, encounters, text). For Gen 5+, use these instead, in this order:
1. PokeAPI (BSD-3-Clause code) — already covers everything through current generations, excellent neutral JSON of data shapes, no ROM required. Does NOT grant sprite/art rights.
2. PKHeX (kwsch, GPL-3.0) — full data for every generation including Switch, exports clean JSON/CSV/PKM structures. Port rules and data shapes, do not vendor code unless a GPL decision is made.
3. pkNX (kwsch, GPL-3.0) — Switch-specific counterpart to pk3DS. Supports Let's Go, Sword/Shield, Legends Arceus, Scarlet/Violet (dump only), and Legends Z-A (dump only). Extracts personal stats, learnsets, evolutions, trainers, encounters, text, etc. Same licence treatment as PKHeX. Note: pkNX/PKHeX extraction from Switch games still presupposes game files/dumps — the tool reference and data shapes are the pull, not game files themselves.
4. Project Pokémon tools (ppRE, RawDB, SwissArmyKnife for Gen 5, etc.) — older but still useful for DS-era binary extraction when you have your own dumps. Licence varies; treat as design/reference unless verified.

Practical recommendation: keep the pret Gen 1–4 order (submodule + neutral JSON extraction only). For Gen 5+, treat PKHeX / pkNX dumps or PokeAPI as the authoritative data source instead of waiting for decomps. The Black 2 / White 2 decomp (`fuddlesworth/pokebw2`, GPL-3.0) is the only Gen 5+ project mature enough to be worth a reference look, but it is not pret and is still GPL.
- A similarly named repo, `openblack/bw2-tools` (MIT, Matt Stevens), is NOT a Pokémon tool — its README describes tools for Lionhead's Black & White 2. Excluded to avoid a name collision.

## 3. Open-source modding tools — verified, with licences

GPL copyleft warning (applies to most of this section): GPL-3.0 code may be used as a tool and studied for rules, but porting its code into Mochiichao's web game would carry GPL terms with it. The safe pattern already used for Boids/fish-schooling applies here too: port the rules and data shapes, not the code, unless a GPL decision is made explicitly.

| Tool | Repo / source | Licence | Useful for — not game files |
|---|---|---|---|
| PKHeX | `kwsch/PKHeX` | GPL-3.0 — verified | Save-file format reference across generations, species/move/item ID tables, legality-rule shapes. Study its rules to design Mochiichao's own save/legality checks. Do not vendor PKHeX code. |
| PKHeX.Core / PKHeX.Everywhere | `arleypadua/PKHeX.Everywhere` (Blazor/WebAssembly port) | Licence-check — described as open source, licence file not verified | Same as PKHeX, plus a web-assembly save-editor architecture reference. No code pull until its LICENSE is read. |
| PKMDS-Blazor | `codemonkey85/PKMDS-Blazor` | GPL-3.0 — verified | Web save-editor reference, same GPL flag as PKHeX. |
| PKTool | `pioacosta/PKTool` | GPL-3.0 — verified (C++17) | DS-native save editor, Gen I–V, with legality-check/legalize logic re-implemented small enough for 4 MiB DS RAM. Best reference for a compact legality implementation. Rules only, not code. |
| PKForge | `sofianeelhor/PKForge` | CONFLICT — licence-check, do not vendor. GitHub shows "Other (NOASSERTION)", while a third-party summary claims GPLv3. | Android save editor + cross-generation Bank, Living Dex, offline legality. Design reference only until its LICENSE file is read in-repo. Do not use pkforgeapp.com — the maintainer's own README warns that site is not official. |
| Porymap | huderlem / Porymap (Gen 3 map editor) | Licence-check — function verified, licence not returned | Map JSON, events, warps, connections, tilesets, wild-encounter editing for pokeemerald/pokeruby/pokefirered. External workflow tool / install note, not vendored code, until its licence is read. |
| Poryscript | huderlem / Poryscript | Licence-check | Script compiler for Gen 3 decomp projects. External tool only, same flag. |
| Porytiles | `grunt-lucas/porytiles` | Licence-check | Tileset compiler (layer PNGs → GBA metatiles). External tool only; note its warning that DS / Pokémon Essentials tiles are not GBA-compatible — relevant to Mochiichao's 64×64 sprite/palette work. |
| pokeemerald-expansion | `rh-hideout/pokeemerald-expansion` | Licence-check — public, 20,940 commits, but no LICENSE file appeared in the returned root listing | A ROM-hack base built on pokeemerald, explicitly "not a playable Pokémon game on its own," with later-generation battle features. Use after a licence read, and only for battle-system feature shapes — never as a wholesale code import. |
| Team Aqua's Asset Repo | TeamAquasHideout organisation | Licence-check per asset — described only as "free to use assets" for Gen 3 hacking, which is not a licence | Pool of community tiles/assets with per-item credits. Do not pull sprites wholesale; any single asset needs its own credit/licence check first. |
| PokeAPI | `PokeAPI/pokeapi` | BSD-3-Clause for the API code — verified. Data/trademarks are separate: Pokémon names are noted as Nintendo trademarks. | Structured reference data via API/JSON. Do not expand the game's existing PokeAPI sprite-URL use on the strength of this — the API code licence does not grant sprite art rights. |

## 4. Pull order (recommended)

1. pokeemerald — same extractor pattern as FireRed, highest data yield, Porymap-compatible. Extract species → moves → learnsets → evolutions → trainers → encounters, cross-check against FireRed, same validation (0 unresolved, counts reported).
2. pokeruby — Gen 3 cross-check, same pipeline.
3. pokecrystal — Gen 2 shapes for breeding/evolution/encounter design; new extractor (assembly tables), not a FireRed copy.
4. pokegold, pokeyellow, pokered — in that order, cross-check only; stop if marginal data is nil.
5. pokeplatinum — only after a completeness check on clone; then DS Gen 4 trainer/encounter shapes.
6. pokediamond — only after repo/completeness verification.
7. Tools, in parallel but never vendored before their licence read: Porymap/Poryscript as install notes → PKHeX.Core/PKTool rules as save/legality design reference → pokeemerald-expansion battle shapes (post-licence-check) → per-asset checks for Team Aqua's repo. PKForge stays design-reference-only until its licence conflict is resolved.

## 5. Explicitly NOT in this inventory — and why

These were not linked to, not downloaded, and no method for obtaining them is described here, even though they are discussed on modding sites:
- ROM dumps / ROM files (any generation, any host, including modding-site mirrors). Owning a cartridge does not make an internet download the file to put in a public repo; the only game file in scope remains a dump the user uploads himself, kept private and local.
- Official art, music, sprites, and code — including sprite/icon collections, ripped tilesets, and soundtrack files hosted on modding communities. The PokeAPI sprite URLs already in the game are a pre-existing use to reduce, not a precedent to expand.
- Leaked internal files — including leaked Game Freak / Nintendo source, betas, and internal development material. Named here only as a category to exclude, with no links and no retrieval path.
- Purchased game files hosted on modding sites, and ROM-hack patches that presuppose a base ROM. A patch is not a clean source pull: it is derivative game content that only works on top of a commercial ROM.
- Fan-game / hack sprites and music presented as "free" without a per-asset licence. "Free to use" in a forum post is not a licence check.
- Any Coliseum / Ranger / X/Y / Switch "source" — no public decomp was verified for these. They remain design reference only (arena presentation, ring-capture loop), not files to pull.

## 6. Caveats

- Pret completeness varies by project (HeartGold is explicitly WIP in its own README; Platinum needs a completeness check; Diamond/Pearl needs a repo check). Treat every new pull as "extract, validate, report counts, then decide" — the same gate already used for FireRed/HeartGold/Black 2.
- The single biggest licence risk in this inventory is not any one tool — it is the unlicenced pret trees. Keeping them as submodule references + neutral JSON extraction (the current pattern) is what keeps this inventory defensible; wholesale code vendoring would change that.
