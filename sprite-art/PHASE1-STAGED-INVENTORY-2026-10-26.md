# FINISH-FIRST PHASE 1 — Staged-but-unshipped sweep (2026-10-26)

Mars order 2026-10-26 ~14:09 CDT: everything finished BEFORE any playtest.
This file is Phase 1 only: inventory + documentary-only shipping. No art
verdict is made here, no game wiring, no deletion, no Pages deploy.

Sprite art root (local, never pushed from directly):
`~/workspace/mochiichao-work/sprite-art/`
Repo mirror root on main: `sprite-art/`
Live main head at check time: `dfffd01027d2035045aa08e778d7c40e2851762c`
(PR #184 merged; open PRs at check: 9 — 167, 157, 155, 154, 153, 98, 96, 92, 61)

## Inventory — staged-but-unshipped items

| # | Item | On disk (local) | On main? | Phase 1 disposition |
|---|---|---|---|---|
| 1 | lane100 assignment table | 51 per-creature JSONs + ASSIGNMENT-COVERAGE.md + ASSIGNMENT-COVERAGE.json + UNMAPPED.json + build_lane100.py; 51/51 creatures fully mapped to 4 attack slots = 100%; 454/563 union moves routed = 81%; 109 fallback unmapped; 54 category-disagreement moves flagged | NO — `sprite-art/animation/expanded-scope/lane100/` on main holds only `silhouettes/` | SHIPPED (summary docs only, this PR): coverage MD + coverage JSON + UNMAPPED.json. Per-creature JSONs STAY STAGED — bulk routing data with 54 flagged disagreements unresolved, for Mars/lane review, not silently landed |
| 2 | lane100 footprints (old set) | 51/51 PNGs + manifest + contact_sheet_51.png; FULL-BODY SILHOUETTES, not foot traces | NO | STAGED, SUPERSEDED — Mars 2026-10-26 ~12:33 CDT: these are now the pre-discovery silhouette set. Never shipped as footprints, never overwritten |
| 3 | footprints-real | 37/51 footprints = 73% (37 PNGs, 16x16 mode 1, foot-traced); 14/51 no-footprint with reasons = 27%; + contact_sheet_51.png + manifest + note + work/ builders; 41 files in dir | NO (404 on main) | SHIPPED (paper only, this PR): FOOTPRINT-MANIFEST.json + FOOTPRINT-NOTE.md. The 37 PNGs + contact sheet STAY STAGED — new derived art Mars has not seen yet; manifest ships so the derivation is on record without implying art approval |
| 4 | shiny (old set) | 51/51 fronts + palettes + swatches (153 files) + SHINY-SYSTEM.md + SUPERSEDED-20261026.md | NO | STAGED, SUPERSEDED by shiny-v2. Do not ship old |
| 5 | shiny-v2 | 51/51 fronts + palettes + swatches = 100% (153 files) + SHINY-FRESHNESS-AUDIT.md + SOURCE-LINEAGE.json + check_freshness.py + build_shiny_fresh.py | NO | GATED — shiny approval owed. NOTHING shipped, not even the freshness audit doc (tied to the approval). Mars judges the 51 in Phase 2 |
| 6 | articulation-batch-b | 15/15 creatures, 30/30 GIFs (all non-empty), 999 files total, 15 manifests + 15 verification notes | NO (404 on main) | GATED — Batch B verdict owed. NOTHING shipped. Phase 2 readiness confirmed below |
| 7 | articulation-pipev3-wide4 (Razorgater take-4) | 22 cells (5+5+6+6 across 4 sets) + 4 mouthzoom + 4 full4x + 1 GIF (22 frames, 64x64) + manifest + verification + 2 builders; 35 files excl. __pycache__ | NO (404 on main) | GATED — Razorgater take-4 verdict owed. NOTHING shipped. Take-2 (wide2) and take-3 (wide3) are failed checkpoints, also staged, NOT presented as fixes |
| 8 | pivot-2d-20261026 | 16 files local: 2 MDs + manifest + 6 dorowani + 6 gabu + 1 leg-gap show sheet | YES, 15/16 — main already holds the 2 MDs, manifest, and 6+6 dorowani/gabu files | ALREADY SHIPPED (prior PR). Only staged extra: `leg-gap-showfirst-20261026.png` — GATED with leg-gap, held |
| 9 | leg-gap audit / confirm dirs | Audit reports x2 (root SPRITE-GAP-AUDIT 13,467 bytes vs expanded-scope LEG-GAP-AUDIT 7,903 bytes — they DIFFER, not copies); confirm/ 19 files (CONFIRM-NOTES.md + 17 creature confirms + combined_contact_sheet.png); replacements/ 146 PNGs across 19 creatures; show-sheets/ 32 files; show-sheets-final/ 20 sheets covering 160 cells; audited universe 1,817 files; actionable 160 cells / 20 creatures | NO (404 on main for the audit dir) | GATED — leg-gap DELETION waits on Mars seeing the show sheets; a separate worker is already running leg-gap work. NOT TOUCHED, NOT SHIPPED by this PR. Count flag: lane log claims staged replacements 137/160 = 86%, but replacements/ holds 146 PNGs — a 9-file gap, unexplained here, left for the leg-gap worker (not resolved by guessing) |
| 10 | walk-frames | 547 files (WALK-INDEX.md, WALK-STAGE-BATCH-2026-10-26.md, NEEDS-MARS-EYES.md, per-creature dirs) | Partial (walk-frames/ exists on main from earlier work) | GATED — walk-gate owed. NOT touched in Phase 1 |
| 11 | Other staged dirs noted, untouched | articulation-batch-a-retrofit, articulation-batch-cd, articulation-pipev3 (on main in part), articulation-pipev2, articulation-v2-rework(-v3), articulation-v3-impact, stage-pr-*, stage-show-*, show-first-2026-10-25, battle-backgrounds-v3, garden-poses, etc. | Mixed | OUT OF SCOPE for Phase 1 — listed only so they are not mistaken for shipped or deleted. Nothing in them was moved, edited, or PR'd here |

## What this PR ships (6 files added, 0 modified, 0 deleted)

- `sprite-art/PHASE1-STAGED-INVENTORY-2026-10-26.md` (this file)
- `sprite-art/animation/expanded-scope/lane100/assignment/ASSIGNMENT-COVERAGE.md`
- `sprite-art/animation/expanded-scope/lane100/assignment/ASSIGNMENT-COVERAGE.json`
- `sprite-art/animation/expanded-scope/lane100/assignment/UNMAPPED.json`
- `sprite-art/animation/expanded-scope/footprints-real/FOOTPRINT-MANIFEST.json`
- `sprite-art/animation/expanded-scope/footprints-real/FOOTPRINT-NOTE.md`

All six are documentary only: a routing-table summary (with its 109
unmapped + 54 disagreements stated, not hidden), a footprint-derivation
manifest + note, and this inventory. No PNG/GIF art, no game code, no
wiring, no deletion, no rename of anything Mars has seen. The footprint
manifest verbatim contains local `/home/hatch/...` source paths as
provenance; that is the staged record, not a repo path claim.

## What stays owed (Mars-gated, percentages with counts)

- Batch B verdict — 15/15 creatures, 30/30 GIFs staged, 0/30 judged = 0%
- Razorgater take-4 verdict — 1/1 GIF + 22/22 cells staged, 0 judged = 0%
- Shiny approval — 51/51 shiny-v2 fronts staged, 0/51 approved = 0%
- Walk-gate — 547 walk-frame files staged, gate not passed
- Dorowani V3 mouths — pivot files on main, V3 mouth decision still owed
- Kittember glow wiring — not wired, owed
- Pages deploy — live Pages still stale vs main at last check (bb24f5a); deploy owed, NOT done here
- Bake PNG deletion — owed, NOT done here (0 deletions in this PR)
- Leg-gap deletion — 137/160 claimed staged (86%) / 146 PNGs on disk; deletion waits on Mars seeing the 20 show sheets; separate worker owns it
- Per-creature lane100 assignment JSONs — 0/51 shipped, staged for review
- Footprint PNG art — 0/37 shipped, staged for Mars's eyes
- Shiny-v2 audit doc + lineage — held with the shiny set, not shipped ahead of approval

## Phase 2 readiness confirmation (verified on disk 2026-10-26)

### articulation-batch-b — 15 creatures, 30 GIFs, all present and non-empty

Local root:
`~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/articulation-batch-b/`

Creatures (15): aerobeak, cocoonode, duneclaw, finblade, manticlaw,
megalochrome, mothrix, oblivirex, pupbble, pyropaw, quakehound,
squirmite, stormtalon, terradog, zephling — 2 GIFs each (attacks + hurts),
15 manifests + 15 verification notes, 999 files total in the batch dir.

GIF paths (attacks 23 frames + hurts 14 frames each, 256x256, spot-checked
aerobeak + zephling; all 30 non-empty, sizes 90,492–331,049 bytes):

- articulation-batch-b/aerobeak/aerobeak-attacks-articb20261026.gif
- articulation-batch-b/aerobeak/aerobeak-hurts-articb20261026.gif
- articulation-batch-b/cocoonode/cocoonode-attacks-articb20261026.gif
- articulation-batch-b/cocoonode/cocoonode-hurts-articb20261026.gif
- articulation-batch-b/duneclaw/duneclaw-attacks-articb20261026.gif
- articulation-batch-b/duneclaw/duneclaw-hurts-articb20261026.gif
- articulation-batch-b/finblade/finblade-attacks-articb20261026.gif
- articulation-batch-b/finblade/finblade-hurts-articb20261026.gif
- articulation-batch-b/manticlaw/manticlaw-attacks-articb20261026.gif
- articulation-batch-b/manticlaw/manticlaw-hurts-articb20261026.gif
- articulation-batch-b/megalochrome/megalochrome-attacks-articb20261026.gif
- articulation-batch-b/megalochrome/megalochrome-hurts-articb20261026.gif
- articulation-batch-b/mothrix/mothrix-attacks-articb20261026.gif
- articulation-batch-b/mothrix/mothrix-hurts-articb20261026.gif
- articulation-batch-b/oblivirex/oblivirex-attacks-articb20261026.gif
- articulation-batch-b/oblivirex/oblivirex-hurts-articb20261026.gif
- articulation-batch-b/pupbble/pupbble-attacks-articb20261026.gif
- articulation-batch-b/pupbble/pupbble-hurts-articb20261026.gif
- articulation-batch-b/pyropaw/pyropaw-attacks-articb20261026.gif
- articulation-batch-b/pyropaw/pyropaw-hurts-articb20261026.gif
- articulation-batch-b/quakehound/quakehound-attacks-articb20261026.gif
- articulation-batch-b/quakehound/quakehound-hurts-articb20261026.gif
- articulation-batch-b/squirmite/squirmite-attacks-articb20261026.gif
- articulation-batch-b/squirmite/squirmite-hurts-articb20261026.gif
- articulation-batch-b/stormtalon/stormtalon-attacks-articb20261026.gif
- articulation-batch-b/stormtalon/stormtalon-hurts-articb20261026.gif
- articulation-batch-b/terradog/terradog-attacks-articb20261026.gif
- articulation-batch-b/terradog/terradog-hurts-articb20261026.gif
- articulation-batch-b/zephling/zephling-attacks-articb20261026.gif
- articulation-batch-b/zephling/zephling-hurts-articb20261026.gif

(All paths under
`sprite-art/animation/expanded-scope/` locally; full local prefix above.)

### articulation-pipev3-wide4 — Razorgater take-4, intact

Local root:
`~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/articulation-pipev3-wide4/`

- articulation-pipev3-wide4/razorgater/razorgater-attacks-artic-pipev3w4-20261026.gif (22 frames, 64x64, 84,091 bytes)
- articulation-pipev3-wide4/razorgater/manifest-artic-pipev3w4-20261026.json
- articulation-pipev3-wide4/razorgater/VERIFICATION-artic-pipev3w4-20261026.md
- articulation-pipev3-wide4/razorgater/razorgater-artic-pipev3w4-20261026-atk_physical_razor_rush-cell-0[0-4].png (5 cells)
- articulation-pipev3-wide4/razorgater/razorgater-artic-pipev3w4-20261026-atk_special_blade_wave-cell-0[0-4].png (5 cells)
- articulation-pipev3-wide4/razorgater/razorgater-artic-pipev3w4-20261026-atk_signature_cross_slash-cell-0[0-5].png (6 cells)
- articulation-pipev3-wide4/razorgater/razorgater-artic-pipev3w4-20261026-atk_heavy_jaw_crash_finisher-cell-0[0-5].png (6 cells)
- articulation-pipev3-wide4/razorgater/razorgater_atk_*_mouthzoom_v2eyes_wide.png (4 files, one per set)
- articulation-pipev3-wide4/razorgater/razorgater_atk_*_full4x_wide4.png (4 files, one per set)
- articulation-pipev3-wide4/build_razorgater_wide4.py + mouth_fit_wide4.py

Take-4 is the ONLY Razorgater rebuild presented for judging; wide2/wide3
failed eye-check and stay as checkpoints, not fixes. No verdict is made
in this file — Mars judges take-4 in Phase 2.

## Rules honoured

Pokemon-first: footprint format follows FireRed's 16x16 mode-1 footprint
slot; assignment routing follows the extracted FireRed + Black 2 move data.
Percentages carry counts throughout. New files only — nothing Mars has
seen was overwritten. 0 deletions. Nothing was pushed from the dirty work
clone; this file reached main only via the Contents API PR named in the
lane log.
