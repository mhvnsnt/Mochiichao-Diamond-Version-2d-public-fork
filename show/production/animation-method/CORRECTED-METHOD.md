# CORRECTED METHOD — the Mochiichao rig & animation standard

**Status:** stage-1 spec of the owner-ordered industry-method
programme (2026-10-28). This is the method rigs and cycles get built
to from here. It replaces the single-mesh deform-bone approach
entirely. Companion: `WHAT-WE-DO-WRONG.md` (the evidence and the
industry sources behind every rule here).

**The method in one paragraph:** a character is a kit of separate
drawings — one per body part — arranged in a peg hierarchy, with
joints built as drawn overlaps. Poses are planned on an exposure
sheet and authored pose-to-pose, contacts first. Any shape that
moving parts can't honestly produce is a **substitution drawing**
swapped in, not a deformation. Deformers are a garnish inside a part,
never the structure. Everything is verified on the **rendered
drawings**, never on the skeleton. The host tool for show rigs is the
one the show's pipeline already names — Tahoma2D cutout rigs with an
Xsheet (archive: mystery-coast production pipeline) — and every rule
below is stated in tool-neutral terms so it also binds any Blender /
compositor lane that touches character animation.

---

## 1. Rig construction

### 1.1 Part separation (non-negotiable)
Every character rig is built from **separate drawing layers, one per
part**. No single-skin meshes. No automatic weights spanning parts.
Standard part list for a humanoid:

- root / master peg
- hips → torso (lower) → torso (upper/chest)
- neck → head, with hair as its **own** part laid over the head part
  (drawn overlap — a hair/head seam can never open into a gap)
- face parts on the head: eyes (with blink/expression substitutions),
  mouth (substitution set, §2), brows where the design uses them
- per arm: upper arm → forearm → hand (hand = substitution library)
- per leg: thigh → shin → shoe/foot (foot = substitution set, §2.3)
- costume parts with natural separation points (skirt, jacket, bag)
  as their own parts, parented to the part they hang from — never
  painted into a neighbour's weights

Hierarchy rule: a part follows its parent; **nothing deforms a part
from outside its own layer.** Parts that must keep their drawn shape
(shoes, hands, head, hair) are never children of a deform chain; where
one must track a moving part, it follows the part's end-point
kinematically (position/rotation only).

### 1.2 Joint construction
- Each joint is a **drawn overlap**: both parts extend into a shared
  joint zone (the joint-circle construction); the upper part's
  outline stays continuous, the lower part tucks under it, and the
  seam is hidden by the overlap itself (patch/cutter in the host
  tool where line art needs it).
- **No drawn detail on the joints.** Decoration, pattern and line
  detail live inside parts, so rotation never chews artwork.
- Pivots sit at the anatomical joint centre, set on the peg, and are
  recorded on the character's rig sheet.
- Characters are **designed with seam-hiding features** where the
  canon design allows (collars, cuffs, skirt lines, hair mass) — the
  cel-era collar rule, applied at design time, not patched later.

