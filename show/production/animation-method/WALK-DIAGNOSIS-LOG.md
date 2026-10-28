# WALK DIAGNOSIS LOG — how the backwards walk was figured out

**Why this file exists (owner order, 2026-10-28):** so this problem
never recurs for any other character, and the figuring itself is
never lost. It records, in order, how a walk that passed every
automated checker three versions in a row was finally diagnosed —
and turns that figuring into a standing protocol (§3) that every
character's cycle runs through, in drawn space, before the owner's
eye ever has to catch it again.

Artifacts of record: `ep01-ed-gag/` v2/v3/v4 builds and their build
notes; `work/v5/DIAGNOSIS.md` (the full measurement record);
`work/v6-industry/` (the proof that closed the case); the owner's
own verdicts quoted below.

---

## 1. The symptom trail — the owner was right at every step

- **v2.** Owner, on watching: a leg cycles **backwards** — the
  character's left leg, on the viewer's right.
- **v3.** Owner, studying the pose strip: separates **leg from
  foot** — the red leg points one way but its *foot* looks
  backwards; the blue leg reads the other way round.
- **v4.** Owner: *"now I think both legs are backwards. And the red
  foot is backwards."* — v4 rejected.
- **The knee read.** Owner, watching the **forward-vs-reversed
  pair** of v4: the **knees bend backwards** — the joint hinges the
  wrong way — and **no matter which way the legs are flipped, the
  walk looks wrong.**

Every version between his verdicts had passed its own checkers
(leg-sweep checker, then foot-tilt checker). That pattern is the
first finding: **the checkers were measuring the skeleton in
armature space; the owner watches shoe soles, contact, and joint
direction in screen space.** Mesh deformation, root translation
inside the sprite, and the compositor's fixed travel step all sit
between those two spaces, and no gate covered them.

## 2. How it was actually figured out — the steps, in order

**Step 1 — Stop touching bones; measure the drawings.**
Three bone-level fixes had each "passed" and each read wrong, so
the next pass (v5) was diagnosis only: no new clip, all numbers
from the rendered pose stills and shipped composite pixels.

**Step 2 — The reverse-playback test (the instrument the owner
was reacting to).** The same segment played forward and reversed,
side by side. Result: reversed playback is *equally* broken,
symmetrically; the pose pairs are near time-symmetric (mirrored
pairs differ barely more than consecutive pairs). **Conclusion: the
pose ORDER is not reversed** — if it were, the reversed clip would
walk. Any future "it's just flipped" theory must survive this test
before it is acted on.

**Step 3 — Contact audit against the ground line.** Of the 8
poses, only **1** has a foot on the ground line. Both labelled
contacts land ~1 pose late; both "high points" are flight phases —
both feet off the ground — which is the grammar of a hop, not a
walk. Reference support duty is 8 of 8; the shipped cycle had 1
of 8.

**Step 4 — Support-stick measurement.** While a foot is supposed
to be planted, it must sit at ≈0 px/slot against the background.
The drawn support shoe **glided toward travel at +14 to +41
px/slot** — at one step, nearly twice the travel step itself. A
foot gliding *with* its body is the moonwalk/skating signature,
the strongest "backwards" cue there is — and it is
direction-symmetric, which is why flipping playback (Step 2)
couldn't rescue it. **This was the primary defect.**

**Step 5 — Shoe reach in pixels.** The drawn red (left) shoe's
shape extends further **behind** its ankle than ahead of it at
poses 2–6 (worst: 44 px back vs 28 forward), and its toe cap sits
at or behind the shoe's entry in half the poses. The skeleton's
foot rotations were correct; the single grid mesh's weight bleed
across the leg gap streaked the shoe backward in the render and
**outvoted them**. A bone fix cannot beat a drawing defect.

