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
pass the same day, and the pass is now COMPLETE: every name below is
OWNER-LOCKED in the owner's own words (several drafts he confirmed
as-is, several he replaced), with one exception — Tackle, which the
owner delegated to the full rename pass (see DELEGATED below).
Verified after the final pass: zero occurrences of any old Pokemon
name in the rename table remain in either file (exact quoted
strings), Tackle excepted per the delegation, and both files were
fetched back byte-identical to the verified edits.

## LOCKED — live canon names (PR #363, `src/data/core/moves.json`)

Applied verbatim, matched by move identity/stats:

| Old (island) | New (canon) | Basis |
|---|---|---|
| Aqua Jet | **Hydro Rush** | Live AQUA_JET (Water 40/100); island dict 40/100 Water |
| Earthquake | **Tremor** | Live EARTH_TREMOR, the Earthquake-equivalent (100/100); island dict 100/100 |
| Aqua Shot | **Water Orb** | Live AQUA_SHOT (40/100/25); FullWorldMaps team list only (the island dictionary holds no Aqua Shot key) |
| Vine Whip | **Vine Lash** | Live VINE_LASH (45/100); island dict 45/100. Owner also dictated Vine Lash in his own pass — same name both ways |

Gust was first applied as **Gust Wave** on the same basis (live
GUST_WAVE, 40/100 Aero) in an earlier round of this rename; the
owner's final pass renamed it **Wind Blast** (see OWNER-LOCKED
below), resolving the live-table collision as rename-everywhere.

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
| Rock Slide | **Rockfall** | Owner's final call in the completed dictation. **Avalanche is the REJECTED option**: it was picked in an earlier round after the flag, and the owner replaced it with Rockfall in the final pass because Avalanche is itself a Pokemon move name. Avalanche appears in this record only as that rejected option |
| Dragon Tail | **Draco Tail** | Owner-locked (supersedes the Drake Tail draft) |
| Ice Beam | **Frost Blast** | Owner-locked (supersedes both the Frost Beam draft and an interim Ice Blast) |
| Bug Bite | **Mosquito Bite** | Owner-locked |
| Slam | **Scoop Slam** | Owner-locked (supersedes the Wallop draft). Island Slam is 80/75, the source Slam, not live Body Slam (85/100) |
| Strength | **Mighty Push** | Owner-locked (supersedes the Might draft and an interim Push). `hmReward` field move. RARE class under Rare-wins precedence (HM04 origin) |
| Cut | **Slice** | Owner confirmed the draft — the "Chop Down" question is closed. `hmReward` field move. RARE class under Rare-wins precedence (HM01 origin) |
| Gust | **Wind Blast** | Owner-locked in the final pass; supersedes the interim Gust Wave application (the live-canon match above). The live-table collision was resolved as RENAME EVERYWHERE (live table + island + show) |
| Growl | **Rumble** | Doro's delegated pick under the owner's "find a synonym for growl" instruction (he set Intimidate aside — already a Pokemon ability/move name family); confirmed in the final pass |
| Quick Attack | **Swift Movement** | Owner-locked in the final pass; the live-table collision was resolved as RENAME EVERYWHERE |
| Crunch | **Munch** | Owner-locked in the final pass; the live-table collision was resolved as RENAME EVERYWHERE |

Owner-locked names with NO occurrence in the island code (recorded
for canon; nothing to rename in these files):

| Old | New (owner) | Note |
|---|---|---|
| Ember | **Small Flame** | The move Ember does not appear in either island file. "Ember" occurs only in the place name "Ember Island", which is not a move and was not renamed |
| Fly | **Ascend** | RARE class (HM02 origin). The move Fly does not appear in either island file (only the type string "Flying") |

## DELEGATED — the one remaining name

| Old (island) | Code value now | Status |
|---|---|---|
| Tackle | **Tackle** (unchanged) | delegated — named in the full rename pass. The owner left Tackle's synonym open and delegated it; until the full pass names it, the island keeps Tackle |

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
