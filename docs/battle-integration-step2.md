# STEP 2 — BATTLE INTEGRATION SPEC (what this PR lands, and what it does not)

Date: 2026-10-25. Lane: sprite-art / producer step 2. Local staging in
`~/workspace/mochiichao-work/battle-integration-step2/`; this file ships in
the PR as `docs/battle-integration-step2.md` (new file, additions only).

## What lands in this PR (new files only, 0 deletions, 0 overwrites)
- `src/lib/battleIntegration.ts` — the ONLY wiring between locked atlases,
  attack/hurt/idle sets, treatments timing, the arena between-turn system,
  and real move data. No art, no creature sprites, no damage math (damage
  math stays in BattleView).
- `src/lib/battleIntegration.demo.ts` — runnable demo battle proving
  front/back wiring + hit timing end-to-end. Run: `npx tsx src/lib/battleIntegration.demo.ts`
  (tsx is already a devDependency). Exits non-zero on the first failed
  assertion. Demo result at staging time: 240 checks PASS.
- `src/lib/generated/battleSpriteRegistry.json` — 51 sets, regenerated
  from the locked game-ready manifests + Step 1 finish-batch manifests.
- `src/lib/generated/battleMoveTable.json` — decomp-merged real move data
  (Black 2 560 + FireRed 354, merged) + the game's own MOVES_DB (36).
- `src/lib/battleTreatments.ts` — typed port of
  `sprite-art/animation/treatments/battleTreatments.js` (only if 404 on
  main at PR time; if already on main, this PR skips it, never overwrites).
- `docs/battle-integration-step2-wiring.patch` — the BattleView +
  PixiBattleCanvas treatments patch, DELIVERED NOT APPLIED (see blocker
  below). Apply it on a clean checkout with `git apply --check` first.

## Verified counts (all from the written JSON + demo run, 2026-10-25)
- Front wired 51/51, back wired 51/51, front != back per set 51/51.
  Player = back view, opponent = front view, never front-for-both.
  Split-half cells kept raw: aquariios front '0a', dorowani back '1a',
  krakenox front '0a' / back '0b' — all with real atlas grid positions.
- Icons: 41 atlas-cell icons + 10 derived head-crop files = 51/51 sources.
  Derived icons are game-ready icon files, never atlas cell indexes.
- Attack art: 51/51 — 50 transform sets (4 frames each = 200 PNGs:
  windup 250 / strike lunge 120 / impact hold 90 / recover 400 ms) rendered
  from each creature's own locked battle_front cell, + strikechamp_unsuited_full
  7 extracted cells (21–27) kept as-is, never regenerated. Transform frames
  are PNG frames, NOT atlas cells — `cells` stays [] for them by design.
- Hurt art: 51/51 done in staging; idle loops: 51/51 in staging.
- Moves: real names/mechanics/timing verbatim from decomp extractions +
  MOVES_DB. NOTHING genericized into shapes. Only Pokemon creature names,
  sounds, art, dialogue stay excluded. Classification: Physical -> melee
  (attacker travels), Special -> projectile (cast + travel), Status ->
  status (no impact hold, no HP drain). Heavy = power >= 80.
- Arena integration: battleIntegration does NOT rebuild arenaCombat.js.
  It adapts arena timelines (matching beats pass, mismatches reported, never
  silently re-timed) and delegates between-turn movement to arenaCombat's
  `sampleArenaPose` when a live arena object is passed; otherwise a shim
  circles at neutral spacing 6u. arenaCombat.js itself is NOT bundled here
  (its own lane owns landing it); when it lands, wiring is one call.
- Arena-combat + treatments suites re-run untouched at staging time:
  arenaCombat 40/40, fanMechanics + captureLoop + moveData 42/42,
  battleTreatments 1 file pass, creatureCries/music 7/7, element VFX 8/8.

## Hit-timing law (verified by the demo, all 240 checks)
telegraph -> travel/cast -> windup -> strike -> HELD impact frame
(hitstop 90 ms: world frozen except flash/particles) -> recoil 300 ->
return -> idle. HP drains AFTER hitstop, never during it — every hpDrain
event starts at or after the end of its impact hold, including every hit
of a multi-hit move. Status moves: no impact hold, no drain. Faint SKIPS
the return (collapse + fade instead). Every sequence is skippable /
2x-speedable; skip jumps to RESOLUTION only after the damage result has
already been applied by the caller. Accessibility: reduce-motion zeroes
shake and halves camera push; hitstop + HP timing unchanged.
Treatments constants (single source of truth, battleTreatments.js):
windup 250 / hitstop 90 / recoil 300 / recover 400 ms; damage-scaled shake,
particles, camera push-in ON THE ATTACKER; mapTo3D for rigs.

