# MOCHIIOTECA FORMATS — Teardown #1: Dex Data Architecture

**Sideline D, teardown 1 of 3.** What the classic creature-collector
games actually store for one species, studied from public
documentation and the open community decomp projects (pret's
pokered / pokecrystal / pokeemerald and their wikis, Bulbapedia's
data-structure articles), and the native Mochiichao format derived
from that study. Everything below the "Native spec" heading is our
own format, written for our own species; no game data tables, text,
or assets are reproduced anywhere in this package.

---

## 1. What the teardown found

### 1.1 One species = several small records, not one big one

Across three hardware generations the decomp projects show the same
architectural decision: **a species is split across specialised
tables, each indexed by species number, each with a fixed job.**

**Generation I (pokered decomp).** The battle/body record
(`BaseStats`, 28 bytes per species, table sorted by dex order) holds:
dex id (1B), five base stats HP/Atk/Def/Speed/Special (5B), two type
ids (2B), catch rate (1B), base EXP (1B), a sprite-dimension byte
(1B), front/back sprite pointers (2×2B), four starting moves (4B),
growth-rate id (1B), a TM/HM learnset *bitfield* (7B), padding (1B).
Names live in a separate fixed-width table (10 bytes per name).
The **dex record is a third, separate thing**: a category string
(e.g. "SEED") terminated by a sentinel byte, then height (two bytes:
feet, inches in the US build), then weight (a 16-bit little-endian
value in tenths of a pound), then a pointer to paginated entry text.
Entry text is written in a tiny page format — `text` / `next` /
`page` directives — sized for a two-screen handheld display. Height
and weight for a species you have not caught render as the literal
placeholder strings `?'??"` and `???` lb.

**Generation II (pokecrystal decomp)** keeps the split and adds the
cry table as its own structure (§CRY-SYNTH). The dex gains the
footprint display (see §1.3).

**Generation III (pokeemerald decomp)** states the dex record as a C
struct — the clearest statement of the pattern:

```
struct PokedexEntry {
    u8        categoryName[12];   // e.g. "SEED"
    u16       height;             // decimeters
    u16       weight;             // hectograms
    const u8 *description;        // flavor text (pointer, not inline)
    u16       unused;
    u16       pokemonScale;       // ┐ size-comparison screen:
    u16       pokemonOffset;      // │ how big the species draws
    u16       trainerScale;       // │ next to a human, and where
    u16       trainerOffset;      // ┘ it sits
};
```

One entry per species in a single array. Note what the struct does
NOT contain: no name (separate table), no stats (separate table),
no footprint and no cry (separate graphics/audio tables), no art
(pointer tables per asset kind). **The dex record is a thin card
that points at everything else.** The info screen built on it shows
category, HT, WT, description and footprint, with three subscreens
hanging off the same record: AREA (habitat map), CRY (plays the cry,
shows its waveform and a volume/pitch meter), SIZE (the scale
fields above, drawn against a human figure).

### 1.2 Discovery is two bits, and everything keys off them

Player progress is stored as **two bitsets — one bit per species
each**: a `seen` array and an `owned` array, persisted in the save
file. Gen I keeps them as WRAM flag arrays copied into the save;
Gen III exposes them through a get/set flag API
(`FLAG_GET_SEEN` / `FLAG_SET_CAUGHT` / `FLAG_SET_SEEN` /
`FLAG_SET_CAUGHT`). The SEEN / OWN counters on the dex front page
are literally a population count over those bitsets. Rendering
rules keyed on the bits:

- **Neither bit:** the list shows a number and dashes — no name, no
  art, no data.
- **Seen only:** name and art appear in the list; the data page
  stays masked (placeholders for height/weight; no description).
- **Owned/caught:** the full card unlocks — description, footprint,
  cry playback, habitat.

(Per-generation masking details vary — exactly which fields mask at
"seen" differs between Gen I and Gen III — see Coverage, §4.)

