# #181 — TERRAIN & FIELD EFFECTS → the TERRAIN slot, completed (annexes #47)

**Doctrine seat:** #47 already founded the field:
the battle-scoped state vector `{weather, terrain,
room}`, the condition record format
(`mochiichao/battle-field/v1`), replacement rules
(terrain coexists with weather, never with another
terrain), and pipeline placement (modifiers read
inside #10's RESOLUTION only; ticks in the FIFO
queue). Its TERRAIN slot ships with **zero rows
seeded — "no canon terrain exists yet."** This
package completes that slot: how terrain is set and
cleared, and the terrain×weather interaction table —
shape and resolution order only. **It founds no new
field format**: a terrain condition is a #47 record
with `slot: TERRAIN`, full stop. Every modifier value
stays exactly as OPEN as #47 left it.

**What was studied.** Terrain systems in the publicly
documented record: a terrain is a field condition set
by a move or ability, lasting a fixed number of turns,
replacing any terrain before it, and interacting with
weather as an independent second axis — the two axes
compose rather than merge, which is what keeps the
field state readable at a glance. The kit taken:
move/ability seating, duration as record data,
overwrite discipline, and pairwise interaction as an
explicit table rather than emergent code behaviour.

## Native spec — terrain discipline over #47 (interaction shape in the fragment)

- **Set paths (closed vocabulary).**
  - `move` — a move whose data names a terrain
    condition id in #47's `set_by` (ids only); the
    move's #9 animscript performs the setting, the
    effect is move data.
  - `ability` — a #107 hook naming a condition id
    (the `entry` / `weather-react` classes are the
    natural seats; resolution per #184).
  - `field-start` — an encounter/area rule seats a
    terrain when the battle begins (encounter data;
    the dojo-adjacent seat #47's ROOM slot anticipates,
    expressed on the terrain axis instead where the
    fiction is ground, not room).
  - **World state never seats terrain.** Weather's
    slot seeds from the world (#61/#19 state at battle
    start, #47's shared vocabulary); terrain has no
    world source — areas do not carry terrain state,
    and none is added to #7 or the route graph.
- **Clear paths (closed).** Expiry — `duration_turns`
  counts down in END_CHECK at #47's tick placement,
  the instance carrying its own `turns_left` in the
  field vector (a later edit to the record never
  retro-changes a running instance). Overwrite — a
  new terrain replaces the old, always (#47's rule).
  `clear_triggers` — the record's named moves /
  conditions (#47's field). Battle end — terrain is
  battle state; it never persists, is never stored.
- **Duration is record data.** `duration_turns` on
  the #47 record (integer | `until_cleared` | OPEN);
  every terrain's value is OPEN with the roster.
- **The interaction table (shape in the fragment;
  ships EMPTY).** Rows keyed `(terrainId, weatherId)`
  → a resolution class:
  - `independent` — both apply; composition per the
    order below.
  - `weather-yields` / `terrain-yields` — one axis's
    modifiers are suspended while the pair is active
    (the condition itself remains, and resumes).
  - `pair` — a named combined-modifier row (a #47
    registry row in the same format) replaces both
    axes' terms for this pair.
  **Reading rule:** with no row for the active pair,
  the pair reads `independent` — a default of the
  *reader*, not a row, so the empty table is fully
  defined. Zero pair rows are asserted: with every
  modifier value in #47 OPEN, an asserted interaction
  would invent numbers twice over.
- **Resolution order (this package's fixed
  contribution).** Inside #17's `[field]` stage, terms
  compose in the field vector's own order — **weather,
  then terrain, then room** — and a `pair` row, where
  one exists, replaces the weather+terrain pair of
  terms at that position. Status interactions ride
  each condition's own `status_block` / `status_grant`
  (#47 fields) independently; a pair row may speak to
  status only through a pair-row record's own #47
  fields. One order, stated once, here — #47 and #17
  cite it, they do not restate it.
- **The depths.** In the Dark Forest depths the
  weather slot seeds `NONE` → null (#61: the weather
  system is *off* there). Terrain set by a move in a
  depths battle is ordinary battle mechanics — canon
  forbids none, so none is excepted here.

## Show lane

#47's line stands: the field vector is a staging fact
the board and animscripts read (dressing, lighting),
not a turn mechanic. Terrain on screen is ground the
audience can see change — staged, never tabulated.

## Wiring

Terrain conditions land in #47's registry (its home,
beside `moves.json` in the data layer); set paths
join moves data, #107 hooks, encounter data; the
interaction table sits beside the registry as its
annex; resolution order is cited by #47 and #17 at
landing, in their files, per the proposal discipline.

## Coverage — honest

- **Architecture: fully documented** (second-axis
  field conditions, overwrite, expiry, pairwise
  interaction tables are the published pattern).
- **Contents: zero terrain rows, zero pair rows.**
  The roster of terrains, their durations, modifiers,
  and interactions are owner/balance content #47
  already reserved. The yield is the discipline —
  set/clear paths and one resolution order — so a
  terrain, when ruled, is data and not a code branch.
