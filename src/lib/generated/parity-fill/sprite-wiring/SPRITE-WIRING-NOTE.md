# Pokemon-parity fill slice 5 — sprite wiring + menus/UI cleanup shape
## Date: 2026-10-26. Status: STAGED ONLY. NO commit, NO push, NO PR, NO game-repo edit, NO file Mars has seen overwritten, NO art re-rendered.
## Rule followed: Mars, 2026-10-26 ~13:07 — bring Pokemon systems straight over and plug them in, swapping only literal Pokemon things (species/characters, logos, literal in-game dialogue). Everything else — systems, structure, mechanics, data shapes — comes over literally.
## Out of scope, untouched on purpose: menu art (UI round-2 matched-frame menu fix is in flight — NOT touched, NOT redone); audio generation (cry hook only); any deletion or rename (see blocker 3, leg-gap purge).

## Files staged by this slice (all NEW files, none overwrites)
- `sprite-wiring-manifest.json` — 51-creature wiring map + counts + global slots.
- `sprite-wiring.ts` — staged module shape (types + CREATURE_SPRITE_WIRING + getBattleSprite / getTeamSprite / getShinyFront / getFootprint / getCry). NOT imported by the game.
- `menu-meta-replacement-table.md` — 43-string proposal, NOT APPLIED.
- This note.

