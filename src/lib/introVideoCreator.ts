/**
 * CREATE INTRO VIDEO — creator data + math (batch D, spec section 1 only).
 *
 * Path: Settings -> Menu Creator -> CREATE INTRO VIDEO. Full dedicated
 * screen (see src/components/game/IntroVideoCreatorScreen.tsx).
 * Pokemon layout first, Y2K skin on top, B: BACK, presets only at
 * first, locked default never overwritten.
 *
 * Pokemon structure translated, never Pokemon code, text, art, music
 * or files copied:
 * - FireRed title/intro: dedicated full screen, scene list, any-key
 *   skips (creator preview uses the same rule), fade transitions.
 * - FireRed AnimTranslateLinearSingleSineWave: sine-wave camera pan
 *   (offset = amplitude * sin(2 * PI * t / period)), same math the
 *   title animation system already uses.
 * - Pokemon font TABLE rows (Small/Normal/Bold/Male/Female/Braille)
 *   are structure only: text fields here pick from FONT_OPTIONS in
 *   src/lib/fonts.ts (open lookalikes / shipped Y2K fonts), never
 *   Pokemon font files. The DIAMOND VERSION subtitle font is PINNED
 *   (PINNED_SUBTITLE_FONT) — no row in this creator changes it.
 *
 * Open source / academic concepts translated, not copied in:
 * - Blender (GPL, desktop, NOT shipped): timeline, keyframe, graph
 *   editor, camera, particle emitter concepts -> this JSON + math.
 *   Blender binary is an install note only (see the screen footer).
 * - PixiJS v8 (MIT, already in the game): layers, sprites, particles,
 *   camera pan/zoom, alpha fades. This batch's preview is DOM/CSS
 *   applying the same math; Pixi playback from a saved preset is a
 *   LATER batch (labelled GAP in the screen), not claimed here.
 * - FFmpeg (LGPL/GPL, desktop, NOT in web build) / MediaRecorder:
 *   Phase 2 video export is LIVE since Creator Phase 2
 *   (src/lib/introVideoExport.ts, MediaRecorder web route, WebM,
 *   silent — the music slot is name-only, so no audio track).
 *   FFmpeg stays an install note only, for WebM->MP4 conversion
 *   or for adding an audio track once original final music exists.
 * - Open-source components: a scene may pick components from
 *   src/lib/openSourceAssets.ts (87/87 listing); picks are stored
 *   in openSourceComponentIds, shown in the creator preview, and
 *   drawn into the exported video where the kind fits (panel
 *   behind the text block, particle/icon as particle sprites).
 * - Keyframe interpolation + easing curves (academic standard):
 *   linear + ease-in-out-cubic, applied per keyframed field.
 *
 * What this batch is NOT (GAP, labelled in the UI, never faked):
 * - Playback of a saved preset as the game's intro (later batch).
 * - Painted backgrounds: the 'painted' background choice is a GAP
 *   label until the Title Backgrounds lane delivers painted art.
 * - Creature cutouts for 9/10 rotation-pool creatures: only
 *   Yogiferno has a clean cutout in the repo
 *   (src/assets/title/yogiferno-walk-cutout.png). The other 9 stay
 *   GAP in the creature picker; no fake art is generated or shown.
 * - Music: the music slot accepts a name only and ships EMPTY (GAP)
 *   until original music lands. No Pokemon music, cries, dialogue,
 *   sprites, logos or names appear in this file or the screen.
 * - CREATE START SCREEN: separate batch, NOT touched here.
 *
 * Preset format is our own JSON (layout-as-data idea, not Tuxemon
 * code): { format: 'mochiichao-intro-video-preset', version: 1,
 * name, createdAt, locked, scenes: [...] }.
 */

import { TITLE_BIOMES, TITLE_BIOME_LIST, type TitleBiomeId } from './titleBiomes';
import { TITLE_ROTATION_POOL } from './titleRotation';
import { FONT_OPTIONS } from './fonts';
import { OPEN_SOURCE_ASSETS } from './openSourceAssets';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** Timeline runs at 60 frames per second (Pokemon title timing). */
export const INTRO_VIDEO_FPS = 60;

