/**
 * Mochiichao audio wiring — registers the title music already on
 * main (PR #36) into the audio manager in src/lib/audio-system.ts.
 * The manager exports a singleton `audio` (MochiAudio), not
 * standalone functions — this module uses that instance.
 * Boot pick LOCKED by Mars 2026-10-27: M2 harbour-bell.
 * Menu select sound LOCKED by Mars 2026-10-27: M3 mochii-chirp,
 * reassigned from boot candidate to the menu select sound
 * (plays when you press A / tap a main-menu option).
 * The UI Art lane's boot A/B/C options were NOT picked and are
 * not wired here.
 * Call registerTitleMusic() once, on the first user gesture.
 */
import { audio } from "../audio-system";

export type BootPick = "M1" | "M2" | "M3" | null;

// Mars picked M2 as the boot sound, 2026-10-27. M3 is NOT the boot
// sound any more — it is the menu select sound (see below).
export const BOOT_SOUND = "/audio/mochiichao-boot-M2-harbour-bell.wav";
export const MENU_SELECT_SOUND = "/audio/mochiichao-boot-M3-mochii-chirp.wav";

export const BOOT_FILES: Record<Exclude<BootPick, null>, string> = {
  M1: "/audio/mochiichao-boot-M1-data-spark.wav",
  M2: "/audio/mochiichao-boot-M2-harbour-bell.wav",
  M3: "/audio/mochiichao-boot-M3-mochii-chirp.wav",
};

export async function registerTitleMusic(bootPick: BootPick = "M2") {
  await audio.registerFile("title", "/audio/mochiichao-title.wav");
  await audio.registerFile("intro", "/audio/mochiichao-intro.wav");
  // Boot / select sounds are one-shot files, not scene loops in
  // the manager, so they are returned as file URLs, not registered
  // as scenes. The title/menu call-site plays BOOT_SOUND on boot
  // and MENU_SELECT_SOUND on a menu press; a one-shot file player
  // inside the audio manager is still owed, not hidden here.
  return bootPick ? BOOT_FILES[bootPick] : null;
}

export function playTitleMusic() {
  audio.playScene("title");
}
