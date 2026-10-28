# WHAT WE DO WRONG — ADDENDUM 2 (gaps 12–21)

**Third-pass audit, 2026-10-28**, ordered by the owner after the
Yu Yu Hakusho ending study: find the animation gaps *beyond* the
eleven defects, especially for the ED gag. Method: the 11 defects
and the second pass's cleared list were read first; nothing below
repeats them or the cleared list — where a gap sits next to a
cleared item, the new evidence is named. Files cited are the
workspace build records of the gag and the v6 proof.

The first eleven defects are all, at root, **one character's body
measured the wrong way.** These ten are the next ring out: the
line as a unit, the slot the bit actually plays in, the species
it hasn't reached, the cast seen together, everything above the
waist and on the face, and the music the whole bit floats on.

---

## Gap 12 — One line, five strides, and no shared-speed law
The shipped gag moved the whole line at one global compositor
speed (+22 px/slot for everybody), whatever each stride was. The
corrected method derives travel **per character** from their own
drawn stride — and nobody has written the rule that joins five
individually derived speeds back into one line on one background.
Keep each their own and the line spreads or bunches (spacing
drift, guaranteed); impose one common speed and whoever's stride
doesn't match it glides again — and their solo proof proves
nothing at line speed. Stick has also only ever been measured
against compositor constants, never against the actual ground
art a foot should stick to.
**Gate:** a line chart before compositing — one named line
speed; every member's support-stick re-measured *in the
composited frames at that speed*; a spacing table (start /
middle / end, drift within a few px); a clearance check for
personality beats (adjacent sprites already overlap ~100 px at
current spacing).

## Gap 13 — The gag was built as a standalone film; its real slot is a different picture
The gag's build notes assume its own full frame and its own
background. The actual EP01 ED is a layered composition: a
full-frame credit-text card, a centred inset box where the gag
is meant to go, and three **full-size** character idles looping
at the bottom for the whole ED. Sampled from the master inside
the gag window: the placeholder box sits *on top of the credit
text, cutting lines in half* — and if the gag swaps in as
documented, three of its five chibi walkers appear on screen
**twice, at two sizes, at once**. No file decides: full-frame or
inset? Do credits clear during the window? Do the bottom idles
stop? Side finding: the credit card is set in a generic serif —
the show's own display fonts play no part, and no credit-layout
standard exists.
**Gate:** an ED assembly spec plus sampled frames *from the
assembled ED*: text fully legible, no duplicated cast member,
placement decided on paper first, the owner views the assembled
ED segment — not just the standalone gag file.

