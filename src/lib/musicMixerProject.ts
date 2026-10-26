/**
 * Music Mixer — default project definition (see docs/music-mixer-spec.md).
 *
 * The default project is the track currently being worked on: the official
 * title v3 instrumental stems plus Mars's main vocal lead (v16 chain lead,
 * phrase-placed onto the title timeline). Like FL Studio popping up a demo
 * song on first load, this project is loaded the moment the mixer opens —
 * the player deletes stems out of it, or hits NEW for a fresh empty
 * project, and LOAD DEFAULT brings this project back. Files are never
 * deleted: NEW / DELETE only change the in-memory project.
 *
 * Stem provenance (measured, 2026-10-26):
 * - Title stems: the v3 mix stems, trimmed to the exact title loop
 *   length 41.143 s (140 BPM, 24 bars). Raw renders ran long
 *   (43.4–52.5 s); only the first 41.143 s is what the title loop plays,
 *   so the shipped stems are that window, nothing else changed.
 * - Vocal lead: vocal-autotune-v6.wav (v16 lead: pitch x2.73, formant
 *   x1.5, D major, 20 ms glide) with the v16 mix's phrase cuts/delays
 *   applied, padded to 41.143 s, mono (the lead source is mono).
 * - OMITTED for payload (honest): the V15 lead (3.4 MB) and the Pancake
 *   overdub (7.3 MB placed, stereo) would push the payload to ~57 MB.
 *   They stay on the vocal-mix draft branch and can ship later as an
 *   optional vocal-layer pack. Nothing was silently swapped: the lead
 *   here is the current v16 lead, not the v15 one.
 *
 * Paths use import.meta.env.BASE_URL (Vite), like music.ts and
 * bootAudio.ts, so files resolve under '/' or a GitHub Pages sub-path.
 */

export interface MixerStem {
  /** Stable id, used for node bookkeeping. Never reused after delete. */
  id: string;
  /** Channel-strip label shown in the mixer. */
  label: string;
  /** File under public/audio/mixer/. */
  file: string;
  /** 'title' = title v3 instrumental, 'vocal' = Mars vocal layer. */
  kind: 'title' | 'vocal';
  /** Default fader position (mirrors the v3/v16 mix-script volumes). */
  defaultGain: number;
  /** Default pan: -1 left, 0 centre, 1 right. */
  defaultPan: number;
}

export interface MixerChannelState {
  stem: MixerStem;
  gain: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

export const MIXER_LOOP_SECONDS = 41.143;
export const DEFAULT_PROJECT_NAME = 'Title v3 + Vocal (default)';

function audioUrl(file: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const withSlash = base.endsWith('/') ? base : `${base}/`;
  return `${withSlash}audio/mixer/${file}`;
}

export function mixerStemUrl(stem: MixerStem): string {
  return audioUrl(stem.file);
}

export const DEFAULT_STEMS: MixerStem[] = [
  { id: 'title-melody', label: 'Title Melody', file: 'mixer-title-melody.wav', kind: 'title', defaultGain: 0.7, defaultPan: 0 },
  { id: 'title-bass', label: 'Title Bass', file: 'mixer-title-bass.wav', kind: 'title', defaultGain: 1.0, defaultPan: 0 },
  { id: 'title-drums', label: 'Title Drums', file: 'mixer-title-drums.wav', kind: 'title', defaultGain: 1.0, defaultPan: 0 },
  { id: 'title-guitar', label: 'Title Guitar', file: 'mixer-title-guitar.wav', kind: 'title', defaultGain: 0.7, defaultPan: 0 },
  { id: 'title-synth', label: 'Title Synth', file: 'mixer-title-synth.wav', kind: 'title', defaultGain: 0.7, defaultPan: 0 },
  { id: 'title-organ', label: 'Title Organ', file: 'mixer-title-organ.wav', kind: 'title', defaultGain: 0.5, defaultPan: 0 },
  { id: 'vocal-lead', label: 'Main Vocal', file: 'mixer-vocal-lead.wav', kind: 'vocal', defaultGain: 1.0, defaultPan: 0 },
];

export function defaultChannels(): MixerChannelState[] {
  return DEFAULT_STEMS.map((stem) => ({
    stem,
    gain: stem.defaultGain,
    pan: stem.defaultPan,
    muted: false,
    solo: false,
  }));
}
