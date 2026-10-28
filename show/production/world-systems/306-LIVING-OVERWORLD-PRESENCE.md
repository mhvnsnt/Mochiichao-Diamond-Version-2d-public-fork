# #306 — LIVING OVERWORLD PRESENCE → the world is visibly alive before you touch it

**The last layer, and the one the others stand in.**
#297 made the land continuous; #298 made things
*happen* on it; this spec makes it *occupied*: in
the Pokémon base, the wild lives in grass and dice —
you cannot see a creature until the encounter screen
says so. Buu's Fury and Persona — the owner's named
kin — do the opposite: the enemy is *there*, on the
field, walking its patrol, and the encounter is
something you walk into with your eyes open. The
essence statement's "living world" claim stands or
falls on this: **wild Mochi visibly roam and act in
the world, towns are social spaces you can walk
into, and nobody important is standing in a void
waiting for a cutscene.**

**Verified parents (and a note on the brief's
numbers).** The presence machinery already exists in
pieces: #7's spawn tables stock the areas by habitat
class, #152's behaviour profiles project each species
into a wild view (what it does when nobody is
fighting it), #231 derives wild-vs-wild texture from
exactly those two, #209 built ambush grammar, and
#67 keys behaviour to weather. The brief cited
"#66/#213" as this item's parents; on disk, #66 is
postgame structure and #213 is the Fragment case —
the presence parents are the five above, and STAGING
registers the reconciliation instead of inventing a
citation.

## Native spec — `mochiichao/presence/v1` (fragment beside this doc)

- **The presence read.** What visibly roams an area
  is *derived at read time* from the area's #7 stock
  filtered through each species' #152 wild view and
  the live world state (#19's phase, #61/#67's
  weather behaviour, #142's climate identity): the
  same derivation family as #231, at individual
  scale. A roamer is a *presence*, not an individual
  record — it carries species, behaviour state, and
  position-in-the-moment, and it becomes a #80
  individual only when a real system takes hold of
  it (an encounter's roll, a capture) — the
  programme's rule that generation happens at the
  moment of contact, never wholesale in the fields.
  Presence density and behaviour are presentation
  reads over stock; **the encounter math is
  unmoved**: meeting a roamer routes into the
  standing encounter machinery (#7's tables, #52's
  bands, #110's modes, #209's ambush where its
  grammar fits) — visibility changes how a meeting
  *begins*, never what a meeting *is*.
- **Behaviour is the species', lived in the open.**
  Roamers run #152's wild vocabulary: graze, drink,
  patrol a territory (#231's events are these same
  behaviours at narrative zoom), startle, flee,
  threaten, ignore. Weather and phase bend them
  (#67): a storm empties a meadow the same hour a
  cave mouth crowds. A roamer that flees a Ranger
  who outmatches it is presentation reading #52's
  bands honestly — the world's danger honesty (#297)
  works both directions: you can also *see* the
  thing that will kill you, standing in the road,
  being magnificent, before you decide.
- **Towns are walk-in social spaces — the interiors
  standard.** #119 built interiors as room graphs
  hanging off the world's nodes, and instanced zero.
  This spec sets the production standard the content
  pass is held to: **a building that reads as
  enterable from the street is enterable** — its
  door is a #119 host, its inside holds the people
  #93's schedules put there at that hour, and its
  closed hours are a gate with an in-world reason
  under #297's contract (the smithy is shut because
  night, shown on the door, not an invisible wall at
  the threshold). Exceptions are authored singly
  (a ruin's sealed wing is #154's content, a private
  house with no business for you is a door somebody
  answers — #301's smallest conversation — not a
  painted wall). The standard is a promise made to
  the player by the art itself; breaking it is a
  defect the content pass must not ship.
- **People live visibly.** #93's schedules already
  move NPCs between places on the clock; presence is
  that machinery *seen*: the market fills and empties,
  the dojo's yard drills at its hour, travellers are
  met on roads because #145 puts them on roads. No
  new schedule system is founded — this spec is the
  rendering obligation laid over #93/#145 as they
  stand, plus the crowd floor #242 built for watched
  rooms, extended to watched streets.
- **The depths clause, carried whole.** The Dark
  Forest's surface presence derives from its (thin,
  canon) surface stock like anywhere. **The depths
  have no presence read.** Their spawn table is
  prose-only and empty by canon; #231 derives no
  events there; #203 records no dens there. Under
  this spec the same law wears its presentation
  face: in the depths, nothing visibly roams —
  no silhouettes, no eyes, no distant cries staged
  for comfort (#215's near-silence is the bed). The
  absence *is* the presence design, and any landing
  that populates the depths' field of view — however
  kindly meant — breaks canon in the programme's
  most protected place. What stopped moving there is
  not this spec's to stage.

## Show lane

The show mirror is why this spec exists in both
lanes: **the world's aliveness is the show's default
background.** An episode's street is crowded because
the world's streets are; the cast crosses a meadow
of visible wild Mochi because the meadow has them;
#215's beds and #152's show-background view are the
same derivation the game renders, drawn instead of
computed. Both lanes explore the same universe —
the show's camera and the game's Ranger stand in
one world, and this spec is the standing order that
neither may find it empty.

## Wiring

Derived from #7 + #152 + #19/#61/#67/#142 (the
presence read); meetings route to #7/#52/#110/#209
(unchanged math); towns stand on #119 + #297's gate
contract + #93/#145 (presence of people) + #242
(crowd floor); depths law inherited from #7/#203/
#215/#231. Proposes nothing into any other file:
the obligations land as this spec + the content
pass's standard.

## Open slots

Area stock contents (#7's data debt — the Forest
surface table stands authored-thin and the content
pass owns its growth), per-species wild-view
contents (#152's sheet annexes), and every town's
interior authoring are content. **No canon fact is
invented here** and none is needed: the presence
read, the interiors standard, and the depths clause
are filled in full.

## Coverage — honest

- System: complete. Contents: presence *derives*
  from stock that is itself seed-stage (13/49
  species habitat-seeded per the standing audits) —
  the read is honest about thin country exactly as
  #231 was: where the table is thin, the field is
  quiet, and that is a content debt shown, not a
  system gap hidden.
