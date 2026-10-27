/**
 * Phase 4 registry — every non-combat system in Pokemon's own order.
 * This is the map, not the systems: each entry names its source tree(s),
 * what it wires, what it cannot wire, and its status. Combat systems are
 * deliberately ABSENT here — the sibling combat worker owns them, and
 * this file must never import or re-implement battle code.
 *
 * Order (as the trees lay it out): overworld/maps → day/night clock →
 * field weather → wild encounters → trainers → items/berries →
 * breeding/daycare → Garden (Chao lane) → contests/frontier →
 * storage/save → art pipeline.
 *
 * Arena-2D note (STUDY/REBUILD ONLY): the fan project Freakyy-11
 * Arena-2D has NO licence file, so its code and art are NEVER copied.
 * Its ideas (aimed release-to-fire attacks, real-time arena, AI shapes)
 * already exist as Mochiichao's own rebuild in
 * sprite-art/arena-combat/ (arenaCombat.js, moveData.js, fanMechanics.js).
 * This registry points at that rebuild; it does not re-derive it.
 *
 * Proprietary rule (governing, 2026-10-26 ~20:39 CDT): swap out ONLY
 * species/characters, names, images, logos, literal dialogue; cries
 * stay swapped out. Town names are NOT re-flagged. Mechanics, timing,
 * structures, orders, windows, inputs, values, and data shapes are the
 * wireable layer. No imports, no battle code. Local CPU only.
 */

export type Phase4Status = "on-main" | "added-phase4" | "owed" | "study-only" | "never";

export interface Phase4SystemEntry {
  system: string;
  order: number;
  sources: string[];
  wires: string;
  cannot: string;
  status: Phase4Status;
}

