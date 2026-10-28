# #177 — EXPERIENCE & GAIN SYSTEM → what a battle is worth, and who it pays

**Doctrine seat:** this is the absent system List 17's
build registered — no spec in Lists 1–16 defines gain
arithmetic, a split rule, or what a battle-end learning
event is worth. #158 fixed the interface and refused to
invent the rest: *one battle-end learning event per
Ranger-side participant, consumed by #129's flow.* This
spec honours that interface verbatim and builds exactly
what it presupposes: the yield pool, the participant
classes, and the split. Curves and thresholds — what
accumulated gain *means* — belong to #178. No level is
stored here, and no formula constant is asserted beyond
the interface.

**What was studied.** Experience systems in the publicly
documented record: a defeated opponent yields an amount
computed from a per-species yield value scaled by the
opponent's level; the yield divides among the victor's
participants — individuals who took part in the battle —
with later documented forms extending a share to
non-participants through a share mechanism; a captured
opponent yields nothing (it was not defeated); and
player-vs-player formats yield nothing at all. The kit
taken: the yield pool, participation as the earning
criterion, division of the whole pool (nothing created,
nothing lost), and the capture/versus exclusions.

## Native spec — `mochiichao/gain/v1` (fragment beside this doc)

- **The event (the #158 interface, verbatim).** At
  battle end, each Ranger-side participant produces
  exactly one learning event, consumed by #129's flow.
  The event carries `{individualId, amount}`; `amount`
  is computed by this system at battle end and stored
  as a **fact** on the individual's record. The
  accumulated total is the sum of the event amounts —
  a derivation over facts (#14/#96 law), never a stored
  counter this system maintains.
- **The yield pool.** Each *defeated* opposing
  individual contributes one pool member: a function of
  its species' yield value and its level (the level
  #52 emitted as an encounter fact). The species yield
  is a proposed species-record field, `gainYield` —
  canon species data carries no such field today, so
  every value is OPEN and the field itself is a
  proposal into the species record's home. The yield
  function's shape is fixed (yield scaled by level);
  its constants are OPEN — an owner balance pass owns
  every number, as with #17's pipeline constants.
- **Participant classes (closed).** A Ranger-side
  individual is a participant iff it was fielded at any
  point in the battle:
  - `active` — on the field at battle end.
  - `switched` — fielded, then switched out or fainted.
    **Fainting does not forfeit the share:** the
    documented criterion is participation, not
    consciousness at the whistle. A participant who
    fainted earns exactly as a participant who stood.
  - `party-share` — never fielded. Earns **only** if a
    share mechanism covers it: the mechanism (a #31
    held item read through #183, a format rule) is a
    data slot, `shareSource: null` — no mechanism is
    asserted by this spec, and uncovered non-participants
    earn nothing.
- **The split (the system's one law).** The whole pool
  divides among the earning participants by class
  weights: `share = pool × weight(class) / Σ weights`.
  Weights are data (fragment fields, shipped null);
  the classic documented case — equal weights, pool
  split evenly — is what the data expresses when the
  weights are set equal. This spec sets no weights.
  Division is over the whole pool: rounding loss, if
  the implementation floors, is a stated implementation
  fact, never a silent skim — the fragment carries the
  rounding rule as an OPEN slot for the game lane.
- **Outcomes (per #38).** A battle ending in a **keep**
  produces events whose pool holds only opponents
  defeated *before* the keep; the kept individual
  contributes no yield — it was not defeated, it is
  alive in the Garden. An opponent that fled or was
  escaped-from contributes nothing. Opponent-side
  parties earn nothing in this system: AI parties are
  authored encounter data (#52 B2 — their levels are
  authored facts, not grown totals).
- **Formats that produce no events (structural, not
  balance).** #109 versus formats (Ranger-vs-Ranger);
  #86 facility formats including #186's ladder (levels
  are normalised there — the record is the reward);
  #159 rental runs, whose events, if a run's fiction
  needs them, fire **inside the run record only** and
  expire with it (#159's non-writes are untouched:
  no borrowed individual carries gain out of a run).
  In #157 multi formats, participants are the Ranger's
  own fielded individuals; a partner NPC's party is
  authored data and earns nothing here.
- **Hordes (#158).** The interface is unchanged — one
  event per participant; horde size enters only through
  the pool, as more defeated members contributing.

## Show lane

None. The show has no levels and no gain (#129's line);
a show creature grows by story, tutors, and training
grammar (#101/#39), never by arithmetic.

## Wiring

Events append to individual records (roster family,
#80/#106 neighbourhood) as facts; totals derive at
read for #178; consumption is #129's flow, unchanged;
yield reads species data (proposed `gainYield`) and
#52's emitted levels; share mechanisms read #31/#183
when data supplies them.

## Coverage — honest

- **Architecture: fully documented** (yield pool,
  participation, division, exclusions are the standard
  published pattern).
- **Contents: zero numbers.** Every species yield,
  every class weight, the yield function's constants,
  and the rounding rule are OPEN. What is finished is
  the interface #158 demanded: what an event carries,
  who earns, and how the pool divides.

---

**Landing note — List 34 (2026-10-27), citing STAGING step 10.**

Row-6 link check for #336 (`show/production/336-MOD-COMMUNITY-STANDARD.md`), run against this file's landed text at List 34's landing: this file's `party-share` class earns only if a share mechanism covers it, and this file asserts no mechanism (`shareSource: null` — "no mechanism is asserted by this spec"). #336's row 6 therefore converts from conditional to **BUILD** — party-wide share as a switchable #150-class toggle, never forced — per #336's recorded decision. This file's gain shape does not change.
