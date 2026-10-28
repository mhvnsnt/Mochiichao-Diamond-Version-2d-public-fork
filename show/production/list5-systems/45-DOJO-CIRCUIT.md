# #45 — TOURNAMENT ARC STRUCTURES (teardown → dojo-circuit format)

**What was studied.** League/bracket architecture in the
reference games and their anime, as publicly documented: the
game side is a **gated ladder** (a series of themed gatekeepers,
each paying a token of progress; a threshold of tokens opens the
endgame run; the endgame is a *gauntlet* — a fixed sequence with
no healing-gap assumptions — capped by a single champion). The
anime side retells the same ladder as an **arc structure**: each
gatekeeper is an episode (or two) with a theme, a lesson, and a
party built to teach it; losses are structural (the hero loses,
learns the specific thing, returns). Mochiichao's canon already
fixes its ladder's spine; this format writes it once, for both
lanes.

## Canon spine (fixed — from the season canon map, via #11)

Region 1: **8 dojos** (badges = **Fragments**; masters in canon
list order: Lin, Falk, Tetsu, Kenji, Phantom, Shizuku, Homura,
and a Syndicate boss leading the eighth) → **Victory Route** →
**Elite Four** (Umi / Gin / Hono / Yoru) → **Champion Hex** →
post-game Seven Isles. The route graph (#11) holds the geography
and gates; this format holds the *competition structure* laid
over it. Open items stay open exactly as #11 left them: per-dojo
locations, the Aero Dojo's chain slot and master, whether each
dojo hard-gates the next, and the fragment threshold at Victory
Route (8 = flagged structural inference, not canon).

## The circuit format

- **Dojo entry** (one per dojo, data + show shared):
  `{dojoId, masterId, wing/theme, fragmentId, routeNode,
  partyRef, stakes, status}`.
  - `partyRef` — a **rival encounter record** (#37): a dojo
    master is written in the rival grammar (partner/answer/
    coverage/signature/growth-proof/wildcard), which is what
    makes a dojo fight *about* something: the master's
    `signature` slot is their teaching thesis, their `answer`
    slot answers the challenger's previous dojo.
  - `wing/theme` — canon where named (Aero = Wind Wing), OPEN
    where not. The theme is a *rule flavour*, not just a type:
    the dojo's arena condition (a field/weather effect, List-3
    item #47's home when it lands) is part of the entry when
    canon sets one; until then the field is `null`.
  - `fragmentId` — the Fragment this dojo pays. Fragments are
    **derived, never stored** as a count on the player (event/
    flag architecture, #12): holding a Fragment = the dojo-cleared
    flag exists. The circuit reads flags; it keeps no second
    ledger.
- **Thresholds** — Victory Route reads `fragment_count` from the
  flag state (gate kind per #11). The number is the flagged
  inference (8) until the owner rules; the format names the gate,
  it does not hard-code the number anywhere a reader could
  mistake for canon.
- **The gauntlet** — Elite Four as a `sequence_clear` gate (#11):
  four encounter records (#37) in fixed order, one shared
  `stakes` block (`circuit-standing`), and the format rule that
  a gauntlet's records are written as a *set* — each member's
  `answer` slot answers the *previous member's* fight, so the
  run escalates as one composed argument ending at the
  Champion's record. Champion Hex's capstone record is the rival
  chain's terminus (#37 `rematch: null`) — the neighbour from
  the opening, read by diffing every appearance since.
- **Losses are data too.** A dojo attempt writes an event (flag
  namespace #12) whether it clears or not; the *count* of
  attempts is part of the challenger's record, and the show
  lane's arc grammar (below) spends them deliberately. A loss
  never removes a Fragment, never re-locks a route the graph
  had opened, and never costs a kept Mochi — the circuit is a
  ladder of mastery, not a punishment machine (the Garden's
  thesis, applied to competition).

## The show arc grammar (same ladder, told)

- **One dojo, one lesson.** The master's theme = the episode's
  question; the signature slot performs it; the protagonist's
  growth-proof is the *answer they bring back* after a loss.
- **The bracket is a map the audience can hold.** Keeper-tech UI
  (§F1 product line) shows the circuit as Fragments lighting a
  route — the same growth-card visual family as #42's growth
  card and #46's reveal display, so progress, growth, and
  discovery share one graphic language.
- **Tournament ≠ circuit.** A single-elimination tournament (a
  crowd event with a bracket the audience watches fill) is a
  different format from the gated ladder; canon has the ladder.
  If a tournament episode is ever commissioned, it is written as
  a *festival* over this format's encounter records (pairings
  drawn from existing records), not as a second progression
  system. (Format note only — no tournament is asserted to
  exist.)

## Wiring

- Geography/gates: **route graph (#11)**. State: **event flags
  (#12)** — Fragments derived, never stored. Parties: **rival
  grammar (#37)** for every gatekeeper, Elite member, and the
  Champion. Arenas: spawn/habitat classes (#7) flavour each
  dojo's local species accents in show staging; **scale (#43)**
  and **transformation (#42)** grammars stage the fights;
  battle presentation/anatomy variance is #9/#10 territory and
  is consumed, not restated.

## Coverage — honest

- **Architecture: fully documented.** Gated ladder → token
  threshold → fixed gauntlet → single champion is the documented
  league pattern in both its game and anime tellings; the
  loss-as-structure rule is the anime pattern's best-known
  property.
- **Contents: spine canon, details open.** Canon fixes the
  count (8), the masters' list order, four Elite names, the
  Champion, and the Fragment vocabulary. Locations, the Aero
  slot, per-dojo themes beyond Aero's, arena conditions, hard
  gating, and the threshold number are OPEN or flagged
  inference — carried in the data as such, per #11's precedent.
