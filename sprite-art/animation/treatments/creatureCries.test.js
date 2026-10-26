// creatureCries.test.js + battleMusicCues.test.js — run: node creatureCries.test.js (runs both)
'use strict';
const assert = require('assert');
const cries = require('./creatureCries.js');
const music = require('./battleMusicCues.js');
let n = 0;
function check(name, fn) { fn(); n++; console.log('ok ' + n + ' - ' + name); }
check('cries: 51 sets, one per game-ready set', () => {
  assert.strictEqual(cries.cryCount(), 51);
  const expected = ['aerobeak','aquariios','ashemit','astroleviathan','chromejaww','cocoonode','cragarm','dorowani','dreadtoise','duneclaw','duskfiend','finblade','floatcalf','gabu','gearkid','gorokappa','inklet','kickmaster','kittember','krakenox','manticlaw','mechapion','megalochrome','mochii','mothrix','mythar','oblivirex','pebblefist','pixilite','punchkid','pupbble','pyromonk','pyropaw','quakehound','razorgater','reaperdile','shellguard','sproutle','squirmite','stormtalon','strikechamp','strikechamp_unsuited','strikechamp_unsuited_full','terradog','terrapod','tiidebiite','toxitacle','tyrage','wispkin','yogiferno','zephling'];
  assert.deepStrictEqual(Object.keys(cries.CREATURE_CRIES).sort(), expected.sort());
});
check('cries: every spec in range, valid waveform, 3-point contour', () => {
  for (const [set, c] of Object.entries(cries.CREATURE_CRIES)) {
    assert.ok(c.baseHz >= 120 && c.baseHz <= 900, set + ' baseHz ' + c.baseHz);
    assert.ok(c.durationMs >= 300 && c.durationMs <= 1000, set);
    assert.ok(['sine','square','sawtooth','triangle'].includes(c.waveform), set);
    assert.strictEqual(c.contour.length, 3, set);
    assert.ok(c.noiseMix >= 0 && c.noiseMix <= 1, set);
  }
});
check('cries: no two sets share the full (baseHz, contour, duration) spec', () => {
  const seen = new Set();
  for (const c of Object.values(cries.CREATURE_CRIES)) {
    const k = [c.baseHz, ...c.contour, c.durationMs].join('/');
    assert.ok(!seen.has(k), 'duplicate cry spec ' + k);
    seen.add(k);
  }
});
check('cries: envelope is 3 points, peak at 40%, shiny x1.15', () => {
  const env = cries.cryEnvelope('mochii');
  assert.strictEqual(env.length, 3);
  assert.strictEqual(env[1].tMs, Math.round(cries.cryFor('mochii').durationMs * 0.4));
  const shiny = cries.cryEnvelope('mochii', { shiny: true });
  assert.strictEqual(shiny[0].hz, Math.round(cries.cryFor('mochii').baseHz * 1.15));
  assert.throws(() => cries.cryFor('missingno'));
});
check('music: 5 ordered cues + defeat extra, all file slots null (nothing downloaded)', () => {
  assert.deepStrictEqual([...music.ORDERED_CUES], ['intro','player_turn','enemy_turn','low_hp','victory']);
  for (const name of [...music.ORDERED_CUES, 'defeat']) {
    const c = music.cueFor(name);
    assert.strictEqual(c.fileSlot, null, name + ' must not claim a downloaded file');
    assert.ok(c.audioCall && c.synthFallback, name);
  }
  assert.throws(() => music.cueFor('intermission'));
});
check('music: turn cues do not swap the loop; intro/low_hp/victory do', () => {
  assert.strictEqual(music.cueFor('player_turn').loopChange, false);
  assert.strictEqual(music.cueFor('enemy_turn').loopChange, false);
  assert.strictEqual(music.cueFor('intro').loopChange, true);
  assert.strictEqual(music.cueFor('low_hp').loopChange, true);
  assert.strictEqual(music.cueFor('victory').loopChange, true);
});
check('music: low-HP crossing helper fires once on first crossing only', () => {
  assert.strictEqual(music.crossedLowHp(0.30, 0.24), true);
  assert.strictEqual(music.crossedLowHp(0.24, 0.20), false);
  assert.strictEqual(music.crossedLowHp(0.30, 0.26), false);
  assert.strictEqual(music.LOW_HP_THRESHOLD, 0.25);
});
console.log('creatureCries + battleMusicCues: ' + n + '/' + n + ' checks pass');