export const PHASE4_EVERYTHING_ELSE: Phase4SystemEntry[] = [
  { system: "overworld-maps", order: 1, sources: ["pokered", "pokeyellow", "pokegold", "pokecrystal", "pokeruby", "pokeemerald", "pokediamond", "pokeplatinum"], wires: "Map files, layouts, tilesets, warps, doors, hidden events", cannot: "No map art or dialogue is shipped from any tree", status: "on-main" },
  { system: "dungeon-generation", order: 1, sources: ["tools/rot.js"], wires: "Rooms + corridors + connectivity check (phase4-worldgen.ts)", cannot: "Hand-designed maps stay hand-designed; dungeons never replace them", status: "added-phase4" },
  { system: "terrain-noise", order: 1, sources: ["tools/FastNoiseLite"], wires: "Fractal value noise + biome thresholds (phase4-worldgen.ts)", cannot: "Vendored FastNoiseLite code is not copied; parameters only", status: "added-phase4" },
  { system: "tile-constraint-maps", order: 1, sources: ["tools/WaveFunctionCollapse"], wires: "WFC isle maps (already on main: wiring/wfc-isle.ts)", cannot: "Phase 4 adds no second WFC; isle scope only", status: "on-main" },
  { system: "day-night-clock", order: 2, sources: ["pokegold", "pokecrystal", "pokeruby", "pokeemerald", "pokediamond", "pokeplatinum"], wires: "Real-time-clock hour table + time-of-day encounter variation shape", cannot: "Gold-specific counts are not extracted (Crystal is the counted Gen-2 source)", status: "on-main" },
  { system: "field-weather", order: 3, sources: ["pokeruby", "pokeemerald", "pokediamond", "pokeplatinum", "pokebw2", "pokefirered-leafgreen", "pokeheartgold"], wires: "Overworld weather states + map-gated weather (already on main: fieldWeather.ts)", cannot: "Sound IDs are GAP — a Mochiichao sound must be picked before audio wiring", status: "on-main" },
  { system: "field-of-view", order: 3, sources: ["tools/rot.js"], wires: "Line-of-sight FOV sampling (phase4-worldgen.ts)", cannot: "No lighting art is shipped with FOV", status: "added-phase4" },
  { system: "wild-encounters", order: 4, sources: ["pokered", "pokeyellow", "pokecrystal", "pokeruby", "pokeemerald"], wires: "Wild table shape + time-of-day variation (counts in phase4-crosschecks)", cannot: "Diamond encounters + Platinum encounters are NOT extracted — owed", status: "owed" },
  { system: "trainers", order: 5, sources: ["pokecrystal", "pokeruby", "pokeemerald", "pokediamond", "pokeplatinum", "pokebw2", "pokeheartgold"], wires: "Trainer + party-member tables (counts in phase4-crosschecks)", cannot: "Yellow trainers are class-group shaped, not trainer-count shaped — never forced", status: "on-main" },
  { system: "items", order: 6, sources: ["pokered", "pokeyellow", "pokegold", "pokecrystal", "pokeruby", "pokeemerald"], wires: "Item table shape (held items from Gen 2 onward)", cannot: "No item art or item dialogue is shipped", status: "on-main" },
  { system: "berries", order: 6, sources: ["pokeruby", "pokeemerald", "pokediamond", "pokeplatinum"], wires: "Growth-stage machine + watering + yield + multi-patch manager (phase4-garden.ts)", cannot: "Stage lengths/yields are Mochiichao tuning, not source values", status: "added-phase4" },
  { system: "breeding-daycare", order: 7, sources: ["pokecrystal", "pokeruby", "pokeemerald", "pokediamond", "pokeplatinum", "pokefirered-leafgreen"], wires: "Daycare steps/EXP/cost/compat (creatureDaycare.ts) + step-tick helper (phase4-garden.ts)", cannot: "Diamond egg moves are NOT extracted — owed", status: "on-main" },
  { system: "garden-chao-lane", order: 8, sources: ["chao-modding-docs", "tools/sa_tools"], wires: "Garden records/cocoon/farm/races/sparring (garden-wiring.ts) + care loop (phase4-garden.ts) + pipeline stages (phase4-art-pipeline.ts)", cannot: "No Chao data, art, or names are copied; sa_tools stages only", status: "added-phase4" },
  { system: "contests", order: 9, sources: ["pokeruby", "pokeemerald", "pokediamond", "pokeplatinum"], wires: "Contest system shape (appeal rounds, condition stats, judging)", cannot: "Contest move tables are NOT extracted to JSON; no contest art/music", status: "owed" },
  { system: "battle-frontier-tower", order: 9, sources: ["pokecrystal", "pokeruby", "pokeemerald", "pokeplatinum"], wires: "Streak + facility-rule + points-ladder shapes; Platinum regulation/validation shape", cannot: "Frontier facility art is not shipped; this is a system shape, not a playable facility", status: "owed" },
  { system: "underground-secret-base", order: 9, sources: ["pokediamond", "pokeplatinum", "pokeruby", "pokeemerald"], wires: "Underground inventory + secret-base room/decoration shapes", cannot: "Multiplayer portions are not wired (no network play in this phase)", status: "owed" },
  { system: "safari-zone", order: 9, sources: ["pokeruby", "pokeemerald"], wires: "Limited-steps/balls, flee/catch-only rules shape", cannot: "No safari art or map is shipped", status: "owed" },
  { system: "follower-companion", order: 9, sources: ["pokeyellow"], wires: "Companion-follows-player + reaction shape (ancestor of the arena follower idea)", cannot: "Follower art/cries are NOT wired (cries stay swapped)", status: "study-only" },
  { system: "phone-radio-decorations", order: 9, sources: ["pokegold", "pokecrystal"], wires: "Phone-contact/rematch, radio-channel, room-decoration shapes", cannot: "No phone/radio audio or dialogue is shipped", status: "study-only" },
  { system: "storage-save", order: 10, sources: ["pokeruby", "pokeemerald", "pokediamond", "pokeplatinum", "tools/pkhex", "tools/pknx"], wires: "Storage-box shape (saveSystem.ts, wiring/save-store.ts) + personal-table + legality-checklist shapes (phase4-data-shapes.ts)", cannot: "GPL-3.0 PKHeX/pkNX code is NEVER copied; shapes only, tables passed in", status: "added-phase4" },
  { system: "binary-tooling", order: 10, sources: ["tools/dsdecmp", "tools/ndstool"], wires: "Compression-kind + NDS header-field descriptors, offline tooling only (phase4-data-shapes.ts)", cannot: "No ROM bytes are read or shipped by the game; no DS binaries", status: "added-phase4" },
  { system: "art-pipeline", order: 11, sources: ["tools/venv-rembg", "tools/image-editing", "tools/sa_tools"], wires: "Background-removal + masked-edit job specs + sprite validation (phase4-art-pipeline.ts)", cannot: "Jobs are offline authoring jobs; the game ships finished art, not the tools", status: "added-phase4" },
  { system: "arena-2d-rebuild", order: 11, sources: ["fan-reference/Freakyy-11_Arena-2D"], wires: "REBUILD ONLY: Mochiichao's own sprite-art/arena-combat/ code (already built, not in this PR)", cannot: "NO licence file exists — code/art are NEVER copied or shipped from the fan project", status: "study-only" },
  { system: "gen5plus-crosscheck", order: 12, sources: ["gen5plus (PokeAPI CSV)"], wires: "Data-shape validation only: 532 species / 871 moves / 8,541 learnsets / 380 evolutions (counts + shapes)", cannot: "No Gen 5–9 decomp code exists on disk — no Gen 5–9 system is wired", status: "study-only" },
  { system: "true-elements-chart", order: 12, sources: ["battleTypeChart.ts (game's own)"], wires: "NOTHING in this phase: list locked at 19 (Deep separate, option A, 2026-10-26 ~21:13 CDT); matchup values still owed", cannot: "Chart switching is a Mars decision, not a wiring default; sibling/combat lane territory", status: "owed" },
];

export function phase4RegistrySummary(): { total: number; onMain: number; addedPhase4: number; owed: number; studyOnly: number } {
  const total = PHASE4_EVERYTHING_ELSE.length;
  const count = (s: Phase4Status): number => PHASE4_EVERYTHING_ELSE.filter((e) => e.status === s).length;
  return { total, onMain: count("on-main"), addedPhase4: count("added-phase4"), owed: count("owed"), studyOnly: count("study-only") };
}

export const ARENA_REBUILD_LABEL = "STUDY/REBUILD ONLY — Freakyy-11 Arena-2D has no licence file; ideas rebuilt in Mochiichao's own code at sprite-art/arena-combat/, never copied.";
