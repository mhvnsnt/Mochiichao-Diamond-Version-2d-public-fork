#!/usr/bin/env python3
"""Independent proof-clip verification for the EP01 rebuild.

Measures a candidate proof clip WITHOUT trusting the producing
lane's numbers:
  - ffprobe spec (codec, size, fps, frames, duration)
  - mean absolute frame-to-frame difference over ALL consecutive
    frames (native res, grayscale, 0-255 scale). CALIBRATED on
    this exact metric 2026-10-28 (selftest-*.json beside the
    script) — do not mix with the gen lane's sampled-frame RGB
    numbers (floor 1.2 / bundles 19-34 on THAT scale):
      true still (Forest plate):            0.005
      Storyboard Draft 1 excerpt (stills):  0.473  (91.9% pairs near-identical)
      PR #389 Dorowani idle (real motion):  4.50   (3.1% pairs near-identical)
  - fraction of frame pairs that are near-identical (diff < 0.5),
    which exposes held/stills footage even when a few cuts move
  - TIMING PROFILE (added 2026-10-28, THE BAR programme — see
    show/production/animation-method/TIMING-STANDARD.md): the
    hold-length structure of the clip on this same metric.
    A frame pair with diff < 0.5 counts as a HOLD (the drawing
    did not change); a pair at or above it is a CHANGE point.
    From the run-lengths of held spans the profile reports:
      * hold-length distribution (how many spans of each length)
      * effective unique drawings per second (spans / duration)
      * grid fit: what fraction of change boundaries land on
        multiples of 2 and of 3 frames (the 2s and 3s grids)
      * the longest internal hold (a hold that touches neither
        the first nor the last frame — whether the subject was
        *meant* to be moving during it is read off the timing
        chart by a reviewer, never by this script)
      * accent candidates: isolated 1-frame spans bounded by
        changes on both sides (the shape of a 1s accent/smear)
      * sub-threshold drift: pairs that changed but stayed
        under the hold threshold (held drawings do not drift)
      * below-bar signature flags: interpolation_profile
        (continuous per-frame change, no held drawings) and
        uniform_unmodulated_rate (one rate, whole clip, no
        accents) — the two signatures TIMING-STANDARD.md names
        as below the bar
    Hold lengths are FRAMES PER DRAWING at a 24 fps master; the
    profile always also prints effective DRAWINGS PER SECOND
    (3 frames/drawing = 8/sec, 2 = 12/sec, 1 = 24/sec).
    The profile REPORTS measurements only. It never passes or
    fails a clip: the grade is the correct character performing
    the action, judged by the owner/scorer (grading law).
  - sha256 + byte size for the presentation record

Usage: verify_proof.py <clip.mp4> [--json-out result.json]
       [--register scene|credits]
Exit 0 always (this measures; the gate verdict is the owner's).

HEADLINE OUTPUT (owner's unit rule, 2026-10-28): the profile's
headline is the clip's MEASURED effective NEW DRAWINGS PER
SECOND, with its class printed plainly: at or below ~3/sec is
the FAILED class (the storyboard signature); an interpolation
signature is also FAILED class (its changes are noise, not
authored drawings); below the declared register's floor
(scene 12/sec, credits 8/sec) is BELOW BAR. The headline is
also printed to stderr for humans; the JSON carries it as
timing_profile.headline.
"""
import hashlib, json, subprocess, sys
from pathlib import Path

import numpy as np

FLOOR_SLIDESHOW = 0.473   # Storyboard Draft 1 excerpt, this metric
ACCEPTED_BAND = (4.5, 4.5)  # PR #389 Dorowani idle, this metric (single point so far)
HOLD_THRESHOLD = 0.5      # frame-pair diff under this = the drawing held


