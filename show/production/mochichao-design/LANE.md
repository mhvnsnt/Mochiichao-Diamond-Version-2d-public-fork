# MOCHICHAO DESIGN — lane charter

**Status: lane stood up 2026-10-27 on the owner's direct order. This lane produces
FUTURE CONSIDERED material: nothing it makes is canon until the owner locks it,
creature by creature, from seeing the design.**

**Companion files in this package:** `SPECIES-DATA-R2.md` · `SPECIES-DATA-R3.md` ·
`SPECIES-DATA-R4-TOYBATTLE.md` · `SPECIES-DATA-R4-ANIMALS.md` ·
`SPECIES-DATA-R4-SMALL-AND-SPIRIT.md` · `SPECIES-DATA-R4-CRYPTID-FOLKLORE.md` ·
`species-data-draft.json` (the game-lane coding, §9) ·
`COVERAGE-AND-ROADMAP.md` · `LANDING-STEPS.md`.
**Inputs it builds on:** `REGIONAL-FLAVOR-LAW.md` + `NEW-SPECIES-IDEAS.md`
(species-brainstorm package) · the TRANSPLANT ROSTER · the canon roster,
`src/data/core/species.json` (47 species, shape verified 2026-10-27).

---

## 1. Mission

**Mochichao Design is the lane that creates the rest of the generations.**

The owner's order of work, and this lane's founding rule:

1. **Data before designs.** Every concept gets a *complete* data sheet first —
   description, types, category, size class, temperament, habitat, diet and
   behaviour, evolution, cry, anatomy notes, palette seed, stat profile in words,
   and a design brief — so that when a design is made, it is made from a finished
   brief, never from a name and a vibe.
2. **Designs come second, and not all at once.** Regions 2 and 3 are designed
   first.
3. **The owner's eye is the gate.** His okay or no on a creature comes when he
   *sees* its design — never from a name list. Mix percentages (how much
   Pokémon / Digimon / Rancher / mecha a region carries) are his edits *after*
   the first visible designs, not before.

## 2. Scale ambition (owner-set, 2026-10-27)

- **Near term:** the roster passes **300** as the generations fill in.
- **Long term:** Pokémon's current world holds **1,025** species. Ours is aimed
  at that count **plus half again — maybe double** — built out of what this
  universe already holds. The total is **open**; the owner has not capped it,
  and this lane does not cap it for him.
