// playtest-step5-real-moves.js — STEP 5, real-move pass (scope correction
// 2026-10-25 ~19:44 CDT, Mars: moves/animations are NOT replaced; only
// creature NAMES, SOUNDS, ART, DIALOGUE are excluded).
// Combatants are Mochiichao creatures (own names/art). Moves are REAL
// decomp move data, names kept exactly, values copied from
// decomp_firered_moves.json (source: pokefirered-leafgreen
// src/data/battle_moves.h, 354 moves): power/accuracy/type + the
// Gen-3 derived category recorded in that file (Gen 3 has no category
// field; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special,
// otherwise Physical). No move name is genericized into a shape.
// HP50 scaling + level-50 formula as in playtest-step5.js (tuning TUNING-1).
'use strict';
const { createArenaBattle } = require('../arena-combat/arenaCombat.js');
const vfx = require('../animation/treatments/elementImpactVfx.js');
const STATS = {
  Mochii: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65 },
  Razorgater: { hp: 50, atk: 65, def: 64, spa: 44, spd: 48 },
  Tyrage: { hp: 45, atk: 60, def: 40, spa: 30, spd: 40 },
  Kittember: { hp: 40, atk: 50, def: 40, spa: 60, spd: 40 },
  Pyropaw: { hp: 60, atk: 65, def: 55, spa: 80, spd: 50 },
  Sproutle: { hp: 55, atk: 68, def: 64, spa: 45, spd: 55 },
  Zephling: { hp: 40, atk: 55, def: 35, spa: 30, spd: 35 },
  Squirmite: { hp: 30, atk: 35, def: 30, spa: 20, spd: 20 },
};
function dmg(a, d, power, cat) {
  const atk = cat === 'Special' ? a.spa : a.atk;
  const def = cat === 'Special' ? d.spd : d.def;
  return Math.floor(((2 * 50 / 5 + 2) * power * atk / def) / 50) + 2;
}
// name, decomp constant, type, derivedCategory, power, accuracy
const BATTLES = [
  { player: 'Mochii', foe: 'Razorgater', move: 'Water Gun', constant: 'MOVE_WATER_GUN', type: 'WATER', cat: 'Special', power: 40, acc: 100 },
  { player: 'Razorgater', foe: 'Mochii', move: 'Bite', constant: 'MOVE_BITE', type: 'DARK', cat: 'Special', power: 60, acc: 100 },
  { player: 'Tyrage', foe: 'Kittember', move: 'Tackle', constant: 'MOVE_TACKLE', type: 'NORMAL', cat: 'Physical', power: 35, acc: 95 },
  { player: 'Kittember', foe: 'Tyrage', move: 'Ember', constant: 'MOVE_EMBER', type: 'FIRE', cat: 'Special', power: 40, acc: 100 },
  { player: 'Zephling', foe: 'Squirmite', move: 'Gust', constant: 'MOVE_GUST', type: 'FLYING', cat: 'Physical', power: 40, acc: 100 },
  { player: 'Sproutle', foe: 'Pyropaw', move: 'Vine Whip', constant: 'MOVE_VINE_WHIP', type: 'GRASS', cat: 'Special', power: 35, acc: 100 },
];
const out = [];
BATTLES.forEach((bt, bi) => {
  const ps = STATS[bt.player], fs = STATS[bt.foe];
  const foeMax = fs.hp + 75;
  const b = createArenaBattle({ seed: 20261101 + bi,
    player: { name: bt.player, maxHp: ps.hp + 75, bodyType: 'grounded', moves: [{ name: bt.move, kind: bt.cat === 'Special' ? 'projectile' : 'melee', power: bt.power, accuracy: bt.acc, weight: 'light' }] },
    foe: { name: bt.foe, maxHp: foeMax, bodyType: 'grounded', moves: [{ name: 'Tackle', kind: 'melee', power: 35, accuracy: 95, weight: 'light' }] } });
  b.start();
  const raw = dmg(ps, fs, bt.power, bt.cat);
  let turns = 0, dealt = 0, sev = [];
  while (b.snapshot().foe.hp > 0 && turns < 12) {
    for (let t = 0; t < 30; t++) b.tick(100);
    b.chooseMove(0);
    const res = b.resolveAttack({ damage: raw });
    dealt += res.damageDealt; sev.push(res.severity); turns++;
    if (res.fainted) { b.finishResolution(); break; }
    b.finishResolution();
  }
  const el = vfx.elementForMoveType(bt.type);
  console.log(`REAL-MOVE ${bi + 1}: ${bt.player} ${bt.move} (${bt.constant} ${bt.type}/${bt.cat} ${bt.power}/${bt.acc}) -> ${el}/${vfx.familyFor(el).shape} vs ${bt.foe} (${foeMax} HP50): raw ${raw}, ${turns} turn(s) to ${b.snapshot().foe.hp === 0 ? 'KO' : 'cap'}, dealt ${dealt}, severities ${[...new Set(sev)].join('/')}`);
  out.push(Object.assign({}, bt, { foeMaxHp: foeMax, rawDmg: raw, turns, totalDealt: dealt, severities: [...new Set(sev)], vfxElement: el, ko: b.snapshot().foe.hp === 0 }));
});
console.log('REAL-MOVE SUMMARY: battles ' + out.length + ', KOs ' + out.filter(r => r.ko).length + ', turns ' + out.reduce((s, r) => s + r.turns, 0));
require('fs').writeFileSync(__dirname + '/playtest-step5-real-moves-results.json', JSON.stringify(out, null, 2));
