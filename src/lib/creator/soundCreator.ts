/**
 * Sound Creator + Music Creator — pure logic, zero dependencies.
 *
 * How Pokemon does it, as structure only (no commercial code, audio,
 * or dialogue is copied):
 * - Options menu: FireRed option_menu.c — header window, list window,
 *   help bar, label left / value right, UP/DOWN wraps, LEFT/RIGHT
 *   cycles. The creator screens follow that layout as dedicated
 *   full screens, never popups.
 * - Boot / press-start: live bootAudio.ts roles are the default
 *   (BOOT = UI Art Option B rising arpeggio, PRESS-START = M3
 *   Mochii Chirp). Mars's 2026-10-27 M2 message in this lane was
 *   uncertain ("I think it was M2... I gotta go listen"), so M2 is
 *   NOT locked as boot here — it is one tap away in the creator.
 *   If Mars taps M2 in the creator, that becomes his pick and the
 *   default below must be updated to match.
 * - Chatter (Chatot, Diamond/Pearl/Platinum, Gen 4 — NOT Black 2):
 *   the DS microphone recording becomes the creature's cry. Structure
 *   pulled: mic -> recorded cry -> Chatter move plays it. Black 2's
 *   contribution here is sequenced music structure (tracks, channels,
 *   tempo), which the Music Creator mirrors.
 * - Ball Seals (Diamond/Pearl/Platinum): seals attach to the Ball
 *   Capsule, not to the creature, and show on release (send-out).
 *   Letters A-Z, stars, hearts, sparkles, flowers — the seal effects
 *   in this file are Mochiichao-original names, not Pokemon seal art.
 * - Music: how the game's own title music was made — G major,
 *   112 BPM, 16 bars, stems (bass, drums, guitar, melody, organ,
 *   synth, vocal). The Music Creator's default project mirrors that
 *   shape so a user-made soundtrack fits the game the same way.
 * - Vocal: AVANNA itself is a commercial Vocaloid3 bank and is NOT
 *   shipped. The vocal track here uses the user's own mic recording
 *   plus the open-source AVANNA-style transform parameters already
 *   documented in this repo (pitch +7 semitones, formant shift,
 *   breathiness cut) — parameters, not the bank. Free/open vocal
 *   routes (OpenUTAU, DiffSinger) are documented in docs, not shipped.
 *
 * DigiCore hub: DigiCore is the game's main center. In Settings it
 * is the hub section that holds the Sound Creator and Music Creator,
 * and every sound slot below routes through it (via the existing
 * audio routing + audio manager). If DigiCore means a place or a
 * character in canon instead, this hub naming must be corrected —
 * the hub itself does not depend on that name.
 */

export type Wave = "sine" | "square" | "triangle" | "sawtooth";

export type SoundSlot =
  | "boot"
  | "pressStart"
  | "menuSelect"
  | "menuBack"
  | "menuConfirm"
  | "startButton"
  | "battleStart"
  | "pcOpen"
  | "bagOpen";

export const SOUND_SLOTS: { slot: SoundSlot; label: string; note: string }[] = [
  { slot: "boot", label: "BOOT SOUND", note: "Played once when the game boots." },
  { slot: "pressStart", label: "PRESS-START SOUND", note: "Title screen, press start to enter the main menu." },
  { slot: "menuSelect", label: "MENU SELECT", note: "Press A / tap a menu option." },
  { slot: "menuBack", label: "MENU BACK", note: "Press B / back out of a menu." },
  { slot: "menuConfirm", label: "MENU CONFIRM", note: "Confirm a choice inside a menu." },
  { slot: "startButton", label: "START BUTTON", note: "Start button on the title / pause menu." },
  { slot: "battleStart", label: "BATTLE START", note: "When a battle opens." },
  { slot: "pcOpen", label: "PC OPEN", note: "Opening the PC / DigiCore storage." },
  { slot: "bagOpen", label: "BAG OPEN", note: "Opening the bag." },
];

export type BuiltinSound = {
  id: string;
  label: string;
  file: string;
  seconds: number;
};

export const BUILTIN_SOUNDS: BuiltinSound[] = [
  { id: "B", label: "B — Rising arpeggio (boot default)", file: "/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav", seconds: 1.95 },
  { id: "M3", label: "M3 — Mochii chirp (press-start / select default)", file: "/audio/mochiichao-boot-M3-mochii-chirp.wav", seconds: 1.364 },
  { id: "M2", label: "M2 — Harbour bell", file: "/audio/mochiichao-boot-M2-harbour-bell.wav", seconds: 2.667 },
  { id: "M1", label: "M1 — Data spark", file: "/audio/mochiichao-boot-M1-data-spark.wav", seconds: 1.25 },
  { id: "A", label: "A — Two-note chime", file: "/audio/mochiichao-boot-ui-art-option-a-two-note-chime.wav", seconds: 0 },
  { id: "C", label: "C — Melodic logo", file: "/audio/mochiichao-boot-ui-art-option-c-melodic-logo.wav", seconds: 0 },
];

