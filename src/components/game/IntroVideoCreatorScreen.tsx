/**
 * CREATE INTRO VIDEO — full dedicated screen (batch D, spec section 1).
 *
 * Path: Settings -> Menu Creator -> CREATE INTRO VIDEO.
 * Pokemon layout first (dedicated full screen, scene list on top,
 * timeline ruler at the bottom, B: BACK), Y2K skin on top.
 * Presets only at first; the locked default is never overwritten.
 *
 * What is wired here (creator screens + preset JSON only):
 * - Scene list: add / duplicate / delete / reorder (up/down).
 * - Per scene: background (8 biomes + painted GAP), creatures
 *   (rotation pool, clean cutouts only), particles (6), camera
 *   (pan / zoom / shake, Pokemon title sine math), text (logo /
 *   subtitle PINNED font / dialogue, font rows from FONT_OPTIONS —
 *   NOT Pokemon fonts), music slot (name only, GAP if empty),
 *   duration, transition (fade black/white, shutter wipe, slide).
 * - Timeline ruler: seconds + frames (60 fps), playhead, play /
 *   pause, scrub, keyframes (position / scale / opacity / camera).
 * - Creator preview with any-key-skips (same rule as the Pokemon
 *   intro: any key while previewing stops the preview).
 * - SAVE AS PRESET + LOAD PRESET + Reset to Locked Default +
 *   export JSON (our own format, layout-as-data idea, not Tuxemon
 *   code).
 *
 * What is GAP here, labelled in the UI, never claimed:
 * - Playing a saved preset as the game's intro: select the Pixi
 *   player in the Presets section (classic 4 scenes are the
 *   default). This screen's preview is DOM/CSS applying the same
 *   camera + keyframe math; Pixi playback from a preset is the
 *   preset option, not the default.
 * - Video file export is LIVE since Creator Phase 2: EXPORT VIDEO
 *   below switches this full screen to export mode (MediaRecorder
 *   web route, WebM, silent — the music slot is name-only, so no
 *   audio track; FFmpeg stays a desktop install note for WebM->MP4
 *   or for adding audio later). See src/lib/introVideoExport.ts.
 * - Painted backgrounds and 9/10 creature cutouts (see
 *   introVideoCreator.ts GAP notes). No Pokemon sprites, dialogue,
 *   music, cries or art anywhere in this screen.
 * - CREATE START SCREEN (separate batch, not touched here).
 */

import React, { useEffect, useRef, useState } from 'react';
import StdWindow from './StdWindow';
import {
  INTRO_VIDEO_FPS, INTRO_VIDEO_PARTICLES, INTRO_VIDEO_TRANSITIONS,
  INTRO_VIDEO_BIOMES, INTRO_VIDEO_CREATURES, INTRO_VIDEO_CUTOUT_STATUS,
  INTRO_VIDEO_CUTOUT_NOTE, INTRO_VIDEO_PRESETS_KEY,
  defaultIntroVideoScene, defaultIntroVideoCamera,
  createLockedDefaultPreset, cameraAt, keyframedValue,
  secondsToFrames, totalDuration, biomeCss, presetToJson,
  parseIntroVideoPresetJson, loadIntroVideoPresets, saveIntroVideoPreset,
  nextIntroVideoId, LOCKED_INTRO_VIDEO_PRESET_NAME,
  type IntroVideoPreset, type IntroVideoScene, type IntroVideoKeyframe,
  type IntroVideoKeyframeTarget, type IntroVideoParticle,
  type IntroVideoTransition, type IntroVideoBackground,
} from '../../lib/introVideoCreator';
import { FONT_OPTIONS, PINNED_SUBTITLE_FONT } from '../../lib/fonts';
import { getIntroPlayer, setIntroPlayer } from '../../lib/titlePlayerPreference';
import { OpenSourceAssetPicker } from './OpenSourceAssetPicker';
import {
  INTRO_EXPORT_WIDTH, INTRO_EXPORT_HEIGHT,
  drawIntroFrame, startCanvasRecording, pickExportMimeType,
  exportFileExtension, loadComponentImages,
  type CanvasRecording, type ExportFrameImages,
} from '../../lib/introVideoExport';
import {
  openSourceAssetsByIds, openSourceAssetUrl, openSourceAttribution,
} from '../../lib/openSourceAssets';
import yogifernoWalkCutout from '../../assets/title/yogiferno-walk-cutout.png';

function clonePreset(p: IntroVideoPreset): IntroVideoPreset {
  return JSON.parse(JSON.stringify(p)) as IntroVideoPreset;
}