/** Particles from the spec, in spec order. */
export type IntroVideoParticle =
  | 'fire' | 'snow' | 'rain' | 'leaves' | 'embers' | 'smoke';

export const INTRO_VIDEO_PARTICLES: { id: IntroVideoParticle; label: string; glyph: string }[] = [
  { id: 'fire', label: 'Fire', glyph: '🔥' },
  { id: 'snow', label: 'Snow', glyph: '❄' },
  { id: 'rain', label: 'Rain', glyph: '🌧' },
  { id: 'leaves', label: 'Leaves', glyph: '🍃' },
  { id: 'embers', label: 'Embers', glyph: '✨' },
  { id: 'smoke', label: 'Smoke', glyph: '💨' },
];

/** Transitions from the spec, in spec order. */
export type IntroVideoTransition =
  | 'fade-black' | 'fade-white' | 'shutter-wipe' | 'slide';

export const INTRO_VIDEO_TRANSITIONS: { id: IntroVideoTransition; label: string }[] = [
  { id: 'fade-black', label: 'Fade to black' },
  { id: 'fade-white', label: 'Fade to white' },
  { id: 'shutter-wipe', label: 'Shutter wipe' },
  { id: 'slide', label: 'Slide' },
];

/** 8 biomes, reused from the title scene (same palette/weather data). */
export const INTRO_VIDEO_BIOMES = TITLE_BIOME_LIST;
export type IntroVideoBackground = TitleBiomeId | 'painted';

/** Rotation pool, reused from the title scene (10 creatures). */
export const INTRO_VIDEO_CREATURES: string[] = TITLE_ROTATION_POOL.map(c => c.name);

/**
 * Clean-cutout status per rotation-pool creature. Yogiferno is the
 * ONLY one with a cutout in the repo (title walk cutout). The other
 * 9 stay GAP until the Title Creatures lane delivers them — the
 * picker shows the GAP label and never fake art.
 */
export const INTRO_VIDEO_CUTOUT_STATUS: Record<string, 'ready' | 'gap'> = {
  Yogiferno: 'ready',
  Mochii: 'gap',
  Razorgater: 'gap',
  Tyrage: 'gap',
  Kittember: 'gap',
  Sproutle: 'gap',
  Dorowani: 'gap',
  Gabu: 'gap',
  Wispkin: 'gap',
  Mythar: 'gap',
};

export const INTRO_VIDEO_CUTOUT_NOTE =
  'Yogiferno cutout: src/assets/title/yogiferno-walk-cutout.png. ' +
  'Other 9/10 rotation-pool cutouts are GAP (Title Creatures lane) — no fake art.';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface IntroVideoCamera {
  /** Horizontal pan, -100..100 (percent of frame width). */
  panX: number;
  /** Vertical pan, -100..100 (percent of frame height). */
  panY: number;
  /** Zoom factor, 0.5..2.0 (1 = no zoom). */
  zoom: number;
  /** Shake strength, 0..20 (0 = steady). */
  shake: number;
}

export interface IntroVideoText {
  logo: string;
  subtitle: string;
  dialogue: string;
  /** Font ids from FONT_OPTIONS. Subtitle font is PINNED — see below. */
  logoFontId: string;
  subtitleFontId: string;
  dialogueFontId: string;
}

/** Keyframe targets, per spec: position / scale / opacity / camera. */
export type IntroVideoKeyframeTarget = 'position' | 'scale' | 'opacity' | 'camera';

export interface IntroVideoKeyframe {
  id: string;
  /** Seconds from the start of its scene. */
  time: number;
  target: IntroVideoKeyframeTarget;
  /** Used by position keyframes (percent of frame). */
  x?: number;
  y?: number;
  /** Used by scale keyframes (factor, 1 = natural). */
  scale?: number;
  /** Used by opacity keyframes (0..1). */
  opacity?: number;
  /** Used by camera keyframes (full camera override at that time). */
  camera?: IntroVideoCamera;
}

