# OUTRO CREDIT GAG NUMBER ONE — ABOVE-FLOOR TIMING CHART SET

Companion data: [`EP01-ED-GAG-ABOVE-FLOOR-CHART.json`](EP01-ED-GAG-ABOVE-FLOOR-CHART.json)
(format `mochiichao/timing-chart/v1` — the format the proof-gate
checker's chart-conformance mode reads). Beat grid:
[`EP01-ED-BEAT-MAP.json`](EP01-ED-BEAT-MAP.json), same folder.

**Status, plainly: this is the rebuild's input, not a rebuild.**
No new character art was drawn and no gag was re-rendered in this
programme. The rebuild waits on two owner calls that are still
open: the Gate-8 verdict on the v6 industry-method walk proof, and
the profile call (gag line in profile with locked profile model
sheets first, or the method applied front-facing). When those land,
this chart set is what the rebuild is timed to, and
`verify_proof.py --chart` is how the result is checked against it.

## Why a new chart set (the measured problem)

The current gag (v2) measured **7.786 new drawings/sec — below the
8/sec credits floor** — with a **uniform-unmodulated-rate flag**
(one 3-frame grid, no accents, 14 s). Its personality beats were
2 grid slots long (0.25 s — gap 19: too short to catch), its bell
moment (ED 60 s, gag frame 96) had nothing charted on it (gap 18),
its five walkers shared one grid with no line chart (gap 12), and
four of five gaits had no timing grammar at all (gap 14). This
chart set answers those four gaps on paper, above the floor:

- **Drawing-change structure (counted from the chart's own segment
  tables): 169 drawing-change frames in 336 = 12.07/sec** — above
  the credits floor with headroom, and *modulated*: exposures run
  2–6 frames inside cycles, with 1-frame-class bursts reserved to
  the Phase P proof grammar and beat holds of 8–28 frames.
- **Sparsest 2 s window: 14 drawing-change frames (7/sec)** — the
  final button (see Ending), a named composed exception, not drift.
- Every personality beat is a **held drawing ≥ 0.5 s** (gap 19
  floor), and the line's biggest accent sits **on the bell**
  (gap 18, via the beat map).

## The beat grid the charts ride (from the beat map)

Pulses every 10 frames from gag frame 6 · strong pulses every 20
from frame 16 · barlines at **16, 56, 96, 136, 176, 216, 256,
296** · **bell at frame 96**. Mochiko's contacts land on strong
pulses; barlines carry the personality beats.

## LINE chart (gap 12)

- **Line speed of record: 160 px/s**, named and derived, not
  picked: Mochiko's drawn stride is 134 px/step at gag scale
  (v6 cycle chart: 285 still-px footprint spread × 296/628 gag
  scale); a step lasts one strong pulse (0.8333 s); 134 / 0.8333
  = 161 px/s, set to the cel grid as **20 px per 3-frame cel
  step**. Residual glide 1 px/step (0.6%) — the rebuild's stick
  gate re-measures per step against the ground art.
- Cel travel rides its own 3-frame grid for all five (the v2
  crossing device); drawing changes ride the per-character grids
  below. The two are reported separately everywhere — a cel step
  is not a drawing.
- **Spacing table (constant — one speed, no drift):** anchors
  (centre at frame 0, from the v2 compositor's CAST table):
  Mochiko −77 · Mochii −384 · Kittember −632 · Sproutle −912 ·
  Wispkin −1137. Centre gaps: 307 / 248 / 280 / 225 px.
  Baselines y=608 (Wispkin floats at 580). Adjacent sprites
  overlapped ~100 px at these gaps in v2; the rebuild runs the
  gap-12 overlap check on composited frames.
- **Entrance/exit (charted, gap 20):** centre-crossing frames —
  Mochiko in 12 / out 204 · Mochii 58 / 250 · Kittember 95 / 287 ·
  Sproutle 137 / 329 · Wispkin 171 / never.
- **Ending, described in words in advance (gap 20 gate):** the
  bit does not end on arithmetic. Wispkin's mask-tilt look starts
  at the frame-296 barline and settles into a 28-frame held
  drawing (308–335) — the button of the gag — while Sproutle
  exits. Final frame in words: Wispkin alone right-of-centre,
  mask tilted in the look, smoke trailing against travel, held.
  First frame in words: Mochiko mid-entrance (centre −77), first
  contact due frame 16, the line strung out off-screen left in
  cast order.

## Per-species gait timing (gap 14, timing half)

| Walker | Cycle | Exposure grammar | Phase | Beat |
|---|---|---|---|---|
| Mochiko (walk) | 8 poses / 40 f (2 steps) | 4 poses per 20 f step; patterns rotate [5,5,5,5] [4,5,6,5] [5,4,5,6] [6,5,4,5]; contacts on strong pulses 16…196 | 0 | skip: anticipation 56–61, **air held 62–75 (14 f)**, land on strong pulse 76 · look-back: **planted look held 156–167 (12 f)**, return by 176 |
| Mochii (hop) | 8 poses / 20 f | [3,2,2,3,2,3,2,3] — the line's fastest clock, ~9.6 poses/s | +2 f | big hop on the 136 barline: 8 poses / 40 f, **air pose held 148–159 (12 f)** |
| Kittember (stride-rock) | 8 poses / 40 f | [5×8] with rock grammar; flame flicker rides the same grid | +4 f | **flare held 216–229 (14 f)** on the barline, settle pose 230–235 |
| Sproutle (waddle) | 8 poses / 40 f | [6,4,5,5,6,4,5,5] — uneven by design (waddle lilt) | +1 f | near-tip wobble on the 256 barline: **two extremes held 12 f each (256–279)** |
| Wispkin (float) | 16 poses / 80 f | [5×16]; smoke is an FX-column counter-phase entry at rebuild (trails against travel — never in-place sway, per addendum-2 gap 14) | +7 f | **look held 308–335 (28 f)** — the button (above) |

Mochiko's gait is the v6 industry cycle's timing, re-gridded to
the beat map; the other four are timing grammars only — their
drawn-space gates (footfall charts, float drift range) remain
addendum-2 obligations for the rebuild, not closed by this set.

## The bell accent (gap 18, closed on paper)

Frame 96 is a barline and the bell (ED 60.000 s, verified in the
beat map). Charted: **all five walkers change on frame 96** into a
startle/hold drawing; the line **freezes composed for 8 frames
(96–103)** — drawings hold, cel travel continues; **all five
change again at 104** (the release burst). The old chart had
nothing at slot 32; this one builds the gag's centrepiece on it.

## Conformance

The JSON is written in `mochiichao/timing-chart/v1`, the format
`verify_proof.py --chart <chart.json>` checks a rendered clip
against (accents within ±2 frames, line holds empty of changes,
contacts answered by a change — deviations reported by frame
number; the checker reports, it does not grade). The current v2
gag does not conform to this chart — it predates it; its
conformance run is recorded in `timing-profile-runs.json` as the
baseline the rebuild has to beat.
