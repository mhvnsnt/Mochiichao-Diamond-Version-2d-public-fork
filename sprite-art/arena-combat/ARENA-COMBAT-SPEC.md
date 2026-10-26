# ARENA COMBAT SPEC — Mochiichao (Turn-Based Core + Continuous Between-Turn Layer)

Date: 2026-10-25. Order: Mars, 2026-10-25 ~19:11 CDT (Part 2 of the Arena Combat job).
Status: SPEC ONLY, local staging. No game code changed, no repo push, no
work-clone git changes, no `src/assets/` changes.

## 0. The vision, in one paragraph (Mars's words, in substance)

Battles stay TURN-BASED and Pokemon-style, but deeper and more alive. Unlike
3D Pokemon games where creatures stand in one spot waiting to attack,
Mochiichao creatures MOVE AROUND the arena and FIGHT BETWEEN TURNS —
circling, sparring, clashing, repositioning — but take NO REAL DAMAGE
until the player chooses an attack. The between-turn fighting is visual,
positional, and pressure-building, so watching and simulating a battle is
worth it: more RPG, more sandboxy, more combaty than sitting watching
idle animations.

## 1. BALANCE NOTE — READ FIRST (mandatory, prominent)

**ONLY chosen attacks deal real HP damage. Between-turn sparring NEVER
decides HP on its own. Ever.**

- Sparring clashes show contact, sparks, and knockback-without-damage.
  No HP bar moves, no damage number appears, no status is inflicted,
  no faint can occur during the between-turn layer.
- Positioning (range band, flank angle, momentum — §3) may modify the
  NEXT chosen attack by small, capped amounts. Those modifiers are the
  ONLY way between-turn play touches damage, and they are bounded in §3.4.
- If any implementation lets a sparring clash subtract HP, inflict a
  status, or faint a creature, that implementation is wrong and must be
  reverted, even if it looks exciting. The excitement comes from the
  staging, not from free damage.

### 1.1 Anti-exploit rules (sparring cannot stall, farm, or loop forever)

1. **Turn clock (hard cap).** Each between-turn window lasts at most
   30 s. At 20 s a visible "choose now" prompt appears; at 30 s the
   game executes a deterministic fallback — the player's last-used
   move, or the first move in the list if none was used — with whatever
   positioning modifiers are live at that moment. No extra attack is
   ever granted for waiting, and waiting never improves a modifier
   past its cap.
2. **Momentum cannot be farmed.** Momentum (§3.3) caps at 100. Only the
   first 3 sparring clashes in a turn window award momentum; further
   clashes award 0. Momentum resets to 0 the moment a chosen attack
   resolves (it is spent, not banked across turns).
3. **Clash rate limit.** Minimum 1.2 s between sparring clashes, and at
   most 6 clashes per turn window. After the 6th clash both creatures
   auto-separate to neutral spacing (see §2.4) and sparring pauses
   until the player chooses an attack.
4. **Pressure escalation (anti-stall).** Every 5 s without a choice,
   both creatures' between-turn movement speed rises +20% (capped at
   +60%) and the clash-interval floor drops to 0.9 s. The arena gets
   busier, not quieter, the longer a player waits — stalling is
   boring to watch and gains nothing.
5. **No positional lockout.** Positioning modifiers never deny an
   attack. A melee attack chosen from Far band still lands: the
   attacker travels during the travel phase (§4.1) and the attack
   resolves at 1.00× range modifier. Positioning rewards good play;
   it never vetoes a choice.
6. **Deterministic sparring.** Sparring outcomes (who "wins" a clash
   visually, clash direction, spark count) are seeded per turn window,
   like `battleTreatments.js` particle seeds. Replays match; no RNG
   farm can be gamed, because sparring awards nothing except capped
   momentum (§3.3).

## 2. Turn-based core — the chosen attack (§4 staging is the law)

### 2.1 The rule

The player opens the turn menu, chooses an attack (or item / switch /
run, which use the same travel-and-return staging minus damage), and
ONLY then does HP move. The full treatment staging from
`BATTLE-ANIMATION-RESEARCH.md` §4d/§6 and
`animation/treatments/battleTreatments.js` applies to every chosen
attack, unchanged:

| Phase | Light | Heavy | Notes |
|---|---|---|---|
| Telegraph | ~200–400 ms | ~200–400 ms | Weight shift, target lock, camera push begins. No damage yet. |
| Travel (physical) / Cast (projectile) | 200–500 ms | 200–500 ms | ARC, not a straight slide; projectile has a visible trail. |
| Windup | 250 ms | 500 ms | Plant, pull back, squash. Last readable beat before contact. |
| Strike + impact frame (frame-0 rule) | 80 ms | 100–130 ms | ONE clear extended pose. On the exact contact frame: impact flash + particles + impact SFX + camera shake + hitstop fire TOGETHER. |
| Hitstop (impact hold) | 50–100 ms | 100–200 ms | World freezes except flash/particles. Impact pose HELD. Treatment module: 90 ms default. |
| Recoil | 200–350 ms | 350–550 ms | Defender displaced (light 8–16 px, heavy 24–48 px + hop), hurt art shown. |
| Return | 300–600 ms | 300–600 ms | Attacker and defender ease back to stance/spot. |
| HP drain + damage number | 170–330 ms | 170–330 ms | AFTER hitstop only, never during the freeze. |
| TOTAL (excl. travel) | ~750–850 ms | ~1,200–1,350 ms | Treatment module single-hit total: 1,040 ms (250 + 90 + 300 + 400). |

