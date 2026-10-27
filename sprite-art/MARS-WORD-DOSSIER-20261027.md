# MARS-WORD DOSSIER — Sprite Art lane (2026-10-27, lane-to-100% order)

Prepared by the lane-finish coordinator for the parent to present to Mars.
NOTHING in this dossier is decided. Every entry states the exact decision
needed, what happens on each choice, and the exact visual files to re-show
(all paths below were verified on disk with `ls` before listing, except
where an entry explicitly says verification is still pending).

Standing rule applied while building this list (Mars 2026-10-27 ~07:43 CDT,
FILL-FROM-SOURCE RULE): anything Pokemon code, all Pokemon games on disk,
or the modding community can fill is filled from that source at 100% and is
NOT asked. Only Mochiichao-only choices are in this dossier: original looks,
original descriptions, species conversion to the original roster, map/role
assignments, Deep/new-element matchup values, and original art/audio/dialogue
calls. Items that turned out source-fillable were filled (or handed to the
worker filling them) instead of listed here.

## Lane math at dossier time

- Art corpus dimensions complete at 51/51 sets: 2D sheets, locked atlases,
  idle loops, hurt baseline, attack sets (4+4/creature), articulation,
  player VFX (30° code-true, confirmed), opponent VFX (code-true,
  confirmed), back-view sets, hand passes, walk frames, overworld walk
  manifests 51/51 (PR #284 merged 7d5f2002), silhouettes 51/51, footprints
  51/51, LUSTRE 510/510 looks, game-ready sets 51/51.
- In flight (NOT decisions — workers running, do not re-ask): opponent
  code-true art ship, BW2 30° player ship, Gabu hand/finger rig fix,
  rename-all + animate-all coordinator (phase 1 = rename list for veto).
  Shipped this job: PR #291 (see Appendix C).
- Delivered staged (NOT shipped, NOT a decision): body-part origins
  derivation (Mars order 2026-10-27 ~07:46 CDT) — 492/560 = 87.9%
  derived from animation/rig data, 68/560 = 12.1% indeterminate
  (66 BW2-only Special moves with no per-move animation data on disk
  + SECRET_POWER + NONE placeholder), 3/3 FireRed-only derived;
  staged table at body-part-origins-20261027/body-part-origins-20261027.json.
  Game-code landing still gated on rebuild + playtest. The 68 are a
  data gap (Black 2 per-move effect scripts not in the decomp slice),
  not a Mars question — unless he wants to assign them by art call.
- This dossier: 14 full entries (Part 1) + 7 compact entries (Part 2
  + Addendum) = 21 decisions genuinely needing Mars's word. Everything else checked is
  in Appendix B (resolved/superseded, with evidence).
- Merged is NOT live until a Pages rebuild + playtest — that step is LAST
  globally (after all lanes finish + Mars's deploy decision), never
  claimed early.

---

# PART 1 — FULL ENTRIES

## 1. Dorowani option 3 mouth — formal approval still owed

- What it is: a jaw-edge experiment for Dorowani's attack impact frames:
  a dark ellipse (radii 7×4, fill 18,18,38) placed on 4 impact frames,
  eye-anchored with a 6px eye-to-jaw offset.
- History: Dorowani's locked battle_front snout has no drawn mouth line —
  measured twice (64px cell and full-res source sheet both show a smooth
  blue snout with a pale jaw/chin block, colour boundary at y≈29/30), so
  the shipping attack sets are eyes-only by rule (measure, not guess).
  Option 3 was staged as an experiment. Mars could see the sheet (he
  replied to it 2026-10-26 20:26 CDT) but that reply flagged opponent
  attack direction instead — no verdict on option 3 itself. His ~18:22
  CDT "eyes + mouth treatment works" was about the treatment generally,
  NOT a formal option-3 approval.
- Decision needed: approve option 3 as Dorowani's attack mouth, reject
  it (shipping stays eyes-only), or order a different mouth treatment.
- If approved: option 3 becomes the attack mouth on the 4 impact frames
  and ships as the new use-these edit. If rejected: eyes-only stands,
  option 3 stays staged marked not-approved. Either way the base face
  is never edited — only the impact frames carry the treatment.
- Honest caveat to state when showing: the 6px eye-to-jaw offset is an
  ASSUMPTION, not a measurement — no per-species mouth coordinate
  exists in any Pokemon source.
- VISUAL (verified on disk, 98,162 bytes):
  - sprite-art/animation/expanded-scope/dorowani-mouth-options-20261026/option3_before_after.png

## 2. Kittember glow v2 swap — explicit word needed

- What it is: the title figure glow cycle. v1 SHIPPED via PR #219:
  A (off) → B (glow, radius 72, peak 0.55) → C (stronger, radius 105,
  peak 0.80) at 500ms/frame. v2 STAGED: B2 (radius 80, peak 0.75, whiter
  core) → C2 (radius 115, peak 0.95). The figure is identical in every
  frame; only the glow changes.
- History: Mars replied to the v1-vs-v2 show sheet 2026-10-26 ~20:10 CDT
  with "I can confirm this." Those words do not literally state
  swap-vs-keep, so the in-lane recording went with "swap" but the swap
  PR was deliberately held — it must NOT be done silently. This entry
  exists to get his explicit word.
- Decision needed: swap v1 → v2 on the title figure, or keep v1.
- If swap: v2 wiring PR replaces the PR #219 cycle (v1 stays on main
  marked superseded, never deleted). If keep: v2 stays staged, v1
  stands, and this entry closes.
- VISUAL (verified on disk, 586,454 bytes):
  - title-creatures-9/work/kittember-bubbles/kittember-glow-v1-vs-v2-show-20261026.png

## 3. NME-5 — Dorowani rig-bake idle reads subtle at game size

- What it is: the 3D-bake Dorowani idle clip at 64px game size.
- History: measured at staging — f15/f45 differ ~5,000 px from f0, but
  f30 coincides with the rest pose (0 px diff). The clip animates, but
  the motion is subtle; at 64px it can read as frozen.
- Decision needed: is the subtle idle acceptable, or should the idle
  clip choice be revisited (a different clip, not a rig change)?
- If acceptable: the idle strip stands as-is. If too subtle: the idle
  clip is re-picked after the bake work — this does not stop any other
  strip or lane.
- VISUAL (verified on disk):
  - sprite-art/needs-mars-eyes-2026-10-25/dorowani_bake_contact.png
    (enlarged row + 64px strip)
  - sprites-bake/sheets-rigged/dorowani/dorowani_idle_front_strip.png

## 4. NME-6 — Gabu side-view attack previews (bite read)

- What it is: whether the 512px side attack previews sell Gabu's bite.
  The front attack (arms-wide) does not sell the bite, so it was never
  presented as the proof; the side previews are the proof.
- History: at NME staging this item had NO preview (bake pending). The
  Gabu bake has since completed 31/31, and all three side previews are
  now verified on disk (see visuals).
- Decision needed: do the side previews sell the bite, or does the
  bite need a re-posed attack?
- If they sell it: the side previews become the bite reference. If
  not: the front attack stays as-is and a bite pose is ordered
  separately (never silently redrawn).
- VISUALS (verified on disk, all three side previews exist):
  - sprites-bake/sheets-rigged/gabu/renders/gabu_attack_side_preview_f8.png
  - sprites-bake/sheets-rigged/gabu/renders/gabu_attack_side_preview_f15.png
  - sprites-bake/sheets-rigged/gabu/renders/gabu_attack_side_preview_f22.png
  - sprites-bake/sheets-rigged/gabu/gabu_attack_front_strip.png (front strip, for contrast)

## 5. NME-7 — Dorowani ready ≈ attack (both arms-out)

- What it is: at 256px, Dorowani's rigged ready IS distinct from idle
  (arms out horizontal), but ready and attack are near-duplicates —
  both arms-out horizontal; attack adds spread fingers and slightly
  bent legs, but no lunge, bite, or forward thrust across its strip.
  At 64px game size, ready vs attack barely distinguish in battle.
- History: found in the 2026-10-27 ~01:46 CDT strip eye-check. This is
  a rigged-set internal distinction problem, not a 2D-pose mismatch —
  the 2D sheet has no ready/attack pose to match against (upright
  biped, arms-down rest pose).
- Decision needed: is arms-out acceptable for BOTH ready and attack,
  or does one need a different pose (e.g. attack lunges/bites while
  ready stays arms-out)?
- If acceptable: both strips stand. If not: the named strip gets a
  re-pose order; the other stands untouched.
- VISUALS (verified on disk):
  - sprites-bake/sheets-rigged/dorowani/dorowani_ready_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_attack_front_strip.png

## 6. NME-8 — Gabu walk_side posture (low/horizontal vs upright biped)

- What it is: the rigged Gabu side walk steps visibly (legs alternate),
  but the body sits low and horizontal, almost quadruped/crawl-like,
  shell dominating the top. The 2D sheet side stance is an upright
  biped with the shell vertical behind. Posture disagrees; motion
  does not.
- Decision needed: keep the low side-walk (reads as a turtle waddle),
  or re-pose the side walk upright to match the 2D side stance?
- If keep: the strip stands and the posture difference is recorded as
  a rig-bake trait, not an error. If re-pose: the side walk is
  re-baked upright; the front walks are untouched.
- VISUAL (verified on disk):
  - sprites-bake/sheets-rigged/gabu/gabu_walk_side_strip.png

## 7. NME-9 — Gabu front attack arms long/thin, no bite

- What it is: the rigged Gabu front attack is arms-wide straight
  sideways, no lunge, no bite — it does not sell the bite. At 256px
  the arms read LONG and THIN, paddle/blade-like, vs the 2D sheet's
  short stubby clawed arms. This is a proportion disagreement, not
  just a subtle clip. Distinct from NME-6 (which is about the 512px
  side previews); this is the front strip itself.
- Decision needed: keep the arms-wide front attack, or does the bite
  need the side preview / a re-posed front attack — and do the long
  arms need shortening to the 2D proportion?
- If keep: the strip stands. If re-pose: the front attack is re-posed
  (and/or shortened) as a new edit; the side previews are judged
  under NME-6 separately.
- VISUAL (verified on disk):
  - sprites-bake/sheets-rigged/gabu/gabu_attack_front_strip.png

## 8. NME-10 — Lane-wide faint call (Gabu slump vs Dorowani prone)

- What it is: the two creatures' rigged faint clips do not share one
  faint language. Gabu's final frame is a tilted slump (head bowed,
  arms out — reads as dizzy/leaning, not fainted). Dorowani's final
  frame is fully on its side (reads unambiguously as fainted). One
  lane-wide call is needed, not two per-creature fixes.
