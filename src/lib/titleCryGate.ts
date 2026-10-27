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
 * Per-creature variant rotation (Mars, 2026-10-26 ~18:21 CDT;
 * Mochiichao extension, NOT a Pokemon behaviour — Pokemon's
 * decomp gives ONE cry per species, and that structure, timing
 * and press point are what this module keeps). Each title-10
 * creature has its OWN list of calls: shipped V1 (PR #193) first,
 * shipped R1 (PR #209) second — both on main, both confirmed,
 * kept alongside. A title press plays the next call in THAT
 * creature's own list only, rotating v1 -> r1 -> v1 ... in order
 * (deterministic per-creature rotation, never a cross-creature
 * pick, never a global random pick). V1 stays in every list; R1
 * joins it. This supersedes the 2026-10-26 ~16:35 CDT V1-only
 * playback decision for PLAYBACK ONLY — no file is removed.
 * TO ADD A FUTURE CALL: append its /audio/cries/<name>-cry-*.wav
 * path to that creature's array in TITLE_CRY_VARIANTS below
 * (after the r1 entry); rotation includes it automatically in
 * order, and no other file needs to change.
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
 * battle and lab paths call — one variant list per creature,
 * reused in all three, exactly like Pokemon's species-indexed
 * reuse (Pokemon itself has one cry per species; the multi-call
 * rotation inside each list is Mochiichao's extension). Battle
 * and lab call sites are a later batch, not this one.
 */

import { playAudioUrl } from './audioRouting';

/** FireRed title-press wait: 90 frames at 60fps = 1.5 seconds. */
export const TITLE_CRY_WAIT_FRAMES = 90;
export const TITLE_CRY_WAIT_MS = 1500;

/**
 * Species-indexed cry VARIANT lists, title 10 only. Paths are the
 * real repo paths under public/ (served from the site root as
 * /audio/...). Each creature's list holds its OWN calls only, in
 * play order: shipped V1 (PR #193) first, shipped R1 (PR #209)
 * second. Both files per creature were verified present on main
 * before this module shipped the rotation. No creature's list ever
 * contains another creature's file.
 *
 * TO ADD A FUTURE CALL: append its path to that creature's array
 * below (after the r1 entry). Rotation picks it up automatically
 * in order; no other file needs to change.
 */
export const TITLE_CRY_VARIANTS: Record<string, string[]> = {
  Mochii: ['/audio/cries/mochii-cry.wav', '/audio/cries/mochii-cry-r1.wav'],
  Razorgater: ['/audio/cries/razorgater-cry.wav', '/audio/cries/razorgater-cry-r1.wav'],
  Tyrage: ['/audio/cries/tyrage-cry.wav', '/audio/cries/tyrage-cry-r1.wav'],
  Kittember: ['/audio/cries/kittember-cry.wav', '/audio/cries/kittember-cry-r1.wav'],
  Sproutle: ['/audio/cries/sproutle-cry.wav', '/audio/cries/sproutle-cry-r1.wav'],
  Dorowani: ['/audio/cries/dorowani-cry.wav', '/audio/cries/dorowani-cry-r1.wav'],
  Gabu: ['/audio/cries/gabu-cry.wav', '/audio/cries/gabu-cry-r1.wav'],
  Wispkin: ['/audio/cries/wispkin-cry.wav', '/audio/cries/wispkin-cry-r1.wav'],
  Yogiferno: ['/audio/cries/yogiferno-cry.wav', '/audio/cries/yogiferno-cry-r1.wav'],
  Mythar: ['/audio/cries/mythar-cry.wav', '/audio/cries/mythar-cry-r1.wav'],
};

/**
 * First variant per creature (= shipped V1). Kept for guard use:
 * TitleScene's gate checks titleCryUrl(figureName) before playing,
 * so a creature outside the title 10 table still gets no cry and
 * no exit. Playback itself always goes through playTitleCry, which
 * rotates.
 */
export const TITLE_CRY_FILES: Record<string, string> = Object.fromEntries(
  Object.entries(TITLE_CRY_VARIANTS).map(([name, variants]) => [name, variants[0]]),
);

/** A creature's own variant list (a copy), or null when it is not in the title 10 table. */
export function titleCryVariants(creatureName: string | undefined): string[] | null {
  if (!creatureName) return null;
  const variants = TITLE_CRY_VARIANTS[creatureName];
  return variants ? [...variants] : null;
}

/** First-variant cry file for a creature (V1), or null when it is not in the title 10 table. */
export function titleCryUrl(creatureName: string | undefined): string | null {
  if (!creatureName) return null;
  return TITLE_CRY_FILES[creatureName] ?? null;
}

/**
 * Per-creature rotation position, in memory for this page session.
 * One index per creature, never shared across creatures, never
 * random: a creature's presses walk its own list in order.
 */
const variantIndex: Record<string, number> = {};

/**
 * Next call for a creature in its own rotation order, advancing
 * that creature's index (v1 -> r1 -> v1 ...). Returns null for a
 * creature outside the title 10 table. The index advances on every
 * call, so each title-press play for that creature plays the next
 * of its own calls in turn.
 */
export function nextTitleCryUrl(creatureName: string | undefined): string | null {
  const variants = titleCryVariants(creatureName);
  if (!variants || variants.length === 0) return null;
  const index = variantIndex[creatureName as string] ?? 0;
  const url = variants[index % variants.length];
  variantIndex[creatureName as string] = (index + 1) % variants.length;
  return url;
}

/**
 * PlayCry_Normal equivalent for the title press, with Mochiichao's
 * per-creature variant rotation on top of Pokemon's structure:
 * play the next call in the creature's OWN list, centred, normal
 * priority, through the SFX bus (so it honours the current MONO /
 * STEREO routing). Returns false for any creature outside the
 * title 10 table, or when the file cannot be played. It never
 * plays another creature's call for this creature.
 */
export async function playTitleCry(creatureName: string | undefined): Promise<boolean> {
  const url = nextTitleCryUrl(creatureName);
  if (!url) return false;
  return playAudioUrl(url, 'sfx');
}
