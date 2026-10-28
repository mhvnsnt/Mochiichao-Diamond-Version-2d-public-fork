# #334 — THE HOME CAMP → the Garden keeps a camp's heart

**The gap this fills.** The Garden (#28) is canon
core — Mochiko opens it, residents live there, care
runs there (#65's loop, #262's sun spots, #264's
planting spots, #293's raising depth). What it has
never had is a *camp state*: the sense, which RDR2's
gang camp carries in every scene, that home is a
place with needs, a mood, and people whose lives go
on in it — a place that can be thriving or neglected
and *shows* which. #306's living-overworld standard
(cited by commissioned subject — List 31 mid-build)
asks every place to be alive; this spec gives home
its aliveness in the camp grammar, on machinery the
Garden already owns.

**What was studied.** RDR2's camp as publicly
documented: a home with supplies that deplete and
are donated back, chores that need doing, a
donation box as the camp's small economy, members
who wander, talk, and carry the story's weather in
their faces — and the design law under all of it:
the camp's state is *read off the place*, never a
menu. The kit taken is that law plus the small
economy; the gang, its members, and its story do
not cross.

## Native spec — `mochiichao/home-camp/v1` (fragment beside this doc)

- **The camp is a state of the Garden, not a new
  place.** The camp record annexes #28's Garden
  seat: `{campSeat (Garden ref), supplies (a read,
  below), residents (a read), mood (a read), chores
  (task instances, #164's family at home scale)}`.
  No second home is founded; a Ranger's camp is
  where their Garden is. (#303/#332 properties can
  host *a* campfire; the home camp is the Garden's,
  singular, canon's seat.)
- **Supplies — the small economy.** A read over
  what has been stocked: donations are #20-economy
  and #31-item facts (the Ranger and residents put
  in; care and camp life draw down at #331's
  rollover). Donating is an ordinary acquisition
  spent at home, recorded like any other — the
  camp box is a place donations *go*, not a second
  currency. What counts as supplies is authored
  data (food families, care goods); the read is
  plentiful / adequate / thin, in words.
- **Residents and their lives.** Residents are the
  Garden's kept individuals (#106 `location:
  garden`) plus the authored humans whose home it
  is (#93 seats them — Mochiko first, by canon).
  Their in-camp life is #152's behaviour + #237's
  quirks playing at home, and their needs are #28's
  care drives wearing camp clothes: a camp is
  thriving exactly when the care is.
- **Camp mood — a derived read, like #202's.**
  Worked out from care coverage, supplies, recent
  arrivals and departures (#217/#328/#267 facts at
  the home seat), and honours earned by residents
  (#104). Mood changes *staging*, in both lanes:
  the game's home scenes (which idles play, who is
  out and about, #215's ambient bed register) and
  the show's (a home episode in a thriving Garden
  is lit and paced differently from one in a thin
  season). Mood never reads battle math, never
  writes a stat, and never punishes: a neglected
  camp is a *picture*, and the road back is the
  care itself — nobody dies of a sad camp, nobody
  leaves over one (leaving is #333's companion law,
  a different and graver door).
- **Chores.** Small tasks at home in #164's
  vocabulary (the board's family, home seat):
  feeding rounds, spot-tending (#264), lure runs
  (#291's seats), supply runs to town. Chores are
  how the camp's needs become the player's hands
  for five minutes; contents are authored data,
  rewards are the camp itself improving.
- **The dark mirror.** A Syndicate camp runs on
  this same record (#99's organisation, #169's
  hideouts as its seats): supplies read the same,
  mood reads fear and loyalty where ours reads
  care — *same machinery, authored contents
  swapped*, so the show can stage the two homes
  against each other and the audience feels the
  difference in the grammar itself.

## Wiring (proposed)

Camp annex lands in #28's home beside #65; chores
instance under #164's kinds; rollover reads ride
#331's engine. Reads: #28/#65 care, #106 locations,
#93 residents, #20/#31 donation facts, #217/#328/
#267 home-seat events, #104. Writes: chore
instances; the camp state itself is reads all the
way down.

## Open slots (nothing invented)

What counts as supplies (authored data) · chore
contents (authored data) · mood band names (#23
text) · who besides Mochiko lives at the Garden
(canon casting) · the Syndicate camp's seat and
people (story content, #99's lane).