- Decision needed: should faint = fully prone (Dorowani way) for both,
  or slump (Gabu way) for both, or is per-creature faint acceptable?
- If one language is picked: the other creature's faint is re-baked
  to match; the picked one stands. If per-creature is acceptable:
  both stand and the difference is recorded as intentional.
- Note: this is about the RIGGED faint clips. The 2D-sourced sheets
  have NO faint at all (gap, both creatures — see entry 11 note and
  the gap list); a faint call here does not create 2D faint art.
- VISUALS (verified on disk):
  - sprites-bake/sheets-rigged/gabu/gabu_faint_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_faint_front_strip.png

## 9. 2D-vs-3D sheets pick for Dorowani + Gabu

- What it is: two complete sheet sets for the same two creatures. The
  3D-bake set: PNG renders from Tripo GLB rigs (labeled as 3D-bake,
  NOT hand-drawn 2D). The 2D-sourced set: strips built byte-verbatim
  from the locked 2D front-facing sheets + confirmed walkfix sets,
  then cleaned (2,523 px of leg-gap whites, ground shadows, and grid
  artifacts removed alpha-only) and saved as use-these new edits;
  the uncleaned originals are marked DO NOT USE.
- History: Mars (2026-10-27 ~07:17 CDT) said the 3D-based sheets are
  cool and interesting and to keep improving them, but they look a
  little hand-tooled and need a lot more improvement — and asked why
  the other front-facing 2D sheets weren't used to make things from.
  The 2D set was built on that order; the 3D set keeps its face-
  mapping flag (Gabu) and its eye-check flags (NME-7..10).