### 1.3 Deformer policy
Deformers (bone/envelope bends *within* one part's drawing) are
permitted only for: gentle cloth sway, hair-mass sway, a slight spine
curve, a small cheat between neighbouring views. Forbidden: bending a
leg to fake a knee fold, bending a shoe, smearing any part across a
neighbouring part, and any use where the deform is the *only* way a
required pose exists — that pose gets a substitution drawing instead.

### 1.4 Views
Each character carries the views the show actually uses as
substitution sets on the same rig: **front, three-quarter, profile**,
plus back when a shot needs it ("only build what is necessary" — but
a walking character in a side-travelling shot gets a real profile
view; a front rig marched sideways is the v1–v4 error and is not
repeated).

---

## 2. Substitution-drawing sets (per character, built once, reused)

Every set is drawn to the model sheet, named, and stored in the
character's library. Minimum sets:

### 2.1 Mouth set
The Preston Blair 10 shapes, drawn for *this* character (Rest, A/I,
E, O, U, M/B/P, F/V, L/T/D/N/Th, hiss, W/Q) + character bonus shapes.
M/B/P closure is non-negotiable in use.

### 2.2 Eyes set
Neutral, blink (closed), and the expression range on the model sheet
(minimum 6). Blinks are drawings, exposed 2–3 frames.

### 2.3 Leg & foot sets — the set whose absence failed the ED gag
Per leg, per view used in motion (profile set is mandatory for any
travelling walk; front set for front-facing cycles):

- **contact-flat** — foot flat, planted, at full stride reach
- **support-bent** — support leg under load, knee bent over the
  planted foot (the recoil/down leg)
- **toe-off** — foot rolled onto the toe, heel up, pushing
- **swing-folded** — the swinging leg with the **shin folded back
  behind the knee line, drawn that way** — the knee fold exists in
  the drawing, so it cannot be smeared away
- **passing** — leg passing under the body, knee soft

Plus shoe variants where the pose changes the shoe's own shape
(flat / toe-roll / point). A shoe is never bent by a deformer; its
three shapes are three drawings.

### 2.4 Hand set
8–12 approved poses (open palm, fist, point, grip, thumbs-up,
relaxed, counting, beckoning, holding, + character specials),
mirrored for the other hand. No improvised hands in shots.

### 2.5 Hair & secondary sets
Hair poses per view (neutral + swing/settle variants) and any
signature secondary element (ribbons, tails, ears, capes) gets
follow-through variants or a within-part sway deform (§1.3) — timed
2–4 frames behind the body.

---

## 3. Cycle authoring protocol (walks; the pattern generalises)

1. **Cycle chart first, on paper/data before any drawing:** the
   phase order — CONTACT → RECOIL (down) → PASSING → HIGH POINT
   (up, toe-push) ×2 — with the exposure per pose (on 2s or 3s per
   §4) and the frames-per-beat count. The chart is a file in the
   character's library, not a note in someone's head.
2. **Draw the two CONTACT poses first**, as full part-assembly poses
   (parts posed + leg/foot substitutions selected). Contacts set the
   stride length. Both feet on the ground line, widest separation —
   separation peaks *here*, at a planted contact, never mid-air.
3. Then RECOIL (support leg = support-bent drawing, body at its
   lowest), PASSING (support still planted flat; swing leg =
   swing-folded/passing drawings), HIGH POINT (support leg pushing
   through the **toe-off** drawing — contact is kept through the toe;
   a walk has **no flight phase**).
4. **Bob is authored in the poses** (lowest at recoils, highest at
   high points), not added as a whole-sprite transform afterward.
5. **Stride calibration:** measure the drawn stride (contact-pose
   foot separation) and set the composite travel step so the support
   foot's screen velocity across its support run is ≈ 0. Travel is
   derived from the drawings; the drawings are never stretched to
   fit a travel speed chosen first.
6. Personality variants come from **retiming the same drawings**
   (hold the recoil longer = heavy; drop the high point = sneaky),
   per the playbook — not from re-posing the rig.
7. Non-humanoid cycles follow the same discipline per gait (four-beat
   for grounded quadrupeds): contacts first, one foot down at all
   times in a walk, folds drawn not deformed.

---

## 4. Timing conventions

- Master timeline 24 fps.
- **Cycles:** on 3s for chibi/ED and limited-animation registers
  (8 poses/sec — the gag's established house timing), on 2s for
  standard dialogue-scene body animation; 1s reserved for smears,
  impacts, and fast accents. A smear is exposed on 1s only.
- **Holds:** a held pose is held *parts*: the moving part animates,
  the rest holds; held characters get moving holds (breath, blink
  every 3–5 s, weight shift) — never a whole-body sway loop, never a
  whole-sprite transform.
- **No blanket interpolation.** Interpolation/smoothing is used only
  where a timing chart explicitly marks it. Stepped exposure is the
  default and the style.
- Walk tempos are locked to **fixed frame counts per beat**
  (metronome discipline) so cycles sit on the music/dialogue grid.
- Lip-sync (where dialogue exists): mouth substitutions on held
  shapes, audio leads picture by 1 frame, shapes held 2–4 frames.

---

## 5. The gates — verification in drawn space (from the v5 diagnosis)

No FK/bone checker is a gate anymore. A cycle or shot passes only on
measurements of its **rendered pose stills and composited frames**,
using the v5 instruments (lift table, support-stick table, reach
table) against these targets:

| Gate | Target |
|---|---|
| Contact | contacting shoe lift = **0** at both contact poses |
| Support stick | support shoe screen velocity **≈ 0 ±3 px/slot** across its whole support run |
| Support continuity | a foot at lift 0 in **every** pose of a walk (8 of 8); high points keep a toe down, support lift ≤ ~6 still px |
| Shoe read | shoe **forward reach > backward reach at every pose**; toe direction toward travel at every pose |
| Knee read | in swing poses the drawn shin sits **visibly behind the knee line** (fold present in the pixels, not just the pose data); knee point stays in line — no off-line bow beyond the leg's drawn width |
| Silhouette | every key pose passes the black-fill silhouette test (action readable with all detail removed) |
| Phase order | contact sheet matches the cycle chart's phase order; bob lowest at recoils, highest at high points |
| Owner eye gate | contact sheet + forward/reversed pair go to the owner **before** any full recomposite; production starts only on his viewing verdict |

Plus the standing pipeline gates, unchanged: proof stage (reopen,
probe, hash; `visual_qc` stays PENDING until a human looks) and the
per-shot checklist (model sheet → X-sheet → keys → in-betweens →
principles → clean-up → likeness → QC at speed, at 0.25×, and
frame-by-frame).

---

## 6. What changes for the show pipeline generally

1. **Model sheet before rig — as a hard gate.** Turnaround,
   expression sheet, mouth chart, hand set, colour model with hex
   values, scale chart, construction notes (archive template). No
   sheet, no rig, no exceptions — the checklist's Step 1 becomes a
   build rule, not a review item.
2. **The single-mesh rig format is retired.** Existing mesh rigs are
   reference/provenance only; no new animation is authored on them.
3. **X-sheet per shot** (dialogue first), pose-to-pose only;
   straight-ahead is for effects elements.
4. **Libraries are the asset.** Per-character part libraries,
   substitution sets, and stock cycles are built once, versioned in
   the parts catalog with CURRENT marking per the current-version
   law, and reused across episodes. A cycle is a show asset, not a
   per-episode rebuild.
5. **Clean-up is a real pass**: lines traced to the show's line
   standard, details locked to their part's geometry (no detail
   swimming), layers separated at clean-up if they weren't at build.
6. **Dialogue-first stays.** Script → scratch VO → record → animatic
   lock → animate to the audio. The failure was rig construction,
   not the audio-first spine.
7. **Shadows stay in post** (standing no-baked-shadows rule): part
   drawings carry no baked ground/contact shadow; contact reads come
   from planted feet + post shadow, in that order.

---

## 7. Rebuild plan — Mochiko's ED-gag walk under this method

In order. (Execution is a later stage; this is the plan of record.)

1. **Freeze.** v4 stands rejected; the mesh rig is retired for this
   character's animation. No v5 bone pass, no weight repaint — the
   diagnosis's Options A/B are superseded by this method (they
   repaired a construction the industry doesn't use).
2. **Model sheet completion for Mochiko** (archive template):
   confirm turnaround incl. a true **profile** view, colour model,
   scale vs the ED cast, construction notes — including the hair
   construction note: hair is a separate part overlapping the head.
3. **Part-separation build:** split Mochiko's approved art into the
   §1.1 part list for front and profile views; build joint overlaps;
   set pivots; record the rig sheet. Hair/head built as overlapping
   parts — the owner's white-gap catch is closed here, by
   construction, and verified on the pose stills (a stretched skin
   was the only thing that could open that gap).
4. **Substitution sets:** draw the §2 sets for Mochiko — profile and
   front leg/foot sets first (contact-flat, support-bent, toe-off,
   swing-folded, passing), then hands, eyes/blinks, mouth (already
   specced by the bible work), hair variants.
5. **Cycle chart** for the ED walk: 8 poses, on 3s, phase order per
   §3, frames-per-beat locked to the ED music grid; personality
   beats from the gag spec (skip, look-back) charted as pose
   substitutions on the chart, not improvised in the rig.
6. **Author contacts first**, then recoil/passing/high-point, per
   §3, in profile (the ED line travels sideways; the format is a
   side-view line). Measure the drawn stride; set the line's travel
   from it.
7. **Gate in drawn space** (§5): pose stills through the lift /
   stick / reach / knee instruments; silhouette test; contact sheet
   + forward/reversed pair **to the owner before compositing**.
8. **On the owner's pass:** composite the full line (the other four
   walkers get the same treatment in their own passes — quadruped
   cycles per §3.7 where the species is four-legged, float grammar
   where the species floats — each gated the same way), proof stage,
   PR with the registry updated (new cycle marked CURRENT, mesh-rig
   versions marked superseded-as-method).
