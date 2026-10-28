# SILHOUETTE & DISCOVERY — Teardown #3: Silhouette and Discovery Rendering

**Sideline D, teardown 3 of 3.** How the classic games hide a
species until you've earned it, and the native Mochiichao system:
every discovery asset is *derived from the finished design's own
alpha channel* by `tools/discovery_assets.py` — wired here against
the canon cutouts and tested on Mochii, Gabu, and Wispkin.

---

## 1. What the teardown found

### 1.1 The core games mostly *withhold*; they rarely silhouette

The honest headline first: in the core-series games the dex does
not, in general, draw a black silhouette of an unmet species. It
does something cheaper and stricter — it **withholds**:

- the **two flag bitsets** (seen / owned, MOCHIIOTECA-FORMATS.md
  §1.2) gate every field. Unseen: the entry is a number and
  dashes — no name, no sprite, nothing to silhouette.
- Seen: name and sprite appear in the *list*, but the data page
  stays masked (Gen I literally renders `?'??"` / `???` for
  height/weight; description text unlocks at owned).
- Owned/caught: the full page unlocks — description, footprint,
  cry playback, habitat.

The footprint follows the same law: displayed on the entry page
only once the species is caught, and simply **blank** for species
with no footprint (Bulbapedia, Footprint).

### 1.2 The true silhouette is a broadcast/franchise device

The filled-black "who's that?" silhouette — a design reduced to
its alpha shape, ink-black, held for a beat, then revealed in
full colour — is the *show-side* convention (the anime's
long-running identification segment, later echoed in franchise
apps' nearby-radar silhouettes). It is built on exactly the same
state machine as §1.1 (unknown → recognised → known), but where
the games withhold the *image*, the show withholds the *colour
and detail* and gives the shape. That is the right trade for
Mochiichao: our show is visual-first (the Dark Forest Rule 12
moment is a silhouette beat), and the Design Gate already treats
"reads as a silhouette" as a pass/fail design test — the
discovery silhouette and the design-gate silhouette are the same
asset used twice.

### 1.3 The derivation is mechanical — and the games treat it so

In every era, the dex art pipeline stores one authoritative
sprite per species and derives the rest (list icon, footprint
stencil, masked states) from it. Nothing about discovery
presentation is separately authored per species except the
footprint bitmap itself. Our pipeline copies that economy:
**one design → alpha → silhouette + contact proxy; the only
hand-authored discovery asset is the refined footprint.**

---

## 2. Native system

### 2.1 One mask, three states

From the species' CURRENT canon cutout (the likeness of record;
never a text-invented image — Likeness Law), take the alpha
channel at threshold 128. That single mask drives:

| State | Flags | Art | Name | Card data | Footprint | Cry |
|---|---|---|---|---|---|---|
| **UNSEEN** | neither bit | none (card shows `???`) | hidden | all masked (`?·??` style placeholders) | hidden | silent |
| **SEEN** | seen | **silhouette** (solid ink fill of the mask) | shown | still masked | hidden | silent |
| **MET** | seen + met | full colour design | shown | full record incl. bio_short | shown (or blank if none) | playable |

(MET is our name for the owned/caught tier — a Mochi is *met*
and bonded, not captured; the flag semantics are the teardown's,
the word is ours.)

### 2.2 The tool

`tools/discovery_assets.py` (Pillow; Pillow is already the
workspace tooling standard). For a cutout + slug it emits:

- `<slug>.silhouette.png` — ink fill (`#14161c`) wherever
  alpha ≥ 128, transparent elsewhere, same canvas as the source;
- `<slug>.footprint.1bpp` — the 16×16 footprint grid packed per
  MOCHIIOTECA-FORMATS.md §3 (32 bytes, row-major, MSB-left);
- `<slug>.footprint.png` / `.txt` — preview + ASCII of the grid;
- `<slug>.discovery.png` — the three-state strip on the
  Mochiioteca card colour (`#d0f0f0`, identity kit) for review.

