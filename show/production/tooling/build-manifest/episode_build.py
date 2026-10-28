#!/usr/bin/env python3
"""episode_build.py - one-command episode assembler (episode assembly seat).

Chains the existing wired tools in this folder into a single build:
every cut is rendered by composite_shot.py, the cuts are concatenated
in spec order, the scene audio beds are attached/mixed at their scene
offsets, the mix is finished with the house two-pass loudnorm
(-14 LUFS / -1 dBTP, same approach as scene_audio_bed.py and
composite_shot.py), episode_gate.py is invoked, and a build report
JSON is emitted. Build scene by scene with audio attached, per
UNIFIED-PIPELINE - this tool is that pipeline run end to end.

Usage:
    episode_build.py <episode.json> -o <output.mp4>
                     [--workdir <dir>] [--report <report.json>]

Episode spec JSON:
    {
      "episode": "EP01-SCENE-01-mini",
      "scenes": [
        {
          "name": "EP01-SCENE-01-gate-morning",
          "audio_bed": {"file": "path/to/scene-bed.wav"},
          "cuts": [
            {"id": "01", "shot": "path/to/shot-01.json"},
            {"id": "02", "shot": "path/to/shot-02.json"}
          ]
        }
      ]
    }

  scenes       Ordered array. Scenes play back-to-back in array
               order; cuts play in array order inside their scene.
  cuts[].shot  A shot spec JSON in exactly the format
               composite_shot.py consumes. Its duration_s sets the
               cut's length. For episode builds the shot specs
               should carry "audio": null - episode audio comes
               from the scene beds (see below). If a rendered cut
               does carry audio and its scene has a bed, the bed
               wins and the report flags the superseded cut audio;
               nothing is mixed twice and nothing is dropped
               silently.
  audio_bed    One of:
               - {"file": "<bed.wav>"}: an existing bed WAV (e.g.
                 a gated scene bed from show/episodes/EP01/audio/).
                 Trimmed or padded with silence to the scene's
                 total cut duration.
               - {"build": {...}}: a build instruction in the
                 shape scene_audio_bed.py implements:
                   {"base": "<music.wav>",
                    "base_gain_db": -8,
                    "base_fade_in_s": 1.5, "base_fade_out_s": 3,
                    "duration_s": <seconds, default = scene length>,
                    "events": [{"file": "<cry.wav>", "at_s": 14.0,
                                "gain_db": -6, "role": "..."}]}
                 The base is faded/gained, each event is delayed to
                 at_s at gain_db, all are mixed (amix, normalize=0)
                 at 48 kHz - the same filter graph scene_audio_bed.py
                 builds for Scene 1, generalised to any scene.
               - null (or omitted): the scene is silent unless its
                 cuts carry their own audio (see below).
               If NO scene declares a bed or a build instruction,
               the episode audio is the concatenated cut audio, and
               every cut must carry an audio stream - a silent cut
               in that mode is a named halt, not a silent gap.

Steps (in order):
  1. Render every cut via composite_shot.py (subprocess, its JSON
     report is captured per cut). A failed cut HALTS the build with
     a named error (EPISODE_BUILD_CUT_FAILED) and a non-zero exit:
     no cut is ever skipped, substituted, or presented as rendered
     when it was not.
  2. Concatenate the rendered cuts' video in spec order (re-encode,
     H.264 yuv420p, CRF 18, 24 fps - the composite_shot finish).
  3. Assemble the episode audio track from the scene beds at their
     scene offsets (or from the cut audio in the no-bed mode).
  4. Two-pass loudnorm finish to the house standard (-14 LUFS /
     -1 dBTP / LRA 11), measured values harvested AT the target
     settings - the composite_shot.py honesty rule. As there, the
     AAC encode is part of the measurement: the finished MP4 is
     re-measured, and if its true peaks breach the house -0.9 dBTP
     gate the finish re-runs with a measured pull-down (max 3
     attempts). A result with true peaks over 0 dBTP is rejected.
     Material that cannot reach -14 LUFS is reported as measured,
     never forced.
  5. Invoke episode_gate.py (the sibling in this folder) and record
     its exit code and output in the report. Its verdict is data,
     not decoration: if it errors, the report says so.
  6. Emit the build report JSON to stdout and to the report file
     (default: <output>.build-report.json): per-cut status, scene
     beds used, final measured loudness / true peak, gate results,
     flags, and - on failure - the named error.

Output: H.264 MP4 (yuv420p, CRF 18) + AAC 48 kHz 192k when audio is
present. Failures (bad spec, missing file, failed cut, ffmpeg error)
exit non-zero with the reason on stderr; a halted build leaves NO
finished output file behind - a partial render is never presented
as success. Intermediate renders stay in the workdir (default:
<output>.work/ next to the output) for audit.

Dependencies: Python 3 standard library + ffmpeg/ffprobe on PATH
(house finish chain, same as composite_shot.py) and the sibling
tools composite_shot.py / episode_gate.py in this folder.
"""
import argparse, json, os, re, subprocess, sys

