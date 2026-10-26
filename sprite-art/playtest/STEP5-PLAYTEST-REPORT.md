# STEP 5 — PLAYTEST + BALANCE LOOP REPORT (2026-10-25)

Real scripted battles through `arena-combat/arenaCombat.js` (the arena demo)
+ battle-integration treatments. No hand-written HP results: damage uses
the level-50 formula from `global_roster.json` base stats, then
`resolveAttack` applies the positioning multiplier exactly once. Every hit
resolves its VFX family (Step 4 `elementImpactVfx.js`), attacker cry
(Step 4 `creatureCries.js`) and music cues (Step 4 `battleMusicCues.js`).

## 1. Invented-move battles: 12/12 KO, 44 turns

`playtest-step5.js` -> `playtest-step5-results.json`. Re-run 2026-10-25: exit 0.

| # | Attacker -> Foe (move, type -> element/shape) | Raw/hit | Turns to KO | Severity |
|---|---|---|---|---|
| 1 | Mochii -> Razorgater (Aqua Shot, WATER -> Water/drop) | 25 | 5 | medium |
| 2 | Razorgater -> Mochii (Metal Strike, STEEL -> Chrome/shard) | 31 | 4 | medium |
| 3 | Tyrage -> Kittember (Earth Tremor, GROUND -> Earth/chunk) | 68 | 2 | critical |
| 4 | Kittember -> Tyrage (Ember Toss, FIRE -> Flame/flame) | 28 | 5 | medium |
| 5 | Pyropaw -> Sproutle (Fire Stream, FIRE -> Flame/flame) | 59 | 3 | heavy |
| 6 | Sproutle -> Pyropaw (Razor Leaf, GRASS -> Earth/chunk) | 31 | 5 | medium |
| 7 | Zephling -> Squirmite (Gust Wave, FLYING -> Aero/streak) | 28 | 4 | medium |
| 8 | Squirmite -> Zephling (Swarm Strike 3 sub-hits, BUG -> Bug/mote) | 13 x3 = 42/turn | 3 | heavy |
| 9 | Punchkid -> Gearkid (Power Strike, FIGHTING -> Strike/star) | 39 | 3 | heavy |
| 10 | Gearkid -> Punchkid (Flash Cannon, STEEL -> Chrome/shard) | 42 | 3 | medium |
| 11 | Wispkin -> Ashemit (Shadow Pulse, GHOST -> Umbral/wisp) | 44 | 3 | heavy |
| 12 | Mythar -> Yogiferno (Mind Blast, PSYCHIC -> Mythic/sparkle) | 46 | 4 | medium |

Totals: 12 battles, 12 KO, 44 turns, low-HP cue crossed in 12/12 battles
(threshold <= 25%, first crossing — the cue fires in every battle because
every battle ends in a KO; that is expected, not a bug). Timelines:
single-hit 1720 ms (projectile) / 1770 ms (melee, +50 ms positioning),
heavy-weight 100-power move 2055 ms, 3-sub-hit turn 3030 ms.

Crit check: forced crit on Mochii Aqua Shot -> severity critical, red
flash, damageDealt 25 = raw. That is the demo's contract (damage is passed
in; crit changes presentation only) — NOT a bug found here, and NO crit
damage multiplier is invented in this step. A canonical crit multiplier
is a Mars/game-design decision for the arena lane, listed in §5.
Miss check: hit=false -> 0 dealt, foe HP unchanged (125/125). PASS.

Between-turn sparring pressure: in the 12 battles maxPressureStep = 0.
Reason, verified separately: the scripted window is 3 s per turn, but
PRESSURE_STEP_MS is 5 s, so a step can never trigger inside one window.
The standalone pressure probe (16 s window, no choice made) DOES fire:
3 pressure events (steps 1, 2, 3), final pressureStep 3, 3 clashes. So
pressure works; it is idle-time pressure, not per-turn pressure. The
`clashes` sum of 44 in the results file is cumulative-pose double-counting
(pose.clashCount is cumulative per battle and is summed per turn) — do
NOT read 44 as 44 distinct clashes. The probe's 3 clashes are the clean
number. This metric flaw is recorded, not tuned on.

## 2. Real-move battles: 6/6 KO, 34 turns

`playtest-step5-real-moves.js` -> `playtest-step5-real-moves-results.json`.
Real decomp FireRed move data (names, powers, types, categories kept
verbatim — no move genericized):

