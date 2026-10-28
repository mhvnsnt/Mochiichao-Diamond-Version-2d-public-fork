# #40 — REGIONAL VARIANT SYSTEMS (teardown → native format)

**What was studied.** Regional-variant systems in the reference
games, as publicly documented: the same species, in a different
region, is a **different record wearing the same name** — its own
type pairing, its own palette *and* pattern, sometimes its own
silhouette details and behaviour — registered in the dex as a form
of the species, not a new species. The data lesson: a variant is a
**delta record** against the base species, listing only what
changes, with everything unlisted inherited. The registration
lesson: base and variant share one dex number/slot family; the
variant never re-files the species.

## Lustre vs variant — the distinction, and how they compose

Mochiichao already has one variant system: **lustre** (List 2,
#15). The two systems are different depths of change and must
never be conflated:

| | Lustre (#15) | Regional variant (#40) |
|---|---|---|
| What changes | Colours only — one palette map | Type pairing, pattern/markings, palette, silhouette *details*, behaviour, cry colour |
| Artwork | None — derived from base pixels by the map | Real — a designed form, built from the species' actual art under the Likeness Law |
| Identity locks | Outline, eyes, protected colours never mapped | Silhouette *primitive* and signature motif never change (E4: identity survives) |
| Data home | Species sheet palette block; bundle `palette_variants` | This delta record, beside the species record |
| Registry | Variant entry under the base bundle | Form entry under the base species' dex slot |

**Composition rule:** a regional variant may itself carry a lustre
map. The order is fixed: **variant first, lustre second** — the
lustre map is authored against the *variant's* palette (each form
that can be lustre carries its own map, authored in that form's
sheet data). A base-form lustre map is never applied to a regional
form: palette maps are per-form data, exactly as the #15 proposal
already requires maps to live with the species data they describe.
In bundle terms: the variant is a form of the species with its own
poster/clips under the avatar stack; its bundle entry may then
carry a `palette_variants` block of its own. Neither system
reaches into the other's layer.

## The delta record — `regional-variant.schema.json`

- `variantId` — `<speciesId>--<regionTag>` (double hyphen, the
  bundle format's variant parsing convention, #15).
- `baseSpeciesId` — the species this is a form of.
- `region` — region id (`region-1`…; Regions 2–5 exist in canon
  for later seasons — a variant may only cite a region canon has
  opened; Region 1 is the home form by definition and takes no
  variant record).
- `delta` — only changed fields, each with `status`:
  `types`, `paletteSeed`, `patternNotes`, `silhouetteDetailNotes`,
  `temperamentNotes`, `cryColourNotes`, `habitatShift`
  (spawn-table area ids, #7), `growthPath` (evolution edge ids,
  #8, where the form's line differs).
- `unchanged` — the explicit inheritance list: silhouette
  primitive, signature motif, signature move mapping, footprint
  *type* (the print itself is re-derived per form, workflow step
  4), discovery family. Listing inheritance explicitly is what
  stops a variant from drifting into a new species by accretion.
- `designGate` — the variant's art passes the same gates as any
  design (MASTER gate G-series; likeness scored against the
  *base species'* model sheet for identity, and against its own
  approved form art thereafter — currency law applies per form).

Silhouette *details* may change (an added crest, a longer tail
tuft); the silhouette *primitive* — the shape-language read at
16px — may not. That line is the whole system: a variant you can't
recognise as the species isn't a variant, it's a new species
wearing a borrowed name, and the intake template (Gate 0) is where
that case belongs instead.

## Wiring

- Registry: forms register under the base species in the
  **Mochiioteca**; completion (#14) counts *species* — a variant
  is a form entry, and whether forms count separately toward any
  completion reward is an **OPEN owner decision** (the completion
  doc's ladder is by kind only; this package does not settle it).
- Spawns: a variant's `habitatShift` points at its region's spawn
  tables (#7); a base form never spawns in a variant's table
  unless canon says both live there.
- Show: a variant's first appearance is a lab/field reveal beat
  (#46) or a transformation-grammar *contrast* staging (#42 §E4:
  identity surviving difference is the visual thesis).
- Flavour progression (canon): R2 leans Digimon, R3 Monster
  Rancher, R4 mix+originals — that is a *design-influence* dial
  for new species; regional variants are the in-world mechanism
  that lets one species honestly wear a region's flavour without
  breaking the one render style of record.

## Coverage — honest

- **Architecture: fully documented.** Delta-against-base form
  records with shared registry slots are the documented variant
  pattern; the palette-only vs full-form distinction is exactly
  how the reference series separates its two variant depths.
- **Contents: zero instances asserted.** Canon's flavour law
  names regional *influences*; it names **no regional variant
  species** — first-lustre placement itself is an open item
  (DESIGN-BRIEF §8 item 13), and variants are a step beyond
  lustre. This package ships the format, the composition rule,
  and the identity line. Every instance awaits owner canon.