- Multi-hit moves: 120–200 ms gap between hits; each hit gets its own
  impact frame + mini-hitstop.
- Faint: SKIP the return — go straight to the faint collapse
  (800–1,200 ms, per body archetype), then fade/dissolve 300–500 ms.
  Never recoil-then-walk-back-then-faint.
- Skip / 2× speed: any sequence must be skippable or fast-forwardable.
  Never lock the player into a full sequence with no out.
- Severity (treatment module, damage-driven only): light ≤15% of max
  HP, medium ≤35%, heavy ≤60%, critical = crit or >60%. Recoil
  10/18/28/38 px, shake 2/4/7/10 px, particles 6/12/20/28, camera zoom
  1.04×/1.08×/1.14×/1.20×. The game passes `damageFraction` + `isCrit`;
  it never passes a severity string.

### 2.2 What the between-turn layer is NOT

It is not a second battle system, not real-time combat, and not a
cooldown system. The turn menu still gates every real action. The
between-turn layer runs ONLY while the player is deciding (state
`BETWEEN_TURN`, §6), and it freezes the instant a choice is made —
the chosen attack's staging (§2.1) takes over completely.

## 3. Continuous between-turn layer

Runs while the turn menu is open. Both creatures idle continuously
(never synchronised: foe's breath cycle offset 30–50%), and on top of
idle they move, spar, and reposition under a movement AI. All motion
uses the idle loop's own timing classes (see §5.1) so a creature never
snaps between a 1,200 ms bouncy idle and a different movement clock.

### 3.1 Movement AI — behaviours

The AI picks one behaviour at a time per creature, re-evaluated every
0.5 s, seeded per turn window (§1.1 rule 6). Speeds are in arena
units per second (u/s); the arena floor is a circle of radius 10 u,
neutral spacing is 6 u apart, facing is always toward the foe unless
a behaviour says otherwise.

| Behaviour | Motion | When chosen | Speed |
|---|---|---|---|
| ADVANCE | Move toward foe, facing foe | Spacing > 6 u, or momentum < 30 | 2.0 u/s (heavy creatures 1.4 u/s) |
| RETREAT | Move away from foe, facing foe (back-step) | Spacing < 2 u and creature is the "pressured" side this window, or after losing a clash visually | 2.2 u/s |
| CIRCLE | Orbit foe at current radius, clockwise or counter-clockwise (seeded per window) | Default behaviour; spacing within 2–8 u | 1.6 u/s tangential |
| STALK | Slow approach with lowered posture (squash transform 0.97× height), facing foe | Aggressive temperament, or momentum ≥ 50 | 1.0 u/s |
| HOLD | Stay in place, idle loop only | Immediately after a clash (0.8 s), or at neutral spacing with no pressure | 0 u/s |
| SEPARATE | Both creatures move to neutral 6 u spacing | After the 6th clash in a window (§1.1 rule 3), or after a chosen attack's return completes | 2.5 u/s until 6 u reached |

- **Spacing control.** Creatures never overlap: minimum separation
  1.2 u (body radius). If ADVANCE would breach it, the creature stops
  at 1.2 u and the next evaluation picks CIRCLE or a clash.
- **Body-type overrides.** Flyers/hoverers (idle classes `float_hover`,
  `hover_swim`) circle at altitude with a vertical sine bob, never
  grounded footwork. Seated creatures (Ashemit) circle by slow hover-
  shuffle, not walking. Static creatures (Cocoonode) do not translate
  at all: their "movement" is pulse + facing rotation only, and they
  count as HOLD for spacing purposes — the foe does all the
  repositioning around them. Heavy creatures move slower (§3.1 table)
  but are never knocked back by sparring (§3.2: knockback is visual
  and equalised, not mass-simulated).
- **Facing rule.** A creature's facing yaw always tracks its foe
  during ADVANCE / RETREAT / STALK / HOLD. During CIRCLE, facing
  lags the foe by up to 30° (the creature is side-on while orbiting),
  which is exactly what creates flank angles (§3.2).

### 3.2 Sparring clashes — visual contact, zero HP

A clash triggers when: spacing ≤ 1.8 u AND both creatures are in
CIRCLE / ADVANCE / STALK AND the 1.2 s clash floor (§1.1 rule 3) has
passed AND fewer than 6 clashes have occurred this window.

A clash, beat by beat (total ~700 ms, all visual):

1. **Feint (150 ms).** Both creatures lean toward each other (squash
   transform, 0.95× height) — the telegraph, so the clash reads.
2. **Contact (instant, frame-0 for sparks).** Limbs/body meet at the
   midpoint. Spark burst spawns: 4–8 particles, element-tinted,
   lifetime 250 ms. A short metallic/impact tick plays at low volume
   (distinct from a chosen-attack impact SFX — quieter, no shake).
3. **Knockback-without-damage (250 ms).** Both creatures translate
   back 0.4 u along the clash axis (equal, regardless of body type),
   ease-out cubic, then ease back over 300 ms. NO HP bar moves, NO
   damage number, NO hurt art is shown (hurt art is reserved for
   chosen attacks — showing it here would teach the player that
   sparring hurts, which it does not). Idle loop resumes immediately.
4. **Outcome (visual only).** One creature is seeded as the visual
   "winner" (it recovers 100 ms faster and advances 0.3 u; the other
   retreats 0.3 u). This feeds momentum (§3.3) and flank angle for
   the NEXT chosen attack — it never feeds HP.

Clash presentation in 2D vs 3D is in §5; the timing above is the same
for both.

### 3.3 Positioning feeds the NEXT chosen attack — the three modifiers

All three are read at the moment the player confirms a chosen attack,
applied to that attack only, then momentum resets (§1.1 rule 2).
Nothing persists across turns except nothing — that is the point.

#### (a) Range bands (from spacing at choice time)

| Band | Spacing | Melee attack | Projectile / ranged attack |
|---|---|---|---|
| Close | < 2 u | +5% power | −5% accuracy (rushed point-blank shot) |
| Mid | 2–5 u | 0 | 0 |
| Far | > 5 u | 0 (attacker travels in, §2.1; no penalty) | +5% accuracy (settled aim) |

#### (b) Flank angle (from attacker's position relative to defender's facing)

| Arc | Angle off defender's facing | Effect |
|---|---|---|
| Front | 0–45° | 0 |
| Side | 45–135° | +5% accuracy |
| Rear | 135–180° | +10% accuracy AND +5% power |

Flank is measured from the defender's facing yaw at choice time, not
from where the defender "should" be facing. Circling (§3.1) is how a
player earns a flank: a creature that has held a side/rear arc for
≥ 1.0 s before the choice banks that arc's bonus.

#### (c) Momentum meter (0–100, per creature, per turn window)

- +8 per sparring clash in which that creature is the visual winner
  (§3.2 step 4); +0 for losing a clash; +0 for clashes 4–6 in a window.
- +15 for holding a side or rear flank arc continuously for 2.0 s
  (once per window per creature).
- Decays −5 per second after 10 s without a choice (pressure
  escalation, §1.1 rule 4 — waiting bleeds momentum, it does not bank it).
- Effect on the next chosen attack: momentum 50–79 → +5% power;
  momentum 80–100 → +10% power; below 50 → 0.
- Resets to 0 when the chosen attack resolves.

#### 3.4 Stacking caps (hard limits, no exceptions)

- **Total power bonus from positioning: capped at +15%.**
  (Example max stack: Close melee +5% + rear flank +5% + momentum
  80+ +10% = +20% raw → capped to +15%.)
- **Total accuracy bonus: capped at +10 percentage points; total
  accuracy penalty: floored at −5 points.** Accuracy itself is
  clamped to 5–100% after all modifiers.
- **Crit chance is NEVER modified by positioning.** (Rear flank
  gives accuracy + power, not crit — crit stays a property of the
  move and the creatures, so positioning cannot be farmed into a
  crit build.)
- **No modifier applies to healing, switching, items, or run
  attempts.** Only damage-dealing chosen attacks.
- Worked example: Mochii holds a rear arc for 2 s (+15 momentum),
  wins 2 clashes (+16) = 31 momentum → +0 power from momentum; rear
  flank +5% power, +10% accuracy; spacing 1.6 u (Close) +5% power.
  Total: +10% power, +10% accuracy — inside both caps, applied to
  the next chosen attack only.

## 4. Camera behaviour

The camera is a state machine with named shots (per
`BATTLE-ANIMATION-RESEARCH.md` §7.5), not ad-hoc offsets. One camera
serves both 2D and 3D presentation; 2D uses zoom, 3D uses dolly
(§5.2 mapping: dolly metres = (zoom − 1) × 2.0).

| Shot | When | Move | Timing (tied to treatment beats) |
|---|---|---|---|
| NEUTRAL | Default; whole between-turn layer | Frames both creatures + 1 u margin; slow drift following the midpoint of the two creatures | Continuous; drift eased, never snapping |
| FOLLOW | Between-turn movement | Tracks the midpoint; gentle push-in (1.02×) while either creature ADVANCEs | Ease 400 ms |
| CLASH | Sparring clash (§3.2) | Quick push-in to 1.04× on the clash midpoint, release on knockback end | Push 150 ms, hold through contact, release 300 ms |
| WINDUP_PUSH | Chosen attack, telegraph + windup | Push toward attacker (treatment zoom: 1.04× light → 1.20× critical) | 250–400 ms ease-in, across windup (treatment `CAMERA_PUSH_MS` 340 ms) |
| IMPACT_CUT | Chosen attack, strike frame | Hard cut to the impact framing (allowed AT the strike, never during windup) | 0 ms (cut) |
| IMPACT_SHAKE | Chosen attack, hitstop + recoil | Shake, severity amplitude (2/4/7/10 px), decaying | Starts frame 1–2 after contact, window 350 ms (treatment `SHAKE_MS`), heavy up to 300 ms |
| TILT_BIG | Heavy / critical / KO / phase-change moments | Tilt 4° (heavy), 6° (critical), 8° (KO or boss-phase change, cf. Empress boss-phase camera tilt in prior research) | Tilt in 200 ms, hold through hitstop, ease back 400–600 ms with the return |
| RETURN_NEUTRAL | Chosen attack, recovery | Ease back to NEUTRAL framing | 400–600 ms ease-out, overlapping recovery |

- **Between-turn camera never shakes.** Sparring clashes get a
  push-in only — shake is reserved for real damage, so the player
  learns: shake = HP moved.
- **Reduced-motion / accessibility.** A reduce-motion setting zeroes
  shake and tilt and halves push-in zooms; hitstop and flash remain
  (flash capped at 3 per second overall, per prior research).
- **2D vs 3D note.** In 2D, "tilt" is a rotation of the scene layer
  (small angles only, 4–8°, so sprites do not shear). In 3D, tilt is
  a real camera roll. Same angles, same timing, different renderer.

## 5. Dual presentation mapping

### 5.1 (a) 2D sprite sheets — locked atlases, idle loops, hurt frames, treatment hooks

- **Idle loops (done: 51/51 = 100%).** `animation/idle/<creature>/`:
  4-step loop `[A, B, A, C]`, loop = true, built from the locked
  `battle_front` cell (A = locked cell, B = bob, C = breath
  transform; Manticlaw C only = second distinct locked cell, mapped).
  Cycle times by class: grounded 1,800 ms (25 sets), small_bouncy
  1,200 ms (7), float_hover 1,800 ms (2: Wispkin, Floatcalf),
  hover_swim 1,400 ms (9), seated 2,400 ms (Ashemit), static_crystal
  2,200 ms (Cocoonode pulse), heavy 2,800 ms (6). The between-turn
  layer DRIVES these loops (movement translates the sprite; the loop
  itself never changes) — no new idle art is needed for arena motion.
- **Hurt frames (accepted: 4/51 = 8%; owed: 47/51 = 92%).**
  `animation/hurt/<creature>/`: Mochii (Mars-approved pilot), Razorgater,
  Tyrage, Kittember accepted; Sproutle v2 owed (v1 missing its visor);
  all other sets owed. Hurt art plays ONLY for chosen attacks
  (§3.2: sparring never shows hurt art). Until a set's hurt art
  exists, the treatment fallback carries the hit: flash + recoil
  translation + shake + particles + 90 ms held impact frame, with
  `defenderArt` staying `'standing'`.
- **Treatment module hooks (the build agent wires these, it does not
  re-invent them).** `animation/treatments/battleTreatments.js`:
  `buildHitTimeline({damageFraction, isCrit, direction, seed})` →
  `sampleHitPose(tMs, timeline)` per frame → apply
  `defenderOffsetX/Y`, `defenderRotationDeg`, `flash`/`flashColor`,
  `shakeX/Y`, `cameraZoom`, `defenderArt` (`'hurt'` vs `'standing'`),
  `frozen` (during hitstop, do not advance any other animation clock
  except flash/particles). Arena additions the build agent must add
  alongside (not instead of) this module: `sampleArenaPose` for the
  between-turn layer (position, facing yaw, behaviour, momentum,
  range band, flank arc) and `sampleClashPose` for §3.2 clashes
  (feint squash, 0.4 u knockback, spark burst). Same deterministic-
  seed discipline: no `Math.random` in the sampled path.
- **Sparring in 2D needs no new art.** A clash is: both sprites lean
  (squash transform), translate 0.4 u back, spark particles spawn.
  The idle B/C frames already provide the lean/breath shapes; the
  clash reuses them with translation. If Mars later wants dedicated
  clash poses, that is a per-creature generation job, not a blocker.
- **Strikechamp looks (final, Mars 2026-10-25 ~19:01 CDT).** Suited =
  default; helmeted lower-only (bare chest, red pants, helmet) =
  REGULAR no-armor second look; no-helmet full unsuited (face showing,
  red suit) = RARE SHINY VARIANT (~10%), not canonical. All three
  looks share the same arena state machine; only the sprite set swaps.

### 5.2 (b) 3D rigs — Dorowani / Gabu bone-space movement via mapTo3D, and future rigs

- **Existing mapping (do not duplicate).**
  `mapTo3D(timeline, pose)` converts the SAME timeline + sampled 2D
  pose into rig values: root offset = px × 0.01 rig units,
  spine lean = 2D rotation × 2.5, head pitch −4° to −16° by recoil
  fraction when hurt art is shown, camera dolly = (zoom − 1) × 2.0 m,
  hurt-pose blend weight 1/0, same flash, same hitstop freeze. One
  timeline, two renderings — never a second timing system.
- **Arena movement in bone space (new, build agent implements).**
  Between-turn behaviours (§3.1) map to rig channels, not to sprite
  translation:
  - ADVANCE / RETREAT / CIRCLE / STALK / SEPARATE → **root-bone
    translation** on the ground plane (same u/s speeds as §3.1,
    converted by the rig-unit scale) + **facing-bone yaw** toward
    (or, during CIRCLE, lagging) the foe.
  - Idle loop → the rig's idle clip at the creature's idle-class
    cycle time (§5.1), blended over root motion, never snapping.
  - Clash feint → spine squash (scale Y 0.95); clash knockback →
    root translation 0.4 u back with the same ease-out cubic as 2D;
    clash sparks → particle spawn at the midpoint in world space.
  - Chosen attack → the §2.1 staging through `mapTo3D`, with travel
    as root motion along an ARC (root path curves, it does not
    lerp in a straight line).
- **What future rigs MUST have (requirement, not a wish list).**
  A rig that cannot do these cannot enter arena mode:
  1. **Root-motion bone** — a single root bone whose ground-plane
     translation drives arena position; feet/hips must NOT carry
     translation independently, or position and animation will drift.
  2. **Facing bone** — a yaw-only bone (or root yaw channel) that
     turns the creature toward / around the foe independently of
     root translation, so CIRCLE can lag facing by up to 30° (§3.1)
     and flank arcs (§3.3b) can be measured from it.
  3. **Spine + head bones** — spine lean (× 2.5 from 2D rotation)
     and head pitch (−4° to −16° on hurt) must have bones to land on;
     a rig with a single torso bone cannot express recoil.
  4. **Hurt-pose blend target** — a named hurt pose (or blendshape
     set) that `hurtPoseWeight` 0→1 can drive; without it, the rig
     falls back to translation + flash only, like a 2D set with no
     hurt art.
  5. **Ground-plane discipline** — root Y stays on the arena floor
     except for the scripted hop on heavy recoil / launch moves;
     flyers/hoverers carry altitude on a separate channel, never on
     root Y, so spacing math (§3.1) stays 2D.
- **Dorowani / Gabu status (honest).** Their arena rigs are NOT yet
  verified against `mapTo3D` — the mapping is documented and the
  idle timing falls back to grounded-standard 1,800 ms (no rig clip
  file was found locally at idle-build time; the pulled folder holds
  only a README). The build agent must verify root-motion + facing
  bones on the real Dorowani/Gabu rigs before claiming arena mode
  works for them; if a rig lacks a facing bone, that creature's
  CIRCLE behaviour degrades to HOLD + yaw-by-translation, and the
  spec records the downgrade rather than faking a flank.

## 6. State machine outline (the build agent implements this)

States (uppercase) with the layer they belong to. `BETWEEN_TURN`
substates run concurrently with the turn menu being open.

```
BATTLE_START
  → (both creatures spawn at neutral 6 u spacing, idle loops start,
     foe loop phase-offset 30–50%)
  → BETWEEN_TURN

BETWEEN_TURN
  ├─ CIRCLING    (default; orbit at current radius, §3.1 CIRCLE)
  ├─ ADVANCING   (ADVANCE / STALK toward foe)
  ├─ RETREATING  (RETREAT / back-step)
  ├─ HOLDING     (HOLD; idle only, 0.8 s after a clash)
  ├─ SPAR_CLASH  (feint → contact/sparks → knockback-without-damage → recover; §3.2)
  └─ SEPARATING  (auto-separate to 6 u after 6th clash or after a chosen attack's return)
  Transitions within BETWEEN_TURN:
    CIRCLING ↔ ADVANCING ↔ RETREATING ↔ HOLDING  (AI re-evaluation every 0.5 s, §3.1)
    any → SPAR_CLASH  (spacing ≤ 1.8 u + clash floor passed + clashes < 6)
    SPAR_CLASH → HOLDING  (0.8 s hold, then re-evaluate)
    any → SEPARATING  (6th clash done; or turn clock ≥ 30 s with no choice → fallback choice, §1.1)
    any → CHOSEN_ATTACK  (player confirms a choice; between-turn motion FREEZES at that frame)
  Invariants in BETWEEN_TURN: HP never changes; momentum caps at 100;
    clashes ≤ 6; clock ≤ 30 s; positions clamp to arena radius 10 u
    and minimum separation 1.2 u.

CHOSEN_ATTACK  (frozen between-turn pose is the start frame)
  ├─ TELEGRAPH   (200–400 ms; camera WINDUP_PUSH begins)
  ├─ TRAVEL      (physical, 200–500 ms, ARC)  |  CAST (projectile, 250–400 ms)
  ├─ WINDUP      (250 ms light / 500 ms heavy; squash, pull-back)
  ├─ STRIKE      (80 ms light / 100–130 ms heavy; IMPACT_CUT camera cut AT this frame)
  ├─ IMPACT_HOLD (hitstop 50–200 ms; frame-0 flash + particles + SFX + shake start; frozen = true)
  ├─ RECOIL      (200–550 ms; defender displaced, hurt art shown, HP drain AFTER hitstop)
  └─ RETURN      (300–600 ms; both ease to stance/spot; camera RETURN_NEUTRAL)
  Transitions:
    CHOSEN_ATTACK → RESOLUTION  (always, after RETURN — except faint, see below)
    CHOSEN_ATTACK → FAINT  (if defender HP hits 0: SKIP return, straight to faint collapse)
    Multi-hit: STRIKE → IMPACT_HOLD → RECOIL loops per hit with 120–200 ms gaps,
      then RETURN once at the end.

RESOLUTION
  → apply damage number + HP drain (already staged in RECOIL/RETURN),
    apply status / stat changes from the chosen attack only,
    check faint / battle-end conditions, reset momentum to 0,
    reset clash count to 0, reset turn clock.
  → TURN_END → (switch / item / run resolution if chosen instead of an attack)
  → BETWEEN_TURN  (next turn's decision window; SEPARATING runs first
     if spacing ≠ 6 u, then CIRCLING)
  → BATTLE_END  (all of one side fainted; no BETWEEN_TURN re-entry)

BATTLE_END
  → victory / defeat staging; arena aftermath marks (scorch/crater/
    splash) persist until battle end, then fade.
```

- **Pause / skip.** At any point in `CHOSEN_ATTACK`, player skip or
  2× fast-forward jumps to `RESOLUTION` (HP result already computed;
  only staging is skipped). `BETWEEN_TURN` has no skip — it ends by
  choosing.
- **Interrupt rule.** Nothing interrupts `CHOSEN_ATTACK` once
  TELEGRAPH starts — no new sparring, no AI re-evaluation — until
  `RESOLUTION`. This is what keeps the game turn-based: one chosen
  action, fully staged, then the next decision window.

## 7. Demo scenario — Mochii vs Razorgater (two creatures circling, sparring, then a chosen attack)

Both creatures have accepted hurt art (Mochii approved pilot,
Razorgater accepted), so every beat below is playable with real art,
not fallback. Timings are wall-clock; camera shots are §4 names.

1. **t = 0 s — BATTLE_START → BETWEEN_TURN / CIRCLING.** Mochii and
   Razorgater spawn 6 u apart. Both idle: Mochii small_bouncy 1,200 ms
   loop, Razorgater grounded 1,800 ms loop, foe phase-offset ~40%.
   Camera NEUTRAL, slow drift on the midpoint.
2. **t = 0–4 s — CIRCLING + ADVANCING.** Razorgater ADVANCEs to 4.5 u;
   Mochii CIRCLEs counter-clockwise, holding a side arc (45–90°) for
   2.0 s → Mochii momentum +15 (flank-hold bonus, §3.3c).
3. **t = 4.0 s — SPAR_CLASH #1.** Spacing 1.7 u. Feint 150 ms (both
   squash), contact sparks (6 particles, water-tinted vs chrome
   sparks), knockback 0.4 u each, no HP moves, no hurt art, camera
   CLASH push-in 1.04×. Seeded winner: Razorgater recovers 100 ms
   faster, advances 0.3 u. Mochii momentum stays 15; Razorgater
   momentum 8.
