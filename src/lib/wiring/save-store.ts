/**
 * Mochiichao save store — idb (ISC) over IndexedDB, versioned.
 * Pokemon's save is one fixed slot with no export. This store is
 * versioned (v1), keeps a backup slot, and exports/imports as JSON,
 * so a bad PR cannot blank a five-region save. Migration: an old
 * localStorage save, if present, is imported once and never
 * overwritten by the migration itself.
 */
import { openDB, type IDBPDatabase } from "idb";
import { create } from "zustand";

export const SAVE_VERSION = 1;
const DB = "mochiichao-save";
const STORE = "saves";

export type SaveRecord = {
  slot: string;
  version: number;
  updatedAt: number;
  data: unknown;
};

let dbPromise: Promise<IDBPDatabase> | null = null;
function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB, SAVE_VERSION, {
      upgrade(d) {
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: "slot" });
      },
    });
  }
  return dbPromise;
}

export async function writeSave(slot: string, data: unknown): Promise<SaveRecord> {
  const record: SaveRecord = { slot, version: SAVE_VERSION, updatedAt: Date.now(), data };
  const d = await db();
  await d.put(STORE, record);
  // Backup slot: the previous good save, kept under slot + ":backup".
  await d.put(STORE, { ...record, slot: `${slot}:backup` });
  return record;
}

export async function readSave(slot: string): Promise<SaveRecord | undefined> {
  return (await db()).get(STORE, slot);
}

export async function exportSave(slot: string): Promise<string | null> {
  const record = await readSave(slot);
  return record ? JSON.stringify(record) : null;
}

export async function importSave(json: string): Promise<SaveRecord> {
  const parsed = JSON.parse(json) as SaveRecord;
  if (parsed.version !== SAVE_VERSION) {
    throw new Error(`Save version ${parsed.version} is not supported (expected ${SAVE_VERSION})`);
  }
  const d = await db();
  await d.put(STORE, parsed);
  return parsed;
}

/** One-shot legacy migration. Returns true only if a legacy save
 *  was found and imported; never deletes the legacy key itself. */
export async function migrateLegacySave(legacyKey: string): Promise<boolean> {
  if (typeof localStorage === "undefined") return false;
  const raw = localStorage.getItem(legacyKey);
  if (!raw) return false;
  try {
    await importSave(raw);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2026-10-27 wiring (saves lane, additions only — everything above untouched):
// the live game save path (src/lib/saveSystem.ts) is localStorage-only and
// synchronous, so this file on its own did not change what the game
// persists, and migrateLegacySave above cannot read that path's real
// format (a JSON array of SaveEntry objects per slot, not a SaveRecord).
// The additions below close both gaps without touching the old path:
// a Zustand store over the IndexedDB functions, and a migration that
// understands the real saveSystem format. Nothing here deletes or
// overwrites a localStorage key; the old path stays authoritative until
// a caller explicitly adopts the IndexedDB store.
// ---------------------------------------------------------------------------

/** IndexedDB slot key for one saveSystem slot (shared with saveSystem.ts). */
export const idbSlotKey = (slotId: number): string => `slot:${slotId}`;

/** All IndexedDB save records, newest first. Backup slots included. */
export async function readAllSaves(): Promise<SaveRecord[]> {
  const records = await (await db()).getAll(STORE);
  return records.sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Every slot key currently in IndexedDB (including ":backup" keys). */
export async function listSaveSlots(): Promise<string[]> {
  // Keys are strings (keyPath "slot" is always a string here); the
  // idb wrapper types keys as IDBValidKey, so narrow explicitly.
  return (await db()).getAllKeys(STORE) as unknown as string[];
}

/**
 * Migrate the REAL saveSystem localStorage format into IndexedDB.
 * saveSystem keeps, per slot 1-3, a JSON array of SaveEntry objects
 * under `mochii_saves_<slotId>`, plus the autosave hold under
 * `mochii_autosave_hold`. Each non-empty slot array is written as one
 * IndexedDB record under `slot:<slotId>` (which also writes its
 * `:backup` twin via writeSave). Returns the slots migrated and the
 * hold slot, if any. NEVER deletes a localStorage key — re-running
 * this is safe, and localStorage loads keep working either way.
 */
export async function migrateLegacySaveSystem(): Promise<{
  migratedSlots: number[];
  holdSlot: number | null;
}> {
  const migratedSlots: number[] = [];
  if (typeof localStorage !== "undefined") {
    for (const slotId of [1, 2, 3]) {
      try {
        const raw = localStorage.getItem(`mochii_saves_${slotId}`);
        if (!raw) continue;
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) continue;
        await writeSave(idbSlotKey(slotId), parsed);
        migratedSlots.push(slotId);
      } catch {
        // A corrupt slot is skipped, never deleted; other slots continue.
      }
    }
  }
  let holdSlot: number | null = null;
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("mochii_autosave_hold");
      const n = raw === null ? NaN : Number(raw);
      if (Number.isFinite(n) && n >= 1 && n <= 3) {
        holdSlot = n;
        await writeSave("autosave-hold", { slotId: n });
      }
    }
  } catch {
    holdSlot = null;
  }
  return { migratedSlots, holdSlot };
}