## Gap 14 — No gait grammar written for four of the five walkers
The method gives non-humanoids one sentence ("four-beat for
grounded quadrupeds"). Missing legs was defect 10; this is the
pattern itself, after legs exist. Kittember has no four-beat
contact chart. Wispkin's float has no numbers at all — drift
range, bob period against the line's cycles, and above all that
his smoke must **trail against travel** as he moves (in v2 it
only counter-swayed in place, so at speed he reads as sliding).
And a live contradiction: Addendum §A.4 bans non-uniform scale
as an acting tool, but Mochii's hop *is* squash-and-stretch —
the exemption for a creature whose body is the squash is
unwritten, and the next builder will hit it cold.
**Gate:** a per-species gait chart filed before each build, in
plain words, with drawn-space gates mirroring the biped set —
footfall order for Kittember; hop phases + the written squash
exemption for Mochii; drift / bob / smoke-trail numbers for
Wispkin; Sproutle's waddle chart likewise.

## Gap 15 — The new Mochiko is a different kind of drawing from the rest of her line
The v6 proof's puppet **redraws Mochiko from geometric
primitives** with a palette sampled from canon art. The colours
match; the drawing does not come from the canon art — line
quality, edge, and shading are a vector-primitive style none of
the other four share, and its near/far shading convention was
invented for this one proof. There is no line standard in
numbers (method §6.5 promises clean-up "to the show's line
standard" — that standard doesn't exist yet), no resampling
standard (the proof clips resize BICUBIC, the gag compositor
LANCZOS), and no gate that puts two characters side by side and
compares how they're drawn.
**Gate:** a cast line-up sheet at final size before
compositing — line weight, edge sharpness, shading convention
compared member to member; mismatch means a clean-up pass, not
a composite.

**CORRECTION — GAP 15 ACTIVATED (2026-10-28, owner verdict;
the gate above was not applied):** This gap stopped being a
warning and became a shipped failure. The Above-the-Floor
programme (PR #482) re-timed the v6 walk's eight drawings,
and the resulting proof (`walk-above-floor.mp4`, sha256
8d5ac450…) was delivered to the owner **on this gap's own
named defect** — the primitive-redraw puppet — while the gap
sat in this record, unacted on. Owner verdict, 2026-10-28:
the timing is better, and the character is not Mochiko —
likeness total drift, REJECTED as a character product. Under
the grading law (wrong character = FAIL, full stop) the
proof is reclassified **TIMING PROOF ONLY**: its 10.0 new
drawings/sec, its seven accent spans, and its 0 chart
deviations measure a puppet that is not her, and none of it
is character evidence. The delivery is also recorded here as
breaking two standing laws, named so the record carries
them: the **New Deal** — a known limitation is stated as a
number against the standard up front, never discovered
after the owner catches it — and the **self-judgment law** —
judge the artifact against the full standard, likeness
first, and say it plainly in the delivery before he has to.
The delivery headlined a measured axis over a known core
defect.
**Countermeasure, wired the same day:** the likeness gate —
`verify_proof.py --likeness` (in
`show/production/tooling/proof-gate/`): per-frame similarity
diagnostics of a clip's distinct drawings against a canon
reference whose path + sha256 are logged in the run record;
a run record without a recorded side-by-side comparison
sheet is INCOMPLETE. Registered as a standing delivery
requirement in `METHOD-REGISTRY.md`. Its first run, on this
very proof against the canon texture of record
(`mochiko-fixed.png`, MD5 3e142dff199de4c70cca9aa22c01bc11;
run record in `likeness-runs.json` beside the checker),
measures the drift: median SSIM **0.17** (1.0 = the same
image), median silhouette IoU **0.57**, median
colour-histogram L1 **0.35** (Bhattacharyya 0.92 — the
palette family is shared; the drawing is not, exactly as
this gap said). Diagnostics, not a grade — and one confound
is stated with them: the canon reference is a front view
and the proof is profile, so part of the shape distance is
the view itself; the comparison sheet is the
human-readable evidence, and it shows the drawing-kind
drift plainly. The build-side fix runs separately: a v7
rebuild of the walk from Mochiko's canon art, no primitive
redraw. This gap stays open until a canon-art build passes
the owner's eye.

## Gap 16 — The gates stop at the waist
The proof's arm swing is authored (near-arm table, far arm as
its negative at ×0.7) — and never measured. Its elbow bend spans
14–24° identically in both halves of the cycle; torso lean is
1–4° and always forward; head, torso, and hair rotate as one
block, so the head can never stabilise against the torso. Every
row of the proof's gate table is legs, silhouette, or bob. **A
proof with frozen or wrong arms passes 7 of 7 measured gates** —
in a chibi format where head-and-torso is most of the screen.
**Gate:** three rows added — arm swings opposite the same-side
leg at every pose (sign check on the drawings); arm amplitude
inside a charted range; head measurably steadier than the torso
it rides on (head pitch varying *against* torso lean).

## Gap 17 — A frozen face passes every gate
The method *requires* an eyes/blink set (§2.2) and blinks every
3–5 s in held material (§4). Its gate table has **no face row**.
The proof — presented as "all drawn gates pass" — never blinks
once; laid into the 14 s gag that's 14 seconds of unblinking
face with an unmoving gaze, at a scale where the face is the
largest readable surface on screen.
**Gate:** a face row for any cycle running more than ~3 s on
screen: at least one blink per 4 s, placed off the contact
frames; gaze matching travel (and turning for look-back beats);
checked on the contact sheet.

## Gap 18 — The walk was never synced to the ED music
The gag is silent by design and the ED bed lives in the master —
that part is covered, and stays covered. The gap is tempo. The
method promises tempos "locked to fixed frame counts per beat
so cycles sit on the music grid," and the proof's cycle chart
repeats the claim — but **no beat map or tempo for the ED bed
exists in any gag file**, so the lock is asserted, never
measured. What can be measured doesn't line up: the cycle steps
twice a second under a bed its own record calls slow and
gentle, and the bed's one named event inside the gag window —
the bell at gag second 4 — lands on a slot where the gag chart
has nothing.
**Gate:** file a beat map of the ED bed with the gag chart;
measure contact-frame offset from the nearest beat; place (or
deliberately off-place) personality beats against the bed's
named events, on the chart, before compositing.

## Gap 19 — Personality beats are shorter than a viewer can catch
From the shipped slot map: the skip, the flame flare, and the
near-tip wobble run 2 slots each (**0.25 s**); the look-back 3
slots; the mask-tilt 4 — performed by figures 190–296 px tall in
a moving line. The silhouette/readability gates cover cycle key
poses only; the beats were never timed against any floor. In
the reference endings, gag beats are **held poses** — that is
what makes them land at low drawing rates.
**Gate:** a beat sheet per instance: every beat's hold written
down, a floor under it (nothing under ~4 slots / 0.5 s except a
deliberate accent), the owner views the beat strip at final size
and speed.

## Gap 20 — Nobody charted who is on screen when
Computed from the shipped compositor: frame 0 already starts
**mid-entrance** (the lead's centre at x = −77, half in frame),
and the last walker needs slot ~113.3 of the 112 allotted — so
**the bit cuts with its final character half out of frame**, and
its last ~¾ second is that character alone, *by arithmetic, not
by decision.* (It could be a lovely deliberate button. Nobody
decided it.)
**Gate:** an entrance/exit chart in the gag spec — per member,
enter slot and exit slot; the final frame described in words in
advance and the last second checked against it.

## Gap 21 — Contact shadows: required in post, absent in the ship
The standing rule: contact reads come from planted feet **plus
post shadow**. v1 and v2 carry **no post shadow at all** — only
the *baked* half of the rule was ever obeyed. The proof adds one
fixed ellipse that doesn't change with bob height, for one
character. Nothing specifies the line treatment — and for
Wispkin, a floater, a ground shadow tracking his height is the
*only* ground reference he has.
**Gate:** a shadow row in the composite check: every grounded
member's post shadow sits under the planted foot in sampled
frames; the floater's shadow offset/strength tracks his float
height across his cycle.

---

## Checked and covered this pass (not gaps)

- **Gag sound existing** — covered: silent by design; the ED bed
  lives in the master. Only its *sync* is missing (Gap 18).
- **Cross-character ground registration in the v2 composite** —
  covered (shared baseline; the floater raised by design).
  Gap 12 is the different, rebuild-era problem of five strides
  vs one line speed.
- **Within-cycle spacing/easing** — covered (uniform on-3s is
  the house register; held pairs measured).
- **Palette values for canon-art characters** — covered. Gap 15
  is about drawing kind and line/sharpness consistency, on
  evidence that post-dates the cleared claim.
- **The cycle loop seam inside Mochiko's 8 poses** — covered in
  practice; the unexamined seam is at the *bit* level (Gap 20).

## Status of these gaps

Logged as **method obligations**: each gate above binds the
next build (the full gag rebuild first) exactly as the §5 gates
do, and a build that skips one carries an open defect ticket
under Addendum §A.6 — fixed, or waived by the owner in writing.
They fold into the method spec proper at the next method
version, logged per `METHOD-REGISTRY.md`'s upgrade rule.
