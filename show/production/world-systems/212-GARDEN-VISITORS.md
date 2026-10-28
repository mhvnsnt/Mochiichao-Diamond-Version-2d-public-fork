# #212 — GARDEN VISITOR SYSTEM → guests the world sends, who owe nothing and are owed nothing

**Doctrine seat:** #84 founded the roster-binding
law (in its audio form): a resident row may only
name a species the place's spawn table stocks, in a
window when that species is active — and #84 itself
names the living-world form of the same law for
picture population. The Mochi Garden already has
its residents (#28's raising system, #106's
locations) and its own stocked tables (the verified
`garden-complex.spawn-tables.json`). What the
Garden has never had specified is the third
population: **visitors** — wild individuals who
come to the Garden for a while and leave, belonging
to nobody. This package specifies them as a
derivation over the Garden's own tables, under
roster-binding, with a strict no-writes rule.

**What was studied.** Visitor/guest systems in the
publicly documented record (garden and town games'
wandering guests; the reference series' roaming and
visiting creatures): the durable pattern is that a
visitor is *computed from what the place already
stocks*, appears on the place's own clock, interacts
presentationally, and departs without becoming a
possession. The kit taken: table-derived presence,
windowed visits, and the guest who cannot be kept
by the visiting system itself.

## Native spec — `mochiichao/garden-visitors/v1` (fragment beside this doc)

- **Who may visit (roster-binding, applied).** A
  visitor is an individual of a species stocked by
  the Garden-complex tables (or an adjacent area's
  #7 table the Garden's grounds join — the join is
  geography, #11's graph, not a species list). A
  species the world does not stock there cannot
  visit, however charming the idea; the visitor
  derivation reads tables exactly as #84's resident
  law reads them, windows included.
- **A visit is derived, never stored.** Presence is
  computed at read from the tables + #19's phase +
  the visit window the derivation rolls (seeded,
  reproducible — #94's discipline: the same inputs
  give the same guest, so a visit is a fact about
  the world's state, not a saved spawn). No visitor
  record is written to the save; when the window
  closes, the guest is gone and nothing about it
  persists anywhere.
- **Visits write nothing to the visitor — and the
  visitor writes nothing back.** The guest is not
  kept: #106 gains no location for it, #80 gains no
  individual record for it, and **#14's dex states
  are untouched** — a visit is none of #14's three
  transition sources (not a #7 encounter, not a
  keep, not `mark_seen`), so a Garden guest neither
  reveals nor registers its species for the Ranger.
  Meeting the species properly still happens in the
  world. This is stated flatly because it is the
  rule a visitor system most easily breaks by
  accident.
- **Residents react; nobody's state changes.**
  Resident individuals' behaviour during a visit
  reads their #152 profiles (the Garden view —
  greeting, wariness, play, indifference are profile
  vocabulary, not new behaviour), and visitor–
  resident sound is #155-class presentation (cries
  only; the voice law holds in the Garden too). A
  visit can be the *occasion* for ordinary systems
  (care, play — #28/#65's loops, on the residents)
  but the visitor itself accrues nothing: no bond,
  no care axes, no honours. A visitor that returns
  on a later window is a new derivation; whether it
  is "the same" individual is a question the system
  does not ask and the save does not answer.
- **Becoming a resident is a different act.** If a
  visiting species is ever to join the Garden, the
  path is the world's ordinary one (encounter →
  keep → #106 location), never a conversion of the
  guest. The visitor system has no "keep the guest"
  verb — by construction, not by omission.

## Show lane

Garden visitor beats are #82 texture with the same
casting law: a visitor in an episode is cast from
the Garden's stocked tables (roster-binding for
picture — #84's own citation of the living-world
law), reacts per #152, and leaves when the scene's
window closes. A visitor character the show wants
back is re-cast by story, exactly as #211's
reappearance rule states for releases: story may
reopen what systems close, and says so as story.

## Wiring

Derivation reads the garden-complex tables + #19
phase; behaviour reads #152's Garden view; sound
reads #155; the no-writes lines cite #14/#80/#106
in their homes at landing; residency transitions
route to #28/#106 and are not implemented here.

## Coverage — honest

- **Architecture: fully specified** over verified
  tables and the verified state machine it must
  not touch.
- **Contents:** the visitor derivation's window/
  frequency values are data (OPEN); no visitor
  species is named — the tables name them when
  canon stocks the Garden's grounds, and not
  before.

## Open slots (nothing invented)

Visit window lengths + derivation weights (data)
· which adjacent areas' tables join the Garden's
(geography, at landing against #11's graph) ·
visitor behaviour vocabularies beyond #152's
existing Garden view (profile-lane work) · whether
a visit may coincide with #56 festival windows
(an overlay question for #105/#195 — not ruled
here).
