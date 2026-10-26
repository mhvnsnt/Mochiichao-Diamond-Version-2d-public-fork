/**
 * Mochiichao Audio System — original Web Audio manager.
 *
 * Drop-in target (main, PR only): `src/lib/audio-system.ts` in the
 * fresh-start repo, then wire the calls listed at the bottom of this
 * file and in `audio-track-map.md`. This file is NOT yet wired into
 * the game: writing it here does not put any track into the build.
 *
 * Design rules:
 * - No commercial music, melody, or code is copied here. All synth
 *   melodies below are short original placeholder patterns written
 *   for this file (see SYNTH_PATTERNS). They exist so the game
 *   works with ZERO audio files: if a scene has no downloaded loop
 *   yet, the synth fallback plays instead of silence.
 * - No audio file is downloaded or vendored by this file. The track
 *   registry names a *slot* (e.g. "town") and a suggested CC0-first
 *   pack; main downloads the actual loop, re-checks its licence at
 *   download time, and calls `registerFile()` with the local URL.
 * - AudioContext is created lazily and resumed only on a user
 *   gesture (title button, NEW GAME, any first click/keypress).
 *   Autoplay policies block sound before a gesture, so `init()`
 *   must be called from a click/key handler, never on module load.
 * - One loop at a time. Scene loops crossfade. A battle loop
 *   overrides the scene loop and restores it on battle end.
 *   Dialogue alone never changes the music.
 */

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type SceneId =
  | 'title'
  | 'intro'
  | 'house'
  | 'lab'
  | 'town'
  | 'route'
  | 'forest'
  | 'cave'
  | 'harbour'
  | 'neon'
  | 'dojo'
  | 'tower'
  | 'market'
  | 'preserve'
  | 'island'
  | 'victory_route'
  | 'plateau'
  | 'hall'
  | 'garden'
  | 'arena'
  | 'creature'
  | 'ferry'
  | 'airship'
  | 'sea'
  | 'dive'
  | 'tree_city'
  | 'crater'
  | 'rift'
  | 'snow'
  | 'lake'
  | 'lighthouse'
  | 'tournament'
  | 'ending'
  // Region equivalents: same moods, own slots so a region can swap
  // its loop later without touching Region 1's mapping.
  | 'r2_town'
  | 'r2_forest'
  | 'r2_tower'
  | 'r2_lighthouse'
  | 'r2_lake'
  | 'r2_snow'
  | 'r3_sea'
  | 'r3_dive'
  | 'r3_tree'
  | 'r3_crater'
  | 'r3_arena'
  | 'r4_rift'
  | 'r4_snow'
  | 'r4_lake'
  | 'r5_tournament'
  | 'r5_market';

export type BattleKind = 'wild' | 'trainer' | 'dojo' | 'elite' | 'champion' | 'arena';

export type SfxName =
  | 'select'
  | 'confirm'
  | 'cancel'
  | 'error'
  | 'door'
  | 'step'
  | 'heal'
  | 'catch'
  | 'catch_fail'
  | 'badge'
  | 'item'
  | 'save'
  | 'levelup'
  | 'evolve'
  | 'faint';

export interface AudioSettings {
  master: number; // 0..1
  music: number; // 0..1
  sfx: number; // 0..1
  muted: boolean;
}

export type LicenceKind = 'cc0' | 'credit_required' | 'synth_only';

export interface TrackSlot {
  /** Scene this slot serves. */
  scene: SceneId;
  /** Suggested local file once main downloads it, e.g. "audio/town.ogg". */
  file: string | null;
  /** CC0-first pack suggestion (see audio-track-map.md). */
  pack: string;
  licence: LicenceKind;
  /** Exact credit string required if a credit pack is used, else ''. */
  credit: string;
  /** Original synth pattern used when no file is registered. */
  synthFallback: keyof typeof SYNTH_PATTERNS;
}

// ------------------------------------------------------------------
// Original synth placeholder patterns (NOT tunes from any game).
// Each pattern is a short loop of [noteHz, beats] pairs, written
// here in C-major / A-minor pentatonic shapes so the fallback is
// pleasant and unmistakably a placeholder, not a soundtrack.
// Replace a pattern's slot by registering a real loop file.
// ------------------------------------------------------------------

