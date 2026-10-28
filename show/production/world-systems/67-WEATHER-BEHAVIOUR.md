# #67 — WEATHER-REACTIVE CREATURE BEHAVIOUR → Garden/Forest behaviour tables

**Teardown (public documentation).** In the reference creature games,
wild-creature behaviour is not simulated per-creature; it is a
**lookup keyed to world state**. The documented pattern across the
decomp record and design literature: (1) spawn/encounter tables carry
conditional slots (time-of-day first, weather in later generations —
rain-only and fog-only encounters are the canonical examples); (2)
overworld/NPC behaviour runs on small **state scripts** whose branch
conditions are world-state flags (phase, weather, story flags), not
continuous AI; (3) behaviour *presentation* (who is out, who shelters,
who is agitated) is a per-area table of state→behaviour-set mappings,
so the same species reads differently in different weather without a
new AI per species. The kit taken: conditional slots + state-keyed
behaviour tables. No behaviour data, species assignments, or scripts
are copied — every row below is ours or OPEN.

**Native format — `mochiichao/behaviour-table/v1`** (fragment beside
this doc). One table per area, rows keyed by the **#19 world-state**
(`mochiichao/world-state/v1`: `phase`, area `weather` with the
script > area > global priority stack, and the Forest's `dread`
cycle) crossed with the LIVING-WORLD **WIND-STATE**
(CALM/BREEZE/GUST):

- `population_set` — which Background Population classes
  (LIVING-WORLD §3: SKY / FG-CROSS / BG-CROSS / PERCH / WATER) are
  active, and at what density band. Roster-binding law applies
  unchanged: species come from the canonical roster by habitat class;
  principals are never ambient.
- `behaviour_set` — per habitat class, a named behaviour vocabulary
  (e.g. `forage`, `shelter`, `call`, `drift`, `still`) mapped to
  banked ambient cycles (LIVING-WORLD Ambient Cycle Library ids) —
  behaviour is *selected from the bank*, never authored per row.
- `spawn_condition` — the row doubles as the condition the #7 spawn
  tables' `weather`/`timeOfDay` fields (present, null until now) test
  against. One state, two consumers: what you *meet* and what you
  *see living* can never disagree.
- `cry_audibility` — whether ambient cries sound in this state
  (Garden rain: yes, muffled class; Forest any dread state: **no** —
  engineered absence, LIVING-WORLD C6).

**Garden table (canon-anchored rows only).** Phases dawn/day/dusk use
the Garden's weather set (clear/rain at minimum — the *set* is #19's
area vocabulary); `frost-trace` night rows exist because frost is
owner-ruled canon: population thins to PERCH/none, behaviour set
`still`, and the frost path itself is the behaviour event (Wispkin's
round — scripted presence, never a spawn row: show Forest/Garden
population law). All other cells ship as named rows with
`status: OPEN` rather than invented animal behaviour.

**Forest table.** Keyed by `dread`, not weather (per #19): SURFACE-CALM
rows may carry surface population for the *game* lane only (show
population in the Forest is 0 at every tier, LIVING-WORLD P5 — the
lanes share the schema, not the behaviour); STIRRING thins it;
DEEPENING empties it; **STILLED is an all-empty row by definition** —
the behaviour of the depths is that there is none, and what stopped it
stays OPEN exactly as canon leaves it.

**Wiring.** Producer: #19 world-state. Consumers: #7 spawn tables
(conditions), LIVING-WORLD population/cycle selection (rows),
#73 weather FX (the same state keys the FX layer), episode boards
(xsheet header already carries phase + state). Game lane runs the
same tables for overworld behaviour sets.

**Coverage.** Architecture: fully documented pattern. Contents: only
the frost-night and Forest rows are canon-grounded; the Garden's
per-weather behaviour vocabulary is specified as *format*, with all
species-level assignments OPEN for the design lane / owner.
