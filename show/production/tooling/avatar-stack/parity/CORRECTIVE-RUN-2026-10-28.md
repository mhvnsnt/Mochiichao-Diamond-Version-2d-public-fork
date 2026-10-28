# CORRECTIVE RUN RECORD — 2026-10-28 (avatar-stack)

What this pass did, measured from the artifacts themselves. Companion to
the failure-log entry appended to `PARITY-REPORT.md` the same day.

## 1. Countermeasures — verified working before any GPU time

- `preflight.py`: 14/14 unit tests pass (`test_preflight.py`) — every
  abort class fires (missing reference, unlogged hash, hash mismatch,
  disconnected VACE `reference_image`, missing trim wire, stale
  `lora_args`, zero-strength LoRA, unconsumed LoRA, scaled T5 by name,
  scaled T5 by actual safetensors header key) and both corrected
  workflows PASS (the native locked graph's scaled T5 is correctly
  allowed — only wrapper T5 nodes are blocked).
- `frame1_gate.py`: validated both directions on real artifacts.
  - The failed Dorowani proof (sha256 `6d958f4c…`) → **FAIL /
    reference-never-anchored**, frame-0 canon numbers reproduced
    exactly (SSIM 0.2938, IoU 0.5902, MAD 100.29).
  - Control clip rendered from the fed reference itself → **PASS /
    pass** (instrument sanity check).

## 2. Scene harvest — landed, with one provider stop on record

Attempt started 2026-10-28T12:52:25Z (this pass). The four segment
MP4s downloaded in full; the same listing call then returned **429**
part-way (after the MP4s, before the JSON reports). Per the standing
rate-limit rule, **all Kaggle calls stopped for this attempt** at that
point — no retry, no alternate endpoint. Consequences, stated plainly:

- `scene-run-report.json` / `run-report.json` were NOT retrieved, so
  the in-kernel RIFE outcome is still unknown. Not claimed either way.
- The locked run (§4) and the seg-3 chain could not be pushed in this
  attempt. Both are packaged and preflight-passing (§4).

Harvested segments (ffprobe + sha256 verified locally; all
960×1536 — the native path's known 2× upscale — 81 frames, 16 fps,
5.0625 s each):

| File | Bytes | sha256 |
|---|---:|---|
| `wispkin_seg1_glide_00001_.mp4` | 315,651 | `6ba80f00865f39a9184c4225200a8894acbe261927a0dda8d63c94a193ba8a11` |
| `wispkin_seg2_darkwave_00001_.mp4` | 823,018 | `adf2bc9eb3c342a162b68416aac99f5f89307f4486f01d3cbb7df6dbe35ac336` |
| `dorowani_seg1_hops_00001_.mp4` | 530,794 | `2efbed0f852974d2ada896c70f30f16b65f9afdfac4c9cbfe2166473a8d92d0d` |
| `dorowani_seg2_waterorb_00001_.mp4` | 712,137 | `3953e8f6418029848145c6e91e07d41a80027c94cb16276c7b21e4373c4b11c0` |

(Three example-input MP4s from the wrapper's own example folder came
down in the same listing; they are another production's files and were
deleted, not kept.)

## 3. Scene grading — both tracks FAIL, same class as the proof

Frame-1 gates (packets: `test-scene/wispkin_seg1_frame1_gate.json`,
`test-scene/dorowani_seg1_frame1_gate.json` in this package):

| Track | Frame-0 vs canon (SSIM / IoU / MAD) | Verdict |
|---|---|---|
| Wispkin seg1 | 0.3714 / 0.3642 / 106.96 | **FAIL — reference-never-anchored** |
| Dorowani seg1 | 0.4005 / 0.4491 / 85.96 | **FAIL — reference-never-anchored** |

Visual read of the decoded frames agrees with the numbers: frame 1 is
already a redrawn variant (Wispkin's mask becomes the whole body with
no smoky body; Dorowani is elongated with a doubled dorsal fin and a
baked grey ground shadow in the generated footage). Seg-2 frames show
the actions attempted (Wispkin aura burst — blue, not a dark pulse;
Dorowani holding a glowing Water Orb) by the wrong designs. This is
the expected result for the UNLOCKED native path that ran the scene;
it is the baseline the locked run must beat, and it is why the scene
was never a parity claim.

Track diagnostics (not grades): Wispkin mean frame diff 1.034,
near-identical pairs 35.4%, chain-joint seam MAD 15.654; Dorowani
mean frame diff 1.101, near-identical 42.2%, seam MAD 7.994.
Full numbers: `test-scene/scene-track-measurements.json`.

Composite: `TEST-SCENE.mp4` built by `postprocess.py` over the
registry-CURRENT Garden Gate v2-living plate (md5
`d2f1bf1d709d3a0e9d9d0f58dccc6c31`, re-verified this pass; the v1
still plate was not used): 1280×720, 24 fps, 243 frames, 10.125 s,
1,077,159 bytes (sha256
`7f2d29cf0d23c2482003a5553246a3b6075c10aa256188d6e9ffc3e70ad429f2`).
It exists and is measured; with both tracks FAIL it is evidence, not
a pass. Length: 10.125 s per character — past the 8 s ceiling, short
of the 12–16 s target; the seg-3 chain (→15.2 s) remains unrun
(Kaggle stop, §2).

## 4. Locked run — packaged, preflight-passing, blocked only by the §2 stop

Ready to push in the next attempt, no further build work needed:

- Job dataset `marsfmmg/mochiichao-locked-job` (files staged locally):
  both workflows, `preflight.py`, `frame1_gate.py`, `likeness_gate.py`,
  and the tight references — `dorowani_start_tight.png` is
  byte-identical to the hash-logged scene start (sha256 `aa124c9a…`;
  character fills 87.9% of frame height), `wispkin_start_tight.png`
  sha256 `9bff2817…`; `reference-manifest.json` records both hashes.
- Kernel `marsfmmg/mochiichao-locked-run` (`parity/locked_run_kernel.py`
  + `parity/locked-run-kernel-metadata.json`): stages the VACE seat
  from `mochiichao-wan22-consistency-kit` (VACE file size asserted
  4,309,519,800 B), pre-flights BOTH workflows before server boot,
  runs the locked graph, audits the submitted graph in `/history`
  (reference wire / VACE unet / trim wire), runs the
  different-character negative control, then stages the non-scaled
  UMT5 (`umt5-xxl-enc-fp8_e4m3fn.safetensors`, size asserted
  6,731,333,792 B, header checked by preflight `--t5-file`) and runs
  the Turbo-fixed graph. Every clip is frame-1 gated in-kernel.

Push sequence for the next attempt:

```bash
kaggle datasets create -p <locked-job dir>          # or: datasets version
kaggle kernels push -p <locked-run kernel dir>
kaggle kernels output marsfmmg/mochiichao-locked-run -p <out dir>
# also re-run the scene harvest listing to fetch scene-run-report.json,
# then build_seg3.py + the seg-3 follow-up run.
```

## 5. Status after this pass

Backend remains **WIRED UNPROVEN**. What changed: the failure class
is now fenced by code that aborts before GPU time and labels every
output; the scene is harvested, composited, and graded with packets
attached. What did not change: no clip has yet passed the frame-1
gate. The one remaining blocker is a Kaggle API rate limit that
stopped this attempt mid-harvest — a provider wait, not an owner
step and not a build gap.
