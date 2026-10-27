# Unification map — fixing the three type systems, two move systems, two map systems

Drafted 2026-10-25 from the actual files in `~/workspace/mochiichao-work/fresh-start`.
This is a MAP, not a merge. Nothing here changes `global_roster.json`, `species.ts`,
or `GameData.ts` until the open decisions below are answered and the Pebblefist HP
question is settled. Direction per Mars 2026-10-25: Pokemon-style, Nintendo-based,
2D/2.5D tile world — NOT a voxel/Minecraft world.

## 1. Canonical types (settled — GameData TYPE_COLORS, the 12 True Elements)

Water, Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Deep, Flame, Mythic, Normal.

## 2. Roster elements → canonical (counts from global_roster.json, 47 entries)

Direct, no dispute (element name already in the 12, or an exact rename):
- Aqua (10) → Water
- Chrome (14) → Chrome
- Earth (3) → Earth
- Bug (3) → Bug
- Umbral (7) → Umbral
- Aero (3) → Aero
- Core (12) → Core
- Strike (5) → Strike
- Flame (6) → Flame
- Mythic (6) → Mythic

Open — these five roster elements are NOT in the 12. Do NOT merge them silently.
Each is a whole line, so the choice changes that line's typing:

| Roster element | Affected creatures | What it looks like | Proposed handling (UNCONFIRMED) |
|---|---|---|---|
| Beast (6) | 010 Kittember, 011 Pyropaw, 012 Manticlaw, 013 Pupbble, 014 Terradog, 015 Quakehound | A body category (feline/canine), not a type — GameData types these same creatures Umbral (Kittember) and Core (Pupbble), not Beast | Drop Beast as a type; keep the second element (Flame for the feline line, Earth for the canine line) as the type, OR map Beast → Normal. Mars to choose. |
| Silk (3) | 016 Squirmite, 017 Cocoonode, 018 Mothrix | A material (metallic silk), not a type — GameData types Cocoonode/Squirmite as Bug | Drop Silk; type = Bug. Lowest-risk open item. |
| Wind (3) | 019 Zephling, 020 Aerobeak, 021 Stormtalon | A descriptor of Aero, not a second type | Drop Wind; type = Aero. Lowest-risk open item. |
| Neon (2) | 024 Floatcalf, 025 Astroleviathan | A glow descriptor; pasted manifest calls the line Aqua/Cosmic, roster says Aqua/Neon | Drop Neon; type = Aqua, OR map Neon → Mythic (cosmic). Mars to choose — this also decides whether Astroleviathan is cosmic-typed. |
| Flora (4) | 038 Sproutle, 039 Shellguard, 040 Dreadtoise, 041 Pixilite | A plant descriptor; species.ts types Sproutle GRASS, GameData types Dreadtoise Core, roster second element is Chrome for 038–040 | Candidate: Flora → Earth (GameData Earth covers the grass-like Tyrage line). Alternative: keep Flora as a 13th element, breaking the 12. Mars to choose. |

## 3. species.ts Pokemon types → canonical (12 battle species, proposed only)

- WATER → Water, FIRE → Flame, GRASS → Earth (candidate, same Flora question as above),
  GROUND → Earth, ROCK → Core (candidate — Dreadtoise/Terrapod rock lines are Core in GameData),
  STEEL → Chrome, DARK → Umbral, GHOST → Umbral, PSYCHIC → Mythic (candidate),
  FIGHTING → Strike, DRAGON → Mythic (candidate, no dragon type in the 12),
  ELECTRIC / ICE / POISON / FLYING / FAIRY → no species.ts creature currently uses
  them, so no mapping is needed yet; do not invent one.
- Name mismatch in the same file: species.ts "Chromedile" = roster 005 "Chromejaww".
  Merge by evolution chain (Razorgater → Chromejaww → Reaperdile), not by name.

## 4. Two move systems → one canonical move record

- species.ts `MOVES_DB`: Record<string, Move> — name, type (Pokemon type), cat
  (Physical/Special/Status), bp, acc, pp, pri, effect, effectChance, anim, desc.
  36 moves.
- GameData `moves`: name → { power, type (Mochiichao type), acc, effect? } where
  effect is a string like "def-1", "def+2", "mixed". ~36 moves, overlapping names
  (Tackle, Bubble, Leer, Growl, etc.) but different fields and different type words.
- Canonical record (proposed): { id, name, type (12 True Elements), category,
  power, accuracy, pp, priority, effect, effectChance, anim, desc }.
  That is the species.ts shape with the type word swapped to canonical.
  GameData's effect strings ("def-1") must be translated to that effect field,
  not copied as-is, and duplicates by name must be deduplicated by checking
  power/accuracy/category match — where they disagree, species.ts wins for the
  12 battle species, GameData wins for GameData-only creatures, and the
  disagreement is logged, not averaged.

## 5. Two map systems → one canonical map record

- `Maps.ts`: hand-built tile grids, NpcDef { id, x, y, sprite, name, dialog, battle? },
  MapExit { x, y, to, enterAt }, Encounter { mochiId, rate, level }, EventDef.
  Contains Sector 0 and The Dark Forest.
- `FullWorldMaps.ts`: buildMap + TILE constants, exits with `dir` and `label`,
  conditions (e.g. Mauveville Arena requires ciphers>=10), larger world:
  Sector 0, The Dark Forest, Cave of Echoes, Neon City, Scrap Junkyard,
  Mauveville Arena, Castagnoli Island, Luigi's Mansion.
- Canonical: the FullWorldMaps shape, because it already contains all six
  landmarks and the exit conditions. Maps.ts content must be checked against it
  map-by-map (Sector 0, The Dark Forest) and any NPC/dialog/encounter present only
  in Maps.ts must be ported into the FullWorldMaps map of the same name —
  e.g. the branded-Kittember event and Master Lin's dojo battle in Maps.ts.
  Do not keep two live world systems; the renderer must read one.

## 6. What still blocks the actual merge PR

1. Pebblefist HP — 45 is an unconfirmed guess; Mars has not confirmed it.
2. The five open element decisions in section 2 (Beast, Flora, Neon especially).
3. Roster JSON syntax errors (Tiidebiite quote, Pebblefist "4-5") — fixable
   mechanically once (1) is answered, since Pebblefist's line is one of the fixes.
