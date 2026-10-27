# Overworld cross-generation mapping — Worker 3/6 (staged only)

Date: 2026-10-26. Order: wire everything 100% just how the source games do it,
using actual files/code from all generations on disk. Read order followed:
FireRed first, then HeartGold, then Black 2, then the other generations on disk.

Staged only. No git commit, no PR creation/merging, 0 deletions, no edits to
the dirty work tree, and no edits to `black2-everything-else/stage2-pr/`,
`black2-everything-else/wiring/`, or any `batch-*` directory. This layer builds
ON TOP of the Black 2 whole-game coordinator's extraction and Black 2 batches
A–D; it does not redo or overwrite them.

Format per row, as ordered: source element -> Mochiichao replacement in that
exact spot -> HAVE / NEED TO MAKE, with counts.

## Proprietary rule applied (standing, 2026-10-26 20:39)

Swap out ONLY: creature species/characters, creature names, creature images,
logos, and actual literal dialogue; creature-voice audio goes in the swap
bucket too. Literally everything else is usable at 100%: code, move names /
moves, systems, structure, values. Sanitized code only in this directory:
source identifiers are renamed to Mochiichao names, swap-bucket strings are
stripped and counted (see Verification), and zone/place identifiers are
anonymous IDs only (`zone_000` style). No place-name strings, no creature-name
strings, no character-name strings, and no literal dialogue appear anywhere
in this directory's outputs.

## Already staged by earlier batches — NOT redone here

| Staged item | Count | Wiring to the game |
| --- | --- | --- |
| Black 2 lighting sets (field + battle) | 210/210 = 100% (200 field + 10 battle; 15 periods per set; 4 lights per period; 3,150 periods; 12,600 lights) | 0/3 staged categories wired to a game view (stage-2 plan only) |
| Black 2 field zones, anonymous IDs, 14 kept fields each | 615/615 = 100% | 0 wired to a game map |
| Black 2 encounter sets (all-year + seasonal) | 135/135 = 100% (122 all-year, 13 seasonal, 174 season blocks counting each all-year block once + 4 blocks per seasonal set, 7,136 slots) | 0 wired to a game map |
| Black 2 code summaries (batch F): overworld/movement/field | 177 files, 68,626 lines, 3,819 functions | Summary only, 0 wired |
| Black 2 code summaries (batch F): weather | 8 files, 3,302 lines, 196 functions | Summary only, 0 wired |
| Black 2 code summaries (batch F): camera | 8 files, 3,920 lines, 269 functions | Summary only, 0 wired |
| Black 2 code summaries (batch F): day/night/time/seasons | 6 files, 577 lines, 47 functions | Summary only, 0 wired |
| Black 2 field directories inventoried in batch B, content NOT extracted there | 9 directories (areas, matrices, scripts, events, actors, props, trades, places, map-model/texture assets), content 0% in that batch | 0 added by this layer; see Zones NEED item 8 |

This layer's new contribution is the CROSS-GENERATION code-flow layer: the
structures, constants, formulas, and step orders from every generation on
disk, compared against each other and against what the Mochiichao game
already has. It adds 0 new field-directory extractions and 0 new
Black 2 data files.

## Files read (paths verified on disk, read-only)

FireRed (`~/workspace/mochiichao-work/fresh-start/pokefirered-leafgreen`):
- `src/wild_encounter.c` (784 lines), `include/wild_encounter.h`
- `src/field_weather.c` (1,147 lines), `include/field_weather.h`,
  `include/constants/weather.h`, `include/constants/field_weather.h`
- `src/field_camera.c` (572 lines), `include/field_camera.h`
- `src/overworld.c` (3,563 lines), `include/overworld.h`
- `src/fieldmap.c` (951 lines), `include/global.fieldmap.h` (map-header struct)
- `src/field_control_avatar.c` (1,182 lines), `include/field_player_avatar.h`
- `src/data/wild_encounters.json` (264 header entries: land tables in 226,
  water in 100, fishing in 100, rock-smash in 28)
- `include/constants/map_types.h` (map types 0–9)

HeartGold (`~/workspace/mochiichao-work/fresh-start/pokeheartgold`):
- `src/field/encounter_check.c` (1,429 lines), `include/wild_encounter.h`,
  `include/encounter.h`, `include/encounter_tables_narc.h` (143 table
  entries: 146 `ENCDATA_` defines minus the NA define and 2 NARC defines)
