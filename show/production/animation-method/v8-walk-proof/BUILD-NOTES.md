# v8 walk proof — build notes

## Self-judgment (written first, before any number)

**What v8 fixes, honestly:** the figure in the walk is Mochiko *in
profile* — one teal eye with her highlight structure, a side nose, her
twin tails behind her, a drawn profile sneaker pointing along travel,
both arms present and swinging against the legs, knees that fold forward,
feet that plant and stick. Every one of v7's seven named defects and the
thirteen added by the owner's re-inspection is closed or explicitly
carried below as a named partial. I inspected **all 8 poses at full size,
the blink variant, the sheet (three drawing rounds), the turnaround and
the comparison sheets** before writing this.

**What still reads wrong, in plain words:**

1. **The hands are still the weakest drawing on the figure.** They are
   shaped hands with fingers and thumbs — not v7's slab — but they read
   plain, a little mitten-like, especially where the two hands hang side
   by side at the passing poses. This is the sheet drawing's limit, and
   it is the first thing a redraw pass should spend itself on.
2. **The far arm disappears at the two passing poses** (2 and 6). It
   exists, it swings in opposition, it is measurable in six of eight
   poses — but at the passings it is wholly behind the torso. In strict
   profile that is geometrically honest; it is still a visibility the
   audit asked for and only partially got. Named in GATES as a partial,
   not passed over.
3. **The sheet is a derived design, and it shows in two places:** the
   hair crown is flatter than canon's round top, and the face is a touch
   more angular than her soft front read. The head also measures ~3%
   small against canon's ratio. None of it breaks the read — the
   turnaround comparison is recognisably the same girl — but the sheet
   is a construction awaiting the owner's eye, not a recovered canon
   asset, and it is flagged DERIVED-FROM-CANON in its own notes.
4. **The jar creatures are simplified silhouettes** of the canon
   creatures (shapes and colours carried; the frog's stalk eyes and the
   purple one's sparkle detail are not). Deliberate, flagged on the
   sheet, and the right place for a detail pass later.
5. **Arm swing reads gentle.** The opposition is real and measured
   (±65–74 still px at the contacts), but the swing is a walk's swing,
   not a march's — at thumbnail size the arms look quiet. That is a
   taste call the owner may want bigger; the charts to change are one
   line each in `puppet8.py` (ARM1_N / ARM1_F).

**Verdict I would defend:** as a character product this is a PASS
against the v7 defect list — the correct character, in the view the gag
actually needs, performing the action, with no borrowed front art
anywhere in the figure. It is not a claim that the drawing hand is
finished: items 1–4 above are the honest remainder, and Gate 8 is the
owner's.

## How it was built

**Phase 1 — the sheet** (`draw_sheet.py`, `drawkit.py`, `palette8.py`,
`sheet_geom.py`): palette and line weight sampled from the canon art by
script (cluster medians + point samples + dark-run stroke measurement —
see SHEET-NOTES), then the profile drawn with spline shapes at 3×
supersample on the canon canvas/scale. Three drawing rounds, each
eye-checked: round 1 found the torso too narrow, collar a block, arm
floating; round 2 widened the torso, moved the jars to the waist front,
re-hung the arm; round 3 gave the sleeve a value step so it reads
against the torso, trimmed the collar, moved the star pin clear of the
arm, softened the jaw/neck crease. Deliverables: `profile-sheet.png`,
`turnaround-comparison.png`, `SHEET-NOTES.md`.

**Phase 2 — the walk** (`extract_parts8.py`, `puppet8.py`,
`calibrate8.py`, `measure8.py`, `make_clips8.py`): 18 parts cut from the
sheet only — the same polygon-cut method as v7, polygons in
`sheet_geom.py` shared between drawing and cutting. Cycle machinery
follows the industry method as in v6/v7 (contacts first, support stick
from the shoe's own rotated pixels, two-bone IK with the knee chosen
forward). **Geometry is re-derived from the sheet**, not copied: her
sheet leg (L1+L2 = 292 still px) is shorter relative to the figure than
v7's front-art leg, so the stride track is 58 still px/slot with a
174 px spread — the largest stride her legs can actually plant (a
v7-sized track is geometrically unreachable: at toe-off the ankle target
would sit ~8 px beyond full leg extension). For the same reason the far
leg is drawn only 1% smaller: at 3% its contact poses float ~7 px no
calibration can fix.

v8 additions on top of the v7 machinery: authored arm charts with
measured opposition (GATES table); torso lean chart (2.5–5.0° into
travel by phase) with skirt counter-rotation at −0.45× and a hem-lag
row; tail lag rotations; head stabilization (head keeps 45% of the root
bob; measured head-top range 14 vs bob 28); a blink variant of pose 2
rendered from the sheet's own closed-eye drawing. One build fix worth
recording: the shin/thigh crops originally carried square above/below-
knee corners that rotated into a visible knee spike at the passings —
the crops were tapered and the spike verified gone at full size.
Calibration converged to ≤1 px on every support shoe (an early
calibration loop chased a phantom 25 px lift for three iterations
because its mask test ignored the blue channel and matched the magenta
arm mattes; the test was fixed and the convergence is real — the
calibration file is ±1 px everywhere).

## Files

- `profile-sheet.png` + `turnaround-comparison.png` + `SHEET-NOTES.md`
- `clips/walk-retimed.mp4` (96f, 24fps, 1280×720) · `clips/walk-inplace.mp4` (72f)
- `contact-sheet.png` (8 poses + blink + poses 0/3 on black) · `likeness-comparison.png`
- `GATES.md` · `measures8.json` · `gate/` (checker copy from main +
  `check-retimed-full.json`, `check-retimed-figure.json`,
  `check-inplace.json`, `likeness-runs-v8.json`, `likeness-runs-v8-figure.json`)
- `poses/`, `poses-id/` (incl. `pose-2-blink`) · `parts/` (18 sheet cuts
  + `registry8.json`) · `calib8.json`
- Scripts: `sample_canon.py`, `sample2.py`, `draw_sheet.py`, `drawkit.py`,
  `palette8.py`, `sheet_geom.py`, `extract_parts8.py`, `puppet8.py`,
  `calibrate8.py`, `measure8.py`, `make_clips8.py`

No PR, no ED-gag composite — proof for the owner's eye, as ordered.
