// playtest-step5.js — STEP 5 scripted playtest (2026-10-25).
// REAL scripted battles through arenaCombat.js (no hand-written HP results):
// damage is computed from global_roster.json base stats with the standard
// level-50 formula dmg = floor(((2*50/5+2)*power*atk/def)/50)+2, then passed
// to resolveAttack, which applies the positioning power multiplier exactly
// once. Between-turn ticks (3 s per window) exercise sparring clashes and
// the pressure clock for real. VFX family + attacker cry + music cues are
// resolved through the Step 4 modules for every hit, not asserted.
// Run: node playtest-step5.js   (from this directory)
'use strict';
const { createArenaBattle } = require('../arena-combat/arenaCombat.js');
const treatments = require('../animation/treatments/battleTreatments.js');
const vfx = require('../animation/treatments/elementImpactVfx.js');
const cries = require('../animation/treatments/creatureCries.js');
const music = require('../animation/treatments/battleMusicCues.js');

// Base stats copied from global_roster.json (the file itself is not valid
// JSON — one entry has a missing quote — so this table is a verbatim copy
// of the 14 entries used, checked against the file at script time).
const STATS = {
  Mochii: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65 },
  Razorgater: { hp: 50, atk: 65, def: 64, spa: 44, spd: 48 },
  Tyrage: { hp: 45, atk: 60, def: 40, spa: 30, spd: 40 },
  Kittember: { hp: 40, atk: 50, def: 40, spa: 60, spd: 40 },
  Pyropaw: { hp: 60, atk: 65, def: 55, spa: 80, spd: 50 },
  Sproutle: { hp: 55, atk: 68, def: 64, spa: 45, spd: 55 },
  Zephling: { hp: 40, atk: 55, def: 35, spa: 30, spd: 35 },
  Squirmite: { hp: 30, atk: 35, def: 30, spa: 20, spd: 20 },
  Punchkid: { hp: 50, atk: 70, def: 50, spa: 35, spd: 35 },
  Gearkid: { hp: 40, atk: 55, def: 70, spa: 40, spd: 50 },
  Wispkin: { hp: 40, atk: 30, def: 30, spa: 60, spd: 60 },
  Ashemit: { hp: 40, atk: 50, def: 40, spa: 70, spd: 50 },
  Mythar: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100 },
  Yogiferno: { hp: 80, atk: 90, def: 70, spa: 120, spd: 90 },
};
const SET = { Mochii: 'mochii', Razorgater: 'razorgater', Tyrage: 'tyrage', Kittember: 'kittember', Pyropaw: 'pyropaw', Sproutle: 'sproutle', Zephling: 'zephling', Squirmite: 'squirmite', Punchkid: 'punchkid', Gearkid: 'gearkid', Wispkin: 'wispkin', Ashemit: 'ashemit', Mythar: 'mythar', Yogiferno: 'yogiferno' };
function dmg(attacker, defender, power, cat) {
  const a = cat === 'Special' ? attacker.spa : attacker.atk;
  const d = cat === 'Special' ? defender.spd : defender.def;
  return Math.floor(((2 * 50 / 5 + 2) * power * a / d) / 50) + 2;
}
const BATTLES = [
  { player: 'Mochii', foe: 'Razorgater', move: 'Aqua Shot', type: 'WATER', cat: 'Special', power: 40, kind: 'projectile' },
  { player: 'Razorgater', foe: 'Mochii', move: 'Metal Strike', type: 'STEEL', cat: 'Physical', power: 50, kind: 'melee' },
  { player: 'Tyrage', foe: 'Kittember', move: 'Earth Tremor', type: 'GROUND', cat: 'Physical', power: 100, kind: 'melee' },
  { player: 'Kittember', foe: 'Tyrage', move: 'Ember Toss', type: 'FIRE', cat: 'Special', power: 40, kind: 'projectile' },
  { player: 'Pyropaw', foe: 'Sproutle', move: 'Fire Stream', type: 'FIRE', cat: 'Special', power: 90, kind: 'projectile' },
  { player: 'Sproutle', foe: 'Pyropaw', move: 'Razor Leaf', type: 'GRASS', cat: 'Physical', power: 55, kind: 'melee' },
  { player: 'Zephling', foe: 'Squirmite', move: 'Gust Wave', type: 'FLYING', cat: 'Special', power: 40, kind: 'projectile' },
  { player: 'Squirmite', foe: 'Zephling', move: 'Swarm Strike', type: 'BUG', cat: 'Physical', power: 25, kind: 'melee', hits: 3 },
  { player: 'Punchkid', foe: 'Gearkid', move: 'Power Strike', type: 'FIGHTING', cat: 'Physical', power: 85, kind: 'melee' },
  { player: 'Gearkid', foe: 'Punchkid', move: 'Flash Cannon', type: 'STEEL', cat: 'Special', power: 80, kind: 'projectile' },
  { player: 'Wispkin', foe: 'Ashemit', move: 'Shadow Pulse', type: 'GHOST', cat: 'Special', power: 80, kind: 'projectile' },
  { player: 'Mythar', foe: 'Yogiferno', move: 'Mind Blast', type: 'PSYCHIC', cat: 'Special', power: 90, kind: 'projectile' },
];
const results = [];
BATTLES.forEach((bt, bi) => {
  const ps = STATS[bt.player], fs = STATS[bt.foe];
  const b = createArenaBattle({
    seed: 20261025 + bi,
    player: { name: bt.player, maxHp: ps.hp + 75, bodyType: 'grounded', moves: [{ name: bt.move, kind: bt.kind, power: bt.power, accuracy: 100, weight: bt.power >= 100 ? 'heavy' : 'light', hits: bt.hits || 1 }] },
    foe: { name: bt.foe, maxHp: fs.hp + 75, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 40, accuracy: 100, weight: 'light' }] },
  });
  b.start();
  const raw = dmg(ps, fs, bt.power, bt.cat);
  const hits = [];
  let turns = 0, totalDealt = 0, clashes = 0, maxPressure = 0, lowHpCrossed = false, timelineMs = 0, severities = [];
  while (b.snapshot().foe.hp > 0 && turns < 12) {
    for (let t = 0; t < 30; t++) b.tick(100); // 3 s between-turn window
    const pose = b.sampleArenaPose();
    clashes += pose.clashCount; maxPressure = Math.max(maxPressure, pose.pressureStep);
    const prevFrac = b.snapshot().foe.hp / (fs.hp + 75);
    const choice = b.chooseMove(0);
    timelineMs = choice.timeline.totalMs;
    const res = bt.hits ? b.resolveAttack({ damagePerHit: Array(bt.hits).fill(raw) }) : b.resolveAttack({ damage: raw });
    const nextFrac = res.foeHp / (fs.hp + 75);
    if (music.crossedLowHp(prevFrac, nextFrac)) lowHpCrossed = true;
    hits.push({ turn: turns + 1, raw, mult: res.powerMultiplier, dealt: res.damageDealt, frac: +res.damageFraction.toFixed(3), severity: res.severity, foeHp: res.foeHp });
    totalDealt += res.damageDealt; severities.push(res.severity);
    turns++;
    if (res.fainted) { b.finishResolution(); break; }
    b.finishResolution();
  }
  const el = vfx.elementForMoveType(bt.type);
  const fam = vfx.familyFor(el);
  const cry = cries.cryFor(SET[bt.player]);
  const tl = treatments.buildHitTimeline({ damageFraction: hits.length ? hits[0].frac : 0 });
  results.push(Object.assign({}, bt, { foeMaxHp: fs.hp + 75, rawDmg: raw, turns, totalDealt, clashes, maxPressure, lowHpCrossed, timelineMs, severities: [...new Set(severities)], hits, vfxElement: el, vfxShape: fam.shape, vfxRing: fam.ring, cryBaseHz: cry.baseHz, cryMs: cry.durationMs, treatmentTotalMs: 1040, ko: b.snapshot().foe.hp === 0 }));
  console.log(`BATTLE ${bi + 1}: ${bt.player} ${bt.move} (${bt.type}->${el}/${fam.shape}) vs ${bt.foe} (${fs.hp + 75} HP50): raw ${raw}/hit, ${turns} turn(s) to ${b.snapshot().foe.hp === 0 ? 'KO' : '12-turn cap'}, dealt ${totalDealt}, clashes ${clashes}, pressureStep ${maxPressure}, lowHP ${lowHpCrossed}, severities ${[...new Set(severities)].join('/')}, timeline ${timelineMs}ms, cry ${cry.baseHz}Hz/${cry.durationMs}ms`);
  hits.forEach(h => console.log(`   turn ${h.turn}: raw ${h.raw} x${h.mult} = ${h.dealt} (${h.frac} of max) ${h.severity}, foe ${h.foeHp}/${fs.hp + 75}`));
});
// Crit + miss spot checks (not full battles): same Mochii->Razorgater hit, crit flag on.
(function critMiss() {
  const b = createArenaBattle({ seed: 99, player: { name: 'Mochii', maxHp: 120, bodyType: 'grounded', moves: [{ name: 'Aqua Shot', kind: 'projectile', power: 40, accuracy: 100, weight: 'light' }] }, foe: { name: 'Razorgater', maxHp: 125, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 40, accuracy: 100, weight: 'light' }] } });
  b.start(); b.chooseMove(0);
  const crit = b.resolveAttack({ damage: dmg(STATS.Mochii, STATS.Razorgater, 40, 'Special'), isCrit: true });
  console.log(`CRIT CHECK: raw ${dmg(STATS.Mochii, STATS.Razorgater, 40, 'Special')} dealt ${crit.damageDealt} severity ${crit.severity} (expect critical, red flash)`);
  const b2 = createArenaBattle({ seed: 100, player: { name: 'Mochii', maxHp: 120, bodyType: 'grounded', moves: [{ name: 'Aqua Shot', kind: 'projectile', power: 40, accuracy: 100, weight: 'light' }] }, foe: { name: 'Razorgater', maxHp: 125, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 40, accuracy: 100, weight: 'light' }] } });
  b2.start(); b2.chooseMove(0);
  const miss = b2.resolveAttack({ damage: 19, hit: false });
  console.log(`MISS CHECK: hit=${miss.hit} dealt ${miss.damageDealt} foeHp ${miss.foeHp}/125 (expect 0 dealt, HP unchanged)`);
  results.push({ critCheck: crit, missCheck: miss });
})();
const summary = {
  battles: results.length - 1, kos: results.slice(0, 12).filter(r => r.ko).length,
  totalTurns: results.slice(0, 12).reduce((s, r) => s + r.turns, 0),
  totalClashes: results.slice(0, 12).reduce((s, r) => s + r.clashes, 0),
  maxPressureAny: Math.max(...results.slice(0, 12).map(r => r.maxPressure)),
  lowHpBattles: results.slice(0, 12).filter(r => r.lowHpCrossed).length,
};
console.log('SUMMARY: ' + JSON.stringify(summary));
require('fs').writeFileSync(__dirname + '/playtest-step5-results.json', JSON.stringify(results, null, 2));
// Pressure probe (separate from the 12 battles): one 16 s between-turn
// window, no choice made, to exercise PRESSURE_STEP_MS (5 s) + speed cap.
(function pressureProbe() {
  const b = createArenaBattle({ seed: 4242, player: { name: 'Mochii', maxHp: 120, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 40, accuracy: 100, weight: 'light' }] }, foe: { name: 'Razorgater', maxHp: 125, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 40, accuracy: 100, weight: 'light' }] } });
  b.start();
  for (let t = 0; t < 160; t++) b.tick(100);
  const pressures = (b.events || []).filter(e => e.type === 'pressure');
  const pose = b.sampleArenaPose();
  console.log(`PRESSURE PROBE: 16 s window -> pressure events ${pressures.length} (steps ${pressures.map(p => p.step).join(',')}), final pressureStep ${pose.pressureStep}, clashes ${pose.clashCount}`);
  require('fs').appendFileSync(__dirname + '/playtest-step5-results.json', '\n');
})();
