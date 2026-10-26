/**
 * Start-screen playback resolution — saved preset -> TITLE phase.
 *
 * Batch: playback of a saved Start Screen preset in Pixi (spec
 * section 2, after creator batch E / PR #44). This module is the
 * resolution logic only; src/components/game/StartScreenPlayer.tsx
 * does the Pixi rendering. It does NOT touch IntroSequence audio,
 * SettingsScreen rows, or the locked v32 main-menu layout.
 *
 * Resolution rules (task-settled, not invented here):
 *   - The most recently saved user preset plays. "Most recent" is
 *     the user preset with the largest savedAt; ties fall to the
 *     last one in stored order. The locked default is NEVER a
 *     "saved" preset and is never overwritten.
 *   - The locked default plays when no saved user preset exists.
 *   - Per-field fallback: any missing/invalid preset field falls
 *     back to the locked default's value for THAT field only —
 *     the rest of the preset still plays. Never crash, never blank.
 *   - Layout is always the locked layout: a stored layout that
 *     disagrees with LOCKED_START_SCREEN_LAYOUT is discarded in
 *     full (move = Layout Editor, restyle = UI Creator — the PR #44
 *     preset schema carries no layout-editor offsets or UI-creator
 *     restyle fields, and none are invented here).
 *
 * Show-first compliance (Mars, 2026-10-25 ~20:40 CDT, standing):
 *   - Creatures: only Yogiferno has shipped art that this player
 *     may draw (PR #33 v1 clean cutout, via the availability flag
 *     in startScreenPreset.ts). The other 9 pool names render a
 *     labelled GAP box in the player — no fake art, no invented
 *     creature art, and the 9 cutout PNGs that landed on main from
 *     a parallel lane are NOT referenced here until Mars has seen
 *     the actual images.
 *   - Painted backgrounds: the 8 painted title-bg-*-v2.png files
 *     on main are NOT drawn by this player until Mars has seen
 *     the actual PNGs. A 'painted' preset choice renders a labelled
 *     slate fallback + GAP label, never a fake painting.
 *   - Audio: this batch wires NO audio. The start-screen MUSIC
 *     slot is name only and empty (GAP), like PR #63 did for music.
 *     The settled BOOT Option B / PRESS-START M3 roles are already
 *     wired on main (PR #71, bootAudio.ts via advanceIntro) —
 *     no second audio path is created here, and that audio code
 *     (and advanceIntro) is not edited.
 *   - Fonts: the DIAMOND VERSION subtitle font stays PINNED
 *     (PINNED_SUBTITLE_FONT, never redefined or restyled here).
 *     Behance Kilo/Roadam files and the custom logo font are NOT
 *     shipped or referenced.
 *
 * No Pokemon sprites, dialogue, music, or cries — structure
 * translated only, Mochiichao wording/art only.
 */

import {
  LOCKED_START_SCREEN_LAYOUT,
  LOCKED_START_SCREEN_PRESET,
  LOCKED_START_SCREEN_PRESET_NAME,
  START_SCREEN_BACKGROUNDS,
  START_SCREEN_CREATURE_POOL,
  START_SCREEN_PARTICLES,
  loadStartScreenPresets,
  startScreenCreatureArtAvailable,
  type StartScreenBackground,
  type StartScreenParticle,
  type StartScreenPreset,
} from './startScreenPreset';

/** Audio slot for the start screen: name only, empty. GAP, not wired. */
export const START_SCREEN_AUDIO_SLOT = {
  name: 'Start screen music',
  status: 'GAP' as const,
};

export interface ResolvedStartScreenPlayback {
  /** Effective preset after per-field fallback (layout always locked). */
  preset: StartScreenPreset;
  /** 'saved' = a user preset played; 'locked-default' = no saved preset. */
  source: 'saved' | 'locked-default';
  /** Display name of the source preset. */
  sourceName: string;
  /** Fields that fell back to the locked default (empty when clean). */
  fellBackFields: string[];
  /** True only for Yogiferno today (PR #33 v1 cutout, via flag). */
  creatureArtAvailable: boolean;
  /** True when the preset chose 'painted' (slate fallback + GAP label). */
  paintedBackgroundGap: boolean;
  /** Audio slot: name only, empty — GAP, never a wired track. */
  audio: typeof START_SCREEN_AUDIO_SLOT;
}

function lockedCopy(): StartScreenPreset {
  return { ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } };
}

/**
 * Resolve which preset the TITLE phase plays. Never throws: any
 * storage/parse failure resolves to the locked default.
 */
export function resolveStartScreenPlayback(): ResolvedStartScreenPlayback {
  let userPresets: StartScreenPreset[] = [];
  try {
    userPresets = loadStartScreenPresets().filter(
      (p) => p.name !== LOCKED_START_SCREEN_PRESET_NAME,
    );
  } catch {
    userPresets = [];
  }

  if (userPresets.length === 0) {
    const preset = lockedCopy();
    return {
      preset,
      source: 'locked-default',
      sourceName: LOCKED_START_SCREEN_PRESET_NAME,
      fellBackFields: [],
      creatureArtAvailable: startScreenCreatureArtAvailable(preset.creature),
      paintedBackgroundGap: preset.background === 'painted',
      audio: START_SCREEN_AUDIO_SLOT,
    };
  }

  // Most recently saved: largest savedAt; ties fall to stored order.
  let picked = userPresets[0];
  for (const p of userPresets) {
    if ((p.savedAt ?? 0) >= (picked.savedAt ?? 0)) picked = p;
  }

  const fellBackFields: string[] = [];
  const creature: string = START_SCREEN_CREATURE_POOL.includes(picked.creature)
    ? picked.creature
    : (fellBackFields.push('creature'), LOCKED_START_SCREEN_PRESET.creature);
  const background: StartScreenBackground = START_SCREEN_BACKGROUNDS.includes(picked.background)
    ? picked.background
    : (fellBackFields.push('background'), LOCKED_START_SCREEN_PRESET.background);
  const particles: StartScreenParticle = START_SCREEN_PARTICLES.includes(picked.particles)
    ? picked.particles
    : (fellBackFields.push('particles'), LOCKED_START_SCREEN_PRESET.particles);

  const preset: StartScreenPreset = {
    ...picked,
    layout: { ...LOCKED_START_SCREEN_LAYOUT },
    creature,
    background,
    particles,
  };

  return {
    preset,
    source: 'saved',
    sourceName: picked.name,
    fellBackFields,
    creatureArtAvailable: startScreenCreatureArtAvailable(creature),
    paintedBackgroundGap: background === 'painted',
    audio: START_SCREEN_AUDIO_SLOT,
  };
}
