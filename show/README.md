# The Mochiichao Show — home inside the game repo

This folder is the show's front door. The show lives **inside this
game repo on purpose** (Jamar's decision): anything made for the show
can be pulled straight into the game, and anything the game makes can
be pulled straight into the show. The two-way layer is `shared/`
(below) — assets are referenced in place, not copied.

**Governing rule for everything here:** [WORKING-METHOD.md](WORKING-METHOD.md)
— the construction-kit rule.

## Map of the show (this repo)
| Place | What |
|---|---|
| `show/bible/` | Show bible + animation playbook (being built) |
| `show/scripts/` | Episode scripts, beat sheets, cue sheets |
| `show/episodes/` | Per-episode working folders (EP01…) |
| `show/production/research/` | Five-series production research + holdings pointers + acquisition checklist |
| `show/production/rigs/` | Rig standard, cast rig specs, rig scaffolds |
| `show/production/tooling/` | Tooling index, materials index, pipeline spec, templates |
| `show/assets/` | Show-only backgrounds/props at use size |
| `show/shared/` | **cast.json · parts-catalog.json · clip-index.json** — the two-way layer |
| `show/exports/` | Finished episode/trailer exports (release copies) |
| `docs/show-sources/` | Donor source index (CN five-show mix) |
| `tools/avatar-pipeline/` | Bundle/clip generation pipeline |
| `public/assets/show-bundles/` | Character bundles |
| `public/assets/show-trailers/` | Trailer exports |
| `sprite-art/` · `src/assets/` · `public/audio/` | The game's own art/audio — the show pulls these in place via `shared/cast.json` |

## The two-way rule
- **Game → show:** reference the game asset's path in the manifests.
  One file, two users — never copy it into `show/`.
- **Show → game:** when a show-made asset is game-ready, its finished
  version is promoted into the game's normal homes (`sprite-art/`,
  `public/assets/`) and the manifest records both paths.
- **Donor material:** catalogued in the indexes; only
  construction-kit material (per WORKING-METHOD) crosses over, in
  Mochiichao-native form.
