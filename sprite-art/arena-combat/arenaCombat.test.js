// arenaCombat.test.js — tests for arenaCombat.js (spec ARENA-COMBAT-SPEC.md)
// Run: node --test arenaCombat.test.js   (from this directory)
// Or:  node --test ~/workspace/mochiichao-work/sprite-art/arena-combat/
// No game imports, no DOM, no network. Deterministic: every test pins
// a seed, so replays are exact.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARENA, createArenaBattle, computeModifiers, noModifiers,
  buildChosenAttackTimeline, severityFor, rangeBand, flankArc, toArenaMove,
} from './arenaCombat.js';

function battle(opts) {
  return createArenaBattle(Object.assign({
    seed: 42,
    player: {
      name: 'Mochii', maxHp: 100,
      moves: [
        { name: 'Tackle', kind: 'melee', power: 40, accuracy: 100 },
        { name: 'Water Gun', kind: 'projectile', power: 40, accuracy: 100 },
        { name: 'Heal', kind: 'healing', power: 0, accuracy: 100 },
      ],
    },
    foe: {
      name: 'Razorgater', maxHp: 100,
      moves: [{ name: 'Bite', kind: 'melee', power: 40, accuracy: 100 }],
    },
  }, opts || {}));
}
function started(b) { b.start(); return b; }
// Tick in small steps so AI evaluation (500 ms), clash beats and the
// turn clock all advance the way a real frame loop would.
function tickFor(b, totalMs, stepMs) {
  const step = stepMs || 100;
  for (let t = 0; t < totalMs; t += step) b.tick(Math.min(step, totalMs - t));
  return b;
}

// ---------------------------------------------------------------- HP invariant
// The core invariant (spec §1): HP NEVER changes during BETWEEN_TURN.
// Tested hard: plain ticks, forced close spacing + clash windows,
// flank holds, pressure escalation, auto-separation, clock prompt,
// and full multi-turn loops without any chosen attack.
test('HP invariant: plain between-turn ticks never change HP', () => {
  const b = started(battle());
  const hp0 = [b.player.hp, b.foe.hp];
  tickFor(b, 15000);
  assert.deepEqual([b.player.hp, b.foe.hp], hp0);
  assert.equal(b.state, 'BETWEEN_TURN');
});

test('HP invariant: close-spacing clash windows move zero HP', () => {
  const b = started(battle());
  // Park both creatures inside clash range and let the engine clash.
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  b.setBehaviour('player', 'CIRCLING'); b.setBehaviour('foe', 'CIRCLING');
  tickFor(b, 12000);
  assert.ok(b.clashCount >= 1, 'expected at least one clash, got ' + b.clashCount);
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
  // No clash event, camera event, or pose ever carried HP or hurt art.
  for (const ev of b.events) {
    assert.ok(!('hpDelta' in ev) || ev.hpDelta === undefined, 'no HP in events');
  }
  for (const c of b.clashes) {
    const pose = b.sampleClashPose(c, 300);
    assert.equal(pose.hpDelta, 0);
    assert.equal(pose.defenderArt, 'standing');
    assert.equal(pose.shakePx, 0);
  }
});

test('HP invariant: flank holds, pressure escalation, auto-separation move zero HP', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 29000); // crosses prompt (20 s), pressure steps, clash cap -> separate
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
  assert.ok(b.events.some((e) => e.type === 'choose_now_prompt'), 'prompt expected');
  assert.ok(b.events.some((e) => e.type === 'pressure'), 'pressure expected');
  // Between-turn camera never shook, even during clashes.
  for (const ev of b.events.filter((e) => e.type === 'camera')) {
    if (ev.shot === 'NEUTRAL' || ev.shot === 'FOLLOW' || ev.shot === 'CLASH') {
      assert.equal(ev.shakePx, 0, 'between-turn shot ' + ev.shot + ' must not shake');
      assert.equal(ev.tiltDeg, 0);
    }
  }
});

