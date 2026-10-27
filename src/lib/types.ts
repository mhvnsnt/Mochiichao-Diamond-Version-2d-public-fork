export type ElementType = 
  | "NORMAL" | "FIRE" | "WATER" | "GRASS" | "ELECTRIC" | "ICE" 
  | "FIGHTING" | "POISON" | "GROUND" | "FLYING" | "PSYCHIC" 
  | "BUG" | "ROCK" | "GHOST" | "DRAGON" | "DARK" | "STEEL" | "FAIRY" | "MYTHIC";

export type MoveCategory = "Physical" | "Special" | "Status";

export interface Move {
  name: string;
  type: ElementType;
  cat: MoveCategory;
  bp: number;
  acc: number;
  pp: number;
  pri: number;
  effect: string;
  effectChance: number;
  anim?: string;
  desc: string;
}

export type GrowthRate = "Fast" | "Medium Fast" | "Medium Slow" | "Slow";

export interface SpeciesData {
  id: string; // e.g. "001"
  name: string;
  types: ElementType[];
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  catchRate: number;
  baseExpYield: number;
  growthRate: GrowthRate;
  learnset: { level: number; moveId: string }[];
  evolution?: { targetId: string; level: number };
  description: string;
  pokeApiId?: number; // Fetches sprite + enhanced dex description from PokeAPI
  apiSearchTags?: string[];
}

export interface MochiiInstance {
  id: string; // unique uuid
  speciesId: string;
  nickname: string;
  level: number;
  experience: number;
  hp: number;
  maxHp: number;
  stats: { atk: number; def: number; spa: number; spd: number; spe: number };
  stages: { atk: number; def: number; spa: number; spd: number; spe: number; acc: number; eva: number };
  status: string | null;
  moves: string[]; // move IDs
  pp: number[]; // current PP
}
