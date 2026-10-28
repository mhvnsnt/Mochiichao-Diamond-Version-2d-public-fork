# #85 — IN-WORLD WAYFINDING / SIGNAGE SYSTEMS → IRIDESCENCE WAYFINDING + SIGN DESIGN SYSTEM

**What was studied.** How games make a world *navigable by its own
signs*: (1) **readable signage as data** — signs are placed objects
with text, positioned at decision points (junctions, gates,
thresholds), written in the world's voice at the world's reading
level; (2) **iconography over text** — route markers, colour-coded
paths and symbol posts let a player navigate pre-literacy of the
map; colour-coding is *systemic* (a route keeps its colour
everywhere it appears: sign, map, badge-adjacent UI); (3) **the
sign hierarchy** — threshold signs (you are entering X), direction
signs (Y that way, Z this way), rule signs (the place's one law),
and plaque signs (history/flavour) are different objects with
different placements; (4) **signs as canon surface** — because
signs are the world speaking in text, they are where a setting's
vocabulary discipline is most exposed: a sign can leak what the
fiction is hiding.

**Canon ground — the two-layer law rules this whole system.** The
canon sweep (owner-ruled, applied in PRs #370/#371) set Region 1's
**display layer**: the region is **Iridescence**; routes are
gemstone-named (**Route Topaz, Route Emerald**, the gemstone
system continues); the postgame isles are the **Seven Mochii
Isles**; "digital/data" vocabulary was scrubbed from in-world text
(the Silicon Town sign now reads *"The genesis of your journey"*).
The **production layer** (Mainframe, Data Isles, Binary Woods ids)
stays in production docs and data keys — **a sign is a display
surface, so signs only ever speak the display layer.** Deeper:
THE SECRET — "Mainframe" is the secret true name, "the mainland"
is the cover word; secret-keepers may *slip* in dialogue per canon
rules, but a **sign never slips**: signage is authored by the
world's ordinary surface and carries cover vocabulary only.

## Native spec: `mochiichao/wayfinding/v1`

### Sign families

| family | job | placement | voice |
|---|---|---|---|
| `threshold` | name the place being entered | at the boundary, facing entry | place name, optionally one epithet line |
| `direction` | point onward | at junctions and route forks | place names + arrows; gemstone route chip (below) |
| `rule` | state the place's one operative law | where the law bites (gate, treeline, cave mouth) | imperative, short — the Cave of Echoes / Dark Forest treeline class |
| `plaque` | history / flavour / record | beside the thing it glosses | the world's record-keeping voice (Hall of Records register) |
| `marker` | non-text navigation | along routes, at intervals | icon posts: route gem chip + silhouette pictogram of the next place's landmark |

### The gemstone route system

- Every route has a **gem identity** (Topaz, Emerald, … —
  continuation of the system is content: unassigned routes are
  OPEN, the system does not mint gems).
- The gem appears as: a coloured chip on direction signs, the
  route's colour on the Mochiioteca map (#81), and the marker
  posts' inset stone. One route = one gem = one colour, everywhere.
  Colours come from the COLOR-SYSTEM palette discipline when
  assigned.
- Route signs name **display names only**: "Route Topaz", never a
  production id; a sign that would need a secret-layer word is
  rewritten to the cover word or left unbuilt (see Leak rule).

### The Leak rule (signage form of THE SECRET)

1. No sign, marker or device-rendered direction text may contain
   secret-layer vocabulary: *Mainframe, Data (as a world-word),
   Binary, Codex* — nor any production id.
2. Where geography needs the concept, signs use the cover layer:
   "the mainland", the Isles' display name, gemstone routes.
3. A sign audit is part of this system: any new sign text is
   grep-checked against the secret vocabulary list before it
   lands (the canon sweep's hit-list method, applied prospectively
   to signage specifically).

### Sign data (signs are placed data, not art improvisation)

```json
{
  "sign_id": "<map id + index>",
  "family": "threshold | direction | rule | plaque | marker",
  "map": "<map id>",
  "position": "<tile/anchor>",
  "text_display": "<exact in-world text — display layer only>",
  "points_to": ["<place ids, for direction/marker>"],
  "art_key": "<parts-catalog sign blank + chip colour>"
}
```

Sign *blanks* (posts, plaques, gate boards) are environment parts
— drawn once into the parts catalog and reused; the text and chip
are data laid over the blank. A new sign is usually a data row,
not a new drawing.

## Wiring

- **Route graph (#11):** direction signs and markers are generated
  *from* REGION1-ROUTE-GRAPH edges — a junction sign's
  `points_to` is the node's edge set; if the graph changes, the
  sign audit re-runs. Signs never assert a route the graph
  doesn't have.
- **Dialogue kit:** sign text lives with the world's text data
  (the sign is a zero-NPC dialogue object); the R1 draft pool
  already carries sign lines (Neon City + Stoneport signs, dojo
  plaques, the cave warning plaque) — those are this system's
  first citizens, re-homed under the sign schema at landing.
- **Mochiioteca (#81):** the device map/directions render in this
  system's vocabulary (gem chips, display names) — one wayfinding
  language across wood and screen.
- **Show:** signs are background art with text discipline — a
  readable sign in a shot is a display-layer surface and passes
  the Leak rule at storyboard stage; the show's Japanese-lore
  register (torii-class gate boards) is the art direction for
  blanks, via the parts catalog.

## Open slots (not invented)

- Gem assignments beyond Topaz/Emerald, and their colours.
- Sign blanks' final art (parts-catalog builds).
- Per-map sign placement beyond the R1 lines already written —
  placement rows are lane work under this schema.
- Whether any place earns a *second* rule sign — the one-law-per-
  place discipline is the default; exceptions are rulings.