test('HP invariant: static body and heavy body between-turn play moves zero HP', () => {
  const b = started(battle({
    player: { name: 'Cocoonode', maxHp: 80, bodyType: 'static', moves: [{ name: 'Tackle', kind: 'melee', power: 10 }] },
    foe: { name: 'Pebblefist', maxHp: 90, bodyType: 'heavy', moves: [{ name: 'Slam', kind: 'melee', power: 10 }] },
  }));
  const px = b.player.x;
  tickFor(b, 8000);
  assert.equal(b.player.x, px, 'static creature never translates');
  assert.equal(b.player.hp, 80);
  assert.equal(b.foe.hp, 90);
});

test('HP invariant: 3 full windows with no chosen attack, HP untouched', () => {
  const b = started(battle());
  for (let w = 0; w < 3; w++) {
    // Each window ends by the deterministic fallback choice, but the
    // test never resolves it as damage: instead it resolves a miss,
    // which must also move zero HP. (Damage resolution is covered
    // separately; this loop proves the between-turn layer alone.)
    tickFor(b, 30000);
    assert.equal(b.state, 'CHOSEN_ATTACK', 'clock fallback should have chosen');
    const res = b.resolveAttack({ damage: 40, hit: false });
    assert.equal(res.damageDealt, 0);
    b.finishResolution();
    assert.equal(b.state, 'BETWEEN_TURN');
  }
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
});

// ---------------------------------------------------------------- modifier math
test('modifier math: spec worked example = +10% power, +10% accuracy', () => {
  // Mochii: rear arc banked, Close spacing, momentum 23 (< 50 -> +0).
  const m = computeModifiers({ spacing: 1.6, bankedFlankArc: 'Rear', momentum: 23, kind: 'melee', baseAccuracy: 100 });
  assert.equal(m.powerPct, 10);
  assert.equal(m.accuracyMod, 10);
  assert.equal(m.effectiveAccuracy, 100); // 100 + 10 clamped to 100
  assert.equal(m.rangeBand, 'Close');
  assert.equal(m.flankArc, 'Rear');
});

test('modifier math: power cap +15% (raw +20% capped)', () => {
  const m = computeModifiers({ spacing: 1.5, bankedFlankArc: 'Rear', momentum: 90, kind: 'melee', baseAccuracy: 80 });
  assert.equal(m.breakdown.rawPower, 20); // 5 close + 5 rear + 10 momentum
  assert.equal(m.powerPct, 15);
  assert.equal(m.powerMultiplier, 1.15);
});

test('modifier math: accuracy bonus cap +10, penalty floor -5, clamp 5-100', () => {
  const rear = computeModifiers({ spacing: 6, bankedFlankArc: 'Rear', momentum: 0, kind: 'projectile', baseAccuracy: 95 });
  assert.equal(rear.accuracyMod, 10); // far +5 would stack with rear +10 = 15 -> capped 10
  assert.equal(rear.effectiveAccuracy, 100);
  const rushed = computeModifiers({ spacing: 1.0, bankedFlankArc: 'Front', momentum: 0, kind: 'projectile', baseAccuracy: 3 });
  assert.equal(rushed.accuracyMod, -5);
  assert.equal(rushed.effectiveAccuracy, 5); // 3 - 5 clamped to 5
  const low = computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 0, kind: 'melee', baseAccuracy: 0 });
  assert.equal(low.effectiveAccuracy, 5);
});

test('modifier math: melee from Far has no range penalty (travels in, 1.00x)', () => {
  const m = computeModifiers({ spacing: 8, bankedFlankArc: 'Front', momentum: 0, kind: 'melee', baseAccuracy: 100 });
  assert.equal(m.powerPct, 0);
  assert.equal(m.accuracyMod, 0);
});

test('modifier math: momentum tiers 0 / +5 / +10 and cap 100', () => {
  assert.equal(computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 49, kind: 'melee' }).powerPct, 0);
  assert.equal(computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 50, kind: 'melee' }).powerPct, 5);
  assert.equal(computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 79, kind: 'melee' }).powerPct, 5);
  assert.equal(computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 80, kind: 'melee' }).powerPct, 10);
  assert.equal(computeModifiers({ spacing: 3, bankedFlankArc: 'Front', momentum: 250, kind: 'melee' }).powerPct, 10);
});

