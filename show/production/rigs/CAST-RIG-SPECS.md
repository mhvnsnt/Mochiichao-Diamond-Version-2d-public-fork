# Cast rig specs — principal cast (pilot six)
In the shape of Jamar's character-pipeline Stage 3 rig-spec template
(`animation-techniques-archive/steal-like-artist/character-pipeline/
03-rig-spec/template.md`), under the rig standard in this folder's
README. All specs: **Puppet (2D cutout)**, 24 FPS, Graphic symbols for
mouth/eyes/hands, Preston Blair 10-viseme mouth sets, ROM battery =
standard six (neutral / full reach / deep crouch / sit / 8-frame run /
jump-squash-land) **plus** the character extremes listed. Scaffold
JSON for each: `scaffolds/<name>.rig.json`.

Study assignments use Jamar's own rig-mapping guides
(`steal-like-artist/rig-mapping/shows/`): Gumball = organization for
every rig; the per-character primary is named in each spec.

---

## Mochii — compact round mascot
- **Planned file:** `MC101_ORIGINAL_PUPPET_MOCHII_VERSION_001`
- **Body plan:** compact round; head-body nearly one mass, short limbs.
- **Primary study:** Powerpuff Girls (minimum viable rigging,
  subtraction) + Dexter's Lab (geometric construction).
- **Special layers:** cheek_L, cheek_R, tail.
- **Controls (beyond standard):** cheek_puff, tail_wag.
- **Deformation:** the squash IS the character — full-ball curl is a
  legal pose; bounce cycles squash on contact frames, stretch on rise.
- **Pose library:** idle_bounce, cheer, sleep_curl, surprised_pop.
- **Character ROM extremes:** cheek_puff_max, curl_full_ball.

## Dorowani — bipedal amphibian (host)
- **Planned file:** `MC101_ORIGINAL_PUPPET_DOROWANI_VERSION_001`
- **Body plan:** upright biped; light belly plate, red fin cheeks,
  dorsal fin, tan shell worn on the back.
- **Primary study:** Foster's Home (Flash puppet pipeline,
  character-agnostic process) + Gumball organization.
- **Special layers:** fin_cheek_L, fin_cheek_R, dorsal_fin,
  shell_back, belly_plate.
- **Controls:** fin_flare (emotion tell), shell_tilt, belly_breathe.
- **Deformation:** fins flare on excitement/alarm — rig the flare as
  a controlled deformation, not a redraw; shell must clear the torso
  on turns (layer order + clearance check in ROM).
- **Pose library:** idle_breathe, wave, laugh, host_point (the
  interview-host gesture set), hero_stand.
- **Character ROM extremes:** fin_flare_max, shell_clearance_turn.

## Gabu — bulky bruiser
- **Planned file:** `MC101_ORIGINAL_PUPPET_GABU_VERSION_001`
- **Body plan:** heavy top mass, horns, strong jaw, heavy tail.
- **Primary study:** Johnny Bravo (classic big-humanoid silhouette,
  likeness anchors) + Teen Titans 2003 (action ROM).
- **Special layers:** horn_L, horn_R, jaw_lower, tail_heavy.
- **Controls:** jaw_chomp (jaw is its own sub-rig for roar/laugh),
  chest_puff, stomp_shake (root shake driven by stomp poses).
- **Deformation:** squash reads as weight — slower anticipation
  (6–8f), landing squash holds 3f; never floaty.
- **Pose library:** idle_sway, roar, laugh_belly, stomp, sleep_sit.
- **Character ROM extremes:** arms_crossed_tight (the Universal Rig
  Standard battery pose), full_overhead_slam.

## Kittember — small feline, tail-flame
- **Planned file:** `MC101_ORIGINAL_PUPPET_KITTEMBER_VERSION_001`
- **Body plan:** small cat; expressive ears; flame-tipped tail; a
  the flame is ATTACHED to the tail tip (owner canon, corrected 2026-10-27) — it is part of the tail, never a separate floating orb.
- **Primary study:** Dexter's Lab (compact characters) + Foster's
  puppet process.
- **Special layers:** ear_L, ear_R, tail (with tail_flame at its tip)
  root + bob control, parented optionally).
- **Controls:** ear_twitch (independent L/R), tail_flame_flicker
  (symbol cycle), tail_flick, pounce_stretch.
- **Deformation:** pounce = full-body stretch with ear/tail lag
  (follow-through offsets 2–3f); startled arch is a spine pose set.
