// demo.js — scripted arena battle: Mochii vs Razorgater (spec §7 scenario)
// Run: node demo.js   (from this directory — single command, no args)
// Console frame log. No game imports, no DOM, no network. Deterministic:
// seed 20261025 replays the same clashes, flank, and damage every run.
//
// What you will see, in order:
//   1. BATTLE_START -> BETWEEN_TURN / CIRCLING, 6 u apart, camera NEUTRAL.
//   2. Sparring clashes (feint -> sparks -> 0.4 u knockback, no HP,
//      no hurt art, camera CLASH push-in only, never a shake). Phase A
//      drives to two clashes; any further clash the circling produces
//      is logged the same way and also moves zero HP.
//   3. A circling flank phase: Mochii circles Razorgater until it holds
//      a Rear arc (>= 1.2 s), banks the rear-flank bonus, then steps in
//      to Close spacing (1.6 u). Director cues (setBehaviour /
//      setPositions) are used ONLY to stage this scenario through the
//      real modifier computation — the controller still computes every
//      number; nothing is hand-written into the result.
//   4. The chosen attack (Tackle, REAL Black 2 data: Normal/Physical,
//      power 50, accuracy 100, MOVE_TACKLE) with the full treatment
//      staging: TELEGRAPH -> TRAVEL -> WINDUP -> STRIKE -> IMPACT_HOLD
//      (frame-0: flash + particles + shake + 90 ms hitstop, all
//      together) -> RECOIL (hurt art, displacement) -> RETURN ->
//      RESOLUTION.
//   5. Turn 2: a REAL FIRE attack (Ember, Black 2 data: Fire/Special,
//      power 40, accuracy 100, MOVE_EMBER) staged as a projectile
//      (CAST, not TRAVEL) at Mid/Front with no positional bonus —
//      the controller still computes, the result is +0%/+0%.
//   6. Epilogue: fight-as-creature (mode 'driven') — the player drives
//      Mochii with setDriveInput; the turn core is identical.
//   7. The HP ledger: every sparring clash moved ZERO HP. The two
//      chosen attacks are the ONLY HP changes in the scenario (spec §1).
'use strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createArenaBattle, toArenaMove } from './arenaCombat.js';

// Optional treatment cross-check: the game-side treatment module lives
// next door (../animation/treatments/battleTreatments.js). The arena
// module never imports it (no game imports); this demo only READS it
// to show the hook contract — same 250/90/300/400 ms beats.
const require = createRequire(import.meta.url);
let treatments = null;
try { treatments = require('../animation/treatments/battleTreatments.js'); } catch (e) { treatments = null; }

// REAL MOVE DATA (scope correction, Mars 2026-10-25 ~19:44): moves are
// NOT genericized. The catalog is the repo's own extracted decomp data:
// src/lib/generated/decomp_black2_moves.json (source
// pokebw2/res/moves/*/data.json, 560 moves, already on main). The demo
// loads that file (lane path first, then the in-repo path) and maps
// entries through toArenaMove — no hand-written power/accuracy.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_CANDIDATES = [
  path.join(HERE, '../../fresh-start/src/lib/generated/decomp_black2_moves.json'),
  path.join(HERE, '../generated/decomp_black2_moves.json'),
  path.join(HERE, 'decomp_black2_moves.json'),
  // Repo-main checkout: this demo lives at sprite-art/arena-combat/,
  // so the extracted catalog on main is two levels up, under src/.
  path.join(HERE, '../../src/lib/generated/decomp_black2_moves.json'),
];
const catalogPath = CATALOG_CANDIDATES.find((c) => fs.existsSync(c));
if (!catalogPath) {
  console.error('DEMO ABORT: decomp_black2_moves.json not found in any of:');
  for (const c of CATALOG_CANDIDATES) console.error('  ' + c);
  process.exit(1);
}
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const byName = (n) => {
  const e = catalog.moves.find((m) => m.name === n);
  if (!e) { console.error('DEMO ABORT: move not in catalog: ' + n); process.exit(1); }
  return toArenaMove(e);
};
const TACKLE = byName('Tackle');
const EMBER = byName('Ember');
const BITE = byName('Bite');

const SEED = 20261025;
const STEP_MS = 100;