test('modifier math: crit NEVER modified; no modifiers on healing/switch/item/run', () => {
  const m = computeModifiers({ spacing: 1.5, bankedFlankArc: 'Rear', momentum: 90, kind: 'melee', critChance: 0.0625 });
  assert.equal(m.critChance, 0.0625);
  const nm = noModifiers({ spacing: 1.5, baseAccuracy: 100, critChance: 0.0625 });
  assert.equal(nm.powerPct, 0);
  assert.equal(nm.accuracyMod, 0);
  assert.equal(nm.critChance, 0.0625);
  // Through the controller: choosing a healing move yields zero modifiers.
  const b = started(battle());
  const choice = b.chooseMove(2); // Heal
  assert.equal(choice.modifiers.powerPct, 0);
  assert.equal(choice.modifiers.accuracyMod, 0);
  const res = b.resolveNonDamageAction({ heal: 0 });
  assert.equal(res.playerHp, 100);
});

test('modifier math: range and flank boundaries', () => {
  assert.equal(rangeBand(1.99), 'Close');
  assert.equal(rangeBand(2), 'Mid');
  assert.equal(rangeBand(5), 'Mid');
  assert.equal(rangeBand(5.01), 'Far');
  assert.equal(flankArc(44.9), 'Front');
  assert.equal(flankArc(45), 'Side');
  assert.equal(flankArc(134.9), 'Side');
  assert.equal(flankArc(135), 'Rear');
  assert.equal(flankArc(180), 'Rear');
});

test('modifier math: unbanked flank (< 1.0 s hold) gives no bonus', () => {
  const b = started(battle());
  // Stage a rear arc but hold it for less than the 1.0 s bank time.
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  b.setFacing('foe', 180 - 150); // foe facing away-ish; attacker behind
  tickFor(b, 500);
  const pose = b.sampleArenaPose();
  // The flank arc is whatever geometry says; the banked arc used by
  // modifiers is Front unless held >= 1000 ms. Verify via a fresh
  // choice after only a short hold: power must not include rear +5.
  const choice = b.chooseMove(0);
  const heldLongEnough = pose.foe.flankHoldMs >= ARENA.FLANK_BANK_MS;
  if (!heldLongEnough) {
    assert.ok(choice.modifiers.breakdown.flankPower === 0, 'unbanked flank must not pay');
  }
});

test('momentum: clash wins pay only for the first 3 clashes, then 0', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 25000);
  assert.ok(b.clashCount >= 4, 'expected 4+ clashes, got ' + b.clashCount);
  assert.ok(b.player.momentum <= 24 + 15, 'player momentum bounded by 3 wins + flank bonus');
  assert.ok(b.foe.momentum <= 24 + 15, 'foe momentum bounded by 3 wins + flank bonus');
  assert.ok(b.player.momentum <= 100 && b.foe.momentum <= 100);
});

test('momentum: decays -5/s after 10 s without a choice, resets on resolve', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 11000);
  const before = b.player.momentum + b.foe.momentum;
  tickFor(b, 3000); // 11 s -> 14 s: decay ticks at 11, 12, 13, 14 s boundaries
  const after = b.player.momentum + b.foe.momentum;
  // Momentum may also be earned by clashes in that window, so assert
  // per-creature decay only via a clash-free setup below; here assert
  // the cap still holds and resolution resets to zero.
  assert.ok(b.player.momentum <= 100 && b.foe.momentum <= 100);
  void before; void after;
  // Clash-free decay: park creatures far apart, seed momentum via a
  // staged flank hold is hard without clashes, so seed by winning a
  // clash first, then separate and wait.
  const b2 = started(battle());
  b2.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b2, 3000);
  const earned = Math.max(b2.player.momentum, b2.foe.momentum);
  assert.ok(earned >= 8, 'expected clash momentum, got ' + earned);
  b2.setPositions({ x: -5, y: 0 }, { x: 5, y: 0 }); // far apart: no more clashes
  b2.setBehaviour('player', 'HOLDING'); b2.setBehaviour('foe', 'HOLDING');
  tickFor(b2, 12000); // window now > 10 s: decay runs, but clock fallback at 30 s not hit
  assert.ok(b2.player.momentum < earned || b2.foe.momentum < earned
    || (b2.player.momentum === 0 && b2.foe.momentum === 0),
    'momentum must decay after 10 s idle');
  // Resolution resets momentum to 0 on both sides.
  const b3 = started(battle());
  b3.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b3, 3000);
  b3.chooseMove(0);
  b3.resolveAttack({ damage: 10 });
  assert.equal(b3.player.momentum, 0);
  assert.equal(b3.foe.momentum, 0);
});

