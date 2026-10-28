# #201 — RANGER REPUTATION SYSTEM → what the world believes, derived

**Seat in the doctrine:** #104 drew the line this
package extends. In #104's own distinction:
predicates are **derived, never stored**; honours
are **stored stamps** on an individual's record —
earned-event facts with provenance. Reputation is a
third shape, and the distinction is the spec:
reputation is derived like a predicate, but its
subject is a **Ranger** and its content is **public
belief** — what the world thinks of them before
they walk into the room.

| | Honours (#104) | Reputation (#201) |
|---|---|---|
| Subject | an individual Mochi | a Ranger |
| Form | stored stamps on the record | derived projection, read-time only |
| Provenance | the earning event | the public facts it is computed from |
| Audience | the record itself (a private fact of a life) | the world — NPC belief before any meeting |
| Spendable | n/a — facts, not currency | **never** — no price, gate, or discount reads it |
| Failure mode | a stamp without provenance | a stored "reputation score" — belief turned currency; forbidden by shape |

**What was studied.** Standing/reputation systems
in the publicly documented record: the durable
lesson is what happens when standing is a *number* —
it becomes a currency and the fiction collapses
into accounting. The kit taken is the inverse:
standing as a qualitative, computed read over public
facts, spendable nowhere, displayed nowhere, real
only in how the world behaves.

## Native spec — `mochiichao/ranger-reputation/v1` (fragment beside this doc)

- **Inputs — exactly these, nothing else.** (1)
  Licence tier: #98's `tier`, itself derived
  standing whose thresholds and names are OPEN.
  (2) Mission service: #164's completion facts,
  plus the service-stamp occasion #164 proposed
  into #104's catalogue (read if and when the
  catalogue accepts it — until then the input is
  the completion facts alone). (3) Public landmark
  facts: #12 flags of public shape — circuit
  completions, the champion fact class
  (#100/#126). Not inputs: wealth, roster size,
  hours played, or anything purchasable — a
  reputation that money can move is a price list.
- **Output: qualitative standing classes, never a
  number.** The derivation maps input facts to a
  class; the class vocabulary itself is a
  presentation slot (OPEN — the design lane words
  the classes). Where an input's own thresholds are
  open, dependent classes inherit the openness:
  #98's tier table is OPEN, so any reputation class
  keyed to tier ships as a rule shape with an empty
  threshold table, stated plainly rather than
  worked around with invented cut-offs.
- **The no-consumer law.** Reputation opens
  nothing. Gates read their own facts: #133's
  trials read licence inputs, #127's connections
  read arrival evidence, #98's case reads identity
  and standing facts of its own. Any system that
  wants reputation as an input must propose it
  **into this file**; until a proposal lands here,
  reputation's only consumers are presentational —
  #93's greeting and scheduling texture, #145's
  travellers carrying word ahead of a person, #172's
  broadcast mentions. The world's mouth, never its
  locks.
- **Show-lane mirror.** Reputation precedes the
  Ranger: an NPC who has heard of someone behaves
  from the belief — warily, warmly, with
  expectations the episode can play against. The
  show never displays a meter, a score, or a title
  card of standing; belief is **played, not
  rendered**, and a character's reputation in a
  scene is exactly what the other characters in it
  believe, which the facts may or may not deserve.

## Wiring (proposed)

A derivation over existing facts — lands as a read
beside #98/#104's homes with no schema of its own.
Reads: #98 tier, #164 service facts, #104 honours
catalogue (stamps, if accepted), #12 public flags.
Writes: nothing, anywhere, by construction.

## Open slots (nothing invented)

The standing-class vocabulary and its thresholds
(owner/design — gated on #98's OPEN tier table) ·
which #12 flags classify as "public shape" (a
per-flag classification recorded on #12's side) ·
the service-stamp occasion's acceptance in #104's
catalogue (that catalogue is the owner's slot) ·
any first consumer beyond presentation (a proposal
into this file, or none — none is a fine answer).

**OWNER RULING — supersession note (2026-10-27, applied at the List 21 landing):** this spec's reputation classes are SUPERSEDED by the owner's new morale/reputation design (List 28, items 267-276): reputation runs on Fallout: New Vegas's model (fame and infamy as separate tracks per group) over a fifty-step ladder, with a personal morale scale on Red Dead Redemption 2's Honor model. The classes in this file stand as a VIEW over that ladder once List 28 lands; they are not the system of record.

**PROPOSAL from List 23 #224 (registered at its landing, 2026-10-27):** the in-world newspaper reads reputation from this system's derivation (a read, never a store — editions live in their own publication store, separate from every record store they report). Proposal until this home accepts the read.


**SUPERSESSION COMPLETED — List 28 #270/#271 (applied at its landing, 2026-10-27):** the OWNER RULING note above is completed here, as it promised: this file's classes now stand as a *view* over #271's ladder and #270's tallies, with the mapping below. No text above is deleted; the file stands as history with its notes on top.

| #201 (this file) | List 28 reading |
|---|---|
| The qualitative standing class (output) | A band range on #271's ladder (steps −25…+25; bands of five per side: 1–5, 6–10, 11–15, 16–20, 21–25; 0 = Unmarked) — a class word names a band, never a stored score |
| A class for a specific group | #270's coordinate: the group's fame band × infamy band (fame and infamy each 0…25, counted separately, never cancelling; the mixed flag prefixes #270's draft word *Two-Storied*) — this file's classes were never worded (the vocabulary slot above stayed OPEN), so the mapping is structural: any class wording keys to a band range + tally shape |
| The input list (licence tier, mission service, public landmark facts) | Replaced as the system of record by #270's witnessed-deed tallies over #269's deed ledger. The old inputs remain public facts other systems read directly; they no longer feed a derivation of this file's own |
| Derived, never stored | **Inherited by #270 verbatim** — morale, reputation tallies, and wanted level are derivations over deeds, reports, and history; no field of the three exists |
| Never currency (no price, gate, or discount reads standing) | **Inherited by #270 verbatim** — where #271's prices read the ladder, they read a derivation over the ledger at read time; there is no stored score to spend |

The no-consumer law above is likewise re-read under the new model: consumers read #270/#271's derivations through those files' own read rules, and any new consumer still proposes its read into the owning file (#270 for tallies, #271 for the ladder).
