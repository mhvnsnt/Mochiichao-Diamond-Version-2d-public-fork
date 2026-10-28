# #292 — THE LONG CLIMB & TOWER CIRCUITS → the ladder grows up (Mt. Battle native)

**Doctrine seat:** #186 founded the facility ladder:
an endless run that ends at the first loss, recorded
in one append-only line, costing nothing else. The
documented Colosseum design is the same instinct at
campaign scale: a **hundred-battle climb in zones of
ten**, a tower of circuits — progress that *persists
between sessions*, pays in a facility currency, and
is measured in weeks of a player's life, not one
sitting. This package grows #186 into that form. It
does not replace it: **the ladder is a run; the
climb is a campaign.** That sentence is the spec's
spine and the stated difference landing must keep.

**What was studied.** The documented record: a climb
of 100 consecutive battle seats arranged as 10 zones
of 10, each zone closing with a zone leader; coupons
earned per seat and per zone, exchangeable for prizes
at the facility; the climb resumable between sessions
from the last zone boundary (a loss inside a zone
restarts *the zone*, not the climb); tower/colosseum
circuits as the parallel form — fixed circuits of
seats with their own entry classes and prize tables.
The kit taken: zoning, persistence, coupons, zone
restart. Every name, place, and table is native.

## Native spec — `mochiichao/long-climb/v1` (fragment beside this doc)

- **The climb record** (stored, append-only family
  beside #186's run history — stored for the same
  reason #287's gauge is stored: a campaign spans
  saves, and its facts are evidence): `{ climbId,
  facilityId, zoneReached, seatInZone, couponsEarned
  (derived at read from seat facts), state:
  active | cleared | retired }`. Best marks and
  completion derive at read (#14's law) from the
  seat-fact history, never from a stored summary.
- **Zoning.** A climb is `zones × seatsPerZone`
  (the documented shape is 10 × 10 = 100; the numbers
  are facility data, authored per climb — a shorter
  tower circuit is the same record with smaller
  data). Opposition per seat comes from #94's
  contract exactly as #186's rungs do — **banded,
  authored, never reading the visitor** (#52 B1/B2
  verbatim) — with zone bands stepping at zone
  boundaries and a **zone leader** seat closing each
  zone (a generated party at band-top by default; a
  named leader is a casting/canon decision, #186's
  HEAD slot inherited, none asserted).
- **Persistence — the difference from #186.**
  - A #186 run lives and dies in one attempt; **a
    climb's zone progress persists between sessions**
    (the save carries the climb record; #96's payload
    discipline — absent = no climb started).
  - **A loss inside a zone restarts that zone** at
    seat 1 with coupons for that zone's seats
    forfeited (zone-completion coupons already banked
    stand). The climb itself never resets short of
    the Ranger retiring it (a recorded act).
  - Withdrawal between zones is free and
    consequence-less beyond the record — you can
    walk away from a mountain for a year of story
    and come back. That patience is the format's
    identity.
- **Coupons.** Seats and zone completions pay a
  facility currency (coupons — the *class*; the
  currency's display name rides the standing
  currency-name question and is not coined here).
  Coupons exchange at the facility for prize data
  (#31-class items and #104-class honours — prize
  tables are facility content). **Coupons buy
  nothing outside their facility family** and are
  never convertible to the world currency: a climb
  is its own economy so its rewards can be generous
  without touching #20's faucets.
- **Gain.** As #186: climb battles produce **no
  #177 gain events** (levels normalised per #86);
  the rewards are coupons, records, and honours.
  A climb is where a Ranger brings a finished team,
  not where they build one.
- **Tower circuits** are the climb record's second
  form: `circuit` data (a fixed seat list, an entry
  class — e.g. level band or species class per #86's
  format slots), cleared circuits recorded once each
  with re-runs paying reduced coupons (values data).
  Whether any canon facility hosts a climb or a
  circuit — names, places, which isle — is **owner
  content**, inherited from #86's open register;
  this package instances no facility.

## Show lane

None as system (#186's line stands: facilities are
game systems). A show climb is an authored arc —
the *shape* is available to #82 (ten zones is a
season skeleton, and the writers may notice that),
but no episode reads climb records.

## Wiring

Climb records seat beside #186's run history under
#96's save discipline; generation is #94 verbatim;
normalisation and format slots read #86; coupons
fence against #20; prizes read #31/#104. STAGING
carries the steps.

## Coverage — honest

- **Architecture: fully specified** — zoning,
  persistence, zone-restart, coupons, circuits, and
  the one-sentence difference from #186, kept sharp.
- **Contents: no facility, no zones, no prize
  tables.** Hosts and names are owner content
  (#86's register). The yield is the programme's
  first *campaign-scale* facility form: a mountain
  that waits for you.