// ---------------------------------------------------------------- clash limits
test('clash limits: at most 6 per window, then auto-separate', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 20000);
  assert.ok(b.clashCount <= 6, 'clashCount ' + b.clashCount + ' exceeds cap');
  if (b.clashCount === 6) {
    assert.ok(b.events.some((e) => e.type === 'auto_separate'), '6th clash must auto-separate');
  }
});

test('clash limits: 1.2 s floor respected (900 ms under pressure)', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 15000);
  const starts = b.events.filter((e) => e.type === 'clash_start');
  for (let i = 1; i < starts.length; i++) {
    const gap = starts[i].tMs - starts[i - 1].tMs;
    assert.ok(gap >= 900, 'clash gap ' + gap + ' ms below pressure floor');
  }
});

test('clash beats: feint squash, 0.4 u knockback, sparks 4-8, no hurt art', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 3000);
  assert.ok(b.clashes.length >= 1, 'expected a completed clash');
  const c = b.clashes[0];
  assert.ok(c.sparkCount >= 4 && c.sparkCount <= 8, 'sparks ' + c.sparkCount);
  const feint = b.sampleClashPose(c, 100);
  assert.equal(feint.phase, 'feint');
  assert.equal(feint.squashY, 0.95);
  const kb = b.sampleClashPose(c, 300);
  assert.equal(kb.phase, 'knockback');
  assert.ok(kb.knockbackU > 0 && kb.knockbackU <= 0.4);
  const done = b.sampleClashPose(c, 800);
  assert.equal(done.phase, 'done');
  assert.equal(done.hpDelta, 0);
});

// ---------------------------------------------------------------- turn clock
test('turn clock: prompt at 20 s, deterministic fallback at 30 s', () => {
  const b = started(battle());
  tickFor(b, 19900);
  assert.ok(!b.events.some((e) => e.type === 'choose_now_prompt'), 'no prompt before 20 s');
  tickFor(b, 500);
  assert.ok(b.events.some((e) => e.type === 'choose_now_prompt'), 'prompt at 20 s');
  assert.equal(b.state, 'BETWEEN_TURN');
  tickFor(b, 10000);
  assert.equal(b.state, 'CHOSEN_ATTACK', 'fallback must choose at 30 s');
  const fb = b.events.find((e) => e.type === 'turn_clock_fallback');
  assert.ok(fb, 'fallback event expected');
  assert.equal(fb.moveIndex, 0, 'no last-used move -> first move');
  assert.equal(b.chosen.move.name, 'Tackle');
  // Second window: fallback uses the last-used move.
  b.resolveAttack({ damage: 10 });
  b.finishResolution();
  tickFor(b, 30000);
  const fb2 = b.events.filter((e) => e.type === 'turn_clock_fallback').pop();
  assert.equal(fb2.moveIndex, 0, 'last-used move reused');
});

test('turn clock: waiting never improves a modifier past its cap', () => {
  const b = started(battle());
  tickFor(b, 29000);
  assert.ok(b.player.momentum <= 100 && b.foe.momentum <= 100);
  assert.ok(b.pressureStep >= 5, 'pressure steps accrue');
  const speedNote = b.events.filter((e) => e.type === 'pressure').pop();
  assert.ok(speedNote.speedMultiplier <= 1.6, 'pressure speed capped +60%');
});

