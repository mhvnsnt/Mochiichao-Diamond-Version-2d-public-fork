/**
 * True type chart — STAGED ONLY, imported nowhere, no PR, no game-tree edit.
 * Generated from true-chart.json in this directory (same generator run).
 * Elements: the 12 locked True elements on main (docs/unification-map.md section 1
 * and src/lib/battleTypeChart.ts on main). This is NOT a 19-element table: see
 * wire-plan.md section 1 for why a 19-count cannot be built as a True chart
 * without inventing element names, and 19-reconciliation.json for the
 * 18-legacy-plus-Deep arithmetic (361 cells) kept separate from this chart.
 *
 * Value rule: a cell ships its sourced value only when every legacy pair that
 * maps to it agrees. Disagreement -> 1.0 in CONFLICT_CELLS (prior-lane rule,
 * retained, never averaged). Any cell involving Deep -> 1.0 in
 * NO_EQUIVALENT_CELLS: Deep has no source type in any game or modding doc on
 * disk. Aero cells are analogue-filled via the Flying mapping (proposed, not
 * locked) and are listed in ANALOGUE_CELLS so a wiring PR can revisit them.
 * Lookup never crashes: unknown attacker/defender -> { multiplier: 1, flagged: true }.
 */
export const TRUE_ELEMENTS = ["Water", "Chrome", "Earth", "Bug", "Umbral", "Aero", "Core", "Strike", "Deep", "Flame", "Mythic", "Normal"] as const;
export type TrueElement = typeof TRUE_ELEMENTS[number];

export const TRUE_TYPE_CHART: Record<TrueElement, Record<TrueElement, number>> = {
  Water: { Water: 0.5, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 2, Mythic: 1, Normal: 1 },
  Chrome: { Water: 0.5, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Earth: { Water: 1, Chrome: 1, Earth: 1, Bug: 0.5, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Bug: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 0.5, Core: 1, Strike: 0.5, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Umbral: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Aero: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 2, Umbral: 1, Aero: 1, Core: 0.5, Strike: 2, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Core: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 2, Umbral: 1, Aero: 2, Core: 1, Strike: 0.5, Deep: 1, Flame: 2, Mythic: 1, Normal: 1 },
  Strike: { Water: 1, Chrome: 2, Earth: 1, Bug: 0.5, Umbral: 1, Aero: 0.5, Core: 2, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 2 },
  Deep: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Flame: { Water: 0.5, Chrome: 2, Earth: 1, Bug: 2, Umbral: 1, Aero: 1, Core: 0.5, Strike: 1, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Mythic: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Normal: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 0.5, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
};

export const CONFLICT_CELLS: string[] = [
  "Water vs Earth",
  "Water vs Mythic",
  "Earth vs Water",
  "Earth vs Chrome",
  "Earth vs Earth",
  "Earth vs Aero",
  "Earth vs Flame",
  "Earth vs Mythic",
  "Bug vs Earth",
  "Bug vs Umbral",
  "Bug vs Mythic",
  "Umbral vs Umbral",
  "Umbral vs Strike",
  "Umbral vs Mythic",
  "Umbral vs Normal",
  "Aero vs Earth",
  "Core vs Earth",
  "Strike vs Umbral",
  "Strike vs Mythic",
  "Flame vs Earth",
  "Flame vs Mythic",
  "Mythic vs Umbral",
  "Mythic vs Strike",
  "Mythic vs Mythic",
  "Normal vs Umbral",
];

export const NO_EQUIVALENT_CELLS: string[] = [
  "Water vs Deep",
  "Chrome vs Deep",
  "Earth vs Deep",
  "Bug vs Deep",
  "Umbral vs Deep",
  "Aero vs Deep",
  "Core vs Deep",
  "Strike vs Deep",
  "Deep vs Water",
  "Deep vs Chrome",
  "Deep vs Earth",
  "Deep vs Bug",
  "Deep vs Umbral",
  "Deep vs Aero",
  "Deep vs Core",
  "Deep vs Strike",
  "Deep vs Deep",
  "Deep vs Flame",
  "Deep vs Mythic",
  "Deep vs Normal",
  "Flame vs Deep",
  "Mythic vs Deep",
  "Normal vs Deep",
];

export const ANALOGUE_CELLS: string[] = [
  "Water vs Aero",
  "Chrome vs Aero",
  "Bug vs Aero",
  "Umbral vs Aero",
  "Aero vs Water",
  "Aero vs Chrome",
  "Aero vs Bug",
  "Aero vs Umbral",
  "Aero vs Aero",
  "Aero vs Core",
  "Aero vs Strike",
  "Aero vs Flame",
  "Aero vs Mythic",
  "Aero vs Normal",
  "Core vs Aero",
  "Strike vs Aero",
  "Flame vs Aero",
  "Mythic vs Aero",
  "Normal vs Aero",
];

export const CHART_COVERAGE = {
  totalCells: 144,
  sourcedCells: 77,
  nonNeutralSourcedCells: 28,
  agreedNeutralCells: 49,
  analogueFilledCells: 19,
  conflictCells: 25,
  noEquivalentCells: 23,
} as const;

export function trueTypeMultiplier(
  atk: string, def1: string, def2?: string,
): { multiplier: number; flagged: boolean; status: string } {
  const row = (TRUE_TYPE_CHART as Record<string, Record<string, number>>)[atk];
  if (!row) return { multiplier: 1, flagged: true, status: 'unknown-attacker' };
  const defs = def2 && def2 !== def1 ? [def1, def2] : [def1];
  let m = 1; let flagged = false;
  for (const d of defs) {
    const v = row[d];
    if (v === undefined) { flagged = true; continue; }
    if (CONFLICT_CELLS.includes(`${atk} vs ${d}`)) flagged = true;
    if (NO_EQUIVALENT_CELLS.includes(`${atk} vs ${d}`)) flagged = true;
    if (ANALOGUE_CELLS.includes(`${atk} vs ${d}`)) flagged = true;
    m *= v;
  }
  return { multiplier: m, flagged, status: flagged ? 'flagged-cell' : 'sourced' };
}

/** Legacy (18-type) move/defender word -> True element. Unmapped words return
 * undefined on purpose: ELECTRIC, ICE, POISON, FAIRY have no True target in the
 * locked 12, so the wire plan keeps the legacy calculation for those moves
 * instead of inventing a mapping. Aero via FLYING is analogue (see above). */
export const LEGACY_TO_TRUE_ELEMENT: Record<string, TrueElement> = {
  WATER: "Water",
  FIRE: "Flame",
  GRASS: "Earth",
  GROUND: "Earth",
  ROCK: "Core",
  STEEL: "Chrome",
  DARK: "Umbral",
  GHOST: "Umbral",
  PSYCHIC: "Mythic",
  DRAGON: "Mythic",
  FIGHTING: "Strike",
  NORMAL: "Normal",
  BUG: "Bug",
  FLYING: "Aero",
};
