# ABOVE THE FLOOR — RESEARCH

Owner order (2026-10-28): everything measured at or below the
TIMING-STANDARD floors gets whatever it needs pulled in and wired
to go above and beyond the floor — the floor is not good enough —
with research first. This document is the research. Its wiring
landed the same day (beat map, chart set, checker v2, registry
v1.2); the measured proof is in §6.

**Grading, per house law:** every claim below carries its grade —
DOCS (published analysis/interviews/documentation), CODE (a file
read), or MEASURED (our own instruments on our own files).
Poorly-sourced numbers are flagged, never quoted as fact. There
is no sourced Pokémon-specific split of ones/twos/threes
percentages anywhere we found — anyone quoting one is inventing
it (the Pokémon production-spec report, 2026-10-28, reached the
same finding independently).

## 1. Headline findings

1. **Above-floor is a distribution, not a rate.** What separates
   production work from our floor-level work is not a higher
   uniform rate — it is *where the drawings are spent*: many
   distinct key poses, sparse middles, and a settled slow-down on
   a single pose once the main motion completes. A uniform rate
   at any speed reads flatter than a modulated one (DOCS —
   Maenami analysis, §2; AniGamers modulation survey, §2).
2. **Accents are bought with holds.** The bursts on ones (24
   drawings/sec) are affordable at TV budgets because the same
   shots hold elsewhere — anticipation and settle are the
   funding mechanism, not decoration (DOCS — §2, §3).
3. **Music sync is played *against* the beat, not just on it.**
   The craft examples delay a cut by a beat, stretch an element
   across a bar line, and land drawings 2–3 frames *before* a
   sound accent so the hit reads on the sound (DOCS — §4).
4. **Our gap was artefacts and gates, not software.** The
   x-sheet tool the house already chose (Tahoma2D) is installed
   and runs headless on this machine (MEASURED, §5). What was
   missing: a beat map for any scored piece (gap 18), charts
   designed above the floor, and a checker mode that verifies a
   clip against its chart. All three are now wired (§6).

## 2. Timing modulation craft — where the bursts are spent

- **Framerate modulation is the core technique.** Anime timing
  moves between 6, 8, 12, and rarely 24 drawings/sec *inside the
  same scene*, choosing the rate per motion: the popularised
  practice traces to Yasuo Otsuka (Toei/Ghibli). The worked
  comparison in the AniGamers survey: two Dragon Ball Z fights
  between the same characters — one modulated across fours,
  threes, twos and occasional ones (rugged, tense), one mostly
  twos-and-ones (smoother, cleaner, arguably less intense). The
  modulated one is not "lower quality"; the modulation *is* the
  expression. (DOCS — AniGamers, "The 12 Principles of Anime".)
- **The Natwick principle (via Richard Williams):** more
  drawings in the same span reads smoother *and slower*; fewer
  reads choppier *and faster*. Rate is a speed/expression dial,
  which is why a single uniform rate — our v2 gag's defect —
  can neither hurry nor settle. (DOCS — same survey.)
