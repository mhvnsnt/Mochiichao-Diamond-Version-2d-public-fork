Ship confirmed Mythar leg-tool v6 as the title cutout.

**What:** `src/assets/title/mythar-walk-cutout.png` replaced (same path, contents replaced) with the MI-GAN leg-tool v6 cutout — 434x350 RGBA, md5 `d475d54ca4b6c9bf6c36980fc45874a1`. Legs only: MI-GAN ONNX inpainting (MIT) applied strictly inside the two leg shapes (left x149-178 y280-349, right x247-278 y290-349), 2,313 px changed vs the v3 base; wing gaps and light-ring circle gaps pixel-identical to v3 and still open; everything else byte-identical to v3.

**Confirmation:** Mars confirmed v6 in words 2026-10-26 ~18:33 CDT ("that's good enough, that's confirmed, I confirm it").

**Superseded versions, named explicitly (same-path replacement, NOT a path deletion):**
- Shipped original cutout (raw md5 `474b1583464fe377fb32098781b37bcf`) — REPLACED by v6 in this PR.
- Staged v1 (white-removed), v2 (white-removed, 4 more pockets), v3 (fur-fringe restored), v4 (pearlescent gap-fill — rejected, wrong gaps), v5 (leg solidify — judged too small a fill) — all SUPERSEDED, DO NOT USE. V6 is the new locked Mythar cutout.

**Scope:** exactly 1 file modified, 0 files deleted, 0 other files touched. No code, no audio, no other creature. Pre-ship check: live main blob verified as the shipped original before upload. Merged, not live until a Pages rebuild from main.