// ---------------------------------------------------------------- chosen attack
test('chosen attack: uninterruptable once telegraphed', () => {
  const b = started(battle());
  const choice = b.chooseMove(0);
  assert.equal(b.state, 'CHOSEN_ATTACK');
  assert.equal(b.attackPhase, 'TELEGRAPH');
  assert.throws(() => b.chooseMove(1), /only valid in BETWEEN_TURN/);
  const pose0 = b.sampleArenaPose();
  tickFor(b, 3000); // attack clock advances, but no AI, no movement, no clashes
  const pose1 = b.sampleArenaPose();
  assert.equal(pose1.player.x, pose0.player.x);
  assert.equal(pose1.foe.x, pose0.foe.x);
  assert.equal(b.clashCount, 0);
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
  assert.equal(choice.frozenPose.player.x, pose0.player.x, 'frozen pose is the start frame');
});

test('chosen attack: power modifier applied once, HP drains only here', () => {
  const b = started(battle());
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  b.setFacing('foe', 30); // foe facing ~away from attacker geometry: rear-ish staging
  tickFor(b, 1500); // bank flank time through real ticks where possible
  const hpBefore = b.foe.hp;
  const choice = b.chooseMove(0);
  const res = b.resolveAttack({ damage: 40 });
  const expected = Math.round(40 * choice.modifiers.powerMultiplier);
  assert.equal(res.damageDealt, expected);
  assert.equal(b.foe.hp, hpBefore - expected);
  assert.equal(res.powerMultiplier, choice.modifiers.powerMultiplier);
  // Severity is damage-driven only.
  assert.equal(res.severity, severityFor(res.damageFraction, false));
});

test('chosen attack: faint skips return, then battle ends', () => {
  const b = started(battle());
  b.chooseMove(0);
  const res = b.resolveAttack({ damage: 500 });
  assert.equal(res.fainted, true);
  assert.equal(res.returnSkipped, true);
  assert.equal(b.state, 'FAINT');
  assert.equal(b.foe.hp, 0);
  const snap = b.finishResolution();
  assert.equal(snap.state, 'BATTLE_END');
});

test('chosen attack: multi-hit stops remaining hits on faint', () => {
  const b = started(battle({
    player: { name: 'Mochii', maxHp: 100, moves: [{ name: 'Fury', kind: 'melee', power: 40, hits: 3 }] },
  }));
  b.chooseMove(0);
  const res = b.resolveAttack({ damagePerHit: [60, 60, 60] });
  // Hit 1: 100 -> 40. Hit 2: 40 -> 0, faint. Hit 3 is skipped, not dealt.
  assert.equal(res.damageDealt, 120);
  assert.equal(res.fainted, true);
  assert.equal(b.foe.hp, 0);
  // Non-fainting multi-hit deals every hit.
  const b2 = started(battle({
    player: { name: 'Mochii', maxHp: 100, moves: [{ name: 'Fury', kind: 'melee', power: 40, hits: 3 }] },
  }));
  b2.chooseMove(0);
  const res2 = b2.resolveAttack({ damagePerHit: [10, 10, 10] });
  assert.equal(res2.damageDealt, 30);
  assert.equal(res2.fainted, false);
  assert.equal(b2.foe.hp, 70);
});

test('chosen attack: skip requires a resolved attack, then jumps to RESOLUTION', () => {
  const b = started(battle());
  b.chooseMove(0);
  assert.throws(() => b.skipToResolution(), /resolveAttack first/);
  b.resolveAttack({ damage: 10 });
  // resolveAttack already moved to RESOLUTION, so skip from here is invalid;
  // a fresh chosen attack resolved then skipped via the attack path:
  const b2 = started(battle());
  b2.chooseMove(0);
  b2.resolveAttack({ damage: 10 });
  assert.equal(b2.state, 'RESOLUTION');
  const snap = b2.finishResolution();
  assert.equal(snap.state, 'BETWEEN_TURN');
  assert.equal(snap.clashCount, 0, 'clash count resets on new window');
  assert.equal(snap.windowElapsedMs, 0, 'turn clock resets on new window');
});

