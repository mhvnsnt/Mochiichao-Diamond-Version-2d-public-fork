#!/usr/bin/env python3
"""composite_shot.py - headless FFmpeg shot compositor (episode assembly seat).

Generalises the hand-run Garden Gate proof composites into a reusable
tool: give it a shot spec (one background + transparent character WebM
twins + one audio source) and it renders the composited shot MP4,
loudness-normalised to the house finish standard (-14 LUFS / -1 dBTP,
two-pass loudnorm with measured values, same approach as
scene_audio_bed.py). Build scene by scene with audio attached, per
UNIFIED-PIPELINE.

Usage:
    composite_shot.py <shot.json> -o <output.mp4>

Shot spec JSON:
    {
      "background": "path/or/repo-relative/background.mp4",
      "duration_s": 8,
      "layers": [
        {"clip": "dorowani-idle.transparent.webm",
         "x": 280, "y": 40, "scale": 1.0, "start_s": 0, "loop": true}
      ],
      "audio": "background",
      "wind_or_bed_gain": -8
    }

  background   Video (looped/trimmed to duration_s) or a still image
               (held for the full duration). Relative paths resolve
               against the CWD first, then the repo root.
  layers       Character clips composited in array order. Each clip
               MUST carry an alpha channel (yuva pix_fmt, or a WebM
               stream tagged alpha_mode=1) - a clip without alpha is a
               hard error, never a silent white-box composite.
               x/y = top-left placement in background pixels,
               scale = size multiplier (default 1.0),
               start_s = when the character enters (default 0),
               loop = loop the clip if it is shorter than the rest of
               the shot (default true; false = character leaves when
               the clip ends).
  audio        "background" (the background's own audio track - the
               living Gate background carries its wind bed there),
               a path to an audio file, or null for a silent shot.
               Legacy alias: "audio_bed": <path> (or null = background).
  wind_or_bed_gain  Optional gain in dB applied to the audio before
               loudnorm (e.g. -8 to sit a wind bed under a scene).

VP9 alpha note (measured 2026-10-27): ffprobe reports the shipped
twins as pix_fmt yuv420p and the native VP9 decoder SILENTLY DROPS
their alpha (the alpha lives in WebM BlockAdditional data, tagged
alpha_mode=1). This tool therefore detects alpha via the tag as well
as the pix_fmt, and forces the libvpx-vp9 / libvpx decoders for
VP9/VP8 layer inputs so the overlay sees real transparency.

Output: H.264 MP4 (yuv420p, CRF 18) + AAC 48 kHz when audio is
present. A JSON report is printed to stdout. Failures (missing file,
non-alpha clip, bad spec, ffmpeg error) exit non-zero with the reason
on stderr and leave NO output file behind - a partial render is never
presented as success.

Loudnorm honesty notes (both measured 2026-10-27 on the Gate bed):
(1) The analysis pass runs AT the target settings. target_offset is
relative to the analysis target; harvesting measured values under
loudnorm's defaults (I=-24) and replaying them into an I=-14 pass -
the naive two-pass form - made loudnorm apply ~+20 dB of unplanned
gain and produce +3.8 dBTP clipped peaks. (2) Some material cannot
reach -14 LUFS at all: the living Gate background's wind bed
measures -56 LUFS integrated with peaks already at -14 dBTP, and
loudnorm itself predicts only ~-37 LUFS out. The report states the
achieved loudness and flags the miss; the tool never forces a
number, and a result with true peaks over 0 dBTP is rejected.
(3) The AAC encode is part of the measurement: on the gained wind
bed the pre-encode PCM peaked at -0.62 dBTP while the encoded MP4
measured +3.89 dBTP (codec reconstruction overshoot on LF-heavy,
dynamically-gained content). Pass 2 therefore verifies true peaks
on the ENCODED file and re-runs with a measured pull-down when the
house -0.9 dBTP gate is breached.
"""
import argparse, json, os, re, subprocess, sys

FF = "ffmpeg"
PROBE = "ffprobe"
TARGET_I, TARGET_TP, TARGET_LRA = -14.0, -1.0, 11
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                         "..", "..", "..", ".."))
IMAGE_CODECS = {"png", "mjpeg", "bmp", "webp", "avif", "tiff"}
ALPHA_PIX_FMTS = ("yuva", "rgba", "argb", "bgra", "abgr", "gbrap", "ya8")


