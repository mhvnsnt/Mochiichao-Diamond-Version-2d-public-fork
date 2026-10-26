# REGION 1 BATTLE / WIRING VERIFICATION PACK — STAGED ONLY (Segment 9)

- Date: 2026-10-26 (this staging session; local disk checks only).
- Scope: LOCAL STAGING ONLY. No game `src` edits were made, no PR was pushed,
  `~/workspace/mochiichao-work/fresh-start` was NOT touched, no Blender, no
  Gabu bake / Kaggle work.
- Status line: this pack is a CHECKLIST for a live run. It does NOT claim the
  game is playable from any merge. A live browser / Pages run is still owed
  and is parent-delegated (this lane cannot operate a live browser).
- Percentages use counts everywhere, per standing rule.

## 0. Headline counts (verified on disk this session)

- Attack: 51/51 = 100% creature dirs present, 261 PNGs, 51 manifests + 1 build
  report = 52 JSON in `animation/attack/`. Validator
  `animation/attack/validate_attack.py`: 51 checked, 0 errors.
  0 creatures with 0 PNGs, 0 missing manifests, 0 manifest/PNG reference
  mismatches. See §2 for the verified-vs-claimed split.
- Icons: 51/51 = 100% creature dirs with an `icons/` dir and >= 1 icon file
  in `game-ready/<creature>/icons/` (55 PNGs total: 51 base + 4 `_clean`
  duplicates). 0 creatures missing an icon dir, 0 missing an icon file.
  See §3 for atlas-derived vs head-crop-derived split.
- Gearkid battle_back: LOCKED manifest = FAIL; STAGED true back = PASS as art,
  PROVISIONAL as shipped status (not in any manifest/atlas, not on main).
  Overall Gearkid battle_back verdict: PROVISIONAL — do not ship Gearkid
  battle from the locked manifest. See §1.
- Region 1 roster in this pack: 46/46 sets from `PHASE-A-REGION1-MATRIX.md`
  (see §4). Battle-back verified-correct across Region 1 per that matrix:
  44/46 = 96% (Gearkid BLOCKED, Mechapion POSE ONLY) — that matrix figure is
  cited, not re-verified creature-by-creature in this segment.

## 1. GEARKID battle_back — sheet-resolution verdict (this session)

### 1a. Locked cell: FAIL — it is a FRONT, not a back

- Exact locked cell file: `sprite-art/atlases/gearkid/gearkid_cell_03.png`
  (64x64 RGBA; identical role/file in `game-ready/gearkid/cells/` and in the
  canonical manifest `game-ready-canonical/gearkid/gearkid.manifest.locked.json`,
  frame cell 3, role `battle_back`).
- Locked manifest note (quoted from
  `atlases/gearkid/gearkid.manifest.locked.json`): "PROVISIONAL: eyes visible
  at 64px, key visible; closest back candidate. QA sheet-level says a true
  back exists — re-verify at sheet resolution before shipping battle".
- This session's check (not 64px): cell_03 upscaled 512px NEAREST
  (`/tmp/gearkid-seg9/cell03_512.png`, ephemeral) shows unambiguously FRONT:
  gold gear head, black face visor, TWO bright green glowing eyes, gold body,
  silver fist raised. Pixel evidence: 50 bright-green eye pixels
  (G > 120, G > R+40, G > B+40) out of 1,445 opaque pixels in cell_03.
- Atlas cross-check: locked atlas `atlases/gearkid/gearkid_atlas_64.png`
  (384x192) tile at the manifest position (192, 0) is the nearest match to
  cell_03 of all 18 tiles, but NOT byte-identical: 941/4096 pixels differ
  (next-best tile differs by 1,810). The manifest's position mapping is
  confirmed; a byte-identical atlas==cell claim is NOT made.
- Atlas-file caveat: the locked manifest names
  `gearkid_atlas_64_locked.png`, which does NOT exist in `atlases/gearkid/`
  (that dir holds `gearkid_atlas_64.png` and `gearkid_atlas_64_clean.png`).
  The `_locked.png` name DOES exist in `game-ready/gearkid/` and
  `game-ready-canonical/gearkid/` (both 384x192). Do not cite the atlas dir
  as holding the locked-named file.
