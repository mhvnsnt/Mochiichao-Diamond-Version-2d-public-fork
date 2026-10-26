/**
 * True-Elements type chart — GENERATED from src/lib/constants.ts on main
 * (the 18-type legacy chart BattleView already uses), by the mapping in
 * docs/unification-map.md §3. This file is a DERIVATION, not canon data:
 *
 * Legacy -> True mapping used (unification-map §3, proposed where noted):
 *   WATER->Water, FIRE->Flame, GRASS->Earth (candidate), GROUND->Earth,
 *   ROCK->Core (candidate), STEEL->Chrome, DARK->Umbral, GHOST->Umbral,
 *   PSYCHIC->Mythic (candidate), DRAGON->Mythic (candidate),
 *   FIGHTING->Strike, NORMAL->Normal, BUG->Bug.
 *   NOT mapped (no unification-map proposal — do not invent one):
 *   ELECTRIC, ICE, POISON, FLYING, FAIRY. True elements with no legacy
 *   source: Aero, Deep — every cell involving them is x1.0 and OWED.
 *
 * Derivation rule per True-vs-True cell: collect every legacy pair that
 * maps to it. If all agree, that value ships (DERIVED_CELLS). If they
 * disagree, the cell ships x1.0 and is listed in CONFLICT_CELLS — the
 * disagreement is a Mars decision, not averaged away. If either side has
 * no legacy source, the cell ships x1.0 and is listed in OWED_CELLS.
 * Example of a real loss in merging: Umbral vs Normal is 0 (GHOST) and
 * 1 (DARK) in legacy, so it ships neutral here — GHOST immunity does NOT
 * survive the merge until Mars rules on Umbral.
 *
 * Coverage: 144 cells total. 76/144 = 53% sourced (27 non-neutral +
 * 49 agreed-neutral), 24/144 = 17% conflict-neutral, 44/144 = 31% owed
 * (all Aero/Deep cells). The resolver flags any move whose type is absent
 * from this chart; a cell present at x1.0 for conflict/owed reasons is
 * NOT flagged at runtime — read CONFLICT_CELLS / OWED_CELLS instead.
 *
 * This chart is NOT wired into BattleView (which still uses constants.ts
 * calcTypeMultiplier). A wiring PR must pick ONE chart — this one or the
 * legacy one — for live battles; shipping both without a choice would
 * make two different battles from the same move.
 */
import type { TypeChart } from "./battleResolver";

export const TRUE_ELEMENTS: string[] = [
  "Water", "Chrome", "Earth", "Bug", "Umbral", "Aero",
  "Core", "Strike", "Deep", "Flame", "Mythic", "Normal",
];

export const LEGACY_TO_TRUE_ELEMENT: Record<string, string> = {
  WATER: "Water", FIRE: "Flame", GRASS: "Earth", GROUND: "Earth",
  ROCK: "Core", STEEL: "Chrome", DARK: "Umbral", GHOST: "Umbral",
  PSYCHIC: "Mythic", DRAGON: "Mythic", FIGHTING: "Strike",
  NORMAL: "Normal", BUG: "Bug",
};

export const TRUE_TYPE_CHART: TypeChart = {
  Water: { Water: 0.5, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 2, Mythic: 1, Normal: 1 },
  Chrome: { Water: 0.5, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Earth: { Water: 1, Chrome: 1, Earth: 1, Bug: 0.5, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Bug: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 0.5, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Umbral: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Aero: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Core: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 2, Umbral: 1, Aero: 1, Core: 1, Strike: 0.5, Deep: 1, Flame: 2, Mythic: 1, Normal: 1 },
  Strike: { Water: 1, Chrome: 2, Earth: 1, Bug: 0.5, Umbral: 1, Aero: 1, Core: 2, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 2 },
  Deep: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Flame: { Water: 0.5, Chrome: 2, Earth: 1, Bug: 2, Umbral: 1, Aero: 1, Core: 0.5, Strike: 1, Deep: 1, Flame: 0.5, Mythic: 1, Normal: 1 },
  Mythic: { Water: 1, Chrome: 1, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 1, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
  Normal: { Water: 1, Chrome: 0.5, Earth: 1, Bug: 1, Umbral: 1, Aero: 1, Core: 0.5, Strike: 1, Deep: 1, Flame: 1, Mythic: 1, Normal: 1 },
};

export const CHART_COVERAGE = {
  totalCells: 144,
  sourcedCells: 76,
  nonNeutralSourcedCells: 27,
  agreedNeutralCells: 49,
  conflictCells: 24,
  owedCells: 44,
} as const;

export const CONFLICT_CELLS: string[] = [
  "Water vs Earth (sources [0.5, 2]) -> neutral, flagged",
  "Water vs Mythic (sources [0.5, 1]) -> neutral, flagged",
  "Earth vs Water (sources [1, 2]) -> neutral, flagged",
  "Earth vs Chrome (sources [0.5, 2]) -> neutral, flagged",
  "Earth vs Earth (sources [0.5, 1, 2]) -> neutral, flagged",
  "Earth vs Flame (sources [0.5, 2]) -> neutral, flagged",
  "Earth vs Mythic (sources [0.5, 1]) -> neutral, flagged",
  "Bug vs Earth (sources [1, 2]) -> neutral, flagged",
  "Bug vs Umbral (sources [0.5, 2]) -> neutral, flagged",
  "Bug vs Mythic (sources [1, 2]) -> neutral, flagged",
  "Umbral vs Umbral (sources [0.5, 2]) -> neutral, flagged",
  "Umbral vs Strike (sources [0.5, 1]) -> neutral, flagged",
  "Umbral vs Mythic (sources [1, 2]) -> neutral, flagged",
  "Umbral vs Normal (sources [0, 1]) -> neutral, flagged",
  "Core vs Earth (sources [0.5, 1]) -> neutral, flagged",
  "Strike vs Umbral (sources [0, 2]) -> neutral, flagged",
  "Strike vs Mythic (sources [0.5, 1]) -> neutral, flagged",
  "Flame vs Earth (sources [1, 2]) -> neutral, flagged",
  "Flame vs Mythic (sources [0.5, 1]) -> neutral, flagged",
  "Mythic vs Chrome (sources [0.5, 1]) -> neutral, flagged",
  "Mythic vs Umbral (sources [0, 1]) -> neutral, flagged",
  "Mythic vs Strike (sources [1, 2]) -> neutral, flagged",
  "Mythic vs Mythic (sources [0.5, 1, 2]) -> neutral, flagged",
  "Normal vs Umbral (sources [0, 1]) -> neutral, flagged",
];

export const OWED_CELLS: string[] = [
  "Water vs Aero",
  "Water vs Deep",
  "Chrome vs Aero",
  "Chrome vs Deep",
  "Earth vs Aero",
  "Earth vs Deep",
  "Bug vs Aero",
  "Bug vs Deep",
  "Umbral vs Aero",
  "Umbral vs Deep",
  "Aero vs Water",
  "Aero vs Chrome",
  "Aero vs Earth",
  "Aero vs Bug",
  "Aero vs Umbral",
  "Aero vs Aero",
  "Aero vs Core",
  "Aero vs Strike",
  "Aero vs Deep",
  "Aero vs Flame",
  "Aero vs Mythic",
  "Aero vs Normal",
  "Core vs Aero",
  "Core vs Deep",
  "Strike vs Aero",
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
  "Flame vs Aero",
  "Flame vs Deep",
  "Mythic vs Aero",
  "Mythic vs Deep",
  "Normal vs Aero",
  "Normal vs Deep",
];
