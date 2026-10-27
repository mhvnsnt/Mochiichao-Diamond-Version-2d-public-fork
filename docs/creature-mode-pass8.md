# Creature Mode Pass 8 — Egg + compatibility, walk frames, palette sheets

## Correction first (walk frames)

Walk frames for Mochii (001), Razorgater (004), and Kittember (010)
were ALREADY in the repo under src/assets/walk-frames/ (PR #91
batch, byte-identical to the sprite-art staged files). They were
never wired into Creature Mode — it only bobbed static sheet cells.
Tyrage (007) was the one missing set, added here from
sprite-art/walk-frames/tyrage (8 frames, 2 per direction).
So walk-frame wiring is 4/4, not 3/4, and only Tyrage's files are
new in this PR.

Razorgater caveat: the staged Razorgater down frames carry a grey
ellipse ground shadow (manifest caveat). Engine shadows are
separate; shadow removal for those two down frames is still owed
as a sprite-lane cleanup, stated here, not hidden.

## What changed

1. `src/lib/creatureWalkFrames.ts` (new): speciesId → direction →
   2-phase frame URLs for 001/004/007/010.
2. `src/components/game/PixiWorldCanvas.tsx`: NEW optional
   `playerWalkFrameUrl` prop; when Creature Mode passes it, the
   player creature renders that frame instead of the static sheet
   cell. Trainer Mode passes nothing, renders exactly as before.
3. `src/components/views/CreatureModeView.tsx`: passes the walk
   frame (species + dir + walkStep phase) to Pixi; Garden screen
   shows the Garden Form palette sheet image for the active
   creature's alignment (when one exists for that species).
4. `src/assets/walk-frames/tyrage/` (new, 8 PNGs + manifest):
   the missing Tyrage set.
5. `src/assets/garden-form-palettes/` (new, 12 PNGs):
   Bright/Umbral/Neutral palette swaps per species, blended
   from the walk down_0 frame with alpha preserved (Bright
   0.40 toward (255,240,190); Umbral 0.35 toward (124,58,237),
   darkened 0.85; Neutral = base). Labelled as swaps, not
   hand-drawn atlases.
6. `src/lib/creaturePaletteSheets.ts` (new): speciesId +
   alignment → palette sheet URL.
7. Egg + compatibility (Mars order 2026-10-26, get it done):
   - Store: NEW `daycarePartner` (same shape as guardian) +
     `daycareEgg` ({speciesId, parentA, parentB, createdAtSteps}),
     both persisted by SaveMenu's whole-store serialization.
   - Garden screen: Assign/Release Partner buttons.
   - Compatibility (creatureDaycare.ts, Pass 8 rule): one shared
     breeding group, gender not a Mochiichao gate, both creatures
     player-owned → same species = 50, different species = 20
     (FireRed's numbers, FireRed's 70 unreachable here).
   - Egg: Check for Egg button at 256-step check hits with a
     pair present; roll compatibility > random*100 → egg
     (species = Guardian's base form). Hatch button after 256
     more steps → createMochii(species, 5) via addMochii.

## What did NOT change

- No damage, cooldown, movement, pathfinding, capture, or XP
  formula change. No species/type/evolution change.
- No file deletions. No other lane's files touched (gameStore
  gardenMinutes preserved — see gate check before merge).
- No hand-drawn palette atlas claimed: palette sheets are swaps.

## Playtest steps (live, on a Pages build containing this pass)

1. Play as each of 001/004/007/010, move in all 4 directions:
   true walk frames animate (2 phases), not just bobbing.
2. Garden screen with a Garden record: palette sheet image
   matches the alignment shown (Bright gold / Umbral purple /
   Neutral base).
3. Assign Guardian + Partner, walk to a 256-step multiple,
   Check for Egg (roll shown in log), walk 256 more, Hatch Egg
   → Lv 5 creature joins party/PC.
4. Retrieve still works as in Pass 7 (EXP + CR cost + reset).

## Still owed after pass 8 (not claimed done)

- Live playtest (Pass 3/4 + 5 + 6 + 7 + 8 steps) on a Pages
  build containing this pass.
- Razorgater down-frame shadow removal (sprite-lane cleanup).
- Hand-drawn full palette atlases per form, if Mars wants them
  later — swaps are what ships now, labelled as such.