- Consequence: shipping Gearkid battle with cell_03 as battle_back would
  show the player a front-facing Gearkid where the back should be. BLOCKED
  on the locked manifest.

### 1b. Staged true back: PASS as art, PROVISIONAL as shipped status

- Exact staged cell file:
  `sprite-art/phase-a-gearkid-back/gearkid_battle_back_true_v1.png` (64x64 RGBA)
  + 512px NEAREST eye-check preview
  `sprite-art/phase-a-gearkid-back/gearkid_battle_back_true_v1_512.png`.
- Source (sheet resolution, verified this session):
  `sprite-art/2d-sheets/gearkid/media-generation-gearkid-angles-0-62830925-e065-4b3c-98ab-98e3804fc776.webp`
  (1920x1280), row 2 column 5, cluster bbox (1317, 363)-(1585, 635) per
  `phase-a-gearkid-back/GEARKID-BACK-RELABEL.md`. The crop re-checked this
  session shows: gear head from behind (gold gear ring, grey centre disc),
  NO face, NO eyes, key rising behind the head, body back with panel, fists
  at sides. Pixel evidence: 0 bright-green eye pixels out of 2,520 opaque
  pixels in the staged cell (vs 50 in cell_03).
- Rejected alternatives (kept for audit, do NOT ship): row 1 column 6 pure
  back was rejected because its cluster chains in a front-face detail-inset
  circle (green eyes); row 2 column 6 back-three-quarter is a valid fallback
  (`gearkid_battle_back_candidate_r2c6_v2.png`).
- Why still PROVISIONAL, not PASS-to-ship: the staged cell is in NO manifest
  and NO atlas yet (locked, game-ready, and canonical manifests all still
  list cell_03 as `battle_back`), and it is not on main. The relabel table
  in `phase-a-gearkid-back/GEARKID-BACK-RELABEL.md` (cell_03 ->
  `battle_front_variant`, plus 9 further role corrections for cells
  00/04/05/08/09/10/11 and the two mirrors) is staged for a PR batch, not
  applied. Until that batch lands, the verdict stays PROVISIONAL.
- Mechapion note (same matrix, separate creature): battle-back is POSE ONLY
  — pose exists as `overworld_back` cell 2 per its lock note, but no frame
  carries the `battle_back` role. No new art needed; role assignment is owed
  in the same PR batch. Do not count Mechapion as a back PASS.

### 1c. Gearkid verdict box

- [ ] Locked cell_03 as battle_back: FAIL (front, green eyes) — do not use.
- [ ] Staged `gearkid_battle_back_true_v1.png` as art: PASS (back, no eyes).
- [ ] Staged cell applied to a manifest/atlas and on main: NOT DONE — owed.
- Overall: PROVISIONAL.

## 2. ATTACK DEEP VERIFY — verified on disk vs merely claimed

### 2a. Reconciliation: lock claim -> staging claim -> this verification

