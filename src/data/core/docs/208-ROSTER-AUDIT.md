# #208 — ROSTER AUDIT & GAP REPORT → the roster, read honestly

**Doctrine seat:** #197 founded the canon-lock act —
roster numbers and stat numbers are assigned together
at the owner's lock, never before — and the owner's
numbering ruling (2026-10-27) fixed the order: next
number at lock, filling the empty roster in lock
order. A system that assigns numbers by acts over
time needs an instrument that reads the result back
without touching it. That instrument is this audit.
It is the roster-side sibling of #14's completion
loop (counts derived from states, computed at read)
and it obeys the same law as every derivation in this
programme: **the audit assigns nothing, edits
nothing, and stores nothing** — it is a report, run
on demand, whose findings are facts about the roster
as it stands.

**What was studied.** Registry/audit practice in the
public record and this programme's own derived-report
precedents (#14's counts, #98's derived licence
standing, List 17 #161's derived size records): a
report whose every line traces to a stored fact in
someone else's home, regenerated rather than
maintained, and safe to re-run at any time because it
has no write path.

## Native spec — `mochiichao/roster-audit/v1` (fragment beside this doc)

- **Inputs (all read, none written).** (1) The
  species records — design-lane draft data today
  (`species-data-draft.json`: `id` null until lock,
  lock provenance text on the record at lock —
  verified in the workspace for the first six locks),
  repo species data at landing. (2) #197's lock
  records / provenance — the lock order history is
  read from provenance, never from a separate log
  this audit keeps. (3) #14's registry entry count —
  the denominator every completion figure uses.
- **Report contents** (each line a derivation):
  - **Locked register** — every assigned number, in
    number order, with species and lock provenance
    (who locked it, when, on what approval). Today:
    048–053, the A1/A2 lines, in lock order.
  - **Null register** — every considered species
    still holding `id: null`, grouped by wave/region
    as its data groups it. This is the lock queue,
    read — not a promise about order.
  - **Gap findings** — numbers in the assigned range
    with no species (a skip), and assigned numbers
    whose provenance is missing or inconsistent.
    Under next-number-at-lock, a gap is always a
    *finding* — either an un-locked concept was
    numbered out of order (a process error) or a
    record is incomplete. The audit reports it; the
    owner/data lane disposes. The audit never fills
    a gap.
  - **Stat-number state** — per locked species,
    whether its stat numbers are assigned. Reported
    as a state, never filled: at first lock, stat
    numbers remained **unassigned, flagged not
    resolved** (owner/game-design class — the
    provenance text on 048's record says so
    verbatim). The audit keeps that flag visible
    until the data says otherwise.
  - **Discovery-presentation readiness** — per locked
    species, whether a marked-CURRENT design of
    record exists for #207's silhouette derivation.
    A locked species with no current design is a
    readiness finding (it has a number and no
    silhouette), surfaced here because #207 cannot
    surface it itself.
- **Consumers.** *Landing checks:* a PR claiming a
  lock, a number, or a roster change is checked
  against a fresh audit run — the audit is the
  second reader the wiring law wants. *Design lane:*
  the null register is the honest answer to "what
  remains unlocked." *Owner:* the gap findings are
  the roster's open questions, in one place.
- **The promo proposal (proposed into #156's
  home).** An unnumbered species cannot headline a
  promo. Rationale, stated for #156's owner file to
  accept or decline: #156's currency gate already
  requires every promo shot to cite a registry piece
  and its marked-current version; a species with no
  roster number has no registry piece of record, so
  a headline billing for it cannot pass the gate's
  own logic. Silhouette-teaser use (the #207 asset,
  unnamed, unnumbered) is a different act and is not
  barred by this proposal. Until #156's home accepts
  the sentence, it is a proposal, not a rule.

## Cadence

Run at every lock act, at every landing that touches
roster data, and on demand. A run is cheap because
it is a read; a stale audit is never cited (the
report carries its run inputs' state on its face).

## Show lane

None. The audit is a production/data instrument.
(What the show may *show* of the roster is #207's
derivation and #198's views, not this report.)

## Wiring

Reads the species records + #197 provenance + #14's
registry count; the promo proposal lands only as an
edit in #156's file citing this package (proposal
discipline); the report shape joins the landing
checklist beside List 19's step-1 index work.

## Coverage — honest

- **Architecture: fully specified** over verified
  inputs — the draft data's lock provenance was read
  directly at build (ids 048/049 present with full
  provenance text; the six-lock set per the owner
  ruling recorded in MEMORY).
- **Contents: six locks.** The register sections for
  waves not yet locked are derivations over null
  ids — correct, and expected to stay mostly null
  until lock acts accumulate.

## Open slots (nothing invented)

The audit's repo home and run mechanism (landing
chooses; the workspace evidence is design-lane data,
its repo seat is UNVERIFIED — see STAGING) · the
disposition of any gap finding (owner/data lane,
always) · stat-number assignment itself (owner /
game-design class, inherited from #197 — reported,
never resolved, here).
