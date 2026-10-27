import React, { useEffect, useState } from 'react';
import StdWindow from './StdWindow';
import {
  LOCKED_START_SCREEN_LAYOUT, LOCKED_START_SCREEN_PRESET,
  START_SCREEN_BACKGROUNDS, START_SCREEN_CREATURE_POOL, START_SCREEN_PARTICLES,
  loadStartScreenPresets, resetToLockedStartScreenPreset, saveStartScreenPreset,
  startScreenCreatureArtAvailable, startScreenCreatureArtGapNames,
  startScreenPresetToJson,
  type StartScreenBackground, type StartScreenParticle, type StartScreenPreset,
} from '../../lib/startScreenPreset';
import { TITLE_BIOMES } from '../../lib/titleBiomes';

/**
 * CREATE START SCREEN — full dedicated screen (batch E, spec section 2).
 * Path: Settings -> Menu Creator -> CREATE START SCREEN.
 * Pokemon layout first, Y2K skin on top (StdWindow panels, same
 * treatment as SettingsScreen), B: BACK returns to Menu Creator.
 * Presets only at first; the locked default is never overwritten.
 *
 * Timeline: same timeline as the Intro Video Creator, ONE scene —
 * this screen has no scene list and no scene add/duplicate/delete.
 *
 * What you change HERE (slot content only):
 *   CREATURE — rotation-pool name (Yogiferno art exists; other 9/10
 *     pool names are GAP labels, never fake art).
 *   BACKGROUND — one of the 8 shipped biomes, or PAINTED (GAP:
 *     painted backgrounds are not shipped).
 *   PARTICLES — fire / snow / rain / leaves / embers / smoke / none.
 * What you do NOT change here (no second system):
 *   moving a slot = Layout Editor, restyling a slot = UI Creator.
 *   The locked slot rows below are read-only and say so.
 *
 * Preview: slot boxes on the 1200x1500 canvas, scaled to fit.
 * PRESS ANY KEY blinks Pokemon-style: first 60 frames on, then
 * 30 frames on / 30 frames off (1000ms first, then 500ms / 500ms
 * at 60fps, FireRed title_screen.c Task_TitleScreen_BlinkPressStart).
 * This is the CREATOR preview only — saved presets are
 * selectable presets (restoration 2026-10-26: the default TITLE
 * phase is the locked phi stage, never a saved preset);
 * Phase 2 export (FFmpeg desktop / MediaRecorder) is still GAP.
 * No Pokemon sprites, dialogue, music, cries, names, or art.
 */

const L = LOCKED_START_SCREEN_LAYOUT;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

const cycle = <T,>(arr: T[], cur: T, dir: 1 | -1): T => {
  const i = arr.indexOf(cur);
  return arr[(i < 0 ? 0 : i + dir + arr.length) % arr.length];
};

