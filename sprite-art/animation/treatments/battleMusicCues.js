// battleMusicCues.js — battle-phase music cue map (STEP 4, 2026-10-25).
// Hooks INTO audio-system.ts (MochiAudio), does not replace it. No music
// file is downloaded, registered, or claimed here: every cue's file slot
// is null until main downloads a CC0-first loop (audio-track-map.md),
// re-checks its licence on its own page, and calls registerFile().
// Credit-required packs (Quillbit, Vacuous) are usable ONLY with their
// exact credit string on the credits screen; until then the synth
// fallback named per cue plays, so the game never goes silent.
// Design rule carried from audio-system.ts: one loop at a time. Turn
// cues (player_turn / enemy_turn) therefore do NOT swap the loop every
// turn — that would churn the music — they are one-shot sting points
// over the continuing battle loop. Only intro, low-HP, and victory
// change what loop/jingle is sounding.
'use strict';

const BATTLE_MUSIC_CUES = Object.freeze({
  intro: Object.freeze({
    trigger: 'Battle starts (wild / trainer / dojo / elite / champion / arena).',
    audioCall: 'audio.startBattle(kind)',
    loopChange: true, crossfadeMs: 400,
    synthFallback: 'battle (wild/trainer/dojo/arena) or boss (elite/champion)',
    fileSlot: null, pack: 'hyperpixel 33 CC0 loops (CC0) first; Vacuous battle loop only with credit',
    creditRequired: false,
    note: 'Existing audio-system.ts behaviour; this cue names it, it does not add a second intro track.',
  }),
  player_turn: Object.freeze({
    trigger: 'Player confirms a move (arena chooseMove / turn-based menu confirm).',
    audioCall: 'audio.playSfx(\'confirm\') + battle loop continues unchanged',
    loopChange: false, crossfadeMs: 0,
    synthFallback: 'confirm blip (existing SFX_DEFS), no loop swap',
    fileSlot: null, pack: 'synth only',
    creditRequired: false,
    note: 'Wiring hook only: no new SFX def is invented here; if wiring wants a distinct turn sting, it adds one SFX_DEFS entry, it does not swap music.',
  }),
  enemy_turn: Object.freeze({
    trigger: 'Enemy move begins (foe chosen-attack TELEGRAPH phase).',
    audioCall: 'battle loop continues unchanged; optional foe-cry via cryEnvelope(foeSet) at TELEGRAPH start',
    loopChange: false, crossfadeMs: 0,
    synthFallback: 'battle/boss loop continues; foe cry is a synth cry spec, not a sample',
    fileSlot: null, pack: 'synth only',
    creditRequired: false,
    note: 'The enemy cue is the foe cry + the existing impact staging, not a music change.',
  }),
  low_hp: Object.freeze({
    trigger: 'Either active creature falls to <= 25% max HP (first crossing only, per battle).',
    audioCall: 'WIRING OWED: audio.setLowHp(true) — swaps the synth loop to the boss pattern (or a registered low-HP file loop); audio.setLowHp(false) restores the battle loop if both creatures heal above 25%. audio-system.ts does NOT yet have setLowHp; do not claim it exists.',
    loopChange: true, crossfadeMs: 800,
    synthFallback: 'boss',
    fileSlot: null, pack: 'hyperpixel 33 CC0 loops (CC0) first; no credit-required track without its credit on screen',
    creditRequired: false,
    note: 'Threshold 25% matches the familiar low-HP warning band; it is a cue threshold, not a stat. One crossing per battle avoids loop thrash on every hit.',
  }),
  victory: Object.freeze({
    trigger: 'Foe faints, battle won (before endBattle restores the scene loop).',
    audioCall: 'audio.playVictoryJingle() then audio.endBattle()',
    loopChange: true, crossfadeMs: 800,
    synthFallback: 'victory (existing SYNTH_PATTERNS.victory)',
    fileSlot: null, pack: 'Quillbit victory jingle ONLY if its credit is on screen; otherwise synth victory',
    creditRequired: false,
    note: 'Existing audio-system.ts behaviour, ordered explicitly: jingle first, then restore — not the reverse.',
  }),
  defeat: Object.freeze({
    trigger: 'Player party faints / battle lost (extra cue, not one of the 5 ordered; included so wiring does not invent one).',
    audioCall: 'audio.endBattle() (no victory jingle)',
    loopChange: true, crossfadeMs: 800,
    synthFallback: 'scene loop restored (no jingle)',
    fileSlot: null, pack: 'synth only',
    creditRequired: false,
    note: 'Included for completeness; the 5 ordered cues are intro, player_turn, enemy_turn, low_hp, victory.',
  }),
});
const ORDERED_CUES = Object.freeze(['intro', 'player_turn', 'enemy_turn', 'low_hp', 'victory']);
const LOW_HP_THRESHOLD = 0.25;

function cueFor(name) {
  const c = BATTLE_MUSIC_CUES[name];
  if (!c) throw new Error('battleMusicCues: unknown cue ' + JSON.stringify(name));
  return c;
}
// Pure helper for wiring: true only on the first crossing into <=25%.
function crossedLowHp(prevFraction, nextFraction) {
  return prevFraction > LOW_HP_THRESHOLD && nextFraction <= LOW_HP_THRESHOLD;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BATTLE_MUSIC_CUES, ORDERED_CUES, LOW_HP_THRESHOLD, cueFor, crossedLowHp };
}
