# Rig Spec — QUADRUPED CREATURE TEMPLATE

> **Stage 3 of 6 shape** (Jamar's character-pipeline rig-spec
> template), pre-filled with the open-movie rig system extracted in
> `../RIG-TEARDOWN.md`. The quadruped is the body plan the open
> movies proved hardest (Autumn, Spring) and then cheapest (spider
> leg instancing, Sprite Fright) — author it ONCE as a parameterised
> template, re-proportion per species, never rebuild from scratch.
> Copy per species; fill `___` fields; system fields are fixed.
> Machine-readable twin: `quadruped.rig.json`.

## Rig Style (Pick One)
- [ ] **Puppet** (2D cutout — show default)
- [ ] **3D** (Blender, CloudRig-component method)

## File Naming
```
MC[ep]ORIGINAL_PUPPET_[CHARACTER]_VERSION_[###]
```
- Planned filename: `MC___ORIGINAL_PUPPET____VERSION_001`
- Show code: MC (Mochiichao) · Species: ___
- NEVER overwrite a version. Art renders in the one **Mochiichao
  art style of record** (repo canon art; creature-catcher anime
  read, hard cel). NO baked-in ground/contact shadows — shadows are
  added at composite time (owner law).

## Generation (open-movie system — RIG-TEARDOWN §§2, 5)
- **Authoring unit is the scaffold (metarig equivalent).** Quadruped
  proportions vary wildly across species (leg length, neck length,
  back line) — that is a scaffold edit + regenerate, the exact
  workflow Autumn's rig was hand-built to survive and CloudRig
  automated.
- **Repeated anatomy is ONE component, instanced.** Legs are a
  single leg component instanced ×4 (spider precedent: ×8). Extra
  legs/tails/heads = more instances, not more rigging.
- Post-gen tweaks go in `post_gen_notes`, never hand edits
  (Universal Rig Standard: no hand-tooling).

### Components (per body part)
| Part | Component | Parameters |
|---|---|---|
| Spine (chest→hips) | Spine: Cartoon / Curve: Spline IK | back-line bend range ___, squash on/off |
| Neck | Chain: FK (segmented, count ___) | follow-through lag ___f |
| Head | Aim + FK | head-turn range ___ |
| Leg ×4 instances | Limb: Generic IK/FK | IK/FK switch + snap, FK hinge, pole; **gait group** FL/FR/BL/BR |
| Tail | Curve: Spline IK with hooks | hook count ___, curl/wag pose set |
| Ears ×2 | Chain: Toon | independent L/R, twitch poses |
| Face | Face system (§ Face) | — |
| Feature ___ (horns/wings/shell/saddle) | Single Control / Chain: Toon | ___ |

## Bone / Layer Layers (three-layer discipline)
- **Control layer** — animator-facing controls only.
- **Deform layer** — only weighted/pixel-carrying bones. URS
  invariants measured here: ≤4 influences/vertex, weights sum to 1,
  welded, zero NaN.
- **Mechanism layer** — IK/snap/pole machinery, gait helpers,
  lattice drivers. **Zero weights, always** (~85% of a production
  rig is mechanism — the leg instances multiply this, not the
  deform layer).

## Layer Hierarchy (2D track; 3D mirrors these names)
```
[CODE]_[CHARACTER]
├── head
│   ├── eyes (→ expression symbol)
│   ├── pupils
│   ├── brows (if any)
│   ├── mouth (→ cry/FX shapes — creatures are cries-only;
│   │          Blair viseme symbol is HUMANS ONLY)
│   ├── jaw_lower (if jawed)
│   └── ear_L / ear_R
├── neck
├── torso_front (chest)
├── torso_back (hips)
├── leg_FL_upper / leg_FL_lower / foot_FL
├── leg_FR_upper / leg_FR_lower / foot_FR
├── leg_BL_upper / leg_BL_lower / foot_BL
├── leg_BR_upper / leg_BR_lower / foot_BR
├── tail
├── feature_layers (horns/wings/shell/plate)
├── accessories (shrinkwrap-fitted on 3D track)
└── fx (NO baked shadow layer — ever)
```
_L/_R = character's left/right; F/B = front/back pair._

