// Field + weather systems — generic terrain / weather only.
// Translated from the actual decomp files in this repo's submodules
// (read while building, not copied as code, art, or audio):
//   Black 2  src/ov036/weather.c + weather_task.c (2 tasks, 2 layers,
//              15-entry weather table, sequential vs crossfade)
//   Black 2  src/ov075/weather_particles.c (flake / blizzard /
//              flutter / speck particle moves + sway/scroll tables)
//   Black 2  src/ov076/weather_rain.c (rain / thunderstorm / gusty)
//   Black 2  src/ov077/weather_sandstorm.c (sand grains, 320-frame
//              wind cycle, scrolling background layer)
//   Black 2  src/ov074/weather_sunny.c (no particles: fog/light only)
//   Black 2  src/ov078/weather_tint.c (tint-only weathers)
//   FireRed  include/constants/field_effects.h + src/data/
//              field_effects/field_effect_objects.h (generic field
//              effect objects + their frame timings, below)
//   HeartGold src/gf_rtc.c + include/gf_rtc.h (real-time clock
//              day/night hour table) and src/field_system_rtc_
//              weather.c (date-gated special weather list)
// PixiJS terms: this module is renderer-free on purpose. It holds
// the data, the state machine, and pure per-frame step functions
// that a Pixi layer (TitleScene, PixiWorldCanvas) can call with
// its own Graphics objects — 60 fps frames are the original unit
// (DS/GBA frame = 1/60 s), so every duration below is in frames.
// NO creature art, NO creature/battle sprites, NO dialogue, NO
// music, NO cries, NO texture files are shipped here. Shadows are
// a separate engine layer (see SHADOW_SIZES), never baked into
// character art. Sound IDs from the sources are NOT shipped: the
// `sound` fields below are labelled GAP — a Mochiichao sound must
// be picked before any audio is wired to a weather.
// Weather IDs keep the Black 2 table order (0-14) so a map header
// weather value maps 1:1; names are generic descriptions, not
// source weather/move names.

export type WeatherId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface WeatherEntry {
  id: WeatherId;
  key: string;
  /** Black 2 overlay group that carried this weather (74-78). */
  overlayGroup: 74 | 75 | 76 | 77 | 78;
  hasParticles: boolean;
  /** Background layers used (0, 1, or 2 billboard layers). */
  bgLayers: number;
  /** Fog level passed to InitFog in the source (8/9/4/0 for tint). */
  fogLevel: number;
  /** RGB555 start colour (0x7fdf = pale, 0x7fff = white, 0x7f5f/0x7f5e/0x7b18 = tinted). */
  fogStartRgb555: number;
  /** Fog target colour after fade-in, where the source sets one. */
  fogTargetRgb555: number | null;
  fadeInFrames: number;
  fadeOutFrames: number;
  /** Prewarm (no-fade start) particle batch: [count, ...raw args]. */
  prewarm: [number, number, number] | null;
  /** Raw SetupSpawner tuple from the fade-in Init, in source order.
   *  The spawner engine's argument order is not re-documented here;
   *  the tuple is preserved verbatim so a future spawner port can
   *  use it without re-reading the C file. */
  spawnerFadeIn: number[] | null;
  spawnerNoFade: number[] | null;
}

/** RGB555 (5 bits per channel, as stored in the DS sources) -> 0xRRGGBB. */
export function rgb555ToHex(rgb555: number): number {
  const r = (rgb555 >> 10) & 0x1f;
  const g = (rgb555 >> 5) & 0x1f;
  const b = rgb555 & 0x1f;
  const expand = (v: number) => (v << 3) | (v >> 2);
  return (expand(r) << 16) | (expand(g) << 8) | expand(b);
}