## Shadows-separate (Mars, 2026-10-25 ~20:12 CDT, standing)
Shadows are NOT part of character art. Battle cells ship shadow-free; the
engine adds shadows as a separate layer underneath the sprite
(`SHADOW_LAYER` in battleIntegration.ts: separateLayer=true, bakedInArt=false,
renderOrder=below-sprite, ellipse contract). This module never bakes a
shadow into art and never reads one from a cell. The shadow-layer
module/spec itself (decomp verification + baked-shadow strip pass) is a
HANDOFF DEPENDENCY owned by the separate shadows lane — its absence does
not block this wiring, and it is never a reason to bake shadows into cells.

## Capture (standing rules)
Default capture stays normal Pokemon-style (Luigi Cubes, existing game
system). Ring capture is NOT wired here at all: it is a separate OPTIONAL
gated system (new retro-arcade-THEMED zone, not Harbor City Safari, not
literally called "Arcade Zone"; gate = zone visited + played -> unlock ->
shops sell ring-capture items usable whenever), owned by its own batch.

## What stays staging (NOT in this PR, NOT dropped)
- Attack PNGs (200 transform + 7 extracted cells), hurt cells (51),
  idle manifests: local staging under `sprite-art/animation/` until the
  Step 1 finish-batch PR lands (parent-owned). Registry marks them
  onMain=false; the module falls back to treatments whenever a pending
  cell is absent and never invents a path. When Step 1 lands, wiring
  consumes them by the paths already in the registry — no rewrite.
- Slots #047–#146 stay UNFILLED on purpose. Unknown roster ids and slot
  047 resolve to null, never a guessed creature.

## BLOCKER (exact): BattleView + PixiBattleCanvas patch NOT applied
The work clone at `~/workspace/mochiichao-work/fresh-start` has UNCOMMITTED
modifications by other lanes still in flight (BattleView.tsx, App.tsx,
gameStore.ts, WorldEngine.tsx, RosterView.tsx, ShopView.tsx, SaveMenu.tsx,
IntroSequence.tsx, MochiiMindUI.tsx, FullWorldMaps.ts, index.css,
package.json, package-lock.json), and the repo's anti-clobber rule forbids
applying the patch over a dirty tree. So the patch ships in this PR as
`docs/battle-integration-step2-wiring.patch` (treatments-driven driver:
BattleAttack gains damageFraction + isCrit; onImpact fires at hitstop end;
recoil/recover sampled, not re-implemented) and is applied by whoever owns
the clean checkout AFTER those lanes land — never forced over them.
Additions-only files in this PR do not touch those files and do not clobber.

## CONFIRMATION ITEMS — staged, NOT blocking (parent shows Mars first)
These are flagged in the registry caveats; wiring proceeds with the locked
values below until Mars overrides. Do NOT pause other work for these.
1. GEARKID battle_back PROVISIONAL — locked atlas cell 3 shows eyes at 64px;
   it is the closest back candidate, not a clean true back. Re-verify at
   sheet resolution before shipping battle. Preview (local staging):
   `sprite-art/game-ready/gearkid/cells/gearkid_cell_03.png`
   (front for comparison: `.../gearkid_cell_02.png`); on main:
   `src/assets/sprite-atlases/gearkid/gearkid_atlas_64_locked.png` cell 3.
2. COCOONODE front/back JUDGEMENT — faceless crystal by design; front/back
   indistinguishable by eye, locked as labelled, Mars-overridable. Preview:
   `sprite-art/game-ready/cocoonode/cells/cocoonode_cell_00.png` (front) and
   `.../cocoonode_cell_01.png` (back).
3. PIXILITE front/back JUDGEMENT — faceless by design; same as Cocoonode.
   Preview: `sprite-art/game-ready/pixilite/cells/pixilite_cell_00.png`
   (front) and `.../pixilite_cell_02.png` (back).
4. MECHAPION battle_back FALLBACK (not a question, recorded) — overworld_back
   cell 2 designated as battle_back per gap-doc QA fallback; ringed cell 0
   excluded, clean cell 1 = front, clean cell 2 = back.
