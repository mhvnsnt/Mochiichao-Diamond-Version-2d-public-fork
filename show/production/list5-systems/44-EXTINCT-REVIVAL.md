# #44 — FOSSIL / EXTINCT REVIVAL SYSTEMS (teardown → native system)

> **Status banner:** the *system shape* below is a teardown
> product, ready to wire. Every story hook in §3 is a **PROPOSAL**
> — drafted material for the owner to rule on, labelled as such
> in-line, and **none of it is canon**. No extinct species is
> named, described, or implied anywhere in this package. Canon
> currently contains no fossil, no extinct species, and no
> revival — this package builds the empty shelf, on purpose.

**What was studied.** Revival systems in the reference games, as
publicly documented: an extinct species exists first as a
**remnant item** (a fossil — data, not a creature), the remnant
is carried to a **place of process** (a lab), a **process with a
cost and a wait** converts remnant → living creature, and the
revived creature registers as itself — same dex slot family as
any species, its *origin* recorded as revival rather than
meeting. The design core is the separation: **remnant ≠ species**.
The fossil is an item with a pointer; the species record is only
written when something lives again.

## The native system shape

- **Remnant record** (item-class data, beside core items when
  the item system lands): `{remnantId, pointsTo: speciesId|null,
  originArea, status}`. `pointsTo` is `null` until the species
  record exists — a remnant whose species has not been authored
  is a legal, honest state (a mystery in a drawer), and tooling
  must never resolve the pointer by inventing the species.
- **Species record**: an extinct species is authored exactly
  like any other — data first (Gate 0 → sheet → design), per the
  intake template. What differs is its *discovery family*:
  `discovery.origin = "revival"` alongside the wild/kept
  families, and its natural-history block carries
  `extinctInWild: true` — which the spawn system (#7) reads as
  an absolute rule: **extinct species never appear in wild spawn
  tables**. An extinct Mochi is met in the present only through
  revival, gift, or story event — each recorded as its own
  capture/bond record type (#38: scripted or special, never a
  wild roll).
- **The process**: place + cost + wait, all three as data fields
  on the revival *method* record — and all three **OPEN**. The
  one structural ruling this package does make: the place of
  process in Mochiichao's world can only be **Aeon's lab**
  (the world's one established laboratory; see #46). Any other
  site would be new canon, and new canon is the owner's.
- **Completion treatment (#14):** a revival-origin species counts
  toward the registry total only once its species record exists
  and is named into the registry (the same named-only rule as
  mythicals, #41). A drawer of remnants inflates nothing.
- **Two-lane treatment:** in the game lane, revival is a system.
  In the show lane, a revival is a *lab arc* (#46 format): the
  process is dramatised as care and patience (the Garden's
  grammar), never as a machine montage with computer tells
  (THE SECRET display law applies to the lab's fiction and UI).

## §3 — Story hooks (ALL PROPOSALS — NOT CANON)

Each hook is a pitch for owner ruling. None is referenced by any
other file in this package as fact.

- **PROPOSAL H1 — The Forest's stillness has a fossil layer.**
  The Dark Forest depths, where things stopped moving, are where
  the world's oldest remnants rest. Would give the revival
  system a native origin area and tie the show's central mystery
  to the game's archaeology. *Touches an owner-locked open
  question (DESIGN-BRIEF §8 item 7: what stopped moving) — this
  hook proposes one possible shape of an answer; it does not
  answer it.*
- **PROPOSAL H2 — The Manual has a missing page.** A numbered
  Manual rule gap (rules beyond Rule 12 are owner-locked,
  DESIGN-BRIEF §8 item 10) that, when drafted and locked, turns
  out to be the revival rite written as a care instruction —
  revival framed as the Garden's oldest duty, not the lab's
  newest trick.
- **PROPOSAL H3 — A remnant arrives before its species does.**
  Season shape: a remnant is found and carried for episodes
  while `pointsTo` stays null in-world — the Mochiioteca shows
  an empty slot the shape of a question. The species is authored
  (data-first) only when the owner locks the reveal.
- **PROPOSAL H4 — Revived ≠ returned.** The revived individual
  is a *new* individual of an old species (the individual-record
  system, #37/#39, already distinguishes species from
  individual). A show beat the system makes possible: the Garden
  must learn to care for a creature whose world is gone — the
  care loop as the answer to extinction, in the show's thesis
  (Rule 12) rather than in exposition.

## Wiring

- Data: remnant records (item class), species records with
  `discovery.origin = "revival"` (intake template field family),
  spawn tables (#7 — exclusion rule), capture records (#38 —
  non-wild bond types), completion (#14 — named-only counting),
  lab format (#46 — the process dramatised), mythical grammar
  (#41 — an extinct species is *not* automatically mythical;
  the axes are independent and the sheet keeps them separate).

## Coverage — honest

- **Architecture: fully documented.** Remnant → place → process
  → living registration is the documented revival pattern, and
  the remnant/species separation is its load-bearing idea.
- **Contents: none, deliberately.** Canon has no extinct
  species, no remnant item, no revival cost, and no ruling that
  revival exists in this world at all. The system ships as an
  unpopulated shelf plus labelled proposals. If the owner rules
  revival out of the world, the correct outcome is to delete
  this file in the landing PR — the wiring above is written so
  that nothing else in Lists 1–5 depends on it.
