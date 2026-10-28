# Pokémon + Monster-Tamer Dialogue/Text Bank Kit — INDEX

**REFERENCE ONLY — NOT FOR COPYING INTO MOCHIICHAO TEXT.**

Pulled 2026-10-27 (local) / 2026-10-28 (UTC) under the owner's construction-kit rule.
These banks are **TEMPLATES**: they exist so Mochiichao canon dialogue can be written
against the real structure, pacing, and functional coverage of the genre's games —
how text is organised, banked, cued, and interleaved with scripts. The dialogue
**text itself is other productions' creative writing**: study its organisation,
never copy its lines into Mochiichao game or show text. Every per-game folder
carries its own README.txt / PROVENANCE.txt restating this.

Method: `git clone --depth 1` over git protocol only (the GitHub REST API was
rate-limited and was not used). Only dialogue/text content was extracted —
no code, graphics, or audio — and every size below was re-measured on the
extracted copies with stat summing.

---

## Grand total

| Scope | Files | Bytes |
|---|---:|---:|
| Pokémon Gens 1–5 (decomp sources) | 3,342 | 22,136,586 |
| Pokémon Gens 6–9 (poke-corpus, all languages) | 122 | 158,709,627 |
| Digimon (DW1 + DW3 + Cyber Sleuth schema) | 3,139 | 5,431,286 |
| **TOTAL (content files)** | **6,603** | **186,277,499** |

≈ 177.6 MiB. Counts exclude this INDEX and the per-folder README/PROVENANCE markers.

**English-template subset** (what a writer actually works against day to day):
Gens 1–5 complete (22,136,586 B — US-source or original binary form) + Gens 6–9
English `en_common`+`en_script` pairs only (12 files, 15,124,036 B) + Digimon
World 1 complete (144,301 B) + Digimon World 3 eng+usa only (845 files,
1,214,265 B) + Cyber Sleuth schema (477,049 B) = **4,333 files / 39,096,237 bytes**.

---

## Pokémon — per game

### Gen 1 — Yellow (`gen1-yellow/`) — 470 files / 1,047,191 B
- Source: pret/pokeyellow @ `31b7c2ea2ba6c8c64ed083723fbaa8cbb74669cb`. Red/Blue text is near-identical; Yellow is the pulled representative.
- Licence: **none in repo** (checked) — community disassembly; text remains the rights holders'.
- Organisation: `text-banks/` = `text/` (207 files — **one dialogue file per map**, strings as labelled blocks built from `text`/`next`/`para`/`page`/`done` macros over a charmap) + `data/text/` (12 special banks). `scripts-with-dialogue/` = `scripts/` (251 per-map script files that cue those text blocks).
- Template lesson: dialogue lives **with its map**, scripts reference labels; pacing is macro-driven (page breaks are authored, not automatic).

### Gen 2 — Crystal (`gen2-crystal/`) — 490 files / 1,870,099 B
- Source: pret/pokecrystal @ `5c877ef55197039c9676e8e3eec6d254b1c40fe8`. Licence: **none in repo**.
- Organisation: `text-banks/` = `data/text/` (shared common banks: battle text, `common_1–3`) + `data/phone/text/` (91 files — **a whole bank family just for phone calls**, one per contact). `scripts-with-dialogue/` = `maps/` (388 map files; script engine commands and text objects interleaved).
- Template lesson: shared-system strings are banked centrally; recurring remote conversations (phone) get their own per-character files.

### Gen 3 — Emerald (`gen3-emerald/`) — 561 files / 3,811,499 B
- Source: pret/pokeemerald @ `731ad5bfd6e6f265508d0efcca0ba42f9dcf5881`. Licence: **none in repo**.
- Organisation: `text-banks/` = `data/text/` (36 shared banks — speeches, feature text). `scripts-with-dialogue/` = `data/scripts/` (57 global scripts) + `data/maps/*/scripts.inc` (468 per-map event scripts with dialogue as inline `.string` literals).
- Template lesson: the Gen 3 shift — dialogue moves **inside the event script**, wrapped in choreography (`lock`/`faceplayer`/`msgbox` type/`release`); the msgbox *type* (sign, NPC, yes/no…) is part of the writing format.