FF = "ffmpeg"
PROBE = "ffprobe"
TARGET_I, TARGET_TP, TARGET_LRA = -14.0, -1.0, 11
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
COMPOSITE_SHOT = os.path.join(HERE, "composite_shot.py")
EPISODE_GATE = os.path.join(HERE, "episode_gate.py")
SPEC_DIR = os.getcwd()  # replaced with the spec file's folder in main()


def die(msg, code=2):
    print(f"episode_build: error: {msg}", file=sys.stderr)
    sys.exit(code)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def fmt_num(x):
    return f"{x:g}"


def resolve(path):
    if os.path.isabs(path) and os.path.exists(path):
        return path
    for cand in (os.path.join(SPEC_DIR, path),
                 os.path.join(os.getcwd(), path),
                 os.path.join(REPO_ROOT, path)):
        if os.path.exists(cand):
            return cand
    die(f"file not found: {path} (tried spec folder {SPEC_DIR}, "
        f"CWD and repo root {REPO_ROOT})")


def probe(path):
    r = run([PROBE, "-v", "error", "-show_streams", "-show_format",
             "-of", "json", path])
    if r.returncode != 0:
        die(f"ffprobe failed on {path}: {r.stderr.strip()[-300:]}")
    return json.loads(r.stdout)


def astream(pb):
    for s in pb.get("streams", []):
        if s.get("codec_type") == "audio":
            return s
    return None


def duration_of(pb):
    d = pb.get("format", {}).get("duration")
    if d not in (None, "N/A"):
        return float(d)
    for s in pb.get("streams", []):
        if s.get("duration") not in (None, "N/A"):
            return float(s["duration"])
    return None


