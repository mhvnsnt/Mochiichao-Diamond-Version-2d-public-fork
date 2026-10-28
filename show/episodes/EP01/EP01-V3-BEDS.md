# EP01 v3 — AUDIO BEDS (measured report)

All beds 48 kHz stereo WAV in this folder, named `EP01-V3-<SCENE>.wav`.
Measurements: ffmpeg loudnorm analysis run AT the target settings
(`loudnorm=I=-14:TP=-1:LRA=11:print_format=json`) on the finished files.
Normal-bed targets: −14 ±1 LUFS, TP ≤ −0.9 dBTP. **Total runtime: 1440.0s exactly.**

## Music-source substitution (honest note, per brief's fallback clause)

The 7.26MB title-v3 + four mixer stems are **unfetchable through this VM's
credential proxy** — every transfer path (contents base64, blobs, raw, ranged)
truncates at ~5.6–5.8MB. They were NOT used. Cluster beds were built instead
from the verified fetched T1-family mixes — `intro-v3.wav` (24.0s),
`main-menu-v1.wav` (26.7s), `vocal-lead.wav` (41.1s, mixer vocal-lead) —
looped/arranged/crossfaded, plus the music inside the gated scene beds and
synthesised room tones/SFX. Script directions like "melody stem solo" are
therefore **arrangement-style approximations**: vocal-lead carries the
solo-melody role, main-menu the work/underscore role, intro-v3 the full
T1 arrangement role. No ACE-Step was used.

## Per-bed table

