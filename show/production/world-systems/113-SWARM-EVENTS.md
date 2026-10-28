# #113 — SWARM / OUTBREAK SYSTEMS → swarm & outbreak events

**What was studied.** The swarm architecture of the reference
games, as publicly documented: on a rotating schedule, one
species temporarily **floods** one area — its table weight
spikes or it is injected into the table outright — for a
bounded window, and the event is **announced in-world** (the
radio/news layer reports where the swarm is) so the player
learns of it through the fiction, not a menu. Later systems
generalise the window to chained outbreaks. The kit taken:
temporary overlay + clock window + in-world announcement.
No species, place, or schedule content is taken — ours are
all OPEN.

## Native format — the overlay record (fragment beside this doc)

```
overlay { overlayId, areaId, method, speciesId,
          mode: "flood" | "inject", window, source, status }
```

- An overlay is a **roll-time transform over a #7 table**,
  exactly like #112's modifiers and under the same law: base
  tables on disk never change; remove the overlay registry
  and every table is byte-identical.
  - `flood` — the species already holds a slot in the table;
    its weight is multiplied for the window (factor is data:
    null, OPEN).
  - `inject` — the species holds no slot; a temporary slot is
    added for the window (weight/levels are data: null, OPEN).
- `window` is keyed to the **world clock** (#19,
  `mochiichao/world-state/v1`): `{ opensAt: <phase tick>,
  phases: <count> }` — swarm lifetime is measured in the
  state's own phase ticks (`dawn | day | dusk | night`),
  never in wall-clock or step counts, so game and show read
  the same window.
  - ⚠ **Vocabulary note, flagged not fixed:** #7's spawn
    schema names its time bands `morning | day | dusk | night`
    where #19's state ids say `dawn`. This package keys
    windows to #19 (the clock is #19's system) and does not
    silently rename #7's enum — the mismatch is registered in
    STAGING.md for landing to reconcile in one place.
- `source` — what opened the window: `schedule` (a rotating
  calendar entry — the calendar itself is **OPEN**, and if it
  lands it lands beside #105's festival calendar as a sibling
  rhythm, not inside it) | `script` (a #12 `story.*` flag —
  scripted weather already outranks area defaults in #19's
  priority stack; a scripted swarm rides the same principle).

## Announcement grammar (via #90)

A swarm is announced through the **Iridescence media system
(#90)** as a `spawn_report` generator event — #90's generator
vocabulary already reads spawn tables; a swarm block reads
the **overlay registry + the area's table** (a generator with
no state inputs is forbidden by #90's own rule — this one has
two). Presentation rules:

- Display-layer naming throughout (Iridescence, never the
  production name — #90's Leak rule applies to outbreak copy
  exactly as to everything else).
- The announcement reports **where and what** (area + species,
  once the species is one the world may name — #90's
  `discovery_count` discipline: media never names an unmet
  species into the world before the Ranger meets it; a swarm
  of an unmet species is announced as a *disturbance*, species
  unnamed). This restraint is load-bearing — see Roaming,
  #114: the media system must never become a spoiler engine
  for things canon is withholding.
- A place-bound `bulletin` block carries the same notice for
  Rangers already in the area.

## Standing laws the overlays obey

- **#52 balance law:** overlay selection never reads party
  state. A swarm is a world event; it does not know the
  player's team exists.
- **#84 sound ecology (audio roster binding):** a flooded
  area *sounds of* the swarm species for the window — beds
  derive from effective (overlaid) tables, so the audio law
  and the roll law stay the same law.
- **The Forest exception, absolute:** **no overlay may target
  the Dark Forest depths.** The depths table is intentionally
  empty and OPEN (#7); injecting into it would stock the
  depths by the back door — a canon event masquerading as a
  system. Overlays against `dark-forest` surface are likewise
  unasserted (surface prose names wild Kittember; a Kittember
  swarm is a canon-shaped idea and still **OPEN**, not built).
- **Show lane:** a swarm on screen is LIVING-WORLD crowd
  staging — density budgets (P5) and the population classes
  govern the frame; the overlay record is the game lane's
  fact of the same event, per the two-lane one-truth rule.

## Wiring

- Registry home: beside the spawn tables (landing: with #7's
  instances, STAGING.md); roll window shared with #112
  (composition order OPEN, noted in both specs).
- Clock: #19 world-state producer is the only tick source.
- Media: #90 block registration (generator inputs above).
- Completion: swarm meetings are ordinary meetings — `seen`/
  `met` per the discovery bitsets; an outbreak grants no
  registry privileges.

## Coverage — honest

- **Architecture: fully documented** (rotating flood + clock
  window + in-world announcement is the documented pattern).
- **Contents: zero overlays.** No species, area, factor,
  schedule, or window is asserted. The record, the laws it
  obeys, and the two absolute refusals (party reads, the
  depths) are the yield.