def die(msg, code=2):
    print(f"composite_shot: error: {msg}", file=sys.stderr)
    sys.exit(code)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def resolve(path):
    if os.path.isabs(path) and os.path.exists(path):
        return path
    for cand in (os.path.join(os.getcwd(), path),
                 os.path.join(REPO_ROOT, path)):
        if os.path.exists(cand):
            return cand
    die(f"file not found: {path} (tried CWD and repo root {REPO_ROOT})")


def probe(path):
    r = run([PROBE, "-v", "error", "-show_streams", "-show_format",
             "-of", "json", path])
    if r.returncode != 0:
        die(f"ffprobe failed on {path}: {r.stderr.strip()[-300:]}")
    return json.loads(r.stdout)


def vstream(pb):
    for s in pb.get("streams", []):
        if s.get("codec_type") == "video":
            return s
    return None


def astream(pb):
    for s in pb.get("streams", []):
        if s.get("codec_type") == "audio":
            return s
    return None


def duration_of(pb):
    d = pb.get("format", {}).get("duration")
    if d not in (None, "N/A"):
        return float(d)
    vs = vstream(pb)
    if vs and vs.get("duration") not in (None, "N/A"):
        return float(vs["duration"])
    return None


def has_alpha(vs):
    pix = vs.get("pix_fmt", "")
    if any(tok in pix for tok in ALPHA_PIX_FMTS):
        return True
    # WebM VP9/VP8 alpha: stored out-of-band, tagged on the stream.
    return vs.get("tags", {}).get("alpha_mode") == "1"


def decoder_opts(vs):
    # Native VP9/VP8 decoding discards WebM alpha; libvpx keeps it.
    if vs.get("codec_name") == "vp9":
        return ["-c:v", "libvpx-vp9"]
    if vs.get("codec_name") == "vp8":
        return ["-c:v", "libvpx"]
    return []


