# Opponent body-part origins for ALL 560 moves — STAGED ONLY

Date: 2026-10-27. No game files edited, no PR, no merge, no VFX art
rebuilt, no VFX staging overwritten. Generator:
`build_body_origins.py` (re-run it to regenerate `body_origins.json`
and `body_origins.ts`; do not hand-edit the outputs).
This table supersedes the prior opponent-direction table's origin
column (which honestly reported 0/560) for origins only; the prior
table's vectors are retained as the travel reference.

## Answer first

- **Origins accounted: 560/560 = 100%.**
- **Confirmed: 20/560 = 3.6%** — 19 moves whose FireRed script body
  literally names the part (see §3), plus the sentinel `none`
  (origin `none`, confirmed as no-origin, not a playable move).
- **Derived-from-animation: 167/560 = 29.8%.**
- **Rig-measured: 40/560 = 7.1%** — family level only (see §3).
- **Inferred-from-archetype: 333/560 = 59.5%.**
- 20 + 167 + 40 + 333 = 560. No inferred row is labelled confirmed,
  and no derived/rig row is labelled confirmed either.

## Direction rule (encoded in metadata and in every travelling row)

- Opponent is on the **RIGHT**, player is on the **LEFT**.
- Opponent attacks travel **LEFT + slightly DOWN, never right**.
- The "30" is **30 DEGREES below horizontal** (Black 2 projection),
  not 30%.
- FireRed's single-battle field slope (21.04° below horizontal, from
  the 240×160 slot table) is kept as a separate reference value in
  the JSON metadata; it is not conflated with the Black 2 projection.
- Travel counts (same as the prior table): opponent travel confirmed
  442/560 = 78.9%, multi-target geometry 13/560 = 2.3%, no opponent
  travel 105/560 = 18.8%. Travelling rows carry the full direction
  object; non-travelling rows carry no fake vector and say so.

## Derivation method (not code categories alone)

Per move, in order:

1. **Black 2 move data** (`pokebw2/res/moves/*/data.json`, 560 dirs):
   slug, target, category, type, effect constant. No descriptions
   copied; rows carry those five fields only.
2. **FireRed animation scripts** (`data/battle_anim_scripts.s`,
   356 `Move_*` labels): label + line number + body pattern parsed
   for every move. 352/560 Black 2 moves have a FireRed script;
   208/560 do not (Black 2-only moves). A script counts as origin
   evidence only when its body shows an attacker-anchored spawn
   (`createsprite` with `ANIM_ATTACKER`, palette-blend templates
   excluded) or an attacker lunge / slide / bow motion. Scripts
   whose visible effect is target-anchored only (impact at the
   target, no attacker spawn) do **not** prove an origin and drop
   the row to inferred — that is why several well-known projectile
   moves are inferred, not derived, in this table.
3. **Black 2 effect machinery** (generic, never per-move anatomy):
   `btlv_effect.c:1403` (`BtlvEffTool_CalcStepVec`, step =
   (end − start) / frames), `btlv_effvm.c:335`
   (`BtlvEffvm_GetTargetPositions`), `btlv_mcss.c:192` (default 3D
   positions) and `btlv_camera.c` (camera basis for the 30-degree
   projection). Cited as travel evidence only.
4. **Existing VFX rig cross-reference** (read-only, Mochiichao sets):
   `CODE-TRUE-MANIFEST-20261026.json`, 204 sets. Physical + heavy
   = 102/102 body-lunge (unanimous at family level); special +
   signature projectile = 102 sets, mouth-family 47/102 (plurality,
   **not** unanimous — so mouth is never called rig-measured on
   rig alone).
5. **Animation-coverage mapping** (`animation-all-moves-20261027`,
   mapping-table-20261027.json): per-move template / combat_group /
   origin candidate, used as the archetype candidate, never as sole
   evidence for a confirmed row.
6. **Archetype overrides** (in the generator, `OVERRIDES`): ~100
   moves where the generic type/template rule gives a plainly wrong
   part — pledge pillars rise from the ground, meteors fall from
   the sky, thrown items leave the hand, sound moves leave the
   mouth, eye moves leave the face, thrown/held items leave the
   hand, and so on. Each override cites its archetype in the row.
   An override never upgrades a row to confirmed on its own;
   confidence is still set by the script/rig evidence.

