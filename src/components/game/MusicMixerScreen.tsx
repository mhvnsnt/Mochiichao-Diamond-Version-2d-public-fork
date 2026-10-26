import React, { useCallback, useEffect, useRef, useState } from 'react';
import StdWindow from './StdWindow';
import {
  MixerChannelState, MIXER_LOOP_SECONDS, DEFAULT_PROJECT_NAME,
  defaultChannels, mixerStemUrl,
} from '../../lib/musicMixerProject';
import { playMusic, stopMusic } from '../../lib/music';

/**
 * Music Mixer — its own full menu under Settings (Mars, 2026-10-26).
 *
 * Pokemon menu structure (FireRed option_menu.c, structure only — see
 * SettingsScreen's header, which documents the same translation):
 * dedicated full screen, header window, list/channel windows, help bar,
 * cursor rows, CANCEL/BACK saves + exits. The mixer window itself is the
 * one exception Mars asked for in his own words: an FL-Studio-style
 * draggable window (drag its header to move it out of the way, DOCK to
 * put it back). No other screen gets draggable windows from this file.
 *
 * Audio is a real Web Audio graph, no library: one AudioContext, one
 * looped BufferSource per stem -> GainNode (fader) -> StereoPannerNode
 * -> master GainNode -> destination. All stems are exactly
 * 41.143 s, so looped sources stay in sync with each other. The game
 * music (main menu loop) is stopped while the mixer is open and
 * restarted on exit, so the mix never plays over the menu track.
 *
 * FL Studio load behaviour: the default project (title v3 + vocal) is
 * loaded on open, like FL's demo song. DELETE removes a channel from
 * the project (never the file). NEW clears to an empty project.
 * LOAD DEFAULT restores the default project at any time.
 */

type Transport = 'stopped' | 'loading' | 'playing' | 'error';

interface ChannelNodes {
  source: AudioBufferSourceNode;
  gain: GainNode;
  pan: StereoPannerNode;
}

function effectiveGain(ch: MixerChannelState, anySolo: boolean): number {
  if (ch.muted) return 0;
  if (anySolo && !ch.solo) return 0;
  return ch.gain;
}

