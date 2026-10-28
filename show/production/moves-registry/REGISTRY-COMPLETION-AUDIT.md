# Registry Completion Audit — Master Machine Registry (352 rows)

**Date:** 2026-10-27. **Audited file:** `machine-registry.json` — the phase-1
registry (PR #366) **as completed by the full rename pass** (rename-pass packet,
branch `feature/full-rename-pass-1`), plus the owner's same-day Draconian Talon
lock applied to that packet (see §6). This audit never worked from the older
phase-1 file alone.

**Rule of the audit (owner's law, applied without exception):** battle stats are
only ever **carried from source data** — never invented, never interpolated,
never harmonised across generations. A null that the source itself records is
data, not a gap.

**Sources checked (all in-repo tables, read from local copies):**

| Tag used below | In-repo source |
|---|---|
| gen5plus | `src/lib/generated/gen5plus/gen5plus_moves.json` (871 moves) |
| black2 | `src/lib/generated/decomp_black2_moves.json` (560 moves, Gen 5 decomp) |
| diamond | `src/lib/generated/decomp_diamond_moves.json` (470 moves, Gen 4 decomp) |
| crystal | `src/lib/generated/decomp_crystal_moves.json` (251 moves, Gen 2 decomp) |

**Method:** every registry row was re-derived field-by-field from the source
table its own `stats_source` declares (type/category vocabularies normalised:
`TYPE_GRASS`/`MOVE_CATEGORY_SPECIAL`/`physical` → one spelling). Every null
was then cross-checked against all four tables before being classified.

## Verdict

| Check | Result |
|---|---|
| Rows audited | 352 / 352 |
| `mochiichao_name` present | **352 / 352** (17 owner-locked, 335 delegated) |
| Class present (general / rare) | **352 / 352** — 341 General, 11 Rare, 0 classless |
| `stats_source` provenance tag present | **352 / 352** |
| Declared source actually contains the move | 352 / 352 |
| Non-null stat values matching their declared source | **1,572 / 1,572 — 0 mismatches** |
| Transcription gaps (registry null, declared source has a value) | **0** |
| Rows missing stats that exist in any in-repo source | **0 — the MISSING list is empty** |
| Registry values changed by this audit | **None** |

## 1. Names

All 352 rows carry a Mochiichao name from the full rename pass (verified again
here against the pass's own check suite: 928-name Pokémon blocklist, 0
collisions; 0 internal duplicates; 0 collisions with live-table or island names
of different moves). Status split after the owner's Draconian Talon lock
(§6): **17 locked / 335 delegated**.

## 2. Class

341 General Moves, 11 Rare Moves (Slice, Mist Clear, Deep Dive, Illuminate,
Ascend, Crag Climb, Boulder Break, Mighty Push, Wave, Cascade, Vortex). No row
lacks a class, so no "none-with-reason" rows exist — by the registry's scope,
never-machine moves do not occur in it. The seven dual-history rows carry the
rare-wins `class_note` (Dive, Flash, Fly, Rock Smash, Surf, Waterfall,
Whirlpool): each was an HM in at least one generation, and the later TM
listings in their history do not change their class.

## 3. Battle stats — presence

`type`, `category`, and `pp` are present on **352 / 352** rows. `power` is
present on 240 rows and null on 112; `accuracy` is present on 276 rows and
null on 76 (66 rows have both null). **Every one of those 188 nulls is
recorded as null by the row's own declared source** — they classify as:

### 3a. Status moves have no power — 91 rows
A Status-category move has no power value in the source data model (PokeAPI /
gen5plus record `power: null`). This is the single largest null class and it
is complete as-is: there is no power figure anywhere in any in-repo table for
these moves to carry.

### 3b. Damaging moves with variable or fixed damage — 21 rows
Physical/Special moves whose power is not a fixed number in the source data:
**Beat Up, Bide, Counter, Dragon Rage, Electro Ball, Endeavor, Fissure,
Fling, Grass Knot, Gyro Ball, Heat Crash, Heavy Slam, Horn Drill, Low Kick,
Natural Gift, Night Shade, Psywave, Reversal, Seismic Toss, Sheer Cold,
Super Fang.** The decomp tables confirm the semantics with sentinel values
(black2/diamond record power `1` for most of these — the decomp encoding for
"no fixed power"). Three of the 21 also carry an older-generation numeric
reading, which is a generational difference, not a gap: Beat Up (power 10 in
crystal/diamond, variable from Gen 5), Dragon Rage (40 in crystal — its fixed
40 HP damage read as power), Low Kick (50 in crystal — fixed power in Gen 2,
weight-based from Gen 3).

### 3c. Accuracy null — 76 rows
66 of these are the self-/field-target Status moves of §3a (a move that
targets the user or the field has no accuracy check; gen5plus records null,
the decomp tables record their never-miss sentinels — black2 `101`,
diamond `0`). The remaining **10 are sure-hit attacking moves**: Aerial Ace,
Aura Sphere, Bide, Disarming Voice, Magical Leaf, Magnet Bomb, Shadow Punch,
Shock Wave, Smart Strike, Swift — never-miss by design in the modern data.
Two further rows are a documented generational change, not a gap: **Roar**
and **Whirlwind** record accuracy 100 in the Gen 2–5 tables and null in
gen5plus, because from Gen 6 they bypass accuracy checks entirely; the
registry follows its declared modern source. (Crystal, a Gen 2 table, also
records numeric accuracies for a handful of self-target moves — 100, and 90
for Rain Dance / Sunny Day — where the newer tables record never-miss
sentinels or null. Generational encoding, noted here, changed nowhere.)

**`stats_status: MISSING` — the explicit list the brief asked for: no rows.**
After checking all four in-repo tables, there is not one row missing a stat
that a source exists for. Nothing was filled, because there was nothing to
fill; nothing in this registry's stats is invented or interpolated.

## 4. Provenance — verification and caveats

Declared provenance across the 352 rows: **gen5plus 341 rows, black2 10
rows, PokeAPI fetch 1 row**. All 352 declarations verified true (the declared
table contains the move, and every non-null value matches it exactly).

- **The 10 black2-sourced rows** (Blast Burn, Blaze Kick, Draco Meteor, Egg
  Bomb, Frenzy Plant, Frustration, Hydro Cannon, Metronome, Return,
  Waterfall) are absent from the in-repo gen5plus extract, so their stats are
  carried from the Black 2 decomp — which means they are **Generation 5
  values**. Most visibly: Draco Meteor carries power **140** (the Gen 5
  figure; the modern games use 130). This is declared in each row's
  `stats_source` and is faithful to that source; the audit flags it only so
  the owner knows the registry mixes one generation's figures in these 10
  rows. Harmonising them to modern values would require a source the repo
  does not hold for these moves, so they were **not** changed.
- Three black2-sourced rows carry decomp sentinel values literally, exactly
  as their declared source records them: Metronome (power `0`, accuracy
  `101` — the decomp encoding for a no-power, never-miss move), Return and
  Frustration (power `1` — variable, friendship-based). Documented here; not
  rewritten, because rewriting them would break fidelity to the declared
  source.
- **Soft Boiled** is the one row whose stats rest on a fetched PokeAPI record
  rather than an in-repo table: the move is absent from the local gen5plus
  extract and from black2's table as a stat row, and its registry values
  (Status, power null, accuracy null, PP 5) are consistent with the
  never-miss/self-target pattern the decomp tables show for it (black2
  accuracy `101`, diamond `0`, crystal `100`). Its `stats_source` declares
  the fetch honestly. It is the only row this audit could not re-verify
  end-to-end from in-repo tables.

## 5. Known minor gaps (not stats)

- **10 rows have no `pokeapi_move_id`** — the same black2-sourced set in §4.
  No in-repo source available locally carries PokeAPI move ids for them (the
  phase-1 machine records hold item/move-slug/version-group only). Under the
  carry-only rule the ids were **not** filled from memory. This is an
  identifier gap only; it affects no name, class, or battle stat.
- The phase-1 generation-coverage caveats stand as recorded in the
  registry's own `data_quality_notes` (BDSP machine records partial in
  PokeAPI; Legends Z-A numbering PokeAPI-only; Gen 8 TR records out of
  scope). This audit did not expand generation coverage.

## 6. Owner fix applied to the audited packet (not an audit change)

After the rename pass completed and before anything was pushed, the owner
locked **Dragon Claw → Draconian Talon** himself, superseding the pass's
delegated "Draco Talon". Applied to the rename-pass packet: the registry
row now reads `mochiichao_name: "Draconian Talon"`, `rename.status:
"locked"` (the registry's encoding for owner-locked — see the name map's
status key), moving the split from 16/336 to **17 locked / 335 delegated**;
the name map's Dragon table and follow-up live-batch list carry the locked
name with the superseded proposal kept visible; the production-log entry
gained a same-day postscript in the same pattern as the Tackle→Blitz lock;
`names.py` and the push notes were updated to match. The rename pass's check
suite was re-run after the fix: 352/352 named, 0 blocklist collisions
("Draconian Talon" is not an existing Pokémon move name), 0 duplicates.
**Draco Tail** (Dragon Tail, island) is a different move and is untouched.
The worksheet's batch-1 draft row still shows the historical draft "Draco
Talon" under its SUPERSEDED header; a correction note was added to that
header pointing at the locked name.
