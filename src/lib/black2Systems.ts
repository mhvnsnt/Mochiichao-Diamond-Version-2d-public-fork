// black2Systems.ts — Black 2 reference lookup module (PR version).
// Display-only reference lookups; NOT playable content, NOT battle math,
// NOT save shape, NOT shop prices. PR redaction: class constants that
// themselves named a person were replaced with WITHHELD constants
// (display names kept); 1 class was already held out in stage1.
// Original TypeScript written for Mochiichao. No pokebw2 code, art,
// audio, dialogue, character names, cries, logos, or town/place names
// are copied here. System names below are the sanitized batch lists:
// abilities (165), natures (25), types (17 + TYPE_NULL constant),
// kept generic trainer classes (151 of 237; 86 named-person/boss
// classes dropped, count only, names never listed), AI strategies
// (14 specced, 1 held out as broken), facility summaries (6).
// Full item (639), lighting (210 sets), zone (615), encounter
// (135 sets), and facility-set (6,000 sets) data stays in the staged
// JSONs under ../batch-a|b|c/ and is passed into the lookup builders
// below. This module therefore compiles and resolves without
// importing any pokebw2 file or any main game file.
// Source: pokebw2 e522642f9ec496783642df075f05fcd07d3cbc1b.
// Main head verified for the mapping: 65570289999a3e2f56b5bfc5e19ae345e18bbdce
// (PR #228, Dex view) in stage1. PR version re-verified against the
// main head at branch time (see PR body) and wired display-only via
// Black2SystemsPanel.tsx in DexView + validate-reference.ts §5.
// Counts that must match validate-wiring.py:
//   items 639, abilities 165, natures 25, types 17 (+TYPE_NULL),
//   lighting sets 210 (field 200 + battle 10), periods/set 15,
//   lights/period 4, zones 615, encounter sets 135, encounter slots 7136,
//   facilities 6, facility trainers 1285, facility sets 6000,
//   facility pool refs 28246, kept classes 151, dropped classes 86,
//   AI strategies 14 (13 wireable, 1 held out).

export interface Black2ItemEffects {
  sleep_heal: boolean; poison_heal: boolean; burn_heal: boolean;
  freeze_heal: boolean; paralysis_heal: boolean; confusion_heal: boolean;
  infatuation_heal: boolean; guard_spec: boolean; revive: boolean;
  revive_all: boolean; level_up: boolean; evolve: boolean;
  attack_stages: number; defense_stages: number; sp_attack_stages: number;
  sp_defense_stages: number; speed_stages: number; accuracy_stages: number;
  crit_stages: number; pp_up: boolean; pp_max: boolean;
  pp_restore: boolean; pp_restore_all: boolean; hp_restore: boolean;
  hp_ev_up: boolean; attack_ev_up: boolean; defense_ev_up: boolean;
  speed_ev_up: boolean; sp_attack_ev_up: boolean; sp_defense_ev_up: boolean;
  friendship_up_1: boolean; friendship_up_2: boolean; friendship_up_3: boolean;
  unk6_4: boolean; hp_ev: number; attack_ev: number; defense_ev: number;
  speed_ev: number; sp_attack_ev: number; sp_defense_ev: number;
  hp_restore_amount: number; pp_restore_amount: number;
  friendship_1: number; friendship_2: number; friendship_3: number;
}

export interface Black2Item {
  sourceConstant: string; index: number; name: string; name_plural: string;
  price: number; hold_effect: string; hold_param: number;
  pluck_effect: number; fling_effect: number; fling_power: number;
  natural_gift_power: number; natural_gift_type: string | null;
  important: boolean; registrable: boolean; field_pocket: string;
  battle_pocket: string[]; field_func: number; battle_func: number;
  kind: number; sort_index: number; value: number | null;
  effects: Black2ItemEffects | null;
}

export interface Black2Named { index: number; constant: string; name: string }
export interface Black2TrainerClass { constant: string; name: string; nameWithArticle: string }
export interface Black2AiStrategy {
  flag: number; file: string; governance: string;
  storyTrainersUsing: number; wireable: boolean;
}
export interface Black2FacilitySummary {
  facility: string; trainerFileCount: number; setFileCount: number;
  totalPoolReferences: number; poolSizeMin: number; poolSizeMax: number;
  poolSizeMean: number; distinctSpeciesInSets: number; trainersWithMessages: number;
}
export interface Black2FacilityTrainer {
  id: string; pool: string[]; poolSize: number;
  hasMessages: boolean; messageCount: number;
  // NOTE: no per-trainer class string is carried here on purpose.
  // Facility trainer files mix generic class constants with named-person
  // constants and, for 309 tournament files, carry unk0 instead of a
  // class at all. The safe class lookup is KEPT_TRAINER_CLASSES below.
  // A facility->kept-class mapping is NEED TO MAKE (see wiring map).
}
export interface Black2FacilitySet {
  setId: string; species: string; moves: string[]; evStats: string[];
  nature: string; item: string; form: number;
}
export interface Black2Rgb { red: number; green: number; blue: number }
export interface Black2Light { enabled: boolean; color: Black2Rgb; direction: { x: number; y: number; z: number } }
export interface Black2LightingPeriod {
  end: { hour: number; minutes: number }; lights: Black2Light[];
  diffuse: Black2Rgb; ambient: Black2Rgb; specular: Black2Rgb;
  emission: Black2Rgb; fog: Black2Rgb; clear: Black2Rgb;
}
export interface Black2LightingSet { id: string; periods: Black2LightingPeriod[] }
export interface Black2Zone {
  id: string; map_type: number; npc_cache: number; weather: number;
  projection: number; camera: number; transition: number; battle_bg: number;
  cycling: boolean; escape_rope: boolean; fly_from: boolean;
  fly: { x: number; y: number; z: number }; cam_bound: number;
  name_icon: number; easy_level: number;
}
export type Black2Terrain = "grass" | "dark_grass" | "shaking_grass" | "surf" | "rippling_surf" | "fishing" | "rippling_fishing";
export type Black2EncounterSlot = [string, number, number] | [string, number, number, number];
export interface Black2EncounterBlock {
  rates: Record<string, number>;
  terrains: Record<string, Black2EncounterSlot[] | { black2: Black2EncounterSlot[]; white2: Black2EncounterSlot[] }>;
}
export interface Black2EncounterSet { id: string; seasons: Record<string, Black2EncounterBlock> }
export interface Black2TownMapStructure {
  // Structure type ONLY (from the town-map schema keys, not a place list):
  // zone ref, type code, radius, position {x,y}, cursor {x,y},
  // hit {start, end, radius}, fly flag, arrival/shown flags, area {animation, x, y}.
  // No place names, no place list, no descriptions are carried here.
  zone: string; type: number; radius: number;
  position: { x: number; y: number }; cursor: { x: number; y: number };
  hit: { start: { x: number; y: number }; end: { x: number; y: number }; radius: number };
  fly: boolean; arrival_flag: unknown; shown_by: unknown;
  area: { animation: number; x: number; y: number };
}

