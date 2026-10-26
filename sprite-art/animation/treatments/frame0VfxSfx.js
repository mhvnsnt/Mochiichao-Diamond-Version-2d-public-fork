// frame0VfxSfx.js — frame-0 (TELEGRAPH start, t = 0 ms) VFX + SFX hookup.
// Closes research-sweep wiring target (12): per-archetype AND per-element
// frame-0 effects. Hooks INTO elementImpactVfx.js (family shape/colours)
// and battleTreatments.js (TELEGRAPH is the first timeline phase, 0-300 ms);
// it declares no timing, no particle count, and no new element.
// Archetypes are the arena kinds: 'melee' (attacker closes in — charge
// glow ON the attacker at frame 0) and 'projectile' (muzzle glow at the
// attacker's launch point at frame 0). Multi-hit: frame 0 repeats once
// per sub-hit (same effect, subHitIndex 0..n-1); the wiring lane replays
// it per sub-hit, it is not a different effect.
// SFX keys are synth keys for the Web Audio manager (webAudioManager.js),
// not sample files: telegraph_<element> + impact_<element> (Step 4).
'use strict';
const vfx = require('./elementImpactVfx.js');

const FRAME0_BY_KIND = Object.freeze({
  melee: Object.freeze({ anchor: 'attacker', motion: 'charge_glow', note: 'Glow gathers on the attacker during TELEGRAPH; the strike itself is the Step 4 impact.' }),
  projectile: Object.freeze({ anchor: 'attacker_launch_point', motion: 'muzzle_glow', note: 'Glow gathers at the launch point during TELEGRAPH; the projectile travels in CAST/STRIKE.' }),
});

function frame0For(kind, element, options) {
  const k = FRAME0_BY_KIND[kind];
  if (!k) throw new Error('frame0VfxSfx: unknown archetype kind ' + JSON.stringify(kind));
  const fam = vfx.familyFor(element);
  const opts = options || {};
  const subHitIndex = typeof opts.subHitIndex === 'number' ? opts.subHitIndex : 0;
  const subHitTotal = typeof opts.subHitTotal === 'number' ? opts.subHitTotal : 1;
  if (subHitIndex < 0 || subHitIndex >= subHitTotal) throw new Error('frame0VfxSfx: subHitIndex out of range');
  return Object.freeze({
    atMs: 0, phase: 'TELEGRAPH', kind, element,
    anchor: k.anchor, motion: k.motion,
    shape: fam.shape, colors: fam.colors, flashTint: fam.flashTint,
    sfx: 'telegraph_' + element.toLowerCase(),
    impactSfx: fam.impactSfx,
    subHitIndex, subHitTotal,
  });
}
function frame0Combos() {
  const out = [];
  for (const kind of Object.keys(FRAME0_BY_KIND)) {
    for (const element of vfx.TRUE_ELEMENTS) out.push(frame0For(kind, element));
  }
  return Object.freeze(out);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FRAME0_BY_KIND, frame0For, frame0Combos };
}
