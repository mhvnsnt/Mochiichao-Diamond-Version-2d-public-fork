# #69 — ACHIEVEMENT ARCHITECTURES → Mochiioteca achievement layer

**Teardown (public documentation).** Platform achievement systems
(Xbox Gamerscore lineage, PlayStation trophies, Steam achievements)
share one architecture worth taking: achievements are **predicates
over state the game already tracks**, evaluated at read/event time,
never a second progress database; they are tiered (bronze→platinum
classes), some are *hidden* until earned (the spoiler-shaped ones),
and the completion capstone (platinum-class) is itself just a
predicate over the other predicates. The in-game ancestor is the
same shape as #14's reward ladder: milestones tested on derived
counts. The kit taken: predicate-over-existing-state, tiering,
hidden flags, capstone-as-predicate. No platform names/branding, no
achievement lists, no point values are copied — and inside our own
game there is no platform: this layer is **the Mochiioteca's own
record pages**, diegetic first.

**Native spec — achievement layer over #14.** The completion loop
(#14) already fixed the truth: per-species states (unseen/seen/kept)
live in the registry/save layer; counts, percentages and milestones
are **derived at read time, never stored**. Achievements inherit that
law absolutely:

- An achievement is a record `{id, predicate, tier, hidden, title,
  record_page}` in `mochiichao/achievements/v1` (fragment beside this
  doc). The **predicate vocabulary is closed** and small: count
  comparisons over #14 derivations (`seenCount`, `keptCount`,
  per-region counts), state checks over #12 flags (`story.*`,
  `progress.*`), and roster events (first-kept, region-complete).
  If a proposed achievement needs state outside that vocabulary, it
  is rejected at design review — that is what keeps the layer derived.
- **Tiers are record-page kinds, not points:** `note` (a line in the
  Mochiioteca record), `page` (a full Manual-page style record —
  #14's region-certificate kind), `device` (a Mochiioteca upgrade
  flag in `story.*`, exactly #14's canon-shaped reward kind). There
  is deliberately **no score**: Mochiichao completion is a record
  the device keeps for the Ranger, not a number other players rank.
- **Hidden** achievements hide title + predicate until earned
  (the Forest-shaped ones, if the owner ever sets any — contents OPEN).
- **Capstone:** `record.roster_complete` — predicate = keptCount
  equals the registry's *current* entry count, so it stays honest as
  the roster grows (wave-1 species never count until they hold
  registry entries — #14's rule, inherited).

**Relationship to #14's ladder (read carefully — no double-paying).**
#14's ladder *grants things* (device functions wake, upgrade flags
set). The achievement layer **grants nothing**; it *records*. Where
a #14 milestone and an achievement share a predicate, the achievement
is the record page **of** that milestone — one event, one write
(the #14 flag), one derived record. Contents of both ladders —
which milestones exist, thresholds, titles — remain **OPEN owner
decisions**; #14 already marked its cells OPEN and this spec adds
shape, not prizes.

**Show-side echo.** None direct (achievements are game-lane UI), but
the record-page *form* is the Manual-page form the show already uses
for its rationed subtitle moments — one visual language for "the
device remembers," both lanes.

**Wiring.** Consumes: #14 derivations + #12 flags (read-only).
Registers its record format beside the completion spec in
`show/production/world-systems/`. No save-format change: predicates
evaluate over fields that already exist.

**Coverage.** Architecture: standard, fully documented. Contents:
format + predicate vocabulary complete; the achievement *list* is
entirely OPEN (owner/game-design), by the same discipline as #14.
