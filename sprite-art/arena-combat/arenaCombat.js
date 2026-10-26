// arenaCombat.js — Mochiichao deterministic arena combat controller
// (LOCAL BUILD, 2026-10-25; spec: sprite-art/ARENA-COMBAT-SPEC.md)
//
// Turn-based core + continuous between-turn layer. No game imports, no
// DOM, no Math.random anywhere in the sampled path: every sparring
// outcome is drawn from a seeded PRNG, so a seeded battle replays
// exactly. The game (React/Vite app) imports this module at wiring
// time; it never copies these numbers into a second list.
//
// BALANCE LAW (spec §1, the core invariant): ONLY chosen attacks deal
// real HP damage. Between-turn sparring NEVER changes HP, inflicts a
// status, or faints a creature. Sparring clashes show contact, sparks
// and knockback-without-damage only. Positioning (range band, flank
// arc, momentum) may modify the NEXT chosen attack by small, capped
// amounts (spec §3.4) and nothing else. If any code path here ever let
// a clash subtract HP, that path would be a bug, and the test suite
// pins it as such (see arenaCombat.test.js: "HP never changes during
// the between-turn layer").
//
// State machine (spec §6):
//   BATTLE_START -> BETWEEN_TURN (CIRCLING / ADVANCING / RETREATING /
//     HOLDING / SPAR_CLASH / SEPARATING) -> CHOSEN_ATTACK (TELEGRAPH /
//     TRAVEL|CAST / WINDUP / STRIKE / IMPACT_HOLD / RECOIL / RETURN)
//     -> RESOLUTION -> BETWEEN_TURN | BATTLE_END
//   Faint: CHOSEN_ATTACK -> FAINT, RETURN is SKIPPED, then BATTLE_END.
//   Nothing interrupts CHOSEN_ATTACK once TELEGRAPH starts.
//   Skip / 2x fast-forward jumps to RESOLUTION only after the attack
//   has been resolved (HP result already computed); staging alone is
//   never skipped into a phantom result.
//
// Treatment hooks (spec §5.1): this module does NOT re-implement
// battleTreatments.js. It emits the same beat numbers (windup 250 ms,
// hitstop 90 ms, recoil 300 ms, recover 400 ms) in its chosen-attack
// timeline so the game can drive buildHitTimeline/sampleHitPose with
// identical timing, and it adds the two arena-only samplers the spec
// requires: sampleArenaPose (between-turn layer) and sampleClashPose
// (sparring clashes). The 3D mapping for the between-turn layer is
// mapArenaPoseTo3D: spine lean = 2D rotation x 2.5, camera dolly =
// (zoom - 1) x 2.0 m, same factors as battleTreatments.mapTo3D; arena
// root translation is already in arena units (u), not pixels, so no
// px x 0.01 conversion applies to it (that factor belongs to the
// pixel-space hit pose, which mapTo3D still owns).
//
// Guardrail: movements, timing, techniques, systems, structures and
// data shapes only. No Nintendo (or any commercial game's) art, model
// or music file is used, referenced, or embedded here. Mochiichao
// makes its own art; this file is original code.
//
// SCOPE (Mars 2026-10-25 ~19:44 CDT, final and standing): moves and
// animations are NOT replaced. The ONLY exclusions are creature
// names, sounds, art and dialogue. Everything else — move names,
// types, categories, power, accuracy, effects, animation timing and
// motion — comes through 100% as real data (see toArenaMove and
// README.md). RING CAPTURE (Mars ~19:45, refined ~19:49, zone ~19:51):
// NOT part of this module and never wired into turn resolution.
// Default capture is Luigi Cubes (a separate system); ring capture is
// an optional gated subsystem unlocked by a NEW ring+arcade zone
// (name TBD, candidates in README — NOT the existing Harbor City
// safari preserve) plus shop-bought ring items, gated on BOTH flags.
// Full design in README.md; no capture code lives here.
// FIGHT-AS-CREATURE (Mars ~19:45): mode: 'driven' lets the player
// drive the creature between turns (setDriveInput); the turn-based
// core is unchanged. FOLLOWERS: integration note only, see README.

'use strict';

// ---------------------------------------------------------------- constants
const ARENA = Object.freeze({
  ARENA_RADIUS_U: 10,          // spec §3.1: arena floor is a circle, radius 10 u
  NEUTRAL_SPACING_U: 6,        // spec §3.1: neutral spacing
  MIN_SEPARATION_U: 1.2,       // spec §3.1: creatures never overlap
  CLASH_RANGE_U: 1.8,          // spec §3.2: clash trigger spacing
  TURN_CLOCK_MS: 30000,        // spec §1.1 rule 1: hard cap per window
  PROMPT_MS: 20000,            // spec §1.1 rule 1: "choose now" prompt
  CLASH_FLOOR_MS: 1200,        // spec §1.1 rule 3: minimum between clashes
  CLASH_FLOOR_PRESSURE_MS: 900,// spec §1.1 rule 4: floor under pressure
  MAX_CLASHES_PER_WINDOW: 6,   // spec §1.1 rule 3
  HOLD_AFTER_CLASH_MS: 800,    // spec §3.1: HOLD immediately after a clash
  AI_EVAL_MS: 500,             // spec §3.1: AI re-evaluation interval
  // Movement speeds, u/s (spec §3.1 table).
  SPEED_ADVANCE_UPS: 2.0,
  SPEED_ADVANCE_HEAVY_UPS: 1.4,
  SPEED_RETREAT_UPS: 2.2,
  SPEED_CIRCLE_UPS: 1.6,
  SPEED_STALK_UPS: 1.0,
  SPEED_SEPARATE_UPS: 2.5,
  // Facing turn rates, deg/s. CIRCLE is deliberately slow: a circling
  // attacker moves around the defender faster (in angular terms) than
  // the defender's facing can track, which is exactly how flank arcs
  // open (spec §3.1: CIRCLE facing lags the foe; §3.3b: circling earns
  // flanks). Outside CIRCLE a creature snaps back toward its foe.
  TURN_RATE_CIRCLE_DEG_S: 30,
  TURN_RATE_DEFAULT_DEG_S: 180,
  CIRCLE_FACING_LAG_DEG: 30,   // spec §3.1: facing lags foe by up to 30 deg
  // Clash beats, ms (spec §3.2: total ~700 ms).
  CLASH_FEINT_MS: 150,
  CLASH_KNOCKBACK_MS: 250,
  CLASH_EASE_BACK_MS: 300,
  CLASH_TOTAL_MS: 700,
  CLASH_KNOCKBACK_U: 0.4,      // spec §3.2: equal, regardless of body type
  CLASH_WIN_ADVANCE_U: 0.3,    // spec §3.2 step 4: winner advances 0.3 u
  CLASH_WIN_RECOVER_BONUS_MS: 100, // winner recovers 100 ms faster
  CLASH_SPARK_MIN: 4,          // spec §3.2: 4-8 particles, element-tinted
  CLASH_SPARK_MAX: 8,
  CLASH_SPARK_LIFE_MS: 250,
  // Positioning modifiers (spec §3.3 / §3.4).
  RANGE_CLOSE_U: 2,            // Close: spacing < 2 u
  RANGE_FAR_U: 5,              // Far: spacing > 5 u; Mid is 2-5 u
  FLANK_SIDE_MIN_DEG: 45,      // Front 0-45, Side 45-135, Rear 135-180
  FLANK_REAR_MIN_DEG: 135,
  FLANK_BANK_MS: 1000,         // arc must be held >= 1.0 s to bank
  MOMENTUM_CLASH_WIN: 8,       // per clash won, first 3 clashes only
  MOMENTUM_CLASH_COUNTED: 3,
  MOMENTUM_FLANK_HOLD: 15,     // side/rear held 2.0 s, once per window
  MOMENTUM_FLANK_HOLD_MS: 2000,
  MOMENTUM_DECAY_PER_SEC: 5,   // after 10 s without a choice
  MOMENTUM_DECAY_AFTER_MS: 10000,
  MOMENTUM_MAX: 100,
  MOMENTUM_TIER_1: 50,         // 50-79 -> +5% power
  MOMENTUM_TIER_2: 80,         // 80-100 -> +10% power
  POWER_CAP_PCT: 15,           // spec §3.4: total power bonus capped +15%
  ACCURACY_BONUS_CAP: 10,      // spec §3.4: accuracy bonus capped +10 pts
  ACCURACY_PENALTY_FLOOR: -5,  // spec §3.4: accuracy penalty floored -5 pts
  ACCURACY_MIN: 5,             // spec §3.4: accuracy clamped 5-100%
  ACCURACY_MAX: 100,
  // Anti-stall pressure (spec §1.1 rule 4).
  PRESSURE_STEP_MS: 5000,      // every 5 s without a choice
  PRESSURE_SPEED_STEP: 0.20,   // +20% move speed per step
  PRESSURE_SPEED_CAP: 0.60,    // capped at +60%
  // Chosen-attack staging (spec §2.1; impact beats match
  // battleTreatments.js TIMING exactly: 250 / 90 / 300 / 400).
  TELEGRAPH_MS: 300,           // spec range 200-400 ms
  TRAVEL_MS: 350,              // spec range 200-500 ms (physical)
  CAST_MS: 300,                // spec range 250-400 ms (projectile)
  WINDUP_LIGHT_MS: 250,
  WINDUP_HEAVY_MS: 500,
  STRIKE_LIGHT_MS: 80,
  STRIKE_HEAVY_MS: 115,        // spec range 100-130 ms
  IMPACT_HOLD_MS: 90,          // treatment module default (range 50-200)
  RECOIL_MS: 300,
  RECOVER_MS: 400,
  MULTI_HIT_GAP_MS: 160,       // spec range 120-200 ms between hits
  FAINT_MS: 1000,              // spec range 800-1200 ms collapse
  FAINT_FADE_MS: 400,          // spec range 300-500 ms dissolve
  // Camera (spec §4). Tilt: heavy 4 deg, crit 6 deg, KO/phase-change 8 deg.
  CAMERA_CLASH_ZOOM: 1.04,
  CAMERA_FOLLOW_ZOOM: 1.02,
  TILT_HEAVY_DEG: 4,
  TILT_CRIT_DEG: 6,
  TILT_KO_DEG: 8,
  SHAKE_WINDOW_MS: 350,        // treatment SHAKE_MS; between-turn shake = 0
  // Severity (mirrors battleTreatments.js SEVERITY; damage-driven only,
  // never passed as a string by the game).
  SEVERITY_LIGHT_MAX: 0.15,
  SEVERITY_MEDIUM_MAX: 0.35,
  SEVERITY_HEAVY_MAX: 0.60,
});

