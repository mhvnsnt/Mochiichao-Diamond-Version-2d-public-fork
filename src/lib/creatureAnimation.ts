/**
 * Creature animation registry — PIVOT PHASE 3 (2026-10-26).
 *
 * GENERATED from repo-main sources (never hand-typed): idle/hurt JSONs
 * under src/assets/sprite-atlases/animation/, attack JSONs under
 * sprite-art/animation/attack/, the articulation pipev3q manifest
 * (articulation-v2-rework-v3), the pilot manifests (mochii/dreadtoise),
 * the lane100 silhouette manifest, and spriteSheets.ts for the
 * speciesId <-> folder map. Regenerate from those sources if any of
 * them change; do not edit the tables by hand.
 *
 * What each layer is, and where it renders:
 * - idle (51 folders): transform loops from the locked battle_front cell.
 *   Rendered by CreaturePortrait when animateIdle is on (default on);
 *   static sheet cell while frames load or when no idle entry exists.
 * - hurt (51 folders): one generated hurt frame per creature. Rendered by
 *   PixiBattleCanvas: when battleTreatments' sampled pose says
 *   defenderArt === 'hurt', the target sprite swaps to this cell and
 *   swaps back when the pose returns to 'standing'.
 * - attack transform (51 folders): windup/strike/impact/recover renders of
 *   the locked battle_front cell. Registry-wired (loaders below); the
 *   Pixi timeline keeps its transform treatments for these creatures,
 *   so these frames are the follow-up polish layer, not live-rendered yet.
 *   FINISH-FIRST Item 4 (2026-10-26): PixiBattleCanvas now renders these
 *   frames as the fallback when no pilot/articulation set resolves for the
 *   attacker — see resolvePixiAttack() below. Precedence is unchanged for
 *   pilot/articulation creatures; this only fills the 25 folders that had
 *   no rendered set.
 * - articulation (24 entries, 96 sets): redrawn attack sets (physical/
 *   special/signature/heavy). Per set, the V3-queue final is used ONLY
 *   where its cell files actually exist on main (44 sets, 242 cells,
 *   11 entries); Razorgater's 4 sets render the locked take-6 final
 *   (22 cells, triangle mouth, docs/locked-versions.json CURRENT);
 *   the other 48 sets fall back to the V2 eyes-only base
 *   (264 cells, 12 entries) — the v3q manifest claims 24 entries / 528
 *   cells, but 13 entries' v3q cells were never uploaded. Mouths on
 *   45/96 sets (fresh or reuse-proof); the rest ship eyes-only, never
 *   forced. Rendered by PixiBattleCanvas for Physical -> physical and
 *   Special -> special; signature/heavy sets are registry-available
 *   for per-move selection later.
 * - pilots (mochii, dreadtoise): step-3 pilot sets, transform + procedural
 *   VFX only, 0 generations, eye-checked at 64px/enlarged, PILOT-GRADE and
 *   never shown to Mars yet (see the pilot VERIFICATION.md files).
 *   Rendered by PixiBattleCanvas by game-move match (Mochii) or by family
 *   (Dreadtoise); they stay labelled pilot in this registry until Mars
 *   sees them.
 * - silhouettes (51 files, 51 folders = 49 species + 2 Strikechamp variants): discovery
 *   silhouettes for pre-discovery display. Rendered by CreaturePortrait
 *   when undiscovered is set, and by PixiBattleCanvas as the fallback
 *   for a species with no sheet def (instead of the drawn blob). No dex
 *   view exists yet, so no live screen passes undiscovered today — the
 *   prop + registry are the wiring; the dex surface is owed.
 * - move scripts (563 union scripts, 12 shared subroutines, PR #168
 *   source): game-path copy at src/lib/generated/moveScripts.json.
 *   getMoveScript() is the accessor; 10/36 game moves.ts moves match a
 *   script by id exactly. Pixi's existing lunge/projectile/status phases
 *   ARE the Layer-1 templates those scripts describe (sub_Lunge,
 *   sub_Projectile, sub_Impact, ...); per-move step sequencing beyond
 *   category is owed, not invented here.
 * - Phase 1 map (2026-10-26): src/lib/generated/gameMoveScriptMap.json
 *   routes 25/36 more game moves to existing scripts (same type +
 *   category + timing family, per-entry evidence in that file); with
 *   the 10 exact-id matches above, 35/36 = 97% matched. IRON_BARRAGE
 *   is the 1 unmatched: its game desc says 2-5 hits but its effect
 *   field is NONE, so no script satisfies both — left unmatched, never
 *   forced, and no game data was changed to force it.
 * - SHINIES: deliberately NOT wired. The shiny-v2 set is staged
 *   show-first and NOT approved by Mars, so no shiny table, loader, or
 *   reference exists in this module. Do not add one without his approval.
 * - Dorowani ships its V2-rework EYES-ONLY attacks (0/4 V3 mouths: no
 *   distinct mouth line on the front cell, re-verified at full-res).
 *   No mouth was invented for it. Gabu V3 4/4 stands.
 */

import moveScriptsData from './generated/moveScripts.json';
import gameMoveScriptMapData from './generated/gameMoveScriptMap.json';

export type CreatureFolder = string;

export const SPECIES_FOLDER: Record<string, string> = {
  "001": "mochii",
  "002": "tiidebiite",
  "003": "aquariios",
  "004": "razorgater",
  "005": "chromejaww",
  "006": "reaperdile",
  "007": "tyrage",
  "008": "duneclaw",
  "009": "oblivirex",
  "010": "kittember",
  "011": "pyropaw",
  "012": "manticlaw",
  "013": "pupbble",
  "014": "terradog",
  "015": "quakehound",
  "016": "squirmite",
  "017": "cocoonode",
  "018": "mothrix",
  "019": "zephling",
  "020": "aerobeak",
  "021": "stormtalon",
  "022": "finblade",
  "023": "megalochrome",
  "024": "floatcalf",
  "025": "astroleviathan",
  "026": "inklet",
  "027": "toxitacle",
  "028": "krakenox",
  "029": "punchkid",
  "030": "strikechamp",
  "031": "kickmaster",
  "032": "gearkid",
  "033": "mechapion",
  "034": "gorokappa",
  "035": "pebblefist",
  "036": "cragarm",
  "037": "terrapod",
  "038": "sproutle",
  "039": "shellguard",
  "040": "dreadtoise",
  "041": "pixilite",
  "042": "wispkin",
  "043": "duskfiend",
  "044": "ashemit",
  "045": "pyromonk",
  "046": "yogiferno",
  "147": "dorowani",
  "148": "gabu",
  "331": "mythar",
};

export const FOLDER_SPECIES: Record<string, string> = {
  "aerobeak": "020",
  "aquariios": "003",
  "ashemit": "044",
  "astroleviathan": "025",
  "chromejaww": "005",
  "cocoonode": "017",
  "cragarm": "036",
  "dorowani": "147",
  "dreadtoise": "040",
  "duneclaw": "008",
  "duskfiend": "043",
  "finblade": "022",
  "floatcalf": "024",
  "gabu": "148",
  "gearkid": "032",
  "gorokappa": "034",
  "inklet": "026",
  "kickmaster": "031",
  "kittember": "010",
  "krakenox": "028",
  "manticlaw": "012",
  "mechapion": "033",
  "megalochrome": "023",
  "mochii": "001",
  "mothrix": "018",
  "mythar": "331",
  "oblivirex": "009",
  "pebblefist": "035",
  "pixilite": "041",
  "punchkid": "029",
  "pupbble": "013",
  "pyromonk": "045",
  "pyropaw": "011",
  "quakehound": "015",
  "razorgater": "004",
  "reaperdile": "006",
  "shellguard": "039",
  "sproutle": "038",
  "squirmite": "016",
  "stormtalon": "021",
  "strikechamp": "030",
  "strikechamp_unsuited": "030",
  "strikechamp_unsuited_full": "030",
  "terradog": "014",
  "terrapod": "037",
  "tiidebiite": "002",
  "toxitacle": "027",
  "tyrage": "007",
  "wispkin": "042",
  "yogiferno": "046",
  "zephling": "019",
};

export function folderForSpecies(speciesId: string | undefined | null): string | null {
  if (!speciesId) return null;
  return SPECIES_FOLDER[speciesId] ?? null;
}

