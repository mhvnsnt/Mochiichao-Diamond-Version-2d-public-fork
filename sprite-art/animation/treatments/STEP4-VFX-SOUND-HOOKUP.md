# STEP 4 — VFX + SOUND HOOKUP (2026-10-25)

Hooks INTO the treatments module and the audio-system design. Nothing here
duplicates them, replaces them, or re-delivers title music (PR #36, on main
as `public/audio/` WAVs; wiring of those files is a separate lane's owed work
and is NOT re-delivered here).

## 1. Impact VFX — one flavour family per True Element: 12/12 = 100%

File: `elementImpactVfx.js` (+ `elementImpactVfx.test.js`, 8/8 checks pass).

The game still calls `buildHitTimeline` / `buildParticleBurst` in
`battleTreatments.js` for timing, count, angle, speed base and size base,
then passes those particles through `flavourParticles()` to colour/shape
them per move element. No timing constant is re-declared here.

| Element | Shape | Ring | Impact SFX key |
|---|---|---|---|
| Water | drop | ripple | impact_water |
| Chrome | shard | glint | impact_chrome |
| Earth | chunk | dust | impact_earth |
| Bug | mote | none | impact_bug |
| Umbral | wisp | smoke | impact_umbral |
| Aero | streak | none | impact_aero |
| Core | ember | shockwave | impact_core |
| Strike | star | shockwave | impact_strike |
| Deep | bubble | ripple | impact_deep |
| Flame | flame | none | impact_flame |
| Mythic | sparkle | glint | impact_mythic |
| Normal | puff | none | impact_normal |

All 12 shapes are distinct. Particles live 450 ms per treatments TIMING.
Legacy move-type map: `moves.ts` uses Pokemon-style type strings; the map in
this file covers all 15 of them. PROVISIONAL (wiring-time only, until the
12 True Elements unification lands): GRASS -> Earth, ELECTRIC -> Strike,
DRAGON -> Mythic, POISON -> Umbral. No move is left unmapped, and an unknown
element/type throws instead of silently falling back to Normal.

Original VFX only. No commercial VFX, sprite, or audio is used.

## 2. Creature cries — ORIGINAL synth specs only: 51/51 = 100%

File: `creatureCries.js` (+ `creatureCries.test.js`, combined with the music
cue checks: 7/7 checks pass).

These are PARAMETERS for the Web Audio synth in audio-system.ts, not audio
files and not any game's cries: waveform + a 3-point pitch contour (start /
peak / end ratios of baseHz) + duration + vibrato + noise mix. The wiring
lane renders them with one oscillator + gain envelope; the game never loads
a cry sample. Shiny/rare variants: same spec, baseHz x1.15.

Timbre follows the idle body class, so a heavy creature is low/slow and a
small bouncy one is high/short, whatever its element. Counts: 51 sets =
49 playable creatures + strikechamp_unsuited + strikechamp_unsuited_full
variants sharing creatureId 030 (the suited default is `strikechamp`).
Dorowani (147) and Gabu (148) have no roster entry yet; their roster element
is recorded as '—', not invented.

Pokemon SOUNDS are excluded, always: never Pokemon cries, never commercial
audio. No cry sample file is shipped here.

## 3. Battle music timing — 5 ordered cues + 1 completeness cue

File: `battleMusicCues.js` (checks inside `creatureCries.test.js`: 7/7 pass).

| Cue | Loop change? | Behaviour |
|---|---|---|
| intro | yes, 400 ms crossfade | `audio.startBattle(kind)`; existing audio-system.ts behaviour, named here |
| player_turn | no | confirm blip over the continuing battle loop; no loop swap every turn |
| enemy_turn | no | battle loop continues; foe cry via `cryEnvelope(foeSet)` at TELEGRAPH start |
| low_hp | yes, 800 ms crossfade | first crossing only, per battle, at <= 25% max HP |
| victory | yes, 800 ms crossfade | `audio.playVictoryJingle()` THEN `audio.endBattle()` (that order) |
| defeat (extra, not ordered) | yes | `audio.endBattle()`, no victory jingle |

No music file is downloaded, registered, or claimed here: every cue's file
slot is null until main downloads a CC0-first loop, re-checks its licence
on its own page, and calls `registerFile()`. Credit-required packs
(Quillbit, Vacuous) are usable ONLY with their exact credit string on the
credits screen; until then the named synth fallback plays, so the game
never goes silent. NO music downloaded on a snippet, NO commercial tracks.

OWED, stated plainly, not claimed: `audio-system.ts` does NOT yet have
`setLowHp()` — the low_hp cue's audioCall names the wiring owed, it does
not pretend the function exists.

## Verification (local, re-run 2026-10-25)

- `node --test elementImpactVfx.test.js creatureCries.test.js` — pass
  (8/8 VFX checks; 7/7 cries + music checks).
- `node --check` on all three modules — pass.
- Step 5 playtest resolves VFX family + attacker cry + music cues through
  these modules for every hit (see `sprite-art/playtest/`), not by assertion.
