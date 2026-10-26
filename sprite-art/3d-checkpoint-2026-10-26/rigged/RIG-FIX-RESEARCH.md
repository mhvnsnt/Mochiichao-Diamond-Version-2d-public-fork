# Rig-Fix Research — How Pokémon-style 3D creatures are rigged and skinned

**Scope:** Dorowani #147 + Gabu #148 only.
**Models:** Tripo GLB originals, currently rigged locally — Dorowani 76-bone GameRig,
Gabu 25-bone custom — with visible tears, mesh deformation, and weight-painting /
skin-weight issues: a waist-patch tearing family on Dorowani, and stretch at
attack contact on Gabu.
**Fix method mandated:** UniRig re-rig + Pokémon-style rigging technique.
**Status of this document:** RESEARCH ONLY. No rig file was touched to produce it.

## Honest labelling — read this first

No public, legitimate source publishes Game Freak / Creatures Inc.'s internal
Pokémon rig specifications (exact bone counts, bone names, or per-species weight
maps). Public developer interviews confirm only the *scale* of the problem:
for Sword/Shield, models were rebuilt at higher fidelity with higher-quality
animations, and Creatures Inc. (Pokémon CG Studio) builds the 3D Pokémon models,
which is why supporting 800+ species at that fidelity was a resourcing
decision — not a rigging tutorial.

So this document does **not** claim to reproduce Pokémon's internal rigs.
What it does is the legitimate equivalent, and what the repair worker should
actually use:

1. The universal game-rigging rules that every shipped creature rig follows
   (Blender Manual, glTF 2.0 spec, Unity/Unreal skinning docs, published
   rigging literature) — these *are* Pokémon-compatible because Pokémon ships
   as a real-time skinned-mesh game on the same constraints.
2. UniRig's published paper (arXiv 2504.12451) for what the auto-rig step
   itself does and does not do.
3. Pokémon-style *anatomy mapping*: bipedal turtle/crocodile creatures get the
   same bone families a bipedal Pokémon gets (spine chain, digitigrade or
   plantigrade legs, tail chain, head + jaw, fin/frill as rigid appendages) —
   applied to Dorowani's and Gabu's actual geometry, not to any Pokémon model.

Anything below marked **[standard technique]** comes from (1)/(2), not from
Pokémon internals. Anything marked **[applied to Dorowani/Gabu]** is the
repair worker's mapping decision for these two original creatures.

---

## 1. Bone layout for biped / quadruped creatures

### 1.1 The hierarchy — one root, one spine chain, limbs as branches

**[standard technique]** A game skeleton is a single hierarchy. The first
joint placed is the root joint; it moves the whole skeleton, and every joint
below a parent inherits that parent's transform (forward kinematics). Joints
go wherever something must bend: "Wherever you want something to bend, that's
where you need a joint" — a shoulder joint at the shoulder, elbow at the elbow,
and so on. You do not need anatomical completeness (a human foot has 26 bones;
a game shoe is animated with ~3).

A bipedal creature rig, in hierarchy order:

```
root (at ground origin, see §6 — NOT the pelvis)
 └─ pelvis / hips
     ├─ spine_01 (lower torso / waist)
     │   └─ spine_02 (chest)
     │       ├─ neck
     │       │   └─ head
     │       │       ├─ jaw (lower jaw only; upper skull stays on head bone)
     │       │       ├─ head-fin / crest bone(s) — RIGID appendage, see §2
     │       │       └─ cheek-frill bones (L/R) — RIGID or 1-bone, see §2
     │       ├─ clavicle_L/R
     │       │   └─ upperArm_L/R → forearm_L/R → hand_L/R
     │       │       └─ finger bones (1–2 per digit for stylised creatures;
     │       │           3 only if fingers must curl visibly)
     │       └─ (tail attaches to pelvis, NOT to chest — see below)
     ├─ thigh_L/R → calf_L/R → foot_L/R → toe_L/R
     └─ tail_01 → tail_02 → tail_03 (→ tail tip)
         (tail chain hangs off the pelvis / spine_01 base, so the tail
          follows hip rotation but does not inherit chest twist)
```

**Quadruped variant (for reference — neither Dorowani nor Gabu is one, but
the same families apply if a quadruped Mochiichao is rigged later):**
same spine chain, but forelegs attach at chest (scapula → upper foreleg →
lower foreleg → forefoot) and hind legs at pelvis, plus a longer tail chain
and a neck chain of 2–3 bones instead of 1, because quadruped necks carry
more of the head's range.

### 1.2 Dorowani #147 — proposed bone map [applied to Dorowani/Gabu]

Dorowani: blue bipedal crocodile/turtle, tall head fin, red cheek frills,
tan shell. The current 76-bone GameRig is *over-boned* for a stylised biped:
more bones is not more quality — every extra bone is another weight group
that can leak across a seam (see §4). The UniRig pass should aim for
roughly **30–40 deform bones**, not 76, and delete or mark non-deform any
control-only bones before export:

- root → pelvis → spine_01 → spine_02 → neck → head → jaw
- head-fin: **1 bone** (fin_root), parented to head, NOT to neck — so the
  fin moves exactly with the head and never shears against the skull.
- cheek frills: **1 bone each** (frill_L, frill_R), parented to head.
- shell: **1 dedicated shell bone** (shell_main), parented to spine_02
  (chest) — or, if the shell spans waist-to-chest, parented to spine_01
  with 100% weights (see §2). Do NOT split the shell across spine_01 and
  spine_02: a shell split across two torso bones is exactly what tears at
  the waist.
- arms: clavicle → upperArm → forearm → hand → 1–2 finger bones per digit
  (stylised claws: 1 bone each is enough; curl is faked by the hand pose).
- legs: thigh → calf → foot → toe (1 toe bone; crocodile/turtle feet are
  flippers, not articulated toes).
- tail: tail_01 → tail_02 → tail_tip (3 bones; crocodile tails taper, so
  each segment's weights fall off toward the tip — no twist bones needed
  unless the tail visibly corkscrews, in which case add one twist bone
  mid-tail, not per-segment).

### 1.3 Gabu #148 — proposed bone map [applied to Dorowani/Gabu]

Gabu: teal bipedal turtle, tan segmented shell, head spikes. The current
25-bone custom rig is in the right *count* range but under-boned in exactly
the places that stretch (§4, §7): it needs a dedicated shell bone and a
separate head-spike treatment, not more spine bones.

