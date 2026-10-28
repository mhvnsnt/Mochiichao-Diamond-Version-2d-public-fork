# #260 — CONTACT & PASSIVE DEFENCE ANATOMY → thorns and rough skin work in battle as abilities, and the anatomy is the citation

**The gap this fills.** Some bodies defend themselves
by being touched: thorns, spines, rough hide, stinging
hairs. The battle layer needs a rule for how that
anatomy acts when a physical move lands — and the
field layer needs the same anatomy to change how the
creature is *approached* long before any battle. This
spec gives both layers one pattern: **the anatomy is
real, it is drawn, and in battle it is expressed as an
ability whose data names the anatomy it comes from.**

**How Pokémon does it** (the pattern taken whole):
contact punishment lives in *abilities* — Rough Skin,
Iron Barbs, Poison Point, Static, Flame Body: when a
move that makes contact strikes the bearer, a stated
chance of a stated consequence for the attacker
(damage, a condition). A held item (Rocky Helmet)
does the same job from the item side. The ability is
the mechanic; the body is the reason. Mochiichao
keeps that split exactly.

## Native spec — `mochiichao/contact-anatomy/v1` (fragment beside this doc)

- **The citation pattern.** A contact-defence ability
  in the species' ability data (#107's system)
  carries one extra field this package defines:
  `anatomyBasis: {partId, note}` — `partId` a #259
  part (a `crest` of thorns, a `plate` of spines,
  rough `shell` hide), `note` one line of sheet prose
  saying what the toucher meets. The ability's
  *effect* (chance, consequence) is ordinary ability
  data under #184's resolution — an `on-taken` hook
  gated to contact-class moves, firing in #184's
  order like any other. **This package instances zero
  abilities and sets zero chances.** It defines how
  an ability, when the data lane writes one, declares
  the body it grows from — so the Pokédex-style text,
  the battle behaviour, and the drawing can never
  drift into three different stories.
- **The fairness rule (the anatomy is the cue).**
  #180's declaration law says a battle effect exists
  only with a visible cue. Contact anatomy satisfies
  it by construction — *if* the thorns are actually
  drawn. So: a species whose ability data cites an
  `anatomyBasis` must carry that anatomy visibly in
  its art and rig at every stage the ability is
  active (stage-gated via #259's `stageFirst`). A
  contact effect from an invisible source is a data
  error of the same class as #180's cue-less hook,
  and the landing checks treat it as one.
- **Items are the other door, and stay items.** A
  Rocky-Helmet-class effect belongs to #183's held
  items, with no `anatomyBasis` — the citation field
  is what keeps the two doors distinguishable in
  data: anatomy is never equippable, equipment is
  never grown (#258's non-join, from the other side).
- **The field side.** #152's wild view reads the same
  citation: a thorny individual's approach and
  threat-display are performed *with* the anatomy —
  displays present the thorns, and other creatures
  (and the follower AI, #160) keep the distance the
  drawing suggests. No numbers live here; the profile
  says how it looks, the citation says why it looks
  that way. In the Garden (#28), care behaviours for
  a cited species are written knowing hands meet
  thorns — a care-text fact, not a care mechanic.

## Show lane

Contact anatomy is choreography information: a show
fight against a thorny Mochi is staged around the
thorns (nobody grapples it bare-handed twice), under
the autonomous-action doctrine — the anatomy shapes
the fight the creatures choose, which is the show's
version of the same fairness rule. The citation is
what the board reads to know the thorns are canon,
not a one-episode invention.

## Wiring

Defines one field on #107's ability records (the
field is proposed into #107's home, cited from here);
resolution entirely #184's (`on-taken`, contact
gate); parts from #259; field reads via #152/#160;
item-side effects stay #183's. Writes: the one field
definition; instances nothing.

## Open slots

None that are mechanics. Which species carry contact
anatomy, and each ability's chance/consequence, are
species-data facts written by the data lane — the
pattern lands complete and empty, by design.

## Coverage — honest

- Architecture: Pokémon's documented contact-ability
  pattern, re-expressed as a citation discipline over
  systems Mochiichao already has (#107/#184/#259).
- Contents: zero abilities instanced; the yield is
  the `anatomyBasis` field and the drawn-anatomy
  fairness rule.
