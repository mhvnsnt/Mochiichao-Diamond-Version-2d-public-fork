// 2026-10-27 wiring (saves lane, additions only): IndexedDB mirror.
// The synchronous localStorage API below is unchanged and stays the
// authoritative game path. The mirror below writes the same slot data
// to the IndexedDB store in src/lib/wiring/save-store.ts (Zustand +
// IndexedDB) as a best-effort, fire-and-forget copy, so a future
// caller can adopt IndexedDB without any existing save being orphaned
// or any localStorage key being deleted.
import { writeSave as writeSaveToIndexedDB, readSave as readSaveFromIndexedDB, idbSlotKey } from "./wiring/save-store";

export interface SaveEntry {
  id: string;
  slotId: number;
  timestamp: number;
  type: 'manual' | 'auto';
  label: string;
  data: any; // Serialized GameState
}

export const getSaves = (slotId: number): SaveEntry[] => {
  try {
    const saves = localStorage.getItem(`mochii_saves_${slotId}`);
    return saves ? JSON.parse(saves) : [];
  } catch(e) {
    return [];
  }
};

// Playtest 2026-10-26 (attempt 7, PR #128 re-test): the START OVER
// autosave hold lived only in WorldEngine's effect guards, so any
// autosave that fired outside those guards — and, critically, the
// map-change effect firing on world entry right after a LOAD —
// still wrote the slot. A world-entry autosave writes the loaded
// state back with a fresh timestamp, so the slot summary's content
// looked held while its timestamp advanced; and a load-then-enter
// autosave after a manual save would write the OLD loaded content
// over the manual save's summary, matching the revert the playtest
// saw. The hold therefore lives HERE, in the one function every save
// goes through: an 'auto' write to a held slot is refused outright
// (no entry, no timestamp change), while 'manual' writes always
// pass. The store keeps the hold in sync via setAutosaveHold.
// Playtest 2026-10-26 (attempt 8, PR #132 re-test): the hold above
// was memory-only, and Quit to Title does window.location.reload(),
// which wipes module state. Any auto-write after a reload — a
// re-entered world, a restored tab, a second tab — therefore saw
// hold = null and stamped a fresh timestamp onto the held slot's
// old content (content held, timestamp advanced, exactly the
// symptom observed). The hold is therefore PERSISTED in
// localStorage and restored on import, so it survives reloads and
// is honoured by every tab/session. It is cleared only by an
// explicit manual save or an explicit load (both call
// setAutosaveHold(null) via the store), never by time passing,
// navigation, or a reload.
const AUTOSAVE_HOLD_KEY = 'mochii_autosave_hold';
const readPersistedHold = (): number | null => {
  try {
    const raw = localStorage.getItem(AUTOSAVE_HOLD_KEY);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 && n <= 3 ? n : null;
  } catch { return null; }
};
let autosaveHoldSlot: number | null = readPersistedHold();
export const getAutosaveHold = (): number | null => autosaveHoldSlot ?? readPersistedHold();
export const setAutosaveHold = (slot: number | null) => {
  autosaveHoldSlot = slot;
  try {
    if (slot === null) localStorage.removeItem(AUTOSAVE_HOLD_KEY);
    else localStorage.setItem(AUTOSAVE_HOLD_KEY, String(slot));
  } catch { /* private mode: in-memory hold still applies this session */ }
};

// Playtest 2026-10-26 (attempt 9, PR #132 re-test): a second slots
// view showed a fresh timestamp on unchanged content, and the
// manual-save case has NO hold (a manual save clears it), so the
// PR #132/PR #133 hold cannot explain or close it. A full write-path
// trace found no slots-view writer at all — the only mochii_saves_*
// writers are WorldEngine (60s interval, map change, F5), GameShell
// Pause Save, and SaveMenu Create New Save. The stamp therefore
// comes from a WorldEngine autosave firing after a load/re-entry
// (or a world visit between slots views) while the game state was
// unchanged since the last save: the autosave re-serializes the
// loaded state and stamps a fresh timestamp onto identical content.
// An autosave whose content is identical to the slot's latest entry
// is therefore refused outright (same as a held autosave): it can
// only ever move the summary timestamp, never the content. Manual
// saves are never deduped — an explicit save always writes.
// Comparison uses sorted keys, so a load round-trip (which may
// reorder object keys) does not defeat it; functions/undefined are
// skipped exactly as JSON.stringify skips them at save time.
const stableStringify = (value: any): string | null => {
  try {
    if (value === null || typeof value !== 'object') {
      const prim = JSON.stringify(value);
      return prim === undefined ? null : prim;
    }
    if (Array.isArray(value)) {
      const parts = value.map(v => {
        if (typeof v === 'function' || typeof v === 'symbol' || v === undefined) return 'null';
        const s = stableStringify(v);
        return s === null ? 'null' : s;
      });
      return `[${parts.join(',')}]`;
    }
    const keys = Object.keys(value).sort().filter(k => {
      const v = value[k];
      return typeof v !== 'function' && typeof v !== 'symbol' && v !== undefined;
    });
    const parts = keys.map(k => `${JSON.stringify(k)}:${stableStringify(value[k]) ?? 'null'}`);
    return `{${parts.join(',')}}`;
  } catch { return null; }
};