export const BLACK2_ITEM_COUNT = 639;
export const BLACK2_ABILITY_COUNT = 165;
export const BLACK2_NATURE_COUNT = 25;
export const BLACK2_TYPE_COUNT = 17;
export const BLACK2_LIGHTING_FIELD_SETS = 200;
export const BLACK2_LIGHTING_BATTLE_SETS = 10;
export const BLACK2_LIGHTING_SETS = 210;
export const BLACK2_LIGHTING_PERIODS_PER_SET = 15;
export const BLACK2_LIGHTING_LIGHTS_PER_PERIOD = 4;
export const BLACK2_ZONE_COUNT = 615;
export const BLACK2_ENCOUNTER_SET_COUNT = 135;
export const BLACK2_ENCOUNTER_SLOT_COUNT = 7136;
export const BLACK2_FACILITY_COUNT = 6;
export const BLACK2_FACILITY_TRAINER_COUNT = 1285;
export const BLACK2_FACILITY_SET_COUNT = 6000;
export const BLACK2_FACILITY_POOL_REF_COUNT = 28246;
export const BLACK2_KEPT_CLASS_COUNT = 151;
export const BLACK2_WIRED_CLASS_COUNT = 150; // 1 kept class held out in wiring (character name, see map §9)
export const BLACK2_DROPPED_CLASS_COUNT = 86;
export const BLACK2_CLASS_FILE_COUNT = 237;
export const BLACK2_AI_STRATEGY_COUNT = 14;
export const BLACK2_AI_WIREABLE_COUNT = 13;
export const BLACK2_TERRAINS: Black2Terrain[] = ["grass", "dark_grass", "shaking_grass", "surf", "rippling_surf", "fishing", "rippling_fishing"];

// Gaps that are 0 in the source and are NOT invented here:
// nature modifiers 0/25, type-effectiveness chart 0, ability logic 0/165,
// facility level range 0/1285, facility battle-style 0/1285,
// facility ai_flags 0/1285, class prize/money fields 0/151.
// Mochiichao-side values for those gaps are NEED TO MAKE and need
// Mars's decision (see black2-wiring-map.md); this module returns
// null/empty for them rather than guessing.
export const BLACK2_NATURE_MODIFIERS: null = null;
export const BLACK2_TYPE_EFFECTIVENESS_CHART: null = null;
export const BLACK2_ABILITY_LOGIC: null = null;
export const BLACK2_FACILITY_LEVEL_RANGE: null = null;
export const BLACK2_FACILITY_BATTLE_STYLE_COUNTS: Record<string, number> = {};

