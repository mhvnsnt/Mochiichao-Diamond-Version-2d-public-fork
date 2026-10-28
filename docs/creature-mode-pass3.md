# Creature Mode pass 3 — the 6 owed items, closed

Pass 2 checklist was 17/23 = 74%. Pass 3 closes the remaining 6/23 = 26%.
Pass 3 checklist: 23/23 = 100% for Creature Mode code.

## What changed, file by file (0 files deleted)

- `src/components/views/CreatureModeView.tsx` — smooth float movement,
  walk-step animation, easystar wild targets, Garden bonus, store Guardian.
- `src/components/game/PixiWorldCanvas.tsx` — pass 2 wilds prop (unchanged in pass 3).
- `src/lib/creatureCooldowns.ts` — NEW, explicit per-move cooldown table.
- `src/lib/creaturePathfinding.ts` — NEW, easystarjs A* wrapper.
- `src/lib/easystar.d.ts` — NEW, type declarations for easystarjs.
- `package.json` — easystarjs ^0.4.4 added (MIT, npm, open source).
- `src/store/gameStore.ts` — gardenRecords + guardian in the shared store.
- `src/components/views/GardenView.tsx` — Garden records now use the
  shared store instead of local state; GardenView behaviour unchanged,
  and its records now save with the game via SaveMenu's whole-state save.
- `docs/creature-mode-pass3.md` — this file.

## The 6 owed items, each closed

1. **Smooth pixel movement — done.** Player position is a float tile
   position. 50ms tick, 4 tiles/s walk, 6 tiles/s sprint, per-axis
   collision against blocked tiles 1/4/2, clamped inside the map.
   Wilds glide toward their AI next-tile at 3 tiles/s instead of
   teleporting a tile at a time.
2. **Top-down walk sprites — wired, art scope stated honestly.**
   Walk animation is wired: `walkStep` increments on every real move
   and PixiWorldCanvas bobs the creature (existing sheet front/back/
   side cells, mirrored side, or the type-colour fallback silhouette).
   Sheets that actually exist today and are registered in
   `spriteSheets.ts`: Dorowani (147) and Gabu (148), 3 cells each.
   Full walk-art sheets for the starters are sprite-lane production
   (that lane's Blender bake is still running: Dorowani 6/27 renders
   at last check) — this lane invents NO new art, and when a sheet
   lands and is registered, Creature Mode shows it with no code change.
   Do NOT read this as "51 walk sheets shipped" — that is not claimed.
3. **Canonical cooldown table — table shipped, numbers provisional.**
   See the table below. These numbers are the pass-2 derivation frozen
   into an explicit table so Mars can approve or change them move by
   move. They are NOT decomp data and NOT treated as canon until Mars
   approves. Changing a number means editing `creatureCooldowns.ts` only.
4. **Easystar A* wild pathfinding — done, real library.**
   easystarjs 0.4.4 (MIT) from npm, via `creaturePathfinding.ts`.
   Engage and pack moves take the first step of the easystar path over
   the Sector 0 grid, so wilds path around trees/buildings/water.
   Boids rules still pick the target (pack centroid cohesion,
   separation when sharing a tile, skittish flee, curious approach).
5. **GardenStats sharing for the +9% bonus — done, not stacked.**
   GardenView writes to `gardenRecords` in the shared store;
   Creature Mode reads the active creature's record and applies
   `gardenBattleBonus()` (capped +9% in mochiichao-systems) to the
   player's Creature Mode damage only, once, shown in the HUD.
   Wild attacks do NOT get the bonus. If no Garden record exists,
   the bonus is 0 — not faked.
6. **Guardian persistence — done.** Guardian lives in the shared
   store (`guardian` / `setGuardian`), so leaving Creature Mode and
   saving/loading keeps the assignment. SaveMenu serializes the whole
   store state, so both new fields persist with the save.

## CONFIRMATION ITEM — shown to Mars first, not treated as canon

Cooldown table (ms), provisional, from `src/lib/creatureCooldowns.ts`:

| Move | ms | Move | ms | Move | ms |
|---|---|---|---|---|---|
| Water Orb | 1080 | Aqua Cannon | 680 | Hydro Surge | 600 |
| Hydro Rush | 880 | Ember Toss | 1080 | Fire Stream | 680 |
| Inferno Wave | 600 | Fire Punch | 800 | Petal Barrage | 760 |
| Solar Blast | 600 | Leaf Blast | 960 | Vine Lash | 1040 |
| Spark Shot | 1080 | Thunderbolt | 680 | Wild Charge | 680 |
| Metal Strike | 1000 | Iron Barrage | 1120 | Flash Cannon | 760 |
| Tremor | 600 | Mud Blast | 960 | Earth Power | 680 |
| Bulldoze | 920 | Dark Wave | 760 | Dark Pulse | 760 |
| Night Slash | 840 | Munch | 760 | Wind Blast | 1080 |
| Wing Assault | 720 | Tackle | 1080 | Swift Movement | 880 |
| Body Slam | 720 | Mind Blast | 680 | Dragon Claw | 760 |
| Power Strike | 720 | Swarm Strike | 1200 | Poison Jab | 760 |

If Mars wants any of these changed, the change is one line per move
in `creatureCooldowns.ts`. No other file recomputes cooldowns.

## Playtest (pass 3)

1. Hold WASD — the creature glides, it does not jump tile to tile.
   Shift sprints until stamina hits 0, then it walks.
2. Walk a territorial Razorgater into chasing you around a building —
   it paths around it, it does not walk into the building tile.
3. Feed a Garden fruit in the Garden, then attack in Creature Mode —
   the HUD shows the Garden bonus % and damage is higher by that %.
4. Assign a Guardian, leave Creature Mode, save, load — the Guardian
   assignment is still there.
5. Weaken a wild to 30% HP or less, Catch with a Luigi Cube —
   Trainer Mode capture math, same as pass 2.

## Pokemon-first mapping (pass 3 additions)

- FireRed/HeartGold overworld tile collision -> same blocked set,
  per-axis, on float positions. HAVE.
- No Pokemon game in the repo has real-time cooldowns, dodge i-frames,
  or easystar pathfinding. easystarjs is open-source A*, not a Pokemon
  file, and the cooldown numbers are design values, labelled as such.
  HAVE (library + table), canon approval OWED by Mars (see table above).