- `src/field/field_control.c` (1,163 lines), `include/field/field_control.h`
- `src/camera.c` (390 lines), `src/camera_translation.c` (141 lines),
  `include/camera.h`, `include/camera_translation.h`
- `src/gf_rtc.c` (227 lines), `include/gf_rtc.h`
- `src/field_system_rtc_weather.c` (40 lines),
  `include/field_system_rtc_weather.h`, `include/constants/weather.h`
- `include/map_header.h` (map-header struct + map-type enum)
- `include/field/area_light.h`, `src/brightness.c` (141 lines),
  `src/field/fieldmap.c` (830 lines, area-light hookup)

Black 2 (`~/workspace/mochiichao-work/fresh-start/pokebw2`):
- `src/system/zone_weather.c` (149 lines), `include/system/zone_weather.h`
- `src/system/season.c` (48 lines), `include/system/season.h`
- `src/ov036/weather.c` (293 lines), `src/ov036/weather_task.c` (1,005 lines),
  `include/field/field_weather.h`
- `src/ov036/field_camera.c` (1,056 lines), `src/ov036/entrance_camera.c`
  (892 lines), `src/ov036/field_camera_anime.c` (451 lines),
  `include/field/field_camera.h`
- `src/ov036/field_encount.c` (506 lines), `include/field/encounter.h`
- `src/ov036/field_light.c` (473 lines), `src/ov036/field_fog.c` (172 lines)
- `src/ov036/field_player.c` (566 lines), `src/ov036/field_player_core.c`
  (754 lines), `src/ov036/field_player_grid.c` (1,627 lines),
  `src/ov036/field_player_grid_event.c` (720 lines),
  `src/ov036/field_player_nogrid.c` (1,259 lines)
- `src/ov012/ev_time.c` (151 lines), `src/system/playtime.c` (112 lines),
  `src/system/playtime_ctrl.c` (54 lines)
- `res/field/zones/` (615 data files + 1 schema file),
  `res/field/encounters/` (135 data files + 1 schema file),
  `res/lighting/` (210 data sets + 1 schema file)

Other generations (`~/workspace/mochiichao-work/decomps/`):
- Emerald: `src/wild_encounter.c` (967 lines), `src/field_weather.c`
  (1,105 lines), `src/field_camera.c` (507 lines), `src/overworld.c`
  (3,218 lines), `include/constants/weather.h`, `include/constants/map_types.h`
- Ruby: `src/wild_encounter.c` (725 lines) + the same field/weather/camera/
  overworld file set as Emerald
- Crystal: `engine/overworld/` (movement, player step, time, wild tables),
  `engine/rtc/`, `data/wild/` (14 files, 3,647 lines incl. probabilities table)
- Gold: same assembly layout family as Crystal (overworld / rtc / wild data)
- Yellow / Red: `engine/overworld/`, `engine/wild/` (no field-weather,
  no real-time day/night system in the code read)
- Diamond: `include/camera.h`, `include/encounter.h`, `include/field_system.h`,
  `include/field_system_rtc_weather.h`, `include/gf_rtc.h`
- Platinum: `src/field_overworld_weather.c` (424 lines), `src/camera.c`
  (484 lines), `src/field_system.c` (360 lines), `src/map_header.c`
  (305 lines), `include/map_header.h`, `include/constants/overworld_weather.h`

Mochiichao game, work clone (existence checked read-only, not edited):
- `src/world/WorldEngine.tsx` (tile-step move, held-direction poll,
  tall-grass trigger, weather lookup, day-phase lookup)
- `src/world/WorldConstants.ts` (tile table, passable table, field-move
  requirements, day-phase bands + tints + ambient colours, weather config)
- `src/world/Maps.ts`, `src/world/FullWorldMaps.ts` (map headers, per-map
  weather field, per-map encounter pools, exits/doors)
- `src/components/game/PixiWorldCanvas.tsx` (follow-camera world picture)
- `src/lib/generated/` reference data (incl. 4 cross-generation encounter
  reference files for the Crystal / Emerald / Ruby / Yellow extractions,
  plus the Black 2 / FireRed / HeartGold / Diamond reference sets) —
  reference data only, NOT counted as game wiring below

