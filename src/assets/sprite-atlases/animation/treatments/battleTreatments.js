// battleTreatments.js — Mochiichao hit-presentation treatments (LOCAL DRAFT, 2026-10-25)
// No game imports. No DOM. No Math.random in the sampled path: every
// function below is deterministic for a given input, so the same hit
// replays identically and the Node test can pin exact numbers.
// The game (React/Vite app) is expected to IMPORT these constants and
// functions at wiring time, not copy their values into a second list.
//
// What this is: the code half of Mars's 2026-10-25 "BOTH" order. Hurt ART
// (sprite-art/animation/hurt/) shows the creature flinching; this module
// shows the HIT landing — flash, recoil translation, screen shake,
// particle burst, camera push-in, and a held impact frame. Pokemon's
// classic presentation is a small sprite jitter/shake; this goes past it
// the way Colosseum-style staging does: the camera moves, the attacker
// pushes in, the impact frame HOLDS, and only then does the defender
// recoil back to its start position and recover.
//
// Movement-study note (Mars correction, 2026-10-25 ~18:58 CDT): literal
// movement timing and staging are studied from public gameplay and
// recreated here in original code. No binary animation file, model file,
// sprite, or music from any commercial game is lifted into this module
// or the repo. Observed staging beats that shaped the defaults:
//  - Colosseum-style staging (public reviews/footage discussion): the
//    camera and the attack animation mask the fact that the two models
//    never touch; a hit creature recoils and then returns to its start
//    position before the next action; camera cuts are per-move.
//  - Gen V onward: the camera zooms in on the affected creature when a
//    move lands.
//  - Classic 2D battle scripting (public fan-project documentation of
//    the Double Slap pattern): a short pre-impact pause (~8 frames),
//    a target-shake task plus a hit-flash graphic at impact, then a
//    longer hold (~20 frames) before the next beat. Our numbers below
//    are our own, tuned to that same beat shape, not copied code.
//  - Modern 2D arena fan projects (public devlogs): big moves FEEL big
//    through screen shake + shockwave + impact particles scaled to the
//    move, and a hit-stop freeze at impact. Same beat shape, ours.

'use strict';

// ---------------------------------------------------------------- constants
// All durations in milliseconds. FPS is the frame clock the game uses to
// convert durations to frames; the timeline is emitted in ms so the game
// can run it on any clock. 60 fps is the reference rate.

const FPS = 60;

// Phase durations. Order of a single hit, always:
//   windup -> impact hold (hit-stop) -> recoil -> recover
// The attacker camera push-in runs across windup + impact hold.
// The defender flash + particle burst fire at the START of impact hold.
const TIMING = Object.freeze({
  FPS,
  // Attacker telegraphs: leans / steps in. No defender motion yet.
  WINDUP_MS: 250,
  // Hit-stop: everything except the flash/particles freezes. This is the
  // beat that makes a hit read as a hit instead of a jitter.
  IMPACT_HOLD_MS: 90,
  // Defender is knocked back along the hit axis, hurt art shown.
  RECOIL_MS: 300,
  // Defender eases back to its start position (the Colosseum return beat).
  RECOVER_MS: 400,
  // Impact flash overlay on the defender (white, then red on crit).
  FLASH_MS: 100,
  // Whole-scene shake, decaying over this window.
  SHAKE_MS: 350,
  // Camera push-in on the attacker, then release during recover.
  CAMERA_PUSH_MS: 340,
  // Particle burst lifetime.
  PARTICLE_MS: 450,
});

// Severity is driven ONLY by damage dealt as a fraction of the defender's
// max HP, plus a crit flag. The game passes damageFraction; it never
// passes a severity string, so tuning stays in one place.
const SEVERITY = Object.freeze({
  LIGHT: Object.freeze({ maxFraction: 0.15, recoilPx: 10, shakePx: 2, flash: 'white', particles: 6, cameraPush: 1.04, label: 'light' }),
  MEDIUM: Object.freeze({ maxFraction: 0.35, recoilPx: 18, shakePx: 4, flash: 'white', particles: 12, cameraPush: 1.08, label: 'medium' }),
  HEAVY: Object.freeze({ maxFraction: 0.6, recoilPx: 28, shakePx: 7, flash: 'white', particles: 20, cameraPush: 1.14, label: 'heavy' }),
  // A crit, or a hit over 60% of max HP, gets the red flash + biggest push.
  CRITICAL: Object.freeze({ maxFraction: Infinity, recoilPx: 38, shakePx: 10, flash: 'red', particles: 28, cameraPush: 1.2, label: 'critical' }),
});

