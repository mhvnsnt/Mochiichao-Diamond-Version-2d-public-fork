# COVERAGE & ROADMAP — Mochichao Design lane, wave 1

**Status: data completion for the 60 owner-confirmed concepts is COMPLETE
(2026-10-27) — 60/60 concepts, 124/124 stage sheets, full apparatus, coded in
both lanes. Everything here is FUTURE CONSIDERED material: the canon roster
stays 47 until the owner locks creatures from their designs (see-first rule).**

---

## 1. Coverage

| File | Concepts | Stage sheets | Apparatus audit |
|---|---|---|---|
| `SPECIES-DATA-R2.md` (Bucket A) | 10 lines | 30 | 30/30 × all fields |
| `SPECIES-DATA-R3.md` (Bucket B) | 11 | 15 | 15/15 × all fields (incl. R3 Job field) |
| `SPECIES-DATA-R4-TOYBATTLE.md` (C1) | 7 | 16 | 16/16 × all fields |
| `SPECIES-DATA-R4-ANIMALS.md` (C2) | 12 lines | 24 | 24/24 × all fields |
| `SPECIES-DATA-R4-SMALL-AND-SPIRIT.md` (C3+C4) | 11 | 21 | 21/21 × all fields |
| `SPECIES-DATA-R4-CRYPTID-FOLKLORE.md` (C5+C6) | 9 | 18 | 18/18 × all fields |
| **Total** | **60** | **124** | **124/124** |

The audit is mechanical and was re-run by the coordinator on the finished
files: every sheet carries all 19 fields — Line/concept · Types · Category ·
(R3: Job) · Size class · Bio (Mochiioteca) · Temperament · Habitat · Diet &
behaviour · Evolution · Discovery · Cry (full spec) · Anatomy notes · Palette
seed · Footprint · Silhouette · Stat profile · DESIGN BRIEF · Flags. No
invented numbers anywhere: stat fields are profiles in words, levels are
bands in words, sizes are classes in words.

## 2. Two-lane coding — verification

- **Game lane:** `species-data-draft.json` — 124 entries parsed from the
  sheets and validated: 124 unique names, 60 concept ids, every entry carries
  the canon field set (`name`, `types`, `baseStats`, `hpStatus`,
  `abilities`, `hiddenAbility`, `eggGroups`, `catchRate`, `expYield`,
  `growthRate`, `dexText`, `provenance`, `notes`) plus the apparatus as
  additional properties. **Deliberate deviations, both by design:**
  `id: null` and all `baseStats` values `null` — roster numbers and stat
  numbers are assigned together at the owner's canon lock, never before.
- **Show lane:** the six markdown files above are the production record;
  §4 of this file is their index.

## 3. Collision verification — CLOSED

The species-brainstorm package left one open item: its collision check could
only verify 20 of 47 canon names (the rest sat behind the rate limit). The
coordinator re-ran it on 2026-10-27 against the **full live
`src/data/core/species.json`** (fetched via the API): **all 124 concept stage
names checked, zero collisions** with the canon 47. Animal-base sharings are
a separate axis and remain flagged per-sheet exactly as the source's §5
recorded them (see §5). The open item in the brainstorm package's landing
steps is discharged for names; its pre-merge animal-base review stands.

## 4. Show-lane index — the 60 concepts

Queue order is top-to-bottom: Region 2 designs first, then Region 3, then
Region 4 in bucket order (LANE.md §6, §10). "Flagged sheets" counts sheets in
the line carrying a ⚠/⚑ note beyond the standard stat flag.