Verification gap found while checking HAVE: the earlier Black 2 wiring map
mentions a `fieldWeather.ts` on main at a later head, but no such file was
found in this work clone's `src/`. It is therefore NOT counted as HAVE here;
re-verify on live main before any wiring step claims it.

## Cross-generation findings (values, not interpretations)

- Encounter slot counts are stable across generations: land 12, surf/water 5
  in FireRed / HeartGold / Black 2; rock-smash 5 in FireRed, 2 in HeartGold;
  fishing 10 in FireRed, 5 per rod tier in HeartGold / Black 2.
- Encounter-rate math is NOT stable: FireRed uses a 0–1600 scale, HeartGold
  uses a two-stage 0–100 roll, Black 2 uses a climbing rate with 12 configs.
  A single shared formula would be wrong for at least two generations; the
  snippets keep all three, side by side.
- Weather-code sets differ per generation and per game (see Weather rows);
  numeric codes are carried, meanings are NOT assigned here (Mars-only, below).
- Day/night exists in Crystal/Gold (real-time clock + time-of-day palettes),
  HeartGold (5 RTC periods), Diamond/Platinum (day/night music split),
  Black 2 (lighting periods by day-seconds + season). FireRed, Red, and
  Yellow have no real-time day/night period system in the field code read.
- Seasons exist only in Black 2 among the generations read: season =
  (month − 1) % 4, four seasons, with seasonal encounter blocks.
- Camera moves 2D tile-scroll (FireRed) -> 3D perspective/orthographic with
  distance + angle + history (HeartGold) -> defaults + rect/circle boundaries
  + entrance/event cameras (Black 2). Projection is a per-zone value in
  Black 2 (0 in 441/615 zones, 1 in 174/615 zones; meaning of each value is
  Mars-only, not assigned here).

## Mapping

### 1. Overworld movement / field flow — HAVE 4/17 = 24%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 1.1 | Tile-step move + held-direction poll (all gens, field control) | `WorldEngine.tsx` move + held-direction interval (140 ms, 70 ms fast-forward) | HAVE |
| 1.2 | Passable / tile-behavior table (all gens) | `WorldConstants.ts` tile table (26 tile codes) + passable table | HAVE |
| 1.3 | Exits / doors / warp tiles + map change (all gens) | `FullWorldMaps.ts` exits + doors + warp tiles; `WorldEngine.tsx` map change | HAVE |
| 1.4 | Interact key + pause key handling on the field | `WorldEngine.tsx` keyboard handling (interact, pause) | HAVE |
| 1.5 | Walk speeds: slow / normal / fast / faster (FireRed player-avatar functions) | A speed state on the player move, same slots as 1.1 | NEED TO MAKE |
| 1.6 | Run + run-slow states (FireRed player-avatar functions) | A run state gated the same way as 1.5 | NEED TO MAKE |
| 1.7 | Bike state + bike camera pan-back flag (FireRed field camera) | A bike state + camera pan-back, same slots as 1.5/1.6 | NEED TO MAKE |
| 1.8 | Surf state on water tiles (FireRed / HeartGold field control) | A surf state on water tiles, gated by field-move requirement table (already HAVE: 4 requirements incl. water) | NEED TO MAKE |
| 1.9 | Water-current glide / ride (FireRed player-avatar functions) | A current state on flowing-water tiles | NEED TO MAKE |
| 1.10 | Ledge jump (FireRed player-avatar functions) | A ledge-jump move on ledge tiles | NEED TO MAKE |
| 1.11 | Grid player vs no-grid player (Black 2: grid files 1,627 + 720 lines; no-grid file 1,259 lines) | One player controller with a grid mode and a free mode, same slot as 1.1 | NEED TO MAKE |
| 1.12 | Field flow order: load map -> fade -> overworld loop -> warp-out / warp-in (FireRed overworld callbacks) | The map-change sequence in `WorldEngine.tsx`, in that order | NEED TO MAKE |
| 1.13 | Object-event / NPC movement types + tracking-by-camera flag (FireRed object events) | NPC movement in the world renderer, same slot as the player move | NEED TO MAKE |
| 1.14 | Field-move gating on tiles: rock / cut / waterfall requirements (Mochiichao table already lists 4) applied at the tile, not just listed | Tile-gate checks in the move function, same slot as 1.2 | NEED TO MAKE |
| 1.15 | Step counters: repel steps, encounter-rate buff steps (FireRed wild-encounter state) | Step counters carried on the player state | NEED TO MAKE |
| 1.16 | Tall-grass / terrain check before any encounter roll (all gens: terrain decides the encounter type) | Terrain check in the move function before the encounter roll (see §2) | NEED TO MAKE |
| 1.17 | Warp kinds: fixed warp, dynamic warp, escape warp, dive/hole warp, heal-location warp (FireRed overworld warp functions) | Warp kinds on the exit definitions in `FullWorldMaps.ts` | NEED TO MAKE |

