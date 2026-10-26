# HURT INDEX — hurt art + code treatments, Step 3 (LOCAL STAGING ONLY, 2026-10-25)

No push, no work-clone git changes, no src/assets/ changes. Everything
here lives under `sprite-art/animation/hurt/` and
`sprite-art/animation/treatments/` + `battle-treatments.md`.

## 1. Coverage counts

| Measure | Count | % |
|---|---|---|
| Sets total (animation manifests) | 51 | 100% |
| Hurt mapped from locked atlases | 0 | 0% |
| Hurt manifests reporting done (all lanes) | 50 | 98% |
| Hurt cell files present on disk | 46 | 90% |
| Hurt frames still owed (manifest gap) | 1 | 2% |

*CONCURRENCY NOTE 2026-10-25 ~19:23 CDT: parallel hurt batches are completing other sets in the same directory at the same time (per-creature manifests read 47 done / 4 gap — pupbble, quakehound, squirmite, terradog — at 00:23 UTC). The * counts above are that snapshot, not a final total; reconcile from each set's .hurt.json status at parent time, not from this table, because other batches may finish the last 4 after this snapshot. Batch 1's own 9 sets are done regardless of the moving total.
*CONCURRENCY NOTE 2, Batch 4 snapshot: manifests read 50 done / 1 gap (pupbble) at this batch's check; 46 of the 50 done cells are present on disk, 4 done manifests point at missing cell files (aquariios, chromejaww, reaperdile, tiidebiite — owning lanes' work, not certified by Batch 4). Eye-checked-and-certified by Batch 4 itself: only its own 13 sets (see §8); Batch 1's 9 + the original 4 were eye-checked by their own passes. The remaining manifest-done sets are NOT eye-checked by Batch 4.

Mapped = 0 is a verified finding, not an omission: a role scan of all
50 locked manifests found zero cells with a hurt / recoil / lean-back /
flinch role. No standing or walk cell was re-labelled as hurt.

Accepted by manifest status on disk: 50/51 (this index's lists lagged
parallel batches landing concurrently; this batch eye-checked and cut
only its own 13 — see §8. The other 37 manifest-done sets were NOT
eye-checked by this batch and are NOT certified here).
Cell-but-not-accepted 2: Sproutle v1 (visor missing — see §3),
Pebblefist v1 (bipedal golem, no face — rejected in Batch 4, v2 accepted).
Owed by manifest: 1 = pupbble (gap, never generated). 4 manifest-done
sets point at cell files missing on disk at check time (aquariios,
chromejaww, reaperdile, tiidebiite) — other lanes' work, flagged not
certified; see §8.

Generation budget this response: 4/4 used (Razorgater, Tyrage,
Kittember, Sproutle v1). Mochii was NOT regenerated (see §2).

HURT BATCH 1 (2026-10-25, 9 sets, 9 generations across 3 responses):
Sproutle v2 (visor restored), Dorowani, Gabu, Wispkin, Yogiferno, Mythar,
Strikechamp suited, Strikechamp helmeted lower-only, Strikechamp no-helmet
full shiny — all eye-checked enlarged AND at 64px, all with 64px cells cut
(white-bg border-connected flood removal, interior whites kept). See §3.

## 2. Mochii hurt pilot — APPROVED, NOT regenerated (Mars, 2026-10-25 ~19:01 CDT)

Mars: "looks good / looks perfect / looks perfectly fine." The old
"ambiguous oval" read was WRONG: Mochii's arms are folded to the front,
hands together in front of him. Correction applied: the pilot file is
kept exactly as-is, and the approved pilot was cut to a 64px game cell
here (`hurt/mochii/mochii_hurt_cell_00.png`, white-bg border-connected
flood removal, interior whites kept, pilot file untouched).

