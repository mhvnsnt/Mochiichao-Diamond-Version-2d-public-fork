# Templates — carried in / adapted for the show folder

Template inventory from the audit. "Carried" = a native version
lives in this repo's show folder now. "Canonical" = use Jamar's
original in its home repo (no fork).

| Template | Origin (his) | Status for Mochiichao |
|---|---|---|
| Rig spec template (Stage 3) | animation-techniques-archive `character-pipeline/03-rig-spec/template.md` | **Carried, adapted** — shape of `show/production/rigs/CAST-RIG-SPECS.md` |
| Character model-sheet template | animation-techniques-archive `templates/character-model-sheet-template.md` | **Adapted below** — species model-sheet standard |
| Shot spec (YAML) | TRIPPEDD-Animation-Studio `shots/SPEC.md` + `shots/templates/` | Canonical — episode shot specs use that format verbatim |
| Storyboard sheet | cape-jones `production/pipeline/storyboard_sheet.py` | Canonical code; sheets land in episode folders |
| Animatic builder | cape-jones `animatic_builder.py` / `fountain_to_animatic.py` | Canonical code |
| Cue sheet | cape-jones `docs/story/EP01-M4-CUE-SHEET.md` (format example) | **Adapted below** — per-episode cue sheet |
| Beat sheet (episode) | mystery-coast research (6-beat formula) | **Adapted below** |
| Voice render queue | wizard-gang-voice-pipe `render-queue.json` | Canonical format; show queues live per-episode |
| Asset/source manifest | TRIPPEDD `manifests/sources/*.json`; cape-jones `example_manifest.json` | Canonical formats; show instances in `show/shared/` |
| Pocket-studio project JSON | pocket-studio README format | Canonical format for edit passes |

## Species model-sheet standard (adapted from his model-sheet
## template + the 8-sheet model-pack completeness rule)
Per species, one sheet set before rigging:
1. Front / side / back construction (geometry first)
2. Head construction + expression set (eyes symbol frames)
3. Mouth chart (Blair 10 visemes, species proportions)
4. Palette sheet (day/night line-ups, like the pro model packs)
5. Scale line-up vs the pilot cast
6. Signature-feature sheet (the species' special layers: fins,
   leaves, orb, trail…)
7. Pose library thumbnails (from the rig spec)
8. Do/Don't page (likeness lock — what makes it stop being them)

## Episode beat sheet (6-beat, adapted)
1. Arrive / setup (garden status quo, 1 joke per character present)
2. Problem appears (creature-scale stakes)
3. Split up / parallel gags
4. The obvious explanation is wrong (fake-out)
5. The plan backfires (trap rule: it always backfires once)
6. Resolution + tag (arc seed planted for serialized episodes)

## Episode cue sheet (adapted format)
Per episode: scene # · in/out timecodes · music cue (source: title
theme / cue library / generated) · SFX (species cries noted by name)
· dialogue stems file · duck points · loudness target −14 LUFS.
