# #328 — RANCHER ARRIVAL → how a Mochi can be *called* into the world

**The gap this fills.** Every individual in canon
arrives one of three ways: hatched (#135's
presentation grammar), caught (#38), or received
(#217's gift/adoption). The world has no fourth
door — no fiction and no system for a Mochi who is
*called from elsewhere and arrives as itself*.
Monster Rancher's whole world runs on that door
(monsters summoned from discs, raised on a ranch),
and Region 3's flavour law (a Monster Rancher
quarter-turn: mixture bodies, every concept carrying
a job) has been a flavour layer with no system seat
since the wave-1 design charter. This spec seats
the arrival grammar natively. What crosses is the
*grammar* — a medium carries a call; a Mochi answers
it and arrives, itself, with a record that opens on
the arrival. Rancher's cast, its named monsters,
and its real-world disc catalogue do not cross
(construction-kit rule).

**What was studied.** Monster Rancher's summoning
as publicly documented: a monster is generated/
summoned from a disc (later games: disc stones),
arrives at the ranch as a new individual with its
own nature, and is raised from there; the games'
other famous grammar — a monster's *lifespan*,
ageing, death, and freezing to pause the clock — is
studied here in order to be refused (below), in
writing, with the reason.

## Native spec — `mochiichao/arrival/v1` (fragment beside this doc)

- **The arrival event.** An individual's record may
  open with an `arrival` event: `{medium (item ref,
  #31 family), seat (place ref — a rite seat, below),
  rite (the authored rite id), arrivedIndividual
  (#80 record, opened by this event)}`. From the
  moment of arrival the individual is ordinary in
  every system: #80's record, #207's discovery
  states (an arrival can be a first meeting — the
  Ranger *receives* a species they may never have
  seen, exactly as #217's gifts already allow), #28's
  care, #38's keeping rules. Arrival is a *birth
  certificate class*, not a special caste.
- **The seat.** Arrivals happen at rite seats: the
  lab machinery family is the first (Aeon's lab —
  #44's revival machinery and #46's exposition are
  the same institution's doors; #206's fossil
  revival is arrival's closest cousin: a service
  that brings an individual *into* the present
  world, at a seat, by a rite, for a fee or a
  favour). Other seats are world content, authored
  place by place (#119 interiors host them).
- **The medium.** The call rides a medium item (a
  #31 record of the call-medium class). What a
  medium can call is authored data (medium → the
  lines it may call), never a generator: the
  programme mints no individuals from a catalogue
  nobody wrote. Medium contents are content-lane
  data, zero instanced at build.
- **Presentation.** Arrival has a presentation
  grammar sibling to #135's hatch: the medium, the
  call, the answer, the individual *there* — whole,
  itself, meeting its Ranger for the first time at
  the moment it exists here. The show mirror is the
  same beat staged: an arrival in the show is a
  casting event under #82's production law, and the
  arrived Mochi is a person from its first frame
  (autonomous-action doctrine), never a special
  effect with a species attached.
- **The Region 3 seat.** In R3 the arrival is the
  region's *custom idiom* (a #244 customs record
  class): mixture-bodied lines are spoken of there
  as called, not born. That is flavour carried by a
  real system — the same arrival machinery, wearing
  the region's words. The fiction never changes the
  mechanics.

## Refusals (written here, per #327's register law)

- **The lifespan/death clock does not cross.**
  Rancher monsters age and die; Mochiichao
  individuals do not die of age — #243 fenced life
  stage as presentation (looks, idles, cry colour),
  never a death system, and no death-of-age system
  exists anywhere in canon. A pull-in that needs a
  death clock to work is refused at the clock, not
  smuggled in beside the arrival.
- **Freezing/hibernation does not cross.** Pausing
  an individual to stop its clock presupposes the
  clock. With no clock there is nothing to pause;
  #65/#106 already own rest and storage honestly.
- **The real-world media gimmick does not cross.**
  Rancher read the player's actual CDs; our media
  are in-world items. The grammar (a medium carries
  a call) survives; the hardware trick stays with
  its donor.

## Wiring (proposed)

Arrival event class proposed into #80's history
vocabulary (in #80's home, with citation); rite
seats host on #119 interiors beside #206's service;
medium class proposed into #31's item families;
presentation joins #135's family. Reads: #31, #44/
#46/#206 (seat machinery), #217 (receive rules),
#207 (discovery). Writes: one history event + one
#80 record opened by it.

## Open slots (nothing invented)

The rite's name and words in-world (canon language,
owner/content lane) · which seats exist (world
content) · medium contents — which lines any medium
may call (content-lane data) · whether any canon
character arrived this way (story fact, owner's) ·
R3's custom wording (content).
