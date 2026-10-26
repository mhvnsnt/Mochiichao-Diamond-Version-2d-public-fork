// fanMechanics.js — Mochiichao arena mechanics rebuilt from fan-project
// research (LOCAL BUILD, 2026-10-25; see FAN-MECHANICS-SUMMARY.md).
//
// ORIGINAL CODE. No file, sprite, audio asset or code block from any
// fan project was copied here. Mechanics below are reimplementations
// of publicly described patterns (aim shapes, dash charges, knockback
// decay, energy/cooldown economy, AI spacing + threat dodge, move
// scoring with reach falloff, switch scoring, sudden-death ramp,
// softened type steps, ground marks, invulnerability windows, and a
// Perfect Dodge adapted to Mochiichao's turn-based rules), written in
// this module's own structure and units.
//
// TURN-BASED LAW (ARENA-COMBAT-SPEC.md §1): everything in this file
// that runs BETWEEN turns is visual/positional only — it never moves
// HP, inflicts a status, or faints a creature. Real damage happens
// only when a chosen attack resolves, through the game's own battle
// system (arenaCombat.js). Two dodge concepts are kept apart on
// purpose:
//   * sparring dodge: a between-turn visual dodge (dodgeRoll used by
//     the AI/movement layer). It changes position and nothing else.
//   * chosen Dodge action: a turn-costing defensive choice. When the
//     defender's chosen action is Dodge and the dodge window covers
//     the incoming chosen attack, that attack deals 0 damage. This
//     is the ONLY dodge in this module that touches damage, and it
//     does so only because the player spent their turn on it.
//
// No DOM, no game imports, no Math.random in the deterministic paths
// except where the caller injects an rng (capture rolls, AI noise).
// Node-testable: node --test fanMechanics.test.js

'use strict';

// ---------------------------------------------------------------- constants
const FAN = Object.freeze({
  // Dash: 3 charges, one back every 3 s, brief travel + i-frames.
  // (Source pattern: 3 charges / 3 s regen / ~0.2 s invulnerability;
  // distances below are Mochiichao arena units, radius-10 arena.)
  DASH_MAX_CHARGES: 3,
  DASH_REGEN_MS: 3000,
  DASH_DISTANCE_U: 2.5,
  DASH_TRAVEL_MS: 170,
  DASH_INV_MS: 200,
  // Energy economy (source pattern: 100 max, 12/s regen).
  ENERGY_MAX: 100,
  ENERGY_REGEN_PER_SEC: 12,
  STATUS_MOVE_ENERGY_COST: 50,
  STATUS_MOVE_COOLDOWN_MS: 8000,
  STATUS_LOCK_PER_STAGE_MS: 2000,
  // Move-use cap shape: uses = max(5, round(baseUses * 1.5)) * 2.
  PP_FACTOR: 1.5,
  PP_MIN: 5,
  PP_DOUBLE: 2,
  // Knockback decay: velocity *= exp(-DECAY * dtSeconds).
  KNOCKBACK_DECAY_PER_SEC: 7,
  // Switch: 4 s cooldown, 0.8 s entry invulnerability.
  SWITCH_COOLDOWN_MS: 4000,
  SWITCH_ENTRY_INV_MS: 800,
  // Sudden death: after 180 s, damage scales +1 per 40 s over.
  SUDDEN_DEATH_AT_SEC: 180,
  SUDDEN_DEATH_PER_SEC: 1 / 40,
  // Invulnerability windows after events (source pattern).
  INV_AFTER_ORB_HIT_MS: 800,
  INV_AFTER_KNOCKDOWN_MS: 1200,
  INV_AFTER_ITEM_MS: 1500,
  // AI: strafe direction re-rolled every 1–2.6 s; aim error re-rolled
  // every 500–1000 ms, magnitude ±0.15 rad.
  AI_STRAFE_MIN_MS: 1000,
  AI_STRAFE_MAX_MS: 2600,
  AI_AIM_MIN_MS: 500,
  AI_AIM_MAX_MS: 1000,
  AI_AIM_ERROR_RAD: 0.15,
  // Hit feedback: hitstop capped at 90 ms, growing with damage.
  HITSTOP_BASE_MS: 20,
  HITSTOP_CAP_MS: 90,
  // Perfect Dodge: a dodge whose i-frame window covers the telegraph
  // end counts as perfect (visual-only in sparring; see header).
  PERFECT_DODGE_WINDOW_MS: 150,
  // Ground-mark lifetimes.
  MARK_SCORCH_MS: 2500,
  MARK_CRACK_MS: 4000,
  MARK_FROST_MS: 3000,
  // Softened type steps (action-game variant): immunity is softened
  // to 0.33 rather than 0, so no attack is ever fully negated.
  TYPE_IMMUNE: 0.33,
  TYPE_DOUBLE_RESIST: 0.5,
  TYPE_RESIST: 0.75,
  TYPE_NEUTRAL: 1,
  TYPE_SUPER: 1.33,
  TYPE_DOUBLE_WEAK: 1.66,
  SAME_TYPE_BONUS: 1.25,
});

