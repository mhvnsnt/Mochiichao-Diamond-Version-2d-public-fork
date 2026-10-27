/**
 * Audio routing — Settings SOUND row (MONO / STEREO), wired 2026-10-25.
 *
 * Structure translated from FireRed option_menu.c + m4a.c (structure
 * only, no Pokemon code, audio, music, or cries): on save, FireRed
 * calls SetPokemonCryStereo(optionsSound), which switches the GBA
 * sound hardware between a stereo output (left/right channels kept
 * separate) and a mono output (channels mixed). This module is the
 * web equivalent, built on the browser's own Web Audio API:
 *
 *   source -> bus (music / sfx / ui) -> mode graph -> destination
 *
 * - STEREO: buses feed a StereoPannerNode at pan 0, so a source's
 *   left/right channels reach the speakers unchanged.
 * - MONO: buses feed a ChannelSplitterNode (2 channels) whose two
 *   outputs each pass through a 0.5 gain and are summed into a
 *   single-channel ChannelMergerNode — a real downmix, not a flag.
 *   A left-panned tone and a right-panned tone therefore sound
 *   identical (centred) in MONO and distinct in STEREO.
 *
 * Why no Howler.js / @pixi/sound here, although the new-pulls
 * research recommended picking one of them (both MIT): this game
 * has no audio engine at all yet — no music track, no SFX bank,
 * no UI sounds are wired anywhere in this build — so adding a
 * dependency (and a package.json / package-lock change) to wrap
 * zero sounds would be scaffolding for nothing. This minimal
 * original Web Audio layer closes the SOUND gap with zero new
 * dependencies, and a later lane can swap the buses for Howler
 * or @pixi/sound behind the same playTone / playAudioUrl calls.
 *
 * What is genuinely wired here, and what is not:
 * - WIRED: the SOUND setting itself — setSoundMode() rebuilds the
 *   graph, the stored setting is applied at startup (main.tsx)
 *   and on every settings save (gameStore.setSettings / loadState),
 *   and the Settings SOUND row applies it live while cycling.
 * - WIRED: an audible proof — playUiPreview() plays two short
 *   original synthesized tones (oscillator, no audio file, no
 *   Pokemon sound) panned left then right through the ui bus, so
 *   the MONO vs STEREO difference is hearable on the SOUND row.
 * - WIRED, settled roles (Mars decisions, never swapped): BOOT =
 *   UI Art Option B rising arpeggio, PRESS-START = M3 Mochii
 *   Chirp (PR #36). bootAudio.ts (PR #79) plays those exact
 *   repo files; this file's former wrappers were deleted in the
 *   PR #73 resolution so only one boot/press-start path ships. M3 is NEVER
 *   used for boot and Option B is NEVER used for press-start.
 *   The Option B file ships in the repo at
 *   public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav
 *   (verified in the tree at this batch's base — not the
 *   shorthand 'boot-sounds/...' path, which is not a repo path).
 *   If either file were missing, its play call would fail closed
 *   (fetch 404 -> false) and the slot would stay labelled GAP —
 *   no replacement sound is ever invented here.
 * - Autoplay honesty: press-start always follows a user gesture,
 *   so it always plays. Boot has no preceding gesture on a cold
 *   load, so a browser may keep the context suspended through
 *   the 2.5s BOOT window and the scheduled boot sound is dropped
 *   when BOOT unmounts; on any later boot (e.g. Quit to Title,
 *   after clicks) the context is running and boot plays. A
 *   first-gesture unlock retry is NEED, not faked here.
 * - NEED (labelled, not faked): music / SFX / UI sound banks
 *   themselves (no tracks are shipped for them), and fade /
 *   ducking (nothing plays long enough to fade yet). Map music
 *   fields are still names only, exactly as before.
 *
 * Autoplay rule: no AudioContext is created until the first
 * play call, which always follows a user gesture (a key press or
 * click), and ctx.resume() is called on every play. Before any
 * gesture, setSoundMode() only records the mode; the graph is
 * built lazily. In a non-browser environment (tests, SSR) every
 * function degrades to a no-op returning false, never throwing.
 */