export default function MusicMixerScreen({ onBack }: { onBack: () => void }) {
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [channels, setChannels] = useState<MixerChannelState[]>(() => defaultChannels());
  const [transport, setTransport] = useState<Transport>('stopped');
  const [loadError, setLoadError] = useState('');
  const [masterGain, setMasterGain] = useState(0.8);
  const [masterMuted, setMasterMuted] = useState(false);
  // Draggable window position: null = docked (centred). Mars asked for
  // draggable FL-style windows; drag the gold header to move it.
  const [winPos, setWinPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const winRef = useRef<HTMLDivElement | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const nodesRef = useRef<Map<string, ChannelNodes>>(new Map());
  const channelsRef = useRef(channels);
  channelsRef.current = channels;
  const playingRef = useRef(false);

  const ensureContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctx();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = masterMuted ? 0 : masterGain;
      masterRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, [masterGain, masterMuted]);

  const stopAll = useCallback(() => {
    playingRef.current = false;
    nodesRef.current.forEach((n) => {
      try { n.source.stop(); } catch { /* already stopped */ }
      try { n.source.disconnect(); } catch { /* already disconnected */ }
    });
    nodesRef.current.clear();
    setTransport('stopped');
  }, []);

  // Game music off while mixing, back on when leaving (see header).
  useEffect(() => {
    stopMusic(0);
    return () => {
      stopAll();
      if (ctxRef.current) void ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
      playMusic('mainMenu', 500);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live fader/pan/mute/solo changes reach playing nodes immediately.
  useEffect(() => {
    const anySolo = channels.some((c) => c.solo);
    nodesRef.current.forEach((n, id) => {
      const ch = channels.find((c) => c.stem.id === id);
      if (!ch) return;
      n.gain.gain.value = effectiveGain(ch, anySolo);
      n.pan.pan.value = ch.pan;
    });
  }, [channels]);

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = masterMuted ? 0 : masterGain;
  }, [masterGain, masterMuted]);

  // Escape / B exits the mixer (Settings owns no keys while it is open).
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

  const play = useCallback(async () => {
    if (channelsRef.current.length === 0) return;
    setLoadError('');
    setTransport('loading');
    try {
      const ctx = ensureContext();
      await ctx.resume();
      if (!masterRef.current) {
        masterRef.current = ctx.createGain();
        masterRef.current.gain.value = masterMuted ? 0 : masterGain;
        masterRef.current.connect(ctx.destination);
      }
      const anySolo = channelsRef.current.some((c) => c.solo);
      const startAt = ctx.currentTime + 0.1;
      for (const ch of channelsRef.current) {
        let buf = buffersRef.current.get(ch.stem.id);
        if (!buf) {
          const res = await fetch(mixerStemUrl(ch.stem));
          if (!res.ok) throw new Error(`${ch.stem.label} failed to load (${res.status})`);
          const data = await res.arrayBuffer();
          buf = await ctx.decodeAudioData(data);
          buffersRef.current.set(ch.stem.id, buf);
        }
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.loop = true;
        const gain = ctx.createGain();
        gain.gain.value = effectiveGain(ch, anySolo);
        const pan = ctx.createStereoPanner();
        pan.pan.value = ch.pan;
        source.connect(gain);
        gain.connect(pan);
        pan.connect(masterRef.current);
        source.start(startAt);
        nodesRef.current.set(ch.stem.id, { source, gain, pan });
      }
      playingRef.current = true;
      setTransport('playing');
    } catch (err) {
      stopAll();
      setLoadError(err instanceof Error ? err.message : 'Playback failed');
      setTransport('error');
    }
  }, [ensureContext, masterGain, masterMuted, stopAll]);

  const patchChannel = (id: string, patch: Partial<MixerChannelState>) => {
    setChannels((prev) => prev.map((c) => (c.stem.id === id ? { ...c, ...patch } : c)));
  };

  const deleteChannel = (id: string) => {
    const n = nodesRef.current.get(id);
    if (n) {
      try { n.source.stop(); } catch { /* already stopped */ }
      try { n.source.disconnect(); } catch { /* already disconnected */ }
      nodesRef.current.delete(id);
    }
    setChannels((prev) => prev.filter((c) => c.stem.id !== id));
  };

  const newProject = () => {
    stopAll();
    setChannels([]);
    setProjectName('Untitled Mix');
    setLoadError('');
  };

  const loadDefault = () => {
    stopAll();
    setChannels(defaultChannels());
    setProjectName(DEFAULT_PROJECT_NAME);
    setLoadError('');
  };

  const onHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = winRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: winPos ? winPos.x : rect.left, origY: winPos ? winPos.y : rect.top,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const x = Math.max(0, Math.min(window.innerWidth - 120, d.origX + e.clientX - d.startX));
    const y = Math.max(0, Math.min(window.innerHeight - 60, d.origY + e.clientY - d.startY));
    setWinPos({ x, y });
  };

  const onHeaderPointerUp = () => { dragRef.current = null; };

  const winStyle: React.CSSProperties = winPos
    ? { position: 'absolute', left: winPos.x, top: winPos.y, maxWidth: 'min(1100px, 96vw)' }
    : { position: 'relative', maxWidth: '1100px', width: '96vw', margin: '0 auto' };

  return (
    <div className="game-screen" style={{ position: 'relative', overflow: 'auto', padding: '1rem' }}>
      <div ref={winRef} style={winStyle}>
        <StdWindow selected>
          <div
            onPointerDown={onHeaderPointerDown}
            onPointerMove={onHeaderPointerMove}
            onPointerUp={onHeaderPointerUp}
            style={{ cursor: 'grab', touchAction: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
            title="Drag this header to move the mixer window (FL Studio style)"
          >
            <h2 style={{ margin: 0 }}>♪ MUSIC MIXER</h2>
            <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>drag header to move • DOCK to re-centre</span>
          </div>

          <p style={{ margin: '0.5rem 0' }}>
            Project: <strong>{projectName}</strong>
            {' '}— {channels.length} stem{channels.length === 1 ? '' : 's'} • loop {MIXER_LOOP_SECONDS}s • game music pauses while mixing
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {transport === 'playing'
              ? <button className="game-button" onClick={stopAll}>■ STOP</button>
              : <button className="game-button" onClick={() => void play()} disabled={channels.length === 0 || transport === 'loading'}>{transport === 'loading' ? 'LOADING…' : '▶ PLAY'}</button>}
            <button className="game-button" onClick={newProject}>NEW (empty project)</button>
            <button className="game-button" onClick={loadDefault}>LOAD DEFAULT</button>
            <button className="game-button" onClick={() => setWinPos(null)}>DOCK</button>
            <button className="game-button" onClick={onBack}>◄ BACK TO SETTINGS</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <label>MASTER
              <input type="range" min={0} max={1.5} step={0.01} value={masterGain} onChange={(e) => setMasterGain(Number(e.target.value))} style={{ marginLeft: '0.5rem' }} />
              {' '}{Math.round(masterGain * 100)}%
            </label>
            <button className="game-button" onClick={() => setMasterMuted((m) => !m)}>{masterMuted ? 'UNMUTE MASTER' : 'MUTE MASTER'}</button>
            {transport === 'error' && <span style={{ color: '#ef4444' }}>Playback error: {loadError}</span>}
            {loadError && transport !== 'error' && <span style={{ color: '#ef4444' }}>{loadError}</span>}
          </div>

          {channels.length === 0 ? (
            <StdWindow>
              <p style={{ margin: 0 }}>
                Empty project — nothing to mix. Hit <strong>LOAD DEFAULT</strong> to bring back
                the title v3 + vocal stems, or delete nothing: there is nothing here, and
                that is the point of NEW. Stem files are never deleted, only this project.
              </p>
            </StdWindow>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {channels.map((ch) => (
                <StdWindow key={ch.stem.id} selected={ch.solo} style={{ minWidth: '170px', flex: '0 0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{ch.stem.label}</strong>
                    <button className="game-button" onClick={() => deleteChannel(ch.stem.id)} title={`Delete ${ch.stem.label} from this project (file is kept)`}>✕ DELETE</button>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{ch.stem.kind === 'vocal' ? 'Vocal layer' : 'Title v3 stem'} • {MIXER_LOOP_SECONDS}s loop</div>
                  <label style={{ display: 'block', marginTop: '0.5rem' }}>VOL {Math.round(ch.gain * 100)}%
                    <input type="range" min={0} max={1.5} step={0.01} value={ch.gain} onChange={(e) => patchChannel(ch.stem.id, { gain: Number(e.target.value) })} style={{ width: '100%' }} />
                  </label>
                  <label style={{ display: 'block', marginTop: '0.25rem' }}>PAN {ch.pan === 0 ? 'C' : ch.pan < 0 ? `L${Math.round(-ch.pan * 100)}` : `R${Math.round(ch.pan * 100)}`}
                    <input type="range" min={-1} max={1} step={0.01} value={ch.pan} onChange={(e) => patchChannel(ch.stem.id, { pan: Number(e.target.value) })} style={{ width: '100%' }} />
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button className="game-button" onClick={() => patchChannel(ch.stem.id, { muted: !ch.muted })}>{ch.muted ? 'UNMUTE' : 'MUTE'}</button>
                    <button className="game-button" onClick={() => patchChannel(ch.stem.id, { solo: !ch.solo })}>{ch.solo ? 'UNSOLO' : 'SOLO'}</button>
                  </div>
                </StdWindow>
              ))}
            </div>
          )}

          <p style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: 0 }}>
            Help: PLAY loops all stems in sync (all 41.143 s). MUTE silences one channel;
            SOLO silences everything except soloed channels. Sliders work live while playing.
            Back (or Esc / B) stops playback and returns to Settings.
          </p>
        </StdWindow>
      </div>
    </div>
  );
}
