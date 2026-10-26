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
// PR #100 atlas batch (Human Characters lane, merged on main): every atlas
// below is a 256x256 4x4 grid of 64x64 cells with the SAME layout as the
// Player A atlas — row 0 = world front/back/left/right, rows 1-2 = walk
// idle/step, row 3 = battle (cell 12) + portrait (cell 13) — verified
// against each atlas's manifest (cells 0-3 world, 4-7 walk idle, 8-11
// walk step, 12 battle, 13 portrait). Game code today consumes row-0
// world cells only (PixiWorldCanvas world sprites + HumanPortrait
// dialogue front), exactly as for Player A: walk, battle and portrait
// cells are present in the atlases + manifests but NOT yet animated or
// wired by game code — that is a follow-up pass, not claimed here.
import shopkeeperAtlas from '../assets/human-characters/in-game-sheets/shopkeeper-atlas-64x64.png';
import krixAtlas from '../assets/human-characters/in-game-sheets/krix-atlas-64x64.png';
import syndicateAtlas from '../assets/human-characters/in-game-sheets/syndicate-grunt-atlas-64x64.png';
import liberationAtlas from '../assets/human-characters/in-game-sheets/liberation-front-atlas-64x64.png';
import dojoStudentAtlas from '../assets/human-characters/in-game-sheets/dojo-student-atlas-64x64.png';
import gardenKeeperAtlas from '../assets/human-characters/in-game-sheets/garden-keeper-atlas-64x64.png';
import techTinkererAtlas from '../assets/human-characters/in-game-sheets/tech-tinkerer-atlas-64x64.png';
import momBlackAtlas from '../assets/human-characters/in-game-sheets/mom-black-atlas-64x64.png';
import momEastAsianAtlas from '../assets/human-characters/in-game-sheets/mom-east-asian-atlas-64x64.png';
import momLatinaAtlas from '../assets/human-characters/in-game-sheets/mom-latina-atlas-64x64.png';
import momWhiteAtlas from '../assets/human-characters/in-game-sheets/mom-white-atlas-64x64.png';

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
  /** Number of 64x64 rows in the sheet image. Default 1 (strips); 4 for the Player A atlas. */
  sheetRows?: number;
  /** Variant sheets for a slot whose art varies (Mom): keyed by variant
   *  name, bundled with the slot so the bundler cannot tree-shake them
   *  away. No selection UI reads this yet — that is still owed. */
  variantSheets?: Record<string, string>;
  color: string;
}

const FRAMES: Record<HumanView, number> = { front: 0, back: 64, left: 128, right: 128 };

function slot(slotId: string, label: string, role: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl: null, frames: FRAMES, color };
}

/** Atlas slot: same row-0 world frames as Player A (front 0, back 64,
 *  left 128, right 192 — distinct right cell, NOT mirrored left), 4x4
 *  grid. Walk (cells 4-11), battle (12) and portrait (13) are in the
 *  atlas but not yet consumed by game code — see the import comment. */
function atlasSlot(slotId: string, label: string, role: string, sheetUrl: string, color: string): HumanSlot {
  return { slotId, label, role, sheetUrl, frames: { front: 0, back: 64, left: 128, right: 192 }, sheetCols: 4, sheetRows: 4, color };
}

/**
 * Mom variant sheets (PR #100: mom-black, mom-east-asian, mom-latina,
 * mom-white). Mom is VARIABLE by player pick, NOT fixed canon, and the
 * game has no variant-selection mechanism today — so the four variants
 * are bundled here as loadable data and the mom slot itself keeps
 * sheetUrl null (silhouette) until a selection UI exists. Picking one
 * variant as a default would invent a canon Mom the lane has NOT set.
 * Selection UI is still owed; it is NOT invented in this pass.
 * The record is attached to the mom slot as variantSheets so the
 * bundler keeps all four files (a bare unused export could be
 * tree-shaken away).
 */
export const MOM_VARIANT_SHEETS: Record<'black' | 'east-asian' | 'latina' | 'white', string> = {
  black: momBlackAtlas,
  'east-asian': momEastAsianAtlas,
  latina: momLatinaAtlas,
  white: momWhiteAtlas,
};

