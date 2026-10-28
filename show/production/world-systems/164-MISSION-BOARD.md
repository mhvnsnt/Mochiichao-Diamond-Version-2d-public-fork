# #164 — MISSION BOARD SYSTEM → repeatable Ranger work, below story rank

**Doctrine seat:** a mission is not a small side
story. #138 defined the side story as an *authored
flag chain with an owner and a resolution* —
`repeatable: false`, unique, narrative. A mission is
the opposite shape: a *repeatable task* taken from a
board or a giver, done for reward, done again later.
Confusing the two corrupts both (stories that repeat
stop meaning anything; tasks that pretend to be
stories inflate the spine). This spec builds the task
class and fences it below story rank, beside #138's
scope law and under it.

**What was studied.** Request/job boards in the
publicly documented record: posted requests from NPCs
(fetch, deliver, escort, survey, help), accepted at a
board or from the giver, tracked as simple state,
rewarded in currency, goods, or standing, and reposted
on a cycle. The kit taken: the template/acceptance
split (the *posting* is a template; each *taking* is
an instance with its own facts), rewards as data, and
reposting on the world clock.

## Native spec — `mochiichao/mission-board/v1` (fragment beside this doc)

- **The template:** `{templateId, giver (NPC id per
  #93, or a board place per #119), taskKind (closed
  vocabulary below), target (ids the task reads —
  an item, a place, a species, a sign class),
  reward (currency amount and/or #31 item ids — as
  data), cooldown (rotation shape, #124/#19 posture),
  scope: "mission"}`.
- **Task kinds (closed):** `deliver` (carry a #31 item
  to a giver/place), `retrieve` (bring a named item
  back), `escort` (travel with an NPC — the NPC's
  movement is #93/#145 machinery, the mission only
  owns the contract), `survey` (produce observations —
  completion writes the same #97 research tally facts
  an encounter would; the mission is a *reason* to
  observe, never a different fact), `assist` (a
  field-help task whose completion is a giver-side
  fact). New kinds are a vocabulary decision in this
  format's home, not per-mission inventions.
- **State derives; no quest log.** Acceptance and
  completion are facts (per template+giver: accepted
  beat, completion count, last-completed beat) in the
  #12 fact discipline — a board's display (available /
  active / cooling down) is a derived view over those
  facts plus the clock, exactly as #138's story state
  derives from beat flags. There is no mission store
  beside the facts.
- **The rank fence (scope law, mission form):** a
  mission never sets a `story.*` spine flag, a dojo/
  circuit `progress.*` flag (#45), or a capstone flag
  (#100); never gates a route (#137 connections do not
  read mission facts — a side story may open a way, a
  chore may not); and never answers a world secret
  (#138's Forest clause applies verbatim). Missions
  enrich and employ; they do not advance.
- **Rewards, under the standing laws:** currency per
  #20 (amounts are data; the name is inherited OPEN);
  items per #31 (ids must resolve); **honours may
  record service** — a #104 stamp occasion for mission
  milestones is proposed to #104's vocabulary (the
  stamps are #104's; this spec mints none). And #56's
  law, verbatim in effect: rewards never buy power —
  no mission reward is a stat, a move, or progress;
  a mission that paid in power would be a shop with
  extra steps and a lie about both.
- **The board as a place and a feed:** a board is an
  interior object (#119) where templates post; its
  *display* may also ride #90's media as a generator
  reading board state — a `mission_board` generator is
  proposed into #90's generator vocabulary (its home
  disposes; until accepted, board display is
  place-only). Display names via #23; a board never
  advertises a mission whose facts make it unavailable
  (the display derives, so it cannot lie).

## Show lane

A mission on screen is an errand beat under #82
conservation (entry = exit plus knowledge and pay);
the board is a recurring set where the town's small
life posts itself. Show missions are authored
episodes, not template instances — the template class
is the game's; the show borrows the *place*.

## Wiring

Facts in #12 discipline; givers #93; board places
#119; escort movement #93/#145; survey facts #97;
rewards #20/#31; honour occasion proposed to #104;
rotation #124/#19; display #90 (proposed generator) +
#23; fence audited against #45/#100/#137 flag sets at
landing as a negative test.

## Coverage — honest

- **Architecture: fully specified** (template/
  acceptance split, kind vocabulary, derived state,
  rank fence, reward laws).
- **Instances: zero.** Every template, giver, target,
  reward figure, and cooldown is content — OPEN. The
  board's locations are unplaced.

**PROPOSAL from List 25 #245 (registered at its landing, 2026-10-27):** field rescues instance under this file's `assist` kind as it stands. An optional dedicated `rescue` kind is proposed here, in this file only, for this home to accept or decline.
