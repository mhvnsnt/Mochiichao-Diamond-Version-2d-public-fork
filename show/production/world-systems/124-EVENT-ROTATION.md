# #124 — DAILY / WEEKLY EVENTS → daily/weekly event rotation

**What was studied.** Recurring-event systems in the
publicly documented record: daily fixtures (a visitor who
comes every day, a drawing, a tide), weekday fixtures (a
specific character on a specific weekday, a weekly
contest), and the architectural constant beneath them —
a rotation is a **deterministic function over the
calendar**: given the date/phase, the active set is
computed, not stored, and missing a fixture costs nothing
but the wait for its next turn. The kit taken: rotation
as a read-time function over the world clock, with
participation recorded as facts and availability never
recorded at all. No event contents, schedules, or
characters are copied.

## Canon anchors (verified)

- **#19 TIME-WEATHER-STATES is the single time authority:**
  one producer of `phase` (`dawn | day | dusk | night`) and
  weather; "every consumer keys off the phase id, never the
  raw clock." Rotation is a consumer — it produces no time
  of its own.
- **The calendar above the clock is unruled.** #93
  registered day kinds OPEN; #105's festival calendar
  recorded "the calendar itself (day kinds, seasons)" as
  its first open slot. Rotation therefore ships against an
  **OPEN day-kind vocabulary**: the mechanism is complete,
  the axis it rotates on awaits the owner's calendar.
- **#96's `world` section already has the landing slot:**
  its payload table lists "schedule overrides in force" as
  world state — rotation is the system that writes them.
- **#56's law binds:** tokens never buy power, and the
  raising-game discipline is no pressure mechanics.
  Rotation inherits it as event law below.

## Native spec — `mochiichao/rotation/v1`

- **A rotation entry** is a record:
  `{rotationId, cadence: daily | weekly, dayKinds: [<OPEN
  vocabulary>], phases: [<#19 phase ids>], effect: <typed
  reference>}`. Effects are references, closed by kind:
  - `npc_visit` — a #93 schedule override (the visitor's
    timetable row, in force while the entry is active);
  - `fixture` — a hosted activity's availability (a #56
    minigame table, a #78 showcase sitting, a #105
    festival's recurring minor form) — the host system
    owns the activity; rotation owns only *when*;
  - `world_note` — an announcement with no mechanics
    (#90's generators render it).
- **Resolution is derived at read time:** the active set =
  entries whose cadence/dayKind/phase match the clock's
  current outputs. Nothing about *availability* is stored.
  What *is* stored, when the player participates, is the
  participation fact — a `vars.*` entry under #12, in the
  run's facts — from which "already done today" is itself
  derived (participation + current phase window), never a
  separate "claimed" flag that could desync.
- **Overrides are the only write:** when a rotation entry
  activates an NPC visit, it writes a schedule override
  into #96's `world` section in #93's override shape; when
  the window passes, the override lapses by derivation
  (its window no longer matches), not by a cleanup write.
- **No-pressure law (inherited, stated as this system's
  own):** a missed fixture recurs; no entry may carry an
  expiry penalty, a streak that breaks, or a reward that
  degrades for waiting. An entry whose design needs the
  player to *hurry* is defective under #56/#105's law and
  is rejected at authoring review, not balanced.
- **Announcement:** active and upcoming fixtures are
  rendered by #90's Iridescence-media generators from the
  same derived set — the media can never announce a
  fixture the derivation wouldn't activate (one function,
  two readers).

## Wiring

Consumes #19 (phase; day-kind when ruled), writes #96
`world` overrides in #93's shapes, announces via #90,
hosts via #56/#78/#105, records via #12 `vars.*`. Save
impact: the override slot #96 already names — no new
section.

## Coverage — honest

- **Architecture: fully documented**; deterministic
  rotation over a calendar is the standard pattern.
- **Contents: the calendar (day kinds, week shape,
  seasons) and every fixture instance are OPEN** — the
  same inherited gap #93 and #105 registered, stated here
  a third time because this system cannot instance a
  single event until it closes. The mechanism is the
  yield; it is complete without the calendar, and useless
  with an invented one.