9. **Then generalise:** the same build order becomes the template
   for every show rig, in cast-priority order, and the parts catalog
   gains the substitution sets as first-class entries.

*End of spec. Stage 1 deliverable — nothing above has been built yet;
the rebuild is stage 3 of the programme, after the pull-in lands.*

---

## ADDENDUM §A — dated 2026-10-28 (second-pass audit; originals above kept)

**Governing principle — the owner's first-time-right directive
(Jamar, 2026-10-28, standing):** *"do better work going forward
and be more accurate and pull in whatever gets it more accurate
and correct the first time and wire that up permanently into the
repo."* Accuracy-improving kit gets pulled in and wired
permanently, not consulted ad hoc. The rules below are that
directive applied to the six defects the second pass found
(`WHAT-WE-DO-WRONG-ADDENDUM.md`, defects 6–11). They bind every
lane that builds or renders show animation, alongside §§1–7.

### A.1 Cutout intake gate (Defect 6)
No keyed texture enters a rig until it passes, in order:
1. **Enclosed-region scan** — flood from the image border; any
   opaque region the flood cannot reach is un-cut background and
   is removed or the texture is rejected. No exceptions recorded
   as "known limits."
2. **Contrasting-field inspection** — the cutout composited on
   dark, light, and magenta fields, inspected at intake; fringe
   or residue at the silhouette is cleaned before the rig build,
   not noted for later.
