/**
 * One-shot game sounds — the game's first (and only) audio path.
 *
 * There was no audio engine on main before this file: the PR #36
 * title-music spec names an `audio.registerFile` / `audio.playScene`
 * API, but no `audio-system.ts` exists in src, and SettingsScreen
 * records SOUND as a stored flag only. This module does NOT invent
 * that API and does NOT add a second system alongside anything else:
 * it is a single tiny HTMLAudioElement one-shot player, used only
 * for the two settled sounds below. Title/intro loop music wiring
 * is a separate later step, not claimed here.
 *
 * Roles, settled by Mars 2026-10-25 (docs/ui-art-boot-sound-options.md):
 * - BOOT = UI Art Option B, rising arpeggio
 *   (public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav)
 * - PRESS-START = M3 "Mochii Chirp"
 *   (public/audio/mochiichao-boot-M3-mochii-chirp.wav)
 * The roles are NOT interchangeable: B is never the press-start
 * sound, M3 is never the boot sound.
 *
 * URLs are built from import.meta.env.BASE_URL so the Pages build
 * (base /Mochiichao-Diamond-Version-2d-fresh-start/) resolves them
 * under the repo path, not the domain root.
 *
 * SOUND setting (MONO / STEREO) — NEED, not faked: both settled
 * files are mono WAVs (44,100 Hz, 1 channel), and a mono source
 * played through HTMLAudio is upmixed identically in both channels
 * under either setting, so threading the setting through here
 * would change nothing audible. The setting is therefore NOT read
 * by this module; true mono/stereo routing (Web Audio channel
 * routing, meaningful only once a stereo source exists) is owed
 * in a later audio pass. No volume or pan trick is applied to
 * pretend otherwise.
 *
 * Autoplay: browsers block sound before a user gesture. playOneShot
 * returns the play() promise so the caller can detect the block
 * (see IntroSequence BOOT effect, which retries on first gesture);
 * callers MUST catch the promise — an unhandled rejection is a
 * console error, not a crash, but it is still avoided here.
 * Sounds are NOT stopped when the phase advances: the boot sound
 * plays through into INTRO if the player skips, and the press-start
 * chirp plays through the white fade into MAIN_MENU.
 */

const base = import.meta.env.BASE_URL ?? "/";
const join = (file: string) => `${base.replace(/\/?$/, "/")}${file}`;

/** BOOT sound — UI Art Option B, rising arpeggio, 1.95 s. */
export const BOOT_SOUND_URL = join(
  "audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav",
);

/** PRESS-START sound — M3 "Mochii Chirp", 1.364 s. */
export const PRESS_START_SOUND_URL = join(
  "audio/mochiichao-boot-M3-mochii-chirp.wav",
);

const cache = new Map<string, HTMLAudioElement>();

/**
 * Play a one-shot sound file once. If it is already playing, this
 * is a no-op (no restart, no overlap) — that is what keeps the
 * BOOT sound to one play even under StrictMode's double effect
 * run in development. Returns the play() promise; callers catch it.
 */
export function playOneShot(url: string): Promise<void> {
  let el = cache.get(url);
  if (!el) {
    el = new Audio(url);
    el.preload = "auto";
    cache.set(url, el);
  }
  if (!el.paused) return Promise.resolve();
  el.currentTime = 0;
  const p = el.play();
  return p ?? Promise.resolve();
}
