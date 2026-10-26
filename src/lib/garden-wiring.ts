/**
 * Mochi Garden wiring — pass 2, pure logic, no network, no imports
 * from game screens. This is the code that closes the Garden wiring
 * gap: persisted records, cocoon timer, farm, race, sparring, breeding.
 *
 * Rules only, Mochiichao values, Mochiichao names. No character,
 * dialogue, cry, logo, town name, art, or sound from any other game.
 * Fruit map below is a PROPOSED data file (Mars can change one line);
 * it is not presented as Mars-approved canon.
 */
import {
  GardenStats, GardenCreature, clamp, applyGardenItem, gardenForm,
  dominantStat, typeVariant,
} from './mochiichao-systems';

export interface FarmPlot {
  id: string;
  seed: string | null;
  plantedAt: number; // in-game minutes, Garden time only while save loaded
  readyAt: number;
  harvested: boolean;
}

export interface GardenSaveRecord extends GardenCreature {
  // All extended fields are optional so a plain GardenCreature from
  // main (pass 3 store) is assignable, and upgradeGardenRecord fills
  // defaults on first Garden use. No other lane's record is clobbered.
  gardenAge?: number; // Garden Years, 1 year = 60 in-game Garden minutes
  rebirths?: number;
  mythic?: boolean;
  personality?: string;
  favouriteFruit?: string;
  cocoon?: { active: boolean; startedAt: number; endsAt: number; targetForm: string } | null;
  farm?: FarmPlot[];
  raceWins?: number;
  sparWins?: number;
  egg?: { speciesId: string; parentA: string; parentB: string; stepsRemaining: number } | null;
  collectedCritters?: string[];
}

/** Upgrade a pass-3 GardenCreature to a full GardenSaveRecord, defaults only. */
export function upgradeGardenRecord(
  rec: GardenCreature | undefined, speciesId: string, seed: number,
): GardenSaveRecord {
  const base = rec || newGardenRecord(speciesId, seed);
  return {
    ...base,
    gardenAge: (base as GardenSaveRecord).gardenAge ?? 0,
    rebirths: (base as GardenSaveRecord).rebirths ?? 0,
    mythic: (base as GardenSaveRecord).mythic ?? false,
    personality: (base as GardenSaveRecord).personality ?? 'Curious',
    favouriteFruit: (base as GardenSaveRecord).favouriteFruit ?? 'Aqua Fruit',
    cocoon: (base as GardenSaveRecord).cocoon ?? null,
    farm: (base as GardenSaveRecord).farm ?? (newGardenRecord(speciesId, seed).farm as FarmPlot[]),
    raceWins: (base as GardenSaveRecord).raceWins ?? 0,
    sparWins: (base as GardenSaveRecord).sparWins ?? 0,
    egg: (base as GardenSaveRecord).egg ?? null,
    collectedCritters: (base as GardenSaveRecord).collectedCritters ?? [],
  };
}

export const ZERO_STATS: GardenStats = { dive: 0, glide: 0, sprint: 0, might: 0, endurance: 0 };

export function newGardenRecord(speciesId: string, seed: number): GardenSaveRecord {
  return {
    speciesId, garden: { ...ZERO_STATS }, careScore: 0, bond: 0,
    careMistakes: 0, trainingSessions: 0, colorwaySeed: seed, parts: [],
    gardenAge: 0, rebirths: 0, mythic: false, personality: 'Curious',
    favouriteFruit: 'Aqua Fruit',
    cocoon: null,
    farm: [
      { id: 'plot-1', seed: null, plantedAt: 0, readyAt: 0, harvested: false },
      { id: 'plot-2', seed: null, plantedAt: 0, readyAt: 0, harvested: false },
      { id: 'plot-3', seed: null, plantedAt: 0, readyAt: 0, harvested: false },
    ],
    raceWins: 0, sparWins: 0, egg: null, collectedCritters: [],
  };
}

/** Cocoon: enter at Form I/II threshold, emerge after 10 Garden minutes. */
export function enterCocoon(rec: GardenSaveRecord, nowMinutes: number): GardenSaveRecord {
  const form = gardenForm(rec.garden);
  if (form === 'Base' || rec.cocoon) return rec;
  return { ...rec, cocoon: { active: true, startedAt: nowMinutes, endsAt: nowMinutes + 10, targetForm: form } };
}
export function tickCocoon(rec: GardenSaveRecord, nowMinutes: number): GardenSaveRecord {
  if (!rec.cocoon || nowMinutes < rec.cocoon.endsAt) return rec;
  return { ...rec, cocoon: null, gardenAge: rec.gardenAge + 0.1 };
}

