# #99 — VILLAIN-TEAM ENCOUNTERS → Syndicate encounter system

**What was studied.** The antagonist-team encounter architecture
of the reference games, as publicly documented: a villain team
is fought at three structural tiers — **grunts** (repeatable,
low-tier, drawn from a small pool of party shapes and scaled by
where in the story you meet them), **admins** (named set-piece
encounters with authored parties and signature species), and a
**leader** (a boss encounter in the same grammar as the league's
top fights) — staged inside **hideout sequences**: gated spaces
whose doors, guards, and alarms are event-flag machinery, ending
in the admin/leader set-piece and a story-flag resolution. The
kit taken: the three tiers, pool-vs-authored party discipline,
and hideouts as flag-driven event spaces. No parties, dialogue,
names, or maps are copied.

## Canon anchors (Region 1)

- Canon names the organisation only as **the Syndicate**, and
  fixes exactly one of its seats: **the Syndicate boss leads
  Dojo 8**. That boss's **name is OPEN** — canon itself leaves
  it a gap (#30 carries it unfilled) — and this spec invents
  neither the name nor the person.
- Everything else about the Syndicate — member names, ranks
  beyond grunt/admin/boss, motives, hideout locations — is
  **OPEN**. This spec builds the encounter *system*; canon
  supplies the cast when the owner rules it.

## Native spec — three tiers, three party disciplines

- **Grunts — pooled, scaled by story and place, never by the
  player.** A grunt encounter draws a party from a per-area
  grunt pool (party *shapes* referencing species ids + level
  bands). The band is selected by **area band × story tier**
  (the highest `story.*` tier flag set) — scaling keys off
  *where you are and what the story has done*, never off the
  player's party. This is #52's balance law and #70's refusal
  of hidden rubber-banding applied to villains: wild area bands
  never read party state, and neither do grunts. A grunt pool is
  data; generating grunt parties may reuse the #94 generator's
  machinery (grunts are not named Rangers — #94's "named Rangers
  are authored, never generated" law is not violated), under
  pool constraints authored per area.
- **Admins — authored set-pieces.** An admin encounter is a
  **rival encounter record (#37)** staged through the
  **dojo-encounter script wrapper (#30)** with `tier: syndicate`
  (an additive tier value beside `dojo | elite | champion` —
  schema note for landing): intro sequence, fixed authored
  party, signature species, field conditions, resolution flag.
  An admin is written like a dojo master because structurally
  they are one: a fight that is *about* something.
- **The boss — one seat, two systems.** The Dojo 8 encounter is
  a #30 record (`tier: dojo`, master = the Syndicate boss) and
  simultaneously the Syndicate arc's leader set-piece. The two
  records reference **one party record and one resolution flag**
  (`progress.dojo_r1_08_clear` pays the Fragment; the Syndicate
  arc reads the same flag) — never two ledgers, per #45.

## Hideout event grammar

A hideout is an event space on the #12 architecture, specified
as a beat sequence any hideout instance fills:

```
ENTER (gate tests a story/tech flag)
  → PATROL (guard encounters on #93 schedule positions;
    guards are grunt-tier records placed as NPC encounters)
  → ALARM (optional state: a vars.* alarm level raised by
    detection events, lowered by scripted resets — alarm
    changes patrol density/doors, never grunt bands)
  → SET-PIECE (admin or boss record, #30 wrapper)
  → RESOLUTION (story.* flag set; the space re-reads its flags
    and changes state — emptied, sealed, or repurposed)
```

- Doors, warps, and guards are flag tests and effects in the
  #12 grammar — a hideout is scripts over the route graph
  (#11), not a new engine.
- **Loss rule** (inherited from #45's circuit ethic): losing to
  a grunt or admin never costs a kept Mochi and never re-locks
  a route; it returns the Ranger to the hideout's entrance
  state. Villains obstruct; they do not punish.

## Show-side echo

Show Syndicate grammar follows the boss-intro format (#64):
signature sound before sight, motif before face — and the
autonomous-action battle doctrine: Syndicate fights are living
fights Rangers sometimes direct, never turn-taking statues.
Grunt encounters in the show are *texture* (the organisation's
presence in a place); admin/boss encounters are *episodes*.
Which is which is a script decision the encounter record's
tier already encodes.

## Wiring

Party pools → spawn/balance discipline (#52, #7 bands); admins
and boss → #37 records inside #30 wrappers; hideout beats →
#12 flags + #93 schedules + #11 nodes; boss seat → #45 circuit
entry for Dojo 8 (same flag). Sound ecology of a hideout obeys
#84's roster-binding: it may only sound of species its tables
stock.

## Coverage — honest

- **Architecture: fully documented** across the public record;
  the tier/pool/hideout shape is not in dispute.
- **Contents: system only.** Zero Syndicate members, parties,
  hideouts, or motives are asserted. The boss's name and every
  content slot are OPEN, carried open into landing.