// ---------------------------------------------------------------- helpers
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function norm180Deg(deg) {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}
function angleTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); }
function dist(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }

// ---------------------------------------------------------------- dash pool
function createDashPool() {
  return { charges: FAN.DASH_MAX_CHARGES, regenMsLeft: 0 };
}
// Spend one charge; returns the dash (distance + i-frame window) or
// null when no charge is available. The caller moves the creature;
// this function only owns the economy.
function useDash(pool) {
  if (!pool || pool.charges <= 0) return null;
  pool.charges -= 1;
  if (pool.charges < FAN.DASH_MAX_CHARGES && pool.regenMsLeft <= 0) {
    pool.regenMsLeft = FAN.DASH_REGEN_MS;
  }
  return Object.freeze({
    distanceU: FAN.DASH_DISTANCE_U,
    travelMs: FAN.DASH_TRAVEL_MS,
    invMs: FAN.DASH_INV_MS,
    chargesLeft: pool.charges,
  });
}
function regenDash(pool, dtMs) {
  if (!pool || pool.charges >= FAN.DASH_MAX_CHARGES) return pool;
  pool.regenMsLeft -= dtMs;
  while (pool.regenMsLeft <= 0 && pool.charges < FAN.DASH_MAX_CHARGES) {
    pool.charges += 1;
    pool.regenMsLeft += pool.charges < FAN.DASH_MAX_CHARGES ? FAN.DASH_REGEN_MS : 0;
  }
  if (pool.charges >= FAN.DASH_MAX_CHARGES) pool.regenMsLeft = 0;
  return pool;
}

// ---------------------------------------------------------------- energy
function createEnergyPool() {
  return { energy: FAN.ENERGY_MAX, max: FAN.ENERGY_MAX };
}
function regenEnergy(pool, dtMs) {
  if (!pool) return null;
  pool.energy = Math.min(pool.max, pool.energy + FAN.ENERGY_REGEN_PER_SEC * (dtMs / 1000));
  return pool;
}
function spendEnergy(pool, cost) {
  if (!pool || pool.energy < cost) return false;
  pool.energy -= cost;
  return true;
}
function maxUses(baseUses) {
  return Math.max(FAN.PP_MIN, Math.round(baseUses * FAN.PP_FACTOR)) * FAN.PP_DOUBLE;
}

// ---------------------------------------------------------------- movement
// Speed-stat compression: a fast creature is faster, but not
// proportionally — the curve is deliberately flattened so low-speed
// creatures stay playable. Input is a speed stat in the 30–143 band;
// output is arena units per second in the 1.6–2.3 band.
function speedUpsFromStat(speedStat) {
  const s = clamp(typeof speedStat === 'number' ? speedStat : 60, 30, 143);
  return 1.6 + ((s - 30) / 113) * 0.7;
}
function knockbackDecay(velocity, dtSec) {
  return velocity * Math.exp(-FAN.KNOCKBACK_DECAY_PER_SEC * dtSec);
}
// Push two circular bodies apart until they no longer overlap.
// Returns the corrected positions; pass-through bodies (dashing
// through, buried, airborne) skip separation — the caller decides.
function separateBodies(a, b, radiusA, radiusB) {
  const d = dist(a.x, a.y, b.x, b.y) || 1;
  const min = radiusA + radiusB;
  if (d >= min) return { a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } };
  const overlap = (min - d) / 2;
  const ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
  return {
    a: { x: a.x - ux * overlap, y: a.y - uy * overlap },
    b: { x: b.x + ux * overlap, y: b.y + uy * overlap },
  };
}