/** Farm: plant a seed, ready after 7 Garden minutes, harvest gives fruit. */
export function plantPlot(rec: GardenSaveRecord, plotId: string, seed: string, nowMinutes: number): GardenSaveRecord {
  return {
    ...rec,
    farm: (rec.farm ?? []).map(p => p.id === plotId && !p.seed
      ? { ...p, seed, plantedAt: nowMinutes, readyAt: nowMinutes + 7, harvested: false }
      : p),
  };
}
export function harvestPlot(rec: GardenSaveRecord, plotId: string, nowMinutes: number): { rec: GardenSaveRecord; fruit: string | null } {
  const plot = (rec.farm ?? []).find(p => p.id === plotId);
  if (!plot || !plot.seed || nowMinutes < plot.readyAt) return { rec, fruit: null };
  const fruit = plot.seed;
  return {
    rec: { ...rec, farm: (rec.farm ?? []).map(p => p.id === plotId ? { ...p, seed: null, harvested: true } : p) },
    fruit,
  };
}

/** Race: speed = sprint + glide, fade = endurance. Higher score wins. */
export function raceScore(g: GardenStats): number {
  const speed = g.sprint + g.glide;
  const fade = Math.max(0, 50 - g.endurance);
  return speed * 2 - fade;
}
export function runRace(a: GardenStats, b: GardenStats): 'A' | 'B' | 'Tie' {
  const sa = raceScore(a), sb = raceScore(b);
  return sa > sb ? 'A' : sb > sa ? 'B' : 'Tie';
}

/** Sparring: auto-battler score. Might = damage, endurance = HP, sprint = ring speed, dive/glide = dodge. */
export function sparScore(g: GardenStats): number {
  return g.might * 3 + g.endurance * 2 + g.sprint + Math.floor((g.dive + g.glide) / 2);
}
export function runSpar(a: GardenStats, b: GardenStats): 'A' | 'B' | 'Tie' {
  const sa = sparScore(a), sb = sparScore(b);
  return sa > sb ? 'A' : sb > sa ? 'B' : 'Tie';
}

/**
 * Breeding / Bonding Season Egg.
 * Default species = base form of the higher-Bond parent (spec rule),
 * player may override to either parent's species in the UI — never a
 * silent mother's-species default, never a hybrid species.
 * Grades: 50/50 per stat, higher grade wins visible 70% — modelled
 * here as: higher parent stat wins 70% of the time via a deterministic
 * seed (0-99, Mars can change the seed, no random module in save).
 * Garden Form, battle level, Mythic Form, Rebirth count: NOT inherited.
 * Mythic creatures cannot breed.
 */
export function createBreedingEgg(
  parentA: GardenSaveRecord, parentB: GardenSaveRecord,
  overrideSpeciesId: string | null, seed70: number,
): GardenSaveRecord['egg'] | null {
  if (parentA.mythic || parentB.mythic) return null;
  const higher = parentA.bond >= parentB.bond ? parentA : parentB;
  const speciesId = overrideSpeciesId || higher.speciesId;
  return {
    speciesId,
    parentA: parentA.speciesId, parentB: parentB.speciesId,
    stepsRemaining: 100,
  };
}
export function inheritedGardenStats(a: GardenStats, b: GardenStats, seed70: number): GardenStats {
  const pick = (x: number, y: number): number => {
    const hi = Math.max(x, y);
    // seed70 in 0-99: <70 picks the higher parent stat, else the lower.
    return seed70 < 70 ? hi : Math.min(x, y);
  };
  return {
    dive: clamp(pick(a.dive, b.dive), 0, 99),
    glide: clamp(pick(a.glide, b.glide), 0, 99),
    sprint: clamp(pick(a.sprint, b.sprint), 0, 99),
    might: clamp(pick(a.might, b.might), 0, 99),
    endurance: clamp(pick(a.endurance, b.endurance), 0, 99),
  };
}

/** Data Rebirth: Bond >50 = Rebirth Egg, stats halved, parts kept. */
export function dataRebirth(rec: GardenSaveRecord): GardenSaveRecord {
  if (rec.bond <= 50) return rec;
  return {
    ...rec,
    garden: {
      dive: Math.floor(rec.garden.dive / 2), glide: Math.floor(rec.garden.glide / 2),
      sprint: Math.floor(rec.garden.sprint / 2), might: Math.floor(rec.garden.might / 2),
      endurance: Math.floor(rec.garden.endurance / 2),
    },
    rebirths: (rec.rebirths ?? 0) + 1, gardenAge: 0, cocoon: null,
    egg: { speciesId: rec.speciesId, parentA: rec.speciesId, parentB: rec.speciesId, stepsRemaining: 100 },
  };
}

export function gardenSummary(rec: GardenSaveRecord): string {
  return `${rec.speciesId} — Form ${gardenForm(rec.garden)}, dominant ${dominantStat(rec.garden)}, variant ${typeVariant(rec.garden) || 'none'}, Bond ${rec.bond}, Rebirths ${rec.rebirths}, Mythic ${rec.mythic ? 'yes' : 'no'}`;
}
export { applyGardenItem };