def loudness(path):
    """Two-pass loudnorm measurement, analysed AT the target settings.

    Deliberate deviation from scene_audio_bed.py's bare-loudnorm
    analysis, measured 2026-10-27: target_offset is relative to the
    analysis target. Harvesting measured values under loudnorm's
    DEFAULTS (I=-24) and replaying them into an I=-14 pass made
    loudnorm apply ~+20 dB of unplanned gain to the Gate wind bed
    and ship +3.8 dBTP clipped peaks. Analysed at the real target,
    the same bed normalises sanely (loudnorm predicts -37.5 LUFS:
    -14 is physically unreachable for it, and says so up front).
    """
    r = run([FF, "-i", path, "-af",
             f"loudnorm=I={fmt_num(TARGET_I)}:TP={fmt_num(TARGET_TP)}:"
             f"LRA={TARGET_LRA}:print_format=json",
             "-f", "null", "-"])
    blocks = re.findall(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    return json.loads(blocks[-1]) if blocks else {}


def fmt_num(x):
    return f"{x:g}"


def main():
    ap = argparse.ArgumentParser(description="Composite one shot from a spec JSON.")
    ap.add_argument("spec", help="shot spec JSON file")
    ap.add_argument("-o", "--output", required=True, help="output .mp4 path")
    args = ap.parse_args()

    try:
        spec = json.load(open(args.spec))
    except Exception as e:
        die(f"cannot read spec {args.spec}: {e}")
    if not isinstance(spec, dict):
        die("spec must be a JSON object")
    dur = spec.get("duration_s")
    if not isinstance(dur, (int, float)) or dur <= 0:
        die("spec.duration_s must be a positive number")
    dur = float(dur)

    # ---- background -------------------------------------------------
    if not spec.get("background"):
        die("spec.background is required")
    bg_path = resolve(spec["background"])
    bg_pb = probe(bg_path)
    bg_vs = vstream(bg_pb)
    if not bg_vs:
        die(f"background has no video stream: {bg_path}")
    bg_dur = duration_of(bg_pb)
    is_still = bg_vs.get("codec_name") in IMAGE_CODECS or bg_dur is None

    inputs, layer_info = [], []
    if is_still:
        inputs += ["-loop", "1", "-framerate", "24", "-i", bg_path]
    elif bg_dur < dur - 0.05:
        inputs += ["-stream_loop", "-1", "-i", bg_path]
    else:
        inputs += ["-i", bg_path]

    # ---- layers ------------------------------------------------------
    layers = spec.get("layers", [])
    if not isinstance(layers, list):
        die("spec.layers must be an array")
    fc = [f"[0:v]trim=duration={fmt_num(dur)},setpts=PTS-STARTPTS,fps=24[bg]"]
    prev = "[bg]"
    for i, layer in enumerate(layers):
        if not isinstance(layer, dict) or not layer.get("clip"):
            die(f"layers[{i}] must be an object with a 'clip' path")
        clip_path = resolve(layer["clip"])
        pb = probe(clip_path)
        vs = vstream(pb)
        if not vs:
            die(f"layer clip has no video stream: {clip_path}")
        if not has_alpha(vs):
            die(f"layer clip has NO alpha channel (pix_fmt={vs.get('pix_fmt')}, "
                f"alpha_mode={vs.get('tags', {}).get('alpha_mode')}): {clip_path} - "
                "refusing to composite an opaque clip as a character layer")
        try:
            x = int(layer.get("x", 0)); y = int(layer.get("y", 0))
            scale = float(layer.get("scale", 1.0))
            start = float(layer.get("start_s", 0))
        except (TypeError, ValueError):
            die(f"layers[{i}]: x/y/scale/start_s must be numbers")
        if scale <= 0:
            die(f"layers[{i}].scale must be > 0")
        if start < 0 or start >= dur:
            die(f"layers[{i}].start_s ({start}) outside shot duration ({dur})")
        loop = layer.get("loop", True)
        clip_dur = duration_of(pb)
        opts = decoder_opts(vs)
        if loop and (clip_dur is None or clip_dur < (dur - start) - 0.05):
            opts += ["-stream_loop", "-1"]
        inputs += opts + ["-i", clip_path]
        idx = i + 1
        fc.append(
            f"[{idx}:v]fps=24,"
            f"scale=trunc(iw*{fmt_num(scale)}/2)*2:trunc(ih*{fmt_num(scale)}/2)*2:flags=lanczos,"
            f"format=yuva420p,"
            f"tpad=start_duration={fmt_num(start)}:start_mode=add:color=black@0.0,"
            f"setpts=PTS-STARTPTS[fg{i}]")
        fc.append(f"{prev}[fg{i}]overlay={x}:{y}:eof_action=pass[v{i}]")
        prev = f"[v{i}]"
        layer_info.append({"clip": clip_path, "x": x, "y": y, "scale": scale,
                           "start_s": start, "loop": bool(loop),
                           "pix_fmt": vs.get("pix_fmt"),
                           "alpha_mode": vs.get("tags", {}).get("alpha_mode")})
    fc.append(f"{prev}format=yuv420p[vout]")

    # ---- audio --------------------------------------------------------
    audio_src = None  # None = silent shot
    if "audio" in spec:
        a = spec["audio"]
        if a is None:
            audio_src = None
        elif a == "background":
            audio_src = ("background", None)
        elif isinstance(a, str):
            audio_src = ("file", resolve(a))
        else:
            die("spec.audio must be \"background\", a path, or null")
    elif spec.get("audio_bed"):
        audio_src = ("file", resolve(spec["audio_bed"]))
    else:
        audio_src = ("background", None)

    audio_report = {"source": "none"}
    if audio_src is not None:
        kind, apath = audio_src
        if kind == "background":
            if not astream(bg_pb):
                die("audio source is 'background' but the background has "
                    f"no audio stream: {bg_path}")
            aidx, audio_report = 0, {"source": "background"}
        else:
            apb = probe(apath)
            if not astream(apb):
                die(f"audio file has no audio stream: {apath}")
            adur = duration_of(apb)
            aidx = len(layers) + 1
            if adur is None or adur < dur - 0.05:
                inputs += ["-stream_loop", "-1", "-i", apath]
            else:
                inputs += ["-i", apath]
            audio_report = {"source": apath}
        gain = spec.get("wind_or_bed_gain")
        af = f"[{aidx}:a]atrim=0:{fmt_num(dur)},asetpts=PTS-STARTPTS"
        if gain is not None:
            af += f",volume={fmt_num(float(gain))}dB"
            audio_report["gain_db"] = float(gain)
        af += f",apad=whole_dur={fmt_num(dur)},atrim=0:{fmt_num(dur)}[aout]"
        fc.append(af)

    # ---- pass 1: render ----------------------------------------------
    out = os.path.abspath(args.output)
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    tmp = out + ".tmp.mp4"
    cmd = [FF, "-y"] + inputs + ["-filter_complex", ";".join(fc),
                                 "-map", "[vout]"]
    if audio_src is not None:
        cmd += ["-map", "[aout]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
    cmd += ["-t", fmt_num(dur), "-c:v", "libx264", "-preset", "medium",
            "-crf", "18", "-pix_fmt", "yuv420p", tmp]
    r = run(cmd)
    if r.returncode != 0:
        if os.path.exists(tmp):
            os.remove(tmp)
        die(f"ffmpeg render failed:\n{r.stderr[-1200:]}", code=1)

    # ---- pass 2: two-pass loudnorm to the house target ----------------
    # Analysis ran at the target settings (see loudness()), so the
    # harvested offset belongs to THIS target. loudnorm's own
    # normalization_type prediction picks the mode: "linear" when the
    # material can reach -14 LUFS with a straight gain, "dynamic"
    # when it cannot (the Gate wind bed: -56 LUFS integrated, peaks
    # already at -14 dBTP - loudnorm predicts -37.5 LUFS out, and the
    # report flags the target as not reached rather than forcing it).
    if audio_src is not None:
        M = loudness(tmp)
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
                    audio_report["normalization_note"] = (
                        f"loudnorm predicts {M['output_i']} LUFS for this "
                        f"material (source integrated {M['input_i']} LUFS, "
                        f"peaks {M['input_tp']} dBTP): the "
                        f"{fmt_num(TARGET_I)} LUFS target is not reachable "
                        "without destructive gain; dynamic result reported "
                        "as measured")
                else:
                    audio_report["normalization_note"] = (
                        "loudnorm chose dynamic mode with an on-target "
                        "prediction; achieved loudness reported as measured")
        audio_report["normalization"] = mode
        # Post-encode peak verification (measured 2026-10-27): the
        # AAC encode itself can overshoot - on the gained Gate wind
        # bed the pre-encode PCM peaked at -0.62 dBTP but the encoded
        # MP4 measured +3.89 dBTP. So pass 2 is verified on the
        # ENCODED file, and if true peaks breach the house gate the
        # pass re-runs with the loudnorm output pulled down by the
        # measured overshoot (max 3 attempts), then reports the truth.
        tmp2 = out + ".tmp2.mp4"
        pull, L = 0.0, {}
        for attempt in range(3):
            af2 = ln if pull == 0.0 else f"{ln},volume=-{fmt_num(pull)}dB"
            r = run([FF, "-y", "-i", tmp, "-c:v", "copy", "-af", af2,
                     "-ar", "48000", "-c:a", "aac", "-b:a", "192k", tmp2])
            if r.returncode != 0:
                os.remove(tmp)
                if os.path.exists(tmp2):
                    os.remove(tmp2)
                die(f"ffmpeg loudnorm pass failed:\n{r.stderr[-1200:]}",
                    code=1)
            L = loudness(tmp2)
            if not L.get("input_tp") or float(L["input_tp"]) <= -0.9:
                break
            # Cumulative: each retry adds the still-missing headroom.
            pull += float(L["input_tp"]) - TARGET_TP + 0.3
            audio_report["peak_pull_down_db_attempted"] = round(pull, 2)
        os.remove(tmp)
        os.replace(tmp2, out)
        if L.get("input_tp") and float(L["input_tp"]) > 0.0:
            os.remove(out)
            die(f"loudnorm result has true peaks OVER 0 dBTP "
                f"({L['input_tp']}) even after pull-down retries: "
                "refusing to ship clipped audio", code=1)
        audio_report["pass1_measured_lufs"] = M.get("input_i")
        audio_report["final_lufs"] = L.get("input_i")
        audio_report["final_true_peak_dbtp"] = L.get("input_tp")
        audio_report["target_lufs"] = TARGET_I
        if L.get("input_tp"):
            # House finish gate (scene_audio_bed.py): TP <= -0.9 dBTP.
            audio_report["true_peak_within_house_gate"] = float(L["input_tp"]) <= -0.9
        if L.get("input_i"):
            audio_report["loudness_within_1LU"] = abs(float(L["input_i"]) - TARGET_I) <= 1.0
    else:
        os.replace(tmp, out)

    report = {
        "tool": "composite_shot.py",
        "output": out,
        "duration_s": dur,
        "background": bg_path,
        "background_size": [bg_vs.get("width"), bg_vs.get("height")],
        "layers": layer_info,
        "audio": audio_report,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