export const SLOT_DEFAULTS: Record<SoundSlot, string> = {
  boot: "B",
  pressStart: "M3",
  menuSelect: "M3",
  menuBack: "M3",
  menuConfirm: "M3",
  startButton: "M3",
  battleStart: "B",
  pcOpen: "M3",
  bagOpen: "M3",
};

export type ChirpSpec = {
  name: string;
  wave: Wave;
  freqStart: number;
  freqEnd: number;
  durationMs: number;
  volume: number;
};

export type JingleNote = { note: string; beats: number };
export type JingleSpec = {
  name: string;
  bpm: number;
  wave: Wave;
  notes: JingleNote[];
};

export const NOTE_FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, G3: 196.0, A3: 220.0, B3: 246.94, E3: 164.81, D3: 146.83,
};

export function validateChirp(c: ChirpSpec): string[] {
  const errs: string[] = [];
  if (c.freqStart < 20 || c.freqStart > 8000) errs.push("freqStart must be 20–8000 Hz");
  if (c.freqEnd < 20 || c.freqEnd > 8000) errs.push("freqEnd must be 20–8000 Hz");
  if (c.durationMs < 30 || c.durationMs > 5000) errs.push("duration must be 30–5000 ms");
  if (c.volume < 0 || c.volume > 1) errs.push("volume must be 0–1");
  if (!c.name.trim()) errs.push("name is required");
  return errs;
}

export function jingleDurationSeconds(j: JingleSpec): number {
  const beats = j.notes.reduce((s, n) => s + n.beats, 0);
  return (beats * 60) / j.bpm;
}

export function playChirp(c: ChirpSpec): void {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = c.wave;
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(c.freqStart, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, c.freqEnd), t + c.durationMs / 1000);
  gain.gain.setValueAtTime(c.volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + c.durationMs / 1000);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + c.durationMs / 1000 + 0.05);
  osc.onended = () => void ctx.close();
}

export function playJingle(j: JingleSpec): void {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  let t = ctx.currentTime + 0.05;
  for (const n of j.notes) {
    const freq = NOTE_FREQ[n.note];
    if (!freq) continue;
    const dur = (n.beats * 60) / j.bpm;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = j.wave;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    t += dur;
  }
  window.setTimeout(() => void ctx.close(), (t - ctx.currentTime + 0.2) * 1000);
}

/** Render a chirp to a WAV blob (OfflineAudioContext, no new deps). */
export async function chirpToWav(c: ChirpSpec): Promise<Blob> {
  const sampleRate = 44100;
  const frames = Math.floor((sampleRate * c.durationMs) / 1000);
  const AC = window.OfflineAudioContext;
  const ctx = new AC(1, frames, sampleRate);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = c.wave;
  osc.frequency.setValueAtTime(c.freqStart, 0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, c.freqEnd), frames / sampleRate);
  gain.gain.setValueAtTime(c.volume, 0);
  gain.gain.exponentialRampToValueAtTime(0.001, frames / sampleRate);
  osc.connect(gain).connect(ctx.destination);
  osc.start(0);
  const buf = await ctx.startRendering();
  const data = buf.getChannelData(0);
  const wav = new DataView(new ArrayBuffer(44 + data.length * 2));
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) wav.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); wav.setUint32(4, 36 + data.length * 2, true); w(8, "WAVE");
  w(12, "fmt "); wav.setUint32(16, 16, true); wav.setUint16(20, 1, true);
  wav.setUint16(22, 1, true); wav.setUint32(24, sampleRate, true);
  wav.setUint32(28, sampleRate * 2, true); wav.setUint16(32, 2, true); wav.setUint16(34, 16, true);
  w(36, "data"); wav.setUint32(40, data.length * 2, true);
  for (let i = 0; i < data.length; i++) {
    const v = Math.max(-1, Math.min(1, data[i]));
    wav.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
  }
  return new Blob([wav], { type: "audio/wav" });
}

export const CREATOR_STORAGE_KEY = "mochiichao_sound_creator_v1";

export type CustomSound = { id: string; kind: "chirp" | "jingle"; spec: ChirpSpec | JingleSpec };
export type CreatorSave = {
  slots: Record<SoundSlot, string>;
  customs: CustomSound[];
  chatter: Record<string, string>;
  capsule: BallCapsule;
};

