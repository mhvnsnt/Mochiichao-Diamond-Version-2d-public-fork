/**
 * Title animation systems — translated from the actual Pokemon decomp
 * files, Mochiichao art only. No Pokemon sprite, dialogue, music or
 * cry is shipped here: every system below drives Pixi-drawn shapes
 * or Mochiichao's own cutout (Yogiferno) in the exact slot where the
 * original drove its own title art.
 *
 * All frame counts are in 60fps frames, exactly as written in the
 * sources. GBA coordinates are 240x160 (DISPLAY_WIDTH x
 * DISPLAY_HEIGHT); TitleScene scales them to its canvas
 * (gbaX * canvasW / 240, gbaY * canvasH / 160) — positions scale,
 * timings do not change.
 *
 * Sources (read while building, not invented):
 *  [FR] pokefirered-leafgreen/src/title_screen.c — Task_FlameSpawner,
 *       SpriteCallback_TitleScreenFlame, Task_LeafSpawner,
 *       SpriteCallback_TitleScreenLeaf, SpriteCallback_Streak.
 *  [HG] pokeheartgold/src/title_screen.c — TitleScreenAnim_Run,
 *       TITLESCREEN_ANIM_RUN start-instruction flash, plus
 *       TITLESCREEN_MAIN_PLAY initialDelay = 30.
 *  [RU] decomps/pokeruby/src/title_screen.c —
 *       SpriteCallback_PokemonLogoShine, StartPokemonLogoShine,
 *       Task_TitleScreenPhase1 (counter starts at 256).
 *  [BW] pokebw2/src/ov162/title.c — TitleSys capture blend,
 *       TitleG3D_StepCurve / curve frame constants, 60-degree
 *       frustum camera. The curve itself is a binary NARC curve
 *       file (CURVE_FILE); it is NOT copied — the Pixi translation
 *       keeps its frame period (7300) and its step rule (one curve
 *       frame per VBlank, extra steps for dropped VBlanks) and maps
 *       the camera to a slow closed pan/zoom path. That mapping is
 *       the translation, labelled here, not the original curve data.
 *  [PL] decomps/pokeplatinum/src/applications/title_screen.c —
 *       TITLE_SCREEN_APP_STATE_EXIT_NORMAL / EXIT_REPLAY_OPENING /
 *       CLEANUP, INTRO_STATE_FADE_MAIN_FROM_BLACK,
 *       TITLE_CAM_MOVE_IN_FRAMES = 60.
 *
 * What is NOT translated literally, and why:
 *  - [BW] VRAM-D display capture cannot exist in Pixi: the "blend
 *    each frame with the last" is translated as a one-frame ghost
 *    of the figure at alpha = captureEvb / 16 (see
 *    bw2MotionBlurAlpha). One ghost only, because the original
 *    blends with the last frame only, not a trail.
 *  - [PL] The original exit waits for an event (cry finished AND
 *    fade done), not a fixed frame. platinumExitOverlayAlpha
 *    therefore takes a phase ('delay' | 'out' | 'in'), and
 *    TitleScene advances out -> in after its 6-frame out fade;
 *    the cry gate has no Mochiichao audio to gate on (music/cries
 *    are LEAVE-OUT), so the gate is documented, not faked.
 *  - [PL] ScreenFade "step" parameters (e.g. 15, 3) are fade-call
 *    parameters in the original, not a plain frame count. The
 *    entry overlay in TitleScene uses the final main fade's
 *    documented length, 48 frames (INTRO_STATE_FADE_MAIN_FROM_BLACK
 *    = COLOR_BLACK, 48, 1), as its duration — the earlier
 *    black/white flash calls are listed in PLATINUM_ENTRY_FADES
 *    for reference, not re-timed by guesswork.
 */

// ---------------------------------------------------------------- FR
export const GBA_DISPLAY_WIDTH = 240;
export const GBA_DISPLAY_HEIGHT = 160;

