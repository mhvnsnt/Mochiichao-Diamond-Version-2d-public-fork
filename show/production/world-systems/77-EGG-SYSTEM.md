# #77 — EGG / DAY-CARE SYSTEMS → MOCHI EGG-SYSTEM SPEC

**What was studied.** The breeding architecture of the reference
games, as publicly documented: (1) a **compatibility taxonomy** —
every species carries one or two *egg groups*, and two creatures can
produce an egg iff they share a group (plus a universal-compat
exception class and a no-eggs class for species that never breed);
(2) **inheritance** — the offspring is the mother's (or the
non-universal parent's) species, may inherit *egg moves* (moves
learnable no other way, listed per species), and in later generations
inherits a bounded slice of the parents' individual variance;
(3) **hatch cycles** — an egg carries a cycle count; cycles burn down
with travel (steps/distance), with accelerants as explicit modifiers;
at zero the egg hatches into the line's first stage; (4) the
**day-care** as the system's home: a care facility that holds two
creatures, where the egg appears, and where held creatures also grow
slowly — care and breeding are one building, one register.

**Why this package exists.** Sideline A's gap audit found
`abilities`/`eggGroups` are **0/47 in the core data** — the
`eggGroups` field exists in `species.json` and in the intake record
template (`core_record.eggGroups`) and has never had a system behind
it. This spec is that system. It assigns **no species values** —
per-species group membership is the owed gap-fill (TBD), filled by
the lane under this spec, never guessed here.

## Native spec: `mochiichao/egg-system/v1`

### The groups (taxonomy — proposed for lane ratification)

Groups are keyed to **habitat + body plan**, using the `body_plan`
vocabulary the cast data already speaks (`compact_round`,
`bipedal_amphibian`, `bulky_bruiser`, `small_feline`,
`small_plant_biped`, `ghost_float`, …). A species carries **one or
two** groups. Two Mochi can produce an egg iff they share ≥1 group.

| group id | covers (body/habitat logic) |
|---|---|
| `meadow` | ground-dwelling mammal-like bodies, open land |
| `burrow` | digging / denning bodies |
| `canopy` | arboreal and climbing bodies |
| `pondside` | amphibian and waterside bodies |
| `tidepool` | fully aquatic bodies |
| `crag` | rock, shell and heavy-plated bodies |
| `sky` | winged / aerial bodies |
| `flora` | plant-bodied Mochi |
| `nightshade` | nocturnal and shadow-bodied Mochi |
| `spirit` | incorporeal / smoke / ghost-float bodies |
| `aether` | **universal-compat exception** — pairs with any group (membership by canon ruling only; no species assigned here) |
| `none` | **no-eggs class** — never produces eggs (partner-locked, legendary-class, or by canon ruling; assignment is a ruling, not a default) |

Rules:

- Group membership is **species data**, recorded in the core record's
  `eggGroups` (array of 1–2 group ids, or `["none"]`).
- `aether` membership is never inferred from anatomy; it is an owner
  ruling per species.
- A first-stage species and its own line always share ≥1 group with
  each other (a line must be able to continue itself); the validator
  below enforces this once assignments exist.

### The egg record

```json
{
  "egg_id": "<save-layer id>",
  "offspring_species": "<core id — the mother's / non-aether parent's line, first stage>",
  "parents": ["<individual id>", "<individual id>"],
  "cycles_total": "<from offspring species data: hatchCycles>",
  "cycles_remaining": "<counts down>",
  "inherited": {
    "egg_moves": ["<move ids — offspring learnset.egg entries the parents know>"],
    "variation_seed": "<bounded slice — see #80; which stats pass is system law there>"
  },
  "presentation": "egg | cocoon",
  "origin": "garden_daycare | <event source id>"
}
```

- `presentation`: canon already holds the name **Mochi Cocoon**.
  Whether a given species' pre-hatch form is an egg or a cocoon is
  **per-species data** (`hatchPresentation` on the species record) —
  OPEN for every species until the lane rules it; the system runs
  identically either way.
- `hatchCycles` is a new species-data field this spec adds to the
  intake template's owed list (beside `eggGroups`). Values are owed
  per species (TBD); the system defines the field, not the numbers.

### Cycle burn-down

- Cycles decrement on **distance travelled with the egg in the
  party** (the reference architecture's step counter, re-expressed
  as route distance so it composes with the Region 1 route graph).
- One modifier slot exists (`hatchRateModifier`, e.g. a Flame-body-
  style accelerant ability). **Which Mochiichao trait fills it is
  OPEN** — abilities are also 0/47; the slot is specified, the
  filler is not invented.
- At `cycles_remaining = 0` the egg hatches: the offspring individual
  is created under the #80 individual-variation model (fresh variance
  roll + any inherited slice), at the line's first stage, knowing its
  inherited egg moves.

### Day-care: the Garden is the home

Canon: **Assistant Mochiko opens the Mochi Garden at R1-BEAT3**, and
the Garden is the world's care register (Garden "contests" are
never battles-to-harm — donor research, EP01 staging). The day-care
function therefore lives **in the Garden**, not in a separate
building:

- The Garden holds up to **two** resident Mochi for breeding-care
  (residency is an event-flag state, #12 architecture:
  `vars.garden_residents`).
- An egg appears at the Garden when the two residents are compatible
  (shared group, neither `none`); discovery of the egg is a Garden
  beat, collected from Mochiko — show and game read the same event.
- Residents also accrue slow growth while resident (the day-care
  growth half of the teardown) — growth uses the species'
  `growthRate` field, already in the core record.

## Wiring

- **Core data:** fills the semantics of `core_record.eggGroups`
  (intake template) and adds `hatchCycles` + `hatchPresentation` to
  the owed-field list — register both in TBD-REGISTER alongside the
  existing eggGroups gap (GAP-AUDIT item 4).
- **Learnsets:** offspring egg moves read the existing
  `gameplay_rows.learnset.egg` array — already in the intake
  template; this spec is its producer.
- **Individual variation (#80):** `inherited.variation_seed` is
  consumed by the #80 model; the passing rule lives there.
- **Events (#12):** Garden residency + egg discovery are
  `vars.*`/`story.*` flags per EVENT-FLAG-ARCHITECTURE.
- **Evolution (#8):** offspring enter at the line's first stage per
  EVOLUTION-DATA-MODEL edges (edges point at stages; the egg system
  never names a stage itself).
- **Show:** an egg/cocoon beat is a Garden beat in the care register
  — no battle staging, per the Garden contest law in #78.

## Open slots (not invented)

- Per-species `eggGroups` assignments — 0/47 today; lane gap-fill.
- Per-species `hatchCycles` and `hatchPresentation` values.
- Membership of `aether` (universal-compat) — owner ruling per
  species; possibly no species ever holds it.
- The hatch accelerant trait (waits on the abilities gap-fill).
- Whether the show ever depicts breeding mechanics directly, or
  keeps eggs/cocoons as Garden discovery beats only — owner call.

**Content definition (List 14 #135, 2026-10-27):** this spec's owed `hatchPresentation` field is defined by `135-HATCH-PRESENTATION.md` (`show/production/species-data/`) — the owed-field loop closes there; the field's per-species values stay OPEN data via sheet intake.

**Validator citation (List 18 #171, landing 2026-10-27):** breeding compatibility is derived and validated by 171-BREEDING-COMPATIBILITY.md (show/production/species-data/171-BREEDING-COMPATIBILITY.md, checks V1-V5). This file owns the egg record and day-care; the compatibility derivation lives there, cited from here.