// ---------------------------------------------------------------- aiming
// Aim shapes, as data (no art, no names): lane = straight line,
// wedge = cone, zone = ground circle, self = radius around caster,
// beam = line after a short aim delay, dash = the caster travels.
const AIM_SHAPES = Object.freeze(['lane', 'wedge', 'zone', 'self', 'beam', 'dash']);
function aimAngle(from, to) { return angleTo(from.x, from.y, to.x, to.y); }
// Homing with a capped turn rate: the heading turns toward the
// target by at most turnRateRadPerSec * dtSec. Returns the new
// heading in radians. Pure — the caller integrates position.
function homingTurn(currentRad, targetRad, turnRateRadPerSec, dtSec) {
  let diff = targetRad - currentRad;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  const maxTurn = turnRateRadPerSec * dtSec;
  if (Math.abs(diff) <= maxTurn) return targetRad;
  return currentRad + Math.sign(diff) * maxTurn;
}
// Maximum distance a projectile can cover: speed * life.
function projectileReach(speedUps, lifeSec) { return speedUps * lifeSec; }
// Reach of a dash move: dash distance + both body radii.
function dashReach(dashDistanceU, radiusA, radiusB) {
  return dashDistanceU + radiusA + radiusB;
}
// AI aim error: re-rolled on a 500–1000 ms timer, ±0.15 rad.
// The state object is owned by the caller (one per AI fighter).
function createAimState(rng) {
  const r = typeof rng === 'function' ? rng : Math.random;
  return { errorRad: (r() - 0.5) * 2 * FAN.AI_AIM_ERROR_RAD, nextRollAtMs: 0, rng: r };
}
function updateAimError(state, nowMs) {
  if (!state) return 0;
  if (nowMs >= state.nextRollAtMs) {
    const r = state.rng || Math.random;
    state.errorRad = (r() - 0.5) * 2 * FAN.AI_AIM_ERROR_RAD;
    state.nextRollAtMs = nowMs + FAN.AI_AIM_MIN_MS
      + r() * (FAN.AI_AIM_MAX_MS - FAN.AI_AIM_MIN_MS);
  }
  return state.errorRad;
}

// ---------------------------------------------------------------- AI movement
// Returns a movement input vector {x, y} in [-1, 1] for one AI
// fighter, from: preferred-range spacing, a timed strafe direction,
// lateral dodges away from incoming threats, repulsion from
// obstacles, and a pull toward the arena centre near the walls.
// Threats: [{x, y, vx, vy, radius}] for projectiles/zones; the dodge
// vector is lateral to the threat's travel, not directly away, so
// the fighter sidesteps instead of outrunning the threat.
function aiMovement(input) {
  const o = input || {};
  const me = o.me || { x: 0, y: 0 };
  const foe = o.foe || { x: 1, y: 0 };
  const preferredU = typeof o.preferredRangeU === 'number' ? o.preferredRangeU : 4;
  const toleranceU = typeof o.toleranceU === 'number' ? o.toleranceU : 0.6;
  const strafe = typeof o.strafeDir === 'number' ? o.strafeDir : 0;
  const arenaRadiusU = typeof o.arenaRadiusU === 'number' ? o.arenaRadiusU : 10;
  let ix = 0, iy = 0;
  const dx = foe.x - me.x, dy = foe.y - me.y;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const radial = d > preferredU + toleranceU ? 1 : d < preferredU - toleranceU ? -1 : 0;
  ix += ux * radial; iy += uy * radial;
  ix += -uy * strafe * 0.7; iy += ux * strafe * 0.7;
  // Threat dodges: only threats heading roughly toward the fighter
  // and within a forward window count; lateral offset decides the side.
  for (const t of (o.threats || [])) {
    const sp = Math.hypot(t.vx || 0, t.vy || 0) || 1;
    const hx = (t.vx || 0) / sp, hy = (t.vy || 0) / sp;
    const rx = me.x - (t.x || 0), ry = me.y - (t.y || 0);
    const along = rx * hx + ry * hy;
    if (along < 0 || along > 300) continue;
    const lat = -rx * hy + ry * hx;
    const clearance = (o.myRadiusU || 0.6) + (t.radius || 0.3) + 0.3;
    if (Math.abs(lat) > clearance) continue;
    const side = lat === 0 ? (strafe || 1) : Math.sign(lat);
    ix += -hy * side * 2.4; iy += hx * side * 2.4;
  }
  // Obstacle repulsion.
  for (const ob of (o.obstacles || [])) {
    const rx = me.x - (ob.x || 0), ry = me.y - (ob.y || 0);
    const rd = Math.hypot(rx, ry) || 1;
    if (rd < (ob.radius || 1) + (o.myRadiusU || 0.6) + 0.5) {
      ix -= (rx / rd) * 1.2; iy -= (ry / rd) * 1.2;
    }
  }
  // Centre pull near the walls.
  const centreDist = Math.hypot(me.x, me.y);
  if (centreDist > arenaRadiusU - 1.5) {
    ix += (-me.x / (centreDist || 1)) * 0.8;
    iy += (-me.y / (centreDist || 1)) * 0.8;
  }
  const m = Math.hypot(ix, iy);
  if (m > 1) { ix /= m; iy /= m; }
  return Object.freeze({ x: ix, y: iy });
}
// Strafe timer state: direction flips on a 1–2.6 s roll.
function createStrafeState(rng) {
  const r = typeof rng === 'function' ? rng : Math.random;
  return { dir: r() < 0.5 ? -1 : 1, nextRollAtMs: 0, rng: r };
}
function updateStrafe(state, nowMs) {
  if (!state) return 0;
  if (nowMs >= state.nextRollAtMs) {
    const r = state.rng || Math.random;
    state.dir = r() < 0.5 ? -1 : 1;
    state.nextRollAtMs = nowMs + FAN.AI_STRAFE_MIN_MS
      + r() * (FAN.AI_STRAFE_MAX_MS - FAN.AI_STRAFE_MIN_MS);
  }
  return state.dir;
}

