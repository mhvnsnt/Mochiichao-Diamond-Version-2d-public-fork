// Staged playable wiring — NOT imported by any game file yet.
// Source-faithful structures, orders, and values from the
// all-sources mappings (battle, menus, overworld, data) and the
// Black 2 batches A-H. No species names, no character names,
// no literal dialogue, no images, no logos, no creature voices.
// Generic terms only: creature, capture device, storage, index.
// Every value below is a source value from the mappings; where
// a value needs a Mars decision it is a parameter or a flagged
// stub, never an invented constant. See wiring-playable-map.md.

export type Stage = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ---------------------------------------------------------------- B. Battle
// Stat-stage ratios, -6..+6 (numerator / denominator).
export const STAT_STAGE_RATIOS: ReadonlyArray<readonly [number, number]> = [
  [10, 40], [10, 35], [10, 30], [10, 25], [10, 20], [10, 15], [10, 10],
  [15, 10], [20, 10], [25, 10], [30, 10], [35, 10], [40, 10],
];
export function applyStatStage(base: number, stage: Stage): number {
  const [num, den] = STAT_STAGE_RATIOS[stage + 6];
  return Math.floor((base * num) / den);
}
// Accuracy-stage ratios, -6..+6, as hundredths (33 = 33/100).
export const ACCURACY_STAGE_RATIOS: ReadonlyArray<number> = [
  33, 36, 43, 50, 60, 75, 100, 133, 166, 200, 233, 266, 300,
];
export function applyAccuracyStage(accuracy: number, stage: Stage): number {
  return Math.floor((accuracy * ACCURACY_STAGE_RATIOS[stage + 6]) / 100);
}
// Crit-stage denominators, stage 0..4 (chance = 1 / denominator), x2 damage.
export const CRIT_STAGE_DENOMINATORS: ReadonlyArray<number> = [16, 8, 4, 3, 2];
export function critChance(stage: number): number {
  return 1 / CRIT_STAGE_DENOMINATORS[Math.max(0, Math.min(4, stage))];
}
// Damage core order (chart multiplier is a parameter: the True
// chart values, including Deep rows, are Mars-owed — see map DS10).
export function baseDamage(level: number, power: number, attack: number, defense: number): number {
  return Math.floor(Math.floor(Math.floor(((2 * level) / 5 + 2) * power * attack / defense) / 50)) + 2;
}
export function adjustDamage(
  base: number,
  opts: { crit: boolean; stab: boolean; typeMultiplier: number; burnHalvesPhysical: boolean; screenHalves: boolean; spreadHalves: boolean },
): number {
  let dmg = base;
  if (opts.crit) dmg *= 2;
  if (opts.stab) dmg = Math.floor(dmg * 1.5);
  dmg = Math.floor((dmg * opts.typeMultiplier) / 10);
  if (opts.burnHalvesPhysical) dmg = Math.floor(dmg / 2);
  if (opts.screenHalves) dmg = Math.floor(dmg / 2);
  if (opts.spreadHalves) dmg = Math.floor(dmg / 2);
  return dmg === 0 ? 0 : Math.max(1, dmg);
}
// Random damage roll: 100 - (rand % 16), i.e. 85..100 inclusive.
export function randomDamageRoll(rand16: number): number {
  return 100 - (rand16 % 16);
}
// Turn order: run-first alone; switch/item before all moves;
// moves bubble-sorted by priority, then speed, random tie.
export type BattleAction = { kind: "run" | "switch" | "item" | "move"; priority: number; speed: number; tie: number };
export function sortBattleActions(actions: BattleAction[]): BattleAction[] {
  const rank = (a: BattleAction): number => (a.kind === "run" ? 0 : a.kind === "switch" || a.kind === "item" ? 1 : 2);
  return [...actions].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.speed !== b.speed) return b.speed - a.speed;
    return a.tie - b.tie;
  });
}
// End-turn tracker order (source order, names genericised).
export const END_TURN_ORDER: ReadonlyArray<string> = [
  "field-effects", "ingrain-heal", "end-turn-abilities", "held-items-pass-1",
  "held-items-pass-2", "leech-drain", "poison", "toxic", "burn", "nightmare",
  "curse", "wrap", "wish", "future-sight", "perish-song", "weather", "terrain-trackers",
];
// Primary status end-turn fractions (per max HP).
export const STATUS_END_TURN_FRACTIONS: Readonly<Record<string, string>> = {
  poison: "1/8", toxic: "1/16 x counter (counter increments, capped)", burn: "1/8",
  nightmare: "1/4", curse: "1/4", wrap: "1/16", leech: "1/8", ingrainHeal: "1/16",
};
// Volatile statuses, in move-script + end-turn order.
export const VOLATILE_STATUSES: ReadonlyArray<string> = [
  "confusion", "flinch", "substitute", "protect", "endure", "nightmare", "curse",
  "wrap", "leech", "ingrain", "uproar", "recharge", "multi-turn-lock",
];
// Multi-hit distribution (source): 35 / 35 / 15 / 15 over 2..5 hits.
export const MULTI_HIT_DISTRIBUTION: ReadonlyArray<readonly [number, number]> = [
  [2, 35], [3, 35], [4, 15], [5, 15],
];
export function multiHitCount(roll100: number): number {
  if (roll100 < 35) return 2;
  if (roll100 < 70) return 3;
  if (roll100 < 85) return 4;
  return 5;
}
// Weather / screen layer in damage order.
export const WEATHER_DAMAGE: Readonly<Record<string, Record<string, number>>> = {
  rain: { fire: 0.5, water: 1.5 },
  sun: { fire: 1.5, water: 0.5 },
};
export const SCREEN_DIVISOR = 2; // 3 in doubles with 2 defenders alive (2/3 instead of 1/2).
// Healthbox: bar follows box at +16 / +8 x-offsets.
export const HEALTHBOX_BAR_OFFSETS: Readonly<readonly [number, number]> = [16, 8];
// Opponent-direction vectors (240x160, y down). Opponent attacks
// travel left + down, never right. Angle = atan2(dy, dx) per pair.
export type Anchor = { x: number; y: number };
export const OPPONENT_VECTORS: Readonly<Record<string, { attacker: Anchor; target: Anchor; vector: Anchor }>> = {
  singleOpponentToPlayer: { attacker: { x: 176, y: 40 }, target: { x: 72, y: 80 }, vector: { x: -104, y: 40 } },
  singlePlayerToOpponent: { attacker: { x: 72, y: 80 }, target: { x: 176, y: 40 }, vector: { x: 104, y: -40 } },
  doublesOpponentLeftToPlayerLeft: { attacker: { x: 200, y: 40 }, target: { x: 32, y: 80 }, vector: { x: -168, y: 40 } },
  doublesOpponentRightToPlayerRight: { attacker: { x: 152, y: 32 }, target: { x: 90, y: 88 }, vector: { x: -62, y: 56 } },
  doublesPlayerLeftToOpponentLeft: { attacker: { x: 32, y: 80 }, target: { x: 200, y: 40 }, vector: { x: 168, y: -40 } },
};
export function opponentAngle(key: keyof typeof OPPONENT_VECTORS): number {
  const v = OPPONENT_VECTORS[key].vector;
  return Math.atan2(v.y, v.x);
}
export const SHADOW_OFFSET_Y = 29; // shadow sits at target X, target Y + 29.
// Opponent archetype code mechanisms (rig points are NOT code
// values — see map B25; this table carries mechanisms only).
export const OPPONENT_ARCHETYPES: ReadonlyArray<{ id: string; mechanism: string; opponentRule: string }> = [
  { id: "contact-lunge", mechanism: "attacker sprite moves to target anchor", opponentRule: "lunge left + down to the player anchor, then return; never slide right" },
  { id: "projectile", mechanism: "effect spawns at attacker, travels to target", opponentRule: "starts top-right, travels left + down to the player anchor" },
  { id: "beam-line", mechanism: "endpoints are attacker + target anchors", opponentRule: "runs top-right -> bottom-left; direction reverses versus the player beam" },
  { id: "target-burst", mechanism: "effect placed by target sprite edges", opponentRule: "burst sits on the player-side creature (bottom-left)" },
  { id: "attacker-self", mechanism: "effect spawns at attacker only", opponentRule: "sits on the top-right creature; does not travel" },
  { id: "ground-shadow", mechanism: "effect at target X, target Y + 29", opponentRule: "sits under the player-side creature for opponent attacks" },
  { id: "spread-multi", mechanism: "same effect evaluated per target battler, damage halved in doubles when 2 defenders alive", opponentRule: "each target gets its own attacker -> target vector" },
  { id: "target-indicator", mechanism: "bounce on the target healthbox; confirm / back keys", opponentRule: "player targeting bounces the player-side healthbox; reverse for opponent AI targeting" },
];
// Battle window / screen order (dedicated full screens, no overlays).
export const BATTLE_SCREEN_ORDER: ReadonlyArray<string> = [
  "action-prompt", "action-menu", "move-menu", "target-select", "party-screen", "bag-screen", "message-window",
];
export const BATTLE_OUTCOMES: ReadonlyArray<string> = [
  "continue", "won", "lost", "drew", "ran", "player-teleported", "creature-fled", "caught", "out-of-capture-devices",
];