export default function StartScreenCreator({ onBack }: { onBack: () => void }) {
  const [preset, setPreset] = useState<StartScreenPreset>(() => ({ ...LOCKED_START_SCREEN_PRESET, layout: { ...L } }));
  const [presets, setPresets] = useState<StartScreenPreset[]>(() => loadStartScreenPresets());
  const [presetName, setPresetName] = useState('My Start Screen 1');
  const [savedMsg, setSavedMsg] = useState('');
  const [blinkOn, setBlinkOn] = useState(true);

  // PRESS ANY KEY blink, Pokemon-style (FireRed title_screen.c
  // Task_TitleScreen_BlinkPressStart): first 60 frames on, then
  // 30 frames on / 30 frames off at 60fps. Preview-only tick:
  // on for 1000ms first, then alternate 500ms off / 500ms on.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (on: boolean, delay: number) => {
      setBlinkOn(on);
      timer = setTimeout(() => schedule(!on, 500), delay);
    };
    timer = setTimeout(() => schedule(false, 500), 1000);
    return () => clearTimeout(timer);
  }, []);

  // B: BACK (Escape / b) returns to Menu Creator. Arrow/Enter keys
  // are handled by the row buttons; this screen adds no global
  // cursor handling so it cannot fight SettingsScreen's handler.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  const set = (patch: Partial<StartScreenPreset>) => setPreset(p => ({ ...p, ...patch }));
  const artGap = !startScreenCreatureArtAvailable(preset.creature);
  const biome = preset.background === 'painted' ? null : TITLE_BIOMES[preset.background];

  const saveAsPreset = () => {
    const name = presetName.trim() || 'My Start Screen 1';
    const next: StartScreenPreset = { ...preset, name, savedAt: Date.now() };
    if (!saveStartScreenPreset(next)) {
      setSavedMsg('Not saved: the locked default name is never overwritten. Pick another name.');
      return;
    }
    setPresets(loadStartScreenPresets());
    setPreset(next);
    setSavedMsg(`Saved preset "${name}". Presets are selectable in the creator; the default TITLE phase stays the locked phi stage (restoration 2026-10-26) and is never overwritten by a preset.`);
  };

  const loadPreset = (name: string) => {
    const found = loadStartScreenPresets().find(p => p.name === name);
    if (!found) return;
    setPreset({ ...found, layout: { ...L } });
    setPresets(loadStartScreenPresets());
    setSavedMsg(`Loaded preset "${name}".`);
  };

  const resetLocked = () => {
    setPreset(resetToLockedStartScreenPreset());
    setSavedMsg('Reset to Locked Default. The locked preset itself was never overwritten.');
  };

  const exportJson = () => {
    const blob = new Blob([startScreenPresetToJson(preset)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(preset.name || 'start-screen').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.start-screen.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSavedMsg('Preset exported as JSON (our own format, layout-as-data).');
  };

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="relative z-10 w-full max-w-lg flex flex-col gap-3 max-h-full overflow-y-auto">
        <StdWindow className="p-4 text-center">
          <div className="text-white text-xl font-black tracking-widest">CREATE START SCREEN</div>
          <div className="text-blue-200 text-xs mt-1">Pokemon layout, Y2K skin — full screen, not a popup · One scene · Presets only</div>
        </StdWindow>

        {/* Preview: slot boxes on the 1200x1500 canvas, scaled to fit. */}
        <StdWindow className="p-2">
          <div className="relative w-full mx-auto overflow-hidden rounded bg-[#0b1226]" style={{ aspectRatio: '1200 / 1500', maxHeight: 420 }}>
            {/* Background slot: biome colour wash, or GAP for painted. */}
            <div className="absolute inset-0" style={{ background: biome ? `linear-gradient(${biome.sky2}, ${biome.sky})` : '#1e293b' }} />
            <div className="absolute top-2 left-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded">
              BACKGROUND: {preset.background === 'painted' ? 'PAINTED — GAP (not shipped)' : `${preset.background.toUpperCase()} biome`}
            </div>
            <div className="absolute top-8 left-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded">
              PARTICLES: {preset.particles.toUpperCase()}
            </div>
            {/* Logo slot: phi 900 wide, centre (600, 450). */}
            <div className="absolute border-2 border-yellow-300 bg-black/40 flex items-center justify-center"
              style={{ width: pct(900, 1200), left: pct(600 - 450, 1200), top: pct(450 - 40, 1500), height: 80 }}>
              <span className="text-yellow-200 font-black tracking-widest text-lg">MOCHIICHAO</span>
            </div>
            {/* DIAMOND VERSION subtitle slot: phi 556, centre (600, 735), font PINNED. */}
            <div className="absolute border-2 border-cyan-300 bg-black/40 flex items-center justify-center"
              style={{ width: pct(556, 1200), left: pct(600 - 278, 1200), top: pct(735 - 18, 1500), height: 36 }}>
              <span className="text-cyan-100 font-bold tracking-[0.3em] text-sm">DIAMOND VERSION</span>
            </div>
            {/* PRESS ANY KEY slot: y = 927, blink 60-first / 30 on / 30 off. */}
            <div className="absolute w-full text-center" style={{ top: pct(927, 1500) }}>
              <span className="text-white font-bold tracking-widest text-sm" style={{ opacity: blinkOn ? 1 : 0 }}>PRESS ANY KEY</span>
            </div>
            {/* Creature slot: rotation pool, preview box only (position NOT locked). */}
            <div className="absolute border-2 border-dashed border-fuchsia-300 bg-black/40 flex flex-col items-center justify-center px-2 text-center"
              style={{ width: pct(556, 1200), left: pct(600 - 278, 1200), top: pct(990, 1500), height: 110 }}>
              <span className="text-fuchsia-100 font-bold text-sm">{preset.creature.toUpperCase()}</span>
              <span className="text-white/80 text-[10px] mt-1">
                {artGap ? 'Creature cutout: GAP — clean cutout not shipped yet (never fake art)' : 'Creature cutout: Yogiferno clean cutout (shipped)'}
              </span>
            </div>
            {/* Studio logo slot: 556 wide, centre (600, 1222). */}
            <div className="absolute border-2 border-white/70 bg-black/40 flex items-center justify-center"
              style={{ width: pct(556, 1200), left: pct(600 - 278, 1200), top: pct(1222 - 18, 1500), height: 36 }}>
              <span className="text-white/90 font-bold tracking-widest text-xs">M-HEAVENSENT STUDIOS</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2 text-center">
            Preview only — locked slots at spec positions. Saved presets are selectable presets; the default TITLE phase stays the locked phi stage.
          </div>
        </StdWindow>

        <StdWindow className="p-2">
          <div className="text-xs text-slate-300 font-bold px-3 pt-1 pb-2 tracking-widest">SLOT CONTENT — CHANGE HERE</div>
          <CreatorRow label="CREATURE" value={preset.creature}
            note={artGap ? 'GAP: clean cutout not shipped for this creature yet. Yogiferno is the only pool name with shipped art.' : 'Yogiferno clean cutout shipped (PR #33).'}
            onLeft={() => set({ creature: cycle(START_SCREEN_CREATURE_POOL, preset.creature, -1) })}
            onRight={() => set({ creature: cycle(START_SCREEN_CREATURE_POOL, preset.creature, 1) })} />
          <CreatorRow label="BACKGROUND" value={preset.background}
            note={preset.background === 'painted' ? 'GAP: painted backgrounds are not shipped. Pick a biome for a real background.' : biome?.label || ''}
            onLeft={() => set({ background: cycle(START_SCREEN_BACKGROUNDS, preset.background, -1) })}
            onRight={() => set({ background: cycle(START_SCREEN_BACKGROUNDS, preset.background, 1) })} />
          <CreatorRow label="PARTICLES" value={preset.particles}
            note="fire / snow / rain / leaves / embers / smoke — same particle set as the intro timeline."
            onLeft={() => set({ particles: cycle(START_SCREEN_PARTICLES, preset.particles, -1) })}
            onRight={() => set({ particles: cycle(START_SCREEN_PARTICLES, preset.particles, 1) })} />
        </StdWindow>

        <StdWindow className="p-2">
          <div className="text-xs text-slate-300 font-bold px-3 pt-1 pb-2 tracking-widest">LOCKED LAYOUT — READ ONLY HERE</div>
          <CreatorRow label="LOGO SLOT" value="900 wide · (600, 450)" note="Locked. Move it in the Layout Editor, restyle it in the UI Creator — no second system here." onLeft={() => undefined} onRight={() => undefined} />
          <CreatorRow label="SUBTITLE SLOT" value="556 wide · (600, 735) · PINNED" note="DIAMOND VERSION subtitle font is PINNED and never changes — no font row touches it." onLeft={() => undefined} onRight={() => undefined} />
          <CreatorRow label="PRESS ANY KEY" value="y 927 · blink 60-first/30/30" note="Locked. Blink is 60 frames first on, then 30 frames on / 30 frames off." onLeft={() => undefined} onRight={() => undefined} />
          <CreatorRow label="STUDIO LOGO" value="556 wide · (600, 1222)" note="Locked. Move it in the Layout Editor, restyle it in the UI Creator." onLeft={() => undefined} onRight={() => undefined} />
          <CreatorRow label="TIMELINE" value="1 scene · loop" note="Start screen = one scene. Scene list / add / duplicate / delete belongs to CREATE INTRO VIDEO (separate batch)." onLeft={() => undefined} onRight={() => undefined} />
        </StdWindow>

        <StdWindow className="p-2">
          <label className="text-xs text-slate-300 block px-3 pt-1 mb-1">Preset name (for SAVE AS PRESET)</label>
          <input value={presetName} onChange={e => setPresetName(e.target.value)}
            className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 text-white min-h-[48px]" />
          <div className="flex flex-wrap gap-2 px-3 py-3">
            <button onClick={saveAsPreset} className="game-button px-4 py-3 font-bold min-h-[48px]">SAVE AS PRESET</button>
            <button onClick={exportJson} className="game-button px-4 py-3 font-bold min-h-[48px]">EXPORT JSON</button>
            <button onClick={resetLocked} className="game-button px-4 py-3 font-bold min-h-[48px]">RESET TO LOCKED DEFAULT</button>
          </div>
          <div className="px-3 pb-2">
            <label className="text-xs text-slate-300 block mb-1">LOAD PRESET</label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button key={p.name} onClick={() => loadPreset(p.name)}
                  className={`px-3 py-2 rounded border text-sm font-bold min-h-[44px] ${p.name === preset.name ? 'bg-yellow-300/20 border-yellow-300 text-yellow-200' : 'bg-black/40 border-white/30 text-white'}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="px-3 pb-2 text-xs text-slate-400">
            GAP in this batch (later batches, not claimed): Phase 2 export (FFmpeg desktop / MediaRecorder); Blender .blend export. Saved presets are selectable in the creator; the default TITLE phase is the locked phi stage (restoration 2026-10-26), never a saved preset. Creature cutout GAP: {startScreenCreatureArtGapNames().join(', ')}.
          </div>
        </StdWindow>

        {savedMsg && <div className="text-center text-teal-300 text-sm font-bold">{savedMsg}</div>}

        <StdWindow className="px-3 py-2 text-sm text-slate-200 text-center">
          LEFT/RIGHT: CHANGE &nbsp; B: BACK
        </StdWindow>
        <button onClick={onBack} className="game-button px-4 py-3 font-bold min-h-[48px]">BACK TO MENU CREATOR</button>
      </div>
    </div>
  );
}

function CreatorRow({ label, value, note, onLeft, onRight }: {
  label: string; value: string; note?: string; onLeft: () => void; onRight: () => void;
}) {
  return (
    <div className="w-full text-left px-3 py-2 flex flex-col gap-1 rounded">
      <div className="flex justify-between items-baseline gap-2">
        <span className="font-bold tracking-widest text-white text-sm">{label}</span>
        <span className="flex items-center gap-2">
          <button onClick={onLeft} aria-label={`Previous ${label}`} className="px-2 py-1 rounded bg-white/10 text-white font-bold min-h-[36px] min-w-[36px]">◄</button>
          <span className="text-yellow-300 font-bold text-sm text-right min-w-[110px]">{value}</span>
          <button onClick={onRight} aria-label={`Next ${label}`} className="px-2 py-1 rounded bg-white/10 text-white font-bold min-h-[36px] min-w-[36px]">►</button>
        </span>
      </div>
      {note && <div className="text-xs text-slate-400">{note}</div>}
    </div>
  );
}
