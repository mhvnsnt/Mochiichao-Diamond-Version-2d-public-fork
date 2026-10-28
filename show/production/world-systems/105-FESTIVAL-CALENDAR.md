# #105 — SEASONAL / TIME-LIMITED EVENTS → festival calendar

**What was studied.** Seasonal-event architecture in the
documented games: content keyed to a **calendar window** rather
than to story progress — special encounters, decorations, NPC
gatherings, and limited activities that exist while the window
is open and are gone when it closes, returning on a cycle. The
well-documented design tension is scarcity pressure (miss it
and wait a year) versus the festival as a *place the world
gathers*. Mochiichao takes the architecture and refuses the
pressure — see the law below, which is this spec's reason to
exist. The kit taken: window-keyed world events, calendar as a
consumer of the world clock, festival as a multi-system
gathering format. No event names, dates, items, or text are
copied.

## The no-pressure law (inherited, applied to time)

#56 fixed the Garden rule: tokens never buy power, prizes
rotate *without pressure mechanics* — a return visit is an
invitation, not a threat. The calendar inherits it absolutely:

- **Time-locked means *when*, never *hurry*.** A festival
  window says when the world celebrates; it never says what
  you lose by missing it. Festival goods are cosmetic, record,
  and care-class — never power, never story progress, never a
  species' only availability window (a species researchable
  only during one festival would weaponise the calendar
  against #97's attention-based design).
- **Everything recurs.** Windows are cyclic predicates, not
  one-shot dates. Anything earnable at a festival is earnable
  at its next occurrence, by construction of the format: a
  festival record has no `year` field and no one-time flag.
- **Missing a festival costs nothing permanent.** The format
  has no slot in which a permanent loss could even be written.

## Native spec — `mochiichao/festivals/v1` (fragment beside this doc)

- **The clock it rides:** #19's world state is the single time
  producer (phases `dawn | day | dusk | night`; per-area
  weather; priority `script > area > global`). Festivals add
  the **calendar layer** above phase: a festival window is a
  predicate over calendar position + phase. **The calendar
  itself — day kinds, season names, year shape — is OPEN**
  (#93 already left calendar day kinds open; this spec inherits
  the slot and does not fill it). Until the owner rules a
  calendar, festival windows are specified against an abstract
  `season` + phase vocabulary, instanced by nobody.
- **Festival record:** `{festivalId, window, placeId, beats,
  status}`.
  - `placeId` — a #11 route node; a festival happens *somewhere*
    the route graph knows.
  - `beats` — the festival grammar, four beats any instance
    fills:
    1. **ANNOUNCE** — Iridescence media carries it (#90's
       channel blocks are state-reading generators; a festival
       announcement is one of their natural outputs — display-
       layer names only, per #90's Leak discipline).
    2. **GATHER** — named NPCs attend: #93 schedule *overrides*
       for the window (the schedule system's override slot is
       the mechanism; ambient population stays LIVING-WORLD's
       layer, per #93's hard line).
    3. **ACTIVITY** — the festival's verb, expressed through
       existing systems only: a #56 minigame loop, a #78
       showcase exhibition, #97 research demonstrations. A
       festival invents no mechanics; it *hosts* them.
    4. **CLOSE** — a closing beat that sets a `story.`-adjacent
       record flag (attendance is a fact the world remembers —
       a `vars.` attendance tally is the honest shape; the
       tally buys nothing, per the law above).
- **The Dark Forest takes no festivals.** The Forest's state is
  the dread cycle (#19), advanced by depth and script, never by
  the clock — a calendar event cannot reach it. A festival at
  the Forest's *edge* (the Gate is not the Forest) is a script
  decision; **no festival instance is asserted here, and a
  depths festival is excluded by the same withholding
  discipline as #33's "no Forest eyecatch, ever."** Marked
  PROPOSED as a standing rule for owner confirmation, since
  canon states the dread-cycle fact and this extends it.

## Show-side echo

Festivals are the show's gathering episodes — the whole cast in
one place, the world's ordinary rules dressed up. The grammar's
four beats are an episode outline (announce = cold open, gather
= arrivals, activity = the middle, close = the held final
image), and the no-pressure law is also a tone law: a Mochiichao
festival episode is a celebration, never a countdown.

## Wiring

Clock: #19 (single producer — festivals consume, never
advance time). Calendar slots: #93 day kinds (OPEN). Places:
#11. Announcement: #90. Gathering: #93 overrides. Activities:
#56 / #78 / #97. Records: #12 flags/vars.

## Coverage — honest

- **Architecture: fully documented** (window-keyed cyclic world
  events are a long-documented pattern).
- **Contents: zero festivals instanced.** No festival name,
  season, date, place, or activity exists in canon. The
  calendar's own shape is an OPEN owner decision this spec
  depends on and explicitly does not pre-empt.

**Citation (List 20 #195, landing 2026-10-27):** seasonal world events register in owners' formats via 195-SEASONAL-WORLD-EVENTS.md — bundle shape and the windows-only fence live there. No season or event is created by that package; the calendar stays open until the owner rules it.


**Landing note — List 34 #331 (2026-10-27):** this file is a rollover subscriber to #331's calendar engine by citation (331-PERSONA-BONDS-CALENDAR.md), after #224's daily edition, the engine's first subscriber. #331's season output returns null until the owner rules a year — the seasons do not turn yet, and no year is invented here.
