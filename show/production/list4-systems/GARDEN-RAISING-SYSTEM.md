# #28 — CHAO-STYLE CARE / RAISING → Mochi Garden raising system

**What was studied.** The Chao Garden raising architecture (the
game's own stated second parent — repo WORKLOG: "Chao Garden +
Pokemon"): care **axes** (in Chao: Swim/Fly/Run/Power/Stamina)
raised by what the creature is given and does; an alignment axis
steered by who raises it and how; drives/needs that decay and are
refilled by care actions; and form outcomes read off the axis
profile at growth stages. All documented publicly in Chao
community documentation; the yield here is a native care-data
system for the Mochi Garden, not Chao assets or names.

## What canon already has

- **The Mochi Garden exists in canon**: Assistant Mochiko opens
  it at R1-BEAT3 ("The Mochi Garden is open now…",
  SEASON-CANON-MAP). It is a place and a story beat.
- **Per-species garden assets exist in the repo**: garden poses
  (sprite-art/garden-poses/, per-species sets + pose data) and
  per-species garden-form palettes (src/assets/garden-form-
  palettes/). The raising system's *presentation* layer is
  already stocked; what was missing is the care **data** under it.
- Canon sets **no care numbers, no axis names, no growth
  thresholds** for Mochiichao. Everything numeric below is a
  schema slot, `null` until an owner/balance pass.

## The native system — care profile per kept creature

`care-profile.schema.json`. One profile per *individual* (raising
is per-creature, never per-species — the individual-variation
doctrine applies: same species, different profiles):

- `axes` — five axis slots, mirroring the documented five-axis
  shape. **Axis display names are PROPOSED, not canon** (marked
  `status: PROPOSED` in the schema): the slots are keyed
  `axis1..axis5` internally so a naming pass renames display
  strings without touching data — the rename-law pattern.
- `alignment` — a single −1..+1 steering value with `null`
  magnitude rules: the *existence* of a keeper-steered axis is
  the documented Chao mechanic; what its poles are called in
  Mochiichao (and whether the show ever names them) is OPEN —
  THE SECRET discipline applies: production docs may hold the
  axis; in-world text does not lecture it.
- `drives` — need gauges (hunger/energy/affection class slots)
  with decay/refill hooks expressed as *rates by activity id*,
  values null. Activities join the Garden's interaction set;
  the activity list itself is OPEN (canon names garden
  interactions only in prose around R1-BEAT3).
- `growthReads` — at each growth stage, the profile is *read*
  (not consumed) to select presentation: garden pose set +
  palette form from the repo's existing per-species garden
  assets. The read rules (which axis leads → which form) are
  `rules: null` = OPEN; the join fields (`poseSetId`,
  `paletteFormId`) are fixed now so asset naming stays stable.
- `careLog` — append-only event list `{at, activityId, axis,
  delta: null}`; the log is the save-file truth, the profile is
  derived from it (same derived-never-stored discipline as the
  event/flag architecture — a profile can be rebuilt from its
  log, never the reverse).

## Wiring

- **Species sheets** — a species' sheet declares only whether it
  is garden-eligible and its garden asset ids; all raising state
  is individual (care profile), never species data.
- **Garden location systems** — spawn/population: garden
  residents are *kept* creatures (Mochiioteca completion state
  `kept`, #14), not wild spawns; the spawn tables (#7/#29) do
  not stock the Garden.
- **Show lane** — the Garden is the show's home set; care beats
  are story material. The show reads profiles only as *character
  notes* (this individual is keeper-raised, that one is wild) —
  no numbers ever appear on screen (subtitle law + THE SECRET
  discipline).

## Coverage — honest

- **Architecture: fully documented** (five-axis care, alignment
  steering, drives, staged form reads are the public Chao
  record).
- **Our contents: structural only.** Axes unnamed (PROPOSED
  slots), all values null, growth rules OPEN. This is a data
  home and a wiring contract, deliberately — inventing a raising
  balance table would be exactly the silent-fill the house law
  forbids.