## Confidence definitions (binding)

- **confirmed** — FireRed script body contains an explicitly named
  body-part sprite/gfx that matches the assigned kind:
  `ANIM_TAG_HANDS_AND_FEET` + fist/foot sprite template → hand /
  foot (token + template agree), `ANIM_TAG_SHARP_TEETH` → mouth,
  `ANIM_TAG_HORN_HIT` → horn, `ANIM_TAG_CUT` → slash,
  `ANIM_TAG_SLASH` / `ANIM_TAG_SLASH_2` → slash. Plus the
  sentinel `none` (origin `none`).
  Confirmed moves (19 + sentinel): air_cutter (slash), bite
  (mouth), crunch (mouth), cut (slash), dizzy_punch (hand),
  double_kick (foot), dynamic_punch (hand), false_swipe (slash),
  fire_punch (hand), fury_cutter (slash), horn_attack (horn),
  horn_drill (horn), ice_punch (hand), mach_punch (hand),
  mega_kick (foot), mega_punch (hand), megahorn (horn),
  shadow_punch (hand), thunder_punch (hand); sentinel none (none).
- **derived-from-animation** — FireRed script label verified AND
  the script body contains an attacker-anchored spawn or an
  attacker lunge/slide/bow motion. The choreography, not the
  category, supports the origin class.
- **rig-measured** — No FireRed script (Black 2-only move) AND
  assigned kind body-lunge for a melee move. This is a
  **family-level** rig measurement (physical + heavy 102/102
  body-lunge), stated as such in every such row's evidence. It is
  NOT a per-move, per-creature rig point, and the report does not
  pretend otherwise.
- **inferred-from-archetype** — Everything else: the kind comes
  from the move's animation archetype (template + type +
  name-token pattern + rig family plurality), with the archetype
  cited in the row. Target-anchored-only FireRed scripts land
  here too, by rule.

## Origin-kind counts (560 total)

| origin_kind | count | pct |
|---|---|---|
| body | 178 | 31.8% |
| body-lunge | 94 | 16.8% |
| mouth | 66 | 11.8% |
| hand | 49 | 8.8% |
| projectile-emitter | 29 | 5.2% |
| body-release | 24 | 4.3% |
| face | 22 | 3.9% |
| voice | 18 | 3.2% |
| slash | 13 | 2.3% |
| ground | 13 | 2.3% |
| foot | 11 | 2.0% |
| wing | 9 | 1.6% |
| claw | 7 | 1.3% |
| tail | 7 | 1.3% |
| head | 5 | 0.9% |
| horn | 4 | 0.7% |
| cannon | 4 | 0.7% |
| beak | 3 | 0.5% |
| tentacle | 3 | 0.5% |
| none (sentinel) | 1 | 0.2% |

Kind notes (so the kinds are not misread):

- `body` = status / self / field moves whose origin is the caster
  body (no projectile, no lunge). It is not a claim that a
  projectile leaves the torso.
- `body-lunge` = whole-body melee charge (the rig physical/heavy
  term), distinct from `body`.
- `projectile-emitter` = generic energy projectile where no part
  is evidenced (energy spheres, sky-falling projectiles, generic
  pulses). It is deliberately not forced into `mouth`: forcing
  every special projectile into `mouth` would have been the
  guessed version of this table.
- `face` = mind/eye moves (psychic energy, eye glares), not a
  mouth beam.
- `voice` = sound moves (songs, roars, buzzes, sleep-talk), whose
  sound originates at the mouth but is tracked separately from a
  mouth projectile.
- `ground` = field/ground-origin moves (pledge pillars, ground
  shocks, rocks erupting from the field), not a body part.
- `cannon` = cannon-token moves only (flash_cannon, hydro_cannon,
  spike_cannon, zap_cannon).
- `none` = the sentinel only; every playable move has a kind.

## Derivation method per archetype

- **Part-named melee (punch / kick / bite / horn / slash):**
  FireRed script gfx tag + token agreement → confirmed where the
  tag exists (see §3); otherwise derived where the script shows an
  attacker spawn/lunge, else inferred from the part token
  (hand / foot / mouth / horn / slash / claw / beak).
