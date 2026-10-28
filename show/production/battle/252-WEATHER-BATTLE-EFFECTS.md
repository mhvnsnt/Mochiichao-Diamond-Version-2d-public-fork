# #252 — WEATHER BATTLE EFFECTS → what the sky does once the fight starts

**Doctrine seat.** Three systems already touch weather:
#61/#19 own the world's weather states, #47 gives a
battle a WEATHER slot, and #181 fixed the field's
resolution order (weather → terrain → room). What none
of them stated is what each weather *does* in battle.
This spec states it, the documented way, keyed to the
weather vocabulary canon actually has — and where that
vocabulary has no harsh-sun state, it says so instead of
importing one.

## Native spec — `mochiichao/weather-effects/v1` (fragment beside this doc)

### How weather reaches a battle

The battle's WEATHER slot is seeded from the world's
state at the encounter (#61's `weather_state`, read
through #19's per-area stack: script > area > global) —
or set mid-battle by a move (move data; a set weather
lasts **5 turns**, 8 with the documented extender item
class, #31/#183 seats; a world-seeded weather has
`turns_left: null` and lasts the battle unless
overwritten — #47's replacement rule). All effects
below apply inside #248's chain at the field step, or
at #10's END_CHECK for the chip, in #181's order.

### The effects

| World state | In battle |
|---|---|
| `RAIN` | Aqua-type moves ×1.5 power; Flame-type moves ×0.5 (the documented rain trade) |
| `STORM` | Everything `RAIN` does, **plus**: moves whose data carries the storm-true accuracy flag cannot miss (the Thunder/Hurricane class — the flag is move data; the seat is here). Storm is canon's heavy rain, so it inherits rain's trade rather than inventing a second one |
| `FROST` | End-of-turn **chip: 1/16 of max HP** to every individual not on the condition record's exemption list (see below) |
| `CLEAR` | No modifiers. Canon's vocabulary has **no harsh-sun state**; the documented sun trade (Flame up / Aqua down) has no state to hang on and is not asserted. If canon ever authors one, it takes a #47 row and this table gains a line — data, not a new spec |
| `OVERCAST` | No modifiers (light state only, #61 W2) |
| `MIST` | No battle modifiers. Mist's power in this world is presentational and ecological (#61 W3, #84) — it hides; it does not bend arithmetic |
| `NONE` | **There is no WEATHER slot.** The Dark Forest depths run `weather_state: NONE` (#61's canon), so no row of this table can fire there — a consequence of the seeding rule, not an exception carved for the Forest |

### The FROST exemption list (stated honestly)

The documented hail rule exempts the weather's own
element. Mochiichao's FROST weather is canon (Wispkin's
nightly trace, #61/#19) but **there is no Frost type id**
in the canonical fifteen — it is one of the unseated
design-lane labels (hole H3, #247). The FROST condition
record therefore ships with `chipExemptTypes: []`:
until the vocabulary is ruled, the chip applies to
every individual in a frost battle, and the list is
filled by the ruling, not by this spec guessing which
species are frost-kind. The mechanics are complete; one
list is empty for a named, owned reason.

### What weather never does here

- It never reads the party, the story, or the player's
  standing (#70's law; weather is the world's, seeded
  before the battle exists).
- World weather never changes because a battle started
  or ended; a move-set weather dies with its battle
  and writes nothing back to #19's stack.
- The show lane stages weather as #61's layer stack —
  atmosphere and light, never a ×1.5 announced on
  screen.

## Wiring

#47's WEATHER rows carry these effects as their record
data (this spec is their contents); #248 step 3 reads
them in #181's order; #10's END_CHECK applies the chip
through its queue (field tick narration after the
action, #47's rule); #192's dive areas and #61's Forest
rules seed the slot exactly as encounters do.

## Coverage — honest

- **Effects: asserted** for every state in canon's
  vocabulary, in documented shapes.
- **Empty by named cause:** the FROST exemption list
  (H3) and the absent sun row (no such state exists).
  Both are vocabulary facts, not unfinished mechanics.

---

**Landing citations — List 32 (2026-10-27).**

This file's weather seats are read, arithmetic untouched, by two List 32 family grammars: #308 (`battle/308-LIGHTNING-SPECTACLE.md`) reads the `RAIN`/`STORM` seats for the lightning family's staging, and #309 (`battle/309-WATER-SPECTACLE.md`) declares its storm crossover seats against the same vocabulary. Neither founds a weather state and neither changes a number in this file.
