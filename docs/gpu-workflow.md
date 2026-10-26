# GPU workflow — standing rule for every agent

**Standing instruction from Mars (2026-10-26): use the GPU for everything it can do. Do not make him remind anyone again. This doc is the workflow; every lane and every agent follows it.**

## 1. The GPU route: Kaggle notebooks, through the browser

- GPU work runs in **Kaggle notebooks, via the browser**. There is no local GPU route (see §5).
- Sign in to Kaggle with the **saved login**. The account is **Mars FMMG** — it was already signed in on the 2026-10-26 check, so no sign-in form or credential step was needed then.
- **Never ask for a password in chat. Never print a credential or token.**
- If the saved login is **rejected by Kaggle, stop and report that** — do not retry with another account, do not work around the sign-in.

## 2. Free GPU — what it actually is (re-check before every job)

- Accelerator option in the notebook editor: **GPU T4 x2**.
- Free quota: **30 hours per week**. As of the 2026-10-26 15:05 CDT check, **23 hours remained** — that number changes as hours are used, so **every agent must re-check the remaining hours in the notebook editor before starting a job**, and must not quote 23 hours as current after that date.
- Session limits shown in Kaggle's notebook documentation: **12 hours execution time** for CPU and GPU notebook sessions, **20 GB** of auto-saved disk space (`/kaggle/working`).
- T4 x2 configuration: **2 Nvidia Tesla T4 GPUs, 4 CPU cores, 29 GB of RAM**.
- No P100 option was shown in the editor on that check, even though Kaggle's documentation still describes a P100 configuration — use what the editor actually offers, do not claim a P100.

## 3. FREE ONLY — no paid GPU, ever, without Mars

- **No paid plan. No payment details entered. No paid run.**
- A paid GPU run needs **Mars's explicit approval for that specific run** — a general "use the GPU" instruction is not approval to pay.
- If a job cannot fit in the free quota, stop and report that to Mars instead of paying or finding a paid workaround.

## 4. Use the GPU for everything it can actually accelerate

- Default: **GPU-able work goes to the Kaggle GPU first.** CPU-only is acceptable only when the GPU genuinely cannot help that step — and the agent must state that reason plainly, not use it as an excuse to skip the GPU.
- Work the GPU is for: **Blender renders and bakes, video renders, sprite training**, and any other render/train step that runs faster on a GPU.
- **Original Mochiichao art only.** Never run GPU training or rendering on Pokemon art, never copy a logo, never copy Pokemon sounds. Learning animation structure and timing from the decomp files is fine; copying their art, logo, or audio is not.
- A GPU job that is only a submission receipt is not a result (see §6).

## 5. Local VM: no GPU, no local Blender — do not claim otherwise

- The local VM has **no GPU** (`nvidia-smi` is absent) and **no local Blender binary**.
- **Do not stall a batch installing Blender locally** when the Kaggle route exists. If Blender is needed, it runs in the Kaggle notebook (headless install there) or through the browser route Mars pointed at — not as a local install that blocks the batch.
- Do not write "rendered on GPU" for anything rendered on the local CPU. Say which machine did the work.

## 6. Evidence gate still applies

- A GPU render claim needs **frames or renders in hand**, not a job submission receipt, not a "notebook created" message.
- Before reporting a GPU render as done, the agent must have the output files and have eye-checked at least one rendered frame (or, for animation, a frame diff across the loop). A single still is not proof of an animation.
- If the GPU job failed, ran out of quota, or produced nothing, report that plainly — do not report the job as done.

## 7. Draft notebook observed (verify, do not assume)

- Draft notebook observed on the 2026-10-26 check: https://www.kaggle.com/code/marsfmmg/notebooke78728fd22/edit
- At that check it was **unrun, session off, 0 versions, GPU not turned on, nothing uploaded, nothing published, nothing paid**.
- **Agents must verify its current state before using it** — do not assume that draft still exists, is still empty, or is still the right notebook. If it is gone or changed, report that and start from the current notebook editor state.
