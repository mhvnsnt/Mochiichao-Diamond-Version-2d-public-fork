/**
 * Intro playback from a saved preset — pure timeline math (no DOM,
 * no Pixi here, so it can be unit-checked without a canvas).
 *
 * Wiring order (spec): creator screens first (PR #42), then THIS
 * batch — intro playback from a saved preset, then start screen
 * playback, then Phase 2 export. One batch per PR.
 *
 * How a preset is chosen (the creator ships NO active-preset
 * concept — presets are a list in localStorage under
 * INTRO_VIDEO_PRESETS_KEY, locked default first, user presets
 * appended in save order):
 * - If any valid user (non-locked) preset exists, the MOST RECENTLY
 *   SAVED one plays (last in the stored list — saveIntroVideoPreset
 *   appends, or re-appends a re-saved name). Saving a new preset in
 *   the creator therefore changes what the intro plays, with no
 *   extra "activate" step to invent.
 * - If no user preset exists (fresh install, cleared storage, or
 *   every stored preset fails validation), the LOCKED DEFAULT plays.
 *   The locked default is never overwritten: it is rebuilt from
 *   createLockedDefaultPreset(), never read-then-written back.
 *
 * Timeline (seconds, 60 fps source data):
 * - Scenes play back to back in preset order. Scene i starts at
 *   startTime(i) = sum of the durations of scenes before it.
 * - totalDuration() is reused from introVideoCreator.ts.
 * - A scene's transition runs over the FIRST TRANSITION_SECONDS of
 *   that scene (the incoming scene animates in): fade-black starts
 *   fully black and fades out, fade-white the same in white,
 *   shutter-wipe starts fully covered by bars that retract,
 *   slide starts offset to the right and slides to rest. The first
 *   scene of the preset plays its transition too, so the intro
 *   never hard-cuts in from BOOT.
 * - sceneAt(t) returns the active scene index + local time + the
 *   transition progress (0 = transition just started, 1 = done).
 *   At/after the total duration the preset is finished (done: true).
 *
 * Camera / keyframes: reused, not re-derived — cameraAt() carries
 * the translated Pokemon title math (sine drift + camera keyframes
 * + deterministic shake) and keyframedValue() carries position /
 * scale / opacity interpolation. This file only maps those resolved
 * values onto Pixi coordinates (see IntroVideoPlayer).
 *
 * GAP, labelled honestly, never faked:
 * - Painted backgrounds: a scene whose background is 'painted'
 *   renders the biome fallback palette + a GAP label; no painted
 *   art is invented (Title Backgrounds lane still owes it).
 * - Creature cutouts: only Yogiferno has a clean cutout in the repo
 *   (src/assets/title/yogiferno-walk-cutout.png). Any other
 *   rotation-pool creature in a scene renders as a GAP label, never
 *   fake art.
 * - Music: the music slot is a name only and ships EMPTY in the
 *   locked default. Playback does NOT start any audio for it:
 *   PR #36 title/intro tracks are drafts Mars has not approved as
 *   final (Title Music v2 pending), so wiring them as the intro
 *   track would mislabel a draft as final. The slot stays GAP
 *   until original final music lands.
 * - Video export (Phase 2, FFmpeg / MediaRecorder) is NOT here.
 */

import {
  createLockedDefaultPreset,
  defaultIntroVideoScene,
  loadIntroVideoPresets,
  totalDuration,
  type IntroVideoPreset,
  type IntroVideoScene,
} from './introVideoCreator';

/** Transition length, seconds, at the start of each scene. */
export const INTRO_PLAYBACK_TRANSITION_SECONDS = 0.5;

/** Active preset: most recently saved user preset, else locked default. */
export function resolveActiveIntroVideoPreset(): {
  preset: IntroVideoPreset;
  source: 'saved' | 'locked-default';
} {
  const presets = loadIntroVideoPresets();
  const user = presets.filter(p => !p.locked);
  if (user.length > 0) {
    return { preset: user[user.length - 1], source: 'saved' };
  }
  return { preset: createLockedDefaultPreset(), source: 'locked-default' };
}

