# PUZZLE GATES — environmental puzzle design format (List 7, #59)

Teardown: environmental gate puzzles in creature-collector games —
a route blocked by a *situation*, opened by a technique, an item,
an observation, or a partner's capability. The durable public
structure: the gate is a record, not a script — lock, clue chain,
solution verb, fail behaviour, and what it pays — and the genre's
cardinal rule is that a gate may cost time but never progress:
fail-states are soft (retry in place), never hard locks.

## Native format — the gate record

One record per gate, stored with the route graph (List 2 #11)
edge it guards. Fields:

```json
{
  "gate_id": "gate-cave-of-echoes-illuminate",
  "edge": "dark-forest -> cave-of-echoes",
  "lock_class": "technique | flag | observation | manipulation | partner",
  "lock_ref": "technique: ILLUMINATE",
  "clue_chain": [
    {"step": 1, "kind": "sign | npc | environment | dex", "ref": "…"}
  ],
  "solution_verbs": ["…"],
  "fail_state": "soft — …",
  "on_open": {"flags_set": ["progress.*"], "one_way": false},
  "pays": "route | area | encounter-table | story beat",
  "show_use": "…"
}
```

**Field law:**
- `lock_class` is closed (the five above). `technique` = a named
  world technique (Illuminate class — Rare-Move-class in the game
  lane's machine system); `flag` = a story/progress flag from the
  event-flag architecture (#12); `observation` = the player must
  *see* something (the gate teaches looking — the Dark Forest's
  whole grammar); `manipulation` = move/arrange the environment;
  `partner` = a follower capability check (#58 — the follower
  system is the actor, never a menu item).
- `clue_chain` is mandatory and ordered: at least one clue must be
  reachable *before* the gate, in the world (sign/NPC/environment/
  Mochiioteca), in Jamar's house writing register — specific
  props, no floating hints. A gate with no clue chain is a lock,
  not a puzzle, and fails review.
- `fail_state` is always soft: the world states the lack plainly
  ("The cave is dark, but it is not empty…" — canon's own line
  under the Illuminate naming law) and the player walks away
  whole. No fail-state may consume a resource or set a punishing
  flag.
- `on_open.flags_set` uses the #12 namespaces only (`progress.*`
  for gates); opening is idempotent — re-solving an open gate is
  a no-op, never a second reward.
- `pays` names what the gate is *for*. A gate that pays nothing
  but its own opening is decoration and gets cut at review.

## Canon instances (already in the world, recorded not invented)

- **Cave of Echoes** — `technique: ILLUMINATE` (route-graph edge
  already carries this gate in canon's own text).
- **Garden opening** — `flag` class: R1-BEAT3 (Assistant Mochiko
  opens the Mochi Garden) is a story-flag gate, the care loop
  (#65) behind it.
- **Dojo doors** — the eight dojos sit behind the route graph;
  whether each door is a gate and of what class is **OPEN** (the
  route graph already flags inter-dojo hard-gating as undecided —
  this format holds the decision, it does not make it).

## Show use

The same record drives the episode version: the show solves gates
the anime way (skill, observation, partner agency — the autonomous-
action battle doctrine's exploration twin), and `show_use` records
the beat shape so game gate and show beat can't drift apart
(two-lane consistency law). Puzzle *solutions* in the show are
never machine-disc uses — the two-lane move doctrine applies.

## Wiring

Route graph edges gain `gate_ref` (additive; edges without gates
are ungated, unchanged). Event-flag architecture supplies the flag
vocabulary. The Mochiioteca is a legal clue surface (`kind: dex`)
— discovery data doubles as puzzle teaching.

## Coverage

Gate-record architecture: standard and publicly documented.
Instances: two canon gates recorded; dojo-door classes and all
further gates are OPEN slots awaiting world-lane canon, by design.
