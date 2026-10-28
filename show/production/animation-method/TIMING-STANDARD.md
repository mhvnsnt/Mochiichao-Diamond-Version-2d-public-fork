# TIMING STANDARD — the bar for how the show moves

**Status:** CURRENT — part of Industry Method v1.1 (see
METHOD-REGISTRY.md). Landed 2026-10-28 by the "THE BAR" programme.
**Scope:** all show animation — scenes, cycles, the ending-credits
gag, marketing cuts. The game lane's sprite timing files are not
governed by this document.

## 0. The owner's goal, in his terms — read this first

The point of this whole stack is to **skip the manual animation
step and get the show made faster at Pokémon TV standard**: more
movement, more real-cartoon feel, a higher frame-rate feel on
screen. Speed comes from the tooling and from doing it correctly in
one pass — **never from reduced on-screen motion.**

TV-anime industry standard is the **lowest acceptable bar**, not
the target. We reach it, then go beyond it (§10).

Two things are **below-bar defects**, named here so they can never
be mistaken for the standard:

1. **Uniform low-rate output** — a clip whose drawing rate never
   modulates: the same hold length from first frame to last, no
   accents, no contrast. That is not "efficient TV timing"; TV
   timing modulates by design (§4).
2. **Smooth interpolation** — every frame slightly different, no
   drawn holds at all: the signature of the rejected v1 gag build.
   It reads as morphing, not as drawn animation, no matter how
   high its frame rate is.

A third below-bar class is **pacing failure** (§8): the owner
named the rejected 24-minute storyboard draft's core failure
precisely — *"every beat and every frame is held for so long it
could never keep anyone's interest… you made me want to look away
before it even got the chance to hook"* — and called it the
biggest mistake. **Attention is a production criterion.** A
technically complete file that loses the viewer in the first
seconds is a failed deliverable regardless of its other gates.

## 1. Units — the owner's unit, and the headline floors

This production measures timing in **new drawings per second** —
how many *distinct authored drawings* the viewer actually gets
each second. That is the headline unit of this standard, of every
chart, and of the checker (§11). The master timeline runs at
24 frames per second; what varies is how many genuinely new
drawings land inside each second of it.

**The floors (headline — drawings per second only):**

| Register / moment | Floor |
|---|---|
| Ending-credits / chibi register | **8 new drawings/sec** |
| Scene body, in moving passages | **12 new drawings/sec** |
| Action accents / impacts | **24 new drawings/sec** |
| **FAILED class** | **at or below ~3 new drawings/sec** — the storyboard signature (§8) |

A low drawings-per-second figure is a failure signature, never
an achievement and never a style. Our delivered draft work ran
at roughly 1–2 new drawings/sec in measured passages (§8, §11) —
that is the failure this standard exists to end, stated in the
owner's unit so it can never be dressed up again.