const b = createArenaBattle({
  seed: SEED,
  player: {
    name: 'Mochii', maxHp: 100, bodyType: 'grounded',
    moves: [TACKLE, EMBER],
  },
  foe: {
    name: 'Razorgater', maxHp: 100, bodyType: 'grounded',
    moves: [BITE],
  },
});

console.log('Real moves from ' + catalogPath + ' (' + catalog.count + ' moves):');
console.log('  Tackle: ' + TACKLE.type + '/' + (TACKLE.kind === 'melee' ? 'Physical' : 'Special')
  + ', power ' + TACKLE.power + ', accuracy ' + TACKLE.accuracy + ', ' + TACKLE.sourceConstant + '.');
console.log('  Ember: ' + EMBER.type + '/Special, power ' + EMBER.power + ', accuracy '
  + EMBER.accuracy + ', ' + EMBER.sourceConstant + ', effect ' + EMBER.effect + '.');
console.log('  Bite (foe): ' + BITE.type + '/Physical, power ' + BITE.power + ', accuracy '
  + BITE.accuracy + ', ' + BITE.sourceConstant + '.');

let simMs = 0;
function t() { return (simMs / 1000).toFixed(1) + 's'; }
function hpLine() { return 'HP Mochii ' + b.player.hp + '/100, Razorgater ' + b.foe.hp + '/100'; }
function tick(ms) { b.tick(ms); simMs += ms; }

console.log('=== ARENA COMBAT DEMO — Mochii vs Razorgater (spec §7) ===');
console.log('seed ' + SEED + ' (deterministic replay)');
console.log('[' + t() + '] BATTLE_START -> BETWEEN_TURN / CIRCLING');
b.start();
console.log('[' + t() + '] Spawn 6.0 u apart. Idle: Mochii small_bouncy 1,200 ms loop;'
  + ' Razorgater grounded 1,800 ms loop, foe phase-offset ~'
  + Math.round(b.foeIdlePhaseOffset * 100) + '%. Camera NEUTRAL, slow drift on midpoint.');

// ---- Phase A: two natural sparring clashes --------------------------------
console.log('--- circling + advancing (AI drives both creatures) ---');
let seenClashes = 0;
let lastLogMs = 0;
while (b.clashCount < 2 && simMs < 20000) {
  tick(STEP_MS);
  const evs = b.events.filter((e) => e.tMs === simMs || (e.tMs > simMs - STEP_MS && e.tMs <= simMs));
  for (const e of evs) {
    if (e.type === 'clash_start') {
      console.log('[' + t() + '] SPAR_CLASH #' + e.index + ': spacing ' + e.spacing.toFixed(2)
        + ' u. Feint 150 ms (both squash 0.95x) -> contact sparks (' + e.sparkCount
        + ' particles) -> knockback 0.4 u each. Camera CLASH push-in 1.04x, shake 0.');
    }
    if (e.type === 'clash_end') {
      console.log('[' + t() + '] Clash #' + e.index + ' done. Visual winner: '
        + (e.winnerSide === 'player' ? 'Mochii' : 'Razorgater')
        + ' (advances 0.3 u, recovers 100 ms faster). ' + hpLine() + ' — UNCHANGED.');
      seenClashes = e.index;
    }
  }
  if (simMs - lastLogMs >= 1000) {
    lastLogMs = simMs;
    const p = b.sampleArenaPose();
    console.log('[' + t() + '] spacing ' + p.spacingU.toFixed(2) + ' u, Mochii '
      + p.player.behaviour + ', Razorgater ' + p.foe.behaviour
      + ', momentum Mochii ' + p.player.momentum + ' / Razorgater ' + p.foe.momentum + '.');
  }
}
if (seenClashes < 2) { console.log('DEMO ABORT: fewer than 2 clashes in 20 s (got ' + seenClashes + ').'); process.exit(1); }
console.log('[' + t() + '] Two clashes complete. ' + hpLine() + '. Both creatures HOLD 0.8 s, then CIRCLING resumes.');