def ffprobe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration,size", "-show_entries",
         "stream=codec_name,width,height,avg_frame_rate,nb_frames",
         "-of", "json", str(path)],
        capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def frame_diffs(path):
    # Decode to raw gray frames via ffmpeg pipe; stream, don't load all.
    probe = ffprobe(path)
    v = next(s for s in probe["streams"] if "width" in s)
    w, h = v["width"], v["height"]
    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf", "format=gray",
         "-f", "rawvideo", "-"],
        stdout=subprocess.PIPE)
    frame_bytes = w * h
    prev, diffs, identical = None, [], 0
    while True:
        buf = proc.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        cur = np.frombuffer(buf, dtype=np.uint8).astype(np.float32)
        if prev is not None:
            d = float(np.mean(np.abs(cur - prev)))
            diffs.append(d)
            if d < HOLD_THRESHOLD:
                identical += 1
        prev = cur
    proc.wait()
    return diffs, identical


REGISTER_FLOORS = {"scene": 12.0, "credits": 8.0}


def timing_profile(diffs, duration_s, register=None):
    """Hold-run structure of the clip from its frame-pair diffs.

    diffs[i] is the change between frame i and frame i+1 (0-based).
    A run (span) is a maximal set of consecutive frames joined by
    sub-threshold diffs; its length is its frame count.
    """
    n_frames = len(diffs) + 1
    spans = []            # (start_frame, length)
    start, length = 0, 1
    for i, d in enumerate(diffs):
        if d < HOLD_THRESHOLD:
            length += 1
        else:
            spans.append((start, length))
            start, length = i + 1, 1
    spans.append((start, length))

    def bucket(n):
        if n <= 6:
            return str(n)
        if n <= 11:
            return "7-11"
        if n <= 23:
            return "12-23"
        return "24+"

    hist = {}
    for _, ln in spans:
        hist[bucket(ln)] = hist.get(bucket(ln), 0) + 1
    hist = {k: hist[k] for k in sorted(hist, key=lambda x: (len(x), x))}

    def grid_fit(g):
        bounds = [s for s, _ in spans if s > 0]
        if not bounds:
            return None
        on = sum(1 for s in bounds if s % g == 0)
        return round(on / len(bounds), 4)

    def grid_fit_best_phase(g):
        # A clip may start mid-cycle, so its boundaries can sit on
        # the grid at a constant phase offset. Report the modal
        # offset and the fraction of boundaries that share it —
        # that fraction is the grid-consistency measure; the
        # absolute fit above is reported alongside, not instead.
        bounds = [s for s, _ in spans if s > 0]
        if not bounds:
            return None, None
        offs = {}
        for s in bounds:
            offs[s % g] = offs.get(s % g, 0) + 1
        best = max(offs, key=lambda k: offs[k])
        return best, round(offs[best] / len(bounds), 4)

    internal = [(s, ln) for s, ln in spans if s > 0 and s + ln < n_frames]
    longest_internal = max(internal, key=lambda t: t[1]) if internal else (None, 0)
    longest = max(spans, key=lambda t: t[1]) if spans else (0, 0)

    accents = [s for s, ln in spans
               if ln == 1 and 0 < s and s + ln < n_frames][:50]

    changed = [d for d in diffs if d >= HOLD_THRESHOLD]
    drift = [d for d in diffs if 0.0 < d < HOLD_THRESHOLD]

    # Pacing metrics (THE BAR programme, owner pacing verdict
    # 2026-10-28): retention is a production criterion. A near-
    # static run is a maximal span of frames joined by sub-
    # threshold pairs — the same spans as above, read as pacing.
    change_idx = [i for i, d in enumerate(diffs) if d >= HOLD_THRESHOLD]
    if duration_s:
        change_per_10s = round(len(change_idx) / duration_s * 10, 2)
    else:
        change_per_10s = None
    # Minimum change events in any rolling 10-second window
    # (windows stepped 1 second; only when the clip is >= 10 s).
    min_window = None
    win = 240  # 10 s of frame pairs at 24 fps
    if len(diffs) >= win:
        counts = []
        starts = list(range(0, len(diffs) - win + 1, 24))
        for st in starts:
            counts.append(sum(1 for i in change_idx if st <= i < st + win))
        min_window = min(counts) if counts else None
    pacing = {
        "longest_near_static_run_frames": longest[1],
        "longest_near_static_run_seconds": round(longest[1] / 24.0, 2),
        "longest_near_static_run_at_frame": longest[0],
        "change_events_total": len(change_idx),
        "change_events_per_10s": change_per_10s,
        "min_change_events_in_any_10s_window": min_window,
        "note": "Pacing measurements only. Whether a long near-static run is a "
                "charted dramatic hold or dead air is read against the timing "
                "chart by a reviewer (TIMING-STANDARD.md, pacing section).",
    }

    # Below-bar signatures (THE BAR programme, owner correction
    # 2026-10-28). These are measured signatures, named so a
    # reviewer sees them at a glance — they are not a verdict.
    # Units, always: hold lengths are FRAMES PER DRAWING at a
    # 24 fps master; the rate that matters on screen is new
    # drawings per second (3 frames/drawing = 8 drawings/sec,
    # 2 = 12/sec, 1 = 24/sec — full animation, the most work).
    n_spans = max(len(spans), 1)
    one_frame_share = sum(1 for _, ln in spans if ln == 1) / n_spans
    modal_len, modal_count = (0, 0)
    for _, ln in spans:
        c = sum(1 for _, l2 in spans if l2 == ln)
        if c > modal_count:
            modal_len, modal_count = ln, c
    modal_share = modal_count / n_spans
    near_identical_frac = (sum(1 for d in diffs if d < HOLD_THRESHOLD)
                           / len(diffs)) if diffs else 0.0
    flags = {
        "interpolation_profile": bool(one_frame_share >= 0.8
                                      and near_identical_frac < 0.3),
        "interpolation_profile_basis": {
            "one_frame_span_share": round(one_frame_share, 4),
            "near_identical_frac": round(near_identical_frac, 4)},
        "uniform_unmodulated_rate": bool(duration_s and duration_s >= 4.0
                                         and near_identical_frac >= 0.3
                                         and modal_share >= 0.95
                                         and not accents),
        "uniform_unmodulated_basis": {
            "modal_hold_frames_per_drawing": modal_len,
            "modal_span_share": round(modal_share, 4),
            "accent_candidates": len(accents)},
        "note": "A flag names a below-bar SIGNATURE (see TIMING-STANDARD.md): "
                "interpolation_profile = continuous per-frame change with no "
                "held drawings (the v1 signature); uniform_unmodulated_rate = "
                "held material at one rate for its whole length with no "
                "accent (a plain cycle LOOP under 4 s does not raise it — "
                "uniformity is judged at scene/instance scale). The grade "
                "of a clip remains the owner's/scorer's call.",
    }
    # HEADLINE (owner's unit rule, 2026-10-28): the headline number
    # for a clip is its MEASURED effective NEW DRAWINGS PER SECOND
    # — distinct authored drawings/sec from the span structure,
    # not frame-diff noise. Classes, printed plainly:
    #   * at or below ~3/sec  -> FAILED class (storyboard signature)
    #   * interpolation signature -> FAILED class (its per-frame
    #     changes are interpolation noise, not authored drawings,
    #     however high the raw change count runs)
    #   * below the declared register's floor -> BELOW BAR
    # Floors: scene body 12/sec in moving passages; credits (ED /
    # chibi register) 8/sec. Action accents run at 24/sec.
    eff_rate = (len(spans) / duration_s) if duration_s else None
    if flags["interpolation_profile"]:
        headline_class = ("FAILED class - interpolation signature: the "
                          "frame changes are interpolation noise, not "
                          "authored drawings")
    elif eff_rate is not None and eff_rate <= 3.0:
        headline_class = ("FAILED class - storyboard signature: at or "
                          "below ~3 new drawings per second")
    elif register in REGISTER_FLOORS:
        floor = REGISTER_FLOORS[register]
        if eff_rate is not None and eff_rate < floor:
            headline_class = ("BELOW BAR - under the %s floor of %g new "
                              "drawings per second" % (register, floor))
        else:
            headline_class = ("at or above the %s rate floor (%g new "
                              "drawings/sec) - rate only; grading is the "
                              "reviewer's call" % (register, floor))
    else:
        headline_class = ("no register declared - FAILED-class checks "
                          "applied; no floor verdict")
    headline = {
        "effective_new_drawings_per_second": round(eff_rate, 3) if eff_rate is not None else None,
        "register": register,
        "register_floor_new_drawings_per_second": REGISTER_FLOORS.get(register),
        "class": headline_class,
        "note": "Headline unit is NEW DRAWINGS PER SECOND (the owner's "
                "unit). A low figure is a failure signature, never an "
                "achievement or a style (TIMING-STANDARD.md).",
    }

    return {
        "headline": headline,
        "threshold": HOLD_THRESHOLD,
        "frames": n_frames,
        "spans_unique_drawings": len(spans),
        "effective_drawings_per_second": round(len(spans) / duration_s, 3) if duration_s else None,
        "hold_length_distribution": hist,
        "grid_fit_boundaries_on_2s": grid_fit(2),
        "grid_fit_boundaries_on_3s": grid_fit(3),
        "grid_fit_3s_best_phase_offset": grid_fit_best_phase(3)[0],
        "grid_fit_3s_best_phase_frac": grid_fit_best_phase(3)[1],
        "grid_fit_2s_best_phase_offset": grid_fit_best_phase(2)[0],
        "grid_fit_2s_best_phase_frac": grid_fit_best_phase(2)[1],
        "longest_hold_frames": longest[1],
        "longest_hold_at_frame": longest[0],
        "longest_hold_seconds": round(longest[1] / 24.0, 3),
        "longest_internal_hold_frames": longest_internal[1],
        "longest_internal_hold_at_frame": longest_internal[0],
        "accent_candidates_1f_spans": len([1 for s, ln in spans
                                           if ln == 1 and 0 < s and s + ln < n_frames]),
        "accent_candidate_frames": accents,
        "subthreshold_drift_pairs": len(drift),
        "subthreshold_drift_frac": round(len(drift) / len(diffs), 4) if diffs else 0,
        "median_diff_on_change_pairs": round(float(np.median(changed)), 3) if changed else 0,
        "below_bar_signatures": flags,
        "pacing": pacing,
        "note": "Measurements only — no verdict. Whether a long internal hold is a "
                "composed hold or a freeze is read against the timing chart by a reviewer.",
    }