4. **t = 5.2 s — SPAR_CLASH #2.** Spacing closes again. Mochii wins
   visually → Mochii momentum 15 + 8 = 23. Camera CLASH push-in again.
   Both HOLD 0.8 s, then CIRCLING resumes.
5. **t = 6 s — Player chooses Mochii's attack.** At choice time:
   spacing 1.6 u (Close band), Mochii holds a rear arc (150°, held
   1.2 s — banks rear flank), momentum 23 (< 50 → +0 power).
   Modifiers: Close melee +5% power, rear flank +5% power and +10%
   accuracy. Total +10% power, +10% accuracy — inside caps (§3.4).
   Between-turn motion FREEZES; the frozen circling pose is the
   start frame of the attack.
6. **t = 6.0–6.3 s — TELEGRAPH + WINDUP.** Mochii shifts weight,
   locks on, squashes; camera WINDUP_PUSH to 1.08× (medium severity
   preview — final severity set by damage dealt, §2.1).
7. **t = 6.3–6.8 s — TRAVEL + STRIKE.** Mochii crosses the gap on an
   ARC (not a slide), plants, strikes in ONE extended pose; camera
   IMPACT_CUT at the strike frame.
8. **t = 6.8 s — IMPACT_HOLD (frame-0 rule).** Flash + particles +
   impact SFX + shake start + 90 ms hitstop, impact pose HELD.
   Camera IMPACT_SHAKE (medium: 4 px) and TILT_BIG only if the hit
   lands heavy/critical — in this demo it lands medium, so no tilt.
