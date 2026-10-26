# CHECKPOINT — PR #35 move-data correction batch (2026-10-25, replacement agent)

Rule applied: segments with checkpoints; a restart resumes here, scope is NOT narrowed.

## Segment 1 — INVENTORY + VERIFY (DONE, 2026-10-25 ~20:27 CDT)
- Partial work found on disk, NOT restarted from zero:
  `~/workspace/mochiichao-work/sprite-art/arena-combat/moveData.js`
  (451,151 bytes, 726 lines, pre-existing from the interrupted agent).
- Verified in a clean /tmp copy (local dir carries a `type: module`
  package.json artifact that breaks require-based tests in place; the
  artifact is NOT part of this PR):
  - 560 moves, order identical to
    `src/lib/generated/decomp_black2_moves.json` (560) by sourceConstant.
  - Field-for-field identical to Black 2 extraction: name, type
    (TYPE_ prefix stripped), category (title-cased: Special/Physical/
    Status), power, accuracy, pp, priority, effect — 0 mismatches.
  - 0 duplicate ids, 0 duplicate names.
  - 0 move names equal to any Black 2 species name (650 named species
    entries); 0 whole-word collisions either.
  - Shapes: lane 325, melee 107, self 81, zone 20, beam 19, dash 6,
    wedge 2. Unmapped to a True Element: 35 (ICE 20 + ROCK 15) — kept
    unmapped, nothing invented.
  - FireRed join nulls (target/makesContact/effectChance): 209 moves
    with no FireRed row — carried as null, labelled.
  - Timing uniform on every move: 250/90/700/1040 ms; frames 15/5/42/62.
  - arenaUses = max(5, round(pp*1.5))*2 on every move.
  - Existing suite baseline in clean dir: 71 pass, 1 skipped, 0 fail
    (arenaCombat + fanMechanics + captureLoop tests; PR #35-era count
    was 55/55, suite has grown since).
- GAPS FOUND (to fix, not drop):
  - (a) `fanMechanics.js movePickScore` reads `m.reachU` (default 99
    when absent); moveData.js carries only `rangeU` — real moves
    would score as infinite-reach. Fix: add `reachU` = `rangeU` per move.
  - (b) `AIM_SHAPES` omits `melee` although 107 moves use shape `melee`.
    Fix: add `melee` to `AIM_SHAPES`.

## Segment 2 — FIX + TESTS (DONE, 2026-10-25 ~20:35 CDT)
- Applied (a): `reachU` = `rangeU` inserted on all 560 entries
  (regex-verified count 560); header comment records the alias.
- Applied (b): `melee` added to `AIM_SHAPES`.
- Added `moveData.test.js` (11 tests): count, lookups, verbatim
  spot checks (Tackle 50/100/35pp, Flamethrower 95/100/15pp,
  Protect priority 4, Swift neverMisses, Tackle != FireRed 35),
  shape/range/reach consistency + shape counts, timing/frames,
  arenaUses formula, element mapping (525 mapped / 35 unmapped),
  FireRed join (351 joined / 209 null), movePickScore reach
  behaviour (Tackle melee collapses at distance 6, Ember lane
  holds; reachU-less entry proves the default-99 bug), kind
  vocabulary. Species cross-check (0/560 collisions) is NOT in
  the test — the species list lives in the repo JSON, not this
  folder — it is recorded in Segment 1 above.
- Full suite re-run in clean /tmp dir: 82 pass, 1 skipped, 0 fail
  (was 71 pass + 1 skipped before this batch; +11 new tests).

## Segment 3 — REPLACEMENTS.md CORRECTION (DONE, 2026-10-25 ~20:45 CDT)
- Correction text drafted at `CORRECTION-SECTION.md` (local staging
  only, NOT a PR file): §2 genericization superseded, real move
  data replaces it, standing rule restated, old→new recorded.
- IMPORTANT for the push step: do NOT upload the local
  REPLACEMENTS.md blindly — the live main copy may carry later
  addenda (e.g. PR #37). The push script fetches the LIVE main
  copy + sha, appends this section only if absent, and uploads
  that merged text via the Contents sha. No earlier section is
  rewritten.

## Segment 4 — GREP VERIFICATION (DONE, 2026-10-25 ~20:50 CDT)
- New files (moveData.js + moveData.test.js): grep for
  pokemon/pokeball/poke ball/.wav/.mp3/.png/cry → ZERO matches.
- Species-name word scan of the full text of both new files
  against all Black 2 species names → [] (zero occurrences).
- `grep -c Mochii|Razorgater` on moveData.js = 2: both are the
  substring inside "Mochiichao" (the game's own name) in header
  comments — not creature names, not game content.
- Sounds/art/dialogue: no audio files, no image files, no cry
  identifiers, no dialogue strings in this PR (code + markdown
  only).

## Segment 5 — GATE-CHECKED PR (DONE, 2026-10-25 ~21:00 CDT)
- Contents API only, branch feature/movedata-correction-1 from
  LIVE main 0c9cff6b19a750914a64aa0f13edee5fe7d5d5e9.
- moveData.js + moveData.test.js NEW paths (tree 404-check passed);
  REPLACEMENTS.md edited via live Contents sha 80e180606255
  (live copy was 5,524 chars — merged text appended, no earlier
  section rewritten).
- Gate: mergeable True, state clean, 3 files, +949 / -0.
  Files: REPLACEMENTS.md modified +80/-0, moveData.js added +738,
  moveData.test.js added +131.
- PR https://github.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/pull/49
  — merged, merge commit 4bf3a6db2fd3ce5e0106a254d4f30e612f293237,
  new main sha identical, all 3 files re-verified PRESENT on new main.
- MEMORY.md append left to parent (subagent memory files read-only);
  exact text is in the final report + lane log entry below.
- NOT shipped in this batch (out of scope, other lanes own them):
  fanMechanics.js / captureLoop.js generic test fixtures (Mochiichao-
  original names Pounce etc. — kept as fixtures, not franchise names);
  True Element unification for ICE/ROCK (35 moves, pending that lane);
  per-move distinct timings (treatments timeline is uniform 1040 ms);
  FireRed rows for the 209 Black-2-only moves (no source row exists).

## Standing rule noted (Mars, 2026-10-25 ~20:41 CDT) — confirmation items
- Anything needing Mars's confirmation must be SHOWN to him first
  (actual image/file/option via the parent) before deciding, and
  confirmation items must NEVER block other work: keep building
  everything else to 100% in parallel; stage the item with its
  file path + preview and keep going.
- Applied to this batch: NO confirmation item is outstanding.
  Nothing in this batch awaits a Mars decision, and nothing was
  paused waiting on one — the batch shipped to 100% (PR #49 merged)
  before this rule arrived. The two flags in the final report
  (MEMORY.md append; wider-scope question) are parent-agent
  actions, not Mars confirmation items, and neither blocks any
  work in this batch. Owed items listed in Segment 5 (ICE/ROCK
  unification, per-move timings, FireRed rows for 209 moves) are
  other lanes' build work, not confirmation items.
