# RIG TEARDOWN — Blender Open Movies (Spring, Sprite Fright)

**What this is:** a construction-system teardown of how the Blender
Studio open movies build character rigs, extracted as native specs for
Mochiichao. Per Jamar's gray-case rule, the studio production files
themselves **stay pointers** (catalogue entries, §6) — what transfers
is the *system*: generation workflow, bone-layer discipline,
deformation stack, face method, naming. Everything below is written
so the design lane can build Mochiichao rigs from it without opening
a single studio file.

**Holdings check (2026-10-27):** `mhvnsnt/animation-research-library`
holds the *films* only — `films/spring_blenderopenmovie.mp4` (48 MB)
and `films/sprite-fright-2021.mp4` (61 MB), both CC BY 4.0 per its
CATALOG.md. The production files were never bulk-downloaded; the
repo's own PRODUCTION-FILES.md and TERABOX-LIST.md already record
where they live (studio.blender.org, subscription-gated download;
older films free on download.blender.org). This teardown is built
from those repo records plus Blender Studio's published rigging
documentation and production logs (sources, §7).

---

## 1. The two generations of the system

The two films bracket a rigging revolution, and the contrast is the
single most useful lesson in this teardown:

| | Spring (2019) | Sprite Fright (2021) |
|---|---|---|
| Rig system | **BlenRig** (Juan Pablo Bouza's add-on) — hand-authored rigs, one character at a time | **CloudRig** — rigs *generated* from a metarig; evolved from Rigify, first used on Coffee Run (2020) |
| Signature character rig | Autumn, the dog (a quadruped — see §5) — built to be re-proportioned and "baked" to other characters | Full cast generated: Victoria, Rex, the Sprite, the Snail, plus an 8-legged spider |
| Deformation core | Mesh-deform cage + corrective bones + shape keys | Armature + Corrective Smooth + Shrinkwrap + Lattice stack; shape keys deliberately rare |
| Animator interface | Selection sets + pose library (face and hands especially) | CloudRig UI: selection sets, IK/FK snap, parent switching, generated test actions |
| Cost symptom | Heavy rigs ran well under real-time in the viewport (≈16 fps at best on Spring, per its animation team) | Same-model-for-anim-and-render was viable; bone/driver count was *not* the bottleneck — deformed vertex count was |

Blender Studio's own summary of the modern workflow (their rigging
guide): *"procedurally generating control rigs, then manually weight
painting and authoring corrective shape keys… tailor each rig to the
needs of the animators on any given production."*

---

## 2. How a CloudRig rig is actually built (Sprite Fright)

1. **Metarig first.** The rigger places one simple skeleton matching
   the character's proportions. This is the only hand-placed part.
2. **Components, not bones.** Individual metarig bones are assigned
   *rig components* with parameters: `Spine: IK/FK`, `Spine: Cartoon`,
   `Limb: Biped Leg`, `Limb: Generic`, `Chain: IK / FK / Finger /
   Toon`, `Curve: Spline IK` (tails, tongues), `Chain: Face Grid`,
   `Chain: Eyelid`, `Lattice`, `Aim`, `Single Control`. Components
   inherit from each other (a Face Grid is a specialised chain; a
   Biped Leg is a specialised IK limb), so complexity is dialled per
   body part, not rebuilt.
3. **Generate.** CloudRig emits the full control rig: animator-facing
   controls plus the invisible machinery. Regenerate is the normal
   edit loop — change a parameter or a proportion, re-generate;
   nobody hand-patches hundreds of constraints.
4. **Three bone layers.** Of the total bone count, only a minority
   deform the mesh. Sprite Fright's published numbers:

   | Character | Deforming / Total bones | Drivers | Verts |
   |---|---|---|---|
   | Snail | 57 / 460 | 240 | 3,600 |
   | Sprite | 194 / 1,300 | 970 | 15,000 |
   | Victoria | 249 / 2,000 | 1,000 | 30,000 |
   | Rex | 298 / 2,000 | 1,300 | 41,000 |

   Roughly **85–88% of a production rig is mechanism** (IK chains,
   switch/snap helpers, lattice drivers) that never touches a vertex.
5. **Weights + correctives last.** Manual weight painting to the
   *deform* bones only (their EasyWeight add-on guards against rogue
   weights), then corrective shape keys — used sparingly on purpose:
   on Sprite Fright the shape-key count per rig "can be counted on
   two hands." Deformation problems are solved structurally first.
6. **Post-generation script hook.** A per-production Python script
   runs as a generation step, so house tweaks survive regeneration
   instead of living as manual edits the next generate would erase.

