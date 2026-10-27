# Cry rebuild R1 — distinct synthesis per creature (2026-10-26)

Staged only. No repo edits, no merge, no PR, no shipped v1 file overwritten. 
Why: Mars flagged 2026-10-26 ~15:07 CDT that too many v1 cries sound like the same sound in a different key. 
Measured cause: v1 `synth-all-47-20261026.py` used ONE synth() voice (sin + 2nd/3rd harmonics), ONE envelope shape, 
ONE stereo treatment, varying only f0 start/end, duration, a shared texture-family branch, and vibrato 
(texture reuse: roar 8, rumble 6, bubble 5, chirp 4, thump 4, flutter 3, gust 3, snap 2, clang 2, whisper 2, trill 2).

R1 standard (Pokemon's method, system only, never audio): one distinct cry entry per species — distinct timbre, 
contour, rhythm, and envelope per species, never one base sound pitch-shifted across species. 
60% Mochiichao original synthesis + 40% Pokemon system (species-indexed, title-press 1.5s timing, reuse title/battle/lab).

## Per-creature design (49) — no two rows share the same template

Waveform = oscillator/harmonic recipe. Contour = pitch-contour shapes of its notes. Rhythm = note count + pauses (notes are separated by gaps). 
Texture = unique layer name AND unique parameters per creature. Stereo and envelope (attack/release) are also per creature.

| ID | Creature | Dur | Waveform | Contour shapes | Notes | Texture (unique) | Stereo | Atk/Rel | Canon kept |
|---|---|---|---|---|---|---|---|---|---|
| 001 | Mochii | 1.2s | sine_harm harm=[1, 0.35, 0.12] | arch | 2 | slime bloop pops | haas | 0.03/0.08 | blue water slime, bouncy bloop |
| 002 | Tiidebiite | 1.4s | fm fm 2.01x idx 2.2 | lin | 3 | water-fist splashes | pan | 0.04/0.06 | water warrior, swirling water fists |
| 003 | AquariiOS | 1.6s | formant harm=[3.0] | arch | 1 | glassy brain shimmer | chorus | 0.2/0.25 | fluid intelligence, aqua guardian |
| 004 | Razorgater | 1.5s | saw  | dip | 1 | jaw snap clicks + metal ring | hardpan | 0.02/0.05 | small metallic crocodile, chrome jaws |
| 005 | Chromejaww | 1.5s | square  | lin | 3 | steel teeth chatter | haas | 0.02/0.05 | bipedal chrome crocodile |
| 006 | Reaperdile | 1.8s | saw  | arch | 1 | armor plate clanks | subwide | 0.1/0.15 | huge tank crocodile, steel armor |
| 007 | Tyrage | 1.4s | tri  | lin | 2 | gravel crunch | center | 0.03/0.08 | tiny earth dinosaur |
| 008 | Duneclaw | 1.5s | fm fm 1.5x idx 3.0 | warble | 1 | bone-mask rattle | drift | 0.04/0.08 | desert dinosaur, bone mask |
| 009 | Oblivirex | 1.9s | saw  | arch | 1 | fossil grind | subwide | 0.15/0.2 | fossil dark T-rex |
| 010 | Kittember | 1.3s | sine_harm harm=[1, 0.5, 0.3, 0.15] | trill | 1 | fire-crackle pops | quickpan | 0.02/0.06 | fiery red kitten, flame paws |
| 011 | Pyropaw | 1.3s | pulse harm=[0.3] | lin | 3 | flame stripe hiss | haas | 0.02/0.05 | fiery tiger cub, flame stripes |
| 012 | Manticlaw | 1.7s | formant harm=[5.0] | arch | 1 | wing whoosh sweep | wide | 0.08/0.12 | huge fire manticore, blazing mane |
| 013 | Pupbble | 1.2s | tri  | lin | 4 | pebble ticks | center | 0.01/0.03 | small rock puppy |
| 014 | Terradog | 1.4s | square  | arch,lin | 2 | rock armor thuds | altpan | 0.03/0.06 | earth hound, rock armor |
| 015 | Quakehound | 1.8s | saw  | lin | 3 | earthquake rumble | subwide | 0.06/0.12 | massive earthquake mastiff |
| 016 | Squirmite | 1.2s | sine_harm harm=[1, 0.2, 0.05] | trill | 1 | silk thread shimmer | haas | 0.02/0.05 | small white silkworm (Silk=Bug) |
| 017 | Cocoonode | 1.3s | formant harm=[2.0] | vib | 1 | cocoon muffled pulses | narrow | 0.15/0.1 | green silk cocoon |
| 018 | Mothrix | 1.5s | fm fm 3.02x idx 1.5 | vib | 1 | neon wing flutter | chorus | 0.05/0.1 | matrix moth, glowing wings |
| 019 | Zephling | 1.2s | noise_tone  | lin | 3 | breeze puffs | lightpan | 0.02/0.04 | tiny wind bird (Wind=Flying) |
| 020 | Aerobeak | 1.3s | saw  | dip | 1 | wind slash down | sweeppan | 0.01/0.05 | sleek wind falcon |
| 021 | Stormtalon | 1.7s | formant harm=[4.0] | warble | 1 | thunder + lightning crackle | wide | 0.03/0.1 | massive storm eagle |
| 022 | Finblade | 1.4s | pulse harm=[0.2] | lin | 2 | chrome fin ring | snappan | 0.01/0.04 | sharp swordfish, chrome fin |
| 023 | Megalochrome | 1.8s | fm fm 1.75x idx 2.0 | arch | 1 | torpedo water rush | subwide | 0.1/0.15 | giant chrome megalodon |
| 024 | Floatcalf | 1.4s | fm fm 2.0x idx 1.2 | arch | 1 | neon electric crackle 36 | haas | 0.04/0.08 | floating calf whale, Neon=Electric |
| 025 | Astroleviathan | 1.9s | sine_harm harm=[1, 0.6, 0.4] | arch | 1 | galactic electric hum + star pings | slowpan | 0.3/0.3 | massive cosmic whale, Neon=Electric |
| 026 | Inklet | 1.3s | noise_tone  | dip | 1 | ink squirt bursts | haas | 0.03/0.06 | small dark squid |
| 027 | Toxitacle | 1.5s | fm fm 1.33x idx 2.8 | warble | 1 | toxic bubble gurgle | pan | 0.05/0.08 | poisonous dark octopus |
| 028 | Krakenox | 1.9s | saw  | arch | 1 | abyssal rumble + tentacle slaps | subwide | 0.12/0.18 | giant shadow kraken |
| 029 | Punchkid | 1.2s | square  | lin | 2 | glove thumps | center | 0.02/0.04 | tiny fighting kid, boxing gloves |
| 030 | Strikechamp | 1.4s | saw  | lin | 3 | impact thumps x3 | wide | 0.02/0.05 | champion boxer |
| 031 | Kickmaster | 1.4s | pulse harm=[0.4] | dip | 1 | kick snap | snappan | 0.01/0.03 | champion kickboxer |
| 032 | Gearkid | 1.2s | square  | trill | 1 | cog ticks | altpan | 0.01/0.03 | small gear robot |
| 033 | Mechapion | 1.5s | fm fm 2.5x idx 1.8 | lin | 4 | piston hiss bursts | mechpan | 0.03/0.05 | heavy mechanic robot, pistons |
| 034 | Gorokappa | 1.8s | saw  | arch | 1 | steam vents | wide | 0.09/0.14 | massive mecha gorilla, steam |
| 035 | Pebblefist | 1.4s | tri  | lin | 2 | gravel fist thumps + crunch | center | 0.03/0.06 | rock fists golem |
| 036 | Cragarm | 1.7s | saw  | warble | 1 | rock grind low | subwide | 0.08/0.12 | boulder arms golem |
| 037 | Terrapod | 1.9s | sine_harm harm=[1, 0.4, 0.2] | arch | 1 | earthquake deepest | subwide | 0.18/0.22 | colossal mountain golem |
| 038 | Sproutle | 1.2s | sine_harm harm=[1, 0.3, 0.1] | trill | 1 | leaf rustle | lightpan | 0.03/0.06 | grassy plant turtle (Flora=Grass) |
| 039 | Shellguard | 1.4s | tri  | trill | 1 | shell knocks x3 | center | 0.04/0.07 | armored bush turtle |
| 040 | Dreadtoise | 1.8s | saw  | warble | 1 | forest titan creak | wide | 0.12/0.16 | massive dreadnought tortoise |
| 041 | Pixilite | 1.2s | fm fm 3.5x idx 4.0 | lin | 4 | pixel blips | sparklepan | 0.01/0.03 | tiny digital flower sprite, Flora only |
| 042 | Wispkin | 1.8s | noise_tone  | vib | 1 | ghost breath swell | slowdrift | 0.3/0.35 | floating dark wisp, V1 skull design |
| 043 | Duskfiend | 1.7s | fm fm 1.25x idx 3.5 | warble | 1 | dusk shimmer sparse | drift | 0.1/0.2 | terrifying dusk phantom |
| 044 | Ashemit | 1.3s | pulse harm=[0.25] | lin | 2 | ember pops | haas | 0.02/0.05 | little ash demon |
| 045 | Pyromonk | 1.5s | sine_harm harm=[1, 0.45, 0.2, 0.1] | vib | 1 | staff flame crackle | center | 0.06/0.1 | fire martial monk, burning staff |
| 046 | Yogiferno | 1.8s | saw  | arch | 1 | yeti breath + fire crackle | wide | 0.1/0.15 | LARGE yeti roar, bigger than humans, NOT deity-tier, NOT small (Mars ruling) |
| 331 | Mythar | 2.0s | fm fm 4.0x idx 3.0 | lin | 5 | celestial shimmer partials | wideshimmer | 0.05/0.3 | divine celestial creator, crystalline |
| 147 | Dorowani | 1.5s | noise_tone  | arch | 1 | water splash swells x3 | waterpan | 0.08/0.12 | NON-VERBAL water sweep only, no speech/bark (Mars ruling) |
| 148 | Gabu | 1.2s | pulse harm=[0.35] | lin | 2 | crown ping 1760Hz | pingpan | 0.01/0.04 | mid bright spiky chirp + crown ping |

## Distinctness proof
- Design signature = (oscillator, harmonics/FM, contour shapes, note count, texture name, texture kind+params, envelope, stereo mode). 
  The rebuild script computes it for all 49 and reports: **SIGNATURE COLLISIONS: none — 49/49 distinct**.
- Oscillator kinds used: sine_harm, fm, formant, saw, square, tri, pulse, noise_tone (8 kinds, vs v1's 1 voice).
- Contour shapes used: lin, arch, dip, warble, trill, vib (6 shapes). Note counts: 1–5 per creature, with pauses between notes.
- Texture names: 49 unique. Stereo modes: haas, pan variants, chorus, hardpan, subwide, wide, center, narrow, altpan, etc. (per creature).
- Durations kept from v1 canon (title durations as before): 1.20–2.00s. Stereo 16-bit 44100 Hz throughout.
- Mars rulings kept: Dorowani non-verbal water sweep; Gabu chirp + 1760 Hz crown ping; Yogiferno large yeti roar, NOT deity-tier; 
  Neon creatures (Floatcalf, Astroleviathan) Electric texture; Silk=Bug, Wind=Flying, Neon=Electric starting mappings.

## What still needs Mars
- Hearing approval of the r1 files (playable links sent separately, after Mars sees this plan — no links in this task). 
- Title 10 confirmation given 2026-10-26 14:48 was BEFORE hearing playable versions, so it is provisional if title 10 also sounded same-key — 
  Mars to confirm again after the distinct rebuild if so. No r1 file ships to the repo until he approves by name.
