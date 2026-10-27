/**
 * Uncapped storage — STAGED ONLY, imported nowhere yet.
 * No PR, no merge, no game-tree edits.
 *
 * Mars decision 2026-10-27 ~07:46 CDT: Black 2 is canonical for
 * bag/storage structure, WITH ALL CAPS REMOVED — unlimited box
 * count, unlimited total PC storage, item stacks above 99, PC
 * above 100 creatures. Keep the Black 2 pockets / slots-per-box
 * structure (30 per box) with the count unbounded. Do NOT wire
 * the source caps (24 boxes, 720 total, 999 stack, per-pocket
 * slot maxima) as limits.
 *
 * Source caps (for the record only — never used as limits here):
 * - pokebw2/include/save/box.h: BOX_MAX_TRAY 24, BOX_MAX_POS 30,
 *   boxes open 8 at a time (box_savedata.c: BOX_START_TRAY 8,
 *   BOX_UNLOCK_TRAY 8), so source total = 24 x 30 = 720.
 * - pokebw2/include/save/bag.h: BAG_ITEM_COUNT_MAX 999 (general
 *   stack), BAG_TM_HM_COUNT_MAX 1; per-pocket slot maxima
 *   items 310, key items 83, move-machines 109, medicine 48,
 *   berries 64, Free Space = sum = 614.
 * - pokebw2/include/constants/bag.h: pocket order items,
 *   medicine, move-machines, berries, key items, Free Space.
 *
 * What is already uncapped on current main (7f116702, verified
 * via the GitHub API helper, NOT assumed):
 * - gameStore.buyItem increments the inventory record with no
 *   cap check, and useItem only checks count > 0. Stacks are
 *   already unbounded in the store; there is no 99 or 999
 *   literal to remove there.
 * - gameStore.pc is a flat list and PcView computes
 *   boxCount = max(1, ceil(pc.length / 30)) dynamically. There
 *   is no 24-box or 720-total literal in PcView or the store.
 * This module therefore does NOT claim to "remove" caps that
 * are not present on main. It gives the PR worker a single
 * typed source of truth so a future wiring cannot reintroduce
 * the source caps by copying the Black 2 constants verbatim,
 * and it supplies the pure helpers the staged PcView/ShopView
 * patches use.
 */

export const SLOTS_PER_BOX = 30;

/** No maximum box count. `null` is the type-level statement. */
export const MAX_BOX_COUNT: null = null;
/** No maximum total PC creatures. */
export const MAX_PC_TOTAL: null = null;
/** No maximum item stack. Stacks above 99, above 999, unbounded. */
export const MAX_ITEM_STACK: null = null;
/** No maximum distinct items per pocket. Pockets grow as arrays. */
export const MAX_POCKET_SLOTS: null = null;

/** Party size is NOT a PC/bag cap and is NOT changed here. */
export const PARTY_MAX = 6;

/** Canonical Black 2 pocket order, kept as structure only. */
export type BagPocket =
  | 'items'
  | 'medicine'
  | 'move-machines'
  | 'berries'
  | 'key-items'
  | 'free-space';

export const BAG_POCKETS: readonly BagPocket[] = [
  'items',
  'medicine',
  'move-machines',
  'berries',
  'key-items',
  'free-space',
];

/** Source slot maxima, recorded for audit only. Never enforce. */
export const SOURCE_POCKET_SLOT_MAXIMA: Readonly<Record<BagPocket, number>> = {
  items: 310,
  medicine: 48,
  'move-machines': 109,
  berries: 64,
  'key-items': 83,
  'free-space': 614,
};

/** Source stack maxima, recorded for audit only. Never enforce. */
export const SOURCE_STACK_MAXIMA = {
  general: 999,
  moveMachine: 1,
} as const;

/**
 * How many boxes exist for `pcLength` creatures. Unbounded by
 * construction: it is a ceiling division with no clamp. This is
 * outcome-identical to current main PcView (same formula), but
 * sourced from this module so the cap decision lives in one place.
 */
export function uncappedBoxCount(pcLength: number): number {
  return Math.max(1, Math.ceil(Math.max(0, pcLength) / SLOTS_PER_BOX));
}

/** Creatures in box `boxIndex` (0-based) of a flat PC list. */
export function boxSlice<T>(pc: readonly T[], boxIndex: number): T[] {
  const start = Math.max(0, boxIndex) * SLOTS_PER_BOX;
  return pc.slice(start, start + SLOTS_PER_BOX);
}

/**
 * Add `qty` of an item to an inventory record. No cap, no
 * truncation: the returned count is exactly old + qty.
 * (Current main buyItem adds 1 with the same no-cap shape.)
 */
export function addToStack(
  inventory: Readonly<Record<string, number>>,
  itemId: string,
  qty: number,
): Record<string, number> {
  return { ...inventory, [itemId]: (inventory[itemId] || 0) + qty };
}

/**
 * SAVE-SHAPE CONSEQUENCES — read before any PR worker applies this.
 * 1. Current main save is whole-state JSON (saveSystem.ts: slot
 *    records holding the store state). Uncapped lists grow that
 *    JSON linearly; there is no block/sector shape on main to
 *    overflow, so no main save migration is needed for the
 *    uncapped lists themselves. Old saves load unchanged
 *    (shorter lists are still valid inputs to uncappedBoxCount).
 * 2. A future port back to Black 2 fixed save blocks WOULD
 *    break: 24 fixed box blocks x 30 slots cannot hold an
 *    unbounded list, and the fixed pocket arrays cannot hold
 *    unbounded pockets. Such a port needs an extended save
 *    format or a documented truncation rule — it must NOT
 *    silently drop creatures/items. This module changes no
 *    save shape by itself; it only refuses to enforce caps.
 * 3. Per-box wallpaper (see wallpaperCatalogue.ts) IS a save
 *    addition: main has no per-box wallpaper field. The staged
 *    patch stores it as an OPTIONAL record
 *    `pcWallpapers: Record<number, string>` (box index -> id),
 *    defaulting to the preset default when absent. Old saves
 *    without it stay valid. The uploaded-image bytes themselves
 *    must NEVER be put in the save JSON (see the upload spec).
 * 4. NOT removed by this module, flagged separately:
 *    - Party cap 6 (PARTY_MAX above): a party rule, not a
 *      storage cap; the staged PcView patch keeps the
 *      withdraw guard at 6.
 *    - ITEM_TERMINAL_CAP 30 in main playableWiring.ts: the
 *      item-terminal system, not bag/PC storage; no decision
 *      in this task covers it, so it is left untouched and
 *      named here rather than silently lifted.
 *    - Box name lengths (gen3: 8, gen4/gen5: 20): name-length
 *      limits, not count caps; unchanged.
 *    - Move-machine stack 1 in source: a per-item semantic
 *      (one copy per machine slot in source), not a bag stack
 *      cap. The uncapped rule covers general stacks; a
 *      machine-duplication rule, if ever wanted, needs its
 *      own decision and is NOT assumed here.
 */
export const UNCAPPED_STORAGE_SAVE_NOTES: readonly string[] = [
  'main-save-json-grows-linearly-no-migration-needed',
  'black2-fixed-blocks-would-overflow-needs-extended-format-or-documented-rule',
  'pc-wallpapers-additive-optional-record-default-when-absent',
  'uploaded-image-bytes-never-in-save-json',
  'party-6-and-item-terminal-30-not-removed-by-this-module',
];
