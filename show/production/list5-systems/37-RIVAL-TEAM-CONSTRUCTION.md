# #37 — RIVAL TEAM CONSTRUCTION (teardown → native format)

**What was studied.** How the reference games build an opponent's
party, as publicly documented: a rival's team is never a random
draw. It is a **grammar** — a fixed spine (the rival's partner,
chosen as the counter to yours), a level band tied to story
progress, slots filled by role (coverage, answer, signature), and
a *revision history*: the same rival re-appears with the same
individuals grown, so the player reads growth by comparison. The
party is a character sheet expressed in creatures.

## The native format — rival encounter record

One record per rival *appearance* (not per rival). Schema:
`rival-encounter.schema.json`. Shape:

- `encounterId` — stable id (`hex-r1-first`, `hex-r1-dojo-circuit`…).
- `rivalId` — cast id (Hex is the canon rival; the format is
  rival-agnostic for dojo masters and Elite members, see #45).
- `storyBeat` — event-flag id (#12) that arms this appearance.
  An encounter that isn't gated by a flag doesn't exist.
- `party[]` — ordered slots, each:
  - `speciesId` — core species id.
  - `role` — one of the grammar roles below.
  - `levelBand` — `{min, max}` or `null` until canon sets numbers.
  - `individual` — `true` for a returning individual (same creature
    across appearances; growth is read by diffing records).
  - `knownMoves` — move ids or `null` (rename law: ids stable,
    display names resolve at render).
  - `status` — `canon: <source>` / `provisional` / `OPEN`.
- `stakes` — what the encounter pays or costs in circuit terms
  (#45): Fragment eligibility, route unlock, or `narrative` only.
- `rematch` — pointer to the next appearance record of the same
  rival, or `null`. The chain *is* the rival's arc.

## The party grammar (roles, fixed vocabulary)

| Role | Job in the party | Canon anchor |
|---|---|---|
| `partner` | The rival's bonded first Mochi; counters the player's starter choice where canon sets that up | EP02's choosing is a rescue-choosing among five starters; Hex's partner is **OPEN** until canon names it |
| `answer` | Built to answer the player's *previous* encounter — the rival learns | Show doctrine: battles are living fights; rivals adapt between commands too |
| `coverage` | Type/element breadth so no single player pick walks the party | Element vocabulary per species template (TBD D6) |
| `signature` | The slot that performs the rival's identity — their equivalent of a signature move pairing | Signature attacks are per-species canon (DESIGN-BRIEF §4.5); a rival's signature is a *pairing*, never a borrowed species signature |
| `growth-proof` | A returning `individual` whose stage/level visibly advanced since the last record | Evolution edges (#8) supply the legal growth paths |
| `wildcard` | The one slot the grammar allows to surprise — drawn from the encounter area's spawn table (#7) | Roster-binding law: ambient/wild species come from canon tables, never invented |

Party size, level numbers, and Hex's actual species are **not**
filled by this spec: canon has not set them, so records ship with
those fields `OPEN`/`null`. What the format guarantees is that
when canon does set them, every appearance of every rival is
written the same way and diffs cleanly against the last one.

## Show-side use

The same record drives the show: a scripted rival battle cites its
`encounterId`, and the party the animators stage is the record's
party — one source for game and show (two-lane consistency law).
In the show lane the `answer` role is written as behaviour, not
stats: Hex's party visibly counters what it saw last time.

## Wiring

- Armed by **event flags (#12)**; gates read the **route graph
  (#11)** position.
- Members drawn from **spawn tables (#7)** (wildcard) and legal
  growth paths from **evolution edges (#8)** (growth-proof).
- Stakes settle through the **dojo circuit (#45)**.
- Anatomy variance (#9 animscripts) applies per member exactly as
  for the player's party — a rival's Mochi performs a move in its
  own anatomy, never the player's animation.

## Coverage — honest

- **Architecture: fully documented.** Counter-pick partners, role
  slots, level bands, returning individuals — the standard,
  publicly documented rival pattern across the reference series.
- **Contents: spine only.** Canon gives us the rival (Hex,
  neighbour → Champion), the five starters, and the circuit he
  caps. His party, levels, and partner species are OPEN slots in
  the schema's examples-by-omission — this package asserts the
  grammar and no roster.