export const saveGame = (slotId: number, type: 'manual' | 'auto', label: string, gameState: any): SaveEntry | null => {
  if (type === 'auto' && getAutosaveHold() === slotId) return null;
  if (type === 'auto') {
    const existing = getSaves(slotId);
    const latest = existing.length > 0
      ? existing.reduce((a, b) => (b.timestamp > a.timestamp ? b : a))
      : null;
    if (latest && latest.data !== undefined && latest.data !== null) {
      const next = stableStringify(gameState);
      const prev = stableStringify(latest.data);
      if (next !== null && prev !== null && next === prev) return null;
    }
  }
  const saves = getSaves(slotId);
  const newSave: SaveEntry = {
    id: crypto.randomUUID(),
    slotId,
    timestamp: Date.now(),
    type,
    label,
    data: gameState
  };

  let updatedSaves = [newSave, ...saves];
  
  if (type === 'auto') {
    // Keep only the newest autosave
    const autosaves = updatedSaves.filter(s => s.type === 'auto');
    if (autosaves.length > 1) {
       updatedSaves = updatedSaves.filter(s => s.id !== autosaves[autosaves.length - 1].id);
    }
  } else {
    // Keep up to 8 manual saves
    const manuals = updatedSaves.filter(s => s.type === 'manual');
    if (manuals.length > 8) {
       updatedSaves = updatedSaves.filter(s => s.id !== manuals[manuals.length - 1].id);
    }
  }

  localStorage.setItem(`mochii_saves_${slotId}`, JSON.stringify(updatedSaves));
  // Best-effort IndexedDB mirror: never blocks or throws into the
  // synchronous save path (a missing/blocked IndexedDB just skips).
  void syncSavesToIndexedDB(slotId);
  return newSave;
};

/**
 * Copy one slot's current localStorage entries to IndexedDB under
 * `slot:<slotId>` (see idbSlotKey in save-store.ts). Returns false —
 * never throws — when IndexedDB is unavailable or the write fails.
 * The localStorage copy is left untouched.
 */
export const syncSavesToIndexedDB = async (slotId: number): Promise<boolean> => {
  try {
    if (typeof indexedDB === "undefined") return false;
    const saves = getSaves(slotId);
    await writeSaveToIndexedDB(idbSlotKey(slotId), saves);
    return true;
  } catch { return false; }
};

/**
 * Backward-compatible IndexedDB load: if a slot's localStorage is
 * empty but IndexedDB holds a record for it (written by the mirror or
 * by migrateLegacySaveSystem), restore that record into localStorage
 * and return true. If localStorage already has entries, they ALWAYS
 * win and nothing is overwritten — returns false. Never deletes
 * either copy.
 */
export const restoreSavesFromIndexedDB = async (slotId: number): Promise<boolean> => {
  try {
    if (typeof indexedDB === "undefined") return false;
    if (getSaves(slotId).length > 0) return false;
    const record = await readSaveFromIndexedDB(idbSlotKey(slotId));
    if (!record || !Array.isArray(record.data)) return false;
    localStorage.setItem(`mochii_saves_${slotId}`, JSON.stringify(record.data));
    return true;
  } catch { return false; }
};

export const loadGame = (saveEntry: SaveEntry, loadZustandState: (state: any) => void) => {
  loadZustandState(saveEntry.data);
};

export const getSlotSummaries = () => {
  return [1, 2, 3].map(slotId => {
    const saves = getSaves(slotId);
    if (saves.length === 0) return null;
    const latest = saves.map(s => s).sort((a,b) => b.timestamp - a.timestamp)[0];
    return {
      slotId,
      player: latest.data.playerName || "Netrunner",
      map: latest.data.currentMap,
      hms: latest.data.badges.length, // using badges as an indicator
      timestamp: latest.timestamp
    };
  });
};
