/**
 * Start-screen playback — resolving + sounding a saved preset
 * (batch after CREATE START SCREEN, PR #44).
 *
 * What this file does, and nothing else:
 *   - picks the ACTIVE preset for the title/start screen: the most
 *     recently saved user preset (max savedAt), or the LOCKED
 *     DEFAULT when no user preset exists or none validates.
 *     The locked default is never overwritten — it is only ever
 *     returned as a fresh copy, exactly as loadStartScreenPresets
 *     does. A saved preset does NOT need Mars to "lock it in"
 *     before it plays: saving is what makes it the active one
 *     here, and Reset to Locked Default in the creator is what
 *     returns playback to the default (by deleting user presets
 *     in a later creator pass — this file never deletes anything).
 *   - names the two settled audio roles, and nothing else:
 *       BOOT       = UI Art Option B rising arpeggio
 *                    (public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav)
 *       PRESS-START= M3 Mochii Chirp, PR #36
 *                    (public/audio/mochiichao-boot-M3-mochii-chirp.wav)
 *     M3 is NEVER used as the boot sound, and no Pokemon track is
 *     wired anywhere here. Title music itself is GAP — no music
 *     field is invented, and neither sound above is title music.
 *
 * What this file does NOT do (labelled GAP, later batches):
 *   - intro playback from a saved preset (separate batch, INTRO
 *     phase untouched here)
 *   - Phase 2 export (FFmpeg desktop / MediaRecorder)
 *   - painted backgrounds / 9/10 creature cutouts: the playback
 *     component honours the preset file's own availability table
 *     (startScreenCreatureArtAvailable: Yogiferno only) and shows
 *     GAP labels for everything else — never fake art, never a
 *     stand-in sprite. NOTE: main has since merged 9/10 cutouts
 *     (PR #51) and 8 painted backgrounds (PR #48/#53), but this
 *     batch deliberately does NOT wire them in: the task's
 *     show-first rule keeps them out of this new full-screen
 *     playback until Mars has seen them here. A follow-up batch
 *     lifts that by updating startScreenPreset.ts's availability
 *     table — not by quietly substituting art in this file.
 *   - fonts, themes, HUD, main menu, saves: untouched.
 *
 * Audio files live in public/audio, so their URL is built from
 * import.meta.env.BASE_URL (the Pages build base) rather than a
 * hard-coded absolute path, which would 404 under the repo subpath.
 * Playback failures (autoplay policy, missing file) are swallowed:
 * a silent start screen is a degraded sound, never a crash.
 */

import {
  LOCKED_START_SCREEN_PRESET,
  loadStartScreenPresets,
  validateStartScreenPreset,
  type StartScreenPreset,
} from './startScreenPreset';

export type StartScreenPlaybackSource = 'saved' | 'locked-default';

export interface ResolvedStartScreenPreset {
  preset: StartScreenPreset;
  source: StartScreenPlaybackSource;
}

/**
 * Resolve the preset the title/start screen plays.
 * Saved presets are validated again here (a hand-edited
 * localStorage entry that fails validation falls back to the
 * locked default instead of crashing playback).
 */
export function resolveActiveStartScreenPreset(): ResolvedStartScreenPreset {
  const locked: StartScreenPreset = {
    ...LOCKED_START_SCREEN_PRESET,
    layout: { ...LOCKED_START_SCREEN_PRESET.layout },
  };
  try {
    const list = loadStartScreenPresets();
    const user = list.filter(
      (p) => p.name !== LOCKED_START_SCREEN_PRESET.name && validateStartScreenPreset(p).length === 0,
    );
    if (user.length === 0) return { preset: locked, source: 'locked-default' };
    // Most recently saved wins; ties keep the last listed entry.
    let active = user[0];
    for (const p of user) {
      if ((p.savedAt || 0) >= (active.savedAt || 0)) active = p;
    }
    return { preset: { ...active, layout: { ...active.layout } }, source: 'saved' };
  } catch {
    return { preset: locked, source: 'locked-default' };
  }
}

const BOOT_SOUND_FILE = 'mochiichao-boot-ui-art-option-b-rising-arpeggio.wav';
const PRESS_SOUND_FILE = 'mochiichao-boot-M3-mochii-chirp.wav';

export const START_SCREEN_BOOT_SOUND = BOOT_SOUND_FILE;
export const START_SCREEN_PRESS_SOUND = PRESS_SOUND_FILE;

function soundUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}audio/${file}`;
}

export function startScreenBootSoundUrl(): string {
  return soundUrl(BOOT_SOUND_FILE);
}

export function startScreenPressSoundUrl(): string {
  return soundUrl(PRESS_SOUND_FILE);
}

function playSound(url: string): void {
  try {
    const audio = new Audio(url);
    const played = audio.play();
    if (played && typeof played.catch === 'function') played.catch(() => undefined);
  } catch {
    /* silent fallback: sound is never fatal to the start screen */
  }
}

/** BOOT role only: UI Art Option B rising arpeggio. Never M3. */
export function playStartScreenBootSound(): void {
  playSound(startScreenBootSoundUrl());
}

/** PRESS-START role only: M3 Mochii Chirp (PR #36). Never a boot sound. */
export function playStartScreenPressSound(): void {
  playSound(startScreenPressSoundUrl());
}