| Concept | Region | Line (stages) | Final types | Sheets | Flagged sheets |
|---|---|---|---|---|---|
| A1 | R2 | Pupparmor → Shieldane → Bastihound | Beast/Chrome | 3 | 3 |
| A2 | R2 | Flickfin → Pikeperil → Halberdrake | Aqua/Chrome | 3 | — |
| A3 | R2 | Seedquire → Budguard → Verdilance | Flora/Beast | 3 | 3 |
| A4 | R2 | Ashimp → Embrute → Diablaze | Flame/Umbral | 3 | 3 |
| A5 | R2 | Polypup → Reefender → Atollossus | Aqua/Chrome | 3 | — |
| A6 | R2 | Tunnlet → Excavarm → Magmole | Terra/Chrome | 3 | 3 |
| A7 | R2 | Foldchick → Papercrane → Thouswings | Gale/Flora | 3 | 3 |
| A8 | R2 | Snowpup → Frosfang → Fenrirune | Frost/Beast | 3 | 3 |
| A9 | R2 | Lonelily → Pairbloom → Twinvow | Flora/Umbral | 3 | 3 |
| A10 | R2 | Noodlet → Ribbongler → Azulong | Aqua/Gale | 3 | 3 |
| B1 | R3 | Plowpus | Terra/Aqua | 1 | 1 |
| B2 | R3 | Sentripea | Flora | 1 | 1 |
| B3 | R3 | Cinderewe → Rainewe → Stormewe | Volt (the crossing is recorded in the source as Flame × Aqua → Volt) | 3 | 3 |
| B4 | R3 | Stackid | Terra | 1 | 1 |
| B5 | R3 | Pipworm → Ciderpent | Flora/Beast | 2 | 2 |
| B6 | R3 | Nudigger → Molerarch | Terra/Umbral | 2 | — |
| B7 | R3 | Spindevil | Beast | 1 | — |
| B8 | R3 | Faintail | Beast | 1 | — |
| B9 | R3 | Platemoll | Aqua/Chrome | 1 | — |
| B10 | R3 | Shagdox | Beast/Frost | 1 | 1 |
| B11 | R3 | Dustbunny | Umbral/Beast | 1 | 1 |
| C1-1 | R4 | Marblit → Popriffin | Gale/Beast | 2 | 1 |
| C1-2 | R4 | Whirligig → Cyclossus | Chrome/Beast | 2 | — |
| C1-3 | R4 | Packpup → Rigrex | Beast/Terra | 2 | — |
| C1-4 | R4 | Pilotto → Framoth | Gale/Flora | 2 | 1 |
| C1-5 | R4 | Shacklet → Restreint | Umbral/Chrome | 2 | — |
| C1-6 | R4 | Masklet → Sigilord | Beast/Chrome | 2 | — |
| C1-7 | R4 | Ratchetta → Coilcoon → Dingbat → Gestaltitan | Chrome/Volt | 4 | — |
| C2-1 | R4 | Capup → Chillbara | Aqua/Flora | 2 | — |
| C2-2 | R4 | Punchrimp → Rainbrawler | Aqua/Beast | 2 | 2 |
| C2-3 | R4 | Tunlet → Tardigreat | Beast | 2 | — |
| C2-4 | R4 | Tapaye → Ayeerie | Umbral/Beast | 2 | — |
| C2-5 | R4 | Fossle → Slashfoss | Beast | 2 | 2 |
| C2-6 | R4 | Okapup → Rainokapi | Flora | 2 | — |
| C2-7 | R4 | Casslet → Helmbeak | Beast/Gale | 2 | — |
| C2-8 | R4 | Kakapoof → Barrelboom | Flora/Gale | 2 | — |
| C2-9 | R4 | Wombit → Burrowbrick | Terra | 2 | — |
| C2-10 | R4 | Narwhit → Tuskicorn | Aqua/Frost | 2 | — |
| C2-11 | R4 | Vitrel → Clearibbit | Aqua/Flora | 2 | 2 |
| C2-12 | R4 | Velvlet → Slimelasso | Flora | 2 | — |
| C3-1 | R4 | Termight → Cathedrall | Terra/as marked in the source | 2 | — |
| C3-2 | R4 | Silvlet → Bookwyrm | Chrome | 2 | — |
| C3-3 | R4 | Stinklet → Perfumarch | Flora | 2 | — |
| C3-4 | R4 | Bomblet → Chemcannon | Flame/Chrome | 2 | 2 |
| C4-1 | R4 | Hopbrella | Gale/Umbral | 1 | — |
| C4-2 | R4 | Boltcloth → Wraproll | Gale | 2 | — |
| C4-3 | R4 | Boneling → Skelloss | Umbral | 2 | — |
| C4-4 | R4 | Nuelet → Chimerune | Umbral/Beast | 2 | 2 |
| C4-5 | R4 | Amabit → Prophescale | Aqua | 2 | — |
| C4-6 | R4 | Smoothsea → Monkalm | Aqua/Umbral | 2 | — |
| C4-7 | R4 | Barrelimp → Festivoni | Flame | 2 | 2 |
| C5-1 | R4 | Tsuchlet → Sakebelly | Terra | 2 | 2 |
| C5-2 | R4 | Mothlet → Omenmoth | Umbral/Gale | 2 | 2 |
| C5-3 | R4 | Spikid → Capraguard | Beast | 2 | — |
| C5-4 | R4 | Bunyiplet → Bunyawn | Aqua/Umbral | 2 | — |
| C6-1 | R4 | Pooklet → Pooknight | Umbral/Beast | 2 | — |
| C6-2 | R4 | Hatchlet → Gazewyrm | Venom | 2 | — |
| C6-3 | R4 | Hutlet → Wanderhut | Flora/Terra | 2 | 2 |
| C6-4 | R4 | Naggin → Dullaride | Umbral | 2 | 2 |
| C6-5 | R4 | Talitot → Hopshroud | Umbral | 2 | — |

## 5. Flagged owner-class gaps (the complete register)

Nothing below was filled silently; each item sits visibly flagged on the
sheets it belongs to.

1. **⚑ Stat numbers + roster ids — all 124 sheets.** By design (owner/
   game-design class). Sheets carry stat profiles in words.
2. **⚑ Type-vocabulary reconciliation.** The brainstorm's working labels
   **Gale, Terra, Frost, Volt, Venom** are not all in canon's type vocabulary
   (canon runs Aqua · Aero/Wind · Beast · Bug · Chrome · Core · Earth ·
   Flame · Flora · Mythic · Neon · Silk · Strike · Umbral · …). Recorded
   verbatim on every affected sheet; harmonising is a game-design decision.
