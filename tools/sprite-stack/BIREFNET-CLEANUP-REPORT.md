# BiRefNet sprite cleanup — report (2026-10-26)

## What this PR wires (tool, not art wiring)

`tools/sprite-stack/remove_background.py` (PR #29 pattern, extended) now
defaults to BiRefNet instead of u2net:

- **Default model: `birefnet-general` (BiRefNet, MIT).** Verified before
  use: Hugging Face `ZhengPeng7/BiRefNet` card lists `license: mit`;
  `onnx-community/BiRefNet_lite` lists `license: mit`; the BiRefNet
  GitHub repo (`ZhengPeng7/BiRefNet`) is MIT. rembg itself is MIT.
- **BLOCKED, not warned: any BRIA / RMBG-2.0 session.** rembg 2.0.86's
  own `new_session()` default is `bria-rmbg`, and BRIA RMBG-2.0 open
  weights are CC BY-NC 4.0 (commercial use needs a BRIA agreement).
  This script never calls `new_session` without an explicit model, and
  it refuses any model name containing `bria`, `rmbg-2` or `rmbg_2`
  before importing rembg. A bare run can therefore never silently pick
  the BRIA model.
- **Fast CPU fallback only, labelled: `u2net` / `u2netp` / `silueta`**
  (Apache-2.0 model family). Naming one prints a NOTE that it is the
  fallback, not the BiRefNet commercial default.
- **Alpha-matting passthrough:** `--alpha-matting` plus foreground /
  background thresholds and erode size — the Quickest 2026 Ways §2a
  step-3 decontaminate pass, through rembg, not a new pixel-edit method.
- **No model vendored.** Models are runtime downloads under
  `~/.rembg/models/` (rembg 2.0.86; older versions used `~/.u2net`).
  `sprite_pipeline.py --with-rembg` passes no `--model`, so it inherits
  the BiRefNet-general default automatically; its call signature is
  unchanged.
- **No overwrites.** Inputs are never overwritten; outputs refuse to
  overwrite unless `--force` is given (same rule as the original).

`tools/sprite-stack/requirements.txt` now lists `rembg` / `onnxruntime`
as runtime requirements (not vendored); the README row for
`remove_background.py` carries the same licence table.

## Title-creature status (10 total)

Confirmed / approved BEFORE this batch — NOT re-cut here (8/10 = 80%):

| Creature | Status |
|---|---|
| Yogiferno | Confirmed good, v2 dated 20261025-v2 — untouched |
| Mochii | Confirmed good, v1 dated 20261025-v1 — untouched |
| Sproutle, Dorowani, Tyrage, Kittember | Mars-approved "those are all perfect", PR #84 merged — untouched (re-cutting would duplicate PR #84) |
| Gabu | "Confirmed fine by Mars", untouched per TitleCreatureFigure |
| Razorgater | Baked shadow removed in main by commit `241daa3e6086`
  ("Title creature Razorgater — baked shadow removed"), current file
  265x266 — NOT re-cut here; the task's Razorgater item is already
  fixed on main, so re-running it would duplicate that lane's merge |

This batch — candidates, NEW dated files, NOT wired:

| Creature | Input (main aea7220, via Contents API) | Output (this PR, unwired) | Verdict |
|---|---|---|---|
| Mythar | `src/assets/title/mythar-walk-cutout.png` (434x350, 238,243 bytes) | `src/assets/title/mythar-walk-cutout-20261026-u2netp.png` (434x350, 246,840 bytes, fallback) | SHIPPED as candidate — eye-check PASS (below) |
| Wispkin | `src/assets/title/wispkin-walk-cutout.png` (288x609, 129,111 bytes) | — (u2netp output 68,472 bytes, generated locally, NOT shipped) | REJECTED — smoke deleted (below). BiRefNet owed. |

**Show-first:** the shipped Mythar file is a candidate only. It is NOT
imported by `TitleCreatureFigure.tsx` and does NOT change the title
rotation. Mars sees it first; wiring is a separate, later step, and
only if he confirms it.

## Run log (honest, including failures)

- Local runtime: `rembg 2.0.86` + `onnxruntime 1.31.0`, CPU, in a venv
  (not committed). `--check` passes: default model
  `birefnet-general` (MIT), BRIA blocked, u2netp labelled fallback.
- **BiRefNet attempt — BLOCKED by VM RAM, not by licence or model.**
  `birefnet-general-lite` (BiRefNet, MIT, weights
  `BiRefNet-general-bb_swin_v1_tiny-epoch_232.onnx`, 224 MB, md5
  `4fab47adc4ff364be1713e97b7e66334` per rembg's session code)
  downloaded cleanly into `~/.rembg/models/`, but every inference was
  OOM-killed (SIGKILL, exit 137) on this 7.8 GB, no-swap VM while other
  lanes ran Blender / vite / tsc jobs concurrently (load ~16,
  available RAM ~2.0–2.5 GB at kill time; inference reached ~1.7 GB
  RSS before being killed). Four kills in total: Razorgater, Wispkin,
  Mythar (first batch) + Razorgater (retry). A fifth attempt was
  stopped by this worker before inference to avoid OOM-killing other
  lanes' jobs, because the Title lane was concurrently running
  `birefnet-general` on title crops in the same VM — running two
  BiRefNet inferences at once guarantees one of them dies, so this
  worker yielded inference to that lane rather than competing.
  **BiRefNet candidates are therefore 0/2 in this PR, and a BiRefNet
  (lite or general) re-run for Wispkin + Mythar is explicitly owed.**
- **Fallback actually shipped — u2netp, labelled, 1/2 passed.**
  With BiRefNet blocked, Wispkin + Mythar were run through the
  script's labelled fast CPU fallback `u2netp` (Apache-2.0, 4.4 MB
  model already cached in `~/.u2net/`). The script prints its fallback
  NOTE on every such run. Fallback output is NOT BiRefNet output and
  is NOT labelled as such: filenames end `-u2netp`, and this report
  says so. Precedent: PR #84 used u2netp for Sproutle / Tyrage /
  Kittember (approved) and rejected it for Dorowani (belly damage) —
  so each fallback file here got the same eye-check.
- **Mythar u2netp — PASS, shipped.** Run exit 0. Size preserved
  434x350. Alpha: source 70,112 fully-opaque px; output 439
  fully-opaque but 70,322 px at alpha 200–254 (rembg's soft mask —
  feathered, not faded). Eye-check on black AND white composites:
  stained-glass wings, gold halo ring, sparkles, face, body and legs
  all intact; no feature lost. The soft-alpha caveat stands (see
  "owed": a crisper BiRefNet mask is still preferred), but the file
  is a genuine, viewable candidate.
- **Wispkin u2netp — FAIL, withheld.** Run exit 0, size preserved
  288x609, skull / eyes / hands / black body intact — but the wisp
  smoke below the body is deleted: source has 20,722 opaque px in
  rows y>=340 (the smoke trail); output has 134 (99.4% gone), and
  the composite ends at the body's bottom edge. Smoke is a defining
  feature of Wispkin, not a speck (unlike Kittember's two tiny
  bubbles in PR #84, which were disclosed and approved). Shipping a
  smoke-less Wispkin would misrepresent the creature, so the file
  was NOT uploaded. Wispkin needs BiRefNet (better at wispy detail
  per the plan) or a manual smoke-preserving pass.

## What remains owed

- Mars show-first decision on the 1 shipped fallback candidate
  (Mythar, wire / reject / re-run with a manual edge pass). Until he
  confirms, title wiring stays at the 8/10 confirmed set.
- **BiRefNet re-run for Wispkin + Mythar (0/2 shipped):** owed, and it
  needs either a quiet VM window (one BiRefNet job at a time, no
  concurrent Blender/vite inference) or a machine with more RAM / swap.
  Do NOT run it concurrently with the Title lane's BiRefNet-general
  job — serialize, or one of them will be OOM-killed again.
- Next uncleaned sets after title (in order): the remaining
  sprite-atlas / animation sets that still carry sheet backgrounds —
  none are touched by this PR, and locked PR #30 atlases are never
  overwritten by this tool.
- Manual edge pass per Quickest §2a step 6 (5 minutes per hero
  creature) is still owed for any candidate Mars confirms; model
  output (BiRefNet or fallback) does not replace it.
