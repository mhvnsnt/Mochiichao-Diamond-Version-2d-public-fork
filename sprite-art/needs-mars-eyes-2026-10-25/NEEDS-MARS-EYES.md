# NEEDS-MARS-EYES — staged confirmation list (sprite-art lane, 2026-10-25 ~20:47 CDT)

Standing rule (Mars, 2026-10-25 ~20:41 CDT): anything that needs
Mars's confirmation is SHOWN to him first (actual image/file via
the parent) before it is decided — and confirmation items NEVER
block other work. This file is that staged list, kept SEPARATE
from done items. Nothing in this list is decided final until Mars
looks at it. Nothing in this list blocks the running bake, the
spot-check pipeline, or the composition spec — all of those keep
going in parallel.

How the parent shows these: open the ORIGINAL file listed per
item (full size), plus the contact sheet in this directory for a
quick side-by-side. Originals are never overwritten; contact
sheets are new files in this directory only.

Contact sheets in this directory:
- title_judgment_contact.png — NME-1 to NME-4 in one 2x2 sheet.
- dorowani_bake_contact.png — NME-5: current Dorowani baked
  renders enlarged (top row) + at 64px game size (bottom strip).

## NME-1 — I2 starter trio: Razorgater reads more robotic/armoured than its sheet
- Original: sprite-art/title/intro-frame-02-starter-trio-v1.png
  (2352 x 1008)
- Question for Mars: does Razorgater still read as Razorgater,
  or is the armour too robotic vs its 2d-sheet design?
- If Mars says too robotic: regenerate I2 (new filename, never
  overwrite this file). If Mars says fine: I2 is final.
- Status: STAGED, NOT DECIDED. Does not block anything.

## NME-2 — I3 faceoff: Dorowani's eyes are blue, but its main sheet has red eyes
- Original: sprite-art/title/intro-frame-03-dorowani-gabu-faceoff-v1.png
  (1920 x 1280)
- Question for Mars: blue eyes (matching Dorowani's angles
  sheets) or red eyes (matching its main sheet) — which is canon?
- This is the open canon variance already noted in
  TITLE-SEQUENCE-ART-SPEC.md §7, not a new error. Mars's pick
  locks the eye colour for title art going forward.
- Status: STAGED, NOT DECIDED. Does not block anything.

## NME-3 — T2 key art v2: eye colours across the five creatures
- Original: sprite-art/title/title-bg-key-art-v2.png (1280 x 1920)
- Question for Mars: in this frame Dorowani's eyes read dark and
  Tyrage's read red — confirm both against canon, or flag which
  creature's eyes need correcting in a v3 (new filename).
- Note: v1 of this key art is NOT in this list on purpose — v1
  had Tyrage missing / Gabu duplicated, v2 fixed that, v1 was
  never shown to Mars and must not be presented.
- Status: STAGED, NOT DECIDED. Does not block anything.

## NME-4 — I4 silhouette reveal: cream rectangle seam on the colour side
- Original: sprite-art/title/intro-frame-04-silhouette-reveal-mochii-v1.png
  (1920 x 1080)
- What Mars will see: left = black Mochii silhouette on pale
  blue (clean); right = colour Mochii, but its panel keeps the
  cream background rectangle from the S1 source crop, so the two
  sides do not share one ground.
- Question for Mars: is the seam acceptable for the reveal beat,
  or should the colour side be re-composited onto the same pale
  ground (new filename, same silhouette method)?
- Status: STAGED, NOT DECIDED. Does not block anything.

## NME-5 — Dorowani rig bake: idle reads subtle at game size
- Originals (renders so far, 6 files, 256 x 256, transparent):
  sprites-bake/sheets-rigged/dorowani/renders/
  dorowani_idle_front_f0.png, f15, f30, f45,
  dorowani_walk_front_f0.png, dorowani_walk_side_f0.png
- Also see dorowani_bake_contact.png in this directory (enlarged
  row + 64px strip) for the game-size read.
- Question for Mars: at 64px, does the idle read as alive, or
  does it look frozen? Measured: f15/f45 differ ~5,000 px from
  f0, f30 coincides with the rest pose (0 px diff) — the clip
  does animate, but the motion is subtle.
- If Mars says too subtle: the idle clip choice (not the rig)
  is revisited after the full bake — this does NOT stop the
  bake, the walk/battle clips, or the Gabu run.
- Status: STAGED, NOT DECIDED. Bake continues regardless.

## NME-6 — Gabu side-view attack preview: NOT YET STAGED (pending bake)
- This item has NO preview to show yet — the existing
  clip_attack_f15.png is front view, arms-wide, and does not
  sell the bite, so it is NOT presented as the proof.
- The 512px side previews (gabu_attack_side_preview_f8/f15/f22)
  are scripted into the Gabu bake segment. When they land, they
  are added here as NME-6 with their paths + contact sheet,
  and shown to Mars before any bite-read decision is made.
- Status: PENDING, NOT BLOCKING. The bake, the pipeline, and
  the composition spec all proceed without it.

## DONE items (distinct from the list above — no Mars judgment needed)
- Ripple VFX 12/12 (technical pass: rings/droplets/loop verified;
  no likeness drift flagged).
- Spot-check pipeline wiring + tests (mochii 19/19 pass,
  razorgater flagged -> exit 1, no packed output).
- Starter presentation composition spec v1 (spec document, no
  new art; S2 wording and T3 wiring remain owed to other lanes).
- Title frames I1 world-dawn and the Aeon intro frame: no
  judgment call flagged in this pass (no drift, no seam, no
  canon variance) — they are not held by this list. If Mars
  spots something when shown them, it joins this list then.
