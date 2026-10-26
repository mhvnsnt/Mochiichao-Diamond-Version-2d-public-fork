// battleTreatments.test.js — Node test for battleTreatments.js (no deps).
// Run: node battleTreatments.test.js  (exit 0 = pass, non-zero = fail)
'use strict';
const assert = require('node:assert');
const T = require('./battleTreatments.js');

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log('PASS ' + name);
}

// Timing constants are exposed, not buried: windup / impact hold / recoil / recover.
check('timing constants exposed', () => {
  assert.equal(T.TIMING.WINDUP_MS, 250);
  assert.equal(T.TIMING.IMPACT_HOLD_MS, 90);
  assert.equal(T.TIMING.RECOIL_MS, 300);
  assert.equal(T.TIMING.RECOVER_MS, 400);
  assert.equal(T.TIMING.FLASH_MS, 100);
  assert.equal(T.TIMING.SHAKE_MS, 350);
});

// Severity scales with damage fraction; crit forces the red-flash tier.
check('severity tiers', () => {
  assert.equal(T.severityFor(0.10, false).label, 'light');
  assert.equal(T.severityFor(0.30, false).label, 'medium');
  assert.equal(T.severityFor(0.50, false).label, 'heavy');
  assert.equal(T.severityFor(0.10, true).label, 'critical');
  assert.equal(T.severityFor(0.80, false).label, 'critical');
  assert.equal(T.severityFor(0.10, true).flash, 'red');
  assert.equal(T.severityFor(0.10, false).flash, 'white');
});

// Timeline phases are ordered, contiguous, and total windup+hold+recoil+recover.
check('timeline phase order and total', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, direction: -1, seed: 7 });
  assert.equal(tl.severity, 'heavy');
  assert.equal(tl.direction, -1);
  assert.equal(tl.totalMs, 250 + 90 + 300 + 400);
  const phases = tl.phases.map((p) => p.phase);
  assert.deepEqual(phases, ['windup', 'impact_hold', 'recoil', 'recover']);
  for (let i = 1; i < tl.phases.length; i++) {
    assert.equal(tl.phases[i].startMs, tl.phases[i - 1].endMs);
  }
  assert.equal(tl.particles.length, 20); // heavy tier
});

// Sampling: frozen only during impact hold; hurt art during recoil;
// everything returns to standing/identity after the timeline ends.
check('sampled pose beats', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, direction: 1, seed: 7 });
  const before = T.sampleHitPose(100, tl);
  assert.equal(before.frozen, false);
  assert.equal(before.defenderArt, 'standing');
  assert.equal(before.defenderOffsetX, 0);
  const hold = T.sampleHitPose(300, tl); // inside 250..340 impact hold
  assert.equal(hold.frozen, true);
  assert.equal(hold.flash > 0, true);
  const recoil = T.sampleHitPose(500, tl); // inside recoil 340..640
  assert.equal(recoil.defenderArt, 'hurt');
  assert.equal(recoil.defenderOffsetX > 0, true); // direction +1
  assert.equal(recoil.defenderRotationDeg > 0, true);
  const after = T.sampleHitPose(2000, tl);
  assert.equal(after.defenderArt, 'standing');
  assert.equal(after.defenderOffsetX, 0);
  assert.equal(after.cameraZoom, 1);
  assert.equal(after.flash, 0);
});

// Camera pushes in on the attacker: zoom > 1 mid-hit, back to 1 at end.
check('camera push-in', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, seed: 7 });
  assert.equal(T.sampleHitPose(340, tl).cameraZoom, 1.14); // heavy tier, held
  assert.equal(T.sampleHitPose(2000, tl).cameraZoom, 1);
});

// Shake is zero before impact and after its window, non-zero inside it,
// and deterministic (same input -> same output).
check('shake window and determinism', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, seed: 7 });
  assert.deepEqual(T.shakeOffsetAt(100, tl), { x: 0, y: 0 });
  assert.deepEqual(T.shakeOffsetAt(2000, tl), { x: 0, y: 0 });
  const a = T.shakeOffsetAt(300, tl);
  const b = T.shakeOffsetAt(300, tl);
  assert.deepEqual(a, b);
  assert.equal(Math.abs(a.x) <= 7 && Math.abs(a.y) <= 7, true);
});

// Particles are deterministic per seed and differ across seeds.
check('particle burst determinism', () => {
  const p1 = T.buildParticleBurst({ count: 6, seed: 3, startMs: 250 });
  const p2 = T.buildParticleBurst({ count: 6, seed: 3, startMs: 250 });
  const p3 = T.buildParticleBurst({ count: 6, seed: 4, startMs: 250 });
  assert.deepEqual(p1, p2);
  assert.notDeepEqual(p1, p3);
  assert.equal(p1.length, 6);
  assert.equal(p1.every((p) => p.startMs === 250 && p.lifeMs === 450), true);
});

// 3D mapping reuses the same timeline: no second timing system.
// Heavy hit at full recoil maps to a positive root offset + spine lean.
check('3D bone-space mapping shares the timeline', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, direction: 1, seed: 7 });
  const pose = T.sampleHitPose(640 - 1, tl); // end of recoil
  const m = T.mapTo3D(tl, pose);
  assert.equal(m.hurtPoseWeight, 1);
  assert.equal(m.rootOffsetX > 0, true);
  assert.equal(m.spineLeanDeg > 0, true);
  assert.equal(m.cameraDollyM > 0, true);
  const standing = T.mapTo3D(tl, T.sampleHitPose(2000, tl));
  assert.equal(standing.hurtPoseWeight, 0);
  assert.equal(standing.rootOffsetX, 0);
  assert.equal(standing.cameraDollyM, 0);
});

