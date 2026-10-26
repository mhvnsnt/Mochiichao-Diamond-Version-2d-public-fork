// captureLoop.test.js — tests for captureLoop.js (GATED REVISION, 2026-10-25).
// Run: node --test captureLoop.test.js (from this directory, no
// "type": "module" package.json in scope — this file uses require).
// Deterministic: every roll injects an rng sequence.
//
// Gating (Mars, 2026-10-25 ~19:49 CDT, zone reframed ~19:51 CDT): ring
// capture works ONLY when the player has visited AND played the NEW
// arcade ring zone (NOT the Harbor City Safari/preserve) AND owns
// ring-capture items. The pre-existing ring tests below therefore pass
// a gated unlock; the new gate tests prove every ungated state cannot
// ring-capture while normal (orb / Luigi Cube) capture is unaffected.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  CAPTURE, lowLevelBonus, captureRateX, shakeThreshold, isGuaranteed,
  captureChance, rollCapture,
  isRingCaptureUnlocked, consumeRingItem,
  createRingCapture, addRingPoint, ringCloses, completeLoop,
  decayRingMeter, creatureStruggle,
} = require('./captureLoop.js');

const zeroRng = () => 0; // always passes a shake check
const oneRng = () => 0.999999; // always fails a shake check
// A fully gated unlock: zone visited + played + 3 ring items owned.
const GATED = () => ({ zoneVisited: true, zonePlayed: true, ringItems: 3 });
const squareLoop = (enc) => {
  for (const [x, y] of [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]) addRingPoint(enc, x, y);
};

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

test('ring (gated): short or open path does not close; closed loop fills meter', () => {
  const enc = createRingCapture({ creatureName: 'Mochii', unlock: GATED() });
  assert.equal(enc.ringAvailable, true);
  addRingPoint(enc, 0, 0); addRingPoint(enc, 1, 0); addRingPoint(enc, 0.2, 0.2);
  assert.equal(ringCloses(enc), false);
  // Square loop of side 2, returning to start: path 8, closure 0.
  const enc2 = createRingCapture({ creatureName: 'Razorgater', unlock: GATED() });
  squareLoop(enc2);
  assert.equal(ringCloses(enc2), true);
  const res = completeLoop(enc2, false);
  assert.equal(res.closed, true);
  assert.equal(res.available, true);
  assert.equal(res.meter, 25);
  assert.equal(res.captured, false);
  assert.equal(enc2.loopsCompleted, 1);
});

test('ring (gated): assist multiplies gain; 4 loops capture (assist: fewer)', () => {
  const enc = createRingCapture({ unlock: GATED() });
  const loop = () => { squareLoop(enc); return completeLoop(enc, true); };
  let res;
  for (let i = 0; i < 3; i++) res = loop();
  assert.equal(res.captured, true); // 37.5 x 3 = 112.5 -> capped 100
  assert.equal(enc.meter, 100);
});

test('ring (gated): decay drains meter; struggle drains + breaks path', () => {
  const enc = createRingCapture({ unlock: GATED() });
  squareLoop(enc);
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

test('ring (gated): completing a non-closed path changes nothing', () => {
  const enc = createRingCapture({ unlock: GATED() });
  addRingPoint(enc, 0, 0); addRingPoint(enc, 1, 0);
  const res = completeLoop(enc, false);
  assert.equal(res.closed, false);
  assert.equal(res.meter, 0);
});

test('gate: unlock requires visited AND played AND items owned', () => {
  assert.equal(isRingCaptureUnlocked(GATED()), true);
  assert.equal(isRingCaptureUnlocked(undefined), false);
  assert.equal(isRingCaptureUnlocked({}), false);
  assert.equal(isRingCaptureUnlocked({ zoneVisited: true, zonePlayed: true, ringItems: 0 }), false);
  assert.equal(isRingCaptureUnlocked({ zoneVisited: true, zonePlayed: false, ringItems: 3 }), false);
  assert.equal(isRingCaptureUnlocked({ zoneVisited: false, zonePlayed: true, ringItems: 3 }), false);
  assert.equal(isRingCaptureUnlocked({ zoneVisited: true, zonePlayed: true, ringItems: -1 }), false);
});

test('gate: every ungated state cannot ring-capture, even with a closed loop', () => {
  const ungated = [
    {}, // no unlock at all
    { zoneVisited: true, zonePlayed: false, ringItems: 3 }, // visited, never played
    { zoneVisited: false, zonePlayed: true, ringItems: 3 }, // played flag without visit
    { zoneVisited: true, zonePlayed: true, ringItems: 0 }, // unlocked zone, no items
  ];
  for (const unlock of ungated) {
    const enc = createRingCapture({ unlock });
    assert.equal(enc.ringAvailable, false, JSON.stringify(unlock));
    squareLoop(enc);
    assert.equal(ringCloses(enc), true, 'geometry still closes; the gate, not geometry, blocks');
    const res = completeLoop(enc, false);
    assert.equal(res.available, false);
    assert.equal(res.captured, false);
    assert.equal(res.meter, 0);
    assert.equal(enc.loopsCompleted, 0);
    assert.equal(enc.captured, false);
  }
});

test('gate: locked encounters never decay or struggle (no meter exists to move)', () => {
  const enc = createRingCapture({});
  decayRingMeter(enc, 5000);
  assert.equal(enc.meter, 0);
  const s = creatureStruggle(enc, zeroRng, 1);
  assert.equal(s.struggled, false);
  assert.equal(enc.meter, 0);
});

test('gate: ring-item consumption spends one item, never below zero, never when locked', () => {
  assert.equal(consumeRingItem(GATED()), 2);
  assert.equal(consumeRingItem({ zoneVisited: true, zonePlayed: true, ringItems: 1 }), 0);
  assert.equal(consumeRingItem({ zoneVisited: true, zonePlayed: true, ringItems: 0 }), 0);
  assert.equal(consumeRingItem({}), 0);
  assert.equal(consumeRingItem(undefined), 0);
});

test('gate: normal (orb / Luigi Cube) capture is unaffected by ring lock', () => {
  // No unlock anywhere near this path: the orb formula never consults it.
  const win = rollCapture(45, 'standard', zeroRng);
  assert.deepEqual(win, { success: true, shakes: 4 });
  assert.equal(captureChance(3, 'sure'), 1);
});
