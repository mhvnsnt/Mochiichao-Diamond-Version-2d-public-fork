/**
 * Mochiichao audio wiring — registers the title music already on
 * main (PR #36) into the audio manager in src/lib/audio-system.ts.
 * The manager exports a singleton `audio` (MochiAudio), not
 * standalone functions — this module uses that instance.
 * Boot pick is a caller choice (M1/M2/M3 are options only): this
 * module does NOT pick a boot sound and does NOT overwrite the
 * UI Art lane's boot A/B/C pick, which is still unpicked.
 * Call registerTitleMusic() once, on the first user gesture.
 */
import { audio } from "../audio-system";

export type BootPick = "M1" | "M2" | "M3" | null;

export const BOOT_FILES: Record<Exclude<BootPick, null>, string> = {
  M1: "/audio/mochiichao-boot-M1-data-spark.wav",
  M2: "/audio/mochiichao-boot-M2-harbour-bell.wav",
  M3: "/audio/mochiichao-boot-M3-mochii-chirp.wav",
};

export async function registerTitleMusic(bootPick: BootPick = null) {
  await audio.registerFile("title", "/audio/mochiichao-title.wav");
  await audio.registerFile("intro", "/audio/mochiichao-intro.wav");
  // Boot sounds are not scene loops in the manager, so they are
  // returned as a file choice, not registered as a scene.
  return bootPick ? BOOT_FILES[bootPick] : null;
}

export function playTitleMusic() {
  audio.playScene("title");
}
