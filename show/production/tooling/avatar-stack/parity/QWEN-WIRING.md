# QWEN WIRING — Qwen2.5-VL-7B-Instruct as the caption / prompt-extension step

Date: 2026-10-28. Script: `qwen_prompt_extension.py` (this folder,
syntax-checked; `--dry-run` executed locally this session — see §4).

## 1. What is wired, exactly

- **Model:** `Qwen/Qwen2.5-VL-7B-Instruct`, **Apache-2.0** (HF API
  `cardData.license = "apache-2.0"`, re-fetched 2026-10-28:
  `https://huggingface.co/api/models/Qwen/Qwen2.5-VL-7B-Instruct?blobs=true`).
  The 7B specifically — the teardown already recorded that the 3B
  and 72B cards carry different licences; they are not used.
  Architecture confirmed from the staged snapshot's own
  `config.json`: `Qwen2_5_VLForConditionalGeneration`,
  `model_type: qwen2_5_vl`, bf16 — the script loads exactly that
  class via transformers.
- **Staged copy:** private Kaggle cache kernel
  `marsfmmg/mochiichao-qwen25vl7b-cache` — 16 files,
  **16,595,981,281 B**, all five safetensors shards' sha256 equal to
  HF's LFS hashes (PULL-IN-REPORT.md, 2026-10-28; the HF listing was
  re-fetched this session and matches byte-for-byte again).
- **The script's job:** reference image + short action text (+ the
  character's canon line) → one extended Wan-style prompt, in the
  exact wording structure the seated graphs already use ("Animate
  THIS EXACT character image…" — the scene job's proven prompt
  shape), with the character description read **from the image** by
  the VL model and cross-checked against the canon line in the
  instruction. Greedy decoding (`do_sample=False`) so the same
  image+action always yields the same prompt — reruns stay
  comparable, which the likeness-gate workflow depends on.
- **Proof hygiene built in:** every result JSON carries the input
  image's sha256 (standing rule: a generation run logs its exact
  fed input + hash). Local dry-run evidence: run against the scene
  job's `dorowani_start.png`, the script's reported hash is
  `aa124c9adc8caacd22628d06f4d1373e16e02e41bfb650028c014a58af0c5720`
  — identical to the hash the proof kernel logged for its fed
  input. The hashing path is therefore verified end-to-end.

## 2. How it runs inside a Kaggle kernel (the seat)

In the consuming kernel's `kernel-metadata.json`:

```json
"kernel_sources": ["marsfmmg/mochiichao-qwen25vl7b-cache"]
```

The cache output then appears at
`/kaggle/input/mochiichao-qwen25vl7b-cache/` with `weights/` and
`manifest.json` inside (per PULL-IN-REPORT.md §1). The script finds
it by itself (explicit `--model-dir` → `$QWEN_VL_DIR` →
`/kaggle/input/<slug>/weights` → any `model-00001-of-00005.safetensors`
under `/kaggle/input`), size-checks the snapshot against the
manifest (sha256 with `--verify-hashes`), and refuses to download
anything unless `--allow-download` is passed.

Placement in the session: run the extension **before** ComfyUI
starts (the T4's 16 GB must hold the VL model *or* the video model,
not both at once; the script's process exits and frees VRAM, then
the existing notebook flow launches the server and submits the
workflow with the extended prompt filled in). A 7B bf16 VL model is
~16.6 GB on disk and fits a T4 with `device_map="auto"` offloading;
expect the extension step to be the slow, careful step of the
session — it replaces hand-writing prompts, it is not on the
per-segment hot path if prompts are extended once per character
and reused across that character's segments (see §3).

## 3. The local-side interface — freedom `job_format_v2`

The v2 format (`show/production/tooling/avatar-stack/freedom/job_format_v2.md`)
gains ONE optional field, on a segment:

