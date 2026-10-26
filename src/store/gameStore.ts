import { create } from 'zustand';
import { MochiiInstance } from '../lib/types';
import { createMochii } from '../lib/engine';
import type { GardenCreature } from '../lib/mochiichao-systems';
import type { DaycareEgg } from '../lib/creatureDaycare';
import type { GuardianAssignment } from '../lib/monster-tamer-systems';
import { GameSettings, DEFAULT_SETTINGS, loadStoredSettings, persistSettings } from '../lib/gameSettings';
import { setAutosaveHold, getAutosaveHold } from '../lib/saveSystem';
import { applyFontRoles } from '../lib/fonts';
import { applySoundMode } from '../lib/audioRouting';

interface GameState {
  playerName: string;
  playerGender: 'boy' | 'girl';
  /** Rival name, v4: default "Hex" (canon). Set in the rival-name phase. */
  rivalName: string;
  saveSlot: number;
  introCompleted: boolean;
  party: MochiiInstance[];
  pc: MochiiInstance[];
  wallet: number;
  inventory: { [key: string]: number };
  badges: string[];
  dex: Record<string, string>; // 'seen' | 'caught'
  completedEvents: string[];
  defeatedTrainers: string[];
  
  // Settings (title/press/settings wiring, 2026-10-25): persisted both
  // in localStorage (loadStoredSettings) and, because SaveMenu /
  // GameShell serialize the whole state, inside every save. Changing
  // settings never erases a save.
  settings: GameSettings;
  setSettings: (patch: Partial<GameSettings>) => void;

  // Creature Mode / Garden shared state (pass 3): Garden records used
  // to live only in GardenView's local state, so Creature Mode could not
  // read the +9% Garden bonus and a Guardian assignment vanished on
  // leaving the screen. Both now live in the shared store, so SaveMenu
  // (which serializes the whole state) saves and loads them with the game.
  gardenRecords: Record<string, GardenCreature>;
  setGardenRecord: (creatureId: string, record: GardenCreature) => void;
  guardian: GuardianAssignment | null;
  setGuardian: (guardian: GuardianAssignment | null) => void;
  // Preserved from Chao Garden PR #225 (live main): Garden minutes.
  gardenMinutes: number;
  setGardenMinutes: (minutes: number) => void;
  // Creature Mode Pass 7 — Daycare steps: persisted tile steps taken
  // in Creature Mode while a Guardian is assigned (deposited).
  // FireRed daycare.c: steps accumulate for deposited creatures
  // while the player walks; EXP and cost are computed on retrieve,
  // never guessed mid-walk. SaveMenu serializes the whole store,
  // so these steps persist with saves like gardenRecords/guardian.
  daycareSteps: number;
  setDaycareSteps: (steps: number) => void;
  // Creature Mode Pass 8 — second deposit slot (Partner) + egg.
  // Partner is the same GuardianAssignment shape as guardian;
  // egg is null until a 256-step egg roll passes (see creatureDaycare).
  daycarePartner: GuardianAssignment | null;
  setDaycarePartner: (partner: GuardianAssignment | null) => void;
  daycareEgg: DaycareEgg | null;
  setDaycareEgg: (egg: DaycareEgg | null) => void;

  // Overworld state
  currentMap: string;
  playerPos: { x: number, y: number };

  // Cheat / debug state (pass 1, cheat-console-spec: native allowlist only).
  // cheated is set by ANY cheat code and is saved with the game.
  cheated: boolean;
  shiny: boolean;
  noclip: boolean;
  fastForward: boolean;
  setCheatFlags: (flags: Partial<{ cheated: boolean; shiny: boolean; noclip: boolean; fastForward: boolean }>) => void;

  // Playtest 2026-10-26 (attempt 6): a START OVER run autosaved over
  // its occupied slot on world entry / map change, even though the
  // START OVER dialogs promise the old save is replaced only when
  // the player later saves over the slot. When this holds a slot
  // number, WorldEngine autosaves into that slot are skipped until
  // the player makes an explicit manual save, which clears the hold.
  // Loading a save also clears it (that run is established).
  autosaveHeldForSlot: number | null;
  setAutosaveHeldForSlot: (slot: number | null) => void;

  // Actions
  setPlayerInfo: (name: string, gender: 'boy' | 'girl', slot: number) => void;
  setRivalName: (name: string) => void;
  loadState: (state: Partial<GameState>) => void;
  initializeStarter: (speciesId: string) => void;
  completeIntro: () => void;
  healParty: () => void;
  addMochii: (mochii: MochiiInstance) => void;
  gainWallet: (amount: number) => void;
  buyItem: (itemId: string, cost: number) => boolean;
  useItem: (itemId: string) => boolean;
  updatePartyMember: (index: number, updated: MochiiInstance) => void;
  addBadge: (badge: string) => void;
  updateDex: (id: string, status: 'seen' | 'caught') => void;
  completeEvent: (id: string) => void;
  defeatTrainer: (id: string) => void;
  setMapState: (mapId: string, pos: { x: number, y: number }) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: "Netrunner",
  playerGender: "boy",
  rivalName: "Hex",
  saveSlot: 1,
  introCompleted: false,
  party: [],
  pc: [],
  wallet: 1000,
  inventory: {
    'luigi_cube': 10,
    'mend_patch': 5
  },
  badges: [],
  dex: {},
  completedEvents: [],
  defeatedTrainers: [],
  gardenRecords: {},
  setGardenRecord: (creatureId, record) => set(s => ({ gardenRecords: { ...s.gardenRecords, [creatureId]: record } })),
  guardian: null,
  setGuardian: (guardian) => set({ guardian }),
  gardenMinutes: 0,
  setGardenMinutes: (minutes) => set({ gardenMinutes: minutes }),
  daycareSteps: 0,
  setDaycareSteps: (steps) => set({ daycareSteps: steps }),
  daycarePartner: null,
  setDaycarePartner: (partner) => set({ daycarePartner: partner }),
  daycareEgg: null,
  setDaycareEgg: (egg) => set({ daycareEgg: egg }),
  currentMap: 'sector0',
  playerPos: { x: 21, y: 14 },
  settings: loadStoredSettings(),
  setSettings: (patch) => set(s => {
    const next = { ...s.settings, ...patch };
    persistSettings(next);
    applyFontRoles(next);
    // SOUND routing: the stored mode is applied to the Web Audio
    // graph on every settings change, not just in SettingsScreen.
    applySoundMode(next.sound);
    return { settings: next };
  }),
  cheated: false,
  shiny: false,
  noclip: false,
  fastForward: false,
  setCheatFlags: (flags) => set(flags),