- root → pelvis → spine_01 → spine_02 → neck → head → jaw
- head spikes: **1 bone per spike cluster** (spike_top, spike_L, spike_R),
  parented to head, 100% rigid (see §2). If spikes are one fused crown,
  one bone total.
- shell: **1 bone per shell segment is WRONG here** — Gabu's shell is
  *segmented visually* (plates with grooves) but must deform as one rigid
  carapace in animation, or the grooves open into cracks at attack contact.
  Use **1 shell bone, 100% weights, all plates**. Segment grooves are a
  texture/normal-map job, not a bone job. (Exception: if a future animation
  deliberately flexes the shell — e.g. a shell-spin attack — that is a
  whole-shell rotation on the shell bone, still 1 bone.)
- arms/legs/tail: same families as Dorowani, scaled to Gabu's shorter,
  stockier proportions. Legs: thigh → calf → foot → toe. Tail: 2–3 bones
  (turtle tails are short; 2 is fine).

### 1.4 What NOT to add

- No per-scale, per-plate, or per-fin-ray bones. They multiply weight
  groups, guarantee leakage across neighbours, and buy nothing at game
  camera distance.
- No separate "waist patch" bone. The waist-patch tearing on Dorowani is a
  *weight* problem (§4), not a missing-bone problem. Adding a bone for the
  torn patch just moves the seam.
- Twist (roll) bones only where a limb visibly twists: forearm twist for
  a punch rotation, calf twist only if the foot rolls. Candy-wrapper
  collapse (forearm pinching to nothing on twist) is fixed by a twist bone
  taking a fraction of the wrist rotation and spreading it up the arm —
  not by more weight smoothing (§4).

---

## 2. Hard-surface vs soft-body weight handling

This is the single most important section for both creatures. Shells,
plates, horns, fins, and spikes are **hard surfaces**. They must not deform
like skin.

### 2.1 The rigid rule [standard technique]

> "Give rigid part vertices full weight to their intended bone."
> "Use one-bone full weight or a stable rigid-node parent for rigid parts."

In practice, for a skinned mesh (the Dorowani/Gabu case — one mesh, one
armature):

- Every vertex of a rigid part gets **weight 1.0 to exactly one bone**,
  and **0.0 to every other bone**.
- In Blender: select the rigid vertices → assign weight 1.0 to that bone's
  vertex group → remove those vertices from all other deform groups (or
  paint 0 with Auto Normalize on, then verify with a script — see §7).
- The alternative, used for truly separate objects (a sword in a hand,
  a detachable shell plate), is to **not skin the object at all** and
  parent the object to the bone. That is cleaner and 100% tear-proof, but
  it only works if the part is a separate mesh object. If Dorowani's shell
  or Gabu's plates are separate objects in the Tripo export, prefer
  bone-parenting over skinning for them. If they are merged into one mesh
  (the usual Tripo case), use the 1.0-to-one-bone rule instead — same
  result, same rigidity.

### 2.2 Mapping table [applied to Dorowani/Gabu]

| Part | Bone (100%) | Must have 0 from | Why |
|---|---|---|---|
| Dorowani shell (all of it, front rim + back dome) | shell_main | spine_01, spine_02, pelvis, arms | Shell split across torso bones tears at the waist — the known Dorowani failure |
| Dorowani head fin | fin_root | head, neck, spine_02 | Fin must ride the head exactly; neck influence shears fin base against skull |
| Dorowani cheek frills (L/R) | frill_L / frill_R | head, jaw | Jaw influence on a frill drags it open when the mouth opens |
| Dorowani claws / toe claws | hand / foot bone | forearm, calf | Claws are keratin, not skin |
| Gabu shell (ALL segments, grooves included) | shell_main | spine_01, spine_02, pelvis | Segmented look ≠ segmented rig; per-segment bones crack the grooves at attack contact |
| Gabu head spikes (all) | spike bone(s) | head (except its own spike bone), neck, jaw | Spike base shearing is the same failure as fin shearing |
| Gabu shell rim / edge plates | shell_main (same bone) | everything else | Rim is part of the carapace, not a separate flap |

### 2.3 Protecting rigid parts from torso deformation

Three mechanisms, in order of strength:

1. **Vertex-group isolation (mandatory).** After any auto-weight pass
   (UniRig included), rigid vertices are re-assigned by selection, not by
   painting: select by material / by separate mesh island / by face
   region, assign 1.0, then run a script that asserts no other group is
   non-zero on those vertices. Painting alone cannot be trusted for this —
   a brush at strength 0.9 leaves 0.1 leakage, and 0.1 leakage on 100k
   vertices is a visible crack under rotation.
2. **Bone locking during smoothing (mandatory, see §4).** When smoothing
   any torso or limb seam, lock the rigid groups (shell, fin, frill, spike)
   so the Smooth brush cannot send weight into or out of them. The
   published smoothing workflow is explicit: lock all influence joints
   except the 2 you are blending between; smoothing must never "randomly
   send weighting to an area that you don't want it to."
3. **A buffer ring (recommended).** One ring of soft-tissue vertices around
   the rigid part's base (e.g. the skin where shell meets torso, the skin
   where fin meets skull) carries the blend: e.g. shell-adjacent skin
   0.7 spine_02 / 0.3 shell_main on the *first* ring only, falling to
   0.0 shell within 2 rings. This hides the hard edge of the rigid part
   without letting torso twist reach the plate itself. Do NOT extend the
   buffer more than 2 rings — a wide buffer is how a rigid shell starts
   to "breathe" with the torso.

### 2.4 Soft-body parts — the opposite rule

Belly, throat, inner arms/legs, tail flesh, and the webbing between digits
are soft: they **must** blend across 2 bones at a joint (see §4). A soft
part painted 100% to one bone looks like a snapped limb at bend. The
diagnostic is simple: if it bends in life (elbow skin, waist skin, tail
flesh), it blends; if it would crack in life (shell, horn, fin plate),
it is rigid.

---

## 3. Influence limits per vertex — max 4 confirmed

**Confirmed, from three independent public sources:**

- **glTF 2.0 specification:** "The number of joints that influence one
  vertex is limited to 4, so referenced accessors must have `VEC4` type"
  (`JOINTS_0` / `WEIGHTS_0`). This is a format limit, not a suggestion.
  (glTF allows a second set, `JOINTS_1`/`WEIGHTS_1`, for 5–8 influences,
  but no mainstream game importer uses it by default — Unreal's glTF
  importer truncates to 4 per vertex and notes it is aligned on the spec.)