- **The Maenami pattern (Pokémon 2019 OP, Takeshi Maenami's
  cuts):** "control the rhythm of a scene with a low frame-count
  through a smart modulation of the poses — often inserting a
  large number of different key-poses but a low number of
  drawings in the middle of the action, and then slowing down
  once the main motion is completed, with more frames but a
  single pose." Translated into a design rule: **key-pose
  density + sparse middles + a settled single-pose tail** beats
  uniform density at the same drawing budget. This is the exact
  shape of the Phase P re-time (§6): two accent bursts of
  1-frame poses bought by a 12-frame settled hold. (DOCS —
  artist_unknown, "Sakuga Week in Review #5", 2019-11-26,
  scene-specific analysis of Pokémon 2019 Opening #1.)
- **Where ones are spent in that OP:** impact and anticipation
  moments are carried by smearing with thinner contours;
  expression changes in the Ichiishi cut land *on the lyrics*;
  the heavy Pokémon are given no weight control where the light
  ones get full control — accent spend follows story weight,
  not screen time. (DOCS — same.)
- **Pose-to-pose vs straight-ahead is a personality choice,**
  not a quality ladder: roughly the same frame rate produces
  radically different personalities depending on process (Iso's
  "full limited" observation). Our drawn-space method
  (pose-to-pose, contacts first) is the right process; what it
  lacked was the timing layer's modulation, now charted.
  (DOCS — AniGamers survey.)

## 3. Walk-cycle richness beyond the grid

- **Secondary motion is timed, not decorative:** follow-through
  and overlapping action (parts stopping at different times)
  keep near-constant perceived motion over a held drawing
  budget; hair/props lagging the body is the standard carrier
  (the Izetta example: hair whipping carries anger over
  voice-driven facial acting). House form: twintails/sprout/
  tail-flame/smoke lag rows belong in every cycle chart — the
  gag chart set carries them as per-species grammar (gap 14's
  timing half). (DOCS — AniGamers survey; house application.)
- **Anticipation and settle at cycle level:** a cycle that only
  loops reads mechanical; the production cycle punctuation is
  anticipation before the effort and settle after it — in the
  gag chart set: Mochiko's skip anticipation (6 f) → held air
  (14 f) → contact on the strong pulse; the line-wide bell
  freeze (8 f) → release burst. (DOCS principle — AniGamers
  anticipation/follow-through sections; house chart, §6.)
- **Slow-in/slow-out at pose level:** bunching exposures at the
  ends of a motion makes poses stick out and motion snap —
  charted as exposure patterns like [6,4,5,5] (Sproutle's
  waddle lilt) instead of uniform [5,5,5,5]. (DOCS — AniGamers
  survey; house chart.)
- **The cycle is a character dial:** in the reference-ED study,
  personality lives in the walk chart (cycle length, posture,
  arm swing), not in fluidity — which is why the gag chart set
  gives each species a *different* exposure grammar and phase
  instead of one grid for five walkers (the v2 defect).
  (DOCS — YU-YU-HAKUSHO-ENDING-STUDY.md, this folder.)

## 4. Music-synced accent placement

- **Cutting on the beat is the easy part; the craft is playing
  with the rhythm.** In the Shuumatsu Train OP analysis: the
  last train-wipe is *delayed by a beat* at the end of the bar
  as the vocal drops out, then *lasts two beats spanning the
  next bar*, imitating how the vocal phrase itself spans two
  bars; tunnel-light occlusions land on specific rhythmic
  figures (DA-da vs DADA-da). Rule for our charts: accents land
  on named bed events (the bell rule, TIMING-STANDARD §7), and
  *one* placed near-miss (a delayed or spanning accent) per
  sequence is a legitimate charted device — an uncharted one is
  drift. (DOCS — artist_unknown, "OPfest: Spring 2024".)
- **Drawings precede the sound they hit.** In the Blair
  production tradition (bar sheets/exposure sheets): for a
  drawing to read in sync with a sound accent, the drawing is
  exposed two or three frames *before* the sound. Charted
  accents therefore aim their *change* at the event frame with
  the understanding that ±2 frames is the sync window — which
  is exactly the conformance tolerance the checker now uses
  (`verify_proof.py --chart`, default ±2). (DOCS — Preston
  Blair, *Cartoon Animation*, bar-sheet practice; the copy
  consulted is a third-party re-hosted scan, cited cautiously
  and used only for this one well-attested production point.)
- **OP/ED are directed as their own pitched sequences,** with
  iteration budget spent on retakes to push cuts further, a
  colour script from an early stage, and animators matched to
  cuts they'll excel at (Bahi JD interview, ATOM: The
  Beginning OP+ ED). For our ED: the gag is a directed piece
  with its own chart set and its own proof gate — not filler
  timed with leftovers. (DOCS — Sakuga Blog interview,
  2017-04-25, primary interview.)
- **Beat maps are the enabling artefact.** None of the above is
  chartable without the bed's grid measured first. The EP01 ED
  bed's map is now landed (144.0 pulses/min; bell at exactly
  ED 60.000 s, template-verified) — see
  `show/episodes/EP01/timing/EP01-ED-BEAT-MAP.md`. (MEASURED.)

## 5. Pull-in candidates — assessed