### Symbol Nesting Plan
| Symbol | Type | Frames | Notes |
|---|---|---|---|
| Mouth | Graphic | species cry/expression shapes (NOT visemes) | Stage 4 creature pack |
| Eyes | Graphic | neutral, blink, happy_closed, wide, half_lid, angry, sad, dizzy_spiral, sleep, star | |
| Paws/feet | Graphic | ___ poses if feet emote (plant/wave species) | optional |

_Use Graphic symbols (not MovieClips) for timeline sync._

## Deformation Stack (fixed order — RIG-TEARDOWN §3)
1. Armature / layer transforms (deform layer only)
2. Corrective Smooth equivalent (2D: redrawn corrective poses)
3. Shrinkwrap fit for worn/carried items (shells, saddles, plates)
4. Lattice patches (below)

### Lattice Patches
| Patch | Area | Driver control | Purpose |
|---|---|---|---|
| LP_belly | belly between leg pairs | body_squash | breathing, landing squash — the classic quadruped failure area |
| LP_face | cheeks + jaw | face_squash | cry shapes, cheek puff |
| LP_back | back line | spine_squash | arch / sag without breaking the silhouette |
| LP_feature | ___ | ___ | ___ |

Shape keys / corrective drawings: **budget ≤ 10 per rig**.

## Face System
- Face = stepped **library of approved shapes** (cry/expression
  symbol frames on 2D; action-driven poses on 3D) — same slot as
  the biped template and the human mouth-data system, designed once
  per species.
- **Selection sets:** Face, Legs-Front, Legs-Back, Spine+Tail, All.

## Joint Placement
_Based on Stage 2 construction lines:_
- Shoulder F L/R: ___ · Elbow F L/R: ___ · Wrist F L/R: ___
- Hip B L/R: ___ · Knee B L/R: ___ · Ankle B L/R: ___
- Neck base / head pivot: ___ · Spine mid: ___ · Tail base: ___

## Controls (beyond scaffold standard set)
root_translate, root_rotate, body_squash, body_stretch, body_lean,
spine_bend, spine_twist, head_aim, head_tilt, neck_lag,
leg_IKFK ×4 + snap, gait_phase (walk/trot/gallop offsets),
tail_curl, tail_wag, ear_L, ear_R, eye_step, blink_auto,
face_squash, + species: ___

## Range-of-Motion Test Plan
- [ ] Standing neutral (four-square)
- [ ] Full pounce extension (spine + all legs stretched)
- [ ] Deep crouch / stalking crouch
- [ ] Sit on hindquarters · lie down / sleep loaf
- [ ] Rear-up (if species rears) / hind-leg stand balance
- [ ] Walk 8f · trot 8f · gallop/run 8f (gait phase offsets legal)
- [ ] Head-turn max L/R · tail curl max · spine arch + sag max
- [ ] Species extremes: ___
- Battery is a **generated test pose set** run on every version,
  proof frames reviewed by eye (URS gates 2+4). 3D stretch gate:
  p99.9 edge stretch < 2.5.

## Timeline Settings
- Frame rate: 24 FPS · Safe areas: [ ] added

---
## Checklist — Stage 3 Done When:
- [ ] Rig style chosen · filename follows convention
- [ ] Leg component defined ONCE and instanced ×4
- [ ] Three-layer split verified (mechanism carries zero weights)
- [ ] Deformation stack in fixed order; lattice patches listed
- [ ] All symbols planned as Graphic (not MovieClip)
- [ ] ROM battery (incl. all three gaits) run, proof frames reviewed
- [ ] No baked shadows anywhere in the rig art

**Study this:** `../RIG-TEARDOWN.md` §§2–5 (Autumn + spider
precedents) · Universal Rig Standard (Bannon) ·
`show/production/rigs/README.md`
**Next:** → Stage 4: cry-shape / expression pack (creatures)