### 2. Encounters: table structure + rates — HAVE 2/18 = 11%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 2.1 | Tall-grass trigger + pool pick (current game) | `WorldEngine.tsx` tall-grass branch (tile 6, flat 0.15 chance, first pool, uniform pick) | HAVE |
| 2.2 | Per-map encounter pools (current game) | `Maps.ts` / `FullWorldMaps.ts` per-map `encounters` pools | HAVE |
| 2.3 | FireRed rate test: scale max 1600; test rate × 16; failed-roll buff adds rate × 16 / 200; dice roll `random % 1600 < rate`; clamp at max | Encounter roll in the move function, replacing the flat 0.15 in 2.1 | NEED TO MAKE |
| 2.4 | FireRed slot tables: land 12 slots at cumulative % [20,20,10,10,10,10,5,5,4,4,1,1]; water/rock 5 slots at [60,30,5,4,1]; fishing 10 slots at [70,30,60,20,20,40,40,15,4,1] | Slot tables on each map's pool, same slot as 2.2 | NEED TO MAKE |
| 2.5 | FireRed rate modifiers: flute-type item +50% / −50%, held-item modifier, lead-ability halving/doubling, repel level suppression + step counter | Modifier step in the roll, before the dice roll in 2.3 | NEED TO MAKE |
| 2.6 | HeartGold two-stage roll: base 40; −20 walking (not cycling/surfing); +40 very-tall grass; +30 cycling; step-count boost 0/30/40/60 at 0/2/3/4+ steps; audio-sequence modifier +25 / −25; clamp 100; then second roll vs the table rate | Encounter roll, as the HeartGold variant alongside 2.3 | NEED TO MAKE |
| 2.7 | HeartGold land slot roll (12 slots): cumulative % [20,20,10,10,10,10,5,5,4,4,1,1] | Land slot roll, same slot as 2.4 | NEED TO MAKE |
| 2.8 | HeartGold surf slot roll (5 slots): [60,30,5,4,1] | Surf slot roll | NEED TO MAKE |
| 2.9 | HeartGold fishing slot roll (5 slots per rod): [40,30,15,10,5] | Fishing slot roll | NEED TO MAKE |
| 2.10 | HeartGold rock-smash roll (2 slots): [80,20]; headbutt roll (6 slots): [50,15,15,10,5,5] | Rock-smash + headbutt slot rolls | NEED TO MAKE |
| 2.11 | HeartGold time-of-day slot sets: one level list shared across 3 time sets (morning / day / night); night-fishing slot swap for 2 rod tiers | Time-of-day pool selection before the slot roll | NEED TO MAKE |
| 2.12 | HeartGold encounter data struct: 6 table rates (walking, surfing, rock-smash, 3 rod tiers) + land/surf/rock/fishing slots + swarm slots + night-fishing slot | The pool struct on each map, same slot as 2.2 | NEED TO MAKE |
| 2.13 | Black 2 encounter data struct: 7 terrain rates (grass, dark grass, shaking grass, surf, rippling surf, fishing, rippling fishing) + flags + fishing-enable + slots grass 12 / dark grass 12 / shaking grass 12 / surf 5 / rare surf 5 / fishing 5 / rare fishing 5 | The pool struct, as the Black 2 variant alongside 2.12 | NEED TO MAKE |
| 2.14 | Black 2 climbing rate: 12 configs {increase, threshold, max, steps} (values in snippets); block counter + step counter; roll gated by steps, then `random(100) <= rate`, clamp 100 | Climbing-rate state on the player, same slot as 2.3 | NEED TO MAKE |
| 2.15 | Black 2 phenomena: shaking-grass / dust-cloud / rippling-water / flying-shadow spots + steps-since-phenomenon counter | Phenomenon spots on maps, same slot as 2.1 | NEED TO MAKE |
| 2.16 | Crystal cumulative probabilities: grass 7 slots [30,30,20,10,5,4,1]; water 3 slots [60,30,10] | Slot rolls, as the Crystal variant alongside 2.4/2.7 | NEED TO MAKE |
| 2.17 | Rod tiers + contexts: 3 rod tiers (FireRed groups: slots 0–1 / 2–4 / 5–9; HeartGold/Black 2: 5 slots per tier); special-area, contest, and swarm contexts (HeartGold encounter contexts) | Rod + context selection before the slot roll | NEED TO MAKE |
| 2.18 | Encounter-set -> map assignment + creature-constant -> roster mapping (Black 2: 135 sets, 7,136 slots; FireRed: 264 headers) | Map-pool assignment in `FullWorldMaps.ts`, same slot as 2.2 | NEED TO MAKE — Mars-only (see Owed) |

