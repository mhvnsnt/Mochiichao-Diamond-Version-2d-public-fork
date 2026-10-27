/**
 * STAGED ONLY — Garden / Chao system data shapes, slice 6.
 * NOT wired into the live game. NOT a commit, NOT a PR.
 * Extends (does not replace) src/lib/mochiichao-systems.ts, which already
 * has: GardenStats, GardenCreature, Alignment, GARDEN_BONUS_CAP 0.09,
 * BURST_BONUS 0.3, BURST_TURNS 3, alignmentFromCare (±25 band),
 * applyGardenItem (clamp 0-99), gardenBattleBonus, gardenForm
 * (Form I at total 150, Form II at 300), dominantStat, colorwayFor,
 * typeVariant (20-point lead), branchEvolution, dataRevert (halve).
 *
 * Source: chao-garden-conversion.md "Save fields to add (one creature)"
 * + garden-system.json in this folder. Nothing here invents:
 * - Garden breeding parent + fruit map: Mars-only, left null/empty.
 * - Cooldown table numbers: provisional in creatureCooldowns.ts (not in
 *   this work clone — see creature-mode-wiring-checklist.md), not canon.
 * - Dorowani/Gabu stats: Mars-only, not filled.
 */

/** 1-99 per conversion doc; code clamps 0-99. Discrepancy flagged in garden-system.json. */
export interface GardenStatLevel {
  level: number; // 0-99 code clamp; 1-99 doc range
  points: number; // 10 boxes per level (conversion doc)
  grade: "E" | "D" | "C" | "B" | "A" | "S";
}

export interface GardenStatsFull {
  dive: GardenStatLevel;
  glide: GardenStatLevel;
  sprint: GardenStatLevel;
  might: GardenStatLevel;
  endurance: GardenStatLevel;
}

/** Chao Chaos Drives -> Data Shards. Clean stat training, no cosmetic change. */
export type DataShardId =
  | "aqua"
  | "aero"
  | "sprint"
  | "might"
  | "blue"
  | "gold-mythic"
  | "umbral";

export interface DataShard {
  id: DataShardId;
  /** Stat nudged; "all-small" | "all-plus-luck" | "random-plus-ghost-tint" for the three special shards. */
  stat: "Dive" | "Glide" | "Sprint" | "Might" | "all-small" | "all-plus-luck" | "random-plus-ghost-tint";
  /** Earned by defeating corrupted data / Hackers. */
  source: string;
}

/** Original Mochiichao helpers, NOT Sega animals. Never roster species. */
export interface GardenCritter {
  /** 4 named in conversion doc; 17 further types UNNAMED — do not invent names here. */
  id: string;
  stat: "Dive" | "Glide" | "Sprint" | "Might" | "Endurance";
  partSlot: "Head" | "Back" | "Feet" | "Tail" | "Ears";
}

export type GardenAlignment = "Bright" | "Neutral" | "Umbral";

/** Data Cocoon -> Garden Form. Form, NOT a species change. */
export interface GardenFormState {
  /** "Base" | "Garden Form I" | "Garden Form II" (code gardenForm thresholds: total 150 / 300). */
  stage: "Base" | "Garden Form I" | "Garden Form II";
  /** Slider positions from conversion doc: Dive<->Glide, Sprint<->Might, ±0.5 threshold; balanced = Normal Form. */
  sliders: { diveGlide: number; sprintMight: number };
  /** 20 Critters or 40 Shards locks a type (conversion doc). */
  typeLockedBy: "critters" | "shards" | null;
  /** Dominance: Dive > Sprint = Might > Glide (conversion doc). */
  dominantType: string | null;
  /** Palette + accessory overlay + aura on the base sprite — never a new species sprite. */
  palette: { primary: string; accent: string; shine: boolean };
  accessories: { head: string | null; back: string | null; feet: string | null; tail: string | null; ears: string | null };
  aura: string | null;
}

export interface DataRebirthState {
  rebirths: number;
  /** 1 Garden Year = 1 in-game week / ~60 min active garden time; life ≈ 5 years. */
  gardenAgeYears: number;
  /** Bond > 50 = Rebirth Egg (same name, Lv. 1, points / 10, parts/palette kept, grades kept). */
  rebirthEggPending: boolean;
  /** Bond <= 50: grey cocoon warning + Last-Chance window first. */
  lastChanceWindowOpen: boolean;
  /** If Last-Chance fails: Memorial entry in MochiDex + Legacy Egg at base stats. */
  memorialEntryId: string | null;
  legacyEggPending: boolean;
}