*Vocabulary, defined once and used nowhere else as a headline:*
at the 24 fps master, a drawing held for 3 frames yields 8 new
drawings/sec (the industry's term is "on threes"), held for
2 frames yields 12/sec ("on twos"), and a new drawing every
frame yields 24/sec ("on ones" — full animation, the **most**
work there is, not the least). The savings in TV production come
from *choosing* where drawings go (holds, banks, modulation);
the on-screen result is *more* deliberate movement, not less.
Any reading of this standard as "lower rate = cheaper =
acceptable" is the exact misreading this section exists to kill.

## 2. Audit — what timing machinery already existed (2026-10-28)

Claims below are scoped to files actually read for this programme.

**Already real in the repo:**

- `show/production/TIMING-SYSTEM.md` (13,032 B on main) — the
  house exposure-sheet (x-sheet) format: rows are frames, columns
  are levels/drawings, an audio column filled **first**
  (dialogue-first production), hold/segment notation, cycle and
  bank notation, a camera column, cycle-bank rules, and a Tahoma2D
  wiring section (one x-sheet = one `.tnz` scene, headless render
  via `tcomposer`). Its Part 3 economy rules already state the
  scene default in the owner's unit: character motion mostly at
  12 new drawings/sec, with 24 drawings/sec spent on action beats
  and camera-critical motion. **This standard does not replace
  that document** — it is the chart format; this standard is the
  bar the charts must hit.
- One filled chart exists: `show/episodes/EP01/timing/
  XSHEET-EP01-SCENE-04.md` (64 seconds = 1,536 frames, 6 cuts) —
  with real modulation written in (e.g. a lunge charted as a
  wind-up at 12 drawings/sec, the lunge itself at 24 drawings/sec,
  recovery back at 12 drawings/sec).
  Its own honesty flag F1 records that bed-event labels drift a
  few seconds from board frame ranges — §7's rule exists because
  of flags like this. No other episode or scene chart was found.
- `show/production/tooling/avatar-stack/helpers/
  02_cue_sheet_adapter.py` — frame-based cue code (start/end/hold
  frames at 24 fps) for mouth shapes; a cue adapter, not a scene
  timing engine.
- Method CORRECTED-METHOD.md §4 — the timing law this standard
  extends: 24 fps master; walk tempos locked to fixed frame counts
  per beat; holds are held *parts* with moving holds (breath,
  blink every 3–5 s, weight shift), never whole-body sway or
  whole-sprite transforms; no blanket interpolation (only where a
  timing chart marks it); mouth substitutions on held shapes,
  audio leading picture by 1 frame. §5's gates are drawn-space
  gates (contact, stick, silhouette) — **no timing-profile gate
  existed** before this programme; §11's checker is that gate's
  measuring tool.
- `show/episodes/EP01/CUE-SHEET.md` is a music/SFX cue list, not
  a timing sheet; the name collision is noted so nobody files a
  chart there.

**Workspace-only, now landed by this programme:**

- The proof-gate verifier (`verify_proof.py` + PROOF-GATE.md)
  existed only at `~/workspace/ep01-rebuild/proof-gate/` — it was
  **not in the repo** (zero hits in the full main tree listing).
  Its frame-diff metric (all consecutive pairs, grayscale) is the
  calibration base the checker extends. The extended checker is
  landed at `show/production/tooling/proof-gate/verify_proof.py`
  (§11); the workspace PROOF-GATE.md stays workspace bookkeeping
  and was not landed, because its status text is stale lane
  bookkeeping, not production law.

**Not in the repo:** ED-GAG-FORMAT.md (its PR is still open; gag
timing law currently lives in the method documents and the
ending study). Game-side sprite idle-timing JSONs exist in the
tree but are the game lane's, out of this standard's scope.

**Gaps the Pokémon production-spec research names that this
standard answers:** no per-shot timing charts beyond one example
(§6), no beat map for music sync (§7), no pacing discipline (§8),
no measured timing profile on any delivered clip (§11). Gaps it
does **not** close are listed honestly in §13.

## 3. Registers — which rate leads, where

A **register** is a passage's declared timing character, written
on its chart before production. Registers modulate *within*
themselves (§4); a register is a centre of gravity, not a uniform
rate.

### 3.1 Scene register (the show's default)

- Body motion drawn **mostly at 12 new drawings/sec**.
- **Calm passages** may centre on **8 new drawings/sec**.
- **Action accents and impacts** run at **24 new drawings/sec**,
  in short bursts — the research report's guidance is impact
  passages at full rate for **at most ~4–8 frames** (report §10,
  guidance grade).
- **Mouth shapes change at 12 changes/sec**, in the 3-shape
  system (closed / half / open), fitted *after* the voice
  recording, per the spec's afureko order (voice first, flaps
  fitted to it).
- Battle grammar per the spec: an anticipation hold → smears at
  24 or 12 drawings/sec → an impact frame held 1–3 frames → a
  held aftermath. The hold after the hit is part of the move's
  read.

### 3.2 Ending-credits / chibi register (the owner's exception)

- The ending-credits gag and chibi devices are **led by 8 new
  drawings/sec** — walk cycles at 8 drawings/sec with accents at
  12 drawings/sec where the chart calls for them.
- This is the **credits exception the owner himself ruled**
  (registry: an ED piece may take less work and a lower drawing
  rate, never a lower standard). It is **not** the show's scene
  default, and it must never be quoted as one.

### 3.3 What no register permits

- A whole scene or gag at one unmodulated rate with no chart
  reason (§4, §8).
- Whole-sprite transforms (bob/tilt/zoom of a still) presented as
  animation at any rate — rejected twice by the owner; the
  storyboard draft built that way is Storyboard Draft 1, not the
  episode.
- Interpolation-generated in-betweens on character cel layers
  (§12: the interpolation tools are rejected for cel layers on
  sourced evidence, and §0 names the profile a below-bar defect).

## 4. Framerate modulation is a chart choice, never an accident

