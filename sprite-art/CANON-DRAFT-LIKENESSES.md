# Canon Draft Likenesses — LOCKED

Rule from Mars, 2026-10-25: every sprite sheet made in the Sprite Art lane is
saved as the ORIGINAL CANON DRAFT LIKENESS for that creature. A likeness
changes in official canon ONLY if Mars himself says it changes. Nothing else
changes it: not a drift in a later sheet, not a mock, not a bake, not an
assistant decision.

## What counts as the canon draft

- The sheets in `sprite-art/2d-sheets/<creature>/` (main + angles-top-diagonal
  + angles-lighting, where complete) are the canon draft likeness.
- The Blender bake sheets (`src/assets/sprites/` on main, and
  `sprites-bake/sheets/`) are renders of the same creatures from their Tripo
  models, NOT a second likeness. If a bake and a 2D sheet ever disagree on a
  design point, that is a conflict to flag to Mars, not a silent change.
- The Manticlaw Tripo golem bake is a SPECIAL INDIVIDUAL VARIANT ONLY
  (short spine syndrome). It is NOT the normal Manticlaw likeness. Normal
  Manticlaw = the hulking tiger in `2d-sheets/manticlaw/`.
- AI mock creatures made in other lanes (UI battle/main mocks, etc.) are NOT
  canon and must NOT be used as final assets. Canon sheets are the correct
  ones; the mocks were the drifted ones.

## Drifts are NOT canon changes

A drift noted in the lane log (eye colour, style, proportions) does NOT
change the canon draft. It is recorded as a drift until Mars picks one.
Open, unresolved, do NOT treat as settled:

- Razorgater #004: red eyes (main sheet) vs blue eyes (angles sheets).
- Kittember #010: amber eyes (main) vs darker eyes (angles).
- Punchkid #029: angles sheet rendered blocky 3D-robot with a visor
  instead of headband + blue eyes — the MAIN sheet is the draft; the
  angles sheet is a drift to correct, not a redesign.
- Stormtalon #021 / Megalochrome #023 angles sheets: pixel-art style vs
  smooth main sheet — style drift, design unchanged.
- Floatcalf #024: main pixel-ish, angles smooth — style drift, design
  unchanged.
- Toxitacle #027: eye colour purple (main) vs black/blue (angles/lighting).

## Inventory — canon draft status as of 2026-10-25 ~12:44 CDT

Complete 3-sheet sets (main + angles + lighting), locked as canon draft:
Dorowani #147, Gabu #148, Mochii #001, Razorgater #004, Tyrage #007,
Kittember #010, Pyropaw #011, Manticlaw #012 (normal tiger), Pupbble #013,
Terradog #014, Quakehound #015, Squirmite #016, Cocoonode #017,
Mothrix #018, Zephling #019, Aerobeak #020, Stormtalon #021, Finblade #022,
Megalochrome #023, Floatcalf #024, Astroleviathan #025, Inklet #026,
Toxitacle #027, Krakenox #028.

Partial, still canon draft for what exists (rest to come, no change):
Punchkid #029 (main + angles; lighting next).

In repo on main via PR #13 (`src/assets/sprites-2d/`): everything through
Zephling main + the batch-1 sets listed in the PR. The rest above is local
in `sprite-art/2d-sheets/` pending push batch 2 — local does NOT mean
unofficial; it is still the canon draft, just not yet pushed.

Not canon draft (excluded on purpose):
- Discarded Manticlaw angles v1 (blue turtle drift) — discarded, never canon.
- Starter evolutions 002/003/005/006/008/009 — names open, no sheets made,
  nothing locked for them.
- Any sheet not listed above does not exist yet; do not invent one.

## How to handle a future change

1. Mars says, in his own words, that a likeness changes.
2. Record the change, the date, and Mars's words in this file and in
   `~/MEMORY.md` before generating the new version.
3. Save the new version under a NEW filename (cache rule: never overwrite
   a file already shown to Mars).
