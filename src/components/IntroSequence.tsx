import React, { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { getSlotSummaries, getSaves, loadGame } from "../lib/saveSystem";
import HumanPortrait from "./game/HumanPortrait";
import StdWindow from "./game/StdWindow";
import DialogueBox from "./game/DialogueBox";
import SettingsScreen from "./game/SettingsScreen";
import { frameAccent } from "../lib/gameSettings";
import { isConfirmKey, shoulderKey } from "../lib/buttonMode";
import { PINNED_SUBTITLE_FONT } from "../lib/fonts";
import { pickRotation, readLastTitleCreature, writeLastTitleCreature, type TitleCreature } from "../lib/titleRotation";
import YogifernoTitleWalk from "./game/YogifernoTitleWalk";
import TitleCreatureFigure from "./game/TitleCreatureFigure";
import LockedStage from "./game/LockedStage";
import { LOCKED_V32_MENU } from "../lib/lockedV32Menu";
import { playerSlot, HUMAN_SLOTS } from "../lib/humanSheets";
import { playBootSound, playPressStartSound } from "../lib/bootAudio";
import heavensentLogo from "../assets/ui/m-heavensent-studios-logo.png";
import mochiichaoLogo from "../assets/ui/mochiichao-main-logo.png";
import mochiichaoMenuLogo from "../assets/ui/mochiichao-main-logo-v32-matched.png";
import MainMenuBackground from "./game/MainMenuBackground";
import puffyCloud from "../assets/ui/puffy-cloud.svg";
import mochiiCutout from "../assets/title/mochii-walk-cutout.png";
import { playMusic, stopMusic } from "../lib/music";
import { playUiMove, playUiConfirm, playUiBack } from "../lib/audioRouting";
import TitleStartScreen from "./game/TitleStartScreen";
import { getSelectedTitleStartScreenId, resolveTitleStartScreen } from "../lib/titleStartScreens";

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
  // Intro scene index, restored locked path (pre-#101): 4 text scenes,
  // any key or NEXT SCENE steps 1 -> 4, then TO TITLE.
  const [introScene, setIntroScene] = useState(0);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  // Playtest 2026-10-26 (live Pages, step 5): SAVE_SLOTS is shared by
  // CONTINUE and NEW GAME, and it used to load an occupied slot in
  // both cases — so NEW GAME with all 3 slots occupied dead-ended:
  // every slot just loaded an old save, no lab intro, no starter
  // pick. The mode below separates them: CONTINUE keeps the load
  // path, NEW GAME asks for an explicit overwrite confirmation per
  // occupied slot (pendingOverwriteSlot) before starting over.
  const [saveSlotsMode, setSaveSlotsMode] = useState<'CONTINUE' | 'NEW_GAME'>('CONTINUE');
  const [pendingOverwriteSlot, setPendingOverwriteSlot] = useState<number | null>(null);
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
  const setAutosaveHeldForSlot = useGameStore(s => s.setAutosaveHeldForSlot);
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
  // both twice. TITLE render itself is the locked phi stage below
  // (restoration 2026-10-26: StartScreenPlayer is a creator preset
  // only, never the default); this effect only adds the music layer.
  // playMusic() fades the old track out over 1000 ms (Pokemon
  // 60-frame fade) and is a no-op if the same track is already
  // playing, so B back to TITLE restarts title music without
  // restarting the loop on every render.
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
      if (e.key === 'ArrowUp') { e.preventDefault(); playUiMove(); setMainSelected(s => (s - 1 + itemCount) % itemCount); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); playUiMove(); setMainSelected(s => (s + 1) % itemCount); }
      else if (shoulderKey(e, settings.buttonMode) === 'L') { e.preventDefault(); playUiMove(); setMainSelected(s => (s - 1 + itemCount) % itemCount); }
      else if (shoulderKey(e, settings.buttonMode) === 'R') { e.preventDefault(); playUiMove(); setMainSelected(s => (s + 1) % itemCount); }
      else if (isConfirmKey(e, settings.buttonMode)) {
        e.preventDefault();
        playUiConfirm();
        const keys = hasSaves ? ['CONTINUE', 'NEW GAME', 'SETTINGS'] : ['NEW GAME', 'SETTINGS'];
        const key = keys[Math.min(mainSelected, keys.length - 1)];
        if (key === 'CONTINUE') { setSaveSlotsMode('CONTINUE'); setPhase("SAVE_SLOTS"); }
        else if (key === 'NEW GAME') { setSaveSlotsMode('NEW_GAME'); if (hasSaves) setShowOverwriteConfirm(true); else setPhase("SAVE_SLOTS"); }
        else if (key === 'SETTINGS') setPhase("SETTINGS");
      }
      else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') { playUiBack(); setPhase("TITLE"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, mainSelected, slots, showOverwriteConfirm, settings.buttonMode]);

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
      // Restored locked path: step scenes 1 -> 4, then TITLE.
      if (introScene < 3) setIntroScene(s => s + 1);
      else setPhase("TITLE");
    }
    else if (phase === "TITLE" && !titleFading) {
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
  }, [phase, titleFading]);

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
    // Restored locked intro path (pre-#101 structure): 4 text scenes,
    // any key or tap steps to the next scene, then TITLE. The player
    // (IntroVideoPlayer) is a creator preset only, never the default.
    // Music footer corrected: PR #104 wires the official intro track
    // (one-shot) by phase, so no "Music: GAP" label appears here.
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
            onMouseDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); advanceIntro(); }}
            className="game-button px-6 py-3 font-bold min-h-[48px] mt-6"
          >
            {introScene < 3 ? 'NEXT SCENE ►' : 'TO TITLE ►'}
          </button>
          <div className="text-gray-500 text-xs mt-4">Any key or tap steps to the next scene.</div>
        </div>
      </div>
    );
  }

  if (phase === "TITLE") {
    // Interchangeable start screens (opt-in only): when the player
    // picked a preset in Settings, the TITLE phase renders that
    // preset (TitleStartScreen) instead of the locked phi stage
    // below. Press behaviour is NOT redefined here: the existing
    // any-key/click handler above still plays the M3 chirp,
    // white-fades 350ms, then MAIN_MENU, and titleFading renders
    // the same white overlay below. With no pick (null), this
    // branch is skipped and the locked default below renders
    // exactly as before — the default title code is untouched,
    // not moved behind a flag. The pick is read at render time,
    // so a Settings change applies on the next TITLE visit.
    const selectedPreset = resolveTitleStartScreen(getSelectedTitleStartScreenId());
    if (selectedPreset) {
      return (
        <div className="game-screen bg-[#050810] relative overflow-hidden cursor-pointer">
          <TitleStartScreen preset={selectedPreset} />
          {titleFading && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-300" />}
        </div>
      );
    }
    // Restored locked title (phi spec, 1200x1500 stage): logo PNG in
    // its phi slot, DIAMOND VERSION banner, PRESS ANY KEY at the
    // bottom phi line, Heavensent logo in the copyright slot. The
    // logo is NEVER font text — the image below is Mars's uploaded
    // logo (black-space-only crop, transparent key; original file
    // untouched in ui-art). StartScreenPlayer is a creator preset
    // only, never the default. CONFLICT, reported not guessed: the
    // pre-#101 DOM title also showed a featured-creature figure
    // (rotation + YogifernoTitleWalk/TitleCreatureFigure, full
    // TitleScene canvases), but the locked phi spec has no figure
    // slot — press (927) to studio top (944) is a 17px gap — so no
    // figure is rendered on the default title. Figures live in
    // TitleScene/presets (Title Creatures lane's pieces, not built
    // here). The rotation bookkeeping effect above is kept so
    // preset screens still read the stored creature.
    return (
      <div className="game-screen bg-[#050810] relative overflow-hidden cursor-pointer">
        <LockedStage
          background={(
            <>
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent"></div>
            </>
          )}
        >
          {/* Shine sweep: white band moving left to right, twice
              (Ruby x+=4, brighten to 31 then darken to 0, twice).
              CSS animation stands in for the frame-count shine. */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 bottom-0 bg-white/20"
              style={{ width: 96, animation: 'title-shine 2.4s ease-in-out 2' }}
            />
          </div>
          <style>{`@keyframes title-shine { from { left: -10%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { left: 110%; opacity: 0; } } @keyframes title-slide-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes press-blink-first { 0%, 100% { opacity: 1; } } @keyframes press-blink { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }`}</style>

          {/* Logo slot: 900 wide, centre (600, 450). Crop aspect
              764x450 -> 530 tall, so top = 450 - 265 = 185. */}
          <img
            src={mochiichaoLogo}
            alt="MOCHIICHAO"
            className="absolute object-contain"
            style={{ left: 150, top: 185, width: 900, animation: 'title-slide-up 0.6s ease-out' }}
          />
          {/* DIAMOND VERSION banner: width 900/phi = 556, height 74,
              centre (600, 735). Subtitle font is PINNED (Mars font
              correction): this stack never changes, no font row
              touches it, in TITLE or MAIN_MENU. */}
          <div
            className="absolute flex items-center justify-center text-teal-300 font-bold drop-shadow-lg"
            style={{ left: 322, top: 698, width: 556, height: 74, fontSize: 44, letterSpacing: 4, animation: 'title-slide-up 0.6s ease-out 0.4s both', fontFamily: PINNED_SUBTITLE_FONT }}
          >
            ✦ DIAMOND VERSION ✦
          </div>
          {/* PRESS ANY KEY: bottom phi line y=927, blink FireRed
              tempo: 60 frames first, then 30 on / 30 off (CSS steps). */}
          <div
            className="absolute text-center text-white font-bold"
            style={{ left: 0, top: 905, width: 1200, fontSize: 44, letterSpacing: 6, animation: 'press-blink-first 1s steps(1) 1, press-blink 1s steps(1) 1s infinite' }}
          >
            PRESS ANY KEY
          </div>
          {/* Heavensent copyright slot: width 556, centre
              (600, 1222), top 944, bottom 1500. */}
          <img
            src={heavensentLogo}
            alt="M Heavensent Studios"
            className="absolute object-contain"
            style={{ left: 322, top: 944, width: 556, height: 556 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </LockedStage>

        {titleFading && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-300" />}
        <div className={`absolute bottom-4 left-0 right-0 text-center text-gray-600 text-[10px] tracking-widest z-10 transition-opacity duration-300 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
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

    // Main menu, locked v32 (restoration 2026-10-26): the stage
    // below renders the v32 spec (logo/cloud/panels at spec
    // coordinates) through LockedStage. CONTINUE is tall (stats
    // inside), NEW GAME short below it, SETTINGS below that.
    // Selected panel = gold frame + cursor. No Mystery Gift
    // equivalent, no version footer, no fake patch number.
    const mainItems = [
      ...(hasSaves ? [{ key: 'CONTINUE', tall: true }] : []),
      { key: 'NEW GAME', tall: false },
      { key: 'SETTINGS', tall: false },
    ];
    const safeMain = Math.min(mainSelected, mainItems.length - 1);

    const activateMain = (key: string) => {
      playUiConfirm();
      if (key === 'CONTINUE' && hasSaves) { setSaveSlotsMode('CONTINUE'); setPhase("SAVE_SLOTS"); }
      else if (key === 'NEW GAME') {
        // Overwrite confirm BEFORE starting over, when a save exists.
        // No save is erased here: the existing flow goes to SAVE_SLOTS,
        // and a save is only replaced when the player later saves over
        // a slot in-game (SaveMenu). No second save system was built.
        setSaveSlotsMode('NEW_GAME');
        if (hasSaves) setShowOverwriteConfirm(true);
        else setPhase("SAVE_SLOTS");
      } else if (key === 'SETTINGS') {
        // Title/press/settings wiring: SETTINGS now opens the real
        // full-screen Settings screen (SettingsScreen), not a note.
        setPhase("SETTINGS");
      }
    };

    // Locked v32 main menu, rendered FROM the locked data
    // (src/lib/lockedV32Menu.ts) — same spec numbers as before,
    // now data the game loads instead of JSX literals, so a future
    // preset-select can swap the definition instead of rebuilding
    // the menu by hand. Panel labels follow MENU FONT (the only
    // menu text a font row touches); the logo is the image, never
    // font text. Selection, activation, saveSlotsMode, and the
    // overwrite dialog below are unchanged.
    const panelByKey = (key: string) => LOCKED_V32_MENU.panels.find(p => p.key === key)!;
    // Perfect-menu panel style (2026-10-26 rebuild, trace
    // perfect-menu-trace-2026-10-26.md, checked against Mars's
    // verification proof menu-perfect-verification-proof-20261026.gif):
    // FLAT picture fills (no gradients), 3px black border always
    // (the proof has no gold selection frame and no drop shadow —
    // selection is the cursor glyph), picture label font (upright
    // bold sans, NOT the slanted Yagiza that var(--menu-font) gives
    // by default). The MENU FONT Settings row is untouched; only
    // the LOCKED default panels use the picture label style.
    const v32PanelStyle = (panel: typeof LOCKED_V32_MENU.panels[number], _selected: boolean): React.CSSProperties => ({
      position: 'absolute', left: panel.x, top: panel.y, width: panel.w, height: panel.h,
      background: panel.fill,
      border: `${LOCKED_V32_MENU.panelStyle.borderWidth}px solid #000`,
      borderRadius: LOCKED_V32_MENU.panelStyle.borderRadius, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      fontFamily: LOCKED_V32_MENU.panelLabel.fontFamily,
      fontWeight: LOCKED_V32_MENU.panelLabel.fontWeight,
      fontStyle: LOCKED_V32_MENU.panelLabel.fontStyle,
    });
    // Proof pixels: CONTINUE + SETTINGS labels carry a white outline
    // halo; NEW GAME / BACK TO TITLE are plain black. The CONTINUE
    // sublabel in the proof also carries the thin white halo (see
    // the enlarged proof crop) — "plain sublabel" in Mars's 11:17
    // note is read as plain clean font, not no-halo, because the
    // proof file itself shows the halo. Halo method: 8-way
    // text-shadow, NOT WebkitTextStroke — stroke paints OVER the
    // fill and washed SETTINGS out at phone scale (shot1, 2026-10-26:
    // SETTINGS nearly unreadable while plain NEW GAME stayed solid
    // black). Shadow is painted BEHIND the fill, so the black core
    // stays solid at every scale and the white fringe still reads
    // as the proof's halo. labelStrokePx/sublabelStrokePx from the
    // locked data are the halo radii.
    const halo = (r: number): string =>
      [`${r}px 0 0 #fff`, `-${r}px 0 0 #fff`, `0 ${r}px 0 #fff`, `0 -${r}px 0 #fff`,
       `${r}px ${r}px 0 #fff`, `-${r}px -${r}px 0 #fff`, `${r}px -${r}px 0 #fff`, `-${r}px ${r}px 0 #fff`].join(', ');
    const labelStroke = (key: string): React.CSSProperties =>
      (LOCKED_V32_MENU.panelLabel.strokeLabels as readonly string[]).includes(key)
        ? { textShadow: halo(LOCKED_V32_MENU.panelLabel.labelStrokePx) }
        : {};
    return (
      <div className="game-screen bg-[#050810] relative overflow-hidden" role="menu" aria-label="Main menu">
        <LockedStage
          background={(
            <div className="absolute inset-0 bg-white" />
          )}
        >
          {/* L0 clean background (2026-10-26 layer fix): white + rainbow
              arcs + SEPARATE animated confetti symbols, rebuilt from
              the v32 art in MainMenuBackground — the old v32 PNG was
              itself a full-menu picture (logo/cloud/panels painted
              in) and drawing it behind the live layers showed TWO
              menus. That PNG stays in the repo as the locked
              reference picture only and is never a background again.
              L1 logo/cloud/Mochii and L2 live panels below are the
              only logo/cloud/panel instances on screen. */}
          <MainMenuBackground />
          {/* Locked menu movement (menu-background-animation-spec.md,
              FireRed sine method): cloud + Mochii bob on SINE OFFSETS
              on top of their spec positions — base left/top never
              change, only the translate offset moves. Panels and logo
              stay static (tappable/readable). prefers-reduced-motion
              freezes to static (MainMenuBackground freezes too). */}
          <style>{`@keyframes menu-bob-cloud { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-${LOCKED_V32_MENU.cloud.bobAmp}px); } } @keyframes menu-bob-mochii { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-${LOCKED_V32_MENU.mochii.bobAmp}px); } } .menu-bob-cloud { animation: menu-bob-cloud ${LOCKED_V32_MENU.cloud.bobPeriod}s ease-in-out infinite; } .menu-bob-mochii { animation: menu-bob-mochii ${LOCKED_V32_MENU.mochii.bobPeriod}s ease-in-out infinite; } @media (prefers-reduced-motion: reduce) { .menu-bob-cloud, .menu-bob-mochii { animation: none; } }`}</style>
          {/* Logo slot from locked data: y180, width 900 (150-1050).
              Round-2 menu asset (v32-matched, 900x548, centre 454):
              upload letters with thick black outline + thick black
              orbit ring, built from the v32 picture's own geometry.
              The TITLE slot above keeps the original keyed upload
              (thin white orbit reads on the dark title background);
              the pale keyed upload is NOT used here -- it vanished
              on the white menu and Mars rejected it 2026-10-26. */}
          <img
            src={mochiichaoMenuLogo}
            alt="MOCHIICHAO"
            className="absolute object-contain"
            style={{ left: LOCKED_V32_MENU.logo.x, top: LOCKED_V32_MENU.logo.y, width: LOCKED_V32_MENU.logo.w }}
          />
          {/* Cloud from locked data: centre (600,738), 700x180.
              ORIGINAL cloud file restored (puffy-cloud.svg, viewBox
              600x280, exactly as used before): the #184 traced
              lookalike was a different-shaped file and is deleted
              by Mars's order 2026-10-26, so only the original
              cloud file remains. The original renders
              with objectFit fill into the locked 700x180 box, so no
              letterbox and no path change to the file itself. */}
          <img
            src={puffyCloud}
            alt=""
            className="absolute menu-bob-cloud"
            style={{ left: LOCKED_V32_MENU.cloud.x, top: LOCKED_V32_MENU.cloud.y, width: LOCKED_V32_MENU.cloud.w, height: LOCKED_V32_MENU.cloud.h, pointerEvents: 'none', objectFit: 'fill' }}
          />
          {/* Mochii mascot cue from locked data: x170, y~790, width 110. */}
          <img
            src={mochiiCutout}
            alt="Mochii"
            className="absolute object-contain menu-bob-mochii"
            style={{ left: LOCKED_V32_MENU.mochii.x, top: LOCKED_V32_MENU.mochii.y, width: LOCKED_V32_MENU.mochii.w, height: LOCKED_V32_MENU.mochii.h, pointerEvents: 'none' }}
          />
          {mainItems.map((item, i) => {
            const isSelected = i === safeMain;
            if (item.key === 'CONTINUE') {
              return (
                <button
                  key={item.key}
                  onClick={() => activateMain('CONTINUE')}
                  onMouseEnter={() => setMainSelected(i)}
                  onFocus={() => setMainSelected(i)}
                  style={v32PanelStyle(panelByKey('CONTINUE'), isSelected)}
                >
                  <div className="tracking-widest text-black" style={{ fontSize: panelByKey('CONTINUE').labelSize, fontWeight: LOCKED_V32_MENU.panelLabel.fontWeight, ...labelStroke('CONTINUE') }}>
                    <span style={{ color: settings.cursorColor }}>{isSelected ? `${cursorGlyph} ` : ''}</span>CONTINUE
                  </div>
                  {latestData ? (
                    <>
                      <div className="text-black" style={{ fontSize: 19, textShadow: halo(LOCKED_V32_MENU.panelLabel.sublabelStrokePx) }}>Player: {latestData.playerName || 'Netrunner'} · Caught: {caughtCount} · Team: {teamCount} · CR: {crBalance ?? '—'}</div>
                      <div className="text-black" style={{ fontSize: 17, textShadow: halo(LOCKED_V32_MENU.panelLabel.sublabelStrokePx) }}>Map: {latestData.currentMap || '—'} · Saved: {latestSave ? new Date(latestSave.timestamp).toLocaleString() : '—'}</div>
                    </>
                  ) : (
                    <div className="text-black" style={{ fontSize: 19, textShadow: halo(LOCKED_V32_MENU.panelLabel.sublabelStrokePx) }}>Player • Roster • Dojos • CR • Last: Core Fragment</div>
                  )}
                </button>
              );
            }
            const panel = panelByKey(item.key);
            return (
              <button
                key={item.key}
                onClick={() => activateMain(item.key)}
                onMouseEnter={() => setMainSelected(i)}
                onFocus={() => setMainSelected(i)}
                style={v32PanelStyle(panel, isSelected)}
              >
                <div className="tracking-widest text-black" style={{ fontSize: panel.labelSize, fontWeight: LOCKED_V32_MENU.panelLabel.fontWeight, ...labelStroke(item.key) }}>
                  <span style={{ color: settings.cursorColor }}>{isSelected ? `${cursorGlyph} ` : ''}</span>{item.key}
                </div>
              </button>
            );
          })}
          <button
            onClick={() => { playUiBack(); setPhase("TITLE"); }}
            style={v32PanelStyle(panelByKey('BACK TO TITLE'), false)}
          >
            <div className="tracking-widest text-black" style={{ fontSize: panelByKey('BACK TO TITLE').labelSize, fontWeight: LOCKED_V32_MENU.panelLabel.fontWeight }}>◄ BACK TO TITLE (B)</div>
          </button>
        </LockedStage>

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
    // NEW GAME mode: an occupied slot no longer loads that save (the
    // playtest dead-end). It opens the overwrite confirmation below,
    // and only "Start new game here" enters the Prof intro for that
    // slot — nothing is erased at confirmation time; the old save is
    // replaced only when the player later saves over the slot in-game.
    // CONTINUE mode keeps the old load path unchanged.
    const pendingSave = pendingOverwriteSlot !== null ? slots[pendingOverwriteSlot - 1] : null;
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center justify-center p-4 relative">
        <h2 className="text-teal-300 text-xl font-bold tracking-widest mb-8">SELECT A SAVE FILE</h2>
        <div className="text-slate-400 text-sm mb-4 text-center">
          {saveSlotsMode === 'NEW_GAME'
            ? 'Empty slots start fresh. Occupied slots ask before starting over — nothing is erased until you save over a slot.'
            : 'Choose a save to continue, or an empty slot to start fresh.'}
        </div>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {[1,2,3].map(slot => {
            const save = slots[slot-1];
            const isNewGameOccupied = saveSlotsMode === 'NEW_GAME' && !!save;
            return (
              <StdWindow
                key={slot}
                className="p-4 text-left flex justify-between items-center cursor-pointer"
                onClick={() => {
                  if (save) {
                    if (isNewGameOccupied) {
                      setPendingOverwriteSlot(slot);
                      return;
                    }
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
                {save && !isNewGameOccupied && <span className="text-yellow-400 font-bold">LOAD ►</span>}
                {isNewGameOccupied && <span className="text-yellow-400 font-bold">START OVER ►</span>}
              </StdWindow>
            )
          })}
        </div>
        <button onClick={() => setPhase("MAIN_MENU")} className="game-button mt-8 px-4 py-3 font-bold min-h-[48px]">
           ◄ BACK
        </button>
        {pendingOverwriteSlot !== null && (
          <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="game-panel p-6 w-full max-w-sm">
              <div className="text-white font-bold text-lg mb-2">Start over in SLOT {pendingOverwriteSlot}?</div>
              <p className="text-sm text-slate-400 mb-4">
                {pendingSave ? `${pendingSave.player} — ${pendingSave.map}. ` : ''}
                This starts the Prof intro and starter pick for a new game in this slot. The old save is NOT erased here — autosaves for this slot are held until you save manually, and it is only replaced if you later save over this slot in-game.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => { const s = pendingOverwriteSlot; setPendingOverwriteSlot(null); setAutosaveHeldForSlot(s); setSelectedSlot(s); setPhase("PROF_INTRO_1"); }} className="game-button px-4 py-2 font-bold min-h-[48px]">Start new game here</button>
                <button onClick={() => { const file = getSaves(pendingOverwriteSlot).sort((a,b)=>b.timestamp-a.timestamp)[0]; setPendingOverwriteSlot(null); if (file) { loadState(file.data); onEnterWorld(); } }} className="game-button px-4 py-2 font-bold min-h-[48px]">Load this save instead</button>
                <button onClick={() => setPendingOverwriteSlot(null)} className="game-button px-4 py-2 font-bold min-h-[48px]">Cancel</button>
              </div>
            </div>
          </div>
        )}
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