export interface IntroVideoScene {
  id: string;
  name: string;
  background: IntroVideoBackground;
  /** Rotation-pool creature names featured in this scene. */
  creatures: string[];
  particle: IntroVideoParticle;
  camera: IntroVideoCamera;
  text: IntroVideoText;
  /** Music slot: a name only, EMPTY = GAP (original music only, none shipped). */
  music: string;
  /** Seconds, must be > 0. */
  duration: number;
  transition: IntroVideoTransition;
  keyframes: IntroVideoKeyframe[];
  /**
   * Open-source component ids picked from src/lib/openSourceAssets.ts
   * (87/87 listing). Optional for old presets (treated as []).
   * Panel assets draw behind the text block in the exported video,
   * particle/icon assets draw as the particle sprites.
   */
  openSourceComponentIds?: string[];
}

export interface IntroVideoPreset {
  format: 'mochiichao-intro-video-preset';
  version: 1;
  name: string;
  createdAt: number;
  /** Locked default is never overwritten (save refuses its name). */
  locked: boolean;
  scenes: IntroVideoScene[];
}

/* ------------------------------------------------------------------ */
/* Factories                                                           */
/* ------------------------------------------------------------------ */

export const LOCKED_INTRO_VIDEO_PRESET_NAME = 'Locked Default';

