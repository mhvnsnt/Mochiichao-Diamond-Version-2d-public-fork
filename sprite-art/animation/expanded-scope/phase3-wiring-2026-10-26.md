# PIVOT PHASE 3 — SPRITE WIRING (2026-10-26)

Mars order 2026-10-26 ~12:53 CDT: wire ALL sprites + animations into the
game. Gates: Phase 1 merged (PR #177, main 0b637a4e), Phase 2 staged
(pivot-2d-20261026, uploaded by this PR). Branch base for this PR is the
live main head at PR time (bc7e6515, PR #179) — see the PR body for the
verified base + merge SHAs. Deploy to GitHub Pages is a SEPARATE step
decided by Mars after this PR merges; this PR does NOT publish.

## What this PR wires (live in game code, not just files on main)

- Dorowani (147) + Gabu (148): spriteSheets.ts repoints from the Tripo-model
  bake sheets to the locked 2D atlases (src/assets/sprite-atlases/dorowani
  384x192, gabu 384x256), with battle front/back + portrait side + overworld
  cells taken from *.manifest.locked.json (Dorowani front (0,0), back (64,0),
  side overworld_side (256,0), icon (0,128); Gabu front (128,0), back (192,0),
  side walk_side_0 (128,64), icon (64,64)). The 8/8 game-path bake files are
  UNREFERENCED after this PR, not deleted: 0 deletions in this PR, bake PNGs
  stay in src/assets/sprites/ as history. Actual file deletion is Mars's
  explicit call, not this wiring's.
- Battle three-quarter cuts: KEPT (task default). They are already 2D
  angles-sheet crops; swapping them to the locked battle cells is Mars's
  call, noted here, not decided here.
- src/lib/creatureAnimation.ts (NEW, generated from main sources, never
  hand-typed): the single registry for idle / hurt / attack-transform /
  articulation / pilot / silhouette / move-script layers, with lazy
  import.meta.glob loaders (same mechanism as openSourceAssets.ts, lazy so
  the 1000+ animation PNGs load on demand instead of inflating the first
  chunk). It is the only place that maps speciesId <-> folder.
- CreaturePortrait: idle loops cycle when animateIdle is on (default) and an
  idle spec exists, with static-cell fallback while loading or on failure;
  undiscovered renders the discovery silhouette (never flashes real art);
  no-def species fall back to their silhouette when one exists, else the
  drawn blob. Applies everywhere portraits already render (Team, battle
  panels, Garden, PC, Ring Capture, Arena, GameShell).
- PixiBattleCanvas: (1) the hurt-art hook this file documented is now
  implemented — while battleTreatments' sampled pose says defenderArt ===
  'hurt', the target wears its registry hurt cell, then swaps back;
  (2) attacker frame cycling from the resolved attack set (pilot by move id
  for Mochii, pilot by family for Dreadtoise, articulation by category for
  the 24 articulation entries); transform-only when no set exists or a load
  fails, so art can never break the attack timeline; (3) silhouette
  fallback for species with no sheet def. BattleView passes moveId into
  the attack so (2) can select pilot sets.
- Move scripts: src/lib/generated/moveScripts.json is a byte-identical
  game-path copy of sprite-art/animation/expanded-scope/pokemon-layer/
  moveScripts.json (PR #168 source). getMoveScript() in creatureAnimation.ts
  is the accessor. Pixi's existing lunge/projectile/status phases ARE the
  Layer-1 templates those scripts describe.

## Coverage counts (percentage rule — measured, not claimed)

- Sheet defs wired: 49/49 species = 100% (001–046 + 331 + 147 + 148).
  Game-ready folders: 51/51 = 100% in the registry (49 species + 2
  Strikechamp variants).
- Idle loops: 51/51 folders = 100%, 204 frames (4 per folder incl. repeats).
- Hurt cells: 51/51 folders = 100%, Pixi-rendered on the hurt pose.
- Attack-transform sets: 51/51 folders = 100% registry-wired, 207 frames;
  Pixi-rendered 0/51 = 0% (the Pixi timeline keeps transform treatments for
  these; the frames are the follow-up polish layer, not live-rendered yet).
- Articulation sets: 96/96 sets = 100% registry-wired, 528 cells, 24 entries.
  By layer: v3q finals 44/96 sets = 46% (242 cells, 11 entries), V2 eyes-only
  fallback 52/96 sets = 54% (286 cells, 13 entries). Mouths: 41/96 sets = 43%
  (fresh or reuse-proof); the rest ship eyes-only, never forced.
  Pixi-rendered: physical + special sets for all 24 entries (signature/heavy
  sets are registry-available, not auto-selected — no signature/heavy
  category exists in BattleAttack).
- Pilots: 2/2 creatures = 100% (Mochii, Dreadtoise), 8 attack sets, 44 cells,
  plus pilot hurt sets recorded in the registry (not Pixi-rendered; the
  single hurt cell carries hurt in battle). PILOT-GRADE, never shown to Mars
  yet — see the pilot VERIFICATION.md files; they stay labelled pilot here
  until Mars sees them.
- Discovery silhouettes: 51/51 folders = 100% registry-wired (49 species + 2
  Strikechamp variants). Live surface: portrait prop + Pixi fallback only;
  no dex view exists, so no screen passes undiscovered today — dex surface
  0% (owed, not invented here).
- Move scripts: 563/563 union scripts = 100% as data, 12/12 shared
  subroutines. Game moves.ts moves matching a script by id: 10/36 = 28%.
  Per-move step sequencing beyond category: owed, not invented.
- Shinies: 0% BY ORDER. The shiny-v2 set is staged show-first and NOT
  approved, so nothing shiny is referenced anywhere in this PR.
- Dorowani V3 mouths: 0/4 = 0% (no distinct mouth line on the front cell,
  re-verified at full-res; eyes-only ships). Gabu V3: 4/4 = 100%, stands.

## Data-quality findings (found while generating, not hidden)

- The v3q top manifest claims 24 entries / 528 cells, but only 11 entries'
  v3q cells actually exist on main (242 cells). The other 13 entries
  (dorowani, inklet, krakenox, pebblefist, pyromonk, razorgater, squirmite,
  stormtalon, strikechamp, terradog, toxitacle, yogiferno, zephling) fall
  back to their V2 eyes-only sets in this registry. Uploading the missing
  v3q cells is a separate lane task, not guessed here.
- Hurt JSONs: 4/51 name a locked source cell in frames[0].file instead of
  the hurt PNG (aquariios, chromejaww, reaperdile, tiidebiite). The registry
  uses the actual hurt PNG in each hurt dir (matching the reconciled JSONs).
- Attack JSONs: 1/51 carries duration_ms: null (strikechamp_unsuited_full,
  extracted cells kept as-is). Recorded as 0, not a crash.
- spriteSheets.ts '039' def name field says "Dreadtoise" while its atlas is
  shellguard (039 is Shellguard; 040 is Dreadtoise). NOT changed here — the
  display name comes from SPECIES_DB, not the def name — but it is a real
  data bug for a follow-up fix, recorded here.
- Pivot package: leg-gap-showfirst-20261026.png sits in the local pivot dir
  but belongs to the leg-gap lane (show-first, no deletion); it is
  deliberately EXCLUDED from this PR's pivot upload (15 files, not 16).

## Still owed after this PR (percentage rule)

- Attack-transform frames Pixi-rendered: 0/51 = 0% (registry-wired only).
- Signature/heavy articulation auto-selection: 0/48 sets = 0% (no category
  in BattleAttack; needs per-move selection design).
- Per-move move-script step sequencing beyond category: 26/36 game moves
  have no exact script match (10/36 = 28% matched).
- Dex / undiscovered surface: 0% (no dex view exists).
- Dorowani V3 mouths: 0/4, pending Mars's decision (see pivot mouth note).
- Shiny wiring: 0%, pending Mars's approval of shiny-v2.
- Bake PNG file deletion: 0/8 deleted (retained as history; Mars's call).
- Battle-cut keep-or-swap: Mars's call (default KEEP shipped).
- GitHub Pages deploy: separate step, not in this PR.
