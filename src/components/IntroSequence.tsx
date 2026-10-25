import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getSlotSummaries, getSaves, loadGame } from "../lib/saveSystem";
import { UiPanel } from "./game/UiArt";
import { UI_ART } from "../lib/uiArt";
import HumanPortrait from "./game/HumanPortrait";
import { playerSlot } from "../lib/humanSheets";

interface IntroSequenceProps {
  onComplete: () => void;
  onEnterWorld: () => void;
}

export default function IntroSequence({ onComplete, onEnterWorld }: IntroSequenceProps) {
  const [phase, setPhase] = useState<"CINEMATIC" | "TITLE" | "MAIN_MENU" | "SAVE_SLOTS" | "PROF_INTRO_1" | "GENDER_SELECT" | "NAME_ENTRY" | "PROF_INTRO_2">("CINEMATIC");
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [slots, setSlots] = useState<any[]>([]);

  // Name Entry state
  const [tempName, setTempName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl">("boy");

  const loadState = useGameStore(s => s.loadState);
  const setPlayerInfo = useGameStore(s => s.setPlayerInfo);

  useEffect(() => {
    // Pulse animation for prompts
    const iv = setInterval(() => setShowPrompt(p => !p), 800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (phase === "MAIN_MENU") {
      setSlots(getSlotSummaries());
    }
  }, [phase]);

  const handleAnyKey = () => {
    if (phase === "CINEMATIC") setPhase("TITLE");
    else if (phase === "TITLE") setPhase("MAIN_MENU");
  };

  useEffect(() => {
    if (phase === "CINEMATIC" || phase === "TITLE") {
      const handler = () => handleAnyKey();
      window.addEventListener("keydown", handler);
      window.addEventListener("mousedown", handler);
      return () => {
        window.removeEventListener("keydown", handler);
        window.removeEventListener("mousedown", handler);
      };
    }
  }, [phase]);

  if (phase === "CINEMATIC") {
    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center cursor-pointer selection:bg-none">
        <div className="text-white text-md tracking-[0.3em] mb-12 animate-pulse text-center">
          MOCHII STUDIOS<br/><br/>
          MOCHIICHAO<br/>DIAMOND VERSION
        </div>
        <div className="text-teal-400 text-6xl shadow-[0_0_20px_rgba(0,255,255,0.8)] filter drop-shadow animate-bounce">
          ✦
        </div>
        <div className={`mt-24 text-gray-500 text-xs tracking-[0.2em] transition-opacity duration-300 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
          ▼ PRESS ANY KEY ▼
        </div>
      </div>
    );
  }

  if (phase === "TITLE") {
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
        
        <div className="z-10 mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#e8b890] border-4 border-slate-700" />
          <div className="w-20 h-24 rounded-t-full bg-teal-700 border-2 border-teal-300 -mt-1" />
        </div>

        <div className="text-center z-10">
          <div className="text-white text-3xl font-black tracking-widest shadow-black drop-shadow-md">MOCHIICHAO</div>
          <div className="text-teal-300 text-xl font-bold tracking-[0.4em] drop-shadow-lg mt-2">✦ DIAMOND VERSION ✦</div>
        </div>

        <div className={`absolute bottom-20 text-yellow-400 text-sm font-bold tracking-widest z-10 transition-opacity duration-300 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
          PRESS ANY KEY
        </div>

        <div className="absolute bottom-4 text-gray-600 text-[10px] tracking-widest">
          © 2026 MOCHII STUDIOS. ALL RIGHTS RESERVED.
        </div>
      </div>
    );
  }

  if (phase === "MAIN_MENU") {
    const hasSaves = slots.some(s => s !== null);

    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center">
        <UiPanel slot={UI_ART.main_menu_panel} className="p-8 flex flex-col gap-6">
          <div className="text-teal-300 font-bold tracking-widest text-center text-lg mb-4">✦ MOCHIICHAO DIAMOND ✦</div>
          
          <button 
             onClick={() => hasSaves && setPhase("SAVE_SLOTS")} 
             disabled={!hasSaves}
             className={`text-left text-xl font-bold tracking-widest flex items-center group transition-colors ${hasSaves ? 'text-white hover:text-yellow-400' : 'text-gray-600 cursor-not-allowed'}`}
          >
            <span className="w-8 opacity-0 group-hover:opacity-100 transition-opacity">►</span> CONTINUE
          </button>
          
          <button 
             onClick={() => setPhase("SAVE_SLOTS")}
             className="text-left text-xl font-bold tracking-widest flex items-center group transition-colors text-white hover:text-yellow-400"
          >
            <span className="w-8 opacity-0 group-hover:opacity-100 transition-opacity">►</span> NEW GAME
          </button>

          <button className="text-left text-xl font-bold tracking-widest flex items-center group transition-colors text-gray-500 cursor-not-allowed" disabled>
            <span className="w-8 opacity-0">►</span> SETTINGS <span className="text-xs text-gray-600 ml-2">COMING SOON</span>
          </button>
        </UiPanel>
      </div>
    );
  }

  if (phase === "SAVE_SLOTS") {
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center">
        <h2 className="text-teal-300 text-xl font-bold tracking-widest mb-8">SELECT A SAVE FILE</h2>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {[1,2,3].map(slot => {
            const save = slots[slot-1];
            return (
              <button 
                key={slot}
                onClick={() => {
                  if (save) {
                    // Load latest save from this slot
                    const file = getSaves(slot).sort((a,b)=>b.timestamp-a.timestamp)[0];
                    if (file) {
                      loadState(file.data);
                      onEnterWorld(); // skip intro and go direct to overworld
                    }
                  } else {
                    setSelectedSlot(slot);
                    setPhase("PROF_INTRO_1");
                  }
                }}
                className="bg-black border-2 border-teal-500/50 hover:border-yellow-400 p-4 rounded text-left transition-colors flex justify-between items-center group"
              >
                <div>
                  <div className="text-teal-400 font-bold mb-1">SLOT {slot}</div>
                  {save ? (
                    <div className="text-white text-sm">
                      <span className="text-yellow-400">{save.player}</span> — {save.map}<br/>
                      <span className="text-gray-400 text-xs">Badges: {save.hms} • {new Date(save.timestamp).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 font-bold">--- EMPTY ---</div>
                  )}
                </div>
                {!save && <span className="text-yellow-400 opacity-0 group-hover:opacity-100 font-bold">NEW GAME ►</span>}
                {save && <span className="text-yellow-400 opacity-0 group-hover:opacity-100 font-bold">LOAD ►</span>}
              </button>
            )
          })}
        </div>
        <button onClick={() => setPhase("MAIN_MENU")} className="mt-8 text-white hover:text-yellow-400 flex items-center font-bold">
           ◄ BACK
        </button>
      </div>
    );
  }

  if (phase === "PROF_INTRO_1" || phase === "PROF_INTRO_2") {
    const text1 = "Welcome to the world of Mochiichao! My name is AEON. People call me the Mochiichao Professor! This world is inhabited by creatures we call Mochiichao. For some people, Mochiichao are pets. Other use them for battling. As for myself... I study Mochiichao as a profession.";
    const text2 = `So your name is ${tempName}? Are you ready? Your very own Mochiichao legend is about to unfold! A world of dreams and adventures awaits! Let's go!`;
    const text = phase === "PROF_INTRO_1" ? text1 : text2;

    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center cursor-pointer" onClick={() => phase === "PROF_INTRO_1" ? setPhase("GENDER_SELECT") : onComplete()}>
        <div className="mb-8 flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-[#e8b890] border-4 border-slate-700" /><div className="w-20 h-24 rounded-t-full bg-slate-200 border-2 border-slate-400 -mt-1" /></div>
        <div className="w-full max-w-2xl bg-white border-[6px] border-gray-400 rounded p-6 shadow-xl relative mt-16 min-h-[160px]">
          <div className="text-gray-800 text-xl font-bold tracking-wide leading-relaxed">
             {text}
          </div>
          <div className={`absolute bottom-4 right-6 text-red-500 text-2xl font-black ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>▼</div>
        </div>
        <div className="mt-4 text-gray-500 text-sm tracking-widest">[ CLICK or SPACE to continue ]</div>
      </div>
    );
  }

  if (phase === "GENDER_SELECT") {
    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center">
        <h2 className="text-white text-2xl font-bold tracking-widest mb-16">ARE YOU A BOY OR A GIRL?</h2>
        <div className="flex gap-16">
           <button onClick={() => { setGender("boy"); setPhase("NAME_ENTRY"); }} className="group flex flex-col items-center transition-transform hover:scale-110">
              <HumanPortrait slot={playerSlot('boy')} view="front" size={72} />
              <div className="text-gray-400 group-hover:text-teal-400 font-bold tracking-widest">BOY</div>
           </button>
           <button onClick={() => { setGender("girl"); setPhase("NAME_ENTRY"); }} className="group flex flex-col items-center transition-transform hover:scale-110">
              <HumanPortrait slot={playerSlot('girl')} view="front" size={72} />
              <div className="text-gray-400 group-hover:text-pink-400 font-bold tracking-widest">GIRL</div>
           </button>
        </div>
      </div>
    );
  }

  if (phase === "NAME_ENTRY") {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
    
    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl font-bold tracking-widest mb-8">WHAT IS YOUR NAME?</div>
        
        <div className="flex gap-8 mb-12 items-end">
           <HumanPortrait slot={playerSlot(gender)} view="front" size={72} />
           <div className="flex bg-gray-900 border-2 border-gray-500 rounded p-4 min-w-[300px]">
              <div className="text-white text-3xl font-bold tracking-widest h-10 w-full text-center border-b-2 border-dashed border-gray-400">
                {tempName}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-13 gap-2 bg-gray-800 p-6 rounded border-4 border-gray-600">
           {letters.map(l => (
             <button key={l} onClick={() =>tempName.length<10 && setTempName(t=>t+l)} className="w-10 h-10 bg-gray-200 hover:bg-white text-black font-bold text-xl rounded shadow">
                {l}
             </button>
           ))}
           <div className="col-span-13 flex justify-between mt-4">
              <button onClick={() => setTempName(t=>t.slice(0,-1))} className="px-6 py-2 bg-red-200 hover:bg-red-300 text-red-900 font-bold rounded shadow tracking-widest">
                 ⌫ DEL
              </button>
              <button 
                 onClick={() => {
                   const finalName = tempName.trim() || (gender==="boy"?"Netrunner":"Lucy");
                   setTempName(finalName);
                   setPlayerInfo(finalName, gender, selectedSlot);
                   setPhase("PROF_INTRO_2");
                 }} 
                 className="px-6 py-2 bg-green-200 hover:bg-green-300 text-green-900 font-bold rounded shadow tracking-widest"
              >
                 OK ►
              </button>
           </div>
        </div>
      </div>
    );
  }

  return null;
}