/** [FR] Flame spawner fires every 18 frames (tDelay = 18). */
export const FIRE_RED_FLAME_SPAWN_DELAY = 18;
/** [FR] sFlameXPositions: 15 trail flames + trailing 0 (loop uses i < 15). */
export const FIRE_RED_FLAME_X_POSITIONS = [4, 16, 26, 32, 48, 200, 216, 224, 232, 60, 76, 92, 108, 128, 144];
/** [FR] Flame spawn row: y = rand % 3 + 116. */
export const FIRE_RED_FLAME_Y_BASE = 116;
/** [FR] Flame speed ranges, subpixel units (position is stored * 16):
 *  xspeed = rand % 4 - 2  (-2..1), yspeed = rand % 8 - 16  (-16..-9). */
export const FIRE_RED_FLAME_SPEED_X_MIN = -2;
export const FIRE_RED_FLAME_SPEED_X_MAX = 1;
export const FIRE_RED_FLAME_SPEED_Y_MIN = -16;
export const FIRE_RED_FLAME_SPEED_Y_MAX = -9;
/** [FR] Flame kill bounds: x < -8, y < 16 or y > 200, or anim ended. */
export const FIRE_RED_FLAME_KILL_X = -8;
export const FIRE_RED_FLAME_KILL_Y_MIN = 16;
export const FIRE_RED_FLAME_KILL_Y_MAX = 200;
/** [FR] tOffsetX cycles 0..3 across spawns (offset added to trail xs). */
export const FIRE_RED_FLAME_OFFSET_CYCLE = 4;

/** [FR] Leaf spawner: tDelay = rand % 6 + 6 frames between leaves. */
export const FIRE_RED_LEAF_DELAY_BASE = 6;
export const FIRE_RED_LEAF_DELAY_RANGE = 6;
/** [FR] Leaf speeds, subpixel units: xspeed 16, or 48 (24 if rval < 12),
 *  yspeed = rand % 4 - 2; spawn y = rand % 88 + 32, x = DISPLAY_WIDTH. */
export const FIRE_RED_LEAF_SPEED_X = [16, 24, 48];
export const FIRE_RED_LEAF_SPEED_Y_MIN = -2;
export const FIRE_RED_LEAF_SPEED_Y_MAX = 1;
export const FIRE_RED_LEAF_Y_BASE = 32;
export const FIRE_RED_LEAF_Y_RANGE = 88;
/** [FR] Streaks: x -= 7 per frame, wrap to DISPLAY_WIDTH + 16,
 *  y cycles through sStreakYPositions, 4 streaks 40px apart. */
export const FIRE_RED_STREAK_SPEED = 7;
export const FIRE_RED_STREAK_Y_POSITIONS = [40, 80, 110, 60, 90, 70, 100, 50];
export const FIRE_RED_STREAK_COUNT = 4;
export const FIRE_RED_STREAK_SPACING = 40;

export interface SubpixelParticle {
  /** Position in subpixel units (pixels * 16), as in the original. */
  posX: number;
  posY: number;
  speedX: number;
  speedY: number;
}

/** [FR] One flame/leaf step: posX -= speedX, posY += speedY (flame
 *  callback; leaf callback uses the same two lines). Returns false
 *  when the sprite would be destroyed (kill bounds). */
export function fireRedParticleStep(p: SubpixelParticle): boolean {
  p.posX -= p.speedX;
  p.posY += p.speedY;
  const x = p.posX / 16;
  const y = p.posY / 16;
  if (x < FIRE_RED_FLAME_KILL_X) return false;
  if (y < FIRE_RED_FLAME_KILL_Y_MIN || y > FIRE_RED_FLAME_KILL_Y_MAX) return false;
  return true;
}

/** [FR] One streak step: x -= 7; on wrap, advance the y-index. */
export function fireRedStreakStep(x: number, yIndex: number): { x: number; yIndex: number } {
  let nx = x - FIRE_RED_STREAK_SPEED;
  let ni = yIndex;
  if (nx < -16) {
    nx = GBA_DISPLAY_WIDTH + 16;
    ni = (yIndex + 1) % FIRE_RED_STREAK_Y_POSITIONS.length;
  }
  return { x: nx, yIndex: ni };
}

// ---------------------------------------------------------------- HG
/** [HG] Start-instruction flash: shown at timer 0, hidden at timer
 *  30, timer resets at >= 45. Only while enableStartInstructionFlash
 *  (which itself only turns on after initialDelay = 30 frames). */
