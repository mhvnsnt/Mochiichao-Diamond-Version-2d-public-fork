# #274 — THE UNDERWORLD → fences, black markets, and what distance costs

**The gap this fills.** A world with stealing
(#268) and a law (#272) needs the third corner:
where stolen things *go*. RDR2's fences are the
documented shape — discreet buyers who take stolen
goods no honest shop will touch, at their own
prices, for people whose honor runs the right way.
FNV adds the faction truth: the underworld is a
*group* with its own reputation (#270's swapped
valence), not a shop with a mask on. Here, the
Syndicate (#99) is the underworld's organised face —
its hideouts (#169) are where the fences sit — and
the fence is a service class with its own gates,
its own prices, and one absolute law about what it
cannot sell you.

## Native spec — `mochiichao/underworld/v1` (fragment beside this doc)

- **Who deals, and the gate.** A fence deals only
  with Rangers the dark recognises: the visitor's
  standing on the underworld's own #270 track (where
  town-infamy reads as fame) must stand at its gate
  band (data — in #271's words, the underworld's
  *Shady* or deeper), **or** their personal morale
  band (#269) must read bad-side at first approach —
  the fence smells the ledger before it knows the
  stories (the #269 first-impression rule, pointed
  downward). The shining are turned away politely
  and permanently noted: a Paragon asking after
  fences is a fact the underworld keeps. Snag-class
  items (#268) are fence stock — the Syndicate's
  supply chain for its own grunts and its customers
  alike runs through these seats, which is how the
  law's seizures (#272) can strangle a region's
  stealing by taking its fences.
- **Services (the fence's whole counter).**
  - **Buy stolen goods** — items whose provenance
    shows a taking: at fence prices (a steep
    discount to honest value; the margin is the
    fence's wage for risk). Every sale is a #269
    deed on the *seller's* ledger.
  - **Buy a stolen Mochi** — the darkest service on
    the counter. The fence takes the individual
    (keeper seat to the fence's holding, keeping
    state still `stolen`, #273) and moves it *far*:
    another region's market, another buyer's hands.
    The seller's deed is the table's joint-gravest
    (−6). The Mochi's side of this is #273's: a
    fenced Mochi's trail goes cold by distance,
    which is the entire point of the purchase.
  - **Sell** — snag-class items, untraceable-class
    goods, and information: who is looking for what,
    which routes are patrolled (#272's map, from the
    other side), whose Mochi was taken where. Info
    is a real stock class, priced and fallible.
  - **Move** — for a fee, goods (and, at the darkest
    tier, individuals) are carried across regions
    quietly: distance as a service.
- **The laundering law — stated as law.** A fence
  can be asked to make a stolen Mochi *clean*. The
  answer the system gives is structural, not moral:
  **the record never launders.** History is
  append-only (#68/#168's discipline, #268's theft
  entry); there is no operation in any system —
  fence, trade, gift, storage, release-and-recatch —
  that removes or renames a theft entry, and a
  fenced Mochi's provenance still shows the theft to
  anyone who ever reads the record (a Mochiioteca
  scan shows where a life has been, #227). **What
  the fence sells is distance, not innocence:**
  distance from the victim, from the witnesses, from
  the warm trail — never distance from the record.
  Any future system proposing a clean-record service
  must reckon with this paragraph as a refusal
  already written.
- **The content warning — written in, per the
  research.** RESEARCH-SOURCES.md documents the mod
  scene's lesson from Rocket Edition: a theft system
  whose criminal rewards are gated but *thin* dies
  as a feature — players did the crimes, reached the
  gates, and found too little behind them. This
  spec therefore requires the underworld to carry
  **real content behind its gates**, as system
  obligations, not flavour: exclusive #164-class
  postings only the fences offer (retrieval of
  *other people's* stolen goods — the underworld
  policing its own thefts is a real economy), black-
  market stock depth (items unobtainable honestly,
  authored with #31's registry), the information
  market above, fence-side characters with their own
  arcs (content lane), and the Syndicate's story
  set-pieces (#99). If the content pass cannot stock
  a fence, the fence does not ship as a door with
  nothing behind it — that is the Rocket Edition
  failure, named so it is not repeated.
- **The underworld is not safe.** Fences cheat:
  prices move against the desperate; a fence may
  sell word of *you* to the law or to a victim
  (information flows both ways — a fence transaction
  is a witness event with a professional witness,
  #272, and smart thieves price that in). The
  Syndicate's protection is a #270 standing that can
  be spent by events and lost by insult. None of
  this is a hidden roll against the player: the
  fence's disposition reads the same two tallies as
  everyone else.

## Show lane

The fence is a recurring-room character class: one
counter, one keeper of other people's secrets, and
the audience learning the laundering law by watching
a thief discover that far away is not the same as
clean. #276 carries the mirror.

## Wiring

Seats: #169 hideouts; organised face: #99. Gates:
#270 (underworld track) + #269 (first approach).
Stock: #31 registry (snag-class + black-market
rows). Deeds: #269. Witness character: #272.
Individuals handled under #273's keeping states.
Postings join #164's vocabulary as fence-side
instances (kinds unchanged — deliver / retrieve /
escort / survey / assist cover the dark's errands).

## Open slots

Fence identities, hideout placements, black-market
stock rows, and info prices (world + item content,
authored with the map) · the Syndicate's inner
structure beyond #99's tiers (story canon — rides
on #99's open slots, including the Dojo 8 boss's
name). The services, gates, prices' shape, and the
laundering law are filled in full.

## Coverage — honest

- System: fully specified on the RDR2 fence base +
  FNV faction reading, with the mod scene's content
  warning carried as an obligation.
- Contents: zero fences instanced, zero stock rows —
  content passes own them, and the spec forbids
  shipping an unstocked fence.