function isEditableTarget(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName || '';
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
}

export default function IntroVideoCreatorScreen({ onBack }: { onBack: () => void }) {
  const [preset, setPreset] = useState<IntroVideoPreset>(() => createLockedDefaultPreset());
  const [savedPresets, setSavedPresets] = useState<IntroVideoPreset[]>(() => loadIntroVideoPresets());
  const [sceneIndex, setSceneIndex] = useState(0);
  const [presetName, setPresetName] = useState('My Intro 1');
  const [loadName, setLoadName] = useState(LOCKED_INTRO_VIDEO_PRESET_NAME);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [skippedMsg, setSkippedMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [introPlayer, setIntroPlayerState] = useState(() => getIntroPlayer());
  const [newKeyframeTarget, setNewKeyframeTarget] = useState<IntroVideoKeyframeTarget>('position');
  const [importText, setImportText] = useState('');
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  // --- Video export mode (full screen, not a popup) ---------------
  const [exportMode, setExportMode] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [exportMime, setExportMime] = useState<string | null>(null);
  const [exportBlob, setExportBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingRef = useRef<CanvasRecording | null>(null);

  const scene: IntroVideoScene | undefined = preset.scenes[sceneIndex];
  const sceneCount = preset.scenes.length;

  // --- Playhead loop (60 fps timeline, per selected scene) ---------
  useEffect(() => {
    if (!playing || !scene) return;
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setPlayhead(prev => {
        const next = prev + dt;
        if (next >= scene.duration) {
          setPlaying(false);
          setSkippedMsg('End of scene — press PLAY to replay.');
          return scene.duration;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, scene?.id, scene?.duration]);

  // --- Any-key-skips in preview + B: BACK ---------------------------
  // In export mode keys do nothing (export has its own buttons) so
  // a stray key cannot exit the creator mid-recording.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (exportMode) return;
      if (isEditableTarget(e)) return;
      if (playing) {
        e.preventDefault();
        setPlaying(false);
        setSkippedMsg('Preview skipped (any key) — press PLAY to resume.');
        return;
      }
      if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playing, onBack, exportMode]);

  useEffect(() => { setPlayhead(0); setPlaying(false); setSkippedMsg(''); }, [sceneIndex]);

  // --- Scene list operations ----------------------------------------
  const patchScene = (patch: Partial<IntroVideoScene>) => {
    if (!scene) return;
    setPreset(prev => ({
      ...prev,
      scenes: prev.scenes.map((s, i) => (i === sceneIndex ? { ...s, ...patch } : s)),
    }));
  };

  const addScene = () => {
    const next = defaultIntroVideoScene(`Scene ${sceneCount + 1}`);
    setPreset(prev => ({ ...prev, scenes: [...prev.scenes, next] }));
    setSceneIndex(sceneCount);
    setMsg(`Scene added (${sceneCount + 1} total).`);
  };

  const duplicateScene = () => {
    if (!scene) return;
    const copy: IntroVideoScene = {
      ...JSON.parse(JSON.stringify(scene)),
      id: nextIntroVideoId('scene'),
      name: `${scene.name} copy`,
    };
    setPreset(prev => ({
      ...prev,
      scenes: [...prev.scenes.slice(0, sceneIndex + 1), copy, ...prev.scenes.slice(sceneIndex + 1)],
    }));
    setSceneIndex(sceneIndex + 1);
    setMsg('Scene duplicated.');
  };

  const deleteScene = () => {
    if (sceneCount <= 1) {
      setMsg('Cannot delete the last scene — a preset needs at least one scene.');
      return;
    }
    setPreset(prev => ({ ...prev, scenes: prev.scenes.filter((_, i) => i !== sceneIndex) }));
    setSceneIndex(Math.max(0, sceneIndex - 1));
    setMsg('Scene deleted.');
  };

  const moveScene = (dir: -1 | 1) => {
    const target = sceneIndex + dir;
    if (target < 0 || target >= sceneCount) return;
    setPreset(prev => {
      const scenes = [...prev.scenes];
      const tmp = scenes[sceneIndex];
      scenes[sceneIndex] = scenes[target];
      scenes[target] = tmp;
      return { ...prev, scenes };
    });
    setSceneIndex(target);
  };

  const toggleCreature = (name: string) => {
    if (!scene) return;
    const has = scene.creatures.includes(name);
    patchScene({
      creatures: has ? scene.creatures.filter(c => c !== name) : [...scene.creatures, name],
    });
  };

  const addKeyframe = () => {
    if (!scene) return;
    const base: IntroVideoKeyframe = {
      id: nextIntroVideoId('key'),
      time: Math.min(playhead, scene.duration),
      target: newKeyframeTarget,
    };
    if (newKeyframeTarget === 'position') { base.x = 0; base.y = 0; }
    if (newKeyframeTarget === 'scale') base.scale = 1;
    if (newKeyframeTarget === 'opacity') base.opacity = 1;
    if (newKeyframeTarget === 'camera') base.camera = defaultIntroVideoCamera();
    patchScene({ keyframes: [...scene.keyframes, base].sort((a, b) => a.time - b.time) });
    setMsg(`Keyframe added at ${base.time.toFixed(2)}s (${newKeyframeTarget}).`);
  };

  const deleteKeyframe = (id: string) => {
    if (!scene) return;
    patchScene({ keyframes: scene.keyframes.filter(k => k.id !== id) });
  };

  // --- Presets --------------------------------------------------------
  const saveAsPreset = () => {
    const name = presetName.trim() || 'My Intro 1';
    if (name === LOCKED_INTRO_VIDEO_PRESET_NAME) {
      setMsg('Locked Default can never be overwritten — pick another name.');
      return;
    }
    const next: IntroVideoPreset = { ...clonePreset(preset), name, createdAt: Date.now(), locked: false };
    if (saveIntroVideoPreset(next)) {
      setSavedPresets(loadIntroVideoPresets());
      setMsg(`Saved as preset "${name}" (localStorage key ${INTRO_VIDEO_PRESETS_KEY}). It plays when the Pixi intro player is selected below.`);
    } else {
      setMsg('Save failed (storage unavailable).');
    }
  };

  const loadPresetByName = (name: string) => {
    setLoadName(name);
    const found = loadIntroVideoPresets().find(p => p.name === name) || savedPresets.find(p => p.name === name);
    if (found) {
      setPreset(clonePreset(found));
      setSceneIndex(0);
      setMsg(found.locked ? 'Locked Default loaded (reset).' : `Preset "${name}" loaded.`);
    }
  };

  const resetLocked = () => {
    setPreset(createLockedDefaultPreset());
    setSceneIndex(0);
    setLoadName(LOCKED_INTRO_VIDEO_PRESET_NAME);
    setMsg('Reset to Locked Default.');
  };

  const exportJson = () => {
    const blob = new Blob([presetToJson({ ...preset, name: presetName.trim() || preset.name })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(presetName.trim() || preset.name || 'intro-preset').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Preset exported as JSON (our own format).');
  };

  const importJson = () => {
    const { preset: parsed, errors } = parseIntroVideoPresetJson(importText);
    if (!parsed) {
      setMsg(`Import failed: ${errors.join(' ')}`);
      return;
    }
    if (parsed.name === LOCKED_INTRO_VIDEO_PRESET_NAME) parsed.locked = true;
    setPreset(clonePreset(parsed));
    setSceneIndex(0);
    setMsg(`Imported preset "${parsed.name}" (${parsed.scenes.length} scene(s)). Save it to keep it.`);
  };

  // --- Video export (MediaRecorder, full-screen export mode) ------
  const toggleComponent = (id: string) => {
    if (!scene) return;
    const cur = scene.openSourceComponentIds || [];
    patchScene({
      openSourceComponentIds: cur.includes(id) ? cur.filter(c => c !== id) : [...cur, id],
    });
  };

  const loadYogifernoImage = (): Promise<HTMLImageElement | null> => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = yogifernoWalkCutout;
  });

  const startExport = async () => {
    const canvas = exportCanvasRef.current;
    if (!canvas) {
      setExportStatus('Export canvas is not ready — try again.');
      return;
    }
    const snapshot: IntroVideoPreset = { ...clonePreset(preset), name: presetName.trim() || preset.name };
    const mime = pickExportMimeType();
    if (!mime) {
      setExportStatus('Video export is not supported in this browser (no MediaRecorder mime type).');
      return;
    }
    setExportStatus('Loading cutout + picked components…');
    setExportUrl(null);
    setExportBlob(null);
    setExportProgress(0);
    const allIds = [...new Set(snapshot.scenes.flatMap(s => s.openSourceComponentIds || []))];
    const images: ExportFrameImages = {
      yogiferno: await loadYogifernoImage(),
      components: await loadComponentImages(allIds),
    };
    const duration = totalDuration(snapshot);
    try {
      const rec = startCanvasRecording(
        canvas, duration,
        (ctx, elapsed) => drawIntroFrame(ctx, snapshot, elapsed, images),
        (elapsed, total) => setExportProgress(total > 0 ? elapsed / total : 0),
      );
      recordingRef.current = rec;
      setExportMime(rec.mimeType);
      setRecording(true);
      setExportStatus(`Recording… ${duration.toFixed(1)}s total, ${rec.mimeType}. Keep this screen open until it finishes.`);
      const blob = await rec.done;
      setRecording(false);
      setExportBlob(blob);
      setExportUrl(URL.createObjectURL(blob));
      setExportStatus(`Done — ${duration.toFixed(1)}s video ready (${rec.mimeType}, ${(blob.size / 1024).toFixed(0)} KB, silent — music slot is name-only). Press DOWNLOAD VIDEO.`);
    } catch (err) {
      setRecording(false);
      if (err instanceof Error && err.message === 'cancelled') {
        setExportStatus('Recording cancelled.');
      } else {
        setExportStatus(`Export failed: ${err instanceof Error ? err.message : 'unknown error'}`);
      }
    }
  };

  const cancelExport = () => {
    recordingRef.current?.cancel();
    recordingRef.current = null;
  };

  const downloadExport = () => {
    if (!exportBlob) return;
    const ext = exportMime ? exportFileExtension(exportMime) : 'webm';
    const url = URL.createObjectURL(exportBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(presetName.trim() || preset.name || 'intro-preset').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (exportMode) {
    const duration = totalDuration(preset);
    return (
      <div className="game-screen bg-[#050810] flex flex-col items-center relative overflow-hidden p-4">
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-3 max-h-full overflow-y-auto">
          <StdWindow style={{ borderRadius: 12, borderWidth: 2, borderColor: '#ffffff', boxShadow: '0 0 0 2px #22d3ee55, 0 6px 24px rgba(0,0,0,0.45)' }} className="p-4 text-center">
            <div className="text-white text-xl font-black tracking-widest">EXPORT INTRO VIDEO</div>
            <div className="text-cyan-200 text-xs mt-1">
              Full screen, not a popup · MediaRecorder web route · {INTRO_EXPORT_WIDTH}x{INTRO_EXPORT_HEIGHT} · {duration.toFixed(1)}s total · {preset.scenes.length} scene(s)
            </div>
            <div className="text-slate-300 text-xs mt-1">
              The canvas below IS the video being recorded (canvas-2D render of the same timeline data as Pixi playback).
              Silent: the music slot is a name only and ships empty, so no audio track is recorded. Painted backgrounds render
              the slate fallback + GAP label; only Yogiferno has a clean cutout, other creatures render GAP labels — never fake art.
              Need MP4 or an audio track later? Desktop FFmpeg install note only: ffmpeg -i intro-export.webm intro-export.mp4.
            </div>
          </StdWindow>
          <StdWindow style={{ borderRadius: 12, borderWidth: 2, borderColor: '#ffffff', boxShadow: '0 0 0 2px #22d3ee55, 0 6px 24px rgba(0,0,0,0.45)' }} className="p-3">
            <canvas ref={exportCanvasRef} width={INTRO_EXPORT_WIDTH} height={INTRO_EXPORT_HEIGHT}
              className="w-full rounded border border-white/30 bg-black" />
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={startExport} disabled={recording} className="game-button px-3 py-2 font-bold min-h-[44px] text-sm">● RECORD VIDEO ({duration.toFixed(1)}s)</button>
              {recording && <button onClick={cancelExport} className="game-button px-3 py-2 font-bold min-h-[44px] text-sm">CANCEL RECORDING</button>}
              {exportBlob && <button onClick={downloadExport} className="game-button px-3 py-2 font-bold min-h-[44px] text-sm">DOWNLOAD VIDEO ↓</button>}
              <button onClick={() => { if (!recording) setExportMode(false); }} disabled={recording} className="game-button px-3 py-2 font-bold min-h-[44px] text-sm">BACK TO EDITOR</button>
            </div>
            <div className="mt-2">
              <div className="w-full h-3 bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-yellow-300" style={{ width: `${Math.round(exportProgress * 100)}%` }} />
              </div>
              <div className="text-white text-xs mt-1">{Math.round(exportProgress * 100)}% · {exportStatus || 'Press RECORD VIDEO to record this preset.'}</div>
              {exportMime && <div className="text-slate-400 text-xs">Format: {exportMime} ({exportFileExtension(exportMime)}).</div>}
            </div>
          </StdWindow>
          <button onClick={() => { if (!recording) setExportMode(false); }} disabled={recording} className="game-button px-4 py-3 font-bold min-h-[48px]">BACK TO EDITOR</button>
        </div>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="game-screen bg-[#050810] flex items-center justify-center p-4">
        <StdWindow className="p-4 text-white">No scene — press B to go back.</StdWindow>
      </div>
    );
  }

  const cam = cameraAt(scene, playhead);
  const colors = biomeCss(scene.background);
  const logoFont = FONT_OPTIONS.find(f => f.id === scene.text.logoFontId)?.family || 'Trebuchet MS';
  const dialogueFont = FONT_OPTIONS.find(f => f.id === scene.text.dialogueFontId)?.family || 'Trebuchet MS';
  const posX = keyframedValue(scene, 'position', 'x', playhead, 0);
  const posY = keyframedValue(scene, 'position', 'y', playhead, 0);
  const scale = keyframedValue(scene, 'scale', 'scale', playhead, 1);
  const opacity = keyframedValue(scene, 'opacity', 'opacity', playhead, 1);
  const particleGlyph = INTRO_VIDEO_PARTICLES.find(p => p.id === scene.particle)?.glyph || '';

  const panel: React.CSSProperties = {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    boxShadow: '0 0 0 2px #22d3ee55, 0 6px 24px rgba(0,0,0,0.45)',
  };
  const num = 'w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]';
  const btn = 'game-button px-3 py-2 font-bold min-h-[44px] text-sm';

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-900/40 to-transparent"></div>
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-3 max-h-full overflow-y-auto">
        <StdWindow style={panel} className="p-4 text-center">
          <div className="text-white text-xl font-black tracking-widest">CREATE INTRO VIDEO</div>
          <div className="text-cyan-200 text-xs mt-1">
            Settings → Menu Creator → CREATE INTRO VIDEO · Pokemon layout, Y2K skin · Full screen, not a popup · B: BACK
          </div>
          <div className="text-slate-300 text-xs mt-1">
            Preset: <b className="text-yellow-300">{preset.name}</b>
            {preset.locked ? ' (LOCKED — never overwritten)' : ''} · {sceneCount} scene(s) · {totalDuration(preset).toFixed(1)}s total
          </div>
        </StdWindow>

        {/* Scene list */}
        <StdWindow style={panel} className="p-3">
          <div className="text-white font-bold tracking-widest text-sm mb-2">SCENE LIST — add / duplicate / delete / reorder</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {preset.scenes.map((s, i) => (
              <button key={s.id} onClick={() => setSceneIndex(i)}
                className={`px-3 py-2 rounded font-bold text-sm min-h-[44px] ${i === sceneIndex ? 'bg-yellow-300 text-black ring-2 ring-white' : 'bg-white/10 text-white'}`}>
                {i + 1}. {s.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={addScene} className={btn}>+ ADD SCENE</button>
            <button onClick={duplicateScene} className={btn}>DUPLICATE</button>
            <button onClick={deleteScene} className={btn}>DELETE</button>
            <button onClick={() => moveScene(-1)} className={btn}>↑ MOVE UP</button>
            <button onClick={() => moveScene(1)} className={btn}>↓ MOVE DOWN</button>
          </div>
        </StdWindow>

        {/* Preview + timeline */}
        <StdWindow style={panel} className="p-3">
          <div className="text-white font-bold tracking-widest text-sm mb-2">PREVIEW — any key skips while playing</div>
          <div className="relative w-full h-[220px] rounded overflow-hidden border border-white/30"
            style={{ background: `linear-gradient(${colors.sky}, ${colors.sky} 62%, ${colors.ground} 62%, ${colors.ground})` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                transform: `translate(${cam.x + cam.shakeX}px, ${cam.y + cam.shakeY}px) scale(${cam.zoom})`,
                opacity,
              }}>
              <div style={{ transform: `translate(${posX}px, ${posY}px) scale(${scale})`, textAlign: 'center' }}>
                <div className="text-white font-black tracking-widest" style={{ fontFamily: logoFont, fontSize: 30, textShadow: '0 2px 8px #000' }}>
                  {scene.text.logo || '—'}
                </div>
                <div className="text-white tracking-widest" style={{ fontFamily: PINNED_SUBTITLE_FONT, fontSize: 15 }}>
                  {scene.text.subtitle || '—'} <span className="text-yellow-300 text-xs">(subtitle font PINNED)</span>
                </div>
                <div className="flex gap-2 mt-2 justify-center flex-wrap">
                  {scene.creatures.map(c => (
                    <span key={c} className="px-2 py-1 rounded bg-black/50 text-white text-xs font-bold">
                      {c} {INTRO_VIDEO_CUTOUT_STATUS[c] === 'ready' ? '✓ cutout' : '· GAP cutout'}
                    </span>
                  ))}
                  {scene.creatures.length === 0 && <span className="text-white/80 text-xs">No creatures in this scene.</span>}
                </div>
                <div className="text-white text-xs mt-2" style={{ fontFamily: dialogueFont }}>{scene.text.dialogue}</div>
              </div>
            </div>
            <div className="absolute top-2 left-2 text-white text-lg">{particleGlyph} {scene.particle}</div>
            <div className="absolute top-2 right-2 text-white text-xs bg-black/50 rounded px-2 py-1">
              {scene.background === 'painted' ? 'Painted background · GAP' : `Biome: ${scene.background}`} · {scene.transition}
            </div>
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 rounded px-2 py-1">
              Camera pan {cam.x.toFixed(1)} / {cam.y.toFixed(1)} · zoom {cam.zoom.toFixed(2)} · shake {scene.camera.shake}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-white text-xs font-bold">
              <span>TIMELINE RULER — {INTRO_VIDEO_FPS} fps</span>
              <span>Playhead {playhead.toFixed(2)}s · frame {secondsToFrames(playhead)} / {secondsToFrames(scene.duration)} · scene {scene.duration}s</span>
            </div>
            <input type="range" min={0} max={scene.duration} step={1 / INTRO_VIDEO_FPS} value={playhead}
              onChange={e => { setPlaying(false); setPlayhead(Number(e.target.value)); }}
              className="w-full" aria-label="Scrub timeline" />
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <button onClick={() => { setSkippedMsg(''); setPlaying(p => !p); }} className={btn}>{playing ? '❚❚ PAUSE' : '▶ PLAY'}</button>
              <button onClick={() => { setPlaying(false); setPlayhead(0); setSkippedMsg(''); }} className={btn}>⏮ RESTART</button>
              <span className="text-slate-300 text-xs">Scrub, play/pause, keyframes below. Any key while playing skips (stops) the preview.</span>
            </div>
            {skippedMsg && <div className="text-teal-300 text-xs mt-1 font-bold">{skippedMsg}</div>}
          </div>

          <div className="mt-3">
            <div className="text-white font-bold tracking-widest text-sm mb-1">KEYFRAMES — position / scale / opacity / camera</div>
            {scene.keyframes.length === 0 && <div className="text-slate-400 text-xs">No keyframes in this scene yet.</div>}
            {scene.keyframes.map(k => (
              <div key={k.id} className="flex flex-wrap gap-2 items-center text-white text-xs mb-1">
                <span className="font-bold">{k.time.toFixed(2)}s · {k.target}</span>
                <span className="text-slate-300">
                  {k.target === 'position' && `x ${k.x} / y ${k.y}`}
                  {k.target === 'scale' && `scale ${k.scale}`}
                  {k.target === 'opacity' && `opacity ${k.opacity}`}
                  {k.target === 'camera' && `pan ${k.camera?.panX}/${k.camera?.panY} zoom ${k.camera?.zoom} shake ${k.camera?.shake}`}
                </span>
                <button onClick={() => deleteKeyframe(k.id)} className="game-button px-2 py-1 text-xs font-bold">DELETE</button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 mt-2">
              <select value={newKeyframeTarget} onChange={e => setNewKeyframeTarget(e.target.value as IntroVideoKeyframeTarget)} className="bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                <option value="position">position</option>
                <option value="scale">scale</option>
                <option value="opacity">opacity</option>
                <option value="camera">camera</option>
              </select>
              <button onClick={addKeyframe} className={btn}>+ KEYFRAME AT PLAYHEAD ({playhead.toFixed(2)}s)</button>
            </div>
          </div>
        </StdWindow>

        {/* Per-scene editors */}
        <StdWindow style={panel} className="p-3">
          <div className="text-white font-bold tracking-widest text-sm mb-2">SCENE {sceneIndex + 1} — {scene.name}</div>
          <label className="text-xs text-slate-300 block mb-1">Scene name</label>
          <input value={scene.name} onChange={e => patchScene({ name: e.target.value })} className={num} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Background — 8 biomes + painted</label>
              <select value={scene.background}
                onChange={e => patchScene({ background: e.target.value as IntroVideoBackground })}
                className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {INTRO_VIDEO_BIOMES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                <option value="painted">Painted background — GAP (Title Backgrounds lane, not yet delivered)</option>
              </select>
              {scene.background === 'painted' && <div className="text-yellow-300 text-xs mt-1">GAP: painted backgrounds are not in the repo yet. Preview shows a placeholder gradient, never fake art.</div>}
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Particles</label>
              <select value={scene.particle}
                onChange={e => patchScene({ particle: e.target.value as IntroVideoParticle })}
                className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {INTRO_VIDEO_PARTICLES.map(p => <option key={p.id} value={p.id}>{p.glyph} {p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Duration (seconds)</label>
              <input type="number" min={0.5} step={0.5} value={scene.duration}
                onChange={e => patchScene({ duration: Math.max(0.5, Number(e.target.value) || 0.5) })} className={num} />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Transition (into next scene)</label>
              <select value={scene.transition}
                onChange={e => patchScene({ transition: e.target.value as IntroVideoTransition })}
                className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {INTRO_VIDEO_TRANSITIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-white font-bold text-sm mb-1">Creatures — rotation pool, clean cutouts only</div>
            <div className="flex flex-wrap gap-2">
              {INTRO_VIDEO_CREATURES.map(c => (
                <button key={c} onClick={() => toggleCreature(c)}
                  className={`px-2 py-2 rounded text-xs font-bold min-h-[44px] ${scene.creatures.includes(c) ? 'bg-yellow-300 text-black' : 'bg-white/10 text-white'}`}>
                  {scene.creatures.includes(c) ? '✓ ' : ''}{c} {INTRO_VIDEO_CUTOUT_STATUS[c] === 'ready' ? '✓ cutout' : '· GAP'}
                </button>
              ))}
            </div>
            <div className="text-slate-400 text-xs mt-1">{INTRO_VIDEO_CUTOUT_NOTE}</div>
          </div>

          <div className="mt-3">
            <div className="text-white font-bold text-sm mb-1">Camera — pan / zoom / shake (Pokemon title sine math)</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <label className="text-xs text-slate-300">Pan X ({scene.camera.panX})<input type="range" min={-100} max={100} value={scene.camera.panX} onChange={e => patchScene({ camera: { ...scene.camera, panX: Number(e.target.value) } })} className="w-full" /></label>
              <label className="text-xs text-slate-300">Pan Y ({scene.camera.panY})<input type="range" min={-100} max={100} value={scene.camera.panY} onChange={e => patchScene({ camera: { ...scene.camera, panY: Number(e.target.value) } })} className="w-full" /></label>
              <label className="text-xs text-slate-300">Zoom ({scene.camera.zoom})<input type="range" min={0.5} max={2} step={0.05} value={scene.camera.zoom} onChange={e => patchScene({ camera: { ...scene.camera, zoom: Number(e.target.value) } })} className="w-full" /></label>
              <label className="text-xs text-slate-300">Shake ({scene.camera.shake})<input type="range" min={0} max={20} value={scene.camera.shake} onChange={e => patchScene({ camera: { ...scene.camera, shake: Number(e.target.value) } })} className="w-full" /></label>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Logo text</label>
              <input value={scene.text.logo} onChange={e => patchScene({ text: { ...scene.text, logo: e.target.value } })} className={num} />
              <label className="text-xs text-slate-300 block mt-2 mb-1">Logo font (font row, NOT a Pokemon font)</label>
              <select value={scene.text.logoFontId} onChange={e => patchScene({ text: { ...scene.text, logoFontId: e.target.value } })} className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.status})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Subtitle text</label>
              <input value={scene.text.subtitle} onChange={e => patchScene({ text: { ...scene.text, subtitle: e.target.value } })} className={num} />
              <div className="text-yellow-300 text-xs mt-2">Subtitle font is PINNED ({PINNED_SUBTITLE_FONT}) — this row cannot change it.</div>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Dialogue text</label>
              <input value={scene.text.dialogue} onChange={e => patchScene({ text: { ...scene.text, dialogue: e.target.value } })} className={num} />
              <label className="text-xs text-slate-300 block mt-2 mb-1">Dialogue font (font row, NOT a Pokemon font)</label>
              <select value={scene.text.dialogueFontId} onChange={e => patchScene({ text: { ...scene.text, dialogueFontId: e.target.value } })} className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.status})</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-slate-300 block mb-1">Music slot — original music only (name only; empty = GAP)</label>
            <input value={scene.music} placeholder="GAP — no original music shipped yet"
              onChange={e => patchScene({ music: e.target.value })} className={num} />
            {scene.music === '' && <div className="text-yellow-300 text-xs mt-1">GAP: no music file is attached. Never Pokemon music or cries.</div>}
          </div>
        </StdWindow>

        {/* Open-source components — current scene */}
        <StdWindow style={panel} className="p-3">
          <OpenSourceAssetPicker
            title={`OPEN-SOURCE COMPONENTS — SCENE ${sceneIndex + 1} (${scene.name})`}
            selectedIds={scene.openSourceComponentIds || []}
            onToggle={toggleComponent}
          />
          <div className="text-slate-400 text-xs mt-2">
            Picked components are stored on this scene, shown here, and drawn into the exported video where the kind fits
            (panel behind the text block, particle/icon as particle sprites). Other kinds are stored on the preset and shown
            in this picker; they do not change the video frame. Attribution travels with the pick:
            {openSourceAssetsByIds(scene.openSourceComponentIds || []).map(a => (
              <span key={a.id} className="block text-slate-300">· {a.id} — {openSourceAttribution(a)}</span>
            ))}
            {(scene.openSourceComponentIds || []).length === 0 && <span className="block">No components picked for this scene yet.</span>}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {openSourceAssetsByIds(scene.openSourceComponentIds || []).map(a => {
              const url = openSourceAssetUrl(a);
              return url && /\.(png|svg)$/i.test(a.file) ? (
                <img key={a.id} src={url} alt={a.id} title={`${a.id} — ${openSourceAttribution(a)}`} className="h-10 w-auto max-w-[120px] object-contain bg-black/30 rounded border border-white/20" />
              ) : null;
            })}
          </div>
        </StdWindow>

        {/* Presets */}
        <StdWindow style={panel} className="p-3">
          <div className="text-white font-bold tracking-widest text-sm mb-2">SAVE AS PRESET · LOAD PRESET · EXPORT JSON · EXPORT VIDEO</div>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <span className="text-xs text-slate-300">INTRO PLAYER:</span>
            <button onClick={() => { setIntroPlayer('classic'); setIntroPlayerState('classic'); }} className={`${btn} ${introPlayer === 'classic' ? 'ring-2 ring-yellow-300' : ''}`}>Classic 4 scenes (default)</button>
            <button onClick={() => { setIntroPlayer('pixi'); setIntroPlayerState('pixi'); }} className={`${btn} ${introPlayer === 'pixi' ? 'ring-2 ring-yellow-300' : ''}`}>Pixi player (preset)</button>
            <span className="text-xs text-slate-400">Classic 4 scenes are the default intro. Pixi player plays the most recently saved preset, else the locked default — selectable here, never the default.</span>
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-300 block mb-1">Preset name (for SAVE AS PRESET)</label>
              <input value={presetName} onChange={e => setPresetName(e.target.value)} className={num} />
            </div>
            <button onClick={saveAsPreset} className={btn}>SAVE AS PRESET</button>
            <button onClick={exportJson} className={btn}>EXPORT JSON ↓</button>
            <button onClick={() => setExportMode(true)} className={btn}>EXPORT VIDEO ►</button>
            <button onClick={resetLocked} className={btn}>RESET TO LOCKED DEFAULT</button>
          </div>
          <div className="flex flex-wrap gap-2 items-end mt-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-300 block mb-1">Load preset (replaces the working intro; locked default stays available)</label>
              <select value={loadName} onChange={e => loadPresetByName(e.target.value)} className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
                {savedPresets.map(p => <option key={p.name} value={p.name}>{p.name}{p.locked ? ' (LOCKED)' : ''} — {p.scenes.length} scene(s)</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-300 block mb-1">Import preset JSON (paste, then IMPORT — validates before applying)</label>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/30 rounded px-2 py-2 text-white" />
            <button onClick={importJson} className={`${btn} mt-1`}>IMPORT JSON</button>
          </div>
          {msg && <div className="text-teal-300 text-sm mt-2 font-bold">{msg}</div>}
          <div className="text-slate-400 text-xs mt-2">
            Video export is LIVE (Creator Phase 2, MediaRecorder web route, WebM, silent — music slot is name-only, so no audio
            track; FFmpeg desktop install note only for WebM-&gt;MP4 or adding audio later). Still GAP, not claimed: Blender project
            export (.blend, desktop only). Blender concepts are translated to this JSON — the Blender binary is NOT shipped;
            install note only (GPL desktop tool, blender.org). No Pokemon sprites, dialogue, music, cries or art in this screen.
          </div>
        </StdWindow>

        <button onClick={onBack} className="game-button px-4 py-3 font-bold min-h-[48px]">B: BACK TO MENU CREATOR</button>
      </div>
    </div>
  );
}
