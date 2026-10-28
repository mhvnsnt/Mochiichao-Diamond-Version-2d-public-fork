# #258 — GROWN-WEAPON GROWTH RECORDS → how a line's grown weapon changes shape, written down per stage

**The gap this fills.** The grown-not-held law says a
Mochi's weapon is anatomy. But anatomy *develops*: the
A3 line's weapon is a twig-shoot on a seedling, a spear
on a page, a blooming lance on a knight — three
different shapes, one continuous growth. Until now
that growth lived only in the sheets' prose, one stage
at a time, so no other system could answer the simple
question: *at this stage, what exactly is the weapon
grown from, and what did it replace?* This spec makes
the growth a record — a small annex on the line's
sheet data — so animation, rigs, and coverage all read
the same answer.

**The owner's anatomy reading (canon, 2026-10-27),
which this record exists to carry:** grown weapon
anatomy can *replace* a limb as a line evolves.
Budguard's spear side is a **shortened arm** — he lost
part of the arm evolving, and the shoot grows from the
shortened arm, so it reads held like a weapon while
still being grown. His other arm became the shield.
His bud is a helm. Replacement is not damage and not
equipment: it is the line's growth, recorded as such.

## Native spec — `mochiichao/grown-weapon-growth/v1` (fragment beside this doc)

- **The record** — one per line stage that carries a
  grown weapon, annexed to the sheet beside its
  Anatomy notes (the #152 annexation pattern — the
  sheet stays the only source of truth):
  `{speciesId, stage, partId (a #259 part), growsFrom,
  limbRelation, growthNote}`. `limbRelation` is the
  closed heart of it: `extension` (the weapon grows
  out of an intact limb — the limb is still whole
  behind it) · `broadening` (the limb's own surface
  becomes the weapon/armour — a leaf becoming a
  shield) · `replacement-partial` (the limb shortens
  and the weapon grows from what remains — Budguard's
  spear arm) · `replacement-full` (the limb is gone
  as a limb; the weapon stands where it stood —
  Verdilance's arm, continuous with the lance stalk).
  The vocabulary is closed because the design lane
  writes these by hand; a growth that fits none of
  the four is a conversation with the owner, not a
  fifth value coined in data.
- **The worked example — the A3 line, from its sheets
  and the owner's reading** (recorded here in full so
  the shape is checkable against the source):
  - **Seedquire (stage 1):** `extension`. Sheet:
    "One leaf-arm ends in the grown twig-shoot"; the
    shoot drags a tick beside its footprints and is a
    key mass of the silhouette. The arm is whole; the
    twig is its tip grown long.
  - **Budguard (stage 2):** spear side
    `replacement-partial` — sheet: the twig "has
    become a proper page's spear of green wood," grown
    from the arm; owner's reading: the arm itself is
    shortened by the evolution, the spear-shoot
    terminal on what remains. Shield side
    `broadening` — sheet: "its bud has opened into a
    broad leaf that it wears as a shield"; anatomy
    notes: "one arm's leaf is the shield (broad,
    veined, can be braced across the body)."
  - **Verdilance (stage 3):** `replacement-full` —
    sheet: "the other arm grown into — and continuous
    with — the sunflower lance stalk; the lance is
    never gripped as a separate object, it flowers
    from the arm's line."
  The record also carries what prose scatters: the
  lance's brace (Verdilance's anchor-splay footprint —
  roots anchor for a couched-lance brace) is a growth
  fact, and it is written here, not re-derived from
  footprint text by every consumer.
- **Who reads it.** #147's coverage ledger: a move
  performance is owed per anatomy, and a grown
  weapon *is* the performing anatomy for weapon moves
  — the ledger reads the growth record to know which
  weapon shape (and so which anchor set) a stage
  performs with; #9's validator already refuses a
  performance cueing anchors the body lacks, and the
  growth record is what tells it the body, per stage.
  Rigs (#259's consumers) build the stage's weapon
  from the record, not from the neighbouring stage's
  mesh. The sheets' DESIGN BRIEFs remain the design
  authority — where brief and record ever disagree,
  the brief is right and the record is a defect
  (stated so the record can never quietly become a
  second design source).
- **The non-join, stated flatly:** a grown weapon is
  never an item. No grown-weapon id may exist in
  #31's item layer — not as equipment, not as a drop
  (#166), not as a held slot filler (#183). A weapon
  that can be listed can be traded, and a grown lance
  cannot change hands; the schema is the law's teeth.

## Show lane

The growth record is the show's continuity sheet for
weapon anatomy: a flashback to a younger stage shows
that stage's weapon shape (Seedquire's twig, not a
shrunken lance), and an evolution sequence (#228)
grows the weapon on screen per the record — the
shortening of Budguard's arm is *shown* as growth,
the way the sheets describe it, never as loss.

## Wiring

Annex on the sheet, beside Anatomy notes; parts named
from #259's vocabulary; read by #147 (coverage), #9
(anchor validation), the rig layer (#5/#6 family).
Writes: nothing outside its own annex. Non-join:
#31 (item layer) — enforced as a schema rule at
landing.

## Open slots

None that are mechanics. Which lines carry grown
weapons, and each stage's growth note, are sheet
facts (design-lane content) — the A3 line is recorded
above as the worked example; the remaining lines'
records are written by the same sheet-distillation
pass that owes #152's profiles, not invented here.

## Coverage — honest

- Architecture: the record shape and its one worked
  line, verified against the A3 sheets' own anatomy
  text plus the owner's recorded reading.
- Contents: one line of three stages. The vocabulary
  (`limbRelation`) is the system's real yield — it is
  what lets "reads held, is grown" be data instead of
  an argument repeated per stage.