| Bed | Dur (s) | LUFS | TP (dBTP) | Method / notes |
|---|---|---|---|---|
| OP | 60.0 | −14.02 | −1.00 | Title arrangement: intro-v3 looped to exactly 60s, broadcast fade-out over final 6s; vocal-lead layer 24–54s; boot-bell stir at 0.4s |
| N1 | 78.0 | −14.02 | −0.96 | Dawn: bell (boot-bell stir) is the downbeat at 0.8s; no music 0–26s; vocal-lead solo enters 26s, main-menu settles under at 48s; MUSIC OUT at 72s — last 6s room tone only (V3-006). Flame hum + post creak (V3-004), latch ×2 + Dorowani hum-cry (V3-005), one distant cry |
| S1 | 37.0 | −14.18 | −1.00 | **Gated bed as-is** (byte copy of SCENE-01 gate-morning) |
| N2 | 128.0 | −14.04 | −0.98 | Rounds pt.1: work mixes; counting taps + pencil (V3-013/014); swallow on the count at 33s and one music layer drops out and does not return; bowl/eating (V3-016); Sproutle chirps ×3 at the beds + visor squeaks (V3-017); bucket whooshes on Gabu's stride (V3-018); fin-on-wood notch row (V3-019); MUSIC OUT for the V3-020 reading — gavel taps, page turn, **CRY SYNTH** Dorowani reading cadence (question/answer contours) |
| S2 | 33.0 | −13.98 | −1.00 | **Gated bed as-is** (byte copy of SCENE-02 pond-tour) |
| N3 | 102.0 | −14.04 | −0.99 | Pond work: berry stacking taps; flame hum IS the music 24–46s (music out, V3-028/029); Gabu chest-beat + net creak; snore cycle + audible leaf landing at 66s; berry set-down at threshold (78s); midday bell (boot-bell, brightened) at 84.5s into the drift |
| S3 | 27.0 | **−40.00** | −25.74 | **DELIBERATE ABSENCE** (v2 decision carried in v3): near-silence Green room tone; scripted events only — Gabu stomp + chest-beat + bellow cry ~1s in, frost crackles, Sproutle chirps, boot-spark device tones at the end. Gain-scaled to −40 LUFS class (loudnorm's TP floor is −9, so plain gain from measured integrated was used); reported as measured |
| N4 | 108.0 | **−15.40** | −1.30 | Investigation: pulse mixes; V3-039 colour-shift — bed ducks 26–41s, frost crackle is the loudest element (−2/−4 dB events at 27/34s), shimmer exposed, one stem re-enters at half strength at 41s on the restore; device tones (boot-spark sequence), **THE PING once at 86.0s** (clean dry 2093 Hz sine, untreated); Gabu offence beats; **see Known defect below** |
| N5 | 96.0 | −14.17 | −0.99 | Net plan: rope/net/bait events; Dorowani **CRY SYNTH** work-hum (V3-047); leaf = first catch (28s); suspicion cry chord (40s); trigger snap + net whoosh + Dorowani's-corner rope creaks at 52s, music stops short; flame hum descends to near-nothing 70–86s, music OUT (V3-052); one stem at floor of audibility 86–96s |
| N6 | 84.0 | −14.11 | −0.99 | Garden at work: feeding-round cries per species, bowls; stem drops out at the tools rack (V3-056), single stem held (V3-057); NO music 50–60s (V3-058, one berry fewer); day sounds end one by one; eyecatch sting fragment hands over at 82s |
| EYE | 8.0 | −13.92 | −2.46 | Eyecatch sting arranged from intro-v3 slices (exactly 8.0s) + boot-spark blip + boot-chirp |
| N7 | 73.0 | −14.02 | −1.00 | Stakeout builds: dusk mixes thinning with the light; **CRY SYNTH** planning murmurs (Mochii/Sproutle/Gabu hum, V3-062/063); string creak (leaf on string), blankets, Manual thump respected-soft; tripwire flame hum from 46s resolving into the S4 dusk texture |
| S4 | 74.0 | −14.69 | −0.96 | **F1 re-timed + boundary-corrected — see dedicated sections below.** F1 event extractions + script SFX (splash/flare/duck — GAP in the gated bed) over continuous dusk ambience 0–64s; gated Scene-5 head (cut 19) at 64–74s; two-pass loudnorm finish |
| S5 | 48.0 | −14.46 | −0.97 | **Boundary-corrected — see below:** gated Scene-5 with first 10s removed (moved to S4) + 4.8s tail pad from its own night room tone |
| N8 | 128.0 | −14.03 | −1.73 | Night shift together: vocal-lead solo night arrangement; stems join one by one (36s menu, 64s intro, full at 86s, out entirely by 110s); Wispkin recorded cry at its quietest (30s, −23 dB); frost-crackle at walking pace (round); duck launch squeak; **V3-088 CRY SYNTH Wispkin wail variant with contour bent UP** at 103s; **V3-089 intertitle: music out, bed pulled down −24 dB, no SFX 112–125s; one stem returns after the card** |
| N9 | 104.0 | −14.06 | −1.00 | Night: **CRY SYNTH** Mochii squeak-snore cycle (V3-090); Gabu snore cycles + **CRY SYNTH** gabu-hum vocal component (V3-091); flame-hum lighthouse sweep + visor tick; pencil-steady + book-close (V3-093) as stems thin to none; **V3-094 HELD SILENCE 52–68s: crickets + night cycles ONLY — no music, no designed events**; distant boot-bell once at 71s (V3-095); frost glimmer crackle (V3-096); crickets thin by one layer at 92s |
| N10 | 86.0 | −13.73 | −0.97 | Morning-after: dawn bed fuller than N1's; vocal-lead solo (Scene-5 language as morning); **V3-100 intertitle: music out + bed pulled down 26–36s, stem returns softened after**; backpack settle, top-berry adjust at threshold, breath-laugh; Gabu snore at peace + **CRY SYNTH** cadenced hums under the final hold; melody solo to the stinger seam |
| ST | 46.0 | −51.85 | −30.71 | **Gated stinger as-is** (byte copy; deliberate near-silence, exempt by design) |
| ED | 75.0 | −14.06 | −0.99 | Night arrangement (approximation of stems): vocal-lead solo + main-menu pad role, slow, gentle 10s fade; night tone + crickets under; distant bell at 60s |
| PREV | 45.0 | −14.28 | −0.99 | T1 sting (eyecatch arrangement) + vocal-lead melody fragment + quiet Wispkin cry hook at 24s + main-menu fragment + dawn room-tone tail |

## Known defect — N4 (blocker: sandbox write block)

N4's content is complete and final, but its first loudnorm pass landed at
−15.40 LUFS (0.4 LU outside the ±1 band; TP −1.30 is compliant). The repair
(+1.6 dB gain with peak limiting at 0.87, computed and verified in memory:
post-limit peak 0.871) **could not be written**: partway through this session
the sandbox began refusing all writes larger than a few KB with
`Operation not permitted` (both ffmpeg and Python, any filename) — the same
block also killed one earlier ffmpeg write. The exact repair, ready to run
when write access restores: decode `EP01-V3-N4.wav` to float, apply
`volume=+1.60dB` + limiter ceiling 0.87 (≈ −1.2 dBFS), re-measure at target
settings; expected ≈ −13.9 LUFS / TP ≈ −1.2. Raw mix is preserved at
`work/beds/EP01-V3-N4.raw.wav` if a from-raw redo is preferred.
All other beds were written and measured before the block, except S4's
finish (below), which completed just before it.

## S4 — F1 re-time table (coordinator decision, flag F1)

The shipped Scene-4 bed's event timings drift from the plan (timed to v1
beats). **Bed events move to the plan:** the gated bed's discrete timed
events were extracted as short windows (event −0.15s … cry end +0.30s,
0.08s edge fades; extraction from a mix cannot unbake the underscore inside
each window — windows are short and sit over matching ambience) and
**re-placed at the v3 script's cue timings** for V3-068..073. Continuous
dusk ambience — looped from the gated bed's own pre-event stakeout head
(0–12s, carrying its bass+organ underscore), RMS-matched — runs underneath
0–64s, with pond-lap and cricket texture layered under the reveal stretch.
The v3 S4 bed thereby supersedes the xsheet's Scene-4 anchors.