const BODY_TYPES = ['grounded', 'heavy', 'flyer', 'static', 'seated'];
const MOVE_KINDS = ['melee', 'projectile', 'healing', 'item', 'switch', 'run', 'status'];
const DAMAGE_KINDS = ['melee', 'projectile'];
const CAMERA_SHOTS = ['NEUTRAL', 'FOLLOW', 'CLASH', 'WINDUP_PUSH', 'IMPACT_CUT',
  'IMPACT_SHAKE', 'TILT_BIG', 'RETURN_NEUTRAL'];

// ---------------------------------------------------------------- helpers
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function easeOutCubic(t) { const u = clamp(t, 0, 1); return 1 - Math.pow(1 - u, 3); }
function easeInOutQuad(t) {
  const u = clamp(t, 0, 1);
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}
// Seeded PRNG (mulberry32). The ONLY randomness source in this module.
function mulberry32(seed) {
  let a = (typeof seed === 'number' ? Math.floor(seed) : 1) >>> 0;
  return function next() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function angleTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax) * 180 / Math.PI; }
function norm180(deg) {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}
function angleDiff(a, b) { return Math.abs(norm180(a - b)); }
// Shortest-arc step of `current` toward `target`, capped at maxStep deg.
function turnToward(current, target, maxStep) {
  const d = norm180(target - current);
  if (Math.abs(d) <= maxStep) return target;
  return current + Math.sign(d) * maxStep;
}
function dist(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }

function rangeBand(spacing) {
  if (spacing < ARENA.RANGE_CLOSE_U) return 'Close';
  if (spacing <= ARENA.RANGE_FAR_U) return 'Mid';
  return 'Far';
}
function flankArc(angleDeg) {
  if (angleDeg < ARENA.FLANK_SIDE_MIN_DEG) return 'Front';
  if (angleDeg < ARENA.FLANK_REAR_MIN_DEG) return 'Side';
  return 'Rear';
}
function severityFor(damageFraction, isCrit) {
  const f = typeof damageFraction === 'number' && isFinite(damageFraction) ? Math.max(0, damageFraction) : 0;
  if (isCrit || f > ARENA.SEVERITY_HEAVY_MAX) return 'critical';
  if (f <= ARENA.SEVERITY_LIGHT_MAX) return 'light';
  if (f <= ARENA.SEVERITY_MEDIUM_MAX) return 'medium';
  return 'heavy';
}
const SEVERITY_TABLE = Object.freeze({
  light: Object.freeze({ recoilPx: 10, shakePx: 2, cameraPush: 1.04 }),
  medium: Object.freeze({ recoilPx: 18, shakePx: 4, cameraPush: 1.08 }),
  heavy: Object.freeze({ recoilPx: 28, shakePx: 7, cameraPush: 1.14 }),
  critical: Object.freeze({ recoilPx: 38, shakePx: 10, cameraPush: 1.20 }),
});

// Positioning modifiers for ONE chosen damage attack, from live state.
// Pure: no state is mutated here, so tests can pin exact numbers.
//   spacing, bankedFlankArc ('Front'|'Side'|'Rear'|null), momentum,
//   kind ('melee'|'projectile'), baseAccuracy, critChance.
// Returns frozen { powerPct, accuracyMod, effectiveAccuracy, critChance,
//   breakdown } with spec §3.4 caps applied. Crit is NEVER modified.
function computeModifiers(input) {
  const o = input || {};
  const kind = o.kind === 'projectile' ? 'projectile' : 'melee';
  const band = rangeBand(typeof o.spacing === 'number' ? o.spacing : ARENA.NEUTRAL_SPACING_U);
  const arc = o.bankedFlankArc === 'Side' || o.bankedFlankArc === 'Rear' ? o.bankedFlankArc : 'Front';
  const momentum = clamp(typeof o.momentum === 'number' ? o.momentum : 0, 0, ARENA.MOMENTUM_MAX);
  let rangePower = 0; let rangeAcc = 0;
  if (band === 'Close') {
    if (kind === 'melee') rangePower += 5;
    else rangeAcc -= 5; // rushed point-blank shot
  } else if (band === 'Far') {
    // Melee from Far: attacker travels in (spec §1.1 rule 5), 1.00x — no penalty.
    if (kind === 'projectile') rangeAcc += 5; // settled aim
  }
  let flankPower = 0; let flankAcc = 0;
  if (arc === 'Side') flankAcc += 5;
  else if (arc === 'Rear') { flankAcc += 10; flankPower += 5; }
  let momentumPower = 0;
  if (momentum >= ARENA.MOMENTUM_TIER_2) momentumPower = 10;
  else if (momentum >= ARENA.MOMENTUM_TIER_1) momentumPower = 5;
  const rawPower = rangePower + flankPower + momentumPower;
  const powerPct = Math.min(rawPower, ARENA.POWER_CAP_PCT);
  const rawAcc = rangeAcc + flankAcc;
  const accuracyMod = clamp(rawAcc, ARENA.ACCURACY_PENALTY_FLOOR, ARENA.ACCURACY_BONUS_CAP);
  const baseAcc = typeof o.baseAccuracy === 'number' ? o.baseAccuracy : 100;
  const effectiveAccuracy = clamp(baseAcc + accuracyMod, ARENA.ACCURACY_MIN, ARENA.ACCURACY_MAX);
  return Object.freeze({
    powerPct, accuracyMod, effectiveAccuracy,
    critChance: typeof o.critChance === 'number' ? o.critChance : 0, // never modified
    powerMultiplier: 1 + powerPct / 100,
    rangeBand: band, flankArc: arc,
    breakdown: Object.freeze({ rangePower, rangeAcc, flankPower, flankAcc, momentumPower, rawPower }),
  });
}
// Zero modifiers for healing / switch / items / run (spec §3.4).
function noModifiers(input) {
  const o = input || {};
  return Object.freeze({
    powerPct: 0, accuracyMod: 0,
    effectiveAccuracy: clamp(typeof o.baseAccuracy === 'number' ? o.baseAccuracy : 100,
      ARENA.ACCURACY_MIN, ARENA.ACCURACY_MAX),
    critChance: typeof o.critChance === 'number' ? o.critChance : 0,
    powerMultiplier: 1,
    rangeBand: rangeBand(typeof o.spacing === 'number' ? o.spacing : ARENA.NEUTRAL_SPACING_U),
    flankArc: 'Front',
    breakdown: Object.freeze({ rangePower: 0, rangeAcc: 0, flankPower: 0, flankAcc: 0, momentumPower: 0, rawPower: 0 }),
  });
}

