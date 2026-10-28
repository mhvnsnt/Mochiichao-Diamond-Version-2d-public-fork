# Gap audit — Gen 1 (49 species × 8 elements)

Generated 2026-10-27 from the live repo (see AUDIT-WHAT-EXISTS.md for the
apparatus this audits, source-manifest.json for provenance). Machine-readable
version: `gap-audit.json`. Every "present/partial" claim in this audit was
re-verified against the live repo by `validate_gap_audit.py` — **343/343
checks pass** (`validate-output.txt`).

**Scope:** the Gen 1 working roster = **49 species** — the 47 in
`src/data/core/species.json` plus Dorowani and Gabu, who have designs,
footprints, silhouettes, cries and dex entries but no core record.
Strikechamp's `unsuited` / `unsuited_full` variants are forms (own footprint,
silhouette, idle assets), not species.

## Counts per element (of 49)

| Element | Present | Partial | Missing |
|---|---:|---:|---:|
| bio_short (dex entry line) | 12 | 0 | **37** |
| bio_long | 0 | 0 | **49** |
| footprint (asset + manifest spec) | **49** | 0 | 0 |
| silhouette (discovery) | **49** | 0 | 0 |
| discovery (states/media + habitat) | 0 | **49** | 0 |
| cry (V1 + R1) | **49** | 0 | 0 |
| type / design description | 47 | 2 | 0 |
| body data (plan / height / weight) | 0 | 6 | **43** |

Reading of the table: the *media* half of the Mochiioteca is complete —
footprints, silhouettes and cries are 49/49 and wired into the dex. The
*written* half is the gap: short bios 12/49, long bios 0/49, body data
essentially unrecorded, and discovery habitat data still at seed level
(encounters seed covers 13 species on 3 maps; the discovery *states* and
media rules are fully built for all 49, which is why discovery reads
"partial" across the board rather than missing).

## Canon conflicts found

