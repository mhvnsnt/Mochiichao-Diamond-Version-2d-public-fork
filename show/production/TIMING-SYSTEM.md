# TIMING SYSTEM — the exposure sheet (xsheet) as a format, wired to Tahoma2D

List-2 teardown #16 (audio & timing cluster). Native spec: the
xsheet grammar below is the classic exposure-sheet format as a
*format* — fields, notation, and discipline — grounded in Jamar's
own research (animation-techniques-archive Preston Blair playbook as
carried through the LIVING-WORLD / DESIGN-THEORY research: Blair's
pan/overlay/level model; Hanna-Barbera planned-animation economics
from the mystery-coast research line: dialogue-first production,
bank systems, held levels). Nothing creative is copied: no donor
timings, no donor sheets — the example in Part 4 times *our own*
EP01 cuts from *our own* board and bed records.

House context this wires into:

- **Tahoma2D 1.6 is the puppet home** (FULLSTACK-WIRING: rig
  assembly, symbol frames, scene animation; renders headless via
  `tcomposer`; visemes via its built-in Rhubarb Recognizer or the
  standalone CLI feeding timing sheets). OpenToonz 1.8 is the
  upstream reference. The xsheet is Tahoma2D's native timing
  document — this spec is the *house notation discipline* for
  filling it, plus the paper/Markdown form used at board and
  manifest stage before a scene file exists.
- **Project frame rate: 24 fps.** (LIVING-WORLD C2 already specifies
  cycle loops in frames at 24 fps: 2.3 s ≈ 55 f, 3.1 s ≈ 74 f,
  4.7 s ≈ 113 f, 7.3 s ≈ 175 f.)
