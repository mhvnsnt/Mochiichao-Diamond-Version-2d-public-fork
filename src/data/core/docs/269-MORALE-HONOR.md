# #269 — MORALE (PERSONAL HONOR) → what you are, whether anyone saw or not

**The owner's brief, in his words:** pull the
morale system from Red Dead Redemption 2's Honor
**100%**, and wire it in as the Ranger's own meter.
This spec does that: RDR2's Honor is the base —
a personal good↔bad scale, moved by deeds, read by
the world's prices and faces — re-expressed in
Mochiichao's record language. The deep source for
every mechanic cited is the parallel research pass
(RESEARCH-SOURCES.md, beside this package). What
this spec adds to the base is the programme's own
doctrine: in RDR2 the meter is a number the game
stores; here, **morale is derived from a deed
ledger** — honour's facts, never a floating score
(the #201 lesson, applied to the self).

**How RDR2's Honor works, as publicly documented
(the kit taken; research detail in RESEARCH-
SOURCES.md).** Under the hood it is one hidden
number (−320…+320) across 17 ranks — and the ranks
are *unnamed* in RDR2 (the named chunky ladder —
Hero / Peacemaker / Rustler / Desperado — is the
first game's; #271's drafted band names borrow that
older spirit, flagged as draft). Everyday deeds
move the number in small change — roughly 1–10
points at a time (stealing is worth −1; helping a
stranger +5) — and #269's deed table is scaled in
that same texture against the owner's 50-step
ladder, which is his shape and stands as ruled.
Deeds move the meter: helping
strangers, donating, sparing, and returning what
was taken push it up; stealing, killing the
innocent, looting, and cruelty push it down. Rank
on the meter changes the world's terms: high honor
earns shop discounts and warmer greetings and opens
honourable work; low honor earns better prices from
fences, darker work, and colder faces — the meter
pays on *both* sides, which is what makes the slide
tempting. Crucially, the meter moves on the deed
itself: an unseen theft still costs honor. What you
are is not what they know. That split is kept whole
here — it is the hinge between this spec and #270.

## Native spec — `mochiichao/morale/v1` (fragment beside this doc)

- **The deed ledger.** Every morale-relevant act
  appends one entry to the Ranger's deed ledger:
  `{deed (closed vocabulary, the table below),
  subject (individual/item/group refs as the deed
  needs), area, beat, witnessedBy (the witness set
  #272 computes — possibly empty)}`. The ledger is
  append-only and lives with the Ranger's record
  (#98's licence family is its home — the licence
  renders standing; the ledger is what standing is
  rendered *from*). Nothing edits or deletes a deed.
  Witnessed or not, the deed is written; the witness
  set decides who else ever learns of it (#272),
  never whether it counts here.
- **The scale.** Morale is the derived sum of the
  ledger's deed values, clamped to **−25…+25**, read
  on #271's ladder (0 = unmarked). Derivation, not
  storage: any read can be audited back to the deeds
  that compose it, and a "morale value" stored
  anywhere is a landing defect.
- **The deed table (system data — drafted values,
  tuned at landing; the vocabulary is closed).**

  | Deed | Value | Notes |
  |---|---|---|
  | Steal a Mochi (successful snag, #268) | −6 | the system's gravest common deed |
  | Attempt a steal (failed snag) | −3 | the intent was acted on |
  | Steal an item / pickpocket-class taking | −2 | |
  | Sell a stolen Mochi to a fence (#274) | −6 | theft, compounded — you sold a life on |
  | Sell stolen goods to a fence | −2 | per transaction, not per item |
  | Intimidate a witness (#272) | −3 | and the witness may still report |
  | Keep a stolen Mochi, per in-game day, knowing | −1 | the meter remembers daily; capped −10 per individual |
  | Refuse a lawful recovery demand (#273) | −2 | per refusal |
  | Return a stolen Mochi to its true keeper | **+8** | restitution — the largest single good deed |
  | Recover your own stolen Mochi lawfully | +2 | perseverance, witnessed or not |
  | Reunite a stray with its keeper (#220) | +3 | |
  | Rescue and release a hurt wild Mochi (#245) | +2 | per completed rescue record |
  | Make a gift of a Mochi (#217) | +1 | |
  | Restitution payment for a witnessed theft (#275) | +3 | in addition to any return |
  | Public service mission completed (#164, service-class) | +1 | the redemption workhorse — see #275 |
  | Donate goods/currency to a town or shelter | +1 | per donation act, daily-capped |

  Daily deed-credit cap: good deeds credit at most
  +4 per in-game day and bad deeds debit without a
  daily cap (falling is always available; climbing
  is paced — the asymmetry is RDR2's and #275's law).

  **Addendum — confirmed attempts (owner ruling,
  2026-10-27; #268's confirmation).** The two theft
  rows above are confirmation-gated at the source:
  a snag throw exists only after the player answers
  YES to #268's prompt ("Are you sure you want to
  try and steal this person's Mochi?"), so the
  "Attempt a steal" row (−3) is the price of a
  *deliberate* attempt, never an accident — and a
  player who backs out at the prompt writes nothing
  here at all. Confirmed rescue attempts against a
  closed-heart Mochi (#268/#287) are not theft rows:
  they write no morale entry.
- **Rank effects — the RDR2 shape, our terms.** At
  band thresholds on #271's ladder, morale changes
  the world's terms for the Ranger personally:
  - **Prices:** honest shops discount as the good
    bands rise (up to the top band's data value) and
    surcharge the deep bad bands; fences (#274) run
    the mirror — they pay *better* and offer more to
    the bad bands, and will not deal at all with the
    shining top good bands (their gate is #270's
    underworld track, but morale is the smell they
    read first).
  - **Faces:** NPC greeting warmth, idle lines, and
    crowd texture (#242/#93) key off the band the
    Ranger's *visible signs* suggest — see the
    interaction rule below.
  - **Work:** some #164 postings are band-gated both
    ways — escort and service work asks a clean name;
    the underworld's work (#274) asks the opposite.
  - **The law:** #230's discipline and #272's wanted
    flow read the ledger as history — a long good
    record is mitigation on the record; a long bad
    one is the opposite. Neither is a pardon.
- **Morale ≠ reputation — the interaction rule.**
  Morale is what you ARE (the ledger's sum, seen or
  unseen). Reputation (#270) is what each group
  BELIEVES (built only from witnessed, reported
  facts). They interact in exactly one place: **first
  impressions.** A group that has no witnessed facts
  about a Ranger starts from the visible signs of
  their morale band — bearing, company, whether
  their Mochi are calm around strangers — as a
  *provisional* read, replaced by the group's own
  witnessed record the moment one exists. A saint
  with a secret is read as a saint until the secret
  surfaces; a redeemed thief is read by their deeds
  since, not by the ledger's whole weight (#275).

## Show lane

Morale is the show's interior meter: the audience
sees the deed the town never did. #276 carries the
full mirror — including the long game the owner has
named for it (a later generation's thief anti-hero
lead whose whole arc runs on this engine).

## Wiring

Ledger home: #98's licence family (append-only,
beside #230's findings). Deed sources: #268 (theft),
#274 (fences), #272 (intimidation, witness sets),
#220/#245/#217/#164 (the good roads). Reads: #271
(the ladder), #118 shops (price bands), #93/#242
(faces), #164 (band-gated postings), #230/#272
(history as mitigation). Derived-never-stored per
programme law; the stored thing is the deed.

## Open slots

Deed values are drafted system data — tunable at
landing without touching the vocabulary or the law;
they are flagged as data, not canon. No story facts
are open in this spec: morale has no names to name.

## Coverage — honest

- System: fully specified on the RDR2 base the owner
  directed, re-expressed in the programme's derived
  idiom; every cited mechanic's deep documentation
  sits in RESEARCH-SOURCES.md.
- Contents: the ledger is empty (no deeds have been
  done); band-gated posting contents are #164 data
  passes, not gaps in this system.


**PROPOSED ROWS — List 36 (registered at List 36's landing, 2026-10-27):** three rows proposed into this file's deed table, values DRAFT (the mercy values and the attempt-weight tuning are open slots in #348/#353 — no number is asserted here):

| Deed (proposed) | Value | Notes |
|---|---|---|
| Attempt a betrayal-taking (a taking from one who trusts you, #348) | DRAFT | the attempt class generalised from this table's seed rows; gated by #347's prompt taxonomy |
| Mercy shown (a surrender accepted / a beaten opponent spared, #353) | DRAFT | written only when mercy was the player's to refuse |
| Mercy refused (a surrender spurned, #353) | DRAFT | the refusal is the deed; the fight's outcome writes nothing here |

Confirmed, not duplicated: this file's addendum already carries the confirmation-gated attempted-theft row ("Attempt a steal", −3) from List 28's landing — List 36 adds no second copy. **Taxonomy check (rides with these rows):** a new taking-class deed row in this table without a #347 prompt class fails review.
