// moveScripts.js — Pokemon-layer move-script interpreter (Layer 1, generic).
//
// Modelled on the real structures documented in
//   ../POKEMON-FILES-RESEARCH.md
// FireRed: src/battle_anim.c sScriptCmdTable, 48 commands (0x00-0x2F):
//   loadspritegfx / createsprite / createvisualtask / delay /
//   waitforvisualfinish / playse / playsewithpan / panse /
//   loopsewithpan / monbg / clearmonbg / call / goto / setarg /
//   jumpargeq / choosetwoturnanim / jumpifmoveturn / fadetobg /
//   changebg / invisible / visible / stopsound.
// Black 2: src/ov168/btlv_effvm.c MOVE_SCRCMD, 81 commands, incl.
//   CameraMovePreset / CameraMove / CameraRotate / CameraShake /
//   CameraSave, ParticleLoad / EmitterAdd* / ParticleDelete,
//   McssMoveXY / McssShake / McssScale / McssRotate / McssAlpha /
//   McssPalFade / McssPlayAnim, LoadBg / BgMove / BgWave / BgPalAnim,
//   PlaySE / PanSE / MoveSE / PlayCry, Wait / WaitFrames /
//   WaitExternal / WaitSide, Call / Return / Jump.
//
// HONEST LIMITS (do not remove):
// - Pokemon has NO per-creature hurt animation and NO per-creature
//   attack poses. Hurt is one generic treatment, attack is one script
//   per MOVE from shared parts, and the battler sprite never changes
//   pose in Pokemon. Our per-creature poses are Mochiichao inventions
//   layered ON TOP (see LAYER-ORDER.md); this file is the generic floor.
// - FireRed has NO camera. Camera commands below are the Black 2
//   model (preset -> move -> shake -> save/restore, locked during
//   effects). A script that uses camera ops is Black 2-style, not
//   FireRed-style; the interpreter accepts both vocabularies and
//   tags camera events as such in the log.
// - Hitstop (90 ms freeze) is a MOCHIIChAO ADDITION, not a Pokemon
//   copy (neither Gen 3 nor Gen 5 has a freeze-frame primitive).
//   It is NOT inside these Pokemon-faithful scripts. It lives in
//   treatments/battleTreatments.js (IMPACT_HOLD_MS = 90) and may be
//   applied by the game AFTER a script's impact beat, never by
//   rewriting a script here.
// - Timing is frame-counted at 60 fps, as in both decomps.
//   1 frame = ~16.7 ms. `delay N` is N frames. There is no
//   millisecond timing inside a Pokemon-faithful script.
//
// PARTICLE BUDGET (Black 2, btlv_effvm.c:59-61):
//   particles[16] — at most 16 particle systems live at once.
//   This interpreter ENFORCES it: a createsprite/emitter spawn that
//   would exceed 16 live systems is DROPPED and logged as
//   `particle_budget_full`. It never silently exceeds the budget,
//   and it never evicts a live system (Pokemon does not do that;
//   scripts are authored to fit).
//
// Script format (JSON, produced by generate_move_scripts.py):
//   { "move": "POUND", "source": [...], "template": "physical_contact",
//     "steps": [ { "op": "call", "sub": "sub_Impact", "args": {...} }, ... ] }
// A step's `op` is one of the COMMANDS below. `call` expands a named
// subroutine from SUBROUTINES (shared, never duplicated inline).
// `variant` scripts (two-turn moves) carry "variants": { charge: [...],
// unleash: [...] } and the runner picks one via options.variant.
//
// The interpreter is synchronous and deterministic: it walks the
// timeline, advances a frame clock, and returns a timed event log.
// No DOM, no audio, no real-time waits — the game replays the log
// on its own clock. No Math.random anywhere in this file.

'use strict';

const FPS = 60;
const MAX_LIVE_PARTICLES = 16; // Black 2 VM budget, enforced.
const FRAME_MS = 1000 / FPS;

