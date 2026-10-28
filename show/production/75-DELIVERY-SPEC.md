# #75 — BROADCAST DELIVERY STANDARDS → show delivery spec

**Teardown (public documentation).** Broadcast/streaming delivery
is a *spec-sheet discipline*: a deliverable is a file plus a metadata
sheet, checked against published tolerances — loudness integrated
over the programme with a true-peak ceiling (EBU R128: −23 LUFS;
ATSC A/85: −24 LKFS; the podcast/streaming practice that converged
on **−14 LUFS** for online stereo delivery), video levels/codec and
frame-rate conformance, caption/subtitle files as separate timed
assets, textless elements, and a QC pass whose report travels with
the master. The kit taken: the *shape* — one delivery sheet per
episode, every tolerance named, QC measured not eyeballed. No
network's proprietary spec sheet is copied; tolerances below are
either public standards or **our own already-measured house finish**.

**Native spec — Mochiichao episode delivery sheet.** One sheet per
episode, filled at the finish gate; an episode is not "done" until
its sheet passes. The **audio chapter is the existing house finish,
unchanged**: **−14 LUFS integrated / −1 dBTP**, two-pass measured
loudnorm, per-scene bed gates already proven (EP01 beds measured
−14.44/−1.00, −14.18/−1.00, −13.94/−0.95 across scenes — the finish
is a measured fact of this production, and this sheet is where it
gets recorded per episode rather than re-argued per scene).

| Chapter | Check | Tolerance / rule |
|---|---|---|
| Audio — programme | Integrated loudness, true peak | **−14 LUFS ±0.5 / ≤ −1 dBTP** (house finish) |
| Audio — stems | MUS stem set + beds archived per #13 manifest | manifest complete; absent layers listed with reasons |
| Audio — cries/voices | VOICE-SCRATCH flags cleared or episode is animatic-class | scratch audio never ships in a master |
| Picture | Frame rate / resolution | 24 fps (house standard, rig + timing docs); master resolution set at landing — **OPEN** until first master |
| Picture | Living-world floor | Composite Life gate: world moves except where Forest-stillness is scripted (inverted gate for Forest cuts) |
| Picture | Style gate | Current MOCHIICHAO STYLE SPEC version named on the sheet; no baked shadows in character art |
| Text | Subtitle file as separate timed asset | subtitle law: rationed, important moments only; meaning-subtitles vs Rule subtitles colour law (COLOR-SYSTEM) |
| Text | Textless / clean elements | title + intertitle cards archived textless |
| Metadata | Episode record | cuts count, SCORE-STATE/WIND-STATE plot, cycle-usage list (BANK accounting), registry updates in same PR (house repo hygiene) |
| QC | Report travels with master | gate report JSON beside the master, as the audio beds already do |

**Delivery targets (honest split).** −14 LUFS is the *online*
convergence value, and it is the right master for how this show
actually ships today (repo/web). If a broadcast partner ever enters,
their sheet (e.g. −23 LUFS R128 class) is a **re-wrap from the same
stems**, not a re-mix philosophy — the delivery sheet gains a
per-target loudness row at that point, and not before. No broadcast
deal exists; the spec claims none.

**Wiring.** Final consumer of: #13 stem manifests, #16 timing
sheets, #73/#67 state plots, voice-kit finals, COLOR-SYSTEM subtitle
law, Style Spec currency. Its QC row feeds the repo landing (master +
sheet + gate report in one PR, per house hygiene).

**Coverage.** Standards: public (R128 / A/85 / online practice).
Contents: audio chapter is measured canon of this production;
picture-master resolution and any broadcast-target rows are OPEN
until a first master / a real partner exists.