TV timing works because the rate **changes on purpose**: calm
passages at 8 drawings/sec, standard motion at 12 drawings/sec,
a burst at 24 drawings/sec for the hit, a composed hold for the
read. The *contrast* is what the eye reads as life and weight.

Rules:

1. Every cycle and every shot carries a written timing chart (§6)
   that states its rate changes. A rate that never changes because
   nobody chose anything is a defect, not a style.
2. The checker (§11) flags both below-bar signatures from §0:
   **interpolation profile** (almost every span is 1 frame long
   and almost no frame pairs are near-identical — continuous
   morph, no drawn holds) and **uniform unmodulated rate** (scene-
   length material whose modal hold length covers ≥95% of spans
   with zero 1-frame accents). Flags are diagnostics for a
   reviewer; grading a clip remains the owner's/scorer's call
   (correct character performing the action, or FAIL).
3. Short cycle loops (under ~4 seconds) are exempt from the
   uniform-rate flag by construction — a walk cycle *is* one
   rate; uniformity is judged at scene/instance scale, where the
   chart had room to modulate.

## 5. Holds — composed, moving, and capped

Holds are grammar, not defects — the spec's episodes hold poses,
reuse bank sequences (throws, evolutions, attacks), and let
frames sit. What separates a hold from dead air is that the hold
is **composed and charted**:

1. A hold is a held *drawing with moving parts*: breath, a blink
   (every 3–5 seconds), weight shift, hair/cloth settle, camera
   or light still travelling. A whole-frame freeze while the
   scene claims life is not a hold; it is §8 dead air.
