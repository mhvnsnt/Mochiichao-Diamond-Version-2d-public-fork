// frame0VfxSfx.test.js + webAudioManager.test.js — run: node frame0VfxSfx.test.js (runs both)
'use strict';
const assert = require('node:assert');
const frame0 = require('./frame0VfxSfx.js');
const audio = require('./webAudioManager.js');
const vfx = require('./elementImpactVfx.js');
let n = 0;
function check(name, fn) { fn(); n++; console.log('ok - ' + name); }
check('frame0: 2 kinds x 12 elements = 24 combos, all at t=0 TELEGRAPH', () => {
  const combos = frame0.frame0Combos();
  assert.strictEqual(combos.length, 24);
  assert.ok(combos.every(c => c.atMs === 0 && c.phase === 'TELEGRAPH'));
  assert.strictEqual(new Set(combos.map(c => c.kind + '/' + c.element)).size, 24);
});
check('frame0: melee anchors attacker (charge), projectile anchors launch point (muzzle)', () => {
  assert.strictEqual(frame0.frame0For('melee', 'Flame').anchor, 'attacker');
  assert.strictEqual(frame0.frame0For('melee', 'Flame').motion, 'charge_glow');
  assert.strictEqual(frame0.frame0For('projectile', 'Flame').anchor, 'attacker_launch_point');
  assert.strictEqual(frame0.frame0For('projectile', 'Flame').motion, 'muzzle_glow');
});
check('frame0: family shape/colours + telegraph SFX follow the element, not the kind', () => {
  const m = frame0.frame0For('melee', 'Water'), p = frame0.frame0For('projectile', 'Water');
  assert.strictEqual(m.shape, p.shape); assert.deepStrictEqual(m.colors, p.colors);
  assert.strictEqual(m.sfx, 'telegraph_water'); assert.strictEqual(m.impactSfx, 'impact_water');
});
check('frame0: multi-hit repeats per sub-hit with index/total', () => {
  const f = frame0.frame0For('melee', 'Bug', { subHitIndex: 1, subHitTotal: 3 });
  assert.strictEqual(f.subHitIndex, 1); assert.strictEqual(f.subHitTotal, 3);
  assert.throws(() => frame0.frame0For('melee', 'Bug', { subHitIndex: 3, subHitTotal: 3 }));
});
check('frame0: unknown kind/element throws (no silent default)', () => {
  assert.throws(() => frame0.frame0For('beam', 'Flame'));
  assert.throws(() => frame0.frame0For('melee', 'Lightning'));
});
check('audio manager: MONO pans 0 both sides; STEREO player -0.4 / foe +0.4', () => {
  const mono = audio.createManager({ sound: 'MONO' });
  assert.strictEqual(mono.panForSide('player'), 0); assert.strictEqual(mono.panForSide('foe'), 0);
  const stereo = audio.createManager({ sound: 'STEREO' });
  assert.strictEqual(stereo.panForSide('player'), -0.4); assert.strictEqual(stereo.panForSide('foe'), 0.4);
  assert.throws(() => audio.createManager({ sound: 'SURROUND' }));
});
check('audio manager: cry plan carries the original synth spec (no sample)', () => {
  const plan = audio.createManager().cryPlan('mochii');
  assert.strictEqual(plan.type, 'cry'); assert.strictEqual(plan.waveform, 'square');
  assert.strictEqual(plan.freqPoints[0].hz, 571); assert.strictEqual(plan.durationMs, 460);
  const shiny = audio.createManager().cryPlan('mochii', { shiny: true });
  assert.strictEqual(shiny.freqPoints[0].hz, Math.round(571 * 1.15));
});
check('audio manager: impact plan reuses treatments severity counts (not re-declared)', () => {
  const heavy = audio.createManager().impactPlan('Flame', 'heavy');
  assert.strictEqual(heavy.particles, 20); assert.strictEqual(heavy.sfx, 'impact_flame'); assert.strictEqual(heavy.shape, 'flame');
  assert.strictEqual(audio.createManager().impactPlan('Water', 'critical').particles, 28);
  assert.throws(() => audio.createManager().impactPlan('Water', 'mega'));
});
check('audio manager: licence gate — credit-required without credit throws; CC0 + original pass; unregistered loop falls back to synth', () => {
  const mgr = audio.createManager();
  assert.throws(() => mgr.registerLoop('boss', { licence: 'credit-required' }));
  assert.strictEqual(mgr.registerLoop('boss', { licence: 'credit-required', credit: 'Example Pack by X', fileSlot: 'boss.wav' }).licence, 'credit-required');
  assert.strictEqual(mgr.registerLoop('battle', { licence: 'CC0', fileSlot: 'battle.wav' }).licence, 'CC0');
  assert.throws(() => mgr.registerLoop('x', { licence: 'royalty-free?' }));
  assert.strictEqual(mgr.registeredLoops().length, 2);
  assert.strictEqual(mgr.loopPlan('missing', 'battle').synthFallback, 'battle');
  assert.strictEqual(mgr.loopPlan('boss').fileSlot, 'boss.wav');
});
check('audio manager: frame0 plan passes through the telegraph SFX key', () => {
  const f = frame0.frame0For('projectile', 'Umbral');
  const plan = audio.createManager().frame0Plan(f);
  assert.strictEqual(plan.sfx, 'telegraph_umbral'); assert.strictEqual(plan.atMs, 0);
});
console.log('frame0VfxSfx + webAudioManager: ' + n + '/' + n + ' checks pass');
