# LIST-3 TEARDOWNS — items 17–26 (systems wave 3)

Ten teardowns from Jamar's List 3, built the Lists 1–2 way: studied
from public documentation and published craft, written as **native
Mochiichao specs/formats**, staged repo-ready and wired into the
systems already built (core data, LIVING-WORLD, SCORE/WIND-STATE,
spawn tables, event flags, the design gate, the credits research).
Canon fills what canon covers; everything else is flagged OPEN /
PROPOSED in the document itself. Nothing here invents canon.

| # | System | Doc | Machine-readable |
|---|---|---|---|
| 17 | Type-chart + damage architecture | `TYPE-SYSTEM.md` | `type-chart-fragment.json` (shape only — zero matchups asserted) |
| 18 | Opponent AI scoring | `OPPONENT-AI.md` | — (scorer module + class flag spec) |
| 19 | Day/night + weather states | `TIME-WEATHER-STATES.md` | `world-state-fragment.json` (dread cycle, frost-trace state) |
| 20 | Economy systems | `ECONOMY.md` | — (shop/faucet/sink record shapes in doc) |
| 21 | 2D camera grammar | `CAMERA-SYSTEM.md` | — (camera entries ride the xsheet camera column) |
| 22 | Environmental sound | `ENVIRONMENTAL-SOUND.md` | — (bed recipe format for LIVING-WORLD's BED ids) |
| 23 | Text / localization engines | `TEXT-ENGINE.md` | — (string-id grammar + closed control-code set) |
| 24 | Opening-title structure | `OPENING-TITLES.md` | — (OP slot map OP-01…OP-07 as banked shots) |
| 25 | Plush pattern derivation | `PLUSH-SPEC.md` | — (derivation sheet = design-gate output) |
| 26 | Credits-roll systems | `CREDITS-FORMAT.md` | — (per-episode `credits.json` shape in doc) |

## The wiring, in one paragraph

One state spine runs under the whole package: #19's world-state
(phase / weather / dread) is read by #17's damage field modifiers,
#7's spawn rolls, the lighting plot and #22's bed recipes — the same
one-producer/many-consumers pattern as WIND-STATE and SCORE-STATE.
#18's AI consumes #17's chart and #7's encounters; #20's economy
rides #12's flags for gates and rewards; #23's text engine makes
rename-on-use safe for every other system by keeping display names
as lookups. On the show side, #21's camera vocabulary is the data
inside #16's xsheet camera column, #24's OP spends moves from that
vocabulary and mixes through #13's stems, #26's credits generate
from the same per-episode data package, and #25 hangs off the
design gate as an output, not a new pipeline.

## Coverage summary (details in each doc)

- **Architectures: fully documented publicly** — every system's
  shape is a standard, published pattern; no spec rests on a guess.
- **Contents: exactly as complete as canon.** The type chart asserts
  zero matchups (owner balance pass owed); AI tuning, economy rates,
  camera ratios and plush bounds are PROPOSED; the dread cycle's
  transition rules, the frost schedule, the currency name, OP parade
  order and shop contents are OPEN. Each doc carries its own
  coverage section saying precisely which is which.
