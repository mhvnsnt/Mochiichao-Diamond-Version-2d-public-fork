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
let autosaveHoldSlot: number | null = null;
export const setAutosaveHold = (slot: number | null) => { autosaveHoldSlot = slot; };

export const saveGame = (slotId: number, type: 'manual' | 'auto', label: string, gameState: any): SaveEntry | null => {
  if (type === 'auto' && autosaveHoldSlot === slotId) return null;
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
  return newSave;
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
