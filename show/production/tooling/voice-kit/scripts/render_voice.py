#!/usr/bin/env python3
"""Mochiichao voice-kit renderer (Chatterbox clone path).

Adapted from Jamar's wizard-gang-voice-pipe scripts/render_voice.py —
same engine, same param discipline — rebuilt Mochiichao-native:
character data lives in characters.json (config, not code), the queue
carries prosody fields, and dry-run is the default (cape-jones
pipeline convention: nothing renders on spec).

HUMAN VOICES ONLY. Creatures are cries-only by owner law and have no
slots in characters.json — that absence is deliberate, do not add any.

Usage:
    # plan a queue without rendering (default)
    python scripts/render_voice.py --queue render-queue.json

    # actually render the queue (needs weights: TeraBox manifest /
    # HF cache — see TERABOX-MANIFEST.md)
    python scripts/render_voice.py --queue render-queue.json --run

    # single line
    python scripts/render_voice.py --character mochiko \
        --text "Ducks don't roll uphill." --label sc02-ducks \
        --prosody-type baseline --contour baseline --run

A character whose ref_status is CASTING_TBD, or whose ref file is
missing, refuses to render — FATAL, no silent fallback voice. Until
the owner passes a casting, outputs are stamped VOICE-SCRATCH.
"""
import argparse
import json
import sys
from pathlib import Path

KIT_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = KIT_ROOT / "output"


def load_characters():
    with open(KIT_ROOT / "characters.json") as f:
        return json.load(f)["characters"]


def expand_queue(queue, characters):
    """Return a flat list of render jobs with defaults resolved."""
    char_id = queue["character"]
    if char_id not in characters:
        sys.exit(f"FATAL: unknown character slot: {char_id}")
    char = characters[char_id]
    defaults = char["defaults"]

    def resolve(line):
        return {
            "character": char_id,
            "label": line["label"],
            "text": line["text"],
            "prosody_type": line.get("prosody_type", "baseline"),
            "contour": line.get("contour", "baseline"),
            "exaggeration": float(line.get("exaggeration",
                                   queue.get("exaggeration",
                                             defaults["exaggeration"]))),
            "cfg_weight": float(line.get("cfg_weight",
                                 queue.get("cfg_weight",
                                           defaults["cfg_weight"]))),
            "ref": char["ref"],
            "ref_status": char["ref_status"],
            "status": queue.get("status", "VOICE-SCRATCH"),
            "episode": queue.get("episode", ""),
        }

    if "lines" in queue:
        return [resolve(line) for line in queue["lines"]]
    return [resolve({"label": queue.get("label", "take1"),
                     "text": queue["text"]})]


def check_ref(job):
    if job["ref_status"] == "CASTING_TBD":
        return f"{job['character']}: CASTING_TBD - no reference cast yet"
    if not (KIT_ROOT / job["ref"]).exists():
        return f"{job['character']}: missing reference audio: {job['ref']}"
    return None


def render(job):
    # Perth watermarker workaround, carried from the source pipe:
    # the vendored perth module is broken in some chatterbox-tts
    # versions; replace it with a no-op before importing chatterbox.
    from unittest.mock import MagicMock
    mock_wm = MagicMock()
    mock_wm.apply_watermark.side_effect = lambda wav, sample_rate=None, **kw: wav
    mock_perth = MagicMock()
    mock_perth.PerthImplicitWatermarker.return_value = mock_wm
    sys.modules["perth"] = mock_perth

    import torch
    import torchaudio as ta
    from chatterbox.tts import ChatterboxTTS

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading ChatterboxTTS (ResembleAI/chatterbox) on {device}...",
          flush=True)
    model = ChatterboxTTS.from_pretrained(device=device)

    suffix = "VOICE-SCRATCH" if job["status"] != "FINAL" else "FINAL"
    out_path = OUT_DIR / f"{job['character']}-{job['label']}.{suffix}.wav"
    print(f"=== {job['character']}: {job['text']!r}", flush=True)
    print(f"    prosody={job['prosody_type']}/{job['contour']} "
          f"exaggeration={job['exaggeration']} cfg={job['cfg_weight']}",
          flush=True)
    wav = model.generate(
        job["text"],
        audio_prompt_path=str(KIT_ROOT / job["ref"]),
        exaggeration=job["exaggeration"],
        cfg_weight=job["cfg_weight"],
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    ta.save(str(out_path), wav, model.sr, encoding="PCM_S",
            bits_per_sample=16)
    duration = wav.shape[-1] / model.sr
    peak = float(wav.abs().max())
    print(f"Wrote {out_path} ({duration:.2f}s, {model.sr} Hz, "
          f"peak {peak:.3f})", flush=True)
    if peak < 0.01:
        print("WARNING: output is nearly silent!", file=sys.stderr)
    return out_path


def main():
    parser = argparse.ArgumentParser(description="Render Mochiichao voice line(s)")
    parser.add_argument("--queue", help="render-queue.json to render from")
    parser.add_argument("--character", help="single-line: character slot")
    parser.add_argument("--text", help="single-line: line to speak")
    parser.add_argument("--label", default="take1", help="single-line: take label")
    parser.add_argument("--prosody-type", default="baseline")
    parser.add_argument("--contour", default="baseline")
    parser.add_argument("--exaggeration", type=float, default=None)
    parser.add_argument("--cfg-weight", type=float, default=None)
    parser.add_argument("--run", action="store_true",
                        help="actually render (default is a dry-run plan)")
    args = parser.parse_args()

    characters = load_characters()
    if args.queue:
        with open(args.queue) as f:
            queue = json.load(f)
    elif args.character and args.text:
        queue = {"character": args.character, "status": "VOICE-SCRATCH",
                 "lines": [{"label": args.label, "text": args.text,
                            "prosody_type": args.prosody_type,
                            "contour": args.contour}]}
        if args.exaggeration is not None:
            queue["lines"][0]["exaggeration"] = str(args.exaggeration)
        if args.cfg_weight is not None:
            queue["lines"][0]["cfg_weight"] = str(args.cfg_weight)
    else:
        parser.error("give --queue, or --character + --text")

    jobs = expand_queue(queue, characters)
    blocked = [check_ref(j) for j in jobs]
    blocked = [b for b in blocked if b]

    for job in jobs:
        print(f"PLAN {job['character']}-{job['label']}: "
              f"[{job['prosody_type']}/{job['contour']}] "
              f"ex={job['exaggeration']} cfg={job['cfg_weight']} "
              f"status={job['status']} :: {job['text']!r}")

    if blocked:
        for b in blocked:
            print(f"FATAL: {b}", file=sys.stderr)
        print("Refusing to render: casting is a human decision and is "
              "still open. Scratch auditions run through the Kokoro "
              "scratch path instead (VOICE-DESIGN chain / casting "
              "brief option 2).", file=sys.stderr)
        sys.exit(1)
    if not args.run:
        print(f"Dry run: {len(jobs)} job(s) planned, nothing rendered. "
              "Re-run with --run to render.")
        return
    for job in jobs:
        render(job)


if __name__ == "__main__":
    main()
