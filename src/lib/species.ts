import { SpeciesData, ElementType } from "./types";

const BASIC_MOVES = [
  { level: 1, moveId: "TACKLE" },
  { level: 5, moveId: "QUICK_ATTACK" },
];

export const SPECIES_DB: Record<string, SpeciesData> = {
  "001": {
    id: "001",
    name: "Mochii",
    types: ["WATER"],
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    catchRate: 45, baseExpYield: 62, growthRate: "Medium Slow",
    description: "A small, water-based creature that bounces to move.",
    learnset: [...BASIC_MOVES, { level: 8, moveId: "AQUA_SHOT" }, { level: 15, moveId: "AQUA_JET" }],
    evolution: { targetId: "002", level: 16 },
    pokeApiId: 258 // mudkip
  },
  "002": {
    id: "002",
    name: "Tiidebiite",
    types: ["WATER", "FIGHTING"],
    baseStats: { hp: 59, atk: 63, def: 80, spa: 65, spd: 80, spe: 58 },
    catchRate: 45, baseExpYield: 142, growthRate: "Medium Slow",
    description: "It has learned to control the flow of water as a martial art.",
    learnset: [...BASIC_MOVES, { level: 8, moveId: "AQUA_SHOT" }, { level: 16, moveId: "POWER_STRIKE" }],
    evolution: { targetId: "003", level: 36 },
    pokeApiId: 61 // poliwhirl
  },
  "003": {
    id: "003",
    name: "AquariiOS",
    types: ["WATER", "PSYCHIC"],
    baseStats: { hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78 },
    catchRate: 45, baseExpYield: 239, growthRate: "Medium Slow",
    description: "The supreme fluid intelligence.",
    learnset: [...BASIC_MOVES, { level: 8, moveId: "AQUA_SHOT" }, { level: 36, moveId: "MIND_BLAST" }, { level: 45, moveId: "HYDRO_SURGE" }],
    pokeApiId: 121 // starmie
  },
  "004": {
    id: "004",
    name: "Razorgater",
    types: ["WATER", "STEEL"],
    baseStats: { hp: 50, atk: 65, def: 64, spa: 44, spd: 48, spe: 43 },
    catchRate: 45, baseExpYield: 63, growthRate: "Medium Slow",
    description: "A small crocodile with metallic scales.",
    learnset: [...BASIC_MOVES, { level: 8, moveId: "METAL_STRIKE" }, { level: 15, moveId: "AQUA_SHOT" }],
    evolution: { targetId: "005", level: 18 },
    pokeApiId: 158 // totodile
  },
  "005": {
    id: "005",
    name: "Chromejaww",
    types: ["STEEL", "DARK"],
    baseStats: { hp: 65, atk: 80, def: 80, spa: 59, spd: 63, spe: 58 },
    catchRate: 45, baseExpYield: 142, growthRate: "Medium Slow",
    description: "Its chrome hide reflects all light, helping it hunt in shadows.",
    learnset: [...BASIC_MOVES, { level: 8, moveId: "METAL_STRIKE" }, { level: 20, moveId: "CRUNCH" }],
    evolution: { targetId: "006", level: 30 },
    pokeApiId: 159 // croconaw
  },
  "006": {
    id: "006",
    name: "Reaperdile",
    types: ["STEEL", "DRAGON"],
    baseStats: { hp: 85, atk: 105, def: 100, spa: 79, spd: 83, spe: 78 },
    catchRate: 45, baseExpYield: 239, growthRate: "Medium Slow",
    description: "A walking tank engineered for destruction.",
    learnset: [...BASIC_MOVES, { level: 15, moveId: "FLASH_CANNON_MOVE" }, { level: 30, moveId: "DRAGON_CLAW" }, { level: 45, moveId: "IRON_BARRAGE" }],
    pokeApiId: 160 // feraligatr
  },
  "007": {
    id: "007",
    name: "Tyrage",
    types: ["GROUND"],
    baseStats: { hp: 45, atk: 60, def: 40, spa: 30, spd: 40, spe: 50 },
    catchRate: 45, baseExpYield: 60, growthRate: "Medium Slow",
    description: "A tiny dinosaur made of packed earth.",
    learnset: [...BASIC_MOVES, { level: 9, moveId: "MUD_BLAST" }, { level: 14, moveId: "BULLDOZE" }],
    evolution: { targetId: "008", level: 16 },
    pokeApiId: 246 // larvitar
  },
  "008": {
    id: "008",
    name: "Duneclaw",
    types: ["GROUND", "ROCK"],
    baseStats: { hp: 60, atk: 75, def: 55, spa: 45, spd: 55, spe: 65 },
    catchRate: 45, baseExpYield: 140, growthRate: "Medium Slow",
    description: "It wears a bone mask and hunts in the desert.",
    learnset: [...BASIC_MOVES, { level: 9, moveId: "MUD_BLAST" }, { level: 20, moveId: "EARTH_POWER" }],
    evolution: { targetId: "009", level: 34 },
    pokeApiId: 247 // pupitar
  },
  "009": {
    id: "009",
    name: "Oblivirex",
    types: ["GROUND", "GHOST"],
    baseStats: { hp: 80, atk: 100, def: 80, spa: 65, spd: 80, spe: 85 },
    catchRate: 45, baseExpYield: 240, growthRate: "Medium Slow",
    description: "The apex predator fossilized into code.",
    learnset: [...BASIC_MOVES, { level: 34, moveId: "SHADOW_PULSE" }, { level: 42, moveId: "EARTH_TREMOR" }],
    pokeApiId: 248 // tyranitar
  },
  "010": {
    id: "010",
    name: "Kittember",
    types: ["FIRE"],
    baseStats: { hp: 40, atk: 50, def: 40, spa: 60, spd: 40, spe: 60 },
    catchRate: 200, baseExpYield: 52, growthRate: "Fast",
    description: "A fiery little feline.",
    learnset: [...BASIC_MOVES, { level: 6, moveId: "EMBER_TOSS" }, { level: 14, moveId: "FIRE_STREAM" }],
    pokeApiId: 725 // litten
  },
  "038": {
    id: "038",
    name: "Sproutle",
    types: ["GRASS"],
    baseStats: { hp: 55, atk: 68, def: 64, spa: 45, spd: 55, spe: 31 },
    catchRate: 200, baseExpYield: 50, growthRate: "Medium Fast",
    description: "A little plant turtle.",
    learnset: [...BASIC_MOVES, { level: 6, moveId: "VINE_LASH" }, { level: 14, moveId: "RAZOR_LEAF" }],
    evolution: { targetId: "039", level: 18 },
    pokeApiId: 387 // turtwig
  },
  "039": {
    id: "039",
    name: "Shellguard",
    types: ["GRASS", "STEEL"],
    baseStats: { hp: 75, atk: 89, def: 85, spa: 55, spd: 65, spe: 36 },
    catchRate: 45, baseExpYield: 180, growthRate: "Medium Fast",
    description: "A fortress with a steel shell covered in moss.",
    learnset: [...BASIC_MOVES, { level: 18, moveId: "METAL_STRIKE" }, { level: 32, moveId: "SOLAR_BLAST" }],
    evolution: { targetId: "040", level: 32 }
  },
  "040": {
    id: "040",
    name: "Dreadtoise",
    types: ["GRASS", "STEEL"],
    baseStats: { hp: 95, atk: 109, def: 105, spa: 75, spd: 85, spe: 56 },
    catchRate: 45, baseExpYield: 239, growthRate: "Medium Fast",
    description: "A walking dreadnought whose steel shell has grown into a forest fortress.",
    learnset: [...BASIC_MOVES, { level: 6, moveId: "VINE_LASH" }, { level: 18, moveId: "RAZOR_LEAF" }, { level: 24, moveId: "METAL_STRIKE" }]
  }
};
