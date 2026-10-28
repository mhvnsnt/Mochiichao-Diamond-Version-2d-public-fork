# Examples — read this first

- `sample-rhubarb.json` / `sample-rhubarb.tsv` /
  `sample-rhubarb-pb.dat` — **SYNTHESIZED Rhubarb-format sample
  inputs. These are NOT real recognition results.** Cue values were
  authored by hand to exercise every row of the Rhubarb→Blair
  mapping in `../MOUTH-DATA-FORMAT.md` for the human line
  *"Five wonders wait in the garden."* (character: Mochiko).
  The three files encode the same cue sequence in Rhubarb's three
  export formats (JSON, TSV, Preston-Blair DAT).
- `sample.mouth.json` / `sample-tsv.mouth.json` /
  `sample-dat.mouth.json` — **real outputs** of the shipped
  converter (`../rhubarb_to_mouthdata.py`) run on the samples above
  on 2026-10-27. All three were cross-checked programmatically:
  identical Blair cue sequences.

**Why synthesized input:** a genuine Rhubarb 1.13.0 run was
attempted on a generated test WAV (`/tmp/rhubarb-test.wav`, not
kept). The binary fails at startup — `Error creating speech
decoder` — under both the `pocketSphinx` and `phonetic`
recognizers: the `~/opt/bin/rhubarb` install lacks its bundled
PocketSphinx model resources. Fix path (not done here): reinstall
Rhubarb with its `res/` model folder alongside the binary, then
re-run any line WAV through the converter unchanged — the format
contract does not depend on which machine runs Rhubarb.
