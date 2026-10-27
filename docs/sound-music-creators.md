# Sound Creator + Music Creator — DigiCore Audio (Settings)

Dedicated full screens under Settings, in the Pokemon options-menu shape
(FireRed option_menu.c structure only: header, list, help bar, label
left / value right). Never popups.

## What is in this PR

- **Sound Creator** (`src/components/game/SoundCreatorScreen.tsx`):
  sound slots (boot, press-start, menu select/back/confirm, start button,
  battle start, PC open, bag open), chirp creator (wave, freq sweep,
  duration, volume, preview, WAV export), jingle creator (note:beats,
  BPM, preview, save), mic Chatter, Ball Seals.
- **Music Creator** (`src/components/game/MusicCreatorScreen.tsx`):
  soundtrack / background-music step sequencer. Default project mirrors
  the game's own title music: G major, 112 BPM, 16 bars, stems.
  Instruments are Web Audio synth voices (8-bit square, piano, guitar,
  drums, organ, bass) plus vocal as the user's own mic take.
- **Logic** (`src/lib/creator/soundCreator.ts`): pure, zero-dependency,
  tested. localStorage key `mochiichao_sound_creator_v1`.
- **Settings wiring**: two rows + two screen branches in SettingsScreen,
  in the exact MUSIC_MIXER pattern (import, Screen union, row, key
  early-return, render branch). No other SettingsScreen behaviour changed.

## Boot / press-start — the M2 vs B correction, stated plainly

Live `src/lib/bootAudio.ts` (on main, 2026-10-25) settles: BOOT = UI Art
Option B rising arpeggio, PRESS-START = M3 Mochii Chirp, M3 is NOT boot.
A later message in the World Builder lane (2026-10-27) said "M2 is what
I'm picking", but that same message chain said "I think it was M2...
I gotta go listen" — it was uncertain, and it conflicts with the settled
live role and with Mars's own "rising arpeggio" recollection in that
same chain. This PR therefore defaults boot to B and press-start/select
to M3, with M2 (and M1, A, C, plus any custom chirp/jingle) one tap away
in every slot. If Mars taps M2 as boot in the creator, that tap IS the
pick and the default in code must be updated to match — the creator is
the tool that settles it, not another re-ask.

## Pokemon sources (structure only, nothing commercial copied)

- Options menu: FireRed `option_menu.c` layout.
- Chatter: Chatot, Diamond/Pearl/Platinum (Gen 4, not Black 2).
  Structure: microphone -> recorded cry -> Chatter move / send-out cry.
  In this game the recording stays in the browser (localStorage, data
  URL); nothing is uploaded.
- Ball Seals: Diamond/Pearl/Platinum Ball Capsule. Seals attach to the
  capsule, not the creature, and render on release. Seal names/glyphs
  here are Mochiichao-original; no Pokemon seal art is shipped.
- Music sequencing: Black 2 / Gen 5 sequenced-music shape (tracks,
  channels, tempo, steps) + the game's own title-music shape.
- Lost features, honestly scoped: Chatter + Ball Seals are DONE in this
  PR (data, UI, preview, send-out effects). Following Pokemon, Secret
  Bases, Contests, Pokeathlon, Dream World and similar are NOT claimed
  here — they are a roadmap, not a shipped list, and each needs its own
  gate-checked PR.

## Industry / open-source routes used or documented

- Web Audio API + OfflineAudioContext (chirp render + WAV export, no
  new dependencies). Tone.js is already in the repo (tone-jingles) and
  is the route for richer synth voices later.
- Vocal: AVANNA is a commercial Vocaloid3 bank (~$59.99, Zero-G) and
  is NOT shipped, bought, or cracked. The vocal track uses the user's
  own mic + the open-source AVANNA-style transform parameters already
  documented in this repo (pitch +7 semitones, formant shift, breathiness
  cut). Free/open vocal-bank routes (OpenUTAU, DiffSinger, free UTAU
  banks) are documented here as the legal path to a real vocaloid-style
  voice, not installed as a DAW in this PR.
- DigiCore: the game's main center. In Settings it is the hub that holds
  the Sound Creator and Music Creator, and all sound slots route through
  it. If DigiCore is a place/character in canon instead of a hub name,
  the hub label must be corrected — the creators themselves do not
  depend on that name.

## What is still a follow-up (not hidden, not claimed done)

- One-shot file playback inside the audio manager itself (the creator
  plays files via the browser Audio element for now; the manager plays
  scenes/synth SFX).
- Importing a saved soundtrack JSON back into the Music Creator
  (export works; import UI is the next small pass).
- Wiring a creator-made sound into BattleView send-out rendering
  (seal effects are computed and previewed in the creator; BattleView
  does not yet call sealEffectsForSendOut — that call-site is a
  battle-lane change, not a blind edit here).
