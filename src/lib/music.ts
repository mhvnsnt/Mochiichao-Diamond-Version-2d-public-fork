/**
 * Mochiichao music — official tracks, wired 2026-10-25.
 *
 * Track map (see docs/title-music-status.md, the authority):
 * - boot: UI Art Option B "rising arpeggio" — BOOT phase, one-shot.
 * - intro: mochiichao-intro-v3.wav — OFFICIAL INTRO, INTRO phase, one-shot.
 * - title: mochiichao-title-v3.wav — OFFICIAL TITLE, TITLE phase, loops.
 * - mainMenu: mochiichao-main-menu-v1.wav — MAIN MENU v1 (DRAFT, wired for
 *   testing), MAIN_MENU / SETTINGS / SAVE_SLOTS phases, loops.
 * - pressStart: mochiichao-boot-M3-mochii-chirp.wav — TITLE press, one-shot.
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

export type MusicTrack = "intro" | "title" | "mainMenu";
export type SfxTrack = "boot" | "pressStart";

const TRACKS: Record<MusicTrack, { src: string; loop: boolean }> = {
  intro: { src: "/audio/mochiichao-intro-v3.wav", loop: false },
  title: { src: "/audio/mochiichao-title-v3.wav", loop: true },
  mainMenu: { src: "/audio/mochiichao-main-menu-v1.wav", loop: true },
};

const SFX: Record<SfxTrack, string> = {
  boot: "/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav",
  pressStart: "/audio/mochiichao-boot-M3-mochii-chirp.wav",
};

const MUSIC_VOLUME = 0.8;
const SFX_VOLUME = 1.0;
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
    const el = new Audio(def.src);
    el.loop = def.loop;
    el.volume = 0;
    el.preload = "auto";
    if (!def.loop) {
      el.onended = () => {
        if (currentTrack === track) currentTrack = null;
      };
    }
    musicEl = el;
    currentTrack = track;
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

/** Play a one-shot sound effect (boot, press-start). Overlaps music. */
export function playSfx(track: SfxTrack): void {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  const el = new Audio(SFX[track]);
  el.volume = SFX_VOLUME;
  const p = el.play();
  if (p && typeof (p as Promise<void>).catch === "function") {
    (p as Promise<void>).catch(() => {
      // SFX before a gesture is dropped, not retried: a boot/press sound
      // replayed later would be wrong. Music retries; SFX does not.
    });
  }
}

/** Which music track, if any, is currently playing. For tests/debugging. */
export function currentMusicTrack(): MusicTrack | null {
  return currentTrack;
}