// ---------------------------------------------------------------- M. Menus / bag / shop / storage / save
export const FIELD_MENU_ROWS: ReadonlyArray<{ id: string; context: string }> = [
  { id: "index", context: "shown only once the index exists" },
  { id: "party", context: "always" },
  { id: "bag", context: "always" },
  { id: "player-card", context: "always" },
  { id: "save", context: "always" },
  { id: "options", context: "always" },
  { id: "exit", context: "always" },
  { id: "retire", context: "special-zone only" },
  { id: "link-player", context: "link only — BLOCKED (map A9, link decision owed)" },
];
export const MAIN_MENU_WINDOWS: ReadonlyArray<string> = ["new-game", "continue", "gift-if-exists", "error", "continue-summary"];
export const OPTIONS_ROWS: ReadonlyArray<{ id: string; valueCount: number }> = [
  { id: "text-speed", valueCount: 3 },
  { id: "battle-scene", valueCount: 2 },
  { id: "battle-style", valueCount: 2 },
  { id: "sound", valueCount: 2 },
  { id: "button-mode", valueCount: 3 },
  { id: "frame-type", valueCount: 10 }, // BLOCKED: frame art owed (map C6)
  { id: "cancel", valueCount: 0 },
];
export type BagPocketTable = { pockets: ReadonlyArray<{ name: string; slots: number }>; totalSlots: number; stackMax: number; machineStackMax: number };
export const BAG_POCKETS_PER_GENERATION: Readonly<Record<string, BagPocketTable>> = {
  // Canonical choice among these three is BLOCKED (map D1-D3, decision 5).
  fireRed: { pockets: [{ name: "items", slots: 42 }, { name: "key-items", slots: 30 }, { name: "capture-devices", slots: 13 }, { name: "move-machines", slots: 58 }, { name: "berries", slots: 43 }], totalSlots: 186, stackMax: 999, machineStackMax: 99 },
  heartGold: { pockets: [{ name: "items", slots: 165 }, { name: "key-items", slots: 50 }, { name: "move-machines", slots: 101 }, { name: "mail", slots: 12 }, { name: "medicine", slots: 40 }, { name: "berries", slots: 64 }, { name: "capture-devices", slots: 24 }, { name: "battle-items", slots: 30 }], totalSlots: 486, stackMax: 999, machineStackMax: 99 },
  black2: { pockets: [{ name: "items", slots: 310 }, { name: "key-items", slots: 83 }, { name: "move-machines", slots: 109 }, { name: "medicine", slots: 48 }, { name: "berries", slots: 64 }], totalSlots: 614, stackMax: 999, machineStackMax: 1 },
};
export const BAG_CONTEXTS: ReadonlyArray<string> = [
  "field", "party-give", "shop-sell", "item-terminal-deposit", "box-give", "battle",
];
export const BAG_CONTEXT_ACTIONS: ReadonlyArray<string> = [
  "use", "toss", "register", "give", "cancel", "battle-use", "check", "open", "open-berries", "walk", "deselect", "dummy",
];
export type BagCursorState = { perPocket: Record<string, { cursorRow: number; scrollOffset: number }> };
export function emptyBagCursorState(pocketNames: string[]): BagCursorState {
  const perPocket: Record<string, { cursorRow: number; scrollOffset: number }> = {};
  for (const name of pocketNames) perPocket[name] = { cursorRow: 0, scrollOffset: 0 };
  return { perPocket };
}
// Shop: sell price = floor(buy price / 2) x quantity.
export function sellPrice(buyPrice: number, quantity: number): number {
  return Math.floor(buyPrice / 2) * quantity;
}
export const SHOP_FLOW: ReadonlyArray<string> = [
  "menu-buy-sell-quit", "buy-list", "how-many", "yes-no-confirm", "money-subtracted", "item-added", "transaction-recorded", "back-to-list",
];
export const SHOP_TYPES: ReadonlyArray<string> = [
  "regular", "move-machine", "decor", "decor-2", "seals", "prize-exchange", "data-card", "battle-point", "move-tutor", "badge-growing-BLOCKED",
];
export const STORAGE_MAIN_MENU: ReadonlyArray<string> = ["withdraw", "deposit", "move-creatures", "move-items", "exit"];
export const STORAGE_RULES = {
  slotsPerBox: 30,
  partyMax: 6,
  withdrawBlockedWhenPartyFull: true,
  depositBlockedWhenItWouldEmptyParty: true,
  boxNameMaxFireRed: 8,
  boxNameMaxLater: 20,
  wallpapersFireRed: 17,
};
export type BoxCursorState = { perBox: Record<string, number> };
export const TERMINAL_TOP_MENU: ReadonlyArray<string> = ["item-storage", "mailbox", "turn-off"];
export const ITEM_TERMINAL_CAP = 30;
export const SAVE_BLOCK_FIELDS = {
  block1: ["position", "warps", "party-6", "money", "coins", "registered-item", "item-terminal-items-30", "bag-pockets", "flags", "vars", "game-stats", "daycare", "mail"],
  block2: ["options", "play-time", "trainer-info", "encryption-key"],
  storageBlock: "separate from block 1/2",
  sectorDataBytes: 3968,
  sectorFooterBytes: 128,
  slots: 2,
  sectorsPerSlot: 14,
  totalSectors: 32,
};
export const SAVE_DIALOG_STEPS: ReadonlyArray<string> = ["ask", "yes-no", "saving", "saved"];
export const TRAINER_CARD_FIELDS: ReadonlyArray<string> = ["player-name", "player-id", "money", "badge-count", "play-time", "party-icons"];

