/**
 * Mochiichao proprietary systems — pure logic, no network, no imports.
 *
 * Reference systems (names only, for design provenance):
 * - Pokemon-style capture/battle -> Trainer Mode
 * - Link trading -> Mochi Link
 * - Pokemon Ranger circling capture -> Ring Capture
 * - Chao Garden / Chao World -> Mochi Garden / Mainframe Gardens
 * - Digimon branching / de-digivolution -> Branch Evolution / Data Revert
 *
 * Garden bonus cap: +9% battle bonus (see chao-garden-conversion.md).
 * Burst Form: +30% for 3 turns. Garden Form is palette + accessories +
 * aura, NOT a species change. Colorways and parts never create a species.
 */

export type Alignment = "Bright" | "Neutral" | "Umbral";

export interface GardenStats {
  dive: number;
  glide: number;
  sprint: number;
  might: number;
  endurance: number;
}

export interface GardenCreature {
  speciesId: string;
  garden: GardenStats;
  /** -100 (Umbral care) to +100 (Bright care). */
  careScore: number;
  bond: number; // 0-100
  careMistakes: number;
  trainingSessions: number;
  colorwaySeed: number;
  parts: string[];
}

export const GARDEN_BONUS_CAP = 0.09;
export const BURST_BONUS = 0.3;
export const BURST_TURNS = 3;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Alignment from care history. Neutral band avoids flip-flopping. */
export function alignmentFromCare(careScore: number): Alignment {
  if (careScore >= 25) return "Bright";
  if (careScore <= -25) return "Umbral";
  return "Neutral";
}

/** Apply a Garden Critter / Data Shard / Data-Fruit nudge. */
export function applyGardenItem(
  g: GardenStats,
  item: Partial<GardenStats>,
): GardenStats {
  return {
    dive: clamp(g.dive + (item.dive ?? 0), 0, 99),
    glide: clamp(g.glide + (item.glide ?? 0), 0, 99),
    sprint: clamp(g.sprint + (item.sprint ?? 0), 0, 99),
    might: clamp(g.might + (item.might ?? 0), 0, 99),
    endurance: clamp(g.endurance + (item.endurance ?? 0), 0, 99),
  };
}

/** Garden battle bonus, capped at +9%. */
export function gardenBattleBonus(g: GardenStats): number {
  const total = g.dive + g.glide + g.sprint + g.might + g.endurance;
  return Math.min(GARDEN_BONUS_CAP, total / 495 * GARDEN_BONUS_CAP);
}

/** Garden Form I / II from total Garden stats. Not a species change. */
export function gardenForm(g: GardenStats): "Base" | "Garden Form I" | "Garden Form II" {
  const total = g.dive + g.glide + g.sprint + g.might + g.endurance;
  if (total >= 300) return "Garden Form II";
  if (total >= 150) return "Garden Form I";
  return "Base";
}

/** Dominant Garden stat, for type-variant and drift display. */
export function dominantStat(g: GardenStats): keyof GardenStats {
  const entries = Object.entries(g) as [keyof GardenStats, number][];
  return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

/**
 * Colorway: deterministic palette id from species + stats + alignment.
 * Same species can look different in different gardens. Never changes type.
 */
export function colorwayFor(c: GardenCreature): string {
  const alignment = alignmentFromCare(c.careScore);
  const dominant = dominantStat(c.garden);
  const variant = c.colorwaySeed % 4 === 0 ? "rare" : "standard";
  return `${c.speciesId}-${alignment.toLowerCase()}-${dominant}-${variant}`;
}

/**
 * Type variant: one secondary element shift, only when one stat clearly
 * dominates (at least 20 points ahead of the second). Otherwise none.
 * Kept as a display/bonus tag, not a species or primary-type change.
 */
export function typeVariant(g: GardenStats): string | null {
  const sorted = (Object.entries(g) as [keyof GardenStats, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  if (sorted[0][1] - sorted[1][1] < 20) return null;
  const map: Record<keyof GardenStats, string> = {
    dive: "Aqua",
    glide: "Aero",
    sprint: "Strike",
    might: "Chrome",
    endurance: "Earth",
  };
  return map[sorted[0][0]];
}

/** Ring Capture: loops add score, breaks subtract, bond helps. */
export function ringCaptureChance(
  loops: number,
  breaks: number,
  bond: number,
  catchRateShape: number, // 3-255, from decomp catch_rate shape
): number {
  const base = loops * 10 - breaks * 15 + bond * 0.3;
  const rate = clamp(catchRateShape, 3, 255) / 255;
  return clamp(base * rate / 100, 0, 0.95);
}

/** Mochi Link trade validation. Returns error strings, empty = valid. */
export function mochiLinkValidate(
  aSpeciesId: string,
  bSpeciesId: string,
  receiverRosterIds: string[],
  offeredId: string,
): string[] {
  const errors: string[] = [];
  if (!aSpeciesId || !bSpeciesId) errors.push("Both sides must offer a creature.");
  if (receiverRosterIds.includes(offeredId)) {
    errors.push("Receiver already owns that creature ID.");
  }
  return errors;
}

/** Branch Evolution candidate scoring (Digimon-style, Mochiichao names). */
export interface EvolutionCandidate {
  targetSpeciesId: string;
  minBond: number;
  minStat?: keyof GardenStats;
  minStatValue?: number;
  maxCareMistakes?: number;
}

export function branchEvolution(
  c: GardenCreature,
  candidates: EvolutionCandidate[],
): EvolutionCandidate | null {
  const valid = candidates.filter((cand) => {
    if (c.bond < cand.minBond) return false;
    if (cand.minStat && cand.minStatValue !== undefined) {
      if (c.garden[cand.minStat] < cand.minStatValue) return false;
    }
    if (cand.maxCareMistakes !== undefined) {
      if (c.careMistakes > cand.maxCareMistakes) return false;
    }
    return true;
  });
  if (valid.length === 0) return null;
  // Highest bond requirement wins; ties are shown to the player upstream.
  return valid.sort((a, b) => b.minBond - a.minBond)[0];
}

/** Data Revert: revert one stage, keep 50% of Garden stats + colorway/parts. */
export function dataRevert(c: GardenCreature): GardenCreature {
  const halved: GardenStats = {
    dive: Math.floor(c.garden.dive / 2),
    glide: Math.floor(c.garden.glide / 2),
    sprint: Math.floor(c.garden.sprint / 2),
    might: Math.floor(c.garden.might / 2),
    endurance: Math.floor(c.garden.endurance / 2),
  };
  return { ...c, garden: halved };
}
