#!/usr/bin/env python3
"""07_dialogue_spec.py - dialogue-performance extension SPEC generator.

Ships AFTER the core test scene (owner addendum). This tool produces the
spec document for one dialogue scene, with REAL interfaces (the files and
schemas our lane already uses) and honest status per stage:

  line text
    -> TTS slot          WIRED AS SLOT: Chatterbox (MIT) / Kokoro
                         (Apache-2.0), weights staged byte-verified in
                         Kaggle dataset marsfmmg/mochiichao-voice-weights
                         (pull-in ledger A1). The slot names the exact
                         weight files a TTS run must resolve.
    -> Rhubarb 1.13.0    WIRED (pull-in ledger D: install repaired and
                         run verified 2026-10-28, 12 cues on the casting
                         sample) -> rhubarb_to_mouthdata.py ->
                         mochiichao-mouth-data/v1. HUMANS ONLY.
    -> cut-out lane      WIRED: 02_cue_sheet_adapter.py + mouth-swap
                         stepped displays (mouth-swap-spec.json).
    -> Wan2.2-S2V-14B    SPEC / GAP: Apache-2.0, but the 14B checkpoint
                         does not fit the current Kaggle seat (see
                         07-talking-avatar.md for the measured limits).
    -> MuseTalk          SPEC ONLY, not staged (code MIT; weights stated
                         commercial-ok in its README, no formal weights
                         licence file; component models carry own terms).

Creatures are rejected: owner law is cries-only for creatures, no word
dialogue and no mouth data. Input JSON:
  {"scene_id": "...", "lines": [{"character": "Mochiko",
   "kind": "human", "text": "...", "tts": "chatterbox"|"kokoro",
   "audio_wav": "optional existing wav"}]}
Output: <scene_id>.dialogue-spec.json. Stdlib only.
"""
import argparse, json, os, sys

TTS_SLOTS = {
    "chatterbox": {
        "backend": "chatterbox", "licence": "MIT (open source)",
        "dataset": "marsfmmg/mochiichao-voice-weights",
        "weight_files": ["chatterbox/t3_cfg.safetensors (2,129,653,744 B)",
                         "chatterbox/s3gen.safetensors (1,056,484,620 B)",
                         "chatterbox/ve.safetensors (5,695,784 B)",
                         "chatterbox/conds.pt (107,374 B)",
                         "chatterbox/tokenizer.json (25,470 B)"],
        "use": "character-cloned human voices (per-character character.yaml skeletons ride in the same dataset)",
    },
    "kokoro": {
        "backend": "kokoro-82m", "licence": "Apache-2.0 (open source)",
        "dataset": "marsfmmg/mochiichao-voice-weights",
        "weight_files": ["kokoro/kokoro-v1_0.pth (327,212,226 B)",
                         "kokoro/config.json (2,351 B)",
                         "kokoro/voices/*.pt (6 packs, 523,420-523,435 B each)"],
        "use": "clean stock voices / narration scratch and fallback",
    },
}


def build(spec):
    out_lines = []
    for i, line in enumerate(spec.get("lines", [])):
        kind = line.get("kind", "human")
        if kind != "human":
            sys.exit(f"line {i}: kind={kind!r} refused - creatures are "
                     "cries-only and never receive dialogue or mouth data")
        tts_name = line.get("tts", "chatterbox")
        if tts_name not in TTS_SLOTS:
            sys.exit(f"line {i}: unknown tts slot {tts_name!r} "
                     f"(wired slots: {sorted(TTS_SLOTS)})")
        cid = line["character"]
        stem = f"{spec['scene_id']}_l{i+1:02d}_{cid.lower()}"
        out_lines.append({
            "line": i + 1, "character": cid, "text": line["text"],
            "stages": [
                {"stage": "tts", "status": "slot_wired_weights_staged",
                 **TTS_SLOTS[tts_name],
                 "audio_out": line.get("audio_wav") or f"audio/{stem}.wav"},
                {"stage": "lipsync_analysis", "status": "wired_verified",
                 "tool": "Rhubarb Lip Sync 1.13.0 (MIT) ~/opt/bin/rhubarb -f json -d <dialog.txt>",
                 "converter": "rhubarb_to_mouthdata.py (teardowns/rig-and-mouth-systems/)",
                 "mouth_data_out": f"mouth/{stem}.mouth.json",
                 "mouth_data_schema": "mochiichao-mouth-data/v1"},
                {"stage": "performance_cutout", "status": "wired",
                 "tool": "02_cue_sheet_adapter.py + mouth-swap stepped display (mochiichao-show/mouth-swap/v1)",
                 "note": "mouth symbol stepped to symbol_frame numbers; body held per dialogue method; shadows at composite only"},
                {"stage": "performance_s2v", "status": "spec_gap_not_staged",
                 "model": "Wan-AI/Wan2.2-S2V-14B (Apache-2.0)",
                 "gap": "14B checkpoint + 80GB-VRAM single-GPU documented path exceeds the current Kaggle seat (T4 x2, ~21GB kernel working quota measured in pull-in ledger A2); no staging claim is made",
                 "job_shape": {"task": "s2v-14B", "image": "<canon cutout>",
                               "audio": f"audio/{stem}.wav",
                               "prompt": "<scene prompt>", "size": "1024*704"}},
                {"stage": "performance_musetalk", "status": "spec_only_not_staged",
                 "note": "code MIT; README states trained model available for any purpose incl. commercial, but there is no formal weights licence file and component models (whisper, ft-mse-vae, dwpose, S3FD) carry their own terms; test data non-commercial. Re-verify before any staging."},
            ],
        })
    return {"schema": "mochiichao-show/dialogue-performance/v1-spec",
            "scene_id": spec["scene_id"], "scope": "human_only",
            "status": "SPEC - ships after the core test scene",
            "lines": out_lines}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--out-dir", required=True)
    a = ap.parse_args()
    with open(a.input, encoding="utf-8") as f:
        spec = json.load(f)
    doc = build(spec)
    os.makedirs(a.out_dir, exist_ok=True)
    path = os.path.join(a.out_dir, spec["scene_id"] + ".dialogue-spec.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
    print(f"dialogue spec: {path} ({len(doc['lines'])} lines)")


if __name__ == "__main__":
    main()