export type SaveStoreStatus = "idle" | "loading" | "ready" | "error";

export type SaveStoreState = {
  status: SaveStoreStatus;
  error: string | null;
  /** Currently loaded IndexedDB slot key (e.g. "slot:1"), if any. */
  slot: string | null;
  current: SaveRecord | null;
  /** Load one IndexedDB record into the store (no localStorage read). */
  load: (slot: string) => Promise<void>;
  /** Persist data to IndexedDB under slot and reflect it in the store. */
  save: (slot: string, data: unknown) => Promise<void>;
  /** JSON-export the currently loaded record, or null if none loaded. */
  exportCurrent: () => Promise<string | null>;
  /** Import a SaveRecord JSON string into IndexedDB and the store. */
  importJson: (json: string) => Promise<void>;
  /**
   * Run the real-format localStorage migration (see
   * migrateLegacySaveSystem) and then load the first migrated slot.
   */
  migrateFromLocalStorage: () => Promise<{
    migratedSlots: number[];
    holdSlot: number | null;
  }>;
};

/**
 * Zustand store over IndexedDB saves. This is a NEW store, separate
 * from the game's main Zustand store (src/store/gameStore.ts, untouched):
 * it owns persistence state only, so adopting it never rewrites game
 * state handling. All actions are async and best-effort in the sense
 * that a failure sets status "error" with a message instead of throwing
 * into a caller — except importJson (rethrows the version error from
 * importSave so a bad import is never silently accepted) and
 * migrateFromLocalStorage (rethrows a top-level migration failure).
 */
export const useSaveStore = create<SaveStoreState>((set, get) => ({
  status: "idle",
  error: null,
  slot: null,
  current: null,
  load: async (slot) => {
    set({ status: "loading", error: null });
    try {
      const record = await readSave(slot);
      set({ status: "ready", slot, current: record ?? null });
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
    }
  },
  save: async (slot, data) => {
    set({ status: "loading", error: null });
    try {
      const record = await writeSave(slot, data);
      set({ status: "ready", slot, current: record });
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
    }
  },
  exportCurrent: async () => {
    const { current } = get();
    return current ? JSON.stringify(current) : null;
  },
  importJson: async (json) => {
    set({ status: "loading", error: null });
    const record = await importSave(json);
    set({ status: "ready", slot: record.slot, current: record });
  },
  migrateFromLocalStorage: async () => {
    set({ status: "loading", error: null });
    try {
      const result = await migrateLegacySaveSystem();
      const first = result.migratedSlots[0];
      if (first !== undefined) {
        const record = await readSave(idbSlotKey(first));
        set({ status: "ready", slot: idbSlotKey(first), current: record ?? null });
      } else {
        set({ status: "ready" });
      }
      return result;
    } catch (e) {
      set({ status: "error", error: e instanceof Error ? e.message : String(e) });
      throw e;
    }
  },
}));
