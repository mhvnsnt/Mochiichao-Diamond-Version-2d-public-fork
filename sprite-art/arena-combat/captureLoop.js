// captureLoop.js — Mochiichao capture systems (LOCAL BUILD, 2026-10-25).
//
// TWO capture paths, kept separate on purpose:
//   A. Ring capture (Ranger-style spec, from public design concepts —
//      no pulled game was used): draw a loop around a wild creature;
//      each completed loop fills a capture meter; the creature
//      struggles and drains the meter; an assisting ally whose
//      affinity matches adds meter per loop. A full meter captures.
//   B. Orb-throw capture (Gen VIII documented formula, source noted
//      below): throw a capture orb; the orb shakes up to 4 times;
//      all 4 shakes capture. The formula is the public documented
//      form, reimplemented here in original code.
//
// Source note for path B: the modified-rate / shake-threshold /
// four-shake-chance shape follows the Gen VIII capturing formula as
// publicly documented by Dragonfly Cave (dragonflycave.com,
// mechanics/gen-viii-capturing), as cited by the fan project that
// first surfaced it in this lane's research. Status, terrain and
// badge factors are 1 in this implementation (not modelled).
// Low-level bonus: L = (30 - level) / 10 for level < 21, else 1.
//
// Generic vocabulary only: "creature", "capture orb", "capture ring".
// No franchise names, cries, art or audio anywhere in this file.
// No DOM, no game imports. Node-testable: node --test captureLoop.test.js

'use strict';

// ---------------------------------------------------------------- constants
const CAPTURE = Object.freeze({
  // Orb multipliers: standard x1, sturdy x1.5, prime x2; sure orbs
  // always capture and skip the formula.
  ORBS: Object.freeze({
    standard: Object.freeze({ mult: 1, sure: false }),
    sturdy: Object.freeze({ mult: 1.5, sure: false }),
    prime: Object.freeze({ mult: 2, sure: false }),
    sure: Object.freeze({ mult: 1, sure: true }),
  }),
  SHAKE_MAX: 65536,
  SHAKE_COUNT: 4,
  GUARANTEED_RATE: 255,
  LOW_LEVEL_CUTOFF: 21,
  // Ring capture defaults.
  RING_METER_MAX: 100,
  RING_LOOP_GAIN: 25,        // meter per completed loop, no assist
  RING_ASSIST_MULT: 1.5,     // matching-affinity ally assist
  RING_DECAY_PER_SEC: 5,     // meter decay while not looping
  RING_MIN_PATH_U: 6,        // a loop must be at least this long
  RING_CLOSURE_U: 0.8,       // end point must return this close to start
  RING_STRUGGLE_DRAIN: 12,   // meter lost when the creature struggles
});

// ---------------------------------------------------------------- path B: orb
function lowLevelBonus(level) {
  const lv = typeof level === 'number' ? level : 50;
  return lv < CAPTURE.LOW_LEVEL_CUTOFF ? (30 - lv) / 10 : 1;
}
// Modified capture rate X from HP fraction, species rate, orb and level.
function captureRateX(maxHp, hp, speciesRate, orbId, level) {
  const orb = CAPTURE.ORBS[orbId] || CAPTURE.ORBS.standard;
  const max = maxHp > 0 ? maxHp : 1;
  const cur = Math.max(0, Math.min(max, typeof hp === 'number' ? hp : max));
  return (((3 * max - 2 * cur) * speciesRate * orb.mult) / (3 * max))
    * lowLevelBonus(level);
}
// Shake threshold Y = floor(65536 / (255 / X)^(3/16)).
function shakeThreshold(x) {
  const safe = Math.max(x, 1e-9);
  return Math.floor(CAPTURE.SHAKE_MAX / Math.pow(255 / safe, 3 / 16));
}
function isGuaranteed(x, orbId) {
  const orb = CAPTURE.ORBS[orbId] || CAPTURE.ORBS.standard;
  return orb.sure || x >= CAPTURE.GUARANTEED_RATE;
}
// Total capture chance: all 4 shakes must pass, (Y/65536)^4.
function captureChance(x, orbId) {
  if (isGuaranteed(x, orbId)) return 1;
  return Math.pow(Math.min(1, shakeThreshold(x) / CAPTURE.SHAKE_MAX), CAPTURE.SHAKE_COUNT);
}
// Roll one throw: how many shakes pass (0–4) and whether captured.
// rng is injected so tests are deterministic; default is Math.random.
function rollCapture(x, orbId, rng) {
  if (isGuaranteed(x, orbId)) return Object.freeze({ success: true, shakes: 4 });
  const y = shakeThreshold(x);
  const r = typeof rng === 'function' ? rng : Math.random;
  let shakes = 0;
  while (shakes < CAPTURE.SHAKE_COUNT && Math.floor(r() * CAPTURE.SHAKE_MAX) < y) shakes += 1;
  return Object.freeze({ success: shakes === CAPTURE.SHAKE_COUNT, shakes });
}

