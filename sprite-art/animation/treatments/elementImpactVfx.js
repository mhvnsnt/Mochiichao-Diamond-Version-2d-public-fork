// elementImpactVfx.js — impact flavour per True Element (STEP 4, 2026-10-25).
// Hooks INTO battleTreatments.js, does not duplicate it: the game still
// calls buildHitTimeline / buildParticleBurst for timing, count, angle,
// speed and size, then passes those particles through flavourParticles()
// to colour/shape them per move element. No timing constant is re-declared
// here. No commercial VFX, sprite, or audio is used: colours, shapes and
// motion below are original values written for Mochiichao.
// The 12 families are the 12 True Elements from uiArt.ts /
// validate-reference.ts: Water, Chrome, Earth, Bug, Umbral, Aero, Core,
// Strike, Deep, Flame, Mythic, Normal.
'use strict';

const ELEMENT_IMPACT = Object.freeze({
  Water:  Object.freeze({ colors: ['#38b6ff', '#7dd3fc', '#0ea5e9'], shape: 'drop',     speedMult: 1.00, sizeMult: 1.10, gravity:  900, drag: 0.10, ring: 'ripple',    flashTint: '#7dd3fc', impactSfx: 'impact_water' }),
  Chrome: Object.freeze({ colors: ['#e2e8f0', '#cbd5e1', '#94a3b8'], shape: 'shard',    speedMult: 1.25, sizeMult: 0.90, gravity:  300, drag: 0.05, ring: 'glint',     flashTint: '#e2e8f0', impactSfx: 'impact_chrome' }),
  Earth:  Object.freeze({ colors: ['#d6a35c', '#a16207', '#92400e'], shape: 'chunk',    speedMult: 0.85, sizeMult: 1.25, gravity: 1400, drag: 0.15, ring: 'dust',      flashTint: '#d6a35c', impactSfx: 'impact_earth' }),
  Bug:    Object.freeze({ colors: ['#a3e635', '#65a30d', '#fde047'], shape: 'mote',     speedMult: 0.90, sizeMult: 0.80, gravity:  100, drag: 0.45, ring: 'none',      flashTint: '#a3e635', impactSfx: 'impact_bug' }),
  Umbral: Object.freeze({ colors: ['#c4b5fd', '#7c3aed', '#312e81'], shape: 'wisp',     speedMult: 0.80, sizeMult: 1.20, gravity: -400, drag: 0.20, ring: 'smoke',     flashTint: '#7c3aed', impactSfx: 'impact_umbral' }),
  Aero:   Object.freeze({ colors: ['#ffffff', '#e0f2fe', '#bae6fd'], shape: 'streak',   speedMult: 1.40, sizeMult: 0.75, gravity:    0, drag: 0.05, ring: 'none',      flashTint: '#e0f2fe', impactSfx: 'impact_aero' }),
  Core:   Object.freeze({ colors: ['#fde68a', '#f59e0b', '#f97316'], shape: 'ember',    speedMult: 1.10, sizeMult: 1.00, gravity: -200, drag: 0.10, ring: 'shockwave', flashTint: '#f59e0b', impactSfx: 'impact_core' }),
  Strike: Object.freeze({ colors: ['#ffffff', '#fef08a', '#facc15'], shape: 'star',     speedMult: 1.30, sizeMult: 0.90, gravity:  200, drag: 0.05, ring: 'shockwave', flashTint: '#fef08a', impactSfx: 'impact_strike' }),
  Deep:   Object.freeze({ colors: ['#22d3ee', '#0f766e', '#164e63'], shape: 'bubble',   speedMult: 0.90, sizeMult: 1.05, gravity: -600, drag: 0.15, ring: 'ripple',    flashTint: '#22d3ee', impactSfx: 'impact_deep' }),
  Flame:  Object.freeze({ colors: ['#fbbf24', '#f97316', '#ef4444'], shape: 'flame',    speedMult: 1.15, sizeMult: 1.15, gravity: -500, drag: 0.10, ring: 'none',      flashTint: '#f97316', impactSfx: 'impact_flame' }),
  Mythic: Object.freeze({ colors: ['#f0abfc', '#a78bfa', '#67e8f9'], shape: 'sparkle',  speedMult: 1.00, sizeMult: 0.85, gravity: -100, drag: 0.25, ring: 'glint',     flashTint: '#a78bfa', impactSfx: 'impact_mythic' }),
  Normal: Object.freeze({ colors: ['#e5e7eb', '#d1d5db', '#9ca3af'], shape: 'puff',     speedMult: 1.00, sizeMult: 1.00, gravity:  400, drag: 0.20, ring: 'none',      flashTint: '#ffffff', impactSfx: 'impact_normal' }),
});
const TRUE_ELEMENTS = Object.freeze(Object.keys(ELEMENT_IMPACT));