export interface IntroPlaybackPosition {
  sceneIndex: number;
  scene: IntroVideoScene;
  /** Seconds into the current scene. */
  localTime: number;
  /** Seconds into the whole preset. */
  globalTime: number;
  /** 0..1 progress through this scene's incoming transition. */
  transitionProgress: number;
  /** True once globalTime >= total duration. */
  done: boolean;
}

/** Start time (seconds) of scene i within its preset. */
export function sceneStartTime(preset: IntroVideoPreset, index: number): number {
  let t = 0;
  for (let i = 0; i < index && i < preset.scenes.length; i++) {
    t += Math.max(0, preset.scenes[i].duration);
  }
  return t;
}

export function sceneAt(preset: IntroVideoPreset, globalTime: number): IntroPlaybackPosition {
  const total = totalDuration(preset);
  if (preset.scenes.length === 0) {
    // Empty presets fail validation upstream; this guard only keeps
    // the player from crashing if one ever slips through.
    return {
      sceneIndex: 0,
      scene: defaultIntroVideoScene('Empty'),
      localTime: 0,
      globalTime,
      transitionProgress: 1,
      done: true,
    };
  }
  if (globalTime >= total) {
    const last = preset.scenes[preset.scenes.length - 1];
    return {
      sceneIndex: preset.scenes.length - 1,
      scene: last,
      localTime: last.duration,
      globalTime,
      transitionProgress: 1,
      done: true,
    };
  }
  let acc = 0;
  for (let i = 0; i < preset.scenes.length; i++) {
    const scene = preset.scenes[i];
    const dur = Math.max(0, scene.duration);
    if (globalTime < acc + dur || i === preset.scenes.length - 1) {
      const localTime = Math.max(0, globalTime - acc);
      return {
        sceneIndex: i,
        scene,
        localTime,
        globalTime,
        transitionProgress: Math.min(1, localTime / INTRO_PLAYBACK_TRANSITION_SECONDS),
        done: false,
      };
    }
    acc += dur;
  }
  // Unreachable (guarded above), kept for the type checker.
  const last = preset.scenes[preset.scenes.length - 1];
  return {
    sceneIndex: preset.scenes.length - 1,
    scene: last,
    localTime: last.duration,
    globalTime,
    transitionProgress: 1,
    done: true,
  };
}

/** Pixi overlay values for a scene's incoming transition at progress p (0..1). */
export interface TransitionOverlay {
  /** Black/white fade overlay alpha (0 = invisible). */
  fadeAlpha: number;
  /** Fade overlay colour (black or white). */
  fadeColor: number;
  /** Shutter bars coverage (0 = open, 1 = fully closed). */
  shutterCover: number;
  /** Slide-in horizontal offset, fraction of frame width (0 = at rest). */
  slideOffsetX: number;
}

export function transitionOverlay(
  scene: IntroVideoScene,
  progress: number,
): TransitionOverlay {
  const p = Math.min(1, Math.max(0, progress));
  const remaining = 1 - p;
  switch (scene.transition) {
    case 'fade-white':
      return { fadeAlpha: remaining, fadeColor: 0xffffff, shutterCover: 0, slideOffsetX: 0 };
    case 'shutter-wipe':
      return { fadeAlpha: 0, fadeColor: 0x000000, shutterCover: remaining, slideOffsetX: 0 };
    case 'slide':
      return { fadeAlpha: 0, fadeColor: 0x000000, shutterCover: 0, slideOffsetX: remaining };
    case 'fade-black':
    default:
      return { fadeAlpha: remaining, fadeColor: 0x000000, shutterCover: 0, slideOffsetX: 0 };
  }
}

/** Particle glyph + Pixi colour per spec particle id (drawn shapes, not art files). */
export const INTRO_PLAYBACK_PARTICLE_STYLE: Record<
  string,
  { color: number; size: number; fallSpeed: number }
> = {
  fire: { color: 0xf97316, size: 3, fallSpeed: -30 },
  snow: { color: 0xffffff, size: 2, fallSpeed: 26 },
  rain: { color: 0xbfdbfe, size: 2, fallSpeed: 130 },
  leaves: { color: 0x4ade80, size: 3, fallSpeed: 18 },
  embers: { color: 0xfbbf24, size: 2, fallSpeed: -22 },
  smoke: { color: 0x94a3b8, size: 5, fallSpeed: -12 },
};
