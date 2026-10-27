/**
 * Monster-tamer systems, translated to Mochiichao canon — ORIGINAL
 * Mochiichao code, no commercial game files, art, music, code,
 * sprites, monsters, stories, or characters from Pocket Mortys,
 * Cassette Beasts, Calamon, LumenTale, Wildkeepers Rising, Elestrals
 * Awakened, or Palworld, and no modded/third-party APK of any kind.
 * Tuxemon (GPL-3.0) contributed structure only (JSON data, tile
 * maps, scriptable dialog) — no Tuxemon code, monsters, sprites, or
 * story is copied or vendored here.
 *
 * Spec: goals/mochiichao-fresh-start-repo/files/
 * monster-tamer-pulls-canon-v1.md
 *
 * Audit-plan coding PR (Mars approved the plan): the three values
 * below were NO SOURCE — no Pokemon-decomp, open-source, or
 * research source gives them — so they are NOT kept as canon:
 * - FUSION_BONUS = 0: the +10% bonus is REMOVED from the playable
 *   path. fuseStats now returns a plain average only, with no
 *   bonus. Mars must give a fusion bonus if he wants one; do not
 *   restore 0.10 and call it canon.
 * - DATA_CARD_COST = 300 CR: PLACEHOLDER price, labelled as such
 *   in the Shop (see ShopView). Mars must set the CR economy;
 *   do not call 300 canon and do not invent an exchange rate.
 * - Memory Quest rewards = bond +0 / Garden stat +0: the +10/+5
 *   rewards are REMOVED (no stat effect) until Mars gives
 *   numbers. Quests still complete as flags (see GardenView).
 * Fusion/variant forms use existing sheets + silhouette placeholders
 * until the Sprite Art lane makes a sheet — no new likenesses.
 */

export const TRUE_ELEMENTS = [
  "Water", "Chrome", "Earth", "Bug", "Umbral", "Aero",
  "Core", "Strike", "Deep", "Flame", "Mythic", "Normal",
] as const;
export type TrueElement = (typeof TRUE_ELEMENTS)[number];

/** Mainframe sectors already in the game's maps (no new locations). */
export const MAINFRAME_SECTORS = [
  "Sector 0 — Boot Harbor",
  "The Dark Forest",
  "Cave of Echoes",
  "Neon City",
  "Scrap Junkyard",
  "Mauveville Arena — The Gauntlet",
  "Castagnoli Island",
  "Luigi's Mansion",
] as const;

export type BattleStats = {
  atk: number; def: number; spa: number; spd: number; spe: number;
};

/** Audit-plan: fusion bonus placeholder, NOT Mars canon. 0 = no
 *  bonus effect. Mars must give a bonus number to restore one. */
export const FUSION_BONUS = 0;

/** Data Fusion: average the two creatures' battle stats, NO bonus
 *  (FUSION_BONUS = 0, audit-plan removal of the invented +10%). */
export function fuseStats(a: BattleStats, b: BattleStats): BattleStats {
  const avg = (x: number, y: number) =>
    Math.floor(((x + y) / 2) * (1 + FUSION_BONUS));
  return {
    atk: avg(a.atk, b.atk), def: avg(a.def, b.def),
    spa: avg(a.spa, b.spa), spd: avg(a.spd, b.spd),
    spe: avg(a.spe, b.spe),
  };
}

/** Fusion display name: Mochiichao names only, no source-game names. */
export function fusionName(aName: string, bName: string): string {
  return `${aName} + ${bName} Fusion`;
}

/** Mainframe Variant: same species ID, a sector + a True Element tag.
 *  Display/bonus tag only — it does NOT change the species, its
 *  battle types, or its stats, because no True-Element-to-code-type
 *  mapping has been approved. Changing battle types on a guess would
 *  invent a mapping the spec does not define. */
export interface MainframeVariant {
  speciesId: string;
  sector: string;
  trueElement: TrueElement;
}

export function variantLabel(v: MainframeVariant): string {
  return `${v.trueElement} variant — ${v.sector}`;
}

export function isTrueElement(v: string): v is TrueElement {
  return (TRUE_ELEMENTS as readonly string[]).includes(v);
}

/** Data Cards: Shop price in CR — PLACEHOLDER, NOT Mars canon
 *  (audit-plan NO SOURCE; Mars must set the CR economy). */
export const DATA_CARD_COST = 300;
export const DATA_CARD_ID = "data_card";

/** Bonding / Memory Quests: quest givers are existing Mochiichao NPCs. */
export interface MemoryQuest {
  id: string;
  giver: "Prof. Aeon" | "Mochiko" | "Hex";
  title: string;
  text: string;
  bondReward: number;
  gardenStat: "dive" | "glide" | "sprint" | "might" | "endurance";
  gardenReward: number;
}

export const MEMORY_QUESTS: MemoryQuest[] = [
  {
    id: "aeon-first-memory", giver: "Prof. Aeon",
    title: "Aeon's First Memory",
    text: "Prof. Aeon asks you to recover a lost Mainframe memory. Befriending — not capture — raises Garden Stats.",
    bondReward: 0, gardenStat: "endurance", gardenReward: 0,
  },
  {
    id: "mochiko-lost-lesson", giver: "Mochiko",
    title: "Mochiko's Lost Lesson",
    text: "Mochiko's academy lesson data is scattered in the Mainframe Region. Recover it through Garden Bonding.",
    bondReward: 0, gardenStat: "glide", gardenReward: 0,
  },
  {
    id: "hex-rival-memory", giver: "Hex",
    title: "Hex's Rival Memory",
    text: "Hex challenges you to remember a rivalry spar. Bonding here is a quest reward, never a capture replacement.",
    bondReward: 0, gardenStat: "might", gardenReward: 0,
  },
];

/** Guardian Training: a creature assigned to defend a Garden. */
export interface GuardianAssignment {
  creatureId: string;
  nickname: string;
  garden: string;
}

export function guardianLabel(g: GuardianAssignment): string {
  return `${g.nickname} — Guardian of ${g.garden}`;
}
