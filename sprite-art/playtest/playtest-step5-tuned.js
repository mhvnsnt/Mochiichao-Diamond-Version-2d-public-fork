// playtest-step5-tuned.js — STEP 5 tuned variant (2026-10-25).
// Reads the recorded playtest-step5-results.json (12 battles) and applies
// balance-tuning.js ONLY as computed variants. It re-runs no battle and
// edits no core module: before/after numbers are shown side by side so
// the arena lane can adopt or reject each tuning on evidence.
// Correct semantics (fixed 2026-10-25 after a first draft misread them):
// - results[].hits is one entry PER TURN, not per sub-hit. Sub-hit counts
//   come from playtest-step5.js BATTLES: Swarm Strike hits:3, all others 1.
// - timelineMs is the PER-HIT timeline. The faint path skips RETURN only
//   on the final (KO) turn, so the T3 return trim applies to every turn
//   EXCEPT the final turn of a KO battle.
// Run: node playtest-step5-tuned.js   (from this directory)
'use strict';
const fs = require('fs');
const tuning = require('./balance-tuning.js');
// Severity -> treatments particle count (battleTreatments.js SEVERITY).
const PARTICLES = { light: 6, medium: 12, heavy: 20, critical: 28 };
const SUBHITS = { 'Swarm Strike': 3 }; // playtest-step5.js BATTLES; default 1
const raw = JSON.parse(fs.readFileSync(__dirname + '/playtest-step5-results.json', 'utf8'));
const battles = raw.filter(r => r && typeof r === 'object' && r.player);
const out = battles.map(b => {
  const sub = SUBHITS[b.move] || 1;
  // Per-turn particles: one severity count per sub-hit, scaled by T1.
  const perTurnBefore = (b.hits || []).map(h => (PARTICLES[h.severity] || 0) * sub);
  const perTurnTuned = (b.hits || []).map(h => tuning.tunedParticlesTotal(
    Array(sub).fill(PARTICLES[h.severity] || 0)));
  // Per-turn timeline: T3 trim on every turn except the final KO turn.
  const perTurnTimelineBefore = (b.hits || []).map(() => b.timelineMs);
  const perTurnTimelineTuned = (b.hits || []).map((_, i) =>
    tuning.tunedTimelineMs(b.timelineMs, b.ko && i === b.hits.length - 1));
  return {
    player: b.player, foe: b.foe, move: b.move, turns: b.turns, subHits: sub,
    timelineMsPerTurnBefore: b.timelineMs,
    timelineMsPerTurnTuned: perTurnTimelineTuned[0],
    battleTimelineMsBefore: perTurnTimelineBefore.reduce((a, x) => a + x, 0),
    battleTimelineMsTuned: perTurnTimelineTuned.reduce((a, x) => a + x, 0),
    particlesPerTurnBefore: perTurnBefore[0],
    particlesPerTurnTuned: perTurnTuned[0],
    particlesBattleBefore: perTurnBefore.reduce((a, x) => a + x, 0),
    particlesBattleTuned: perTurnTuned.reduce((a, x) => a + x, 0),
  };
});
out.forEach(o => console.log(
  `${o.player} ${o.move} vs ${o.foe} (${o.turns} turns, ${o.subHits} sub-hit(s)): ` +
  `timeline/turn ${o.timelineMsPerTurnBefore} -> ${o.timelineMsPerTurnTuned} ms (battle ${o.battleTimelineMsBefore} -> ${o.battleTimelineMsTuned} ms); ` +
  `particles/turn ${o.particlesPerTurnBefore} -> ${o.particlesPerTurnTuned}`));
const tlBefore = out.reduce((s, o) => s + o.battleTimelineMsBefore, 0);
const tlTuned = out.reduce((s, o) => s + o.battleTimelineMsTuned, 0);
const pBefore = out.reduce((s, o) => s + o.particlesBattleBefore, 0);
const pTuned = out.reduce((s, o) => s + o.particlesBattleTuned, 0);
console.log(`TOTALS across 12 battles: hit-animation time ${tlBefore} -> ${tlTuned} ms (saved ${tlBefore - tlTuned} ms); particles ${pBefore} -> ${pTuned}`);
fs.writeFileSync(__dirname + '/playtest-step5-tuned-results.json', JSON.stringify(out, null, 2));
console.log('wrote playtest-step5-tuned-results.json');