**Step 6 — Knee-fold reading (the owner's knee verdict,
measured).** The drawn shins **never fold back behind the knee
line** (≤4 px, one pose only) and lean *toward* travel at nearly
every pose; the knee point bows off the hip→ankle line (up to
~30 px on the blue leg). So the leg reads as hinged the wrong way
in **every pose of both legs** — constructed into each drawing,
which is exactly why every flip failed: flips trade phase and leg
assignment; they cannot change per-pose construction.

**Step 7 — What was NOT wrong (recorded so nobody "fixes" it).**
The bob order was correct (lowest at recoils, highest at high
points). The v3/v4 bone fixes were real — in the space their
checkers measured. The pose order was not reversed (Step 2).

**Step 8 — The deeper root (second-pass audit).** The rig's leg
has **no knee and no ankle**: its chain is hip→mid-shin→toe, so
the pivot everyone called "the knee" is not a joint at all. Even
perfect posing on that skeleton rotates around non-joints
(defect 7, `WHAT-WE-DO-WRONG-ADDENDUM.md`). And the skeleton was
never the only problem: one grid skin over the whole body
(defect 1) guaranteed Step 5's streak.

**Step 9 — Closure by construction, not by another patch.** The
industry method rebuilt the walk with the defects designed out:
part-separated profile puppet, **8 substitution drawings per
leg** (the knee fold exists *in the drawing*), contacts authored
first, travel derived from the drawn stride. The proof then
passed, in drawn space: contact lift 0 at both contacts; support
stick **0.0 px/slot** at all 6 support steps; support 8 of 8, no
flight; knee fold +72/+60 (right), +74/+43 (left) in pixels.
Two instrument lessons from that proof are now part of the
protocol: calibrate stride on the **toe-end material point**
(centroid calibration recreates a scooting contact), and gate the
**shin's fold**, not knee-point deviation (a correct fold moves
the knee *forward* while the shin folds back).

## 3. THE STANDING PROTOCOL — run for ANY character's cycle

Before any walk (or locomotion cycle) is presented as working —
for any character, any species, either lane's tooling:

1. **Drawn space only.** All evidence comes from rendered pose
   stills and composited frames. Skeleton/FK numbers may be quoted
   to explain a checker, never as evidence about the read.
2. **Contact audit.** Lift table per pose: the contacting shoe is
   at lift 0 at both contacts; a support foot exists in **every**
   pose; a walk has **no flight phase**.
3. **Support stick.** The support shoe's screen velocity across
   its support run is ≈0 (±3 px/slot), measured on the point in
   actual ground contact (toe-end through the roll).
4. **Forward-vs-reversed pair.** Ship it with the proof. A correct
   walk reads wrong backwards; a cycle that reads *equally* wrong
   both ways is telling you the defect is in construction
   (contact/stick/fold), not in phase order — and a "just flip it"
   fix is ruled out until this test says otherwise.
5. **Shoe read in pixels.** Forward reach > backward reach for
   every flat and swing shoe; toe toward travel. (Toe-off is
   scoped: the toe *is* the rear ground point there — it passes
   on lift 0 + track velocity 0, not on reach.)
6. **Knee-fold read.** In swing poses the drawn shin sits
   visibly **behind** the knee line; the knee point stays on the
   leg line. If the drawings cannot show a fold, the rig/method
   is wrong — drawn substitution is the fix, not rotation.
7. **Silhouette check.** Consecutive poses differ substantially
   (proof band: 28–40%); near-identical standing figures across a
   cycle = no cycle.
8. **Joint inventory first.** Before animation, confirm every
   joint the action needs exists at its anatomical centre (a knee
   at the knee, an ankle at the ankle) — defect 7's gate
   (method Addendum §A.2).
9. **Owner eye gate last and supreme.** Contact sheet +
   forward/reversed pair go to the owner before any recomposite.
   Drawn gates passing has never yet meant a walk reads right;
   when the owner's eye and a checker disagree, the checker is
   re-examined first — the owner has been right at every step of
   this log.

**The one-sentence version, for the wall:** *If it doesn't plant,
it doesn't walk — and no number measured on a skeleton can
outvote a drawing.*