export interface MythicFormState {
  earned: boolean;
  /** Requirements: Rebirth >= 2x, Bond > 50, all 21 Critter types in current life, no Shards after 2nd Rebirth, alignment chosen in 3rd life. */
  requirementsMet: { rebirthsAtLeast2: boolean; bondOver50: boolean; all21Critters: boolean; noShardsAfter2ndRebirth: boolean; alignmentChosen3rdLife: boolean };
  /** Success: glowing, immortal (no death timer), cannot breed, Garden Stats locked. */
  immortal: boolean;
  canBreed: false;
  gardenStatsLocked: boolean;
  /** Unlocks Burst move in Creature Mode + permanent aura. */
  burstMoveUnlocked: boolean;
}

/**
 * Full per-creature Garden record = conversion doc "Save fields to add"
 * (gardenStats, alignment, influence, bond/happiness, careMistakes,
 * rebirths, gardenForm, palette, accessories, personality, favouriteFruit,
 * gardenAge, mythic) + the code record in mochiichao-systems.ts.
 * GardenView's current records are LOCAL PLACEHOLDER records, not saved —
 * persistence of this shape to saveSystem is NEED TO MAKE.
 */
export interface GardenCreatureFull {
  speciesId: string; // roster 001-046 or 331; 147/148 reserved, stats owed
  garden: GardenStatsFull;
  alignment: GardenAlignment;
  /** -100 (Umbral care) to +100 (Bright care); code band ±25. */
  alignmentScore: number;
  influence: { diveGlide: number; sprintMight: number };
  bond: number; // 0-100 (bond/happiness)
  careMistakes: number;
  trainingSessions: number;
  colorwaySeed: number;
  parts: string[];
  gardenForm: GardenFormState;
  personality: { kind: number; bold: number; curious: number };
  /** MARS-ONLY: favourite Data-Fruit per creature is part of the blocked parent+fruit map — null until Mars rules. */
  favouriteFruit: string | null;
  gardenAge: number;
  rebirth: DataRebirthState;
  mythic: MythicFormState;
}

/** One garden: 8 creatures, overflow to MochiiPlex storage. */
export interface MainframeGarden {
  name: "Sector 0 Plaza" | "Aeon Spire Garden" | "Deep Sector Garden";
  alignment: GardenAlignment;
  creatureIds: string[]; // max 8; overflow -> "MochiiPlex storage"
  /** 3 trees per garden. */
  trees: DataFruitTree[];
  /** Visit shifts alignment slightly toward the garden — amount NOT set, NOT invented. */
  visitAlignmentShift: number | null;
}

export interface DataFruitTree {
  slot: 1 | 2 | 3;
  state: "empty" | "growing" | "ready";
  /** Regrow 1 in-game day (or ~7 min active time). */
  plantedSeed: string | null;
}

/** Market: rotating stock, tiers by Dojo Badges + quest emblems. Never sells roster species. */
export interface GardenMarketListing {
  kind: "palette-variant-egg" | "data-fruit-seed" | "hat" | "accessory" | "heart-berry" | "strong-nut";
  /** Palette eggs only for species already in MochiDex. */
  speciesId: string | null;
  /** Prices NOT set — do not invent (same class of blocker as capsule prices). */
  priceCR: number | null;
}

/** Races: MochiiPlex Circuit. Auto-run with cheering/boost timing. */
export interface GardenRace {
  course: "Dive" | "Glide" | "Sprint" | "Might" | "Grand Circuit";
  /** Endurance = pauses/sleep. Medals unlock toys, market tiers, training points. */
  medal: "none" | "bronze" | "silver" | "gold";
}

/** Dojo Sparring: auto-battler. Rewards training points + titles, NOT XP. Never replaces Trainer/Creature battles. */
export interface DojoSparring {
  statMap: { endurance: "HP"; might: "damage"; sprint: "ring-out speed"; diveGlide: "dodge" };
  reward: { trainingPoints: number; title: string | null; xp: 0 };
}

/** Mochiko Academy: Aeon Clinic + Classroom lessons (Dance/Song/Sketch/Rhythm). */
export interface AcademyRecord {
  clinic: { stats: boolean; grades: boolean; personality: boolean; favouriteFruit: boolean; age: boolean; rebirths: boolean; raceRecords: boolean; sparRecords: boolean; sicknessCured: boolean };
  lessonsUnlocked: ("Dance" | "Song" | "Sketch" | "Rhythm")[];
  /** Lessons unlock Garden idle animations + Bond, NOT battle power. */
  lessonEffect: "idle-animation" | "bond";
}