### 3. Weather states + transitions — HAVE 2/11 = 18%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 3.1 | Per-map weather field (current game) | `FullWorldMaps.ts` per-map `weather` field | HAVE |
| 3.2 | Weather config: 6 states (clear, mist, neon rain, smog, jungle, snow) each with fog + particle kind | `WorldConstants.ts` weather config, same slot as 3.1 | HAVE |
| 3.3 | FireRed weather state machine: current + next weather, 4 palette states (changing / fading in / fading out / idle), gamma-shift tables (19 × 32), blend coefficients + target blend with delay, drought stages | Weather state in the world renderer, replacing the static config lookup in 3.2 | NEED TO MAKE |
| 3.4 | FireRed weather ID set: numeric codes 0–15 + 20/21 cycle codes; sprite counts: rain 24, clouds 3, horizontal fog 20, ash 20, sandstorm 20 + swirl 5 | Weather-state table, same slot as 3.2 | NEED TO MAKE |
| 3.5 | HeartGold weather ID set: numeric codes 0–13 + a date-gated override (8 calendar dates, one summit-type map, generic rule only) | Weather-state table, same slot as 3.2 | NEED TO MAKE |
| 3.6 | HeartGold weather runtime / particle system (field-system weather manager is an opaque pointer in the code read; no particle/task implementation was located in the readable field sources) | Weather particle runtime, same slot as 3.3 | NEED TO MAKE |
| 3.7 | Platinum weather ID set: numeric codes 0–16 + 23/26/27/28/29/30 + yearly range of 5 codes from base 32 + special codes 1001/1002 | Weather-state table, same slot as 3.2 | NEED TO MAKE |
| 3.8 | Black 2 weather system: 15 weather overlays; two-task transitions (sequential vs crossfade); per-weather particle, fog, light, and billboard APIs (weather task, 1,005 lines) | Weather task in the world renderer, same slot as 3.3 | NEED TO MAKE |
| 3.9 | Black 2 zone-weather precedence, in order: forced value -> linked-game forest value -> event-flag value -> birthday value -> seasonal-calendar value -> zone default value (numeric codes only; specific zone IDs and flag numbers withheld) | Weather resolution at map load, before 3.1 is applied | NEED TO MAKE |
| 3.10 | Black 2 field-weather -> battle-weather conversion function | Battle-weather input in the battle view | NEED TO MAKE |
| 3.11 | Weather-code -> Mochiichao-state mapping (Black 2 zone codes observed: 0 in 610/615 zones, 3 in 2, 9 in 2, 12 in 1; FireRed / HeartGold / Platinum code sets differ) | The mapping from numeric code to a 3.2 state, per map | NEED TO MAKE — Mars-only (see Owed) |

