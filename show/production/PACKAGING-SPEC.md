# 54 — PRODUCT PACKAGING SPEC (box / blister grammar) — FUTURE

Teardown List 6, item 54. Forward spec for Jamar's Mochiichao
project: the grammar a future physical product line (figures,
plush, cards) would be packaged under, derived from publicly
documented retail-packaging conventions for character goods —
described as *layout grammar*, with no brand's trade dress copied.
Everything product-specific is OPEN: no product line exists yet,
and this spec's job is to make the decisions *enumerable* when it
does. Status: FUTURE — not a production document for any current
workstream.

Construction-kit rule applies in full: packaging carries
Mochiichao's own identity only — no other production's logos,
branding, or trade dress, in any layer, including "homage" layouts.

---

## 1. Teardown — the grammar of character-goods packaging

Documented retail conventions, generalised:

- **The front face is a billboard with a strict hierarchy:**
  (1) product window/blister or hero art, (2) brand block (logo,
  top-left or top-centre by house rule), (3) character name in the
  line's display typeface, (4) line/wave identifier, (5) age/safety
  marks in a fixed corner. The eye path is designed, not emergent.
- **The blister is a frame, not a hole.** Window geometry echoes
  the product's silhouette family; backing cards carry the scene/
  environment art so the product sits *in its world* on the shelf.
- **The back face is the catalogue:** line-up grid of the wave
  ("collect them all" panel), one paragraph of world copy, cross-
  sell, legal/safety block in a fixed footer. The line-up grid is
  the retention device — it sells the *set*.
- **Colour is line-coded:** each product line/wave owns a dominant
  colour family so shelf-scanning works at distance (the same
  dominant-colour classification discipline as COLOR-SYSTEM §1.1,
  at retail scale).

## 2. Native spec — packaging record per SKU (format)

```
sku_id            stable internal id (never the display name)
product: { species_id | character_id, form: figure|plush|card|OPEN,
           scale_class: from #43 scale system (List 5, when landed) }
package: {
  format:         blister_card | window_box | closed_box | OPEN,
  front: { hero: design_art_ref (CURRENT version only — currency law),
           brand_block_pos: OPEN, name_type: identity-kit face,
           wave_id: OPEN },
  back:  { lineup_refs: [species_ids in wave], world_copy: ≤60 words,
           per #48 voice rules (in-world artifact discipline) },
  palette: { dominant: species Dominant slot (COLOR-SYSTEM §a),
             line_family: OPEN per wave }
}
legal_block:      safety/age marks — OPEN (jurisdiction & product unruled)
```

## 3. House rules (set now, so the future line inherits them)

- **P1 — Canon art only.** Hero art is a CURRENT-registry design or
  model-sheet art; packaging never commissions off-style art
  (the Mochiichao style spec governs print exactly as screen).
- **P2 — No baked shadows in art files; shelf shadows are the
  package's own printed design, declared as such** (no-baked-shadows
  law governs the *character art asset*; a deliberate printed drop
  shadow is packaging design, recorded in the record, never smuggled
  into the reusable art).
- **P3 — Likeness gate applies to print.** A package front is an
  asset: it passes the same likeness + colour gates before release.
- **P4 — Species facts on the back are sheet facts:** the line-up
  panel and any dex-style copy pull from the locked species sheets
  via #48's entry rules — packaging never invents species facts.
- **P5 — Regional flavour is wave structure:** waves map to regions
  (R1 wave, R2 wave…) so the shelf tells the flavour progression
  (List: regional law) without a word of explanation.

## 4. Open decisions (enumerated for the owner, not filled)

Product forms and scale classes; wave composition and size; brand-
block position and the identity kit's print lockups; age/safety
jurisdiction set; whether cards (List 4 #36 frame grammar) are a
packaging-led or game-led line; manufacturer/print constraints
(entirely unresearched — flagged, not assumed).

## 5. Wiring points (future)

Identity kit (logo/type lockups) when it lands; parts-catalog
(print assets register beside screen assets, `print:` namespace);
#36 trading-card frame grammar (List 4) shares the wave/palette
fields. Nothing in current production depends on this spec.

## 6. Coverage notes

Packaging hierarchy conventions are standard, publicly documented
retail practice — described generically; no existing product line's
layout, logo, or trade dress is reproduced or adapted. This is the
most forward-looking item in List 6: confidence is high in the
*grammar*, nil in product specifics, which are honestly OPEN.
Licence/pricing note: no tools or services are specified, so no
licence claims arise; print production itself is unscoped future
work.
