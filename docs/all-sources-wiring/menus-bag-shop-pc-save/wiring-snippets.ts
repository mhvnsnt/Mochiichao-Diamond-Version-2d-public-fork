/**
 * Sanitised wiring snippets — menus / bag / shop / storage / save.
 * Structure, order, values and state machines follow the source games
 * (FR first, then HG, then BW2, then other generations on disk).
 * Renamed to Mochiichao terms throughout; no swap-bucket strings appear
 * here: no creature species names, no franchise names, no logos, no
 * literal dialogue, no creature voices. Text shown to the player is
 * referenced by key only — the actual wording is Mars's call.
 * This file is staging, not wired into the game yet.
 */

// ---------- Constants: bag pockets and caps ----------
// FR: 5 pockets. HG: 8 pockets. BW2: 5 pockets + Free Space.
export const MOCHII_BAG_FR = {
  pockets: ['ITEMS', 'KEY_ITEMS', 'CAPTURE_DEVICES', 'MOVE_MACHINES', 'BERRIES'] as const,
  slots: [42, 30, 13, 58, 43] as const, // total 186
};
export const MOCHII_BAG_HG = {
  pockets: ['ITEMS', 'KEY_ITEMS', 'MOVE_MACHINES', 'MAIL', 'MEDICINE', 'BERRIES', 'CAPTURE_DEVICES', 'BATTLE_ITEMS'] as const,
  slots: [165, 50, 101, 12, 40, 64, 24, 30] as const, // total 486
  stackMax: 999,
  moveMachineStackMax: 99,
};
export const MOCHII_BAG_BW2 = {
  pockets: ['ITEMS', 'MEDICINE', 'MOVE_MACHINES', 'BERRIES', 'KEY_ITEMS', 'FREE_SPACE'] as const,
  slots: [310, 48, 109, 64, 83, 614] as const, // free space = sum of the other five
  stackMax: 999,
  moveMachineStackMax: 1,
  battlePockets: 4,
};

// ---------- Bag state: cursor + scroll remembered per pocket (FR/HG/BW2) ----------
export interface MochiiBagSlot { itemId: string; count: number; }
export interface MochiiBagPocketState { slots: MochiiBagSlot[]; cursor: number; scroll: number; }
export interface MochiiBagState {
  pockets: Record<string, MochiiBagPocketState>;
  openPocket: string;
  registeredItemId: string | null; // SELECT-registered key item, FR field use
}
export type MochiiBagContext =
  | 'FIELD' | 'PARTY_GIVE' | 'SHOP_SELL' | 'ITEM_TERMINAL' | 'BOX_GIVE' | 'BATTLE';
export type MochiiBagAction =
  | 'USE' | 'TOSS' | 'REGISTER' | 'GIVE' | 'CANCEL' | 'BATTLE_USE'
  | 'CHECK' | 'OPEN' | 'OPEN_BERRIES' | 'WALK' | 'DESELECT';
// Actions allowed per context follow the FR context table; battle use is
// filtered to the battle pockets, shop-sell goes to the sell quantity flow.

// ---------- Field menu: build order, FR first (HG adds gear row) ----------
export const MOCHII_FIELD_MENU_FR = [
  'CREATURE_INDEX', 'PARTY', 'BAG', 'PLAYER', 'SAVE', 'OPTIONS', 'EXIT',
] as const;
export const MOCHII_FIELD_MENU_CONTEXT_ROWS = {
  specialZoneOnly: ['RETIRE'],
  linkOnly: ['LINK_PLAYER'],
} as const;
// Print order: the context list is built first, then rows print in that
// order with one cursor; A runs the row callback, B closes to field.

// ---------- Title-adjacent main menu: window set chosen by save state (FR) ----------
export type MochiiMainMenuWindow = 'NEW_GAME_ONLY' | 'CONTINUE_AND_NEW' | 'CONTINUE_NEW_GIFT' | 'ERROR';
export function mochiiMainMenuWindow(hasSave: boolean, hasGift: boolean, saveError: boolean): MochiiMainMenuWindow {
  if (saveError) return 'ERROR';
  if (!hasSave) return 'NEW_GAME_ONLY';
  if (hasGift) return 'CONTINUE_NEW_GIFT';
  return 'CONTINUE_AND_NEW';
}

// ---------- Options: FR rows + value counts {3,2,2,2,3,10,0} ----------
export const MOCHII_OPTIONS = [
  { key: 'TEXT_SPEED', values: 3 },
  { key: 'BATTLE_SCENE', values: 2 },
  { key: 'BATTLE_STYLE', values: 2 },
  { key: 'SOUND', values: 2 },
  { key: 'BUTTON_MODE', values: 3 },
  { key: 'FRAME_TYPE', values: 10 },
  { key: 'CANCEL', values: 0 },
] as const;
// Left/right cycles the row's values; confirm saves the block and closes.

