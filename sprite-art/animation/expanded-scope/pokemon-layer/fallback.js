// fallback.js — Layer 1 / Layer 2 wiring stub (BASE/FALLBACK layer).
//
// Purpose: every one of the 51 creatures gets generic coverage
// IMMEDIATELY from this layer (move scripts + generic treatments),
// and per-creature poses override/extend generic where present.
// Generic NEVER overrides a per-creature pose.
//
// Override order (highest wins; first hit wins, generic is the floor):
//   1. V3 final pose set (contour-fit mouths, Mars-approved "perfect":
//      kittember, tiidebiite)
//   2. V2 pose set (articulation-batch-a-retrofit V2, and/or
//      articulation-v2-rework eyes-only interim; 18 creatures —
//      see COVERAGE notes below)
//   3. GENERIC script/treatment (this layer) — always present
// Where a creature has only some sets, the missing sets fall back
// to generic: e.g. astroleviathan has base Batch C cells but NO
// V2/V3 pose set, so a V2/V3 pose slot for astroleviathan falls
// back to generic. Base articulation cells are listed in the
// coverage table as INFORMATION (all 51 have them); they are the
// raw material V2/V3 sets are built from, not a serving tier in
// this contract — the contract the task states is pose-vs-generic,
// and "pose" here means the V2/V3 pose sets.
//
// Mars-approved fully-final subset (2026-10-26 ~11:11 snapshot,
// NOT re-judged here): aquariios + reaperdile (V2 attacks) and
// kittember + tiidebiite (V3 attacks) = 4/51. The other V2 sets
// are staged (eyes-only interim where noted in the v2-rework
// manifests) — staged is not claimed as approved-final.
//
// Coverage data below was verified on disk 2026-10-26 (see
// LAYER-ORDER.md for the counting method). It is DATA, not code:
// the game reads it, it does not execute per-creature art from here.
// Nothing in this file modifies any articulation directory.
//
// Roster: the canonical 51 from
//   ../articulation/COVERAGE-51-CORRECTED.md
// (pilots 2 + arefit 8 + batch B 15 + batch C 15 + batch D 7 +
//  batch E 4; strikechamp counts as 3 looks, as it does there).

'use strict';

// Columns: [creature, baseCellsPresent, v2PosePresent, v3FinalPresent]
//   base: canonical home dir exists with 22 attack cells (pilots:
//     22 cells each under bare atk_* names in pilot/<creature>/).
//   v2: creature appears in the arefit manifest (8) OR in a
//     v2-rework manifest (batch-a 5 + batch-c 8 + batch-e 2 +
//     batch-d 9); union = 23 unique creatures. Batch-d manifest
//     entries for squirmite/stormtalon/terradog/zephling are Batch B
//     duplicates (excluded per the coverage doc's duplicate rule);
//     its other 5 entries (strikechamp x3, toxitacle, yogiferno)
//     are genuine Batch D sets and ARE counted here. (Correction
//     2026-10-26: an earlier version of this file counted 18,
//     missing the batch-d 5; re-counted from the batch-d manifest
//     keys + per-set GIFs on disk.)
//   v3Final: creature has an articulation-pipev3 dir + GIF
//     (kittember, tiidebiite only).
const COVERAGE = Object.freeze([
  ['mochii', true, false, false],
  ['dreadtoise', true, false, false],
  ['aquariios', true, true, false],
  ['chromejaww', true, true, false],
  ['kittember', true, true, true],
  ['razorgater', true, true, false],
  ['reaperdile', true, true, false],
  ['sproutle', true, true, false],
  ['tiidebiite', true, true, true],
  ['tyrage', true, true, false],
  ['aerobeak', true, false, false],
  ['cocoonode', true, false, false],
  ['duneclaw', true, false, false],
  ['finblade', true, false, false],
  ['manticlaw', true, false, false],
  ['megalochrome', true, false, false],
  ['mothrix', true, false, false],
  ['oblivirex', true, false, false],
  ['pupbble', true, false, false],
  ['pyropaw', true, false, false],
  ['quakehound', true, false, false],
  ['squirmite', true, false, false],
  ['stormtalon', true, false, false],
  ['terradog', true, false, false],
  ['zephling', true, false, false],
  ['ashemit', true, true, false],
  ['astroleviathan', true, false, false],
  ['cragarm', true, false, false],
  ['dorowani', true, true, false],
  ['duskfiend', true, false, false],
  ['floatcalf', true, true, false],
  ['gabu', true, true, false],
  ['gearkid', true, false, false],
  ['gorokappa', true, false, false],
  ['inklet', true, true, false],
  ['kickmaster', true, false, false],
  ['krakenox', true, true, false],
  ['mechapion', true, false, false],
  ['mythar', true, true, false],
  ['pebblefist', true, true, false],
  ['strikechamp', true, true, false],
  ['strikechamp_unsuited', true, true, false],
  ['strikechamp_unsuited_full', true, true, false],
  ['terrapod', true, false, false],
  ['toxitacle', true, true, false],
  ['wispkin', true, false, false],
  ['yogiferno', true, true, false],
  ['pixilite', true, false, false],
  ['punchkid', true, true, false],
  ['pyromonk', true, true, false],
  ['shellguard', true, false, false],
]);

