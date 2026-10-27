// demo.js — Pokemon-layer verification demo (run: node demo.js).
// No build step. Proves, with PASS/FAIL per check:
//   1. generic hurt + faint run (treatments + interpreter subs)
//   2. sample scripts end-to-end: 1 physical, 1 special, 1 status,
//      1 multi-hit — timed event logs, no error, ends with `end`
//   3. same scripts for aquariios (V2 -> per-creature wins) and
//      astroleviathan (no V2/V3 -> generic fills)
//   4. particle budget never exceeds 16 live (stress script)
//   5. waitforvisualfinish syncs before the next beat
//   6. full sweep: all 563 scripts run clean (two-turn both variants)
// Writes demo-output.log next to this file AND prints it.
// Per-creature art is NOT rendered here: the demo proves the
// LAYER RESOLUTION (pose wins vs generic fills) and the script
// execution, not the pixels — those live in the articulation dirs,
// untouched by this task.

'use strict';

const fs = require('fs');
const path = require('path');
const { runScript, MAX_LIVE_PARTICLES, SUBROUTINES } = require('./moveScripts');
const treatments = require('./treatments');
const fallback = require('./fallback');
const moveData = require('./moveScripts.json');

const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
const results = [];
function check(name, pass, detail) {
  results.push({ name, pass: !!pass });
  log((pass ? 'PASS' : 'FAIL') + '  ' + name + (detail ? '  -- ' + detail : ''));
}
function fmtEvents(events) {
  return events.map((e) => '  f' + String(e.frame).padStart(3, ' ') +
    ' (' + String(e.ms).padStart(4, ' ') + 'ms) ' + e.op +
    (e.detail ? ' ' + e.detail : '')).join('\n');
}

log('=== POKEMON LAYER DEMO ===');
log('Interpreter: FireRed 48-command model + Black 2 families, 60 fps.');
log('Scripts: ' + Object.keys(moveData.scripts).length + ' union moves ' +
  '(firered=' + moveData.sources.firered.moves + ' black2=' +
  moveData.sources.black2.moves + ', fallback=' + moveData.fallbackCount + ').');
log('');

// ---- Check 1: generic hurt + faint ----
log('--- Check 1: generic hurt + faint ---');
const hurt = treatments.hurtTreatment({ power: 120 });
log('hurtTreatment(power=120): xPx=' + hurt.shake.xPx +
  ' (120/12=10, clamp 1-16), shakes=' + hurt.shake.shakes +
  ', frames=' + hurt.totalFrames);
check('hurt amplitude power/12', hurt.shake.xPx === 10, '120/12=10');
const hurtClamped = treatments.hurtTreatment({ power: 300 });
check('hurt amplitude clamped to 16', hurtClamped.shake.xPx === 16, '300/12=25 -> 16');
const hurtFixed = treatments.hurtTreatment({});
check('hurt fixed 3px without power/damage', hurtFixed.shake.xPx === 3, 'Pound default');
const faint = treatments.faintTreatment({});
check('faint slide y+=5/frame', faint.yPerFrame === 5 && faint.beats[4].yOffsetPx === 25,
  'frame 5 -> y=25');
const flinch = treatments.flinchTreatment();
check('flinch = flag + skip, NO pose', flinch.skipsTurn === true &&
  flinch.pose === null && flinch.particle === null, 'STATUS2_FLINCHED');
const sleepT = treatments.statusTreatment('Sleep');
const bogusT = treatments.statusTreatment('NotAStatus');
check('status table: 9 entries, unknown -> null',
  treatments.STATUS_CONDITIONS.length === 9 && !!sleepT && bogusT === null,
  '9 conditions; Sleep found; unknown null, not guessed');
const statT = treatments.statChangeTreatment('up', 2);
check('stat-change up x2', statT.direction === 'up' && statT.stages === 2, '16 frames');
const genHit = runScript({ move: 'GENERAL_MON_HIT', steps: [
  { op: 'call', sub: 'sub_GeneralMonHit' }, { op: 'end' }] }, {});
