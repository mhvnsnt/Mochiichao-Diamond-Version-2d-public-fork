// Interchangeable title start screens — preset registry + state machine.
//
// Modelled on the verified cross-generation title research
// (~/workspace/mochiichao-work/ui-art/title-backgrounds/preset-research/cross-generation-title-research.md,
// also summarised in docs/title-start-screens.md):
//   - Platinum app states (decomps/pokeplatinum/src/applications/title_screen.c,
//     VERIFIED ON DISK): INIT_RESOURCES -> SHOW_INTRO -> INIT_SOUND ->
//     MAIN -> EXIT_NORMAL / EXIT_REPLAY_OPENING -> CLEANUP, exit fade
//     delay TITLE_SCREEN_EXIT_FADE_DELAY_FRAMES = 10.
//   - FireRed scene table (pokefirered-leafgreen/src/title_screen.c):
//     TITLESCREENSCENE_INIT -> FLASHSPRITE -> FADEIN -> RUN ->
//     RESTART / CRY; RUN tasks are the press-start blink + one spawner.
//   - HeartGold main states (pokeheartgold/src/title_screen.c):
//     WAIT_FADE -> START_MUSIC -> PLAY -> PROCEED_FLASH ->
//     PROCEED_FLASH_2 / PROCEED_NOFLASH -> FADEOUT.
//   - Black 2 title source was NOT found and Diamond title code was
//     NOT found — neither is claimed here; Black 2 weather/camera
//     layers already inside TitleScene are reused, not a Black 2
//     title machine.
// The machine below is therefore INIT -> FADEIN -> RUN -> PROCEED ->
// FADEOUT: Platinum's shape, FireRed's scene-table names, HeartGold's
// PROCEED_FLASH as the exit flash (the locked default's existing
// white fade 350ms + M3 chirp press sound, reused — not redefined).
//
// COMPATIBILITY, READ BEFORE RENAMING ANYTHING:
//   - Preset ids are IDENTICAL to open PR #157's definitions-only
//     registry (src/lib/titleScreenPresets.ts, NOT on main), so a
//     later #157 merge does not rename any preset.
//   - The localStorage key is IDENTICAL to open PR #199's selection
//     module (src/lib/titleScreenPresetSelection.ts, NOT on main),
//     so a later #199 merge does not move the player's choice.
//   - This module's filenames are DELIBERATELY different from both
//     (#157: titleScreenPresets.ts, #199: titleScreenPresetSelection.ts)
//     so this batch merges to main WITHOUT them and cannot collide
//     with either file on a later merge.
//   - No Pokemon art, creature art, sound, name, dialogue, or cry
//     appears in this file. Biomes are generic terrain/weather only;
//     creatures are the Mochiichao title pool already on main.

import { TITLE_BIOMES, type TitleBiomeId } from './titleBiomes';
import yogifernoCutout from '../assets/title/yogiferno-walk-cutout.png';
import sproutleCutout from '../assets/title/sproutle-walk-cutout.png';
import dorowaniCutout from '../assets/title/dorowani-walk-cutout.png';
import tyrageCutout from '../assets/title/tyrage-walk-cutout.png';
import razorgaterCutout from '../assets/title/razorgater-walk-cutout.png';
import gabuCutout from '../assets/title/gabu-walk-cutout.png';
import mochiiCutout from '../assets/title/mochii-walk-cutout.png';
import wispkinCutout from '../assets/title/wispkin-walk-cutout.png';
import mytharCutout from '../assets/title/mythar-walk-cutout.png';
import kittemberCutout from '../assets/title/kittember-walk-cutout.png';

export type TitleStartScreenId =
  | 'title-snow-yogiferno'
  | 'title-grass-sproutle'
  | 'title-water-dorowani'
  | 'title-sand-tyrage'
  | 'title-stone-razorgater'
  | 'title-forest-gabu'
  | 'title-rain-mochii'
  | 'title-night-wispkin'
  | 'title-mythar-mythar'
  | 'title-lantern-kittember';

export interface TitleStartScreenPreset {
  id: TitleStartScreenId;
  /** Short Settings-row label, e.g. 'Snow — Yogiferno'. */
  label: string;
  biome: TitleBiomeId;
  /** Title-pool creature name, as TitleScene's figureName expects it
   *  (drives the per-creature action + effect burst). */
  creature: string;
  /** Figure cutout already on main (src/assets/title/<slug>-walk-cutout.png). */
  figureUrl: string;
  /** Video file slug, for the lazy loader below. */
  videoSlug: string;
}

