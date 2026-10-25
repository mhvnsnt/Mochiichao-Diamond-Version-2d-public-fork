# Monster-tamer systems in Mochiichao canon

Original Mochiichao code/data only. Spec:
`goals/mochiichao-fresh-start-repo/files/monster-tamer-pulls-canon-v1.md`.
Logic lives in `src/lib/monster-tamer-systems.ts`.

## Boundary — what was NOT pulled

NOT pulled, downloaded, extracted, or vendored: any official files,
art, music, code, sprites, monsters, stories, or characters from
Pocket Mortys, Cassette Beasts, Calamon, LumenTale, Wildkeepers
Rising, Elestrals Awakened, or Palworld, and no modded APK (including
the itch.io Pocket Mortys APK from the search paste) or any
third-party APK from Uptodown / APKMirror / Softonic / etc. Playing
Pocket Mortys free on the official Play/App Store is for playing, not
for extracting files into this repo. Tuxemon (GPL-3.0) contributed
structure only (JSON data, Tiled maps, scriptable dialog) — no
Tuxemon monsters, sprites, story, or code is copied or vendored.

## Systems wired

1. **Data Fusion + Data Tape Transform** (`BattleView.tsx`,
   `CreatureModeView.tsx`). Fusion: temporary, one battle only
   (component-local state, so leaving battle ends it). Stats =
   average of the two party creatures +10% (FUSION_BONUS, an
   implementation choice documented in the code, not Mars canon).
   Fusion button in the battle menu; partner = first other alive
   party member. Fusion form shows both creatures' existing sheets
   together as a placeholder until the Sprite Art lane makes a fusion
   sheet — no new likeness. Data Revert (the Split button) ends
   fusion mid-battle and restores the original creatures, which were
   never merged in the store. Data Tape Transform: in Creature Mode,
   the party list is the tape list — picking a recorded creature
   switches the same Creature Mode path to that creature. No new mode.
2. **Mainframe Variants** (`RosterView.tsx`). Variant field keyed by
   creature instance, NO new species IDs. Same species, a Mainframe
   Sector (from existing maps) + a True Element tag (Water, Chrome,
   Earth, Bug, Umbral, Aero, Core, Strike, Deep, Flame, Mythic,
   Normal only). Display tag only — battle types and stats are
   unchanged, because no True-Element-to-code-type mapping has been
   approved. Capture stays Luigi Cubes + Ring Capture.
3. **Data Cards** (`ShopView.tsx`, `PcView.tsx`). Shop item, 300 CR
   (implementation price, documented in code). In PC, a Data Card
   can be spent to mark a PC creature's data as stored on a card; it
   stays swappable at the PC. A reskin of PC storage + Luigi Cubes
   in canon terms — NOT Calamon cards or beasts.
4. **Bonding / Memory Quests** (`GardenView.tsx`). Three quests from
   existing NPCs — Prof. Aeon ("Aeon's First Memory"), Mochiko
   ("Mochiko's Lost Lesson"), Hex ("Hex's Rival Memory") — each
   once, reward bond +10 and one Garden stat +5 on the selected
   creature's Garden record (the same local placeholder record the
   Garden view already used, not yet persisted to the save).
   Befriending raises Garden Stats; it does NOT replace capture.
5. **Guardian Training** (`CreatureModeView.tsx`). Assign the
   creature you are playing as as Guardian of the Mainframe Gardens,
   or release it. Same Creature Mode path (dodge + 4 moves, tile-step
   movement as in pass 1) — no bullet-heaven code copied.
6. **Elestrals 2.5D**: no new code. It is already the locked
   looks-3D-runs-2D presentation (tile world, turn-based battles,
   2D sheets only).

## Known limits (not silent omissions)

- Fusion partner choice is the first other alive party member, not
  a full partner picker. Fusion uses the active creature's
  species/types for STAB; only stats and name are fused.
- Variant, Data Card marks, quest completions, and Guardian
  assignments are local component state in this wiring (like the
  Garden placeholder records) — they are not yet persisted to the
  save file. That persistence is a later pass.
- Garden quest rewards use the existing Garden record; Garden
  persistence itself was already marked as the next Garden pass.
