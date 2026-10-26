# Tileset / background system (plan §6)

One tileset system so 30+ places are cheap recombinations — NOT 30
hand-painted backdrops. A new place is one new row in
`src/lib/tilesets/places.ts` (one primary tileset + secondaries +
biome + weather), not a new painting.

## What this PR adds (all additions, 0 deletions)

| File | What it is |
|---|---|
| `src/lib/tilesets/types.ts` | 8px tile / 16px metatile sizes, behaviour vocabulary, tileset + place shapes, Pixi layer order |
| `src/lib/tilesets/metatiles.ts` | 26-metatile catalogue with behaviour (collision / warp / encounter / ledge / surf / door / stairs / HM gates) |
| `src/lib/tilesets/tilesets.ts` | 10 primary + 6 secondary tileset registry |
| `src/lib/tilesets/places.ts` | 32-place catalogue (16 wired, 16 catalogued) |
| `src/lib/tilesets/timeOfDay.ts` | Day/night + season tints, HeartGold hour table, 1–2 s fade rules |
| `src/lib/tilesets/wfcRules.ts` | Filler gate: wild caves/dungeons/gardens only, connectivity validation, never story maps |
| `src/lib/tilesets/pixiLayers.ts` | PixiJS v8 layer renderer: sky parallax, far, ground bottom+middle, actors (Y-sorted), overhead top, weather pool (cap 200), tint overlay (incl. ColorMatrixFilter path), lightning off-switch |
| `src/lib/tilesets/selfcheck.ts` | `npx tsx src/lib/tilesets/selfcheck.ts` — cross-checks TS modules against the JSON data |
| `src/data/tilesets/backgrounds.json` | 11 biome backgrounds (sky/far/ground/platform); battle backgrounds derive from biome |
| `src/data/tilesets/weather.json` | 12 weather variants aligned to main fieldWeather.ts's weather ids 0–14; particle caps; lightning switch; 1–2 s fades |
| `src/data/tilesets/mochiichao-field.tsj` | Tiled tileset (16×16, 26 tiles, behaviour properties) — open in Tiled |
| `src/data/tilesets/example-filler-garden.tmj` | Tiled map example: filler garden, connectivity-valid, layers GroundBottom / GroundMiddle / OverheadTop |
| `tools/fetch-tilesets.sh` | Licence-gated downloader for Kenney + 0x72 packs (refuses non-CC0 packs) |

## Structure: 8×8 → 16×16 → primary + secondary

- A **tile** is 8×8 px. A **metatile** is 16×16 px = 4 tiles
  `[top-left, top-right, bottom-left, bottom-right]` and carries the
  behaviour. Maps are grids of metatiles; behaviour lives in data, so
  two tilesets can draw the same behaviour differently.
- Sheet layouts: `metatile-blocks` (8px sheet: metatile N occupies
  cells 4N..4N+3 — this is how legacy grids re-skin by index) and
  `single-16` (16px sheet: one cell IS one metatile; its quadrants
  are the 8×8 subtiles at draw time). Kenney Tiny City and 0x72 are
  16px sheets, so they use `single-16`.
- A place uses exactly **one primary** (ground/walls/water) plus any
  **secondaries** (flowers, signs, snow cover, neon signs, ruins).
  Every one of the 26 metatiles is provided by at least one primary
  (checked by selfcheck).

## Behaviour table (from WorldConstants on main, verbatim)

Passability is copied from `PASSABLE` and `HM_REQUIRED` in
`src/world/WorldConstants.ts` (main f3929e5). Legacy TILE ids 0–25
map 1:1 onto metatiles, so existing `FullWorldMaps.ts` grids convert
with `legacyRowToMetatiles()` without re-authoring. Two behaviours
are marked, not ruled: **ice** (slip rule owed to the movement lane)
and **lava** (PASSABLE says walkable on main; no damage rule exists
on main, so none is invented here).

## Pixi layers (PixiJS v8, no new dependency)

