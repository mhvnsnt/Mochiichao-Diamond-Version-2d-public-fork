# #151 — TOURNAMENT SYSTEM → the league-conference form, for both lanes

**Seat in the doctrine:** the dojo circuit (#45) is a
journey; a tournament is the opposite shape — everybody
in one place, a bracket, a weekend. Canon gives the
world a league (Elite Four, Champion Hex, #100's
gauntlet) but no tournament form yet. This spec builds
the form so that when a tournament is wanted — a game
event, a show arc — it doesn't have to be invented
twice, and so its two lanes stay honest: the game runs
brackets; the show runs an arc; both are the same
tournament seen from their own mediums (two-lane
doctrine).

**What was studied.** Tournament structure in the
publicly documented record: single-elimination brackets
with seeding, the anime league-conference pattern (named
rounds, featured matches, off-bracket episodes between),
and the design constraint that a tournament's stakes are
*records and recognition*, not world state — the world
is the same after the final as before it, except that
everyone knows who won. The kit taken: one bracket/record
core for the game, one arc grammar for the show, joined
at the fixture list.

## Native spec — `mochiichao/tournament/v1` (fragment beside this doc)

- **The tournament record:** `{tournamentId, name
  (display, #23), host (placeId, #11), rounds[],
  entrants[], fixtures[], honours[]}`. Entrants are
  Ranger records (player or authored NPCs — named
  Rangers are authored, #94); fixtures are encounter
  records in #30's wrapper with the tournament as their
  context, so a fixture battle is an ordinary battle
  with a bracket address.
- **Rounds are named, not numbered, in display.** The
  bracket structure (seeding rule, byes, round count
  from entrant count) is mechanical and derived; the
  round *names* are display-layer content set per
  tournament (OPEN — no canonical tournament exists yet
  to copy them from).
- **What a tournament may change — the closed list:**
  records (results, standings), honours (#104 stamps for
  placement/champion, defined in #104's catalogue when
  the owner builds it), and licence standings inputs
  (#98/#133 read results as facts). **Nothing else.**
  No flags gating the world, no roster changes, no item
  economy effects beyond authored prizes recorded as
  ordinary acquisitions. A tournament that unlocks a
  region would be doing #127's job with the wrong tool —
  progression-kind connections stay progression-kind.
- **Game lane:** the player enters a bracket; unplayed
  fixtures resolve by the opponent AI (#18) at the
  entrants' authored strength — results are facts once
  played/simulated and are written once (the gauntlet's
  append-only discipline, #100/#126, applied to a
  bracket). Rematches follow #87.
- **Show lane:** a tournament arc under #82's
  conservation — the protagonist's team, moves, and
  items exit the arc as they entered; what the arc may
  permanently add is exactly the game list: records,
  honours, reputation. Featured fixtures get #64's
  boss-intro grammar at the late rounds; the bracket's
  off-stage rounds are where #82's character beats live
  (the conference pattern: the tournament is the spine,
  the episodes are between the matches).

## Open slots (nothing invented)

Whether any canonical tournament exists, where, and its
name · entrant counts and seeding rule values · prize
fiction · the honours catalogue entries for placement
(#104's owner slot) · show arc length and which fixtures
are featured · any Syndicate interest in a tournament
(#99's motives are OPEN and stay so here).

**Validation fence (List 24 #236, landing 2026-10-27):** sport records (236-MOCHI-SPORTS.md) cite this file's results grammar, and the fence runs both ways: a sport record carrying battle terms fails validation. Sport is not battle; a tournament is not a race.
