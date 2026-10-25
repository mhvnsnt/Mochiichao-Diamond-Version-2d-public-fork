import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getSaves, saveGame, SaveEntry, loadGame } from "../lib/saveSystem";

interface SaveMenuProps {
  onClose: () => void;
}

export default function SaveMenu({ onClose }: SaveMenuProps) {
  const gameState = useGameStore(s => s); // Pull entire state to serialize
  const slotId = gameState.saveSlot;
  const [saves, setSaves] = useState<SaveEntry[]>([]);
  const [viewing, setViewing] = useState<"LIST" | "CONFIRM_SAVE" | "CONFIRM_LOAD">("LIST");
  const [selectedSave, setSelectedSave] = useState<SaveEntry | null>(null);

  useEffect(() => {
    setSaves(getSaves(slotId));
  }, [slotId]);

  const handleSave = () => {
    // Generate a Skyrim-like label based on location
    const mapName = gameState.currentMap;
    const label = `${mapName.toUpperCase()} - Lvl ${gameState.party.length ? gameState.party[0].level : 5}`;
    saveGame(slotId, "manual", label, gameState);
    setSaves(getSaves(slotId));
  };

  const handleLoad = () => {
    if (selectedSave) {
      loadGame(selectedSave, gameState.loadState);
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur z-[60] flex items-center justify-center">
      <div className="std-window p-6 w-full max-w-2xl">
         <div className="flex justify-between items-center mb-6 border-b-2 border-teal-900 pb-2">
            <h2 className="text-teal-300 text-2xl font-bold tracking-widest textShadow">SYSTEM / SAVE</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white font-bold tracking-widest">▼ CLOSE</button>
         </div>

         {viewing === "LIST" && (
           <div className="flex flex-col gap-4">
             <div className="flex gap-4">
               <button onClick={handleSave} className="flex-1 bg-teal-900/50 hover:bg-teal-700/50 border-2 border-teal-500 text-teal-100 p-4 rounded font-bold tracking-widest transition-colors">
                 + CREATE NEW SAVE
               </button>
             </div>

             <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-2">
               {saves.length === 0 && <div className="text-gray-500 text-center py-8">NO SAVES YET</div>}
               {saves.map(save => (
                 <div key={save.id} className="bg-black/50 border border-teal-900/50 p-4 rounded flex justify-between items-center group hover:border-yellow-400 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${save.type === 'auto' ? 'bg-indigo-900 text-indigo-300' : 'bg-teal-900 text-teal-300'}`}>
                           {save.type === 'auto' ? 'AUTOSAVE' : 'SAVE'}
                         </span>
                         <span className="text-yellow-400 font-bold">{save.label}</span>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(save.timestamp).toLocaleString()} • Px: {save.data.playerPos.x}, Py: {save.data.playerPos.y}
                      </div>
                    </div>
                    <button 
                       onClick={() => { setSelectedSave(save); setViewing("CONFIRM_LOAD"); }}
                       className="bg-slate-800 hover:bg-yellow-400 hover:text-black text-xs font-bold text-teal-100 px-4 py-2 border border-slate-600 rounded opacity-50 group-hover:opacity-100 transition-all"
                    >
                      LOAD
                    </button>
                 </div>
               ))}
             </div>
           </div>
         )}

         {viewing === "CONFIRM_LOAD" && selectedSave && (
           <div className="py-8 text-center">
              <div className="text-red-400 font-bold text-xl mb-4 animate-pulse">WARNING</div>
              <div className="text-white mb-8">Loading this save will overwrite current unsaved progress. Are you sure?</div>
              <div className="flex gap-4 justify-center">
                 <button onClick={() => setViewing("LIST")} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded font-bold tracking-widest border border-slate-600">CANCEL</button>
                 <button onClick={handleLoad} className="bg-red-900/50 hover:bg-red-800/80 text-red-100 border border-red-500 px-8 py-3 rounded font-bold tracking-widest">LOAD GAME</button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