### 1.3 The footprint is a 1-bit bitmap on a fixed grid

From Generation II through V (and the BDSP remakes), the entry's
first page carries the species' footprint — **shown only once the
species is caught**; species without feet show a blank space, not a
substitute graphic. In the Gen III decomp the footprint is a
per-species asset stored as `.1bpp`: a two-colour (black/white)
indexed source image compiled to a **1-bit-per-pixel bitmap**, drawn
by a dedicated `DrawFootprint` step into its own window of the info
screen. The format concept that matters for us:

- fixed square grid, same for every species;
- one bit per cell — a footprint is a *stencil*, not a picture;
- stored as a tiny packed byte string per species (a 16×16 grid at
  1 bit/cell is 32 bytes — the whole roster's footprints cost less
  than one portrait);
- "no footprint" is representable in-band: the all-zero bitmap.

### 1.4 Cry is a pointer + parameters, not a recording (Gen I–II)

Covered fully in CRY-SYNTH.md; the architectural point for this
doc: the species record never holds audio. It holds an index into
a cry table, and the table holds parameters. Audio is *derived
data*, rendered at runtime — the same relationship our sheet has
to its rendered WAV.

---

## 2. Native spec — the Mochiioteca species record

**Design rule taken from the teardown:** the Mochiioteca record is
a thin card. Body/battle data lives with the game data; art lives
in the bundles; the card holds presentation fields and *pointers*.
One record per species, keyed by Mochiioteca number, identical in
game data and show data (two-lane law); internal ids never change
when display names do.