export const HEART_GOLD_FLASH_SHOW_AT = 0;
export const HEART_GOLD_FLASH_HIDE_AT = 30;
export const HEART_GOLD_FLASH_CYCLE = 45;
export const HEART_GOLD_INITIAL_DELAY = 30;

/** [HG] Visible for frames 0..29 of each 45-frame cycle, after the
 *  30-frame initial delay. IntroSequence press-blink previously
 *  used this same 30-on / 15-off shape; since the FireRed
 *  60-first / 30-30 tempo change it no longer matches this flash.
 *  This flash wiring itself is NOT changed, only documented here
 *  as its own system, separate from the press-blink tempo. */
export function heartGoldStartFlashVisible(frame: number, enabled: boolean): boolean {
  if (!enabled) return false;
  if (frame < HEART_GOLD_INITIAL_DELAY) return false;
  return ((frame - HEART_GOLD_INITIAL_DELAY) % HEART_GOLD_FLASH_CYCLE) < HEART_GOLD_FLASH_HIDE_AT;
}

// --------------------------------------------------------------- RU
/** [RU] Shine sprite created at (0, 68), x += 4 per frame, destroyed
 *  at x >= 272 (checked at the top of the callback). */
export const RUBY_SHINE_START_X = 0;
export const RUBY_SHINE_Y = 68;
export const RUBY_SHINE_SPEED = 4;
export const RUBY_SHINE_KILL_X = 272;
/** [RU] Brightness: +2 twice per frame (capped 31) while x < 120
 *  (DISPLAY_WIDTH / 2), -2 twice per frame (floored 0) after. */
export const RUBY_SHINE_BRIGHTNESS_MAX = 31;
export const RUBY_SHINE_BRIGHTNESS_STEP = 2;
export const RUBY_SHINE_HALF_X = GBA_DISPLAY_WIDTH / 2;
/** [RU] Phase 1 counter starts at 256, counts down, re-fires with
 *  flashBackground=TRUE at exactly 160 and 64. The first shine
 *  (at palette-fade completion) fires with flashBackground=FALSE. */
export const RUBY_PHASE1_COUNTER_START = 256;
export const RUBY_SHINE_REFIRE_COUNTERS = [160, 64];

export interface RubyShineState {
  x: number;
  brightness: number; // 0..31, only meaningful when flashBackground
  flashBackground: boolean;
  alive: boolean;
}

export function rubyShineStart(flashBackground: boolean): RubyShineState {
  return { x: RUBY_SHINE_START_X, brightness: 0, flashBackground, alive: true };
}

/** [RU] One shine callback step. Background brightness only moves
 *  when flashBackground is set; otherwise the band just travels. */
export function rubyShineStep(s: RubyShineState): RubyShineState {
  if (!s.alive || s.x >= RUBY_SHINE_KILL_X) {
    return { ...s, alive: false, brightness: 0 };
  }
  let brightness = s.brightness;
  if (s.flashBackground) {
    if (s.x < RUBY_SHINE_HALF_X) {
      for (let i = 0; i < 2; i++) if (brightness < RUBY_SHINE_BRIGHTNESS_MAX) brightness++;
    } else {
      for (let i = 0; i < 2; i++) if (brightness !== 0) brightness--;
    }
  }
  return { ...s, brightness, x: s.x + RUBY_SHINE_SPEED };
}

export function rubyPhase1Refires(counter: number): boolean {
  return RUBY_SHINE_REFIRE_COUNTERS.includes(counter);
}

// --------------------------------------------------------------- BW
/** [BW] Camera curve frame constants. */
export const BLACK2_CURVE_LOOP_FRAME = 7300;
export const BLACK2_CURVE_END_FRAME = 7780;
export const BLACK2_CURVE_LEAVE_FRAME = 7001;
export const BLACK2_TIMEOUT_FRAMES = 6780;
export const BLACK2_HIDE_LAYERS_FRAMES = 1740;
/** [BW] Display-capture blend factors, out of 16: init 12/4, and
 *  8/8 when A/Start is pressed (Title_HandleInput). */
export const BLACK2_CAPTURE_INIT_EVA = 12;
export const BLACK2_CAPTURE_INIT_EVB = 4;
export const BLACK2_CAPTURE_EXIT_EVA = 8;
export const BLACK2_CAPTURE_EXIT_EVB = 8;

