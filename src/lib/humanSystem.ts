// STAGED ONLY — Human System wiring, 2026-10-26. NOT in repo, NOT live, NOT wired to game.
// Source structure: FireRed/HeartGold/Black 2 decomp files (flags, badge counts, trainer
// record shapes, heal-location shapes) + later-gen preset-picker structure, rebuilt in
// Mochiichao words. NO Pokemon character names, art, sprites, logos, or dialogue lines.
// Mars-only slots stay blank / "AWAITING_MARS" — never invented here.
export type Proportion = "Full" | "Chibi";
export interface PlayerCustom {
  name: string; skin: string; hairStyle: string; hairColour: string; eyes: string;
  top: string; bottom: string; shoes: string; accessories: string[];
  head?: string; outer?: string;
}
export interface Proportions { worldProportion: Proportion; battleProportion: Proportion; }
export const DEFAULT_PROPORTIONS: Proportions = { worldProportion: "Chibi", battleProportion: "Full" };
// Creator 4 units: (1) data shape, (2) picker flow, (3) Mom-follow rule, (4) save/resolve
export const PICKER_FLOW = ["chooseLook", "skinHairEyes", "outfitSlots", "enterName", "confirmSave"] as const;
export function momPresetForSkin(skin: string, presets: string[]): string {
  // Mom follows the SKIN slot only, same outfit/personality. No separate parents-race screen.
  return presets.includes(skin) ? skin : "AWAITING_MARS";
}
export function validatePlayerCustom(p: PlayerCustom): string[] {
  const e: string[] = [];
  if (!p.name.trim()) e.push("name required");
  if (p.accessories.length > 2) e.push("accessories max 2 in this slot shape");
  for (const k of ["skin","hairStyle","hairColour","eyes","top","bottom","shoes"] as const)
    if (!p[k]) e.push(`${k} required`);
  return e;
}
// Crowd 3 units: (1) slot shape, (2) per-town table builder, (3) per-batch skin-tone count check
export interface CrowdSlot { townId: string; outfitArchetype: string; skinToneBand: string; bodyType: string; role: string; dialoguePoolId: string; }
export function crowdSkinToneCount(slots: CrowdSlot[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const s of slots) c[s.skinToneBand] = (c[s.skinToneBand] ?? 0) + 1;
  return c;
}
export function crowdIsBalanced(slots: CrowdSlot[]): boolean {
  // Lane rule: per-batch count BEFORE presenting, never all one tone.
  return new Set(slots.map(s => s.skinToneBand)).size > 1;
}
// Dojo/Elite/Admin/Hacker 5 units: (1) badge flags, (2) dojo gating, (3) Elite Four order,
// (4) admin hierarchy shape, (5) leader battle record shape
export const DOJO_IDS = ["dojo_1","dojo_2","dojo_3","dojo_4","dojo_5","dojo_6","dojo_7","dojo_8"] as const;
export type DojoId = typeof DOJO_IDS[number];
export function nextDojo(defeated: DojoId[]): DojoId | null {
  return DOJO_IDS.find(d => !defeated.includes(d)) ?? null;
}
export function canEnterEliteFour(defeated: DojoId[]): boolean { return DOJO_IDS.every(d => defeated.includes(d)); }
export function canEnterVictoryRoute(defeated: DojoId[]): boolean { return defeated.includes("dojo_8"); }
export interface LeaderRecord {
  dojoId?: DojoId; leaderName: string; // "AWAITING_MARS" for dojo_2-7, Elite Four, admins, hacker leader
  trainerClass: string; battleStyle: string; items: string[]; aiFlags: string[];
  heals: boolean; money: number; reward: number;
  party: { creature: string; level: number; moves: string[] }[];
  dialogue: { intro: string; defeat: string; after: string }; // content AWAITING_MARS, never copied
}
// Heal 3 units: (1) heal-point table, (2) heal workflow, (3) respawn rule
export interface HealPoint { id: string; map: string; x: number; y: number; respawnMap: string; respawnNpcRole: string; }
export function respawnPoint(lastHeal: HealPoint | null): HealPoint | null { return lastHeal; }
// Clothing 3 units: (1) slot list, (2) catalogue validation, (3) shop/fitting/salon flow
export const CLOTHING_SLOTS = ["top","bottom","shoes","head","accessory1","accessory2","outer"] as const;
export const PROPRIETARY_BRANDS = ["MOCHI SUPPLY","MAINFRAME","SCRAPWEAR","NEON SECTOR"] as const;
export interface CatalogueEntry { id: string; slot: string; brand: string; colours: string[]; pattern: string; layer: string; }
export function validateCatalogue(e: CatalogueEntry): string[] {
  const err: string[] = [];
  if (!(CLOTHING_SLOTS as readonly string[]).includes(e.slot)) err.push("bad slot");
  if (!(PROPRIETARY_BRANDS as readonly string[]).includes(e.brand) && e.brand !== "kanji") err.push("brand must be proprietary only");
  if (e.colours.length < 2 || e.colours.length > 3) err.push("colours must be 2-3");
  return err;
}
// Proportions 2 units: (1) separate options, (2) defaults — see DEFAULT_PROPORTIONS.
// Integration/playtest gate 2 units: (1) system integration checklist, (2) playtest gate.
export const INTEGRATION_CHECKLIST = [
  "creator slots resolve to world sprite", "creator slots resolve to battle sprite",
  "crowd table loads per town", "dojo gating blocks next dojo until defeat",
  "Elite Four blocked until all 8 dojos", "heal restores party and sets respawn",
  "clothing change only from owned list", "world/battle proportions apply separately",
] as const;
