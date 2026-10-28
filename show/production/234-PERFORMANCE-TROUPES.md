# #234 — PERFORMANCE TROUPES → travelling performance troupes as show institutions (SHOW lane)

**What was studied.** Travelling troupes in the
publicly documented record — circus, theatre, and
festival companies that arrive in a town, perform,
and move on, leaving the town's memory of the night
behind them — and the coordinator/performance
institutions of the reference fiction, where a
performance is a creature's repertoire shown at its
best rather than a battle by other means. The kit
taken: a troupe is an institution with a route, a
repertoire, and a company — it *performs*; competing
is a different verb, done by different paperwork.

## Canon anchors (verified in the packages)

- **#167 owns contests.** Contest grammar —
  judged performance under competition rules —
  exists there, with repertoire derived from #147's
  ledger. A troupe stands next to that system, not
  inside it: **a troupe performs; it does not
  compete unless entered.** Entry is an act (a
  #167 registration, by the troupe's human lead, on
  the record) that borrows #167's grammar for one
  occasion; troupe-ness itself confers no standing,
  no seeding, and no judging relationship.
- **#147 owns repertoire.** What a Mochi can
  perform is read from the same coverage ledger
  that counts battle performances — a move's
  performance use exists only where the ledger
  shows the performance scripted for that anatomy
  (#167's rule, inherited verbatim). A troupe
  Mochi's programme is therefore a *view* over
  #147, never a second repertoire list that could
  drift from it.
- **#82 owns the arc.** A troupe's arrival,
  performance night, and departure is a classic
  three-beat guest institution under arc planning,
  under the same conservation checklist: the town
  exits as it entered, plus a memory (and any
  authored exceptions the checklist processes
  openly).

## Native spec — `mochiichao/performance-troupe/v1` (fragment beside this doc)

- **The troupe record** (show production-side):
  `{troupeId, name, route[], company{humans[],
  mochi[]}, repertoireView, status}`. `route[]`
  names #7/#119 places in visit order — a troupe
  exists on the world's map, arriving by the same
  roads as anyone (#141 ferries included), never
  by narrative teleport. `repertoireView` is a
  stored *reference* to the #147 view, not a copy
  of its contents.
- **The company rule (no invented people).** Human
  troupe members are **cast**: every human seat in
  `company.humans[]` is an owner casting slot. This
  package names no troupe member, invents no ring-
  master, no rival, no child prodigy — the slots
  ship empty and labelled. Mochi company members
  are individual records (#80) or named cast
  Mochi under the show's own cast discipline —
  likewise not instanced here.
- **Troupe Mochi are not wild and not
  backdrop.** A performing Mochi performs *its*
  repertoire by the agency doctrine: in staging
  terms, the performance is the creature's display
  behaviour (#152's `displayBehaviours[]`) extended
  by training — the troupe's craft is teaching a
  Mochi to offer its display on cue, and the show
  stages it as the creature's art, not its
  obedience test. A troupe whose fiction treats
  its Mochi as props fails this spec's staging
  rule, flagged at script review.

## Game lane

No troupe system is proposed for the game lane: a
troupe in the game is world content — its arrival
is a #195-class seasonal/rotation window, its
performance an attended event under #167's
audience grammar where applicable. If a future
list builds game-lane troupe mechanics, it builds
them on this record; this package does not
pre-build them.

## Wiring

Production records in the show home beside #82;
repertoire read from #147 (via #167's rule);
routes over #137's atlas; game-lane arrival via
#195 windows. Lands beside 82-SHOW-ARC-PLANNING
with a citation proposed into #167's home.

## Coverage — honest

- **Architecture: fully specified** — record,
  perform/compete fence, repertoire-as-view,
  casting discipline.
- **Contents: zero troupes instanced** — no name,
  no route, no member, human or Mochi, is created
  by this package. Every troupe is owner/show-lane
  casting, entire.