// ------------------------------------------------------------------
// Command catalogue. Every op the interpreter understands, with its
// Pokemon source. Unknown ops are logged as errors, never ignored
// silently, so a bad generated script fails loudly in the demo.
// ------------------------------------------------------------------
const COMMANDS = Object.freeze({
  // FireRed core
  loadspritegfx: 'FR: load particle gfx tag',
  createsprite: 'FR: spawn particle sprite template on a battler',
  createvisualtask: 'FR: start a battler-movement task (ShakeMon, lunge, ...)',
  delay: 'FR: wait N frames (60 fps)',
  waitforvisualfinish: 'FR: block until all visual tasks finish (761 uses)',
  playse: 'FR: play sound effect',
  playsewithpan: 'FR: play SE panned to attacker or target',
  panse: 'FR: pan a looping SE attacker -> target over N frames',
  loopsewithpan: 'FR: loop SE N times with frame spacing',
  stopsound: 'FR: stop sound',
  monbg: 'FR: put battler on its own BG layer',
  clearmonbg: 'FR: clear battler BG layer',
  changebg: 'FR: swap background',
  fadetobg: 'FR: fade to background',
  setarg: 'FR: set a script argument for a subroutine call',
  call: 'FR/BW2: call a named shared subroutine',
  goto: 'FR: jump to a script label (used only inside subroutine defs)',
  jumpif: 'FR jumpargeq / BW2 IfVarConst: branch on a variable',
  choosetwoturnanim: 'FR: pick charge/unleash variant by move turn',
  invisible: 'FR: hide battler',
  visible: 'FR: show battler',
  // Battler transforms (FR tasks + BW2 Mcss* commands, unified names)
  battler_move: 'BW2 McssMoveXY / FR TranslateMon: translate battler x/y',
  battler_shake: 'FR ShakeMon / BW2 McssShake: shake battler',
  battler_scale: 'BW2 McssScale / FR ScaleMonAndRestore',
  battler_rotate: 'BW2 McssRotate / FR RotateMonSpriteToSide',
  battler_alpha: 'BW2 McssAlpha: fade battler opacity',
  battler_flash: 'FR BlendBattleAnimPal / BW2 McssPalFade: palette flash',
  battler_mosaic: 'BW2 McssMosaic',
  battler_blink: 'BW2 McssBlink',
  battler_vanish: 'BW2 McssSetVanish',
  battler_playanim: 'BW2 McssPlayAnim: play a model anim (3D only; 2D = no-op note)',
  battler_circle: 'BW2 McssCircle: orbit battler',
  // Black 2 particles (emitter model)
  emitter_add: 'BW2 EmitterAdd: add a particle emitter at a battler',
  emitter_add_at: 'BW2 EmitterAddAt: add emitter at absolute offset',
  emitter_move: 'BW2 EmitterMove: move an emitter over frames',
  emitter_orbit: 'BW2 OrbitEmitters: orbit emitters around a battler',
  particle_delete: 'BW2 ParticleDelete: free a particle system',
  // Black 2 background / stage
  bgeffect: 'BW2 LoadBg/BgMove/BgWave/BgPalAnim: BG motion or palette anim',
  // Black 2 camera (NO FireRed equivalent — see header note)
  camera_preset: 'BW2 CameraMovePreset: jump camera to a named preset',
  camera_move: 'BW2 CameraMove: move camera over frames + wait + brake',
  camera_rotate: 'BW2 CameraRotate',
  camera_shake: 'BW2 CameraShake: stepped shake, dir/amplitude/frames/count',
  camera_save: 'BW2 CameraSave: save camera pos/target',
  camera_restore: 'BW2: restore saved camera (cameraReset at effect end)',
  // Flow / sync (BW2 Wait family + FR waitforvisualfinish)
  waitframes: 'BW2 WaitFrames: wait N frames',
  waitexternal: 'BW2 WaitExternal: wait for an external system',
  end: 'FR/BW2: end of script',
});

// Visual-task durations in frames, from the research file:
// ShakeMon 3px x 6 toggles x 1-frame delay ~= 12 frames; lunge 6;
// generic flash 16 (Swords Dance flash task); terrain shake 12.
// Tasks run concurrently with the script clock; waitforvisualfinish
// advances the clock to the latest task end.
const TASK_DURATIONS = Object.freeze({
  ShakeMon: 12,
  ShakeMon2: 12,
  ShakeMonInPlace: 12,
  ShakeAndSinkMon: 20,
  HorizontalLunge: 6,
  WindUpLunge: 10,
  TranslateMonElliptical: 16,
  SwayMon: 16,
  ScaleMonAndRestore: 12,
  RotateMonSpriteToSide: 10,
  TerrainShake: 12,
  HorizontalShake: 12,
  StatsChange: 16,
  BlendBattleAnimPal: 16,
  FlashAnimTagWithColor: 16,
  SlideOffScreen: 20,
});

