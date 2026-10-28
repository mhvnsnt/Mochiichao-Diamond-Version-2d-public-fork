# #230 — LICENCE DISCIPLINE SYSTEM → consequences when a Ranger breaks the code

**What was studied.** Professional-licence
discipline in the publicly documented record:
regulators work by recorded findings and graduated
sanctions — warn, supervise, suspend — applied to
the *licence*, with the person's livelihood
consequences flowing from the licence's state, and
with the things discipline may never touch (family,
home, animals in their care as *property leverage*)
fenced off in principle. The kit taken: discipline
attaches to the licence and the record, is derived
from documented history, and graduates.

## Canon anchors (verified in the packages)

- **#98 owns the licence.** The licence stores
  identity and standing; #133's trials supply tier
  progression; #189's challenge-mode election
  already established the pattern of a licence-level
  fact rendered by the licence and audited by
  append-only events. Discipline joins that family:
  the licence *renders* a standing the facts derive.
- **#164 + #104 own the underlying history.**
  Mission conduct lives in #164's template/fact
  layer; honours live in #104's stamp catalogue.
  Discipline reads both — a finding must cite facts
  that exist in those records. A discipline record
  that cites no mission or honour fact is
  unrepresentable: the fragment's `grounds[]` is a
  required, non-empty array of references.
- **The bond is not a lever (canon doctrine, stated
  flatly here as system law).** Discipline never
  confiscates Mochi, never restricts a kept Mochi's
  care, and never conditions a sanction's lifting
  on an individual's surrender. A sanction that
  needed a creature as its instrument would be a
  different, crueller system; this one acts on the
  Ranger's *permissions* only (see below), because
  the Mochi are not the Ranger's property and the
  licence is not a leash on them.

## Native spec — `mochiichao/licence-discipline/v1` (fragment beside this doc)

- **The finding record** (append-only, one per
  adjudicated event): `{rangerId, grounds[],
  class, issuedBeat, reviewBeat, status}`. `class`
  is the closed sanction vocabulary:
  - `warning` — recorded; no permission changes;
    the record itself is the consequence, and it is
    visible to the Ranger in full (no secret
    findings — a finding the Ranger cannot read is
    unrepresentable).
  - `supervised` — the Ranger's mission acceptance
    (#164) requires a senior co-sign for a stated
    span; nothing else narrows. Battles, keeping,
    travel, and the Garden are untouched.
  - `suspended` — the licence's *competitive and
    commissioned* permissions pause: no mission
    acceptance, no facility/versus entry under the
    licence's standing, no trial attempts (#133).
    Keeping, care, travel, discovery, and ordinary
    wild encounters are **not** licence permissions
    in this sense and are never suspended — a
    suspended Ranger is a Ranger between
    commissions, not an exile.
- **Standing is derived, never stored as a
  verdict.** Current discipline standing is read
  from the finding records (an active `supervised`
  or `suspended` whose review beat hasn't passed),
  the same way #146's visit record derives
  "visited." Expired findings remain on the record
  permanently — history is append-only (#168's
  discipline) — but they derive nothing once
  reviewed clear.
- **Graduation and thresholds.** Which findings
  ground which class is authored adjudication data
  in the pattern of the reference systems (a single
  grave finding may ground `suspended`; lesser
  findings graduate through repetition) — the
  threshold table is content, per the gap rule
  filled from canon first and the documented
  pattern second when the content lane writes it.
  The class vocabulary itself is closed here and
  does not grow by data.
- **Reinstatement** is a review event of the same
  shape (a finding record whose class is `cleared`,
  citing the findings it closes) — never an edit,
  never a deletion.

## Show lane

A discipline arc is character story under #82: the
record exists in the world (an NPC's remark, a
licence rendered on a device per #238-class
presentation), but the *story* is what the Ranger
does under the sanction. The show stages no
confiscation either — the flat law binds both
lanes, and a script that reaches for a creature as
leverage is a doctrine violation flagged at review.

## Wiring

Finding records in the licence's home beside #98;
grounds read #164 facts + #104 stamps; standing
rendered by #98's licence and consumed by #164
(acceptance gate), #109/#186 (entry standing),
#133 (trial gate). Lands beside 98-RANGER-LICENCE.

## Coverage — honest

- **Architecture: fully specified** — classes,
  derivation, non-confiscation law, reinstatement
  shape.
- **Contents: zero findings instanced;** the
  adjudication threshold table (which grounds earn
  which class) is OPEN content, and no canon
  Ranger carries a finding from this package.


**Landing note — List 28 (2026-10-27):** this file's findings gain a new grounds source: #272's landed reports (272-WITNESSES-WANTED.md) — cited here, not duplicated. #275's redemption reads take their closure facts from this file's findings together with #269's ledger and #270's tallies.
