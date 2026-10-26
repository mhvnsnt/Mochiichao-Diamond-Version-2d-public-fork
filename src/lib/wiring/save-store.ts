/**
 * Mochiichao save store — idb (ISC) over IndexedDB, versioned.
 * Pokemon's save is one fixed slot with no export. This store is
 * versioned (v1), keeps a backup slot, and exports/imports as JSON,
 * so a bad PR cannot blank a five-region save. Migration: an old
 * localStorage save, if present, is imported once and never
 * overwritten by the migration itself.
 */
import { openDB, type IDBPDatabase } from "idb";

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
