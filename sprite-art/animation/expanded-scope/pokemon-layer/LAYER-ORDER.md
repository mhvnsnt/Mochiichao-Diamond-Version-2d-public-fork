# Pokemon layer — wiring doc (Layer 1 under per-creature poses)

Date: 2026-10-26. Status: STAGED ONLY, under
`sprite-art/animation/expanded-scope/pokemon-layer/`. No game-code
edits, no PR, no work-clone git changes, no existing file overwritten.
Nothing in the articulation dirs was touched (read-only for this task).

## What this layer is

The Pokemon way, as the floor under Mochiichao's per-creature work
(research: `../POKEMON-FILES-RESEARCH.md`):

- One script per MOVE, built from shared parts — NOT one redrawn pose
  per move. FireRed: 354 scripts from 104 shared subroutines, 330
  particle templates, 213 visual tasks. Black 2: one binary script
  per move run by an 81-command VM, max 16 live particle systems.
- One generic hurt treatment (hit splat + shake + flash), reused by
  nearly every damaging move. No per-creature hurt animation in
  Pokemon. No per-creature attack poses in Pokemon: the battler
  sprite never changes pose; it is translated, shaken, scaled, and
  flashed by code.
- Faint is a shared slide (FireRed: y += 5/frame), 0 new frames.
- Flinch is a flag + skipped turn. No flinch pose, no flinch particle.
- Status conditions are 9 looping overlays, not poses.
- Timing is frame-counted at 60 fps; `waitforvisualfinish` is the
  sync primitive. FireRed has NO camera; Black 2 has a real camera
  (preset → move → shake → save/restore, locked during effects).

## What this layer is NOT (honest limits)

- Pokemon has NO per-creature hurt animation and NO per-creature
  attack poses. Our per-creature poses (articulation V2/V3) are
  Mochiichao inventions layered ON TOP of this layer.
- Hitstop (90 ms) is a Mochiichao addition, not a Pokemon copy:
  neither Gen 3 nor Gen 5 has a freeze-frame primitive. It lives in
  `../treatments/battleTreatments.js` (`IMPACT_HOLD_MS = 90`) and is
  deliberately NOT inside the Pokemon-faithful scripts here. The
  game may apply it after a script's impact beat; it must not be
  written into these scripts.
- The existing `../treatments/battleTreatments.js` is NOT modified
  by this layer and NOT duplicated here. It is the Mochiichao-staged
  presentation (windup / hitstop / recoil / recover, severity tiers,
  camera push). This layer's `treatments.js` is the Pokemon-faithful
  generic floor (General_MonHit shake, damage-scaled amplitude,
  faint slide, 9 status overlays, stat flash). The game may run
  either; Layer 1 never overrides a per-creature pose.

## Files in this layer

| File | What it is |
|---|---|
| `moveScripts.js` | Script/timeline interpreter (FireRed 48-command model + Black 2 command families: camera, emitters, Mcss transforms, BG, VM flow). 16-live-particle budget ENFORCED (excess spawns dropped + logged, never silently exceeded). Named shared-subroutine library (`sub_HitSplat`, `sub_ShakeTarget`, `sub_Lunge`, `sub_Projectile`, `sub_StatusPuff`, `sub_StatFlash`, `sub_MultiHitBeat`, `sub_FaintSlide`, `sub_GeneralMonHit`, `sub_Impact`, `sub_DrainOrb`, `sub_ChargeUp`) — scripts call these by name, never duplicated inline. |
| `generate_move_scripts.py` | Generator: reads the real extracted move data and emits `moveScripts.json`. Re-runnable. All mapping rules + assumptions are in its docstring. |
| `moveScripts.json` | Generated: one script per move (union, see counts below), with per-move provenance (sources, category, type, power, effects, contact flag, template, family, fallback flag, notes) + fallback list + category-disagreement list. |
| `treatments.js` | Generic treatments: hurt (General_MonHit, damage-scaled amplitude power/12 or damage/12 clamped 1–16 px, else fixed 3 px), flinch (flag + skip, NO pose), faint (shared slide y += 5/frame), 9 status treatments, stat-change (up/down flash), terrain shake (power/10 + 3 rule). No per-creature art. |
| `fallback.js` | Wiring stub: coverage data + `resolveAttack` / `resolveHurt` / `coverageSummary`. The game calls `resolveAttack(creature, moveScript)` and serves the winning layer. |
| `demo.js` + `demo-output.log` | Node demo (no build step) proving the checks in §Verification. |
| `LAYER-ORDER.md` | This doc. |

