# SHADOW LAYER — DECOMP VERIFICATION (2026-10-25)

Rule (Mars, 2026-10-25 ~20:12 CDT): Pokemon adds shadows SEPARATELY.
Shadows are NOT part of the character art. Baked soft shadows are REMOVED
from character art; the engine adds shadows as a separate layer.
The old rationale ("cutting contact shadows would float every character")
is WRONG and is not repeated here.

All paths below are relative to the fresh-start repo work clone
(`~/workspace/mochiichao-work/fresh-start`), submodules as checked out there:
pokefirered-leafgreen, pokeheartgold, pokebw2. Every claim cites the exact
file + function/constant it was read from. Where a decomp file does NOT show
a mechanism, that is stated plainly instead of invented.

## Verdict

VERIFIED across all three generations in the repo: the shadow is a separate
sprite / billboard / texture object created and positioned by engine code,
never a pixel inside the creature sprite. FireRed has BOTH a battle shadow
sprite and a field shadow sprite. HeartGold draws a separate shadow texture
in its Pokepic renderer. Black 2 runs a per-actor shadow task that follows
the actor on the ground plane. In none of the three is the shadow baked
into the creature's own sprite data.

## 1. FireRed / LeafGreen — battle shadow (separate sprite, enemy only, elevation-gated)

- `pokefirered-leafgreen/src/battle_gfx_sfx_util.c`
  - `LoadAndCreateEnemyShadowSprites()` (line ~891): loads a dedicated
    compressed sheet and creates a SEPARATE sprite per enemy battler:
    `CreateSprite(&gSpriteTemplate_EnemyShadow,
    GetBattlerSpriteCoord(battlerId, BATTLER_COORD_X),
    GetBattlerSpriteCoord(battlerId, BATTLER_COORD_Y) + 29, 0xC8)`
    — i.e. the shadow sits 29 px below the enemy sprite's Y, at priority
    0xC8, as its own sprite object, not inside the enemy sprite.
  - `SpriteCB_EnemyShadow()` (line ~907): per-frame callback that follows
    the battler sprite (`shadowSprite->x = battlerSprite->x`, plus `x2`),
    and hides the shadow when the battler sprite is absent/invisible, when
    a battle animation script is active, when the battler is behind a
    Substitute, or when the (possibly transformed) species has elevation 0.
  - `SetBattlerShadowSpriteCallback(battlerId, species)` (line ~935):
    "The player's shadow is never seen" — returns early for the player
    side. For enemies it installs `SpriteCB_EnemyShadow` ONLY if
    `gEnemyMonElevation[species] != 0`; otherwise it installs
    `SpriteCB_SetInvisible`. So in FireRed battle, a grounded enemy gets
    NO shadow sprite at all, and a floating/flying enemy gets a shadow
    that tracks it horizontally while staying on the ground line.
  - `HideBattlerShadowSprite()` (line ~950): forces the shadow invisible.
  - Called from `LoadAndCreateEnemyShadowSprites` via battle setup at
    line ~620 of the same file.
- `pokefirered-leafgreen/src/battle_anim_smokescreen.c`
  - `gSpriteSheet_EnemyShadow` (line ~93): `.data = gEnemyMonShadow_Gfx,
    .size = 0x80, .tag = GFXTAG_SHADOW` — a tiny 0x80-byte sheet, a
    dedicated shadow graphic, not creature art.
  - `sOamData_EnemyShadow` (line ~98): shape/size `32x8`, priority 3,
    4BPP — a flat wide ellipse strip, 32 px wide by 8 px tall.
  - `gSpriteTemplate_EnemyShadow` (line ~115): tile tag GFXTAG_SHADOW,
    palette tag PALTAG_SHADOW (defined line ~9–10: PALTAG_SHADOW 55039,
    GFXTAG_SHADOW 55129), default callback `SpriteCB_SetInvisible`.
  - `pokefirered-leafgreen/src/graphics.c:992`:
    `gEnemyMonShadow_Gfx[] = INCBIN_U32("graphics/battle_interface/enemy_mon_shadow.4bpp.lz")`
    — the shadow graphic lives in battle_interface graphics, separate
    from any species sprite.
- `pokefirered-leafgreen/src/data/pokemon_graphics/enemy_mon_elevation.h`
  - `gEnemyMonElevation[NUM_SPECIES]` — header comment: "This determines
    how much higher above the usual position the enemy Pokemon is during
    battle. Species that float or fly have nonzero values."
  - Examples (grounded species are absent = 0, hence shadowless):
    Butterfree 8, Beedrill 8, Pidgeot 4, Fearow 6, Zubat 8, Geodude 16,
    Magnemite 16, Gastly 4, Haunter 4, Voltorb 10, Electrode 12,
    Koffing 8, Aerodactyl 7, Articuno 6, Zapdos 8, Moltres 5,
    Dragonite 6, Mew 8, Celebi 15, Hoppip 11, Skiploom 12, Jumpluff 9.
  - Rule extracted: elevation > 0 ⇔ floating/flying ⇔ shadow shown;
    elevation = 0 ⇔ grounded ⇔ shadow hidden (the creature's own feet
    already sit on the ground line, so no separate shadow is drawn).
  - Note the inversion vs naive intuition: FireRed battle does NOT draw
    a shadow under grounded enemies — it draws one ONLY for elevated
    enemies, as a ground anchor showing where the floating creature sits.

