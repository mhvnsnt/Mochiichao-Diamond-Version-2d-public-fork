/**
 * Phase 4 Garden extension — berry growth stages + companion care loop.
 * Pokemon's own order, non-combat side: items/berries → breeding/daycare
 * → Garden. This COMPLEMENTS (never replaces) what is already on main:
 * - src/lib/garden-wiring.ts: Garden records, cocoon timer, farm plots
 *   (seed/readyAt), races, sparring, breeding egg record.
 * - src/lib/garden-data.ts: Garden fruit map + Garden critter types.
 * - src/lib/creatureDaycare.ts: FireRed daycare steps / EXP / cost /
 *   compatibility scores.
 * What this file ADDS, which none of those hold:
 * - A berry growth-stage state machine (plant → sprout → growing →
 *   bloom → fruit → withered) with a watering multiplier and a
 *   harvest-timing yield curve. Shape from Ruby/Emerald berry.c and
 *   Platinum berry_patch_manager.c (multi-patch state); stage lengths
 *   and yields are Mochiichao tuning, labelled as such.
 * - A Chao-lane companion care loop (hunger / mood / energy decay +
 *   fruit / animal / accessory effect application as pure deltas).
 *   Shape from chao-modding-docs (ChaoDataStruct, FruitModding,
 *   AnimalModding, AccessoryModding) and sa_tools pipeline stages;
 *   no Chao data, art, or names are copied — companion stats here are
 *   Mochiichao's Garden stats vocabulary.
 * - A daycare step-tick helper (steps-to-egg countdown) that feeds the
 *   egg record in garden-wiring.ts; compatibility scoring itself stays
 *   in creatureDaycare.ts.
 *
 * Pure functions, no imports, no battle code, no species/character
 * names, no dialogue, no cries, no logos, no art. Local CPU only.
 */

export type BerryStage = "empty" | "planted" | "sprout" | "growing" | "bloom" | "fruit" | "withered";

export interface BerryPatch {
  id: string;
  seedId: string | null;
  stage: BerryStage;
  /** In-game minutes since planting (Garden time, same clock as garden-wiring). */
  ageMinutes: number;
  waterings: number;
  /** 0..1 — watering raises the yield multiplier, never the stage clock. */
  waterBonus: number;
}

export const BERRY_STAGE_MINUTES: Record<Exclude<BerryStage, "empty" | "withered">, number> = {
  planted: 60,
  sprout: 120,
  growing: 180,
  bloom: 120,
};

/** Mochiichao tuning: stage thresholds above; total planted→fruit = 480 min. */
export function berryStageForAge(ageMinutes: number): BerryStage {
  if (ageMinutes < 0) return "planted";
  let acc = 0;
  const order: Array<Exclude<BerryStage, "empty" | "withered">> = ["planted", "sprout", "growing", "bloom"];
  for (const stage of order) {
    acc += BERRY_STAGE_MINUTES[stage];
    if (ageMinutes < acc) return stage;
  }
  return "fruit";
}

/** Advance a patch by elapsed minutes. Fruit left unharvested withers after 240 min (Mochiichao tuning). */
export function berryTick(patch: BerryPatch, elapsedMinutes: number): BerryPatch {
  if (patch.stage === "empty" || patch.seedId === null) return patch;
  const age = patch.ageMinutes + elapsedMinutes;
  let stage = berryStageForAge(age);
  if (stage === "fruit" && age >= 480 + 240) stage = "withered";
  return { ...patch, ageMinutes: age, stage };
}

export function berryWater(patch: BerryPatch): BerryPatch {
  if (patch.stage === "empty" || patch.stage === "fruit" || patch.stage === "withered") return patch;
  return { ...patch, waterings: patch.waterings + 1, waterBonus: Math.min(1, patch.waterBonus + 0.25) };
}

/** Yield: base 2 + watering bonus (up to +2) + on-time bonus (+1 if harvested
 *  within 120 min of reaching fruit). Harvesting a withered patch yields 0. */