export interface IdleFrame { file: string; durationMs: number; }
export interface IdleSpec { cycleMs: number; idleClass: string; frames: IdleFrame[]; }
export const IDLE: Record<string, IdleSpec> = {
  "aerobeak": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "aquariios": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "ashemit": { cycleMs: 2400, idleClass: "seated", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "astroleviathan": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "chromejaww": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "cocoonode": { cycleMs: 2200, idleClass: "static_crystal", frames: [{ file: "idle_a.png", durationMs: 600 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 600 }, { file: "idle_c.png", durationMs: 500 }] },
  "cragarm": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "dorowani": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "dreadtoise": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "duneclaw": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "duskfiend": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "finblade": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "floatcalf": { cycleMs: 1800, idleClass: "float_hover", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "gabu": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "gearkid": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "gorokappa": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "inklet": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "kickmaster": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "kittember": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "krakenox": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "manticlaw": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "mechapion": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "megalochrome": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "mochii": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "mothrix": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "mythar": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "oblivirex": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "pebblefist": { cycleMs: 2800, idleClass: "heavy_slow", frames: [{ file: "idle_a.png", durationMs: 800 }, { file: "idle_b.png", durationMs: 600 }, { file: "idle_a.png", durationMs: 800 }, { file: "idle_c.png", durationMs: 600 }] },
  "pixilite": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "punchkid": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "pupbble": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "pyromonk": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "pyropaw": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "quakehound": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "razorgater": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "reaperdile": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "shellguard": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "sproutle": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "squirmite": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "stormtalon": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "strikechamp": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "strikechamp_unsuited": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "strikechamp_unsuited_full": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "terradog": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "terrapod": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "tiidebiite": { cycleMs: 1600, idleClass: "small_bouncy", frames: [{ file: "idle_a.png", durationMs: 400 }, { file: "idle_b.png", durationMs: 400 }, { file: "idle_a.png", durationMs: 400 }, { file: "idle_c.png", durationMs: 400 }] },
  "toxitacle": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "tyrage": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "wispkin": { cycleMs: 1800, idleClass: "float_hover", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
  "yogiferno": { cycleMs: 2400, idleClass: "grounded_standard", frames: [{ file: "idle_a.png", durationMs: 700 }, { file: "idle_b.png", durationMs: 500 }, { file: "idle_a.png", durationMs: 700 }, { file: "idle_c.png", durationMs: 500 }] },
  "zephling": { cycleMs: 1800, idleClass: "hover_swim", frames: [{ file: "idle_a.png", durationMs: 450 }, { file: "idle_b.png", durationMs: 450 }, { file: "idle_a.png", durationMs: 450 }, { file: "idle_c.png", durationMs: 450 }] },
};

export interface HurtSpec { file: string; holdMs: number; }
export const HURT: Record<string, HurtSpec> = {
  "aerobeak": { file: "aerobeak_hurt_cell_00.png", holdMs: 500 },
  "aquariios": { file: "aquariios_hurt_cell_00.png", holdMs: 500 },
  "ashemit": { file: "ashemit_hurt_cell_00.png", holdMs: 500 },
  "astroleviathan": { file: "astroleviathan_hurt_cell_00.png", holdMs: 500 },
  "chromejaww": { file: "chromejaww_hurt_cell_00.png", holdMs: 500 },
  "cocoonode": { file: "cocoonode_hurt_cell_00.png", holdMs: 500 },
  "cragarm": { file: "cragarm_hurt_cell_00.png", holdMs: 500 },
  "dorowani": { file: "dorowani_hurt_cell_00.png", holdMs: 500 },
  "dreadtoise": { file: "dreadtoise_hurt_cell_00.png", holdMs: 500 },
  "duneclaw": { file: "duneclaw_hurt_cell_00.png", holdMs: 500 },
  "duskfiend": { file: "duskfiend_hurt_cell_00.png", holdMs: 500 },
  "finblade": { file: "finblade_hurt_cell_00.png", holdMs: 500 },
  "floatcalf": { file: "floatcalf_hurt_cell_00.png", holdMs: 500 },
  "gabu": { file: "gabu_hurt_cell_00.png", holdMs: 500 },
  "gearkid": { file: "gearkid_hurt_cell_00.png", holdMs: 500 },
  "gorokappa": { file: "gorokappa_hurt_cell_00.png", holdMs: 500 },
  "inklet": { file: "inklet_hurt_cell_00.png", holdMs: 500 },
  "kickmaster": { file: "kickmaster_hurt_cell_00.png", holdMs: 500 },
  "kittember": { file: "kittember_hurt_cell_00.png", holdMs: 500 },
  "krakenox": { file: "krakenox_hurt_cell_00.png", holdMs: 500 },
  "manticlaw": { file: "manticlaw_hurt_cell_00.png", holdMs: 500 },
  "mechapion": { file: "mechapion_hurt_cell_00.png", holdMs: 500 },
  "megalochrome": { file: "megalochrome_hurt_cell_00.png", holdMs: 500 },
  "mochii": { file: "mochii_hurt_cell_00.png", holdMs: 500 },
  "mothrix": { file: "mothrix_hurt_cell_00.png", holdMs: 500 },
  "mythar": { file: "mythar_hurt_cell_00.png", holdMs: 500 },
  "oblivirex": { file: "oblivirex_hurt_cell_00.png", holdMs: 500 },
  "pebblefist": { file: "pebblefist_hurt_cell_00.png", holdMs: 500 },
  "pixilite": { file: "pixilite_hurt_cell_00.png", holdMs: 500 },
  "punchkid": { file: "punchkid_hurt_cell_00.png", holdMs: 500 },
  "pupbble": { file: "pupbble_hurt_cell_00.png", holdMs: 500 },
  "pyromonk": { file: "pyromonk_hurt_cell_00.png", holdMs: 500 },
  "pyropaw": { file: "pyropaw_hurt_cell_00.png", holdMs: 500 },
  "quakehound": { file: "quakehound_hurt_cell_00.png", holdMs: 500 },
  "razorgater": { file: "razorgater_hurt_cell_00.png", holdMs: 500 },
  "reaperdile": { file: "reaperdile_hurt_cell_00.png", holdMs: 500 },
  "shellguard": { file: "shellguard_hurt_cell_00.png", holdMs: 500 },
  "sproutle": { file: "sproutle_hurt_cell_00_v2.png", holdMs: 500 },
  "squirmite": { file: "squirmite_hurt_cell_00.png", holdMs: 500 },
  "stormtalon": { file: "stormtalon_hurt_cell_00.png", holdMs: 500 },
  "strikechamp": { file: "strikechamp_hurt_cell_00.png", holdMs: 500 },
  "strikechamp_unsuited": { file: "strikechamp_unsuited_hurt_cell_00.png", holdMs: 500 },
  "strikechamp_unsuited_full": { file: "strikechamp_unsuited_full_hurt_cell_00.png", holdMs: 500 },
  "terradog": { file: "terradog_hurt_cell_00.png", holdMs: 500 },
  "terrapod": { file: "terrapod_hurt_cell_00.png", holdMs: 500 },
  "tiidebiite": { file: "tiidebiite_hurt_cell_00.png", holdMs: 500 },
  "toxitacle": { file: "toxitacle_hurt_cell_00.png", holdMs: 500 },
  "tyrage": { file: "tyrage_hurt_cell_00.png", holdMs: 500 },
  "wispkin": { file: "wispkin_hurt_cell_00.png", holdMs: 500 },
  "yogiferno": { file: "yogiferno_hurt_cell_00.png", holdMs: 500 },
  "zephling": { file: "zephling_hurt_cell_00.png", holdMs: 500 },
};

export interface AttackFrame { file: string; role: string; durationMs: number; }
export const ATTACK_TRANSFORM: Record<string, AttackFrame[]> = {
  "aerobeak": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "aquariios": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "ashemit": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "astroleviathan": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "chromejaww": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "cocoonode": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "cragarm": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "dorowani": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "dreadtoise": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "duneclaw": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "duskfiend": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "finblade": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "floatcalf": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "gabu": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "gearkid": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "gorokappa": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "inklet": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "kickmaster": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "kittember": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "krakenox": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "manticlaw": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "mechapion": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "megalochrome": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "mochii": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "mothrix": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "mythar": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "oblivirex": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "pebblefist": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "pixilite": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "punchkid": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "pupbble": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "pyromonk": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "pyropaw": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "quakehound": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "razorgater": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "reaperdile": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "shellguard": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "sproutle": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "squirmite": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "stormtalon": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "strikechamp": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "strikechamp_unsuited": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "strikechamp_unsuited_full": [{ file: "strikechamp_unsuited_full_cell_21.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_22.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_23.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_24.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_25.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_26.png", role: "attack", durationMs: 0 }, { file: "strikechamp_unsuited_full_cell_27.png", role: "attack", durationMs: 0 }],
  "terradog": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "terrapod": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "tiidebiite": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "toxitacle": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "tyrage": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "wispkin": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "yogiferno": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
  "zephling": [{ file: "attack_a_windup.png", role: "windup", durationMs: 250 }, { file: "attack_b_strike.png", role: "strike_lunge", durationMs: 120 }, { file: "attack_c_impact.png", role: "impact_hold", durationMs: 90 }, { file: "attack_d_recover.png", role: "recover", durationMs: 400 }],
};

export interface ArticSet { family: string; mouth: 'fresh' | 'reuse-proof' | 'eyes-only'; layer: 'v3q' | 'v2' | 'v3w6'; batch: string; files: string[]; }
export interface ArticSpec { sets: Record<string, ArticSet>; }
export const ARTICULATION: Record<string, ArticSpec> = {
  "ashemit": { sets: { "atk_heavy_inferno_crash_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-00.png", "ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-01.png", "ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-02.png", "ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-03.png", "ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-04.png", "ashemit-artic-pipev3q-20261026-atk_heavy_inferno_crash_finisher-cell-05.png"] }, "atk_physical_ash_charge": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["ashemit-artic-pipev3q-20261026-atk_physical_ash_charge-cell-00.png", "ashemit-artic-pipev3q-20261026-atk_physical_ash_charge-cell-01.png", "ashemit-artic-pipev3q-20261026-atk_physical_ash_charge-cell-02.png", "ashemit-artic-pipev3q-20261026-atk_physical_ash_charge-cell-03.png", "ashemit-artic-pipev3q-20261026-atk_physical_ash_charge-cell-04.png"] }, "atk_signature_flame_tail_sweep": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-00.png", "ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-01.png", "ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-02.png", "ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-03.png", "ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-04.png", "ashemit-artic-pipev3q-20261026-atk_signature_flame_tail_sweep-cell-05.png"] }, "atk_special_ember_spray": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["ashemit-artic-pipev3q-20261026-atk_special_ember_spray-cell-00.png", "ashemit-artic-pipev3q-20261026-atk_special_ember_spray-cell-01.png", "ashemit-artic-pipev3q-20261026-atk_special_ember_spray-cell-02.png", "ashemit-artic-pipev3q-20261026-atk_special_ember_spray-cell-03.png", "ashemit-artic-pipev3q-20261026-atk_special_ember_spray-cell-04.png"] } } },
  "dorowani": { sets: { "atk_heavy_deluge_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-00.png", "dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-01.png", "dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-02.png", "dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-03.png", "dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-04.png", "dorowani-artic-v2rework-20261026-atk_heavy_deluge_finisher-cell-05.png"] }, "atk_physical_glide_ram": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["dorowani-artic-v2rework-20261026-atk_physical_glide_ram-cell-00.png", "dorowani-artic-v2rework-20261026-atk_physical_glide_ram-cell-01.png", "dorowani-artic-v2rework-20261026-atk_physical_glide_ram-cell-02.png", "dorowani-artic-v2rework-20261026-atk_physical_glide_ram-cell-03.png", "dorowani-artic-v2rework-20261026-atk_physical_glide_ram-cell-04.png"] }, "atk_signature_wave_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-00.png", "dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-01.png", "dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-02.png", "dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-03.png", "dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-04.png", "dorowani-artic-v2rework-20261026-atk_signature_wave_barrage-cell-05.png"] }, "atk_special_spray_jet": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["dorowani-artic-v2rework-20261026-atk_special_spray_jet-cell-00.png", "dorowani-artic-v2rework-20261026-atk_special_spray_jet-cell-01.png", "dorowani-artic-v2rework-20261026-atk_special_spray_jet-cell-02.png", "dorowani-artic-v2rework-20261026-atk_special_spray_jet-cell-03.png", "dorowani-artic-v2rework-20261026-atk_special_spray_jet-cell-04.png"] } } },
  "floatcalf": { sets: { "atk_heavy_cloud_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v3q", batch: "batch-c", files: ["floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-00.png", "floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-01.png", "floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-02.png", "floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-03.png", "floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-04.png", "floatcalf-artic-pipev3q-20261026-atk_heavy_cloud_crash_finisher-cell-05.png"] }, "atk_physical_float_ram": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["floatcalf-artic-pipev3q-20261026-atk_physical_float_ram-cell-00.png", "floatcalf-artic-pipev3q-20261026-atk_physical_float_ram-cell-01.png", "floatcalf-artic-pipev3q-20261026-atk_physical_float_ram-cell-02.png", "floatcalf-artic-pipev3q-20261026-atk_physical_float_ram-cell-03.png", "floatcalf-artic-pipev3q-20261026-atk_physical_float_ram-cell-04.png"] }, "atk_signature_sky_barrage": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-00.png", "floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-01.png", "floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-02.png", "floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-03.png", "floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-04.png", "floatcalf-artic-pipev3q-20261026-atk_signature_sky_barrage-cell-05.png"] }, "atk_special_prism_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["floatcalf-artic-pipev3q-20261026-atk_special_prism_shot-cell-00.png", "floatcalf-artic-pipev3q-20261026-atk_special_prism_shot-cell-01.png", "floatcalf-artic-pipev3q-20261026-atk_special_prism_shot-cell-02.png", "floatcalf-artic-pipev3q-20261026-atk_special_prism_shot-cell-03.png", "floatcalf-artic-pipev3q-20261026-atk_special_prism_shot-cell-04.png"] } } },
  "gabu": { sets: { "atk_heavy_timber_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-00.png", "gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-01.png", "gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-02.png", "gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-03.png", "gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-04.png", "gabu-artic-pipev3q-20261026-atk_heavy_timber_finisher-cell-05.png"] }, "atk_physical_forest_lunge": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["gabu-artic-pipev3q-20261026-atk_physical_forest_lunge-cell-00.png", "gabu-artic-pipev3q-20261026-atk_physical_forest_lunge-cell-01.png", "gabu-artic-pipev3q-20261026-atk_physical_forest_lunge-cell-02.png", "gabu-artic-pipev3q-20261026-atk_physical_forest_lunge-cell-03.png", "gabu-artic-pipev3q-20261026-atk_physical_forest_lunge-cell-04.png"] }, "atk_signature_canopy_burst": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-00.png", "gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-01.png", "gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-02.png", "gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-03.png", "gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-04.png", "gabu-artic-pipev3q-20261026-atk_signature_canopy_burst-cell-05.png"] }, "atk_special_leaf_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["gabu-artic-pipev3q-20261026-atk_special_leaf_shot-cell-00.png", "gabu-artic-pipev3q-20261026-atk_special_leaf_shot-cell-01.png", "gabu-artic-pipev3q-20261026-atk_special_leaf_shot-cell-02.png", "gabu-artic-pipev3q-20261026-atk_special_leaf_shot-cell-03.png", "gabu-artic-pipev3q-20261026-atk_special_leaf_shot-cell-04.png"] } } },
  "inklet": { sets: { "atk_heavy_ink_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-00.png", "inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-01.png", "inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-02.png", "inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-03.png", "inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-04.png", "inklet-artic-v2rework-20261026-atk_heavy_ink_crash_finisher-cell-05.png"] }, "atk_physical_ink_lash": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["inklet-artic-v2rework-20261026-atk_physical_ink_lash-cell-00.png", "inklet-artic-v2rework-20261026-atk_physical_ink_lash-cell-01.png", "inklet-artic-v2rework-20261026-atk_physical_ink_lash-cell-02.png", "inklet-artic-v2rework-20261026-atk_physical_ink_lash-cell-03.png", "inklet-artic-v2rework-20261026-atk_physical_ink_lash-cell-04.png"] }, "atk_signature_abyss_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-00.png", "inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-01.png", "inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-02.png", "inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-03.png", "inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-04.png", "inklet-artic-v2rework-20261026-atk_signature_abyss_barrage-cell-05.png"] }, "atk_special_ink_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["inklet-artic-v2rework-20261026-atk_special_ink_shot-cell-00.png", "inklet-artic-v2rework-20261026-atk_special_ink_shot-cell-01.png", "inklet-artic-v2rework-20261026-atk_special_ink_shot-cell-02.png", "inklet-artic-v2rework-20261026-atk_special_ink_shot-cell-03.png", "inklet-artic-v2rework-20261026-atk_special_ink_shot-cell-04.png"] } } },
  "kittember": { sets: { "atk_heavy_blaze_crash_finisher": { family: "heavy", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-00.png", "kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-01.png", "kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-02.png", "kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-03.png", "kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-04.png", "kittember-artic-pipev3q-20261026-atk_heavy_blaze_crash_finisher-cell-05.png"] }, "atk_physical_ember_pounce": { family: "physical", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["kittember-artic-pipev3q-20261026-atk_physical_ember_pounce-cell-00.png", "kittember-artic-pipev3q-20261026-atk_physical_ember_pounce-cell-01.png", "kittember-artic-pipev3q-20261026-atk_physical_ember_pounce-cell-02.png", "kittember-artic-pipev3q-20261026-atk_physical_ember_pounce-cell-03.png", "kittember-artic-pipev3q-20261026-atk_physical_ember_pounce-cell-04.png"] }, "atk_signature_inferno_pounce": { family: "signature", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-00.png", "kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-01.png", "kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-02.png", "kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-03.png", "kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-04.png", "kittember-artic-pipev3q-20261026-atk_signature_inferno_pounce-cell-05.png"] }, "atk_special_ember_spray": { family: "special", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["kittember-artic-pipev3q-20261026-atk_special_ember_spray-cell-00.png", "kittember-artic-pipev3q-20261026-atk_special_ember_spray-cell-01.png", "kittember-artic-pipev3q-20261026-atk_special_ember_spray-cell-02.png", "kittember-artic-pipev3q-20261026-atk_special_ember_spray-cell-03.png", "kittember-artic-pipev3q-20261026-atk_special_ember_spray-cell-04.png"] } } },
  "krakenox": { sets: { "atk_heavy_kraken_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-00.png", "krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-01.png", "krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-02.png", "krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-03.png", "krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-04.png", "krakenox-artic-v2rework-20261026-atk_heavy_kraken_crash_finisher-cell-05.png"] }, "atk_physical_tentacle_lash": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["krakenox-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-00.png", "krakenox-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-01.png", "krakenox-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-02.png", "krakenox-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-03.png", "krakenox-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-04.png"] }, "atk_signature_abyss_surge": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-00.png", "krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-01.png", "krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-02.png", "krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-03.png", "krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-04.png", "krakenox-artic-v2rework-20261026-atk_signature_abyss_surge-cell-05.png"] }, "atk_special_ink_jet": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["krakenox-artic-v2rework-20261026-atk_special_ink_jet-cell-00.png", "krakenox-artic-v2rework-20261026-atk_special_ink_jet-cell-01.png", "krakenox-artic-v2rework-20261026-atk_special_ink_jet-cell-02.png", "krakenox-artic-v2rework-20261026-atk_special_ink_jet-cell-03.png", "krakenox-artic-v2rework-20261026-atk_special_ink_jet-cell-04.png"] } } },
  "mythar": { sets: { "atk_heavy_nova_crash_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-00.png", "mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-01.png", "mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-02.png", "mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-03.png", "mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-04.png", "mythar-artic-pipev3q-20261026-atk_heavy_nova_crash_finisher-cell-05.png"] }, "atk_physical_star_pounce": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["mythar-artic-pipev3q-20261026-atk_physical_star_pounce-cell-00.png", "mythar-artic-pipev3q-20261026-atk_physical_star_pounce-cell-01.png", "mythar-artic-pipev3q-20261026-atk_physical_star_pounce-cell-02.png", "mythar-artic-pipev3q-20261026-atk_physical_star_pounce-cell-03.png", "mythar-artic-pipev3q-20261026-atk_physical_star_pounce-cell-04.png"] }, "atk_signature_orbit_barrage": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-00.png", "mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-01.png", "mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-02.png", "mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-03.png", "mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-04.png", "mythar-artic-pipev3q-20261026-atk_signature_orbit_barrage-cell-05.png"] }, "atk_special_star_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-c", files: ["mythar-artic-pipev3q-20261026-atk_special_star_shot-cell-00.png", "mythar-artic-pipev3q-20261026-atk_special_star_shot-cell-01.png", "mythar-artic-pipev3q-20261026-atk_special_star_shot-cell-02.png", "mythar-artic-pipev3q-20261026-atk_special_star_shot-cell-03.png", "mythar-artic-pipev3q-20261026-atk_special_star_shot-cell-04.png"] } } },
  "pebblefist": { sets: { "atk_heavy_avalanche_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-00.png", "pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-01.png", "pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-02.png", "pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-03.png", "pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-04.png", "pebblefist-artic-v2rework-20261026-atk_heavy_avalanche_finisher-cell-05.png"] }, "atk_physical_rock_punch": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["pebblefist-artic-v2rework-20261026-atk_physical_rock_punch-cell-00.png", "pebblefist-artic-v2rework-20261026-atk_physical_rock_punch-cell-01.png", "pebblefist-artic-v2rework-20261026-atk_physical_rock_punch-cell-02.png", "pebblefist-artic-v2rework-20261026-atk_physical_rock_punch-cell-03.png", "pebblefist-artic-v2rework-20261026-atk_physical_rock_punch-cell-04.png"] }, "atk_signature_boulder_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-00.png", "pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-01.png", "pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-02.png", "pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-03.png", "pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-04.png", "pebblefist-artic-v2rework-20261026-atk_signature_boulder_barrage-cell-05.png"] }, "atk_special_pebble_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-c", files: ["pebblefist-artic-v2rework-20261026-atk_special_pebble_shot-cell-00.png", "pebblefist-artic-v2rework-20261026-atk_special_pebble_shot-cell-01.png", "pebblefist-artic-v2rework-20261026-atk_special_pebble_shot-cell-02.png", "pebblefist-artic-v2rework-20261026-atk_special_pebble_shot-cell-03.png", "pebblefist-artic-v2rework-20261026-atk_special_pebble_shot-cell-04.png"] } } },
  "punchkid": { sets: { "atk_heavy_knockout_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-e", files: ["punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-00.png", "punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-01.png", "punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-02.png", "punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-03.png", "punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-04.png", "punchkid-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-05.png"] }, "atk_physical_jab_rush": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-e", files: ["punchkid-artic-pipev3q-20261026-atk_physical_jab_rush-cell-00.png", "punchkid-artic-pipev3q-20261026-atk_physical_jab_rush-cell-01.png", "punchkid-artic-pipev3q-20261026-atk_physical_jab_rush-cell-02.png", "punchkid-artic-pipev3q-20261026-atk_physical_jab_rush-cell-03.png", "punchkid-artic-pipev3q-20261026-atk_physical_jab_rush-cell-04.png"] }, "atk_signature_combo_barrage": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-e", files: ["punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-00.png", "punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-01.png", "punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-02.png", "punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-03.png", "punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-04.png", "punchkid-artic-pipev3q-20261026-atk_signature_combo_barrage-cell-05.png"] }, "atk_special_power_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-e", files: ["punchkid-artic-pipev3q-20261026-atk_special_power_shot-cell-00.png", "punchkid-artic-pipev3q-20261026-atk_special_power_shot-cell-01.png", "punchkid-artic-pipev3q-20261026-atk_special_power_shot-cell-02.png", "punchkid-artic-pipev3q-20261026-atk_special_power_shot-cell-03.png", "punchkid-artic-pipev3q-20261026-atk_special_power_shot-cell-04.png"] } } },
  "pyromonk": { sets: { "atk_heavy_blaze_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-e", files: ["pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-00.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-01.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-02.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-03.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-04.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_heavy_blaze_crash_finisher-cell-05.png"] }, "atk_physical_flame_fist": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-e", files: ["pyromonk-artic-v2rework-20261026-eyesonly-atk_physical_flame_fist-cell-00.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_physical_flame_fist-cell-01.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_physical_flame_fist-cell-02.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_physical_flame_fist-cell-03.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_physical_flame_fist-cell-04.png"] }, "atk_signature_inferno_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-e", files: ["pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-00.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-01.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-02.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-03.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-04.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_signature_inferno_barrage-cell-05.png"] }, "atk_special_flame_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-e", files: ["pyromonk-artic-v2rework-20261026-eyesonly-atk_special_flame_shot-cell-00.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_special_flame_shot-cell-01.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_special_flame_shot-cell-02.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_special_flame_shot-cell-03.png", "pyromonk-artic-v2rework-20261026-eyesonly-atk_special_flame_shot-cell-04.png"] } } },
  "razorgater": { sets: { "atk_heavy_jaw_crash_finisher": { family: "heavy", mouth: "fresh", layer: "v3w6", batch: "take-6", files: ["razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-00.png", "razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-01.png", "razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-02.png", "razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-03.png", "razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-04.png", "razorgater-artic-pipev3w6-20261026-atk_heavy_jaw_crash_finisher-cell-05.png"] }, "atk_physical_razor_rush": { family: "physical", mouth: "fresh", layer: "v3w6", batch: "take-6", files: ["razorgater-artic-pipev3w6-20261026-atk_physical_razor_rush-cell-00.png", "razorgater-artic-pipev3w6-20261026-atk_physical_razor_rush-cell-01.png", "razorgater-artic-pipev3w6-20261026-atk_physical_razor_rush-cell-02.png", "razorgater-artic-pipev3w6-20261026-atk_physical_razor_rush-cell-03.png", "razorgater-artic-pipev3w6-20261026-atk_physical_razor_rush-cell-04.png"] }, "atk_signature_cross_slash": { family: "signature", mouth: "fresh", layer: "v3w6", batch: "take-6", files: ["razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-00.png", "razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-01.png", "razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-02.png", "razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-03.png", "razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-04.png", "razorgater-artic-pipev3w6-20261026-atk_signature_cross_slash-cell-05.png"] }, "atk_special_blade_wave": { family: "special", mouth: "fresh", layer: "v3w6", batch: "take-6", files: ["razorgater-artic-pipev3w6-20261026-atk_special_blade_wave-cell-00.png", "razorgater-artic-pipev3w6-20261026-atk_special_blade_wave-cell-01.png", "razorgater-artic-pipev3w6-20261026-atk_special_blade_wave-cell-02.png", "razorgater-artic-pipev3w6-20261026-atk_special_blade_wave-cell-03.png", "razorgater-artic-pipev3w6-20261026-atk_special_blade_wave-cell-04.png"] } } },
  "sproutle": { sets: { "atk_heavy_overgrowth_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-00.png", "sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-01.png", "sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-02.png", "sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-03.png", "sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-04.png", "sproutle-artic-pipev3q-20261026-atk_heavy_overgrowth_finisher-cell-05.png"] }, "atk_physical_vine_lunge": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["sproutle-artic-pipev3q-20261026-atk_physical_vine_lunge-cell-00.png", "sproutle-artic-pipev3q-20261026-atk_physical_vine_lunge-cell-01.png", "sproutle-artic-pipev3q-20261026-atk_physical_vine_lunge-cell-02.png", "sproutle-artic-pipev3q-20261026-atk_physical_vine_lunge-cell-03.png", "sproutle-artic-pipev3q-20261026-atk_physical_vine_lunge-cell-04.png"] }, "atk_signature_bloom_burst": { family: "signature", mouth: "eyes-only", layer: "v3q", batch: "batch-a", files: ["sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-00.png", "sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-01.png", "sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-02.png", "sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-03.png", "sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-04.png", "sproutle-artic-pipev3q-20261026-atk_signature_bloom_burst-cell-05.png"] }, "atk_special_seed_shot": { family: "special", mouth: "eyes-only", layer: "v3q", batch: "batch-a", files: ["sproutle-artic-pipev3q-20261026-atk_special_seed_shot-cell-00.png", "sproutle-artic-pipev3q-20261026-atk_special_seed_shot-cell-01.png", "sproutle-artic-pipev3q-20261026-atk_special_seed_shot-cell-02.png", "sproutle-artic-pipev3q-20261026-atk_special_seed_shot-cell-03.png", "sproutle-artic-pipev3q-20261026-atk_special_seed_shot-cell-04.png"] } } },
  "squirmite": { sets: { "atk_heavy_overrun_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-00.png", "squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-01.png", "squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-02.png", "squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-03.png", "squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-04.png", "squirmite-artic-v2rework-20261026-atk_heavy_overrun_finisher-cell-05.png"] }, "atk_physical_coil_lunge": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["squirmite-artic-v2rework-20261026-atk_physical_coil_lunge-cell-00.png", "squirmite-artic-v2rework-20261026-atk_physical_coil_lunge-cell-01.png", "squirmite-artic-v2rework-20261026-atk_physical_coil_lunge-cell-02.png", "squirmite-artic-v2rework-20261026-atk_physical_coil_lunge-cell-03.png", "squirmite-artic-v2rework-20261026-atk_physical_coil_lunge-cell-04.png"] }, "atk_signature_verdant_burst": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-00.png", "squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-01.png", "squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-02.png", "squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-03.png", "squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-04.png", "squirmite-artic-v2rework-20261026-atk_signature_verdant_burst-cell-05.png"] }, "atk_special_sprout_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["squirmite-artic-v2rework-20261026-atk_special_sprout_shot-cell-00.png", "squirmite-artic-v2rework-20261026-atk_special_sprout_shot-cell-01.png", "squirmite-artic-v2rework-20261026-atk_special_sprout_shot-cell-02.png", "squirmite-artic-v2rework-20261026-atk_special_sprout_shot-cell-03.png", "squirmite-artic-v2rework-20261026-atk_special_sprout_shot-cell-04.png"] } } },
  "stormtalon": { sets: { "atk_heavy_thunder_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-00.png", "stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-01.png", "stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-02.png", "stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-03.png", "stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-04.png", "stormtalon-artic-v2rework-20261026-atk_heavy_thunder_crash_finisher-cell-05.png"] }, "atk_physical_talon_dive": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["stormtalon-artic-v2rework-20261026-atk_physical_talon_dive-cell-00.png", "stormtalon-artic-v2rework-20261026-atk_physical_talon_dive-cell-01.png", "stormtalon-artic-v2rework-20261026-atk_physical_talon_dive-cell-02.png", "stormtalon-artic-v2rework-20261026-atk_physical_talon_dive-cell-03.png", "stormtalon-artic-v2rework-20261026-atk_physical_talon_dive-cell-04.png"] }, "atk_signature_tempest_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-00.png", "stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-01.png", "stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-02.png", "stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-03.png", "stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-04.png", "stormtalon-artic-v2rework-20261026-atk_signature_tempest_barrage-cell-05.png"] }, "atk_special_storm_blast": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["stormtalon-artic-v2rework-20261026-atk_special_storm_blast-cell-00.png", "stormtalon-artic-v2rework-20261026-atk_special_storm_blast-cell-01.png", "stormtalon-artic-v2rework-20261026-atk_special_storm_blast-cell-02.png", "stormtalon-artic-v2rework-20261026-atk_special_storm_blast-cell-03.png", "stormtalon-artic-v2rework-20261026-atk_special_storm_blast-cell-04.png"] } } },
  "strikechamp": { sets: { "atk_heavy_knockout_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-00.png", "strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-01.png", "strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-02.png", "strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-03.png", "strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-04.png", "strikechamp-artic-v2rework-20261026-atk_heavy_knockout_finisher-cell-05.png"] }, "atk_physical_champ_punch": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["strikechamp-artic-v2rework-20261026-atk_physical_champ_punch-cell-00.png", "strikechamp-artic-v2rework-20261026-atk_physical_champ_punch-cell-01.png", "strikechamp-artic-v2rework-20261026-atk_physical_champ_punch-cell-02.png", "strikechamp-artic-v2rework-20261026-atk_physical_champ_punch-cell-03.png", "strikechamp-artic-v2rework-20261026-atk_physical_champ_punch-cell-04.png"] }, "atk_signature_champ_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-00.png", "strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-01.png", "strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-02.png", "strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-03.png", "strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-04.png", "strikechamp-artic-v2rework-20261026-atk_signature_champ_barrage-cell-05.png"] }, "atk_special_power_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["strikechamp-artic-v2rework-20261026-atk_special_power_shot-cell-00.png", "strikechamp-artic-v2rework-20261026-atk_special_power_shot-cell-01.png", "strikechamp-artic-v2rework-20261026-atk_special_power_shot-cell-02.png", "strikechamp-artic-v2rework-20261026-atk_special_power_shot-cell-03.png", "strikechamp-artic-v2rework-20261026-atk_special_power_shot-cell-04.png"] } } },
  "strikechamp_unsuited": { sets: { "atk_heavy_knockout_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-00.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-01.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-02.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-03.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-04.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-05.png"] }, "atk_physical_bare_punch": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited-artic-pipev3q-20261026-atk_physical_bare_punch-cell-00.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_physical_bare_punch-cell-01.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_physical_bare_punch-cell-02.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_physical_bare_punch-cell-03.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_physical_bare_punch-cell-04.png"] }, "atk_signature_bare_barrage": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-00.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-01.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-02.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-03.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-04.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_signature_bare_barrage-cell-05.png"] }, "atk_special_bare_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited-artic-pipev3q-20261026-atk_special_bare_shot-cell-00.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_special_bare_shot-cell-01.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_special_bare_shot-cell-02.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_special_bare_shot-cell-03.png", "strikechamp_unsuited-artic-pipev3q-20261026-atk_special_bare_shot-cell-04.png"] } } },
  "strikechamp_unsuited_full": { sets: { "atk_heavy_knockout_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-00.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-01.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-02.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-03.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-04.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_heavy_knockout_finisher-cell-05.png"] }, "atk_physical_suit_punch": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited_full-artic-pipev3q-20261026-atk_physical_suit_punch-cell-00.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_physical_suit_punch-cell-01.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_physical_suit_punch-cell-02.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_physical_suit_punch-cell-03.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_physical_suit_punch-cell-04.png"] }, "atk_signature_suit_barrage": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-00.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-01.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-02.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-03.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-04.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_signature_suit_barrage-cell-05.png"] }, "atk_special_suit_shot": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-d", files: ["strikechamp_unsuited_full-artic-pipev3q-20261026-atk_special_suit_shot-cell-00.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_special_suit_shot-cell-01.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_special_suit_shot-cell-02.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_special_suit_shot-cell-03.png", "strikechamp_unsuited_full-artic-pipev3q-20261026-atk_special_suit_shot-cell-04.png"] } } },
  "terradog": { sets: { "atk_heavy_quake_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-00.png", "terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-01.png", "terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-02.png", "terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-03.png", "terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-04.png", "terradog-artic-v2rework-20261026-atk_heavy_quake_finisher-cell-05.png"] }, "atk_physical_terra_charge": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["terradog-artic-v2rework-20261026-atk_physical_terra_charge-cell-00.png", "terradog-artic-v2rework-20261026-atk_physical_terra_charge-cell-01.png", "terradog-artic-v2rework-20261026-atk_physical_terra_charge-cell-02.png", "terradog-artic-v2rework-20261026-atk_physical_terra_charge-cell-03.png", "terradog-artic-v2rework-20261026-atk_physical_terra_charge-cell-04.png"] }, "atk_signature_terra_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-00.png", "terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-01.png", "terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-02.png", "terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-03.png", "terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-04.png", "terradog-artic-v2rework-20261026-atk_signature_terra_barrage-cell-05.png"] }, "atk_special_rock_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["terradog-artic-v2rework-20261026-atk_special_rock_shot-cell-00.png", "terradog-artic-v2rework-20261026-atk_special_rock_shot-cell-01.png", "terradog-artic-v2rework-20261026-atk_special_rock_shot-cell-02.png", "terradog-artic-v2rework-20261026-atk_special_rock_shot-cell-03.png", "terradog-artic-v2rework-20261026-atk_special_rock_shot-cell-04.png"] } } },
  "tiidebiite": { sets: { "atk_heavy_tsunami_finisher": { family: "heavy", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-00.png", "tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-01.png", "tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-02.png", "tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-03.png", "tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-04.png", "tiidebiite-artic-pipev3q-20261026-atk_heavy_tsunami_finisher-cell-05.png"] }, "atk_physical_tide_ram": { family: "physical", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["tiidebiite-artic-pipev3q-20261026-atk_physical_tide_ram-cell-00.png", "tiidebiite-artic-pipev3q-20261026-atk_physical_tide_ram-cell-01.png", "tiidebiite-artic-pipev3q-20261026-atk_physical_tide_ram-cell-02.png", "tiidebiite-artic-pipev3q-20261026-atk_physical_tide_ram-cell-03.png", "tiidebiite-artic-pipev3q-20261026-atk_physical_tide_ram-cell-04.png"] }, "atk_signature_surge_barrage": { family: "signature", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-00.png", "tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-01.png", "tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-02.png", "tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-03.png", "tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-04.png", "tiidebiite-artic-pipev3q-20261026-atk_signature_surge_barrage-cell-05.png"] }, "atk_special_tide_jet": { family: "special", mouth: "reuse-proof", layer: "v3q", batch: "batch-a", files: ["tiidebiite-artic-pipev3q-20261026-atk_special_tide_jet-cell-00.png", "tiidebiite-artic-pipev3q-20261026-atk_special_tide_jet-cell-01.png", "tiidebiite-artic-pipev3q-20261026-atk_special_tide_jet-cell-02.png", "tiidebiite-artic-pipev3q-20261026-atk_special_tide_jet-cell-03.png", "tiidebiite-artic-pipev3q-20261026-atk_special_tide_jet-cell-04.png"] } } },
  "toxitacle": { sets: { "atk_heavy_toxic_crash_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-00.png", "toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-01.png", "toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-02.png", "toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-03.png", "toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-04.png", "toxitacle-artic-v2rework-20261026-atk_heavy_toxic_crash_finisher-cell-05.png"] }, "atk_physical_tentacle_lash": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["toxitacle-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-00.png", "toxitacle-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-01.png", "toxitacle-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-02.png", "toxitacle-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-03.png", "toxitacle-artic-v2rework-20261026-atk_physical_tentacle_lash-cell-04.png"] }, "atk_signature_venom_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-00.png", "toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-01.png", "toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-02.png", "toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-03.png", "toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-04.png", "toxitacle-artic-v2rework-20261026-atk_signature_venom_barrage-cell-05.png"] }, "atk_special_toxin_jet": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["toxitacle-artic-v2rework-20261026-atk_special_toxin_jet-cell-00.png", "toxitacle-artic-v2rework-20261026-atk_special_toxin_jet-cell-01.png", "toxitacle-artic-v2rework-20261026-atk_special_toxin_jet-cell-02.png", "toxitacle-artic-v2rework-20261026-atk_special_toxin_jet-cell-03.png", "toxitacle-artic-v2rework-20261026-atk_special_toxin_jet-cell-04.png"] } } },
  "tyrage": { sets: { "atk_heavy_cataclysm_finisher": { family: "heavy", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-00.png", "tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-01.png", "tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-02.png", "tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-03.png", "tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-04.png", "tyrage-artic-pipev3q-20261026-atk_heavy_cataclysm_finisher-cell-05.png"] }, "atk_physical_rage_charge": { family: "physical", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["tyrage-artic-pipev3q-20261026-atk_physical_rage_charge-cell-00.png", "tyrage-artic-pipev3q-20261026-atk_physical_rage_charge-cell-01.png", "tyrage-artic-pipev3q-20261026-atk_physical_rage_charge-cell-02.png", "tyrage-artic-pipev3q-20261026-atk_physical_rage_charge-cell-03.png", "tyrage-artic-pipev3q-20261026-atk_physical_rage_charge-cell-04.png"] }, "atk_signature_tyrant_flare": { family: "signature", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-00.png", "tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-01.png", "tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-02.png", "tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-03.png", "tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-04.png", "tyrage-artic-pipev3q-20261026-atk_signature_tyrant_flare-cell-05.png"] }, "atk_special_rage_blast": { family: "special", mouth: "fresh", layer: "v3q", batch: "batch-a", files: ["tyrage-artic-pipev3q-20261026-atk_special_rage_blast-cell-00.png", "tyrage-artic-pipev3q-20261026-atk_special_rage_blast-cell-01.png", "tyrage-artic-pipev3q-20261026-atk_special_rage_blast-cell-02.png", "tyrage-artic-pipev3q-20261026-atk_special_rage_blast-cell-03.png", "tyrage-artic-pipev3q-20261026-atk_special_rage_blast-cell-04.png"] } } },
  "yogiferno": { sets: { "atk_heavy_blaze_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-00.png", "yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-01.png", "yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-02.png", "yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-03.png", "yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-04.png", "yogiferno-artic-v2rework-20261026-atk_heavy_blaze_finisher-cell-05.png"] }, "atk_physical_yogi_charge": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["yogiferno-artic-v2rework-20261026-atk_physical_yogi_charge-cell-00.png", "yogiferno-artic-v2rework-20261026-atk_physical_yogi_charge-cell-01.png", "yogiferno-artic-v2rework-20261026-atk_physical_yogi_charge-cell-02.png", "yogiferno-artic-v2rework-20261026-atk_physical_yogi_charge-cell-03.png", "yogiferno-artic-v2rework-20261026-atk_physical_yogi_charge-cell-04.png"] }, "atk_signature_inferno_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-00.png", "yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-01.png", "yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-02.png", "yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-03.png", "yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-04.png", "yogiferno-artic-v2rework-20261026-atk_signature_inferno_barrage-cell-05.png"] }, "atk_special_flame_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["yogiferno-artic-v2rework-20261026-atk_special_flame_shot-cell-00.png", "yogiferno-artic-v2rework-20261026-atk_special_flame_shot-cell-01.png", "yogiferno-artic-v2rework-20261026-atk_special_flame_shot-cell-02.png", "yogiferno-artic-v2rework-20261026-atk_special_flame_shot-cell-03.png", "yogiferno-artic-v2rework-20261026-atk_special_flame_shot-cell-04.png"] } } },
  "zephling": { sets: { "atk_heavy_tempest_finisher": { family: "heavy", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-00.png", "zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-01.png", "zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-02.png", "zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-03.png", "zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-04.png", "zephling-artic-v2rework-20261026-atk_heavy_tempest_finisher-cell-05.png"] }, "atk_physical_zephyr_dive": { family: "physical", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["zephling-artic-v2rework-20261026-atk_physical_zephyr_dive-cell-00.png", "zephling-artic-v2rework-20261026-atk_physical_zephyr_dive-cell-01.png", "zephling-artic-v2rework-20261026-atk_physical_zephyr_dive-cell-02.png", "zephling-artic-v2rework-20261026-atk_physical_zephyr_dive-cell-03.png", "zephling-artic-v2rework-20261026-atk_physical_zephyr_dive-cell-04.png"] }, "atk_signature_cyclone_barrage": { family: "signature", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-00.png", "zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-01.png", "zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-02.png", "zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-03.png", "zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-04.png", "zephling-artic-v2rework-20261026-atk_signature_cyclone_barrage-cell-05.png"] }, "atk_special_gust_shot": { family: "special", mouth: "eyes-only", layer: "v2", batch: "batch-d", files: ["zephling-artic-v2rework-20261026-atk_special_gust_shot-cell-00.png", "zephling-artic-v2rework-20261026-atk_special_gust_shot-cell-01.png", "zephling-artic-v2rework-20261026-atk_special_gust_shot-cell-02.png", "zephling-artic-v2rework-20261026-atk_special_gust_shot-cell-03.png", "zephling-artic-v2rework-20261026-atk_special_gust_shot-cell-04.png"] } } },
};

