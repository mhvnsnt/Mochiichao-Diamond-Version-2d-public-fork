# WHAT WE DO WRONG — ADDENDUM: defects 6–11 (second pass, 2026-10-28)

**What this is:** the second-pass audit the owner ordered on
2026-10-28: go back through the archive (Cartoon Network / Disney
Channel / Nickelodeon production material and the technique repos)
and through our own build records, and find what ELSE we got wrong
beyond the five defects in `WHAT-WE-DO-WRONG.md` — *"other than
those five things."* It also corrects one of the five whose
write-up was itself wrong (§C1), and lists the candidates that were
tested and **cleared** (§D) — an honest cleared list matters as
much as the findings.

Grades, same as the parent doc: **MEASURED** (our own files and
numbers), **ARCHIVE** (a named file in Jamar's archive repos),
**DOCS** (published guidance). No characters, character names, or
studio assets are used — techniques and conventions only.

The five stand. What follows is what they didn't cover.

---

## DEFECT 6 — Nobody ever leak-tested a cutout: keying residue shipped as a "known shortfall"

The hair gap was not a deformation accident. Mochiko's rig texture
was made by keying the background off her canon sheet **from the
border inward** — a method that can only remove background that
touches the image edge. Three pockets of the sheet's pale field
colour are completely enclosed by her drawing (two fields flanking
her neck between the twin-tails and the jaw/collar, one wedge
inside the right tail's strands). The key never reached them, so
**29,299 pixels of un-cut background shipped inside the texture**
(MEASURED — `~/workspace/ep01-ed-gag/work/mochiko-hair-fix/FIX-NOTE.md`,
pixel-diff verified). A second residue from the same keying — a
faint light fringe on the hair silhouette — was written into the
rig notes at build time as a *"clean-up pass candidate"*
(MEASURED — `~/workspace/still-to-build/human-rigs/mochiko/RIG-NOTES.md`).

Our pipeline did run one alpha check: a row audit under the feet,
looking for a baked shadow band (MEASURED —
`~/workspace/still-to-build/human-rigs/PROVENANCE.md`). It never
ran the check that finds enclosed pockets: flood the border, and
any opaque region the flood can't reach is un-cut background. It
never composited the cutout over contrasting fields (dark, light,
magenta) to inspect the alpha — the test the fix lane eventually
improvised on its own. And the residues it *did* know about were
carried into the episode lane's rig notes as "known limits… not
altered here" (MEASURED — `~/workspace/ep01-finish/rig/RIG-NOTES.md`)
and shipped in two productions.

The archive prescribed both missing steps before this rig was
built. The QC checklist's cleanup gate includes **"No gaps at
intersections (paint-bucket leak test)"** (ARCHIVE —
`animation-techniques-archive/research/QC-CHECKLIST.md`, Gate 4) —
a leak test *is* the enclosed-pocket test. And the archive's
clean-cuts research (dated 2026-10-10, written after the owner
called out bad cuts on an earlier rig test) already prescribed
real alpha mattes over cheap segmentation for character cutouts
(ARCHIVE — `animation-techniques-archive/research/CLEAN-CUTS-TOOLKIT.md`).

**The correction now in the method:** asset intake is a gate, not
a hope. Every keyed texture passes (1) an enclosed-region scan —
any opaque region unreachable from the border is a defect, full
stop; (2) inspected composites on dark, light, and magenta fields;
(3) a silhouette fringe check. A failure blocks the rig build.
(See `CORRECTED-METHOD.md`, addendum §A.1.)

## DEFECT 7 — The skeleton has no knee and no ankle: the joints don't exist

The five defects say we posed bones instead of drawing poses, and
that the drawn knee never folds. Underneath both sits a cruder
fact the first pass didn't isolate: **Mochiko's skeleton contains
no knee joint and no ankle joint at all.** Her leg is two bones —
`leg_*` running hip → **mid-shin**, and `foot_*` running **mid-shin
→ toe** (MEASURED — `BUILD-NOTES-v4.md` §1, rig anatomy note; bone
list in `~/workspace/ep01-finish/rig/RIG-NOTES.md`: 15 bones, per
leg only `leg` and `foot`). The pivot the animation rotates as a
"knee" sits halfway down the shin, and the "foot" bone spans the
lower shin and the shoe as one rigid piece. Even a perfect posing
pass rotates the leg around points that are not joints. The
episode lane hit the same wall from the other side: her kneel is
recorded as a deform approximation with the note *"(no knee joint
exists in a front-view whole-image mesh)"* (MEASURED —
`~/workspace/ep01-finish/rig/RIG-NOTES.md`, kneel approximation
label).

