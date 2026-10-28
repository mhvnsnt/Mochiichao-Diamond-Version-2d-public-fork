# HABITAT VARIANTS — environment-driven form notes (List 7, #57)

Teardown: how creature-collector games record the same species
differently by where it lives — habitat-driven form variation as
*data* (per-habitat notes attached to the species record), distinct
from region-locked populations and from palette variants. Public
architecture (decomp-documented species/form tables; published
design practice): one species record, variant blocks keyed by an
environment key, each block changing only a bounded band of the
design — surface, covering, proportion accents — never the core
silhouette or identity marks.

## The three variant systems, and how they compose

Mochiichao has three variant axes. They are different systems and
must never be conflated in a sheet:

| Axis | Grain | Driver | What may change | Where it lives |
|---|---|---|---|---|
| **Regional variant** | Population, region-locked | Region of origin (heritable) | Form band: body-plan accents, covering type, motif placement — a redesign band, gated as design | Species sheet, region block (List 3 #40 system) |
| **Habitat variant** (this doc) | Population or individual, within one region | Local environment (pond bank vs deep water, Garden lawn vs Forest edge) | Notes band only: covering texture/pattern density, seasonal coat, mud/wet sheen behaviour, minor proportion *accents* | Species sheet, `habitat_variants[]` (format below) |
| **Lustre** | Individual | Rarity variant | Palette only — derived, never drawn; silhouette, marks, eye colour family untouched (Lustre Law) | Sheet palette map; bundle `palette_variants` block (List 2 #15) |

**Composition order (fixed):** base design → regional variant
(form) → habitat variant (notes applied to that form) → lustre
(palette map applied last, over whichever form). A lustre of a
habitat variant is legal; a habitat variant may never be recorded
as a regional variant to dodge the design gate; a habitat variant
that needs a silhouette change is not a habitat variant — it is a
new form and goes back through the design lane as design work.

**Habitat-variant hard limits** (gate-checkable):
- Core silhouette unchanged (Design Gate silhouette test runs on
  the base; habitat notes may not move the outline).
- Eye construction and eye colour family unchanged (family grammar,
  Mochiichao Style Spec).
- Signature motif unchanged in placement; density/pattern of the
  motif's *field* may vary (e.g. denser spotting in Forest shade).
- No new anatomy. Accents are surface and proportion *trim* only.

## Native format — the habitat-variant block

Lives in the species sheet beside `discovery_block` (which already
carries habitats/methods/levels for `encounters.json`); the variant
block is the design-lane half of the same habitat data. One block
per habitat the species is canonically found in — habitats come
from the encounter/spawn tables (List 2 #7), never invented here.

```json
{
  "habitat_key": "pond_bank",
  "environment_pressures": ["wet margins", "reed cover", "dusk light"],
  "covering_notes": "…",
  "pattern_notes": "…",
  "proportion_accents": "…",
  "behaviour_notes": "…",
  "seasonal": null,
  "source": "sheet habitat field / spawn table row"
}
```

Field rules: `environment_pressures` are the *causes* — every note
below them must trace to a pressure (a note with no pressure is
decoration and fails review). `seasonal` is null unless canon
establishes a seasonal change; a seasonal note is a habitat
variant with a time key, not a fourth axis. `source` is mandatory
— habitat data still sits at seed level for most species
(TBD-REGISTER W6), so most species today carry **zero** habitat
blocks, and that absence is the honest state, not a gap this
format fills by invention.

## Wiring

- Design lane: when a species is designed, its sheet's
  `habitat_variants[]` blocks are delivered with the design as
  *variant notes* — the base design is what gets drawn and gated;
  habitat notes ride as an annex the show/game can apply (wet-sheen
  state at the Pond, shade-density at the Forest edge) without a
  redesign.
- Show: habitat notes feed LIVING-WORLD population treatment — a
  background individual at the Pond reads pond-bank, not generic.
- Game: `encounters.json` rows already key species by map; the
  habitat block's `habitat_key` joins to the spawn-table row, so
  the encountered individual's notes are the ones its map implies.

## Coverage

Architecture (keyed variant blocks on one species record, bounded
change band): fully documented publicly, high confidence.
Contents: exactly as complete as canon habitat data — seed level
(13 species across 3 maps); all other species' blocks are owed by
the world lane's encounter-table work, not authored here.
