# Dojo/elite verification — 2026-10-26 (staged only)

**STAGED ONLY. NOT PR'd, NOT wired, NOT live.** No core gaps, no admin art, and PR #210 were touched. No file was generated, re-rendered, or replaced in this run. No Mars-seen file was overwritten. Dialogue was NOT written or re-asked.

## Verdict: 72/72 = 100% on files — claim STANDS, no correction

- Dojo/elite: **72/72 = 100%** (9 characters x 8/8). 0 missing, 0 corrupt, 0 wrong-character files.
- Per character: model draft + data + world + walk + battle front + portrait + atlas + special N/A = 8/8 each.
- Mars-confirmed subset: Hono + Yoru = **16/72**, blanket-confirmed 2026-10-26 17:40. The other 7 characters = **56/72** file-complete; Mars eye-check is still owed on them — this report is the eye-check presentation, not a lock.
- Walk ruling CLOSED 17:40 applies: stride-phase / front-facing walk files are accepted as-is. Atlas step cells 8-11 are counted as the walk step even though their manifest names (walk_front_step etc.) do not describe true per-direction steps. No per-direction/side-view walk re-render is owed for these characters.

## Why the step-8 files could not be trusted as-is

- The combined `dojo-elite-step8-2026-10-26.json` still carries old steps dicts (1=DRAFT, 2–5/8=OWED, 6=N/A, 7=STAGED) and counts 2/8 per character.
- The per-character `*-step8-2026-10-26.json` files have NO steps key at all.
- This verification was therefore done FROM DISK: every source file opened (dimensions/format), non-zero bytes checked, each atlas opened cell-by-cell (64 px, 14 cells, hashes), manifest source filenames checked against disk, and a 5-panel montage per character eye-checked against the locked look. Neither stale file was edited.

## Atlas cell mapping (all 9, verified)

| Cell | Position (x,y) | Content |
|---|---|---|
| 0 | (0,0) | world_front |
| 1 | (64,0) | world_back |
| 2 | (128,0) | world_left |
| 3 | (192,0) | world_right |
| 4–7 | row 2 | walk idle = world cells 0–3 (exact duplicates, hash-verified) — EXCEPT Tetsu, whose idle cells are distinct (see Tetsu note) |
| 8–11 | row 3 | walk step cells = stride phases (front-facing strides for Umi/Hono); named walk_front/back/left/right_step in manifests but NOT true per-direction steps — covered by the walk ruling |
| 12 | (0,192) | battle_front |
| 13 | (64,192) | portrait |
| 14–15 | row 4, cols 3–4 | unused, black/transparent (expected: 14 cells in a 4x4 grid) |

Atlas size for all 9: 256x256 RGBA, 64 px cells. Unique cell hashes: 10/14 for 8 characters (idle duplicates world, by design) and 14/14 for Tetsu.

## Per-character file-by-file