4. Keep the old draft file on disk, marked superseded, so the change is
   traceable. Do not delete canon history.

## Changes Mars has ordered

- Punchkid #029 (2026-10-25, Mars's words, paraphrased from voice):
  "I kind of like the headband and the colorway on Punchkid, I like the
  wristbands, but he should look more like Tyrogue, a Tyrogue-like
  humanoid Pokemon type. He looks too square and robotic, I don't like
  that." KEEP: red digital headband, tan/beige colorway, white data-tape
  wristbands/fists. CHANGE: body from square/blocky/robotic to a
  Tyrogue-like organic humanoid. The v1 main + angles sheets are kept on
  disk as SUPERSEDED DRAFT v1 (not deleted, not canon anymore); v2 is the
  canon draft from this point. Punchkid lighting generated from v1 before
  this message is likewise superseded; new angles/lighting follow from v2.

## Changes Mars has ordered (continued, 2026-10-25)

- Punchkid #029 refinement (2026-10-25 ~12:55 CDT, Mars's words,
  paraphrased from voice): "Make his fists big like they were in the V1
  and the wrist tape longer like it was in the V1 up his wrist, and keep
  everything else the same — this is looking better." Applied: v2 REVISED
  main (big fists, long tape up the forearm, lean humanoid body, red
  digital headband, blue eyes unchanged), revised angles, revised
  lighting. The pre-refinement v2 main/angles are superseded by the
  revised versions (kept on disk, not canon).
- Punchkid #029 revised set APPROVED by Mars (2026-10-25 13:03 CDT):
  "Oh yeah this one is good." The revised 3-sheet set is the canon draft.
- Kickmaster #031 APPROVED by Mars (2026-10-25 12:58 CDT, main; full set
  13:03 CDT): "Yeah, this one's good. I like this one. It's not what I
  expected, but it's pretty good." / "Kickmaster is good."
- Strikechamp #030 variant rule (2026-10-25 12:57–13:04 CDT, Mars):
  the suited main sheet (flat 2D) "can be a variant like a suited one";
  the suited angles v1 is DISLIKED (looks 3D, changed the face/likeness)
  and is NOT the canon base; a different unsuited original version was
  ordered — lower armour ONLY, no upper armour, top part of the head /
  headgear still on, face showing like the flat 2D main. Suited version
  is how Strikechamp will usually look (default). The unsuited
  lower-only version appears in the wild a lot: Mars waffled
  50%/60%/75% then landed on ~60% unsuited, so record as ~60% unsuited
  in the wild, ~40% suited — approximate design intent, NOT a locked
  exact balance number. Both variants are canon draft; neither replaces
  the other. The first fully-unsuited attempt (no armour at all, no
  headgear) is SUPERSEDED by the corrected lower-only spec.

## Inventory — canon draft status as of 2026-10-25 ~13:25 CDT

Complete 3-sheet sets, locked as canon draft: everything listed in the
12:44 inventory PLUS Punchkid #029 (revised set), Strikechamp #030
(suited main + suited lighting, AND unsuited lower-only main + angles +
lighting — suited angles v1 excluded), Kickmaster #031, Gearkid #032,
Mechapion #033, Gorokappa #034, Pebblefist #035, Cragarm #036,
Terrapod #037, Sproutle #038, Shellguard #039, Dreadtoise #040,
Pixilite #041, Wispkin #042, Duskfiend #043, Ashemit #044,
Pyromonk #045, Yogiferno #046, Mythar #331.
Blender bake sheets (renders, not a second likeness): Manticlaw
special-variant golem bake (variant only) and Megalochrome bake
(corrected view mapping front=angle0, back=angle180, side=angle90;
Mars confirmed 2026-10-25 it matches the 2D draft in every way;
the anti-gravity water ripple is a separate effect, not model geometry).
Still not canon draft: starter evolutions 002/003/005/006/008/009
(names open, no sheets made); the 047–146 gap (no designs yet).

