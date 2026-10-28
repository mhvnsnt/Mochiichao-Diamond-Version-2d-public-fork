# #268 — STEALING (THE SNAG SYSTEM) → the cheat mechanic, made a real system

**The gap this fills.** In the reference games,
catching another trainer's creature is *blocked* —
the game refuses the throw. The only way past the
block was a cheat device: outside hardware that
switched the refusal off. One reference line built
the in-fiction version instead: a snag device that
converts an ordinary capture ball so it can take a
creature that already has a keeper, used by villains
and — in the hero's hands — to take stolen creatures
back. The owner has ruled (2026-10-27): **stealing
is a real system in this game.** This spec builds it
on that fiction: the block is a rule of the ordinary
capture system, and snag-class equipment is the
designed way the rule gets broken.

## Native spec — `mochiichao/snag/v1` (fragment beside this doc)

- **The owned-block, stated as a rule.** #38's
  capture gains one explicit rule it previously
  implied: a target with a filled keeper seat is
  **blocked** — an ordinary attempt is refused
  before any roll ("that Mochi has a Ranger"). The
  block is evaluated before the math, like #68's
  locks. Wild targets (empty seat — including #267's
  pooled released individuals) are never blocked and
  never "stolen": taking them is ordinary capture.
- **The snag-class item.** A capture item whose #31
  record carries the snag class (proposed into #31's
  registry as an item class flag — STAGING step 3;
  zero items instanced here) changes the attempt:
  - The block is bypassed for that throw only.
  - The roll runs on #38's staged math with two
    declared modifiers, both visible in the attempt's
    presentation (the #180 law — no invisible bends):
    a **snag penalty** (the device is working against
    the bond it is breaking; the pCheck is reduced by
    the item's data value), and **bond resistance** —
    the target's accrued bond to its true keeper
    (#39's ledger, read as a value) hardens every
    check. A deeply bonded Mochi is genuinely hard to
    steal; a neglected one is not. Both numbers are
    item/record data, tuned at landing.
  - Success or failure, the item is consumed and the
    attempt is a **deed** (#269's table): an attempted
    theft is already a moral fact, and if it was seen,
    a legal one (#272).
  - **The witness refusal (mod precedent, adopted as
    a designed rule).** The mod scene's working snag
    — the "Thief Ball" decomp work documented in
    RESEARCH-SOURCES.md — refuses to function when
    there are too many witnesses, and keeps the
    original trainer on the stolen creature's record
    (which is this programme's history law already).
    The refusal is adopted: a snag-class item **will
    not fire** when the battle's witness count
    (#272's witness set for the area) exceeds the
    item's witness ceiling (data on the item; drafted
    low — the device is built for dark corners, not
    arenas). The refusal is presented honestly ("too
    many eyes") and consumes nothing: no throw, no
    deed — the crime was never attempted. Crowded
    places are safe places, by mechanism.
- **Where a snag can be attempted.** In any battle
  where the target's keeper is present and the target
  is on the field: field battles against NPC Rangers,
  Syndicate encounters (#99), and field duels (#210).
  **Never in the versus lobby (#109):** the lobby's
  ruleset forbids snag-class items outright — the
  formal arena is the one place the device does not
  work, by the ruleset's own item gate. A snag attempt
  ends the thrower's turn like any capture attempt.
- **A successful steal — what the record does.** The
  keeper seat rewrites to the thief, and the history
  appends a transfer entry of a new, permanent kind:
  **`theft`** — `{takenFrom, takenBy, battleRef,
  beat}`. It is distinct from #168's trade and #217's
  gift in vocabulary and in law: those are consents;
  this is a taking, and **the record never hides it**
  — any later read of the individual's provenance
  (#227) shows the theft in sequence. The individual
  also gains a keeping-state (#273): `stolen`, with
  its true keeper cited. The theft entry can be
  answered by a recovery (#273) or compounded by a
  fence sale (#274); it can never be edited, renamed,
  or laundered off.
- **Who steals.** Player Rangers can. **NPC Rangers
  can too** — and that is where the danger lives.
  Syndicate parties (#99's tiers) carry snag-class
  equipment as data: a grunt's snag is clumsy (weak
  items, heavy penalty), an admin's is a set-piece
  threat, and the roster the player brings into a
  Syndicate fight is genuinely at risk — a successful
  NPC snag takes the individual's record out of the
  player's keeping into the Syndicate's hands, and
  getting it back is #273's recovery, not a reload.
  NPC theft obeys the same math, the same bond
  resistance, the same history stamp. There is one
  protection, and it is the record's own: **story-
  locked individuals (#68) cannot be snagged** — the
  lock that bars escrow and release bars theft with
  the same force; the partner cannot be stolen, so
  the threat lands on the rest of the team, which is
  where stories can afford it.
- **The lawful mirror — re-snag.** Snagging your
  *own* stolen Mochi back from the thief (or from
  whoever holds it) is the same mechanic with the
  opposite deed: it is restitution, not theft
  (#269's table scores it as the strongest good deed
  in the system), it writes a `recovered` history
  entry answering the theft, and no witness reads it
  as a crime (#272). The device is neutral; the
  record knows the difference, because the record
  knows whose the Mochi is.

## Owner addendum — the confirmation (2026-10-27)

The owner, describing the thief mechanism in his
own words: when you throw our version of a ball in
a Ranger battle at someone's Mochi, the game asks
first — **"Are you sure you want to try and steal
this person's Mochi?"** That prompt is this
system's conscience beat, and it is law:

- **A snag attempt against an owned Mochi never
  fires on the throw input alone.** The input
  raises the prompt; YES attempts the steal (the
  throw then runs exactly as specified above); NO
  cancels the input whole — no item consumed, no
  throw, no deed, no record. **Backing out at the
  conscience beat is free, by design.** Hesitation
  is not a crime the ledger recognises.
- **A confirmed attempt is always a deliberate
  deed.** Because no snag throw can happen
  unconfirmed, there is no accidental-theft state
  anywhere in the system — the record can trust
  every attempt it holds. A confirmed throw that
  fails writes #269's attempted-theft entry (the
  "Attempt a steal" row, smaller than a successful
  theft's −6; see the addendum note under #269's
  deed table); a confirmed throw that succeeds
  writes the theft itself. And #272's witnesses
  read a confirmed attempt as they would the act's
  opening: you threw in front of people, whatever
  the ball did. (The witness-ceiling refusal above
  is untouched: a device that declines to fire has
  made no throw — there is nothing to witness and
  no deed to write.)
- **The rescue shape.** The same physical throw
  against a closed-heart Mochi (#287's heart read)
  prompts differently: the device states what it
  sees — the heart is closed — and the
  confirmation frames a rescue, not a taking. A
  confirmed rescue attempt carries **no morale
  cost** and writes no theft vocabulary. One
  mechanism, two moral shapes; the heart read
  decides which one the player is standing in.
- The gate is on the *player's* input. NPC snags
  (#99) are events the player suffers, not choices
  the player confirms; nothing here slows them.

## Show lane

The snag is the show's villain grammar made visible:
a device that breaks the world's kindest rule. #276
carries the full mirror; the system note here is
only that the show and the game run the *same*
record — a theft on screen writes the same `theft`
entry, with the same permanence.

## Wiring

Block rule + attempt flow: #38. Item class: proposed
into #31. Bond resistance reads #39; keeping-state
and recovery: #273; deed scoring: #269; witness/legal
consequences: #272; NPC use: #99 parties; lobby
exclusion: #109; history vocabulary extends #168's
transfer family (a new kind proposed into #168's
file — STAGING step 3). Never writes: a consent
transfer, an edited history, a kept-state change
without the theft entry.

## Open slots

Which specific items carry the snag class and their
penalty values (item data, authored with #31's
registry — mechanics filled, rows are content) ·
the Syndicate boss's own snag set-piece (story —
rides on the Dojo 8 boss, whose name is open canon
carried from #99). Nothing mechanical is parked.

## Coverage — honest

- Mechanic: fully specified over verified homes
  (#38's math and shake structure, #39's bond
  ledger, #68's lock, #109's ruleset gate).
- Contents: zero snag items instanced; zero Syndicate
  parties carry one yet — both are data passes at
  landing, not design gaps.


**WIRING NOTES — List 36 (recorded at its landing, 2026-10-27):** (1) #349's rescue confirmation reads a heart reader: the `heartReader` field and the refusal-data seats are PROPOSED onto the #31 item record beside this system's snag flag — reader presence is item data. Zero snag-class items are instanced anywhere (this file's own register), so nothing was placed on any item record at this landing. (2) #356's send-out fence rides this file's party of record: after a steal lands, the stolen slot stays empty, and no send-out may present a stolen Mochi as the thief's own — the exclusion reads this system's record of whose party the individual belongs to.