/**
 * Video loaders — one STATIC dynamic import per preset. Vite turns
 * each import() into its own chunk, so only the SELECTED preset's
 * video is fetched; the other nine are never in the initial bundle
 * and never downloaded until that preset is selected. A variable
 * import path would defeat that split, so the map is written out
 * in full here, never computed from a string template.
 * Files on main: src/assets/title/videos/<slug>-title-anim-final.mp4.
 */
type VideoLoader = () => Promise<{ default: string }>;
const TITLE_START_VIDEO_LOADERS: Record<string, VideoLoader> = {
  yogiferno: () => import('../assets/title/videos/yogiferno-title-anim-final.mp4'),
  sproutle: () => import('../assets/title/videos/sproutle-title-anim-final.mp4'),
  dorowani: () => import('../assets/title/videos/dorowani-title-anim-final.mp4'),
  tyrage: () => import('../assets/title/videos/tyrage-title-anim-final.mp4'),
  razorgater: () => import('../assets/title/videos/razorgater-title-anim-final.mp4'),
  gabu: () => import('../assets/title/videos/gabu-title-anim-final.mp4'),
  mochii: () => import('../assets/title/videos/mochii-title-anim-final.mp4'),
  wispkin: () => import('../assets/title/videos/wispkin-title-anim-final.mp4'),
  mythar: () => import('../assets/title/videos/mythar-title-anim-final.mp4'),
  kittember: () => import('../assets/title/videos/kittember-title-anim-final.mp4'),
};

/** Lazy-load one preset's video. Returns null on any failure — the
 *  caller falls back to TitleScene's painted background, never to
 *  another preset's video and never to a substitute creature's art. */
export async function loadTitleStartVideo(preset: TitleStartScreenPreset): Promise<string | null> {
  const loader = TITLE_START_VIDEO_LOADERS[preset.videoSlug];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default || null;
  } catch {
    return null;
  }
}

export const TITLE_START_SCREENS: TitleStartScreenPreset[] = [
  { id: 'title-snow-yogiferno', label: 'Snow — Yogiferno', biome: 'snow', creature: 'Yogiferno', figureUrl: yogifernoCutout, videoSlug: 'yogiferno' },
  { id: 'title-grass-sproutle', label: 'Grass — Sproutle', biome: 'grass', creature: 'Sproutle', figureUrl: sproutleCutout, videoSlug: 'sproutle' },
  { id: 'title-water-dorowani', label: 'Water — Dorowani', biome: 'water', creature: 'Dorowani', figureUrl: dorowaniCutout, videoSlug: 'dorowani' },
  { id: 'title-sand-tyrage', label: 'Sand — Tyrage', biome: 'sand', creature: 'Tyrage', figureUrl: tyrageCutout, videoSlug: 'tyrage' },
  { id: 'title-stone-razorgater', label: 'Stone — Razorgater', biome: 'stone', creature: 'Razorgater', figureUrl: razorgaterCutout, videoSlug: 'razorgater' },
  { id: 'title-forest-gabu', label: 'Forest — Gabu', biome: 'forest', creature: 'Gabu', figureUrl: gabuCutout, videoSlug: 'gabu' },
  { id: 'title-rain-mochii', label: 'Rain — Mochii', biome: 'rain', creature: 'Mochii', figureUrl: mochiiCutout, videoSlug: 'mochii' },
  { id: 'title-night-wispkin', label: 'Night — Wispkin', biome: 'night', creature: 'Wispkin', figureUrl: wispkinCutout, videoSlug: 'wispkin' },
  { id: 'title-mythar-mythar', label: 'Mythar — Mythar', biome: 'mythar', creature: 'Mythar', figureUrl: mytharCutout, videoSlug: 'mythar' },
  { id: 'title-lantern-kittember', label: 'Lantern — Kittember', biome: 'lantern', creature: 'Kittember', figureUrl: kittemberCutout, videoSlug: 'kittember' },
];

export const TITLE_START_SCREEN_MAP: Record<TitleStartScreenId, TitleStartScreenPreset> =
  Object.fromEntries(TITLE_START_SCREENS.map((p) => [p.id, p])) as Record<TitleStartScreenId, TitleStartScreenPreset>;

/** Settings cycle order: Locked Default first, then the 10 presets
 *  in registry order. null = locked default (no preset selected). */
export const TITLE_START_SCREEN_CYCLE: (TitleStartScreenId | null)[] = [
  null,
  ...TITLE_START_SCREENS.map((p) => p.id),
];

// --- Selection storage (same key as PR #199, see header) --------

