/**
 * Mochiichao music system — plan §5 (Quickest 2026 Ways).
 *
 * Zero new runtime dependencies, by design:
 * - package.json on main (verified 2026-10-25, main a26a1968) contains
 *   NEITHER Howler.js NOR Tone.js. Tone.js is proposed only inside open
 *   PR #61 (world-wiring-1, Tone adapter) and this module deliberately
 *   does NOT duplicate that adapter, and does NOT touch its files.
 * - Howler.js is MIT-licenced (header: "howler.js v2.2.1 … MIT License",
 *   re-checked 2026-10-25) and is the plan's simple-playback choice, but
 *   it is NOT vendored or added to package.json here: this engine covers
 *   the same playback with raw Web Audio, so no dependency or lockfile
 *   change is needed. A future Howler adapter, if wanted, can sit behind
 *   the same MusicTrack registry and must not change this API.
 * - FMOD / Wwise are DESIGN REFERENCE ONLY (parameters, buses, states).
 *   They have no web runtime and are not used here.
 *
 * GBA structure copied, audio NOT copied (plan §5a):
 * - Registry = the web equivalent of sound/song_table.inc: one id maps
 *   to a bus + priority + bank/stem set. No Pokemon melody, cry, sample,
 *   or song-table value is shipped here.
 * - Separate buses (the M4A player idea): bgm / sfx / ambience / voice.
 *   Cries ride the SFX bus, never the music bus, so a cry can never
 *   duck or stomp background music — the same separation as
 *   gCryTable / gPokemonCryMusicPlayers, with original Mochiichao cries
 *   only (no cry audio exists yet; see playCry).
 * - Intro + loop: AudioBufferSourceNode.loopStart / loopEnd. The source
 *   plays 0 → loopEnd once, then repeats loopStart → loopEnd forever,
 *   so the intro plays exactly once and the loop is gapless — but ONLY
 *   for OGG (or FLAC). MP3 encoder padding creates an audible gap even
 *   with loop points, so loop tracks MUST be OGG (validator enforces).
 *
 * What this PR does NOT do (deconfliction, open PRs on 2026-10-25):
 * - It does NOT wire playback into App / IntroSequence / BattleView /
 *   SettingsScreen / WorldEngine, and does NOT touch the settled audio
 *   roles in open PR #79 / #75 (BOOT = Option B, PRESS-START = M3) or
 *   the SOUND routing in open PR #73 (audioRouting.ts). Those lanes own
 *   their files; a later wiring PR can call playTrack() from one place
 *   once they merge, instead of three lanes editing the same screens.
 * - It does NOT wire title / intro as final playback. The registry lists
 *   title + intro as DRAFT slots (their existing v1/v2/v3 WAVs are named
 *   under draftFiles for reference only). Title Music lane owns approval.
 * - No audio file is shipped in this PR, so every registry entry is
 *   placeholder:true / wired:false. The engine refuses to play an entry
 *   whose file is not loaded, so a missing file can never play as a
 *   silent "final" track by accident.
 */

export type MusicBus = 'bgm' | 'sfx' | 'ambience' | 'voice';
export type MusicTrackType = 'loop' | 'jingle' | 'one-shot';
export type MusicTrackStatus = 'planned' | 'draft' | 'composed';

export interface MusicTrack {
  id: string;
  type: MusicTrackType;
  where: string;
  /** Planned OGG path under public/audio/music/<id>/, relative to the Vite base. */
  file: string;
  /** Play-once intro length in seconds; equals loopStart for loops, null for jingles/one-shots. */
  intro: number | null;
  /** Loop section start (seconds). Null for non-loops. */
  loopStart: number | null;
  /** Loop section end (seconds). Null for non-loops. */
  loopEnd: number | null;
  /** Composition target until composed, then the measured value. */
  bpm: number;
  key: string;
  /** Per-stem OGG paths, same bpm/key/duration as the mix. */
  stems: string[];
  /** Variant file per variant key, e.g. { night: 'audio/music/route_night/route_night.ogg' }. */
  variants: Record<string, string>;
  bus: MusicBus;
  /** 0 = background music; higher interrupts (jingles use 2). Lower never stomps higher. */
  priority: number;
  /** Events that duck this track, e.g. ['battle_start']. */
  duckOn: string[];
  status: MusicTrackStatus;
  /** True until a real composed/rendered file replaces the plan entry. */
  placeholder: boolean;
  /** False until a wiring PR actually calls this track in-game. */
  wired: boolean;
  /** True for the 10-entry minimum viable soundtrack (plan §5e). */
  mvp: boolean;
  compositionNote: string;
  /** Existing draft files, reference only — never wired as final by this module. */
  draftFiles: string[];
  licence: string;
  credits: string | null;
}

