// balance-tuning.js — STEP 5 tuning, as DATA/CONFIG only (2026-10-25).
// This file changes NO core law and NO art frame: it does not edit
// arenaCombat.js, battleTreatments.js, any move power, or any animation
// timing constant in those modules. It is the tuning layer the arena /
// wiring lanes can adopt (or reject per item) in their own files.
// Every value below is justified by a numbered finding in
// STEP5-PLAYTEST-REPORT.md. Damage formula, move powers, and severity
// thresholds are deliberately NOT tuned here: the playtest severities
// already match their damage fractions exactly (light <=15%, medium
// <=35%, heavy <=60%, critical >60% or crit), so retuning them would
// falsify the read, not fix it.
'use strict';

// T1 — Multi-hit particle flood cap. Finding: Swarm Strike (3 hits, heavy
// per hit) fires 20 particles per hit = 60 in one turn, vs 20 for a single
// heavy hit and 28 for a single critical hit. The turn reads noisier than
// a critical hit while dealing less damage. Cap: per-hit particle counts
// scale [1.0, 0.7, 0.5, 0.5, ...] so a 3-hit heavy turn totals 44 instead
// of 60, still above a single heavy (20) and below a single critical
// turn only if the turn is also critical — see tunedParticlesForHits.
const MULTI_HIT_PARTICLE_SCALE = Object.freeze([1.0, 0.7, 0.5]);

// T2 — Multi-hit timeline is already compressed (3-hit turn 3030 ms vs
// 3 x 1720 ms = 5160 ms single-hit equivalent; extra hits cost 655 ms
// each, not a full timeline). NO timing change is made for multi-hit:
// recorded here as a checked-and-kept finding, not a silent retime.
const MULTI_HIT_TIMING = 'kept: 3030 ms for 3 hits, 655 ms per extra hit';

// T3 — Return-phase trim for non-fainting hits, presentation only.
// Finding: a 5-turn battle at 1720 ms per hit runs ~8.6 s of hit animation
// plus 3 s between-turn windows per turn (~23.6 s total). The 400 ms
// RETURN phase is travel back to start position; the faint path already
// skips RETURN entirely (faintMs 1000 + fadeMs 400), so trimming RETURN
// to 300 ms for non-fainting hits cannot break the faint read. Effect:
// single-hit timeline 1720 -> 1620 ms (-100 ms, -5.8%); a 5-turn battle
// saves 500 ms. Applied ONLY by playtest-step5-tuned.js as a computed
// variant until the arena lane adopts it in arenaCombat.js itself.
const RETURN_MS_BEFORE = 400;
const RETURN_MS_TUNED = 300;

function tunedTimelineMs(singleHitTimelineMs, fainted) {
  if (fainted) return singleHitTimelineMs; // faint path already skips RETURN
  return singleHitTimelineMs - (RETURN_MS_BEFORE - RETURN_MS_TUNED);
}
function tunedParticlesForHits(perHitCounts) {
  const list = Array.isArray(perHitCounts) ? perHitCounts : [];
  return Object.freeze(list.map((c, i) => {
    const s = i < MULTI_HIT_PARTICLE_SCALE.length
      ? MULTI_HIT_PARTICLE_SCALE[i]
      : MULTI_HIT_PARTICLE_SCALE[MULTI_HIT_PARTICLE_SCALE.length - 1];
    return Math.round(c * s);
  }));
}
function tunedParticlesTotal(perHitCounts) {
  return tunedParticlesForHits(perHitCounts).reduce((a, b) => a + b, 0);
}
module.exports = {
  MULTI_HIT_PARTICLE_SCALE, MULTI_HIT_TIMING,
  RETURN_MS_BEFORE, RETURN_MS_TUNED,
  tunedTimelineMs, tunedParticlesForHits, tunedParticlesTotal,
};