### 4. Camera / projection — HAVE 1/6 = 17%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 4.1 | Follow-camera world picture (current game) | `PixiWorldCanvas.tsx` camera following the player | HAVE |
| 4.2 | FireRed field camera: camera object with callback, pixel offsets (total X/Y), pan-ahead callback, bike pan-back, tilemap scroll update | Camera object in the world renderer, same slot as 4.1 | NEED TO MAKE |
| 4.3 | HeartGold camera: perspective vs orthographic type; field-of-view (sine/cosine), aspect, near/far planes; look-at position / target / up; distance + angle; history buffer with per-axis enable flags; translation-path interpolation stepping distance, angle-X, perspective, and position | Camera struct in the world renderer, same slot as 4.1 | NEED TO MAKE |
| 4.4 | Black 2 field camera: defaults (zoom, pitch, yaw, field-of-view, near/far, bind flag, target); rect/circle boundaries (shape, apply-to, bounds/center/radius/angles); entrance camera (arrival/departure); event-camera animation (start/end coords + per-channel animate flags); zoom task | Camera defaults + boundaries per map, same slot as 4.1 | NEED TO MAKE |
| 4.5 | Black 2 zone projection values: 0 in 441/615 zones, 1 in 174/615 zones (values only, meaning not assigned) + zone camera values: 0 in 538/615 zones, 30+ other values | Per-map projection + camera fields on `FullWorldMaps.ts` headers | NEED TO MAKE — Mars-only for value meanings (see Owed) |
| 4.6 | Black 2 zone camera-bound field (default value 65535 in the staged data) + HeartGold 6-bit camera type + Platinum camera-type byte | Per-map camera-bound field, same slot as 4.5 | NEED TO MAKE |

### 5. Lighting periods — HAVE 2/7 = 29%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 5.1 | Day-phase hour bands: dawn 6–10, day 10–18, dusk 18–21, night otherwise (current game) | `WorldConstants.ts` day-phase function | HAVE |
| 5.2 | Day-phase tints + ambient colours: 4 phases (dawn / day / dusk / night) | `WorldConstants.ts` tint + ambient tables, applied in the world renderer | HAVE |
| 5.3 | Black 2 lighting sets, already staged: 210 sets, 15 periods per set, 4 lights per period; per period: end hour/minutes + per-light enabled/colour/direction + diffuse / ambient / specular / emission / fog / clear triples | Lighting-period lookup in the world + battle renderers, same slot as 5.2 | NEED TO MAKE |
| 5.4 | Black 2 field-light runtime: max 16 entries; entry picked by day-seconds; end second adjusted by season; colour + direction interpolation over frames; flash state | Light interpolation in the world renderer, same slot as 5.2 | NEED TO MAKE |
| 5.5 | Black 2 lighting-set -> location/time assignment (staged zones carry no lighting-set link) | Per-map lighting-set field on `FullWorldMaps.ts` headers | NEED TO MAKE — Mars-only (see Owed) |
| 5.6 | HeartGold area-light manager (per-area light archive ID) + brightness transitions (step count, target/start brightness, surface masks) | Area-light lookup + brightness transition in the world renderer | NEED TO MAKE |
| 5.7 | FireRed global tint mode + weather gamma application to palettes | Palette tint application in the world renderer, same slot as 5.2 | NEED TO MAKE |

