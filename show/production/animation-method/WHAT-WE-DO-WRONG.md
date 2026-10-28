# WHAT WE DO WRONG — and how real TV cartoons actually do it

**What this is:** a plain-language teardown of our animation method,
written because Mochiko's ending-credit walk failed four versions in a
row (v1–v4) and the owner rejected every one on sight. Part A is our
method, defect by defect, with the measured evidence. Part B is how
Cartoon Network / Nickelodeon / Disney TV puppet shows actually build
rigs and animate. The table at the end maps each of our defects to the
industry practice that exists specifically to prevent it.

**How to read the grades.** Every claim carries one:
- **MEASURED** — numbers from our own v5 diagnosis, which measured the
  rendered pixels of the shipped v4 walk
  (`~/workspace/ep01-ed-gag/work/v5/DIAGNOSIS.md`).
- **ARCHIVE** — read in full from a named file in Jamar's own archive
  repos (his research docs and pipeline docs; where those docs
  summarise published studio history, the claim is DOCS-grade inside
  them and says so).
- **DOCS** — public documentation and published guidance (software
  vendor docs, industry interviews, standard textbooks), source named.

No characters, character names, or show assets from any archive source
are used here — techniques and production documents only, per the
construction-kit rule. Sources are referred to generically ("a network
puppet-comedy production bible") wherever the material is studio
material held for private study.

---

## PART A — OUR METHOD, DEFECT BY DEFECT

### How we built Mochiko's walk (the honest description)

One flat picture of the whole character, laid over a single grid mesh.
Bones inside the mesh bend the picture, with the bend strength
("weights") painted automatically. To make a new pose, we rotate
bones. To check the work, we measured the bones. To move her across
the screen, the compositor slid the whole sprite at a fixed speed.
Four versions of that produced four rejections. Here is why, in the
order the v5 diagnosis ranked the damage.

### Defect 1 — One skin over everything, so the parts smear into each other

Our character is **one continuous mesh**. There is no separate drawing
of a leg, a shoe, a skirt — there is one surface, and the bones stretch
it. The automatic weights don't respect the gap between her legs: at
wide poses, her left shoe's drawn mass extends **44 px behind the ankle
vs 28 px in front** — the shoe literally draws itself pointing
backward, streaked toward the other leg (MEASURED, v5 Test 3; the
streak was 104 px in v3, shrunk but not killed by v4's fix). The same
shared-weights problem bit us in v2: posing her arm dragged her
belt-bag with it, because the arm bones' weights also carry skirt and
bag vertices (noted in the v4 build record, quoted in the diagnosis).

The owner's newest catch is the same defect wearing a different face:
**white gaps opening between Mochiko's hair and her head** (owner-
reported 2026-10-28; not part of the v5 measurements). One stretched
skin is exactly the construction that opens gaps at seams — pull the
surface and it thins where two regions meet. Separate overlapping
parts cannot do this; there is always drawn material underneath.

### Defect 2 — We posed bones and measured bones; the failure lives in the drawing

Every version "passed" its checker. The checkers measured bone angles
and ankle positions **in the skeleton's own space**. But three things
sit between the skeleton and the screen — the character's root sliding
inside the sprite, the mesh deforming, and the compositor's fixed
travel step — and no gate covered any of them. v4's own pixel
instrument even *reported* the shoe-streak residual honestly; it just
wasn't the gate. **The owner's eye was the gate** (MEASURED — this is
the diagnosis's central methodological finding).

### Defect 3 — No ground-contact discipline: the walk never touches the ground

Only **1 of the 8 poses** has a foot on the ground line. Both poses
labelled CONTACT arrive late — at pose 4 the "landing" foot is still
~6 screen px in the air. The support foot leaves the floor at PASSING,
and both HIGH POINT poses are **flight phases**: both feet off the
ground. A cycle with two flight phases is the grammar of a hop or a
run, not a walk (MEASURED, v5 Test 2).

Worse, while a foot is supposed to be bearing her weight, it **glides
toward the direction of travel at +14 to +41 px per step** — at one
step nearly twice as fast as she is travelling. A planted foot must
sit at ~0. A foot that slides forward under a body that is also moving
forward is the classic moonwalk/skating signature — the strongest
"this is going backwards" cue there is — and it is present in **both**
play directions, which is why reversing the cycle never fixed anything
(MEASURED, v5 Test 1).

### Defect 4 — The knees bend the wrong way, in every pose of both legs

The owner spotted this one himself, watching the forward-vs-reversed
pair: *"you have the knees bending backwards."* The measurements back
him. The drawn shin **never folds back behind the knee line** the way
a real bending knee sends it — at most 4 px, in one pose, out of
sixteen leg-poses. Instead the shin tips *toward* travel, and the knee
point bows off the hip-to-ankle line by up to ~30 px. A leg built that
way reads as a joint hinged backwards (MEASURED, v5 Test 3 + fold
data). Why no flip could ever fix it: flips trade which leg or which
phase carries an error. The wrong-way joint is in the **construction
of every pose** — it is what a bent grid mesh *does* to a leg. A mesh
bend cannot draw a knee fold; it can only smear one.

Contributing to all of the above: the drawn poses barely differ. The
eight poses are near-identical standing figures with feet adjacent;
her left leg never trails behind her body and her right never reaches
forward. With the poses that quiet, the two corrupted cues (glide +
backward shoe) **are** the whole read (MEASURED, v5 verdict §3).

### Defect 5 — v1: the whole picture was the animation

Version 1 moved the entire sprite — bob, tilt, zoom over a still. The
owner rejected it as a slideshow, and it is the same root error as
Defects 1–4 in a simpler form: **the picture was treated as one thing
to be transformed, instead of a set of parts to be posed.** Everything
below exists because the industry learned, decades ago, not to do
this.

---

## PART B — HOW THE INDUSTRY DOES IT

### B1. A character is a box of separate drawings, not one skin

In the standard TV cut-out/puppet method (Toon Boom Harmony is the
reference tool; the Flash/Animate symbol method before it is the same
idea), the character is built as a **hierarchy of separate drawings,
one per body part**, each on its own peg: a master peg at the root,
torso under it, head under a neck peg, each arm as upper-arm → forearm
→ hand, each leg as thigh → shin → foot, legs parented to the hips.
Moving a peg moves everything under it; each part still rotates around
its own set pivot, independently (DOCS — Toon Boom Harmony
documentation, "How to Rig a Cut-out Character": the documented
hierarchy is exactly torso/neck/head, arm and leg chains, "a master
peg at the root").

There is no shared surface, so there is **nothing for weights to bleed
across**. Her shoe cannot be streaked by her other leg, because her
shoe is its own drawing that only ever gets moved or swapped — never
stretched by a neighbouring part's bones.

**Joints are drawn overlaps, not bends.** In the Flash-era rigging
method, each joint is defined by a circle: the shapes of both parts
are drawn so they flow into and out of that circle, one part's joint
circle stays visible, the other part's shape is drawn tangent to its
hidden circle — which "guarantees proper functioning of the joint"
by construction (DOCS — Flash Power Tools, *Character Rigging for
Flash Animation*). In Harmony, the same job is finished with
**patching**: a cutter/mask (the Auto-Patch system) hides the seam
line where two parts overlap, so the joint reads as one continuous
limb while both parts stay separate drawings underneath (DOCS — Toon
Boom Help Centre, "How does the Auto-Patch node work?": it exists to
"obscure the joint line of that layer"). A working TV rigger's rule
from the same world: don't put drawn detail **on** the joints — detail
sits inside parts, joints stay clean, so rotation never chews artwork
(DOCS — Cartoon Brew interview with a TV Harmony rig artist).

This is a 70-year-old idea, not a software feature. The cel-era
studios split characters across **cel levels** for the same reason —
one network-era production's lead character ran his head on one cel
and his mouth on overlaid cels while the body sat on a held cel —
and characters were deliberately designed with collars, ties and
necklaces **to hide the seam where the head cel meets the body cel**
(ARCHIVE — `mystery-coast-ghosted/docs/research/HB-LIMITED-ANIMATION.md`,
citing published studio history). Design-for-separation is a character
-design rule, not a rigging afterthought.

### B2. When a pose can't be reached by moving parts, you swap in a different drawing

This is the practice whose absence killed our knees. Cut-out
animation's second core mechanism is **drawing substitution**: each
part's layer holds a *pool* of drawings, and the animator swaps which
one is showing at any frame. The vendor's own documentation gives the
reason in so many words: mouth layers carry several drawings "since it
is complicated to animate a mouth with deformations and
transformations alone," and hand layers carry several hand drawings
"to avoid having to animate the hand's fingers individually" (DOCS —
Toon Boom Harmony documentation, "About Swapping Drawings").

Generalised: **any shape a transform can't honestly produce gets its
own drawing.** A bent knee with the shin folded back is a drawing. A
foot rolled onto its toe for push-off is a drawing. A hand pointing is
a drawing (the archive playbook's hand-pose libraries: 8–12 approved
poses per character, reused, never improvised — ARCHIVE,
`animation-techniques-archive/ANIMATION-PLAYBOOK.md` §5). A turnaround
— front, three-quarter, profile, back — is a set of drawing
substitutions, not a rotation (DOCS — the same Harmony rigging
literature; ARCHIVE — the archive's model-sheet template, §1).

### B3. Deformers have a real job, and it is a small one

Deformers (bone/envelope chains that bend a drawing) exist in the
professional toolkit — for finesse: a slight curve in a spine, cloth,
hair sway, a cheat toward a neighbouring angle. They are **not** the
load-bearing structure. A snappy show "may not need to use any
deformers at all"; finesse-heavy shows use more (DOCS — Cartoon Brew
rig-artist interview). And the vendor documentation names our exact
failure as the thing to avoid: a part attached directly under a
deformation chain "will get deformed in undesirable ways" — the
documented fix is a kinematic-output node, which lets a part like a
hand **follow the end of the chain without being deformed by it**
(DOCS — Toon Boom Harmony documentation, "About Rigging Drawings to
Deformations"). Read that again against Defect 1: the industry
documented the shoe-smear, and its prescribed cure is *stop letting
the deform chain touch the part that must keep its shape*.

### B4. Poses are planned first, in writing, contacts first — this is called pose-to-pose

TV character animation is **pose-to-pose**: the key poses are defined
and locked first, placed on an exposure sheet (X-sheet) at chosen
frames, and only then are in-betweens made. The opposite —
straight-ahead, each frame improvised from the last — is reserved for
fire, water and effects (ARCHIVE — ANIMATION-PLAYBOOK.md §12).

For a walk, the key poses are a fixed, published discipline, the
method from Richard Williams' *The Animator's Survival Kit*: build
the **contact** positions first (both feet on the ground, widest
stride — these are the keyframes; they set the step length), then the
**passing** position as the breakdown between them, then the **down**
(weight settled, body at its lowest) and **up** (push-off through the
toe, body at its highest) positions (DOCS — Williams' method as
taught in university animation courses and walk-cycle references
summarising the book). Two consequences that map straight onto our
Defect 3:

- **In a walk, a foot is always on the ground.** Flight phases are
  what make it a run. The contact-first method cannot produce our
  "contact pose with the foot in the air," because the contact pose is
  *defined* by the foot being planted.
- **The planted foot's stillness is authored, not accidental.** The
  cycle is drawn in place; travel speed is set afterward to match the
  stride the drawings already contain. Stick is a number you choose
  and check, not a hope.

Cycles themselves are stock: built once per character (or per body
type), stored, and reused forever, with personality added by
*retiming* — hold the down frames longer for a heavy walk — rather
than by redrawing (ARCHIVE — ANIMATION-PLAYBOOK.md §6; HB research:
studios built libraries of reusable walk/run/reaction cycles and
recycled them across episodes as a matter of system).

### B5. Timing is exposed on 2s and 3s, measured, and never blanket-interpolated

Broadcast cartoons run at 24 frames per second but a drawing is
typically held for 2 frames (**on 2s** = 12 drawings/sec) or 3 frames
(**on 3s** = 8 drawings/sec). The classic limited-animation economics:
a 7-minute short at ~2,000 drawings instead of ~14,000 — achieved by
holding poses, cycling, and animating only the part that moves
(ARCHIVE — HB-LIMITED-ANIMATION.md, citing published sources).
Timing was set **by metronome**: beats marked at fixed frame counts so
walks and takes land on the beat (ARCHIVE — same). The modern
pipeline doc in the archive states the corollary as a rule:
**"selective smoothing ONLY where marked… Never blanket-interpolate.
The holds ARE the style"** (ARCHIVE —
`mystery-coast-ghosted/docs/research/PIPELINE.md` §7).

Our gag already knew this much — it walks on 3s, measured at 224/335
held frame pairs in v2 (per the build record). What it lacked was
everything upstream of the timing: parts, substitutions, contacts.

### B6. Model sheets come before rigs, and they are law

Every professional production builds a **model sheet per character
before animating a frame**: turnaround at one scale, expression
sheet, pose library, mouth chart drawn for *that* character, hand
poses, a colour model with exact values, scale references against the
rest of the cast, and construction notes (ARCHIVE —
ANIMATION-PLAYBOOK.md §10 and `templates/character-model-sheet-template.md`:
"Fill this out completely before building the character's rig… The
model sheet is law — if the rig doesn't match the sheet, the rig is
wrong"). Real productions ship the same discipline in their own paper:
the archive holds, for private study, a network production's
**character construction notes**, its **size chart**, and a **main
model pack** — the model-sheet standard as an actual production
artefact, not a theory (ARCHIVE — gigaleak repo folder listings:
`GBM CONSTRUCTION NOTES`, `GBM SIZE CHART`, `SDMI Main Model Pack`;
NONE-all-rights-reserved-private-study — conventions studied, nothing
copied).

### B7. Dialogue first, and sound carries what drawings don't

The limited-animation studios were explicit that the system only works
because effort moves to writing, voice, music and sound effects —
"the poses had to be extremely accomplished and funny in and of
themselves" (ARCHIVE — HB-LIMITED-ANIMATION.md, quoting the
production's own designer). The archive's modern pipeline is
dialogue-first end to end: script → scratch dialogue → voice record →
animatic locked → then rigs and animation built to serve the audio
(ARCHIVE — mystery-coast PIPELINE.md). For our show this is already
adopted doctrine; it is listed here because the walk failure can make
it look like everything was wrong. It wasn't. The audio-first spine
was right; the rig construction was not.

### B8. QC happens on rendered frames, and nothing ships unlooked-at

Two archive systems cover this, and they are different tools — worth
keeping straight:

- The **per-shot checklist** (ARCHIVE — `animation-techniques-archive/
  PIPELINE-CHECKLIST.md`): model-sheet check → X-sheet → key poses
  (with a silhouette test: fill the pose black — can you still read
  the action?) → in-betweens → principles check → clean-up → likeness
  check against the colour model, numerically → final QC watched at
  full speed, at 0.25×, and frame-by-frame.
- The **proof stage** (ARCHIVE — `TRIPPEDD-Animation-Studio/
  PIPELINE.md`): every render is reopened, probed, hashed, and held
  at `visual_qc: QC_PENDING` **until someone looks at it**. A file
  that merely exists is not a finished shot.

(A third archive doc, a show repo's "anim gate," turns out on reading
to be about which *contexts* clips may play in — fight vs show — not
about visual quality. It is listed in the pull-in list so it stops
being cited as a QC gate. The QC gates are the two above.)

Measured against B8, our process had the shape of QC (checkers! gates!
numbers!) aimed at the wrong object: we verified the skeleton. The
industry verifies **the pictures**.

---

## THE MAPPING TABLE — our defect → the practice that exists to prevent it

| # | Our defect (measured) | The industry practice that prevents it |
|---|---|---|
| 1 | One flat grid mesh over the whole character; automatic weights bleed across the gap between the legs; the wide-stride shoe smears toward the other leg and draws pointing backward (44 px back vs 28 forward) | **Part separation.** One drawing per body part on a peg hierarchy (master peg → torso → limb chains). No shared surface exists, so no weight can bleed across it (B1) |
| 2 | Same shared weights drag unrelated parts (arm bones pulled the belt-bag in v2) | Same as #1, plus the **kinematic-follow rule**: a part that must keep its shape follows a chain's end *without being deformed by it* (B3) |
| 3 | White gaps opening at seams (hair/head — owner's catch) | Parts are drawn to **overlap** at joints (joint circles, patch/cutter seams hidden under the overlap). There is always drawn material underneath; a seam cannot open into a gap (B1) |
| 4 | Knees never fold; shin tips toward travel; joint reads backward-bent in all 16 leg-poses | **Drawing substitution.** A bent leg is a *drawn* leg, swapped in — productions swap drawings for exactly the shapes transforms/deformations can't honestly make (mouths and hands are the documented cases; legs are the same rule) (B2) |
| 5 | Contact poses land with the foot in the air (only 1 of 8 poses touches ground); both high points are flight phases in a *walk* | **Contact-first pose-to-pose authoring** (Williams): contacts are the keyframes and are planted *by definition*; flight phases are the grammar of a run, and cannot appear in a walk built this way (B4) |
| 6 | Support foot glides +14…+41 px/step under a moving body — the moonwalk signature, in both play directions | Cycles are authored **in place** from the contact poses; travel speed is set afterward to match the drawn stride, and stick is checked on the sheet — gliding is a calibration error you catch, not a style you ship (B4, B5) |
| 7 | Poses near-identical; stride one-sided (one leg never trails, one never leads); almost no readable information in the cycle | **Cycle charts + pose libraries + silhouette test.** Keys are checked as black silhouettes for readability before in-betweens exist; personality and amplitude live in the keys (B4, B8) |
| 8 | Checkers measured bones in skeleton space and passed four bad versions; the owner's eye was the only working gate | **QC on rendered frames**: per-shot checklist + proof stage (reopen, probe, hash, QC_PENDING until a human looks). Verify the pictures, not the skeleton (B8) |
| 9 | v1: whole-sprite bob/tilt/zoom over a still — "slideshow" | **Held cels + moving holds**: hold the parts that aren't moving, move the parts that are, add micro-motion (breath, blink) to held poses. Never transform the whole character as one image — the archive playbook names whole-body sway "the #1 cheap-animation tell" (B5; ARCHIVE — ANIMATION-PLAYBOOK.md §7) |
| 10 | Rig built first, character standard enforced (or not) afterward | **Model sheet before rig, as law** — turnaround, construction notes, colour model, size/scale chart — the same artefacts real productions ship in their model packs (B6) |

**The one-sentence version:** we built a *sculpture and bent it*;
the industry builds a *kit of drawings and poses it* — and plans the
poses, contacts first, on paper, before anything moves.

---

*Companions: `CORRECTED-METHOD.md` (the method we build to from here)
and `PULL-IN-LIST.md` (the archive material that lands in the repo
under this programme). Stage 1 of the owner-ordered programme —
explanation first. No gag files were touched.*

---

## CORRECTION — dated 2026-10-28 (second-pass audit; the text above is kept as written)

Defect 1's final paragraph and mapping-table row 3 attribute the
white gaps between Mochiko's hair and her head to the one-skin
construction — a stretched skin thinning where two regions meet.
**That mechanism is wrong for this gap.** The fix lane's pixel
work (~/workspace/ep01-ed-gag/work/mochiko-hair-fix/FIX-NOTE.md)
proves the gaps were fully-enclosed **un-keyed background
pockets** — the sheet's pale field colour, fully opaque, trapped
inside the drawing where the border key could not reach — present
in the static texture **before any deformation**; the mesh merely
carried them. Drawn-overlap construction (B1) prevents seams
*opening under motion*; it would not have prevented this. The
practice that prevents it is **intake leak-test QC**, recorded as
Defect 6 in `WHAT-WE-DO-WRONG-ADDENDUM.md`, with the correction
carried into the method (`CORRECTED-METHOD.md`, addendum §A.1).
Everything else in this document stands as written; the second
pass re-tested it against the build records (addendum §C2).