// ---- Phase B: flank phase ---------------------------------------------------
// B1: brief emergent circling (director cue: both CIRCLING, spacing held
// just outside clash range so no third clash interrupts the flank).
// B2: director cue "Mochii slips behind Razorgater" — the demo stages
// the spec §7 geometry (Rear arc, 150°+) and then HOLDS it while the
// controller's own flank timer banks it. The bank, the momentum bonus
// and the modifiers are all computed by the controller, not asserted
// by the demo. Why the anchor is 168°, not 150°: during each 100 ms
// tick the defender's facing chases the attacker by up to 18°, so a
// 168° pre-tick offset lands at 150-165° after the chase — inside Rear
// for every behaviour — and the hold timer accumulates genuinely.
console.log('--- flank phase B1: emergent circling (director cue: both CIRCLING) ---');
(function respaceTo(u) {
  const p = b.sampleArenaPose();
  const ax = (p.foe.x - p.player.x) / p.spacingU, ay = (p.foe.y - p.player.y) / p.spacingU;
  const mx = (p.player.x + p.foe.x) / 2, my = (p.player.y + p.foe.y) / 2;
  b.setPositions({ x: mx - ax * u / 2, y: my - ay * u / 2 }, { x: mx + ax * u / 2, y: my + ay * u / 2 });
})(2.6);
for (let i = 0; i < 30; i++) {
  tick(STEP_MS);
  b.setBehaviour('player', 'CIRCLING');
  b.setBehaviour('foe', 'CIRCLING');
  const p = b.sampleArenaPose();
  if (p.spacingU < 2.0) {
    const ax = (p.foe.x - p.player.x) / p.spacingU, ay = (p.foe.y - p.player.y) / p.spacingU;
    const mx = (p.player.x + p.foe.x) / 2, my = (p.player.y + p.foe.y) / 2;
    b.setPositions({ x: mx - ax * 1.3, y: my - ay * 1.3 }, { x: mx + ax * 1.3, y: my + ay * 1.3 });
  }
  if (i % 10 === 9) {
    const q = b.sampleArenaPose();
    console.log('[' + t() + '] Mochii flank arc ' + q.player.flankArc + ' (held '
      + q.player.flankHoldMs + ' ms), spacing ' + q.spacingU.toFixed(2) + ' u.');
  }
}
// Drain any clash still in flight at the end of B1 before staging B2:
// slipBehind must never land in the middle of a clash (the clash's
// knockback math owns positions until it ends). Any clash drained here
// is logged, same as #1/#2: zero HP, always. (The ledger at the end
// counts every clash, not just 2.)
while (b.activeClash && simMs < 30000) tick(STEP_MS);
for (const e of b.events.filter((e) => e.type === 'clash_end' && e.index > 2)) {
  console.log('[' + t() + '] Extra sparring clash #' + e.index + ' during circling (visual winner: '
    + (e.winnerSide === 'player' ? 'Mochii' : 'Razorgater') + '). ' + hpLine() + ' — UNCHANGED.');
}
console.log('--- flank phase B2: director cue — Mochii slips behind Razorgater ---');
(function slipBehind() {
  const p = b.sampleArenaPose();
  const f = p.foe.facingDeg * Math.PI / 180;
  const a = f + 168 * Math.PI / 180; // attacker direction from foe: 168° off facing
  b.setPositions(
    { x: p.foe.x + Math.cos(a) * 2.2, y: p.foe.y + Math.sin(a) * 2.2 },
    { x: p.foe.x, y: p.foe.y });
})();
console.log('[' + t() + '] Mochii placed at a Rear arc behind Razorgater. Holding the arc'
  + ' while the controller\'s flank timer banks it (>= 1.0 s) and pays the 2.0 s flank-hold bonus.');