**Footprint derivation, honestly labelled:** the automatic
footprint is a *contact-patch proxy* — the bottom 18% band of the
design's opaque bounding box (its ground-contact zone) collapsed
onto the grid at 30% coverage. It is the gap-fill STARTING bitmap
the design lane refines against the sheet's `footprint_spec`
(foot count/type, gait, weight class — Brief §5 step 4: the print
is derived from anatomy, not clip-art). Species with
`foot_type: none` (floaters, swimmers) skip derivation entirely:
all-zero grid, blank print area — the original games' rule for
legless species.

## 3. Test run — pilot cutouts (this package, `test-output/discovery/`)

Run against `canon-cutouts/` (the cleaned, current versions —
Sproutle's baked-shadow file was NOT used; no-baked-shadows law
applies to derivations too, since a baked shadow would poison
both mask and contact band):

| Species | Source | Body alpha | Footprint proxy | Read of the result |
|---|---|---|---|---|
| Mochii | 380×380, bbox 13,12–363,328 | 54.7% | 197/256 cells | Silhouette is the drop + satellite droplets, instantly readable — a PASS-class discovery shape. Proxy print is a wide low blob with toe separations only in the last rows: honest for a round drop that sits *on* the ground; lane refinement should carve the two feet. |
| Gabu | 292×295, bbox 3,3–288,294 | 60.6% | 159/256 cells | Silhouette reads as the long-armed bruiser. Proxy's bottom rows split into **two distinct leg columns** — the closest of the three to a true print; still a proxy, refines to clawed feet per footprint_spec. |
| Wispkin | 288×609, bbox 3,3–284,608 | 45.8% | 15/256 cells | Silhouette is superb — mask, hands, dissolving smoke tail all survive in pure ink (the SEEN card is genuinely uncanny, which is the point of Wispkin's EP01 beat). The proxy "print" is a few smoke wisps: Wispkin floats and has no feet, so its sheet sets `foot_type: none` and the stored grid is **all-zero** — its in-world trace is FROST (canon), which is a trail asset, not a footprint bitmap. The tool output is kept in the test folder as the demonstration of why the flag exists. |

All `.1bpp` outputs are exactly 32 bytes; all state strips render
the three tiers on the card colour. Silhouette PNGs are
2.8–4.7 KB — derived assets are cheap, as the teardown predicts.

## 4. Wiring

- Pipeline steps 3–4 (Brief §5) run this tool on the finished
  design: outputs land beside the species' bundle, and the
  sheet's `silhouette_asset` + `footprint_grid` (base64 of the
  `.1bpp`) are filled from them.
- The game side consumes the same files: `seen_bits`/`met_bits`
  (MOCHIIOTECA-FORMATS.md §2) select which of the three states
  any surface renders — game dex card, show discovery beat, or
  marketing "who's that" card — one asset set, three consumers.
- Gate use: the silhouette doubles as the Design Gate's
  silhouette test input (DESIGN-THEORY G-series) — a design whose
  derived silhouette fails the read test fails before its bundle
  ships, no second asset needed.
- Style note: derivations come only from canon cutouts (the
  Mochiichao art of record), so silhouette ink and card colour
  are the only new pixels; no external finish enters here.

## 5. Coverage — honest statement

- **Fully documented, relied on:** two-bitset gating and the
  masked-until-owned presentation tiers (pokered/pokeemerald
  decomp docs; Bulbapedia for footprint gating/blank rule).
- **Franchise-level, not core-game:** the filled silhouette as
  the SEEN presentation is the anime/apps convention layered on
  the same flags — adopted deliberately for the show, and §1.1
  says plainly that the core games themselves withhold instead.
  Any future claim that "the games show silhouettes" would be
  wrong; this doc is the correction of record.
- **Our own parameters, not theirs:** alpha threshold 128, ink
  `#14161c`, the 18%-band / 30%-coverage proxy settings, and the
  MSB-left packing are native choices, stated so they can be
  tuned in one place (the tool's constants).
- **Not covered:** animated reveal transitions (the show will
  want a held-pose reveal per the posing system — a production
  decision, not a data format), and habitat/area masking
  (deferred with MOCHIIOTECA-FORMATS.md §5).
