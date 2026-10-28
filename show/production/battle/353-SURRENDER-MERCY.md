# #353 — SURRENDER & MERCY → how a Ranger battle is allowed to end early, and what ending it costs

**The shape of the thing.** Ranger battles in this
programme end by defeat (#248's math), by capture
resolutions, or not at all — #254 bars running
from them outright. But Rangers are people, and a
person whose side is collapsing may *offer to
stop*. This spec builds that ending: the surrender
offer, the winner's two answers — mercy or
pressing on — and the ledger entries both answers
write. It is deliberately a small system with a
long shadow: surrender is where #210's duel honour,
#269's ledger, and #352's voice all meet in one
beat.

## Native spec — `mochiichao/surrender-mercy/v1` (fragment beside this doc)

- **The offer.** A Ranger (player or NPC) may offer
  surrender when their side can no longer field a
  conscious Mochi *or* at any earlier point of their
  own choosing — surrender is a decision, not a
  threshold event, and offering early is allowed to
  be wisdom, cowardice, or a bluff the winner must
  read. The offer is a battle command class of its
  own (proposed into #10's ring vocabulary for
  Ranger battles — STAGING step 6), made on the
  offerer's turn in place of another command. For
  an NPC, the offer is an #18 AI decision keyed to
  their character facts (#93/#301: some Rangers
  never offer, and the never-offering is itself
  character data — the offer's *probability* is
  never a die roll against a generic table).
- **Stakes stay inside #210's law.** A surrender
  settles the battle under whatever stakes the
  battle already carries: field-duel stakes are
  **honours only** (#210 — never Mochi, never
  currency, never Fragments), and surrender changes
  the *ending*, never the stakes — a surrendered
  duel pays its honours exactly as a fought-out one
  does, and **no surrender may be made a vehicle
  for transferring a Mochi**: "I yield, take my
  partner" is not a sentence this system can
  express (a Mochi changes keepers by #38 capture,
  #168 trade, #217 gift, or #268 theft — the closed
  list is the closed list). Where a battle carries
  no stakes (an ordinary field battle), surrender
  simply ends it: the loser walks away beaten
  earlier and cheaper, which is its own reward.
- **The winner's answer — mercy or pressing on.**
  An offered surrender must be answered:
  - **Mercy (accept):** the battle ends on the
    offer. The winner's restraint is a deed
    (proposed row into #269's table: mercy shown to
    a surrendered Ranger, small positive — drafted
    with the table's texture; STAGING step 2), and
    where witnesses saw it, it is exactly the kind
    of witnessed good #270's tallies are built from.
  - **Refusal (press on):** the battle continues —
    and the refusal is also a deed (proposed row:
    mercy refused, small negative), because
    continuing to beat a Ranger who has yielded and
    asked to stop is a choice the ledger recognises.
    A refused surrender may not be re-offered in
    the same battle (the answer was given; the
    battle's grammar returns to defeat-only endings)
    — one offer per Ranger per battle, stated as
    the anti-loop rule.
  - **Theft changes the room:** a surrender offered
    *after* a steal has landed in the same battle
    (#356) is answered under shadow — mercy after
    taking someone's partner is restitution's door
    (#275: the taken Mochi can be returned on the
    spot, and the return is the strongest deed in
    the system, not the mercy's small one). The
    surrender system does not soften theft; it
    routes the winner to the bigger choice, and
    #352's `to-mercy` classes carry both registers.
- **Outcomes write once — the anti-farming law.**
  A surrendered battle's outcomes (honours, records,
  deeds, #14-family counts where they apply) write
  **exactly once**, at the ending, through the same
  outcome path as a defeat ending — there is no
  surrender-specific outcome channel to farm. The
  discipline is #70's anti-exploit rule and #177's
  no-double-count shape applied to an ending:
  repeated staged surrenders between cooperating
  players/NPC scripts yield nothing the second time
  that the system values, because mercy deeds are
  subject to #269's existing good-deed daily credit
  cap (+4/day — the cap is the farm fence, and it
  already exists), and honours read battle facts,
  not ending types. A mercy shown to the same
  Ranger twice in a day is a kindness the ledger
  has already counted.
- **Wild battles have no surrender.** A wild Mochi
  does not offer terms and cannot receive them:
  the wild grammar of ending is flight (#254's
  escape math, on either side — the wild may flee;
  the Ranger may not, in a Ranger battle, and
  *may*, in a wild one, exactly as #254 wrote it).
  Stating this in the surrender spec keeps the
  fence bright: surrender is a *persons'* system —
  it exists because both sides can speak (#301) and
  be held to account (#269). A closed-heart wild
  individual's ending is #349/#288's road, never a
  negotiation.

## Show lane

Surrender is one of the show's oldest beats — the
offered hand, the pause, the answer — and it
stages under #82 with #352's classes as its
skeleton. The show's rule mirrors the game's
fence: a surrender scene is about the *answerer's*
character, and the ledger's two small rows are the
game keeping the same books the audience keeps
informally.

## Wiring

Offer command proposed into #10's ring vocabulary
(Ranger battles only — its absence from wild rings
is #254's fence restated). Stakes read: #210.
Deed rows proposed into #269's table (STAGING
step 2). NPC offer decisions: #18's AI stack keyed
to #93/#301 character data. Voice: #352 (`to-mercy`).
Post-theft routing: #356/#275. Outcome path: the
ordinary defeat-ending path, reused whole — a
surrender outcome channel separate from it is a
landing defect.

## Open slots

The two deed values (drafted system data in #269's
texture — mercy small, refusal small, both tunable
at landing) · which character data marks a
never-offering Ranger (#93/#301 content).
No story fact is opened here: whether any canonical
Ranger is *known* for surrendering or for refusing
mercy is episode and bible writing, not a system
slot.

## Coverage — honest

- System: fully specified — offer, stakes fence,
  two answers, write-once outcomes, wild exclusion.
- Contents: zero surrender offers exist (no battles
  have been fought); the deed rows are proposals
  into #269's file, landing with this package.