export interface PilotCell { file: string; durationMs: number; }
export interface PilotSpec { sets: Record<string, PilotCell[]>; hurtSets: Record<string, string[]>; }
export const PILOTS: Record<string, PilotSpec> = {
  "dreadtoise": { sets: { "atk_heavy_fortress_slam_finisher": [{ file: "atk_heavy_fortress_slam_finisher_cell_00.png", durationMs: 220 }, { file: "atk_heavy_fortress_slam_finisher_cell_01.png", durationMs: 140 }, { file: "atk_heavy_fortress_slam_finisher_cell_02.png", durationMs: 120 }, { file: "atk_heavy_fortress_slam_finisher_cell_03.png", durationMs: 120 }, { file: "atk_heavy_fortress_slam_finisher_cell_04.png", durationMs: 100 }, { file: "atk_heavy_fortress_slam_finisher_cell_05.png", durationMs: 420 }], "atk_physical_shell_ram": [{ file: "atk_physical_shell_ram_cell_00.png", durationMs: 200 }, { file: "atk_physical_shell_ram_cell_01.png", durationMs: 130 }, { file: "atk_physical_shell_ram_cell_02.png", durationMs: 110 }, { file: "atk_physical_shell_ram_cell_03.png", durationMs: 90 }, { file: "atk_physical_shell_ram_cell_04.png", durationMs: 300 }], "atk_signature_twin_cannon_barrage": [{ file: "atk_signature_twin_cannon_barrage_cell_00.png", durationMs: 200 }, { file: "atk_signature_twin_cannon_barrage_cell_01.png", durationMs: 100 }, { file: "atk_signature_twin_cannon_barrage_cell_02.png", durationMs: 100 }, { file: "atk_signature_twin_cannon_barrage_cell_03.png", durationMs: 140 }, { file: "atk_signature_twin_cannon_barrage_cell_04.png", durationMs: 120 }, { file: "atk_signature_twin_cannon_barrage_cell_05.png", durationMs: 300 }], "atk_special_water_gun": [{ file: "atk_special_water_gun_cell_00.png", durationMs: 200 }, { file: "atk_special_water_gun_cell_01.png", durationMs: 120 }, { file: "atk_special_water_gun_cell_02.png", durationMs: 110 }, { file: "atk_special_water_gun_cell_03.png", durationMs: 110 }, { file: "atk_special_water_gun_cell_04.png", durationMs: 300 }] }, hurtSets: { "hurt_heavy_knockback": ["hurt_heavy_knockback_cell_00.png", "hurt_heavy_knockback_cell_01.png", "hurt_heavy_knockback_cell_02.png", "hurt_heavy_knockback_cell_03.png"], "hurt_light_flinch": ["hurt_light_flinch_cell_00.png", "hurt_light_flinch_cell_01.png", "hurt_light_flinch_cell_02.png"], "hurt_near_faint_stagger": ["hurt_near_faint_stagger_cell_00.png", "hurt_near_faint_stagger_cell_01.png", "hurt_near_faint_stagger_cell_02.png", "hurt_near_faint_stagger_cell_03.png"], "hurt_status_wobble": ["hurt_status_wobble_cell_00.png", "hurt_status_wobble_cell_01.png", "hurt_status_wobble_cell_02.png"] } },
  "mochii": { sets: { "atk_heavy_hydro_surge_finisher": [{ file: "atk_heavy_hydro_surge_finisher_cell_00.png", durationMs: 220 }, { file: "atk_heavy_hydro_surge_finisher_cell_01.png", durationMs: 160 }, { file: "atk_heavy_hydro_surge_finisher_cell_02.png", durationMs: 140 }, { file: "atk_heavy_hydro_surge_finisher_cell_03.png", durationMs: 120 }, { file: "atk_heavy_hydro_surge_finisher_cell_04.png", durationMs: 100 }, { file: "atk_heavy_hydro_surge_finisher_cell_05.png", durationMs: 420 }], "atk_physical_body_slam": [{ file: "atk_physical_body_slam_cell_00.png", durationMs: 180 }, { file: "atk_physical_body_slam_cell_01.png", durationMs: 120 }, { file: "atk_physical_body_slam_cell_02.png", durationMs: 100 }, { file: "atk_physical_body_slam_cell_03.png", durationMs: 90 }, { file: "atk_physical_body_slam_cell_04.png", durationMs: 300 }], "atk_signature_aqua_cannon": [{ file: "atk_signature_aqua_cannon_cell_00.png", durationMs: 200 }, { file: "atk_signature_aqua_cannon_cell_01.png", durationMs: 220 }, { file: "atk_signature_aqua_cannon_cell_02.png", durationMs: 100 }, { file: "atk_signature_aqua_cannon_cell_03.png", durationMs: 140 }, { file: "atk_signature_aqua_cannon_cell_04.png", durationMs: 120 }, { file: "atk_signature_aqua_cannon_cell_05.png", durationMs: 300 }], "atk_special_aqua_shot": [{ file: "atk_special_aqua_shot_cell_00.png", durationMs: 200 }, { file: "atk_special_aqua_shot_cell_01.png", durationMs: 140 }, { file: "atk_special_aqua_shot_cell_02.png", durationMs: 110 }, { file: "atk_special_aqua_shot_cell_03.png", durationMs: 110 }, { file: "atk_special_aqua_shot_cell_04.png", durationMs: 300 }] }, hurtSets: { "hurt_heavy_knockback": ["hurt_heavy_knockback_cell_00.png", "hurt_heavy_knockback_cell_01.png", "hurt_heavy_knockback_cell_02.png", "hurt_heavy_knockback_cell_03.png"], "hurt_light_flinch": ["hurt_light_flinch_cell_00.png", "hurt_light_flinch_cell_01.png", "hurt_light_flinch_cell_02.png"], "hurt_near_faint_stagger": ["hurt_near_faint_stagger_cell_00.png", "hurt_near_faint_stagger_cell_01.png", "hurt_near_faint_stagger_cell_02.png", "hurt_near_faint_stagger_cell_03.png"], "hurt_status_wobble": ["hurt_status_wobble_cell_00.png", "hurt_status_wobble_cell_01.png", "hurt_status_wobble_cell_02.png"] } },
};