export const DEFAULT_CREATOR_SAVE: CreatorSave = {
  slots: { ...SLOT_DEFAULTS },
  customs: [],
  chatter: {},
  capsule: { seals: [] },
};

export function loadCreatorSave(): CreatorSave {
  try {
    const raw = localStorage.getItem(CREATOR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CREATOR_SAVE, slots: { ...SLOT_DEFAULTS }, capsule: { seals: [] } };
    const parsed = JSON.parse(raw) as Partial<CreatorSave>;
    return {
      slots: { ...SLOT_DEFAULTS, ...(parsed.slots ?? {}) },
      customs: parsed.customs ?? [],
      chatter: parsed.chatter ?? {},
      capsule: parsed.capsule ?? { seals: [] },
    };
  } catch {
    return { ...DEFAULT_CREATOR_SAVE, slots: { ...SLOT_DEFAULTS }, capsule: { seals: [] } };
  }
}

export function persistCreatorSave(save: CreatorSave): void {
  try { localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(save)); } catch { /* storage full/blocked: creator still works in-session */ }
}

/* --- Ball Seals (DPPT structure, Mochiichao-original seal names) --- */
export type SealKind = "letter" | "star" | "heart" | "sparkle" | "flower" | "ring";
export type SealPlacement = { kind: SealKind; letter?: string };
export type BallCapsule = { seals: SealPlacement[] };

export const SEAL_KINDS: { kind: SealKind; label: string; glyph: string }[] = [
  { kind: "letter", label: "Letter seal (A–Z)", glyph: "A" },
  { kind: "star", label: "Star seal", glyph: "★" },
  { kind: "heart", label: "Heart seal", glyph: "♥" },
  { kind: "sparkle", label: "Sparkle seal", glyph: "✦" },
  { kind: "flower", label: "Flower seal", glyph: "✿" },
  { kind: "ring", label: "Ring seal", glyph: "◎" },
];

/** Effects shown on send-out, in capsule order. Letters render as the letter itself. */
export function sealEffectsForSendOut(capsule: BallCapsule): string[] {
  return capsule.seals.map((s) => {
    if (s.kind === "letter") return s.letter ? `Letter ${s.letter.toUpperCase()}` : "Letter seal";
    const found = SEAL_KINDS.find((k) => k.kind === s.kind);
    return found ? `${found.label} ${found.glyph}` : s.kind;
  });
}

/* --- Music Creator (Black 2 sequenced structure + title-music shape) --- */
export type MusicInstrument = "8bit" | "piano" | "guitar" | "drums" | "vocal" | "organ" | "bass";
export type MusicTrack = { instrument: MusicInstrument; steps: (string | null)[] };
export type MusicSpec = {
  name: string;
  bpm: number;
  key: string;
  bars: number;
  stepsPerBar: number;
  tracks: MusicTrack[];
};

export const DEFAULT_MUSIC_SPEC: MusicSpec = {
  name: "DigiCore Default (title shape)",
  bpm: 112,
  key: "G major",
  bars: 16,
  stepsPerBar: 4,
  tracks: [
    { instrument: "bass", steps: Array<string | null>(64).fill(null) },
    { instrument: "drums", steps: Array<string | null>(64).fill(null) },
    { instrument: "guitar", steps: Array<string | null>(64).fill(null) },
    { instrument: "8bit", steps: Array<string | null>(64).fill(null) },
    { instrument: "organ", steps: Array<string | null>(64).fill(null) },
    { instrument: "vocal", steps: Array<string | null>(64).fill(null) },
  ],
};

export function musicStepCount(m: MusicSpec): number {
  return m.bars * m.stepsPerBar;
}

export function validateMusic(m: MusicSpec): string[] {
  const errs: string[] = [];
  if (m.bpm < 40 || m.bpm > 240) errs.push("bpm must be 40–240");
  if (m.bars < 1 || m.bars > 64) errs.push("bars must be 1–64");
  const want = musicStepCount(m);
  for (const t of m.tracks) {
    if (t.steps.length !== want) errs.push(`${t.instrument} track must have ${want} steps`);
  }
  return errs;
}

export function playMusicStep(m: MusicSpec, step: number, ctx: AudioContext): void {
  const stepDur = 60 / m.bpm / 2;
  void stepDur;
  for (const track of m.tracks) {
    const note = track.steps[step];
    if (!note) continue;
    if (track.instrument === "drums") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
      continue;
    }
    const freq = NOTE_FREQ[note];
    if (!freq) continue;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = track.instrument === "8bit" ? "square" : track.instrument === "bass" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
}
