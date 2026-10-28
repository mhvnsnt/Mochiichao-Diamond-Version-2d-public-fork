# #139 — EARLY-DISCOVERY HANDLING → out-of-order arrival as a designed case

**Doctrine (OWNER REFINEMENT, 2026-10-27):** a Ranger can
find a way to another region *early* — by accident, by
exploration, before the "intended" progression route
fires. That arrival is not a sequence break, not a bug,
and not an exploit to be patched: it is the connected
world working as designed. This spec defines what the
world owes an early arrival, system by system, so no
landing PR ever has to improvise it.

**What was studied.** Open-world and multi-region games in
the publicly documented record handle out-of-order arrival
in one of two ways: *scaling* (the world re-levels to the
visitor — rejected here by law, see below) or *authorship*
(the destination is simply itself: its creatures are as
strong as they are, its story doors open only for their
own keys). The kit taken is authorship, stated as a
two-class rule over every system an arrival touches.

## The two classes (the whole spec in one table)

| Class | Systems | Behaviour on early arrival |
|---|---|---|
| **World-open** | Spawn tables (#7), encounter bands (#52), climate/weather (#142/#61), schedules (#93), shop base derivation (#118), atlas/ferry discovery (#137/#141), Garden/camp services (#28/#134) | Fully live from the moment of arrival. These systems read *presence + world state*, never story progress, so an early Ranger is simply a Ranger who is there |
| **Story-locked** | Main beats (`story.*`), dojo circuits (#45/#143), gauntlet (#100), capstones, technique gates whose fiction is taught-not-found (#117) | Locked until their own flags are earned — *in whichever region they belong to*. Early arrival in Region 2 does not touch Region 1's locks, and Region 2's own locks test Region 2's flags, not the visitor's seniority |

Three consequences, stated so they are never re-litigated:

1. **No scaling, ever.** #52's law B1 (wild bands never
   read party state) is the early-arrival law: an early
   Ranger meets the destination's authored bands at full
   strength. Being under-levelled for a discovered region
   is the doctrine's built-in honesty — discovery is free,
   mastery is not. #70's visible-dials law reinforces:
   no hidden rubber-banding may soften this.
2. **NPCs behave as authored.** Schedules (#93) are
   first-match tables with no memory in the schedule
   layer; an NPC met early is the same person, in the
   place their table puts them. Dialogue that is
   flag-gated falls to its ambient/default rows (the
   dialogue kit's pairing is pointer-only, #12) — an NPC
   never says a line whose flag the Ranger hasn't earned,
   and never acts as if a later meeting already happened.
   Travellers (#145) may *notice* an early arrival — that
   noticing is authored content, OPEN, not a system.
3. **Nothing is owed retroactively.** If progression later
   "would have" introduced the region (the #127 capstone
   route), arriving early does not double-fire anything:
   introductions keyed to the progression route check the
   arrival evidence first (#137's derivation) and stand
   down if the Ranger has already been. First-arrival
   staging (#127 `arrival`) fires on *first* arrival,
   whichever route caused it, exactly once — it is keyed
   to the arrival flag, not to the route.

**What early arrival may never do:** set a flag belonging
to a region not yet visited (presence is the evidence);
complete a circuit out of its own region's order (#45's
spine is per-region canon); or make a later region's
story-locked content treat an unmet character as met
(#37's appearance records chain per appearance — an early
*meeting* is an appearance, a rumoured one is not).

## Wiring

Reads #52/#70 (no-scaling laws), #93 (schedule semantics),
#12 (flag classes + dialogue pairing), #137/#127
(arrival evidence + first-arrival staging), #45/#100
(per-region locks), #37 (appearance chaining). No new
format: this spec is a *ruling layer* over the named
systems — its landing form is a cross-reference entry in
each of them, plus this doc.

## Coverage — honest

- **Rules: complete.** The two-class split covers every
  system the earlier packages built; any future system
  must declare its class at build time (world-open is the
  default for anything reading presence/world state;
  story-locked must name the flags it tests).
- **Content: none.** Which specific beats greet an early
  arrival in each region, and any authored "you're not
  supposed to be here yet" flavour, are content — OPEN.
