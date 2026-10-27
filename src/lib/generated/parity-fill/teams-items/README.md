# Pokemon-parity fill slice 3 — TRAINER TEAMS (fixed default) + ITEMS/SHOP/CAPTURE/SAVE

Date: 2026-10-26. Status: **STAGED ONLY — not committed, not pushed, no PR.**
Authority: Mars locked 2026-10-26 12:34–12:37 CDT (fixed teams by DEFAULT; randomized
teams are a settings option only, NO per-draw lock) and ordered 2026-10-26 ~13:07 CDT
(bring Pokemon systems straight over, swapping only literal Pokemon things to Mochiichao
words). Cowboy revised party is LOCKED and was NOT varied (per task + COWBOY-PARTY-REVISED).

## Files in this slice

| File | Contents |
|---|---|
| `fixed-teams.json` | Fixed-default team tables: Jax ×3, Falk, Lin, Cowboy (species-locked), 10 carry-over in-code teams |
| `randomized-mode.json` | Settings-toggle shape for randomized mode: seed, Jax pool, 8 rules, fallback, example draws |
| `items-shop-capture-save.json` | Bag pockets, shop buy/sell shape + prices, Luigi Cubes + Capture Capsules, save shape + heal point |
| `README.md` | This file: decomp source → Mochiichao replacement → HAVE / NEED TO MAKE, with counts |

## Decomp source → Mochiichao replacement → HAVE / NEED TO MAKE

| Pokemon element (decomp source) | Mochiichao replacement in that exact spot | HAVE / NEED TO MAKE |
|---|---|---|
| Trainer party table: ordered `{species, level, items, moves, AI flags}` per trainer (FireRed `trainers.h`/`trainer_parties.h`; HeartGold 738 trainers / 1,776 members; Black 2 814 / 1,808, both 0 unresolved) | Same shape: ordered party, speciesId + level per slot, moves + heldItem slots (null = unfilled, never invented) | HAVE as staged tables (see counts below); NEED TO MAKE: wiring into game code (no code changed in this slice) |
| Rival: multiple fixed entries, one per story point, evolved mainstays carried forward | Jax first/mid/last fixed entries, mainstays Wispkin→Duskfiend, Razorgater→Chromejaww→Reaperdile | HAVE: 3/3 Jax fight points staged (100%) |
| Gym leader fixed team + badge + reward | Falk (Wind Fragment, 1500 CR), Lin (Core Fragment, 1500 CR) | HAVE: 2/2 staged; NEED: Falk moves, Lin ID-table resolution (see blockers) |
| Facility pool-drawn teams (Battle Tower/Frontier precedent) | Randomized mode: seeded per-save draw from a locked theme pool, mainstays fixed | HAVE as shape only (randomized-mode.json); NEED TO MAKE: code, settings field, stored resolved teams |
| Bag pockets (Items / Medicine / Poke Balls / TMs & HMs / Berries / Key Items) | Capture / Medicine / Storage / Other (in-code BagView pockets) | HAVE: pocket grouping in code; NEED: 'Other'-as-fallback ruling, TM/HM + key-item pocket decisions |
| Shop: Buy / Sell / Quit first, confirm before money, sell = half buy price | Same flow in ShopView, CR as money | HAVE: flow + 4/5 priced items; NEED: Capture Capsule price (Mars-only) |
| Lab gift: Pokedex, then 5 Poke Balls, then catching explanation | Lab beat: Dex gift, then 5 Luigi Cubes, then Aeon explains Capture Capsules but withholds them | HAVE: Luigi Cube gift +5 in code; NEED: capsule price/rate/variants (all PLACEHOLDER) |
| Save: player, party (max 6), box, money, bag, badges, Dex, flags, location | Same slots, Mochiichao field names (see items file) | HAVE: 11/14 fields (79%); NEED: healPoint, settings.teamMode, resolvedTeams (3/14, 21%) |
| Center/Mom heal (full HP + status clear) | Mom (Sector 0) + MochiiPlex Center Nurse, shared healParty action | HAVE: 2 heal NPCs in code; NEED: heal points for other towns, saved healPoint field, respawn rule (not invented) |

## Counts with percentages (per the standing percentage rule)

### Trainer teams — scope denominator: 37 named story-team slots
Jax 3 + Falk 1 + Lin 1 + Cowboy 1 + carry-over 10 + Dojo 3–7 (5) + Elite Four (4)
+ Champion (1) + Syndicate admins (10) + Dojo 8 (1) = 37.

- Fully specified (species + level): 15/37 = **41%** (Jax 3, Falk 1, Lin 1, carry-over 10)
- Species-specified, levels open: 1/37 = 3% (Cowboy) → cumulative species-known 16/37 = **43%**
- Open (no team staged, per task): 21/37 = **57%** (Dojo 3–7, Elite Four, Champion, admins, Dojo 8)
- Staged teams with moves: 11/16 = **69%** (carry-over 10 + Lin 1); moves open: 5/16 = **31%** (Jax 3, Falk 1, Cowboy 1)
- Staged slots: 33 total (fixed-default 17 + Cowboy 6 + carry-over 10)