export interface MusicRegistry {
  schemaVersion: number;
  notes: string;
  buses: Record<MusicBus, { description: string; priority: number }>;
  tracks: MusicTrack[];
}

export interface BusVolumes {
  master: number;
  bgm: number;
  sfx: number;
  ambience: number;
  voice: number;
}

export const DEFAULT_BUS_VOLUMES: BusVolumes = {
  master: 1,
  bgm: 0.8,
  sfx: 1,
  ambience: 0.6,
  voice: 1,
};

/** Canonical vertical-layer mapping (plan §5d). All stems share bpm/key. */
export const STEM_INTENSITY_MAP = {
  exploration: ['bass', 'harmony'],
  moving: ['bass', 'harmony', 'drums'],
  danger: ['bass', 'harmony', 'drums', 'brass'],
  lowHp: ['bass', 'harmony', 'drums', 'pinch'],
  finalPhase: ['bass', 'harmony', 'drums', 'brass', 'crowd'],
} as const;

export type IntensityLevel = keyof typeof STEM_INTENSITY_MAP;

/** Seconds per bar in 4/4 at a bpm. */
export function secondsPerBar(bpm: number): number {
  return 240 / bpm;
}

/** Next bar-boundary time at or after `fromTime`, given a track started at `startTime`. */
export function nextBarTime(fromTime: number, startTime: number, bpm: number): number {
  const bar = secondsPerBar(bpm);
  const elapsed = Math.max(0, fromTime - startTime);
  const bars = Math.ceil(elapsed / bar - 1e-9);
  return startTime + bars * bar;
}

/** Validate a registry object. Returns hard errors (must fail) and warnings (must not fail). */
export function validateMusicRegistry(registry: unknown): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!registry || typeof registry !== 'object') return { errors: ['registry is not an object'], warnings };
  const reg = registry as Partial<MusicRegistry>;
  if (reg.schemaVersion !== 1) errors.push(`schemaVersion must be 1, got ${String(reg.schemaVersion)}`);
  if (!Array.isArray(reg.tracks) || reg.tracks.length === 0) {
    errors.push('tracks must be a non-empty array');
    return { errors, warnings };
  }
  const seen = new Set<string>();
  for (const t of reg.tracks) {
    if (!t.id) { errors.push('track with missing id'); continue; }
    if (seen.has(t.id)) errors.push(`duplicate track id: ${t.id}`);
    seen.add(t.id);
    if (!t.file) errors.push(`${t.id}: missing file`);
    if (t.bus !== 'bgm') errors.push(`${t.id}: music registry tracks must use bus bgm, got ${t.bus}`);
    if (!Number.isFinite(t.bpm) || t.bpm <= 0) errors.push(`${t.id}: bpm must be > 0`);
    if (!t.key) errors.push(`${t.id}: missing key`);
    if (t.type === 'loop') {
      if (t.loopStart === null || t.loopEnd === null) {
        errors.push(`${t.id}: loop track needs loopStart and loopEnd`);
      } else if (!(t.loopStart >= 0 && t.loopEnd > t.loopStart)) {
        errors.push(`${t.id}: need 0 <= loopStart < loopEnd, got ${t.loopStart}/${t.loopEnd}`);
      } else {
        // Loop section must be a whole number of bars (within rounding tolerance).
        const bars = (t.loopEnd - t.loopStart) / secondsPerBar(t.bpm);
        if (Math.abs(bars - Math.round(bars)) > 0.01) {
          errors.push(`${t.id}: loop section ${t.loopEnd - t.loopStart}s is ${bars.toFixed(3)} bars at ${t.bpm} bpm, not a whole bar count`);
        }
        if (t.intro !== null && Math.abs(t.intro - t.loopStart) > 0.001) {
          errors.push(`${t.id}: intro (${t.intro}) must equal loopStart (${t.loopStart})`);
        }
      }
      if (!t.file.endsWith('.ogg')) {
        errors.push(`${t.id}: loop track file must be .ogg (MP3 padding creates a loop gap), got ${t.file}`);
      }
      for (const s of t.stems || []) {
        if (!s.endsWith('.ogg')) errors.push(`${t.id}: stem must be .ogg, got ${s}`);
      }
    } else if (t.loopStart !== null || t.loopEnd !== null) {
      errors.push(`${t.id}: non-loop track must have null loopStart/loopEnd`);
    }
    if (t.status === 'composed' && t.placeholder) errors.push(`${t.id}: composed track cannot still be placeholder:true`);
    if (t.wired && t.placeholder) errors.push(`${t.id}: placeholder track cannot be wired:true`);
    if (t.status !== 'composed') warnings.push(`${t.id}: not composed yet (status ${t.status})`);
  }
  const mvp = reg.tracks.filter((t) => t.mvp).map((t) => t.id);
  const expectedMvp = ['title', 'menu', 'home_town', 'route_day', 'cave', 'wild_battle', 'trainer_battle', 'gym_battle', 'victory', 'defeat'];
  for (const id of expectedMvp) {
    if (!mvp.includes(id)) errors.push(`MVP track missing from registry: ${id}`);
  }
  if (mvp.length !== expectedMvp.length) warnings.push(`MVP count is ${mvp.length}, expected ${expectedMvp.length}`);
  return { errors, warnings };
}

