/**
 * Title cry gate — species-indexed cry table + PlayCry API
 * (Mars, 2026-10-26; title 10 confirmed 2026-10-26 ~14:48 CDT).
 *
 * Structure translated from the Pokemon title system, audio never
 * copied: FireRed keeps one cry entry per species in its cry table
 * (species order, species -> cry-ID mapping) and the title press
 * calls PlayCry_Normal(TITLE_SPECIES, 0), waits 90 frames, then
 * fades white. This module is the Mochiichao equivalent of that
 * table + API + timing, for the title press only:
 *   press -> playTitleCry(current creature) -> 90-frame wait
 *   (TITLE_CRY_WAIT_MS, 1.5s at 60fps) -> Platinum 'normal'
 *   white fade (driven by TitleScene's existing exit driver).
 *
 * TITLE 10 ONLY. The table holds exactly the 10 title-pool
 * creatures Mars confirmed: Mochii, Razorgater, Tyrage, Kittember,
 * Sproutle, Dorowani, Gabu, Wispkin, Yogiferno, Mythar. The other
 * 39 roster cries + 2 Neon v2 alternatives are NOT approved and
 * are deliberately NOT in this table — a caller asking for any
 * other creature gets null / false, never a guessed file.
 *
 * Pan / volume / priority, stated plainly (no source gives
 * per-creature values, so none are invented):
 * - Pan: PlayCry_Normal's second argument is pan, and the approved
 *   spec passes 0 (centre). The STEREO passthrough in audioRouting
 *   centres at pan 0, so cries play centred; per-creature pan is
 *   not canon and is not guessed here.
 * - Volume: the SFX bus default. No per-creature volume exists in
 *   any source, so none is applied.
 * - Priority: normal — one one-shot on the SFX bus, no ducking of
 *   the title music. The title track stays the same loop underneath;
 *   a cry sits on top of the press moment and does not replace it.
 *
 * Fail-closed (same rule as playAudioUrl): an unknown creature or
 * a missing file returns false and never throws; a missing file
 * stays GAP, and no replacement sound is ever invented here.
 *
 * Reuse: this table + playTitleCry is the shared API the title,
 * battle and lab paths call — one cry per creature, reused in all
 * three, exactly like Pokemon's species-indexed reuse. Battle and
 * lab call sites are a later batch, not this one.
 */

import { playAudioUrl } from './audioRouting';

/** FireRed title-press wait: 90 frames at 60fps = 1.5 seconds. */
export const TITLE_CRY_WAIT_FRAMES = 90;
export const TITLE_CRY_WAIT_MS = 1500;

/**
 * Species-indexed cry files, title 10 only. Paths are the real
 * repo paths under public/ (served from the site root as /audio/...),
 * shipped in PR #193 (public/audio/cries/, 51 files, files only).
 * Only the 10 confirmed files are listed here.
 */
export const TITLE_CRY_FILES: Record<string, string> = {
  Mochii: '/audio/cries/mochii-cry.wav',
  Razorgater: '/audio/cries/razorgater-cry.wav',
  Tyrage: '/audio/cries/tyrage-cry.wav',
  Kittember: '/audio/cries/kittember-cry.wav',
  Sproutle: '/audio/cries/sproutle-cry.wav',
  Dorowani: '/audio/cries/dorowani-cry.wav',
  Gabu: '/audio/cries/gabu-cry.wav',
  Wispkin: '/audio/cries/wispkin-cry.wav',
  Yogiferno: '/audio/cries/yogiferno-cry.wav',
  Mythar: '/audio/cries/mythar-cry.wav',
};

/** Cry file for a creature, or null when it is not in the title 10 table. */
export function titleCryUrl(creatureName: string | undefined): string | null {
  if (!creatureName) return null;
  return TITLE_CRY_FILES[creatureName] ?? null;
}

/**
 * PlayCry_Normal equivalent for the title press: play the creature's
 * cry centred, normal priority, through the SFX bus (so it honours
 * the current MONO / STEREO routing). Returns false for any creature
 * outside the title 10 table, or when the file cannot be played.
 */
export async function playTitleCry(creatureName: string | undefined): Promise<boolean> {
  const url = titleCryUrl(creatureName);
  if (!url) return false;
  return playAudioUrl(url, 'sfx');
}