- **Unity:** "Unity limits this to four influences per vertex by default"
  (Skinned Mesh Renderer, Rig tab, Skin Weights). Raising it is possible
  but "Almost never" worth it: "If your mesh needs eight influences to
  stop deforming badly, the fix is usually better weight painting or a
  couple of helper bones, not more influences per vertex."
- **UniRig / ComfyUI-UniRig published parameters:** `max_influences: 4`
  is documented as "Standard for game engines" in its skinning parameters,
  alongside geodesic weighting and volume preservation.

**Practical rule for the repair worker:**

- Hard cap: **≤ 4 influences per vertex, weights summing to 1.0.**
- Soft target: **≤ 2 influences on 95% of vertices.** A vertex with 3–4
  influences should only exist in genuine multi-bone junctions (pelvis /
  spine / thigh junction, shoulder / clavicle / chest junction). Everywhere
  else, 1 (rigid) or 2 (a joint blend) is correct.
- Enforcement in Blender: Weight Paint → Weights → **Limit Total**,
  Limit = 4, then **Normalize All**. Limit Total drops the lowest-weighted
  groups first — run it *after* rigid isolation (§2), or it can drop a
  0.05 torso leak you actually wanted to keep as a buffer and keep a
  0.05 leak you wanted gone. Order matters: isolate rigid → blend seams
  → Limit Total → Normalize All → re-verify rigid isolation (§7).
- Auto-rig output must be checked, not trusted: UniRig predicts weights
  by bone-point cross-attention; it does not guarantee ≤ 4 out of the
  box on dense meshes. The Limit Total pass is non-optional.

---

## 4. Weight smoothing / blending and seam handling — NO blanket smoothing

### 4.1 Why seams tear

A seam tears when neighbouring vertices disagree about which bone owns
them. Two classic causes, both present in the current Dorowani/Gabu rigs:

1. **Hard break:** vertex A is 1.0 spine_01, adjacent vertex B is 1.0
   spine_02, with no gradient between. Under rotation the two vertices
   separate — a crack. Fix: a gradient band (see §4.2).
2. **Leakage:** a bone's influence bleeds far past its joint (e.g. thigh
   weight reaching the waist, or spine weight reaching the shell). Under
   pose, distant geometry gets dragged. Fix: paint the leaked group to 0
   in the leaked region, with Auto Normalize on, or remove the group from
   those vertices outright.

The published guidance is consistent: "Each bone on either side of the
joint has to share some influence on vertices around the joint with the
other bone if you don't want that 'hard break' look. Use graduated
weighting … overlap the influence of one bone with another to some
degree."

### 4.2 The joint gradient — how wide, how shaped

- **Band width:** 2–4 edge loops centred on the joint line for a stylised
  creature (more loops = softer bend, but also more volume loss; fewer
  loops = snappier, more cartoon-correct for Pokémon-style animation).
  Dorowani/Gabu are stylised, not realistic — favour 2–3 loops.
- **Shape:** a smooth falloff across the band, e.g. across an elbow band:
  1.0 / 0.75 / 0.5 / 0.25 / 0.0 (upperArm → forearm). Not a linear ramp
  forced by a brush — paint the two end values, then smooth *only within
  the band* (see §4.3).
- **Where the band sits:** centred slightly *toward* the parent bone for
  elbows/knees (the crease forms on the inside of the bend), and centred
  on the joint line for waist/spine and shoulder/hip.
- **Inside vs outside:** the inside of a bend compresses (loops bunch);
  the outside stretches. If a joint collapses no matter how you paint,
  stop: "it's a topology problem: that joint is missing a deformation
  loop" — add a loop (see §5), don't keep painting.

### 4.3 Targeted seam work — the ONLY smoothing allowed on this pass

**⚠️ DO NOT BLANKET-SMOOTH. Evidence from this project: a previous
blanket-smooth pass made Dorowani's attack stretch WORSE, from 3.10 to
13.62 (stretch metric).** Blanket smoothing is exactly how rigid isolation
(§2) gets destroyed: the Smooth brush averages weights across neighbours
without respecting material boundaries, so shell weight bleeds into torso,
torso weight bleeds into shell, fin weight bleeds into skull, and every
hard edge becomes a soft, stretchy mess. The published literature agrees
independently: smoothing should be done "between just 2 joints" with all
other joints locked, 1–2 passes depending on mesh complexity, and "higher
iterations can introduce unwanted artifacts in fine details" — and a
global clean "can remove weak weights that were forming an intentional
transition."

The approved procedure, per seam, in order:

1. **Lock everything except the 2 bones of this seam.** In Blender
   Weight Paint, lock all deform groups except e.g. spine_01 + spine_02
   for the waist, or upperArm + forearm for the elbow. In Maya terms this
   is the same as the CAVE Academy workflow: "lock all the influence
   joints, except 2 … the Smooth operation won't randomly send weighting
   to an area that I don't want it to."
2. **Select only the seam band** (2–4 loops, §4.2). Smooth *only* that
   selection, 1 pass, low strength. Inspect. A second pass only if the
   first left a visible step.
3. **Hand-direct stragglers:** with the same 2 groups unlocked, use Add
   at 0.1–0.25 to nudge individual vertices that sit wrong. "Smoothing
   will only get you so far … you will, without a doubt, need to go in
   and manually direct the vertices."
4. **Re-lock, move to the next seam.** Never smooth two seams in one
   operation. Never smooth with rigid groups unlocked (§2.3).
5. **Re-verify rigid isolation after every seam** (§7, check R1). If a
   seam pass contaminated a rigid part, undo that pass, re-isolate, and
   redo with a tighter selection — do not "fix" it by smoothing more.

### 4.4 Seam-by-seam plan [applied to Dorowani/Gabu]

