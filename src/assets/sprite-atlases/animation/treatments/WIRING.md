# TREATMENTS WIRING — battleTreatments → BattleView / PixiBattleCanvas

Status: 2026-10-25 wiring pass. Module updated + tested (11/11 Node checks
pass, see §7). **In-place game edit is BLOCKED** — see §0 — so this file
plus `treatments-wiring.patch` and `battleTreatments.ts.txt` (same folder)
are the deliverable the later PR batch applies. Nothing in the work clone
was edited by this pass; the work clone was read only.

## 0. Blocked edit — exactly what and why

- **Blocked file 1: `src/components/views/BattleView.tsx`.** The work
  clone at `~/workspace/mochiichao-work/fresh-start` has UNCOMMITTED
  modifications to BattleView.tsx (and to App.tsx, gameStore.ts,
  WorldEngine.tsx, RosterView.tsx, ShopView.tsx, SaveMenu.tsx,
  IntroSequence.tsx, MochiiMindUI.tsx, FullWorldMaps.ts, index.css,
  package.json, package-lock.json) made by other lanes still in flight.
  An in-place edit here would clobber or silently interleave with that
  uncommitted work, and the repo's own anti-clobber law (fresh-start
  AGENTS.md: own the tree, no sweeping an incomplete tree into history)
  forbids it. So BattleView changes are delivered as a patch to be
  applied AFTER those lanes land or on a clean checkout, never over them.
- **Blocked file 2: `src/components/game/PixiBattleCanvas.tsx`.** Not
  itself modified in the work clone, but its attack driver is owned by
  the same battle-presentation lane as BattleView (they share the
  `BattleAttack` prop, `onImpact`, and `onDone` callbacks); editing the
  canvas without the BattleView half would break the prop contract.
  Delivered as the same patch, applied together.
