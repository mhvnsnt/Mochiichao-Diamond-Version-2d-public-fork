# #184 — ABILITY TRIGGER RESOLUTION → when abilities fire (resolution over #107's registry)

**Doctrine seat:** #107 founded the ability registry
and its closed trigger vocabulary — `entry`,
`on-dealt` / `on-taken`, `turn-end`, `weather-react`,
`standing`, `field-only` — with hooks that name stages
of #17's pipeline, and asserted **zero abilities and
zero assignments**. What it did not fix is the firing
order: when each class fires inside #10's flow, how
simultaneous effects stack, and what suppression is.
This package is that resolution layer. It instances
nothing — no ability, no assignment, no parameter —
and assignments remain species-data work (#107).

**What was studied.** Ability resolution in the
publicly documented record: entry effects resolving
as the creature arrives, before any command; weather
abilities answering the sky's state on arrival and on
change; hit-reactive effects riding the hit that
caused them; end-of-turn effects in a fixed tail
order shared with residual damage; passive modifiers
that are never events at all, just terms in the
damage chain. The kit taken: one firing seat per
trigger class, stated once, in the host system's own
queue language.

## Native spec — the firing order (the yield; record shape in #107)

- **`standing` — not an event.** A standing hook
  composes inside #17's chain at its named stage
  during `RESOLUTION`, for as long as the individual
  is on the field. It never emits a queue item and
  never "fires"; #107's law holds (abilities carry no
  damage math of their own — the pipeline composes).
- **`entry` — the entry step.** At battle start,
  entry effects resolve after `INTRO` completes and
  before the first `COMMAND_RING`. On any switch-in
  (the switch itself resolves in `END_CHECK`, #10),
  the entrant's entry effects emit as queue items in
  an entry step before `COMMAND_RING` reopens. In
  #157 multi formats, simultaneous entrants resolve
  in slot order.
- **`weather-react` — with the sky.** Fires when the
  weather slot's value *changes*: at battle start,
  the seeding from world state (#47/#61) counts as a
  change, and weather-react resolves in the entry
  step **before** `entry` effects — the sky is there
  before anyone acts under it. On a mid-battle slot
  change, it emits in the same queue segment,
  immediately after the change's own item.
- **`on-dealt` / `on-taken` — riding the hit.** Hooks
  that modify the hit itself name a #17 pipeline stage
  and compose in the chain (no separate event).
  Reactive hooks emit as queue items **immediately
  after that hit's `damage` item** (#10: cause
  precedes effect).
- **`turn-end` — the tail order.** In `END_CHECK`:
  field ticks/expiry (#47/#181) → condition ticks
  (#182) → **turn-end abilities** → battle-end checks
  conclude. Faint `interrupt` items outrank the whole
  tail whenever they occur (#10).
- **`field-only` — never in battle**, by #107's
  definition; its seat is the field systems (#7 via
  #112's modifier interface, #28 activities).
- **Stacking.** One individual carries **one** ability
  — the slot is #107's proposed `abilitySlot` field on
  #80's record (its acceptance at landing is
  registered in STAGING; until it lands, the
  one-ability seat is spec-level). Across individuals,
  standing modifiers compose through #17's chain in
  pipeline order — the chain is the stack. At a shared
  reactive trigger point, resolution order is: **the
  acting side before the receiving side; within a
  side, abilities before held items (#183)** — stated
  identically in #183; the two specs state it from
  their own sides and agree.
- **Suppression is data, never code.** A record (a
  #47 field condition, a #27 condition, another
  ability) may carry a suppression hook naming an
  ability id or a trigger class; while the suppressor
  is active, the named hooks do not fire or compose.
  **Zero suppression pairs are asserted**, and no
  global suppressor exists by default — an ability
  that cannot be suppressed is the ordinary case, not
  an oversight.

## Show lane

#107's line stands: abilities are never announced —
they are behaviour the audience reads, staged through
#9 performance blocks. Resolution order is game-lane
truth; a show fight's choreography may *echo* it
(entry presence before action, reactions after hits)
because that is how readable fights are staged, not
because the table binds the show.

## Wiring

Resolution seats live in #10's flow implementation
beside #182's ticks and #183's item order — landing
implements **one** ordering across the three specs,
cited in each home. The registry and slot stay
#107's/#80's; #18's AI reads whatever #107's OPEN
knowledge question (full vs partial ability knowledge)
is ruled to be — **inherited OPEN here, not resolved**:
firing order is resolution truth, not knowledge
policy.

## Coverage — honest

- **Architecture: fully documented** (trigger classes
  with fixed seats are the published pattern; the
  seats chosen are this programme's verified #10/#17
  shapes).
- **Contents: still zero abilities.** Every ability,
  assignment, parameter, and suppression pair is
  #107's OPEN register, unchanged. The yield is that
  when the first ability is ever authored, the engine
  already knows when it fires, what it stacks with,
  and what could silence it.


**Landing note — List 27 #257 (2026-10-27):** the state-bloom derivation (257-BLOOM-STATES.md) re-reads forme state in this file's weather-react seat: when weather changes, bloom derivations re-derive with it. #257 founds no bloom family; the derivation is a read over #130's axis.

**PROPOSAL from List 36 #354 (registered at its landing, 2026-10-27; STAGING step 6):** two guard rows are proposed into this file's resolution vocabulary as command-declared rows, citing `show/production/battle/354-GUARDING.md`: `interpose` (trigger class `standing` — a second bond stands in the doorway; its added bond term is read inside #268's roll) and `screen` (a reaction seat inside the throw's resolution — spend the action, block one attempt outright; the item is still consumed and the attempt deed still writes). The vocabulary is this file's closed set; until this home accepts the rows, they are SPEC-LEVEL and no guard row is instanced in the registry.
