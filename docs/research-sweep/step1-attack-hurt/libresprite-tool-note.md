# LibreSprite — tool note (Step 1, attack + hurt)

Source: LibreSprite, community fork of the last GPL-covered Aseprite
codebase. Licence: GNU GPL v2 (per the project's own README, as
reported in search results). This note stages NO LibreSprite code.

## What it is

A free, open-source frame-based pixel-art and sprite animation editor:
layers and frames, onion skinning, sprite-sheet export, palettes,
tag-based animation management, tiled drawing mode.

## What it is NOT for this lane

- Do NOT vendor LibreSprite source into the game repo: GPL v2 code
  vendored into the repo would carry GPL obligations into the game
  tree. Use it as an external artist tool only.
- Do NOT use it to justify copying any other editor's assets. Output
  art made in it by this lane's artists is this lane's own art.
- Aseprite itself (current releases) is proprietary, NOT open source
  since 2016-08-26 — do not treat current Aseprite source as available.

## Why it is newly useful here

The lane already has an export/pack pipeline script set, but no
recorded free editor for hand-drawing and retiming attack/hurt frames
with onion skinning. LibreSprite fills that authoring gap at zero cost
and with a sheet-export format the existing pack scripts can consume.

## Wiring target

- Owning step agent: Step 1 (attack + hurt).
- Target: artist workstation tooling only — no game code change, no
  repo file. Sheet exports go through the existing atlas pipeline and
  the Step 6 QA gates before any PR.
- Gate: an exported attack sheet must round-trip through the existing
  atlas cleanup script with no frame-order or transparency regression.