// Hurt-art display: the hurt frame is held for the whole recoil phase and
// the first half of recover, then crossfades to the standing frame.
const HURT_FRAME = Object.freeze({
  HOLD_MS: TIMING.RECOIL_MS + TIMING.RECOVER_MS / 2,
});

// ---------------------------------------------------------------- helpers
function clamp01(v) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

// Ease-out cubic: fast start, soft landing. Used for recoil + recover.
function easeOutCubic(t) {
  const u = clamp01(t);
  return 1 - Math.pow(1 - u, 3);
}

// Ease-in-out for the camera push (no snap at either end).
function easeInOutQuad(t) {
  const u = clamp01(t);
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

// Deterministic pseudo-random in [0, 1) from a seed + index. No Math.random:
// replays and tests must be bit-stable. (Mulberry-style hash, inlined.)
function deterministicUnit(seed, index) {
  let h = (seed * 374761393 + index * 668265263) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = (h * 1274126177) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

// ---------------------------------------------------------------- severity
function severityFor(damageFraction, isCrit) {
  const f = typeof damageFraction === 'number' && isFinite(damageFraction) ? Math.max(0, damageFraction) : 0;
  if (isCrit || f > SEVERITY.HEAVY.maxFraction) return SEVERITY.CRITICAL;
  if (f <= SEVERITY.LIGHT.maxFraction) return SEVERITY.LIGHT;
  if (f <= SEVERITY.MEDIUM.maxFraction) return SEVERITY.MEDIUM;
  return SEVERITY.HEAVY;
}

// ---------------------------------------------------------------- timeline
// buildHitTimeline returns the full ordered beat list for one hit.
// direction: +1 means the defender is knocked to the right, -1 to the
// left (the game picks it from attacker/defender positions; the module
// never assumes a side). seed: any integer; particles derive from it.
// Camera focus (2026-10-25 wiring pass): the push-in is ON THE
// ATTACKER, not on the defender and not on the scene centre. The
// timeline therefore carries camera.focus = 'attacker' explicitly, so
// wiring can target the attacker container / arena camera subject
// instead of guessing from a bare zoom scalar.
function buildHitTimeline(options) {
  const opts = options || {};
  const sev = severityFor(opts.damageFraction, !!opts.isCrit);
  const dir = opts.direction === -1 ? -1 : 1;
  const seed = typeof opts.seed === 'number' ? Math.floor(opts.seed) : 1;
  const t0 = 0;
  const tImpact = t0 + TIMING.WINDUP_MS;
  const tRecoilEnd = tImpact + TIMING.IMPACT_HOLD_MS + TIMING.RECOIL_MS;
  const tEnd = tRecoilEnd + TIMING.RECOVER_MS;
  return Object.freeze({
    severity: sev.label,
    flash: sev.flash,
    direction: dir,
    totalMs: tEnd,
    phases: Object.freeze([
      Object.freeze({ phase: 'windup', startMs: t0, endMs: tImpact, cameraPush: sev.cameraPush }),
      Object.freeze({ phase: 'impact_hold', startMs: tImpact, endMs: tImpact + TIMING.IMPACT_HOLD_MS, flash: sev.flash, flashMs: TIMING.FLASH_MS }),
      Object.freeze({ phase: 'recoil', startMs: tImpact + TIMING.IMPACT_HOLD_MS, endMs: tRecoilEnd, recoilPx: sev.recoilPx, direction: dir, hurtFrameHeld: true }),
      Object.freeze({ phase: 'recover', startMs: tRecoilEnd, endMs: tEnd, hurtFrameHeldUntilMs: tImpact + TIMING.IMPACT_HOLD_MS + HURT_FRAME.HOLD_MS }),
    ]),
    shake: Object.freeze({ startMs: tImpact, durationMs: TIMING.SHAKE_MS, amplitudePx: sev.shakePx }),
    particles: buildParticleBurst({ count: sev.particles, seed, startMs: tImpact, direction: dir }),
    camera: Object.freeze({ focus: 'attacker', subject: 'attacker', pushStartMs: t0, pushEndMs: t0 + TIMING.CAMERA_PUSH_MS, zoom: sev.cameraPush, releaseEndMs: tEnd }),
  });
}

// ---------------------------------------------------------------- sampling
// sampleHitPose(tMs, timeline) -> the per-frame render state at time t.
// The game applies: defender sprite offset/rotation/flash, scene shake,
// camera zoom. Returns zeros / identity outside the hit window.
function sampleHitPose(tMs, timeline) {
  const t = typeof tMs === 'number' ? tMs : 0;
  const tl = timeline || buildHitTimeline({});
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const impact = TIMING.WINDUP_MS;
  const recoilStart = impact + TIMING.IMPACT_HOLD_MS;
  const recoilEnd = recoilStart + TIMING.RECOIL_MS;
  const end = recoilEnd + TIMING.RECOVER_MS;

  // Defender offset along the hit axis (px, in game units at 1x scale).
  let offsetX = 0;
  let offsetY = 0;
  let rotationDeg = 0;
  if (t >= recoilStart && t < recoilEnd) {
    const p = easeOutCubic((t - recoilStart) / TIMING.RECOIL_MS);
    offsetX = tl.direction * sev.recoilPx * p;
    offsetY = -2 * p; // tiny lift at full recoil, settles in recover
    rotationDeg = tl.direction * 4 * p; // lean away from the hit
  } else if (t >= recoilEnd && t < end) {
    const p = easeOutCubic((t - recoilEnd) / TIMING.RECOVER_MS);
    offsetX = tl.direction * sev.recoilPx * (1 - p);
    offsetY = -2 * (1 - p);
    rotationDeg = tl.direction * 4 * (1 - p);
  }

  // Flash: full strength at impact, linear fade over FLASH_MS.
  const flash = t >= impact && t < impact + TIMING.FLASH_MS
    ? 1 - (t - impact) / TIMING.FLASH_MS : 0;

  // Camera zoom: ease in during windup+hold, hold, ease out in recover.
  let cameraZoom = 1;
  if (t < TIMING.CAMERA_PUSH_MS) {
    cameraZoom = 1 + (sev.cameraPush - 1) * easeInOutQuad(t / TIMING.CAMERA_PUSH_MS);
  } else if (t < recoilEnd) {
    cameraZoom = sev.cameraPush;
  } else if (t < end) {
    cameraZoom = sev.cameraPush - (sev.cameraPush - 1) * easeInOutQuad((t - recoilEnd) / TIMING.RECOVER_MS);
  }

  // Scene shake: decaying oscillation after impact, deterministic.
  const shake = shakeOffsetAt(t, tl);

  // Which defender art: hurt frame during recoil + first half of recover.
  const hurtUntil = recoilStart + HURT_FRAME.HOLD_MS;
  const defenderArt = t >= recoilStart && t < hurtUntil ? 'hurt' : 'standing';

  // Hit-stop: during impact hold the world (except flash/particles) freezes.
  const frozen = t >= impact && t < recoilStart;

  return Object.freeze({
    tMs: t, defenderOffsetX: offsetX, defenderOffsetY: offsetY,
    defenderRotationDeg: rotationDeg, flash, flashColor: sev.flash,
    cameraZoom, cameraFocus: 'attacker', shakeX: shake.x, shakeY: shake.y,
    defenderArt, frozen,
  });
}

// shakeOffsetAt: deterministic decaying shake. Zero before impact and
// after the shake window. Amplitude is the severity's shakePx.
function shakeOffsetAt(tMs, timeline) {
  const tl = timeline || buildHitTimeline({});
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const start = TIMING.WINDUP_MS;
  const t = (typeof tMs === 'number' ? tMs : 0) - start;
  if (t < 0 || t >= TIMING.SHAKE_MS) return Object.freeze({ x: 0, y: 0 });
  const decay = 1 - t / TIMING.SHAKE_MS;
  const phase = t / 16.7; // ~per-frame oscillation at 60 fps
  const x = sev.shakePx * decay * Math.sin(phase * 2.1);
  const y = sev.shakePx * 0.6 * decay * Math.cos(phase * 1.7);
  return Object.freeze({ x, y });
}

// buildParticleBurst: impact particles, deterministic from seed.
// Each particle: angle (rad), speed (px/s), size (px), lifeMs. The game
// spawns them at the impact point on the defender at startMs.
// Directional bias (2026-10-25 wiring pass, research §6.2: particles
// must mark DIRECTION and type, not just "damage"): when options.
// direction is +1/-1, angles are pulled halfway toward the hit axis
// (0 rad for +1, PI for -1), so the burst fans forward off the defender
// instead of spraying isotropically. Calls without direction keep the
// old uniform radial burst bit-for-bit, so existing seeds still replay.
function buildParticleBurst(options) {
  const opts = options || {};
  const count = Math.max(0, Math.floor(opts.count || 0));
  const seed = typeof opts.seed === 'number' ? Math.floor(opts.seed) : 1;
  const startMs = opts.startMs || 0;
  const dir = opts.direction === -1 ? -1 : (opts.direction === 1 ? 1 : 0);
  const dirAngle = dir === -1 ? Math.PI : 0;
  const out = [];
  for (let i = 0; i < count; i++) {
    let a = deterministicUnit(seed, i * 3) * Math.PI * 2;
    if (dir !== 0) {
      let diff = a - dirAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      a = dirAngle + diff * 0.5;
    }
    const speed = 60 + deterministicUnit(seed, i * 3 + 1) * 180;
    const size = 2 + deterministicUnit(seed, i * 3 + 2) * 4;
    out.push(Object.freeze({
      index: i, angleRad: a, speedPxPerSec: speed, sizePx: size,
      lifeMs: TIMING.PARTICLE_MS, startMs,
    }));
  }
  return Object.freeze(out);
}

// ---------------------------------------------------------------- 3D mapping
// mapTo3D(timeline, pose) converts the SAME timeline + sampled 2D pose
// into rig-space values for arena-mode rigged models (Dorowani / Gabu).
// This is NOT a second system: one timeline, two renderings of it.
//   rootOffset: root-bone translation along the hit axis (metres in rig
//     space; the game scales px -> rig units, 1 px = 0.01 rig units here,
//     documented so wiring uses one scale, not a guessed second one).
//   AXIS NOTE (2026-10-25, proven against the live Dorowani/Gabu rigs:
//     rig Y is UP — hips at y≈0.82-0.92, spine chain climbing +Y — while
//     2D screen Y is DOWN. rootOffsetY is therefore NEGATED here, so the
//     2 px screen "lift" stays a lift in rig space instead of a dip.
//     spineLeanDeg keeps its 2D rotation sign in this return value; the
//     arena renderer negates it when applying a Z-rotation in Y-up space
//     so the spine top follows the displacement (see PROOF-3D.md).
//   spineLeanDeg / headPitchDeg: bone-space recoil (lean away + head snap).
//   cameraDolly: metres the arena camera pushes toward the attacker.
//   hurtPoseWeight: 0..1 blend into the rig's hurt pose (1 = full hurt).
function mapTo3D(timeline, pose) {
  const tl = timeline || buildHitTimeline({});
  const p = pose || sampleHitPose(0, tl);
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const pxToRig = 0.01;
  const recoilFrac = sev.recoilPx === 0 ? 0 : Math.abs(p.defenderOffsetX) / sev.recoilPx;
  return Object.freeze({
    rootOffsetX: p.defenderOffsetX * pxToRig,
    rootOffsetY: -p.defenderOffsetY * pxToRig, // screen Y down -> rig Y up
    spineLeanDeg: p.defenderRotationDeg * 2.5, // rigs read lean bigger than sprites
    headPitchDeg: p.defenderArt === 'hurt' ? -12 * recoilFrac - 4 : 0,
    cameraDollyM: (p.cameraZoom - 1) * 2.0, // zoom 1.20 -> 0.40 m push
    cameraFocus: 'attacker',
    hurtPoseWeight: p.defenderArt === 'hurt' ? 1 : 0,
    flash: p.flash, flashColor: p.flashColor,
    frozen: p.frozen,
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FPS, TIMING, SEVERITY, HURT_FRAME,
    severityFor, buildHitTimeline, sampleHitPose, shakeOffsetAt,
    buildParticleBurst, mapTo3D,
    _internals: { clamp01, easeOutCubic, easeInOutQuad, deterministicUnit },
  };
}
