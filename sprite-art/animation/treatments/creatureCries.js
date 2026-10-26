// creatureCries.js — ORIGINAL synth cry specs, one per set (STEP 4, 2026-10-25).
// These are PARAMETERS for the Web Audio synth in audio-system.ts, not audio
// files and not any game's cries: waveform + a 3-point pitch contour
// (start / peak / end ratios of baseHz) + duration + vibrato + noise mix.
// The wiring lane renders them with one oscillator + gain envelope; the
// game never loads a cry sample. Shiny/rare variants: same spec, baseHz x1.15.
// Roster element column is the global_roster.json primary element as recorded
// (Aqua/Beast/Flora/Silk-era names pre-date the 12 True Elements unification;
// Dorowani/Gabu have no roster entry yet, shown as '—'). Cry timbre follows
// the idle body class (IDLE-COVERAGE-REPORT.json), so a heavy creature is
// low/slow and a small bouncy one is high/short, whatever its element.
'use strict';

const CREATURE_CRIES = Object.freeze({
  aerobeak: Object.freeze({ set: 'aerobeak', creatureId: '020', rosterElement: 'Aero', idleClass: 'hover_swim', waveform: 'sine', baseHz: 430, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 560, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  aquariios: Object.freeze({ set: 'aquariios', creatureId: '003', rosterElement: 'Aqua', idleClass: 'hover_swim', waveform: 'sine', baseHz: 467, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 600, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  ashemit: Object.freeze({ set: 'ashemit', creatureId: '044', rosterElement: 'Flame', idleClass: 'seated', waveform: 'triangle', baseHz: 314, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 620, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'measured calm call' }),
  astroleviathan: Object.freeze({ set: 'astroleviathan', creatureId: '025', rosterElement: 'Aqua', idleClass: 'hover_swim', waveform: 'sine', baseHz: 441, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 560, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  chromejaww: Object.freeze({ set: 'chromejaww', creatureId: '005', rosterElement: 'Chrome', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 398, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 560, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  cocoonode: Object.freeze({ set: 'cocoonode', creatureId: '017', rosterElement: 'Bug', idleClass: 'static_crystal', waveform: 'triangle', baseHz: 545, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 740, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'clear ringing tone' }),
  cragarm: Object.freeze({ set: 'cragarm', creatureId: '036', rosterElement: 'Core', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 192, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 780, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'low slow roar/growl' }),
  dorowani: Object.freeze({ set: 'dorowani', creatureId: '147', rosterElement: '—', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 419, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 560, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  dreadtoise: Object.freeze({ set: 'dreadtoise', creatureId: '040', rosterElement: 'Flora', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 216, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 860, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'low slow roar/growl' }),
  duneclaw: Object.freeze({ set: 'duneclaw', creatureId: '008', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 403, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 520, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  duskfiend: Object.freeze({ set: 'duskfiend', creatureId: '043', rosterElement: 'Umbral', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 350, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 560, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.25, character: 'firm mid call' }),
  finblade: Object.freeze({ set: 'finblade', creatureId: '022', rosterElement: 'Aqua', idleClass: 'hover_swim', waveform: 'sine', baseHz: 437, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 640, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  floatcalf: Object.freeze({ set: 'floatcalf', creatureId: '024', rosterElement: 'Aqua', idleClass: 'float_hover', waveform: 'sine', baseHz: 554, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 600, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.1, character: 'soft airy wisp call' }),
  gabu: Object.freeze({ set: 'gabu', creatureId: '148', rosterElement: '—', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 371, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 560, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  gearkid: Object.freeze({ set: 'gearkid', creatureId: '032', rosterElement: 'Chrome', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 408, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 600, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  gorokappa: Object.freeze({ set: 'gorokappa', creatureId: '034', rosterElement: 'Chrome', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 175, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 780, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'low slow roar/growl' }),
  inklet: Object.freeze({ set: 'inklet', creatureId: '026', rosterElement: 'Aqua', idleClass: 'small_bouncy', waveform: 'square', baseHz: 672, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 420, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  kickmaster: Object.freeze({ set: 'kickmaster', creatureId: '031', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 429, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 600, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  kittember: Object.freeze({ set: 'kittember', creatureId: '010', rosterElement: 'Beast', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 376, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 520, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  krakenox: Object.freeze({ set: 'krakenox', creatureId: '028', rosterElement: 'Aqua', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 173, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 820, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.25, character: 'low slow roar/growl' }),
  manticlaw: Object.freeze({ set: 'manticlaw', creatureId: '012', rosterElement: 'Beast', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 360, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 600, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  mechapion: Object.freeze({ set: 'mechapion', creatureId: '033', rosterElement: 'Chrome', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 397, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 520, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  megalochrome: Object.freeze({ set: 'megalochrome', creatureId: '023', rosterElement: 'Aqua', idleClass: 'hover_swim', waveform: 'sine', baseHz: 444, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 600, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  mochii: Object.freeze({ set: 'mochii', creatureId: '001', rosterElement: 'Aqua', idleClass: 'small_bouncy', waveform: 'square', baseHz: 571, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 460, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  mothrix: Object.freeze({ set: 'mothrix', creatureId: '018', rosterElement: 'Bug', idleClass: 'hover_swim', waveform: 'sine', baseHz: 518, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 560, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  mythar: Object.freeze({ set: 'mythar', creatureId: '331', rosterElement: 'Mythic', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 365, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 560, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  oblivirex: Object.freeze({ set: 'oblivirex', creatureId: '009', rosterElement: 'Core', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 182, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 860, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.25, character: 'low slow roar/growl' }),
  pebblefist: Object.freeze({ set: 'pebblefist', creatureId: '035', rosterElement: 'Core', idleClass: 'heavy_slow', waveform: 'sawtooth', baseHz: 219, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 780, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'low slow roar/growl' }),
  pixilite: Object.freeze({ set: 'pixilite', creatureId: '041', rosterElement: 'Flora', idleClass: 'small_bouncy', waveform: 'square', baseHz: 636, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 420, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  punchkid: Object.freeze({ set: 'punchkid', creatureId: '029', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 423, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 600, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  pupbble: Object.freeze({ set: 'pupbble', creatureId: '013', rosterElement: 'Beast', idleClass: 'small_bouncy', waveform: 'square', baseHz: 590, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 380, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  pyromonk: Object.freeze({ set: 'pyromonk', creatureId: '045', rosterElement: 'Flame', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 407, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 560, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  pyropaw: Object.freeze({ set: 'pyropaw', creatureId: '011', rosterElement: 'Beast', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 354, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 600, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  quakehound: Object.freeze({ set: 'quakehound', creatureId: '015', rosterElement: 'Beast', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 391, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 520, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  razorgater: Object.freeze({ set: 'razorgater', creatureId: '004', rosterElement: 'Chrome', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 428, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 560, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  reaperdile: Object.freeze({ set: 'reaperdile', creatureId: '006', rosterElement: 'Chrome', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 375, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 600, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  shellguard: Object.freeze({ set: 'shellguard', creatureId: '039', rosterElement: 'Flora', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 412, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 520, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  sproutle: Object.freeze({ set: 'sproutle', creatureId: '038', rosterElement: 'Flora', idleClass: 'small_bouncy', waveform: 'square', baseHz: 609, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 420, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  squirmite: Object.freeze({ set: 'squirmite', creatureId: '016', rosterElement: 'Bug', idleClass: 'small_bouncy', waveform: 'square', baseHz: 646, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 460, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  stormtalon: Object.freeze({ set: 'stormtalon', creatureId: '021', rosterElement: 'Aero', idleClass: 'hover_swim', waveform: 'sine', baseHz: 473, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 560, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
  strikechamp: Object.freeze({ set: 'strikechamp', creatureId: '030', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 380, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 560, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  strikechamp_unsuited: Object.freeze({ set: 'strikechamp_unsuited', creatureId: '030', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 417, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 600, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  strikechamp_unsuited_full: Object.freeze({ set: 'strikechamp_unsuited_full', creatureId: '030', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 364, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 520, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  terradog: Object.freeze({ set: 'terradog', creatureId: '014', rosterElement: 'Beast', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 401, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 560, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  terrapod: Object.freeze({ set: 'terrapod', creatureId: '037', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 348, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 600, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  tiidebiite: Object.freeze({ set: 'tiidebiite', creatureId: '002', rosterElement: 'Aqua', idleClass: 'small_bouncy', waveform: 'square', baseHz: 665, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 380, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'short bright chirp/bark' }),
  toxitacle: Object.freeze({ set: 'toxitacle', creatureId: '027', rosterElement: 'Aqua', idleClass: 'hover_swim', waveform: 'sine', baseHz: 432, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 600, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.25, character: 'smooth gliding call' }),
  tyrage: Object.freeze({ set: 'tyrage', creatureId: '007', rosterElement: 'Core', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 369, contour: Object.freeze([1.0, 0.9, 0.9]), durationMs: 600, vibratoHz: 12, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  wispkin: Object.freeze({ set: 'wispkin', creatureId: '042', rosterElement: 'Umbral', idleClass: 'float_hover', waveform: 'sine', baseHz: 536, contour: Object.freeze([1.0, 1.25, 0.9]), durationMs: 600, vibratoHz: 6, vibratoDepth: 0.06, noiseMix: 0.25, character: 'soft airy wisp call' }),
  yogiferno: Object.freeze({ set: 'yogiferno', creatureId: '046', rosterElement: 'Flame', idleClass: 'grounded_standard', waveform: 'sawtooth', baseHz: 353, contour: Object.freeze([1.0, 0.85, 1.1]), durationMs: 560, vibratoHz: 8, vibratoDepth: 0.06, noiseMix: 0.15, character: 'firm mid call' }),
  zephling: Object.freeze({ set: 'zephling', creatureId: '019', rosterElement: 'Aero', idleClass: 'hover_swim', waveform: 'sine', baseHz: 480, contour: Object.freeze([1.0, 1.4, 0.75]), durationMs: 640, vibratoHz: 10, vibratoDepth: 0.06, noiseMix: 0.1, character: 'smooth gliding call' }),
});

function cryFor(set) {
  const c = CREATURE_CRIES[set];
  if (!c) throw new Error('creatureCries: unknown set ' + JSON.stringify(set));
  return c;
}
// Render-ready pitch envelope: [timeMs, Hz] points for one oscillator.
// start 0 -> peak at 40% of duration -> end at 100%. No sample, no file.
function cryEnvelope(set, options) {
  const c = cryFor(set);
  const shiny = !!(options && options.shiny);
  const base = shiny ? Math.round(c.baseHz * 1.15) : c.baseHz;
  const d = c.durationMs;
  return Object.freeze([
    Object.freeze({ tMs: 0, hz: Math.round(base * c.contour[0]) }),
    Object.freeze({ tMs: Math.round(d * 0.4), hz: Math.round(base * c.contour[1]) }),
    Object.freeze({ tMs: d, hz: Math.round(base * c.contour[2]) }),
  ]);
}
function cryCount() { return Object.keys(CREATURE_CRIES).length; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CREATURE_CRIES, cryFor, cryEnvelope, cryCount };
}

