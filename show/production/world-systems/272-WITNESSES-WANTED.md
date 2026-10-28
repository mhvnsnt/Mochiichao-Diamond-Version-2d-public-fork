# #272 — WITNESSES, WANTED & THE LAW → seen is a legal fact; unseen is a moral one

**The system's heart, stated as the research-
backed rule it is.** RDR2 separates conscience from
evidence: honor moves on the deed itself — a mask
blocks *recognition*, never conscience — while the
wanted system runs purely on what was seen and
reported. The owner pulled both systems in whole,
so the split is kept whole, and it organises this
entire list: **morale (#269) is conscience — it
moves on every deed, seen or unseen. Wanted is
evidence — it moves only on witnessed, reported
fact. A crime nobody saw costs your soul and
nothing else; a crime everybody saw costs both.**
That one sentence is the difference between the
thief nobody suspects and the thief the whole route
is watching for, and every system in this package
hangs off it.

## Native spec — `mochiichao/wanted/v1` (fragment beside this doc)

- **The witness set.** Every deed (#269's ledger
  entry) carries a witness set, computed at the deed
  from who was actually there: NPCs present by their
  schedules and travel (#93/#145), the victim (always
  a witness to their own loss — a victim who knows
  who took their partner is the strongest report
  there is), bystanders in the area, and the deed's
  own participants. Mochi present are *not* witnesses
  in the legal sense — cries are not testimony
  (#136's law) — but a victim Mochi's behaviour
  toward its thief is #273's territory, and the
  show's audience is a witness of the fourth kind
  (#276). An empty witness set is a real and common
  outcome: the deed writes to the ledger with
  `witnessedBy: []`, morale moves, and nothing in
  this spec stirs.
- **The report flow — seen → reported → wanted.**
  RDR2's shape, re-expressed:
  1. **Seen.** A witness observes the deed (or its
     immediate aftermath — arriving to a victim's
     shout is a witness class of its own, with weaker
     identification: *deed known, doer described*).
  2. **Reported.** A witness carries the report to a
     law seat (a town's licence office, a dojo, a
     centre — seats are world data). Reports take
     time: the witness must travel or send word, and
     a report that never arrives never lands — a
     witness can be outrun, persuaded (a #244 custom
     beat, not a bribe mechanic — bribing a witness
     is its own deed), or **intimidated** (#269's
     table scores it −3; it may still report, and a
     second witness to the intimidation starts a
     second flow).
  3. **Wanted.** A landed report sets a **wanted
     level** on the Ranger, per region (wanted is
     regional — word travels between regions by the
     chronicle and the roads, slowly, and #233's
     exchange carries formal notices). Levels are
     data on a five-step class scale: *noted →
     questioned → pursued → hunted → most-wanted*
     (draft words). The level is set by the gravest
     reported deed and the Ranger's reported history
     — the ledger the law can see is the *witnessed
     subset*, and the law never reads more than that.
- **The response — #230's ladder, with pursuit at
  the top.** Wanted plugs into licence discipline
  (#230) as its evidence feed: a landed report can
  ground a finding; findings escalate warning →
  supervised → suspension exactly as #230 wrote
  them, and **punishment never touches the Mochi**
  (#230's law, inherited whole — the law acts on the
  Ranger's permissions, never on a creature as
  leverage). Above the licence ladder sits the
  wanted ladder's own teeth: at *pursued* and above,
  NPC Rangers (#93/#145) actively seek the wanted
  Ranger — a confrontation is a recovery demand
  (#273) or a field duel they initiate; at *hunted*,
  routes themselves become hazardous (patrol
  encounters are world data); at *most-wanted*, the
  Syndicate's opposite number applies — bounty-class
  hunters, and the underworld starts reading the
  wanted Ranger as *interesting* (#270's swapped
  valence — being hunted by the law is a credential
  in the dark).
- **Laying low — wanted decays, morale doesn't.**
  Wanted level decays with time unreported-in (data
  rates per level), faster outside the region, and
  is cleared early by answering it: presenting at a
  law seat to face the finding (#230's process) or
  completing restitution (#275). Morale never decays
  on a timer — only deeds move it (#275's roads).
  Confusing the two decays is the one design error
  this spec exists to prevent: **the law forgets on
  a schedule; the soul does not.**
- **The victim's fast lane.** A theft victim's own
  report skips the queue: a Ranger whose Mochi was
  just snagged can report at any seat or to any
  Ranger of standing, and the wanted clock starts
  from the battle's end. This is deliberate — #273's
  recovery runs on the law knowing quickly.

## Show lane

The witness is the show's camera problem and gift:
the audience always knows which kind of scene they
are in — the unseen deed (morale falls in silence)
or the seen one (the report running to town ahead
of the thief). #276 carries the grammar.

## Wiring

Witness sets computed from #93/#145 presence at
#269's ledger write. Findings and sanctions: #230.
Pursuit actors: #93/#145; confrontation forms:
#210/#273. Cross-region notices: #233. Wanted is
derived from landed reports — a stored wanted
*score* is a defect; the stored things are reports
and findings, in #230's home.

## Open slots

Law seats' locations and patrol contents (world
data — authored with towns and routes) · the level
names (drafted words, same class as #271's bands) ·
decay rates and report latencies (system data,
tuned at landing). No mechanic is parked.

## Coverage — honest

- Flow: fully specified on the RDR2 base, joined to
  verified homes (#230's ladder read in its own
  file; #93/#145 presence systems cited by subject
  and number).
- Contents: zero reports, zero wanted Rangers — the
  world has not yet had a crime.


**PROPOSALS from List 29 (registered at their landing, 2026-10-27):** (a) #280's betrayal classification, witness side: when a theft-from-a-friend is witnessed, the report carries the betrayal classification into #270's derivation (280-FALSE-FRIENDSHIP.md) — the classification rides the report; it does not change what a witness is. (b) #281's `collision` event class, witness side: a collision is staged from this file's witness facts and the bridging classes (#145's travellers among them), never from a hidden counter (281-DOUBLE-LIFE.md). Proposal discipline: both take effect only as carried here.