- **Counting convention (canon's own):** every evolution stage is one roster
  entry (Kittember / Pyropaw / Manticlaw are three of the canon 47). The 60
  confirmed concepts in this package are **124 stage entries**: canon 47 + 124 =
  **171** on the road to 300+. The gap plan is in `COVERAGE-AND-ROADMAP.md`.

## 3. Inputs

| Input | What the lane takes from it |
|---|---|
| **REGIONAL-FLAVOR-LAW.md** | The design law per region: R1 base grammar, R2 Digimon quarter-turn, R3 Rancher quarter-turn, R4 full mix + toy-battle register + expansion harvest, R5 the owner's own universe + MALAKOR. Binding on every sheet and brief. |
| **NEW-SPECIES-IDEAS.md** | The 60 owner-confirmed concepts (names confirmed 2026-10-27) + the §5 collision/flag record + the owner updates (relaxed base rule; see-first review). The seed text for every data sheet in this package. |
| **Canon 47** (`src/data/core/species.json` + schema) | The data shape the sheets mirror, the art language designs are judged against, and the roster the new entries will one day join. Verified 2026-10-27: 47 entries, zero name collisions with the 124 concept stage names. |
| **TRANSPLANT ROSTER** | The owner-directed anchors (**Pantera** → R2 species; the **Volcano Oni / Sun Rā** → R3 Festival species) and 16 further species-cast candidates from the owner's own casts. Anchors carry full source bios there; their data sheets are completed in this lane on the owner's call. |
| **Show style stack + identity palette** | Pokémon-base show style with Digimon / JoJo / Persona 5 / Tamagotchi-hyperpop registers; brand blues `#70b0d0 / #90b0d0 / #b0d0f0`, ink `#101010`. Palette seeds in sheets defer to it. |

## 4. The pipeline (every creature, every wave)

1. **Complete data sheet** (this lane) — the full field set in §5, no `TBD`
   except visibly flagged owner-class items.
2. **Design brief** — the closing section of the sheet: silhouette, key
   features, and the must-never-change list.
3. **Design** — built from the brief in the canon art language, under the show's
   standing disciplines: likeness built from real reference, **no baked-in
   shadows** (shadows are post/compositing work), style-consistent batches.
4. **Style / likeness gate** — the design is checked against the canon 47's art
   language and its own brief's must-never-change list before the owner sees it.
   A design that fails the gate is not shown as a candidate.
5. **OWNER SEE-FIRST REVIEW** — the owner says okay or no from the design
   itself. His mix-percentage edits for the region are taken at this point.
6. **Canon lock (owner only)** — a locked creature gets its roster `id` in
   `src/data/core/species.json`, its base-stat numbers from game design, and its
   show-lane entries in the same pass (**two-lane consistency**: a canon change
   lands in game data and show data together). Until lock, a concept is a
   considered idea with a complete sheet — nothing more, and nothing less.

## 5. Data standards — the full species apparatus

**"Complete data" means the full Pokémon-games species structure for every
Mochi** (owner expansion, 2026-10-27), modelled on the decomp species-data
layouts: a personal/base-data block, a dex-entry block, footprint data, cry
data, and encounter/discovery data. Every stage sheet carries, in order:

- **Name · Types · Category** (the species noun) · **Size class**
- **Bio** — the Mochiioteca entry text (the sheet's `dexText`)
- **Temperament · Habitat · Diet & behaviour · Evolution** (method/trigger in
  words; levels are game-design class)
- **Stat profile in words** (numbers ⚑ owner-class, §5 below)
- **Palette seed**
- **Footprint** — the track, spec'd to be *drawable*: print shape class, toe/
  claw count and arrangement, gait pattern, size class, the identifying
  marker. A creature that leaves no ordinary print gets its *trace* spec'd
  instead (frost, slime, scorch, chill) — "no print" is a spec, never a blank.
- **Silhouette** — the shape-language spec, drawable from words: outline
  class, proportions, where the key masses sit, what reads at sprite size,
  and the identifying negative space.
- **Cry (full spec)** — source character, pitch contour, duration class,
  rhythm pattern, and variations per state (idle / call / hurt / faint /
  affection / evolution moment). Cries only.
- **Discovery** — encounter data: in-world locations by region and area,
  rarity class, method (walk / water / night / festival / gift-bond…),
  time/season conditions, level band **in words**, first-meeting note.
- **Anatomy notes** (for the move-animation variance registry) · **Design
  brief** (silhouette, key features, must-never-change) · **Flags**.

Sheets mirror the canon `species.json` shape (`name`, `types`, `dexText`,
`baseStats`…) and then exceed it: where the game schema has no home for a
sheet field (footprint, silhouette, cry, discovery, temperament…), the sheet
is the record until the schema grows — the sheet never trims itself to fit
today's schema.
- **No invented numbers.** Base stats, catch rates, exp yields are
  owner/game-design class. Sheets carry a **stat profile in words** (fast and
  frail, slow and bulky, a wall, a glass cannon…) and mark the numbers
  ⚑ OWNER-CLASS — UNASSIGNED. Roster `id`s are likewise unassigned until lock.
- **Types** are recorded as written in the concept source, in show element
  names. ⚑ FLAGGED: the brainstorm's working labels (Gale, Terra, Frost, Volt,
  Venom) do not all exist in canon's type vocabulary (Aqua · Beast · Bug ·
  Chrome · Core · Earth · Flame · Flora · Mythic · Neon · Silk · Strike ·
  Umbral · Aero/Wind · …). Reconciling the type vocabulary is a game-design
  decision for the owner; sheets record both and never silently harmonise.
- **Cries only.** Every sheet describes a cry's character; no creature speaks.
  (The one folklore exception — the tsuchinoko's "cries nobody can prove
  weren't words" — is the owner's own seed and is kept exactly as ambiguous as
  he wrote it.)
- **R4 Secret-law care:** machine-like creatures are *creatures*. No sheet,
  brief, or design may present them as built technology in-world.
- **Flags travel.** Every ⚠ sharing/flag from the source's collision record is
  carried into the sheet it belongs to. A flag is a note for the owner's eye,
  never a silent edit.

## 6. Queue discipline

1. **Now:** complete data for all 60 concepts (this package — 124 stage sheets,
   full apparatus, coded in both lanes per §9).
2. **Designs, first wave:** Region 2 (10 lines), then Region 3 (11 concepts) —
   the owner's see-first review happens here, and his mix edits land here.
3. **Designs, second wave:** Region 4 buckets, in the order the owner calls.
4. **Region 5 stays light** (six sketches in the source package) until the
   season that goes there; its full pass builds on owner-settled transplant and
   MALAKOR material.
5. **Anchors** (Pantera, the Volcano Oni) are owner-directed and documented in
   the TRANSPLANT ROSTER; this lane completes their sheets when called, ahead
   of whatever wave is running — they are his decisions, not brainstorm queue.