Lesson carried forward (Mars's words): eye-check sheets ENLARGED /
high-res before flagging anything. All four new generations in this
pass were eye-checked at presentation size AND at 64px (upscaled
montage) before verdicts were written.

## 3. Per-set status (51)

- done (50, per manifests on disk): aerobeak, aquariios, ashemit, astroleviathan, chromejaww, cocoonode, cragarm, dorowani, dreadtoise, duneclaw, duskfiend, finblade, floatcalf, gabu, gearkid, gorokappa, inklet, kickmaster, kittember, krakenox, manticlaw, mechapion, megalochrome, mochii, mothrix, mythar, oblivirex, pebblefist, pixilite, punchkid, pyromonk, pyropaw, quakehound, razorgater, reaperdile, shellguard, sproutle, squirmite, stormtalon, strikechamp, strikechamp_unsuited, strikechamp_unsuited_full, terradog, terrapod, tiidebiite, toxitacle, tyrage, wispkin, yogiferno, zephling.

  - Sproutle v2: visor restored (large translucent cyan visor over squeezed-shut eyes); v1 cell kept, superseded.
  - Wispkin: float-recoil, no legs, mask + hands reaction, smoke trail.
  - Strikechamp suited/unsuited: pixel-art style drift vs smooth locked atlas, design intact, kept.
  - Strikechamp full: sparkle accents on suit noted as shiny marker.
  - Razorgater caveat: renders more upright/bipedal than the quadruped
    battle_front cell (same upright caveat as its S1 presentation);
    red eyes not visible because eyes are shut, as designed.
  - Kittember caveat: generator included a soft ground shadow; it
    survives the cut as a dark ellipse at 64px. Not a likeness fail;
    wiring may crop/ignore it, or a v2 may drop the shadow.
- gap (1): pupbble.


Each set has a manifest `hurt/<creature>/<creature>.hurt.json` with
frame list + timing (hurt frame held 500 ms = recoil 300 ms + first
half of recover 200 ms; full hit timeline 1,040 ms, matching
`battleTreatments.js`). Gap manifests carry the pose spec template
and the treatments fallback, not an invented design.

## 4. Strikechamp FINAL structure (Mars, 2026-10-25 ~19:01 CDT)

Recorded in all three Strikechamp hurt manifests, matching the
`look_structure` field the parallel idle lane already added to the
existing animation manifests (verified, not overwritten here):

- suited = default look.
- HELMETED LOWER-ONLY (bare chest, red pants, helmet) = the REGULAR
  no-armor second look, the one Mars likes more.
- NO-HELMET FULL UNSUITED (face showing, red suit) = a RARE SHINY
  VARIANT (~10%). NOT canonical, NOT the regular second look.

No manifest written in this pass records full-unsuited as canonical
or as the regular second look, anywhere. Hurt art owed for all three
looks (0/3).

## 5. Code treatments (Track B) — spec + module, wiring owed

- Spec: `sprite-art/animation/battle-treatments.md`
- Module: `sprite-art/animation/treatments/battleTreatments.js`
  (no game imports, no DOM, deterministic — no Math.random)
- Test: `sprite-art/animation/treatments/battleTreatments.test.js`
  — 8/8 checks pass, Node v24.22.1
- Beats: windup 250 ms → impact hold / hit-stop 90 ms → recoil
  300 ms → recover 400 ms (total 1,040 ms). Impact flash white
  (red on crit), recoil translation, damage-scaled screen shake,
  deterministic particle burst, camera push-in on the attacker, held
  impact frame. Severity from damage fraction of max HP only.
- Arena 3D: `mapTo3D()` maps the SAME timeline to bone-space recoil
  (root translation 1 px = 0.01 rig units, spine lean ×2.5, head
  pitch, camera dolly) for Dorowani/Gabu rigs. No second system.
- Fallback: sets without hurt art still show flash + recoil + shake
  + particles + push-in. A hit never reads as nothing.
- Game wiring: 0% — draft module only, not wired into the battle scene.

## 6. Pull scope (Mars, confirmed 2026-10-25 ~19:05 CDT)

Mars NEVER asked for Nintendo's art, model, or music files —
Mochiichao's own versions of those are made in this lane. Scope is
everything else, 100%: movements, timing, techniques, systems,
structures, data shapes, file formats, animation/motion data. Used
freely here with no hedging: the treatment timing/staging is
recreated from public gameplay observation (Colosseum-style camera +
recoil-and-return staging, Gen V camera zoom on the affected creature,
classic 2D hit-flash + shake beat shape, modern arena hit-stop), in
original code and original art. No commercial binary animation file,
model file, sprite, or music was lifted into this work or the repo.
No openly-licensed animation pull files from the separate pull agent
were present in this lane at writing time, so none are used here yet;
when they land, the module's constants/timeline are the single place
to reconcile them.

## 7. What remains

- Hurt batch 1 is DONE (9/9 = 100%): Sproutle v2, Dorowani, Gabu,
  Wispkin, Yogiferno, Mythar, Strikechamp suited + lower-only + shiny.
  Global owed count at last snapshot (00:23 UTC): 4 gap sets — see the
  concurrency note in §1; do not treat any single snapshot as final
  while parallel batches are still running.
- Background removal + 64px cut for each future hurt frame (same
  border-connected white-bg method used here).
- Game wiring of battleTreatments.js into the battle scene (0%).
- Per-move particle flavours (colour/shape per move type) at wiring.
- Arena-rig verification of mapTo3D on Dorowani/Gabu rigs (mapping
  documented, not yet exercised against a live rig).
- Reconciliation: the existing `animation/*.animation.json` hurt
  fields still say "gap" for the 4 done sets; the parent reconciles
  hurt/ manifests into those (or into the repo copies) at PR time —
  this lane did not edit them.

## 8. Batch 4 (2026-10-25 ~19:26 CDT, local staging only, no push, no work-clone git changes, no src/assets changes)

13/13 sets done, all eye-checked enlarged AND at 64px, all cut to 64px
cells by border-connected white-bg removal (interior whites kept):
kickmaster, gearkid, mechapion, gorokappa, pebblefist (v2),
cragarm, terrapod, shellguard, dreadtoise, pixilite, duskfiend,
ashemit, pyromonk. Timing per manifest: hurt frame held 500 ms
(recoil 300 ms + first half of recover 200 ms), full hit timeline
1,040 ms, matching battleTreatments.js. Generations this batch: 14
(13 accepted + 1 rejected Pebblefist v1).
- Pebblefist v1 REJECTED: tall bipedal rock golem with no visible
  face/eyes, wrong body plan vs the locked atlas (compact floating
  rock-ball, glowing yellow eyes, tiny fists, no legs). V2 restores
  the rock-ball, squeezed-shut yellow eyes, tiny raised fists and
  dust puffs; v1 raw kept, no cell cut from it.
- Dreadtoise is the v2 ANIMAL body with cannons (brown tortoise
  head, tan belly, clawed flippers, green shell, two grey shoulder
  cannons with cyan rings), NOT the superseded mechanical v1.
- Ashemit hurt is a SEATED flinch (still cross-legged, upper body
  leaning back, hands raised guarding, flame tail flicked back).
  No standing pose, no walker re-render.
- Caveats (not likeness fails): Gearkid skid debris, Terrapod dust
  clouds, Pixilite detached petals survive the cut as small marks;
  Duskfiend rendered in a cleaner cartoon line style than the locked
  cell's pixel shading, silhouette/hood/flames match; Kittember-style
  ground shadow note does not apply to this batch.
