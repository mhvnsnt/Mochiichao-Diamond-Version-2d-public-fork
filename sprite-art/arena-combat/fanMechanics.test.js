// fanMechanics.test.js — tests for fanMechanics.js
// Run: node --test fanMechanics.test.js (from this directory)
// ESM: package.json declares "type": "module", so this file uses import
// (converted 2026-10-25 from require(); assertions unchanged).
// No game imports, no DOM. Deterministic: rng is injected everywhere
// a test needs randomness.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FAN, createDashPool, useDash, regenDash,
  createEnergyPool, regenEnergy, spendEnergy, maxUses,
  speedUpsFromStat, knockbackDecay, separateBodies,
  aimAngle, homingTurn, projectileReach, dashReach,
  createAimState, updateAimError,
  aiMovement, createStrafeState, updateStrafe,
  movePickScore, pickBestMove, matchupScore, shouldSwitch,
  softenedTypeStep, hitFeedback,
  createGroundMark, tickGroundMarks, createZone, tickZone,
  suddenDeathMultiplier, sparringDodge, chosenDodge, applyDodgeToDamage,
} from './fanMechanics.js';

const seqRng = (vals) => { let i = 0; return () => vals[i++ % vals.length]; };

test('dash pool: 3 charges, spend decrements, regen restores one per 3 s', () => {
  const pool = createDashPool();
  assert.equal(pool.charges, 3);
  assert.ok(useDash(pool));
  assert.equal(pool.charges, 2);
  regenDash(pool, 3000);
  assert.equal(pool.charges, 3);
  // Empty pool refuses.
  useDash(pool); useDash(pool); useDash(pool);
  assert.equal(useDash(pool), null);
  regenDash(pool, 9000);
  assert.equal(pool.charges, 3);
});

test('energy: regen 12/s capped at max, spend refuses when short', () => {
  const pool = createEnergyPool();
  assert.equal(spendEnergy(pool, 50), true);
  assert.equal(pool.energy, 50);
  assert.equal(spendEnergy(pool, 60), false);
  regenEnergy(pool, 5000); // +60 -> capped at 100
  assert.equal(pool.energy, 100);
});

test('maxUses: floor 5, 1.5x then doubled', () => {
  assert.equal(maxUses(10), 30);
  assert.equal(maxUses(1), 10); // max(5, round(1.5)) * 2
  assert.equal(maxUses(0), 10);
});

test('speed compression: stat 30 -> 1.6 u/s, stat 143 -> 2.3 u/s, monotone', () => {
  assert.equal(speedUpsFromStat(30), 1.6);
  assert.ok(Math.abs(speedUpsFromStat(143) - 2.3) < 1e-9);
  assert.ok(speedUpsFromStat(60) > 1.6 && speedUpsFromStat(60) < 2.3);
});

test('knockback decay: exp(-7 dt), separation removes overlap', () => {
  assert.ok(Math.abs(knockbackDecay(100, 0.1) - 100 * Math.exp(-0.7)) < 1e-9);
  const out = separateBodies({ x: 0, y: 0 }, { x: 0.5, y: 0 }, 0.6, 0.6);
  assert.ok(Math.abs(Math.hypot(out.b.x - out.a.x, out.b.y - out.a.y) - 1.2) < 1e-9);
});

test('homing turn is clamped by turn rate; reach = speed x life', () => {
  assert.equal(homingTurn(0, Math.PI, 1, 0.5), 0.5);
  assert.equal(homingTurn(0, 0.2, 1, 0.5), 0.2);
  assert.equal(projectileReach(10, 2), 20);
  assert.equal(dashReach(2.5, 0.6, 0.6), 3.7);
});

test('aim error re-rolls on timer and stays within ±0.15 rad', () => {
  const st = createAimState(seqRng([0.9, 0.1, 0.9]));
  const e0 = updateAimError(st, 0);
  assert.ok(Math.abs(e0) <= 0.15);
  assert.equal(updateAimError(st, 100), e0); // before timer: unchanged
  const e1 = updateAimError(st, 10000);
  assert.ok(Math.abs(e1) <= 0.15);
});

test('aiMovement: approaches when far, retreats when close, strafes sideways', () => {
  const far = aiMovement({ me: { x: 0, y: 0 }, foe: { x: 10, y: 0 }, preferredRangeU: 4, strafeDir: 0 });
  assert.ok(far.x > 0.9 && Math.abs(far.y) < 0.01);
  const close = aiMovement({ me: { x: 0, y: 0 }, foe: { x: 1, y: 0 }, preferredRangeU: 4, strafeDir: 0 });
  assert.ok(close.x < -0.9);
  const strafe = aiMovement({ me: { x: 0, y: 0 }, foe: { x: 4, y: 0 }, preferredRangeU: 4, strafeDir: 1 });
  assert.ok(strafe.y > 0.3, 'strafe should push sideways, got ' + JSON.stringify(strafe));
  const dodge = aiMovement({
    me: { x: 0, y: 0 }, foe: { x: 4, y: 0 }, preferredRangeU: 4, strafeDir: 0,
    threats: [{ x: -5, y: 0.1, vx: 10, vy: 0, radius: 0.3 }], myRadiusU: 0.6,
  });
  assert.ok(Math.abs(dodge.y) > 0.3, 'threat dodge should push lateral, got ' + JSON.stringify(dodge));
});

