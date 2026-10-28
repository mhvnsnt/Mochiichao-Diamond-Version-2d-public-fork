# #193 — DAYCARE SERVICE SYSTEM → custody without care writes

**What was studied.** Breeding daycare services in the
publicly documented record: deposit two residents, time
passes, an egg may be found; the classics also grew the
residents' levels by steps walked. The kit taken is the
custody-and-discovery architecture only. **The step-gain
is refused, in writing**: in this programme a daycare is a
service that *keeps*, and keeping is not training — #177's
gain system is never fed by a custody clock. No fees,
cadence numbers, or dialogue are copied.

## Canon anchors (verified in the packages) — including the seat, reconciled

- **#77 seats the day-care in the Garden.** Its egg system
  defines "the Garden day-care where two residents produce
  an egg when compatible", and #106 confirms the housing
  model: egg/unhatched states are "location-legal in
  storage and Garden per #77's day-care housing", and
  `location.kind: garden` is one value of the one location
  field.
- **#132's centres store nobody.** Verbatim: a centre "does
  not store anyone (#106 is storage; a centre visit leaves
  the roster exactly as it arrived)", and its only writes
  are vitality and persistent-status fields. So the
  commissioning brief's "centre-class service" resolves
  honestly: the daycare is a service **place record in
  #132's family by shape**, but its custody lives in the
  Garden housing model #77/#106 already built — never in a
  centre. A town desk may front the service; the residents
  live where #77 put them. This reconciliation is
  registered in STAGING, not smoothed over.
- **#171 is the pair-check, and today it cannot pass.**
  Compatibility is a derived, three-valued read —
  `{compatible, incompatible, unknown}` — and the verified
  state of the data is `eggGroups` **0/47**: "today, no
  breeding pair in the game is evaluable". The daycare is
  specified against that truth, not around it.

## Native spec — `mochiichao/daycare/v1` (fragment beside this doc)

- **Custody events, append-only.** The service's only
  record is `{individualId, depositedBeat, withdrawnBeat,
  pairSeat}` per stay — a service record in the Garden
  day-care's home. Deposit and withdrawal are **#106
  relocations** (the one location field moves
  party ⇄ garden); a daycare sub-seat marker is proposed
  as an additive nullable field in #106's location record,
  landing in #106's file — until accepted there, custody
  reads as Garden residence and the service record carries
  the pairing.
- **The writes, exhaustive.** Custody relocations and the
  service record. Nothing else. **Non-writes, exhaustive:**
  no care axes (#28), no bond, no effort (#39), no gain
  (#177 — no step-gain, no stay-gain, ever), no vitality or
  status changes (that is #132 centres' business, and a
  deposited individual is not a patient), no honours
  (#104), no dex states (#14). A resident comes back
  exactly the individual who was deposited, plus time.
- **Egg discovery rides #77, on #19's clock.** The daycare
  creates no egg record — #77 owns eggs entire. Discovery
  is a read-time derivation in #124's pattern: an egg is
  *found* when (a) #77's production derivation over the
  resident pair says one exists, and (b) a cadence window
  measured on #19's clock (phases since deposit) has
  elapsed. Cadence values are OPEN — no number is invented
  here; the shape (deposit beat + phase cycles) is the
  yield.
- **The compatibility gate, stated plainly.** The pair
  seated together is read through #171's derivation,
  verbatim, three-valued:
  - `compatible` — #77's production may fire (on its own
    derivation, in its own home).
  - `incompatible` — the pair is kept, kindly, and no egg
    is possible; the service says so in #23's words at
    deposit.
  - `unknown` — **custody is accepted and the pair is
    reported as *unevaluated*.** The service never guesses:
    an unknown pair produces no egg and no verdict, because
    unassigned data is not a "no" (#171). Until the data
    lane values `eggGroups`, this is the only state any
    pair can be in — the daycare operates, honestly, in
    waiting mode.

## Show lane

The Garden day-care is Assistant Mochiko's ground — the
Mochi Garden opens at R1-BEAT3 under her keeping. A deposit
in the show is a trust beat: a Ranger leaving a partner in
someone else's care, staged as the relationship it is. The
service record is the game lane's bookkeeping for that
beat; the show keeps the beat and drops the bookkeeping.

## Wiring

Housing: #77 (Garden day-care) + #106 (relocations;
sub-seat proposed into its record). Place shape: #132
family. Pair-check: #171 verbatim. Eggs: #77 only.
Clock: #19 (+ #124's read-time pattern). Cost, if any:
a service slot on #20's economy, `null` per #132's
precedent — the ruling is OPEN.

## Coverage — honest

- **Architecture: fully documented**; the custody/write
  boundary is the load-bearing yield.
- **Contents: zero daycares instanced;** cadence values,
  fees, pair-seat counts, and hosting (which places front
  the service) are OPEN. The compatibility gate is
  specified against a data gap that is real and current.
