# STEP 3 — OVERWORLD PLACEMENT + FOLLOWER + FIGHT-AS SPEC (2026-10-25)

## 1. Walk format (Gen-4 style, locked)
- Every creature: `sprite-art/overworld/<creature>.walk.json`, 4 directions
  (down/up/left/right), each loop `[stand, step1, stand, step2]`.
- Right side = horizontal mirror of left, as Gen 4 does for side views,
  EXCEPT redrawn walk-frames sets, which carry distinct right frames.
- cycle_ms per movement class: small_bouncy 400, grounded_standard 480,
  hover_swim/float_hover 600, heavy_slow/seated 800, static_crystal 900,
  crawl per squirmite manifest. Cell size 64x64 RGBA throughout.
- Provenance is honest per step: `locked_walk`, `locked_stand`,
  `walk_frames_batch` (redrawn), `mirror`, `transform_*` (movement cycle,
  not new leg art). A transform-only creature is placeable and animates
  while moving; its distinct-leg walk is still counted owed in §5.

## 2. Placement data
- File: `sprite-art/overworld/placement/placement.json` — 51/51 = 100%
  creatures placed, one primary map each, across all 5 Maps.ts keys:
  sector0 9, route1 9, binarywoods 9, route4 9, cragpeak 15.
- Kinds: wild 39, wild_existing 6 (mochiIds 4,5,6,7,8,10 — the ONLY
  encounters already in Maps.ts, preserved verbatim, never overwritten),
  npc_display 6 (Ashemit shrine, Strikechamp x3 variants, Dorowani, Gabu).
- Proposed placements (45 entries) are NEW data for game wiring; the work
  clone was READ-ONLY for this step, so src/world/Maps.ts is untouched.
  Wiring step: append these as Encounter rows / NPC defs using the
  MapData shape in Maps.ts (Encounter {mochiId, rate, level}, NpcDef
  {id, x, y, sprite, name, dialog}). Rates/levels for proposed rows are
  for the wiring step to set from balance data — this spec does not
  invent them as if they were already in the game.
- FullWorldMaps cross-reference: 16 keys (SECTOR_0, AEON_LAB, ROUTE_1,
  MOCHIIPLEX_1, BINARY_FIELDS, DOJO_1, BINARY_WOODS, CAVE_OF_ECHOES,
  NEON_CITY, SCRAP_JUNKYARD, CORAL_APPROACH, CASTAGNOLI_ISLAND,
  MAUVEVILLE_ARENA, BOOT_BAY, LUIGI_MANSION, DOJO_2). DOJO_1 hosts the
  Dorowani/Gabu displays; NEON_CITY is the proposed exit hook for the
  ring zone (§4). No other FullWorld placement is claimed.

## 3. Follower-walking (party creatures follow the player)
- Source (PR #37, already on main): `sprite-art/arena-combat/follower/`
  FOLLOWER-SPEC.md + followerWalk.js + followerWalk.test.js (7 tests:
  trail rule, spacing, facing, no stacking, idle faces player).
- Overworld wiring (this step's spec, wiring itself owed to game code):
  follower renders the party leader's walk manifest (same 4-direction
  loops + cycle_ms); it trails the player's path at 1-tile spacing, faces
  the player's facing on idle, never stacks on the player tile, and uses
  the movement class of the follower creature (hover/seated/static
  creatures keep their treatment — Wispkin hovers behind, Ashemit shifts
  seated, Cocoonode pulses in place rather than walking).
- Status: spec + module + tests exist; in-game wiring 0% (game code
  change, not a sprite-art file change — flagged, not hidden).

## 4. Fight-as-Pokemon (player controls the creature in overworld encounters)
- Source (PR #37): `sprite-art/arena-combat/follower/FIGHT-AS-CREATURE-SPEC.md`
  — player controls the creature directly with its own real move data.
- Overworld wiring (this step's spec): on encounter trigger, the player
  sprite swaps to the active creature's walk set (same manifest, same
  directions); movement uses that creature's movement class; battle
  actions use real move data (MOVES_DB / decomp move data — move names
  are NEVER genericized; only creature names/sounds/art/dialogue are
  excluded per standing rule). Creature Mode lane owns the real-time
  control implementation; this spec only fixes the overworld sprite +
  encounter handoff so the two lanes agree.
- Status: spec exists; in-game wiring 0% (Creature Mode lane owns it).

## 5. Ring-capture zone placement (separate, name NOT locked)
- Zone: NEW separate retro-arcade-THEMED zone — theme/setting only
  (cabinets, neon, retro scenery as atmosphere). NOT Harbor City
  Safari/preserve. NOT literally called "Arcade Zone".
- Name: NOT locked. Candidates for Mars to pick (from
  ring-capture-zone-spec.md): The Ringcade, Neon Loop Hall, Pixel Ring Hall.
- Proposed map key: `ring_zone` (proposed only; final key assigned when
  the zone map is created). Proposed exit hook: NEON_CITY.
- Gate (unchanged): zoneVisited + zonePlayed -> ring capture unlocked ->
  shop ring items usable whenever. Default capture stays Luigi Cubes.
- Placed creatures (proposed, 8): Mochii, Kittember, Sproutle, Pixilite,
  Pupbble, Squirmite, Pyropaw, Terradog — all walk-wired. Encounter
  rates/levels for the zone are NOT set here (wiring/balance decision).

## 6. Shadows — separate layer (handoff dependency, NOT done here)
- Standing rule (Mars ~20:12 CDT): shadows are NOT part of character art;
  the engine adds shadows as a separate layer. Baked soft shadows get
  REMOVED from character art.
- Step 3 finding: NO shadow-layer module/spec exists on disk in this
  lane at check time (the Shadows replacement lane owns it). Overworld
  walk cells therefore ship as-is, and the shadow-layer module is a
  HANDOFF DEPENDENCY for game wiring — the engine must not bake the
  walk cells' soft ground marks into the sprite layer.
- Known caveat carried forward (not re-litigated): Razorgater walk down
  frames carry a ground mark from the original sheet; Razorgater hurt +
  idle cleans are APPROVED as okay (Mars ~20:11 CDT) — move on.
- The old "cutting contact shadows would float every character"
  rationale is WRONG and is not repeated anywhere in this spec.

## 7. Counts (this step, at Segment 3 checkpoint)
- Overworld loops: 51/51 = 100% (204 direction-loops).
- Placement: 51/51 = 100% placed; 5/5 Maps.ts maps covered; ring zone 8 placed.
- Follower: spec + module + 7 tests exist; wiring 0%.
- Fight-as: spec exists; wiring 0% (Creature Mode lane).
- Redrawn wired: 18/51 = 35% (Segments 2+5+6). Distinct-walk-complete
  (redrawn 18 UNION QA PASS 15, no overlap): 33/51 = 65%. Remaining
  distinct gap 18/51 = 35%: 11 movement-class loops already correct
  (treatments + hover/swim) + 7 true leg-walker distinct owed
  (Manticlaw, Pebblefist, Sproutle, Squirmite, Strikechamp_unsuited,
  Terradog, Terrapod) — see CHECKPOINT-STEP3.md Segment 6.
