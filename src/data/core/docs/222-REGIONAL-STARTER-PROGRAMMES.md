# #222 — REGIONAL STARTER PROGRAMMES → how a Ranger begins, per region

**Seat in the doctrine:** #98 founded the licence —
issued at a beat, identity only, tier table OPEN —
and left the obvious companion question standing:
where does a new Ranger's **first partner** come
from, and does the answer differ by region? This
spec founds the programme layer: the institution
that pairs a new licence with a first Mochi. One
region's programme is canon and can be specified
from it. The others are slots, and this package has
the discipline to leave them slots.

**What was studied.** Starter-distribution
institutions in the publicly documented record: the
laboratory presentation (a senior figure, a choice
among offered partners, a ceremony of beginning);
the field variant (partnership formed under
circumstance rather than ceremony); the licence-and-
partner bundling (the credential and the companion
arrive as one beginning, not two errands). The kit
taken: the programme as a *record of practice* (who
officiates, what is offered, under what beat the
first transfer stamps), and the programme gift as
the founding instance of #217's gift class.

## Native spec — `mochiichao/starter-programme/v1` (fragment beside this doc)

- **The programme record.** One record per region:

  ```
  { regionId, officiant: <role ref | null>,
    offeredLines: [<species refs> | null],
    firstPartnerBeat: <class of beat>,
    licenceJoin: "with_licence" | "exception" }
  ```

  Every field is a statement about that region's
  practice. A region whose fields are null has **no
  founded programme in this package** — which is a
  fact about the package, not about the region.
- **Region 1 — canon-seeded, specified as practised.**
  Per the season canon map, Region 1's beginning is:
  **Aeon officiates**; the new Ranger's partner comes
  out of the **harbour rescue** — Aeon is cornered by
  a wild creature, and the partner is chosen from the
  **five starter lines — Mochii, Razorgater, Tyrage,
  Kittember, Sproutle** — in the rescue's own moment,
  not from a presented tray; Aeon gives the partner
  **and the Mochiioteca together**; Hex, the
  neighbour and rival (and Region 1 Champion), is the
  social frame the beginning happens inside. The
  programme record therefore reads: officiant Aeon;
  offered lines = the five above; first-partner beat
  class = *rescue*; licence join = with the beginning
  (the Mochiioteca handover is the licence's material
  twin — #98's `issuedBeat` and the programme's beat
  are the same beat, read by both systems). The older
  Garden choosing ceremony is preserved as flashback/
  prologue material by owner ruling (2026-10-27) and
  is **not** Region 1's practised programme — the
  record cites the rescue, and the ceremony's place
  is the flashback lane's, exactly as ruled.
- **The founding transfer.** A programme partner
  stamps as a **gift** (#217's programme-gift class):
  `{met_via: gift, from: <programme>, to: <new Ranger>,
  beat}` — the first entry in a keeper history that
  will hold every later fact of that partnership. The
  individual's record begins there; nothing precedes
  it on the record except the species' own facts.
- **Regions 2–5 — OPEN, entire.** Officiant, offered
  lines, beat class, ceremony or circumstance: none
  of it is asserted, patterned after Region 1, or
  extrapolated. A programme is regional culture; the
  connected-world doctrine (#127/#137) says regions
  are reached and learned, and their beginnings are
  learned the same way — when canon supplies them.
  The record shape waits, fields null.
- **The exception clause.** The record's
  `licenceJoin` admits the exception as a first-class
  value: a Ranger whose first partner did **not**
  come through a programme (a gift from a mentor,
  #221; an adoption, #220; a wild partnership the
  story authored) is not a data error — the exception
  *is* the story, and the programme record's job is
  to make the normal path legible enough that the
  exception reads as one.

## Show lane

The programme is the show's front door: Region 1's
harbour rescue **is** the season's opening movement
(the canon map's beats — truck arrival at Boot
Harbor, the rescue, the handover, Route Topaz). The
grammar here adds nothing to that staging; it founds
the record the staging already produces, so game and
show beginnings stamp identically.

## Open slots (nothing invented)

Regions 2–5 programmes, entire (officiants, lines,
beat classes, ceremonies) · whether a programme may
be re-entered (a second first partner — refused by
the word "first," stated so landing doesn't invent a
repeat path) · programme capacity/waiting (content) ·
the licence's physical form, if any (#98's design
slot, inherited).

## Coverage — honest

- **Region 1: canon-complete** — officiant, five
  lines, beat class, and join all from the season
  canon map; the superseded ceremony explicitly
  placed in its ruled lane, not the programme's.
- **Regions 2–5: honestly empty.** The yield is one
  founded beginning and a record shape that refuses
  to invent four more.
