# #286 — PART TRANSITIONS → how one lead's story hands the world to the next

**The closing piece of the rotation doctrine.** #277
says parts exist; #282 says the camera moves inside
one; this spec says **how a part ends and the next
begins** — in the show's grammar and the game's —
without a reset anywhere in either. The model is the
owner's: JoJo does not reboot between parts; the
world carries its history forward and a new lead
stands up inside it. Mochiichao's machinery already
believes this at every scale below the part (#127
between regions, #126 within a run's history); #286
is the same belief at the top scale, written down so
a handover is a procedure, not a vibe.

## Native spec — `mochiichao/part-transition/v1` (fragment beside this doc)

- **The handover record** (one per part boundary, in
  canon docs beside the part records):
  - `fromPart` / `toPart` — the two #277 part ids.
  - `closingWorldFacts` — **the old part's last story
    beat, written as world facts**: the #12-class
    facts the finale leaves true (who stands where,
    what was won, lost, stolen, returned; List 28
    end-state for every lead the part priced — the
    ladder positions the world will go on believing,
    #270). Not a summary, not a "previously on": a
    fact list, each item citable to the beat that
    wrote it.
  - `openingPosition` — the new part opens **inside**
    those facts: its entryWorldState (#277) quotes
    this list, whole. The new lead's first episode is
    staged in a world where the old part happened —
    its places may be new, its people may be new, its
    *past* is not negotiable.
  - `carriedThreads` — what deliberately crosses as
    live story (a returning character's cue, #283; an
    unresolved debt; a traveller mid-circuit, #145) —
    named threads only, each with its owning system.
    Anything not named here is not dropped; it is
    *history* — true, citable, and quiet until a later
    part's writing picks it up from the record.
- **The append-only law, at generation scale.** #126's
  law for a run's records — never edited, never
  deleted — is hereby the law for parts: **nothing
  from a previous part is deleted, retconned, or
  softened at a boundary.** A later part may reveal
  that a fact was misunderstood (a reveal is a new
  fact, written after, in order — #284's record-order
  discipline at world scale); it may not reach back
  and make the old part not have happened. The Dark
  Forest's law is the extreme case and binds parts
  hardest: no part transition, however hot its tone
  (#285), answers what stopped moving.
- **The show's closing/opening grammar.** A part's
  final episode ends on its closing beat as a **world
  beat, not a farewell performance**: the last shot's
  content is the world in its new state (the #82 exit
  beat, at part scale — the road onward, the town
  after, the harbour with one more name in its
  books). The next part's first episode opens inside
  the handover facts with its own lead — the
  audience's continuity is carried by place, record,
  and returning faces (#283), never by a recap that
  pretends the seam isn't there. The seam is the
  form; JoJo's readers cross it because the world
  holds, and the world holds because of this record.

## Game mirror

A new part's campaign opens through #240's New Ranger
flow, and **the postcard shows a world with history**:
#240's derivations already draw the save's facts; at
part scale the campaign's opening reads the canon
handover facts as its world's standing state (regions
with their histories, a Hall with names in it, #126;
a champion who is somebody, #283). In a continuing
save (#146), nothing at all happens at the "boundary"
— the doctrine's proof at this scale is the same as
at region scale: **zero stored change**; a part
boundary in the game is authored content arriving in
one continuous world, never a cycle tick (#122 stays
closed, at every scale, forever).

## Wiring

Reads: #277 (part records), #126 (append-only law +
the Hall as the model record), #12 (fact discipline),
#82 (exit-beat grammar), #240/#146 (the game's opening
and its one payload), List 28 #270 (end-state standing
as handover fact — mid-build, cited by subject).
Writes: handover records, in canon docs only.

## Open slots

Every boundary's facts and threads — they do not
exist until a part ends, and writing them early would
be inventing endings. **Whether the Gen 1 part's
closing beat is already latent in the locked season
canon is the owner's to say when Gen 1 closes** — it
is flagged here, once, so nobody back-fills a handover
for it from this package. Mechanics: none open.

## Coverage — honest

- Architecture: complete — one record shape, one law
  restated at scale, both lanes' grammars specified
  over verified machinery (#82/#126/#240/#146).
- Contents: zero handovers instanced; Gen 1 has not
  ended, and this package does not end it.
