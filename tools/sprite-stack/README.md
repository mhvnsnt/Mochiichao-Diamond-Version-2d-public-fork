# Sprite tool stack — manifest

Wired-up, open-source sprite tools for the Mochiichao 2D pipeline, plus
the saved atlas-cleanup tool next door. One entry point runs the whole
pipeline; every other script also runs standalone. Nothing here is paid,
nothing here phones home, and no tool in this stack overwrites its
inputs — clean and packed outputs are always new files.

## Runner

- `sprite_pipeline.py` — the single entry point. Runs, in order:
  extract → clean → pack → manifest, on a named creature.
  ```
  python3 sprite_pipeline.py --creature pyromonk \
      --cells-dir <atlas dir> --manifest <atlas dir>/<stem>.manifest.json \
      [--sheets-dir <2d-sheets dir>] --outdir <dir>
  ```
  With `--sheet <sheet> --roster-id <num>` it extracts from a source
  sheet instead of staging existing cells. `--with-rembg` adds an
  optional rembg pre-clean stage (off by default; fails loudly if
  rembg is not installed). Outputs land under `--outdir` only.

## Tools in this stack

| Tool | Licence | Source | Wired purpose |
|---|---|---|---|
| `../sprite-atlas-cleanup/clean_atlas.py` | Open source (Pillow + numpy, project script) | Saved from the 2026-10-25 cleanup run; report in `../sprite-atlas-cleanup/CLEANUP-REPORT.md` | Clean stage: cuts trapped sheet-background pixels from 64x64 cells under four gates (near-background, 3–400 px off-border, fully-interior, sheet-background colour match ≤25/channel). Runner imports its `clean_cell` gates. Proven: 50 atlases, 441 cells, 37,065 px; Pyromonk 8 cells / 292 px. |
| `extract_atlas.py` | Open source (Pillow + scipy, project script) | Saved from the local atlas extractor used for all 50 atlases | Extract stage: segments a draft sheet into poses, letterboxes each into a 64x64 cell, writes atlas PNG + manifest. Roles are heuristic guesses flagged `role_unconfirmed` unless an eye-verified override is supplied — it never guesses silently. |
| `pack_atlas.py` | Original project script (Pillow) | Written for this repo | Pack stage: deterministic shelf packing of cleaned cells into one atlas PNG + packed manifest (atlas_x/atlas_y per frame). No rotation, no rescaling. `--trim` optionally trims transparent borders and records the trim box. |
| `remove_background.py` | rembg: MIT; BiRefNet-general: MIT (preferred commercial default); u2net/u2netp fallback: Apache-2.0; BRIA RMBG-2.0: CC BY-NC — BLOCKED by the script. This script: original project wiring, no rembg code or model vendored | rembg: https://github.com/danielgatis/rembg ; BiRefNet: https://huggingface.co/ZhengPeng7/BiRefNet | Optional pre-clean stage: local ONNX background removal, default model `birefnet-general` (`pip install "rembg[cpu,cli]" onnxruntime`; model downloads on first use under `~/.rembg/models/`, NOT vendored). `--alpha-matting` adds the decontaminate pass. No paid API, no upload. Any BRIA/RMBG-2.0 session name is refused outright. If rembg is absent the script stops with install instructions — it never fakes a result. |
| `aseprite_export.py` | Aseprite: proprietary EULA (no redistribution). LibreSprite: GPLv2. This script: original project wiring | Aseprite: https://www.aseprite.org/ — LibreSprite: https://github.com/LibreSprite/LibreSprite | Pixel-editor integration: converts an Aseprite/LibreSprite JSON sheet export into the game's manifest frame format, and can run `aseprite -b` / `libresprite -b` to export a `.aseprite` file when a binary is on PATH. No editor binary is vendored. |
| `requirements.txt` | — | — | Runtime pins: Pillow, numpy, scipy (extract only); rembg/onnxruntime for the BiRefNet pre-clean stage (runtime model download, not vendored). |

## Already in `tools/` (NOT re-vendored here — see `tools/README.md`)

rot.js, FastNoiseLite, WFC, DSDecmp, ndstool (PR #7), plus the decomp
extraction scripts. This stack adds sprite tooling only; it does not
duplicate any of them.

## Deliberately left as install notes (not vendored), with reasons

- **FreeTexturePacker (MIT, odrick/free-tex-packer)** — the GUI
  equivalent of `pack_atlas.py`. It is an Electron app, so vendoring
  its full build is impractical and unnecessary: the wired CLI packer
  above is what the pipeline runs. Artists who want a visual packer
  install it from https://free-tex-packer.com — free, MIT, no account.
- **Aseprite (paid, EULA)** — its licence forbids redistributing
  compiled Aseprite, so no binary or build is shipped; use it via
  `aseprite_export.py` if you own it.
- **LibreSprite (GPLv2)** — free and redistributable in principle, but
  a full C++ editor build (plus Skia-class dependencies) is far too
  large to vendor for a pipeline script; use it via
  `aseprite_export.py` if installed, or build it from its repo.
- **rembg models** — the code is MIT and the script is wired, but the
  ONNX model files are runtime downloads (first use, `~/.u2net`),
  not repo files; shipping a model blob would bloat every clone.
- **Paid packers/editors (TexturePacker, Spine, etc.)** — licences do
  not allow redistributing the software; per the existing
  `tools/README.md` rule they stay as install notes only.

## Test (2026-10-25, local, before push)

Runner test on Pyromonk (the proven cleanup case), run from these exact
staged copies against the real Pyromonk atlas dir:

- extract: 30 frames staged, every cell validated 64x64.
- clean: 8 changed cells / 292 removed px / 292 atlas-applied px,
  sheet background (247, 246, 240) — exactly matching
  `CLEANUP-REPORT.md`, and the pipeline's clean cells (30/30) and
  clean atlas are byte-identical to the proven local clean outputs.
- pack: 30 frames, atlas 384x320 (6 cols x 5 rows), roles carried
  (frame 0: battle_back / battle / back).
- Aseprite converter: 3/3 frames from a synthetic hash-form export
  built from real Pyromonk cells.
- rembg `--check`: not installed in this VM — recorded as an install
  note below, not faked.

Any future clean run whose Pyromonk numbers differ from 8 / 292 means
the wired gates drifted from the saved tool and the run is invalid.
