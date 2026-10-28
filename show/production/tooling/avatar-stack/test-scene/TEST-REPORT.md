# TEST SCENE REPORT — avatar-tool equivalent, chained two-character scene

**Date:** 2026-10-28. **Run state at report time:** scene kernel COMPLETE on Kaggle;
output harvest BLOCKED by a Kaggle API 429 (see §6) — all post-composite numbers
that require the downloaded segment MP4s are pending that one download command.
Everything measurable without Kaggle is measured below.

**Grading bar applied (owner, 2026-10-28):** split grades are retired. A clip
PASSES only when the CORRECT character performs the action. Motion / frame-diff
numbers are diagnostics, never grades. Frame-1 rule: frame 1 already wrong =
"reference never anchored" FAIL, a distinct class from drift. Every run logs
its exact fed input + hash (§5).

---

## 1. Single-character proof harvest (Dorowani Water Orb) — COMPLETE, graded FAIL

- Kernel: `marsfmmg/mochiichao-wan-i2v`, status COMPLETE. Harvested to
  `proof-harvest/`: `dorowani_waterorb_proof_00001_.mp4` (352,574 bytes,
  sha256 `6d958f4cdf3c334296b61523782e29d1ec9e47b01ec557c5c926f6c4827cbd4a`),
  `run-report.json`, kernel log, `comfy.log`.
- Spec (ffprobe): h264, **960×1536** (job asked 480×768 — the native path's
  known 2× upscale defect), 45 frames, 16 fps, 2.8125 s.
- Path used: **native-baseline** (t_main 1236.2 s, T4×2). The optimized
  wrapper-turbo path FAILED in warmup with the exact error:
  `WanVideoTextEncodeCached — Invalid T5 text encoder model, fp8 scaled is not
  supported by this node` (upstream WanVideoWrapper drift; doctor_fill could
  not fix a hard model-type rejection). The notebook fell back to native
  exactly as designed.
- Fed input: `job/start.png`, sha256
  `aa124c9adc8caacd22628d06f4d1373e16e02e41bfb650028c014a58af0c5720`
  (byte-identical to this package's `scene-job/dorowani_start.png` — the prep
  is deterministic).
- **Frame-1 check: FAIL — reference never anchored.** Frame 1 (visually read,
  `proof-harvest/frames/f1.png`) is already a distorted 3D-style creature:
  elongated tube body, the tan shell worn on top of the head like a hat,
  bulbous arms, stick legs, no crocodile snout/teeth. Dorowani's colour palette
  (blue body, red cheek fins, red eyes, cream belly) survives; the character
  and the flat 2D style do not. Frame-0 likeness gate vs canon cutout:
  SSIM 0.2938 (min 0.50), silhouette IoU 0.5902 (min 0.55, pass), RGB MAD
  100.29 (max 40) → packet verdict FAIL (`proof-harvest/proof-likeness-frame0.json`).
- Later frames (visually read): frame 22 — arms raised, cyan water blob above
  the head; frame 44 — a giant cyan orb engulfs the creature. The Water Orb
  action is loosely performed, by the wrong character.
- Diagnostics only (not a grade): verify_proof consecutive-frame grayscale
  mean diff **0.467** (calibration: still 0.005, storyboard 0.473, real motion
  4.50), median 0.462, 28/44 pairs near-identical (63.6%), `reads_as_real_motion:
  false` (`proof-harvest/proof-verify.json`).
- **VERDICT: FAIL** under the owner's bar — correct action family, wrong
  character from frame 1.

## 2. Scene run (two characters, chained segments, free motions)

- Kernel: `marsfmmg/mochiichao-wan-scene-test` (new, private), dataset
  `marsfmmg/mochiichao-scene-job` (created for this run), notebook
  `scene-kernel/mochiichao-wan-scene-test.ipynb` = production notebook's setup
  cells unchanged + scene loop. Pushed 05:56 UTC, COMPLETE ~09:52 UTC
  (runtime ≈ 3 h 56 m — the native fallback path ran every segment, after the
  same wrapper-turbo T5 failure the proof hit).
