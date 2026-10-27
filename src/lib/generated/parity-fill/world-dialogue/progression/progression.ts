// PR Batch 3 wiring shape — landed as data under src/lib/generated/parity-fill/.
// NOT imported by App.tsx / game code yet; live wiring is a later step.
// Batch 3 fill (parent task 2026-10-26): Dojo leaders 3-7 named Tetsu, Kenji,
// Phantom, Shizuku, Homura; Elite Four named Umi, Gin, Hono, Yoru.
// Phantom is NOT Kage (Kage is a Pokemon name). Champion holder stays null:
// Hex vs Mythar conflict is unresolved and is NOT resolved here.
// Dojo 8 leader, all Dojo 3-7 dialogue/teams/Fragment names, all Elite
// dialogue/teams, and all 10 Syndicate admin slots stay null/open.
// Mirrors FullWorldMaps.ts badge pattern: a Dojo boss battle sets
// badge:"<Fragment>" — here that becomes flags.add("dojo_N_badge").
// FireRed analogue (shape only): FLAG_BADGE01_GET..08_GET, SYS_FLAGS+0x20..0x27.

export type FlagSet = Set<string>;

export const DOJO_FLAGS = [
  "dojo_1_badge", "dojo_2_badge", "dojo_3_badge", "dojo_4_badge",
  "dojo_5_badge", "dojo_6_badge", "dojo_7_badge", "dojo_8_badge",
] as const;

export interface DojoSlot {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  badgeFlag: string;
  badgeName: string | null; // Fragment name; null = open slot, not invented
  leader: string | null;    // null = OPEN SLOT (Mars-only)
  leaderStatus: "locked" | "open_slot";
}

// Locked from in-code / gap report only. Dojo 3-8 leaders are null on purpose.
export const DOJO_SLOTS: DojoSlot[] = [
  { number: 1, badgeFlag: "dojo_1_badge", badgeName: "Core Fragment", leader: "Master Lin", leaderStatus: "locked" },
  { number: 2, badgeFlag: "dojo_2_badge", badgeName: "Wind Fragment", leader: "Master Falk", leaderStatus: "locked" },
  { number: 3, badgeFlag: "dojo_3_badge", badgeName: null, leader: "Tetsu", leaderStatus: "locked" },
  { number: 4, badgeFlag: "dojo_4_badge", badgeName: null, leader: "Kenji", leaderStatus: "locked" },
  // Phantom, NOT Kage (Kage is a Pokemon name). Japanese samurai oni mask.
  { number: 5, badgeFlag: "dojo_5_badge", badgeName: null, leader: "Phantom", leaderStatus: "locked" },
  { number: 6, badgeFlag: "dojo_6_badge", badgeName: null, leader: "Shizuku", leaderStatus: "locked" },
  { number: 7, badgeFlag: "dojo_7_badge", badgeName: null, leader: "Homura", leaderStatus: "locked" },
  { number: 8, badgeFlag: "dojo_8_badge", badgeName: null, leader: null, leaderStatus: "open_slot" },
];

// Elite names locked in Batch 3; dialogue and teams stay null/open.
export const ELITE_SLOTS = [
  { order: 1, name: "Umi" as string | null, nameStatus: "locked" as const, dialogue: null as string | null, team: null, status: "open_slot" as const },
  { order: 2, name: "Gin" as string | null, nameStatus: "locked" as const, dialogue: null as string | null, team: null, status: "open_slot" as const },
  { order: 3, name: "Hono" as string | null, nameStatus: "locked" as const, dialogue: null as string | null, team: null, status: "open_slot" as const },
  { order: 4, name: "Yoru" as string | null, nameStatus: "locked" as const, dialogue: null as string | null, team: null, status: "open_slot" as const },
];

// Champion slot: present, holder null. Mars-only resolution owed:
// Hex (lane story) vs Mythar (in code) vs other — NOT chosen here.
export const CHAMPION_SLOT = {
  holder: null as string | null, team: null, status: "open_slot" as const,
};

export const SYNDICATE_ADMIN_SLOTS = Array.from({ length: 10 }, (_, i) => ({
  slot: i + 1, name: null as string | null, theme: null as string | null,
  dialogue: null as string | null, placement: null as string | null,
  status: "open_slot" as const,
}));

export function hasAllDojoBadges(flags: FlagSet): boolean {
  return DOJO_FLAGS.every((f) => flags.has(f));
}

// Victory Route gate: blocked until Dojo 8 in sequence; enforced as all-8
// because Dojo 8 is last — a 7/8 set (even with dojo_8) must still fail.
export function canEnterVictoryRoute(flags: FlagSet): boolean {
  return hasAllDojoBadges(flags);
}

// Elite chamber gate: re-checked at the chambers, so bypassing the arch
// (e.g. an edited save) still cannot enter the Elite Four early.
export function canEnterEliteChambers(flags: FlagSet): boolean {
  return hasAllDojoBadges(flags);
}

export function canChallengeChampion(flags: FlagSet): boolean {
  return flags.has("elite_four_cleared") && CHAMPION_SLOT.holder !== null;
}
