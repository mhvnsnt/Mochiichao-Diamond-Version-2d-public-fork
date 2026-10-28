#!/usr/bin/env python3
"""Convert Rhubarb Lip Sync output to Mochiichao native mouth data.

Native format: mochiichao-mouth-data/v1 (see MOUTH-DATA-FORMAT.md).
Mouth IDs are the Preston Blair chart IDs used by Jamar's rig scaffolds
(show/production/rigs/scaffolds/*.rig.json, symbol "mouth" frames).

Input formats (Rhubarb Lip Sync 1.13.0):
  json  -- Rhubarb JSON: {"metadata": {...}, "mouthCues": [{start, end, value}]}
  tsv   -- Rhubarb TSV:  start<TAB>end<TAB>value per line
  dat   -- Rhubarb DAT exported with --datUsePrestonBlair:
           lines of "<frame> <BlairName>" (Moho-style), converted at --fps.

HUMANS ONLY. Mochiichao creatures are cries-only by owner law and never
receive mouth data; this converter exists for the human cast's dialogue.

Stdlib only. Usage:
  python3 rhubarb_to_mouthdata.py INPUT [-o OUT] [--format json|tsv|dat]
      [--fps 24] [--lead-frames 1] [--character NAME] [--audio FILE]
      [--dialog "spoken line"]
"""
import argparse, json, sys

# Rhubarb shape -> native Blair chart ID (rig scaffold symbol frame name).
# Mapping is Rhubarb's own documented Preston Blair mapping
# (--datUsePrestonBlair table) resolved onto Jamar's 10-frame Blair set:
#   Rhubarb B "etc" covers the consonant cluster; Jamar's set splits it
#   into C_D_G_K_S_Z (hiss cluster) and L_T_D_N_Th (tongue cluster).
#   B defaults to the hiss cluster; animators re-point t/d/n/th cues to
#   L_T_D_N_Th when the tongue must read (see MOUTH-DATA-FORMAT.md).
#   Rhubarb F is its merged U/WQ pucker; native default is U, with W_Q
#   available as an animator swap for w/q-forward lines.
RHUBARB_TO_BLAIR = {
    "X": "rest",
    "A": "M_B_P",
    "B": "C_D_G_K_S_Z",
    "C": "E",
    "D": "A_I",
    "E": "O",
    "F": "U",
    "G": "F_V",
    "H": "L_T_D_N_Th",
}

# Rhubarb DAT with --datUsePrestonBlair already uses these names.
DAT_PB_TO_BLAIR = {
    "rest": "rest", "MBP": "M_B_P", "etc": "C_D_G_K_S_Z", "E": "E",
    "AI": "A_I", "O": "O", "U": "U", "WQ": "W_Q", "FV": "F_V",
    "L": "L_T_D_N_Th",
}

# Frame index (1-based) of each Blair ID inside the rig scaffold's
# mouth Graphic symbol (order fixed by scaffolds/*.rig.json).
SYMBOL_FRAME = {
    "rest": 1, "A_I": 2, "E": 3, "O": 4, "U": 5, "M_B_P": 6,
    "F_V": 7, "L_T_D_N_Th": 8, "C_D_G_K_S_Z": 9, "W_Q": 10,
}


