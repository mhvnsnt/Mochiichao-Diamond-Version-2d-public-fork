# GameData Island Rename — mapping record (2026-10-27)

Scope: `src/world/GameData.ts` and `src/world/FullWorldMaps.ts` ONLY.
These two files are a prototype island that shares one Pokemon-named
move vocabulary (a move dictionary in GameData.ts, keyed by move
name, plus team `moves:[...]` lists and `hmNeeded` / `hmReward`
field-move keys in FullWorldMaps.ts). The island is not wired to the
live move table (`src/data/core/moves.json` / `src/lib/moves.ts`).

Owner ordered the island renamed now (2026-10-27), under the standing
rules: rename-on-use + the synonym rule (names built from literal noun
words / natural-disaster terms get the coolest near-synonym, meaning
preserved). Dictionary keys and every internal reference inside the
two files were renamed together, so the island stays self-consistent.
Verified after the rename: zero occurrences of any old name remain in
either file (quoted, single-quoted, prose, or comments), and both
files parse clean under the TypeScript compiler (only the expected
unresolved `./WorldConstants` import, which is out of scope).

## LOCKED — live canon names (PR #363, `src/data/core/moves.json`)

Applied verbatim, matched by move identity/stats:

| Old (island) | New (canon) | Basis |
|---|---|---|
| Aqua Jet | **Hydro Rush** | Live AQUA_JET (Water 40/100); island dict 40/100 Water |
| Earthquake | **Tremor** | Live EARTH_TREMOR, the Earthquake-equivalent (100/100); island dict 100/100 |
| Aqua Shot | **Water Orb** | Live AQUA_SHOT (40/100/25); FullWorldMaps team list only (the island dictionary holds no Aqua Shot key) |
| Vine Whip | **Vine Lash** | Live VINE_LASH (45/100); island dict 45/100 |
| Gust | **Gust Wave** | Live GUST_WAVE (40/100); island dict 40/100 Aero |

## OWNER-LOCKED — named by the owner 2026-10-27

| Old (island) | New (owner) | Note |
|---|---|---|
| Water Gun | **Aqua Blast** | Owner-locked |
| Hydro Pump | **Water Jet** | Owner-locked (picked over Water Stream) |
| Surf | **Wave** | Owner-locked. RARE class under Rare-wins precedence (HM03 origin) |

## DRAFT — near-synonyms, OWNER APPROVAL PENDING

Drafted under the synonym rule. **None of these are locked canon** —
the owner can swap any of them with one word.

| Old (island) | Draft name | Note |
|---|---|---|
| Bubble | Foam Burst | |
| Tail Whip | Tail Flick | |
| Metal Claw | Chrome Claw | Island stats (50/95) match source Metal Claw, not live METAL_STRIKE "Metal Strike" (50/100) — treated as a distinct island move, so drafted rather than mapped |
| Leer | Stare Down | |
| Scratch | Swipe | |
| Growl | Rumble | |
| Pound | Thump | |
| String Shot | Silk Shot | |
| Shadow Sneak | Shade Step | |
| Metal Sound | Chrome Screech | |
| Iron Defense | Chrome Guard | |
| Shell Smash | Shell Burst | |
| Rock Slide | Rockfall | |
| Dragon Tail | Drake Tail | |
| Ice Beam | Frost Beam | |
| Bug Bite | Mite Bite | |
| Slam | Wallop | Island Slam (80/75) is the source Slam, not live Body Slam (85/100) |
| Strength | Might | `hmReward` field move. RARE class under Rare-wins precedence (HM04 origin); name is DRAFT |
| Cut | Slice | `hmReward` field move. RARE class under Rare-wins precedence (HM01 origin); name is DRAFT |

## Unchanged — already canon or already original

- **Canon verbatim in the live 36** (no rename needed): Tackle,
  Quick Attack, Crunch. FullWorldMaps already used "Vine Lash".
- **Island-original names** (not Pokemon names; left as-is):
  Ink Splash, Jab, Crush, Water Surge, Dark Tide, Reap Claw,
  Mythic Pulse, Data Rend, Quantum Strike, Aura Burst.

## Remaining islands (NOT touched by this rename)

- `sprite-art/arena-combat/moveData.js` — own slug-id dataset
  mirroring "Aqua Jet" / "Razor Leaf".
- `sprite-art/playtest/playtest-step5.js` — self-contained
  scenario harness.

Both stay as they are until/unless the owner orders them renamed
or they get wired to the live table (rename-on-use).