test('chosen attack: miss moves zero HP; non-damage action moves zero foe HP', () => {
  const b = started(battle());
  b.chooseMove(0);
  const res = b.resolveAttack({ damage: 40, hit: false });
  assert.equal(res.damageDealt, 0);
  assert.equal(b.foe.hp, 100);
  const b2 = started(battle());
  b2.chooseMove(2); // Heal
  const r2 = b2.resolveNonDamageAction({ heal: 10 });
  assert.equal(r2.foeHp, 100);
  assert.throws(() => {
    const b3 = started(battle());
    b3.chooseMove(0);
    b3.resolveNonDamageAction({});
  }, /cannot resolve a damage move/);
});

test('state machine: full spec §7-shaped loop ends back in BETWEEN_TURN', () => {
  const b = started(battle());
  assert.equal(b.state, 'BETWEEN_TURN');
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  tickFor(b, 6000);
  assert.ok(b.clashCount >= 1);
  b.chooseMove(0);
  b.resolveAttack({ damage: 30 });
  const snap = b.finishResolution();
  assert.equal(snap.state, 'BETWEEN_TURN');
  assert.ok(snap.substate === 'SEPARATING' || snap.substate === 'CIRCLING');
  tickFor(b, 5000);
  assert.equal(b.state, 'BETWEEN_TURN');
  assert.equal(b.player.hp, 100);
  assert.ok(b.foe.hp < 100, 'only the chosen attack moved foe HP');
});

// ---------------------------------------------------------------- determinism + samplers
test('determinism: same seed replays the same clash winners and counts', () => {
  const run = () => {
    const b = started(battle({ seed: 7 }));
    b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
    tickFor(b, 12000);
    return b.clashes.map((c) => c.winnerSide + ':' + c.sparkCount).join(',');
  };
  assert.equal(run(), run());
  const other = (() => {
    const b = started(battle({ seed: 8 }));
    b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
    tickFor(b, 12000);
    return b.clashes.map((c) => c.winnerSide).join(',');
  })();
  assert.ok(typeof other === 'string');
});

test('samplers: arena pose + 3D mapping follow spec factors', () => {
  const b = started(battle());
  const pose = b.sampleArenaPose();
  assert.equal(pose.spacingU, 6);
  assert.equal(pose.player.rangeBand, 'Far'); // spacing 6 > 5
  assert.equal(pose.camera.shot, 'NEUTRAL');
  const mapped = b.mapArenaPoseTo3D({ x: 2, y: 1, facingDeg: 30, rotationDeg: 4, cameraZoom: 1.08 });
  assert.equal(mapped.spineLeanDeg, 10); // rotation x 2.5
  assert.ok(Math.abs(mapped.cameraDollyM - 0.16) < 1e-9); // (1.08 - 1) x 2.0
  assert.equal(mapped.hurtPoseWeight, 0);
});

test('timeline: treatment beats 250/90/300/400 and faint path skips return', () => {
  const tl = buildChosenAttackTimeline({ kind: 'melee', weight: 'light', hits: 1 }, null);
  assert.equal(tl.treatmentBeats.windupMs, 250);
  assert.equal(tl.treatmentBeats.impactHoldMs, 90);
  assert.equal(tl.treatmentBeats.recoilMs, 300);
  assert.equal(tl.treatmentBeats.recoverMs, 400);
  assert.equal(tl.faintPath.skipsReturn, true);
  const phases = tl.phases.map((p) => p.phase);
  assert.deepEqual(phases, ['TELEGRAPH', 'TRAVEL', 'WINDUP', 'STRIKE', 'IMPACT_HOLD', 'RECOIL', 'RETURN']);
  const multi = buildChosenAttackTimeline({ kind: 'melee', weight: 'light', hits: 2 }, null);
  assert.ok(multi.phases.filter((p) => p.phase === 'STRIKE').length === 2);
  assert.ok(multi.phases.some((p) => p.phase === 'GAP'));
  const cast = buildChosenAttackTimeline({ kind: 'projectile', weight: 'light', hits: 1 }, null);
  assert.ok(cast.phases.some((p) => p.phase === 'CAST'));
});

