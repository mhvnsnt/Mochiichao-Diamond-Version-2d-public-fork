/**
 * CREATE START SCREEN — preset data model (batch E, spec section 2 only).
 *
 * Source spec: ui-art/intro-video-start-screen-creator-spec.md, section 2.
 * Path: Settings -> Menu Creator -> CREATE START SCREEN.
 * Full dedicated screen, Pokemon layout first, Y2K skin on top, B: BACK,
 * presets only at first, locked default never overwritten.
 *
 * Timeline: same timeline as the Intro Video Creator, but ONE scene —
 * a start screen does not cut between scenes, it holds one scene.
 * `timeline.sceneCount` is therefore fixed at 1; there is no scene
 * list, no add/duplicate/delete/reorder here (that is the Intro
 * Video Creator's screen, a separate batch — not touched here).
 *
 * Locked layout slots (spec-pinned, 1200x1500 canvas, centre coords):
 *   logo       — width 900, centre (600, 450)
 *   subtitle   — width 556, centre (600, 735), font PINNED, never changes
 *   pressAnyKey— y = 927, blink FireRed tempo: 60 frames first, then 30 frames on / 30 frames off
 *   studioLogo — width 556, centre (600, 1222)
 * Moving a slot is the Layout Editor's job and restyling a slot is
 * the UI Creator's job — this creator reuses those existing creators
 * and builds NO second move/restyle system. A preset that disagrees
 * with a locked slot fails validation (see validateStartScreenPreset).
 * The creature slot's preview box below is preview-only: the spec
 * pins no creature centre, so its position here is NOT locked layout
 * and must be set in the Layout Editor before playback claims it.
 *
 * What a preset CHOOSES (the editable content of the slots):
 *   creature   — one name from the title rotation pool (10 names).
 *                Art exists today for Yogiferno only (clean cutout,
 *                PR #33); the other 9 names are GAP labels here —
 *                never fake art, never a stand-in sprite.
 *   background — one of the 8 shipped title biomes, or 'painted',
 *                which is GAP (painted backgrounds are not shipped).
 *   particles  — fire / snow / rain / leaves / embers / smoke / none.
 * Music is NOT a start-screen slot in this batch: the spec's music
 * slot belongs to the intro timeline, and title music composition
 * is GAP — no music field is invented here.
 *
 * NOT in this batch (labelled GAP, later batches, never claimed):
 *   - Blender project export (.blend) / Blender binary (install note only)
 * Phase 2 export is LIVE since Creator Phase 2
 * (src/lib/introVideoExport.ts, MediaRecorder web route, WebM,
 * 6 s hold, silent — a start screen has no music slot).
 * Open-source components: a preset may pick components from
 * src/lib/openSourceAssets.ts (87/87 listing); picks are stored
 * in openSourceComponentIds, shown in the creator preview, and
 * drawn into the exported video where the kind fits (panel as
 * the screen frame, icon as a top-right badge).
 *
 * Format: our own JSON (layout-as-data idea, not Tuxemon code).
 * No Pokemon sprites, dialogue, music, cries, names, or art anywhere
 * in this file — only Mochiichao names and the game's own slot data.
 */

import { TITLE_ROTATION_POOL } from './titleRotation';
import type { TitleBiomeId } from './titleBiomes';
import { PINNED_SUBTITLE_FONT } from './fonts';
import { OPEN_SOURCE_ASSETS } from './openSourceAssets';

export const START_SCREEN_CANVAS_WIDTH = 1200;
export const START_SCREEN_CANVAS_HEIGHT = 1500;

/** Spec-pinned locked slots. These values are the locked default. */
export interface LockedStartScreenLayout {
  logoWidth: 900;
  logoCentreX: 600;
  logoCentreY: 450;
  subtitleWidth: 556;
  subtitleCentreX: 600;
  subtitleCentreY: 735;
  subtitleFontPinned: true;
  pressAnyKeyY: 927;
  pressAnyKeyBlinkFirstFrames: 60;
  pressAnyKeyBlinkOnFrames: 30;
  pressAnyKeyBlinkOffFrames: 30;
  studioLogoWidth: 556;
  studioLogoCentreX: 600;
  studioLogoCentreY: 1222;
}