const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  A3: 220.0, C3: 130.81, G3: 196.0, E3: 164.81,
} as const;

type Pattern = ReadonlyArray<readonly [number, number]>;

export const SYNTH_PATTERNS = {
  calm: [
    [NOTE.C4, 1], [NOTE.E4, 1], [NOTE.G4, 1], [NOTE.E4, 1],
    [NOTE.D4, 1], [NOTE.F4, 1], [NOTE.A4, 1], [NOTE.G4, 1],
  ],
  bright: [
    [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.G5, 1], [NOTE.E5, 0.5],
    [NOTE.D5, 0.5], [NOTE.F4, 1], [NOTE.G4, 1], [NOTE.C4, 1],
  ],
  tense: [
    [NOTE.A3, 1], [NOTE.C4, 1], [NOTE.A3, 1], [NOTE.E4, 1],
    [NOTE.A3, 1], [NOTE.C4, 1], [NOTE.G4, 0.5], [NOTE.E4, 0.5],
  ],
  battle: [
    [NOTE.A4, 0.5], [NOTE.A4, 0.5], [NOTE.C5, 0.5], [NOTE.E5, 0.5],
    [NOTE.D5, 0.5], [NOTE.C5, 0.5], [NOTE.A4, 1], [NOTE.G4, 1],
  ],
  boss: [
    [NOTE.A3, 0.5], [NOTE.A3, 0.5], [NOTE.C4, 1], [NOTE.E4, 0.5],
    [NOTE.G4, 0.5], [NOTE.E4, 0.5], [NOTE.C4, 1], [NOTE.A3, 1],
  ],
  victory: [
    [NOTE.C5, 0.5], [NOTE.E5, 0.5], [NOTE.G5, 1], [NOTE.C5, 1],
  ],
} satisfies Record<string, Pattern>;

// ------------------------------------------------------------------
// Track registry: every scene -> one slot.
// file: null means "no loop downloaded yet — synth fallback plays".
// Main fills `file` by downloading a pack loop, re-checking its
// licence, and calling audio.registerFile(scene, url). Nothing in
// this registry claims a downloaded track is already in the game.
// ------------------------------------------------------------------