// Map one extracted decomp move entry (pokebw2/res/moves/*/data.json
// shape, as shipped in src/lib/generated/decomp_black2_moves.json) to an
// ArenaMoveDef. This is the scope-correction mapper (Mars 2026-10-25
// ~19:44): real move data, not genericized. Creature names, sounds,
// art and dialogue are the ONLY exclusions; move names, types,
// categories, power, accuracy, PP, priority and effects come through
// exactly as extracted.
//   category: MOVE_CATEGORY_PHYSICAL -> 'melee' (travel staging),
//     MOVE_CATEGORY_SPECIAL -> 'projectile' (cast staging),
//     MOVE_CATEGORY_STATUS -> 'status' (non-damage: zero modifiers,
//     resolved via resolveNonDamageAction; the game applies stat
//     changes, the controller never invents them).
//   accuracy: decomp 0 means "never misses" -> normalized to 100 with
//     decompAccuracy preserved, so the controller's 5-100 clamp never
//     turns a never-miss move into a 5% move.
//   type: TYPE_FIRE -> 'Fire' (prefix stripped, title-cased); the raw
//     string is preserved as typeRaw for provenance.
function toArenaMove(entry) {
  const e = entry || {};
  if (!e.name) throw new Error('toArenaMove requires a decomp move entry with a name');
  const cat = e.category || '';
  let kind = 'melee';
  if (cat.indexOf('SPECIAL') !== -1) kind = 'projectile';
  else if (cat.indexOf('STATUS') !== -1) kind = 'status';
  const rawAcc = typeof e.accuracy === 'number' ? e.accuracy : 100;
  const typeRaw = typeof e.type === 'string' ? e.type : '';
  const typeClean = typeRaw.replace(/^TYPE_/, '');
  const type = typeClean ? typeClean.charAt(0) + typeClean.slice(1).toLowerCase() : '';
  return Object.freeze({
    name: e.name, kind,
    power: typeof e.power === 'number' ? e.power : 0,
    accuracy: rawAcc === 0 ? 100 : rawAcc,
    decompAccuracy: rawAcc,
    type, typeRaw,
    effect: typeof e.effect === 'string' ? e.effect : '',
    pp: typeof e.pp === 'number' ? e.pp : 0,
    priority: typeof e.priority === 'number' ? e.priority : 0,
    sourceConstant: typeof e.sourceConstant === 'string' ? e.sourceConstant : '',
    sourceDir: typeof e.sourceDir === 'string' ? e.sourceDir : '',
  });
}