log('General_MonHit event log:\n' + fmtEvents(genHit.events));
check('General_MonHit runs, ends, syncs', !genHit.stats.error &&
  genHit.events[genHit.events.length - 1].op === 'end' &&
  genHit.events.some((e) => e.op === 'waitforvisualfinish'), 'frames=' + genHit.stats.totalFrames);
const faintRun = runScript({ move: 'FAINT', steps: [
  { op: 'call', sub: 'sub_FaintSlide' }, { op: 'end' }] }, {});
check('FaintSlide runs, ends', !faintRun.stats.error &&
  faintRun.events[faintRun.events.length - 1].op === 'end', 'SE_FAINT + slide');
log('');

// ---- Check 2: one script per category, end-to-end ----
log('--- Check 2: sample scripts end-to-end ---');
const samples = [
  ['POUND', 'physical'],
  ['EMBER', 'special'],
  ['SWORDS_DANCE', 'status'],
  ['DOUBLE_SLAP', 'multi-hit'],
];
for (const [name, kind] of samples) {
  const script = moveData.scripts[name];
  if (!script) { check(kind + ' sample ' + name + ' exists', false, 'missing from moveScripts.json'); continue; }
  const out = runScript(script, { move: name });
  log(kind + ' ' + name + ' (template=' + script.template + ', family=' +
    script.family + ', fallback=' + script.fallback + '):');
  log(fmtEvents(out.events));
  const hasEnd = out.events[out.events.length - 1].op === 'end';
  const hasSync = out.events.some((e) => e.op === 'waitforvisualfinish');
  const framesOrdered = out.events.every((e, i) => i === 0 || e.frame >= out.events[i - 1].frame);
  check(kind + ' ' + name + ' runs end-to-end', !out.stats.error && hasEnd && hasSync && framesOrdered,
    'frames=' + out.stats.totalFrames + ' maxLive=' + out.stats.maxLiveParticles);
  check(kind + ' ' + name + ' particle budget', out.stats.maxLiveParticles <= MAX_LIVE_PARTICLES,
    'maxLive=' + out.stats.maxLiveParticles + ' <= 16');
}
log('');

// ---- Check 3: WITH vs WITHOUT per-creature poses ----
log('--- Check 3: per-creature wins where present, generic fills where absent ---');
const withCreature = 'aquariios'; // V2 (arefit), Mars-approved fully final
const withoutCreature = 'astroleviathan'; // Batch C base only, no V2/V3 pose set
for (const [name] of samples) {
  const script = moveData.scripts[name];
  const rWith = fallback.resolveAttack(withCreature, script);
  const rWithout = fallback.resolveAttack(withoutCreature, script);
  log(name + ': ' + withCreature + ' -> ' + rWith.layer + ' (' + rWith.tier + '); ' +
    withoutCreature + ' -> ' + rWithout.layer + ' (' + rWithout.tier + ')');
  check(name + ' ' + withCreature + ' per-creature wins', rWith.layer === 'per-creature', 'tier=' + rWith.tier);
  check(name + ' ' + withoutCreature + ' generic fills', rWithout.layer === 'generic' &&
    rWithout.script === script, 'generic script returned for fill');
}
const sum = fallback.coverageSummary();
log('Coverage summary: roster=' + sum.roster + ' generic=' + sum.generic +
  ' base=' + sum.base + ' v2=' + sum.v2 + ' v3Final=' + sum.v3Final);
check('generic covers 51/51', sum.generic === 51, '51/51');
check('v2/v3 pose counts from disk', sum.v2 === 23 && sum.v3Final === 2, 'v2=23 v3Final=2');
log('');