- **Whole-body melee:** attacker lunge/slide/bow in the FireRed
  script → derived body-lunge; Black 2-only melee → rig-measured
  body-lunge (family unanimous); otherwise inferred body-lunge.
- **Breath / beam / spray projectiles (fire, water, grass, ice,
  poison, dragon):** mouth. Derived only where the FireRed script
  shows an attacker-anchored projectile spawn; target-anchored-only
  scripts (e.g. the small-flame script, which spawns at the target)
  stay inferred, with that reason in the row.
- **Generic energy projectiles (psychic-adjacent, ghost, dark,
  steel, normal, electric, rock energy):** projectile-emitter,
  except psychic mind/eye moves → face. Never forced into mouth.
- **Wing / tail / horn / tentacle / head moves:** part token +
  template; derived where the FireRed script shows the attacker
  motion, else inferred.
- **Powder / spore / seed / string / leaf / petal releases:**
  body-release (shed from the body surface), not mouth.
- **Sound moves:** voice, including status sound moves (the
  mapping table's status rows default to `none`; this table
  corrects those to voice where the token is a sound token).
- **Ground / field moves:** ground (pledge pillars, ground shocks,
  field-erupting rocks). Sky-falling moves (meteors, sky
  lightning, crashing icicles) stay projectile-emitter with a
  sky-fall archetype note, because no body part emits them.
- **Status / self / field moves:** body (caster anchor), except
  voice, body-release, and face corrections above. No projectile
  origin is invented for a move that has no projectile.
- **Sentinel:** `none` → none, confirmed as no-origin.

## Sample rows (slug, kind, confidence, evidence source)

- tackle — body-lunge, derived-from-animation —
  `battle_anim_scripts.s` attacker lunge script.
- water_gun — mouth, derived-from-animation — attacker-anchored
  water projectile sprite in the FireRed script.
- ember — mouth, inferred-from-archetype — FireRed script spawns
  at the target only, so it cannot prove a mouth origin; the kind
  is the flame archetype, labelled inferred.
- thunderbolt — projectile-emitter, inferred-from-archetype —
  FireRed script is target-anchored electric bolts; no part
  evidenced, so no mouth claim is made.
- hyper_beam — mouth, inferred-from-archetype — beam archetype;
  the FireRed script's orbs are target-side, so this is not
  upgraded to derived.
- swords_dance — body, derived-from-animation — attacker-anchored
  blade sprite in the FireRed script; status, so the origin is
  the caster body, not a projectile.
- acrobatics — body-lunge, rig-measured — Black 2-only melee;
  family-level rig measurement (physical + heavy 102/102
  body-lunge), not a per-move rig point.
- bite — mouth, confirmed — `ANIM_TAG_SHARP_TEETH` in the
  FireRed script body.
- none — none, confirmed — sentinel, not a playable move.

## Forbidden-content check

Rows carry move_slug, target, category, type, and effect constant
only. No move descriptions, no dialogue, no species names, no
town names, no images, no audio, no cries. Verified on the final
output: species-name word-boundary check against all 652 names
from `decomp_black2_species.json` = **0 hits** in
`body_origins.json`; no `move_name` field, no `description` field,
0 `.png` references, 0 `.pal` references.

## What is NOT claimed

- No per-move, per-creature anatomical origin is claimed for the
  333 inferred rows or the 40 family-level rig rows; their rows
  say so in plain text.
- No HeartGold origin value is claimed (no battle-anim
  sprite-coordinate source in that slice).
- No Black 2 per-move effect-script value is claimed (overlay /
  NARC data, not readable per-move C in this slice); BW2 evidence
  here is the generic effect VM + travel primitive.
- The 30-degree angle is a Black 2 camera-projection derivation,
  not a hardcoded Black 2 constant; the 21.04-degree FireRed slope
  is a separate field-geometry value.
- No VFX art was built, no VFX staging was overwritten, no game
  file was edited, no PR was created, no merge happened.

## Files (staged only)

- `body_origins.json` — 560 move rows + counts + metadata.
- `body_origins.ts` — same rows + counts, typed, imported
  nowhere yet.
- `build_body_origins.py` — generator (re-run, don't hand-edit).
- This report.