export function berryHarvest(patch: BerryPatch): { yieldCount: number; patch: BerryPatch } {
  if (patch.stage !== "fruit" || patch.seedId === null) return { yieldCount: 0, patch };
  const fruitAge = patch.ageMinutes - 480;
  const onTime = fruitAge <= 120 ? 1 : 0;
  const yieldCount = 2 + Math.round(patch.waterBonus * 2) + onTime;
  return { yieldCount, patch: { ...patch, seedId: null, stage: "empty", ageMinutes: 0, waterings: 0, waterBonus: 0 } };
}

export function berryPlant(patchId: string, seedId: string): BerryPatch {
  return { id: patchId, seedId, stage: "planted", ageMinutes: 0, waterings: 0, waterBonus: 0 };
}

/** Multi-patch manager shape (Platinum berry_patch_manager.c shape): tick all, harvest-ready list. */
export function berryTickAll(patches: BerryPatch[], elapsedMinutes: number): BerryPatch[] {
  return patches.map((p) => berryTick(p, elapsedMinutes));
}

export function berryReadyToHarvest(patches: BerryPatch[]): BerryPatch[] {
  return patches.filter((p) => p.stage === "fruit");
}

/* ---- Chao-lane companion care loop (Garden lane only, not battle) ---- */

export interface CompanionCare {
  hunger: number; // 0 full .. 100 starving
  mood: number; // 0 .. 100
  energy: number; // 0 exhausted .. 100 rested
  affection: number; // 0 .. 100
}

export function clampCare(v: number): number { return Math.max(0, Math.min(100, v)); }

/** Decay per Garden hour (Mochiichao tuning): hunger +8, energy -6, mood drifts toward 50 by 2. */
export function companionTick(care: CompanionCare, gardenHours: number): CompanionCare {
  const mood = care.mood + (50 - care.mood) * 0.02 * gardenHours;
  return {
    hunger: clampCare(care.hunger + 8 * gardenHours),
    mood: clampCare(mood),
    energy: clampCare(care.energy - 6 * gardenHours),
    affection: clampCare(care.affection),
  };
}

export interface CareEffect { hunger?: number; mood?: number; energy?: number; affection?: number; }

/** Apply a fruit / animal / accessory effect as pure deltas. Effect tables
 *  themselves live in garden-data.ts (fruit) and Garden lane docs; this is
 *  only the application rule: deltas add, then clamp. */
export function companionApply(care: CompanionCare, effect: CareEffect): CompanionCare {
  return {
    hunger: clampCare(care.hunger + (effect.hunger ?? 0)),
    mood: clampCare(care.mood + (effect.mood ?? 0)),
    energy: clampCare(care.energy + (effect.energy ?? 0)),
    affection: clampCare(care.affection + (effect.affection ?? 0)),
  };
}

/** Rebirth gate shape (Garden conversion doc): a companion may rebirth
 *  only when affection is high AND energy is not exhausted. Thresholds are
 *  Mochiichao tuning. */
export function companionCanRebirth(care: CompanionCare): boolean {
  return care.affection >= 80 && care.energy >= 30;
}

/* ---- Daycare step-tick helper (complements creatureDaycare.ts) ---- */

/** Tick a steps-to-egg countdown. Returns the new countdown and whether an
 *  egg is ready this tick. The 256-step check shape comes from FireRed
 *  daycare (already documented in creatureDaycare.ts); this helper only
 *  counts — compatibility scoring stays there. */
export function daycareStepTick(stepsRemaining: number, stepsTaken: number): { stepsRemaining: number; eggReady: boolean } {
  const next = Math.max(0, stepsRemaining - stepsTaken);
  return { stepsRemaining: next, eggReady: next === 0 && stepsRemaining > 0 };
}

export function phase4GardenSelfCheck(): { berryFruitAt480: boolean; berryWither: boolean; careClamps: boolean; eggTick: boolean } {
  const planted = berryPlant("p1", "garden-seed");
  const grown = berryTick(planted, 480);
  const withered = berryTick(planted, 480 + 240);
  const cared = companionApply({ hunger: 95, mood: 95, energy: 5, affection: 90 }, { hunger: 10, mood: 10, energy: -10 });
  const egg = daycareStepTick(10, 10);
  return {
    berryFruitAt480: grown.stage === "fruit",
    berryWither: withered.stage === "withered",
    careClamps: cared.hunger === 100 && cared.energy === 0,
    eggTick: egg.eggReady === true && egg.stepsRemaining === 0,
  };
}