Bottom → top: `sky` (parallax 0.25) → `far` (parallax 0.5) →
`groundBottom` (Tiled `GroundBottom`) → `groundMiddle` (Tiled
`GroundMiddle`) → `actors` (Y-sorted) → `overheadTop` (Tiled
`OverheadTop`, drawn over actors) → `weather` (particle pool) →
`tintOverlay` (day/night + season tint, lightning flash).
**UI is not a layer**: UI stays React/DOM outside the canvas, so it
is exempt from tint, weather, and parallax by construction.
Palettes arrive via tint / `ColorMatrixFilter`, not per-variant
paintings. `pixi-tiledmap` can later replace the ground drawing with
the same layer order and Tiled layer names; it is deliberately NOT
vendored here so this PR adds no dependency and cannot conflict with
PR #61's `package.json` change. This renderer draws flat-colour
placeholder rectangles until a real sheet lands for a tileset — the
layer order, metatile ids, and behaviour table do not change when
art lands, only the paint does.

## Backgrounds and battle backgrounds

`backgrounds.json` defines **11 biomes**, not 30+ backgrounds.
A battle background is derived from the battled place's biome
(sky + ground + platform colours) — never a per-place painting.
The sprite lane's battle-background v2 structure (sky/ground/
platform/objects, 6 surfaces) is a separate painted-detail pass and
is not replaced by this file.

**Title backgrounds, show-first:** the 8 painted
`title-bg-*-v2.png` files on main belong to the Title Backgrounds
lane. They are NOT wired as menu backgrounds, battle backgrounds, or
anything else by this PR, and `backgrounds.json` sets
`titleBackgroundsWired: false` on purpose. Mars sees the actual PNGs
first; a later PR wires them only if approved.

## Day / night + season + weather — honest tables

- **FireRed / Emerald have no time-of-day lighting.** FireRed has no
  RTC lighting; Emerald has time-based events but no day/night tint.
  No FireRed/Emerald tint table is claimed or copied.
- **HeartGold / Crystal structure only:** an hour table plus a tint
  per bucket. The hour table used here is main fieldWeather.ts's HeartGold
  `gf_rtc` table verbatim (late 0–3, morn 4–9, day 10–16, eve 17–19,
  nite 20–23); tints are Mochiichao presentation choices, labelled
  as such.
- **Two hour tables already exist and disagree:** main
  `WorldConstants.getDayPhase` (dawn 6–10, day 10–18, dusk 18–21,
  night 21–6) vs main fieldWeather.ts's 5-bucket table. This PR unifies neither
  silently: `timeOfDay.ts` exposes both plus the mapping
  (morn→dawn, day→day, eve→dusk, nite/late→night). Unification is an
  owed coordinator / Mars decision.