### 6. Zone / map-type structure — HAVE 2/10 = 20%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 6.1 | Map headers with weather + encounters + exits (current game) | `Maps.ts` / `FullWorldMaps.ts` map headers | HAVE |
| 6.2 | Field-move-requirement table: 4 requirements (water / rock / cut / waterfall) (current game; tile + passable tables are counted in §1, not here) | `WorldConstants.ts` requirement table | HAVE |
| 6.3 | FireRed map header: layout, events, scripts, connections, music, layout ID, region-map section ID, cave flag, weather, map type, biking allowed, escape/running/show-name flags, floor number, battle type | Map-header struct, same slot as 6.1 | NEED TO MAKE |
| 6.4 | FireRed map types, numeric 0–9: none / town / city (unused by any map) / route / underground / underwater (unused) / ocean route (unused) / unknown (unused) / indoor / hidden-base (unused) | Map-type field on headers, same slot as 6.1 | NEED TO MAKE |
| 6.5 | HeartGold map header: wild-encounter bank, area-data bank, move-model bank, world-map X/Y, matrix ID, script banks, message bank, day/night music IDs, events bank, map section, area icon, region, weather (7 bits), map type (4 bits), camera type (6 bits), follow mode, battle background (5 bits), bike / running / escape-rope / fly / call / radio flags | Map-header struct, same slot as 6.1 | NEED TO MAKE |
| 6.6 | HeartGold map types, numeric: invalid / city-town / route / cave / interior / centre (unused) / underground (leftover) | Map-type field, same slot as 6.1 | NEED TO MAKE |
| 6.7 | Platinum map header: area-data archive, preloaded-objects archive, matrix ID, script archives, message archive, day/night music IDs, wild-encounter archive, events archive, label text/window, weather, camera type, map type (7 bits), battle background (5 bits), bike / running / escape-rope / fly flags | Map-header struct, same slot as 6.1 | NEED TO MAKE |
| 6.8 | Black 2 zone header, already staged: 615 zones, 14 kept fields (map type, NPC cache, weather, projection, camera, transition, battle background, cycling, escape rope, fly-from, fly X/Y/Z, camera bound, name icon, easy level); map-type values: 28 distinct values (16 in 417 zones, 0 in 143 zones, rest 1–8 zones each); battle backgrounds: 18 distinct values | Zone-header struct on `FullWorldMaps.ts` headers | NEED TO MAKE |
| 6.9 | Black 2 zone -> Mochiichao-map assignment (anonymous IDs `zone_000`–`zone_614`; no automatic link exists because place strings were stripped) | Map assignment, same slot as 6.1 | NEED TO MAKE — Mars-only (see Owed) |
| 6.10 | Cross-generation matrix/layout system + Black 2 dropped zone fields: FireRed layout + connections, HeartGold matrix ID, Black 2 matrices (417 files), areas (410), scripts (1,289), events (617), actors (2,952), props (21,321), map assets (39,377 files) — content 0% extracted in batch B, 0 added here | Layout/matrix layer under the map headers | NEED TO MAKE |

### 7. Day / night / seasons / calendar — HAVE 1/8 = 13%