6. **The queue flows on its own** — see §10, proactive delivery. Data-complete
   species do not wait to be asked for, one by one.

## 7. Wave 2 — the opening the relaxed base rule created

The owner relaxed the brainstorm's unused-only discipline (2026-10-27):
**animals Pokémon has already used are permitted**; the unused set remains the
preferred seam, not a fence. Wave 2 brainstorm therefore opens — under the same
flavour law, the same collision honesty, and the same data-first discipline —
across the owner's full entity scope:

- used **and** unused animals (the **honey badger is reinstated** as a wave-2
  candidate, its Typhlosion flag carried, not hidden);
- **inanimate objects** — rocks, trees, tables, cars, and everything after;
- **robots, aliens, and mechanical beings** (as creatures, per §5's care);
- **spirits, oni, yokai, demons**; **mythology and cryptids** worldwide;
- **ontologies and religions** as design registers;
- and the bases Pokémon hasn't hit yet, still hunted first.

Wave 2 is brainstorm → data completion → design, in that order, exactly like
wave 1. Its size is set by the roadmap in `COVERAGE-AND-ROADMAP.md`, not by
enthusiasm: the lane fills generations on a plan the owner can see.

## 8. The canon feed (standing input, refreshed per batch)

Designs in this lane are built from the complete data **and** from canon, the
conversation record, and the world. The lane reads the following as **standing
inputs**, refreshed at the start of every batch — a design that contradicts
anything in the feed is wrong even if its own sheet is right:

- the **show Bible** (canon laws: voice/subtitle law, the Secret and its
  display-string discipline, Rangers, the naming laws, signature attacks);
- the **regional flavour law** and the **region/world documents** (region
  source maps, the R4 airship & military design, the region story spines);
- the **transplant roster** (anchors and his own casts, by name);
- the **canon roster + registries** (`species.json`, parts-catalog,
  clip-index, moves registry — current versions per the Current-Version Law);
- the **running owner decisions**: `~/MEMORY.md`, the current daily memory
  (`~/memory/2026-10-27.md` and successors), and the **production log** — the
  record of what the owner has locked, renamed, retired, or corrected.

The feed is why the lane can work proactively (§10): the decisions are already
on record, so a batch arrives consistent with all of them, and the owner's
review is spent on taste, not on catching contradictions.

## 9. Two-lane coding

Completed data is **written and coded in both lanes** — a prose sheet alone is
not a finished delivery:

- **Game lane:** `species-data-draft.json` in this package — one entry per
  stage, mirroring `src/data/core/species.json`'s real schema field-for-field
  (`name`, `types`, `baseStats` with numbers `null`, `abilities`,
  `hiddenAbility`, `eggGroups`, `catchRate`, `expYield`, `growthRate`,
  `dexText` = the Bio, `provenance`, `notes` = the sheet's flags), plus the
  apparatus the schema doesn't hold yet (`conceptId`, `footprint`,
  `silhouette`, `cry`, `discovery`, `statProfile`, `paletteSeed`,
  `designBrief`) as additional properties the schema permits. `id` stays
  `null` and `hpStatus` reads `draft-considered` until the owner's canon lock
  assigns roster numbers and stat numbers together. The file is validated
  against the canon schema's shape before any landing.
- **Show lane:** the markdown sheets themselves are the show-production
  record (design briefs, silhouette and palette specs are production
  documents), indexed for production in `COVERAGE-AND-ROADMAP.md` (name ·
  region · types · queue position · flag count).

At canon lock, the game entry is promoted into `src/data/core/species.json`
and the show sheet is marked LOCKED with its roster id — one pass, both lanes
(two-lane consistency law).

## 10. Proactive delivery (the lane does not wait to be asked)

- **Flow:** the moment a species' data is complete and coded, it enters the
  design queue in queue order (§6: Region 2, then Region 3, then Region 4).
  No per-creature request is needed; the queue *is* the instruction.
- **Batches:** designs are produced and delivered to the owner in batches —
  one evolution line (or one R3 concept, or one R4 register group) per batch,
  never a drip of single stages. A batch delivery contains: the **design
  images** (the see-first material — images, not descriptions of images),
  the batch's sheet/coding references, and its flag list.
- **Verdicts:** the owner's okay/no is taken per creature from the designs, in
  the batch thread. His **edits and mix percentages land per batch** and are
  written back into the sheets, the flavour-law application notes, and the
  production log before the next batch is designed — a rejected read is never
  repeated downstream.
- **Start condition:** design production begins once the 60 concepts' sheets
  are complete (this package). The charter, queue, and batch format above are
  the deliverables that make that start immediate when the owner gives the
  word — or, under the standing proactive rule, as the queue's first batch
  once he confirms the sheets.
