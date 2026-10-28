# #299 — JOINABLE FACTIONS → belonging is a record, and it costs

**The owner's essence statement makes this owed.**
Fallout and Skyrim — named in it — are games where
the world is organised into bodies you can *join*:
guilds with ranks and questlines, sides in a war,
orders that ask loyalty and pay belonging back. Our
world already has the bodies (#270's groups hold
beliefs about you; #99's Syndicate has tiers and
teeth). What it has never had is **membership** —
the step from *they have heard of you* to *you are
one of theirs*. This spec founds it, and founds it
on the programme's terms: membership is a record,
rank is earned through the faction's own work, and
some doors close when others open — stated per
faction, as data, never as a surprise.

**What was studied.** Joinable-faction architecture
in the owner's named kin, as publicly documented:
Skyrim's guilds (join → rank ladder → a questline
that is the guild's own story, run parallel to the
world's), Fallout's faction commitments (the
late-game exclusivity where standing with one side
*ends* another's road), Persona 5's confidant
structure as the personal-scale version (a bond with
ranks, kept by showing up). The kit taken: join as
an act, rank as a ladder of the faction's own beats,
exclusivity as authored data, and the uniform
principle — belonging is *visible when worn*.

## Native spec — `mochiichao/faction/v1` (fragment beside this doc)

- **The faction record (world data).** A faction is
  a #270 group *plus*: a **joining door** (the act
  and its terms — who may join, what is asked: a
  deed, a sponsor, a standing floor, or open arms),
  a **rank ladder** (named rungs; advancement is the
  faction's own questline beats, #12-class fact
  chains owned by the faction), a **questline**
  (authored beats on the same chain architecture —
  the faction's story, which for the Syndicate is
  the thief route's spine, #278), an **`excludes[]`
  list** (faction ids whose membership cannot stand
  beside this one), and a **display** (how membership
  is shown when shown: an insignia, a uniform, a
  recognised mount or partner mark — #23 lookups, all
  content). Zero factions are instanced here beyond
  the classes the brief names; the record shape is
  the deliverable.
- **Membership (a record on the Ranger).** Joining
  writes exactly one membership record: `{factionId,
  joinedBeat (#12 fact ref — when and how is
  history), rank (derived: the highest rung whose
  beat chain is complete — never a stored number)}`.
  Leaving, expulsion, and betrayal are also records
  (a closed status vocabulary: `active / left /
  expelled / burned` — *burned* is the Syndicate's
  word made general: you did not leave, you are
  *done*, and the faction's #270 read carries it).
  History is append-only, #126's law at faction
  scale: a burned membership is never deleted, only
  succeeded by whatever the Ranger becomes next.
- **Exclusivity bites through the record, not
  through flags sprinkled in content.** Joining a
  faction whose `excludes[]` names one you hold does
  not silently coexist: the joining beat must resolve
  the conflict in the open (renounce, be refused, or
  burn the old membership — which of these is
  possible is data on the pair). #270 reads the
  outcome: the abandoned faction's tallies move on
  *witnessed* terms exactly as #270's law requires —
  a secret defection moves nothing until it is seen.
- **What the world reads.** #270 reads membership
  **only when the group knows it or the member shows
  it**: a displayed insignia is a fact any witness
  can carry (#272); an unshown membership is the
  Ranger's private truth, and #281's double life is
  built exactly on that seam. A faction's own members
  always know their own (the faction is a group with
  its own memory). Licence standing (#98/#133) is
  untouched by membership except where a faction's
  own beats write licence facts through the real
  systems — belonging is not a licence input by
  itself, stated so no landing invents one.
- **The named classes (instances are content).**
  - **The Syndicate** — canon's one named faction:
    #99's tiers (grunt / admin / boss) are its
    *encounter* face; its membership ladder is its
    own record here, and #99's law holds untouched
    (the boss leads Dojo 8; the boss's name is the
    owner's open slot, and this spec fills no Syndicate
    names, ranks-beyond-tiers, or motives — #99 left
    them OPEN and they stay OPEN).
  - **A Ranger association** — the licence's social
    body: the respectable mirror of the Syndicate,
    whose questline is service (#164's work at
    faction scale) and whose ranks parallel #133's
    tiers without being them.
  - **Dojo circles** — the league's inner rooms:
    membership by a dojo's own invitation, ranks in
    the circle's customs (#244), doors into #143's
    regional variance — belonging that colours the
    circuit without ever bending a result (#151's
    law: institutions change records and honours,
    never outcomes).
  - The class list is closed at these three plus
    *service bodies* (a #245-class corps can hold a
    faction record when the world authors one); a
    new class is a proposal into this file.

## Show lane

A faction is a wardrobe, a hangout, and a promise
the audience can watch being kept or broken. The
thief anti-hero's Syndicate membership (#278) is the
show's worked example: his arc is legible because
the audience can see the ladder he is climbing and
the one he burned to climb it.

## Wiring

Faction records are world data beside #270's groups
(a faction IS a group, plus this record). Membership
lives with the Ranger's record family (#98's home).
Beats ride #12's chain architecture; work rides
#164; standing reads #270/#271; knowledge/display
reads #272/#281; the Syndicate's encounter face
stays #99's; league colour stays inside #143/#151's
laws.

## Open slots

**Story/canon facts, entire:** every faction's name
beyond canon's Syndicate, charters, rank names,
insignia, questline contents, and each pair's
exclusivity terms — world content authored with its
factions. The Syndicate's open slots are #99's own
and stay as #99 left them. The record shapes, the
status vocabulary, the rank derivation, and the
exclusivity mechanism are filled in full.

## Coverage — honest

- System: complete — joining, rank, exclusivity,
  leaving, and the world's reads are specified
  whole.
- Contents: zero factions instanced, zero questlines
  authored. Belonging exists; nobody belongs yet.