### Items / shop / capture / save
- Shop rows with prices: 4/5 = **80%** (Luigi Cube 250 CR, Mend Patch 150 CR, Revive Core 500 CR, Data Card 300 CR); PLACEHOLDER: 1/5 = **20%** (Capture Capsule)
- Capture devices fully defined: 1/2 = **50%** (Luigi Cube); Capture Capsule attributes defined: 0/3 = **0%** (price, rate, variants all Mars-only)
- Save fields HAVE: 11/14 = **79%**; NEED TO MAKE: 3/14 = **21%**
- Bag pockets in code: 4 (Capture, Medicine, Storage, Other-fallback)

## Teams proposed (show-first list — the fixed default)

1. **Jax, first fight** (3, Lv13–15): Wispkin Lv14, Razorgater Lv15, Inklet Lv13.
2. **Jax, mid fight** (4, Lv29–31): Duskfiend Lv30, Chromejaww Lv31, Toxitacle Lv29, Mechapion Lv30.
3. **Jax, last fight** (6, Lv44–47): Duskfiend Lv46, Reaperdile Lv47, Oblivirex Lv45, Krakenox Lv44, Gorokappa Lv46, Terrapod Lv47.
   - These are the proposal's A variants promoted to the fixed default; B variants are kept
     in `randomized-mode.json` as illustrative draws, not discarded.
4. **Master Falk, Dojo 2** (3, Lv18–20): Zephling Lv18, Aerobeak Lv19, Stormtalon Lv20 — LOCKED, reward 1500, Wind Fragment.
5. **Master Lin, Dojo 1** (1, Lv14): Dreadtoise Lv14 (moves: Iron Defense, Tackle, Shell Smash, Rock Slide) — reward 1500, Core Fragment.
6. **Cowboy Kid** (6, levels OPEN): Pupbble→Terradog mid-fight (slot 1), Floatcalf, Sproutle, Quakehound, Dreadtoise, AquariiOS — species LOCKED, never varied.
7. **Carry-over, unchanged from code** (10 singletons): Hex Razorgater Lv5; Youngster Jay Sproutle Lv5; Lass Amy Mochii Lv4; Hiker Dan Tyrage Lv6; Bug Catcher Rick Squirmite Lv3; Acolytes Ken Tyrage Lv8, Ren Razorgater Lv9, Shin Mochii Lv10, Ryu Sproutle Lv11; Hacker Grunt Kittember Lv12.

## Deliberately NOT staged (open slots, no invention)

Dojo 3–7 teams (lane data exists but names/dialogue are Mars-only and the task forbids
inventing these teams); Elite Four (4); Champion (Hex vs Mythar conflict unresolved);
Syndicate admins (10; structure/names/themes Mars-only); Dojo 8 (Candidate A single
Oblivirex Lv48 vs Candidate B Final Fragment team 046/003/002/028 — two candidates only,
no third team invented); Mysterious Figure-form (Luigi pool) teams; any Jax fight beyond
first/mid/last; Hacker grunt pools beyond the one Kittember grunt carried over.

## Mars-only blockers left open

1. **Falk Stormtalon Lv20 vs roster threshold** — global_roster.json says Aerobeak→Stormtalon
   at Lv34, so a Lv20 Stormtalon cannot come from level evolution. Mars call: roster
   threshold, team level, or evolution method. The team is staged exactly as locked; nothing
   was altered to hide this.
2. **Falk same-line team** — Zephling/Aerobeak/Stormtalon are three stages of one line in
   one team, an explicit exception to the no-same-line-doubles rule. Kept as locked; do not
   "fix" without Mars saying so.
3. **Lin ID collision** — code says 039 = Dreadtoise (species.ts); roster says 039 =
   Shellguard, 040 = Dreadtoise. Wiring must pick the authoritative ID table.
4. **Bug Catcher Rick ID** — code id "004" named Squirmite; 004 = Razorgater in the roster
   and Squirmite has no 47-roster entry. Wiring must resolve the ID.
5. **Capture Capsule price / rate / variant names** — all PLACEHOLDER, Mars-only. Only bound:
   price is more than a Luigi Cube's 250 CR; first obtainable at the first store, not the lab.
6. **Cowboy levels + all Jax/Falk moves + Jax rewards** — open, not invented in this slice.
7. **Pebblefist HP** — NOT set by this slice; remains a separate Mars-only confirmation
   (its appearance in a Jax example draw does not set it).
8. **Randomized-mode mid-save toggle behaviour** — staged recommendation (applies only to
   fight points not yet met; never redraws stored teams) is not canon until confirmed.
9. **Named nurse team-or-no-team, Dojo 3–7 / Elite / admin names + dialogue, Dojo 8 team
   choice, Champion conflict** — unchanged from the parity report; still Mars-only.
10. **Luigi Cube starting count** — default inventory holds 10 + starter gift adds 5; whether
    a fresh save should hold 10 pre-gift or 15 post-gift is a wiring flag.

## Validation

- All 3 JSON files parse (validated with `python3 -m json.tool`; see report).
- No commit, no push, no PR created in this slice, per task. No files outside
  `~/workspace/mochiichao-work/pokemon-parity-fill/teams-items/` were created or modified
  by this slice (reads only elsewhere).
- Roster cross-checks done against global_roster.json (47 creatures, tolerant regex parse —
  the file has at least one malformed base_stats entry, e.g. id 002, so a strict JSON parse
  fails; species names/elements/evolution levels quoted here were extracted by regex and
  should be re-verified at wiring time).