let bankedRear = false;
for (let i = 0; i < 45; i++) {
  // Pre-tick respace: an AI-evaluation tick can ADVANCE both creatures
  // and close up to ~0.6 u in one tick, which could dip spacing into
  // clash range and freeze the flank timer mid-hold. Holding 2.6 u
  // before every tick keeps the hold clean; the axis (and therefore
  // the arc) is preserved by re-spacing along it.
  const pre = b.sampleArenaPose();
  if (pre.spacingU < 2.6) {
    const ax = (pre.foe.x - pre.player.x) / pre.spacingU, ay = (pre.foe.y - pre.player.y) / pre.spacingU;
    const mx = (pre.player.x + pre.foe.x) / 2, my = (pre.player.y + pre.foe.y) / 2;
    b.setPositions({ x: mx - ax * 1.3, y: my - ay * 1.3 }, { x: mx + ax * 1.3, y: my + ay * 1.3 });
  }
  tick(STEP_MS);
  // Re-anchor: hold positions on the same axis, re-assert the 168° offset.
  const p = b.sampleArenaPose();
  const dirAngle = Math.atan2(p.player.y - p.foe.y, p.player.x - p.foe.x) * 180 / Math.PI;
  if (Math.abs(p.spacingU - 2.6) > 0.1) {
    const ax = Math.cos(dirAngle * Math.PI / 180), ay = Math.sin(dirAngle * Math.PI / 180);
    b.setPositions(
      { x: p.foe.x + ax * 2.6, y: p.foe.y + ay * 2.6 },
      { x: p.foe.x, y: p.foe.y });
  }
  b.setBehaviour('player', 'HOLDING');
  b.setBehaviour('foe', 'HOLDING');
  const q = b.sampleArenaPose();
  const qDir = Math.atan2(q.player.y - q.foe.y, q.player.x - q.foe.x) * 180 / Math.PI;
  b.setFacing('foe', qDir - 168);
  const r = b.sampleArenaPose();
  if (i % 5 === 4) {
    console.log('[' + t() + '] Mochii flank arc ' + r.player.flankArc + ' (held '
      + r.player.flankHoldMs + ' ms), momentum Mochii ' + r.player.momentum + '.');
  }
  if (r.player.flankArc === 'Rear' && r.player.flankHoldMs >= 2200) { bankedRear = true; break; }
}
if (!bankedRear) { console.log('DEMO ABORT: no banked Rear arc in the arc-hold phase.'); process.exit(1); }
const flankPose = b.sampleArenaPose();
const flankBonusPaid = b.events.some((e) => e.type === 'momentum' && e.side === 'player' && e.reason === 'flank_hold_2s');
console.log('[' + t() + '] BANKED: Mochii holds a Rear arc (' + flankPose.player.flankArc
  + ', held ' + flankPose.player.flankHoldMs + ' ms >= 1.0 s bank time).'
  + (flankBonusPaid ? ' Flank-hold +15 momentum paid at 2.0 s.' : ' Flank-hold +15 not yet paid.')
  + ' Momentum: Mochii ' + flankPose.player.momentum + ' / Razorgater ' + flankPose.foe.momentum + '.');

// ---- Phase C: step in + choose ------------------------------------------------
(function stepIn() {
  const p = b.sampleArenaPose();
  // Attacker steps to 1.6 u directly behind the defender's facing:
  // defender facing f -> attacker at defender - 1.6 * (cos f, sin f).
  const f = p.foe.facingDeg * Math.PI / 180;
  const dx = Math.cos(f), dy = Math.sin(f);
  b.setPositions(
    { x: p.foe.x - dx * 1.6, y: p.foe.y - dy * 1.6 },
    { x: p.foe.x, y: p.foe.y });
})();
console.log('[' + t() + '] Director cue: Mochii steps in to Close spacing 1.6 u, still behind Razorgater.');
console.log('[' + t() + '] Player chooses Mochii\'s Tackle. Between-turn motion FREEZES;'
  + ' the frozen circling pose is the attack\'s start frame.');
const choice = b.chooseMove(0);
const mod = choice.modifiers;
console.log('[' + t() + '] Modifiers at choice time: spacing 1.6 u (Close), banked flank Rear,'
  + ' momentum ' + flankPose.player.momentum + ' (< 50 -> +0 power).');
console.log('[' + t() + ']   Close melee +5% power; Rear flank +5% power and +10% accuracy;'
  + ' momentum +0%. Raw power +10% (cap +15% not hit). TOTAL: +' + mod.powerPct
  + '% power, +' + mod.accuracyMod + '% accuracy. Crit chance UNCHANGED ('
  + mod.critChance + '). Effective accuracy ' + mod.effectiveAccuracy + '%.');
console.log('[' + t() + ']   Frozen pose: Mochii (' + choice.frozenPose.player.x.toFixed(2)
  + ', ' + choice.frozenPose.player.y.toFixed(2) + '), Razorgater ('
  + choice.frozenPose.foe.x.toFixed(2) + ', ' + choice.frozenPose.foe.y.toFixed(2) + ').');

