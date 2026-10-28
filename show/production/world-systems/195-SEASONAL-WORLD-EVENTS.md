# #195 — SEASONAL WORLD EVENTS → windows over the world, never edits to it

**What was studied.** Seasonal and live-rotation event
architecture in the publicly documented record: content
keyed to calendar windows, rotating features resolved from
the world clock, festival gatherings that recur on a cycle.
The documented tension — scarcity pressure versus the
world simply *celebrating* — was already settled by this
programme's own #105. The kit taken: seasons as calendar
data, events as overlay registrations, activity resolved
deterministically at read time. No event names, dates, or
content are copied.

## Canon anchors (verified in the packages)

- **#105 is the festival calendar, and its law governs.**
  Window-keyed events; the **no-pressure law** inherited
  from #56 — time-locked means *when*, never *hurry*;
  everything recurs (a festival record has no `year` field
  and no one-time flag); missing a festival costs nothing
  permanent. (The commissioning brief credited the calendar
  to #56; #56's garden-minigame spec contributes the law —
  "the token never buys power", prizes rotate without
  pressure — and #105 built the calendar on it. The
  citation is corrected here so the chain stays honest.)
- **#105 also left the calendar OPEN.** Season names, day
  kinds, year shape are unruled (#93's slot, inherited) —
  festival windows are specified against an abstract
  `season` + phase vocabulary, "instanced by nobody".
  #195 inherits the slot at exactly that state.
- **#124 is the resolution engine.** Rotation resolves as
  a deterministic read-time function over the world clock;
  the active set is derived, never stored; media reads the
  same derivation (#90/#172 may announce only what
  activates).
- **#113 is the overlay discipline.** An overlay is a
  roll-time transform over a #7 table — "tables on disk
  never change" — under two standing laws: overlay
  selection never reads party state (#52), and **no
  overlay may target the Dark Forest depths**, absolute.

## Native spec — `mochiichao/seasonal-events/v1` (fragment beside this doc)

- **Season records are data — when there is a calendar.**
  A season record is `{seasonId, window, regionScope}`,
  where `window` is a predicate over #105's calendar
  layer in its abstract vocabulary (season + #19 phase).
  Until the owner rules a calendar, season records are
  **shape only, zero instanced** — this package does not
  smuggle a calendar in through the event layer.
- **A seasonal event is a bundle of registrations, in
  their owners' formats.** An event record references:
  #113-discipline overlays (encounter availability), #124
  rotation fixtures (what rotates in), and #105 festival
  windows (gatherings) — each written in its home format,
  each cited, none redefined here. The event record holds
  the bundle's identity and window; the content lives in
  the systems that own it.
- **An event changes availability windows only.** It may
  make encounters available, fixtures active, festivals
  staged — while its window is open, resolved by #124's
  derivation at read time. It writes **no canon facts**:
  no story or progress flags (the #138/#164 fence — below
  story rank, always), no dex states, no species
  availability *as a fact* (availability during a window
  is overlay presentation, and the species' #7 table entry
  is untouched), no honours except those its own festival
  grammar grants as records of attendance.
- **Never the depths.** Seasonal overlays obey #113's
  Forest exception without exception of their own: no
  seasonal overlay targets the Dark Forest depths, no
  event animates them, and an event whose fiction concerns
  the Forest's stillness is a content proposal for the
  owner — literature, not a mechanic this package ships.
- **The no-pressure law, inherited verbatim.** Everything
  recurs; nothing earnable is earnable only once; event
  goods are cosmetic, record, and care-class — never
  power, never story progress, never a species' only
  availability window (#105's clauses, applied to the
  whole event layer, not just festivals).

## Show lane

Seasonal events are episode anchors under #82's arc
grammar: the world gathering is a ready-made beat — a
festival episode, a migration the cast travels to see.
The show inherits recurrence as freedom: an in-world
festival can return in a later season of the *series*,
staged fresh, because the world itself brings it back.
The event layer supplies the world's calendar of
occasions; episodes supply what they meant.

## Wiring

Calendar + law: #105 (on #56's ethic), clock #19.
Resolution: #124. Content channels: #113 overlays, #124
fixtures, #105 windows — in their owners' formats.
Announcements: #90/#172 read the same derivation.

## Coverage — honest

- **Architecture: fully documented**; the load-bearing
  yields are the registration-bundle shape and the
  windows-only fence.
- **Contents: zero seasons and zero events instanced** —
  the calendar itself is the owner's OPEN ruling, and
  every event awaits it.
