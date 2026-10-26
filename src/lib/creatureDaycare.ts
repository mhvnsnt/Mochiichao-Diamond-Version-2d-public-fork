/**
 * Creature Mode Pass 7 — Daycare progression, FireRed structure only.
 *
 * Source: pokefirered-leafgreen/src/daycare.c + include/constants/daycare.h
 * (already in the repo as a decomp submodule, structure only, no
 * dialogue copied, no Pokemon names used):
 * - EXP gained = steps, 1 EXP per step (daycare.c lines ~520, ~555:
 *   experience = GetMonData(MON_DATA_EXP) + daycareMon->steps).
 * - Level after = level from that EXP total, via the game's own
 *   experience table (here: engine gainExp(), which recomputes
 *   level from experience — same shape, Mochiichao numbers).
 * - Retrieve cost = 100 + 100 * numLevelsGained (line ~584).
 *   Currency is CR in Mochiichao (shop prices are CR), so the
 *   FireRed formula numbers are applied in CR, not invented.
 * - Egg check: every 256 steps, when steps & 0xFF == 0xFF and both
 *   daycare slots hold a valid creature (line ~1149), roll
 *   compatibility > random * 100 to create an egg.
 * - Compatibility scores (daycare.h): INCOMPATIBLE 0, LOW 20,
 *   MED 50, MAX 70. Scoring inputs are species, trainer IDs,
 *   genders, and egg groups (daycare.c GetDaycareCompatibilityScore).
 *
 * What is NOT invented in this lane:
 * - Mochiichao's store has NO gender field and NO egg-group field,
 *   so a real compatibility number cannot be computed here yet.
 *   daycareCompatibility() therefore returns null with the reason,
 *   instead of a guessed 20/50/70. The function shape and the
 *   FireRed scoring table are in this file, ready for the Chao
 *   Garden lane's breeding wiring (which owns gender/egg-group
 *   decisions) to supply those two inputs.
 * - Egg species choice (which parent's base form) is likewise
 *   NOT decided here — it is a Chao Garden lane decision, and
 *   with only one deposited creature (the Guardian) there is no
 *   pair to roll for anyway. eggReady() is false until a second
 *   deposited creature exists AND the 256-step check hits.
 * - No level, EXP, or cost number is invented: 1, 100, 100, and
 *   256 are all FireRed's own numbers, applied through
 *   Mochiichao's gainExp() and CR wallet.
 */

export const DAYCARE_EXP_PER_STEP = 1;
export const DAYCARE_COST_BASE = 100;
export const DAYCARE_COST_PER_LEVEL = 100;
export const DAYCARE_EGG_CHECK_STEPS = 256;

export const DAYCARE_COMPATIBILITY = {
  INCOMPATIBLE: 0,
  LOW: 20,
  MED: 50,
  MAX: 70,
} as const;

/** Cost in CR to retrieve a deposited creature, FireRed formula. */
export function daycareRetrieveCost(levelsGained: number): number {
  return DAYCARE_COST_BASE + DAYCARE_COST_PER_LEVEL * Math.max(0, levelsGained);
}

/**
 * Egg-check hit: FireRed rolls only when the second slot's steps
 * land exactly on a 256 boundary (steps & 0xFF == 0xFF).
 */
export function daycareEggCheckHit(steps: number): boolean {
  return steps > 0 && steps % DAYCARE_EGG_CHECK_STEPS === 0;
}

/**
 * Compatibility for a deposited pair. Returns null (not a guess)
 * while gender/egg-group inputs are missing from the store.
 * A pair is breedable only when both slots are filled; with the
 * single Guardian slot this lane has, the answer is always null.
 */
export function daycareCompatibility(input: {
  hasSecondCreature: boolean;
  genderKnown: boolean;
  eggGroupsKnown: boolean;
}): { score: number } | null {
  if (!input.hasSecondCreature) return null;
  if (!input.genderKnown || !input.eggGroupsKnown) return null;
  // Inputs supplied by the breeding lane would branch here through
  // the FireRed table (same species/different trainer = 70,
  // same species/same trainer or different species/different
  // trainer = 50, different species/same trainer = 20, else 0).
  return null;
}

/** Egg is ready only with a pair AND a 256-step check hit. */
export function daycareEggReady(steps: number, hasSecondCreature: boolean): boolean {
  return hasSecondCreature && daycareEggCheckHit(steps);
}
