# #130 — FORME CHANGES → forme-change system (mid-battle form shifts)

**What was studied.** Mid-battle form-change mechanics in
the reference games, as publicly documented: certain
species carry multiple **formes** — same species, same
dex entry, different battle body — and shift between them
in battle under a criterion (a held condition, a move, a
state threshold), one-way in some documented designs,
freely reversible in others. The data lesson: the forme
is a property of the *individual in the battle*, recorded
against the species' form family — never a second species,
never an evolution. The presentation lesson: the shift is
a staged event with its own animation slot, distinct from
both the attack it may ride on and from growth sequences.
No species data, criteria, or text are copied.

## Three axes that must never be merged (read first)

Mochiichao already has two form-adjacent systems. This is
the third, and the three stay separate:

| Axis | System | What changes | When |
|---|---|---|---|
| Regional variant | #40 | type pairing, pattern, silhouette *details* — a designed form of the species | per region; fixed for the individual |
| Lustre | #15 | colours only, a palette map | per individual, out of battle |
| **Forme change** | **#130 (this)** | the battle body itself — silhouette class, stance, sometimes type/ability slots | **in battle, under a criterion** |

#40's own law is the guardrail: a form that can be lustre
carries its own palette map per form — so a forme under
#130 that is lustre-bearing inherits #40/#15 composition
(variant first, lustre second) *within* its form family.
And #42's law keeps the *presentation* separate: #42's
STATE sequences (Base/Bright/Guard/Overwhelm — emotional,
reversible) are not forme changes, and growth sequences
are evolution, never a forme shift. A forme change may
*use* #42's sequence grammar to stage itself; it is not
one of #42's states.

## Canon anchor (verified)

The roster already carries the seed case: **Strikechamp**
holds two form variants in the asset/dex layers —
`unsuited` / `unsuited_full` — tracked as forms of
Strikechamp, with their own footprints (AUDIT-WHAT-EXISTS;
GAP-AUDIT: "Strikechamp's `unsuited` / `unsuited_full`
variants are forms"). Canon fixes that the forms *exist*;
it does not fix their battle criteria — those are this
spec's OPEN slots, not facts to invent.

## Native spec — `mochiichao/forme-change/v1` (fragment beside this doc)

- `formFamily` — on the species record: the closed list of
  the species' form ids (`<speciesId>--<formSlug>`, the
  bundle variant-parsing convention #40 uses). A species
  with no family cannot forme-change; the field's absence
  is the rule, not a flag.
- `forme` (per individual in battle) — the individual's
  active form id, **battle state, not roster state**: it
  enters at the family's default form and any shift is a
  battle event. Whether a shift persists past the battle
  is a per-family rule (`persistAfterBattle`), never a
  global default.
- `criterion` — what fires a shift, closed vocabulary of
  *kinds* (contents OPEN): `move-use` (performing a named
  move shifts), `state` (a #27 condition or battle state
  threshold), `held` (a #31 item condition — the schema's
  move-class ban is untouched: a forme item is an item,
  not a move), `command` (Ranger-called, game lane).
- `direction` — `one-way` (the shift is the battle's fact
  once fired) | `reversible` (a counter-criterion returns
  the base form). Per family; ships unset per family until
  ruled.
- `statBlock` / `typeDelta` — a form may carry its own
  battle numbers/types as a delta against the species
  record (the #40 delta discipline applied in-battle:
  only what changes is listed). **Zero deltas asserted** —
  Strikechamp's forms' battle data is design content,
  OPEN.
- **Presentation hook:** the shift fires a #9 animscript
  performance block (the form-change beat is a performance
  with per-anatomy blocks like any other), staged under
  #42's grammar (held pose, channels in fixed order,
  identity survives — E4: silhouette *primitive* and
  signature motif persist across forms; a "form" that
  breaks the primitive is a different species wearing the
  name).
- **Dex/display:** the Mochiioteca records *forms met*
  within the species' entry (the discovery family #40
  already names as inherited) — a form sighting is a
  species sighting for `seen`/`met` derivation (#14); no
  form gets its own dex number, ever.

## Wiring

Species record (form family) + individual battle state;
criteria read #27 (states), #31 (held items — ids only),
#9 (shift performances), #42 (staging grammar), #14
(derivation), #40/#15 (composition when lustre-bearing).
Save impact: none asserted — active forme is battle
state; if a family rules `persistAfterBattle`, its field
joins the roster record at landing under #96's absent =
default rule, flagged in STAGING.

## Coverage — honest

- **Architecture: fully documented** (criterion-triggered
  in-battle formes across the reference eras).
- **Contents: one canon family (Strikechamp), all of its
  battle facts OPEN.** Criteria, direction, deltas, and
  persistence for Strikechamp's forms — and whether any
  other species holds a family — are owner/design
  decisions. The spec's work is the axis separation and
  the record shape, so a forme, when ruled, is data and
  not a special case in code.

**Criterion kind added by List 18 #175 (landing 2026-10-27, cited here — this file is the kind's only home):** `weather` — a forme criterion over #61's weather kinds, filtered by #142's climate layer (175-WEATHER-FORMES.md). NONE-EXCLUSION (schema-level rule): the weather kind NONE is excluded from the criterion input set; a criterion naming NONE is a schema error and fails validation. No family gains the kind at landing; Strikechamp's pairing stays OPEN.


**PROPOSAL from List 27 #257 (registered at its landing, 2026-10-27):** widen the `state` criterion kind so a family's criterion may also key off a *bloom state* — the state-bloom derivation in 257-BLOOM-STATES.md reads this file's axis and family record and founds no family of its own. The two bloom kinds stay unmerged: a state bloom is a derivation over this axis, never anatomy (the evolved-bloom crown class belongs to #259's parts vocabulary). Proposal discipline: the widening takes effect only as this home carries it here; no family gains a bloom criterion at landing — no wave-1 sheet declares a bloom family.