def read_json(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    cues = [(float(c["start"]), float(c["end"]), c["value"].strip().upper())
            for c in data.get("mouthCues", [])]
    meta = data.get("metadata", {})
    return cues, meta.get("soundFile"), meta.get("duration")


def read_tsv(path):
    cues = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 3 and parts[0].strip():
                cues.append((float(parts[0]), float(parts[1]),
                             parts[2].strip().upper()))
    return cues, None, (cues[-1][1] if cues else None)


def read_dat(path, fps):
    cues = []
    last_frame = None
    rows = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            parts = line.split()
            if len(parts) >= 2 and parts[0].lstrip("-").isdigit():
                rows.append((int(parts[0]), parts[1]))
    for i, (frame, name) in enumerate(rows):
        end_frame = rows[i + 1][0] if i + 1 < len(rows) else frame + 1
        blair = DAT_PB_TO_BLAIR.get(name)
        if blair is None:
            raise ValueError(f"unknown Preston Blair DAT shape: {name!r}")
        cues.append((frame / fps, end_frame / fps, blair))
        last_frame = end_frame
    return cues, None, (last_frame / fps if last_frame else None)


def convert(cues, fps, lead_frames, character, audio, dialog, duration,
            source_format, pre_mapped=False):
    # Merge consecutive cues with the same native shape (Rhubarb B->hiss
    # merges are expected; merging keeps symbol stepping clean).
    # pre_mapped=True only for DAT input, whose values read_dat() already
    # converted to native Blair IDs. JSON/TSV values are Rhubarb letters
    # and must ALWAYS go through RHUBARB_TO_BLAIR -- note Rhubarb "E"
    # means Blair O, which is not the native Blair ID "E".
    merged = []
    for start, end, raw in cues:
        blair = raw if pre_mapped else RHUBARB_TO_BLAIR.get(raw)
        if blair is None:
            raise ValueError(f"unknown Rhubarb shape: {raw!r}")
        if merged and merged[-1]["blair"] == blair and abs(merged[-1]["end"] - start) < 1e-6:
            merged[-1]["end"] = end
            merged[-1]["rhubarb"] += "+" + raw
        else:
            merged.append({"start": start, "end": end,
                           "rhubarb": raw, "blair": blair})
    out_cues, warnings = [], []
    for c in merged:
        sf = max(0, round(c["start"] * fps) - lead_frames)
        ef = max(sf + 1, round(c["end"] * fps) - lead_frames)
        hold = ef - sf
        if hold > 6 and c["blair"] != "rest":
            warnings.append(
                f"hold {hold}f on {c['blair']} at {c['start']:.2f}s exceeds "
                "the playbook 6-frame max for a non-rest shape")
        out_cues.append({
            "start_s": round(c["start"], 3),
            "end_s": round(c["end"], 3),
            "start_frame": sf + 1,          # 1-based timeline frame
            "end_frame": ef,                # last frame the shape is held
            "hold_frames": hold,
            "rhubarb": c["rhubarb"],
            "blair": c["blair"],
            "symbol_frame": SYMBOL_FRAME[c["blair"]],
        })
    mbp = sum(1 for c in out_cues if c["blair"] == "M_B_P")
    return {
        "schema": "mochiichao-mouth-data/v1",
        "scope": "human_only",
        "character": character,
        "audio": audio,
        "dialog": dialog,
        "fps": fps,
        "lead_frames": lead_frames,
        "duration_s": duration,
        "source": {"tool": "Rhubarb Lip Sync 1.13.0",
                   "format": source_format},
        "blair_set": "preston_blair_10 (rig scaffold mouth symbol order)",
        "checks": {"mbp_closures": mbp, "warnings": warnings},
        "cues": out_cues,
    }


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("input")
    ap.add_argument("-o", "--output")
    ap.add_argument("--format", choices=["json", "tsv", "dat"],
                    default="json")
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--lead-frames", type=int, default=1,
                    help="playbook rule: mouth leads audio by 1 frame")
    ap.add_argument("--character", default=None)
    ap.add_argument("--audio", default=None)
    ap.add_argument("--dialog", default=None)
    a = ap.parse_args(argv)

    if a.format == "json":
        cues, sound, dur = read_json(a.input)
    elif a.format == "tsv":
        cues, sound, dur = read_tsv(a.input)
    else:
        cues, sound, dur = read_dat(a.input, a.fps)
    result = convert(cues, a.fps, a.lead_frames, a.character,
                     a.audio or sound, a.dialog, dur, a.format,
                     pre_mapped=(a.format == "dat"))
    text = json.dumps(result, indent=2) + "\n"
    if a.output:
        with open(a.output, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
