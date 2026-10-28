# #332 — PROPERTIES THAT WORK → an owned place with a job

**The gap this fills.** #303 founded the
owned-place class over #169's hideout record —
tenures (`kept | owned | granted`…), a place with a
#119 interior, and `services[]` as the place's
*authored offer*. But #303's services are offers a
place *advertises*; nothing says what a service
*does* all day. GTA's and Fallout's properties are
not brochures — a garage stores, a business earns,
a settlement works. This spec gives owned places
**functions**: service classes with real machinery
under them, a cost class that keeps them honest,
and the underworld's variant running on the same
record, because in this world the dark economy has
addresses too.

**What was studied.** Property systems in the
named kin as publicly documented (GTA's bought
businesses with missions and income; Fallout's
settlements and player homes; RDR2's rented rooms
as the small end), read against our own seats:
boarding already has a discipline (#193's daycare
custody), shops already have machinery (#123),
lure spots already work (#291), fences already deal
(#274). The pull-in contributes no new shops, no
new custody, no new spots — it contributes the
*property frame* that lets a place you own host
the machinery that already exists.

## Native spec — working services over `mochiichao/owned-place/v1` (#303)

- **Function classes (the working services; each
  is a `services[]` entry with a class, a host
  system, and an upkeep class):**
  - `boarding` — a yard that boards Mochi. Custody
    is #193's discipline, hosted at the property:
    seats are counted, the keeper of record never
    changes, #106's `location` reads the property's
    place while boarded (a proposed value-seat into
    #106's home — the location field gains the
    place ref, it does not gain a new kind).
    Boarding is a *service a place offers its
    owner's circle* (and, at a `granted` place, the
    grantor's) — who may board is the service's
    authored rule, never a world default.
  - `shopfront` — a counter running #123's shop
    machinery under the place's ownership: stock is
    authored, prices are #123/#304's, and takings
    settle into the #20 economy as the owner's
    income fact. A shopfront sells what honest
    shops sell; it can never stock what its host
    system wouldn't (a shopfront is not a fence
    with a sign — see the dark variant for the
    actual fence).
  - `lure-lease` — a #291 lure spot operated as a
    property function: the place keeps the spot fed
    (snacks are upkeep, in kind), and the spot's
    encounters stay #291's entire — leasing a spot
    buys its *keeping*, never its outcomes.
  - `fence-warehouse` — the dark twin, on the same
    record with #274's valence: a fence's working
    place — counter services per #274, storage of
    hot goods as part of the fence's distance
    business. #274's absolute law rides into this
    class verbatim: **the record never launders** —
    a warehouse stores a stolen Mochi's *distance*,
    never a cleaner history; provenance reads stolen
    here exactly as it reads stolen anywhere.
- **Upkeep — the cost class.** Every working
  service carries an upkeep class: a recurring #20
  economy charge (and/or in-kind stock, for lure
  spots) read at #331's rollover. Amounts are data.
  A lapsed upkeep **idles the function** — the
  boarding yard takes no new boarders, the counter
  shutters, the spot goes unfed — and never deletes
  the place, never touches tenure (#303), and never
  strands a boarder: custody already held is
  honoured to its term under #193 before the yard
  idles. Debt beyond idling is not a system here;
  the world has #272 for consequences and this is
  not one of them.
- **The fences of function.** A property function
  never gates story, never gates a #127 connection,
  never pays in power (income is currency; boarders
  gain care, not stats — #293's line). One Ranger's
  property is not another's menu: functions serve
  their owner's circle as authored, and the *show*
  reads a working property as a place with a life
  (#306's living-world standard — cited by
  commissioned subject, List 31 mid-build).

## Wiring (proposed)

Service classes land in #303's home as a services
annex; the `location` place-ref seat is proposed
into #106's file only; custody stays #193's,
prices stay #123/#304's, spots stay #291's, fence
law stays #274's. This package founds the frame
and the upkeep class — and nothing underneath
them. Reads: #303, #169, #119. Writes: upkeep
reads at rollover; service state on the place
record.

## Open slots (nothing invented)

Which places carry which functions (world content,
place by place) · upkeep amounts (tuning data) ·
boarding capacities per property (data) · the
income a shopfront may honestly make (economy
tuning, #20's lane) · any canon character's
property (story fact).