/** [BW] Motion-blur ghost alpha = captureEvb / 16. */
export function black2MotionBlurAlpha(exiting: boolean): number {
  return (exiting ? BLACK2_CAPTURE_EXIT_EVB : BLACK2_CAPTURE_INIT_EVB) / 16;
}

/** [BW] Curve phase in [0, 1): one curve frame per VBlank, looping
 *  at CURVE_LOOP_FRAME. Extra steps for dropped VBlanks are the
 *  caller's job (Title_Update steps once per elapsed VBlank);
 *  TitleScene advances exactly one frame per ticker frame, and
 *  adds ticker.deltaTime so a dropped frame still advances. */
export function black2CurvePhase(frame: number): number {
  return (frame % BLACK2_CURVE_LOOP_FRAME) / BLACK2_CURVE_LOOP_FRAME;
}

/** [BW] Pixi translation of the curve camera: a slow closed path.
 *  Returns normalised pan (-1..1) and zoom (0.98..1.02). Amplitude
 *  is applied by TitleScene in canvas pixels — the original curve
 *  data itself is not copied, see the header note. */
export function black2CameraPose(frame: number): { panX: number; panY: number; zoom: number } {
  const t = black2CurvePhase(frame) * Math.PI * 2;
  return {
    panX: Math.sin(t),
    panY: Math.sin(t * 2) * 0.5,
    zoom: 1 + 0.02 * Math.cos(t),
  };
}

// --------------------------------------------------------------- PL
/** [PL] BGM fade-out length, in frames, on every title exit path. */
export const PLATINUM_BGM_FADE_FRAMES = 60;
/** [PL] Exit fade delay after pressing Start: 10 frames, then a
 *  6-frame fade to white; the return fade (white -> main) is also
 *  6 frames. The clear-save path fades to black in 6 frames. */
export const PLATINUM_EXIT_FADE_DELAY = 10;
export const PLATINUM_EXIT_FADE_FRAMES = 6;
/** [PL] Entry: final main fade is black, 48 frames
 *  (INTRO_STATE_FADE_MAIN_FROM_BLACK). Title camera move-in is
 *  60 frames (TITLE_CAM_MOVE_IN_FRAMES); inputs disabled 30
 *  frames after the intro (TITLE_SCREEN_INPUT_DISABLE_FRAMES);
 *  opening replays after 900 frames. */
export const PLATINUM_ENTRY_MAIN_FADE_FRAMES = 48;
export const PLATINUM_TITLE_CAM_MOVE_IN_FRAMES = 60;
export const PLATINUM_INPUT_DISABLE_FRAMES = 30;
export const PLATINUM_REPLAY_OPENING_FRAMES = 900;
/** [PL] Earlier entry fade calls, as written (colour, params):
 *  black 15/3, white flashes 5/2, white-in 16/3 — listed so a
 *  later batch can sequence them without re-reading the file.
 *  Not re-timed here: see the header note on fade parameters. */
export const PLATINUM_ENTRY_FADES = [
  { color: 'black', a: 15, b: 3 },
  { color: 'white', a: 5, b: 2 },
  { color: 'white', a: 16, b: 3 },
] as const;

export type PlatinumExitKind = 'none' | 'normal' | 'clearSave';

/**
 * [PL] Overlay alpha for the exit driver, given frames since the
 * exit started and the current phase. 'delay': still showing the
 * title (10 frames). 'out': fading to white (normal) or black
 * (clearSave) over 6 frames. 'in': fading back from white over
 * 6 frames (normal path only; clearSave ends at black).
 * Returns { alpha, color } where alpha 0 = fully transparent.
 */
export function platinumExitOverlay(
  kind: PlatinumExitKind,
  phase: 'delay' | 'out' | 'in',
  frameInPhase: number,
): { alpha: number; color: number } {
  if (kind === 'none') return { alpha: 0, color: 0xffffff };
  if (phase === 'delay') return { alpha: 0, color: 0xffffff };
  const k = Math.min(1, Math.max(0, frameInPhase / PLATINUM_EXIT_FADE_FRAMES));
  if (kind === 'clearSave') return { alpha: k, color: 0x000000 };
  if (phase === 'out') return { alpha: k, color: 0xffffff };
  return { alpha: 1 - k, color: 0xffffff };
}
