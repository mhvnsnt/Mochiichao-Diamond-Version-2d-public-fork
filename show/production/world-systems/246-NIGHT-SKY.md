# #246 — NIGHT SKY & STAR CHART SYSTEM → the sky is a readable layer, and it is read, not stored

**The gap this fills.** The world has a clock (#19),
weather (#61), a climate over it (#142), and rare great
events in the sky's family (#153's phenomena — storms,
auroras, falls). What it does not have is the ordinary
night: what stars are up, whether you can see them,
and the chart a Ranger reads them by. This spec makes
the sky a **layer you read** — a state worked out from
the clock and the weather at the moment you look up —
and the star chart the device and the printed page
both draw from it.

**How the reference record fills the same gap:** the
games keep the sky simple and honest — night is a
phase, clouds hide the sky, and the special nights
(a meteor shower over a town, an aurora in the cold
north) are *events* somebody scheduled, talked about
in advance, and gathered to watch. Ordinary sky:
derived. Remarkable sky: authored. This spec holds
exactly that line.

## Native spec — `mochiichao/night-sky/v1` (fragment beside this doc)

- **The sky state is a read, never a record.** At any
  moment, for any place, the sky state is worked out
  from facts that exist for other reasons:
  - the #19 phase (dawn / day / dusk / night — the
    sky's brightness is the phase's own fact),
  - the effective weather at the place, read #61
    through #142 as all weather consumers must — its
    **cloud cover gates the stars**: a clear night
    shows the chart whole; an overcast night shows
    none of it, and the read says so plainly rather
    than dimming a picture,
  - the region (the chart is keyed by where you stand
    — #142's climate record is the sky's home region
    fact; the chart turns with the region the way the
    weather does).
  Same facts, same moment, same sky — for the game,
  the device, and the show's background plate alike.
  Nothing about last night's sky is stored; if a
  system needs it, it was a phenomenon (#153) or it
  wasn't remarkable.
- **The star chart** is the chart itself as data: the
  fixed stars and the named figures among them, keyed
  by region and turning with #19's clock (the chart
  has a season hand as well as a night hand — the
  clock's year, when the calendar is ruled, turns it;
  until then the chart's turning reads the clock's
  phases only — see the open slot). The chart is a
  **reference artefact**, drawn two ways from one
  source:
  - in the game, as a sky/chart read on the
    Mochiioteca — content under #149's grammar (a
    `map`-family read of the sky; no new screen class
    is founded — the chart is the atlas turned upward,
    #137's kin, and lands under the same proposal
    discipline as #238's card if a seat is needed),
  - in the world, as printed charts and harbour almanac
    pages (#90's media layer) — the same chart, on
    paper, in universe.
- **Constellation lore is authored content — all of
  it.** The names of the figures, the stories hung on
  them, what sailors steer by and what the Forest's
  edge villages will not name: every word of lore is
  content-lane writing, and **this package instances
  none of it** — no constellation is named here, no
  story is sketched. The chart's slots are shaped
  (`figure: {stars, name (slot), lore (slot)}`) so the
  writing has somewhere to land. This is a canon-fact
  slot under the gap rule, kept open on purpose.
- **Phenomena are sky events first.** When a #153
  phenomenon is a sky thing — an aurora (`aurora`
  class), a meteor fall (`fall` class) — its *stage*
  is this layer: the phenomenon record (#153's home)
  says what it is and when it comes; the sky read is
  where it appears, gated by the same cloud rule (an
  aurora behind storm cloud is a rumour and a glow,
  and the forecast grammar, #194, already knows how to
  say *possibly*). A phenomenon never edits the chart;
  the chart is the fixed page the event is pinned to.
- **The Dark Forest's sky.** The mist is the Forest's
  own weather fact: under the trees the sky read is
  the mist read — the chart is not visible from the
  depths' floor, and this layer reports *covered*,
  the honest word. On the surface paths the hum and
  the mist thin where canon says they thin. No special
  case is coded: the weather facts do it, the way
  they do everything in that place.

## Show lane

The sky is the show's cheapest wide shot — one plate
library, drawn from this same read, so an episode's
night over the harbour and the game's night over the
harbour are the same night (the #75 delivery
discipline: one library, both lanes). A lore beat —
an elder naming a figure for a child — is an
important-moment scene under the subtitle law, and it
draws its words from the lore slots *when they are
written*, never from this package.

## Wiring

Reads: #19 (phase), #61 through #142 (weather +
climate), #153 (phenomenon records, one-way: the
layer stages them, never edits them). Drawn by: #149
grammar (device), #90 (print), the show's plate
library. Writes: nothing.

## Open slots

Constellation names and **all lore text** — canon
facts, content-lane writing, slotted entire. The
chart's season hand waits on the calendar ruling
(inherited from #195/#124's open calendar — the hand
exists in the shape; it turns when the year is
ruled). Nothing mechanical is parked: the read, the
gate, and the chart's shape are fixed.

## Coverage — honest

- Derived sky + authored phenomena: the reference
  record's own split, seated on verified homes
  (#19/#61/#142/#153).
- Contents: the fixed stars' arrangement is chart
  data for the content lane to draw once, carefully;
  zero figures are named in this package.