## 2. FireRed / LeafGreen — overworld shadow (separate field-effect sprite, size + hide rules)

- `pokefirered-leafgreen/include/constants/event_objects.h:182-185`:
  `SHADOW_SIZE_S = 0, SHADOW_SIZE_M = 1, SHADOW_SIZE_L = 2, SHADOW_SIZE_XL = 3`.
- `pokefirered-leafgreen/src/data/object_events/object_event_graphics_info.h`:
  every object-event graphics entry carries its own `.shadowSize`
  (e.g. the player/NPC entries are SHADOW_SIZE_M). The size is a property
  of the object type, not of the sprite pixels.
- `pokefirered-leafgreen/src/field_effect_helpers.c`
  - `gShadowEffectTemplateIds[]` (line ~199): maps S/M/L/XL to
    FLDEFFOBJ_SHADOW_S/M/L/XL field-effect object templates.
  - `gShadowVerticalOffsets[]` (line ~206): S/M/L = 4, XL = 16.
  - `FldEff_Shadow()` (line ~215): creates the shadow as its own sprite
    via `CreateSpriteAtEnd(gFieldEffectObjectTemplatePointers[...], 0, 0, 0x94)`,
    with `sprite->data[3] = (graphicsInfo->height >> 1) - gShadowVerticalOffsets[shadowSize]`
    — the shadow's vertical offset is computed from the object's height
    and its shadow-size class.
  - `UpdateShadowFieldEffect()` (line ~233): per-frame, the shadow copies
    the linked object's position (`sprite->x = linkedSprite->x`,
    `sprite->y = linkedSprite->y + sprite->data[3]`, priority copied),
    and STOPS (removes) itself when the object is inactive, has no shadow
    (`!objectEvent->hasShadow`), or stands on tall grass, surfable water,
    or reflective tiles (checked on both current and previous metatile
    behaviour). Shadow is therefore: separate object, ground-anchored,
    and suppressed on grass/water/reflective ground.
- `pokefirered-leafgreen/src/data/field_effects/field_effect_objects.h`
  (lines ~4–53): four dedicated shadow templates
  `gFieldEffectObjectTemplate_ShadowSmall/Medium/Large/ExtraLarge`, each
  with its own pic table (`sPicTable_ShadowSmall`, etc.) and the shared
  callback `UpdateShadowFieldEffect`. Again: the shadow graphic is a
  separate asset, not part of the character sprite.

## 3. HeartGold / SoulSilver — separate shadow texture in the Pokepic renderer

- `pokeheartgold/src/pokepic.c`
  - `PokepicManager_Create()` (line ~322): loads a dedicated shadow
    texture: `AllocAndReadWholeNarcMemberByIdPair(NARC_poketool_pokegra_otherpoke,
    NARC_otherpoke_259_NCGR, ...)` with the source comment `// shadow.png`.
    This is a standalone texture in the pokegra archive, not a creature pic.
  - `sPokepicShadowUVParams[4][4]` (line ~293): four shadow-size UV
    rectangles (e.g. `{0xA0, 0xA0, 0xE0, 0xB0}`), indexed by
    `shadow.size` — the renderer picks a shadow quad from the shared
    shadow texture by size class.
  - `PokepicManager_DrawAll()` (line ~409): after drawing the creature
    pic, it draws the shadow as a SEPARATE `NNS_G2dDrawSpriteFast` call
    at `shadow.x - width/2, shadow.y - height/2, z = -1000`, with
    width/height 64x16 (or affine-scaled 64/16 by `affineWidth/affineHeight`),
    its own palette slot (`plttBaseAddr + 0x20 * (3 + shadow.palSlot)`),
    and only when `shadow.palSlot != 0 && shadow.size != 0` and the pic
    is not visible-flagged. The creature draw itself is offset by
    `- shadow.height` in Y (lines ~383, ~400), i.e. the creature floats
    above its shadow by the shadow height.
  - What HeartGold does NOT show in this file: a battle-scene shadow
    callback like FireRed's. No shadow mechanism was found in
    `pokeheartgold/src/battle/` by grep (battle_controller_player.c and
    overlay_12_0224E4FC.c contain no non-move shadow code). That absence
    is reported, not filled in: HeartGold's verified separate-shadow
    evidence is the Pokepic renderer + (below) the field system inherited
    through its own field-effect code, not a battle shadow file.