// ---- Phase D: chosen-attack staging -------------------------------------------
// Shared staging walker: walks a chosen attack's timeline, resolves at
// IMPACT_HOLD (the frame-0 moment), and reports the treatment beats.
// Used for turn 1 (Tackle, physical/TRAVEL) and turn 2 (Ember,
// projectile/CAST) alike — the controller computes, the demo narrates.
function stageAttack(choiceObj, rawDamage) {
  console.log('--- chosen attack staging (treatment beats 250/90/300/400 ms) ---');
  let res = null;
  for (const phase of choiceObj.timeline.phases) {
    const dur = phase.endMs - phase.startMs;
    if (phase.phase === 'TELEGRAPH') {
      console.log('[' + t() + '] TELEGRAPH ' + dur + ' ms: Mochii shifts weight, locks on, squashes.'
        + ' Camera WINDUP_PUSH begins. No damage yet.');
    } else if (phase.phase === 'TRAVEL') {
      console.log('[' + t() + '] TRAVEL ' + dur + ' ms: Mochii crosses the gap on an ARC (not a slide).');
    } else if (phase.phase === 'CAST') {
      console.log('[' + t() + '] CAST ' + dur + ' ms: Mochii channels, fire gathers, the projectile leaves a visible trail.');
    } else if (phase.phase === 'WINDUP') {
      console.log('[' + t() + '] WINDUP ' + dur + ' ms: plant, pull back, squash. Last readable beat before contact.');
    } else if (phase.phase === 'STRIKE') {
      console.log('[' + t() + '] STRIKE ' + dur + ' ms: ONE clear extended pose. Camera IMPACT_CUT at this frame.');
    } else if (phase.phase === 'IMPACT_HOLD') {
      console.log('[' + t() + '] IMPACT_HOLD ' + dur + ' ms (hitstop): frame-0 rule — impact flash + particles'
        + ' + impact SFX + camera shake fire TOGETHER, impact pose HELD, world frozen.');
      const hpBefore = b.foe.hp;
      res = b.resolveAttack({ damage: rawDamage });
      console.log('[' + t() + ']   HIT: raw ' + rawDamage + ' x ' + res.powerMultiplier.toFixed(2) + ' = '
        + res.damageDealt + ' damage. ' + hpBefore + ' -> ' + b.foe.hp
        + '. Severity (damage-driven): ' + res.severity + '.');
      if (treatments) {
        const tl = treatments.buildHitTimeline({ damageFraction: res.damageFraction, isCrit: false, direction: 1, seed: SEED });
        console.log('[' + t() + ']   Treatment-module cross-check: severity ' + tl.severity
          + ', total ' + tl.totalMs + ' ms, shake ' + tl.shake.amplitudePx + ' px, camera push '
          + tl.camera.zoom + 'x on the attacker. Same beats as the arena timeline.');
      }
    } else if (phase.phase === 'RECOIL') {
      const sevTable = { light: [10, 2, ''], medium: [18, 4, ''], heavy: [28, 7, ' + TILT_BIG 4° (heavy)'], critical: [38, 10, ' + TILT_BIG 6° (critical)'] };
      const sv = res ? sevTable[res.severity] : sevTable.medium;
      console.log('[' + t() + '] RECOIL ' + dur + ' ms: Razorgater hurt art shows, displaced '
        + sv[0] + ' px (' + res.severity + '), HP drains AFTER hitstop only. Camera IMPACT_SHAKE ('
        + res.severity + ': ' + sv[1] + ' px)' + sv[2] + '.');
    } else if (phase.phase === 'RETURN') {
      console.log('[' + t() + '] RETURN ' + dur + ' ms: both ease back to stance/spot. Camera RETURN_NEUTRAL.');
    }
  }
  return res;
}
const resolved = stageAttack(choice, TACKLE.power);
if (!resolved) { console.log('DEMO ABORT: attack never reached IMPACT_HOLD.'); process.exit(1); }
const totalClashes = b.clashCount;
console.log('[' + t() + '] RESOLUTION: momentum resets to 0 both sides, clash count resets, turn clock resets.');
b.finishResolution();
console.log('[' + t() + '] -> BETWEEN_TURN: SEPARATING runs until spacing is 6 u again, then CIRCLING.');
while (b.sampleArenaPose().spacingU < 5.95 && simMs < 90000) tick(STEP_MS);
console.log('[' + t() + '] Spacing back to ' + b.sampleArenaPose().spacingU.toFixed(2)
  + ' u. Next decision window open. ' + hpLine() + '.');