- **Audio-first, dialogue-first.** The mystery-coast research
  (Scooby 1969 pipeline, per PROSODY-REPO-MINE): the voice session
  was the performance; animation serves it. House form: per-scene
  audio beds are built first and cuts are timed against them
  (EP01's Scene 1/2/4/5 + stinger beds exist and are gated). The
  xsheet's audio column is therefore not decoration — it is the
  spine the picture columns hang on.
- **Timings lock at the animatic, not before** (STORYBOARD-PLAN).
  The xsheet is where the lock is recorded.

---

## PART 1 — THE TEARDOWN: exposure-sheet grammar

An exposure sheet is a grid: **rows are frames, columns are
levels** (one column per cel/level/layer of the scene), read top to
bottom in time. The animator writes, for each frame row, which
drawing of each level is exposed. Everything in limited animation
is a consequence of that grid:

1. **Hold** — one drawing exposed across many rows. A held level
   costs one drawing no matter how long it sits. HB's whole economy
   starts here: a 7-minute short on ~2,000 drawings instead of
   ~14,000 (LIVING-WORLD research), series planned animation at
   2–3k drawings vs 20–30k (DESIGN-THEORY research) — achieved by
   holding everything that isn't the point of the shot.
2. **Ones / twos / threes** — a moving level gets a new drawing
   every frame (ones: full motion, action beats, camera-critical
   moves), every 2 frames (twos: the TV default for character
   motion), every 3 (threes: slow, distant, or background-class
   motion). The choice *is* the budget line.
3. **Levels split so only what moves, moves** — head on one level,
   body held on another; mouth as a symbol-frame level (our
   Tahoma2D symbol mouth/eye/hand frames are exactly this); the
   moving part is redrawn, the rest is a hold with a long number.
4. **Cycles** — a short drawing sequence marked to repeat
   (`A-B-C-B` ×n). Banked cycles (walks, runs, flaps) are drawn
   once for the series. Our AMB cycle library (LIVING-WORLD §2.1)
   is this, with prime-length loops and phase offsets as the house
   refinement.
5. **Bank cuts** — whole finished shots re-exposed in later
   episodes (B-roll BANK pairs picture + bed slice, LIVING-WORLD
   §2.3). On the sheet a bank cut is one line: the asset ID and its
   frame count — the cheapest cut in the show.
6. **Camera column** — pans/trucks/zooms written as frame-indexed
   moves against the held art (Blair's pan + overlay model: the
   background moves under held cels; our `ESTAB-PAN` and FFmpeg/
   Natron camera stage are the digital form).
7. **Audio/dialogue column** — dialogue phonemes, SFX and music
   cues written against frame numbers, because the sheet is the
   contract between the recording and the drawings. In
   dialogue-first production this column is filled *first*.

## PART 2 — FIELD DEFINITIONS (the house xsheet)

### 2.1 Header (one per scene)

| Field | Meaning | Source of truth |
|---|---|---|
| `scene` | `EP##-SCENE-##` ID | episode package |
| `fps` | 24 (project standard) | this spec |
| `cuts` | cut IDs + board seconds + frame ranges (§2.3) | STORYBOARD-PLAN, locked at animatic |
| `boards` | `EP##-SC##-boards-v<N>` (CURRENT at issue) — the board version this sheet was timed against (#53 §3) | BOARD-PIPELINE |
| `wind_state` | per-cut `WIND ∈ {CALM, BREEZE, GUST}` (+ `REFUSED` for Forest) | board / LIVING-WORLD C3 |
| `score_state` | per-cut `SCORE-STATE` (ADAPTIVE-MUSIC §2.2) | board / stem manifest |
| `bed` | `BED-[LOC]-[TIME]` ID + bed file | LIVING-WORLD §2.4 |
| `finish` | −14 LUFS / −1 dBTP | cue-sheet law |

### 2.2 Columns (left → right = composite order, top-most first)

The sheet records composite order *explicitly*; in the Tahoma2D
scene the columns become levels/columns in the same order and the
sheet is the check that the scene file matches the board.

| Column | Contents | Notation home |
|---|---|---|
| `FG` | Foreground overlays (defocus crossings, FG grass strips) | `POP-FG-…`, `AMB-…-…` (FG class) |
| `CHAR:<name>` | One column per acting character (puppet level set) | drawing/symbol numbers per §2.3 |
| `FX` | Splash, flame, frost, smoke, shimmer | `SFX`-visual + FX asset IDs |
| `AMB:<element>` | One column per ambient cycle running in the cut | `AMB-[LOC]-[ELEMENT]-##` |
| `POP` | Background population events | `POP-[CLASS]-…` |
| `BG` | Plate / B-roll pair | plate ID or `BR-[LOC]-##` |
| `CAM` | Camera moves | preset IDs (ENVIRONMENT-AND-CAMERA) |
| `AUDIO` | Bed, stems, cries, SFX spots — frame-anchored | stem manifest events |

### 2.3 Cell notation

- **Hold:** `H▸<drawing>` spanning a frame range: `f1–336 H▸A`
  (drawing A held 336 frames). Hold ranges are how the sheet stays
  readable: one line per exposure segment, never one line per frame.
- **Ones/twos/threes:** a moving segment lists its rate:
  `f337–420 ONES: L1…L84` / `TWOS: B1,B2,…,B21 (each ×2)`.
  Mixed rates inside one segment must be split into sub-segments.
- **Cycle:** `⟳<loop-frames> φ<phase>` after the cycle ID, e.g.
  `AMB-POND-MIST-01 ⟳264 φ+37` — loop length and phase offset come
  from the LIVING-WORLD catalogue (C2: prime, non-commensurate
  loops; two cycles in one cut never share a length). Phase is set
  per cut, never copied from the previous cut — that is what keeps
  banked cycles from visibly synchronising across an episode.
- **Bank:** `BANK:<asset-id>` with the frame range; a bank segment
  needs no drawing numbers (the asset *is* the drawings). B-roll
  pairs carry their bed slice with them (LIVING-WORLD §2.3) — the
  AUDIO column then just notes `bed slice incl.`
- **Acting overrides ambient:** when a character acts on an element
  that also has an ambient cycle (gate sway vs ridden swing, cut
  03), the AMB column shows `→ ACTING` for the overlap and the
  CHAR/FX column takes the element over (LIVING-WORLD C-rule).
- **Events:** audio events and story events are anchored in both
  seconds and frames: `@45.0s / f1081`. Frame = ⌊t × 24⌋ + 1.
- **Subtitle zone:** cuts carrying a subtitle mark `SUB` in the
  AUDIO column with the card's in/out frames; the focus gate
  (LIVING-WORLD Part 4: no population may intersect the subtitle
  zone) is checked against these rows.
- **Forest rule:** in Dark Forest cuts every AMB/POP column reads
  `— OFF (C6)` and the BG column is a hold for the full cut; the
  inverted frame-diff gate (stillness ≈ zero) is noted in the
  header. The one scripted leaf (cut 28) is an FX segment of
  exactly one non-looping event.

**Smear brackets (#49 §3, SMEAR-FRAME-GRAMMAR).** A smear is a CHAR-column entry with the device code in the action note and the bracket frames marked: [bracket-open] on the clean anticipation frames, the device peak (e.g. `SM-STRETCH`, with its audio spot) on its frame, [bracket-close] on the settle frames. Composite-stage gate: a frame-diff pass flags any smear device whose bracket frames are missing or tweened.

### 2.4 Tahoma2D wiring

- One xsheet per scene maps 1:1 to one Tahoma2D `.tnz` scene;
  columns → levels in recorded composite order; holds → repeated
  cells; cycles → the banked level with its loop set at the cut's
  phase; symbol mouth/eye frames for humans land on their CHAR
  column keyed to the viseme timing (Rhubarb route,
  FULLSTACK-WIRING §3).
- The per-cut manifest fields already specified in LIVING-WORLD
  Part 4 (`wind_state`, `ambient: [AMB-…]`, `population: [POP-…]`,
  `bed`, `sfx_spots`) plus ADAPTIVE-MUSIC's `score_state` / `stems`
  are generated *from* the locked xsheet — the sheet is the human
  document, the manifest is its compiled form. If they disagree,
  the sheet wins until the animatic lock is re-run.
- Render: `tcomposer` headless from the `.tnz`; the xsheet header's
  frame ranges are the render ranges.

## PART 3 — ECONOMY RULES (the HB discipline, house form)

1. Default character motion is **twos**; **ones** are spent only on
   action beats and camera-critical moves (EP01 has two boarded
   action beats — the spend is visible because it is rare).
2. A level that does not change the story in this cut is a **hold**.
   Blinks and weight shifts are POP/PERCH-class micro-motion, not
   re-draws.
3. Every cycle built for a cut enters the AMB catalogue with an ID
   or it does not ship (no orphan cycles) — BANK-first per
   KIT-AUDIT discipline: MAKE only when no banked cycle fits.
4. Board target stands: ~34 cuts/episode class, heavy BANK reuse
   from EP01 onward (STORYBOARD-PLAN). The xsheet is where reuse
   is counted: a `BANK:` line is a saved build.
5. Dialogue first: the AUDIO column is filled from the scene bed
   (which exists before picture lock) and CHAR mouth segments are
   timed to it, never the reverse.

## PART 4 — WORKED EXAMPLE: EP01 Scene 4 (cuts 13–18) timed

Filled in full as [`XSHEET-EP01-SCENE-04.md`](XSHEET-EP01-SCENE-04.md);
summary and the honest flag:

- Scene: Pond dusk stakeout → reveal. 6 cuts, **64 s = 1,536
  frames** at 24 fps. Frame ranges from the locked board seconds
  (STORYBOARD-PLAN): 13: f1–336 · 14: f337–576 · 15: f577–768 ·
  16: f769–912 · 17: f913–1200 · 18: f1201–1536.
- Header globals: `WIND` dies across the scene (BREEZE → CALM),
  `SCORE-STATE` TENSION (13–16) → SETTLE (17–18), bed
  `BED-POND-DUSK` with its §2.3 emptying automation, stems per
  `stems-ep01-scene-04.json`.
- Columns exercised: BG (`BR-POND-03` dusk plate state), MIST
  (`AMB-POND-MIST-01 ⟳264`), RIPPLE (`AMB-POND-RIPPLE-01`, emitters
  destroyed/re-formed by the cut-14 splash), REED
  (`AMB-POND-REED-01`), five CHAR columns in cut 13 collapsing to
  principals, FX splash/flame/shadow-gag, POP-WATER's single early
  surface break then withdrawal, AUDIO events at the bed's shipped
  marks (Gabu 24.0 s · Kittember 34.0 s · Sproutle 38.5 s ·
  Wispkin 45.0 s + the cut-18 −6 dB duck and `SUB` zone for
  SUBTITLE 1).
- **Flag F1 (reconcile at animatic lock, do not fudge):** the
  shipped bed's event *labels* (gate.json: Gabu = cut 14,
  Kittember = cut 15, Sproutle = cut 16, Wispkin = cuts 17–18) sit
  a few seconds off the board-second frame ranges — e.g. the
  24.0 s Gabu sting lands on f577, the first frame of cut 15 by
  board math. The bed was built to v1 beat timings; the board
  itself says timings lock at the animatic. The xsheet therefore
  anchors audio events to the **bed file's timeline verbatim**
  (they are gate-verified there) and flags the drift — when the
  animatic locks, either the board seconds or the bed is re-cut,
  and this sheet is where that decision gets written down.

## Coverage notes (honesty)

- The xsheet grammar is the standard exposure-sheet format as
  documented in the Blair playbook tradition and the project's own
  research drafts; this pass synthesises from workspace sources
  (LIVING-WORLD, DESIGN-THEORY/LIVING-WORLD drafts, PROSODY repo
  mine, FULLSTACK-WIRING) rather than re-reading the donor repos'
  playbook files directly.
- Tahoma2D mapping is written against FULLSTACK-WIRING's verified
  tool facts (1.6, `tcomposer`, symbol frames, Rhubarb). A
  machine-readable xsheet→`.tnz` compiler does not exist yet; the
  sheet is currently a human/authored document compiled into the
  build manifest by hand — the manifest fields it feeds already
  exist in spec (LIVING-WORLD Part 4).
- Cycle loop lengths in frames use the catalogue's published
  second-values × 24, rounded (mist 11 s = 264 f; ripple 3.7 s ≈
  89 f; reed 2.9 s ≈ 70 f); exact frame counts lock when each cycle
  asset is built.
