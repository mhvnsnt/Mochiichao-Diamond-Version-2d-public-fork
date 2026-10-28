# #319 — INDIVIDUAL RECOGNITION & FAME → when the world knows *which one* it is looking at

**The gap this fills.** #207 built discovery as a
species-level, per-Ranger derivation (unseen / seen
/ kept). But canon now holds individuals the world
can tell apart on sight — above all the maskless
Verdilance, the only one of his kind anyone has seen
without the shield. Species-level states cannot say
"that's *him*." This spec builds the individual
level: recognition (a Ranger or NPC who has met an
individual knows them again) and fame (the world
knows of an individual it has never met).

**What was studied.** Recognition in the documented
record runs on two different fuels: personal history
(you have met this one — the roaming-legend pattern,
where a specific individual is tracked as itself,
#114) and public story (print and broadcast make a
face known before it arrives — the chronicle's whole
function, #224). The kit taken: keep the two fuels
separate, because they fail differently — history
can't be faked by a stranger, and fame can be wrong
in ways history never is (#224's belief/record
split).

## Native spec — `mochiichao/recognition/v1` (fragment beside this doc)

- **Recognition (the personal read).** An individual
  is *recognised* by a Ranger when that Ranger's own
  history contains a meeting with that individual —
  derived at read time from the encounter/keep
  history the records already carry (#80's record,
  #267's return history, #114's meeting persistence).
  Nothing new is stored: recognition is a read over
  history, in #207's derivation idiom. When it fires,
  the encounter presents **the individual, not the
  species**: the summary and the encounter frame read
  the individual's own record — nickname where one
  exists (#239), variation and any #318 deviation
  rendered (#325), history beats available ("you
  released this one"; "this one was stolen from
  you" — #267/#273 facts, shown because they are
  *this Ranger's* history with *this* individual).
- **The deviation is the recognition key.** What
  makes an individual recognisable at a distance —
  across a field, across a region — is the visible
  distinction: a registered deviation first (#318),
  a generated distinction second (#322). The spec
  states the consequence plainly: **the maskless
  Verdilance is identifiable anywhere** — any NPC or
  Ranger who has heard the description (fame, below)
  or seen him once (recognition) knows him on sight.
  A species-standard Verdilance is known as *a*
  Verdilance; he is known as *the* Verdilance. That
  asymmetry is a story fact the systems must be able
  to express, and now can.
- **Fame (the public read).** Fame is **not a stat
  on the individual**. It is a fact in the world's
  public layer: the chronicle has printed him (#224
  sighting/deeds classes), NPCs carry the description
  in their world data (#93's layer — who is talked
  about in this town is town data), and broadcasts
  have aired him (#172). An individual the chronicle
  has never touched has no fame however distinctive
  he is; an individual the chronicle got *wrong* is
  famous under the wrong description until a
  correction prints (#224's corrections discipline —
  the belief/record split applied to a face).
- **Who reads what.** NPC recognition in dialogue
  and staging reads the same two fuels (#93 beats:
  a shopkeep who has met you greets the individual;
  a stranger in a fame-touched town greets the
  *story*). Wild individuals do not read fame —
  fame is a human-world layer, and a wild Mochi's
  recognition of a Ranger is #152 behaviour, not
  this system.

## Show lane

**Reputation arrives before the character does**
(#276's staging law, at individual scale): a
standout's entrance is preceded by the room knowing
— a description repeated in a prior scene, a
chronicle panel, a stranger's double-take. The
maskless Verdilance never has an anonymous entrance
after his first: that is the show form of this spec,
and #326's casting pipeline assumes it.

## Wiring

Read-only derivation over #80 records + history;
fame reads #224's printed record and #93's town
data; presentation joins #207 (its states stay
species-level — recognition is a third read beside
them, not a fourth state), #239, #325. Writes:
nothing.

## Open slots

Story/canon facts only: which individuals the
chronicle has actually written about is content
(the paper's pages are authored, #224); the maskless
Verdilance's fame in any given region is a story
fact for the lane that places him there.

## Coverage — honest

- Architecture: the two-fuel split, the derivation
  discipline, the fame-is-not-a-stat law — complete.
- Contents: zero fame facts instanced; the one
  recognition consequence the owner has already
  ruled into story (the maskless one's
  identifiability) is stated as the worked case.