| Candidate | What it is | Licence (verified) | Decision |
|---|---|---|---|
| **Tahoma2D 1.6.3** (x-sheet / puppet home) | The house's already-chosen x-sheet tool: one xsheet per scene, columns = levels, rows = frames; headless render via `tcomposer` (TIMING-SYSTEM §2.4 wiring) | BSD 3-Clause (licence file at source; verified in PR #479 and re-confirmed at the repo LICENSE this pass) | **ALREADY INSTALLED + SMOKE-TESTED this pass.** Found under `~/opt/tools/portable/tahoma2d/` (436 MB incl. bundled ffmpeg/rhubarb) with the launcher at `~/opt/bin/tahoma2d` — an earlier lane's install. Smoke test: the AppImage's extracted `tcomposer` runs headless and prints its full CLI (`Tahoma2D v1.6.3`; usage incl. `-range`, `-step`, render options) — the headless x-sheet render path TIMING-SYSTEM specifies is real on this machine. No new download was needed or made. |
| **OpenToonz** (upstream x-sheet reference) | Tahoma2D's upstream; its official documentation is the x-sheet reference we cite (columns = layers, rows = frames; libraries store decomposed characters, turnarounds, and *reference animations such as walk cycles* for reuse) | BSD 3-Clause (verified PR #479) | **REGISTERED, not installed** — Tahoma2D (its fork) is the house lane and is installed; a second x-sheet engine adds no capability this programme needs. Its documentation's library pattern is adopted for the pose bank (below). |
| **Pose/expression bank pattern** (not a download) | Banked cycle/pose libraries: characters decomposed into levels with turnaround models and reference animations stored for reuse across scenes (OpenToonz production-workflow documentation); house form: the AMB cycle catalogue + bank cuts in TIMING-SYSTEM Parts 1–3 | n/a (pattern) | **ADOPTED as pattern.** The gag chart set is written to be banked: per-species gait grammars with named drawings are the seed of the show's pose bank. Building the bank itself (drawn pose sets per species) rides the gag rebuild, which is owner-gated (Gate 8 + profile call) — stated, not smuggled into this programme. |
| Synfig | Vector tweening animation | GPL-3.0 | **Rejected** (as in PR #479): duplicates the Tahoma2D lane; tweening-first workflow manufactures the interpolation signature on cel material. |
| CACANi | Auto-inbetweening | Paid | **Rejected:** paid (PR #479). |
| RIFE / FILM for cel layers | Frame interpolation | MIT / Apache-2.0 | **Rejected for cel layers** (PR #479, AnimeInterp evidence): interpolation on flat cel colour manufactures the FAILED-class signature. Existing repo RIFE stays scoped to non-cel uses. |

**Net pull-in result, plainly:** no new software was downloaded
in this programme, because the assessment found the needed tool
already installed and the actual gaps were artefacts (a beat
map, above-floor charts) and a gate (chart conformance) — all
three now wired into the repo. Registering that honestly is the
licence/pricing-honesty law applied to pull-ins: a pull-in is
not a download count.

## 6. What was wired (this programme, measured)

1. **ED beat map** — `show/episodes/EP01/timing/EP01-ED-BEAT-MAP.json`
   + `.md`. The EP01 ED bed verified by hash first
   (sha256 48552587…), then measured: 144.0 pulses/min, phase
   0.009 s; grid-fit score 4.592 on the finished bed, 6.821 on
   the menu stem alone. The bell at ED 60 s: builder code places
   it at exactly 60.0 s, and template correlation of the
   finished bed against the actual bell sample **peaks at
   exactly 60.00000 s, rank 1** in a 55–65 s window (raw mix:
   same, fitted scale −23.7 dB vs the −21 dB placement).
   Gap 18's first artefact: closed.
2. **Gag above-floor chart set** —
   `EP01-ED-GAG-ABOVE-FLOOR-CHART.json` + `.md` (same folder).
   169 charted drawing-change frames / 336 = **12.07/sec** of
   structure (credits floor: 8); line speed of record 160 px/s
   derived from the drawn stride; spacing table; contacts on
   strong pulses; personality beats held 12–28 frames (gap 19
   floor: ≥ 12); the bell accent at gag frame 96 with an
   8-frame composed freeze and a 5-character release.
3. **Checker v2 — chart-conformance mode** —
   `show/production/tooling/proof-gate/verify_proof.py` gains
   `--chart`: accents/contacts answered within ±2 frames, line
   holds empty of changes, segment-boundary coverage, deviations
   by frame number. Tested: the Phase P proof passes with
   **0 deviations**; synthetic misplacements (an accent moved
   into a hold; a hold shifted over real changes) are caught
   and reported by frame; the no-chart path is unchanged
   (regression: v6 in-place still reads 8.0/sec).
4. **Phase P proof** — the v6 walk's own 8 drawings re-timed
   under a charted modulation design (settle-in 6 f, cycles on
   2–3 f, two accent bursts on 1 s, a 12 f settled hold), no new
   art. Measured by the checker: **10.0 new drawings/sec**
   (before: 8.0, uniform), **7 one-frame accent spans** at the
   charted burst frames, **uniform-rate flag clear**,
   conformance **0 deviations**. Clip + chart + checker output
   in the workspace programme folder (`~/workspace/above-the-floor/proof/`);
   the chart and the run record are landed in the repo.
5. **Registry v1.2** — `METHOD-REGISTRY.md`: v1.2 CURRENT /
   USABLE (adds the beat-map artefact requirement, the
   chart-conformance gate, above-floor design targets); v1.1
   re-marked superseded-as-standalone, text preserved.

## 7. Honest remainder (in numbers)

- **The gag itself is still below the floor.** Current build
  v2: 7.786 drawings/sec + uniform-rate flag. Against the new
  chart it records 1 conformance deviation (no bell freeze) and
  0.9763 boundary coverage — placement was never its deepest
  problem; rate and modulation are, and only a rebuild fixes
  them. **The rebuild is gated on the owner's Gate-8 verdict on
  the v6 walk proof and the profile call** — both still open.
  This programme built the rebuild's input and its gate, and
  did not start the rebuild.
- **Scene production is still unproven.** Storyboard Draft 1's
  excerpt stands at 1.961 drawings/sec (FAILED class). The
  scene register (12/sec floor) has a wired checker and a
  chart format now, but no scene has been produced under them;
  the EP01 generative backend remains WIRED, UNPROVEN (its
  proof frames were still stranded behind the host's rate
  limit at this programme's start). Nothing in this document
  upgrades that status.
- **One beat map exists** (the ED bed). TIMING-STANDARD §7
  requires one per scored piece; the scene beds' maps are
  future artefacts, produced the same way (hash first, grid
  fit, template spot-checks) when those pieces are charted.
- **The pose bank is a pattern, not a bank.** Per-species drawn
  pose sets do not exist yet beyond the v6 Mochiko set; they
  are rebuild work, owner-gated with it.