def loudness(path):
    """Two-pass loudnorm measurement, analysed AT the target settings.

    Same rule as composite_shot.py (measured 2026-10-27): target_offset
    is relative to the analysis target, so the analysis runs at
    I=-14 / TP=-1, never at loudnorm's -24 LUFS defaults.
    """
    r = run([FF, "-i", path, "-af",
             f"loudnorm=I={fmt_num(TARGET_I)}:TP={fmt_num(TARGET_TP)}:"
             f"LRA={TARGET_LRA}:print_format=json",
             "-f", "null", "-"])
    blocks = re.findall(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    return json.loads(blocks[-1]) if blocks else {}


def build_bed(instr, scene_dur, out_wav, scene_name):
    """Build one scene bed from a scene_audio_bed.py-style instruction.

    Replicates scene_audio_bed.py's filter graph: base trimmed to the
    bed duration with in/out fades and a gain, each event delayed to
    its at_s at its gain_db, everything amix-ed with normalize=0 at
    48 kHz. Returns a report dict; halts (named) on any failure.
    """
    if not isinstance(instr, dict) or not instr.get("base"):
        die(f"EPISODE_BUILD_BAD_BED_BUILD: scene '{scene_name}': a bed "
            "build instruction must be an object with a 'base' file")
    dur = float(instr.get("duration_s", scene_dur))
    base = resolve(instr["base"])
    events = instr.get("events", [])
    if not isinstance(events, list):
        die(f"EPISODE_BUILD_BAD_BED_BUILD: scene '{scene_name}': "
            "events must be an array")
    inputs = ["-i", base]
    gain = float(instr.get("base_gain_db", 0))
    fi = float(instr.get("base_fade_in_s", 0))
    fo = float(instr.get("base_fade_out_s", 0))
    bed_fc = f"[0:a]atrim=0:{fmt_num(dur)},asetpts=PTS-STARTPTS"
    if fi > 0:
        bed_fc += f",afade=t=in:st=0:d={fmt_num(fi)}"
    if fo > 0:
        bed_fc += f",afade=t=out:st={fmt_num(max(dur - fo, 0))}:d={fmt_num(fo)}"
    if gain != 0:
        bed_fc += f",volume={fmt_num(gain)}dB"
    bed_fc += "[bed]"
    fc = [bed_fc]
    labels = ["[bed]"]
    ev_report = []
    for i, ev in enumerate(events, start=1):
        if not isinstance(ev, dict) or not ev.get("file"):
            die(f"EPISODE_BUILD_BAD_BED_BUILD: scene '{scene_name}': "
                f"events[{i - 1}] must be an object with a 'file'")
        epath = resolve(ev["file"])
        at = float(ev.get("at_s", 0))
        egain = float(ev.get("gain_db", 0))
        inputs += ["-i", epath]
        ms = int(round(at * 1000))
        fc.append(f"[{i}:a]adelay={ms}|{ms},volume={fmt_num(egain)}dB[e{i}]")
        labels.append(f"[e{i}]")
        ev_report.append({"file": epath, "at_s": at, "gain_db": egain,
                          "role": ev.get("role")})
    fc.append("".join(labels) +
              f"amix=inputs={len(labels)}:normalize=0,"
              f"atrim=0:{fmt_num(dur)}[out]")
    r = run([FF, "-y"] + inputs + ["-filter_complex", ";".join(fc),
                                   "-map", "[out]", "-ar", "48000", out_wav])
    if r.returncode != 0:
        die(f"EPISODE_BUILD_BED_BUILD_FAILED: scene '{scene_name}': "
            f"ffmpeg bed build failed:\n{r.stderr[-1200:]}", code=1)
    return {"source": "build", "base": base, "duration_s": dur,
            "base_gain_db": gain, "events": ev_report, "file": out_wav}


def main():
    global SPEC_DIR
    ap = argparse.ArgumentParser(
        description="Assemble a finished episode MP4 from an episode spec.")
    ap.add_argument("spec", help="episode spec JSON file")
    ap.add_argument("-o", "--output", required=True, help="output .mp4 path")
    ap.add_argument("--workdir", default=None,
                    help="intermediates folder (default: <output>.work/)")
    ap.add_argument("--report", default=None,
                    help="build report JSON path "
                         "(default: <output>.build-report.json)")
    args = ap.parse_args()

    try:
        spec = json.load(open(args.spec))
    except Exception as e:
        die(f"cannot read spec {args.spec}: {e}")
    if not isinstance(spec, dict):
        die("spec must be a JSON object")
    scenes = spec.get("scenes")
    if not isinstance(scenes, list) or not scenes:
        die("spec.scenes must be a non-empty array")
    SPEC_DIR = os.path.dirname(os.path.abspath(args.spec))

    if not os.path.exists(COMPOSITE_SHOT):
        die(f"EPISODE_BUILD_MISSING_TOOL: composite_shot.py not found "
            f"next to episode_build.py (looked for {COMPOSITE_SHOT})")

    out = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    workdir = os.path.abspath(args.workdir) if args.workdir else out + ".work"
    os.makedirs(workdir, exist_ok=True)
    report_path = (os.path.abspath(args.report) if args.report
                   else out + ".build-report.json")

    report = {
        "tool": "episode_build.py",
        "episode": spec.get("episode"),
        "spec": os.path.abspath(args.spec),
        "output": out,
        "workdir": workdir,
        "status": "RUNNING",
        "cuts": [],
        "scenes": [],
        "flags": [],
        "finish": {"target": {"integrated_lufs": TARGET_I,
                              "true_peak_dbtp": TARGET_TP,
                              "lra": TARGET_LRA}},
        "gate": {},
        "error": None,
    }

    def emit(code):
        # The report is written on EVERY exit path, success or halt,
        # and printed to stdout - the neighbour convention.
        with open(report_path, "w") as f:
            json.dump(report, f, indent=2)
        print(json.dumps(report, indent=2))
        sys.exit(code)

    def halt(name, msg, code=1):
        report["status"] = "HALTED"
        report["error"] = {"name": name, "message": msg}
        print(f"episode_build: error: {name}: {msg}", file=sys.stderr)
        if os.path.exists(out):
            os.remove(out)
        emit(code)

    # ---- validate the spec & read every shot spec up front ---------
    # A bad spec fails BEFORE any rendering starts (composite_shot.py
    # validates its own spec the same way, up front).
    plan = []  # [{scene, scene_idx, cut_id, shot_path, shot_spec, dur}]
    any_bed = False
    for si, scene in enumerate(scenes):
        if not isinstance(scene, dict):
            die(f"scenes[{si}] must be an object")
        sname = scene.get("name", f"scene-{si + 1}")
        cuts = scene.get("cuts")
        if not isinstance(cuts, list) or not cuts:
            die(f"scene '{sname}': cuts must be a non-empty array")
        bed = scene.get("audio_bed")
        if bed is not None:
            any_bed = True
            if not (isinstance(bed, dict) and
                    ("file" in bed or "build" in bed)):
                die(f"scene '{sname}': audio_bed must be "
                    '{"file": <wav>}, {"build": {...}}, or null')
        for ci, cut in enumerate(cuts):
            if not isinstance(cut, dict) or not cut.get("shot"):
                die(f"scene '{sname}' cuts[{ci}] must be an object "
                    "with a 'shot' path")
            shot_path = resolve(cut["shot"])
            try:
                shot_spec = json.load(open(shot_path))
            except Exception as e:
                die(f"scene '{sname}' cut '{cut.get('id', ci)}': cannot "
                    f"read shot spec {shot_path}: {e}")
            dur = shot_spec.get("duration_s")
            if not isinstance(dur, (int, float)) or dur <= 0:
                die(f"scene '{sname}' cut '{cut.get('id', ci)}': shot "
                    "spec duration_s must be a positive number")
            plan.append({"scene": sname, "scene_idx": si,
                         "cut_id": str(cut.get("id", f"{ci + 1:02d}")),
                         "shot_path": shot_path, "shot_spec": shot_spec,
                         "duration_s": float(dur)})

    # ---- step 1: render every cut via composite_shot.py ------------
    for p in plan:
        cut_out = os.path.join(
            workdir, f"scene{p['scene_idx'] + 1:02d}-cut{p['cut_id']}.mp4")
        r = run([sys.executable, COMPOSITE_SHOT, p["shot_path"],
                 "-o", cut_out])
        entry = {"scene": p["scene"], "cut": p["cut_id"],
                 "shot_spec": p["shot_path"],
                 "duration_s": p["duration_s"], "output": cut_out}
        if r.returncode != 0 or not os.path.exists(cut_out):
            entry["status"] = "FAILED"
            entry["stderr_tail"] = r.stderr.strip()[-600:]
            report["cuts"].append(entry)
            halt("EPISODE_BUILD_CUT_FAILED",
                 f"cut {p['cut_id']} of scene '{p['scene']}' failed to "
                 f"render via composite_shot.py (exit {r.returncode}): "
                 f"{r.stderr.strip()[-400:]}")
        try:
            entry["composite_report"] = json.loads(r.stdout)
        except Exception:
            entry["composite_report"] = None
            entry["note"] = ("composite_shot.py exited 0 but its stdout "
                              "was not JSON; render kept, report raw")
            entry["composite_stdout_tail"] = r.stdout.strip()[-600:]
        pb = probe(cut_out)
        entry["has_audio"] = astream(pb) is not None
        measured = duration_of(pb)
        if measured is not None:
            entry["measured_duration_s"] = round(measured, 3)
        entry["status"] = "ok"
        p["rendered"] = cut_out
        report["cuts"].append(entry)

    # ---- step 2: concatenate the cut video in spec order -----------
    list_path = os.path.join(workdir, "concat-list.txt")
    with open(list_path, "w") as f:
        for p in plan:
            f.write("file '%s'\n" % p["rendered"].replace("'", "'\\''"))
    video_only = os.path.join(workdir, "video-only.mp4")
    r = run([FF, "-y", "-f", "concat", "-safe", "0", "-i", list_path,
             "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
             "-pix_fmt", "yuv420p", "-r", "24", video_only])
    if r.returncode != 0:
        halt("EPISODE_BUILD_CONCAT_FAILED",
             f"ffmpeg concat failed:\n{r.stderr[-1200:]}")
    total_dur = sum(p["duration_s"] for p in plan)

    # ---- step 3: assemble the episode audio track -------------------
    scene_offsets, off = [], 0.0
    for si, scene in enumerate(scenes):
        sdur = sum(p["duration_s"] for p in plan if p["scene_idx"] == si)
        scene_offsets.append((off, sdur))
        off += sdur

    episode_raw = os.path.join(workdir, "episode-audio-raw.wav")
    have_audio = False
    if any_bed:
        # Bed mode: episode audio comes from the scene beds. Any audio
        # a rendered cut carries is superseded - flagged, never mixed.
        superseded = [f"{c['scene']}/{c['cut']}" for c in report["cuts"]
                      if c.get("has_audio")]
        if superseded:
            report["flags"].append(
                "CUT AUDIO SUPERSEDED BY SCENE BEDS: rendered cuts "
                + ", ".join(superseded)
                + " carry audio; the scene beds are the episode audio "
                  "by spec, so the cut audio is not mixed in.")
        inputs, fc, labels = [], [], []
        for si, scene in enumerate(scenes):
            sname = scene.get("name", f"scene-{si + 1}")
            soff, sdur = scene_offsets[si]
            bed = scene.get("audio_bed")
            srep = {"name": sname, "offset_s": soff, "duration_s": sdur}
            if bed is None:
                # Silent scene: an explicit silence segment keeps the
                # scene offsets honest instead of collapsing the track.
                inputs += ["-f", "lavfi", "-i",
                           "anullsrc=r=48000:cl=stereo"]
                srep["audio_bed"] = {"source": "silence",
                                     "note": "scene declares no bed; "
                                             "silence segment inserted "
                                             "to hold the scene offset"}
                report["flags"].append(
                    f"SILENT SCENE: '{sname}' declares no audio bed; "
                    "silence holds its offset in the episode track.")
            elif "file" in bed:
                bed_path = resolve(bed["file"])
                bpb = probe(bed_path)
                if not astream(bpb):
                    halt("EPISODE_BUILD_BED_NO_AUDIO",
                         f"scene '{sname}': bed file has no audio "
                         f"stream: {bed_path}")
                bdur = duration_of(bpb)
                if bdur is not None and bdur < sdur - 0.05:
                    inputs += ["-stream_loop", "-1", "-i", bed_path]
                    srep["note"] = (f"bed ({bdur:.2f}s) shorter than the "
                                    f"scene ({sdur:.2f}s); looped, "
                                    "then trimmed to the scene length")
                else:
                    inputs += ["-i", bed_path]
                srep["audio_bed"] = {"source": "file", "file": bed_path}
            else:
                bed_wav = os.path.join(workdir, f"scene{si + 1:02d}-bed.wav")
                srep["audio_bed"] = build_bed(bed["build"], sdur,
                                              bed_wav, sname)
                inputs += ["-i", bed_wav]
            ms = int(round(soff * 1000))
            fc.append(f"[{si}:a]atrim=0:{fmt_num(sdur)},"
                      f"asetpts=PTS-STARTPTS,apad=whole_dur={fmt_num(sdur)},"
                      f"atrim=0:{fmt_num(sdur)},adelay={ms}|{ms}[s{si}]")
            labels.append(f"[s{si}]")
            report["scenes"].append(srep)
        fc.append("".join(labels) +
                  f"amix=inputs={len(labels)}:normalize=0,"
                  f"atrim=0:{fmt_num(total_dur)}[out]")
        r = run([FF, "-y"] + inputs + ["-filter_complex", ";".join(fc),
                                       "-map", "[out]", "-ar", "48000",
                                       episode_raw])
        if r.returncode != 0:
            halt("EPISODE_BUILD_BED_MIX_FAILED",
                 f"ffmpeg scene-bed mix failed:\n{r.stderr[-1200:]}")
        have_audio = True
    else:
        # No-bed mode: the episode audio is the cut audio, concatenated.
        silent = [f"{c['scene']}/{c['cut']}" for c in report["cuts"]
                  if not c.get("has_audio")]
        if silent:
            halt("EPISODE_BUILD_NO_AUDIO_SOURCE",
                 "no scene declares an audio bed and cut(s) "
                 + ", ".join(silent)
                 + " rendered without audio - there is no honest "
                   "audio source for them; refusing to fake one")
        r = run([FF, "-y", "-f", "concat", "-safe", "0", "-i", list_path,
                 "-vn", "-ar", "48000", episode_raw])
        if r.returncode != 0:
            halt("EPISODE_BUILD_CUT_AUDIO_CONCAT_FAILED",
                 f"ffmpeg cut-audio concat failed:\n{r.stderr[-1200:]}")
        for si, scene in enumerate(scenes):
            soff, sdur = scene_offsets[si]
            report["scenes"].append(
                {"name": scene.get("name", f"scene-{si + 1}"),
                 "offset_s": soff, "duration_s": sdur,
                 "audio_bed": {"source": "cut-audio",
                               "note": "no bed declared; the rendered "
                                       "cuts' own audio is used"}})
        have_audio = True

    # ---- step 4: two-pass loudnorm finish + mux ----------------------
    if have_audio:
        M = loudness(episode_raw)
        ln = (f"loudnorm=I={fmt_num(TARGET_I)}:TP={fmt_num(TARGET_TP)}:"
              f"LRA={TARGET_LRA}")
        mode = "single-pass (no measurement)"
        if M.get("input_i"):
            ln += (f":measured_I={M['input_i']}:measured_TP={M['input_tp']}"
                   f":measured_LRA={M['input_lra']}"
                   f":measured_thresh={M['input_thresh']}"
                   f":offset={M['target_offset']}")
            if M.get("normalization_type") == "linear":
                ln += ":linear=true"
                mode = "linear (two-pass, measured at target)"
            else:
                ln += ":linear=false"
                mode = "dynamic (two-pass, measured at target)"
                if (M.get("output_i") and
                        abs(float(M["output_i"]) - TARGET_I) > 1.0):
                    report["flags"].append(
                        f"LOUDNESS TARGET NOT REACHABLE: loudnorm "
                        f"predicts {M['output_i']} LUFS for this mix "
                        f"(source integrated {M['input_i']} LUFS, peaks "
                        f"{M['input_tp']} dBTP); the {fmt_num(TARGET_I)} "
                        "LUFS target is reported as missed, not forced.")
        report["finish"]["normalization"] = mode
        report["finish"]["source_measured_lufs"] = M.get("input_i")
        report["finish"]["source_measured_true_peak_dbtp"] = M.get("input_tp")

        # Verify on the ENCODED file (composite_shot.py note 3): mux,
        # measure the MP4, pull down and re-finish if peaks breach the
        # house -0.9 dBTP gate. Max 3 attempts, then report the truth.
        finished_wav = os.path.join(workdir, "episode-audio-finished.wav")
        tmp_out = out + ".tmp.mp4"
        pull, L = 0.0, {}
        for attempt in range(3):
            af = ln if pull == 0.0 else f"{ln},volume=-{fmt_num(pull)}dB"
            r = run([FF, "-y", "-i", episode_raw, "-af", af,
                     "-ar", "48000", finished_wav])
            if r.returncode != 0:
                halt("EPISODE_BUILD_LOUDNORM_FAILED",
                     f"ffmpeg loudnorm pass failed:\n{r.stderr[-1200:]}")
            r = run([FF, "-y", "-i", video_only, "-i", finished_wav,
                     "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                     "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                     "-t", fmt_num(total_dur), tmp_out])
            if r.returncode != 0:
                halt("EPISODE_BUILD_MUX_FAILED",
                     f"ffmpeg mux failed:\n{r.stderr[-1200:]}")
            L = loudness(tmp_out)
            if not L.get("input_tp") or float(L["input_tp"]) <= -0.9:
                break
            pull += float(L["input_tp"]) - TARGET_TP + 0.3
            report["finish"]["peak_pull_down_db_attempted"] = round(pull, 2)
        if L.get("input_tp") and float(L["input_tp"]) > 0.0:
            if os.path.exists(tmp_out):
                os.remove(tmp_out)
            halt("EPISODE_BUILD_CLIPPED",
                 f"loudnorm result has true peaks OVER 0 dBTP "
                 f"({L['input_tp']}) even after pull-down retries: "
                 "refusing to ship clipped audio")
        os.replace(tmp_out, out)
        report["finish"]["measured"] = {
            "integrated_lufs": L.get("input_i"),
            "true_peak_dbtp": L.get("input_tp"),
            "lra": L.get("input_lra"),
        }
    else:
        os.replace(video_only, out)
        report["flags"].append(
            "SILENT EPISODE: no audio source in the spec; the output "
            "carries no audio stream and no loudness finish was run.")

    # ---- step 5: measure the finished file & run the gates ----------
    pb = probe(out)
    final_dur = duration_of(pb)
    report["finish"]["duration_s"] = (round(final_dur, 3)
                                      if final_dur is not None else None)
    report["finish"]["expected_duration_s"] = total_dur
    finish_gates = {
        "duration_matches_spec": (
            final_dur is not None and abs(final_dur - total_dur) <= 0.5),
    }
    meas = report["finish"].get("measured", {})
    if meas.get("integrated_lufs"):
        finish_gates["loudness_within_1LU"] = (
            abs(float(meas["integrated_lufs"]) - TARGET_I) <= 1.0)
        finish_gates["true_peak_ok"] = float(meas["true_peak_dbtp"]) <= -0.9
    report["gate"]["finish_gates"] = finish_gates

    gate_info = {"tool": "episode_gate.py", "invoked": False}
    if os.path.exists(EPISODE_GATE):
        gate_info["invoked"] = True
        r = run([sys.executable, EPISODE_GATE])
        gate_info["exit_code"] = r.returncode
        gate_info["stdout"] = r.stdout.strip()
        if r.returncode != 0:
            gate_info["stderr_tail"] = r.stderr.strip()[-600:]
            report["flags"].append(
                "EPISODE GATE ERRORED: episode_gate.py exited "
                f"{r.returncode}; its output is recorded in "
                "gate.episode_gate and the error is reported, "
                "not hidden.")
    else:
        gate_info["note"] = ("episode_gate.py not found next to "
                             "episode_build.py; finish gates still run")
        report["flags"].append(
            "EPISODE GATE NOT RUN: episode_gate.py missing from this "
            "folder; the report carries the finish gates only.")
    report["gate"]["episode_gate"] = gate_info

    report["gate"]["verdict"] = (
        "PASS" if all(v is True for v in finish_gates.values())
        else "CHECK " + str(finish_gates))
    report["status"] = "COMPLETE"
    emit(0)


if __name__ == "__main__":
    main()