// ---- Check 4: particle budget stress ----
log('--- Check 4: particle budget stress (20 spawns, no sync between) ---');
const stressSteps = [];
for (let i = 0; i < 20; i++) {
  stressSteps.push({ op: 'createsprite', template: 'gStressSpriteTemplate', battler: 'target' });
}
stressSteps.push({ op: 'end' });
const stress = runScript({ move: 'STRESS', steps: stressSteps }, {});
log('stress: spawns=' + stress.stats.particleSpawns + ' dropped=' +
  stress.stats.particleDropped + ' maxLive=' + stress.stats.maxLiveParticles);
check('budget never exceeds 16 live', stress.stats.maxLiveParticles <= 16, 'maxLive=' + stress.stats.maxLiveParticles);
check('excess spawns dropped + logged', stress.stats.particleSpawns === 16 &&
  stress.stats.particleDropped === 4 &&
  stress.events.some((e) => e.op === 'particle_budget_full'), '16 spawned, 4 dropped');
log('');

// ---- Check 5: waitforvisualfinish sync ----
log('--- Check 5: waitforvisualfinish sync ---');
const syncScript = { move: 'SYNC', steps: [
  { op: 'createvisualtask', task: 'ShakeMon', battler: 'target', xPx: 3, yPx: 0, shakes: 6, frameDelay: 1 },
  { op: 'delay', frames: 2 },
  { op: 'waitforvisualfinish' },
  { op: 'playsewithpan', se: 'SE_M_DOUBLE_SLAP', pan: 'target' },
  { op: 'end' }] };
const sync = runScript(syncScript, {});
log(fmtEvents(sync.events));
const syncEv = sync.events.find((e) => e.op === 'waitforvisualfinish');
const afterEv = sync.events.find((e) => e.op === 'playsewithpan');
check('sync advances clock to latest task end (12)', !!syncEv && syncEv.frame === 12,
  'waitforvisualfinish at frame ' + (syncEv ? syncEv.frame : '?'));
check('next beat starts at/after sync', !!afterEv && !!syncEv && afterEv.frame >= syncEv.frame,
  'next beat frame ' + (afterEv ? afterEv.frame : '?'));
log('');

// ---- Check 6: full sweep, all 563 scripts ----
log('--- Check 6: full sweep, all scripts ---');
let sweepErrors = 0, sweepMaxLive = 0, sweepCount = 0, sweepVariants = 0;
for (const key of Object.keys(moveData.scripts)) {
  const script = moveData.scripts[key];
  const variants = script.variants ? ['charge', 'unleash'] : [null];
  for (const v of variants) {
    const out = runScript(script, v ? { move: key, variant: v } : { move: key });
    sweepCount += 1;
    if (v) sweepVariants += 1;
    if (out.stats.error) { sweepErrors += 1; log('SWEEP ERROR ' + key + (v ? ' (' + v + ')' : '') + ': ' + out.stats.error); }
    if (out.stats.maxLiveParticles > sweepMaxLive) sweepMaxLive = out.stats.maxLiveParticles;
  }
}
log('sweep: runs=' + sweepCount + ' (incl. ' + sweepVariants + ' two-turn variant runs), errors=' +
  sweepErrors + ', maxLive overall=' + sweepMaxLive);
check('all scripts run without error', sweepErrors === 0, sweepCount + ' runs');
check('sweep particle budget', sweepMaxLive <= MAX_LIVE_PARTICLES, 'maxLive=' + sweepMaxLive);
log('');

// ---- Summary ----
const failed = results.filter((r) => !r.pass);
log('=== SUMMARY: ' + (results.length - failed.length) + '/' + results.length +
  ' checks passed, ' + failed.length + ' failed ===');
if (failed.length) {
  for (const f of failed) log('FAILED: ' + f.name);
}
log('Subroutines in library: ' + Object.keys(SUBROUTINES).join(', '));
log('Hitstop note: 90 ms hitstop is a Mochiichao addition in ' +
  '../treatments/battleTreatments.js, NOT in these Pokemon-faithful scripts.');

const outPath = path.join(__dirname, 'demo-output.log');
fs.writeFileSync(outPath, lines.join('\n') + '\n');
log('Log saved: ' + outPath);
process.exit(failed.length ? 1 : 0);