import type { SoundMode } from './gameSettings';

export type AudioBus = 'music' | 'sfx' | 'ui';

let mode: SoundMode = 'STEREO';
let ctx: AudioContext | null = null;
/** Buses, rebuilt with the graph. Null until the first play call. */
let buses: Record<AudioBus, GainNode | null> = { music: null, sfx: null, ui: null };
/** The single node every bus feeds into for the current mode. */
let modeInput: AudioNode | null = null;
/** Extra nodes owned by the current mono chain, for teardown. */
let monoChain: AudioNode[] = [];
/** <audio> elements routed into the music bus (routeMediaElement).
 * Kept so a MONO / STEREO rebuild reconnects them to the new bus
 * instead of leaving them on a disconnected node. */
const routedElements = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();
const routedSources = new Set<MediaElementAudioSourceNode>();

export function getSoundMode(): SoundMode {
  return mode;
}

/** Record the mode; if a context already exists, rebuild the graph. */
export function setSoundMode(next: SoundMode): void {
  mode = next;
  if (ctx) buildGraph();
}

/** Alias used by startup / save paths: same call, same meaning. */
export function applySoundMode(next: SoundMode): void {
  setSoundMode(next);
}

function buildGraph(): void {
  if (!ctx) return;
  // Tear down the previous graph (disconnect() with no args drops
  // every outgoing connection of a node).
  for (const bus of Object.values(buses)) bus?.disconnect();
  modeInput?.disconnect();
  for (const node of monoChain) node.disconnect();
  monoChain = [];

  buses = {
    music: ctx.createGain(),
    sfx: ctx.createGain(),
    ui: ctx.createGain(),
  };
  if (mode === 'MONO') {
    // Real downmix: split stereo -> halve each channel -> sum
    // into one channel -> destination (which upmixes mono to
    // both speakers equally).
    const splitter = ctx.createChannelSplitter(2);
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    leftGain.gain.value = 0.5;
    rightGain.gain.value = 0.5;
    const merger = ctx.createChannelMerger(1);
    splitter.connect(leftGain, 0);
    splitter.connect(rightGain, 1);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 0);
    merger.connect(ctx.destination);
    modeInput = splitter;
    monoChain = [splitter, leftGain, rightGain, merger];
  } else {
    // Stereo passthrough: pan 0 keeps left/right unchanged.
    const passthrough = ctx.createStereoPanner();
    passthrough.pan.value = 0;
    passthrough.connect(ctx.destination);
    modeInput = passthrough;
  }
  for (const bus of Object.values(buses)) bus?.connect(modeInput);
  // Reconnect any routed music elements to the new music bus: the old
  // bus was disconnected above, so without this a mode switch would
  // silence music mid-track.
  for (const src of routedSources) {
    try {
      src.disconnect();
      if (buses.music) src.connect(buses.music);
    } catch {
      // Element gone or already disconnected — stays silent, never throws.
    }
  }
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  try {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext
      || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    buildGraph();
    return ctx;
  } catch {
    return null;
  }
}

/** Short original synthesized tone through a bus. No audio file. */
export function playTone(opts: {
  frequency?: number;
  pan?: number;
  duration?: number;
  bus?: AudioBus;
  volume?: number;
  atOffset?: number;
}): boolean {
  const audio = ensureContext();
  const bus = opts.bus ? buses[opts.bus] : buses.ui;
  if (!audio || !bus) return false;
  try {
    void audio.resume();
    const start = audio.currentTime + (opts.atOffset ?? 0);
    const osc = audio.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = opts.frequency ?? 880;
    const panner = audio.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, opts.pan ?? 0));
    const gain = audio.createGain();
    const peak = opts.volume ?? 0.22;
    const dur = opts.duration ?? 0.18;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(panner);
    panner.connect(gain);
    gain.connect(bus);
    osc.start(start);
    osc.stop(start + dur + 0.05);
    return true;
  } catch {
    return false;
  }
}

