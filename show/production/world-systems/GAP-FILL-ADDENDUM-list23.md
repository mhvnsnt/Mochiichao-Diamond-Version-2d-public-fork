# GAP-FILL ADDENDUM — List 23 (items 217–226)

Written under the owner's POKÉMON-BASE RULE (2026-10-27):
everything is built on top of the full Pokémon base, so a
gap in *how a system runs* gets filled the way Pokémon
does it, instead of being parked as an owner question.
Each fill below names the open slot it closes (from
STAGING.md's open-slots inventory and the spec's own
open-slots section) and the Pokémon precedent it follows.

**What this addendum does NOT touch — these stay OPEN
as the owner's own calls, entire:** Regions 2–5 starter
programmes (#222); who is memorialised, and every
memorial subject, site, and inscription (#225); newspaper
names and mastheads (#224); mentorship pairings, and who
counts as a senior Ranger (#221); canon trade backstories,
depicted-trade episodes, and trade-evolution pairings
(#218). Filling mechanics never writes story.

Where a fill contradicts nothing in the spec, it simply
closes the slot. Where a slot also appears in STAGING's
wiring steps as "lands OPEN," the addendum is the later
instruction and the slot lands FILLED as below.

---

## #217 — Gift & adoption transfers

**Slot closed: gift channels.**
Filled rule: a gift is handed over **in person, in one
moment** — the giver and the receiver are in the same
place, the transfer completes on the spot, and the
individual lands in the receiver's party if there is
room, otherwise straight into their storage (#106
kinds), automatically. There is no remote, mail, or
leave-it-for-later channel for a gift occasion.
*Precedent: NPC gift Pokémon in the Pokémon games —
you talk to the giver, you receive the Pokémon there
and then, and if your party is full it goes to a Box
on its own.*

**Slot closed: gift expiries.**
Filled rule: **a gift never expires.** The gift
occasion carries no expiry timer (`expires` reads
null for this class); an unclaimed in-world gift
simply waits with its giver until it is received.
*Precedent: gift Pokémon in the games don't expire —
a standing gift-giver is still there, gift in hand,
whenever you come back. (Online distribution windows
in the real world are a shop matter, not an in-world
gift, and set no rule here.)*

**Slot closed (rule only): `species_untradeable`
derivation.** Filled rule: no new species is named
here — the *test* is filled. A species reads
untradeable when its existing record already carries
a mythical-class or story-locked designation in the
data that already exists (#163's class, #68's locks);
the check is read off the record at commit/gift time,
exactly as #219's validator already reads its other
exclusions. Which species carry those designations
stays species data, untouched by this addendum.
*Precedent: in the Pokémon games, Mythical and
special-event Pokémon are the ones barred from the
GTS and Wonder Trade — the restriction follows the
designation on the Pokémon, not a separate list.*

## #219 — Surprise exchange

**Slot closed: the matching/pairing rule.**
Filled rule: matching is **random, from the whole
committed pool, at the moment a match can be made.**
When a second commit is waiting, the two are paired
at once; the partner commit is drawn at random from
the commits waiting — no order-of-arrival priority,
no species, level, or value balancing, no preference
of any kind (the format already refuses to express a
wishlist; the matcher now matches that refusal).
A lone commit waits in escrow, retractable as the
spec already states, until another commit arrives.
*Precedent: Wonder Trade (Generation VI) and Surprise
Trade — you commit a Pokémon and are matched at
random with another player's committed Pokémon;
the system does not try to make the trade "fair."*

**Slot closed: pool scope.**
Filled rule: **one world pool.** There are no
per-region pools; a commit from any region can match
a commit from any other. *Precedent: Wonder Trade's
pool is every player in the world on the service,
not a pool per town or region — and #146's one-world,
no-forks discipline lands on the same answer from
Mochiichao's own side.*

**Slot closed: commit costs.**
Filled rule: **committing costs nothing** — no
currency fee, no item, no token. The only thing a
sender gives is the individual they committed, which
is the exchange itself. *Precedent: Wonder Trade and
Surprise Trade are free to use; the Pokémon you send
is the whole price.*

## #220 — Shelter & stray

**Slot closed: seeking-window length and procedure.**
Filled procedure, step by step:
1. **Intake opens seeking on its own.** The moment a
   stray is taken in, if their record names a keeper,
   the seeking state stands open — nobody has to file
   anything to start it.
2. **Identification is instant.** The keeper is read
   straight off the individual's own record at intake;
   there is no search, no waiting for a database.
   *Precedent: a Pokémon's summary always shows its
   Original Trainer and ID — who a lost Pokémon
   belongs to is read off the Pokémon, immediately.*
3. **Notice goes out once, publicly.** The shelter
   posts the found individual through the chronicle
   (#224) and broadcast (#172) at their next
   edition/airing — one notice is the procedure;
   the shelter does not run a campaign.
4. **Reclaim is free and checked against the record.**
   The keeper reclaims at the shelter holding the
   individual, pays nothing, and is checked the way
   the games check ownership — the claimant's name
   and licence must match the keeper the record
   names. *Precedent: withdrawing your own Pokémon
   from the Day Care is done at the Day Care that
   holds it, against your identity as its trainer.*
5. **The window is seven in-game days.** Seeking
   stands open for seven days from the intake notice.
   *Precedent: Pokémon's longest regular rhythm is
   the weekly cycle — the weekday events, the Friday
   Pokémon — so a week is the span the games
   themselves treat as "long enough for everyone to
   have had their chance."*
6. **After the window, adoption opens — and a late
   reunion is a new transfer, not an undo.** If no
   keeper claims within the window, the adoption exit
   (#217) opens. If the original keeper appears after
   an adoption has completed, the adoption stands —
   any return happens only as a fresh gift or trade
   the new keeper agrees to. *Precedent: a completed
   trade in Pokémon is final; getting a traded Pokémon
   back has always meant trading back, by agreement.*

## #222 — Regional starter programmes

**Slot closed: programme capacity (class rule only).**
Filled rule: **one programme gift per Ranger.** A
programme gives a first partner once, at the Ranger's
licence issuance (#98's `issuedBeat`); a Ranger who
already holds a programme partner cannot claim a
second from any programme. This fills the *capacity
of the class* only — it designs no region's programme,
and Regions 2–5 stay open entire, below.
*Precedent: in every Pokémon game, a new trainer
chooses exactly one starter from the professor;
the choice is once, and it is final.*

## #223 — World visiting

**Slot closed: guest-seeing / dex derivation.**
Filled rule: **seeing a Mochi while visiting writes
nothing in the guest's Mochiioteca** — no *seen*
state, no entry, no silhouette change. What a guest
sees in a host's world is presentation to the guest,
full stop; the guest's dex fills only from the
guest's own encounters, battles, and received
transfers in their own world. (The question was
flagged to #14's home; this addendum fills the rule
Pokémon-style for #14 to cite.)
*Precedent: Pokémon you see in link battles and in
battle facilities are never registered in your
Pokédex — not even as seen. Only your own wild
encounters, your own opponents, and Pokémon you
actually receive mark the dex.*

**Slot closed: session capacity.**
Filled rule: a venue holds **the host plus at most
three guests — four Rangers in the room, total.**
Admission past that waits for a guest to leave.
*Precedent: Pokémon's visiting sessions are four
players in total — the Union Circle in Scarlet and
Violet, and the four-trainer camps and raids in
Sword and Shield, all cap the room at four.*

## #224 — In-world newspaper & chronicle

**Slot closed: edition cadence.**
Filled rule: **one edition per region, per in-game
day**, derived at the day's rollover from the facts
that stand sourced at that moment (the spec's
source rule is unchanged — no source, no item).
Corrections ride the *next* day's edition, never a
same-day reprint, exactly as the spec's correction
law already requires. Paper names, how often the
paper errs, and its tone stay open (see header).
*Precedent: the games' media run on a daily cycle —
the TV shows and BuzzNav news change with the day,
and the daily lottery draws once a day; print here
keeps the same daily beat.*

---

## Slots deliberately left OPEN (and why)

- **#218 — canon trade backstories, depicted-trade
  episodes, trade-evolution pairings.** Story. Which
  character got their partner in a trade is the
  owner's canon, not a mechanic Pokémon can answer.
- **#219 — live-feature existence.** Whether the
  surprise exchange ships as a live feature at all is
  a product call for the owner. This addendum fills
  how it *runs* if it runs; it does not switch it on.
- **#220 — shelter locations and hosts; surrender
  occasions (#104).** Where shelters stand and who
  runs them is town content; occasion names are
  honours vocabulary. Both are the owner's.
- **#221 — mentorship eligibility floors, graduation
  criteria and ceremony, canon pairings.** Pokémon
  has no mentor-licence system to copy, and what
  counts as a senior Ranger — and what graduation
  looks like — is this world's social canon. (The
  pairings themselves are casting.)
- **#222 — Regions 2–5 programmes, entire.** The
  owner's express reservation; the capacity fill
  above designs none of them.
- **#223 — venue classes beyond hideouts; visit
  occasions (#104).** Which other places welcome
  guests is world content; occasions are honours
  vocabulary.
- **#224 — paper names/mastheads; error rate and
  correction culture; reader-content class.** The
  first is branding, the second is the paper's
  character (tone), the third is an editorial class
  addition — all content calls. The cadence fill
  above neither needs nor sets them.
- **#225 — everything, headed by who is
  memorialised.** The owner's canon call, entire,
  per the spec and the header above.
- **#226 — witness points and spectacle geography;
  which #144 pairs are spectacle-grade; the #152
  transit register; the #104 witness occasion.**
  Geography and which migrations become events are
  content/canon per pair; the transit register and
  the occasion are proposals that land in their
  owners' files (#152, #104), not here.
- **#104 occasions generally (#217, #220, #221,
  #223, #226).** The names of honours are the
  owner's vocabulary to give; mechanics do not
  mint them.
- **Keeper-history seat (#168's landing decision).**
  A repo architecture choice for the landing lane,
  not a gameplay rule — Pokémon has no answer to
  where a file lives.
