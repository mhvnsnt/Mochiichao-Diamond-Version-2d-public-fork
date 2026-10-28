# RUNBOOK — running generation jobs on the rented box

Assumes `setup.sh` has completed. Paths below use the default stack
root `/workspace/mochiichao-stack` (`$STACK_ROOT` if you changed it).

```
$STACK_ROOT/
  ComfyUI/        the server (models/ is symlinks into weights/)
  weights/        our staged weights (the warehouse copy is Kaggle/TeraBox — this is a cache)
  job/            workflows + gates + hash-logged reference stills
  out/<job-name>/ everything a job produces: clips, gate packets, history, run-report.json
```

## The two graphs (and the one rule that keeps them alive)

| graph | file | seat | use |
|---|---|---|---|
| Locked | `job/workflow-i2v-locked.json` | native ComfyUI core nodes, Wan2.1 VACE-1.3B | Reference-locked generation — the likeness lock (VACE reference control, engaged and wired per `../parity/LOCK-ENGAGEMENT.md`) |
| Turbo | `job/workflow-turbo-fixed.json` | kijai WanVideoWrapper nodes, Wan 2.2 TI2V-5B + Turbo LoRA | The fast path (measured 78.5 s vs 1,787.6 s native in the 2026-10-27 A/B) |

**The UMT5 rule — never swap the pair.** Two different text-encoder
files live in `models/text_encoders/`, and each graph accepts
exactly one of them (`../parity/TURBO-T5-FIX.md`):

- `umt5_xxl_fp8_e4m3fn_scaled.safetensors` (underscores) — native
  graphs only (the locked graph). The wrapper loader rejects this
  file on sight.
- `umt5-xxl-enc-fp8_e4m3fn.safetensors` (hyphens, the Kijai build) —
  wrapper graphs only (the turbo graph).

A graph dying at warmup with "fp8 scaled is not supported" means
someone fed the scaled file to the wrapper. The fix is the file,
never a node setting.

## Job shape

Episode work uses **scene job format v2**
(`../freedom/job_format_v2.md`, example
`../freedom/scene_job.example.json`): any number of characters per
scene; each character has a list of segments; **each segment's
action is free text**; segment 1 starts from the character's canon
cutout on a white field. Per the owner-locked method, characters are
always generated **separately** (one character per generation, same
scene prompt + likeness lock), then cut out, overlaid on the real
moving background plate, then post — never ask one generation to
hold multiple characters.

The locked proof job (the parity pattern in
`../parity/locked_run_kernel.py`) is the template every new graph or
seat must pass before episode work: one character (Dorowani, Water
Orb), the locked graph, a negative control with the reference
swapped to Wispkin, and the turbo graph — every clip gated.

## Running a job

1. **Preflight — before any GPU work.** Preflight aborts the job on
   an unlogged/mismatched reference hash, a disengaged VACE wire, a
   stale LoRA input name, or a scaled-fp8 T5 in a wrapper graph.
   A failed preflight is a stopped job, not a warning.

   ```bash
   PY=$STACK_ROOT/venv/bin/python
   $PY $STACK_ROOT/job/preflight.py \
     --workflow $STACK_ROOT/job/workflow-i2v-locked.json --strict-vace \
     --reference $STACK_ROOT/job/dorowani_start_tight.png \
     --expected-sha256 <sha256 from job/reference-manifest.json> \
     --out $STACK_ROOT/out/<job-name>/preflight-locked.json
   ```

   Same for the turbo graph (drop `--strict-vace`), and add
   `--t5-file $STACK_ROOT/ComfyUI/models/text_encoders/umt5-xxl-enc-fp8_e4m3fn.safetensors`
   to prove the actual encoder file's header carries no scaled-fp8
   key.

