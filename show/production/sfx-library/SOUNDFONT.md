# GM soundfont — FluidR3 (pull-in programme, 2026-10-28)

For the LMMS / MuseScore music seat: a licence-clean General
MIDI bank so MIDI sketches render with real instruments before
the ACE-Step layer.

| Field | Value |
|---|---|
| File | `FluidR3_GM.sf2` (Frank Wen's Fluid R3 GM bank) |
| Bytes | 148,398,306 |
| sha256 | `74594e8f4250680adf590507a306655a299935343583256f3b722c48a1bc1cb0` |
| Licence | **MIT** (open source) — verified at source 2026-10-28: the upstream README statement "I hereby release Fluid under the MIT license", carried in the Debian `fluid-soundfont` package copyright file (staged with the file as `FluidR3-Debian-copyright.txt`) |
| Source | Debian package `fluid-soundfont-gm_3.1-6_all.deb` (deb.debian.org pool), extracted `usr/share/sounds/sf2/FluidR3_GM.sf2` |
| Verification | RIFF/sfbk header valid; RIFF size field == file size; preset-header chunk present |

**Staging:** at 148 MB the .sf2 exceeds GitHub's 100 MB
single-file limit, so it is NOT in this repo. Transit master:
`~/workspace/pull-in-programme/soundfont/FluidR3_GM.sf2` on the
production VM; durable staging owed via the TeraBox masters
batch (see the pull-in ledger's TeraBox manifest entries) —
flagged there, not claimed here.

**Wiring:** LMMS is installed on the VM (`lmms` on PATH). Point
LMMS's default soundfont at the staged file (Settings → Paths →
Default SoundFont, config key `paths/defaultsf2`) when the music
seat next configures LMMS — no LMMS config existed on this VM at
staging time, so none was altered. MuseScore seats keep their
bundled MS Basic unless a score assigns this bank explicitly.