The builder flagged the feet on day one and the flag was waived:
the rig build's own warnings record **foot_l 7 and foot_r 17
weight cells clamped** (arm_r 32), with the disposition *"idle
renders clean anyway; revisit if the right arm ever tears"*
(MEASURED — still-to-build RIG-NOTES). The feet that later failed
four versions were named by the build tool before a single pose
was authored.

Industry construction puts pivots at anatomical joint centres and
records them on the rig sheet (the construction-notes discipline,
parent doc B1/B6; the corrected method's §1.2 already states the
rule — this addendum records that the retired rig violated it in
this specific, mechanical way).

**The correction now in the method:** a rig's joint inventory is
checked against the anatomy before animation — every joint the
character's action list needs exists, at its anatomical centre,
or the rig doesn't ship. Build-tool warnings on a part are a
blocking defect for that part, not a footnote. (Addendum §A.2.)

## DEFECT 8 — The renderer blends the drawings: no shipped frame is exactly an authored pose

The gag's stepped timing was real at the authoring level — and
contaminated at the render level. The sheet-driver that renders
the rig **samples a hair past each frame's start**, so a rendered
pose can blend a trace of the *next* pose. This is not inference:
when v3 re-authored only poses 4–7, pose 3's render — a pose
nobody edited — shifted by 0.02% of its vertex checksum because
its sample now caught a trace of the new pose 4. The build record
states the same sampling behaviour existed in v2 (MEASURED —
`BUILD-NOTES-v3.md` §2). So across v2–v4, the "held drawings" the
owner was shown were, at the sample points, blends of neighbouring
poses — small, but the pipeline's core promise (this frame *is*
this drawing) was not being kept by the renderer itself.

In the industry method, exposure is exact: the drawing on the
exposure sheet is the frame that ships, and the proof stage
checks frames, not intentions (parent doc B5/B8; ARCHIVE —
TRIPPEDD proof stage, `PIPELINE.md`).

**The correction now in the method:** frame-exact sampling is a
render-pipeline requirement. A rendered still must match its
authored pose at the sample point; any cross-pose blend is a
pipeline defect to fix in the sampler, never a rounding error to
ship. (Addendum §A.3.)

## DEFECT 9 — Chibi by squash: the proportions were a scale factor, not a model

Every chibi in the gag — the human lead included — was produced by
**anisotropic squash: the full-size animation scaled ×0.60
vertically** (MEASURED — `BUILD-NOTES.md` v1, "Method"; repeated
in `BUILD-NOTES-v2.md` §2). The squash doesn't live in any model
file: it is applied in the compositor's scale arithmetic
(MEASURED — `work/v2/composite_v2.py`, the 0.60 factor in the
per-character scale and baseline computation).

The show's own Chibi Model Spec requires the opposite process:
a chibi model is **built from the character's model sheet**,
its proportions "derived, then locked per character" (humans
~2.5 heads tall), with a gate-enforced never-change anchor list
and a silhouette read (ARCHIVE-of-record, the show's own system —
`show/production/CHIBI-CARD-SYSTEM.md` §4). A uniform vertical
squash cannot satisfy that spec *arithmetically*: head and body
scale together, so the head-to-body ratio — the thing that makes
a chibi a chibi — is exactly the full-size ratio, widened. The
gag's Mochiko is a flattened full-size figure, not a locked
2.5-head chibi model; no chibi model, anchor check, or chibi
likeness gate appears in any build record. (Stated plainly: the
owner approved v1's overall look on viewing, then demanded the
animation improve 2–3×. The proportions were never his named
complaint. This defect is non-compliance with the show's own
spec, measured against the spec — it caps how right the chibi
read can get, and it is recorded as a process defect, not as a
claim about his reaction.)

