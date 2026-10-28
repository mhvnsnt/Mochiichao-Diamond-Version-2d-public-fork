# #221 — RANGER MENTORSHIP SYSTEM → the senior hand, recorded

**Seat in the doctrine:** Rangers in this world hold
licences (#98), earn reputation (#201), travel
(#145), and trade and gift (#168/#217) — but nothing
founded the **relationship** by which a senior Ranger
raises a junior one. Mentorship is that relationship,
and this spec founds it as what it is: a record of a
standing between two Rangers, with edges into the
systems it touches — and hard limits where another's
agency begins.

**What was studied.** Mentorship structures in the
publicly documented record: the pairing (one senior,
one junior, a recognised start), the obligations that
flow downhill (teaching, introduction, example) and
the respect that flows up; graduation as a change of
state, not a deletion — the relationship's history
persists after its active form ends; the bright line
every healthy mentorship keeps: a mentor guides a
person, and never wields the person's own partners.
The kit taken: the pairing record, the state arc
(active → graduated, history kept), gift as the
mentor's one material instrument, and the agency
limit as law.

## Native spec — `mochiichao/mentorship/v1`

- **The record.** A mentorship is a relationship
  record between two Ranger refs:

  ```
  { mentor, mentee, beganBeat (#12 ref),
    state: active | graduated,
    graduatedBeat: <beat | null> }
  ```

  It lives with the social records (#93's family —
  the NPC/relationship neighbourhood #145 reads), not
  on either Ranger's licence: a licence (#98) is
  identity and tier only, and mentorship is neither.
  One mentor may hold several mentees; a mentee holds
  one active mentorship at a time (a second pairing
  while one is active is a data conflict, resolved by
  graduation or by never having begun — the record
  does not express mentorship shopping).
- **What flows through it.** **Reputation (#201):** a
  mentorship is one of reputation's legible sources —
  who taught you, and whom you taught, are public
  facts the derived standing can read (the read is
  #201's; this package supplies the record it reads.
  #201's own package was not in the workspace at
  build time — this join is registered UNVERIFIED in
  STAGING). **Gifts (#217):** a mentor may gift a
  mentee an individual — the classic first-partner-outside-
  the-programme — and it stamps exactly as any gift
  does; mentorship adds no special transfer rules and
  no obligation to accept. **Continuity (#145):** a
  mentor who travels stays the mentor; the pairing
  reads across regions without a per-region fork
  (#146's discipline), and a travelling mentor's
  absences are #145 facts, not mentorship state.
- **The agency limit — the load-bearing rule.** A
  mentor may teach, demonstrate, advise, and gift.
  A mentor **may never command a mentee's Mochi** —
  not in battle, not in training, not "for their own
  good." Command authority over an individual belongs
  to their keeper alone (and in the show, under the
  autonomous-action doctrine, even the keeper's
  command is a request the creature answers). The
  format expresses this negatively: no field of the
  mentorship record grants, delegates, or lends
  command of any individual; a system that needs a
  borrowed-commander shape will not find one here.
- **Graduation.** The active state ends by graduation
  (a recognised beat — its ceremony, if any, is
  content, OPEN) or it does not end: an ungraduated
  mentorship is a standing fact, not a failure state.
  Graduation rewrites `state` and stamps the beat;
  the record is **never deleted** — a graduated
  mentorship is a permanent part of both Rangers'
  histories, and #201 may read it forever.
- **Show lane.** Mentorship is a **season-spanning
  relationship** in the show: it is exactly the kind
  of standing #82's continuity carries across arcs
  (entry state ≠ exit state is named by the
  relationship's own beats, not smuggled). The agency
  limit is a character law on screen: a mentor who
  reaches for command of a mentee's partner has done
  something the story must treat as a violation —
  which is to say, the limit exists so drama can lean
  on it, never so scripts can ignore it.

## Open slots (nothing invented)

Who may mentor (tier floor on #98? a reputation
threshold on #201? — eligibility is a policy slot,
OPEN) · graduation's ceremony and criteria · whether
mentorship carries any #104 occasion (proposal into
#104's home) · canon mentor/mentee pairings (casting —
none asserted).

## Coverage — honest

- **Architecture: documented** — pairing record,
  state arc, gift/reputation/continuity joins, agency
  limit as a negative-space law.
- **Contents: zero pairings.** The yield is the
  relationship's shape: a senior hand that can give,
  teach, and vouch — and can never reach the mentee's
  team.
