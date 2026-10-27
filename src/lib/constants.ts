import { ElementType } from "./types";

export const TYPES: Record<ElementType, { name: string; color: string }> = {
  NORMAL:   { name:"Normal",   color:"#A8A878" },
  FIRE:     { name:"Fire",     color:"#F08030" },
  WATER:    { name:"Water",    color:"#6890F0" },
  GRASS:    { name:"Grass",    color:"#78C850" },
  ELECTRIC: { name:"Electric", color:"#F8D030" },
  ICE:      { name:"Ice",      color:"#98D8D8" },
  FIGHTING: { name:"Fighting", color:"#C03028" },
  POISON:   { name:"Poison",   color:"#A040A0" },
  GROUND:   { name:"Ground",   color:"#E0C068" },
  FLYING:   { name:"Flying",   color:"#A890F0" },
  PSYCHIC:  { name:"Psychic",  color:"#F85888" },
  BUG:      { name:"Bug",      color:"#A8B820" },
  ROCK:     { name:"Rock",     color:"#B8A038" },
  GHOST:    { name:"Ghost",    color:"#705898" },
  DRAGON:   { name:"Dragon",   color:"#7038F8" },
  DARK:     { name:"Dark",     color:"#705848" },
  STEEL:    { name:"Steel",    color:"#B8B8D0" },
  FAIRY:    { name:"Fairy",    color:"#EE99AC" },
  MYTHIC:   { name:"Mythic",   color:"#FFD54F" },
};

function effectiveness(atkType: ElementType, defType: ElementType): number {
  const superEffective: Partial<Record<ElementType, ElementType[]>> = {
    NORMAL: [],
    FIRE: ["GRASS","ICE","BUG","STEEL"],
    WATER: ["FIRE","GROUND","ROCK"],
    GRASS: ["WATER","GROUND","ROCK"],
    ELECTRIC: ["WATER","FLYING"],
    ICE: ["GRASS","GROUND","FLYING","DRAGON"],
    FIGHTING: ["NORMAL","ICE","ROCK","DARK","STEEL"],
    POISON: ["GRASS","FAIRY"],
    GROUND: ["FIRE","ELECTRIC","POISON","ROCK","STEEL"],
    FLYING: ["GRASS","FIGHTING","BUG"],
    PSYCHIC: ["FIGHTING","POISON"],
    BUG: ["GRASS","PSYCHIC","DARK"],
    ROCK: ["FIRE","ICE","FLYING","BUG"],
    GHOST: ["PSYCHIC","GHOST"],
    DRAGON: ["DRAGON"],
    DARK: ["PSYCHIC","GHOST"],
    STEEL: ["ICE","ROCK","FAIRY"],
    FAIRY: ["FIGHTING","DRAGON","DARK"],
  };
  const notVery: Partial<Record<ElementType, ElementType[]>> = {
    NORMAL: ["ROCK","STEEL"],
    FIRE: ["FIRE","WATER","ROCK","DRAGON"],
    WATER: ["WATER","GRASS","DRAGON"],
    GRASS: ["FIRE","GRASS","POISON","FLYING","BUG","DRAGON","STEEL"],
    ELECTRIC: ["ELECTRIC","GRASS","DRAGON"],
    ICE: ["WATER","ICE"],
    FIGHTING: ["POISON","PSYCHIC","BUG","FLYING","FAIRY"],
    POISON: ["POISON","GROUND","ROCK","GHOST"],
    GROUND: ["GRASS","BUG"],
    FLYING: ["ELECTRIC","ROCK","STEEL"],
    PSYCHIC: ["PSYCHIC","STEEL"],
    BUG: ["FIRE","FIGHTING","FLYING","GHOST","STEEL","FAIRY"],
    ROCK: ["FIGHTING","GROUND","STEEL"],
    GHOST: ["DARK"],
    DRAGON: [],
    DARK: ["FIGHTING","DARK","FAIRY"],
    STEEL: ["FIRE","WATER","ELECTRIC","STEEL"],
    FAIRY: ["FIRE","POISON","STEEL"],
  };
  const noEffect: Partial<Record<ElementType, ElementType[]>> = {
    NORMAL: ["GHOST"],
    ELECTRIC: ["GROUND"],
    FIGHTING: ["GHOST"],
    POISON: ["STEEL"],
    GROUND: ["FLYING"],
    PSYCHIC: ["DARK"],
    GHOST: ["NORMAL"],
    DRAGON: ["FAIRY"],
  };

  if ((noEffect[atkType] || []).includes(defType)) return 0;
  if ((superEffective[atkType] || []).includes(defType)) return 2;
  if ((notVery[atkType] || []).includes(defType)) return 0.5;
  return 1;
}

export function calcTypeMultiplier(atkType: ElementType, defType1: ElementType, defType2?: ElementType): number {
  let m = effectiveness(atkType, defType1);
  if (defType2 && defType2 !== defType1) {
    m *= effectiveness(atkType, defType2);
  }
  return m;
}

export const STAGE_MULTS: Record<string, number> = {
  "-6":0.25, "-5":0.29, "-4":0.33, "-3":0.40, "-2":0.50, "-1":0.67,
  "0":1.0, "1":1.5, "2":2.0, "3":2.5, "4":3.0, "5":3.5, "6":4.0
};

export function stageMult(stage: number) { 
  return STAGE_MULTS[String(Math.max(-6,Math.min(6,stage)))] || 1.0; 
}
