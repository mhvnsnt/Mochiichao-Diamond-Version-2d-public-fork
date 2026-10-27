import { MochiiInstance, SpeciesData } from "./types";
import { SPECIES_DB } from "./species";
import { MOVES_DB } from "./moves";

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculateStat(base: number, iv: number, ev: number, level: number, isHp: boolean): number {
  const core = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
  if (isHp) return core + level + 10;
  return core + 5;
}

export function createMochii(speciesId: string, level: number): MochiiInstance | null {
  const species = SPECIES_DB[speciesId];
  if (!species) return null;

  // Simple static IV/EV for this prototype
  const iv = 15;
  const ev = 0;

  const hp = calculateStat(species.baseStats.hp, iv, ev, level, true);
  const atk = calculateStat(species.baseStats.atk, iv, ev, level, false);
  const def = calculateStat(species.baseStats.def, iv, ev, level, false);
  const spa = calculateStat(species.baseStats.spa, iv, ev, level, false);
  const spd = calculateStat(species.baseStats.spd, iv, ev, level, false);
  const spe = calculateStat(species.baseStats.spe, iv, ev, level, false);

  // Find up to 4 recent moves
  const available = species.learnset.filter(l => l.level <= level).map(l => l.moveId);
  const moves = available.slice(-4);
  const pp = moves.map(m => MOVES_DB[m]?.pp || 10);

  // Experience lookup (simplified Fast curve)
  const experience = Math.pow(level, 3); // Approx for medium fast.

  return {
    id: generateId(),
    speciesId,
    nickname: species.name,
    level,
    experience,
    hp,
    maxHp: hp,
    stats: { atk, def, spa, spd, spe },
    stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 },
    status: null,
    moves,
    pp
  };
}

export function getExpNeeded(level: number, rate: string): number {
  return Math.pow(level, 3); 
}

export function gainExp(instance: MochiiInstance, amount: number) {
  const species = SPECIES_DB[instance.speciesId];
  if (!species) return { leveledUp: false, newLevel: instance.level };

  instance.experience += amount;
  let newLevel = instance.level;
  let leveledUp = false;

  while (newLevel < 100 && instance.experience >= getExpNeeded(newLevel + 1, species.growthRate)) {
    newLevel++;
    leveledUp = true;
  }

  if (leveledUp) {
    instance.level = newLevel;
    // Recalculate max HP and keep percentage
    const calcHp = calculateStat(species.baseStats.hp, 15, 0, newLevel, true);
    const hpDiff = calcHp - instance.maxHp;
    instance.maxHp = calcHp;
    instance.hp += hpDiff;
    instance.stats.atk = calculateStat(species.baseStats.atk, 15, 0, newLevel, false);
    instance.stats.def = calculateStat(species.baseStats.def, 15, 0, newLevel, false);
    instance.stats.spa = calculateStat(species.baseStats.spa, 15, 0, newLevel, false);
    instance.stats.spd = calculateStat(species.baseStats.spd, 15, 0, newLevel, false);
    instance.stats.spe = calculateStat(species.baseStats.spe, 15, 0, newLevel, false);
  }

  return { leveledUp, newLevel };
}

/**
 * Evolve a live instance into a target species, in place (2026-10-27,
 * wiring lane -- the BattleView mid-fight hook). The caller owns the
 * rule check (evolution-hook safeEvolutionReady); this only performs
 * the swap. Nickname follows the new species when it still equals the
 * old species name; a player-set nickname is kept. Stats are
 * recalculated from the target's base stats at the current level
 * (same IV/EV as createMochii/gainExp), HP keeps its proportion,
 * and moves come from the target's learnset exactly like createMochii.
 * Returns false when the target species does not exist (no-op).
 */
export function evolveInstance(instance: MochiiInstance, targetId: string): boolean {
  const target = SPECIES_DB[targetId];
  if (!target) return false;
  const from = SPECIES_DB[instance.speciesId];

  const hpPct = instance.maxHp > 0 ? instance.hp / instance.maxHp : 1;
  if (from && instance.nickname === from.name) instance.nickname = target.name;
  instance.speciesId = targetId;
  instance.maxHp = calculateStat(target.baseStats.hp, 15, 0, instance.level, true);
  instance.hp = Math.max(1, Math.round(instance.maxHp * hpPct));
  instance.stats.atk = calculateStat(target.baseStats.atk, 15, 0, instance.level, false);
  instance.stats.def = calculateStat(target.baseStats.def, 15, 0, instance.level, false);
  instance.stats.spa = calculateStat(target.baseStats.spa, 15, 0, instance.level, false);
  instance.stats.spd = calculateStat(target.baseStats.spd, 15, 0, instance.level, false);
  instance.stats.spe = calculateStat(target.baseStats.spe, 15, 0, instance.level, false);

  const available = target.learnset.filter(l => l.level <= instance.level).map(l => l.moveId);
  instance.moves = available.slice(-4);
  instance.pp = instance.moves.map(m => MOVES_DB[m]?.pp || 10);
  return true;
}
