#!/usr/bin/env python3
"""Self-test for delivery_gate.py.

Builds two synthetic deliveries in a scratch dir beside this
script (never /tmp — this VM's /tmp is a 512MB tmpfs), runs the
real gate on both, and prints both results:

  * PASS case — a synthetic character-work video whose timing
    record is produced by the REAL verify_proof.py (span
    structure authored on 2s with 1-frame accents: ~13 new
    drawings/sec, above the scene floor of 12), a claims file
    that opens with its self-judgment, a full 21-item audit
    (one item honestly marked FAIL — and named in the judgment,
    which the gate must accept: it enforces honesty, not
    perfection), and a COMPLETE likeness-run record.
  * FAIL case — the same delivery with audit item 8 (far arm)
    left unmarked. The gate must fail it and name the item.

Exits 0 iff the gate passes the first and fails the second.
The scratch dir is deleted on exit, pass or fail.
"""
import hashlib, json, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRATCH = HERE / "delivery-gate-selftest-scratch"
GATE = HERE / "delivery_gate.py"
CHECKER = HERE / "verify_proof.py"
CHECKLIST = HERE / "audit-checklist.json"


def sha256_of(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def build_clip(path):
    """96 frames at 24 fps (4.0 s): spans of 2 frames with a few
    1-frame accents, cycling four strongly different drawings —
    an authored span structure at ~13 new drawings/sec."""
    from PIL import Image, ImageDraw
    frames_dir = SCRATCH / "frames"
    frames_dir.mkdir(parents=True)
    drawings = []
    for k in range(4):
        img = Image.new("RGB", (128, 72), (40 + 50 * k, 60, 90))
        d = ImageDraw.Draw(img)
        d.rectangle([10 + 25 * k, 20, 45 + 25 * k, 55],
                    fill=(255, 220, 40 + 40 * k))
        d.ellipse([80 - 10 * k, 10, 105 - 10 * k, 35], fill=(30, 200, 160))
        drawings.append(img)
    span_lengths = [2] * 44 + [1] * 8  # 96 frames, 52 spans
    idx = 0
    for s, ln in enumerate(span_lengths):
        for _ in range(ln):
            drawings[s % 4].save(frames_dir / f"f{idx:03d}.png")
            idx += 1
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-framerate", "24",
         "-i", str(frames_dir / "f%03d.png"),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", str(path)],
        check=True)
    shutil.rmtree(frames_dir)


def build_case(clip, clip_sha, drop_audit_id=None):
    case = SCRATCH / ("failcase" if drop_audit_id is not None else "passcase")
    case.mkdir(parents=True)
    shutil.copy(clip, case / "walk.mp4")
    # canon reference + comparison sheet (synthetic stand-ins)
    from PIL import Image
    Image.new("RGB", (64, 64), (120, 90, 60)).save(case / "canon.png")
    Image.new("RGB", (128, 64), (200, 200, 200)).save(case / "comparison.png")
    # claims: judgment FIRST, naming the one honest failure
    (case / "claims.md").write_text(
        "# Delivery claims — synthetic walk proof (self-test)\n\n"
        "## Self-judgment\n\n"
        "The figure reads as the character in profile and the "
        "walk cycle is honestly drawn, but it is not clean: "
        "hair-frozen-no-secondary-motion (audit item 14) — the "
        "hair is one drawing across the whole cycle, no lag or "
        "settle. That failure is stated here, before any "
        "measurement, per the working rules.\n\n"
        "## Measured axes\n\n"
        "Timing measured by verify_proof.py; see the timing "
        "record supplied with the manifest.\n")
    # likeness run record: COMPLETE, keyed to this clip's sha
    runs = [{
        "recorded_at": "2026-10-28T00:00:00+00:00",
        "clip": str(case / "walk.mp4"),
        "clip_sha256": clip_sha,
        "reference": {"path": str(case / "canon.png"),
                      "sha256": sha256_of(case / "canon.png")},
        "comparison_sheet": {"path": str(case / "comparison.png"),
                             "present": True},
        "record_status": "COMPLETE",
    }]
    (case / "likeness-runs.json").write_text(json.dumps(runs, indent=2))
    # timing record from the real checker
    subprocess.run(
        [sys.executable, str(CHECKER), str(case / "walk.mp4"),
         "--json-out", str(case / "verify-out.json"),
         "--register", "scene"],
        check=True, capture_output=True, text=True)
    # audit: every item marked; item 14 an honest, named fail
    items = json.loads(CHECKLIST.read_text())["items"]
    audit = []
    for it in items:
        if drop_audit_id is not None and it["id"] == drop_audit_id:
            continue
        audit.append({
            "id": it["id"],
            "result": "fail" if it["id"] == 14 else "pass",
            "note": ("inspected all poses at full size: hair is "
                     "pixel-identical across the cycle"
                     if it["id"] == 14 else
                     "inspected all poses at full size"),
        })
    manifest = {
        "deliverable": "walk.mp4",
        "sha256": clip_sha,
        "kind": "video",
        "register": "scene",
        "character_work": True,
        "claims_file": "claims.md",
        "timing_record": "verify-out.json",
        "likeness_runs": "likeness-runs.json",
        "audit": audit,
    }
    (case / "manifest.json").write_text(json.dumps(manifest, indent=2))
    return case


def run_gate(case):
    proc = subprocess.run(
        [sys.executable, str(GATE), str(case / "manifest.json")],
        capture_output=True, text=True)
    record = json.loads((case / "walk.mp4.gate.json").read_text())
    return proc, record


def main():
    if SCRATCH.exists():
        shutil.rmtree(SCRATCH)
    SCRATCH.mkdir(parents=True)
    try:
        clip = SCRATCH / "src.mp4"
        build_clip(clip)
        clip_sha = sha256_of(clip)

        ok_case = build_case(clip, clip_sha)
        proc, record = run_gate(ok_case)
        print("=== PASS CASE ===")
        print(proc.stdout.strip())
        headline = json.loads(
            (ok_case / "verify-out.json").read_text()
        )["timing_profile"]["headline"]
        print("checker headline:", headline["effective_new_drawings_per_second"],
              "new drawings/sec —", headline["class"])
        pass_ok = proc.returncode == 0 and record["verdict"] == "pass"

        fail_case = build_case(clip, clip_sha, drop_audit_id=8)
        proc2, record2 = run_gate(fail_case)
        print("=== FAIL CASE (audit item 8 unmarked) ===")
        print(proc2.stdout.strip())
        fail_ok = proc2.returncode == 1 and record2["verdict"] == "fail" \
            and any("item 8" in v for v in record2["violations"])

        print("=== SELF-TEST:", "PASS" if (pass_ok and fail_ok) else "FAIL",
              f"(gate passed the honest delivery: {pass_ok}; "
              f"gate failed the unmarked-audit delivery: {fail_ok}) ===")
        return 0 if (pass_ok and fail_ok) else 1
    finally:
        shutil.rmtree(SCRATCH, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