2. **Hold cap (house rule, derived from the spec's grammar):** in
   scene-register work, any single drawing held longer than
   **24 frames (1 second)** while the shot claims action or
   dialogue must be a **written dramatic choice on the chart**
   (named as a composed dramatic hold, with its moving parts
   listed). Uncharted long holds are defects by default.
3. Bank material (reused lavish sequences) is charted as bank
   (`BANK:<id>` notation in the chart format), never smuggled in
   as new drawings and never counted toward a scene's new-drawing
   volume.

## 6. Exposure / timing charts — required, per cycle and per shot

1. No cycle is built and no shot is produced without its timing
   chart, in the house format (`show/production/TIMING-SYSTEM.md`:
   one chart = one scene file; rows are frames at the 24 fps
   master; audio column first).
2. A chart states, per cut: frame range, register (§3), the rate
   segments in the units of §1, holds with their moving parts
   (§5), bank references, camera moves, and the beat-map reference
   (§7) where music runs under the cut.
3. The one filled example of record is
   `show/episodes/EP01/timing/XSHEET-EP01-SCENE-04.md`. Every
   other scene of EP01 and every later episode currently has **no
   filled chart** — that is an open obligation (§13), not a
   detail.

## 7. Beat-grid sync — music is measured, not asserted

(Addendum-2 gap 18: ED music beat sync was asserted, never
measured. This section is the fix's specification.)

1. Every scored piece used under animation gets a **beat map**
   filed beside its chart: tempo, beat frame numbers at the
   24 fps master, and the accent beats the animation must hit.
2. Contact frames and accent frames are **measured against the
   beat map** (frame offsets recorded on the chart), not aligned
   by ear in assembly.
3. Known live examples of the failure this prevents: the EP01
   Scene-04 chart's own flag F1 (bed labels drifting seconds from
   board frames), and the ED gag's bell landing at gag second 4
   where its chart has nothing.
4. **Honest state:** no beat map file exists yet for any piece,
   including the EP01 ED bed. The rule is wired; the first beat
   map is still owed (§13).

## 8. Pacing — attention is a production criterion

The owner's verdict on the rejected draft, and the numbers that
prove it, set this section.

**The bar (sourced):** the Pokémon production report ( producer
Hiroyuki Kato, OLM, via Anime World Network / Celsys, 2019 —
verified-open primary source) puts a Pokémon episode at **300+
cuts and 4,000–5,000 drawings** for roughly 21 minutes (1,260 s)
of story content. That is a **cut every ~4 seconds** on average.

**The below-bar fingerprint (measured):** Storyboard Draft 1 ran
**107 cuts across the same 1,260 s — one cut every ~11.8
seconds** — with near-zero change inside the cuts. The proof-gate
metric on a 60-second excerpt of it, re-measured with the landed
checker: **91.9% of consecutive frame pairs near-identical,
effective rate 1.96 new drawings/sec, longest near-static run
192 frames = 8.0 full seconds, and a rolling 10-second window
containing as few as 2 change events.** That is what losing the
viewer looks like as numbers.

Rules:

1. **Cut-rhythm planning happens on the chart** (§6): each
   episode's chart set carries a per-minute cut-density target
   derived from the spec's ~4-seconds-per-cut average, adjusted
   per scene register in writing. Rhythm is designed at board
   stage, never improvised in assembly.
2. **Hold caps** are §5's: past the cap, a hold is a charted
   dramatic choice or it is a defect.
3. **Change density:** within any rolling few seconds of scene
   footage, something *authored* must change — a drawing, the
   camera, the light, or the cut itself. The checker reports
   change events per 10 seconds and the minimum count in any
   rolling 10-second window; a window that approaches zero is
   dead air, and dead air is a defect.
4. **Hook rule:** the opening seconds of an episode — and of any
   scene that follows a cut to black or a location change — must
   contain movement or onset (a character already in motion, a
   camera travelling, an action beginning), **not a held plate**.
   The first impression is charted like everything else.

## 9. The sourced numbers that bind us

Each number carries its source and grade from the research report
(`~/workspace/research_notes/pokemon-tv-production-spec-gap-
analysis-20261028-1129/report.md`). Poorly sourced claims are
flagged, never quoted as fact.

| Number | Value | Source / grade |
|---|---|---|
| Master timeline | 24 frames/sec (one timesheet row per frame) | Kanzenshuu timesheet guide; Martin episode-format guide — DOCS, consistent |
| Scene default | Body mostly at 12 drawings/sec; calm passages at 8/sec; 24/sec reserved for fast action | Production I.G guide summary of TV practice — DOCS |
| Cuts per episode | **300+** | Hiroyuki Kato (OLM producer), AWN/Celsys report 2019 — verified-open primary |
| Drawings per episode | **4,000–5,000** (Pokémon); general modern TV anime 3,000–4,000, ~300 backgrounds | Kato via AWN/Celsys 2019 — verified-open primary; Kanzenshuu/Toei-derived — DOCS |
| Story content length | ≈21 min (1,260 s) of A+B parts inside a 22-min listed episode, OP/ED ≈90 s each | Martin guide — DOCS |
| Drawing growth | XY era (2013→) episodes use ~20–30% more drawings than Best Wishes era | Iwane interview, Animage Mar 2015 (Dogasu translation) — DOCS/press |
| Key-animation labour | One animator solo-keying a whole episode ≈1.5 months in rotation; drawing allotment is a literal budget line | Iwane interview — DOCS/press |
| Mouth system | 3 shapes (closed/half/open), changes at 12/sec, fitted after voice (afureko) | Production I.G / spec research — DOCS |
| Impact bursts | 24 drawings/sec for at most ~4–8 frames | Research report §10 — guidance grade |
| ⚠️ Fixed percentage split of ones/twos/threes across a Pokémon episode | **DO NOT QUOTE** — commonly repeated, poorly sourced; no OLM timesheet census exists | Research report's own flag |

Volume context, stated plainly: our storyboard draft's 107 cuts
against the spec's 300+ is the gap §8 exists to close. The
drawing counts bind us as *shape*, not as a quota to fake — a
Mochiichao episode earns its density from charted modulation,
bank, and composed holds, the same economy the spec describes.

## 10. Beyond the bar — what exceeding looks like for us

Meeting §3–§8 is the floor. Exceeding it, for this production:

1. **Timing contrast designed per scene**, not per template: each
   scene's chart names its contrast (where it breathes at
   8 drawings/sec, where it snaps to 24 drawings/sec), and the
   contrast is a storytelling choice a reviewer can point at.
