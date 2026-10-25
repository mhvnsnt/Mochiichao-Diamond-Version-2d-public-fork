/**
 * Human sprite loader — same contract as the creature sheet loader, and
 * deliberately NOT creature-only: every human in the game goes through
 * here, so a sheet arriving from the Human Characters lane is a file
 * swap, not a code change.
 *
 * Format (same as creatures, extended for humans): a sheet image plus a
 * manifest with 64x64 cells — world front/back/left/right, walk
 * up/down/left/right (walk frames reuse the standing frame until the
 * lane delivers walk cycles), battle back (player trainer) / front
 * (opponent trainer), and a menu/portrait icon cell.
 * Until a sheet arrives, the slot's sheetUrl is null and the loader
 * renders a marked human silhouette placeholder (original coloured
 * shape, not an emoji) in the slot's colour.
 */

export type HumanView = 'front' | 'back' | 'left' | 'right';

export interface HumanSlot {
  slotId: string;
  label: string;
  role: string;
  /** Null until the Human Characters lane delivers this sheet. */
  sheetUrl: string | null;
  /** x offset of each 64x64 cell when a sheet exists. Left mirrors right. */
  frames: Record<HumanView, number>;
  color: string;
}

const FRAMES: Record<HumanView, number> = { front: 0, back: 64, left: 128, right: 128 };

function slot(slotId: string, label: string, role: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl: null, frames: FRAMES, color };
}

export const HUMAN_SLOTS: Record<string, HumanSlot> = {
  player_boy: slot('player_boy', 'Player (boy)', 'player', '#4fc3f7'),
  player_girl: slot('player_girl', 'Player (girl)', 'player', '#f48fb1'),
  hex: slot('hex', 'Hex (rival)', 'rival', '#b388ff'),
  prof_aeon: slot('prof_aeon', 'Prof. Aeon', 'professor', '#e0e0e0'),
  mochiko: slot('mochiko', 'Assistant Mochiko', 'assistant', '#80cbc4'),
  mom: slot('mom', 'Mom', 'family', '#ffcc80'),
  dojo_trainer: slot('dojo_trainer', 'Dojo Trainer', 'trainer', '#ef9a9a'),
  shopkeeper: slot('shopkeeper', 'Shopkeeper', 'shop', '#ffe082'),
  academy_staff: slot('academy_staff', 'Academy Staff', 'garden-staff', '#a5d6a7'),
  market_staff: slot('market_staff', 'Market Staff', 'garden-staff', '#ffab91'),
  race_staff: slot('race_staff', 'Race Staff', 'garden-staff', '#90caf9'),
  sparring_staff: slot('sparring_staff', 'Sparring Staff', 'garden-staff', '#ce93d8'),
  hacker: slot('hacker', 'Hacker Grunt', 'antagonist', '#ef5350'),
  syndicate: slot('syndicate', 'Syndicate Member', 'antagonist', '#8d6e63'),
  liberation: slot('liberation', 'Liberation Front Member', 'antagonist', '#66bb6a'),
  krix: slot('krix', 'Junk Warlord Krix', 'antagonist', '#ff7043'),
  castagnoli: slot('castagnoli', 'Luigi Castagnoli', 'antagonist', '#5c6bc0'),
  mythar: slot('mythar', 'Champion Mythar', 'champion', '#ffd54f'),
  trainer_generic: slot('trainer_generic', 'Trainer', 'trainer', '#9e9e9e'),
  townspeople: slot('townspeople', 'Townspeople', 'npc', '#bcaaa4'),
};

export function playerSlot(gender: 'boy' | 'girl'): HumanSlot {
  return HUMAN_SLOTS[gender === 'girl' ? 'player_girl' : 'player_boy'];
}

/** Map a FullWorldMaps NPC to a human slot. Creature display NPCs (Dorowani/Gabu) are handled by the caller first. */
export function slotForNpc(npc: any): HumanSlot {
  const id = String(npc?.id || '').toLowerCase();
  const name = String(npc?.name || '').toLowerCase();
  if (id.includes('mom') || name.includes('mom')) return HUMAN_SLOTS.mom;
  if (id.includes('aeon') || name.includes('aeon')) return HUMAN_SLOTS.prof_aeon;
  if (id.includes('mochiko')) return HUMAN_SLOTS.mochiko;
  if (id.includes('hex') || name === 'hex') return HUMAN_SLOTS.hex;
  if (id.includes('krix')) return HUMAN_SLOTS.krix;
  if (id.includes('castagnoli') || name.includes('castagnoli')) return HUMAN_SLOTS.castagnoli;
  if (id.includes('mythar') || name.includes('mythar')) return HUMAN_SLOTS.mythar;
  if (id.includes('hacker') || id.includes('grunt')) return HUMAN_SLOTS.hacker;
  if (id.includes('syndicate')) return HUMAN_SLOTS.syndicate;
  if (id.includes('liberation')) return HUMAN_SLOTS.liberation;
  if (npc?.isShop) return HUMAN_SLOTS.shopkeeper;
  if (npc?.isHeal) return HUMAN_SLOTS.academy_staff;
  if (npc?.isDojoBoss) return HUMAN_SLOTS.dojo_trainer;
  if (id.includes('trainer') || npc?.battle) return HUMAN_SLOTS.trainer_generic;
  return HUMAN_SLOTS.townspeople;
}
