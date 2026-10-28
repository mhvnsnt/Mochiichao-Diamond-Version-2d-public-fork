# #241 — FOLLOWER RULES IN TOWNS & INTERIORS → where your partner may be out, and where it waits

**The gap this fills.** The follower system (#58) is a
state machine — FOLLOW, CATCHUP, IDLE, REACT, PARKED —
and one of its doors is already named: PARKED is
entered at "interiors with a park rule". What no
package has written is the rule itself: which places
have one. This spec writes it, as data on the places
themselves, so a town or a dojo or a shrine can each say
what it allows — and so the follower is never silently
vanishing because a map forgot to say.

**How Pokémon fills the same gap:** in the games with
followers, your partner walks behind you through nearly
everything — towns, routes, most buildings — and the
exceptions are handled as part of the place, not as a
punishment: the creature waits, and the game shows you
it waiting. Mochiichao keeps that shape and makes the
exception a written property of the interior, not an
accident of the map.

## Native spec — `mochiichao/follower-rules/v1` (fragment beside this doc)

- **The rule is a field on the interior record**
  (#119's record, in #119's home): `followerRule ∈
  {welcome, park, barred}`, read when the Ranger
  crosses the interior's threshold (#11's typed link).
  - **`welcome`** — the follower comes in and follows
    as usual (#58's states run indoors; distance bands
    read tight in small rooms, a presentation matter).
  - **`park`** — the follower waits at a marked spot
    inside or at the door: #58's PARKED state, entered
    on crossing, left on exit. The spot is part of the
    interior's layout data (#119 rooms).
  - **`barred`** — the follower cannot enter and waits
    outside the threshold — used sparingly, and only
    where the place's own canon says so (a rite in
    progress, a sterile room). The wait is still shown:
    outside is a place too, and the follower idles
    there in view of the door.
- **The default is `welcome`.** An interior record that
  doesn't say is a welcoming interior. Exceptions must
  be written to exist — the same direction as #58's
  `eligible: false` being a real value that must be set,
  never presumed.
- **Putting the follower away is a beat, not a state
  change.** Crossing into a `park` or `barred` interior
  writes **nothing** about the individual: no location
  change (#106 is untouched — the follower is still
  *with* the Ranger in every record that matters), no
  flag, no progress fact. What plays is a small
  presentation beat — the follower settles at its spot,
  a glance back — the xsheet-level moment #58's staging
  already carries. Coming out reverses the beat. The
  individual's record cannot tell you which interiors
  it has waited outside; that is by design — waiting is
  not biography.
- **The Garden is always `welcome`.** Stated flatly, as
  the brief directs and as #58 already implies: at the
  Garden the follower is PARKED **under the care
  loop's ownership** (#65) — parked as a resident, not
  excluded as a guest. No Garden record may carry
  `park`-as-exclusion or `barred`; the care loop's
  PARKED is the Garden's own welcome, and landing
  treats any other value on a Garden seat as a data
  error.
- **Towns (outdoor town areas) are routes for this
  rule:** the follower follows in town streets by #58's
  default; the rule bites only at interior thresholds.
  A town may mark a *plaza* rite or a festival moment
  (#105's windows) that parks followers in an outdoor
  area — that is an area-level rule written on the
  area record (#7's home), same vocabulary, same
  beat-not-a-state-change law.
- **The Dark Forest.** The depths take no interiors
  (#119), so no interior rule exists there; the
  follower in the depths is #58's existing case (a
  partner is a principal and may be present, reacting
  by closing distance and going quiet). Nothing in
  this spec adds a depths rule.

## Show lane

Indoor scenes cast followers deliberately (#82's
staging): whether the partner is in the room is a
board decision the episode makes on purpose — and the
game's data agrees with the board when both are read
from the same interior record. A show scene that parks
a follower the game would welcome is not an error; it
is a character choosing to wait — but a scene that
needs a follower *barred* somewhere the record says
`welcome` has found a canon question, and it goes to
the content lane, not the storyboard's convenience.

## Wiring

The field is proposed into #119's interior record (its
home decides; STAGING step 5). Reads at runtime: #58
(state machine), #11 (threshold links), #7 (area-level
rules). Writes: nothing — no record of any individual
changes.

## Open slots

Which real interiors carry `park` or `barred` is world
content — decided place by place as interiors are
authored (#119 instances none yet). That is content
data, not a parked mechanic: the vocabulary, the
default, and the Garden law are all fixed here.

## Coverage — honest

- Rule-as-place-data + default-welcome + visible
  waiting: the documented follower shape, completed
  against #58's verified PARKED door and #119's
  verified record.
- Contents: zero interiors carry a rule yet, because
  zero interiors are instanced (#119) — the field
  lands ahead of the places, deliberately.