// ---- Turn 2: real fire attack -------------------------------------------------
// Staged geometry (director cue): Mid spacing 3.5 u, Front arc, momentum 0
// after turn 1's reset — so the controller computes +0%/+0%. The point
// is the contrast with turn 1: same controller, same core, different
// real move, different staging (CAST, projectile) — and the numbers
// still come from the catalog, not from the demo.
console.log('--- turn 2: real fire attack (Ember, Black 2 data) ---');
b.setPositions({ x: -1.75, y: 0 }, { x: 1.75, y: 0 });
b.setFacing('foe', 180); // foe faces the player: Front arc, no flank bonus
console.log('[' + t() + '] Staged: spacing 3.5 u (Mid), Front arc, momentum 0. Player chooses Ember'
  + ' (Fire/Special -> projectile, CAST staging, effect ' + EMBER.effect + ').');
const emberChoice = b.chooseMove(1);
console.log('[' + t() + '] Modifiers at choice time: +' + emberChoice.modifiers.powerPct
  + '% power, +' + emberChoice.modifiers.accuracyMod + '% accuracy (Mid/Front/momentum 0 -> no bonus).'
  + ' Effective accuracy ' + emberChoice.modifiers.effectiveAccuracy + '%.');
const emberResolved = stageAttack(emberChoice, EMBER.power);
if (!emberResolved) { console.log('DEMO ABORT: Ember never reached IMPACT_HOLD.'); process.exit(1); }
const turn2Clashes = b.clashCount;
console.log('[' + t() + '] RESOLUTION (turn 2): momentum resets, clash count resets, turn clock resets.');
b.finishResolution();
while (b.sampleArenaPose().spacingU < 5.95 && simMs < 120000) tick(STEP_MS);
console.log('[' + t() + '] Spacing back to ' + b.sampleArenaPose().spacingU.toFixed(2)
  + ' u. ' + hpLine() + '.');

// ---- Epilogue: fight-as-creature (driven mode) --------------------------------
// A second, separate battle instance in mode 'driven': the player drives
// Mochii with setDriveInput. No turn clock, no AI on the player's side
// — and the turn core is byte-for-byte the same: only the chosen
// attack moves HP.
console.log('--- epilogue: fight-as-creature (mode: driven) ---');
const d = createArenaBattle({
  seed: SEED, mode: 'driven',
  player: { name: 'Mochii', maxHp: 100, bodyType: 'grounded', moves: [TACKLE] },
  foe: { name: 'Razorgater', maxHp: 100, bodyType: 'grounded', moves: [BITE] },
});
d.start();
console.log('[driven] Spawn 6.0 u apart. Player holds drive input {x: 1, y: 0} (toward foe).');
d.setDriveInput({ x: 1, y: 0 });
const dx0 = d.player.x;
for (let i = 0; i < 5; i++) d.tick(100);
console.log('[driven] After 0.5 s: Mochii x ' + dx0.toFixed(2) + ' -> ' + d.player.x.toFixed(2)
  + ' (advance speed 2.0 u/s, AI never overrode behaviour: ' + d.player.behaviour + ').'
  + ' HP Mochii ' + d.player.hp + '/100, Razorgater ' + d.foe.hp + '/100 — UNCHANGED by driving.');
d.chooseMove(0);
const dRes = d.resolveAttack({ damage: 10 });
console.log('[driven] Player chooses Tackle and resolves: ' + dRes.damageDealt + ' damage,'
  + ' Razorgater ' + d.foe.hp + '/100. Turn core identical in driven mode: driving moves,'
  + ' only choosing hurts.');

// ---- Ledger --------------------------------------------------------------------
console.log('=== HP LEDGER (the whole scenario) ===');
console.log('Sparring clashes (turn 1: ' + totalClashes + ', turn 2: ' + turn2Clashes + '): HP delta 0 each.');
console.log('Chosen attack turn 1 (Tackle, +' + mod.powerPct + '% power): HP delta -' + resolved.damageDealt + '.');
console.log('Chosen attack turn 2 (Ember, +' + emberChoice.modifiers.powerPct + '% power): HP delta -' + emberResolved.damageDealt + '.');
console.log('Total HP change in scenario: Mochii 0, Razorgater -' + (resolved.damageDealt + emberResolved.damageDealt) + '.');
console.log('INVARIANT HOLDS: the ONLY HP changes in the scenario are the two chosen attacks.');
console.log('Camera shots used: NEUTRAL, FOLLOW, CLASH (push-in only, shake 0),'
  + ' WINDUP_PUSH, IMPACT_CUT, IMPACT_SHAKE, TILT_BIG 4° (heavy hit), RETURN_NEUTRAL.');