3. **⚑ B3 temperaments (3 sheets).** The source gives Cinderewe, Rainewe and
   Stormewe no one-word temperament — the only Bucket B concepts without one.
   Flagged unassigned on all three sheets rather than invented.
4. **⚑ A9 roster representation (3 sheets).** The Twinvow line evolves by
   pairs (two Lonelily → one Pairbloom → one Twinvow); how that is
   represented in roster/data terms is a game-design decision, flagged, not
   invented.
5. **Decision, not a gap — Festivoni (C4-7).** Double-flagged on its sheets
   in full: Pokémon's Ogerpon holds the oni chair, and R3 holds the owner's
   Volcano Oni anchor. If the owner wants only one oni in the world,
   Festivoni is the flagged first cut.
6. **Carried ⚠ sharings (design-distance notes, owner's eye):** Plowpus/
   Psyduck · Stormewe line/Wooloo · Stackid/Skiddo-Gogoat · Pipworm line/
   Orthworm (no "unused" claim made) · Shagdox/Bouffalant · Dustbunny/rabbit
   family · Sentripea/Suezo proximity · Punchrimp line/Clauncher (pistol ≠
   mantis) · Slashfoss line/canon Kittember distance · Clearibbit/frog family
   · Framoth/moth family · Marblit/Litwick name proximity · Chemcannon/
   beetle family · Chimerune/Silvally (natural vs artificial) · Sakebelly
   line/Dunsparce (HARD flag — seed is the folklore traits Pokémon didn't
   use) · Omenmoth/moth family · Dullaride/Spectrier (rider, not horse) ·
   Wanderhut line (the hut only — its witch never named/used/carried).

## 6. Expansion disclosures (honesty record)

- **C4 evolution triggers (7 lines):** the seed text gives no explicit
  trigger for the Silvlet, Stinklet, Bomblet, Boneling, Nuelet, Amabit and
  Barrelimp lines. Their sheets' Evolution fields are expansions written
  strictly from each seed's own arc (no numbers invented). Sourced triggers
  (colony-formation, thankfulness-count, dome-gains-the-face, single-stage)
  are used exactly as given.
- **C2 stage-1 sheets:** the source's prose is final-stage-rich and
  stage-1-thin; stage-1 sheets were split/expanded from the line seeds
  without contradicting them.
- **B3 parent jobs:** Cinderewe's and Rainewe's Job fields are taken from
  their seed functions (kindling wool; personal raincloud) — only Stormewe's
  job is labelled in the source.
- **Apparatus modelling note:** the full-apparatus field set was modelled on
  the decomp species-data layout structure (personal/base-data + dex entry +
  footprint + cry + encounter tables). The pret clone directories recorded
  in project memory were not locatable on this VM during this pass and the
  pokeblack clone's species data is binary NARC-packed, so the layouts were
  applied from the structure itself, not re-read from clone sources. The
  canon-side shape (`species.json` + schema) WAS verified live from the
  repo, and the coded file mirrors it field-for-field.

## 7. Generation-fill roadmap (a plan sketch — sizes are planning ranges, not species)

Counting by canon's convention (every stage = one roster entry):

| Step | Adds | Running total |
|---|---|---|
| Canon roster (Region 1) | — | **47** |
| Wave 1 data completion (this package) | 124 stage entries | **171** |
| Transplant species castings (roster role map: 16 species candidates incl. owner-directed anchors Pantera + the Volcano Oni, whose sheets complete on the owner's call) | ≈ +18–22 | ≈ 190 |
| **Wave 2 brainstorm + data** under the relaxed base rule (LANE.md §7): used animals incl. the reinstated honey badger, inanimate-object creatures, robots/aliens/mechanical beings, further spirits/yokai/mythology/cryptids, ontology & religion registers — planned ≈ 55–65 concepts | ≈ +105–125 | **≈ 300–315 — the 300 line falls inside wave 2** |
| Region 5 full pass (Bucket D's 6 sketches expanded + the owner's-universe castings, when its season comes) | ≈ +20–30 | ≈ 330–345 |
| Generations beyond Region 5 (new regions, new tradition mixes, the owner's further ideas) | open | toward the long horizon |

**Long horizon (owner-set):** Pokémon's world currently holds 1,025 species.
The owner's stated ambition is that count **plus half again (≈ 1,540), maybe
double (≈ 2,050)** — total open. The roadmap does not schedule the horizon;
it keeps the lane's counting, law, and data discipline capable of reaching
it: every generation lands as complete data first, designs second, owner
locks third, in both lanes at once.

## 8. What happens next (proactive delivery, LANE.md §10)

1. Owner reviews this package's flags (§5) — the only review the *data*
   needs; creature verdicts belong to designs, not data.
2. Design production opens at the head of the queue: **Region 2, line by
   line** (A1 first), each batch delivered as images with its sheets and
   flags; owner verdicts and mix edits are written back before the next
   batch.
3. Region 3 follows; Region 4 after; anchors jump the queue on the owner's
   word.
