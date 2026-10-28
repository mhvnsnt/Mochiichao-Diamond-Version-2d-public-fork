# #270 — REPUTATION → what each group believes, fame and infamy counted separately

**The owner's brief:** reputation pulled **100%**
from another game's model — Fallout: New Vegas —
paired against #269's morale. FNV's core insight is
the whole spec: **fame and infamy are separate
tallies.** A group does not hold one opinion of you
on one dial; it holds two piles of stories — the
good ones it tells about you and the bad ones — and
its name for you comes from *both* piles at once.
You can be the Ranger who saved the town's strays
*and* the Ranger seen talking to fences, and the
town will call you something that means exactly
that. The deep source is RESEARCH-SOURCES.md.

**How FNV's reputation works, as publicly
documented (the kit taken).** Each faction tracks
fame and infamy independently, earned from quests
and witnessed acts for or against that faction. The
pair maps to a standing title (fame alone high:
idolised; infamy alone high: vilified; both high:
a mixed, unpredictable name; neither: unknown).
Standing changes what the faction offers: prices,
access, whether its people help, tolerate, or shoot
on sight — and disguises exist because the tallies
belong to the *identity believed*, not the soul.
That last part matters here: reputation attaches to
what a group has witnessed of the Ranger. It never
attaches to the deed ledger's secrets (#269).

## Native spec — `mochiichao/reputation/v1` (fragment beside this doc)

- **Groups are the unit.** A reputation exists per
  **group**: a town, a dojo, a region's league, the
  rescue service, the Syndicate — any body of people
  with a shared memory. Group records are world data
  (authored with the world; zero groups are instanced
  in this spec beyond naming the classes). A deed
  moves a group's tallies only if the deed was
  **witnessed by that group's members or reported to
  it** (#272 owns witnessing and reporting — an
  unseen deed moves morale, #269, and nothing here).
- **Two tallies, both derived.** Per group, per
  Ranger: `fame` and `infamy`, each 0…25, each the
  sum of that group's witnessed-deed credits from
  #269's table (a deed's group credit is data on the
  deed: which groups a witnessed deed reaches, and
  to which tally — stealing from a townsperson
  credits the town's infamy; stealing *from the
  Syndicate, witnessed by the town*, may credit the
  town's fame — the table's group rows are data,
  authored with the groups). Tallies are **derived
  at read time** from the deed ledger filtered by
  witness/report facts — never stored, per programme
  law and #201's standing lesson.
- **The read — one language with #271, and no
  cancelling.** A group's standing is a **named
  combination** of its two tallies — FNV's sixteen
  standing names are exactly this: a fame band
  crossed with an infamy band. The combination is
  then *placed* on #271's ladder so the world speaks
  one language (the ladder coordinate is a way of
  pointing at the combination, never an arithmetic
  difference): **fame and infamy never cancel** —
  there is no sum in which good stories erase bad
  ones on paper. When both tallies stand high, the
  combination is the **mixed** class (FNV's both-
  piles case; #271's draft prefix *Two-Storied*):
  not neutral but *unpredictable* — the group holds
  two true stories and behaves accordingly (helped
  and wary, welcomed and watched). And the research
  adds a floor with teeth: **once a group has Hated
  a Ranger (infamy at the hate threshold, a data
  value scaled to the group's size — FNV's
  thresholds differ per faction, and ours differ per
  group the same way), that group never reads them
  Unmarked again.** The best road back is to mixed,
  then liked-with-a-past — by deeds and time under
  #275, never by fame outscoring infamy. Forgiveness
  in this system is a story a group tells on top of
  the old one; the old one is not deleted.
- **What standing buys and costs — per group, in
  the group's own coin.** Standing effects are
  group-class data, filled on the FNV shape:
  - **Towns:** shop terms (#118) beyond morale's
    personal prices; whether the shelter (#220) and
    service seats trust you with custody work
    (#164 postings); whether doors are open after
    dark (presentation + #119 interiors).
  - **Dojos / the league:** crowd warmth (#242),
    challenge customs (#244 — a vilified Ranger is
    challenged coldly or not at all), licence-trial
    *framing* (never the verdict — #133 reads its
    own facts; reputation colours the room, not the
    ruling).
  - **The Syndicate / the underworld:** the tallies
    swap valence — what the town calls infamy is the
    Syndicate's fame. A group's record declares its
    own reading; the system does not moralise the
    piles. This is how #274's fences know their own.
  - **Everywhere:** wanted interaction — a group
    that holds you in high fame reports crimes
    against you faster and believes your account
    (#272's witness flow reads standing as data);
    a group that has vilified you does the reverse.
- **Decay.** Infamy fades; fame fades slower; neither
  fades to a lie. Tallies are derived from deeds,
  and deeds age: #275's redemption spec owns the
  decay rates (clean-conduct weeks, restitution's
  direct repairs). Nothing here deletes a deed;
  decay is a read-time weighting, so history remains
  auditable even when a town has mostly forgiven.

## The supersession of #201, stated plainly

#201 built reputation as qualitative classes over
licence tier, mission service, and public landmarks,
and forbade a stored score. The owner's ruling
supersedes its *model*: **#201's classes become a
view over this system** — each old class is now
read as a band-range + tally shape on #271's ladder
(STAGING step 5 carries the mapping). #201's laws
that were right stay right and are inherited:
reputation is derived, never stored; it is never
*spendable currency* (effects are the world's
behaviour, not a wallet); and any system wanting
reputation as an input proposes it into this file's
successor home. What dies is only the input list and
the class list — replaced by witnessed deeds and
the ladder.

## Show lane

Reputation is the show's *arrival* device: the room
knows the name before the face. #276 carries the
mirror — including how a mixed-flag character walks
into a town that has two stories about them.

## Wiring

Tallies derive from #269's ledger + #272's witness/
report facts. Group records: world data beside #93's
layer. Effects read by #118 (town terms), #164
(custody trust), #242/#244 (dojo rooms), #274 (the
underworld's swapped reading), #272 (report speed
and belief). Supersedes #201 per STAGING step 5.

## Open slots

The group list itself and each group's authored
deed-credit rows (world content — which towns, which
dojos, authored with the map; classes are specified,
instances are content) · group-specific effect
tunings (data). No mechanic is parked: tallies,
the read, the mixed flag, and the effect classes
are filled in full.

## Coverage — honest

- System: fully specified on the FNV base the owner
  directed; deep documentation in RESEARCH-
  SOURCES.md.
- Contents: zero groups instanced (the world data
  pass owns them); zero deed-credit rows authored
  beyond the classes named.


**PROPOSALS from List 29 (registered at their landing, 2026-10-27):** (a) #280's betrayal classification: a theft from a friend is priced in this file's derivation as a *betrayal*, not a theft — the victim's groups hear it as a betrayal (280-FALSE-FRIENDSHIP.md). #280's trust read (a derivation over #93/#12/#164/#104 facts — no deceive verb is founded anywhere) supplies the friendship fact the classification keys on. (b) #281's `collision` event class: the event where a double life's two true readings meet in one witness's hands (281-DOUBLE-LIFE.md), proposed into this file's per-group track handling — the tracks hold two true readings at once; a collision is a fact about witnesses, not a concealment failure, and #281 founds no concealment system. Proposal discipline: both take effect only as carried here; List 29 instances neither — whose friendships he builds and burns, and which collisions his story suffers, are story/canon, the owner's and the writers'.