// ---------------------------------------------------------------- O. Overworld
export const MOVEMENT_STATES: ReadonlyArray<string> = [
  "walk-slow", "walk-normal", "walk-fast", "walk-faster", "run", "run-slow", "bike", "surf", "water-current-glide", "ledge-jump", "grid", "no-grid",
];
export const FIELD_FLOW_ORDER: ReadonlyArray<string> = ["load-map", "fade", "overworld-loop", "warp-out", "warp-in"];
export const WARP_KINDS: ReadonlyArray<string> = ["fixed", "dynamic", "escape", "dive-hole", "heal-location"];
export function fireRedEncounterRoll(rate: number, rand1600: number, failedRolls: number): boolean {
  const effective = Math.min(1600, rate * 16 + Math.floor((failedRolls * rate * 16) / 200));
  return rand1600 < effective;
}
export const FIRE_RED_SLOT_TABLES: Readonly<Record<string, ReadonlyArray<number>>> = {
  land: [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1],
  waterRock: [60, 30, 5, 4, 1],
  fishing: [70, 30, 60, 20, 20, 40, 40, 15, 4, 1],
};
export function heartGoldEncounterRate(opts: { moving: "walking" | "cycling" | "surfing"; veryTallGrass: boolean; steps: number; audioModifier: number }): number {
  let rate = 40;
  if (opts.moving === "walking") rate -= 20;
  if (opts.veryTallGrass) rate += 40;
  if (opts.moving === "cycling") rate += 30;
  if (opts.steps >= 4) rate += 60;
  else if (opts.steps === 3) rate += 40;
  else if (opts.steps === 2) rate += 30;
  rate += opts.audioModifier;
  return Math.max(0, Math.min(100, rate));
}
export const HEART_GOLD_SLOT_TABLES: Readonly<Record<string, ReadonlyArray<number>>> = {
  land: [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1],
  surf: [60, 30, 5, 4, 1],
  fishingPerRod: [40, 30, 15, 10, 5],
  rockSmash: [80, 20],
  headbutt: [50, 15, 15, 10, 5, 5],
};
export const CRYSTAL_SLOT_TABLES: Readonly<Record<string, ReadonlyArray<number>>> = {
  grass: [30, 30, 20, 10, 5, 4, 1],
  water: [60, 30, 10],
};
export function pickSlot(cumulativePercent: ReadonlyArray<number>, roll100: number): number {
  let acc = 0;
  for (let i = 0; i < cumulativePercent.length; i++) {
    acc += cumulativePercent[i];
    if (roll100 < acc) return i;
  }
  return cumulativePercent.length - 1;
}
// Black 2 climbing rate: roll gated by steps, then random(100) <= rate, clamp 100.
export function black2ClimbingRoll(rate: number, roll100: number): boolean {
  return roll100 <= Math.min(100, rate);
}
export const BLACK2_TERRAIN_RATES: ReadonlyArray<string> = [
  "grass", "dark-grass", "shaking-grass", "surf", "rippling-surf", "fishing", "rippling-fishing",
];
export const BLACK2_SLOT_COUNTS: Readonly<Record<string, number>> = {
  grass: 12, darkGrass: 12, shakingGrass: 12, surf: 5, rareSurf: 5, fishing: 5, rareFishing: 5,
};
export const PHENOMENA_SPOTS: ReadonlyArray<string> = ["shaking-grass", "dust-cloud", "rippling-water", "flying-shadow"];
export const FIRE_RED_WEATHER_CODES: ReadonlyArray<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 21];
export const HEART_GOLD_WEATHER_CODES: ReadonlyArray<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
export const PLATINUM_WEATHER_CODES: ReadonlyArray<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 26, 27, 28, 29, 30, 1001, 1002];
export const WEATHER_PRECEDENCE_BLACK2: ReadonlyArray<string> = [
  "forced", "linked-game-forest", "event-flag", "birthday", "seasonal-calendar", "zone-default",
];
export const WEATHER_TRANSITIONS_BLACK2: ReadonlyArray<string> = ["sequential", "crossfade"];
export const FIRE_RED_WEATHER_SPRITE_COUNTS: Readonly<Record<string, number>> = {
  rain: 24, clouds: 3, horizontalFog: 20, ash: 20, sandstorm: 20, sandstormSwirl: 5,
};
export const CAMERA_DEFAULT_FIELDS_BLACK2: ReadonlyArray<string> = [
  "zoom", "pitch", "yaw", "field-of-view", "near", "far", "bind-flag", "target",
];
export const CAMERA_BOUNDARY_SHAPES: ReadonlyArray<string> = ["rect", "circle"];
export const ZONE_CAMERA_BOUND_DEFAULT = 65535;
export const DAY_PHASE_BANDS: ReadonlyArray<{ id: string; hours: [number, number] }> = [
  { id: "dawn", hours: [6, 10] }, { id: "day", hours: [10, 18] }, { id: "dusk", hours: [18, 21] }, { id: "night", hours: [21, 30] },
];
export const HEART_GOLD_RTC_PERIODS: ReadonlyArray<{ id: string; hours: [number, number] }> = [
  { id: "late", hours: [0, 3] }, { id: "morning", hours: [4, 9] }, { id: "day", hours: [10, 16] }, { id: "evening", hours: [17, 18] }, { id: "night", hours: [19, 23] },
];
export function black2Season(month1Based: number): string {
  return ["spring", "summer", "autumn", "winter"][(month1Based - 1) % 4];
}
export const FIRE_RED_MAP_TYPES: ReadonlyArray<string> = [
  "none", "town", "city-unused", "route", "underground", "underwater-unused", "ocean-route-unused", "unknown-unused", "indoor", "hidden-base-unused",
];
export const HEART_GOLD_MAP_TYPES: ReadonlyArray<string> = [
  "invalid", "city-town", "route", "cave", "interior", "centre-unused", "underground-leftover",
];

