# Animation Source Catalogue — Machine-Set Import Programme, Phase 1

- **Programme:** Machine-set (TM/HM-class) import — in Mochiichao canon naming, *General Moves* = TM-equivalents and *Rare Moves* = HM-equivalents, including the Rare-wins precedence rule (a move that was an HM in any generation is a Rare Move even if a later generation lists it as a TM).
- **Phase:** 1 — survey only. **No asset files were downloaded or copied in this phase.**
- **Survey date:** 2026-10-27 (America/Chicago). Every licence claim below was checked at the source named in its “Licence evidence” line on that date. Anything not checked that way is marked **UNVERIFIED** rather than guessed.
- **Staging note:** Per the workspace staging rule, nothing in this catalogue is to be bulk-downloaded to local disk. Future pull-ins go to GitHub (code / docs / small data) or TeraBox (large media) with a registry entry, not to local staging.

## Doctrine applied to every verdict

1. **A move animation = performer performance + effect layer.** A sheet of lightning bolts, bubbles or leaf particles is only the effect layer. It does not, by itself, animate a Mochiichao creature. Sources are therefore graded on whether they contain (a) effect/FX only, (b) performer/creature motion, (c) the choreography that binds the two (who moves, when, for how long, camera/screen effects), or (d) a full battle scene.
2. **Our pipeline builds original animations from reference.** Extracted game assets are reference material with provenance, never silently relicensed. A licence that covers *code written by a community* does **not** relicense the *game data that code reproduces* — the two layers are graded separately in every section.
3. **Licence/pricing honesty:** buckets are exactly — `open source (licence named)`, `free proprietary`, `free-but-restricted (terms named)`, `paid`, `community-extracted reference (game data; not relicensable by us)`. Where a repo has **no licence file at all**, that fact is stated plainly; “public on GitHub” is not a licence.
4. **Verdicts:** `PULL` = clean to copy into our repo as data/code (with the licence condition stated) · `REFERENCE-ONLY` = study it, mirror facts/numbers/timings in our own words/code, do not copy its assets or code · `SKIP` = do not use for this programme (wrong content, wrong terms, or unverifiable provenance).

---

## Summary table

| Source | Class | Contains | Verdict |
|---|---|---|---|
| pret decompilations — pokeemerald / pokefirered (GBA, Gen 3) | community-extracted reference (game data; not relicensable by us) | Full battle-animation system in C: per-move/per-type animation scripts, effect sprite graphics + palettes, background/screen effects, sound cues. Performer motion is engine transforms of the battler sprite, not per-species frames. | REFERENCE-ONLY |
| pret disassemblies — pokecrystal / pokeyellow / pokeruby / pokegold etc. (GB/GBC, Gens 1–2; ruby = Gen 3) | community-extracted reference (game data; not relicensable by us) | Same system in assembly: per-move animation tables, subanimations, frame blocks, tilesets, palette/screen effects. | REFERENCE-ONLY |
| fuddlesworth/pokebw2 (DS, Gen 5 — Black 2 / White 2) | community-extracted reference (game data; not relicensable by us) — decomp code itself is GPL-3.0, see §2 | Work-in-progress decompilation: recovered code/data/archives for the Gen 5 games, ROMs not included. Battle-animation completeness **UNVERIFIED**. | REFERENCE-ONLY |
| Pokémon Showdown — server (`smogon/pokemon-showdown`) | open source (MIT) | Battle simulator + move/ability/item **data tables** (power, accuracy, PP, type, flags). **No move animations** — animation lives in the client. | PULL (data tables/code only, MIT) |
| Pokémon Showdown — client (`smogon/pokemon-showdown-client`) | open source (AGPL-3.0) | The actual per-move animation choreography: TypeScript/CSS-style animation definitions that move the battler sprites and spawn effect overlays, plus weather/terrain backdrops. No game-extracted effect sheets in the repo (sprites/audio directories are excluded). | REFERENCE-ONLY (code copy only under AGPL-3.0, or under MIT if the relicence offer in its README is obtained in writing) |
| The Spriters Resource (VG Resource family) | community-extracted reference (game data; not relicensable by us) | User-ripped sprite **sheets** (PNG/GIF): Pokémon and trainer sprites, battle/attack effect sheets and battle backgrounds for many games incl. Pokémon Black/White and Black 2/White 2. Effect layer + static battlers; no choreography, no per-move timing data. | REFERENCE-ONLY |
| PokeAPI — API/code (`PokeAPI/pokeapi`, `PokeAPI/api-data`) | open source (BSD-3-Clause) | Move **metadata** only (id, name, type, power, PP, accuracy, effect text, machine/TM-HM numbers per version group, learnsets). **No move animations, no effect graphics.** | PULL (metadata tables/code only, BSD-3-Clause) |
| PokeAPI — sprites (`PokeAPI/sprites`) | community-extracted reference (game data; not relicensable by us) | Pokémon sprites only: static front/back/shiny PNGs, animated **battle-entrance/idle** GIFs for some generations, HOME/official artwork, item and type icons. **No move animations and no move effect assets at all** (verified against its README tree). | SKIP for move animations (out of scope; performer-sprite reference only if ever needed) |
| Bulbapedia (text) | free-but-restricted (CC BY-NC-SA 2.5) | Per-move articles: descriptions, generation-by-generation animation descriptions, TM/HM history. Text facts are reusable with attribution, non-commercial, share-alike. | REFERENCE-ONLY |
| Bulbagarden Archives (images hosted for Bulbapedia) | community-extracted reference (game data; not relicensable by us) | Per-move **animated PNG/GIF captures of the full battle scene** from the games (and anime stills), filed per move per generation. This is the best *visual* record of “what the move actually looked like” — performer + effect + background together. Each file is a game screenshot claimed as fair use, **not** covered by Bulbapedia’s CC licence. | REFERENCE-ONLY |
| Pokémon Essentials / Elite Battle DX (EBDX) / Deluxe Battle Kit ecosystem (Eevee Expo) | community-extracted reference (game data; not relicensable by us) — fan-kit code terms **UNVERIFIED** at a single canonical licence file | RPG Maker fan-game battle system with its own move-animation definitions and Gen 5-style animated battler handling, built on ripped B/W/B2W2 sprites and sounds (per its own credits). | REFERENCE-ONLY |
| rh-hideout/pokeemerald-expansion | community-extracted reference (game data; not relicensable by us) | pokeemerald fork that back-ports later-generation mechanics and **adds move animations for Gen 6–9 moves** (e.g. Dynamax Cannon, Glaive Rush, Triple Dive in the 1.13.0 notes) in the Gen 3 engine’s animation language. | REFERENCE-ONLY |
| Veekun / `veekun/pokedex` (upstream data source for PokeAPI) | open source (MIT — code/data compilation; underlying game facts/assets remain game data) | CSV database: move metadata, machine numbers, flavour text; Pokémon media (main sprites incl. Crystal animated entrance GIFs). **No move animations.** | PULL (metadata CSVs only, MIT) — largely redundant with PokeAPI |
| msikma/pokesprite | open source (MIT — code; sprite assets are game assets / community edits) | Indexed Pokémon sprite/icon set. Performer sprites only. **No move animations, no effects.** | SKIP for move animations |
| itch.io monster-tamer / battler packs (e.g. MonMae/Dokimon “90+ Move / Battle Animations”, generic battler-monster packs) | paid | **Original** (non-Pokémon) monster-tamer battle animations and battler sprites, sold per pack under each seller’s own terms; no-redistribution clauses are typical. Not Pokémon moves, not game rips. | SKIP (paid, off-canon content; would only ever be a paid construction-kit purchase decision for Jamar, not a pull-in) |
| Cobblemon move-effect packs / rehosts found via search (e.g. 9Minecraft data-pack pages) | **UNVERIFIED** | Listings claim 116 animated moves as Minecraft/Cobblemon particle effects. Original repo, licence and provenance were **not verified at source** in this phase (search surfaced only a rehost/aggregator page). | SKIP until verified at the original repo |