// Legacy move-type names (moves.ts uses Pokemon-style type strings) mapped
// to True Elements. PROVISIONAL where marked: species.ts / moves.ts types
// are not yet unified to the 12 True Elements (validate-reference.ts
// warns on this, it does not fail) — this table is the wiring-time map
// until main lands that unification decision. No move is left unmapped.
const LEGACY_MOVE_TYPE_TO_ELEMENT = Object.freeze({
  WATER: 'Water', FIRE: 'Flame', GRASS: 'Earth', ELECTRIC: 'Strike',
  STEEL: 'Chrome', GROUND: 'Earth', GHOST: 'Umbral', DARK: 'Umbral',
  FLYING: 'Aero', NORMAL: 'Normal', PSYCHIC: 'Mythic', DRAGON: 'Mythic',
  FIGHTING: 'Strike', BUG: 'Bug', POISON: 'Umbral',
});
const PROVISIONAL_LEGACY_MAP = Object.freeze(['GRASS', 'ELECTRIC', 'DRAGON', 'POISON']);

function familyFor(element) {
  if (typeof element === 'string' && ELEMENT_IMPACT[element]) return ELEMENT_IMPACT[element];
  throw new Error('elementImpactVfx: unknown True Element ' + JSON.stringify(element));
}
function elementForMoveType(moveType) {
  if (typeof moveType === 'string' && LEGACY_MOVE_TYPE_TO_ELEMENT[moveType]) return LEGACY_MOVE_TYPE_TO_ELEMENT[moveType];
  if (typeof moveType === 'string' && ELEMENT_IMPACT[moveType]) return moveType;
  throw new Error('elementImpactVfx: unknown move type ' + JSON.stringify(moveType));
}
// Colour/shape a treatments-module burst WITHOUT changing its timing,
// count, angle, speed base, or size base: only the family multipliers
// and a deterministic colour pick (particle index cycles the 3 colours).
function flavourParticles(element, particles) {
  const fam = familyFor(element);
  const list = Array.isArray(particles) ? particles : [];
  return Object.freeze(list.map((p, i) => Object.freeze(Object.assign({}, p, {
    element, shape: fam.shape, color: fam.colors[i % fam.colors.length],
    speedPxPerSec: Math.round(p.speedPxPerSec * fam.speedMult),
    sizePx: Math.round(p.sizePx * fam.sizeMult * 100) / 100,
    gravityPxPerSec2: fam.gravity, drag: fam.drag, ring: fam.ring,
    flashTint: fam.flashTint, impactSfx: fam.impactSfx,
  }))));
}
// One-call hook for wiring: timeline severity particle count + family.
// The game passes the count from the built timeline (never re-derives it).
function buildElementImpact(element, options) {
  const opts = options || {};
  const count = Math.max(0, Math.floor(opts.count || 0));
  const fam = familyFor(element);
  return Object.freeze({
    element, shape: fam.shape, colors: fam.colors, ring: fam.ring,
    flashTint: fam.flashTint, impactSfx: fam.impactSfx,
    particleCount: count,
    // Renderer note, not a second timing system: particles live
    // TIMING.PARTICLE_MS (450 ms) per battleTreatments.js.
    lifeMs: 450,
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ELEMENT_IMPACT, TRUE_ELEMENTS, LEGACY_MOVE_TYPE_TO_ELEMENT,
    PROVISIONAL_LEGACY_MAP, familyFor, elementForMoveType,
    flavourParticles, buildElementImpact,
  };
}
