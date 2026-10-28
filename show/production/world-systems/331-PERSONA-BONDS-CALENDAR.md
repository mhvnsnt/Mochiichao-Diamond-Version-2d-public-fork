# #331 — BOND RANKS & THE CALENDAR ENGINE → Persona's twin grammar, seated

**The two gaps this fills.** (a) #93 keeps the
world's relationship *facts* and #280 derived a
trust read over them, but nothing gives a
relationship a *shape over time* — no ranks, no
thresholds, no "you and this person are *here*
now." Persona's Social Links are exactly that
shape: a bond advances in ranks, each threshold is
marked by a scene, and the world treats a ranked
friend differently from a stranger. (b) The
calendar: half the programme is quietly waiting on
one. The newspaper already turns over daily (#224),
the festival calendar exists (#105), seasonal
events exist (#195), and the night-sky chart has a
season hand that cannot turn until a calendar is
ruled (#246's register, carried through four
packages). Those packages have the *contents*; what
has never existed is the **engine** — the machinery
of days. This spec builds the engine. The
calendar's names, lengths, and holidays stay
owner/canon slots, entire — an engine is not a
year.

**What was studied.** Persona's twin grammar as
publicly documented: confidant ranks (a numbered
climb, a scene at each rank, benefits that are
mostly *world-shaped* — doors, discounts, doors
again — rather than stat-shaped) and the lived
calendar (days with shapes: some things only
happen on their day; time is the resource the
whole game is spent from).

## Native spec, part A — bond ranks: `mochiichao/bond-rank/v1` (fragment beside this doc)

- **Scope fence, first.** This is the *human*
  relationship system: Ranger ↔ person pairs.
  Ranger ↔ Mochi bond already has its own law
  (#39's facts, #180's declaration law for battle)
  and this spec does not touch it — a Mochi is not
  a confidant, and no rank number may ever be hung
  on a creature.
- **Rank is a read over facts.** Per pair, a rank
  band derived from #93's relationship facts +
  #280's trust read + shared history beats in #12's
  fact record (missions done together, rescues,
  gifts, betrayals — #280's betrayal facts weigh
  here exactly as they weigh there). Ten bands,
  Persona's count, adopted as a design value (the
  count is data; the *shape* — a climb with marked
  thresholds — is the pull-in). Nothing is stored:
  the rank is recomputed, like everything countable
  (#14/#96 law).
- **Thresholds carry scene slots.** Crossing into
  a new band opens an authored *scene slot* for
  that pair (a slot record: pair, band, played/
  unplayed). The machinery is this system's; the
  scenes are writing — content lane, per pair, and
  most pairs will never have one authored. An
  unplayed slot never blocks anything; Persona's
  scenes are rewards, not toll gates, and so are
  ours.
- **What rank may buy (world-shaped only):** a
  ranked friend's #217 gift, a #164 referral, a
  #301 conversation that goes further, a #244
  custom observed *for* you, a door held open in
  the #93 schedule sense. **What it may never buy:**
  battle effects (that's #180's fenced country,
  for Mochi), capture help, trial credit — and it
  never decays by arithmetic: a bond cools only
  through facts (neglect is a fact when the facts
  say so; betrayal is a fact forever, #280).

## Native spec, part B — the calendar engine: `mochiichao/calendar-engine/v1` (fragment beside this doc)

- **The day is a derived beat.** The engine owns
  exactly three things: (1) `dayIndex` — a count
  derived from #19's clock and the save's history,
  never a stored date field; (2) **rollover** — the
  single world beat at which daily things turn
  (#224's edition, #105's festival checks, #272's
  quiet-life decay reads, #334's camp morning) all
  subscribe to rollover instead of each inventing
  a midnight; (3) `dayShape` — which authored
  calendar template a given dayIndex falls under
  (ordinary / festival / market / rest — the class
  list is data), read by anything that needs to
  know what *kind* of day it is.
- **The season hand gets its driver.** #246's chart
  and #195's seasonal events read a `season`
  output from the engine: a position in the year's
  authored template. Until the year's template is
  authored (owner/canon slot), the engine returns
  the honest null it returns today and the hand
  stays still — the machinery landing does not
  invent a year to drive it, and no PR may describe
  the seasons as working until contents land.
- **What the engine never owns:** month names,
  year length, holiday contents, the week's shape
  if any — all canon slots. Persona's calendar is
  a school year because Persona is a school story;
  ours will be whatever Jamar's world says it is.
  The engine is deliberately year-agnostic: feed
  it a template and it turns; the template is not
  in this package.

## Wiring (proposed)

Bond-rank read seats beside #93/#280 (a derivation
in their home); scene slots as a small record in
the same home. Calendar engine seats beside #19's
clock package; rollover consumers subscribe at
their own landings (#224 first — its daily cadence
was written against this engine before the engine
existed). Reads: #19, #12, #93, #280. Writes:
scene-slot records only (played/unplayed); the
engine itself writes nothing.

## Open slots (nothing invented)

**The calendar's contents, entire** — year length,
month names, the week, holidays (owner/canon) ·
rank band names as #23 text (content) · scene
contents per pair (writing) · whether any pair's
rank is ever shown a number in the show (casting
colour — the game shows ranks on people the way
Persona does, as UI; the show has no UI, and the
question is a staging one for the show lane).
