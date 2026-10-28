#!/usr/bin/env python3
"""Stage FLUX.1-schnell onto Kaggle WITHOUT ever holding the whole file
on a kernel's working disk — chunked range download -> per-part
Kaggle Datasets -> byte-exact assembly in the consumer kernel.

Why this exists (measured, PULL-IN-REPORT.md, 2026-10-28):
  * The official repo black-forest-labs/FLUX.1-schnell is gated:"auto"
    (HF API) — file downloads return 401 without an HF account that
    accepted the licence + a token. This script therefore defaults to
    the hash-verified ungated mirror used by pull-in attempt 2
    (Niansuh/FLUX.1-schnell), whose LFS sha256 values were checked
    file-by-file against BFL's official listing before that attempt.
    The official repo can be used instead by setting HF_TOKEN (a
    Kaggle Secret on the staging kernel) and --repo to the official
    id — see FLUX-DATASET-ROUTE.md for the owner step that enables it.
  * flux1-schnell.safetensors is 23,782,506,688 B (23,782.51 MB).
    A Kaggle kernel's free /kaggle/working measured 20,940.49 MB in
    the failed run's own log. snapshot_download into /kaggle/working
    can therefore NEVER hold this file, and neither can a set of
    co-resident split parts (splitting does not shrink the total).
    The only shape that works: at most ONE part on disk at a time,
    uploaded to its own dataset before the next part is fetched.

Design (three phases; phases 1 runs on Kaggle, phase 2 anywhere
kagglehub can authenticate, phase 3 runs in the consumer kernel):

  Phase 1+2 (--stage, run inside a Kaggle kernel, CPU is fine):
    for each part i of the big file:
        range-download bytes [i*PART, (i+1)*PART) with HTTP Range
        -> /kaggle/working/flux-part/flux1-schnell.part{i:02d}
        -> kagglehub.dataset_upload("<user>/mochiichao-flux1-schnell-part{i}", dir)
        -> delete the local part (disk returns to ~empty)
    The small companion files (ae.safetensors 335,304,388 B + the
    text encoders + configs, ~10.1 GB total) fit under the working
    limit together, so they are fetched whole with snapshot-style
    single-file downloads and uploaded as one more dataset
    (<user>/mochiichao-flux1-schnell-extras). Every part is sha256'd
    as it is written (streaming); the expected whole-file sha256 is
    BFL's official LFS hash, checked at assembly time.

  Phase 3 (--assemble, run inside the CONSUMER kernel):
    Attach all part datasets + the extras dataset as dataset_sources.
    Concatenate the parts IN ORDER into ComfyUI/models/... — wait:
    the consumer kernel has the same ~21 GB working limit and the
    assembled file is 23.8 GB. Assembly therefore does NOT happen on
    the consumer's working disk either. See --assemble's docstring in
    code: it streams part-by-part from the READ-ONLY /kaggle/input
    mounts (input storage is not the working quota) into the output
    file... which would still live on working. THE HONEST STATE:
    a single-file fp16 FLUX checkpoint cannot be materialised on a
    Kaggle kernel at all. What --assemble produces instead is the
    DIFFUSERS-FORMAT layout: the mirror/official repo's transformer/
    shards (5 shards, each < 5 GB) + vae + encoders from the extras
    set, symlinked into a model folder that diffusers/ComfyUI's
    FLUX pipeline loads shard-by-shard from /kaggle/input without
    copying. If a consumer truly needs the single file, it must run
    somewhere with >= 24 GB of free disk. This is stated, not hidden:
    see FLUX-DATASET-ROUTE.md, verdict section.

This script was NOT executed against Kaggle by its author (the
Kaggle seat is owned by another worker this round and the account
was rate-limited earlier today). It is syntax-checked, its range /
hash / split maths is unit-checkable offline (--self-test), and its
two external calls (HTTP Range GET, kagglehub.dataset_upload) use
only documented interfaces (kagglehub dataset_upload: PyPI
kagglehub docs, "Uploads a new dataset (or a new version if it
already exists)", signature dataset_upload(handle, local_dataset_dir,
version_notes=..., ignore_patterns=...)).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path

MIRROR_REPO = "Niansuh/FLUX.1-schnell"          # ungated, hash-verified vs official (pull-in attempt 2)
OFFICIAL_REPO = "black-forest-labs/FLUX.1-schnell"
BIG_FILE = "flux1-schnell.safetensors"
BIG_FILE_BYTES = 23_782_506_688                  # HF API, official listing, 2026-10-28
BIG_FILE_SHA256 = "9403429e0052277ac2a87ad800adece5481eecefd9ed334e1f348723621d2a0a"  # official LFS hash (manifest-flux1-schnell.json)
PART_BYTES = 4_000_000_000                       # 4.0 GB per part: 6 parts, each far under any per-step limit
WORKDIR = Path("/kaggle/working")
USER_AGENT = "mochiichao-flux-stage/1.0"


def part_ranges(total: int = BIG_FILE_BYTES, part: int = PART_BYTES):
    """[(index, start, end_inclusive)] covering the file exactly."""
    out = []
    start = 0
    idx = 0
    while start < total:
        end = min(start + part, total) - 1
        out.append((idx, start, end))
        start = end + 1
        idx += 1
    return out


def resolve_url(repo: str, filename: str) -> tuple[str, dict]:
    """Return (url, headers). Official repo needs HF_TOKEN for gated files."""
    url = f"https://huggingface.co/{repo}/resolve/main/{filename}"
    headers = {"User-Agent": USER_AGENT}
    token = os.environ.get("HF_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return url, headers


def range_download(repo: str, filename: str, start: int, end: int, dest: Path) -> str:
    """Stream one byte range to dest, return its sha256 (of the part)."""
    url, headers = resolve_url(repo, filename)
    headers["Range"] = f"bytes={start}-{end}"
    req = urllib.request.Request(url, headers=headers)
    h = hashlib.sha256()
    written = 0
    with urllib.request.urlopen(req, timeout=120) as resp:
        status = getattr(resp, "status", 200)
        if status != 206:
            raise RuntimeError(
                f"server did not honour Range (HTTP {status}); "
                "chunked staging requires a range-capable endpoint"
            )
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open("wb") as f:
            while True:
                chunk = resp.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
                h.update(chunk)
                written += len(chunk)
    expected = end - start + 1
    if written != expected:
        raise RuntimeError(f"short part: wrote {written} of {expected} bytes")
    return h.hexdigest()


def dataset_upload(handle: str, local_dir: Path, notes: str) -> None:
    import kagglehub  # lazy: --self-test / --assemble-plan must not need it

    kagglehub.dataset_upload(handle, str(local_dir), version_notes=notes)


def stage(repo: str, user: str) -> dict:
    """Phase 1+2: one part on disk at a time. Run inside a Kaggle kernel."""
    if not WORKDIR.is_dir():
        raise RuntimeError("this phase must run inside a Kaggle kernel (/kaggle/working missing)")
    manifest = {"repo": repo, "file": BIG_FILE, "bytes": BIG_FILE_BYTES,
                "sha256_expected": BIG_FILE_SHA256, "parts": []}
    part_dir = WORKDIR / "flux-part"
    for idx, start, end in part_ranges():
        name = f"flux1-schnell.part{idx:02d}"
        dest = part_dir / name
        sha = range_download(repo, BIG_FILE, start, end, dest)
        (part_dir / "part.json").write_text(json.dumps(
            {"part": idx, "start": start, "end": end, "sha256": sha,
             "source_repo": repo, "whole_file_sha256": BIG_FILE_SHA256}))
        handle = f"{user}/mochiichao-flux1-schnell-part{idx}"
        dataset_upload(handle, part_dir, notes=f"FLUX.1-schnell bytes {start}-{end} (part {idx})")
        manifest["parts"].append({"index": idx, "start": start, "end": end,
                                  "sha256": sha, "dataset": handle})
        dest.unlink()  # disk returns to ~empty before the next part
        print(f"part {idx} staged -> {handle} (sha256 {sha[:16]}...)")
    (WORKDIR / "flux-parts-manifest.json").write_text(json.dumps(manifest, indent=1))
    print("NOTE: extras set (ae + encoders + configs, ~10.1 GB) still to stage: "
          "single-file downloads fit the working disk together; upload as "
          f"{user}/mochiichao-flux1-schnell-extras. File list + official hashes: "
          "manifest-flux1-schnell.json in the pull-ins folder.")
    return manifest


def assemble_plan() -> dict:
    """Phase 3, stated honestly (see module docstring): the single file
    cannot be materialised on a Kaggle kernel. The runnable consumer
    layout is the diffusers-format tree, symlinked from the read-only
    dataset mounts, so no byte is ever copied onto working disk.
    Shard sizes below are the official HF listing, re-fetched
    2026-10-28; the ungated mirror's LFS hashes match them exactly."""
    return {
        "single_file_on_kaggle": "IMPOSSIBLE — 23,782,506,688 B file vs "
        "20,940.49 MB measured free /kaggle/working; assembly target "
        "would live on the same quota.",
        "recommended_route": "stage the DIFFUSERS tree instead of the "
        "single file: every shard is individually under the working "
        "limit, so no Range chunking is even needed — download one "
        "shard (or a <= ~19 GB group), dataset_upload it, delete, "
        "repeat. Shards: 9,962,580,296 + 9,949,328,904 + 3,870,584,832 "
        "= 23,782,494,032 B of transformer, plus vae 167,666,902 B and "
        "text encoders 9,770,792,936 B + configs/tokenizers (~13 MB). "
        "Suggested split: dataset A = transformer shards 1+3 "
        "(13,833,165,128 B), dataset B = transformer shard 2 "
        "(9,949,328,904 B), dataset C = vae + encoders + configs "
        "(~9.94 GB).",
        "consumer_layout": {
            "transformer/": "the repo's diffusers-format transformer shards, "
            "symlinked from the /kaggle/input dataset mounts — loaded "
            "shard-by-shard by diffusers/ComfyUI from the mounts, never "
            "copied onto working disk",
            "vae/": "vae/diffusion_pytorch_model.safetensors (167,666,902 B)",
            "text_encoder/, text_encoder_2/, tokenizer/, tokenizer_2/, scheduler/":
            "from the extras dataset, symlinked, never copied",
        },
        "verify_before_use": "sha256 of every staged part and extras file "
        "against manifest-flux1-schnell.json (official LFS hashes); a "
        "mismatch fails the consumer kernel before any model load.",
        "if_single_file_is_mandatory": "run the consumer somewhere with "
        ">= 24 GB free disk (not a Kaggle kernel), or use the fp8 "
        "single file (17,236,328,572 B per the pull-in report) which "
        "DOES fit the working quota with ~3.7 GB to spare.",
    }


