// captureLoop.test.js — tests for captureLoop.js
// Run: node --test captureLoop.test.js (from this directory)
// Deterministic: every roll injects an rng sequence.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  CAPTURE, lowLevelBonus, captureRateX, shakeThreshold, isGuaranteed,
  captureChance, rollCapture,
  createRingCapture, addRingPoint, ringCloses, completeLoop,
  decayRingMeter, creatureStruggle,
} = require('./captureLoop.js');

const seqRng = (vals) => { let i = 0; return () => vals[i++ % vals.length]; };
const zeroRng = () => 0; // always passes a shake check
const oneRng = () => 0.999999; // always fails a shake check

test('low-level bonus: level 5 -> 2.5x, level 21+ -> 1x', () => {
  assert.equal(lowLevelBonus(5), 2.5);
  assert.equal(lowLevelBonus(20), 1);
  assert.equal(lowLevelBonus(50), 1);
});

test('captureRateX: full HP + standard orb + species 45 -> 15 (rate/3 at full HP)', () => {
  assert.equal(captureRateX(100, 100, 45, 'standard', 50), 15);
  assert.ok(captureRateX(100, 1, 45, 'standard', 50) > 15);
  assert.equal(captureRateX(100, 100, 45, 'prime', 50), 30);
  assert.equal(captureRateX(100, 100, 45, 'standard', 5), 15 * 2.5);
});

test('shake threshold + chance: X=255 -> Y=65536 -> chance 1 (non-sure path)', () => {
  assert.equal(shakeThreshold(255), 65536);
  assert.equal(captureChance(255, 'standard'), 1);
  assert.ok(captureChance(45, 'standard') > 0 && captureChance(45, 'standard') < 1);
  // Orb multipliers act at the rate step: a prime orb's X beats a
  // standard orb's X at the same HP, so its chance is higher.
  const xStd = captureRateX(100, 100, 45, 'standard', 50);
  const xPrime = captureRateX(100, 100, 45, 'prime', 50);
  assert.ok(captureChance(xPrime, 'prime') > captureChance(xStd, 'standard'));
  assert.equal(captureChance(3, 'sure'), 1);
  assert.equal(isGuaranteed(255, 'standard'), true);
  assert.equal(isGuaranteed(45, 'sure'), true);
  assert.equal(isGuaranteed(45, 'standard'), false);
});

test('rollCapture: zero rng captures in 4 shakes; failing rng captures 0', () => {
  const win = rollCapture(45, 'standard', zeroRng);
  assert.deepEqual(win, { success: true, shakes: 4 });
  const lose = rollCapture(45, 'standard', oneRng);
  assert.deepEqual(lose, { success: false, shakes: 0 });
  const sure = rollCapture(3, 'sure', oneRng);
  assert.deepEqual(sure, { success: true, shakes: 4 });
});

test('ring: short or open path does not close; closed loop fills meter', () => {
  const enc = createRingCapture({ creatureName: 'Mochii' });
  addRingPoint(enc, 0, 0); addRingPoint(enc, 1, 0); addRingPoint(enc, 0.2, 0.2);
  assert.equal(ringCloses(enc), false);
  // Square loop of side 2, returning to start: path 8, closure 0.
  const enc2 = createRingCapture({ creatureName: 'Razorgater' });
  for (const [x, y] of [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]) addRingPoint(enc2, x, y);
  assert.equal(ringCloses(enc2), true);
  const res = completeLoop(enc2, false);
  assert.equal(res.closed, true);
  assert.equal(res.meter, 25);
  assert.equal(res.captured, false);
  assert.equal(enc2.loopsCompleted, 1);
});

test('ring: assist multiplies gain; 4 loops capture (assist: fewer)', () => {
  const enc = createRingCapture({});
  const loop = () => { for (const [x, y] of [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]) addRingPoint(enc, x, y); return completeLoop(enc, true); };
  let res;
  for (let i = 0; i < 3; i++) res = loop();
  assert.equal(res.captured, true); // 37.5 x 3 = 112.5 -> capped 100
  assert.equal(enc.meter, 100);
});

test('ring: decay drains meter; struggle drains + breaks path', () => {
  const enc = createRingCapture({});
  for (const [x, y] of [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]) addRingPoint(enc, x, y);
  completeLoop(enc, false);
  assert.equal(enc.meter, 25);
  decayRingMeter(enc, 2000); // -10
  assert.equal(enc.meter, 15);
  addRingPoint(enc, 0, 0); addRingPoint(enc, 1, 0);
  const s = creatureStruggle(enc, zeroRng, 0.25); // rng 0 < 0.25 -> struggles
  assert.equal(s.struggled, true);
  assert.equal(enc.meter, 3); // 15 - 12
  assert.equal(enc.points.length, 0);
  const calm = creatureStruggle(enc, oneRng, 0.25);
  assert.equal(calm.struggled, false);
});

test('ring: completing a non-closed path changes nothing', () => {
  const enc = createRingCapture({});
  addRingPoint(enc, 0, 0); addRingPoint(enc, 1, 0);
  const res = completeLoop(enc, false);
  assert.equal(res.closed, false);
  assert.equal(res.meter, 0);
});