| Event (gated bed gate.json role) | Old offset | New offset (v3) | v3 beat |
|---|---|---|---|
| Gabu cry — LUNGE sting (cut 14, Action Beat A) | 24.0s | **15.0s** | V3-069 (14–24s) |
| Kittember cry — tail-flame FLARE (cut 15) | 34.0s | **25.0s** | V3-070 (24–32s) |
| Sproutle cry — silhouette gag reveal (cut 16) | 38.5s | **33.0s** | V3-071 (32–38s) |
| Wispkin cry (soft) — reveal + shy wail into Intertitle 1 (cuts 17–18) | 45.0s | **52.0s** | V3-073 (50–64s), the wail into the card |

Script SFX that were GAP (absent) in the gated bed were synthesised and
placed per the script: splash at 15.4s (with the lunge), flare whoomph at
24.7s, duck squeak (small) at 44.0s (V3-072, Wispkin holding the duck).

## S4/S5 — boundary correction splices (from still-to-build COVERAGE.md)

The gated Scene-5 bed covers v2 cuts 19–24, but in v3, cut 19 (V3-074,
10s, "Then let's do it properly") is the LAST cut of S4; v3 S5 is cuts
20–24 only.

- **S4 (74s)** = F1-re-timed Scene-4 content over dusk ambience, 0–64s
  (cuts 13–18 at v3 timings 0–64s) **+ the first 10s of the gated Scene-5
  bed appended at 64–74s** (cut 19's segment, with its line + events).
- **S5 (48s)** = gated Scene-5 bed with its **first 10s removed**
  (43.2s remaining, cuts 20–24) **+ a 4.8s pad**: the bed's own final 6s
  (night room-tone tail) looped under a 900 Hz lowpass at low gain
  (−4 dB, RMS-matched ×0.8), crossfaded in at 42.7s — events were NOT
  stretched or repeated.
- Every timed cry/line event occurs **exactly once** across the two beds,
  at its v3 picture timing: cut 19's events live only in S4 (64–74s);
  cuts 20–24's events live only in S5 (0–43.2s of the bed).

## CRY SYNTH renders used (teardown lane's wired cry tool)

Rendered from `pilot_six_cries.json` species specs with
`tools/cry_synth.py` via `tools/render_cry_variants.py` (contour/envelope
variants of the specs — the recorded repo cries were never stretched or
pitch-mangled, and remain the standard-beat voices everywhere else):

| Render | Spec change | Used in |
|---|---|---|
| dorowani-reading-question / -answer | pitch contour ends +2.6 st (question) / −2.4 st (answer), 1.15s | N2, V3-020 reading cadence (104.5 / 108 / 111.5s) |
| dorowani-work-hum | near-flat contour, soft amp, 0.9s | N5, V3-047 (16s) |
| gabu-hum | gentle swell contour, 1.3s | N7 V3-062/063 (9s, 15s); N9 snore vocal component (14.5/24.5s); N10 cadenced snore vocal (70/80s) |
| mochii-murmur / sproutle-murmur | amp peaks softened to ~0.55 | N7, V3-062 planning murmurs (3s / 6s) |
| wispkin-wail-resolved | pitch contour BENT UP: −2 → +5 st (spec's fall inverted), 1.6s | N8, V3-088 (103s) — the wail's shape, warm, resolved upward |
| mochii-squeak-snore-cycle | soft squeak render ×2 per 2s cycle ×4, assembled 8s | N9, V3-090 (0.5s, 8.5s) |

## Deliberate-absence flags

- **S3 — DELIBERATE** (−40.00 LUFS class, scripted events only).
- **ST — DELIBERATE** (gated stinger as-is, −51.85 LUFS, exempt by design).
- Held-silence / card moments inside otherwise normal beds: N1 last 6s
  music-out; N4 V3-039 bed duck; N8 V3-089 card (112–125s); N9 V3-094
  held silence (52–68s, crickets + night cycles only); N10 V3-100 card
  (26–36s).

## Tooling

- `tools/scene_audio_bed.py` — the fixed bed tool (analysis at target).
- `tools/make_sfx.py`, `tools/make_derived_sfx.py` — SFX (see SFX-NOTES.md in `audio/sfx/`).
- `tools/render_cry_variants.py` — CRY SYNTH variant renders.
- `tools/build_beds.py` — bed builder; `tools/fix_s4_n4.py` — S4 finish repair
  (N4 portion is the blocked repair described above).

## Coordinator repair note (2026-10-28) — N4 defect CLOSED
The documented +1.6 dB/alimiter repair was attempted first; it produced sample-peak
compliance but TRUE peak -0.10 dBTP (the in-memory estimate was a sample-peak figure).
Superseded by the house method: two-pass loudnorm at target settings on the pre-repair
bed (measured I -15.40 / TP -1.30 / LRA 7.60), linear replay. Final EP01-V3-N4.wav:
**-14.03 LUFS / -1.00 dBTP**, duration 108.0s — in band on both gates. Pre-repair file
preserved at work/beds/EP01-V3-N4.prerepair.wav; raw mix at work/beds/EP01-V3-N4.raw.wav.
All 20 beds now measure -14 +/-1 LUFS / TP <= -0.9 (except the by-design absence beds
S3 -40.00 and ST -51.85, exempt as scripted).