// ---------------------------------------------------------------- factory
function createArenaBattle(options) {
  const opts = options || {};
  if (!opts.player || !opts.foe) throw new Error('createArenaBattle requires player and foe');
  const seed = typeof opts.seed === 'number' ? Math.floor(opts.seed) : 1;
  const rng = mulberry32(seed);
  const reduceMotion = !!opts.reduceMotion;
  // FIGHT-AS-CREATURE (Mars 2026-10-25 ~19:45): mode 'ai' (default) means
  // the movement AI drives both creatures between turns; mode 'driven'
  // means the PLAYER drives the player's creature with setDriveInput
  // while the foe stays AI-driven. The turn-based core is identical in
  // both modes: only chosen attacks deal real HP damage, and choosing
  // still goes through chooseMove. Anything else throws.
  const mode = opts.mode === 'driven' ? 'driven' : (opts.mode === undefined || opts.mode === 'ai' ? 'ai' : (() => { throw new Error('unknown mode: ' + opts.mode); })());

  function makeCreature(def, side, startX) {
    if (!def || typeof def.name !== 'string' || !def.name) throw new Error('creature requires a name');
    const maxHp = typeof def.maxHp === 'number' && def.maxHp > 0 ? Math.floor(def.maxHp) : 0;
    if (!maxHp) throw new Error('creature requires maxHp > 0');
    if (!Array.isArray(def.moves) || def.moves.length === 0) throw new Error('creature requires a non-empty moves list');
    for (const m of def.moves) {
      if (!m || typeof m.name !== 'string') throw new Error('every move requires a name');
      if (m.kind && MOVE_KINDS.indexOf(m.kind) === -1) throw new Error('unknown move kind: ' + m.kind);
    }
    const bodyType = BODY_TYPES.indexOf(def.bodyType) !== -1 ? def.bodyType : 'grounded';
    return {
      side, name: def.name, maxHp,
      hp: typeof def.hp === 'number' ? clamp(Math.floor(def.hp), 0, maxHp) : maxHp,
      moves: def.moves.map((m) => ({
        name: m.name, kind: m.kind || 'melee',
        power: typeof m.power === 'number' ? m.power : 0,
        accuracy: typeof m.accuracy === 'number' ? m.accuracy : 100,
        critChance: typeof m.critChance === 'number' ? m.critChance : 0,
        weight: m.weight === 'heavy' ? 'heavy' : 'light',
        hits: typeof m.hits === 'number' && m.hits > 1 ? Math.floor(m.hits) : 1,
      })),
      bodyType, temperament: def.temperament === 'aggressive' ? 'aggressive' : 'balanced',
      x: startX, y: 0, altitude: 0,
      facingDeg: side === 'player' ? 0 : 180,
      behaviour: 'CIRCLING',
      momentum: 0, flankArc: 'Front', flankHoldMs: 0, flankBonusAwarded: false,
      lastUsedMoveIndex: -1,
    };
  }

  const player = makeCreature(opts.player, 'player', -ARENA.NEUTRAL_SPACING_U / 2);
  const foe = makeCreature(opts.foe, 'foe', ARENA.NEUTRAL_SPACING_U / 2);
  // Foe idle loop phase-offset 30-50% (spec §6 BATTLE_START), seeded.
  const foeIdlePhaseOffset = 0.30 + rng() * 0.20;
  // Seeded circle direction + pressured side for this window.
  let circleDirection = rng() < 0.5 ? 1 : -1; // 1 = counter-clockwise
  let pressuredSide = rng() < 0.5 ? 'player' : 'foe';

  const battle = {
    state: 'BATTLE_START',
    mode,
    driveInput: { x: 0, y: 0 }, // fight-as-creature input; held until set again
    substate: null,          // BETWEEN_TURN substate
    attackPhase: null,       // CHOSEN_ATTACK phase
    windowElapsedMs: 0,      // turn clock for the current window
    battleElapsedMs: 0,
    clashCount: 0,
    lastClashAtMs: -Infinity,
    lastEvalMs: 0,
    holdUntilMs: 0,
    promptEmitted: false,
    pressureStep: 0,
    separating: false,
    clash: null,             // active clash record, if any
    clashes: [],             // completed clash records this window
    chosen: null,            // chosen-attack record, if any
    attackResolved: false,
    returnSkipped: false,
    faintedSide: null,
    events: [],
    camera: { shot: 'NEUTRAL', zoom: 1, shakePx: 0, tiltDeg: 0 },
  };

  function emit(type, detail) {
    const ev = Object.freeze(Object.assign({ tMs: battle.battleElapsedMs, type }, detail || {}));
    battle.events.push(ev);
    return ev;
  }
  function emitCamera(shot, extra) {
    const base = { shot, zoom: 1, shakePx: 0, tiltDeg: 0 };
    const cam = Object.assign(base, extra || {});
    // Between-turn camera NEVER shakes (spec §4); shake is reserved
    // for real damage. Enforced here, not left to the renderer.
    if (battle.state === 'BETWEEN_TURN' && (shot === 'NEUTRAL' || shot === 'FOLLOW' || shot === 'CLASH')) {
      cam.shakePx = 0; cam.tiltDeg = 0;
    }
    if (reduceMotion) {
      cam.shakePx = 0; cam.tiltDeg = 0;
      cam.zoom = 1 + (cam.zoom - 1) / 2; // push-in zooms halved
    }
    battle.camera = Object.freeze({ shot: cam.shot, zoom: cam.zoom, shakePx: cam.shakePx, tiltDeg: cam.tiltDeg });
    emit('camera', { shot: cam.shot, zoom: cam.zoom, shakePx: cam.shakePx, tiltDeg: cam.tiltDeg });
    return battle.camera;
  }
  function spacing() { return dist(player, foe); }
  function pressureSpeedMult() {
    return 1 + Math.min(battle.pressureStep * ARENA.PRESSURE_SPEED_STEP, ARENA.PRESSURE_SPEED_CAP);
  }
  function clashFloorMs() {
    return battle.pressureStep >= 1 ? ARENA.CLASH_FLOOR_PRESSURE_MS : ARENA.CLASH_FLOOR_MS;
  }
  // Angle of attacker as seen from defender, off the defender's facing.
  function flankAngleOf(attacker, defender) {
    return angleDiff(angleTo(defender.x, defender.y, attacker.x, attacker.y), defender.facingDeg);
  }
  function bankedArcOf(creature) {
    // A flank banks only if held >= 1.0 s (spec §3.3b). Otherwise Front (no bonus).
    return creature.flankHoldMs >= ARENA.FLANK_BANK_MS ? creature.flankArc : 'Front';
  }
  function clampToArena(c, other) {
    const r = Math.hypot(c.x, c.y);
    if (r > ARENA.ARENA_RADIUS_U) { c.x *= ARENA.ARENA_RADIUS_U / r; c.y *= ARENA.ARENA_RADIUS_U / r; }
    const s = dist(c, other);
    if (s < ARENA.MIN_SEPARATION_U && s > 0) {
      // Push this creature out along the axis until separation is legal.
      const ux = (c.x - other.x) / s, uy = (c.y - other.y) / s;
      c.x = other.x + ux * ARENA.MIN_SEPARATION_U;
      c.y = other.y + uy * ARENA.MIN_SEPARATION_U;
    }
  }
  function moveToward(c, target, speedUps, dtSec) {
    const d = dist(c, target);
    if (d <= 0) return;
    const step = Math.min(speedUps * dtSec, d);
    c.x += (target.x - c.x) / d * step;
    c.y += (target.y - c.y) / d * step;
  }
  function moveAway(c, from, speedUps, dtSec) {
    const d = dist(c, from);
    const ux = d > 0 ? (c.x - from.x) / d : 1, uy = d > 0 ? (c.y - from.y) / d : 0;
    c.x += ux * speedUps * dtSec;
    c.y += uy * speedUps * dtSec;
  }
  function moveTangential(c, center, dir, speedUps, dtSec) {
    const dx = c.x - center.x, dy = c.y - center.y;
    const r = Math.hypot(dx, dy) || 1;
    // Tangential unit vector (counter-clockwise for dir = 1).
    const tx = -dy / r * dir, ty = dx / r * dir;
    c.x += tx * speedUps * dtSec;
    c.y += ty * speedUps * dtSec;
  }
  function updateFacing(c, target, dtSec) {
    const desired = angleTo(c.x, c.y, target.x, target.y)
      - (c.behaviour === 'CIRCLING' ? circleDirection * ARENA.CIRCLE_FACING_LAG_DEG : 0);
    const rate = c.behaviour === 'CIRCLING'
      ? ARENA.TURN_RATE_CIRCLE_DEG_S : ARENA.TURN_RATE_DEFAULT_DEG_S;
    c.facingDeg = turnToward(c.facingDeg, desired, rate * dtSec);
  }
  function updateFlankAndMomentum(c, opponent, dtMs) {
    const arc = flankArc(flankAngleOf(c, opponent));
    if (arc === c.flankArc && arc !== 'Front') c.flankHoldMs += dtMs;
    else if (arc !== 'Front') { c.flankArc = arc; c.flankHoldMs = dtMs; }
    else { c.flankArc = 'Front'; c.flankHoldMs = 0; }
    if ((c.flankArc === 'Side' || c.flankArc === 'Rear')
      && c.flankHoldMs >= ARENA.MOMENTUM_FLANK_HOLD_MS && !c.flankBonusAwarded) {
      c.momentum = Math.min(ARENA.MOMENTUM_MAX, c.momentum + ARENA.MOMENTUM_FLANK_HOLD);
      c.flankBonusAwarded = true;
      emit('momentum', { side: c.side, momentum: c.momentum, reason: 'flank_hold_2s' });
    }
  }
  function evaluateAI() {
    if (battle.separating) {
      player.behaviour = 'SEPARATING'; foe.behaviour = 'SEPARATING';
      battle.substate = 'SEPARATING';
      return;
    }
    const s = spacing();
    for (const c of [player, foe]) {
      const other = c === player ? foe : player;
      if (c.bodyType === 'static') { c.behaviour = 'HOLDING'; continue; } // spec §3.1: static never translates
      if (battle.battleElapsedMs < battle.holdUntilMs) { c.behaviour = 'HOLDING'; continue; }
      // Fight-as-creature: the driven player's behaviour is the player's
      // input, not an AI pick. (SEPARATING already returned above, so
      // auto-separate still overrides drive input, as specified.)
      if (mode === 'driven' && c.side === 'player') { c.behaviour = 'DRIVEN'; continue; }
      if (s < ARENA.RANGE_CLOSE_U && pressuredSide === c.side) c.behaviour = 'RETREATING';
      else if (s > ARENA.NEUTRAL_SPACING_U || c.momentum < 30) c.behaviour = 'ADVANCING';
      else if (c.temperament === 'aggressive' || c.momentum >= 50) c.behaviour = 'STALKING';
      else c.behaviour = 'CIRCLING';
    }
    const behaviours = [player.behaviour, foe.behaviour];
    battle.substate = behaviours.indexOf('ADVANCING') !== -1 ? 'ADVANCING'
      : behaviours.indexOf('RETREATING') !== -1 ? 'RETREATING'
      : behaviours.indexOf('STALKING') !== -1 ? 'ADVANCING'
      : behaviours.indexOf('SEPARATING') !== -1 ? 'SEPARATING' : 'CIRCLING';
    // Camera: gentle push-in while either creature ADVANCEs (spec §4 FOLLOW).
    if (behaviours.indexOf('ADVANCING') !== -1 || behaviours.indexOf('STALKING') !== -1) {
      emitCamera('FOLLOW', { zoom: ARENA.CAMERA_FOLLOW_ZOOM });
    } else {
      emitCamera('NEUTRAL', { zoom: 1 });
    }
  }
  function integrateMovement(dtMs) {
    const dtSec = dtMs / 1000;
    const mult = pressureSpeedMult();
    for (const c of [player, foe]) {
      const other = c === player ? foe : player;
      if (c.bodyType === 'static') {
        // Pulse + facing rotation only; no translation (spec §3.1).
        c.altitude = 0;
        updateFacing(c, other, dtSec);
        continue;
      }
      if (c.bodyType === 'flyer') {
        // Circle at altitude with a vertical sine bob, never grounded footwork.
        c.altitude = 0.5 + 0.25 * Math.sin(battle.battleElapsedMs / 1000 * 2 * Math.PI / 1.8);
      }
      switch (c.behaviour) {
        case 'ADVANCING': {
          const sp = c.bodyType === 'heavy' ? ARENA.SPEED_ADVANCE_HEAVY_UPS : ARENA.SPEED_ADVANCE_UPS;
          moveToward(c, other, sp * mult, dtSec);
          break;
        }
        case 'DRIVEN': {
          // Fight-as-creature: move by the player's held input vector
          // (magnitude <= 1) at advance speed. Facing still tracks the
          // foe (updateFacing below), so flank math stays spec-true.
          const sp = c.bodyType === 'heavy' ? ARENA.SPEED_ADVANCE_HEAVY_UPS : ARENA.SPEED_ADVANCE_UPS;
          c.x += battle.driveInput.x * sp * mult * dtSec;
          c.y += battle.driveInput.y * sp * mult * dtSec;
          break;
        }
        case 'RETREATING': moveAway(c, other, ARENA.SPEED_RETREAT_UPS * mult, dtSec); break;
        case 'CIRCLING': moveTangential(c, other, circleDirection, ARENA.SPEED_CIRCLE_UPS * mult, dtSec); break;
        case 'STALKING': moveToward(c, other, ARENA.SPEED_STALK_UPS * mult, dtSec); break;
        case 'SEPARATING': {
          // Both move until neutral spacing is reached.
          if (spacing() < ARENA.NEUTRAL_SPACING_U) moveAway(c, other, ARENA.SPEED_SEPARATE_UPS * mult, dtSec);
          break;
        }
        default: break; // HOLDING: idle loop only, 0 u/s
      }
      updateFacing(c, other, dtSec);
    }
    // Enforce arena + separation invariants (spec §6 BETWEEN_TURN invariants).
    // Static creature never moves, so only the foe is pushed off it.
    if (player.bodyType === 'static') clampToArena(foe, player);
    else if (foe.bodyType === 'static') clampToArena(player, foe);
    else { clampToArena(player, foe); clampToArena(foe, player); }
    if (battle.separating && spacing() >= ARENA.NEUTRAL_SPACING_U - 0.05) {
      battle.separating = false;
      emit('separated', { spacing: spacing() });
      evaluateAI();
    }
  }
  function tryStartClash() {
    if (battle.clash) return null;
    if (battle.clashCount >= ARENA.MAX_CLASHES_PER_WINDOW) return null;
    if (spacing() > ARENA.CLASH_RANGE_U) return null;
    if (battle.battleElapsedMs - battle.lastClashAtMs < clashFloorMs()) return null;
    if (player.behaviour === 'HOLDING' || foe.behaviour === 'HOLDING') return null;
    // Both creatures must be in CIRCLE / ADVANCE / STALK (spec §3.2).
    // In driven mode the driven player's DRIVEN behaviour counts as
    // engaging (driving into contact is sparring); the foe's side
    // still needs a real AI behaviour.
    const ok = (b, side) => b === 'CIRCLING' || b === 'ADVANCING' || b === 'STALKING'
      || (mode === 'driven' && side === 'player' && b === 'DRIVEN');
    if (!ok(player.behaviour, 'player') || !ok(foe.behaviour, 'foe')) return null;
    const winnerSide = rng() < 0.5 ? 'player' : 'foe';
    const sparkCount = ARENA.CLASH_SPARK_MIN
      + Math.floor(rng() * (ARENA.CLASH_SPARK_MAX - ARENA.CLASH_SPARK_MIN + 1));
    const clash = {
      index: battle.clashCount + 1,
      winnerSide,
      sparkCount,
      sparkLifeMs: ARENA.CLASH_SPARK_LIFE_MS,
      spacingAtClashU: spacing(),
      preClash: {
        player: { x: player.x, y: player.y },
        foe: { x: foe.x, y: foe.y },
      },
      axis: { x: (foe.x - player.x) / (spacing() || 1), y: (foe.y - player.y) / (spacing() || 1) },
      elapsedMs: 0,
      phase: 'feint',
      countedForMomentum: battle.clashCount < ARENA.MOMENTUM_CLASH_COUNTED,
    };
    battle.clash = clash;
    battle.substate = 'SPAR_CLASH';
    emitCamera('CLASH', { zoom: ARENA.CAMERA_CLASH_ZOOM }); // push-in only, shake 0 (spec §4)
    emit('clash_start', { index: clash.index, winnerSide, sparkCount, spacing: clash.spacingAtClashU });
    return clash;
  }
  function advanceClash(dtMs) {
    const clash = battle.clash;
    if (!clash) return;
    clash.elapsedMs += dtMs;
    const t = clash.elapsedMs;
    const ax = clash.axis.x, ay = clash.axis.y;
    if (t < ARENA.CLASH_FEINT_MS) {
      clash.phase = 'feint'; // both lean in (squash 0.95x height, see sampleClashPose)
    } else if (t < ARENA.CLASH_FEINT_MS + ARENA.CLASH_KNOCKBACK_MS) {
      clash.phase = 'knockback';
      const p = easeOutCubic((t - ARENA.CLASH_FEINT_MS) / ARENA.CLASH_KNOCKBACK_MS);
      player.x = clash.preClash.player.x - ax * ARENA.CLASH_KNOCKBACK_U * p;
      player.y = clash.preClash.player.y - ay * ARENA.CLASH_KNOCKBACK_U * p;
      foe.x = clash.preClash.foe.x + ax * ARENA.CLASH_KNOCKBACK_U * p;
      foe.y = clash.preClash.foe.y + ay * ARENA.CLASH_KNOCKBACK_U * p;
    } else if (t < ARENA.CLASH_TOTAL_MS) {
      clash.phase = 'recover';
      const p = easeOutCubic((t - ARENA.CLASH_FEINT_MS - ARENA.CLASH_KNOCKBACK_MS) / ARENA.CLASH_EASE_BACK_MS);
      player.x = clash.preClash.player.x - ax * ARENA.CLASH_KNOCKBACK_U * (1 - p);
      player.y = clash.preClash.player.y - ay * ARENA.CLASH_KNOCKBACK_U * (1 - p);
      foe.x = clash.preClash.foe.x + ax * ARENA.CLASH_KNOCKBACK_U * (1 - p);
      foe.y = clash.preClash.foe.y + ay * ARENA.CLASH_KNOCKBACK_U * (1 - p);
    } else {
      // Outcome, visual only (spec §3.2 step 4): winner advances 0.3 u,
      // loser retreats 0.3 u. NO HP, NO hurt art, NO status — by design
      // this code path never touches hp (see tests).
      const winner = clash.winnerSide === 'player' ? player : foe;
      const loser = clash.winnerSide === 'player' ? foe : player;
      moveToward(winner, loser, ARENA.CLASH_WIN_ADVANCE_U / 0.1, 0.1);
      moveAway(loser, winner, ARENA.CLASH_WIN_ADVANCE_U / 0.1, 0.1);
      if (clash.countedForMomentum) {
        winner.momentum = Math.min(ARENA.MOMENTUM_MAX, winner.momentum + ARENA.MOMENTUM_CLASH_WIN);
        emit('momentum', { side: winner.side, momentum: winner.momentum, reason: 'clash_win' });
      }
      battle.clashCount += 1;
      battle.lastClashAtMs = battle.battleElapsedMs;
      battle.clashes.push(Object.freeze(Object.assign({}, clash, { elapsedMs: clash.elapsedMs })));
      battle.clash = null;
      // Both HOLD 0.8 s after a clash (spec §3.1). The winner's 100 ms
      // faster recovery (spec §3.2 step 4) is a staging offset the
      // renderer applies to the winner's idle resumption; it does not
      // shorten the shared HOLD window, so it cannot be farmed into
      // an extra clash (the 1.2 s floor still governs).
      battle.holdUntilMs = battle.battleElapsedMs + ARENA.HOLD_AFTER_CLASH_MS;
      player.behaviour = 'HOLDING'; foe.behaviour = 'HOLDING';
      emit('clash_end', { index: clash.index, winnerSide: clash.winnerSide, clashCount: battle.clashCount });
      if (battle.clashCount >= ARENA.MAX_CLASHES_PER_WINDOW) {
        battle.separating = true; // spec §1.1 rule 3: auto-separate after 6th clash
        emit('auto_separate', { reason: 'clash_cap' });
        evaluateAI();
      } else {
        battle.substate = 'HOLDING';
      }
    }
  }
  function decayMomentum(dtMs) {
    if (battle.windowElapsedMs <= ARENA.MOMENTUM_DECAY_AFTER_MS) return;
    // -5/s after 10 s without a choice: accumulate whole seconds.
    battle._decayAcc = (battle._decayAcc || 0) + dtMs;
    while (battle._decayAcc >= 1000) {
      battle._decayAcc -= 1000;
      player.momentum = Math.max(0, player.momentum - ARENA.MOMENTUM_DECAY_PER_SEC);
      foe.momentum = Math.max(0, foe.momentum - ARENA.MOMENTUM_DECAY_PER_SEC);
    }
  }

  // ------------------------------------------------------------ public API
  const api = {
    ARENA,
    player, foe,
    get state() { return battle.state; },
    get substate() { return battle.substate; },
    get attackPhase() { return battle.attackPhase; },
    get windowElapsedMs() { return battle.windowElapsedMs; },
    get clashCount() { return battle.clashCount; },
    get pressureStep() { return battle.pressureStep; },
    get events() { return battle.events.slice(); },
    get camera() { return battle.camera; },
    get foeIdlePhaseOffset() { return foeIdlePhaseOffset; },
    get clashes() { return battle.clashes.slice(); },
    get activeClash() { return battle.clash; },
    get chosen() { return battle.chosen; },
    get mode() { return battle.mode; },

    start() {
      if (battle.state !== 'BATTLE_START') throw new Error('start() is only valid from BATTLE_START');
      battle.state = 'BETWEEN_TURN';
      battle.substate = 'CIRCLING';
      // Driven mode starts driven (not CIRCLING): otherwise the first
      // 500 ms before the first AI evaluation would move the driven
      // creature on the AI's behalf.
      player.behaviour = mode === 'driven' ? 'DRIVEN' : 'CIRCLING'; foe.behaviour = 'CIRCLING';
      emit('battle_start', { spacing: spacing(), foeIdlePhaseOffset });
      emitCamera('NEUTRAL', { zoom: 1 });
      return api.snapshot();
    },

    // Advance the simulation by dtMs. In BETWEEN_TURN this runs the AI,
    // movement, flank/momentum tracking, clashes, pressure and the turn
    // clock. In CHOSEN_ATTACK it advances ONLY the attack-phase clock:
    // no AI re-evaluation, no movement, no sparring (spec §6 interrupt
    // rule). In any other state it is a no-op for gameplay state.
    tick(dtMs) {
      const dt = typeof dtMs === 'number' && dtMs > 0 ? dtMs : 0;
      if (dt === 0) return api.snapshot();
      battle.battleElapsedMs += dt;
      if (battle.state === 'BETWEEN_TURN') {
        battle.windowElapsedMs += dt;
        // Pressure escalation (spec §1.1 rule 4).
        const step = Math.floor(battle.windowElapsedMs / ARENA.PRESSURE_STEP_MS);
        if (step !== battle.pressureStep) {
          battle.pressureStep = step;
          emit('pressure', { step, speedMultiplier: pressureSpeedMult(), clashFloorMs: clashFloorMs() });
        }
        // Turn clock: prompt at 20 s, deterministic fallback at 30 s.
        if (!battle.promptEmitted && battle.windowElapsedMs >= ARENA.PROMPT_MS) {
          battle.promptEmitted = true;
          emit('choose_now_prompt', { windowElapsedMs: battle.windowElapsedMs });
        }
        if (battle.windowElapsedMs >= ARENA.TURN_CLOCK_MS) {
          // Fallback: last-used move, else first move (spec §1.1 rule 1).
          const idx = player.lastUsedMoveIndex >= 0 ? player.lastUsedMoveIndex : 0;
          emit('turn_clock_fallback', { moveIndex: idx, move: player.moves[idx].name });
          api.chooseMove(idx, { fallback: true });
          return api.snapshot();
        }
        if (battle.clash) {
          advanceClash(dt);
        } else {
          if (battle.battleElapsedMs - battle.lastEvalMs >= ARENA.AI_EVAL_MS) {
            battle.lastEvalMs = battle.battleElapsedMs;
            evaluateAI();
          }
          integrateMovement(dt);
          updateFlankAndMomentum(player, foe, dt);
          updateFlankAndMomentum(foe, player, dt);
          decayMomentum(dt);
          tryStartClash();
        }
        return api.snapshot();
      }
      if (battle.state === 'CHOSEN_ATTACK' && battle.chosen) {
        battle.chosen.elapsedMs += dt;
        api.advanceAttackPhases();
        return api.snapshot();
      }
      return api.snapshot();
    },

    // Player confirms a choice. Freezes between-turn motion at this
    // frame (the frozen pose is the attack's start frame, spec §6) and
    // computes positioning modifiers for the NEXT chosen attack only.
    // Non-damage kinds (healing/item/switch/run) always get zero
    // modifiers (spec §3.4). Throws if not in BETWEEN_TURN: a choice
    // cannot interrupt an in-flight chosen attack.
    chooseMove(moveIndex, options) {
      if (battle.state !== 'BETWEEN_TURN') {
        throw new Error('chooseMove is only valid in BETWEEN_TURN (state: ' + battle.state + ')');
      }
      const idx = typeof moveIndex === 'number' ? moveIndex : player.moves.indexOf(moveIndex);
      if (idx < 0 || idx >= player.moves.length) throw new Error('chooseMove: move index out of range');
      const move = player.moves[idx];
      const isDamage = DAMAGE_KINDS.indexOf(move.kind) !== -1;
      const s = spacing();
      const modifiers = isDamage ? computeModifiers({
        spacing: s, bankedFlankArc: bankedArcOf(player), momentum: player.momentum,
        kind: move.kind, baseAccuracy: move.accuracy, critChance: move.critChance,
      }) : noModifiers({ spacing: s, baseAccuracy: move.accuracy, critChance: move.critChance });
      player.lastUsedMoveIndex = idx;
      const frozenPose = api.sampleArenaPose();
      const timeline = buildChosenAttackTimeline(move, modifiers);
      battle.chosen = {
        moveIndex: idx, move: Object.assign({}, move), modifiers,
        frozenPose, timeline, elapsedMs: 0, phaseIndex: 0,
        fallback: !!(options && options.fallback),
      };
      battle.attackPhase = 'TELEGRAPH';
      battle.attackResolved = false;
      battle.returnSkipped = false;
      battle.state = 'CHOSEN_ATTACK';
      battle.substate = null;
      emit('choice', { move: move.name, kind: move.kind, modifiers, fallback: battle.chosen.fallback });
      emitCamera('WINDUP_PUSH', { zoom: SEVERITY_TABLE.medium.cameraPush });
      return Object.freeze({
        move: Object.assign({}, move), modifiers, frozenPose, timeline,
        phase: 'TELEGRAPH',
      });
    },

    // Step the chosen-attack camera/phase events from the attack clock.
    // Pure staging: never touches HP.
    advanceAttackPhases() {
      const ch = battle.chosen;
      if (!ch) return;
      const t = ch.elapsedMs;
      const phases = ch.timeline.phases;
      let phase = phases[phases.length - 1].phase;
      for (const p of phases) {
        if (t >= p.startMs && t < p.endMs) { phase = p.phase; break; }
        if (t < p.startMs) { phase = p.phase; break; }
      }
      if (phase !== battle.attackPhase) {
        battle.attackPhase = phase;
        if (phase === 'STRIKE') emitCamera('IMPACT_CUT', { zoom: 1 });
        else if (phase === 'IMPACT_HOLD') {
          const sev = ch.severity || 'medium';
          emitCamera('IMPACT_SHAKE', { zoom: 1, shakePx: SEVERITY_TABLE[sev].shakePx });
          if (sev === 'heavy' || sev === 'critical' || battle.faintedSide) {
            emitCamera('TILT_BIG', { tiltDeg: sev === 'critical' ? ARENA.TILT_CRIT_DEG : ARENA.TILT_HEAVY_DEG });
          }
        } else if (phase === 'RETURN') emitCamera('RETURN_NEUTRAL', { zoom: 1 });
      }
    },

    // Apply a resolved chosen attack. `damage` is the move's raw damage
    // BEFORE positioning modifiers; the power multiplier is applied
    // here, exactly once. `hit: false` = a miss: no HP moves at all.
    // damagePerHit (array) splits a multi-hit move; faint mid-sequence
    // stops remaining hits and skips RETURN (spec §2.1). Momentum
    // resets to 0 the moment the attack resolves (spec §1.1 rule 2).
    // Returns the full result; the caller drives staging from it.
    resolveAttack(input) {
      if (battle.state !== 'CHOSEN_ATTACK' || !battle.chosen) {
        throw new Error('resolveAttack is only valid during CHOSEN_ATTACK');
      }
      const o = input || {};
      const ch = battle.chosen;
      const mult = ch.modifiers.powerMultiplier;
      let hits = [];
      if (Array.isArray(o.damagePerHit) && o.damagePerHit.length > 0) hits = o.damagePerHit.slice();
      else if (typeof o.damage === 'number') hits = [o.damage];
      else hits = [ch.move.power];
      const hit = o.hit !== false;
      const isCrit = !!o.isCrit;
      let totalDealt = 0;
      let fainted = false;
      if (hit) {
        for (const raw of hits) {
          if (foe.hp <= 0) break; // faint mid-sequence stops remaining hits
          const dealt = Math.max(0, Math.round(raw * mult));
          foe.hp = Math.max(0, foe.hp - dealt);
          totalDealt += dealt;
          if (foe.hp <= 0) { fainted = true; break; }
        }
      }
      const damageFraction = foe.maxHp > 0 ? totalDealt / foe.maxHp : 0;
      const severity = severityFor(damageFraction, isCrit);
      ch.severity = severity;
      player.momentum = 0; foe.momentum = 0; // spent, not banked (spec §1.1 rule 2)
      battle.attackResolved = true;
      battle.state = 'RESOLUTION';
      battle.attackPhase = null;
      if (fainted) {
        battle.faintedSide = 'foe';
        battle.returnSkipped = true; // SKIP return, straight to faint (spec §2.1)
        battle.state = 'FAINT';
        emitCamera('TILT_BIG', { tiltDeg: ARENA.TILT_KO_DEG });
        emit('faint', { side: 'foe', name: foe.name, returnSkipped: true });
      }
      emit('attack_resolved', {
        move: ch.move.name, hit, isCrit, severity, damageDealt: totalDealt,
        damageFraction, powerMultiplier: mult, foeHp: foe.hp, foeMaxHp: foe.maxHp, fainted,
      });
      return Object.freeze({
        move: Object.assign({}, ch.move), hit, isCrit, severity,
        damageDealt: totalDealt, damageFraction,
        powerMultiplier: mult, effectiveAccuracy: ch.modifiers.effectiveAccuracy,
        foeHp: foe.hp, foeMaxHp: foe.maxHp, fainted, returnSkipped: battle.returnSkipped,
        timeline: ch.timeline,
      });
    },

    // Resolve a non-damage choice (heal/switch/item/run). No positioning
    // modifier is ever applied here; an optional heal amount is the
    // item's own effect, not a modifier, and is clamped to max HP.
    resolveNonDamageAction(input) {
      if (battle.state !== 'CHOSEN_ATTACK' || !battle.chosen) {
        throw new Error('resolveNonDamageAction is only valid during CHOSEN_ATTACK');
      }
      const o = input || {};
      const ch = battle.chosen;
      if (DAMAGE_KINDS.indexOf(ch.move.kind) !== -1) {
        throw new Error('resolveNonDamageAction cannot resolve a damage move; use resolveAttack');
      }
      if (ch.move.kind === 'healing' && typeof o.heal === 'number' && o.heal > 0) {
        player.hp = Math.min(player.maxHp, player.hp + Math.floor(o.heal));
      }
      player.momentum = 0; foe.momentum = 0;
      battle.attackResolved = true;
      battle.state = 'RESOLUTION';
      battle.attackPhase = null;
      emit('action_resolved', { move: ch.move.name, kind: ch.move.kind, playerHp: player.hp });
      return Object.freeze({ move: Object.assign({}, ch.move), playerHp: player.hp, foeHp: foe.hp });
    },

    // Skip / 2x fast-forward: jumps to RESOLUTION. Only valid after
    // resolveAttack/resolveNonDamageAction (HP result already
    // computed); staging alone is never skipped into a result.
    skipToResolution() {
      if (battle.state !== 'CHOSEN_ATTACK' || !battle.attackResolved) {
        throw new Error('skipToResolution requires a resolved chosen attack (call resolveAttack first)');
      }
      battle.state = 'RESOLUTION';
      battle.attackPhase = null;
      emit('skipped_to_resolution', {});
      return api.snapshot();
    },

    // End RESOLUTION (or FAINT): reset clash count + turn clock, then
    // BETWEEN_TURN (SEPARATING first if spacing != 6 u) or BATTLE_END.
    finishResolution() {
      if (battle.state !== 'RESOLUTION' && battle.state !== 'FAINT') {
        throw new Error('finishResolution is only valid from RESOLUTION or FAINT');
      }
      if (battle.faintedSide) {
        battle.state = 'BATTLE_END';
        battle.substate = null;
        emit('battle_end', { winnerSide: battle.faintedSide === 'foe' ? 'player' : 'foe' });
        return api.snapshot();
      }
      battle.clashCount = 0;
      battle.clashes = [];
      battle.windowElapsedMs = 0;
      battle.promptEmitted = false;
      battle.pressureStep = 0;
      battle._decayAcc = 0;
      battle.lastClashAtMs = -Infinity;
      battle.chosen = null;
      battle.attackResolved = false;
      circleDirection = rng() < 0.5 ? 1 : -1;
      pressuredSide = rng() < 0.5 ? 'player' : 'foe';
      for (const c of [player, foe]) {
        c.flankArc = 'Front'; c.flankHoldMs = 0; c.flankBonusAwarded = false;
      }
      battle.state = 'BETWEEN_TURN';
      if (Math.abs(spacing() - ARENA.NEUTRAL_SPACING_U) > 0.05) {
        battle.separating = true;
        player.behaviour = 'SEPARATING'; foe.behaviour = 'SEPARATING';
        battle.substate = 'SEPARATING';
        emit('separating', { spacing: spacing() });
      } else {
        battle.separating = false;
        battle.substate = 'CIRCLING';
        player.behaviour = mode === 'driven' ? 'DRIVEN' : 'CIRCLING'; foe.behaviour = 'CIRCLING';
      }
      emitCamera('NEUTRAL', { zoom: 1 });
      emit('turn_start', { spacing: spacing() });
      return api.snapshot();
    },

    // ------------------------------------------------------------ samplers
    // sampleArenaPose: the between-turn layer pose (spec §5.1 addition).
    // Pure snapshot: position, facing yaw, behaviour, momentum, range
    // band and flank arc per creature. The game drives sprite
    // translation + idle loops from this; the loop itself never changes.
    sampleArenaPose() {
      const s = spacing();
      const poseFor = (c, other) => Object.freeze({
        name: c.name, side: c.side, x: c.x, y: c.y, altitude: c.altitude,
        facingDeg: c.facingDeg, behaviour: c.behaviour, bodyType: c.bodyType,
        momentum: c.momentum, rangeBand: rangeBand(s),
        flankArc: flankArc(flankAngleOf(c, other)),
        flankArcBanked: bankedArcOf(c),
        flankHoldMs: c.flankHoldMs, hp: c.hp, maxHp: c.maxHp,
      });
      return Object.freeze({
        state: battle.state, substate: battle.substate, mode: battle.mode,
        spacingU: s,
        midpoint: Object.freeze({ x: (player.x + foe.x) / 2, y: (player.y + foe.y) / 2 }),
        player: poseFor(player, foe), foe: poseFor(foe, player),
        camera: battle.camera, windowElapsedMs: battle.windowElapsedMs,
        clashCount: battle.clashCount, pressureStep: battle.pressureStep,
      });
    },
    // sampleClashPose: the §3.2 clash at elapsedMs into its ~700 ms beat.
    // Pure function of the clash record + elapsed time: feint squash
    // 0.95x height, 0.4 u knockback (ease-out cubic), spark burst.
    // Never carries HP, hurt art, or status: sparring shows none.
    sampleClashPose(clash, elapsedMs) {
      const cl = clash || battle.clash || battle.clashes[battle.clashes.length - 1];
      if (!cl) return null;
      const t = typeof elapsedMs === 'number' ? elapsedMs : (cl.elapsedMs || 0);
      let phase = 'feint'; let squashY = 1; let knockbackU = 0;
      if (t < ARENA.CLASH_FEINT_MS) { phase = 'feint'; squashY = 0.95; }
      else if (t < ARENA.CLASH_FEINT_MS + ARENA.CLASH_KNOCKBACK_MS) {
        phase = 'knockback';
        knockbackU = ARENA.CLASH_KNOCKBACK_U * easeOutCubic((t - ARENA.CLASH_FEINT_MS) / ARENA.CLASH_KNOCKBACK_MS);
      } else if (t < ARENA.CLASH_TOTAL_MS) {
        phase = 'recover';
        knockbackU = ARENA.CLASH_KNOCKBACK_U
          * (1 - easeOutCubic((t - ARENA.CLASH_FEINT_MS - ARENA.CLASH_KNOCKBACK_MS) / ARENA.CLASH_EASE_BACK_MS));
      } else phase = 'done';
      return Object.freeze({
        index: cl.index, phase, squashY, knockbackU,
        sparkCount: cl.sparkCount, sparkLifeMs: ARENA.CLASH_SPARK_LIFE_MS,
        winnerSide: cl.winnerSide,
        winnerRecoverBonusMs: ARENA.CLASH_WIN_RECOVER_BONUS_MS,
        defenderArt: 'standing', // sparring NEVER shows hurt art
        hpDelta: 0, shakePx: 0, // sparring NEVER shakes or moves HP
      });
    },
    // mapArenaPoseTo3D: between-turn layer -> rig space (spec §5.2).
    // Root translation is already in arena units; spine lean = 2D
    // rotation x 2.5 and camera dolly = (zoom - 1) x 2.0 m match
    // battleTreatments.mapTo3D exactly.
    mapArenaPoseTo3D(pose2d) {
      const p = pose2d || {};
      const zoom = typeof p.cameraZoom === 'number' ? p.cameraZoom : 1;
      return Object.freeze({
        rootOffsetX: typeof p.x === 'number' ? p.x : 0,
        rootOffsetY: typeof p.y === 'number' ? p.y : 0,
        altitude: typeof p.altitude === 'number' ? p.altitude : 0,
        facingYawDeg: typeof p.facingDeg === 'number' ? p.facingDeg : 0,
        spineLeanDeg: (typeof p.rotationDeg === 'number' ? p.rotationDeg : 0) * 2.5,
        cameraDollyM: (zoom - 1) * 2.0,
        hurtPoseWeight: 0, // between-turn layer never shows hurt pose
      });
    },

    // ------------------------------------------------------------ scripting hooks
    // Demo / test hooks ONLY (not gameplay): place creatures and facing
    // directly so a scripted scenario (e.g. the spec §7 demo: a banked
    // rear arc at Close spacing) can be staged through the real
    // modifier computation instead of around it. Gameplay never calls
    // these; the AI owns positions during a real battle.
    //
    // Fight-as-creature input (NOT a demo-only hook — this is the real
    // driven-mode input, Mars 2026-10-25 ~19:45). The game calls
    // setDriveInput every frame (or on input change) with the player's
    // held direction vector; it is held until set again, normalized
    // when its magnitude exceeds 1, and ignored by the AI (which never
    // overwrites a driven player's behaviour). It never deals damage,
    // never chooses an attack, and freezes with everything else the
    // moment chooseMove is called.
    setDriveInput(vec) {
      if (mode !== 'driven') throw new Error('setDriveInput requires mode: "driven" (this battle is mode: "' + mode + '")');
      const v = vec || {};
      const x = typeof v.x === 'number' ? v.x : 0;
      const y = typeof v.y === 'number' ? v.y : 0;
      const mag = Math.hypot(x, y);
      battle.driveInput = mag > 1 ? { x: x / mag, y: y / mag } : { x, y };
      return api.snapshot();
    },
    setPositions(playerPos, foePos) {
      if (playerPos) { player.x = playerPos.x; player.y = playerPos.y; }
      if (foePos) { foe.x = foePos.x; foe.y = foePos.y; }
      return api.snapshot();
    },
    setFacing(side, facingDeg) {
      const c = side === 'foe' ? foe : player;
      c.facingDeg = facingDeg;
      return api.snapshot();
    },
    setBehaviour(side, behaviour) {
      const c = side === 'foe' ? foe : player;
      c.behaviour = behaviour;
      return api.snapshot();
    },

    snapshot() {
      return Object.freeze({
        state: battle.state, substate: battle.substate, attackPhase: battle.attackPhase,
        mode: battle.mode, driveInput: Object.freeze({ x: battle.driveInput.x, y: battle.driveInput.y }),
        player: Object.freeze({ name: player.name, hp: player.hp, maxHp: player.maxHp,
          x: player.x, y: player.y, facingDeg: player.facingDeg, behaviour: player.behaviour,
          momentum: player.momentum, bodyType: player.bodyType }),
        foe: Object.freeze({ name: foe.name, hp: foe.hp, maxHp: foe.maxHp,
          x: foe.x, y: foe.y, facingDeg: foe.facingDeg, behaviour: foe.behaviour,
          momentum: foe.momentum, bodyType: foe.bodyType }),
        spacingU: spacing(), windowElapsedMs: battle.windowElapsedMs,
        clashCount: battle.clashCount, pressureStep: battle.pressureStep,
        camera: battle.camera, faintedSide: battle.faintedSide,
        returnSkipped: battle.returnSkipped,
      });
    },
  };
  // Dead-code guard removed: pressureSpeedMult is the only speed source.
  return api;
}

