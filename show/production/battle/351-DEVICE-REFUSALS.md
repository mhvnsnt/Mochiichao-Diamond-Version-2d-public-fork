# #351 — DEVICE REFUSALS → when the tool says no, it says why, in the world's voice

**The refusal is part of the fiction.** #268
founded the first refusal — a snag device that
will not fire when too many witnesses are watching
("too many eyes") — and ruled that a refusal
consumes nothing and writes nothing. This spec
builds the refusal family whole: every class of
"the tool says no," the order they are checked in,
how each one is spoken, and the turn-economy law
that keeps a refusal from quietly taxing the
player. A refusal is the device *talking*, in-world,
with a reason — never a system error wearing a red
X.

## Native spec — `mochiichao/device-refusals/v1` (fragment beside this doc)

- **The refusal classes (closed; each is data on
  the item/record it belongs to):**
  - **`too-many-eyes`** — the witness ceiling
    (#268's founded member): the battle's witness
    count (#272's set for the area) exceeds the
    item's ceiling value. The device built for dark
    corners declines the arena.
  - **`story-locked`** — the target carries #68's
    story-lock: the lock that bars escrow and
    release bars theft with the same force. This
    refusal belongs to the *target's* record, not
    the item — any device, any thrower, same answer.
  - **`not-in-this-place`** — ruleset refusals: the
    #109 versus lobby's snag gate is the founded
    member (the formal arena forbids the class
    outright); facility rulesets (#186) may carry
    the same flag as data. The place refuses, not
    the tool.
  - **`heart-unreadable`** — a reader-carrying
    device (#349) that cannot complete its read
    (the target's state is outside the read's
    classes — a presentation state the fiction
    hasn't seated): the device declines rather than
    guess. Guessing is how a rescue becomes a theft
    by mislabel; the device would rather say
    nothing true than something false. (Zero states
    instance this class at build — it is the read's
    honesty valve, founded before it is needed.)
  - **`out-of-state`** — the target is not in a
    throwable state at all (not on the field, in a
    #182 state the capture rules already exclude,
    mid-#289 frenzy beyond the device's class):
    capture's ordinary exclusions, restated here so
    the family is complete in one place — these
    refuse ordinary throws identically.
- **Check order — first refusal wins, and the
  order is the fiction's.** Refusals evaluate in
  #350's pipeline at the device-check stage, in
  this order: **place → lock → eyes → read →
  state.** Place before lock (you are told where
  you stand before what the target is), eyes before
  read (the device checks the room before it looks
  at the heart — a device that read first would
  have *done* something in front of those witnesses,
  and #268's law is that a refused device has done
  nothing). Only the first refusal is spoken; the
  rest stay silent, because a device reading out a
  list of charges is a system menu, not a tool.
- **How a refusal is spoken — information, not
  error text.** Each class carries a #23 string (or
  a small string set for texture) in the device's
  voice: short, in-world, naming the reason plainly
  ("Too many eyes." / the lock's flat negative /
  the arena's rule stated as the arena's). The
  refusal renders through the ordinary battle text
  flow (#10/#23), never through a system-error
  surface, never in a different typeface of blame.
  The player is being *told something true about
  the world* — that crowds are safety, that this
  partner is protected, that this place forbids it —
  and the telling is gameplay information they can
  plan around (come back at night; meet them on the
  road). A refusal that teaches nothing is a failed
  refusal.
- **The turn-economy law — a refused throw does
  not eat the action.** Pokémon's own shape: a
  capture attempt that *launches* consumes the
  turn (the throw happened; the world answered).
  A refusal happens *before* launch (#350's stages
  2–3): the command returns to the ring, the
  Ranger chooses again — another item, a move, a
  switch — with the turn intact. Stated as law
  because the alternative is a quiet tax that would
  teach players never to test the device, and
  testing the device is how they learn the world's
  rules. The same law binds NPC refusals inside
  their decision flow (#268's symmetry): a refused
  Syndicate device means the grunt does something
  else with their turn — visibly — which is itself
  information the player can read (#352's reactions
  key off it).
- **Refusals write nothing — anywhere.** No deed
  (#269), no attempt (#348 — a refusal is pre-launch
  by definition), no witness event (#272 — nothing
  happened to witness), no item consumed, no turn
  spent. The only trace a refusal may leave is the
  player's own memory. This is the family's
  load-bearing silence, and it is what makes the
  witness ceiling a *safety* mechanic rather than a
  failed-crime generator: crowded places are safe
  because the attempt never exists there.

## Show lane

A refusal is a gift to the show's writers: the
device that won't fire in a crowded market is the
world explaining its own rules on screen, no
narration needed. The Syndicate grunt whose device
refuses — and who has to improvise, badly, in front
of everyone — is #352's reaction grammar at its
most useful. The show states refusals through the
same device voice (interface text is diegetic in
both lanes, #149's discipline).

## Wiring

Classes land as data: witness ceiling + reader
presence on the item's #31 record (with #268's
snag flag); story-lock read from #68's record;
ruleset flag from #109/#186; witness count from
#272's set computation. Check order and the
turn-economy law seat in #350's pipeline at the
device-check stage (STAGING step 4 lands them
together — the pipeline is one artefact in three
specs). Strings: #23. Negative test: a refusal
produces zero writes in #269/#272/#227 — grep-and-
test level (STAGING step 5).

## Open slots

The refusal strings' final wording (#23 data —
the witness ceiling's "too many eyes" register is
set by #268; the rest is writing in the device
voice) · the witness-ceiling values per item
(#268's item data) · which facility rulesets carry
the place flag (ruleset data). No mechanic parked.

## Coverage — honest

- Classes, order, and economy: fully specified; one
  class (`too-many-eyes`) and one place refusal
  (#109's) are founded in landed text; the rest are
  founded here as the family's completion.
- Contents: refusal strings are unwritten writing;
  `heart-unreadable` instances zero states by
  design (the valve precedes its need).
