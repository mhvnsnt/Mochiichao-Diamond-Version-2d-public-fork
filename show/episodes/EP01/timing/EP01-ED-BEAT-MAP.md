# EP01 ED BEAT MAP — the ED bed, measured (gap 18, first artefact)

Companion data: [`EP01-ED-BEAT-MAP.json`](EP01-ED-BEAT-MAP.json)
(format `mochiichao/ed-beat-map/v1`). Filed under TIMING-STANDARD §7's
beat-grid rule: no scored piece's animation is charted until its bed
has a beat map. This is the first one. It covers the whole 75 s ED
bed, with the Outro Credit Gag window (ED 56–70 s) broken out.

## The bed, verified before analysis

- File: `EP01-V3-ED.wav` (workspace master
  `~/workspace/ep01-finish/audio/EP01-V3-ED.wav`; the STEMS-AND-MASTER
  manifest in this folder records the same hash).
- sha256 `485525875c47d36f0d80f2500b4eee09ff30200a0638397f20ea6e43ea938925`
  · 14,400,078 bytes · 75.000 s · 48 kHz stereo PCM16 (ffprobe).

## The grid (measured)

- **Pulse: 144.0 per minute** — one pulse every 0.416667 s, first
  pulse at **0.009 s**. At the 24 fps master that is exactly
  **10 frames per pulse**, 20 frames per strong pulse (every second
  pulse), 40 frames per bar (4 pulses), 120 frames per phrase
  (12 pulses, 5.000 s).
- How it was measured: log-magnitude spectral flux over the finished
  bed for onsets; a grid fit (BPM × phase, sqrt-flux sampled at
  candidate beat times) tops out at **144.0 BPM / phase 0.0087 s,
  score 4.592** on the finished bed (runners-up: 96 BPM 4.111,
  120 BPM 3.658) and at **144.0 / 0.0087, score 6.821** on the
  main-menu stem alone — the bed's pulse is that stem's grid.
  Autocorrelation of the onset envelope peaks at lags 0.416 s
  (pulse), 0.832 s (two pulses), 1.664 s (bar), 5.003 s (phrase).
- The 72-per-minute reading is the two-pulse alias of this grid
  (the strong-beat layer), not a second tempo. Both layers are in
  the data file; charts use pulses for accents and strong pulses
  for contacts.

## Named events (provenance per event in the data file)

| ED time | Frame (1-based) | Event |
|---|---|---|
| 0.000 s | 1 | Bed start — vocal-lead + menu spans begin (2 s / 3 s fade-ins), night tone + crickets under |
| 26.667 s | 641 | Menu stem loop restart |
| 41.143 s | 988 | Vocal-lead stem loop restart |
| 51.833 s | 1245 | Menu stem second loop restart |
| **60.000 s** | **1441** | **Distant bell** (gate-bell-boot-distant, −21 dB in the mix, 2.667 s tail) |
| 65.000 s | 1561 | Final 10 s fade-out begins |
| 75.000 s | 1800 | Bed end |

Loop restarts and fades are from the bed's builder code
(`build_beds.py`, ED section) — CODE-grade. The bell is CODE-grade
**and** measured, next section.

## The bell at ED 60 s — manual spot-check (measured)

Gap 18 named this event from the production record; this pass
checked it against the audio itself, three ways:

1. **Builder code:** `b.add(BELL_FAR, 60.0, -21)` — the distant-bell
   sample placed at exactly 60.0 s, −21 dB (`build_beds.py`, ED
   section; BEDS.md's ED row says the same in words).
2. **Template correlation on the finished bed:** the finished
   `EP01-V3-ED.wav` was cross-correlated against the actual
   `gate-bell-boot-distant.wav` sample over a 55–65 s search
   window. The normalised correlation **peaks at exactly
   60.00000 s — rank 1** in the window (corr 0.249; the bell sits
   −21 dB under a full bed, so a low absolute correlation with a
   rank-1 exact-time peak is the expected signature).
3. **Same check on the raw pre-loudnorm mix**
   (`EP01-V3-ED.raw.wav`): also rank 1 at exactly 60.00000 s
   (corr 0.249), with a least-squares fitted bell scale of 0.065
   (−23.7 dB relative to the source file, consistent with the
   −21 dB placement plus the raw mix's peak normalisation).

The bell's fundamental is 392 Hz (the distant variant is the
harbour bell low-passed at 900 Hz); it is quiet by design and does
not show as a broadband onset — which is exactly why the earlier
"the chart has nothing where the bell lands" failure was possible.
On this grid the bell is **pulse index 144, a barline**: ED frame
1441 (1-based) = **gag frame 96 (0-based)** in the 56–70 s window.

## The gag window on this grid (ED 56–70 s = gag frames 0–335)

- Pulses at gag frames **6, 16, 26, …** (every 10 frames).
- Strong pulses at **16, 36, 56, …** (every 20 frames).
- Barlines at **16, 56, 96, 136, 176, 216, 256, 296** (every 40).
- **Bell at gag frame 96** — a barline. The above-floor gag chart
  (`EP01-ED-GAG-ABOVE-FLOOR-CHART.json`, same folder) puts the
  line's biggest accent there, as TIMING-STANDARD §7 requires:
  named bed events get chart events, on the frame.

## What this does not claim

- The vocal-lead stem is a solo line without a measurable steady
  pulse of its own (its grid fit is diffuse); the bed's pulse is
  the menu stem's. Charts sync to the pulse grid, not to the solo.
- Accent onsets in the data file (spectral-flux z ≥ 1.5) are
  measured onsets, not musical interpretations; 103 are listed.
- This map times the CURRENT bed (`EP01-V3-ED.wav`, hash above).
  If the bed is ever re-cut, the map is re-measured, not edited
  by hand.
