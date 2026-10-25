# Sprite Art lane log — Mochiichao, 2026-10-25

Lane: Sprite Art side chat, forked from main chat 2026-10-25 10:48 CDT.
Rule for this lane: original art only, no official Pokemon sprites / ROM art / leaked art.
Game rule throughout: "Looks 3D, runs 2D" — Pokemon-style, Nintendo-based 2D/2.5D
in the HeartGold / Black-White / X-Y style. The game only ever eats 2D sprite
sheets (64x64-based atlas + JSON manifest). NOT a voxel world, NOT a
Minecraft-type world, NOT full 3D in-game. 3D models are masters to bake sheets
from; 2D drawings are masters where no model exists. Never both for the same
creature.

## What was made in this lane (all 2026-10-25, all original 2D sheets)

Each creature gets a 3-sheet set unless noted: (1) main sheet, (2) angles
top/diagonal sheet, (3) angles + lighting sheet. Files in this PR are under
src/assets/sprites-2d/<creature>/ with clean sheet-type names. This is
separate from src/assets/sprites/ (Blender-bake sheets from PR #11) — no
file in this PR overwrites a bake sheet, and no file already on main is
touched. Additions only, deletions: NONE.

- Dorowani 147 (Gen 2 choosable starter, confirmed 2026-10-25): 3 sheets.
  Main sheet v1 was generated from Mars's uploaded Dorowani model-sheet image
  (2D fallback, NOT a Blender render). Walk frames are pose variants, not a
  true limb-animated walk cycle — the Tripo model is an unrigged static.
- Gabu 148 (Gen 2 choosable starter, confirmed 2026-10-25): 3 sheets.
  Main sheet v1 generated from Mars's uploaded Gabu image, in the Dorowani style.
  Grid is irregular (top rows 4 sprites, bottom rows 6), so no 64x64 frame
  set was cut for Gabu yet — do not claim one exists.
- Mochii 001: 3 sheets. Source: GameData starter description "A soft,
  wave-patterned creature that absorbs moisture from the air to power itself",
  colour #4fc3f7, roster/api tags "blue water slime, cute bouncy ball".
- Razorgater 004: 3 sheets. Source: GameData "Its razor-edged chrome plating
  deflects data attacks. Razor-sharp and relentless", colour #b0bec5.
  OPEN, unresolved: eye-colour drift — main sheet has RED eyes, both angles
  sheets have BLUE eyes. Mars must pick which to lock. Not silently fixed.
- Tyrage 007: 3 sheets. Source: GameData "A ground-shaking brute whose
  footsteps leave glowing cracks in digital terrain", colour #a5d6a7.
  Glowing ground cracks appear in all three sheets.
- Kittember 010: 3 sheets. Source: pasted manifest charcoal #333333, glowing
  orange tail sphere #ff8800; GameData Umbral cat. OPEN, same class as
  Razorgater: main sheet eyes amber, angles sheets eyes darker — unresolved.
- Pyropaw 011: 3 sheets. Source: batch 011-020 manifest (obsidian #0f0f0f,
  magma-orange #ff4400 stripe windows, heat-sink ears, flame-emitter tail).
- Manticlaw 012: 3 sheets (normal form). Source: batch 011-020 manifest
  (volcanic rock, red-hot fissures, holographic fire mane, black-glass cone
  claws, sabertooth). The first angles attempt drifted into a blue
  turtle-looking creature and was DISCARDED — it is NOT in this PR. The
  angles sheet in this PR is v2, tiger, verified by eye.
- Pupbble 013: 3 sheets. Source: batch 011-020 manifest (three smooth
  spheres, flat stone ears, pebble tail, river-stone grey #8899aa, moss
  #557744).
- Terradog 014: 3 sheets. Source: batch 011-020 manifest (sandstone #c2b280,
  dark-grey box armor, slate vice-grip jaw, pillar legs).
- Quakehound 015: 3 sheets. Source: batch 011-020 manifest (bedrock wolf,
  tectonic-orange #ff3300 veins, mountain peaks on spine, piledriver paws,
  hollow amber void eyes).
- Squirmite 016: 3 sheets. Source: batch 011-020 manifest (five lime
  #33ff33 capsule segments, black dot eyes, glowing yellow antenna).
- Cocoonode 017: 3 sheets. Source: batch 011-020 manifest (silver #cccccc
  octahedron pod, glowing blue fiber-optic silk, no limbs, hops to move).
- Mothrix 018: 3 sheets. Source: batch 011-020 manifest (white #ffffff
  furry moth, glass wings with neon-rainbow light, feathery radar antenna).
- Zephling 019: main sheet only at PR time (angles + lighting follow in the
  next batch). Source: batch 011-020 manifest (fluffy sky-blue #87ceeb /
  cloud-white #f0f8ff sphere bird, yellow beak, wind swirls beneath).

Not in this PR: starter evolutions 002/003/005/006/008/009 (names still open
— roster vs original vs reforged, Mars has not answered), Aerobeak 020
onward, and any 64x64 frame assembly for these 2D sheets (later sheets are
full-sheet webp files, not yet cut into 64x64 frames + manifests — do not
claim otherwise). Game code does NOT import these sheets yet; wiring is a
later step, same as the PR #11 bake sheets.

## Manticlaw special variant (correction, 2026-10-25)

Mars linked a Tripo model for Manticlaw (fiery rock golem, 16 MB, by
pixiearttreasures, Tripo title "fiery rock golem"). Correction from Mars:
that stubby, short-spine-syndrome golem is a SPECIAL INDIVIDUAL VARIATION
only, like real-world special cases. Normal Manticlaw stays the hulking
tiger above. Do NOT revise the normal Manticlaw design to the golem.
The golem's Blender bake is a special-variant sheet only, and is NOT in
this PR (bake was still running when this PR was cut). GLBs are never
committed to the public repo.

## Kaggle view-label correction (2026-10-25, Mars flagged it)

The Kaggle GPU notebook "MochiBake Blender Render" (free GPU T4 x2, Blender
4.2.0, 6 renders 256x256 RGBA) mislabeled its views 90 degrees. Verified by
eye: Kaggle "front" is actually side_right, Kaggle "back" is actually
side_left, Kaggle "side" is actually front, and Kaggle had NO true back
render. Local sprites-bake mapping was correct (front=angle90, back=angle270,
side=angle0). Corrected Kaggle renders are in this PR under
src/assets/sprites-2d/<dorowani|gabu>/kaggle-corrected/ with true view
names, 256px + 64px, plus the canonical rule in docs/view-mapping.md.
True back for Dorowani/Gabu still comes from the local bake sheets in
src/assets/sprites/, not from Kaggle. Never trust a bake filename without
looking at the image.

## Kaggle dataset disclosure (2026-10-25)

Kaggle's notebook editor offered no direct file upload, so the two GLBs
entered the notebook via a new PRIVATE Kaggle dataset "MochiBake GLB Models"
(marsfmmg/mochibake-glb-models) containing only the two decompressed GLBs.
No external dataset was used, no model was trained, notebook left as draft,
not saved/published. Quota used: 04:13/30h at start, 04:36/30h at end.
That private dataset is NOT in this repo and is not referenced by any
committed file.

## Open issues carried forward (not resolved by this PR)

- Razorgater eye colour: red (main) vs blue (angles) — Mars to pick.
- Kittember eye drift: amber (main) vs darker (angles) — same decision class.
- Starter evolution naming set (002/003/005/006/008/009): roster vs original
  vs reforged — Mars has not answered.
- Pebblefist HP 45 is an assistant guess, never confirmed — do not merge it
  as confirmed, and it is not in this PR.
- Beast / Flora / Neon element calls — open, not in this PR.
- Dorowani/Gabu stats/elements/evolutions — none assigned yet.
- 2D sheets are not yet cut to 64x64 frames + manifests, and not yet imported
  by game code.

## 2026-10-25 ~11:55 CDT — PR #13 merged, Stormtalon done, Manticlaw special bake done
- PR #13 MERGED: https://github.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/pull/13, 57 files, 143 additions, 0 deletions, merge commit b6cc35e1a7e03c2d91f14d31ae484399da9214ba, main b6cc35e1.
- Manticlaw special-variant bake DONE (local, batch 2): sprites-bake/sheets/manticlaw/ — 192x64 sheet + front/back/side 64px + manifest, eye-verified, stubby golem proportions kept, renders dark.
- Stormtalon #021: full 3-sheet set, eye-verified. Note: angles sheet came out pixel-art style vs main sheet smooth style — drift noted, set kept.
- Finblade #022: main sheet done, eye-verified; angles + lighting still to make.
- Batch 2 queue: Zephling angles, Aerobeak full set, Manticlaw special-variant bake sheet + manifest, Stormtalon set, Finblade angles + lighting, then batch 021-031 continues (Megalochrome #023 onward).

## 2026-10-25 ~11:58 CDT — Finblade complete, Megalochrome main + angles
- Finblade #022: full 3-sheet set complete, eye-verified, design consistent.
- Megalochrome #023: main + angles done, eye-verified. Angles sheet pixel-art drift (same as Stormtalon) — noted, kept.
- Next: Megalochrome lighting, then Floatcalf #024, Astroleviathan #025.

## 2026-10-25 ~12:00 CDT — Megalochrome complete, Floatcalf + Astroleviathan started
- Megalochrome #023: full 3-sheet set complete. Lighting sheet used main sheet as reference image and came out smooth — use reference-image prompts for lighting sheets going forward.
- Floatcalf #024: main + angles done, design consistent, main pixel-ish / angles smooth drift noted.
- Astroleviathan #025: main done.
- Next: Floatcalf lighting, Astroleviathan angles + lighting, then Inklet #026.

## 2026-10-25 ~12:37 CDT — Floatcalf + Astroleviathan complete, Inklet started (user asked why work paused)
- Floatcalf #024: full 3-sheet set complete. Astroleviathan #025: full 3-sheet set complete.
- Inklet #026: main done, angles + lighting next.
- Remaining batch 021-031: Inklet angles/lighting, Toxitacle #027, Krakenox #028, Punchkid #029, Strikechamp #030, Kickmaster #031.
- Note to user (answered 12:37): lanes run in parallel, this lane did NOT stop for other agents; quiet stretch was background handoff noise, not a pause. Rest of art is local in sprite-art/2d-sheets/ pending batch 2 push (batch 1 already merged as PR #13).

## 2026-10-25 ~12:39 CDT — Megalochrome Tripo model pulled, Inklet complete
- Tripo model 1 for Megalochrome pulled (public API, no sign-in): mechanical_shark_3d_model.glb 20 MB, decompressed 57 MB, Blender bake running in background. Title on Tripo is "mechanical shark" by pixiearttreasures — flagged, Mars sent it as Megalochrome model 1.
- Inklet #026: full 3-sheet set complete.
- Next: Toxitacle #027, then Krakenox #028, Punchkid #029, Strikechamp #030, Kickmaster #031. Megalochrome bake sheet goes in batch 2 when renders finish.

## 2026-10-25 ~12:41 CDT — Toxitacle complete, Krakenox started
- Toxitacle #027: full 3-sheet set complete. Eye-colour drift noted (purple vs black/blue).
- Krakenox #028: main done.
- Remaining batch 021-031: Krakenox angles/lighting, Punchkid #029, Strikechamp #030, Kickmaster #031.
- Megalochrome Tripo bake still running in background; no renders checked yet this turn.

## 2026-10-25 ~12:42 CDT — Krakenox complete, Punchkid started
- Krakenox #028: full 3-sheet set complete.
- Punchkid #029: main + angles done. Angles drift noted (blocky 3D robot, visor instead of headband+eyes).
- Remaining batch 021-031: Punchkid lighting, Strikechamp #030 full set, Kickmaster #031 full set.

## 2026-10-25 ~12:44 CDT — Canon draft likeness rule (Mars, standing)
- Rule: all sheets in this lane are the ORIGINAL CANON DRAFT LIKENESSES. They change in official canon ONLY if Mars says they change.
- Written to sprite-art/CANON-DRAFT-LIKENESSES.md with full inventory, open drifts (Razorgater eyes, Kittember eyes, Punchkid visor, Stormtalon/Megalochrome pixel angles, Floatcalf style, Toxitacle eyes), and the change procedure (record Mars's words first, new filename, keep old draft marked superseded).
- This file goes in push batch 2 so the rule itself is in the repo, not just local.

## 2026-10-25 ~12:45 CDT — Punchkid v2 (Mars-ordered canon change)
- Mars: keep headband/colorway/wristbands, make Punchkid Tyrogue-like humanoid, not square/robotic.
- V1 main + angles + v1 lighting marked SUPERSEDED DRAFT in CANON-DRAFT-LIKENESSES.md, kept on disk, not deleted.
- V2 main done, eye-verified, now the canon draft. V2 angles + lighting still to make from v2.
- Strikechamp #030: main + angles done. Kickmaster #031: main done.
- Remaining batch 021-031: Punchkid v2 angles/lighting, Strikechamp lighting, Kickmaster angles/lighting.

## 2026-10-25 ~12:51 CDT — Megalochrome bake done + view correction
- Blender bake finished, all 4 angles, BAKE_DONE.
- Corrected mapping: front=angle0, back=angle180, side=angle90 (old Dorowani/Gabu mapping mislabeled this model).
- Sheet + frames + manifest in sprites-bake/sheets/megalochrome/, for batch 2.
- Bake vs 2D draft difference flagged: darker/more mechanical, no water ripple, teeth differ. Canon draft unchanged pending Mars.

## 2026-10-25 ~12:52 CDT — Megalochrome bake color correction (Mars)
- Mars: bake color matches the 2D draft; dark look is the dark render room/lighting. 3D = actual metal, 2D = flat color. Recorded, earlier "darker" wording corrected.

## 2026-10-25 ~12:52 CDT — Megalochrome bake match confirmed (Mars)
- Mars: bake has chainsaw fractal teeth inside the mouth, looks just like the reference in every way.
- Earlier teeth/ripple flags withdrawn — they were misreads of the dark render, not real differences.

## 2026-10-25 ~12:59 CDT — Batch 021-031 closed out except Strikechamp unsuited angles/lighting
- Punchkid revised set complete. Kickmaster set complete, main approved by Mars.
- Strikechamp: suited main = variant, angles v1 disliked, suited lighting = suited variant, unsuited lower-only main done per Mars spec, first fully-unsuited attempt superseded.
- Megalochrome ripple: separate effect task, NOT model geometry, per Mars.

## 2026-10-25 ~13:03 CDT — Autonomous rule (Mars)
- Mars: keep making more, keep working autonomously, stop stopping between batches, do whatever needed to keep working. Recorded as standing rule.
- Punchkid revised angles/lighting approved. Kickmaster approved.
- Next: Strikechamp unsuited angles/lighting, then batch 032-040.

## 2026-10-25 ~13:04 CDT — Strikechamp variant rule + Gearkid started
- Variant rule: suited = usual look, wild ~60% unsuited (approximate).
- Strikechamp unsuited set complete. Gearkid main + angles done, lighting next.
- Background continuation agent spawned to keep working autonomously per Mars rule.

## 2026-10-25 — Subagent batch: Gearkid lighting, Mechapion set, Gorokappa set (local only, NOT pushed)
- Gearkid #032 lighting done, eye-verified: cog head, green #00ff00 eyes, brass/steel, cube fists with white data-streams, wind-up key visible in side/back views, 5 variants (daylight, sunset rim, night neon, moonlight diagonal, back shadow). NOTE: lighting sheet renders pixel-art style vs the smoother main — style drift inside the set, design consistent, not a canon change.
- Mechapion #033 full 3-sheet set done, eye-verified: main (chrome #e0e0e0, red #cc0000 detailing, inverted-triangle chassis, golden polygon belt in every view, shockwave + golden sparks battle pose), angles (top/diagonal/back/side, fist-slam shockwave), lighting (daylight, sunset rim, night neon, moonlight diagonal, back shadow, shockwave pose). NOTE: night-neon variant eyes read cyan instead of red — lighting effect only, not a design change.
- Gorokappa #034 full 3-sheet set done, eye-verified: main (green #004422 armor, dark grey endoskeleton, beak face, kappa bowl + blue data-pixel waterfall, dish shell), angles (top/diagonal/back/side), lighting (daylight, sunset, night neon, moonlight diagonal, back shadow). NOTE: main-sheet arm count is ambiguous (2 arms prominent in most views); angles top view clearly shows FOUR arms, confirming the manifest count — angles sheet resolves the ambiguity, no regeneration needed.
- All 7 sheets are ORIGINAL CANON DRAFT LIKENESSES. No files overwritten, nothing pushed to GitHub, work clone git state untouched, src/assets/sprites-2d/ untouched.

## 2026-10-25 — Pebblefist #035, Cragarm #036, Terrapod #037 (subagent, batch 035-037)
- Pebblefist #035 COMPLETE 3-sheet set: main + angles + lighting, all eye-verified. Jagged granite dodecahedron #666666, amber #ffbf00 cracks and eyes, two floating stone sphere fists, no arms, grey dust trickle. Angles sheet adds small cyan data-pixel accents on fists (digital-field effect, noted, not a canon change). No HP value assigned anywhere.
- Cragarm #036 COMPLETE 3-sheet set: main + angles + lighting, all eye-verified. Dark igneous boulder cluster #333333, glowing cyan crystalline data-veins (manifest gives no vein color; cyan is the sheet read), four floating boulder-fists orbiting central mass, tumbling motion frames.
- Terrapod #037 COMPLETE 3-sheet set: main + angles + lighting, all eye-verified. Mossy weathered mountain-stone, boulder-idle form and turtle-revealed form with snapping beak and column legs, dust venting. Lighting night variant adds cyan seam glow (lighting effect only, noted).
- All local only, no GitHub push, no work-clone git changes, no sprites-2d changes.

## Batch 038-040 (subagent, 2026-10-25) — Sproutle, Shellguard, Dreadtoise COMPLETE
- Sproutle #038: main + angles + lighting, all eye-verified. Seafoam #20b2aa, olive #556b2f helmet-shell, cyan visor, hexagonal shield duck pose. No older seedling concepts merged.
- Shellguard #039: main + angles + lighting, all eye-verified. Deep blue #003366, concrete-grey #808080 bunker shell, red pulsing portholes, 3-fingered claws, footprint decals.
- Dreadtoise #040: main + angles + lighting, all eye-verified. Fortress plateau, chrome + cyan conduits, firing/recoil poses. Count note: legs read 4 in front views, up to 6 in top/back views; cannons read 2 in front/diagonal views, top view reads 4 barrel protrusions.
- No generation failures, no files overwritten, nothing pushed to GitHub.

## 2026-10-25 — Pixilite #041, Wispkin #042, Ashemit #044 complete (starters-and-final batch, part 1)
- Pixilite #041 COMPLETE 3-sheet set (local, batch 2): main + angles + lighting, all eye-verified. Mint green #98ff98 teardrop capsule, pastel pink #ffb6c1 unopened lotus cap, leaf arms, stubby feet, hexagonal shield duck pose, petal trail. Note: lighting sheet uses a curled resting pose inside hexagonal frames, not the standing pose — colors/design consistent, not a canon change.
- Wispkin #042 COMPLETE 3-sheet set (local, batch 2): main + angles + lighting, all eye-verified. Vantablack #000000 teardrop/sphere, bone-white #f8f8ff cracked mask, nubby hands holding mask, dark smoke trail, no legs.
- Ashemit #044 COMPLETE 3-sheet set (local, batch 2): main + angles + lighting, all eye-verified. Burnt orange #cc5500 monkey, ash-grey hands/feet, lotus meditation hover on floating ember, flame-tuft tail, smoke rings. Note: night/moonlight lighting variants show pink eyes — lighting only, not a design change.
- NOT in this scope, still to do: Duskfiend #043, Pyromonk #045, Yogiferno #046, Mythar #331; starter evolutions 002/003/005/006/008/009 remain blocked on the naming-set decision.

## 2026-10-25 ~13:20 CDT — Starters-and-final evolutions + Mythar complete (local, batch 2)
- Duskfiend #043 COMPLETE 3-sheet set: main + angles + lighting, eye-verified. Cone cloak, abyssal purple #1a0033, shattered bone-white mask, crimson #ff0000 eyes, long arms with shadowy scythe-claws, purple flames, shadow-slide poses.
- Pyromonk #045 COMPLETE 3-sheet set: main + angles + lighting, eye-verified. Crimson #dc143c fur, gold #ffd700 tribal markings, golden bangles with roaring flames, cartwheel/backflip + fire-arc attacks. Night lighting flames read blue/purple (lighting only).
- Yogiferno #046 COMPLETE 3-sheet set: main + angles + lighting, eye-verified. White #ffffff fur, incandescent blue #00bfff tribal markings, FOUR arms (confirmed in front views; smaller side views read 2), solar bo-staff, fire mandala, fire halo.
- Mythar #331 COMPLETE 3-sheet set: main + angles + lighting, eye-verified. Opalescent pearl #f0eee4 iridescent feline/griffin, stained-glass wings, star tail tip, golden orbiting rings, roaring pose. Count note: wings read 4-6 per view, but angles top view clearly shows SIX wings (3 per side), confirming spec; golden rings read 1-3 distinct per view depending on angle (orbiting, perspective), not always 3 cleanly countable. Night variants read darker blue/purple (lighting only).
- Starter evolutions 002/003/005/006/008/009 NOT generated (naming conflict unresolved).
- Nothing pushed to GitHub; local only, ready for repo push batch.

## 2026-10-25 ~13:25 CDT — Push batch 2 to repo (in progress)
- Live main verified via API before branching: bed3c8d0da27bfa6d116bb7a75b286cc2a1dbc1b (post-PR #15). Branch feature/sprite-art-2d-batch-2 did not exist; created from that head.
- Main tree check confirmed batch 1 exactly: through Mothrix full sets + Zephling main only; Dorowani/Gabu bake sheets already on main via an earlier PR. No batch-2 target path was already on main except docs/sprite-art-lane-log.md, which is intentionally updated via its Contents API sha.
- Contents (91 files, additions only, 0 deletions): Zephling #019 angles + lighting; Aerobeak #020 full set; Stormtalon #021–Krakenox #028 full sets; Punchkid #029 REVISED set only (v1 and pre-refinement v2 excluded); Kickmaster #031 full set; Strikechamp #030 suited main + suited lighting under strikechamp-suited/ and unsuited lower-only main + angles + lighting under strikechamp-unsuited/ (disliked suited angles v1 and superseded fully-unsuited attempt excluded); Gearkid #032–Gorokappa #034 full sets; Pebblefist #035 full set; Terrapod #037 full set; Sproutle #038, Shellguard #039 full sets; Pixilite #041, Duskfiend #043, Ashemit #044, Pyromonk #045, Yogiferno #046, Mythar #331 full sets; Manticlaw special-variant bake sheet + 64px frames + manifest under manticlaw-special-variant/ (variant only, never the normal likeness); Megalochrome bake sheet + frames + manifest under megalochrome/bake/ (corrected mapping front=angle0, back=angle180, side=angle90); docs/canon-draft-likenesses.md (new) and this log (updated).
- HELD OUT of this PR by Mars order 2026-10-25 ~13:28 CDT (before any merge): Dreadtoise #040 v1 (too mechanical, especially at the bottom — v2 keeps Blastoise-like cannons, more animal body) and Wispkin #042 v1 (needs the stuck-mask trait — hands mostly stuck to mask by black smoke glue/liquid, mask stuck to face, goo stretches when hands kind of unstick in fights). Both v1 sets are PENDING REVISION on local disk only; neither is in this PR. ADDITIONAL HOLD 2026-10-25 ~13:30 CDT: Cragarm #036 v1 (floating/tumbling cluster — v2 must stand on the ground like Golem/Graveler, clear legs and arms, keeping boulder-cluster body, crystalline veins, orbiting boulder fists) is likewise PENDING REVISION and NOT in this PR. PR stays UNMERGED until the parent sends verified v2 files for all three.
- Excluded by design: discarded Manticlaw angles v1, all GLBs, all Tripo signed download URLs, tripo-pull manifests, starter evolutions 002/003/005/006/008/009.
- Repo sheet names: main.webp / angles-top-diagonal.webp / angles-lighting.webp under src/assets/sprites-2d/<creature>/ (variant folders for Strikechamp, subfolders for bakes).

## 2026-10-25 ~13:28 CDT — Mars-ordered revisions: Wispkin #042 trait, Dreadtoise #040 less mechanical
- Wispkin #042 (Mars, favorite so far): hands MOSTLY stuck to mask via black smoke glue/liquid; mask stuck to face; creature trying to take mask off / hands off and failing; in fights hands can be kind of unstuck but goo still stretches between hands and mask. V1 pending revision; v2 to be generated under new filenames, parent-verified before it becomes canon draft. Batch 2 push agent told to HOLD Wispkin v1 out of any merge.
- Dreadtoise #040 (Mars, replying to Dreadtoise sheets): v1 too mechanical at the bottom. KEEP Blastoise-like cannons; CHANGE rest of body to more like an animal. V1 pending revision; v2 to be generated under new filenames, parent-verified before it becomes canon draft. Batch 2 push agent told to HOLD Dreadtoise v1 out of any merge.

## 2026-10-25 ~13:30 CDT — Mars-ordered revision: Cragarm #036 grounded stance
- Cragarm #036 (Mars, replying to Cragarm sheets): needs to stand on the ground like Golem/Graveler, still have all its things, pretty much needs legs and arms. V1 (floating/tumbling cluster) pending revision; v2 to be generated under new filenames, parent-verified before it becomes canon draft. Batch 2 push agent told to HOLD Cragarm v1 out of any merge.

- Dreadtoise #040 v2 PARTIAL (2026-10-25, this lane): angles + lighting sheets generated from Mars's ~13:28 CDT order (v1 too mechanical at the bottom; keep Blastoise-like cannons, make the rest animal). Angles v2: media-generation-media-generation-dreadtoise-an-0-5b84483b-a658-403d-85da-ec8f66438fe0.webp — eye-verified: thick scaled animal legs with claws, tan belly, spiky tail, natural shell rim, fortress-plateau shell top kept; cannons 2 in every view (top view no longer reads 4 barrels), firing/recoil poses with cyan blast. Lighting v2: media-generation-media-generation-dreadtoise-li-0-252afdf2-7f82-447a-bd1b-d8313b380068.webp — eye-verified: daylight / sunset / night neon / moonlight / back-shadow columns, 2 cannons throughout, animal body throughout, firing row at bottom. GAP: the v2 MAIN sheet generation failed on a wrong input path (/root instead of /home/hatch) and that exact call was not retried per the failure instruction — v2 main is still MISSING. Angles + lighting are complete and verified; v2 set is NOT complete until a v2 main is generated by a fresh dispatch. V1 set remains on disk, PENDING REVISION, not canon final.

## 2026-10-25 ~13:31 CDT — Wispkin #042 v2 RETRY FAILED (no image produced)
- Retry of the Wispkin v2 main sheet failed on a media-generation tool error (integrity_check_failed), same class of failure as the first attempt. NO new file was produced, NO v1 file was overwritten, and the generation was NOT retried further per the tool failure instruction. V1 set remains on disk, pending revision; v2 main + angles + lighting are all still ungenerated. Needs a fresh parent dispatch (or a different generation route) — do not present v2 as done.

## 2026-10-25 ~13:31 CDT — Dreadtoise #040 v2 MAIN sheet complete (completes v2 set)
- Dreadtoise #040 v2 MAIN: media-generation-media-generation-dreadtoise-sh-0-ec1cf268-5ee5-46bd-a5d7-98aa5eb118d3.webp (524,958 bytes), eye-verified. Generated from v2 angles as primary reference. Battle front, battle back, overworld front/back, walk cycles down/up/side, firing/recoil pose, icon/menu sprite. Animal lower body throughout (scaled clawed legs, tan belly, tail, natural shell rim), fortress-plateau shell with green moss top and rock outcrops kept, Blastoise-like cannons = 2 in every front view (strict profile reads 1 by perspective, as in v2 angles). V2 3-sheet set now COMPLETE: v2 main + v2 angles + v2 lighting. V1 set remains on disk, superseded, not final. Local only, no push.

## 2026-10-25 ~13:32 CDT — Cragarm #036 v2 COMPLETE (grounded revision)
- Cragarm #036 v2 COMPLETE 3-sheet set (local, batch 2): main + angles + lighting, all eye-verified. Grounded Graveler/Golem-like bipedal stance — two thick stone legs with feet planted on the ground and two thick stone arms in every main pose, NOT a floating/tumbling cluster (tumbling kept only as an attack pose). Dark igneous #333333 boulder-cluster body, cyan crystalline data-veins, orbiting boulder fists kept as extra floating fists around it.
- V2 main: media-generation-media-generation-cragarm-sheet-0-85ae8835-1de5-4209-a345-36c5e49faad1.webp — battle front/back, overworld front/back/side, walk cycles (up/down/right labeled; no distinct labeled left set, side profile present), tumbling attack, menu icon.
- V2 angles: media-generation-media-generation-cragarm-angle-0-acc29153-3499-401d-a6f0-e651a3a044a2.webp — top-down, 3/4 front, 3/4 back, back, side profile, punch, stomp, crouch, tumbling attack; grounded with legs/arms throughout (top-down legs read short, as expected from above).
- V2 lighting: media-generation-media-generation-cragarm-light-0-faaf3d65-83bc-48f1-9483-dbd9c8ce99b1.webp — bright daylight / warm sunset / night neon / moonlight / back-shadow silhouette; veins glow at night, grounded biped in all five.
- V1 set kept on disk, superseded, not final. Local only, not pushed.

## 2026-10-25 ~13:33 CDT — Wispkin #042 v2 COMPLETE 3-sheet set (third attempt, new route)
- Route: two prior attempts failed on media-generation integrity_check_failed when generating the main WITH the v1 main as reference. This attempt generated the v2 main FRESH from text alone (no reference) — it succeeded, no tool error. Angles and lighting were then generated using the new v2 main as reference. The no-reference-first route avoided the earlier error.
- V2 main (CANON main): media-generation-media-generation-wispkin-sheet-0-3bb0b0c6-3ffd-4578-bdb9-1e7d1f87e0ea.webp — eye-verified: front/back/side/hover views, hands pressed ON the cracked bone-white mask in most views, mask stuck to face, straining to pull it off, smoke trailing below, plus one fighting pose with hands pulled wide and long stretched dark strands to the mask, plus menu icon. Hands read dark (body-colored) rather than white nubby — minor drift, noted, not a canon change. Body slightly pointier teardrop than v1.
- DISCARDED attempt (NOT part of the set): media-generation-media-generation-wispkin-sheet-0-41f43e10-8bdb-4748-8a17-2db7f9d48b8d.webp — first fresh-text main, hands always detached/tethered by long strands in every view, opposite of the mostly-stuck trait. Kept on disk only; do NOT push as v2 main.
- V2 angles: media-generation-media-generation-wispkin-angle-0-8041b7e5-7c89-48ed-9f49-a7f7b5f65869.webp — eye-verified: front, diagonal, side views with hands on mask, back view, glide/fighting pose with hands pulled wide and stretched strands. Trait reads clearly.
- V2 lighting: media-generation-media-generation-wispkin-light-0-4d6ef175-71ec-4a83-ba89-7f09d4cb6d54.webp — eye-verified: daylight, sunset warm rim, night neon purple (fighting pose, hands pulled wide, stretched strands), moonlight diagonal, back-shadow silhouette. Hands on mask in all except the night fighting pose. Trait reads clearly in all five.
- V1 set kept on disk, superseded by this v2 set, not final. Local only, not pushed. Batch 2 push should use these three v2 files, not v1 and not the discarded first attempt.

## 2026-10-25 ~13:35 CDT — PR #16 opened, then v2 additions (NOT merged yet)
- Run 3 finished 91/91 uploads; PR #16 opened: https://github.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/pull/16 (branch feature/sprite-art-2d-batch-2, base main bed3c8d0).
- V2 lifts arrived from the parent in sequence (Dreadtoise, then Cragarm, then Wispkin — each parent-verified, each with exact filenames). The 9 v2 sheets were added to the same branch/PR: dreadtoise v2 (main/angles/lighting), cragarm v2 (main/angles/lighting), wispkin v2 (main/angles/lighting), under src/assets/sprites-2d/<creature>/. No v1 file of any of the three was ever uploaded; the discarded Wispkin fresh attempt (41f43e10, hands detached) was excluded.
- Final PR file list: 100 files, additions only, 0 deletions (verified via the PR files API + blob-sha match for the 9 v2 sheets). Docs on the branch were updated by append only (canon-draft-likenesses.md, this log) and the PR body was patched to the final list.
- Merge gate (per original brief): PR files deletions 0, mergeable True + CLEAN, dirty-tree local build, manual secret check (no tokens/signed URLs; no formal gitleaks claim). Merge only if all pass; outcome recorded below.
