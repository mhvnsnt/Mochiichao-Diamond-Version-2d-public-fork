# Creature Mode Pass 5 — Garden Form palettes + auras, Garden/Daycare screen

## Pull-first inventory (done before any hand-tooling, Mars 2026-10-26 15:37 CDT)

Pokemon element -> Mochiichao replacement in that exact spot -> HAVE / NEED TO MAKE:

- FireRed `src/daycare.c` + `include/daycare.h` (DayCare struct, slots,
  steps, Store/Take, GetNumLevelsGained, compatibility, egg/hatch)
  -> Garden/Daycare screen slots in Creature Mode, Slot 1 = Guardian,
  Slot 2 = empty. HAVE (structure only, no dialogue copied).
- FireRed `src/menu.c` WindowTemplate/ListMenu + `party_menu.c` /
  `pokemon_summary_screen.c` (dedicated full screens, never popups)
  -> Garden screen is a full-screen view with its own Back button.
  HAVE.
- Chao Garden conversion doc `chao-garden-conversion.md` (Garden Form
  = palette + accessories + aura, NOT a species change; Bright =
  white/gold, Umbral = black/purple, Neutral = base colour;
  Mainframe Gardens: Sector 0 Plaza Neutral, Aeon Spire Bright,
  Deep Sector Umbral, 8 per garden)
  -> `src/lib/creatureGardenForm.ts` palette/aura mapping, reusing
  `mochiichao-systems.ts` (alignmentFromCare, gardenForm,
  colorwayFor, dominantStat, gardenBattleBonus). HAVE.
- NO actual Sonic Adventure Chao Garden source files were found in
  the workspace or repo — only the conversion doc and
  `garden-mode-spec.md`. NEED TO MAKE (from conversion doc only):
  Garden work here builds from that doc, not from Sonic code, and
  no Sonic file is invented. This is stated plainly, not hidden.
- Forbidden list (only): Sonic/Pokemon character names, dialogue,
  cries, logos, town names straight from their games. 0 of those
  are used in this pass. Everything else above was pulled in.
- GPU-first: Kaggle T4 x2 free is the route for GPU-able art.
  This pass is TypeScript logic + a Pixi overlay ring — GPU
  genuinely cannot help the TSX logic, and the Pixi canvas itself
  renders on the device GPU. No Kaggle bake was required or claimed
  for this pass, because no new sprite sheet is produced here;
  palette sheets remain sprite-lane production.

## What changed (Creature Mode files only, plus one shared canvas prop)

1. NEW `src/lib/creatureGardenForm.ts` (pure presentation, no damage/
   stat/species change): maps a shared-store Garden record to form
   (Base / I / II), alignment, palette primary/accent, aura colour
   + strength (Base = no aura, I = soft, II = strong), dominant
   Garden stat, colorway, battle bonus % (capped +9%, from the
   existing function), Garden stats, bond, care mistakes, parts,
   plus the MAINFRAME_GARDENS list.
2. `src/components/game/PixiWorldCanvas.tsx`: NEW optional prop
   `playerAuraColor` (null by default). When Creature Mode passes
   an aura colour, a ring is drawn under the player creature only,
   before the sprite. Trainer Mode passes nothing, so it renders
   exactly as before. No other canvas behaviour changed.
3. `src/components/views/CreatureModeView.tsx`: passes the active
   creature's aura colour to the canvas, shows the Garden Form aura
   in the HUD, adds a "Garden / Daycare" button, and a dedicated
   full-screen Garden/Daycare screen: Garden Form + palette swatches
   + aura + stats + bond + colorway + bonus, Daycare Slots 1-2,
   Mainframe Gardens list. No level gain, egg, or compatibility
   number is invented — those store fields do not exist yet.

## What did NOT change

- No damage, cooldown, movement, pathfinding, capture, or XP change.
- No species, type, or evolution change. Garden Form never changes
  species ID.
- No new map, tileset, or sprite sheet. Sector 0 is still the map.
- No Pokemon/Sonic names, dialogue, cries, logos, or town names.
- No file deletions.

## Playtest steps (live, on a Pages build containing this pass)

1. Start Creature Mode with a creature that has NO Garden record:
   Garden screen says "No Garden record yet", bonus 0, no aura ring.
2. Start Creature Mode with a creature that HAS a Garden record
   (feed/train in Garden first, then return): HUD shows the form
   + bonus %, Garden screen shows matching palette swatches,
   stats, colorway, and the in-world ring under the player matches
   the aura colour on the screen (gold for Bright, purple for
   Umbral, none for Base).
3. Garden screen Back returns to Creature Mode controls; Exit
   Creature Mode still works; Guardian assign/release still works
   and Slot 1 on the Garden screen matches it.

## Still owed after pass 5 (not claimed done)

- Live playtest above, on a Pages build containing this pass.
- Full starter walk sheets (sprite lane) and palette sprite sheets
  (sprite lane) — this pass is swatches + aura ring until they land.
- Cooldown table numbers remain provisional, shown to Mars, not canon.
- Daycare level gain / egg / compatibility wiring — needs store
  fields that do not exist yet; not guessed here.