| Seam | Bones (lock all else) | Notes |
|---|---|---|
| **Dorowani waist (PRIORITY — the tearing family)** | spine_01 ↔ spine_02 | The tear is here because the shell straddles the waist. First re-isolate the shell to shell_main (§2), *then* blend spine_01↔spine_02 on belly skin only, *excluding* shell vertices from the selection. If the waist still tears after isolation + band blend, the cause is topology (missing waist loop) or a shell vertex still carrying spine weight — check both before repainting. |
| Dorowani shoulder | clavicle ↔ upperArm, then upperArm ↔ chest | Keep frill/shell groups locked throughout. |
| Dorowani elbow / knee | upperArm ↔ forearm; thigh ↔ calf | 2–3 loop band; test past 90° bend. |
| Dorowani finger seams | hand ↔ finger_01 | 1-loop blend only; fingers are short — a wide blend makes them rubbery. |
| Dorowani neck / head | neck ↔ head | Fin group locked; fin base is NOT part of this seam. |
| Dorowani tail base | pelvis ↔ tail_01 | Tail flesh blends; tail tip stays 1.0 tail_tip. |
| **Gabu attack-contact stretch (PRIORITY)** | Varies by contact point — identify the stretching vertices first, then blend only their 2 owning bones | Stretch at attack contact means the contact vertices are owned (or leaked) by a bone that moves differently from the attacking limb. Do not smooth the whole arm/torso to chase it: find the vertices, check their groups, remove the wrong group or rebalance the 2 correct ones. If the stretch is in the shell, it is a rigid-isolation failure (§2), not a smoothing failure — re-isolate, do not smooth. |
| Gabu shell rim | shell_main ↔ spine_02 (buffer ring only, §2.3) | 1–2 ring buffer, nothing wider. |
| Gabu neck / head | neck ↔ head | Spike groups locked. |

### 4.5 What "good" looks like at each seam (pose test)

Bend every joint to its limit in Pose Mode and watch — the published
auto-rig QA checklist, which the repair worker should adopt verbatim:

- Elbow / knee past 90°: any collapse or pinching?
- Shoulder / hip at big rotation: any tearing or clipping in armpit / crotch?
- Wrist / forearm twist: any candy-wrapper collapse?
- Fingers / neck: stiff, or dragging neighbours along?

A seam passes when it survives its limit pose with no crack, no
candy-wrapper, and no neighbour-drag. A seam that only survives the rest
pose has not been tested.

---

## 5. Dense meshes — 1.9M-face Tripo models decimated to ~100k

### 5.1 Why decimation alone tears

Tripo output is dense, triangulated, and uneven: detail where the
generator felt like it, not where deformation needs it. Two independent
literature points matter here:

- "Decimate modifier … produces poor topology for animation. Use only
  for static props, environment objects, or placeholder assets" — i.e.
  a raw decimated mesh is *not* a rigging-ready mesh.
- "Auto-retopo evenly distributes polygons, but animation requires more
  loops at joints — add manually" and "a jointless loop collapses the
  moment it bends."

At ~100k faces the mesh is still far denser than a shipped creature
(typical hero creatures are 10k–30k triangles; even generous stylised
heroes rarely exceed 50k). Density is not the problem per se — uneven
density *at joints* is. A 100k mesh with no loop at the waist will tear
at the waist; a 20k mesh with 3 good waist loops will not.

### 5.2 Handling for this pass (no full retopology mandated — but the checks are)

The repair pass is a *rig fix*, not a remodel, so it does not re-topologise
both creatures from scratch. It does, however, require these steps, in
order, before UniRig weights are trusted:

1. **Clean first:** remove duplicate vertices (Merge by Distance),
   recalculate normals outward, delete non-manifold / interior geometry
   Tripo commonly leaves inside shells and mouths. Auto-rigging on a dirty
   mesh "throws off" weights (duplicate verts get different weights and
   split apart — a tear that looks like a weight problem but is a mesh
   problem).
2. **Decimate with intent, or accept ~100k with a warning:** if the mesh
   stays ~100k, keep it as a single LOD and note the cost (vertex shader
   skinning is per-vertex; 100k skinned verts is fine on desktop, heavy
   on low-end mobile — but this project's target is a web/2.5D game, so
   desktop-first is acceptable for this pass; a lower LOD is future work,
   not this pass).
3. **Joint-loop audit (mandatory, cheap):** in wireframe, check each
   bend site — waist, shoulders, elbows, hips, knees, neck, tail base —
   for at least 2 edge loops spanning the bend. Where a joint has 0–1
   loops, add loops by hand (Loop Cut, or Poly Build + Shrinkwrap onto
   the dense surface for the affected region only). This is the single
   highest-leverage fix for tearing that weight painting cannot solve.
4. **Pole / triangle audit at joints:** move poles (5+ edges) and
   triangles out of deforming areas into flat, hidden areas (inside of
   shell rim, underside of foot). Poles at a joint cause pinching that
   looks like bad weights.
5. **Separate rigid parts where possible:** if the Tripo mesh already has
   shell / fin / spike as separable islands, split them into named
   objects and bone-parent them (§2.1) instead of skinning them — this
   removes the densest, hardest-to-weight geometry from the skinning
   problem entirely.
6. **Bake detail down, don't carry it in geometry:** surface detail
   (scales, shell grooves, skin texture) belongs in normal maps, not in
   100k faces. If a future pass retopologises, the dense mesh becomes
   the bake source. For this pass, just do not *add* density.

### 5.3 UniRig + dense meshes — specific caution

UniRig predicts skeleton + weights from geometry via bone-point
cross-attention, trained on Rig-XL (14,000+ rigged models). Its paper
reports state-of-the-art accuracy on diverse categories, but its training
meshes are game-style assets, not raw 1.9M-face generator output. Expect
UniRig's first-pass weights on a decimated Tripo mesh to be *good on
limbs, suspect on shells/fins/frills* — precisely the rigid parts §2
isolates by hand afterward. Treat UniRig as the skeleton + base-weight
generator, never as the final weights. The manual §2/§4 passes are not
optional polish; they are where this repair actually happens.

---

## 6. Foot / floor contact and root-bone conventions

### 6.1 Root vs pelvis — do not conflate them

**[standard technique]** Two different things, often confused, and
confusing them causes foot slide and ground-penetration bugs:

- **Root bone / root control:** sits at the ground origin (0,0,0 under the
  character, at floor level), moves the *whole* character through the
  world, and carries root motion (walk/run translation). Game-animation
  rigs include a "Root (collision) control" that "drives the position of
  the character's collision relative to the scene origin." In glTF, the
  skin's skeleton root node serves the same purpose: it is the parent of
  the joint hierarchy.