```jsonc
{
  "action": "charges a glowing blue Water Orb between its hands",
  "duration_s": 3.0,
  "seed": 2002,
  // NEW, optional:
  "prompt_extension": {
    "enabled": true,               // default: absent = false
    "model": "qwen2.5-vl-7b",      // the only wired extender id
    "canon": "Blue bipedal creature, red fin cheeks, red eyes, light belly, dorsal fin, tan shell on its back.",
    "image": "dorowani_start_tight.png"   // defaults to the segment's start frame
    // "extended_prompt": filled in by the extension step; once
    //   present it is what the backend sends, verbatim.
  }
}
```

Rules that keep this honest:

- **Absent or `enabled: false` → today's behaviour, byte-identical:**
  the runner composes `style_prefix + action` from
  `prompt_library.json` exactly as now. The extension is an upgrade
  path, never a new prerequisite (same stance as PULL-IN-STATUS.md
  recorded for this piece).
- **The extension runs on the Kaggle seat, not locally** (see §5).
  The local side's whole job is: carry the field through, and when
  `extended_prompt` comes back in the run report, store it in the
  job file so the run is reproducible without re-extending.
- **Batch shape matches the script:** one JSONL line per segment —
  `{"image", "action", "canon"}` — is the script's `--batch-jsonl`
  input, and its JSONL output maps 1:1 onto the segments'
  `extended_prompt` fields (plus the image hash for the run log).
- The character's `canon` line comes from `prompt_library.json`
  (`characters.<id>.canon`), which already exists for all six pilot
  characters. No new canon text is invented by this wiring.

## 4. What was verified here, and what was not

Verified this session (locally, no Kaggle — another worker owns the
seat this round):

- Script parses (`py_compile`) and its `--dry-run` produces the
  exact chat payload (system + image + templated user text) for a
  real job image, with the correct fed-input hash (§1).
- Model location logic mirrors the cache kernel's documented output
  layout; snapshot checking reads the manifest format the cache
  kernel wrote.
- The transformers entry points used (`Qwen2_5_VLForConditionalGeneration`,
  `AutoProcessor.apply_chat_template`, processor image+text batch)
  match the staged snapshot's own `config.json` architecture. The
  wrapper's `qwen/system_prompt.py` (Alibaba's original Wan prompt-
  extension templates, read this session) informed the output
  structure, but this script's template is the pipeline's own —
  it enforces the white-field / locked-camera / no-design-change
  contract that the generic Wan templates do not.

Not run: an actual VL inference. That needs the Kaggle seat (T4)
with the cache kernel attached — one short kernel cell:
attach `kernel_sources`, run the script on one segment, eyeball the
extended prompt against the canon line, done. It is queued behind
the seat's current owner, not behind any unknown.

## 5. Flagged spec gaps (real-code law — stated, not papered over)

1. **No local execution.** This VM has no GPU and no staged Qwen
   copy (staging law: weights live on Kaggle/TeraBox, not local
   disk). Locally the script can only dry-run. Any claim of a
   locally-produced extended prompt would be fake; none is made.
2. **The wrapper's in-graph extender cannot consume this model.**
   `WanVideoTextEncodeCached`'s `extender_args` path
   (`WanVideoPromptExtenderSelect` → `QwenLoader`, read in
   `qwen/qwen.py` this session) loads a **text-only Qwen2.5 LLM**
   as a *single* safetensors from `models/text_encoders`
   (`Qwen2ForCausalLM`, 3B/7B configs hardcoded). Our staged model
   is the **VL** checkpoint (5 shards, vision tower) — it does not
   fit that loader, and no single-file Qwen2.5-7B text build is
   staged. So prompt extension is wired as a **pre-ComfyUI step**
   (this script), not as an `extender_args` wire. If in-graph
   extension is ever wanted, the staging delta is the text-only
   Qwen2.5-7B single file in Kijai/WanVideo_comfy's text-encoder
   set — a separate, named pull, not a silent substitution.
3. **CPU fallback exists but is a trap:** the script will run on
   CPU with a loud warning; at 7B that is minutes per prompt. It is
   there so a session degrades visibly instead of failing silently
   — it is not a supported seat.
