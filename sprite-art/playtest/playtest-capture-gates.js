// playtest-capture-gates.js — STEP 5 capture-path playtest (Mars
// 2026-10-25 ~19:49/19:51/19:54 CDT, final form).
//   Default capture: normal Luigi Cube throw (orb-throw formula, Gen VIII
//     documented form as implemented in captureLoop.js). ALWAYS available.
//   Optional capture: ring capture, Mochiichao's own version, played
//     inside a NEW retro-arcade-themed zone (name TBD — arcade-evocative,
//     NOT literally "Arcade Zone", NOT the Harbor City preserve/Safari,
//     which already exists in canon at the Dojo 6 / Wave-Ride beat).
//     Arcade is THEME/SETTING only (cabinets, neon, retro scenery as
//     vibe); it is NOT tested as a capture mechanic, and no arcade
//     mini-game is claimed as the capture method here.
//   Gate (tested exactly): zone visited AND played AND >= 1 ring item
//     owned -> ringAvailable true; anything else -> false, and a drawn
//     closed ring fills NOTHING and captures NOTHING.
//
// MODULE STATE NOTE (2026-10-25 ~20:10 CDT, honest, not a silent fix):
// the arena lane is mid-rewrite of captureLoop.js on local disk:
// arena-combat/package.json now says "type": "module", and
// captureLoop.test.js already imports createRingUnlock / visitRingZone /
// playRingZone, which are NOT in captureLoop.js yet, so the local module
// loads EMPTY under require (0 exported keys) and its own test fails to
// load. Editing another lane's in-flight file is out of scope here, so
// this harness implements ONLY the gate contract exactly as specified
// in captureLoop.js's header (visited+played+items>0; locked completeLoop
// returns available:false with meter unchanged) and labels itself a
// CONTRACT harness. Re-running it against the merged captureLoop.js once
// the arena lane lands its rewrite is OWED, not claimed done.
// Four exclusions apply: no Pokemon creature names, sounds, art, or
// dialogue anywhere in this file.
'use strict';
let realModuleKeys = 0;
try {
  const real = require('../arena-combat/captureLoop.js');
  realModuleKeys = Object.keys(real).length;
} catch (e) { realModuleKeys = -1; }
console.log('LOCAL captureLoop.js exported keys: ' + realModuleKeys + ' (0 = mid-rewrite, see header note; contract harness below)');
// --- contract implementation (mirrors the specified gate, nothing more) ---
function isRingCaptureUnlocked(u) {
  return !!u && u.zoneVisited === true && u.zonePlayed === true
    && typeof u.ringItems === 'number' && u.ringItems > 0;
}
function createRingCapture(unlock) {
  return { ringAvailable: isRingCaptureUnlocked(unlock), meter: 0, meterMax: 100, loopGain: 25, loopsCompleted: 0, captured: false };
}
function completeClosedLoop(enc) {
  if (enc.ringAvailable !== true) return { captured: false, meter: enc.meter, loops: enc.loopsCompleted, available: false };
  enc.meter = Math.min(enc.meterMax, enc.meter + enc.loopGain);
  enc.loopsCompleted += 1;
  if (enc.meter >= enc.meterMax) enc.captured = true;
  return { captured: enc.captured, meter: enc.meter, loops: enc.loopsCompleted, available: true };
}
function consumeRingItem(u) { return isRingCaptureUnlocked(u) ? u.ringItems - 1 : (typeof u.ringItems === 'number' ? u.ringItems : 0); }
// Orb-throw formula (Gen VIII documented form, as in captureLoop.js):
// X = ((3*max - 2*cur) * rate * mult / (3*max)) * lowLevelBonus; chance = (Y/65536)^4.
function captureChance(maxHp, hp, rate, mult, level) {
  const lv = level < 21 ? (30 - level) / 10 : 1;
  const x = ((3 * maxHp - 2 * hp) * rate * mult / (3 * maxHp)) * lv;
  if (x >= 255) return 1;
  const y = Math.floor(65536 / Math.pow(255 / Math.max(x, 1e-9), 3 / 16));
  return Math.pow(Math.min(1, y / 65536), 4);
}
console.log('--- A. DEFAULT: Luigi Cube (orb-throw) baseline ---');
for (const [label, hp, mult] of [['full HP, standard x1', 120, 1], ['1 HP, standard x1', 1, 1], ['full HP, sturdy x1.5', 120, 1.5], ['full HP, prime x2', 120, 2]]) {
  console.log(`  ${label}: chance=${(captureChance(120, hp, 45, mult, 5) * 100).toFixed(1)}%`);
}
console.log('--- B. GATED RING PATH: unlock flow for the NEW arcade-themed zone (name TBD) ---');
const states = [
  ['never visited zone', { zoneVisited: false, zonePlayed: false, ringItems: 0 }],
  ['visited, not played', { zoneVisited: true, zonePlayed: false, ringItems: 3 }],
  ['played, no ring items', { zoneVisited: true, zonePlayed: true, ringItems: 0 }],
  ['visited + played + 2 ring items (UNLOCKED)', { zoneVisited: true, zonePlayed: true, ringItems: 2 }],
];
for (const [label, unlock] of states) {
  const enc = createRingCapture(unlock);
  const res = completeClosedLoop(enc);
  console.log(`  ${label}: ringAvailable=${enc.ringAvailable} available=${res.available} meter=${res.meter} loops=${res.loops} captured=${res.captured}`);
}
console.log('--- C. UNLOCKED ring run: 4 loops fill the meter ---');
{
  const unlock = { zoneVisited: true, zonePlayed: true, ringItems: 2 };
  const enc = createRingCapture(unlock);
  console.log(`  start: ringItems=2 -> after consume at encounter start: ${consumeRingItem(unlock)}`);
  for (let i = 1; i <= 4; i++) {
    const res = completeClosedLoop(enc);
    console.log(`  loop ${i}: meter=${res.meter}/100 captured=${res.captured}`);
  }
  console.log('  NOTE: arcade theme is setting only — no cabinet/token mini-game was run or claimed as the capture method. Zone name TBD (candidates in Step 5 report, not locked here).');
}
