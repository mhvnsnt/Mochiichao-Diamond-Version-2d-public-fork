# PIVOT PHASE 2 — 3D → 2D REPLACEMENT MAPPING (2026-10-26, staged, NO PR)

Mars order 2026-10-26 ~12:53 CDT: Dorowani (#147) + Gabu (#148) 3D rig sprites
REPLACED with their 2D sprites; get them animated. Phase 3 does the game
wiring after Phase 1 merges. This doc is the mapping Phase 3 works from.
NO live game file was edited in this phase. NO file Mars has seen was
overwritten. All Phase 2 outputs live under
`sprite-art/animation/expanded-scope/pivot-2d-20261026/`.

## 0. What "3D" actually means in the game path — verified, not assumed

Grepping the whole fresh-start work-clone `src/` (excluding node_modules)
for dorowani/gabu/147/148 + rigged/glb/Tripo finds:

- NO `.glb` is loaded by the game. NO rigged sheet is imported anywhere.
  The rig-animation outputs (below, §3) were NEVER wired into the game.
- What IS in the game path for 147/148 is 2D PNGs rendered FROM 3D models:
  Blender EEVEE bakes of Mars's Tripo GLBs (static poses, front/back/side).
  Those bake PNGs + their Tripo-source manifests are what leaves the game
  path in this pivot. The game eats 2D PNGs either way — the pivot changes
  WHICH 2D art: model renders out, locked 2D-sheet cells in.
- The battle three-quarter cuts are ALREADY 2D art, verified by hash:
  game `dorowani-player-threequarter-right-cut.png` is byte-identical
  (md5 f80f216d25bd536821d6909b032f5d5b) to the ui-art cutout, and game
  `gabu-threequarter-left-cut.png` is byte-identical (md5
  84fabf52c91cc09f0a82ddbc053d370b) to its ui-art cutout. Both are crops
  of the 2D angles sheets per `spriteSheets.ts` comments — NOT rig renders.
  They are listed in §2 as verified-2D, with a Phase 3 choice (keep vs swap
  to locked battle cells for a single canonical source).

## 1. GAME-PATH replacements (Phase 3 wiring list — do NOT wire until Phase 1 merges)

Paths below are relative to the fresh-start repo work clone
(`~/workspace/mochiichao-work/fresh-start/`).

| # | Game-path file now (OUT) | Why it goes | 2D replacement (IN) | Source |
|---|---|---|---|---|
| 1 | `src/assets/sprites/dorowani/dorowani_sheet.png` (192x64: front/back/side Tripo bakes) | 3D-model bake | `dorowani_atlas_64_locked.png` (384x192, 13 cells) — or its cells individually | `sprite-art/game-ready/dorowani/` + locked manifest `dorowani.manifest.locked.json` |
| 2 | `src/assets/sprites/dorowani/dorowani_front_64.png`, `dorowani_back_64.png`, `dorowani_side_64.png` | 3D-model bake cells | front → `dorowani_cell_00.png` (battle_front); back → `dorowani_cell_01a.png` (battle_back, split from merged-pair cell 1); side → `dorowani_cell_03.png` (overworld_side) | same locked set |
| 3 | `src/assets/sprites/dorowani/dorowani.manifest.json` | says `source: Mars's own Tripo model, baked from GLB` | locked manifest `dorowani.manifest.locked.json` (source_sheet `dorowani_sheet_v1.webp`, 1920x1280, 2D sheet) | `sprite-art/game-ready/dorowani/` |
| 4 | `src/assets/sprites/gabu/gabu_sheet.png` (192x64 Tripo bakes) | 3D-model bake | `gabu_atlas_64_locked.png` (384x256, 20 cells) | `sprite-art/game-ready/gabu/` + locked manifest `gabu.manifest.locked.json` |
| 5 | `src/assets/sprites/gabu/gabu_front_64.png`, `gabu_back_64.png`, `gabu_side_64.png` | 3D-model bake cells | front → `gabu_cell_02.png` (battle_front); back → `gabu_cell_03.png` (battle_back); side → `gabu_cell_08.png` (walk_side_0) | same locked set |
| 6 | `src/assets/sprites/gabu/gabu.manifest.json` | says Tripo/GLB source | locked manifest `gabu.manifest.locked.json` (source_sheet `gabu_sheet_v1.webp`, 1920x1280, 2D sheet) | `sprite-art/game-ready/gabu/` |
| 7 | `src/lib/spriteSheets.ts` imports + `SHEET_DEFS['147'/'148']` (sheetUrl, frames front 0 / back 64 / side 128, cellSize 64) | points at bake sheets | repoint at the locked atlases/cells above; frames become atlas coords from the locked manifests (Dorowani front (0,0), back (64,0), icon (0,128); Gabu front (128,0), back (192,0), icon (64,64)) | locked manifests |
| 8 | `src/lib/spriteSheets.ts` header comment ("baked from his own Tripo models") + `src/components/game/PixiBattleCanvas.tsx` aspect comment (Dorowani 455x585 / Gabu 532x497 portrait cuts) | describes 3D-bake + portrait-cut aspects | rewrite to locked-2D source; portrait aspect handling changes because locked battle cells are 64x64, not tall portrait cuts | — |

Code-only references that need NO art change (they resolve through
`spriteSheets.ts` once §1 rows 7–8 land): `src/components/views/RosterView.tsx`
(147/148 roster lines), `src/components/views/ArenaBattleView.tsx` (test
opponents), `src/components/game/CreaturePortrait.tsx` (147/148 comment),
`src/lib/validate-reference.ts` (147/148 entries), `src/world/FullWorldMaps.ts`
(`dorowani_display` / `gabu_display` NPCs, `sprite:""`, resolve via sheet def),
`src/lib/humanSheets.ts` (comment only), provenance notes
(`pret-gen1-4-PROVENANCE.md` §86, `gen5plus/PROVENANCE.md` §21 — notes, not art).

Note on the path the task named: `src/assets/sprite-atlases/` does NOT exist
in this work clone. The locked-atlas lineage here is
`sprite-art/atlases/<creature>/` + `sprite-art/game-ready/<creature>/`
(same locked manifests). Phase 3 must confirm against repo main whether a
`src/assets/sprite-atlases/` copy exists there; if it does, it takes the
same replacement (locked atlas in, bake out).

## 2. VERIFIED-2D — stays, Phase 3 choice only

| Game-path file | Provenance (verified) | Phase 3 choice |
|---|---|---|
| `src/assets/sprites/dorowani/dorowani-player-threequarter-right-cut.png` | 2D angles-sheet crop, md5-identical to `ui-art/cutouts/` copy | KEEP as battle-player art, OR swap to locked `dorowani_cell_00.png` for one canonical source — Mars's call |
| `src/assets/sprites/gabu/gabu-threequarter-left-cut.png` | 2D angles-sheet crop, md5-identical to `ui-art/cutouts/` copy | KEEP as battle-opponent art, OR swap to locked `gabu_cell_02.png` — Mars's call |
| Superseded cuts `dorowani-front-2d-cut.png`, `dorowani-back-2d-cut.png`, `gabu-front-2d-cut.png` (ui-art/cutouts only, not imported by the game) | 2D cuts, already superseded per `spriteSheets.ts` | No action; do not reintroduce |

## 3. PIPELINE-ONLY 3D — stays LOCAL, never enters the game path

These were checked, NOT deleted (checkpoint rule), NOT wired, and must NOT
be imported by Phase 3. Listing them here is the guard against re-entry:

- `sprites-bake/rigged/dorowani/` — GameRig rig: `dorowani-rigged.glb`,
  `dorowani-rigged.fbx`, `dorowani-rig-manifest.json`, 18 previews
  (`previews/attack_f10_side.png` etc.), `v2-fixed/dorowani-v2-fixed.fbx` +
  manifest. Anim-check FAILS stretch thresholds on 5/6 clips (waist-patch
  tearing family) — one more reason it stays out.
- `sprites-bake/rigged/gabu/` — custom Blender rig: `gabu_rigged.glb`,
  FBX, 19 previews, `v2-fixed/gabu-v2-fixed.fbx` + manifest,
  `meshsep/` re-rig attempt work (component analysis, gate diags).
  Rig-check FAILS strict thresholds (dense-mesh stretch at attack contact).
  Iter 7 re-rig stopped at spawn, never ran (3D pause).
- `sprites-bake/sheets-rigged/dorowani/renders/` (28 rig renders:
  idle/ready/walk/attack/hit/faint fronts + walk sides) and
  `sprites-bake/sheets-rigged/gabu/renders/` (24 rig renders) — rig-bake
  outputs, never imported by the game.
- `sprites-bake/dorowani/` + `sprites-bake/gabu/` angle renders
  (`*_angle0/90/180/270.png`) — the static-pose EEVEE sources of the
  game bake sheets in §1. Kept as pipeline history only.
- `sprite-art/blender-bakes/` + `3d-checkpoint-2026-10-26-*` — bake/checkpoint
  history. Dorowani/Gabu Tripo GLBs stay LOCAL-ONLY per the 3D-pause order
  (public repo would expose Tripo assets/signed URLs) unless Mars
  explicitly orders them public.
- `sprite-art/animation/gabu-side-attack-preview/gabu_attack_side_512.png` —
  a 2D side-view attack preview built from locked `gabu_cell_08.png`, NOT a
  rig render (its own JSON says so). Harmless, but superseded by the
  pipev3q attack set — do not wire it as the attack.

## 4. Resulting game-path rule after Phase 3

After Phase 3 lands §1, the game path for #147/#148 contains ZERO 3D-model
renders and ZERO rig outputs: only locked 2D-sheet cells + their
articulation sets (idle/hurt/attack, §5 of the pivot manifest) + optionally
the §2 verified-2D battle cuts if Mars keeps them. Everything in §3 stays
in `mochiichao-work/` local history.

## 5. Counts (percentage rule)

- Game-path art files to replace: 8/8 mapped = 100% (6 bake PNGs + 2 manifests;
  spriteSheets.ts + PixiBattleCanvas comment are code rows, not art files).
- Game-path imports to repoint: 4/4 = 100% (2 sheet imports + 2 battle-cut
  imports — cuts are keep-or-swap, §2).
- Pipeline-only 3D locations listed, not wired: 6/6 = 100% (§3 bullets).
- Rig files deleted in this phase: 0 (deletion is not this task; checkpoint
  rule keeps history until Mars orders otherwise).
