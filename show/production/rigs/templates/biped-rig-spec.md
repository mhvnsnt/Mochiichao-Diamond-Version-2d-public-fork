# Rig Spec — BIPED CREATURE TEMPLATE

> **Stage 3 of 6 shape** (Jamar's character-pipeline rig-spec
> template), pre-filled with the open-movie rig system extracted in
> `../RIG-TEARDOWN.md`. Copy this file per species, fill the
> species fields (marked `___`), never edit the system fields —
> system changes go in the teardown/template, then regenerate.
> Machine-readable twin: `biped.rig.json`
> (schema `mochiichao-rig-scaffold/v1` + teardown slots).

## Rig Style (Pick One)
- [ ] **Puppet** (2D cutout — show default)
- [ ] **3D** (Blender, CloudRig-component method)
- One species, one primary track; the other track is derived from
  the same scaffold so 2D and 3D stay consistent (house rule).

## File Naming
```
MC[ep]ORIGINAL_PUPPET_[CHARACTER]_VERSION_[###]
```
- Planned filename: `MC___ORIGINAL_PUPPET____VERSION_001`
- Show code: MC (Mochiichao) · Species: ___
- NEVER overwrite a version. Art renders in the one **Mochi art
  style of record** (repo canon art; creature-catcher anime read,
  hard cel) — design influence varies per species, render style
  never does. NO baked-in ground/contact shadows in character art —
  shadows are added at composite time (owner law).

## Generation (open-movie system — RIG-TEARDOWN §2)
- **Authoring unit is the scaffold (metarig equivalent).** Place
  joints on the Stage 2 construction lines, assign components,
  generate the rig. Proportion change = edit scaffold + regenerate.
- **Post-gen tweaks** go in `post_gen_notes`, never as hand edits
  to a generated rig (Universal Rig Standard: no hand-tooling).

### Components (per body part)
| Part | Component | Parameters |
|---|---|---|
| Spine | Spine: IK/FK (cartoon squash variant for squash-led species) | squash on/off, stretch limit ___ |
| Neck/head | Chain: FK + Aim (head aim target) | head-turn range ___ |
| Arm L/R | Limb: Generic IK/FK | IK/FK switch + snap, FK hinge, pole control |
| Fingers L/R | Chain: Finger | curl master per hand |
| Leg L/R | Limb: Biped Leg | IK/FK switch + snap, pole control |
| Tail (if any) | Curve: Spline IK with hooks | hook count ___, curl pose set |
| Face | Face system (§ Face) | — |
| Feature ___ (ears/fins/horns/wings) | Chain: Toon / Single Control | lag/follow-through offset ___f |

## Bone / Layer Layers (three-layer discipline)
- **Control layer** — animator-facing controls only; the only layer
  an animator touches.
- **Deform layer** — the only bones/layers carrying weights or
  pixels. Universal Rig Standard invariants are measured HERE:
  ≤4 influences per vertex, weights sum to 1, welded, zero NaN.
- **Mechanism layer** — IK chains, switch/snap helpers, lattice
  drivers. Carries **zero** weights, always. (Open-movie reference:
  ~85% of a production rig is mechanism — budget for it.)

## Layer Hierarchy (2D track; 3D mirrors these names)
```
[CODE]_[CHARACTER]
├── head
│   ├── eyes (→ expression symbol)
│   ├── pupils
│   ├── brows
│   ├── mouth (→ viseme symbol — HUMANS ONLY; creatures: cry/FX shapes only)
│   ├── jaw_lower (if jawed)
│   └── ears_or_features
├── torso
├── arm_L_upper / arm_L_lower / hand_L (→ pose symbol)
├── arm_R_upper / arm_R_lower / hand_R (→ pose symbol)
├── leg_L_upper / leg_L_lower / foot_L
├── leg_R_upper / leg_R_lower / foot_R
├── tail (if any)
├── accessories (shrinkwrap-fitted on 3D track)
└── fx (NO baked shadow layer — ever)
```