/** Resolve a variant file for a track, or the base file when no variant applies. */
export function resolveVariantFile(
  track: MusicTrack,
  opts: { timeOfDay?: string; season?: string } = {},
): string {
  if (opts.timeOfDay === 'night' && track.variants.night) return track.variants.night;
  if (opts.season === 'winter' && track.variants.winter) return track.variants.winter;
  if (opts.season && track.variants.seasonal) return track.variants.seasonal;
  return track.file;
}

/** Stem names active for an intensity level, intersected with the track's own stems. */
export function activeStemNames(track: MusicTrack, level: IntensityLevel): string[] {
  const wanted = STEM_INTENSITY_MAP[level];
  const have = new Set(track.stems.map((s) => {
    const base = s.split('/').pop() || s;
    return base.replace(`${track.id}_`, '').replace('.ogg', '');
  }));
  return wanted.filter((name) => have.has(name));
}

interface PlayingTrack {
  track: MusicTrack;
  sources: AudioBufferSourceNode[];
  stemGains: Map<string, GainNode>;
  masterGain: GainNode;
  startTime: number;
  buffer: AudioBuffer;
}

/**
 * Web Audio music engine. No Howler/Tone dependency; the AudioContext is
 * created lazily and MUST be resumed from a user gesture (autoplay policy).
 * Callers in the game shell own that gesture — this engine never
 * synthesises a fake gesture.
 */
export class MusicEngine {
  private ctx: AudioContext | null = null;
  private busGains = new Map<MusicBus, GainNode>();
  private masterGain: GainNode | null = null;
  private volumes: BusVolumes = { ...DEFAULT_BUS_VOLUMES };
  private registry = new Map<string, MusicTrack>();
  private buffers = new Map<string, AudioBuffer>();
  private current: PlayingTrack | null = null;
  private pending: { id: string; atTime: number } | null = null;
  private ducked = false;

  getTrack(id: string): MusicTrack | undefined {
    return this.registry.get(id);
  }

  listTracks(): MusicTrack[] {
    return [...this.registry.values()];
  }

  loadRegistry(registry: MusicRegistry): { errors: string[]; warnings: string[] } {
    const result = validateMusicRegistry(registry);
    if (result.errors.length > 0) return result;
    this.registry = new Map(registry.tracks.map((t) => [t.id, t]));
    return result;
  }

  /** Create/resume the context. Must be called from a user gesture at least once. */
  async ensureContext(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volumes.master;
      this.masterGain.connect(this.ctx.destination);
      for (const bus of ['bgm', 'sfx', 'ambience', 'voice'] as MusicBus[]) {
        const g = this.ctx.createGain();
        g.gain.value = this.volumes[bus];
        g.connect(this.masterGain);
        this.busGains.set(bus, g);
      }
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    return this.ctx;
  }

  setVolumes(partial: Partial<BusVolumes>): void {
    this.volumes = { ...this.volumes, ...partial };
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(this.volumes.master, this.ctx.currentTime, 0.05);
    for (const bus of ['bgm', 'sfx', 'ambience', 'voice'] as MusicBus[]) {
      this.busGains.get(bus)?.gain.setTargetAtTime(this.volumes[bus], this.ctx.currentTime, 0.05);
    }
  }