export const TRACK_SLOTS: Record<SceneId, TrackSlot> = {
  title:           { scene: 'title', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  intro:           { scene: 'intro', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  house:           { scene: 'house', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  lab:             { scene: 'lab', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  town:            { scene: 'town', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  route:           { scene: 'route', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  forest:          { scene: 'forest', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  cave:            { scene: 'cave', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  harbour:         { scene: 'harbour', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  neon:            { scene: 'neon', file: null, pack: 'Quillbit Chiptune Free Sampler', licence: 'credit_required', credit: 'Music: Quillbit Chiptune (quillbit-type.itch.io)', synthFallback: 'bright' },
  dojo:            { scene: 'dojo', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  tower:           { scene: 'tower', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  market:          { scene: 'market', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  preserve:        { scene: 'preserve', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  island:          { scene: 'island', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  victory_route:   { scene: 'victory_route', file: null, pack: 'Tallbeard / Abstraction CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  plateau:         { scene: 'plateau', file: null, pack: 'Tallbeard / Abstraction CC0 loops', licence: 'cc0', credit: '', synthFallback: 'boss' },
  hall:            { scene: 'hall', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  garden:          { scene: 'garden', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  arena:           { scene: 'arena', file: null, pack: 'Vacuous BGM 8BIT GAME BGM Vol.01', licence: 'credit_required', credit: 'BGM: 8BIT GAME BGM Vol.01 — Vacuous BGM', synthFallback: 'battle' },
  creature:        { scene: 'creature', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'battle' },
  ferry:           { scene: 'ferry', file: null, pack: 'Quillbit Chiptune Free Sampler', licence: 'credit_required', credit: 'Music: Quillbit Chiptune (quillbit-type.itch.io)', synthFallback: 'bright' },
  airship:         { scene: 'airship', file: null, pack: 'Quillbit Chiptune Free Sampler', licence: 'credit_required', credit: 'Music: Quillbit Chiptune (quillbit-type.itch.io)', synthFallback: 'bright' },
  sea:             { scene: 'sea', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  dive:            { scene: 'dive', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  tree_city:       { scene: 'tree_city', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  crater:          { scene: 'crater', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  rift:            { scene: 'rift', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  snow:            { scene: 'snow', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  lake:            { scene: 'lake', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  lighthouse:      { scene: 'lighthouse', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  tournament:      { scene: 'tournament', file: null, pack: 'Vacuous BGM 8BIT GAME BGM Vol.01', licence: 'credit_required', credit: 'BGM: 8BIT GAME BGM Vol.01 — Vacuous BGM', synthFallback: 'battle' },
  ending:          { scene: 'ending', file: null, pack: 'Tallbeard / Abstraction CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r2_town:         { scene: 'r2_town', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  r2_forest:       { scene: 'r2_forest', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r2_tower:        { scene: 'r2_tower', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  r2_lighthouse:   { scene: 'r2_lighthouse', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
  r2_lake:         { scene: 'r2_lake', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r2_snow:         { scene: 'r2_snow', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r3_sea:          { scene: 'r3_sea', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r3_dive:         { scene: 'r3_dive', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  r3_tree:         { scene: 'r3_tree', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r3_crater:       { scene: 'r3_crater', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  r3_arena:        { scene: 'r3_arena', file: null, pack: 'Vacuous BGM 8BIT GAME BGM Vol.01', licence: 'credit_required', credit: 'BGM: 8BIT GAME BGM Vol.01 — Vacuous BGM', synthFallback: 'battle' },
  r4_rift:         { scene: 'r4_rift', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'tense' },
  r4_snow:         { scene: 'r4_snow', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r4_lake:         { scene: 'r4_lake', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'calm' },
  r5_tournament:   { scene: 'r5_tournament', file: null, pack: 'Vacuous BGM 8BIT GAME BGM Vol.01', licence: 'credit_required', credit: 'BGM: 8BIT GAME BGM Vol.01 — Vacuous BGM', synthFallback: 'battle' },
  r5_market:       { scene: 'r5_market', file: null, pack: 'hyperpixel 33 CC0 loops', licence: 'cc0', credit: '', synthFallback: 'bright' },
};

export const BATTLE_TRACKS: Record<BattleKind, keyof typeof SYNTH_PATTERNS> = {
  wild: 'battle',
  trainer: 'battle',
  dojo: 'battle',
  elite: 'boss',
  champion: 'boss',
  arena: 'battle',
};

// ------------------------------------------------------------------
// SFX: short synth blips, all original. Frequencies/durations only;
// no sampled sound from any game is used.
// ------------------------------------------------------------------

const SFX_DEFS: Record<SfxName, ReadonlyArray<readonly [number, number, OscillatorType]>> = {
  select: [[660, 0.06, 'square']],
  confirm: [[523, 0.07, 'square'], [784, 0.1, 'square']],
  cancel: [[392, 0.08, 'square'], [262, 0.12, 'square']],
  error: [[196, 0.15, 'sawtooth'], [165, 0.2, 'sawtooth']],
  door: [[440, 0.05, 'triangle'], [554, 0.08, 'triangle']],
  step: [[120, 0.03, 'sine']],
  heal: [[523, 0.1, 'sine'], [659, 0.1, 'sine'], [784, 0.15, 'sine']],
  catch: [[784, 0.08, 'square'], [988, 0.08, 'square'], [1175, 0.16, 'square']],
  catch_fail: [[784, 0.08, 'square'], [587, 0.16, 'square']],
  badge: [[523, 0.12, 'square'], [659, 0.12, 'square'], [784, 0.12, 'square'], [1047, 0.3, 'square']],
  item: [[880, 0.07, 'square'], [1109, 0.1, 'square']],
  save: [[659, 0.08, 'sine'], [784, 0.08, 'sine'], [1047, 0.15, 'sine']],
  levelup: [[523, 0.08, 'square'], [659, 0.08, 'square'], [784, 0.08, 'square'], [1047, 0.2, 'square']],
  evolve: [[392, 0.1, 'triangle'], [523, 0.1, 'triangle'], [659, 0.1, 'triangle'], [784, 0.25, 'triangle']],
  faint: [[440, 0.15, 'sawtooth'], [330, 0.15, 'sawtooth'], [220, 0.3, 'sawtooth']],
};

// ------------------------------------------------------------------
// Manager
// ------------------------------------------------------------------

const STORAGE_KEY = 'mochiichao_audio_v1';
const DEFAULT_SETTINGS: AudioSettings = { master: 0.8, music: 0.8, sfx: 0.9, muted: false };

function loadStoredSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    return {
      master: clamp01(parsed.master ?? DEFAULT_SETTINGS.master),
      music: clamp01(parsed.music ?? DEFAULT_SETTINGS.music),
      sfx: clamp01(parsed.sfx ?? DEFAULT_SETTINGS.sfx),
      muted: parsed.muted ?? false,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}

interface ActiveLoop {
  kind: 'file' | 'synth';
  stop: () => void;
  gain: GainNode;
}

export class MochiAudio {
  private ctx: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private settings: AudioSettings = loadStoredSettings();
  private buffers = new Map<SceneId, AudioBuffer>();
  private files = new Map<SceneId, string>();
  private current: ActiveLoop | null = null;
  private currentScene: SceneId | null = null;
  private sceneBeforeBattle: SceneId | null = null;
  private inBattle = false;
  private synthTimer: ReturnType<typeof setInterval> | null = null;
  private synthStep = 0;
  private lastStepAt = 0;
  private listeners = new Set<() => void>();

  // -- lifecycle ----------------------------------------------------

  /** Call from a click/key handler (title, NEW GAME, first button). Safe to call repeatedly. */
  init(): void {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return; // No Web Audio: all methods below become no-ops.
      this.ctx = new AC();
      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.musicBus.connect(this.ctx.destination);
      this.sfxBus.connect(this.ctx.destination);
      this.applyGains();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  get ready(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private emit(): void {
    this.listeners.forEach((l) => { try { l(); } catch { /* settings UI must not break audio */ } });
  }

  private persist(): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings)); } catch { /* private mode: keep in-memory settings */ }
  }

  private applyGains(): void {
    if (!this.ctx || !this.musicBus || !this.sfxBus) return;
    const m = this.settings.muted ? 0 : this.settings.master;
    this.musicBus.gain.setTargetAtTime(m * this.settings.music, this.ctx.currentTime, 0.02);
    this.sfxBus.gain.setTargetAtTime(m * this.settings.sfx, this.ctx.currentTime, 0.02);
  }

  // -- settings (wire these to the Settings UI) ---------------------

  setMaster(v: number): void { this.settings.master = clamp01(v); this.applyGains(); this.persist(); this.emit(); }
  setMusic(v: number): void { this.settings.music = clamp01(v); this.applyGains(); this.persist(); this.emit(); }
  setSfx(v: number): void { this.settings.sfx = clamp01(v); this.applyGains(); this.persist(); this.emit(); }
  setMuted(muted: boolean): void { this.settings.muted = muted; this.applyGains(); this.persist(); this.emit(); }
  toggleMute(): void { this.setMuted(!this.settings.muted); }

  // -- file registration (main only, after licence re-check) --------

  /**
   * Register a downloaded loop for a scene. `url` is a local path
   * in the built game (e.g. "/audio/town.ogg"). Call once per scene,
   * ideally at boot after init(); a failed fetch falls back to synth.
   */
  async registerFile(scene: SceneId, url: string): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      const buf = await res.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(buf);
      this.buffers.set(scene, decoded);
      this.files.set(scene, url);
      // If this scene is playing on synth, swap to the real loop.
      if (this.currentScene === scene && this.current?.kind === 'synth') {
        this.playScene(scene, { crossfadeMs: 800 });
      }
      return true;
    } catch {
      return false;
    }
  }

  /** Scenes that have a real loop file registered (for the credits / debug screen). */
  registeredScenes(): SceneId[] {
    return [...this.files.keys()];
  }

  /** Exact credit strings owed by the currently registered credit-required slots. */
  owedCredits(): string[] {
    const out: string[] = [];
    for (const scene of this.files.keys()) {
      const slot = TRACK_SLOTS[scene];
      if (slot.licence === 'credit_required' && slot.credit && !out.includes(slot.credit)) out.push(slot.credit);
    }
    return out;
  }

  // -- scene / battle music ------------------------------------------

  /**
   * Play a scene loop. Re-calling the current scene is a no-op.
   * Crossfade default 600ms; use 0 for an instant cut (e.g. door).
   */
  playScene(scene: SceneId, opts: { crossfadeMs?: number } = {}): void {
    this.init();
    if (!this.ctx || !this.musicBus) return;
    if (this.inBattle) { this.sceneBeforeBattle = scene; return; }
    if (this.currentScene === scene && this.current) return;
    this.currentScene = scene;
    this.startLoop(scene, TRACK_SLOTS[scene].synthFallback, opts.crossfadeMs ?? 600);
  }

  /** Battle loop overrides the scene loop; the scene is restored by endBattle(). */
  startBattle(kind: BattleKind = 'trainer'): void {
    this.init();
    if (!this.ctx || !this.musicBus) return;
    if (!this.inBattle) this.sceneBeforeBattle = this.currentScene;
    this.inBattle = true;
    // Battle loops reuse the synth pattern system; a registered battle
    // file would be added here as a pseudo-scene by main if desired.
    this.startSynthLoop(BATTLE_TRACKS[kind], 400);
  }

  /** Stop the battle loop and restore the scene loop that was playing. */
  endBattle(): void {
    if (!this.inBattle) return;
    this.inBattle = false;
    const back = this.sceneBeforeBattle;
    this.sceneBeforeBattle = null;
    this.currentScene = null; // force restart even if it matches
    if (back) this.playScene(back, { crossfadeMs: 800 });
    else this.stopMusic();
  }

  /** Victory jingle: plays over the restored scene loop, then fades out. */
  playVictoryJingle(): void {
    this.playSfxSequence(SYNTH_PATTERNS.victory, 'square', 0.12);
  }

  stopMusic(): void {
    this.stopCurrent(0);
    this.currentScene = null;
  }

  /** Stop everything (title screen exit, tab hidden, unmount). */
  dispose(): void {
    this.stopMusic();
    if (this.synthTimer) { clearInterval(this.synthTimer); this.synthTimer = null; }
    if (this.ctx) void this.ctx.close().catch(() => undefined);
    this.ctx = null; this.musicBus = null; this.sfxBus = null;
  }

  // -- loop internals -------------------------------------------------

  private startLoop(scene: SceneId, fallback: keyof typeof SYNTH_PATTERNS, crossfadeMs: number): void {
    const buf = this.buffers.get(scene);
    if (buf) this.startFileLoop(buf, crossfadeMs);
    else this.startSynthLoop(fallback, crossfadeMs);
  }

  private startFileLoop(buf: AudioBuffer, crossfadeMs: number): void {
    if (!this.ctx || !this.musicBus) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.musicBus);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(gain);
    src.start();
    this.swapLoop({ kind: 'file', gain, stop: () => { try { src.stop(); } catch { /* already stopped */ } gain.disconnect(); } }, crossfadeMs);
  }

  private startSynthLoop(patternName: keyof typeof SYNTH_PATTERNS, crossfadeMs: number): void {
    if (!this.ctx || !this.musicBus) return;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.musicBus);
    const pattern = SYNTH_PATTERNS[patternName];
    this.synthStep = 0;
    // 120 BPM eighth-note scheduler, lookahead via interval.
    const beatMs = 250;
    const timer = setInterval(() => {
      if (!this.ctx || this.current?.gain !== gain) { clearInterval(timer); return; }
      const [freq, beats] = pattern[this.synthStep % pattern.length];
      this.synthStep += 1;
      this.tone(freq, beats * beatMs / 1000, 'square', gain, 0.12);
    }, beatMs);
    // Keep only the newest synth timer alive.
    if (this.synthTimer) clearInterval(this.synthTimer);
    this.synthTimer = timer;
    this.swapLoop({ kind: 'synth', gain, stop: () => { clearInterval(timer); gain.disconnect(); } }, crossfadeMs);
  }

  private swapLoop(next: ActiveLoop, crossfadeMs: number): void {
    if (!this.ctx) return;
    const prev = this.current;
    this.current = next;
    const t = this.ctx.currentTime;
    next.gain.gain.setTargetAtTime(1, t, Math.max(0.02, crossfadeMs / 1000 / 3));
    if (prev) {
      prev.gain.gain.setTargetAtTime(0, t, Math.max(0.02, crossfadeMs / 1000 / 3));
      const stopPrev = prev.stop;
      window.setTimeout(stopPrev, crossfadeMs + 200);
    }
  }

  private stopCurrent(fadeMs: number): void {
    const prev = this.current;
    this.current = null;
    if (!prev || !this.ctx) return;
    if (fadeMs <= 0) { prev.stop(); return; }
    prev.gain.gain.setTargetAtTime(0, this.ctx.currentTime, fadeMs / 1000 / 3);
    window.setTimeout(prev.stop, fadeMs + 200);
  }

  // -- SFX -------------------------------------------------------------

  /** Play one named SFX. `step` is throttled so walking does not spam. */
  playSfx(name: SfxName): void {
    this.init();
    if (!this.ctx || !this.sfxBus) return;
    if (name === 'step') {
      const now = performance.now();
      if (now - this.lastStepAt < 180) return;
      this.lastStepAt = now;
    }
    const def = SFX_DEFS[name];
    let at = 0;
    for (const [freq, dur, type] of def) {
      window.setTimeout(() => this.tone(freq, dur, type, this.sfxBus, 0.25), at * 1000);
      at += dur;
    }
  }

  private playSfxSequence(pattern: Pattern, type: OscillatorType, beatSec: number): void {
    if (!this.ctx || !this.sfxBus) return;
    let at = 0;
    for (const [freq, beats] of pattern) {
      const f = freq;
      window.setTimeout(() => this.tone(f, beatSec, type, this.sfxBus, 0.25), at * 1000);
      at += beats * beatSec;
    }
  }

  private tone(freq: number, durSec: number, type: OscillatorType, dest: GainNode | null, volume: number): void {
    if (!this.ctx || !dest) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.max(0.03, durSec));
    osc.connect(g);
    g.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + Math.max(0.03, durSec) + 0.02);
  }
}

/** Singleton: import this from App / WorldEngine / BattleView. */
export const audio = new MochiAudio();

// ------------------------------------------------------------------
// Wiring checklist for main (PR only — none of this runs from here):
// 1. App.tsx: import { audio } from './lib/audio-system'; call
//    audio.init() inside the title-screen / NEW GAME click handler
//    and any first keypress handler. Add a Settings view (or a
//    settings section) with sliders bound to audio.setMaster /
//    setMusic / setSfx and a toggle bound to audio.toggleMute,
//    subscribed via audio.subscribe() so it re-renders on change.
// 2. App.tsx / WorldEngine.tsx: on map change, call
//    audio.playScene(map.musicScene) where map.musicScene is the
//    SceneId for that map (add a `music` field to FULL_WORLD maps;
//    default 'town' for towns, 'route' for routes, etc.). Dialogue
//    alone must NOT call playScene.
// 3. WorldEngine battle start: audio.startBattle(kind) where kind
//    is 'wild' | 'trainer' | 'dojo' | 'elite' | 'champion'.
//    Battle end (win, loss, flee): audio.endBattle(); on win also
//    audio.playVictoryJingle(). BattleView (mod layer) should call
//    the same three functions if it ever hosts a battle instead.
// 4. UI events: menu move -> playSfx('select'), confirm ->
//    playSfx('confirm'), cancel -> playSfx('cancel'), door warp ->
//    playSfx('door'), overworld step -> playSfx('step') (throttled
//    internally), MochiiPlex heal -> playSfx('heal'), successful
//    catch -> playSfx('catch'), failed catch -> playSfx('catch_fail'),
//    badge earned -> playSfx('badge'), item pickup -> playSfx('item'),
//    save -> playSfx('save'), level up -> playSfx('levelup'),
//    evolution -> playSfx('evolve'), creature faint -> playSfx('faint').
// 5. Boot (after init, optional): for each scene main has actually
//    downloaded, audio.registerFile(scene, '/audio/<name>.ogg').
//    Do NOT register a file that was not downloaded, and do NOT
//    ship a credit-required track without adding its exact credit
//    string (see TRACK_SLOTS / audio-track-map.md) to the game's
//    credits screen. audio.owedCredits() lists what is owed.
// 6. Do NOT add any commercial game's track, melody, or sample.
//    If a downloaded loop turns out to be one, remove it and fall
//    back to synth — do not rename it and keep it.
// ------------------------------------------------------------------