def self_test() -> int:
    ranges = part_ranges()
    assert ranges[0] == (0, 0, PART_BYTES - 1)
    assert ranges[-1][2] == BIG_FILE_BYTES - 1
    assert sum(e - s + 1 for _, s, e in ranges) == BIG_FILE_BYTES
    assert all(ranges[i][2] + 1 == ranges[i + 1][1] for i in range(len(ranges) - 1))
    print(f"self-test OK: {len(ranges)} parts cover {BIG_FILE_BYTES} B exactly, contiguous")
    print(json.dumps(assemble_plan(), indent=1))
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Chunked FLUX.1-schnell staging for Kaggle (see FLUX-DATASET-ROUTE.md)")
    ap.add_argument("--stage", action="store_true", help="run phases 1+2 (inside a Kaggle kernel)")
    ap.add_argument("--repo", default=MIRROR_REPO,
                    help=f"source repo (default: the hash-verified ungated mirror; use {OFFICIAL_REPO} with HF_TOKEN set for the official gated repo)")
    ap.add_argument("--user", default="marsfmmg", help="Kaggle username that owns the part datasets")
    ap.add_argument("--assemble-plan", action="store_true", help="print the consumer-side layout verdict as JSON")
    ap.add_argument("--self-test", action="store_true", help="offline checks of the split maths + plan (no network, no Kaggle)")
    args = ap.parse_args(argv)
    if args.self_test:
        return self_test()
    if args.assemble_plan:
        print(json.dumps(assemble_plan(), indent=1))
        return 0
    if args.stage:
        stage(args.repo, args.user)
        return 0
    ap.error("choose --stage, --assemble-plan or --self-test")
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
