# FINISH-FIRST Item 4 — Pixi-rendered attacks 51/51 (2026-10-26)

> DEFERRED, NOT FINISHED HERE (Mars correction 2026-10-26 ~16:38 CDT): VFX origin + direction is owned by the SEPARATE VFX origin + direction pass. This item wires Pixi attack rendering from the registry + move scripts and passes direction as a parameter only. It does NOT finish direction work, does NOT claim direction work finished, and does NOT duplicate the origin pass. What that pass still owns: blasts shoot FROM THE MOUTH (attack origin) — the old Dorowani jet sat at waist height disconnected from the mouth, going right, and is NOT fixed by this item; all opponent effects travel LEFT, all player effects travel RIGHT; the current Pixi projectile origin (attacker base centre, y-40) is NOT mouth-anchored; front-view mirror batch (638 cells) is NOT final direction work until the origin pass lands on it. Mirroring a cell alone does not fix origin.

## Counts (evidence, from main registry tables at branch base 0e93aecd)

- Roster folders: 51 = 49 species ids (#001–#046 + #147 Dorowani + #148 Gabu + #331 Mythar) + 2 Strikechamp variants (strikechamp_unsuited, strikechamp_unsuited_full).
- Attack-transform registry (ATTACK_TRANSFORM): 51/51 folders, 207 frames (50 folders x 4 frames + strikechamp_unsuited_full 7 cells). Before this item: 0/51 Pixi-rendered.
- Articulation registry (ARTICULATION): 24/24 folders, 96 sets — already Pixi-rendered before this item via attackSetFor (Physical -> physical set, Special -> special set).
- Pilot registry (PILOTS): 2/2 folders (mochii, dreadtoise) — already Pixi-rendered before this item (pilot by move id / by family).
- Rendered before this item: 26/51 folders (24 articulation + 2 pilots, disjoint sets). Rendered after this item: 51/51 folders = 100% (26 as before + 25 new transform fallbacks). The 25 newly rendered folders are listed below as `transform (NEW in this item)`.
- Per-move script sequencing: before, Pixi used game category only and never called getMoveScript(); after, resolvePixiAttack() resolves the script (exact-id + Phase 1 map) and its template drives motion. Game moves scripted: 35/36 = 97% (10 exact-id + 25 Phase 1 map). See per-move table.
- Precedence (unchanged for existing creatures): pilot by move id > pilot by family > articulation by category > transform fallback. No creature's previously rendered set changes; only folders with no set gain one.
- BattleView already passed moveId to PixiBattleCanvas (BattleView line ~297, setAttack with moveId); no BattleView change was needed or made.

## What changed (3 files, 0 deleted lines, 0 deleted files)

- EDIT src/lib/creatureAnimation.ts (pure additions only): attackTransformFor(), resolvePixiAttack(), PixiAttackMotion/PixiAttackRender types, plus an Item 4 header note. No table, loader, or existing function changed.
- EDIT src/components/game/PixiBattleCanvas.tsx (pure additions only, 93 added lines): new import line, Item 4 direction-deferral comment, pixiAttack resolution, transform-fallback frame loading + role schedule, stay-motion travel-target neutralisation. No existing branch line changed; onImpact/onDone timing untouched (impact at hold end s=90, done at s=790, as before).
- NEW docs/pixi-attacks-item4-20261026.md (this file).

## Motion rules (from the resolved move script's template, not the game category)

- special_projectile -> projectile (existing Pixi Special branch).
- physical_contact -> lunge (existing Pixi Physical branch).
- physical -> STAY: the script has no sub_Lunge step (impact only). Implemented by neutralising lungeEnd to the attacker base for stay-motion moves, so the existing travel and recover branches become no-ops. This changes visible behaviour for 8 scripted game moves that previously lunged incorrectly: AQUA_JET, RAZOR_LEAF, WILD_CHARGE, EARTH_TREMOR, MUD_BLAST, BULLDOZE, NIGHT_SLASH_MOVE, POISON_JAB (all template `physical`).
- multi_hit -> stay + beats = sub_MultiHitBeat step count (SWARM_STRIKE -> TWINEEDLE = 3 beats). Beat cycling (strike/impact alternating inside 700–1090 ms) applies ONLY to the transform fallback, whose roles are known; pilot/articulation sets play their native sequence.
- two_turn -> projectile (unleash variant). The charge turn is resolver-owned turn structure and is NOT faked as a second Pixi attack.
- No script (IRON_BARRAGE only, plus any moveId-less caller) -> game-category fallback, so the attack still renders.
- Status attacks: no attack frames, existing Status branch (glow, impact 500 ms, done 900 ms) untouched.

## Direction — parameter only, deferred (read before judging direction)

- Wired here: Pixi's existing `direction` parameter (player = +1 LEFT, enemy = -1 RIGHT) is passed to the treatments timeline (particle fan + recoil angles in battleTreatments) and lunge/projectile travel is positional between the two bases. That parameter wiring is unchanged and is all this item does for direction.
- NOT done here, owned by the separate VFX origin + direction pass: mouth-anchored origins; opponent effects travelling LEFT and player effects travelling RIGHT as drawn art (not just positional travel); the old Dorowani jet fix; front-view mirror batch finalisation. This item renders Dorowani's existing articulation special set (spray jet) as-is; its origin/direction defect is that pass's work, not fixed here.
- Transform frames need no mirror: they are direction-neutral front-facing lean transforms (verified on mochii attack_b_strike, a front-facing blob with no travel drawn in the frame). No sprite scale mirror is applied in this item.

## IRON_BARRAGE — still unmatched, NOT forced (Mars-gated)

- Game data conflicts with itself: description 'Fires 2–5 iron shards' = multi_hit timing, but effect field NONE = single-hit. GEAR_GRIND matches the description but contradicts the effect; METAL_CLAW matches the effect but contradicts the description. Left unmatched in gameMoveScriptMap.json (unchanged here) and in resolvePixiAttack() (returns script null, category fallback lunge). No game data was changed to force it. Mars call still owed: multi-hit (effect -> MULTI_HIT) or single-hit (description fixed).

## Version-lock check

- docs/locked-versions.json/.md on main checked: sole entry is Razorgater attacks CURRENT take-6 (tag artic-pipev3w6-20261026, triangle mouth, Mars-approved perfect 2026-10-26 ~15:29 CDT), SUPERSEDED take-5 / take-4 / take-1-2-3 DO NOT USE.
- This item adds NO new art and re-points NO asset, so it neither uses nor violates a locked version. FLAG (not fixed here): the registry's Razorgater articulation set rendered by this wiring is the v2rework eyes-only set, NOT the locked take-6 cells — reconciling the registry to take-6 is the art lane's job and is owed separately; this wiring renders whatever the registry points at, as-is.

## Per-move table (game move -> resolved script -> Pixi motion)

| Game move | Game cat | Script | Route | Template | Family | Pixi motion |
|---|---|---|---|---|---|---|
| AQUA_SHOT | Special | WATER_GUN | Phase 1 map | special_projectile | damage | projectile |
| AQUA_CANNON | Special | SURF | Phase 1 map | special_projectile | damage | projectile |
| HYDRO_SURGE | Special | HYDRO_PUMP | Phase 1 map | special_projectile | damage | projectile |
| AQUA_JET | Physical | AQUA_JET | exact-id | physical | damage | stay (no sub_Lunge) |
| EMBER_TOSS | Special | EMBER | Phase 1 map | special_projectile | damage_with_status | projectile |
| FIRE_STREAM | Special | FLAMETHROWER | Phase 1 map | special_projectile | damage_with_status | projectile |
| INFERNO_WAVE | Special | FIRE_BLAST | Phase 1 map | special_projectile | damage_with_status | projectile |
| FIRE_PUNCH_MOVE | Physical | FIRE_PUNCH | Phase 1 map | physical_contact | damage_with_status | lunge |
| PETAL_BARRAGE | Special | ENERGY_BALL | Phase 1 map | special_projectile | damage | projectile |
| SOLAR_BLAST | Special | SOLAR_BEAM | Phase 1 map | two_turn | two_turn | projectile (unleash; charge turn resolver-owned) |
| RAZOR_LEAF | Physical | RAZOR_LEAF | exact-id | physical | damage | stay (no sub_Lunge) |
| VINE_LASH | Physical | VINE_WHIP | Phase 1 map | physical_contact | damage | lunge |
| SPARK_SHOT | Special | THUNDER_SHOCK | Phase 1 map | special_projectile | damage_with_status | projectile |
| THUNDER_BOLT | Special | THUNDERBOLT | Phase 1 map | special_projectile | damage_with_status | projectile |
| WILD_CHARGE | Physical | WILD_CHARGE | exact-id | physical | damage | stay (no sub_Lunge) |
| METAL_STRIKE | Physical | METAL_CLAW | Phase 1 map | physical_contact | damage | lunge |
| IRON_BARRAGE | Physical | — | UNMATCHED (Mars-gated) | — | — | lunge (category fallback, Physical) |
| FLASH_CANNON_MOVE | Special | FLASH_CANNON | Phase 1 map | special_projectile | damage | projectile |
| EARTH_TREMOR | Physical | EARTHQUAKE | Phase 1 map | physical | damage | stay (no sub_Lunge) |
| MUD_BLAST | Physical | BULLDOZE | Phase 1 map | physical | damage | stay (no sub_Lunge) |
| EARTH_POWER | Special | EARTH_POWER | exact-id | special_projectile | damage | projectile |
| BULLDOZE | Physical | BULLDOZE | exact-id | physical | damage | stay (no sub_Lunge) |
| SHADOW_PULSE | Special | SHADOW_BALL | Phase 1 map | special_projectile | damage | projectile |
| DARK_PULSE_MOVE | Special | DARK_PULSE | Phase 1 map | special_projectile | damage | projectile |
| NIGHT_SLASH_MOVE | Physical | NIGHT_SLASH | Phase 1 map | physical | damage | stay (no sub_Lunge) |
| CRUNCH | Physical | CRUNCH | exact-id | physical_contact | damage | lunge |
| GUST_WAVE | Special | GUST | Phase 1 map | special_projectile | damage | projectile |
| WING_ASSAULT | Physical | DRILL_PECK | Phase 1 map | physical_contact | damage | lunge |
| TACKLE | Physical | TACKLE | exact-id | physical_contact | damage | lunge |
| QUICK_ATTACK | Physical | QUICK_ATTACK | exact-id | physical_contact | damage | lunge |
| BODY_SLAM_MOVE | Physical | BODY_SLAM | Phase 1 map | physical_contact | damage_with_status | lunge |
| MIND_BLAST | Special | PSYCHIC | Phase 1 map | special_projectile | damage | projectile |
| DRAGON_CLAW | Physical | DRAGON_CLAW | exact-id | physical_contact | damage | lunge |
| POWER_STRIKE | Physical | SKY_UPPERCUT | Phase 1 map | physical_contact | damage | lunge |
| SWARM_STRIKE | Physical | TWINEEDLE | Phase 1 map | multi_hit | multi_hit | stay + 3 beats |
| POISON_JAB | Physical | POISON_JAB | exact-id | physical | damage_with_status | stay (no sub_Lunge) |

## Per-creature table (51 folders: rendered set source)

| Species | Folder | Render source | Set / frames |
|---|---|---|---|
| 020 | aerobeak | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 003 | aquariios | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 044 | ashemit | articulation | atk_heavy_inferno_crash_finisher [heavy, 6 cells], atk_physical_ash_charge [physical, 5 cells], atk_signature_flame_tail_sweep [signature, 6 cells] |
| 025 | astroleviathan | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 005 | chromejaww | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 017 | cocoonode | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 036 | cragarm | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 147 | dorowani | articulation | atk_heavy_deluge_finisher [heavy, 6 cells], atk_physical_glide_ram [physical, 5 cells], atk_signature_wave_barrage [signature, 6 cells] |
| 040 | dreadtoise | pilot | atk_heavy_fortress_slam_finisher (6 cells), atk_physical_shell_ram (5 cells), atk_signature_twin_cannon_barrage (6 cells), atk_special_water_gun (5 cells) |
| 008 | duneclaw | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 043 | duskfiend | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 022 | finblade | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 024 | floatcalf | articulation | atk_heavy_cloud_crash_finisher [heavy, 6 cells], atk_physical_float_ram [physical, 5 cells], atk_signature_sky_barrage [signature, 6 cells] |
| 148 | gabu | articulation | atk_heavy_timber_finisher [heavy, 6 cells], atk_physical_forest_lunge [physical, 5 cells], atk_signature_canopy_burst [signature, 6 cells] |
| 032 | gearkid | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 034 | gorokappa | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 026 | inklet | articulation | atk_heavy_ink_crash_finisher [heavy, 6 cells], atk_physical_ink_lash [physical, 5 cells], atk_signature_abyss_barrage [signature, 6 cells] |
| 031 | kickmaster | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 010 | kittember | articulation | atk_heavy_blaze_crash_finisher [heavy, 6 cells], atk_physical_ember_pounce [physical, 5 cells], atk_signature_inferno_pounce [signature, 6 cells] |
| 028 | krakenox | articulation | atk_heavy_kraken_crash_finisher [heavy, 6 cells], atk_physical_tentacle_lash [physical, 5 cells], atk_signature_abyss_surge [signature, 6 cells] |
| 012 | manticlaw | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 033 | mechapion | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 023 | megalochrome | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 001 | mochii | pilot | atk_heavy_hydro_surge_finisher (6 cells), atk_physical_body_slam (5 cells), atk_signature_aqua_cannon (6 cells), atk_special_aqua_shot (5 cells) |
| 018 | mothrix | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 331 | mythar | articulation | atk_heavy_nova_crash_finisher [heavy, 6 cells], atk_physical_star_pounce [physical, 5 cells], atk_signature_orbit_barrage [signature, 6 cells] |
| 009 | oblivirex | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 035 | pebblefist | articulation | atk_heavy_avalanche_finisher [heavy, 6 cells], atk_physical_rock_punch [physical, 5 cells], atk_signature_boulder_barrage [signature, 6 cells] |
| 041 | pixilite | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 029 | punchkid | articulation | atk_heavy_knockout_finisher [heavy, 6 cells], atk_physical_jab_rush [physical, 5 cells], atk_signature_combo_barrage [signature, 6 cells] |
| 013 | pupbble | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 045 | pyromonk | articulation | atk_heavy_blaze_crash_finisher [heavy, 6 cells], atk_physical_flame_fist [physical, 5 cells], atk_signature_inferno_barrage [signature, 6 cells] |
| 011 | pyropaw | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 015 | quakehound | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 004 | razorgater | articulation | atk_heavy_jaw_crash_finisher [heavy, 6 cells], atk_physical_razor_rush [physical, 5 cells], atk_signature_cross_slash [signature, 6 cells] |
| 006 | reaperdile | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 039 | shellguard | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 038 | sproutle | articulation | atk_heavy_overgrowth_finisher [heavy, 6 cells], atk_physical_vine_lunge [physical, 5 cells], atk_signature_bloom_burst [signature, 6 cells] |
| 016 | squirmite | articulation | atk_heavy_overrun_finisher [heavy, 6 cells], atk_physical_coil_lunge [physical, 5 cells], atk_signature_verdant_burst [signature, 6 cells] |
| 021 | stormtalon | articulation | atk_heavy_thunder_crash_finisher [heavy, 6 cells], atk_physical_talon_dive [physical, 5 cells], atk_signature_tempest_barrage [signature, 6 cells] |
| 030 | strikechamp | articulation | atk_heavy_knockout_finisher [heavy, 6 cells], atk_physical_champ_punch [physical, 5 cells], atk_signature_champ_barrage [signature, 6 cells] |
| variant | strikechamp_unsuited | articulation | atk_heavy_knockout_finisher [heavy, 6 cells], atk_physical_bare_punch [physical, 5 cells], atk_signature_bare_barrage [signature, 6 cells] |
| variant | strikechamp_unsuited_full | articulation | atk_heavy_knockout_finisher [heavy, 6 cells], atk_physical_suit_punch [physical, 5 cells], atk_signature_suit_barrage [signature, 6 cells] |
| 014 | terradog | articulation | atk_heavy_quake_finisher [heavy, 6 cells], atk_physical_terra_charge [physical, 5 cells], atk_signature_terra_barrage [signature, 6 cells] |
| 037 | terrapod | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 002 | tiidebiite | articulation | atk_heavy_tsunami_finisher [heavy, 6 cells], atk_physical_tide_ram [physical, 5 cells], atk_signature_surge_barrage [signature, 6 cells] |
| 027 | toxitacle | articulation | atk_heavy_toxic_crash_finisher [heavy, 6 cells], atk_physical_tentacle_lash [physical, 5 cells], atk_signature_venom_barrage [signature, 6 cells] |
| 007 | tyrage | articulation | atk_heavy_cataclysm_finisher [heavy, 6 cells], atk_physical_rage_charge [physical, 5 cells], atk_signature_tyrant_flare [signature, 6 cells] |
| 042 | wispkin | transform (NEW in this item) | 4 transform frames (windup/strike/impact/recover) |
| 046 | yogiferno | articulation | atk_heavy_blaze_finisher [heavy, 6 cells], atk_physical_yogi_charge [physical, 5 cells], atk_signature_inferno_barrage [signature, 6 cells] |
| 019 | zephling | articulation | atk_heavy_tempest_finisher [heavy, 6 cells], atk_physical_zephyr_dive [physical, 5 cells], atk_signature_cyclone_barrage [signature, 6 cells] |

## Still owed (not claimed done)

- VFX origin + direction pass (separate worker): mouth-anchored origins for all sets, opponent-LEFT / player-RIGHT effect travel as drawn art, Dorowani jet fix, front-view mirror batch finalisation.
- Live playtest on a deployed build containing this wiring (build + tsc gates below are code gates, not a playtest).
- Razorgater registry -> locked take-6 reconciliation (art lane).
- damage_with_status status puff as a distinct visual: the script's sub_StatusPuff step is not rendered as a separate puff in Pixi today (impact flash + treatments only); the status itself is resolver/BattleView text, unchanged here.
- Multi-hit beat cycling for pilot/articulation sets (native sequence only today; beat cycling exists only on the transform fallback).
- Two-turn charge turn as its own rendered turn (resolver-owned; Pixi plays the unleash projectile only).
- Back-view attack sets (staged, not on main at branch base) are NOT wired here; player-side rendering still uses the existing back battle sprite + front-derived attack frames, as before.