- Job (`scene-job/scene_job.json`, sha256
  `4f2b53ddebab85a22e080a3d24a2cd8d4a9c3a72c0f78035df53e288d952dbd1`):
  canvas 480×768, 16 fps, segments of 81 frames, chained in-notebook
  (segment 2 starts from segment 1's last frame, extracted in-notebook;
  seed family per character: seed, seed+1).
  - Wispkin (base seed 1001): seg1 glide/drift left→center, mask tilting,
    smoke trail (`wispkin_seg1_glide`); seg2 Dark Wave pulse from the mask
    (`wispkin_seg2_darkwave`).
  - Dorowani (base seed 2001): seg1 two hops toward viewer-right, fins
    flapping, shell bouncing (`dorowani_seg1_hops`); seg2 plant feet, charge
    glowing blue Water Orb (`dorowani_seg2_waterorb`).
  - All prompts carry the flat-2D style-lock wording and the backend's
    negative prompt verbatim. None of the four actions is an avatar slot.
- **Length note (coordinator correction, applied honestly):** as pushed, each
  character performs 2×81f ≈ **10.1 s** — beats the 8 s avatar ceiling but
  misses the 12–16 s target. The kernel was already RUNNING when the
  correction arrived, so per instructions it was NOT restarted. The third
  segments are built and ready (`build_seg3.py`: Wispkin seg3 settle + shy
  hands wave / smoke flourish; Dorowani seg3 push the orb forward + recoil
  stumble; seeds 1003/2003, start frames = seg2 last frames) and run as a
  follow-up chained run appended to each track (→ 243f ≈ 15.2 s) **after the
  harvest lands** — they are NOT done at report time.
- RIFE: the notebook's RIFE cell (clone ComfyUI-Frame-Interpolation before
  server launch; fetch RIFE flownet in-session recording filename + sha256;
  interpolate Wispkin seg1 16→32 fps) ran inside the kernel; its exact
  outcome lives in `scene-run-report.json` in the kernel outputs — pending
  harvest (§6). Not claimed either way here.
- Expected outputs in the kernel (by construction): 4 segment MP4s +
  `scene-run-report.json` / `run-report.json` (+ possibly
  `wispkin_seg1_rife32.mp4`).

## 3. Background (registry-governed)

- **Garden Gate v2-living — CURRENT** per `show/shared/PLATES-REGISTRY.md`
  (local registry copy: `~/workspace/still-to-build/living-plates/PLATES-REGISTRY.md` §1).
- File: `EP01-CUT01-composite-life-proof-v1.mp4`, local copy
  `~/workspace/mochiichao-show/repo-add/show/episodes/EP01/animatic/EP01-CUT01-composite-life-proof-v1.mp4`,
  md5 `d2f1bf1d709d3a0e9d9d0f58dccc6c31` — **matches the registry md5 exactly**.
  Spec: 1280×720, 24 fps, 8.0 s, h264. Frame at t=2 s visually read: clean
  painted Gate plate (gate, sign, well, windmill, drifting clouds), no
  character in it. The v1 still plate was NOT used anywhere.

## 4. What is NOT done (pending the §6 harvest — no other blocker)

1. Download scene outputs → `scene-raw/` (one command, §6).
2. `build_seg3.py` + dataset version + kernel push (follow-up run, ≈2 native
   segments) → append seg3 to each track.
3. `postprocess.py` (already written, syntax-checked): chain segments,
   verify_proof per track, likeness gate per character (frame 0 + frame 40),
   seam MAD at each chain joint, first/last frame check, white_matte both
   tracks, composite both over the §3 Gate plate (Wispkin upper-left,
   Dorowani lower-right, soft shadows drawn at composite time only),
   `TEST-SCENE.mp4`, `contact-sheet.png`, peak-action frames in `frames/`.
4. Frame-1 verdicts per character for the scene tracks (visual read + gate
   frame-0 numbers) and the final per-claim pass/fail table.

## 5. Fed-input log (standing proof requirement)

