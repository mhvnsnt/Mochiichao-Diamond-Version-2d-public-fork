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
 * Pass 8 update (Mars order 2026-10-26: get egg + compatibility
 * done, whatever deposit setup it needs): a second deposit slot
 * (Partner, same shape as Guardian) was added, and the
 * compatibility rule below replaces the Pass 7 null — same
 * species = 50, different species = 20, one shared breeding
 * group, gender not a gate. Egg species = Guardian's base form,
 * hatching at Lv 5 after 256 more steps. See daycareCompatibility.
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
 * Pass 8 compatibility rule (Mars order 2026-10-26: get the egg +
 * compatibility thing done, whatever deposit setup it needs).
 * Mochiichao mapping, stated plainly so it can be changed:
 * - The store has no gender field and no egg-group field, and
 *   Mochiichao breeding is Bonding Season (Chao Garden conversion),
 *   not gendered pairing — so gender is NOT a gate here, and all
 *   Mochiichao creatures share one breeding group (no creature in
 *   the store is marked unbreedable).
 * - Both deposited creatures belong to the player, so the trainer
 *   is always the same — FireRed's 70 (same species, different
 *   trainer) is unreachable with two player-owned creatures.
 * - FireRed's remaining branches, with FireRed's own numbers:
 *   same species, same trainer = 50; different species, same
 *   trainer = 20. No number is invented; the branches that need
 *   gender/egg-group data are the ones dropped, by this rule.
 * Returns null only when there is no second deposited creature.
 */
export function daycareCompatibility(input: {
  hasSecondCreature: boolean;
  sameSpecies: boolean;
}): { score: number } | null {
  if (!input.hasSecondCreature) return null;
  return { score: input.sameSpecies ? DAYCARE_COMPATIBILITY.MED : DAYCARE_COMPATIBILITY.LOW };
}

/** Egg record, persisted in the store. */
export interface DaycareEgg {
  speciesId: string;
  parentA: string;
  parentB: string;
  createdAtSteps: number;
}

/** Egg is ready only with a pair AND a 256-step check hit. */
export function daycareEggReady(steps: number, hasSecondCreature: boolean): boolean {
  return hasSecondCreature && daycareEggCheckHit(steps);
}