export const BLACK2_ABILITIES: Black2Named[] = [
{ index: 0, constant: "ABILITY_NONE", name: "--" },
  { index: 1, constant: "ABILITY_STENCH", name: "Stench" },
  { index: 2, constant: "ABILITY_DRIZZLE", name: "Drizzle" },
  { index: 3, constant: "ABILITY_SPEED_BOOST", name: "Speed Boost" },
  { index: 4, constant: "ABILITY_BATTLE_ARMOR", name: "Battle Armor" },
  { index: 5, constant: "ABILITY_STURDY", name: "Sturdy" },
  { index: 6, constant: "ABILITY_DAMP", name: "Damp" },
  { index: 7, constant: "ABILITY_LIMBER", name: "Limber" },
  { index: 8, constant: "ABILITY_SAND_VEIL", name: "Sand Veil" },
  { index: 9, constant: "ABILITY_STATIC", name: "Static" },
  { index: 10, constant: "ABILITY_VOLT_ABSORB", name: "Volt Absorb" },
  { index: 11, constant: "ABILITY_WATER_ABSORB", name: "Water Absorb" },
  { index: 12, constant: "ABILITY_OBLIVIOUS", name: "Oblivious" },
  { index: 13, constant: "ABILITY_CLOUD_NINE", name: "Cloud Nine" },
  { index: 14, constant: "ABILITY_COMPOUNDEYES", name: "Compoundeyes" },
  { index: 15, constant: "ABILITY_INSOMNIA", name: "Insomnia" },
  { index: 16, constant: "ABILITY_COLOR_CHANGE", name: "Color Change" },
  { index: 17, constant: "ABILITY_IMMUNITY", name: "Immunity" },
  { index: 18, constant: "ABILITY_FLASH_FIRE", name: "Flash Fire" },
  { index: 19, constant: "ABILITY_SHIELD_DUST", name: "Shield Dust" },
  { index: 20, constant: "ABILITY_OWN_TEMPO", name: "Own Tempo" },
  { index: 21, constant: "ABILITY_SUCTION_CUPS", name: "Suction Cups" },
  { index: 22, constant: "ABILITY_INTIMIDATE", name: "Intimidate" },
  { index: 23, constant: "ABILITY_SHADOW_TAG", name: "Shadow Tag" },
  { index: 24, constant: "ABILITY_ROUGH_SKIN", name: "Rough Skin" },
  { index: 25, constant: "ABILITY_WONDER_GUARD", name: "Wonder Guard" },
  { index: 26, constant: "ABILITY_LEVITATE", name: "Levitate" },
  { index: 27, constant: "ABILITY_EFFECT_SPORE", name: "Effect Spore" },
  { index: 28, constant: "ABILITY_SYNCHRONIZE", name: "Synchronize" },
  { index: 29, constant: "ABILITY_CLEAR_BODY", name: "Clear Body" },
  { index: 30, constant: "ABILITY_NATURAL_CURE", name: "Natural Cure" },
  { index: 31, constant: "ABILITY_LIGHTNINGROD", name: "Lightningrod" },
  { index: 32, constant: "ABILITY_SERENE_GRACE", name: "Serene Grace" },
  { index: 33, constant: "ABILITY_SWIFT_SWIM", name: "Swift Swim" },
  { index: 34, constant: "ABILITY_CHLOROPHYLL", name: "Chlorophyll" },
  { index: 35, constant: "ABILITY_ILLUMINATE", name: "Illuminate" },
  { index: 36, constant: "ABILITY_TRACE", name: "Trace" },
  { index: 37, constant: "ABILITY_HUGE_POWER", name: "Huge Power" },
  { index: 38, constant: "ABILITY_POISON_POINT", name: "Poison Point" },
  { index: 39, constant: "ABILITY_INNER_FOCUS", name: "Inner Focus" },
  { index: 40, constant: "ABILITY_MAGMA_ARMOR", name: "Magma Armor" },
  { index: 41, constant: "ABILITY_WATER_VEIL", name: "Water Veil" },
  { index: 42, constant: "ABILITY_MAGNET_PULL", name: "Magnet Pull" },
  { index: 43, constant: "ABILITY_SOUNDPROOF", name: "Soundproof" },
  { index: 44, constant: "ABILITY_RAIN_DISH", name: "Rain Dish" },
  { index: 45, constant: "ABILITY_SAND_STREAM", name: "Sand Stream" },
  { index: 46, constant: "ABILITY_PRESSURE", name: "Pressure" },
  { index: 47, constant: "ABILITY_THICK_FAT", name: "Thick Fat" },
  { index: 48, constant: "ABILITY_EARLY_BIRD", name: "Early Bird" },
  { index: 49, constant: "ABILITY_FLAME_BODY", name: "Flame Body" },
  { index: 50, constant: "ABILITY_RUN_AWAY", name: "Run Away" },
  { index: 51, constant: "ABILITY_KEEN_EYE", name: "Keen Eye" },
  { index: 52, constant: "ABILITY_HYPER_CUTTER", name: "Hyper Cutter" },
  { index: 53, constant: "ABILITY_PICKUP", name: "Pickup" },
  { index: 54, constant: "ABILITY_TRUANT", name: "Truant" },
  { index: 55, constant: "ABILITY_HUSTLE", name: "Hustle" },
  { index: 56, constant: "ABILITY_CUTE_CHARM", name: "Cute Charm" },
  { index: 57, constant: "ABILITY_PLUS", name: "Plus" },
  { index: 58, constant: "ABILITY_MINUS", name: "Minus" },
  { index: 59, constant: "ABILITY_FORECAST", name: "Forecast" },
  { index: 60, constant: "ABILITY_STICKY_HOLD", name: "Sticky Hold" },
  { index: 61, constant: "ABILITY_SHED_SKIN", name: "Shed Skin" },
  { index: 62, constant: "ABILITY_GUTS", name: "Guts" },
  { index: 63, constant: "ABILITY_MARVEL_SCALE", name: "Marvel Scale" },
  { index: 64, constant: "ABILITY_LIQUID_OOZE", name: "Liquid Ooze" },
  { index: 65, constant: "ABILITY_OVERGROW", name: "Overgrow" },
  { index: 66, constant: "ABILITY_BLAZE", name: "Blaze" },
  { index: 67, constant: "ABILITY_TORRENT", name: "Torrent" },
  { index: 68, constant: "ABILITY_SWARM", name: "Swarm" },
  { index: 69, constant: "ABILITY_ROCK_HEAD", name: "Rock Head" },
  { index: 70, constant: "ABILITY_DROUGHT", name: "Drought" },
  { index: 71, constant: "ABILITY_ARENA_TRAP", name: "Arena Trap" },
  { index: 72, constant: "ABILITY_VITAL_SPIRIT", name: "Vital Spirit" },
  { index: 73, constant: "ABILITY_WHITE_SMOKE", name: "White Smoke" },
  { index: 74, constant: "ABILITY_PURE_POWER", name: "Pure Power" },
  { index: 75, constant: "ABILITY_SHELL_ARMOR", name: "Shell Armor" },
  { index: 76, constant: "ABILITY_AIR_LOCK", name: "Air Lock" },
  { index: 77, constant: "ABILITY_TANGLED_FEET", name: "Tangled Feet" },
  { index: 78, constant: "ABILITY_MOTOR_DRIVE", name: "Motor Drive" },
  { index: 79, constant: "ABILITY_RIVALRY", name: "Rivalry" },
  { index: 80, constant: "ABILITY_STEADFAST", name: "Steadfast" },
  { index: 81, constant: "ABILITY_SNOW_CLOAK", name: "Snow Cloak" },
  { index: 82, constant: "ABILITY_GLUTTONY", name: "Gluttony" },
  { index: 83, constant: "ABILITY_ANGER_POINT", name: "Anger Point" },
  { index: 84, constant: "ABILITY_UNBURDEN", name: "Unburden" },
  { index: 85, constant: "ABILITY_HEATPROOF", name: "Heatproof" },
  { index: 86, constant: "ABILITY_SIMPLE", name: "Simple" },
  { index: 87, constant: "ABILITY_DRY_SKIN", name: "Dry Skin" },
  { index: 88, constant: "ABILITY_DOWNLOAD", name: "Download" },
  { index: 89, constant: "ABILITY_IRON_FIST", name: "Iron Fist" },
  { index: 90, constant: "ABILITY_POISON_HEAL", name: "Poison Heal" },
  { index: 91, constant: "ABILITY_ADAPTABILITY", name: "Adaptability" },
  { index: 92, constant: "ABILITY_SKILL_LINK", name: "Skill Link" },
  { index: 93, constant: "ABILITY_HYDRATION", name: "Hydration" },
  { index: 94, constant: "ABILITY_SOLAR_POWER", name: "Solar Power" },
  { index: 95, constant: "ABILITY_QUICK_FEET", name: "Quick Feet" },
  { index: 96, constant: "ABILITY_NORMALIZE", name: "Normalize" },
  { index: 97, constant: "ABILITY_SNIPER", name: "Sniper" },
  { index: 98, constant: "ABILITY_MAGIC_GUARD", name: "Magic Guard" },
  { index: 99, constant: "ABILITY_NO_GUARD", name: "No Guard" },
  { index: 100, constant: "ABILITY_STALL", name: "Stall" },
  { index: 101, constant: "ABILITY_TECHNICIAN", name: "Technician" },
  { index: 102, constant: "ABILITY_LEAF_GUARD", name: "Leaf Guard" },
  { index: 103, constant: "ABILITY_KLUTZ", name: "Klutz" },
  { index: 104, constant: "ABILITY_MOLD_BREAKER", name: "Mold Breaker" },
  { index: 105, constant: "ABILITY_SUPER_LUCK", name: "Super Luck" },
  { index: 106, constant: "ABILITY_AFTERMATH", name: "Aftermath" },
  { index: 107, constant: "ABILITY_ANTICIPATION", name: "Anticipation" },
  { index: 108, constant: "ABILITY_FOREWARN", name: "Forewarn" },
  { index: 109, constant: "ABILITY_UNAWARE", name: "Unaware" },
  { index: 110, constant: "ABILITY_TINTED_LENS", name: "Tinted Lens" },
  { index: 111, constant: "ABILITY_FILTER", name: "Filter" },
  { index: 112, constant: "ABILITY_SLOW_START", name: "Slow Start" },
  { index: 113, constant: "ABILITY_SCRAPPY", name: "Scrappy" },
  { index: 114, constant: "ABILITY_STORM_DRAIN", name: "Storm Drain" },
  { index: 115, constant: "ABILITY_ICE_BODY", name: "Ice Body" },
  { index: 116, constant: "ABILITY_SOLID_ROCK", name: "Solid Rock" },
  { index: 117, constant: "ABILITY_SNOW_WARNING", name: "Snow Warning" },
  { index: 118, constant: "ABILITY_HONEY_GATHER", name: "Honey Gather" },
  { index: 119, constant: "ABILITY_FRISK", name: "Frisk" },
  { index: 120, constant: "ABILITY_RECKLESS", name: "Reckless" },
  { index: 121, constant: "ABILITY_MULTITYPE", name: "Multitype" },
  { index: 122, constant: "ABILITY_FLOWER_GIFT", name: "Flower Gift" },
  { index: 123, constant: "ABILITY_BAD_DREAMS", name: "Bad Dreams" },
  { index: 124, constant: "ABILITY_PICKPOCKET", name: "Pickpocket" },
  { index: 125, constant: "ABILITY_SHEER_FORCE", name: "Sheer Force" },
  { index: 126, constant: "ABILITY_CONTRARY", name: "Contrary" },
  { index: 127, constant: "ABILITY_UNNERVE", name: "Unnerve" },
  { index: 128, constant: "ABILITY_DEFIANT", name: "Defiant" },
  { index: 129, constant: "ABILITY_DEFEATIST", name: "Defeatist" },
  { index: 130, constant: "ABILITY_CURSED_BODY", name: "Cursed Body" },
  { index: 131, constant: "ABILITY_HEALER", name: "Healer" },
  { index: 132, constant: "ABILITY_FRIEND_GUARD", name: "Friend Guard" },
  { index: 133, constant: "ABILITY_WEAK_ARMOR", name: "Weak Armor" },
  { index: 134, constant: "ABILITY_HEAVY_METAL", name: "Heavy Metal" },
  { index: 135, constant: "ABILITY_LIGHT_METAL", name: "Light Metal" },
  { index: 136, constant: "ABILITY_MULTISCALE", name: "Multiscale" },
  { index: 137, constant: "ABILITY_TOXIC_BOOST", name: "Toxic Boost" },
  { index: 138, constant: "ABILITY_FLARE_BOOST", name: "Flare Boost" },
  { index: 139, constant: "ABILITY_HARVEST", name: "Harvest" },
  { index: 140, constant: "ABILITY_TELEPATHY", name: "Telepathy" },
  { index: 141, constant: "ABILITY_MOODY", name: "Moody" },
  { index: 142, constant: "ABILITY_OVERCOAT", name: "Overcoat" },
  { index: 143, constant: "ABILITY_POISON_TOUCH", name: "Poison Touch" },
  { index: 144, constant: "ABILITY_REGENERATOR", name: "Regenerator" },
  { index: 145, constant: "ABILITY_BIG_PECKS", name: "Big Pecks" },
  { index: 146, constant: "ABILITY_SAND_RUSH", name: "Sand Rush" },
  { index: 147, constant: "ABILITY_WONDER_SKIN", name: "Wonder Skin" },
  { index: 148, constant: "ABILITY_ANALYTIC", name: "Analytic" },
  { index: 149, constant: "ABILITY_ILLUSION", name: "Illusion" },
  { index: 150, constant: "ABILITY_IMPOSTER", name: "Imposter" },
  { index: 151, constant: "ABILITY_INFILTRATOR", name: "Infiltrator" },
  { index: 152, constant: "ABILITY_MUMMY", name: "Mummy" },
  { index: 153, constant: "ABILITY_MOXIE", name: "Moxie" },
  { index: 154, constant: "ABILITY_JUSTIFIED", name: "Justified" },
  { index: 155, constant: "ABILITY_RATTLED", name: "Rattled" },
  { index: 156, constant: "ABILITY_MAGIC_BOUNCE", name: "Magic Bounce" },
  { index: 157, constant: "ABILITY_SAP_SIPPER", name: "Sap Sipper" },
  { index: 158, constant: "ABILITY_PRANKSTER", name: "Prankster" },
  { index: 159, constant: "ABILITY_SAND_FORCE", name: "Sand Force" },
  { index: 160, constant: "ABILITY_IRON_BARBS", name: "Iron Barbs" },
  { index: 161, constant: "ABILITY_ZEN_MODE", name: "Zen Mode" },
  { index: 162, constant: "ABILITY_VICTORY_STAR", name: "Victory Star" },
  { index: 163, constant: "ABILITY_TURBOBLAZE", name: "Turboblaze" },
  { index: 164, constant: "ABILITY_TERAVOLT", name: "Teravolt" }
];

