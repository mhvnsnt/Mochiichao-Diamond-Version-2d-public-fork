# Walk frames + missing icons — batch 2026-10-25 ~19:25 CDT task (local staging only)

## Method
- Baseline: NEXT-STEPS-QA.md PASS list (15 sets) + locked manifests in
  sprite-art/game-ready/ (51 sets). QA PASS = 2+ walk frames in all four
  directions, mirror allowed for one side. Locked walk_* roles are
  extractor-assigned and do NOT cleanly separate left vs right, so the QA
  list — not the locked role counts — is the before-count.
- Generation cap: 4 image generations in this response (2 icons + 2
  eight-panel walk sheets). One sheet per creature, quarter-split, then
  border-connected white-bg flood removal (scipy label, interior whites
  kept), fit to 64x64 RGBA. No file already shown to Mars was overwritten;
  all new art is under NEW filenames below.
- Movement treatments respected: Wispkin (float bob), Ashemit (seated),
  Cocoonode (pulse) were NOT re-rendered as walkers and are NOT in this
  batch; they are owed as movement-treatment frames, not leg walks.
  Flyers/swimmers (#019-#025) are owed movement-appropriate down/up frames,
  not legs. Slots #047-#146: nothing invented (per task).

## Done in this batch: 2 walk sets + 2 icons
| Item | Files | Eye-check |
|---|---|---|
| Mochii #001 walk (down/up/left/right x2) | walk-frames/mochii/mochii_walk_{down,up,left,right}_{0,1}.png + mochii.walk.json | Enlarged raw sheet PASS + 64px montage PASS. Waddle bounce (squash/stretch + tilt); side frames are tilt variants, not true profiles (blob). Smooth-cartoon sheet vs pixel locked cell — shape/colour/face/wave pattern match. |
| Razorgater #004 walk (down/up/left/right x2) | walk-frames/razorgater/razorgater_walk_{down,up,left,right}_{0,1}.png + razorgater.walk.json | Enlarged raw sheet PASS + 64px montage PASS + enlarged cut montage PASS. Front: red eyes, open fanged jaw. Back: spiky back + tail, no face. Sides: quadruped-leaning stride (flagged caveat — locked front is bipedal). Ground shadow survives on down frames (Kittember-class caveat). |
| Shellguard #039 icon | icons/shellguard/shellguard_icon_v1.png + shellguard.icon.json | Enlarged PASS + 64px PASS. Grey segmented shell, 4 red lights, blue limbs. Footprints correctly excluded. Old derived crop in game-ready/ untouched. |
| Megalochrome #023 icon | icons/megalochrome/megalochrome_icon_v1.png + megalochrome.icon.json | Enlarged PASS + 64px PASS. Silver shark head, dorsal fin, side fins, toothy grin; no ripple rings. Stray white humanoid NOT used. Drift flagged: icon eyes are round sparkle eyes vs locked cell's blue-ringed concentric eyes — a v2 could re-match eyes if Mars wants it. |

## Squirmite cell 10 — checked, already fixed, NOT touched
- Locked manifest game-ready/squirmite/squirmite.manifest.locked.json,
  cell 10: role walk_side_3, lock_note "FIX: was labelled icon; eye-check
  shows horizontal side caterpillar, not an icon". The icon is a separate
  icon_derived entry (head crop from battle_front cell 1). No label issue
  remains in the local locked manifest, so no fix was applied and nothing
  was re-broken.

## Coverage
- Walk before: 15/51 = 29% (QA PASS 15 sets; QA itself reported 15/50 =
  30% over the 50 sets it examined — denominator differs by one set;
  parent to reconcile. A parallel producer-next note says 16/51 = 31%;
  that 1-set difference is UNRECONCILED here and is NOT adopted.)
- Walk after this batch: 17/51 = 33% (+2: Mochii, Razorgater).
- Walk owed: 34/51 = 67% (see list below). No attack/hurt work was touched.
- Icons (this task's scope): 2/2 = 100% (Shellguard, Megalochrome).
- No GitHub push, no work-clone git changes, no src/assets/ changes.
  Repo wiring of these new cells is still owed (later PR batch).

## Still owed — walk sets (34)
- Leg walkers / general (23): AquariiOS, Dorowani, Duneclaw, Gabu,
  Gearkid, Inklet, Kickmaster, Kittember, Krakenox, Manticlaw, Oblivirex,
  Pebblefist, Pixilite, Punchkid, Pyropaw, Quakehound, Reaperdile,
  Shellguard (walk-up still owed; icon done), Sproutle (down top-up),
  Squirmite (front/back walk treatment — caterpillar, segment shift),
  Strikechamp_unsuited (lower-only; walk-up owed), Terradog, Terrapod.
- Flyer/swimmer movement down/up (8): Aerobeak, Astroleviathan, Finblade,
  Floatcalf, Megalochrome (icon done; swim down/up owed), Mothrix,
  Stormtalon, Zephling.
- Movement-treatment, NOT leg walks (3): Ashemit (seated shift),
  Cocoonode (pulse/roll), Wispkin (hover bob in 4 directions).
- At the 4-generation-per-response cap with one 8-panel sheet per
  creature, the 34 owed sets need ~34 more generations (movement-treatment
  sets may instead reuse/extend the idle transforms, which is a parent
  decision, not assumed here).

## COMPLETION ADDENDUM — recovery worker, 2026-10-25 ~20:30–03:10 CDT (local staging only)
- STEP 1 VERIFIED (enlarged + 64px montages, montages in ~/workspace/walk-verify/): all 14 dirs hold 8-cell sets — Mochii, Razorgater, AquariiOS, Dorowani, Duneclaw, Gabu, Gearkid, Inklet, Kickmaster, Kittember, Pixilite, Punchkid, Pyropaw, Quakehound. 0 failures; flagged (not failed): Quakehound down_0 white block between legs; baked ground shadows in Kittember (all 8), Razorgater (down), Mochii (faint) — shadows-separate rule: engine-layer shadow-strip pass owed; carried caveats (Dorowani/Kickmaster down subtle, Punchkid/Pyropaw front/back near-identical pairs, Gearkid gear colour flip, Duneclaw down claw inconsistency, Pixilite faceless down/up indistinguishable by design).
- RECONCILIATION (source of truth = this index): QA PASS 15 + index batch 2 (Mochii, Razorgater) = 17 baseline; 17 + 12 new verified = 29/51 = 57% at Step 1 end. The parallel "16/51" note is NOT adopted (unreconciled 1-set difference).
- STEP 2 BUILT (22 sets, all eye-checked enlarged + 64px, all 64x64 RGBA, NEW filenames only, no file shown to Mars overwritten):
  - Recovered from pre-generated sheets on disk (cut, not regenerated): Manticlaw #012 (down subtle), Oblivirex #009 (up feet clipped flat at sheet gridline — unrecoverable cleanly, accepted + flagged), Pebblefist #035 (shadow ellipses + enclosed white pockets stripped; faint shadow line remnant under down feet flagged minor).
  - Full 8-panel sheets: Krakenox #028, Reaperdile #006, Terradog #014 (down subtle), Terrapod #037 (down subtle).
  - Partial completions: Shellguard #039 (DONE via pre-existing 8-cell set verified this session; spare up-only sheet NOT cut), Sproutle #038 down (2), Squirmite #016 front/back segment-shift (4), Strikechamp_unsuited #030 up (2, v2 with red helmet + gold stripe; v1 bald sheet REJECTED — helmet missing — NOT cut; duplicate v2 webp from an aborted call is spare, NOT cut).
  - Flyer/swimmer down/up only (4 each, no legs): Aerobeak #020, Astroleviathan #025, Finblade #022, Floatcalf #024, Megalochrome #023 (eye drift flagged, same as accepted icon drift), Mothrix #018, Stormtalon #021, Zephling #019.
  - Movement treatments derived from locked cells only (no generation): Wispkin #042 hover bob (sides = tilt variants of front; no locked side cell exists), Ashemit #044 seated shift (LOCK CORRECTION: manifest mislabels cell_02 as back — it is a right-facing side — and cell_04 as side — it is the true back; fixed2 mapping pixel-verified), Cocoonode #017 crystal pulse (scale 1.00 vs 1.06; faceless, sides reuse front).
- WALK FINAL: 51/51 = 100% (17 baseline + 12 verified + 22 built). Slots #047–#146: nothing invented. No GitHub push, no work-clone git changes, no src/assets/ changes. Repo wiring of new cells into the game is still owed (later PR batch). Checkpoints: WALK-CHECKPOINT-2026-10-25.md in this dir.