## 3. The deformation stack (in modifier order)

1. **Armature** (deform bones only)
2. **Corrective Smooth** — volume/joint-collapse cleanup
3. **Shrinkwrap** — keeps fitted parts (clothes, shells, gear) glued
   to the body surface
4. **Lattice** — free-form patches for anything the bones can't phrase

**Lattices are a first-class rig component, not a hack.** Sprite
Fright's rubber-hose style kept hitting deformation problems whose
solution was "add a lattice" — it happened often enough (~6 times)
that it became the `cloud_lattice` component type, after which a
lattice setup takes under a minute. Rex's face runs on lattices.
Rule extracted: *when a local area needs squash/phrasing the skeleton
can't say (cheeks, bellies, faces, tail tips), add a lattice patch —
don't add bones and don't sculpt a shape key.*

## 4. Face and mouth handling

- **Spring generation:** pose library. Pre-made face and hand poses
  are stored and recalled — the face is a *library of approved poses*,
  not a phoneme machine. Selection sets make the right controls one
  click away. This is also what kept characters on-model.
- **CloudRig generation:** facial rigging is done with CloudRig's
  **Action setup** — control bones drive stored poses/actions (brow,
  eyelid and mouth-corner poses) rather than raw shape-key sliders;
  dedicated components exist for the face grid and eyelids. Teeth are
  parented to follow the mouth; face squash controls are part of the
  generated rig.
- **The native translation for Mochiichao is already in the house:**
  the 2D track's Preston Blair mouth Graphic symbol (frames stepped
  by mouth data, see MOUTH-DATA-FORMAT.md) is the *same slot* —
  "face = stepped library of approved shapes, driven by a control
  layer" — implemented in symbols instead of actions. The templates
  in this package keep that slot identical across the 2D and 3D
  tracks so a species' face logic is designed once.

## 5. The quadruped precedent: Autumn (Spring) and the spider (Sprite Fright)

- **Autumn the dog** is the proof that the quadruped body plan was
  the studio's hard case *before* generation: a BlenRig build with a
  mesh-deform cage, explicitly authored so its proportions could be
  changed and the rig re-baked onto another character. That
  re-proportioning workflow is exactly what CloudRig later automated
  — the lesson survives the tool change: **author the quadruped once
  as a parameterised template, never per-species from scratch.**
- **The spider** is the template-economics proof from the generated
  era: one leg component (IK/FK switching + snapping, FK hinge,
  parent switching, IK pole) instanced eight times. Duplicating that
  by hand — hundreds of helper bones renamed eight ways — was called
  out by the rigger as "a nightmare"; generation made it an
  afternoon. Directly applicable to multi-limb / multi-tail Mochi
  species.

## 6. Naming conventions observed

- CloudRig separates bones by **role prefix** (control / deform /
  mechanism) and side suffix `.L` / `.R`; the metarig keeps
  human-readable chain names. The rig you animate, the rig that
  deforms, and the skeleton you authored are three visibly different
  namespaces.
- Jamar's house already has the 2D counterpart: descriptive layer
  names, `_L`/`_R` as the *character's* left/right, and the filename
  as production tracker (`MC[ep]ORIGINAL_PUPPET_[CHAR]_VERSION_[###]`,
  never overwrite a version — from his fla-rig-conventions study).
  The templates below adopt role prefixes for the 3D track and keep
  the 2D conventions untouched.

---

## 7. Mapping onto Jamar's standards

His **Universal Rig Standard** (URS, `mhvnsnt/Bannon →
docs/UNIVERSAL-RIG-STANDARD.md`) is a *gate* standard: 9-stage
pipeline (detect → transfer → refit → reskin → separate → armpit →
weldcap → gate → proof), stretch gate p99.9 < 2.5, extreme-pose
battery, no hand-tooling, proof pictures, hard invariants (≤4 bone
influences/vertex, weights sum to 1, welded, zero NaN). His
**character-pipeline Stage 3 rig-spec template** (animation-
techniques-archive) is the *spec* shape every Mochiichao rig spec
already follows, and `show/production/rigs/` holds the v1 standard
(puppet cutout, Graphic symbols, ROM battery gate).