- Wispkin #042 trait ordered by Mars (2026-10-25 ~13:28 CDT, "one of my favorite ones so far"): hands are MOSTLY stuck to the mask — like black smoke glue / liquid got its hands stuck to the mask and the mask stuck to its face, so it is like it is trying to take the mask off and the mask is stuck, trying to take its hands off the mask and the mask is stuck to its hands, its hands stuck to the mask and the mask stuck to its face. Sometimes it can fight with its hands kind of unstuck from the mask, but it will still have the stuff stretched between the hands and the mask. V1 set (hands holding mask) is kept on disk, PENDING REVISION; v2 with this trait becomes the canon draft once parent-verified. Do NOT push v1 as final.
- Dreadtoise #040 revision ordered by Mars (2026-10-25 ~13:28 CDT, replying to the Dreadtoise sheets): v1 "looks too mechanical... the Dreadtoise is too mechanical at the bottom." KEEP: the cannon parts, good, kind of like Blastoise. CHANGE: the rest of the body has to be more like an animal. V1 set is kept on disk, PENDING REVISION; v2 (Blastoise-like cannons + more animal body) becomes the canon draft once parent-verified. Do NOT push v1 as final.

## Pending revisions ordered by Mars (2026-10-25 ~13:28 CDT) — v1 NOT final
- Wispkin #042: Mars (who called Wispkin one of his favorites) ordered a
  stuck-mask trait: its hands are MOSTLY stuck to the mask — like black
  smoke glue / liquid got its hands stuck to the mask and the mask stuck
  to its face, so it is like it is trying to take the mask off and
  cannot, trying to take its hands off the mask and cannot. Sometimes
  it can fight with its hands kind of unstuck from the mask, but the
  stuff still stretches between the hands and the mask. V1 (hands
  simply holding the mask) is PENDING REVISION; v2 sheets with this
  trait become the canon draft once parent-verified. Do NOT push v1
  as final.
- Dreadtoise #040: Mars says the v1 set looks TOO MECHANICAL,
  especially at the bottom. KEEP: the cannon parts, which are good,
  kind of like Blastoise. CHANGE: the rest of the body has to be more
  like an animal, less mechanical. V1 is PENDING REVISION; v2 sheets
  (Blastoise-like cannons + more animal body) become the canon draft
  once parent-verified. Do NOT push v1 as final.

- Cragarm #036 revision ordered by Mars (2026-10-25 ~13:30 CDT, replying to the Cragarm sheets): "Cragarm needs to be standing on the ground kind of like Gollum and the thing that evolves into Gollum from Pokemon it needs to be standing on the ground but still have all those things it pretty much needs to have legs and arms." Read as: standing on the ground like Golem / Graveler (Geodude -> Graveler -> Golem; voice "Gollum" = Golem). KEEP: dark igneous boulder cluster body, crystalline veins, orbiting boulder fists. CHANGE: grounded standing stance with clear legs and arms, not a floating/tumbling cluster. V1 set is kept on disk, PENDING REVISION; v2 becomes the canon draft once parent-verified. Do NOT push v1 as final.

- Cragarm #036: Mars says the v1 set (floating/tumbling boulder cluster)
  must STAND ON THE GROUND, kind of like Golem/Graveler, with clear LEGS
  AND ARMS, keeping its dark igneous boulder-cluster body, crystalline
  veins, and orbiting boulder fists. V1 is PENDING REVISION; v2 sheets
  (grounded Golem/Graveler-like stance, legs and arms) become the canon
  draft once parent-verified. Do NOT push v1 as final.

## V2 lifts — all three revision holds cleared for v2 only (2026-10-25)
- Dreadtoise #040 v2 COMPLETE and parent-verified (2026-10-25 ~13:32 CDT):
  animal lower body (scaled clawed legs, tan belly, tail, natural shell
  rim), fortress-plateau shell kept, Blastoise-like cannons = 2 in every
  front view. V1 superseded, kept on disk. V2 set (main + angles +
  lighting) added to PR #16; v1 was never pushed.
