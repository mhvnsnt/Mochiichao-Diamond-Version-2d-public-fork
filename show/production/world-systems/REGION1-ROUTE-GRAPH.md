# #11 — ROUTE / GATE GRAPH (teardown → native spec)

**What was studied.** The progression architecture of the reference
games, as publicly documented: the world as a **graph** — places are
nodes, connections are edges, and edges (or nodes) carry **gates**:
checks the game state must pass (a badge count, a technique, a story
flag) before the connection opens. Badges in that architecture are
rarely doors between towns one by one; they are *keys counted at
thresholds* (league access, technique use) while story flags do most
of the moment-to-moment locking. Our spec keeps exactly that split:
**Fragments are counted at thresholds; story flags lock moments.**

**The data file** — `region1-route-graph.json`: nodes and edges for
Region 1 (Mainframe), built **only from canon places** (season canon
map, `repo-add/show/production/SEASON-CANON-MAP.md`). Gate kinds:

- `story_flag` — a beat must have happened (event system, #12)
- `technique` — the party must hold a technique (Illuminate)
- `fragment_count` — N Fragments held
- `sequence_clear` — an ordered set of encounters cleared (Elite Four)
- `null` — canon shows the connection open; no gate asserted

## What canon fixes, and what it leaves open

**Fixed (in the graph as canon):** the spine order — Boot Harbor
arrival → Aeon's lab (partner + Mochiioteca handover) → Route 1.0 →
the Garden (opened by Assistant Mochiko at R1-BEAT3) → the Dark
Forest with its two doors (Aero Dojo, Cave of Echoes) and its
connections to Binary Fields and Silicon Town → eight dojos whose
badges are **Fragments** (masters Lin, Falk, Tetsu, Kenji, Phantom,
Shizuku, Homura, and a Syndicate boss leading the eighth) → Victory
Route → Mainframe Plateau: Elite Four Umi/Gin/Hono/Yoru → Champion
Hex → post-game Seven Data Isles. The Cave of Echoes carries canon's
own gate text: *"Bring Illuminate"* — a `technique` gate, the only
technique gate canon has named so far.

**Open (in the graph as OPEN, never filled):**

- **Which master holds which dojo, beyond list order.** The canon map
  lists seven masters and a boss in sequence; the graph assigns them
  in that order with status `canon list order`, and per-dojo
  *locations* are open slots.
- **Where the Aero Dojo sits in the eight.** Canon fixes its *door*
  (inside the Dark Forest) and its wing (Wind Wing), not its chain
  position or its master. The graph gives it a node, a door edge, and
  an open chain slot — it does not guess it is any particular
  numbered dojo.
- **Whether each dojo hard-gates the next.** The spine is an order;
  hard sequential gating is a game-design decision. Chain edges ship
  ungated with the question attached.
- **The Victory Route threshold.** `fragment_count = 8` is marked
  **structural inference** (it is how the reference architecture works
  and the only reading the spine supports, but no canon text states
  the number) — flagged in the data, not laundered into canon.
- **The Forest's show-side dread** is not a graph gate. The game graph
  opens the Forest's doors; the *show's* rule (population zero, the
  stopped depths) lives in the spawn/population systems. One world,
  two rulebooks, no smuggling.

## Wiring

- Gates are evaluated against the **event/flag state** (#12): a
  `story_flag` gate names a flag id; a `technique` gate names a
  technique flag; `fragment_count` and `sequence_clear` read the
  progression block of the same state. The graph never invents its
  own state store.
- The **Garden subnodes** (Gate, Green, Pond) are the show's locations
  and the spawn bundle's areas — the same ids across systems, so a
  scene, a spawn table, and a route edge can all point at `the Pond`
  and mean the same place.
- Regions 2–5 exist in canon for later seasons; their champion slots
  include name gaps **in canon itself**. This graph is Region 1 only,
  and its open slots are the template for how later regions get added:
  nodes when canon names places, gates when canon states checks.

## Coverage — honest

- **Architecture: fully documented** as a pattern — node/edge/gate
  graphs are the documented standard, and the flag-vs-threshold split
  is visible across the decomp literature.
- **Region 1 specifics: canon for the spine, open for the numbers.**
  Canon gives places, order, masters, and exactly one technique gate.
  It does not give dojo locations, the Aero chain slot, per-edge hard
  gates, or any fragment threshold. Every one of those is an OPEN
  slot or a flagged inference in the data file — the graph is
  complete as a *map of what is known*, deliberately.