// ---------- Shop: Buy / Sell / Quit first, then list, quantity, confirm ----------
export type MochiiShopMode = 'MENU' | 'BUY_LIST' | 'SELL_LIST' | 'QUANTITY' | 'CONFIRM' | 'EXIT';
export type MochiiShopType = 'REGULAR' | 'MOVE_MACHINE' | 'DECOR' | 'DECOR_2'
  | 'SEAL' | 'PRIZE_EXCHANGE' | 'DATA_CARD' | 'BATTLE_POINT' | 'MOVE_TUTOR';
export interface MochiiShopItem { id: string; buyPrice: number; }
export const mochiiSellPrice = (buyPrice: number, quantity: number): number =>
  Math.floor(buyPrice / 2) * quantity; // FR sell rule, verified in source
export const MOCHII_SHOP_WINDOW = { left: 2, top: 1, width: 12, height: 6 }; // FR menu window
export const MOCHII_SHOP_LIST_MAX_BW2 = 45;
// Flow: MENU --Buy--> BUY_LIST --select--> QUANTITY --confirm--> BUY_LIST
//       MENU --Sell--> SELL_LIST (bag, sell context) --select--> QUANTITY --confirm--> SELL_LIST
//       MENU --Quit--> EXIT (callback back to field). Buy is blocked when
//       wallet < price or the bag pocket is full; both blocks return to list.

// ---------- Creature storage: boxes ----------
export const MOCHII_STORAGE = {
  fr: { boxes: 14, rows: 5, columns: 6, perBox: 30, total: 420, nameMax: 8, wallpapers: 17 },
  hg: { boxes: 18, perBox: 30, total: 540, nameMax: 20 },
  bw2: { boxesMax: 24, perBox: 30, total: 720, unlockSteps: [8, 16, 24], nameMax: 20 },
  partyMax: 6,
};
export type MochiiStorageMenu = 'WITHDRAW' | 'DEPOSIT' | 'MOVE_CREATURES' | 'MOVE_ITEMS' | 'EXIT';
// Deposit asks which box; withdraw is blocked at party 6; deposit is
// blocked when it would empty the party; release is blocked for eggs.
// Grab/place moves within a box and across boxes; multi-move moves a
// selection; a held item moves with its creature; a dirty box is flagged
// for save. Box cursor is remembered per box.
export interface MochiiBoxState { name: string; wallpaper: number; slots: (string | null)[]; dirty: boolean; }

// ---------- Item terminal + mailbox (FR player terminal) ----------
export const MOCHII_PLAYER_TERMINAL = ['ITEM_STORAGE', 'MAILBOX', 'TURN_OFF'] as const;
export const MOCHII_ITEM_TERMINAL = ['WITHDRAW_ITEM', 'DEPOSIT_ITEM', 'GO_BACK'] as const;
export const MOCHII_ITEM_TERMINAL_SLOTS = 30;
// Mailbox: read / move-to-bag (bag-full block) / delete; moving mail off
// a creature asks the message-lost confirm first.

// ---------- Save blocks: FR sector + block shape, adapted to a web payload ----------
// FR sector: 3968 data + 128 footer (id, checksum, signature, counter).
// 2 slots x 14 sectors; slot 1 = sectors 0-13, slot 2 = 14-27,
// hall-of-fame = 28-29, tower = 30-31. Sector 0 = block 2,
// sectors 1-4 = block 1, sectors 5-13 = storage. Writes rotate the
// start sector each save; damaged sectors are skipped and the
// last-known-good sector restored.
export const MOCHII_SAVE_SECTOR = {
  dataBytes: 3968, footerBytes: 128, sectorsPerSlot: 14, slots: 2, totalSectors: 32,
  signature: 0x08012025,
  layout: { block2: [0], block1: [1, 2, 3, 4], storage: [5, 6, 7, 8, 9, 10, 11, 12, 13] },
};
export interface MochiiSaveBlock1 {
  position: { x: number; y: number; mapId: string };
  party: string[]; // max 6
  money: number; coins: number; registeredItemId: string | null;
  itemTerminal: MochiiBagSlot[]; // max 30
  bag: MochiiBagState;
  flags: Record<string, boolean>; vars: Record<string, number>;
  gameStats: Record<string, number>; daycare: unknown; mail: unknown[];
}
export interface MochiiSaveBlock2 {
  options: Record<string, number>; // the C1-C7 values above
  playTimeSeconds: number; trainerName: string; trainerId: number;
}
export type MochiiSaveDialogStep = 'ASK' | 'CONFIRM_YES_NO' | 'SAVING' | 'SAVED' | 'ERROR';
// Load: validate signature + checksum, pick the newer valid slot,
// fall back to the backup slot, restore the continue warp.
export type MochiiSaveStatus = 'EMPTY' | 'OK' | 'INVALID' | 'NO_STORAGE' | 'ERROR';
