#!/usr/bin/env python3
"""02_cue_sheet_adapter.py - synctoon CSV <-> Mochiichao cue lane.

synctoon (GPL-3.0) drives a whole 2D cut-out video from ONE CSV, one row
per frame: columns Character, Emotion, Body, Head_Direction,
Eyes_Direction, Background, Mouth_Emotion, Mouth_Name, Zoom, Blink,
Frame, Word, Start_Time, End_Time, Phoneme (verified in its README,
2026-10-28). This adapter is an ORIGINAL clean-room converter - it does
not import or copy synctoon code (GPL would follow the copy; the CSV
format is data, and data formats are the construction kit we take).

Two directions:

  to-cues   synctoon video_frames_info.csv -> our per-run cue CSV
            (consecutive identical rows collapsed into runs) with the
            mouth column resolved onto our Preston Blair 10-shape set
            (mochiichao-mouth-data/v1 symbol frames), and optionally a
            mouth-data/v1 JSON for HUMAN characters.
  to-frames our cue CSV -> synctoon-style per-frame CSV (for anyone
            rendering a scratch pass through synctoon's own renderer).

Mouth mapping seam, stated plainly: synctoon Mouth_Name values are file
stems from ITS mouth pack (e.g. a_e_h, m_b_close_s, th_h), not Blair
IDs. The table below maps by the phoneme the stem names; anything
unrecognised maps to `rest` and is counted in the run report so a human
sees the gap instead of a silent wrong mouth. HUMANS ONLY for the
mouth-data JSON (owner law: creatures are cries-only, never mouth data);
--character-kind creature refuses the JSON export.

Stdlib only.
"""
import argparse, csv, json, os, sys

BLAIR_FRAME = {"rest": 1, "A_I": 2, "E": 3, "O": 4, "U": 5, "M_B_P": 6,
               "F_V": 7, "L_T_D_N_Th": 8, "C_D_G_K_S_Z": 9, "W_Q": 10}

# synctoon mouth stem (prefix match, lowercased) -> Blair ID
MOUTH_STEM_TO_BLAIR = [
    ("m_b_close", "M_B_P"), ("mbp", "M_B_P"), ("m_b_p", "M_B_P"),
    ("f_v", "F_V"), ("fv", "F_V"),
    ("th", "L_T_D_N_Th"), ("l_", "L_T_D_N_Th"), ("l", "L_T_D_N_Th"),
    ("a_e_h", "A_I"), ("a_", "A_I"), ("ah", "A_I"), ("ai", "A_I"),
    ("e_", "E"), ("ee", "E"), ("eh", "E"),
    ("o_", "O"), ("oh", "O"),
    ("oo", "U"), ("u_", "U"), ("w_q", "W_Q"),
    ("s_", "C_D_G_K_S_Z"), ("ch", "C_D_G_K_S_Z"), ("sh", "C_D_G_K_S_Z"),
    ("k_", "C_D_G_K_S_Z"), ("g_", "C_D_G_K_S_Z"), ("t_", "C_D_G_K_S_Z"),
    ("d_", "C_D_G_K_S_Z"), ("z_", "C_D_G_K_S_Z"),
    ("sil", "rest"), ("rest", "rest"), ("closed", "rest"), ("x", "rest"),
]

CUE_FIELDS = ["run", "start_frame", "end_frame", "start_s", "end_s",
              "character", "emotion", "body", "head_direction",
              "eyes_direction", "background", "mouth_blair",
              "symbol_frame", "zoom", "word"]


def mouth_to_blair(stem):
    s = (stem or "").strip().lower()
    if not s:
        return "rest", False
    for prefix, blair in MOUTH_STEM_TO_BLAIR:
        if s.startswith(prefix):
            return blair, True
    return "rest", False


def run_key(row):
    return (row.get("Character", ""), row.get("Emotion", ""),
            row.get("Body", ""), row.get("Head_Direction", ""),
            row.get("Eyes_Direction", ""), row.get("Background", ""),
            row.get("Mouth_Name", ""), row.get("Zoom", ""))


