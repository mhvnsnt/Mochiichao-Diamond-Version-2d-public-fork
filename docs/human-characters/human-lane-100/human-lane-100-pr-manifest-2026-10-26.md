# Human lane 100% art — PR manifest (DRAFT ONLY, DO NOT MERGE)

Status: DRAFT PR, staged art only. NOT merged, NOT wired, NOT live.
Base: main `615c59aa7137e46adff9f03b9235ff3adb0bedc6` (PR #230 merged).
Branch: `feature/human-lane-100-art-20261026`.
Additions only: 263 files, 0 deletions, 0 modifications, 0 collisions with main
(verified against the main tree before upload; every target path was absent).

## What this PR ships (on files, staged art)

- Core 280/280: closing delta only — 30 new sheets (6.6 MB) + 18 new
  256x256 atlases + 18 manifests + 18 step-8 JSONs + 8 show sheets.
  Characters: Player B, Player C, Player D, Hex, Aeon, Mochiko,
  Mom Black, Mom East Asian, Mom Latina, Mom White, Dojo Student,
  Garden Keeper, Tech Tinkerer, Shopkeeper, Krix, Syndicate Grunt,
  Liberation Front, Lark (8/8, new character, never anyone else).
- Admin 72/80 in this PR (9 of 10 admins): 54 sheets + 9 atlases +
  9 manifests + 9 show sheets + 9 step-8 JSONs.
  Admins: Voss, Ferren, Marlow, Corvin, Ilsa, Aldous, Mireille,
  Cassian, Soren.
- Dojo/elite 72/72: 36 sheets + 4 shared model sheets (dojo leaders 2,
  elite four 2) + 9 atlases + 9 manifests + 8 individual step-8 JSONs
  + aggregate step-8 JSON + count note. Tetsu has no individual
  step-8 JSON on disk; his entry is in the aggregate file.
  Characters: Tetsu, Kenji, Phantom, Shizuku, Homura, Umi, Gin,
  Hono, Yoru.
- Docs/show: dojo/elite verification doc + JSON, recount doc,
  9 dojo/elite show JPGs, 8 core show sheets.
- Total: 124 webp + 45 png + 73 json + 9 jpg + 8 html + 3 md
  + this manifest = 263 files, ~38.4 MB + this manifest.

## What this PR is NOT (read before merging)

This is a CLEAN CLOSING-DELTA draft, not a full 432-file
consolidation onto main. Main currently holds only 27 blobs under
src/assets/human-characters/in-game-sheets/ (plus 40 design blobs
under named-canon/ and players/). The 432/432 figure is an ON-FILES
step count in staging, and the baseline sheets for the earlier
235 core steps, the dojo/elite baseline, and the admin baseline
are still staged-only in in-game-sheets/ alongside older undated
sheets, duplicates, and sidecars. Shipping all of staging would
mean ~600+ files that cannot be cut cleanly without the parent
first confirming the counting method and a baseline inventory.
This draft therefore ships exactly the verifiable closing delta
(263 files) that brings the on-files count to 424/432 with Tamsen
held. A separate baseline-consolidation decision is still owed
by the parent before anyone can claim 432/432 art is ON MAIN.

## What this PR does NOT ship (held, by design)

- TAMSEN — HELD OUT COMPLETELY. Mars 2026-10-26 ~18:39 CDT did NOT
  confirm Tamsen's look (spelling T-A-M-S-E-N, not Tamsin), ordered it
  scrapped completely and redesigned. A separate redesign worker is
  building the new Tamsen design. NO old Tamsin file is in this PR:
  16 old-Tamsin files on disk (6 sheets, atlas, manifest, show,
  step-8 JSON, 5 generation sidecars) are DO NOT USE / superseded.
  Admin in this PR is therefore 9/10 admins, 72/80 steps; the full
  80/80 lands only when the new Tamsen design is built, shown, and
  confirmed, then shipped as a follow-up.
- Origin Verdict (Mythic candidate) — CONFIRMED by Mars 2026-10-26
  ~18:39 CDT as presented (native MYTHIC, Special, 100 power,
  100 accuracy, PP 10, form-based type, Dragon Claw slot suggestion
  confirmed as presented), but NOT included in this art-only PR.
  It is a code/move change, not art; it belongs in a separate code PR
  that replaces Dragon Claw in Mythar's picked four. Picked Mythar four
  are unchanged by this draft.
- No dialogue, no renames, no team changes, no wiring, no code.
  No file under src/lib/, no humanSheets.ts change, no import change.
  Live wiring of these sheets is 0% until a separate, parent-gated
  wiring pass lands and a Pages rebuild publishes it.
- Generation sidecar JSONs (media-generation metadata with expiring
  CDN URLs) are staged-only and NOT shipped. Step-8 JSONs carry the
  filenames and provenance instead. Builder scripts (core100_*.py,
  admin atlas builders) are staged-only and NOT shipped.
- Three-quarter sets (26/26 on files) are a separate show item, not
  counted in the 432, and not in this PR.

## Eye-check status at draft time (Mars, not worker)

- CONFIRMED as shown 2026-10-26 ~18:39 CDT: core batches 1-8, Lark
  full set, admins Marlow/Corvin/Ilsa/Aldous/Mireille/Cassian/Soren,
  dojo/elite Tetsu/Kenji/Phantom/Shizuku/Homura/Umi/Gin.
- CONFIRMED earlier: Voss + Ferren admin art (2026-10-26 ~18:02 CDT);
  Hono + Yoru sheets + atlases under the 2026-10-26 ~17:40 CDT
  blanket confirmation; Ferry 8/8 locked (17:34 CDT).
- HELD: Tamsen look only (redesign running). Nothing else in this
  PR is awaiting a Mars eye-check at draft time.

## Counting-method caveats (parent-gated, NOT resolved silently)

- Core 45/45 closing steps are a held-count carryover: held step-8
  JSONs mostly name aggregate gaps, not per-step missing lists, so
  the per-character closing lists in the core100 step-8 JSONs are a
  WORKER PLAN, labelled as such in those files. Baseline arithmetic:
  228 checkpoint + 5 finish-report increments + Mochiko back +1 +
  Player A portrait v2 +1 = 235/280; the additive 236 double-counts
  Ferry (already 8/8 in the 228 baseline) and is NOT used.
- Krix/Syndicate inventory discrepancy: battle-back files for Krix
  and Syndicate Grunt already existed on disk while held counts
  still listed a back as owed; the same pattern applies to several
  characters' data + atlas files. This PR follows the recount
  (235 baseline, 45 owed), it does not silently re-inventory.
- Dojo/elite step-8 counts treat battle front as the battle step
  and special as N/A; no separate dojo/elite battle-back sheet file
  exists on disk for these 9 characters. Their atlases are 14 cells.
- Lark flags (recorded, not re-rendered): chest tide-mark renders
  as a wave EMBLEM, not lettered MAINFRAME; model coat has a
  generator hood while world/battle sheets show a collar; walk top
  band rendered 6 figures, atlas uses the bottom band 4 steps only;
  battle back is a true back; no baked shadow; no name in prompts.

## In-flight / clobber check at draft time

- This worker's direct subagents: none running.
- No #210 import/wiring worker was found in this worker's scope or
  in the latest autonomous-continue hidden logs (1830 run lists
  Dorowani/Gabu walk fixes, both-sources walk wiring, pick-A hand
  pass, and a Creature Mode Pages rebuild delegate — none is a
  human-lane #210 import worker). Payload paths are disjoint from
  wiring paths anyway: this PR touches only
  src/assets/human-characters/in-game-sheets/ and
  docs/human-characters/human-lane-100/, never src/lib/human*.ts,
  humanSheets.ts, or any source file a wiring worker would edit.
- If a #210 wiring worker starts while this draft is open, it must
  rebase its file list against this branch before touching any
  sheet path; this draft must not be merged while that worker is
  mid-flight without the parent confirming no overlap.

## Gates run on this draft

- JSON parse: all 73 payload JSONs parse, 0 failures.
- Image magic: all 124 webp files start RIFF/WEBP; all atlas PNGs
  are 256x256 (admin show PNGs are 1600x2290 show sheets, expected,
  not atlases).
- Additions only: 0 target paths existed on main, 0 duplicate repo
  paths in the payload, 0 deletions, 0 modifications.
- Secret scan: payload text files scanned for token/password/secret
  markers (see upload log); generation sidecars with CDN URLs were
  excluded from the payload for this reason.
- Build/lint: NOT claimed for this draft. Payload contains zero
  files in the Vite/tsc build graph (no .ts/.tsx/.js/.css, no
  imports changed), so it cannot break a build by construction, but
  a full npm install + lint + Vite build on the PR head is OWED
  BEFORE ANY MERGE and must be run by the parent/gate worker on a
  fresh clone at the PR head. Mergeable state is checked via the
  GitHub API after draft creation and recorded in the PR body
  update / parent report; this draft must NOT be merged on the
  strength of this manifest alone.

## Merge gate (all must pass before merge is even proposed)

1. PR mergeable = true and mergeable_state = clean.
2. Full build + lint + validate pass on a fresh clone at PR head.
3. Parent confirms the counting-method caveats above.
4. New Tamsen design is built, shown, and confirmed, and shipped
   as a follow-up (on-files count after this PR: 424/432 steps:
   core 280 + dojo/elite 72 + admin 72; Tamsen 8 steps remain).
   Note the distinction in "What this PR is NOT" above: 424/432
   is the on-files count, not an on-main file count.
5. Mars's explicit yes for merge (draft != approval).