- **Pelvis / hips bone:** sits inside the body at hip height, is the
  parent of spine and legs, and carries body weight shift, crouch, and
  hip rotation. It must NOT carry world translation — if the pelvis
  translates in an animation, the feet slide.

Rule: **root at floor, pelvis at hip height, pelvis parented to root.**
In the bind pose, feet flat on the ground plane (y = 0), hips centred
between the feet, centre-of-gravity line landing between the feet.
"Place both feet flat on the ground, about hip-width apart. Set
hips/root centered between the feet."

### 6.2 Foot bones and contact

- Foot chain: calf → foot (ankle at ankle height, foot bone running
  forward along the sole) → toe (at the ball of the foot). Three bones
  is enough for a stylised creature; the toe bone exists so the foot can
  roll at push-off without bending the whole sole.
- **IK for ground contact:** legs need an IK setup (foot IK target +
  pole vector for the knee) for walk/idle grounding; FK alone cannot
  plant a foot. The game-animation standard is "IK/FK swapping … with
  most animation placing feet on the ground making this a must-have."
  For this project's baked-preview workflow, the requirement is weaker:
  at minimum, the exported bind pose must have feet flat and the
  walk/attack preview poses must be checked for foot penetration and
  float (see §7). Full IK is a nice-to-have for this pass, not a gate —
  but the *bone layout* must support it later (ankle + toe joints in the
  right places, knee pole direction recorded).
