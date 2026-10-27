# Master Machine Registry — General Moves / Rare Moves

**Programme:** the Full Machine-Set Import Programme (owner-directed, 2026-10-27) — the complete
multi-generation TM/HM move sets and their move animations, pulled from the games and modern public
communities wherever publicly available, as the reference library from which show moves and show
move-animations are built.

**Canon naming (owner-locked, 2026-10-27):** the TM-equivalent class is **General Moves** and the
HM-equivalent class is **Rare Moves**. "TM"/"HM" appear in this registry only as the source-system
correspondence. Acquisition stays Pokemon-like: General Moves are obtained by searching and
fighting through the world; Rare Moves are the scarce class and may also arrive pre-known on a
creature or through alternate acquisition routes (the owner's comparison: how Pokemon GO hands
them out).

**Class rule — RARE WINS (owner-locked, 2026-10-27):** a move that was an HM in ANY generation is a
Rare Move, even where later generations list it as a TM (Rock Smash, Flash; the Gen-9 TM listings of
Fly / Surf / Waterfall stay Rare). TM-only in every generation = General Move. Moves that were never
machines carry no machine class (none occur in this registry by construction — it holds machine
moves only). Every row keeps its full per-generation TM/HM history regardless of class.

## Contents of this folder

| File | What it is |
|---|---|
| `machine-registry.json` | The registry itself — one row per unique move that has ever been a TM/HM in any generation 1–9: source name, per-generation machine numbers (with the version groups carrying them), type/category/power/accuracy/PP (+ which table they came from), class (general/rare), mapping to our playable moves where one exists, animation-source status, anatomy-variance field, rename status. |
| `INDEX.md` | This file — readable index, computed counts, doctrine, reconciliation, Bible hook. |
| `ANIMATION-SOURCE-CATALOGUE.md` | Survey of public move-animation sources with licence/provenance classes and pull-in verdicts. |
| `RENAME-WORKSHEET-BATCH-1.md` | Drafted near-synonym Mochiichao names, batch 1 — **DRAFT, owner approval pending; nothing in it is applied.** |

## Registry counts (computed from `machine-registry.json`, never hand-typed)

- **Unique machine moves (rows): 352**
- **General Moves (TM-origin only): 341** · **Rare Moves (HM in at least one generation): 11**
- Rare Moves, complete list: Cut, Defog, Dive, Flash, Fly, Rock Climb, Rock Smash, Strength, Surf, Waterfall, Whirlpool.
- **Rare-wins precedence applied to 7 rows** that carry both HM and TM history.
- Rows mapped onto our playable set (`src/data/core/moves.json`): **13 of our 36** —
  18 of our 36 correspond to a source move at all (17 by direct name, plus Earth Tremor → Earthquake);
  of those, 13 are machine moves in this registry and 5 (Aqua Jet, Razor Leaf, Shadow Pulse,
  Tackle, Quick Attack) were never machines. Cross-check against the audit of record: 10 of ours were
  TMs in Generations 1–5; Earth Power and Crunch join as Generation-9 TMs (SV TM133 / TM108) and
  Night Slash via the Legends Z-A set (TM34).
- Stats provenance: 341 rows from the in-repo gen5plus table, 10 from the in-repo Black 2 decomp
  table, 1 (Soft-Boiled) fetched live from PokeAPI because no in-repo table carries it.
- Animation-source status: 285 of 352 rows are covered by the in-repo Black 2 move table
  (animation reference build pending); the rest are covered by catalogued sources only — see the
  Animation Source Catalogue.

### Machine slots per generation (computed from the fetched machine records)