let introVideoIdCounter = 0;
export function nextIntroVideoId(prefix: string): string {
  introVideoIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${introVideoIdCounter}`;
}

export function defaultIntroVideoCamera(): IntroVideoCamera {
  return { panX: 0, panY: 0, zoom: 1, shake: 0 };
}

export function defaultIntroVideoText(): IntroVideoText {
  return {
    logo: 'MOCHIICHAO',
    subtitle: 'DIAMOND VERSION',
    dialogue: '',
    logoFontId: 'yagiza',
    // PINNED: the DIAMOND VERSION subtitle font never changes, even
    // though the row is shown in the creator for reference.
    subtitleFontId: 'locked-default',
    dialogueFontId: '01-digitall',
  };
}

export function defaultIntroVideoScene(name: string): IntroVideoScene {
  return {
    id: nextIntroVideoId('scene'),
    name,
    background: 'grass',
    creatures: ['Yogiferno'],
    particle: 'leaves',
    camera: defaultIntroVideoCamera(),
    text: defaultIntroVideoText(),
    music: '',
    duration: 6,
    transition: 'fade-black',
    keyframes: [],
    openSourceComponentIds: [],
  };
}

/** The locked default preset. Never overwritten; reset restores this. */
export function createLockedDefaultPreset(): IntroVideoPreset {
  const scene = defaultIntroVideoScene('Opening');
  scene.background = 'grass';
  scene.creatures = ['Yogiferno'];
  scene.particle = 'leaves';
  scene.duration = 6;
  scene.transition = 'fade-black';
  return {
    format: 'mochiichao-intro-video-preset',
    version: 1,
    name: LOCKED_INTRO_VIDEO_PRESET_NAME,
    createdAt: 0,
    locked: true,
    scenes: [scene],
  };
}

/* ------------------------------------------------------------------ */
/* Camera + keyframe math (Pokemon title math, translated)             */
/* ------------------------------------------------------------------ */

/**
 * FireRed sine-wave translation: offset = amplitude * sin(2 * PI * t
 * / period). Used for camera pan drift over a scene.
 */
export function sineOffset(t: number, amplitude: number, period: number): number {
  if (period <= 0) return 0;
  return amplitude * Math.sin((2 * Math.PI * t) / period);
}

/** Standard ease-in-out-cubic for zoom / fade interpolation. */
export function easeInOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** Linear interpolation between two numbers. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

/**
 * Deterministic shake offset (seeded sine hash, so the same time
 * always renders the same shake — no random flicker between frames).
 */
export function shakeOffset(t: number, strength: number, seed: number): number {
  if (strength <= 0) return 0;
  const s = Math.sin(t * 39.7 + seed * 12.9898) * 43758.5453;
  return (s - Math.floor(s) - 0.5) * 2 * strength;
}

export interface ResolvedCamera {
  x: number;
  y: number;
  zoom: number;
  shakeX: number;
  shakeY: number;
}

/**
 * Resolve a scene camera at time t (seconds): base pan + sine drift
 * + latest camera keyframe at or before t (if any) + shake.
 */
export function cameraAt(scene: IntroVideoScene, t: number): ResolvedCamera {
  const cam = { ...scene.camera };
  const camKeys = scene.keyframes
    .filter(k => k.target === 'camera' && k.camera && k.time <= t)
    .sort((a, b) => a.time - b.time);
  const latest = camKeys[camKeys.length - 1];
  if (latest && latest.camera) {
    cam.panX = latest.camera.panX;
    cam.panY = latest.camera.panY;
    cam.zoom = latest.camera.zoom;
    cam.shake = latest.camera.shake;
  }
  const drift = scene.duration > 0 ? sineOffset(t, 4, Math.max(1, scene.duration)) : 0;
  return {
    x: cam.panX + drift,
    y: cam.panY,
    zoom: cam.zoom,
    shakeX: shakeOffset(t, cam.shake, 1),
    shakeY: shakeOffset(t, cam.shake, 7),
  };
}

/**
 * Interpolate a numeric keyframed field (position x/y, scale,
 * opacity) at time t: latest keyframe at or before t wins, blended
 * linearly toward the next keyframe of the same target+field.
 * Returns `fallback` when no keyframe of that kind exists.
 */
export function keyframedValue(
  scene: IntroVideoScene,
  target: IntroVideoKeyframeTarget,
  field: 'x' | 'y' | 'scale' | 'opacity',
  t: number,
  fallback: number,
): number {
  const keys = scene.keyframes
    .filter(k => k.target === target && typeof k[field] === 'number' && k.time <= scene.duration)
    .sort((a, b) => a.time - b.time);
  if (keys.length === 0) return fallback;
  let prev = keys[0];
  for (const k of keys) {
    if (k.time <= t) prev = k;
    else {
      const span = k.time - prev.time;
      if (span <= 0) return prev[field] as number;
      return lerp(prev[field] as number, k[field] as number, (t - prev.time) / span);
    }
  }
  return prev[field] as number;
}

/* ------------------------------------------------------------------ */
/* Timeline helpers                                                    */
/* ------------------------------------------------------------------ */

export function secondsToFrames(seconds: number): number {
  return Math.round(seconds * INTRO_VIDEO_FPS);
}

export function framesToSeconds(frames: number): number {
  return frames / INTRO_VIDEO_FPS;
}

export function totalDuration(preset: IntroVideoPreset): number {
  return preset.scenes.reduce((sum, s) => sum + Math.max(0, s.duration), 0);
}

/** CSS colour for a biome id (used by the DOM preview). */
export function biomeCss(biome: IntroVideoBackground): { sky: string; ground: string } {
  if (biome === 'painted') return { sky: '#1e293b', ground: '#334155' };
  const b = TITLE_BIOMES[biome];
  const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
  return { sky: hex(b.sky), ground: hex(b.ground) };
}

/* ------------------------------------------------------------------ */
/* Validation + JSON (our own format)                                  */
/* ------------------------------------------------------------------ */

export function validateIntroVideoPreset(preset: unknown): string[] {
  const errors: string[] = [];
  if (!preset || typeof preset !== 'object') return ['Preset is not an object.'];
  const p = preset as Partial<IntroVideoPreset>;
  if (p.format !== 'mochiichao-intro-video-preset') errors.push('format must be mochiichao-intro-video-preset.');
  if (p.version !== 1) errors.push('version must be 1.');
  if (!p.name || typeof p.name !== 'string') errors.push('name is required.');
  if (!Array.isArray(p.scenes) || p.scenes.length === 0) {
    errors.push('At least one scene is required.');
    return errors;
  }
  const biomeIds = new Set<string>([...Object.keys(TITLE_BIOMES), 'painted']);
  const particleIds = new Set(INTRO_VIDEO_PARTICLES.map(x => x.id));
  const transitionIds = new Set(INTRO_VIDEO_TRANSITIONS.map(x => x.id));
  const fontIds = new Set(FONT_OPTIONS.map(f => f.id));
  p.scenes.forEach((s, i) => {
    const label = `Scene ${i + 1} (${s.name || 'unnamed'})`;
    if (!biomeIds.has(s.background)) errors.push(`${label}: unknown background '${s.background}'.`);
    if (typeof s.duration !== 'number' || !(s.duration > 0)) errors.push(`${label}: duration must be > 0.`);
    if (!particleIds.has(s.particle)) errors.push(`${label}: unknown particle '${s.particle}'.`);
    if (!transitionIds.has(s.transition)) errors.push(`${label}: unknown transition '${s.transition}'.`);
    for (const c of s.creatures || []) {
      if (!INTRO_VIDEO_CREATURES.includes(c)) errors.push(`${label}: unknown creature '${c}'.`);
    }
    if (s.text) {
      for (const fid of [s.text.logoFontId, s.text.subtitleFontId, s.text.dialogueFontId]) {
        if (fid && !fontIds.has(fid)) errors.push(`${label}: unknown font '${fid}'.`);
      }
    }
    for (const k of s.keyframes || []) {
      if (typeof k.time !== 'number' || k.time < 0 || k.time > s.duration) {
        errors.push(`${label}: keyframe '${k.id}' time out of scene range.`);
      }
    }
    if (s.openSourceComponentIds !== undefined) {
      if (!Array.isArray(s.openSourceComponentIds)) {
        errors.push(`${label}: openSourceComponentIds must be an array.`);
      } else {
        const known = new Set(OPEN_SOURCE_ASSETS.map(a => a.id));
        for (const id of s.openSourceComponentIds) {
          if (!known.has(id)) errors.push(`${label}: unknown open-source component '${id}'.`);
        }
      }
    }
  });
  return errors;
}

export function presetToJson(preset: IntroVideoPreset): string {
  return JSON.stringify(preset, null, 2);
}

/** Parse + validate exported JSON. Returns { preset } or { errors }. */
export function parseIntroVideoPresetJson(json: string): { preset?: IntroVideoPreset; errors: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { errors: ['Not valid JSON.'] };
  }
  const errors = validateIntroVideoPreset(parsed);
  if (errors.length > 0) return { errors };
  return { preset: parsed as IntroVideoPreset, errors: [] };
}

/* ------------------------------------------------------------------ */
/* Preset storage (localStorage, separate from Menu Creator presets)   */
/* ------------------------------------------------------------------ */

export const INTRO_VIDEO_PRESETS_KEY = 'mochiichao_intro_video_presets';

export function loadIntroVideoPresets(): IntroVideoPreset[] {
  const locked = createLockedDefaultPreset();
  try {
    const raw = localStorage.getItem(INTRO_VIDEO_PRESETS_KEY);
    if (!raw) return [locked];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [locked];
    const valid = parsed.filter(
      (p): p is IntroVideoPreset =>
        validateIntroVideoPreset(p).length === 0 && p.name !== LOCKED_INTRO_VIDEO_PRESET_NAME,
    );
    return [locked, ...valid];
  } catch {
    return [locked];
  }
}

/**
 * Save a user preset. The locked default is NEVER overwritten: saving
 * under its name is refused (returns false). Returns true on save.
 */
export function saveIntroVideoPreset(preset: IntroVideoPreset): boolean {
  if (preset.name === LOCKED_INTRO_VIDEO_PRESET_NAME) return false;
  const existing = loadIntroVideoPresets().filter(p => !p.locked);
  const next = [...existing.filter(p => p.name !== preset.name), { ...preset, locked: false }];
  try {
    localStorage.setItem(INTRO_VIDEO_PRESETS_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}
