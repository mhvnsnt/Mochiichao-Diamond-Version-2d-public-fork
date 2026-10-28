# #197 — ROSTER LOCK & NUMBERING → the canon-lock act, as a registry procedure

**Seat in the doctrine:** everything upstream of this
item is *consideration*. The design lane's discipline
is verified in its own files: wave-1 species carry
`id: null` and all `baseStats` null
(`mochichao-design/COVERAGE-AND-ROADMAP.md`), and the
edge index repeats it on every row — "roster numbers
and stat numbers are assigned together at the owner's
canon lock, never before"
(`world-systems/evolution-edges.wave1.json`). The
sheets are prose-complete and number-free **by
design**. This package defines the lock itself: what
triggers it, what it writes, and what it must never
do. It is a procedure plus a record shape — the act
by which a considered species becomes a canon one.

> **OWNER RULING (Jamar, 2026-10-27 — landed while
> this package was building, incorporated, not
> appended):** species take the **next roster numbers
> as they are locked**, filling the empty roster in
> lock order. Regional order (e.g. R2 #1–6) exists as
> a view (#198) and is **not** the number. The canon
> roster stands at 47; the first locks are **048–053**
> (register below), written into the design-lane data
> the same day. This ruling settles the scheme
> question this package was commissioned under —
> nothing about numbering is left "pending a scheme."

**What was studied.** Registry practice in the
publicly documented collector-franchise record: a
canonical roster grows by *allocation events*, each
event carrying provenance (who authorised, what was
approved, when), numbers allocated sequentially at
the event and never reserved in advance. The kit
taken: the lock as an append-only registry act with
an audit trail — not a bulk edit that rewrites a
data file and loses the moment of decision.

## Native spec — `mochiichao/roster-lock/v1` (fragment beside this doc)

- **Two states, no third.** `considered` (id null,
  stats null — the design-lane draft state) →
  `locked`. A *provisional* number is a number, and
  numbers before lock are the exact failure the
  discipline exists to prevent; the format has no
  provisional state, no reserved ranges, no pencilled
  ids.
- **Trigger.** The owner's recorded design approval
  for the species — the art lane's verdict, verbatim,
  with design-file hashes (the manifest pattern
  already in force for the A1/A2 approvals). A lock
  without a recorded approval is not a lock; it is a
  data error with a number attached.
- **The act writes exactly four things:**
  1. **The roster number** — the next unfilled
     number in the canon roster sequence at the
     moment of the act. Count base: the canon core
     roster, **47**. Allocation is sequential fill —
     no gaps chosen, no numbers skipped by
     preference, no number ever reused.
  2. **Lock order** — the act's position in the lock
     sequence (1st, 2nd, …), recorded beside the
     number. The number is the species' address;
     the order is the allocation's audit trail, and
     the two are kept because they answer different
     questions.
  3. **The stat-block seat** — stat numbers are set
     at the *same act*, by the data lane, into the
     species record (this package defines the seat
     and the simultaneity, never the values; values
     are species-data work, owner-ruled where the
     lane's discipline requires).
  4. **Approval provenance** — the owner verdict
     citation + design file hashes, in the art
     manifest's pattern.
- **First register entries** (owner-assigned
  2026-10-27 under the ruling above):

  | Roster | Species | Lock order | Regional view order |
  |---|---|---|---|
  | 048 | Pupparmor | 1 | R2 #1 |
  | 049 | Shieldane | 2 | R2 #2 |
  | 050 | Bastihound | 3 | R2 #3 |
  | 051 | Flickfin | 4 | R2 #4 |
  | 052 | Pikeperil | 5 | R2 #5 |
  | 053 | Halberdrake | 6 | R2 #6 |

  The regional column is shown **only** to record
  the coincidence: here lock order and regional
  order agree because the owner approved the lines
  in order. The allocation rule is lock order; a
  future species approved out of regional order
  takes the next roster number anyway, and its
  regional position is #198's view business.
- **What the lock never does — the Gen 1 fence.**
  The lock does not reconcile Gen 1's numbering.
  The Sideline A GAP-AUDIT conflict stands adjacent
  and untouched: three schemes are live for Gen 1
  (roster raw ids run 001–046 then `331` for Mythar;
  `species.json` repairs Mythar to `047`; the dex
  registry keeps `331` *and* adds 147/148 for
  Dorowani and Gabu, who carry no core id). The
  count base of 47 is the canon core roster — the
  line `species.json`'s repair represents — and
  counting forward from it does **not** silently
  absorb the dex-layer discrepancies. That
  reconciliation is a separate owner decision,
  registered OPEN below; the landing PR states the
  count base in its body so the choice is never
  buried.
- **Locking ≠ discovering.** The two-axes law
  (owner ruling, same day): roster membership is
  **global** (a locked species is in the roster for
  everyone, from the act onward); visibility is
  **per-Ranger** (discovery state — #198, List 1
  item 3). A lock changes the roster. For any given
  Ranger it changes exactly one thing: a silhouette
  appears (#198). No lock writes any Ranger's facts.
- **The evolution join.** A locked species' edges
  (#8) may gain their trigger values at lock —
  numbers enter the world at the lock act and
  nowhere else (#199). An unlocked species' edges
  keep `trigger: null` however complete its prose.

## Wiring (proposed)

Register home: beside the design-lane data the act
governs (the species-data draft + core roster).
Reads: owner approval records (art manifest),
`species.json` count base. Writes: the lock record
only — roster number, lock order, stat seat,
provenance. Consumers: #198 (membership = locked),
#199 (trigger permission), #14 (registry total
counts locked species).

## Open slots (nothing invented)

The Gen 1 reconciliation entire (331 vs 047;
Dorowani/Gabu core ids — GAP-AUDIT Conflicts 1–2,
owner's) · every future species' number (unknowable
by construction — allocated at its lock) · stat
values at each lock (data-lane work) · whether a
lock can ever be revised (proposed: numbers are
permanent; a revision would be an owner ruling, not
a procedure this package contains).

**Presentation rule (owner numbering ruling, cited by List 22 #207 at its landing, 2026-10-27):** locked-but-undiscovered species appear as SILHOUETTES in the Mochiioteca until discovered. Lock state is global; discovery visibility is per-Ranger — two axes, one derivation (#207/#198), wired separately.