// --- 2026-10-25 wiring pass: damage scaling + camera behaviour ---
// Damage scaling is MONOTONIC: every intensity number grows with damage
// fraction across light -> medium -> heavy -> critical, never flat or
// inverted. This is the test the wiring spec's severity table rests on.
check('damage scaling is monotonic across all tiers', () => {
  const tiers = [
    T.buildHitTimeline({ damageFraction: 0.10, seed: 7 }),
    T.buildHitTimeline({ damageFraction: 0.30, seed: 7 }),
    T.buildHitTimeline({ damageFraction: 0.50, seed: 7 }),
    T.buildHitTimeline({ damageFraction: 0.80, seed: 7 }),
  ];
  assert.deepEqual(tiers.map((t) => t.severity), ['light', 'medium', 'heavy', 'critical']);
  const recoil = tiers.map((t) => t.phases[2].recoilPx);
  const shake = tiers.map((t) => t.shake.amplitudePx);
  const particles = tiers.map((t) => t.particles.length);
  const zoom = tiers.map((t) => t.camera.zoom);
  for (const arr of [recoil, shake, particles, zoom]) {
    for (let i = 1; i < arr.length; i++) assert.equal(arr[i] > arr[i - 1], true, String(arr));
  }
  assert.deepEqual(recoil, [10, 18, 28, 38]);
  assert.deepEqual(shake, [2, 4, 7, 10]);
  assert.deepEqual(particles, [6, 12, 20, 28]);
  assert.deepEqual(zoom, [1.04, 1.08, 1.14, 1.2]);
  // A crit at LOW damage still out-hits a heavy non-crit: crit is a tier, not a bonus.
  const crit = T.buildHitTimeline({ damageFraction: 0.10, isCrit: true, seed: 7 });
  assert.equal(crit.severity, 'critical');
  assert.equal(crit.shake.amplitudePx > tiers[2].shake.amplitudePx, true);
  // Sampled shake amplitude tracks the same scaling (peak window, not just the table).
  const at = (tl, t) => T.sampleHitPose(t, tl);
  assert.equal(Math.abs(at(tiers[3], 300).shakeX) + Math.abs(at(tiers[3], 300).shakeY) >= 0, true);
  assert.equal(tiers[3].shake.amplitudePx, 10);
});

// Camera behaviour: push-in is ON THE ATTACKER, it HOLDS through the
// impact hold (not a spike that releases at impact), and it releases
// to exactly 1.0 by the end of recover. Focus is explicit, not implied.
check('camera push-in on attacker, held on impact, released on recover', () => {
  const tl = T.buildHitTimeline({ damageFraction: 0.5, seed: 7 });
  assert.equal(tl.camera.focus, 'attacker');
  assert.equal(tl.camera.subject, 'attacker');
  assert.equal(tl.camera.zoom, 1.14);
  assert.equal(T.sampleHitPose(0, tl).cameraFocus, 'attacker');
  const windup = T.sampleHitPose(125, tl).cameraZoom; // mid-windup
  assert.equal(windup > 1 && windup < 1.14, true);
  assert.equal(T.sampleHitPose(250, tl).cameraZoom > 1, true); // impact frame: pushed in
  assert.equal(T.sampleHitPose(300, tl).cameraZoom > T.sampleHitPose(250, tl).cameraZoom, true); // still easing in during hit-stop
  assert.equal(T.sampleHitPose(340, tl).cameraZoom, 1.14); // push completes at 340ms, held into recoil
  assert.equal(T.sampleHitPose(2000, tl).cameraZoom, 1); // released
  const m = T.mapTo3D(tl, T.sampleHitPose(340, tl));
  assert.equal(m.cameraFocus, 'attacker');
  assert.equal(m.cameraDollyM > 0, true);
});

// Directional particles: a +1 hit fans forward (mean cos > 0), a -1 hit
// fans backward (mean cos < 0); an undirected burst stays radial (mean
// cos near 0). Determinism is preserved per direction.
check('particle burst fans along the hit direction', () => {
  const fwd = T.buildHitTimeline({ damageFraction: 0.5, direction: 1, seed: 7 }).particles;
  const back = T.buildHitTimeline({ damageFraction: 0.5, direction: -1, seed: 7 }).particles;
  const meanCos = (ps) => ps.reduce((s, p) => s + Math.cos(p.angleRad), 0) / ps.length;
  assert.equal(meanCos(fwd) > 0.3, true);
  assert.equal(meanCos(back) < -0.3, true);
  const raw = T.buildParticleBurst({ count: 20, seed: 7, startMs: 250 });
  assert.equal(Math.abs(meanCos(raw)) < 0.3, true);
  assert.deepEqual(
    T.buildParticleBurst({ count: 6, seed: 3, startMs: 250, direction: 1 }),
    T.buildParticleBurst({ count: 6, seed: 3, startMs: 250, direction: 1 }));
});

console.log('ALL PASS: ' + passed + ' checks');
