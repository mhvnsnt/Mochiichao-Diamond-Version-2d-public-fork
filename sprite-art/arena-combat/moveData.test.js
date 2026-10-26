// moveData.test.js — tests for the PR #35 move-data correction batch.
// Run with: node --test moveData.test.js (from this directory).
// ESM: package.json declares "type": "module", so this file uses import
// (converted 2026-10-25 from require(); assertions unchanged — fourth
// file found with the same defect as the three named in the brief).
// Verbatim values below are the Black 2
// decomp extraction values already on main
// (src/lib/generated/decomp_black2_moves.json, 560 moves); the full
// field-for-field cross-check against that file, and the move-name vs
// species-name collision check (0/560), are recorded in
// CHECKPOINT-MOVEDATA-CORRECTION.md — these tests pin the properties
// the game relies on so a future edit cannot silently break them.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as md from './moveData.js';
import * as fan from './fanMechanics.js';

test('count: 560 moves, MOVE_COUNT agrees', () => {
  assert.equal(md.MOVES.length, 560);
  assert.equal(md.MOVE_COUNT, 560);
});

test('no duplicate ids or names; frozen entries', () => {
  assert.equal(new Set(md.MOVES.map((m) => m.id)).size, 560);
  assert.equal(new Set(md.MOVES.map((m) => m.name.toLowerCase())).size, 560);
  assert.ok(Object.isFrozen(md.MOVES[0]));
});

test('lookups: by id and by name (case-insensitive), unknown -> null', () => {
  assert.equal(md.getMoveById('tackle').name, 'Tackle');
  assert.equal(md.getMoveByName('TACKLE').id, 'tackle');
  assert.equal(md.getMoveByName('Flamethrower').id, 'flamethrower');
  assert.equal(md.getMoveById('nope'), null);
  assert.equal(md.getMoveByName(42), null);
});

test('verbatim spot checks (Black 2 extraction values)', () => {
  const tackle = md.getMoveByName('Tackle');
  assert.deepEqual(
    [tackle.type, tackle.category, tackle.power, tackle.accuracy, tackle.pp, tackle.priority],
    ['NORMAL', 'Physical', 50, 100, 35, 0]);
  const flame = md.getMoveByName('Flamethrower');
  assert.deepEqual(
    [flame.type, flame.category, flame.power, flame.accuracy, flame.pp],
    ['FIRE', 'Special', 95, 100, 15]);
  const protect = md.getMoveByName('Protect');
  assert.equal(protect.priority, 4); // Black 2 value (FireRed era: 3)
  const swift = md.getMoveByName('Swift');
  assert.equal(swift.neverMisses, true); // accuracy 101 = never-miss marker
  const tackle2 = md.getMoveByName('Tackle');
  assert.notEqual(tackle2.power, 35); // FireRed-era Tackle (35) never overwrites Black 2
});

test('shape vocabulary: every shape is in AIM_SHAPES, range/reach agree', () => {
  for (const m of md.MOVES) {
    assert.ok(md.AIM_SHAPES.includes(m.shape), `${m.name} shape ${m.shape}`);
    assert.equal(m.reachU, m.rangeU, `${m.name} reachU must alias rangeU`);
    assert.equal(m.rangeU, md.SHAPE_RANGE_U[m.shape], `${m.name} rangeU`);
  }
  const shapes = {};
  for (const m of md.MOVES) shapes[m.shape] = (shapes[m.shape] || 0) + 1;
  assert.deepEqual(shapes,
    { lane: 325, melee: 107, self: 81, zone: 20, beam: 19, dash: 6, wedge: 2 });
});

test('timing + frames uniform (treatments timeline) on every move', () => {
  for (const m of md.MOVES) {
    assert.deepEqual(
      [m.windupMs, m.strikeMs, m.followThroughMs, m.totalMs],
      [250, 90, 700, 1040]);
    assert.deepEqual(
      [m.startupFrames, m.activeFrames, m.recoveryFrames, m.totalFrames],
      [15, 5, 42, 62]);
    assert.equal(m.startupFrames + m.activeFrames + m.recoveryFrames, m.totalFrames);
  }
});

test('economy: arenaUses = max(5, round(pp*1.5))*2 on every move', () => {
  for (const m of md.MOVES) assert.equal(m.arenaUses, md.maxUsesFor(m));
  assert.equal(md.getMoveByName('Tackle').arenaUses, 106);
  assert.equal(md.getMoveByName('Hyper Beam').arenaUses, 16);
});

test('element mapping: 525 mapped, 35 unmapped (ICE + ROCK only)', () => {
  const unmapped = md.MOVES.filter((m) => !m.elementMappedToTrue);
  assert.equal(unmapped.length, 35);
  assert.deepEqual([...new Set(unmapped.map((m) => m.type))].sort(), ['ICE', 'ROCK']);
  assert.equal(md.movesByType('ICE').length, 20);
  assert.equal(md.movesByType('ROCK').length, 15);
  assert.equal(md.movesByElement('Flame').length, md.movesByType('FIRE').length);
});

test('FireRed join: 351 joined, 209 null (Black-2-only moves), never guessed', () => {
  const joined = md.MOVES.filter((m) => m.target !== null);
  const nulled = md.MOVES.filter((m) => m.target === null);
  assert.equal(joined.length, 351);
  assert.equal(nulled.length, 209);
  for (const m of nulled) {
    assert.equal(m.makesContact, null);
    assert.equal(m.effectChance, null);
    assert.equal(m.animScriptFirered, null);
  }
});

test('movePickScore honours real reach: distant melee collapses, lane holds', () => {
  const tackle = md.getMoveByName('Tackle'); // melee, reachU 1.2
  const ember = md.getMoveByName('Ember'); // lane, reachU 8
  const ctx = { distanceU: 6, hpFraction: 1, attackStat: 120, noise: 0 };
  const near = { distanceU: 1, hpFraction: 1, attackStat: 120, noise: 0 };
  const tackleFar = fan.movePickScore(tackle, ctx);
  const tackleNear = fan.movePickScore(tackle, near);
  assert.ok(tackleFar < tackleNear * 0.1,
    `melee beyond reach must fall to 0.05x, got far=${tackleFar} near=${tackleNear}`);
  const emberFar = fan.movePickScore(ember, ctx);
  assert.ok(emberFar > 0, 'lane move inside reach 8 keeps full score at distance 6');
  // Without reachU the scorer defaults to 99 and the melee collapse never fires:
  const noReach = Object.assign({}, tackle);
  delete noReach.reachU;
  assert.ok(fan.movePickScore(noReach, ctx) > tackleFar,
    'reachU field is what makes the falloff fire');
});

test('kinds use only the fanMechanics scoring vocabulary', () => {
  const kinds = new Set(md.MOVES.map((m) => m.kind));
  for (const k of kinds) {
    assert.ok(['damage', 'heal', 'rest', 'buff', 'status'].includes(k), `kind ${k}`);
  }
  assert.equal(md.getMoveByName('Recover').kind, 'heal');
  assert.equal(md.getMoveByName('Rest').kind, 'rest');
  assert.equal(md.getMoveByName('Swords Dance').kind, 'buff');
});
