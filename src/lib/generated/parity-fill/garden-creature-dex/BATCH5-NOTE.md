# PR Batch 5 — Garden / Creature / Dex / multiplayer-validation (shapes ONLY, NOT live wiring)

Status: landed as data under `src/lib/generated/parity-fill/garden-creature-dex/`.
NOT imported by game code yet. Where playable code does not exist, ONLY shapes
are wired here; no gameplay code is invented and no network code is added.

## Counts

- Garden system: 14/14 sections shaped (gardenStats, dataShards, gardenCritters,
  alignment, dataCocoonGardenForm, dataRebirth, mythicForm,
  bondingSeasonHeartBerry, mainframeGardens, mochikoAcademy, market, races,
  dojoSparring, dataFruitFarming). Garden playable: 0/5 places (Academy,
  Market, Race Track, Sparring Ring, Farm Plots are placeholder text in
  GardenView; GardenView records are not persisted to save). Garden spec 100%
  (conversion doc) vs Garden playable 0% — staged shapes do NOT change the
  in-game %.
- Garden stats: 5/5 (Dive/Glide/Sprint/Might/Endurance). Data Shards: 7/7 types.
  Garden Form thresholds in code (150/300) + battle bonus cap +9% are HAVE in
  mochiichao-systems.ts; persistence is NEED TO MAKE.
- Breeding shape: 8/8 rules shaped; breeding playable 0/8 (no egg system in
  code). Egg groups: 0/1 defined (NOT copied from Pokemon group names).
  Parent+fruit map: 0/1 (Mars-only). Hatch steps: null (NOT invented).
  No hybrid species: roster stays 47.
- Mochi Dex: roster 47/47 shaped (seen/caught all false — this shape claims NO
  play data), discoverable slots 100/100 EXPLICITLY NOT FILLED (047-146: no
  species, no stats, no names invented — per task, roster slots 047-146 are
  NOT filled), reserved 2/2 (147 Dorowani, 148 Gabu — RESERVED-NOT-FILLED,
  stats owed, Mars-only). Dex completion rewards: none (slot held, reward NOT
  invented).
- Post-game shape: Grand Champion target 1/1 staged (team 6/6, reward 20000 CR,
  Mainframe Plateau — CANON TARGET, NOT BUILT); rematches 0 entries; Elite
  0/4 in code (names now locked in Batch 3, teams/dialogue still open);
  Champion 0/1 resolved; playable post-game 0%.
- Multiplayer validation: 8/8 checks staged (2 HAVE-in-code via
  mochiLinkValidate, 4 STAGED-need-wiring/shape, 2 DECISION-OWED: Mythic-Form
  trade legality + egg-trade rule — validator returns decision-owed errors,
  never silently allows or blocks). Playable trade/battle: 0% BY DESIGN.
  NO network code, NO server, NO matchmaking, NO PvP netcode, NO friend
  codes/accounts — explicitly excluded, not invented.
- Creature Mode walk wiring: 1/8 items verified (locked 2D cell sets exist:
  Dorowani 13 cells, Gabu 20 cells), 0/8 wired live. The checklist is staged
  as-is, including its clone-staleness warning: it was written against a
  pass-1 work clone and the coordinator MUST verify pass2/3/4 state against
  main before wiring. Do NOT wire from the pass-1 view as if it were pass 4.

## Files (staged, verbatim except this note)

- garden-system.json, garden-creature.ts, mochi-dex.json, breeding-shape.json,
  post-game-shape.json, multiplayer-validation.json, multiplayer-validation.ts,
  creature-mode-wiring-checklist.md, README.md

## Held

- All live wiring (Garden persistence, egg system, trade wiring, Creature Mode
  walk wiring), Dorowani/Gabu stats (Mars-only), egg groups, parent+fruit map,
  hatch steps, Dex completion rewards, rematch teams, Champion resolution.
  Roster slots 047-146 deliberately NOT filled.