### Symbol Nesting Plan
| Symbol | Type | Frames | Notes |
|---|---|---|---|
| Mouth | Graphic | 10 Blair visemes (humans) / species cry shapes (creatures) | Character-specific drawings, Stage 4 pack |
| Hands | Graphic | open, fist, point, grip, wave, thumbs_up + species ___ | |
| Eyes | Graphic | neutral, blink, happy_closed, wide, half_lid, angry, sad, dizzy_spiral, sleep, star | |

_Use Graphic symbols (not MovieClips) for timeline sync._

## Deformation Stack (fixed order — RIG-TEARDOWN §3)
1. Armature / layer transforms (deform layer only)
2. Corrective Smooth equivalent (2D: redrawn corrective poses)
3. Shrinkwrap fit for worn items (shells, gear, collars)
4. Lattice patches (below)

### Lattice Patches
| Patch | Area | Driver control | Purpose |
|---|---|---|---|
| LP_face | cheeks + jaw | face_squash | dialogue squash, cheek puff |
| LP_belly | belly plate | body_squash | breathing, landing squash |
| LP_feature | ___ (species feature) | ___ | ___ |

Shape keys / corrective drawings: **budget ≤ 10 per rig** (open-
movie discipline). Solve with structure first.

## Face System
- Face = stepped **library of approved shapes** (2D: Blair symbol
  frames stepped by mouth data — see `../MOUTH-DATA-FORMAT.md`,
  humans only; 3D: action-driven poses). One design, both tracks.
- Teeth (if any) follow the mouth; eyelids are their own component.
- **Selection sets:** Face, Hands, Spine, Legs, All — defined at
  build time (Spring's animator-interface lesson).

## Joint Placement
_Based on Stage 2 construction lines:_
- Shoulder L/R: ___ · Elbow L/R: ___ · Wrist L/R: ___
- Hip L/R: ___ · Knee L/R: ___ · Ankle L/R: ___
- Neck: ___ · Jaw pivot (if any): ___ · Tail base (if any): ___

## Controls (beyond scaffold standard set)
root_translate, root_rotate, body_squash, body_stretch, body_lean,
head_turn, head_tilt, head_bob, arm_L/R IK-FK + snap, leg_L/R IK-FK
+ snap, finger_curl_L/R, mouth_step (humans), eye_step, blink_auto,
face_squash, + species: ___

## Range-of-Motion Test Plan
Standard battery (Universal Rig Standard extreme poses, adapted):
- [ ] Standing neutral
- [ ] Arms full overhead
- [ ] Arms crossed tight
- [ ] Wide stance + deep crouch
- [ ] Spine bent hard + twisted
- [ ] Combined arch
- [ ] Sit · 8-frame run cycle · jump-squash-land
- [ ] Species extremes: ___
- Battery is a **generated test pose set** run on every version,
  with before/after proof frames reviewed by eye (URS gates 2+4).
  Stretch gate on the 3D track: p99.9 edge stretch < 2.5.

## Timeline Settings
- Frame rate: 24 FPS · Safe areas: [ ] added

---
## Checklist — Stage 3 Done When:
- [ ] Rig style chosen · filename follows convention
- [ ] Components assigned per body part; scaffold regenerated clean
- [ ] Three-layer split verified (mechanism carries zero weights)
- [ ] Deformation stack in fixed order; lattice patches listed
- [ ] All symbols planned as Graphic (not MovieClip)
- [ ] ROM battery defined, run, proof frames reviewed
- [ ] No baked shadows anywhere in the rig art

**Study this:** `../RIG-TEARDOWN.md` §§2–4 · Universal Rig Standard
(Bannon) · rig standard in `show/production/rigs/README.md`
**Next:** → Stage 4: Viseme Pack (humans) / cry-shape pack (creatures)