- Lock-time claim (PR #32 index, cited in `animation/attack/ATTACK-INDEX.md`):
  attack extracted 1/51 = 2% (strikechamp_unsuited_full only, 7 cells);
  other 50 sets: status `gap`, files `[]`. That was the lock state; it is
  SUPERSEDED, not current.
- Later staging claim (same index file): attack sets 51/51 = 100% staged
  (50 transform sets x 4 frames = 200 PNGs + 1 extracted set of 7 cells).
- VERIFIED on disk this session (fresh count, not a re-quote):
  51/51 = 100% dirs present; 261 PNGs; 51 manifests; 52 JSON total in the
  `animation/attack/` tree (51 manifests + `_build_attack_report.json`).
  `validate_attack.py`: 51 checked, 0 errors. Every manifest frame reference
  resolves to a file in its own dir: 0 mismatches.
- Composition of the 261 PNGs (so the 261 is not mistaken for 261 attack
  frames): core attack frames 207/261 = 79% (200 transform frames + 7
  extracted cells); `_clean` duplicates 48/261 = 18%; Razorgater proof /
  shadowfree files 6/261 = 2% (four 512x256 proof images + two 128x64
  proof64 images — these are QA artefacts, NOT manifest frames).
  All manifest frames are 64x64; the only non-64x64 attack PNGs are those
  6 Razorgater proof files.
- What is VERIFIED vs what is only CLAIMED:
  - VERIFIED: presence (51/51 dirs, >= 4 PNGs each), manifest presence
    (51/51), manifest<->file consistency (0 mismatches), validator clean
    (51/51, 0 errors), timing fields in every manifest (see §5).
  - VERIFIED LIMIT (honest): 50/51 sets are TRANSFORM frames from each
    creature's own locked `battle_front` cell (manifest method
    `transform_from_locked_battle_front`, status `done_transform`), NOT
    redrawn attack poses. Redrawn poses are a per-creature stage-7 polish
    upgrade per the index file, not a wiring blocker. Do not describe the
    51/51 as "51 redrawn attack animations".
  - NOT verified here: in-game playback (that is §5's live check), and
    elemental VFX by move name (Step 4 scope, separate).

### 2b. Per-creature attack counts (PNGs / JSON manifests / manifest frames)

0 creatures with 0 PNGs. 0 creatures missing a manifest. All 51 manifests
carry 4 frames except strikechamp_unsuited_full (7 frames, extracted).

| Creature | PNGs | JSON | Frames | Method |
|---|---|---|---|---|
| aerobeak | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| aquariios | 4 | 1 | 4 | transform |
| ashemit | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| astroleviathan | 4 | 1 | 4 | transform |
| chromejaww | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| cocoonode | 4 | 1 | 4 | transform |
| cragarm | 4 | 1 | 4 | transform |
| dorowani | 4 | 1 | 4 | transform |
| dreadtoise | 4 | 1 | 4 | transform |
| duneclaw | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| duskfiend | 4 | 1 | 4 | transform |
| finblade | 4 | 1 | 4 | transform |
| floatcalf | 6 | 1 | 4 | transform (4 core + 2 _clean; windup + recover _clean only) |
| gabu | 4 | 1 | 4 | transform |
| gearkid | 4 | 1 | 4 | transform (from locked battle_front cell_02) |
| gorokappa | 4 | 1 | 4 | transform |
| inklet | 4 | 1 | 4 | transform |
| kickmaster | 4 | 1 | 4 | transform |
| kittember | 4 | 1 | 4 | transform |
| krakenox | 4 | 1 | 4 | transform |
| manticlaw | 4 | 1 | 4 | transform |
| mechapion | 4 | 1 | 4 | transform |
| megalochrome | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| mochii | 4 | 1 | 4 | transform |
| mothrix | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| mythar | 4 | 1 | 4 | transform |
| oblivirex | 4 | 1 | 4 | transform |
| pebblefist | 4 | 1 | 4 | transform |
| pixilite | 4 | 1 | 4 | transform |
| punchkid | 4 | 1 | 4 | transform |
| pupbble | 4 | 1 | 4 | transform |
| pyromonk | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| pyropaw | 4 | 1 | 4 | transform |
| quakehound | 4 | 1 | 4 | transform |
| razorgater | 16 | 1 | 4 | transform (4 core + 4 _clean + 8 proof/shadowfree variants*) |
| reaperdile | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| shellguard | 4 | 1 | 4 | transform |
| sproutle | 4 | 1 | 4 | transform |
| squirmite | 4 | 1 | 4 | transform |
| stormtalon | 4 | 1 | 4 | transform |
| strikechamp | 4 | 1 | 4 | transform |
| strikechamp_unsuited | 4 | 1 | 4 | transform |
| strikechamp_unsuited_full | 7 | 1 | 7 | EXTRACTED, kept as-is (cells 21-27) |
| terradog | 4 | 1 | 4 | transform |
| terrapod | 4 | 1 | 4 | transform |
| tiidebiite | 4 | 1 | 4 | transform |
| toxitacle | 4 | 1 | 4 | transform |
| tyrage | 8 | 1 | 4 | transform (4 core + 4 _clean) |
| wispkin | 4 | 1 | 4 | transform |
| yogiferno | 4 | 1 | 4 | transform |
| zephling | 8 | 1 | 4 | transform (4 core + 4 _clean) |

\* Razorgater recount: 16 PNGs = 4 core + 4 _clean + 4 proof/proof_clean +
2 proof64 + 2 shadowfree = 16. The 6 non-64x64 files are the proof/proof64
set; shadowfree files are 64x64. Manifest still references only the 4 core
frames, so there is no manifest mismatch — the extras are QA variants.

- Extra-PNG note: a dir with 8 PNGs is NOT "8 attack frames"; it is 4 frames
  + 4 `_clean` duplicates. Floatcalf (6) is partial-clean only. Any lane
  quoting "261 attack frames" is wrong; the frame count is 207 core
  (200 + 7), and the manifest frame count is 50x4 + 7 = 207.

## 3. ICONS DEEP VERIFY — verified on disk

### 3a. Coverage: 51/51 = 100%, nothing missing

- `game-ready/<creature>/icons/` exists for 51/51 creature dirs, each with
  >= 1 PNG, all 64x64. Total in those dirs: 55 PNGs (51 base + 4 `_clean`).
- Missing-icon-dir creatures: NONE (0/51). Missing-icon-file creatures:
  NONE (0/51). The only `game-ready/` entry without an icons dir is
  `__pycache__`, which is not a creature and is excluded from the count
  (52 entries on disk = 51 creatures + `__pycache__`).
- `_clean` duplicate icons (extra file, not a gap): finblade, mechapion,
  mothrix, punchkid (1 each, 4 total). Base icon still present in all 4.
- Stray icon files outside `game-ready/*/icons/` (not counted in the 51/51,
  listed so they are not double-counted): `dorowani/dorowani_icon64.png`,
  `gabu/gabu_icon64.png`, `dorowani/frames64/menu_icon.png`,
  `icons/megalochrome/*_icon_v1.png` + source generation, and
  `icons/shellguard/*_icon_v1.png` + source generation.

### 3b. Atlas-derived vs head-crop-derived (from locked atlas manifests)

Locked atlas dirs: 50 (atlases/ holds 51 entries = 50 creature dirs +
`_tools`; strikechamp_unsuited_full has NO atlas dir — its icon is
game-ready-only, provenance N/A from the atlas side).

- Atlas-cell icons: 40/51 = 78%. The locked manifest's `icon` frame points
  at an atlas cell (e.g. aquariios cell_10, gabu cell_07, mochii cell_18),
  and the `game-ready/<creature>/icons/<creature>_icon64.png` file is
  BYTE-IDENTICAL to that cell (hash-checked for aquariios, gabu, mochii).
  These are atlas copies, not new crops.
- Head-crop-derived icons: 10/51 = 20%. Locked manifest lock_note states
  "Derived head crop from battle_front cell N (no icon cell in atlas)":
  aerobeak (cell 0), ashemit (cell 0), cragarm (cell 0), gearkid (cell 2),
  kittember (cell 2), megalochrome (cell 2), shellguard (cell 1),
  squirmite (cell 1), terrapod (cell 1), toxitacle (cell 5).
  The derived file is NOT byte-identical to its source cell (expected: it
  is a head crop, hash-checked for gearkid).
- Game-ready-only: 1/51 = 2% (strikechamp_unsuited_full) — icon file present
  in `game-ready/`, no atlas dir to confirm provenance against.
- Canonical duplicates: `game-ready-canonical/` holds only the 10 derived
  icon files (10/10 derived sets, 0/40 atlas-cell sets need a separate file
  because the cell itself is the icon) + 51 atlas PNGs = 61 PNGs total in
  that tree. Canonical icon coverage matches the 51/51 game-ready figure
  through the cell-pointer route, not through 51 separate files.
- On the task brief's "106 icon files found overall": NOT REPRODUCED on disk
  this session. Icon-named PNGs found by recursive glob across all of
  `sprite-art/`: 72 (55 game-ready + 10 canonical duplicates + 4 top-level
  `icons/` source/v1 files + 2 stray root icon64 files + 1 menu_icon).
  All icon-path entries including directories and JSON: 138. Neither is
  106. Do NOT quote 106 as a verified count; the verified counts are
  51/51 coverage and 55 game-ready icon PNGs.

### 3c. Icon verdict box

- [ ] Any creature missing icon dir: NONE (0/51).
- [ ] Any creature missing icon file: NONE (0/51).
- [ ] Atlas-cell icons byte-identical to source cell: spot-checked 3/3
  (aquariios, gabu, mochii); full 40/40 hash sweep still owed if a lane
  wants it as a gate.
- [ ] Derived icons (10) are head crops, not full cells: per manifest notes.

## 4. REGION 1 ROSTER FOR THE LIVE CHECK (46 sets)

From `PHASE-A-REGION1-MATRIX.md` (#001-#046, in matrix order):
mochii, tiidebiite, aquariios, razorgater, chromejaww, reaperdile, tyrage,
duneclaw, oblivirex, kittember, pyropaw, manticlaw, pupbble, terradog,
quakehound, squirmite, cocoonode, mothrix, zephling, aerobeak, stormtalon,
finblade, megalochrome, floatcalf, astroleviathan, inklet, toxitacle,
krakenox, punchkid, strikechamp, kickmaster, gearkid, mechapion, gorokappa,
pebblefist, cragarm, terrapod, sproutle, shellguard, dreadtoise, pixilite,
wispkin, duskfiend, ashemit, pyromonk, yogiferno.

Minimum live-check subset (must all pass before any "Region 1 battle works"
claim): mochii (starter path), gearkid (blocked back — expect FAIL until
the relabel PR lands; record it as a known FAIL, do not hide it), mechapion
(expect POSE ONLY until role assignment lands), plus any 3 further Region 1
sets of the tester's choice with clean front+back (e.g. razorgater,
kittember, pyropaw). A pass on the 3 clean sets does NOT clear gearkid or
mechapion.

## 5. LIVE CHECK — BattleView + Region 1 playtest (step by step)

READ FIRST: this section is instructions for a run that has NOT happened
in this lane. Do not tick a box from staging evidence. PR references below
are as briefed / as recorded in the matrix: the treatments module
(battleTreatments.js — windup 250 / hitstop 90 / recoil 300 / recover 400)
was shipped per the task brief (PR #69 treatments module), and the matrix
records live BattleView wiring separately as PR #83 (merged). Neither
merge, on its own, makes the game "playable" — the live steps below are
still the proof, and Gearkid (§1) + the still-gated Phase A PR (matrix
blockers: walk continuation, Gearkid relabel, Mechapion role) still apply.

### 5a. What to load

1. Load the current published Pages build (NOT a work-clone build, NOT a
   local `dist/` from `~/workspace/mochiichao-work/fresh-start`).
   Record: build/publish id, `main` commit, and whether the build includes
   the Gearkid relabel PR (if it does not, Gearkid step 5c-4 MUST fail —
   that is the expected result, not a surprise).
2. Confirm the title screen loads, then start a new game / continue into
   the lab / starters path. If the intro blocks, stop and record the exact
   blocking screen — do not reclassify a browser-automation failure as a
   game bug (prior v5.3 attempts blocked at intro for automation reasons).
3. Reach Route 1.0 / first wild or trainer battle with a Region 1 creature
   on the player side. Note the player creature and the opponent creature
   by name for every box below.

### 5b. What to click (BattleView)

1. In battle, open the move menu and select a contact/physical move
   (any move from the creature's real move list — attack frames are
   move-agnostic lunge frames per §2a, so the move name changes damage /
   turn order, NOT frame durations).
2. Watch ONE full attack from the player side, then ONE full attack from
   the opponent side. Do not click through the animation; let it play.
3. Repeat for the defender's recoil: the defender must visibly recoil
   (hurt set) on a hit — a damage number with no defender motion is a FAIL
   on the recoil box.
4. Open the party / menu screen once and confirm the active creature's
   icon renders (64px icon, §3) — record which creature, and whether the
   icon shown is the head-crop or atlas-cell version if discernible.

### 5c. Expected timings (time with a stopwatch / frame counter, ± tolerance)

Treatments values (battleTreatments.js, per brief + manifests):
- Windup: 250 ms (attacker leans back; `attack_a_windup.png`).
- Strike lunge (travel pre-phase): 120 ms (`attack_b_strike.png`) — on top
  of the 1,040 ms hit total per the manifest note, NOT inside it.
- Hit-stop / impact hold: 90 ms (freeze on `attack_c_impact.png`).
- Defender recoil: 300 ms (hurt set; defender motion, not attacker).
- Recover: 400 ms (attacker returns; `attack_d_recover.png`).
- Hit total (treatments arithmetic): 250 + 90 + 300 + 400 = 1,040 ms.
- Wall-clock note: a full attacker sequence including lunge travel can
  read ~1,160 ms (1,040 + 120). Do NOT fail a run solely for 1,160 vs
  1,040 — record both clocks and which phase ran long.

Tolerance for a PASS: each phase within ±50 ms of its value (or ±1 frame
at 60 fps ≈ ±17 ms if frame-counted — use the frame count if available,
it is the stricter proof). A phase that is skipped, doubled, or runs at
~2x is a FAIL even if the total looks close.

### 5d. PASS / FAIL boxes (copy and tick on the live run)

BattleView — player attack:
- [ ] PASS / [ ] FAIL — Windup ~250 ms, lean-back visible.
- [ ] PASS / [ ] FAIL — Strike lunge ~120 ms travel, attacker closes distance.
- [ ] PASS / [ ] FAIL — Impact hold / hit-stop ~90 ms freeze on contact.
- [ ] PASS / [ ] FAIL — Defender recoil ~300 ms, hurt motion visible.
- [ ] PASS / [ ] FAIL — Recover ~400 ms, attacker returns to place.
- [ ] PASS / [ ] FAIL — Hit total ~1,040 ms (treatments) / ~1,160 ms wall
  (with lunge) — record the actual number: ______ ms.
BattleView — opponent attack (same boxes, opponent as attacker):
- [ ] PASS / [ ] FAIL — Windup / lunge / hit-stop / recoil / recover all
  present; actual hit total: ______ ms.
Gearkid-specific (do NOT skip):
- [ ] PASS / [ ] FAIL — Player-side Gearkid (if used) shows its BACK in
  battle (gear ring from behind, no green eyes). Expected FAIL until the
  relabel PR lands; a PASS here without that PR landing is suspicious —
  re-check which build is loaded.
- [ ] PASS / [ ] FAIL — Opponent Gearkid (if encountered) shows its FRONT
  (green eyes, visor) — this must pass even while the back is blocked.
Region 1 playtest (route, not just one battle):
- [ ] PASS / [ ] FAIL — Title -> lab/starters -> Route 1.0 reached.
- [ ] PASS / [ ] FAIL — First battle completes (win or loss) without a
  soft-lock; menu / party screen opens after battle.
- [ ] PASS / [ ] FAIL — Party icon renders for the active creature (§5b-4).
- [ ] PASS / [ ] FAIL — No placeholder / missing-sprite box for any Region 1
  creature actually encountered; list encountered: __________________.
Overall:
- [ ] PASS — All BattleView boxes pass AND route boxes pass AND gearkid
  back passes (only possible after the relabel PR + a rebuild).
- [ ] FAIL — Any box above fails; record the failing box + actual timing /
  screenshot, and do NOT upgrade the overall to PASS on the strength of
  the staging counts in §2/§3.

### 5e. What this pack does NOT prove

- It does not prove a Pages build contains the Phase A art (that PR is
  still gated per the matrix). Staging counts (§2/§3) are disk facts, not
  deploy facts.
- It does not prove walk / overworld Region 1 completeness (walk
  continuation is a separate gated batch; 13/46 Region 1 sets had no
  walk-frames dir + Sproutle partial per the matrix).
- It does not prove audio, VFX-by-move-name, capture, or save behaviour.
  Those are separate lanes / steps.

## 6. Files touched by THIS segment (staging only)

- Created: `sprite-art/stage-verify-region1/VERIFY-REGION1.md` (this file).
- Created/appended: log entry in `sprite-art/sprite-art-lane-log.md`
  (see log; no game src, no fresh-start clone, no GitHub push).
- Read only: atlases/gearkid/*, game-ready/*, game-ready-canonical/*,
  animation/attack/*, 2d-sheets/gearkid/*, phase-a-gearkid-back/*,
  PHASE-A-REGION1-MATRIX.md, qa/GEARKID-BATTLE-BACK-VERDICT.md.
- Ephemeral only: `/tmp/gearkid-seg9/` upscales (cell03_512, locked atlas
  tile, angles crop) — evidence crops, not deliverables.

## 7. Open items for the parent (not decided here)

1. Gearkid relabel PR batch (staged cell + 10-row relabel table) — still
   owed; this segment only verified the art, it did not apply the relabel.
2. Mechapion `battle_back` role assignment — owed in the same batch.
3. Live run of §5 — owed, parent-delegated (browser/Pages).
4. Full 40/40 hash sweep for atlas-cell icons — optional gate, not done
   (3/3 spot-checked).
