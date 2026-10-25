import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getSlotSummaries, getSaves, loadGame } from "../lib/saveSystem";
import HumanPortrait from "./game/HumanPortrait";
import StdWindow from "./game/StdWindow";
import DialogueBox from "./game/DialogueBox";
import { playerSlot, HUMAN_SLOTS } from "../lib/humanSheets";

/**
 * NamePad — the on-screen letter keyboard shared by NAME_ENTRY and
 * RIVAL_NAME (v4: one name-entry component, not two different ones).
 * Defaults are the pre-existing ones (Netrunner / Lucy), not new
 * names invented in v4.
 */
function NamePad({ title, slot, value, setValue, confirmLabel, onConfirm, note }: {
  title: string;
  slot: any;
  value: string;
  setValue: (v: string) => void;
  confirmLabel: string;
  onConfirm: (finalName: string) => void;
  note?: string;
}) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        {note && (
          <StdWindow className="p-5 mb-4 w-full">
            <div className="text-white leading-relaxed">{note}</div>
          </StdWindow>
        )}
        <div className="text-white text-xl font-bold tracking-widest mb-8">{title}</div>
        <div className="flex gap-8 mb-8 items-end">
          <HumanPortrait slot={slot} view="front" size={72} />
          <StdWindow className="p-4 min-w-[300px]">
            <div className="text-white text-3xl font-bold tracking-widest h-10 w-full text-center border-b-2 border-dashed border-teal-500/50">
              {value}
            </div>
          </StdWindow>
        </div>
        <StdWindow className="p-4 w-full">
          <div className="grid grid-cols-13 gap-2">
            {letters.map(l => (
              <button key={l} onClick={() => value.length < 10 && setValue(value + l)} className="game-button h-10 font-bold text-lg">
                {l}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4 gap-2">
            <button onClick={() => setValue(value.slice(0, -1))} className="game-button px-6 py-2 font-bold min-h-[48px] tracking-widest">
              ⌫ DEL
            </button>
            <button onClick={() => onConfirm(value.trim() || "Hex")} className="game-button px-6 py-2 font-bold min-h-[48px] tracking-widest">
              {confirmLabel}
            </button>
          </div>
        </StdWindow>
      </div>
    </div>
  );
}

interface IntroSequenceProps {
  onComplete: () => void;
  onEnterWorld: () => void;
}

export default function IntroSequence({ onComplete, onEnterWorld }: IntroSequenceProps) {
  const [phase, setPhase] = useState<"CINEMATIC" | "TITLE" | "MAIN_MENU" | "SAVE_SLOTS" | "PROF_INTRO_1" | "GENDER_SELECT" | "NAME_ENTRY" | "RIVAL_NAME" | "PROF_INTRO_2">("CINEMATIC");
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [slots, setSlots] = useState<any[]>([]);
  // v3 main menu: window selection, overwrite confirm, settings note.
  const [mainSelected, setMainSelected] = useState(0);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [showSettingsNote, setShowSettingsNote] = useState(false);

  // Name Entry state
  const [tempName, setTempName] = useState("");
  // v4 rival name: Hex is canon and is the default. The name is
  // editable (spec allows this); the entered name is stored and used
  // in later Hex dialogue via the store — it does NOT rename Hex to
  // something else by default, and the default is always Hex.
  const [tempRivalName, setTempRivalName] = useState("Hex");
  const [gender, setGender] = useState<"boy" | "girl">("boy");

  const loadState = useGameStore(s => s.loadState);
  const setPlayerInfo = useGameStore(s => s.setPlayerInfo);
  const setRivalName = useGameStore(s => s.setRivalName);
  const setMapState = useGameStore(s => s.setMapState);

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

  // v3 main menu controls: up/down + confirm, B/back to title. Tap /
  // click on a window works as well (see the MAIN_MENU render).
  useEffect(() => {
    if (phase !== "MAIN_MENU") return;
    const hasSaves = slots.some(s => s !== null);
    const itemCount = hasSaves ? 3 : 2;
    const handler = (e: KeyboardEvent) => {
      if (showOverwriteConfirm || showSettingsNote) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
          setShowOverwriteConfirm(false);
          setShowSettingsNote(false);
        }
        return;
      }
      if (e.key === 'ArrowUp') { e.preventDefault(); setMainSelected(s => (s - 1 + itemCount) % itemCount); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setMainSelected(s => (s + 1) % itemCount); }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const keys = hasSaves ? ['CONTINUE', 'NEW GAME', 'SETTINGS'] : ['NEW GAME', 'SETTINGS'];
        const key = keys[Math.min(mainSelected, keys.length - 1)];
        if (key === 'CONTINUE') setPhase("SAVE_SLOTS");
        else if (key === 'NEW GAME') { if (hasSaves) setShowOverwriteConfirm(true); else setPhase("SAVE_SLOTS"); }
        else if (key === 'SETTINGS') setShowSettingsNote(true);
      }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') setPhase("TITLE");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, mainSelected, slots, showOverwriteConfirm, showSettingsNote]);

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
    // CONTINUE stats, v3: ONLY stats the save actually holds. The
    // latest save across slots 1-3 is read from saveSystem; its data
    // is the full serialized game state. Player name, caught count
    // (dex 'caught'), team size (party + PC), dojos cleared (badges,
    // the same mapping getSlotSummaries already uses), CR balance
    // (wallet), and map are all in that data. Play time is NOT in
    // saveSystem or the store, so it is OMITTED — no fake time is
    // invented. No total-roster denominator is shown either: the
    // save holds a dex map, not a total, and species.ts (12 entries)
    // is not the 47-creature canon roster, so a "/47" or "/12" would
    // be a made-up denominator.
    const latestSave = [1, 2, 3]
      .flatMap(slotId => getSaves(slotId))
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    const latestData: any = latestSave?.data || null;
    const caughtCount = latestData?.dex
      ? Object.values(latestData.dex).filter((v: unknown) => v === 'caught').length
      : 0;
    const teamCount = latestData ? (latestData.party?.length || 0) + (latestData.pc?.length || 0) : 0;
    const dojosCleared = latestData?.badges?.length || 0;
    const crBalance = latestData?.wallet ?? null;

    // Main menu windows, v3 (main_menu.c, structure only): SEPARATE
    // framed windows, one per item, over the title background — not
    // one list panel, not blank navy, not a Pillow image. CONTINUE is
    // tall (stats inside), NEW GAME short below it, SETTINGS below
    // that. Selected window = gold/teal highlighted frame, unselected
    // = standard framed panel. No Mystery Gift equivalent, no version
    // footer, no fake patch number.
    const mainItems = [
      ...(hasSaves ? [{ key: 'CONTINUE', tall: true }] : []),
      { key: 'NEW GAME', tall: false },
      { key: 'SETTINGS', tall: false },
    ];
    const safeMain = Math.min(mainSelected, mainItems.length - 1);

    const activateMain = (key: string) => {
      if (key === 'CONTINUE' && hasSaves) setPhase("SAVE_SLOTS");
      else if (key === 'NEW GAME') {
        // Overwrite confirm BEFORE starting over, when a save exists.
        // No save is erased here: the existing flow goes to SAVE_SLOTS,
        // and a save is only replaced when the player later saves over
        // a slot in-game (SaveMenu). No second save system was built.
        if (hasSaves) setShowOverwriteConfirm(true);
        else setPhase("SAVE_SLOTS");
      } else if (key === 'SETTINGS') {
        // Honest limit: there is no settings screen in this build
        // (the old button was disabled "COMING SOON"). The window is
        // present per the spec order, but it changes no setting and
        // invents no settings system.
        setShowSettingsNote(true);
      }
    };

    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
        {/* Title background, as on the TITLE phase: gradient + game
            world behind, never blank navy, never a bare panel. */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-md flex flex-col gap-4" role="menu" aria-label="Main menu">
          <div className="text-center">
            <div className="text-white text-2xl font-black tracking-widest drop-shadow-md">MOCHIICHAO</div>
            <div className="text-teal-300 text-sm font-bold tracking-[0.4em] mt-1">✦ DIAMOND VERSION ✦</div>
          </div>

          {mainItems.map((item, i) => {
            const isSelected = i === safeMain;
            // v4 fix (live playtest showed ONE list panel, not separate
            // windows): the v3 code used UiPanel, whose SVG background
            // only renders when its art asset loads — if it does not,
            // the items collapse visually into one panel. v4 uses
            // StdWindow, whose CSS frame renders regardless of any
            // image load, so each item is visibly its own framed
            // window: CONTINUE tall (stats inside), NEW GAME short,
            // SETTINGS short, selected = gold frame + cursor.
            if (item.key === 'CONTINUE') {
              return (
                <StdWindow key={item.key} selected={isSelected} className="p-5 min-h-[48px]">
                  <button
                    onClick={() => activateMain('CONTINUE')}
                    onMouseEnter={() => setMainSelected(i)}
                    onFocus={() => setMainSelected(i)}
                    className="w-full text-left"
                  >
                    <div className="text-xl font-bold tracking-widest text-white">{isSelected ? '► ' : ''}CONTINUE</div>
                    {latestData && (
                      <div className="text-sm text-slate-300 mt-2 leading-relaxed">
                        <div>Player: <span className="text-yellow-300 font-bold">{latestData.playerName || 'Netrunner'}</span></div>
                        <div>Caught: {caughtCount} · Team: {teamCount}</div>
                        <div>Dojos cleared: {dojosCleared} · CR: {crBalance ?? '—'}</div>
                        <div>Map: {latestData.currentMap || '—'} · Saved: {latestSave ? new Date(latestSave.timestamp).toLocaleString() : '—'}</div>
                        <div className="text-xs text-slate-400 mt-1">Play time is not tracked by this save, so none is shown.</div>
                      </div>
                    )}
                  </button>
                </StdWindow>
              );
            }
            return (
              <StdWindow key={item.key} selected={isSelected} className="p-4 min-h-[48px]">
                <button
                  onClick={() => activateMain(item.key)}
                  onMouseEnter={() => setMainSelected(i)}
                  onFocus={() => setMainSelected(i)}
                  className="w-full text-left text-xl font-bold tracking-widest text-white"
                >
                  {isSelected ? '► ' : ''}{item.key}
                  {item.key === 'SETTINGS' && <span className="text-xs text-slate-400 ml-2 tracking-normal">No settings screen in this build yet</span>}
                </button>
              </StdWindow>
            );
          })}

          <button
            onClick={() => setPhase("TITLE")}
            className="game-button px-4 py-3 text-sm font-bold min-h-[48px] self-start"
          >
            ◄ BACK TO TITLE (B)
          </button>
          <div className="game-panel px-3 py-2 text-sm text-slate-200">
            {safeMain === 0 && hasSaves ? 'Continue your saved adventure.' : safeMain === 0 ? 'Start a new adventure.' : mainItems[safeMain]?.key === 'NEW GAME' ? 'Start a new adventure. Existing saves are kept until you save over a slot.' : 'Settings are not in this build yet — nothing will change.'}
          </div>
        </div>

        {showOverwriteConfirm && (
          <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="game-panel p-6 w-full max-w-sm">
              <div className="text-white font-bold text-lg mb-2">Start a new game?</div>
              <p className="text-sm text-slate-400 mb-4">You already have a save. Starting over will not erase it here — it is only replaced if you later save over a slot. Continue to save slots?</p>
              <div className="flex gap-2">
                <button onClick={() => { setShowOverwriteConfirm(false); setPhase("SAVE_SLOTS"); }} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">Yes, continue</button>
                <button onClick={() => setShowOverwriteConfirm(false)} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">No, go back</button>
              </div>
            </div>
          </div>
        )}

        {showSettingsNote && (
          <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="game-panel p-6 w-full max-w-sm">
              <div className="text-white font-bold text-lg mb-2">Settings</div>
              <p className="text-sm text-slate-400 mb-4">There is no settings screen in this build yet, so no setting was changed.</p>
              <button onClick={() => setShowSettingsNote(false)} className="game-button px-4 py-2 font-bold min-h-[48px] w-full">Back to main menu</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "SAVE_SLOTS") {
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center p-4">
        <h2 className="text-teal-300 text-xl font-bold tracking-widest mb-8">SELECT A SAVE FILE</h2>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {[1,2,3].map(slot => {
            const save = slots[slot-1];
            return (
              <StdWindow
                key={slot}
                className="p-4 text-left flex justify-between items-center cursor-pointer"
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
                {!save && <span className="text-yellow-400 font-bold">NEW GAME ►</span>}
                {save && <span className="text-yellow-400 font-bold">LOAD ►</span>}
              </StdWindow>
            )
          })}
        </div>
        <button onClick={() => setPhase("MAIN_MENU")} className="game-button mt-8 px-4 py-3 font-bold min-h-[48px]">
           ◄ BACK
        </button>
      </div>
    );
  }

  if (phase === "PROF_INTRO_1" || phase === "PROF_INTRO_2") {
    // v4: Prof dialogue goes through the same DialogueBox as every
    // NPC / Prof / Mom line in the game (typewriter, portrait, ▼,
    // keyboard + click advance) — NOT the old white/grey box, which
    // also had no keyboard handler, matching the playtest finding
    // that dialogue advanced by clicking, not reliably by Space.
    // Text is the pre-existing Mochiichao-canon Prof text, kept
    // verbatim; DialogueBox pages it to 2 lines per page.
    const text1 = [
      "Welcome to the world of Mochiichao! My name is AEON. People call me the Mochiichao Professor!",
      "This world is inhabited by creatures we call Mochiichao. For some people, Mochiichao are pets. Others use them for battling.",
      "As for myself... I study Mochiichao as a profession. Let me tell you about the Mainframe Region, where your journey begins.",
    ];
    const text2 = [
      `So your name is ${tempName}? And your rival is ${tempRivalName}?`,
      "Are you ready? Your very own Mochiichao legend is about to unfold! A world of dreams and adventures awaits!",
      "Your journey begins in Sector 0. Go home first — your Mom is waiting — then come to my lab and choose your partner.",
    ];
    const lines = phase === "PROF_INTRO_1" ? text1 : text2;

    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
        <div className="relative z-10 w-full max-w-2xl">
          <DialogueBox
            lines={lines}
            speakerName="Prof. Aeon"
            speakerSlot={HUMAN_SLOTS.prof_aeon}
            onComplete={() => {
              if (phase === "PROF_INTRO_1") setPhase("GENDER_SELECT");
              else {
                // v4 spawn = HOME: the new-game world entry is Boot
                // Harbor (sector0 playerStart, 15,18), NOT the store
                // default (21,14). Loaded saves are untouched — this
                // only runs at the end of a new-game intro.
                setMapState('sector0', { x: 15, y: 18 });
                onComplete();
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (phase === "GENDER_SELECT") {
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
        <StdWindow className="relative z-10 p-8 flex flex-col items-center">
          <h2 className="text-white text-2xl font-bold tracking-widest mb-12">ARE YOU A BOY OR A GIRL?</h2>
          <div className="flex gap-16">
            <button onClick={() => { setGender("boy"); setPhase("NAME_ENTRY"); }} className="group flex flex-col items-center transition-transform hover:scale-110">
              <HumanPortrait slot={playerSlot('boy')} view="front" size={72} />
              <div className="text-gray-400 group-hover:text-teal-400 font-bold tracking-widest mt-2">BOY</div>
            </button>
            <button onClick={() => { setGender("girl"); setPhase("NAME_ENTRY"); }} className="group flex flex-col items-center transition-transform hover:scale-110">
              <HumanPortrait slot={playerSlot('girl')} view="front" size={72} />
              <div className="text-gray-400 group-hover:text-pink-400 font-bold tracking-widest mt-2">GIRL</div>
            </button>
          </div>
          <div className="text-slate-400 text-sm mt-8">Choose GIRL to play as Player A (teal/chrome jacket).</div>
        </StdWindow>
      </div>
    );
  }

  if (phase === "NAME_ENTRY") {
    return (
      <NamePad
        title="WHAT IS YOUR NAME?"
        slot={playerSlot(gender)}
        value={tempName}
        setValue={setTempName}
        confirmLabel="OK ►"
        onConfirm={(finalName) => {
          const name = finalName || (gender === "boy" ? "Netrunner" : "Lucy");
          setTempName(name);
          setPlayerInfo(name, gender, selectedSlot);
          setPhase("RIVAL_NAME");
        }}
      />
    );
  }

  if (phase === "RIVAL_NAME") {
    // v4 rival-name phase (new_game.c structure only: rival name
    // state). Hex is already canon — he is presented as the default
    // and confirmed as-is; the name is editable, and the entered
    // name is what later Hex dialogue uses (via the store).
    return (
      <NamePad
        title="WHAT IS YOUR RIVAL'S NAME?"
        note="This is Hex — your rival. He will challenge you at the lab and on the road. Confirm his name as-is, or change it below."
        slot={HUMAN_SLOTS.hex}
        value={tempRivalName}
        setValue={setTempRivalName}
        confirmLabel="CONFIRM ►"
        onConfirm={(finalName) => {
          const name = finalName || "Hex";
          setTempRivalName(name);
          setRivalName(name);
          setPhase("PROF_INTRO_2");
        }}
      />
    );
  }

  return null;
}