## Pokemon element -> Mochiichao replacement in that exact spot -> HAVE / NEED TO MAKE
| Pokemon slot (decomp evidence) | Mochiichao replacement in that slot | HAVE / NEED TO MAKE |
|---|---|---|
| Battle front sprite (FR `graphics/pokemon/<species>/front.png`; BW2 `res/pokemon/<species>/front.png`) | Locked battle_front per creature, mapped in manifest + TS | HAVE (staged map 50/51 + 1 flagged); NEED TO MAKE (copy into `src/assets/sprites/<slug>/` + sheet defs — coordinator's apply step) |
| Battle back sprite (FR/BW2 `back.png`) | Locked battle_back role per creature | HAVE (50/51); NEED TO MAKE: Mechapion true back (1) — no back role assigned, never guessed |
| Party/menu icon (FR/BW2 `icon.png`) | Icon role cell per creature | HAVE (51/51 staged); NEED TO MAKE: Mars approval for 10 derived head-crops (41/51 = 80% approved) |
| Shiny palette (FR/BW2 `normal.pal` / `shiny.pal` — palette swap, NOT new art) | Shiny-v2 front + palette per creature, rebuilt from freshest source | HAVE (51/51 fronts + 51/51 palettes, staged, NO PR); NEED TO MAKE: live SHINY-ON wiring (live 0/51) |
| Footprint (FR/BW2 `footprint.png`, Pokedex feature) | Real foot/paw print traced from feet, or NO-FOOTPRINT with reason | HAVE (37 prints + 14 reasoned no-footprints, staged show-first, NO PR); NEED TO MAKE: MochiDex wiring |
| Overworld 4-dir walk (FR `graphics/object_events/pics/pokemon/*.png`; HGSS follower system) | Walk-frames dir per creature | HAVE (50/50 dirs, 42 full 8-frame); NEED TO MAKE: walk-gate decision + wiring; 1 look (strikechamp_unsuited_full) has no separate walk dir — decision owed |
| Cry audio (BW2 `res/pokemon/<species>/cry.wav`) | Per-creature cry audio | NEED TO MAKE (0/51). Hook shape only: `getCry()` returns null for all 51 today; callers treat null as silence. NO audio generated here |
| Title screen / intro art (per-game title + intro) | Second title action shots | HAVE staged (10/10 creatures, see correction below); NEED TO MAKE: PR gating + live playtest + wiring (live 0/10) |
| Menu labels (FireRed `src/option_menu.c`: NEW GAME / CONTINUE / OPTIONS; Text Speed / Battle Scene / Battle Style / Sound / Button Mode / Frame / Cancel) | Clean Mochiichao-words labels in the same slots (menu-meta table) | HAVE (43 proposal wordings written); NEED TO MAKE: all 43 game edits — BLOCKED on Mars approval |
| BattleView / Team screens | BattleView (enemy=front, player=back); RosterView IS the team path (no TeamView.tsx exists) via CreaturePortrait | HAVE (paths named per creature in manifest); NEED TO MAKE: the actual wiring edit (coordinator) |

## Per-item counts with percentages (percentage rule)
- Creatures mapped: 51/51 = 100% in this staged module.
- Wiring status, staged-module sense (WIRED-STAGED = mapped here, NOT live): WIRED-STAGED 50/51 = 98%; STAGED-UNWIRED 1/51 = 2% (mechapion back only); MISSING at creature level 0/51 = 0%.
- Live wired, verified: 0/51 = 0%. This is the honest headline — this slice stages the map, it does not wire the game. `spriteSheets.ts` today imports ONLY dorowani (147) + gabu (148) sheets; all other species render CreaturePortrait's coloured-silhouette fallback + "Art in progress" label (menu-meta item #30).
- Battle front: 50/51 = 98% mapped cleanly; strikechamp_unsuited_full mapped from game-ready (30 cells) but NOT lock-verified (no separate locked atlas) — flagged, not hidden.
- Battle back: 50/51 = 98%; mechapion STAGED-UNWIRED (cells exist, no back role — pose-only per audit).
- Icons: 51/51 = 100% staged; Mars-approved 41/51 = 80%; 10/51 = 20% derived head-crops await Mars.
- Idle: 51/51 = 100%. Hurt: 51/51 = 100%. Attack sets: 51/51 = 100% (408 expanded sets; pose-redrawn 0/51 — Layer 2, beyond Pokemon parity).
- Shiny-v2: 51/51 = 100% fronts + 51/51 = 100% palettes staged; sources changed vs old shiny 17/51 = 33%, unchanged 34/51 = 67% (verified from SOURCE-LINEAGE.json this pass).
- Footprints: 37/51 = 73% prints; 14/51 = 27% NO-FOOTPRINT with reasons (aquariios, astroleviathan, cocoonode, duskfiend, finblade, floatcalf, inklet, krakenox, megalochrome, mochii, squirmite, toxitacle, wispkin, zephling) — feet never invented. Silhouettes (PR #175) are NOT footprints and are NOT counted here.
- Walk dirs present: 50/51 = 98%; full 8+ frames 42/50 = 84%; partial by design 8/50 = 16% (aerobeak 4, finblade 4, floatcalf 6, megalochrome 4, mothrix 4, squirmite 4, stormtalon 5, zephling 4 — flyer/swimmer/hover movement, not leg-walk shortfall).
- Cry audio: 0/51 = 0% wired; hook 51/51 = 100% present in TS.
- Title second action shots: staged 10/10 = 100%; wired live 0/10 = 0%.
- Menu meta: proposal rows 43/43 = 100% carried over verbatim from the audit; applied 0/43 = 0%.
- Dorowani/Gabu pivot-2D (for the coordinator): sets verified complete 2/2 = 100% (13 + 20 locked cells); game-path mapping 8/8 = 100% staged; Dorowani V3 mouths 0/4 = 0% (no front mouth line — eyes-only ships, Mars decision owed); Gabu V3 4/4 = 100% stands untouched.

## Corrections recorded this pass (so the coordinator does not propagate stale figures)
1. Task brief said "second title action shots 0/10". The 0 is the LIVE-wired count. Staged set exists and was verified this pass: `ui-art/title-backgrounds/action-shots/` holds 13 files / 7.8 MB across 10 creatures (dorowani, gabu, kittember, mochii, mythar, razorgater, sproutle, tyrage, wispkin, yogiferno; Tyrage v2 FINAL and Gabu v3 kept alongside earlier versions, nothing overwritten). PR gating + live playtest still owed; NOT claimed done.
2. Task brief said "walk frames 15/50 = 30%". That is the OLD QA PASS baseline from `walk-frames/WALK-INDEX.md` (2+ frames x 4 dirs, QA-verified; later reconciled in that file to 29/51 = 57% at that batch's Step 1 end). Current disk state is different and is what the manifest records: 50/50 walk dirs present, 42/50 full 8-frame = 84%. QA re-verification of the 42 full dirs is still owed — disk presence is not QA pass.
3. "51 attack sets exist as art, 0/51 wired live" stands: attack/hurt dirs exist for all 51 slugs (verified this pass), live wiring remains 0/51.

## Validation results
- `sprite-wiring-manifest.json`: parses — `python3 -m json.tool` PASS. All 51 slugs present; footprint PNGs 37/37 exist for FOOTPRINT entries; shiny fronts + palettes 51/51 exist; idle/attack/hurt dirs 51/51 exist.
- `sprite-wiring.ts`: `tsc --noEmit --strict` PASS (exit 0, no errors). All 51 manifest slugs appear in the TS map; all five resolver exports present (getBattleSprite, getTeamSprite, getShinyFront, getFootprint, getCry).
- `menu-meta-replacement-table.md`: 43/43 audit rows parsed and carried over (verified by row count); cluster sums re-add to 43.
- No game file was edited by this slice: all 3 new files sit under `mochiichao-work/pokemon-parity-fill/sprite-wiring/` (outside the `fresh-start` repo). Pre-existing modifications inside `fresh-start` (other lanes' in-flight work) were not touched.

## Blockers / decisions owed (nothing here was silently decided)
1. MENU REMOVALS AWAIT MARS APPROVAL — the 43-string replacement table is a proposal only. 0/43 applied. Do not apply until Mars approves that list.
2. LIVE WIRING IS THE COORDINATOR'S APPLY STEP — this module is staged and unimported. Applying means: copy staged art to `src/assets/sprites/<slug>/`, add sheet defs to `spriteSheets.ts`, point BattleView/RosterView at them, then playtest (Region 1 playtest previously showed placeholders).
3. LEG-GAP WHITE-SPACE PURGE (Mars, 2026-10-26 ~13:11 CDT, standing — landed during this slice): EVERY file that says "locked" and has the white gap between the legs must be DELETED and replaced by corrected edits renamed to the locked names, SHOW-FIRST before any deletion (audit -> show offenders to Mars -> delete + rename). This slice deleted and renamed NOTHING, per its staged-only scope. The wiring manifest points at locked/game-ready sources, so the coordinator must run the purge sequence FIRST (or re-point any purged source) before applying wiring — otherwise wiring could land an offender file Mars already ordered purged. The purge itself is a separate, show-first job, not done here.
4. Mechapion true battle_back (1) — needs a role assignment or a new back; never guessed.
5. Icon approval: 10 derived head-crops await Mars.
6. Walk-gate decision (8 partial-by-design dirs) + strikechamp_unsuited_full walk decision (share base look's walk vs make a set) — both owed before shipping walk wiring.
7. Dorowani V3 mouths 0/4 — Mars decision owed; eyes-only ships in the meantime.
8. Cry audio 0/51 + move-to-attack-set assignment 0/51 — separate slices; hooks/shapes only here.
9. UI round-2 matched-frame menu fix in flight — not touched; menu text proposals here must not be merged into menu art work.
10. Main moved during this slice (PR #177 3D checkpoint merged, main 0b637a4e) — this slice's files are staging outside the repo, so they are unaffected; the coordinator should still re-check base before applying wiring.