### Gen 3 — FireRed/LeafGreen (`gen3-firered/`) — 491 files / 1,313,151 B
- Source: pret/pokefirered @ `ce6406d8c2eaf46d543c8a2606de0c3cb1951982`. Licence: **none in repo**.
- Organisation: same architecture as Emerald, smaller map count (27 banks / 39 global scripts / 425 map scripts). Useful as the remake-era comparison point against Gen 1's structure.

### Gen 4 — Diamond/Pearl (`gen4-diamond-pearl/`) — 642 files / 5,692,658 B
- Source: pret/pokediamond @ `b623abef1b4dfe204ca50aab42447ac00c134290`. Licence: **none in repo**.
- Organisation: `text-banks/` = `files/msgdata/msg/` — **625 binary `.gmm` message archives**, one per message group, referenced by (group, index) ID from event scripts; strings are *not* human-readable without a decoder. `scripts-with-dialogue/` = `files/msgdata/scenario/scr_msg` (17 files).
- Template lesson: full centralisation — every string in the game is an ID in a numbered group; scripts never carry literal text.

### Gen 4 — Platinum (`gen4-platinum/`) — 686 files / 3,744,000 B
- Source: pret/pokeplatinum @ `579d2d5c65e736a1a4268fb7acbfd70712177c6c`. Licence: **none in repo**.
- Organisation: `text-banks/` = `res/text/` — **686 JSON files, one per message group** (names, descriptions, system text, dialogue): the Diamond architecture in readable source form. The compiled `res/prebuilt/msgdata` .narc duplicates were deliberately not copied (same content, binary form).
- Template lesson: this is the most directly study-able Gen 4 bank — group boundaries show exactly how the writers sliced the game's text by function and place.

