# Cheat console + emulator-like features — design spec

Designed 2026-10-25. Pokemon-style, Nintendo-based, 2D/2.5D web game — NOT voxel,
NOT a ROM emulator. Real Action Replay / GameShark codes cannot run in this game,
so everything below is Mochiichao-native.

## 1. Why a native registry, not real AR/GS codes
- The game is React/Vite/TypeScript, not a Game Boy / DS ROM. There is no
  emulated memory to poke, so a real AR/GS code has nothing to attach to.
- Solution: an allowlisted code registry in game code. Only codes on the list
  do anything; anything else is rejected with "Unknown code" and changes nothing.
- Every successful cheat sets `save.cheated = true` on the save file, shown in
  the save menu. Cheated saves are never silently passed off as clean.

## 2. Allowlisted codes (initial list, from earlier research — confirm names with Mars before wiring)
- `MOCHII-ALL` — unlock all caught flags in the Dex view only (does not grant
  creatures, stats, or items; Dex-only, for testing the Dex UI).
- `MAX-LVL` — set the lead party creature to the level cap for testing only,
  clamped to the game's cap; does not grant moves it could not learn.
- `SHINY-ON` / `SHINY-OFF` — toggle the rare colorway flag on newly encountered
  creatures for that session; does not change type or stats.
- `NOCLIP` — walk through NPCs and map-block tiles in the world view for
  testing maps; disabled automatically on entering a battle or a dojo.
- `WARP-SECTOR0` — return to Sector 0 — Boot Harbor (the hub), no items granted.
- Money: a clamped money code only (amount capped at the shop's test cap, to be
  set when the shop economy is finalized — do not pick a number here by guessing).
- Rejected by design: any code that would grant a specific official Pokemon,
  copy a ROM save, edit another player's save, or bypass a payment. None exist.

## 3. Save states (emulator-like, native)
- 4 slots, in addition to the normal save file. Slot = a full snapshot of
  party, inventory, position, map, and flags at that moment.
- Save-state UI lives in the save menu, not in battle. Loading a state replaces
  the current session state; the normal save file is untouched until the player
  saves normally again.
- States are stored locally (same storage as the normal save system in
  `src/lib/saveSystem.ts`); no server, no account, no cloud sync in this design.

## 4. Fast-forward
- 1x / 2x / 4x toggle in the world view. It speeds the world tick and text
  advance only; it does not speed the battle RNG, change encounter rates, or
  skip cutscenes. Battle speed is a separate, battle-only setting.
- Fast-forward turns itself off on entering a battle, a dojo, or a scripted event.

## 5. Debug panel (the "God Mode Debugging" tabs, Pokemon-style version)
- A hidden debug panel, opened from the save menu with a key combination, not
  from normal gameplay. Tabs, mapped to what already exists or is designed:
  Party (party state), Trainer (trainer flags), Log (event log), Dex (Dex flags),
  Logbook (Mochiimind notes — read-only until the ecology log store exists),
  Build (build/version + data counts), World (current map/position/flags),
  Neural Log (Mochiimind thought log — read-only, empty until the log store exists).
- The panel can VIEW state and, for testing, apply only the allowlisted codes
  above. It cannot edit arbitrary memory, spawn official creatures, or write
  directly to the roster file.

## 6. Wiring order and blockers
- Code registry must use canonical roster IDs (001–047 scheme from the roster),
  NOT National Dex numbers and NOT GameData's 1–17 numbering.
- Therefore wiring waits for: (a) the roster unify PR (Pebblefist HP + the
  Beast/Flora/Neon element decisions), and (b) PR #9 landing, so the new code
  goes on a fresh branch from the new main and cannot clobber PR #9's files.
- This spec is the design deliverable. Code is not written yet, and no code
  in the repo changes because of this file.