| Input | sha256 |
|---|---|
| `scene-job/wispkin_start.png` (Wispkin seg1, from canon cutout) | `9bff28175fe378b816a8743c6f846ea338d7aeb9a64072ec6610e0c3faa73250` |
| `scene-job/dorowani_start.png` (Dorowani seg1 + proof job's start.png, byte-identical) | `aa124c9adc8caacd22628d06f4d1373e16e02e41bfb650028c014a58af0c5720` |
| Canon cutout `wispkin.png` | `b9de2318eb399094ad57fb6e21a388b05601a67425f18f49ff6a5b6408da0523` |
| Seg2 start frames | extracted in-notebook from seg1 outputs (not in the downloadable output set — the seam MAD at each joint, measured in postprocess step 3, is the check on them) |
| Seg3 start frames (follow-up, when run) | extracted locally by `build_seg3.py` from the harvested seg2 MP4s; hashes recorded when built |

## 6. Exact failure — Kaggle 429 on harvest (provider hard stop)

At 09:52 UTC, with the scene kernel COMPLETE, the harvest call

```
kaggle kernels output marsfmmg/mochiichao-wan-scene-test -p scene-raw --force \
  --file-pattern ".*(\.mp4|scene-run-report\.json|run-report\.json|\.log)"
```

returned: `429 Client Error: Too Many Requests for url:
https://api.kaggle.com/v1/kernels.KernelsApiService/ListKernelSessionOutput —
You have been rate limited. Wait a little while before retrying.`

Per the standing rate-limit rule, no further Kaggle requests were made in
this attempt (no retry, no alternate endpoint). The kernel's outputs persist
on Kaggle. **Recovery = re-run exactly the command above after the limit
clears, then §4 steps 2–4.** The proof kernel's harvest (earlier, 06:38 UTC)
succeeded and is fully reported in §1.

## 7. Per-claim verdicts (honest, at report time)

| Claim | Verdict |
|---|---|
| Single-character proof (Water Orb) | **FAIL** — reference never anchored (frame 1 wrong character); §1 |
| Free motion types (not avatar slots) | Prompts as specified (glide, Dark Wave, hops, orb charge + seg3 flourish/orb-push) — performance grading pending harvest |
| Length > 8 s per character | 10.1 s as run (PASS vs 8 s); 12–16 s target NOT met by the main run — seg3 follow-up pending (§2) |
| Two characters in one scene, composited over CURRENT living Gate | Composite pending harvest; background verified CURRENT + hash-matched (§3) |
| Likeness (scene tracks) | Pending harvest — will be graded on character correctness (visual + gate), never motion numbers |
| RIFE interpolation proof | Outcome recorded in the kernel's `scene-run-report.json` — pending harvest; not claimed |

---

## 8. Addendum — harvest retry attempt, 2026-10-28 (second attempt, post-§6)

Dated entry appended per instruction; §§1–7 above are unchanged history.

- **§4 update (2026-10-28, ~10:07–10:24 UTC):** §4 steps 1–4 remain NOT
  done. A new attempt waited ~12 min (09:55:29Z start), then ran the exact
  §6 harvest command at 10:07:31Z — 429 again (verbatim error in
  `HARVEST-STATUS.md` in this folder). After a 15-minute wait, the single
  permitted retry ran at 10:23:34Z — 429 again, CLI exit 1, `scene-raw/`
  empty (0 files). All Kaggle work was then stopped per the standing
  rate-limit rule; no alternate endpoint was used, and seg3 (§4 step 2)
  was not started because it depends on harvested seg2 frames.
- **Local prep measured in this attempt:** `postprocess.py` +
  `build_seg3.py` pass `python3 -m py_compile`. Background plate
  re-verified: 488,726 bytes, md5 `d2f1bf1d709d3a0e9d9d0f58dccc6c31`
  (matches §3/registry), h264 1280×720, 24 fps, 192 frames, 8.0 s.
- **§7 update (2026-10-28):** no verdict in the §7 table changes. Every
  row marked "pending harvest" is still pending harvest — including the
  RIFE outcome (still locked in the undownloaded
  `scene-run-report.json`), scene likeness, composite over the CURRENT
  living Gate plate, and the seg3-extended length claim. Full exact
  errors, timestamps, and resume commands: `HARVEST-STATUS.md`.