export const BLACK2_NATURES: Black2Named[] = [
  { index: 0, constant: "NATURE_HARDY", name: "Hardy" },
  { index: 1, constant: "NATURE_LONELY", name: "Lonely" },
  { index: 2, constant: "NATURE_BRAVE", name: "Brave" },
  { index: 3, constant: "NATURE_ADAMANT", name: "Adamant" },
  { index: 4, constant: "NATURE_NAUGHTY", name: "Naughty" },
  { index: 5, constant: "NATURE_BOLD", name: "Bold" },
  { index: 6, constant: "NATURE_DOCILE", name: "Docile" },
  { index: 7, constant: "NATURE_RELAXED", name: "Relaxed" },
  { index: 8, constant: "NATURE_IMPISH", name: "Impish" },
  { index: 9, constant: "NATURE_LAX", name: "Lax" },
  { index: 10, constant: "NATURE_TIMID", name: "Timid" },
  { index: 11, constant: "NATURE_HASTY", name: "Hasty" },
  { index: 12, constant: "NATURE_SERIOUS", name: "Serious" },
  { index: 13, constant: "NATURE_JOLLY", name: "Jolly" },
  { index: 14, constant: "NATURE_NAIVE", name: "Naive" },
  { index: 15, constant: "NATURE_MODEST", name: "Modest" },
  { index: 16, constant: "NATURE_MILD", name: "Mild" },
  { index: 17, constant: "NATURE_QUIET", name: "Quiet" },
  { index: 18, constant: "NATURE_BASHFUL", name: "Bashful" },
  { index: 19, constant: "NATURE_RASH", name: "Rash" },
  { index: 20, constant: "NATURE_CALM", name: "Calm" },
  { index: 21, constant: "NATURE_GENTLE", name: "Gentle" },
  { index: 22, constant: "NATURE_SASSY", name: "Sassy" },
  { index: 23, constant: "NATURE_CAREFUL", name: "Careful" },
  { index: 24, constant: "NATURE_QUIRKY", name: "Quirky" }
];

export const BLACK2_TYPES: Black2Named[] = [
  { index: 0, constant: "TYPE_NORMAL", name: "Normal" },
  { index: 1, constant: "TYPE_FIGHTING", name: "Fighting" },
  { index: 2, constant: "TYPE_FLYING", name: "Flying" },
  { index: 3, constant: "TYPE_POISON", name: "Poison" },
  { index: 4, constant: "TYPE_GROUND", name: "Ground" },
  { index: 5, constant: "TYPE_ROCK", name: "Rock" },
  { index: 6, constant: "TYPE_BUG", name: "Bug" },
  { index: 7, constant: "TYPE_GHOST", name: "Ghost" },
  { index: 8, constant: "TYPE_STEEL", name: "Steel" },
  { index: 9, constant: "TYPE_FIRE", name: "Fire" },
  { index: 10, constant: "TYPE_WATER", name: "Water" },
  { index: 11, constant: "TYPE_GRASS", name: "Grass" },
  { index: 12, constant: "TYPE_ELECTRIC", name: "Electric" },
  { index: 13, constant: "TYPE_PSYCHIC", name: "Psychic" },
  { index: 14, constant: "TYPE_ICE", name: "Ice" },
  { index: 15, constant: "TYPE_DRAGON", name: "Dragon" },
  { index: 16, constant: "TYPE_DARK", name: "Dark" }
];

// TYPE_NULL (index 17) has no JSON file; it is a constant only, for a
// typeless move. It is NOT a playable type and must not be offered as one.
export const BLACK2_TYPE_NULL: Black2Named = { index: 17, constant: "TYPE_NULL", name: "" };