- Decision needed: for Dorowani and Gabu, which set is the reference
  going forward — 2D-sourced, 3D-bake, or both kept for different
  uses (e.g. 2D in game path, 3D as staging art)? Note the standing
  rule: NO 3D renders in the game path — 2D sheets, sprites, GIFs
  only — so a 3D pick would be art-reference only unless Mars lifts
  that rule explicitly.
- If 2D: the cleaned use-these 2D set becomes the reference and the
  3D set stays labeled staging art. If 3D: the 3D set (after its
  flags are fixed) becomes the reference and the 2D set stays as the
  game-path fallback. If both: each set's role is written down so
  no agent mixes them again.
- Structural difference to state when showing: the 2D set has NO
  faint (gap, both creatures — no 2D faint cell exists) and its
  ready/hit strips are single-frame; the 3D set has full faint
  clips but carries the NME-7..10 flags. Neither set has a back
  view (see entry 11).
- VISUALS — 2D cleaned use-these strips (verified on disk):
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_idle_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_walk_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_walk_side_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_ready_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_attack_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/dorowani/dorowani_hit_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_idle_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_walk_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_walk_side_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_ready_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_attack_front_strip_2d-use-these-new-edit.png
  - sprites-bake/sheets-2d-20261027-0731-use-these-new-edit/gabu/gabu_hit_front_strip_2d-use-these-new-edit.png