/** Pilot attack set chosen by game move id (Mochii only — its pilot sets are named for real game moves). */
export const PILOT_MOVE_SET: Record<string, string> = {
  'BODY_SLAM_MOVE': 'atk_physical_body_slam',
  'AQUA_SHOT': 'atk_special_aqua_shot',
  'AQUA_CANNON': 'atk_signature_aqua_cannon',
  'HYDRO_SURGE': 'atk_heavy_hydro_surge_finisher',
};

export const SILHOUETTES: Record<string, string> = {
  "aerobeak": "aerobeak_silhouette.png",
  "aquariios": "aquariios_silhouette.png",
  "ashemit": "ashemit_silhouette.png",
  "astroleviathan": "astroleviathan_silhouette.png",
  "chromejaww": "chromejaww_silhouette.png",
  "cocoonode": "cocoonode_silhouette.png",
  "cragarm": "cragarm_silhouette.png",
  "dorowani": "dorowani_silhouette.png",
  "dreadtoise": "dreadtoise_silhouette.png",
  "duneclaw": "duneclaw_silhouette.png",
  "duskfiend": "duskfiend_silhouette.png",
  "finblade": "finblade_silhouette.png",
  "floatcalf": "floatcalf_silhouette.png",
  "gabu": "gabu_silhouette.png",
  "gearkid": "gearkid_silhouette.png",
  "gorokappa": "gorokappa_silhouette.png",
  "inklet": "inklet_silhouette.png",
  "kickmaster": "kickmaster_silhouette.png",
  "kittember": "kittember_silhouette.png",
  "krakenox": "krakenox_silhouette.png",
  "manticlaw": "manticlaw_silhouette.png",
  "mechapion": "mechapion_silhouette.png",
  "megalochrome": "megalochrome_silhouette.png",
  "mochii": "mochii_silhouette.png",
  "mothrix": "mothrix_silhouette.png",
  "mythar": "mythar_silhouette.png",
  "oblivirex": "oblivirex_silhouette.png",
  "pebblefist": "pebblefist_silhouette.png",
  "pixilite": "pixilite_silhouette.png",
  "punchkid": "punchkid_silhouette.png",
  "pupbble": "pupbble_silhouette.png",
  "pyromonk": "pyromonk_silhouette.png",
  "pyropaw": "pyropaw_silhouette.png",
  "quakehound": "quakehound_silhouette.png",
  "razorgater": "razorgater_silhouette.png",
  "reaperdile": "reaperdile_silhouette.png",
  "shellguard": "shellguard_silhouette.png",
  "sproutle": "sproutle_silhouette.png",
  "squirmite": "squirmite_silhouette.png",
  "stormtalon": "stormtalon_silhouette.png",
  "strikechamp": "strikechamp_silhouette.png",
  "strikechamp_unsuited": "strikechamp_unsuited_silhouette.png",
  "strikechamp_unsuited_full": "strikechamp_unsuited_full_silhouette.png",
  "terradog": "terradog_silhouette.png",
  "terrapod": "terrapod_silhouette.png",
  "tiidebiite": "tiidebiite_silhouette.png",
  "toxitacle": "toxitacle_silhouette.png",
  "tyrage": "tyrage_silhouette.png",
  "wispkin": "wispkin_silhouette.png",
  "yogiferno": "yogiferno_silhouette.png",
  "zephling": "zephling_silhouette.png",
};

