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
The drafted names were then taken through the owner's own dictation
pass the same day: most names below are now OWNER-LOCKED in the
owner's own words (several drafts he confirmed as-is, several he
replaced). Verified after each pass: zero occurrences of any old
Pokemon name for a locked move remain in either file (exact quoted
strings), and both files were fetched back byte-identical to the
verified edits.

## LOCKED — live canon names (PR #363, `src/data/core/moves.json`)

Applied verbatim, matched by move identity/stats:

| Old (island) | New (canon) | Basis |
|---|---|---|
| Aqua Jet | **Hydro Rush** | Live AQUA_JET (Water 40/100); island dict 40/100 Water |
| Earthquake | **Tremor** | Live EARTH_TREMOR, the Earthquake-equivalent (100/100); island dict 100/100 |
| Aqua Shot | **Water Orb** | Live AQUA_SHOT (40/100/25); FullWorldMaps team list only (the island dictionary holds no Aqua Shot key) |
| Vine Whip | **Vine Lash** | Live VINE_LASH (45/100); island dict 45/100. Owner also dictated Vine Lash in his own pass — same name both ways |
| Gust | **Gust Wave** | Live GUST_WAVE (40/100); island dict 40/100 Aero. See PENDING below — the owner leaned toward renaming Gust itself, which would touch the live table |

## OWNER-LOCKED — named by the owner 2026-10-27

| Old (island) | New (owner) | Note |
|---|---|---|
| Water Gun | **Aqua Blast** | Owner-locked |
| Hydro Pump | **Water Jet** | Owner-locked (picked over Water Stream) |
| Surf | **Wave** | Owner-locked. RARE class under Rare-wins precedence (HM03 origin). Island uses it as `hmNeeded:"Wave"` |
| Bubble | **Foam Burst** | Owner's final word (an initial "Bubbles" was superseded the same day) |
| Tail Whip | **Tail Flick** | Owner confirmed the draft |
| Metal Claw | **Chrome Claw** | Owner confirmed the draft. Island stats (50/95) match source Metal Claw, not live METAL_STRIKE "Metal Strike" (50/100) — a distinct island move |
| Leer | **Stare Down** | Owner confirmed the draft |
| Scratch | **Claw** | Owner-locked |
| Pound | **Punch** | Owner-locked |
| String Shot | **Web Blast** | Owner-locked |
| Shadow Sneak | **Night Stealth** | Owner-locked |
| Metal Sound | **Chrome Screech** | Owner confirmed the draft |
| Iron Defense | **Chrome Guard** | Owner confirmed the draft |
| Shell Smash | **Shell Burst** | Owner confirmed the draft |
| Rock Slide | **Avalanche** | Owner chose Avalanche AFTER being told Avalanche is itself a Pokemon move name; locked with the collision flagged, per his call |
| Dragon Tail | **Draco Tail** | Owner-locked (supersedes the Drake Tail draft) |
| Ice Beam | **Frost Blast** | Owner-locked (supersedes both the Frost Beam draft and an interim Ice Blast) |
| Bug Bite | **Mosquito Bite** | Owner-locked |
| Slam | **Scoop Slam** | Owner-locked (supersedes the Wallop draft). Island Slam is 80/75, the source Slam, not live Body Slam (85/100) |
| Strength | **Mighty Push** | Owner-locked (supersedes the Might draft and an interim Push). `hmReward` field move. RARE class under Rare-wins precedence (HM04 origin) |
| Cut | **Slice** | Owner confirmed the draft — the "Chop Down" question is closed. `hmReward` field move. RARE class under Rare-wins precedence (HM01 origin) |

Owner-locked names with NO occurrence in the island code (recorded
for canon; nothing to rename in these files):

| Old | New (owner) | Note |
|---|---|---|
| Ember | **Small Flame** | The move Ember does not appear in either island file. "Ember" occurs only in the place name "Ember Island", which is not a move and was not renamed |
| Fly | **Ascend** | RARE class (HM02 origin). The move Fly does not appear in either island file (only the type string "Flying") |

## OWNER DECISION PENDING — code keeps its current value

| Old (island) | Current code value | Status |
|---|---|---|
| Growl | **Rumble** | Owner delegated "find a synonym for growl" (he set Intimidate aside — already a Pokemon ability/move name family). Rumble is the standing proposal, UNCONFIRMED |
| Gust | **Gust Wave** | Owner leaned "Wind Blast" in his pass, but Gust Wave is a live-table canon name (see LOCKED above) — pending his call on whether the rename reaches the live table too |
| Quick Attack | **Quick Attack** | Owner leaned "Swift Movement"; Quick Attack is a live-table name — same pending question |
| Crunch | **Crunch** | Owner leaned "Munch"; Crunch is a live-table name — same pending question |
| Tackle | **Tackle** | Owner unsettled ("tackle is just tackle"; "Take Down" floated). Tackle is a live-table name — same pending question |

## Unchanged — already canon or already original

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