- VISUALS — 3D-bake strips (verified on disk):
  - sprites-bake/sheets-rigged/dorowani/dorowani_idle_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_walk_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_walk_side_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_ready_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_attack_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_hit_front_strip.png
  - sprites-bake/sheets-rigged/dorowani/dorowani_faint_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_idle_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_walk_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_walk_side_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_ready_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_attack_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_hit_front_strip.png
  - sprites-bake/sheets-rigged/gabu/gabu_faint_front_strip.png

## 10. Pass1-vs-2c re-bake question (Gabu bake source)

- What it is: the Gabu 3D-bake set (31 renders) was baked from the
  pass1 GLB, not from the v2-fixed final GLB (2c). Dorowani's bake is
  from its fixed rig; Gabu's is not.
- History: Gabu's 3D re-rig paused at iteration 6; the v2-fixed GLB
  exists as the newer rig, but the delivered bake set was never
  re-baked from it. Re-baking would change every Gabu bake frame.
- Decision needed: re-bake the Gabu set from the v2-fixed (2c) GLB,
  or keep the pass1-based set and fix only what is flagged (hands/
  fingers, face mapping)?
- If re-bake: all 31 Gabu renders + 7 strips + 28 cells are rebuilt
  from 2c and re-eye-checked as a new version; the pass1 set stays
  staged marked superseded. If keep pass1: only the flagged frames
  are fixed (the hand/finger work already running) and 2c is not
  adopted for the bake.
- No visual of its own: the choice is between two rig sources; the
  current pass1 output is the 3D strips in entry 9. A 2c bake has no
  frames to show until it is run.

## 11. Dorowani + Gabu back-view gap (unfillable without an order)

- What it is: neither creature has a back view in the 2D-sourced set
  or the 3D-bake set. No back view was ever invented by mirroring —
  mirroring a front into a "back" would be fake art, and the lane
  refuses it by rule.
