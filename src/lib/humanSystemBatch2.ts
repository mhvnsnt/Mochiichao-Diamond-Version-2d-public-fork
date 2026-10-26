// STAGED ONLY — Human System Batch 2, 2026-10-26. NOT in repo, NOT live, NOT wired to game.
// Gate-ready companion to wiring-2026-10-26/humanSystem.ts (which stays untouched).
// Mars order 2026-10-26 ~13:58 CDT: pull in all Pokemon code/structure for everything else
// in this lane and wire it up — anything NOT a Pokemon name, cry, or exact dialogue gets
// pulled in and wired; names/cries/exact dialogue are swapped to Mochiichao, never verbatim.
// CORRECTION 2026-10-26 ~13:59 CDT: Dojo 5 Umbral leader is PHANTOM (Japanese samurai oni,
// wears a Japanese oni mask). The superseded name is used NOWHERE in this file.
// No Pokemon character names, art, sprites, logos, cries, or dialogue lines are in here.
// Mars-only slots stay null / "AWAITING_MARS" — never invented.

export type Proportion = "Full" | "Chibi";
export type TeamMode = "fixed" | "randomized";

// ---- Creator: 8 presets, parents race screen (supersedes the old no-parents-screen rule) ----
export type PresetId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export interface CreatorPreset {
  id: PresetId;
  identity: string | null; // null = AWAITING_MARS
  status: "LOCKED" | "AWAITING_MARS";
}
export const CREATOR_PRESETS: CreatorPreset[] = [
  { id: "A", identity: "Black", status: "LOCKED" },
  { id: "B", identity: "East Asian", status: "LOCKED" },
  { id: "C", identity: "Latina", status: "LOCKED" },
  { id: "D", identity: "White", status: "LOCKED" },
  { id: "E", identity: null, status: "AWAITING_MARS" },
  { id: "F", identity: null, status: "AWAITING_MARS" },
  { id: "G", identity: null, status: "AWAITING_MARS" },
  { id: "H", identity: null, status: "AWAITING_MARS" },
];

export type ParentSlotId = "P1" | "P2" | "P3" | "P4";
export interface ParentOption { id: ParentSlotId; raceSkin: string | null; status: "AWAITING_MARS" }
export const PARENT_OPTIONS: ParentOption[] = [
  { id: "P1", raceSkin: null, status: "AWAITING_MARS" },
  { id: "P2", raceSkin: null, status: "AWAITING_MARS" },
  { id: "P3", raceSkin: null, status: "AWAITING_MARS" },
  { id: "P4", raceSkin: null, status: "AWAITING_MARS" },
];
// Parents screen: optional, AFTER player creation. Sets an INDEPENDENT parents skin slot.
// Changing the player skin never silently changes parents skin after this screen is used,
// and vice versa. Skipped => parents follow the player preset skin, as before.
export function resolveParentsSkin(playerSkin: string, parentsChoice: string | null): string {
  return parentsChoice ?? playerSkin;
}

export interface PlayerCustomBatch2 {
  presetId: PresetId;
  name: string;
  skin: string;
  hairStyle: string;
  hairColour: string;
  eyes: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string[]; // max 2
  head?: string;
  outer?: string;
  parentsSkin: string | null; // independent slot; null until the parents screen is used
}
export function validatePlayerCustomBatch2(p: PlayerCustomBatch2): string[] {
  const e: string[] = [];
  if (!CREATOR_PRESETS.some((x) => x.id === p.presetId)) e.push("presetId must be A-H");
  if (!p.name.trim()) e.push("name required");
  if (p.accessories.length > 2) e.push("accessories max 2 in this slot shape");
  for (const k of ["skin", "hairStyle", "hairColour", "eyes", "top", "bottom", "shoes"] as const)
    if (!p[k]) e.push(`${k} required`);
  return e;
}

// ---- Crowd: table shape + archetypes (existing lane archetypes only) + roles ----
export const CROWD_ARCHETYPES = ["flame", "racing", "logo", "junkyard", "workwear", "streetwear", "sport", "punk"] as const;
export const CROWD_ROLES = ["shopper", "worker", "kid", "elder", "passerby", "vendor"] as const;
export interface CrowdSlotBatch2 {
  townId: string;
  outfitArchetype: string; // one of CROWD_ARCHETYPES only
  skinToneBand: string;
  bodyType: string;
  role: string; // one of CROWD_ROLES only
  dialoguePoolId: string; // structure only; pool contents are Mochiichao lines to be written
  density: string | null; // AWAITING_MARS: which towns get which crowd density is Mars-only
}
export function crowdIsBalancedBatch2(slots: CrowdSlotBatch2[]): boolean {
  // Lane rule: per-batch skin-tone count BEFORE presenting, never all one tone.
  return new Set(slots.map((s) => s.skinToneBand)).size > 1;
}

