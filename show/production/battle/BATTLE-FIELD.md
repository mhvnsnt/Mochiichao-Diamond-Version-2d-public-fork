# 47 — BATTLE FIELD SYSTEM (field & weather condition data)

Teardown List 6, item 47. Native spec for Jamar's Mochiichao project.
Sources: publicly documented creature-battler field/weather mechanics
(game-data structures documented on public wikis and in open decomp
literature), re-expressed as an original Mochiichao system. No game
data, tables, or values are copied; every number that canon has not
set is marked OPEN.

**Companion (conceptual pairing, standalone file):** List 3 #19's
weather/time **state model** — the world-side state machine that says
what the sky *is*. This spec is the battle-side consumer: given a
weather state, what the field *does* while a battle resolves. The two
meet at one shared vocabulary (§2); neither file depends on the
other's internals.

---

## 1. Teardown — how field/weather systems are structured

Documented battler architecture, generalised:

- **Field state is separate from battler state.** Weather and terrain
  live on the *battle* object, not on either creature: they persist
  across switches, apply symmetrically, and are read by the damage /
  accuracy / status pipelines as modifiers.
- **Conditions are data rows, not code branches.** Each condition is a
  record: an id, a class (weather / terrain / room-effect), a default
  duration in turns, a set of per-hook modifiers (damage multiplier by
  type, accuracy modifier, end-of-turn effect, status interaction),
  and a replacement rule (new weather overwrites old; terrain
  coexists with weather but not with another terrain).
- **Timing is hook-based.** Conditions tick at fixed points in the
  turn pipeline: set → per-action checks → end-of-turn residual →
  expiry countdown → clear. Anything the audience sees (a damage
  number change, a message) is emitted by the resolution queue, never
  by the condition itself.
- **One condition per slot.** The exclusivity is the design: the field
  is a small state vector (weather slot, terrain slot, room slot),
  so the combinatorics stay readable and the UI can show the whole
  field state at a glance.

## 2. Native spec — `mochiichao/battle-field/v1`

### 2.1 Field state vector (battle-scoped, derived — never stored on a species)

```
field = {
  weather:  <condition_id | null>,   // slot: WEATHER
  terrain:  <condition_id | null>,   // slot: TERRAIN
  room:     <condition_id | null>,   // slot: ROOM (show-staged spaces, dojos)
  turns_left: { weather: n, terrain: n, room: n }  // null = until-cleared
}
```

Weather vocabulary is shared with the world state model (List 3 #19):
`clear / rain / sun / frost / mist / hum` — display names are
Mochiichao's; **which of these are battle-legal, and any Mochiichao-
native weather beyond this seed set, is OPEN (owner decision).**
`hum` is seeded from canon (the Dark Forest "hums") as a *candidate*
native condition — flagged PROPOSED, not canon.

### 2.2 Condition record format (the registry row)

```
condition_id     stable internal id, never renamed (display name separate)
display_name     Mochiichao display name — rename-on-use law applies
slot             WEATHER | TERRAIN | ROOM
set_by           move ids / ability ids / world state — ids only
duration_turns   integer | "until_cleared" | OPEN
modifiers: {
  damage_mult_by_type:  { <type_id>: <mult | OPEN> },
  accuracy_mult:        <mult | OPEN>,
  status_block:         [status ids this condition prevents],
  status_grant:         [status ids this condition applies, + chance OPEN],
  end_of_turn:          { target: self|both|field, effect_id, amount: OPEN },
  move_class_flags:     [e.g. "grounded_only", "contact_boost" — vocabulary OPEN]
}
replaces         same-slot overwrite (always true for WEATHER/TERRAIN)
clear_triggers   [condition ids / move ids that clear it] | OPEN
ui: { icon: OPEN, field_banner_colour: from COLOR-SYSTEM location family }
```

### 2.3 Pipeline placement (wires into BATTLE-UI-FLOW v1)

- Field modifiers are read inside **RESOLUTION** only (the only
  outcome write). The command ring displays the field state vector;
  `LIVING_FIELD` (the between-command living fight) renders the
  condition's *weather dressing* (rain streaks, frost shimmer) from
  the same read-only snapshot — presentation, never outcome.
- End-of-turn residual + expiry resolve in the FIFO message/effect
  queue, ordered: field tick narration **after** the action that
  caused it, **before** faint interrupts (matches the animscript
  beats-before-damage ordering rule in List 2 #9).
- In the SHOW lane, battles are autonomous-action (Battle Doctrine):
  the field vector is a *staging* fact the board/animscript reads
  (weather dressing, takeover light per LIGHTING-SYSTEM §5), not a
  turn mechanic. Same data, two consumers — two-lane consistency law.

### 2.4 First registry rows (structure only — all values OPEN)

| id (proposed) | slot | seeded from | status |
|---|---|---|---|
| `wx_rain` | WEATHER | world state model seed vocabulary | values OPEN |
| `wx_sun` | WEATHER | seed vocabulary | values OPEN |
| `wx_frost` | WEATHER | canon: Frost is Wispkin's nightly trace (show canon); battle form unruled | PROPOSED |
| `wx_mist` | WEATHER | canon: Dark Forest mist (world fact); battle form unruled | PROPOSED |
| `wx_hum` | WEATHER | canon: "the woods hum" — candidate native condition | PROPOSED |
| terrain rows | TERRAIN | none seeded — no canon terrain exists yet | OPEN (owner) |
| room rows | ROOM | dojo staging exists in canon; room effects unruled | OPEN (owner) |

## 3. Wiring points

- `show/production/battle/` beside BATTLE-UI-FLOW.md + animscript
  format (List 2 #9/#10): field vector joins the battle state the
  RESOLUTION step reads.
- Game data home: condition registry sits beside `moves.json` /
  machine registry (`src/data/core/`) — ids stable, display names
  rename-on-use.
- Show: animscripts gain an optional `field:` header read (weather
  dressing + lighting takeover), no format break.
- Balance dependency: any damage_mult interacts with #52's scaling
  tables — multipliers stay OPEN until #52's curves are owner-locked.

## 4. Coverage notes

Architecture (slots, hooks, overwrite rules, queue placement) is
consistently documented across public battler references — high
confidence. **No canon battle numbers exist** (stats are owner-TBD
across the project), so every modifier value is OPEN by design, not
by omission. Weather *seed vocabulary* is drawn from canon world
facts (mist, frost, hum); battle-legality of each is unruled and
marked PROPOSED.
