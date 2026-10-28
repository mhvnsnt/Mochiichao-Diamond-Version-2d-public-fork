# #8 — EVOLUTION DATA STRUCTURES (teardown → native model)

**What was studied.** Two public architectures. (1) The collector
games' evolution tables, as documented in the decomp literature: a
flat list of *(from-species, method, parameter, to-species)* triples,
where `method` is a small enum (level-up, item, trade, bond, location,
time-of-day, held item, move known…) and `parameter` is the method's
operand (a level, an item id, a place). One species may hold several
triples — that is all branching ever was in that architecture: the
table, not the species record, carries the graph. (2) The
monster-raising line's branching trees (Digimon-style): many-to-many
graphs where a stage can reach several next stages and several
previous stages can converge — which, as data, is the *same* edge
list with the one-child assumption dropped, plus convergence edges
(n→1) that the first architecture rarely uses.

**The native model is therefore one edge list** — `evolution.schema.json`
— where every evolution in the world is a single edge:

```
{ from, to, methodClass, trigger, conditions[], representation, status }
```

- `methodClass` — the enum below; it classifies, it does not number
- `trigger` — the method's operand as data (`{level: n}`,
  `{item: id}`, `{location: areaId}`…), `null` until canon sets it
- `conditions[]` — additional gates (time band, held item, known move)
  in the same condition shape the event/flag schema (#12) uses, so
  the two systems read each other
- `representation` — `standard` unless the line's biology breaks the
  one-creature-in/one-creature-out assumption (see A9)

## The method-class enum (native names, reference-mapped)

| Class | Meaning | Where canon already shows it |
|---|---|---|
| `growth` | Reaches the next stage by growing; no special trigger | The wave-1 sheets' own wording — "growth class" is the design lane's term, used across the R2 lines |
| `level` | Level threshold | Gen-1 core: `evolutions.json` holds 29 evolutions, all level-class (structured data, stays in the core — mapped, not copied, below) |
| `bond` | Bond/thankfulness count | Wave-1 C4 sourced trigger: a thankfulness-count evolution is recorded in the design lane's expansion disclosures |
| `colony` | Colony/group formation | Wave-1 C4 sourced trigger: colony-formation |
| `form-shift` | A form completes and the creature becomes it | Wave-1 C4 sourced trigger: "the dome gains the face" |
| `item` | Item used on the creature | Reference architecture; no canon instance yet — class exists, edges don't |
| `trade` | Exchange between Rangers | Reference architecture; no canon instance yet |
| `place` | At a location / in a habitat state | Reference architecture; candidate shape for habitat-locked lines — no canon instance asserted |
| `time` | Time-band gated | Reference architecture; Frost/Wispkin-adjacent lines are candidates — unasserted |
| `single-stage` | The line has no evolution | Wave-1: single-stage concepts (B1 Plowpus, B2 Sentripea, B4, B7–B11…) carry **no edge**; their sheets state it. Absence of an edge *is* the data — the schema forbids placeholder edges |

## Alignment to the sheet format (the fields-only rule)

- **Gen-1 core:** `src/data/core/evolutions.json` (29 level edges) and
  the roster's `evolution_reqs` already carry Gen-1 in structured form.
  This package does **not** re-encode them. The schema maps onto that
  shape 1:1 for level edges (`from/to` + `trigger.level`), so core
  data validates against it as-is; Dorowani and Gabu have no evolution
  data anywhere in canon (Sideline A audit) and gain **no** edges here.
- **Wave-1 sheets:** the 19-field apparatus carries Evolution as
  **prose** ("Becomes Shieldane as it grows… (growth class)"), and the
  coded draft (`species-data-draft.json`) mirrors it as a string.
  `evolution-edges.wave1.json` is the structured twin of that prose:
  **64 edges parsed mechanically from the 60 confirmed lines** in
  `mochichao-design/COVERAGE-AND-ROADMAP.md` §4 — every edge
  `methodClass: "growth"`, `trigger: null`, because the sheets set no
  numbers by design (roster numbers and stat numbers are assigned
  together at the owner's canon lock, never before). The prose stays
  the record; the edges are the machine-readable index of it.
- **Intake template:** new species sheets keep the prose Evolution
  field exactly as the lane writes it; the edge is derived at coding
  time. One source of truth, two readings — the same relationship the
  footprint PNG has to its manifest entry.

## The two hard cases, handled as data

- **A9 pair-merge (Lonelily → Pairbloom → Twinvow).** The line evolves
  *by pairs*: two Lonelily become one Pairbloom. The edge list can
  name the stages, but roster representation (does the pair occupy
  one slot? two?) is a flagged owner/game-design decision (design
  lane's gap register §5.4). Both A9 edges ship with
  `representation: "OWNER_DECISION"` and the question attached —
  the schema's job is to make the gap addressable, not to answer it.
- **Body-plan breaks.** Several wave-1 lines are allowed exactly one
  body-plan break, at the final stage (Shieldane → Bastihound posture;
  Pikeperil → Halberdrake fish→drake), per the regional law the sheets
  cite. That is design data, not evolution mechanics: it lives in the
  sheets' Anatomy notes and is deliberately **not** an edge field.

## Branching, honestly

The schema supports 1→n branching and n→1 convergence because it is
an edge list. But canon currently contains **no confirmed branch**:
all 60 wave-1 lines are linear chains (1–4 stages), and Gen-1's 29
core edges are level-class lines. Branching classes ship as
*vocabulary with zero asserted instances* — ready for the first line
canon actually branches, never pre-populated from the reference
franchises' trees.

## Coverage — honest

- **Architecture: fully documented.** The triple-table shape and the
  method taxonomy are completely covered by public decomp
  documentation; the branching generalisation is a data-modelling
  step, not a research risk.
- **Our contents: prose-complete, number-free — by design.** Wave-1
  evolution *existence* is 124/124 sheets; numeric triggers are 0,
  deliberately, pending the owner's canon lock. Gen-1 is the
  inverse: 29 structured edges, the rest of the 47 unlinked in data
  (roster `evolution_reqs` is the lane's other half of that picture).
  Nothing in this package converts prose to numbers or gaps to edges.

**Citation (List 21 #199, landing 2026-10-27):** evolution method classes map as recorded in 199-EVOLUTION-METHODS.md — its "exchange" class is THIS model's `trade` class, with the consumption semantics stated there. This citation is the whole wiring: the methodClass enum is not touched, no edge is edited, and the Twinvow pair-merge representation stays exactly as this model ships it (owner decision).

---

**Landing citation — List 34 (2026-10-27), citing STAGING step 4.**

#329 care-branch evolution (`world-systems/329-CARE-BRANCH-EVOLUTION.md`) builds its fork grammar on this file's (#8's) table architecture — branching was always the table's, not the species record's — and lands its semantics section in #199's file, the evolution package's other home. This file's model does not change.
