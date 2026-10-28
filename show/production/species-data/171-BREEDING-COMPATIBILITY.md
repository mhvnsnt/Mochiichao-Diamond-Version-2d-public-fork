# #171 — BREEDING COMPATIBILITY SYSTEM → the derivation + validation layer under #77

**Seat in the doctrine:** #77 built the breeding
system: the twelve-group taxonomy (`meadow, burrow,
canopy, pondside, tidepool, crag, sky, flora,
nightshade, spirit`, the `aether` universal exception,
the `none` no-eggs class), the egg record, the Garden
day-care where two residents produce an egg when
compatible, and inheritance consumed from #80. #77
also *names* a validator — "a line must be able to
continue itself; the validator enforces this" — but
does not spell out its rule set, and nothing owns the
pair-check itself as a formal derivation. **#171 is
that layer**: given the data #77 defined, compatibility
is a derived read with stated rules, and assignments
have validation rules the data lane can be checked
against. This package assigns **no groups**, changes
**no taxonomy**, and touches neither #77's egg record
nor #80's inheritance — it is proposed to be cited
from #77's home as its validator section.

**The verified gap (why this layer matters now).**
Sideline A's audit (GAP-AUDIT item 4) verified:
`eggGroups` is **0/47 in the core** — the field exists
in `species.json` and in the intake template
(`core_record.eggGroups`) and has never been valued.
Two records of the 49-species working roster (Dorowani,
Gabu) have no core records at all yet, so they cannot
even hold the field until their gap-fill lands.
Consequence, stated plainly: **today, no breeding pair
in the game is evaluable**, and the Garden pair-check
in #77 cannot fire. That is the honest state of the
data — this package's job is to make the derivation
correct for the day assignments land, not to paper
over their absence.

## Native spec — `mochiichao/breeding-compatibility/v1` (fragment beside this doc)

- **The pair derivation (read-time, stored nowhere).**
  Inputs: both species' `eggGroups`, both individuals'
  states. Output ∈ `{compatible, incompatible,
  unknown}` — three-valued, because unassigned data is
  not a "no":
  1. Either species' `eggGroups` empty/unassigned →
     **unknown** (data owed, never rendered as
     incompatible).
  2. Either carries `none` → **incompatible** (the
     no-eggs class is absolute).
  3. Either carries `aether` → **compatible** (the
     universal exception; membership is by owner
     ruling only, #77).
  4. Otherwise **compatible** iff the two group sets
     intersect (share ≥ 1 group — #77's rule, restated
     as the derivation's final step, not redefined).
  5. **Individual state gates** (state, not species):
     an individual in egg state cannot be a breeding
     resident — the egg record *is* an individual in
     egg state (#106) — and residency itself is read
     from #77's Garden state (`vars.garden_residents`),
     never duplicated here.
- **A deliberate non-import.** The reference
  architecture's gender gate is **not** part of this
  derivation: the audited species data carries no
  gender field for the derivation to read, and this
  package does not invent one. If canon ever rules a
  pairing constraint beyond groups + state, it arrives
  as a ruled input with a field to read — until then,
  groups and state are the whole derivation.
- **Assignment validation rules (for the data lane's
  future fill — the validator #77 promised):**
  - **V1** — every assigned species carries 1–2 group
    ids, or `["none"]`.
  - **V2** — line continuation: a line's first stage
    and every later stage share ≥ 1 group with the
    first stage (checked across #8's evolution edges).
  - **V3** — `none` is exclusive: `["none", x]` is a
    data error, always.
  - **V4** — `aether` assignments require a recorded
    owner ruling, cited on the assignment (the #80
    deviation-ruling discipline applied to species
    data).
  - **V5** — group ids come only from #77's taxonomy;
    a new group is a #77 schema revision, never a
    data-lane coinage.
- **Coverage is a derived report, not a claim.** The
  compatibility coverage read (species assigned;
  evaluable pairs as a fraction of the roster's pairs)
  is regenerated from core data whenever it is shown.
  Today it reads **0/47 assigned, 0 evaluable pairs** —
  and that number, not a reassuring paragraph, is the
  headline until the data lane fills assignments under
  V1–V5.
- **Display discipline.** The Garden and the Mochiioteca
  may show a pair's derived state — a read, never a
  stored verdict — and `unknown` must display as
  unknown. An unassigned species shown as "incompatible"
  would be the dex lying about missing data; #14's
  truthful-states discipline forbids it.

## Open slots (nothing invented)

Every per-species `eggGroups` assignment (data-lane
work under #77's taxonomy + V1–V5 — the largest single
owed fill in this package's neighbourhood, and not
this package's to make) · the `aether` roster (possibly
empty forever — #77) · whether the derivation ever
gains individual-level inputs beyond state gates (a
temperament-flavoured read, #108, is fiction seasoning
for the show lane — NOT asserted as data derivation) ·
`hatchCycles`/`hatchPresentation` values (owed in
#77's register, untouched here).
