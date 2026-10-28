# turnaround-pipeline — drivers for the generated-turnaround route

The working pieces of the GENERATED-TURNAROUND PIPELINE
(`show/production/animation-method/GENERATED-TURNAROUND-PIPELINE.md`
— read that first; it is the pipeline of record, Industry Method
v1.3 in `METHOD-REGISTRY.md`).

## What's here

| File | Step | What it is |
|---|---|---|
| `diagnosis-checklist.json` | A | The 20-point structural defect audit (owner-caught, 2026-10-28) re-expressed for the vision-diagnosis step, plus the 4 v5 drawn-gate items (21–24). The audit OF RECORD is the proof gate's `proof-gate/audit-checklist.json` (PR #489) — one audit, two consumers; this file declares the derivation inside itself. Every item gets PASS / FAIL / NOT VISIBLE with the frame or pose judged. |
| `build_turnaround_job.py` | B + C | Builds both jobs from a character-bank record + a design inventory. Emits the turnaround job (SPEC shape, stamped) and the animate job in the landed scene-job format v2. Refuses to run without an inventory — features come from the canon record, never from the script. |
| `mochiko-design-inventory.example.json` | B | The worked inventory example, derived from Mochiko's canon record. An example of the shape — re-derive from the record for a real run. |
| `slice_pack.py` | D | Frame directory → trimmed frame PNGs + horizontal sprite sheet + atlas JSON (`mochiichao-show/sprite-atlas/v1`). Pillow only. Self-tested at landing: 8 synthetic frames → 328×105 sheet, exact trim offsets, empty frame errors. |

## How the pieces connect

```
canon art ──► DIAGNOSE (checklist + Qwen2.5-VL contract,
              avatar-stack/parity/) ──► per-item verdicts
   │                                        │ any FAIL on 1–20
   ▼                                        ▼
bank record + design inventory ──► build_turnaround_job.py
   ├─► turnaround job (SPEC: mochiichao-show/turnaround-job/v1)
   │      └─► [I2I DRIVER — NOT YET BUILT: the one named gap]
   │             └─► turnaround sheet ──► side-profile cell
   └─► animate job (LANDED: mochiichao-show/scene-job/v2)
          └─► run_backend.py → chain_segments.py → white_matte.py
              → scene_composite.py  (avatar-stack/freedom/ path)
                    └─► clip ──► ffmpeg frames ──► slice_pack.py
                          └─► sprite sheet + atlas (game use)
   GATES at every output: verify_proof.py (timing, --likeness
   against the corrected sheet, frame-1 check) + a diagnosis
   re-run of the finished frames. Grading law: wrong character
   = FAIL, judged by the owner's eye.
```

## Wired vs spec (the short version; the pipeline doc has the table)

- **Wired:** the checklist as data; the Qwen2.5-VL endpoint
  contract (parity lane — first dedicated diagnosis run still
  owed); the animate job's format and run path; the export
  packer; the gates.
- **Spec:** Step B's generation itself. Scene-job v2 has no
  image-to-image job type and no landed driver consumes one;
  `build_turnaround_job.py` stamps that half `SPEC_NOT_RUNNABLE`
  with the gap written inside the job file. Do not describe the
  turnaround step as wired until a driver lands and a sheet
  passes the gates.
- **Unproven:** likeness on the free generation stack. The
  baseline plain-I2V FAIL stands until a gated run on this route
  passes.
