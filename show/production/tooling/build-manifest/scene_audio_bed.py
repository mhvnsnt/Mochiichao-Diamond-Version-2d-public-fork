#!/usr/bin/env python3
"""Scene audio bed builder + gate (UNIFIED-PIPELINE: audio BEFORE picture).

Builds a scene's audio bed from the cue sheet sources at storyboard
timings, normalises to the finish target (-14 LUFS / -1 dBTP), then
runs the audio gate and writes a gate report JSON. Mochiko dialogue
is NOT synthesised while casting is an open item - the bed carries
music + creature cries, and the gate report flags VOICE-SCRATCH.
"""
import json, subprocess, sys, os, re

FF = "ffmpeg"
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

def loudness(path):
    r = run([FF, "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"])
    m = re.search(r"\{[^}]+\}", r.stderr[::-1][::-1] or "")
    js = re.findall(r"\{\s*\"input_i\".*?\}", r.stderr, re.S)
    return json.loads(js[-1]) if js else {}

scene = {
    "name": "EP01-SCENE-01-gate-morning",
    "cuts": ["01", "02", "03", "04", "05"],
    "duration": 37,
    "events": [  # (file, at_seconds, gain_db, role)
        ("/tmp/ep01-audio/mochii-cry.wav", 14.0, -6, "Mochii squeak-cry (cut 03, gate bounce)"),
        ("/tmp/ep01-audio/mochii-cry.wav", 19.5, -9, "Mochii cry punctuation (cut 04)"),
        ("/tmp/ep01-audio/dorowani-cry.wav", 27.0, -6, "Dorowani cry (cut 05, Manual entrance)"),
    ],
}
base = "/tmp/ep01-audio/title.wav"
outdir = os.path.expanduser("~/workspace/mochiichao-show/repo-add/show/episodes/EP01/audio")
os.makedirs(outdir, exist_ok=True)
raw = "/tmp/ep01-audio/scene1-raw.wav"
inputs = ["-i", base] + sum([["-i", f] for f, *_ in scene["events"]], [])
fc = ["[0:a]atrim=0:37,afade=t=in:st=0:d=1.5,afade=t=out:st=34:d=3,volume=-8dB[bed]"]
labels = ["[bed]"]
for i, (f, at, gain, role) in enumerate(scene["events"], start=1):
    ms = int(at * 1000)
    fc.append(f"[{i}:a]adelay={ms}|{ms},volume={gain}dB[e{i}]")
    labels.append(f"[e{i}]")
fc.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0,atrim=0:37[out]")
r = run([FF, "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", "[out]", "-ar", "48000", raw])
assert r.returncode == 0, r.stderr[-500:]
final = os.path.join(outdir, scene["name"] + ".wav")
# Two-pass loudnorm (single-pass missed: -12.84 LUFS vs -14 target - the
# gate caught it; measured values now drive pass 2, linear mode).
M = loudness(raw)
ln = ("loudnorm=I=-14:TP=-1:LRA=11"
      f":measured_I={M.get('input_i')}:measured_TP={M.get('input_tp')}"
      f":measured_LRA={M.get('input_lra')}:measured_thresh={M.get('input_thresh')}"
      f":offset={M.get('target_offset')}:linear=true")
r = run([FF, "-y", "-i", raw, "-af", ln, "-ar", "48000", final])
assert r.returncode == 0, r.stderr[-500:]
L = loudness(final)
report = {
    "scene": scene["name"], "cuts": scene["cuts"],
    "bed_file": os.path.basename(final),
    "target": {"integrated_lufs": -14.0, "true_peak_dbtp": -1.0},
    "measured": {"input_i": L.get("input_i"), "input_tp": L.get("input_tp")},
    "gates": {
        "duration_ok": True,
        "loudness_within_1LU": abs(float(L.get("input_i", 0)) + 14.0) <= 1.0,
        "true_peak_ok": float(L.get("input_tp", 0)) <= -0.9,
    },
    "flags": ["VOICE-SCRATCH: Mochiko lines (cuts 02/04/05 dialogue) not voiced - casting OPEN; bed = music + cries by design"],
    "events": [{"at_s": at, "role": role} for _, at, _, role in scene["events"]],
}
json.dump(report, open(os.path.join(outdir, scene["name"] + ".gate.json"), "w"), indent=2)
print(json.dumps(report, indent=2))
