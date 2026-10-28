# THE GENERATED-TURNAROUND PIPELINE — the pipeline of record for generated character animation

**Owner order, 2026-10-28:** adopt this pipeline, wire it into the
repo, and use it for generated character work in place of assembling
cutout puppets from front-facing art. The owner's words in
substance: pull all of it in, find the open-source / free /
industry-standard pieces, combine them, wire them up, and start
using that instead.

**Registry:** this route is Industry Method **v1.3** in
`METHOD-REGISTRY.md` (this folder). It folds in v1.2 unchanged —
the timing standard, the above-floor layer, and the likeness gate
apply to generated clips exactly as they apply to drawn ones.

**The route in one paragraph.** Front-facing canon art goes in.
(A) A vision model diagnoses the art against the 20-point
structural defect audit. (B) A corrected multi-angle turnaround
sheet is generated under a design-inventory prompt built from the
character's canon record. (C) The sheet's side-profile cell
animates image-to-video on the landed scene-job path. (D) Frames
are sliced and packed into a sprite sheet + atlas for game use.
(E) Every output passes the proof gates before it is shown as
anything. The point of the route is the point of the reference the
owner supplied (see the REFERENCE BAR section): the profile is
*generated as a profile*, so the defects that come from dragging
front-facing parts sideways never exist in the first place.

---

## STEP A — DIAGNOSE (vision-model structural pass)

- **Checklist, as data:** the audit of record is the proof
  gate's `show/production/tooling/proof-gate/audit-checklist.json`
  (landed with `delivery_gate.py` by PR #489 — the delivery
  gate's data, its item 0 being the frame-1 anchoring check).
  This pipeline's diagnosis step carries the same audit
  re-expressed for a vision model in
  `show/production/tooling/turnaround-pipeline/diagnosis-checklist.json`
  — one audit, two consumers; if they ever disagree, the
  proof-gate file wins. The 20 points are the defect audit the
  owner caught into existence on 2026-10-28 (front face on a
  profile body, front torso, neck
  notch, hair in its front arrangement, backpack slab, arm slab,
  viewer-facing shoe, march high-points, missing far arm, floating
  hair furniture, far-side face furniture, jars at one depth /
  buried, front static skirt + solve slash, leg separation, frozen
  hair, frozen expression, head squash, edge fringe, neck perch,
  recoil direction + rigid torso), plus the four original v5
  drawn-gate items (ground contact/stick, drawn knee fold, no
  flight phase, toe-end calibration) carried as items 21–24.
- **How it runs:** the input art (a character's poses or a clip's
  frames) and the checklist go to the vision model; it returns,
  for every item, PASS / FAIL / NOT VISIBLE with the frame or pose
  it judged. A partial audit is never reported as complete. Any
  FAIL on items 1–20 means the art may NOT be assembled into a
  cutout puppet; it routes to Step B (or to a drawn profile
  sheet). The diagnosis reports verdicts per item; it never grades
  the character.
- **Backend — WIRED at the interface level:** Qwen2.5-VL-7B-Instruct
  (Apache-2.0; weights staged in the private Kaggle dataset cache,
  16.6 GB), through the parity lane's landed contract:
  `show/production/tooling/avatar-stack/parity/QWEN-WIRING.md` and
  `qwen_prompt_extension.py` — the same image-in / structured-text-out
  endpoint shape (kernel-side runner, `gate_verdict` pattern) that
  already serves prompt extension and the likeness gate's advisory
  Qwen verdict. **Stated plainly:** that contract has live run
  records for prompt extension; a dedicated DIAGNOSIS run (checklist
  in, per-item verdicts out) has not been run yet. The checklist,
  the endpoint, and the call pattern are wired; the first diagnosis
  run is owed, and its record lands in the proof-gate run files
  when it happens.

## STEP B — TURNAROUND (corrected multi-angle sheet)

- **What it makes:** one sheet, four views in a row on a plain
  white field — front, three-quarter, side profile, back —
  identical design in every view, from the character's canon art.
- **The prompt is a DESIGN INVENTORY, never a free description:**
  every canon feature is an explicit hard constraint that must
  survive in EVERY view, including the profile. The inventory is
  written from the character's canon record (the character-bank
  manifest, schema `mochiichao-show/character-bank/v1` —
  `show/production/tooling/avatar-stack/helpers/05_character_bank_schema.json`)
  at job build time. Worked example, built from Mochiko's canon
  record (canon art of record:
  `public/assets/show-canon/humans/mochiko-v2.png`):
  `show/production/tooling/turnaround-pipeline/mochiko-design-inventory.example.json`
  — TWIN TAILS with teal scrunchies (in profile: both tails behind
  the shoulder line, both scrunchies visible), teal eyes (profile:
  ONE eye, gaze along travel), navy jacket + teal trim + star pin,
  three waist capsule jars (profile: receding, none buried),
  pleated skirt (profile: wrapped side silhouette), tights
  (far-leg treatment), sneakers (profile shoe DRAWN long, toe
  forward — never stretched, never head-on), both arms with hands.