2. **Personality in the timing**: per-character timing dials (a
   character's walk tempo, blink rhythm, anticipation length) are
   chart data, so the cast doesn't share one metronome.
3. **Music-synced accents as set pieces**: hits, bells, and cuts
   landed on measured beat frames (§7) at the moments the episode
   is built around — the spec's episodes do this with bank and
   OP/ED grammar; ours does it from the beat map.
4. **Proof before production**: no scene template scales to an
   episode until one gated proof scene passes the checker *and*
   the owner's eye — the standard's numbers never promote a clip
   by themselves.

## 11. The checker — timing profile + pacing, measured

**Tool:** `show/production/tooling/proof-gate/verify_proof.py`
(extended from the workspace proof-gate verifier; the original
frame-diff fields and verdict line are preserved — it reports
measurements and promotes nothing). Run record of the measurements
below: `show/production/tooling/proof-gate/
timing-profile-runs.json`.

**Headline output, per clip:** the clip's **measured effective
new drawings per second** (distinct authored drawings/sec,
derived from the span structure below — not raw frame-diff
noise), with its class printed plainly:

- **at or below ~3 new drawings/sec → FAILED class** (the
  storyboard signature);
- **interpolation signature → FAILED class** (its per-frame
  changes are interpolation noise, not authored drawings,
  however high the raw change count runs);
- **below the declared register's floor → BELOW BAR** (floors:
  scene 12/sec, credits 8/sec, per §1).

**What it measures** (all consecutive frame pairs, native
resolution, grayscale; a pair counts as a *change* at the
verifier's own 0.5 threshold on its 0–255 scale; every rate it
prints is in **new drawings per second**):

- hold-length distribution and span list (a span = one drawing's
  run of frames);
- **effective new drawings per second** (spans ÷ duration) — the
  headline above;
- grid fit for the 8-drawings/sec grid, absolute and best-phase
  (a real grid can sit at a constant phase offset from frame 0;
  the best-phase fit finds it);
- longest hold, and longest *internal* hold (touching neither
  edge — the mid-action freeze detector);
- accent candidates (isolated 1-frame spans) — **meaningful only
  in held material**; in continuously changing footage the count
  saturates and says nothing;
- sub-threshold drift pairs (motion under the change threshold);
- **below-bar flags** (§4): interpolation profile, uniform
  unmodulated rate;
- **pacing** (§8): longest near-static run (frames and seconds,
  and where it starts), change events per 10 seconds, and the
  minimum change events in any rolling 10-second window.

**Measured runs (2026-10-28, this programme):**

| Clip (register) | Duration | **HEADLINE: new drawings/sec** | Class | Grid fit (8/sec grid) | Flags | Longest near-static run | Changes / 10 s (min window) |
|---|---|---|---|---|---|---|---|
| v6 industry walk, in place (credits) | 3.0 s | **8.0 /sec** | at the credits floor | 1.000 (phase 0) | none | 3 frames (0.12 s) | 76.7 (n/a, <10 s) |
| v6 industry walk, travelling (credits) | 2.0 s | **8.0 /sec** | at the credits floor | 1.000 (phase 0) | none | 3 frames (0.12 s) | 75.0 (n/a, <10 s) |
| ED gag v2 (credits) | 14.0 s | **7.79 /sec** | **BELOW BAR — under the 8/sec credits floor** | 0.944 (phase 2) | **uniform unmodulated rate** | 10 frames (0.42 s) | 77.1 (min 77) |
| ED gag v1, rejected build (credits) | 14.0 s | 22.43 /sec raw change rate | **FAILED class — interpolation signature** (the 22.43 is noise, not drawings) | 0.336 (no grid) | **interpolation profile** | 13 frames (0.54 s) | 223.6 (min 228) |
| Storyboard Draft 1 excerpt, 60 s (scene) | 60.2 s | **1.96 /sec** | **FAILED class — storyboard signature** | 0.350 (no grid) | — (pacing failure, §8) | **192 frames (8.0 s)** | **19.5 (min 2)** |

How to read this table:

- The v6 proof walks sit **exactly at the credits floor**:
  8.0 new drawings/sec, perfect grid, no flags. They are
  2–3-second loops; the uniform-rate flag does not apply at that
  scale (§4 rule 3), and their pacing numbers describe a cycle,
  not a scene.
- Gag v2 carries **two honest findings**. Its grid is real but
  phase-shifted (best-phase fit 0.944 at offset 2; the absolute
  fit against frame 0 is 0.0 — the reason the checker reports
  best-phase). And its headline lands at **7.79 new drawings/sec
  — below the 8/sec credits floor** (a 10-frame opening hold and
  two longer holds drag the average under), with the
  **uniform-rate flag** on top: across 14 seconds the rate never
  modulates and there are no accents. Under this standard the
  next gag build must chart modulation and accents in and hold
  the floor, even inside the credits register.
- Gag v1 is **FAILED class**: the interpolation signature exactly
  as §0 names it — no drawn holds, no grid, a raw change rate of
  22.4/sec that is interpolation noise, not authored drawings.
  Its high change count is *not* pacing health — pacing and
  profile are read together.