---

## 1. The games’ own decompilations — pret projects

**Names / URLs**

- https://github.com/pret/pokeemerald — “Decompilation of Pokémon Emerald”
- https://github.com/pret/pokefirered — “Decompilation of Pokémon FireRed/LeafGreen”
- https://github.com/pret/pokecrystal — “Disassembly of Pokémon Crystal”
- https://github.com/pret/pokeyellow — “Disassembly of Pokemon Yellow”
- Sister projects listed by the organisation itself at https://pret.github.io/ : pokered, pokegold, pokeruby, pokediamond, pokeplatinum, pokeheartgold, and others (GB/GBC assembly, GBA C, DS C/C++).

**Licence / provenance class:** `community-extracted reference (game data; not relicensable by us)`

**Licence evidence (checked at source, 2026-10-27):**

- The pokeemerald repo page lists **no licence at all** — its root file listing contains no `LICENSE` file (files shown: `README.md`, `INSTALL.md`, `Makefile`, build `.mk`/`.sh` files, `rom.sha1`, etc.).
- The GitHub API record for the same repo states `"license": null` (api.github.com/repos/pret/pokeemerald).
- pokecrystal and pokefirered show the same pattern on their repo pages: no licence entry in Repository details and no `LICENSE` file in the root listing.
- Their own descriptions are the provenance: pokeemerald “builds the following ROM: pokeemerald.gba `sha1: f3ae088181bf583e55daf962a92bb46f4f1d07b7`”; pokecrystal “builds the following ROMs: Pokemon - Crystal Version (UE) (V1.0) … `sha1: f4cd194bdee0d04ca4eac29e09b8e4e9d818c133`”. In other words, the projects’ stated success criterion is a **byte-for-byte identical copy of the commercial game**. No licence from pret can change what that data is.

**What it actually contains (animation-relevant)**