The same habit appears in the episode lane: the kneel was
achieved with root scaleY 0.93 and spine scaleY 0.88 — squash
used as acting (MEASURED — ep01-finish RIG-NOTES).

**The correction now in the method:** chibi forms are built,
registered, gated assets per the Chibi Model Spec — never a
compositor scale factor. Non-uniform scale is not an acting tool.
(Addendum §A.4.)

## DEFECT 10 — Walking characters shipped without legs: no action-coverage pass at rig build

The gag is a five-character **walking line**. Two of its walkers
cannot step: Kittember's rig has no leg bones (root/body/head/
tail/flame) and neither does Sproutle's (root/body/head/sprout);
their locomotion was "played as stepped body-rock/waddle poses"
and shipped as walking (MEASURED — `BUILD-NOTES-v2.md` §4). The
lead's episode-lane walk is a bob clip of which the rig notes say
*"reads as walking only when the layer drifts (no leg
articulation beyond ±4° sway)"* (MEASURED — ep01-finish
RIG-NOTES). The rigs were built to a generic bone template —
15 bones for the human, five-ish for the creatures — with no step
that asked: **what must this character DO in this production,
and does the rig contain those actions?**

In the industry method the rig is built against the production's
action requirements: the model pack and pose libraries are
per-character action sets, built before the shots that need them
(parent doc B2/B6). A character who must walk gets legs, or the
staging is redesigned on paper so the character's actual
locomotion is the performance — never rock-and-drift wearing a
walk's clothes.

**The correction now in the method:** every rig build starts
from a written action list for the production. A missing action
has exactly two exits — build the part, or redesign the action
in the staging — decided before animation begins. (Addendum §A.5.)

## DEFECT 11 — Documented-and-shipped: a written defect was a footnote, not a block

Lay the instances side by side:

- Un-keyed pockets: written into rig notes as a known limit,
  shipped into the episode lane and the gag (Defect 6).
- Hair fringe: written up as a "clean-up pass candidate,"
  shipped (Defect 6).
- Foot weight clamps: written up by the builder, disposition
  "revisit if it tears," shipped (Defect 7).
- Pose-3 render blend: measured, recorded, shipped (Defect 8).
- EP01's N4 audio bed landed 0.4 LU outside its loudness band
  and was documented as a known defect — **and this one the loop
  closed**: a coordinator repair brought it to −14.03 LUFS /
  −1.00 dBTP, in band, with the pre-repair file preserved
  (MEASURED — `~/workspace/ep01-finish/audio/BEDS.md`, coordinator
  repair note). It is cited here as the exception that proves the
  standard is achievable inside our own pipeline.

The pattern is the defect: detection worked, repeatedly, in
writing — and the default disposition was ship-with-footnote.
The five defects are about measuring the wrong object; this one
is about what happened when we measured the *right* thing.
Nothing forced a fix-or-waive decision, so the footnote became
the decision.

The archive's rule is one sentence: **"No shot moves gates with
a known defect. 'Fix it in comp' is banned."** (ARCHIVE —
`animation-techniques-archive/research/QC-CHECKLIST.md`.) The
proof stage holds work at QC_PENDING until a human looks
(ARCHIVE — TRIPPEDD `PIPELINE.md`) — looking is supposed to be
able to *stop* something.

**The correction now in the method:** a written defect in any
build record is a blocking ticket with two exits — fixed, or
waived by the owner in writing. "Known limit" is abolished as a
shipping category. (Addendum §A.6.)

---

## §C — CORRECTIONS TO THE FIRST PASS

### C1. The hair gap was misdiagnosed in `WHAT-WE-DO-WRONG.md` — corrected

The parent doc (Defect 1, final paragraph, and mapping-table
row 3) attributes the hair/head gap to the one-skin construction:
*"One stretched skin is exactly the construction that opens gaps
at seams — pull the surface and it thins where two regions
meet."* **That mechanism is wrong for this gap.** The fix lane's
pixel work proves the gaps were fully-enclosed un-keyed
background pockets that existed in the static texture **before
any deformation**; the mesh merely carried them (MEASURED —
FIX-NOTE: the pockets' pixels were the sheet's field colour,
fully opaque, enclosed by art; the diff is confined to the three
pockets). Drawn-overlap construction prevents seams *opening
under motion*; it would not have prevented this — the preventing
practice is intake leak-test QC (Defect 6). A dated correction
block carrying this wording is appended to
`WHAT-WE-DO-WRONG.md` itself; the original text is kept, as the
record discipline requires.