| Open-movie technique | URS / house slot it fills or upgrades |
|---|---|
| Metarig + components → **generated** control rig | Fills the missing *authoring* method under URS's "no hand-tooling, ever" law: fixes and rebuilds are parameter changes + regeneration, i.e. "a fix is a program," applied at build time, not just repair time. Native form: the `.rig.json` scaffold **is** the metarig — scaffolds are regenerated, never hand-patched. |
| Three bone layers (control / deform / mechanism) | Sharpens URS hard invariants: the ≤4-influences and weights-sum-to-1 measurements apply to the **deform layer only**; mechanism bones must carry zero weights (auditable). Adds a scaffold field `bone_layers` so the split is specified, not implied. |
| Deformation stack order (Armature → Corrective Smooth → Shrinkwrap → Lattice) | New named slot `deformation_stack` in the rig spec — previously deformation was one prose paragraph. Order is fixed house-wide; Shrinkwrap is the designated answer for shells/clothes/gear (Dorowani's shell, Gabu's plates). |
| Lattices as first-class components | New slot `lattice_patches[]` (target area, driver control, purpose). Upgrades the 2D "smear/squash drawings" idea into a specified, reusable mechanism on the 3D track; on the 2D track it maps to a dedicated squash patch layer. |
| Face = pose/action library + selection sets | Confirms and hardens the existing Blair-symbol slot: face behaviour is specified as a *library* (poses/symbol frames + the control that steps them) in both tracks — `face_system` field. Adds **selection sets** to the control spec (animator ergonomics Spring relied on). |
| Component inheritance + instancing (spider legs ×8) | New slot `components[]` with per-part component type + parameters, instanced for repeated anatomy. This is what makes "thousands of Mochi" riggable: body-plan templates (§8) are component recipes. |
| Generated ROM test action (CloudRig can emit a joint-rotation test action) | Mechanises the URS extreme-pose battery + the 2D ROM battery: the battery becomes a *generated artefact* (test action / pose set) run on every rig, with proof frames — URS gates 2 + 4 unchanged, now cheaper to satisfy. |
| Regenerate-don't-patch + post-generation script | Mirrors URS pipeline law (versioned stage outputs, inputs never touched) at authoring time; native form: scaffold version bumps + a `post_gen_notes` field instead of edits to generated rigs. |

**What does NOT transfer:** BlenRig's mesh-deform-cage approach is
recorded as the superseded generation — heavier viewport cost,
harder to gate automatically. The templates do not use it.

## 8. Deliverables wired from this teardown

- `templates/biped-rig-spec.md` + `templates/biped.rig.json`
- `templates/quadruped-rig-spec.md` + `templates/quadruped.rig.json`

Both follow his Stage 3 template shape and the
`mochiichao-rig-scaffold/v1` JSON schema used by
`show/production/rigs/scaffolds/`, extended with the new slots from
§7 (`generation`, `bone_layers`, `components`, `deformation_stack`,
`lattice_patches`, `face_system`, `selection_sets`). A design-lane
rigger fills species fields; the system fields are pre-filled from
this teardown.

## Sources

- animation-research-library: CATALOG.md, PRODUCTION-FILES.md,
  TERABOX-LIST.md (holdings, licences, production-file locations).
- Blender Studio, Rigging artist guide (CloudRig generation, manual
  weight painting, corrective shape keys, facial Action setup):
  https://studio.blender.org/tools/artist-guide/asset-creation/rigging
- Blender Studio, CloudRig introduction + component types wiki:
  https://studio.blender.org/tools/addons/cloudrig/introduction ·
  https://studio.blender.org/tools/addons/cloudrig/cloudrig-types
- Blender Studio blog, "Scene Performance on Sprite Fright" (bone /
  driver / vertex counts; modifier stack; shape-key scarcity):
  https://studio.blender.org/blog/sprite-fright-scene-fps/
- Blender Studio blog, "Learn to rig like the Blender Studio"
  (CloudRig history: Coffee Run → Settlers → Sprite Fright lattices;
  Rain/Hail as last hand-built rig): 
  https://studio.blender.org/blog/learn-to-rig-like-the-blender-studio/
- Blender Studio blog, "Rigging in Sprite Fright: A Video
  Introduction" (naming, teeth-follow-mouth, face squash, lattices):
  https://studio.blender.org/blog/rigging-sprite-fright-video-introduction/
- Blender Studio blog, "Rigging Sprite Fright's Spider" (component
  instancing ×8): https://studio.blender.org/blog/rigging-sprite-frights-spider/
- Cartoon Brew, "Step-By-Step: Breaking Down Blender's New 'Spring'
  Short" (selection sets, face/hand pose library):
  https://www.cartoonbrew.com/how-to/step-by-step-breaking-down-blenders-new-spring-short-172228.html
- BlenRig 6 release discussion (Autumn re-proportioning workflow),
  Blender Artists forum.
