# #167 — PERFORMANCE CONTESTS → the coordinator-class institution, over #78's showcase format

**Seat in the doctrine:** three judged/bracketed
institution shapes now exist and must not be merged.
#151's tournament is *battle fixtures in a bracket* —
resolution by battle, stakes are records. #78's Garden
showcase is the *care-register gathering* — Garden-only,
Mochiko hosting, an event format with no institution
around it. A performance contest is the third shape:
**judged performance as a civic institution** —
coordinator-class entrants, a venue, a circuit of
standings — whose events run on #78's format and whose
resolution never touches the battle engine at all. #78
left the door open by name ("whether showcases exist
outside the Garden — canon silent; Garden-only until
ruled"); this spec builds the institution that would
stand outside the Garden *if the owner rules one in*.
It instances none.

**What was studied.** Contest institutions in the
publicly documented record (the coordinator circuit of
the reference anime and the contest halls of its games):
ranked tiers a coordinator climbs across many towns, a
ribbon-class token per win that is *standing*, not
loot, and judging panels whose verdicts are theatre —
the institution's product is reputation. The kit taken:
contest as institution record + event format consumed
from #78 + standing as derived record. No category
names, ribbon designs, or judge characters are copied.

## Native spec — `mochiichao/performance-contest/v1` (fragment beside this doc)

- **The contest record:** `{contestId, name (display,
  #23), venue (placeId #11 / interior #119), tier
  (OPEN vocabulary — ranks are content), entrants[],
  event (a #78-format event), results, honours[]}`.
  The event inside is #78's shape verbatim — GATHERING
  → PRESENT → APPEAL → REACT → RESOLVE, declared axis
  per entrant, combination bonus, repetition decay, and
  #78's architectural constraint inherited whole: **the
  contest engine holds no reference to battle state** —
  no damage, no fainting, no HP, in a contest hall any
  more than in the Garden.
- **By contrast with #151 (the join, stated once):** a
  tournament fixture is an ordinary battle with a
  bracket address, resolved by #18; a contest appeal is
  a performance with an audience address, resolved by
  judges under #78's scoring model. A tournament's
  entrants bring teams; a contest's entrants bring
  *repertoire*. The two institutions share only the
  closed effects list (below) and #104's honours
  catalogue — a contest record is never a fixture, and
  no bracket exists here to put one in.
- **The move repertoire is derived, never listed.** An
  appeal performs a move *as expression* (animscript
  with `target = audience`, #78's proposed extension).
  Which moves an entrant may perform is read from
  **#147's coverage ledger**: a move with no landed
  performance block for the entrant's anatomy is not
  contest-legal for that entrant — the same debt list
  the show reads at board stage, doing duty as the
  contest's move list. A move's contest use is a
  *performance* use: it reads the move's `appeal` value
  (#78's proposed presentation field on the move
  record) and **never alters the move's battle facts** —
  power, accuracy, and effects are battle-lane data the
  contest layer has no write path to. Signature moves
  perform under #131's mapping as expression (Water Orb
  as a held, blooming orb — #78's example — never a
  thrown one).
- **Game lane — scoring is presentation-layer only.**
  The game presents #78's scoring model as judged
  theatre (declared axes, visible reaction beats,
  results as reveal); there is no contest battle to win
  by stats, and no contest outcome writes battle state,
  roster state, or progression. What a contest may
  change is #151's closed list, adopted verbatim:
  **records, honours (#104), and reputation-class
  standing** — contest standing (ribbons held) is a
  device-visible *derived* record, per #14's
  derive-don't-store rule and #78's participation read.
  Participation itself is a fact in the run's #12
  record, in the showcase event namespace #78 named.
- **Show lane — primary.** A contest is choreography:
  an episode (or arc, under #82's conservation —
  entry = exit; a contest arc may add exactly the
  closed list above and nothing permanent besides) built
  on #78's phase grammar as its board unit. Judges and
  rival coordinators are cast, not systems; the phase
  grammar is what the boards consume.

## Open slots (nothing invented)

Whether any contest institution exists in canon at all
(the #78 Garden-only posture stands until the owner
rules) · the tier/rank vocabulary and any circuit
geography · every venue · judge seats and coordinator
cast · the ribbon-equivalent token's design (inherited
OPEN from #78) · per-move `appeal` values (inherited —
#78's proposed field, values owed per move) · whether
contest standing feeds anything beyond itself (a
licence input like #151's is NOT asserted here —
tournaments earned that join; contests have not).
