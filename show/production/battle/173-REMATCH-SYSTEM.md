# #173 — REMATCH SYSTEM → the derivation layer over #87's rematch records

**Seat in the doctrine:** #87 built the per-Ranger
rematch **record** — `{ranger_id, first_defeat_flag,
rungs[], repeat_rung, gate}` — rungs as team references,
the gate slot shipped empty, zero instances asserted,
and #100 already seats the gauntlet's rematches as #87
records. What neither built is the **system**: where
rematch records come from across the whole circuit,
and when a rematch is *available*. #173 is that layer.
The record's home stays #87; the derivation's home is
here — one system, two files, no duplicated shape.

**What was studied.** Rematch availability in the
publicly documented record, beyond #87's ladder: the
later systems' lesson is that availability is a
*condition read*, not a stored unlock — the opponent
is re-challengeable when the world's facts say so
(progress made, time turned, the opponent present),
and the re-fight is a new encounter whose result joins
the record without rewriting the first one. The kit
taken: derivation over fixture history + availability
as a read-time projection. No rematch tables, teams,
or devices are copied.

## Native spec — rematch derivation + availability over #87

- **Records are derived from completed fixtures.** A
  rematch record exists for an opponent iff a completed
  fixture exists: a #30 encounter record with a
  recorded defeat outcome, from any fixture source —
  the dojo circuit (#45), the gauntlet (#100), rival
  appearances (#37), tournament fixtures (#151). The
  derived record is #87's shape exactly, with
  `first_defeat_flag` read from the #12 flag the
  fixture's completion already set — #87's rule,
  inherited: the rematch system never stores its own
  copy of "beaten." An opponent with no completed
  fixture has **no** rematch record: the derivation
  returns nothing, not a locked entry (a greyed-out
  rematch slot would be the system claiming knowledge
  of a fight that hasn't happened).
- **Availability is a read-time projection** (#124's
  pattern, adopted verbatim in discipline): 
  `available(opponent, now) = record exists ∧ gate
  reads true`. The gate is #87's OPEN slot; #173
  defines the gate's **inputs**, not its values:
  - *story standing* — derived #12 state (e.g.,
    gauntlet members become re-challengeable only in
    the post-capstone standing, per #100's seating);
  - *rotation windows* — #124 entries, when the
    calendar is ruled, may make a rematch a fixture
    that comes around;
  - *presence* — the opponent is where their #93
    schedule puts them: a rematch is offered in person,
    or not at all, until a device/facility gate is
    ruled into #87's slot.
  Availability is computed when asked and stored
  nowhere; having *been* available leaves no trace.
  Having **fought** one is a fact — see effects.
- **Effects — the closed list.** A fought rematch
  writes exactly two things: (a) a **result fact** —
  the rematch is a new encounter record in #30's
  wrapper with the rematch as its context (#151's
  fixture discipline), appended to the fixture history;
  the original fixture's record is never edited; and
  (b) **honours** where #104's catalogue defines them.
  **A rematch never re-opens a closed story flag.** The
  first-defeat flag stays set; circuit completion (#45)
  and the capstone state (`story.champion_defeated`,
  #100) are historical and monotonic. A rematch *loss*
  un-defeats nobody, costs no Fragment, re-locks no
  route — #100's loss ethic, generalised from the
  gauntlet to every fixture. A rematch is the world
  acknowledging mastery, never re-litigating it.
- **Leader rematch teams are data slots, OPEN.** A
  dojo leader's rematch strength is `rungs[]` on their
  #87-shaped record — team **references** (#37 party
  records), authored by the data lane, never generated
  (#87/#94 discipline: organic Rangers' parties are
  authored; generation is for facilities). **Zero rung
  contents are asserted** for any leader, for Umi /
  Gin / Hono / Yoru, or for Hex — Hex's champion
  rematch remains undecided, exactly as #87's canon
  note left it.
- **Show lane:** a rematch in-show is a story beat — a
  return, a rivalry renewed, a debt of honour — staged
  as choreography and character, never as a system
  invocation. Whether the show ever stages a Hex
  rematch is a canon decision; this derivation has no
  opinion it is entitled to.

## Open slots (nothing invented)

The gate's values, entire (inherited #87 — device,
facility, standing thresholds) · every rung's contents
for every opponent · rematch housing in the postgame
structure (#66 isles / #86 facilities — inherited
unconfirmed from #87) · whether rivals take
rotation-window availability or standing availability
(a per-class gate input choice, owner's) · honours
occasions for rematch results (#104 catalogue slot).
