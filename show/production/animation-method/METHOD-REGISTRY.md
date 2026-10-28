# METHOD REGISTRY — which animation method is usable, right now

**READ THIS FIRST.** This file is the single place that says which
animation method is the usable one for the Mochiichao show. Before
building, rigging, or animating anything, an agent checks this
registry and uses the method marked **CURRENT / USABLE**. Using a
superseded method — silently, or because it was the one in an old
file — is a regression and an error, the same class as building on
a superseded asset under the current-version law.

---

## ⬛ CURRENT / USABLE METHOD

### The Industry Method — v1.3 (2026-10-28)

- **The method:** the Industry Method v1.2 (construction core +
  timing layer + above-floor layer + the likeness gate, folded in
  unchanged, below) **plus the generated-turnaround route** for
  generated character animation:
  `GENERATED-TURNAROUND-PIPELINE.md` in this folder. The route:
  DIAGNOSE (the 20-point structural defect audit run as data
  against the input art) → TURNAROUND (a corrected multi-angle
  sheet generated under a design-inventory prompt built from the
  character's canon record) → ANIMATE (image-to-video from the
  corrected sheet's side-profile cell, on the landed scene-job
  format v2 and its wired path) → EXPORT (frame slicing +
  sprite-sheet packing for game use) → GATES (frame-1 check,
  timing profile, likeness against the corrected sheet, grading
  law, and a diagnosis re-run of the finished frames).
- **Currency, per use (upgrade rule 3 — the standing assignment,
  written here so it is never a quiet fallback):** for GENERATED
  character animation, the v1.3 turnaround route is the
  CURRENT / USABLE method. For DRAWN proofs (part-separated
  puppets, substitution drawings), v1.2's drawn route remains
  CURRENT for that use — it is not superseded there; the two
  routes serve different production kinds and neither substitutes
  for the other.
- **What is wired vs spec, stated up front:** the animate step
  runs on the landed scene-job format v2; the diagnosis checklist
  ships as data on the parity lane's wired Qwen2.5-VL contract
  (first dedicated diagnosis run still owed); the export packer
  is landed working code with a passing self-test. The
  TURNAROUND generation step itself is SPEC: the landed format
  has no image-to-image job type and no driver consumes one —
  the gap is flagged in the pipeline doc and inside the emitted
  job. The free generation stack's likeness status remains
  UNPROVEN (the baseline plain-I2V FAIL stands); v1.3 adopts the
  route as the method of record on the owner's order and does
  not upgrade that proof claim.