- **Gen 1–2 (assembly disassemblies).** Verified structure for pokeyellow: `constants/move_animation_constants.asm`, `data/moves/animations.asm` (the per-move animation table), `data/battle_anims/subanimations.asm` and `data/battle_anims/frame_blocks.asm`. A move animation there is a *sequence record*: a sound id + a subanimation (sprite frame-block sequence) + a tileset choice + frame delays + special screen/palette effects (e.g. Thunderbolt = lightning-ball subanimation + dark-screen palette effect). This is choreography + effect tiles, at Game Boy fidelity.
- **Gen 3 (C decompilations).** Verified structure for the ruby/emerald family: `src/battle_anim.c` (framework, sprite templates, OAM data), per-type effect modules (`src/battle/anim/ice.c`, `water.c`, `flying.c`, the electric module, the fighting module, etc.), `include/battle_anim.h`. Root trees of pokeemerald/pokefirered also hold `graphics/`, `data/`, `constants/`, `sound/` — i.e. the effect graphics, palettes and sound cues the scripts drive.
- **Performer layer — important limit:** in Gens 1–3 the “performer performance” is almost entirely **engine transforms of the single battler sprite** (slide, shake, flash, stretch, palette swap, move toward/away from target) sequenced by the same scripts, plus the effect sprites on top. There are no per-species move-performance frames to lift. That actually maps well onto our rig system (whole-image deform + FX layer), but it means what transfers is the *choreography vocabulary*, not ready-made creature animation.
- **Coverage:** complete for each game’s own move set — Gen 1 (pokeyellow/red), Gen 2 (pokecrystal/gold), Gen 3 (pokeemerald/pokefirered/pokeruby). A move that did not exist in that generation has no animation there. Gen 4–5 pret projects (pokediamond, pokeheartgold) exist per pret.github.io but their battle-animation completeness was **not individually verified** in this phase — **UNVERIFIED**.

**Verdict: REFERENCE-ONLY** — *It is the ground truth for how each Gen 1–3 move was sequenced, timed and layered, and nothing in it is ours (or pret’s) to relicense; study the scripts and rebuild the choreography natively.*

---

## 2. fuddlesworth/pokebw2 — Black 2 / White 2 decompilation

**Name / URL:** https://github.com/fuddlesworth/pokebw2 — “Decompilation of Pokémon Black 2 and White 2”

**Licence / provenance class:** `community-extracted reference (game data; not relicensable by us)` — with a real licence on the *decompilation code*, see below. Do not collapse the two layers.

**Licence evidence (checked at source, 2026-10-27):**

- Repo page: “**License: GNU General Public License v3.0 (GPL-3.0)**”, root files include a `LICENSE` file.
- README, License section: “GNU GPL v3.0, including the symbol names imported from swan.”
- README, Build section, in the project’s own words: “Both USA/Europe ROMs rebuild byte for byte from the same source tree” and “ROMs are not included or provided” (the builder must place their own dumps in `orig/`, checked against published SHA1s for Black 2 / White 2 US).

**What it actually contains (animation-relevant)**

- A work-in-progress DS decompilation: `src/`, `include/`, `lib/`, `res/`, `generated/`, `tools/`, `docs/` (including “Game data — Data formats and archives” and “Scripts — Trainer AI and field scripts”). This is the Gen 5 resource-extraction line already partially mirrored in our own game repo (`src/lib/generated/decomp_black2_moves.json`, `decomp_black2_items.json` in the Mochiichao repo / registry build inputs).
- Gen 5 is the richest 2D generation for our purposes in principle: animated battler sprites, a dynamic battle camera, and full move-effect sequences. **However:** the repo describes itself as a “work-in-progress decompilation” with progress tracked by external ByteMatch badges per version/overlay/library. **Which battle-animation archives/scripts are fully recovered vs. still raw NARC/container data is UNVERIFIED in this phase** — no battle-anim-specific file inventory was confirmed at source, and none should be claimed until a tree-level audit is done.
- Performer layer in Gen 5 proper (the game, not necessarily this repo’s current state): battler sprites are multi-part animated sprites that idle continuously; move performance is again largely camera + sprite transforms + effect/particle sequences layered over that idle, not bespoke per-move body animation per species.

**Coverage:** Gen 5 (Black 2 / White 2, USA/Europe), i.e. the 649-species / ~559-move era including the B2/W2 TM list (95 TMs + 6 HMs) that this programme is importing. Earlier-generation moves absent from Gen 5 have no Gen 5 animation here.

**Verdict: REFERENCE-ONLY** — *GPL-3.0 covers the decompilers’ code, not Nintendo/Game Freak’s game data it reproduces; use it as the Gen 5 reference of record (as the existing mirror already does for move/item data) and rebuild animations natively.*

> Note on the existing mirror: the Black 2 move/item JSON already in our repo should be registry-labelled with exactly this provenance (“community-extracted reference, via fuddlesworth/pokebw2, GPL-3.0 decomp code / game data not relicensable”), if it is not already.

---

## 3. Pokémon Showdown — server

**Name / URL:** https://github.com/smogon/pokemon-showdown — “Pokémon battle simulator”

**Licence / provenance class:** `open source (MIT)`

**Licence evidence (checked at source, 2026-10-27):**

- Repo page: “**License: MIT License (MIT)**”, root files include `LICENSE`.
- README, License section: “Pokémon Showdown's server is distributed under the terms of the MIT License.”

**What it actually contains (animation-relevant)**

- **No animations.** The server is the simulator: `data/` (notably the move/ability/item/learnset data tables), `sim/`, `server/`. Its move data is exactly the metadata layer this programme needs for the registry — type, category, base power, accuracy, PP, priority, flags, target, effect/secondary text — for Gens 1–9 (“Pokémon Showdown simulates singles, doubles and triples battles in all the games out so far (Generations 1 through 9)”, README).
- Anything visual — including the credited “Art (battle animations)” contributors named in its credits (Ascriptmaster, Ridaz) — is client work, not server data. Do not cite the server repo as an animation source.