def main():
    clip = Path(sys.argv[1])
    assert clip.exists(), f"no such file: {clip}"
    data = clip.read_bytes()
    diffs, identical = frame_diffs(clip)
    mean_diff = sum(diffs) / len(diffs) if diffs else 0.0
    probe = ffprobe(clip)
    duration = float(probe["format"]["duration"])
    result = {
        "clip": str(clip),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "ffprobe": probe,
        "frame_pairs": len(diffs),
        "mean_frame_diff": round(mean_diff, 3),
        "median_frame_diff": round(float(np.median(diffs)), 3) if diffs else 0,
        "near_identical_pairs": identical,
        "near_identical_frac": round(identical / len(diffs), 4) if diffs else 0,
        "timing_profile": timing_profile(
            diffs, duration,
            register=(sys.argv[sys.argv.index("--register") + 1]
                      if "--register" in sys.argv else None)),
        "references": {
            "slideshow_floor": FLOOR_SLIDESHOW,
            "accepted_bundle_band": ACCEPTED_BAND,
        },
        "reads_as_real_motion": mean_diff > 2.0 and identical / max(len(diffs), 1) < 0.5,
        "verdict": "MEASURED — owner viewing decides; this script promotes nothing",
    }
    _h = result["timing_profile"]["headline"]
    print("HEADLINE: %s new drawings/sec - %s"
          % (_h["effective_new_drawings_per_second"], _h["class"]),
          file=sys.stderr)
    print(json.dumps(result, indent=2))
    if "--json-out" in sys.argv:
        out = sys.argv[sys.argv.index("--json-out") + 1]
        Path(out).write_text(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
