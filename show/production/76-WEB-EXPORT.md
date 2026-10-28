# #76 — WIKI DATA ARCHITECTURE → public Mochiioteca web-export format

**Scope: export only.** This spec defines a file format a future
public Mochiioteca web page would consume. Nothing is published, no
site is built, and no external service is touched by this task.

**Teardown (public documentation).** Fan-wiki species pages (the
Bulbapedia pattern is the public exemplar of the genre) are stable
because they are **projections of a data record, not articles**: one
infobox schema (id, name, category, type(s), height/weight,
abilities), fixed sections in fixed order (biology/flavour,
game data — stats, learnset, evolution, habitat — media appearances,
artwork gallery), and *versioned presentation* (the same record
renders per-generation). The architecture lesson: a public page is a
**lossy, curated projection** of the internal record — internal
fields (provenance, TBD flags, provisional sources, production
notes) never render, and the page's stability comes from the schema
underneath it, not from editors' habits. The kit taken: projection
discipline + fixed section order + infobox schema. No wiki text,
data values, layouts, or assets are copied — every field below maps
from *our own* species-sheet schema.

**Native format — `mochiichao/web-export/v1`** (fragment beside this
doc). Derived field-by-field from the intake record
(`species-data-system/new-species-record-template.json`, whose shapes
copy `species.json` + the dex registry + the footprint manifest):

| Export field | Source (sheet schema) | Projection rule |
|---|---|---|
| `id`, `name` | gate0 numbering / core record | published only when owner-locked (Gate 0 passed) |
| `category`, `dex_text` | natural-history block / core `dexText` | house voice as locked; drafts never export |
| `types` | core record | element vocabulary as canon settles it (TBD D6 — export blocks on it per species) |
| `height`, `weight` | body block | **omitted when null** — the export never prints a TBD (internally they are TBD D5 for all 49 today) |
| `stats`, `abilities`, `learnset` | core record / gameplay rows | omitted while null or `provisional`-flagged — provisional data is an internal state, not a public fact |
| `evolution` | gameplay rows | line edges only where canon-locked (cf. world-systems evolution edges) |
| `habitats` | discovery block | map names at display-name layer (two-lane law: production names never export) |
| `footprint`, `silhouette`, `portrait` | dex entry / footprint manifest | media paths; footprint shown per the registry's own rule spirit — the *public* page policy is OPEN (see below) |
| `cry` | voice block / dex entry | V1 path; R1 listed as alternate take |
| `signature_move` | show block | display name only (rename law), never the internal id |

**Hard projection rules.** (1) No `provenance`, no TBD register
entries, no `notes`, no production/system vocabulary (no "Mainframe",
no id keys, no schema names) — the two-lane display sweep applies
to exports exactly as to the game. (2) Un-locked species (wave-1
future-considered) **do not export at all** — the public roster is
the registry roster, same honesty rule as #14's counting. (3) The
export is a *build artifact*: regenerated from the sheets by a
script at landing, never hand-edited — a hand-edited export is a
second source of truth, which is how wikis rot.

**Open policy calls (owner's, flagged not filled).** Whether the
public page mirrors the in-fiction discovery gating (footprint only
for "kept" species is an *in-game* rule; a public reference page
usually shows everything — the fiction-honest choice and the
reference-useful choice differ, and it is a product call); whether
stats publish at all; and where the export would ever be hosted.
All OPEN.

**Wiring.** Producer: species sheets (single source of truth).
Governance: #74 brand guide ch. 2/4 rules for how art/colour present
publicly. Consumer: none yet — format + one worked fragment only.

**Coverage.** Architecture: standard, fully documented genre.
Contents: mapping complete against the real sheet schema; the
fragment's example record is a *shape* example (values null or
canon-locked names only — no invented data).
