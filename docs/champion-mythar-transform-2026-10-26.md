# Champion Mythar transform system — design + integration (code-ready, NOT wired)

Date: 2026-10-26. Mars ruling ~14:15 CDT: Champion fight is Hex FIRST, then
Mythar at the END. Mythar is roster creature #331, Arceus-like: one entity
with multiple forms, transforming creature <-> human, battle sprite swapping
back and forth human <-> creature during DIALOGUE and during BATTLE.

## Decomp source → Mochiichao replacement (structure only)

| Decomp element | Where | Mochiichao replacement in this system |
|---|---|---|
| State-flag form/type change + dedicated change script | FireRed `src/battle_util.c` `CastformDataTypeChange`, `BattleScript_CastformChange` (`include/battle_scripts.h`) | `evaluateMytharTriggers` (pure): HP-threshold edges + fight boundaries decide a form; the caller swaps sprite first, then shows the line. No silent value swap. |
| One species record, N form slots, form index selects sprite | Black 2 `res/pokemon/*/data.json` `forms: {count, sprite_offset}`, party `form` field | `MYTHAR_FORMS`: one entity (`entitySpeciesId: "331"`), two form records, `spriteSlot` / `portraitSlot` per form. |
| Typed trainer message slots at battle points | Black 2 `res/trainers/data/*.json` `messages` (`TRMSG_START`, `TRMSG_LOSE`, numeric mid-battle types) | `MytharDialogueTrigger` + `MYTHAR_DIALOGUE`: typed slots (intro / battleStart / hpHalf / hpQuarter / defeat / postBattle), each with its form + swap flag. |
| Front/back pics are separate loads; palettes freed + reloaded on change | FireRed `src/battle_gfx_sfx_util.c` (`DecompressTrainerFrontPic`, `FreeTrainerFrontPicPaletteAndTile`, species/personality palettes, front-vs-back distinction) | Swap rule in the checklist: free old pic/palette, load new slot, then render. Never relabel the old sprite. |
| Battle engine resolves a message id; message layer renders it | HeartGold `src/battle/` controller + message plumbing | Split kept: this file resolves triggers; dialogue/BattleView renders. |

No Pokemon species/character names, cries, or dialogue are copied. All lines in
`champion-mythar.ts` are Mochiichao-original draft wording, except the one
Mars-locked defeat line, which already exists verbatim in the game's own
world data (`FullWorldMaps.ts` `champion_mythar` dialog) and is reused as
Mars's line, not imported from Pokemon.

## What already exists in game code (do not duplicate, do not redesign here)

- `FullWorldMaps.ts` `champion_mythar`: a pre-existing Champion Mythar NPC
  whose team member is `003 AquariiOS` (renamed from the old name by the
  roster-wins batch, PR #205). It is NOT the transform system and NOT the
  Hex-then-Mythar sequence.
- `FullWorldMaps.ts` `rival_hex` / `hex_lab_battle` / `hex_battle_event`:
  early-game rival Hex, NOT Champion Hex. The Champion Hex fight does not
  exist in code yet.
- Mythar roster entry #331: element Mythic, single-stage, evolution null.
  Transform is therefore NOT an evolution — no evolution entry is created
  or changed for Mythar.

## Element note (confirmed, not invented)

Silk = Bug, Wind = Flying, Neon = Electric (Mars-confirmed). Mythar's element
is Mythic; no Mythic→type-chart mapping is asserted here — the transform
system swaps sprites/dialogue, not types, so no mapping is needed for it.

## Wiring status (percentage rule)

- System code + data: 100% (`champion-mythar.ts`: types, form records,
  dialogue slots, pure trigger evaluation, sprite/portrait resolvers;
  tsc --noEmit --strict exit 0 standalone).
- BattleView / dialogue / champion-battle wiring: 0% — no Champion battle
  sequence exists to wire into, and this file makes no BattleView call.

## Integration checklist (exact unwired steps, wiring batch + own gate)

1. Build the Champion sequence: Hex fight, then Mythar fight, in that order.
   Do not bolt Mythar onto a normal trainer battle or onto the existing
   `champion_mythar` placeholder without replacing its team/sprite logic.
2. BattleView: after every HP change, call `evaluateMytharTriggers` with the
   current HP fraction; for each returned line, swap sprite FIRST (free old
   pic/palette, load the new slot), THEN show the line.
3. Dialogue layer: intro/defeat/postBattle lines go through the same dialogue
   UI as other trainer talk; portrait swaps with the form.
4. Art: `championMytharHuman` sprite + portrait and `championMytharCreature`
   sprite + portrait do not exist yet. A swap with a missing asset must fall
   back to the current sprite, never crash the fight.
5. Regression test in the wiring gate: HP, level, and moves identical before
   and after every swap (same entity). A swap that changes stats is a bug.
6. No Pokemon names, cries, or dialogue at wiring time either.
