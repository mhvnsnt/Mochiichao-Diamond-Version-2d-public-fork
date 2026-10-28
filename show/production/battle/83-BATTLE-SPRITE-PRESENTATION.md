# #83 — BATTLE SPRITE PRESENTATION SYSTEMS → BATTLE PRESENTATION SPEC

**What was studied.** How the reference games *stage* creatures in
battle, as publicly documented across generations: (1) **the
two-plane stage** — the opponent's creature is shown **front**,
upper field, on a ground disc/ellipse that fixes its floor; the
player's creature is shown **back**, lower field, larger — the
camera sits *behind the player's partner*, so the player reads the
fight over their own creature's shoulder; (2) **scale honesty** —
later systems scale sprites by the species' actual height data
against a fixed stage, so a large creature genuinely looms;
apparent size is data, not vibes; (3) **entry choreography** — the
throw/release beat: device opens, creature resolves from light/
silhouette into full art, cry on entry, *then* the UI lands —
presentation order is fixed (creature → cry → bars); (4)
**grounding** — every creature keeps a contact read (disc, shadow
or waterline) even mid-animation; airborne and aquatic creatures
get their own grounding conventions (hover bob over the disc,
water ring) rather than floating free.

**The pairing.** BATTLE-UI-FLOW (List 2 #10) already owns the
game's turn state machine and its INTRO state ("creatures enter —
animscript-class entrance cues; health bars slide"). This spec is
the **visual staging layer underneath INTRO and LIVING_FIELD**: it
says what the stage looks like and how creatures are placed on it.
It changes no battle logic; like LIVING_FIELD itself, it holds no
write path to battle state.

## Native spec: `mochiichao/battle-presentation/v1`

### The stage

- **Opponent plane (front):** upper field; creature shown from the
  **front** (its battle_front art — the locked reference view per
  the species sheet); ground contact = an ellipse disc in the
  location's ground register.
- **Player plane (back):** lower field, ~1.35× the opponent plane's
  scale at equal species size; creature shown from the **back**
  (battle_back art). Where a species has no back art yet, the
  staging falls back to front art **flagged in the manifest** —
  back art is an owed asset class per species, tracked like
  footprints/silhouettes in the gap system, never silently
  substituted in a shipped build.
- **Show lane note:** the show does not use this stage (show
  battles are autonomous-action living fights in real locations).
  This spec is game-lane. The show borrows only the *entry order*
  (creature → cry → attention) for keep/release beats.

### Scale

- Apparent height on stage = species `height` data × plane factor.
  Height is currently recorded **nowhere** (Sideline A: TBD for all
  49) — so until the data lands, staging uses the sheet's
  `size_class` (List 5 #43 scale chart: Palm/Knee/Waist/Tower) as a
  4-step proxy, and the spec marks every staged size PROVISIONAL.
  When height data lands, the proxy retires without a format
  change (both feed the same `stage_scale` computation).
- Individual `size_class` variance (#80) may nudge an individual's
  stage scale within its species band — presentation only.

### Grounding conventions (per locomotion class)

| class | grounding |
|---|---|
| ground | contact shadow on the disc; no baked shadow in the art itself (house law — shadows are composite-time) |
| hover/float | disc + soft offset shadow, bob cycle from the living-world ambient set |
| swimmer (on land) | the animscript staging flag already exists (Hydro Rush example: splash-puddle staging) — a water disc replaces the ground disc |
| burrower/subterranean | disc with a broken-earth rim read |

### Entry choreography (INTRO, expanded)

```
1. device beat        (player plane: the Ranger's device/keep gesture)
2. resolve            silhouette → full art over 12 frames (the
                      discovery silhouette asset is reused — seen
                      creatures resolve through their own outline)
3. cry                species cry (sheet cry, V1) at full resolve
4. settle             creature drops/rises into its living-fight
                      idle (hands off to LIVING_FIELD loops)
5. UI lands           health bars + ring fade in LAST
```

Opponent entry mirrors it without step 1. A **kept-first-time**
creature (state just turned kept) resolves slower (step 2 at 24
frames) — the presentation honours the discovery beat.

## Wiring

- **BATTLE-UI-FLOW (#10):** this spec is the staging contract for
  its INTRO and LIVING_FIELD states; the flow's snapshot gains
  `stage_scale` + `grounding_class` per combatant (read-only, as
  the doctrine requires).
- **Animscripts (#9):** entrance cues are animscripts on the
  performer's tracks; the move format's staging flags (splash
  puddle) are the same vocabulary as the grounding table.
- **Species data:** consumes `battle_front` (locked), `battle_back`
  (owed — register as a gap class), silhouette asset (step 2),
  `size_class`/height (scale), locomotion (grounding class) from
  the sheet's show/body blocks.
- **Discovery (#3/#14):** the resolve-through-silhouette entry is
  the discovery system's visual signature, reused — one asset,
  three jobs (dex unseen state, battle entry, show discovery gag).

## Open slots (not invented)

- `battle_back` art for every species — an owed asset class; the
  fallback flag exists so its absence is visible, not papered over.
- Species `height` values (TBD D5 in the data lane) — staging runs
  on the size-class proxy until then.
- Ground-disc art per location family — environment parts-catalog
  work, not specified here.
