# #255 — ENCOUNTER RATE & AREA PACING → how often the world steps out to meet you

**Doctrine seat.** #7's spawn tables say *what* an area
holds and *how likely each slot is once an encounter
happens* (weights) — but nothing anywhere said how
often an encounter happens at all. This spec adds the
missing number as data on #7's tables, states the
documented defaults, and resolves — in writing — the
one semantics question List 12 left open (the repel
floor), the Pokémon way.

## Native spec — `mochiichao/encounter-rate/v1` (fragment beside this doc)

### The rate (a proposal into #7's schema, landing in its home)

Each method table on a #7 area gains one field:

`encounterRate` — the probability that a step taken in
that table's terrain starts an encounter, rolled per
step on #94's seeded draw.

Documented defaults by method class (the values the
base games cluster around; an area's own data overrides
its class default, and the override is the area's
authored fact):

| method | default rate | note |
|---|---|---|
| `grass` | 0.10 per step | the standard tall-grass cadence |
| `cave` | 0.10 per step | caves meet you as often as grass |
| `surf` | 0.05 per step | open water is quieter |
| `fish` | — | no per-step roll: #111's cast owns fishing encounters entire |

A table may also carry `rate: null` to inherit its
method default (the schema's null-means-owed discipline
is respected — null here means "not yet authored", and
the engine reads the class default, stated in this
spec so the behaviour is never a guess).

### Pacing (authored targets, never adaptive)

Each area carries a pacing class as design data —
`quiet / standard / busy` — which is the area author's
statement of intent for how dense encounters should
feel, used by the content lane when setting rates and
by #208-class audits to check an area against its own
intent. **Pacing never adapts at runtime.** Rates do
not read the party, the clock of play, the player's
win/loss history, or anything else about the player —
the no-rubber-banding law (#70) holds for encounter
rates exactly as for bands and turn order. A quiet
route is quiet for the champion and the beginner alike.

### Repel & lure (the #112 transforms, semantics completed)

#112 defined the transforms and instanced nothing: lure
multiplies matching slots' weights at roll time; repel
removes low slots from a roll's pick; and the repel
floor's meaning — party-relative (Shape A) or item-fixed
(Shape B) — was left OPEN against #52's law that wild
bands never read party state.

**Resolution (Pokémon-base rule): Shape A — the floor
is the lead individual's level.** That is how the base
game's repel works, and it does not break #52's law,
because the two systems govern different things:

- #52's law governs the **table**: what an area stocks
  and at what authored levels. Repel never edits a
  table, never scales a band, never changes a level.
- Repel governs **this roll**: when an encounter is
  struck, slots whose whole band falls below the lead's
  level are removed from *this pick only* (exactly
  #112's transform note). The world is unchanged; one
  meeting doesn't happen.

The ruling and this reconciliation are recorded in the
fragment so #112's `semanticsStatus: OPEN` can close at
landing by citation. Composition order for a single
roll, filled here (the order #112 left as a landing
decision): **table select → #113 swarm overlay →
repel filter → lure weights → weighted pick.** Lure and
repel on the same roll compose in that order and never
cancel by special case.

## Show lane

None. Encounter frequency is a game-feel number; the
show meets exactly who the story sends (#82's casting,
#84's roster-binding — a place only ever shows species
it stocks, which is the show-side echo of these tables).

## Wiring

The `encounterRate` field lands in #7's schema home
(proposal discipline: edited there, citing this spec);
#112's fragment closes its OPEN semantics by citation
to this spec; #52's bands, #113's overlays, and #111's
fishing are untouched. #214/#161-class derivations that
read encounter frequency read this field.

## Coverage — honest

- **Mechanism: complete and asserted** — rate field,
  class defaults, pacing classes, composition order,
  and the repel ruling.
- **Contents:** per-area rates beyond the defaults are
  area data, authored with the areas. The defaults
  mean no area is ever behaviourally undefined while
  its authoring is pending.