const idleMods = import.meta.glob('../assets/sprite-atlases/animation/idle/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const hurtMods = import.meta.glob('../assets/sprite-atlases/animation/hurt/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const attackMods = import.meta.glob('../../sprite-art/animation/attack/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const articMods = import.meta.glob('../../sprite-art/animation/expanded-scope/articulation-v2-rework-v3/batch-*/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const articV2Mods = import.meta.glob('../../sprite-art/animation/expanded-scope/articulation-v2-rework/batch-*/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const take6Mods = import.meta.glob('../../tools/sprite-art/mouth-shape/razorgater/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const pilotMods = import.meta.glob('../../sprite-art/animation/expanded-scope/pilot/*/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;
const silMods = import.meta.glob('../../sprite-art/animation/expanded-scope/lane100/silhouettes/*.png', { query: '?url', import: 'default' }) as Record<string, () => Promise<string>>;

const urlCache = new Map<string, Promise<string>>();
function pickUrl(mods: Record<string, () => Promise<string>>, suffix: string): Promise<string> | null {
  const key = Object.keys(mods).sort().find((k) => k.endsWith(suffix));
  if (!key) return null;
  let p = urlCache.get(key);
  if (!p) { p = mods[key](); urlCache.set(key, p); }
  return p;
}

export function loadIdleFrame(folder: string, file: string): Promise<string> | null {
  return pickUrl(idleMods, `/animation/idle/${folder}/${file}`);
}
export function loadHurtFrame(folder: string): Promise<string> | null {
  const spec = HURT[folder];
  if (!spec) return null;
  return pickUrl(hurtMods, `/animation/hurt/${folder}/${spec.file}`);
}
export function loadAttackFrame(folder: string, file: string): Promise<string> | null {
  return pickUrl(attackMods, `/animation/attack/${folder}/${file}`);
}
export function loadArticCell(folder: string, layer: 'v3q' | 'v2' | 'v3w6', batch: string, file: string): Promise<string> | null {
  if (layer === 'v3q') return pickUrl(articMods, `/articulation-v2-rework-v3/${batch}/${folder}/${file}`);
  if (layer === 'v3w6') return pickUrl(take6Mods, `/mouth-shape/razorgater/${file}`);
  return pickUrl(articV2Mods, `/articulation-v2-rework/${batch}/${folder}/${file}`);
}
export function loadPilotCell(folder: string, file: string): Promise<string> | null {
  return pickUrl(pilotMods, `/pilot/${folder}/${file}`);
}
export function loadSilhouette(folder: string): Promise<string> | null {
  const file = SILHOUETTES[folder];
  if (!file) return null;
  return pickUrl(silMods, `/lane100/silhouettes/${file}`);
}

export interface AttackSetChoice { kind: 'pilot' | 'articulation'; setName: string; files: string[]; durationsMs: number[] | null; layer?: 'v3q' | 'v2' | 'v3w6'; batch?: string; }
/**
 * Pick the rendered attack set for a battle attacker. Precedence:
 * pilot set by game move id (Mochii) -> pilot set by family (Dreadtoise)
 * -> articulation set by category (Physical -> physical, Special ->
 * special). Status has no set. Returns null for transform-only play
 * (the Pixi treatments timeline, unchanged). Durations are the pilot
 * manifest durations when present, else an even split over the Pixi
 * attack timeline (1490 ms: windup 250 + travel 450 + contact 790).
 */
export function attackSetFor(folder: string, moveId: string | undefined | null, category: string): AttackSetChoice | null {
  if (category === 'Status') return null;
  const pilot = PILOTS[folder];
  if (pilot && moveId && PILOT_MOVE_SET[moveId] && pilot.sets[PILOT_MOVE_SET[moveId]]) {
    const cells = pilot.sets[PILOT_MOVE_SET[moveId]];
    return { kind: 'pilot', setName: PILOT_MOVE_SET[moveId], files: cells.map((c) => c.file), durationsMs: cells.map((c) => c.durationMs) };
  }
  if (pilot) {
    const fam = category === 'Special' ? 'special' : 'physical';
    const hit = Object.entries(pilot.sets).find(([name]) => name.includes(`_${fam}_`));
    if (hit) return { kind: 'pilot', setName: hit[0], files: hit[1].map((c) => c.file), durationsMs: hit[1].map((c) => c.durationMs) };
  }
  const artic = ARTICULATION[folder];
  if (artic) {
    const fam = category === 'Special' ? 'special' : category === 'Physical' ? 'physical' : null;
    if (fam) {
      const hit = Object.entries(artic.sets).find(([, s]) => s.family === fam);
      if (hit) return { kind: 'articulation', setName: hit[0], files: hit[1].files, durationsMs: null, layer: hit[1].layer, batch: hit[1].batch };
    }
  }
  return null;
}

export interface MoveScriptStep { op: string; sub?: string; args?: Record<string, unknown>; }
export interface MoveScript { move: string; category: string; type: string; power: number; template: string; family: string; fallback: boolean; steps: MoveScriptStep[]; }
const SCRIPTS = (moveScriptsData as unknown as { scripts: Record<string, MoveScript> }).scripts;
/**
 * Phase 1 game-move -> script routing (2026-10-26). Exact-id matches
 * win first; otherwise the curated map in gameMoveScriptMap.json routes
 * a game move id to an existing union script (same type + category +
 * timing family, per-entry evidence in that file). The map's keys are
 * disjoint from the exact-id script keys, so the exact check below can
 * never be shadowed. No game move data, category, effect, or learnset
 * is changed here, and no script is invented: an unmapped game move
 * still returns null.
 */
const GAME_MOVE_SCRIPT_MAP = (gameMoveScriptMapData as unknown as { mapping: Record<string, string> }).mapping;
export function getMoveScript(moveId: string | undefined | null): MoveScript | null {
  if (!moveId) return null;
  if (SCRIPTS[moveId]) return SCRIPTS[moveId];
  const routed = GAME_MOVE_SCRIPT_MAP[moveId];
  if (routed && SCRIPTS[routed]) return SCRIPTS[routed];
  return SCRIPTS[moveId] ?? null;
}
export const GAME_MOVE_SCRIPT_MAP_COUNT = Object.keys(GAME_MOVE_SCRIPT_MAP).length;
export const MOVE_SCRIPT_COUNT = Object.keys(SCRIPTS).length;

/**
 * FINISH-FIRST Item 4 (2026-10-26) — Pixi attack rendering resolution.
 *
 * What PixiBattleCanvas renders for an attacker, in precedence order:
 *  1. attackSetFor() — pilot set by game move id (Mochii), pilot set by
 *     family (Dreadtoise), articulation set by category (24 folders).
 *  2. ATTACK_TRANSFORM fallback (this item) — the 25 folders with no
 *     pilot/articulation set now render their 4 transform frames
 *     (windup/strike/impact/recover; strikechamp_unsuited_full renders
 *     its 7 attack cells on an even split). Before this item the
 *     transform layer was registry-only (0/51 Pixi-rendered) and the
 *     rendered total was 26/51 folders; after it, 51/51 folders render.
 *
 * Per-move sequencing: the resolved move script (getMoveScript(), Phase 1
 * map included) drives `motion`, not just the game category:
 *  - template special_projectile -> 'projectile' (Pixi Special branch).
 *  - template physical_contact   -> 'lunge' (Pixi Physical branch).
 *  - template physical           -> 'stay': the script has NO sub_Lunge
 *    step (impact only, e.g. EARTHQUAKE, BULLDOZE, AQUA_JET), so Pixi
 *    must not lunge. Implemented in PixiBattleCanvas by neutralising
 *    the travel target to the attacker base for stay-motion moves; the
 *    existing travel/recover branches then become no-ops and no existing
 *    branch line is changed.
 *  - template multi_hit          -> 'stay' + beats = the count of
 *    sub_MultiHitBeat steps (TWINEEDLE = 3; default 3 per the moveScripts
 *    assumption when no beat steps are present). Beat cycling is drawn
 *    only on the transform fallback (its roles are known); pilot/
 *    articulation sets play their native sequence.
 *  - template two_turn           -> 'projectile' (the unleash variant).
 *    The charge turn itself is resolver-owned turn structure, not a
 *    Pixi turn, so it is NOT faked as a second Pixi attack here.
 *  - any other template, or no script at all -> game-category fallback
 *    (Special -> projectile, Physical -> lunge), so a script-unmatched
 *    move still renders its attack frames.
 *
 * IRON_BARRAGE stays script-unmatched (Mars-gated: description says
 * 2-5 shards, effect field says NONE single-hit) and is NOT forced to
 * any script here; it renders via the category fallback (Physical lunge
 * + transform/articulation frames for its user) like any unmatched move.
 *
 * Direction (PARAMETER ONLY — DEFERRED, Mars correction 16:38 CDT):
 * direction is side-based, not move-based — Pixi computes player = +1
 * (LEFT) and enemy = -1 (RIGHT) and passes it as a parameter to the
 * treatments timeline (particle fan + recoil) while lunge/projectile
 * travel is positional between the two bases. This resolver does NOT
 * finish direction work and does NOT claim it finished: VFX origin
 * anchoring (blasts must shoot FROM THE MOUTH) and effect-art travel
 * direction (opponent effects travel LEFT, player effects RIGHT) are
 * owned by the SEPARATE VFX origin + direction pass, including the
 * known old Dorowani jet (waist height, disconnected from the mouth,
 * going right). Transform frames themselves are direction-neutral
 * (front-facing lean transforms, no travel drawn in the frame —
 * verified on mochii attack_b_strike), so no sprite mirror is applied
 * in this resolver; the mirror/VFX pass owns facing and origin, and
 * this item does not duplicate it.
 *
 * This resolver renders whatever the registry tables already point at.
 * It does not re-point, replace, or delete any locked asset, except
 * the one reconciliation this file itself carries: Razorgater's
 * registry articulation set now renders the locked take-6 final
 * (triangle mouth, docs/locked-versions.json CURRENT) via the v3w6
 * loader branch — reconciled 2026-10-26, see the header note.
 */
export type PixiAttackMotion = 'lunge' | 'projectile' | 'stay' | 'status';
export interface PixiAttackRender {
  script: MoveScript | null;
  scriptId: string | null;
  set: AttackSetChoice | null;
  transform: AttackFrame[] | null;
  motion: PixiAttackMotion;
  beats: number;
}
export function attackTransformFor(folder: string): AttackFrame[] | null {
  const frames = ATTACK_TRANSFORM[folder];
  return frames ? [...frames] : null;
}
export function resolvePixiAttack(folder: string, moveId: string | undefined | null, category: string): PixiAttackRender | null {
  if (!folder) return null;
  const script = getMoveScript(moveId);
  if (category === 'Status') {
    return { script, scriptId: script ? script.move : null, set: null, transform: null, motion: 'status', beats: 0 };
  }
  const set = attackSetFor(folder, moveId, category);
  const transform = set ? null : attackTransformFor(folder);
  let motion: PixiAttackMotion;
  let beats = 0;
  if (script) {
    if (script.template === 'special_projectile') motion = 'projectile';
    else if (script.template === 'physical_contact') motion = 'lunge';
    else if (script.template === 'physical') motion = 'stay';
    else if (script.template === 'multi_hit') {
      motion = 'stay';
      beats = script.steps.filter((s) => s.sub === 'sub_MultiHitBeat').length || 3;
    }
    else if (script.template === 'two_turn') motion = 'projectile';
    else motion = category === 'Special' ? 'projectile' : 'lunge';
  } else {
    motion = category === 'Special' ? 'projectile' : 'lunge';
  }
  return { script, scriptId: script ? script.move : null, set, transform, motion, beats };
}

/** Shiny wiring is intentionally absent: the shiny-v2 set is staged show-first and NOT approved. */
export const SHINY_WIRED = false;