// Chosen-attack timeline (spec §2.1 phases + treatment beats).
// Telegraphed attacks are uninterruptable: this timeline is fixed at
// choice time and only staging walks it afterwards.
function buildChosenAttackTimeline(move, modifiers) {
  const m = move || {};
  const heavy = m.weight === 'heavy';
  const travelPhase = m.kind === 'projectile' ? 'CAST' : 'TRAVEL';
  const travelMs = m.kind === 'projectile' ? ARENA.CAST_MS : ARENA.TRAVEL_MS;
  const windupMs = heavy ? ARENA.WINDUP_HEAVY_MS : ARENA.WINDUP_LIGHT_MS;
  const strikeMs = heavy ? ARENA.STRIKE_HEAVY_MS : ARENA.STRIKE_LIGHT_MS;
  const hits = typeof m.hits === 'number' && m.hits > 1 ? Math.floor(m.hits) : 1;
  const phases = [];
  let t = 0;
  const push = (phase, ms) => { phases.push(Object.freeze({ phase, startMs: t, endMs: t + ms })); t += ms; };
  push('TELEGRAPH', ARENA.TELEGRAPH_MS);
  push(travelPhase, travelMs);
  push('WINDUP', windupMs);
  for (let h = 0; h < hits; h++) {
    if (h > 0) push('GAP', ARENA.MULTI_HIT_GAP_MS);
    push('STRIKE', strikeMs);
    push('IMPACT_HOLD', ARENA.IMPACT_HOLD_MS);
    push('RECOIL', ARENA.RECOIL_MS);
  }
  push('RETURN', ARENA.RECOVER_MS);
  return Object.freeze({
    phases: Object.freeze(phases),
    totalMs: t,
    // Treatment-module beats, identical numbers (spec §5.1 hook contract).
    treatmentBeats: Object.freeze({
      windupMs: ARENA.WINDUP_LIGHT_MS, impactHoldMs: ARENA.IMPACT_HOLD_MS,
      recoilMs: ARENA.RECOIL_MS, recoverMs: ARENA.RECOVER_MS,
    }),
    hits, modifiers: modifiers || null,
    // Faint path: RETURN is replaced by FAINT collapse + fade (spec §2.1).
    faintPath: Object.freeze({ faintMs: ARENA.FAINT_MS, fadeMs: ARENA.FAINT_FADE_MS, skipsReturn: true }),
  });
}

export {
  ARENA, BODY_TYPES, MOVE_KINDS, CAMERA_SHOTS,
  createArenaBattle, computeModifiers, noModifiers, buildChosenAttackTimeline,
  severityFor, rangeBand, flankArc, toArenaMove,
};
