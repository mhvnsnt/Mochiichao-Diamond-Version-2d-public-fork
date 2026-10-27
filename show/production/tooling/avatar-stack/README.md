# Avatar-stack tooling

The in-repo wiring of the avatar full stack — the pipeline that makes
the show's character animations the same way Doro's avatar videos are
made. Start with the spec:

- **`AVATAR-STACK-PIPELINE.md`** — the 1–5 order (canon source art →
  I2V generation → bundle → likeness gate → ship), the backend table,
  and the measured facts (Wan test 1, gate calibration data).
- **`backends.json`** — the backend registry of record: honest status
  and licence per backend. The hosted Muse generator is the reference
  implementation and is **not** callable from this repo; the free
  backends are.
- **`generate_bundle.py`** — assembles a bundle (MP4 + transparent WebM
  twin + poster + measured manifest) from a finished clip.
- **`likeness_gate.py`** — real likeness measurement (SSIM / silhouette
  IoU / masked RGB diff) against the canon cutout; emits a gate packet
  that recommends, never promotes.
- **`white_matte.py`** — white-field matting for the transparent twins
  (wired since PR #341).