## Move-script counts (generated, counted — not estimated)

Source files read (field names verified from the files themselves):
- FireRed `decomp_firered_moves.json`: 354 moves.
- Black 2 `decomp_black2_moves.json`: 560 moves.
- Union by move name (sourceConstant minus `MOVE_`): **563 scripts**.
  - In both sources: 351. FireRed-only: 3
    (`SELF_DESTRUCT`, `SMOKESCREEN`, `SOFT_BOILED`).
    Black 2-only: 209.
  - Where both exist, Black 2 wins for category/power/effect
    (native Gen 5 split); FireRed wins for flags (contact — Black 2
    extracted data has no flags field).
  - Category disagreements between the two sources: **54 names**
    (FireRed derived vs Black 2 native; e.g. `HYPER_BEAM`:
    FireRed-derived Physical because NORMAL maps to Physical in
    the Gen 3 derivation, Black 2-native Special). Full list in
    `moveScripts.json` (`categoryDisagreementMoves`).
- Templates: `special_projectile` 141, `physical` 98 (no lunge
  claimed — contact unknown for Black 2-only moves),
  `physical_contact` 97 (FireRed `MAKES_CONTACT` confirmed),
  `stat_change` 48, `status_condition` 24, `status_heal` 17,
  `multi_hit` 20, `two_turn` 9, `generic_fallback` 109.
- Families: `damage` 279, `damage_with_status` 57, `stat_change`
  48, `status_condition` 24, `status_heal` 17, `multi_hit` 20,
  `two_turn` 9, `fallback_utility` 109.
- Fallback: **109/563 = 19%**. Every fallback is a Status utility
  move whose effect matches NO stat/status-condition/heal rule
  (weather, trick, substitute-style, and similar effects the data
  does not describe as stat/status/heal — e.g. `BATON_PASS`,
  `COIL`, `COTTON_GUARD`, `GROWTH` is in this class only if its
  effect string matched no rule; see the list). The fallback script
  is a generic cast (status puff + SE), NEVER a guessed specific
  effect. Full list: `moveScripts.json` (`fallbackMoves`).
  No move had an unknown/missing category (fallback_unknown_category
  count = 0); all 109 fallbacks are fallback_utility.
- Multi-hit beats default to 3: NEITHER extracted file has a `hits`
  field (verified — no hits key in any record of either file), so
  the repeat count cannot come from the data. 3 is a documented
  generic default, not data. (Black 2 source `data.json` records
  carry hits, but the extraction dropped it — a future re-extraction
  could replace the default with real counts.)
- Two-turn scripts carry `variants: {charge, unleash}`; the runner
  picks via `options.variant` (default `unleash`).
- SE tokens: only `SE_M_DOUBLE_SLAP` (FireRed songs.h, cited in
  research) and `SE_FAINT` are claimed decomp ids. All other `SE_*`
  tokens in generated scripts are generic placeholders for the
  game's SE library, not claimed FireRed/Black 2 ids.
- Camera steps appear only on damaging moves with power >= 120
  (Black 2-style save/shake/restore). FireRed has no camera.

## Generic treatment list (treatments.js)

1. Hurt — `hurtTreatment({power|damage})`: hit splat +
   ShakeMon ~12 frames + white flash + `SE_M_DOUBLE_SLAP`.
   Amplitude = power/12 or damage/12, clamped 1–16 px; no power or
   damage given → fixed 3 px (Pound default).
2. Flinch — `flinchTreatment()`: `STATUS2_FLINCHED` flag + skipped
   turn. Pose: null. Particle: null. (Pokemon has no flinch animation.)
3. Faint — `faintTreatment({framesToExit})`: shared slide,
   y += 5/frame, `SE_FAINT`, sprite freed after the slide.
4. Status — `statusTreatment(name)` for the 9 FireRed status-table
   entries: Poison, Confusion, Burn, Infatuation, Sleep, Paralysis,
   Freeze, Curse, Nightmare. Looping overlays; Poison/Burn/Nightmare
   also tick. Unknown name → null (never a guessed treatment).