1. **Dorowani + Gabu are missing from the core data.** They are pilot-cast,
   show-lead species with assets in every layer (dex ids 147/148, footprints
   PR #237, silhouettes PR #175, cries PR #193, idle/garden/title/show
   bundles) but have **no record in `species.json` or `global_roster.json`**.
   `show/shared/cast.json` even states "Full roster source of truth stays in
   species.json (47 species)" while its own principal cast includes both.
   → Filled in `gap-fills/dorowani-gabu-core-records.json` (owed fields in
   the core's own null/flag conventions; base stats NOT invented).
2. **Three numbering schemes are live at once.** Roster raw ids run
   001–046 then `331` (Mythar). `species.json` repairs Mythar to `047`.
   The dex registry keeps `331` for Mythar *and* adds `147`/`148` for
   Dorowani/Gabu. DexView therefore displays different numbers than the
   data core for the same species. Owner decision owed: which registry is
   canonical for numbering (the intake template gates on this).
3. **Pebblefist HP disagrees between the two core sources, today.**
   `global_roster.json` on main now reads hp **40** (and parses as valid
   JSON; the invalid-JSON state the data-core README describes has since
   been repaired). `species.json` still carries hp **null** with
   `hpStatus: pending-decision … never guessed`. One of the two is stale;
   the core README's rule ("roster wins") would make it 40, but the
   pending-decision flag says the owner never ruled. Flagged, not decided
   here.
4. **Abilities/eggGroups are 0/47 in the core** (fields exist, values owed)
   while learnsets exist for 47/47 with 35 flagged provisional — a reader of
   `species.json` alone would think abilities don't exist as a system.
   Documented in the core README; registered here so the design lane
   doesn't re-discover it.
5. **Stale note in the silhouette manifest.** `SILHOUETTE-MANIFEST.json`'s
   `_purpose` still says actual footprints are "still to be made" — they
   were made (PR #237) in `footprints-real/`. The FOOTPRINT-MANIFEST `_meta`
   carries the correction; the silhouette manifest was never updated.
6. **Type vocabulary split (known, undecided):** `species.ts` uses
   Pokémon-style type names while the roster/core use Mochiichao elements
   (Aqua/Flora/Chrome…). The data-core README records this as an open
   decision; the core keeps roster elements. Noted here because the intake
   template must use the element vocabulary.
7. **The "~60 confirmed species" figure does not match the repo.**
   `NEW-SPECIES-IDEAS.md`'s own header: "The canon roster is 47 species;
   nothing in this file adds to it." The 60 are brainstorm concepts (plus 2
   owner anchors + 6 register sketches) with no sheets and no assets.
   Confirmed species *with designs* = 49. If a further confirmed set exists
   in the side lane's unmerged work, it is not visible in the repo or the
   workspace staging as of this audit.

## What was filled (only missing elements — nothing existing was touched)

- `gap-fills/dorowani-gabu-core-records.json` — core-format records for the
  two species absent from `species.json`, canon fields filled (ids from the
  dex registry; types signature-derived and flagged for owner confirmation),
  everything else in the core's owed-field conventions.
- `gap-fills/body-and-discovery-fills.json` — per-species: the footprint
  *spec* carried from the lane's manifest into record form; `body_plan`
  canon for the pilot six, derived-and-marked for the rest from the lane's
  own footprint anatomy + roster design tags; habitat where the encounters
  seed gives it, TBD elsewhere; rarity basis from catchRate where present.
  Height/weight/category: **TBD for all 49** — recorded nowhere, and not
  invented here.

Everything not filled is in `TBD-REGISTER.md` with its owner/lane owner.

## Per-species matrix

Legend: ● present · ◐ partial · ○ missing. Sources per cell are in
`gap-audit.json`.

| # | Species | bio short | bio long | footprint | silhouette | discovery | cry | type/desc | body |
|---|---|---|---|---|---|---|---|---|---|
| 001 | Mochii | ● | ○ | ● | ● | ◐ | ● | ● | ◐ |
| 002 | Tiidebiite | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 003 | AquariiOS | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 004 | Razorgater | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 005 | Chromejaww | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 006 | Reaperdile | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 007 | Tyrage | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 008 | Duneclaw | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 009 | Oblivirex | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 010 | Kittember | ● | ○ | ● | ● | ◐ | ● | ● | ◐ |
| 011 | Pyropaw | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 012 | Manticlaw | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 013 | Pupbble | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 014 | Terradog | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 015 | Quakehound | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 016 | Squirmite | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 017 | Cocoonode | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 018 | Mothrix | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 019 | Zephling | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 020 | Aerobeak | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 021 | Stormtalon | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 022 | Finblade | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 023 | Megalochrome | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 024 | Floatcalf | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 025 | Astroleviathan | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 026 | Inklet | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 027 | Toxitacle | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 028 | Krakenox | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 029 | Punchkid | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 030 | Strikechamp | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 031 | Kickmaster | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 032 | Gearkid | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 033 | Mechapion | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 034 | Gorokappa | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 035 | Pebblefist | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 036 | Cragarm | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 037 | Terrapod | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 038 | Sproutle | ● | ○ | ● | ● | ◐ | ● | ● | ◐ |
| 039 | Shellguard | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 040 | Dreadtoise | ● | ○ | ● | ● | ◐ | ● | ● | ○ |
| 041 | Pixilite | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 042 | Wispkin | ○ | ○ | ● | ● | ◐ | ● | ● | ◐ |
| 043 | Duskfiend | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 044 | Ashemit | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 045 | Pyromonk | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 046 | Yogiferno | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 047 | Mythar | ○ | ○ | ● | ● | ◐ | ● | ● | ○ |
| 147 | Dorowani | ○ | ○ | ● | ● | ◐ | ● | ◐ | ◐ |
| 148 | Gabu | ○ | ○ | ● | ● | ◐ | ● | ◐ | ◐ |

Dorowani (147) and Gabu (148) carry dex-registry numbers; they have no core id (Conflict 1). Mythar is core 047 / dex 331 (Conflict 2).

**Coverage read (List 18 #171, landing 2026-10-27, beside item 4):** eggGroups are assigned for 0/47 species; 0 breeding pairs are evaluable today. The FORMAT lands (171-BREEDING-COMPATIBILITY.md); assignments are species-data work under its V1-V5 checks — none was invented at landing, and the Dorowani/Gabu core-record gap closes first for those two species.