9. **t = 6.9–7.6 s — RECOIL + RETURN.** Razorgater hurt art shows,
   displaced 18 px (medium) with damped-sine return, HP drains AFTER
   hitstop with the +10% power modifier applied to the damage number.
   Both ease back; camera RETURN_NEUTRAL over 400–600 ms.
10. **t = 7.6 s — RESOLUTION → BETWEEN_TURN.** Momentum resets to 0
    both sides, clash count resets, turn clock resets. SEPARATING
    runs until spacing is 6 u again, then CIRCLING resumes for the
    next decision window. Razorgater's HP bar shows the only HP
    change in the entire scenario — the two sparring clashes moved
    nothing, exactly as §1 requires.

## 8. What this spec deliberately does NOT decide (build-agent notes)

- Exact per-move particle colours/shapes (wiring-time table in the
  treatment module's spirit; colour/shape per move type is not built
  into `battleTreatments.js` today).
- Dedicated sparring/clash pose art per creature (2D clashes reuse
  idle transforms + translation, §5.1; dedicated poses are a future
  per-creature generation job if Mars wants them).
- Faint-collapse art per body archetype (owed alongside hurt art;
  the staging and timing are specified in §2.1, the drawings are not
  yet made).
- Arena floor visuals (surface types, scorch/crater aftermath marks
  persisting to battle end — staging specified in §4d of prior
  research; art assets are a separate job).
