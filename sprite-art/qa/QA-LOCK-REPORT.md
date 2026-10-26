# STEP 6 — QA LOCK + POLISH REPORT (2026-10-25)

Freeze the art. Full QA pass over all 51 sets (49 creatures + 2
Strikechamp variants), plus title art. Lock manifest:
`qa-lock-manifest.json` (built by `qa-lock-build.py`, SHA-256 per file).

## 1. Counts — what was counted, on disk, at lock time

| Category | Locked | Total / notes |
|---|---|---|
| Atlas cells (game-ready cells/) | 878 files | 51/51 sets present; cell counts in manifests UNCHANGED (no manifest edited, no canonical file overwritten) |
| Atlas icons (game-ready icons/) | 51 files | 51/51 derived icon64 crops present |
| Atlas sheets (*_atlas_64_locked.png) | 51 files | 51/51 |
| Idle a/b/c | 153 files | 51/51 sets x 3 frames; timing in manifests unchanged |
| Attack a/b/c/d | 200 files | 50/51 sets x 4 frames; strikechamp_unsuited_full has NO 4-frame set — its 7 extracted cells (cells 21-27) are kept as-is per its attack manifest, so attack coverage is 51/51 in respective forms |
| Hurt cells | 51 files | 51/51 sets x 1 cell, 500 ms hold |
| Walk (complete 8-file sets) | 200 files = 25/51 sets | 25 locked: aquariios, ashemit, cocoonode, dorowani, duneclaw, gabu, gearkid, inklet, kickmaster, kittember, krakenox, manticlaw, mochii, oblivirex, pebblefist, pixilite, punchkid, pyropaw, quakehound, razorgater, reaperdile, shellguard, terradog, terrapod, wispkin. Includes transform-based overworld walks + movement treatments (Ashemit seated shift, Cocoonode pulse, Wispkin hover bob) — file-complete, not redrawn leg walks |
| Walk partial | 11 sets (2-4 files each) | aerobeak, astroleviathan, finblade, floatcalf, megalochrome, mothrix, sproutle (2), squirmite, stormtalon, strikechamp_unsuited (2), zephling |
| Walk none | 15 sets | chromejaww, cragarm, dreadtoise, duskfiend, gorokappa, mechapion, mythar, pupbble, pyromonk, strikechamp, strikechamp_unsuited_full, tiidebiite, toxitacle, tyrage, yogiferno |
| Standalone canonical icons (icons/*_icon_v1.png) | 2 files | megalochrome + shellguard ONLY. The other 49 sets have derived atlas icons (locked above) but no standalone icon art — that is a Step 1/icons-lane gap, not a QA fix (49 new icons cannot be QA'd into existence here) |
| Title finals | 12 files | aeon intro, intro frames 01-03, intro frame 04 v1 AND v2-no-cream (v2 is the PASS version; v1 had the black-rectangle fail and is retained superseded, not locked as presentation), starter S1 x5, title-bg v2. Title-bg v1 is DEFECTIVE (Tyrage missing, Gabu duplicated) and is NOT locked |
| TOTAL locked files (canonical + clean variants) | 1,768 files | 1,598 canonical + 170 *_clean.png variants (see §2) |
| Slots #047-#146 | 0/100 filled | Intentionally unfilled, per Mars 2026-10-25 ~19:30 CDT; excluded from all denominators |

## 2. White-spot auto-check (spot_check.py, open-source Pillow/numpy/OpenCV tool)

Run with `--clean --fail-on-flagged` over game-ready, idle, attack, hurt
(canonical cells only — hurt dirs contain 1600px generation raws that
made a directory-wide run time out; the canonical-cell run took 17 s),
walk frames, and standalone icons. Tool skips `*_clean*` inputs, so
re-runs never stack `_clean_clean` files. Originals are NEVER
overwritten; every cut lands as a NEW `*_clean.png` file.

Run-output counts (observed in-session; the /tmp run logs were lost in
a service-restart /tmp wipe — the durable evidence is the *_clean files
themselves + this manifest's hashes, and flagged items are re-derivable
by re-running spot_check without --clean):
- game-ready: 69 files with auto-cuts, 198 files with flags.
- idle: 36 files with auto-cuts, 46 with flags.
- attack: 48 files with auto-cuts (202 files scanned), 59 with flags.
- hurt (51 canonical cells): 8 files with auto-cuts, 11 with flags.
- walk + standalone icons: 9 files with auto-cuts, 31 with flags.
- Lock manifest clean-variant links: 170 files.

What "clean" means here, honestly: every AUTO-CUTTABLE gated defect the
tool found now has a `*_clean.png` variant (new filename, original
retained). What it does NOT mean: zero flags. Flagged items are the
tool's review queue — mostly `mean-too-dark` / `not-fully-interior`
near-white components that fail Gate A purity/interior criteria, i.e.
design whites and light body parts (Cocoonode crystal, Inklet jar,
Wispkin masks, Zephling bellies, Yogiferno cream, Punchkid tape fists,
teeth/claw highlights) plus Gate C between-limbs loops that the tool
flags rather than cuts. Those flagged files are hash-locked as-is and
listed in the decision/review queue (§4) — they are NOT silently
presented as defect-free, and they are NOT cut by hand (no hand-tooling
rule: only the open-source tool cuts, and only when its gates pass).

SHADOWS-SEPARATE RULE (Mars 2026-10-25 ~20:12 CDT, verified from the
decomp files per SPOT-CHECK-UPGRADE.md): baked soft shadows are NOT
part of the character art; the engine adds shadows as a separate layer.
Gate B (flat ground patch, exact-colour uniqueness) and Gate C
(between-limbs loop) cuts in this run ARE shadow removals under that
rule — e.g. Razorgater idle a/b/c 139px ground blobs, Razorgater
attack ground patches, Reaperdile/Gearkid walk ground patches. The old
"cutting contact shadows would float every character" rationale is
WRONG and is not used anywhere in this report. Razorgater hurt + idle
cleans are APPROVED by Mars (2026-10-25 ~20:11 CDT) and are NOT
re-opened: the between-feet residue question is closed as approved.
All OTHER *_clean variants are tool outputs awaiting adoption eye-check
by the wiring lane (manifests still point at originals); adopting them
is not done silently here.

Title art spot_check: NOT completed. Title finals are 1920px+ full-scene
compositions (near-white sky/cloud/light is design by construction),
and spot_check on them repeatedly exceeded this environment's exec
limits (three attempts killed, including one service restart). Title
files are therefore locked on their lanes' eye-checks + hash (I4 v2
PASS, title-bg v2 PASS, S1 3/3, intro frames pass), NOT on spot_check.
A title spot_check run with a longer window is an owed segment,
recorded here, not claimed.

## 3. Likeness vs canon drafts (CANON-DRAFT-LIKENESSES.md)

Verified from manifests + lane log (no likeness was changed by this QA):
- Wispkin default = V1 sheet source (manifest version
  atlas-from-2d-sheet-v1-locked-v1).
- Strikechamp: suited = default (`strikechamp`); helmeted lower-only =
  regular (`strikechamp_unsuited`, ~60% in the wild per Mars, approximate
  intent, not a locked exact number); no-helmet full = rare shiny
  variant (`strikechamp_unsuited_full`, 7 extracted cells kept).
- Manticlaw normal = hulking tiger (2d-sheets main); the Tripo golem
  bake is a SPECIAL INDIVIDUAL VARIANT ONLY (short spine syndrome),
  never the normal likeness; discarded blue-turtle angles v1 is not canon.
- Dreadtoise v2 = animal body with cannons (hurt manifest confirms v2
  animal body, not superseded mechanical v1).
- Cragarm v2 = grounded (per lane log; atlas manifest version string
  still reads v1-locked — see §4, item 5).
- Punchkid v2 REVISED (big fists, long tape, lean humanoid, red digital
  headband) is the canon draft, Mars-approved 2026-10-25 13:03 CDT; v1
  blocky/robotic sheets are superseded drafts, retained, not canon.

## 4. Drift list (recorded, NOT silently changed) + decision items

Drifts from CANON-DRAFT-LIKENESSES.md, still open, still NOT canon changes:
1. Razorgater #004: red eyes (main) vs blue eyes (angles).
2. Kittember #010: amber eyes (main) vs darker eyes (angles).
3. Punchkid #029 angles: blocky 3D-robot + visor vs main headband +
   blue eyes — main is the draft; angles is drift to correct.
4. Stormtalon #021 / Megalochrome #023 angles: pixel style vs smooth main.
5. Floatcalf #024: main pixel-ish vs angles smooth.
6. Toxitacle #027: eye colour purple (main) vs black/blue (angles/lighting).
7. Hurt/attack style caveats (kept, same class as prior pixel angles):
   Strikechamp hurt pixel style vs smooth atlas; Duskfiend hurt cleaner
   cartoon line vs pixel locked cell; Quakehound hurt from face view
   (locked-atlas battle_front cell_03 is a rear view — manifest notes it);
   Squirmite hurt shows more body segments; Stormtalon lightning /
   Megalochrome swirl larger than locked cells; Inklet lid askew +
   tentacles read outside jar (jar intact); Krakenox red eye hidden by
   squeezed-shut eyes (Razorgater precedent).

QA-found, needs Mars/parent show (staged with paths, never blocking):
8. GEARKID battle_back — Phase A verdict, separate doc:
   `qa/GEARKID-BATTLE-BACK-VERDICT.md`. Cell 3 is FRONT, not a back;
   true back exists only in the angles sheet; extraction + relabel owed.
   Gearkid manifest roles are correct only 8/16 = 50%.
9. Walk partial/none sets (11 + 15, §1) — owed to Step 3/walk lane.
10. Standalone icons 49/51 owed (§1) — owed to icons lane.
11. Title spot_check owed (§2) — needs a longer run window.
12. *_clean adoption eye-check (170 variants) — owed to wiring lane;
    manifests still point at originals.
13. Ring zone name on main: The Ringcade is LOCKED (Mars 2026-10-25
    ~21:18 CDT); the Step 5 report on main (PR #50) still lists retired
    candidates — spec-text PR updating ring-capture-zone-spec.md + that
    report is OWED, not merged, not bundled here (zone spec is the arena
    lane's file). Local Step 5 report already uses The Ringcade.

## 5. Freeze

`qa-lock-manifest.json` freezes 1,768 files by SHA-256. Any later change
to a locked file changes its hash and breaks the manifest — that is the
point. Fixes after this freeze land as NEW filenames (never overwrites
of a shown file), and the manifest is regenerated, not edited in place.
Cell counts in all manifests are unchanged by this QA pass.
