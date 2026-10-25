import { create } from 'zustand';
import { MochiiInstance } from '../lib/types';
import { createMochii } from '../lib/engine';

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
  currentMap: 'sector0',
  playerPos: { x: 21, y: 14 },
  cheated: false,
  shiny: false,
  noclip: false,
  fastForward: false,
  setCheatFlags: (flags) => set(flags),

  setPlayerInfo: (name, gender, slot) => set({ playerName: name, playerGender: gender, saveSlot: slot }),
  setRivalName: (name) => set({ rivalName: name }),
  loadState: (state) => set({ ...state, introCompleted: true, rivalName: (state as any).rivalName || 'Hex' }),
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
