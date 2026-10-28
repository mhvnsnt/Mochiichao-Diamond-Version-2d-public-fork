# #239 — NICKNAME SYSTEM → the name a keeper gives, carried everywhere the individual goes

**The gap this fills.** Every individual has a species
name, and the species name is data (#23 lookups, the
dex, the sheets). But the name a Ranger actually calls
their partner — that lives nowhere yet. A nickname is
the smallest bond fact there is: it exists because one
person chose it for one creature. This spec gives it a
home on the individual's own record and follows it
everywhere the individual appears.

**How Pokémon fills the same gap:** a creature can be
named when it is caught, and the name can be changed
later at a name rater — a person in a town whose whole
service is names. A wild creature has no nickname. The
species name never goes away; the nickname rides in
front of it. Mochiichao takes this shape whole, with
one softening the reference games only learned late:
the nickname belongs to the individual's record, so it
travels with the individual through every transfer —
a traded or adopted Mochi keeps the name its life has
given it until its new keeper chooses otherwise (the
name is the individual's, stamped on #80's history
like everything else in its life; it is not wiped by a
change of keeper, #168/#217).

## Native spec — `mochiichao/nickname/v1` (fragment beside this doc)

- **The field.** One field on the individual record
  (#80): `nickname` — a display string, null until a
  keeper sets it. It is the only name fact the
  individual record owns; the species name is never
  copied onto the record (it resolves from the species,
  #23, every time).
- **Who may set it, and when.**
  - **At the keep:** when an encounter becomes a keep
    (#38), the keeper is offered the naming moment —
    Pokémon's shape exactly. Declining leaves it null;
    a null nickname is not a lesser state, it is just
    the species name, used plainly.
  - **At a name service:** a keeper may set or change
    the nickname later at a **name service** — a
    service point in the care-centre family of places
    (#132's family), run the way #162's grooming
    service is run: the service performs exactly one
    defined write — this field — and nothing else. No
    care axis, no fee schedule asserted here (fees, if
    any, are #20-economy data, as prices always are).
  - **A wild individual is never nicknamed.** The field
    can only be written by a keeper, for an individual
    in their keeping (#106 location discipline — the
    individual must be the keeper's to name). A wild
    Mochi the show follows may be *called* something by
    the audience; the record stays null until someone
    keeps it. (The Garden's residents are kept
    individuals; the rule is about keeping, not place.)
- **Where the nickname shows.** Everywhere the
  individual appears, the nickname leads and the
  species name is **one step away, always**:
  - **Battle:** the nameplate shows the nickname; the
    species is one glance away in the battle UI's own
    way (#10's presentation — the move list already
    reads species-side facts, and the Mochiioteca
    identify grammar below covers the formal check).
  - **Garden and field:** follower labels, care screens
    (#28/#65), field-partner reads (#160) — nickname
    first.
  - **Records:** honours (#104), storage views (#106),
    the save's party views — nickname shown, species
    named alongside in the record's own layout.
  - **The Mochiioteca:** the dex entry is the
    *species'* page — it shows the species name and the
    discovery state (#14), and where it names *your*
    individual of that species, it shows the nickname
    next to it. The dex never renames a species after
    one individual's nickname (the Leak rule's cousin:
    personal names are not world facts).
- **The show lane.** A nickname is how the show signals
  a bond without a word of creature dialogue: humans
  use nicknames; the creature answers to its cry and
  its behaviour, never by saying the name back (the
  cries-only law holds in full). A partner called by a
  nickname across a season is a relationship the
  audience can hear growing — and a wild Mochi with no
  nickname is, by the same signal, nobody's yet.

## Wiring

Writes: exactly one field on #80 (`nickname`), written
at the keep (#38's moment) or at a name service
(#132-family seat, #162's write discipline). Reads:
every presentation of an individual — #10, #28/#65,
#58/#160, #104, #106, #14. Transfers (#168/#217) move
the record whole; the nickname travels inside it.

## Open slots

None mechanical. The name service's seat in a given
town is content (which towns host one is world data,
the #119/#132 place layer), and any length/character
rules for the string itself are text-engine data
(#23's layer), not a system decision parked here.

## Coverage — honest

- Set-at-keep + change-at-a-service + species-always-
  reachable: the documented Pokémon shape, filled in
  whole; the travels-with-the-individual rule is the
  canon-side completion (#80's history discipline).
- Contents: no nickname is instanced; no individual is
  named by this package.