- **Standing gates unchanged:** the timing standard and the
  likeness gate apply to generated clips exactly as to drawn
  ones, including the delivery requirement (likeness judgment
  stated before any measured axis). Gate 8 (the owner's eye)
  remains the final gate, and the grading law stands: wrong
  character = FAIL, full stop.
- **The evidence for the route:** the owner's reference clip
  (2026-10-28; generated on Google's hosted endpoint — PAID,
  recorded as paid; reference evidence only, not canon, not a
  deliverable): a true profile walk generated from Mochiko's
  front canon art, passing the 20-point audit's view items,
  with its design deviations recorded (single ponytail vs canon
  twin tails; jar contents morphing; line thinner than canon).
  Full measured record: the pipeline doc's REFERENCE BAR
  section. The route's own first gated run is still owed.
- **Supersedes:** the Industry Method v1.2 **as the standalone
  current entry** — v1.2 is folded into v1.3 unchanged; its
  drawn route carries the per-use currency stated above.

## ⬛ SUPERSEDED — DO NOT USE

### The Industry Method — v1.2 (2026-10-28)

**Re-marked 2026-10-28, at the v1.3 landing:** v1.2 is folded
into v1.3 as its construction + timing + above-floor core.
Standalone v1.2 is **DO NOT USE for generated character
animation** — that work runs the v1.3 turnaround route. Per the
per-use currency stated in the v1.3 block, v1.2's DRAWN route
remains the CURRENT route for drawn proofs: a written assignment
under upgrade rule 3, not a quiet fallback.


- **The method:** the Industry Method v1.1 (construction core +
  timing layer, below) **plus the above-floor layer**:
  `ABOVE-THE-FLOOR-RESEARCH.md` in this folder, and three wired
  requirements —
  1. **Beat maps are artefacts, not intentions.** A scored
     piece's timing chart cites a measured beat map of its actual
     bed. The first one is landed:
     `show/episodes/EP01/timing/EP01-ED-BEAT-MAP.json` (the EP01
     ED bed measured: 144.0 pulses/min, first pulse 0.009 s,
     10 frames per pulse at the 24 fps master; the distant bell
     at ED 60.000 s template-verified at exactly 60.00000 s,
     rank 1 — gap 18's first artefact, closed).
  2. **Chart-conformance is a gate.** Charts are written in
     `mochiichao/timing-chart/v1` and a rendered clip is checked
     against its chart with the checker
     (`verify_proof.py --chart`): charted accents and contacts
     answered within ±2 frames, charted line holds empty of
     changes, deviations reported by frame number. The checker
     still reports only; it never grades.
  3. **Design targets sit ABOVE the floors.** The floors in
     `TIMING-STANDARD.md` remain the minimum. Charted work is
     designed above them: the EP01 ED gag chart set
     (`show/episodes/EP01/timing/EP01-ED-GAG-ABOVE-FLOOR-CHART.json`)
     carries 169 drawing-change frames in 336 = **12.07
     drawing-changes/sec** of charted structure, personality
     beats held ≥ 0.5 s, contacts on the beat grid, and its
     largest accent on the bell (gag frame 96). A chart that
     merely reaches a floor is sent back at chart stage, before
     anything is drawn.
- **Standing delivery requirement — the likeness gate
  (added 2026-10-28; a gate addition under v1.2, not a new
  method version — see the change log).** No character clip
  is delivered to the owner without: (i) the canon
  reference's path + sha256 logged in the run record;
  (ii) a side-by-side comparison sheet produced, its path
  recorded in the same record; (iii) the delivery stating
  the likeness judgment in plain words **before** any
  measured axis (drawings/sec, conformance, anything else)
  is mentioned. The checker supports it:
  `verify_proof.py --likeness <canon-reference>` (in
  `show/production/tooling/proof-gate/`) reports per-frame
  similarity diagnostics against the reference and marks a
  run record without a recorded comparison sheet INCOMPLETE
  — a completeness state, never a grade: grading remains
  the owner's eye, and the grading law stands (wrong
  character = FAIL). Run record: `likeness-runs.json` beside
  the checker. Origin: Gap 15, activated — see the dated
  correction at Gap 15 in `WHAT-WE-DO-WRONG-ADDENDUM-2.md`.
- **The evidence:** the Phase P proof (2026-10-28) — the v6
  walk's own 8 drawings re-timed under a charted modulation
  design, no new art: **10.0 new drawings/sec** (was 8.0, exactly
  at the credits floor, one uniform hold pattern), **7 one-frame
  accent spans** at the charted burst frames, the
  uniform-unmodulated-rate flag **clear**, a charted 12-frame
  settled hold, and chart-conformance of **0 deviations**
  (accents 2/2, contacts 10/10, holds 2/2, boundary coverage
  1.0). The same checker run against the current gag v2 and the
  new gag chart records the baseline the rebuild must beat
  (1 deviation: no bell freeze; boundary coverage 0.9763 — and
  v2's own profile remains below floor at 7.786/sec with the
  uniform-rate flag). Run record:
  `show/production/tooling/proof-gate/timing-profile-runs.json`.
- **Why it is current:** owner order (2026-10-28, ABOVE THE
  FLOOR programme): everything measured at or below the floors
  gets pulled in and wired to go above and beyond them — the
  floor is not good enough — with research first
  (`ABOVE-THE-FLOOR-RESEARCH.md`: how productions exceed the
  floor at TV budgets, and where the bursts are spent).
- **Supersedes:** the Industry Method v1.1 **as a standalone
  entry** — v1.1's construction + timing core is folded into
  v1.2 unchanged; do not animate under v1.1 without its
  above-floor layer.
- **Standing gates unchanged:** Gate 8 (the owner's eye) and
  the profile model-sheet flag remain production gates. The
  gag rebuild itself has NOT started: it waits on Gate 8 and
  the profile call. v1.2's chart set is its input, not its
  start.

### The Industry Method — v1.1, standalone (2026-10-28)

**Re-marked 2026-10-28, at the v1.2 landing:** v1.1 is folded into
v1.2 as its construction + timing core. Used *without* the v1.2
above-floor layer (beat maps, chart-conformance, above-floor
design targets), v1.1 is **DO NOT USE** — a build can sit exactly
AT a floor under v1.1 and pass, which the owner has ruled is not
good enough: the floor is the minimum, not the target.


- **The method:** the Industry Method v1 (construction core,
  below) **plus the timing layer**: `TIMING-STANDARD.md` in this
  folder — the binding bar for how the show moves, stated in
  **new drawings per second** (the owner's unit): scene body
  floor 12 drawings/sec in moving passages, ending-credits floor
  8 drawings/sec, action accents at 24 drawings/sec, and at or
  below ~3 drawings/sec is the FAILED class. The timing layer
  adds: registers, framerate modulation as a written chart
  choice, composed and capped holds, a timing chart per cycle
  and per shot, beat-grid sync, and the pacing rules (cut
  rhythm, change density, the hook rule).
- **The checker (the timing layer is wired, not just written):**
  `show/production/tooling/proof-gate/verify_proof.py` measures
  every clip's headline effective new drawings per second and
  its class, its hold structure, its below-bar signature flags
  (interpolation profile; uniform unmodulated rate) and its
  pacing (longest near-static run, change events per 10 s). Its
  measured run record sits beside it
  (`timing-profile-runs.json`). It reports measurements only;
  grading a clip remains the owner's/scorer's call.
- **The evidence:** the checker's first run over the existing
  body of work (2026-10-28): the v6 industry walk proof measures
  exactly at the credits floor (8.0 drawings/sec, clean grid, no
  flags); gag v2 measures 7.79 drawings/sec — below the credits
  floor — with the uniform-rate flag; gag v1 is FAILED class
  (interpolation signature); the Storyboard Draft 1 excerpt is
  FAILED class at 1.96 drawings/sec with an 8.0-second
  near-static run. Full table: `TIMING-STANDARD.md` §11.
- **Why it is current:** owner order (2026-10-28, THE BAR
  programme): TV-anime industry standard is the lowest
  acceptable bar, and the timing layer is what makes that bar
  checkable instead of aspirational.
- **Supersedes:** the Industry Method v1 **as a standalone
  entry** — v1's construction method is folded into v1.1
  unchanged; do not animate under v1 without its timing layer.


### The Industry Method — v1, standalone (2026-10-28)

**Re-marked 2026-10-28, at the v1.1 landing:** v1 is folded into
v1.1 as its construction core. Used *without* the v1.1 timing
layer (`TIMING-STANDARD.md` + the timing checker), v1 is **DO
NOT USE** — a build can pass every v1 drawn gate and still fail
the bar on timing and pacing, which is exactly what the timing
layer exists to catch.

- **The method:** part-separated puppet construction (one drawing
  per body part, peg hierarchy, drawn-overlap joints, hair as its
  own part over the head) + substitution-drawing sets for every
  shape a deformer cannot honestly produce (legs/feet, hands,
  mouths, eyes) + cycles authored pose-to-pose, **contacts first**,
  on an exposure chart + travel **derived from the drawn stride** +
  all verification on the **rendered drawings**, never on the
  skeleton. Deformers are a garnish inside a part, never the
  structure.
- **The spec:** `CORRECTED-METHOD.md` in this folder, including
  Addendum §A (intake gate, joint inventory, frame-exact rendering,
  built chibi models, action coverage, defect disposition).
- **The evidence it works:** the Mochiko walk proof built under it
  (workspace `ep01-ed-gag/work/v6-industry/`) passed every drawn
  gate the old method failed: contact lift 0 at both contacts,
  support stick 0.0 px/slot, support in 8 of 8 poses with no flight,
  drawn knee fold in the pixels, silhouettes differing 28–40% per
  step. Gate 8 (the owner's eye) remains a standing production
  gate, and the profile model-sheet flag from that proof remains
  open — they are production gates the method itself requires.
- **Why it was current:** owner-ordered industry-method programme
  (2026-10-28), after the single-mesh method failed three owner
  viewings in a row (see `WALK-DIAGNOSIS-LOG.md`).
- **Superseded:** the Single-Mesh Deform Method (below) —
  entirely, for all characters, all productions.

### The Single-Mesh Deform Method (the v1–v4 ED-gag era)

One grid skin over the whole body, bone/deformer posing, no
substitution drawings, travel set before stride, QC measured on the
skeleton. **Retired 2026-10-28.** Its failure record is
`WHAT-WE-DO-WRONG.md` (defects 1–5) and
`WHAT-WE-DO-WRONG-ADDENDUM.md` (defects 6–11). Existing mesh rigs
are reference/provenance only; no new animation is authored on
them. Bone-only "fixes" to a walk are a named non-solution: the
bones were right three times; the drawing was wrong.

### The Whole-Sprite Transform Method (the pilot / Storyboard Draft 1 era)

Whole-image bob/tilt/zoom over stills. **Retired by owner verdict**
(rejected pilot trailers; EP01 master reclassified as Storyboard
Draft 1). Never animation, at any length, under any gate.

---

## ⬛ THE UPGRADE RULE (owner, 2026-10-28 — standing)

In the owner's words in substance: *log the newest method as the
usable method, every time we upgrade methods, and make it obvious
for yourself and the agents, so we never regress.*

1. **Every method upgrade gets a registry entry here, at the
   moment it lands** — a new version block at the top of this file,
   marked **CURRENT / USABLE**, naming the version it supersedes.
2. The superseded version's block is re-marked **SUPERSEDED — DO
   NOT USE** in the same commit. Two methods may never both read
   as usable.
3. **Currency is per method and per use, like every other piece:**
   an older method may stay assigned to a named, written exception
   (a deliberate throwback segment, a legacy repair) — the
   exception and its reason are written next to that use. The one
   move that is always wrong is quietly falling back to a
   superseded method because it was nearer to hand.
4. A method becomes CURRENT on evidence, not on enthusiasm: a
   gated proof build under it, measured on rendered frames, with
   the owner's eye gate as the final gate for production use.
5. Any document, plan, or agent brief that names a method names
   its registry version. If a brief and this registry disagree,
   the registry wins and the brief is corrected.
6. Diagnosis findings that change the method (new defects, spec
   corrections found in practice) land as dated addenda to the
   method spec **and** a dated line in this registry's change log
   below — a future agent reading only this file must still see
   that the method moved.

## Change log

- **2026-10-28 — Registry created; Industry Method v1 marked
  CURRENT / USABLE.** Single-Mesh Deform Method and Whole-Sprite
  Transform Method marked SUPERSEDED. Same landing adds:
  `WALK-DIAGNOSIS-LOG.md` (how the backwards walk was figured out,
  as a standing protocol), `YU-YU-HAKUSHO-ENDING-STUDY.md` (the ED
  reference study, with corrections), and
  `WHAT-WE-DO-WRONG-ADDENDUM-2.md` (gaps 12–21, with their gates —
  several of those gates are now part of what "using the current
  method" means for group shots, faces, music sync, and the ED
  slot; they land as method obligations in that addendum until the
  next method version folds them into the spec proper).
- **2026-10-28 — Industry Method v1.1 marked CURRENT / USABLE;
  v1 superseded as a standalone entry (folded into v1.1).**
  Change: the timing layer lands — `TIMING-STANDARD.md` (the bar
  in new drawings per second: registers and floors, modulation as
  a chart choice, hold caps, charts per cycle and per shot,
  beat-grid sync, pacing rules) plus the wired checker at
  `show/production/tooling/proof-gate/verify_proof.py` with its
  measured run record beside it. First findings under the new
  layer: gag v2 below the credits floor (7.79 drawings/sec) with
  the uniform-rate flag; gag v1 and the Storyboard Draft 1
  excerpt both FAILED class. Beat maps and the remaining scene
  charts are named in `TIMING-STANDARD.md` §13 as specced, not
  yet wired.

- **2026-10-28 — Industry Method v1.2 marked CURRENT / USABLE;
  v1.1 superseded as a standalone entry (folded into v1.2).**
  Change: the above-floor layer lands — `ABOVE-THE-FLOOR-RESEARCH.md`
  (how productions exceed the floor, sourced), the first beat map
  (`show/episodes/EP01/timing/EP01-ED-BEAT-MAP.json` + doc; bell
  at ED 60.000 s verified against the audio itself), the gag
  above-floor chart set (same folder; 12.07 charted
  drawing-changes/sec, beats held ≥ 0.5 s, bell accent at gag
  frame 96), checker v2 chart-conformance mode
  (`verify_proof.py --chart`, tested: 0 deviations on the proof,
  synthetic misplacements caught, gag-v2 baseline recorded), and
  the Phase P re-time proof (v6 drawings, no new art: 8.0 uniform
  → 10.0 drawings/sec with accents, uniform-rate flag clear).
  Tahoma2D/OpenToonz remain registered (BSD-3) as the x-sheet
  lane; no new install was needed for this layer — the gap was
  artefacts and gates, not software.
- **2026-10-28 — Likeness gate added as a standing delivery
  requirement under Industry Method v1.2 (gate addition;
  v1.2 remains CURRENT / USABLE — no version bump: the gate
  changes what a delivery must carry, not how animation is
  made; dated-line treatment per upgrade rule 6).** Origin:
  the above-floor walk proof (PR #482) was delivered to the
  owner on the v6 primitive-redraw puppet — Gap 15's named
  defect, already in the record at delivery time — and the
  delivery headlined its timing numbers. Owner verdict:
  timing accepted; likeness total drift; FAIL as character
  work; the proof is reclassified TIMING PROOF ONLY, and the
  delivery is recorded as a New Deal + self-judgment law
  violation at Gap 15 in `WHAT-WE-DO-WRONG-ADDENDUM-2.md`.
  Wired: `verify_proof.py --likeness` (canon reference path
  + sha256 logged per run; per-frame similarity diagnostics;
  a run record without a recorded side-by-side comparison
  sheet is INCOMPLETE, never graded by the script), run
  record at
  `show/production/tooling/proof-gate/likeness-runs.json`.
  First measured run — the failed proof against the canon
  texture of record: median SSIM 0.17, median silhouette
  IoU 0.57, median colour-histogram L1 0.35 (diagnostics,
  not a grade; front-view reference vs profile frames — the
  view confound is stated in the companion correction
  entry). The v7 canon-art rebuild runs separately and is
  not graded here.

- **2026-10-28 — Industry Method v1.3 marked CURRENT / USABLE
  for generated character animation; v1.2 folded in, its drawn
  route remaining CURRENT for drawn proofs (per-use currency,
  stated in both blocks).** Change: the generated-turnaround
  route lands — `GENERATED-TURNAROUND-PIPELINE.md` (diagnose →
  turnaround → animate → export → gates, with the
  reference-bar section), the 20-point diagnosis checklist as
  data, and the drivers at
  `show/production/tooling/turnaround-pipeline/`
  (`build_turnaround_job.py`: animate half in the landed
  scene-job v2 format, turnaround half stamped SPEC — no
  landed I2I job type exists; the gap is flagged in the doc and
  in the emitted job; `slice_pack.py`: working sprite packer,
  self-test passing). Origin: the owner supplied a reference
  clip generated on a PAID hosted endpoint (Google's) that
  turned Mochiko's front canon art into a true profile walk,
  and ordered the pipeline adopted, wired, and used in place of
  the cutout-assembly route for generated work. The reference
  is recorded as the route's bar — never as canon or a
  deliverable; the local route is the free staged stack
  (Wan/VACE + Qwen2.5-VL, Apache-2.0) with likeness UNPROVEN
  stated in the doc.

---

## ⬛ THE ED-CREDITS STANDARD (owner, 2026-10-28 — standing)

An ending-credit piece is allowed to take **less work** than a
story scene: fewer drawings, a lower drawing rate (on 3s — 8
drawings per second — is the house ED timing), loops, pans, held
poses. It is **not** allowed to take a lower standard.

An ED piece is production-grade when, at whatever drawing rate it
uses: its art is finished (no placeholder drawings), its contacts
plant and stick, its held poses are strong enough to read as
silhouettes, its timing varies on purpose (accents on 2s, a few
frames on 1s at the exact hit), the camera/background do honest
motion work, the cuts and beats land on the song, and every
character's personality is in their chart, not in their fluidity.
That is how the reference endings the format descends from were
actually made — see `YU-YU-HAKUSHO-ENDING-STUDY.md`. **Low FPS was
never the amateur part. Missing craft was.** A piece that fails
those checks is not "ED effort level"; it is unfinished, and it
does not ship as an ending.
