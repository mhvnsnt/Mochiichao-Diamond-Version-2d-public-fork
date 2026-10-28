# #149 — MOCHIIOTECA ON-SCREEN PRESENTATION → the device as the show shoots it (SHOW lane)

**Seat in the doctrine:** the Mochiioteca is the show's
most-seen object after the cast: Aeon hands it over in
the opening, Mochiko carries it all season. #81 specified
how the device *behaves* (its states, its `hush`, the
verbalisation question left as a stated owner decision
with never-verbal as default) and #32 how its map reveals.
Neither says how an episode *presents* it — what its
screens show, in what order, at what pace, and under what
naming discipline. This spec is the screen grammar.
SHOW LANE ONLY: the game's device UI is #32/#81's
territory; this spec governs the device as photographed
in episodes.

**What was studied.** Device presentation in the
reference record: anime dex devices are shot as
*performances* — the screen lights, the entry assembles,
the Ranger reacts; the audience reads the reaction, not
the data. Persona 5's UI research (already in this
programme's pull-in) adds the discipline: one dominant
colour first, the character's gaze line carries the eye,
menus are posed performance. The kit taken: a screen in
an episode is a short staged beat with a closed content
vocabulary — never a screenshot of the game's UI.

## Native spec — `mochiichao/show-device-screen/v1` (fragment beside this doc)

- **Screen content classes** (closed): `identify` (a
  species entry assembling — silhouette first, per #3's
  discovery grammar: the screen may only show what the
  dex state allows, seen = silhouette/`???`, met = full
  card, per #14's derived states), `map` (the #32 reveal
  states rendered as the device shows them — unvisited
  stays hidden on screen exactly as in the device), `scan`
  (the act of registering — the two-bitset moment, seen
  and met kept visibly distinct), `alert` (a state change
  worth a beat: completion tick, research level, honours
  echo — facts from their home systems, never invented
  device opinions).
- **The Leak rule binds every pixel.** Screen text is
  display layer only: species and places resolve through
  #23 lookups, and no screen may ever carry secret-layer
  vocabulary — no "Mainframe", no "Data", no "Binary",
  whatever the production files call things. This is
  grep-auditable at board stage (#85's wayfinding rule,
  applied to screens): a board whose device screen shows
  a production-layer word fails the canon pass.
- **Reveal pacing.** A screen beat has three timings and
  no more: *light* (the device wakes — in the Forest,
  `hush` applies: dim, no chime, per #81), *assemble*
  (content builds in the class's order — silhouette
  before name before data, always), *settle* (the Ranger
  reads; the camera is on the face, not the screen, by
  the last third of the beat). Durations per class are
  production values, OPEN; the order is the law.
- **Sound.** The device sounds through the episode's
  audio design (#51 classes, #13's SCORE-STATE
  awareness) — and under #81's default it never speaks.
  If the owner ever rules verbalisation in, this spec's
  pacing gains a voice line and nothing else changes;
  until then, a device that talks in a board is a defect.
- **The body stays undesigned here.** The device's
  physical design is owner-open (#81); boards draw the
  device at the level of "the carried device, screen lit"
  and this spec governs only what the screen does. No
  board may fix the body's industrial design by drawing
  it in detail — that decision is the owner's, once, in
  its own place.

## Open slots (nothing invented)

The device's physical design (owner, via #81) · the
verbalisation ruling (owner, via #81 — default never-
verbal) · per-class beat durations · the screen's colour
system (joins the episode colour script, #50 — specified
per episode, not here) · whether `alert` may ever sound
in the Forest (the `hush` reading says no; the spec
records the question rather than settling it).