// WEATHER_OVERLAYS[15] — Black 2 src/ov036/weather.c, in table order.
export const WEATHER_TABLE: WeatherEntry[] = [
  { id: 0,  key: 'sunny',       overlayGroup: 74, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fff, fogTargetRgb555: null,   fadeInFrames: 160, fadeOutFrames: 80,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
  { id: 1,  key: 'snowFlakes',  overlayGroup: 75, hasParticles: true,  bgLayers: 0, fogLevel: 8, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5f, fadeInFrames: 90,  fadeOutFrames: 90,  prewarm: [20, 1, 18],  spawnerFadeIn: [1, 18, 1, 16, -3, 1, 0], spawnerNoFade: [1, 16, 1, 16, -3, 1, 0] },
  { id: 2,  key: 'rain',        overlayGroup: 76, hasParticles: true,  bgLayers: 0, fogLevel: 8, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5f, fadeInFrames: 90,  fadeOutFrames: 50,  prewarm: [20, 10, 1], spawnerFadeIn: [1, 8, 2, 0, -4, 2, 1], spawnerNoFade: [2, 0, 2, 0, -4, 2, 1] },
  { id: 3,  key: 'sandstorm',   overlayGroup: 77, hasParticles: true,  bgLayers: 1, fogLevel: 8, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5e, fadeInFrames: 90,  fadeOutFrames: 90,  prewarm: [24, 2, 2],  spawnerFadeIn: [1, 15, 1, 2, -2, 4, 1], spawnerNoFade: [1, 2, 1, 2, -2, 4, 1] },
  { id: 4,  key: 'blizzard',    overlayGroup: 75, hasParticles: true,  bgLayers: 1, fogLevel: 4, fogStartRgb555: 0x7fff, fogTargetRgb555: 0x7b18, fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: [20, 2, 2],  spawnerFadeIn: [1, 6, 1, 2, -2, 2, 1], spawnerNoFade: [1, 2, 1, 2, -2, 2, 1] },
  { id: 5,  key: 'flutter',     overlayGroup: 75, hasParticles: true,  bgLayers: 0, fogLevel: 9, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f80, fadeInFrames: 60,  fadeOutFrames: 60,  prewarm: [20, 10, 1], spawnerFadeIn: [0, 8, 1, 1, -4, 2, 1], spawnerNoFade: [1, 1, 1, 1, -4, 2, 1] },
  { id: 6,  key: 'thunderstorm',overlayGroup: 76, hasParticles: true,  bgLayers: 0, fogLevel: 9, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5f, fadeInFrames: 90,  fadeOutFrames: 50,  prewarm: null,        spawnerFadeIn: [1, 15, 2, 0, -3, 1, 1], spawnerNoFade: [2, 0, 2, 0, -3, 1, 1] },
  { id: 7,  key: 'gustyRain',   overlayGroup: 76, hasParticles: true,  bgLayers: 0, fogLevel: 9, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5f, fadeInFrames: 90,  fadeOutFrames: 50,  prewarm: null,        spawnerFadeIn: [1, 4, 1, 1, -4, 1, 1], spawnerNoFade: [1, 1, 1, 1, -4, 1, 1] },
  { id: 8,  key: 'specks',      overlayGroup: 75, hasParticles: true,  bgLayers: 0, fogLevel: 8, fogStartRgb555: 0x7fff, fogTargetRgb555: 0x7f57, fadeInFrames: 90,  fadeOutFrames: 120, prewarm: [20, 10, 1], spawnerFadeIn: [2, 16, 20, 2, -2, 4, 2], spawnerNoFade: [20, 2, 20, 2, -2, 4, 2] },
  { id: 9,  key: 'tintFixed',   overlayGroup: 78, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fdf, fogTargetRgb555: null,   fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
  { id: 10, key: 'tintA',       overlayGroup: 78, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fdf, fogTargetRgb555: null,   fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
  { id: 11, key: 'tintB',       overlayGroup: 78, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fdf, fogTargetRgb555: null,   fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
  { id: 12, key: 'sandstorm2',  overlayGroup: 77, hasParticles: true,  bgLayers: 1, fogLevel: 8, fogStartRgb555: 0x7fdf, fogTargetRgb555: 0x7f5e, fadeInFrames: 90,  fadeOutFrames: 90,  prewarm: [24, 2, 2],  spawnerFadeIn: [1, 15, 1, 2, -2, 4, 1], spawnerNoFade: [1, 2, 1, 2, -2, 4, 1] },
  { id: 13, key: 'tintC',       overlayGroup: 78, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fdf, fogTargetRgb555: null,   fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
  { id: 14, key: 'tintD',       overlayGroup: 78, hasParticles: false, bgLayers: 0, fogLevel: 0, fogStartRgb555: 0x7fdf, fogTargetRgb555: null,   fadeInFrames: 90,  fadeOutFrames: 60,  prewarm: null,        spawnerFadeIn: null, spawnerNoFade: null },
];

export function weatherById(id: number): WeatherEntry | undefined {
  return WEATHER_TABLE.find((w) => w.id === id);
}

// ---------------------------------------------------------------------------
// Transition state machine — Black 2 src/ov036/weather.c, verbatim logic.
// Two tasks, one state (0 idle, 1 start, 2 wait, 3 load, 4 start-new
// for sequential; 0/1/2 for crossfade). A change requested while a
// transition is running is queued in `pending` and starts when the
// machine returns to state 0. Requesting the current weather (except
// id 0) is a no-op. Crossfade is used ONLY between the particle
// flake family (ids 1, 4, 5, any pair of them); every other pair is
// sequential. In the original, "old task finished" is
// WeatherTask_GetPhase() == FALSE; here the caller reports it with
// markOldDone(), because this module owns no task scheduler.
// ---------------------------------------------------------------------------

export type WeatherTransition = 'sequential' | 'crossfade';

export function transitionMode(current: number, next: number): WeatherTransition {
  const flakeFamily = [1, 4, 5];
  if (flakeFamily.includes(current) && flakeFamily.includes(next) && current !== next) return 'crossfade';
  return 'sequential';
}

export class FieldWeatherSystem {
  current: WeatherId = 0;
  next: WeatherId | null = null;
  pending: WeatherId | null = null;
  state = 0;
  transition: WeatherTransition = 'sequential';
  fadeIn = true;
  /** True once the outgoing task has finished (caller-reported). */
  oldDone = false;

  setInitial(id: WeatherId): void {
    // SetWeatherInit: force-end both tasks, load overlay, start task 0
    // at once (mode 1). Re-setting the current weather is a no-op
    // unless it is id 0.
    if (id === this.current && id !== 0) return;
    this.current = id;
    this.next = null;
    this.pending = null;
    this.state = 0;
    this.fadeIn = true;
    this.oldDone = false;
  }

  requestChange(id: WeatherId): boolean {
    return this.startTransition(id, true);
  }

  requestChangeNoFade(id: WeatherId): boolean {
    // FieldWeather_RequestChangeNoFade: same transition, fadeIn FALSE.
    const started = this.startTransition(id, false);
    if (started) this.fadeIn = false;
    return started;
  }

  private startTransition(id: WeatherId, fadeIn: boolean): boolean {
    if (this.state !== 0) { this.pending = id; return false; }
    if (this.current === id && id !== 0) return false;
    this.next = id;
    this.fadeIn = fadeIn;
    this.transition = transitionMode(this.current, id);
    this.state = 1;
    this.oldDone = false;
    return true;
  }

  markOldDone(): void { this.oldDone = true; }

  /** Advance one machine step. Returns the action the caller must
   *  perform this step, or 'wait' / 'idle'. Sequential: end-old (1)
   *  -> wait (2) -> load-overlay (3) -> start-new (4) -> idle (0).
   *  Crossfade: start-new + end-old (1) -> wait (2) -> swap (0). */
  update(): 'idle' | 'wait' | 'endOld' | 'loadOverlay' | 'startNew' | 'startNewAndEndOld' | 'swapTasks' {
    if (this.state === 0) {
      if (this.pending !== null) {
        const p = this.pending;
        this.pending = null;
        this.startTransition(p, true);
        return this.update();
      }
      return 'idle';
    }
    if (this.transition === 'sequential') {
      if (this.state === 1) { this.state = 2; return 'endOld'; }
      if (this.state === 2) {
        if (!this.oldDone) return 'wait';
        this.state = 3; return 'loadOverlay';
      }
      if (this.state === 3) { this.state = 4; return 'startNew'; }
      // state 4: start task 0 with the next weather, become current.
      this.current = this.next as WeatherId;
      this.next = null;
      this.fadeIn = true;
      this.state = 0;
      this.oldDone = false;
      return 'startNew';
    }
    // crossfade
    if (this.state === 1) { this.state = 2; return 'startNewAndEndOld'; }
    if (this.state === 2) {
      if (!this.oldDone) return 'wait';
      const old = this.current;
      void old;
      this.current = this.next as WeatherId;
      this.next = null;
      this.fadeIn = true;
      this.state = 0;
      this.oldDone = false;
      return 'swapTasks';
    }
    return 'idle';
  }

  isActive(): boolean { return this.state !== 0 || this.pending !== null; }
}

// ---------------------------------------------------------------------------
// Particle moves — pure per-frame steps, DS pixel units, 60 fps.
// A step returns false when the particle must be removed.
// ---------------------------------------------------------------------------

export interface RainDrop { x: number; y: number; speedX: number; speedY: number; frame: number; splashFrame: number; splash: number; state: 0 | 1 | 2; }

/** Rain_AddDrops: size = random % 3, slant = random % 20.
 *  speedY = slant + (size+1)*16 (+16 if size 2); speedX =
 *  slant/8 + (size+1)*8 (+8 if size 2); both then doubled.
 *  splashFrame = (random & 1) + 1; splash = RandomLC(10).
 *  Spawn x = low byte of random + size*15 - 0x48, y = -0x60. */
export function spawnRainDrop(random: number, splash: number): RainDrop {
  const size = random % 3;
  const slant = random % 20;
  let speedY = slant + (size + 1) * 16;
  if (size === 2) speedY += 16;
  let speedX = Math.floor(slant / 8) + (size + 1) * 8;
  if (size === 2) speedX += 8;
  return {
    x: (random % 256) + (size * 15 - 0x48),
    y: -0x60,
    speedX: speedX * 2,
    speedY: speedY * 2,
    frame: 0,
    splashFrame: (random & 1) + 1,
    splash,
    state: 0,
  };
}

/** RainDrop_Move. State 0 falls (frame += 2); past splashFrame it
 *  either vanishes (splash < 7) or plays a 4-frame splash (state 1). */
export function stepRainDrop(d: RainDrop): boolean {
  if (d.state === 0) {
    d.x += d.speedX;
    d.y += d.speedY;
    d.frame += 2;
    if (d.frame > d.splashFrame) {
      if (d.splash < 7) { d.state = 2; return false; }
      d.state = 1;
      d.frame = 4;
    }
    return true;
  }
  if (d.state === 1) {
    if (d.frame-- <= 0) { d.state = 2; return false; }
    return true;
  }
  return false;
}

/** Thunderstorm drops use the same move as rain drops (same
 *  RainDrop_Move in weather_rain.c); only the spawner, fog level
 *  (9 vs 8), and lightning differ. Lightning: 1-3 strikes per
 *  flash (GFL_RandomLC(2) + 1), GAP: bolt geometry is a DS cell
 *  animation, not translated — a Pixi layer must draw its own
 *  original bolt shape if it wants one. */
export const THUNDER_LIGHTNING_MIN = 1;
export const THUNDER_LIGHTNING_MAX = 3;
export function lightningStrikeCount(random2: number): number { return random2 + 1; }

export interface SandGrain { x: number; y: number; speedX: number; speedY: number; accelX: number; frame: number; lifetime: number; done: boolean; size: number; }

/** Sand wind tables — sWindSpeedX/Y[8], one step every 40 frames
 *  of a 320-frame cycle (cycle/40). */
export const SAND_WIND_X = [6, 10, 10, 6, 10, 12, 20, 12];
export const SAND_WIND_Y = [4, 4, 4, 8, 8, 4, 4, 4];
export const SAND_WIND_CYCLE_FRAMES = 320;
export const SAND_WIND_STEP_FRAMES = 40;

/** Sandstorm_AddGrains: lifetime = RandomLC(20)+15, size =
 *  3 - (lifetime-15)/6, speed = wind[index]*(size+1), accelX =
 *  windX[index]; on a 1-in-1000 roll (== 777) size 4 and speedY
 *  grows by half. Spawn x = -6 - RandomLC(24), y = RandomLC(192)-64. */
export function spawnSandGrain(cycle: number, lifetimeRand: number, xRand: number, yRand: number, rareRoll: number): SandGrain {
  const index = Math.floor(((cycle % 320) + 320) % 320 / 40);
  const lifetime = lifetimeRand + 15;
  let size = 3 - Math.floor((lifetime - 15) / 6);
  let speedY = SAND_WIND_Y[index] * (size + 1);
  const speedX = SAND_WIND_X[index] * (size + 1);
  if (rareRoll === 777) { size = 4; speedY += Math.floor(speedY / 2); }
  return { x: -6 - xRand, y: yRand - 64, speedX, speedY, accelX: SAND_WIND_X[index], frame: 0, lifetime, done: false, size };
}

/** SandGrain_Move: accelX added every 5 frames; past lifetime the
 *  grain is done (removed next step). Positions wrap in the
 *  original (SetParticlePosWrapped) — a Pixi layer wraps at its
 *  own viewport, it must not clamp. */
export function stepSandGrain(g: SandGrain): boolean {
  if (g.done) return false;
  g.x += g.speedX;
  g.y += g.speedY;
  if (g.frame % 5 === 0) g.speedX += g.accelX;
  if (g.frame++ > g.lifetime) g.done = true;
  return true; // just became done: still drawn this frame, removed on the next call
}

/** Sandstorm_ScrollBg: scroll = (scroll+6) % 256; billboard
 *  offsets are -scroll*2 - camX (x) and -scroll*2 + camY (y). */
export function sandScroll(scroll: number, camX: number, camY: number): { scroll: number; offsetX: number; offsetY: number } {
  const next = (scroll + 6) % 256;
  return { scroll: next, offsetX: -next * 2 - camX, offsetY: -next * 2 + camY };
}

export interface BlizzardFlake { x: number; y: number; speedX: number; speedY: number; accelX: number; frame: number; lifetime: number; state: 0 | 1; size: number; }

export const BLIZZARD_SPEED_Y = [3, 6, 3, 6];
export const BLIZZARD_SPEED_X = [7, 11, 15, 19];
/** Blizzard background scroll tables (9 entries, one step per 28
 *  frames: step = scrollStep/28, scrollStep wraps at 9*28 = 252). */
export const BLIZZARD_SCROLL_X = [7, 8, 8, 8, 8, 8, 7, 7, 7];
export const BLIZZARD_SCROLL_Y = [3, 2, 1, 2, 1, 2, 3, 2, 3];
export const BLIZZARD_SCROLL_STEP_FRAMES = 28;

/** Blizzard_AddFlakes: cycle 0-1023, index = cycle/256; lifetime
 *  = RandomLC(3)+9, size = RandomLC(4); speed = (size+1)*table,
 *  plus one more table step when size == 3. Spawn x = -RandomLC(24),
 *  y = RandomLC(168) - 0x20. */
export function spawnBlizzardFlake(cycle: number, size: number, xRand: number, yRand: number): BlizzardFlake {
  const index = Math.floor((((cycle % 1024) + 1024) % 1024) / 256);
  let speedX = (size + 1) * BLIZZARD_SPEED_X[index];
  let speedY = (size + 1) * BLIZZARD_SPEED_Y[index];
  if (size === 3) { speedX += BLIZZARD_SPEED_X[index]; speedY += BLIZZARD_SPEED_Y[index]; }
  return { x: -xRand, y: yRand - 0x20, speedX, speedY, accelX: BLIZZARD_SPEED_X[index], frame: 0, lifetime: 9, state: 0, size };
}

/** BlizzardFlake_Move: every 4 frames speedX += accelX and speedY
 *  drops by 1 (floor 1); past lifetime the flake is removed. */
export function stepBlizzardFlake(f: BlizzardFlake): boolean {
  if (f.state !== 0) return false;
  f.x += f.speedX;
  f.y += f.speedY;
  if (f.frame++ > f.lifetime) f.state = 1;
  if (f.frame % 4 === 0) {
    f.speedX += f.accelX;
    if (f.speedY > 1) f.speedY -= 1;
  }
  return f.state === 0;
}

/** Blizzard_ScrollBg, verbatim arithmetic (camera scroll halves). */
export function blizzardScroll(scrollStep: number, scrollX: number, scrollY: number, camX: number, camY: number): { scrollStep: number; scrollX: number; scrollY: number } {
  const step = Math.floor(scrollStep / 28);
  const nextStep = (scrollStep + 1) % (BLIZZARD_SCROLL_X.length * 28);
  let nx = scrollX + BLIZZARD_SCROLL_X[step] - Math.floor(camX / 2);
  let ny = scrollY + BLIZZARD_SCROLL_Y[step] - Math.floor(camY / 2);
  if (nx < 0) nx += 256;
  if (ny < 0) ny += 256;
  return { scrollStep: nextStep, scrollX: nx % 256, scrollY: ny % 256 };
}

// FLAKE_SWAY — sFlakeSway[0x151] from weather_particles.c, verbatim.
// A snow flake steps x by one table entry per frame and wraps.
export const FLAKE_SWAY: number[] = [
  0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0,
  0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0,
  0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0,
  0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0,
  0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0,
  0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
  0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
  0
];

/** Flake_Move (snow): x += sway[swayIdx]; acc starts 0, y += 1
 *  whenever acc > rate (then acc %= rate), then acc += 8;
 *  swayIdx wraps at 337. Removed when y lands in -295..-285 or
 *  213..231 (the source's two off-screen bands). rate =
 *  RandomLC(8)+12, spawn x = RandomLC(0x19e)-0x20, y = -8 -
 *  RandomLC(20). */
export interface SnowFlake { x: number; y: number; acc: number; rate: number; swayIdx: number; }
export function stepSnowFlake(f: SnowFlake): boolean {
  f.x += FLAKE_SWAY[f.swayIdx];
  if (f.acc > f.rate) { f.y += 1; f.acc %= f.rate; }
  f.acc += 8;
  f.swayIdx = (f.swayIdx + 1) % FLAKE_SWAY.length;
  if ((f.y < -0x11c && f.y > -0x128) || (f.y > 0xd4 && f.y < 0xe8)) return false;
  return true;
}

export interface FlutterFlake { x: number; y: number; speedX: number; speedY: number; frame: number; lifetime: number; phase: 0 | 1 | 2; seed: number; animFrame: number; }

/** Flutter_AddFlakes: kind from seed%100 (<30 -> 0, <95 -> 1,
 *  else 2); speedY = seed%23 + (kind+1)*10 (+3 if kind 2);
 *  speedX = (seed%23)/4 + (kind+1)*4 (-2 if kind 2); lifetime =
 *  (seed & 3) + 1; spawn x = seed%0x10e + kind*15 - 0x40,
 *  y = (seed & 0xf) - 8; anim frame starts at 2 - kind. */
export function spawnFlutterFlake(seed: number): FlutterFlake {
  const p = seed % 100;
  const kind = p < 30 ? 0 : p < 95 ? 1 : 2;
  const m = seed % 23;
  let speedY = m + (kind + 1) * 10;
  if (kind === 2) speedY += 3;
  let speedX = Math.floor(m / 4) + (kind + 1) * 4;
  if (kind === 2) speedX -= 2;
  return { x: seed % 0x10e + (kind * 15 - 0x40), y: (seed & 0xf) - 8, speedX, speedY, frame: 0, lifetime: (seed & 3) + 1, phase: 0, seed, animFrame: 2 - kind };
}

/** FlutterFlake_Move. Phase 0 falls; past lifetime it switches
 *  to phase 1 with frame = seed%4*2+8, speed 2/2, anim +3.
 *  Phase 1 drifts x, y alternates +/- speedY by frame parity,
 *  speeds decay by 1 every 4 frames (floor 0); at frame <= 0
 *  (checked after the move, frame-- ) it is removed. */
export function stepFlutterFlake(f: FlutterFlake): boolean {
  if (f.phase === 0) {
    if (++f.frame > f.lifetime) {
      f.phase = 1;
      f.frame = (f.seed % 4) * 2 + 8;
      f.speedX = 2;
      f.speedY = 2;
      f.animFrame += 3;
      return true;
    }
    f.x += f.speedX;
    f.y += f.speedY;
    return true;
  }
  if (f.phase === 1) {
    f.x += f.speedX;
    if (f.frame % 2 === 0) f.y += f.speedY; else f.y -= f.speedY;
    if (f.frame % 4 === 0) {
      if (f.speedY - 1 >= 0) f.speedY -= 1;
      if (f.speedX - 1 >= 0) f.speedX -= 1;
    }
    if (f.frame-- <= 0) { f.phase = 2; return false; }
    return true;
  }
  return false;
}

export interface Speck { x: number; y: number; stepX: number; stepY: number; periodX: number; periodY: number; frame: number; lifetime: number; }

/** Speck_Add: lifetime = a%5+7 (doubled if the spawn point falls
 *  inside the low..high band computed from x/y in the source);
 *  stepX = +/-1 by a parity, stepY = 1; periodX = a%6+3,
 *  periodY = b%5+4; spawn x = a%0x180-0x40, y = b%256-8.
 *  The band test is reproduced in speckLifetimeMultiplier(). */
export function speckLifetimeMultiplier(x: number, y: number, b: number): number {
  const low = 50 - Math.floor(x / 3);
  const range = 0xce - Math.floor(x / 3);
  const high = range < 0 ? low - (b % -range) : low + (b % range);
  return low <= y && high >= y ? 2 : 1;
}
export function spawnSpeck(a: number, b: number): Speck {
  const x = (a % 0x180) - 0x40;
  const y = (b % 256) - 8;
  const base = (a % 5) + 7;
  return {
    x, y,
    stepX: a % 2 === 0 ? 1 : -1,
    stepY: 1,
    periodX: (a % 6) + 3,
    periodY: (b % 5) + 4,
    frame: 0,
    lifetime: base * speckLifetimeMultiplier(x, y, b),
  };
}

/** Speck_Move — WITH THE SOURCE BUG PRESERVED AND LABELLED: the
 *  C code computes the new position but never sets it (the
 *  SetParticlePosWrapped call is behind #ifdef BUGFIX), so specks
 *  stay where they appear until lifetime ends. This function
 *  therefore returns the particle unchanged except frame/lifetime;
 *  a Pixi layer that wants drifting specks must NOT use this step
 *  as-is — it must opt into the fixed behaviour explicitly. */
export function stepSpeck(s: Speck): boolean {
  s.frame += 1;
  if (s.frame >= s.lifetime) return false;
  return true;
}
/** Fixed speck drift (opt-in only, NOT the source behaviour):
 *  x += stepX every periodX frames, y += stepY every periodY. */
export function stepSpeckFixed(s: Speck): boolean {
  s.frame += 1;
  if (s.frame % s.periodX === 0) s.x += s.stepX;
  if (s.frame % s.periodY === 0) s.y += s.stepY;
  if (s.frame >= s.lifetime) return false;
  return true;
}

// Gusty rain: emitter + fade data are wired (weather_rain.c Gust
// spawner above); the per-kind gust move (slant / swirl / gust
// kinds driven by a 224-frame background scale cycle and a
// 72-step lightning table in the source) is GAP — not translated
// in this batch, because its move table is a DS cell-animation
// system, not a single step function. Do NOT claim gust particles
// as fully wired: see FIELD_WEATHER_GAPS below.

// ---------------------------------------------------------------------------
// Tint-only weathers — Black 2 src/ov078/weather_tint.c.
// Level/colour by camera-defaults index (34 entries): mostly level
// 8 / colour 0x7f5f, except index 10 (level 1, colour 0x0000) and
// index 24 (level 8, colour 0x0a08). Fade-in 90f, fade-out 60f.
// ---------------------------------------------------------------------------

export const TINT_LEVELS: number[] = [
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8,
];
export const TINT_COLORS_RGB555: number[] = [
  0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x0000,
  0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f,
  0x7f5f, 0x0a08, 0x7f5f, 0x7f6f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f, 0x7f5f,
  0x7f5f,
];
export function tintForCameraIndex(index: number): { level: number; rgb555: number; hex: number } {
  const i = ((index % TINT_LEVELS.length) + TINT_LEVELS.length) % TINT_LEVELS.length;
  return { level: TINT_LEVELS[i], rgb555: TINT_COLORS_RGB555[i], hex: rgb555ToHex(TINT_COLORS_RGB555[i]) };
}

// ---------------------------------------------------------------------------
// Day / night — HeartGold src/gf_rtc.c, hour table verbatim.
// RTC_TIMEOFDAY: MORN 0, DAY 1, EVE 2, NITE 3, LATE 4.
// ---------------------------------------------------------------------------

export type TimeOfDay = 'late' | 'morn' | 'day' | 'eve' | 'nite';

export const TIME_OF_DAY_BY_HOUR: TimeOfDay[] = [
  'late', 'late', 'late', 'late', // 0-3
  'morn', 'morn', 'morn', 'morn', 'morn', 'morn', // 4-9
  'day', 'day', 'day', 'day', 'day', 'day', 'day', // 10-16
  'eve', 'eve', 'eve', // 17-19
  'nite', 'nite', 'nite', 'nite', // 20-23
];

export function timeOfDayForHour(hour: number): TimeOfDay {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  return TIME_OF_DAY_BY_HOUR[h];
}

/** IsNighttime: NITE or LATE only — morning/evening are not night. */
export function isNighttimeHour(hour: number): boolean {
  const t = timeOfDayForHour(hour);
  return t === 'nite' || t === 'late';
}

/** Wild-encounter time bucket: MORN -> morn, DAY|EVE -> day,
 *  NITE|LATE -> nite (GF_RTC_GetTimeOfDayWildParamByHour). */
export type WildTimeParam = 'morn' | 'day' | 'nite';
export function wildTimeParamForHour(hour: number): WildTimeParam {
  const t = timeOfDayForHour(hour);
  if (t === 'morn') return 'morn';
  if (t === 'day' || t === 'eve') return 'day';
  return 'nite';
}

export function timeOfDayNow(date: Date = new Date()): TimeOfDay {
  return timeOfDayForHour(date.getHours());
}

/** Day/night tint for a Pixi overlay layer. These hex tints are a
 *  Mochiichao presentation choice (the DS sources drive light/fog
 *  levels, not a hex overlay) — labelled as such, not as a decomp
 *  value. Alpha is the overlay opacity, 0 = no tint. */
export const DAY_NIGHT_TINTS: Record<TimeOfDay, { hex: number; alpha: number }> = {
  morn: { hex: 0xffd9a0, alpha: 0.08 },
  day: { hex: 0xffffff, alpha: 0 },
  eve: { hex: 0xff9a5c, alpha: 0.16 },
  nite: { hex: 0x1e3a8a, alpha: 0.28 },
  late: { hex: 0x0f172a, alpha: 0.34 },
};
export function dayNightTintForHour(hour: number): { timeOfDay: TimeOfDay; hex: number; alpha: number; isNight: boolean } {
  const t = timeOfDayForHour(hour);
  const tint = DAY_NIGHT_TINTS[t];
  return { timeOfDay: t, hex: tint.hex, alpha: tint.alpha, isNight: t === 'nite' || t === 'late' };
}

/** Date-gated sparkle weather — HeartGold field_system_rtc_weather.c
 *  date list, translated to a generic concept: on these 8 month/day
 *  pairs a summit-type map may use the sparkle weather instead of
 *  its map weather. The original name is a source-specific weather
 *  label and is NOT shipped; callers use the generic 'specks'
 *  weather (id 8) or their own sparkle layer for the effect. */
export const DATE_GATED_SPARKLE_DATES: { month: number; day: number }[] = [
  { month: 1, day: 1 }, { month: 1, day: 31 }, { month: 2, day: 1 }, { month: 2, day: 29 },
  { month: 3, day: 15 }, { month: 10, day: 10 }, { month: 12, day: 3 }, { month: 12, day: 31 },
];
export function isDateGatedSparkleDay(month: number, day: number): boolean {
  return DATE_GATED_SPARKLE_DATES.some((d) => d.month === month && d.day === day);
}

// ---------------------------------------------------------------------------
// Generic field effects — FireRed field_effect_objects.h.
// Only terrain / UI / generic-object effects are listed; every
// creature-show, creature-move, trainer, and story effect from the
// 70-entry FLDEFF table is deliberately NOT in this module (see
// FIELD_WEATHER_GAPS). Frame counts are ANIMCMD_FRAME durations
// summed from the source animation tables; a looping animation
// (splash variant 1, sparkle) has totalFrames = null and its loop
// frame list preserved instead. Sizes are the OAM sizes in the
// source templates. Shadows are a SEPARATE layer: the engine draws
// one of these four sizes under a character, it is never part of
// the character's own art.
// ---------------------------------------------------------------------------

export interface FieldEffect {
  key: string;
  /** FireRed FLDEFF id, for traceability to the source table. */
  fireredId: number;
  size: string;
  frames: number[];
  totalFrames: number | null;
  loop: boolean;
}

export const SHADOW_SIZES: Record<'S' | 'M' | 'L' | 'XL', string> = {
  S: '8x8', M: '16x8', L: '32x8', XL: '64x32',
};

export const FIELD_EFFECTS: FieldEffect[] = [
  { key: 'shadowS',          fireredId: 3,  size: '8x8',   frames: [1],                              totalFrames: 1,    loop: false },
  { key: 'shadowM',          fireredId: 3,  size: '16x8',  frames: [1],                              totalFrames: 1,    loop: false },
  { key: 'shadowL',          fireredId: 3,  size: '32x8',  frames: [1],                              totalFrames: 1,    loop: false },
  { key: 'shadowXL',         fireredId: 3,  size: '64x32', frames: [1],                              totalFrames: 1,    loop: false },
  { key: 'tallGrass',        fireredId: 4,  size: '16x16', frames: [10, 10, 10, 10, 10],            totalFrames: 50,   loop: false },
  { key: 'ripple',           fireredId: 5,  size: '16x16', frames: [12, 9, 9, 9, 9, 9, 11, 11],     totalFrames: 79,   loop: false },
  { key: 'ash',              fireredId: 7,  size: '16x16', frames: [12, 12, 8, 12, 12],              totalFrames: 56,   loop: false },
  { key: 'groundImpactDust', fireredId: 10, size: '16x8',  frames: [8, 8, 8],                        totalFrames: 24,   loop: false },
  { key: 'jumpTallGrass',    fireredId: 12, size: '16x8',  frames: [8, 8, 8, 8],                     totalFrames: 32,   loop: false },
  { key: 'sandFootprints',   fireredId: 13, size: '16x16', frames: [1, 1, 1, 1],                     totalFrames: 4,    loop: false },
  { key: 'jumpBigSplash',    fireredId: 14, size: '16x16', frames: [8, 8, 8, 8],                     totalFrames: 32,   loop: false },
  { key: 'splash',           fireredId: 15, size: '16x8',  frames: [4, 4],                          totalFrames: 8,    loop: false },
  { key: 'splashLoop',       fireredId: 15, size: '16x8',  frames: [4, 4, 6, 6, 8, 8, 6, 6],         totalFrames: null, loop: true },
  { key: 'jumpSmallSplash',  fireredId: 16, size: '16x8',  frames: [4, 4, 4],                        totalFrames: 12,   loop: false },
  { key: 'longGrass',        fireredId: 17, size: '16x16', frames: [3, 3, 4, 4, 4, 4, 4],           totalFrames: 26,   loop: false },
  { key: 'jumpLongGrass',    fireredId: 18, size: '16x16', frames: [4, 4, 8, 8, 8, 8],              totalFrames: 40,   loop: false },
  { key: 'shortGrass',       fireredId: 41, size: '16x16', frames: [4, 4],                          totalFrames: 8,    loop: false },
  { key: 'bubbles',          fireredId: 53, size: '16x16', frames: [4, 4, 4, 6, 6, 4, 4, 4],         totalFrames: 36,   loop: false },
  { key: 'sparkle',          fireredId: 54, size: '16x16', frames: [8, 8, 8, 8, 8, 8],              totalFrames: null, loop: true },
];

export function fieldEffectByKey(key: string): FieldEffect | undefined {
  return FIELD_EFFECTS.find((f) => f.key === key);
}

/** Frame index of a field effect at elapsed frames (looping
 *  effects wrap; one-shot effects hold their last frame). */
export function fieldEffectFrameAt(effect: FieldEffect, elapsedFrames: number): number {
  let t = elapsedFrames;
  if (effect.loop) {
    const total = effect.frames.reduce((a, b) => a + b, 0);
    t = total === 0 ? 0 : t % total;
  }
  let acc = 0;
  for (let i = 0; i < effect.frames.length; i++) {
    acc += effect.frames[i];
    if (t < acc) return i;
  }
  return effect.frames.length - 1;
}

// ---------------------------------------------------------------------------
// TitleScene biome mapping — importable, no TitleScene rewrite.
// TitleBiomeId values are the 8 ids already in src/lib/titleBiomes.ts
// (snow/grass/water/sand/stone/forest/rain/night). This maps each to
// the weather id + particle count that TitleScene's existing
// weather layer already uses, so a future TitleScene edit can swap
// its hand-rolled particle loop for the step functions above
// without changing biome ids, palettes, or scene structure.
// Night uses the day/night tint (dayNightTintForHour), not a
// weather id — weather stays 'none' there, matching titleBiomes.
// ---------------------------------------------------------------------------

export type TitleBiomeId = 'snow' | 'grass' | 'water' | 'sand' | 'stone' | 'forest' | 'rain' | 'night';

export interface TitleBiomeWeather {
  biome: TitleBiomeId;
  weatherId: WeatherId | null;
  weatherKey: string;
  particleCount: number;
  /** Existing titleBiomes weather kind, for the current TitleScene. */
  titleWeatherKind: 'snow' | 'rain' | 'none' | 'dust' | 'leaves';
}

export const TITLE_BIOME_WEATHER: TitleBiomeWeather[] = [
  { biome: 'snow',   weatherId: 1, weatherKey: 'snowFlakes', particleCount: 40, titleWeatherKind: 'snow' },
  { biome: 'grass',  weatherId: 5, weatherKey: 'flutter',    particleCount: 18, titleWeatherKind: 'leaves' },
  { biome: 'water',  weatherId: null, weatherKey: 'none',    particleCount: 0,  titleWeatherKind: 'none' },
  { biome: 'sand',   weatherId: 3, weatherKey: 'sandstorm',  particleCount: 16, titleWeatherKind: 'dust' },
  { biome: 'stone',  weatherId: null, weatherKey: 'none',    particleCount: 0,  titleWeatherKind: 'none' },
  { biome: 'forest', weatherId: 5, weatherKey: 'flutter',    particleCount: 22, titleWeatherKind: 'leaves' },
  { biome: 'rain',   weatherId: 2, weatherKey: 'rain',       particleCount: 50, titleWeatherKind: 'rain' },
  { biome: 'night',  weatherId: null, weatherKey: 'none',    particleCount: 0,  titleWeatherKind: 'none' },
];

export function titleBiomeWeather(biome: TitleBiomeId): TitleBiomeWeather {
  return TITLE_BIOME_WEATHER.find((b) => b.biome === biome) as TitleBiomeWeather;
}

// ---------------------------------------------------------------------------
// GAPS — counted, not claimed. See the PR report for the full list.
// ---------------------------------------------------------------------------

export const FIELD_WEATHER_GAPS: string[] = [
  'Gusty-rain per-kind particle moves (slant/swirl/gust kinds + 224-frame background scale cycle): emitter + fade data wired, move NOT translated.',
  'Black 2 weather_task.c spawner engine internals (SetupSpawner/StepSpawner/StepSpawnTimer argument semantics): raw tuples preserved, engine NOT re-implemented.',
  'Black 2 zone fog / camera-defaults light table (FieldLightStatus_GetWeatherLight indices): light ids NOT shipped — sound/light wiring is a later batch with a Mochiichao sound pick.',
  'Weather audio: NO sound files, NO sound IDs shipped (source SE ids are source audio and are deliberately omitted).',
  'FireRed creature-show / creature-move / trainer / story field effects (FLDEFF ids outside FIELD_EFFECTS): NOT in this module, kept local-only, replaced by Mochiichao versions in a later batch.',
  'FireRed field-effect script interpreter (loadtiles/loadpal/callnative/end): structure noted, interpreter NOT ported — field effects here are data + step functions only.',
  'HeartGold RTC freeze/set-time debug paths (GF_RTC_SetAndFreezeTime): NOT wired — live clock only.',
  'TitleScene particle loop swap: TitleScene.tsx NOT edited in this batch (parallel batches own it); this module is importable and mapped, the swap is a later minimal edit.',
];

export const FIELD_WEATHER_COUNTS = {
  weatherTableEntries: WEATHER_TABLE.length, // 15, Black 2 table order
  particleKindsWithStep: 7, // rain/thunder(shared), sand, blizzard, snow flake, flutter, speck(+fixed opt-in)
  particleKindsSpecOnly: 1, // gusty rain move
  fieldEffects: FIELD_EFFECTS.length, // 19 rows (4 shadow sizes + 15 effect rows)
  dayNightPhases: 5, // late/morn/day/eve/nite
  titleBiomesMapped: TITLE_BIOME_WEATHER.length, // 8/8
  gaps: FIELD_WEATHER_GAPS.length, // 8
};
