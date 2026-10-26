// Day/night + season variants for the tileset renderer.
//
// Honesty notes (read before wiring gameplay to this):
// 1. FireRed / Emerald have NO time-of-day lighting. FireRed has no
//    real-time clock lighting at all; Emerald has time-based events
//    but no day/night tint. So no FireRed/Emerald tint table exists
//    to copy — the tables below come from the HeartGold/Crystal
//    STRUCTURE (an hour table + a tint per bucket), with Mochiichao
//    presentation tints, not decomp values.
// 2. TWO hour tables already exist in this project and DISAGREE:
//    - main WorldConstants.getDayPhase: dawn 6-10, day 10-18,
//      dusk 18-21, night 21-6 (4 buckets).
//    - open main fieldWeather.ts (PR #64, merged) fieldWeather TIME_OF_DAY_BY_HOUR (HeartGold
//      gf_rtc hour table verbatim): late 0-3, morn 4-9, day 10-16,
//      eve 17-19, nite 20-23 (5 buckets).
//    This module does NOT pick a winner for gameplay: it exposes
//    both, plus the mapping between them, and the renderer accepts
//    either bucket set. Unifying them is an owed decision for the
//    coordinator / Mars, not something this PR silently decides.
// 3. Fades are 1-2 seconds (60-120 frames at 60 fps). main fieldWeather.ts's
//    weather fade frames are source values (e.g. sunny 160 frames =
//    2.67 s); the presentation layer clamps crossfades to 120 frames
//    and says so, rather than pretending the source value changed.
import type { Season, TimeOfDay } from './types';

/** HeartGold hour table (main fieldWeather.ts (PR #64, merged)), as 24 hour -> bucket. */
export const HG_HOUR_TABLE = [
  'late', 'late', 'late', 'late', // 0-3
  'morn', 'morn', 'morn', 'morn', 'morn', 'morn', // 4-9
  'day', 'day', 'day', 'day', 'day', 'day', 'day', // 10-16
  'eve', 'eve', 'eve', // 17-19
  'nite', 'nite', 'nite', 'nite', // 20-23
] as const;
export type HgBucket = (typeof HG_HOUR_TABLE)[number];

export function hgBucketForHour(hour: number): HgBucket {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  return HG_HOUR_TABLE[h];
}

/** HeartGold bucket -> the game's 4-phase day/night used by
 *  WorldConstants on main. */
export const HG_TO_GAME_PHASE: Record<HgBucket, TimeOfDay> = {
  late: 'night',
  morn: 'dawn',
  day: 'day',
  eve: 'dusk',
  nite: 'night',
};

/** Main's WorldConstants.getDayPhase, reproduced as data so the
 *  renderer can use it without importing the whole world module. */
export function gamePhaseForHour(hour: number): TimeOfDay {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  if (h >= 6 && h < 10) return 'dawn';
  if (h >= 10 && h < 18) return 'day';
  if (h >= 18 && h < 21) return 'dusk';
  return 'night';
}

/**
 * Tint per phase. These are Mochiichao presentation choices, matching
 * main fieldWeather.ts's DAY_NIGHT_TINTS shape (morn/eve/nite/late) mapped onto the
 * game's 4 phases, and consistent with the existing PixiWorldCanvas
 * DAY_TINT direction (dawn warm, dusk orange, night blue-dark).
 * NOTE: PixiWorldCanvas on main uses night alpha 0.38 while
 * WorldConstants DAY_TINT uses 0.55 — that pre-existing divergence
 * is owed unification, not fixed by this file. This table uses the
 * main fieldWeather.ts (PR #64, merged) values (nite 0.28) as the tileset renderer's default and
 * says so; callers may override via applyTimeTint's tint param.
 */
export const PHASE_TINTS: Record<TimeOfDay, { hex: number; alpha: number }> = {
  dawn: { hex: 0xffd9a0, alpha: 0.08 },
  day: { hex: 0xffffff, alpha: 0 },
  dusk: { hex: 0xff9a5c, alpha: 0.16 },
  night: { hex: 0x1e3a8a, alpha: 0.28 },
};

/** Season tint multipliers applied on top of the phase tint
 *  (palette via tint, not per-season paintings). */
export const SEASON_TINTS: Record<Season, { hex: number; alpha: number }> = {
  spring: { hex: 0xffffff, alpha: 0 },
  summer: { hex: 0xfff2cc, alpha: 0.06 },
  autumn: { hex: 0xffb347, alpha: 0.1 },
  winter: { hex: 0xcfe8ff, alpha: 0.12 },
};

/** Fade duration in frames, clamped to the 1-2 s presentation rule. */
export const FADE_FRAMES_MIN = 60;
export const FADE_FRAMES_MAX = 120;
export function clampFadeFrames(frames: number): number {
  return Math.max(FADE_FRAMES_MIN, Math.min(FADE_FRAMES_MAX, Math.round(frames)));
}

/** Linear tint lerp for a smooth 1-2 s fade. Returns t in [0,1]. */
export function fadeProgress(elapsedFrames: number, totalFrames: number): number {
  const total = clampFadeFrames(totalFrames);
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, elapsedFrames / total));
}