- **Attack contact (Gabu's stretch site):** the attacking limb's foot
  (or fist) is a contact point, not a ground point. The same rule applies
  in reverse: the contacting bone's vertices must be owned by that bone
  (see §4.4). If the fist/claw vertices carry torso or shoulder weight,
  the fist stretches away from the arm at the moment of contact — which
  matches Gabu's reported symptom. Check fist/claw groups before
  smoothing anything.

### 6.3 Dorowani / Gabu specifics [applied to Dorowani/Gabu]

- Both are bipedal with plantigrade-ish feet (turtle/crocodile soles).
  Foot bone runs the full sole length; toe bone is short.
- Dorowani's tail is long and low — in the bind pose it must NOT touch
  the ground plane (tail tip above y = 0), or every idle animation will
  read as tail-dragging and the tail-tip weights will fight the floor.
- Gabu's shell is heavy-looking: in idle, the pelvis sits slightly lower
  and forward of Dorowani's, and the spine_02 leans slightly back to
  counterbalance — this is a *pose* choice, not a bone choice, but the
  spine weights must support it (chest leaning back must not drag shell
  vertices — another reason shell isolation precedes pose testing).

---

## 7. QA gates for game rigs

Run these in order. **A rig that fails any gate does not ship to preview,
no matter how good it looks in the rest pose.** The rest pose hides every
weight problem; only limit poses reveal them.

### Gate 0 — Mesh hygiene (before any weighting)
- [ ] No duplicate vertices (Merge by Distance applied, count = 0 remaining).
- [ ] Normals consistent / outward (Face Orientation all blue).
- [ ] No non-manifold edges in deforming regions; interior Tripo geometry
      removed or excluded from skinning.
- [ ] Transforms applied (location/rotation/scale) on mesh + armature;
      feet at y = 0, character facing forward (+Y up, forward per project
      convention), centred on origin.

### Gate 1 — Skeleton sanity
- [ ] Single root at ground origin; pelvis at hip height, parented to root.
- [ ] No bone with zero length; no two bones sharing an identical head
      position (a sign of a collapsed UniRig prediction).
- [ ] Left/right bones mirrored (names + positions); tail/spine on centre line.
- [ ] Deform-bone count recorded (target ~30–40 for Dorowani, ~25–35 for
      Gabu); non-deform control bones excluded from export or marked
      non-deform.
- [ ] Jaw is a separate bone from head; fin/frill/spike/shell bones exist
      as dedicated bones (§1.2/§1.3), not as head/spine weight regions.

### Gate 2 — Weight validity (script-checked, not eyeballed)
- [ ] **R1 — Rigid isolation:** every shell / fin / frill / spike / claw
      vertex has weight 1.0 to its §2 bone and 0.0 to all others. Script
      asserts this; a visual check is not sufficient at 100k verts.
- [ ] **R2 — No unweighted verts:** every vertex has total weight > 0.
      Unweighted verts stay frozen at the origin in-game (the classic
      "vertex stuck at 0,0,0" spike). Fallback rule from auto-rig
      literature: bind isolated vertices to their *nearest bone*, never
      to a default root — "extremities (e.g. fingertips, toes) maintain
      proper anatomical attachment even when they fall outside the
      influence radius."
- [ ] **R3 — No orphan groups:** every vertex group corresponds to a
      deform bone in the exported armature. Groups for deleted/renamed
      bones are removed, not left behind (orphan groups silently survive
      export and confuse re-import).
- [ ] **R4 — Influence cap:** max 4 influences per vertex (§3); report
      the count of vertices with 3–4 influences (should be junctions
      only, not broad regions).
- [ ] **R5 — Normalisation:** every vertex's weights sum to 1.0 after
      Limit Total + Normalize All. (Blender interprets deform weights
      relatively, so a sum ≠ 1.0 will still *render* — but it will not
      *export* predictably to glTF, where WEIGHTS_0 are taken literally.)
- [ ] **R6 — No stray leakage:** for each bone, list vertices it influences
      outside its anatomical region (e.g. thigh weight on the waist,
      spine weight on the shell). Zero tolerance for leakage into rigid
      parts; soft-part leakage > 0.05 outside the joint band is fixed,
      not smoothed over.

### Gate 3 — Pose / deformation tests (the tearing gates)
Bend every joint to its limit, in both directions where applicable, and
record a stretch metric at each pose (same metric as the project's
3.10 → 13.62 regression, so regressions are comparable — do not change
the metric mid-pass):

- [ ] Elbow past 90°, knee past 90°: no collapse, no pinching.
- [ ] Shoulder / hip at full rotation: no armpit/crotch tearing or clipping.
- [ ] Waist twist + bend (Dorowani priority): no waist-patch crack, no
      shell separation from torso. **Pass criterion: no visible crack at
      readable preview size** (the project's standing rule: "Do not
      present a fixed rig until previews at readable size show no tears").
- [ ] Wrist / forearm twist: no candy-wrapper collapse.
- [ ] Neck + head + jaw open: fin/frills/spikes ride the head with no
      base shearing; jaw opens without dragging frills or throat shell.
- [ ] Tail swing full range: no tail-base crack, no tip lag (tip vertices
      must be 1.0 tail_tip, not blended back to tail_01).
- [ ] Attack pose at contact (Gabu priority): no stretch at the striking
      limb's contact point; **stretch metric must not regress vs the
      pre-pass baseline, and must improve** — a pass that makes stretch
      worse (as blanket smoothing did, 3.10 → 13.62) is rejected outright,
      not iterated on.
- [ ] Walk / idle loop scrubbed end-to-end: no foot penetration below
      y = 0, no foot float > a small tolerance above ground at contact
      frames, no sliding on planted feet.

### Gate 4 — Export verification
- [ ] Export to GLB, re-import into an empty Blender file, and verify:
      bone names, hierarchy, bind pose, rigid weights (§2), and influence
      cap (§3) all survive the round trip.
- [ ] GLB joint count and file size recorded; no unused bones exported.
- [ ] Preview renders at readable size (not thumbnails) from front, side,
      back, and 3/4, in rest pose + one limit pose per priority seam
      (Dorowani waist twist, Gabu attack contact). Tears invisible at
      thumbnail size still fail — that is how the current rigs shipped
      broken.

### Stretch thresholds — what numbers to use
No published source gives a universal "pass at X" stretch number — stretch
is project- and metric-specific. So this pass uses a **relative** gate,
which is the honest and enforceable version:

- **Hard gate:** no vertex moves more than the pre-pass baseline's worst
  vertex at the same pose, and the mean stretch at each priority pose
  must be *lower* than baseline.
- **Regression gate:** any pass that increases stretch at any priority
  pose (as blanket smoothing did) is reverted, not patched.
- **Absolute sanity check:** any single vertex displacing > ~2× its
  neighbours' mean displacement at a pose is flagged as a weight error
  (leak or unweighted vert), regardless of the mean.

---

## 8. UniRig — what to expect from it, and what to do after it

From the UniRig paper (arXiv 2504.12451) and Tripo's announcement:

- **Two stages:** (a) autoregressive Skeleton Tree GPT predicts a
  topologically valid skeleton hierarchy (Skeleton Tree Tokenization);
  (b) bone-point cross-attention predicts per-vertex skinning weights.
- **Training:** Rig-XL, 14,000+ rigged models across humans, animals,
  objects, plus VRoid anime characters. Strong on diverse categories;
  still an *average* of its training distribution — it has not seen
  Dorowani or Gabu.
- **Specialised bones:** supports spring bones for dynamic elements
  (hair, tails) — relevant to Dorowani's fin and tail *only* as a future
  secondary-motion option, not as deform bones in this pass. Do not let
  spring bones carry deform weight.
- **Output:** standard FBX with skeleton hierarchy + skinned mesh; the
  ComfyUI wrapper documents `max_influences: 4`, `geodesic_v2` weighting
  (surface distance, not Euclidean — this matters for shells, where
  Euclidean distance would leak chest weight straight through the shell
  wall into the back), and volume preservation.

**Repair-worker UniRig procedure:**

1. Feed UniRig the *cleaned* mesh (§5.2 step 1), not the raw Tripo output.
2. Set `max_influences: 4` explicitly; prefer geodesic weighting if the
   wrapper exposes it.
3. Inspect the predicted skeleton against §1.2/§1.3 before accepting
   weights: if UniRig merges the shell into the spine, or gives the fin
   no bone, correct the skeleton *first* — weights predicted for a wrong
   skeleton cannot be painted right afterward.
4. Then apply §2 (rigid isolation), §4.3 (targeted seams only), §3
   (Limit Total + Normalize), and §7 (all gates), in that order.
5. If UniRig's skeleton is wrong in a way that cannot be fixed by
   renaming/reparenting (e.g. no jaw bone, tail chain attached to chest),
   fall back to a hand-built skeleton on the §1 layout and use UniRig's
   weights only as a starting point — a correct skeleton with mediocre
   weights beats a wrong skeleton with good-looking weights, because
   weights can be painted and hierarchy cannot be faked.

---

## 9. Numbered fix checklist — apply directly to Dorowani + Gabu

Work top to bottom. Do not skip steps, and do not reorder §2 before §1
or §4 before §2 — the order is load-bearing.

1. **Clean both meshes.** Merge by Distance, recalculate normals, remove
   interior/non-manifold geometry, apply transforms, feet at y = 0,
   centred, facing forward. (Gate 0.)
2. **Joint-loop audit.** Check waist, shoulders, elbows, hips, knees,
   neck, tail base for ≥ 2 edge loops. Add loops by hand where missing —
   especially Dorowani's waist. If a joint has no loop, no amount of
   painting will save it.
3. **UniRig re-rig, cleaned mesh in, `max_influences: 4`, geodesic
   weighting if available.** Inspect the predicted skeleton against
   §1.2 (Dorowani) / §1.3 (Gabu) before accepting any weights. Fix
   skeleton errors first (jaw, shell bone, fin/frill/spike bones, tail
   parented to pelvis).
4. **Reduce Dorowani's bone count.** From 76 toward ~30–40 deform bones.
   Delete or mark non-deform every bone that is not in §1.2. Keep a
   record of what was removed and why.
5. **Rigid isolation — Dorowani.** Shell → shell_main 1.0, fin →
   fin_root 1.0, frills → frill_L/R 1.0, claws → hand/foot 1.0. Remove
   those vertices from every other deform group. Script-verify (Gate R1).
6. **Rigid isolation — Gabu.** ALL shell segments → shell_main 1.0
   (one bone, grooves included). Spikes → spike bone(s) 1.0. Script-verify
   (Gate R1). Do not create per-segment shell bones.
7. **Buffer rings.** One ring of torso skin around Dorowani's shell base
   and Gabu's shell rim: 0.7 torso / 0.3 shell on ring 1 only, 0.0 shell
   by ring 3. Same at fin base and spike bases (0.7 head / 0.3 appendage).
8. **Waist seam — Dorowani (priority).** Lock all except spine_01 +
   spine_02. Select belly-skin band only (2–3 loops, shell vertices
   EXCLUDED). Smooth 1 pass, low strength. Hand-nudge stragglers at
   0.1–0.25. Re-verify shell isolation. Pose-test waist twist + bend.
9. **Limb seams — both.** Same locked-2-bone procedure, one seam at a
   time: shoulder, elbow, hip, knee, neck, tail base, finger seams
   (1-loop blend only). Never two seams in one operation.
10. **Attack-contact fix — Gabu (priority).** Identify the exact
    stretching vertices at the attack-contact pose. Check their groups:
    remove the wrong group or rebalance the 2 correct ones. If the
    stretch is in the shell, it is step 6 failing — re-isolate, do not
    smooth. Re-measure stretch; it must improve on baseline, not regress.
11. **Finger seams — both.** Hand ↔ finger blend, 1 loop, locked 2-bone
    only. Short fingers go rubbery with wide blends — resist the urge
    to smooth them "to be safe."
12. **Limit Total (4) + Normalize All — both.** Then RE-RUN rigid
    isolation verification (Gate R1): Limit Total can drop a buffer
    weight you wanted and keep a leak you didn't. Fix any R1 failure by
    re-assigning, not by smoothing.
13. **Orphan + unweighted sweep.** Delete vertex groups with no matching
    deform bone. Bind any zero-weight vertex to its nearest bone (never
    to root). Script-verify Gates R2/R3/R5/R6.
14. **Pose-test every joint to its limit** (Gate 3 checklist). Record
    stretch at Dorowani waist twist and Gabu attack contact with the
    project's existing metric, and compare to baseline. Any regression
    = revert that step.
15. **NO blanket smoothing at any point.** Not as a "final pass," not
    "just one iteration over everything," not with rigid groups locked
    "so it should be fine." The project's own evidence (3.10 → 13.62)
    plus the literature (smoothing sends weight where you don't want
    it; higher iterations create artifacts in fine details) both rule
    it out. Targeted seam work (§4.3) is the only smoothing on this pass.
16. **Foot / root check.** Root at ground origin, pelvis at hip height,
    feet flat at y = 0 in bind pose, ankle + toe joints placed for
    future IK. Scrub walk/idle: no penetration, no float, no slide on
    planted feet.
17. **Export + re-import round trip.** GLB out, empty-file re-import,
    verify bones, hierarchy, bind pose, rigid weights, influence cap.
    Record joint count and file size.
18. **Readable-size previews.** Front, side, back, 3/4, rest pose +
    Dorowani waist-twist pose + Gabu attack-contact pose. Do not present
    the rigs as fixed until these previews show no tears at readable
    size. Thumbnails do not count.

---

## Sources — all public / legitimate

| # | Title | URL | What was taken from it |
|---|---|---|---|
| 1 | UniRig paper — "One Model to Rig Them All: Diverse Skeleton Rigging with UniRig" (arXiv 2504.12451) | https://arxiv.org/html/2504.12451v1 | Two-stage pipeline (Skeleton Tree GPT + bone-point cross-attention), Rig-XL 14,000+ models, spring-bone support, state-of-the-art claims. Basis for §8. |
| 2 | Tripo — "One Model to Rig Them All: VAST/Tripo Introduces UniRig" | https://www.tripo3d.ai/blog/unrig-automated-3d-rigging | Plain-language UniRig overview; template methods vs template-free limits; why auto-rigging is the bottleneck. |
| 3 | ComfyUI-UniRig guide | https://www.runcomfy.com/comfyui-nodes/ComfyUI-UniRig | Auto skeleton extraction + skinning prediction + FBX export; UniRig vs MIA model choice. |
| 4 | ComfyUI-UniRig write-up (skin parameters) | https://prompts.brightcoding.dev/blog/comfyui-unirig-the-revolutionary-tool-every-3d-animator-needs | `max_influences: 4` as game standard, `geodesic_v2` surface-distance weighting, volume preservation — §3, §8. |
| 5 | glTF 2.0 Specification — Skinned Mesh | https://kcoley.github.io/glTF/specification/2.0/ | "The number of joints that influence one vertex is limited to 4" (`JOINTS_0`/`WEIGHTS_0` VEC4); joint hierarchy = node hierarchy; rigid geometry attached to a joint without skinning — §3, §2.1. |
| 6 | Khronos glTF Tutorial — Skins | https://github.khronos.org/glTF-Tutorials/gltfTutorial/gltfTutorial_020_Skins.html | Worked 4-joint weight example (1.00 / 0.75-0.25 / 0.50-0.50 gradient) — model for §4.2 band shape. |
| 7 | Unreal Forums — glTF importer truncates to 4 influences | https://forums.unrealengine.com/t/interchange-gltf-importer-truncates-skeletal-mesh-bone-influences-to-4-per-vertex/2745391 | Confirms importers enforce the glTF 4-limit in practice; `JOINTS_1` exists but is not the default path — §3. |
| 8 | Unity skinning explainer — "Character Rigging and Skinning Explained" | https://thedevloot.com/blog/character-rigging-skinning-explained-unity-humanoid-vs-generic | Unity 4-influence default; "four is the sweet spot"; candy-wrapper twist fix (twist/roll bones); shoulder collapse fix (clavicle weights + edge loops) — §3, §1.4, §4. |
| 9 | WebGL Fundamentals — Skinning | http://webglfundamentals.org/webgl/lessons/webgl-skinning.html | Why the ~4 limit exists (data cost); exporter keeps top-4 weights and renormalises — §3. |
| 10 | Blender Manual — Weight Paint options (4.3) | https://docs.blender.org/manual/uk/4.3/sculpt_paint/weight_paint/tool_settings/options.html | Auto Normalize semantics; Blender interprets deform weights relatively; Multi-Paint for multi-bone regions — §3, §4. |
| 11 | LearnMMD — Weight Painting MMD models in Blender | https://learnmmd.com/http:/learnmmd.com/weight-painting-mmd-models/comment-page-1/?amp=1 | Blender Limit Total = 4 + Normalize All workflow for a 4-influence target format — §3. |
| 12 | CAVE Academy — Skinning (10. Skinning) | https://caveacademy.com/wiki/post-production-assets/rigging/rigging-training/introduction-to-rigging-course/10-skinning/ | Lock-all-except-2 smoothing workflow; 1–2 smoothing passes; keep creases/bulges; hand-direct vertices after smoothing; pelvis as multi-joint region — §4.3 (the core anti-blanket-smoothing source). |
| 13 | SkinSmart — "Blender Automatic Weights failed? Diagnose it before repainting" | https://skinsmart.dev/learn/blender-automatic-weights-failed/ | Narrowest-tool rule; Smooth averages neighbours and higher iterations create artifacts; global Clean can remove intentional transitions; select the joint band, not the whole character — §4.3, §4.5. |
| 14 | Blender Artists — "Having issues with tearing when rigging" | https://blenderartists.org/t/having-issues-with-tearing-when-rigging/1653253 | Tearing when sleeve/arm weights disagree; weight-paint fix vs Surface Deform proxy; density mismatch as a tearing cause — §4.1. |
| 15 | Blender Artists — "Skinning problem" (joint weighting thread) | https://blenderartists.org/t/skinning-problem/473395 | Graduated weighting / overlapping influence across a joint to avoid hard breaks; volume-collapse limits of weight painting alone — §4.1, §4.2. |
| 16 | BlueCat 3D pipeline — Module 08 Rigging + Animation | https://3d.bluecatbot.com/en/pipeline/08.html | Bend-every-joint-to-its-limit QA checklist (elbow/knee >90°, shoulder/hip tearing, wrist candy-wrapper, finger/neck drag); clean-mesh prerequisite for auto-rig; topology-over-painting rule — §4.5, §5, §7. |
| 17 | BlueCat 3D pipeline — Module 04 Retopology & Optimization | https://3d.bluecatbot.com/en/pipeline/04.html | Joint-loop rule ("a jointless loop collapses the moment it bends"); auto-retopo density controls; poles/triangles out of deforming areas — §5. |
| 18 | "Blender 3D Modeling for Games" guide — retopology section | https://generalistprogrammer.com/tutorials/blender-3d-modeling-games-complete-guide | Decimate = poor animation topology, static props only; quad retopology for animation; normal-map baking for detail — §5. |
| 19 | GWO Wiki — Blender Skinning Route + Model Rules | https://wiki.playgwo.com/en/guide/blender-skinning.html and https://wiki.playgwo.com/en/guide/models.html | "Rigid part vertices full weight to their intended bone"; "one-bone full weight or a stable rigid-node parent for rigid parts"; re-import verification after export — §2.1, §7 Gate 4. |
| 20 | "Skeletons and Rigging" (game-animation textbook chapter) | https://flylib.com/books/en/4.423.1.77/1/ | Root joint moves whole skeleton; joints where things bend; FK inheritance; foot ≈ 3 bones — §1.1, §6. |
| 21 | Game Animation Explained, Ch. 8 — "The animation rig" | https://www.bloomsburyvisualarts.com/app/downloadpdf?type=encyclopedia&xmlPath=bva-hub/56/content-types/encyclopedia/9781315105871_txt_xml.xml&xsltPath=/content-types/encyclopedia/chapter-download.xsl&productLogo=bva-hub/images/BVA_Logo-H-3f48cc-1100x240.jpg&mlaCitation=&lang=en&documentId=b-9781315105871&currentTime=Thu%20Dec%2011%202025%2016:00:00%20Pacific%20Standard%20Time&tocId=b-9781315105871-chapter8&productName=bva-hub&citationExist=true&workloc=$workPath&territory=&cachepagetype=$cachepagetype&chapterPdfId=9781315105871.ch-008.pdf&tocPage=false&epdfIsbn=undefined&docIdS=b-9781315105871-chapter8&openAccess=false | Root (collision) control; IK/FK swapping as must-have for ground contact; deformation helper bones at pinch points — §6. |
| 22 | Character Animation Starter Kit — Balance, CoG, Ground Contact | https://cursa.app/en/page/character-animation-starter-kit-balance-center-of-gravity-and-ground-contact | Feet flat hip-width, hips centred between feet, CoG inside base of support, planted foot never slides — §6. |
| 23 | Game Developer — "Dear Game Freak: I'm Not Mad, Just Confused" (Masuda/USGamer + Famitsu interview coverage) | https://www.gamedeveloper.com/design/dear-game-freak-i-m-not-mad-just-confused | Public confirmation that Sword/Shield models were rebuilt at higher fidelity with higher-quality animation — the *only* Pokémon-specific rigging claim in this document, and it is about scale, not technique. |
| 24 | NintendoSoup — Game Freak breakdown of Sword/Shield team | https://nintendosoup.com/game-freak-gives-a-breakdown-of-the-1000-people-behind-pokemon-sword-shield/ | Creatures Inc. builds the 3D Pokémon models; graphics was the biggest resource pull — context for why no internal rig spec is public. |

## Sources REJECTED as not clearly legitimate — NOT used

- **DeepWiki page for `psthrn42/SCVI_Extract` ("Pokémon Asset System")**
  (deepwiki.com/psthrn42/SCVI_Extract/6.2-pokemon-asset-system) — surfaced in
  search. It documents file extensions and structures derived from
  extracting commercial game assets. Rejected: extraction-derived
  documentation of proprietary formats sits inside the hard boundary
  (no ROM dumps, no extracted commercial assets). Nothing from it is
  cited above; the glTF/Unity facts it might have corroborated are
  instead cited from the Khronos spec and Unity docs.
- **STLFinder / model-download listings for "skeleton pokemon" and any
  Pokémon model-download site** — surfaced in search. Rejected: these
  distribute or point to commercial character models. Not used, not linked.
- **Fan "3D Pokémon sprites / models" explainers that describe working
  with extracted Pokémon assets** — surfaced in search. Rejected as
  sources for technique: their rigging generalities are already covered
  by the Blender Manual, CAVE Academy, and textbook sources above, and
  citing them would blur the line between public technique and
  extraction-adjacent material. No Pokémon model, sprite, texture, or
  weight data was downloaded, inspected, or referenced for this document.
- **Any leaked internal Nintendo / Game Freak file, ROM dump, or
  datamined weight/bone dump** — none was sought, none was used. If a
  future search surfaces one, it is rejected under the same rule and the
  repair worker must use the legitimate technique literature in §Sources
  instead.

## What this document does NOT claim

- It does not reproduce Pokémon's internal bone names, counts, or weights.
- It does not give an absolute pass/fail stretch number (none is published
  for this project's metric); §7 uses relative-to-baseline gates instead.
- It does not guarantee UniRig's first-pass weights will be clean on
  Tripo geometry — §8 states the opposite expectation, which is why
  §§2/4/7 are mandatory manual passes after UniRig.

---

*Written 2026-10-25. Research only — no rig files touched, no images
generated, no commercial Pokémon assets used.*
