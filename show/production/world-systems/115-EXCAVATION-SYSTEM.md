# #115 — DIG SITES & REMNANT SOURCING → excavation system

> **Status banner (inherited from #44, verbatim in effect):**
> the *system shape* below is a teardown product, ready to
> wire. **Every content element in this file is a PROPOSAL —
> NOT CANON.** No dig site is named, no remnant exists, and
> canon has not ruled that excavation — or revival itself —
> exists in this world at all. This package builds the empty
> shelf's *supply side*, on purpose, and is written so it can
> be deleted cleanly if the owner rules the whole direction
> out (the same property #44 secured for itself).

**What was studied.** Excavation systems in the public game
record, as publicly documented: **dig sites** as authored
area features; an excavation interaction (survey → dig →
extract, classically a small grid/tool-durability minigame);
and **find tables** whose rows resolve overwhelmingly to
ordinary materials — with the rare, load-bearing exception of
**remnants** (fossils), the item-class pointers that feed a
revival system. The architectural kit: dig sites are where
remnants *come from*; the revival process itself lives
elsewhere and is not this system's business.

## The boundary with #44 (the whole design, in one paragraph)

#44 owns revival: the remnant record (`{remnantId, pointsTo:
speciesId|null, originArea, status}`), the remnant ≠ species
separation, the place of process (**Aeon's lab only**), and
the completion rules. **This system owns sourcing only:** how
a remnant record acquires its `originArea` and enters the
world. An excavated remnant is written as a #44 record with
`pointsTo: null` (its species, if any, is unauthored until
data-first intake authors it) and `originArea` = the dig
site's area. Excavation never revives, never identifies, and
never resolves a pointer. If a find table could produce a
living creature, it would be a spawn table wearing a costume
— **find tables resolve to items and remnants only, ever**,
and extinct species remain absolutely excluded from wild
spawn (#44's rule, restated because this is the system most
likely to be misread as an exception to it).

## Native format — the dig site record

```
site { siteId, areaId, findTableRef, accessGate, status }
```

- `areaId` — a real place id: dig sites attach to areas the
  world already has (route-graph node / spawn-area join, the
  same flagged id alignment as #114 — landing verifies).
- `findTableRef` — a **find table**: spawn-table-*shaped*
  (weighted rows) but resolving to #31 item ids and #44
  remnant records — materials (which feed #103's crafting
  layer, list11, as its raw-input side) and, rarely, remnants.
  Find-table rows are **content**: zero rows are authored
  here; a find table with invented rows would be invented
  canon with extra steps.
- `accessGate` — a #12 gate in the route-graph's own grammar
  (`story_flag | technique | fragment_count | null`) or null.
  Whether digging needs a technique (and whether that
  technique would be a Rare Move under the rename law) is
  **OPEN** — no technique is named.
- `status` — every site record ships `PROPOSAL — NOT CANON`.
  The label is data, not a doc disclaimer: tooling that lists
  sites must carry it, so the proposal can never be laundered
  into content by a UI that forgot the banner.

## The dig interaction (shape only)

Survey (the site announces itself as a place feature, not a
random roll) → dig (the interaction proper — its minigame
grammar, tool rules, and failure states are **OPEN**; the
reference grid-dig pattern is documented but adopting its
shape is a design ruling, not a default) → extract (rows
resolve; a remnant row writes the #44 record and stops the
session's luck cold — remnants are events, not loot tier).
Repeatability, site depletion/refresh, and tool items (which
would be #31 records) are all **OPEN**.

## Wiring

- **Writes exactly one real thing:** #44 remnant records
  (`originArea` populated from a site). Everything else is
  consumption: #31 item registry (material finds, tool
  records), #103 crafting (materials sink, list11), #12 gates,
  #11/#7 area ids.
- **Show lane:** an excavation scene is a PROPOSAL-class
  story device under #44's §3 discipline — it may be pitched,
  never treated as established world fact; and its staging,
  if ever ruled in, follows #46's lab-arc grammar of care and
  patience, not a treasure montage.
- **Deletion property:** no canon system depends on this
  file. #44 stands complete without it (remnants could arrive
  by gift, story, or drawer); #103's materials have other
  lawful sources (its own spec's register). If the owner
  rules excavation out, landing deletes this file and the
  STAGING rows marked #115 — nothing else moves.

## Coverage — honest

- **Architecture: fully documented** (site + find table +
  remnant sourcing is the documented pattern).
- **Contents: none, under a standing NOT-CANON label thicker
  than any other file in Lists 1–12** — because this system
  touches the one mystery canon has explicitly left open
  (what stopped moving, and what rests where it stopped).
  The record shape and the boundary are the yield.