### C2. What was checked and stands

The remaining four defects and the Part B industry account were
re-tested against the build records in this pass and stand as
written. One framing note, for precision rather than correction:
the parent doc folds travel-calibration (stride set after the
drawings exist) into its Defect 3 evidence and mapping row 6
rather than numbering it separately; the owner's five-item
summary counts it as its own item. Both readings describe the
same measured facts; no wording change is made.

---

## §D — TESTED AND CLEARED (no independent defect grounded)

- **Spacing / easing charts.** The gag's uniform on-3s exposure
  is the documented house register for this format, and the holds
  measure exact (224/335 held pairs, v2–v4). The one spacing
  failure in the record — v2's 201-unit ankle snap — was a
  phase-construction error, diagnosed and fixed as such in v3,
  not an easing defect. The archive checklist's "varied spacing —
  not constant velocity" line (QC-CHECKLIST Gate 3) is noted as a
  watch item for dialogue-scene work; it does not ground a gag
  defect.
- **Secondary motion / follow-through.** Present and authored
  from v2 on: twintails lag one pose behind the body, the sprout
  lags at ×1.7 amplitude, smoke counter-sways, the tail flame
  flickers in stepped poses (BUILD-NOTES-v2 §2); in the episode
  lane, walk_bob's twin-tails peak ~3 frames after the body beat
  (ep01-finish RIG-NOTES). The one secondary-motion failure —
  arm bones dragging the belt-bag — is weight bleed, already
  counted as Defect 1.
- **Anticipation & staging.** Anticipation is authored (the hop
  cycle opens with anticipation squash; the skip and look-back
  beats are posed and slot-placed), and the gag's staging was
  frame-sampled at five timepoints in v1. No violation grounded.
- **Frame economy.** The cycle loops by construction (an 8-pose
  cycle repeated across the 112-slot grid); unchanged characters'
  stills were reused byte-identical across v3 and v4; stepped
  exposure is the held-cel economy in effect. Full-canvas rebakes
  were version iteration, not shipped waste. Cleared.
- **Sound-first / dialogue-first ordering.** Episode lane: scene
  audio beds — with the spine's lines riding as voice-scratch, as
  designed — were gated per scene before the finish build, and
  the build conformed to them (MEASURED —
  `EP01-V3-DELIVERY-LEDGER.md`; BEDS.md). The episode's new cuts
  carry no human dialogue by design (intertitles under the
  Subtitle Law), and the gag is silent by design (the ED bed
  lives in the master). The ordering was honoured where it
  applies; this candidate transfers to dialogue episodes (EP02+)
  as a standing check, not a finding.
- **Colour / palette discipline.** Character palette was
  inherited unmodified from the canon textures — the rig deforms
  the canon pixels themselves, hashes recorded (PROVENANCE;
  RIG-NOTES likeness note). No repaint, no measured drift. The
  only colour-adjacent failure in the record is the pale-pocket
  read against dark backgrounds — Defect 6. No independent
  violation grounded.
- **Model discipline, full-size forms.** A locked canon model
  sheet exists (Mochiko v2, hash-recorded in PROVENANCE), and the
  rig texture is that sheet keyed — no redraw, no drift by
  construction. On-model failure across poses enters only
  through the mesh (Defect 1) and the chibi derivation
  (Defect 9). Cleared as an independent class.
- **Registration / ground plane (cross-character).** The
  compositor anchors all walkers to a shared baseline (608;
  the floater rides higher by design), with per-character
  placement derived from reference-pose bounding boxes
  (composite_v2.py). No cross-character ground mismatch was
  measured in any version. The anatomical-pivot half of this
  candidate is a real finding — inside the skeleton, as
  Defect 7; composite registration itself is cleared.

---

*Second pass, 2026-10-28. Companion corrections are folded into
`CORRECTED-METHOD.md` as its dated addendum §A, including the
owner's first-time-right directive as a governing principle.
No gag files were touched; the v6-industry rebuild was not
disturbed.*
