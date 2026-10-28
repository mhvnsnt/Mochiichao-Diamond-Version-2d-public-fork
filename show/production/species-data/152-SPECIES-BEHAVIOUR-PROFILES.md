# #152 — SPECIES BEHAVIOUR PROFILES → behaviour as data, one profile per species

**Seat in the doctrine:** three systems already *need*
to know how a species behaves, and each currently has
to assume it: the Garden (#28's raising system, #65's
care loop) needs idle and care behaviours; wild
encounters (#18's wild class, #7's tables) need field
behaviour — approach, flee, ignore, display; the show
needs background behaviour for any species it puts in a
place. #84 set the audio form of the governing law (a
place may only *sound* of species its spawn table
stocks); this spec is the picture-and-motion twin: a
place may only *behave* of species it stocks, and what
"behave" means per species is written down once, in a
profile that joins the species sheet.

**What was studied.** Behaviour specification in the
publicly documented record: creature design practice
writes behaviour before animation (ethology-first —
diet, sociality, threat display, rest); game AI writes
it as small state machines keyed to stimuli; animation
production writes it as behaviour loops per character.
The kit taken: one profile per species, three consumer
views (Garden / wild / show-background), all read from
the same fields — behaviour is authored once and
projected, never re-authored per consumer.

## Native spec — `mochiichao/behaviour-profile/v1` (fragment beside this doc)

- **The profile** (an annex on the species record, in
  the sheet's own home — NOT a second source of truth):
  `{speciesId, sociality, activity (per #19 phase),
  threatResponse, curiosity, careBehaviours[],
  idleLoops[], displayBehaviours[]}`. Field vocabularies
  are closed and small: `sociality ∈ {solitary, pair,
  group, colony}`, `threatResponse ∈ {flee, freeze,
  display, charge, vanish}` (Wispkin's Frost-trace
  absence is a `vanish` — the vocabulary must be able to
  say what canon already shows), `curiosity ∈ {wary,
  neutral, bold}`.
- **Derived view, not duplicate data.** The sheet stays
  the source; the profile is a named *section* of it
  (like #57's habitat annex and #80's individual record,
  the pattern is annexation). Consumers read projections:
  - **Garden view** → `careBehaviours` + `idleLoops`,
    consumed by #28/#65; care axes stay #28's — the
    profile says what the creature *does*, the care
    system says what it *means*.
  - **Wild view** → `threatResponse` + `curiosity` +
    `activity`, consumed by #18's wild class as scorer
    inputs (the AI decides *whether*; the profile says
    *how it looks*) and by #67's weather-behaviour
    tables as the behaviour being keyed.
  - **Show view** → `idleLoops` + `displayBehaviours` +
    `sociality`, consumed under the roster-binding law:
    a scene's background population is drawn from the
    area's #7 table, behaving per profile — a background
    species behaving off-profile is a board-stage flag
    (#53), the behavioural twin of #84's sound rule.
- **Individuals vary inside the profile.** #80's ruled
  deviations and rolled variance apply to behaviour as
  to looks (a bolder-than-species individual is a
  deviation, recorded on the individual, never a silent
  edit to the profile). #108's temperament is the
  individual modifier the profile's ranges are read
  through.
- **Cries are not behaviour fields.** Vocalisation stays
  #2/#84/#155's domain; a profile may note *when* a
  species calls (an activity fact) but never what the
  call is — the cry record owns that.

## Open slots (nothing invented)

Every species' actual profile contents (the wave-1
sheets carry ecology prose; distilling profiles from
them is a data-lane pass, species by species, against
the sheets — not invented in this spec) · whether
`displayBehaviours` may be cited by #41's mythical
grammar for rare species (the five-beat staging borrows
presentation, not behaviour data — recorded as a
question for the link check) · profile fields for
anatomies with no field presence (pure swimmers'
`idleLoops` in Garden contexts — the Garden's water
handling is #28's question first).

**PROPOSAL from List 23 #226 (registered at its landing, 2026-10-27):** a transit register for migration spectacles, proposed into this profile system's home (226-MIGRATION-SPECTACLES.md). Spectacle records key by migrationId to #144's pairs with witnessPoints null; the record exposes no encounter table, rate, or rarity field to any consumer (negative test, in the spec).