- `pokeheartgold/include/pokepic.h`: declares the `shadow` fields on the
  Pokepic struct (palSlot, size, height, x/y, xOffset/yOffset, isAffine,
  shouldAdjustX/Y) — shadow parameters travel with the pic's draw
  parameters, but the shadow pixels come from the shared shadow.png
  texture, never from the creature pic.

## 4. Black 2 / White 2 — per-actor shadow task (billboard, follows actor, hides on rule)

- `pokebw2/src/ov036/fldeff_shadow.c` (195 lines, whole file is the mechanism)
  - Header comment (line 1): "The shadow under each field actor: a
    billboard that follows the actor and hides while it can't have one."
  - `SHADOW_SCALE` (line 44): `{ FX32_ONE, FX32_ONE, FX32_CONST(0.75) }`
    — the shadow quad is squashed to 0.75 in one axis (a flattened
    ellipse on the ground plane).
  - `FieldEffect_Shadow_Create()` (line 57): loads one shared shadow
    texture (`GFL_G3DSysReadArcToolResource(..., 47)`, material request
    format 2, size 17, 16x16 face, `BLACT_LOAD_TRIM`).
  - `FldeffShadow_Init()` (line 103): creates the shadow actor with
    `alpha = 19` (out of 31 — roughly 61% opaque, i.e. a translucent
    dark ellipse, NOT solid black), `visible = TRUE`, polygonId 2.
    Alpha 19 is the only explicit opacity number found in any of the
    three decomps for a field shadow.
  - `FldeffShadow_Update()` (line 141): deletes the shadow task when the
    actor's identity changes or when `FldActSys_AreShadowsEnabled(...)`
    is false; hides it (`hidden = TRUE`) while the actor is hidden or
    carries movement flag 0x8000.
  - `func_ov036_021a3d28()` (line 161, "Follow the actor, a little above
    its feet"): copies the actor world position + position offset, zeroes
    the offset for billboard scene-node types 10/11 (except Entree Forest,
    where the world-position offset is kept with y = 0), applies
    `offset.y = -0.5` when `billboardSize == 0`, then sets the shadow
    position with `pos.y += FX32_ONE` — one unit above the ground plane
    so it never z-fights the floor.
  - `FldeffShadow_Start()` (line 95): "Give the actor a shadow" — a
    shadow task is attached per actor, it is not part of the actor model.
- No battle-scene shadow file was found by grep in pokebw2's battle
  overlays (ov167/ov168): the verified Black 2 mechanism is the field
  shadow task above. That limit is stated, not papered over.

## 5. What the decomps do NOT show (plainly stated)

- No decomp file in any of the three submodules shows a shadow baked
  into a species sprite. Species sprite data is referenced by species;
  shadow graphics live in battle_interface / field-effect / pokegra
  archives under their own names (enemy_mon_shadow, shadow.png, arc
  resource 47).
- No decomp file gives a per-species shadow width table for Mochiichao
  creatures (that mapping is ours to build — see SHADOW-LAYER-SPEC.md).
- No decomp file gives an explicit "jump height scales shadow" formula.
  The verified jump-related rules are: FireRed battle shadow follows X
  while Y stays at ground line +29; Black 2 field shadow stays at ground
  plane +1 unit while the actor moves. Jump scaling in our module is
  therefore labelled as a Mochiichao extension, not a decomp fact.
- Opacity: only Black 2 gives a number (alpha 19/31 ≈ 61%). FireRed's
  4BPP shadow palette value was not decoded to an opacity number here;
  our module uses the Black 2 number as the documented default and
  says so.

## 6. Rules carried into the Mochiichao shadow layer

1. Art cells ship shadow-free. Any baked ground blob under the feet is
   stripped by shadow_strip.py (see SHADOW-STRIP-REPORT.md); the engine
   re-adds the shadow at runtime.
2. One shared shadow asset (ellipse), sized by creature footprint class
   (S/M/L/XL, FireRed's four classes), NOT one shadow per creature.
3. Shadow is a separate render object under the creature, following X,
   anchored at ground Y (battle: sprite Y + offset; overworld: ground
   plane + 1 unit, Black 2 style), hidden when the creature is hidden,
   behind a Substitute-equivalent, on grass/water/reflective tiles
   (FireRed field rule), or when shadows are disabled for the map.
4. Battle inversion preserved as an option, not a default: FireRed battle
   shows the enemy shadow ONLY for elevated species. Mochiichao's spec
   keeps that as the "elevated-only" battle mode AND adds the standard
   grounded mode (shadow under every grounded battler), because our
   battle view already grounds both sides — the spec says which mode
   each view uses, and never claims FireRed did both.
5. Opacity default 61% (Black 2 alpha 19/31), squash 0.75 (Black 2
   SHADOW_SCALE), battle ellipse 32x8 at FireRed scale (scaled up with
   the sprite), overworld ellipse 64x16 at HeartGold scale (scaled down
   with the tile).
