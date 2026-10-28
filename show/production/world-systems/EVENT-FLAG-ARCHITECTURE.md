# #12 — EVENT / FLAG ARCHITECTURE (teardown → native system)

**What was studied.** The event architecture of the reference games
as documented across the decomp projects: a world of **flags and
variables**, and **scripts** that fire on triggers (talking to an NPC,
stepping on a tile, picking up an item), *test* conditions against
the flag state, *run* a dialogue/battle/beats, and *write back*
effects (set a flag, hand over an item, mark progress). Story
structure in those games is not in the map files — it is in the flag
graph the scripts weave. This package builds the native version:
minimal, namespaced, and wired to the three systems it must serve —
the route graph (#11), the dialogue kit, and the Mochiioteca (#14).

## The state — `event-flag.schema.json`, part 1

One state store, four namespaces, two kinds of value:

- `story.*` — beat flags (`story.r1_beat3_garden_open`,
  `story.champion_defeated`). Booleans. A beat flag, once set, is the
  game's memory that the beat happened; route gates and NPCs test it.
- `progress.*` — dojo/encounter clears (`progress.dojo_r1_01_clear`).
  Booleans; **Fragments are a derived count** of these, never a
  stored number — a count that can disagree with its flags is a bug
  farm.
- `tech.*` — techniques held (`tech.illuminate`). Booleans; the route
  graph's technique gates test exactly these ids.
- `vars.*` — the only non-booleans: named numbers/strings for the few
  things that are genuinely quantities (a thankfulness count for a
  `bond`-class evolution, a Manual rule unlocked). Introduced only
  when a system needs one — canon needs the bond count shape already
  (#8), so the namespace exists; it ships nearly empty.

**Derived, never stored:** dex discovery states (#14) and the
Fragment count. If a value can be computed from flags and registry
state, it is computed at read time. The schema enforces this by
simply having no field for it.

## The event — `event-flag.schema.json`, part 2

An event is `{eventId, kind, locationId, actorId?, conditions[],
script, effects[]}`:

- `kind` — `npc_talk | npc_battle | trigger_tile | item_pickup |
  door | scripted_beat`
- `locationId` — a node id **from the route graph** (#11). Events do
  not invent places; they hang on the graph.
- `conditions[]` — the shared condition shape: flag tests
  (`flag_set` / `flag_clear`), technique tests, time band, discovery
  test (a species already seen — how a Ranger's world reacts to what
  they've met). The same shape is reused by evolution edges (#8), so
  "evolves when the Ranger returns at dusk" is expressible in one
  vocabulary.
- `effects[]` — `set_flag | give_item | teach_technique |
  start_encounter | mark_seen | open_area | set_var`. Effects are
  data, executed by the runtime; an event never hand-waves a state
  change in prose.

## Pairing with the dialogue kit — text is referenced, never embedded

An event's `script` field is a **pointer**, one of two canon forms:

- `{source: "dialogue-kit", path: <kit-relative path>, entry: <id>}` —
  into the dialogue kit staged at `show/research/dialogue-kit/` in
  the repo (the side lane's English-template library: Pokémon Gens
  1–9 + Digimon template files, reference-only, from which Mochiichao
  story scripts are structured — templates and architecture, with
  Mochiichao's own words written into them per the construction-kit
  rule).
- `{source: "ink", path: <game .ink file>, knot: <knot>}` — the game
  already scripts its opening in Ink (`region1-truck-start.ink`), and
  regional dialogue JSON lives in the game data; story beats that
  exist there are pointed at, not re-homed.

Why pointers: dialogue is the most-revised layer of a story game and
the kit is a *library* — thousands of template files whose value is
being addressable. An event that embeds its text forks the text; an
event that points at it can be re-skinned, re-templated and
re-localised without touching the flag graph. The flag graph is the
story's skeleton; the kit is its voice; the schema keeps them in
separate files on purpose.

**Show-side pairing:** episode scripts already work this way — a beat
sheet names its story flags implicitly (the Garden exists in EP01
because R1-BEAT3 is anticipated). When the show writes a beat that
changes the world (a first meeting, a door opened), the beat's flag
id belongs in the script's production notes in this namespace, so
game and show are literally testing the same `story.*` ids.

## Worked examples (both canon beats)

1. **R1-BEAT3, the Garden opens** — `kind: scripted_beat`,
   `locationId: mochi-garden`, `actorId: mochiko`,
   conditions: opening flags set (`story.partner_received`),
   script → the game's beat text ("The Mochi Garden is open now…"),
   effects: `set_flag story.r1_beat3_garden_open` — the exact flag
   the route graph's Route 1.0 → Garden edge tests. One beat, three
   systems, one id.
2. **The Cave of Echoes door** — `kind: door`,
   `locationId: cave-of-echoes`, conditions: technique test
   `tech.illuminate`; without it, the script pointer resolves to the
   cave's canon hint line ("The cave is dark, but it is not empty.
   Bring Illuminate, and bring patience."). The gate, the hint, and
   the technique the player lacks are one event, not three systems
   arguing.

## Coverage — honest

- **Architecture: fully documented.** Flags/vars + trigger scripts +
  condition/effect lists are the most thoroughly documented layer of
  the decomp literature; the native schema is a deliberate *subset*
  (four namespaces, seven effect kinds) — smaller than the reference
  command sets because our game needs less, stated as a design
  choice, not a research gap.
- **Dialogue-kit pairing: interface-level.** The pairing is specified
  as pointer fields and is robust to the kit's internal organisation.
  The kit's landing (`show/research/dialogue-kit/`, 4,333-file
  English-template subset) is taken from the side lane's delivery
  report; this pass did not re-audit the kit file-by-file, and entry
  ids inside kit files become concrete when the first story scripts
  are wired against it — an integration task, flagged here rather
  than papered over.
- **Contents:** the two worked examples are canon beats. The full
  event *contents* of Region 1 (every NPC, every trigger) are story
  production, written beat by beat under the owner's direction —
  this package is the architecture they will be written in.

**Referent (List 13 #117, 2026-10-27):** the `tech.*` namespace's field-technique system is `117-FIELD-TECHNIQUES.md` (same folder) — held (this doc's booleans, set at acquisition) vs performed (the live party check in #117) are separate facts; the sole-knower-leaves edge between them is an OPEN owner ruling, recorded in #117.