### Gen 5 — Black/White (`gen5-black-white/`) — 2 files / 4,657,988 B — STRICTEST TIER
- Source: pokemodding/pokeblack @ `67d91a78b16caccbd4fbecdddf8a74c823d208a6` (byte-matching disassembly; squiddonaut's project, hosted by the pokemodding org; the clone's committed `files/` tree is 198,008,820 B, of which only the two text archives were taken).
- Licence: **NONE — no licence file exists. Private reference only; do not redistribute.**
- Organisation: `text-banks/message-archive/2` = retail NDS filesystem file `a/0/0/2` (3,054,740 B — **all** message text in one NARC-form container); `scripts-with-dialogue/field-script-archive/3` = `a/0/0/3` (1,603,248 B — field/event scripts). Both need standard NARC/message decoding before strings can be read.
- Provenance note: an alternate community source (Project Pokemon's BW translation-file GitHub repos — the extracted Japanese banks their 2010 translation project worked from) was extracted first, then **removed**: one Gen 5 source, one provenance — the decomp.
- **Black 2 / White 2: not pulled** (partial gap — see Gaps).

### Gens 6–9 — one source for all six (`gen6-*/`, `gen7-*/`, `gen8-*/`, `gen9-scarlet-violet/`)
- Source: **abcboy101/poke-corpus** @ `c6bd4497a54ead271db1644ffa4fb51247746a65` (the repo behind abcboy101.github.io/poke-corpus). Licence: repo is **GPL-3.0**; the underlying game text is extracted game data and is held reference-only here regardless.
- Stated provenance (repo's NOTES.md, "Sources and changes made"): the dumps use the common format shared by kwsch's (Kaphotics / Project Pokemon) extraction tools — **xytext / pk3DS** (3DS gens) and **pkNX** (Switch gens). NOTES.md also documents the exact representation changes: variables as `[VAR 0100(0000)]`, furigana as `{kanji|kana}`, control codes as `\n \r \c \\ \[ \{` escapes; strings organised as numbered `Text File : <id>` blocks matching the games' internal text files. Honest limit: provenance is stated at corpus level; no per-game extraction log or ROM hashes are published. Cross-check performed by the puller: the Scarlet/Violet `en_script` bank contains an NPC line independently cited to this corpus by a Smogon SV data thread.
- Organisation (identical across all six): per language, exactly two banks — `<lang>_common.txt` (interface text, names, descriptions, system/battle text) and `<lang>_script.txt` (story text and dialogue). The template lesson is the **common/script split**: everything a game *says* divides into "system voice" and "story voice," banked separately.
- Sizes (all languages, common+script): X/Y — 18 files / 17,471,319 B (9 languages; no zh) · Omega Ruby/Alpha Sapphire — 18 / 22,169,568 B · Sun/Moon — 22 / 23,584,972 B (11 languages) · Ultra Sun/Ultra Moon — 22 / 31,330,227 B · Sword/Shield — 22 / 28,404,978 B · Scarlet/Violet — 20 / 35,748,563 B (10 languages).
- English pairs alone (the working template set): XY 1,892,716 B · ORAS 2,356,806 B · SM 2,111,792 B · USUM 2,825,541 B · SwSh 2,459,582 B · SV 3,477,599 B.
- Checked and **not** used: kwsch/PKHeX (impeccable provenance, GPL-3.0, but its 1,392 resource text files are system text only — names/locations/memories — **no story/dialogue banks**); kwsch's xytext/pk3DS/pkNX (tools, not banks — they are the provenance, above); SciresM's repos (tooling, no text banks); the Project Pokemon org (no Gen 6–9 text-bank repo hosted; their 2016-era gametext files live on projectpokemon.org, not GitHub, and are superseded by the corpus).

---

## Digimon

### Digimon World (PS1) (`digimon-world-1/`) — 25 files / 144,301 B
- Source: jype0/dw_decomp @ `aaf69a4491cbf275ffd24df19fe78010151c10f2` (matching decompilation). Licence: **MIT** (repo licence; covers the project — the strings themselves are the game's).
- Organisation: the complete `text/` tree as YAML string tables per system (`main` incl. the big `item.yaml`, `btl`, `shop`, `trn`, `fish`, `kar`, `vs`, `std`), each string with per-release language variants (ja/en_us/en_eu). 24 game-text files / 142,050 B + the tool's synthetic `example.yaml` (2,251 B, kept and flagged in its PROVENANCE.txt).
- **Coverage limit:** these are executable string tables (UI/items/battle/system). DW1's per-map NPC/story dialogue lives in per-map script binaries and is **not in this bank** — no defensible decoded dump of it exists (see Gaps).

### Digimon World 3 / 2003 (PS1) (`digimon-world-3-2003/`) — 3,005 files / 4,809,936 B
- Source: markisha64/ddw3 @ `61535731b14ea713ee16b846258402981a62a8dc` (branch `dev`; the repo's master is empty). Licence: **none stated** — reference-only.
- Organisation: the complete `lang_file/` tree decoded to TOML, per language (eng, fra, ger, ita, jpn, spn, usa — 432 files per full language, 413 usa): event/story dialogue as `esdmg200–900` files, NPC talk as `estalk00–09`, plus names/shop/system/card-game text. Dialogue format keeps `[name]Speaker[name]` … `[pause][clear]` codes as extracted.
- Template lesson: DW3 is the fullest Digimon dialogue bank available — a story told as numbered event files with a separate, small NPC-talk set: the ratio itself (≈50 event files : 10 talk files per language) is coverage data.

### Digimon Story: Cyber Sleuth / Hacker's Memory (`digimon-story-cyber-sleuth/`) — SCHEMA ONLY, 109 files / 477,049 B
- Source: SydMontague/DSCSTools (now MVGLTools) @ `089c2497be58acc3a052fe569854ad198d1ecf2a`. Licence: **BSD 3-Clause** (tool + shipped structure files).
- What this is: **not dialogue.** No GitHub repo hosts DSCS/HM's extracted dialogue with stated provenance (see Gaps), so what was pulled is the canonical tool's complete `.mbe` **structure definitions** (`structures/dscs/`, 103 JSONs + 6 doc notes) — the map of where every line of the game's text lives. The main dialogue table's shape: `{ ID, Speaker, Japanese, English, Chinese, EnglishCensored, Korean, German }`; other text tables defined include `quest_para`, `digiline_para`, `eden_text_para`, `farm_talk`, `bbs_post_para`, `keyword_*`, `hackers_memory_para`, `map_msg_*`.
- Route to the real text later: run DSCSTools against a legally owned copy (unpack-mvgl + unpack-mbe-dir with these structures) — no third-party dump needed.

---

## Gaps (honest, with what was checked)

1. **Monster Rancher (every entry) — TOTAL GAP.** No GitHub-hosted text extraction exists for any Monster Rancher/Monster Farm title. Searched exhaustively (multiple phrasings, site-restricted). The series' RE scene produces monster-generation *data* (LegendCup / Monster Rancher Metropolis — CD TOC/subcode and shrine data, hosted off-GitHub), not dialogue; the DS fan translations died unfinished with the text never extracted; no decomp project exists for any entry. The gap is real, not a search miss.
2. **Digimon Story: Cyber Sleuth / Hacker's Memory — dialogue GAP** (schema delivered instead, above). Checked: DSCSTools (tool only, ships no text), NutCracker (decompiler, no samples), SimpleDSCSModManager / DSCS-SkipDialogueMod (no banks); the Vita fan translation and the Un-Dub mod distribute via MediaFire/GBAtemp/GameBanana/Steam Guides — not GitHub text repos.
3. **Digimon World 2 — GAP.** No dw2 decomp or text extraction on GitHub; the "Alternative" romhack circulates via romhack sites, not a provenance-stated repo.
4. **Digimon World 1 — NPC/story dialogue GAP** (string tables delivered). The dialogue is in per-map script binaries; SydMontague's DW1-Code is RE'd code (superseded by dw_decomp, no dialogue dump); Dw1DataAndPatches is patch data, not text.
5. **Pokémon Black 2 / White 2 — PARTIAL GAP.** No decomp filesystem was available to pull (the Black decomp covers BW1; White shares BW1's banks apart from version exclusives). The known B2W2 dumps (veekun's, from the 2012 datamine) were hosted on veekun's own site, not GitHub, and the B2W2 "master script" circulates via the Internet Archive — neither meets this pull's GitHub-hosted-with-provenance bar, so nothing was taken. BW1's architecture (a/0/0/2 + a/0/0/3) is identical in B2W2, so the template coverage stands.

---

## Staging recommendation (owner's staging law: GitHub what fits, TeraBox the rest; local disk is a workbench, not a warehouse)

- **Full kit: 6,603 files / 186,277,499 bytes → TeraBox.** 178 MiB of other productions' text does not belong in the game repo's history, and the bulk is multi-language mass (Gens 6–9 are 158.7 MB across 9–11 languages each) that template work rarely touches.
- **GitHub: this INDEX + the English-template subset (4,333 files / 39,096,237 bytes)** is the repo-sized ration — still file-heavy, so it should land via a normal git push in one commit, *not* via the REST Git-Data API (4,333 per-blob calls would consume most of an hourly API quota shared with the project's other agents, with high mid-PR failure risk). **No PR was opened from this pull** for exactly that reason: the byte total is arguable, the file count makes the API route not sane. Recommended path: parent stages the full kit to TeraBox, and pushes INDEX + English subset to the Mochiichao repo under `show/research/dialogue-kit/` (matching the existing `show/` research layout) with this INDEX as its README — or holds the subset for the first batched ration under the workspace staging rule.
- Local state after this pull: the kit sits at `~/workspace/pokemon-dialogue-kit/` with all clone shells deleted — workbench only, awaiting the staging move above.
