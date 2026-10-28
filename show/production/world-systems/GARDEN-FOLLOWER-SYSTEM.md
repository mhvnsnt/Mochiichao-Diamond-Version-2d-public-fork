# GARDEN FOLLOWER SYSTEM — companion follow behaviour (List 7, #58)

Teardown: partner-follow systems in creature games — the lead
creature outside its ball, trailing the player through the world.
Public architecture: a follower is a state machine hung off the
player's movement (follow / catch-up / idle / react), with
per-species reaction sets keyed to place and event, and a strict
separation between the follower (a principal — it is *your*
partner) and ambient creatures (set dressing).

## Native system

**Classes.** A follower is PRINCIPAL-class under LIVING-WORLD's
roster-binding law: it is never drawn from the ambient population
pools, it is exempt from density budgets, and ambient cycles never
override it (acting beats override ambient, always — §C of
LIVING-WORLD). One follower at a time (the partner). In the show,
the follower relationship is the default staging of Mochiko +
partner Mochi outside the Garden — the POV-switch canon (Mochii's
POV stands) reads through this system.

**State machine (game + show staging share it):**

| State | Enter | Behaviour |
|---|---|---|
| `FOLLOW` | default | Trails at the species' distance band (below); pathing is loose, not rail-locked — drift and small detours are the life |
| `CATCHUP` | gap > band max | Direct return at the species' hurry gait; no teleport inside the same map |
| `IDLE` | player idle / scene hold | Species idle cycle + habitat reaction set (below) |
| `REACT` | scripted beat, discovery state change, weather onset, battle intro | One reaction from the species' set, then back to FOLLOW/IDLE |
| `PARKED` | Garden care loop, interiors with a park rule, cutscene lock | Waits at a marked spot with IDLE behaviour; the care loop (#65) owns it while parked at the Garden |

**Distance bands are per body plan, not per species:** small
quadruped/biped = close band; large bodies = wide band; swimmers
follow only in water-bearing maps (a swimmer on land is PARKED at
the water or absent — the animscript splash-puddle staging flag,
List 2 #9, is the battle-side twin of this rule). Bands are
recorded in the follower block (below), values tuned per species
in the sheet's body data — where body data is TBD, the band is TBD
with it; no defaults are invented here.

**Reaction sets.** Per species, a small set of `REACT` entries
keyed by trigger class: `place:<habitat_key>`, `weather:<state>`,
`kin:<species>` (meeting its own kind), `dread` (Dark Forest —
reactions invert: stillness, closeness; the Forest's population
rule is 0 for ambient, but a *partner* follower is a principal and
may be present, reacting by closing distance and going quiet).
Reaction content comes from the species' cry spec + pose library;
the follower never speaks (cries-only law) and never initiates
story beats — reactions are texture, flags are set by the event
system (#12), not by the follower.

## Follower block (species sheet annex)

```json
{
  "follower": {
    "eligible": true,
    "distance_band": "close | wide | water-only | null",
    "hurry_gait": "rig cycle id or null",
    "idle_cycle": "rig cycle id or null",
    "reactions": [
      {"trigger": "place:pond_bank", "action": "…", "cry": "cry spec ref or null"}
    ]
  }
}
```

`eligible: false` is a real value (a species whose canon keeps it
from partnering — none asserted yet; the field exists so the
system doesn't presume). Nulls = owed, per house convention.

## Wiring

- Rig lane: `idle_cycle`/`hurry_gait` resolve to rig pose-library
  entries (the rigs' pose libraries are the same slot the animscript
  format cues); a species with no follower cycles is
  data-complete-but-animation-owed, tracked like any owed cycle.
- Show staging: FOLLOW/IDLE/REACT are board language — the xsheet
  (List 2 #16) carries the follower's state per cut so background
  animation labour isn't spent re-deciding it.
- Event system: `REACT` triggers read the same flag/place/weather
  state the event-flag architecture (#12) owns; follower sets no
  flags.

## Coverage

State-machine architecture: standard, fully documented publicly.
Mochiichao contents: structure complete; per-species bands,
gaits, and reaction sets are owed with body/rig data (TBD where
canon is silent) — the pilot six are the only species with the
body plans to fill them today.

**PROPOSAL from List 17 #160 (registered at its landing, 2026-10-27):** assistance trigger classes `sign:` / `find:` / `danger:` for the field-partner annex (160-FIELD-PARTNER-AI.md). Proposal discipline: the classes take effect only if this home adopts them; no species reaction set was edited by the List 17 landing.