5. Stats change — `statChangeTreatment('up'|'down', stages)`:
   arrows + white flash + sound, 16 frames.
6. Terrain shake — `terrainShakeTreatment({power|offsetPx})`:
   offset defaults to power/10 + 3 (FireRed ground-shake rule).

## Override order (stated explicitly)

Highest wins; first hit wins; generic is the floor:

1. **V3 final pose set** — per-creature, wins over everything.
2. **V2 pose set** — per-creature, wins over generic.
3. **Generic script/treatment (this layer)** — always present.

**Generic never overrides a per-creature pose.** Where a creature
has only some sets, the missing sets fall back to generic. The game
implements this by calling `resolveAttack(creature, moveScript)`
(see `fallback.js`): it returns `layer: 'per-creature'` with the
winning tier when the creature has a V3/V2 set, and
`layer: 'generic'` with the move's generic script otherwise. The
generic script is always returned alongside, so the fill path needs
no second lookup.

Base articulation cells (all 51 canonical homes, 22 attack cells
each) are the raw material V2/V3 sets are built from; they are
listed in the coverage table as information and are NOT a serving
tier in this contract. The contract is pose (V2/V3) vs generic.

## Roster coverage table (51 creatures × generic + per-creature)

Verified on disk 2026-10-26. Method: canonical homes from
`../articulation/COVERAGE-51-CORRECTED.md` (dir existence +
non-recursive attack-cell count per home; pilots' cells use bare
`atk_*` names); V2 presence from the arefit manifest (8 creatures)
plus the v2-rework manifests (batch-a 5, batch-c 8, batch-e 2,
batch-d 9); batch-d manifest entries for squirmite, stormtalon,
terradog, zephling are Batch B duplicates and are excluded per
the coverage doc's duplicate rule, while its other 5 entries
(strikechamp, strikechamp_unsuited, strikechamp_unsuited_full,
toxitacle, yogiferno — 4 sets each, verified from manifest keys +
per-set GIFs) are genuine Batch D sets and ARE counted.
Union: arefit 8 + v2-rework non-overlap 15 = 23. (Correction
2026-10-26: an earlier version of this doc counted 18, missing
the batch-d 5; re-counted from the batch-d manifest.)
V3-final presence from
`articulation-pipev3` dirs + GIFs (kittember, tiidebiite only).
Generic = this layer (moveScripts.json + treatments.js), yes for
all 51 by construction.

| Creature | Generic | Base cells | V2 pose | V3 final |
|---|---|---|---|---|
| mochii | yes | yes (22) | no | no |
| dreadtoise | yes | yes (22) | no | no |
| aquariios | yes | yes (22) | yes | no |
| chromejaww | yes | yes (22) | yes | no |
| kittember | yes | yes (22) | yes | yes |
| razorgater | yes | yes (22) | yes | no |
| reaperdile | yes | yes (22) | yes | no |
| sproutle | yes | yes (22) | yes | no |
| tiidebiite | yes | yes (22) | yes | yes |
| tyrage | yes | yes (22) | yes | no |
| aerobeak | yes | yes (22) | no | no |
| cocoonode | yes | yes (22) | no | no |
| duneclaw | yes | yes (22) | no | no |
| finblade | yes | yes (22) | no | no |
| manticlaw | yes | yes (22) | no | no |
| megalochrome | yes | yes (22) | no | no |
| mothrix | yes | yes (22) | no | no |
| oblivirex | yes | yes (22) | no | no |
| pupbble | yes | yes (22) | no | no |
| pyropaw | yes | yes (22) | no | no |
| quakehound | yes | yes (22) | no | no |
| squirmite | yes | yes (22) | no | no |
| stormtalon | yes | yes (22) | no | no |
| terradog | yes | yes (22) | no | no |
| zephling | yes | yes (22) | no | no |
| ashemit | yes | yes (22) | yes | no |
| astroleviathan | yes | yes (22) | no | no |
| cragarm | yes | yes (22) | no | no |
| dorowani | yes | yes (22) | yes | no |
| duskfiend | yes | yes (22) | no | no |
| floatcalf | yes | yes (22) | yes | no |
| gabu | yes | yes (22) | yes | no |
| gearkid | yes | yes (22) | no | no |
| gorokappa | yes | yes (22) | no | no |
| inklet | yes | yes (22) | yes | no |
| kickmaster | yes | yes (22) | no | no |
| krakenox | yes | yes (22) | yes | no |
| mechapion | yes | yes (22) | no | no |
| mythar | yes | yes (22) | yes | no |
| pebblefist | yes | yes (22) | yes | no |
| strikechamp | yes | yes (22) | yes | no |
| strikechamp_unsuited | yes | yes (22) | yes | no |
| strikechamp_unsuited_full | yes | yes (22) | yes | no |
| terrapod | yes | yes (22) | no | no |
| toxitacle | yes | yes (22) | yes | no |
| wispkin | yes | yes (22) | no | no |
| yogiferno | yes | yes (22) | yes | no |
| pixilite | yes | yes (22) | no | no |
| punchkid | yes | yes (22) | yes | no |
| pyromonk | yes | yes (22) | yes | no |
| shellguard | yes | yes (22) | no | no |

