# #43 — CREATURE SCALE SYSTEMS (teardown → show scale-chart system)

**What was studied.** How animation productions keep creature
sizes honest, as publicly documented in model-sheet practice
across the genre: every cast member is drawn once on a **scale
chart** (the line-up), assigned a size relative to a human
reference, and boards are forbidden from drifting it — because
the audience learns size as *identity*: a creature that changes
size between shots reads as a different creature. The reference
games carry the same truth in data (height in the dex record —
the thin card of MOCHIIOTECA-FORMATS carries height/weight
fields). Mochiichao already has the show half of this locked:
DESIGN-PRINCIPLES **A5, the size-class staging ladder**. This
system is the chart that makes A5 enforceable.

## What A5 already locks (restated, never re-derived)

Species are assigned a size class — **Palm / Knee / Waist /
Tower** — recorded in cast data. Boards stage keeper + creatures
by class contrast: Palm species on shoulders/hats/tech, Knee at
feet, Waist as scene partners, Tower as presences the frame
organises around. (DESIGN-PRINCIPLES §A5.)

## The chart system

- **One chart per cast group**, drawn in the Mochiichao art style
  from the species' actual approved art (Likeness Law — a chart
  is a production asset, not a sketch): the human reference
  (Mochiko's chart height — her proportion sheet is an open owner
  item, DESIGN-BRIEF §8 item 5; until her age/height locks, the
  chart's human column carries the **OPEN** marker and creature
  classes are staged relative to *each other*), then every
  species in class order, ground lines aligned.
- **Class bands, not centimetres, are the staging law.** The
  chart records for each species: `sizeClass` (A5 vocabulary),
  and — where the species' data record has them — the dex
  height/weight. Height/weight are currently recorded *nowhere*
  for the roster (Sideline A gap audit: TBD for all 49), so the
  chart is class-first: classes are assignable from approved art
  today; metric fields fill in when the owner/lane sets them,
  and the chart re-issues. A class is never *derived* from a
  guessed height.
- **Class assignment lives in cast data** (`cast.json` body data,
  beside `body_plan` — the pilot six already carry body plans
  there). New species get their class at design-gate time: the
  gate's silhouette test is read against the chart, and the class
  is recorded in the same pass that approves the design. A design
  without a class is not gate-complete.
- **Evolution lines hold a class *progression*, not a class.**
  Each stage carries its own class (wave-1 lines: parsed in the
  evolution edges, #8); the chart draws the line as a staircase.
  A stage that jumps two classes is a design-gate flag — legal,
  but it must be a decision, not a drift.
- **The chart is a gate input, not a poster.** Composite and
  board checks read it: a shot where a Knee reads at Waist
  height against the keeper fails the same way a silhouette
  failure does. Waist-class is the "scene partner" band — most
  dialogue staging happens there; Tower appearances are rationed
  by the mythical grammar (#41) when the Tower is also mythical,
  and by simple scarcity otherwise.

## Staging rules the chart makes mechanical

1. **Ground-line discipline:** in any multi-creature shot, feet/
   contact points share the scene's ground logic before any
   character is scaled to fit the frame. Scale is never the
   cheat that fixes a composition.
2. **Contrast pairings (A5):** Palm rides (shoulder/hat/tech —
   tech = the Mochiioteca and keeper board, which are Palm-scale
   stages by design), Knee anchors the keeper's feet, Waist
   partners at eye-line for wordless exchanges, Tower enters by
   parts (shadow, foot, eye-line from above) before wholes.
3. **Growth sequences (#42)** land at the *new* class framing:
   the LAND shot of a growth sequence is the chart position of
   the new form — the audience learns the staircase by watching
   it climbed.
4. **Regional variants (#40)** are charted as overlays on their
   base species' slot: same slot, delta silhouette drawn beside
   it — the chart is where "details change, primitive doesn't"
   becomes visible at a glance.

## Wiring

- Data: `sizeClass` in **cast.json** (proposed field beside
  `body_plan`; cast lane owns the file — flagged in STAGING);
  dex height/weight when set land in the species record and the
  **Mochiioteca size-screen** reads them (the Gen-III thin card's
  scale/offset display is the documented model, MOCHIIOTECA-
  FORMATS).
- Gate: **DESIGN-THEORY G-series / DESIGN-PRINCIPLES Part 3** —
  the class assignment joins the per-asset checklist output.
- Consumers: boards/composite (this chart), **#41** (mythical
  scale beat), **#42** (LAND framing), **#37** (rival parties
  are charted as a group so battle staging starts honest).

## Coverage — honest

- **Architecture: fully documented.** Line-up charts and human-
  reference staging are foundational, publicly documented model-
  sheet practice; A5 already translated the ladder into house
  law before this package existed.
- **Contents: classes assignable now, metrics absent.** The
  roster's height/weight gap is a known audit finding (TBD all
  49), and Mochiko's own proportion lock is an owner decision.
  The system is built to work class-first so neither gap blocks
  staging — and neither gap is filled here by invention.