- The storyboard excerpt is **FAILED class** at 1.96 new
  drawings/sec, and the pacing failure in numbers (§8): an
  8-second near-static run and 10-second windows with as few as
  2 changes. Its defect is the opposite of v1's — and the
  checker now catches both directions.

**Checker limits (stated, not hidden):** it measures the whole
clip, not per-character or per-layer timing; it does **not**
detect smear devices or verify the chart format's smear-bracket
frame-diff gate; accent candidates saturate in unheld footage;
and it never passes or fails a clip — it reports, reviewers and
the owner grade.

## 12. Pull-ins — what was taken, what was not, and why

Licences verified at source during this programme (licence file
or repository API), 2026-10-28.

**Landed in this PR:**

- The timing-profile + pacing checker (§11) and the chart
  discipline of §6–§8. The chart's house form already existed
  (`show/production/TIMING-SYSTEM.md`); this standard references
  it rather than duplicating it. No external code was needed to
  close the measuring gap — the gap was a missing gate, and the
  gate is now wired into the repo's tooling tree.

**Registered, not downloaded (staging law — nothing bulk-downloads
to local disk under this programme):**

- **Tahoma2D** — open source, **BSD 3-Clause** (licence file in
  tahoma2d/tahoma2d). Already the house puppet home per
  TIMING-SYSTEM.md's wiring section, and the natural place an
  x-sheet becomes a scene. Any install or upgrade rides the
  existing tooling manifests, not this document.
- **OpenToonz** — open source, **BSD 3-Clause** (licence file in
  opentoonz/opentoonz). Upstream reference for the x-sheet model;
  registered for the same route as Tahoma2D.

**Evaluated, not pulled:**

- **Synfig** — open source, **GPL-3.0**. Deterministic puppet
  tweening with a real timing model, but it duplicates the house
  Tahoma2D lane today. Revisit only if a puppet-tweening gap
  actually opens.

**Rejected for character cel layers:**

- **RIFE (Practical-RIFE)** — open source, **MIT** — and **FILM**
  (Google frame interpolation) — open source, **Apache-2.0**.
  Both are natural-video interpolators. The research base
  (AnimeInterp, CVPR 2021, cited in the spec report) shows
  natural-video interpolation failing on exactly our material —
  flat, textureless cel colour and large non-linear motion — and
  any interpolation on cel layers manufactures the §0
  interpolation signature this standard names below-bar. Existing
  repo RIFE material stays scoped to non-cel uses; neither tool
  is pulled for character layers.

**Rejected outright:**

- **CACANi** — paid proprietary. Not pulled; listed here so the
  evaluation is on record.
- **Storyboarder** — licence unverifiable at source (repository
  reports no licence). Not pulled.
- **ToonCrafter** — generative interpolation; research-ceiling
  specs (≤16 frames at 512×320, per secondary sources) and the
  likeness-drift risk class this production has already burned
  itself on. Not pulled.
- **EbSynth** — not open source (freeware). Not pulled.

## 13. Honest remainder — specced here, not yet wired

Named plainly, per the wiring law:

1. **No beat map exists yet** for any scored piece (§7's rule is
   wired; its first artefact is owed, starting with the EP01 ED
   bed — addendum-2 gap 18 stays open until it lands).
2. **Only one filled timing chart exists** in the repo (EP01
   Scene 04). §6 makes charts mandatory; producing the rest is
   production work this programme specifies but does not do.
3. **The checker does not implement** the chart format's
   smear-bracket frame-diff gate (TIMING-SYSTEM.md §2.3), does
   not measure per-character/per-layer timing, and does not
   re-measure the line-speed law (addendum-2 gap 12) or the
   beat-readability floor (gap 19) in composited frames. Those
   remain addendum-2 obligations with gates specified there.
4. **Gag v2's two findings** (§11 — below the credits floor at
   7.79 new drawings/sec, and the uniform-rate flag) stand
   against the current gag build under this standard; fixing the
   build is the gag lane's work (this programme does not touch
   gag builds or episode files), and the owner's Gate-8 eye
   verdict on the v6 proof is still the decision that unlocks
   the rebuild.
5. The flags and pacing numbers are **diagnostics**. Nothing in
   this standard or its checker promotes a clip; the grading law
   stands — correct character performing the action, or FAIL,
   decided by the owner/scorer.
