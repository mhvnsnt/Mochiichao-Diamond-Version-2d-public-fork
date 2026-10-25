# Tools — committed in-repo

These tools are committed in this repo, not install-only, so a fresh clone
has them without re-downloading upstream. Full upstream repos are listed
below; `fetch-full-tools.sh` re-clones them in full for study if needed.

What is vendored here is the core source the game actually uses, with its
license. Docs, tests, and large sample-image sets from upstream are NOT
copied in, because they are not game code and would bloat every clone and
every Netlify build. That is a size decision, not a rule about what may be
used: the full upstream is still reachable via the script below.

## Vendored tools

- `rot.js/` — ROT.js, roguelike generation: dungeon maps, FOV, pathfinding.
  Vendored: `rot.min.js` (built) + license. Upstream: https://github.com/ondras/rot.js
  Wires into: Dungeon Mode, M6 open-world / procedural maps.
- `fastnoise/` — FastNoiseLite, single-header noise (Perlin / Simplex /
  OpenSimplex2). Vendored: `FastNoiseLite.h` + license.
  Upstream: https://github.com/Auburn/FastNoiseLite
  Wires into: terrain / biomes / encounter density, M6.
- `wfc/` — WaveFunctionCollapse, tile generation from hand examples.
  Vendored: core C# models (`Model.cs`, `OverlappingModel.cs`,
  `SimpleTiledModel.cs`, `Helper.cs`, `Program.cs`) + `samples/` +
  `tilesets/` + license. The upstream `images/` set (~28 MB of photos)
  is NOT copied in. Upstream: https://github.com/mxgmn/WaveFunctionCollapse
  Wires into: Binary Woods / Quartz Caverns tile generation, M6.
- `dsdecmp/` — DSDecmp, Nintendo DS compression formats (LZ10, LZ11, RLE,
  Huffman, LZOvl, Nitro composite). Vendored: `Formats/` + `Utils/` + license.
  Upstream: https://github.com/Barubary/dsdecmp
  Wires into: decoding DS-format data for study / conversion, research only.
- `ndstool/` — ndstool, NDS header / banner / filesystem handling.
  Vendored: full `source/` + COPYING. Upstream: https://github.com/devkitPro/ndstool
  Wires into: inspecting NDS container structure for study / conversion.

## Already in-repo as submodules (not duplicated here)

- `pokefirered-leafgreen/` — pret/pokefirered, FireRed/LeafGreen decomp
- `pokeheartgold/` — pret/pokeheartgold, HeartGold/SoulSilver decomp
- `pokebw2/` — fuddlesworth/pokebw2, Black 2/White 2 decomp (checkout
  failed 2026-10-25, see WORKLOG — do not treat as verified until a clean
  re-checkout succeeds)

## Extraction script

- `extract_firered_species.py` — parses
  `pokefirered-leafgreen/src/data/pokemon/species_info.h` into neutral JSON
  with source constants preserved. Output:
  `src/lib/generated/decomp_firered_species.json`
  Gen 3 has no physical/special category field; that is derived from type
  at conversion time, never silently invented in the source JSON.

## What is NOT committed here, and why (not an invented rule)

- Paid tools (Aseprite, TexturePacker, Spine, etc.): their licenses do not
  allow redistributing the software itself. The repo records how to use
  them; it does not ship them.
- Commercial game ROMs, official sprites, music, or proprietary
  Nintendo / Sega / Digimon assets: distributing those in a public repo
  is copyright distribution, even if the owner owns a cartridge. A dump
  the owner uploads himself stays private and local, never in this public
  repo. Conversion work here uses decomp source (already in-repo) and
  original Mochiichao art, not verbatim commercial assets.
- Large binaries (Ghidra, emulator binaries): GitHub rejects individual
  files over 100 MB and a multi-hundred-MB binary would break clones.
  Those are recorded as install notes in docs, with only small scripts
  committed, if any.