/** Same localStorage key as PR #199's selection module. */
export const TITLE_START_SCREEN_STORAGE_KEY = 'mochiichao_player_title_screen_preset';

/** Read the player's choice. Unknown / stale ids read back as null
 *  (= locked default), never as a broken scene; storage errors
 *  (private mode) also read back as null. */
export function getSelectedTitleStartScreenId(): TitleStartScreenId | null {
  try {
    const raw = localStorage.getItem(TITLE_START_SCREEN_STORAGE_KEY);
    if (!raw) return null;
    return (TITLE_START_SCREENS.some((p) => p.id === raw) ? raw : null) as TitleStartScreenId | null;
  } catch {
    return null;
  }
}

/** Write the player's choice (null clears it = locked default). */
export function setSelectedTitleStartScreenId(id: TitleStartScreenId | null): void {
  try {
    if (id === null) localStorage.removeItem(TITLE_START_SCREEN_STORAGE_KEY);
    else localStorage.setItem(TITLE_START_SCREEN_STORAGE_KEY, id);
  } catch {
    /* private mode: the caller's in-session state still applies */
  }
}

export function resolveTitleStartScreen(id: TitleStartScreenId | null): TitleStartScreenPreset | null {
  if (!id) return null;
  return TITLE_START_SCREEN_MAP[id] ?? null;
}

export function titleStartScreenLabel(id: TitleStartScreenId | null): string {
  if (!id) return 'Locked Default';
  return resolveTitleStartScreen(id)?.label ?? 'Locked Default';
}

// --- Preset state machine (Platinum + FireRed model) -------------

export type TitleStartState = 'INIT' | 'FADEIN' | 'RUN' | 'PROCEED' | 'FADEOUT';
export type TitleStartEvent = 'ready' | 'press' | 'fadeDone';

/** Blink tempo, shared with the locked default (FireRed
 *  title_screen.c: first blink 60 frames, then alternating every
 *  30 frames). At 60fps: 1000ms on first, then 500ms on / 500ms off.
 *  The locked TITLE CSS renders exactly this (press-blink-first 1s
 *  steps(1) 1, then press-blink 1s steps(1) 1s infinite); the preset
 *  overlay copies that CSS verbatim, so this constant documents the
 *  tempo rather than re-implementing it in JS. */
export const TITLE_START_BLINK_FIRST_MS = 1000;
export const TITLE_START_BLINK_CYCLE_MS = 1000;
/** Press path, reused from the locked default: M3 chirp + white
 *  fade 350ms, then MAIN_MENU (IntroSequence advanceIntro). The
 *  machine's PROCEED state is that fade; FADEOUT completes it. */
export const TITLE_START_FADE_MS = 350;

/** Pure transition table. Illegal events leave the state unchanged
 *  (a press during INIT/FADEIN is ignored, never queued, so a
 *  double-press cannot skip the fade or double-fire the chirp). */
export function titleStartNextState(state: TitleStartState, event: TitleStartEvent): TitleStartState {
  switch (state) {
    case 'INIT': return event === 'ready' ? 'FADEIN' : 'INIT';
    case 'FADEIN': return event === 'fadeDone' ? 'RUN' : 'FADEIN';
    case 'RUN': return event === 'press' ? 'PROCEED' : 'RUN';
    case 'PROCEED': return event === 'fadeDone' ? 'FADEOUT' : 'PROCEED';
    case 'FADEOUT': return 'FADEOUT';
    default: return state;
  }
}

// --- Validation (GAPs reported, never substituted) ---------------

export interface TitleStartScreenGap {
  presetId: TitleStartScreenId;
  missing: string[];
}

/** Check every preset's wired assets. A missing entry is reported
 *  as a GAP string for that preset; validation NEVER substitutes
 *  another preset's figure, background, or video. On main at branch
 *  time all 10 presets validate with 0 gaps (10 cutouts, 10 painted
 *  backgrounds via TITLE_BIOMES, 10 video loaders above). */
export function validateTitleStartScreens(): TitleStartScreenGap[] {
  const gaps: TitleStartScreenGap[] = [];
  for (const preset of TITLE_START_SCREENS) {
    const missing: string[] = [];
    if (!preset.figureUrl) missing.push('figure cutout');
    if (!TITLE_BIOMES[preset.biome]?.backgroundImage) missing.push('painted background');
    if (!TITLE_START_VIDEO_LOADERS[preset.videoSlug]) missing.push('video loader');
    if (missing.length > 0) gaps.push({ presetId: preset.id, missing });
  }
  return gaps;
}