- Cragarm #036 v2 COMPLETE and parent-verified (2026-10-25 ~13:33 CDT):
  grounded Graveler/Golem-like bipedal stance, two thick stone legs
  planted on the ground and two thick stone arms in every main pose,
  tumbling kept only as an attack pose, dark igneous boulder-cluster
  body, cyan crystalline veins, orbiting boulder fists kept. V1
  superseded, kept on disk. V2 set added to PR #16; v1 was never pushed.
- Wispkin #042 v2 COMPLETE and parent-verified (2026-10-25 ~13:35 CDT):
  stuck-mask trait reads clearly — hands pressed ON the cracked
  bone-white mask, mask stuck to face, straining to pull it off, one
  fighting pose with hands pulled wide and long stretched dark strands.
  The discarded first fresh attempt (hands always detached/tethered)
  is NOT part of the set. V1 superseded, kept on disk. V2 set added to
  PR #16; v1 was never pushed.
- PR #16 final file list: 91 original batch-2 files + 9 v2 sheets
  (Dreadtoise/Cragarm/Wispkin v2) = 100 files, additions only,
  0 deletions. No v1 file of any revised creature is in the PR.
  Remaining open items (unchanged): starter evolutions
  002/003/005/006/008/009 (naming set), 047–146 gap (no designs),
  Megalochrome ripple as a separate effect, Blender bake v2.

- Wispkin #042 variant ruling (2026-10-25 ~13:51 CDT, Mars, replying to Wispkin v2): "You gotta stop getting so far away from the references, save those, those are good, but you had his arms and hands a little like plumper and fatter looking before" / "But this can be like a skinny armed variant." Ruling: v2 is KEPT as a SKINNY-ARMED VARIANT (saved, good, not deleted, not the default). STANDARD Wispkin = v1's plumper/fatter arms and nubby hands + the stuck-mask trait. V2's drift (skinny stretched arms, dark hands, pointier body) came from generating its main fresh from text with NO v1 reference — a workaround for two integrity_check_failed errors on the reference route, not a design choice. STANDING RULE from this: stop drifting away from the references; stay close to the reference proportions in every new sheet, and check any workaround output for drift before presenting it as standard. Repo note: PR #16 shipped v2 as the main wispkin set; a future PR must move v2 to a skinny-armed variant folder and install the approved standard v3 as main.

- Wispkin #042 canon CORRECTION by Mars (2026-10-25 ~13:52 CDT, replying to the v2 presentation message): "And I was never saying that V2 was going to replace V1. V1 is still the default. I was just saying V2 is something that happens to him." CORRECTION TO THE ASSISTANT'S PRIOR FRAMING: V1 is still the DEFAULT. V2 does NOT replace V1 and is NOT the new standard — V2 is something that HAPPENS TO HIM (a situational state/event), saved as such. The v3-standard work started after the 13:51 messages was STOPPED on this correction. Repo note: PR #16 shipped V2 as the main wispkin set — a future PR must restore V1 as main and put V2 in a separate state folder. Open: whether Mars wants any v3 at all, or V1 stays exactly as is.

- Wispkin #042 trait animation CONFIRMED by Mars (2026-10-25 ~14:00 CDT, replying to v3): "Yeah, V3 is better than V2 but like I said, that's just something that happens to him at times when he's trying to take his hands off of his face it's just like kind of like an animation you get it it's like a movement it's like a character trait it's like part of the canon." Settled canon: DEFAULT = V1. The stuck-mask struggle is a CANON CHARACTER TRAIT / ANIMATION / MOVEMENT that happens AT TIMES when Wispkin tries to take his hands off his face — NOT a replacement form. V3 is BETTER THAN V2 as the depiction of that trait animation; V2 kept on disk, no longer the preferred depiction. Repo note: PR #16 shipped V2 as main — future PR must restore V1 as main, trait-animation sheets (V3 preferred) to a separate animation folder.