3. The intake result (scan counts, inspection frames) is filed
   with the texture's provenance record.

### A.2 Joint inventory & build warnings (Defect 7)
- Before animation, a rig's joints are inventoried against the
  character's anatomy and the production's action list (§A.5):
  every needed joint **exists, at its anatomical centre** (a knee
  is at the knee; an ankle is at the ankle). A leg of hip→mid-shin
  + mid-shin→toe does not pass.
- Any build-tool warning attached to a part (weight clamps, cells
  outside the silhouette) is a **blocking defect for that part**
  until inspected and cleared in writing. "Renders clean anyway"
  is not a clearance.

### A.3 Frame-exact rendering (Defect 8)
The renderer samples poses exactly at their authored frame
points. A rendered still must match its authored pose; cross-pose
blending at sample points is a pipeline defect, fixed in the
sampler — never shipped as a rounding error and never absorbed
into a pose's measurements.

### A.4 Chibi forms are built models (Defect 9)
Chibi forms are built from the character's model sheet,
registered as proportion variants with proportions derived then
**locked per character**, and passed through the anchor +
silhouette gates — per the show's Chibi Model Spec
(`show/production/CHIBI-CARD-SYSTEM.md` §4). A compositor scale
factor (uniform or anisotropic) is not a proportion system, and
non-uniform scale is never used as an acting tool (no squash
kneels, no scaleY bows).

### A.5 Action-coverage at rig build (Defect 10)
Every rig build starts from a written **action list** for the
production (the actions this character must perform in these
shots). Each action maps to parts and joints that exist in the
rig. A missing action has two exits, decided before animation:
build the part, or redesign the action in the staging on paper.
Faked locomotion (rock, waddle, drift presented as walking) is
not an exit.

### A.6 Defect disposition (Defect 11)
A written defect in any build record is a **blocking ticket**
with exactly two exits: **fixed**, or **waived by the owner in
writing**. "Known limit," "shortfall," and "candidate for a later
pass" are abolished as shipping categories. The proof stage's
QC_PENDING hold is the enforcement point: work carrying an open
ticket does not move gates.