// ------------------------------------------------------------------
// Shared subroutine library. Scripts call these BY NAME; the steps
// below are the single definition. This mirrors FireRed's 104 shared
// subroutines / 547 call references (research §1A).
// Args are per-call overrides; defaults are the Pokemon-common values.
// ------------------------------------------------------------------
const SUBROUTINES = Object.freeze({
  // General_MonHit (FR scripts line 10758): hit splat + ShakeMon +
  // waitforvisualfinish. The default hurt beat for every damaging move.
  sub_GeneralMonHit: Object.freeze([
    { op: 'createsprite', template: 'gBasicHitSplatSpriteTemplate', battler: 'target' },
    { op: 'createvisualtask', task: 'ShakeMon', battler: 'target', xPx: 3, yPx: 0, shakes: 6, frameDelay: 1 },
    { op: 'waitforvisualfinish' },
  ]),
  // The single hit splat particle, alone (for scripts that shake separately).
  sub_HitSplat: Object.freeze([
    { op: 'createsprite', template: 'gBasicHitSplatSpriteTemplate', battler: 'target' },
  ]),
  // Target shake, damage-scaled where the caller passes amplitude.
  // Pokemon rule (FR battle_anim_mon_movement.c:872-901):
  //   amplitude = power/12 or damage/12, clamped 1-16 px.
  // Callers pass `amplitudePx` already clamped; the interpreter
  // re-clamps defensively (see runScript).
  sub_ShakeTarget: Object.freeze([
    { op: 'createvisualtask', task: 'ShakeMon', battler: 'target', xPx: 3, yPx: 0, shakes: 6, frameDelay: 1 },
    { op: 'waitforvisualfinish' },
  ]),
  // Attacker lunge (FR Tackle: HorizontalLunge sprite + delay 6).
  sub_Lunge: Object.freeze([
    { op: 'createsprite', template: 'gHorizontalLungeSpriteTemplate', battler: 'attacker' },
    { op: 'delay', frames: 6 },
  ]),
  // Projectile: one element particle travels attacker -> target.
  // `particle` is set by the caller from the move's type
  // (e.g. ember / water / spark); `panse` slides the SE with it,
  // as Flamethrower does in FireRed.
  sub_Projectile: Object.freeze([
    { op: 'createsprite', template: 'gProjectileSpriteTemplate', battler: 'attacker', particle: 'generic' },
    { op: 'panse', se: 'SE_M_PROJECTILE', fromPan: 'attacker', toPan: 'target', frames: 8 },
    { op: 'delay', frames: 8 },
  ]),
  // Status puff: looping status particle on the target (FR 9-entry
  // status table pattern: poison / burn / sleep / paralysis / freeze /
  // confusion / infatuation / curse / nightmare — same slot, the
  // `status` arg picks the particle).
  sub_StatusPuff: Object.freeze([
    { op: 'createsprite', template: 'gStatusPuffSpriteTemplate', battler: 'target', status: 'generic' },
    { op: 'playsewithpan', se: 'SE_M_STATUS', pan: 'target' },
    { op: 'delay', frames: 12 },
    { op: 'waitforvisualfinish' },
  ]),
  // Stat change (FR General_StatsChange -> AnimTask_StatsChange):
  // arrows + flash + sound on the affected battler.
  sub_StatFlash: Object.freeze([
    { op: 'createvisualtask', task: 'StatsChange', battler: 'target' },
    { op: 'createvisualtask', task: 'BlendBattleAnimPal', battler: 'target' },
    { op: 'playsewithpan', se: 'SE_M_STAT_CHANGE', pan: 'target' },
    { op: 'waitforvisualfinish' },
  ]),
  // One multi-hit beat: alternating-side splat + shake, as
  // DoubleSlapLeft / DoubleSlapRight (-8 / +8 px). The caller repeats
  // this sub per hit; the `side` arg alternates left/right.
  sub_MultiHitBeat: Object.freeze([
    { op: 'createsprite', template: 'gBasicHitSplatSpriteTemplate', battler: 'target', xOff: 0, side: 'left' },
    { op: 'createvisualtask', task: 'ShakeMon', battler: 'target', xPx: 3, yPx: 0, shakes: 6, frameDelay: 1 },
    { op: 'waitforvisualfinish' },
  ]),
  // Faint: shared slide, no new frames (FR SpriteCB_FaintSlideAnim:
  // y2 += 5 per frame). The game frees the sprite afterwards.
  sub_FaintSlide: Object.freeze([
    { op: 'playse', se: 'SE_FAINT' },
    { op: 'createvisualtask', task: 'SlideOffScreen', battler: 'target', xPx: 0, yPx: 5 },
    { op: 'waitforvisualfinish' },
  ]),
  // Combined impact beat used by most damaging scripts:
  // SE (panned to target) + splat + shake + sync. Equivalent to
  // Pound's body, factored so scripts stay one `call` long.
  sub_Impact: Object.freeze([
    { op: 'playsewithpan', se: 'SE_M_DOUBLE_SLAP', pan: 'target' },
    { op: 'createsprite', template: 'gBasicHitSplatSpriteTemplate', battler: 'target' },
    { op: 'createvisualtask', task: 'ShakeMon', battler: 'target', xPx: 3, yPx: 0, shakes: 6, frameDelay: 1 },
    { op: 'waitforvisualfinish' },
  ]),
  // Drain/absorb orb travelling target -> attacker (FR AbsorptionOrb
  // template, 72 uses). Appended after the impact beat by drain moves.
  sub_DrainOrb: Object.freeze([
    { op: 'createsprite', template: 'gAbsorptionOrbSpriteTemplate', battler: 'target' },
    { op: 'delay', frames: 10 },
    { op: 'waitforvisualfinish' },
  ]),
  // Two-turn charge beat (FR choosetwoturnanim / BW2 variant blocks):
  // attacker gathers / glows, then the unleash variant runs.
  sub_ChargeUp: Object.freeze([
    { op: 'createvisualtask', task: 'BlendBattleAnimPal', battler: 'attacker' },
    { op: 'playsewithpan', se: 'SE_M_CHARGE', pan: 'attacker' },
    { op: 'delay', frames: 16 },
    { op: 'waitforvisualfinish' },
  ]),
});

