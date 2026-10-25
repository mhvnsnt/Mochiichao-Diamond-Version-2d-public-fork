import React from 'react';
import { useGameStore } from '../../store/gameStore';
import CreaturePortrait from '../game/CreaturePortrait';
import { SPECIES_DB } from '../../lib/species';

/**
 * PC storage — declared in the old App (ViewState 'PC') but never
 * rendered. Now rendered: party + PC list, with move-to-party /
 * move-to-PC buttons. Simple at first, by design; storage structure
 * (party max 6, overflow to PC) is the existing store rule.
 */
export default function PcView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const pc = useGameStore(s => s.pc);

  const moveToParty = (id: string) => {
    if (party.length >= 6) return;
    const m = pc.find(x => x.id === id);
    if (!m) return;
    useGameStore.setState(s => ({ pc: s.pc.filter(x => x.id !== id), party: [...s.party, m] }));
  };
  const moveToPc = (id: string) => {
    const m = party.find(x => x.id === id);
    if (!m) return;
    useGameStore.setState(s => ({ party: s.party.filter(x => x.id !== id), pc: [...s.pc, m] }));
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">PC Storage</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden min-h-0">
        <div className="overflow-y-auto pr-1">
          <h3 className="text-white font-bold mb-2">Party ({party.length}/6)</h3>
          {party.map(m => (
            <div key={m.id} className="game-panel p-3 mb-2 flex items-center gap-3">
              <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">{m.nickname}</div>
                <div className="text-xs text-slate-400">Lv. {m.level} · {SPECIES_DB[m.speciesId]?.name}</div>
              </div>
              <button onClick={() => moveToPc(m.id)} className="game-button px-2 py-1 text-xs">To PC</button>
            </div>
          ))}
          {party.length === 0 && <div className="text-slate-400 text-sm">Party is empty.</div>}
        </div>
        <div className="overflow-y-auto pr-1">
          <h3 className="text-white font-bold mb-2">PC ({pc.length})</h3>
          {pc.map(m => (
            <div key={m.id} className="game-panel p-3 mb-2 flex items-center gap-3">
              <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">{m.nickname}</div>
                <div className="text-xs text-slate-400">Lv. {m.level} · {SPECIES_DB[m.speciesId]?.name}</div>
              </div>
              <button disabled={party.length >= 6} onClick={() => moveToParty(m.id)} className="game-button px-2 py-1 text-xs">To Party</button>
            </div>
          ))}
          {pc.length === 0 && <div className="text-slate-400 text-sm">PC is empty. Extra catches go here automatically.</div>}
        </div>
      </div>
    </div>
  );
}
