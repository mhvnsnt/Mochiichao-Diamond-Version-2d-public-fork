# #295 — RANKS & EMBLEMS → the Adventure grammar of "how well" and "how far"

**Doctrine seat:** The Sonic Adventure design speaks
two small languages everywhere, and both are missing
here. The first is the **rank**: every attempt at a
stage or challenge is answered with a letter — a
score read against authored thresholds, from the
bottom rank to the top — so "clearing" is the floor
of a conversation, not the end of it. The second is
the **emblem**: a shown collectable, earned at
milestones, displayed in one place, whose total is
the shape of a whole journey. Mochiichao has the
substrate for both — #164's missions, #186's ladder,
#98's Fragment case (which already *shows* progress
as lit slots) — and neither grammar. This package
founds both, as grammar, not content.

**What was studied.** The documented Adventure
record: ranks assigned per attempt from score data
(time, yield, accuracy-class measures) against
per-challenge thresholds — ranks **E up to A**, with
a top class above A reserved for near-perfection;
emblems awarded for clears, rank milestones, and
contest wins, counted in the hundreds across a whole
game, displayed as a collection, and gating —
at authored totals — the game's deepest extras.
The kit taken: the rank grammar, the emblem as
shown-countable honour, the authored threshold.
No brand marks, no names carried: letters and
objects are grammar, and ours get native names.

## Native spec — `mochiichao/ranks-emblems/v1` (fragment beside this doc)

- **Ranks — a scoring overlay, never a second
  result.** A rank is a **derived read** over a
  completion record that already exists: a #164
  mission completion, a #186 ladder run, a #292
  climb seat/zone, a #294 care-sport result. The
  completion's own facts (time, attempts, seats,
  margin data its home system already records)
  are scored by a **rank table** — authored per
  activity family (data: thresholds per rank), and
  the rank is computed at read, **never stored**
  (#14's law: what can be derived is not a record).
  - Rank scale (closed): five letter ranks, low to
    high, **plus one top class above the highest
    letter**, earned only at the table's ceiling —
    the documented shape. The letters and the top
    class's display names are #23 text data (the
    grammar is founded here; the words are a naming
    pass, and no imported letter-set is asserted as
    canon vocabulary beyond the shape).
  - A rank changes **nothing** but honour surfaces:
    it may be required by #104 honour occasions and
    shown wherever its home record is shown; it
    never gates progress, never alters a reward
    already earned, never re-opens a completion.
    Re-attempting for a better rank is the activity's
    own business (#164/#186/#292 already allow it);
    the rank simply makes the ambition legible.
  - Activities opt in by having a rank table: **no
    table, no rank** — story beats (#138), rescues
    (#245), and ceremonies are never ranked (ranking
    a rescue is a category error the grammar refuses
    by construction: their homes carry no scoring
    facts to read).
- **Emblems — progression honours, shown like
  Fragments.** An emblem is an **honour-class
  collectable**: earned at authored milestones
  (a climb cleared, a circuit set completed, a
  rank-ceiling reached, a facility's HEAD bested,
  a care-sport championship class) and recorded as
  an honour fact in #104's family — with its
  **display seat in #98's licence presentation**,
  beside the Fragment case: Fragments show the
  dojo journey; emblems show the *whole* journey —
  facilities, sports, and postgame in one view.
  - Emblems are **counted, not spent**: no emblem is
    ever consumed, traded, or lost (#274's fences
    cannot fence them — they are not items; the
    emblem record names an individual-and-milestone,
    non-transferable by shape).
  - **What a full set unlocks is a content slot**:
    the mechanic founded here is counting + display
    + milestone awarding. Whether an authored total
    opens anything (a final facility, a ceremony,
    a #163-class secret) is canon content decided
    with the facilities it counts — none is asserted.
  - Emblem designs (the objects' look) are a
    production slot of the #98 case-design class —
    owner/production canon, not founded here.

## Show lane

Ranks never appear on screen (the show has no
scores — #82's grammar). Emblems may: a Ranger's
shown collection in a licence beat (#238's card
presentation family) is set dressing with truth in
it — every emblem shown corresponds to a milestone
the fiction actually gave them (casting keeps the
record honest; no emblem is drawn that the story
didn't earn).

## Wiring

Rank reads seat over #164/#186/#292/#294 completion
records (each home keeps its facts; rank tables are
data annexes in the same homes); honour awards join
#104; display joins #98/#238; the no-rank fence is a
validation rule over the ranked families' list.
STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — rank derivation,
  the closed scale + top class, emblem awarding,
  counting, display, and both fences.
- **Contents: zero rank tables, zero emblems
  instanced.** Thresholds, milestone lists, display
  names, and any full-set unlock are content/canon
  slots. The yield is the grammar itself: any future
  activity can now answer *how well* and contribute
  to *how far*, in one shared language.