- **What is NOT blocked:** the treatments module itself (staging folder
  `sprite-art/animation/treatments/`, this lane's own staging), its
  tests, the 3D proof, and this spec. Those are done and tested here.

## 1. Source of truth

- Canonical module (Node-tested): `sprite-art/animation/treatments/battleTreatments.js`
- Game copy for the PR batch: `battleTreatments.ts.txt` in this folder —
  drop it at `src/lib/battleTreatments.ts` (typed port, same constants,
  same functions, same determinism). The game must IMPORT it; it must
  NOT re-declare TIMING/SEVERITY values anywhere else. If the JS module
  changes again, regenerate the TS port and diff the constants — a
  constants drift between the two is a wiring bug, not a tuning choice.
- Beats (unchanged by this pass): windup 250 ms → impact hold / hit-stop
  90 ms → recoil 300 ms → recover 400 ms = 1,040 ms for the hit itself.
  Travel (lunge / projectile) is a PRE-phase on top of that (see §3),
  so a full on-screen attack is longer than 1,040 ms.

## 2. What changed in the module in this pass (2026-10-25)

1. **Camera focus is explicit.** `buildHitTimeline().camera` now carries
   `focus: 'attacker'` and `subject: 'attacker'`; every
   `sampleHitPose()` return carries `cameraFocus: 'attacker'`; `mapTo3D()`
   carries `cameraFocus: 'attacker'`. Wiring must target the ATTACKER
   container / arena camera subject with the zoom — never the defender,
   never the scene centre. Previously the zoom was a bare scalar and
   wiring had to guess its subject; that guess is now impossible.
2. **Particles fan along the hit direction.** `buildParticleBurst()` now
   accepts `direction` (+1/-1); `buildHitTimeline()` passes the hit
   direction, pulling angles halfway toward the hit axis (0 rad for +1,
   π for −1). Direct calls WITHOUT direction keep the old uniform radial
   burst bit-for-bit, so old seeds still replay. Research basis: §6.2 of
   the battle-animation research — particles must mark DIRECTION and
   type, not just "damage".
3. **Rig Y-axis fix (found by exercising mapTo3D against the live rigs,
   see proof-3d/PROOF-3D.md).** Rig Y is UP (Dorowani hips y≈0.92, Gabu
   hips y≈0.82, spine chain climbing +Y) while screen Y is DOWN.
   `mapTo3D().rootOffsetY` is now NEGATED, so the 2 px screen "lift"
   stays a lift in rig space instead of becoming a 0.02 m dip. Magnitude
   is tiny (0.02 m at full recoil) but the sign was wrong; it is fixed.
4. **Open-source pull actually used (not just cited).**
   - Beasts animation code, CC0-1.0, danielgruginski/Beasts, already in
     the repo's animation reference (`tools/animation-reference/beasts/`,
     PR #34): its `ease()` smoothstep and Catmull-Rom `track()` were
     REVIEWED for the camera/recoil easing. NOT adopted as a code change:
     the module's ease-out cubic (recoil/recover) and ease-in-out quad
     (camera) already have the same S-curve shape, and swapping them
     would break the pinned test values for no feel gain. Recorded here
     so nobody re-does the review.
   - Tuxemon combat-animation sequencing, GPL-3.0, Tuxemon `development`
     branch (`tools/animation-reference/tuxemon/`, PR #34): TECHNIQUE
     only, no code copied (GPL code is not pasted into the game):
     a one-shot (hurt/recoil) plays once and RETURNS to idle with a
     hold — which is exactly the module's recover beat + hurt-frame
     hold (recoil + first half of recover). No licence issue: technique,
     not code.
   - Nothing from the Colosseum 2D / Arena 2D fan projects was pulled
     into this pass: per PR #34's own record those trees are no-licence
     / NOASSERTION / asset-bulk with no reachable animation code, and
     this task's pull scope is openly-licensed material only. No
     Nintendo art, model, or music files were touched anywhere here.

## 3. Event flow — attack choice → windup → hit-stop → recoil → recover

```
BattleView.handlePlayerMove / enemy-turn effect
  └─ executeDamage() → { damage, text, isCrit, damageFraction }
       damageFraction = finalDmg / defender.maxHp   (NEW, see patch)
       isCrit = crit multiplier > 1                  (NEW, was internal)
  └─ pendingRef.current = { damage, text, attacker, moveId,
                            damageFraction, isCrit } (NEW fields)
  └─ setAttack({ nonce, attacker, category, color,
                 damageFraction, isCrit })           (NEW fields)
PixiBattleCanvas attack effect (per nonce, replaces the current driver)
  Phase A — WINDUP, 0–250 ms (treatments sample t = 0–250)
    attacker telegraphs (existing scale pulse replaced by
    sampleHitPose(t).cameraZoom applied to the ATTACKER container);
    defender does not move; cameraZoom rises 1.0 → ~1.12.
  Phase B — TRAVEL (existing Pixi motion, durations unchanged)
    Physical: attacker lunges to the gap (450 ms, existing ease).
    Special: coloured projectile travels attacker → target (450 ms).
    Status: no travel (existing glow path, §5).
  Phase C — CONTACT, frame 0 (travel end; treatments t = 250)
    flash fires on defender: colour = timeline.flash ('white', 'red'
    on crit), alpha = pose.flash fading over FLASH_MS 100 ms.
    particle burst spawns at the impact point: timeline.particles
    (count/angle/speed/size from the module), colour = attack.color,
    angles already fanned along the hit direction — do NOT re-randomise.
    shake starts: stage offset = pose.shakeX / shakeY (sampled, seeded
    oscillation — this REPLACES the current Math.random() shake).
    frozen = true for the next 90 ms: no other animation clock advances
    (attacker holds its strike pose, defender holds its standing pose);
    flash and particles are the ONLY things that move. Do NOT call
    onImpact() here — HP drains after the freeze (§4).
  Phase D — IMPACT HOLD ends → RECOIL, contact+90 ms (treatments t = 340)
    onImpact() fires EXACTLY ONCE here (was: at contact in the old
    driver — this +90 ms move is deliberate, see §4).
    defender: position = base + pose.defenderOffsetX/Y,
    rotation = pose.defenderRotationDeg, art = pose.defenderArt
    ('hurt' during recoil + first half of recover; 'standing' if the
    creature has no hurt art yet — flash + recoil + shake + particles
    still carry the hit, never render nothing).
    attacker: holds its strike position; cameraZoom holds at the
    severity zoom (1.04 / 1.08 / 1.14 / 1.20).
  Phase E — RECOVER, contact+90+300 ms (treatments t = 640–1040)
    defender eases back to base (sampled offset → 0, rotation → 0);
    hurt art crossfades to standing at the halfway point (sampled
    defenderArt already encodes this — wiring just follows it);
    cameraZoom eases back to 1.0; attacker returns to base.
  Phase F — DONE, contact+90+300+400 ms
    both containers reset to base position/scale/rotation exactly;
    onDone() fires once. Only now may the next menu/action beat start.
    (BattleView.onAttackDone already gates the next turn on onDone.)
```

Full on-screen durations after wiring (travel + hit):
Physical: 250 + 450 + 90 + 300 + 400 = 1,490 ms (was 1,250 ms).
Special:  250 + 450 + 90 + 300 + 400 = 1,490 ms (was ~1,250 ms).
Status:   unchanged, 900 ms (see §5).
The +240 ms is the hit-stop + full recover the old driver skipped
(old driver: 180 ms snap-back, random shake, fixed 14 px recoil).
Skip / 2× fast-forward is NOT in this patch — it is owed work (§8),
per the research §6.4 skip rule; do not ship a longer sequence with
no out as a final state.

## 4. The onImpact move (+90 ms) — deliberate, do not "fix" it back

Old driver: `onImpact()` at contact, so HP drained DURING the freeze
frame the eye is locked on. Research frame-0 rule (§6.3): everything
that says "contact happened" (flash, particles, SFX, shake, freeze)
lands on frame 0; everything that says "what it cost" (HP number, bar
drain) comes AFTER the freeze. The patch therefore moves `onImpact()`
to the end of the 90 ms hold (start of recoil). BattleView needs NO
change for this beyond the pendingRef fields — it already drains HP
inside onAttackImpact and advances the turn inside onAttackDone, both
still called exactly once, in the same order.

## 5. Insertion points (exact, against the files as read 2026-10-25)

BattleView.tsx:
- `executeDamage()` (currently returns `{ damage, text }` only):
  return `{ damage, text, isCrit: crit > 1,
  damageFraction: finalDmg / defender.maxHp }`. Status moves keep
  `{ damage: 0, ... }` (damageFraction 0, isCrit false).
- `pendingRef` type: add `damageFraction: number; isCrit: boolean`.
- `handlePlayerMove()`: pass the new fields into pendingRef and into
  `setAttack()`. Same for the enemy-turn effect's `setAttack()`.
- `BattleAttack` import type gains the two fields (the interface lives
  in PixiBattleCanvas.tsx — change both sides together or the prop
  contract breaks).

PixiBattleCanvas.tsx:
- `BattleAttack` interface: add `damageFraction: number; isCrit: boolean`.
- Attack effect (`useEffect(..., [attack?.nonce])`): replace the whole
  driver body (windup/lunge/projectile/flash/shake blocks) with the
  treatments driver in the patch. The `flash()` and `shake()` helpers
  are DELETED by the patch (replaced by sampled flash/shake); the
  `hex()` helper and `drawBase()` are untouched.
- Direction: `direction = attack.attacker === 'player' ? 1 : -1`
  (player stands left, enemy right, in drawBase). The module never
  assumes a side — the canvas supplies it from layout, once.
- Seed: `seed = attack.nonce` (deterministic per attack; same nonce →
  same particle burst on replay/remount).
- Per-move particle flavour (wiring-time table, NOT in the module —
  the module emits count/angle/speed/size only):
  Physical → shard/streak sprites, colour = attack.color;
  Special → round glow sprites, colour = attack.color;
  crit (timeline.flash === 'red') → red flash overlay + 28 particles
  (already in the severity table) + optional larger particle size
  (wiring choice, ×1.25, not in the module).
- Hurt-art fallback: `pose.defenderArt === 'hurt'` selects the hurt
  sprite cell ONLY if a hurt cell exists for that species; otherwise
  keep the standing cell and still apply flash + offset + rotation +
  shake + particles. Never render a missing cell.

Status moves: keep the existing Status branch (glow, impact at 500 ms,
done at 900 ms) unchanged — treatments timelines are damage-driven
and a 0-damage status hit would misleadingly read as a light hit.

## 6. ArenaBattleView — NOT patched here (separate lane, placeholder)

ArenaBattleView.tsx currently uses placeholder VFX (CSS `scale-110` +
  setTimeout 600/500 ms) and placeholder damage
  (`dmg = bp/2 + 5`, no crit, no maxHp fraction in the call path).
  Its treatments wiring is a follow-up, not part of this patch, because
  (a) its damage math is placeholder and has no isCrit/damageFraction
  to pass yet, and (b) its 3D rig rendering does not exist yet — the
  3D mapping is proven against the rigs in proof-3d/ but has no arena
  renderer to wire into. When that lane lands: compute
  `damageFraction = dmg / target.maxHp`, build the same timeline, and
  apply `mapTo3D()` per §7 of the treatments spec (root offset,
  spine lean, head pitch, camera dolly, hurt-pose weight) to the rig
  joints listed in proof-3d/PROOF-3D.md §3. Do NOT wire Arena by
  copying the 2D Pixi driver — it needs the rig path.

## 7. Tests run this pass (Node v24.22.1, treatments folder)

```
node battleTreatments.test.js
PASS timing constants exposed
PASS severity tiers
PASS timeline phase order and total
PASS sampled pose beats
PASS camera push-in
PASS shake window and determinism
PASS particle burst determinism
PASS 3D bone-space mapping shares the timeline
PASS damage scaling is monotonic across all tiers      (NEW)
PASS camera push-in on attacker, held on impact, released on recover (NEW)
PASS particle burst fans along the hit direction       (NEW)
ALL PASS: 11 checks
```

New tests pin exactly what the task asked for: damage scaling
(shake/particle/recoil/zoom strictly increase light → medium → heavy
→ critical: recoil 10/18/28/38 px, shake 2/4/7/10 px, particles
6/12/20/28, zoom 1.04/1.08/1.14/1.20; a low-damage crit out-hits a
heavy non-crit) and camera behaviour (focus === 'attacker' on the
timeline, on every sampled pose, and on mapTo3D; zoom > 1 at the
impact frame, still rising through the hit-stop, held at the severity
zoom at 340 ms, exactly 1.0 after the timeline ends; dolly > 0 at
impact). One test bug was caught and fixed during the run: at 300 ms
the camera is still easing in (push completes at 340 ms), so the test
now asserts rising — not held — at 300 ms and held at 340 ms.

## 8. Still below 100% (treatments track only)

- In-place game wiring: 0% applied (patch + spec delivered, §0 block).
  Unblocks when the BattleView lane's uncommitted work lands or the PR
  batch applies the patch to a clean checkout and runs the game build.
- Arena rig rendering: 0% (mapping proven, no renderer to wire into).
- Skip / 2× fast-forward for the lengthened sequence: 0% (research
  §6.4 rule; the +240 ms sequence must not ship without an out).
- Per-move particle flavour sprites: spec table in §5 only; no sprite
  assets made here.
- Hurt art itself: 4/51 sets (separate track, not this task).
- Game build / live playtest of the wired driver: not run — cannot run
  without applying the patch to the game tree, which §0 forbids here.
