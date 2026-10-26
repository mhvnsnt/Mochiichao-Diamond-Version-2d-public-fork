// followerWalk.test.js — tests for followerWalk.js (HANDOFF prototype).
// Run: node --test followerWalk.test.js (from this directory).
// ESM: package.json declares "type": "module", so this file uses import
// (converted 2026-10-25 from require(); assertions unchanged).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  facingFromDelta, facingTowardPlayer,
  createFollowerState, recordPlayerStep, trailTarget, updateFollowers,
} from './followerWalk.js';

// Walk the player right from (0,0) to (5,0), updating followers each step.
function walkRight(state, steps) {
  let px = 0;
  recordPlayerStep(state, 0, 0);
  for (let s = 0; s < steps; s++) {
    px += 1;
    recordPlayerStep(state, px, 0);
    updateFollowers(state, px, 0, 'right');
  }
  return px;
}

test('facing helpers: dominant axis wins, zero delta falls back', () => {
  assert.equal(facingFromDelta(1, 0), 'right');
  assert.equal(facingFromDelta(-1, 0), 'left');
  assert.equal(facingFromDelta(0, 1), 'down');
  assert.equal(facingFromDelta(0, -1), 'up');
  assert.equal(facingFromDelta(2, 1), 'right');
  assert.equal(facingFromDelta(0, 0), null);
  assert.equal(facingTowardPlayer(0, 0, 0, 0), 'down');
  assert.equal(facingTowardPlayer(3, 0, 0, 0), 'left');
});

test('trail target: follower 0 trails 1 step back, follower 1 trails 2', () => {
  const st = createFollowerState(2, 1);
  for (let x = 0; x <= 5; x++) recordPlayerStep(st, x, 0);
  assert.deepEqual(trailTarget(st, 0), { x: 4, y: 0 });
  assert.deepEqual(trailTarget(st, 1), { x: 3, y: 0 });
  const short = createFollowerState(1, 1);
  recordPlayerStep(short, 0, 0);
  assert.equal(trailTarget(short, 0), null);
});

test('followers walk the trail in party order and never share a tile', () => {
  const st = createFollowerState(2, 1);
  const px = walkRight(st, 5);
  assert.equal(px, 5);
  const [f0, f1] = st.followers;
  assert.ok(f0.x < 5 && f1.x < f0.x, 'slot 1 closest, slot 2 behind it: ' + JSON.stringify(st.followers));
  assert.notEqual(f0.x + ',' + f0.y, f1.x + ',' + f1.y);
  assert.notEqual(f0.x + ',' + f0.y, px + ',0');
  assert.equal(f0.facing, 'right');
});

test('idle follower faces the player', () => {
  const st = createFollowerState(1, 1);
  walkRight(st, 5);
  // Player stands still; follower keeps updating toward its target,
  // then idles facing the player (player is to its right).
  for (let i = 0; i < 6; i++) updateFollowers(st, 5, 0, 'right');
  const [f] = st.followers;
  assert.equal(f.facing, 'right');
  assert.ok(f.x < 5);
});

test('spacing parameter widens the trail gap', () => {
  const st = createFollowerState(1, 2);
  for (let x = 0; x <= 6; x++) recordPlayerStep(st, x, 0);
  assert.deepEqual(trailTarget(st, 0), { x: 4, y: 0 }); // 2 steps back from 6
});

test('path history is capped and duplicate steps are not recorded', () => {
  const st = createFollowerState(0, 1);
  for (let i = 0; i < 300; i++) recordPlayerStep(st, i, 0);
  assert.equal(st.path.length, 256);
  recordPlayerStep(st, 299, 0);
  assert.equal(st.path.length, 256);
});

test('zero followers is a safe no-op', () => {
  const st = createFollowerState(0, 1);
  recordPlayerStep(st, 1, 1);
  assert.deepEqual(updateFollowers(st, 1, 1, 'down'), []);
});