- **Job builder:** `build_turnaround_job.py` (same folder) reads
  the bank record + inventory and emits the turnaround job. It
  REFUSES to run without an inventory file — the constraint list
  comes from the canon record or the job does not exist.
- **STATUS: SPEC — THE GAP, FLAGGED IN WRITING.** The landed
  scene-job format v2 (`mochiichao-show/scene-job/v2`) has **no
  image-to-image job type**, and no landed driver consumes one.
  Components exist in the landed stack — LightX2V's Qwen-Image
  I2I configs (`show/production/tooling/full-stack/lightx2v/configs/disagg/qwen/qwen_image_i2i_*.json`)
  — but a config family is not a driver. So: the builder emits
  this step's job stamped `SPEC_NOT_RUNNABLE` with the gap written
  inside the job file itself. Wiring Step B means building that
  one driver. Until it exists, nobody calls Step B wired.

## STEP C — ANIMATE (image-to-video from the corrected sheet)

- **WIRED — the landed format and path.** The animate job is a
  scene job in the LANDED format
  (`show/production/tooling/avatar-stack/freedom/job_format_v2.md`,
  schema `mochiichao-show/scene-job/v2`): the character's `cutout`
  is the turnaround sheet's side-profile cell, segments are free
  text, and the wired path runs them —
  `run_backend.py` per segment → `chain_segments.py` (last-frame
  chaining) → `white_matte.py` (transparent twin) →
  `scene_composite.py` (over the scene's CURRENT living
  background, contact shadows at composite time only). Prompt
  wording starts from `prompt_library.json` where a canon action
  already has a proven wording; the Qwen prompt-extension pre-pass
  (Step A's backend) applies here unchanged.
- **Backend:** the native ComfyUI Wan/VACE route on the staged
  weights (Wan 2.2 / VACE, Apache-2.0) — the full-stack route
  landed 2026-10-28. **Likeness status: UNPROVEN.** The only
  graded generation evidence on this stack remains the baseline
  plain-I2V FAIL (frame 1 already the wrong character — the
  reference never anchored). This pipeline exists to fix exactly
  that — the corrected sheet is a stronger, view-correct anchor
  than a front cutout — but until a gated run passes, UNPROVEN is
  the word, and Step E is where it gets proven or not.

## STEP D — EXPORT (frames → sprite sheet + atlas, for game use)

- **WIRED — landed working code.** `slice_pack.py` (same folder,
  Pillow only): frame directory in → one trimmed PNG per frame, a
  horizontal sprite sheet, and an atlas JSON (schema
  `mochiichao-show/sprite-atlas/v1`) recording each frame's sheet
  rect, original canvas size, and trim offset, so an engine can
  restore original placement. Video → frames is the standard
  ffmpeg extraction step used across the repo.
- **Self-test (run at landing, 2026-10-28):** 8 synthetic frames
  (a figure on a padded transparent canvas) → sprite sheet
  328×105 px (exactly the sum of the trimmed widths), atlas
  parses, frame 0 trim offset (30, 16) matches the drawn figure's
  position exactly; an empty frame correctly exits with an error
  (an empty frame in a character clip is a defect, not a sprite).

## STEP E — GATES (nothing skips these)

1. **Input logging + frame-1 check:** every generation run logs
   its exact input image + sha256; the first frame of the output
   is checked against it — a wrong frame 1 is a
   "reference never anchored" FAIL, distinct from drift.
2. **Timing:** `show/production/tooling/proof-gate/verify_proof.py`
   headline = measured new drawings per second with the register
   floors named (scene 12/sec, credits 8/sec, accents 24/sec;
   ~3/sec and under is the FAILED class). Generated continuous
   motion interpolates by nature — the timing profile is reported
   as measured, and a clip whose motion is pure interpolation
   between held poses carries the interpolation signature flag,
   same as any other clip.
3. **Likeness:** `verify_proof.py --likeness <corrected sheet's
   profile cell>` with `--comparison-sheet` recorded — a run
   record without a comparison sheet is INCOMPLETE. Comparing
   against the corrected sheet is same-view against same-view:
   the front-vs-profile confound that limited the v7 diagnostics
   does not exist on this route.
4. **The delivery wrapper:** deliveries run under the
   pre-delivery gate — `show/production/WORKING-RULES.md` and
   `show/production/tooling/proof-gate/delivery_gate.py`
   (PR #489) — whose checklist is the audit of record named in
   Step A. This pipeline's gates feed that gate; they do not
   replace it.
5. **Grading law:** the checker reports; it never grades. Wrong
   character = FAIL, full stop, judged by the owner's eye
   (Gate 8). The delivery states the likeness judgment in plain
   words before any measured axis (the registry's standing
   delivery requirement).
6. **Diagnosis re-run:** the finished clip's frames go back
   through Step A's checklist. A clip that re-introduces an audit
   item (a jar morphing is item 12's family; a face sliding
   front is item 1) fails the route's own standard even before
   the owner's eye.

---

## REFERENCE BAR — the owner's Gemini clip (reference evidence, NOT canon, NOT a deliverable)

- **The clip:** `~/workspace/user/media_library/video/ab/ab91aa523190ddedcecad80b9568192f2cb125d4bf21811bd5787c9be0a0fe27.mp4`
  — sha256 `ab91aa523190ddedcecad80b9568192f2cb125d4bf21811bd5787c9be0a0fe27`
  (verified at landing time), 1280×720, 24 fps, 240 frames,
  10.0 s. Supplied by the owner 2026-10-28 with the order that
  produced this pipeline. Generated on Google's hosted
  video-generation endpoint from Mochiko's model-sheet art.
- **Measured record (Doro, 2026-10-28):** consecutive-frame
  differences — 0.0% near-identical pairs, mean diff 2.602
  (range 1.7–3.4): continuous generated motion in every frame,
  with NO timing modulation (no charted holds, accents, or
  settle — it moves the whole time at one even gait). Against
  this house's timing standard that evenness is itself a named
  shortfall: the route's Step C output is expected to be charted
  and re-timed, not shipped at the generator's default gait.
- **Profile correctness — PASSES the audit's view items:** a true
  side profile throughout (head, torso, hair, and limbs track as
  a turned figure, not front parts dragged sideways); gaze along
  the direction of travel; the backpack reads as a side mass;
  profile shoes with toe forward; arms swinging in opposition;
  knees folding in the pixels; feet planting without the
  front-foot flat plant and without parade-step height. This is
  the existence proof for the route: the structural errors of the
  cutout era are absent because the profile was generated as one.
- **Design deviations — RECORDED, and they are why this clip is
  a bar and not a master:**
  1. **Single ponytail** — canon Mochiko wears TWIN TAILS. The
     generator simplified her most recognisable feature away.
  2. **Jar contents morph between frames** — the creatures in the
     waist jars do not hold their designs across the clip.
  3. **Line thinner than canon** — the drawn line weight is
     visibly finer than the canon art's.
  These three are exactly what Step B's design-inventory prompt
  and Step E's likeness gate + diagnosis re-run exist to catch
  on our own route.
- **Licence status of the reference:** produced on a PAID hosted
  endpoint (Google's). Recorded as paid. It is not used as an
  asset, not staged as production material, and nothing in this
  pipeline calls that endpoint.

---

## LICENCE HONESTY (verified buckets, per the standing law)

| Piece | What it is | Bucket |
|---|---|---|
| Google hosted video generation (the reference's route) | Hosted endpoint, paid | **paid** — recorded, not used |
| Wan 2.2 / VACE (Step C backend) | Alibaba, Apache-2.0 | open source (Apache-2.0) |
| ComfyUI (Step C seat) | GPL-3.0 | open source (GPL-3.0) |
| Qwen2.5-VL-7B-Instruct (Steps A + C pre-pass) | Apache-2.0 | open source (Apache-2.0) |
| LightX2V incl. Qwen-Image I2I configs (Step B components) | Apache-2.0 | open source (Apache-2.0) |
| Pillow (Step D) | HPND-style permissive | open source |
| This pipeline's own drivers | Written for this repo | ours |

## WIRED vs SPEC — the whole truth in one table

| Step | Status |
|---|---|
| A — Diagnose | Checklist WIRED as data; Qwen2.5-VL endpoint contract WIRED (parity lane); first diagnosis RUN still owed |
| B — Turnaround | **SPEC** — job shape + builder landed; no landed I2I job type or driver (gap named above and inside the emitted job) |
| C — Animate | WIRED — landed scene-job v2 format + wired segment path; likeness of output UNPROVEN (baseline FAIL stands) |
| D — Export | WIRED — working code, self-test passing |
| E — Gates | WIRED — verify_proof.py timing + likeness + frame-1 rule + grading law, unchanged from v1.2 |

## FIRST USE

The route's first production use is the job its reference proved
out: Mochiko's profile walk for the ED gag rebuild — diagnose her
canon art, build her turnaround under the inventory, animate from
the profile cell, gate it, and put it in front of the owner's eye.
That run is also Step B's driver build, when it is picked up: the
gap is one driver, not a research programme.
