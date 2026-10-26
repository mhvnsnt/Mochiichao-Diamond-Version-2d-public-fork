import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getSlotSummaries, getSaves, loadGame } from "../lib/saveSystem";
import HumanPortrait from "./game/HumanPortrait";
import StdWindow from "./game/StdWindow";
import DialogueBox from "./game/DialogueBox";
import SettingsScreen from "./game/SettingsScreen";
import { frameAccent } from "../lib/gameSettings";
import { PINNED_SUBTITLE_FONT } from "../lib/fonts";
import { pickRotation, readLastTitleCreature, writeLastTitleCreature, type TitleCreature } from "../lib/titleRotation";
import YogifernoTitleWalk from "./game/YogifernoTitleWalk";
import TitleCreatureFigure from "./game/TitleCreatureFigure";
import { playerSlot, HUMAN_SLOTS } from "../lib/humanSheets";
import { playBootSound, playPressStartSound } from "../lib/bootAudio";
import heavensentLogo from "../assets/ui/m-heavensent-studios-logo.png";
import { playMusic, stopMusic } from "../lib/music";

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
  // v5: physical keyboard input. Before v5 NamePad had no keydown
  // listener at all, so typing on a physical keyboard did nothing
  // and only on-screen letter clicks filled the field (v4 playtest
  // bug). Letters/digits append (same 10-char cap as the buttons),
  // Backspace deletes, Enter confirms exactly like the confirm
  // button (same fallback argument — no new default name logic).
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Backspace") { e.preventDefault(); setValue(value.slice(0, -1)); }
      else if (e.key === "Enter") { e.preventDefault(); onConfirm(value.trim() || "Hex"); }
      else if (e.key.length === 1 && letters.includes(e.key) && value.length < 10) {
        e.preventDefault(); setValue(value + e.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [value, setValue, onConfirm]);
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
  // Title/press/settings wiring, 2026-10-25: BOOT -> INTRO (GAP
  // scenes) -> TITLE (phi phases) -> MAIN_MENU, upgraded in place.
  // CINEMATIC is replaced by BOOT + INTRO; no duplicate title,
  // main-menu, or save system is created. Main menu itself is
  // UNCHANGED except SETTINGS now opens the real Settings screen.
  const [phase, setPhase] = useState<"BOOT" | "INTRO" | "TITLE" | "MAIN_MENU" | "SETTINGS" | "SAVE_SLOTS" | "PROF_INTRO_1" | "GENDER_SELECT" | "NAME_ENTRY" | "RIVAL_NAME" | "PROF_INTRO_2">("BOOT");
  const [showPrompt, setShowPrompt] = useState(false);
  const [introScene, setIntroScene] = useState(0);
  const [titleFading, setTitleFading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [slots, setSlots] = useState<any[]>([]);
  // v3 main menu: window selection, overwrite confirm.
  const [mainSelected, setMainSelected] = useState(0);
  // Title rotation (Mars 18:26/18:28/18:31 CDT): first pick excludes
  // the last stored creature (previous startup), so a startup never
  // repeats the previous startup's creature. Every return to TITLE
  // re-picks, excluding the current creature and the stored one.
  const [titleCreature, setTitleCreature] = useState<TitleCreature>(() => {
    const last = readLastTitleCreature();
    return pickRotation(last ? [last] : []);
  });
  // Yogiferno title variant: same walk, or the snow variant (same
  // walk on a snow background, fire trail on snow). Re-rolled on
  // every rotation pick that lands on Yogiferno.
  const [titleVariant, setTitleVariant] = useState<'walk' | 'snow'>('walk');
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const settings = useGameStore(s => s.settings);
  const frameColor = frameAccent(settings.frame);
  const cursorGlyph = settings.cursorShape === 'DIAMOND' ? '◆' : settings.cursorShape === 'STAR' ? '✦' : settings.cursorShape === 'RING' ? '◎' : '►';

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

  useEffect(() => {
    if (phase === "TITLE") {
      setTitleCreature(prev => {
        const last = readLastTitleCreature();
        const next = pickRotation([prev.name, ...(last ? [last] : [])]);
        writeLastTitleCreature(next.name);
        if (next.name === 'Yogiferno') setTitleVariant(Math.random() < 0.5 ? 'snow' : 'walk');
        return next;
      });
    }
  }, [phase]);

  // Music wiring (official tracks, 2026-10-25): INTRO plays the
  // official intro once (no loop), TITLE loops the official title,
  // MAIN_MENU / SETTINGS / SAVE_SLOTS loop the main-menu track, and
  // later phases (prof intro, name entry, etc.) stop music so the
  // world starts silent. BOOT and TITLE-press sounds are NOT here:
  // they are already wired on main in src/lib/bootAudio.ts (BOOT =
  // UI Art Option B, press = M3), and duplicating them would play
  // both twice. playMusic() fades the old track out over 1000 ms
  // (Pokemon 60-frame fade) and is a no-op if the same track is
  // already playing, so B back to TITLE restarts title music
  // without restarting the loop on every render.
  useEffect(() => {
    if (phase === "INTRO") playMusic("intro");
    else if (phase === "TITLE") playMusic("title");
    else if (phase === "MAIN_MENU" || phase === "SETTINGS" || phase === "SAVE_SLOTS") playMusic("mainMenu");
    else stopMusic();
  }, [phase]);

  useEffect(() => {
    return () => stopMusic(0);
  }, []);

  // v3 main menu controls: up/down + confirm, B/back to title. Tap /
  // click on a window works as well (see the MAIN_MENU render).
  useEffect(() => {
    if (phase !== "MAIN_MENU") return;
    const hasSaves = slots.some(s => s !== null);
    const itemCount = hasSaves ? 3 : 2;
    const handler = (e: KeyboardEvent) => {
      if (showOverwriteConfirm) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
          setShowOverwriteConfirm(false);
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
        else if (key === 'SETTINGS') setPhase("SETTINGS");
      }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') setPhase("TITLE");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, mainSelected, slots, showOverwriteConfirm]);

  // Boot / intro / title advance: any key or click skips to the next
  // phase (Pokemon any-key skip). Boot hold time is an implementation
  // choice (2.5s, labelled in the BOOT render) — Mars has not locked
  // a hold time yet. Title fade is a white fade, then MAIN_MENU.
  // Audio (settled roles, see src/lib/bootAudio.ts): BOOT plays the
  // UI Art Option B rising arpeggio once on entering BOOT; TITLE
  // advance (PRESS ANY KEY) plays the M3 Mochii Chirp. The chirp is
  // the press-start sound only, never the boot sound.
  const bootPlayedRef = React.useRef(false);
  const advanceIntro = () => {
    if (phase === "BOOT") setPhase("INTRO");
    else if (phase === "INTRO") {
      if (introScene < 3) setIntroScene(s => s + 1);
      else setPhase("TITLE");
    } else if (phase === "TITLE" && !titleFading) {
      playPressStartSound();
      setTitleFading(true);
      setTimeout(() => { setTitleFading(false); setPhase("MAIN_MENU"); }, 350);
    }
  };

  useEffect(() => {
    if (phase === "BOOT") {
      // Ref guard: StrictMode double-invokes effects in dev, which
      // would otherwise start the boot sound twice. In a production
      // build the effect runs once; BOOT mounts once per page load.
      if (!bootPlayedRef.current) {
        bootPlayedRef.current = true;
        playBootSound();
      }
      const t = setTimeout(() => setPhase("INTRO"), 2500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase]);

  useEffect(() => {
    if (phase === "BOOT" || phase === "INTRO" || phase === "TITLE") {
      const handler = () => advanceIntro();
      window.addEventListener("keydown", handler);
      window.addEventListener("mousedown", handler);
      return () => {
        window.removeEventListener("keydown", handler);
        window.removeEventListener("mousedown", handler);
      };
    }
  }, [phase, introScene, titleFading]);

  if (phase === "BOOT") {
    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center cursor-pointer selection:bg-none p-4">
        {/* Boot: black screen, M Heavensent Studios logo alone, phi
            boot size (742 on a 1200 canvas, responsive max-width).
            Boot sound is WIRED: UI Art Option B rising arpeggio
            (bootAudio.ts), no Pokemon chime copied. Hold 2.5s is an
            implementation choice, not a locked Mars value; any key
            skips immediately. */}
        <img
          src={heavensentLogo}
          alt="M Heavensent Studios"
          className="w-full max-w-[556px] aspect-square object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="text-white text-lg tracking-[0.3em] text-center mt-2">M HEAVENSENT STUDIOS</div>
        <div className="text-gray-500 text-xs tracking-[0.2em] mt-8 text-center">
          Boot sound: UI Art Option B rising arpeggio · Press any key to skip
        </div>
      </div>
    );
  }

  if (phase === "INTRO") {
    const scenes = [
      { title: 'M HEAVENSENT STUDIOS', body: 'Studio scene — star, sparkles, reveal, presents beat. Mochiichao wording only.', gap: 'GAP: studio scene art — original art needed.' },
      { title: 'WORLD CLOSE-UP', body: 'Scene 1 — brief close-up of the Mochiichao world (grass/world close-up beat).', gap: 'GAP: intro scene art — original art needed.' },
      { title: 'WORLD PAN + CREATURE CLOSE-UPS', body: 'Scene 2 — panning wide world shot, then close-ups of Mochii and partner creatures.', gap: 'GAP: intro scene art — original art needed.' },
      { title: 'CREATURE FIGHT BEAT', body: 'Scene 3 — a creature fight beat: entrance, attack, recoil. No Pokemon art, music, or dialogue is used here.', gap: 'GAP: intro scene art — original art needed.' },
    ];
    const scene = scenes[introScene];
    return (
      <div className="game-screen bg-black flex flex-col items-center justify-center cursor-pointer selection:bg-none p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-teal-300 text-xs tracking-[0.3em] mb-4">INTRO MOVIE — SCENE {introScene + 1} / 4 · ANY KEY SKIPS</div>
          <StdWindow accent={frameColor} className="p-6">
            <div className="text-white text-xl font-black tracking-widest">{scene.title}</div>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">{scene.body}</p>
            <p className="text-yellow-300 text-xs mt-4">{scene.gap}</p>
          </StdWindow>
          <button
            onClick={(e) => { e.stopPropagation(); advanceIntro(); }}
            className="game-button px-6 py-3 font-bold min-h-[48px] mt-6"
          >
            {introScene < 3 ? 'NEXT SCENE ►' : 'TO TITLE ►'}
          </button>
          <div className="text-gray-500 text-xs mt-4">Intro music: official intro track. Any key skips to the title.</div>
        </div>
      </div>
    );
  }

  if (phase === "TITLE") {
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer p-4">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
        {/* Shine sweep: white band moving left to right, twice
            (Ruby x+=4, brighten to 31 then darken to 0, twice).
            CSS animation stands in for the frame-count shine. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 bottom-0 w-24 bg-white/20 blur-md"
            style={{ animation: 'title-shine 2.4s ease-in-out 2' }}
          />
        </div>
        <style>{`@keyframes title-shine { from { left: -10%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { left: 110%; opacity: 0; } } @keyframes title-slide-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes press-blink { 0%, 66% { opacity: 1; } 67%, 100% { opacity: 0; } }`}</style>

        {/* Phi title layout, responsive version of the 1200x1500 spec:
            logo 900 (75% width) centre top third, DIAMOND VERSION
            556 (900/phi) below it, PRESS ANY KEY at the 61.8% line,
            studio logo 556 in the copyright slot below it. */}
        <div className="z-10 flex flex-col items-center w-full max-w-2xl" style={{ animation: 'title-slide-up 0.6s ease-out' }}>
          <div className="text-center">
            <div className="text-white text-4xl sm:text-5xl font-black tracking-widest drop-shadow-md" style={{ fontFamily: 'var(--bold-font, "Trebuchet MS", sans-serif)' }}>MOCHIICHAO</div>
            {/* DIAMOND VERSION subtitle font is PINNED (Mars font
                correction): this stack never changes, no font row
                touches it, in TITLE or MAIN_MENU. */}
            <div className="text-teal-300 text-xl font-bold tracking-[0.4em] drop-shadow-lg mt-3" style={{ animation: 'title-slide-up 0.6s ease-out 0.4s both', fontFamily: PINNED_SUBTITLE_FONT }}>
              ✦ DIAMOND VERSION ✦
            </div>
          </div>
          {/* Title rotation: featured creature + its theme. Art is
              GAP — silhouette art for this creature is not shipped
              in this code PR; the name/theme wiring is real. */}
          <div className="mt-6 text-center" style={{ color: titleCreature.primary }}>
            <div className="text-sm font-bold tracking-widest">FEATURED: {titleCreature.name}{titleCreature.dex ? ` ${titleCreature.dex}` : ''}</div>
            <div className="text-[11px] mt-1" style={{ color: titleCreature.accent }}>{titleCreature.vibe}</div>
            <div className="text-[10px] text-gray-500 mt-1">Title creature art: clean cutout wired (10/10)</div>
          </div>
          {titleCreature.name === 'Yogiferno' && (
            <div className="mt-4 w-full max-w-md">
              <div className="text-center text-[11px] mb-1" style={{ color: titleCreature.accent }}>
                Yogiferno — {titleVariant === 'snow' ? 'snow walk variant (fire trail on snow)' : 'walk variant'}
              </div>
              <YogifernoTitleWalk variant={titleVariant} />
            </div>
          )}
          {titleCreature.name !== 'Yogiferno' && (
            <div className="mt-4 w-full max-w-md">
              <div className="text-center text-[11px] mb-1" style={{ color: titleCreature.accent }}>
                {titleCreature.name} — clean cutout title figure
              </div>
              <TitleCreatureFigure name={titleCreature.name} />
            </div>
          )}
          <div className="mt-10 text-sm font-bold tracking-widest" style={{ animation: 'press-blink 0.75s steps(1) infinite', color: titleCreature.primary }}>
            PRESS ANY KEY
          </div>
          <div className="mt-8 w-full max-w-[420px]">
            <img
              src={heavensentLogo}
              alt="M Heavensent Studios"
              className="w-full aspect-square object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="text-center text-gray-400 text-[10px] tracking-widest mt-1">M HEAVENSENT STUDIOS · TITLE COPYRIGHT SLOT</div>
            <div className="text-center text-gray-500 text-[10px] mt-2">Title background scene art: GAP — original art needed · Title music: official title track (loops) (press-start chirp wired: M3 Mochii Chirp on PRESS ANY KEY)</div>
          </div>
        </div>

        {titleFading && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-300" />}
        <div className={`absolute bottom-4 text-gray-600 text-[10px] tracking-widest z-10 transition-opacity duration-300 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
          ▼ PRESS ANY KEY ▼
        </div>
      </div>
    );
  }

  if (phase === "SETTINGS") {
    return <SettingsScreen onBack={() => setPhase("MAIN_MENU")} />;
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
        // Title/press/settings wiring: SETTINGS now opens the real
        // full-screen Settings screen (SettingsScreen), not a note.
        setPhase("SETTINGS");
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
            {/* Main menu otherwise UNCHANGED (locked v32): logo and
                subtitle are pinned to the previous default stack,
                NOT to any font row — only the selection row text
                below follows MENU FONT. */}
            <div className="text-white text-2xl font-black tracking-widest drop-shadow-md" style={{ fontFamily: PINNED_SUBTITLE_FONT }}>MOCHIICHAO</div>
            <div className="text-teal-300 text-sm font-bold tracking-[0.4em] mt-1" style={{ fontFamily: PINNED_SUBTITLE_FONT }}>✦ DIAMOND VERSION ✦</div>
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
                <StdWindow key={item.key} selected={isSelected} accent={frameColor} className="p-5 min-h-[48px]">
                  <button
                    onClick={() => activateMain('CONTINUE')}
                    onMouseEnter={() => setMainSelected(i)}
                    onFocus={() => setMainSelected(i)}
                    className="w-full text-left"
                  >
                    <div className="text-xl font-bold tracking-widest text-white" style={{ fontFamily: 'var(--menu-font, "Trebuchet MS", sans-serif)' }}><span style={{ color: settings.cursorColor }}>{isSelected ? `${cursorGlyph} ` : ''}</span>CONTINUE</div>
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
              <StdWindow key={item.key} selected={isSelected} accent={frameColor} className="p-4 min-h-[48px]">
                <button
                  onClick={() => activateMain(item.key)}
                  onMouseEnter={() => setMainSelected(i)}
                  onFocus={() => setMainSelected(i)}
                  className="w-full text-left text-xl font-bold tracking-widest text-white"
                  style={{ fontFamily: 'var(--menu-font, "Trebuchet MS", sans-serif)' }}
                >
                  <span style={{ color: settings.cursorColor }}>{isSelected ? `${cursorGlyph} ` : ''}</span>{item.key}
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
            {safeMain === 0 && hasSaves ? 'Continue your saved adventure.' : safeMain === 0 ? 'Start a new adventure.' : mainItems[safeMain]?.key === 'NEW GAME' ? 'Start a new adventure. Existing saves are kept until you save over a slot.' : 'Settings — text speed, battle scene/style, sound, button mode, frame, font.'}
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
        {/* v5: wrapper is absolute inset-0, NOT a centred max-w-2xl
            box. Before v5 DialogueBox (absolute, bottom, full width)
            anchored to that centred narrow wrapper, so the Prof
            intro box was centred and narrower than full width while
            Mom's dialogue (direct child of .game-screen) was full
            width at the bottom. Now both anchor to .game-screen:
            bottom, full width within safe margins, same as every
            other story dialogue. */}
        <div className="absolute inset-0 z-10">
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