| Gen | Games (reference set) | TM | HM | Slots |
|---|---|---|---|---|
| 1 | Red/Blue/Yellow | 50 | 5 | 55 |
| 2 | Gold/Silver/Crystal | 50 | 7 | 57 |
| 3 | Ruby/Sapphire/Emerald + FireRed/LeafGreen | 50 | 8 | 58 |
| 4 | Diamond/Pearl/Platinum + HeartGold/SoulSilver | 92 | 8 | 100 |
| 5 | Black/White + Black 2/White 2 | 95 | 6 | 101 |
| 6 | X/Y | 100 | 5 | 105 |
| 6 | Omega Ruby/Alpha Sapphire | 100 | 7 | 107 |
| 7 | Sun/Moon + Ultra Sun/Ultra Moon | 100 | 0 | 100 |
| 7 | Let's Go Pikachu/Eevee | 60 | 0 | 60 |
| 8 | Sword/Shield | 100 | 0 | 100 |
| 9 | Scarlet/Violet + DLC | 229 | 0 | 229 |
| 9 | Legends Z-A + Mega Dimension DLC (extension set) | 107 | 0 | 107 |

Unique registry moves present per generation: Gen 1: 55, Gen 2: 57, Gen 3: 58, Gen 4: 101, Gen 5: 101, Gen 6: 107, Gen 7: 121, Gen 8: 112, Gen 9: 269.
Notes on the table: Gen 4's two game sets share one numbering, but the generation's union holds one
extra move — Defog is an HM only in Diamond/Pearl/Platinum and Whirlpool only in
HeartGold/SoulSilver (both recorded per-row with their version groups). Gen 5's Black/White and
Black 2/White 2 lists are identical in the fetched records. Gen 8's Sword/Shield line also carries
100 TR (Technical Record) records in the source data — a distinct machine class, counted here and
excluded from this registry by scope. Generation 9's second line is the Legends Z-A extension set:
19 registry rows exist solely because of it; its numbering rests on PokeAPI records
alone for now (flagged in the JSON's data-quality notes).

## Reconciliation of the owner-supplied lists

The owner supplied two lists as programme input; both were diffed slot-by-slot against the fetched
machine data (PokeAPI records, BSD-3-Clause), and the contested slots were independently corroborated
against Serebii/Game8 listings on 2026-10-27.

- **Black 2 / White 2 (95 TM + 6 HM = 101): 101 owner slots vs 101
  source slots — 101 reconciled cleanly, 0 discrepancies.**
  Cross-check: the in-repo Black 2 decomp item table (`decomp_black2_items.json`) contains exactly
  101 TM/HM-named items (95 TM + 6 HM). The owner's B2/W2 list is exact.
- **Scarlet / Violet + DLC (229 TM, 0 HM): 229 owner slots vs 229
  source slots — 227 reconciled cleanly, 2 discrepancies:**
  TM106 — owner list says Acrobatics; the games carry **Drill Run**. TM116 — owner list says Energy
  Ball; the games carry **Stealth Rock**. These two errors explain the owner list's only internal
  duplicates (Acrobatics appears at TM014 and TM106; Energy Ball at TM116 and TM119): TM014 Acrobatics
  and TM119 Energy Ball are both correct as listed. The registry follows the games' data; the
  discrepancies are logged here, not silently corrected in the owner's list.

## Doctrine

### The import programme (owner's terms)

Add the complete TM/HM move sets from across the generations, plus their move animations, sourced
from the games and modern public communities wherever publicly available, into the game, the
universe, and canon — as the reference library from which show moves and show move-animations are
built. Donor material enters under the construction-kit rule: systems, data tables, techniques and
reference — display names get Mochiichao names under the synonym-rename rule (coolest near-synonym,
meaning preserved, for names built from literal noun words or natural-disaster terms; the owner
approves final picks from drafted batches; internal ids/keys stay stable). Community animation
material is catalogued as reference with provenance, never silently relicensed.

### Anatomy-variance doctrine (owner's terms)

Moves are interchangeable between creatures, but a move's ANIMATION depends on the performer's
anatomy — shape, size, build, and mythical/legendary class. One creature's performance of a move is
never the universal animation. Every registry row therefore carries an `anatomy_variance` field;
this phase seeds it with a category-based template (performer-led for physical moves, emitter-led
for special moves, body-language-led for status moves) marked `template — per-species variance
logging pending`. Per-species performance logs are written into that field as show production
reaches each move, and the same variance is what the show Bible and the game wiring must honour.

### Two-lane canon (owner-locked, 2026-10-27)

- **The SHOW lane follows the Pokemon ANIME:** moves are skill — learned through training, practice,
  observation, and tutors. Rare Moves arrive known or are innate capability. Machine discs are NOT
  routine on screen; an Origins-style physical machine is at most a rare story object.
- **The GAME lane follows the Pokemon GAMES:** the General Moves / Rare Moves machine system —
  found and fought through the world.
- Each lane follows its own medium's canon. The registry serves both: it is the game's machine
  ledger and the show's move/animation reference library.

## Show Bible hook

This registry is where episode production comes for moves: which moves exist, what class they are,
what they do numerically, what their game animations looked like (via the Animation Source
Catalogue), what their drafted/locked Mochiichao names are, and what anatomy variance a performance
must respect. It plugs into the show Bible as the moves/animations reference for episode production;
the Bible itself is not restructured in this phase.

Bible-side conventions recorded with this hook (from the completed Pokemon-anime study,
episode-sourced):

- **Move-count convention:** the anime never enforces a four-move limit. A creature knows
  everything it has ever learned, fields roughly four active moves per battle, and old moves
  silently retire without any forgetting scene. Champions rotate from a deep pool — Leon's Charizard
  fields 12+ known moves. Show scripts follow this convention: repertoire is deep, battle loadout is
  a choice, retirement is silent.
- **Rare Move precedent (a) — field capability as body + job:** Ride Pokemon and their kin treat the
  capability as what the creature IS and DOES, not as a gated technique; obstacles on screen are
  solved by other moves, tools, or ingenuity — never a hard gate.
- **Rare Move precedent (b) — prestige techniques:** the special systems gate their techniques like
  honours — Z-Moves demand crystal + bond + trial and exhaust the user; Horizons' Terastallization
  is a school-taught, EXAMINED course. Such techniques sit OUTSIDE the ordinary repertoire. Rare
  Moves written at prestige weight follow this precedent; routine Rare Moves follow precedent (a).

## Animation sources — summary

Full survey: `ANIMATION-SOURCE-CATALOGUE.md`. Headline findings: there is no clean, pullable
move-animation library in asset form anywhere surveyed. What is pullable is metadata (PokeAPI —
BSD-3-Clause, PULLED for this registry: 2,372 machine records fetched 2026-10-27 and embodied in
`machine-registry.json`; Pokemon Showdown server tables — MIT, pullable next phase). Animation
choreography ground truth (pret decompilations, fuddlesworth/pokebw2, Bulbagarden Archives captures,
Spriters Resource sheets) is community-extracted game data: REFERENCE-ONLY, forever, unless a
specific written permission changes it. The Showdown client's per-move animation code is AGPL-3.0 —
reference-only unless its README's MIT relicence offer is obtained in writing. Our move animations
will be original builds (rig performance + original FX) informed by those references, with the
reference source logged per move.

## Known gaps (honest list)

- Brilliant Diamond / Shining Pearl machine records in PokeAPI are partial (17 TM/HM records);
  Gen-8 history leans on Sword/Shield. BDSP numbering is a gap, not filled by assumption.
- Legends Z-A / Mega Dimension numbering rests on PokeAPI records alone (no owner-supplied or
  second source yet); flagged in the registry's data-quality notes.
- pret Gen 4–5 battle-animation completeness is UNVERIFIED (catalogue §1–2); Spriters Resource
  sheet-level inventory was not enumerated (§5); Showdown client per-move coverage (bespoke vs
  fallback) is uncounted (§4).
- The registry holds machine moves only. Level-up/tutor moves (including three of the owner's six
  locked signature correspondences — Aqua Jet, Razor Leaf, Shadow Pulse) live in the move data and
  canon docs, not here; a unified all-moves registry is a later phase.
- Rename status: 1 registry row carries an owner-locked name (Earthquake → **Tremor**). Batch 1
  drafts cover 40 further moves (worksheet in this folder). All other rows are `pending` — drafted
  in later batches for owner approval, never applied silently.
