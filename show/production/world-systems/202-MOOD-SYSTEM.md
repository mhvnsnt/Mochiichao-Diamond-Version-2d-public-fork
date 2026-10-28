# #202 — MOOD SYSTEM → the third temperament layer, a decaying projection

**Seat in the doctrine:** two layers already exist.
The **seed** is a stored birth fact (#80's
`personality_seed`). **Temperament** is derived
from that seed once and is true for the
individual's whole life (#108 — its 5×5 cell and
derived characteristic line never change). What
neither layer covers is the weather of a *day*: the
same even-tempered Kittember is bright after a
morning of care and flat after three days of storm.
That transient layer is **mood** — and it is a
projection, not a record. This package's whole
discipline follows from that one classification.

| Layer | Home | Form | Lifetime |
|---|---|---|---|
| Seed | #80 | stored fact | permanent |
| Temperament | #108 | derived once from the seed | the individual's life |
| Mood | #202 | derived at read time from recent facts | hours — decays to the temperament baseline |

**What was studied.** Transient-state layers in the
publicly documented raising/battle record: the
working designs share one shape — a short-horizon
state computed from recent treatment and
circumstance, influencing behaviour selection and
presentation, expiring on its own. The kit taken:
recency-windowed inputs, decay toward a baseline,
and effects confined to behaviour/presentation —
never to the permanent record.

## Native spec — `mochiichao/mood/v1` (fragment beside this doc)

- **Inputs (facts that exist for other reasons;
  mood creates no stored facts of its own):**
  recent care events from the Garden care loop,
  timestamped (#28 family), recency-windowed ·
  effective weather — #61's output read **through
  #142's climate**, as all weather consumers must
  (sustained storm weighs on the read; a single
  shower is weather, not a mood) · the individual's
  own recent battle/event outcomes (#12-class
  timestamped facts of participation). A fact not
  in one of these classes is not a mood input,
  however atmospheric it would be.
- **The projection.** Mood is a pure function of
  (inputs, clock): same facts, same moment, same
  mood — for every consumer, every time. As inputs
  age out of the window, the read **decays toward
  the temperament baseline** (#108's read): calm
  creatures return to calm; a mood is a deviation
  with a half-life, not a new personality. The
  window, the decay curve, and the per-class
  weights are **data slots — OPEN**. This package
  asserts no constants; a mood system with invented
  numbers would be fiction wearing a spec's coat.
- **Consumers — exactly two, both behaviour /
  presentation layers.** #152's behaviour-profile
  views (mood weights *which* stocked behaviour
  plays) and #160's field-partner assistance (mood
  colours the eagerness/read of the `sign:` /
  `find:` / `danger:` REACT selection — the
  selection, never the effects; #160's boundary
  stands verbatim: assistance sets no flags,
  collects nothing, is never the only path).
- **Writes: nothing.** No flag, no care axis, no
  honours, no bond change, no field on #80's record
  — proposed or otherwise. Battle is fenced off by
  name: the battle expression of the relationship
  is #180's bond lane, reading bond facts; **mood
  is not a battle input.** A future proposal
  wanting mood in battle arrives as a revision to
  this file, argued on its face — not as a silent
  consumer discovered at link-check.
- **Show-lane mirror.** Mood is a performance note:
  #152's show view hands direction a read
  ("flat today, storm-worn") and the performance
  follows. The show never names mood as a system
  and shows no meter; a creature's day is **played,
  not displayed** — the same law as #201's
  reputation, from the other side of the skin.

## Wiring (proposed)

A read-time projection beside #152/#160's homes.
Reads: #28 care facts, #61 via #142, #12-class
timestamps, #108 baseline. Writes: nothing.

## Open slots (nothing invented)

Window / decay / weight constants entire (design
values) · whether weather weight reads #142's
climate *identity* or only the current state (a
design question, flagged, not decided) · the mood
vocabulary the behaviour views render in (design
lane's words) · any consumer beyond #152/#160 (a
revision to this file, or none).