2. **Boot the server** (headless, local only):

   ```bash
   cd $STACK_ROOT/ComfyUI
   $STACK_ROOT/venv/bin/python main.py --listen 127.0.0.1 --port 8188 --disable-auto-launch
   ```

   Wait for `GET http://127.0.0.1:8188/system_stats` to answer.
   Note: if the turbo graph runs in the same session, the server
   must be restarted after the WanVideoWrapper pack is in place —
   the locked kernel does exactly this between its phases.

3. **Submit + audit.** POST the workflow JSON to `/prompt`, poll
   `/history/<prompt_id>` until complete, then **audit the graph
   that actually ran** from the history entry: for the locked graph,
   node 7's `reference_image` input wired to node 6, node 1's
   `unet_name` = `wan2.1_vace_1.3B_fp16.safetensors`, node 10's
   `trim_amount` wired to node 7. If the audit fails, the lock was
   not in the run — the clip is evidence of nothing and gets no
   gate pass. (The kernel's `run_graph` + audit block is the
   reference implementation; `../helpers/06_comfyui_pipeline_runner.py`
   is the pipeline-side runner.)

4. **Chain + matte + composite** (scene jobs): `../freedom/chain_segments.py`
   joins a character's segments (last frame of one = start frame of
   the next, with a seam report); `../white_matte.py` keys the
   white-field clip to a transparent twin; `../freedom/scene_composite.py`
   lays each character over the scene's **current** living
   background at its layer position/scale/z-order/offset, drawing
   contact shadows **at composite time only** — character art never
   carries a baked shadow.

5. **Gate every clip** (below), then write the job's
   `run-report.json`: clip names, byte sizes, sha256s, wall times,
   gate verdicts — the same shape as the locked kernel's report.

## The gates — nothing is a result without them

In order; a failure at any step stops the claim, not just the job:

1. **Preflight** (step 1 above) — PASS on both graphs before the
   server even boots.
2. **History audit** (step 3) — the submitted graph must show the
   lock engaged.
3. **Frame-1 gate** on every output clip:

   ```bash
   $PY $STACK_ROOT/job/frame1_gate.py \
     --clip $STACK_ROOT/out/<job-name>/<clip>.mp4 \
     --reference $STACK_ROOT/job/<character>_start_tight.png \
     --species <character> \
     --likeness-gate $STACK_ROOT/job/likeness_gate.py \
     --scratch $STACK_ROOT/out/<job-name>/gate-scratch-<clip> \
     --out $STACK_ROOT/out/<job-name>/<clip>_frame1_gate.json
   ```

   Working thresholds (shipped, unchanged): frame-0 SSIM ≥ 0.50 and
   RGB MAD ≤ 40 against the fed reference, plus the canon-cutout
   comparison the packet records. The packet names its fail class
   (e.g. reference-never-anchored) when it fails.
4. **The owner's eye.** Gates recommend; promotion is the
   owner/scorer's call, as everywhere else in this programme.
   A clip with no gate packet is not a result — it is a file.

## Getting outputs back (staging law)

The rented disk is a workbench, never the warehouse. Nothing
production-related may exist only on the box:

- **Clips + gate packets + run-reports** (small): copied off the box
  and landed in the repo by PR, in the job's home under
  `show/production/tooling/avatar-stack/` (or the episode's folder),
  with the registry/manifest entries the landing lane maintains.
- **Masters and anything too large for GitHub**: TeraBox, per the
  staging law, with the manifest pointing at it.
- **Weights never travel back** — they already live in the Kaggle
  datasets and TeraBox masters. The box's `weights/` is a cache;
  losing it costs one `setup.sh` re-run, nothing else.

**Before stopping/destroying the instance:** confirm every output
is landed elsewhere (repo fetch-back or TeraBox listing), *then*
stop it. On RunPod a stopped pod still bills its volume; on Vast.ai
storage bills until the instance is **destroyed** — see
`PROVIDERS.md`. An idle running box is the most expensive outcome
this package can produce; the runbook's last step is always the
shutdown check.
