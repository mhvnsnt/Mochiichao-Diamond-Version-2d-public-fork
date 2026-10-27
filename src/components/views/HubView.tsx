import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ViewState } from '../../App';
import { SPECIES_DB } from '../../lib/species';

export default function HubView({ 
  setView, 
  setBattleEnemy 
}: { 
  setView: (v: ViewState) => void,
  setBattleEnemy: (id: string) => void
}) {
  const healParty = useGameStore(s => s.healParty);
  const party = useGameStore(s => s.party);

  const handleWildEncounter = () => {
    const wildIds = ["038", "010", "007", "001", "004"];
    const randomId = wildIds[Math.floor(Math.random() * wildIds.length)];
    setBattleEnemy(randomId);
    setView('BATTLE');
  };

  const isPartyFainted = party.every(p => p.hp <= 0);

  return (
    <div className="flex-1 p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 flex flex-col items-center justify-center">
      
      <h2 className="text-3xl font-bold text-teal-500 mb-2 tracking-widest uppercase">Hub</h2>
      <p className="text-slate-400 mb-12">Where to next?</p>

      {isPartyFainted && (
        <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-4 rounded mb-8 w-full max-w-md text-center text-sm">
          Your whole team is fainted. Heal them first.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        
        <button 
          onClick={handleWildEncounter}
          disabled={isPartyFainted}
          className="group relative p-6 bg-slate-900 border border-teal-900 hover:border-teal-400 disabled:opacity-50 disabled:border-slate-800 disabled:cursor-not-allowed rounded-lg overflow-hidden transition-all text-left"
        >
          <div className="absolute inset-0 bg-teal-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <div className="relative font-bold text-teal-100 text-lg mb-1 group-hover:text-teal-400 transition-colors">Wild Battle</div>
          <div className="relative text-xs text-slate-500">Battle a wild Mochiichao.</div>
        </button>

        <button 
          onClick={() => { healParty(); alert('Your team is fully healed.'); }}
          className="group relative p-6 bg-slate-900 border border-teal-900 hover:border-teal-400 rounded-lg overflow-hidden transition-all text-left"
        >
          <div className="absolute inset-0 bg-teal-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <div className="relative font-bold text-teal-100 text-lg mb-1 group-hover:text-teal-400 transition-colors">Heal Team</div>
          <div className="relative text-xs text-slate-500">Restore all Mochiichao to maximum health and cure status conditions.</div>
        </button>

        <button 
          onClick={() => setView('ROSTER')}
          className="group relative p-6 bg-slate-900 border border-teal-900 hover:border-teal-400 rounded-lg overflow-hidden transition-all text-left"
        >
          <div className="absolute inset-0 bg-teal-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <div className="relative font-bold text-teal-100 text-lg mb-1 group-hover:text-teal-400 transition-colors">Active Roster</div>
          <div className="relative text-xs text-slate-500">View and manage your current team of Mochiichao.</div>
        </button>

        <button 
          onClick={() => setView('SHOP')}
          className="group relative p-6 bg-slate-900 border border-teal-900 hover:border-teal-400 rounded-lg overflow-hidden transition-all text-left"
        >
          <div className="absolute inset-0 bg-teal-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <div className="relative font-bold text-teal-100 text-lg mb-1 group-hover:text-teal-400 transition-colors">Syndicate Kiosk</div>
          <div className="relative text-xs text-slate-500">Purchase capture tech and recovery items using earned credits.</div>
        </button>
      </div>

    </div>
  )
}
