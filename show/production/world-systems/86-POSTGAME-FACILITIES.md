# #86 — POSTGAME BATTLE-FACILITY FORMATS → POSTGAME FACILITY SPEC

**What was studied.** The postgame battle-facility architecture
(Battle Tower and its Frontier descendants), as publicly
documented: (1) **the streak format** — the core loop is not a
bracket but a *streak*: consecutive wins in sets (classically 7),
records kept per format, loss resets the run but never the
record; (2) **level normalisation** — facility battles flatten
levels to a fixed band (50/100 or open), so the contest is team
construction and play, not grinding; (3) **format variety as the
content** — singles/doubles/multi, and gimmick facilities that
bend one rule each (rental teams drafted from a pool, mid-run
swap drafts, item-less runs) — the *facility* is a rule-set with a
building around it; (4) **facility heads** — a named master waits
at a streak milestone (win 21/49 classically), the postgame's
answer to dojo masters: recurring, beatable, re-challengeable at
higher milestones; (5) **rematch ladders** — outside the
facilities, defeated majors (dojo masters, Elite) re-open as
stronger rematches on a cadence, which is how a finished map
stays alive.

**Pairing.** List 7 #66 sets the postgame's overall format (the
Seven Isles structure). This spec is the **facility layer inside
it**: the buildings, rule-sets and records. Display-layer naming
throughout (two-lane law): the isles are the **Seven Mochii
Isles** in every player/show-facing string; "Seven Data Isles"
appears only in production-layer ids and docs like this one where
the production layer is being discussed — and even here, sparingly.

## Native spec: `mochiichao/postgame-facilities/v1`

### The streak core (shared by every facility)

```
RUN     = a streak attempt in one facility + one format
SET     = 7 consecutive battles (win all 7 or the run ends)
RECORD  = best streak per (facility, format) — kept forever,
          derived from run history, never stored as a bare number
          (the completion loop's derive-don't-store rule, #14)
HEAD    = the facility master appears at streak milestones
          (first at set 3's end — 21; again at set 7's end — 49,
          stronger); beating a head marks the facility's symbol
          (symbol fiction OPEN — see below)
```

- **Normalisation:** facility battles run at a fixed level band.
  The band value is a **balance decision (OPEN)** — the system
  fixes the mechanism (all combatants scaled to band; moves/
  learnsets as the individual's own), not the number.
- **Between-command law holds:** facility battles are game-lane
  command battles under the Battle Doctrine; BATTLE-UI-FLOW and
  the presentation spec (#83) apply unchanged. Facilities change
  *who and how often*, never *how a turn works*.
- **Individuals, not species slots:** entrants are individuals
  (#80 records) — variance and RULED deviations ride along;
  rental/draft formats generate individuals from species data
  under the same model.

### Facility rule-sets (the format slots)

The Frontier lesson is that facilities are *one bent rule each*.
The set below names the **slots**; which isles/buildings host them
and who heads them are canon content — **OPEN**, not assigned here.

| slot | the bent rule | status |
|---|---|---|
| `streak-standard` | no bend — pure streak singles/doubles | format specified |
| `streak-draft` | team drafted from a presented pool at run start (rental architecture) | format specified |
| `streak-swap` | after each set, swap one team member for a presented option (draft-continues architecture) | format specified |
| `streak-rematch` | the run is a ladder of *rematches*: dojo masters and Elite return at facility strength, in route order | format specified — the rematch ladder lives here, not scattered across the map |
| further slots | — | OPEN — a facility is added by ruling, with its one bent rule stated in one line |

### Records & rewards

- Records derive from run history (per #14): best streaks,
  head-wins, symbols — all presentation over stored runs.
- Rewards are **device-shaped, never route-gating** (the
  completion loop's reward law, #14): facility success may grant
  Mochiioteca upgrades/recognition and items; it never locks
  geography. The postgame map is open because the game is
  finished, not re-locked behind facilities.
- Symbol fiction (what a head-win awards, in-world) is **OPEN** —
  Fragments belong to the dojo spine; facility honours need their
  own word, and minting it is an owner decision.

## Wiring

- **Postgame format (List 7 #66):** this layer plugs into the
  Seven (Mochii) Isles structure as its battle content; #66 owns
  the map/shape, this spec owns what happens inside facilities.
- **Route graph (#11):** the graph's postgame node (Seven Data
  Isles, production id) gains facility sub-nodes at landing —
  graph gains nodes, no edges change meaning.
- **Dojo/Elite data (#30 dojo format, #37 rival construction):**
  `streak-rematch` consumes the same encounter records as the
  first fights, at facility scaling — rematch teams are data
  variants, not new characters.
- **Completion (#14):** facility records are completion surfaces
  (counts of head-wins/symbols derive like dex counts).
- **Show:** postgame facilities are a later-season question; if
  the show goes there, heads are cast from canon (no facility
  character is invented by this spec), and streak drama follows
  the arc-conservation rules (#82) in reverse — postgame show
  material may change states the *game's* postgame also changes,
  only where the season canon map rules it.

## Open slots (not invented)

- Which isles/buildings host which facility slots; facility names.
- Facility heads — every one is a casting/canon decision.
- The level band number; set size is fixed at 7 by the format but
  the milestone streaks (21/49) are defaults pending balance work.
- The symbol/honour fiction for head-wins.
- Whether multi (co-op) formats exist — architecture allows the
  slot; no slot is opened here.

**PROPOSAL from List 19 #186 (registered at its landing, 2026-10-27):** a facility `ladder` slot in this file's table (186-FACILITY-LADDER.md; generation reads #94 verbatim). The run-record shape joins the run-history store this file's RECORD derivations read, under #96's absent = default rule. No facility, band row, or head is created by the proposal.