- Game wiring itself (0% — treatment module and this spec are local
  drafts; importing them into the React/Vite battle scene is the
  build agent's job, under §6's state machine).

## 9. RECONCILIATION — pending ARENA-COMBAT-RESEARCH.md (DO NOT FILL WITH INVENTED CLAIMS)

A separate research agent is concurrently writing
`ARENA-COMBAT-RESEARCH.md` on Arena 2D (Big Kid Nation) vs Empress
(Omniscye). This spec was written BEFORE that file lands and is
consistent with the vision and with `BATTLE-ANIMATION-RESEARCH.md`
only. When the research file arrives, the build agent (or a
follow-up spec pass) MUST reconcile the following points against it
and amend this spec — not silently, but as a dated amendment section
below this one:

1. **Arena 2D (Big Kid Nation) — real-time vs turn-based adaptation.**
   Prior research states only: pre-alpha, technique-only, NOT
   playable, no public repo/code/frame data; real-time arena fighting
   with aimed attacks, dodges, and terrain deformation. This spec
   ADAPTS that to turn-based play by confining all real-time-feeling
   motion to the between-turn layer (§3) and freezing it on choice
   (§6). If the research file finds any public, citable Arena 2D
   timing or mechanic beyond trailer/coverage description, reconcile:
   does it change a §3.1 speed, a §3.2 clash beat, or the §1.1 clash
   cap? If it finds nothing new, record that and change nothing.