/**
 * Route a music <audio> element through the graph's music bus, so the
 * Settings MONO / STEREO setting actually reaches music. One source
 * node per element (createMediaElementSource throws on a second call
 * for the same element); repeat calls just re-attach to the current
 * bus. Returns false (never throws) when audio is unavailable — the
 * element then plays directly, as before.
 */
export function routeMediaElement(el: HTMLAudioElement): boolean {
  const audio = ensureContext();
  if (!audio || !buses.music) return false;
  try {
    let src = routedElements.get(el);
    if (!src) {
      src = audio.createMediaElementSource(el);
      routedElements.set(el, src);
      routedSources.add(src);
    }
    src.disconnect();
    src.connect(buses.music);
    void audio.resume();
    return true;
  } catch {
    return false;
  }
}

/** Resume the graph context after a user gesture (a music element
 * routed into a suspended context stays silent until this runs). */
export function resumeAudioGraph(): void {
  if (!ctx) return;
  try {
    void ctx.resume();
  } catch {
    // No context to resume — stays silent, never throws.
  }
}

/**
 * Audible MONO / STEREO proof for the Settings SOUND row: a tone
 * panned hard left, then a different tone panned hard right. In
 * STEREO the two tones sit on opposite sides; in MONO the
 * downmix centres both, so they sound identical in placement.
 * Returns false if audio is unavailable (never throws).
 */
export function playUiPreview(): boolean {
  const first = playTone({ frequency: 880, pan: -0.8, duration: 0.18, bus: 'ui' });
  const second = playTone({ frequency: 660, pan: 0.8, duration: 0.18, bus: 'ui', atOffset: 0.24 });
  return first || second;
}

/**
 * UI sound effects — original synthesized tones through the ui bus
 * (no audio files, no Pokemon sounds), so they honour MONO / STEREO.
 * Wired call sites: main-menu cursor / confirm / back in
 * IntroSequence. Hover sounds are deliberately NOT wired: a blip on
 * every mouseenter would fire constantly on desktop.
 */
export function playUiMove(): boolean {
  return playTone({ frequency: 660, duration: 0.07, bus: 'ui', volume: 0.15 });
}
export function playUiConfirm(): boolean {
  const first = playTone({ frequency: 880, duration: 0.1, bus: 'ui', volume: 0.2 });
  const second = playTone({ frequency: 1320, duration: 0.12, bus: 'ui', volume: 0.18, atOffset: 0.08 });
  return first || second;
}
export function playUiBack(): boolean {
  return playTone({ frequency: 440, duration: 0.12, bus: 'ui', volume: 0.18 });
}

/** Settled audio roles (Mars decisions). Paths are the real repo
 *  paths under public/ (served from the site root as /audio/...).
 *  BOOT = UI Art Option B ONLY; PRESS-START = M3 chirp ONLY. */
export const BOOT_SOUND_URL = '/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav';
export const PRESS_START_SOUND_URL = '/audio/mochiichao-boot-M3-mochii-chirp.wav';

/**
 * Routed file playback: fetches + decodes a URL and plays it
 * through a bus, so it honours the current MONO / STEREO routing.
 * Returns false (never throws) when audio is unavailable or the
 * file cannot be fetched/decoded — a missing file stays GAP.
 */
export async function playAudioUrl(url: string, bus: AudioBus = 'music'): Promise<boolean> {
  const audio = ensureContext();
  const target = buses[bus];
  if (!audio || !target) return false;
  try {
    void audio.resume();
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.arrayBuffer();
    const buffer = await audio.decodeAudioData(data);
    const source = audio.createBufferSource();
    source.buffer = buffer;
    source.connect(target);
    source.start();
    return true;
  } catch {
    return false;
  }
}

/** NOTE (resolution of PR #73 against main): the boot / press-start
 *  slots live in exactly ONE place — src/lib/bootAudio.ts (PR #79).
 *  This file's former playBootSound / playPressStartSound wrappers
 *  were deleted here so no second boot/press-start path ships.
 *  BOOT_SOUND_URL / PRESS_START_SOUND_URL constants above are
 *  retained as data only; bootAudio.ts owns playback. */
