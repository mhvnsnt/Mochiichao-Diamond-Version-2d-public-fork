/**
 * Mochiichao music — official tracks, wired 2026-10-25.
 *
 * Track map (see docs/title-music-status.md, the authority):
 * - intro: mochiichao-intro-v3.wav — OFFICIAL INTRO, INTRO phase, one-shot.
 * - title: mochiichao-title-v3.wav — OFFICIAL TITLE, TITLE phase, loops.
 * - mainMenu: mochiichao-main-menu-v1.wav — MAIN MENU v1 (DRAFT, wired for
 *   testing), MAIN_MENU / SETTINGS / SAVE_SLOTS phases, loops.
 * - world / battle: NO FILE ON MAIN YET (Wiring Batch 2, 2026-10-26).
 *   public/audio/ holds only boot / intro / title / main-menu files,
 *   so these entries are null-src on purpose and NO filename is
 *   invented here. playMusic() on a null-src entry fades the old
 *   track out and stays silent — the game is silent in world/battle
 *   exactly as today — and the day the Music lane ships a file,
 *   only the TRACKS table below changes; the call sites (App world
 *   entry, WorldEngine screen effect) already play it. Track
 *   production sits behind the music gate, never ordered here.
 *
 * NOT in this module, deliberately: boot and press-start sounds are
 * already wired on main in src/lib/bootAudio.ts (settled roles: BOOT =
 * UI Art Option B, TITLE press = M3 Mochii Chirp, with a StrictMode
 * double-play guard). Duplicating them here would play both sounds
 * twice. This module plays music only.
 *
 * Paths use import.meta.env.BASE_URL (Vite), like bootAudio.ts, so the
 * files resolve whether the build is served from '/' or from a
 * sub-path (GitHub Pages): Vite copies public/audio/* to dist/audio/*.
 *
 * Method (Pokemon title-screen structure, not Pokemon audio):
 * - Title music starts after the title screen loads and loops until a key
 *   is pressed; on press, it fades out over 60 frames (1.0 s, HeartGold
 *   field_bgm fade) and the next screen's music starts. playMusic() does
 *   exactly that: fade the old track out over fadeMs (default 1000 ms),
 *   then start the new track.
 * - Intro music is a one-shot, like FireRed's new-game intro: it plays
 *   once and stops; it does not loop under the intro scenes.
 *
 * Autoplay: browsers block audio until a user gesture. If playMusic() is
 * called before any gesture, the track is stored as pending and retried
 * on the first keydown/mousedown. IntroSequence's advanceIntro() is a
 * gesture, so music starts on the first press at the latest.
 *
 * This module uses plain HTMLAudioElement, no audio library dependency,
 * so it cannot break the build if an audio package is missing. It never
 * touches game state, saves, or rendering — it only plays files.
 */

import { routeMediaElement, resumeAudioGraph } from "./audioRouting";

export type MusicTrack = "intro" | "title" | "mainMenu" | "world" | "battle";

function audioUrl(file: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const withSlash = base.endsWith("/") ? base : `${base}/`;
  return `${withSlash}audio/${file}`;
}

const TRACKS: Record<MusicTrack, { src: string | null; loop: boolean }> = {
  intro: { src: audioUrl("mochiichao-intro-v3.wav"), loop: false },
  title: { src: audioUrl("mochiichao-title-v3.wav"), loop: true },
  mainMenu: { src: audioUrl("mochiichao-main-menu-v1.wav"), loop: true },
  // Null-src until the Music lane ships files (see header). Never
  // invent a filename here; a missing file stays silent, never a 404
  // loop or a guessed track.
  world: { src: null, loop: true },
  battle: { src: null, loop: true },
};

const MUSIC_VOLUME = 0.8;
const FADE_IN_MS = 500;

let musicEl: HTMLAudioElement | null = null;
let currentTrack: MusicTrack | null = null;
let pendingTrack: MusicTrack | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;
let gestureListenerAttached = false;

function stopFadeTimer() {
  if (fadeTimer !== null) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function ensureGestureListener() {
  if (gestureListenerAttached || typeof window === "undefined") return;
  gestureListenerAttached = true;
  const retry = () => {
    // A routed music element in a suspended context stays silent
    // until the context resumes; the gesture that retries a pending
    // track is also the gesture that resumes it.
    resumeAudioGraph();
    if (pendingTrack !== null) {
      const track = pendingTrack;
      pendingTrack = null;
      void playMusic(track);
    }
  };
  window.addEventListener("keydown", retry);
  window.addEventListener("mousedown", retry);
}

/** Fade an element's volume to `to` over `ms`, then call `done`. */
function fadeTo(el: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  stopFadeTimer();
  const from = el.volume;
  const steps = Math.max(1, Math.round(ms / 50));
  let step = 0;
  fadeTimer = setInterval(() => {
    step += 1;
    el.volume = from + (to - from) * (step / steps);
    if (step >= steps) {
      stopFadeTimer();
      el.volume = to;
      if (done) done();
    }
  }, 50);
}

/**
 * Play a music track. Same track already playing = no-op (so re-renders
 * and phase re-entries do not restart the loop). Different track =
 * fade the old one out over fadeMs (default 1000 ms, the Pokemon
 * 60-frame fade), then start the new one with a 500 ms fade-in.
 */
export function playMusic(track: MusicTrack, fadeMs = 1000): void {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  ensureGestureListener();
  if (currentTrack === track && musicEl && !musicEl.paused) return;
  pendingTrack = null;
  const start = () => {
    const def = TRACKS[track];
    if (musicEl) {
      musicEl.pause();
      musicEl.onended = null;
    }
    musicEl = null;
    currentTrack = track;
    // Null-src entry (world / battle until files land): fade-out
    // already happened above; stay silent, never throw, never loop
    // a retry. currentTrack records the intent so currentMusicTrack()
    // still reports where the player is.
    if (def.src === null) return;
    const el = new Audio(def.src);
    // Route through the Web Audio graph so the Settings MONO / STEREO
    // setting actually reaches music. Before this, plain <audio>
    // played straight to the speakers and the setting bypassed music
    // entirely. If routing is unavailable, the element still plays
    // directly — fail soft, same as before.
    routeMediaElement(el);
    el.loop = def.loop;
    el.volume = 0;
    el.preload = "auto";
    if (!def.loop) {
      el.onended = () => {
        if (currentTrack === track) currentTrack = null;
      };
    }
    musicEl = el;
    const p = el.play();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => {
        // Autoplay blocked: retry on the first gesture.
        pendingTrack = track;
        currentTrack = null;
      });
    }
    fadeTo(el, MUSIC_VOLUME, FADE_IN_MS);
  };
  if (musicEl && !musicEl.paused) {
    const old = musicEl;
    fadeTo(old, 0, fadeMs, () => {
      old.pause();
      start();
    });
  } else {
    start();
  }
}

/** Stop all music. fadeMs = 0 stops immediately (unmount / world entry). */
export function stopMusic(fadeMs = 1000): void {
  pendingTrack = null;
  if (!musicEl) {
    currentTrack = null;
    return;
  }
  const el = musicEl;
  if (fadeMs <= 0) {
    stopFadeTimer();
    el.pause();
    el.onended = null;
    currentTrack = null;
    return;
  }
  fadeTo(el, 0, fadeMs, () => {
    el.pause();
    el.onended = null;
    if (musicEl === el) currentTrack = null;
  });
}

/** Which music track, if any, is currently playing. For tests/debugging. */
export function currentMusicTrack(): MusicTrack | null {
  return currentTrack;
}