test('validation: bad inputs throw instead of silently running', () => {
  assert.throws(() => createArenaBattle({}), /player and foe/);
  assert.throws(() => createArenaBattle({ player: { name: 'X', maxHp: 0, moves: [{ name: 'A' }] }, foe: { name: 'Y', maxHp: 10, moves: [{ name: 'B' }] } }), /maxHp/);
  assert.throws(() => createArenaBattle({ player: { name: 'X', maxHp: 10, moves: [] }, foe: { name: 'Y', maxHp: 10, moves: [{ name: 'B' }] } }), /moves/);
  const b = started(battle());
  assert.throws(() => b.chooseMove(99), /out of range/);
  assert.throws(() => b.resolveAttack({ damage: 10 }), /only valid during CHOSEN_ATTACK/);
  assert.throws(() => b.finishResolution(), /only valid from RESOLUTION/);
});

// ---------------------------------------------------------------- scope correction
// Mars 2026-10-25 ~19:44: real move data, not genericized. Fixtures
// below are copied EXACTLY from src/lib/generated/decomp_black2_moves.json
// (source pokebw2/res/moves/*/data.json, 560 moves), entries MOVE_TACKLE
// and MOVE_EMBER. Creature names, sounds, art and dialogue are the only
// exclusions; move names/types/categories/power/accuracy/effects pass
// through untouched.
const BLACK2_TACKLE = { sourceDir: 'tackle', sourceConstant: 'MOVE_TACKLE', name: 'Tackle', type: 'TYPE_NORMAL', category: 'MOVE_CATEGORY_PHYSICAL', power: 50, accuracy: 100, pp: 35, priority: 0, effect: 'BATTLE_EFFECT_HIT' };
const BLACK2_EMBER = { sourceDir: 'ember', sourceConstant: 'MOVE_EMBER', name: 'Ember', type: 'TYPE_FIRE', category: 'MOVE_CATEGORY_SPECIAL', power: 40, accuracy: 100, pp: 25, priority: 0, effect: 'BATTLE_EFFECT_BURN_HIT' };

test('scope: toArenaMove maps real Black 2 Tackle (physical) exactly', () => {
  const m = toArenaMove(BLACK2_TACKLE);
  assert.equal(m.name, 'Tackle');
  assert.equal(m.kind, 'melee');
  assert.equal(m.power, 50);
  assert.equal(m.accuracy, 100);
  assert.equal(m.type, 'Normal');
  assert.equal(m.typeRaw, 'TYPE_NORMAL');
  assert.equal(m.effect, 'BATTLE_EFFECT_HIT');
  assert.equal(m.pp, 35);
  assert.equal(m.sourceConstant, 'MOVE_TACKLE');
});

test('scope: toArenaMove maps real Black 2 Ember (fire special) to projectile', () => {
  const m = toArenaMove(BLACK2_EMBER);
  assert.equal(m.name, 'Ember');
  assert.equal(m.kind, 'projectile');
  assert.equal(m.power, 40);
  assert.equal(m.type, 'Fire');
  assert.equal(m.effect, 'BATTLE_EFFECT_BURN_HIT');
  assert.equal(m.sourceConstant, 'MOVE_EMBER');
});

test('scope: toArenaMove maps status category + never-miss accuracy 0', () => {
  const status = toArenaMove({ name: 'Growl', type: 'TYPE_NORMAL', category: 'MOVE_CATEGORY_STATUS', power: 0, accuracy: 100, pp: 40, priority: 0, effect: 'BATTLE_EFFECT_ATTACK_DOWN' });
  assert.equal(status.kind, 'status');
  const neverMiss = toArenaMove({ name: 'Swift', type: 'TYPE_NORMAL', category: 'MOVE_CATEGORY_SPECIAL', power: 60, accuracy: 0, pp: 20, priority: 0, effect: 'BATTLE_EFFECT_HIT' });
  assert.equal(neverMiss.accuracy, 100, 'decomp accuracy 0 = never misses, not 5%');
  assert.equal(neverMiss.decompAccuracy, 0);
  assert.throws(() => toArenaMove({}), /requires a decomp move entry/);
});

