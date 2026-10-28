# #162 — GROOMING & SPA SERVICES → presentation-class care, and exactly what it may touch

**Doctrine seat:** #132 drew the care-centre boundary:
a centre restores, cures, and rests — it writes **no
care axes, no bond, no honours**. Grooming is the care
that lives outside that boundary's services but inside
its discipline: it is *presentation-class* care. This
spec exists to say, exhaustively, which records a
groomer may touch — because "a spa visit makes your
partner happier and prettier" is exactly the kind of
soft claim that smuggles purchased growth into a
raising game unless someone writes the boundary down.
Here it is written down.

**What was studied.** Grooming/spa services in the
publicly documented raising-game record: salon and
massage services that raise a display condition
(beauty/condition classes) and give a small affection
return, once per day, for a fee. The kit taken: the
service *occasion* (a place, a fee, a per-period
limit), and a display condition distinct from every
growth number. What is NOT taken: any affection or
stat return. In Mochiichao, growth is earned in care
vocabulary by the keeper (#39) and axes move by care
(#28); a purchased service minting either would break
both systems' honesty and #56's no-purchased-power
law in spirit. Grooming here is therefore defined by
its two permitted writes and its explicit non-writes.

## Native spec — grooming as a service record (no new format id; a service class over existing records)

- **Write 1 — the careLog event.** A grooming visit
  appends ONE event to the individual's #28 `careLog`
  in its own shape (`{at, activityId, axis, ...}`):
  `activityId` in a grooming class, **`axis: null`,
  magnitude zero**. The event is a true record — the
  visit happened, the log is the individual's history
  — and it is *inert*: #39's effort accrual reads care
  events by family and a null-axis service event
  belongs to no family; #28's axis read rules never
  see it. If a future system wants to count "was
  groomed" for flavour (a #152 behaviour note, a
  keeper's remark), the event is there to count.
- **Write 2 — the transient presentation state.** A
  groomed individual carries `presentation.groomedUntil`
  — a **proposed** field on the individual record
  (#80's home; proposed, not edited in) holding a #19
  phase id at which the groomed finish lapses.
  Consumers: presentation only — #78's showcase
  staging and show boards may read "freshly groomed"
  as a finish note (coat sheen as *depicted* finish,
  the no-baked-shadow rule's presentation twin: finish
  lives in depiction, not in the asset). Whether #78's
  scoring (itself OPEN-valued) may weigh the state is
  OPEN — this spec grants the read, not the weight.
- **The non-writes, exhaustively:** no care axis (#28),
  no effort family (#39), no bond, no honour stamp
  (#104 — a groomer cannot stamp; if a *contest* win
  follows a groom, the stamp is the contest's, #161),
  no status cure (#27 cures are #132 centres' service —
  a spa is not a clinic), no HP restoration, no dex or
  research fact, no flag of any namespace.
- **The three-way boundary, in one table:**

  | | Garden (#28/#65) | Centre (#132) | Groomer (this spec) |
  |---|---|---|---|
  | writes | axes, careLog, bond via care | nothing stored (restore/cure/rest are state returns) | careLog event (inert) + transient presentation state |
  | costs | keeper's time/care | service data (#118 posture) | currency fee (#20; price = service data) |
  | fiction | home, raising | field infrastructure | a town luxury |

- **Occasion rules.** A groomer is a place record of
  the #132 service-place family (a shop-shaped
  service, #118's stock/price posture: prices stay
  data). Visit limits (per day/phase) are service
  data, values OPEN. The currency's name is inherited
  OPEN from #20 — this spec keys `currency` like
  everything else.

## Show lane

A spa visit on screen is a care vignette — the
creature being brushed is the creature the audience
watches being cared for (#39's one-truth rule,
presentation form). It changes no state the show
tracks; a freshly groomed finish in a later scene is
depicted finish, drawn by the boards, never a system
output.

## Wiring

Service-place home: #132's family + #118's price
posture; writes into #28's careLog shape (event class
added to its activity vocabulary at landing — the
vocabulary is #28's home); proposed field into #80's
record home; readers: #78 (presentation), boards via
#53; currency: #20.

## Coverage — honest

- **Architecture: fully specified** (the two writes,
  the non-write list, the boundary table, occasion
  shape).
- **Instances: zero.** No groomer place, service list,
  price, or visit limit exists; all are content/data
  slots. The `groomedUntil` field is a proposal
  registered in STAGING until #80's home accepts it.
