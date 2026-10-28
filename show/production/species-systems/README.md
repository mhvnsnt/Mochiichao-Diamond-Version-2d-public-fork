# Species-Systems Teardowns (Sideline D)

Three teardowns of the classic creature-collector systems, turned
into native Mochiichao specs, code, and wiring — studied from
public documentation and the open community decomp projects
(pret pokered / pokecrystal / pokeemerald, Bulbapedia). Every
deliverable is written in our own words and code for our own
species; no game data tables, text, or assets are reproduced.

| # | Doc | Yield |
|---|---|---|
| 1 | `MOCHIIOTECA-FORMATS.md` | Dex data architecture teardown → the native Mochiioteca species record + the 16×16 1bpp footprint grid format, mapped field-by-field onto the species sheet. |
| 2 | `CRY-SYNTH.md` | Cry synthesis teardown → `tools/cry_synth.py` (stdlib-only renderer), `tools/pilot_six_cries.json` (draft parameters for the pilot six), and the sheet wiring: `species-sheet-schema-patch-cry.md` + `cry-schema-fragment.json`. |
| 3 | `SILHOUETTE-DISCOVERY.md` | Silhouette/discovery teardown → `tools/discovery_assets.py` (silhouette + footprint derivation from canon cutouts, three discovery states), tested on Mochii / Gabu / Wispkin. |

`STAGING.md` — repo homes for everything here; nothing in this
package is TeraBox-class (largest file ≈ 71 KB).

`test-output/` — proof-of-run: six rendered cries (`cries/`) and
the discovery derivations for the three test species
(`discovery/`). Kept as evidence; production assets are promoted
per STAGING.md.
