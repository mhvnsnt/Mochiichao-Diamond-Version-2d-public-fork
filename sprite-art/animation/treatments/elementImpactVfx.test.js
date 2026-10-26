// elementImpactVfx.test.js — run: node elementImpactVfx.test.js
'use strict';
const assert = require('assert');
const vfx = require('./elementImpactVfx.js');
const treatments = require('./battleTreatments.js');
let n = 0;
function check(name, fn) { fn(); n++; console.log('ok ' + n + ' - ' + name); }
check('12 True Elements, exact set', () => {
  assert.deepStrictEqual([...vfx.TRUE_ELEMENTS].sort(), ['Aero','Bug','Chrome','Core','Deep','Earth','Flame','Mythic','Normal','Strike','Umbral','Water'].sort());
});
check('every family has 3 colours, a shape, a ring, a flash tint, an impact SFX', () => {
  for (const el of vfx.TRUE_ELEMENTS) {
    const f = vfx.familyFor(el);
    assert.strictEqual(f.colors.length, 3, el);
    assert.ok(f.shape && f.ring && f.flashTint && f.impactSfx, el);
    assert.ok(f.speedMult > 0 && f.sizeMult > 0, el);
  }
});
check('family shapes are all distinct (no two elements share a look)', () => {
  const shapes = vfx.TRUE_ELEMENTS.map(e => vfx.familyFor(e).shape);
  assert.strictEqual(new Set(shapes).size, 12);
});
check('flavourParticles keeps treatments count/angles, only colours/shapes them', () => {
  const base = treatments.buildParticleBurst({ count: 12, seed: 7, direction: 1 });
  const out = vfx.flavourParticles('Flame', base);
  assert.strictEqual(out.length, 12);
  out.forEach((p, i) => {
    assert.strictEqual(p.angleRad, base[i].angleRad);
    assert.strictEqual(p.shape, 'flame');
    assert.ok(vfx.familyFor('Flame').colors.includes(p.color));
  });
});
check('flavourParticles is deterministic per element (same input, same colours)', () => {
  const base = treatments.buildParticleBurst({ count: 6, seed: 3 });
  assert.deepStrictEqual(vfx.flavourParticles('Water', base), vfx.flavourParticles('Water', base));
});
check('legacy move-type map covers all 15 moves.ts types', () => {
  const types = ['WATER','FIRE','GRASS','ELECTRIC','STEEL','GROUND','GHOST','DARK','FLYING','NORMAL','PSYCHIC','DRAGON','FIGHTING','BUG','POISON'];
  for (const t of types) assert.ok(vfx.TRUE_ELEMENTS.includes(vfx.elementForMoveType(t)), t);
  assert.deepStrictEqual([...vfx.PROVISIONAL_LEGACY_MAP].sort(), ['DRAGON','ELECTRIC','GRASS','POISON'].sort());
});
check('unknown element / move type throws (wiring errors surface, not silent Normal)', () => {
  assert.throws(() => vfx.familyFor('Fairy'));
  assert.throws(() => vfx.elementForMoveType('FAIRY'));
});
check('buildElementImpact reports count + family, life 450ms from treatments TIMING', () => {
  const r = vfx.buildElementImpact('Umbral', { count: 20 });
  assert.strictEqual(r.particleCount, 20);
  assert.strictEqual(r.lifeMs, treatments.TIMING.PARTICLE_MS);
  assert.strictEqual(r.ring, 'smoke');
});
console.log('elementImpactVfx: ' + n + '/' + n + ' checks pass');