def to_cues(inp, out_csv, out_json, fps, character_kind, character_name):
    with open(inp, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        sys.exit("no rows in input CSV")
    runs, unmapped = [], 0
    for row in rows:
        if runs and run_key(row) == runs[-1]["key"]:
            runs[-1]["span"] += 1
            continue
        blair, mapped = mouth_to_blair(row.get("Mouth_Name", ""))
        if not mapped and row.get("Mouth_Name"):
            unmapped += 1
        runs.append({"key": run_key(row), "span": 1, "row": row, "blair": blair})
    frame = 1  # 1-based, inclusive spans
    for r in runs:
        r["start_frame"] = frame
        r["end_frame"] = frame + r["span"] - 1
        frame += r["span"]
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CUE_FIELDS)
        w.writeheader()
        for i, r in enumerate(runs):
            row = r["row"]
            w.writerow({
                "run": i + 1, "start_frame": r["start_frame"],
                "end_frame": r["end_frame"],
                "start_s": round((r["start_frame"] - 1) / fps, 3),
                "end_s": round(r["end_frame"] / fps, 3),
                "character": row.get("Character", ""),
                "emotion": row.get("Emotion", ""), "body": row.get("Body", ""),
                "head_direction": row.get("Head_Direction", ""),
                "eyes_direction": row.get("Eyes_Direction", ""),
                "background": row.get("Background", ""),
                "mouth_blair": r["blair"],
                "symbol_frame": BLAIR_FRAME[r["blair"]],
                "zoom": row.get("Zoom", ""), "word": row.get("Word", ""),
            })
    print(f"cues: {out_csv} ({len(runs)} runs from {len(rows)} frames, "
          f"{unmapped} unmapped mouth stems -> rest)")
    if out_json:
        if character_kind != "human":
            sys.exit("mouth-data/v1 JSON is HUMANS ONLY (creatures are "
                     "cries-only); refusing for kind=" + character_kind)
        cues = [{"start_s": round((r["start_frame"] - 1) / fps, 3),
                 "end_s": round(r["end_frame"] / fps, 3),
                 "start_frame": r["start_frame"], "end_frame": r["end_frame"],
                 "hold_frames": r["end_frame"] - r["start_frame"] + 1,
                 "rhubarb": None, "blair": r["blair"],
                 "symbol_frame": BLAIR_FRAME[r["blair"]]} for r in runs]
        doc = {"schema": "mochiichao-mouth-data/v1", "scope": "human_only",
               "character": character_name or "unspecified",
               "fps": fps, "lead_frames": 0,
               "duration_s": round((frame - 1) / fps, 3) if runs else 0,
               "source": {"tool": "02_cue_sheet_adapter (synctoon CSV)",
                          "format": "video_frames_info.csv"},
               "blair_set": "preston_blair_10 (rig scaffold mouth symbol order)",
               "checks": {"mbp_closures": sum(1 for c in cues if c["blair"] == "M_B_P"),
                          "warnings": [f"{unmapped} unmapped mouth stems mapped to rest"] if unmapped else []},
               "cues": cues}
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(doc, f, indent=2)
        print(f"mouth-data: {out_json} ({len(cues)} cues)")


def to_frames(inp, out_csv, fps):
    with open(inp, newline="", encoding="utf-8") as f:
        cues = list(csv.DictReader(f))
    fields = ["Frame", "Character", "Emotion", "Body", "Head_Direction",
              "Eyes_Direction", "Background", "Mouth_Emotion", "Mouth_Name",
              "Zoom", "Blink", "Word", "Start_Time", "End_Time", "Phoneme"]
    blair_to_stem = {"M_B_P": "m_b_close_s", "A_I": "a_e_h", "E": "e_h",
                     "O": "o_h", "U": "oo", "F_V": "f_v", "L_T_D_N_Th": "th_h",
                     "C_D_G_K_S_Z": "s_h", "W_Q": "oo", "rest": "sil"}
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for cue in cues:
            for fr in range(int(cue["start_frame"]), int(cue["end_frame"]) + 1):
                w.writerow({
                    "Frame": fr, "Character": cue["character"],
                    "Emotion": cue["emotion"], "Body": cue["body"],
                    "Head_Direction": cue["head_direction"],
                    "Eyes_Direction": cue["eyes_direction"],
                    "Background": cue["background"], "Mouth_Emotion": "",
                    "Mouth_Name": blair_to_stem.get(cue["mouth_blair"], "sil"),
                    "Zoom": cue["zoom"], "Blink": "False",
                    "Word": cue["word"] if fr == int(cue["start_frame"]) else "",
                    "Start_Time": round((fr - 1) / fps, 3),
                    "End_Time": round(fr / fps, 3), "Phoneme": ""})
    print(f"frames: {out_csv}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["to-cues", "to-frames"])
    ap.add_argument("input")
    ap.add_argument("--out-csv", required=True)
    ap.add_argument("--out-json", default=None)
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--character-kind", choices=["human", "creature"], default="human")
    ap.add_argument("--character-name", default=None)
    a = ap.parse_args()
    if a.mode == "to-cues":
        to_cues(a.input, a.out_csv, a.out_json, a.fps, a.character_kind, a.character_name)
    else:
        to_frames(a.input, a.out_csv, a.fps)


if __name__ == "__main__":
    main()