| Attacker -> Foe (real move) | Raw/hit | Turns | Severity | VFX |
|---|---|---|---|---|
| Mochii Water Gun (40, WATER/Special) -> Razorgater | 25 | 5 | medium | Water/drop |
| Razorgater Bite (60, DARK/Special) -> Mochii | 19 | 7 | medium | Umbral/wisp |
| Tyrage Tackle (35, NORMAL/Physical) -> Kittember | 25 | 5 | medium | Normal/puff |
| Kittember Ember (40, FIRE/Special) -> Tyrage | 28 | 5 | medium | Flame/flame |
| Zephling Gust (40, FLYING/Physical) -> Squirmite | 34 | 3 | medium | Aero/streak |
| Sproutle Vine Whip (35, GRASS/Special) -> Pyropaw | 15 | 9 | light | Earth/chunk |

Spread 3–9 turns. The 9-turn outlier is data-driven (35 power, Special,
vs Pyropaw's high special defence), not a formula error; move powers are
NOT retuned here. Severity mapping verified exact in every battle:
light <= 15% of max HP, medium <= 35%, heavy <= 60%, critical > 60% or
crit — e.g. Vine Whip 15/135 = 11% light, Earth Tremor 71/115 = 62%
critical. Because the mapping is exact, severity thresholds are NOT
changed: retuning them would falsify the read.

## 3. Capture paths — BOTH tested, real module verified

Default Luigi Cube (orb-throw) baseline, from the contract harness and the
merged module: full HP standard x1 = 23.7% chance; 1 HP standard x1 =
53.9%; full HP sturdy x1.5 = 32.2%; full HP prime x2 = 39.9%. Always
available, lock-independent.

Gated ring path, verified 2026-10-25 against the REAL merged module
(`sprite-art/arena-combat/captureLoop.js` from main, PR #37, imported as
ESM in a clean /tmp copy — this supersedes the earlier contract-harness
caveat, which existed only because the LOCAL arena lane copy was
mid-rewrite and exported 0 keys):
- never visited -> unlocked false; visited only -> false; played with
  0 ring items -> false; visited + played + 2 items -> true.
- consumeRingItem: unlocked 2 -> 1; locked states never go below their
  count (visited-only 2 -> 2, played-0-items 0 -> 0).
- locked ring encounter: ringAvailable false; a closed ring fills
  nothing and captures nothing.
- unlocked ring run: 4 loops x 25 meter = 100/100 -> captured true,
  1 ring item consumed at encounter start.
Ring is optional-only, never default. Arcade is theme/setting only (no
token economy, cabinet mini-games, or high-score mechanics); the zone
name is still NOT locked (candidates: The Ringcade, Neon Loop Hall,
Pixel Ring Hall — Mars picks).

## 4. Tuning changes made — as data/config, NOT silent art retimes

File: `balance-tuning.js`. Variant runner: `playtest-step5-tuned.js` ->
`playtest-step5-tuned-results.json`. Nothing in `arenaCombat.js`,
`battleTreatments.js`, any move power, or any art frame was edited; the
arena lane adopts these in its own files or rejects them per item.

- T1 — Multi-hit particle flood cap: Swarm Strike fired 20 particles per
  sub-hit = 60 per turn, noisier than a single critical hit (28) while
  dealing less damage. Scale [1.0, 0.7, 0.5] per sub-hit: 60 -> 44
  particles per turn. Single-hit turns unchanged.
- T2 — Multi-hit timing KEPT (checked, not changed): a 3-hit turn is
  3030 ms vs 3 x 1720 = 5160 ms single-hit equivalent; extra hits cost
  655 ms each, not a full timeline. No retime.
- T3 — Return-phase trim, presentation only: RETURN 400 -> 300 ms for
  non-fainting hits (the faint path already skips RETURN, so the faint
  read cannot break). Single-hit timeline 1720 -> 1620 ms (-5.8%).
  Across the 12 battles: hit-animation time 80880 -> 77680 ms
  (saved 3200 ms = 32 non-final turns x 100 ms); particles total
  776 -> 728 (-48, all from Swarm Strike).
- NOT tuned, deliberately: damage formula, move powers, severity
  thresholds, camera/particle intensity per severity (1.04/1.08/1.14/1.20
  zoom, 6/12/20/28 particles — all read correctly against their damage
  fractions), hit timing phases (windup 250 / hold 90 / recoil 300 /
  recover 400 — consistent between treatments and arena timelines).

## 5. Decisions owed to Mars / owning lanes (NOT silently changed)

1. Canonical crit damage multiplier (arena lane): crit currently changes
   presentation only in the demo. Mars decides the multiplier, if any.
2. Ring zone name (Mars picks): The Ringcade / Neon Loop Hall / Pixel
   Ring Hall, or another name.
3. Adoption of T1 + T3 into `arenaCombat.js` (arena lane): this step
   delivers them as config + variant evidence, not as a core edit.
4. Vine Whip 9-turn read (no action proposed): real-move data; if Mars
   wants faster starter battles, that is a roster/move-data decision,
   not a playtest retune.
