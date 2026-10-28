# #261 — POLLEN & SCENT LAYER → what the air carries, drawn — never narrated, never a weather

**The gap this fills.** A garden world full of
flowering plant Mochi has something in its air:
pollen on the drift, scent on the breeze. No system
owns that layer yet. It is not weather (#61's states
are sky facts), it is not a battle effect (those are
move/ability data), and in the show it cannot be
*said* — creatures don't speak and the subtitle law
reserves words for important moments. This spec owns
the layer as what it is: **a presentation state of a
place, sourced from the plants actually there.**

## Native spec — `mochiichao/pollen-layer/v1` (fragment beside this doc)

- **The state.** `pollen_state ∈ {none, drift,
  bloom-cloud}` — read per place and moment from
  facts that already exist: the area's stocked
  species (#7 tables, under #84's roster-binding —
  pollen comes only from flowering species the place
  actually stocks, at the stages that flower, read
  through #257's bloom derivation where a bloom
  family exists and through the sheet's flowering
  anatomy where the bloom is evolved), #61's wind
  (drift needs moving air; a still day keeps pollen
  at its source), and #19's phase (most flowering
  reads day-side). `bloom-cloud` is the rare heavy
  state — a place in mass flower, or a Verdilance-
  class crown overhead — and is a board/content
  decision at the place's authoring, not a roll.
- **Not a weather — by construction.** #61's
  `weather_state` enum is closed and pollen is not
  added to it. Pollen rides *beside* weather in the
  scene record: one extra field, `pollen_state`,
  proposed into #61's scene/build record home (the
  `RIDDEN` discipline — the proposal lands in #61's
  file, not as a quiet fork of its format). Rain
  washes it to `none` while it falls (the record
  says so in one line, so no consumer invents its
  own weather×pollen table); the Dark Forest depths,
  at weather NONE and stocked with nothing flowering
  on any verified table, read `none` — a consequence
  of the sourcing rule, not a special case.
- **Battle: nothing here.** Any battle consequence
  of pollen or scent — a scent-class move's accuracy
  effect, a pollen-class ability — is move/ability
  *data* (#9/#107), resolved by #17/#184 like
  anything else. This layer never enters a battle
  record. A battle staged in a `bloom-cloud` place
  *shows* the pollen (the plate, #128, may carry the
  drift as set dressing); it does not *use* it.
- **Field behaviour:** followers and wild Mochi
  react to the layer as presentation — a sneeze, a
  shake of the head, a contented turn into the
  breeze (#58 REACT `place:`-class keys, #152
  profiles). Reactions are behaviour reads, never
  state changes.

## Show lane

Scent is **shown, never narrated**: visible pollen in
frame, a character breathing it in and reacting — a
cry, a sneeze, a pleased shiver — under #136's
comprehension grammar (a reaction is a state the
audience reads, not a sentence). No subtitle may
carry scent information ("the air smelled sweet" is
exactly what the subtitle law exists to prevent):
if the audience needs to know a scent matters, the
episode shows who notices it and what they do. The
layer gives boards the shared word — a scene header
can say `pollen: drift` and every department draws
the same air.

## Wiring

Scene-record field proposed into #61's home; the
read draws #7 (stocked species) × #257/#259
(flowering anatomy) × #61 wind × #19 phase; consumed
by plates (#128), scene headers (#16's xsheet
family), #58/#152 behaviour reads. Writes: the one
proposed field; no battle writes, ever.

## Open slots

None that are mechanics. Which places are authored
as `bloom-cloud` is world content (place by place);
the state vocabulary and sourcing rule land
complete.

## Coverage — honest

- Architecture: a presentation-layer state with a
  strict sourcing rule — its yield is mostly the two
  fences (not a weather; never a battle input) that
  keep a soft layer from becoming a soft mechanic.
- Contents: zero places instanced.
