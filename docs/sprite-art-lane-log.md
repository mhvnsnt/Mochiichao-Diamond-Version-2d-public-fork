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
