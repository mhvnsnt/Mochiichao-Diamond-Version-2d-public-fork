// treatments.js — Pokemon-layer GENERIC treatments (Layer 1).
//
// Everything here is generic: no per-creature art, no per-creature
// pose, no new frames. These are the treatments Pokemon itself uses,
// modelled on the files cited in ../POKEMON-FILES-RESEARCH.md:
//
// - Hurt: General_MonHit (FR data/battle_anim_scripts.s:10758) —
//   hit splat + AnimTask_ShakeMon (3 px, 6 shakes, 1-frame delay,
//   ~12 frames) + waitforvisualfinish. See moveScripts.js
//   sub_GeneralMonHit for the script form; the functions here are
//   the same treatment as callable data for the game.
// - Damage-scaled shake: FR src/battle_anim_mon_movement.c:872-901,
//   AnimTask_ShakeTargetBasedOnMovePowerOrDmg:
//     amplitude = power/12 or damage/12, clamped 1-16 px.
//   Used by only 15/354 FireRed moves; Mochiichao uses it WIDER
//   (every damaging hit), which is a stated extension of use,
//   not a new Pokemon rule.
// - Flinch: NO pose, NO particle. Flinch is STATUS2_FLINCHED +
//   skipped turn (FR src/battle_util.c:1361-1365, src/
//   battle_script_commands.c:599,619,2419). A flinched battler
//   simply does not act. `flinchTreatment` therefore returns a
//   flag + skip, and nothing visual.
// - Faint: shared slide, 0 new frames. FR SpriteCB_FaintSlideAnim
//   (src/battle_main.c:2073-2080): y2 += 5 per frame, sprite sinks
//   off-screen, then is freed. BW2: one shared ScFaint sequence
//   for all battlers. `faintTreatment` is that slide; the
//   body-type collapse sets under animation/faint/ are a
//   Mochiichao improvement layered on top, not this treatment.
// - Status: FR gBattleAnims_StatusConditions, 9 entries — Poison,
//   Confusion, Burn, Infatuation, Sleep, Paralysis, Freeze, Curse,
//   Nightmare. Each is a looping particle/status overlay, not a pose.
// - Stats change: FR General_StatsChange -> AnimTask_StatsChange
//   (scripts line 10540): arrows + flash + sound.
// - Terrain shake (second power rule): FR battle_anim_ground.c:555+,
//   offset defaults to power/10 + 3 when arg is 0.
//
// This file does NOT duplicate animation/treatments/battleTreatments.js
// (which is the Mochiichao-staged presentation: windup / 90 ms
// hitstop / recoil / recover, severity tiers, camera push). That file
// is untouched. The relationship:
//   battleTreatments.js = Mochiichao presentation (Layer 2 staging)
//   treatments.js (this file) = Pokemon-faithful generic floor (Layer 1)
// The game may run either; Layer 1 never overrides a per-creature
// pose (see LAYER-ORDER.md). The 90 ms hitstop is NOT in this file:
// it is a Mochiichao addition, labelled as such, in battleTreatments.js.

'use strict';

const FPS = 60;
const FRAME_MS = 1000 / FPS;

// FireRed status table: exactly these 9, no more, no fewer.
const STATUS_CONDITIONS = Object.freeze([
  'Poison', 'Confusion', 'Burn', 'Infatuation', 'Sleep',
  'Paralysis', 'Freeze', 'Curse', 'Nightmare',
]);

// Looping overlay particle per status (FR status scripts +
// battle_anim_status_effects.c patterns, described not copied).
// `loop` means the overlay repeats until the condition clears;
// `tick` means it also fires on a poison/burn damage tick.
const STATUS_TREATMENTS = Object.freeze({
  Poison: Object.freeze({ particle: 'gPoisonPowderSpriteTemplate', loop: true, tick: true, color: 'purple', sound: 'SE_M_POISON' }),
  Confusion: Object.freeze({ particle: 'gConfusionOrbSpriteTemplate', loop: true, tick: false, color: 'pink', sound: 'SE_M_CONFUSE' }),
  Burn: Object.freeze({ particle: 'gBurnFlameSpriteTemplate', loop: true, tick: true, color: 'orange', sound: 'SE_M_BURN' }),
  Infatuation: Object.freeze({ particle: 'gInfatuationHeartSpriteTemplate', loop: true, tick: false, color: 'pink', sound: 'SE_M_ATTRACT' }),
  Sleep: Object.freeze({ particle: 'gSleepZSpriteTemplate', loop: true, tick: false, color: 'blue', sound: 'SE_M_SLEEP' }),
  Paralysis: Object.freeze({ particle: 'gParalysisSparkSpriteTemplate', loop: true, tick: false, color: 'yellow', sound: 'SE_M_PARALYZE' }),
  Freeze: Object.freeze({ particle: 'gFreezeIceCubeSpriteTemplate', loop: true, tick: false, color: 'cyan', sound: 'SE_M_FREEZE', steps: 4 }),
  Curse: Object.freeze({ particle: 'gCurseOrbSpriteTemplate', loop: true, tick: false, color: 'dark', sound: 'SE_M_CURSE' }),
  Nightmare: Object.freeze({ particle: 'gNightmareOrbSpriteTemplate', loop: true, tick: true, color: 'dark', sound: 'SE_M_NIGHTMARE' }),
});