// ---------------------------------------------------------------- D. Data systems
// Instance struct shape (source pattern, all generations): static
// table indexed by ID + one instance struct; battle/menu code
// reads by ID, never copies display text into battle logic.
export type CreatureInstance = {
  rosterSlotId: string; level: number; stats: number[]; moveSlots: string[];
  ppPerSlot: number[]; heldItemId: string | null; abilitySlot: number; natureSlot: number; status: string;
};
export type MoveStruct = {
  id: string; effect: string; power: number; type: string; accuracy: number; pp: number;
  secondaryEffectChance: number; target: string; priority: number; flags: string[];
  category: string; hitsMin: number; hitsMax: number; critStage: number;
};
export type SpeciesStructFields = ReadonlyArray<string>;
export const SPECIES_STRUCT_FIELDS: SpeciesStructFields = [
  "baseHP", "baseAttack", "baseDefense", "baseSpeed", "baseSpAttack", "baseSpDefense",
  "types", "catchRate", "expYield", "evYield", "itemCommon", "itemRare", "itemVeryRare",
  "genderRatio", "eggCycles", "friendship", "growthRate", "eggGroups", "abilities", "hiddenAbility",
  "safariZoneFleeRate", "bodyColor", "noFlip",
];
// Nature table: FireRed sNatureStatTable, 25 rows x 5 stats
// (Attack, Defense, Speed, Sp.Atk, Sp.Def), values +1 / 0 / -1.
// +1 -> stat * 110 / 100; -1 -> stat * 90 / 100; HP, accuracy,
// evasion never modified. Assignments themselves are BLOCKED
// (map DS9); the table is wireable.
export function modifyStatByNature(stat: number, modifier: 1 | 0 | -1): number {
  if (modifier === 1) return Math.floor((stat * 110) / 100);
  if (modifier === -1) return Math.floor((stat * 90) / 100);
  return stat;
}
export const NATURE_SLOT_COUNT = 25;
// Type chart shape: triple list (attacking type, defending type,
// multiplier), multiplier encoding 20 = x2.0, 10 = x1.0, 5 = x0.5,
// 0 = x0.0. FireRed: 112 triples. True chart values are BLOCKED
// (map DS10/DS11); this is the shape + lookup only.
export type TypeTriple = { attacking: string; defending: string; multiplier: number };
export function lookupTypeMultiplier(triples: TypeTriple[], attacking: string, defending: string): number {
  const hit = triples.find((t) => t.attacking === attacking && t.defending === defending);
  return hit ? hit.multiplier : 10;
}
// Learnset loader shape: four channels per roster slot; TM codes
// resolved via the generation's TM map (a parameter, not invented).
export type LearnsetChannels = { byLevel: Array<[number, string]>; byMachine: string[]; byTutor: string[]; egg: string[] };
export function resolveTmCode(tmMap: Record<string, string>, code: string): string | null {
  return tmMap[code] ?? null;
}
// Evolution triple shape + list widening (single-target field
// must become a list; branching is already supported by the shape).
export type EvolutionEntry = { method: string; param: string | number; targetSlotId: string };
export const EVOLUTION_METHODS: ReadonlyArray<string> = ["level", "item", "trade", "trade-item", "friendship", "knows-move"];
// Trainer struct backfill fields (present in source, missing in
// the generated Black 2 JSON — passthrough work, map DS14).
export const TRAINER_BACKFILL_FIELDS: ReadonlyArray<string> = ["aiFlags", "items", "heals", "money", "reward"];
// AI bitfield (FireRed, 14 defined bits: 11 lower + 3 high special).
export const AI_FLAG_BITS: ReadonlyArray<{ id: string; bit: string }> = [
  { id: "check-bad-move", bit: "1<<0" }, { id: "check-viability", bit: "1<<1" },
  { id: "try-to-faint", bit: "1<<2" }, { id: "setup-first-turn", bit: "1<<3" },
  { id: "risky", bit: "1<<4" }, { id: "prefer-strongest-move", bit: "1<<5" },
  { id: "prefer-baton-pass", bit: "1<<6" }, { id: "double-battle", bit: "1<<7" },
  { id: "hp-aware", bit: "1<<8" }, { id: "unknown", bit: "1<<9" },
  { id: "roaming", bit: "1<<29" }, { id: "safari", bit: "1<<30" }, { id: "first-battle", bit: "1<<31" },
];
// Facility set-table shape (fixed-level sets + trainer table +
// streak/record system). Level rules themselves are BLOCKED (DS18).
export type FacilitySetTable = { levelBracket: number; sets: string[]; trainers: string[]; streakRecord: boolean };
export const FACILITY_TABLE_SHAPE: ReadonlyArray<string> = ["level-50-set-table", "level-100-set-table", "facility-class-to-pic-lookup", "streak-record"];