export const LOCKED_START_SCREEN_LAYOUT: LockedStartScreenLayout = {
  logoWidth: 900,
  logoCentreX: 600,
  logoCentreY: 450,
  subtitleWidth: 556,
  subtitleCentreX: 600,
  subtitleCentreY: 735,
  subtitleFontPinned: true,
  pressAnyKeyY: 927,
  pressAnyKeyBlinkFirstFrames: 60,
  pressAnyKeyBlinkOnFrames: 30,
  pressAnyKeyBlinkOffFrames: 30,
  studioLogoWidth: 556,
  studioLogoCentreX: 600,
  studioLogoCentreY: 1222,
};

/** The pinned subtitle font — imported from fonts.ts, never redefined. */
export const START_SCREEN_SUBTITLE_FONT = PINNED_SUBTITLE_FONT;

export type StartScreenParticle = 'fire' | 'snow' | 'rain' | 'leaves' | 'embers' | 'smoke' | 'none';
export const START_SCREEN_PARTICLES: StartScreenParticle[] = ['fire', 'snow', 'rain', 'leaves', 'embers', 'smoke', 'none'];

export type StartScreenBackground = TitleBiomeId | 'painted';
export const START_SCREEN_BACKGROUNDS: StartScreenBackground[] = [
  'snow', 'grass', 'water', 'sand', 'stone', 'forest', 'rain', 'night', 'painted',
];

/** Rotation-pool names, in pool order. Art availability is separate. */
export const START_SCREEN_CREATURE_POOL: string[] = TITLE_ROTATION_POOL.map(c => c.name);

/**
 * Creature cutouts actually shipped in the repo today.
 * Yogiferno exists (clean cutout, PR #33). Every other pool name
 * is GAP until its side lane ships a clean cutout — the creator
 * shows the GAP label and never substitutes another creature's art.
 */
export const START_SCREEN_CREATURE_ART_AVAILABLE: Record<string, boolean> = {
  Yogiferno: true,
};
export function startScreenCreatureArtAvailable(name: string): boolean {
  return START_SCREEN_CREATURE_ART_AVAILABLE[name] === true;
}
export function startScreenCreatureArtGapNames(): string[] {
  return START_SCREEN_CREATURE_POOL.filter(n => !startScreenCreatureArtAvailable(n));
}

export interface StartScreenPreset {
  format: 'mochiichao-start-screen-preset';
  version: 1;
  name: string;
  savedAt: number;
  /** Single-scene timeline: a start screen holds one scene. */
  timeline: { sceneCount: 1; loop: true };
  /** Locked layout — must equal LOCKED_START_SCREEN_LAYOUT. */
  layout: LockedStartScreenLayout;
  creature: string;
  background: StartScreenBackground;
  particles: StartScreenParticle;
  /**
   * Open-source component ids picked from src/lib/openSourceAssets.ts
   * (87/87 listing). Optional for old presets (treated as []).
   */
  openSourceComponentIds?: string[];
}

export const LOCKED_START_SCREEN_PRESET_NAME = 'Locked Default';
export const LOCKED_START_SCREEN_PRESET: StartScreenPreset = {
  format: 'mochiichao-start-screen-preset',
  version: 1,
  name: LOCKED_START_SCREEN_PRESET_NAME,
  savedAt: 0,
  timeline: { sceneCount: 1, loop: true },
  layout: { ...LOCKED_START_SCREEN_LAYOUT },
  creature: 'Yogiferno',
  background: 'snow',
  particles: 'fire',
  openSourceComponentIds: [],
};

