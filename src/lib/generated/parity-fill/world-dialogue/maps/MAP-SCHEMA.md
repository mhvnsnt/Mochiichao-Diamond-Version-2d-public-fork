# Tiled JSON map shape (Mochiichao extension)

## Decomp source (shape only)
- FireRed `data/maps/<Map>/map.json`: `id`, `name`, `layout`, `music`,
  `region_map_section`, `weather`, `map_type`, `connections[]`,
  `object_events[]`, `warp_events[]`, `coord_events[]` (triggers),
  `bg_events[]` (signs). Example read for this slice: `PalletTown/map.json`,
  `PewterCity_Gym/map.json` (gym interior, `MAP_TYPE_INDOOR`, no connections).
- FireRed `data/maps/<Map>/scripts.inc`: `MapScripts` with
  `MAP_SCRIPT_ON_TRANSITION` and `MAP_SCRIPT_ON_FRAME_TABLE`, plus
  per-object scripts, `setflag` / `goto_if_set` flag checks, and badge
  flags `FLAG_BADGE01_GET..08_GET` (`include/constants/flags.h`).

## Mochiichao replacement (this slice)
A Tiled JSON file (`.json`, `orientation: orthogonal`, `tilewidth/height: 16`)
plus two Mochiichao extension keys at top level — Tiled itself does not
define these; they are the `scripts.inc` companion, kept in the same file
so one staged file is self-validating:

| Tiled / extension field | FireRed analogue | Notes |
|---|---|---|
| `layers[]` tilelayer `data[]` | `layout` tilemap | Values are `WorldConstants.ts` TILE ids 0–25 until a real tileset is wired. Validator checks length == width*height and range 0–25. |
| objectgroup objects, `type: warp` + `dest_map/dest_x/dest_y` | `warp_events[]` | Dest must be an in-code map (16 in `FullWorldMaps.ts`), a staged sample, or a declared future map (warning, not failure). |
| objects, `type: npc` + `dialogueKnot` | `object_events[]` | Dialogue lives in `dialogue/sample_dialogue.ink.json`, not inline. |
| objects, `type: sign` + `text` | `bg_events[]` type sign | Text must be non-empty. |
| objects, `type: trigger` + `condition: "NOT <flag>"` | `coord_events[]` trigger + `goto_if_set/unset` | Condition flag must be in `progression.json`'s registry. |
| objects, `type: heal_point` + `heals_party: true` | Pokemon Center heal (in Mochiichao code: `npc.isHeal`, e.g. Mom in Sector 0, MochiiPlex nurse) | Heal point is an object, not an NPC hack: it heals the party and plays its dialogue knot. |
| objects, `type: gate` + `requires_flags` | Gym / Victory Road badge gates (badge flag check before warp) | Object flag list MUST equal the gate script's flag list — validator checks both. |
| `mapScripts: {on_transition[], on_frame[]}` | `MAP_SCRIPT_ON_TRANSITION`, `MAP_SCRIPT_ON_FRAME_TABLE` | Every listed script must exist in `scripts`. |
| `scripts: {name: {kind, ...}}` | `scripts.inc` event scripts | `kind`: `warp | talk | sign | heal | trigger | gate | map_script`. Flag refs (`sets_flags`, `checks_flags`, `requires_flags`) must be in the progression registry. |
| object `x/y` (px) + `tileX/tileY` | object `x/y` (tiles in decomp) | Validator checks px == tile*16, so the file stays honest in both Tiled and tile units. |

## What this shape does NOT yet do
- No real Tiled tileset (`.tsx`) or tile graphics: tile ids are the game's
  existing numeric TILE ids. Wiring a `.tsx` is a later step.
- No Regions 2–5 maps: the two staged samples are Region 1 gate patterns
  (harbor town, Victory Route arch). Regions 2–5 remain 0/4.
- No live wiring: `FullWorldMaps.ts` is untouched by this slice (staged only).