const TIER_ORDER = Object.freeze(['v3Final', 'v2', 'generic']);

function coverageFor(creature) {
  for (const row of COVERAGE) {
    if (row[0] === creature) {
      return Object.freeze({
        creature: row[0],
        generic: true, // this layer covers all 51, always
        base: row[1],
        v2: row[2],
        v3Final: row[3],
      });
    }
  }
  return null; // unknown creature: caller must not invent coverage
}

// resolveAttack(creature, moveScript, options)
//   Returns which layer serves an attack slot:
//     { layer: 'per-creature'|'generic', tier, script, note }
//   The moveScript is ALWAYS returned, so generic can fill when
//   no pose set is present. Generic never overrides: if the
//   creature has a V3 or V2 set, layer is 'per-creature' even
//   though a generic script exists for the move.
function resolveAttack(creature, moveScript) {
  const cov = coverageFor(creature);
  if (!cov) {
    return Object.freeze({
      layer: 'generic', tier: 'generic',
      script: moveScript || null,
      note: 'Unknown creature: no per-creature coverage claimed; generic fills.',
    });
  }
  if (cov.v3Final) {
    return Object.freeze({
      layer: 'per-creature', tier: 'v3Final',
      script: moveScript || null,
      note: 'Per-creature V3 pose wins over generic.',
    });
  }
  if (cov.v2) {
    return Object.freeze({
      layer: 'per-creature', tier: 'v2',
      script: moveScript || null,
      note: 'Per-creature V2 pose wins over generic.',
    });
  }
  return Object.freeze({
    layer: 'generic', tier: 'generic',
    script: moveScript || null,
    note: 'No V2/V3 pose set for this creature; generic fills.',
  });
}

// resolveHurt(creature): same rule for hurt slots. Generic hurt
// (General_MonHit shake) is the floor; a per-creature hurt pose
// wins where the creature has a V2/V3 pose set.
function resolveHurt(creature) {
  const r = resolveAttack(creature, null);
  return Object.freeze({ layer: r.layer, tier: r.tier });
}

function coverageSummary() {
  let base = 0, v2 = 0, v3 = 0;
  for (const row of COVERAGE) {
    if (row[1]) base += 1;
    if (row[2]) v2 += 1;
    if (row[3]) v3 += 1;
  }
  return Object.freeze({
    roster: COVERAGE.length,
    generic: COVERAGE.length,
    base: base,
    v2: v2,
    v3Final: v3,
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COVERAGE, TIER_ORDER, coverageFor, resolveAttack, resolveHurt,
    coverageSummary,
  };
}
