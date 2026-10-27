# SPRITE-GAP AUDIT — Mochiichao vs Pokemon, per-creature sprite work

Date: 2026-10-26. Auditor: sprite-art lane subagent. Method: disk counts
verified this pass (not copied claims); Pokemon side from the real decomp
files in `~/workspace/mochiichao-work/fresh-start/` + the research file
`sprite-art/animation/expanded-scope/POKEMON-FILES-RESEARCH.md`.
Staged only. NO PR, NO game edits, NO deletions.

Counting unit: 51 named sets = 49 creatures + Strikechamp's 2 extra looks
(unsuited, unsuited_full). Atlas-based items use 50 atlas dirs (49 creatures
+ strikechamp_unsuited); the 51st look (unsuited_full) lives in game-ready
but has no separate locked atlas — flagged wherever that matters.

## 1. What Mochiichao has NOW (verified on disk this pass)

| Item | Verified count |
|---|---|
| 2D sheets (main + angles + lighting) | 49/49 creature dirs, 3+ files each (extras: wispkin 10, punchkid 8, strikechamp 7, cragarm/dreadtoise 6, mochii/yogiferno 5, manticlaw 4) |
| Locked atlases | 50/50 dirs, 1,736 PNGs incl. variants |
| Game-ready sets | 51 sets, 1,049 PNGs |
| Icons (party/menu) | 51/51 sets (55 icon PNGs incl. copies; 40 atlas-cell + 10 derived head-crops + 1 game-ready-only) |
| Battle front (locked `battle_front`) | 50/50 atlas dirs eye-checked at lock (BF/BB/icon) |
| Battle back (locked `battle_back` role) | 49/50 atlas dirs; Mechapion = string-only, NO role (pose-only, never guessed) |
| Idle loops | 51 dirs, 201 PNGs, 51 sidecar JSONs (47 keep / 3 adjust-at-wiring / 1 hold Aquariios hover-vs-swim) |
| Hurt baseline (1/creature) | 51 dirs, 90 PNGs recursive |
| Attack baseline (1/creature, transform set) | 51 dirs, 261 PNGs, 52 JSON |
| Expanded attack + hurt sets (4 + 4 / creature) | 51/51 sets staged = 408 sets (pilots 16 + A 64 + B 120 + C 120 + D-new 56 + E 32); transforms + procedural VFX, pose-redrawn 0/51 |
| Articulation (eyes + mouths, staged) | 51/51 sets have articulation work; V2-rework eyes-only 51 GIFs / 96 impact frames; V3-queue mouths 45/96 frames |
| Faint treatment | 8 body-type dirs, 16 PNGs (shared, exceeds Pokemon's shared slide) |
| Walk frames | 50/50 dirs present, 384 PNGs; full 8-frame dirs 42/50 = 84%; 8 partial by design (flyer/swimmer/hover: aerobeak 4, finblade 4, megalochrome 4, mothrix 4, zephling 4, floatcalf 6, stormtalon 5, squirmite 4) |
| Overworld (placement + walk) | 382 files (325 PNGs, 53 JSON); walk/ 51 entries; placement spec + placement.json |
| Follower system | `arena-combat/follower/` spec + followerWalk.js + tests (code, not per-creature art) |
| Title sequence art | Intro frames I1–I4, title-bg v2, starter trio S1 (5), Aeon lab crop, silhouette v4 (clean); title cutouts 10/10 per Title Creatures lane record (other lane's claim, not re-verified here) |
| Garden poses | 251 files (beyond Pokemon — Chao Garden side, not Pokemon parity) |
| Portraits | 15 files (beyond Pokemon battle sprite set) |
| Shiny / variant system | NONE systematic. Ad-hoc variants only: Wispkin skinny-armed V2 (kept, not default), Strikechamp 2 extra looks (canon), Punchkid V1 superseded (kept), Manticlaw special-variant bake (individual only) |
| Footprints | 0/51 |

## 2. What Pokemon has per creature (decomp evidence, by generation)

| Pokemon item | Generation / file evidence |
|---|---|
| Battle front sprite (`front.png`) | FR `graphics/pokemon/<species>/front.png`; BW2 `res/pokemon/<species>/front.png` + `front_single.png` |
| Battle back sprite (`back.png`) | FR `graphics/pokemon/<species>/back.png`; BW2 `back.png` + `back_single.png` |
| Party/menu icon (`icon.png`) | FR + BW2 `graphics/pokemon/` / `res/pokemon/<species>/icon.png` |
| Shiny palette (`shiny.pal`) | FR + BW2 `normal.pal` / `shiny.pal` per species (palette swap, NOT new art) |
| Footprint (`footprint.png`) | FR + BW2 per species (Pokedex feature) |
| Overworld sprite (4 directions) | FR `graphics/object_events/pics/pokemon/*.png` (incl. all species); HGSS follower overworld (fielddata system; follower walks with player); BW2 overworld sprites |
| Animated battle sprites (front + back animation data) | BW2 `front_animations.nanr.lz11` / `back_animations.nanr.lz11` + cells/ncer per species (2-frame battler animation driven by script) |
| Cry audio (`cry.wav`) | BW2 `res/pokemon/<species>/cry.wav` per species |
| Battle animations | SHARED, never per-creature: FR 354 scripts from 104 shared subroutines + 330 particle templates; BW2 one binary script per move via 81-command VM, max 16 live particle systems; hurt = one generic shake (General_MonHit); faint = shared slide; flinch = flag + skipped turn; status = 9 looping overlays; stats = one shared treatment |
| Idle battle animation | FR: NONE (battler static; movement only via tasks). BW2: model idle via script-selected anim. Per-creature idle is NOT a Pokemon battle feature |
| Per-creature attack poses | NONE in any generation checked. Battler sprite never changes pose; it is translated, shaken, scaled, flashed by code |
| Per-creature hurt poses | NONE in any generation checked. One generic treatment, scaled by code (FR power/12 or damage/12, clamped 1–16 px) |
| Title screen art | Per-game title screen + intro (NOT per-creature art) |

## 3. Gap table — Pokemon item -> Mochiichao status

Legend: HAVE = exists and verified; PARTIAL = exists but incomplete/unwired/
unapproved; NEED = not made. Wiring into the live game is tracked separately
in §4 — it is the single biggest gap and it is NOT hidden inside these rows.

| # | Pokemon item | Mochiichao status | Count |
|---|---|---|---|
| 1 | Battle front sprite | HAVE (locked, BF eye-checked) | 50/50 atlases = 100%; 51st look in game-ready, not lock-verified |
| 2 | Battle back sprite | PARTIAL (role-assigned, 1 missing) | 49/50 = 98%; NEED: Mechapion true back (1) |
| 3 | Overworld walk sprite (4-dir) | PARTIAL (dirs done, frames + gate open) | Dirs 50/50 = 100%; full 8-frame 42/50 = 84%; 8 partial by design (flyer/swimmer/hover — decision, not new leg art); walk-gate UNDECIDED (blocks shipping) |
| 4 | Party/menu icon | HAVE (existence) / PARTIAL (approval) | 51/51 = 100% staged; approved 41/51 = 80% (10 derived head-crops await Mars) |
| 5 | Shiny variant (palette) | NEED TO MAKE (systematic) | 0/51 = 0%; ad-hoc variants exist for 5 sets but no shiny system |
| 6 | Footprint | NEED TO MAKE | 0/51 = 0% (small per-item cost; Pokedex feature) |
| 7 | Animated battle sprites (BW2) | HAVE (functional equivalent) | 51/51 idle loops + 51/51 attack sets cover the function; no separate BW-style 2-frame battler anim asset |
| 8 | Cry audio per creature | NEED TO MAKE (audio, not art) | Module `treatments/creatureCries.js` exists but references only 2 creatures (mochii, razorgater) by name; real per-creature cry audio 0/51 verified |
| 9 | Shared move scripts (1/move) | HAVE (code, shipped) | 563/563 union scripts (FR 354 + BW2 560) on main via PR #168; interpreter + 12 shared subroutines; demo 33/33 PASS |
| 10 | Generic hurt/flinch/faint | HAVE (code, shipped) | treatments.js (General_MonHit, damage-scaled shake, faint slide, flinch flag) + 8 body-type faint sets on disk |
| 11 | Status treatments (9) | HAVE (code, shipped) | 9 status overlays in pokemon-layer treatments.js |
| 12 | Stats-change treatment | HAVE (code, shipped) | Stat up/down flash in treatments.js |
| 13 | Idle battle animation | HAVE (exceeds Pokemon) | 51/51 loops; FR had none, BW2 model-idle only |
| 14 | Title screen / intro art | PARTIAL | Static sequence HAVE (I1–I4, title-bg v2, S1, lab, silhouette v4); animated title versions staged 10/10 (other lane), NOT wired; live verification owed |

### Category percentages (Pokemon-parity items only)

- Battle sprites (front + back): (51 + 49) / (51 + 51) = 98%
- Overworld walk: 42/50 full-frame = 84% (100% dirs present)
- Icons: 51/51 existence = 100% (80% Mars-approved)
- Shiny: 0/51 = 0%
- Footprint: 0/51 = 0%
- Battle-animation code (scripts + treatments + status + stats): 100% module-shipped
- Idle / animated battler: 100% (exceeds Pokemon)
- Title sequence: ~70% (static done, animated unwired, live unverified)

### Overall Pokemon-parity percentage (counted, two views)

- Unit-weighted (all countable units incl. 563 move scripts): 861/973 = **88%**
- Category-mean (12 categories above, equal weight): **82%**
- Honest reading: the percentage is high because the big-ticket code
  (Layer 1) is done; the remaining art gaps are concentrated and small
  in count but real: shiny 51, footprint 51, walk shortfall 8, Mechapion
  back 1 — plus the game-wiring gap in §4, which is NOT inside the 88%.

## 4. The gap the table does NOT contain: game wiring (biggest gap)

Art existing on disk is not art in the game. The 2026-10-26 Region 1 live
playtest verdict was NO: BattleView + Team screens showed "ART IN
PROGRESS" placeholder blobs, and sprite wiring into BattleView/Team is
the real gap. Counted: 51/51 sets exist as art, 0/51 verified wired live
(BattleView patch + adapter owed; PR #83 wiring is agent-reported, NOT
parent-verified). This is game-lane work that this lane's art feeds — but
until it lands, no parity percentage is player-visible.

## 5. Layer 2 — what remains of OUR scope (beyond Pokemon, NOT counted above)

Layer 2 = per-creature attack + hurt poses + articulation. Pokemon has
none of this; it is all Mochiichao invention, so it is tracked separately
and never counted against the Pokemon-parity gap.

| Layer 2 item | Status |
|---|---|
| Expanded attack + hurt base sets (4 + 4 / set) | STAGED 51/51 sets = 408 sets; pose-redrawn 0/51 (transforms + VFX) |
| Articulation eyes (V2-rework) | STAGED 51/51 sets, 96 impact frames, approved as better |
| Articulation mouths (V3 contour-fit) | STAGED 45/96 = 47% applied; 51/96 eyes-only by rule/gate (never forced) |
| Mars-approved final attacks | 13/51 sets = 25% (Aquariios + Reaperdile V2; Kittember, Tiidebiite, Tyrage, Sproutle, Mythar, Ashemit, Floatcalf, Gabu, Strikechamp_unsuited, Strikechamp_unsuited_full, Punchkid V3) + pilot finals (Mochii attacks locked, Dreadtoise hurts template) |
| Batch B finals (15 sets) | VERDICT PENDING — shown, not reworked, not approved |
| Razorgater mouth fix | ORDERED by Mars (mouth reads too small; tool upgrade to sense wide open mouths: jaw gap + tongue area) — the only approved redo in this list |
| Dreadtoise attacks articulation | HELD (shell_ram middle frame uses a different source cell) |
| Hand-movement pass | NEED 0/51 (V2/V3 touched faces only) |
| Move -> set assignment table | NEED 0/51 (maps each move to one of its creature's sets; blocks Layer 2 wiring) |
| Per-creature poses beyond 4 + 4 | NOT STARTED (5th attack / extra hurts are future scope, not owed now) |

## 6. Top 5 biggest gaps by count

1. **In-game sprite wiring — 51/51 sets unwired live.** Art exists; the
   live game still shows placeholders. Blocks all player-visible parity.
2. **Shiny variants — 51/51 missing.** Palette-swap system (Pokemon's own
   method is a palette, not new art) + per-creature shiny palettes.
3. **Move -> set assignment table — 0/51 creatures mapped.** Needed to
   wire Layer 2 sets to actual moves.
4. **Hand-movement articulation pass — 0/51 sets.** Faces done; hands not
   yet varied per attack/hurt.
5. **Footprints — 0/51 missing** (tied with walk-gate: 8/50 dirs partial
   + gate undecided blocks shipping the 50/50 walk dirs).

Next after those: Batch B verdict (15 sets), Mechapion true back (1),
Razorgater mouth fix (1, ordered), Dreadtoise attacks (1, held),
derived-icon approval (10), Aquariios hover-vs-swim (1, holds its idle),
cry audio per creature (0/51 real), title animated versions wiring (10).

## 7. Could NOT verify on disk (flagged, not estimated)

- Per-creature cry AUDIO: `creatureCries.js` audited by name-mention count
  — only mochii + razorgater referenced; real per-creature cry audio is
  0/51 for practical purposes (audio work, not sprite art, but counted
  here because BW2 ships `cry.wav` per species).
- Title cutouts 10/10: Title Creatures lane's record (other lane), not
  re-verified in this audit; title-creature PNGs live in that lane's
  dirs, not in `sprite-art/title/`.
- Strikechamp_unsuited_full battle_back: exists in game-ready cells but
  has no separate locked atlas, so its back was not lock-verified.
- Locked-manifest walk sub-roles: extractor-assigned + montage-spot-
  checked, NOT cell-by-cell direction-verified (stated in every locked
  manifest; 6 lock-label corrections found in walk manifests were NOT
  written back to locked manifests).
- HGSS follower overworld art per species: the HGSS decomp in-repo has
  the follower SYSTEM but per-species follower sprites were not counted
  from it this pass (FR + BW2 overworld evidence used instead).
- Roster data health: `global_roster.json` (47 entries) does not parse
  as JSON (known: missing quote, bad HP value) — data gap, not a sprite
  gap, flagged here only because it blocks per-creature wiring tables.

## 8. Beyond Pokemon (already exceeds — NOT counted against the gap)

Per-creature attack poses (408 sets), per-creature hurt poses (408 sets),
facial articulation (eyes + contour-fit mouths), hand-pose variation
(planned), idle loops per creature (FR had none), body-type faint sets
(8 vs 1 shared slide), 90 ms hitstop, between-turn arena combat (0 HP
until a chosen attack), follower system, Garden poses (251 files),
portraits (15), eye/colour variant canon, Strikechamp multi-look canon.