### tetsu — Dojo 3, Chrome, Neon City — 8/8
- Locked look: steel-grey riveted jacket, dark trousers, steel-grey boots, iron pendant, belt pouch; light skin, short black hair, grey eyes, lean build
- 1 model draft: PRESENT — media-generation-dojo-leaders-model-sheet-2026-10-26-a.webp (grid_a, left panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); no per-character step8 file - see note
- 3 world: PRESENT — media-generation-dojo-elite-tetsu-world-views-v-0-d22ee2d3-1e1e-450e-9ba9-47e89b6d6d96.webp (1920x1280, 247826 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-tetsu-walk-frames-v-0-74065972-07fb-4785-b599-08e35d9ead3b.webp (2240x1120, 217892 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-tetsu-battle-front-0-afe0c43b-9127-4ad2-afe6-4f39f52b3e19.webp (1120x2240, 172240 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-tetsu-portrait-v1-2-0-66c95bbf-e68a-4f28-8e85-d21c5d25a837.webp (1600x1600, 207496 bytes)
- 7 atlas: PRESENT — tetsu-atlas-64x64.png (256x256, 111626 bytes) + tetsu-atlas-manifest.json (2236 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - No per-character tetsu-step8-2026-10-26.json on disk (see data note - data step is the combined JSON entry, not a missing art file).
  - Atlas idle cells 4-7 are NOT duplicates of world cells 0-3 (all 14 cell hashes unique) - Tetsu's walk sheet carries a second band, so idle comes from walk, unlike the other 8.
  - Walk accepted as-is under the 17:40 walk ruling; no per-direction re-render owed.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-tetsu-2026-10-26.jpg` in this folder

### kenji — Dojo 4, Strike, Market City — 8/8
- Locked look: red/black sleeveless training jacket over dark undershirt, hand wraps, dark trousers, cloth sash; medium tan skin, dark brown tied-back hair, brown eyes, muscular build
- 1 model draft: PRESENT — media-generation-dojo-leaders-model-sheet-2026-10-26-a.webp (grid_a, middle panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus kenji-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-kenji-world-views-v-0-4c734446-a14a-49de-9fd9-86a97ed6e505.webp (1920x1280, 140698 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-kenji-walk-frames-v-0-a5d16e82-7545-4b87-b5c2-4a9a3f3519a2.webp (2736x912, 192308 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-kenji-battle-front-0-7c347737-ff1f-4f28-92cd-9b737c5e48d5.webp (1120x2240, 247290 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-kenji-portrait-v1-2-0-7653328d-4d95-4b75-9294-d0c661d9e99d.webp (1600x1600, 253530 bytes)
- 7 atlas: PRESENT — kenji-atlas-64x64.png (256x256, 106379 bytes) + kenji-atlas-manifest.json (2436 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): all 4 walk frames face image-right in stride order; atlas step cells 8-11 are stride phases, NOT true front/back/left/right steps.
  - PORTRAIT ADDED SCARF: black scarf/drape across the chest, not in the attribute block and not in world/battle sheets (sash at waist there). Flagged, NOT replaced - Mars decides keep vs re-render.
  - BATTLE HAIR: topknot/spiky crown reads slightly different from world sheet's tied-back ponytail; same colour and tie.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-kenji-2026-10-26.jpg` in this folder

### phantom — Dojo 5, Umbral, Central City — 8/8
- Locked look: red Japanese oni mask with gold horns (LOCKED look), black/deep-purple samurai armour plates over dark robe, purple sash, dark hakama, black sandals, sheathed sword
- 1 model draft: PRESENT — media-generation-dojo-leaders-model-sheet-2026-10-26-a.webp (grid_a, right panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus phantom-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-phantom-world-views-0-0eb31866-568e-4ede-8936-69e44f83ff8f.webp (1920x1280, 202440 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-phantom-walk-frames-0-6350bc69-8272-46be-9665-213897d121b7.webp (2736x912, 315524 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-phantom-battle-fron-0-0d138036-417a-4c66-8144-5aaa6ef1a9bd.webp (1120x2240, 419430 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-phantom-portrait-v1-0-cd069abc-ce11-4a5c-b37c-03d8ee4cb596.webp (1600x1600, 305036 bytes)
- 7 atlas: PRESENT — phantom-atlas-64x64.png (256x256, 119485 bytes) + phantom-atlas-manifest.json (2863 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): stride phases, not per-direction steps.
  - PORTRAIT DARK BACKGROUND: near-black background, not the plain light background of the other sheets; atlas portrait cell carries it. Flagged, NOT replaced.
  - GOLD TRIM DRIFT: walk and battle armour carry heavier gold trim than the world sheet's plainer plates. Same colours and mask.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-phantom-2026-10-26.jpg` in this folder

### shizuku — Dojo 6, Water, Harbor City — 8/8
- Locked look: teal/white wave-print jacket over white top, teal shorts, teal/white sandals, wave pendant, wristband; light-medium skin, long dark blue-black high side ponytail, teal eyes
- 1 model draft: PRESENT — media-generation-dojo-leaders-model-sheet-2026-10-26-b.webp (grid_b, left panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus shizuku-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-shizuku-world-views-0-d44f532b-63b3-4196-bf9e-3a7ec06e4d1d.webp (1920x1280, 240176 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-shizuku-walk-frames-0-df540bfc-10f3-4ffe-b959-f0bff9f40ff7.webp (2736x912, 308038 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-shizuku-battle-fron-0-863f65db-de28-4c32-a0df-074ed4a3781c.webp (1120x2240, 283154 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-shizuku-portrait-v1-0-5ff434b8-d5e3-4f5f-93ec-ce864bbb8962.webp (1600x1600, 352780 bytes)
- 7 atlas: PRESENT — shizuku-atlas-64x64.png (256x256, 111836 bytes) + shizuku-atlas-manifest.json (2496 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): stride phases, not per-direction steps.
  - PROPORTION MISMATCH: world-sheet figures read shorter/younger than walk/battle/portrait figures, which are taller. Atlas mixes both sets as generated. Flagged, NOT replaced.
  - PORTRAIT ADDED BOW: large teal bow tying the ponytail, not specified in the attribute block.
  - BATTLE FOOTWEAR: chunky white/teal trainers rather than the world sheet's sandals.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-shizuku-2026-10-26.jpg` in this folder

### homura — Dojo 7, Flame, Ember Island — 8/8
- Locked look: orange/black coat with orange/purple flame print over dark shirt, dark trousers with red trim, black boots with orange soles, flame pendant, fingerless gloves; medium brown skin, spiky black hair with red tips, amber eyes
- 1 model draft: PRESENT — media-generation-dojo-leaders-model-sheet-2026-10-26-b.webp (grid_b, right panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus homura-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-homura-world-views-0-a062f7a2-e5ed-4154-ab55-b35c77ccfbd5.webp (1920x1280, 262604 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-homura-walk-frames-0-8aca61b7-6f0a-4609-b29c-3036cc352d04.webp (2736x912, 281036 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-homura-battle-front-0-9f2077f0-cd8c-4d0e-802a-78e288d28543.webp (1120x2240, 308896 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-homura-portrait-v1-0-a4afedc7-b8b9-442d-94cc-8517ebb73c6b.webp (1600x1600, 331194 bytes)
- 7 atlas: PRESENT — homura-atlas-64x64.png (256x256, 108854 bytes) + homura-atlas-manifest.json (2338 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): stride phases, not per-direction steps; walk coat adds a hood not on the world sheet's coat.
  - BATTLE HAIR DRIFT: battle hair much redder and spikier than the world sheet's black hair with red tips. Flagged, NOT replaced.
  - PORTRAIT ADDED SCAR: small vertical scar/mark on the cheek under one eye, not present in any other sheet.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-homura-2026-10-26.jpg` in this folder

### umi — Elite 1, Water, Mainframe Plateau — 8/8
- Locked look: deep blue coat with silver wave pattern over navy dress, dark leggings, navy boots, silver wave pendant, sash belt; medium skin, short black bob, deep teal eyes
- 1 model draft: PRESENT — media-generation-elite-four-model-sheet-2026-10-26-a.webp (grid_c, left panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus umi-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-umi-world-views-v1-0-fd95b179-93cc-4a20-81d9-3013ef1a515d.webp (1920x1280, 148614 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-umi-walk-frames-v1-0-931f4e07-c96c-4980-91d0-c89e4631d497.webp (2736x912, 225126 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-umi-battle-front-v1-0-ad7d8fff-bb28-4a3c-bbb8-107b22b5b6e1.webp (1120x2240, 246652 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-umi-portrait-v1-202-0-ddcacfc1-4e5e-4542-9a3b-d30dd491b2a8.webp (1600x1600, 221136 bytes)
- 7 atlas: PRESENT — umi-atlas-64x64.png (256x256, 107447 bytes) + umi-atlas-manifest.json (2539 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK FRONT-FACING (covered by 17:40 walk ruling): all 4 walk frames face the viewer (front 3/4) while striding; atlas step cells 8-11 are front-facing strides, NOT side steps and NOT per-direction steps.
  - COAT LENGTH DRIFT: walk and battle coats read shorter (capelet/short coat) than the world sheet's long coat. Flagged, NOT replaced.
  - PORTRAIT PENDANT: silver CRESCENT, not the wave pendant of the world/battle sheets.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-umi-2026-10-26.jpg` in this folder

### gin — Elite 2, Chrome, Mainframe Plateau — 8/8
- Locked look: silver/charcoal suit jacket with chrome panels over grey shirt, dark trousers, polished silver-grey boots, chrome chain, black gloves; pale skin, silver-grey slicked hair, grey eyes
- 1 model draft: PRESENT — media-generation-elite-four-model-sheet-2026-10-26-a.webp (grid_c, right panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus gin-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-gin-world-views-v1-0-c6e9ff0f-fa22-4f18-a2a8-a841ce79fbbd.webp (1920x1280, 274408 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-gin-walk-frames-v1-0-ef1ba28f-8743-4fda-a264-d006e8134e7f.webp (2736x912, 179540 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-gin-battle-front-v1-0-19c8904d-8d46-4b61-a260-c013b9111f23.webp (1120x2240, 199498 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-gin-portrait-v1-202-0-a52df23d-8f98-4be7-8015-bdd85e4e9308.webp (1600x1600, 309582 bytes)
- 7 atlas: PRESENT — gin-atlas-64x64.png (256x256, 108051 bytes) + gin-atlas-manifest.json (2273 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: still owed (this report is the eye-check presentation; no lock claimed)
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): stride phases, not per-direction steps.
  - SIDE-VIEW CHAIN: side views show the chrome chain draped down the back, not just as a necklace at the neck.
  - BATTLE BOOTS: tall knee-high chrome boots; world sheet's boots are ankle boots. Flagged, NOT replaced.
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-gin-2026-10-26.jpg` in this folder

### hono — Elite 3, Flame, Mainframe Plateau — 8/8
- Locked look: crimson/black coat with orange/gold flame print over dark top, dark skirt over leggings, black boots with red soles, gold hoops, flame pendant; warm brown skin, curly dark hair with red streaks, brown eyes
- 1 model draft: PRESENT — media-generation-elite-four-model-sheet-2026-10-26-b.webp (grid_d, left panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus hono-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-hono-world-views-v1-0-c9ed6638-772b-430b-bc51-502284b7510e.webp (1920x1280, 177850 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-hono-walk-frames-v1-0-5a18b799-0c59-42b3-9c62-3dfcf474f18c.webp (2240x1120, 309228 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-hono-battle-front-v-0-d1f0cd5e-524e-4c31-a542-2e2bd9f32f04.webp (1120x2240, 275384 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-hono-portrait-v1-20-0-bd89689f-ed89-463b-9bfe-ea33eef10404.webp (1600x1600, 344870 bytes)
- 7 atlas: PRESENT — hono-atlas-64x64.png (256x256, 112413 bytes) + hono-atlas-manifest.json (2353 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: blanket-confirmed 2026-10-26 17:40
- Flags carried forward (NOT silently replaced):
  - WALK FRONT-FACING (covered by 17:40 walk ruling): front-facing strides, NOT side/per-direction steps.
  - WALK CUT METHOD: column run detection merged all 4 walk frames into one run (coats/hair bridge gaps in projection); steps cut by equal quarters + per-quarter trim instead. Recorded in manifest.
  - PORTRAIT CHAIN: pendant hangs on a gold chain; world sheet's pendant hangs on a dark cord. Minor drift, flagged.
  - MARS STATUS: blanket-confirmed 17:40 (sheets + atlas as shown).
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-hono-2026-10-26.jpg` in this folder

### yoru — Elite 4, Umbral, Mainframe Plateau — 8/8
- Locked look: black/deep-purple coat with silver crescent pattern over dark shirt, dark trousers, black boots, silver crescent pendant, dark sash, wristband; dark brown skin, short black hair, dark eyes
- 1 model draft: PRESENT — media-generation-elite-four-model-sheet-2026-10-26-b.webp (grid_d, right panel)
- 2 data: PRESENT — dojo-elite-step8-2026-10-26/dojo-elite-step8-2026-10-26.json (combined entry: slot/badge/team/theme/location/look); plus yoru-step8-2026-10-26.json
- 3 world: PRESENT — media-generation-dojo-elite-yoru-world-views-v1-0-e828586c-08bd-4b58-bc9b-8b37c2439e5d.webp (1920x1280, 121164 bytes)
- 4 walk: PRESENT — media-generation-dojo-elite-yoru-walk-frames-v1-0-ead1be42-7fd1-4fab-af81-e87d78d91696.webp (2736x912, 153598 bytes)
- 5 battle front: PRESENT — media-generation-dojo-elite-yoru-battle-front-v-0-aacc446b-9725-4667-9b37-26913fa5af7c.webp (1120x2240, 219468 bytes)
- 6 portrait: PRESENT — media-generation-dojo-elite-yoru-portrait-v1-20-0-666bf433-5cee-4183-a483-ad65f872b7db.webp (1600x1600, 185448 bytes)
- 7 atlas: PRESENT — yoru-atlas-64x64.png (256x256, 106144 bytes) + yoru-atlas-manifest.json (2420 bytes), 14 cells mapped as above
- 8 special: N/A (no special variant for any of the 9)
- Visual verdict: MATCHES locked look at montage eye-check (this run); drift flags above are off-reference details carried forward, NOT missing/corrupt/wrong-character files, and were NOT silently replaced.
- Mars eye-check: blanket-confirmed 2026-10-26 17:40
- Flags carried forward (NOT silently replaced):
  - WALK SINGLE-DIRECTION (covered by 17:40 walk ruling): right-facing strides, NOT per-direction steps.
  - WALK PATTERN DRIFT: walk coat's crescent pattern much sparser (small crescents on purple lining only) than the world sheet's all-over crescents.
  - BATTLE SLEEVES: battle coat sleeves wider/kimono-style than the world sheet's narrower sleeves.
  - MARS STATUS: blanket-confirmed 17:40 (sheets + atlas as shown).
- Show montage (world + walk + battle front + portrait + atlas, grouped): `dojo-elite-show-yoru-2026-10-26.jpg` in this folder

## Files created this run (staged only, human-lane-100/)

- `dojo-elite-verification-2026-10-26.json` — full per-character, per-file, per-cell verification record
- `DOJO-ELITE-VERIFICATION-2026-10-26.md` — this report
- `dojo-elite-show-{tetsu,kenji,phantom,shizuku,homura,umi,gin,hono,yoru}-2026-10-26.jpg` — 9 grouped show montages

## Not done / not claimed

- No PR, no wiring, no live deploy. Core gaps (45/280 per the 17:40 recount) and admin art (60/80 owed) were NOT touched. PR #210 was NOT touched.
- Mars eye-check / lock for Tetsu, Kenji, Phantom, Shizuku, Homura, Umi, Gin is still owed; the drift flags above are Mars decisions (keep vs re-render), not agent decisions.
- Tetsu administrative note: there is no per-character `tetsu-step8-2026-10-26.json` on disk. That is NOT counted as a missing art step, because Tetsu's data step is the combined JSON entry (slot/badge/team/theme/location/look) plus his atlas manifest, and all 7 art files + atlas + manifest are present. If the parent wants strict per-character file parity, the one file to create would be a Tetsu step-8 record — this verification JSON already serves as that record for this run.