| # | Source element | Mochiichao replacement in that spot | Status |
| --- | --- | --- | --- |
| 7.1 | Day-phase function by hour (current game) | `WorldConstants.ts` day-phase function (same function as 5.1; it serves both systems, so it appears in both systems' rows — see counting basis below) | HAVE |
| 7.2 | HeartGold real-time clock periods by hour: late 0–3, morning 4–9, day 10–16, evening 17–18, night 19–23; wild-encounter mapping: morning / day / night | Clock-period function in the world renderer, same slot as 7.1 | NEED TO MAKE |
| 7.3 | HeartGold / Diamond / Platinum day/night music split: separate day + night music IDs per map header | Per-map day/night music fields, same slot as 6.1 | NEED TO MAKE |
| 7.4 | Crystal / Gold real-time clock: time-of-day palettes + daily timers | Time-of-day palette step in the world renderer | NEED TO MAKE |
| 7.5 | Black 2 event-time + playtime: day, day period, month, weekday, hour, minute, midnight check; playtime hours/minutes/seconds + last-saved date/time | Clock + playtime state in the save shape | NEED TO MAKE |
| 7.6 | Black 2 seasons: season = (month − 1) % 4; order spring / summer / autumn / winter; next / previous; force-season-sync flag; season-banner event | Season state in the world renderer, same slot as 7.1 | NEED TO MAKE |
| 7.7 | Black 2 seasonal encounters: 13 seasonal sets × 4 season blocks (part of the 174 blocks in the staged data) + seasonal light-end-hour adjustment | Season-block selection before the slot roll (see §2) | NEED TO MAKE |
| 7.8 | Season clock source: real device clock vs in-game clock (Black 2 reads the device date; HeartGold reads the device clock) | Clock-source choice for 7.2/7.6 | NEED TO MAKE — Mars-only (see Owed) |

## Totals — cross-generation code-flow layer only

| System | HAVE | NEED | Total | % HAVE |
| --- | --- | --- | --- | --- |
| 1. Movement / field flow | 4 | 13 | 17 | 24% |
| 2. Encounters | 2 | 16 | 18 | 11% |
| 3. Weather | 2 | 9 | 11 | 18% |
| 4. Camera / projection | 1 | 5 | 6 | 17% |
| 5. Lighting | 2 | 5 | 7 | 29% |
| 6. Zones / map types | 2 | 8 | 10 | 20% |
| 7. Day / night / seasons | 1 | 7 | 8 | 13% |
| **Total** | **14** | **63** | **77** | **18%** |

Counting basis: totals count per-system items. One shared game function can
legitimately appear in two systems' rows (day-phase function in §5 and §7);
the 77 is a per-system-item total, not a distinct-file total. Within any one
system, no item is counted twice.

Staged-data totals are separate from the 77 above and are NOT double-counted:
Black 2 lighting 210/210 = 100% staged, zones 615/615 = 100% staged,
encounters 135/135 = 100% staged; game wiring of those three categories is
0/3 = 0% (stage-2 plan only, from the earlier wiring map). Overall overworld
position, stated honestly: data staged 960/960 = 100% for those three Black 2
categories, code-flow layer HAVE 14/77 = 18%, game wiring 0/77 = 0% for the
new cross-generation items in this layer.

## Gaps to 100% (with counts)

- Movement speeds/states owed: 13 items (§1 NEED), incl. 6 speed variants
  counted inside items 1.5–1.6 (walk slow/normal/fast/faster, run, run-slow).
- Encounter flow owed: 16 items (§2 NEED), incl. 3 rate systems that must
  NOT be merged into one formula (FireRed 1600-scale, HeartGold two-stage,
  Black 2 climbing).
- Weather owed: 9 items (§3 NEED), incl. 4 per-generation code sets that
  differ and must NOT be merged into one table without the Mars-only mapping.
- Camera owed: 5 items (§4 NEED).
- Lighting owed: 5 items (§5 NEED); the 210 staged sets are data, not wiring.
- Zone owed: 8 items (§6 NEED), incl. the 9 inventoried Black 2 field
  directories whose content is 0% extracted (see staged ledger).
- Day/night/seasons owed: 7 items (§7 NEED); seasons exist only in Black 2
  among the generations read, so a Mochiichao season system is new work, not
  a port of a shared system.
- Reference encounter files already in the work clone's generated folder
  (Crystal / Emerald / Ruby / Yellow, 4 files) are reference data, not game
  wiring; wiring them is part of §2 NEED item 2.18, not a separate HAVE.

## Mars-only decisions owed (NOT invented here)

1. Zone -> Mochiichao-map assignments: 615 anonymous Black 2 zones
   (`zone_000`–`zone_614`) + 264 FireRed headers + 143 HeartGold table
   entries — no automatic link exists; assignment per map is Mars's call.
2. Weather-code interpretation: Black 2 zone codes (0/3/9/12), FireRed
   codes (0–15, 20, 21), HeartGold codes (0–13), Platinum codes
   (0–16, 23, 26–30, 32–36, 1001, 1002) -> Mochiichao weather states.
   Numeric codes only are carried here; no meaning is assigned.
3. Black 2 projection values (0/1) and camera values (0 + 30+ others) ->
   Mochiichao camera/projection settings, per map.
4. Black 2 lighting-set assignment: which of the 210 staged sets belongs to
   which Mochiichao location/time (zones carry no lighting-set link).
5. Encounter-set -> roster mapping: staged slots reference the source
   roster; the Mochiichao roster is 47 canon creatures + starters, so most
   slots cannot be used verbatim and need a roster decision per slot group.
6. Season clock source: real device clock vs in-game clock for day/night
   and season state.
7. Field-weather file on main: the earlier wiring map's `fieldWeather.ts`
   was not found in this work clone — confirm on live main whether it
   exists there before counting any weather wiring as HAVE.

## Verification

- All source paths above were listed on disk before writing; no source
  file was edited (read-only reads only).
- Sanitization grep (see companion snippet file's header for the method):
  750 zone + encounter filename stems + 130 distinct creature tokens from
  the FireRed wild-encounter reference file were checked against every file
  in this directory: 0 hits. The snippet file's own source
  creature-constant token count is 0; its creature references use a
  generic `creatureRef` string ID.
- Stripped in the snippets (renamed, not copied): every source function /
  type / constant name that named a creature, a character, a place, or a
  literal dialogue string — 0 such strings remain; counts of renamed
  declarations are in the snippet file header.
- No git commands were run for this layer. 0 deletions. 0 files in
  `black2-everything-else/` were touched.