2. **Empress (Omniscye) — aimed attacks, turn-back return, Perfect
   Dodge, camera tilt.** Prior research states only: playable, with
   aimed attacks (mouse / right-stick / hold-and-drag), a "turns
   back" return after attacking, Perfect Dodge poses (precisely
   timed dodge, cooldowns reduced 1.5 s in Empress's own system),
   camera tilt on boss phases, and telegraphed strikes. This spec
   already uses: aim-then-return (§2.1 RETURN, §5.2 facing bone),
   telegraph-before-strike (§2.1), and tilt on big moments (§4).
   It does NOT import Empress's Perfect Dodge cooldown reward:
   sparring has no cooldowns to reduce in a turn-based game, so a
   dodge reward must not be invented here. Reconcile: if the research
   file documents a dodge pose or timing that fits turn-based
   sparring, add it as a §3.2 clash variant (visual only, no HP,
   no cooldown effect) — or record why it does not fit.
3. **Camera tilt on boss phases.** This spec sets tilt at 8° for
   KO/phase-change moments (§4) from the prior research's one-line
   note that Empress tilts the camera in boss Phase 2. If the
   research file gives a more specific tilt, duration, or trigger,
   replace the 8°/200 ms/400–600 ms numbers with the researched ones
   and cite them; do not keep both.
