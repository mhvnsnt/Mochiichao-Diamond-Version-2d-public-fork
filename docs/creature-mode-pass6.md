# Creature Mode Pass 6 — SA Chao data wiring + Daycare steps

## What was pulled first (Mars 2026-10-26 16:25 CDT)

- X-Hax sa_tools, shallow clone, local work area only:
  `~/workspace/mochiichao-work/sa-tools-pull` (71 MB, 2,640 files,
  SA1Tools + SA2Tools, VMSEditor/EditorChao.cs, GameConfig
  DC_SA1/DC_SA2/GC_SA2B Chao garden configs).
- ChaoModding_Docs, shallow clone, local work area only:
  `~/workspace/mochiichao-work/chao-modding-docs` (11 MB,
  docs/ChaoDataStruct.md = ChaoDataBase).
- NOT pulled: a full SA1/SA2 game dump/ISO. That is commercial
  game files, not tools/docs, and is not counted as owed.
- Local disc check: /media and /mnt empty, no disc mounted on
  this VM, no .gdi/.cdi. If Mars has his own disc/copy, it must
  be pointed to or uploaded, and would be used locally only.

## What changed (Creature Mode files only)

1. `src/lib/creatureGardenForm.ts`: NEW `saChaoPresentation()` —
   all computed from the existing Garden record, no new data:
   Power/Run slider = sprint − might, Fly/Swim slider =
   dive − glide, alignment numeric (−1 Umbral / 0 Neutral /
   +1 Bright), evolution progress = total Garden stats / 495,
   happiness = bond. Stat grades, lifespan, and reincarnation
   count are NOT shown — the store has no such fields yet, so
   they are not guessed.
2. `src/components/views/CreatureModeView.tsx`: Garden screen
   gains a "Chao data (SA structure, Mochiichao values)" panel
   with the sliders, alignment numeric, evolution progress, and
   happiness, plus a "Daycare steps this session" line using the
   existing walkStep counter (real moves in Creature Mode).
   No EXP or level is applied from steps yet — that number
   needs Mars, and is not invented here.

## What did NOT change

- No damage, cooldown, movement, pathfinding, capture, or XP change.
- No species, type, or evolution change.
- No new map, tileset, or sprite sheet.
- No Sonic/Pokemon names, dialogue, cries, logos, or town names.
- No file deletions.

## Playtest steps (live, on a Pages build containing this pass)

1. Garden screen with no Garden record: Chao sliders/progress
   show "not faked", Daycare steps = moves made so far.
2. Garden screen with a Garden record: sliders match
   (Sprint − Might) and (Dive − Glide) from the Garden stats
   shown above them; alignment numeric matches the alignment
   shown; evolution progress matches total/495.
3. Move in Creature Mode, reopen Garden screen: Daycare steps
   increased by the moves made, no level/EXP change from steps.

## Still owed after pass 6 (not claimed done)

- Live playtest (Pass 3/4 + Pass 5 + Pass 6 steps) on a Pages
  build containing this pass — blocked on that Pages rebuild.
- Cooldown table approval — Mars now has the full table in
  chat to approve or change, move by move.
- Daycare level gain / egg / compatibility — 0/3, store fields
  do not exist yet, not guessed.
- Walk-frame sheets (001/004/007/010) — 0/4, sprite lane.
- Garden Form palette sheets (001/004/007/010) — 0/4, sprite lane.