- Bake checkpoint itself: Dorowani renders 6/27 on disk, Gabu
  0/31 — the bake was found dead (see below) and resumed, not
  held for any confirmation.

## Bake status at staging time (kept building, not blocked)
- The 01:06 UTC bake died silently after dorowani_walk_side_f0
  (log ends there, no crash line, Blender + libEGL verified
  still present). Renders on disk were kept, nothing rebuilt.
- Resumed with sprites-bake/bake_rigged_resume.py (same
  pipeline, same settings, plus skip-if-already-on-disk), in
  the background: Dorowani remaining 21 renders, then Gabu 31.
  Next step after it finishes: make_rigged_sheets.py strips +
  manifests + full sheet eye-check — those sheets will join
  this NEEDS-MARS-EYES list if they disagree with the 2D sheets.

## NME-7 — Dorowani ready ≈ attack: both arms-out, battle readability (2026-10-27 ~01:46 CDT eye-check)
- Strips (local staging only, NOT game-wired, NO PR):
  sprites-bake/sheets-rigged/dorowani/dorowani_ready_front_strip.png (3f)
  sprites-bake/sheets-rigged/dorowani/dorowani_attack_front_strip.png (4f)
  Spot renders read at 256px: renders/dorowani_ready_front_f15.png,
  renders/dorowani_attack_front_f16.png.
- Finding: at 256px ready IS distinct from idle (arms out horizontal),
  but ready and attack are near-duplicates — both arms-out horizontal,
  attack with fingers spread and legs slightly bent, but no lunge, bite,
  or forward thrust across its strip. At 64px game size, ready vs attack
  barely distinguish in battle.
- 2D comparison: dorowani_sheet_v1.webp (upright biped, arms-down rest
  pose; no ready/attack pose on the sheet to match against, so this is
  a rigged-set internal distinction problem, not a 2D-pose mismatch).
- Question for Mars: is arms-out acceptable for BOTH ready and attack,
  or does one of them need a different pose (e.g. attack lunges/bites,
  ready stays arms-out)? Shown here before any pose is changed.
- Status: STAGED, NOT DECIDED. Does not block other strips or lanes.

## NME-8 — Gabu walk_side posture: low horizontal vs 2D upright biped (2026-10-27 ~01:46 CDT eye-check)
- Strip (local staging only, NOT game-wired, NO PR):
  sprites-bake/sheets-rigged/gabu/gabu_walk_side_strip.png (4f).
  Spot render read at 256px: renders/gabu_walk_side_f23.png.
- Finding: stepping IS visible (legs alternate), but the body sits low
  and horizontal, almost quadruped/crawl-like, shell dominating the top.
  The 2D sheet (gabu_sheet_v1.webp) side stance is an upright biped
  with the shell vertical behind. Posture disagrees; motion does not.
- Question for Mars: keep the low side-walk (reads as a turtle waddle),
  or re-pose the side walk upright to match the 2D side stance?
- Status: STAGED, NOT DECIDED. Does not block other strips or lanes.

## NME-9 — Gabu attack arms long/thin, no bite in front attack (2026-10-27 ~01:46 CDT eye-check)
- Strip (local staging only, NOT game-wired, NO PR):
  sprites-bake/sheets-rigged/gabu/gabu_attack_front_strip.png (5f).
  Spot render read at 256px: renders/gabu_attack_front_f15.png.
- Finding: front attack is arms-wide straight sideways, no lunge, no
  bite — it does not sell the bite. At 256px the arms read LONG and
  THIN, paddle/blade-like, vs the 2D sheet's short stubby clawed arms
  (gabu_sheet_v1.webp). This is a proportion disagreement, not just a
  subtle clip. Distinct from NME-6: NME-6 is about the 512px side
  previews (not eye-checked here); this is the front strip itself.
- Question for Mars: keep the arms-wide front attack, or does the bite
  need the side preview / a re-posed front attack, and do the long arms
  need shortening to the 2D proportion?
- Status: STAGED, NOT DECIDED. Does not block other strips or lanes.

## NME-10 — Faint poses disagree across creatures: Gabu slump vs Dorowani prone (2026-10-27 ~01:46 CDT eye-check)
- Strips (local staging only, NOT game-wired, NO PR):
  sprites-bake/sheets-rigged/gabu/gabu_faint_front_strip.png (4f,
  final frame renders/gabu_faint_front_f45.png at 256px: tilted slump,
  head bowed, arms out — reads as dizzy/leaning, not fainted)
  vs sprites-bake/sheets-rigged/dorowani/dorowani_faint_front_strip.png
  (4f, final frame renders/dorowani_faint_front_f30.png at 256px:
  fully on its side, reads unambiguously as fainted).
- Finding: the two creatures' faint clips do not share one faint
  language. One lane-wide call is needed, not two per-creature fixes.
- Question for Mars: should faint = fully prone (Dorowani way) for both,
  or slump (Gabu way) for both, or is per-creature faint acceptable?
- Status: STAGED, NOT DECIDED. Does not block other strips or lanes.

## Eye-check carried flags (2026-10-27 ~01:46 CDT — recorded, NOT decided)
- Front-view walks (both creatures) read as bob/tilt/waddle at 64px,
  not stepping legs; only side walks show real leg stepping. This is
  recorded in the eye-check checkpoint, not staged as a separate NME
  item, because it is a front-view limit of the set, not a per-strip
  pose error — Mars can still raise it to an NME item when shown it.
- Pass1-GLB re-bake question (v2-fixed final GLB 2c) stays open as
  Mars's lane decision; no rig switched in this step. Back view still
  absent from the rigged bake (not mirrored in).
