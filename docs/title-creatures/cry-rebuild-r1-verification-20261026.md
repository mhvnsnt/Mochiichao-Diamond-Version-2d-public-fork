# Cry rebuild R1 — verification report (2026-10-26)

Staged only. No repo edits, no PR, no merge, no shipped v1 file overwritten (v1 files keep their original names; r1 files are new *-cry-r1.wav files; audio folder now holds 100 WAVs = 51 shipped files + 49 r1 files).

## Format / duration / non-silence: 49/49 PASS
- Every r1 file: stereo (2 channels), 16-bit, 44100 Hz, duration 1.20–2.00s, RMS 0.19–0.52 (all non-silent, peak-normalized to 0.89).
- Durations kept from v1 canon: e.g. Mochii 1.20, Razorgater 1.50, Tyrage 1.40, Kittember 1.30, Sproutle 1.20, Dorowani 1.50, Gabu 1.20, Wispkin 1.80, Yogiferno 1.80, Mythar 2.00.

## Distinctness — design parameters: 49/49 distinct
- Signature = (oscillator, harmonics/FM, contour shapes, note count, texture name, texture kind+params, envelope, stereo mode). Script output: `SIGNATURE COLLISIONS: none — 49/49 distinct`.
- Oscillator kinds: 8 (sine_harm, fm, formant, saw, square, tri, pulse, noise_tone) vs v1's 1 voice.
- Contour shapes: 6 (lin, arch, dip, warble, trill, vib). Designed note counts: 1–5 per creature, with pauses between notes (vs v1's single glide).
- Texture names: 49 unique, each with unique parameters (counts, frequencies, rates, decays). Stereo modes and attack/release values vary per creature.

## Distinctness — measured audio spread
- Spectral centroid across r1 files: 81 Hz – 11,471 Hz (mean 1,614 Hz) — low roars and high sparkles sit at opposite ends, not one pitch-shifted voice.
- Measured envelope syllable peaks (50 ms RMS, height > 0.5 max): distribution 1×1, 3×4, 4×10, 5×15, 6×10, 7×3, 8×6 creatures — rhythm varies, not one envelope shape.
- Peak-RMS time: 0.05s – 1.55s across files (attacks land at different points, not one template).

## Honest limit on the similarity metric (read this, do not over-claim)
- A coarse 28-dimension feature (8-band spectrum + 20-bin envelope, cosine similarity) did NOT separate r1 from v1: r1 mean pairwise cosine 0.792, max 0.999; v1 mean 0.740, max 1.000. 
  That metric is dominated by the shared one-shot attack-decay envelope shape at 20-bin resolution, so it cannot prove or disprove distinctness on its own — it is reported here so nobody claims it as proof.
- The distinctness claim therefore rests on (a) the exact 49/49 design-signature uniqueness, (b) the centroid/syllable/peak-time spreads above, and (c) Mars's ear, which is the final judge. 
  If any r1 pair still sounds like the same sound in a different key to Mars, name the pair and that pair gets re-designed — the signature table shows exactly which parameters to change.

## Per-file table
| ID | Creature | File | Dur | RMS |
|---|---|---|---|---|
| 001 | Mochii | mochii-cry-r1.wav | 1.2s | 0.3153 |
| 002 | Tiidebiite | tiidebiite-cry-r1.wav | 1.4s | 0.288 |
| 003 | AquariiOS | aquariios-cry-r1.wav | 1.6s | 0.2471 |
| 004 | Razorgater | razorgater-cry-r1.wav | 1.5s | 0.2535 |
| 005 | Chromejaww | chromejaww-cry-r1.wav | 1.5s | 0.2283 |
| 006 | Reaperdile | reaperdile-cry-r1.wav | 1.8s | 0.3118 |
| 007 | Tyrage | tyrage-cry-r1.wav | 1.4s | 0.3245 |
| 008 | Duneclaw | duneclaw-cry-r1.wav | 1.5s | 0.2309 |
| 009 | Oblivirex | oblivirex-cry-r1.wav | 1.9s | 0.3169 |
| 010 | Kittember | kittember-cry-r1.wav | 1.3s | 0.2983 |
| 011 | Pyropaw | pyropaw-cry-r1.wav | 1.3s | 0.346 |
| 012 | Manticlaw | manticlaw-cry-r1.wav | 1.7s | 0.2354 |
| 013 | Pupbble | pupbble-cry-r1.wav | 1.2s | 0.2358 |
| 014 | Terradog | terradog-cry-r1.wav | 1.4s | 0.2962 |
| 015 | Quakehound | quakehound-cry-r1.wav | 1.8s | 0.3073 |
| 016 | Squirmite | squirmite-cry-r1.wav | 1.2s | 0.3951 |
| 017 | Cocoonode | cocoonode-cry-r1.wav | 1.3s | 0.305 |
| 018 | Mothrix | mothrix-cry-r1.wav | 1.5s | 0.3645 |
| 019 | Zephling | zephling-cry-r1.wav | 1.2s | 0.2059 |
| 020 | Aerobeak | aerobeak-cry-r1.wav | 1.3s | 0.2595 |
| 021 | Stormtalon | stormtalon-cry-r1.wav | 1.7s | 0.2342 |
| 022 | Finblade | finblade-cry-r1.wav | 1.4s | 0.306 |
| 023 | Megalochrome | megalochrome-cry-r1.wav | 1.8s | 0.3831 |
| 024 | Floatcalf | floatcalf-cry-r1.wav | 1.4s | 0.3182 |
| 025 | Astroleviathan | astroleviathan-cry-r1.wav | 1.9s | 0.3368 |
| 026 | Inklet | inklet-cry-r1.wav | 1.3s | 0.2046 |
| 027 | Toxitacle | toxitacle-cry-r1.wav | 1.5s | 0.3255 |
| 028 | Krakenox | krakenox-cry-r1.wav | 1.9s | 0.2727 |
| 029 | Punchkid | punchkid-cry-r1.wav | 1.2s | 0.3723 |
| 030 | Strikechamp | strikechamp-cry-r1.wav | 1.4s | 0.2636 |
| 031 | Kickmaster | kickmaster-cry-r1.wav | 1.4s | 0.5226 |
| 032 | Gearkid | gearkid-cry-r1.wav | 1.2s | 0.2381 |
| 033 | Mechapion | mechapion-cry-r1.wav | 1.5s | 0.2945 |
| 034 | Gorokappa | gorokappa-cry-r1.wav | 1.8s | 0.2779 |
| 035 | Pebblefist | pebblefist-cry-r1.wav | 1.4s | 0.3055 |
| 036 | Cragarm | cragarm-cry-r1.wav | 1.7s | 0.3213 |
| 037 | Terrapod | terrapod-cry-r1.wav | 1.9s | 0.3514 |
| 038 | Sproutle | sproutle-cry-r1.wav | 1.2s | 0.3486 |
| 039 | Shellguard | shellguard-cry-r1.wav | 1.4s | 0.3843 |
| 040 | Dreadtoise | dreadtoise-cry-r1.wav | 1.8s | 0.361 |
| 041 | Pixilite | pixilite-cry-r1.wav | 1.2s | 0.3045 |
| 042 | Wispkin | wispkin-cry-r1.wav | 1.8s | 0.1906 |
| 043 | Duskfiend | duskfiend-cry-r1.wav | 1.7s | 0.3822 |
| 044 | Ashemit | ashemit-cry-r1.wav | 1.3s | 0.3174 |
| 045 | Pyromonk | pyromonk-cry-r1.wav | 1.5s | 0.35 |
| 046 | Yogiferno | yogiferno-cry-r1.wav | 1.8s | 0.293 |
| 331 | Mythar | mythar-cry-r1.wav | 2.0s | 0.2433 |
| 147 | Dorowani | dorowani-cry-r1.wav | 1.5s | 0.1988 |
| 148 | Gabu | gabu-cry-r1.wav | 1.2s | 0.3043 |
