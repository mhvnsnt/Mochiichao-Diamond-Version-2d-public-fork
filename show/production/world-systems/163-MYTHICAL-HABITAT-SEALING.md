# #163 — MYTHICAL HABITAT SEALING → the withholding discipline, as a system

**Doctrine seat:** some places in this world are
withheld on purpose. The Dark Forest depths are the
standing example: their spawn table exists and is
**empty** — verified at build time in
`world-systems/dark-forest.spawn-tables.json` (depths
area, grass table, **0 slots**) — and the emptiness is
canon, not a gap awaiting content. #41 built the
presentation grammar for what may be *shown* of a
mythical (TRACE → QUIET → SCALE → HELD REVEAL → NO
ORDINARY FRAME). This spec is the data-side twin: what
may be *stored, resolved, and derived* about where a
mythical lives — and the guarantee that this system
can never become the mechanism that fills the depths.

**What was studied.** Withholding as a design pattern
in the publicly documented record: legendary habitats
that are rumoured before they are findable; maps that
mark a region as unsurveyed rather than blank;
encounters that exist only as authored set-pieces
behind story conditions, never as table entries a
player can farm. The kit taken: a habitat record whose
location content is *sealed* — present as a record,
unresolvable as a place — until story facts the owner
controls say otherwise; and presentation that tops out
at evidence (traces, effects on the world) below those
facts.

## Native spec — `mochiichao/habitat-sealing/v1` (fragment beside this doc)

- **The sealed record:** `{speciesId,
  presentationClass: "mythical" (the field #41
  proposes for the sheet standard — this spec consumes
  it under that dependency), habitat: SEALED,
  traceKinds[] (the evidence classes the world may
  show, in #41's beat-1 terms: sign, effect, absence —
  the vocabulary is #41/#89's), accessFacts[] (#12
  story.* ids)}`. A sealed record contains **no area
  id, no coordinates, no table reference** — there is
  nothing in it to leak.
- **What sealing means for every consumer:**
  - **Spawn tables (#7):** a sealed species has **no
    row**. Not a rare row, not a gated row — no row.
    Its appearance in the world, if canon ever authors
    one, is an authored set-piece (encounter records
    in the #30/#99 pattern, under #52's authored
    set-piece class), never a table outcome.
  - **Range maps (#102):** the species' range renders
    as #102 already renders the Forest depths —
    **UNSURVEYED** — a marked unknown, not a blank and
    not a shape.
  - **Atlas / map module (#137/#32):** the sealed
    state renders as hinted-at-evidence at most,
    under #85's Leak rule (no secret-layer vocabulary
    on any display).
  - **Sound ecology (#84):** a sealed habitat's area
    may sound of what its tables stock — and the
    depths stock nothing. The withholding is audible
    exactly as it is visible: by absence.
  - **Media (#90):** generators read flags already
    set; a sealed species generates at most a
    TRACE-class report (evidence existed), never a
    location.
- **Unsealing is not a feature of this system.** The
  `accessFacts` list names the story facts under
  which *canon content* (an authored set-piece,
  written by the content lane under an owner ruling)
  may exist. This spec provides no operation that
  converts a sealed record into a table row, a map
  reveal, or an encounter — deliberately: if the
  depths are ever entered, it will be because the
  owner authored that entering, and the authoring will
  arrive as canon content with its own records, not
  as a flag flip inside a sealing system.
- **The depths clause, written as law:** the Dark
  Forest depths table stays EMPTY. Nothing in this
  package — no field, no derivation, no landing step —
  may add a row to it. Any future proposal touching
  the depths is an owner decision at canon level,
  outside every system's authority, this one included.

## Show lane

The show already obeys this discipline (the camera
does not stock the depths; what stopped moving there
is unanswered by canon law, #82/#138). This spec gives
the game data the same spine: the show's withholding
and the data's withholding are one rule in two lanes.

## Wiring

Species class read from #41's proposed
`presentationClass` (dependency registered in
STAGING: until that field lands in the sheet standard,
the mythical class set is owner-declared per species);
access facts in #12 `story.*`; set-piece home (if ever
authored): #30/#99 records under #52; consumer
behaviour stated for #7/#102/#137/#32/#84/#90 as
above — each consumer's landing cites this spec rather
than re-deciding sealing locally.

## Coverage — honest

- **Architecture: fully specified** (record shape,
  per-consumer behaviour, the no-unseal guarantee).
- **Instances: the depths, and only the depths, as a
  standing fact** (an empty table that predates this
  spec). Which species are mythical-class beyond
  canon's own declarations, every `traceKinds` list,
  and every `accessFacts` set are OPEN — sealing
  records instance nothing.