- Decision needed: order a back-view construction (new art, from the
  2D sheets' side/back language or a new rig pose), accept the gap
  (front/side only for these two creatures), or leave it open while
  the rest of the lane closes.
- If ordered: back views are built as new dated art and eye-checked
  before any wiring. If accepted: the gap is recorded as a known,
  accepted limitation — 2/51 sets without backs in the Dorowani/Gabu
  sheet families (the other 49 sets' backs are covered by the
  trueback/pick-A work, shipped PR #267/#268).
- No visual: the gap is an absence. The side strips in entry 9 are
  the closest existing views and must not be presented as backs.

## 12. Local staging atlas sync 0/140 (post-PR #188 divergence)

- What it is: PR #188 replaced 140 leg-gap cells on main. The local
  staging atlas was NEVER synced after that merge, so local cells can
  still hold stale pre-purge pixels while main is correct. The sync
  is 0/140 = 0%.
- History: held as a separate decision (not bundled into the purge
  PR) because syncing overwrites local staging cells with main's
  versions — safe for main, but it destroys the local pre-purge
  comparison copies agents have been using.
- Decision needed: sync the local staging atlas from main now
  (140/140), or keep the local staging copies divergent deliberately
  (and accept that any future local build from staging can re
...[truncated 3000 chars]
# PART 2 — COMPACT ENTRIES (decision needed, shorter form)

## 15. Orphan atlas cells — keep or drop (10 files)

- What: atlas cells beyond the locked sets with no locked role:
  manticlaw cell_16, tiidebiite cells 15–22, tyrage cell_19.
  (Counts: 1 + 8 + 1 = 10 files.)
- History: carried since the 2026-10-26 checklist as keep/drop. They
  exist on disk; whether any locked manifest references them is the
  check that decides whether they are truly orphaned.
- Decision needed: keep them (assign roles or keep as spares) or drop
  them from the atlas set. Dropping is a deletion and needs Mars's
  explicit word for those exact files — it is NOT covered by any
  standing approval.
- Files verified on disk, and confirmed TRUE orphans by locked-manifest
  reference check: manticlaw's locked manifest references cell_00–15
  only (cell_16 unreferenced); tiidebiite's references cell_00–14 only
  (cells 15–22 unreferenced); tyrage's references cell_00–18 only
  (cell_19 unreferenced). 10/10 files exist and 0/10 are referenced by
  any locked manifest.
  - sprite-art/atlases/manticlaw/manticlaw_cell_16.png
  - sprite-art/atlases/tiidebiite/tiidebiite_cell_15.png through
    tiidebiite_cell_22.png
  - sprite-art/atlases/tyrage/tyrage_cell_19.png

## 16. Shadowfree files — ship or no-ship (22 files)

- What: 22 shadowfree variant files built during cleanup passes.
- History: carried as ship/no-ship since 2026-10-26; the working
  default recorded in-lane is NO (shadowfree variants stay staged,
  the standard cells ship).
- Decision needed: confirm the default (do not ship shadowfree
  variants) or order them shipped for named creatures.
- If confirmed no: the 22 files stay staged, marked not-for-ship,
  and the entry closes. If ship: the named files ship as their own
  small PR. No visual: this is a policy call, not a look.

## 17. Derived icons — approval for 10 head-crop icons

- What: party/menu icons exist for 51/51 sets, but only 41/51 are
  Mars-approved; the remaining 10 are derived head-crops (cut from
  atlas cells rather than atlas-cell icons) and still await his eye.
- History: from the 2026-10-26 gap audit (icons 51/51 existence =
  100%, approved 41/51 = 80%). Composition of the 51 verified by
  pixel comparison (2026-10-27): 40 atlas-cell icons + 10 derived
  head-crop icons + 1 game-ready-only icon = 51, no ambiguous cases.
  The 4 two-file icons dirs (finblade, mechapion, mothrix, punchkid)
  hold standard + _clean variants — those are NOT the head-crops.
- The 10 head-crop-derived icons (each reconstructs byte-exact,
  4,096/4,096 pixels, from a locked battle_front cell head crop;
  crop boxes in 64px cell coordinates, resized to 64×64):
  - sprite-art/game-ready/aerobeak/icons/aerobeak_icon64.png (aerobeak cell_00, box 10,0,54,38)
  - sprite-art/game-ready/ashemit/icons/ashemit_icon64.png (ashemit cell_00, box 12,0,52,34)
  - sprite-art/game-ready/cragarm/icons/cragarm_icon64.png (cragarm cell_00, box 18,0,46,30)
  - sprite-art/game-ready/gearkid/icons/gearkid_icon64.png (gearkid cell_02, box 12,0,52,32)
  - sprite-art/game-ready/kittember/icons/kittember_icon64.png (kittember cell_02, box 14,0,50,32)
  - sprite-art/game-ready/megalochrome/icons/megalochrome_icon64.png (megalochrome cell_02, box 5,10,45,55)
  - sprite-art/game-ready/shellguard/icons/shellguard_icon64.png (shellguard cell_01, box 18,0,46,34)
  - sprite-art/game-ready/squirmite/icons/squirmite_icon64.png (squirmite cell_01, box 14,0,50,28)
  - sprite-art/game-ready/terrapod/icons/terrapod_icon64.png (terrapod cell_01, box 16,0,48,32)
  - sprite-art/game-ready/toxitacle/icons/toxitacle_icon64.png (toxitacle cell_05, box 10,0,54,36)
- The 1 game-ready-only icon: sprite-art/game-ready/strikechamp_unsuited_full/icons/strikechamp_unsuited_full_icon64.png
  — no locked atlas exists for the 51st look, so it matches no atlas
  cell; it is byte-exact against its own game-ready cell_06, not
  newly invented art.
- Decision needed: approve the 10 derived head-crop icons, or order
  replacements for named ones.
- If approved: icons become 51/51 approved. If not: the named icons
  are rebuilt from atlas cells. All 10 visuals are listed above.

## 18. Aquariios idle — hover vs swim (holds its 1800ms)

- What: Aquariios's idle loop timing/pose is on hold: hover or swim?
  The loop exists (idle_a/b/c) and its timing reconciliation left
  Aquariios as the single hold (47 keep / 3 adjust-at-wiring / 1 hold).
- Decision needed: hover presentation or swim presentation for the
  idle loop.
- If picked: the loop is timed/posed that way and the hold clears.
  (This is a Mochiichao presentation choice, not derivable from
  Pokemon code — Pokemon has no per-creature idle of this kind.)
- Files (verified on disk):
  - sprite-art/animation/idle/aquariios/idle_a.png, idle_b.png,
    idle_c.png; sprite-art/animation/idle/aquariios/aquariios.idle.json

## 19. Flinch echo in sparring — 150–250ms or standing fallback

- What: whether sparring flinch carries a 150–250ms echo effect, or
  keeps the standing-only fallback (flag + skipped turn, Pokemon's
  own flinch behavior).
- History: carried since 2026-10-26; Pokemon code has no flinch-echo
  timing to fill from, so this is a Mochiichao-only design choice
  under the fill-from-source rule.
- Decision needed: approve a 150–250ms echo (and pick the value), or
  keep the standing fallback.
- If echo: the sparring treatment is wired with the picked value. If
  fallback: the entry closes with no code change. No visual: timing
  call, judged in motion when wired.

## 20. Dorowani (#147) + Gabu (#148) base stats / elements / evolutions

- What: the two original creatures' combat numbers and lines. This
  is confirmed as genuinely needs-input: no source file contains
  them (they are original Gen-2-era creatures, not convertible from
  any Pokemon species), and the world-builder lane's 2026-10-27 audit
  independently records the same three truly-needs-word items for
  its lane, including these stats.
- History: Western Heart Dorowani exists, but its combat numbers
  were explicitly NOT imported (backstory only). Gabu was a Dorowani
  alternate attire in Western Heart; in Mochiichao he is his own
  creature (#148), so no Western Heart stat line transfers either.
- Decision needed: base stats (HP/Atk/Def/SpA/SpD/Spe or the
  Mochiichao equivalent), True elements, and evolution lines for
  both creatures — or a direction (e.g. "derive from role") that a
  worker can execute without further questions.
- If given: species data is written and wired; the game stops
  treating 147/148 as stat-less. If deferred: 147/148 stay
  art-complete but stat-less, and any wiring needing their numbers
  stays held. No visual: numbers call.

---

## 21. (ADDENDUM) 51st-look remaining 5 labels — direction known, index not

- What: strikechamp_unsuited_full locked-manifest cells 09, 10, 11,
  13, 16 carry direction labels contradicted by eye-mapping (09
  walk_front_1 reads BACK; 10 walk_back_0 reads FRONT; 11 walk_side_1
  reads FRONT; 13 walk_side_2 reads FRONT; 16 walk_back_2 reads FRONT),
  but the documentation determines direction only, not an exact
  indexed label — and direction-word swaps collide with existing true
  labels (walk_back_1 held by true-back cell 12; walk_front_0/2 by
  true-front cells 08/14).
- History: found during the PR #291 ship; the one clean swap (cells
  03/04) shipped in PR #291; these 5 were deliberately left untouched
  rather than inventing indices.
- Decision needed: a relabeling rule (e.g. allow suffix
  disambiguation, renumber the walk series, or accept the
  direction-word labels as-is with a note) — or Mars's direct call
  per cell.
- If a rule is given: the 5 labels are corrected under that rule and
  shipped as a manifest-only fix. If accepted as-is: the mismatch is
  annotated in the manifest and the entry closes.
- Visuals: the cells live in sprite-art/game-ready/strikechamp_unsuited_full/
  (cells 09/10/11/13/16) — the parent attaches the specific cells if
  Mars wants to see them; no new visual was built for this entry.

---

# APPENDIX A — TITLE-ART ITEMS STAGED IN THIS LANE'S FILE
(Title lane's domain — included so nothing is lost; the parent routes
these to the title lane if they do not belong here.)

## NME-1 — Starter trio I2: Razorgater reads more robotic/armoured
- Question: does Razorgater still read as Razorgater, or is the
  armour too robotic vs its 2D-sheet design? If too robotic, I2 is
  regenerated (new filename, never overwrite).
- VISUAL (verified on disk): sprite-art/title/intro-frame-02-starter-trio-v1.png

## NME-2 — Faceoff I3: Dorowani blue eyes vs red eyes
- Question: blue eyes (matching Dorowani's angles sheets) or red
  eyes (matching its main sheet) — which is canon? The pick locks
  eye colour for title art going forward. Note the canon eye
  structure measured from the full-res source sheet: vertical oval,
  dark outline, DEEP RED outer, BLACK vertical pupil, small WHITE
  highlight at top — the red-eye side has the measured evidence.
- VISUAL (verified on disk): sprite-art/title/intro-frame-03-dorowani-gabu-faceoff-v1.png

## NME-3 — Key art v2: eye colours across five creatures
- Question: in this frame Dorowani's eyes read dark and Tyrage's
  read red — confirm both against canon, or flag which creature's
  eyes need correcting in a v3 (new filename). v1 is NOT presented
  (it had Tyrage missing / Gabu duplicated; v2 fixed that).
- VISUAL (verified on disk): sprite-art/title/title-bg-key-art-v2.png

## NME-4 — Silhouette reveal I4: cream rectangle seam — likely closed by v4
- Question as staged: the colour side keeps the cream background
  rectangle from the S1 source crop, so the two sides do not share
  one ground — acceptable, or re-composite onto the same pale
  ground? BUT newer versions exist (v2-no-cream, v3, v4-gradient),
  and the lane checklist records "silhouette v4 (clean)" — so this
  entry may already be closed by v4 and only needs Mars to confirm
  v4 is the one.
- VISUALS (verified on disk):
  - sprite-art/title/intro-frame-04-silhouette-reveal-mochii-v1.png (seam)
  - sprite-art/title/intro-frame-04-silhouette-reveal-mochii-v4-gradient-2026-10-25.png (clean)
- Contact sheet (verified): sprite-art/needs-mars-eyes-2026-10-25/title_judgment_contact.png (NME-1..4 in one 2×2 sheet)

---

# APPENDIX B — CHECKED, RESOLVED OR SUPERSEDED (NOT in the dossier)

- Player angle 30° — CONFIRMED 2026-10-27 (BW2 code = exactly 30.0°,
  pokebw2/src/ov168/). 45° aimfix (PR #263) SUPERSEDED for the player
  side; stays on main marked superseded, never deleted. Ship in flight.
- Dorowani hurt FIXED + cleaned sets A–D — CONFIRMED 2026-10-27;
  packaged as use-these new edits (27 media), old versions marked
  DO NOT USE, 0 deletions; LIKENESS marked NOT-PICKED. Ship in flight.
- Overworld walk manifests 51/51 — PR #284 merged 7d5f2002, incl. the
  3 dangling right-stand fix (krakenox, punchkid, reaperdile).
- Opponent code-true 204/204 — CONFIRMED 2026-10-27; art ship in flight.
- Player aimfix 45° — see player angle above (superseded, not deleted).
- 2D sheets white/shadow cleanup — DONE 2026-10-27-0731 (2,523 px net
  removed, 34 cells + 12 strips, old 48 files marked DO NOT USE, 0
  deletions, pass-8 reverted). Ship in flight.
- Gabu GIF ghosting — FIXED (disposal=2 rebuild, 0 ghost pixels);
  Mars confirmed the fixed GIFs "really good" except the finger
  stretch, which is a separate rig item (in flight, entry 14 note).
- Walk-gate — RESOLVED: walk from BOTH sources (Mars ~18:29 CDT
  2026-10-26), activated PR #242. Not a decision anymore.
- Mechapion battle_back — RESOLVED: the gap audit's "string-only, NO
  role" is stale; Mechapion got a generated true back in the 10/10
  trueback set, confirmed with the rest, shipped PR #267.
- Finblade front-face redraw — SUPERSEDED: Batch B front rebuilds
  (stormtalon + finblade) were built from TRUE FRONT cells and
  APPROVED ~18:25 CDT 2026-10-26; they are the canonical Batch B
  versions. The old back-reading originals are staged superseded.
- Pebblefist HP — RESOLVED: 40, confirmed by Mars.
- Beast / Flora / Neon elements — RESOLVED by the locked True list
  (Beast = Normal, Flora = Grass, Neon = Electric, 19 total).
- Wispkin — perfect as-is, confirmed; its smoke/mask whites are
  design whites, never cut.
- Kittember glow v1 — SHIPPED PR #219 and stands unless entry 2
  swaps it (the swap itself is the open decision, not v1's validity).
- Shiny system — RESOLVED by LUSTRE (510/510, PR #269); the gap
  audit's "shiny 0/51" is stale.
- Footprints — RESOLVED 51/51, PR #237; the gap audit's "0/51" is stale.
- Cries — v1 gate + v1/r1 rotation shipped (PR #232); manifest on main
  (PR #243). Mars picks v1-vs-r1 later; not a lane blocker.
- S2 starter wording — NOT this lane's: starter presentation wording
  belongs to the title lane; noted here only so it is not lost.
- True chart / Deep matchups — NOT this lane's: other lane's judgment
  (Deep 4 answers + Gen 5 vs Gen 6 modernize call); the fill-from-
  source rule explicitly keeps Deep/new-element values as needs-input
  there. Not counted in this lane's 20.
- Dorowani hurt + 2D cleaned use-these — SHIPPED PR #291 (merge
  ae1d97e3, 91 files, 0 deletions): hurt package 30 files (23 PNG +
  4 GIF + manifest + readme + script), 2D cleaned 57 files (34 cells
  + 12 strips + manifests + report + counts + label + scripts),
  sweep narrative + aim manifest (204 records, sole-sourced from the
  code-true manifest/report).
- Shellguard frame_count — RESOLVED as NOT a number fix: 13 cells on
  main, frame_count=13 correct; the 14th frames entry is icon_derived
  (the icon), not a cell. A definitional annotation marking the icon
  entry is owed, not a renumber.
- 51st-look labels — PARTIALLY FIXED in PR #291: cells 03/04 swapped
  (overworld_front↔overworld_back, eye-verified); 5 cells left
  untouched with reason — see Addendum 21.
- Phone check / deploy / playtest — LAST globally (after all lanes
  finish + Mars's deploy decision). Never claimed, never scheduled
  from this lane.

---

# APPENDIX C — IN FLIGHT (workers running, NOT decisions)

- Opponent code-true art ship (204 sets, 1,122 cells, 408 GIFs).
- BW2 30° player ship (204 sets, 1,122 cells).
- Gabu hand/finger rig-weight fix + re-send of hand-moving GIFs.
- Rename-all + animate-all coordinator (phase 1 = full rename list
  for Mars's veto; TM/HM first; staged only, no PR until confirmed).
- Phase 1 ship: DONE — PR #291 MERGED ae1d97e3 (91 files: 89 added,
  2 modified, 0 deletions): Dorowani hurt package (30 files) + 2D
  cleaned sheets (57 files) + sweep docs (2 files) + hurt-json fix +
  2 51st-look labels. Merged ≠ live until Pages rebuild + playtest.
- Body-part origins derivation (Mars order 2026-10-27 ~07:46 CDT):
  DELIVERED STAGED — 492/560 = 87.9% derived, 68/560 indeterminate
  (see lane-math note); staged table only, game-code landing still
  gated on rebuild + playtest.
- Show-and-tell cron (10-minute lane reporter).

Dossier file: sprite-art/MARS-WORD-DOSSIER-20261027.md (this file).
Counts in this dossier: 14 full + 7 compact = 21 decisions; 4 appendix-A
title items; 23 appendix-B resolved/superseded lines; 5 in-flight items;
1 delivered-staged derivation (origins 492/560); 1 shipped this job (PR #291).