**Coverage:** Gens 1–9 move metadata, complete in principle; per-move numbers should still be reconciled against the game-data sources (pret / pokebw2 / PokeAPI) where they disagree, as Showdown sometimes encodes simulator interpretations.

**Verdict: PULL (data tables/code only, MIT)** — *MIT-licensed original code/data compilation; copy the tables/code with the MIT notice retained — this pulls metadata, not a single animation frame.*

---

## 4. Pokémon Showdown — client (the animation definitions)

**Name / URL:** https://github.com/smogon/pokemon-showdown-client — “The client for Pokémon Showdown” (runs `play.pokemonshowdown.com`)

**Licence / provenance class:** `open source (AGPL-3.0)` — for the client code, which is **original Showdown choreography**, not extracted game assets. Read the condition in the verdict before treating “open source” as “free to copy anywhere”.

**Licence evidence (checked at source, 2026-10-27):**

- Repo page: “**License: GNU Affero General Public License v3.0 (AGPL-3.0)**”, root files include `LICENSE`.
- README, License section (verbatim): “Pokémon Showdown's client is distributed under the terms of the AGPLv3.” It continues: “If you're doing *anything* else other than forking, *especially* if you want to [use] some client code files in your own open-source project that you want to release under a more permissive license … please ask at `staff@pokemonshowdown.com`. I hold all the copyright to the AGPLv3 parts and can relicense them to MIT for you.” And, in bold in the README: “**WARNING:** This is **NOT** the same license as Pokémon Showdown's server.”
- README, Warning section, on what is *not* in the repo: “It also doesn't include several resource files (namely, the `/audio/` and `/sprites/` directories) for size reasons.” — i.e. the game-derived sprite/audio layer is deliberately excluded from this repo.

**What it actually contains (animation-relevant)**

- This **is** a real per-move animation source — the only one in this survey that is both (a) per-move, (b) complete across modern generations, and (c) written as readable code rather than recovered game bytecode. Verified structure: the client’s `src/` holds `battle-animations*.ts` files classed as “Battle Scene — Visual rendering of battles” (vs. `battle*.ts` engine and `battle-dex*.ts` data layer). In those definitions each move gets a timed scene: attacker/target sprite transforms (approach, recoil, shake, fade, scale), effect overlays spawned as CSS/DOM graphics, background/weather changes, and sound cues — a modern, engine-independent restatement of the same choreography vocabulary the pret scripts encode for Gens 1–3.
- **Performer layer:** sprite transforms only, applied to whatever battler sprite is loaded (in the live service, largely game-derived or Smogon-spriting-project GIFs — which are **not** in this repo, see the Warning above). There is no per-species performance art to take; what is valuable is the *per-move timing/transform/effect script*.
- **Effect layer:** drawn in code/CSS rather than shipped as ripped effect sheets, which is precisely why this source is legally cleaner than the rips — and why copying it still carries the AGPL condition.

**Coverage:** Gens 1–9 battles in the live client; in practice the bespoke per-move animations are densest for common/competitive moves, with generic fallback animations for obscure moves. Exact per-move coverage (bespoke vs. fallback) is **UNVERIFIED** move-by-move in this phase and should be counted during any pull-in audit, not assumed to be 100%.

**Verdict: REFERENCE-ONLY** — *Study the choreography and mirror its timings/transforms in our own rig/FX code; direct code copy is only clean under AGPL-3.0 terms for the receiving repo, or under MIT after obtaining the README’s relicence offer in writing — neither step was taken in this survey phase.*

---

## 5. The Spriters Resource (VG Resource)

**Name / URL:** https://www.spriters-resource.com/ — Terms of Use: https://www.spriters-resource.com/page/tou/ (sister sites for models/textures/sounds run under the same family terms)

**Licence / provenance class:** `community-extracted reference (game data; not relicensable by us)`

**Licence evidence (checked at source, 2026-10-27 — Terms of Use page, verbatim):**

