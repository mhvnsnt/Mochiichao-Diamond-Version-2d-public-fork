#!/usr/bin/env python3
"""Bundle builder for the avatar stack (step 3 of AVATAR-STACK-PIPELINE.md).

Takes a finished source clip (produced by whichever backend generated it)
and assembles a repo bundle directory:

    <out-dir>/<species>/
        <species>-<variant>.mp4              the clip, copied byte-for-byte
        <species>-<variant>.transparent.webm alpha twin (ONLY when
                                              --white-field is passed and the
                                              clip really is white-field)
        <species>.webp                        poster (from --source-still,
                                              else frame 0 of the clip)
        manifest.json                         measured spec + sha256 of
                                              every produced file
        gate-packet.json                      only with --run-gate

Honesty rules baked in:
  * The spec in the manifest is MEASURED from the produced MP4 with
    ffprobe. Nothing is hardcoded; if the clip is not the 720x720 / 8s /
    24fps target, the manifest says so (conformance.meets_target false).
  * If --white-field is not passed, the twin is recorded as
    SKIPPED_NOT_WHITE_FIELD and NO twin file is produced. A twin is never
    faked from a non-white-field source.
  * quality_status is always "PENDING_GATE" at bundle time. Running the
    gate (--run-gate) attaches the packet path and its measured verdict
    AS A RECOMMENDATION; promotion is a separate recording step in
    show/shared/clip-index.json (orchestrator law).

Usage:
  generate_bundle.py --source-clip CLIP.mp4 --species dorowani \
      --backend kaggle-wan22-ti2v-5b [--variant idle] \
      [--source-still STILL.png] [--white-field] [--run-gate] \
      [--out-dir DIR]
"""
import argparse, hashlib, importlib.util, json, shutil, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
TARGET = {"width": 720, "height": 720, "fps": 24.0, "duration_s": 8.0}


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def probe(path):
    """Measured spec of a media file via ffprobe."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=codec_name,width,height,avg_frame_rate,nb_frames",
         "-show_entries", "format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(f"ffprobe failed on {path}: {out.stderr.strip()}")
    d = json.loads(out.stdout)
    st = d["streams"][0]
    num, den = st["avg_frame_rate"].split("/")
    fps = float(num) / float(den) if float(den) else 0.0
    duration = float(d["format"]["duration"])
    frames = int(st["nb_frames"]) if st.get("nb_frames") else int(round(duration * fps))
    return {"codec": st["codec_name"], "width": int(st["width"]),
            "height": int(st["height"]), "fps": round(fps, 3),
            "frames": frames, "duration_s": round(duration, 3)}


def load_white_matte():
    spec = importlib.util.spec_from_file_location(
        "white_matte", HERE / "white_matte.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def make_poster(clip, still, out_path):
    from PIL import Image
    if still:
        Image.open(still).save(out_path, "WEBP", quality=92)
        return "source_still"
    tmp = out_path.with_suffix(".frame0.png")
    r = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(clip),
         "-vf", "select='eq(n\\,0)'", "-frames:v", "1", str(tmp)],
        capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"poster frame extract failed: {r.stderr.strip()}")
    Image.open(tmp).save(out_path, "WEBP", quality=92)
    tmp.unlink()
    return "clip_frame_0"


def main():
    ap = argparse.ArgumentParser(description="Assemble an avatar-stack bundle from a finished clip.")
    ap.add_argument("--source-clip", required=True)
    ap.add_argument("--species", required=True)
    ap.add_argument("--backend", required=True,
                    help="backend id from backends.json (provenance of the source clip)")
    ap.add_argument("--variant", default="idle")
    ap.add_argument("--source-still", default=None,
                    help="poster source still (default: frame 0 of the clip)")
    ap.add_argument("--white-field", action="store_true",
                    help="source is on a white field: produce the alpha twin with white_matte.py")
    ap.add_argument("--run-gate", action="store_true",
                    help="run likeness_gate.py on the bundled MP4 and attach its packet")
    ap.add_argument("--cutouts", default=None,
                    help="canon cutouts dir (passed through to likeness_gate.py)")
    ap.add_argument("--out-dir", default="avatar-bundles")
    args = ap.parse_args()

    src = Path(args.source_clip)
    if not src.exists():
        print(f"FATAL: source clip not found: {src}", file=sys.stderr)
        return 2

    registry = json.loads((HERE / "backends.json").read_text())
    backends = {b["id"]: b for b in registry["backends"]}
    if args.backend not in backends:
        print(f"FATAL: unknown backend '{args.backend}'. "
              f"Known: {sorted(backends)}", file=sys.stderr)
        return 2
    backend = backends[args.backend]

    bundle = Path(args.out_dir) / args.species
    bundle.mkdir(parents=True, exist_ok=True)

    mp4_out = bundle / f"{args.species}-{args.variant}.mp4"
    shutil.copyfile(src, mp4_out)
    spec = probe(mp4_out)
    conformance = {
        "target": TARGET,
        "meets_target": (
            spec["width"] == TARGET["width"]
            and spec["height"] == TARGET["height"]
            and abs(spec["fps"] - TARGET["fps"]) < 0.01
            and abs(spec["duration_s"] - TARGET["duration_s"]) < 0.1),
    }

    files = {"mp4": {"path": mp4_out.name, "sha256": sha256_of(mp4_out),
                     "bytes": mp4_out.stat().st_size}}

    # --- transparent twin: only from a declared white-field source ------
    if args.white_field:
        webm_out = bundle / f"{args.species}-{args.variant}.transparent.webm"
        try:
            wm = load_white_matte()
        except FileNotFoundError:
            print("FATAL: --white-field needs white_matte.py beside this "
                  "script (it ships in the same repo folder).", file=sys.stderr)
            return 2
        wm.main(str(mp4_out), str(webm_out))
        files["transparent_webm"] = {
            "path": webm_out.name, "sha256": sha256_of(webm_out),
            "bytes": webm_out.stat().st_size,
            "status": "PRODUCED_WHITE_FIELD",
            "method": "white_matte.py (white-distance key + enclosed-region rescue)",
        }
    else:
        files["transparent_webm"] = {
            "path": None, "sha256": None, "bytes": None,
            "status": "SKIPPED_NOT_WHITE_FIELD",
            "method": None,
        }

    # --- poster -----------------------------------------------------------
    poster_out = bundle / f"{args.species}.webp"
    poster_src = make_poster(mp4_out, args.source_still, poster_out)
    files["poster"] = {"path": poster_out.name, "sha256": sha256_of(poster_out),
                       "bytes": poster_out.stat().st_size,
                       "source": poster_src}

    manifest = {
        "schema": "mochiichao-show/avatar-bundle/v1",
        "species": args.species,
        "variant": args.variant,
        "backend": args.backend,
        "backend_callable_from_repo": backend.get("callable_from_repo"),
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "source_clip": str(src),
        "spec": spec,
        "conformance": conformance,
        "files": files,
        "quality_status": "PENDING_GATE",
        "likeness_gate": {"packet": None, "verdict_recommendation": None},
    }

    # --- optional gate run: attaches the packet, never promotes ----------
    if args.run_gate:
        packet_path = bundle / "gate-packet.json"
        cmd = [sys.executable, str(HERE / "likeness_gate.py"),
               "--clip", str(mp4_out), "--species", args.species,
               "--out", str(packet_path)]
        if args.cutouts:
            cmd += ["--cutouts", args.cutouts]
        r = subprocess.run(cmd, capture_output=True, text=True)
        print(r.stdout.strip())
        if packet_path.exists():
            verdict = json.loads(packet_path.read_text()).get("verdict")
            manifest["likeness_gate"] = {
                "packet": packet_path.name,
                "verdict_recommendation": verdict,
            }
        else:
            manifest["likeness_gate"] = {
                "packet": None, "verdict_recommendation": None,
                "error": (r.stderr or r.stdout).strip()[-500:],
            }

    manifest_path = bundle / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")

    print(f"bundle: {bundle}")
    for p in sorted(bundle.iterdir()):
        print(f"  {p.name}  ({p.stat().st_size} bytes)")
    print(f"spec (measured): {spec['width']}x{spec['height']} "
          f"{spec['fps']}fps {spec['frames']} frames {spec['duration_s']}s "
          f"codec {spec['codec']} | meets_target={conformance['meets_target']}")
    print(f"quality_status: PENDING_GATE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
