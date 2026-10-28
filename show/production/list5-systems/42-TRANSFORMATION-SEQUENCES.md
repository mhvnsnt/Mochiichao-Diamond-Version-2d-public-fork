# #42 — TRANSFORMATION SEQUENCES (teardown → show format)

**What was studied.** How creature-catcher anime stages a
transformation, as publicly documented across the genre's
production writing: the sequence is a **ritual with fixed
grammar**, not an effect. The reference patterns agree on the
bones: an *announcement* (the event is named or signalled before
it happens), a *held pose* while the change fires, change
channels that fire in a **fixed order** so the audience learns to
read them, a *background divorce* (the world falls away to a
graphic field so the body is the only subject), and a *landing*
— the new state/form held long enough to be memorised, because
the audience must be able to draw it from memory afterward.
Mochiichao does not need this invented: DESIGN-PRINCIPLES §E
already locks the native grammar (E1–E6). This format is the
*sequence template* that §E implies — it builds on §E, cites it,
and adds only timing/staging structure.

## What §E already locks (restated, never re-derived)

- **E1** — three channels, fixed order: (1) silhouette,
  (2) colour, (3) aura/particles. A state is not "on" until at
  least two channels fire.
- **E2** — the ladder: **Base / Bright / Guard / Overwhelm** —
  emotional, reversible, not power levels (E6).
- **E3** — changes happen on a held pose, never mid-stride, never
  under dialogue.
- **E4** — identity survives: silhouette primitive, accent hex,
  balance flaw unchanged in every state.
- **E5** — *growth* (bond evolution) is a different event from
  state change: silhouette-first, permanent, announced by a new
  or enlarged sticky-out, delivered as a designed **growth card**
  in keeper-tech UI. Never revealed by dialogue alone.
- **E6** — no escalation arms race: new *forms* require a growth
  event, which is a story decision.

Two sequence types follow, and the format keeps them rigidly
separate: **STATE sequence** (E2 ladder moves; reversible;
frequent) and **GROWTH sequence** (E5; permanent; rare). A script
that calls a state change a "transformation" in dialogue is
breaking E6's spirit; the format names the types so writers
can't blur them.

## The sequence format (script + board notation)

Written in the house script blocks (VISUAL / ACTION / DIALOGUE /
MUSIC / SFX). A transformation beat is a numbered sub-block:

```
TRANSFORM <STATE|GROWTH> — <species> — <from> → <to>
  ANNOUNCE   : <signal — cry, Manual line, device chime, or silence>
  HOLD       : <signature pose id from the species' pose library>
  CH-1 SILHOUETTE : <what the sticky-out does>
  CH-2 COLOUR     : <accent spread / warm / cool / desaturate>
  CH-3 AURA       : <motif particles: rise / stop / pool / none>
  FIELD      : <background divorce card id, or NONE for Guard-in-place>
  LAND       : <held frames count> — <first action in the new state>
  SOUND      : <cry variant + SCORE-STATE move>
```

Rules the template enforces:

- **Channel order is not editable per episode.** CH-1→2→3, §E1.
  A sequence that needs a different order is a different device
  and needs an owner ruling, not a workaround.
- **HOLD precedes channels, always** (§E3). The pose id comes
  from the species' rig pose library (pilot-six rigs carry state
  poses; Dorowani's state set is the teaching set per
  DESIGN-PRINCIPLES worked examples).
- **FIELD divorce is mandatory for GROWTH, optional for STATE.**
  Growth gets the graphic field + the growth card (keeper-tech
  UI showing the silhouette filling in, §E5). State changes
  usually stay in the world — except Overwhelm in the Dark
  Forest, where the field *is* the Forest's dread grade and the
  "card" is the world itself desaturating (pattern stills to
  solid, §E2).
- **LAND is a memorisation hold**: the new form/state is held,
  in Base-readable framing, long enough to be learned. Boards
  mark it; the timing system (#16) exposes it as its own xsheet
  line — transformation holds are never stolen for pacing cuts.
- **Cries only.** The transforming creature vocalises (§4.2 voice
  law); meaning, if any, is carried by an intertitle under the
  subtitle rationing — a growth sequence is one of the rationed
  moments where an intertitle is *permitted*, never required.
- **Anatomy variance applies to sequences too**: the same state
  change is performed in the performer's anatomy (a swimmer's
  Bright is not a biped's Bright) — sequence blocks are written
  per species from its pose library, and the animscript class
  axis (#41) governs mythical stagings, which default to
  *refusing* the grammar: a mythical's state change, if canon
  ever shows one, is staged by withholding (cut away; the change
  has happened when we return) unless the owner rules otherwise.

## Wiring

- Grammar source: **DESIGN-PRINCIPLES §E** (governing) +
  DESIGN-THEORY G-series gate (state variants are gate-checked
  assets — Part 3 "States" checklist: primitive, accent hex and
  flaw unchanged from Base).
- Growth events consume **evolution edges (#8)**: a GROWTH
  sequence exists only where an edge exists; its trigger
  conditions are expressed in the story, the edge id is cited in
  the script's production notes.
- Staging consumes **scale chart (#43)** (LAND framing by class)
  and **SCORE-STATE (#13)** (MUSIC/SFX lines name the state
  move; Overwhelm in the Forest = ABSENCE).
- The growth card is a **keeper-tech UI** asset — same product
  line as the Mochiioteca and the keeper board (§F1), and its
  reveal grammar is the lab format's sibling (#46).

## Coverage — honest

- **Architecture: fully documented, and mostly already ours.**
  §E locked the channel grammar from the reference systems'
  documented practice; this package adds sequence structure
  (announce/hold/field/land), not new grammar.
- **Contents: per-species pose/state assets exist for the pilot
  six** (rigs + DESIGN-PRINCIPLES worked examples). New species
  acquire sequence blocks when their pose libraries are built —
  the format is ready before the cast is, which is the correct
  order for a template.
