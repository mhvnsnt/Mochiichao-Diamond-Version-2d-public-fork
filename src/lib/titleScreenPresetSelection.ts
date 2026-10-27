// Title-screen preset SELECTION (player choice, UI Art lane, 2026-10-26).
//
// This is the wiring step on top of PR #157's definitions-only
// registry (src/lib/titleScreenPresets.ts). It records which of the
// 10 presets the player picked, nothing more:
//
// - null = no choice made = the locked default title + v32 main
//   menu, exactly as today. Nothing here writes over the default,
//   renames it, or changes what it renders: IntroSequence's TITLE
//   phase checks this first and only takes the preset branch when
//   this returns a preset.
// - a preset id = that preset's scene replaces the TITLE phase only
//   (background + creature + particles + press prompt, per the
//   seam doc). Press-start behaviour is unchanged: any key/click
//   plays the M3 chirp, white-fades 350ms, then MAIN_MENU — the
//   existing IntroSequence advance path, not a new one.
//
// Storage follows the titlePlayerPreference.ts pattern: a
// localStorage key with try/catch, so private-mode / unavailable
// storage falls back to the locked default instead of crashing.
// The key is PLAYER-scoped (mochiichao_player_title_screen_preset):
// it is not the creator preset storage from PR #155 / gameSettings,
// and it never collides with it — the creator system stores preset
// definitions, this stores one player's picked id.
//
// Unknown / stale ids (a preset removed later, a hand-edited value)
// read back as null: the game shows the locked default, never a
// broken scene. Clearing (null) is how the player returns to the
// locked default, and RESET TO LOCKED DEFAULT in Settings does
// the same — a reset restores the locked default title.

import {
  TITLE_SCREEN_PRESETS,
  TITLE_SCREEN_PRESET_IDS,
  getTitleScreenPreset,
  resolveTitleScreenPreset,
  type ResolvedTitleScreenPreset,
  type TitleScreenPreset,
} from './titleScreenPresets';

const PLAYER_TITLE_SCREEN_PRESET_KEY = 'mochiichao_player_title_screen_preset';

/** The cycle order the Settings TITLE SCREEN row offers: locked default first, then the 10 presets. */
export const TITLE_SCREEN_PRESET_CYCLE: (string | null)[] = [null, ...TITLE_SCREEN_PRESET_IDS];

/** Raw stored id, or null when nothing (or nothing valid) is stored. */
export function getSelectedTitleScreenPresetId(): string | null {
  try {
    const stored = localStorage.getItem(PLAYER_TITLE_SCREEN_PRESET_KEY);
    if (stored === null || stored === '') return null;
    return TITLE_SCREEN_PRESET_IDS.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** The selected preset definition, or null for the locked default. */
export function getSelectedTitleScreenPreset(): TitleScreenPreset | null {
  const id = getSelectedTitleScreenPresetId();
  return id === null ? null : getTitleScreenPreset(id);
}

/** The selected preset, fully resolved (background / weather / effect / figure), or null for the locked default. */
export function getSelectedResolvedTitleScreenPreset(): ResolvedTitleScreenPreset | null {
  const preset = getSelectedTitleScreenPreset();
  return preset === null ? null : resolveTitleScreenPreset(preset);
}

/** Store a player choice. null clears back to the locked default. Unknown ids are ignored, never stored. */
export function setSelectedTitleScreenPresetId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(PLAYER_TITLE_SCREEN_PRESET_KEY);
    else if (TITLE_SCREEN_PRESET_IDS.includes(id)) localStorage.setItem(PLAYER_TITLE_SCREEN_PRESET_KEY, id);
  } catch {
    /* private mode: the caller's in-memory state still shows the pick this session */
  }
}

/** Row value label for the Settings TITLE SCREEN row. */
export function titleScreenPresetSelectionLabel(id: string | null): string {
  if (id === null) return 'Locked Default';
  const preset = getTitleScreenPreset(id);
  return preset === null ? 'Locked Default' : preset.label;
}

/** All 10 preset definitions, for pickers that list them (Settings preview uses the selected one only). */
export const TITLE_SCREEN_PRESET_OPTIONS: TitleScreenPreset[] = TITLE_SCREEN_PRESETS;