// ------------------------------------------------------------------
// Interpreter
// ------------------------------------------------------------------
function clampShake(px) {
  // Pokemon damage-scaled shake clamp: 1-16 px (FR, 15 moves).
  if (typeof px !== 'number' || !isFinite(px)) return 3;
  if (px < 1) return 1;
  if (px > 16) return 16;
  return px;
}

// Merge call args into a subroutine step copy. Only keys already
// present on the step (or the documented overrides template/particle/
// status/side/xOff/amplitudePx/se) are overridden, so a bad arg key
// cannot invent a new field silently.
function applyArgs(step, args) {
  if (!args) return Object.assign({}, step);
  const out = Object.assign({}, step);
  for (const k of Object.keys(args)) {
    if (k in out || k === 'particle' || k === 'status' || k === 'side' ||
        k === 'xOff' || k === 'amplitudePx' || k === 'template') {
      out[k] = args[k];
    }
  }
  if (out.task === 'ShakeMon' && typeof out.amplitudePx === 'number') {
    out.xPx = clampShake(out.amplitudePx);
  }
  if (out.op === 'createsprite' && typeof out.particle === 'string') {
    out.template = 'g' + out.particle + 'SpriteTemplate';
  }
  return out;
}

// runScript(script, options) -> { events, stats, error }
//   script: { move, template, steps } or { move, variants: {charge, unleash} }
//   options: { variant: 'charge'|'unleash' (default 'unleash'),
//              attacker, target, power, damage, maxLiveSeen hook via stats }
// Events: { frame, ms, op, detail } in execution order. The frame clock
// only advances on delay/waitframes/task durations/waitforvisualfinish;
// instantaneous ops (SE, spawns) share the current frame, as in the
// real interpreters where a command runs in one interpreter tick.
function runScript(script, options) {
  const opts = options || {};
  const events = [];
  const state = {
    frame: 0,
    liveParticles: 0,
    maxLiveParticles: 0,
    particleSpawns: 0,
    particleDropped: 0,
    tasks: [], // { task, endFrame }
    cameraSaved: null,
    camera: 'default',
    ended: false,
    error: null,
  };
  const log = (op, detail) => {
    events.push(Object.freeze({
      frame: state.frame,
      ms: Math.round(state.frame * FRAME_MS),
      op,
      detail: detail || '',
    }));
  };
  const spawnParticle = (template, battler) => {
    if (state.liveParticles >= MAX_LIVE_PARTICLES) {
      state.particleDropped += 1;
      log('particle_budget_full', 'live=' + state.liveParticles + ' cap=16 template=' + template);
      return false;
    }
    state.liveParticles += 1;
    state.particleSpawns += 1;
    if (state.liveParticles > state.maxLiveParticles) {
      state.maxLiveParticles = state.liveParticles;
    }
    log('createsprite', template + ' on ' + battler + ' live=' + state.liveParticles);
    return true;
  };
  // Particles in Pokemon scripts are freed when their task finishes;
  // here a waitforvisualfinish also releases all live particles, and
  // particle_delete frees one explicitly. This keeps the budget honest
  // across a script instead of leaking to 16 on the first long script.
  const releaseAllParticles = () => {
    if (state.liveParticles > 0) {
      log('particles_released', 'count=' + state.liveParticles);
      state.liveParticles = 0;
    }
  };

  let steps = script.steps || [];
  if (script.variants) {
    const v = opts.variant === 'charge' ? 'charge' : 'unleash';
    steps = script.variants[v] || script.variants.unleash || [];
    log('variant', v);
  }
  if (opts.move) log('script_start', opts.move);

  // Expand `call` one level (subroutines never call subroutines in
  // this library, mirroring the flat FR call graph for these beats;
  // a nested call is logged as an error rather than recursed).
  const expanded = [];
  for (const step of steps) {
    if (step.op === 'call') {
      const sub = SUBROUTINES[step.sub];
      if (!sub) {
        state.error = 'unknown subroutine: ' + step.sub;
        log('error', state.error);
        break;
      }
      for (const s of sub) expanded.push(applyArgs(s, step.args));
    } else {
      expanded.push(step);
    }
  }

  for (const step of expanded) {
    if (state.ended) break;
    const op = step.op;
    if (!(op in COMMANDS) && op !== 'call') {
      state.error = 'unknown command: ' + op;
      log('error', state.error);
      break;
    }
    switch (op) {
      case 'loadspritegfx':
        log('loadspritegfx', String(step.tag || step.template || ''));
        break;
      case 'createsprite':
      case 'emitter_add':
      case 'emitter_add_at':
        spawnParticle(step.template || 'gGenericSpriteTemplate', step.battler || 'target');
        break;
      case 'emitter_move':
      case 'emitter_orbit':
        log(op, 'battler=' + (step.battler || 'target'));
        break;
      case 'particle_delete':
        if (state.liveParticles > 0) state.liveParticles -= 1;
        log('particle_delete', 'live=' + state.liveParticles);
        break;
      case 'createvisualtask': {
        const dur = TASK_DURATIONS[step.task] || 12;
        const end = state.frame + dur;
        state.tasks.push({ task: step.task, endFrame: end });
        log('createvisualtask', step.task + ' on ' + (step.battler || 'target') +
          ' xPx=' + clampShake(step.xPx !== undefined ? step.xPx : 3) +
          ' shakes=' + (step.shakes !== undefined ? step.shakes : 6) +
          ' durFrames=' + dur);
        break;
      }
      case 'delay':
      case 'waitframes': {
        const n = Math.max(0, Math.floor(step.frames || 0));
        state.frame += n;
        log(op, 'frames=' + n + ' -> frame ' + state.frame);
        break;
      }
      case 'waitforvisualfinish': {
        let latest = state.frame;
        for (const t of state.tasks) if (t.endFrame > latest) latest = t.endFrame;
        const waited = latest - state.frame;
        state.frame = latest;
        state.tasks = [];
        releaseAllParticles();
        log('waitforvisualfinish', 'waitedFrames=' + waited + ' -> frame ' + state.frame);
        break;
      }
      case 'waitexternal':
        log('waitexternal', String(step.system || ''));
        break;
      case 'playse':
        log('playse', String(step.se || ''));
        break;
      case 'playsewithpan':
        log('playsewithpan', String(step.se || '') + ' pan=' + (step.pan || 'target'));
        break;
      case 'panse':
        log('panse', String(step.se || '') + ' ' + (step.fromPan || 'attacker') + '->' + (step.toPan || 'target') + ' frames=' + (step.frames || 0));
        state.frame += Math.max(0, Math.floor(step.frames || 0));
        break;
      case 'loopsewithpan':
        log('loopsewithpan', String(step.se || '') + ' times=' + (step.times || 1));
        break;
      case 'stopsound':
        log('stopsound', '');
        break;
      case 'monbg':
      case 'clearmonbg':
      case 'changebg':
      case 'fadetobg':
      case 'bgeffect':
        log(op, String(step.bg || step.effect || step.battler || ''));
        break;
      case 'setarg':
        log('setarg', String(step.name || '') + '=' + String(step.value !== undefined ? step.value : ''));
        break;
      case 'jumpif':
        log('jumpif', String(step.condition || ''));
        break;
      case 'choosetwoturnanim':
        log('choosetwoturnanim', 'charge=' + (step.charge || '') + ' unleash=' + (step.unleash || ''));
        break;
      case 'invisible':
      case 'visible':
        log(op, step.battler || 'target');
        break;
      case 'battler_move':
      case 'battler_shake':
      case 'battler_scale':
      case 'battler_rotate':
      case 'battler_alpha':
      case 'battler_flash':
      case 'battler_mosaic':
      case 'battler_blink':
      case 'battler_vanish':
      case 'battler_circle': {
        const dur = Math.max(0, Math.floor(step.frames || 12));
        state.tasks.push({ task: op, endFrame: state.frame + dur });
        log(op, 'battler=' + (step.battler || 'target') + ' durFrames=' + dur);
        break;
      }
      case 'battler_playanim':
        // 2D sprites have no model anim; log the no-op honestly.
        log('battler_playanim', '2D-noop anim=' + (step.anim || ''));
        break;
      case 'camera_preset':
        state.camera = String(step.preset || 'default');
        log('camera_preset', 'preset=' + state.camera + ' (Black 2 style; FireRed has no camera)');
        break;
      case 'camera_move':
        state.frame += Math.max(0, Math.floor(step.frames || 0));
        log('camera_move', 'preset=' + (step.preset || '') + ' frames=' + (step.frames || 0) + ' -> frame ' + state.frame);
        break;
      case 'camera_rotate':
        log('camera_rotate', 'deg=' + (step.degrees || 0));
        break;
      case 'camera_shake': {
        const amp = clampShake(step.amplitudePx !== undefined ? step.amplitudePx : 3);
        state.frame += Math.max(0, Math.floor(step.frames || 0));
        log('camera_shake', 'dir=' + (step.dir || 'horizontal') + ' amplitudePx=' + amp + ' frames=' + (step.frames || 0) + ' count=' + (step.count || 1));
        break;
      }
      case 'camera_save':
        state.cameraSaved = state.camera;
        log('camera_save', 'saved=' + state.cameraSaved);
        break;
      case 'camera_restore':
        state.camera = state.cameraSaved || 'default';
        log('camera_restore', 'restored=' + state.camera);
        break;
      case 'goto':
        log('goto', String(step.label || ''));
        break;
      case 'end':
        state.ended = true;
        log('end', '');
        break;
      default:
        // Covered by the COMMANDS check above; kept for safety.
        log(op, JSON.stringify(step));
        break;
    }
  }
  if (!state.ended && !state.error) log('end', '(implicit)');
  return Object.freeze({
    events,
    stats: Object.freeze({
      totalFrames: state.frame,
      totalMs: Math.round(state.frame * FRAME_MS),
      maxLiveParticles: state.maxLiveParticles,
      particleSpawns: state.particleSpawns,
      particleDropped: state.particleDropped,
      error: state.error,
    }),
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FPS, FRAME_MS, MAX_LIVE_PARTICLES, COMMANDS, TASK_DURATIONS,
    SUBROUTINES, runScript, clampShake,
  };
}