export const HUMAN_SLOTS: Record<string, HumanSlot> = {
  player_boy: slot('player_boy', 'Player (boy)', 'player', '#4fc3f7'),
  // Player A (young Black woman, teal/chrome jacket, chibi atlas, Mars-approved
  // 2026-10-25) wired to player_girl — the game has boy/girl slots only, no
  // A/B/C/D picker yet. Only row-0 world cells are wired here: front 0,
  // back 64, left 128, right 192 (distinct right cell, NOT mirrored left).
  // Walk (cells 4-11), battle_back (12) and portrait (13) are in the atlas
  // + manifest but NOT yet wired by game code — follow-up pass, not claimed.
  player_girl: { slotId: 'player_girl', label: 'Player (girl)', role: 'player', sheetUrl: playerAAtlas, frames: { front: 0, back: 64, left: 128, right: 192 }, sheetCols: 4, sheetRows: 4, color: '#f48fb1' },
  hex: slot('hex', 'Hex (rival)', 'rival', '#b388ff'),
  prof_aeon: slot('prof_aeon', 'Prof. Aeon', 'professor', '#e0e0e0'),
  mochiko: slot('mochiko', 'Assistant Mochiko', 'assistant', '#80cbc4'),
  mom: { ...slot('mom', 'Mom', 'family', '#ffcc80'), variantSheets: MOM_VARIANT_SHEETS },
  dojo_trainer: slot('dojo_trainer', 'Dojo Trainer', 'trainer', '#ef9a9a'),
  // Dojo Student (PR #100 atlas): routed by slotForNpc below to the
  // dojo acolyte NPCs (dojo_acolyte_1-4, dojo1_guard "Dojo Acolyte"),
  // who ARE dojo students in the map data. Dojo bosses (Master Lin,
  // Master Falk, isDojoBoss) keep the dojo_trainer slot, which stays
  // null — student art is NOT put on the bosses, whose own sheets are
  // still owed.
  dojo_student: atlasSlot('dojo_student', 'Dojo Student', 'trainer', dojoStudentAtlas, '#ef9a9a'),
  // Garden Keeper (PR #100 atlas, battle front v2): slot defined and
  // bundled, but NOT routed yet — no Garden NPC routes through
  // slotForNpc today and GardenView does not use it. Garden staff
  // routing is still owed. FLAG, preserved honestly: her manifest's
  // front step reuses the front idle cell (steps "0:0,0:3,1:1,1:3" —
  // front step = cell 0), because her walk sheet has no distinct
  // front step; no front-step frame is invented here. This only
  // matters when walk animation wiring lands; row-0 world cells
  // consumed today are unaffected.
  garden_keeper: atlasSlot('garden_keeper', 'Garden Keeper', 'garden-staff', gardenKeeperAtlas, '#a5d6a7'),
  // Tech Tinkerer (PR #100 atlas): slot defined and bundled, but NOT
  // routed yet — no tech NPC routes through slotForNpc today (the
  // Sector 0 "Technology Enthusiast", id fat_guy, is NOT evidenced
  // as the Tech Tinkerer, so it is NOT routed here). Tech NPC routing
  // is still owed.
  tech_tinkerer: atlasSlot('tech_tinkerer', 'Tech Tinkerer', 'trainer', techTinkererAtlas, '#90caf9'),
  // Shopkeeper (PR #100 atlas, portrait v2 cel): routed by slotForNpc
  // below — shop_1 "Clerk" isShop in Silicon Town MochiiPlex.
  shopkeeper: atlasSlot('shopkeeper', 'Shopkeeper', 'shop', shopkeeperAtlas, '#ffe082'),
  academy_staff: slot('academy_staff', 'Academy Staff', 'garden-staff', '#a5d6a7'),
  market_staff: slot('market_staff', 'Market Staff', 'garden-staff', '#ffab91'),
  race_staff: slot('race_staff', 'Race Staff', 'garden-staff', '#90caf9'),
  sparring_staff: slot('sparring_staff', 'Sparring Staff', 'garden-staff', '#ce93d8'),
  hacker: slot('hacker', 'Hacker Grunt', 'antagonist', '#ef5350'),
  // Syndicate Grunt (PR #100 atlas): routed by slotForNpc below
  // (id includes 'syndicate'). No syndicate-id NPC exists in the
  // maps today, so this art shows once one does — the slot mapping
  // itself is name-verified, not guessed.
  syndicate: atlasSlot('syndicate', 'Syndicate Member', 'antagonist', syndicateAtlas, '#8d6e63'),
  // Liberation Front (PR #100 atlas, current = v2): routed by
  // slotForNpc below (id includes 'liberation'). NOTE: Binary Woods'
  // hacker_grunt2 ("Hacker Grunt", dialogue "The woods belong to the
  // Liberation Front now!") does NOT route here — its id/name are
  // Hacker Grunt, so it keeps the hacker slot (no atlas yet). The
  // liberation art shows once a liberation-id NPC exists.
  liberation: atlasSlot('liberation', 'Liberation Front Member', 'antagonist', liberationAtlas, '#66bb6a'),
  // Junk Warlord Krix (PR #100 atlas, walk v2 — dreadlocks + gold
  // tooth are canon going forward): routed by slotForNpc below
  // (id includes 'krix'). No krix-id NPC exists in the maps today,
  // so this art shows once one does.
  krix: atlasSlot('krix', 'Junk Warlord Krix', 'antagonist', krixAtlas, '#ff7043'),
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
  // Dojo acolytes are dojo students (map ids dojo_acolyte_1-4,
  // dojo1_guard; event NPCs carry the name "Acolyte Ken" /
  // "Dojo Acolyte" with no id). Bosses are handled above and never
  // reach this branch.
  if (id.includes('dojo_acolyte') || id === 'dojo1_guard' || name.includes('acolyte')) return HUMAN_SLOTS.dojo_student;
  if (id.includes('trainer') || npc?.battle) return HUMAN_SLOTS.trainer_generic;
  return HUMAN_SLOTS.townspeople;
}