Totals: generic **51/51 = 100%**; base cells 51/51 = 100%;
V2 pose **23/51 = 45%**; V3 final **2/51 = 4%**; V2/V3 pose
present (either tier) 23/51 = 45%; V2/V3 pose absent → generic
fills **28/51 = 55%**. Mars-approved fully-final subset
(aquariios + reaperdile V2, kittember + tiidebiite V3) = 4/51 = 8%
per the 2026-10-26 ~11:11 snapshot; the other 19 V2 sets are
staged, not claimed as approved-final here.

Note on a possible conflicting claim: memory elsewhere records
"V2-rework eyes-only set (51 GIFs)" as approved/saved. The
v2-rework MANIFESTS found on disk in this pass list 24 entries
(batch-a 5 + batch-c 8 + batch-e 2 + batch-d 9), of which 20 are
unique canonical creatures after excluding the 4 Batch B
duplicates in batch-d. This table reports from the manifests +
dirs actually found, not from that memory claim. Separately, a queue-wide V3 staging landed during this pass
under `articulation-v2-rework-v3/` (tag artic-pipev3q-20261026,
show-first, NOT shipped, NOT approved-final: 45/96 mouths applied,
rest eyes-only by rule/gate). It is NOT counted as V3-final here —
V3-final in this table means the Mars-approved proof pair
(kittember, tiidebiite) only. If the queue-wide V3 staging is later
shown to and approved by Mars, re-count v3Final from its manifest
before quoting a new number.

## Verification

Run: `node demo.js` (no build step). It writes `demo-output.log`
in this directory and prints PASS/FAIL per check. Checks:

1. Generic hurt + faint run (treatments + interpreter subs).
2. Sample scripts end-to-end: 1 physical (POUND), 1 special
   (EMBER), 1 status (SWORDS_DANCE), 1 multi-hit (DOUBLE_SLAP) —
   each produces a timed event log with no error and an `end`.
3. Same scripts resolved for aquariios (V2 → per-creature wins)
   and astroleviathan (no V2/V3 → generic fills).
4. Particle budget: a 20-spawn stress script never exceeds 16
   live (16 spawned, 4 dropped + logged).
5. `waitforvisualfinish` sync: the clock advances to the latest
   task end before the next beat; event frames are non-decreasing.
6. Full sweep: all 563 scripts run through the interpreter
   (two-turn scripts in both variants) with no error and
   maxLiveParticles ≤ 16 throughout.

## Wiring notes for the game (not implemented here — no src edits)

- Import `moveScripts.js` + `treatments.js` + `fallback.js` at
  wiring time; do not copy their values into a second list.
- Replay event logs on the game's 60 fps clock (`frame` →
  `ms = frame × 16.7`). Instantaneous ops share a frame, as in the
  real interpreters.
- Apply the 90 ms Mochiichao hitstop AFTER a script's impact beat
  if the game wants it — never by editing a script here.
- Camera ops in scripts are Black 2-style; a FireRed-faithful
  renderer may ignore them (they are tagged in the log).
- When V3 mouths land queue-wide, update `fallback.js` COVERAGE
  (v3Final flags) from the new manifests — do not hand-edit the
  table in this doc without re-counting from disk.