export const KEPT_TRAINER_CLASSES: Black2TrainerClass[] = [
  { constant: "TRAINER_CLASS_ACE_TRAINER_F", name: "Ace Trainer", nameWithArticle: "an Ace Trainer" },
  { constant: "TRAINER_CLASS_ACE_TRAINER_M", name: "Ace Trainer", nameWithArticle: "an Ace Trainer" },
  { constant: "TRAINER_CLASS_ALIEN", name: "Alien", nameWithArticle: "an Alien" },
  { constant: "TRAINER_CLASS_ARTIST", name: "Artist", nameWithArticle: "an Artist" },
  { constant: "TRAINER_CLASS_BACKERS_F", name: "Backers", nameWithArticle: "a Backer" },
  { constant: "TRAINER_CLASS_BACKERS_M", name: "Backers", nameWithArticle: "a Backer" },
  { constant: "TRAINER_CLASS_BACKPACKER_F", name: "Backpacker", nameWithArticle: "a Backpacker" },
  { constant: "TRAINER_CLASS_BACKPACKER_M", name: "Backpacker", nameWithArticle: "a Backpacker" },
  { constant: "TRAINER_CLASS_BAKER", name: "Baker", nameWithArticle: "a Baker" },
  { constant: "TRAINER_CLASS_BATTLE_GIRL", name: "Battle Girl", nameWithArticle: "a Battle Girl" },
  { constant: "TRAINER_CLASS_BEAUTY", name: "Beauty", nameWithArticle: "a Beauty" },
  { constant: "TRAINER_CLASS_BIKER", name: "Biker", nameWithArticle: "a Biker" },
  { constant: "TRAINER_CLASS_BLACK_BELT", name: "Black Belt", nameWithArticle: "a Black Belt" },
  { constant: "TRAINER_CLASS_CHAMPION", name: "Champion", nameWithArticle: "a Champion" },
  { constant: "TRAINER_CLASS_CLERK_F", name: "Clerk \u246e", nameWithArticle: "a Clerk \u246e" },
  { constant: "TRAINER_CLASS_CLERK_M_66", name: "Clerk \u246d", nameWithArticle: "a Clerk \u246d" },
  { constant: "TRAINER_CLASS_CLERK_M_67", name: "Clerk \u246d", nameWithArticle: "a Clerk \u246d" },
  { constant: "TRAINER_CLASS_CURSED_GENT", name: "Cursed Gent", nameWithArticle: "the Cursed Gent" },
  { constant: "TRAINER_CLASS_CURSED_KID", name: "Cursed Kid", nameWithArticle: "the Cursed Kid" },
  { constant: "TRAINER_CLASS_CURSED_MAN", name: "Cursed Man", nameWithArticle: "the Cursed Man" },
  { constant: "TRAINER_CLASS_CYCLIST_F", name: "Cyclist", nameWithArticle: "a Cyclist" },
  { constant: "TRAINER_CLASS_CYCLIST_M", name: "Cyclist", nameWithArticle: "a Cyclist" },
  { constant: "TRAINER_CLASS_DANCER", name: "Dancer", nameWithArticle: "a Dancer" },
  { constant: "TRAINER_CLASS_DEPOT_AGENT", name: "Depot Agent", nameWithArticle: "a Depot Agent" },
  { constant: "TRAINER_CLASS_DIVINE_MAID", name: "Divine Maid", nameWithArticle: "the Divine Maid" },
  { constant: "TRAINER_CLASS_DOCTOR", name: "Doctor", nameWithArticle: "a Doctor" },
  { constant: "TRAINER_CLASS_WITHHELD_001", name: "Elite Four", nameWithArticle: "an Elite Four" },
  { constant: "TRAINER_CLASS_WITHHELD_002", name: "Elite Four", nameWithArticle: "an Elite Four" },
  { constant: "TRAINER_CLASS_WITHHELD_003", name: "Elite Four", nameWithArticle: "an Elite Four" },
  { constant: "TRAINER_CLASS_WITHHELD_004", name: "Elite Four", nameWithArticle: "an Elite Four" },
  { constant: "TRAINER_CLASS_FISHERMAN", name: "Fisherman", nameWithArticle: "a Fisherman" },
  { constant: "TRAINER_CLASS_FUTURE_BEING", name: "Future Being", nameWithArticle: "a Future Being" },
  { constant: "TRAINER_CLASS_WITHHELD_005", name: "GAME FREAK", nameWithArticle: "a GAME FREAK" },
  { constant: "TRAINER_CLASS_WITHHELD_006", name: "GAME FREAK", nameWithArticle: "a GAME FREAK" },
  { constant: "TRAINER_CLASS_GENTLEMAN", name: "Gentleman", nameWithArticle: "a Gentleman" },
  { constant: "TRAINER_CLASS_GIRL", name: "Girl", nameWithArticle: "a Girl" },
  { constant: "TRAINER_CLASS_GIRL_IN_SUIT_224", name: "Girl in Suit", nameWithArticle: "a Mannequin \u246e" },
  { constant: "TRAINER_CLASS_GIRL_IN_SUIT_226", name: "Girl in Suit", nameWithArticle: "a Mannequin \u246e" },
  { constant: "TRAINER_CLASS_GUITARIST", name: "Guitarist", nameWithArticle: "a Guitarist" },
  { constant: "TRAINER_CLASS_GUY", name: "Guy", nameWithArticle: "a Guy" },
  { constant: "TRAINER_CLASS_GUY_IN_SUIT_223", name: "Guy in Suit", nameWithArticle: "a Mannequin \u246d" },
  { constant: "TRAINER_CLASS_GUY_IN_SUIT_225", name: "Guy in Suit", nameWithArticle: "a Mannequin \u246d" },
  { constant: "TRAINER_CLASS_HARLEQUIN_233", name: "Harlequin", nameWithArticle: "a Harlequin" },
  { constant: "TRAINER_CLASS_HARLEQUIN_32", name: "Harlequin", nameWithArticle: "a Harlequin" },
  { constant: "TRAINER_CLASS_HERO", name: "Hero", nameWithArticle: "a Hero" },
  { constant: "TRAINER_CLASS_HEROINE", name: "Heroine", nameWithArticle: "a Heroine" },
  { constant: "TRAINER_CLASS_HIKER", name: "Hiker", nameWithArticle: "a Hiker" },
  { constant: "TRAINER_CLASS_HOOLIGANS", name: "Hooligans", nameWithArticle: "the Hooligans" },
  { constant: "TRAINER_CLASS_HOOPSTER", name: "Hoopster", nameWithArticle: "a Hoopster" },
  { constant: "TRAINER_CLASS_INFIELDER", name: "Infielder", nameWithArticle: "an Infielder" },
  { constant: "TRAINER_CLASS_JANITOR", name: "Janitor", nameWithArticle: "a Janitor" },
  { constant: "TRAINER_CLASS_LADY", name: "Lady", nameWithArticle: "a Lady" },
  { constant: "TRAINER_CLASS_LASS", name: "Lass", nameWithArticle: "a Lass" },
  { constant: "TRAINER_CLASS_WITHHELD_007", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_008", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_009", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_010", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_011", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_012", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_013", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_WITHHELD_014", name: "Leader", nameWithArticle: "a Leader" },
  { constant: "TRAINER_CLASS_LINEBACKER", name: "Linebacker", nameWithArticle: "a Linebacker" },
  { constant: "TRAINER_CLASS_MAID", name: "Maid", nameWithArticle: "a Maid" },
  { constant: "TRAINER_CLASS_MASKED_MAN", name: "Masked Man", nameWithArticle: "the Masked Man" },
  { constant: "TRAINER_CLASS_MECHACOMBO", name: "Mechacombo", nameWithArticle: "a Mechacombo" },
  { constant: "TRAINER_CLASS_MOTORCYCLIST", name: "Motorcyclist", nameWithArticle: "a Motorcyclist" },
  { constant: "TRAINER_CLASS_MUSICIAN", name: "Musician", nameWithArticle: "a Musician" },
  { constant: "TRAINER_CLASS_NINJA_F", name: "Ninja", nameWithArticle: "a Ninja" },
  { constant: "TRAINER_CLASS_NINJA_M", name: "Ninja", nameWithArticle: "a Ninja" },
  { constant: "TRAINER_CLASS_NURSE", name: "Nurse", nameWithArticle: "a Nurse" },
  { constant: "TRAINER_CLASS_NURSERY_AIDE", name: "Nursery Aide", nameWithArticle: "a Nursery Aide" },
  { constant: "TRAINER_CLASS_OLD_STATUE", name: "Old Statue", nameWithArticle: "the Old Statue" },
  { constant: "TRAINER_CLASS_PARASOL_LADY", name: "Parasol Lady", nameWithArticle: "a Parasol Lady" },
  { constant: "TRAINER_CLASS_PILOT", name: "Pilot", nameWithArticle: "a Pilot" },
  { constant: "TRAINER_CLASS_PKMN_BREEDER_F", name: "\u2486\u2487 Breeder", nameWithArticle: "a \u2486\u2487 Breeder" },
  { constant: "TRAINER_CLASS_PKMN_BREEDER_M", name: "\u2486\u2487 Breeder", nameWithArticle: "a \u2486\u2487 Breeder" },
  { constant: "TRAINER_CLASS_PKMN_RANGER_F", name: "\u2486\u2487 Ranger", nameWithArticle: "a \u2486\u2487 Ranger" },
  { constant: "TRAINER_CLASS_PKMN_RANGER_M", name: "\u2486\u2487 Ranger", nameWithArticle: "a \u2486\u2487 Ranger" },
  { constant: "TRAINER_CLASS_WITHHELD_015", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_016", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_017", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_018", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_019", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_020", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_021", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_022", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_023", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_107", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_109", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_111", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_181", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_183", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_185", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_198", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_229", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_F_230", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_104", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_105", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_106", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_108", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_110", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_180", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_182", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_184", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_M_228", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_024", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_025", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PKMN_TRAINER_RIVAL", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_026", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_WITHHELD_027", name: "\u2486\u2487 Trainer", nameWithArticle: "a \u2486\u2487 Trainer" },
  { constant: "TRAINER_CLASS_PLUSH_TOY", name: "Plush Toy", nameWithArticle: "a Plush Toy" },
  { constant: "TRAINER_CLASS_POKEFAN_F", name: "Pok\u00e9fan", nameWithArticle: "a Pok\u00e9fan" },
  { constant: "TRAINER_CLASS_POKEFAN_M", name: "Pok\u00e9fan", nameWithArticle: "a Pok\u00e9fan" },
  { constant: "TRAINER_CLASS_POLICEMAN", name: "Policeman", nameWithArticle: "a Policeman" },
  { constant: "TRAINER_CLASS_PRESCHOOLER_F", name: "Preschooler", nameWithArticle: "a Preschooler" },
  { constant: "TRAINER_CLASS_PRESCHOOLER_M", name: "Preschooler", nameWithArticle: "a Preschooler" },
  { constant: "TRAINER_CLASS_PRINCE", name: "Prince", nameWithArticle: "a Prince" },
  { constant: "TRAINER_CLASS_PRINCESS", name: "Princess", nameWithArticle: "a Princess" },
  { constant: "TRAINER_CLASS_PSYCHIC_F", name: "Psychic", nameWithArticle: "a Psychic" },
  { constant: "TRAINER_CLASS_PSYCHIC_M", name: "Psychic", nameWithArticle: "a Psychic" },
  { constant: "TRAINER_CLASS_RED_FOG", name: "Red Fog", nameWithArticle: "the Red Fog" },
  { constant: "TRAINER_CLASS_RICH_BOY", name: "Rich Boy", nameWithArticle: "a Rich Boy" },
  { constant: "TRAINER_CLASS_ROUGHNECK", name: "Roughneck", nameWithArticle: "a Roughneck" },
  { constant: "TRAINER_CLASS_SCHOOL_KID_F", name: "School Kid", nameWithArticle: "a School Kid" },
  { constant: "TRAINER_CLASS_SCHOOL_KID_M", name: "School Kid", nameWithArticle: "a School Kid" },
  { constant: "TRAINER_CLASS_SCIENTIST_F_206", name: "Scientist", nameWithArticle: "a Scientist" },
  { constant: "TRAINER_CLASS_SCIENTIST_F_46", name: "Scientist", nameWithArticle: "a Scientist" },
  { constant: "TRAINER_CLASS_SCIENTIST_M_205", name: "Scientist", nameWithArticle: "a Scientist" },
  { constant: "TRAINER_CLASS_SCIENTIST_M_52", name: "Scientist", nameWithArticle: "a Scientist" },
  { constant: "TRAINER_CLASS_SMASHER", name: "Smasher", nameWithArticle: "a Smasher" },
  { constant: "TRAINER_CLASS_SOCIALITE", name: "Socialite", nameWithArticle: "a Socialite" },
  { constant: "TRAINER_CLASS_STRIKER", name: "Striker", nameWithArticle: "a Striker" },
  { constant: "TRAINER_CLASS_SUBWAY_BOSS_102", name: "Subway Boss", nameWithArticle: "a Subway Boss" },
  { constant: "TRAINER_CLASS_SUBWAY_BOSS_88", name: "Subway Boss", nameWithArticle: "a Subway Boss" },
  { constant: "TRAINER_CLASS_WITHHELD_028", name: "Subway Boss", nameWithArticle: "a Subway Boss" },
  { constant: "TRAINER_CLASS_WITHHELD_029", name: "Subway Boss", nameWithArticle: "a Subway Boss" },
  { constant: "TRAINER_CLASS_SWIMMER_F", name: "Swimmer \u246e", nameWithArticle: "a Swimmer \u246e" },
  { constant: "TRAINER_CLASS_SWIMMER_M", name: "Swimmer \u246d", nameWithArticle: "a Swimmer \u246d" },
  { constant: "TRAINER_CLASS_TWINS", name: "Twins", nameWithArticle: "a Twin" },
  { constant: "TRAINER_CLASS_UDF_TROOPER_F", name: "UDF Trooper", nameWithArticle: "a UDF Trooper" },
  { constant: "TRAINER_CLASS_UDF_TROOPER_M", name: "UDF Trooper", nameWithArticle: "a UDF Trooper" },
  { constant: "TRAINER_CLASS_UFO", name: "UFO", nameWithArticle: "a UFO" },
  { constant: "TRAINER_CLASS_VETERAN_F", name: "Veteran", nameWithArticle: "a Veteran" },
  { constant: "TRAINER_CLASS_VETERAN_M", name: "Veteran", nameWithArticle: "a Veteran" },
  { constant: "TRAINER_CLASS_WAITER", name: "Waiter", nameWithArticle: "a Waiter" },
  { constant: "TRAINER_CLASS_WAITRESS", name: "Waitress", nameWithArticle: "a Waitress" },
  { constant: "TRAINER_CLASS_WITCH", name: "Witch", nameWithArticle: "a Witch" },
  { constant: "TRAINER_CLASS_WORKER_26", name: "Worker", nameWithArticle: "a Worker" },
  { constant: "TRAINER_CLASS_WORKER_44", name: "Worker", nameWithArticle: "a Worker" },
  { constant: "TRAINER_CLASS_YOUNGSTER", name: "Youngster", nameWithArticle: "a Youngster" }
];

export const BLACK2_AI_STRATEGIES: Black2AiStrategy[] = [
  { flag: 0, file: "basic", governance: "Discourages wasted or failing moves; immune-target moves lose 10 or 12 points; per-effect checks.", storyTrainersUsing: 785, wireable: true },
  { flag: 1, file: "eval_attack", governance: "Scores damaging moves by damage; non-strongest loses 1, knockout gains 4, 4x-effective usually gains 2.", storyTrainersUsing: 383, wireable: true },
  { flag: 2, file: "expert", governance: "Scores each move effect by situational usefulness from a per-effect table.", storyTrainersUsing: 405, wireable: true },
  { flag: 3, file: "setup_first_turn", governance: "First turn only: +2 to setup-effect moves, 68.75% of the time.", storyTrainersUsing: 0, wireable: true },
  { flag: 4, file: "target_hp", governance: "Status moves gain 1 half the time at target 50% HP or less, and another 1 half the time at 25% or less; damaging moves gain 1 on the first turn.", storyTrainersUsing: 6, wireable: true },
  { flag: 5, file: "fusion_moves", governance: "First turn only: a paired signature-move pair gains 10 points. Species are not repeated here by design.", storyTrainersUsing: 0, wireable: true },
  { flag: 6, file: "baton_pass", governance: "For status moves with reserves left, favours raising own stats and protecting, then passing boosts on.", storyTrainersUsing: 0, wireable: true },
  { flag: 7, file: "tag_strategy", governance: "Double/triple battles only: scores moves by effect on partners, including spread moves hitting partners.", storyTrainersUsing: 109, wireable: true },
  { flag: 8, file: "check_hp", governance: "Move effects suited to a different HP range lose 2 points, 80% of the time; attacker HP checked first, then target HP.", storyTrainersUsing: 0, wireable: true },
  { flag: 9, file: "weather", governance: "First turn only: a weather-setting move gains 5 when that weather is not already active.", storyTrainersUsing: 0, wireable: true },
  { flag: 10, file: "harassment", governance: "+2 to a listed set of harassing effects (status and stat-lowering), half the time.", storyTrainersUsing: 0, wireable: true },
  { flag: 11, file: "roaming_pokemon", governance: "Flees unless trapped; trapping conditions and trapping abilities apply.", storyTrainersUsing: 0, wireable: true },
  { flag: 12, file: "safari", governance: "HELD OUT - legacy/broken: previous-generation routine whose command argument handling misreads the next value. Do NOT wire as-is.", storyTrainersUsing: 0, wireable: false },
  { flag: 13, file: "catch_tutorial", governance: "Flees once the player's creature is at 20% HP or less.", storyTrainersUsing: 0, wireable: true }
];

export const BLACK2_FACILITY_SUMMARIES: Black2FacilitySummary[] = [
  { facility: "battle_subway", trainerFileCount: 315, setFileCount: 1000, totalPoolReferences: 18880, poolSizeMin: 1, poolSizeMax: 96, poolSizeMean: 59.94, distinctSpeciesInSets: 297, trainersWithMessages: 314 },
  { facility: "black_tower", trainerFileCount: 661, setFileCount: 1000, totalPoolReferences: 7861, poolSizeMin: 1, poolSizeMax: 20, poolSizeMean: 11.89, distinctSpeciesInSets: 304, trainersWithMessages: 0 },
  { facility: "pwt_leaders", trainerFileCount: 120, setFileCount: 1000, totalPoolReferences: 573, poolSizeMin: 1, poolSizeMax: 6, poolSizeMean: 4.78, distinctSpeciesInSets: 277, trainersWithMessages: 0 },
  { facility: "pwt_masters", trainerFileCount: 69, setFileCount: 1000, totalPoolReferences: 409, poolSizeMin: 1, poolSizeMax: 6, poolSizeMean: 5.93, distinctSpeciesInSets: 209, trainersWithMessages: 0 },
  { facility: "pwt_regular", trainerFileCount: 120, setFileCount: 1000, totalPoolReferences: 523, poolSizeMin: 1, poolSizeMax: 6, poolSizeMean: 4.36, distinctSpeciesInSets: 280, trainersWithMessages: 0 },
  { facility: "pwt_rental", trainerFileCount: 0, setFileCount: 1000, totalPoolReferences: 0, poolSizeMin: 0, poolSizeMax: 0, poolSizeMean: 0, distinctSpeciesInSets: 297, trainersWithMessages: 0 }
];

// The 16 batch-D src systems, mapped to a file that exists on main
// (verified against main 65570289) or NEED TO MAKE. Status HAVE means
// the Mochiichao system exists in that file; it does NOT mean the
// Black 2 values were copied into it. Status NEED means no equivalent
// file exists on main and original code is still owed.
export interface Black2SrcSystemMap {
  system: string; black2FileMatches: number; mochiichaoFile: string; status: "HAVE" | "NEED TO MAKE";
}
export const BLACK2_SRC_SYSTEM_MAP: Black2SrcSystemMap[] = [
  { system: "Battle", black2FileMatches: 84, mochiichaoFile: "src/components/views/BattleView.tsx + src/lib/battleResolver.ts", status: "HAVE" },
  { system: "Party menu", black2FileMatches: 16, mochiichaoFile: "src/components/views/RosterView.tsx", status: "HAVE" },
  { system: "Bag", black2FileMatches: 8, mochiichaoFile: "src/components/views/BagView.tsx", status: "HAVE" },
  { system: "Shop", black2FileMatches: 2, mochiichaoFile: "src/components/views/ShopView.tsx", status: "HAVE" },
  { system: "PC / storage", black2FileMatches: 16, mochiichaoFile: "src/components/views/PcView.tsx", status: "HAVE" },
  { system: "Title + main menu", black2FileMatches: 25, mochiichaoFile: "src/components/IntroSequence.tsx + src/components/game/GameShell.tsx", status: "HAVE" },
  { system: "Save / load", black2FileMatches: 80, mochiichaoFile: "src/components/SaveMenu.tsx + src/store/gameStore.ts", status: "HAVE" },
  { system: "Weather", black2FileMatches: 9, mochiichaoFile: "src/lib/fieldWeather.ts + src/world/WorldEngine.tsx", status: "HAVE" },
  { system: "Camera", black2FileMatches: 9, mochiichaoFile: "src/components/game/PixiWorldCanvas.tsx + src/components/game/PixiBattleCanvas.tsx", status: "HAVE" },
  { system: "Battle animation / effects", black2FileMatches: 47, mochiichaoFile: "src/components/game/PixiBattleCanvas.tsx + src/lib/battleFrames.ts", status: "HAVE" },
  { system: "Overworld movement / field", black2FileMatches: 111, mochiichaoFile: "src/world/WorldEngine.tsx + src/world/FullWorldMaps.ts", status: "HAVE" },
  { system: "Day / night / time / seasons", black2FileMatches: 10, mochiichaoFile: "src/lib/fieldWeather.ts (weather table) + lighting periods below", status: "HAVE" },
  { system: "Dialogue / message", black2FileMatches: 22, mochiichaoFile: "src/components/game/DialogueBox.tsx + src/world/WorldEngine.tsx", status: "HAVE" },
  { system: "Sound / music (code side)", black2FileMatches: 26, mochiichaoFile: "src/lib/audioRouting.ts + src/lib/bootAudio.ts", status: "HAVE" },
  { system: "System core / shared UI", black2FileMatches: 48, mochiichaoFile: "src/components/game/GameShell.tsx + src/components/game/MenuList.tsx + src/components/game/UiArt.tsx", status: "HAVE" },
  { system: "Network / link", black2FileMatches: 0, mochiichaoFile: "NEED TO MAKE - no network/link file found on main", status: "NEED TO MAKE" },
];

// ---- Lookups: pure functions over data passed in (staged JSON arrays) ----

export function buildItemIndex(items: Black2Item[]): Map<string, Black2Item> {
  const m = new Map<string, Black2Item>();
  for (const it of items) m.set(it.sourceConstant, it);
  return m;
}
export function itemByConstant(items: Black2Item[], constant: string): Black2Item | undefined {
  return items.find((it) => it.sourceConstant === constant);
}
export function itemsByPocket(items: Black2Item[], pocket: string): Black2Item[] {
  return items.filter((it) => it.field_pocket === pocket);
}
export function itemsByPriceRange(items: Black2Item[], minPrice: number, max: number): Black2Item[] {
  return items.filter((it) => it.price >= minPrice && it.price <= max);
}
export function itemsWithHoldEffect(items: Black2Item[], effect: string): Black2Item[] {
  return items.filter((it) => it.hold_effect === effect);
}
export function itemsWithFlingPower(items: Black2Item[], minPower: number): Black2Item[] {
  return items.filter((it) => it.fling_power >= minPower);
}
export function itemsWithEffectFlag(items: Black2Item[], flag: keyof Black2ItemEffects): Black2Item[] {
  return items.filter((it) => it.effects !== null && Boolean(it.effects[flag]));
}
export function sellPrice(item: Black2Item): number {
  // Same rule ShopView already uses on main: sell at half, rounded down.
  return Math.floor(item.price / 2);
}

export function abilityByIndex(index: number): Black2Named | undefined {
  return BLACK2_ABILITIES.find((a) => a.index === index);
}
export function abilityByConstant(constant: string): Black2Named | undefined {
  return BLACK2_ABILITIES.find((a) => a.constant === constant);
}
export function natureByIndex(index: number): Black2Named | undefined {
  return BLACK2_NATURES.find((n) => n.index === index);
}
export function typeByIndex(index: number): Black2Named | undefined {
  if (index === 17) return BLACK2_TYPE_NULL;
  return BLACK2_TYPES.find((t) => t.index === index);
}
export function trainerClassByConstant(constant: string): Black2TrainerClass | undefined {
  return KEPT_TRAINER_CLASSES.find((c) => c.constant === constant);
}
export function aiStrategyByFlag(flag: number): Black2AiStrategy | undefined {
  return BLACK2_AI_STRATEGIES.find((s) => s.flag === flag);
}
export function wireableAiStrategies(): Black2AiStrategy[] {
  return BLACK2_AI_STRATEGIES.filter((s) => s.wireable);
}
export function facilitySummaryByName(name: string): Black2FacilitySummary | undefined {
  return BLACK2_FACILITY_SUMMARIES.find((f) => f.facility === name);
}
export function facilityTrainerById(trainers: Black2FacilityTrainer[], id: string): Black2FacilityTrainer | undefined {
  return trainers.find((t) => t.id === id);
}
export function facilitySetById(sets: Black2FacilitySet[], setId: string): Black2FacilitySet | undefined {
  return sets.find((s) => s.setId === setId);
}
export function facilitySetsForTrainer(trainers: Black2FacilityTrainer[], sets: Black2FacilitySet[], trainerId: string): Black2FacilitySet[] {
  const t = facilityTrainerById(trainers, trainerId);
  if (!t) return [];
  const byId = new Map(sets.map((s) => [s.setId, s]));
  const out: Black2FacilitySet[] = [];
  for (const sid of t.pool) { const s = byId.get(sid); if (s) out.push(s); }
  return out;
}

export function lightingSetById(sets: Black2LightingSet[], id: string): Black2LightingSet | undefined {
  return sets.find((s) => s.id === id);
}
export function lightingPeriodAtHour(set: Black2LightingSet, hour: number, minutes: number): Black2LightingPeriod | undefined {
  // Periods are end-time periods (15 per set in the source). The period
  // in force is the first period whose end time is after the query time;
  // if none is after, the first period of the next day applies.
  const t = hour * 60 + minutes;
  for (const p of set.periods) {
    if (p.end.hour * 60 + p.end.minutes > t) return p;
  }
  return set.periods[0];
}
export function zoneByIndex(zones: Black2Zone[], index: number): Black2Zone | undefined {
  return zones.find((z) => z.id === "zone_" + String(index).padStart(3, "0"));
}
export function zonesByWeatherCode(zones: Black2Zone[], code: number): Black2Zone[] {
  // Weather codes are NOT interpreted here: 0 occurs in 610/615 zones,
  // 3 in 2, 9 in 2, 12 in 1. Mapping a code to a Mochiichao weather
  // state is NEED TO MAKE (see wiring map).
  return zones.filter((z) => z.weather === code);
}
export function encounterSetByIndex(sets: Black2EncounterSet[], index: number): Black2EncounterSet | undefined {
  return sets.find((s) => s.id === "encounter_set_" + String(index).padStart(3, "0"));
}
export function encounterSlots(
  sets: Black2EncounterSet[], index: number, season: string, terrain: Black2Terrain, version: "black2" | "white2" = "black2",
): Black2EncounterSlot[] {
  const set = encounterSetByIndex(sets, index);
  if (!set) return [];
  const block = set.seasons[season] ?? set.seasons["all_year"];
  if (!block) return [];
  const val = block.terrains[terrain];
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val[version] ?? [];
}
export function encounterRate(sets: Black2EncounterSet[], index: number, season: string, terrain: Black2Terrain): number {
  const set = encounterSetByIndex(sets, index);
  if (!set) return 0;
  const block = set.seasons[season] ?? set.seasons["all_year"];
  if (!block) return 0;
  return block.rates[terrain] ?? 0;
}