// ---------------------------------------------------------------- move scoring
// Score one move for an AI fighter. Damage moves score on power x
// type step x same-type bonus x attack stat, then fall off hard when
// the target is out of the move's reach (melee 0.05x, projectile
// beyond reach 0.25x, dash beyond reach 0.15x, zone/quake-style
// beyond max 0.1x). Healing scores only when hurt, buffs only when
// healthy and at range, and a move whose second charge is pending
// scores 3x (use it while it is available). Noise is caller-injected.
function movePickScore(move, ctx) {
  const m = move || {};
  const c = ctx || {};
  const distU = typeof c.distanceU === 'number' ? c.distanceU : 99;
  const hpFrac = typeof c.hpFraction === 'number' ? c.hpFraction : 1;
  const noise = typeof c.noise === 'number' ? c.noise : 0;
  let s = 0;
  if (m.kind === 'heal') {
    s = hpFrac < 0.45 ? 2.2 : 0;
  } else if (m.kind === 'buff') {
    s = (c.buffActive ? 0 : 1) && hpFrac > 0.5 && distU > 2 ? 1.3 : 0;
  } else if (m.kind === 'rest') {
    s = hpFrac < 0.35 && distU > 3 ? 2.6 : 0;
  } else if (m.kind === 'teleport_strike') {
    s = distU < 2.2 ? 1.6 : 0;
  } else {
    const power = typeof m.power === 'number' ? m.power : 0;
    const typeStep = typeof m.typeStep === 'number' ? m.typeStep : 1;
    const stab = m.sameType ? FAN.SAME_TYPE_BONUS : 1;
    const atk = typeof c.attackStat === 'number' ? c.attackStat : 120;
    s = (power / 90) * typeStep * stab * (atk / 120);
    const reach = typeof m.reachU === 'number' ? m.reachU : 99;
    if (distU > reach) {
      if (m.shape === 'dash') s *= 0.15;
      else if (m.shape === 'zone') s *= 0.1;
      else if (m.shape === 'melee') s *= 0.05;
      else s *= 0.25;
    }
    if (m.recoil && hpFrac < 0.25) s *= 0.4;
    if (m.recharge) s *= c.foeHpFraction < 0.35 ? 1.1 : 0.5;
  }
  if (c.secondChargePending) s *= 3;
  return s * (1 + noise);
}
function pickBestMove(moves, ctx, rng) {
  const r = typeof rng === 'function' ? rng : null;
  let best = -1, bestScore = 0.25; // below threshold: no move chosen
  (moves || []).forEach((m, i) => {
    if (cReady(ctx, i) === false) return;
    const noise = r ? (r() - 0.5) * 2 * (ctx && ctx.noiseAmount ? ctx.noiseAmount : 0) : 0;
    const s = movePickScore(m, Object.assign({}, ctx, { noise }));
    if (s > bestScore) { bestScore = s; best = i; }
  });
  return best;
}
function cReady(ctx, i) {
  if (!ctx) return true;
  if (Array.isArray(ctx.cooldownsMs) && ctx.cooldownsMs[i] > 0) return false;
  if (Array.isArray(ctx.energyCosts) && ctx.energyCosts[i] > (ctx.energy || 0)) return false;
  if (Array.isArray(ctx.usesLeft) && ctx.usesLeft[i] <= 0) return false;
  return true;
}
// Matchup score for switching: own offence − 0.85 x foe offence +
// 0.4 x own HP fraction. Offence = best damage-move score ignoring
// reach (a bench fighter is scored on potential, not position).
function offenseScore(moves, foeTypeSteps) {
  let best = 0;
  for (const m of (moves || [])) {
    if (!m || !m.power) continue;
    const step = foeTypeSteps && typeof foeTypeSteps[m.type] === 'number' ? foeTypeSteps[m.type] : 1;
    best = Math.max(best, step * (m.sameType ? FAN.SAME_TYPE_BONUS : 1) * (m.power / 90));
  }
  return best;
}
function matchupScore(ownMoves, foeMoves, ownHpFraction, foeTypeSteps, ownTypeSteps) {
  return offenseScore(ownMoves, foeTypeSteps)
    - 0.85 * offenseScore(foeMoves, ownTypeSteps)
    + 0.4 * (typeof ownHpFraction === 'number' ? ownHpFraction : 1);
}
function shouldSwitch(activeScore, benchScore, margin) {
  return benchScore > activeScore + (typeof margin === 'number' ? margin : 1.0);
}