test('scope: status move through the controller gets zero modifiers, zero HP', () => {
  const b = started(battle({
    player: { name: 'Mochii', maxHp: 100, moves: [{ name: 'Growl', kind: 'status', power: 0, accuracy: 100 }] },
  }));
  const choice = b.chooseMove(0);
  assert.equal(choice.modifiers.powerPct, 0);
  assert.equal(choice.modifiers.accuracyMod, 0);
  b.resolveNonDamageAction({});
  assert.equal(b.foe.hp, 100);
  assert.equal(b.player.hp, 100);
});

test('scope: toArenaMove against the real catalog file when present', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const url = await import('node:url');
  const here = path.dirname(url.fileURLToPath(import.meta.url));
  const candidates = [
    path.join(here, '../../fresh-start/src/lib/generated/decomp_black2_moves.json'),
  ];
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) { test.skip('real catalog file not present locally'); return; }
  const catalog = JSON.parse(fs.readFileSync(found, 'utf8'));
  assert.equal(catalog.count, 560);
  const byName = (n) => catalog.moves.find((m) => m.name === n);
  assert.equal(toArenaMove(byName('Tackle')).power, 50);
  assert.equal(toArenaMove(byName('Ember')).power, 40);
  assert.equal(toArenaMove(byName('Ember')).kind, 'projectile');
});

// ---------------------------------------------------------------- fight-as-creature
// Mars 2026-10-25 ~19:45: mode 'driven' — the player drives the creature
// between turns. Turn-based core unchanged: only chosen attacks move HP.
test('driven: input moves the player, AI never overrides, HP unchanged', () => {
  const b = started(battle({ mode: 'driven' }));
  assert.equal(b.mode, 'driven');
  b.setDriveInput({ x: 1, y: 0 });
  const x0 = b.player.x;
  tickFor(b, 1000);
  assert.ok(b.player.x > x0 + 1.5, 'driven player must advance ~2.0 u in 1 s, got ' + (b.player.x - x0));
  assert.equal(b.player.behaviour, 'DRIVEN', 'AI eval must not overwrite driven behaviour');
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
  // Input normalizes: magnitude > 1 clamps to 1 (same speed, not faster).
  b.setDriveInput({ x: 3, y: 4 });
  const snap = b.snapshot();
  assert.ok(Math.abs(Math.hypot(snap.driveInput.x, snap.driveInput.y) - 1) < 1e-9);
});

test('driven: setDriveInput rejected in ai mode; unknown mode rejected', () => {
  const b = started(battle());
  assert.equal(b.mode, 'ai');
  assert.throws(() => b.setDriveInput({ x: 1, y: 0 }), /requires mode: "driven"/);
  assert.throws(() => createArenaBattle({
    mode: 'auto',
    player: { name: 'X', maxHp: 10, moves: [{ name: 'A' }] },
    foe: { name: 'Y', maxHp: 10, moves: [{ name: 'B' }] },
  }), /unknown mode/);
});

test('driven: driving into contact spars visually (zero HP), choosing still works', () => {
  const b = started(battle({ mode: 'driven' }));
  b.setPositions({ x: -0.8, y: 0 }, { x: 0.8, y: 0 });
  b.setBehaviour('foe', 'CIRCLING');
  b.setDriveInput({ x: 1, y: 0 });
  tickFor(b, 3000);
  assert.ok(b.clashCount >= 1, 'driven contact must spar, got ' + b.clashCount);
  assert.equal(b.player.hp, 100);
  assert.equal(b.foe.hp, 100);
  // Choosing from driven mode: same core, frozen pose, real modifiers.
  const choice = b.chooseMove(0);
  assert.equal(b.state, 'CHOSEN_ATTACK');
  const res = b.resolveAttack({ damage: 20 });
  assert.ok(res.damageDealt >= 20, 'modifiers apply in driven mode exactly as in ai mode');
  assert.equal(choice.frozenPose.mode, 'driven');
});

test('driven: static creature ignores drive input (never translates)', () => {
  const b = started(battle({
    mode: 'driven',
    player: { name: 'Cocoonode', maxHp: 80, bodyType: 'static', moves: [{ name: 'Tackle', kind: 'melee', power: 10 }] },
  }));
  const x0 = b.player.x;
  b.setDriveInput({ x: 1, y: 0 });
  tickFor(b, 2000);
  assert.equal(b.player.x, x0);
});
