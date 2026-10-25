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
 *
 * Player A swap (2026-10-25, Mars-approved): Player A is a young Black
 * woman, teal/chrome jacket. The game has boy/girl slots only (no
 * A/B/C/D picker yet), so Player A is wired to the player_girl slot —
 * choosing GIRL shows Player A art in world + battle. Her atlas is a
 * 256x256 4-column grid (not a 192x64 strip): row 0 = world
 * front/back/left/right, rows 1-2 = walk idle/step frames, row 3 =
 * battle_back + portrait. Only row 0 is wired by game code in this
 * batch (see HUMAN_SLOTS comment below); walk, battle_back and
 * portrait cells are present in the atlas + manifest but not yet
 * animated/wired — that is a follow-up pass, not claimed here.
 * Portrait eye drift, noted not fixed: portrait v1 eyes drifted to
 * teal/blue; model/walk eyes are brown and brown is canon. The atlas
 * was NOT hand-edited to fix eyes; correction is a full-stack edit
 * later, and portrait eye colour must not be locked as canon.
 */
import playerAAtlas from '../assets/human-characters/in-game-sheets/player-a-atlas-64x64.png';

export type HumanView = 'front' | 'back' | 'left' | 'right';

export interface HumanSlot {
  slotId: string;
  label: string;
  role: string;
  /** Null until the Human Characters lane delivers this sheet. */
  sheetUrl: string | null;
  /** x offset of each 64x64 cell when a sheet exists. Left mirrors right only when left === right (old strips). */
  frames: Record<HumanView, number>;
  /** Number of 64x64 columns in the sheet image. Default 3 (strips); 4 for the Player A atlas. */
  sheetCols?: number;
  color: string;
}

const FRAMES: Record<HumanView, number> = { front: 0, back: 64, left: 128, right: 128 };

function slot(slotId: string, label: string, role: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl: null, frames: FRAMES, color };
}

export const HUMAN_SLOTS: Record<string, HumanSlot> = {
  player_boy: slot('player_boy', 'Player (boy)', 'player', '#4fc3f7'),
  // Player A (young Black woman, teal/chrome jacket, chibi atlas, Mars-approved
  // 2026-10-25) wired to player_girl — the game has boy/girl slots only, no
  // A/B/C/D picker yet. Only row-0 world cells are wired here: front 0,
  // back 64, left 128, right 192 (distinct right cell, NOT mirrored left).
  // Walk (cells 4-11), battle_back (12) and portrait (13) are in the atlas
  // + manifest but NOT yet wired by game code — follow-up pass, not claimed.
  player_girl: { slotId: 'player_girl', label: 'Player (girl)', role: 'player', sheetUrl: playerAAtlas, frames: { front: 0, back: 64, left: 128, right: 192 }, sheetCols: 4, color: '#f48fb1' },
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
