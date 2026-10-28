# #19 — DAY/NIGHT + WEATHER STATE SYSTEMS → world-state model

**Teardown (public documentation).** The reference pattern is a pair
of small state machines, not a simulation: (1) a **clock** — time is a
discrete phase (morning/day/dusk/night in the early systems, a real
clock later) and every consumer keys off the *phase id*, never the raw
time; encounter tables, NPC schedules and palettes are all
phase-indexed lookups. (2) **Weather** — a per-area state with a
priority stack (story/scripted weather outranks area default, which
outranks global season), a fixed effect list (battle modifiers,
overworld dressing, encounter availability), and transitions that
happen on map boundaries or script events, not continuously.

**Native model — `mochiichao/world-state/v1`** (fragment beside this
doc).

- `phase`: `dawn | day | dusk | night` — the four phases the show
  already shoots by (Gate morning, Pond dusk, Gate night). Consumers
  (spawn-table `timeOfDay` — already a field, null until now;
  LIVING-WORLD BED-[LOC]-[TIME] beds; the lighting system's
  location×time keys) all read phase.
- `weather`: per-area state id with the reference priority stack:
  `script > area > global`. Weather ids are area-scoped: the Garden's
  set and the Dark Forest's set are different vocabularies on purpose.
- **Dark Forest dread cycle** — the Forest does not take the global
  weather. Its state is `dread`: `SURFACE-CALM → STIRRING → DEEPENING
  → STILLED`, advanced by depth tier (the spawn tables' surface/depths
  split) and by script, never by the clock. STILLED is the state of
  the stopped place — the Forest's scripted leaf falls straight down
  because WIND-STATE reads *suspended* in the Forest at every dread
  state (LIVING-WORLD C3 already implies this; here it is written as
  data). What moves the cycle between states in the depths is **OPEN**
  — canon has not said what stopped moving, and this model does not
  answer it; it provides the slots the answer will land in.
- **Frost nights** — Wispkin's nightly trace becomes a named composite
  state: `phase=night + weather=frost-trace`, area-scoped to the
  Garden/Gate treeline. Frost is canon (owner-ruled): a readable
  path-map, carrying black-purple spirit-aura smoke. The model gives
  it three data hooks and nothing more: spawn-table rows may require
  it (nothing asserted), the show's FROST CLOSE-UP COLOUR SHIFT device
  keys off it (palette shift on zoom-in, restore on zoom-out — a
  *render* flag on the state), and BED-GATE-NIGHT gains a
  `frost_variant` pointer (bed *content* is #22's job). Whether frost
  nights follow a schedule, Wispkin's whim, or another rule is
  **OPEN**.

**Wiring.** The single producer of `phase`/`weather`/`dread` state
that #17's field modifiers, #7's spawn rolls, the lighting plot and
the audio beds all read — one state, many consumers, same pattern as
WIND-STATE and SCORE-STATE. Show lane reads the same ids for board
annotations (xsheet header carries phase + state, timing-system
teardown format).

**Coverage.** Architecture: standard, fully documented. Canon states
(surface Forest, frost nights) grounded in locked canon; the dread
cycle's *names* are this spec's proposal (flagged PROPOSED in the
fragment), its transition rules and the frost schedule are OPEN.

**Phase vocabulary — reconciled (List 12 landing, 2026-10-27):** the canonical data vocabulary is `morning | day | dusk | night` (spawn-table schema + landed instances); this doc's `dawn` is the same phase as the data layer's `morning` (1:1 synonym, recorded in world-state-fragment.json's _reconciliation — the one reconciliation home).