  // Restored from the persisted hold (saveSystem), so a START OVER
  // hold survives Quit-to-Title reloads instead of silently
  // vanishing with module state (attempt 8 timestamp-stamp bug).
  autosaveHeldForSlot: getAutosaveHold(),
  setAutosaveHeldForSlot: (slot) => { setAutosaveHold(slot); set({ autosaveHeldForSlot: slot }); },

  setPlayerInfo: (name, gender, slot) => set({ playerName: name, playerGender: gender, saveSlot: slot }),
  setRivalName: (name) => set({ rivalName: name }),
  loadState: (state) => {
    // Playtest 2026-10-26 (live Pages, step 4): a font row changed in
    // Settings and saved to localStorage was lost after loading an
    // older save, because the old save's settings overwrote the newer
    // localStorage settings and were then persisted back. Settings
    // the player chose most recently win: the store's current settings
    // already came from localStorage at boot, or from a later Settings
    // save in this session, so they are newer than any save written
    // before that change. Only when the current settings are still
    // exactly the defaults (no stored choice, no in-session change)
    // does the save's own settings win, so a save carried to a fresh
    // install still brings its settings with it. The merged result is
    // persisted, so the next save written over this slot converges.
    const savedSettings = ((state as any).settings || {}) as Partial<GameSettings>;
    const currentSettings = get().settings;
    const currentIsDefault = (Object.keys(DEFAULT_SETTINGS) as (keyof GameSettings)[])
      .every(k => (currentSettings as any)[k] === (DEFAULT_SETTINGS as any)[k]);
    const nextSettings: GameSettings = currentIsDefault
      ? { ...DEFAULT_SETTINGS, ...savedSettings }
      : { ...DEFAULT_SETTINGS, ...savedSettings, ...currentSettings };
    persistSettings(nextSettings);
    applyFontRoles(nextSettings);
    applySoundMode(nextSettings.sound);
    setAutosaveHold(null);
    set({ ...state, settings: nextSettings, introCompleted: true, rivalName: (state as any).rivalName || 'Hex', autosaveHeldForSlot: null });
  },
  completeIntro: () => set({ introCompleted: true }),
  
  initializeStarter: (speciesId) => {
    const starter = createMochii(speciesId, 5);
    if (starter) {
      set(state => ({ 
        party: [starter], 
        dex: { [speciesId]: 'caught' },
        inventory: { ...state.inventory, 'luigi_cube': (state.inventory['luigi_cube'] || 0) + 5 }
      }));
    }
  },

  healParty: () => {
    // v5.1 HP sync: heal writes BOTH hp and currentHp. Before
    // v5.1 it wrote hp only, so a healed party would still enter
    // its next battle at the old damaged currentHp.
    set(state => ({
      party: state.party.map(m => ({ ...m, hp: m.maxHp, currentHp: m.maxHp, status: null }))
    }));
  },

  addMochii: (mochii) => {
    const { party, pc } = get();
    set(s => ({ dex: { ...s.dex, [mochii.speciesId]: 'caught' } }));
    if (party.length < 6) {
      set({ party: [...party, mochii] });
    } else {
      set({ pc: [...pc, mochii] });
    }
  },

  gainWallet: (amount) => set(s => ({ wallet: s.wallet + amount })),

  buyItem: (itemId, cost) => {
    const state = get();
    if (state.wallet >= cost) {
      set(s => ({
        wallet: s.wallet - cost,
        inventory: { ...s.inventory, [itemId]: (s.inventory[itemId] || 0) + 1 }
      }));
      return true;
    }
    return false;
  },

  useItem: (itemId) => {
    const state = get();
    if (state.inventory[itemId] > 0) {
      set(s => ({
        inventory: { ...s.inventory, [itemId]: s.inventory[itemId] - 1 }
      }));
      return true;
    }
    return false;
  },

  updatePartyMember: (index, updated) => {
    set(s => {
      const newParty = [...s.party];
      newParty[index] = updated;
      return { party: newParty };
    });
  },

  addBadge: (badge) => set(s => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),
  updateDex: (id, status) => set(s => ({ dex: { ...s.dex, [id]: s.dex[id] === 'caught' ? 'caught' : status } })),
  completeEvent: (id) => set(s => ({ completedEvents: [...s.completedEvents, id] })),
  defeatTrainer: (id) => set(s => ({ defeatedTrainers: [...s.defeatedTrainers, id] })),
  setMapState: (mapId, pos) => set({ currentMap: mapId, playerPos: pos })
}));