  getVolumes(): BusVolumes {
    return { ...this.volumes };
  }

  private busNode(bus: MusicBus): GainNode | null {
    return this.busGains.get(bus) ?? null;
  }

  /** Fetch + decode a registry file (or stem) under the Vite base path. */
  async loadFile(path: string): Promise<AudioBuffer | null> {
    const ctx = await this.ensureContext();
    if (!ctx) return null;
    if (this.buffers.has(path)) return this.buffers.get(path) as AudioBuffer;
    const base = (import.meta.env.BASE_URL as string | undefined) || '/';
    const url = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await ctx.decodeAudioData(await res.arrayBuffer());
    this.buffers.set(path, buf);
    return buf;
  }

  /** Play a track. Bar-aligned switching is the default for loops; jingles interrupt at once. */
  async playTrack(
    id: string,
    opts: { barAligned?: boolean; crossfadeSeconds?: number; timeOfDay?: string; season?: string } = {},
  ): Promise<boolean> {
    const track = this.registry.get(id);
    if (!track || track.placeholder) return false;
    const ctx = await this.ensureContext();
    if (!ctx) return false;
    const file = resolveVariantFile(track, opts);
    const buffer = await this.loadFile(file);
    if (!buffer) return false;
    const barAligned = opts.barAligned ?? track.type === 'loop';
    const crossfade = opts.crossfadeSeconds ?? 1;
    const now = ctx.currentTime;
    let at = now + 0.05;
    if (barAligned && this.current) {
      at = nextBarTime(now, this.current.startTime, this.current.track.bpm);
      this.pending = { id, atTime: at };
      const pending = this.pending;
      window.setTimeout(() => { if (this.pending === pending) this.pending = null; }, Math.max(0, (at - now) * 1000 + 50));
    }
    await this.startPlaying(track, buffer, at, crossfade);
    return true;
  }