// ---- Dojo / Elite / Admin / Hacker: locked names, lane teams, show-first ----
export interface TeamMember { creature: string; level: number } // creature = Mochiichao roster id or in-code name; moves resolve at battle from game move data, not invented here
export interface BattleLeader {
  id: string;
  name: string | null; // null = AWAITING_MARS
  theme: string | null;
  town: string | null;
  badge: string | null;
  reward: number | null;
  fixedTeam: TeamMember[] | null; // null = AWAITING_MARS
  teamStatus: "IN_CODE" | "LANE_SHOW_FIRST" | "LANE_SHOW_FIRST_PENDING_MARS" | "AWAITING_MARS";
  look?: string;
  displayAs?: string;
}
export const DOJO_LEADERS: BattleLeader[] = [
  { id: "dojo_1", name: "Lin", theme: null, town: null, badge: "Core Fragment", reward: null, fixedTeam: [{ creature: "Dreadtoise", level: 14 }], teamStatus: "IN_CODE" },
  { id: "dojo_2", name: "Falk", theme: "Aero", town: null, badge: "Wind Fragment", reward: null, fixedTeam: [{ creature: "019", level: 18 }, { creature: "020", level: 19 }, { creature: "021", level: 20 }], teamStatus: "LANE_SHOW_FIRST_PENDING_MARS" },
  { id: "dojo_3", name: "Tetsu", theme: "Chrome", town: "Neon City", badge: "Neon Fragment", reward: 2000, fixedTeam: [{ creature: "005", level: 23 }, { creature: "033", level: 23 }, { creature: "034", level: 24 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "dojo_4", name: "Kenji", theme: "Strike", town: "Market City", badge: "Strike Fragment", reward: 2200, fixedTeam: [{ creature: "029", level: 29 }, { creature: "030", level: 30 }, { creature: "031", level: 30 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "dojo_5", name: "PHANTOM", theme: "Umbral", town: "Central City", badge: "Umbral Fragment", reward: 2400, fixedTeam: [{ creature: "043", level: 33 }, { creature: "028", level: 33 }, { creature: "009", level: 34 }], teamStatus: "LANE_SHOW_FIRST", look: "Japanese samurai oni, wears a Japanese oni mask" },
  { id: "dojo_6", name: "Shizuku", theme: "Water", town: "Harbor City", badge: "Water Fragment", reward: 2600, fixedTeam: [{ creature: "023", level: 37 }, { creature: "025", level: 37 }, { creature: "003", level: 38 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "dojo_7", name: "Homura", theme: "Flame", town: "Ember Island", badge: "Flame Fragment", reward: 2800, fixedTeam: [{ creature: "012", level: 41 }, { creature: "045", level: 41 }, { creature: "046", level: 42 }], teamStatus: "LANE_SHOW_FIRST" },
  // Dojo 8: name/display locked, team Mars-only. The island single-creature file team is
  // NOT carried over here, and the lane R1-056 team row is NOT assigned to this leader.
  { id: "dojo_8", name: "Luigi", theme: null, town: null, badge: "Final Fragment", reward: null, fixedTeam: null, teamStatus: "AWAITING_MARS", displayAs: "MYSTERIOUS FIGURE until reveal" },
];
export const ELITE_FOUR: BattleLeader[] = [
  { id: "elite_1", name: "Umi", theme: "Water", town: "Mainframe Plateau", badge: null, reward: 5000, fixedTeam: [{ creature: "003", level: 50 }, { creature: "025", level: 50 }, { creature: "028", level: 51 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "elite_2", name: "Gin", theme: "Chrome", town: "Mainframe Plateau", badge: null, reward: 5500, fixedTeam: [{ creature: "006", level: 51 }, { creature: "034", level: 51 }, { creature: "023", level: 52 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "elite_3", name: "Hono", theme: "Flame", town: "Mainframe Plateau", badge: null, reward: 6000, fixedTeam: [{ creature: "012", level: 52 }, { creature: "046", level: 52 }, { creature: "045", level: 53 }], teamStatus: "LANE_SHOW_FIRST" },
  { id: "elite_4", name: "Yoru", theme: "Umbral", town: "Mainframe Plateau", badge: null, reward: 6500, fixedTeam: [{ creature: "009", level: 53 }, { creature: "043", level: 53 }, { creature: "028", level: 54 }], teamStatus: "LANE_SHOW_FIRST" },
];
// Elite gating: 4 seats in order, no skipping. Heal-between-seats rule is Mars-only, not invented.
// Champion after Elite Four is UNRESOLVED (Hex vs Mythar conflict) — no champion assigned here.
export const SYNDICATE_ADMINS: BattleLeader[] = Array.from({ length: 10 }, (_, i) => ({
  id: `syndicate_admin_${String(i + 1).padStart(2, "0")}`,
  name: null, theme: null, town: null, badge: null, reward: null, fixedTeam: null, teamStatus: "AWAITING_MARS" as const,
}));
export const HACKER_LEADER: BattleLeader = {
  id: "hacker_leader", name: null, theme: null, town: null, badge: null, reward: null, fixedTeam: null, teamStatus: "AWAITING_MARS",
};
// Unplaced locked leader: Region 1 has no pure Rock dojo, so placement stays open.
export const UNPLACED_LEADER: BattleLeader = {
  id: "unplaced_rock", name: "Iwao", theme: "Rock", town: null, badge: null, reward: null, fixedTeam: null, teamStatus: "AWAITING_MARS",
};

// ---- Fixed teams by default; randomized as a settings option; no per-draw lock ----
// Randomized pool = same-theme locked teams in Region 1 (dojo + elite sharing a theme).
// No new species are invented for a pool. A single-team pool draws the fixed team.
// Randomized draws are EPHEMERAL: they are never written to the save file, so no random
// draw is ever locked in. Only fixed resolutions are persisted (see SaveShape below).
export const THEME_POOLS: Record<string, string[]> = {
  Chrome: ["dojo_3", "elite_2"],
  Umbral: ["dojo_5", "elite_4"],
  Water: ["dojo_6", "elite_1"],
  Flame: ["dojo_7", "elite_3"],
  Strike: ["dojo_4"],
  Aero: ["dojo_2"],
  Core: ["dojo_1"],
};
export interface ResolvedTeam {
  leaderId: string;
  team: TeamMember[] | null; // null = AWAITING_MARS, never a guessed team
  mode: TeamMode;
  source: "fixed-locked" | "randomized-draw" | "randomized-single-team-pool" | "awaiting-mars";
  showFirst: true; // resolved team is shown to the player before the battle in both modes
  persisted: boolean; // fixed => true; randomized => false (no per-draw lock)
}
export function resolveTeam(leaderId: string, mode: TeamMode, pickIndex?: number): ResolvedTeam {
  const all = [...DOJO_LEADERS, ...ELITE_FOUR, ...SYNDICATE_ADMINS, HACKER_LEADER, UNPLACED_LEADER];
  const leader = all.find((l) => l.id === leaderId);
  if (!leader || !leader.fixedTeam) {
    return { leaderId, team: null, mode, source: "awaiting-mars", showFirst: true, persisted: false };
  }
  if (mode === "fixed") {
    return { leaderId, team: leader.fixedTeam, mode, source: "fixed-locked", showFirst: true, persisted: true };
  }
  const poolIds = leader.theme ? (THEME_POOLS[leader.theme] ?? [leaderId]) : [leaderId];
  const pool = poolIds.map((id) => all.find((l) => l.id === id)?.fixedTeam).filter((t): t is TeamMember[] => !!t);
  if (pool.length <= 1) {
    return { leaderId, team: leader.fixedTeam, mode, source: "randomized-single-team-pool", showFirst: true, persisted: false };
  }
  const idx = pickIndex === undefined ? Math.floor(Math.random() * pool.length) : pickIndex % pool.length;
  return { leaderId, team: pool[idx], mode, source: "randomized-draw", showFirst: true, persisted: false };
}

// ---- Heal system: shape + respawn only; nurse name/location/team Mars-only ----
export interface HealPointBatch2 {
  id: string; map: string; x: number; y: number; respawnMap: string; respawnNpcRole: string;
}
export const HEAL_WORKFLOW = [
  "player enters heal point",
  "healer role offers heal (dialogue content AWAITING_MARS, not copied)",
  "all party creatures restored to full",
  "save heal point as respawn point",
  "on blackout, respawn at last heal point (money/penalty rule AWAITING_MARS, not invented)",
] as const;
export interface NamedHealerSlot {
  name: string | null;
  locations: string | null;
  healerTeam: string | null; // whether the named healer has a battle team at all is Mars-only
  dialogue: string | null;
}
export const NAMED_HEALER: NamedHealerSlot = {
  name: null, locations: null, healerTeam: null, dialogue: null,
};
export const CURRENT_HEAL_ROLES = ["Mom (home heal role)", "MochiPlex nurse (role, not a named sheet)"] as const;

// ---- Clothing catalogue: 7 slots, proprietary brands only, no real brand names ----
export const CLOTHING_SLOTS_BATCH2 = ["top", "bottom", "shoes", "head", "accessory1", "accessory2", "outer"] as const;
export const PROPRIETARY_BRANDS_BATCH2 = ["MOCHI SUPPLY", "MAINFRAME", "SCRAPWEAR", "NEON SECTOR", "kanji"] as const;
export interface CatalogueEntryBatch2 {
  id: string; slot: string; brand: string; colours: string[]; pattern: string; layer: string;
}
export function validateCatalogueBatch2(e: CatalogueEntryBatch2): string[] {
  const err: string[] = [];
  if (!(CLOTHING_SLOTS_BATCH2 as readonly string[]).includes(e.slot)) err.push("bad slot");
  if (!(PROPRIETARY_BRANDS_BATCH2 as readonly string[]).includes(e.brand)) err.push("brand must be proprietary only");
  if (e.colours.length < 2 || e.colours.length > 3) err.push("colours must be 2-3");
  return err;
}
// Catalogue VALUES are not invented here: existing approved outfits go into slots first at
// PR time, then playtest, then new outfits. Shop prices stay placeholders AWAITING_MARS.
export const CLOTHING_FLOWS = {
  shop: "browse per-town stock -> buy -> owned list (prices PLACEHOLDER, AWAITING_MARS)",
  fittingRoom: "change only owned clothes, at heal points and shops",
  salon: "change hair style + hair colour only, not clothes",
} as const;

// ---- Proportions: separate options, World default Chibi, Battle default Full ----
export const DEFAULT_PROPORTIONS_BATCH2: { worldProportion: Proportion; battleProportion: Proportion } = {
  worldProportion: "Chibi",
  battleProportion: "Full",
};

// ---- Settings + save shapes (staged; the live save file is NOT touched by this slice) ----
export interface SettingsBatch2 {
  teamMode: TeamMode; // default "fixed"
  worldProportion: Proportion;
  battleProportion: Proportion;
}
export const DEFAULT_SETTINGS_BATCH2: SettingsBatch2 = {
  teamMode: "fixed",
  worldProportion: "Chibi",
  battleProportion: "Full",
};
export interface SaveShapeBatch2 {
  playerCustom: PlayerCustomBatch2 | null;
  parentsSkin: string | null; // independent slot; null = follow player skin
  healPoint: HealPointBatch2 | null; // last heal point = respawn point
  settings: SettingsBatch2;
  defeatedDojos: string[]; // dojo_1 .. dojo_8 flags; defeat N unlocks next; dojo_8 unlocks Victory Route + Plateau
  eliteSeatsCleared: string[]; // elite_1 .. elite_4, in order, no skipping
  resolvedTeams: Record<string, TeamMember[]>; // FIXED resolutions only; randomized draws are never stored
}
export function emptySaveBatch2(): SaveShapeBatch2 {
  return {
    playerCustom: null, parentsSkin: null, healPoint: null,
    settings: { ...DEFAULT_SETTINGS_BATCH2 },
    defeatedDojos: [], eliteSeatsCleared: [], resolvedTeams: {},
  };
}
export function canEnterEliteFourBatch2(defeatedDojos: string[]): boolean {
  return DOJO_LEADERS.every((d) => defeatedDojos.includes(d.id));
}
export function canEnterVictoryRouteBatch2(defeatedDojos: string[]): boolean {
  return defeatedDojos.includes("dojo_8");
}