// ---------------------------------------------------------------- type steps
function softenedTypeStep(step) {
  // step: -2 double resist, -1 resist, 0 neutral, +1 super, +2 double
  // weak, 'immune' immunity (softened, never zero).
  if (step === 'immune') return FAN.TYPE_IMMUNE;
  if (step <= -2) return FAN.TYPE_DOUBLE_RESIST;
  if (step === -1) return FAN.TYPE_RESIST;
  if (step === 1) return FAN.TYPE_SUPER;
  if (step >= 2) return FAN.TYPE_DOUBLE_WEAK;
  return FAN.TYPE_NEUTRAL;
}

// ---------------------------------------------------------------- feedback
// Damage-scaled hit feedback. Hitstop grows with damage and caps at
// 90 ms; shake and zoom punch scale in three bands. This is staging
// data only — the game applies it through battleTreatments.js timing.
function hitFeedback(damage) {
  const dmg = typeof damage === 'number' && damage > 0 ? damage : 0;
  const hitstopMs = Math.min(FAN.HITSTOP_CAP_MS,
    FAN.HITSTOP_BASE_MS + Math.round(dmg * 1000 / 450));
  const band = dmg >= 60 ? 'big' : dmg >= 25 ? 'medium' : 'small';
  return Object.freeze({
    hitstopMs,
    shakePx: band === 'big' ? 13 : band === 'medium' ? 6 : 3,
    zoomPunch: band === 'big' ? 0.05 : band === 'medium' ? 0.015 : 0,
    flash: band === 'big',
  });
}
// Ground marks left by attacks; they persist until battle end (or
// their lifetime) and are visual only — they never deal damage.
function createGroundMark(kind, x, y, radiusU) {
  const life = kind === 'scorch' ? FAN.MARK_SCORCH_MS
    : kind === 'frost' ? FAN.MARK_FROST_MS : FAN.MARK_CRACK_MS;
  return { kind, x, y, radiusU, lifeMs: life, ageMs: 0 };
}
function tickGroundMarks(marks, dtMs) {
  for (const mk of marks) mk.ageMs += dtMs;
  return marks.filter((mk) => mk.ageMs < mk.lifeMs);
}
// Delayed ground zones (chosen-attack resolution only): after
// delayMs the zone applies its effect once to each creature inside
// radiusU. Between-turn zones are visual only and never call this.
function createZone(kind, x, y, radiusU, delayMs, effect) {
  return {
    kind, x, y, radiusU, delayMs, elapsedMs: 0, fired: false,
    effect: effect || { damage: 0, slowSec: 0 },
  };
}
function tickZone(zone, dtMs, creatures) {
  zone.elapsedMs += dtMs;
  if (zone.fired || zone.elapsedMs < zone.delayMs) return [];
  zone.fired = true;
  const hits = [];
  for (const c of (creatures || [])) {
    if (dist(zone.x, zone.y, c.x, c.y) <= zone.radiusU + (c.radiusU || 0.6)) {
      hits.push({ creature: c, effect: zone.effect });
    }
  }
  return hits;
}

