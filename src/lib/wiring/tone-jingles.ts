/**
 * Mochiichao jingles as data — Tone.js (MIT) step sequences.
 * The audio manager in src/lib/audio-system.ts already plays synth
 * patterns; this module expresses victory / badge / level-up as
 * note + timing data through Tone, so a jingle can be tested,
 * transposed, and reused without an audio file. Original notes
 * only — no commercial melody is copied here.
 * Tone.start() must be called on a user gesture, never on load.
 */
import * as Tone from "tone";

export type JingleNote = { note: string; time: string };

export const VICTORY_JINGLE: JingleNote[] = [
  { note: "C5", time: "0:0:0" },
  { note: "E5", time: "0:0:1" },
  { note: "G5", time: "0:0:2" },
  { note: "C6", time: "0:1:0" },
];
export const BADGE_JINGLE: JingleNote[] = [
  { note: "G4", time: "0:0:0" },
  { note: "C5", time: "0:0:1" },
  { note: "E5", time: "0:0:2" },
];
export const LEVELUP_JINGLE: JingleNote[] = [
  { note: "C5", time: "0:0:0" },
  { note: "D5", time: "0:0:1" },
  { note: "E5", time: "0:0:2" },
  { note: "G5", time: "0:0:3" },
];

export async function playJingle(notes: JingleNote[]) {
  await Tone.start();
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const part = new Tone.Part(
    (time, value) => {
      synth.triggerAttackRelease(value.note, "8n", time);
    },
    notes.map((n) => [n.time, n] as [string, JingleNote]),
  );
  part.start(0);
  Tone.getTransport().start();
  return () => {
    part.stop();
    part.dispose();
    synth.dispose();
  };
}