  private async startPlaying(track: MusicTrack, buffer: AudioBuffer, at: number, crossfade: number): Promise<void> {
    const ctx = this.ctx as AudioContext;
    const bus = this.busNode(track.bus);
    if (!bus) return;
    const old = this.current;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(1, at + Math.max(0.05, crossfade));
    gain.connect(bus);
    const stemGains = new Map<string, GainNode>();
    const sources: AudioBufferSourceNode[] = [];
    const makeSource = (buf: AudioBuffer, out: AudioNode): AudioBufferSourceNode => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      if (track.type === 'loop' && track.loopStart !== null && track.loopEnd !== null) {
        src.loop = true;
        src.loopStart = track.loopStart;
        src.loopEnd = Math.min(track.loopEnd, buf.duration);
      }
      src.connect(out);
      src.start(at);
      return src;
    };
    // Load stems FIRST: when stems are available they ARE the track (same
    // bpm/key, started together), and the mix file is not also played —
    // playing both would double the exploration stems. The mix file is
    // the fallback for simple players and for tracks with no stems.
    const loadedStems: { name: string; buf: AudioBuffer }[] = [];
    for (const stemPath of track.stems) {
      const stemBuf = await this.loadFile(stemPath);
      if (!stemBuf) continue;
      const stemName = (stemPath.split('/').pop() || '').replace(`${track.id}_`, '').replace('.ogg', '');
      loadedStems.push({ name: stemName, buf: stemBuf });
    }
    if (loadedStems.length > 0) {
      for (const { name, buf } of loadedStems) {
        const stemGain = ctx.createGain();
        const baseLevel = (STEM_INTENSITY_MAP.exploration as readonly string[]).includes(name) ? 1 : 0;
        stemGain.gain.setValueAtTime(baseLevel, at);
        stemGain.connect(gain);
        stemGains.set(name, stemGain);
        sources.push(makeSource(buf, stemGain));
      }
    } else {
      sources.push(makeSource(buffer, gain));
    }
    if (old) {
      const oldGain = old.masterGain;
      oldGain.gain.cancelScheduledValues(at);
      oldGain.gain.setValueAtTime(oldGain.gain.value, at);
      oldGain.gain.linearRampToValueAtTime(0, at + Math.max(0.05, crossfade));
      const toStop = old;
      const stopAt = at + Math.max(0.05, crossfade) + 0.05;
      window.setTimeout(() => {
        for (const s of toStop.sources) { try { s.stop(); } catch { /* already stopped */ } }
        toStop.masterGain.disconnect();
      }, Math.max(0, (stopAt - ctx.currentTime) * 1000 + 50));
    }
    this.current = { track, sources, stemGains, masterGain: gain, startTime: at, buffer };
  }

  /** Fade a stem in/out by name (vertical layering). No-op when the stem is absent. */
  setStemLevel(stemName: string, level: number, fadeSeconds = 0.5): void {
    if (!this.ctx || !this.current) return;
    const g = this.current.stemGains.get(stemName);
    if (!g) return;
    g.gain.setTargetAtTime(Math.max(0, Math.min(1, level)), this.ctx.currentTime, Math.max(0.05, fadeSeconds / 3));
  }

  /** Apply an intensity level: stems in the map at 1, all other stems at 0. */
  setIntensity(level: IntensityLevel): void {
    if (!this.current) return;
    const active = new Set(activeStemNames(this.current.track, level));
    for (const name of this.current.stemGains.keys()) {
      this.setStemLevel(name, active.has(name) ? 1 : 0);
    }
  }

  /** Duck bgm (battle start / jingle) without touching the sfx bus. */
  setDucked(ducked: boolean, factor = 0.35): void {
    if (!this.ctx) return;
    const bgm = this.busNode('bgm');
    if (!bgm) return;
    bgm.gain.setTargetAtTime(ducked ? this.volumes.bgm * factor : this.volumes.bgm, this.ctx.currentTime, 0.1);
    this.ducked = ducked;
  }

  isDucked(): boolean {
    return this.ducked;
  }

  stopCurrent(fadeSeconds = 0.5): void {
    if (!this.ctx || !this.current) return;
    const cur = this.current;
    cur.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, Math.max(0.05, fadeSeconds / 3));
    window.setTimeout(() => {
      for (const s of cur.sources) { try { s.stop(); } catch { /* already stopped */ } }
      cur.masterGain.disconnect();
    }, fadeSeconds * 1000 + 100);
    this.current = null;
  }

  currentTrackId(): string | null {
    return this.current?.track.id ?? null;
  }

  pendingTrack(): { id: string; atTime: number } | null {
    return this.pending;
  }

  /**
   * Play a one-shot SFX / jingle buffer on a bus. Jingles duck bgm while
   * they play and restore it after; SFX never duck bgm.
   */
  async playOneShot(buffer: AudioBuffer, bus: MusicBus = 'sfx', duckBgm = false): Promise<void> {
    const ctx = await this.ensureContext();
    const node = ctx ? this.busNode(bus) : null;
    if (!ctx || !node) return;
    if (duckBgm) this.setDucked(true);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(node);
    src.start();
    if (duckBgm) {
      src.onended = () => this.setDucked(false);
    }
  }

  /**
   * Creature cry: SFX bus only, per-creature pitch/variation.
   * Variation is deterministic from the species id (hash → ±5% rate,
   * ±50 cents detune), so the same creature sounds related but not
   * identical every time, without shipping a cry per variant. The caller
   * supplies an ORIGINAL Mochiichao cry buffer — never a Pokemon cry.
   */
  async playCry(cryBuffer: AudioBuffer, speciesId: string): Promise<void> {
    const ctx = await this.ensureContext();
    const node = ctx ? this.busNode('sfx') : null;
    if (!ctx || !node) return;
    let hash = 0;
    for (const ch of speciesId) hash = (hash * 31 + ch.charCodeAt(0)) % 1000;
    const src = ctx.createBufferSource();
    src.buffer = cryBuffer;
    src.playbackRate.value = 0.95 + (hash % 11) / 100;
    src.detune.value = (hash % 101) - 50;
    src.connect(node);
    src.start();
  }

  /** Load the registry JSON shipped at public/audio/music/music.json. */
  async loadRegistryFromSite(): Promise<{ errors: string[]; warnings: string[] }> {
    const base = (import.meta.env.BASE_URL as string | undefined) || '/';
    const url = `${base.replace(/\/$/, '')}/audio/music/music.json`;
    const res = await fetch(url);
    if (!res.ok) return { errors: [`music.json fetch failed: ${res.status}`], warnings: [] };
    const data = (await res.json()) as MusicRegistry;
    return this.loadRegistry(data);
  }
}

/** Shared singleton for the game shell to import once wiring lands. */
export const musicEngine = new MusicEngine();
