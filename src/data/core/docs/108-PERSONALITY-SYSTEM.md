# #108 — PERSONALITY / NATURE SYSTEMS → temperament system

**What was studied.** The personality ("nature") architecture
of the reference games, as publicly documented: an individual's
temperament is one cell of a **5×5 grid** — which of the five
non-HP stats it favours and which it hinders — carrying a modest
growth modifier on each (the documented reference value is
±10%), a neutral diagonal (favours = hinders, no modifier), and
a **flavour-preference pair** (one liked, one disliked flavour)
that surfaces in feeding/care reactions and contest-style
judging. A separate short "characteristic" line is *derived*
from the individual's variance numbers. The architectural
lesson: temperament is **derived from the individual's seed**,
never rolled separately — one roll drives the nature, the
characteristic, and the fiction read, so they can never
contradict each other.

## The join with what already exists (the seam this spec owns)

#80 (individual variation) already derives a `temperament_read`
from the individual's `personality_seed` — explicitly as a
*fiction label* ("how this individual plays in the Garden/show;
not a stat modifier — the game lane may ignore it"). This
system is the **mechanical layer under that same seed**:

- **One seed, two reads.** #108 defines NO new roll and NO new
  seed. The temperament cell is a second derivation from #80's
  `personality_seed`, beside `variance.stats` and
  `temperament_read`. If the two derivations ever disagreed,
  that would be a bug in a derivation, not two facts.
- `temperament_read` stays #80's display/fiction label; the
  cell below is the game-lane mechanism. The show lane reads
  the label; the game lane reads the cell; neither lane reads
  the other's copy.

## Native format — `mochiichao/temperament/v1` (fragment)

```
temperament {
  favours:  hp-excluded stat key,   // atk|def|spa|spd|spe
  hinders:  hp-excluded stat key,   // equal to favours = neutral
  growthModifier: null,             // OPEN — see below
  carePreference:  { responds: <care family>, resists: <care family> },
  displayName: null                 // OPEN — no temperament named
}
```

- The stat keys are the core six-stat family's own keys (the
  same keys #80's variance block uses: `hp/atk/def/spa/spd/spe`),
  with `hp` excluded from the grid per the documented reference
  pattern — stated as an architecture choice, not a canon fact.
- `growthModifier` ships **null**. The reference value (±10%)
  is documented, but Mochiichao's modifier is a balance number
  and no canon or owner source sets it — asserting 10% here
  would be exactly the invented-value error the core README
  forbids. The *shape* (one modifier, applied symmetrically to
  the favoured/hindered pair) is specified; the value is OPEN.
- `carePreference` replaces the reference system's flavour pair
  with the native equivalent: the **care families** of #39's
  care-typed effort (`vitality | bond | body | sense | battle`)
  read through #28's care axes. `responds` = the family this
  individual takes to most readily; `resists` = the one it takes
  to least. What "readily" *does* numerically (accrual rate,
  care-axis gain, reaction threshold) is **OPEN** — this spec
  fixes where the preference lives and what it may feed, not
  its strength. Presentation side is free and immediate: feeding
  rounds and check-ins (#39's sources, the Garden care loop
  #65) play the preference as behaviour — a Mochi that leans
  into one kind of care and sulks at another is temperament the
  audience can see, with no numbers shown.
- `displayName` ships null for all 25 cells. Temperament names
  are display-layer strings under the rename law (#23 lookups);
  naming the grid is an owner naming pass, like the move
  renames. The fragment keys cells by `(favours, hinders)` pair
  precisely so names can attach later without touching data.

## Wiring

- **#80 individual record:** the temperament block is a derived
  view of `personality_seed`; if stored at all, it is stored as
  the derived cell beside #80's variance — recomputed on load,
  never a second source of truth (#96 save integrity's
  derived-data rule applies).
- **#39 training:** the effort block's `familyMap` is already
  OPEN; temperament's `carePreference` is a *candidate* input to
  accrual flavour. Whether preference touches accrual at all is
  **OPEN** (proposed interface, unruled) — #39's caps and
  ledger are unchanged either way.
- **#28 garden raising:** care axes consume preference as
  reaction/presentation data now, mechanics later if ruled.
- **#77 egg system:** inheritance passes variance slices (#80's
  rule); temperament is NOT inherited as a cell — the offspring's
  fresh seed derives its own. (Consistent with #80: deviations
  are never inherited; temperament is a derivation, not a gene.)
- **Battle:** the growth modifier, once valued, composes inside
  #17's staged pipeline like every other modifier — temperament
  never carries its own damage math, and #18 AI treats it as
  public information (it is visible in care long before battle).

## Coverage — honest

- **Architecture: fully documented.** Seed-derived grid +
  preference pair is the documented reference pattern.
- **Contents: shape only.** Modifier value, all 25 display
  names, preference strengths, and the #39 accrual interface are
  OPEN. What is finished: the one-seed discipline, where the
  block lives, and what it may and may not feed.
