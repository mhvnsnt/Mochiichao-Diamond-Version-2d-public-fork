# #303 — OWNED PLACES → a place of your own is a record in the world, not a menu

**The pieces this gathers.** The world already has
three ways to stop somewhere: the camp you pitch and
fold (#134), the hideout you keep (#169 — tenure,
decoration, visiting, and the flat law that a hideout
is never a care location), and the centres you use
but never own (#132). What the owner's essence
statement adds — GTA and Red Dead in the blood — is
the *safehouse at world scale*: places that are
yours, scattered across a big map, that the map's
systems all agree are yours. This spec founds the
**owned-place class** over #169's record: #169's
personal hideout becomes the class's first member,
not a replaced system, and every owned place is a
record with a location and a state — never a menu
abstraction, never a fast-travel list with a bed
icon.

**What was studied.** Owned-place systems in the
named kin, as publicly documented: GTA's safehouses
(rest, save-point gravity, a garage's storage logic,
bought and *placed* across the map — the property
ladder as progression), Red Dead's camps and rooms
(the rented room and the gang camp as two tenures of
the same verb: stop somewhere the world lets you
breathe), Fallout's settlements at the far end of the
scale (flagged here as beyond this spec — a place
that is a town is world content, not a tenure).
The kit taken: tenure as the record's spine, services
as the place's authored offer, and the dark twin —
every open world with safehouses has the place that
serves the other economy.

## Native spec — `mochiichao/owned-place/v1` (fragment beside this doc)

- **The place record.** `{placeId, keeper (Ranger
  ref), interiorRef (a #119 interior — its hostNode
  is the place's one address in the world, on #297's
  terrain), tenure (below), established (#12 fact
  ref), services[] (below), state}`. The record
  extends #169's hideout record rather than forking
  it: #169's `placements[]` (decoration) and
  `visiting` carry over unchanged for every member of
  the class, and #169 keeps owning tenure/decoration/
  visiting *for the personal hideout*; this spec owns
  the class, its tenures, and its services. A place
  with no #119 interior beneath it does not exist in
  this system — an owned place is somewhere you can
  stand, or it is a rumour, and rumours are #145's.
- **Tenures (closed vocabulary):**
  - `kept` — #169's hideout tenure: found, secret-ish,
    yours by keeping. The class's seed member.
  - `owned` — bought or built and held in the open:
    the GTA property shape; the purchase is a #20
    transaction through the real economy, and the
    place can be *known* — fame's address as well as
    shelter.
  - `granted` — given by a body that can give: a
    faction's bunkhouse right (#299), a town's thanks
    (#300's echoes can pay in exactly this coin), a
    league lodging. A grant carries its grantor — and
    a grant can be **revoked by the grantor through
    the real systems** (a burned faction membership,
    #299, takes its bunkhouse with it: the place
    record's state flips, the Ranger's things route
    to #106 storage — nobody is made homeless in
    their *records*, only in their geography).
  - `dark` — the fence-adjacent variant: a place
    whose keeper is the underworld (#274's world),
    held by bad-side standing — available while the
    underworld's read of you holds (#270's swapped
    tallies / #269's bands as its own gate data), and
    the first thing a redemption makes awkward: #275's
    road and a dark tenure pull against each other
    *in the record*, which is the point.
- **Services — what a place does, as authored data:**
  - `rest` — time passes and the #19 rest effect
    applies, the same primitive #132's centres use.
    Deliberately **not** Garden care: #169's law
    (an owned place is never a care location) binds
    the whole class — a place can shelter the night;
    it cannot write a care axis, a bond, or an honour.
  - `storage` — a #106 access point: the roster's
    storage semantics reach this address. What a
    place's storage *holds* is #106's location field,
    not a second inventory.
  - `anchor` — a fast-travel anchor: the place's
    node joins #125's derived travel set by tenure,
    not by arrival evidence (you do not discover your
    own doorstep — the derivation gains a tenure
    clause, proposed into #125's file at landing).
  - `contact` — the dark service: from this place,
    #274's fence network is reachable. A place either
    carries it in its services or it does not; no
    honest place discovers it has it.
  - `stable-yard` — the place keeps what travel
    needs (mounts' rest is #123's vocabulary; the
    yard is its address). Listed so traversal has a
    home; its contents are data.
- **State is small and honest.** `state ∈ {held,
  revoked, lost, burned}`: held is the living state;
  revoked is a grantor's act; lost is the world's
  (a place can be taken by story facts — its record
  says which); burned is the dark tenure's special
  ending (the law or a rival found it — a #302
  consequence landing in geography). State changes
  are #12 facts with authors; a place never quietly
  stops being yours.

## Show lane

An owned place is the show's home-base grammar: the
room the cast returns to, decorated with the seasons
(#169's placements are production design the audience
learns to read). The dark variant is the anti-hero's
mirror of the same shot — same grammar, colder light.

## Wiring

Extends #169 (its record, its decoration/visiting,
its never-care law). Stands on #119 (interiors) and
#297 (addresses in the terrain). Services read #19/
#132 (rest), #106 (storage), #125 (anchors — tenure
clause proposed into #125), #274 (contact —
commissioned subject, see STAGING), #123 (yard).
Tenure changes write through #12; grants and
revocations ride #299/#300; purchases ride #20/#304.

## Open slots

Which places exist, their prices, their grantors,
and every dark place's keeper are world content.
**Story/canon facts:** any named property, any
faction's bunkhouse, any town's gift of a roof.
The class, tenures, services, and states are filled
in full; zero places are instanced.

## Coverage — honest

- System: complete. Contents: none instanced — the
  world has the *idea* of owning a place, fully
  specified, and no deeds yet.


**ANNEX — List 34 #332 (recorded at its landing, 2026-10-27):** #332's service classes land in this file's home as a services annex (332-WORKING-PROPERTIES.md): a working property's services read this file's owned-place record; upkeep reads at #331's rollover; service state lives on the place record. Custody stays #193's, prices stay #123/#304's, spots stay #291's, fence law stays #274's. #332 founds the frame and the upkeep class — and nothing underneath them; which places carry which functions is world content, place by place. (This annex was owed from List 34's staging and could only land once this file existed — List 31, PR #457.)