4. **Idle-timing reconciliation (carried over).** The idle manifests
   already flag their timing as "to be reconciled with the parallel
   idle-timing research." If ARENA-COMBAT-RESEARCH.md (or the idle
   research) revises any §5.1 cycle time, update §5.1 and the
   manifests together — never one without the other.
5. **Claims this spec does NOT make (do not add without a source).**
   No claim is made here about Arena 2D frame data, source code,
   playable builds, or a public repo (prior research found none);
   no claim about Empress internals beyond its public devlog
   staging patterns; no claim that any commercial game's files were
   used. Any future amendment that adds such a claim must cite a
   public source or be rejected.

## 10. Guardrail (standing)

Movements, timing, techniques, systems, structures, data shapes, and
file formats are in scope 100% (Mars 2026-10-25 ~19:05 CDT). Mochiichao
makes its own art, models, and music in this lane. Never propose using
Nintendo (or any commercial game's) art, model, or music files in the
repo or the game. No binary animation, model, sprite, or music file
from a commercial game is lifted, copied, or extracted for this spec.

---
Sources this spec builds on (all local, all already in the lane):
- `sprite-art/BATTLE-ANIMATION-RESEARCH.md` (staging, frame-0 rule,
  light ~750–850 ms / heavy ~1,200–1,350 ms, hitstop 50–200 ms)
- `sprite-art/animation/treatments/battleTreatments.js` +
  `sprite-art/animation/battle-treatments.md` (250/90/300/400 ms beats,
  damage-scaled shake/particles/camera push, `mapTo3D` for rigs)
- `sprite-art/animation/idle/IDLE-INDEX.md` + per-creature manifests
  (idle 51/51 = 100%, 4-step `[A,B,A,C]` loops)
- `sprite-art/animation/hurt/HURT-INDEX.md` (hurt art 4/51 = 8%,
  47/51 = 92% owed; Mochii approved pilot)

---

## 11. AMENDMENT — scope + ring capture + fight-as-creature (Mars, 2026-10-25)

Dated amendment per §9's mechanism. Read in order; the latest
correction wins where they differ. NOTHING in this amendment changes
the balance law (§1), the state machine (§6), the modifier caps
(§3.4), the camera shots (§4), or the treatment beats (§2.1).

### 11.1 Scope correction — real moves/animations, final (Mars ~19:44 CDT)

Moves and animations are NOT replaced. The ONLY exclusions are
creature NAMES, SOUNDS, ART and DIALOGUE. Everything else comes in
100%: all moves, all animations, all fire, all attacks, all motions,
all environment stuff, wired into the arena combat system with real
data. Concretely for this build:

- Move catalog: the repo's own already-extracted decomp data,
  `src/lib/generated/decomp_black2_moves.json` (source
  `pokebw2/res/moves/*/data.json`, 560 moves, on main via PR #8;
  FireRed/HeartGold move files likewise on main). The controller
  maps entries with `toArenaMove` (Physical → melee/travel,
  Special → projectile/cast, Status → status/non-damage; decomp
  accuracy 0 = never misses → 100, provenance preserved).
- What was genericized and is now real: the demo's hand-written
  Tackle (power 40) is replaced by real Black 2 Tackle
  (Normal/Physical, power 50, accuracy 100, `MOVE_TACKLE`,
  `BATTLE_EFFECT_HIT`); the demo adds real Ember (Fire/Special,
  power 40, accuracy 100, `MOVE_EMBER`, `BATTLE_EFFECT_BURN_HIT`)
  as turn 2 with CAST staging, and real Bite for the foe. The §7
  prose ("Mochii's attack") is unchanged; the demo now names the
  real moves and prints their catalog provenance.
- Animation timing/motion data was already real (treatment beats
  250/90/300/400 ms, clash beats, camera tilts from the research)
  and stays so — no genericized animation data existed to replace.

### 11.2 Ring capture — excluded from arena, optional gated subsystem (Mars ~19:45, refined ~19:49, zone ~19:51, theme ~19:54)

- Default capture is normal Pokemon-style (Luigi Cubes), a separate
  system. Ring capture is NEVER the default and is NEVER wired into
  arena combat turn resolution. `arenaCombat.js` contains NO capture
  code.
- Ring capture returns as an OPTIONAL subsystem: a NEW zone
  introduces it; after playing there the player UNLOCKS it as an
  option, BUYS ring-capture items in shops, and can then ring-capture
  whenever they want — gated on BOTH the zone-unlock flag AND item
  ownership. A ring attempt without both falls back to (or is
  refused in favour of) the default Luigi Cube capture, never
  silently succeeding as a ring capture. Full flag table, unlock
  flow and gate truth table: module `README.md` §Ring capture.
- The zone is NOT the Safari zone (Mochiichao already has Harbor
  City preserve / safari area in canon). It is a NEW zone whose
  THEME is retro-arcade (cabinets, neon, retro-game scenery as the
  setting) — arcade is theme and name direction, NOT the mechanic;
  the mechanic stays ring capture, remade as Mochiichao's own,
  played inside that zone. The zone is NOT called "Arcade Zone";
  its exact name is TBD — candidates are proposed in the README,
  none locked, none used in code.
- The zone itself and the shop items are separate work, NOT built
  by the arena agent. PR #35's `captureLoop.js` ring track is
  another lane's file: per ~19:49 it is NOT deleted and NOT marked
  unused — it is the future gated subsystem's reference, to be
  gated when its owner wires it.
- Verification: a grep of this spec, the module, its tests and its
  demo for a ring-capture loop finds ZERO references (only the
  substring in "during"). No ring-capture loop existed here to
  remove; this amendment records the exclusion so none is added.

### 11.3 Fight-as-creature + followers (Mars ~19:45)

- Fight-as-creature: `createArenaBattle({ mode: 'driven' })` lets
  the player drive the player's creature between turns with
  `setDriveInput({ x, y })` (held vector, normalized over
  magnitude 1); the foe stays AI-driven. The turn-based core is
  identical (only chosen attacks deal real HP damage; modifiers,
  caps, clocks, clash limits and the interrupt rule unchanged).
  Behaviour label `DRIVEN` is not a new state-machine substate;
  auto-separation still overrides drive input; static creatures
  ignore drive input; facing still tracks the foe.
- Followers: integration note only, no system in this module.
  Party creatures walk WITH the player in the overworld
  (WorldEngine) and stand at arena sidelines (integration helper
  `sidelineSlot`); a follower entering battle is an ordinary
  creature def. See module `README.md` §Followers.