// ---------------------------------------------------------------- F. Whole-game field / src / graphics / sound / text lookups
// Lookup structures only — assignments are BLOCKED (map §5).
// Field categories (batch E): areas, matrices, scripts, events,
// actors, props, trades, places (structure only), maps.
export const FIELD_LOOKUP_CATEGORIES: ReadonlyArray<{ id: string; stagedFile: string; keyFields: string[] }> = [
  { id: "areas", stagedFile: "batch-e/field_areas.json", keyFields: ["exterior", "lights", "edge-colour-table-id", "actor-material-colour-id"] },
  { id: "matrices", stagedFile: "batch-e/field_matrices.json", keyFields: ["rows", "columns-per-row", "cells", "anonymous-model-index"] },
  { id: "scripts", stagedFile: "batch-e/field_scripts.json", keyFields: ["opcode-tokens", "flow-labels", "numeric-args", "anonymous-flag-refs"] },
  { id: "events", stagedFile: "batch-e/field_events.json", keyFields: ["background-events", "actor-placements", "warps", "triggers", "init-scripts"] },
  { id: "actors", stagedFile: "batch-e/field_actors.json", keyFields: ["record-type", "shadow-flag", "footprint-type", "collision-size"] },
  { id: "props", stagedFile: "batch-e/field_props.json", keyFields: ["resource-id", "transformed-flag", "bounding-box-summary"] },
  { id: "trades", stagedFile: "batch-e/field_trades.json", keyFields: ["offered-slot", "wanted-slot", "form", "level", "ivs", "ability-slot"] },
  { id: "places", stagedFile: "batch-e/field_places.json", keyFields: ["anonymous-id", "has-name-flag"] },
  { id: "maps", stagedFile: "batch-e/field_maps.json", keyFields: ["model-dir", "terrain-summaries", "transformed-flag"] },
];
export function fieldLookupKey(categoryId: string, anonymousId: string): string {
  return `${categoryId}:${anonymousId}`;
}
// Src system summary lookups (batch F, 16 systems; dialogue +
// sound-music are count-only by design).
export const SRC_SYSTEM_FILES: ReadonlyArray<string> = [
  "battle", "party_menu", "bag", "shop", "pc_storage", "title_main_menu", "save_load",
  "weather", "camera", "battle_animation_effects", "overworld_movement_field",
  "day_night_time_seasons", "dialogue_message", "sound_music_code",
  "system_core_shared_ui", "network_link",
];
// Graphics / sound / text structure lookups (batch G; content 0% by design).
export const STRUCTURE_LOOKUPS: ReadonlyArray<{ id: string; stagedFile: string; contentPercent: number }> = [
  { id: "graphics-structure", stagedFile: "batch-g/graphics_structure.json", contentPercent: 0 },
  { id: "sound-structure", stagedFile: "batch-g/sound_structure.json", contentPercent: 0 },
  { id: "text-structure", stagedFile: "batch-g/text_structure.json", contentPercent: 0 },
];
