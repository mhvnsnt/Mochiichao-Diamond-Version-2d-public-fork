// webAudioManager.js — Web Audio manager (closes wiring target (12)).
// This is the MANAGER module, not in-game wiring: BattleView / the game
// shell adopts it by calling createManager() and its play* methods; this
// file itself touches no DOM, no game component, and no save.
// What it routes, from the modules it hooks into (nothing duplicated):
// - Settings SOUND flag (src/lib/gameSettings.ts: SOUND = MONO | STEREO,
//   persisted by PR #28's Settings screen): MONO -> pan 0 for both sides;
//   STEREO -> player side pan -0.4, foe side pan +0.4. The Settings screen
//   itself notes (SettingsScreen.tsx) that its SOUND row was "stored flag
//   only — no audio engine in this build yet"; this manager IS that engine
//   end of the flag. The game shell still has to pass its stored setting
//   in — that one call is wiring, owed, stated here, not claimed done.
// - Creature cries: render plans from creatureCries.js cryEnvelope()
//   (original synth specs only — never a sample, never a Pokemon cry).
// - Impact SFX: synth keys from elementImpactVfx.js families + severity
//   particle counts from battleTreatments.js SEVERITY (not re-declared).
// - Music loops: registry starts EMPTY (matching battleMusicCues.js file
//   slots = null). registerLoop() enforces the licence gate: CC0 needs no
//   credit; anything credit-required needs a non-empty credit string or
//   registration throws — an uncredited credit-required track can never
//   be registered, let alone played. Playing an unregistered loop falls
//   back to the named synth pattern (game never goes silent).
// In Node (tests) the manager returns render PLANS (plain objects), not
// live AudioContext output; in a browser the same plan shapes feed a
// single OscillatorNode + GainNode per sound (cry) or a noise/filter
// burst (impact) — the plan fields are exactly what that renderer needs.
'use strict';
const cries = require('./creatureCries.js');
const vfx = require('./elementImpactVfx.js');
const treatments = require('./battleTreatments.js');

const PAN = Object.freeze({ MONO: 0, player: -0.4, foe: 0.4 });
const SYNTH_FALLBACK_LOOP = Object.freeze({ battle: 'battle', boss: 'boss', victory: 'victory' });

function panFor(sound, side) {
  if (sound === 'MONO') return PAN.MONO;
  if (sound !== 'STEREO') throw new Error('webAudioManager: unknown SOUND setting ' + JSON.stringify(sound));
  if (side !== 'player' && side !== 'foe') throw new Error('webAudioManager: unknown side ' + JSON.stringify(side));
  return PAN[side];
}
function createManager(options) {
  const opts = options || {};
  const sound = opts.sound || 'STEREO';
  if (sound !== 'MONO' && sound !== 'STEREO') throw new Error('webAudioManager: unknown SOUND setting ' + JSON.stringify(sound));
  const loops = new Map();
  return Object.freeze({
    sound,
    panForSide(side) { return panFor(sound, side); },
    // Cry render plan: oscillator waveform + freq points + envelope.
    cryPlan(set, cryOptions) {
      const env = cries.cryEnvelope(set, cryOptions);
      const spec = cries.cryFor(set);
      return Object.freeze({
        type: 'cry', set, waveform: spec.waveform,
        freqPoints: env, durationMs: spec.durationMs,
        vibratoHz: spec.vibratoHz, vibratoDepth: spec.vibratoDepth, noiseMix: spec.noiseMix,
      });
    },
    // Impact render plan: family shape/colours + severity particle count.
    impactPlan(element, severityLabel) {
      const fam = vfx.familyFor(element);
      const sev = treatments.SEVERITY[(severityLabel || 'medium').toUpperCase()];
      if (!sev) throw new Error('webAudioManager: unknown severity ' + JSON.stringify(severityLabel));
      return Object.freeze({
        type: 'impact', element, shape: fam.shape, colors: fam.colors, ring: fam.ring,
        sfx: fam.impactSfx, particles: sev.particles, shakePx: sev.shakePx, cameraPush: sev.cameraPush,
      });
    },
    // Frame-0 plan: telegraph SFX key + family flash tint (frame0VfxSfx.js
    // owns the table; this is the playback shape for its sfx field).
    frame0Plan(frame0) {
      if (!frame0 || typeof frame0.sfx !== 'string') throw new Error('webAudioManager: frame0 plan needs a frame0VfxSfx entry');
      return Object.freeze({ type: 'frame0', atMs: 0, sfx: frame0.sfx, flashTint: frame0.flashTint, shape: frame0.shape });
    },
    registerLoop(name, meta) {
      const m = meta || {};
      if (typeof name !== 'string' || !name) throw new Error('webAudioManager: loop name required');
      if (m.licence === 'credit-required' && (!m.credit || typeof m.credit !== 'string')) {
        throw new Error('webAudioManager: credit-required loop "' + name + '" needs its exact credit string');
      }
      if (m.licence !== 'CC0' && m.licence !== 'credit-required' && m.licence !== 'original') {
        throw new Error('webAudioManager: loop "' + name + '" needs a licence (CC0 | credit-required | original)');
      }
      loops.set(name, Object.freeze({ name, licence: m.licence, credit: m.credit || null, fileSlot: m.fileSlot || null }));
      return loops.get(name);
    },
    loopPlan(name, fallback) {
      const reg = loops.get(name);
      if (reg && reg.fileSlot) return Object.freeze({ type: 'loop', name, fileSlot: reg.fileSlot, licence: reg.licence, credit: reg.credit });
      return Object.freeze({ type: 'loop', name, synthFallback: SYNTH_FALLBACK_LOOP[fallback] || fallback || 'battle', licence: reg ? reg.licence : null });
    },
    registeredLoops() { return Object.freeze(Array.from(loops.keys())); },
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createManager, panFor };
}
