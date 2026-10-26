/**
 * Boot / press-start audio wiring, 2026-10-25.
 *
 * Settled roles only (Mars):
 * - BOOT SOUND = UI Art Option B rising arpeggio:
 *   public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav
 *   (PR #52, ~1.95s). Played once when the BOOT phase mounts.
 * - PRESS-START SOUND = M3 Mochii Chirp:
 *   public/audio/mochiichao-boot-M3-mochii-chirp.wav (PR #36).
 *   Played on the TITLE phase when the player presses start
 *   (PRESS ANY KEY) to enter the main menu. M3 is NOT the boot
 *   sound, and it is not wired anywhere else here.
 *
 * NOT wired here, deliberately: the title/intro tracks from PR #36
 * (mochiichao-title.wav, mochiichao-intro.wav and their v2/v3
 * drafts) are DRAFTS only and are not wired as final music. Title
 * music and intro music stay GAP in IntroSequence until Mars locks
 * final tracks.
 *
 * Paths use import.meta.env.BASE_URL (Vite) so the files resolve
 * whether the build is served from '/' or from a sub-path: Vite
 * copies public/audio/* to dist/audio/* at build time.
 *
 * SOUND setting: the existing Settings SOUND row is MONO/STEREO
 * (src/lib/gameSettings.ts) — a channel-layout flag, not a mute
 * switch — and SettingsScreen notes it is a stored flag only. No
 * new settings row is invented here: both sounds play under MONO
 * and under STEREO, and no SettingsScreen / gameSettings file is
 * touched (both are also touched by open PRs #62 and #40). A mute
 * switch, if Mars wants one, is a separate settings decision.
 *
 * Autoplay: the boot sound is attempted on BOOT mount. If the
 * browser blocks sound before any user gesture, the play() promise
 * rejects and is swallowed — the game continues silently rather
 * than throwing. The press-start sound is gesture-triggered
 * (keydown / mousedown on TITLE), so it is not subject to that
 * block. No Pokemon commercial audio, code, or dialogue is used;
 * both files are original Mochiichao files already on main.
 */

export const BOOT_SOUND_FILE =
  'mochiichao-boot-ui-art-option-b-rising-arpeggio.wav';
export const PRESS_START_SOUND_FILE = 'mochiichao-boot-M3-mochii-chirp.wav';

function audioUrl(file: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const withSlash = base.endsWith('/') ? base : `${base}/`;
  return `${withSlash}audio/${file}`;
}

export const BOOT_SOUND_URL = audioUrl(BOOT_SOUND_FILE);
export const PRESS_START_SOUND_URL = audioUrl(PRESS_START_SOUND_FILE);

function playFile(file: string): HTMLAudioElement | null {
  try {
    if (typeof Audio === 'undefined') return null;
    const audio = new Audio(audioUrl(file));
    const played = audio.play();
    if (played && typeof played.catch === 'function') {
      // Autoplay block before first gesture, missing file, or any
      // other playback failure: stay silent, never throw into the
      // title flow.
      played.catch(() => {});
    }
    return audio;
  } catch {
    return null;
  }
}

/** Play the settled boot sound (UI Art Option B rising arpeggio). */
export function playBootSound(): HTMLAudioElement | null {
  return playFile(BOOT_SOUND_FILE);
}

/** Play the settled press-start sound (M3 Mochii Chirp). */
export function playPressStartSound(): HTMLAudioElement | null {
  return playFile(PRESS_START_SOUND_FILE);
}