- **Pre-existing tint divergence (not fixed here):**
  `PixiWorldCanvas` uses night alpha 0.38; `WorldConstants.DAY_TINT`
  uses 0.55; main fieldWeather.ts (PR #64, merged) uses nite 0.28. The tileset renderer defaults to
  the main fieldWeather.ts (PR #64, merged) value and says so; callers may override.
- **Weather:** `weather.json` aligns `fieldWeatherId` 1:1 with PR
  #64's 15-entry table (sunny 0 … tintD 14). Particles are capped at
  **200** in both JSON and code (highest variant count is 180).
  Lightning has an off-switch: `lightningFlash()` refuses to flash
  when disabled, so a missed settings check cannot flash a
  photosensitive player. Time/weather fades are **1–2 s (60–120
  frames)**; main fieldWeather.ts (PR #64, merged) source fades are preserved in
  `sourceFadeFrames` and clamped for presentation (sunny's 160
  frames = 2.67 s clamps to 120, not silently rewritten).
- **Mist / smog honesty:** the #64 table has no exact mist or smog
  entry. They use the closest tint/fog entry and say so in
  `fieldWeatherNote`; their drift particles are presentation-only.
- **Date-gated sparkle:** all 8 dates verified against main
  `fieldWeather.ts` and listed in `weather.json`.

## WFC / Markov filler — allowed set and gate

Filler (WFC/Markov) may generate ONLY wild caves, wild dungeons, and
gardens, and ONLY when `validateFillerConnectivity()` passes:
every walkable cell reachable from the entrance by flood fill, every
exit walkable and reachable, no disconnected rooms. **Story maps
are never generated** — all 16 wired places are story maps and are
excluded by id, even if a row ever said otherwise. The generator
itself lives in PR #61 (`wfc-isle.ts`); this file is the gate, not a
second generator.

## Places catalogue — counts and percentages

| Group | Count | Share |
|---|---|---|
| Places catalogued (rows defined) | 32 | 107% of the 30-place target (32/30) |
| Places with a working tileset (wired: existing main map assigned to primary + secondaries) | 16 | 53% of the 30-place target (16/30); 50% of the catalogue (16/32) |
| Places catalogued, map not yet built | 16 | 50% of the catalogue (16/32) |
| Background biomes defined | 11 | covers all 32 places (every place row points at one) |
| Weather variants wired (defaults used by place rows) | 8 of 12 defined | clear, mist, neon-rain, smog, jungle-leaves, snow, leaves, storm; sandstorm, blizzard, rain, specks defined but not yet a place default |
| Variants wired (day/night × season) | day/night 4 phases + 4 seasons, via tint | 100% of places (tint applies to every place; no per-place variant painting) |

"Working tileset" means: the place row exists, its primary +
secondaries exist in the registry, its biome exists in
`backgrounds.json`, its weather default exists in `weather.json`,
and its legacy grid converts through `legacyRowToMetatiles()`. It
does NOT mean final painted art: sheets that are null are
flat-colour placeholders in the renderer until real art lands (see
Art status). Wiring the renderer into `PixiWorldCanvas` (replacing
its inline `TILE_COLORS` with this system) is owed follow-up, not
claimed here — this PR adds the system side-by-side so no live
renderer regresses.

## Art status and licences

- **Already in repo, CC0:** 0x72 DungeonTileset II
  (`src/assets/open-source/dungeon-tileset-ii/0x72_DungeonTilesetII_v1.2.png`,
  author-confirmed CC0) — used as the `cave` primary sheet.
- **CC0, verified 2026-10-25, NOT yet downloaded (no binaries in
  this PR):** Kenney Tiny City (16×16, 130 files, CC0, attribution
  optional) for `neon-city`/`town`; Kenney Tiny Town / Tiny Dungeon
  as alternates. `tools/fetch-tilesets.sh` downloads them and
  refuses to install any pack whose licence file does not say CC0.
  Nothing is vendored until that script's licence check passes.
- **Placeholder:** all other primaries/secondaries are
  Mochiichao-original flat-colour placeholders (no art asset) until
  real art lands. No Pokemon map art, tiles, or names are used; the
  16 wired place names are reproduced verbatim from main for wiring
  only, and the 16 catalogued places use original names only.
- **No ROMs, no paid assets, no commercial art** in this PR.

## Deconfliction (verified against main f3929e5, 2026-10-26)

- Open PR #61 (Tiled/WFC adapters: `tiled-map.ts`, `wfc-isle.ts`,
  `pixi-adapter.ts`) — NOT duplicated: no file in this PR shares
  those paths or re-implements their loader/generator. This PR's
  TSJ/TMJ files are data those adapters consume.
- Main `fieldWeather.ts` (PR #64, merged) — NOT
  duplicated: no state machine is re-implemented here.
  `weather.json` is the data companion keyed to #64's ids, and
  `pixiLayers.ts` is the Pixi layer its header says a Pixi layer
  can call. Sparkle dates verified complete (8) against main.
- Open PR #63 (intro playback) — untouched, unrelated.
- Title Backgrounds lane (8 `title-bg-*-v2.png` on main) — NOT
  overwritten, NOT wired (show-first, see above).
- No `package.json` change, so no conflict with PR #61's dependency
  change. No existing file is modified at all (additions only).

## Owed after this PR (not claimed done)

1. Wire `PixiWorldCanvas` to this system (replace inline
   `TILE_COLORS` / `DAY_TINT` with metatiles + `applyTimeTint`) — a
   renderer swap, kept out of this PR so no live view regresses.
2. Unify the two hour tables + three night-tint alphas (coordinator
   / Mars decision).
3. Run `tools/fetch-tilesets.sh`, pass its CC0 check, and point the
   `town` / `neon-city` sheets at the downloaded files.
4. Build the 16 catalogued place maps from their rows (16/32 = 50%
   of the catalogue still to build) — filler may only help the 6
   filler-eligible catalogued rows, never story maps.
5. Add the `settings.weather.lightning` setting the off-switch
   documents (settings lane).
6. Ice-slip and lava-damage rules (movement lane) for the two
   behaviours flagged owed in `metatiles.ts`.