// ---------------------------------------------------------------- path A: ring
function createRingCapture(options) {
  const o = options || {};
  return {
    creatureName: typeof o.creatureName === 'string' ? o.creatureName : 'wild creature',
    meter: 0,
    meterMax: typeof o.meterMax === 'number' ? o.meterMax : CAPTURE.RING_METER_MAX,
    loopGain: typeof o.loopGain === 'number' ? o.loopGain : CAPTURE.RING_LOOP_GAIN,
    assistMult: CAPTURE.RING_ASSIST_MULT,
    decayPerSec: typeof o.decayPerSec === 'number' ? o.decayPerSec : CAPTURE.RING_DECAY_PER_SEC,
    loopsCompleted: 0,
    captured: false,
    brokeFreeCount: 0,
    points: [],       // current in-progress ring path
    pathLengthU: 0,
  };
}
function addRingPoint(enc, x, y) {
  if (!enc || enc.captured) return enc;
  const pts = enc.points;
  if (pts.length > 0) {
    const last = pts[pts.length - 1];
    enc.pathLengthU += Math.hypot(x - last.x, y - last.y);
  }
  pts.push({ x, y });
  return enc;
}
// A ring closes when the path returns near its start AND is long
// enough to plausibly encircle a creature. Pure check; completing
// the loop is a separate call so the game can stage the close.
function ringCloses(enc) {
  if (!enc || enc.points.length < 3) return false;
  const first = enc.points[0];
  const last = enc.points[enc.points.length - 1];
  return enc.pathLengthU >= CAPTURE.RING_MIN_PATH_U
    && Math.hypot(last.x - first.x, last.y - first.y) <= CAPTURE.RING_CLOSURE_U;
}
// Complete a closed loop: fill the meter (assist multiplies the
// gain), count the loop, clear the path. A full meter captures.
function completeLoop(enc, assist) {
  if (!enc || enc.captured) return Object.freeze({ captured: false, meter: enc ? enc.meter : 0, loops: 0 });
  if (!ringCloses(enc)) {
    return Object.freeze({ captured: false, meter: enc.meter, loops: enc.loopsCompleted, closed: false });
  }
  const gain = enc.loopGain * (assist ? enc.assistMult : 1);
  enc.meter = Math.min(enc.meterMax, enc.meter + gain);
  enc.loopsCompleted += 1;
  enc.points = [];
  enc.pathLengthU = 0;
  if (enc.meter >= enc.meterMax) enc.captured = true;
  return Object.freeze({
    captured: enc.captured, meter: enc.meter,
    loops: enc.loopsCompleted, closed: true, gain,
  });
}
// Meter decay over time while the player is not looping.
function decayRingMeter(enc, dtMs) {
  if (!enc || enc.captured) return enc;
  enc.meter = Math.max(0, enc.meter - enc.decayPerSec * (dtMs / 1000));
  return enc;
}
// Creature struggle: on a struggle roll the creature drains meter
// and breaks the in-progress ring (path cleared). The roll is
// caller-injected (rng < struggleChance means it struggles).
function creatureStruggle(enc, rng, struggleChance) {
  if (!enc || enc.captured) return Object.freeze({ struggled: false, meter: enc ? enc.meter : 0 });
  const r = typeof rng === 'function' ? rng : Math.random;
  const chance = typeof struggleChance === 'number' ? struggleChance : 0.25;
  if (r() >= chance) return Object.freeze({ struggled: false, meter: enc.meter });
  enc.meter = Math.max(0, enc.meter - CAPTURE.RING_STRUGGLE_DRAIN);
  enc.points = [];
  enc.pathLengthU = 0;
  enc.brokeFreeCount += 1;
  return Object.freeze({ struggled: true, meter: enc.meter, brokeFreeCount: enc.brokeFreeCount });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CAPTURE,
    lowLevelBonus, captureRateX, shakeThreshold, isGuaranteed,
    captureChance, rollCapture,
    createRingCapture, addRingPoint, ringCloses, completeLoop,
    decayRingMeter, creatureStruggle,
  };
}