// Damage-scaled shake, Pokemon rule: power/12 or damage/12, clamp 1-16.
function shakeAmplitudeFromPowerOrDamage(opts) {
  const o = opts || {};
  let amp;
  if (o.basis === 'damage' && typeof o.damage === 'number') amp = o.damage / 12;
  else if (typeof o.power === 'number') amp = o.power / 12;
  else amp = 3; // Pound default: fixed 3 px shake.
  if (!isFinite(amp)) amp = 3;
  if (amp < 1) amp = 1;
  if (amp > 16) amp = 16;
  return amp;
}

// Generic hurt treatment (General_MonHit pattern).
// Returns the timed beat list; the game applies it to the static
// sprite (translate/shake/flash only — the sprite never re-poses).
// damage/power are optional: without them the fixed 3 px shake is used.
function hurtTreatment(opts) {
  const o = opts || {};
  const amp = shakeAmplitudeFromPowerOrDamage(o);
  return Object.freeze({
    kind: 'hurt_generic',
    source: 'General_MonHit (FR)',
    splat: 'gBasicHitSplatSpriteTemplate',
    shake: Object.freeze({ task: 'ShakeMon', xPx: amp, yPx: 0, shakes: 6, frameDelay: 1, frames: 12 }),
    flash: 'white',
    sound: 'SE_M_DOUBLE_SLAP',
    totalFrames: 12,
    totalMs: Math.round(12 * FRAME_MS),
    note: 'No pose change. Battler sprite is shaken/flashed only.',
  });
}

// Flinch: flag + skipped turn. Deliberately no visual payload.
function flinchTreatment() {
  return Object.freeze({
    kind: 'flinch',
    source: 'STATUS2_FLINCHED + canceller (FR battle_util.c:1361-1365)',
    flag: 'STATUS2_FLINCHED',
    skipsTurn: true,
    pose: null,
    particle: null,
    note: 'Pokemon has no flinch animation. A flinched battler simply does not act that turn.',
  });
}

// Faint: shared slide. y += 5/frame (FR player-side slide).
// `framesToExit` is computed from the sprite height the game passes;
// default 24 frames sinks a ~120 px sprite fully off-screen.
function faintTreatment(opts) {
  const o = opts || {};
  const yPerFrame = 5;
  const frames = typeof o.framesToExit === 'number' ? Math.max(1, Math.floor(o.framesToExit)) : 24;
  const beats = [];
  for (let f = 1; f <= frames; f++) {
    beats.push(Object.freeze({ frame: f, yOffsetPx: yPerFrame * f }));
  }
  return Object.freeze({
    kind: 'faint_generic',
    source: 'SpriteCB_FaintSlideAnim (FR battle_main.c:2073-2080)',
    sound: 'SE_FAINT',
    yPerFrame,
    frames,
    totalMs: Math.round(frames * FRAME_MS),
    beats: Object.freeze(beats),
    note: 'Shared slide for all battlers, 0 new frames. Sprite is freed after the slide.',
  });
}

// Status treatment lookup. Unknown names return null (never a guess:
// the caller falls back to the generic status puff in moveScripts.js).
function statusTreatment(name) {
  if (!name || !(name in STATUS_TREATMENTS)) return null;
  return STATUS_TREATMENTS[name];
}

// Stat-change treatment: direction 'up' | 'down' (+ optional stages).
// Same treatment for every stat move (FR General_StatsChange).
function statChangeTreatment(direction, stages) {
  const dir = direction === 'down' ? 'down' : 'up';
  return Object.freeze({
    kind: 'stats_change',
    source: 'General_StatsChange -> AnimTask_StatsChange (FR)',
    direction: dir,
    stages: typeof stages === 'number' ? stages : 1,
    arrows: dir === 'up' ? 'up' : 'down',
    flash: 'white',
    sound: 'SE_M_STAT_CHANGE',
    totalFrames: 16,
    totalMs: Math.round(16 * FRAME_MS),
  });
}

// Terrain shake (second power rule, FR ground shake): offset
// defaults to power/10 + 3 when no explicit offset is given.
function terrainShakeTreatment(opts) {
  const o = opts || {};
  let offset;
  if (typeof o.offsetPx === 'number') offset = o.offsetPx;
  else if (typeof o.power === 'number') offset = o.power / 10 + 3;
  else offset = 3;
  return Object.freeze({
    kind: 'terrain_shake',
    source: 'AnimTask_HorizontalShake / ShakeBattleTerrain (FR)',
    xPx: offset,
    yPx: 0,
    shakes: 6,
    frames: 12,
    totalMs: Math.round(12 * FRAME_MS),
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FPS, STATUS_CONDITIONS, STATUS_TREATMENTS,
    shakeAmplitudeFromPowerOrDamage, hurtTreatment, flinchTreatment,
    faintTreatment, statusTreatment, statChangeTreatment,
    terrainShakeTreatment,
  };
}