// ---------------------------------------------------------------- sudden death
function suddenDeathMultiplier(fightTimeSec) {
  const t = typeof fightTimeSec === 'number' ? fightTimeSec : 0;
  if (t <= FAN.SUDDEN_DEATH_AT_SEC) return 1;
  return 1 + (t - FAN.SUDDEN_DEATH_AT_SEC) * FAN.SUDDEN_DEATH_PER_SEC;
}

// ---------------------------------------------------------------- dodge
// Sparring dodge: position-only. A roll moves the creature along a
// direction for DASH_TRAVEL_MS with i-frames for DASH_INV_MS; it
// never changes HP. Returns the roll record or null (no charge).
function sparringDodge(pool, dirX, dirY) {
  const dash = useDash(pool);
  if (!dash) return null;
  const m = Math.hypot(dirX, dirY) || 1;
  return Object.freeze({
    dirX: dirX / m, dirY: dirY / m,
    distanceU: dash.distanceU, travelMs: dash.travelMs, invMs: dash.invMs,
    hpDelta: 0, visualOnly: true,
  });
}
// Chosen Dodge action: the defender spends their turn dodging.
// dodgeAtMs is when the dodge input lands; telegraphEndMs is when
// the incoming attack's telegraph ends. A dodge that starts within
// PERFECT_DODGE_WINDOW_MS before the telegraph end is perfect.
function chosenDodge(telegraphEndMs, dodgeAtMs) {
  const gap = telegraphEndMs - dodgeAtMs;
  const dodged = gap >= 0 && gap <= FAN.PERFECT_DODGE_WINDOW_MS + 1000;
  return Object.freeze({
    dodged,
    perfect: dodged && gap <= FAN.PERFECT_DODGE_WINDOW_MS,
    gapMs: gap,
  });
}
// Apply a chosen Dodge result to an incoming chosen attack's damage.
// A successful dodge negates the attack; a perfect dodge additionally
// banks a visual-only momentum note for the NEXT turn (it never
// refunds the spent turn and never adds damage).
function applyDodgeToDamage(rawDamage, dodgeResult) {
  if (!dodgeResult || !dodgeResult.dodged) {
    return Object.freeze({ damage: rawDamage, dodged: false, perfect: false });
  }
  return Object.freeze({ damage: 0, dodged: true, perfect: !!dodgeResult.perfect });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FAN, AIM_SHAPES,
    createDashPool, useDash, regenDash,
    createEnergyPool, regenEnergy, spendEnergy, maxUses,
    speedUpsFromStat, knockbackDecay, separateBodies,
    aimAngle, homingTurn, projectileReach, dashReach,
    createAimState, updateAimError,
    aiMovement, createStrafeState, updateStrafe,
    movePickScore, pickBestMove, offenseScore, matchupScore, shouldSwitch,
    softenedTypeStep,
    hitFeedback, createGroundMark, tickGroundMarks, createZone, tickZone,
    suddenDeathMultiplier,
    sparringDodge, chosenDodge, applyDodgeToDamage,
  };
}

// ESM export (2026-10-25): see captureLoop.js note — the CJS guard never
// fires under "type": "module"; this export is what the ESM test imports.
export {
  FAN, AIM_SHAPES,
  createDashPool, useDash, regenDash,
  createEnergyPool, regenEnergy, spendEnergy, maxUses,
  speedUpsFromStat, knockbackDecay, separateBodies,
  aimAngle, homingTurn, projectileReach, dashReach,
  createAimState, updateAimError,
  aiMovement, createStrafeState, updateStrafe,
  movePickScore, pickBestMove, offenseScore, matchupScore, shouldSwitch,
  softenedTypeStep,
  hitFeedback, createGroundMark, tickGroundMarks, createZone, tickZone,
  suddenDeathMultiplier,
  sparringDodge, chosenDodge, applyDodgeToDamage,
};