- **Pose library:** idle_sit, pounce, groom, startled_arch, sleep_loaf.
- **Character ROM extremes:** full_pounce_extension, arch_max.

## Sproutle — small plant biped
- **Planned file:** `MC101_ORIGINAL_PUPPET_SPROUTLE_VERSION_001`
- **Body plan:** small biped; sprout leaves on head; visor.
- **Primary study:** Powerpuff Girls (subtraction — fewest parts that
  read) + Foster's process.
- **Special layers:** sprout_leaf_1, sprout_leaf_2, visor.
- **Controls:** leaf_wiggle (leaves are the emotion tell — droop/
  perk/spread), visor_glint (highlight symbol step), root_hop.
- **Deformation:** whole-body sway is the idle language (plant in
  breeze); hop cycles squash deep — leaves lag 2f behind body.
- **Pose library:** idle_sway, dance, water_happy, sleep_droop.
- **Character ROM extremes:** leaf_spread_max, hop_squash_deep.

## Wispkin — ghost (no-legs body plan)
- **Planned file:** `MC101_ORIGINAL_PUPPET_WISPKIN_VERSION_001`
- **Body plan:** floating ghost — **no leg hierarchy**; body tapers
  to a wisp tail/smoke trail; glow core inside the torso group.
- **Primary study:** Foster's (varied designs through one process) +
  cutout approach from the Goodville trio notes.
- **Special layers:** wisp_tail_trail, smoke_wisps, glow_core.
- **Controls:** drift_sine (idle float path), trail_length,
  glow_pulse, phase_flicker (semi-transparent flicker for scares/
  jokes — use sparingly).
- **Deformation:** squash/stretch applies to the whole silhouette;
  the trail stretches on fast moves instead of smear drawings.
- **Pose library:** idle_drift, giggle_wobble, spook_pose, sleep_dim,
  peek.
- **Character ROM extremes:** trail_stretch_max, full_squash_ghost.
- **ROM battery swap:** sit/crouch replaced by hover_high /
  hover_low + trail poses (no legs to crouch with).

## Mochiko — humanoid (keeper)
- **Build:** `show/production/rigs/builds/mochiko/` (TextRig v1 DEFORM rig, canon cutout, no redraw)
- **Body plan:** humanoid track — Johnny Bravo silhouette/likeness anchors + KND-style mouth QC (per this file's coverage note); likeness lock = `docs/human-characters/` designs
- **Talking set:** Preston Blair 10-viseme mouth swaps wired for Rhubarb cues (`builds/mochiko/talking/` + TALKING-SET.md) — humans speak words; the cries-only law is creatures-only
- **Voice:** Chatterbox exaggeration 0.45 / CFG 0.5; reference casting AWAITING OWNER
- **Maturity:** v1 = idle / talk / tilt; ROM battery is the v2 pass (creature-rig staged maturity)

## Hex — humanoid (rival)
- **Build:** `show/production/rigs/builds/hex/`
- **Body plan:** humanoid track — Johnny Bravo silhouette/likeness anchors + KND-style mouth QC; likeness lock = `docs/human-characters/` designs
- **Talking set:** Blair mouth swaps + rest mouth (`builds/hex/talking/` + TALKING-SET.md)
- **Voice:** Chatterbox exaggeration 0.3 / CFG 0.6; reference casting AWAITING OWNER
- **Maturity:** v1 = idle / talk / tilt; ROM battery is the v2 pass

## Aeon — humanoid (professor)
- **Build:** `show/production/rigs/builds/aeon/`
- **Body plan:** humanoid track — Johnny Bravo silhouette/likeness anchors + KND-style mouth QC; likeness lock = `docs/human-characters/` designs
- **Talking set:** Blair mouth swaps + rest mouth (`builds/aeon/talking/` + TALKING-SET.md)
- **Voice:** Chatterbox exaggeration 0.4 / CFG 0.55; reference casting AWAITING OWNER
- **Maturity:** v1 = idle / talk / tilt; ROM battery is the v2 pass

---

## Coverage beyond the pilot six
- **Remaining species (41):** same template — body plan first
  (biped / quadruped / compact / floater / serpentine), one primary
  study guide, special layers for the species' signature feature,
  scaffold generated from the filled spec. Specs get written when a
  species is cast in an episode (no speculative rigging).
- **Human cast:** the rig-mapping guides' humanoid track (Johnny
  Bravo silhouette/likeness anchors + KND-style mouth QC) applies to
  Mochiko, Hex, Prof. Aeon and the Mom variants, using the repo's
  `docs/human-characters/` designs as the likeness lock.