/** Validate a parsed preset. Returns error strings; empty = valid. */
export function validateStartScreenPreset(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== 'object') return ['preset is not an object'];
  const p = value as Partial<StartScreenPreset>;
  if (p.format !== 'mochiichao-start-screen-preset') errors.push('format must be mochiichao-start-screen-preset');
  if (p.version !== 1) errors.push('version must be 1');
  if (!p.name || typeof p.name !== 'string') errors.push('name must be a non-empty string');
  if (p.timeline?.sceneCount !== 1) errors.push('timeline.sceneCount must be 1 (start screen = one scene)');
  if (p.timeline?.loop !== true) errors.push('timeline.loop must be true');
  const layout = p.layout as Partial<LockedStartScreenLayout> | undefined;
  (Object.keys(LOCKED_START_SCREEN_LAYOUT) as (keyof LockedStartScreenLayout)[]).forEach(k => {
    if (layout?.[k] !== LOCKED_START_SCREEN_LAYOUT[k]) {
      errors.push(`locked layout slot ${k} must be ${String(LOCKED_START_SCREEN_LAYOUT[k])} (move it in the Layout Editor, not in a preset)`);
    }
  });
  if (!p.creature || !START_SCREEN_CREATURE_POOL.includes(p.creature)) {
    errors.push(`creature must be one of the rotation pool: ${START_SCREEN_CREATURE_POOL.join(', ')}`);
  }
  if (!p.background || !START_SCREEN_BACKGROUNDS.includes(p.background)) {
    errors.push(`background must be one of: ${START_SCREEN_BACKGROUNDS.join(', ')}`);
  }
  if (!p.particles || !START_SCREEN_PARTICLES.includes(p.particles)) {
    errors.push(`particles must be one of: ${START_SCREEN_PARTICLES.join(', ')}`);
  }
  if (p.openSourceComponentIds !== undefined) {
    if (!Array.isArray(p.openSourceComponentIds)) {
      errors.push('openSourceComponentIds must be an array');
    } else {
      const known = new Set(OPEN_SOURCE_ASSETS.map(a => a.id));
      for (const id of p.openSourceComponentIds) {
        if (!known.has(id)) errors.push(`unknown open-source component '${id}'`);
      }
    }
  }
  return errors;
}

export function startScreenPresetToJson(preset: StartScreenPreset): string {
  return JSON.stringify(preset, null, 2);
}

export function parseStartScreenPreset(json: string): { preset: StartScreenPreset | null; errors: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { preset: null, errors: ['not valid JSON'] };
  }
  const errors = validateStartScreenPreset(parsed);
  if (errors.length > 0) return { preset: null, errors };
  return { preset: parsed as StartScreenPreset, errors: [] };
}

const STORAGE_KEY = 'mochiichao_start_screen_presets';

/**
 * Saved presets. The locked default is always first and is NEVER
 * overwritten: saving under its name is refused, and loading the
 * list always re-inserts a fresh copy of it at the front.
 */
export function loadStartScreenPresets(): StartScreenPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [{ ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } }];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [{ ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } }];
    const valid = parsed.filter(p => validateStartScreenPreset(p).length === 0 && p.name !== LOCKED_START_SCREEN_PRESET_NAME);
    return [{ ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } }, ...valid];
  } catch {
    return [{ ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } }];
  }
}

export function saveStartScreenPresets(presets: StartScreenPreset[]): void {
  try {
    const user = presets.filter(p => p.name !== LOCKED_START_SCREEN_PRESET_NAME);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* private mode: presets still work in-session */
  }
}

/** Save one preset. Returns false (refused) for the locked name. */
export function saveStartScreenPreset(preset: StartScreenPreset): boolean {
  if (preset.name === LOCKED_START_SCREEN_PRESET_NAME) return false;
  if (validateStartScreenPreset(preset).length > 0) return false;
  const list = loadStartScreenPresets();
  const next = list.some(p => p.name === preset.name)
    ? list.map(p => (p.name === preset.name ? preset : p))
    : [...list, preset];
  saveStartScreenPresets(next);
  return true;
}

export function resetToLockedStartScreenPreset(): StartScreenPreset {
  return { ...LOCKED_START_SCREEN_PRESET, layout: { ...LOCKED_START_SCREEN_LAYOUT } };
}
