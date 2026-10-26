// Start-screen / intro player preference (boot→menu restoration, 2026-10-26).
//
// Mars's locked default: the classic DOM title + the classic 4 intro
// scenes are the DEFAULT boot→menu path. The Pixi players
// (StartScreenPlayer / IntroVideoPlayer) are Menu Creator presets
// ONLY — selectable in CREATE START SCREEN / CREATE INTRO VIDEO,
// never the default. Nothing here changes what a preset contains;
// it only records which renderer the game path uses.
//
// Storage follows the titleRotation.ts pattern: a localStorage key
// with try/catch, so private-mode / unavailable storage falls back
// to the classic default in-session instead of crashing.

export type TitlePlayer = 'classic' | 'pixi';
export type IntroPlayer = 'classic' | 'pixi';

const TITLE_PLAYER_KEY = 'mochiichao_title_player';
const INTRO_PLAYER_KEY = 'mochiichao_intro_player';

export function getTitlePlayer(): TitlePlayer {
  try {
    return localStorage.getItem(TITLE_PLAYER_KEY) === 'pixi' ? 'pixi' : 'classic';
  } catch {
    return 'classic';
  }
}

export function setTitlePlayer(v: TitlePlayer): void {
  try {
    localStorage.setItem(TITLE_PLAYER_KEY, v);
  } catch {
    /* private mode: preference still applies in-session via the caller's state */
  }
}

export function getIntroPlayer(): IntroPlayer {
  try {
    return localStorage.getItem(INTRO_PLAYER_KEY) === 'pixi' ? 'pixi' : 'classic';
  } catch {
    return 'classic';
  }
}

export function setIntroPlayer(v: IntroPlayer): void {
  try {
    localStorage.setItem(INTRO_PLAYER_KEY, v);
  } catch {
    /* private mode: preference still applies in-session via the caller's state */
  }
}
