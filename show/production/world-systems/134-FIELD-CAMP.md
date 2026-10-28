# #134 — FIELD CAMPS → field camp system (portable care away from the Garden)

**What was studied.** Camp systems in the reference
games, as publicly documented: a portable rest state the
party pitches in the field — cooking/eating together,
play, rest — whose mechanical yield is *small, warm, and
relational* (bond and condition tending) rather than
power, and whose fiction yield is the party *being* a
party between destinations. The kit taken: camp is a
**place the player makes**, with a closed verb set
(rest / cook / play), entered and left at will, that
trades travel time for care. No recipes, dialogue, or
layouts are copied.

## The three care homes, kept distinct (read first)

| Home | System | Nature |
|---|---|---|
| Mochi Garden | #28 (+ #65 loop) | home; raising over time; where individuals live |
| Care centre | #132 | civic field infrastructure; restore/cure as a service |
| **Field camp** | **#134** | improvised, portable, *the party's own* care on the road |

Camp deliberately does **less** than both: no full
restore as a service (that's the centre's civic promise),
no residence (that's the Garden). What camp has that
neither other home has is *portability + togetherness* —
it is the only care space that exists wherever the party
is, and the only one whose primary output is the bond
between the specific individuals present.

## Native spec — `mochiichao/field-camp/v1`

- **Pitching:** camp is a state entered from the field at
  a legal pitch site (legality is area data — the area
  systems' own fact, #7/#11 neighbourhood; this spec
  asserts no site list). While camped, the world clock
  (#19) governs what passes (rest advances phases by the
  clock's law, as #132's `rest` requests — camp likewise
  requests, never rules).
- **The verb set (closed):**
  - `rest` — vitality recovery *partial by design*: camp
    rest tends the party; it is not a centre's full
    restore. The fraction/shape of recovery is a balance
    fact — **OPEN**, recorded as a slot, because setting
    it here would silently price the centre's service.
  - `cook` — a meal from carried ingredients: items are
    #31 records consumed; meal *effects* resolve through
    the care layer below, never as battle buffs invented
    here. Recipes/ingredient lists are content — OPEN
    (the #79 farm is where grown ingredients come from;
    camp is where they are spent).
  - `play` — unstructured time with the party: the bond
    verb, and the camp's reason to exist.
- **Care accrual — joins #39/#28, duplicates neither.**
  Camp care writes to the same care families #39's
  training ledger and #28's profile already use (care is
  earned in Garden vocabulary, #39's rule — camp speaks
  that vocabulary on the road): a camp session appends
  care facts for *the individuals present* (party only —
  camp cannot tend the stored, #106). The accrual *rate*
  relative to Garden care is a balance slot, **OPEN**;
  the shape (facts on the individual, profile derived)
  is inherited, not re-decided.
- **No pressure mechanics (#56 law, inherited verbatim in
  spirit):** nothing at camp decays, expires, judges, or
  punishes absence. A party that never camps loses
  nothing but the accrual; a meal never spoils into a
  penalty; rest is never interrupted by authored ambush
  as a *system* (a story may do what a story does — #12
  story flags are not camp's to write).
- **Follower/party presence:** camp renders the party as
  present individuals (the #58 follower states' camp
  behaviour is a presentation question for that package —
  camp defines the *space*, not their animation set).

**Show lane:** camp is the road episode's home stage —
the staging grammar for travel episodes (fire, meal,
sleep, the quiet scene the arc needs) exactly as #132's
centres stage civic safety. Show camp writes nothing to
any game ledger; it borrows the verb set as scene
vocabulary so a camp scene in the show and a camp session
in the game are recognisably the same institution.

## Wiring

State joins: #19 (clock), #31 (ingredients/items), #39 +
#28 (care families/profile — writes are care facts on
present individuals only), #58 (presence presentation,
their package's call), #106 (the stored are excluded by
construction), #79 (ingredient source), #132 (the
boundary this spec is defined against). Save impact:
camp state is session/world state under #96's `world`
section; care facts ride the individual records.

## Coverage — honest

- **Architecture: fully documented** (camp as portable
  relational space in the recent reference era).
- **Contents: verbs and boundaries only.** Pitch-site
  legality lists, recovery shape, accrual rates, recipes,
  and ingredient lists are OPEN/balance/content slots.
  The spec's real yield is the three-homes separation —
  camp exists so the road has a care grammar that neither
  replaces the Garden nor counterfeits the centre.