test('move scoring: out-of-reach melee collapses, heal scores only when hurt', () => {
  const melee = { kind: 'damage', shape: 'melee', power: 90, typeStep: 1, sameType: false, reachU: 1 };
  const near = movePickScore(melee, { distanceU: 0.8, hpFraction: 1, attackStat: 120 });
  const far = movePickScore(melee, { distanceU: 10, hpFraction: 1, attackStat: 120 });
  assert.ok(far < near * 0.1, 'far melee should be ~0.05x, got ' + far + ' vs ' + near);
  const heal = { kind: 'heal' };
  assert.ok(movePickScore(heal, { hpFraction: 0.3 }) > 2);
  assert.equal(movePickScore(heal, { hpFraction: 0.9 }), 0);
  const best = pickBestMove([melee, heal], { distanceU: 0.8, hpFraction: 0.3, attackStat: 120 });
  assert.ok(best === 0 || best === 1, 'a move should be picked, got ' + best);
});

test('matchup + switch: bench beats active by margin -> switch', () => {
  const active = [{ power: 40, type: 'flame', sameType: false }];
  const bench = [{ power: 120, type: 'flame', sameType: true }];
  const foeMoves = [{ power: 40, type: 'leaf', sameType: false }];
  const a = matchupScore(active, foeMoves, 1, { flame: 1 }, { leaf: 1 });
  const b = matchupScore(bench, foeMoves, 1, { flame: 1 }, { leaf: 1 });
  assert.ok(b > a);
  assert.equal(shouldSwitch(a, b, 1.0), b > a + 1.0);
});

test('softened type steps: immune is 0.33, never 0', () => {
  assert.equal(softenedTypeStep('immune'), 0.33);
  assert.equal(softenedTypeStep(-2), 0.5);
  assert.equal(softenedTypeStep(-1), 0.75);
  assert.equal(softenedTypeStep(0), 1);
  assert.equal(softenedTypeStep(1), 1.33);
  assert.equal(softenedTypeStep(2), 1.66);
});

test('hit feedback: hitstop capped at 90 ms, big hits shake more', () => {
  const small = hitFeedback(10);
  const big = hitFeedback(200);
  assert.ok(small.hitstopMs < big.hitstopMs || big.hitstopMs === 90);
  assert.equal(big.hitstopMs, 90);
  assert.ok(big.shakePx > small.shakePx);
});

test('ground marks expire; zones fire once after delay, only in radius', () => {
  const marks = [createGroundMark('scorch', 0, 0, 1)];
  assert.equal(tickGroundMarks(marks, 3000).length, 0);
  const zone = createZone('scorch', 0, 0, 2, 500, { damage: 10 });
  assert.deepEqual(tickZone(zone, 400, [{ x: 0, y: 0 }]), []);
  const hits = tickZone(zone, 200, [{ x: 0, y: 0 }, { x: 9, y: 9 }]);
  assert.equal(hits.length, 1);
  assert.deepEqual(tickZone(zone, 1000, [{ x: 0, y: 0 }]), [], 'zone must fire once');
});

test('sudden death: 1x before 180 s, ramps after', () => {
  assert.equal(suddenDeathMultiplier(100), 1);
  assert.equal(suddenDeathMultiplier(180), 1);
  assert.ok(Math.abs(suddenDeathMultiplier(220) - 2) < 1e-9);
});

test('sparring dodge moves position only, never HP; chosen dodge negates damage', () => {
  const pool = createDashPool();
  const roll = sparringDodge(pool, 1, 0);
  assert.ok(roll);
  assert.equal(roll.hpDelta, 0);
  assert.equal(roll.visualOnly, true);
  const perfect = chosenDodge(1000, 900);
  assert.equal(perfect.perfect, true);
  assert.equal(perfect.dodged, true);
  assert.deepEqual(applyDodgeToDamage(40, perfect), { damage: 0, dodged: true, perfect: true });
  const late = chosenDodge(1000, 2000);
  assert.equal(late.dodged, false);
  assert.equal(applyDodgeToDamage(40, late).damage, 40);
  assert.equal(applyDodgeToDamage(40, null).damage, 40);
});

test('strafe state flips on timer', () => {
  const st = createStrafeState(seqRng([0.1, 0.9]));
  const d0 = updateStrafe(st, 0);
  assert.equal(updateStrafe(st, 100), d0);
  const d1 = updateStrafe(st, 10000);
  assert.ok(d1 === 1 || d1 === -1);
});