- “Use of the content of this site is not included in this term, as that is the purpose of this resource. Feel free to use the content as you wish (**where legally permitted or in unpublished, non-commercial works**).”
- “**Content on these sites may not be used in any commercial works.** These include, but are not limited to, paid games, free games with in-app purchases or advertisements, monetized videos, and other websites displaying advertisements. This also includes anything 100% free being published to an established market place (e.g. Steam, Apple's App Store, or Google Play).”
- “Taking content in its original format from this website and distributing it elsewhere without prior consent or credit to its origin will also result in contact being made with those seen fit to have it removed as this is also viewed as theft.”
- The site’s Help page states the underlying reason plainly: “These resources are all copyrighted works … We do not own and cannot license any of them to you.”
- Submission format (for expectations): sheets are PNG (GIF accepted but discouraged), per the VG Resource wiki’s submission guide.

**What it actually contains (animation-relevant)**

- Community **rips**: sprite sheets for Pokémon games across GB/GBC/GBA/DS and later, organised per game — Pokémon battler/trainer sprites, **battle/attack effect sheets**, and battle backgrounds are the relevant categories for this programme (the site’s Pokémon Black/White and Black 2/White 2 sections are the Gen 5 source most fan projects cite; EBDX credits in §8 explicitly name “Spriters-Resource (redblueyellow)” for Gen 5 ball sprites).
- **Layer analysis:** this is the **effect layer and static battlers, frozen into sheets**. A sheet preserves *what the frames look like* and their order on the sheet; it does **not** preserve per-move timing, spawn positions, scaling, palette cycling, camera moves, or which effect belongs to which move in which order. Reconstruction from sheets alone is guesswork unless paired with a choreography source (§1, §2 or §4).
- **No performer performance** beyond the battler sprites themselves (and, for Gen 5, the parts-based animated battler material as ripped — still game art, still reference-only).
- Specific sheet-by-sheet inventory for move effects per generation was **not enumerated** in this phase — **UNVERIFIED** at the individual-sheet level; the categories above are the site’s established organisation, not a counted audit.

**Coverage:** Potentially Gens 1–5 in depth (2D games), thinner and more model/texture-based for 3D generations via the sister Models/Textures sites. Completeness varies by ripper and game; there is no completeness guarantee.

**Verdict: REFERENCE-ONLY** — *The site itself forbids commercial use and redistribution in original format and disclaims any power to license the underlying game art; use sheets to see what an effect looks like while rebuilding it, never as shipped assets.*

---

## 6. PokeAPI — API, data, and sprites

### 6a. `PokeAPI/pokeapi` (+ `PokeAPI/api-data`)

**URLs:** https://github.com/PokeAPI/pokeapi · https://pokeapi.co/

**Licence / provenance class:** `open source (BSD-3-Clause)`

**Licence evidence (checked at source, 2026-10-27):**

- Repo page: “**License: BSD 3-Clause "New" or "Revised" License (BSD-3-Clause)**”, root files include `LICENSE.md`.
- The organisation’s repo listing likewise shows `api-data` (“Static JSON data from the API, plus a JSON Schema”) as BSD-3-Clause.

**What it actually contains (animation-relevant)**

- **Move metadata only.** The `/move/` endpoint and its CSV/JSON data give id, name, type, damage class, power, PP, accuracy, priority, effect entries, flavour text, and — directly relevant to this programme — **machine (TM/HM) numbers per version group** and per-Pokémon learn methods. There are **no animation fields, no effect graphics, no timings**. Anyone claiming “PokeAPI has the move animations” is wrong; verified against the API/repo structure in this survey.
- The sprites are a separate repo and a separate licence question (next section). The API README itself notes the `sprites` submodule is ~10+ GB and optional — another reason not to bulk-pull it locally (see staging note).

**Coverage:** Gens 1–9 metadata (main-series games), the broadest single metadata table available.

**Verdict: PULL (metadata tables/code only, BSD-3-Clause)** — *Clean, permissively licensed metadata for the registry (including machine-number history); it contributes zero animation data and should be cited as metadata-only wherever it is used.*

### 6b. `PokeAPI/sprites`

**URL:** https://github.com/PokeAPI/sprites — “Repository containing many Pokémon sprites”

**Licence / provenance class:** `community-extracted reference (game data; not relicensable by us)` — for the sprite *assets*. (The repo’s own tooling/website code is a separate layer; see the licence caveat below.)

**Licence evidence (checked at source, 2026-10-27):**

- Repo page: “**License: Other (NOASSERTION)**”, root files include `LICENCE.txt`. **The text of `LICENCE.txt` was not opened in this phase, so its exact wording is UNVERIFIED** — flag for a one-file check before any future use of this repo’s code. No such check is needed to grade the *sprites*: they are the games’ artwork (front/back/shiny battler sprites, official artwork, HOME renders), which the repo redistributes; redistribution by PokeAPI does not relicense Nintendo/Game Freak art.

**What it actually contains (animation-relevant) — the direct answer to the task question**

- **No move animations. None.** Verified against the repo’s own README tree, which is exhaustively organised as: `sprites/pokemon/other/{dream-world, official-artwork, showdown, home}`, `sprites/pokemon/versions/generation-{i..ix}/…` (per-game front/back/shiny/female/icon sets), `sprites/items/`, `sprites/types/`. There is no `moves/`, no battle-effects, no backgrounds branch.
- The only *animated* files are **Pokémon entrance/idle animations**: e.g. Generation II Crystal “animated (GIFs of front-facing battle entrance sprites)”, Generation V Black/White “animated” battler GIFs, and `other/showdown` GIFs which the README describes as “battle animation sprites designed by the Smogon community” — i.e. animated *battlers*, not animated *moves*.
- So for this programme the repo can at most answer “what does species X’s battler/idle look like” — a performer-reference question we already answer from our own canon cutouts under the likeness law. It cannot answer any move-animation question.

**Coverage:** Species sprites Gens 1–9; animated battlers only for the generations/games listed above.

**Verdict: SKIP for move animations** — *Out of scope by content (Pokémon sprites only, no moves/effects), and the assets are game art in any case; do not pull it expecting animation data.*

---

## 7. Bulbapedia + Bulbagarden Archives

**URLs:** https://bulbapedia.bulbagarden.net/ (per-move articles, e.g. “Thunderbolt (move)”) · https://archives.bulbagarden.net/ (the image archive) · Licence page: https://bulbapedia.bulbagarden.net/wiki/Bulbapedia:Copyrights

**Licence / provenance class — split, and the split matters:**

- Bulbapedia **text**: `free-but-restricted (CC BY-NC-SA 2.5)`
- Bulbagarden Archives **game images/animations**: `community-extracted reference (game data; not relicensable by us)`

**Licence evidence (checked at source, 2026-10-27):**

- Copyrights page (verbatim): “Original Bulbapedia content is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike** license” — “You may copy and modify Bulbapedia content, **provided you attribute it to Bulbapedia** … provided it is **not for commercial purposes** … provided the resulting work is also licensed under the same copyright”. “Articles edited or created after … April 15, 2007 … are automatically (re)licensed under **version 2.5** of the Creative Commons Attribution-NonCommercial-ShareAlike license.”
- Same page disclaimer: “**Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc.** TM, ® and Pokémon character names are trademarks of Nintendo.”
- Archives file pages carry their **own, different** licence block. Example verified in this survey (`File:Thunderbolt Japanese I.png`, Bulbagarden Archives): “**Licensing: This image is a screenshot from a Pokémon game, or substantially derived from one. The contributor claims this to be fair use.**” Anime stills carry the parallel wording (“a screenshot from Pokémon animation … fair use”). **The CC licence does not cover these files.**

**What it actually contains (animation-relevant)**

- **The best visual record in this survey.** Move articles embed, per generation, animated captures (animated PNG/GIF) of the move being used in-game — performer + effect + background + UI together, exactly as a player sees it. For a show pipeline this is the quickest way to answer “what does this move actually look like, start to finish, in Gen 3 vs. Gen 5?” without booting a ROM.
- Text side: per-move descriptions, “in the games / in the anime” animation descriptions, generation change notes (e.g. Thunderbolt’s Japanese Gen 1 flash pattern and its toning-down are documented on its article), and TM/HM numbering history that cross-checks the registry.
- **Limits:** captures are documentation, not data — fixed camera, fixed battlers, compressed, no separated layers, no timings beyond frame count/duration shown on file pages (e.g. the Thunderbolt file above: 160×144, 197 frames, 6.8 s — a looped capture including surrounding battle UI time, not a clean effect duration). Anime images in the same archive are a *different* depiction (the TV show’s interpretation) and must not be conflated with game animations in the registry.

**Coverage:** In principle every move, every generation in which it appears, plus anime depictions — in practice coverage is contributor-driven and uneven for obscure moves/recent generations. Per-move presence should be checked article-by-article when needed, not assumed.

**Verdict: REFERENCE-ONLY** — *Watch the captures and cite the articles as the visual reference of record; the text licence is non-commercial/share-alike and the animation files themselves are fair-use-claimed game screenshots, so neither layer is pullable as production assets or as shippable text.*

---

## 8. Other public community sources found

### 8a. Pokémon Essentials / Elite Battle DX (EBDX) / Deluxe Battle Kit

**URLs:** Distributed via Eevee Expo (https://eeveeexpo.com/ — e.g. “Elite Battle DX (EBDX) — Unofficial port for Pokémon Essentials”, “Animated Pokemon System [DBK Add-On]”), with GitHub mirrors for ports. No single canonical repo/licence was verified — see below.

**Class:** `community-extracted reference (game data; not relicensable by us)` for its ripped graphics/sounds; fan-kit code licence **UNVERIFIED**.

**Evidence / contents:** EBDX’s own credits (as reproduced in fan games using it) state the layering explicitly: “GameFreak | Original sprites from B/W/2 games; Pokecheck.org | Ripping the sprites from B2/W2 roms; … Spriters-Resource (redblueyellow), Damien, WolfPP | Gen 5 ball sprites; GameFreak | Original sound effects from B/W/2 games; BadSamaritan | Ripping the sound effects; Luka S.J. | Elite Battle: DX”. The system adds Essentials-format move animations and Gen 5-style animated battlers on top of those rips. **No canonical `LICENSE` file for EBDX/Essentials was checked at source in this phase — UNVERIFIED; do not quote terms for it until that check is done.**

**Verdict: REFERENCE-ONLY** — *Useful to study how a fan engine organises move animations in data, but its graphics/sounds are B2/W2 rips and its code terms are unverified, so nothing is pullable as-is.*

### 8b. rh-hideout/pokeemerald-expansion

**URL:** https://github.com/rh-hideout/pokeemerald-expansion (release notes surfaced and checked via its 1.13.0 release summary in this survey; repo licence file itself **UNVERIFIED** — it inherits the pret situation in §1 in any case).

**Contents:** A pokeemerald expansion fork adding later-generation content to the Gen 3 engine, including — per its 1.13.0 notes — “New Attack Animations” / “Added move animations for multiple moves” (Dynamax Cannon, Behemoth Blade/Bash, Eternabeam, Glaive Rush, Triple Dive, the “Torque” moves, Psyblade, Mighty Cleave, Supercell Slam, and others) and “New and polished battle animations”. That makes it the only surveyed source that expresses **Gen 6–9 moves in the Gen 3 `battle_anim` language** — valuable as a translation reference when a modern TM (e.g. a Gen 9 SV TM) has no Gen 1–5 game animation to study.

**Verdict: REFERENCE-ONLY** — *It is built on, and byte-targets, the same commercial game data as §1; its new animations are community choreography in that engine, to be studied and re-expressed in our rig/FX system, not copied as game data.*

### 8c. Veekun pokedex

**URLs:** https://veekun.com/ · git.veekun.com (pokedex repo)

**Class:** `open source (MIT)` — evidence: the project’s own history records “Added a README and licensed under MIT” (2009-07-23), and Veekun is the long-standing upstream whose CSV data model PokeAPI follows.

**Contents:** Move/ability/item/species CSVs (including machine numbers and flavour text) and Pokémon media (main sprites, incl. Crystal animated entrance GIFs, frame-2 sprites for Gen 4). **No move animations, no effects** — same content ceiling as PokeAPI, because PokeAPI largely *is* this dataset continued.

**Verdict: PULL (metadata CSVs only, MIT)** — *Clean metadata, but redundant: prefer PokeAPI (§6a) as the maintained copy and cite Veekun only where a table exists there first.*

### 8d. msikma/pokesprite

**Class:** `open source (MIT)` for its code/index (per its `license.md`, as summarised in project documentation checked in this survey: “Software/Code — MIT License”; “Original Game Assets — Nintendo/Creatures/GAME FREAK … Fair use basis”).

**Contents:** A well-indexed set of Pokémon sprites/icons (incl. community shiny/form variants). Performer sprites only. **No move animations, no effect assets.**

**Verdict: SKIP for move animations** — *Wrong content for this programme, however clean its index code is.*

### 8e. itch.io packs

**Examples checked:** MonMae/Dokimon bundle pages on itch.io advertising “90+ Move / Battle Animations + Transitions” / “80+ Unique Battle Animations” as part of a **paid** monster-tamer engine bundle ($23.99 tier shown); generic paid battler-monster packs (idle/attack animation sets for original monsters).

**Class:** `paid`

**Contents / why they do not fit:** These are **original** animations for *their own* monsters/moves, sold under per-seller terms that typically allow use in a game project but forbid reselling/redistributing the assets as assets. They contain no Pokémon moves, no game data, and no TM/HM coverage. They are not “free community rips” and must never be catalogued as such.

**Verdict: SKIP** — *Paid, off-canon content; only Jamar can decide to buy a construction-kit pack like this, and that would be a purchase record, not a pull-in.*

### 8f. Searched for, not verified — do not cite as sources

- **Cobblemon move-effect data packs** (Minecraft mod ecosystem): search surfaced only aggregator/rehost pages (e.g. 9Minecraft) claiming “116 animated moves”. Original repository, licence and authorship were **not verified at source** — **UNVERIFIED, SKIP until a primary repo check is done.**
- **Standalone “Gen 5 battle animation rip” GitHub repos / asset packs:** no additional, clearly identifiable public repo dedicated to extracted Gen 5 *move-animation* assets was verified in this survey’s searches (results resolved to the sources above — pret/pokebw2, Spriters Resource, EBDX, Showdown). Absence here means “not found and verified”, not “does not exist”; a dedicated GitHub code-search pass is the follow-up if Jamar wants this chased further.

---

## Cross-source reading for the registry builder

| Question the registry must answer | Best reference (in order) | Pullable data that answers it |
|---|---|---|
| What are the move’s numbers (power/PP/acc/type/machine no.)? | PokeAPI → Showdown server → pokebw2/pret tables | **Yes — PULL** (§3, §6a, §8c), all permissive metadata |
| What did the move *look like* in generation G? | Bulbagarden Archives capture → pret/pokebw2 script for that generation | No — reference only (§1, §2, §7) |
| In what order, with what timing/transforms/effects? | pret `battle_anim` script (Gens 1–3) / Showdown client definition (modern restatement) | No — study and re-express (§1, §4); Showdown code copy needs AGPL compliance or a written MIT relicence |
| What does the effect itself look like, frame by frame? | Spriters Resource sheet → Archives capture | No — reference only (§5, §7) |
| What does the *performer* do? | Mostly: **nothing bespoke** in Gens 1–5 games — engine transforms + idle. Our anatomy-variance doctrine therefore has to be *authored* (per species/shape/size/class), using the games’ transform vocabulary as the base language. | n/a — original work |
| A Gen 6–9 move with no 2D game animation? | pokeemerald-expansion’s back-ported animation (§8b) → Showdown client → Bulbapedia text description | No — reference only |

The practical consequence: **there is no clean, pullable “move animation library” in asset form anywhere in this survey.** What is pullable is metadata. What is valuable about the animation sources is choreography and appearance — both reference-grade. Our move animations will be original builds (rig performance + original FX) informed by those references, with the reference source logged per move in the registry. That is the construction-kit position applied to moves, and this catalogue found no source that changes it.

---

## Pulled in this phase

**Downloaded / copied in this phase: NOTHING.** This phase was the survey only, per the task; no asset files, repos or sheets were downloaded, mirrored or staged (locally, on GitHub, or on TeraBox).

### Cleanly pullable NOW (next phase, data/code only — no animation assets)

| Item | From | Licence to honour | What it gives the programme |
|---|---|---|---|
| Move data tables (`data/moves` and related learnset/machine data) | `smogon/pokemon-showdown` (§3) | MIT — retain licence/notice | Gen 1–9 move metadata for registry cross-checks |
| Move metadata (CSV/JSON, incl. TM/HM machine numbers per version group) | `PokeAPI/pokeapi` / `PokeAPI/api-data` (§6a) | BSD-3-Clause — retain licence/notice | Registry machine-history tables (feeds the Rare-wins precedence tagging) |
| Move/species CSV tables (only where PokeAPI lacks a table) | Veekun pokedex (§8c) | MIT — retain licence/notice | Gap-fill metadata only |

Conditions for any of the above: land them as **data/code in GitHub** (they fit), with a provenance + licence note in the registry manifest at landing time, per the licence-honesty and staging laws. Animation *numbers* mirrored from reference sources (durations, transform sequences) must be logged as “mirrored from reference: <source>” in the registry row — they are facts about the reference, recorded in our own format, not copied assets.

### Catalogued-only (reference forever, unless a specific written permission changes it)

- pret pokeemerald / pokefirered / pokecrystal / pokeyellow (+ sister projects) — §1
- fuddlesworth/pokebw2 — §2 (GPL-3.0 decomp code; game data not relicensable)
- Pokémon Showdown client animation definitions — §4 (AGPL-3.0; MIT relicence available on request per its README — **not yet requested**)
- The Spriters Resource sheets — §5 (site terms bar commercial use + redistribution in original format)
- PokeAPI/sprites assets — §6b (game art; repo `LICENCE.txt` wording still **UNVERIFIED**)
- Bulbapedia text (CC BY-NC-SA 2.5) and all Bulbagarden Archives game/anime captures (fair-use-claimed screenshots) — §7
- Pokémon Essentials / EBDX / Deluxe Battle Kit — §8a (ripped B2/W2 graphics/sounds; code licence **UNVERIFIED**)
- rh-hideout/pokeemerald-expansion animations — §8b (built on §1 game data; repo licence file **UNVERIFIED**)

### Explicitly not pullable / skipped

- PokeAPI/sprites and msikma/pokesprite **for move animations** — the content does not exist there (§6b, §8d).
- itch.io paid monster-tamer/battler packs — §8e (`paid`, off-canon; purchase decision only).
- Cobblemon move-effect rehosts and any other **UNVERIFIED** listing — §8f.

---

## Verification log (what was checked at source, 2026-10-27)

| Check | Result |
|---|---|
| `smogon/pokemon-showdown` repo page + README licence section | MIT; `LICENSE` present |
| `smogon/pokemon-showdown-client` repo page + README licence/warning sections | AGPL-3.0; `LICENSE` present; sprites/audio dirs excluded; MIT relicence offer quoted |
| `pret/pokeemerald` repo page + GitHub API record | No `LICENSE` in root listing; API `"license": null`; README states byte-identical ROM build + SHA1 |
| `pret/pokecrystal`, `pret/pokefirered` repo pages | No licence entry / no `LICENSE` in root listings; README ROM SHA1s |
| pret organisation project list (pret.github.io) | Gens 1–5 projects enumerated; per-project battle-anim completeness for DS projects **UNVERIFIED** |
| pokeyellow / pokeruby battle-animation file structure (project documentation) | `data/moves/animations.asm`, `data/battle_anims/*`, `src/battle_anim.c`, per-type `src/battle/anim/*.c` |
| `fuddlesworth/pokebw2` repo page + README | GPL-3.0, `LICENSE` present; “ROMs are not included”; byte-for-byte rebuild claim; battle-anim completeness **UNVERIFIED** |
| Spriters Resource Terms of Use + Help pages | Non-commercial-only use, no redistribution in original format, “We do not own and cannot license any of them” — quoted in §5 |
| `PokeAPI/pokeapi` repo page | BSD-3-Clause; `LICENSE.md` present |
| `PokeAPI/sprites` repo page + full README tree | “License: Other (NOASSERTION)”, `LICENCE.txt` present but **text UNVERIFIED**; tree contains Pokémon/item/type sprites only, animated files are battler entrance/idle GIFs only |
| Bulbapedia Copyrights page | CC BY-NC-SA 2.5 for original text — quoted in §7 |
| Bulbagarden Archives file page (Thunderbolt, Japanese Gen 1) | Per-file licence: game screenshot, “contributor claims this to be fair use” — quoted in §7 |
| EBDX credits as reproduced in dependent fan games (Eevee Expo) | B/W/B2W2 sprite + sound rips credited to Game Freak / Pokecheck / Spriters Resource rippers; canonical kit licence **UNVERIFIED** |
| pokeemerald-expansion 1.13.0 release notes | Added/back-ported move animations for named Gen 6–9 moves; repo licence file **UNVERIFIED** |
| Veekun pokedex history | “licensed under MIT” commit record (2009) |
| itch.io MonMae/Dokimon + battler pack pages | Paid tiers/prices shown; original (non-Pokémon) content |

---

## Coordinator addendum (2026-10-27, added at registry assembly)

The "Pulled in this phase" section above was written before the registry build ran. For the record:
PokeAPI machine metadata **was pulled in this phase** — 2,372 machine records fetched from the
PokeAPI API on 2026-10-27 (BSD-3-Clause, the §6a PULL verdict), reconciled against the in-repo
tables, and embodied in `machine-registry.json` in this folder. No animation assets, sprites,
sheets, or code were pulled; everything else in this catalogue remains survey-only, exactly as the
verdicts state.