| Field | Type | Rule |
|---|---|---|
| `mochiioteca_no` | int | Card number; batching and ordering key (Brief §5 step 8). |
| `species_id` | string | Stable internal id (lowercase slug). Never renamed. |
| `display_name` | string | In-world name; display sweep applies here only. |
| `category` | string ≤ 12 chars | The one-line kind label ("Seed", "Night Keeper"). Mirrors the 12-byte category field of the Gen III record — short by design. |
| `types` | [string] 1–2 | Elemental types, display names. |
| `bio_short` | string | The card text. Written to the paginated-entry discipline: plain sentences, no line over ~36 chars when set as card lines, whole entry ≤ ~230 chars. This is the text that unlocks at MET. |
| `bio_long` | string | The full bio for show/production use (habitat, behaviour, care). Not shown on the device card. |
| `height_dm` | int | Height in decimetres (tenths of a metre), stored metric like the Gen III record. Display converts (ft/in) at render time; never store imperial. |
| `weight_hg` | int | Weight in hectograms (tenths of a kg). Same conversion rule. |
| `display_scale` / `display_offset` | number | How large the species draws next to a human in the size-comparison view — the native descendant of the Gen III scale/offset fields. Set once per species from its finished design. |
| `footprint_spec` | object | Anatomy the print is derived FROM: `foot_count` (int), `foot_type` (`paw`/`hoof`/`webbed`/`claw`/`fin`/`none`), `gait` (`biped`/`quadruped`/`hop`/`slither`/`float`/`swim`), `weight_class` (`light`/`mid`/`heavy`). Filled at DATA step (Brief §5 step 1). |
| `footprint_grid` | string | The derived print itself: base64 of the packed 16×16 1bpp bitmap (32 bytes), §3. All-zero = no print. Filled at pipeline step 4, derived from the finished design. |
| `silhouette_asset` | path | Ink silhouette PNG derived from the finished design (pipeline step 3); see SILHOUETTE-DISCOVERY.md. |
| `cry` | object | The CRY SYNTH block — see `species-sheet-schema-patch-cry.md`. Filled at pipeline step 5. |
| `discovery` | object | Reveal behaviour: `seen_name` (bool — name shown at SEEN; default true), `subtitle_eligible` (bool — may this species carry an important-moment subtitle; rationed per subtitle law), `reveal_note` (staging note for the show's discovery beat, e.g. "frost trail first, body later"). |

**Discovery flags are NOT in this record.** Following the teardown,
seen/met state is player-side progress, stored as two bitsets
(one bit per species, indexed by `mochiioteca_no`) in the
save/profile layer — `seen_bits`, `met_bits` — never duplicated
into species data. The record only declares how each state
*presents* (the `discovery` block + which fields mask, §1.2's
three tiers, specified for our renderer in
SILHOUETTE-DISCOVERY.md §3).

## 3. The footprint grid format (native, fixed)

- Grid: **16 × 16 cells**, one bit per cell, **32 bytes** packed.
- Packing: row-major, top row first; within a byte, **MSB is the
  leftmost** of the 8 cells. (Our own packing, stated so any tool
  can read it; the decomp's `.1bpp` assets use the same 1-bit
  stencil concept through the GBA tile pipeline — see Coverage.)
- Sheet storage: base64 of the 32 bytes in `footprint_grid`, plus
  a PNG preview at use size wherever the sheet renders visually.
- Derivation: from the finished design + `footprint_spec`, via
  `tools/discovery_assets.py` (contact-patch proxy) and lane
  refinement; a print is an anatomy drawing, not clip-art (Brief
  §5 step 4). `foot_type: none` ⇒ all-zero grid, blank display.

## 4. Field-by-field mapping onto the species sheet

Sideline A's intake schema organises a sheet by elements; the
Mochiioteca record maps onto them one-to-one. (A's schema files
had not landed when this was written; mapping is onto the agreed
element list, and field names above should be adopted as the
element internals.)

| Sheet element (Sideline A) | Mochiioteca fields | Notes |
|---|---|---|
| type / description | `types`, `category` | Category is the ≤12-char kind label; types are display names (ids stable). |
| bio_short | `bio_short` | The unlock-at-MET card text, paginated-entry discipline. |
| bio_long | `bio_long` | Production bio; never on the device card. |
| body data | `height_dm`, `weight_hg`, `display_scale`, `display_offset` | Metric storage, display conversion — Gen III pattern. Battle stats are NOT card data; they stay in game data (`src/data/core/species.json`) as the decomp's split dictates. |
| footprint | `footprint_spec` (data step) → `footprint_grid` (derived step) | Spec is data; grid is derived. Both must exist for a complete sheet. |
| silhouette | `silhouette_asset` | Derived from finished design only (Likeness Law: from the actual art). |
| discovery | `discovery` block + external `seen_bits`/`met_bits` | Record declares presentation; flags live in profile/save. |
| cry | `cry` block (schema patch) | Parameters on the sheet; WAV is derived data at `public/audio/cries/`. |

## 5. Coverage — honest statement

- **Fully documented in public sources, relied on above:** the
  Gen I base-stats record layout and the separate dex record
  (category/height/weight/page-pointer) — pret/pokered + ROM
  structure notes; the Gen III `PokedexEntry` struct, page
  architecture, and the seen/caught flag API — pokeemerald decomp
  documentation; Gen II's 6-byte cry table entry — pokecrystal
  documentation; footprints as a Gen II–V dex feature gated on
  caught, blank for legless species — Bulbapedia.
- **Documented but not independently re-verified here:** the exact
  on-hardware byte packing of Gen III `.1bpp` footprint assets
  (tile order inside gbagfx output). Our spec fixes its own
  packing (§3) and does not depend on theirs.
- **Partially documented:** which individual fields mask at
  "seen" varies by generation and the sources summarise rather
  than enumerate for every gen; our three-tier table (§1.2) is
  the consensus pattern, and SILHOUETTE-DISCOVERY.md §3 fixes
  OUR tiers explicitly rather than claiming theirs.
- **Not covered by this teardown:** Gen IV–IX record internals
  (the pattern persists but adds form/gender/variant axes our
  roster does not yet need); habitat/area data structures (the
  dex AREA subscreen's map encoding) — a future teardown if the
  Mochiioteca grows a habitat page.
